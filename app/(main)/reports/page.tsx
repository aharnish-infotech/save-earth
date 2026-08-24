"use client";
import React, { useState } from "react";
import { AUDITS, AUDIT_BANKS, scoreColor, scoreBg } from "@/lib/data/audits";

const INP: React.CSSProperties = { border:"1px solid var(--default-border)", borderRadius:8, padding:"7px 12px", fontSize:13, color:"var(--default-text-color)", background:"var(--custom-white)", outline:"none" };
const PB:  React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", background:"var(--primary-color,#16a34a)", color:"#fff", border:"none", borderRadius:9, fontWeight:700, fontSize:13, cursor:"pointer" };
const OB:  React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", background:"transparent", color:"var(--default-text-color)", border:"1px solid var(--default-border)", borderRadius:8, fontWeight:600, fontSize:12, cursor:"pointer" };
const TH:  React.CSSProperties = { padding:"10px 14px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase" as const, letterSpacing:"0.04em", borderBottom:"2px solid #dbeafe", background:"#f9fafb", whiteSpace:"nowrap" as const };
const TD:  React.CSSProperties = { padding:"11px 14px", verticalAlign:"middle" as const, fontSize:13 };
const PAGE_SIZE = 10;

// Reports are generated for Approved + Delivered audits
const REPORT_AUDITS = AUDITS.filter(a => a.status === "Pending Approval" || a.status === "Delivered");

export default function ReportsPage() {
  const [search, setSearch]  = useState("");
  const [bankF,  setBankF]   = useState("All Banks");
  const [typeF,  setTypeF]   = useState("All Types");
  const [page,   setPage]    = useState(1);

  const filtered = REPORT_AUDITS.filter(a=>{
    const q=search.toLowerCase();
    const mQ=!q||a.id.toLowerCase().includes(q)||a.branch.toLowerCase().includes(q)||a.bank.toLowerCase().includes(q);
    const mB=bankF==="All Banks"||a.bank===bankF;
    const mT=typeF==="All Types"||(typeF==="Delivered"&&a.status==="Delivered")||(typeF==="Pending Approval"&&a.status==="Pending Approval");
    return mQ&&mB&&mT;
  });

  const totalPages = Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  const safePage   = Math.min(page,totalPages);
  const paged      = filtered.slice((safePage-1)*PAGE_SIZE,safePage*PAGE_SIZE);
  const hasFilter  = search||bankF!=="All Banks"||typeF!=="All Types";
  const clearF     = ()=>{ setSearch(""); setBankF("All Banks"); setTypeF("All Types"); setPage(1); };
  const pageNums   = ()=>{ const n:number[]=[]; for(let i=Math.max(1,safePage-2);i<=Math.min(totalPages,safePage+2);i++)n.push(i); return n; };

  const totalGenerated = REPORT_AUDITS.length;
  const delivered      = REPORT_AUDITS.filter(a=>a.status==="Delivered").length;
  const avgScore       = Math.round(REPORT_AUDITS.reduce((s,a)=>s+(a.score??0),0)/REPORT_AUDITS.length);

  return (
    <div style={{ padding:"1.5rem 0" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <div>
          <h4 style={{ fontSize:20, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>Reports / PDFs</h4>
          <p style={{ fontSize:12, color:"var(--text-muted)", margin:"3px 0 0" }}>Electrical safety audit reports — generate, download, and share</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ ...OB, color:"#0891b2", borderColor:"#bae6fd" }}><i className="ri-mail-send-line"/> Email to Client</button>
          <button style={PB}><i className="ri-file-pdf-line"/> Generate Report</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:"1.25rem" }}>
        {[
          { label:"Total Reports",  value:totalGenerated, icon:"ri-file-pdf-line",          color:"#0891b2", bg:"#dbeafe" },
          { label:"Delivered",      value:delivered,      icon:"ri-send-plane-line",         color:"#059669", bg:"#d1fae5" },
          { label:"Pending Delivery",value:totalGenerated-delivered, icon:"ri-time-line",    color:"#ca8a04", bg:"#fef9c3" },
          { label:"Avg Score",      value:`${avgScore}%`, icon:"ri-bar-chart-line",          color:"#16a34a", bg:"#dcfce7" },
        ].map(c=>(
          <div key={c.label} style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={c.icon} style={{ fontSize:19, color:c.color }}/>
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:c.color }}>{c.value}</div>
              <div style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", padding:"12px 16px", display:"flex", gap:10, alignItems:"center", marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flex:"1 1 220px", background:"var(--default-background)", borderRadius:8, padding:"0 12px", border:"1px solid var(--default-border)" }}>
          <i className="ri-search-line" style={{ color:"var(--text-muted)", fontSize:14 }}/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by Audit ID, branch, bank…" style={{ border:"none", background:"transparent", outline:"none", fontSize:13, padding:"8px 0", width:"100%" }}/>
          {search&&<button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)" }}><i className="ri-close-line"/></button>}
        </div>
        <select value={bankF} onChange={e=>{setBankF(e.target.value);setPage(1);}} style={{ ...INP, padding:"7px 12px", minWidth:140 }}>
          {AUDIT_BANKS.map(b=><option key={b}>{b}</option>)}
        </select>
        <select value={typeF} onChange={e=>{setTypeF(e.target.value);setPage(1);}} style={{ ...INP, padding:"7px 12px", minWidth:150 }}>
          {["All Types","Pending Approval","Delivered"].map(t=><option key={t}>{t}</option>)}
        </select>
        {hasFilter&&<button onClick={clearF} style={{ ...OB, fontSize:12, color:"#dc2626", borderColor:"#fecaca" }}><i className="ri-refresh-line"/> Clear</button>}
        <span style={{ marginLeft:"auto", fontSize:12, color:"var(--text-muted)" }}>{filtered.length} reports</span>
      </div>

      {/* Table */}
      <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 2px 8px rgba(22,163,74,0.05)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <th style={TH}>Audit ID</th>
              <th style={{ ...TH, textAlign:"left" }}>Bank / Branch</th>
              <th style={{ ...TH, textAlign:"left" }}>Auditor</th>
              <th style={{ ...TH, textAlign:"center" }}>Score</th>
              <th style={{ ...TH, textAlign:"center" }}>NCR</th>
              <th style={{ ...TH, textAlign:"center" }}>Template</th>
              <th style={{ ...TH, textAlign:"center" }}>Approved</th>
              <th style={{ ...TH, textAlign:"center" }}>Status</th>
              <th style={{ ...TH, textAlign:"center" }}>Actions</th>
            </tr></thead>
            <tbody>
              {paged.length===0?(
                <tr><td colSpan={9} style={{ padding:"60px 24px", textAlign:"center", color:"var(--text-muted)" }}>
                  <i className="ri-file-pdf-line" style={{ fontSize:40, display:"block", marginBottom:8, opacity:0.3 }}/>No reports found
                </td></tr>
              ):paged.map((a,i)=>{
                const isDelivered = a.status === "Delivered";
                return (
                  <tr key={a.id} style={{ borderTop:i>0?"1px solid var(--default-border)":undefined }}>
                    <td style={{ ...TD, textAlign:"center" }}><span style={{ fontSize:11, fontWeight:700, color:"#1e40af", background:"#dbeafe", borderRadius:6, padding:"2px 8px" }}>{a.id}</span></td>
                    <td style={TD}>
                      <div style={{ fontWeight:700, fontSize:13 }}>{a.branch}</div>
                      <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:1 }}>{a.bank} · {a.city}, {a.state}</div>
                    </td>
                    <td style={TD}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:28, height:28, borderRadius:8, background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:9, fontWeight:700 }}>{a.auditor.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                        <span style={{ fontSize:12.5, fontWeight:600 }}>{a.auditor}</span>
                      </div>
                    </td>
                    <td style={{ ...TD, textAlign:"center" }}>
                      {a.score!=null&&<span style={{ fontSize:12, fontWeight:800, color:scoreColor(a.score), background:scoreBg(a.score), borderRadius:6, padding:"2px 8px" }}>{a.score}%</span>}
                    </td>
                    <td style={{ ...TD, textAlign:"center" }}>
                      <span style={{ fontSize:12, fontWeight:700, color:a.ncr>0?"#dc2626":"#16a34a" }}>
                        {a.ncr>0?<><i className="ri-error-warning-line" style={{ marginRight:2 }}/>{a.ncr}</>:<i className="ri-checkbox-circle-fill"/>}
                      </span>
                    </td>
                    <td style={{ ...TD, textAlign:"center", fontSize:11, color:"var(--text-muted)" }}>{a.template}</td>
                    <td style={{ ...TD, textAlign:"center", fontSize:12, color:"var(--text-muted)" }}>{a.approvedDate}</td>
                    <td style={{ ...TD, textAlign:"center" }}>
                      <span style={{ fontSize:11, fontWeight:700, color:isDelivered?"#059669":"#ca8a04", background:isDelivered?"#d1fae5":"#fef9c3", borderRadius:20, padding:"2px 10px" }}>
                        {isDelivered?"Delivered":"Approved"}
                      </span>
                    </td>
                    <td style={{ ...TD, textAlign:"center" }}>
                      <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
                        <button title="Preview" style={{ width:28, height:28, borderRadius:7, border:"1px solid var(--default-border)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--primary-color)" }}><i className="ri-eye-line" style={{ fontSize:13 }}/></button>
                        <button title="Download PDF" style={{ width:28, height:28, borderRadius:7, border:"1px solid var(--default-border)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#0891b2" }}><i className="ri-download-line" style={{ fontSize:13 }}/></button>
                        <button title="Email to Client" style={{ width:28, height:28, borderRadius:7, border:"1px solid var(--default-border)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#374151" }}><i className="ri-mail-send-line" style={{ fontSize:13 }}/></button>
                        {!isDelivered&&(
                          <button title="Mark Delivered" style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"4px 10px", fontSize:11, fontWeight:700, color:"#fff", background:"#059669", border:"none", borderRadius:6, cursor:"pointer" }}>
                            <i className="ri-send-plane-line" style={{ fontSize:12 }}/>Deliver
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages>1&&(
          <div style={{ padding:"12px 16px", borderTop:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"var(--text-muted)" }}>Showing {(safePage-1)*PAGE_SIZE+1}–{Math.min(safePage*PAGE_SIZE,filtered.length)} of {filtered.length}</span>
            <div style={{ display:"flex", gap:4 }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={safePage===1} style={{ padding:"5px 10px", border:"1px solid var(--default-border)", borderRadius:7, background:"transparent", cursor:safePage===1?"not-allowed":"pointer", fontSize:12 }}><i className="ri-arrow-left-s-line"/></button>
              {pageNums().map(n=><button key={n} onClick={()=>setPage(n)} style={{ padding:"5px 10px", border:"1px solid var(--default-border)", borderRadius:7, fontSize:12, fontWeight:n===safePage?700:400, background:n===safePage?"var(--primary-color)":"transparent", color:n===safePage?"#fff":"var(--default-text-color)", cursor:"pointer" }}>{n}</button>)}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={safePage===totalPages} style={{ padding:"5px 10px", border:"1px solid var(--default-border)", borderRadius:7, background:"transparent", cursor:safePage===totalPages?"not-allowed":"pointer", fontSize:12 }}><i className="ri-arrow-right-s-line"/></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
