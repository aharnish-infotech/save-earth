"use client";
import React, { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
type QType    = "YES_NO_NA" | "YES_NO" | "RATING_1_5" | "NUMERIC" | "TEXT" | "MULTI_CHOICE";
type RiskLevel= "HIGH" | "MEDIUM" | "LOW";
type QStatus  = "Active" | "Draft" | "Inactive";

interface Question {
  id:           string;
  textEn:       string;
  textHi:       string;
  type:         QType;
  category:     string;
  riskLevel:    RiskLevel;
  weightage:    number;
  helpEn:       string;
  helpHi:       string;
  mandatory:    boolean;
  allowRemarks: boolean;
  allowPhoto:   boolean;
  multiPhoto:   boolean;
  numericValue: boolean;
  allowNA:      boolean;
  recommendEn:  string;
  recommendHi:  string;
  section:      string;
  status:       QStatus;
  usedIn:       number;
  createdOn:    string;
}

// ── Seed Data ──────────────────────────────────────────────────────────────────
const SEED: Question[] = [
  { id:"Q-001", section:"Electrical Safety", category:"Safety",      type:"YES_NO_NA",   riskLevel:"HIGH",   weightage:8, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:false, numericValue:false, allowNA:true,  status:"Active", usedIn:4, createdOn:"01 Jan 2024",
    textEn:"Whether ELCBs are provided with proper rating to cater the load?",
    textHi:"क्या ELCB उचित रेटिंग के साथ लोड के अनुसार प्रदान किए गए हैं?",
    helpEn:"Inspect ELCB rating label and compare with connected load.",
    helpHi:"ELCB की रेटिंग लेबल जाँचें और कनेक्टेड लोड से मिलाएं।",
    recommendEn:"Install ELCB of appropriate rating as per connected load.",
    recommendHi:"कनेक्टेड लोड के अनुसार उचित रेटिंग का ELCB स्थापित करें।",
  },
  { id:"Q-002", section:"Electrical Safety", category:"Safety",      type:"YES_NO_NA",   riskLevel:"HIGH",   weightage:9, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:true,  numericValue:false, allowNA:false, status:"Active", usedIn:4, createdOn:"01 Jan 2024",
    textEn:"Are all electrical connections properly insulated with no exposed wiring?",
    textHi:"क्या सभी विद्युत कनेक्शन ठीक से इन्सुलेटेड हैं और कोई खुला तार नहीं है?",
    helpEn:"Check all wiring for exposed conductors, damaged insulation.",
    helpHi:"सभी तारों में खुले कंडक्टर, क्षतिग्रस्त इन्सुलेशन की जाँच करें।",
    recommendEn:"Re-insulate all exposed wiring immediately.",
    recommendHi:"सभी खुले तारों को तुरंत इन्सुलेट करें।",
  },
  { id:"Q-003", section:"Electrical Safety", category:"Maintenance", type:"RATING_1_5",  riskLevel:"MEDIUM", weightage:6, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:false, numericValue:false, allowNA:false, status:"Active", usedIn:3, createdOn:"01 Jan 2024",
    textEn:"Rate the overall condition of the UPS / inverter backup system.",
    textHi:"UPS / इन्वर्टर बैकअप सिस्टम की समग्र स्थिति को रेट करें।",
    helpEn:"Check battery health, runtime, and last maintenance date.",
    helpHi:"बैटरी स्वास्थ्य, रनटाइम और अंतिम रखरखाव तिथि जाँचें।",
    recommendEn:"Schedule UPS battery replacement if runtime is below 30 minutes.",
    recommendHi:"यदि रनटाइम 30 मिनट से कम है तो UPS बैटरी बदलें।",
  },
  { id:"Q-004", section:"Electrical Safety", category:"Compliance",  type:"YES_NO_NA",   riskLevel:"HIGH",   weightage:8, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:false, numericValue:false, allowNA:false, status:"Active", usedIn:4, createdOn:"02 Jan 2024",
    textEn:"Is the earthing system properly installed and tested within the last 6 months?",
    textHi:"क्या अर्थिंग सिस्टम ठीक से स्थापित है और पिछले 6 महीनों में परीक्षण किया गया है?",
    helpEn:"Check earthing test certificate date and resistance value.",
    helpHi:"अर्थिंग परीक्षण प्रमाणपत्र तिथि और प्रतिरोध मान जाँचें।",
    recommendEn:"Conduct earthing resistance test and obtain certificate.",
    recommendHi:"अर्थिंग प्रतिरोध परीक्षण करें और प्रमाणपत्र प्राप्त करें।",
  },
  { id:"Q-005", section:"Electrical Safety", category:"Safety",      type:"YES_NO_NA",   riskLevel:"HIGH",   weightage:7, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:false, numericValue:false, allowNA:false, status:"Active", usedIn:4, createdOn:"02 Jan 2024",
    textEn:"Is the DG Set functional and tested within the last quarter?",
    textHi:"क्या DG सेट कार्यात्मक है और पिछली तिमाही में परीक्षण किया गया है?",
    helpEn:"Check DG log book for last test run date and duration.",
    helpHi:"DG लॉग बुक में अंतिम परीक्षण रन तिथि और अवधि जाँचें।",
    recommendEn:"Conduct monthly test run of DG Set and maintain log.",
    recommendHi:"DG सेट का मासिक परीक्षण रन करें और लॉग बनाए रखें।",
  },
  { id:"Q-006", section:"Electrical Safety", category:"Maintenance", type:"NUMERIC",     riskLevel:"MEDIUM", weightage:4, mandatory:false, allowRemarks:true,  allowPhoto:false, multiPhoto:false, numericValue:true,  allowNA:true,  status:"Active", usedIn:2, createdOn:"03 Jan 2024",
    textEn:"What is the current earthing resistance value (in Ohms)?",
    textHi:"वर्तमान अर्थिंग प्रतिरोध मान (ओम में) क्या है?",
    helpEn:"Record value from last earthing test certificate.",
    helpHi:"अंतिम अर्थिंग परीक्षण प्रमाणपत्र से मान दर्ज करें।",
    recommendEn:"Resistance should be below 1 Ohm as per IS standards.",
    recommendHi:"IS मानकों के अनुसार प्रतिरोध 1 ओम से कम होना चाहिए।",
  },
  { id:"Q-007", section:"Fire Safety", category:"Safety",            type:"YES_NO_NA",   riskLevel:"HIGH",   weightage:9, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:true,  numericValue:false, allowNA:false, status:"Active", usedIn:4, createdOn:"01 Jan 2024",
    textEn:"Are adequate fire extinguishers installed at all required locations?",
    textHi:"क्या सभी आवश्यक स्थानों पर पर्याप्त अग्निशामक यंत्र स्थापित हैं?",
    helpEn:"Check type, quantity, and placement as per NBC norms.",
    helpHi:"NBC मानकों के अनुसार प्रकार, मात्रा और स्थापना जाँचें।",
    recommendEn:"Install CO2 and DCP extinguishers at all designated points.",
    recommendHi:"सभी नामित बिंदुओं पर CO2 और DCP अग्निशामक स्थापित करें।",
  },
  { id:"Q-008", section:"Fire Safety", category:"Compliance",        type:"YES_NO_NA",   riskLevel:"HIGH",   weightage:8, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:false, numericValue:false, allowNA:false, status:"Active", usedIn:4, createdOn:"01 Jan 2024",
    textEn:"Are fire extinguishers within validity date and last serviced within 1 year?",
    textHi:"क्या अग्निशामक यंत्र वैधता तिथि के भीतर हैं और पिछले 1 वर्ष में सर्विस किए गए हैं?",
    helpEn:"Check service tag on each extinguisher for last service date.",
    helpHi:"प्रत्येक अग्निशामक पर सर्विस टैग में अंतिम सर्विस तिथि जाँचें।",
    recommendEn:"Service all extinguishers immediately and update tags.",
    recommendHi:"सभी अग्निशामकों को तुरंत सर्विस करें और टैग अपडेट करें।",
  },
  { id:"Q-009", section:"Fire Safety", category:"Safety",            type:"YES_NO_NA",   riskLevel:"HIGH",   weightage:7, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:false, numericValue:false, allowNA:false, status:"Active", usedIn:3, createdOn:"01 Jan 2024",
    textEn:"Is the fire alarm system operational and tested monthly?",
    textHi:"क्या अग्नि अलार्म सिस्टम चालू है और मासिक परीक्षण किया जाता है?",
    helpEn:"Ask for fire alarm test register and check last test date.",
    helpHi:"अग्नि अलार्म परीक्षण रजिस्टर मांगें और अंतिम परीक्षण तिथि जाँचें।",
    recommendEn:"Conduct monthly fire alarm test and maintain register.",
    recommendHi:"मासिक अग्नि अलार्म परीक्षण करें और रजिस्टर बनाए रखें।",
  },
  { id:"Q-010", section:"Security Systems", category:"Safety",       type:"YES_NO_NA",   riskLevel:"HIGH",   weightage:9, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:true,  numericValue:false, allowNA:false, status:"Active", usedIn:4, createdOn:"01 Jan 2024",
    textEn:"Is the CCTV system fully operational with all cameras functional?",
    textHi:"क्या CCTV सिस्टम पूरी तरह से चालू है और सभी कैमरे कार्यात्मक हैं?",
    helpEn:"Check DVR/NVR live feed for all camera angles.",
    helpHi:"सभी कैमरा कोणों के लिए DVR/NVR लाइव फीड जाँचें।",
    recommendEn:"Replace faulty cameras and ensure 100% coverage.",
    recommendHi:"खराब कैमरे बदलें और 100% कवरेज सुनिश्चित करें।",
  },
  { id:"Q-011", section:"General Compliance", category:"Compliance", type:"YES_NO_NA",   riskLevel:"MEDIUM", weightage:5, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:false, numericValue:false, allowNA:false, status:"Active", usedIn:4, createdOn:"01 Jan 2024",
    textEn:"Is the branch licence and other statutory certificates displayed prominently?",
    textHi:"क्या शाखा लाइसेंस और अन्य वैधानिक प्रमाणपत्र प्रमुखता से प्रदर्शित हैं?",
    helpEn:"Verify all statutory certificates are current and prominently displayed.",
    helpHi:"सभी वैधानिक प्रमाणपत्र वर्तमान हैं और प्रमुखता से प्रदर्शित हैं, सत्यापित करें।",
    recommendEn:"Frame and display all certificates at the branch entrance.",
    recommendHi:"सभी प्रमाणपत्रों को फ्रेम करें और शाखा प्रवेश पर प्रदर्शित करें।",
  },
  { id:"Q-012", section:"Civil & Structural", category:"Maintenance", type:"RATING_1_5", riskLevel:"LOW",    weightage:4, mandatory:false, allowRemarks:true,  allowPhoto:true,  multiPhoto:true,  numericValue:false, allowNA:false, status:"Active", usedIn:2, createdOn:"02 Jan 2024",
    textEn:"Rate the overall structural condition of the building (walls, roof, flooring).",
    textHi:"भवन की समग्र संरचनात्मक स्थिति (दीवारें, छत, फर्श) को रेट करें।",
    helpEn:"Look for cracks, seepage, peeling paint, broken tiles.",
    helpHi:"दरारें, रिसाव, छिलती पेंट, टूटी टाइलें देखें।",
    recommendEn:"Undertake civil repair work for all structural deficiencies.",
    recommendHi:"सभी संरचनात्मक कमियों के लिए सिविल मरम्मत कार्य करें।",
  },
  { id:"Q-013", section:"IT Infrastructure", category:"Compliance",  type:"YES_NO_NA",   riskLevel:"MEDIUM", weightage:6, mandatory:true,  allowRemarks:true,  allowPhoto:true,  multiPhoto:false, numericValue:false, allowNA:false, status:"Draft", usedIn:0, createdOn:"10 Feb 2024",
    textEn:"Are all ATM/CDM machines functional and stocked?",
    textHi:"क्या सभी ATM/CDM मशीनें कार्यात्मक और भरी हुई हैं?",
    helpEn:"Check ATM status screen and cash availability.",
    helpHi:"ATM स्थिति स्क्रीन और नकद उपलब्धता जाँचें।",
    recommendEn:"Ensure ATM uptime above 95% and cash replenishment on schedule.",
    recommendHi:"ATM अपटाइम 95% से ऊपर और निर्धारित समय पर नकद पुनःपूर्ति सुनिश्चित करें।",
  },
];

// ── Constants ──────────────────────────────────────────────────────────────────
const SECTIONS    = ["All Sections","Electrical Safety","Fire Safety","Civil & Structural","Security Systems","IT Infrastructure","General Compliance"];
const CATEGORIES  = ["Safety","Compliance","Maintenance","General"];
const Q_TYPES     = ["YES_NO_NA","YES_NO","RATING_1_5","NUMERIC","TEXT","MULTI_CHOICE"] as const;
const RISK_LEVELS = ["HIGH","MEDIUM","LOW"] as const;
const STATUS_LIST = ["All Status","Active","Draft","Inactive"];
const PAGE_SIZE   = 8;

const TYPE_LABEL: Record<QType, string> = {
  "YES_NO_NA":   "YES / NO / NA",
  "YES_NO":      "YES / NO",
  "RATING_1_5":  "Rating 1–5",
  "NUMERIC":     "Numeric",
  "TEXT":        "Text",
  "MULTI_CHOICE":"Multiple Choice",
};
const TYPE_STYLE: Record<QType, { color: string; bg: string }> = {
  "YES_NO_NA":   { color:"#16a34a", bg:"#dcfce7" },
  "YES_NO":      { color:"#2563eb", bg:"#dbeafe" },
  "RATING_1_5":  { color:"#7c3aed", bg:"#f5f3ff" },
  "NUMERIC":     { color:"#0891b2", bg:"#ecfeff" },
  "TEXT":        { color:"#374151", bg:"#f3f4f6" },
  "MULTI_CHOICE":{ color:"#d97706", bg:"#fef3c7" },
};
const RISK_STYLE: Record<RiskLevel, { color: string; bg: string }> = {
  "HIGH":   { color:"#dc2626", bg:"#fee2e2" },
  "MEDIUM": { color:"#d97706", bg:"#fef3c7" },
  "LOW":    { color:"#16a34a", bg:"#dcfce7" },
};
const SECTION_COLOR: Record<string, string> = {
  "Electrical Safety":  "#ca8a04",
  "Fire Safety":        "#dc2626",
  "Civil & Structural": "#0891b2",
  "Security Systems":   "#7c3aed",
  "IT Infrastructure":  "#2563eb",
  "General Compliance": "#16a34a",
};

// ── EMPTY FORM ─────────────────────────────────────────────────────────────────
const EMPTY = {
  textEn:"", textHi:"", type:"YES_NO_NA" as QType, category:"Safety", section:"Electrical Safety",
  riskLevel:"HIGH" as RiskLevel, weightage:5,
  helpEn:"", helpHi:"", recommendEn:"", recommendHi:"",
  mandatory:true, allowRemarks:true, allowPhoto:true,
  multiPhoto:false, numericValue:false, allowNA:false,
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const TH: React.CSSProperties = { padding:"10px 12px", fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase" as const, letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap" as const, textAlign:"left" as const };
const TD: React.CSSProperties = { padding:"10px 12px", verticalAlign:"middle" as const, fontSize:12, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };
const LBL: React.CSSProperties = { display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:4, textTransform:"uppercase" as const, letterSpacing:"0.04em" };
const INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 11px", fontSize:13, color:"#374151", outline:"none", boxSizing:"border-box" as const, background:"#fff" };
const INP_FOCUS = "#16a34a";

export default function QuestionLibraryPage() {
  const [questions, setQuestions] = useState<Question[]>(SEED);
  const [form,   setForm]   = useState({ ...EMPTY });
  const [editing, setEditing] = useState<string | null>(null);

  // Table filters
  const [search,   setSearch]  = useState("");
  const [sectionF, setSectionF]= useState("All Sections");
  const [statusF,  setStatusF] = useState("All Status");
  const [page,     setPage]    = useState(1);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = questions.filter(q => {
    const s = search.toLowerCase();
    return (!s || q.textEn.toLowerCase().includes(s) || q.id.toLowerCase().includes(s))
      && (sectionF === "All Sections" || q.section === sectionF)
      && (statusF  === "All Status"   || q.status  === statusF);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p     = Math.min(page, totalPages);
  const paged = filtered.slice((p-1)*PAGE_SIZE, p*PAGE_SIZE);
  const nums  = () => { const n:number[]=[]; for(let i=Math.max(1,p-2);i<=Math.min(totalPages,p+2);i++)n.push(i); return n; };

  const fp = (key: keyof typeof EMPTY, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSave = (status: QStatus) => {
    if (!form.textEn.trim() || !form.textHi.trim()) return;
    if (editing) {
      setQuestions(qs => qs.map(q => q.id===editing ? { ...q, ...form, status } : q));
    } else {
      const newId = `Q-${String(questions.length+1).padStart(3,"0")}`;
      setQuestions(qs => [...qs, { id:newId, ...form, status, usedIn:0, createdOn: new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) }]);
    }
    setForm({ ...EMPTY });
    setEditing(null);
  };

  const handleEdit = (q: Question) => {
    setForm({ textEn:q.textEn, textHi:q.textHi, type:q.type, category:q.category, section:q.section,
      riskLevel:q.riskLevel, weightage:q.weightage, helpEn:q.helpEn, helpHi:q.helpHi,
      recommendEn:q.recommendEn, recommendHi:q.recommendHi,
      mandatory:q.mandatory, allowRemarks:q.allowRemarks, allowPhoto:q.allowPhoto,
      multiPhoto:q.multiPhoto, numericValue:q.numericValue, allowNA:q.allowNA });
    setEditing(q.id);
  };

  const handleDelete  = (id: string) => setQuestions(qs => qs.filter(q => q.id!==id));
  const handleCancel  = () => { setForm({ ...EMPTY }); setEditing(null); };
  const handleToggle  = (id: string) => setQuestions(qs => qs.map(q => q.id===id ? { ...q, status: q.status==="Active"?"Inactive":"Active" as QStatus } : q));

  const chk = (key: keyof typeof EMPTY) => (
    <label key={key} style={{ display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer", fontSize:12, color:"#374151", userSelect:"none" }}>
      <input type="checkbox" checked={!!form[key]} onChange={e=>fp(key, e.target.checked)}
        style={{ width:14, height:14, accentColor:"#16a34a", cursor:"pointer" }}/>
      {key==="mandatory"?"Mandatory":key==="allowRemarks"?"Allow Remarks":key==="allowPhoto"?"Allow Photo":key==="multiPhoto"?"Multi-Photo":key==="numericValue"?"Numeric Value":"Allow N/A"}
    </label>
  );

  return (
    <div style={{ padding:"24px 0" }}>
      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Question Library</h4>
        <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>Dashboard / Audit Questions / <span style={{ color:"#16a34a", fontWeight:600 }}>Question Library</span></div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total Questions", value:questions.length,                              color:"#2563eb", bg:"#eff6ff", icon:"ri-questionnaire-line",   border:"#2563eb" },
          { label:"Active",          value:questions.filter(q=>q.status==="Active").length, color:"#16a34a", bg:"#f0fdf4", icon:"ri-checkbox-circle-line", border:"#16a34a" },
          { label:"Mandatory",       value:questions.filter(q=>q.mandatory).length,       color:"#dc2626", bg:"#fef2f2", icon:"ri-error-warning-line",   border:"#dc2626" },
          { label:"Sections",        value:new Set(questions.map(q=>q.section)).size,     color:"#7c3aed", bg:"#f5f3ff", icon:"ri-folder-line",          border:"#7c3aed" },
        ].map(c => (
          <div key={c.label} style={{ background:"#fff", borderRadius:10, border:"1px solid #e5e7eb", padding:"12px 14px", display:"flex", alignItems:"center", gap:10, borderLeft:`4px solid ${c.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={c.icon} style={{ fontSize:17, color:c.color }}/>
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
              <div style={{ fontSize:10, color:"#9ca3af", fontWeight:600, marginTop:2 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN SPLIT LAYOUT ─────────────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"400px 1fr", gap:18, alignItems:"start" }}>

        {/* ── LEFT — FORM ──────────────────────────────────────────────────────── */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", position:"sticky", top:80 }}>
          {/* Form header */}
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #f3f4f6", background:editing?"#fffbeb":"#f9fafb", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:"#111827" }}>{editing ? `Edit — ${editing}` : "Add / Edit Question"}</div>
              <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>{editing ? "Modify and save the question below" : "Fill all fields then save"}</div>
            </div>
            {editing && (
              <button onClick={handleCancel} style={{ fontSize:11, color:"#6b7280", background:"#f3f4f6", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>
                × Cancel
              </button>
            )}
          </div>

          {/* Bilingual notice */}
          <div style={{ margin:"14px 18px 0", padding:"10px 14px", background:"#eff6ff", borderLeft:"3px solid #2563eb", borderRadius:"0 8px 8px 0", fontSize:12, color:"#1d4ed8", lineHeight:1.5 }}>
            <strong>Bilingual input required.</strong> Every question must be entered in both English and Hindi before it can be saved. The platform is designed for field auditors who may be more comfortable reading Hindi.
          </div>

          <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:12 }}>
            {/* English text */}
            <div>
              <label style={LBL}>Question Text — English <span style={{ color:"#dc2626" }}>*</span></label>
              <textarea value={form.textEn} onChange={e=>fp("textEn",e.target.value)} rows={2}
                placeholder="Whether ELCBs are provided with proper rating to cater the load?"
                style={{ ...INP, resize:"none", lineHeight:1.5 }}/>
            </div>
            {/* Hindi text */}
            <div>
              <label style={LBL}>Question Text — Hindi <span style={{ color:"#dc2626" }}>*</span></label>
              <textarea value={form.textHi} onChange={e=>fp("textHi",e.target.value)} rows={2}
                placeholder="क्या ELCB उचित रेटिंग के साथ लोड के अनुसार प्रदान किए गए हैं?"
                style={{ ...INP, resize:"none", lineHeight:1.5 }}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {/* Type */}
              <div>
                <label style={LBL}>Question Type <span style={{ color:"#dc2626" }}>*</span></label>
                <select value={form.type} onChange={e=>fp("type",e.target.value as QType)} style={{ ...INP, padding:"7px 10px" }}>
                  {Q_TYPES.map(t=><option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                </select>
              </div>
              {/* Category */}
              <div>
                <label style={LBL}>Category</label>
                <select value={form.category} onChange={e=>fp("category",e.target.value)} style={{ ...INP, padding:"7px 10px" }}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              {/* Risk Level */}
              <div>
                <label style={LBL}>Risk Level</label>
                <select value={form.riskLevel} onChange={e=>fp("riskLevel",e.target.value as RiskLevel)} style={{ ...INP, padding:"7px 10px" }}>
                  {RISK_LEVELS.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              {/* Weightage */}
              <div>
                <label style={LBL}>Weightage (0–10)</label>
                <input type="number" min={0} max={10} value={form.weightage} onChange={e=>fp("weightage",+e.target.value)}
                  style={{ ...INP, padding:"7px 10px" }}/>
              </div>
            </div>

            {/* Section */}
            <div>
              <label style={LBL}>Section <span style={{ color:"#dc2626" }}>*</span></label>
              <select value={form.section} onChange={e=>fp("section",e.target.value)} style={{ ...INP, padding:"7px 10px" }}>
                {SECTIONS.slice(1).map(s=><option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Help text */}
            <div>
              <label style={LBL}>Help Text — English</label>
              <input value={form.helpEn} onChange={e=>fp("helpEn",e.target.value)}
                placeholder="Inspect ELCB rating label and compare with connected load..." style={INP}/>
            </div>
            <div>
              <label style={LBL}>Help Text — Hindi</label>
              <input value={form.helpHi} onChange={e=>fp("helpHi",e.target.value)}
                placeholder="ELCB की रेटिंग लेबल जाँचें और कनेक्टेड लोड से मिलाएं..." style={INP}/>
            </div>

            {/* Checkboxes */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px 6px", padding:"10px 12px", background:"#f9fafb", borderRadius:9, border:"1px solid #e5e7eb" }}>
              {(["mandatory","allowRemarks","allowPhoto","multiPhoto","numericValue","allowNA"] as const).map(chk)}
            </div>

            {/* Recommendations */}
            <div>
              <label style={LBL}>Default Recommendation (English)</label>
              <input value={form.recommendEn} onChange={e=>fp("recommendEn",e.target.value)}
                placeholder="Install ELCB of appropriate rating as per connected load..." style={INP}/>
            </div>
            <div>
              <label style={LBL}>Default Recommendation (Hindi)</label>
              <input value={form.recommendHi} onChange={e=>fp("recommendHi",e.target.value)}
                placeholder="कनेक्टेड लोड के अनुसार उचित रेटिंग का ELCB स्थापित करें..." style={INP}/>
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:8, paddingTop:4 }}>
              <button onClick={()=>handleSave("Draft")}
                style={{ flex:1, padding:"9px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontWeight:700, fontSize:13 }}>
                Save Draft
              </button>
              <button onClick={()=>handleSave("Active")}
                disabled={!form.textEn.trim() || !form.textHi.trim()}
                style={{ flex:2, padding:"9px", borderRadius:8, border:"none", background: (!form.textEn.trim()||!form.textHi.trim())?"#9ca3af":"#16a34a", color:"#fff", cursor: (!form.textEn.trim()||!form.textHi.trim())?"not-allowed":"pointer", fontWeight:700, fontSize:13 }}>
                {editing ? "Save & Update" : "Save & Activate"}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT — TABLE ─────────────────────────────────────────────────────── */}
        <div>
          {/* Table filters */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            <div style={{ fontSize:12, color:"#6b7280" }}>
              Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> questions — Page <strong style={{ color:"#111827" }}>{p}</strong> of {totalPages}
            </div>
            <div style={{ flex:1 }} />
            <select value={sectionF} onChange={e=>{setSectionF(e.target.value);setPage(1);}} style={SEL}>
              {SECTIONS.map(s=><option key={s}>{s}</option>)}
            </select>
            <select value={statusF}  onChange={e=>{setStatusF(e.target.value);setPage(1);}}  style={SEL}>
              {STATUS_LIST.map(s=><option key={s}>{s}</option>)}
            </select>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 10px" }}>
              <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:13 }}/>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search…"
                style={{ border:"none", outline:"none", fontSize:12, color:"#374151", width:160 }}/>
              {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:13 }}>×</button>}
            </div>
          </div>

          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>
                  <th style={TH}>ID</th>
                  <th style={TH}>QUESTION (EN / HI)</th>
                  <th style={TH}>SECTION</th>
                  <th style={{ ...TH, textAlign:"center" }}>TYPE</th>
                  <th style={{ ...TH, textAlign:"center" }}>RISK</th>
                  <th style={{ ...TH, textAlign:"center" }}>WT</th>
                  <th style={{ ...TH, textAlign:"center" }}>FLAGS</th>
                  <th style={{ ...TH, textAlign:"center" }}>STATUS</th>
                  <th style={{ ...TH, textAlign:"center" }}>ACT</th>
                </tr></thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan={9} style={{ padding:"50px 20px", textAlign:"center", color:"#9ca3af" }}>
                      <i className="ri-questionnaire-line" style={{ fontSize:32, display:"block", marginBottom:8, opacity:0.3 }}/>No questions found
                    </td></tr>
                  ) : paged.map(q => {
                    const ts = TYPE_STYLE[q.type];
                    const rs = RISK_STYLE[q.riskLevel];
                    const sc = SECTION_COLOR[q.section] || "#374151";
                    const isEditing = editing === q.id;
                    return (
                      <tr key={q.id} style={{ background: isEditing?"#f0fdf4":"transparent" }}
                        onMouseEnter={e=>{ if(!isEditing) e.currentTarget.style.background="#f9fafb"; }}
                        onMouseLeave={e=>{ if(!isEditing) e.currentTarget.style.background="transparent"; }}>
                        <td style={TD}>
                          <span style={{ fontSize:10, fontWeight:700, color:"#374151", background:"#f3f4f6", borderRadius:5, padding:"2px 7px", fontFamily:"monospace" }}>{q.id}</span>
                        </td>
                        <td style={{ ...TD, maxWidth:260 }}>
                          <div style={{ fontWeight:600, color:"#111827", fontSize:12, lineHeight:1.4 }}>{q.textEn}</div>
                          <div style={{ fontSize:11, color:"#9ca3af", marginTop:2, lineHeight:1.4 }}>{q.textHi}</div>
                        </td>
                        <td style={TD}>
                          <span style={{ fontSize:10, fontWeight:700, color:sc, background:`${sc}18`, borderRadius:20, padding:"2px 8px", whiteSpace:"nowrap" as const }}>{q.section.split(" ")[0]}</span>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <span style={{ fontSize:10, fontWeight:700, color:ts.color, background:ts.bg, borderRadius:5, padding:"2px 7px", whiteSpace:"nowrap" as const }}>{TYPE_LABEL[q.type]}</span>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <span style={{ fontSize:10, fontWeight:700, color:rs.color, background:rs.bg, borderRadius:5, padding:"2px 7px" }}>{q.riskLevel}</span>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                            <span style={{ fontSize:13, fontWeight:800, color:q.weightage>=7?"#dc2626":q.weightage>=4?"#d97706":"#16a34a" }}>{q.weightage}</span>
                            <div style={{ display:"flex", gap:1 }}>
                              {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                                <div key={n} style={{ width:3, height:3, borderRadius:2, background: n<=q.weightage ? (q.weightage>=7?"#dc2626":q.weightage>=4?"#d97706":"#16a34a") : "#e5e7eb" }}/>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <div style={{ display:"flex", gap:3, justifyContent:"center", flexWrap:"wrap" }}>
                            {q.mandatory    && <span title="Mandatory"    style={{ fontSize:9, fontWeight:700, color:"#dc2626", background:"#fee2e2", borderRadius:4, padding:"1px 5px" }}>REQ</span>}
                            {q.allowPhoto   && <span title="Photo"        style={{ fontSize:9, fontWeight:700, color:"#2563eb", background:"#dbeafe", borderRadius:4, padding:"1px 5px" }}>📷</span>}
                            {q.allowRemarks && <span title="Remarks"      style={{ fontSize:9, fontWeight:700, color:"#7c3aed", background:"#f5f3ff", borderRadius:4, padding:"1px 5px" }}>RMK</span>}
                            {q.allowNA      && <span title="Allow N/A"    style={{ fontSize:9, fontWeight:700, color:"#6b7280", background:"#f3f4f6", borderRadius:4, padding:"1px 5px" }}>N/A</span>}
                          </div>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <button onClick={()=>handleToggle(q.id)}
                            style={{ fontSize:10, fontWeight:700, color:q.status==="Active"?"#16a34a":q.status==="Draft"?"#d97706":"#9ca3af", background:q.status==="Active"?"#dcfce7":q.status==="Draft"?"#fef9c3":"#f3f4f6", border:"none", borderRadius:20, padding:"3px 9px", cursor:"pointer" }}>
                            {q.status}
                          </button>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                            <button onClick={()=>handleEdit(q)} title="Edit"
                              style={{ width:27, height:27, borderRadius:6, border:`1px solid ${isEditing?"#16a34a":"#e5e7eb"}`, background:isEditing?"#dcfce7":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:isEditing?"#16a34a":"#2563eb" }}>
                              <i className="ri-edit-line" style={{ fontSize:12 }}/>
                            </button>
                            <button onClick={()=>handleDelete(q.id)} title="Delete"
                              style={{ width:27, height:27, borderRadius:6, border:"1px solid #e5e7eb", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}>
                              <i className="ri-delete-bin-line" style={{ fontSize:12 }}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div style={{ padding:"10px 16px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafafa" }}>
              <span style={{ fontSize:11, color:"#6b7280" }}>Showing <strong style={{ color:"#111827" }}>{Math.min((p-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(p*PAGE_SIZE,filtered.length)}</strong> of <strong style={{ color:"#111827" }}>{filtered.length}</strong></span>
              <div style={{ display:"flex", gap:3 }}>
                <button onClick={()=>setPage(pp=>Math.max(1,pp-1))} disabled={p===1} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===1?"#f9fafb":"#fff", color:p===1?"#d1d5db":"#374151", cursor:p===1?"not-allowed":"pointer", fontSize:12 }}>‹</button>
                {nums().map(n=><button key={n} onClick={()=>setPage(n)} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, fontSize:12, fontWeight:n===p?700:400, background:n===p?"#16a34a":"#fff", color:n===p?"#fff":"#374151", cursor:"pointer" }}>{n}</button>)}
                <button onClick={()=>setPage(pp=>Math.min(totalPages,pp+1))} disabled={p===totalPages} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===totalPages?"#f9fafb":"#fff", color:p===totalPages?"#d1d5db":"#374151", cursor:p===totalPages?"not-allowed":"pointer", fontSize:12 }}>›</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
