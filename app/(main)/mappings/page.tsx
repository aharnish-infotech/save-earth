"use client";
import React, { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Mapping {
  id:         string;
  bank:       string;
  circle:     string;
  zone:       string;
  state:      string;
  template:   string;
  templateId: string;
  branches:   number;
  assignedBy: string;
  assignedOn: string;
  status:     "Active" | "Inactive";
}

// ── Seed Data ──────────────────────────────────────────────────────────────────
const SEED: Mapping[] = [
  { id:"M-001", bank:"SBI",            circle:"SBI Gujarat Circle",     zone:"AO - Ahmedabad",    state:"Gujarat",     template:"SBI Standard Branch Audit",     templateId:"T-001", branches:28, assignedBy:"Admin", assignedOn:"15 Jan 2024", status:"Active"   },
  { id:"M-002", bank:"SBI",            circle:"SBI Gujarat Circle",     zone:"AO - Surat",        state:"Gujarat",     template:"SBI Standard Branch Audit",     templateId:"T-001", branches:18, assignedBy:"Admin", assignedOn:"15 Jan 2024", status:"Active"   },
  { id:"M-003", bank:"SBI",            circle:"SBI MP Circle",          zone:"AO - Bhopal",       state:"MP",          template:"SBI Standard Branch Audit",     templateId:"T-001", branches:22, assignedBy:"Admin", assignedOn:"20 Jan 2024", status:"Active"   },
  { id:"M-004", bank:"SBI",            circle:"SBI MP Circle",          zone:"AO - Indore",       state:"MP",          template:"SBI Standard Branch Audit",     templateId:"T-001", branches:15, assignedBy:"Admin", assignedOn:"20 Jan 2024", status:"Active"   },
  { id:"M-005", bank:"SBI",            circle:"SBI Rajasthan Circle",   zone:"AO - Jaipur",       state:"Rajasthan",   template:"SBI Standard Branch Audit",     templateId:"T-001", branches:20, assignedBy:"Admin", assignedOn:"22 Jan 2024", status:"Active"   },
  { id:"M-006", bank:"SBI",            circle:"SBI Rajasthan Circle",   zone:"AO - Jodhpur",      state:"Rajasthan",   template:"SBI Standard Branch Audit",     templateId:"T-001", branches:12, assignedBy:"Admin", assignedOn:"22 Jan 2024", status:"Active"   },
  { id:"M-007", bank:"Bank of Baroda", circle:"BOB Gujarat Circle",     zone:"BO - Baroda",       state:"Gujarat",     template:"BOB Branch Infrastructure Audit",templateId:"T-002", branches:14, assignedBy:"Admin", assignedOn:"20 Jan 2024", status:"Active"   },
  { id:"M-008", bank:"Bank of Baroda", circle:"BOB Gujarat Circle",     zone:"BO - Ahmedabad",    state:"Gujarat",     template:"BOB Branch Infrastructure Audit",templateId:"T-002", branches:11, assignedBy:"Admin", assignedOn:"20 Jan 2024", status:"Active"   },
  { id:"M-009", bank:"Bank of Baroda", circle:"BOB Rajasthan Circle",   zone:"BO - Jaipur",       state:"Rajasthan",   template:"BOB Branch Infrastructure Audit",templateId:"T-002", branches:9,  assignedBy:"Admin", assignedOn:"25 Jan 2024", status:"Inactive" },
  { id:"M-010", bank:"UCO Bank",       circle:"UCO East Circle",        zone:"ZO - Kolkata",      state:"West Bengal", template:"UCO Bank East Circle Audit",     templateId:"T-003", branches:16, assignedBy:"Admin", assignedOn:"25 Jan 2024", status:"Active"   },
  { id:"M-011", bank:"UCO Bank",       circle:"UCO East Circle",        zone:"ZO - Patna",        state:"Bihar",       template:"UCO Bank East Circle Audit",     templateId:"T-003", branches:8,  assignedBy:"Admin", assignedOn:"25 Jan 2024", status:"Active"   },
  { id:"M-012", bank:"Canara Bank",    circle:"Canara South Circle",    zone:"RO - Bengaluru",    state:"Karnataka",   template:"Canara Bank Audit Template",     templateId:"T-005", branches:13, assignedBy:"Admin", assignedOn:"05 Feb 2024", status:"Active"   },
  { id:"M-013", bank:"Canara Bank",    circle:"Canara South Circle",    zone:"RO - Chennai",      state:"Tamil Nadu",  template:"Canara Bank Audit Template",     templateId:"T-005", branches:10, assignedBy:"Admin", assignedOn:"05 Feb 2024", status:"Active"   },
  { id:"M-014", bank:"PNB",            circle:"PNB North Circle",       zone:"ZO - Delhi",        state:"Delhi",       template:"PNB Comprehensive Audit v2",     templateId:"T-004", branches:0,  assignedBy:"Admin", assignedOn:"10 Mar 2024", status:"Inactive" },
];

const BANKS_LIST   = ["All Banks","SBI","Bank of Baroda","UCO Bank","PNB","Canara Bank"];
const STATES_LIST  = ["All States","Gujarat","MP","Rajasthan","West Bengal","Bihar","Karnataka","Tamil Nadu","Delhi"];
const STATUS_LIST  = ["All Status","Active","Inactive"];
const PAGE_SIZE    = 10;

const BANK_COLOR: Record<string, string> = {
  "SBI":            "#1d4ed8",
  "Bank of Baroda": "#b91c1c",
  "UCO Bank":       "#0891b2",
  "PNB":            "#7c3aed",
  "Canara Bank":    "#ca8a04",
};

const TH: React.CSSProperties = { padding:"11px 16px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase" as const, letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap" as const, textAlign:"left" as const };
const TD: React.CSSProperties = { padding:"13px 16px", verticalAlign:"middle" as const, fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };
const LBL: React.CSSProperties = { display:"block", fontSize:11, fontWeight:700, color:"#374151", marginBottom:5, textTransform:"uppercase" as const, letterSpacing:"0.04em" };
const INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"9px 12px", fontSize:13, color:"#374151", outline:"none", boxSizing:"border-box" as const };

export default function BankZoneMappingPage() {
  const [mappings,  setMappings]  = useState<Mapping[]>(SEED);
  const [search,    setSearch]    = useState("");
  const [bankF,     setBankF]     = useState("All Banks");
  const [stateF,    setStateF]    = useState("All States");
  const [statusF,   setStatusF]   = useState("All Status");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const filtered = mappings.filter(m => {
    const q = search.toLowerCase();
    return (!q || m.bank.toLowerCase().includes(q) || m.circle.toLowerCase().includes(q) || m.zone.toLowerCase().includes(q) || m.template.toLowerCase().includes(q) || m.id.toLowerCase().includes(q))
      && (bankF   === "All Banks"   || m.bank   === bankF)
      && (stateF  === "All States"  || m.state  === stateF)
      && (statusF === "All Status"  || m.status === statusF);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p     = Math.min(page, totalPages);
  const paged = filtered.slice((p-1)*PAGE_SIZE, p*PAGE_SIZE);
  const nums  = () => { const n:number[]=[]; for(let i=Math.max(1,p-2);i<=Math.min(totalPages,p+2);i++)n.push(i); return n; };

  const toggleStatus = (id: string) =>
    setMappings(ms => ms.map(m => m.id===id ? { ...m, status: m.status==="Active"?"Inactive":"Active" as "Active"|"Inactive" } : m));

  const totalBranches = mappings.filter(m=>m.status==="Active").reduce((s,m)=>s+m.branches,0);
  const activeMaps    = mappings.filter(m=>m.status==="Active").length;
  const banksCount    = new Set(mappings.map(m=>m.bank)).size;

  return (
    <div style={{ padding:"24px 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Bank-Zone Mapping</h4>
        <button onClick={()=>setShowModal(true)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", background:"#16a34a", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
          <i className="ri-add-line"/> New Mapping
        </button>
      </div>
      <div style={{ fontSize:12, color:"#9ca3af", marginBottom:20 }}>Dashboard / Audit Questions / <span style={{ color:"#16a34a", fontWeight:600 }}>Bank-Zone Mapping</span></div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"Total Mappings",  value:mappings.length, color:"#2563eb", bg:"#eff6ff", icon:"ri-links-line",           border:"#2563eb" },
          { label:"Active",          value:activeMaps,      color:"#16a34a", bg:"#f0fdf4", icon:"ri-checkbox-circle-line", border:"#16a34a" },
          { label:"Banks Covered",   value:banksCount,      color:"#7c3aed", bg:"#f5f3ff", icon:"ri-bank-line",            border:"#7c3aed" },
          { label:"Branches Mapped", value:totalBranches,   color:"#0891b2", bg:"#ecfeff", icon:"ri-building-2-line",      border:"#0891b2" },
        ].map(c => (
          <div key={c.label} style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"16px", display:"flex", alignItems:"center", gap:12, borderLeft:`4px solid ${c.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ width:40, height:40, borderRadius:10, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={c.icon} style={{ fontSize:19, color:c.color }}/>
            </div>
            <div>
              <div style={{ fontSize:24, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
              <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, marginTop:3 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bank Coverage Summary */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"16px 20px", marginBottom:20, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:12 }}>Bank Coverage Overview</div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          {BANKS_LIST.slice(1).map(bank => {
            const bMaps = mappings.filter(m=>m.bank===bank && m.status==="Active");
            const bBranches = bMaps.reduce((s,m)=>s+m.branches,0);
            const bc = BANK_COLOR[bank] || "#374151";
            return (
              <div key={bank} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", border:`1px solid ${bc}30`, borderRadius:10, background:`${bc}08` }}>
                <div style={{ width:8, height:8, borderRadius:4, background:bc }}/>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:bc }}>{bank}</div>
                  <div style={{ fontSize:11, color:"#9ca3af" }}>{bMaps.length} zones · {bBranches} branches</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ fontSize:13, color:"#6b7280" }}>
          Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> mappings — Page <strong style={{ color:"#111827" }}>{p}</strong> of {totalPages}
        </div>
        <div style={{ flex:1 }} />
        <select value={bankF}   onChange={e=>{setBankF(e.target.value);setPage(1);}}   style={SEL}>{BANKS_LIST.map(b=><option key={b}>{b}</option>)}</select>
        <select value={stateF}  onChange={e=>{setStateF(e.target.value);setPage(1);}}  style={SEL}>{STATES_LIST.map(s=><option key={s}>{s}</option>)}</select>
        <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}} style={SEL}>{STATUS_LIST.map(s=><option key={s}>{s}</option>)}</select>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 12px" }}>
          <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:14 }}/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search bank, zone, circle, template…"
            style={{ border:"none", outline:"none", fontSize:12, color:"#374151", width:220 }}/>
          {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:14 }}>×</button>}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <th style={TH}>MAP ID</th>
              <th style={TH}>BANK</th>
              <th style={TH}>CIRCLE</th>
              <th style={TH}>ZONE / AO</th>
              <th style={TH}>STATE</th>
              <th style={TH}>ASSIGNED TEMPLATE</th>
              <th style={{ ...TH, textAlign:"center" }}>BRANCHES</th>
              <th style={{ ...TH, textAlign:"center" }}>ASSIGNED ON</th>
              <th style={{ ...TH, textAlign:"center" }}>STATUS</th>
              <th style={{ ...TH, textAlign:"center" }}>ACTION</th>
            </tr></thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={10} style={{ padding:"60px 24px", textAlign:"center", color:"#9ca3af" }}>
                  <i className="ri-links-line" style={{ fontSize:36, display:"block", marginBottom:8, opacity:0.3 }}/>No mappings found
                </td></tr>
              ) : paged.map(m => {
                const bc = BANK_COLOR[m.bank] || "#374151";
                return (
                  <tr key={m.id} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={TD}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#374151", background:"#f3f4f6", borderRadius:6, padding:"3px 9px", fontFamily:"monospace" }}>{m.id}</span>
                    </td>
                    <td style={TD}>
                      <span style={{ fontSize:12, fontWeight:700, color:bc, background:`${bc}18`, borderRadius:6, padding:"3px 9px", whiteSpace:"nowrap" as const }}>{m.bank}</span>
                    </td>
                    <td style={{ ...TD, fontSize:12, color:"#374151" }}>{m.circle}</td>
                    <td style={{ ...TD, fontWeight:600, color:"#111827", fontSize:12 }}>{m.zone}</td>
                    <td style={{ ...TD, fontSize:12, color:"#6b7280" }}>{m.state}</td>
                    <td style={TD}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:11, color:"#9ca3af", background:"#f3f4f6", borderRadius:5, padding:"2px 7px", fontFamily:"monospace" }}>{m.templateId}</span>
                        <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{m.template}</span>
                      </div>
                    </td>
                    <td style={{ ...TD, textAlign:"center" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:m.branches>0?"#2563eb":"#9ca3af" }}>{m.branches}</span>
                    </td>
                    <td style={{ ...TD, textAlign:"center", fontSize:12, color:"#6b7280" }}>{m.assignedOn}</td>
                    <td style={{ ...TD, textAlign:"center" }}>
                      <button onClick={()=>toggleStatus(m.id)} style={{ fontSize:11, fontWeight:700, color:m.status==="Active"?"#16a34a":"#9ca3af", background:m.status==="Active"?"#dcfce7":"#f3f4f6", border:"none", borderRadius:20, padding:"4px 12px", cursor:"pointer" }}>
                        {m.status}
                      </button>
                    </td>
                    <td style={{ ...TD, textAlign:"center" }}>
                      <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                        <button title="Edit" style={{ width:30, height:30, borderRadius:7, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#2563eb" }}><i className="ri-edit-line" style={{ fontSize:14 }}/></button>
                        <button title="Delete" style={{ width:30, height:30, borderRadius:7, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}><i className="ri-delete-bin-line" style={{ fontSize:14 }}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"12px 20px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafafa" }}>
          <span style={{ fontSize:12, color:"#6b7280" }}>Showing <strong style={{ color:"#111827" }}>{Math.min((p-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(p*PAGE_SIZE,filtered.length)}</strong> of <strong style={{ color:"#111827" }}>{filtered.length}</strong> mappings</span>
          <div style={{ display:"flex", gap:4 }}>
            <button onClick={()=>setPage(pp=>Math.max(1,pp-1))} disabled={p===1} style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:p===1?"#f9fafb":"#fff", color:p===1?"#d1d5db":"#374151", cursor:p===1?"not-allowed":"pointer", fontSize:12 }}>‹</button>
            {nums().map(n=><button key={n} onClick={()=>setPage(n)} style={{ padding:"5px 11px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:12, fontWeight:n===p?700:400, background:n===p?"#16a34a":"#fff", color:n===p?"#fff":"#374151", cursor:"pointer" }}>{n}</button>)}
            <button onClick={()=>setPage(pp=>Math.min(totalPages,pp+1))} disabled={p===totalPages} style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:p===totalPages?"#f9fafb":"#fff", color:p===totalPages?"#d1d5db":"#374151", cursor:p===totalPages?"not-allowed":"pointer", fontSize:12 }}>›</button>
          </div>
        </div>
      </div>

      {/* Add Mapping Modal */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={e=>{ if(e.target===e.currentTarget) setShowModal(false); }}>
          <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:540, boxShadow:"0 25px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:"#111827" }}>New Bank-Zone Mapping</div>
                <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>Assign an audit template to a bank circle or zone</div>
              </div>
              <button onClick={()=>setShowModal(false)} style={{ width:32, height:32, borderRadius:8, border:"1px solid #e5e7eb", background:"#f9fafb", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280", fontSize:18 }}>×</button>
            </div>
            <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div><label style={LBL}>Bank <span style={{ color:"#dc2626" }}>*</span></label>
                  <select style={{ ...INP }}>{BANKS_LIST.slice(1).map(b=><option key={b}>{b}</option>)}</select>
                </div>
                <div><label style={LBL}>State</label>
                  <select style={{ ...INP }}>{STATES_LIST.slice(1).map(s=><option key={s}>{s}</option>)}</select>
                </div>
                <div><label style={LBL}>Circle <span style={{ color:"#dc2626" }}>*</span></label>
                  <input placeholder="e.g. SBI Gujarat Circle" style={INP}/>
                </div>
                <div><label style={LBL}>Zone / AO <span style={{ color:"#dc2626" }}>*</span></label>
                  <input placeholder="e.g. AO - Ahmedabad" style={INP}/>
                </div>
              </div>
              <div><label style={LBL}>Assign Template <span style={{ color:"#dc2626" }}>*</span></label>
                <select style={{ ...INP }}>
                  <option>SBI Standard Branch Audit (T-001)</option>
                  <option>BOB Branch Infrastructure Audit (T-002)</option>
                  <option>UCO Bank East Circle Audit (T-003)</option>
                  <option>PNB Comprehensive Audit v2 (T-004)</option>
                  <option>Canara Bank Audit Template (T-005)</option>
                </select>
              </div>
            </div>
            <div style={{ padding:"16px 24px", borderTop:"1px solid #f3f4f6", display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={()=>setShowModal(false)} style={{ padding:"9px 20px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontWeight:600, fontSize:13 }}>Cancel</button>
              <button onClick={()=>setShowModal(false)} style={{ padding:"9px 20px", borderRadius:8, border:"none", background:"#16a34a", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13 }}>Save Mapping</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
