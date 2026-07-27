"use client";
import React, { useState } from "react";
import { AUDITS, AUDIT_BANKS, AUDIT_AUDITORS, scoreColor, scoreBg } from "@/lib/data/audits";

const TH: React.CSSProperties = { padding:"11px 16px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase" as const, letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap" as const, textAlign:"left" as const };
const TD: React.CSSProperties = { padding:"12px 16px", verticalAlign:"middle" as const, fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };
const PAGE_SIZE = 15;

export default function ApprovedPage() {
  const base = AUDITS.filter(a => a.status === "Approved");
  const [search, setSearch]     = useState("");
  const [bankF,  setBankF]      = useState("All Banks");
  const [auditorF, setAuditorF] = useState("All Auditors");
  const [page, setPage]         = useState(1);

  const filtered = base.filter(a => {
    const q = search.toLowerCase();
    return (!q || a.id.toLowerCase().includes(q) || a.branch.toLowerCase().includes(q) || a.auditor.toLowerCase().includes(q))
      && (bankF === "All Banks" || a.bank === bankF)
      && (auditorF === "All Auditors" || a.auditor === auditorF);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p          = Math.min(page, totalPages);
  const paged      = filtered.slice((p-1)*PAGE_SIZE, p*PAGE_SIZE);
  const nums = () => { const n:number[]=[]; for(let i=Math.max(1,p-2);i<=Math.min(totalPages,p+2);i++)n.push(i); return n; };

  const withScore = base.filter(a => a.score !== undefined);
  const avgScore  = withScore.length ? Math.round(withScore.reduce((s,a) => s+(a.score??0),0)/withScore.length) : 0;

  return (
    <div style={{ padding:"24px 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Approved Audits</h4>
      </div>
      <div style={{ fontSize:12, color:"#9ca3af", marginBottom:16 }}>Dashboard / Audit Operations / <span style={{ color:"#16a34a", fontWeight:600 }}>Approved</span></div>

      {/* Workflow Banner */}
      <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"12px 18px", display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <i className="ri-checkbox-circle-line" style={{ color:"#16a34a", fontSize:17 }}/>
        <span style={{ fontSize:12, color:"#15803d", fontWeight:500 }}>
          <strong>Step 4 — Deliver to Client:</strong> Admin has approved. Generate the PDF report and mark as Delivered to notify the client.
        </span>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"Approved",         value:base.length,    color:"#16a34a", bg:"#f0fdf4", icon:"ri-checkbox-circle-line", border:"#16a34a" },
          { label:"Avg. Score",       value:`${avgScore}%`, color:"#0891b2", bg:"#ecfeff", icon:"ri-bar-chart-2-line",     border:"#0891b2" },
          { label:"Ready to Deliver", value:base.length,    color:"#7c3aed", bg:"#f5f3ff", icon:"ri-send-plane-line",      border:"#7c3aed" },
          { label:"Total NCRs",       value:base.reduce((s,a)=>s+a.ncr,0), color:"#ca8a04", bg:"#fefce8", icon:"ri-alert-line", border:"#ca8a04" },
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

      {/* Filters */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ fontSize:13, color:"#6b7280" }}>
          Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> audits — Page <strong style={{ color:"#111827" }}>{p}</strong> of {totalPages}
        </div>
        <div style={{ flex:1 }} />
        <select value={bankF} onChange={e=>{setBankF(e.target.value);setPage(1);}} style={SEL}>
          {AUDIT_BANKS.map(b=><option key={b}>{b}</option>)}
        </select>
        <select value={auditorF} onChange={e=>{setAuditorF(e.target.value);setPage(1);}} style={SEL}>
          {AUDIT_AUDITORS.map(a=><option key={a}>{a}</option>)}
        </select>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 12px" }}>
          <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:14 }}/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search audit ID, branch, auditor…"
            style={{ border:"none", outline:"none", fontSize:12, color:"#374151", width:200 }}/>
          {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:14 }}>×</button>}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <th style={TH}>AUDIT ID</th>
              <th style={TH}>BANK / BRANCH</th>
              <th style={TH}>AUDITOR</th>
              <th style={TH}>COORDINATOR</th>
              <th style={{ ...TH, textAlign:"center" }}>SCORE</th>
              <th style={{ ...TH, textAlign:"center" }}>NCR</th>
              <th style={{ ...TH, textAlign:"center" }}>APPROVED ON</th>
              <th style={{ ...TH, textAlign:"center" }}>ACTION</th>
            </tr></thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={8} style={{ padding:"60px 24px", textAlign:"center", color:"#9ca3af" }}>
                  <i className="ri-checkbox-circle-line" style={{ fontSize:36, display:"block", marginBottom:8, opacity:0.3 }}/>No approved audits
                </td></tr>
              ) : paged.map(a => (
                <tr key={a.id} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={TD}>
                    <span style={{ fontSize:11, fontWeight:700, color:"#16a34a", background:"#dcfce7", borderRadius:6, padding:"3px 10px", fontFamily:"monospace" }}>{a.id}</span>
                  </td>
                  <td style={TD}>
                    <div style={{ fontWeight:700, color:"#111827" }}>{a.branch}</div>
                    <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{a.bank} · {a.city}</div>
                  </td>
                  <td style={TD}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700, flexShrink:0 }}>
                        {a.auditor.split(" ").map(w=>w[0]).join("").slice(0,2)}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13 }}>{a.auditor}</div>
                        <div style={{ fontSize:10, color:"#9ca3af" }}>{a.auditorId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...TD, color:"#6b7280", fontSize:12 }}>{a.coordinator}</td>
                  <td style={{ ...TD, textAlign:"center" }}>
                    {a.score !== undefined ? (
                      <span style={{ fontSize:12, fontWeight:800, color:scoreColor(a.score), background:scoreBg(a.score), borderRadius:6, padding:"3px 10px" }}>{a.score}%</span>
                    ) : <span style={{ color:"#9ca3af", fontSize:12 }}>—</span>}
                  </td>
                  <td style={{ ...TD, textAlign:"center" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:a.ncr>0?"#dc2626":"#16a34a" }}>{a.ncr}</span>
                  </td>
                  <td style={{ ...TD, textAlign:"center", color:"#6b7280", fontSize:12 }}>{a.approvedDate || "—"}</td>
                  <td style={{ ...TD, textAlign:"center" }}>
                    <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                      <button title="Generate PDF" style={{ padding:"5px 10px", borderRadius:7, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}><i className="ri-file-pdf-line" style={{ fontSize:12 }}/>PDF</button>
                      <button title="Mark Delivered" style={{ padding:"5px 10px", borderRadius:7, border:"none", background:"#16a34a", color:"#fff", cursor:"pointer", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}><i className="ri-send-plane-line" style={{ fontSize:12 }}/>Deliver</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"12px 20px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafafa" }}>
          <span style={{ fontSize:12, color:"#6b7280" }}>Showing <strong style={{ color:"#111827" }}>{Math.min((p-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(p*PAGE_SIZE,filtered.length)}</strong> of <strong style={{ color:"#111827" }}>{filtered.length}</strong></span>
          <div style={{ display:"flex", gap:4 }}>
            <button onClick={()=>setPage(pp=>Math.max(1,pp-1))} disabled={p===1} style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:p===1?"#f9fafb":"#fff", color:p===1?"#d1d5db":"#374151", cursor:p===1?"not-allowed":"pointer", fontSize:12 }}>‹</button>
            {nums().map(n=><button key={n} onClick={()=>setPage(n)} style={{ padding:"5px 11px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:12, fontWeight:n===p?700:400, background:n===p?"#16a34a":"#fff", color:n===p?"#fff":"#374151", cursor:"pointer" }}>{n}</button>)}
            <button onClick={()=>setPage(pp=>Math.min(totalPages,pp+1))} disabled={p===totalPages} style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:p===totalPages?"#f9fafb":"#fff", color:p===totalPages?"#d1d5db":"#374151", cursor:p===totalPages?"not-allowed":"pointer", fontSize:12 }}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
