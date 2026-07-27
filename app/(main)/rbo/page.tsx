"use client";
import React, { useState } from "react";

const SEED = [
  { id:"RBO-001", name:"Ahmedabad RBO",    bank:"SBI",            circle:"SBI Gujarat Circle",   state:"Gujarat",     head:"Vikram Patel",    branches:28, status:"Active"   },
  { id:"RBO-002", name:"Surat RBO",        bank:"SBI",            circle:"SBI Gujarat Circle",   state:"Gujarat",     head:"Meena Shah",      branches:18, status:"Active"   },
  { id:"RBO-003", name:"Bhopal RBO",       bank:"SBI",            circle:"SBI MP Circle",        state:"MP",          head:"Suresh Tiwari",   branches:22, status:"Active"   },
  { id:"RBO-004", name:"Indore RBO",       bank:"SBI",            circle:"SBI MP Circle",        state:"MP",          head:"Alok Joshi",      branches:15, status:"Active"   },
  { id:"RBO-005", name:"Jaipur RBO",       bank:"SBI",            circle:"SBI Rajasthan Circle", state:"Rajasthan",   head:"Ramesh Gupta",    branches:20, status:"Active"   },
  { id:"RBO-006", name:"Jodhpur RBO",      bank:"SBI",            circle:"SBI Rajasthan Circle", state:"Rajasthan",   head:"Kavita Sharma",   branches:12, status:"Active"   },
  { id:"RBO-007", name:"Baroda RBO",       bank:"Bank of Baroda", circle:"BOB Gujarat Circle",   state:"Gujarat",     head:"Dinesh Mehta",    branches:25, status:"Active"   },
  { id:"RBO-008", name:"Jaipur BO RBO",    bank:"Bank of Baroda", circle:"BOB Rajasthan Circle", state:"Rajasthan",   head:"Preeti Agarwal",  branches:13, status:"Inactive" },
  { id:"RBO-009", name:"Kolkata RBO",      bank:"UCO Bank",       circle:"UCO East Circle",      state:"West Bengal", head:"Ananya Bose",     branches:16, status:"Active"   },
  { id:"RBO-010", name:"Patna RBO",        bank:"UCO Bank",       circle:"UCO East Circle",      state:"Bihar",       head:"Rajesh Kumar",    branches:8,  status:"Active"   },
  { id:"RBO-011", name:"Delhi RBO",        bank:"PNB",            circle:"PNB North Circle",     state:"Delhi",       head:"Harpreet Singh",  branches:12, status:"Active"   },
  { id:"RBO-012", name:"Bengaluru RBO",    bank:"Canara Bank",    circle:"Canara South Circle",  state:"Karnataka",   head:"Shilpa Rao",      branches:13, status:"Active"   },
];

type Row = typeof SEED[0];
const EMPTY: Row = { id:"", name:"", bank:"SBI", circle:"", state:"Gujarat", head:"", branches:0, status:"Active" };
const BANKS   = ["All Banks","SBI","Bank of Baroda","UCO Bank","PNB","Canara Bank"];
const STATUSES= ["All Status","Active","Inactive"];
const PAGE_SIZE = 8;

const TH: React.CSSProperties = { padding:"11px 14px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase" as const, letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap" as const, textAlign:"left" as const };
const TD: React.CSSProperties = { padding:"11px 14px", verticalAlign:"middle" as const, fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };
const LBL: React.CSSProperties = { display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:4, textTransform:"uppercase" as const, letterSpacing:"0.04em" };
const INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 11px", fontSize:13, color:"#374151", outline:"none", boxSizing:"border-box" as const, background:"#fff" };

export default function RBOPage() {
  const [rows, setRows] = useState<Row[]>(SEED);
  const [form, setForm] = useState<Row>({ ...EMPTY });
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [bankF, setBankF] = useState("All Banks");
  const [statusF, setStatusF] = useState("All Status");
  const [page, setPage] = useState(1);

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    return (!q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.head.toLowerCase().includes(q))
      && (bankF   === "All Banks"  || r.bank   === bankF)
      && (statusF === "All Status" || r.status === statusF);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p     = Math.min(page, totalPages);
  const paged = filtered.slice((p-1)*PAGE_SIZE, p*PAGE_SIZE);
  const nums  = () => { const n:number[]=[]; for(let i=Math.max(1,p-2);i<=Math.min(totalPages,p+2);i++)n.push(i); return n; };

  const fp = (k: keyof Row) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(f => ({ ...f, [k]: k==="branches"?+e.target.value:e.target.value }));
  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) { setRows(rs => rs.map(r => r.id===editing ? { ...form, id:editing } : r)); }
    else { const id=`RBO-${String(rows.length+1).padStart(3,"0")}`; setRows(rs => [...rs, { ...form, id }]); }
    setForm({ ...EMPTY }); setEditing(null);
  };
  const handleEdit   = (r: Row) => { setForm({ ...r }); setEditing(r.id); };
  const handleDelete = (id: string) => setRows(rs => rs.filter(r => r.id!==id));
  const handleCancel = () => { setForm({ ...EMPTY }); setEditing(null); };

  return (
    <div style={{ padding:"24px 0" }}>
      <div style={{ marginBottom:4 }}>
        <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>RBO / CO / Region / ZO</h4>
        <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>Dashboard / Banking Structure / <span style={{ color:"#16a34a", fontWeight:600 }}>RBO / CO / Region / ZO</span></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, margin:"16px 0 20px" }}>
        {[
          { label:"Total RBOs",    value:rows.length,                                  color:"#2563eb", bg:"#eff6ff", icon:"ri-organization-chart",  border:"#2563eb" },
          { label:"Active",        value:rows.filter(r=>r.status==="Active").length,   color:"#16a34a", bg:"#f0fdf4", icon:"ri-checkbox-circle-line", border:"#16a34a" },
          { label:"Inactive",      value:rows.filter(r=>r.status==="Inactive").length, color:"#dc2626", bg:"#fef2f2", icon:"ri-close-circle-line",    border:"#dc2626" },
          { label:"Total Branches",value:rows.reduce((s,r)=>s+r.branches,0),           color:"#7c3aed", bg:"#f5f3ff", icon:"ri-building-2-line",      border:"#7c3aed" },
        ].map(c=>(
          <div key={c.label} style={{ background:"#fff", borderRadius:10, border:"1px solid #e5e7eb", padding:"13px 15px", display:"flex", alignItems:"center", gap:11, borderLeft:`4px solid ${c.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={c.icon} style={{ fontSize:17, color:c.color }}/>
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
              <div style={{ fontSize:10, color:"#9ca3af", fontWeight:600, marginTop:2 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"380px 1fr", gap:18, alignItems:"start" }}>
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", position:"sticky", top:80 }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #f3f4f6", background:editing?"#fffbeb":"#f9fafb", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:"#111827" }}>{editing ? `Edit — ${editing}` : "Add RBO / CO / Region"}</div>
              <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>Fill details and save</div>
            </div>
            {editing && <button onClick={handleCancel} style={{ fontSize:11, color:"#6b7280", background:"#f3f4f6", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>× Cancel</button>}
          </div>
          <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
            <div><label style={LBL}>RBO / CO Name <span style={{ color:"#dc2626" }}>*</span></label><input value={form.name} onChange={fp("name")} placeholder="e.g. Ahmedabad RBO" style={INP}/></div>
            <div><label style={LBL}>Bank</label>
              <select value={form.bank} onChange={fp("bank")} style={{ ...INP, padding:"7px 10px" }}>
                {["SBI","Bank of Baroda","UCO Bank","PNB","Canara Bank"].map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div><label style={LBL}>Circle / Zone</label><input value={form.circle} onChange={fp("circle")} placeholder="e.g. SBI Gujarat Circle" style={INP}/></div>
            <div><label style={LBL}>Head / In-Charge</label><input value={form.head} onChange={fp("head")} placeholder="Name of RBO head" style={INP}/></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={LBL}>State</label>
                <select value={form.state} onChange={fp("state")} style={{ ...INP, padding:"7px 10px" }}>
                  {["Gujarat","MP","Rajasthan","West Bengal","Bihar","Delhi","Karnataka","Tamil Nadu","Maharashtra"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label style={LBL}>Status</label>
                <select value={form.status} onChange={fp("status")} style={{ ...INP, padding:"7px 10px" }}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <button onClick={handleSave} style={{ width:"100%", padding:"10px", borderRadius:8, border:"none", background:"#16a34a", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13, marginTop:4 }}>
              {editing ? "Update RBO" : "Save RBO"}
            </button>
          </div>
        </div>

        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" as const }}>
            <div style={{ fontSize:12, color:"#6b7280" }}>Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> entries — Page <strong style={{ color:"#111827" }}>{p}</strong> of {totalPages}</div>
            <div style={{ flex:1 }}/>
            <select value={bankF}   onChange={e=>{setBankF(e.target.value);setPage(1);}}   style={SEL}>{BANKS.map(b=><option key={b}>{b}</option>)}</select>
            <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}} style={SEL}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 10px" }}>
              <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:13 }}/>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Name, ID, head…" style={{ border:"none", outline:"none", fontSize:12, color:"#374151", width:150 }}/>
              {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:13 }}>×</button>}
            </div>
          </div>
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>
                  <th style={TH}>ID</th><th style={TH}>RBO NAME</th><th style={TH}>BANK</th>
                  <th style={TH}>CIRCLE / ZONE</th><th style={TH}>HEAD</th><th style={TH}>STATE</th>
                  <th style={{ ...TH, textAlign:"center" }}>BRANCHES</th>
                  <th style={{ ...TH, textAlign:"center" }}>STATUS</th>
                  <th style={{ ...TH, textAlign:"center" }}>ACTION</th>
                </tr></thead>
                <tbody>
                  {paged.length===0 ? <tr><td colSpan={9} style={{ padding:"50px", textAlign:"center", color:"#9ca3af" }}><i className="ri-organization-chart" style={{ fontSize:32, display:"block", marginBottom:8, opacity:0.3 }}/>No RBOs found</td></tr>
                  : paged.map(r => {
                    const isEd=editing===r.id;
                    return (
                      <tr key={r.id} style={{ background:isEd?"#f0fdf4":"transparent" }}
                        onMouseEnter={e=>{if(!isEd)e.currentTarget.style.background="#f9fafb";}}
                        onMouseLeave={e=>{if(!isEd)e.currentTarget.style.background="transparent";}}>
                        <td style={TD}><span style={{ fontSize:11, fontWeight:700, color:"#374151", background:"#f3f4f6", borderRadius:5, padding:"2px 8px", fontFamily:"monospace" }}>{r.id}</span></td>
                        <td style={TD}><span style={{ fontWeight:700, color:"#111827" }}>{r.name}</span></td>
                        <td style={{ ...TD, fontSize:12, color:"#6b7280" }}>{r.bank}</td>
                        <td style={{ ...TD, fontSize:12, color:"#6b7280" }}>{r.circle}</td>
                        <td style={{ ...TD, fontSize:12 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <div style={{ width:26, height:26, borderRadius:6, background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:10, fontWeight:700, flexShrink:0 }}>
                              {r.head.split(" ").map(w=>w[0]).join("").slice(0,2)}
                            </div>
                            {r.head}
                          </div>
                        </td>
                        <td style={{ ...TD, fontSize:12, color:"#6b7280" }}>{r.state}</td>
                        <td style={{ ...TD, textAlign:"center", fontWeight:700, color:r.branches>0?"#2563eb":"#9ca3af" }}>{r.branches}</td>
                        <td style={{ ...TD, textAlign:"center" }}><span style={{ fontSize:11, fontWeight:700, color:r.status==="Active"?"#16a34a":"#9ca3af", background:r.status==="Active"?"#dcfce7":"#f3f4f6", borderRadius:20, padding:"3px 10px" }}>{r.status}</span></td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
                            <button onClick={()=>handleEdit(r)} style={{ width:28, height:28, borderRadius:6, border:`1px solid ${isEd?"#16a34a":"#e5e7eb"}`, background:isEd?"#dcfce7":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:isEd?"#16a34a":"#2563eb" }}><i className="ri-edit-line" style={{ fontSize:13 }}/></button>
                            <button onClick={()=>handleDelete(r.id)} style={{ width:28, height:28, borderRadius:6, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}><i className="ri-delete-bin-line" style={{ fontSize:13 }}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding:"10px 16px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafafa" }}>
              <span style={{ fontSize:11, color:"#6b7280" }}>Showing <strong style={{ color:"#111827" }}>{Math.min((p-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(p*PAGE_SIZE,filtered.length)}</strong> of <strong style={{ color:"#111827" }}>{filtered.length}</strong></span>
              <div style={{ display:"flex", gap:3 }}>
                <button onClick={()=>setPage(pp=>Math.max(1,pp-1))} disabled={p===1} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===1?"#f9fafb":"#fff", color:p===1?"#d1d5db":"#374151", cursor:p===1?"not-allowed":"pointer", fontSize:12 }}>‹</button>
                {nums().map(n=><button key={n} onClick={()=>setPage(n)} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, fontSize:12, fontWeight:n===p?700:400, background:n===p?"#16a34a":"#fff", color:n===p?"#fff":"#374151", cursor:"pointer" }}>{n}</button>)}
                <button onClick={()=>setPage(pp=>Math.min(totalPages,pp+1))} disabled={p===totalPages} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===totalPages?"#f9fafb":"#fff", color:p===totalPages?"#d1d5db":"#374151", cursor:p===totalPages?"not-allowed":"pointer", fontSize:12 }}>›</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
