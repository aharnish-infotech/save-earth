"use client";
import React, { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface TemplateSection {
  name:       string;
  questions:  number;
  weightage:  number;
}

interface Template {
  id:         string;
  name:       string;
  description:string;
  bank:       string;
  sections:   TemplateSection[];
  totalQ:     number;
  status:     "Active" | "Draft" | "Archived";
  version:    string;
  createdBy:  string;
  createdOn:  string;
  lastUsed?:  string;
  usedCount:  number;
}

// ── Seed Data ──────────────────────────────────────────────────────────────────
const SEED: Template[] = [
  {
    id:"T-001", name:"SBI Standard Branch Audit", bank:"SBI", version:"v2.3",
    description:"Comprehensive audit template for SBI urban and metro branches covering all compliance parameters.",
    status:"Active", createdBy:"Admin", createdOn:"15 Jan 2024", lastUsed:"20 Jul 2024", usedCount:42,
    totalQ:28,
    sections:[
      { name:"Electrical Safety",   questions:8, weightage:30 },
      { name:"Fire Safety",         questions:6, weightage:25 },
      { name:"Civil & Structural",  questions:4, weightage:15 },
      { name:"Security Systems",    questions:5, weightage:20 },
      { name:"General Compliance",  questions:5, weightage:10 },
    ],
  },
  {
    id:"T-002", name:"BOB Branch Infrastructure Audit", bank:"Bank of Baroda", version:"v1.5",
    description:"Tailored template for Bank of Baroda branch infrastructure assessments per RBO guidelines.",
    status:"Active", createdBy:"Admin", createdOn:"20 Jan 2024", lastUsed:"18 Jul 2024", usedCount:18,
    totalQ:24,
    sections:[
      { name:"Electrical Safety",   questions:7, weightage:35 },
      { name:"Fire Safety",         questions:5, weightage:25 },
      { name:"Security Systems",    questions:4, weightage:20 },
      { name:"General Compliance",  questions:4, weightage:10 },
      { name:"IT Infrastructure",   questions:4, weightage:10 },
    ],
  },
  {
    id:"T-003", name:"UCO Bank East Circle Audit", bank:"UCO Bank", version:"v1.0",
    description:"Audit checklist designed for UCO Bank branches in eastern India circles.",
    status:"Active", createdBy:"Admin", createdOn:"25 Jan 2024", lastUsed:"15 Jul 2024", usedCount:9,
    totalQ:20,
    sections:[
      { name:"Electrical Safety",   questions:6, weightage:30 },
      { name:"Fire Safety",         questions:4, weightage:20 },
      { name:"Civil & Structural",  questions:3, weightage:15 },
      { name:"Security Systems",    questions:4, weightage:20 },
      { name:"General Compliance",  questions:3, weightage:15 },
    ],
  },
  {
    id:"T-004", name:"PNB Comprehensive Audit v2", bank:"PNB", version:"v2.0",
    description:"Updated PNB template incorporating new RBI circular requirements for electrical safety.",
    status:"Draft", createdBy:"Admin", createdOn:"10 Mar 2024", usedCount:0,
    totalQ:26,
    sections:[
      { name:"Electrical Safety",   questions:9, weightage:35 },
      { name:"Fire Safety",         questions:6, weightage:25 },
      { name:"Security Systems",    questions:5, weightage:20 },
      { name:"IT Infrastructure",   questions:3, weightage:10 },
      { name:"General Compliance",  questions:3, weightage:10 },
    ],
  },
  {
    id:"T-005", name:"Canara Bank Audit Template", bank:"Canara Bank", version:"v1.2",
    description:"Standard template for Canara Bank rural and semi-urban branches.",
    status:"Active", createdBy:"Admin", createdOn:"05 Feb 2024", lastUsed:"10 Jul 2024", usedCount:7,
    totalQ:18,
    sections:[
      { name:"Electrical Safety",   questions:5, weightage:30 },
      { name:"Fire Safety",         questions:4, weightage:25 },
      { name:"Civil & Structural",  questions:3, weightage:15 },
      { name:"General Compliance",  questions:6, weightage:30 },
    ],
  },
  {
    id:"T-006", name:"SBI Rural Branch Lite Audit", bank:"SBI", version:"v1.1",
    description:"Simplified audit template for SBI rural and semi-urban branches with reduced scope.",
    status:"Archived", createdBy:"Admin", createdOn:"01 Nov 2023", lastUsed:"01 Mar 2024", usedCount:15,
    totalQ:14,
    sections:[
      { name:"Electrical Safety",   questions:4, weightage:35 },
      { name:"Fire Safety",         questions:4, weightage:35 },
      { name:"General Compliance",  questions:6, weightage:30 },
    ],
  },
];

const BANKS_LIST   = ["All Banks","SBI","Bank of Baroda","UCO Bank","PNB","Canara Bank"];
const STATUS_LIST  = ["All Status","Active","Draft","Archived"];
const PAGE_SIZE    = 8;

const STATUS_STYLE: Record<string, { color:string; bg:string }> = {
  "Active":   { color:"#16a34a", bg:"#dcfce7" },
  "Draft":    { color:"#ca8a04", bg:"#fef9c3" },
  "Archived": { color:"#6b7280", bg:"#f3f4f6" },
};

const SECTION_COLOR: Record<string, string> = {
  "Electrical Safety":  "#ca8a04",
  "Fire Safety":        "#dc2626",
  "Civil & Structural": "#0891b2",
  "Security Systems":   "#7c3aed",
  "IT Infrastructure":  "#2563eb",
  "General Compliance": "#16a34a",
};

const TH: React.CSSProperties = { padding:"11px 16px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase" as const, letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap" as const, textAlign:"left" as const };
const TD: React.CSSProperties = { padding:"13px 16px", verticalAlign:"middle" as const, fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };

export default function TemplateBuilderPage() {
  const [templates, setTemplates] = useState<Template[]>(SEED);
  const [search,    setSearch]    = useState("");
  const [bankF,     setBankF]     = useState("All Banks");
  const [statusF,   setStatusF]   = useState("All Status");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = templates.filter(t => {
    const q = search.toLowerCase();
    return (!q || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.bank.toLowerCase().includes(q))
      && (bankF   === "All Banks"   || t.bank   === bankF)
      && (statusF === "All Status"  || t.status === statusF);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p     = Math.min(page, totalPages);
  const paged = filtered.slice((p-1)*PAGE_SIZE, p*PAGE_SIZE);
  const nums  = () => { const n:number[]=[]; for(let i=Math.max(1,p-2);i<=Math.min(totalPages,p+2);i++)n.push(i); return n; };

  const toggleArchive = (id: string) =>
    setTemplates(ts => ts.map(t => t.id===id ? { ...t, status: t.status==="Archived"?"Active":"Archived" as "Active"|"Draft"|"Archived" } : t));

  const activateTemplate = (id: string) =>
    setTemplates(ts => ts.map(t => t.id===id ? { ...t, status:"Active" as const } : t));

  const totalActive = templates.filter(t=>t.status==="Active").length;
  const totalDraft  = templates.filter(t=>t.status==="Draft").length;
  const totalAudsUsed = templates.reduce((s,t)=>s+t.usedCount,0);

  return (
    <div style={{ padding:"24px 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Template Builder</h4>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", background:"#fff", color:"#374151", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>
            <i className="ri-file-copy-line"/> Duplicate
          </button>
          <button style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", background:"#16a34a", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
            <i className="ri-add-line"/> New Template
          </button>
        </div>
      </div>
      <div style={{ fontSize:12, color:"#9ca3af", marginBottom:20 }}>Dashboard / Audit Questions / <span style={{ color:"#16a34a", fontWeight:600 }}>Template Builder</span></div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"Total Templates",  value:templates.length, color:"#2563eb", bg:"#eff6ff", icon:"ri-layout-3-line",       border:"#2563eb" },
          { label:"Active",           value:totalActive,      color:"#16a34a", bg:"#f0fdf4", icon:"ri-checkbox-circle-line", border:"#16a34a" },
          { label:"Drafts",           value:totalDraft,       color:"#ca8a04", bg:"#fefce8", icon:"ri-draft-line",           border:"#ca8a04" },
          { label:"Total Audits Run", value:totalAudsUsed,   color:"#7c3aed", bg:"#f5f3ff", icon:"ri-bar-chart-line",       border:"#7c3aed" },
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
          Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> templates — Page <strong style={{ color:"#111827" }}>{p}</strong> of {totalPages}
        </div>
        <div style={{ flex:1 }} />
        <select value={bankF}   onChange={e=>{setBankF(e.target.value);setPage(1);}}   style={SEL}>{BANKS_LIST.map(b=><option key={b}>{b}</option>)}</select>
        <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}} style={SEL}>{STATUS_LIST.map(s=><option key={s}>{s}</option>)}</select>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 12px" }}>
          <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:14 }}/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search template name or bank…"
            style={{ border:"none", outline:"none", fontSize:12, color:"#374151", width:200 }}/>
          {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:14 }}>×</button>}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <th style={{ ...TH, width:32 }}></th>
              <th style={TH}>TEMPLATE</th>
              <th style={TH}>BANK</th>
              <th style={{ ...TH, textAlign:"center" }}>VERSION</th>
              <th style={{ ...TH, textAlign:"center" }}>SECTIONS</th>
              <th style={{ ...TH, textAlign:"center" }}>QUESTIONS</th>
              <th style={{ ...TH, textAlign:"center" }}>USED</th>
              <th style={{ ...TH, textAlign:"center" }}>LAST USED</th>
              <th style={{ ...TH, textAlign:"center" }}>STATUS</th>
              <th style={{ ...TH, textAlign:"center" }}>ACTION</th>
            </tr></thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={10} style={{ padding:"60px 24px", textAlign:"center", color:"#9ca3af" }}>
                  <i className="ri-layout-3-line" style={{ fontSize:36, display:"block", marginBottom:8, opacity:0.3 }}/>No templates found
                </td></tr>
              ) : paged.map(t => {
                const ss = STATUS_STYLE[t.status];
                const isExp = expanded === t.id;
                return (
                  <React.Fragment key={t.id}>
                    <tr onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ ...TD, textAlign:"center", paddingRight:0, width:32 }}>
                        <button onClick={()=>setExpanded(isExp?null:t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:14, padding:0, display:"flex", alignItems:"center" }}>
                          <i className={isExp?"ri-arrow-down-s-line":"ri-arrow-right-s-line"}/>
                        </button>
                      </td>
                      <td style={TD}>
                        <div style={{ fontWeight:700, color:"#111827" }}>{t.name}</div>
                        <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{t.id} · {t.description.slice(0,55)}…</div>
                      </td>
                      <td style={TD}>
                        <span style={{ fontSize:12, fontWeight:700, color:"#2563eb", background:"#dbeafe", borderRadius:6, padding:"3px 9px" }}>{t.bank}</span>
                      </td>
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ fontSize:11, color:"#6b7280", background:"#f3f4f6", borderRadius:6, padding:"3px 9px", fontWeight:600 }}>{t.version}</span>
                      </td>
                      <td style={{ ...TD, textAlign:"center", fontWeight:700, color:"#374151" }}>{t.sections.length}</td>
                      <td style={{ ...TD, textAlign:"center", fontWeight:700, color:"#374151" }}>{t.totalQ}</td>
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ fontSize:13, fontWeight:700, color:t.usedCount>0?"#7c3aed":"#9ca3af" }}>{t.usedCount}</span>
                      </td>
                      <td style={{ ...TD, textAlign:"center", fontSize:12, color:"#6b7280" }}>{t.lastUsed || "Never"}</td>
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ fontSize:11, fontWeight:700, color:ss.color, background:ss.bg, borderRadius:20, padding:"4px 12px" }}>{t.status}</span>
                      </td>
                      <td style={{ ...TD, textAlign:"center" }}>
                        <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                          <button title="Edit" style={{ width:30, height:30, borderRadius:7, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#2563eb" }}><i className="ri-edit-line" style={{ fontSize:14 }}/></button>
                          {t.status==="Draft" && (
                            <button onClick={()=>activateTemplate(t.id)} title="Activate" style={{ padding:"5px 10px", borderRadius:7, border:"none", background:"#16a34a", color:"#fff", cursor:"pointer", fontSize:11, fontWeight:700 }}>Activate</button>
                          )}
                          <button onClick={()=>toggleArchive(t.id)} title={t.status==="Archived"?"Restore":"Archive"} style={{ width:30, height:30, borderRadius:7, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280" }}>
                            <i className={t.status==="Archived"?"ri-refresh-line":"ri-archive-line"} style={{ fontSize:14 }}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded section breakdown */}
                    {isExp && (
                      <tr>
                        <td colSpan={10} style={{ padding:"0 16px 16px 48px", background:"#fafafa", borderBottom:"1px solid #f3f4f6" }}>
                          <div style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10, marginTop:12 }}>Section Breakdown</div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                            {t.sections.map(sec => {
                              const sc = SECTION_COLOR[sec.name] || "#374151";
                              return (
                                <div key={sec.name} style={{ border:`1px solid ${sc}30`, borderRadius:10, padding:"10px 14px", background:"#fff", minWidth:160 }}>
                                  <div style={{ fontSize:11, fontWeight:700, color:sc, marginBottom:4 }}>{sec.name}</div>
                                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>
                                    <span style={{ fontSize:12, color:"#374151" }}>{sec.questions} questions</span>
                                    <span style={{ fontSize:12, fontWeight:700, color:"#374151" }}>{sec.weightage}%</span>
                                  </div>
                                  <div style={{ marginTop:6, height:4, borderRadius:2, background:"#e5e7eb" }}>
                                    <div style={{ height:"100%", width:`${sec.weightage}%`, background:sc, borderRadius:2 }}/>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"12px 20px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafafa" }}>
          <span style={{ fontSize:12, color:"#6b7280" }}>Showing <strong style={{ color:"#111827" }}>{Math.min((p-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(p*PAGE_SIZE,filtered.length)}</strong> of <strong style={{ color:"#111827" }}>{filtered.length}</strong> templates</span>
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
