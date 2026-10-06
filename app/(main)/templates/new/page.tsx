"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
type PhotoReq = "Not Required" | "Always Required" | "Required if YES" | "Required if NO" | "Required if N/A";
interface Question {
  id: string; code: string; section: string;
  textEn: string; textHi: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  isMandatory: boolean; allowRecommendation: boolean;
  photoReq: PhotoReq;
}

const ALL_QUESTIONS: Question[] = [
  { id:"q001", code:"Q-001", section:"General",                 riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether MCCBs/MCBs/ELCBs are provided with proper rating to cater the load",                                                textHi:"क्या MCCBs/MCBs/ELCBs को लोड पूरा करने के लिए उचित रेटिंग के साथ प्रदान किया गया है" },
  { id:"q002", code:"Q-002", section:"General",                 riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether light and emergency light are provided in electrical rooms/operating areas",                                          textHi:"क्या विद्युत कक्षों/परिचालन क्षेत्रों में प्रकाश एवं आपातकालीन प्रकाश की व्यवस्था है" },
  { id:"q003", code:"Q-003", section:"General",                 riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Whether Pump room, DG set room, UPS room, electrical room etc. are maintained dry and in good condition",                     textHi:"क्या पंप रूम, डीजी सेट रूम, यूपीएस रूम, विद्युत कक्ष आदि सूखे और अच्छी स्थिति में रखे जाते हैं" },
  { id:"q004", code:"Q-004", section:"General",                 riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Whether water seepage is observed near any of the Electrical Panel, Distribution Boards, Electrical equipment etc.",          textHi:"क्या किसी विद्युत पैनल, वितरण बोर्ड, विद्युत उपकरण के पास पानी का रिसाव देखा गया है" },
  { id:"q005", code:"Q-005", section:"General",                 riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether Earthing pits are provided and connected to the equipment body",                                                      textHi:"क्या अर्थिंग पिट प्रदान किए गए हैं और उपकरण के बॉडी से जुड़े हैं" },
  { id:"q006", code:"Q-006", section:"General",                 riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether the Earthing Pits are properly maintained",                                                                           textHi:"क्या अर्थिंग पिट का उचित रखरखाव किया जाता है" },
  { id:"q007", code:"Q-007", section:"General",                 riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether proper exhaust fan for ventilation of panel room/electrical room/UPS room is provided",                               textHi:"क्या पैनल रूम/विद्युत कक्ष/यूपीएस रूम के वेंटिलेशन के लिए उचित एग्जॉस्ट फैन प्रदान किया गया है" },
  { id:"q008", code:"Q-008", section:"General",                 riskLevel:"MEDIUM", isMandatory:false, allowRecommendation:true,  photoReq:"Not Required",      textEn:"Whether penalty is being imposed in electricity bills on account of higher load/poor power factor",                           textHi:"क्या खराब पावर फैक्टर/अधिक लोड के कारण बिजली बिल में जुर्माना लगाया जा रहा है" },
  { id:"q009", code:"Q-009", section:"General",                 riskLevel:"LOW",    isMandatory:false, allowRecommendation:false, photoReq:"Not Required",      textEn:"Additional electrical load required if any (from Power Distribution Company)",                                                textHi:"यदि कोई अतिरिक्त विद्युत भार आवश्यक है (बिजली वितरण कंपनी से)" },
  { id:"q010", code:"Q-010", section:"General",                 riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether load is distributed in all 3 phases to avoid unbalancing of phases",                                                  textHi:"क्या चरण असंतुलन से बचने के लिए सभी 3 चरणों में भार वितरित किया गया है" },
  { id:"q011", code:"Q-011", section:"General",                 riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether isolating switches are provided for switching off non-essential loads during night",                                   textHi:"क्या रात में गैर-आवश्यक भार बंद करने के लिए आइसोलेटिंग स्विच प्रदान किए गए हैं" },
  { id:"q012", code:"Q-012", section:"General",                 riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether electrical equipments of Pantry etc. are properly connected to Iron socket box with MCBs",                            textHi:"क्या पैंट्री आदि के विद्युत उपकरण MCBs के साथ आयरन सॉकेट बॉक्स से जुड़े हैं" },
  { id:"q013", code:"Q-013", section:"General",                 riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether proper preventive maintenance of Panel boards and Distribution Boards is carried out by licensed electricians",       textHi:"क्या लाइसेंस प्राप्त इलेक्ट्रीशियन द्वारा पैनल बोर्ड और वितरण बोर्डों का उचित रखरखाव किया जाता है" },
  { id:"q014", code:"Q-014", section:"General",                 riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether appropriate timers used in changeover of Air conditioners for Server Room ACs and Signage Boards",                   textHi:"क्या सर्वर रूम एसी और साइनेज बोर्ड के चेंजओवर में उचित टाइमर उपयोग किए जाते हैं" },
  { id:"q015", code:"Q-015", section:"General",                 riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether preventive maintenance of electric installation and equipment is carried out by skilled license holder electricians",  textHi:"क्या कुशल लाइसेंस धारक इलेक्ट्रीशियनों द्वारा विद्युत स्थापना एवं उपकरण का रखरखाव किया जाता है" },
  { id:"q016", code:"Q-016", section:"General",                 riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"General condition of electrical control panels, Main switch, electric meter board and changeover switch is good",              textHi:"विद्युत नियंत्रण पैनल, मुख्य स्विच, विद्युत मीटर बोर्ड और चेंजओवर स्विच की सामान्य स्थिति अच्छी है" },
  { id:"q017", code:"Q-017", section:"General",                 riskLevel:"LOW",    isMandatory:false, allowRecommendation:false, photoReq:"Not Required",      textEn:"Whether contact numbers of electricians, power distribution company, Generator/UPS/AC vendors are displayed",                 textHi:"क्या इलेक्ट्रीशियन, बिजली वितरण कंपनी, जनरेटर/यूपीएस/एसी विक्रेताओं के संपर्क नंबर प्रदर्शित हैं" },
  { id:"q018", code:"Q-018", section:"General",                 riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether the Power Factor (PF) panel of appropriate rating is installed",                                                      textHi:"क्या उचित रेटिंग का पावर फैक्टर (PF) पैनल स्थापित है" },
  { id:"q019", code:"Q-019", section:"Fire Prevention Measures",riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"All old disposable records, broken furniture etc. accumulated at the premises have been cleared",                           textHi:"क्या परिसर में जमा पुराने दस्तावेज़, टूटे फर्नीचर आदि को साफ किया गया है" },
  { id:"q020", code:"Q-020", section:"Fire Prevention Measures",riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Combustible leaf, litter/waste papers in and around the branch are removed/cleaned periodically",                           textHi:"क्या शाखा के अंदर और बाहर दहनशील पत्ते/रद्दी कागज नियमित रूप से हटाए/साफ किए जाते हैं" },
  { id:"q021", code:"Q-021", section:"Fire Prevention Measures",riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"No stationery/Records/old obsolete items are stored in the system/UPS room",                                               textHi:"क्या सिस्टम/यूपीएस रूम में कोई स्टेशनरी/रिकॉर्ड/पुरानी वस्तुएं संग्रहीत नहीं हैं" },
  { id:"q022", code:"Q-022", section:"Fire Prevention Measures",riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Storage racks in Stationery/Record room are at safe distance of at least 3 ft from electrical points",                     textHi:"क्या स्टेशनरी/रिकॉर्ड रूम में भंडारण रैक विद्युत बिंदुओं से कम से कम 3 फीट की दूरी पर हैं" },
  { id:"q023", code:"Q-023", section:"Fire Prevention Measures",riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if YES",   textEn:"In the pantry/canteen LPG is used",                                                                                        textHi:"क्या पैंट्री/कैंटीन में एलपीजी का उपयोग किया जाता है" },
  { id:"q024", code:"Q-024", section:"Server and UPS Room",     riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Server room has dual AC units having timer circuit device with independent circuit",                                          textHi:"सर्वर रूम में स्वतंत्र सर्किट के साथ टाइमर सर्किट डिवाइस वाली दोहरी एसी इकाइयां हैं" },
  { id:"q025", code:"Q-025", section:"Server and UPS Room",     riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether metal body exhaust fan is installed in UPS room",                                                                    textHi:"क्या यूपीएस रूम में मेटल बॉडी एग्जॉस्ट फैन स्थापित है" },
  { id:"q026", code:"Q-026", section:"Server and UPS Room",     riskLevel:"LOW",    isMandatory:false, allowRecommendation:true,  photoReq:"Not Required",      textEn:"Whether all ceiling fans installed are of BLDC type",                                                                        textHi:"क्या सभी सीलिंग फैन BLDC प्रकार के हैं" },
  { id:"q027", code:"Q-027", section:"Electrical Safety",       riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Power supply to record/stationery room is made through plug and socket arrangement",                                         textHi:"रिकॉर्ड/स्टेशनरी रूम को प्लग और सॉकेट व्यवस्था के माध्यम से बिजली आपूर्ति की जाती है" },
  { id:"q028", code:"Q-028", section:"Electrical Safety",       riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether LED lights have been installed in all areas",                                                                         textHi:"क्या सभी क्षेत्रों में एलईडी लाइट लगाई गई हैं" },
  { id:"q029", code:"Q-029", section:"Electrical Safety",       riskLevel:"MEDIUM", isMandatory:false, allowRecommendation:true,  photoReq:"Not Required",      textEn:"Whether motion sensors/occupancy sensors have been installed",                                                               textHi:"क्या मोशन सेंसर/ऑक्यूपेंसी सेंसर स्थापित किए गए हैं" },
  { id:"q030", code:"Q-030", section:"Fire Protection",         riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Are fire extinguishers available in all required work areas, clearly marked and accessible?",                                textHi:"क्या सभी आवश्यक कार्य क्षेत्रों में अग्निशामक यंत्र उपलब्ध हैं, स्पष्ट रूप से चिह्नित और सुलभ हैं" },
  { id:"q031", code:"Q-031", section:"DG Set / Generator",      riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:false, photoReq:"Always Required",   textEn:"DG Set / Generator is installed at the branch/office",                                                                       textHi:"डीजी सेट/जनरेटर शाखा/कार्यालय में स्थापित है" },
  { id:"q032", code:"Q-032", section:"DG Set / Generator",      riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"At least two 6 Kg. ABC capacity fire extinguishers are placed near the diesel generator",                                    textHi:"डीजल जनरेटर के पास कम से कम दो 6 किग्रा ABC क्षमता के अग्निशामक यंत्र रखे गए हैं" },
  { id:"q033", code:"Q-033", section:"DG Set / Generator",      riskLevel:"MEDIUM", isMandatory:false, allowRecommendation:false, photoReq:"Not Required",      textEn:"Electrical safety and energy saving awareness meeting with staff was conducted post audit",                                   textHi:"ऑडिट के बाद स्टाफ के साथ विद्युत सुरक्षा और ऊर्जा बचत जागरूकता बैठक आयोजित की गई" },
  { id:"q034", code:"Q-034", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"5 Kg ABC Automatic Modular Fire Extinguisher is provided and protected in the back room",                                    textHi:"बैक रूम में 5 किग्रा ABC स्वचालित मॉड्यूलर अग्निशामक यंत्र प्रदान किया गया है और सुरक्षित है" },
  { id:"q035", code:"Q-035", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"ATM room is having fire detector connected through branch AFDS (Applicable for Onsite ATMs only)",                          textHi:"एटीएम रूम में शाखा AFDS से जुड़ा अग्नि संसूचक है (केवल ऑनसाइट ATM के लिए)" },
  { id:"q036", code:"Q-036", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Whether MCCB/MCB/ELCB are provided and apparently in working condition",                                                     textHi:"क्या MCCB/MCB/ELCB प्रदान किए गए हैं और स्पष्ट रूप से कार्यशील स्थिति में हैं" },
  { id:"q037", code:"Q-037", section:"Onsite ATM",              riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"AC units are provided with timer circuit device",                                                                            textHi:"एसी इकाइयां टाइमर सर्किट डिवाइस से सुसज्जित हैं" },
  { id:"q038", code:"Q-038", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Main supply switch/MCB to cut-off the electric supply of ATM has been marked",                                              textHi:"एटीएम की बिजली आपूर्ति काटने के लिए मुख्य आपूर्ति स्विच/MCB को चिह्नित किया गया है" },
  { id:"q039", code:"Q-039", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Power supply to AC, UPS and ATM machines is through metal clad plug receptacle socket",                                     textHi:"एसी, यूपीएस और एटीएम मशीनों को मेटल क्लैड प्लग रिसेप्टेकल सॉकेट के माध्यम से बिजली आपूर्ति" },
  { id:"q040", code:"Q-040", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Electrical wires are properly covered/insulated to prevent exposure",                                                        textHi:"विद्युत तार उचित रूप से ढके/इन्सुलेटेड हैं ताकि एक्सपोजर न हो" },
  { id:"q041", code:"Q-041", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Is there any cooking stove/electric heater coil stove noticed in the ATM",                                                  textHi:"क्या एटीएम में कोई कुकिंग स्टोव/इलेक्ट्रिक हीटर कॉइल स्टोव देखा गया है" },
  { id:"q042", code:"Q-042", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Is there any water accumulation/seepage in the premises or dripping on electrical gadgets",                                  textHi:"क्या परिसर में पानी जमाव/रिसाव या विद्युत उपकरणों पर टपकना देखा गया है" },
  { id:"q043", code:"Q-043", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Always Required",   textEn:"Any combustible container provided in the ATM",                                                                              textHi:"क्या एटीएम में कोई दहनशील कंटेनर रखा गया है" },
  { id:"q044", code:"Q-044", section:"Onsite ATM",              riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:false, photoReq:"Required if NO",    textEn:"Steel dustbin container provided in the ATM",                                                                                textHi:"एटीएम में स्टील डस्टबिन कंटेनर उपलब्ध है" },
  { id:"q045", code:"Q-045", section:"Onsite ATM",              riskLevel:"LOW",    isMandatory:false, allowRecommendation:false, photoReq:"Required if NO",    textEn:"No smoking board is provided in the ATM cabin",                                                                             textHi:"एटीएम केबिन में नो स्मोकिंग बोर्ड लगा है" },
  { id:"q046", code:"Q-046", section:"Onsite ATM",              riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Main entrance shutter is in working condition",                                                                              textHi:"मुख्य प्रवेश शटर कार्यशील स्थिति में है" },
  { id:"q047", code:"Q-047", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"Proper locking arrangement is there at the main shutter",                                                                   textHi:"मुख्य शटर पर उचित लॉकिंग व्यवस्था है" },
  { id:"q048", code:"Q-048", section:"Onsite ATM",              riskLevel:"MEDIUM", isMandatory:true,  allowRecommendation:false, photoReq:"Required if NO",    textEn:"All electrical lights are in working condition",                                                                             textHi:"सभी विद्युत लाइटें कार्यशील स्थिति में हैं" },
  { id:"q049", code:"Q-049", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"ATM is provided with external CCTV camera",                                                                                 textHi:"एटीएम में बाहरी सीसीटीवी कैमरा लगा है" },
  { id:"q050", code:"Q-050", section:"Onsite ATM",              riskLevel:"HIGH",   isMandatory:true,  allowRecommendation:true,  photoReq:"Required if NO",    textEn:"CCTV is in working condition",                                                                                              textHi:"सीसीटीवी कार्यशील स्थिति में है" },
];

const PHOTO_CFG: Record<PhotoReq, { color: string; bg: string; icon: string; short: string }> = {
  "Not Required":    { color:"#6b7280", bg:"#f3f4f6", icon:"ri-camera-off-line",  short:"Not Required"   },
  "Always Required": { color:"#dc2626", bg:"#fee2e2", icon:"ri-camera-fill",      short:"Always Required"},
  "Required if YES": { color:"#15803d", bg:"#dcfce7", icon:"ri-camera-line",      short:"If YES"         },
  "Required if NO":  { color:"#c2410c", bg:"#ffedd5", icon:"ri-camera-line",      short:"If NO"          },
  "Required if N/A": { color:"#7c3aed", bg:"#ede9fe", icon:"ri-camera-line",      short:"If N/A"         },
};

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
  const [circle,      setCircle]     = useState("");
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
    setCircle("");
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
                    <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>Mapped Circle(s)</div>
                    <div style={{ fontSize:11, color:"#6b7280" }}>Administrative Office (AO) / Circle Office (CO) / Module Office (MO)</div>
                  </div>
                </div>

                {/* Dropdown trigger */}
                <div ref={circleDropRef} style={{ position:"relative" }}>
                  <div
                    onClick={() => setCircleOpen(o => !o)}
                    style={{
                      height:44, border:`1.5px solid ${circleOpen ? bm!.accent : "#e5e7eb"}`,
                      borderRadius:10, padding:"0 12px", cursor:"pointer", background:"#fff",
                      display:"flex", alignItems:"center", gap:10,
                      transition:"border-color 0.15s", boxShadow: circleOpen ? `0 0 0 3px ${bm!.accent}15` : "none",
                    }}
                  >
                    {circle ? (
                      <>
                        <i className="ri-map-pin-2-fill" style={{ fontSize:14, color:bm!.accent, flexShrink:0 }}/>
                        <span style={{ fontSize:13, fontWeight:600, color:bm!.accent, flex:1 }}>{circle}</span>
                        <button
                          onClick={e => { e.stopPropagation(); setCircle(""); }}
                          style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:16, lineHeight:1, display:"flex", alignItems:"center" }}
                        >×</button>
                      </>
                    ) : (
                      <span style={{ fontSize:13, color:"#9ca3af", flex:1 }}>Search or select a circle…</span>
                    )}
                    <i className={`ri-arrow-${circleOpen ? "up" : "down"}-s-line`} style={{ color:"#9ca3af", fontSize:16, flexShrink:0 }}/>
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

                      {/* Circle list — single select, closes on pick */}
                      <div style={{ maxHeight:220, overflowY:"auto" }}>
                        {filteredCircles.length === 0 ? (
                          <div style={{ padding:"16px 14px", fontSize:13, color:"#9ca3af", textAlign:"center" }}>No circles match</div>
                        ) : filteredCircles.map(c => {
                          const isSel = circle === c;
                          return (
                            <div
                              key={c}
                              onClick={e => {
                                e.stopPropagation();
                                setCircle(c);
                                setCircleOpen(false);
                                setCircleSearch("");
                              }}
                              style={{
                                padding:"11px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:12,
                                background: isSel ? `${bm!.accent}08` : "#fff",
                                borderLeft: isSel ? `3px solid ${bm!.accent}` : "3px solid transparent",
                                transition:"all 0.1s",
                              }}
                              onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLDivElement).style.background="#f9fafb"; }}
                              onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLDivElement).style.background="#fff"; }}
                            >
                              {/* Radio indicator */}
                              <div style={{
                                width:18, height:18, borderRadius:"50%", flexShrink:0,
                                border:     isSel ? `2px solid ${bm!.accent}` : "2px solid #d1d5db",
                                background: "#fff",
                                display:"flex", alignItems:"center", justifyContent:"center",
                                transition:"all 0.1s",
                              }}>
                                {isSel && <div style={{ width:8, height:8, borderRadius:"50%", background:bm!.accent }}/>}
                              </div>
                              <i className="ri-map-pin-line" style={{ fontSize:14, color: isSel ? bm!.accent : "#9ca3af", flexShrink:0 }}/>
                              <span style={{ fontSize:13, fontWeight: isSel ? 600 : 400, color: isSel ? bm!.accent : "#374151", flex:1 }}>{c}</span>
                              {isSel && <i className="ri-record-circle-fill" style={{ fontSize:15, color:bm!.accent, flexShrink:0 }}/>}
                            </div>
                          );
                        })}
                      </div>
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

                    {/* Question rows — detailed cards */}
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {qs.map(q => {
                        const isSel  = selIds.includes(q.id);
                        const risk   = RISK[q.riskLevel];
                        const photoCfg = PHOTO_CFG[q.photoReq];
                        return (
                          <div key={q.id} onClick={() => toggleQ(q.id)} style={{
                            borderRadius:11, cursor:"pointer",
                            border:     isSel ? `1.5px solid ${cfg.color}` : "1.5px solid #e5e7eb",
                            background: isSel ? cfg.bg : "#fff",
                            transition:"all 0.12s",
                            boxShadow:  isSel ? `0 0 0 3px ${cfg.color}12` : "0 1px 3px rgba(0,0,0,0.04)",
                            overflow:"hidden",
                          }}
                            onMouseEnter={e => { if (!isSel) { (e.currentTarget as HTMLDivElement).style.borderColor="#d1d5db"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 2px 8px rgba(0,0,0,0.08)"; }}}
                            onMouseLeave={e => { if (!isSel) { (e.currentTarget as HTMLDivElement).style.borderColor="#e5e7eb"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"; }}}
                          >
                            {/* Top accent line when selected */}
                            {isSel && <div style={{ height:3, background:cfg.color }}/>}

                            <div style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 16px" }}>
                              {/* Checkbox */}
                              <div style={{
                                width:20, height:20, borderRadius:6, flexShrink:0, marginTop:2,
                                border:     isSel ? `2px solid ${cfg.color}` : "2px solid #d1d5db",
                                background: isSel ? cfg.color : "#fff",
                                display:"flex", alignItems:"center", justifyContent:"center",
                                transition:"all 0.12s",
                              }}>
                                {isSel && <i className="ri-check-line" style={{ fontSize:12, color:"#fff" }}/>}
                              </div>

                              <div style={{ flex:1, minWidth:0 }}>
                                {/* Row 1: Code + Risk */}
                                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                                  <span style={{ fontSize:11, fontWeight:800, color:cfg.color, fontFamily:"monospace", background:`${cfg.color}15`, borderRadius:4, padding:"2px 7px" }}>{q.code}</span>
                                  <span style={{ fontSize:10, fontWeight:700, color:risk.color, background:risk.bg, borderRadius:4, padding:"2px 7px" }}>{q.riskLevel}</span>
                                </div>

                                {/* Row 2: English text */}
                                <div style={{ fontSize:13, fontWeight: isSel ? 600 : 500, color: isSel ? "#111827" : "#1f2937", lineHeight:1.5, marginBottom:4 }}>
                                  {q.textEn}
                                </div>

                                {/* Row 3: Hindi text */}
                                <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.5, marginBottom:10, fontStyle:"italic" }}>
                                  {q.textHi}
                                </div>

                                {/* Row 4: Meta chips */}
                                <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:6 }}>
                                  {/* Mandatory */}
                                  <span style={{
                                    display:"inline-flex", alignItems:"center", gap:4,
                                    fontSize:10, fontWeight:700, borderRadius:5, padding:"3px 8px",
                                    background: q.isMandatory ? "#dcfce7" : "#f3f4f6",
                                    color:      q.isMandatory ? "#15803d" : "#9ca3af",
                                    border:`1px solid ${q.isMandatory ? "#86efac" : "#e5e7eb"}`,
                                  }}>
                                    <i className={q.isMandatory ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"} style={{ fontSize:11 }}/>
                                    Mandatory
                                  </span>

                                  {/* Allow Recommendation */}
                                  <span style={{
                                    display:"inline-flex", alignItems:"center", gap:4,
                                    fontSize:10, fontWeight:700, borderRadius:5, padding:"3px 8px",
                                    background: q.allowRecommendation ? "#eff6ff" : "#f3f4f6",
                                    color:      q.allowRecommendation ? "#2563eb" : "#9ca3af",
                                    border:`1px solid ${q.allowRecommendation ? "#bfdbfe" : "#e5e7eb"}`,
                                  }}>
                                    <i className={q.allowRecommendation ? "ri-lightbulb-fill" : "ri-lightbulb-line"} style={{ fontSize:11 }}/>
                                    Recommendation
                                  </span>

                                  {/* Divider */}
                                  <span style={{ width:1, height:14, background:"#e5e7eb", display:"inline-block" }}/>

                                  {/* Photo requirement */}
                                  <span style={{
                                    display:"inline-flex", alignItems:"center", gap:4,
                                    fontSize:10, fontWeight:700, borderRadius:5, padding:"3px 8px",
                                    background: photoCfg.bg, color: photoCfg.color,
                                    border:`1px solid ${photoCfg.color}30`,
                                  }}>
                                    <i className={photoCfg.icon} style={{ fontSize:11 }}/>
                                    Photo: {photoCfg.short}
                                  </span>
                                </div>
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
