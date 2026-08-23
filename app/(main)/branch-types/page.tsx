"use client";
import React, { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Row { id: string; name: string; code: string; status: string; }

const SEED: Row[] = [
  { id:"BT-001", name:"Metro",      code:"MET", status:"Active"   },
  { id:"BT-002", name:"Urban",      code:"URB", status:"Active"   },
  { id:"BT-003", name:"Semi-Urban", code:"SUB", status:"Active"   },
  { id:"BT-004", name:"Rural",      code:"RUR", status:"Active"   },
  { id:"BT-005", name:"E-Corner",   code:"ECR", status:"Active"   },
  { id:"BT-006", name:"Satellite",  code:"SAT", status:"Inactive" },
];

const EMPTY: Row = { id:"", name:"", code:"", status:"Active" };
const STATUSES = ["All Status","Active","Inactive"];
const PAGE_SIZE = 10;

// Code badge colour palette (cycles by index)
const CODE_COLORS = [
  { bg:"#dbeafe", text:"#1d4ed8" },
  { bg:"#ede9fe", text:"#6d28d9" },
  { bg:"#cffafe", text:"#0e7490" },
  { bg:"#dcfce7", text:"#15803d" },
  { bg:"#fef9c3", text:"#a16207" },
  { bg:"#fee2e2", text:"#b91c1c" },
  { bg:"#fce7f3", text:"#9d174d" },
  { bg:"#f3f4f6", text:"#374151" },
];

const TH: React.CSSProperties = { padding:"11px 14px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap", textAlign:"left" };
const TD: React.CSSProperties = { padding:"11px 14px", verticalAlign:"middle", fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };
const LBL: React.CSSProperties = { display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" };
const INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", outline:"none", boxSizing:"border-box", background:"#fff" };

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BranchTypesPage() {
  const [rows, setRows]     = useState<Row[]>(SEED);
  const [form, setForm]     = useState<Row>({ ...EMPTY });
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState("All Status");
  const [page, setPage]       = useState(1);
  const [saved, setSaved]     = useState(false);

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    return (!q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
      && (statusF === "All Status" || r.status === statusF);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p     = Math.min(page, totalPages);
  const paged = filtered.slice((p-1)*PAGE_SIZE, p*PAGE_SIZE);
  const nums  = () => { const n:number[]=[]; for(let i=Math.max(1,p-2);i<=Math.min(totalPages,p+2);i++)n.push(i); return n; };

  const set = (k: keyof Row) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim() || !form.code.trim()) return;
    if (editing) {
      setRows(rs => rs.map(r => r.id === editing ? { ...form, id: editing } : r));
    } else {
      const id = `BT-${String(rows.length + 1).padStart(3,"0")}`;
      setRows(rs => [...rs, { ...form, id }]);
    }
    setForm({ ...EMPTY }); setEditing(null);
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const handleEdit   = (r: Row) => { setForm({ ...r }); setEditing(r.id); setSaved(false); };
  const handleDelete = (id: string) => { setRows(rs => rs.filter(r => r.id !== id)); if (editing===id) { setForm({...EMPTY}); setEditing(null); } };
  const handleCancel = () => { setForm({ ...EMPTY }); setEditing(null); };

  const canSave = form.name.trim() !== "" && form.code.trim() !== "";

  return (
    <div style={{ padding:"24px 0" }}>
      {/* Header */}
      <div style={{ marginBottom:4 }}>
        <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Branch Types</h4>
        <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>
          Dashboard / Banking Structure / <span style={{ color:"#16a34a", fontWeight:600 }}>Branch Types</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, margin:"16px 0 20px" }}>
        {[
          { label:"Total Types", value:rows.length,                                color:"#2563eb", bg:"#eff6ff", icon:"ri-git-branch-line",      border:"#2563eb" },
          { label:"Active",      value:rows.filter(r=>r.status==="Active").length, color:"#16a34a", bg:"#f0fdf4", icon:"ri-checkbox-circle-line", border:"#16a34a" },
          { label:"Inactive",    value:rows.filter(r=>r.status==="Inactive").length,color:"#dc2626",bg:"#fef2f2", icon:"ri-close-circle-line",     border:"#dc2626" },
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

      <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:18, alignItems:"start" }}>

        {/* ── FORM ─────────────────────────────────────────────── */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, position:"sticky", top:80 }}>

          {/* Card header */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ padding:"13px 18px", borderBottom:"1px solid #f3f4f6", background: editing?"#fffbeb":"#f9fafb", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:"#111827" }}>
                  {editing ? `Edit — ${editing}` : "Add Branch Type"}
                </div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>
                  {editing ? "Update the fields below" : "Enter name, code and status"}
                </div>
              </div>
              {editing && (
                <button onClick={handleCancel}
                  style={{ fontSize:11, color:"#6b7280", background:"#f3f4f6", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>
                  × Cancel
                </button>
              )}
            </div>

            <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:14 }}>

              {saved && (
                <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
                  <i className="ri-checkbox-circle-fill" style={{ color:"#16a34a", fontSize:16 }}/>
                  <span style={{ fontSize:12, fontWeight:700, color:"#15803d" }}>{editing ? "Updated" : "Saved"} successfully</span>
                </div>
              )}

              {/* Type Name */}
              <div>
                <label style={LBL}>Type Name <span style={{ color:"#dc2626" }}>*</span></label>
                <input value={form.name} onChange={set("name")} placeholder="e.g. Metro"
                  style={{ ...INP, borderColor: form.name.trim() ? "#86efac" : "#e5e7eb" }}/>
              </div>

              {/* Code */}
              <div>
                <label style={LBL}>Code <span style={{ color:"#dc2626" }}>*</span></label>
                <input value={form.code} onChange={e => setForm(f=>({...f, code: e.target.value.toUpperCase().slice(0,6)}))}
                  placeholder="e.g. MET"
                  style={{ ...INP, fontFamily:"monospace", fontWeight:700, letterSpacing:"0.08em", borderColor: form.code.trim() ? "#86efac" : "#e5e7eb" }}/>
                <div style={{ fontSize:10, color:"#9ca3af", marginTop:4 }}>Short identifier — max 6 characters, auto-uppercased</div>
              </div>

              {/* Status toggle */}
              <div>
                <label style={LBL}>Status</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <button onClick={() => setForm(f=>({...f, status:"Active"}))}
                    style={{ padding:"11px", borderRadius:10, border: form.status==="Active"?"2px solid #16a34a":"2px solid #e5e7eb",
                      background: form.status==="Active"?"#16a34a":"#fff",
                      color: form.status==="Active"?"#fff":"#6b7280",
                      cursor:"pointer", fontWeight:800, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"all 0.15s" }}>
                    <i className="ri-checkbox-circle-fill" style={{ fontSize:15 }}/>Active
                  </button>
                  <button onClick={() => setForm(f=>({...f, status:"Inactive"}))}
                    style={{ padding:"11px", borderRadius:10, border: form.status==="Inactive"?"2px solid #dc2626":"2px solid #e5e7eb",
                      background: form.status==="Inactive"?"#fef2f2":"#fff",
                      color: form.status==="Inactive"?"#dc2626":"#6b7280",
                      cursor:"pointer", fontWeight:800, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"all 0.15s" }}>
                    <i className="ri-close-circle-fill" style={{ fontSize:15 }}/>Inactive
                  </button>
                </div>
              </div>

              {/* Save */}
              <button onClick={handleSave} disabled={!canSave}
                style={{ width:"100%", padding:"12px", borderRadius:10, border:"none",
                  background: canSave ? (editing?"#0284c7":"#16a34a") : "#d1d5db",
                  color:"#fff", cursor: canSave ? "pointer" : "not-allowed",
                  fontWeight:800, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  boxShadow: canSave ? `0 4px 14px ${editing?"rgba(2,132,199,0.3)":"rgba(22,163,74,0.3)"}` : "none",
                  transition:"all 0.2s" }}>
                <i className={editing ? "ri-save-line" : "ri-add-line"}/>
                {editing ? "Update Type" : "Save Type"}
              </button>
            </div>
          </div>
        </div>

        {/* ── TABLE ────────────────────────────────────────────── */}
        <div>
          {/* Filter bar */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            <div style={{ fontSize:12, color:"#6b7280" }}>
              Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> types
            </div>
            <div style={{ flex:1 }}/>
            <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}} style={SEL}>
              {STATUSES.map(s=><option key={s}>{s}</option>)}
            </select>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 10px" }}>
              <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:13 }}/>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Name or code…"
                style={{ border:"none", outline:"none", fontSize:12, color:"#374151", width:140 }}/>
              {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:13 }}>×</button>}
            </div>
          </div>

          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>
                  <th style={TH}>ID</th>
                  <th style={TH}>TYPE NAME</th>
                  <th style={TH}>CODE</th>
                  <th style={{ ...TH, textAlign:"center" }}>STATUS</th>
                  <th style={{ ...TH, textAlign:"center" }}>ACTION</th>
                </tr></thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding:"50px", textAlign:"center", color:"#9ca3af" }}>
                      <i className="ri-git-branch-line" style={{ fontSize:32, display:"block", marginBottom:8, opacity:0.3 }}/>
                      No branch types found
                    </td></tr>
                  ) : paged.map((r, idx) => {
                    const isEd = editing === r.id;
                    // find real index in rows array for consistent colour
                    const colorIdx = rows.findIndex(x => x.id === r.id) % CODE_COLORS.length;
                    const cc = CODE_COLORS[colorIdx];
                    return (
                      <tr key={r.id}
                        style={{ background: isEd ? "#f0fdf4" : idx%2===0 ? "#fff" : "transparent" }}
                        onMouseEnter={e=>{ if(!isEd) e.currentTarget.style.background="#f9fafb"; }}
                        onMouseLeave={e=>{ if(!isEd) e.currentTarget.style.background= idx%2===0?"#fff":"transparent"; }}>

                        <td style={TD}>
                          <span style={{ fontSize:11, fontWeight:700, color:"#374151", background:"#f3f4f6", borderRadius:5, padding:"2px 8px", fontFamily:"monospace" }}>{r.id}</span>
                        </td>

                        <td style={TD}>
                          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                            <div style={{ width:30, height:30, borderRadius:8, background:cc.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <i className="ri-git-branch-line" style={{ fontSize:13, color:cc.text }}/>
                            </div>
                            <span style={{ fontWeight:700, color:"#111827" }}>{r.name}</span>
                          </div>
                        </td>

                        <td style={TD}>
                          <span style={{ fontSize:12, fontWeight:800, color:cc.text, background:cc.bg, borderRadius:8, padding:"4px 12px", fontFamily:"monospace", letterSpacing:"0.06em", display:"inline-block" }}>
                            {r.code}
                          </span>
                        </td>

                        <td style={{ ...TD, textAlign:"center" }}>
                          <span style={{ fontSize:11, fontWeight:700, color:r.status==="Active"?"#16a34a":"#dc2626", background:r.status==="Active"?"#dcfce7":"#fee2e2", borderRadius:20, padding:"3px 12px" }}>
                            {r.status}
                          </span>
                        </td>

                        <td style={{ ...TD, textAlign:"center" }}>
                          <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                            <button onClick={()=>handleEdit(r)}
                              style={{ width:28, height:28, borderRadius:6, border:`1px solid ${isEd?"#16a34a":"#e5e7eb"}`, background:isEd?"#dcfce7":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:isEd?"#16a34a":"#2563eb" }}>
                              <i className="ri-edit-line" style={{ fontSize:13 }}/>
                            </button>
                            <button onClick={()=>handleDelete(r.id)}
                              style={{ width:28, height:28, borderRadius:6, border:"1px solid #fee2e2", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}>
                              <i className="ri-delete-bin-line" style={{ fontSize:13 }}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ padding:"10px 16px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafafa" }}>
              <span style={{ fontSize:11, color:"#6b7280" }}>
                Showing <strong style={{ color:"#111827" }}>{Math.min((p-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(p*PAGE_SIZE,filtered.length)}</strong> of <strong style={{ color:"#111827" }}>{filtered.length}</strong>
              </span>
              <div style={{ display:"flex", gap:3 }}>
                <button onClick={()=>setPage(pp=>Math.max(1,pp-1))} disabled={p===1}
                  style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===1?"#f9fafb":"#fff", color:p===1?"#d1d5db":"#374151", cursor:p===1?"not-allowed":"pointer", fontSize:12 }}>‹</button>
                {nums().map(n=>(
                  <button key={n} onClick={()=>setPage(n)}
                    style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, fontSize:12, fontWeight:n===p?700:400, background:n===p?"#16a34a":"#fff", color:n===p?"#fff":"#374151", cursor:"pointer" }}>{n}</button>
                ))}
                <button onClick={()=>setPage(pp=>Math.min(totalPages,pp+1))} disabled={p===totalPages}
                  style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===totalPages?"#f9fafb":"#fff", color:p===totalPages?"#d1d5db":"#374151", cursor:p===totalPages?"not-allowed":"pointer", fontSize:12 }}>›</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
