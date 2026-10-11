"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// ── Seed ──────────────────────────────────────────────────────────────────────
interface ReportTemplate {
  id:string; bank:string; bankCode:string; bankColor:string;
  name:string; description:string; status:"Active"|"Draft"|"Archived";
  version:string; circle:string;
  blocksCount:number; questionsCount:number; timesUsed:number; createdOn:string; tags:string[];
}
const SEED: ReportTemplate[] = [
  { id:"RT-001", bank:"State Bank of India", bankCode:"SBI",  bankColor:"#1a3c8f", name:"SBI Standard Branch Report",         description:"Full 14-page electrical safety audit report for SBI urban and metro branches covering all annexures, load sheet and photo sections.", status:"Active",   version:"v2.1", circle:"LHO-GAN — Gandhinagar",   blocksCount:11, questionsCount:33, timesUsed:42, createdOn:"15 Jan 2024", tags:["Cover Page","Annexure I–III","Load Sheet","Photos"] },
  { id:"RT-006", bank:"State Bank of India", bankCode:"SBI",  bankColor:"#1a3c8f", name:"SBI Rural Branch Lite Report",       description:"Simplified report template for SBI rural branches — excludes Annexure III (ATM) and condenses load sheet.",                          status:"Draft",    version:"v1.0", circle:"LHO-JAI — Jaipur",        blocksCount:8,  questionsCount:22, timesUsed:0,  createdOn:"01 Nov 2023", tags:["Cover Page","Annexure I–II","Load Sheet"] },
  { id:"RT-002", bank:"Bank of Baroda",      bankCode:"BOB",  bankColor:"#d97706", name:"BOB Branch Infrastructure Report",   description:"Tailored report for Bank of Baroda branch infrastructure audits. Includes DG, UPS, and electrical parameter sections.",              status:"Active",   version:"v1.5", circle:"ZO-AHM — Ahmedabad",       blocksCount:11, questionsCount:29, timesUsed:18, createdOn:"10 Mar 2024", tags:["Cover Page","Annexure I–II","UPS","DG Set"] },
  { id:"RT-003", bank:"UCO Bank",            bankCode:"UCO",  bankColor:"#0f766e", name:"UCO Bank East Circle Report",        description:"Standard report template for UCO Bank eastern circle branches with regional compliance additions.",                                 status:"Active",   version:"v1.1", circle:"ZO-KOL — Kolkata",         blocksCount:10, questionsCount:27, timesUsed:9,  createdOn:"22 May 2024", tags:["Cover Page","Annexure I–III","Load Sheet"] },
  { id:"RT-004", bank:"Canara Bank",         bankCode:"CNRB", bankColor:"#15803d", name:"Canara Bank Standard Audit Report", description:"Canara Bank standard report with full annexure suite and photographic evidence sections.",                                          status:"Archived", version:"v1.0", circle:"ZO-BAN — Bangalore",       blocksCount:9,  questionsCount:24, timesUsed:6,  createdOn:"05 Aug 2023", tags:["Cover Page","Annexure I–II","Photos"] },
];

// ── Banks + circles ───────────────────────────────────────────────────────────
const BANKS = [
  { code:"SBI",  name:"State Bank of India",  color:"#1a3c8f", abbr:"SBI"  },
  { code:"BOB",  name:"Bank of Baroda",       color:"#d97706", abbr:"BOB"  },
  { code:"UCO",  name:"UCO Bank",             color:"#0f766e", abbr:"UCO"  },
  { code:"PNB",  name:"Punjab National Bank", color:"#7c3aed", abbr:"PNB"  },
  { code:"CNRB", name:"Canara Bank",          color:"#15803d", abbr:"CNRB" },
  { code:"IB",   name:"Indian Bank",          color:"#be123c", abbr:"IB"   },
];

interface CircleEntry { code:string; name:string }
const BANK_CIRCLES: Record<string, CircleEntry[]> = {
  SBI:  [{code:"LHO-AMR",name:"Amravati"},{code:"LHO-BHO",name:"Bhopal"},{code:"LHO-BAN",name:"Bangalore"},{code:"LHO-BHU",name:"Bhubaneswar"},{code:"LHO-BOM",name:"Mumbai"},{code:"LHO-CHD",name:"Chandigarh"},{code:"LHO-CHE",name:"Chennai"},{code:"LHO-DEL",name:"Delhi"},{code:"LHO-GAN",name:"Gandhinagar"},{code:"LHO-HYD",name:"Hyderabad"},{code:"LHO-JAI",name:"Jaipur"},{code:"LHO-KOL",name:"Kolkata"},{code:"LHO-LUC",name:"Lucknow"},{code:"LHO-PAT",name:"Patna"},{code:"LHO-THI",name:"Thiruvananthapuram"}],
  BOB:  [{code:"ZO-AHM",name:"Ahmedabad"},{code:"ZO-BAN",name:"Bangalore"},{code:"ZO-BHO",name:"Bhopal"},{code:"ZO-CHE",name:"Chennai"},{code:"ZO-DEL",name:"Delhi"},{code:"ZO-HYD",name:"Hyderabad"},{code:"ZO-KOL",name:"Kolkata"},{code:"ZO-LUC",name:"Lucknow"},{code:"ZO-MUM",name:"Mumbai"},{code:"ZO-PAT",name:"Patna"}],
  UCO:  [{code:"ZO-CHE",name:"Chennai"},{code:"ZO-DEL",name:"Delhi"},{code:"ZO-KOL",name:"Kolkata"},{code:"ZO-MUM",name:"Mumbai"},{code:"ZO-BAN",name:"Bangalore"},{code:"ZO-HYD",name:"Hyderabad"}],
  PNB:  [{code:"ZO-AMR",name:"Amritsar"},{code:"ZO-BAN",name:"Bangalore"},{code:"ZO-CHD",name:"Chandigarh"},{code:"ZO-CHE",name:"Chennai"},{code:"ZO-DEL",name:"Delhi"},{code:"ZO-HYD",name:"Hyderabad"},{code:"ZO-JAI",name:"Jaipur"},{code:"ZO-KOL",name:"Kolkata"},{code:"ZO-LUC",name:"Lucknow"},{code:"ZO-MUM",name:"Mumbai"},{code:"ZO-PAT",name:"Patna"}],
  CNRB: [{code:"ZO-BAN",name:"Bangalore"},{code:"ZO-CHE",name:"Chennai"},{code:"ZO-DEL",name:"Delhi"},{code:"ZO-HYD",name:"Hyderabad"},{code:"ZO-KOL",name:"Kolkata"},{code:"ZO-MUM",name:"Mumbai"},{code:"ZO-MYS",name:"Mysuru"}],
  IB:   [{code:"ZO-CHE",name:"Chennai"},{code:"ZO-COI",name:"Coimbatore"},{code:"ZO-DEL",name:"Delhi"},{code:"ZO-MUM",name:"Mumbai"},{code:"ZO-TRI",name:"Tiruchirapalli"},{code:"ZO-MDU",name:"Madurai"}],
};

// ── Blocks ────────────────────────────────────────────────────────────────────
interface BlockItem  { id:string; label:string; visible:boolean }
interface ReportBlock { id:string; title:string; subtitle:string; icon:string; color:string; bg:string; type:"fixed"|"questions"|"images"|"table"; visible:boolean; expanded:boolean; items:BlockItem[] }

const INITIAL_BLOCKS: ReportBlock[] = [
  { id:"cover",      title:"Cover Page",                          subtitle:"Branch identity, FY, audit date, company branding",                       icon:"ri-file-shield-2-line", color:"#2563eb", bg:"#eff6ff", type:"fixed",     visible:true, expanded:false, items:[{id:"c1",label:"Bank Name",visible:true},{id:"c2",label:"Branch Name",visible:true},{id:"c3",label:"Branch Code",visible:true},{id:"c4",label:"Branch Address",visible:true},{id:"c5",label:"Financial Year",visible:true},{id:"c6",label:"Audit Date",visible:true},{id:"c7",label:"Auditor Name",visible:true},{id:"c8",label:"RBO",visible:true},{id:"c9",label:"AO (Area Office)",visible:true},{id:"c10",label:"LHO (Local Head Office)",visible:true},{id:"c11",label:"Company Logo & Address",visible:true}] },
  { id:"annexure1",  title:"Annexure I — Electrical Safety Audit",subtitle:"Branch metadata: load, area, controllers, UPS & DG details",              icon:"ri-file-list-2-line",   color:"#0891b2", bg:"#ecfeff", type:"fixed",     visible:true, expanded:false, items:[{id:"a1",label:"Branch Code / Name",visible:true},{id:"a2",label:"Address",visible:true},{id:"a3",label:"BM's PF No., Name and Contact",visible:true},{id:"a4",label:"Sanctioned Load (KW/KVA)",visible:true},{id:"a5",label:"Connected Load (KW/KVA)",visible:true},{id:"a6",label:"Monthly Energy Bill Amount",visible:true},{id:"a7",label:"Tonnage of Air-Conditioners (TR)",visible:true},{id:"a8",label:"Area of Branch / Office (Sq. Ft.)",visible:true},{id:"a9",label:"UPS Details",visible:true},{id:"a10",label:"Generator Details",visible:true}] },
  { id:"annexure2",  title:"Annexure II — Audit Questions",       subtitle:"Main compliance checklist: Yes/No and Observations/Remarks",               icon:"ri-questionnaire-line", color:"#7c3aed", bg:"#f5f3ff", type:"questions", visible:true, expanded:false, items:[{id:"q1",label:"MCCBs/MCBs/ELCBs with proper rating",visible:true},{id:"q2",label:"Light & emergency light in electrical rooms",visible:true},{id:"q3",label:"Pump/DG/UPS rooms maintained dry and clean",visible:true},{id:"q4",label:"Water seepage near electrical panels",visible:true},{id:"q5",label:"Earthing pits properly maintained",visible:true},{id:"q6",label:"Preventive maintenance by licensed electrician",visible:true},{id:"q7",label:"PF panel of appropriate rating installed",visible:true},{id:"q8",label:"Fire Protection / Fire Extinguishers",visible:true},{id:"q9",label:"DG set recorded in equipment details",visible:true},{id:"q10",label:"Load distributed in all 3 phases",visible:true}] },
  { id:"annexure3",  title:"Annexure III — Onsite ATM",           subtitle:"ATM-specific electrical and safety compliance questions",                   icon:"ri-bank-card-line",     color:"#0369a1", bg:"#f0f9ff", type:"questions", visible:true, expanded:false, items:[{id:"atm1",label:"Fire detector connected to branch AFDS",visible:true},{id:"atm2",label:"MCCB/MCB/ELCB provided and in working condition",visible:true},{id:"atm3",label:"AC units provided with timer circuit device",visible:true},{id:"atm4",label:"Main supply switch/MCB marked for ATM cutoff",visible:true},{id:"atm5",label:"No cooking stove / heater coil in ATM",visible:true}] },
  { id:"ups",        title:"UPS Details",                         subtitle:"UPS/Inverter table, battery specs and live parameter readings",              icon:"ri-battery-charge-line",color:"#15803d", bg:"#f0fdf4", type:"table",     visible:true, expanded:false, items:[{id:"ups1",label:"UPS / Inverter Capacity Table",visible:true},{id:"ups2",label:"UPS Parameters (Voltage, Current, Frequency)",visible:true}] },
  { id:"meter",      title:"Meter Details & Electrical Parameters",subtitle:"Meter info, voltage readings, current readings and power factor",          icon:"ri-dashboard-3-line",   color:"#b45309", bg:"#fffbeb", type:"table",     visible:true, expanded:false, items:[{id:"m1",label:"Meter Details",visible:true},{id:"m2",label:"Voltage Readings",visible:true},{id:"m3",label:"Current Readings",visible:true},{id:"m4",label:"Power Factor (PF)",visible:true}] },
  { id:"dg",         title:"DG Set Details",                      subtitle:"Diesel generator specifications, observations and safety standards",         icon:"ri-plug-line",          color:"#6b21a8", bg:"#faf5ff", type:"table",     visible:true, expanded:false, items:[{id:"dg1",label:"DG Set — Hired or Owned",visible:true},{id:"dg2",label:"DG Set Capacity (KVA)",visible:true},{id:"dg3",label:"DG Set Make (OEM)",visible:true},{id:"dg4",label:"Acoustic Enclosure Provided",visible:true}] },
  { id:"loadsheet",  title:"Branch Load Sheet",                   subtitle:"Equipment-wise load calculation grouped by category",                       icon:"ri-table-2",            color:"#0f766e", bg:"#f0fdfa", type:"table",     visible:true, expanded:false, items:[{id:"ls1",label:"Lighting Load",visible:true},{id:"ls2",label:"Fan Load",visible:true},{id:"ls3",label:"UPS Load",visible:true},{id:"ls4",label:"Air Conditioning Load",visible:true},{id:"ls5",label:"Power Load",visible:true},{id:"ls6",label:"Total Connected Load Summary",visible:true}] },
  { id:"photos",     title:"Photographic Overview",               subtitle:"Audit observations with risk classification and photo evidence",             icon:"ri-camera-lens-line",   color:"#be123c", bg:"#fff1f2", type:"images",    visible:true, expanded:false, items:[{id:"po1",label:"LOW RISK — Observations & Photographs",visible:true},{id:"po2",label:"MEDIUM RISK — Observations & Photographs",visible:true},{id:"po3",label:"HIGH RISK — Observations & Photographs",visible:true},{id:"po4",label:"Signatures",visible:true}] },
  { id:"ebill",      title:"Electricity Bill Image",              subtitle:"Scanned copy of latest electricity bill submitted at branch",               icon:"ri-receipt-line",       color:"#ca8a04", bg:"#fefce8", type:"images",    visible:true, expanded:false, items:[{id:"eb1",label:"Electricity Bill Scan / Photo",visible:true}] },
  { id:"samplepics", title:"Sample Images",                       subtitle:"Location-wise photographs captured during the audit visit",                  icon:"ri-image-2-line",       color:"#475569", bg:"#f8fafc", type:"images",    visible:true, expanded:false, items:[{id:"si1",label:"Branch Front Photo",visible:true},{id:"si2",label:"UPS Room Photo",visible:true},{id:"si3",label:"Main Panel Photo",visible:true},{id:"si4",label:"Fire Extinguishers Photo",visible:true}] },
];

const TYPE_LABELS: Record<ReportBlock["type"],string> = { fixed:"Fields", questions:"Questions", images:"Images", table:"Table" };
const TYPE_COLORS: Record<ReportBlock["type"],{bg:string;color:string}> = {
  fixed:     { bg:"#dbeafe", color:"#1d4ed8" },
  questions: { bg:"#ede9fe", color:"#7c3aed" },
  images:    { bg:"#fce7f3", color:"#be185d" },
  table:     { bg:"#d1fae5", color:"#065f46" },
};

// helper: parse "CODE — Name" → CircleEntry
function parseCircle(raw: string): CircleEntry {
  const [code, ...rest] = raw.split(" — ");
  return { code: code.trim(), name: rest.join(" — ").trim() };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function EditReportTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const tpl = SEED.find(s => s.id === id) ?? SEED[0];

  // Pre-derive bank code
  const initBankCode = BANKS.find(b => b.name === tpl.bank)?.code ?? tpl.bankCode;
  const initCircle   = parseCircle(tpl.circle);

  const [step,           setStep]           = useState<1|2>(1);
  const [selectedBank,   setSelectedBank]   = useState(initBankCode);
  const [selectedCircle, setSelectedCircle] = useState<CircleEntry|null>(initCircle);
  const [circleSearch,   setCircleSearch]   = useState("");
  const [circleOpen,     setCircleOpen]     = useState(false);
  const [name,           setName]           = useState(tpl.name);
  const [description,    setDescription]    = useState(tpl.description);
  const [saveAs,         setSaveAs]         = useState<"Draft"|"Active">(tpl.status === "Archived" ? "Draft" : tpl.status as "Draft"|"Active");
  const [blocks,         setBlocks]         = useState<ReportBlock[]>(INITIAL_BLOCKS);
  const [toast,          setToast]          = useState<string|null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const bankObj    = BANKS.find(b => b.code === selectedBank);
  const circleList = BANK_CIRCLES[selectedBank] ?? [];
  const filteredCircles = circleList.filter(c =>
    c.name.toLowerCase().includes(circleSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(circleSearch.toLowerCase())
  );
  const step1Valid = !!selectedBank && !!selectedCircle && name.trim().length > 0;

  const handleBankSelect = (code: string) => {
    setSelectedBank(code);
    setSelectedCircle(null);
    setCircleSearch("");
    setCircleOpen(true);
  };

  // Block ops
  const moveBlock = useCallback((idx: number, dir: -1|1) => {
    const to = idx + dir;
    if (to < 0 || to >= blocks.length) return;
    setBlocks(prev => { const n=[...prev]; [n[idx],n[to]]=[n[to],n[idx]]; return n; });
    showToast(`Moved block ${dir===-1?"up":"down"}`);
  }, [blocks]);

  const toggleBlockVis = (id: string) => setBlocks(prev => prev.map(b => b.id===id ? {...b,visible:!b.visible} : b));
  const toggleExpanded = (id: string) => setBlocks(prev => prev.map(b => b.id===id ? {...b,expanded:!b.expanded} : b));

  const moveItem = useCallback((bId: string, iIdx: number, dir: -1|1) => {
    setBlocks(prev => prev.map(b => {
      if (b.id!==bId) return b;
      const items=[...b.items]; const to=iIdx+dir;
      if (to<0||to>=items.length) return b;
      [items[iIdx],items[to]]=[items[to],items[iIdx]];
      return {...b,items};
    }));
  }, []);

  const toggleItemVis = (bId: string, iId: string) =>
    setBlocks(prev => prev.map(b => b.id!==bId ? b : {...b, items:b.items.map(it => it.id===iId ? {...it,visible:!it.visible} : it)}));

  const visibleBlocks = blocks.filter(b=>b.visible).length;

  // ── Drag state ──
  const [dragBlockIdx, setDragBlockIdx] = useState<number|null>(null);
  const [dragOverIdx,  setDragOverIdx]  = useState<number|null>(null);
  const [dragItemKey,  setDragItemKey]  = useState<string|null>(null);
  const [dragItemOver, setDragItemOver] = useState<string|null>(null);

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
          <Link href={`/report-template/${tpl.id}/view`} style={{ color:"#9ca3af", textDecoration:"none" }}>{tpl.name}</Link>
          {" / "}
          <span style={{ color:"#111827", fontWeight:600 }}>Edit</span>
        </span>

        {/* Step indicator */}
        <div style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"center", gap:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, background:step===1?"#2563eb":"#16a34a", color:"#fff" }}>
              {step===1 ? "1" : <i className="ri-check-line" style={{ fontSize:14 }}/>}
            </div>
            <span style={{ fontSize:13, fontWeight:700, color:step===1?"#2563eb":"#16a34a" }}>Template Details</span>
          </div>
          <div style={{ width:80, height:2, background:step===2?"#2563eb":"#e5e7eb", margin:"0 12px", transition:"background 0.3s" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, background:step===2?"#2563eb":"#e5e7eb", color:step===2?"#fff":"#9ca3af" }}>2</div>
            <span style={{ fontSize:13, fontWeight:700, color:step===2?"#2563eb":"#9ca3af" }}>Configure Report Blocks</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Link href={`/report-template/${tpl.id}/view`}
            style={{ padding:"7px 16px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, fontSize:13, textDecoration:"none", display:"flex", alignItems:"center", gap:5 }}>
            <i className="ri-eye-line" style={{ fontSize:13 }}/>View
          </Link>
          {step===2 && (
            <>
              <button onClick={() => setStep(1)}
                style={{ padding:"7px 16px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                <i className="ri-arrow-left-line"/>Back
              </button>
              <button onClick={() => { showToast("Template updated!"); setTimeout(() => router.push(`/report-template/${tpl.id}/view`), 1400); }}
                style={{ padding:"7px 20px", borderRadius:8, border:"none", background:"#16a34a", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                <i className="ri-save-line"/>Update Template
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Edit banner ── */}
      <div style={{ background:"#fffbeb", borderBottom:"1px solid #fcd34d", padding:"10px 28px", display:"flex", alignItems:"center", gap:10 }}>
        <i className="ri-edit-box-line" style={{ fontSize:14, color:"#d97706", flexShrink:0 }}/>
        <span style={{ fontSize:12, color:"#92400e", fontWeight:600 }}>
          Editing <strong>{tpl.name}</strong> — {tpl.id} · {tpl.version}
        </span>
        <span style={{ marginLeft:"auto", fontSize:12, color:"#b45309" }}>Changes apply to future reports only</span>
      </div>

      {/* ── Step 1 ── */}
      {step===1 && (
        <div style={{ maxWidth:900, margin:"0 auto", padding:"36px 28px" }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 4px" }}>Edit Template Details</h2>
          <p style={{ fontSize:13, color:"#6b7280", margin:"0 0 28px" }}>Update the bank, circle and template metadata, then configure blocks in the next step.</p>

          {/* Select Bank */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"24px 28px", marginBottom:20 }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:4 }}>Select Bank <span style={{ color:"#dc2626" }}>*</span></div>
            <div style={{ fontSize:12, color:"#9ca3af", marginBottom:18 }}>Choose the bank this report template is designed for</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {BANKS.map(b => {
                const sel = selectedBank === b.code;
                return (
                  <button key={b.code} onClick={() => handleBankSelect(b.code)}
                    style={{ padding:"18px 20px", borderRadius:10, border:sel?`2px solid ${b.color}`:"1.5px solid #e5e7eb", background:sel?`${b.color}0d`:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:14, transition:"all 0.15s", textAlign:"left" as const }}>
                    <div style={{ width:44, height:44, borderRadius:10, background:b.color, color:"#fff", fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{b.abbr}</div>
                    <span style={{ fontSize:14, fontWeight:700, color:sel?b.color:"#374151" }}>{b.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mapped Circle */}
          {selectedBank && (
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"24px 28px", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className="ri-building-4-line" style={{ fontSize:17, color:"#2563eb" }}/>
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:"#111827" }}>Mapped Circle <span style={{ color:"#dc2626" }}>*</span></div>
                  <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>Local Head Office (LHO) / Zonal Office (ZO) / Field General Manager&apos;s Office (FGMO)</div>
                </div>
              </div>
              {selectedCircle && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, background:bankObj?`${bankObj.color}10`:"#f0fdf4", border:`1px solid ${bankObj?`${bankObj.color}30`:"#bbf7d0"}`, borderRadius:8, padding:"7px 12px" }}>
                    <i className="ri-checkbox-circle-fill" style={{ fontSize:14, color:bankObj?.color??"#16a34a" }}/>
                    <span style={{ fontSize:13, fontWeight:700, color:bankObj?.color??"#15803d" }}>{selectedCircle.code}</span>
                    <span style={{ fontSize:13, color:"#374151" }}>— {selectedCircle.name}</span>
                    <button onClick={() => { setSelectedCircle(null); setCircleOpen(true); setCircleSearch(""); }}
                      style={{ marginLeft:4, border:"none", background:"transparent", cursor:"pointer", color:"#9ca3af", padding:0, display:"flex", alignItems:"center" }}>
                      <i className="ri-close-line" style={{ fontSize:15 }}/>
                    </button>
                  </div>
                </div>
              )}
              {(!selectedCircle || circleOpen) && (
                <div style={{ position:"relative" as const }}>
                  <div style={{ display:"flex", alignItems:"center", border:"1.5px solid #2563eb", borderRadius:8, overflow:"hidden", background:"#fff" }}>
                    <i className="ri-search-line" style={{ fontSize:14, color:"#9ca3af", padding:"0 12px", flexShrink:0 }}/>
                    <input autoFocus value={circleSearch} onChange={e => { setCircleSearch(e.target.value); setCircleOpen(true); }} onFocus={() => setCircleOpen(true)}
                      placeholder="Search or select a circle..."
                      style={{ flex:1, padding:"10px 0", border:"none", outline:"none", fontSize:13, color:"#374151" }}/>
                    <i className="ri-search-2-line" style={{ fontSize:14, color:"#2563eb", padding:"0 12px", flexShrink:0 }}/>
                  </div>
                  {circleOpen && (
                    <div style={{ position:"absolute" as const, top:"calc(100% + 4px)", left:0, right:0, background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", zIndex:50, overflow:"hidden" }}>
                      <div style={{ padding:"8px 14px 6px", fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase" as const, letterSpacing:"0.07em", borderBottom:"1px solid #f3f4f6", background:"#fafafa" }}>
                        Local Head Office (LHO) / Zonal Office (ZO) / FGMO
                      </div>
                      <div style={{ maxHeight:220, overflowY:"auto" as const }}>
                        {filteredCircles.length===0
                          ? <div style={{ padding:"16px 14px", fontSize:13, color:"#9ca3af", textAlign:"center" as const }}>No circles found</div>
                          : filteredCircles.map(c => (
                              <button key={c.code} onClick={() => { setSelectedCircle(c); setCircleOpen(false); setCircleSearch(""); }}
                                style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", border:"none", background:"transparent", cursor:"pointer", textAlign:"left" as const, borderBottom:"1px solid #f9fafb" }}
                                onMouseEnter={e => (e.currentTarget.style.background="#f0f9ff")}
                                onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
                                <span style={{ fontSize:12, fontWeight:700, color:"#2563eb", fontFamily:"monospace", minWidth:80 }}>{c.code}</span>
                                <span style={{ fontSize:13, color:"#374151" }}>— {c.name}</span>
                              </button>
                            ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Template Details */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"24px 28px", marginBottom:20 }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:4 }}>Template Details</div>
            <div style={{ fontSize:12, color:"#9ca3af", marginBottom:18 }}>Update the template name and description</div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"#6b7280", display:"block", marginBottom:6, textTransform:"uppercase" as const, letterSpacing:"0.05em" }}>
                REPORT TEMPLATE NAME <span style={{ color:"#dc2626" }}>*</span>
              </label>
              <input value={name} onChange={e => setName(e.target.value)}
                style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:13, color:"#374151", outline:"none", boxSizing:"border-box" as const }}/>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#6b7280", display:"block", marginBottom:6, textTransform:"uppercase" as const, letterSpacing:"0.05em" }}>DESCRIPTION</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:13, color:"#374151", outline:"none", resize:"vertical", boxSizing:"border-box" as const }}/>
            </div>
          </div>

          {/* Save as */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"24px 28px" }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:4 }}>Status</div>
            <div style={{ fontSize:12, color:"#9ca3af", marginBottom:18 }}>Draft templates are not available for audit report generation until activated</div>
            <div style={{ display:"flex", gap:12 }}>
              {(["Draft","Active"] as const).map(s => {
                const sel = saveAs===s;
                const col = s==="Active" ? "#16a34a" : "#2563eb";
                return (
                  <button key={s} onClick={() => setSaveAs(s)}
                    style={{ flex:1, padding:"14px 20px", borderRadius:10, border:sel?`2px solid ${col}`:"1.5px solid #e5e7eb", background:sel?`${col}0d`:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:12, transition:"all 0.15s" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${sel?col:"#d1d5db"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {sel && <div style={{ width:10, height:10, borderRadius:"50%", background:col }}/>}
                    </div>
                    <div style={{ textAlign:"left" as const }}>
                      <div style={{ fontSize:13, fontWeight:700, color:sel?col:"#374151" }}>{s}</div>
                      <div style={{ fontSize:11, color:"#9ca3af" }}>{s==="Draft" ? "Save and configure later" : "Ready for report generation"}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Bottom navigation ── */}
          <div style={{ marginTop:28, paddingBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <Link href={`/report-template/${tpl.id}/view`}
              style={{ padding:"10px 22px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, fontSize:13, textDecoration:"none" }}>
              Cancel
            </Link>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
              {!step1Valid && (
                <span style={{ fontSize:11, color:"#9ca3af" }}>
                  {!selectedBank ? "Select a bank" : !selectedCircle ? "Select a circle" : "Enter template name"} to continue
                </span>
              )}
              <button onClick={() => { if (step1Valid) setStep(2); }} disabled={!step1Valid}
                style={{ padding:"11px 28px", borderRadius:8, border:"none", background:step1Valid?"#2563eb":"#e5e7eb", color:step1Valid?"#fff":"#9ca3af", fontWeight:700, fontSize:14, cursor:step1Valid?"pointer":"not-allowed", display:"flex", alignItems:"center", gap:8, transition:"background 0.15s" }}>
                Continue to Block Configuration
                <i className="ri-arrow-right-line" style={{ fontSize:16 }}/>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Block Builder ── */}
      {step===2 && (
        <div style={{ padding:"28px" }}>
          {/* Context strip */}
          {bankObj && (
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:bankObj.color, color:"#fff", fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{bankObj.abbr}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{name}</div>
                <div style={{ fontSize:12, color:"#9ca3af", display:"flex", gap:8, marginTop:2, flexWrap:"wrap" as const }}>
                  <span>{bankObj.name}</span>
                  {selectedCircle && <><span>·</span><span style={{ color:"#374151", fontWeight:600 }}>{selectedCircle.code} — {selectedCircle.name}</span></>}
                  <span>·</span>
                  <span style={{ color:saveAs==="Active"?"#16a34a":"#2563eb", fontWeight:600 }}>{saveAs}</span>
                </div>
              </div>
              <button onClick={() => setStep(1)}
                style={{ marginLeft:"auto", padding:"5px 14px", borderRadius:7, border:"1px solid #e5e7eb", background:"#f9fafb", color:"#374151", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                <i className="ri-edit-line" style={{ fontSize:12 }}/>Edit Details
              </button>
            </div>
          )}

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
            {[
              { label:"Total Blocks",     value:blocks.length,                                                                                              icon:"ri-layout-3-line",     color:"#2563eb", bg:"#eff6ff" },
              { label:"Visible in Report",value:visibleBlocks,                                                                                             icon:"ri-eye-line",          color:"#16a34a", bg:"#f0fdf4" },
              { label:"Hidden",           value:blocks.length-visibleBlocks,                                                                               icon:"ri-eye-off-line",      color:"#9ca3af", bg:"#f9fafb" },
              { label:"Active Questions", value:blocks.filter(b=>b.type==="questions").reduce((s,b)=>s+b.items.filter(i=>i.visible).length,0),             icon:"ri-questionnaire-line", color:"#7c3aed", bg:"#f5f3ff" },
            ].map(s => (
              <div key={s.label} style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={s.icon} style={{ fontSize:16, color:s.color }}/>
                </div>
                <div>
                  <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:10, color:"#9ca3af", fontWeight:600 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Block list — drag & drop */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {blocks.map((block, idx) => {
              const tc         = TYPE_COLORS[block.type];
              const visItems   = block.items.filter(i=>i.visible).length;
              const isDragging = dragBlockIdx === idx;
              const isOver     = dragOverIdx  === idx && dragBlockIdx !== idx;
              return (
                <div key={block.id}
                  onDragOver={e => { e.preventDefault(); if(dragOverIdx!==idx) setDragOverIdx(idx); }}
                  onDrop={e => {
                    e.preventDefault();
                    if(dragBlockIdx===null||dragBlockIdx===idx){setDragOverIdx(null);return;}
                    setBlocks(prev=>{ const n=[...prev];const[rem]=n.splice(dragBlockIdx,1);n.splice(idx,0,rem);return n; });
                    setDragBlockIdx(null); setDragOverIdx(null);
                  }}
                  style={{ background:"#fff", borderRadius:12, border:isOver?"2px dashed #2563eb":"1px solid #e5e7eb", overflow:"hidden", boxShadow:isOver?"0 0 0 4px #dbeafe":"0 1px 3px rgba(0,0,0,0.05)", opacity:isDragging?0.3:block.visible?1:0.55, transition:"box-shadow 0.15s,border 0.1s,opacity 0.15s" }}>

                  <div style={{ display:"flex", alignItems:"center", borderLeft:`4px solid ${block.visible?block.color:"#d1d5db"}` }}>
                    {/* Grip — only handle initiates drag */}
                    <div
                      draggable
                      onDragStart={() => setDragBlockIdx(idx)}
                      onDragEnd={() => { setDragBlockIdx(null); setDragOverIdx(null); }}
                      style={{ cursor:"grab", padding:"0 10px 0 14px", color:"#c4c9d4", flexShrink:0, display:"flex", alignItems:"center" }}>
                      <i className="ri-draggable" style={{ fontSize:18 }}/>
                    </div>
                    <div style={{ width:32, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ width:24, height:24, borderRadius:6, background:block.visible?block.bg:"#f3f4f6", color:block.visible?block.color:"#9ca3af", fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{idx+1}</span>
                    </div>
                    <div style={{ width:40, height:40, borderRadius:10, background:block.visible?block.bg:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, margin:"14px 14px 14px 10px" }}>
                      <i className={block.icon} style={{ fontSize:18, color:block.visible?block.color:"#9ca3af" }}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" as const }}>
                        <span style={{ fontSize:13, fontWeight:700, color:block.visible?"#111827":"#9ca3af" }}>{block.title}</span>
                        <span style={{ fontSize:10, fontWeight:700, borderRadius:20, padding:"2px 8px", color:tc.color, background:tc.bg }}>{TYPE_LABELS[block.type]}</span>
                        {!block.visible && <span style={{ fontSize:10, fontWeight:700, color:"#9ca3af", background:"#f3f4f6", borderRadius:20, padding:"2px 8px" }}>Hidden</span>}
                      </div>
                      <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>{block.subtitle}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:20, padding:"3px 10px", marginRight:10, flexShrink:0 }}>
                      {visItems}/{block.items.length}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:4, paddingRight:14, flexShrink:0 }}>
                      <button onClick={()=>toggleBlockVis(block.id)} title={block.visible?"Hide block":"Show block"}
                        style={{ width:32, height:32, border:"none", background:block.visible?"#f0fdf4":"#f9fafb", cursor:"pointer", color:block.visible?"#16a34a":"#9ca3af", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <i className={block.visible?"ri-eye-line":"ri-eye-off-line"} style={{ fontSize:15 }}/>
                      </button>
                      <button onClick={()=>toggleExpanded(block.id)} title={block.expanded?"Collapse":"Expand items"}
                        style={{ width:32, height:32, border:"none", background:block.expanded?"#eff6ff":"#f9fafb", cursor:"pointer", color:block.expanded?"#2563eb":"#6b7280", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <i className={block.expanded?"ri-arrow-up-s-line":"ri-arrow-down-s-line"} style={{ fontSize:18 }}/>
                      </button>
                    </div>
                  </div>

                  {block.expanded && (
                    <div style={{ borderTop:"1px solid #f3f4f6" }}>
                      <div style={{ padding:"10px 16px", background:"#fafafa", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase" as const, letterSpacing:"0.06em", display:"flex", alignItems:"center", gap:5 }}>
                          <i className="ri-draggable" style={{ fontSize:12 }}/>Drag to reorder · {TYPE_LABELS[block.type]}
                        </span>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => setBlocks(prev=>prev.map(b=>b.id!==block.id?b:{...b,items:b.items.map(it=>({...it,visible:true}))}))}
                            style={{ fontSize:11, fontWeight:700, color:"#16a34a", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:6, padding:"3px 10px", cursor:"pointer" }}>Show all</button>
                          <button onClick={() => setBlocks(prev=>prev.map(b=>b.id!==block.id?b:{...b,items:b.items.map(it=>({...it,visible:false}))}))}
                            style={{ fontSize:11, fontWeight:700, color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:6, padding:"3px 10px", cursor:"pointer" }}>Hide all</button>
                        </div>
                      </div>
                      <div style={{ padding:"10px 12px", display:"flex", flexDirection:"column", gap:6 }}>
                        {block.items.map((item, iIdx) => {
                          const dKey       = `${block.id}__${iIdx}`;
                          const isItemDrag = dragItemKey  === dKey;
                          const isItemOver = dragItemOver === dKey && dragItemKey !== dKey;
                          return (
                            <div key={item.id}
                              onDragOver={e => { e.preventDefault(); e.stopPropagation(); if(dragItemOver!==dKey) setDragItemOver(dKey); }}
                              onDrop={e => {
                                e.preventDefault(); e.stopPropagation();
                                if(!dragItemKey||dragItemKey===dKey){setDragItemOver(null);return;}
                                const[fromBId,fromIdxStr]=dragItemKey.split("__");
                                if(fromBId!==block.id){setDragItemOver(null);return;}
                                const fromIdx=parseInt(fromIdxStr);
                                setBlocks(prev=>prev.map(b=>{
                                  if(b.id!==block.id)return b;
                                  const items=[...b.items];const[rem]=items.splice(fromIdx,1);items.splice(iIdx,0,rem);return{...b,items};
                                }));
                                setDragItemKey(null); setDragItemOver(null);
                              }}
                              style={{ display:"flex", alignItems:"center", background:isItemOver?"#eff6ff":item.visible?"#fff":"#fafafa", border:isItemOver?"1.5px dashed #2563eb":"1px solid #e8eaed", borderRadius:8, opacity:isItemDrag?0.3:item.visible?1:0.5, boxShadow:isItemOver?"0 0 0 3px #dbeafe":"0 1px 2px rgba(0,0,0,0.04)", transition:"all 0.1s", cursor:"default" }}>
                              {/* Grip — only handle initiates drag */}
                              <div
                                draggable
                                onDragStart={e => { e.stopPropagation(); setDragItemKey(dKey); }}
                                onDragEnd={e => { e.stopPropagation(); setDragItemKey(null); setDragItemOver(null); }}
                                style={{ cursor:"grab", padding:"12px 10px", color:"#c4c9d4", flexShrink:0 }}>
                                <i className="ri-draggable" style={{ fontSize:15 }}/>
                              </div>
                              <span style={{ fontSize:11, color:"#c4c9d4", fontWeight:700, fontFamily:"monospace", minWidth:24, flexShrink:0 }}>{String(iIdx+1).padStart(2,"0")}</span>
                              <div style={{ width:7, height:7, borderRadius:"50%", background:item.visible?block.color:"#d1d5db", flexShrink:0, margin:"0 12px" }}/>
                              <span style={{ flex:1, fontSize:13, color:item.visible?"#1f2937":"#9ca3af", fontWeight:item.visible?500:400, padding:"12px 0" }}>{item.label}</span>
                              <button onClick={()=>toggleItemVis(block.id,item.id)}
                                style={{ width:30, height:30, border:"none", background:item.visible?"#f0fdf4":"transparent", cursor:"pointer", color:item.visible?"#16a34a":"#d1d5db", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", marginRight:8, flexShrink:0 }}>
                                <i className={item.visible?"ri-eye-line":"ri-eye-off-line"} style={{ fontSize:14 }}/>
                              </button>
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

          {/* Page order preview */}
          <div style={{ marginTop:20, background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 18px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:10, display:"flex", alignItems:"center", gap:7 }}>
              <i className="ri-file-pdf-line" style={{ color:"#dc2626", fontSize:15 }}/>Report Page Order Preview
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {blocks.filter(b=>b.visible).map((b,i) => (
                <span key={b.id} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:b.color, background:b.bg, borderRadius:7, padding:"4px 11px", border:`1px solid ${b.color}22` }}>
                  <span style={{ fontSize:9, fontWeight:800, opacity:0.6 }}>P{i+1}</span>{b.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"#111827", color:"#fff", borderRadius:10, padding:"12px 18px", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 20px rgba(0,0,0,0.25)", zIndex:9999 }}>
          <i className="ri-checkbox-circle-line" style={{ color:"#4ade80", fontSize:15 }}/>{toast}
        </div>
      )}
    </div>
  );
}
