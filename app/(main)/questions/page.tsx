"use client";
import React, { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
type QType     = "YES_NO_NA" | "YES_NO" | "OK_NOT_OK" | "RATING_1_5" | "NUMERIC" | "TEXT" | "MULTI_CHOICE";
type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
type QStatus   = "Active" | "Draft" | "Inactive";

// UUID v4 generator — replaces crypto.randomUUID() for mock/SSR safety
const uuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
});

interface Question {
  id:           string;   // UUID — database primary key
  questionCode: string;   // "Q-001" — human-readable display code
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

// ── Seed Data — 50 questions aligned to original audit checklist ─────────────
const D = "01 Jan 2024";
const mkQ = (
  questionCode: string, section: string, textEn: string, textHi: string,
  recommendHi = "ठीक है", category = "General",
  helpEn = "", type: QType = "YES_NO_NA"
): Question => ({
  id: uuid(), questionCode, section, textEn, textHi, type, category,
  riskLevel: "HIGH", weightage: 5,
  helpEn, helpHi: "", recommendEn: "COMPLIED", recommendHi,
  mandatory: true, allowRemarks: true, allowPhoto: false,
  multiPhoto: false, numericValue: false, allowNA: false,
  status: "Active", usedIn: 0, createdOn: D,
});

const SEED: Question[] = [

  // ══════════════════════════════════════════════════════════════════════════════
  // GENERAL SECTION  —  Q-001 to Q-018
  // Change log vs original:
  //   • Q-001: MCCBs/MCBs + ELCBs merged into one question (was two separate)
  //   • Q-009: new question — "7a Additional electrical load" (was missing)
  //   • Q-010: helpEn carries R/Y/B/N AMPS observation prompt
  //   • Q-016: type is YES_NO_NA (original document used OK/NOT OK, unified to YES_NO_NA)
  // ══════════════════════════════════════════════════════════════════════════════

  // ── MERGED: original Q1 (MCCBs/MCBs) + ELCBs combined as one question ───────
  mkQ("Q-001","General",
    "Whether MCCBs/MCBs/ELCBs are provided with proper rating to cater the load",
    "क्या MCCB/MCB/ELCB उचित रेटिंग के साथ लोड के अनुसार प्रदान किए गए हैं?",
    "ठीक है"),

  mkQ("Q-002","General",
    "Whether light and emergency light are provided in electrical rooms/operating areas for easy operation & maintenance works",
    "क्या विद्युत कक्षों/संचालन क्षेत्रों में सामान्य और आपातकालीन प्रकाश आसान संचालन और रखरखाव के लिए प्रदान किए गए हैं?",
    "ठीक है"),

  mkQ("Q-003","General",
    "Whether Pump room, DG set room, UPS room, electrical room etc. are maintained dry and in good condition and obsolete/hazardous/old items are not dumped there",
    "क्या पंप रूम, DG सेट रूम, UPS रूम, विद्युत कक्ष आदि शुष्क और अच्छी स्थिति में रखे गए हैं और वहाँ पुराने/खतरनाक/अनुपयोगी सामान नहीं डाले गए हैं?",
    "ठीक है"),

  mkQ("Q-004","General",
    "Whether water seepage is observed near any of the Electrical Panel, Distribution Boards, Electrical equipment etc.",
    "क्या किसी विद्युत पैनल, वितरण बोर्ड, विद्युत उपकरण आदि के पास जल रिसाव देखा गया है?",
    "ठीक है"),

  mkQ("Q-005","General",
    "Whether Earthing pits are provided and connected to the equipment, body of the connected equipment",
    "क्या अर्थिंग पिट प्रदान किए गए हैं और उपकरण तथा संबंधित उपकरण के बॉडी से जुड़े हैं?",
    "ठीक है"),

  mkQ("Q-006","General",
    "Whether the Earthing Pits are properly maintained",
    "क्या अर्थिंग पिट उचित तरीके से रखरखाव किए जा रहे हैं?",
    "ठीक है"),

  mkQ("Q-007","General",
    "Whether proper exhaust fan for ventilation of panel room/electrical room/UPS room is provided and paper, old materials or any other scrap kept near DB/Panels/UPS/Batteries etc. are not kept there",
    "क्या पैनल रूम/विद्युत कक्ष/UPS रूम के वेंटिलेशन के लिए उचित एग्जॉस्ट फैन लगाया गया है और DB/पैनल/UPS/बैटरी आदि के पास कागज, पुराना सामान या कोई अन्य कबाड़ नहीं रखा गया है?",
    "ठीक है"),

  mkQ("Q-008","General",
    "Whether penalty is being imposed in electricity bills on account of higher load/poor power factor etc. (it may be ascertained from the electricity bill of April/May/Jun/July)",
    "क्या अधिक लोड/खराब पावर फैक्टर आदि के कारण बिजली बिल में जुर्माना लगाया जा रहा है? (अप्रैल/मई/जून/जुलाई के बिजली बिल से जाँचें।)",
    "ठीक है"),

  // ── NEW — original 7a sub-question (was embedded in Q-008, now standalone) ──
  mkQ("Q-009","General",
    "Additional electrical load required if any (from Power Distribution Company)",
    "क्या किसी अतिरिक्त विद्युत भार की आवश्यकता है? (बिजली वितरण कंपनी से)",
    "ठीक है",
    "If YES — record the additional load required in KW in the observations field.",
    "YES_NO_NA"),

  // ── Phase load distribution — helpEn carries AMPS observation prompt ─────────
  mkQ("Q-010","General",
    "Whether load is distributed in all 3 phases to avoid unbalancing of phases and no loose electrical connection/haphazard wiring observed in the branch/office premises",
    "क्या फेज असंतुलन से बचने के लिए लोड तीनों फेज में वितरित किया गया है और शाखा/कार्यालय परिसर में कोई ढीला विद्युत कनेक्शन/अव्यवस्थित वायरिंग नहीं देखी गई है?",
    "ठीक है",
    "Record phase-wise current readings in observations: R: ___ AMPS | Y: ___ AMPS | B: ___ AMPS | N: ___ AMPS"),

  mkQ("Q-011","General",
    "Whether isolating switches are provided for the switching off of non-essential loads premises during night and main switch to switch off the power supply to the branch in case of Fire/Emergency",
    "क्या रात के समय गैर-आवश्यक लोड बंद करने के लिए आइसोलेटिंग स्विच और आग/आपातकाल की स्थिति में शाखा की बिजली आपूर्ति बंद करने के लिए मेन स्विच प्रदान किया गया है?",
    "ठीक है"),

  mkQ("Q-012","General",
    "Whether electrical equipments of Pantry etc. are properly connected to Iron socket box with MCBs. MCBs or latest type switches are provided to switch on/off the ACs and protect them from overload",
    "क्या पेंट्री आदि के विद्युत उपकरण MCB के साथ आयरन सॉकेट बॉक्स से ठीक से जुड़े हैं? AC को चालू/बंद करने और ओवरलोड से बचाने के लिए MCB या नवीनतम प्रकार के स्विच लगाए गए हैं?",
    "ठीक है"),

  mkQ("Q-013","General",
    "Whether Proper preventive maintenance after opening of Panel boards and Distribution Boards are carried out by the license holder Electrician or skilled technicians of Equipment manufacturers/Service providers",
    "क्या पैनल बोर्ड और वितरण बोर्ड खोलने के बाद उचित निवारक रखरखाव लाइसेंस धारक इलेक्ट्रीशियन या उपकरण निर्माताओं/सेवा प्रदाताओं के कुशल तकनीशियनों द्वारा किया जाता है?",
    "ठीक है"),

  mkQ("Q-014","General",
    "Whether appropriate timers used in the changeover of Air conditioners for Server Room ACs and for Signage Boards to make auto ON/OFF (for scheduled timings). The thermostat of ACs at server rooms should be set to 30°C so they run only when temperature is too high (to minimise fire risk from idle running of ACs during nights)",
    "क्या सर्वर रूम AC और साइनेज बोर्ड के ऑटो ON/OFF के लिए उपयुक्त टाइमर का उपयोग किया जाता है? सर्वर रूम AC का थर्मोस्टेट 30°C पर सेट होना चाहिए ताकि रात में निष्क्रिय AC चलने से आग लगने का खतरा कम हो।",
    "ठीक है"),

  mkQ("Q-015","General",
    "Whether preventive maintenance of electric installation and equipment is carried out by skilled license holder electricians/skilled technician",
    "क्या विद्युत प्रतिष्ठान और उपकरणों का निवारक रखरखाव कुशल लाइसेंस धारक इलेक्ट्रीशियन/कुशल तकनीशियन द्वारा किया जाता है?",
    "ठीक है"),

  // ── Answer type OK/NOT OK — matches original document ────────────────────────
  mkQ("Q-016","General",
    "General condition of electrical control panels, Main switch, electric meter board and change over switch, ACs, Water coolers, water filter, wiring cables etc. is good and all DBs, Panels, Switch boards are properly covered",
    "विद्युत कंट्रोल पैनल, मेन स्विच, इलेक्ट्रिक मीटर बोर्ड, चेंजओवर स्विच, AC, वाटर कूलर, वाटर फिल्टर, वायरिंग केबल आदि की सामान्य स्थिति अच्छी है और सभी DB, पैनल, स्विच बोर्ड ठीक से ढके हुए हैं?",
    "ठीक है","","YES_NO_NA"),

  mkQ("Q-017","General",
    "Whether the contact numbers of persons, electricians, power distribution company, Generator service provider, Vendor, UPS vendor, ACs etc. are available with Accountant/Security guard and other staff and they are displayed in Electric Room/UPS room",
    "क्या इलेक्ट्रीशियन, बिजली वितरण कंपनी, जनरेटर सेवा प्रदाता, UPS विक्रेता, AC आदि के संपर्क नंबर अकाउंटेंट/सुरक्षा गार्ड और अन्य कर्मचारियों के पास उपलब्ध हैं और विद्युत कक्ष/UPS रूम में प्रदर्शित हैं?",
    "ठीक है"),

  mkQ("Q-018","General",
    "Whether the Power Factor (PF) panel of appropriate rating is installed",
    "क्या उचित रेटिंग का पावर फैक्टर (PF) पैनल स्थापित किया गया है?",
    "ठीक है"),

  // ══════════════════════════════════════════════════════════════════════════════
  // FIRE PREVENTION MEASURES  —  Q-019 to Q-023  (no changes)
  // ══════════════════════════════════════════════════════════════════════════════
  mkQ("Q-019","Fire Prevention Measures",
    "All old disposable records, broken furniture etc. accumulated at the premises have been cleared",
    "परिसर में जमा सभी पुराने निपटान योग्य रिकॉर्ड, टूटा हुआ फर्नीचर आदि हटाया गया है?"),
  mkQ("Q-020","Fire Prevention Measures",
    "Combustible leaf, litter/waste papers etc. in and around the branch is removed/cleaned periodically",
    "शाखा के अंदर और आसपास दहनशील पत्ते, कूड़ा/अपशिष्ट कागज आदि समय-समय पर हटाए/साफ किए जाते हैं?"),
  mkQ("Q-021","Fire Prevention Measures",
    "No stationery/Records/old obsolete items are stored/kept in the system/UPS room",
    "सिस्टम/UPS रूम में कोई स्टेशनरी/रिकॉर्ड/पुराने अनुपयोगी सामान संग्रहीत/नहीं रखे गए हैं?"),
  mkQ("Q-022","Fire Prevention Measures",
    "Storage racks in Stationery/Record room kept at a safe distance of at least 3 ft from electrical points/switch/junction boxes",
    "स्टेशनरी/रिकॉर्ड रूम में भंडारण रैक विद्युत बिंदुओं/स्विच/जंक्शन बॉक्स से कम से कम 3 फीट की सुरक्षित दूरी पर रखे गए हैं?"),
  mkQ("Q-023","Fire Prevention Measures",
    "In the pantry/canteen LPG is used",
    "क्या पेंट्री/कैंटीन में LPG का उपयोग किया जाता है?"),

  // ══════════════════════════════════════════════════════════════════════════════
  // SERVER AND UPS ROOM  —  Q-024 to Q-026
  // Change log: Q-026 updated to include ceiling fan count as observation prompt
  // ══════════════════════════════════════════════════════════════════════════════
  mkQ("Q-024","Server and UPS Room",
    "Server room has dual AC units having timer circuit device with independent circuit",
    "क्या सर्वर रूम में स्वतंत्र सर्किट के साथ टाइमर सर्किट डिवाइस युक्त दोहरी AC इकाइयाँ हैं?"),
  mkQ("Q-025","Server and UPS Room",
    "Whether metal body exhaust fan is installed in UPS room",
    "क्या UPS रूम में धातु के बॉडी वाला एग्जॉस्ट फैन स्थापित किया गया है?"),
  // ── Q-026: updated — count of fans captured as observation prompt ─────────────
  mkQ("Q-026","Server and UPS Room",
    "Whether all ceiling fans installed are of BLDC type",
    "क्या सभी स्थापित सीलिंग फैन BLDC प्रकार के हैं?",
    "ठीक है",
    "Record total number of ceiling fans installed in the observations field (NOS: ___)"),

  // ══════════════════════════════════════════════════════════════════════════════
  // ELECTRICAL SAFETY  —  Q-027 to Q-029  (no changes)
  // ══════════════════════════════════════════════════════════════════════════════
  mkQ("Q-027","Electrical Safety",
    "Power supply to record/stationery room is made through plug and socket arrangement",
    "क्या रिकॉर्ड/स्टेशनरी रूम को प्लग और सॉकेट व्यवस्था के माध्यम से बिजली आपूर्ति की जाती है?"),
  mkQ("Q-028","Electrical Safety",
    "Whether LED lights have been installed. If not, specify number required: Down lights (12/15W) — NOS: ___ | 2×2 Flush lights (36W) — NOS: ___",
    "क्या LED लाइटें स्थापित की गई हैं? यदि नहीं, तो आवश्यक संख्या बताएं: डाउन लाइट (12/15W) — NOS: ___ | 2×2 फ्लश लाइट (36W) — NOS: ___"),
  mkQ("Q-029","Electrical Safety",
    "Whether motion sensors/occupancy sensors have been installed. If not, record the number of sensors required in observations",
    "क्या मोशन सेंसर/ऑक्यूपेंसी सेंसर स्थापित किए गए हैं? यदि नहीं, तो आवश्यक सेंसरों की संख्या टिप्पणी में दर्ज करें।"),

  // ══════════════════════════════════════════════════════════════════════════════
  // FIRE PROTECTION  —  Q-030
  // Change log: fire extinguisher types corrected to match original document
  //   A. Systems/UPS Room  → CO2 (3kg/4.5kg) × 2
  //   B. Banking Hall      → Water/CO2 type × 1
  //   C. Stationery Room   → Water/CO2 type × 1
  // ══════════════════════════════════════════════════════════════════════════════
  mkQ("Q-030","Fire Protection",
    "Are fire extinguishers available in the following work areas, clearly marked and accessible? A. Systems/UPS Room: CO2 (3Kg/4.5Kg) × 2  |  B. Banking Hall: Water/CO2 type × 1  |  C. Stationery Room: Water/CO2 type × 1",
    "क्या निम्नलिखित कार्य क्षेत्रों में अग्निशामक यंत्र उपलब्ध हैं, स्पष्ट रूप से चिह्नित और सुलभ हैं? A. सिस्टम/UPS रूम: CO2 (3Kg/4.5Kg) × 2  |  B. बैंकिंग हॉल: वाटर/CO2 प्रकार × 1  |  C. स्टेशनरी रूम: वाटर/CO2 प्रकार × 1"),

  // ══════════════════════════════════════════════════════════════════════════════
  // DG SET / GENERATOR  —  Q-031 to Q-033
  // Change log: Q-031 is a new parent question (was missing); former Q-031/Q-032
  //             are now Q-032/Q-033
  // ══════════════════════════════════════════════════════════════════════════════

  // ── NEW — original item 21 parent question (was missing) ─────────────────────
  mkQ("Q-031","DG Set / Generator",
    "DG Set / Generator is installed at the branch/office",
    "क्या शाखा/कार्यालय में DG सेट / जनरेटर स्थापित है?"),

  mkQ("Q-032","DG Set / Generator",
    "At least two 6 Kg. ABC capacity fire extinguishers are placed near the diesel generator",
    "डीजल जनरेटर के पास कम से कम दो 6 Kg. ABC क्षमता के अग्निशामक यंत्र रखे गए हैं?"),

  mkQ("Q-033","DG Set / Generator",
    "Whether electrical safety and energy saving awareness meeting with the staff members was conducted after electrical safety audit of the branch/office by the auditor",
    "क्या शाखा/कार्यालय के विद्युत सुरक्षा ऑडिट के बाद ऑडिटर द्वारा कर्मचारियों के साथ विद्युत सुरक्षा और ऊर्जा बचत जागरूकता बैठक आयोजित की गई है?"),

  // ══════════════════════════════════════════════════════════════════════════════
  // ONSITE ATM  —  Q-034 to Q-050
  // ══════════════════════════════════════════════════════════════════════════════
  mkQ("Q-034","Onsite ATM",
    "5 Kg ABC Automatic Modular Fire Extinguisher is provided and protected in the back room",
    "क्या बैक रूम में 5 Kg ABC ऑटोमैटिक मॉड्यूलर अग्निशामक यंत्र प्रदान और संरक्षित किया गया है?",
    "ठीक है"),
  mkQ("Q-035","Onsite ATM",
    "ATM room is having fire detector connected through branch AFDS (Applicable for Onsite ATMs only)",
    "क्या ATM रूम में शाखा के AFDS से जुड़ा फायर डिटेक्टर है? (केवल ऑनसाइट ATM के लिए लागू)",
    "ठीक है"),
  mkQ("Q-036","Onsite ATM",
    "Whether MCCB/MCB/ELCB are provided and apparently in working condition",
    "क्या MCCB/MCB/ELCB प्रदान किए गए हैं और स्पष्ट रूप से कार्यशील स्थिति में हैं?",
    "ठीक है"),
  mkQ("Q-037","Onsite ATM",
    "AC units are provided with timer circuit device",
    "क्या AC इकाइयों में टाइमर सर्किट डिवाइस प्रदान किया गया है?",
    "ठीक है"),
  mkQ("Q-038","Onsite ATM",
    "Main supply switch/MCB to cut-off the electric supply of ATM has been marked",
    "क्या ATM की विद्युत आपूर्ति काटने के लिए मेन सप्लाई स्विच/MCB को स्पष्ट रूप से चिह्नित किया गया है?",
    "ठीक है"),
  mkQ("Q-039","Onsite ATM",
    "Power supply to AC, UPS and ATM machines is through metal clad plug receptacle socket",
    "क्या AC, UPS और ATM मशीनों को मेटल क्लैड प्लग रिसेप्टेकल सॉकेट के माध्यम से बिजली आपूर्ति दी जाती है?",
    "ठीक है"),
  mkQ("Q-040","Onsite ATM",
    "Electrical wires are properly covered/insulated to prevent exposure of wire",
    "क्या विद्युत तारों के खुलेपन को रोकने के लिए वे ठीक से ढकी/इंसुलेटेड हैं?",
    "ठीक है"),
  mkQ("Q-041","Onsite ATM",
    "Is there any cooking stove/electric heater coil stove noticed in the ATM",
    "क्या ATM में कोई कुकिंग स्टोव/इलेक्ट्रिक हीटर कॉइल स्टोव पाया गया है?",
    "ठीक है"),
  mkQ("Q-042","Onsite ATM",
    "Is there any water accumulation/seepage in the premises or dripping on electrical gadgets",
    "क्या परिसर में कोई जल जमाव/रिसाव है या विद्युत उपकरणों पर टपकाव हो रहा है?",
    "ठीक है"),
  mkQ("Q-043","Onsite ATM",
    "Any combustible container provided in the ATM",
    "क्या ATM में कोई ज्वलनशील कंटेनर रखा गया है?",
    "ठीक है"),
  mkQ("Q-044","Onsite ATM",
    "Steel dustbin container provided in the ATM",
    "क्या ATM में स्टील का डस्टबिन कंटेनर प्रदान किया गया है?",
    "ठीक है"),
  mkQ("Q-045","Onsite ATM",
    "No smoking board is provided in the ATM cabin",
    "क्या ATM केबिन में नो-स्मोकिंग बोर्ड लगाया गया है?",
    "ठीक है"),
  mkQ("Q-046","Onsite ATM",
    "Main entrance shutter is in working condition",
    "क्या मुख्य प्रवेश शटर कार्यशील स्थिति में है?",
    "ठीक है"),
  mkQ("Q-047","Onsite ATM",
    "Proper locking arrangement is there at the main shutter",
    "क्या मुख्य शटर पर उचित लॉकिंग व्यवस्था है?",
    "ठीक है"),
  mkQ("Q-048","Onsite ATM",
    "All electrical lights are in working condition",
    "क्या सभी विद्युत लाइटें कार्यशील स्थिति में हैं?",
    "ठीक है"),
  mkQ("Q-049","Onsite ATM",
    "ATM is provided with external CCTV camera",
    "क्या ATM में बाहरी CCTV कैमरा लगाया गया है?",
    "ठीक है"),
  mkQ("Q-050","Onsite ATM",
    "CCTV is in working condition",
    "क्या CCTV कार्यशील स्थिति में है?",
    "ठीक है"),
];

// ── Constants ──────────────────────────────────────────────────────────────────
const SECTIONS   = ["All Sections","General","Electrical Safety","Fire Prevention Measures","Server and UPS Room","Fire Protection","DG Set / Generator","Onsite ATM"];
const Q_TYPES    = ["YES_NO_NA","YES_NO","OK_NOT_OK","RATING_1_5","NUMERIC","TEXT","MULTI_CHOICE"] as const;
const RISK_LEVELS= ["HIGH","MEDIUM","LOW"] as const;
const STATUS_LIST= ["All Status","Active","Inactive"];
const PAGE_SIZE  = 10;

const TYPE_LABEL: Record<QType,string> = {
  "YES_NO_NA":"YES / NO / NA","YES_NO":"YES / NO","OK_NOT_OK":"OK / NOT OK",
  "RATING_1_5":"Rating 1–5","NUMERIC":"Numeric","TEXT":"Text","MULTI_CHOICE":"Multiple Choice",
};
const TYPE_STYLE: Record<QType,{color:string;bg:string}> = {
  "YES_NO_NA":{color:"#16a34a",bg:"#dcfce7"},"YES_NO":{color:"#2563eb",bg:"#dbeafe"},
  "OK_NOT_OK":{color:"#0891b2",bg:"#ecfeff"},
  "RATING_1_5":{color:"#7c3aed",bg:"#f5f3ff"},"NUMERIC":{color:"#0891b2",bg:"#ecfeff"},
  "TEXT":{color:"#374151",bg:"#f3f4f6"},"MULTI_CHOICE":{color:"#d97706",bg:"#fef3c7"},
};
const SECTION_COLOR: Record<string,string> = {
  "General":"#16a34a","Electrical Safety":"#ca8a04",
  "Fire Prevention Measures":"#dc2626","Server and UPS Room":"#2563eb",
  "Fire Protection":"#ea580c","DG Set / Generator":"#7c3aed",
  "Onsite ATM":"#0891b2",
};

// ── Form ───────────────────────────────────────────────────────────────────────
const EMPTY = {
  textEn:"", textHi:"", type:"YES_NO_NA" as QType, category:"General",
  section:"General", riskLevel:"HIGH" as RiskLevel, weightage:5,
  helpEn:"", helpHi:"", recommendEn:"COMPLIED", recommendHi:"ठीक है",
  mandatory:true, allowRemarks:true, allowPhoto:false,
  multiPhoto:false, numericValue:false, allowNA:false,
  status:"Active" as QStatus,
};
type FormData = typeof EMPTY;
type HindiField = "textHi" | "recommendHi";

// ── Styles ─────────────────────────────────────────────────────────────────────
const TH: React.CSSProperties = { padding:"10px 12px", fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase" as const, letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap" as const, textAlign:"left" as const };
const TD: React.CSSProperties = { padding:"10px 12px", verticalAlign:"middle" as const, fontSize:12, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };
const LBL: React.CSSProperties = { display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:4, textTransform:"uppercase" as const, letterSpacing:"0.04em" };
const INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 11px", fontSize:13, color:"#374151", outline:"none", boxSizing:"border-box" as const, background:"#fff" };
const PB: React.CSSProperties  = { display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", background:"#16a34a", color:"#fff", border:"none", borderRadius:9, fontWeight:700, fontSize:13, cursor:"pointer" };
const OB: React.CSSProperties  = { display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", background:"#fff", color:"#374151", border:"1px solid #e5e7eb", borderRadius:9, fontWeight:600, fontSize:13, cursor:"pointer" };

// ── JSON syntax highlighter ────────────────────────────────────────────────────
function colorizeJson(json: string): React.ReactNode {
  const regex = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\],])/g;
  const nodes: React.ReactNode[] = [];
  let last = 0; let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(json)) !== null) {
    if (m.index > last) nodes.push(<span key={key++} style={{ color:"#d4d4d4" }}>{json.slice(last, m.index)}</span>);
    const v = m[0];
    let col = "#d4d4d4";
    if (/^"/.test(v))      col = /:$/.test(v) ? "#9cdcfe" : "#ce9178";
    else if (/true|false/.test(v)) col = "#569cd6";
    else if (v === "null") col = "#569cd6";
    else if (!isNaN(+v))   col = "#b5cea8";
    nodes.push(<span key={key++} style={{ color: col }}>{v}</span>);
    last = regex.lastIndex;
  }
  if (last < json.length) nodes.push(<span key={key++} style={{ color:"#d4d4d4" }}>{json.slice(last)}</span>);
  return <>{nodes}</>;
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function QuestionLibraryPage() {
  const [questions, setQuestions] = useState<Question[]>(SEED);
  const [form,      setForm]      = useState<FormData>({ ...EMPTY });

  // Form is always visible — no open/close toggle
  const [editRow,  setEditRow]  = useState<Question | null>(null);
  const isEditMode = !!editRow;

  // Translation
  const [translating, setTranslating] = useState<Record<HindiField,boolean>>({ textHi:false, recommendHi:false });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [deleteInput,  setDeleteInput]  = useState("");
  const [copied,       setCopied]       = useState(false);

  // Table filters
  const [search,   setSearch]   = useState("");
  const [sectionF, setSectionF] = useState("All Sections");
  const [statusF,  setStatusF]  = useState("All Status");
  const [page,     setPage]     = useState(1);

  // ── Field helper ──────────────────────────────────────────────────────────────
  const fp = (key: keyof FormData, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  // ── Auto-translate ────────────────────────────────────────────────────────────
  const translateToHindi = async (englishText: string, field: HindiField) => {
    if (!englishText.trim()) return;
    setTranslating(prev => ({ ...prev, [field]: true }));
    try {
      const res  = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishText)}&langpair=en|hi`);
      const data = await res.json();
      if (data.responseStatus === 200 && data.responseData?.translatedText)
        fp(field, data.responseData.translatedText);
    } catch { /* silent */ }
    finally { setTranslating(prev => ({ ...prev, [field]: false })); }
  };
  const onHindiFocus = (en: string, field: HindiField, cur: string) => {
    if (!cur.trim()) translateToHindi(en, field);
  };

  // ── Filter ────────────────────────────────────────────────────────────────────
  const filtered = questions.filter(q => {
    const s = search.toLowerCase();
    return (!s || q.textEn.toLowerCase().includes(s) || q.questionCode.toLowerCase().includes(s))
      && (sectionF === "All Sections" || q.section === sectionF)
      && (statusF  === "All Status"   || q.status  === statusF);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p     = Math.min(page, totalPages);
  const paged = filtered.slice((p-1)*PAGE_SIZE, p*PAGE_SIZE);

  // Ellipsis pagination: always show first 2, last 1, and window around current
  const pageItems = (): (number | "...")[] => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const items: (number | "...")[] = [];
    const addPage = (n: number) => { if (!items.includes(n)) items.push(n); };
    // First two
    addPage(1); addPage(2);
    // Around current
    for (let i = Math.max(3, p - 1); i <= Math.min(totalPages - 1, p + 1); i++) addPage(i);
    // Last
    addPage(totalPages);
    // Insert ellipsis
    const result: (number | "...")[] = [];
    let prev = 0;
    for (const item of items as number[]) {
      if (item - prev > 1) result.push("...");
      result.push(item);
      prev = item;
    }
    return result;
  };

  // ── Panel actions ─────────────────────────────────────────────────────────────
  const resetToAdd = () => { setForm({ ...EMPTY }); setEditRow(null); };
  const openEdit = (q: Question) => {
    setEditRow(q);
    setForm({ textEn:q.textEn, textHi:q.textHi, type:q.type,
      section:q.section, riskLevel:q.riskLevel, weightage:q.weightage,
      helpEn:q.helpEn, helpHi:q.helpHi, recommendEn:q.recommendEn, recommendHi:q.recommendHi,
      mandatory:q.mandatory, allowRemarks:q.allowRemarks, allowPhoto:q.allowPhoto,
      multiPhoto:q.multiPhoto, numericValue:q.numericValue, allowNA:q.allowNA,
      status:q.status, category:q.category });
  };

  const handleSave = () => {
    if (!form.textEn.trim()) return;
    if (isEditMode && editRow) {
      setQuestions(qs => qs.map(q => q.id === editRow.id ? { ...q, ...form } : q));
    } else {
      const maxNum = questions.reduce((m, q) => { const n = parseInt(q.questionCode.replace("Q-",""),10); return isNaN(n)?m:Math.max(m,n); }, 0);
      const newCode = `Q-${String(maxNum + 1).padStart(3,"0")}`;
      setQuestions(qs => [...qs, { id:uuid(), questionCode:newCode, ...form, usedIn:0, createdOn:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) }]);
    }
    resetToAdd();  // always return to Add mode — form stays visible
  };

  // ── CSV Export ────────────────────────────────────────────────────────────────
  const downloadCSV = () => {
    const headers = ["Code","Question (English)","Question (Hindi)","Type","Section","Category","Risk","Weightage","Mandatory","Status","Created On"];
    const rows = questions.map(q => [
      q.questionCode, `"${q.textEn.replace(/"/g,'""')}"`, `"${q.textHi.replace(/"/g,'""')}"`,
      q.type, q.section, q.category, q.riskLevel, q.weightage,
      q.mandatory?"Yes":"No", q.status, q.createdOn
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
    a.download = `questions-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const confirmDelete = () => {
    if (!deleteTarget || deleteInput !== "DELETE") return;
    if (editRow?.id === deleteTarget.id) resetToAdd();
    setQuestions(qs => qs.filter(q => q.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleteInput("");
  };
  const cancelDelete = () => { setDeleteTarget(null); setDeleteInput(""); };
  const handleToggle = (id: string) =>
    setQuestions(qs => qs.map(q => q.id===id ? { ...q, status:q.status==="Active"?"Inactive":"Active" as QStatus } : q));

  const chk = (key: "mandatory"|"allowRemarks"|"allowPhoto") => (
    <label key={key} style={{ display:"inline-flex", alignItems:"center", gap:5, cursor:"pointer", fontSize:12, color:"#374151", userSelect:"none" }}>
      <input type="checkbox" checked={!!form[key]} onChange={e=>fp(key,e.target.checked)}
        style={{ width:14, height:14, accentColor:"#16a34a", cursor:"pointer" }}/>
      {key==="mandatory"?"Mandatory":key==="allowRemarks"?"Allow Recommendation":"Allow Photo"}
    </label>
  );

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const total    = questions.length;
  const active   = questions.filter(q=>q.status==="Active").length;
  const inactive = questions.filter(q=>q.status==="Inactive").length;
  const sections = new Set(questions.map(q=>q.section)).size;

  return (
    <>
    <div style={{ padding:"24px 0" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <div>
          <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Question Library</h4>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>
            Dashboard / Audit Questions / <span style={{ color:"#16a34a", fontWeight:600 }}>Question Library</span>
          </div>
        </div>
        <button onClick={resetToAdd} style={PB}><i className="ri-add-line"/> New Question</button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, margin:"20px 0" }}>
        {[
          { label:"Total Questions", value:total,     color:"#2563eb", bg:"#eff6ff", icon:"ri-questionnaire-line",   border:"#2563eb" },
          { label:"Active",          value:active,    color:"#16a34a", bg:"#f0fdf4", icon:"ri-checkbox-circle-line", border:"#16a34a" },
          { label:"Inactive",        value:inactive,  color:"#dc2626", bg:"#fef2f2", icon:"ri-close-circle-line",    border:"#dc2626" },
          { label:"Sections",        value:sections,  color:"#7c3aed", bg:"#f5f3ff", icon:"ri-folder-line",          border:"#7c3aed" },
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

      {/* ── MAIN SPLIT ─────────────────────────────────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:18 }}>

        {/* ── LEFT PANEL — Add / Edit (always visible) ─────────────────────────── */}
          <div style={{ width:380, flexShrink:0, display:"flex", flexDirection:"column", gap:14, position:"sticky", top:80 }}>
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", boxShadow:"0 4px 24px rgba(0,0,0,0.09)", overflow:"hidden" }}>

            {/* Panel header */}
            <div style={{ padding:"14px 18px", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"space-between", background: isEditMode ? "#fffbeb" : "#f0fdf4" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:"#111827", display:"flex", alignItems:"center", gap:7 }}>
                  <i className={isEditMode ? "ri-edit-line" : "ri-add-circle-line"} style={{ fontSize:15, color: isEditMode ? "#d97706" : "#16a34a" }}/>
                  {isEditMode ? `Edit — ${editRow?.questionCode}` : "New Question"}
                </div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>
                  {isEditMode ? "Modify and save the question below" : "Fill all fields then save or draft"}
                </div>
              </div>
            </div>

            {/* Auto-translate notice */}
            <div style={{ margin:"12px 16px 0", padding:"9px 13px", background:"#eff6ff", borderLeft:"3px solid #2563eb", borderRadius:"0 8px 8px 0", fontSize:11, color:"#1d4ed8", lineHeight:1.5 }}>
              <strong>Auto-translation on.</strong> Type English → click Hindi field to auto-translate. Use <strong>↺</strong> to regenerate.
            </div>

            {/* Scrollable body */}
            <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:11, maxHeight:"calc(100vh - 270px)", overflowY:"auto" }}>

              {/* English */}
              <div>
                <label style={LBL}>Question Text — English <span style={{ color:"#dc2626" }}>*</span></label>
                <textarea value={form.textEn} onChange={e=>fp("textEn",e.target.value)} rows={3}
                  placeholder="Whether MCCBs/MCBs are provided with proper rating to cater the load"
                  style={{ ...INP, resize:"none", lineHeight:1.5 }}/>
              </div>

              {/* Hindi */}
              <div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                  <label style={{ ...LBL, marginBottom:0 }}>Question Text — Hindi <span style={{ color:"#dc2626" }}>*</span></label>
                  {form.textEn.trim() && (
                    <button onClick={()=>translateToHindi(form.textEn,"textHi")} disabled={translating.textHi}
                      style={{ fontSize:10, fontWeight:700, color:translating.textHi?"#9ca3af":"#2563eb", background:translating.textHi?"#f3f4f6":"#eff6ff", border:"none", borderRadius:5, padding:"3px 8px", cursor:translating.textHi?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:3 }}>
                      <i className={translating.textHi?"ri-loader-4-line":"ri-translate-2"} style={{ fontSize:11 }}/>
                      {translating.textHi ? "Translating…" : "↺ Re-translate"}
                    </button>
                  )}
                </div>
                <textarea value={translating.textHi ? "" : form.textHi}
                  onChange={e=>fp("textHi",e.target.value)}
                  onFocus={()=>onHindiFocus(form.textEn,"textHi",form.textHi)}
                  disabled={translating.textHi}
                  rows={3} placeholder={translating.textHi ? "Translating from English…" : "Click to auto-translate, or type manually"}
                  style={{ ...INP, resize:"none", lineHeight:1.5, background:translating.textHi?"#f9fafb":"#fff", color:translating.textHi?"#9ca3af":"#374151", fontStyle:translating.textHi?"italic":"normal" }}/>
              </div>

              {/* Section */}
              <div>
                <label style={LBL}>Section <span style={{ color:"#dc2626" }}>*</span></label>
                <select value={form.section} onChange={e=>fp("section",e.target.value)} style={{ ...INP, padding:"7px 10px" }}>
                  {SECTIONS.slice(1).map(s=><option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Type + Weightage — read-only */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={LBL}>Question Type</label>
                  <div style={{ ...INP, padding:"8px 11px", background:"#f9fafb", display:"flex", alignItems:"center", gap:8, cursor:"default" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:TYPE_STYLE[form.type].color, background:TYPE_STYLE[form.type].bg, borderRadius:6, padding:"2px 10px" }}>
                      {TYPE_LABEL[form.type]}
                    </span>
                  </div>
                </div>
                <div>
                  <label style={LBL}>Weightage</label>
                  <div style={{ ...INP, padding:"8px 11px", background:"#f9fafb", display:"flex", alignItems:"center", gap:8, cursor:"default" }}>
                    <i className="ri-lock-line" style={{ fontSize:12, color:"#9ca3af" }}/>
                    <span style={{ fontWeight:700, color:"#374151" }}>5</span>
                    <span style={{ fontSize:11, color:"#9ca3af", marginLeft:2 }}>/ 5 (fixed)</span>
                  </div>
                </div>
              </div>

              {/* Question Behaviour */}
              <div style={{ border:"1px solid #e5e7eb", borderRadius:9, overflow:"hidden" }}>
                <div style={{ padding:"8px 12px", background:"#f3f4f6", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", gap:6 }}>
                  <i className="ri-settings-3-line" style={{ fontSize:13, color:"#6b7280" }}/>
                  <span style={{ fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase" as const, letterSpacing:"0.05em" }}>Question Behaviour</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px 6px", padding:"10px 12px", background:"#f9fafb" }}>
                  {(["mandatory","allowRemarks","allowPhoto"] as const).map(chk)}
                </div>
              </div>

              {/* Recommendation English */}
              <div>
                <label style={LBL}>Default Recommendation (English)</label>
                <input value={form.recommendEn} onChange={e=>fp("recommendEn",e.target.value)}
                  placeholder="COMPLIED" style={INP}/>
              </div>

              {/* Recommendation Hindi */}
              <div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                  <label style={{ ...LBL, marginBottom:0 }}>Default Recommendation (Hindi)</label>
                  {form.recommendEn.trim() && (
                    <button onClick={()=>translateToHindi(form.recommendEn,"recommendHi")} disabled={translating.recommendHi}
                      style={{ fontSize:10, fontWeight:700, color:translating.recommendHi?"#9ca3af":"#2563eb", background:translating.recommendHi?"#f3f4f6":"#eff6ff", border:"none", borderRadius:5, padding:"3px 8px", cursor:translating.recommendHi?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:3 }}>
                      <i className={translating.recommendHi?"ri-loader-4-line":"ri-translate-2"} style={{ fontSize:11 }}/>
                      {translating.recommendHi ? "Translating…" : "↺ Re-translate"}
                    </button>
                  )}
                </div>
                <input value={translating.recommendHi ? "" : form.recommendHi}
                  onChange={e=>fp("recommendHi",e.target.value)}
                  onFocus={()=>onHindiFocus(form.recommendEn,"recommendHi",form.recommendHi)}
                  disabled={translating.recommendHi}
                  placeholder={translating.recommendHi ? "Translating from English…" : "Click to auto-translate, or type manually"}
                  style={{ ...INP, background:translating.recommendHi?"#f9fafb":"#fff", color:translating.recommendHi?"#9ca3af":"#374151", fontStyle:translating.recommendHi?"italic":"normal" }}/>
              </div>

            </div>

            {/* Status */}
            <div style={{ padding:"12px 16px", borderTop:"1px solid #e5e7eb", background:"#fff" }}>
              <label style={LBL}>Question Status</label>
              <div style={{ display:"flex", border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden" }}>
                {(["Active","Inactive"] as QStatus[]).map((s, i) => {
                  const active = form.status === s;
                  const col = s==="Active" ? "#16a34a" : "#dc2626";
                  return (
                    <button key={s} onClick={() => fp("status", s)}
                      style={{ flex:1, padding:"8px 4px", border:"none", borderRight:i<1?"1px solid #e5e7eb":"none", cursor:"pointer", fontSize:12, fontWeight:700, background:active ? col : "#fff", color:active?"#fff":col, transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                      <i className={s==="Active"?"ri-checkbox-circle-line":"ri-close-circle-line"} style={{ fontSize:13 }}/>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding:"12px 16px", borderTop:"1px solid #e5e7eb", display:"flex", gap:8, background:"#fff" }}>
              <button onClick={resetToAdd} style={{ flex:1, padding:"9px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontWeight:600, fontSize:12 }}>
                Clear
              </button>
              <button onClick={handleSave} disabled={!form.textEn.trim()}
                style={{ flex:2, padding:"9px", borderRadius:8, border:"none", background:!form.textEn.trim()?"#9ca3af": form.status==="Active"?(isEditMode?"#2563eb":"#16a34a"):"#dc2626", color:"#fff", cursor:!form.textEn.trim()?"not-allowed":"pointer", fontWeight:700, fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <i className={isEditMode ? "ri-save-line" : "ri-check-line"}/>
                {isEditMode ? `UPDATE AS ${form.status.toUpperCase()}` : `SAVE AS ${form.status.toUpperCase()}`}
              </button>
            </div>
          </div>

          {/* ── API Payload — separate card below form ─────────────────────────── */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ padding:"11px 16px", borderBottom:"1px solid #f0fdf4", background:"#f8fafc", display:"flex", alignItems:"center", gap:7 }}>
              <i className="ri-code-s-slash-line" style={{ fontSize:14, color:"#2563eb" }}/>
              <span style={{ fontSize:12, fontWeight:800, color:"#111827" }}>API Payload</span>
              <span style={{ fontSize:10, color:"#9ca3af", marginLeft:2 }}>Live preview of what will be sent</span>
            </div>

            {/* Toolbar */}
            <div style={{ background:"#0d1117", padding:"6px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:10, color:"#3d444d", fontWeight:600, letterSpacing:"0.05em" }}>application/json</span>
              <button
                onClick={() => {
                  const payload = JSON.stringify({
                    id:           isEditMode ? editRow?.id : "(uuid — auto-generated on save)",
                    questionCode: isEditMode ? editRow?.questionCode : "(e.g. Q-051 — auto-assigned)",
                    textEn:       form.textEn       || "(empty)",
                    textHi:       form.textHi       || "(empty)",
                    type:         form.type,
                    section:      form.section,
                    weightage:    form.weightage,
                    mandatory:    form.mandatory,
                    allowRemarks: form.allowRemarks,
                    allowPhoto:   form.allowPhoto,
                    recommendEn:  form.recommendEn,
                    recommendHi:  form.recommendHi  || "(empty)",
                    status:       form.status,
                  }, null, 2);
                  navigator.clipboard.writeText(payload).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
                style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:6, border:"1px solid #30363d", background:copied?"#238636":"#21262d", color:copied?"#fff":"#8b949e", fontSize:10, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
                <i className={copied ? "ri-check-line" : "ri-file-copy-line"} style={{ fontSize:11 }}/>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Highlighted JSON */}
            <pre style={{ margin:0, padding:"14px 16px", fontSize:11, background:"#0d1117", overflowX:"auto", overflowY:"auto", maxHeight:280, lineHeight:1.7, fontFamily:""Space Grotesk", sans-serif" }}>
{colorizeJson(JSON.stringify({
  id:           isEditMode ? editRow?.id : "(uuid — auto-generated on save)",
  questionCode: isEditMode ? editRow?.questionCode : "(e.g. Q-051 — auto-assigned)",
  textEn:       form.textEn       || "(empty)",
  textHi:       form.textHi       || "(empty)",
  type:         form.type,
  section:      form.section,
  weightage:    form.weightage,
  mandatory:    form.mandatory,
  allowRemarks: form.allowRemarks,
  allowPhoto:   form.allowPhoto,
  recommendEn:  form.recommendEn,
  recommendHi:  form.recommendHi  || "(empty)",
  status:       form.status,
}, null, 2))}
            </pre>
          </div>

          </div>

        {/* ── RIGHT — TABLE ─────────────────────────────────────────────────────── */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* Print-only Sr. No. styles */}
          <style>{`
            .sr-no-col { display: none; }
            @media print { .sr-no-col { display: table-cell !important; } }
          `}</style>

          {/* Filters + Download */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            <div style={{ fontSize:12, color:"#6b7280" }}>
              Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> questions — Page <strong style={{ color:"#111827" }}>{p}</strong> of {totalPages}
            </div>
            <div style={{ flex:1 }}/>
            <button onClick={downloadCSV}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 13px", borderRadius:7, border:"1px solid #d1fae5", background:"#f0fdf4", color:"#16a34a", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              <i className="ri-download-2-line" style={{ fontSize:13 }}/>Export CSV
            </button>
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
                  <th className="sr-no-col" style={{ ...TH, textAlign:"center", width:36 }}>SR.</th>
                  <th style={TH}>ID</th>
                  <th style={TH}>QUESTION (EN / HI)</th>
                  <th style={TH}>SECTION</th>
                  <th style={{ ...TH, textAlign:"center" }}>TYPE</th>
                  <th style={{ ...TH, textAlign:"center" }}>WT</th>
                  <th style={{ ...TH, textAlign:"center" }}>FLAGS</th>
                  <th style={TH}>DEFAULT REC</th>
                  <th style={{ ...TH, textAlign:"center" }}>STATUS</th>
                  <th style={{ ...TH, textAlign:"center" }}>ACT</th>
                </tr></thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan={10} style={{ padding:"50px 20px", textAlign:"center", color:"#9ca3af" }}>
                      <i className="ri-questionnaire-line" style={{ fontSize:32, display:"block", marginBottom:8, opacity:0.3 }}/>No questions found
                    </td></tr>
                  ) : paged.map((q, idx) => {
                    const ts = TYPE_STYLE[q.type];
                    const sc = SECTION_COLOR[q.section] || "#374151";
                    const isActive = editRow?.id === q.id;
                    return (
                      <tr key={q.id} style={{ background:isActive?"#fffbeb":"transparent", transition:"background 0.15s" }}
                        onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background="#f9fafb"; }}
                        onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background="transparent"; }}>
                        <td className="sr-no-col" style={{ ...TD, textAlign:"center", fontSize:11, fontWeight:700, color:"#6b7280" }}>
                          {(p-1)*PAGE_SIZE + idx + 1}
                        </td>
                        <td style={TD}>
                          <span style={{ fontSize:10, fontWeight:700, color:"#374151", background:"#f3f4f6", borderRadius:5, padding:"2px 7px", fontFamily:"monospace" }}>{q.questionCode}</span>
                        </td>
                        <td style={{ ...TD, maxWidth:260 }}>
                          <div style={{ fontWeight:600, color:"#111827", fontSize:12, lineHeight:1.4 }}>{q.textEn}</div>
                          <div style={{ fontSize:11, color:"#9ca3af", marginTop:2, lineHeight:1.4 }}>{q.textHi}</div>
                        </td>
                        <td style={TD}>
                          <span style={{ fontSize:10, fontWeight:700, color:sc, background:`${sc}18`, borderRadius:20, padding:"2px 8px", whiteSpace:"nowrap" as const }}>{q.section}</span>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <span style={{ fontSize:10, fontWeight:700, color:ts.color, background:ts.bg, borderRadius:5, padding:"2px 7px", whiteSpace:"nowrap" as const }}>{TYPE_LABEL[q.type]}</span>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <span style={{ fontSize:13, fontWeight:800, color:"#2563eb" }}>{q.weightage}</span>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <div style={{ display:"flex", gap:3, justifyContent:"center", flexWrap:"wrap" }}>
                            {q.mandatory    && <span title="Mandatory"       style={{ fontSize:9, fontWeight:700, color:"#dc2626", background:"#fee2e2", borderRadius:4, padding:"1px 5px" }}>REQ</span>}
                            {q.allowPhoto   && <span title="Allow Photo"     style={{ fontSize:9, fontWeight:700, color:"#2563eb", background:"#dbeafe", borderRadius:4, padding:"1px 5px" }}>PHO</span>}
                            {q.allowRemarks && <span title="Recommendation"  style={{ fontSize:9, fontWeight:700, color:"#7c3aed", background:"#f5f3ff", borderRadius:4, padding:"1px 5px" }}>REC</span>}
                          </div>
                        </td>
                        <td style={TD}>
                          <div style={{ fontSize:11, color:"#374151", fontWeight:600 }}>{q.recommendEn}</div>
                          {q.recommendHi && (
                            <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{q.recommendHi}</div>
                          )}
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <button onClick={()=>handleToggle(q.id)}
                            style={{ fontSize:10, fontWeight:700, color:q.status==="Active"?"#16a34a":"#dc2626", background:q.status==="Active"?"#dcfce7":"#fee2e2", border:"none", borderRadius:20, padding:"3px 9px", cursor:"pointer" }}>
                            {q.status}
                          </button>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                            <button onClick={()=>openEdit(q)} title="Edit"
                              style={{ width:27, height:27, borderRadius:6, border:`1px solid ${isActive?"#fbbf24":"#e5e7eb"}`, background:isActive?"#fef9c3":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:isActive?"#d97706":"#2563eb" }}>
                              <i className="ri-edit-line" style={{ fontSize:12 }}/>
                            </button>
                            <button onClick={()=>{ setDeleteTarget(q); setDeleteInput(""); }} title="Delete"
                              style={{ width:27, height:27, borderRadius:6, border:"1px solid #fee2e2", background:"#fff5f5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}>
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
                {pageItems().map((item, idx) =>
                  item === "..."
                    ? <span key={`ellipsis-${idx}`} style={{ padding:"4px 6px", fontSize:12, color:"#9ca3af", userSelect:"none" }}>…</span>
                    : <button key={item} onClick={()=>setPage(item)} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, fontSize:12, fontWeight:item===p?700:400, background:item===p?"#16a34a":"#fff", color:item===p?"#fff":"#374151", cursor:"pointer" }}>{item}</button>
                )}
                <button onClick={()=>setPage(pp=>Math.min(totalPages,pp+1))} disabled={p===totalPages} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===totalPages?"#f9fafb":"#fff", color:p===totalPages?"#d1d5db":"#374151", cursor:p===totalPages?"not-allowed":"pointer", fontSize:12 }}>›</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ── DELETE CONFIRMATION MODAL ──────────────────────────────────────────── */}
    {deleteTarget && (
      <div style={{ position:"fixed", inset:0, zIndex:99999, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.55)", backdropFilter:"blur(3px)" }}
        onClick={e=>{ if(e.target===e.currentTarget) cancelDelete(); }}>
        <div style={{ background:"#fff", borderRadius:16, width:460, boxShadow:"0 24px 64px rgba(0,0,0,0.22)", overflow:"hidden", animation:"slideUp 0.18s ease" }}>
          <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

          {/* Modal header */}
          <div style={{ background:"#fef2f2", padding:"18px 22px", borderBottom:"1px solid #fee2e2", display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:"#fee2e2", border:"1px solid #fca5a5", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className="ri-delete-bin-2-line" style={{ fontSize:20, color:"#dc2626" }}/>
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:"#111827" }}>Delete Question</div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>This action is permanent and cannot be undone.</div>
            </div>
          </div>

          {/* Modal body */}
          <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:14 }}>

            {/* Question preview */}
            <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:10, fontWeight:700, color:"#374151", background:"#e5e7eb", borderRadius:5, padding:"2px 7px", fontFamily:"monospace" }}>{deleteTarget.questionCode}</span>
                <span style={{ fontSize:10, fontWeight:700, color:"#16a34a", background:"#dcfce7", borderRadius:5, padding:"2px 8px" }}>{deleteTarget.section}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:"#111827", lineHeight:1.5 }}>{deleteTarget.textEn}</div>
              {deleteTarget.textHi && (
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:4, lineHeight:1.4 }}>{deleteTarget.textHi}</div>
              )}
            </div>

            {/* Warning */}
            <div style={{ display:"flex", gap:8, background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, padding:"10px 12px", alignItems:"flex-start" }}>
              <i className="ri-error-warning-line" style={{ fontSize:15, color:"#d97706", flexShrink:0, marginTop:1 }}/>
              <div style={{ fontSize:12, color:"#92400e", lineHeight:1.5 }}>
                If this question is used in any audit template, deleting it may affect existing audit reports. Proceed only if you are certain.
              </div>
            </div>

            {/* Type DELETE */}
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b7280", marginBottom:6, textTransform:"uppercase" as const, letterSpacing:"0.05em" }}>
                Type <span style={{ color:"#dc2626", fontFamily:"monospace", fontSize:12, letterSpacing:"0.1em" }}>DELETE</span> to confirm
              </label>
              <input
                autoFocus
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                onKeyDown={e => { if(e.key==="Enter") confirmDelete(); if(e.key==="Escape") cancelDelete(); }}
                placeholder="Type DELETE here"
                style={{ width:"100%", border:`2px solid ${deleteInput==="DELETE"?"#dc2626":"#e5e7eb"}`, borderRadius:9, padding:"10px 13px", fontSize:14, fontWeight:700, fontFamily:"monospace", color:"#111827", outline:"none", boxSizing:"border-box" as const, letterSpacing:"0.08em", transition:"border-color 0.15s", background: deleteInput==="DELETE"?"#fff5f5":"#fff" }}
              />
            </div>
          </div>

          {/* Modal footer */}
          <div style={{ padding:"14px 22px", borderTop:"1px solid #f3f4f6", display:"flex", gap:8, justifyContent:"flex-end", background:"#fafafa" }}>
            <button onClick={cancelDelete}
              style={{ padding:"9px 20px", borderRadius:9, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontWeight:600, fontSize:13 }}>
              Cancel
            </button>
            <button onClick={confirmDelete} disabled={deleteInput !== "DELETE"}
              style={{ padding:"9px 22px", borderRadius:9, border:"none", background:deleteInput==="DELETE"?"#dc2626":"#fca5a5", color:"#fff", cursor:deleteInput==="DELETE"?"pointer":"not-allowed", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:7, transition:"background 0.15s" }}>
              <i className="ri-delete-bin-2-line"/>
              {deleteInput==="DELETE" ? "Permanently Delete" : "Type DELETE to confirm"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
