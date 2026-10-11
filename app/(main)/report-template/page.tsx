"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BlockItem {
  id: string;
  label: string;
  visible: boolean;
}

interface ReportBlock {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;          // accent color
  bg: string;             // light bg for icon
  type: "fixed" | "questions" | "images" | "table";
  visible: boolean;
  expanded: boolean;
  items: BlockItem[];
}

// ── Seed data (from PDF report structure) ─────────────────────────────────────
const INITIAL_BLOCKS: ReportBlock[] = [
  {
    id: "cover",
    title: "Cover Page",
    subtitle: "Branch identity, FY, audit date, company branding",
    icon: "ri-file-shield-2-line",
    color: "#2563eb",
    bg: "#eff6ff",
    type: "fixed",
    visible: true,
    expanded: false,
    items: [
      { id: "cover-bank",    label: "Bank Name",              visible: true  },
      { id: "cover-branch",  label: "Branch Name",            visible: true  },
      { id: "cover-code",    label: "Branch Code",            visible: true  },
      { id: "cover-address", label: "Branch Address",         visible: true  },
      { id: "cover-fy",      label: "Financial Year",         visible: true  },
      { id: "cover-date",    label: "Audit Date",             visible: true  },
      { id: "cover-auditor", label: "Auditor Name",           visible: true  },
      { id: "cover-rbo",     label: "RBO",                    visible: true  },
      { id: "cover-ao",      label: "AO (Area Office)",       visible: true  },
      { id: "cover-lho",     label: "LHO (Local Head Office)",visible: true  },
      { id: "cover-logo",    label: "Company Logo & Address", visible: true  },
    ],
  },
  {
    id: "annexure1",
    title: "Annexure I — Electrical Safety Audit",
    subtitle: "Branch metadata: load, area, controllers, UPS & DG details",
    icon: "ri-file-list-2-line",
    color: "#0891b2",
    bg: "#ecfeff",
    type: "fixed",
    visible: true,
    expanded: false,
    items: [
      { id: "a1-code",       label: "Branch Code / Name",                          visible: true  },
      { id: "a1-address",    label: "Address",                                     visible: true  },
      { id: "a1-bm",         label: "BM's PF No., Name and Contact",               visible: true  },
      { id: "a1-ctrl1",      label: "Name of Controller–I (RM) & PF No.",          visible: true  },
      { id: "a1-ctrl2",      label: "Name of Controller–II (DGM) & PF No.",        visible: true  },
      { id: "a1-sload",      label: "Sanctioned Load (KW/KVA)",                    visible: true  },
      { id: "a1-cload",      label: "Connected Load (KW/KVA)",                     visible: true  },
      { id: "a1-bill",       label: "Monthly Energy Bill Amount (Approx.)",        visible: true  },
      { id: "a1-ac",         label: "Tonnage of Air-Conditioners (TR)",            visible: true  },
      { id: "a1-area",       label: "Area of Branch / Office (Sq. Ft.)",           visible: true  },
      { id: "a1-htlt",       label: "HT / LT Connection",                          visible: true  },
      { id: "a1-fauditor",   label: "Name of Field Auditor",                       visible: true  },
      { id: "a1-adate",      label: "Audit Conducted On",                          visible: true  },
      { id: "a1-ebill",      label: "Hard Copy of Latest Electricity Bill",        visible: true  },
      { id: "a1-lastaudit",  label: "Last Audit Date & Auditor Name",              visible: true  },
      { id: "a1-ups",        label: "UPS Details (Rating, Battery, Count)",        visible: true  },
      { id: "a1-dg",         label: "Generator Details (Capacity, Hired/Owned)",   visible: true  },
    ],
  },
  {
    id: "annexure2",
    title: "Annexure II — Audit Questions",
    subtitle: "Main compliance checklist: Yes/No and Observations/Remarks",
    icon: "ri-questionnaire-line",
    color: "#7c3aed",
    bg: "#f5f3ff",
    type: "questions",
    visible: true,
    expanded: false,
    items: [
      { id: "q1",   label: "MCCBs/MCBs/ELCBs with proper rating",                                      visible: true  },
      { id: "q2",   label: "Light & emergency light in electrical rooms",                               visible: true  },
      { id: "q3",   label: "Pump/DG/UPS rooms maintained dry and clean",                               visible: true  },
      { id: "q4",   label: "Water seepage near electrical panels/equipment",                           visible: true  },
      { id: "q5a",  label: "Earthing pits properly maintained",                                        visible: true  },
      { id: "q7",   label: "Electricity-bill penalty in meter details",                                visible: true  },
      { id: "q7a",  label: "Additional electrical load required",                                      visible: true  },
      { id: "q13",  label: "Preventive maintenance by licensed electrician",                           visible: true  },
      { id: "q16",  label: "PF panel of appropriate rating installed",                                 visible: true  },
      { id: "q17b", label: "Combustible/waste papers removed periodically",                            visible: true  },
      { id: "q17c", label: "No stationery stored in UPS room",                                        visible: true  },
      { id: "q18ii",label: "Metal exhaust fan for UPS room ventilation",                               visible: true  },
      { id: "q18iii",label:"Ceiling fans — all BLDC",                                                  visible: true  },
      { id: "q19ii",label: "LED lighting — numbers recommended",                                       visible: true  },
      { id: "q20",  label: "Fire Protection / Fire Control / Extinguishers",                          visible: true  },
      { id: "q21",  label: "DG set recorded in equipment details",                                     visible: true  },
      { id: "oa1",  label: "Earthing pits provided and connected to equipment",                        visible: true  },
      { id: "oa4",  label: "Load distributed in all 3 phases",                                        visible: true  },
      { id: "oa5",  label: "Isolating switches for non-essential loads",                               visible: true  },
      { id: "oa6",  label: "Pantry equipment connected to MCBs",                                      visible: true  },
      { id: "oa7",  label: "Preventive maintenance of panel boards by licensed electrician",           visible: true  },
      { id: "oa8",  label: "Timers used for AC changeover / signage boards",                          visible: true  },
      { id: "oa9",  label: "General condition of electrical panels, DBs, switch boards",              visible: true  },
      { id: "oa10", label: "Emergency contact numbers displayed in electric/UPS room",                 visible: true  },
      { id: "oa11", label: "Fire extinguishers — Banking Hall (Water/CO2)",                           visible: true  },
      { id: "oa12", label: "Fire extinguishers — Stationery Room (Water/CO2)",                        visible: true  },
      { id: "oa13", label: "DG Set / Generator installed",                                            visible: true  },
      { id: "oa23", label: "UPS in fire resistant wall enclosure",                                    visible: true  },
      { id: "oa24", label: "2 Exhaust fans/ACs running alternately via timer",                        visible: true  },
      { id: "oa25", label: "Rubber mat placed in UPS room",                                           visible: true  },
      { id: "oa26", label: "Earthing DB provided in UPS room",                                        visible: true  },
      { id: "oa27", label: "General condition of electrical panels in UPS room",                      visible: true  },
      { id: "oa28", label: "Old/disposable records and broken furniture removed",                     visible: true  },
      { id: "oa29", label: "Storage racks at safe distance from electrical points",                   visible: true  },
    ],
  },
  {
    id: "annexure3",
    title: "Annexure III — Onsite ATM",
    subtitle: "ATM-specific electrical and safety compliance questions",
    icon: "ri-bank-card-line",
    color: "#0369a1",
    bg: "#f0f9ff",
    type: "questions",
    visible: true,
    expanded: false,
    items: [
      { id: "atm2",  label: "Fire detector connected to branch AFDS",              visible: true  },
      { id: "atm3",  label: "MCCB/MCB/ELCB provided and in working condition",    visible: true  },
      { id: "atm4",  label: "AC units provided with timer circuit device",         visible: true  },
      { id: "atm5",  label: "Main supply switch/MCB marked for ATM cutoff",       visible: true  },
      { id: "atm7",  label: "Electrical wires properly covered/insulated",        visible: true  },
      { id: "atm8",  label: "No cooking stove / heater coil in ATM",             visible: true  },
      { id: "atm13", label: "Main entrance shutter in working condition",         visible: true  },
      { id: "atm15", label: "All electrical lights in working condition",         visible: true  },
      { id: "atm16", label: "ATM provided with external CCTV camera",            visible: true  },
      { id: "atm17", label: "CCTV in working condition",                          visible: true  },
    ],
  },
  {
    id: "ups",
    title: "UPS Details",
    subtitle: "UPS/Inverter table, battery specs and live parameter readings",
    icon: "ri-battery-charge-line",
    color: "#15803d",
    bg: "#f0fdf4",
    type: "table",
    visible: true,
    expanded: false,
    items: [
      { id: "ups-table",  label: "UPS / Inverter Capacity Table (Make, KVA, Phase, Batteries)", visible: true },
      { id: "ups-params", label: "UPS Parameters (Input/Output Voltage, Current, Frequency)",   visible: true },
    ],
  },
  {
    id: "meter",
    title: "Meter Details & Electrical Parameters",
    subtitle: "Meter info, voltage readings, current readings and power factor",
    icon: "ri-dashboard-3-line",
    color: "#b45309",
    bg: "#fffbeb",
    type: "table",
    visible: true,
    expanded: false,
    items: [
      { id: "meter-info",    label: "Meter Details (Provider, Sanctioned Load, Meter No., Consumption)", visible: true },
      { id: "meter-voltage", label: "Voltage Readings (R-Y, Y-B, B-R, R-N, Y-N, B-N)",                 visible: true },
      { id: "meter-current", label: "Current Readings (R/Y/B Phase, Avg. Current)",                    visible: true },
      { id: "meter-freq",    label: "Frequency (Hz)",                                                   visible: true },
      { id: "meter-pf",      label: "Power Factor (PF)",                                                visible: true },
      { id: "meter-earth",   label: "N-E Voltage / Earthing",                                          visible: true },
    ],
  },
  {
    id: "dg",
    title: "DG Set Details",
    subtitle: "Diesel generator specifications, observations and safety standards",
    icon: "ri-plug-line",
    color: "#6b21a8",
    bg: "#faf5ff",
    type: "table",
    visible: true,
    expanded: false,
    items: [
      { id: "dg-type",      label: "DG Set — Hired or Owned",                      visible: true },
      { id: "dg-capacity",  label: "DG Set Capacity (KVA)",                        visible: true },
      { id: "dg-make",      label: "DG Set Make (OEM)",                            visible: true },
      { id: "dg-acoustic",  label: "Acoustic Enclosure Provided",                  visible: true },
      { id: "dg-batteries", label: "No. of DG Set Batteries",                      visible: true },
      { id: "dg-bat-ah",    label: "DG Set Battery Rating (AH)",                   visible: true },
    ],
  },
  {
    id: "loadsheet",
    title: "Branch Load Sheet",
    subtitle: "Equipment-wise load calculation grouped by category",
    icon: "ri-table-2",
    color: "#0f766e",
    bg: "#f0fdfa",
    type: "table",
    visible: true,
    expanded: false,
    items: [
      { id: "ls-lighting",  label: "Lighting Load (Flush Lights, Down Lights, LED Tubes, etc.)", visible: true },
      { id: "ls-fans",      label: "Fan Load (Ceiling, BLDC Wall, Exhaust)",                     visible: true },
      { id: "ls-ups",       label: "UPS Load (Computers, Printers, Machines, ATM, CDM, etc.)",  visible: true },
      { id: "ls-ac",        label: "Air Conditioning Load (Split, Cassette — with Tonnage)",    visible: true },
      { id: "ls-power",     label: "Power Load (Water Cooler, Other Equipment, UPS %)",         visible: true },
      { id: "ls-total",     label: "Total Connected Load Summary",                               visible: true },
    ],
  },
  {
    id: "photos-overview",
    title: "Photographic Overview",
    subtitle: "Audit observations with risk classification and photo evidence",
    icon: "ri-camera-lens-line",
    color: "#be123c",
    bg: "#fff1f2",
    type: "images",
    visible: true,
    expanded: false,
    items: [
      { id: "po-low",    label: "LOW RISK — Observations & Rectification Photographs",     visible: true },
      { id: "po-medium", label: "MEDIUM RISK — Observations & Rectification Photographs",  visible: true },
      { id: "po-high",   label: "HIGH RISK — Observations & Rectification Photographs",    visible: true },
      { id: "po-sign",   label: "Auditor & Branch Representative Signatures",              visible: true },
    ],
  },
  {
    id: "ebill",
    title: "Electricity Bill Image",
    subtitle: "Scanned copy of latest electricity bill submitted at branch",
    icon: "ri-receipt-line",
    color: "#ca8a04",
    bg: "#fefce8",
    type: "images",
    visible: true,
    expanded: false,
    items: [
      { id: "eb-image", label: "Electricity Bill Scan / Photo", visible: true },
    ],
  },
  {
    id: "sample-images",
    title: "Sample Images",
    subtitle: "Location-wise photographs captured during the audit visit",
    icon: "ri-image-2-line",
    color: "#475569",
    bg: "#f8fafc",
    type: "images",
    visible: true,
    expanded: false,
    items: [
      { id: "img-front",    label: "Branch Front Photo",                   visible: true  },
      { id: "img-ups-room", label: "UPS Room Photo",                       visible: true  },
      { id: "img-ups-earth", label: "UPS Earthing Photo",                 visible: true  },
      { id: "img-ups-mcb",  label: "UPS MCB Photo",                        visible: true  },
      { id: "img-exhaust",  label: "UPS Room Exhaust Fan Photo",           visible: true  },
      { id: "img-materials",label: "UPS / Stationery Room Materials Photo",visible: true  },
      { id: "img-panel",    label: "Main Panel Photo",                     visible: true  },
      { id: "img-fire",     label: "Fire Extinguishers Photo",             visible: true  },
      { id: "img-atm",      label: "Onsite ATM Back-Room Photo",           visible: true  },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<ReportBlock["type"], string> = {
  fixed:     "Fields",
  questions: "Questions",
  images:    "Images",
  table:     "Table",
};

const TYPE_COLORS: Record<ReportBlock["type"], { bg: string; color: string }> = {
  fixed:     { bg: "#dbeafe", color: "#1d4ed8" },
  questions: { bg: "#ede9fe", color: "#7c3aed" },
  images:    { bg: "#fce7f3", color: "#be185d" },
  table:     { bg: "#d1fae5", color: "#065f46" },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ReportTemplatePage() {
  const [blocks, setBlocks] = useState<ReportBlock[]>(INITIAL_BLOCKS);
  const [toast,  setToast]  = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const markChanged = () => setHasChanges(true);

  // ── Block operations ──
  const moveBlock = useCallback((idx: number, dir: -1 | 1) => {
    const to = idx + dir;
    if (to < 0 || to >= blocks.length) return;
    setBlocks(prev => {
      const next = [...prev];
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
    markChanged();
    showToast(`Moved "${blocks[idx].title}" ${dir === -1 ? "up" : "down"}`);
  }, [blocks]);

  const toggleBlockVisibility = useCallback((id: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, visible: !b.visible } : b));
    markChanged();
  }, []);

  const toggleBlockExpanded = useCallback((id: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, expanded: !b.expanded } : b));
  }, []);

  // ── Item operations ──
  const moveItem = useCallback((blockId: string, itemIdx: number, dir: -1 | 1) => {
    setBlocks(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      const items = [...b.items];
      const to = itemIdx + dir;
      if (to < 0 || to >= items.length) return b;
      [items[itemIdx], items[to]] = [items[to], items[itemIdx]];
      return { ...b, items };
    }));
    markChanged();
  }, []);

  const toggleItemVisibility = useCallback((blockId: string, itemId: string) => {
    setBlocks(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      return { ...b, items: b.items.map(it => it.id === itemId ? { ...it, visible: !it.visible } : it) };
    }));
    markChanged();
  }, []);

  const visibleBlocks  = blocks.filter(b => b.visible).length;
  const hiddenBlocks   = blocks.filter(b => !b.visible).length;

  return (
    <div style={{ padding:"24px 28px", minHeight:"100%", background:"var(--default-background,#f8f9fa)" }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#9ca3af", marginBottom:6 }}>
        <Link href="/dashboard" style={{ color:"#9ca3af", textDecoration:"none" }}>Dashboard</Link>
        <i className="ri-arrow-right-s-line"/>
        <span style={{ color:"#374151" }}>Audit Configuration</span>
        <i className="ri-arrow-right-s-line"/>
        <span style={{ color:"#111827", fontWeight:600 }}>Report Template</span>
      </div>

      {/* ── Page title + actions ── */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, gap:16 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>Report Template</h1>
          <p style={{ fontSize:13, color:"#6b7280", margin:"3px 0 0" }}>
            Control which blocks appear in the report and the order of questions within each block
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          {hasChanges && (
            <span style={{ fontSize:11, fontWeight:700, color:"#d97706", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:20, padding:"4px 12px", display:"flex", alignItems:"center", gap:5 }}>
              <i className="ri-circle-fill" style={{ fontSize:7 }}/>Unsaved changes
            </span>
          )}
          <button onClick={() => { setHasChanges(false); showToast("Template saved successfully"); }}
            style={{ padding:"9px 20px", borderRadius:8, border:"none", background:"#111827", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
            <i className="ri-save-line"/>Save Template
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Total Blocks",    value:blocks.length,   icon:"ri-layout-3-line",        color:"#2563eb", bg:"#eff6ff" },
          { label:"Visible in Report",value:visibleBlocks,  icon:"ri-eye-line",             color:"#16a34a", bg:"#f0fdf4" },
          { label:"Hidden",          value:hiddenBlocks,    icon:"ri-eye-off-line",         color:"#9ca3af", bg:"#f9fafb" },
          { label:"Total Questions", value:blocks.filter(b=>b.type==="questions").reduce((s,b)=>s+b.items.filter(i=>i.visible).length,0),
                                                            icon:"ri-questionnaire-line",    color:"#7c3aed", bg:"#f5f3ff" },
        ].map(s => (
          <div key={s.label} style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={s.icon} style={{ fontSize:18, color:s.color }}/>
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Help banner ── */}
      <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"flex-start", gap:10 }}>
        <i className="ri-information-line" style={{ fontSize:16, color:"#2563eb", flexShrink:0, marginTop:1 }}/>
        <div style={{ fontSize:12, color:"#1e40af", lineHeight:1.6 }}>
          <strong>How to use:</strong> Use <strong>↑ ↓</strong> to change block order in the report.
          Click <strong><i className="ri-eye-line" style={{ fontSize:11 }}/></strong> to hide/show a block or item.
          Expand a block to reorder questions or images inside it. Changes take effect on the next generated PDF.
        </div>
      </div>

      {/* ── Block list ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {blocks.map((block, idx) => {
          const typeCfg    = TYPE_COLORS[block.type];
          const visItems   = block.items.filter(i => i.visible).length;
          const totalItems = block.items.length;

          return (
            <div key={block.id}
              style={{ background:"var(--custom-white)", borderRadius:12, border:`1px solid ${block.visible ? "var(--default-border)" : "#e5e7eb"}`, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)", opacity: block.visible ? 1 : 0.6, transition:"opacity 0.2s" }}>

              {/* Block header */}
              <div style={{ display:"flex", alignItems:"center", gap:0, borderLeft:`4px solid ${block.visible ? block.color : "#d1d5db"}` }}>

                {/* Sequence badge */}
                <div style={{ width:48, display:"flex", alignItems:"center", justifyContent:"center", padding:"18px 0", flexShrink:0 }}>
                  <span style={{ width:28, height:28, borderRadius:8, background: block.visible ? block.bg : "#f3f4f6", color: block.visible ? block.color : "#9ca3af", fontSize:13, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {idx + 1}
                  </span>
                </div>

                {/* Icon */}
                <div style={{ width:44, height:44, borderRadius:10, background: block.visible ? block.bg : "#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:14 }}>
                  <i className={block.icon} style={{ fontSize:20, color: block.visible ? block.color : "#9ca3af" }}/>
                </div>

                {/* Title + subtitle */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:14, fontWeight:700, color: block.visible ? "var(--default-text-color)" : "#9ca3af" }}>
                      {block.title}
                    </span>
                    <span style={{ fontSize:10, fontWeight:700, borderRadius:20, padding:"2px 9px",
                      color: typeCfg.color, background: typeCfg.bg }}>
                      {TYPE_LABELS[block.type]}
                    </span>
                    {!block.visible && (
                      <span style={{ fontSize:10, fontWeight:700, color:"#9ca3af", background:"#f3f4f6", borderRadius:20, padding:"2px 9px" }}>
                        Hidden from report
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{block.subtitle}</div>
                </div>

                {/* Item count pill */}
                <div style={{ flexShrink:0, marginRight:12 }}>
                  <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:20, padding:"3px 10px" }}>
                    {visItems}/{totalItems} visible
                  </span>
                </div>

                {/* Controls */}
                <div style={{ display:"flex", alignItems:"center", gap:2, paddingRight:14, flexShrink:0 }}>
                  {/* Move up */}
                  <button onClick={() => moveBlock(idx, -1)} disabled={idx === 0} title="Move up"
                    style={{ width:30, height:30, border:"none", background:"transparent", cursor: idx===0 ? "not-allowed" : "pointer", color: idx===0 ? "#e5e7eb" : "#6b7280", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}
                    onMouseEnter={e => { if (idx>0) (e.currentTarget as HTMLButtonElement).style.background="#f3f4f6"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="transparent"; }}>
                    <i className="ri-arrow-up-s-line" style={{ fontSize:18 }}/>
                  </button>
                  {/* Move down */}
                  <button onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length-1} title="Move down"
                    style={{ width:30, height:30, border:"none", background:"transparent", cursor: idx===blocks.length-1 ? "not-allowed" : "pointer", color: idx===blocks.length-1 ? "#e5e7eb" : "#6b7280", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}
                    onMouseEnter={e => { if (idx<blocks.length-1) (e.currentTarget as HTMLButtonElement).style.background="#f3f4f6"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="transparent"; }}>
                    <i className="ri-arrow-down-s-line" style={{ fontSize:18 }}/>
                  </button>

                  {/* Divider */}
                  <div style={{ width:1, height:20, background:"#e5e7eb", margin:"0 4px" }}/>

                  {/* Toggle visibility */}
                  <button onClick={() => toggleBlockVisibility(block.id)} title={block.visible ? "Hide from report" : "Show in report"}
                    style={{ width:30, height:30, border:"none", background:"transparent", cursor:"pointer", color: block.visible ? "#16a34a" : "#9ca3af", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="#f3f4f6"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="transparent"; }}>
                    <i className={block.visible ? "ri-eye-line" : "ri-eye-off-line"} style={{ fontSize:16 }}/>
                  </button>

                  {/* Divider */}
                  <div style={{ width:1, height:20, background:"#e5e7eb", margin:"0 4px" }}/>

                  {/* Expand / collapse */}
                  <button onClick={() => toggleBlockExpanded(block.id)} title={block.expanded ? "Collapse" : `Expand — edit ${totalItems} items`}
                    style={{ width:30, height:30, border:"none", background:"transparent", cursor:"pointer", color:"#6b7280", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", transition:"transform 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="#f3f4f6"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="transparent"; }}>
                    <i className={block.expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} style={{ fontSize:18 }}/>
                  </button>
                </div>
              </div>

              {/* ── Expanded items ── */}
              {block.expanded && (
                <div style={{ borderTop:"1px solid #f3f4f6" }}>
                  {/* Items header */}
                  <div style={{ padding:"10px 18px 10px 66px", background:"#fafafa", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                      {TYPE_LABELS[block.type]} — drag to reorder, click eye to hide
                    </span>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => { setBlocks(prev => prev.map(b => b.id !== block.id ? b : { ...b, items: b.items.map(it => ({ ...it, visible: true })) })); markChanged(); }}
                        style={{ fontSize:11, fontWeight:700, color:"#16a34a", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:6, padding:"3px 10px", cursor:"pointer" }}>
                        Show all
                      </button>
                      <button onClick={() => { setBlocks(prev => prev.map(b => b.id !== block.id ? b : { ...b, items: b.items.map(it => ({ ...it, visible: false })) })); markChanged(); }}
                        style={{ fontSize:11, fontWeight:700, color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:6, padding:"3px 10px", cursor:"pointer" }}>
                        Hide all
                      </button>
                    </div>
                  </div>

                  {/* Item rows */}
                  {block.items.map((item, iIdx) => (
                    <div key={item.id}
                      style={{ display:"flex", alignItems:"center", gap:0, borderBottom:iIdx < block.items.length-1 ? "1px solid #f9fafb" : "none",
                        background: item.visible ? "transparent" : "#fafafa", opacity: item.visible ? 1 : 0.5, transition:"all 0.15s" }}>

                      {/* Left gutter / indent */}
                      <div style={{ width:66, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:14 }}>
                        <span style={{ fontSize:11, color:"#d1d5db", fontWeight:600, fontFamily:"monospace" }}>
                          {String(iIdx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Item color dot */}
                      <div style={{ width:8, height:8, borderRadius:"50%", background: item.visible ? block.color : "#d1d5db", flexShrink:0, marginRight:12 }}/>

                      {/* Label */}
                      <span style={{ flex:1, fontSize:13, color: item.visible ? "#374151" : "#9ca3af", padding:"11px 0" }}>
                        {item.label}
                      </span>

                      {/* Item controls */}
                      <div style={{ display:"flex", alignItems:"center", gap:2, paddingRight:14, flexShrink:0 }}>
                        <button onClick={() => moveItem(block.id, iIdx, -1)} disabled={iIdx===0} title="Move up"
                          style={{ width:26, height:26, border:"none", background:"transparent", cursor: iIdx===0?"not-allowed":"pointer", color: iIdx===0?"#e5e7eb":"#9ca3af", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}
                          onMouseEnter={e => { if (iIdx>0)(e.currentTarget as HTMLButtonElement).style.background="#f3f4f6"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="transparent"; }}>
                          <i className="ri-arrow-up-s-line" style={{ fontSize:15 }}/>
                        </button>
                        <button onClick={() => moveItem(block.id, iIdx, 1)} disabled={iIdx===block.items.length-1} title="Move down"
                          style={{ width:26, height:26, border:"none", background:"transparent", cursor: iIdx===block.items.length-1?"not-allowed":"pointer", color: iIdx===block.items.length-1?"#e5e7eb":"#9ca3af", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}
                          onMouseEnter={e => { if (iIdx<block.items.length-1)(e.currentTarget as HTMLButtonElement).style.background="#f3f4f6"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="transparent"; }}>
                          <i className="ri-arrow-down-s-line" style={{ fontSize:15 }}/>
                        </button>
                        <button onClick={() => toggleItemVisibility(block.id, item.id)} title={item.visible ? "Hide this item" : "Show this item"}
                          style={{ width:26, height:26, border:"none", background:"transparent", cursor:"pointer", color: item.visible ? "#16a34a" : "#d1d5db", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="#f3f4f6"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="transparent"; }}>
                          <i className={item.visible ? "ri-eye-line" : "ri-eye-off-line"} style={{ fontSize:14 }}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Report preview footer ── */}
      <div style={{ marginTop:24, background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", padding:"16px 20px" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)", marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
          <i className="ri-file-pdf-line" style={{ color:"#dc2626", fontSize:16 }}/>
          Report Page Order Preview
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {blocks.filter(b => b.visible).map((b, i) => (
            <span key={b.id} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, color:b.color, background:b.bg, borderRadius:8, padding:"5px 12px", border:`1px solid ${b.color}22` }}>
              <span style={{ fontSize:10, fontWeight:800, opacity:0.6 }}>P{i+1}</span>
              {b.title}
            </span>
          ))}
          {hiddenBlocks > 0 && (
            <span style={{ fontSize:12, color:"#9ca3af", display:"flex", alignItems:"center", gap:4, padding:"5px 0" }}>
              + {hiddenBlocks} hidden
            </span>
          )}
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"#111827", color:"#fff", borderRadius:10, padding:"12px 18px", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 20px rgba(0,0,0,0.25)", zIndex:9999, animation:"none" }}>
          <i className="ri-checkbox-circle-line" style={{ color:"#4ade80", fontSize:16 }}/>
          {toast}
        </div>
      )}
    </div>
  );
}
