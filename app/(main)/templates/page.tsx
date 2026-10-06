"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";

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

interface Question {
  id: string; code: string; section: string; textEn: string; riskLevel: "HIGH" | "MEDIUM" | "LOW";
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION LIBRARY (Active questions from the Question Library)
// ─────────────────────────────────────────────────────────────────────────────
const ALL_QUESTIONS: Question[] = [
  { id:"q001",  code:"Q-001",  section:"General",                textEn:"Whether MCCBs/MCBs/ELCBs are provided with proper rating to cater the load",                                                riskLevel:"HIGH"   },
  { id:"q002",  code:"Q-002",  section:"General",                textEn:"Whether light and emergency light are provided in electrical rooms/operating areas",                                          riskLevel:"HIGH"   },
  { id:"q003",  code:"Q-003",  section:"General",                textEn:"Whether Pump room, DG set room, UPS room, electrical room etc. are maintained dry and in good condition",                     riskLevel:"HIGH"   },
  { id:"q004",  code:"Q-004",  section:"General",                textEn:"Whether water seepage is observed near any of the Electrical Panel, Distribution Boards, Electrical equipment etc.",          riskLevel:"HIGH"   },
  { id:"q005",  code:"Q-005",  section:"General",                textEn:"Whether Earthing pits are provided and connected to the equipment body",                                                      riskLevel:"HIGH"   },
  { id:"q006",  code:"Q-006",  section:"General",                textEn:"Whether the Earthing Pits are properly maintained",                                                                           riskLevel:"HIGH"   },
  { id:"q007",  code:"Q-007",  section:"General",                textEn:"Whether proper exhaust fan for ventilation of panel room/electrical room/UPS room is provided",                               riskLevel:"MEDIUM" },
  { id:"q008",  code:"Q-008",  section:"General",                textEn:"Whether penalty is being imposed in electricity bills on account of higher load/poor power factor",                           riskLevel:"MEDIUM" },
  { id:"q009",  code:"Q-009",  section:"General",                textEn:"Additional electrical load required if any (from Power Distribution Company)",                                                riskLevel:"LOW"    },
  { id:"q010",  code:"Q-010",  section:"General",                textEn:"Whether load is distributed in all 3 phases to avoid unbalancing of phases",                                                  riskLevel:"HIGH"   },
  { id:"q011",  code:"Q-011",  section:"General",                textEn:"Whether isolating switches are provided for switching off non-essential loads during night",                                   riskLevel:"MEDIUM" },
  { id:"q012",  code:"Q-012",  section:"General",                textEn:"Whether electrical equipments of Pantry etc. are properly connected to Iron socket box with MCBs",                            riskLevel:"MEDIUM" },
  { id:"q013",  code:"Q-013",  section:"General",                textEn:"Whether proper preventive maintenance of Panel boards and Distribution Boards is carried out by licensed electricians",       riskLevel:"HIGH"   },
  { id:"q014",  code:"Q-014",  section:"General",                textEn:"Whether appropriate timers used in changeover of Air conditioners for Server Room ACs and Signage Boards",                   riskLevel:"MEDIUM" },
  { id:"q015",  code:"Q-015",  section:"General",                textEn:"Whether preventive maintenance of electric installation and equipment is carried out by skilled license holder electricians",  riskLevel:"HIGH"   },
  { id:"q016",  code:"Q-016",  section:"General",                textEn:"General condition of electrical control panels, Main switch, electric meter board and changeover switch is good",              riskLevel:"HIGH"   },
  { id:"q017",  code:"Q-017",  section:"General",                textEn:"Whether contact numbers of electricians, power distribution company, Generator/UPS/AC vendors are displayed",                 riskLevel:"LOW"    },
  { id:"q018",  code:"Q-018",  section:"General",                textEn:"Whether the Power Factor (PF) panel of appropriate rating is installed",                                                      riskLevel:"MEDIUM" },
  { id:"q019",  code:"Q-019",  section:"Fire Prevention Measures", textEn:"All old disposable records, broken furniture etc. accumulated at the premises have been cleared",                           riskLevel:"HIGH"   },
  { id:"q020",  code:"Q-020",  section:"Fire Prevention Measures", textEn:"Combustible leaf, litter/waste papers in and around the branch are removed/cleaned periodically",                           riskLevel:"HIGH"   },
  { id:"q021",  code:"Q-021",  section:"Fire Prevention Measures", textEn:"No stationery/Records/old obsolete items are stored in the system/UPS room",                                               riskLevel:"HIGH"   },
  { id:"q022",  code:"Q-022",  section:"Fire Prevention Measures", textEn:"Storage racks in Stationery/Record room are at safe distance of at least 3 ft from electrical points",                     riskLevel:"HIGH"   },
  { id:"q023",  code:"Q-023",  section:"Fire Prevention Measures", textEn:"In the pantry/canteen LPG is used",                                                                                        riskLevel:"MEDIUM" },
  { id:"q024",  code:"Q-024",  section:"Server and UPS Room",    textEn:"Server room has dual AC units having timer circuit device with independent circuit",                                          riskLevel:"HIGH"   },
  { id:"q025",  code:"Q-025",  section:"Server and UPS Room",    textEn:"Whether metal body exhaust fan is installed in UPS room",                                                                    riskLevel:"MEDIUM" },
  { id:"q026",  code:"Q-026",  section:"Server and UPS Room",    textEn:"Whether all ceiling fans installed are of BLDC type",                                                                        riskLevel:"LOW"    },
  { id:"q027",  code:"Q-027",  section:"Electrical Safety",      textEn:"Power supply to record/stationery room is made through plug and socket arrangement",                                         riskLevel:"HIGH"   },
  { id:"q028",  code:"Q-028",  section:"Electrical Safety",      textEn:"Whether LED lights have been installed in all areas",                                                                         riskLevel:"MEDIUM" },
  { id:"q029",  code:"Q-029",  section:"Electrical Safety",      textEn:"Whether motion sensors/occupancy sensors have been installed",                                                               riskLevel:"MEDIUM" },
  { id:"q030",  code:"Q-030",  section:"Fire Protection",        textEn:"Are fire extinguishers available in all required work areas, clearly marked and accessible?",                                riskLevel:"HIGH"   },
  { id:"q031",  code:"Q-031",  section:"DG Set / Generator",     textEn:"DG Set / Generator is installed at the branch/office",                                                                       riskLevel:"HIGH"   },
  { id:"q032",  code:"Q-032",  section:"DG Set / Generator",     textEn:"At least two 6 Kg. ABC capacity fire extinguishers are placed near the diesel generator",                                    riskLevel:"HIGH"   },
  { id:"q033",  code:"Q-033",  section:"DG Set / Generator",     textEn:"Electrical safety and energy saving awareness meeting with staff was conducted post audit",                                   riskLevel:"MEDIUM" },
  { id:"q034",  code:"Q-034",  section:"Onsite ATM",             textEn:"5 Kg ABC Automatic Modular Fire Extinguisher is provided and protected in the back room",                                    riskLevel:"HIGH"   },
  { id:"q035",  code:"Q-035",  section:"Onsite ATM",             textEn:"ATM room is having fire detector connected through branch AFDS (Applicable for Onsite ATMs only)",                          riskLevel:"HIGH"   },
  { id:"q036",  code:"Q-036",  section:"Onsite ATM",             textEn:"Whether MCCB/MCB/ELCB are provided and apparently in working condition",                                                     riskLevel:"HIGH"   },
  { id:"q037",  code:"Q-037",  section:"Onsite ATM",             textEn:"AC units are provided with timer circuit device",                                                                            riskLevel:"MEDIUM" },
  { id:"q038",  code:"Q-038",  section:"Onsite ATM",             textEn:"Main supply switch/MCB to cut-off the electric supply of ATM has been marked",                                              riskLevel:"HIGH"   },
  { id:"q039",  code:"Q-039",  section:"Onsite ATM",             textEn:"Power supply to AC, UPS and ATM machines is through metal clad plug receptacle socket",                                     riskLevel:"HIGH"   },
  { id:"q040",  code:"Q-040",  section:"Onsite ATM",             textEn:"Electrical wires are properly covered/insulated to prevent exposure",                                                        riskLevel:"HIGH"   },
  { id:"q041",  code:"Q-041",  section:"Onsite ATM",             textEn:"Is there any cooking stove/electric heater coil stove noticed in the ATM",                                                  riskLevel:"HIGH"   },
  { id:"q042",  code:"Q-042",  section:"Onsite ATM",             textEn:"Is there any water accumulation/seepage in the premises or dripping on electrical gadgets",                                  riskLevel:"HIGH"   },
  { id:"q043",  code:"Q-043",  section:"Onsite ATM",             textEn:"Any combustible container provided in the ATM",                                                                              riskLevel:"HIGH"   },
  { id:"q044",  code:"Q-044",  section:"Onsite ATM",             textEn:"Steel dustbin container provided in the ATM",                                                                                riskLevel:"MEDIUM" },
  { id:"q045",  code:"Q-045",  section:"Onsite ATM",             textEn:"No smoking board is provided in the ATM cabin",                                                                             riskLevel:"LOW"    },
  { id:"q046",  code:"Q-046",  section:"Onsite ATM",             textEn:"Main entrance shutter is in working condition",                                                                              riskLevel:"MEDIUM" },
  { id:"q047",  code:"Q-047",  section:"Onsite ATM",             textEn:"Proper locking arrangement is there at the main shutter",                                                                   riskLevel:"HIGH"   },
  { id:"q048",  code:"Q-048",  section:"Onsite ATM",             textEn:"All electrical lights are in working condition",                                                                             riskLevel:"MEDIUM" },
  { id:"q049",  code:"Q-049",  section:"Onsite ATM",             textEn:"ATM is provided with external CCTV camera",                                                                                 riskLevel:"HIGH"   },
  { id:"q050",  code:"Q-050",  section:"Onsite ATM",             textEn:"CCTV is in working condition",                                                                                              riskLevel:"HIGH"   },
];

const SECTION_ORDER = [
  "General", "Fire Prevention Measures", "Server and UPS Room",
  "Electrical Safety", "Fire Protection", "DG Set / Generator", "Onsite ATM",
];

const SECTION_CFG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  "General":                { color:"#1d4ed8", bg:"#eff6ff",  border:"#bfdbfe", icon:"ri-flashlight-line"       },
  "Fire Prevention Measures":{ color:"#dc2626", bg:"#fef2f2",  border:"#fecaca", icon:"ri-fire-line"             },
  "Server and UPS Room":    { color:"#7c3aed", bg:"#f5f3ff",  border:"#ddd6fe", icon:"ri-server-line"           },
  "Electrical Safety":      { color:"#b45309", bg:"#fffbeb",  border:"#fde68a", icon:"ri-plug-line"             },
  "Fire Protection":        { color:"#c2410c", bg:"#fff7ed",  border:"#fed7aa", icon:"ri-shield-flash-line"     },
  "DG Set / Generator":     { color:"#065f46", bg:"#f0fdf4",  border:"#bbf7d0", icon:"ri-battery-charge-line"   },
  "Onsite ATM":             { color:"#0e7490", bg:"#ecfeff",  border:"#a5f3fc", icon:"ri-bank-card-line"        },
};

const RISK_CFG = {
  HIGH:   { color:"#dc2626", bg:"#fee2e2" },
  MEDIUM: { color:"#b45309", bg:"#fef3c7" },
  LOW:    { color:"#15803d", bg:"#dcfce7" },
};

// ─────────────────────────────────────────────────────────────────────────────
// BANK → CIRCLES MAP
// ─────────────────────────────────────────────────────────────────────────────
const BANK_CIRCLES: Record<string, string[]> = {
  "State Bank of India":  ["SBI Gujarat Circle", "SBI MP Circle", "SBI Rajasthan Circle", "SBI Punjab Circle", "SBI UP Circle"],
  "Bank of Baroda":       ["BOB Gujarat Circle", "BOB Rajasthan Circle", "BOB Maharashtra Circle"],
  "UCO Bank":             ["UCO East Circle", "UCO North Circle"],
  "Punjab National Bank": ["PNB North Circle", "PNB UP Circle", "PNB Punjab Circle"],
  "Canara Bank":          ["Canara South Circle", "Canara West Circle"],
  "Indian Bank":          ["Indian Bank South Circle", "Indian Bank East Circle"],
};

const BANK_LIST = Object.keys(BANK_CIRCLES);

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
  { id:"T-001", name:"SBI Standard Branch Audit",       bank:"State Bank of India",  bankCode:"SBI",  circles:["SBI Gujarat Circle","SBI MP Circle"], version:"v2.3", description:"Comprehensive audit template for SBI urban and metro branches covering all compliance parameters.", status:"Active",   createdBy:"Admin", createdOn:"15 Jan 2024", lastUsed:"20 Jul 2024", usedCount:42, totalQ:28, sections:[{name:"General",questions:8,weightage:30},{name:"Fire Prevention Measures",questions:6,weightage:25},{name:"Electrical Safety",questions:4,weightage:15},{name:"DG Set / Generator",questions:5,weightage:20},{name:"Onsite ATM",questions:5,weightage:10}] },
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
// NEW TEMPLATE FORM STATE
// ─────────────────────────────────────────────────────────────────────────────
interface NewTemplateForm {
  bank: string;
  circles: string[];
  name: string;
  description: string;
  status: "Active" | "Draft";
  selectedQIds: string[];
}
const EMPTY_FORM: NewTemplateForm = { bank:"", circles:[], name:"", description:"", status:"Draft", selectedQIds:[] };

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AuditTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(SEED);
  const [search,    setSearch]    = useState("");
  const [statusF,   setStatusF]   = useState<"All"|"Active"|"Draft"|"Archived">("All");
  const [expanded,  setExpanded]  = useState<string|null>(null);
  const [view,      setView]      = useState<"grid"|"list">("grid");

  // Drawer state
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState<NewTemplateForm>({ ...EMPTY_FORM });
  const [qSearch,   setQSearch]   = useState("");
  const [qSection,  setQSection]  = useState("All");
  const [step,      setStep]      = useState<1|2>(1);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setShowForm(false);
    };
    if (showForm) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showForm]);

  // Filtered questions for question picker
  const filteredQs = useMemo(() => {
    const q = qSearch.toLowerCase();
    return ALL_QUESTIONS.filter(qs =>
      (qSection === "All" || qs.section === qSection) &&
      (!q || qs.code.toLowerCase().includes(q) || qs.textEn.toLowerCase().includes(q))
    );
  }, [qSearch, qSection]);

  // Grouped by section for question picker
  const groupedQs = useMemo(() => {
    const map = new Map<string, Question[]>();
    filteredQs.forEach(q => {
      const arr = map.get(q.section) ?? [];
      arr.push(q);
      map.set(q.section, arr);
    });
    // Sort by SECTION_ORDER
    return SECTION_ORDER.filter(s => map.has(s)).map(s => ({ section: s, qs: map.get(s)! }));
  }, [filteredQs]);

  const toggleQ = (id: string) =>
    setForm(f => ({
      ...f,
      selectedQIds: f.selectedQIds.includes(id)
        ? f.selectedQIds.filter(x => x !== id)
        : [...f.selectedQIds, id],
    }));

  const toggleSection = (section: string) => {
    const ids = ALL_QUESTIONS.filter(q => q.section === section).map(q => q.id);
    const allSel = ids.every(id => form.selectedQIds.includes(id));
    setForm(f => ({
      ...f,
      selectedQIds: allSel
        ? f.selectedQIds.filter(id => !ids.includes(id))
        : [...new Set([...f.selectedQIds, ...ids])],
    }));
  };

  const handleSaveTemplate = () => {
    if (!form.bank || !form.name.trim() || form.selectedQIds.length === 0) return;
    const id = `T-${String(templates.length + 1).padStart(3, "0")}`;
    const selectedQs = ALL_QUESTIONS.filter(q => form.selectedQIds.includes(q.id));
    const sectionMap = new Map<string, number>();
    selectedQs.forEach(q => sectionMap.set(q.section, (sectionMap.get(q.section) ?? 0) + 1));
    const sections: TemplateSection[] = [];
    let remaining = 100;
    const sectionArr = Array.from(sectionMap.entries());
    sectionArr.forEach(([name, count], i) => {
      const w = i === sectionArr.length - 1 ? remaining : Math.round(100 / sectionArr.length);
      remaining -= w;
      sections.push({ name, questions: count, weightage: w });
    });

    const newTemplate: Template = {
      id, name: form.name.trim(), description: form.description.trim(),
      bank: form.bank, bankCode: BANK_CODE[form.bank] ?? "??",
      circles: form.circles, sections, totalQ: selectedQs.length,
      status: form.status, version: "v1.0", createdBy: "Admin",
      createdOn: new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }),
      usedCount: 0, selectedQuestionIds: form.selectedQIds,
    };
    setTemplates(ts => [newTemplate, ...ts]);
    setShowForm(false);
    setForm({ ...EMPTY_FORM });
    setStep(1);
    setQSearch(""); setQSection("All");
  };

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

  const bankCode = BANK_CODE[form.bank] ?? "";
  const ba = BANK_ACCENT[bankCode] ?? { accent:"#374151", lightBg:"#f9fafb" };
  const step1Valid = form.bank && form.name.trim();

  return (
    <div style={{ padding:"28px 0 40px", position:"relative" }}>

      {/* ── Backdrop ── */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:100, backdropFilter:"blur(2px)" }}/>
      )}

      {/* ── Page header ── */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6 }}>
        <div>
          <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0, letterSpacing:"-0.3px" }}>Audit Templates</h4>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:4 }}>
            Audit Questions &rsaquo; <span style={{ color:"#2563eb", fontWeight:600 }}>Audit Templates</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
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
          <button
            onClick={() => { setShowForm(true); setStep(1); setForm({ ...EMPTY_FORM }); setQSearch(""); setQSection("All"); }}
            style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 18px", background:"#2563eb", color:"#fff", border:"none", borderRadius:9, fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 2px 8px rgba(37,99,235,0.35)" }}
          >
            <i className="ri-add-line"/>New Template
          </button>
        </div>
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
        <span style={{ fontSize:12, color:"#9ca3af" }}><strong style={{ color:"#374151" }}>{filtered.length}</strong> template{filtered.length!==1?"s":""}</span>
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
                            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
                              {t.circles.map(c => (
                                <span key={c} style={{ fontSize:10, fontWeight:600, color:"#374151", background:"#f3f4f6", borderRadius:5, padding:"2px 8px", border:"1px solid #e5e7eb" }}>
                                  <i className="ri-map-pin-line" style={{ marginRight:3, fontSize:9 }}/>{c}
                                </span>
                              ))}
                            </div>
                          )}
                          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
                            {t.sections.map(sec => {
                              const sc2 = SECTION_COLOR_MAP[sec.name] ?? { color:"#374151", bg:"#f3f4f6" };
                              return <span key={sec.name} style={{ fontSize:10, fontWeight:600, color:sc2.color, background:sc2.bg, borderRadius:5, padding:"2px 8px" }}>{sec.name}</span>;
                            })}
                          </div>
                          <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                            <div style={{ fontSize:11, color:"#9ca3af" }}>{t.lastUsed ? <>Last used <strong style={{ color:"#374151" }}>{t.lastUsed}</strong></> : <span style={{ color:"#d1d5db" }}>Never used</span>}</div>
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
                  {["","Template","Bank","Version","Sections","Questions","Used","Last Used","Status","Actions"].map((h,i) => (
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
                        <td style={{ padding:"12px 16px", textAlign:"center", fontSize:12, color:"#6b7280", verticalAlign:"middle" }}>{t.lastUsed||"—"}</td>
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

      {/* ═══════════════════════════════════════════════════════════════════════
          NEW TEMPLATE DRAWER
      ═══════════════════════════════════════════════════════════════════════ */}
      {showForm && (
        <div ref={drawerRef} style={{
          position:"fixed", top:0, right:0, bottom:0, width:760,
          background:"#fff", zIndex:200, boxShadow:"-8px 0 40px rgba(0,0,0,0.18)",
          display:"flex", flexDirection:"column", borderRadius:"16px 0 0 16px", overflow:"hidden",
        }}>

          {/* Drawer header */}
          <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #f3f4f6", background: step===2 ? "#fafafa" : "#fff", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:"#111827", letterSpacing:"-0.2px" }}>New Audit Template</div>
                <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>
                  {step===1 ? "Configure template details and select bank" : "Select questions for this template"}
                </div>
              </div>
              <button onClick={()=>setShowForm(false)} style={{ width:32, height:32, borderRadius:8, border:"1px solid #e5e7eb", background:"#f9fafb", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280" }}>
                <i className="ri-close-line" style={{ fontSize:16 }}/>
              </button>
            </div>

            {/* Step indicators */}
            <div style={{ display:"flex", alignItems:"center", gap:0 }}>
              {[{n:1,label:"Template Details"},{n:2,label:"Select Questions"}].map((s,i) => (
                <React.Fragment key={s.n}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{
                      width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:11, fontWeight:800,
                      background: step>s.n ? "#15803d" : step===s.n ? "#2563eb" : "#f3f4f6",
                      color:      step>s.n ? "#fff"    : step===s.n ? "#fff"    : "#9ca3af",
                    }}>
                      {step>s.n ? <i className="ri-check-line" style={{ fontSize:12 }}/> : s.n}
                    </div>
                    <span style={{ fontSize:12, fontWeight:600, color: step===s.n ? "#111827" : step>s.n ? "#15803d" : "#9ca3af" }}>{s.label}</span>
                  </div>
                  {i===0 && <div style={{ flex:1, height:2, background: step>1 ? "#15803d" : "#e5e7eb", margin:"0 10px", minWidth:30 }}/>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── STEP 1: Template Details ── */}
          {step===1 && (
            <div style={{ flex:1, overflowY:"auto", padding:"24px 24px" }}>

              {/* Bank */}
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#374151", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                  Bank <span style={{ color:"#dc2626" }}>*</span>
                </label>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                  {BANK_LIST.map(b => {
                    const code = BANK_CODE[b] ?? "";
                    const bac  = BANK_ACCENT[code] ?? { accent:"#374151", lightBg:"#f9fafb" };
                    const isSel = form.bank===b;
                    return (
                      <button key={b} onClick={()=>setForm(f=>({...f, bank:b, circles:[]}))} style={{
                        padding:"12px 14px", borderRadius:10, cursor:"pointer", textAlign:"left",
                        border: isSel ? `2px solid ${bac.accent}` : "1.5px solid #e5e7eb",
                        background: isSel ? bac.lightBg : "#fff",
                        transition:"all 0.15s",
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                          <div style={{ width:30, height:30, borderRadius:7, background:bac.accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <span style={{ fontSize:8, fontWeight:800, color:"#fff", letterSpacing:"0.05em" }}>{code}</span>
                          </div>
                          {isSel && <i className="ri-check-circle-fill" style={{ color:bac.accent, marginLeft:"auto", fontSize:16 }}/>}
                        </div>
                        <div style={{ fontSize:12, fontWeight:700, color: isSel ? bac.accent : "#111827", lineHeight:1.3 }}>{b}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Circles — only show when bank is selected */}
              {form.bank && (
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#374151", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                    Mapped Circle(s)
                    <span style={{ fontSize:10, fontWeight:500, color:"#9ca3af", textTransform:"none", marginLeft:8 }}>Select one or more</span>
                  </label>
                  <div style={{ background:ba.lightBg, borderRadius:10, border:`1.5px solid ${ba.accent}25`, padding:"12px 14px" }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      {(BANK_CIRCLES[form.bank]??[]).map(circle => {
                        const isSel = form.circles.includes(circle);
                        return (
                          <button key={circle} onClick={()=>setForm(f=>({ ...f, circles: isSel ? f.circles.filter(c=>c!==circle) : [...f.circles, circle] }))} style={{
                            padding:"6px 14px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600,
                            border: isSel ? `2px solid ${ba.accent}` : "1.5px solid #d1d5db",
                            background: isSel ? ba.accent : "#fff",
                            color: isSel ? "#fff" : "#6b7280",
                            display:"flex", alignItems:"center", gap:5, transition:"all 0.15s",
                          }}>
                            {isSel && <i className="ri-check-line" style={{ fontSize:11 }}/>}
                            <i className="ri-map-pin-line" style={{ fontSize:11 }}/>{circle}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Template Name */}
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#374151", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                  Audit Template Name <span style={{ color:"#dc2626" }}>*</span>
                </label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. SBI Urban Branch Electrical Audit 2025"
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:9, padding:"10px 14px", fontSize:14, fontWeight:500, color:"#111827", outline:"none", boxSizing:"border-box" as const, transition:"border-color 0.15s" }}
                  onFocus={e=>e.currentTarget.style.borderColor="#2563eb"} onBlur={e=>e.currentTarget.style.borderColor="#e5e7eb"}/>
              </div>

              {/* Description */}
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#374151", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.04em" }}>Description</label>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3}
                  placeholder="Brief description of this audit template's scope and purpose…"
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:9, padding:"10px 14px", fontSize:13, color:"#374151", outline:"none", resize:"vertical", boxSizing:"border-box" as const, lineHeight:1.5, transition:"border-color 0.15s" }}
                  onFocus={e=>e.currentTarget.style.borderColor="#2563eb"} onBlur={e=>e.currentTarget.style.borderColor="#e5e7eb"}/>
              </div>

              {/* Status */}
              <div style={{ marginBottom:8 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#374151", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.04em" }}>Save as</label>
                <div style={{ display:"flex", gap:10 }}>
                  {(["Draft","Active"] as const).map(s => {
                    const sc=STATUS_CFG[s];
                    const isSel=form.status===s;
                    return (
                      <button key={s} onClick={()=>setForm(f=>({...f,status:s}))} style={{
                        padding:"8px 20px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700,
                        border: isSel ? `2px solid ${sc.color}` : "1.5px solid #e5e7eb",
                        background: isSel ? sc.bg : "#fff",
                        color: isSel ? sc.color : "#9ca3af",
                        display:"flex", alignItems:"center", gap:6,
                      }}>
                        <span style={{ width:7, height:7, borderRadius:"50%", background: isSel ? sc.dot : "#d1d5db", display:"inline-block" }}/>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Question Picker ── */}
          {step===2 && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

              {/* Question picker toolbar */}
              <div style={{ padding:"14px 24px 0", borderBottom:"1px solid #f3f4f6", background:"#fafafa", flexShrink:0 }}>
                {/* Search + count */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:9, padding:"7px 12px", flex:1 }}>
                    <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:13, flexShrink:0 }}/>
                    <input value={qSearch} onChange={e=>setQSearch(e.target.value)} placeholder="Search questions…"
                      style={{ border:"none", outline:"none", fontSize:13, color:"#374151", background:"transparent", width:"100%" }}/>
                    {qSearch && <button onClick={()=>setQSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:14 }}>×</button>}
                  </div>
                  <div style={{ padding:"6px 14px", borderRadius:20, background:"#2563eb", color:"#fff", fontSize:12, fontWeight:700, whiteSpace:"nowrap" as const, flexShrink:0 }}>
                    {form.selectedQIds.length} selected
                  </div>
                </div>

                {/* Section filter pills */}
                <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:12 }}>
                  {["All",...SECTION_ORDER].map(s => {
                    const cfg = s==="All" ? null : SECTION_CFG[s];
                    const isSel = qSection===s;
                    const cnt = s==="All" ? ALL_QUESTIONS.length : ALL_QUESTIONS.filter(q=>q.section===s).length;
                    return (
                      <button key={s} onClick={()=>setQSection(s)} style={{
                        padding:"5px 12px", borderRadius:20, border:"1.5px solid", flexShrink:0, cursor:"pointer", fontSize:11, fontWeight:700,
                        borderColor: isSel ? (cfg?.color ?? "#2563eb") : "#e5e7eb",
                        background:  isSel ? (cfg?.bg  ?? "#eff6ff")   : "#fff",
                        color:       isSel ? (cfg?.color ?? "#2563eb") : "#9ca3af",
                        display:"flex", alignItems:"center", gap:5,
                      }}>
                        {cfg && <i className={cfg.icon} style={{ fontSize:11 }}/>}
                        {s} <span style={{ fontSize:10, opacity:0.7 }}>({cnt})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question list */}
              <div style={{ flex:1, overflowY:"auto", padding:"12px 24px 20px" }}>
                {groupedQs.length===0 ? (
                  <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}>
                    <i className="ri-question-line" style={{ fontSize:36, display:"block", marginBottom:8, opacity:0.3 }}/>
                    No questions match your search
                  </div>
                ) : groupedQs.map(({ section, qs }) => {
                  const cfg = SECTION_CFG[section] ?? { color:"#374151", bg:"#f3f4f6", border:"#e5e7eb", icon:"ri-list-check" };
                  const sectionIds = qs.map(q=>q.id);
                  const selCount = sectionIds.filter(id=>form.selectedQIds.includes(id)).length;
                  const allSel = selCount===sectionIds.length;
                  return (
                    <div key={section} style={{ marginBottom:20 }}>
                      {/* Section header */}
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, padding:"8px 12px", borderRadius:9, background:cfg.bg, border:`1px solid ${cfg.border}` }}>
                        <i className={cfg.icon} style={{ fontSize:15, color:cfg.color, flexShrink:0 }}/>
                        <span style={{ fontSize:12, fontWeight:700, color:cfg.color, flex:1 }}>{section}</span>
                        <span style={{ fontSize:11, color:cfg.color, opacity:0.7 }}>{selCount}/{qs.length} selected</span>
                        <button onClick={()=>toggleSection(section)} style={{
                          padding:"3px 10px", borderRadius:6, border:"none", cursor:"pointer", fontSize:11, fontWeight:700,
                          background: allSel ? cfg.color : "rgba(255,255,255,0.8)",
                          color: allSel ? "#fff" : cfg.color,
                        }}>
                          {allSel ? "Deselect all" : "Select all"}
                        </button>
                      </div>

                      {/* Questions */}
                      <div style={{ display:"flex", flexDirection:"column", gap:6, paddingLeft:4 }}>
                        {qs.map(q => {
                          const isSel = form.selectedQIds.includes(q.id);
                          const risk  = RISK_CFG[q.riskLevel];
                          return (
                            <div key={q.id} onClick={()=>toggleQ(q.id)} style={{
                              display:"flex", alignItems:"flex-start", gap:12, padding:"10px 14px",
                              borderRadius:9, cursor:"pointer", transition:"all 0.12s",
                              border: isSel ? `1.5px solid ${cfg.color}` : "1.5px solid #e5e7eb",
                              background: isSel ? cfg.bg : "#fff",
                            }}
                              onMouseEnter={e=>{ if(!isSel) (e.currentTarget as HTMLDivElement).style.background="#f9fafb"; }}
                              onMouseLeave={e=>{ if(!isSel) (e.currentTarget as HTMLDivElement).style.background="#fff"; }}
                            >
                              {/* Checkbox */}
                              <div style={{
                                width:18, height:18, borderRadius:5, flexShrink:0, marginTop:1,
                                border: isSel ? `2px solid ${cfg.color}` : "2px solid #d1d5db",
                                background: isSel ? cfg.color : "#fff",
                                display:"flex", alignItems:"center", justifyContent:"center",
                              }}>
                                {isSel && <i className="ri-check-line" style={{ fontSize:11, color:"#fff" }}/>}
                              </div>

                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                                  <span style={{ fontSize:10, fontWeight:800, color:cfg.color, fontFamily:"monospace" }}>{q.code}</span>
                                  <span style={{ fontSize:9, fontWeight:700, color:risk.color, background:risk.bg, borderRadius:4, padding:"1px 6px" }}>{q.riskLevel}</span>
                                </div>
                                <div style={{ fontSize:12, color: isSel ? "#111827" : "#374151", lineHeight:1.45, fontWeight: isSel ? 500 : 400 }}>
                                  {q.textEn}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Drawer footer */}
          <div style={{ padding:"14px 24px", borderTop:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", flexShrink:0, boxShadow:"0 -4px 12px rgba(0,0,0,0.05)" }}>
            {step===1 ? (
              <>
                <button onClick={()=>setShowForm(false)} style={{ padding:"9px 20px", border:"1.5px solid #e5e7eb", borderRadius:9, background:"#fff", color:"#6b7280", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
                <button onClick={()=>step1Valid && setStep(2)} disabled={!step1Valid} style={{
                  padding:"9px 24px", border:"none", borderRadius:9, fontSize:13, fontWeight:700, cursor:step1Valid?"pointer":"not-allowed",
                  background:step1Valid?"#2563eb":"#e5e7eb", color:step1Valid?"#fff":"#9ca3af",
                  display:"flex", alignItems:"center", gap:6, boxShadow:step1Valid?"0 2px 8px rgba(37,99,235,0.3)":"none",
                }}>
                  Next: Select Questions <i className="ri-arrow-right-line"/>
                </button>
              </>
            ) : (
              <>
                <button onClick={()=>setStep(1)} style={{ padding:"9px 20px", border:"1.5px solid #e5e7eb", borderRadius:9, background:"#fff", color:"#6b7280", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                  <i className="ri-arrow-left-line"/>Back
                </button>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:12, color:"#9ca3af" }}>
                    {form.selectedQIds.length>0 ? <><strong style={{ color:"#2563eb" }}>{form.selectedQIds.length}</strong> question{form.selectedQIds.length!==1?"s":""} selected</> : "Select at least 1 question"}
                  </span>
                  <button onClick={handleSaveTemplate} disabled={form.selectedQIds.length===0} style={{
                    padding:"9px 24px", border:"none", borderRadius:9, fontSize:13, fontWeight:700,
                    cursor:form.selectedQIds.length>0?"pointer":"not-allowed",
                    background:form.selectedQIds.length>0?"#15803d":"#e5e7eb",
                    color:form.selectedQIds.length>0?"#fff":"#9ca3af",
                    display:"flex", alignItems:"center", gap:6,
                    boxShadow:form.selectedQIds.length>0?"0 2px 8px rgba(21,128,61,0.3)":"none",
                  }}>
                    <i className="ri-save-line"/>Save Template
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
