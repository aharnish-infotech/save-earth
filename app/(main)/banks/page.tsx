"use client";
import React, { useState, useRef } from "react";

// ── UUID helper ────────────────────────────────────────────────────────────────
const uuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
});

// ── Types ──────────────────────────────────────────────────────────────────────
interface Bank {
  id:         string;   // UUID — DB primary key
  bankCode:   string;   // "BNK-001" — display reference code
  name:       string;
  code:       string;   // 4-char IFSC prefix e.g. SBIN
  hq:         string;
  state:      string;
  branches:   number;
  status:     "Active" | "Inactive";
}

// ── Seed — 16 banks with verified IFSC prefixes, HQ city & state ──────────────
const mkB = (bankCode: string, name: string, code: string, hq: string, state: string): Bank => ({
  id: uuid(), bankCode, name, code, hq, state, branches: 0, status: "Active",
});

const SEED: Bank[] = [
  mkB("BNK-001", "State Bank of India",     "SBIN", "Mumbai",      "Maharashtra"),
  mkB("BNK-002", "HDFC Bank",               "HDFC", "Mumbai",      "Maharashtra"),
  mkB("BNK-003", "ICICI Bank",              "ICIC", "Mumbai",      "Maharashtra"),
  mkB("BNK-004", "Axis Bank",               "UTIB", "Mumbai",      "Maharashtra"),
  mkB("BNK-005", "Bank of Baroda",          "BARB", "Vadodara",    "Gujarat"),
  mkB("BNK-006", "Punjab National Bank",    "PUNB", "New Delhi",   "Delhi"),
  mkB("BNK-007", "Canara Bank",             "CNRB", "Bengaluru",   "Karnataka"),
  mkB("BNK-008", "Union Bank of India",     "UBIN", "Mumbai",      "Maharashtra"),
  mkB("BNK-009", "Bank of India",           "BKID", "Mumbai",      "Maharashtra"),
  mkB("BNK-010", "Bank of Maharashtra",     "MAHB", "Pune",        "Maharashtra"),
  mkB("BNK-011", "Central Bank of India",   "CBIN", "Mumbai",      "Maharashtra"),
  mkB("BNK-012", "Indian Bank",             "IDIB", "Chennai",     "Tamil Nadu"),
  mkB("BNK-013", "IDBI Bank",               "IBKL", "Mumbai",      "Maharashtra"),
  mkB("BNK-014", "Kotak Mahindra Bank",     "KKBK", "Mumbai",      "Maharashtra"),
  mkB("BNK-015", "IndusInd Bank",           "INDB", "Pune",        "Maharashtra"),
  mkB("BNK-016", "Yes Bank",                "YESB", "Mumbai",      "Maharashtra"),
];

// branches is a derived count from the branches table — NOT a user-editable field
type FormData = Omit<Bank, "id" | "bankCode" | "branches">;
const EMPTY: FormData = { name:"", code:"", hq:"", state:"", status:"Active" };
const STATUSES = ["All Status","Active","Inactive"];
const PAGE_SIZE = 10;

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal",
  // UTs
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu",
  "Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

// ── JSON syntax highlighter ────────────────────────────────────────────────────
function colorizeJson(json: string): React.ReactNode {
  const regex = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\],])/g;
  const nodes: React.ReactNode[] = [];
  let last = 0; let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(json)) !== null) {
    if (m.index > last) nodes.push(<span key={key++} style={{ color:"#d4d4d4" }}>{json.slice(last, m.index)}</span>);
    const v = m[0];
    let col = "#d4d4d4";
    if (/^"/.test(v))           col = /:$/.test(v) ? "#9cdcfe" : "#ce9178";
    else if (/true|false/.test(v)) col = "#569cd6";
    else if (v === "null")      col = "#569cd6";
    else if (!isNaN(+v))        col = "#b5cea8";
    nodes.push(<span key={key++} style={{ color: col }}>{v}</span>);
    last = regex.lastIndex;
  }
  if (last < json.length) nodes.push(<span key={key++} style={{ color:"#d4d4d4" }}>{json.slice(last)}</span>);
  return <>{nodes}</>;
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const TH: React.CSSProperties = { padding:"11px 14px", fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase" as const, letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap" as const, textAlign:"left" as const };
const TD: React.CSSProperties = { padding:"11px 14px", verticalAlign:"middle" as const, fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };
const LBL: React.CSSProperties = { display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:4, textTransform:"uppercase" as const, letterSpacing:"0.04em" };
const INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 11px", fontSize:13, color:"#374151", outline:"none", boxSizing:"border-box" as const, background:"#fff" };

export default function BanksPage() {
  const [rows,    setRows]    = useState<Bank[]>(SEED);
  const [form,    setForm]    = useState<FormData>({ ...EMPTY });
  const [editId,  setEditId]  = useState<string | null>(null);
  const [search,  setSearch]  = useState("");
  const [statusF, setStatusF] = useState("All Status");
  const [page,    setPage]    = useState(1);
  const [copied,  setCopied]  = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const downloadCSV = () => {
    const headers = ["Code","Bank Name","IFSC Prefix","HQ City","HQ State","Status"];
    const csvRows = rows.map(r => [r.bankCode, `"${r.name.replace(/"/g,'""')}"`, r.code, r.hq, r.state, r.status]);
    const csv = [headers.join(","), ...csvRows.map(r => r.join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
    a.download = `banks-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const editRow = rows.find(r => r.id === editId) ?? null;

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    return (!q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.bankCode.toLowerCase().includes(q) || r.hq.toLowerCase().includes(q) || r.state.toLowerCase().includes(q))
      && (statusF === "All Status" || r.status === statusF);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p     = Math.min(page, totalPages);
  const paged = filtered.slice((p-1)*PAGE_SIZE, p*PAGE_SIZE);

  // Ellipsis pagination
  const pageItems = (): (number | "...")[] => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const items: number[] = [];
    const add = (n: number) => { if (!items.includes(n)) items.push(n); };
    add(1); add(2);
    for (let i = Math.max(3, p-1); i <= Math.min(totalPages-1, p+1); i++) add(i);
    add(totalPages);
    const result: (number | "...")[] = [];
    let prev = 0;
    for (const item of items) {
      if (item - prev > 1) result.push("...");
      result.push(item);
      prev = item;
    }
    return result;
  };

  const fp = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim() || form.code.length !== 4) return;
    if (editId) {
      // branches is derived — preserve existing count, only update form fields
      setRows(rs => rs.map(r => r.id === editId ? { ...r, ...form } : r));
    } else {
      const maxNum = rows.reduce((m, r) => {
        const n = parseInt(r.bankCode.replace("BNK-",""), 10);
        return isNaN(n) ? m : Math.max(m, n);
      }, 0);
      const newCode = `BNK-${String(maxNum + 1).padStart(3, "0")}`;
      // branches: 0 — will be updated via the Branches module (FK relationship)
      setRows(rs => [...rs, { id: uuid(), bankCode: newCode, branches: 0, ...form }]);
    }
    setForm({ ...EMPTY });
    setEditId(null);
  };

  const handleEdit   = (r: Bank) => {
    setForm({ name:r.name, code:r.code, hq:r.hq, state:r.state, status:r.status });
    setEditId(r.id);
    // Scroll form panel into view — works correctly inside any scroll container
    setTimeout(() => formRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 50);
  };
  const handleCancel = () => { setForm({ ...EMPTY }); setEditId(null); };
  const toggleStatus = (id: string) => setRows(rs => rs.map(r => r.id===id ? { ...r, status: r.status==="Active"?"Inactive":"Active" } : r));

  const codeValid = form.code.length === 0 || form.code.length === 4;

  return (
    <div style={{ padding:"24px 0" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <div>
          <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Banks</h4>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>
            Dashboard / Banking Structure / <span style={{ color:"#16a34a", fontWeight:600 }}>Banks</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, margin:"16px 0 20px" }}>
        {[
          { label:"Total Banks",    value: rows.length,                                  color:"#2563eb", bg:"#eff6ff", icon:"ri-bank-line",            border:"#2563eb" },
          { label:"Active",         value: rows.filter(r=>r.status==="Active").length,   color:"#16a34a", bg:"#f0fdf4", icon:"ri-checkbox-circle-line", border:"#16a34a" },
          { label:"Inactive",       value: rows.filter(r=>r.status==="Inactive").length, color:"#dc2626", bg:"#fef2f2", icon:"ri-close-circle-line",    border:"#dc2626" },
          { label:"States Covered",  value: new Set(rows.filter(r=>r.state).map(r=>r.state)).size, color:"#7c3aed", bg:"#f5f3ff", icon:"ri-map-pin-2-line", border:"#7c3aed" },
        ].map(c => (
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

      {/* Split layout */}
      <div style={{ display:"grid", gridTemplateColumns:"360px 1fr", gap:18, alignItems:"start", gridAutoRows:"min-content" }}>

        {/* LEFT — Form + API Payload */}
        <div ref={formRef} style={{ display:"flex", flexDirection:"column", gap:14, position:"sticky", top:80 }}>
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>

          {/* Panel header */}
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #f3f4f6", background: editId ? "#fffbeb" : "#f0fdf4" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:"#111827", display:"flex", alignItems:"center", gap:7 }}>
                  <i className={editId ? "ri-edit-line" : "ri-bank-line"} style={{ fontSize:15, color: editId ? "#d97706" : "#16a34a" }}/>
                  {editId ? `Edit — ${editRow?.bankCode}` : "Add New Bank"}
                </div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>
                  {editId ? "Modify bank details and update" : "Fill details and save to register bank"}
                </div>
              </div>
              {editId && (
                <button onClick={handleCancel} style={{ fontSize:11, color:"#6b7280", background:"#f3f4f6", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:13 }}>

            {/* Bank Name */}
            <div>
              <label style={LBL}>Bank Name <span style={{ color:"#dc2626" }}>*</span></label>
              <input value={form.name} onChange={fp("name")} placeholder="e.g. State Bank of India" style={INP}/>
            </div>

            {/* Bank Code */}
            <div>
              <label style={LBL}>IFSC Bank Code (4 Characters) <span style={{ color:"#dc2626" }}>*</span></label>
              <input
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase().slice(0,4) }))}
                placeholder="e.g. SBIN"
                maxLength={4}
                style={{ ...INP, fontFamily:"monospace", fontWeight:700, fontSize:15, letterSpacing:"0.12em",
                  borderColor: !codeValid ? "#dc2626" : form.code.length === 4 ? "#16a34a" : "#e5e7eb" }}
              />
              <div style={{ fontSize:10, marginTop:4, color: !codeValid ? "#dc2626" : form.code.length===4 ? "#16a34a" : "#9ca3af", fontWeight:600 }}>
                {form.code.length}/4 characters
                {form.code.length===4 && " ✓"}
                {!codeValid && " — must be exactly 4 alphabets"}
              </div>
            </div>

            {/* HQ City + State */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={LBL}>HQ City</label>
                <input value={form.hq} onChange={fp("hq")} placeholder="Mumbai" style={INP}/>
              </div>
              <div>
                <label style={LBL}>HQ State</label>
                <select value={form.state} onChange={fp("state")} style={{ ...INP, cursor:"pointer" }}>
                  <option value="">Select State</option>
                  {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label style={LBL}>Status</label>
              <div style={{ display:"flex", border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden" }}>
                {(["Active","Inactive"] as const).map((s, i) => {
                  const sel = form.status === s;
                  const col = s === "Active" ? "#16a34a" : "#dc2626";
                  return (
                    <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                      style={{ flex:1, padding:"8px", border:"none", borderRight:i<1?"1px solid #e5e7eb":"none", cursor:"pointer", fontSize:12, fontWeight:700, background: sel ? col : "#fff", color: sel ? "#fff" : col, transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                      <i className={s==="Active" ? "ri-checkbox-circle-line" : "ri-close-circle-line"} style={{ fontSize:13 }}/>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={!form.name.trim() || form.code.length !== 4}
              style={{ width:"100%", padding:"10px", borderRadius:8, border:"none", background: (!form.name.trim() || form.code.length!==4) ? "#9ca3af" : editId ? "#2563eb" : "#16a34a", color:"#fff", cursor: (!form.name.trim() || form.code.length!==4) ? "not-allowed":"pointer", fontWeight:700, fontSize:13, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <i className={editId ? "ri-save-line" : "ri-add-circle-line"}/>
              {editId ? "Update Bank" : "Save Bank"}
            </button>

          </div>
        </div>

        {/* ── API Payload — separate card below form ──────────────────────────── */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ padding:"11px 16px", borderBottom:"1px solid #f3f4f6", background:"#f8fafc", display:"flex", alignItems:"center", gap:7 }}>
            <i className="ri-code-s-slash-line" style={{ fontSize:14, color:"#2563eb" }}/>
            <span style={{ fontSize:12, fontWeight:800, color:"#111827" }}>API Payload</span>
            <span style={{ fontSize:10, color:"#9ca3af", marginLeft:2 }}>Live preview of what will be sent</span>
          </div>

          {/* Toolbar */}
          <div style={{ background:"#0d1117", padding:"6px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:10, color:"#3d444d", fontWeight:600, letterSpacing:"0.05em" }}>application/json</span>
            <button
              onClick={() => {
                const payload = JSON.stringify({
                  id:       editId ? editRow?.id        : "(uuid — auto-generated on save)",
                  bankCode: editId ? editRow?.bankCode  : "(e.g. BNK-017 — auto-assigned)",
                  name:     form.name    || "(empty)",
                  code:     form.code    || "(empty)",
                  hq:       form.hq      || "(empty)",
                  state:    form.state   || "(empty)",
                  branches: "(derived — count of branches linked to this bank)",
                  status:   form.status,
                }, null, 2);
                navigator.clipboard.writeText(payload).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:6, border:"1px solid #30363d", background:copied?"#238636":"#21262d", color:copied?"#fff":"#8b949e", fontSize:10, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
              <i className={copied ? "ri-check-line" : "ri-file-copy-line"} style={{ fontSize:11 }}/>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Highlighted JSON */}
          <pre style={{ margin:0, padding:"14px 16px", fontSize:11, background:"#0d1117", overflowX:"auto", overflowY:"auto", maxHeight:260, lineHeight:1.7, fontFamily:"'Courier New', Consolas, monospace" }}>
{colorizeJson(JSON.stringify({
  id:       editId ? editRow?.id        : "(uuid — auto-generated on save)",
  bankCode: editId ? editRow?.bankCode  : "(e.g. BNK-017 — auto-assigned)",
  name:     form.name    || "(empty)",
  code:     form.code    || "(empty)",
  hq:       form.hq      || "(empty)",
  state:    form.state   || "(empty)",
  branches: "(derived — count of branches linked to this bank)",
  status:   form.status,
}, null, 2))}
          </pre>
        </div>

        </div>

        {/* RIGHT — Table */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" as const }}>
            <div style={{ fontSize:12, color:"#6b7280" }}>
              Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> banks
            </div>
            <div style={{ flex:1 }}/>
            <button onClick={downloadCSV}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 13px", borderRadius:7, border:"1px solid #d1fae5", background:"#f0fdf4", color:"#16a34a", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              <i className="ri-download-2-line" style={{ fontSize:13 }}/>Export CSV
            </button>
            <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}} style={SEL}>
              {STATUSES.map(s=><option key={s}>{s}</option>)}
            </select>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 10px" }}>
              <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:13 }}/>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
                placeholder="Search bank name or code…"
                style={{ border:"none", outline:"none", fontSize:12, color:"#374151", width:180 }}/>
              {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:13 }}>×</button>}
            </div>
          </div>

          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>
                  <th style={TH}>ID</th>
                  <th style={TH}>BANK NAME</th>
                  <th style={{ ...TH, textAlign:"center" }}>IFSC BANK CODE</th>
                  <th style={TH}>HQ CITY</th>
                  <th style={TH}>STATE</th>
                  <th style={{ ...TH, textAlign:"center" }}>BRANCHES</th>
                  <th style={{ ...TH, textAlign:"center" }}>STATUS</th>
                  <th style={{ ...TH, textAlign:"center" }}>ACTION</th>
                </tr></thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding:"50px", textAlign:"center", color:"#9ca3af" }}>
                      <i className="ri-bank-line" style={{ fontSize:32, display:"block", marginBottom:8, opacity:0.3 }}/>No banks found
                    </td></tr>
                  ) : paged.map(r => {
                    const isEd = editId === r.id;
                    return (
                      <tr key={r.id}
                        style={{ background: isEd ? "#fffbeb" : "transparent", transition:"background 0.15s" }}
                        onMouseEnter={e=>{if(!isEd) e.currentTarget.style.background="#f9fafb";}}
                        onMouseLeave={e=>{if(!isEd) e.currentTarget.style.background="transparent";}}>
                        <td style={TD}>
                          <span style={{ fontSize:11, fontWeight:700, color:"#374151", background:"#f3f4f6", borderRadius:5, padding:"2px 8px", fontFamily:"monospace" }}>{r.bankCode}</span>
                        </td>
                        <td style={TD}>
                          <div style={{ fontWeight:700, color:"#111827" }}>{r.name}</div>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <span style={{ fontSize:13, fontWeight:800, color:"#2563eb", background:"#dbeafe", borderRadius:6, padding:"3px 10px", fontFamily:"monospace", letterSpacing:"0.08em" }}>{r.code}</span>
                        </td>
                        <td style={{ ...TD, fontSize:12, color:"#6b7280" }}>{r.hq}</td>
                        <td style={{ ...TD, fontSize:12, color:"#6b7280" }}>{r.state}</td>
                        <td style={{ ...TD, textAlign:"center", fontWeight:700, color:r.branches>0?"#2563eb":"#9ca3af" }}>{r.branches}</td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <button onClick={()=>toggleStatus(r.id)}
                            style={{ fontSize:10, fontWeight:700, color:r.status==="Active"?"#16a34a":"#dc2626", background:r.status==="Active"?"#dcfce7":"#fee2e2", border:"none", borderRadius:20, padding:"3px 10px", cursor:"pointer" }}>
                            {r.status}
                          </button>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
                            <button onClick={()=>handleEdit(r)} title="Edit"
                              style={{ width:28, height:28, borderRadius:6, border:`1px solid ${isEd?"#fbbf24":"#e5e7eb"}`, background:isEd?"#fef9c3":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:isEd?"#d97706":"#2563eb" }}>
                              <i className="ri-edit-line" style={{ fontSize:13 }}/>
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
              <span style={{ fontSize:11, color:"#6b7280" }}>Showing <strong style={{ color:"#111827" }}>{Math.min((p-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(p*PAGE_SIZE,filtered.length)}</strong> of <strong style={{ color:"#111827" }}>{filtered.length}</strong></span>
              <div style={{ display:"flex", gap:3 }}>
                <button onClick={()=>setPage(pp=>Math.max(1,pp-1))} disabled={p===1} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===1?"#f9fafb":"#fff", color:p===1?"#d1d5db":"#374151", cursor:p===1?"not-allowed":"pointer", fontSize:12 }}>‹</button>
                {pageItems().map((item, idx) =>
                  item === "..."
                    ? <span key={`e-${idx}`} style={{ padding:"4px 6px", fontSize:12, color:"#9ca3af", userSelect:"none" }}>…</span>
                    : <button key={item} onClick={()=>setPage(item)} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, fontSize:12, fontWeight:item===p?700:400, background:item===p?"#16a34a":"#fff", color:item===p?"#fff":"#374151", cursor:"pointer" }}>{item}</button>
                )}
                <button onClick={()=>setPage(pp=>Math.min(totalPages,pp+1))} disabled={p===totalPages} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===totalPages?"#f9fafb":"#fff", color:p===totalPages?"#d1d5db":"#374151", cursor:p===totalPages?"not-allowed":"pointer", fontSize:12 }}>›</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
