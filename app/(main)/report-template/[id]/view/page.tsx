"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// ── Shared seed (mirrors listing page) ────────────────────────────────────────
interface ReportTemplate {
  id: string; bank: string; bankCode: string; bankColor: string;
  name: string; description: string;
  status: "Active" | "Draft" | "Archived";
  version: string; circle: string;
  blocksCount: number; questionsCount: number; timesUsed: number;
  createdOn: string; tags: string[];
}
const SEED: ReportTemplate[] = [
  { id:"RT-001", bank:"State Bank of India",   bankCode:"SBI",  bankColor:"#1a3c8f", name:"SBI Standard Branch Report",           description:"Full 14-page electrical safety audit report for SBI urban and metro branches covering all annexures, load sheet and photo sections.", status:"Active",   version:"v2.1", circle:"SBI Gujarat Circle",    blocksCount:11, questionsCount:33, timesUsed:42, createdOn:"15 Jan 2024", tags:["Cover Page","Annexure I–III","Load Sheet","Photos"] },
  { id:"RT-006", bank:"State Bank of India",   bankCode:"SBI",  bankColor:"#1a3c8f", name:"SBI Rural Branch Lite Report",         description:"Simplified report template for SBI rural branches — excludes Annexure III (ATM) and condenses load sheet.",                          status:"Draft",    version:"v1.0", circle:"SBI Rajasthan Circle",  blocksCount:8,  questionsCount:22, timesUsed:0,  createdOn:"01 Nov 2023", tags:["Cover Page","Annexure I–II","Load Sheet"] },
  { id:"RT-002", bank:"Bank of Baroda",        bankCode:"BOB",  bankColor:"#d97706", name:"BOB Branch Infrastructure Report",     description:"Tailored report for Bank of Baroda branch infrastructure audits. Includes DG, UPS, and electrical parameter sections.",              status:"Active",   version:"v1.5", circle:"BOB Gujarat Circle",    blocksCount:11, questionsCount:29, timesUsed:18, createdOn:"10 Mar 2024", tags:["Cover Page","Annexure I–II","UPS","DG Set"] },
  { id:"RT-003", bank:"UCO Bank",              bankCode:"UCO",  bankColor:"#0f766e", name:"UCO Bank East Circle Report",          description:"Standard report template for UCO Bank eastern circle branches with regional compliance additions.",                                 status:"Active",   version:"v1.1", circle:"UCO East Circle",       blocksCount:10, questionsCount:27, timesUsed:9,  createdOn:"22 May 2024", tags:["Cover Page","Annexure I–III","Load Sheet"] },
  { id:"RT-004", bank:"Canara Bank",           bankCode:"CNRB", bankColor:"#15803d", name:"Canara Bank Standard Audit Report",   description:"Canara Bank standard report with full annexure suite and photographic evidence sections.",                                          status:"Archived", version:"v1.0", circle:"Canara South Circle",   blocksCount:9,  questionsCount:24, timesUsed:6,  createdOn:"05 Aug 2023", tags:["Cover Page","Annexure I–II","Photos"] },
];

// ── Blocks ────────────────────────────────────────────────────────────────────
interface BlockItem  { id:string; label:string; visible:boolean }
interface ReportBlock { id:string; title:string; subtitle:string; icon:string; color:string; bg:string; type:"fixed"|"questions"|"images"|"table"; visible:boolean; items:BlockItem[] }

const ALL_BLOCKS: ReportBlock[] = [
  { id:"cover",      title:"Cover Page",                          subtitle:"Branch identity, FY, audit date, company branding",                       icon:"ri-file-shield-2-line", color:"#2563eb", bg:"#eff6ff", type:"fixed",     visible:true,  items:[{id:"c1",label:"Bank Name",visible:true},{id:"c2",label:"Branch Name",visible:true},{id:"c3",label:"Branch Code",visible:true},{id:"c4",label:"Branch Address",visible:true},{id:"c5",label:"Financial Year",visible:true},{id:"c6",label:"Audit Date",visible:true},{id:"c7",label:"Auditor Name",visible:true},{id:"c8",label:"RBO",visible:true},{id:"c9",label:"AO (Area Office)",visible:true},{id:"c10",label:"LHO (Local Head Office)",visible:true},{id:"c11",label:"Company Logo & Address",visible:true}] },
  { id:"annexure1",  title:"Annexure I — Electrical Safety Audit",subtitle:"Branch metadata: load, area, controllers, UPS & DG details",              icon:"ri-file-list-2-line",   color:"#0891b2", bg:"#ecfeff", type:"fixed",     visible:true,  items:[{id:"a1",label:"Branch Code / Name",visible:true},{id:"a2",label:"Address",visible:true},{id:"a3",label:"BM's PF No., Name and Contact",visible:true},{id:"a4",label:"Sanctioned Load (KW/KVA)",visible:true},{id:"a5",label:"Connected Load (KW/KVA)",visible:true},{id:"a6",label:"Monthly Energy Bill Amount",visible:true},{id:"a7",label:"Tonnage of Air-Conditioners (TR)",visible:true},{id:"a8",label:"Area of Branch / Office (Sq. Ft.)",visible:true},{id:"a9",label:"UPS Details",visible:true},{id:"a10",label:"Generator Details",visible:true}] },
  { id:"annexure2",  title:"Annexure II — Audit Questions",       subtitle:"Main compliance checklist: Yes/No and Observations/Remarks",               icon:"ri-questionnaire-line", color:"#7c3aed", bg:"#f5f3ff", type:"questions", visible:true,  items:[{id:"q1",label:"MCCBs/MCBs/ELCBs with proper rating",visible:true},{id:"q2",label:"Light & emergency light in electrical rooms",visible:true},{id:"q3",label:"Pump/DG/UPS rooms maintained dry and clean",visible:true},{id:"q4",label:"Water seepage near electrical panels",visible:true},{id:"q5",label:"Earthing pits properly maintained",visible:true},{id:"q6",label:"Preventive maintenance by licensed electrician",visible:true},{id:"q7",label:"PF panel of appropriate rating installed",visible:true},{id:"q8",label:"Fire Protection / Fire Extinguishers",visible:true},{id:"q9",label:"DG set recorded in equipment details",visible:true},{id:"q10",label:"Load distributed in all 3 phases",visible:true}] },
  { id:"annexure3",  title:"Annexure III — Onsite ATM",           subtitle:"ATM-specific electrical and safety compliance questions",                   icon:"ri-bank-card-line",     color:"#0369a1", bg:"#f0f9ff", type:"questions", visible:true,  items:[{id:"atm1",label:"Fire detector connected to branch AFDS",visible:true},{id:"atm2",label:"MCCB/MCB/ELCB provided and in working condition",visible:true},{id:"atm3",label:"AC units provided with timer circuit device",visible:true},{id:"atm4",label:"Main supply switch/MCB marked for ATM cutoff",visible:true},{id:"atm5",label:"No cooking stove / heater coil in ATM",visible:true}] },
  { id:"ups",        title:"UPS Details",                         subtitle:"UPS/Inverter table, battery specs and live parameter readings",              icon:"ri-battery-charge-line",color:"#15803d", bg:"#f0fdf4", type:"table",     visible:true,  items:[{id:"ups1",label:"UPS / Inverter Capacity Table",visible:true},{id:"ups2",label:"UPS Parameters (Voltage, Current, Frequency)",visible:true}] },
  { id:"meter",      title:"Meter Details & Electrical Parameters",subtitle:"Meter info, voltage readings, current readings and power factor",          icon:"ri-dashboard-3-line",   color:"#b45309", bg:"#fffbeb", type:"table",     visible:true,  items:[{id:"m1",label:"Meter Details",visible:true},{id:"m2",label:"Voltage Readings",visible:true},{id:"m3",label:"Current Readings",visible:true},{id:"m4",label:"Power Factor (PF)",visible:true}] },
  { id:"dg",         title:"DG Set Details",                      subtitle:"Diesel generator specifications, observations and safety standards",         icon:"ri-plug-line",          color:"#6b21a8", bg:"#faf5ff", type:"table",     visible:true,  items:[{id:"dg1",label:"DG Set — Hired or Owned",visible:true},{id:"dg2",label:"DG Set Capacity (KVA)",visible:true},{id:"dg3",label:"DG Set Make (OEM)",visible:true},{id:"dg4",label:"Acoustic Enclosure Provided",visible:true}] },
  { id:"loadsheet",  title:"Branch Load Sheet",                   subtitle:"Equipment-wise load calculation grouped by category",                       icon:"ri-table-2",            color:"#0f766e", bg:"#f0fdfa", type:"table",     visible:true,  items:[{id:"ls1",label:"Lighting Load",visible:true},{id:"ls2",label:"Fan Load",visible:true},{id:"ls3",label:"UPS Load",visible:true},{id:"ls4",label:"Air Conditioning Load",visible:true},{id:"ls5",label:"Power Load",visible:true},{id:"ls6",label:"Total Connected Load Summary",visible:true}] },
  { id:"photos",     title:"Photographic Overview",               subtitle:"Audit observations with risk classification and photo evidence",             icon:"ri-camera-lens-line",   color:"#be123c", bg:"#fff1f2", type:"images",    visible:true,  items:[{id:"po1",label:"LOW RISK — Observations & Photographs",visible:true},{id:"po2",label:"MEDIUM RISK — Observations & Photographs",visible:true},{id:"po3",label:"HIGH RISK — Observations & Photographs",visible:true},{id:"po4",label:"Signatures",visible:true}] },
  { id:"ebill",      title:"Electricity Bill Image",              subtitle:"Scanned copy of latest electricity bill submitted at branch",               icon:"ri-receipt-line",       color:"#ca8a04", bg:"#fefce8", type:"images",    visible:true,  items:[{id:"eb1",label:"Electricity Bill Scan / Photo",visible:true}] },
  { id:"samplepics", title:"Sample Images",                       subtitle:"Location-wise photographs captured during the audit visit",                  icon:"ri-image-2-line",       color:"#475569", bg:"#f8fafc", type:"images",    visible:true,  items:[{id:"si1",label:"Branch Front Photo",visible:true},{id:"si2",label:"UPS Room Photo",visible:true},{id:"si3",label:"Main Panel Photo",visible:true},{id:"si4",label:"Fire Extinguishers Photo",visible:true}] },
];

const TYPE_LABELS: Record<ReportBlock["type"],string> = { fixed:"Fields", questions:"Questions", images:"Images", table:"Table" };
const TYPE_COLORS: Record<ReportBlock["type"],{bg:string;color:string}> = {
  fixed:     { bg:"#dbeafe", color:"#1d4ed8" },
  questions: { bg:"#ede9fe", color:"#7c3aed" },
  images:    { bg:"#fce7f3", color:"#be185d" },
  table:     { bg:"#d1fae5", color:"#065f46" },
};
const STATUS_CFG = {
  Active:   { color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
  Draft:    { color:"#d97706", bg:"#fffbeb", border:"#fcd34d" },
  Archived: { color:"#6b7280", bg:"#f3f4f6", border:"#e5e7eb" },
};

export default function ViewReportTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const tpl = SEED.find(s => s.id === id) ?? SEED[0];
  const sc  = STATUS_CFG[tpl.status];

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (bid: string) => setExpanded(p => ({ ...p, [bid]: !p[bid] }));

  // Show all blocks for full template; archived/draft may hide some
  const blocks = ALL_BLOCKS;
  const visibleBlocks = blocks.filter(b => b.visible).length;

  return (
    <div style={{ minHeight:"100%", background:"var(--default-background,#f8f9fa)" }}>

      {/* ── Top bar ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"0 28px", height:56, display:"flex", alignItems:"center", gap:14, position:"sticky", top:0, zIndex:100 }}>
        <Link href="/report-template"
          style={{ width:34, height:34, borderRadius:8, border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280", textDecoration:"none" }}>
          <i className="ri-arrow-left-line" style={{ fontSize:16 }}/>
        </Link>
        <span style={{ fontSize:13, color:"#9ca3af" }}>
          <Link href="/report-template" style={{ color:"#9ca3af", textDecoration:"none" }}>Report Templates</Link>
          {" / "}
          <span style={{ color:"#111827", fontWeight:600 }}>{tpl.name}</span>
        </span>
        <div style={{ flex:1 }}/>
        <span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:"4px 12px",
          color:sc.color, background:sc.bg, border:`1px solid ${sc.border}` }}>
          {tpl.status === "Active" ? "✦ Active" : tpl.status}
        </span>
        <button onClick={() => router.push(`/report-template/${tpl.id}`)}
          style={{ padding:"7px 16px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <i className="ri-pencil-line" style={{ fontSize:13 }}/>Edit Template
        </button>
        <button
          style={{ padding:"7px 16px", borderRadius:8, border:"none", background:"#111827", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <i className="ri-file-chart-line" style={{ fontSize:13 }}/>Generate Report
        </button>
      </div>

      <div style={{ maxWidth:1040, margin:"0 auto", padding:"28px" }}>

        {/* ── Template identity card ── */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", marginBottom:20, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ height:4, background:tpl.bankColor }}/>
          <div style={{ padding:"24px 28px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:18 }}>
              <div style={{ width:56, height:56, borderRadius:14, background:tpl.bankColor, color:"#fff", fontSize:13, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, letterSpacing:"0.03em" }}>
                {tpl.bankCode}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" as const }}>
                  <div>
                    <h1 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 4px" }}>{tpl.name}</h1>
                    <div style={{ display:"flex", gap:10, fontSize:12, color:"#9ca3af", flexWrap:"wrap" as const }}>
                      <span>{tpl.bank}</span>
                      <span>·</span>
                      <span style={{ fontWeight:600, color:"#374151" }}>{tpl.id}</span>
                      <span>·</span>
                      <span>{tpl.version}</span>
                      <span>·</span>
                      <span>Created {tpl.createdOn}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize:13, color:"#6b7280", margin:"12px 0", lineHeight:1.6 }}>{tpl.description}</p>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:tpl.bankColor, display:"inline-block", flexShrink:0 }}/>
                  <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{tpl.circle}</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:20 }}>
              {[
                { icon:"ri-layout-3-line",     val:tpl.blocksCount,    label:"Report Blocks",     color:"#2563eb", bg:"#eff6ff" },
                { icon:"ri-questionnaire-line", val:tpl.questionsCount, label:"Audit Questions",   color:"#7c3aed", bg:"#f5f3ff" },
                { icon:"ri-file-chart-line",    val:tpl.timesUsed,      label:"Reports Generated", color:"#16a34a", bg:"#f0fdf4" },
                { icon:"ri-eye-line",           val:visibleBlocks,       label:"Visible Blocks",    color:"#0891b2", bg:"#ecfeff" },
              ].map(s => (
                <div key={s.label} style={{ background:s.bg, borderRadius:10, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className={s.icon} style={{ fontSize:16, color:s.color }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:10, color:"#6b7280", fontWeight:600 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:16 }}>
              {tpl.tags.map(tag => (
                <span key={tag} style={{ fontSize:11, fontWeight:600, color:"#475569", background:"#f1f5f9", borderRadius:6, padding:"3px 10px" }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Report page order preview strip ── */}
        <div style={{ background:"#fff", borderRadius:10, border:"1px solid #e5e7eb", padding:"12px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" as const }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#374151", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
            <i className="ri-file-pdf-line" style={{ color:"#dc2626", fontSize:14 }}/>Report Page Order
          </span>
          {blocks.filter(b=>b.visible).map((b,i) => (
            <span key={b.id} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:b.color, background:b.bg, borderRadius:7, padding:"3px 10px", border:`1px solid ${b.color}22` }}>
              <span style={{ fontSize:9, fontWeight:800, opacity:0.5 }}>P{i+1}</span>{b.title}
            </span>
          ))}
        </div>

        {/* ── Blocks list ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {blocks.map((block, idx) => {
            const tc  = TYPE_COLORS[block.type];
            const isX = expanded[block.id];
            return (
              <div key={block.id} style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)", opacity:block.visible?1:0.55 }}>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"center", borderLeft:`4px solid ${block.visible?block.color:"#d1d5db"}` }}>
                  <div style={{ width:48, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px 0", flexShrink:0 }}>
                    <span style={{ width:24, height:24, borderRadius:6, background:block.visible?block.bg:"#f3f4f6", color:block.visible?block.color:"#9ca3af", fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{idx+1}</span>
                  </div>
                  <div style={{ width:40, height:40, borderRadius:10, background:block.visible?block.bg:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:14 }}>
                    <i className={block.icon} style={{ fontSize:17, color:block.visible?block.color:"#9ca3af" }}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" as const }}>
                      <span style={{ fontSize:13, fontWeight:700, color:block.visible?"#111827":"#9ca3af" }}>{block.title}</span>
                      <span style={{ fontSize:10, fontWeight:700, borderRadius:20, padding:"2px 8px", color:tc.color, background:tc.bg }}>{TYPE_LABELS[block.type]}</span>
                      {!block.visible && <span style={{ fontSize:10, fontWeight:700, color:"#9ca3af", background:"#f3f4f6", borderRadius:20, padding:"2px 8px" }}>Hidden</span>}
                    </div>
                    <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>{block.subtitle}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, paddingRight:16, flexShrink:0 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:20, padding:"3px 10px" }}>
                      {block.items.filter(i=>i.visible).length}/{block.items.length} items
                    </span>
                    <button onClick={() => toggle(block.id)}
                      style={{ width:28, height:28, border:"none", background:"transparent", cursor:"pointer", color:"#9ca3af", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <i className={isX?"ri-arrow-up-s-line":"ri-arrow-down-s-line"} style={{ fontSize:17 }}/>
                    </button>
                  </div>
                </div>

                {/* Items */}
                {isX && (
                  <div style={{ borderTop:"1px solid #f3f4f6" }}>
                    {block.items.map((item, iIdx) => (
                      <div key={item.id} style={{ display:"flex", alignItems:"center", borderBottom:iIdx<block.items.length-1?"1px solid #f9fafb":"none", opacity:item.visible?1:0.4 }}>
                        <div style={{ width:66, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:14 }}>
                          <span style={{ fontSize:11, color:"#d1d5db", fontWeight:600, fontFamily:"monospace" }}>{String(iIdx+1).padStart(2,"0")}</span>
                        </div>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:item.visible?block.color:"#d1d5db", flexShrink:0, marginRight:12 }}/>
                        <span style={{ flex:1, fontSize:13, color:item.visible?"#374151":"#9ca3af", padding:"10px 0" }}>{item.label}</span>
                        <span style={{ paddingRight:16, flexShrink:0 }}>
                          <i className={item.visible?"ri-eye-line":"ri-eye-off-line"}
                            style={{ fontSize:13, color:item.visible?"#16a34a":"#d1d5db" }}/>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom action bar */}
        <div style={{ marginTop:24, background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:13, color:"#6b7280" }}>
            <strong style={{ color:"#111827" }}>{visibleBlocks}</strong> blocks · <strong style={{ color:"#111827" }}>{blocks.reduce((s,b)=>s+b.items.filter(i=>i.visible).length,0)}</strong> items visible in report
          </span>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => router.push("/report-template")}
              style={{ padding:"8px 18px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, fontSize:13, cursor:"pointer" }}>
              Back to List
            </button>
            <button onClick={() => router.push(`/report-template/${tpl.id}`)}
              style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"#2563eb", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
              <i className="ri-pencil-line"/>Edit Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
