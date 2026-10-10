"use client";
import React, { useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
type PhotoReq  = "Not Required" | "Always Required" | "Required if YES" | "Required if NO" | "Required if N/A";
type Status    = "Active" | "Draft" | "Archived";

interface EditQuestion {
  uid:     string;   // unique within this edit session
  code:    string;
  textEn:  string;
  textHi:  string;
  riskLevel:  RiskLevel;
  isMandatory: boolean;
  allowRecommendation: boolean;
  photoReq: PhotoReq;
}

interface EditSection {
  id:        string;
  name:      string;
  collapsed: boolean;
  questions: EditQuestion[];
}

interface TemplateInfo {
  id:          string;
  name:        string;
  description: string;
  bank:        string;
  bankCode:    string;
  circle:      string;
  version:     string;
  status:      Status;
  createdBy:   string;
  createdOn:   string;
  usedCount:   number;
}

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

const STATUS_CFG: Record<Status, { color: string; bg: string; border: string; label: string; icon: string }> = {
  Active:   { color:"#15803d", bg:"#dcfce7", border:"#86efac", label:"Active",   icon:"ri-checkbox-circle-fill" },
  Draft:    { color:"#b45309", bg:"#fef3c7", border:"#fcd34d", label:"Draft",    icon:"ri-draft-line"           },
  Archived: { color:"#6b7280", bg:"#f3f4f6", border:"#d1d5db", label:"Archived", icon:"ri-archive-line"         },
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
  "General":                 { color:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe", icon:"ri-flashlight-line"       },
  "Fire Prevention Measures":{ color:"#dc2626", bg:"#fef2f2", border:"#fecaca", icon:"ri-fire-line"             },
  "Server and UPS Room":     { color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe", icon:"ri-server-line"           },
  "Electrical Safety":       { color:"#b45309", bg:"#fffbeb", border:"#fde68a", icon:"ri-plug-line"             },
  "Fire Protection":         { color:"#c2410c", bg:"#fff7ed", border:"#fed7aa", icon:"ri-shield-flash-line"     },
  "DG Set / Generator":      { color:"#065f46", bg:"#f0fdf4", border:"#bbf7d0", icon:"ri-battery-charge-line"   },
  "Onsite ATM":              { color:"#0e7490", bg:"#ecfeff", border:"#a5f3fc", icon:"ri-bank-card-line"        },
};

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA — mirrors templates/page.tsx SEED but structured for editing
// ─────────────────────────────────────────────────────────────────────────────
const TEMPLATE_SEED: Record<string, { info: TemplateInfo; sections: Omit<EditSection,"collapsed">[] }> = {
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

// Fallback for unknown IDs
const FALLBACK_TEMPLATE = TEMPLATE_SEED["T-001"];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id     = params?.id ?? "T-001";

  const seed   = TEMPLATE_SEED[id] ?? FALLBACK_TEMPLATE;
  const bm     = BANK_ACCENT[seed.info.bankCode] ?? { accent:"#374151", light:"#f3f4f6" };

  const [info,     setInfo]     = useState<TemplateInfo>({ ...seed.info });
  const [sections, setSections] = useState<EditSection[]>(
    seed.sections.map(s => ({ ...s, collapsed: false, questions: s.questions.map(q => ({ ...q })) }))
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [toast,      setToast]      = useState<{ msg: string; type: "success"|"error" } | null>(null);
  const [deleteModal,setDeleteModal] = useState<{ sectionId: string; uid: string; code: string } | null>(null);
  const [addSecModal, setAddSecModal] = useState(false);
  const [newSecName,  setNewSecName]  = useState("");
  const [renameSec,   setRenameSec]   = useState<string | null>(null);
  const [renameVal,   setRenameVal]   = useState("");

  // drag state
  const dragRef = useRef<{ secId: string; uid: string; idx: number } | null>(null);

  const showToast = useCallback((msg: string, type: "success"|"error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const mark = () => setHasChanges(true);

  // ── Question ops ────────────────────────────────────────────────────────────
  const removeQuestion = (secId: string, uid: string) => {
    setSections(prev => prev.map(s =>
      s.id !== secId ? s : { ...s, questions: s.questions.filter(q => q.uid !== uid) }
    ));
    setDeleteModal(null);
    mark();
    showToast("Question removed from template");
  };

  const moveQuestion = (secId: string, uid: string, dir: -1 | 1) => {
    setSections(prev => prev.map(s => {
      if (s.id !== secId) return s;
      const idx = s.questions.findIndex(q => q.uid === uid);
      if (idx < 0) return s;
      const nxt = idx + dir;
      if (nxt < 0 || nxt >= s.questions.length) return s;
      const qs = [...s.questions];
      [qs[idx], qs[nxt]] = [qs[nxt], qs[idx]];
      return { ...s, questions: qs };
    }));
    mark();
  };

  // ── Drag handlers ────────────────────────────────────────────────────────────
  const onDragStart = (secId: string, uid: string, idx: number) => {
    dragRef.current = { secId, uid, idx };
  };

  const onDragOver = (e: React.DragEvent, secId: string, targetIdx: number) => {
    e.preventDefault();
    const drag = dragRef.current;
    if (!drag || drag.secId !== secId || drag.idx === targetIdx) return;
    setSections(prev => prev.map(s => {
      if (s.id !== secId) return s;
      const qs = [...s.questions];
      const [moved] = qs.splice(drag.idx, 1);
      qs.splice(targetIdx, 0, moved);
      dragRef.current = { secId, uid: drag.uid, idx: targetIdx };
      return { ...s, questions: qs };
    }));
    mark();
  };

  const onDragEnd = () => { dragRef.current = null; };

  // ── Section ops ─────────────────────────────────────────────────────────────
  const toggleCollapse = (id: string) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, collapsed: !s.collapsed } : s));

  const addSection = () => {
    if (!newSecName.trim()) return;
    const id = `s_${Date.now()}`;
    setSections(prev => [...prev, { id, name: newSecName.trim(), collapsed: false, questions: [] }]);
    setAddSecModal(false);
    setNewSecName("");
    mark();
    showToast(`Section "${newSecName.trim()}" added`);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    mark();
    showToast("Section removed");
  };

  const startRename = (s: EditSection) => {
    setRenameSec(s.id);
    setRenameVal(s.name);
  };

  const commitRename = () => {
    if (!renameVal.trim()) return;
    setSections(prev => prev.map(s => s.id === renameSec ? { ...s, name: renameVal.trim() } : s));
    setRenameSec(null);
    mark();
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    setHasChanges(false);
    showToast(`Template "${info.name}" saved successfully`);
  };

  const totalQ = sections.reduce((n, s) => n + s.questions.length, 0);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  const statusCfg = STATUS_CFG[info.status];

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", display:"flex", flexDirection:"column" }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position:"fixed", top:16, right:24, zIndex:9999,
          background: toast.type === "success" ? "#111827" : "#dc2626",
          color:"#fff", borderRadius:10, padding:"12px 18px",
          fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:9,
          boxShadow:"0 8px 24px rgba(0,0,0,0.25)", animation:"fadeIn 0.2s ease",
        }}>
          <i className={toast.type==="success" ? "ri-check-circle-line" : "ri-error-warning-line"} style={{ fontSize:16 }}/>
          {toast.msg}
        </div>
      )}

      {/* ── Top Bar ── */}
      <div style={{
        background:"#fff", borderBottom:"1px solid #e5e7eb", height:56,
        padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between",
        flexShrink:0, position:"sticky", top:0, zIndex:30,
      }}>
        {/* Left — breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => router.back()} style={{
            width:32, height:32, borderRadius:8, border:"1px solid #e5e7eb",
            background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280",
          }}>
            <i className="ri-arrow-left-line" style={{ fontSize:15 }}/>
          </button>
          <div style={{ width:1, height:20, background:"#e5e7eb" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, color:"#9ca3af", cursor:"pointer" }} onClick={() => router.back()}>Audit Templates</span>
            <i className="ri-arrow-right-s-line" style={{ color:"#d1d5db", fontSize:14 }}/>
            <span style={{ fontSize:13, fontWeight:700, color:"#111827", maxWidth:280, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{info.name}</span>
          </div>
          <div style={{ width:1, height:20, background:"#e5e7eb", margin:"0 2px" }}/>
          {/* Status chip */}
          <span style={{
            display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700,
            color: statusCfg.color, background: statusCfg.bg, border:`1px solid ${statusCfg.border}`,
            borderRadius:20, padding:"3px 10px",
          }}>
            <i className={statusCfg.icon} style={{ fontSize:11 }}/>{statusCfg.label}
          </span>
        </div>

        {/* Right — actions */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {hasChanges && (
            <span style={{ fontSize:12, color:"#f59e0b", fontWeight:600, display:"flex", alignItems:"center", gap:5 }}>
              <i className="ri-circle-fill" style={{ fontSize:8 }}/>Unsaved changes
            </span>
          )}
          <button onClick={() => router.back()} style={{
            padding:"7px 16px", border:"1px solid #e5e7eb", borderRadius:8,
            background:"#fff", color:"#6b7280", fontSize:13, fontWeight:600, cursor:"pointer",
          }}>
            Discard
          </button>
          {info.status === "Draft" && (
            <button onClick={() => { setInfo(p => ({ ...p, status:"Active" })); mark(); showToast("Template activated"); }} style={{
              padding:"7px 16px", border:"1px solid #86efac", borderRadius:8,
              background:"#f0fdf4", color:"#15803d", fontSize:13, fontWeight:700, cursor:"pointer",
              display:"flex", alignItems:"center", gap:5,
            }}>
              <i className="ri-checkbox-circle-line"/>Activate
            </button>
          )}
          <button onClick={handleSave} style={{
            padding:"7px 18px", border:"none", borderRadius:8, fontSize:13, fontWeight:700,
            background:"#2563eb", color:"#fff", cursor:"pointer",
            display:"flex", alignItems:"center", gap:6,
            boxShadow:"0 2px 8px rgba(37,99,235,0.35)",
            opacity: hasChanges ? 1 : 0.6,
          }}>
            <i className="ri-save-line"/>Save Changes
          </button>
        </div>
      </div>

      {/* ── Main content: 2 columns ── */}
      <div style={{ flex:1, display:"flex", gap:0, maxWidth:"100%", padding:0 }}>

        {/* ═══ LEFT SIDEBAR ═══ */}
        <div style={{ width:300, flexShrink:0, borderRight:"1px solid #e5e7eb", background:"#fff", display:"flex", flexDirection:"column", height:"calc(100vh - 56px)", position:"sticky", top:56, overflowY:"auto" }}>

          {/* Template identity card */}
          <div style={{ padding:20, borderBottom:"1px solid #f3f4f6" }}>
            <div style={{ borderRadius:14, border:`1px solid ${bm.accent}20`, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              {/* Bank header */}
              <div style={{ background:bm.accent, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:"rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:10, fontWeight:800, color:"#fff", letterSpacing:"0.05em" }}>{info.bankCode}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#fff", lineHeight:1.3 }}>{info.bank}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", marginTop:2, fontFamily:"monospace" }}>{info.id} · {info.version}</div>
                </div>
              </div>

              {/* Details */}
              <div style={{ padding:"14px 16px", background:bm.light, display:"flex", flexDirection:"column", gap:12 }}>
                {/* Circle */}
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Mapped Circle</div>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:bm.accent, background:"rgba(255,255,255,0.8)", borderRadius:7, padding:"4px 10px", border:`1px solid ${bm.accent}25` }}>
                    <i className="ri-map-pin-2-fill" style={{ fontSize:11 }}/>{info.circle}
                  </span>
                </div>

                {/* Template name */}
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Template Name</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#111827", lineHeight:1.4 }}>{info.name}</div>
                </div>

                {/* Description */}
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

          {/* Section summary */}
          <div style={{ padding:"14px 20px", flex:1 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Section Summary</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {sections.map(s => {
                const cfg = SEC_CFG[s.name] ?? { color:"#374151", bg:"#f3f4f6", border:"#e5e7eb", icon:"ri-list-check" };
                return (
                  <button key={s.id} onClick={() => {
                    document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior:"smooth", block:"start" });
                  }} style={{
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

            {/* Add section */}
            <button onClick={() => setAddSecModal(true)} style={{
              marginTop:12, width:"100%", padding:"9px 0", border:"1.5px dashed #d1d5db", borderRadius:9,
              background:"transparent", color:"#9ca3af", fontSize:12, fontWeight:600, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              transition:"all 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor="#2563eb"; (e.currentTarget as HTMLButtonElement).style.color="#2563eb"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor="#d1d5db"; (e.currentTarget as HTMLButtonElement).style.color="#9ca3af"; }}
            >
              <i className="ri-add-line"/>Add New Section
            </button>
          </div>
        </div>

        {/* ═══ RIGHT: SECTIONS + QUESTIONS ═══ */}
        <div style={{ flex:1, overflowY:"auto", height:"calc(100vh - 56px)", padding:"28px 32px 60px" }}>

          {/* Page title row */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
            <div>
              <h1 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:"0 0 5px", letterSpacing:"-0.3px" }}>Edit Template</h1>
              <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>
                Reorder or remove questions. Drag the <i className="ri-drag-move-line"/> handle to move within a section.
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, color:"#9ca3af" }}>
                <strong style={{ color:"#374151" }}>{totalQ}</strong> questions across <strong style={{ color:"#374151" }}>{sections.length}</strong> sections
              </span>
            </div>
          </div>

          {/* ── Sections ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {sections.map((sec, sIdx) => {
              const cfg = SEC_CFG[sec.name] ?? { color:"#374151", bg:"#f9fafb", border:"#e5e7eb", icon:"ri-list-check" };

              return (
                <div key={sec.id} id={`sec-${sec.id}`} style={{
                  background:"#fff", borderRadius:14, border:"1px solid #e5e7eb",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.05)", overflow:"hidden",
                  borderTop:`3px solid ${cfg.color}`,
                }}>
                  {/* Section header */}
                  <div style={{
                    padding:"14px 20px", display:"flex", alignItems:"center", gap:12,
                    background: cfg.bg, cursor:"pointer", userSelect:"none" as const,
                    borderBottom: sec.collapsed ? "none" : `1px solid ${cfg.border}`,
                  }} onClick={() => toggleCollapse(sec.id)}>
                    {/* Icon */}
                    <div style={{ width:34, height:34, borderRadius:9, background:cfg.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className={cfg.icon} style={{ fontSize:16, color:"#fff" }}/>
                    </div>

                    {/* Name or rename input */}
                    {renameSec === sec.id ? (
                      <input
                        value={renameVal}
                        autoFocus
                        onChange={e => setRenameVal(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenameSec(null); }}
                        onBlur={commitRename}
                        onClick={e => e.stopPropagation()}
                        style={{ flex:1, fontSize:14, fontWeight:700, border:"1.5px solid #2563eb", borderRadius:7, padding:"5px 10px", outline:"none", background:"#fff" }}
                      />
                    ) : (
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:800, color:cfg.color }}>{sec.name}</div>
                        <div style={{ fontSize:11, color: cfg.color, opacity:0.6, fontWeight:500 }}>
                          {sec.questions.length} question{sec.questions.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    )}

                    {/* Section actions */}
                    <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => startRename(sec)} title="Rename section" style={{
                        width:30, height:30, borderRadius:7, border:"1px solid", borderColor:cfg.border,
                        background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:cfg.color,
                      }}>
                        <i className="ri-pencil-line" style={{ fontSize:13 }}/>
                      </button>
                      {sections.length > 1 && (
                        <button onClick={() => removeSection(sec.id)} title="Remove section" style={{
                          width:30, height:30, borderRadius:7, border:"1px solid #fecaca",
                          background:"#fff5f5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626",
                        }}>
                          <i className="ri-delete-bin-line" style={{ fontSize:13 }}/>
                        </button>
                      )}
                      <button style={{
                        width:30, height:30, borderRadius:7, border:"1px solid", borderColor:cfg.border,
                        background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:cfg.color,
                      }}>
                        <i className={`ri-arrow-${sec.collapsed ? "down" : "up"}-s-line`} style={{ fontSize:16 }}/>
                      </button>
                    </div>
                  </div>

                  {/* Questions list */}
                  {!sec.collapsed && (
                    <div style={{ padding:"12px 16px 16px" }}>
                      {sec.questions.length === 0 ? (
                        <div style={{ textAlign:"center", padding:"32px 0", color:"#d1d5db" }}>
                          <i className="ri-inbox-2-line" style={{ fontSize:32, display:"block", marginBottom:8, opacity:0.5 }}/>
                          <div style={{ fontSize:13, fontWeight:600 }}>No questions in this section</div>
                          <div style={{ fontSize:11, marginTop:3 }}>Add questions from the Question Library</div>
                        </div>
                      ) : (
                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          {sec.questions.map((q, qIdx) => {
                            const risk  = RISK_CFG[q.riskLevel];
                            const photo = PHOTO_CFG[q.photoReq];
                            const isFirst = qIdx === 0;
                            const isLast  = qIdx === sec.questions.length - 1;

                            return (
                              <div
                                key={q.uid}
                                draggable
                                onDragStart={() => onDragStart(sec.id, q.uid, qIdx)}
                                onDragOver={e => onDragOver(e, sec.id, qIdx)}
                                onDragEnd={onDragEnd}
                                style={{
                                  display:"flex", alignItems:"flex-start", gap:10,
                                  padding:"12px 14px", borderRadius:10, border:"1.5px solid #f3f4f6",
                                  background:"#fafafa", transition:"all 0.12s",
                                  cursor:"default",
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor="#e5e7eb"; (e.currentTarget as HTMLDivElement).style.background="#fff"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor="#f3f4f6"; (e.currentTarget as HTMLDivElement).style.background="#fafafa"; (e.currentTarget as HTMLDivElement).style.boxShadow="none"; }}
                              >
                                {/* Drag handle */}
                                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, flexShrink:0, paddingTop:2, cursor:"grab" }}>
                                  <i className="ri-drag-move-line" style={{ fontSize:16, color:"#d1d5db" }}/>
                                </div>

                                {/* Serial number */}
                                <div style={{
                                  width:26, height:26, borderRadius:7, flexShrink:0,
                                  background: cfg.color, display:"flex", alignItems:"center", justifyContent:"center",
                                }}>
                                  <span style={{ fontSize:10, fontWeight:800, color:"#fff" }}>{qIdx + 1}</span>
                                </div>

                                {/* Content */}
                                <div style={{ flex:1, minWidth:0 }}>
                                  {/* Row 1: Code + Risk */}
                                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5, flexWrap:"wrap" as const }}>
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

                                  {/* Row 2: English text */}
                                  <div style={{ fontSize:13, fontWeight:500, color:"#1f2937", lineHeight:1.5, marginBottom:3 }}>{q.textEn}</div>

                                  {/* Row 3: Hindi text */}
                                  <div style={{ fontSize:11, color:"#9ca3af", lineHeight:1.5, fontStyle:"italic", marginBottom:7 }}>{q.textHi}</div>

                                  {/* Row 4: Photo chip */}
                                  <span style={{
                                    display:"inline-flex", alignItems:"center", gap:4, fontSize:10, fontWeight:600,
                                    color:photo.color, background:photo.bg, borderRadius:5, padding:"2px 8px",
                                    border:`1px solid ${photo.color}30`,
                                  }}>
                                    <i className={photo.icon} style={{ fontSize:10 }}/>Photo: {photo.label}
                                  </span>
                                </div>

                                {/* Right: up/down + remove */}
                                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
                                  <button
                                    disabled={isFirst}
                                    onClick={() => moveQuestion(sec.id, q.uid, -1)}
                                    title="Move up"
                                    style={{
                                      width:28, height:28, borderRadius:7, border:"1px solid #e5e7eb",
                                      background:"#fff", cursor:isFirst?"not-allowed":"pointer",
                                      display:"flex", alignItems:"center", justifyContent:"center",
                                      color: isFirst ? "#d1d5db" : "#6b7280",
                                      transition:"all 0.12s",
                                    }}
                                  >
                                    <i className="ri-arrow-up-line" style={{ fontSize:13 }}/>
                                  </button>
                                  <button
                                    disabled={isLast}
                                    onClick={() => moveQuestion(sec.id, q.uid, 1)}
                                    title="Move down"
                                    style={{
                                      width:28, height:28, borderRadius:7, border:"1px solid #e5e7eb",
                                      background:"#fff", cursor:isLast?"not-allowed":"pointer",
                                      display:"flex", alignItems:"center", justifyContent:"center",
                                      color: isLast ? "#d1d5db" : "#6b7280",
                                      transition:"all 0.12s",
                                    }}
                                  >
                                    <i className="ri-arrow-down-line" style={{ fontSize:13 }}/>
                                  </button>
                                  <div style={{ width:1, height:8, background:"#f3f4f6" }}/>
                                  <button
                                    onClick={() => setDeleteModal({ sectionId: sec.id, uid: q.uid, code: q.code })}
                                    title="Remove question"
                                    style={{
                                      width:28, height:28, borderRadius:7, border:"1px solid #fecaca",
                                      background:"#fff5f5", cursor:"pointer",
                                      display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626",
                                      transition:"all 0.12s",
                                    }}
                                  >
                                    <i className="ri-delete-bin-line" style={{ fontSize:13 }}/>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add questions footer */}
                      <button style={{
                        marginTop:10, width:"100%", padding:"10px 0",
                        border:`1.5px dashed ${cfg.border}`, borderRadius:9,
                        background:"transparent", color:cfg.color, fontSize:12, fontWeight:700, cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                        opacity:0.7, transition:"opacity 0.15s",
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity="1"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity="0.7"}
                      >
                        <i className="ri-add-circle-line" style={{ fontSize:14 }}/>Add Questions to {sec.name}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add section CTA */}
            <button onClick={() => setAddSecModal(true)} style={{
              width:"100%", padding:"16px 0", border:"1.5px dashed #d1d5db", borderRadius:14,
              background:"transparent", color:"#9ca3af", fontSize:13, fontWeight:700, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              transition:"all 0.15s",
            }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor="#2563eb"; b.style.color="#2563eb"; b.style.background="#eff6ff"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor="#d1d5db"; b.style.color="#9ca3af"; b.style.background="transparent"; }}
            >
              <i className="ri-add-circle-line" style={{ fontSize:18 }}/>Add New Section
            </button>
          </div>
        </div>
      </div>

      {/* ══ DELETE QUESTION MODAL ══ */}
      {deleteModal && (
        <div style={{ position:"fixed", inset:0, zIndex:9990, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:400, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", padding:"28px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"#fee2e2", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className="ri-delete-bin-line" style={{ fontSize:22, color:"#dc2626" }}/>
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:"#111827" }}>Remove Question?</div>
                <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>
                  <strong style={{ fontFamily:"monospace", color:"#374151" }}>{deleteModal.code}</strong> will be removed from this template.
                </div>
              </div>
            </div>
            <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.6, margin:"0 0 20px", background:"#f8fafc", borderRadius:8, padding:"10px 14px" }}>
              This only removes the question from this template. The question will remain in the Question Library.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex:1, padding:"10px", border:"1px solid #e5e7eb", borderRadius:9, background:"#fff", color:"#6b7280", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                Cancel
              </button>
              <button onClick={() => removeQuestion(deleteModal.sectionId, deleteModal.uid)} style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:"#dc2626", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                Remove Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADD SECTION MODAL ══ */}
      {addSecModal && (
        <div style={{ position:"fixed", inset:0, zIndex:9990, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:420, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", padding:"28px" }}>
            <div style={{ fontSize:16, fontWeight:800, color:"#111827", marginBottom:6 }}>Add New Section</div>
            <div style={{ fontSize:13, color:"#6b7280", marginBottom:20 }}>Sections group related questions together.</div>
            <input
              value={newSecName}
              onChange={e => setNewSecName(e.target.value)}
              placeholder="e.g. Server and UPS Room"
              autoFocus
              onKeyDown={e => { if (e.key === "Enter") addSection(); if (e.key === "Escape") setAddSecModal(false); }}
              style={{ width:"100%", border:"1.5px solid #2563eb", borderRadius:9, padding:"11px 14px", fontSize:14, outline:"none", boxSizing:"border-box" as const, marginBottom:16 }}
            />
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { setAddSecModal(false); setNewSecName(""); }} style={{ flex:1, padding:"10px", border:"1px solid #e5e7eb", borderRadius:9, background:"#fff", color:"#6b7280", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                Cancel
              </button>
              <button onClick={addSection} disabled={!newSecName.trim()} style={{ flex:1, padding:"10px", border:"none", borderRadius:9, background:newSecName.trim()?"#2563eb":"#e5e7eb", color:newSecName.trim()?"#fff":"#9ca3af", fontSize:13, fontWeight:700, cursor:newSecName.trim()?"pointer":"not-allowed" }}>
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
