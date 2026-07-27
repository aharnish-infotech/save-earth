"use client";
import React, { useState } from "react";
import {
  Audit, AuditStatus, AUDITS, AUDIT_BANKS, AUDIT_AUDITORS,
  STATUS_STYLE, scoreColor, scoreBg,
} from "@/lib/data/audits";

// ── Shared styles ─────────────────────────────────────────────────────────────
const TH: React.CSSProperties = {
  padding:"10px 14px", fontSize:11, fontWeight:700, color:"#6b7280",
  textTransform:"uppercase", letterSpacing:"0.04em",
  borderBottom:"2px solid #dcfce7", background:"#f9fafb", whiteSpace:"nowrap",
};
const TD: React.CSSProperties = { padding:"11px 14px", verticalAlign:"middle", fontSize:13 };
const INP: React.CSSProperties = {
  border:"1px solid var(--default-border)", borderRadius:8, padding:"7px 12px",
  fontSize:13, color:"var(--default-text-color)", background:"var(--custom-white)", outline:"none",
};
const PB: React.CSSProperties = {
  display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px",
  background:"var(--primary-color,#16a34a)", color:"#fff", border:"none",
  borderRadius:9, fontWeight:700, fontSize:13, cursor:"pointer",
};
const OB: React.CSSProperties = {
  display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px",
  background:"transparent", color:"var(--default-text-color)",
  border:"1px solid var(--default-border)", borderRadius:8, fontWeight:600,
  fontSize:12, cursor:"pointer",
};

const PAGE_SIZE = 10;

interface Props {
  statusFilter?: AuditStatus | null;  // null = All
  title: string;
  subtitle: string;
  primaryAction?: { label: string; icon: string; color?: string };
  secondaryAction?: { label: string; icon: string };
  showScoreCols?: boolean;
  showProgressCol?: boolean;
  showStatusCol?: boolean;
  showWorkflowAction?: React.ReactNode;
}

export default function AuditTable({
  statusFilter,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  showScoreCols = true,
  showProgressCol = false,
  showStatusCol = false,
}: Props) {
  const base = statusFilter ? AUDITS.filter(a => a.status === statusFilter) : AUDITS;

  const [search,  setSearch]  = useState("");
  const [bankF,   setBankF]   = useState("All Banks");
  const [auditorF,setAuditorF]= useState("All Auditors");
  const [page,    setPage]    = useState(1);
  const [rows,    setRows]    = useState<Audit[]>(base);

  const filtered = rows.filter(a => {
    const q = search.toLowerCase();
    const mQ = !q || a.id.toLowerCase().includes(q) || a.branch.toLowerCase().includes(q)
              || a.bank.toLowerCase().includes(q) || a.auditor.toLowerCase().includes(q)
              || (a.city + " " + a.state).toLowerCase().includes(q);
    const mB = bankF   === "All Banks"     || a.bank    === bankF;
    const mA = auditorF === "All Auditors" || a.auditor === auditorF;
    return mQ && mB && mA;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage-1)*PAGE_SIZE, safePage*PAGE_SIZE);
  const hasFilter  = search || bankF !== "All Banks" || auditorF !== "All Auditors";
  const clearF     = () => { setSearch(""); setBankF("All Banks"); setAuditorF("All Auditors"); setPage(1); };
  const pageNums   = () => { const n:number[]=[]; for(let i=Math.max(1,safePage-2);i<=Math.min(totalPages,safePage+2);i++)n.push(i); return n; };

  // Stats
  const total     = rows.length;
  const overdue   = rows.filter(a => a.status==="In Progress").length;

  return (
    <div style={{ padding:"1.5rem 0" }}>
      {/* Page header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <div>
          <h4 style={{ fontSize:20, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>{title}</h4>
          <p style={{ fontSize:12, color:"var(--text-muted)", margin:"3px 0 0" }}>{total} records · {subtitle}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {secondaryAction && (
            <button style={OB}><i className={secondaryAction.icon}/> {secondaryAction.label}</button>
          )}
          {primaryAction && (
            <button style={{ ...PB, background: primaryAction.color ?? "var(--primary-color)" }}>
              <i className={primaryAction.icon}/> {primaryAction.label}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", padding:"12px 16px", display:"flex", gap:10, alignItems:"center", marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flex:"1 1 220px", background:"var(--default-background)", borderRadius:8, padding:"0 12px", border:"1px solid var(--default-border)" }}>
          <i className="ri-search-line" style={{ color:"var(--text-muted)", fontSize:14 }}/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by Audit ID, branch, bank, auditor…"
            style={{ border:"none", background:"transparent", outline:"none", fontSize:13, padding:"8px 0", width:"100%" }}/>
          {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)" }}><i className="ri-close-line"/></button>}
        </div>
        <select value={bankF} onChange={e=>{setBankF(e.target.value);setPage(1);}} style={{ ...INP, padding:"7px 12px", minWidth:140 }}>
          {AUDIT_BANKS.map(b=><option key={b}>{b}</option>)}
        </select>
        <select value={auditorF} onChange={e=>{setAuditorF(e.target.value);setPage(1);}} style={{ ...INP, padding:"7px 12px", minWidth:150 }}>
          {AUDIT_AUDITORS.map(a=><option key={a}>{a}</option>)}
        </select>
        {hasFilter && <button onClick={clearF} style={{ ...OB, fontSize:12, color:"#dc2626", borderColor:"#fecaca" }}><i className="ri-refresh-line"/> Clear</button>}
        <span style={{ marginLeft:"auto", fontSize:12, color:"var(--text-muted)" }}>{filtered.length} result{filtered.length!==1?"s":""}</span>
      </div>

      {/* Table */}
      <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 2px 8px rgba(22,163,74,0.05)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                <th style={TH}>Audit ID</th>
                <th style={{ ...TH, textAlign:"left" }}>Bank / Branch</th>
                <th style={{ ...TH, textAlign:"left" }}>Auditor</th>
                <th style={{ ...TH, textAlign:"left" }}>Coordinator</th>
                {showProgressCol && <th style={{ ...TH, textAlign:"center" }}>Progress</th>}
                <th style={{ ...TH, textAlign:"center" }}>Due Date</th>
                {showScoreCols && <th style={{ ...TH, textAlign:"center" }}>Score</th>}
                {showScoreCols && <th style={{ ...TH, textAlign:"center" }}>NCR</th>}
                {showStatusCol && <th style={{ ...TH, textAlign:"center" }}>Status</th>}
                <th style={{ ...TH, textAlign:"center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={10} style={{ padding:"60px 24px", textAlign:"center", color:"var(--text-muted)" }}>
                  <i className="ri-file-search-line" style={{ fontSize:40, display:"block", marginBottom:8, opacity:0.3 }}/>
                  No audits found
                </td></tr>
              ) : paged.map((a, i) => {
                const ss = STATUS_STYLE[a.status];
                const today = new Date("2024-07-27");
                const due   = new Date(a.dueDate.split(" ").reverse().map((x,j) => j===2?x:j===1?["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(x)+1:x).join("-"));
                const daysLeft = Math.ceil((due.getTime() - today.getTime()) / 86400000);
                const isOverdue = daysLeft < 0 && (a.status === "In Progress" || a.status === "Completed");

                return (
                  <tr key={a.id} style={{ borderTop:i>0?"1px solid var(--default-border)":undefined, background:isOverdue?"#fff7f7":"transparent" }}>
                    {/* Audit ID */}
                    <td style={{ ...TD, textAlign:"center" }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#15803d", background:"#dcfce7", borderRadius:6, padding:"2px 8px" }}>{a.id}</span>
                    </td>
                    {/* Bank / Branch */}
                    <td style={TD}>
                      <div style={{ fontWeight:700, fontSize:13, color:"var(--default-text-color)" }}>{a.branch}</div>
                      <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:1 }}>
                        <i className="ri-bank-line" style={{ fontSize:10, marginRight:3 }}/>{a.bank} · {a.city}, {a.state}
                      </div>
                    </td>
                    {/* Auditor */}
                    <td style={TD}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:28, height:28, borderRadius:8, background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:9, fontWeight:700, flexShrink:0 }}>
                          {a.auditor.split(" ").map(w=>w[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <div style={{ fontSize:12.5, fontWeight:600, color:"var(--default-text-color)" }}>{a.auditor}</div>
                          <div style={{ fontSize:10, color:"var(--text-muted)" }}>{a.auditorId}</div>
                        </div>
                      </div>
                    </td>
                    {/* Coordinator */}
                    <td style={{ ...TD, fontSize:12, color:"var(--text-muted)" }}>{a.coordinator}</td>
                    {/* Progress */}
                    {showProgressCol && (
                      <td style={{ ...TD, textAlign:"center", minWidth:110 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ flex:1, height:6, borderRadius:3, background:"#e5e7eb", overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${a.progress}%`, background:a.progress>=70?"#16a34a":a.progress>=30?"#ca8a04":"#dc2626", borderRadius:3 }}/>
                          </div>
                          <span style={{ fontSize:11, fontWeight:700, color:"#374151", minWidth:26 }}>{a.progress}%</span>
                        </div>
                      </td>
                    )}
                    {/* Due Date */}
                    <td style={{ ...TD, textAlign:"center" }}>
                      <div style={{ fontSize:12, fontWeight:600, color:isOverdue?"#dc2626":"var(--default-text-color)" }}>{a.dueDate}</div>
                      {isOverdue && <div style={{ fontSize:10, fontWeight:700, color:"#dc2626" }}>OVERDUE</div>}
                    </td>
                    {/* Score */}
                    {showScoreCols && (
                      <td style={{ ...TD, textAlign:"center" }}>
                        {a.score != null
                          ? <span style={{ fontSize:12, fontWeight:800, color:scoreColor(a.score), background:scoreBg(a.score), borderRadius:6, padding:"2px 8px" }}>{a.score}%</span>
                          : <span style={{ fontSize:11, color:"var(--text-muted)" }}>—</span>
                        }
                      </td>
                    )}
                    {/* NCR */}
                    {showScoreCols && (
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ fontSize:12, fontWeight:700, color:a.ncr>0?"#dc2626":"#16a34a" }}>
                          {a.ncr > 0 ? <><i className="ri-error-warning-line" style={{ marginRight:3 }}/>{a.ncr}</> : <i className="ri-checkbox-circle-fill"/>}
                        </span>
                      </td>
                    )}
                    {/* Status */}
                    {showStatusCol && (
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:ss.color, background:ss.bg, borderRadius:20, padding:"2px 10px" }}>
                          <i className={ss.icon} style={{ fontSize:11 }}/>{a.status}
                        </span>
                      </td>
                    )}
                    {/* Actions — slot filled by parent via children */}
                    <td style={{ ...TD, textAlign:"center" }}>
                      <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                        <button title="View Audit" style={{ width:28, height:28, borderRadius:7, border:"1px solid var(--default-border)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--primary-color)" }}>
                          <i className="ri-eye-line" style={{ fontSize:13 }}/>
                        </button>
                        <button title="Download Report" style={{ width:28, height:28, borderRadius:7, border:"1px solid var(--default-border)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#0891b2" }}>
                          <i className="ri-download-line" style={{ fontSize:13 }}/>
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
        {totalPages > 1 && (
          <div style={{ padding:"12px 16px", borderTop:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"var(--text-muted)" }}>
              Showing {(safePage-1)*PAGE_SIZE+1}–{Math.min(safePage*PAGE_SIZE,filtered.length)} of {filtered.length}
            </span>
            <div style={{ display:"flex", gap:4 }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={safePage===1} style={{ padding:"5px 10px", border:"1px solid var(--default-border)", borderRadius:7, background:"transparent", cursor:safePage===1?"not-allowed":"pointer", color:safePage===1?"var(--text-muted)":"var(--default-text-color)", fontSize:12 }}>
                <i className="ri-arrow-left-s-line"/>
              </button>
              {pageNums().map(n=>(
                <button key={n} onClick={()=>setPage(n)} style={{ padding:"5px 10px", border:"1px solid var(--default-border)", borderRadius:7, fontSize:12, fontWeight:n===safePage?700:400, background:n===safePage?"var(--primary-color)":"transparent", color:n===safePage?"#fff":"var(--default-text-color)", cursor:"pointer" }}>{n}</button>
              ))}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={safePage===totalPages} style={{ padding:"5px 10px", border:"1px solid var(--default-border)", borderRadius:7, background:"transparent", cursor:safePage===totalPages?"not-allowed":"pointer", color:safePage===totalPages?"var(--text-muted)":"var(--default-text-color)", fontSize:12 }}>
                <i className="ri-arrow-right-s-line"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
