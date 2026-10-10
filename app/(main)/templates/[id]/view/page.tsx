"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
type PhotoReq  = "Not Required" | "Always Required" | "Required if YES" | "Required if NO" | "Required if N/A";
type Status    = "Active" | "Draft" | "Archived";

interface ViewQuestion {
  uid: string; code: string;
  textEn: string; textHi: string;
  riskLevel: RiskLevel;
  isMandatory: boolean; allowRecommendation: boolean;
  photoReq: PhotoReq;
}
interface ViewSection  { id: string; name: string; collapsed: boolean; questions: ViewQuestion[] }
interface TemplateInfo { id: string; name: string; description: string; bank: string; bankCode: string; circle: string; version: string; status: Status; createdBy: string; createdOn: string; usedCount: number }

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const BANK_ACCENT: Record<string, { accent: string; light: string }> = {
  SBI:  { accent:"#1e3a5f", light:"#dbeafe" },
  BOB:  { accent:"#c2410c", light:"#fff7ed" },
  UCO:  { accent:"#1d4ed8", light:"#dbeafe" },
  PNB:  { accent:"#7c3aed", light:"#f5f3ff" },
  CNRB: { accent:"#065f46", light:"#d1fae5" },
  IB:   { accent:"#b91c1c", light:"#fee2e2" },
};

const STATUS_CFG: Record<Status, { color: string; bg: string; border: string; icon: string }> = {
  Active:   { color:"#15803d", bg:"#dcfce7", border:"#86efac", icon:"ri-checkbox-circle-fill" },
  Draft:    { color:"#b45309", bg:"#fef3c7", border:"#fcd34d", icon:"ri-draft-line"           },
  Archived: { color:"#6b7280", bg:"#f3f4f6", border:"#d1d5db", icon:"ri-archive-line"         },
};

const RISK_CFG: Record<RiskLevel, { color: string; bg: string }> = {
  HIGH:   { color:"#dc2626", bg:"#fee2e2" },
  MEDIUM: { color:"#b45309", bg:"#fef3c7" },
  LOW:    { color:"#15803d", bg:"#dcfce7" },
};

const PHOTO_CFG: Record<PhotoReq, { color: string; bg: string; icon: string; label: string }> = {
  "Not Required":    { color:"#6b7280", bg:"#f3f4f6", icon:"ri-camera-off-line", label:"Not Required"   },
  "Always Required": { color:"#dc2626", bg:"#fee2e2", icon:"ri-camera-fill",     label:"Always Required"},
  "Required if YES": { color:"#15803d", bg:"#dcfce7", icon:"ri-camera-line",     label:"If YES"         },
  "Required if NO":  { color:"#c2410c", bg:"#ffedd5", icon:"ri-camera-line",     label:"If NO"          },
  "Required if N/A": { color:"#7c3aed", bg:"#ede9fe", icon:"ri-camera-line",     label:"If N/A"         },
};

const SEC_CFG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  "General":                 { color:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe", icon:"ri-flashlight-line"     },
  "Fire Prevention Measures":{ color:"#dc2626", bg:"#fef2f2", border:"#fecaca", icon:"ri-fire-line"           },
  "Server and UPS Room":     { color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe", icon:"ri-server-line"         },
  "Electrical Safety":       { color:"#b45309", bg:"#fffbeb", border:"#fde68a", icon:"ri-plug-line"           },
  "Fire Protection":         { color:"#c2410c", bg:"#fff7ed", border:"#fed7aa", icon:"ri-shield-flash-line"   },
  "DG Set / Generator":      { color:"#065f46", bg:"#f0fdf4", border:"#bbf7d0", icon:"ri-battery-charge-line" },
  "Onsite ATM":              { color:"#0e7490", bg:"#ecfeff", border:"#a5f3fc", icon:"ri-bank-card-line"      },
};

// ─────────────────────────────────────────────────────────────────────────────
// SEED (same as edit page)
// ─────────────────────────────────────────────────────────────────────────────
const TEMPLATE_SEED: Record<string, { info: TemplateInfo; sections: Omit<ViewSection,"collapsed">[] }> = {
  "T-001": {
    info: { id:"T-001", name:"SBI Standard Branch Audit", description:"Comprehensive audit template for SBI urban and metro branches covering all compliance parameters.", bank:"State Bank of India", bankCode:"SBI", circle:"SBI Gujarat Circle", version:"v2.3", status:"Active", createdBy:"Admin", createdOn:"15 Jan 2024", usedCount:42 },
    sections: [
      { id:"s1", name:"General", questions:[
        { uid:"q001", code:"Q-001", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether MCCBs/MCBs/ELCBs are provided with proper rating to cater the load",                                          textHi:"क्या MCCBs/MCBs/ELCBs को लोड पूरा करने के लिए उचित रेटिंग के साथ प्रदान किया गया है" },
        { uid:"q002", code:"Q-002", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether light and emergency light are provided in electrical rooms/operating areas",                                    textHi:"क्या विद्युत कक्षों/परिचालन क्षेत्रों में प्रकाश एवं आपातकालीन प्रकाश की व्यवस्था है" },
        { uid:"q003", code:"Q-003", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Whether Pump room, DG set room, UPS room, electrical room etc. are maintained dry and in good condition",               textHi:"क्या पंप रूम, डीजी सेट रूम, यूपीएस रूम, विद्युत कक्ष आदि सूखे और अच्छी स्थिति में रखे जाते हैं" },
        { uid:"q004", code:"Q-004", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Whether water seepage is observed near any of the Electrical Panel, Distribution Boards, Electrical equipment etc.",      textHi:"क्या किसी विद्युत पैनल, वितरण बोर्ड, विद्युत उपकरण के पास पानी का रिसाव देखा गया है" },
        { uid:"q005", code:"Q-005", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether Earthing pits are provided and connected to the equipment body",                                                textHi:"क्या अर्थिंग पिट प्रदान किए गए हैं और उपकरण के बॉडी से जुड़े हैं" },
        { uid:"q006", code:"Q-006", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether the Earthing Pits are properly maintained",                                                                   textHi:"क्या अर्थिंग पिट का उचित रखरखाव किया जाता है" },
        { uid:"q007", code:"Q-007", riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether proper exhaust fan for ventilation of panel room/electrical room/UPS room is provided",                         textHi:"क्या पैनल रूम/विद्युत कक्ष/यूपीएस रूम के वेंटिलेशन के लिए उचित एग्जॉस्ट फैन प्रदान किया गया है" },
        { uid:"q008", code:"Q-008", riskLevel:"MEDIUM", isMandatory:false, allowRecommendation:true,  photoReq:"Not Required",      textEn:"Whether penalty is being imposed in electricity bills on account of higher load/poor power factor",                       textHi:"क्या खराब पावर फैक्टर/अधिक लोड के कारण बिजली बिल में जुर्माना लगाया जा रहा है" },
      ]},
      { id:"s2", name:"Fire Prevention Measures", questions:[
        { uid:"q019", code:"Q-019", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"All old disposable records, broken furniture etc. accumulated at the premises have been cleared",                       textHi:"क्या परिसर में जमा पुराने दस्तावेज़, टूटे फर्नीचर आदि को साफ किया गया है" },
        { uid:"q020", code:"Q-020", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Combustible leaf, litter/waste papers in and around the branch are removed/cleaned periodically",                       textHi:"क्या शाखा के अंदर और बाहर दहनशील पत्ते/रद्दी कागज नियमित रूप से हटाए/साफ किए जाते हैं" },
        { uid:"q021", code:"Q-021", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"No stationery/Records/old obsolete items are stored in the system/UPS room",                                           textHi:"क्या सिस्टम/यूपीएस रूम में कोई स्टेशनरी/रिकॉर्ड/पुरानी वस्तुएं संग्रहीत नहीं हैं" },
        { uid:"q022", code:"Q-022", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Storage racks in Stationery/Record room are at safe distance of at least 3 ft from electrical points",                 textHi:"क्या स्टेशनरी/रिकॉर्ड रूम में भंडारण रैक विद्युत बिंदुओं से कम से कम 3 फीट की दूरी पर हैं" },
        { uid:"q023", code:"Q-023", riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if YES",   textEn:"In the pantry/canteen LPG is used",                                                                                  textHi:"क्या पैंट्री/कैंटीन में एलपीजी का उपयोग किया जाता है" },
      ]},
      { id:"s3", name:"Electrical Safety", questions:[
        { uid:"q027", code:"Q-027", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Power supply to record/stationery room is made through plug and socket arrangement",                                   textHi:"रिकॉर्ड/स्टेशनरी रूम को प्लग और सॉकेट व्यवस्था के माध्यम से बिजली आपूर्ति की जाती है" },
        { uid:"q028", code:"Q-028", riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether LED lights have been installed in all areas",                                                                 textHi:"क्या सभी क्षेत्रों में एलईडी लाइट लगाई गई हैं" },
        { uid:"q029", code:"Q-029", riskLevel:"MEDIUM", isMandatory:false, allowRecommendation:true,  photoReq:"Not Required",      textEn:"Whether motion sensors/occupancy sensors have been installed",                                                       textHi:"क्या मोशन सेंसर/ऑक्यूपेंसी सेंसर स्थापित किए गए हैं" },
        { uid:"q030", code:"Q-030", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Are fire extinguishers available in all required work areas, clearly marked and accessible?",                          textHi:"क्या सभी आवश्यक कार्य क्षेत्रों में अग्निशामक यंत्र उपलब्ध हैं, स्पष्ट रूप से चिह्नित और सुलभ हैं" },
      ]},
      { id:"s4", name:"DG Set / Generator", questions:[
        { uid:"q031", code:"Q-031", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:false, photoReq:"Always Required",   textEn:"DG Set / Generator is installed at the branch/office",                                                               textHi:"डीजी सेट/जनरेटर शाखा/कार्यालय में स्थापित है" },
        { uid:"q032", code:"Q-032", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"At least two 6 Kg. ABC capacity fire extinguishers are placed near the diesel generator",                            textHi:"डीजल जनरेटर के पास कम से कम दो 6 किग्रा ABC क्षमता के अग्निशामक यंत्र रखे गए हैं" },
        { uid:"q033", code:"Q-033", riskLevel:"MEDIUM", isMandatory:false, allowRecommendation:false, photoReq:"Not Required",      textEn:"Electrical safety and energy saving awareness meeting with staff was conducted post audit",                             textHi:"ऑडिट के बाद स्टाफ के साथ विद्युत सुरक्षा और ऊर्जा बचत जागरूकता बैठक आयोजित की गई" },
        { uid:"q034", code:"Q-034", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"5 Kg ABC Automatic Modular Fire Extinguisher is provided and protected in the back room",                            textHi:"बैक रूम में 5 किग्रा ABC स्वचालित मॉड्यूलर अग्निशामक यंत्र प्रदान किया गया है और सुरक्षित है" },
        { uid:"q035", code:"Q-035", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"ATM room is having fire detector connected through branch AFDS (Applicable for Onsite ATMs only)",                    textHi:"एटीएम रूम में शाखा AFDS से जुड़ा अग्नि संसूचक है (केवल ऑनसाइट ATM के लिए)" },
      ]},
      { id:"s5", name:"Onsite ATM", questions:[
        { uid:"q036", code:"Q-036", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether MCCB/MCB/ELCB are provided and apparently in working condition",                                             textHi:"क्या MCCB/MCB/ELCB प्रदान किए गए हैं और स्पष्ट रूप से कार्यशील स्थिति में हैं" },
        { uid:"q037", code:"Q-037", riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"AC units are provided with timer circuit device",                                                                    textHi:"एसी इकाइयां टाइमर सर्किट डिवाइस से सुसज्जित हैं" },
        { uid:"q038", code:"Q-038", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Main supply switch/MCB to cut-off the electric supply of ATM has been marked",                                      textHi:"एटीएम की बिजली आपूर्ति काटने के लिए मुख्य आपूर्ति स्विच/MCB को चिह्नित किया गया है" },
        { uid:"q039", code:"Q-039", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Power supply to AC, UPS and ATM machines is through metal clad plug receptacle socket",                             textHi:"एसी, यूपीएस और एटीएम मशीनों को मेटल क्लैड प्लग रिसेप्टेकल सॉकेट के माध्यम से बिजली आपूर्ति" },
        { uid:"q040", code:"Q-040", riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Electrical wires are properly covered/insulated to prevent exposure",                                                textHi:"विद्युत तार उचित रूप से ढके/इन्सुलेटेड हैं ताकि एक्सपोजर न हो" },
      ]},
    ],
  },
};

const FALLBACK = TEMPLATE_SEED["T-001"];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ViewTemplatePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id     = params?.id ?? "T-001";
  const seed   = TEMPLATE_SEED[id] ?? FALLBACK;
  const bm     = BANK_ACCENT[seed.info.bankCode] ?? { accent:"#374151", light:"#f3f4f6" };
  const info   = seed.info;

  const [sections, setSections] = useState<ViewSection[]>(
    seed.sections.map(s => ({ ...s, collapsed: false, questions: s.questions.map(q => ({ ...q })) }))
  );

  const toggleCollapse = (id: string) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, collapsed: !s.collapsed } : s));

  const totalQ    = sections.reduce((n, s) => n + s.questions.length, 0);
  const statusCfg = STATUS_CFG[info.status];

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", display:"flex", flexDirection:"column" }}>

      {/* ── Top Bar ── */}
      <div style={{
        background:"#fff", borderBottom:"1px solid #e5e7eb", height:56,
        padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between",
        flexShrink:0, position:"sticky", top:0, zIndex:30,
      }}>
        {/* Left */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => router.back()} style={{
            width:32, height:32, borderRadius:8, border:"1px solid #e5e7eb",
            background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280",
          }}>
            <i className="ri-arrow-left-line" style={{ fontSize:15 }}/>
          </button>
          <div style={{ width:1, height:20, background:"#e5e7eb" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, color:"#9ca3af", cursor:"pointer" }} onClick={() => router.push("/templates")}>Audit Templates</span>
            <i className="ri-arrow-right-s-line" style={{ color:"#d1d5db", fontSize:14 }}/>
            <span style={{ fontSize:13, fontWeight:700, color:"#111827", maxWidth:280, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{info.name}</span>
          </div>
          <div style={{ width:1, height:20, background:"#e5e7eb", margin:"0 2px" }}/>
          <span style={{
            display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700,
            color:statusCfg.color, background:statusCfg.bg, border:`1px solid ${statusCfg.border}`,
            borderRadius:20, padding:"3px 10px",
          }}>
            <i className={statusCfg.icon} style={{ fontSize:11 }}/>{info.status}
          </span>
          {/* View-only badge */}
          <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:"#6b7280", background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:20, padding:"3px 10px" }}>
            <i className="ri-eye-line" style={{ fontSize:11 }}/>View Only
          </span>
        </div>

        {/* Right */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={() => router.push(`/templates/${id}`)} style={{
            padding:"7px 16px", border:"1px solid #dbeafe", borderRadius:8,
            background:"#eff6ff", color:"#2563eb", fontSize:13, fontWeight:700, cursor:"pointer",
            display:"flex", alignItems:"center", gap:6,
          }}>
            <i className="ri-edit-line"/>Edit Template
          </button>
          <button onClick={() => router.back()} style={{
            padding:"7px 16px", border:"1px solid #e5e7eb", borderRadius:8,
            background:"#fff", color:"#6b7280", fontSize:13, fontWeight:600, cursor:"pointer",
          }}>
            Close
          </button>
        </div>
      </div>

      {/* ── Main 2-column layout ── */}
      <div style={{ flex:1, display:"flex" }}>

        {/* ═══ LEFT SIDEBAR ═══ */}
        <div style={{ width:300, flexShrink:0, borderRight:"1px solid #e5e7eb", background:"#fff", display:"flex", flexDirection:"column", height:"calc(100vh - 56px)", position:"sticky", top:56, overflowY:"auto" }}>

          {/* Identity card */}
          <div style={{ padding:20, borderBottom:"1px solid #f3f4f6" }}>
            <div style={{ borderRadius:14, border:`1px solid ${bm.accent}20`, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ background:bm.accent, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:"rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:10, fontWeight:800, color:"#fff", letterSpacing:"0.05em" }}>{info.bankCode}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{info.bank}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", marginTop:2, fontFamily:"monospace" }}>{info.id} · {info.version}</div>
                </div>
              </div>
              <div style={{ padding:"14px 16px", background:bm.light, display:"flex", flexDirection:"column", gap:12 }}>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Mapped Circle</div>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:bm.accent, background:"rgba(255,255,255,0.8)", borderRadius:7, padding:"4px 10px", border:`1px solid ${bm.accent}25` }}>
                    <i className="ri-map-pin-2-fill" style={{ fontSize:11 }}/>{info.circle}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Template Name</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#111827", lineHeight:1.4 }}>{info.name}</div>
                </div>
                {info.description && (
                  <div>
                    <div style={{ fontSize:9, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Description</div>
                    <div style={{ fontSize:11, color:"#6b7280", lineHeight:1.6 }}>{info.description}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ padding:"14px 20px", borderBottom:"1px solid #f3f4f6" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:12 }}>Template Stats</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { label:"Sections",  value:sections.length, icon:"ri-layout-column-line", color:"#2563eb" },
                { label:"Questions", value:totalQ,           icon:"ri-question-line",      color:"#7c3aed" },
                { label:"Audits Run",value:info.usedCount,  icon:"ri-bar-chart-line",     color:"#15803d" },
                { label:"Version",   value:info.version,    icon:"ri-git-branch-line",    color:"#b45309" },
              ].map(s => (
                <div key={s.label} style={{ background:"#f8fafc", borderRadius:10, padding:"10px 12px", border:"1px solid #e5e7eb" }}>
                  <i className={s.icon} style={{ fontSize:14, color:s.color, display:"block", marginBottom:5 }}/>
                  <div style={{ fontSize:15, fontWeight:800, color:"#111827" }}>{s.value}</div>
                  <div style={{ fontSize:10, color:"#9ca3af", fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div style={{ padding:"14px 20px", borderBottom:"1px solid #f3f4f6" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Metadata</div>
            {[
              { label:"Created By", value:info.createdBy, icon:"ri-user-line" },
              { label:"Created On", value:info.createdOn, icon:"ri-calendar-line" },
              { label:"Status",     value:info.status,    icon:"ri-toggle-line" },
            ].map(m => (
              <div key={m.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:28, height:28, borderRadius:7, background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={m.icon} style={{ fontSize:13, color:"#6b7280" }}/>
                </div>
                <div>
                  <div style={{ fontSize:9, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em" }}>{m.label}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{m.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Section jump nav */}
          <div style={{ padding:"14px 20px", flex:1 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Sections</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {sections.map(s => {
                const cfg = SEC_CFG[s.name] ?? { color:"#374151", bg:"#f3f4f6", border:"#e5e7eb", icon:"ri-list-check" };
                return (
                  <button key={s.id} onClick={() => document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior:"smooth", block:"start" })} style={{
                    display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:8,
                    border:"none", background:"transparent", cursor:"pointer", textAlign:"left",
                    transition:"background 0.12s",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background="#f8fafc"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background="transparent"}
                  >
                    <div style={{ width:24, height:24, borderRadius:6, background:cfg.bg, border:`1px solid ${cfg.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className={cfg.icon} style={{ fontSize:12, color:cfg.color }}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#374151", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{s.name}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:800, color:cfg.color, background:cfg.bg, borderRadius:5, padding:"1px 7px", flexShrink:0 }}>{s.questions.length}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: CONTENT ═══ */}
        <div style={{ flex:1, overflowY:"auto", height:"calc(100vh - 56px)", padding:"28px 32px 60px" }}>

          {/* Page title */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
            <div>
              <h1 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 5px", letterSpacing:"-0.3px" }}>Template Preview</h1>
              <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>
                Read-only view of all sections and questions in this template.
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, color:"#9ca3af" }}>
                <strong style={{ color:"#374151" }}>{totalQ}</strong> questions · <strong style={{ color:"#374151" }}>{sections.length}</strong> sections
              </span>
            </div>
          </div>

          {/* Sections */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {sections.map(sec => {
              const cfg = SEC_CFG[sec.name] ?? { color:"#374151", bg:"#f9fafb", border:"#e5e7eb", icon:"ri-list-check" };
              return (
                <div key={sec.id} id={`sec-${sec.id}`} style={{
                  background:"#fff", borderRadius:14, border:"1px solid #e5e7eb",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.05)", overflow:"hidden",
                  borderTop:`3px solid ${cfg.color}`,
                }}>
                  {/* Section header */}
                  <div
                    onClick={() => toggleCollapse(sec.id)}
                    style={{
                      padding:"14px 20px", display:"flex", alignItems:"center", gap:12,
                      background:cfg.bg, cursor:"pointer", userSelect:"none" as const,
                      borderBottom: sec.collapsed ? "none" : `1px solid ${cfg.border}`,
                    }}
                  >
                    <div style={{ width:34, height:34, borderRadius:9, background:cfg.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className={cfg.icon} style={{ fontSize:16, color:"#fff" }}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:800, color:cfg.color }}>{sec.name}</div>
                      <div style={{ fontSize:11, color:cfg.color, opacity:0.65, fontWeight:500 }}>
                        {sec.questions.length} question{sec.questions.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <i className={`ri-arrow-${sec.collapsed ? "down" : "up"}-s-line`} style={{ color:cfg.color, fontSize:18, opacity:0.6 }}/>
                  </div>

                  {/* Questions */}
                  {!sec.collapsed && (
                    <div style={{ padding:"12px 16px 16px" }}>
                      {sec.questions.length === 0 ? (
                        <div style={{ textAlign:"center", padding:"32px 0", color:"#d1d5db" }}>
                          <i className="ri-inbox-2-line" style={{ fontSize:32, display:"block", marginBottom:8, opacity:0.5 }}/>
                          <div style={{ fontSize:13, fontWeight:600 }}>No questions in this section</div>
                        </div>
                      ) : (
                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          {sec.questions.map((q, qIdx) => {
                            const risk  = RISK_CFG[q.riskLevel];
                            const photo = PHOTO_CFG[q.photoReq];
                            return (
                              <div key={q.uid} style={{
                                display:"flex", alignItems:"flex-start", gap:12,
                                padding:"12px 14px", borderRadius:10,
                                border:"1.5px solid #f3f4f6", background:"#fafafa",
                              }}>
                                {/* Serial */}
                                <div style={{ width:26, height:26, borderRadius:7, background:cfg.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                                  <span style={{ fontSize:10, fontWeight:800, color:"#fff" }}>{qIdx + 1}</span>
                                </div>

                                {/* Content */}
                                <div style={{ flex:1, minWidth:0 }}>
                                  {/* Chips row */}
                                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6, flexWrap:"wrap" as const }}>
                                    <span style={{ fontSize:10, fontWeight:800, color:cfg.color, fontFamily:"monospace", background:`${cfg.color}15`, borderRadius:4, padding:"2px 7px" }}>{q.code}</span>
                                    <span style={{ fontSize:9, fontWeight:700, color:risk.color, background:risk.bg, borderRadius:4, padding:"2px 7px" }}>{q.riskLevel}</span>
                                    {q.isMandatory && (
                                      <span style={{ fontSize:9, fontWeight:700, color:"#15803d", background:"#dcfce7", borderRadius:4, padding:"2px 7px", display:"inline-flex", alignItems:"center", gap:3 }}>
                                        <i className="ri-checkbox-circle-fill" style={{ fontSize:9 }}/>Mandatory
                                      </span>
                                    )}
                                    {q.allowRecommendation && (
                                      <span style={{ fontSize:9, fontWeight:700, color:"#2563eb", background:"#eff6ff", borderRadius:4, padding:"2px 7px", display:"inline-flex", alignItems:"center", gap:3 }}>
                                        <i className="ri-lightbulb-line" style={{ fontSize:9 }}/>Recommendation
                                      </span>
                                    )}
                                  </div>
                                  {/* English */}
                                  <div style={{ fontSize:13, fontWeight:500, color:"#1f2937", lineHeight:1.55, marginBottom:3 }}>{q.textEn}</div>
                                  {/* Hindi */}
                                  <div style={{ fontSize:11, color:"#9ca3af", lineHeight:1.5, fontStyle:"italic", marginBottom:8 }}>{q.textHi}</div>
                                  {/* Photo chip */}
                                  <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:10, fontWeight:600, color:photo.color, background:photo.bg, borderRadius:5, padding:"2px 8px", border:`1px solid ${photo.color}30` }}>
                                    <i className={photo.icon} style={{ fontSize:10 }}/>Photo: {photo.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
