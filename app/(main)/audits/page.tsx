"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { AUDITS, AUDIT_BANKS, AUDIT_STATES, AUDIT_AUDITORS, STATUS_STYLE, AuditStatus, scoreColor, scoreBg } from "@/lib/data/audits";

const TH: React.CSSProperties = {
  padding: "11px 16px", fontSize: 11, fontWeight: 700,
  color: "#6b7280", textTransform: "uppercase" as const,
  letterSpacing: "0.05em", background: "#f9fafb",
  borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" as const,
  textAlign: "left" as const,
};
const TD: React.CSSProperties = {
  padding: "12px 16px", verticalAlign: "middle" as const,
  fontSize: 13, color: "#374151", borderBottom: "1px solid #f3f4f6",
};
const SEL: React.CSSProperties = {
  border: "1px solid #e5e7eb", borderRadius: 7, padding: "6px 10px",
  fontSize: 12, color: "#374151", background: "#fff", outline: "none", cursor: "pointer",
  height: 34,
};

const ALL_STATUS: AuditStatus[] = ["In Progress", "Completed", "Pending Review", "Approved", "Delivered"];
const COORDINATORS = ["All Coordinators", "Amit Singh", "Sunita Verma"];
const SCORE_OPTS   = ["All Scores", "Excellent (≥90%)", "Good (75–89%)", "Needs Improvement (<75%)", "Not Scored"];
const NCR_OPTS     = ["Any NCR", "Has NCR", "No NCR"];
const PAGE_SIZE = 15;

export default function AllAuditsPage() {
  const tableRef = useRef<HTMLDivElement>(null);

  const [search,      setSearch]      = useState("");
  const [bankF,       setBankF]       = useState("All Banks");
  const [statusF,     setStatusF]     = useState("All Status");
  const [auditorF,    setAuditorF]    = useState("All Auditors");
  const [stateF,      setStateF]      = useState("All States");
  const [coordF,      setCoordF]      = useState("All Coordinators");
  const [scoreF,      setScoreF]      = useState("All Scores");
  const [ncrF,        setNcrF]        = useState("Any NCR");
  const [page,        setPage]        = useState(1);

  const resetPage = () => setPage(1);

  const filtered = AUDITS.filter(a => {
    const q = search.toLowerCase();
    const mQ = !q
      || a.id.toLowerCase().includes(q)
      || a.branch.toLowerCase().includes(q)
      || a.bank.toLowerCase().includes(q)
      || a.auditor.toLowerCase().includes(q)
      || a.city.toLowerCase().includes(q);

    const mScore = scoreF === "All Scores"              ? true
      : scoreF === "Excellent (≥90%)"                   ? (a.score != null && a.score >= 90)
      : scoreF === "Good (75–89%)"                      ? (a.score != null && a.score >= 75 && a.score < 90)
      : scoreF === "Needs Improvement (<75%)"           ? (a.score != null && a.score < 75)
      : scoreF === "Not Scored"                         ? a.score == null
      : true;

    const mNcr = ncrF === "Any NCR" ? true : ncrF === "Has NCR" ? a.ncr > 0 : a.ncr === 0;

    return mQ
      && (bankF   === "All Banks"        || a.bank        === bankF)
      && (statusF === "All Status"       || a.status      === statusF)
      && (auditorF=== "All Auditors"     || a.auditor     === auditorF)
      && (stateF  === "All States"       || a.state       === stateF)
      && (coordF  === "All Coordinators" || a.coordinator === coordF)
      && mScore
      && mNcr;
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

  const hasActiveFilter = bankF !== "All Banks" || statusF !== "All Status" || auditorF !== "All Auditors"
    || stateF !== "All States" || coordF !== "All Coordinators" || scoreF !== "All Scores" || ncrF !== "Any NCR" || search;

  const clearFilters = () => {
    setSearch(""); setBankF("All Banks"); setStatusF("All Status"); setAuditorF("All Auditors");
    setStateF("All States"); setCoordF("All Coordinators"); setScoreF("All Scores"); setNcrF("Any NCR");
    setPage(1);
  };

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-table { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
          body { background: #fff !important; }
          .zf-sidebar, .zf-topbar { display: none !important; }
          .zf-main { margin: 0 !important; padding: 0 !important; }
        }
      `}</style>

      <div className="container-fluid" style={{ padding: "24px 0" }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h4 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>All Audits</h4>
          <div className="no-print" style={{ display: "flex", gap: 8 }}>
            <button onClick={handlePrint}
              style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", border:"1px solid #e5e7eb", borderRadius:8, background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", color:"#374151" }}>
              <i className="ri-printer-line" /> Print
            </button>
            <button
              style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", border:"1px solid #e5e7eb", borderRadius:8, background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", color:"#374151" }}>
              <i className="ri-download-2-line" /> Export
            </button>
            <button
              style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", background:"var(--primary-color,#16a34a)", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
              <i className="ri-add-line" /> New Audit
            </button>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>
          Dashboard / <span style={{ color: "#16a34a", fontWeight: 600 }}>All Audits</span>
        </div>

        {/* ── Stats cards ── */}
        <div className="no-print" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 20 }}>
          {([
            { label:"Total",         value:AUDITS.length,     color:"#7c3aed", bg:"#f5f3ff", icon:"ri-file-list-3-line" },
            ...ALL_STATUS.map(s => ({ label:s, value:byStatus(s), color:STATUS_STYLE[s].color, bg:STATUS_STYLE[s].bg, icon:STATUS_STYLE[s].icon })),
          ] as {label:string;value:number;color:string;bg:string;icon:string}[]).map(c => (
            <div key={c.label}
              onClick={() => { setStatusF(c.label === "Total" ? "All Status" : (statusF === c.label ? "All Status" : c.label)); resetPage(); }}
              style={{ background:"#fff", borderRadius:12, border:`1px solid ${statusF === c.label ? c.color : "#e5e7eb"}`, padding:"14px 12px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", borderLeft:`4px solid ${c.color}`, boxShadow:"0 1px 3px rgba(0,0,0,0.06)", transition:"border-color 0.15s" }}>
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

        {/* ── Filter row 1: primary filters ── */}
        <div className="no-print" style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"14px 16px", marginBottom:10, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em", flexShrink:0 }}>Filters</span>

            {/* Search */}
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:7, padding:"5px 10px", minWidth:220 }}>
              <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:14, flexShrink:0 }} />
              <input value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search ID, branch, auditor, city…"
                style={{ border:"none", outline:"none", fontSize:12, color:"#374151", background:"transparent", width:"100%" }} />
              {search && <button onClick={() => { setSearch(""); resetPage(); }}
                style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:14, flexShrink:0 }}>×</button>}
            </div>

            {/* Status */}
            <select value={statusF} onChange={e => { setStatusF(e.target.value); resetPage(); }} style={SEL}>
              <option>All Status</option>
              {ALL_STATUS.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* Bank */}
            <select value={bankF} onChange={e => { setBankF(e.target.value); resetPage(); }} style={SEL}>
              {AUDIT_BANKS.map(b => <option key={b}>{b}</option>)}
            </select>

            {/* Auditor (User) */}
            <select value={auditorF} onChange={e => { setAuditorF(e.target.value); resetPage(); }} style={SEL}>
              {AUDIT_AUDITORS.map(a => <option key={a}>{a}</option>)}
            </select>

            {/* State */}
            <select value={stateF} onChange={e => { setStateF(e.target.value); resetPage(); }} style={SEL}>
              {AUDIT_STATES.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* Coordinator */}
            <select value={coordF} onChange={e => { setCoordF(e.target.value); resetPage(); }} style={SEL}>
              {COORDINATORS.map(c => <option key={c}>{c}</option>)}
            </select>

            {/* Score */}
            <select value={scoreF} onChange={e => { setScoreF(e.target.value); resetPage(); }} style={SEL}>
              {SCORE_OPTS.map(o => <option key={o}>{o}</option>)}
            </select>

            {/* NCR */}
            <select value={ncrF} onChange={e => { setNcrF(e.target.value); resetPage(); }} style={SEL}>
              {NCR_OPTS.map(o => <option key={o}>{o}</option>)}
            </select>

            {hasActiveFilter && (
              <button onClick={clearFilters}
                style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"5px 12px", border:"1px solid #fca5a5", borderRadius:7, background:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", color:"#dc2626" }}>
                <i className="ri-close-line" style={{ fontSize:13 }} /> Clear
              </button>
            )}

            <div style={{ marginLeft:"auto", fontSize:12, color:"#6b7280" }}>
              <strong style={{ color:"#111827" }}>{filtered.length}</strong> audits &nbsp;·&nbsp; Page <strong style={{ color:"#111827" }}>{p}</strong> / {totalPages}
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="print-table" ref={tableRef} style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  <th style={TH}>#</th>
                  <th style={TH}>Audit ID</th>
                  <th style={TH}>Bank / Branch</th>
                  <th style={TH}>State</th>
                  <th style={TH}>Auditor</th>
                  <th style={TH}>Coordinator</th>
                  <th style={{ ...TH, textAlign:"center" }}>Progress</th>
                  <th style={{ ...TH, textAlign:"center" }}>Due Date</th>
                  <th style={{ ...TH, textAlign:"center" }}>Score</th>
                  <th style={{ ...TH, textAlign:"center" }}>NCR</th>
                  <th style={{ ...TH, textAlign:"center" }}>Status</th>
                  <th className="no-print" style={{ ...TH, textAlign:"center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={12} style={{ padding:"60px 24px", textAlign:"center", color:"#9ca3af" }}>
                    <i className="ri-file-search-line" style={{ fontSize:36, display:"block", marginBottom:8, opacity:0.3 }} />
                    No audits match your filters
                  </td></tr>
                ) : paged.map((a, idx) => {
                  const ss = STATUS_STYLE[a.status];
                  return (
                    <tr key={a.id}
                      style={{ transition:"background 0.1s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>

                      {/* # */}
                      <td style={{ ...TD, color:"#9ca3af", fontSize:12, width:40 }}>
                        {(p - 1) * PAGE_SIZE + idx + 1}
                      </td>

                      {/* Audit ID */}
                      <td style={TD}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#15803d", background:"#dcfce7", borderRadius:6, padding:"3px 10px", fontFamily:"monospace" }}>{a.id}</span>
                      </td>

                      {/* Bank / Branch */}
                      <td style={TD}>
                        <div style={{ fontWeight:700, fontSize:13, color:"#111827" }}>{a.branch}</div>
                        <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>
                          <i className="ri-bank-line" style={{ fontSize:10, marginRight:3 }}/>{a.bank} · {a.city}
                        </div>
                      </td>

                      {/* State */}
                      <td style={{ ...TD, fontSize:12, color:"#6b7280" }}>{a.state}</td>

                      {/* Auditor */}
                      <td style={TD}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:30, height:30, borderRadius:8, background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:10, fontWeight:700, flexShrink:0 }}>
                            {a.auditor.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:13, color:"#111827" }}>{a.auditor}</div>
                            <div style={{ fontSize:10, color:"#9ca3af" }}>{a.auditorId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Coordinator */}
                      <td style={{ ...TD, fontSize:12, color:"#6b7280" }}>{a.coordinator}</td>

                      {/* Progress */}
                      <td style={{ ...TD, textAlign:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"center" }}>
                          <div style={{ width:70, height:5, borderRadius:3, background:"#e5e7eb", overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${a.progress}%`, background:a.progress>=70?"#16a34a":a.progress>=30?"#ca8a04":"#dc2626", borderRadius:3 }} />
                          </div>
                          <span style={{ fontSize:11, fontWeight:700, color:"#374151", minWidth:28 }}>{a.progress}%</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td style={{ ...TD, textAlign:"center", fontSize:12, fontWeight:600 }}>{a.dueDate}</td>

                      {/* Score */}
                      <td style={{ ...TD, textAlign:"center" }}>
                        {a.score != null
                          ? <span style={{ fontSize:12, fontWeight:700, color:scoreColor(a.score), background:scoreBg(a.score), borderRadius:6, padding:"2px 9px" }}>{a.score}%</span>
                          : <span style={{ color:"#d1d5db" }}>—</span>}
                      </td>

                      {/* NCR */}
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ fontSize:12, fontWeight:700, color:a.ncr>0?"#dc2626":"#16a34a" }}>
                          {a.ncr > 0
                            ? <><i className="ri-error-warning-line" style={{ marginRight:2 }}/>{a.ncr}</>
                            : <i className="ri-checkbox-circle-fill"/>}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:ss.color, background:ss.bg, borderRadius:20, padding:"3px 10px", whiteSpace:"nowrap" }}>
                          <i className={ss.icon} style={{ fontSize:11 }}/>{a.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="no-print" style={{ ...TD, textAlign:"center" }}>
                        <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
                          <button title="View"
                            style={{ width:30, height:30, borderRadius:7, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#16a34a" }}>
                            <i className="ri-eye-line" style={{ fontSize:14 }}/>
                          </button>
                          <Link href="/audit-form" title="Edit"
                            style={{ width:30, height:30, borderRadius:7, border:"1px solid #dbeafe", background:"#eff6ff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#2563eb", textDecoration:"none" }}>
                            <i className="ri-edit-line" style={{ fontSize:14 }}/>
                          </Link>
                          <button title="Print"
                            onClick={handlePrint}
                            style={{ width:30, height:30, borderRadius:7, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280" }}>
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

          {/* ── Pagination ── */}
          <div className="no-print" style={{ padding:"12px 20px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafafa" }}>
            <span style={{ fontSize:12, color:"#6b7280" }}>
              Showing <strong style={{ color:"#111827" }}>{Math.min((p-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(p*PAGE_SIZE, filtered.length)}</strong> of <strong style={{ color:"#111827" }}>{filtered.length}</strong> audits
            </span>
            <div style={{ display:"flex", gap:4 }}>
              <button onClick={() => setPage(pp => Math.max(1, pp - 1))} disabled={p === 1}
                style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:p===1?"#f9fafb":"#fff", color:p===1?"#d1d5db":"#374151", cursor:p===1?"not-allowed":"pointer", fontSize:12 }}>‹</button>
              {nums().map(n => (
                <button key={n} onClick={() => setPage(n)}
                  style={{ padding:"5px 11px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:12, fontWeight:n===p?700:400, background:n===p?"#16a34a":"#fff", color:n===p?"#fff":"#374151", cursor:"pointer" }}>{n}</button>
              ))}
              <button onClick={() => setPage(pp => Math.min(totalPages, pp + 1))} disabled={p === totalPages}
                style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:p===totalPages?"#f9fafb":"#fff", color:p===totalPages?"#d1d5db":"#374151", cursor:p===totalPages?"not-allowed":"pointer", fontSize:12 }}>›</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
