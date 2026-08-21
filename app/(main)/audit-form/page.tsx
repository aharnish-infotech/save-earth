"use client";
import React, { useState, useCallback } from "react";

// ─── SHARED TYPES ─────────────────────────────────────────────────────────────
type Tab = "load-sheet" | "meter-details" | "dg-set";

// ─── BRANCH LOAD SHEET TYPES ──────────────────────────────────────────────────
interface EquipItem {
  id: string; name: string; nos: string; watt: string; tons?: string; optional?: boolean;
}
interface EquipGroup { id: string; label: string; hasAC?: boolean; items: EquipItem[]; }

const mkItem = (id: string, name: string, watt: string, optional = false): EquipItem =>
  ({ id, name, nos: "", watt, optional });
const mkAC = (id: string, name: string, watt: string): EquipItem =>
  ({ id, name, nos: "", watt, tons: "", optional: true });

const INITIAL_GROUPS: EquipGroup[] = [
  { id: "lighting", label: "Lighting Load", items: [
    mkItem("fl2x2","Flush Lights 2X2","36"), mkItem("dl","Down Lights","12"),
    mkItem("tl","Tubelights + GSB T/Ls","40"), mkItem("led","LED Bulbs","15"),
    mkItem("cfl","CFL / PL Lights","23",true), mkItem("panel","LED Panel Lights","18",true),
    mkItem("spot","Spotlights","7",true),
  ]},
  { id: "fans", label: "Fans", items: [
    mkItem("cfan","Ceiling Fans","100"), mkItem("wfan","Wall Fans / Table Fan","80"),
    mkItem("efan","Exhaust Fans","150"), mkItem("blow","Blower","100",true),
    mkItem("afan","Air Circulators","55",true),
  ]},
  { id: "ac", label: "AC / Air Conditioning", hasAC: true, items: [
    mkAC("sac","Split AC","1500"), mkAC("cac","Cassette AC","2000"),
    mkAC("wac","Window AC","1200"), mkAC("vrf","VRF / VRV AC","1800"),
  ]},
  { id: "computers", label: "Computer / IT Equipment", items: [
    mkItem("desk","Desktop Computers","200"), mkItem("lap","Laptops","65"),
    mkItem("monit","Monitors","30"), mkItem("print","Printers / Scanners","150",true),
    mkItem("srv","Servers / NAS","400",true),
  ]},
  { id: "other", label: "Other Equipment", items: [
    mkItem("wm","Water Machine / Cooler","150"), mkItem("mw","Microwave / OTG","1000",true),
    mkItem("ktle","Electric Kettle","1500",true), mkItem("geysr","Water Heater / Geyser","2000",true),
    mkItem("cctv","CCTV System","50"), mkItem("oth","Other Miscellaneous","0",true),
  ]},
];

const totalW = (item: EquipItem) => (parseFloat(item.nos)||0) * (parseFloat(item.watt)||0);
const groupTotal = (g: EquipGroup) => g.items.reduce((s,i) => s + totalW(i), 0);

// ─── METER DETAILS TYPES ──────────────────────────────────────────────────────
interface Meter {
  id: string;
  provider: string; type: string;
  sanctionedLoad: string; meterNo: string;
  consumption: string; avgBill: string;
}
const newMeter = (): Meter => ({
  id: crypto.randomUUID(),
  provider:"", type:"", sanctionedLoad:"", meterNo:"", consumption:"", avgBill:"",
});

// ─── DG SET TYPES ─────────────────────────────────────────────────────────────
type RiskLevel = "Low" | "Medium" | "High" | "Critical" | "";
interface DGQuestion {
  id: string; no: number; label: string; badge: string;
  inputType: "select" | "text" | "number" | "yesno";
  options?: string[];
  value: string; obs: string; recommendation: string; risk: RiskLevel;
}

const INITIAL_DG: DGQuestion[] = [
  { id:"dg1", no:1, label:"Is the DG set on hiring or owned by the Bank?", badge:"Hired / Owned / Not Installed", inputType:"select", options:["Hired","Owned","Not Installed"], value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg2", no:2, label:"DG set capacity", badge:"KVA", inputType:"number", value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg3", no:3, label:"DG set make", badge:"OEM", inputType:"text", value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg4", no:4, label:"Is the DG set with Acoustic enclosure?", badge:"YES / NO", inputType:"yesno", value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg5", no:5, label:"DG set model / year of manufacture", badge:"Year", inputType:"text", value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg6", no:6, label:"No. of DG set Batteries", badge:"Nos.", inputType:"number", value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg7", no:7, label:"DG set Battery rating", badge:"AH", inputType:"number", value:"", obs:"", recommendation:"", risk:"" },
];

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const card: React.CSSProperties = { background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", marginBottom:14 };
const INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"9px 12px", fontSize:13, color:"#111827", outline:"none", background:"#fff", boxSizing:"border-box" };
const LBL: React.CSSProperties = { fontSize:11, fontWeight:700, color:"#6b7280", marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:"0.04em" };
const TH: React.CSSProperties = { padding:"8px 10px", fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", textAlign:"left", whiteSpace:"nowrap" };
const TD: React.CSSProperties = { padding:"8px 10px", fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6", verticalAlign:"middle" };
const NI: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 8px", fontSize:13, fontWeight:700, color:"#111827", textAlign:"center", outline:"none", background:"#fff", boxSizing:"border-box" };

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION A — Branch Load Sheet
// ═══════════════════════════════════════════════════════════════════════════════
function LoadSheetSection({ branchName }: { branchName: string }) {
  const [groups, setGroups] = useState<EquipGroup[]>(INITIAL_GROUPS);
  const [open, setOpen] = useState<Record<string,boolean>>({ lighting:true, fans:true, ac:true, computers:false, other:false });
  const [saved, setSaved] = useState(false);

  const upd = useCallback((gid:string, iid:string, field:keyof EquipItem, val:string) =>
    setGroups(gs => gs.map(g => g.id!==gid ? g : { ...g, items: g.items.map(i => i.id!==iid ? i : {...i,[field]:val}) })), []);

  const grand   = groups.reduce((s,g) => s + groupTotal(g), 0);
  const active  = groups.reduce((s,g) => s + g.items.filter(i => parseFloat(i.nos)>0).length, 0);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),3000); };

  return (
    <div>
      {saved && <div style={{marginBottom:14,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
        <i className="ri-checkbox-circle-fill" style={{color:"#16a34a",fontSize:18}}/><span style={{fontSize:13,fontWeight:700,color:"#15803d"}}>Load Sheet saved successfully</span>
      </div>}

      {/* Live stats */}
      <div style={card}>
        <div style={{padding:"13px 18px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="ri-building-2-line" style={{color:"#16a34a",fontSize:16}}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#111827"}}>{branchName}</div>
            <div style={{fontSize:11,color:"#9ca3af"}}>Branch Load Sheet — S.No 1</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr"}}>
          {[{l:"Total (W)",v:grand.toFixed(0),c:"#16a34a"},{l:"Total (kW)",v:(grand/1000).toFixed(2),c:"#2563eb"},{l:"Active Items",v:String(active),c:"#d97706"}].map((s,i)=>(
            <div key={s.l} style={{padding:"14px 18px",borderRight:i<2?"1px solid #f3f4f6":"none",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:10,color:"#9ca3af",fontWeight:600,marginTop:3,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment table */}
      <div style={card}>
        <div style={{padding:"13px 18px",borderBottom:"1px solid #e5e7eb",background:"#f9fafb",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:13,fontWeight:900,color:"#fff"}}>1</span>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"#111827"}}>Equipment Load Details</div>
            <div style={{fontSize:11,color:"#9ca3af"}}>Enter Nos. and Wattage per item</div>
          </div>
        </div>

        {groups.map((group,gi) => {
          const gt = groupTotal(group);
          const isOpen = open[group.id] !== false;
          return (
            <div key={group.id}>
              <div onClick={()=>setOpen(o=>({...o,[group.id]:!o[group.id]}))}
                style={{padding:"10px 18px",background:"#fafafa",borderTop:gi>0?"1px solid #e5e7eb":"none",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",userSelect:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:3,height:18,borderRadius:99,background:"#16a34a"}}/>
                  <span style={{fontSize:12,fontWeight:800,color:"#374151"}}>{group.label}</span>
                  {group.id==="ac" && <span style={{fontSize:10,fontWeight:700,color:"#d97706",background:"#fef3c7",borderRadius:20,padding:"1px 8px"}}>Optional</span>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {gt>0 && <span style={{fontSize:12,fontWeight:800,color:"#16a34a"}}>{gt.toFixed(0)} W</span>}
                  <i className={`ri-arrow-${isOpen?"up":"down"}-s-line`} style={{color:"#9ca3af",fontSize:16}}/>
                </div>
              </div>
              {isOpen && (
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr>
                      <th style={{...TH,width:"40%",paddingLeft:20}}>Equipment Installed</th>
                      {group.hasAC && <th style={{...TH,width:80,textAlign:"center"}}>Tons</th>}
                      <th style={{...TH,width:90,textAlign:"center"}}>Nos.</th>
                      <th style={{...TH,width:100,textAlign:"center"}}>Watt (W)</th>
                      <th style={{...TH,width:100,textAlign:"right",paddingRight:18}}>Total W</th>
                    </tr></thead>
                    <tbody>
                      {group.items.map(item => {
                        const tw = totalW(item);
                        return (
                          <tr key={item.id} onMouseEnter={e=>(e.currentTarget.style.background="#f9fafb")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                            <td style={{...TD,paddingLeft:20,color:item.optional&&!parseFloat(item.nos)?"#9ca3af":"#374151"}}>{item.name}</td>
                            {group.hasAC && <td style={{...TD,textAlign:"center"}}>
                              <input type="number" value={item.tons??""} placeholder="-" onChange={e=>upd(group.id,item.id,"tons",e.target.value)} style={{...NI,width:60,color:"#7c3aed"}}/>
                            </td>}
                            <td style={{...TD,textAlign:"center"}}>
                              <input type="number" min="0" value={item.nos} placeholder="-" onChange={e=>upd(group.id,item.id,"nos",e.target.value)}
                                style={{...NI,width:70,background:parseFloat(item.nos)>0?"#f0fdf4":"#fff",color:parseFloat(item.nos)>0?"#16a34a":"#9ca3af",borderColor:parseFloat(item.nos)>0?"#86efac":"#e5e7eb"}}/>
                            </td>
                            <td style={{...TD,textAlign:"center"}}>
                              <input type="number" min="0" value={item.watt} onChange={e=>upd(group.id,item.id,"watt",e.target.value)} style={{...NI,width:80,color:"#2563eb"}}/>
                            </td>
                            <td style={{...TD,textAlign:"right",paddingRight:18}}>
                              <span style={{fontSize:13,fontWeight:tw>0?800:400,color:tw>0?"#111827":"#d1d5db"}}>{tw>0?tw.toFixed(0):"0"}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{padding:"10px 18px",background:gt>0?"#16a34a":"#374151",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#fff"}}>{group.id==="ac"?"AC / Air Conditioning Total":"Distributed Load (S.No 1)"}</span>
                    <span style={{fontSize:15,fontWeight:900,color:"#fff"}}>{gt.toFixed(0)} W</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div style={{padding:"16px 18px",background:grand>0?"linear-gradient(135deg,#16a34a,#15803d)":"#374151",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"2px solid #fff"}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.8)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Grand Total Wattage</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>All equipment combined</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:26,fontWeight:900,color:"#fff",lineHeight:1}}>{grand.toFixed(0)} W</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>{(grand/1000).toFixed(2)} kW</div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={save} style={{padding:"12px 28px",borderRadius:10,border:"none",background:"#16a34a",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 14px rgba(22,163,74,0.35)"}}>
          <i className="ri-save-line"/>Save Load Sheet
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION B — Meter Details
// ═══════════════════════════════════════════════════════════════════════════════
function MeterDetailsSection({ branchName }: { branchName: string }) {
  const [meters, setMeters] = useState<Meter[]>([newMeter()]);
  const [saved, setSaved] = useState(false);

  const upd = (id:string, field:keyof Meter, val:string) =>
    setMeters(ms => ms.map(m => m.id!==id ? m : {...m,[field]:val}));
  const addMeter = () => setMeters(ms => [...ms, newMeter()]);
  const removeMeter = (id:string) => setMeters(ms => ms.filter(m => m.id!==id));
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),3000); };

  const amber = "#b45309";
  const amberBg = "#fef3c7";
  const amberDark = "#92400e";

  return (
    <div>
      {saved && <div style={{marginBottom:14,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
        <i className="ri-checkbox-circle-fill" style={{color:amber,fontSize:18}}/><span style={{fontSize:13,fontWeight:700,color:amberDark}}>Meter details saved successfully</span>
      </div>}

      {/* Branch info bar */}
      <div style={{...card,overflow:"hidden"}}>
        <div style={{padding:"12px 18px",background:"linear-gradient(135deg,#b45309,#92400e)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="ri-flashlight-line" style={{color:"#fff",fontSize:16}}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{branchName}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.75)"}}>Electricity meter info, sanctioned load &amp; billing</div>
          </div>
          <div style={{marginLeft:"auto",background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:700,color:"#fff"}}>{meters.length} Meter{meters.length>1?"s":""}</div>
        </div>
      </div>

      {/* Meter cards */}
      {meters.map((m, idx) => (
        <div key={m.id} style={card}>
          {/* Card header */}
          <div style={{padding:"12px 18px",background:amberBg,borderBottom:"1px solid #fde68a",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:8,background:amber,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:13,fontWeight:900,color:"#fff"}}>{idx+1}</span>
              </div>
              <span style={{fontSize:14,fontWeight:800,color:amberDark}}>Meter {idx+1}</span>
            </div>
            {meters.length > 1 && (
              <button onClick={()=>removeMeter(m.id)}
                style={{border:"none",background:"transparent",cursor:"pointer",color:"#ef4444",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                <i className="ri-delete-bin-line"/>Remove
              </button>
            )}
          </div>

          {/* Fields */}
          <div style={{padding:18,display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={LBL}>Services Provider</label>
                <input placeholder="e.g. TORRENT" value={m.provider} onChange={e=>upd(m.id,"provider",e.target.value)} style={INP}/>
              </div>
              <div>
                <label style={LBL}>Type</label>
                <select value={m.type} onChange={e=>upd(m.id,"type",e.target.value)} style={INP}>
                  <option value="">e.g. 3 PHASE</option>
                  <option>1 PHASE</option>
                  <option>3 PHASE</option>
                  <option>HT (High Tension)</option>
                  <option>LT (Low Tension)</option>
                </select>
              </div>
            </div>
            <div>
              <label style={LBL}>Qty. Sanctioned Load (KW)</label>
              <input type="number" placeholder="e.g. 21.780" value={m.sanctionedLoad} onChange={e=>upd(m.id,"sanctionedLoad",e.target.value)} style={INP}/>
            </div>
            <div>
              <label style={LBL}>Meter No.</label>
              <input placeholder="e.g. 27001760" value={m.meterNo} onChange={e=>upd(m.id,"meterNo",e.target.value)} style={INP}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={LBL}>Consumption (units/month)</label>
                <input placeholder="e.g. 2000-3000" value={m.consumption} onChange={e=>upd(m.id,"consumption",e.target.value)} style={INP}/>
              </div>
              <div>
                <label style={LBL}>Avg. Bill/month</label>
                <input placeholder="e.g. 20-40K" value={m.avgBill} onChange={e=>upd(m.id,"avgBill",e.target.value)} style={INP}/>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add meter */}
      <button onClick={addMeter}
        style={{width:"100%",padding:"13px",borderRadius:12,border:`2px dashed ${amber}`,background:"transparent",color:amber,fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <i className="ri-add-line" style={{fontSize:16}}/> + Add Another Meter
      </button>

      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={save}
          style={{padding:"12px 28px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#b45309,#92400e)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 14px rgba(180,83,9,0.35)"}}>
          <i className="ri-save-line"/>Save Meter Details
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION C — DG Set
// ═══════════════════════════════════════════════════════════════════════════════
const RISK_COLORS: Record<RiskLevel, { bg: string; text: string }> = {
  "Low":      { bg:"#f0fdf4", text:"#16a34a" },
  "Medium":   { bg:"#fffbeb", text:"#d97706" },
  "High":     { bg:"#fff7ed", text:"#ea580c" },
  "Critical": { bg:"#fef2f2", text:"#dc2626" },
  "":         { bg:"#f9fafb", text:"#6b7280" },
};

function DGSetSection({ branchName }: { branchName: string }) {
  const [questions, setQuestions] = useState<DGQuestion[]>(INITIAL_DG);
  const [saved, setSaved] = useState(false);

  const upd = (id:string, field:keyof DGQuestion, val:string) =>
    setQuestions(qs => qs.map(q => q.id!==id ? q : {...q,[field]:val}));
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),3000); };

  const red = "#b91c1c"; const redBg = "#fef2f2"; const redDark = "#7f1d1d";

  return (
    <div>
      {saved && <div style={{marginBottom:14,background:redBg,border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
        <i className="ri-checkbox-circle-fill" style={{color:red,fontSize:18}}/><span style={{fontSize:13,fontWeight:700,color:redDark}}>DG Set details saved successfully</span>
      </div>}

      {/* Header */}
      <div style={{...card,overflow:"hidden"}}>
        <div style={{padding:"12px 18px",background:"linear-gradient(135deg,#b91c1c,#7f1d1d)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="ri-settings-3-line" style={{color:"#fff",fontSize:16}}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{branchName}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.75)"}}>DG specs, batteries, acoustic enclosure &amp; risk level</div>
          </div>
        </div>
      </div>

      {/* Question cards */}
      {questions.map(q => {
        const rCol = RISK_COLORS[q.risk];
        return (
          <div key={q.id} style={card}>
            {/* Question header */}
            <div style={{padding:"12px 16px",background:redBg,borderBottom:"1px solid #fecaca",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{minWidth:28,height:28,borderRadius:8,background:red,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:12,fontWeight:900,color:"#fff"}}>{q.no}</span>
                </div>
                <span style={{fontSize:13,fontWeight:800,color:"#1f2937"}}>{q.label}</span>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:"#6b7280",background:"#fff",border:"1px solid #e5e7eb",borderRadius:20,padding:"2px 10px",whiteSpace:"nowrap"}}>{q.badge}</span>
            </div>

            <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
              {/* Primary input */}
              {q.inputType === "select" && (
                <div>
                  <label style={LBL}>Observations / Remarks</label>
                  <select value={q.value} onChange={e=>upd(q.id,"value",e.target.value)} style={INP}>
                    <option value="">— Select —</option>
                    {q.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              )}
              {(q.inputType==="text"||q.inputType==="number") && (
                <div>
                  <label style={LBL}>Observations / Remarks</label>
                  <input type={q.inputType} placeholder={`Enter ${q.badge}`} value={q.value} onChange={e=>upd(q.id,"value",e.target.value)} style={INP}/>
                </div>
              )}
              {q.inputType === "yesno" && (
                <div>
                  <label style={LBL}>Observations / Remarks</label>
                  <div style={{display:"flex",gap:10}}>
                    {["Yes","No"].map(opt => (
                      <button key={opt} onClick={()=>upd(q.id,"value",opt)}
                        style={{flex:1,padding:"9px",borderRadius:8,border:`2px solid ${q.value===opt?red:"#e5e7eb"}`,background:q.value===opt?redBg:"#fff",color:q.value===opt?red:"#374151",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation + Risk Level */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={LBL}>Recommendation (Safety)</label>
                  <input placeholder="Enter recommendation" value={q.recommendation} onChange={e=>upd(q.id,"recommendation",e.target.value)} style={INP}/>
                </div>
                <div>
                  <label style={LBL}>Risk Level</label>
                  <select value={q.risk} onChange={e=>upd(q.id,"risk",e.target.value as RiskLevel)}
                    style={{...INP, background:rCol.bg, color:rCol.text, fontWeight:700}}>
                    <option value="">— Select —</option>
                    {(["Low","Medium","High","Critical"] as RiskLevel[]).map(r=>(
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={save}
          style={{padding:"12px 28px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#b91c1c,#7f1d1d)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 14px rgba(185,28,28,0.35)"}}>
          <i className="ri-save-line"/>Save DG Set Details
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const TABS: { id: Tab; label: string; icon: string; color: string }[] = [
  { id:"load-sheet",    label:"Branch Load Sheet",        icon:"ri-lightbulb-line",   color:"#16a34a" },
  { id:"meter-details", label:"Meter Details",            icon:"ri-flashlight-line",  color:"#b45309" },
  { id:"dg-set",        label:"Diesel Generator (DG) Set",icon:"ri-settings-3-line",  color:"#b91c1c" },
];

export default function AuditFormPage() {
  const [tab, setTab] = useState<Tab>("load-sheet");
  const branchName = "SBI - Paldi Branch";
  const active = TABS.find(t=>t.id===tab)!;

  return (
    <div style={{padding:"24px 0"}}>
      {/* Page header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h4 style={{fontSize:22,fontWeight:800,color:"#111827",margin:0}}>Audit Form</h4>
          <div style={{fontSize:12,color:"#9ca3af",marginTop:3}}>
            Audit Questions / <span style={{color:active.color,fontWeight:600}}>Audit Form</span>
          </div>
        </div>
        <div style={{fontSize:12,fontWeight:700,color:"#6b7280",background:"#f3f4f6",borderRadius:8,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}>
          <i className="ri-building-2-line"/>{branchName}
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{display:"flex",gap:4,marginBottom:20,background:"#f3f4f6",borderRadius:12,padding:4}}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:"9px 10px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.15s",
              background:tab===t.id?"#fff":"transparent",
              color:tab===t.id?t.color:"#6b7280",
              boxShadow:tab===t.id?"0 1px 6px rgba(0,0,0,0.1)":"none"}}>
            <i className={t.icon} style={{fontSize:14}}/>
            <span style={{whiteSpace:"nowrap"}}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab==="load-sheet"    && <LoadSheetSection branchName={branchName}/>}
      {tab==="meter-details" && <MeterDetailsSection branchName={branchName}/>}
      {tab==="dg-set"        && <DGSetSection branchName={branchName}/>}

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type=number]{-moz-appearance:textfield}
      `}</style>
    </div>
  );
}
