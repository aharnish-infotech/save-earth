"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ReportTemplate {
  id: string;
  bank: string;
  bankCode: string;
  bankColor: string;
  name: string;
  description: string;
  status: "Active" | "Draft" | "Archived";
  version: string;
  circle: string;
  blocksCount: number;
  questionsCount: number;
  timesUsed: number;
  createdOn: string;
  tags: string[];
}

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED: ReportTemplate[] = [
  {
    id: "RT-001",
    bank: "State Bank of India",
    bankCode: "SBI",
    bankColor: "#1a3c8f",
    name: "SBI Standard Branch Report",
    description: "Full 14-page electrical safety audit report for SBI urban and metro branches covering all annexures, load sheet and photo sections.",
    status: "Active",
    version: "v2.1",
    circle: "SBI Gujarat Circle",
    blocksCount: 11,
    questionsCount: 33,
    timesUsed: 42,
    createdOn: "15 Jan 2024",
    tags: ["Cover Page", "Annexure I–III", "Load Sheet", "Photos"],
  },
  {
    id: "RT-006",
    bank: "State Bank of India",
    bankCode: "SBI",
    bankColor: "#1a3c8f",
    name: "SBI Rural Branch Lite Report",
    description: "Simplified report template for SBI rural branches — excludes Annexure III (ATM) and condenses load sheet.",
    status: "Draft",
    version: "v1.0",
    circle: "SBI Rajasthan Circle",
    blocksCount: 8,
    questionsCount: 22,
    timesUsed: 0,
    createdOn: "01 Nov 2023",
    tags: ["Cover Page", "Annexure I–II", "Load Sheet"],
  },
  {
    id: "RT-002",
    bank: "Bank of Baroda",
    bankCode: "BOB",
    bankColor: "#d97706",
    name: "BOB Branch Infrastructure Report",
    description: "Tailored report for Bank of Baroda branch infrastructure audits. Includes DG, UPS, and electrical parameter sections.",
    status: "Active",
    version: "v1.5",
    circle: "BOB Gujarat Circle",
    blocksCount: 11,
    questionsCount: 29,
    timesUsed: 18,
    createdOn: "10 Mar 2024",
    tags: ["Cover Page", "Annexure I–II", "UPS", "DG Set"],
  },
  {
    id: "RT-003",
    bank: "UCO Bank",
    bankCode: "UCO",
    bankColor: "#0f766e",
    name: "UCO Bank East Circle Report",
    description: "Standard report template for UCO Bank eastern circle branches with regional compliance additions.",
    status: "Active",
    version: "v1.1",
    circle: "UCO East Circle",
    blocksCount: 10,
    questionsCount: 27,
    timesUsed: 9,
    createdOn: "22 May 2024",
    tags: ["Cover Page", "Annexure I–III", "Load Sheet"],
  },
  {
    id: "RT-004",
    bank: "Canara Bank",
    bankCode: "CNRB",
    bankColor: "#15803d",
    name: "Canara Bank Standard Audit Report",
    description: "Canara Bank standard report with full annexure suite and photographic evidence sections.",
    status: "Archived",
    version: "v1.0",
    circle: "Canara South Circle",
    blocksCount: 9,
    questionsCount: 24,
    timesUsed: 6,
    createdOn: "05 Aug 2023",
    tags: ["Cover Page", "Annexure I–II", "Photos"],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<ReportTemplate["status"], { color: string; bg: string; border: string }> = {
  Active:   { color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
  Draft:    { color:"#d97706", bg:"#fffbeb", border:"#fcd34d" },
  Archived: { color:"#6b7280", bg:"#f3f4f6", border:"#e5e7eb" },
};

export default function ReportTemplatePage() {
  const router = useRouter();
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState<"All"|"Active"|"Draft"|"Archived">("All");
  const [viewMode,   setViewMode]   = useState<"Grid"|"List">("Grid");
  const [expanded,   setExpanded]   = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return SEED.filter(t => {
      const matchQ = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.bank.toLowerCase().includes(search.toLowerCase());
      const matchF = filter === "All" || t.status === filter;
      return matchQ && matchF;
    });
  }, [search, filter]);

  // Group by bank
  const grouped = useMemo(() => {
    const map: Record<string, ReportTemplate[]> = {};
    for (const t of filtered) {
      if (!map[t.bank]) map[t.bank] = [];
      map[t.bank].push(t);
    }
    return map;
  }, [filtered]);

  const totalActive   = SEED.filter(t => t.status === "Active").length;
  const totalDraft    = SEED.filter(t => t.status === "Draft").length;
  const totalUsed     = SEED.reduce((s, t) => s + t.timesUsed, 0);

  const toggleExpand = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  // ── Card ──
  const TemplateCard = ({ t }: { t: ReportTemplate }) => {
    const sc   = STATUS_CFG[t.status];
    const isEx = expanded[t.id];
    return (
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", transition:"box-shadow 0.2s", display:"flex", flexDirection:"column" }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)")}>

        {/* Card top accent */}
        <div style={{ height:3, background: t.status === "Active" ? t.bankColor : "#e5e7eb" }}/>

        <div style={{ padding:"16px 18px", flex:1, display:"flex", flexDirection:"column", gap:12 }}>

          {/* Header row */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:t.bankColor, color:"#fff", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, letterSpacing:"0.03em" }}>
                {t.bankCode}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#111827", lineHeight:1.3 }}>{t.name}</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2, display:"flex", gap:6 }}>
                  <span>{t.id}</span>
                  <span>·</span>
                  <span>{t.version}</span>
                </div>
              </div>
            </div>
            <span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:"3px 10px", whiteSpace:"nowrap", flexShrink:0,
              color:sc.color, background:sc.bg, border:`1px solid ${sc.border}` }}>
              {t.status === "Active" ? "✦ Active" : t.status}
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize:12, color:"#6b7280", margin:0, lineHeight:1.5,
            display: isEx ? "block" : "-webkit-box",
            WebkitLineClamp: isEx ? undefined : 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: isEx ? "visible" : "hidden" }}>
            {t.description}
          </p>

          {/* Stats */}
          <div style={{ display:"flex", gap:20 }}>
            {[
              { icon:"ri-layout-3-line",        val:t.blocksCount,   label:"BLOCKS"   },
              { icon:"ri-questionnaire-line",    val:t.questionsCount,label:"QUESTIONS"},
              { icon:"ri-file-chart-line",       val:t.timesUsed,     label:"USED"     },
            ].map(s => (
              <div key={s.label} style={{ textAlign:"center" as const }}>
                <div style={{ fontSize:17, fontWeight:800, color:"#111827" }}>{s.val}</div>
                <div style={{ fontSize:9, fontWeight:700, color:"#9ca3af", letterSpacing:"0.07em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Circle */}
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:t.bankColor, flexShrink:0, display:"inline-block" }}/>
            <span style={{ fontSize:11, fontWeight:600, color:"#374151" }}>{t.circle}</span>
          </div>

          {/* Tags */}
          {isEx && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {t.tags.map(tag => (
                <span key={tag} style={{ fontSize:11, fontWeight:600, color:"#475569", background:"#f1f5f9", borderRadius:6, padding:"2px 9px" }}>{tag}</span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:11, color:"#9ca3af" }}>Created On: <strong style={{ color:"#374151" }}>{t.createdOn}</strong></span>
            <div style={{ display:"flex", gap:4 }}>
              <button onClick={() => toggleExpand(t.id)} title={isEx ? "Collapse" : "Expand"}
                style={{ width:30, height:30, border:"1px solid #e5e7eb", borderRadius:7, background:"#fff", cursor:"pointer", color:"#6b7280", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className={isEx ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} style={{ fontSize:16 }}/>
              </button>
              <button onClick={() => router.push(`/report-template/${t.id}/view`)} title="View"
                style={{ width:30, height:30, border:"1px solid #e5e7eb", borderRadius:7, background:"#fff", cursor:"pointer", color:"#6b7280", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="ri-eye-line" style={{ fontSize:14 }}/>
              </button>
              <button onClick={() => router.push(`/report-template/${t.id}`)} title="Edit"
                style={{ width:30, height:30, border:"1px solid #e5e7eb", borderRadius:7, background:"#fff", cursor:"pointer", color:"#6b7280", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="ri-pencil-line" style={{ fontSize:14 }}/>
              </button>
              <button title="Archive"
                style={{ width:30, height:30, border:"1px solid #e5e7eb", borderRadius:7, background:"#fff", cursor:"pointer", color:"#6b7280", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="ri-archive-line" style={{ fontSize:14 }}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── List row ──
  const TemplateRow = ({ t }: { t: ReportTemplate }) => {
    const sc = STATUS_CFG[t.status];
    return (
      <tr onMouseEnter={e => (e.currentTarget.style.background="#f9fafb")}
          onMouseLeave={e => (e.currentTarget.style.background="transparent")}
          style={{ transition:"background 0.1s" }}>
        <td style={TD}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:t.bankColor, color:"#fff", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {t.bankCode}
            </div>
            <div>
              <div style={{ fontWeight:700, color:"#111827", fontSize:13 }}>{t.name}</div>
              <div style={{ fontSize:11, color:"#9ca3af" }}>{t.id} · {t.version}</div>
            </div>
          </div>
        </td>
        <td style={TD}>{t.circle}</td>
        <td style={{ ...TD, textAlign:"center" as const }}>{t.blocksCount}</td>
        <td style={{ ...TD, textAlign:"center" as const }}>{t.questionsCount}</td>
        <td style={{ ...TD, textAlign:"center" as const }}>
          <span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:"3px 10px", color:sc.color, background:sc.bg }}>{t.status}</span>
        </td>
        <td style={{ ...TD, textAlign:"center" as const }}>
          <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
            <button onClick={() => router.push(`/report-template/${t.id}`)}
              style={{ width:28, height:28, border:"none", background:"transparent", cursor:"pointer", color:"#6b7280", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ri-pencil-line" style={{ fontSize:14 }}/>
            </button>
            <button style={{ width:28, height:28, border:"none", background:"transparent", cursor:"pointer", color:"#6b7280", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ri-archive-line" style={{ fontSize:14 }}/>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const TD: React.CSSProperties = {
    padding:"13px 16px", fontSize:13, color:"#374151",
    borderBottom:"1px solid #f3f4f6", verticalAlign:"middle",
  };
  const TH: React.CSSProperties = {
    padding:"11px 16px", fontSize:11, fontWeight:700, color:"#6b7280",
    textTransform:"uppercase" as const, letterSpacing:"0.05em",
    background:"#f9fafb", borderBottom:"1px solid #e5e7eb",
    textAlign:"left" as const, whiteSpace:"nowrap" as const,
  };

  return (
    <div style={{ padding:"24px 28px", minHeight:"100%", background:"var(--default-background,#f8f9fa)" }}>

      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#9ca3af", marginBottom:6 }}>
        <Link href="/dashboard" style={{ color:"#9ca3af", textDecoration:"none" }}>Dashboard</Link>
        <i className="ri-arrow-right-s-line"/>
        <span style={{ color:"#374151" }}>Audit Configuration</span>
        <i className="ri-arrow-right-s-line"/>
        <span style={{ color:"#111827", fontWeight:600 }}>Report Templates</span>
      </div>

      {/* Page header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>Report Templates</h1>
          <p style={{ fontSize:13, color:"#6b7280", margin:"3px 0 0" }}>
            Manage report layouts — configure block order, visible sections and question sequence
          </p>
        </div>
        <button onClick={() => router.push("/report-template/new")}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:9, border:"none", background:"#111827", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
          <i className="ri-add-line" style={{ fontSize:15 }}/>+ New Template
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
        {[
          { label:"TOTAL TEMPLATES", value:SEED.length,   icon:"ri-file-chart-line",    color:"#2563eb",  borderColor:"#2563eb" },
          { label:"ACTIVE",          value:totalActive,   icon:"ri-checkbox-circle-line",color:"#16a34a",  borderColor:"#16a34a" },
          { label:"DRAFTS",          value:totalDraft,    icon:"ri-edit-box-line",        color:"#d97706",  borderColor:"#d97706" },
          { label:"TOTAL REPORTS RUN",value:totalUsed,    icon:"ri-bar-chart-line",       color:"#7c3aed",  borderColor:"#7c3aed" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"18px 20px", borderLeft:`3px solid ${s.borderColor}`, display:"flex", alignItems:"center", gap:14 }}>
            <div>
              <div style={{ fontSize:28, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:"0.07em", marginTop:4 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {/* Search */}
        <div style={{ position:"relative", flex:"1", minWidth:220, maxWidth:340 }}>
          <i className="ri-search-line" style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#9ca3af" }}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by template name or bank..."
            style={{ width:"100%", padding:"9px 12px 9px 34px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:13, color:"#374151", background:"#fff", outline:"none", boxSizing:"border-box" as const }}/>
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", background:"#f3f4f6", borderRadius:8, padding:3, gap:2 }}>
          {(["All","Active","Draft","Archived"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:"6px 14px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:700, transition:"all 0.15s",
                background: filter === f ? "#fff" : "transparent",
                color:      filter === f ? "#111827" : "#9ca3af",
                boxShadow:  filter === f ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ flex:1 }}/>

        {/* Count + view toggle */}
        <span style={{ fontSize:12, color:"#9ca3af", fontWeight:600 }}>{filtered.length} templates</span>
        <div style={{ display:"flex", border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden" }}>
          {(["Grid","List"] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)}
              style={{ padding:"7px 13px", border:"none", cursor:"pointer", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:5,
                background: viewMode === m ? "#111827" : "#fff",
                color:      viewMode === m ? "#fff" : "#6b7280" }}>
              <i className={m === "Grid" ? "ri-grid-fill" : "ri-list-check"} style={{ fontSize:14 }}/>{m}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}>
          <i className="ri-file-chart-line" style={{ fontSize:48, display:"block", marginBottom:12 }}/>
          <p style={{ fontSize:14 }}>No report templates match your search</p>
        </div>
      )}

      {/* Grid view — grouped by bank */}
      {viewMode === "Grid" && Object.entries(grouped).map(([bank, templates]) => {
        const bankColor = templates[0].bankColor;
        const bankCode  = templates[0].bankCode;
        return (
          <div key={bank} style={{ marginBottom:28 }}>
            {/* Bank group header */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:bankColor, color:"#fff", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {bankCode}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:"var(--default-text-color)" }}>{bank}</div>
                <div style={{ fontSize:11, color:"#9ca3af" }}>{templates.length} template{templates.length !== 1 ? "s" : ""}</div>
              </div>
            </div>
            {/* Left accent + cards */}
            <div style={{ borderLeft:`3px solid ${bankColor}`, paddingLeft:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:14 }}>
                {templates.map(t => <TemplateCard key={t.id} t={t}/>)}
              </div>
            </div>
          </div>
        );
      })}

      {/* List view */}
      {viewMode === "List" && filtered.length > 0 && (
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                <th style={TH}>TEMPLATE</th>
                <th style={TH}>CIRCLE</th>
                <th style={{ ...TH, textAlign:"center" as const }}>BLOCKS</th>
                <th style={{ ...TH, textAlign:"center" as const }}>QUESTIONS</th>
                <th style={{ ...TH, textAlign:"center" as const }}>STATUS</th>
                <th style={{ ...TH, textAlign:"center" as const }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => <TemplateRow key={t.id} t={t}/>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
