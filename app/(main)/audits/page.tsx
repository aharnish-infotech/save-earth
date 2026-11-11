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

const ALL_STATUS: AuditStatus[] = ["In Progress", "Draft", "Completed", "Delivered", "Cancelled"];
const PAGE_SIZE = 15;

function exportCSV(data: typeof AUDITS) {
  const headers = ["Audit ID","Bank","Branch","IFSC","Auditor","Auditor ID","Audit Date","HT/LT","Photos","GPS Lat","GPS Lng","Status"];
  const rows = data.map(a => [
    a.id, a.bank, a.branch, a.branchCode, a.auditor, a.auditorId,
    a.startDate, a.htLt, a.photos,
    a.gps?.lat ?? "", a.gps?.lng ?? "", a.status,
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "audits.csv"; a.click();
  URL.revokeObjectURL(url);
}

function exportXLS(data: typeof AUDITS) {
  const headers = ["Audit ID","Bank","Branch","IFSC","Auditor","Auditor ID","Audit Date","HT/LT","Photos","GPS Lat","GPS Lng","Status"];
  const rows = data.map(a => [
    a.id, a.bank, a.branch, a.branchCode, a.auditor, a.auditorId,
    a.startDate, a.htLt, a.photos,
    a.gps?.lat ?? "", a.gps?.lng ?? "", a.status,
  ]);
  const table = `<table><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</table>`;
  const blob = new Blob([`<html><body>${table}</body></html>`], { type:"application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "audits.xls"; a.click();
  URL.revokeObjectURL(url);
}

type ConfirmAction = "deliver" | "cancel";
interface ConfirmState {
  action: ConfirmAction;
  id: string;
  auditBranch: string;
}

export default function AllAuditsPage() {
  const [auditList,   setAuditList]   = useState(() => [...AUDITS]);
  const [search,      setSearch]      = useState("");
  const [bankF,       setBankF]       = useState("All Banks");
  const [statusF,     setStatusF]     = useState("All Status");
  const [auditorF,    setAuditorF]    = useState("All Auditors");
  const [exportOpen,  setExportOpen]  = useState(false);
  const [page,        setPage]        = useState(1);
  const [openMenuId,  setOpenMenuId]  = useState<string | null>(null);
  const [confirm,     setConfirm]     = useState<ConfirmState | null>(null);
  const [cancelNote,  setCancelNote]  = useState("");
  const [toastMsg,    setToastMsg]    = useState<string | null>(null);

  const reset = () => setPage(1);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const applyStatusChange = (id: string, status: AuditStatus) => {
    setAuditList(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.action === "deliver") {
      applyStatusChange(confirm.id, "Delivered");
      showToast(`${confirm.id} marked as Delivered`);
    } else {
      applyStatusChange(confirm.id, "Cancelled");
      showToast(`${confirm.id} cancelled`);
    }
    setConfirm(null);
    setCancelNote("");
    setOpenMenuId(null);
  };

  const filtered = auditList.filter(a => {
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

  const byStatus = (s: AuditStatus) => auditList.filter(a => a.status === s).length;
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
          <div className="no-print" style={{ display:"flex", gap:8, alignItems:"center" }}>

            {/* Export dropdown */}
            <div style={{ position:"relative" }}>
              <button onClick={() => setExportOpen(o => !o)}
                style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", border:"1px solid #e5e7eb", borderRadius:8, background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", color:"#374151" }}>
                <i className="ri-download-2-line" /> Export <i className="ri-arrow-down-s-line" style={{ fontSize:14, marginLeft:2 }}/>
              </button>
              {exportOpen && (
                <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, boxShadow:"0 8px 24px rgba(0,0,0,0.10)", zIndex:50, minWidth:140, overflow:"hidden" }}>
                  <button onClick={() => { exportXLS(filtered); setExportOpen(false); }}
                    style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 16px", background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#374151", fontWeight:600 }}
                    onMouseEnter={e => (e.currentTarget.style.background="#f9fafb")}
                    onMouseLeave={e => (e.currentTarget.style.background="none")}>
                    <i className="ri-file-excel-2-line" style={{ color:"#16a34a", fontSize:15 }}/> Export XLS
                  </button>
                  <div style={{ height:1, background:"#f3f4f6" }}/>
                  <button onClick={() => { exportCSV(filtered); setExportOpen(false); }}
                    style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 16px", background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#374151", fontWeight:600 }}
                    onMouseEnter={e => (e.currentTarget.style.background="#f9fafb")}
                    onMouseLeave={e => (e.currentTarget.style.background="none")}>
                    <i className="ri-file-text-line" style={{ color:"#2563eb", fontSize:15 }}/> Export CSV
                  </button>
                </div>
              )}
            </div>

            <button style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", background:"var(--primary-color,#16a34a)", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
              <i className="ri-add-line" /> New Audit
            </button>
          </div>
        </div>
        <div style={{ fontSize:12, color:"#9ca3af", marginBottom:20 }}>
          Dashboard / <span style={{ color:"#16a34a", fontWeight:600 }}>All Audits</span>
        </div>

        {/* Status stat cards */}
        <div className="no-print" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:20 }}>
          {([
            { label:"Total",    value:auditList.length, color:"#7c3aed", bg:"#f5f3ff", icon:"ri-file-list-3-line" },
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
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:7, padding:"5px 10px", width:220 }}>
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
                          <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#16a34a,#15803d)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700, flexShrink:0 }}>
                            {a.auditor.split(" ").filter(Boolean).map(w => w[0].toUpperCase()).filter((_, i, arr) => i === 0 || i === arr.length - 1).join("")}
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
                            style={{ display:"inline-flex", alignItems:"center", textDecoration:"none", color:"#16a34a" }}>
                            <i className="ri-map-pin-line" style={{ fontSize:16 }}/>
                          </a>
                        ) : (
                          <span title="GPS not captured" style={{ display:"inline-flex", alignItems:"center", color:"#dc2626" }}>
                            <i className="ri-map-pin-line" style={{ fontSize:16 }}/>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:ss.color, background:ss.bg, borderRadius:20, padding:"4px 10px", whiteSpace:"nowrap" }}>
                          <i className={ss.icon} style={{ fontSize:11 }}/>{a.status}
                        </span>
                      </td>

                      {/* Actions — 3-dot menu */}
                      <td className="no-print" style={{ ...TD, textAlign:"center" }}>
                        <div style={{ position:"relative", display:"inline-block" }}>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === a.id ? null : a.id)}
                            style={{ width:32, height:32, borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280", fontSize:18, fontWeight:700, letterSpacing:1 }}>
                            ⋯
                          </button>

                          {openMenuId === a.id && (
                            <div style={{ position:"absolute", top:"calc(100% + 4px)", right:0, background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", zIndex:100, minWidth:200, overflow:"hidden" }}
                              onMouseLeave={() => setOpenMenuId(null)}>

                              {/* View */}
                              <button style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"9px 14px", background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#374151", fontWeight:500 }}
                                onMouseEnter={e => (e.currentTarget.style.background="#f9fafb")}
                                onMouseLeave={e => (e.currentTarget.style.background="none")}>
                                <i className="ri-eye-line" style={{ fontSize:14, color:"#16a34a" }}/> View Audit
                              </button>

                              {/* Edit */}
                              <Link href="/audit-form"
                                style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"9px 14px", background:"none", textDecoration:"none", fontSize:13, color:"#374151", fontWeight:500 }}
                                onMouseEnter={e => (e.currentTarget.style.background="#f9fafb")}
                                onMouseLeave={e => (e.currentTarget.style.background="none")}>
                                <i className="ri-edit-line" style={{ fontSize:14, color:"#2563eb" }}/> Edit Audit
                              </Link>

                              {/* Report */}
                              <Link href={`/report/${a.id}`} target="_blank" rel="noopener noreferrer"
                                style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"9px 14px", background:"none", textDecoration:"none", fontSize:13, color:"#374151", fontWeight:500 }}
                                onMouseEnter={e => (e.currentTarget.style.background="#f9fafb")}
                                onMouseLeave={e => (e.currentTarget.style.background="none")}>
                                <i className="ri-printer-line" style={{ fontSize:14, color:"#d97706" }}/> View / Print Report
                              </Link>

                              {/* Divider */}
                              <div style={{ height:1, background:"#f3f4f6", margin:"4px 0" }}/>

                              {/* Mark as Delivered */}
                              {(() => {
                                const canDeliver = a.status === "Completed";
                                return (
                                  <button
                                    disabled={!canDeliver}
                                    onClick={() => canDeliver && setConfirm({ action:"deliver", id:a.id, auditBranch:a.branch })}
                                    style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"9px 14px", background:"none", border:"none", cursor:canDeliver?"pointer":"not-allowed", fontSize:13, color:canDeliver?"#0891b2":"#d1d5db", fontWeight:500 }}
                                    onMouseEnter={e => { if (canDeliver) e.currentTarget.style.background="#e0f2fe"; }}
                                    onMouseLeave={e => (e.currentTarget.style.background="none")}
                                    title={canDeliver ? "Mark as Delivered" : "Only Completed audits can be delivered"}>
                                    <i className="ri-send-plane-line" style={{ fontSize:14, color:canDeliver?"#0891b2":"#d1d5db" }}/>
                                    Mark as Delivered
                                    {!canDeliver && <span style={{ fontSize:10, color:"#d1d5db", marginLeft:"auto" }}>Needs Completed</span>}
                                  </button>
                                );
                              })()}

                              {/* Mark as Cancelled */}
                              {(() => {
                                const canCancel = a.status !== "Delivered" && a.status !== "Cancelled";
                                return (
                                  <button
                                    disabled={!canCancel}
                                    onClick={() => canCancel && setConfirm({ action:"cancel", id:a.id, auditBranch:a.branch })}
                                    style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"9px 14px", background:"none", border:"none", cursor:canCancel?"pointer":"not-allowed", fontSize:13, color:canCancel?"#dc2626":"#d1d5db", fontWeight:500 }}
                                    onMouseEnter={e => { if (canCancel) e.currentTarget.style.background="#fff5f5"; }}
                                    onMouseLeave={e => (e.currentTarget.style.background="none")}
                                    title={!canCancel ? "Cannot cancel a Delivered or already Cancelled audit" : "Cancel this audit (admin only)"}>
                                    <i className="ri-close-circle-line" style={{ fontSize:14, color:canCancel?"#dc2626":"#d1d5db" }}/>
                                    Mark as Cancelled
                                    {!canCancel && <span style={{ fontSize:10, color:"#d1d5db", marginLeft:"auto" }}>Not allowed</span>}
                                  </button>
                                );
                              })()}

                              {/* Divider */}
                              <div style={{ height:1, background:"#f3f4f6", margin:"4px 0" }}/>

                              {/* Delete */}
                              <button
                                style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"9px 14px", background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#dc2626", fontWeight:500 }}
                                onMouseEnter={e => (e.currentTarget.style.background="#fff5f5")}
                                onMouseLeave={e => (e.currentTarget.style.background="none")}>
                                <i className="ri-delete-bin-line" style={{ fontSize:14 }}/> Delete
                              </button>
                            </div>
                          )}
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

      {/* ── Toast ── */}
      {toastMsg && (
        <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", background:"#111827", color:"#fff", fontSize:13, fontWeight:600, borderRadius:10, padding:"10px 20px", boxShadow:"0 8px 24px rgba(0,0,0,0.18)", zIndex:200, display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap" }}>
          <i className="ri-checkbox-circle-fill" style={{ fontSize:16, color:"#4ade80" }}/>{toastMsg}
        </div>
      )}

      {/* ── Confirm Modal ── */}
      {confirm && (
        <div style={{ position:"fixed", inset:0, zIndex:150, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {/* Overlay */}
          <div onClick={() => { setConfirm(null); setCancelNote(""); }}
            style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)" }}/>

          {/* Modal */}
          <div style={{ position:"relative", background:"#fff", borderRadius:14, boxShadow:"0 24px 60px rgba(0,0,0,0.18)", width:420, maxWidth:"90vw", padding:0, overflow:"hidden" }}>

            {/* Modal header */}
            <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, background: confirm.action === "deliver" ? "#e0f2fe" : "#fee2e2", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className={confirm.action === "deliver" ? "ri-send-plane-line" : "ri-close-circle-line"}
                  style={{ fontSize:18, color: confirm.action === "deliver" ? "#0891b2" : "#dc2626" }}/>
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>
                  {confirm.action === "deliver" ? "Mark as Delivered" : "Mark as Cancelled"}
                </div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>{confirm.id} · {confirm.auditBranch}</div>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ padding:"16px 20px" }}>
              {confirm.action === "deliver" ? (
                <p style={{ fontSize:13, color:"#374151", lineHeight:1.6, margin:0 }}>
                  This will mark the audit as <strong>Delivered</strong>. The status will be frozen and cannot be changed back.
                  This action is irreversible.
                </p>
              ) : (
                <>
                  <p style={{ fontSize:13, color:"#374151", lineHeight:1.6, margin:"0 0 12px" }}>
                    This will permanently <strong style={{ color:"#dc2626" }}>cancel</strong> the audit. The audit will be frozen and excluded from active reports. This action is for <strong>admin use only</strong>.
                  </p>
                  <label style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:5 }}>
                    Reason for cancellation <span style={{ color:"#dc2626" }}>*</span>
                  </label>
                  <textarea value={cancelNote} onChange={e => setCancelNote(e.target.value)}
                    rows={3} placeholder="e.g. Branch closed, duplicate entry, audit voided by supervisor…"
                    style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 10px", fontSize:12, color:"#374151", width:"100%", boxSizing:"border-box", outline:"none", resize:"vertical", lineHeight:1.55 }}/>
                </>
              )}
            </div>

            {/* Modal footer */}
            <div style={{ padding:"12px 20px 16px", display:"flex", gap:10, justifyContent:"flex-end", borderTop:"1px solid #f3f4f6" }}>
              <button onClick={() => { setConfirm(null); setCancelNote(""); }}
                style={{ padding:"8px 20px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirm.action === "cancel" && !cancelNote.trim()}
                style={{ padding:"8px 20px", borderRadius:8, border:"none",
                  background: confirm.action === "deliver" ? "#0891b2" : (cancelNote.trim() ? "#dc2626" : "#fca5a5"),
                  color:"#fff", fontSize:13, fontWeight:700,
                  cursor: confirm.action === "cancel" && !cancelNote.trim() ? "not-allowed" : "pointer" }}>
                {confirm.action === "deliver" ? "Yes, Mark Delivered" : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
