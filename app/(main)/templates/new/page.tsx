"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
interface Question { id: string; code: string; section: string; textEn: string; riskLevel: "HIGH" | "MEDIUM" | "LOW" }

const ALL_QUESTIONS: Question[] = [
  { id:"q001", code:"Q-001", section:"General", textEn:"Whether MCCBs/MCBs/ELCBs are provided with proper rating to cater the load", riskLevel:"HIGH" },
  { id:"q002", code:"Q-002", section:"General", textEn:"Whether light and emergency light are provided in electrical rooms/operating areas", riskLevel:"HIGH" },
  { id:"q003", code:"Q-003", section:"General", textEn:"Whether Pump room, DG set room, UPS room, electrical room etc. are maintained dry and in good condition", riskLevel:"HIGH" },
  { id:"q004", code:"Q-004", section:"General", textEn:"Whether water seepage is observed near any of the Electrical Panel, Distribution Boards, Electrical equipment etc.", riskLevel:"HIGH" },
  { id:"q005", code:"Q-005", section:"General", textEn:"Whether Earthing pits are provided and connected to the equipment body", riskLevel:"HIGH" },
  { id:"q006", code:"Q-006", section:"General", textEn:"Whether the Earthing Pits are properly maintained", riskLevel:"HIGH" },
  { id:"q007", code:"Q-007", section:"General", textEn:"Whether proper exhaust fan for ventilation of panel room/electrical room/UPS room is provided", riskLevel:"MEDIUM" },
  { id:"q008", code:"Q-008", section:"General", textEn:"Whether penalty is being imposed in electricity bills on account of higher load/poor power factor", riskLevel:"MEDIUM" },
  { id:"q009", code:"Q-009", section:"General", textEn:"Additional electrical load required if any (from Power Distribution Company)", riskLevel:"LOW" },
  { id:"q010", code:"Q-010", section:"General", textEn:"Whether load is distributed in all 3 phases to avoid unbalancing of phases", riskLevel:"HIGH" },
  { id:"q011", code:"Q-011", section:"General", textEn:"Whether isolating switches are provided for switching off non-essential loads during night", riskLevel:"MEDIUM" },
  { id:"q012", code:"Q-012", section:"General", textEn:"Whether electrical equipments of Pantry etc. are properly connected to Iron socket box with MCBs", riskLevel:"MEDIUM" },
  { id:"q013", code:"Q-013", section:"General", textEn:"Whether proper preventive maintenance of Panel boards and Distribution Boards is carried out by licensed electricians", riskLevel:"HIGH" },
  { id:"q014", code:"Q-014", section:"General", textEn:"Whether appropriate timers used in changeover of Air conditioners for Server Room ACs and Signage Boards", riskLevel:"MEDIUM" },
  { id:"q015", code:"Q-015", section:"General", textEn:"Whether preventive maintenance of electric installation and equipment is carried out by skilled license holder electricians", riskLevel:"HIGH" },
  { id:"q016", code:"Q-016", section:"General", textEn:"General condition of electrical control panels, Main switch, electric meter board and changeover switch is good", riskLevel:"HIGH" },
  { id:"q017", code:"Q-017", section:"General", textEn:"Whether contact numbers of electricians, power distribution company, Generator/UPS/AC vendors are displayed", riskLevel:"LOW" },
  { id:"q018", code:"Q-018", section:"General", textEn:"Whether the Power Factor (PF) panel of appropriate rating is installed", riskLevel:"MEDIUM" },
  { id:"q019", code:"Q-019", section:"Fire Prevention Measures", textEn:"All old disposable records, broken furniture etc. accumulated at the premises have been cleared", riskLevel:"HIGH" },
  { id:"q020", code:"Q-020", section:"Fire Prevention Measures", textEn:"Combustible leaf, litter/waste papers in and around the branch are removed/cleaned periodically", riskLevel:"HIGH" },
  { id:"q021", code:"Q-021", section:"Fire Prevention Measures", textEn:"No stationery/Records/old obsolete items are stored in the system/UPS room", riskLevel:"HIGH" },
  { id:"q022", code:"Q-022", section:"Fire Prevention Measures", textEn:"Storage racks in Stationery/Record room are at safe distance of at least 3 ft from electrical points", riskLevel:"HIGH" },
  { id:"q023", code:"Q-023", section:"Fire Prevention Measures", textEn:"In the pantry/canteen LPG is used", riskLevel:"MEDIUM" },
  { id:"q024", code:"Q-024", section:"Server and UPS Room", textEn:"Server room has dual AC units having timer circuit device with independent circuit", riskLevel:"HIGH" },
  { id:"q025", code:"Q-025", section:"Server and UPS Room", textEn:"Whether metal body exhaust fan is installed in UPS room", riskLevel:"MEDIUM" },
  { id:"q026", code:"Q-026", section:"Server and UPS Room", textEn:"Whether all ceiling fans installed are of BLDC type", riskLevel:"LOW" },
  { id:"q027", code:"Q-027", section:"Electrical Safety", textEn:"Power supply to record/stationery room is made through plug and socket arrangement", riskLevel:"HIGH" },
  { id:"q028", code:"Q-028", section:"Electrical Safety", textEn:"Whether LED lights have been installed in all areas", riskLevel:"MEDIUM" },
  { id:"q029", code:"Q-029", section:"Electrical Safety", textEn:"Whether motion sensors/occupancy sensors have been installed", riskLevel:"MEDIUM" },
  { id:"q030", code:"Q-030", section:"Fire Protection", textEn:"Are fire extinguishers available in all required work areas, clearly marked and accessible?", riskLevel:"HIGH" },
  { id:"q031", code:"Q-031", section:"DG Set / Generator", textEn:"DG Set / Generator is installed at the branch/office", riskLevel:"HIGH" },
  { id:"q032", code:"Q-032", section:"DG Set / Generator", textEn:"At least two 6 Kg. ABC capacity fire extinguishers are placed near the diesel generator", riskLevel:"HIGH" },
  { id:"q033", code:"Q-033", section:"DG Set / Generator", textEn:"Electrical safety and energy saving awareness meeting with staff was conducted post audit", riskLevel:"MEDIUM" },
  { id:"q034", code:"Q-034", section:"Onsite ATM", textEn:"5 Kg ABC Automatic Modular Fire Extinguisher is provided and protected in the back room", riskLevel:"HIGH" },
  { id:"q035", code:"Q-035", section:"Onsite ATM", textEn:"ATM room is having fire detector connected through branch AFDS", riskLevel:"HIGH" },
  { id:"q036", code:"Q-036", section:"Onsite ATM", textEn:"Whether MCCB/MCB/ELCB are provided and apparently in working condition", riskLevel:"HIGH" },
  { id:"q037", code:"Q-037", section:"Onsite ATM", textEn:"AC units are provided with timer circuit device", riskLevel:"MEDIUM" },
  { id:"q038", code:"Q-038", section:"Onsite ATM", textEn:"Main supply switch/MCB to cut-off the electric supply of ATM has been marked", riskLevel:"HIGH" },
  { id:"q039", code:"Q-039", section:"Onsite ATM", textEn:"Power supply to AC, UPS and ATM machines is through metal clad plug receptacle socket", riskLevel:"HIGH" },
  { id:"q040", code:"Q-040", section:"Onsite ATM", textEn:"Electrical wires are properly covered/insulated to prevent exposure", riskLevel:"HIGH" },
  { id:"q041", code:"Q-041", section:"Onsite ATM", textEn:"Is there any cooking stove/electric heater coil stove noticed in the ATM", riskLevel:"HIGH" },
  { id:"q042", code:"Q-042", section:"Onsite ATM", textEn:"Is there any water accumulation/seepage in the premises or dripping on electrical gadgets", riskLevel:"HIGH" },
  { id:"q043", code:"Q-043", section:"Onsite ATM", textEn:"Any combustible container provided in the ATM", riskLevel:"HIGH" },
  { id:"q044", code:"Q-044", section:"Onsite ATM", textEn:"Steel dustbin container provided in the ATM", riskLevel:"MEDIUM" },
  { id:"q045", code:"Q-045", section:"Onsite ATM", textEn:"No smoking board is provided in the ATM cabin", riskLevel:"LOW" },
  { id:"q046", code:"Q-046", section:"Onsite ATM", textEn:"Main entrance shutter is in working condition", riskLevel:"MEDIUM" },
  { id:"q047", code:"Q-047", section:"Onsite ATM", textEn:"Proper locking arrangement is there at the main shutter", riskLevel:"HIGH" },
  { id:"q048", code:"Q-048", section:"Onsite ATM", textEn:"All electrical lights are in working condition", riskLevel:"MEDIUM" },
  { id:"q049", code:"Q-049", section:"Onsite ATM", textEn:"ATM is provided with external CCTV camera", riskLevel:"HIGH" },
  { id:"q050", code:"Q-050", section:"Onsite ATM", textEn:"CCTV is in working condition", riskLevel:"HIGH" },
];

const SECTION_ORDER = ["General","Fire Prevention Measures","Server and UPS Room","Electrical Safety","Fire Protection","DG Set / Generator","Onsite ATM"];

const SEC: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  "General":                 { color:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe", icon:"ri-flashlight-line" },
  "Fire Prevention Measures":{ color:"#dc2626", bg:"#fef2f2", border:"#fecaca", icon:"ri-fire-line" },
  "Server and UPS Room":     { color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe", icon:"ri-server-line" },
  "Electrical Safety":       { color:"#b45309", bg:"#fffbeb", border:"#fde68a", icon:"ri-plug-line" },
  "Fire Protection":         { color:"#c2410c", bg:"#fff7ed", border:"#fed7aa", icon:"ri-shield-flash-line" },
  "DG Set / Generator":      { color:"#065f46", bg:"#f0fdf4", border:"#bbf7d0", icon:"ri-battery-charge-line" },
  "Onsite ATM":              { color:"#0e7490", bg:"#ecfeff", border:"#a5f3fc", icon:"ri-bank-card-line" },
};

const RISK: Record<string, { color: string; bg: string }> = {
  HIGH:   { color:"#dc2626", bg:"#fee2e2" },
  MEDIUM: { color:"#b45309", bg:"#fef3c7" },
  LOW:    { color:"#15803d", bg:"#dcfce7" },
};

const BANK_CIRCLES: Record<string, string[]> = {
  "State Bank of India":  ["SBI Gujarat Circle","SBI MP Circle","SBI Rajasthan Circle","SBI Punjab Circle","SBI UP Circle"],
  "Bank of Baroda":       ["BOB Gujarat Circle","BOB Rajasthan Circle","BOB Maharashtra Circle"],
  "UCO Bank":             ["UCO East Circle","UCO North Circle"],
  "Punjab National Bank": ["PNB North Circle","PNB UP Circle","PNB Punjab Circle"],
  "Canara Bank":          ["Canara South Circle","Canara West Circle"],
  "Indian Bank":          ["Indian Bank South Circle","Indian Bank East Circle"],
};

const BANK_META: Record<string, { code: string; accent: string; light: string }> = {
  "State Bank of India":  { code:"SBI",  accent:"#1e3a5f", light:"#dbeafe" },
  "Bank of Baroda":       { code:"BOB",  accent:"#9a3412", light:"#ffedd5" },
  "UCO Bank":             { code:"UCO",  accent:"#1d4ed8", light:"#dbeafe" },
  "Punjab National Bank": { code:"PNB",  accent:"#6d28d9", light:"#ede9fe" },
  "Canara Bank":          { code:"CNRB", accent:"#065f46", light:"#d1fae5" },
  "Indian Bank":          { code:"IB",   accent:"#991b1b", light:"#fee2e2" },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function NewTemplatePage() {
  const router = useRouter();

  const [step,        setStep]       = useState<1|2>(1);
  const [bank,        setBank]       = useState("");
  const [circles,     setCircles]    = useState<string[]>([]);
  const [name,        setName]       = useState("");
  const [desc,        setDesc]       = useState("");
  const [saveAs,      setSaveAs]     = useState<"Draft"|"Active">("Draft");
  const [selIds,      setSelIds]     = useState<string[]>([]);
  const [qSearch,     setQSearch]    = useState("");
  const [secFilter,   setSecFilter]  = useState("All");
  const [circleOpen,  setCircleOpen] = useState(false);
  const [circleSearch,setCircleSearch]= useState("");
  const circleDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (circleDropRef.current && !circleDropRef.current.contains(e.target as Node))
        setCircleOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset circles + dropdown when bank changes
  const handleBankSelect = (b: string) => {
    setBank(b);
    setCircles([]);
    setCircleOpen(false);
    setCircleSearch("");
  };

  const bm = BANK_META[bank];

  const filteredCircles = useMemo(() => {
    const q = circleSearch.toLowerCase();
    return (BANK_CIRCLES[bank] ?? []).filter(c => !q || c.toLowerCase().includes(q));
  }, [bank, circleSearch]);

  const filteredQs = useMemo(() => {
    const q = qSearch.toLowerCase();
    return ALL_QUESTIONS.filter(qs =>
      (secFilter === "All" || qs.section === secFilter) &&
      (!q || qs.code.toLowerCase().includes(q) || qs.textEn.toLowerCase().includes(q))
    );
  }, [qSearch, secFilter]);

  const groupedQs = useMemo(() => {
    const map = new Map<string, Question[]>();
    filteredQs.forEach(q => { const a = map.get(q.section) ?? []; a.push(q); map.set(q.section, a); });
    return SECTION_ORDER.filter(s => map.has(s)).map(s => ({ section: s, qs: map.get(s)! }));
  }, [filteredQs]);

  const toggleQ = (id: string) =>
    setSelIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleSection = (section: string) => {
    const ids = ALL_QUESTIONS.filter(q => q.section === section).map(q => q.id);
    const allSel = ids.every(id => selIds.includes(id));
    setSelIds(prev => allSel ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]);
  };

  const step1Valid = bank && name.trim().length > 0;

  // Summary by section
  const summary = useMemo(() => {
    const map = new Map<string, number>();
    selIds.forEach(id => {
      const q = ALL_QUESTIONS.find(x => x.id === id);
      if (q) map.set(q.section, (map.get(q.section) ?? 0) + 1);
    });
    return map;
  }, [selIds]);

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", display:"flex", flexDirection:"column" }}>

      {/* ── Top bar ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"0 32px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => router.back()} style={{ width:32, height:32, borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280" }}>
            <i className="ri-arrow-left-line" style={{ fontSize:15 }}/>
          </button>
          <div style={{ width:1, height:20, background:"#e5e7eb" }}/>
          <div>
            <span style={{ fontSize:13, color:"#9ca3af" }}>Audit Templates</span>
            <span style={{ fontSize:13, color:"#9ca3af", margin:"0 6px" }}>/</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#111827" }}>New Template</span>
          </div>
        </div>

        {/* Progress steps */}
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {[{ n:1 as 1, label:"Template Details" },{ n:2 as 2, label:"Select Questions" }].map((s, i) => (
            <React.Fragment key={s.n}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{
                  width:24, height:24, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800,
                  background: step > s.n ? "#15803d" : step === s.n ? "#2563eb" : "#e5e7eb",
                  color:      step > s.n ? "#fff"    : step === s.n ? "#fff"    : "#9ca3af",
                }}>
                  {step > s.n ? <i className="ri-check-line" style={{ fontSize:11 }}/> : s.n}
                </div>
                <span style={{ fontSize:12, fontWeight:600, color: step === s.n ? "#111827" : step > s.n ? "#15803d" : "#9ca3af" }}>{s.label}</span>
              </div>
              {i === 0 && <div style={{ width:40, height:2, background: step > 1 ? "#15803d" : "#e5e7eb", margin:"0 4px" }}/>}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => router.back()} style={{ padding:"7px 16px", border:"1px solid #e5e7eb", borderRadius:8, background:"#fff", color:"#6b7280", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          {step === 1 ? (
            <button onClick={() => step1Valid && setStep(2)} disabled={!step1Valid} style={{ padding:"7px 18px", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:step1Valid?"pointer":"not-allowed", background:step1Valid?"#2563eb":"#e5e7eb", color:step1Valid?"#fff":"#9ca3af", display:"flex", alignItems:"center", gap:5 }}>
              Next <i className="ri-arrow-right-line"/>
            </button>
          ) : (
            <button onClick={() => router.back()} disabled={selIds.length === 0} style={{ padding:"7px 18px", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:selIds.length>0?"pointer":"not-allowed", background:selIds.length>0?"#15803d":"#e5e7eb", color:selIds.length>0?"#fff":"#9ca3af", display:"flex", alignItems:"center", gap:5 }}>
              <i className="ri-save-line"/> Save Template
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 1 — Template Details
      ══════════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div style={{ flex:1, display:"flex", justifyContent:"center", padding:"40px 24px 60px" }}>
          <div style={{ width:"100%", maxWidth:800 }}>

            {/* Page title */}
            <div style={{ marginBottom:36 }}>
              <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", margin:"0 0 6px", letterSpacing:"-0.4px" }}>Create Audit Template</h1>
              <p style={{ fontSize:13, color:"#6b7280", margin:0 }}>Define the template details, then select questions in the next step.</p>
            </div>

            {/* ── Bank selection ── */}
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"24px", marginBottom:20, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:4 }}>Select Bank <span style={{ color:"#dc2626" }}>*</span></div>
                <div style={{ fontSize:12, color:"#9ca3af" }}>Choose the bank this audit template is designed for</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {Object.keys(BANK_META).map(b => {
                  const m   = BANK_META[b];
                  const sel = bank === b;
                  return (
                    <button key={b} onClick={() => handleBankSelect(b)} style={{
                      padding:"14px 16px", borderRadius:11, cursor:"pointer", textAlign:"left",
                      border:      sel ? `2px solid ${m.accent}` : "1.5px solid #e5e7eb",
                      background:  sel ? m.light : "#fafafa",
                      transition:"all 0.15s", outline:"none",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                        <div style={{ width:36, height:36, borderRadius:9, background:m.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <span style={{ fontSize:9, fontWeight:800, color:"#fff", letterSpacing:"0.05em" }}>{m.code}</span>
                        </div>
                        {sel && (
                          <div style={{ width:20, height:20, borderRadius:"50%", background:m.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <i className="ri-check-line" style={{ fontSize:11, color:"#fff" }}/>
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color: sel ? m.accent : "#374151", lineHeight:1.3 }}>{b}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Circle selection — searchable dropdown (shows after bank picked) ── */}
            {bank && (
              <div style={{ background:"#fff", borderRadius:14, border:`1.5px solid ${bm!.accent}30`, padding:"24px", marginBottom:20, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:bm!.accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className="ri-map-2-line" style={{ fontSize:15, color:"#fff" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>Mapped Circle(s) <span style={{ fontSize:11, fontWeight:500, color:"#9ca3af" }}>Select one or more</span></div>
                    <div style={{ fontSize:12, color:"#9ca3af" }}>Circles covered by this template</div>
                  </div>
                </div>

                {/* Dropdown trigger */}
                <div ref={circleDropRef} style={{ position:"relative" }}>
                  <div
                    onClick={() => setCircleOpen(o => !o)}
                    style={{
                      minHeight:44, border:`1.5px solid ${circleOpen ? bm!.accent : "#e5e7eb"}`,
                      borderRadius:10, padding:"8px 12px", cursor:"pointer", background:"#fff",
                      display:"flex", alignItems:"flex-start", gap:8, flexWrap:"wrap",
                      transition:"border-color 0.15s", boxShadow: circleOpen ? `0 0 0 3px ${bm!.accent}15` : "none",
                    }}
                  >
                    {circles.length === 0 ? (
                      <span style={{ fontSize:13, color:"#9ca3af", lineHeight:"26px" }}>Search or select circle(s)…</span>
                    ) : (
                      circles.map(c => (
                        <span key={c} style={{
                          display:"inline-flex", alignItems:"center", gap:5,
                          background:bm!.accent, color:"#fff",
                          fontSize:11, fontWeight:600, borderRadius:6,
                          padding:"3px 10px 3px 8px",
                        }}>
                          <i className="ri-map-pin-2-fill" style={{ fontSize:10 }}/>
                          {c}
                          <button
                            onClick={e => { e.stopPropagation(); setCircles(prev => prev.filter(x => x !== c)); }}
                            style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.8)", padding:0, marginLeft:2, fontSize:13, lineHeight:1, display:"flex", alignItems:"center" }}
                          >×</button>
                        </span>
                      ))
                    )}
                    <i className={`ri-arrow-${circleOpen?"up":"down"}-s-line`} style={{ color:"#9ca3af", fontSize:16, marginLeft:"auto", alignSelf:"center", flexShrink:0 }}/>
                  </div>

                  {/* Dropdown panel */}
                  {circleOpen && (
                    <div style={{
                      position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:50,
                      background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:10,
                      boxShadow:"0 8px 24px rgba(0,0,0,0.12)", overflow:"hidden",
                    }}>
                      {/* Search input */}
                      <div style={{ padding:"10px 12px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", gap:8 }}>
                        <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:14, flexShrink:0 }}/>
                        <input
                          autoFocus
                          value={circleSearch}
                          onChange={e => setCircleSearch(e.target.value)}
                          placeholder="Search circles…"
                          onClick={e => e.stopPropagation()}
                          style={{ border:"none", outline:"none", fontSize:13, color:"#374151", background:"transparent", width:"100%", fontFamily:"inherit" }}
                        />
                        {circleSearch && (
                          <button onClick={e => { e.stopPropagation(); setCircleSearch(""); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:14 }}>×</button>
                        )}
                      </div>

                      {/* Group header */}
                      <div style={{ padding:"8px 14px 4px", fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", background:"#fafafa" }}>
                        {bm!.code} CIRCLES
                      </div>

                      {/* Circle list */}
                      <div style={{ maxHeight:220, overflowY:"auto" }}>
                        {filteredCircles.length === 0 ? (
                          <div style={{ padding:"16px 14px", fontSize:13, color:"#9ca3af", textAlign:"center" }}>No circles match</div>
                        ) : filteredCircles.map(c => {
                          const isSel = circles.includes(c);
                          return (
                            <div
                              key={c}
                              onClick={e => {
                                e.stopPropagation();
                                setCircles(prev => isSel ? prev.filter(x => x !== c) : [...prev, c]);
                              }}
                              style={{
                                padding:"11px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:12,
                                background: isSel ? `${bm!.accent}08` : "#fff",
                                borderLeft: isSel ? `3px solid ${bm!.accent}` : "3px solid transparent",
                                transition:"all 0.1s",
                              }}
                              onMouseEnter={e => { if(!isSel)(e.currentTarget as HTMLDivElement).style.background="#f9fafb"; }}
                              onMouseLeave={e => { if(!isSel)(e.currentTarget as HTMLDivElement).style.background="#fff"; }}
                            >
                              {/* Checkbox */}
                              <div style={{
                                width:18, height:18, borderRadius:5, flexShrink:0,
                                border:     isSel ? `2px solid ${bm!.accent}` : "2px solid #d1d5db",
                                background: isSel ? bm!.accent : "#fff",
                                display:"flex", alignItems:"center", justifyContent:"center",
                                transition:"all 0.1s",
                              }}>
                                {isSel && <i className="ri-check-line" style={{ fontSize:11, color:"#fff" }}/>}
                              </div>
                              <i className="ri-map-pin-line" style={{ fontSize:14, color: isSel ? bm!.accent : "#9ca3af", flexShrink:0 }}/>
                              <span style={{ fontSize:13, fontWeight: isSel ? 600 : 400, color: isSel ? bm!.accent : "#374151", flex:1 }}>{c}</span>
                              {isSel && <i className="ri-checkbox-circle-fill" style={{ fontSize:15, color:bm!.accent, flexShrink:0 }}/>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      {circles.length > 0 && (
                        <div style={{ padding:"8px 14px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafafa" }}>
                          <span style={{ fontSize:11, color:"#6b7280" }}><strong style={{ color:bm!.accent }}>{circles.length}</strong> circle{circles.length !== 1 ? "s" : ""} selected</span>
                          <button onClick={e => { e.stopPropagation(); setCircles([]); }} style={{ fontSize:11, fontWeight:600, color:"#dc2626", background:"none", border:"none", cursor:"pointer", padding:0 }}>Clear all</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Template name + description ── */}
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"24px", marginBottom:20, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:4 }}>Template Details</div>
                <div style={{ fontSize:12, color:"#9ca3af" }}>Give this template a clear, descriptive name</div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                  Audit Template Name <span style={{ color:"#dc2626" }}>*</span>
                </label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. SBI Urban Branch Electrical Safety Audit 2025"
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:9, padding:"11px 14px", fontSize:14, fontWeight:500, color:"#111827", outline:"none", boxSizing:"border-box" as const, transition:"border-color 0.15s" }}
                  onFocus={e => e.currentTarget.style.borderColor="#2563eb"}
                  onBlur={e  => e.currentTarget.style.borderColor="#e5e7eb"}/>
                {name.trim().length > 0 && (
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:5 }}>Template ID will be auto-generated on save</div>
                )}
              </div>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.04em" }}>Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                  placeholder="Brief description of scope, applicable branch types, regulatory basis…"
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:9, padding:"11px 14px", fontSize:13, color:"#374151", outline:"none", resize:"vertical", boxSizing:"border-box" as const, lineHeight:1.6, transition:"border-color 0.15s", fontFamily:"inherit" }}
                  onFocus={e => e.currentTarget.style.borderColor="#2563eb"}
                  onBlur={e  => e.currentTarget.style.borderColor="#e5e7eb"}/>
              </div>
            </div>

            {/* ── Save as ── */}
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"24px", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:4 }}>Save as</div>
              <div style={{ fontSize:12, color:"#9ca3af", marginBottom:16 }}>Draft templates are not available for audit assignments until activated</div>
              <div style={{ display:"flex", gap:12 }}>
                {([
                  { v:"Draft"  as const, icon:"ri-draft-line",           color:"#b45309", bg:"#fffbeb", border:"#fcd34d", desc:"Save privately, activate later" },
                  { v:"Active" as const, icon:"ri-checkbox-circle-line", color:"#15803d", bg:"#f0fdf4", border:"#86efac", desc:"Immediately available for assignment" },
                ] as const).map(opt => {
                  const isSel = saveAs === opt.v;
                  return (
                    <button key={opt.v} onClick={() => setSaveAs(opt.v)} style={{
                      flex:1, padding:"14px 18px", borderRadius:11, cursor:"pointer", textAlign:"left",
                      border:     isSel ? `2px solid ${opt.color}` : "1.5px solid #e5e7eb",
                      background: isSel ? opt.bg : "#fafafa",
                      transition:"all 0.15s",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                        <i className={opt.icon} style={{ fontSize:20, color: isSel ? opt.color : "#9ca3af" }}/>
                        {isSel && <i className="ri-check-circle-fill" style={{ color:opt.color, fontSize:18 }}/>}
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color: isSel ? opt.color : "#374151", marginBottom:3 }}>{opt.v}</div>
                      <div style={{ fontSize:11, color: isSel ? opt.color : "#9ca3af", opacity: isSel ? 0.8 : 1 }}>{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continue CTA */}
            <div style={{ marginTop:28, display:"flex", justifyContent:"flex-end" }}>
              <button onClick={() => step1Valid && setStep(2)} disabled={!step1Valid} style={{
                padding:"11px 28px", border:"none", borderRadius:10, fontSize:14, fontWeight:700,
                cursor:step1Valid?"pointer":"not-allowed",
                background:step1Valid?"#2563eb":"#e5e7eb",
                color:step1Valid?"#fff":"#9ca3af",
                display:"flex", alignItems:"center", gap:8,
                boxShadow:step1Valid?"0 4px 14px rgba(37,99,235,0.35)":"none",
                transition:"all 0.2s",
              }}>
                Continue to Question Selection <i className="ri-arrow-right-line"/>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 2 — Select Questions
      ══════════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div style={{ flex:1, display:"flex", overflow:"hidden", height:"calc(100vh - 56px)" }}>

          {/* ── LEFT: Filters + Summary ── */}
          <div style={{ width:256, borderRight:"1px solid #e5e7eb", background:"#fff", display:"flex", flexDirection:"column", flexShrink:0 }}>

            {/* Bank badge */}
            {bm && (
              <div style={{ padding:"16px 18px", borderBottom:"1px solid #f3f4f6" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:bm.light, borderRadius:10, border:`1px solid ${bm.accent}30` }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:bm.accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:8, fontWeight:800, color:"#fff" }}>{bm.code}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:bm.accent }}>{bank}</div>
                    <div style={{ fontSize:10, color:"#9ca3af" }}>{name}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Section filters */}
            <div style={{ padding:"14px 12px", borderBottom:"1px solid #f3f4f6", flex:1, overflowY:"auto" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10, paddingLeft:6 }}>Filter by Section</div>
              {["All", ...SECTION_ORDER].map(s => {
                const cfg = s === "All" ? null : SEC[s];
                const total = s === "All" ? ALL_QUESTIONS.length : ALL_QUESTIONS.filter(q => q.section === s).length;
                const selCnt = s === "All" ? selIds.length : selIds.filter(id => ALL_QUESTIONS.find(q => q.id === id && q.section === s)).length;
                const isSel = secFilter === s;
                return (
                  <button key={s} onClick={() => setSecFilter(s)} style={{
                    width:"100%", padding:"8px 10px", borderRadius:8, border:"none", cursor:"pointer", textAlign:"left",
                    background: isSel ? (cfg?.bg ?? "#eff6ff") : "transparent",
                    display:"flex", alignItems:"center", gap:9, marginBottom:2,
                    transition:"background 0.12s",
                  }}>
                    <div style={{ width:26, height:26, borderRadius:7, background: isSel ? (cfg?.color ?? "#2563eb") : "#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className={cfg?.icon ?? "ri-list-check"} style={{ fontSize:13, color: isSel ? "#fff" : "#9ca3af" }}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:600, color: isSel ? (cfg?.color ?? "#2563eb") : "#374151", whiteSpace:"nowrap" as const, overflow:"hidden", textOverflow:"ellipsis" }}>{s}</div>
                      <div style={{ fontSize:10, color:"#9ca3af" }}>{selCnt}/{total} selected</div>
                    </div>
                    {selCnt > 0 && (
                      <div style={{ width:18, height:18, borderRadius:"50%", background: cfg?.color ?? "#2563eb", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <span style={{ fontSize:9, fontWeight:800, color:"#fff" }}>{selCnt}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            <div style={{ padding:"14px 16px", borderTop:"1px solid #e5e7eb", background:"#f9fafb" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Selected Questions</div>
              {summary.size === 0 ? (
                <div style={{ fontSize:12, color:"#d1d5db", textAlign:"center", padding:"8px 0" }}>None yet</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {SECTION_ORDER.filter(s => (summary.get(s) ?? 0) > 0).map(s => {
                    const cfg = SEC[s] ?? { color:"#374151", bg:"#f3f4f6" };
                    return (
                      <div key={s} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:11, color:cfg.color, fontWeight:600 }}>{s.split(" ").slice(0,2).join(" ")}</span>
                        <span style={{ fontSize:11, fontWeight:800, color:cfg.color, background:cfg.bg, borderRadius:5, padding:"1px 7px" }}>{summary.get(s)}</span>
                      </div>
                    );
                  })}
                  <div style={{ borderTop:"1px solid #e5e7eb", marginTop:6, paddingTop:6, display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#374151" }}>Total</span>
                    <span style={{ fontSize:14, fontWeight:800, color:"#2563eb" }}>{selIds.length}</span>
                  </div>
                </div>
              )}

              <button onClick={() => {
                // Build and "save"
                if (selIds.length === 0) return;
                alert(`Template "${name}" saved with ${selIds.length} questions.`);
                router.back();
              }} disabled={selIds.length === 0} style={{
                width:"100%", marginTop:14, padding:"10px 0", border:"none", borderRadius:9, fontSize:13, fontWeight:700,
                cursor:selIds.length > 0 ? "pointer" : "not-allowed",
                background:selIds.length > 0 ? "#15803d" : "#e5e7eb",
                color:selIds.length > 0 ? "#fff" : "#9ca3af",
                boxShadow:selIds.length > 0 ? "0 2px 8px rgba(21,128,61,0.35)" : "none",
                display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              }}>
                <i className="ri-save-line"/>Save Template
              </button>
            </div>
          </div>

          {/* ── RIGHT: Question list ── */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

            {/* Search bar */}
            <div style={{ padding:"14px 24px", borderBottom:"1px solid #e5e7eb", background:"#fff", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:9, padding:"8px 14px", flex:1 }}>
                  <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:14, flexShrink:0 }}/>
                  <input value={qSearch} onChange={e => setQSearch(e.target.value)} placeholder="Search questions by code or keyword…"
                    style={{ border:"none", outline:"none", fontSize:13, color:"#374151", background:"transparent", width:"100%" }}/>
                  {qSearch && <button onClick={() => setQSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:15 }}>×</button>}
                </div>
                <div style={{ fontSize:12, color:"#9ca3af", whiteSpace:"nowrap" as const }}>
                  Showing <strong style={{ color:"#374151" }}>{filteredQs.length}</strong> questions
                </div>
              </div>
            </div>

            {/* Questions */}
            <div style={{ flex:1, overflowY:"auto", padding:"20px 24px 40px" }}>
              {groupedQs.length === 0 ? (
                <div style={{ textAlign:"center", padding:"80px 0", color:"#9ca3af" }}>
                  <i className="ri-search-line" style={{ fontSize:40, display:"block", marginBottom:12, opacity:0.3 }}/>
                  <div style={{ fontSize:14, fontWeight:600 }}>No questions match</div>
                  <div style={{ fontSize:12, marginTop:4 }}>Try a different keyword</div>
                </div>
              ) : groupedQs.map(({ section, qs }) => {
                const cfg    = SEC[section] ?? { color:"#374151", bg:"#f3f4f6", border:"#e5e7eb", icon:"ri-list-check" };
                const secIds = qs.map(q => q.id);
                const selCnt = secIds.filter(id => selIds.includes(id)).length;
                const allSel = selCnt === secIds.length;
                return (
                  <div key={section} style={{ marginBottom:28 }}>
                    {/* Section header */}
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12, padding:"10px 16px", background:cfg.bg, borderRadius:10, border:`1px solid ${cfg.border}`, position:"sticky", top:0, zIndex:1 }}>
                      <i className={cfg.icon} style={{ fontSize:16, color:cfg.color, flexShrink:0 }}/>
                      <span style={{ fontSize:13, fontWeight:700, color:cfg.color, flex:1 }}>{section}</span>
                      <span style={{ fontSize:12, color:cfg.color, opacity:0.7 }}>{selCnt} of {qs.length} selected</span>
                      <button onClick={() => toggleSection(section)} style={{
                        padding:"4px 12px", borderRadius:6, border:`1.5px solid ${cfg.color}`, cursor:"pointer", fontSize:11, fontWeight:700,
                        background: allSel ? cfg.color : "transparent",
                        color:      allSel ? "#fff"    : cfg.color,
                        transition:"all 0.15s",
                      }}>
                        {allSel ? "Deselect All" : "Select All"}
                      </button>
                    </div>

                    {/* Question rows */}
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {qs.map(q => {
                        const isSel = selIds.includes(q.id);
                        const risk  = RISK[q.riskLevel];
                        return (
                          <div key={q.id} onClick={() => toggleQ(q.id)} style={{
                            display:"flex", alignItems:"flex-start", gap:14, padding:"12px 16px",
                            borderRadius:10, cursor:"pointer",
                            border:      isSel ? `1.5px solid ${cfg.color}` : "1.5px solid #e5e7eb",
                            background:  isSel ? cfg.bg : "#fff",
                            transition:"all 0.12s",
                            boxShadow: isSel ? `0 0 0 3px ${cfg.color}15` : "none",
                          }}
                            onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLDivElement).style.borderColor="#d1d5db"; }}
                            onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLDivElement).style.borderColor="#e5e7eb"; }}
                          >
                            {/* Custom checkbox */}
                            <div style={{
                              width:20, height:20, borderRadius:6, flexShrink:0, marginTop:1,
                              border:     isSel ? `2px solid ${cfg.color}` : "2px solid #d1d5db",
                              background: isSel ? cfg.color : "#fff",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              transition:"all 0.12s",
                            }}>
                              {isSel && <i className="ri-check-line" style={{ fontSize:12, color:"#fff" }}/>}
                            </div>

                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                                <span style={{ fontSize:11, fontWeight:800, color:cfg.color, fontFamily:"monospace", background:`${cfg.color}15`, borderRadius:4, padding:"1px 6px" }}>{q.code}</span>
                                <span style={{ fontSize:10, fontWeight:700, color:risk.color, background:risk.bg, borderRadius:4, padding:"1px 7px" }}>{q.riskLevel}</span>
                              </div>
                              <div style={{ fontSize:13, color: isSel ? "#111827" : "#374151", lineHeight:1.5, fontWeight: isSel ? 500 : 400 }}>
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
        </div>
      )}
    </div>
  );
}
