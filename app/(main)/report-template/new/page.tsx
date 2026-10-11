"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Step-1 data ───────────────────────────────────────────────────────────────
const BANKS = [
  { code:"SBI",  name:"State Bank of India",   color:"#1a3c8f", abbr:"SBI"  },
  { code:"BOB",  name:"Bank of Baroda",        color:"#d97706", abbr:"BOB"  },
  { code:"UCO",  name:"UCO Bank",              color:"#0f766e", abbr:"UCO"  },
  { code:"PNB",  name:"Punjab National Bank",  color:"#7c3aed", abbr:"PNB"  },
  { code:"CNRB", name:"Canara Bank",           color:"#15803d", abbr:"CNRB" },
  { code:"IB",   name:"Indian Bank",           color:"#be123c", abbr:"IB"   },
];

interface CircleEntry { code:string; name:string }
const BANK_CIRCLES: Record<string, CircleEntry[]> = {
  SBI: [
    { code:"LHO-AMR", name:"Amravati"       },
    { code:"LHO-BHO", name:"Bhopal"         },
    { code:"LHO-BAN", name:"Bangalore"      },
    { code:"LHO-BHU", name:"Bhubaneswar"    },
    { code:"LHO-BOM", name:"Mumbai"         },
    { code:"LHO-CHD", name:"Chandigarh"     },
    { code:"LHO-CHE", name:"Chennai"        },
    { code:"LHO-DEL", name:"Delhi"          },
    { code:"LHO-GAN", name:"Gandhinagar"    },
    { code:"LHO-HYD", name:"Hyderabad"      },
    { code:"LHO-JAI", name:"Jaipur"         },
    { code:"LHO-KOL", name:"Kolkata"        },
    { code:"LHO-LUC", name:"Lucknow"        },
    { code:"LHO-PAT", name:"Patna"          },
    { code:"LHO-THI", name:"Thiruvananthapuram" },
  ],
  BOB: [
    { code:"ZO-AHM", name:"Ahmedabad"       },
    { code:"ZO-BAN", name:"Bangalore"       },
    { code:"ZO-BHO", name:"Bhopal"          },
    { code:"ZO-CHE", name:"Chennai"         },
    { code:"ZO-DEL", name:"Delhi"           },
    { code:"ZO-HYD", name:"Hyderabad"       },
    { code:"ZO-KOL", name:"Kolkata"         },
    { code:"ZO-LUC", name:"Lucknow"         },
    { code:"ZO-MUM", name:"Mumbai"          },
    { code:"ZO-PAT", name:"Patna"           },
  ],
  UCO: [
    { code:"ZO-CHE", name:"Chennai"         },
    { code:"ZO-DEL", name:"Delhi"           },
    { code:"ZO-KOL", name:"Kolkata"         },
    { code:"ZO-MUM", name:"Mumbai"          },
    { code:"ZO-BAN", name:"Bangalore"       },
    { code:"ZO-HYD", name:"Hyderabad"       },
  ],
  PNB: [
    { code:"ZO-AMR", name:"Amritsar"        },
    { code:"ZO-BAN", name:"Bangalore"       },
    { code:"ZO-CHD", name:"Chandigarh"      },
    { code:"ZO-CHE", name:"Chennai"         },
    { code:"ZO-DEL", name:"Delhi"           },
    { code:"ZO-HYD", name:"Hyderabad"       },
    { code:"ZO-JAI", name:"Jaipur"          },
    { code:"ZO-KOL", name:"Kolkata"         },
    { code:"ZO-LUC", name:"Lucknow"         },
    { code:"ZO-MUM", name:"Mumbai"          },
    { code:"ZO-PAT", name:"Patna"           },
  ],
  CNRB: [
    { code:"ZO-BAN", name:"Bangalore"       },
    { code:"ZO-CHE", name:"Chennai"         },
    { code:"ZO-DEL", name:"Delhi"           },
    { code:"ZO-HYD", name:"Hyderabad"       },
    { code:"ZO-KOL", name:"Kolkata"         },
    { code:"ZO-MUM", name:"Mumbai"          },
    { code:"ZO-MYS", name:"Mysuru"          },
  ],
  IB: [
    { code:"ZO-CHE", name:"Chennai"         },
    { code:"ZO-COI", name:"Coimbatore"      },
    { code:"ZO-DEL", name:"Delhi"           },
    { code:"ZO-MUM", name:"Mumbai"          },
    { code:"ZO-TRI", name:"Tiruchirapalli"  },
    { code:"ZO-MDU", name:"Madurai"         },
  ],
};

// ── Step-2 block builder data (from PDF report) ───────────────────────────────
interface BlockItem  { id:string; label:string; visible:boolean }
interface ReportBlock {
  id:string; title:string; subtitle:string; icon:string; color:string; bg:string;
  type:"fixed"|"questions"|"images"|"table";
  visible:boolean; expanded:boolean; items:BlockItem[];
}

const INITIAL_BLOCKS: ReportBlock[] = [
  { id:"cover",   title:"Cover Page",   subtitle:"Branch identity, FY, audit date, company branding",   icon:"ri-file-shield-2-line", color:"#2563eb", bg:"#eff6ff", type:"fixed",     visible:true, expanded:false, items:[
    { id:"c1", label:"Bank Name",               visible:true },
    { id:"c2", label:"Branch Name",             visible:true },
    { id:"c3", label:"Branch Code",             visible:true },
    { id:"c4", label:"Branch Address",          visible:true },
    { id:"c5", label:"Financial Year",          visible:true },
    { id:"c6", label:"Audit Date",              visible:true },
    { id:"c7", label:"Auditor Name",            visible:true },
    { id:"c8", label:"RBO",                     visible:true },
    { id:"c9", label:"AO (Area Office)",        visible:true },
    { id:"c10",label:"LHO (Local Head Office)", visible:true },
    { id:"c11",label:"Company Logo & Address",  visible:true },
  ]},
  { id:"annexure1", title:"Annexure I — Electrical Safety Audit", subtitle:"Branch metadata: load, area, controllers, UPS & DG details", icon:"ri-file-list-2-line", color:"#0891b2", bg:"#ecfeff", type:"fixed", visible:true, expanded:false, items:[
    { id:"a1-1",  label:"Branch Code / Name",                          visible:true },
    { id:"a1-2",  label:"Address",                                     visible:true },
    { id:"a1-3",  label:"BM's PF No., Name and Contact",               visible:true },
    { id:"a1-4",  label:"Name of Controller–I (RM) & PF No.",          visible:true },
    { id:"a1-5",  label:"Name of Controller–II (DGM) & PF No.",        visible:true },
    { id:"a1-6",  label:"Sanctioned Load (KW/KVA)",                    visible:true },
    { id:"a1-7",  label:"Connected Load (KW/KVA)",                     visible:true },
    { id:"a1-8",  label:"Monthly Energy Bill Amount (Approx.)",        visible:true },
    { id:"a1-9",  label:"Tonnage of Air-Conditioners (TR)",            visible:true },
    { id:"a1-10", label:"Area of Branch / Office (Sq. Ft.)",           visible:true },
    { id:"a1-11", label:"HT / LT Connection",                          visible:true },
    { id:"a1-12", label:"Name of Field Auditor",                       visible:true },
    { id:"a1-13", label:"Audit Conducted On",                          visible:true },
    { id:"a1-14", label:"Hard Copy of Latest Electricity Bill",        visible:true },
    { id:"a1-15", label:"Last Audit Date & Auditor Name",              visible:true },
    { id:"a1-16", label:"UPS Details (Rating, Battery, Count)",        visible:true },
    { id:"a1-17", label:"Generator Details (Capacity, Hired/Owned)",   visible:true },
  ]},
  { id:"annexure2", title:"Annexure II — Audit Questions", subtitle:"Main compliance checklist: Yes/No and Observations/Remarks", icon:"ri-questionnaire-line", color:"#7c3aed", bg:"#f5f3ff", type:"questions", visible:true, expanded:false, items:[
    { id:"q1",    label:"MCCBs/MCBs/ELCBs with proper rating",                           visible:true },
    { id:"q2",    label:"Light & emergency light in electrical rooms",                    visible:true },
    { id:"q3",    label:"Pump/DG/UPS rooms maintained dry and clean",                    visible:true },
    { id:"q4",    label:"Water seepage near electrical panels/equipment",                visible:true },
    { id:"q5a",   label:"Earthing pits properly maintained",                             visible:true },
    { id:"q7",    label:"Electricity-bill penalty in meter details",                     visible:true },
    { id:"q7a",   label:"Additional electrical load required",                           visible:true },
    { id:"q13",   label:"Preventive maintenance by licensed electrician",                visible:true },
    { id:"q16",   label:"PF panel of appropriate rating installed",                      visible:true },
    { id:"q17b",  label:"Combustible/waste papers removed periodically",                 visible:true },
    { id:"q17c",  label:"No stationery stored in UPS room",                             visible:true },
    { id:"q18ii", label:"Metal exhaust fan for UPS room ventilation",                    visible:true },
    { id:"q18iii",label:"Ceiling fans — all BLDC",                                      visible:true },
    { id:"q19ii", label:"LED lighting — numbers recommended",                            visible:true },
    { id:"q20",   label:"Fire Protection / Fire Extinguishers",                         visible:true },
    { id:"q21",   label:"DG set recorded in equipment details",                         visible:true },
    { id:"oa4",   label:"Load distributed in all 3 phases",                             visible:true },
    { id:"oa5",   label:"Isolating switches for non-essential loads",                    visible:true },
    { id:"oa6",   label:"Pantry equipment connected to MCBs",                           visible:true },
    { id:"oa8",   label:"Timers used for AC changeover / signage boards",               visible:true },
    { id:"oa9",   label:"General condition of electrical panels, DBs",                  visible:true },
    { id:"oa10",  label:"Emergency contact numbers displayed in electric/UPS room",      visible:true },
    { id:"oa11",  label:"Fire extinguishers — Banking Hall (Water/CO2)",                visible:true },
    { id:"oa12",  label:"Fire extinguishers — Stationery Room (Water/CO2)",             visible:true },
    { id:"oa13",  label:"DG Set / Generator installed",                                 visible:true },
    { id:"oa23",  label:"UPS in fire resistant wall enclosure",                         visible:true },
    { id:"oa25",  label:"Rubber mat placed in UPS room",                               visible:true },
    { id:"oa26",  label:"Earthing DB provided in UPS room",                            visible:true },
    { id:"oa27",  label:"General condition of electrical panels in UPS room",          visible:true },
    { id:"oa28",  label:"Old/disposable records and broken furniture removed",          visible:true },
    { id:"oa29",  label:"Storage racks at safe distance from electrical points",        visible:true },
  ]},
  { id:"annexure3", title:"Annexure III — Onsite ATM", subtitle:"ATM-specific electrical and safety compliance questions", icon:"ri-bank-card-line", color:"#0369a1", bg:"#f0f9ff", type:"questions", visible:true, expanded:false, items:[
    { id:"atm2",  label:"Fire detector connected to branch AFDS",             visible:true },
    { id:"atm3",  label:"MCCB/MCB/ELCB provided and in working condition",   visible:true },
    { id:"atm4",  label:"AC units provided with timer circuit device",        visible:true },
    { id:"atm5",  label:"Main supply switch/MCB marked for ATM cutoff",      visible:true },
    { id:"atm7",  label:"Electrical wires properly covered/insulated",       visible:true },
    { id:"atm8",  label:"No cooking stove / heater coil in ATM",            visible:true },
    { id:"atm13", label:"Main entrance shutter in working condition",        visible:true },
    { id:"atm15", label:"All electrical lights in working condition",        visible:true },
    { id:"atm16", label:"ATM provided with external CCTV camera",           visible:true },
    { id:"atm17", label:"CCTV in working condition",                         visible:true },
  ]},
  { id:"ups",       title:"UPS Details",                    subtitle:"UPS/Inverter table, battery specs and live parameter readings",         icon:"ri-battery-charge-line",  color:"#15803d", bg:"#f0fdf4", type:"table",     visible:true, expanded:false, items:[
    { id:"ups-1", label:"UPS / Inverter Capacity Table (Make, KVA, Phase, Batteries)", visible:true },
    { id:"ups-2", label:"UPS Parameters (Input/Output Voltage, Current, Frequency)",   visible:true },
  ]},
  { id:"meter",     title:"Meter Details & Electrical Parameters", subtitle:"Meter info, voltage readings, current readings and power factor", icon:"ri-dashboard-3-line",     color:"#b45309", bg:"#fffbeb", type:"table",     visible:true, expanded:false, items:[
    { id:"m1", label:"Meter Details (Provider, Sanctioned Load, Meter No., Consumption)", visible:true },
    { id:"m2", label:"Voltage Readings (R-Y, Y-B, B-R, R-N, Y-N, B-N)",                 visible:true },
    { id:"m3", label:"Current Readings (R/Y/B Phase, Avg. Current)",                    visible:true },
    { id:"m4", label:"Frequency (Hz)",                                                   visible:true },
    { id:"m5", label:"Power Factor (PF)",                                                visible:true },
    { id:"m6", label:"N-E Voltage / Earthing",                                          visible:true },
  ]},
  { id:"dg",        title:"DG Set Details",                 subtitle:"Diesel generator specifications, observations and safety standards",    icon:"ri-plug-line",            color:"#6b21a8", bg:"#faf5ff", type:"table",     visible:true, expanded:false, items:[
    { id:"dg1", label:"DG Set — Hired or Owned",     visible:true },
    { id:"dg2", label:"DG Set Capacity (KVA)",       visible:true },
    { id:"dg3", label:"DG Set Make (OEM)",           visible:true },
    { id:"dg4", label:"Acoustic Enclosure Provided", visible:true },
    { id:"dg5", label:"No. of DG Set Batteries",    visible:true },
    { id:"dg6", label:"DG Set Battery Rating (AH)", visible:true },
  ]},
  { id:"loadsheet", title:"Branch Load Sheet",             subtitle:"Equipment-wise load calculation grouped by category",                   icon:"ri-table-2",              color:"#0f766e", bg:"#f0fdfa", type:"table",     visible:true, expanded:false, items:[
    { id:"ls1", label:"Lighting Load (Flush Lights, Down Lights, LED Tubes, etc.)", visible:true },
    { id:"ls2", label:"Fan Load (Ceiling, BLDC Wall, Exhaust)",                     visible:true },
    { id:"ls3", label:"UPS Load (Computers, Printers, Machines, ATM, CDM, etc.)",  visible:true },
    { id:"ls4", label:"Air Conditioning Load (Split, Cassette — with Tonnage)",    visible:true },
    { id:"ls5", label:"Power Load (Water Cooler, Other Equipment, UPS %)",         visible:true },
    { id:"ls6", label:"Total Connected Load Summary",                               visible:true },
  ]},
  { id:"photos",    title:"Photographic Overview",         subtitle:"Audit observations with risk classification and photo evidence",        icon:"ri-camera-lens-line",     color:"#be123c", bg:"#fff1f2", type:"images",    visible:true, expanded:false, items:[
    { id:"po1", label:"LOW RISK — Observations & Rectification Photographs",     visible:true },
    { id:"po2", label:"MEDIUM RISK — Observations & Rectification Photographs",  visible:true },
    { id:"po3", label:"HIGH RISK — Observations & Rectification Photographs",    visible:true },
    { id:"po4", label:"Auditor & Branch Representative Signatures",              visible:true },
  ]},
  { id:"ebill",     title:"Electricity Bill Image",        subtitle:"Scanned copy of latest electricity bill submitted at branch",          icon:"ri-receipt-line",          color:"#ca8a04", bg:"#fefce8", type:"images",    visible:true, expanded:false, items:[
    { id:"eb1", label:"Electricity Bill Scan / Photo", visible:true },
  ]},
  { id:"samplepics",title:"Sample Images",                 subtitle:"Location-wise photographs captured during the audit visit",            icon:"ri-image-2-line",          color:"#475569", bg:"#f8fafc", type:"images",    visible:true, expanded:false, items:[
    { id:"si1", label:"Branch Front Photo",                    visible:true },
    { id:"si2", label:"UPS Room Photo",                        visible:true },
    { id:"si3", label:"UPS Earthing Photo",                    visible:true },
    { id:"si4", label:"UPS MCB Photo",                         visible:true },
    { id:"si5", label:"UPS Room Exhaust Fan Photo",            visible:true },
    { id:"si6", label:"UPS / Stationery Room Materials Photo", visible:true },
    { id:"si7", label:"Main Panel Photo",                      visible:true },
    { id:"si8", label:"Fire Extinguishers Photo",              visible:true },
    { id:"si9", label:"Onsite ATM Back-Room Photo",            visible:true },
  ]},
];

const TYPE_LABELS: Record<ReportBlock["type"],string> = { fixed:"Fields", questions:"Questions", images:"Images", table:"Table" };
const TYPE_COLORS: Record<ReportBlock["type"],{bg:string;color:string}> = {
  fixed:     { bg:"#dbeafe", color:"#1d4ed8" },
  questions: { bg:"#ede9fe", color:"#7c3aed" },
  images:    { bg:"#fce7f3", color:"#be185d" },
  table:     { bg:"#d1fae5", color:"#065f46" },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function NewReportTemplatePage() {
  const router = useRouter();
  const [step, setStep] = useState<1|2>(1);

  // Step 1 state
  const [selectedBank,   setSelectedBank]   = useState("");
  const [selectedCircle, setSelectedCircle] = useState<CircleEntry|null>(null);
  const [circleSearch,   setCircleSearch]   = useState("");
  const [circleOpen,     setCircleOpen]     = useState(false);
  const [name,           setName]           = useState("");
  const [description,    setDescription]    = useState("");
  const [saveAs,         setSaveAs]         = useState<"Draft"|"Active">("Draft");

  // Step 2 state
  const [blocks,     setBlocks]     = useState<ReportBlock[]>(INITIAL_BLOCKS);
  const [toast,      setToast]      = useState<string|null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const bankObj      = BANKS.find(b => b.code === selectedBank);
  const circleList   = selectedBank ? (BANK_CIRCLES[selectedBank] ?? []) : [];
  const filteredCircles = circleList.filter(c =>
    c.name.toLowerCase().includes(circleSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(circleSearch.toLowerCase())
  );
  const step1Valid   = !!selectedBank && !!selectedCircle && name.trim().length > 0;

  const handleBankSelect = (code: string) => {
    setSelectedBank(code);
    setSelectedCircle(null);
    setCircleSearch("");
    setCircleOpen(true);
  };

  // ── Block ops ──
  const moveBlock = useCallback((idx: number, dir: -1|1) => {
    const to = idx + dir;
    if (to < 0 || to >= blocks.length) return;
    setBlocks(prev => { const n=[...prev]; [n[idx],n[to]]=[n[to],n[idx]]; return n; });
    showToast(`Moved block ${dir===-1?"up":"down"}`);
  }, [blocks]);

  const toggleBlockVis  = (id:string) => setBlocks(prev => prev.map(b => b.id===id ? {...b,visible:!b.visible} : b));
  const toggleExpanded  = (id:string) => setBlocks(prev => prev.map(b => b.id===id ? {...b,expanded:!b.expanded} : b));

  const moveItem = useCallback((bId:string, iIdx:number, dir:-1|1) => {
    setBlocks(prev => prev.map(b => {
      if (b.id!==bId) return b;
      const items=[...b.items]; const to=iIdx+dir;
      if (to<0||to>=items.length) return b;
      [items[iIdx],items[to]]=[items[to],items[iIdx]];
      return {...b,items};
    }));
  }, []);

  const toggleItemVis = (bId:string, iId:string) =>
    setBlocks(prev => prev.map(b => b.id!==bId ? b : { ...b, items:b.items.map(it => it.id===iId ? {...it,visible:!it.visible} : it) }));

  const visibleBlocks = blocks.filter(b=>b.visible).length;

  // ── Render ──
  return (
    <div style={{ minHeight:"100%", background:"var(--default-background,#f8f9fa)" }}>

      {/* ── Top bar ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"0 28px", height:56, display:"flex", alignItems:"center", gap:14, position:"sticky", top:0, zIndex:100 }}>
        <Link href="/report-template" style={{ width:34, height:34, borderRadius:8, border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280", textDecoration:"none" }}>
          <i className="ri-arrow-left-line" style={{ fontSize:16 }}/>
        </Link>
        {/* Breadcrumb */}
        <span style={{ fontSize:13, color:"#9ca3af" }}>
          <Link href="/report-template" style={{ color:"#9ca3af", textDecoration:"none" }}>Report Templates</Link>
          {" / "}
          <span style={{ color:"#111827", fontWeight:600 }}>New Template</span>
        </span>

        {/* Step indicator */}
        <div style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"center", gap:0 }}>
          {/* Step 1 */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800,
              background: step===1 ? "#2563eb" : "#16a34a",
              color:"#fff" }}>
              {step===1 ? "1" : <i className="ri-check-line" style={{ fontSize:14 }}/>}
            </div>
            <span style={{ fontSize:13, fontWeight:700, color: step===1 ? "#2563eb" : "#16a34a" }}>Template Details</span>
          </div>
          {/* Connector */}
          <div style={{ width:80, height:2, background: step===2 ? "#2563eb" : "#e5e7eb", margin:"0 12px", transition:"background 0.3s" }}/>
          {/* Step 2 */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800,
              background: step===2 ? "#2563eb" : "#e5e7eb",
              color: step===2 ? "#fff" : "#9ca3af" }}>
              2
            </div>
            <span style={{ fontSize:13, fontWeight:700, color: step===2 ? "#2563eb" : "#9ca3af" }}>Configure Report Blocks</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => router.push("/report-template")}
            style={{ padding:"7px 16px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, fontSize:13, cursor:"pointer" }}>
            Cancel
          </button>
          {step===1 && (
            <button onClick={() => { if (step1Valid) setStep(2); }} disabled={!step1Valid}
              style={{ padding:"7px 20px", borderRadius:8, border:"none", background: step1Valid ? "#2563eb" : "#e5e7eb", color: step1Valid ? "#fff" : "#9ca3af", fontWeight:700, fontSize:13, cursor: step1Valid ? "pointer" : "not-allowed", display:"flex", alignItems:"center", gap:6 }}>
              Next <i className="ri-arrow-right-line"/>
            </button>
          )}
          {step===2 && (
            <>
              <button onClick={() => setStep(1)}
                style={{ padding:"7px 16px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                <i className="ri-arrow-left-line"/>Back
              </button>
              <button onClick={() => { showToast("Report Template saved!"); setTimeout(() => router.push("/report-template"), 1500); }}
                style={{ padding:"7px 20px", borderRadius:8, border:"none", background:"#111827", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                <i className="ri-save-line"/>Save Template
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Step 1: Template Details ── */}
      {step===1 && (
        <div style={{ maxWidth:900, margin:"0 auto", padding:"36px 28px" }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 4px" }}>Create Report Template</h2>
          <p style={{ fontSize:13, color:"#6b7280", margin:"0 0 28px" }}>Select the bank and configure template details, then arrange report blocks in the next step.</p>

          {/* Select Bank */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"24px 28px", marginBottom:20 }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:4 }}>Select Bank <span style={{ color:"#dc2626" }}>*</span></div>
            <div style={{ fontSize:12, color:"#9ca3af", marginBottom:18 }}>Choose the bank this report template is designed for</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {BANKS.map(b => {
                const sel = selectedBank === b.code;
                return (
                  <button key={b.code} onClick={() => handleBankSelect(b.code)}
                    style={{ padding:"18px 20px", borderRadius:10, border: sel ? `2px solid ${b.color}` : "1.5px solid #e5e7eb", background: sel ? `${b.color}0d` : "#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:14, transition:"all 0.15s", textAlign:"left" as const }}>
                    <div style={{ width:44, height:44, borderRadius:10, background:b.color, color:"#fff", fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {b.abbr}
                    </div>
                    <span style={{ fontSize:14, fontWeight:700, color: sel ? b.color : "#374151" }}>{b.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mapped Circle — shown after bank selection */}
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

              {/* Selected pill */}
              {selectedCircle && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, background:bankObj ? `${bankObj.color}10` : "#f0fdf4", border:`1px solid ${bankObj ? `${bankObj.color}30` : "#bbf7d0"}`, borderRadius:8, padding:"7px 12px" }}>
                    <i className="ri-checkbox-circle-fill" style={{ fontSize:14, color:bankObj?.color ?? "#16a34a" }}/>
                    <span style={{ fontSize:13, fontWeight:700, color:bankObj?.color ?? "#15803d" }}>{selectedCircle.code}</span>
                    <span style={{ fontSize:13, color:"#374151" }}>—</span>
                    <span style={{ fontSize:13, color:"#374151" }}>{selectedCircle.name}</span>
                    <button onClick={() => { setSelectedCircle(null); setCircleOpen(true); setCircleSearch(""); }}
                      style={{ marginLeft:4, border:"none", background:"transparent", cursor:"pointer", color:"#9ca3af", padding:0, display:"flex", alignItems:"center" }}>
                      <i className="ri-close-line" style={{ fontSize:15 }}/>
                    </button>
                  </div>
                </div>
              )}

              {/* Search input */}
              {(!selectedCircle || circleOpen) && (
                <div style={{ position:"relative" as const }}>
                  <div style={{ display:"flex", alignItems:"center", border:"1.5px solid #2563eb", borderRadius:8, overflow:"hidden", background:"#fff" }}>
                    <i className="ri-search-line" style={{ fontSize:14, color:"#9ca3af", padding:"0 12px", flexShrink:0 }}/>
                    <input
                      autoFocus
                      value={circleSearch}
                      onChange={e => { setCircleSearch(e.target.value); setCircleOpen(true); }}
                      onFocus={() => setCircleOpen(true)}
                      placeholder="Search or select a circle..."
                      style={{ flex:1, padding:"10px 0", border:"none", outline:"none", fontSize:13, color:"#374151" }}
                    />
                    <i className="ri-search-2-line" style={{ fontSize:14, color:"#2563eb", padding:"0 12px", flexShrink:0 }}/>
                  </div>

                  {/* Dropdown */}
                  {circleOpen && (
                    <div style={{ position:"absolute" as const, top:"calc(100% + 4px)", left:0, right:0, background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", zIndex:50, overflow:"hidden" }}>
                      <div style={{ padding:"8px 14px 6px", fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase" as const, letterSpacing:"0.07em", borderBottom:"1px solid #f3f4f6", background:"#fafafa" }}>
                        Local Head Office (LHO) / Zonal Office (ZO) / FGMO
                      </div>
                      <div style={{ maxHeight:220, overflowY:"auto" as const }}>
                        {filteredCircles.length === 0 ? (
                          <div style={{ padding:"16px 14px", fontSize:13, color:"#9ca3af", textAlign:"center" as const }}>No circles found</div>
                        ) : filteredCircles.map(c => (
                          <button key={c.code}
                            onClick={() => { setSelectedCircle(c); setCircleOpen(false); setCircleSearch(""); }}
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
            <div style={{ fontSize:12, color:"#9ca3af", marginBottom:18 }}>Give this template a clear, descriptive name</div>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"#6b7280", display:"block", marginBottom:6, textTransform:"uppercase" as const, letterSpacing:"0.05em" }}>
                REPORT TEMPLATE NAME <span style={{ color:"#dc2626" }}>*</span>
              </label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. SBI Urban Branch Electrical Safety Report 2025"
                style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:13, color:"#374151", outline:"none", boxSizing:"border-box" as const }}/>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#6b7280", display:"block", marginBottom:6, textTransform:"uppercase" as const, letterSpacing:"0.05em" }}>DESCRIPTION</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of scope, applicable branch types, regulatory basis..."
                rows={3}
                style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:13, color:"#374151", outline:"none", resize:"vertical", boxSizing:"border-box" as const }}/>
            </div>
          </div>

          {/* Save as */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"24px 28px" }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:4 }}>Save as</div>
            <div style={{ fontSize:12, color:"#9ca3af", marginBottom:18 }}>Draft templates are not available for audit report generation until activated</div>
            <div style={{ display:"flex", gap:12 }}>
              {(["Draft","Active"] as const).map(s => {
                const sel = saveAs===s;
                const col = s==="Active" ? "#16a34a" : "#2563eb";
                return (
                  <button key={s} onClick={() => setSaveAs(s)}
                    style={{ flex:1, padding:"14px 20px", borderRadius:10, border: sel ? `2px solid ${col}` : "1.5px solid #e5e7eb", background: sel ? `${col}0d` : "#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:12, transition:"all 0.15s" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${sel ? col : "#d1d5db"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {sel && <div style={{ width:10, height:10, borderRadius:"50%", background:col }}/>}
                    </div>
                    <div style={{ textAlign:"left" as const }}>
                      <div style={{ fontSize:13, fontWeight:700, color: sel ? col : "#374151" }}>{s}</div>
                      <div style={{ fontSize:11, color:"#9ca3af" }}>
                        {s==="Draft" ? "Save and configure later" : "Ready for report generation"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Block Builder ── */}
      {step===2 && (
        <div style={{ padding:"28px" }}>

          {/* Context summary strip */}
          {bankObj && (
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:bankObj.color, color:"#fff", fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {bankObj.abbr}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{name}</div>
                <div style={{ fontSize:12, color:"#9ca3af", display:"flex", gap:8, marginTop:2, flexWrap:"wrap" as const }}>
                  <span>{bankObj.name}</span>
                  {selectedCircle && <><span>·</span><span style={{ color:"#374151", fontWeight:600 }}>{selectedCircle.code} — {selectedCircle.name}</span></>}
                  <span>·</span>
                  <span style={{ color: saveAs==="Active"?"#16a34a":"#2563eb", fontWeight:600 }}>{saveAs}</span>
                </div>
              </div>
              <button onClick={() => setStep(1)} style={{ marginLeft:"auto", padding:"5px 14px", borderRadius:7, border:"1px solid #e5e7eb", background:"#f9fafb", color:"#374151", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                <i className="ri-edit-line" style={{ fontSize:12 }}/>Edit Details
              </button>
            </div>
          )}

          {/* Help banner */}
          <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"flex-start", gap:10 }}>
            <i className="ri-information-line" style={{ fontSize:16, color:"#2563eb", flexShrink:0, marginTop:1 }}/>
            <div style={{ fontSize:12, color:"#1e40af", lineHeight:1.6 }}>
              <strong>Configure the report layout:</strong> Use <strong>↑ ↓</strong> to reorder blocks.
              Click <i className="ri-eye-line" style={{ fontSize:11 }}/> to hide a block or individual item from the report.
              Expand any block to reorder or hide the questions/fields inside it.
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
            {[
              { label:"Total Blocks",     value:blocks.length,                                                                        icon:"ri-layout-3-line",     color:"#2563eb", bg:"#eff6ff" },
              { label:"Visible in Report",value:visibleBlocks,                                                                       icon:"ri-eye-line",          color:"#16a34a", bg:"#f0fdf4" },
              { label:"Hidden",           value:blocks.length-visibleBlocks,                                                         icon:"ri-eye-off-line",      color:"#9ca3af", bg:"#f9fafb" },
              { label:"Active Questions", value:blocks.filter(b=>b.type==="questions").reduce((s,b)=>s+b.items.filter(i=>i.visible).length,0), icon:"ri-questionnaire-line", color:"#7c3aed", bg:"#f5f3ff" },
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

          {/* Block list */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {blocks.map((block, idx) => {
              const tc       = TYPE_COLORS[block.type];
              const visItems = block.items.filter(i=>i.visible).length;
              return (
                <div key={block.id} style={{ background:"#fff", borderRadius:12, border:`1px solid ${block.visible?"#e5e7eb":"#f3f4f6"}`, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)", opacity:block.visible?1:0.6, transition:"opacity 0.2s" }}>
                  {/* Block header */}
                  <div style={{ display:"flex", alignItems:"center", borderLeft:`4px solid ${block.visible?block.color:"#d1d5db"}` }}>
                    <div style={{ width:48, display:"flex", alignItems:"center", justifyContent:"center", padding:"18px 0", flexShrink:0 }}>
                      <span style={{ width:26, height:26, borderRadius:7, background:block.visible?block.bg:"#f3f4f6", color:block.visible?block.color:"#9ca3af", fontSize:12, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{idx+1}</span>
                    </div>
                    <div style={{ width:42, height:42, borderRadius:10, background:block.visible?block.bg:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:14 }}>
                      <i className={block.icon} style={{ fontSize:18, color:block.visible?block.color:"#9ca3af" }}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                        <span style={{ fontSize:13, fontWeight:700, color:block.visible?"var(--default-text-color)":"#9ca3af" }}>{block.title}</span>
                        <span style={{ fontSize:10, fontWeight:700, borderRadius:20, padding:"2px 8px", color:tc.color, background:tc.bg }}>{TYPE_LABELS[block.type]}</span>
                        {!block.visible && <span style={{ fontSize:10, fontWeight:700, color:"#9ca3af", background:"#f3f4f6", borderRadius:20, padding:"2px 8px" }}>Hidden</span>}
                      </div>
                      <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>{block.subtitle}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:20, padding:"3px 10px", marginRight:12, flexShrink:0 }}>
                      {visItems}/{block.items.length}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:2, paddingRight:14, flexShrink:0 }}>
                      {[
                        { icon:"ri-arrow-up-s-line",   disabled:idx===0,               onClick:()=>moveBlock(idx,-1),        title:"Move up"   },
                        { icon:"ri-arrow-down-s-line",  disabled:idx===blocks.length-1, onClick:()=>moveBlock(idx,1),         title:"Move down" },
                      ].map((btn,bi) => (
                        <button key={bi} onClick={btn.onClick} disabled={btn.disabled} title={btn.title}
                          style={{ width:28, height:28, border:"none", background:"transparent", cursor:btn.disabled?"not-allowed":"pointer", color:btn.disabled?"#e5e7eb":"#6b7280", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <i className={btn.icon} style={{ fontSize:17 }}/>
                        </button>
                      ))}
                      <div style={{ width:1, height:18, background:"#e5e7eb", margin:"0 3px" }}/>
                      <button onClick={()=>toggleBlockVis(block.id)} title={block.visible?"Hide":"Show"}
                        style={{ width:28, height:28, border:"none", background:"transparent", cursor:"pointer", color:block.visible?"#16a34a":"#9ca3af", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <i className={block.visible?"ri-eye-line":"ri-eye-off-line"} style={{ fontSize:15 }}/>
                      </button>
                      <div style={{ width:1, height:18, background:"#e5e7eb", margin:"0 3px" }}/>
                      <button onClick={()=>toggleExpanded(block.id)} title={block.expanded?"Collapse":"Expand"}
                        style={{ width:28, height:28, border:"none", background:"transparent", cursor:"pointer", color:"#6b7280", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <i className={block.expanded?"ri-arrow-up-s-line":"ri-arrow-down-s-line"} style={{ fontSize:17 }}/>
                      </button>
                    </div>
                  </div>

                  {/* Expanded items */}
                  {block.expanded && (
                    <div style={{ borderTop:"1px solid #f3f4f6" }}>
                      <div style={{ padding:"9px 18px 9px 66px", background:"#fafafa", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase" as const, letterSpacing:"0.06em" }}>
                          {TYPE_LABELS[block.type]} inside this block
                        </span>
                        <div style={{ display:"flex", gap:8 }}>
                          <button onClick={() => setBlocks(prev=>prev.map(b=>b.id!==block.id?b:{...b,items:b.items.map(it=>({...it,visible:true}))}))}
                            style={{ fontSize:11, fontWeight:700, color:"#16a34a", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:6, padding:"3px 10px", cursor:"pointer" }}>Show all</button>
                          <button onClick={() => setBlocks(prev=>prev.map(b=>b.id!==block.id?b:{...b,items:b.items.map(it=>({...it,visible:false}))}))}
                            style={{ fontSize:11, fontWeight:700, color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:6, padding:"3px 10px", cursor:"pointer" }}>Hide all</button>
                        </div>
                      </div>
                      {block.items.map((item, iIdx) => (
                        <div key={item.id} style={{ display:"flex", alignItems:"center", borderBottom:iIdx<block.items.length-1?"1px solid #f9fafb":"none", background:item.visible?"transparent":"#fafafa", opacity:item.visible?1:0.5, transition:"all 0.15s" }}>
                          <div style={{ width:66, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:14 }}>
                            <span style={{ fontSize:11, color:"#d1d5db", fontWeight:600, fontFamily:"monospace" }}>{String(iIdx+1).padStart(2,"0")}</span>
                          </div>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:item.visible?block.color:"#d1d5db", flexShrink:0, marginRight:12 }}/>
                          <span style={{ flex:1, fontSize:13, color:item.visible?"#374151":"#9ca3af", padding:"11px 0" }}>{item.label}</span>
                          <div style={{ display:"flex", alignItems:"center", gap:2, paddingRight:14, flexShrink:0 }}>
                            <button onClick={()=>moveItem(block.id,iIdx,-1)} disabled={iIdx===0}
                              style={{ width:24, height:24, border:"none", background:"transparent", cursor:iIdx===0?"not-allowed":"pointer", color:iIdx===0?"#e5e7eb":"#9ca3af", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <i className="ri-arrow-up-s-line" style={{ fontSize:14 }}/>
                            </button>
                            <button onClick={()=>moveItem(block.id,iIdx,1)} disabled={iIdx===block.items.length-1}
                              style={{ width:24, height:24, border:"none", background:"transparent", cursor:iIdx===block.items.length-1?"not-allowed":"pointer", color:iIdx===block.items.length-1?"#e5e7eb":"#9ca3af", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <i className="ri-arrow-down-s-line" style={{ fontSize:14 }}/>
                            </button>
                            <button onClick={()=>toggleItemVis(block.id,item.id)}
                              style={{ width:24, height:24, border:"none", background:"transparent", cursor:"pointer", color:item.visible?"#16a34a":"#d1d5db", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <i className={item.visible?"ri-eye-line":"ri-eye-off-line"} style={{ fontSize:13 }}/>
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

          {/* Report order preview */}
          <div style={{ marginTop:20, background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 18px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)", marginBottom:10, display:"flex", alignItems:"center", gap:7 }}>
              <i className="ri-file-pdf-line" style={{ color:"#dc2626", fontSize:15 }}/>
              Report Page Order Preview
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
