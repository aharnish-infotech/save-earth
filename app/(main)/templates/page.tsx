"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface TemplateSection { name: string; questions: number; weightage: number }
interface Template {
  id: string; name: string; description: string;
  bank: string; bankCode: string; circles: string[];
  sections: TemplateSection[]; totalQ: number;
  status: "Active" | "Draft" | "Archived";
  version: string; createdBy: string; createdOn: string;
  lastUsed?: string; usedCount: number;
  selectedQuestionIds?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// BANK CODE MAP
// ─────────────────────────────────────────────────────────────────────────────
const BANK_CODE: Record<string, string> = {
  "State Bank of India":  "SBI",
  "Bank of Baroda":       "BOB",
  "UCO Bank":             "UCO",
  "Punjab National Bank": "PNB",
  "Canara Bank":          "CNRB",
  "Indian Bank":          "IB",
};

const BANK_ACCENT: Record<string, { accent: string; lightBg: string }> = {
  "SBI":  { accent:"#1e3a5f", lightBg:"#eff6ff" },
  "BOB":  { accent:"#c2410c", lightBg:"#fff7ed" },
  "UCO":  { accent:"#1d4ed8", lightBg:"#eff6ff" },
  "PNB":  { accent:"#7c3aed", lightBg:"#f5f3ff" },
  "CNRB": { accent:"#065f46", lightBg:"#f0fdf4" },
  "IB":   { accent:"#b91c1c", lightBg:"#fef2f2" },
};

// ─────────────────────────────────────────────────────────────────────────────
// EXISTING TEMPLATES SEED
// ─────────────────────────────────────────────────────────────────────────────
const SEED: Template[] = [
  { id:"T-001", name:"SBI Standard Branch Audit",       bank:"State Bank of India",  bankCode:"SBI",  circles:["SBI Gujarat Circle"], version:"v2.3", description:"Comprehensive audit template for SBI urban and metro branches covering all compliance parameters.", status:"Active",   createdBy:"Admin", createdOn:"15 Jan 2024", lastUsed:"20 Jul 2024", usedCount:42, totalQ:28, sections:[{name:"General",questions:8,weightage:30},{name:"Fire Prevention Measures",questions:6,weightage:25},{name:"Electrical Safety",questions:4,weightage:15},{name:"DG Set / Generator",questions:5,weightage:20},{name:"Onsite ATM",questions:5,weightage:10}] },
  { id:"T-006", name:"SBI Rural Branch Lite",           bank:"State Bank of India",  bankCode:"SBI",  circles:["SBI Rajasthan Circle"], version:"v1.1", description:"Simplified audit template for SBI rural and semi-urban branches with reduced scope.", status:"Archived", createdBy:"Admin", createdOn:"01 Nov 2023", lastUsed:"01 Mar 2024", usedCount:15, totalQ:14, sections:[{name:"General",questions:4,weightage:35},{name:"Fire Prevention Measures",questions:4,weightage:35},{name:"Onsite ATM",questions:6,weightage:30}] },
  { id:"T-002", name:"BOB Branch Infrastructure Audit", bank:"Bank of Baroda",       bankCode:"BOB",  circles:["BOB Gujarat Circle"],   version:"v1.5", description:"Tailored template for Bank of Baroda branch infrastructure assessments per RBO guidelines.", status:"Active",   createdBy:"Admin", createdOn:"20 Jan 2024", lastUsed:"18 Jul 2024", usedCount:18, totalQ:24, sections:[{name:"General",questions:7,weightage:35},{name:"Fire Prevention Measures",questions:5,weightage:25},{name:"Server and UPS Room",questions:4,weightage:20},{name:"Onsite ATM",questions:4,weightage:10},{name:"DG Set / Generator",questions:4,weightage:10}] },
  { id:"T-003", name:"UCO Bank East Circle Audit",      bank:"UCO Bank",             bankCode:"UCO",  circles:["UCO East Circle"],      version:"v1.0", description:"Audit checklist designed for UCO Bank branches in eastern India circles.", status:"Active",   createdBy:"Admin", createdOn:"25 Jan 2024", lastUsed:"15 Jul 2024", usedCount:9,  totalQ:20, sections:[{name:"General",questions:6,weightage:30},{name:"Fire Prevention Measures",questions:4,weightage:20},{name:"Electrical Safety",questions:3,weightage:15},{name:"Server and UPS Room",questions:4,weightage:20},{name:"Onsite ATM",questions:3,weightage:15}] },
  { id:"T-004", name:"PNB Comprehensive Audit v2",      bank:"Punjab National Bank",  bankCode:"PNB",  circles:["PNB North Circle"],     version:"v2.0", description:"Updated PNB template incorporating new RBI circular requirements for electrical safety.", status:"Draft",    createdBy:"Admin", createdOn:"10 Mar 2024", usedCount:0,  totalQ:26, sections:[{name:"General",questions:9,weightage:35},{name:"Fire Prevention Measures",questions:6,weightage:25},{name:"Server and UPS Room",questions:5,weightage:20},{name:"DG Set / Generator",questions:3,weightage:10},{name:"Onsite ATM",questions:3,weightage:10}] },
  { id:"T-005", name:"Canara Bank Standard Audit",      bank:"Canara Bank",          bankCode:"CNRB", circles:["Canara South Circle"],  version:"v1.2", description:"Standard template for Canara Bank rural and semi-urban branches.", status:"Active",   createdBy:"Admin", createdOn:"05 Feb 2024", lastUsed:"10 Jul 2024", usedCount:7,  totalQ:18, sections:[{name:"General",questions:5,weightage:30},{name:"Fire Prevention Measures",questions:4,weightage:25},{name:"Electrical Safety",questions:3,weightage:15},{name:"Onsite ATM",questions:6,weightage:30}] },
  { id:"T-007", name:"Indian Bank Urban Branch Audit",  bank:"Indian Bank",          bankCode:"IB",   circles:["Indian Bank South Circle"], version:"v1.3", description:"Urban branch compliance checklist for Indian Bank per updated RBI norms.", status:"Active",   createdBy:"Admin", createdOn:"12 Feb 2024", lastUsed:"05 Jul 2024", usedCount:11, totalQ:22, sections:[{name:"General",questions:7,weightage:30},{name:"Fire Prevention Measures",questions:5,weightage:25},{name:"Server and UPS Room",questions:4,weightage:20},{name:"Onsite ATM",questions:6,weightage:25}] },
];

const SECTION_COLOR_MAP: Record<string, { color: string; bg: string }> = {
  "General":                 { color:"#1d4ed8", bg:"#dbeafe" },
  "Fire Prevention Measures":{ color:"#dc2626", bg:"#fee2e2" },
  "Server and UPS Room":     { color:"#7c3aed", bg:"#ede9fe" },
  "Electrical Safety":       { color:"#b45309", bg:"#fef3c7" },
  "Fire Protection":         { color:"#c2410c", bg:"#ffedd5" },
  "DG Set / Generator":      { color:"#065f46", bg:"#dcfce7" },
  "Onsite ATM":              { color:"#0e7490", bg:"#cffafe" },
};

const STATUS_CFG = {
  "Active":   { color:"#15803d", bg:"#dcfce7", border:"#86efac", dot:"#22c55e" },
  "Draft":    { color:"#b45309", bg:"#fef3c7", border:"#fcd34d", dot:"#f59e0b" },
  "Archived": { color:"#6b7280", bg:"#f3f4f6", border:"#d1d5db", dot:"#9ca3af" },
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AuditTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>(SEED);
  const [search,    setSearch]    = useState("");
  const [statusF,   setStatusF]   = useState<"All"|"Active"|"Draft"|"Archived">("All");
  const [expanded,  setExpanded]  = useState<string|null>(null);
  const [view,      setView]      = useState<"grid"|"list">("grid");

  // ── Filtered list for main view ─────────────────────────────────────────────
  const filtered = useMemo(() => templates.filter(t => {
    const q = search.toLowerCase();
    return (!q || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.bank.toLowerCase().includes(q))
        && (statusF === "All" || t.status === statusF);
  }), [templates, search, statusF]);

  const grouped = useMemo(() => {
    const map = new Map<string, Template[]>();
    filtered.forEach(t => { const a = map.get(t.bank) ?? []; a.push(t); map.set(t.bank, a); });
    return map;
  }, [filtered]);

  const totalActive   = templates.filter(t => t.status==="Active").length;
  const totalDraft    = templates.filter(t => t.status==="Draft").length;
  const totalAudits   = templates.reduce((s,t) => s+t.usedCount, 0);

  const toggleArchive = (id: string) =>
    setTemplates(ts => ts.map(t => t.id===id ? {...t, status:(t.status==="Archived"?"Active":"Archived") as Template["status"]} : t));
  const activateDraft = (id: string) =>
    setTemplates(ts => ts.map(t => t.id===id ? {...t, status:"Active" as const} : t));

  return (
    <div style={{ padding:"28px 0 40px", position:"relative" }}>

      {/* ── Page header ── */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6 }}>
        <div>
          <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0, letterSpacing:"-0.3px" }}>Audit Templates</h4>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:4 }}>
            Audit Questions &rsaquo; <span style={{ color:"#2563eb", fontWeight:600 }}>Audit Templates</span>
          </div>
        </div>
        <button
          onClick={() => router.push("/templates/new")}
          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 18px", background:"#2563eb", color:"#fff", border:"none", borderRadius:9, fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 2px 8px rgba(37,99,235,0.35)" }}
        >
          <i className="ri-add-line"/>New Template
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, margin:"22px 0" }}>
        {[
          { label:"Total Templates",  value:templates.length, icon:"ri-layout-3-line",       color:"#2563eb", bg:"#eff6ff", border:"#2563eb" },
          { label:"Active",           value:totalActive,      icon:"ri-checkbox-circle-line", color:"#15803d", bg:"#f0fdf4", border:"#15803d" },
          { label:"Drafts",           value:totalDraft,       icon:"ri-draft-line",           color:"#b45309", bg:"#fefce8", border:"#b45309" },
          { label:"Total Audits Run", value:totalAudits,      icon:"ri-bar-chart-box-line",   color:"#7c3aed", bg:"#f5f3ff", border:"#7c3aed" },
        ].map(c => (
          <div key={c.label} style={{ background:"#fff", borderRadius:12, padding:"18px 18px 16px", border:"1px solid #e5e7eb", borderLeft:`4px solid ${c.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.05)", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={c.icon} style={{ fontSize:20, color:c.color }}/>
            </div>
            <div>
              <div style={{ fontSize:26, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
              <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, marginTop:3, textTransform:"uppercase", letterSpacing:"0.04em" }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:9, padding:"7px 12px", minWidth:240, flex:1, maxWidth:360 }}>
          <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:14, flexShrink:0 }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by template name or bank…"
            style={{ border:"none", outline:"none", fontSize:13, color:"#374151", background:"transparent", width:"100%" }}/>
          {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:15 }}>×</button>}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {(["All","Active","Draft","Archived"] as const).map(s => (
            <button key={s} onClick={()=>setStatusF(s)} style={{
              padding:"6px 14px", borderRadius:20, border:"1.5px solid",
              borderColor: statusF===s ? "#2563eb" : "#e5e7eb",
              background:  statusF===s ? "#eff6ff" : "#fff",
              color:       statusF===s ? "#2563eb" : "#6b7280",
              fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s",
            }}>{s}</button>
          ))}
        </div>
        <div style={{ flex:1 }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, color:"#9ca3af" }}><strong style={{ color:"#374151" }}>{filtered.length}</strong> template{filtered.length!==1?"s":""}</span>
          <div style={{ display:"flex", background:"#f3f4f6", borderRadius:8, padding:3, gap:2 }}>
            {(["grid","list"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding:"5px 12px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                background: view===v ? "#fff" : "transparent", color: view===v ? "#111827" : "#9ca3af",
                boxShadow: view===v ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition:"all 0.15s",
              }}>
                <i className={v==="grid" ? "ri-layout-grid-line" : "ri-list-unordered"} style={{ marginRight:5 }}/>
                {v==="grid" ? "Grid" : "List"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Empty state ── */}
      {filtered.length===0 && (
        <div style={{ textAlign:"center", padding:"80px 24px", background:"#fff", borderRadius:16, border:"1px solid #e5e7eb" }}>
          <i className="ri-layout-3-line" style={{ fontSize:44, color:"#d1d5db", display:"block", marginBottom:12 }}/>
          <div style={{ fontSize:15, fontWeight:700, color:"#374151", marginBottom:6 }}>No templates found</div>
          <div style={{ fontSize:13, color:"#9ca3af" }}>Try adjusting your search or filter</div>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {view==="grid" && filtered.length>0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
          {Array.from(grouped.entries()).map(([bankName, bankTemplates]) => {
            const bc = BANK_ACCENT[BANK_CODE[bankName]??bankTemplates[0].bankCode] ?? { accent:"#374151", lightBg:"#f9fafb" };
            return (
              <div key={bankName}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:bc.accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:9, fontWeight:800, color:"#fff", letterSpacing:"0.05em" }}>{BANK_CODE[bankName]??bankTemplates[0].bankCode}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{bankName}</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{bankTemplates.length} template{bankTemplates.length!==1?"s":""}</div>
                  </div>
                  <div style={{ flex:1, height:1, background:"#e5e7eb", marginLeft:6 }}/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:14 }}>
                  {bankTemplates.map(t => {
                    const sc=STATUS_CFG[t.status];
                    const isEx=expanded===t.id;
                    return (
                      <div key={t.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", overflow:"hidden", transition:"box-shadow 0.15s" }}
                        onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.boxShadow="0 4px 16px rgba(0,0,0,0.1)"}
                        onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.boxShadow="0 1px 4px rgba(0,0,0,0.05)"}>
                        <div style={{ height:4, background:bc.accent, borderRadius:"14px 14px 0 0" }}/>
                        <div style={{ padding:"16px 18px 14px" }}>
                          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:10 }}>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:14, fontWeight:700, color:"#111827", lineHeight:1.3, marginBottom:4 }}>{t.name}</div>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <span style={{ fontSize:10, fontWeight:700, color:"#9ca3af", fontFamily:"monospace" }}>{t.id}</span>
                                <span style={{ width:3, height:3, borderRadius:"50%", background:"#d1d5db", display:"inline-block" }}/>
                                <span style={{ fontSize:10, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:4, padding:"1px 7px" }}>{t.version}</span>
                              </div>
                            </div>
                            <span style={{ fontSize:10, fontWeight:700, color:sc.color, background:sc.bg, border:`1px solid ${sc.border}`, borderRadius:20, padding:"3px 10px", display:"flex", alignItems:"center", gap:4, flexShrink:0, whiteSpace:"nowrap" }}>
                              <span style={{ width:5, height:5, borderRadius:"50%", background:sc.dot, display:"inline-block" }}/>{t.status}
                            </span>
                          </div>
                          <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.5, marginBottom:14, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as const, overflow:"hidden" }}>{t.description}</div>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
                            {[{ icon:"ri-function-line", label:"Sections", value:t.sections.length, color:"#2563eb" },{ icon:"ri-question-line", label:"Questions", value:t.totalQ, color:"#7c3aed" },{ icon:"ri-bar-chart-line", label:"Used", value:t.usedCount, color:"#15803d" }].map(m => (
                              <div key={m.label} style={{ background:"#f9fafb", borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                                <i className={m.icon} style={{ fontSize:14, color:m.color, display:"block", marginBottom:2 }}/>
                                <div style={{ fontSize:16, fontWeight:800, color:"#111827", lineHeight:1 }}>{m.value}</div>
                                <div style={{ fontSize:9, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginTop:1 }}>{m.label}</div>
                              </div>
                            ))}
                          </div>
                          {t.circles && t.circles.length > 0 && (
                            <div style={{ marginBottom:12 }}>
                              <span style={{ fontSize:10, fontWeight:600, color:"#374151", background:"#f3f4f6", borderRadius:5, padding:"3px 10px", border:"1px solid #e5e7eb", display:"inline-flex", alignItems:"center", gap:4 }}>
                                <i className="ri-map-pin-line" style={{ fontSize:10, color:"#9ca3af" }}/>{t.circles[0]}
                              </span>
                            </div>
                          )}
                          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
                            {t.sections.map(sec => {
                              const sc2 = SECTION_COLOR_MAP[sec.name] ?? { color:"#374151", bg:"#f3f4f6" };
                              return <span key={sec.name} style={{ fontSize:10, fontWeight:600, color:sc2.color, background:sc2.bg, borderRadius:5, padding:"2px 8px" }}>{sec.name}</span>;
                            })}
                          </div>
                          <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                            <div style={{ fontSize:11, color:"#9ca3af" }}>Created On: <strong style={{ color:"#374151" }}>{t.createdOn}</strong></div>
                            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                              <button onClick={()=>setExpanded(isEx?null:t.id)} style={{ width:28, height:28, borderRadius:6, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af" }} title={isEx?"Collapse":"View sections"}>
                                <i className={isEx?"ri-arrow-up-s-line":"ri-eye-line"} style={{ fontSize:14 }}/>
                              </button>
                              <button style={{ width:28, height:28, borderRadius:6, border:"1px solid #dbeafe", background:"#eff6ff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#2563eb" }} title="Edit">
                                <i className="ri-edit-line" style={{ fontSize:13 }}/>
                              </button>
                              {t.status==="Draft" && <button onClick={()=>activateDraft(t.id)} style={{ padding:"4px 10px", borderRadius:6, border:"none", background:"#15803d", color:"#fff", cursor:"pointer", fontSize:11, fontWeight:700 }}>Activate</button>}
                              {t.status!=="Draft" && <button onClick={()=>toggleArchive(t.id)} style={{ width:28, height:28, borderRadius:6, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af" }} title={t.status==="Archived"?"Restore":"Archive"}>
                                <i className={t.status==="Archived"?"ri-refresh-line":"ri-archive-line"} style={{ fontSize:13 }}/>
                              </button>}
                            </div>
                          </div>
                        </div>
                        {isEx && (
                          <div style={{ borderTop:"1px solid #f3f4f6", padding:"14px 18px 16px", background:"#fafafa" }}>
                            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Section Breakdown</div>
                            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                              {t.sections.map(sec => {
                                const sc2 = SECTION_COLOR_MAP[sec.name] ?? { color:"#374151", bg:"#f3f4f6" };
                                return (
                                  <div key={sec.name}>
                                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                      <span style={{ fontSize:11, fontWeight:600, color:sc2.color }}>{sec.name}</span>
                                      <span style={{ fontSize:11, color:"#6b7280" }}>{sec.questions}Q &middot; <strong style={{ color:"#374151" }}>{sec.weightage}%</strong></span>
                                    </div>
                                    <div style={{ height:5, borderRadius:3, background:"#e5e7eb" }}>
                                      <div style={{ height:"100%", width:`${sec.weightage}%`, background:sc2.color, borderRadius:3 }}/>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {view==="list" && filtered.length>0 && (
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f9fafb" }}>
                  {["","Template","Bank","Version","Sections","Questions","Used","Created On","Status","Actions"].map((h,i) => (
                    <th key={i} style={{ padding:"11px 16px", fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase" as const, letterSpacing:"0.06em", borderBottom:"1px solid #e5e7eb", textAlign: i===0?"center":i>=4?"center":"left", whiteSpace:"nowrap" as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const sc=STATUS_CFG[t.status];
                  const bc=BANK_ACCENT[t.bankCode] ?? { accent:"#374151", lightBg:"#f9fafb" };
                  const isEx=expanded===t.id;
                  return (
                    <React.Fragment key={t.id}>
                      <tr onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background="#f9fafb"} onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background="transparent"}>
                        <td style={{ padding:"12px 8px 12px 16px", width:32, textAlign:"center" }}>
                          <button onClick={()=>setExpanded(isEx?null:t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:14, display:"flex", alignItems:"center" }}>
                            <i className={isEx?"ri-arrow-down-s-line":"ri-arrow-right-s-line"}/>
                          </button>
                        </td>
                        <td style={{ padding:"12px 16px", fontSize:13, verticalAlign:"middle" }}>
                          <div style={{ fontWeight:700, color:"#111827" }}>{t.name}</div>
                          <div style={{ fontSize:10, color:"#9ca3af", marginTop:2, fontFamily:"monospace" }}>{t.id}</div>
                        </td>
                        <td style={{ padding:"12px 16px", verticalAlign:"middle" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <div style={{ width:24, height:24, borderRadius:6, background:bc.accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <span style={{ fontSize:7, fontWeight:800, color:"#fff" }}>{t.bankCode}</span>
                            </div>
                            <span style={{ fontSize:12, color:"#374151", fontWeight:600 }}>{t.bank}</span>
                          </div>
                        </td>
                        <td style={{ padding:"12px 16px", textAlign:"center", verticalAlign:"middle" }}>
                          <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:5, padding:"2px 8px" }}>{t.version}</span>
                        </td>
                        <td style={{ padding:"12px 16px", textAlign:"center", fontWeight:700, color:"#374151", fontSize:13, verticalAlign:"middle" }}>{t.sections.length}</td>
                        <td style={{ padding:"12px 16px", textAlign:"center", fontWeight:700, color:"#374151", fontSize:13, verticalAlign:"middle" }}>{t.totalQ}</td>
                        <td style={{ padding:"12px 16px", textAlign:"center", verticalAlign:"middle" }}>
                          <span style={{ fontSize:13, fontWeight:700, color:t.usedCount>0?"#7c3aed":"#d1d5db" }}>{t.usedCount}</span>
                        </td>
                        <td style={{ padding:"12px 16px", textAlign:"center", fontSize:12, color:"#6b7280", verticalAlign:"middle" }}>{t.createdOn}</td>
                        <td style={{ padding:"12px 16px", textAlign:"center", verticalAlign:"middle" }}>
                          <span style={{ fontSize:10, fontWeight:700, color:sc.color, background:sc.bg, border:`1px solid ${sc.border}`, borderRadius:20, padding:"3px 10px", display:"inline-flex", alignItems:"center", gap:4 }}>
                            <span style={{ width:5, height:5, borderRadius:"50%", background:sc.dot, display:"inline-block" }}/>{t.status}
                          </span>
                        </td>
                        <td style={{ padding:"12px 16px", textAlign:"center", verticalAlign:"middle" }}>
                          <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
                            <button style={{ width:28, height:28, borderRadius:6, border:"1px solid #dbeafe", background:"#eff6ff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#2563eb" }}><i className="ri-edit-line" style={{ fontSize:13 }}/></button>
                            {t.status==="Draft" && <button onClick={()=>activateDraft(t.id)} style={{ padding:"4px 10px", borderRadius:6, border:"none", background:"#15803d", color:"#fff", cursor:"pointer", fontSize:11, fontWeight:700 }}>Activate</button>}
                            {t.status!=="Draft" && <button onClick={()=>toggleArchive(t.id)} style={{ width:28, height:28, borderRadius:6, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af" }}>
                              <i className={t.status==="Archived"?"ri-refresh-line":"ri-archive-line"} style={{ fontSize:13 }}/>
                            </button>}
                          </div>
                        </td>
                      </tr>
                      {isEx && (
                        <tr>
                          <td colSpan={10} style={{ padding:"0 16px 16px 52px", background:"#fafafa", borderBottom:"1px solid #f3f4f6" }}>
                            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10, marginTop:12 }}>Section Breakdown</div>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                              {t.sections.map(sec => {
                                const sc2=SECTION_COLOR_MAP[sec.name]??{color:"#374151",bg:"#f3f4f6"};
                                return (
                                  <div key={sec.name} style={{ background:"#fff", border:`1px solid ${sc2.color}25`, borderRadius:10, padding:"10px 14px", minWidth:155 }}>
                                    <div style={{ fontSize:11, fontWeight:700, color:sc2.color, marginBottom:6 }}>{sec.name}</div>
                                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#374151", marginBottom:5 }}><span>{sec.questions} questions</span><strong>{sec.weightage}%</strong></div>
                                    <div style={{ height:4, borderRadius:2, background:"#e5e7eb" }}><div style={{ height:"100%", width:`${sec.weightage}%`, background:sc2.color, borderRadius:2 }}/></div>
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
        </div>
      )}

    </div>
  );
}
