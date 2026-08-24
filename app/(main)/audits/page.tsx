"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AUDITS, AUDIT_BANKS, AUDIT_AUDITORS, STATUS_STYLE, AuditStatus } from "@/lib/data/audits";

const TH: React.CSSProperties = {
  padding: "11px 16px", fontSize: 11, fontWeight: 700,
  color: "#6b7280", textTransform: "uppercase" as const,
  letterSpacing: "0.05em", background: "#f9fafb",
  borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" as const,
  textAlign: "left" as const,
};
const TD: React.CSSProperties = {
  padding: "13px 16px", verticalAlign: "middle" as const,
  fontSize: 13, color: "#374151", borderBottom: "1px solid #f3f4f6",
};
const SEL: React.CSSProperties = {
  border: "1px solid #e5e7eb", borderRadius: 7, padding: "6px 10px",
  fontSize: 12, color: "#374151", background: "#fff", outline: "none",
  cursor: "pointer", height: 34,
};

const ALL_STATUS: AuditStatus[] = ["In Progress", "Completed", "Pending Review", "Approved", "Delivered"];
const PAGE_SIZE = 15;

export default function AllAuditsPage() {
  const [search,   setSearch]   = useState("");
  const [bankF,    setBankF]    = useState("All Banks");
  const [statusF,  setStatusF]  = useState("All Status");
  const [auditorF, setAuditorF] = useState("All Auditors");
  const [page,     setPage]     = useState(1);

  const reset = () => setPage(1);

  const filtered = AUDITS.filter(a => {
    const q = search.toLowerCase();
    const mQ = !q
      || a.id.toLowerCase().includes(q)
      || a.branch.toLowerCase().includes(q)
      || a.bank.toLowerCase().includes(q)
      || a.branchCode.toLowerCase().includes(q)
      || a.auditor.toLowerCase().includes(q);
    return mQ
      && (bankF    === "All Banks"    || a.bank    === bankF)
      && (statusF  === "All Status"   || a.status  === statusF)
      && (auditorF === "All Auditors" || a.auditor === auditorF);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p          = Math.min(page, totalPages);
  const paged      = filtered.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
  const nums       = () => {
    const n: number[] = [];
    for (let i = Math.max(1, p - 2); i <= Math.min(totalPages, p + 2); i++) n.push(i);
    return n;
  };

  const byStatus = (s: AuditStatus) => AUDITS.filter(a => a.status === s).length;
  const hasFilter = bankF !== "All Banks" || statusF !== "All Status" || auditorF !== "All Auditors" || !!search;
  const clear = () => { setSearch(""); setBankF("All Banks"); setStatusF("All Status"); setAuditorF("All Auditors"); setPage(1); };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .zf-sidebar, .zf-topbar { display: none !important; }
        }
      `}</style>

      <div className="container-fluid" style={{ padding: "24px 0" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
          <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>All Audits</h4>
          <div className="no-print" style={{ display:"flex", gap:8 }}>
            <button onClick={() => window.print()}
              style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", border:"1px solid #e5e7eb", borderRadius:8, background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", color:"#374151" }}>
              <i className="ri-printer-line" /> Print
            </button>
            <button style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", border:"1px solid #e5e7eb", borderRadius:8, background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", color:"#374151" }}>
              <i className="ri-download-2-line" /> Export
            </button>
            <button style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", background:"var(--primary-color,#16a34a)", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
              <i className="ri-add-line" /> New Audit
            </button>
          </div>
        </div>
        <div style={{ fontSize:12, color:"#9ca3af", marginBottom:20 }}>
          Dashboard / <span style={{ color:"#16a34a", fontWeight:600 }}>All Audits</span>
        </div>

        {/* Status stat cards */}
        <div className="no-print" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12, marginBottom:20 }}>
          {([
            { label:"Total",    value:AUDITS.length, color:"#7c3aed", bg:"#f5f3ff", icon:"ri-file-list-3-line" },
            ...ALL_STATUS.map(s => ({ label:s, value:byStatus(s), color:STATUS_STYLE[s].color, bg:STATUS_STYLE[s].bg, icon:STATUS_STYLE[s].icon })),
          ] as {label:string;value:number;color:string;bg:string;icon:string}[]).map(c => (
            <div key={c.label}
              onClick={() => { setStatusF(c.label === "Total" ? "All Status" : statusF === c.label ? "All Status" : c.label); reset(); }}
              style={{ background:"#fff", borderRadius:12, border:`1px solid ${statusF === c.label ? c.color : "#e5e7eb"}`, padding:"14px 12px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", borderLeft:`4px solid ${c.color}`, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", transition:"border-color 0.15s" }}>
              <div style={{ width:36, height:36, borderRadius:9, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className={c.icon} style={{ fontSize:17, color:c.color }} />
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
                <div style={{ fontSize:10, color:"#9ca3af", fontWeight:600, marginTop:2, whiteSpace:"nowrap" }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="no-print" style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"12px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:7, padding:"5px 10px", minWidth:230, flex:1 }}>
            <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:14, flexShrink:0 }} />
            <input value={search} onChange={e => { setSearch(e.target.value); reset(); }}
              placeholder="Search by Audit ID, Bank, Branch, IFSC…"
              style={{ border:"none", outline:"none", fontSize:12, color:"#374151", background:"transparent", width:"100%" }} />
            {search && (
              <button onClick={() => { setSearch(""); reset(); }}
                style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:14, flexShrink:0 }}>×</button>
            )}
          </div>

          {/* Bank */}
          <select value={bankF} onChange={e => { setBankF(e.target.value); reset(); }} style={SEL}>
            {AUDIT_BANKS.map(b => <option key={b}>{b}</option>)}
          </select>

          {/* Audited By */}
          <select value={auditorF} onChange={e => { setAuditorF(e.target.value); reset(); }} style={SEL}>
            {AUDIT_AUDITORS.map(a => <option key={a}>{a}</option>)}
          </select>

          {/* Status */}
          <select value={statusF} onChange={e => { setStatusF(e.target.value); reset(); }} style={SEL}>
            <option>All Status</option>
            {ALL_STATUS.map(s => <option key={s}>{s}</option>)}
          </select>

          {hasFilter && (
            <button onClick={clear}
              style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"5px 12px", border:"1px solid #fca5a5", borderRadius:7, background:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", color:"#dc2626" }}>
              <i className="ri-close-line" style={{ fontSize:13 }} /> Clear
            </button>
          )}

          <span style={{ marginLeft:"auto", fontSize:12, color:"#6b7280", whiteSpace:"nowrap" }}>
            <strong style={{ color:"#111827" }}>{filtered.length}</strong> records · Page <strong style={{ color:"#111827" }}>{p}</strong> / {totalPages}
          </span>
        </div>

        {/* Table */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...TH, width:40 }}>#</th>
                  <th style={TH}>Audit ID</th>
                  <th style={TH}>Bank / Branch / IFSC</th>
                  <th style={TH}>Audited By</th>
                  <th style={{ ...TH, textAlign:"center" }}>Audit Date</th>
                  <th style={{ ...TH, textAlign:"center" }}>HT / LT</th>
                  <th style={{ ...TH, textAlign:"center" }}>Photos</th>
                  <th style={{ ...TH, textAlign:"center" }}>GPS</th>
                  <th style={{ ...TH, textAlign:"center" }}>Status</th>
                  <th className="no-print" style={{ ...TH, textAlign:"center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={11} style={{ padding:"60px 24px", textAlign:"center", color:"#9ca3af" }}>
                    <i className="ri-file-search-line" style={{ fontSize:36, display:"block", marginBottom:8, opacity:0.3 }} />
                    No audits match your filters
                  </td></tr>
                ) : paged.map((a, idx) => {
                  const ss = STATUS_STYLE[a.status];
                  return (
                    <tr key={a.id}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      style={{ transition:"background 0.1s" }}>

                      {/* # */}
                      <td style={{ ...TD, color:"#d1d5db", fontSize:12 }}>{(p-1)*PAGE_SIZE+idx+1}</td>

                      {/* Audit ID */}
                      <td style={TD}>
                        <span style={{ fontSize:12, fontWeight:700, color:"#15803d", background:"#dcfce7", borderRadius:6, padding:"3px 10px", fontFamily:"monospace", letterSpacing:"0.02em" }}>
                          {a.id}
                        </span>
                      </td>

                      {/* Bank / Branch / IFSC */}
                      <td style={TD}>
                        <div style={{ fontWeight:700, fontSize:13, color:"#111827" }}>{a.branch}</div>
                        <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>
                          <i className="ri-bank-line" style={{ fontSize:10, marginRight:3 }}/>{a.bank}
                        </div>
                        <div style={{ fontSize:10, color:"#9ca3af", marginTop:1, fontFamily:"monospace" }}>
                          {a.branchCode}
                        </div>
                      </td>

                      {/* Audited By */}
                      <td style={TD}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#16a34a,#15803d)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700, flexShrink:0 }}>
                            {a.auditor.split(" ").map(w => w[0]).join("").slice(0,2)}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:13, color:"#111827" }}>{a.auditor}</div>
                            <div style={{ fontSize:10, color:"#9ca3af" }}>{a.auditorId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Audit Date */}
                      <td style={{ ...TD, textAlign:"center" }}>
                        <div style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{a.startDate}</div>
                        <div style={{ fontSize:10, color:"#9ca3af", marginTop:1 }}>Due: {a.dueDate}</div>
                      </td>

                      {/* HT / LT */}
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{
                          fontSize:11, fontWeight:700, borderRadius:6, padding:"3px 10px",
                          color: a.htLt === "HT" ? "#9333ea" : "#0891b2",
                          background: a.htLt === "HT" ? "#f3e8ff" : "#cffafe",
                        }}>{a.htLt}</span>
                      </td>

                      {/* Photos */}
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12, color:"#6b7280", fontWeight:600 }}>
                          <i className="ri-camera-line" style={{ fontSize:13, color:"#9ca3af" }}/>{a.photos}
                        </span>
                      </td>

                      {/* GPS */}
                      <td style={{ ...TD, textAlign:"center" }}>
                        {a.gps ? (
                          <a
                            href={`https://www.google.com/maps?q=${a.gps.lat},${a.gps.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Open in Google Maps (${a.gps.lat}, ${a.gps.lng})`}
                            style={{ display:"inline-flex", alignItems:"center", gap:4, textDecoration:"none", color:"#16a34a", fontSize:12, fontWeight:600 }}>
                            <span style={{ width:8, height:8, borderRadius:"50%", background:"#16a34a", display:"inline-block", boxShadow:"0 0 0 2px #bbf7d0" }} />
                            <i className="ri-map-pin-line" style={{ fontSize:13 }}/>
                          </a>
                        ) : (
                          <span title="GPS not captured" style={{ display:"inline-flex", alignItems:"center", gap:4, color:"#d1d5db", fontSize:12 }}>
                            <span style={{ width:8, height:8, borderRadius:"50%", background:"#d1d5db", display:"inline-block" }} />
                            <i className="ri-map-pin-line" style={{ fontSize:13 }}/>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:ss.color, background:ss.bg, borderRadius:20, padding:"4px 10px", whiteSpace:"nowrap" }}>
                          <i className={ss.icon} style={{ fontSize:11 }}/>{a.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="no-print" style={{ ...TD, textAlign:"center" }}>
                        <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
                          <button title="View"
                            style={{ width:30, height:30, borderRadius:7, border:"1px solid #dcfce7", background:"#f0fdf4", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#16a34a" }}>
                            <i className="ri-eye-line" style={{ fontSize:14 }}/>
                          </button>
                          <Link href="/audit-form" title="Edit"
                            style={{ width:30, height:30, borderRadius:7, border:"1px solid #dbeafe", background:"#eff6ff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#2563eb", textDecoration:"none" }}>
                            <i className="ri-edit-line" style={{ fontSize:14 }}/>
                          </Link>
                          <button title="Print" onClick={() => window.print()}
                            style={{ width:30, height:30, borderRadius:7, border:"1px solid #e5e7eb", background:"#f9fafb", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280" }}>
                            <i className="ri-printer-line" style={{ fontSize:14 }}/>
                          </button>
                          <button title="Delete"
                            style={{ width:30, height:30, borderRadius:7, border:"1px solid #fee2e2", background:"#fff5f5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}>
                            <i className="ri-delete-bin-line" style={{ fontSize:14 }}/>
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
          <div className="no-print" style={{ padding:"12px 20px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafafa" }}>
            <span style={{ fontSize:12, color:"#6b7280" }}>
              Showing <strong style={{ color:"#111827" }}>{Math.min((p-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(p*PAGE_SIZE,filtered.length)}</strong> of <strong style={{ color:"#111827" }}>{filtered.length}</strong>
            </span>
            <div style={{ display:"flex", gap:4 }}>
              <button onClick={() => setPage(pp => Math.max(1,pp-1))} disabled={p===1}
                style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:p===1?"#f9fafb":"#fff", color:p===1?"#d1d5db":"#374151", cursor:p===1?"not-allowed":"pointer", fontSize:12 }}>‹</button>
              {nums().map(n => (
                <button key={n} onClick={() => setPage(n)}
                  style={{ padding:"5px 11px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:12, fontWeight:n===p?700:400, background:n===p?"#16a34a":"#fff", color:n===p?"#fff":"#374151", cursor:"pointer" }}>{n}</button>
              ))}
              <button onClick={() => setPage(pp => Math.min(totalPages,pp+1))} disabled={p===totalPages}
                style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:p===totalPages?"#f9fafb":"#fff", color:p===totalPages?"#d1d5db":"#374151", cursor:p===totalPages?"not-allowed":"pointer", fontSize:12 }}>›</button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
