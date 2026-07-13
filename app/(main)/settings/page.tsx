"use client";

import React, { useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface MasterItem {
  id: string;
  label: string;
  description?: string;
  code?: string;
  active: boolean;
  system?: boolean; // system items can't be deleted
}

// ── Master Data ───────────────────────────────────────────────────────────────
const INITIAL_DATA: Record<string, MasterItem[]> = {

  // ── CRM ──────────────────────────────────────────────────────────────
  lead_sources: [
    { id:"ls1",  label:"Walk-in",          description:"Student visited campus directly",          active:true,  system:false },
    { id:"ls2",  label:"Website",          description:"Enquiry via college website",              active:true,  system:false },
    { id:"ls3",  label:"Instagram",        description:"Lead from Instagram ads or DMs",          active:true,  system:false },
    { id:"ls4",  label:"Facebook",         description:"Lead from Facebook page or ads",          active:true,  system:false },
    { id:"ls5",  label:"Google Ads",       description:"Paid search / display campaign",          active:true,  system:false },
    { id:"ls6",  label:"Alumni Reference", description:"Referred by a college alumnus",           active:true,  system:false },
    { id:"ls7",  label:"School Visit",     description:"Campus visit to feeder schools",          active:true,  system:false },
    { id:"ls8",  label:"Newspaper Ad",     description:"Print advertisement in newspaper",        active:true,  system:false },
    { id:"ls9",  label:"Hoarding / Banner",description:"Outdoor advertising",                     active:true,  system:false },
    { id:"ls10", label:"Agent / Dealer",   description:"External admission agent",                active:false, system:false },
    { id:"ls11", label:"YouTube",          description:"YouTube channel or ads",                  active:true,  system:false },
    { id:"ls12", label:"Other",            description:"Any other source not listed",             active:true,  system:true  },
  ],

  contact_types: [
    { id:"ct1", label:"Walk-in",   description:"In-person visit",        active:true,  system:true  },
    { id:"ct2", label:"Call",      description:"Voice phone call",        active:true,  system:true  },
    { id:"ct3", label:"WhatsApp",  description:"WhatsApp message/call",   active:true,  system:false },
    { id:"ct4", label:"Email",     description:"Email communication",     active:true,  system:false },
    { id:"ct5", label:"SMS",       description:"Text message",            active:true,  system:false },
    { id:"ct6", label:"Video Call",description:"Zoom/Meet/Teams call",    active:false, system:false },
  ],

  followup_outcomes: [
    { id:"fo1", label:"Interested",     description:"Student showed clear interest",        active:true, system:true  },
    { id:"fo2", label:"Callback",       description:"Asked to call again later",            active:true, system:false },
    { id:"fo3", label:"Positive",       description:"Progressing well",                    active:true, system:false },
    { id:"fo4", label:"Very Positive",  description:"Strong intent to join",               active:true, system:false },
    { id:"fo5", label:"Converted",      description:"Admission confirmed",                 active:true, system:true  },
    { id:"fo6", label:"No Response",    description:"Not reachable",                       active:true, system:true  },
    { id:"fo7", label:"Not Interested", description:"Declined / not pursuing",             active:true, system:true  },
    { id:"fo8", label:"Fee Issue",      description:"Interested but has fee concerns",     active:true, system:false },
    { id:"fo9", label:"Rescheduled",    description:"Follow-up date pushed",               active:true, system:false },
  ],

  // ── Academic Masters ──────────────────────────────────────────────────
  boards: [
    { id:"b1",  label:"CBSE",    description:"Central Board of Secondary Education",               code:"CBSE",   active:true, system:false },
    { id:"b2",  label:"ICSE",    description:"Indian Certificate of Secondary Education (CISCE)",  code:"ICSE",   active:true, system:false },
    { id:"b3",  label:"MP Board",description:"Madhya Pradesh Board of Secondary Education",        code:"MPBSE",  active:true, system:false },
    { id:"b4",  label:"UP Board",description:"Uttar Pradesh Madhyamik Shiksha Parishad",           code:"UPMSP",  active:true, system:false },
    { id:"b5",  label:"Rajasthan Board",description:"Board of Secondary Education, Rajasthan",    code:"RBSE",   active:true, system:false },
    { id:"b6",  label:"Maharashtra Board",description:"Maharashtra State Board of Education",     code:"MSBSHSE",active:true, system:false },
    { id:"b7",  label:"Gujarat Board",description:"Gujarat Secondary & Higher Secondary Board",   code:"GSEB",   active:true, system:false },
    { id:"b8",  label:"Bihar Board",description:"Bihar School Examination Board",                 code:"BSEB",   active:true, system:false },
    { id:"b9",  label:"Barkatullah University",description:"Barkatullah Vishwavidyalaya, Bhopal", code:"BU",     active:true, system:false },
    { id:"b10", label:"RGPV",    description:"Rajiv Gandhi Proudyogiki Vishwavidyalaya",          code:"RGPV",   active:true, system:false },
    { id:"b11", label:"Devi Ahilya University",description:"DAVV, Indore",                       code:"DAVV",   active:true, system:false },
    { id:"b12", label:"Other",   description:"Any other board / university",                      code:"OTH",    active:true, system:true  },
  ],

  divisions: [
    { id:"dv1", label:"Distinction",      description:"75% and above",          code:"DIST", active:true, system:false },
    { id:"dv2", label:"First Division",   description:"60% to 74.99%",          code:"1ST",  active:true, system:false },
    { id:"dv3", label:"Second Division",  description:"45% to 59.99%",          code:"2ND",  active:true, system:false },
    { id:"dv4", label:"Third Division",   description:"33% to 44.99%",          code:"3RD",  active:true, system:false },
    { id:"dv5", label:"Pass Class",       description:"Passed with grace marks", code:"PASS", active:true, system:false },
    { id:"dv6", label:"Fail",             description:"Did not clear the exam",  code:"FAIL", active:true, system:true  },
    { id:"dv7", label:"Compartment",      description:"One subject failed",      code:"COMP", active:true, system:false },
    { id:"dv8", label:"Result Awaited",   description:"Results not yet declared",code:"RAWA", active:true, system:false },
  ],

  courses: [
    { id:"c1",  label:"BCA",     description:"Bachelor of Computer Applications",     code:"BCA",    active:true, system:false },
    { id:"c2",  label:"B.Com",   description:"Bachelor of Commerce",                  code:"BCOM",   active:true, system:false },
    { id:"c3",  label:"B.Sc",    description:"Bachelor of Science",                   code:"BSC",    active:true, system:false },
    { id:"c4",  label:"BBA",     description:"Bachelor of Business Administration",   code:"BBA",    active:true, system:false },
    { id:"c5",  label:"MBA",     description:"Master of Business Administration",     code:"MBA",    active:true, system:false },
    { id:"c6",  label:"B.Tech",  description:"Bachelor of Technology",                code:"BTECH",  active:true, system:false },
    { id:"c7",  label:"M.Com",   description:"Master of Commerce",                    code:"MCOM",   active:true, system:false },
    { id:"c8",  label:"MCA",     description:"Master of Computer Applications",       code:"MCA",    active:true, system:false },
    { id:"c9",  label:"M.Sc",    description:"Master of Science",                     code:"MSC",    active:true, system:false },
    { id:"c10", label:"BA",      description:"Bachelor of Arts",                      code:"BA",     active:true, system:false },
    { id:"c11", label:"MA",      description:"Master of Arts",                        code:"MA",     active:true, system:false },
    { id:"c12", label:"B.Pharm", description:"Bachelor of Pharmacy",                  code:"BPHARM", active:true, system:false },
    { id:"c13", label:"BBA LLB", description:"Integrated BBA and LLB",               code:"BBLLB",  active:false, system:false },
    { id:"c14", label:"BMLT",    description:"Bachelor of Medical Lab Technology",    code:"BMLT",   active:false, system:false },
  ],

  sessions: [
    { id:"s1", label:"2026-27", description:"Current active session",    code:"2627", active:true,  system:false },
    { id:"s2", label:"2025-26", description:"Previous session",          code:"2526", active:true,  system:false },
    { id:"s3", label:"2024-25", description:"Archived",                  code:"2425", active:false, system:false },
    { id:"s4", label:"2023-24", description:"Archived",                  code:"2324", active:false, system:false },
    { id:"s5", label:"2022-23", description:"Archived",                  code:"2223", active:false, system:false },
  ],

  // ── Student Masters ───────────────────────────────────────────────────
  categories: [
    { id:"cat1", label:"General",               description:"Open / Unreserved category",              code:"GEN", active:true, system:true  },
    { id:"cat2", label:"OBC (Non-Creamy Layer)",description:"Other Backward Classes — NCL",            code:"OBC", active:true, system:true  },
    { id:"cat3", label:"SC",                    description:"Scheduled Caste",                         code:"SC",  active:true, system:true  },
    { id:"cat4", label:"ST",                    description:"Scheduled Tribe",                         code:"ST",  active:true, system:true  },
    { id:"cat5", label:"EWS",                   description:"Economically Weaker Section",             code:"EWS", active:true, system:false },
    { id:"cat6", label:"OBC (Creamy Layer)",    description:"OBC above income threshold",             code:"OBCL",active:true, system:false },
    { id:"cat7", label:"PwD",                   description:"Person with Disability",                 code:"PWD", active:true, system:false },
    { id:"cat8", label:"Ex-Serviceman",         description:"Ward of ex-serviceman",                  code:"ESM", active:true, system:false },
  ],

  blood_groups: [
    { id:"bg1", label:"A+",  description:"Blood Group A Positive",  active:true, system:true },
    { id:"bg2", label:"A−",  description:"Blood Group A Negative",  active:true, system:true },
    { id:"bg3", label:"B+",  description:"Blood Group B Positive",  active:true, system:true },
    { id:"bg4", label:"B−",  description:"Blood Group B Negative",  active:true, system:true },
    { id:"bg5", label:"O+",  description:"Blood Group O Positive",  active:true, system:true },
    { id:"bg6", label:"O−",  description:"Blood Group O Negative",  active:true, system:true },
    { id:"bg7", label:"AB+", description:"Blood Group AB Positive", active:true, system:true },
    { id:"bg8", label:"AB−", description:"Blood Group AB Negative", active:true, system:true },
  ],

  languages: [
    { id:"lang1", label:"Hindi",     active:true,  system:false },
    { id:"lang2", label:"English",   active:true,  system:false },
    { id:"lang3", label:"Sanskrit",  active:true,  system:false },
    { id:"lang4", label:"Urdu",      active:true,  system:false },
    { id:"lang5", label:"Marathi",   active:true,  system:false },
    { id:"lang6", label:"Bengali",   active:true,  system:false },
    { id:"lang7", label:"Gujarati",  active:true,  system:false },
    { id:"lang8", label:"Tamil",     active:true,  system:false },
    { id:"lang9", label:"Telugu",    active:true,  system:false },
    { id:"lang10",label:"Kannada",   active:true,  system:false },
    { id:"lang11",label:"Punjabi",   active:true,  system:false },
    { id:"lang12",label:"Odia",      active:false, system:false },
  ],

  religions: [
    { id:"r1", label:"Hinduism",    active:true, system:false },
    { id:"r2", label:"Islam",       active:true, system:false },
    { id:"r3", label:"Christianity",active:true, system:false },
    { id:"r4", label:"Sikhism",     active:true, system:false },
    { id:"r5", label:"Jainism",     active:true, system:false },
    { id:"r6", label:"Buddhism",    active:true, system:false },
    { id:"r7", label:"Others",      active:true, system:true  },
  ],

  // ── Fee Setup ─────────────────────────────────────────────────────────
  fee_heads: [
    { id:"fh1", label:"Tuition Fee",       description:"Core academic fee",                  code:"TUI", active:true, system:true  },
    { id:"fh2", label:"Development Fee",   description:"Infrastructure and development",     code:"DEV", active:true, system:false },
    { id:"fh3", label:"Examination Fee",   description:"Per-semester exam charges",          code:"EXM", active:true, system:false },
    { id:"fh4", label:"Library Fee",       description:"Annual library membership",          code:"LIB", active:true, system:false },
    { id:"fh5", label:"Sports Fee",        description:"Sports and extracurricular",         code:"SPT", active:true, system:false },
    { id:"fh6", label:"Lab Fee",           description:"Laboratory usage charges",           code:"LAB", active:true, system:false },
    { id:"fh7", label:"Hostel Fee",        description:"Hostel accommodation",               code:"HST", active:true, system:false },
    { id:"fh8", label:"Transport Fee",     description:"Bus / transport usage",              code:"TRN", active:true, system:false },
    { id:"fh9", label:"Caution Deposit",   description:"Refundable security deposit",        code:"CAU", active:true, system:false },
    { id:"fh10",label:"Miscellaneous",     description:"Other charges",                      code:"MIS", active:true, system:true  },
  ],

  concession_types: [
    { id:"con1", label:"Merit Scholarship",        description:"Based on academic performance",   active:true, system:false },
    { id:"con2", label:"Government Scholarship",   description:"State / central govt schemes",    active:true, system:false },
    { id:"con3", label:"Sports Quota",             description:"Concession for sports achievers", active:true, system:false },
    { id:"con4", label:"Staff Ward",               description:"Concession for staff children",   active:true, system:false },
    { id:"con5", label:"Sibling Discount",         description:"Concession for siblings enrolled",active:true, system:false },
    { id:"con6", label:"Management Discretion",    description:"Case-by-case approval",           active:true, system:false },
    { id:"con7", label:"Alumni Reference",         description:"Alumni referral benefit",         active:false,system:false },
  ],

  // ── Documents ─────────────────────────────────────────────────────────
  document_types: [
    { id:"dt1",  label:"10th Mark Sheet",           description:"Class 10 board mark sheet",         code:"10TH",  active:true, system:false },
    { id:"dt2",  label:"12th Mark Sheet",           description:"Class 12 board mark sheet",         code:"12TH",  active:true, system:false },
    { id:"dt3",  label:"Birth Certificate",         description:"Date of birth proof",               code:"DOB",   active:true, system:false },
    { id:"dt4",  label:"Category Certificate",      description:"SC/ST/OBC/EWS certificate",        code:"CAT",   active:true, system:false },
    { id:"dt5",  label:"Aadhar Card",               description:"National ID proof",                 code:"AADH",  active:true, system:true  },
    { id:"dt6",  label:"Income Certificate",        description:"Family income proof",               code:"INC",   active:true, system:false },
    { id:"dt7",  label:"Migration Certificate",     description:"Migration from previous school",    code:"MIG",   active:true, system:false },
    { id:"dt8",  label:"Character Certificate",     description:"From previous institution",         code:"CHR",   active:true, system:false },
    { id:"dt9",  label:"Transfer Certificate (TC)", description:"TC from last institution",          code:"TC",    active:true, system:false },
    { id:"dt10", label:"Anti-Ragging Affidavit",    description:"Mandatory affidavit",              code:"ARG",   active:true, system:true  },
    { id:"dt11", label:"Medical Fitness Certificate",description:"From registered MBBS doctor",     code:"MED",   active:false, system:false },
    { id:"dt12", label:"Passport Size Photos",      description:"Recent photographs",               code:"PHO",   active:true, system:false },
  ],
};

// ── Left-nav sections ──────────────────────────────────────────────────────────
const SECTIONS = [
  {
    group: "CRM Settings",
    icon: "ri-customer-service-2-line",
    color: "#7c3aed",
    items: [
      { key:"lead_sources",     label:"Lead Sources",       icon:"ri-map-pin-user-line"   },
      { key:"contact_types",    label:"Contact Types",      icon:"ri-phone-line"          },
      { key:"followup_outcomes",label:"Follow-up Outcomes", icon:"ri-checkbox-circle-line"},
    ],
  },
  {
    group: "Academic Masters",
    icon: "ri-graduation-cap-line",
    color: "#2563eb",
    items: [
      { key:"boards",   label:"Boards / Universities", icon:"ri-building-4-line"     },
      { key:"divisions",label:"Division / Grade",      icon:"ri-medal-line"          },
      { key:"courses",  label:"Courses",               icon:"ri-book-2-line"         },
      { key:"sessions", label:"Academic Sessions",     icon:"ri-calendar-2-line"     },
    ],
  },
  {
    group: "Student Masters",
    icon: "ri-team-line",
    color: "#059669",
    items: [
      { key:"categories",  label:"Student Category",  icon:"ri-group-line"          },
      { key:"blood_groups",label:"Blood Groups",      icon:"ri-heart-pulse-line"    },
      { key:"languages",   label:"Languages",         icon:"ri-translate-2"         },
      { key:"religions",   label:"Religion",          icon:"ri-community-line"      },
    ],
  },
  {
    group: "Fee Setup",
    icon: "ri-money-rupee-circle-line",
    color: "#d97706",
    items: [
      { key:"fee_heads",       label:"Fee Heads",         icon:"ri-list-check-line"     },
      { key:"concession_types",label:"Concession Types",  icon:"ri-discount-percent-line"},
    ],
  },
  {
    group: "Document Masters",
    icon: "ri-folder-open-line",
    color: "#0891b2",
    items: [
      { key:"document_types", label:"Document Types", icon:"ri-file-list-3-line" },
    ],
  },
];

const SECTION_META: Record<string, { title: string; description: string; showCode: boolean }> = {
  lead_sources:      { title:"Lead Sources",         description:"Manage enquiry and admission lead sources used in CRM follow-ups.",  showCode:false },
  contact_types:     { title:"Contact Types",        description:"Types of touchpoints used in counselor follow-up activities.",       showCode:false },
  followup_outcomes: { title:"Follow-up Outcomes",   description:"Outcome options recorded after each counselor follow-up attempt.",  showCode:false },
  boards:            { title:"Boards / Universities",description:"Boards and universities used in student previous school details.",   showCode:true  },
  divisions:         { title:"Division / Grade",     description:"Result divisions/grades shown in previous school records.",         showCode:true  },
  courses:           { title:"Courses",              description:"Courses offered by the institution.",                               showCode:true  },
  sessions:          { title:"Academic Sessions",    description:"Academic year sessions. Mark one as Active/Current.",              showCode:true  },
  categories:        { title:"Student Category",     description:"Reservation/quota categories for student admission.",             showCode:true  },
  blood_groups:      { title:"Blood Groups",         description:"Standard ABO + Rh blood group options.",                          showCode:false },
  languages:         { title:"Languages",            description:"Languages a student can select as mother tongue or known language.",showCode:false },
  religions:         { title:"Religion",             description:"Religion options for student profile.",                            showCode:false },
  fee_heads:         { title:"Fee Heads",            description:"Individual fee components used in fee structure assignment.",      showCode:true  },
  concession_types:  { title:"Concession Types",     description:"Types of concessions/scholarships applicable on fee.",            showCode:false },
  document_types:    { title:"Document Types",       description:"Documents required from students during admission.",              showCode:true  },
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeKey, setActiveKey] = useState("lead_sources");
  const [data, setData] = useState<Record<string, MasterItem[]>>(INITIAL_DATA);
  const [newLabel, setNewLabel]   = useState("");
  const [newDesc,  setNewDesc]    = useState("");
  const [newCode,  setNewCode]    = useState("");
  const [adding,   setAdding]     = useState(false);
  const [search,   setSearch]     = useState("");

  const meta    = SECTION_META[activeKey];
  const items   = data[activeKey] ?? [];
  const filtered = items.filter((i) =>
    !search || i.label.toLowerCase().includes(search.toLowerCase()) || (i.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setData((prev) => ({
      ...prev,
      [activeKey]: prev[activeKey].map((i) => i.id === id ? { ...i, active: !i.active } : i),
    }));
  };

  const deleteItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      [activeKey]: prev[activeKey].filter((i) => i.id !== id),
    }));
  };

  const addItem = () => {
    if (!newLabel.trim()) return;
    const newItem: MasterItem = {
      id: `${activeKey}_${Date.now()}`,
      label: newLabel.trim(),
      description: newDesc.trim() || undefined,
      code: newCode.trim() || undefined,
      active: true,
      system: false,
    };
    setData((prev) => ({ ...prev, [activeKey]: [...prev[activeKey], newItem] }));
    setNewLabel(""); setNewDesc(""); setNewCode(""); setAdding(false);
  };

  const activeCount   = items.filter((i) => i.active).length;
  const inactiveCount = items.length - activeCount;

  const switchSection = (key: string) => {
    setActiveKey(key);
    setSearch("");
    setAdding(false);
    setNewLabel(""); setNewDesc(""); setNewCode("");
  };

  return (
    <div style={{ padding:"24px 28px", minHeight:"100%", background:"var(--default-background,#f8f9fa)" }}>

      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-muted)", marginBottom:6 }}>
        <Link href="/dashboard" style={{ color:"var(--text-muted)", textDecoration:"none" }}>Dashboard</Link>
        <i className="ri-arrow-right-s-line" />
        <span style={{ color:"var(--default-text-color)", fontWeight:600 }}>Settings</span>
      </div>

      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>Settings & Masters</h1>
        <p style={{ fontSize:13, color:"var(--text-muted)", margin:"3px 0 0" }}>Configure masters, dropdowns, and application behaviour</p>
      </div>

      {/* Two-col layout */}
      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:20, alignItems:"start" }}>

        {/* ── Left Nav ── */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", position:"sticky", top:80 }}>
          {SECTIONS.map((sec) => (
            <div key={sec.group}>
              {/* Group header */}
              <div style={{ padding:"10px 16px 6px", display:"flex", alignItems:"center", gap:8 }}>
                <i className={sec.icon} style={{ fontSize:13, color:sec.color }} />
                <span style={{ fontSize:10, fontWeight:800, color:sec.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>{sec.group}</span>
              </div>
              {/* Items */}
              {sec.items.map((item) => {
                const isActive = activeKey === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => switchSection(item.key)}
                    style={{
                      display:"flex", alignItems:"center", gap:10,
                      width:"100%", textAlign:"left",
                      padding:"9px 16px 9px 28px",
                      background: isActive ? "rgba(108,95,252,0.08)" : "transparent",
                      border:"none", cursor:"pointer",
                      borderLeft: isActive ? "3px solid var(--primary-color,#6c5ffc)" : "3px solid transparent",
                      transition:"all 0.15s",
                    }}
                  >
                    <i className={item.icon} style={{ fontSize:14, color: isActive ? "var(--primary-color)" : "var(--text-muted)", flexShrink:0 }} />
                    <span style={{ fontSize:13, fontWeight: isActive ? 700 : 500, color: isActive ? "var(--primary-color)" : "var(--default-text-color)" }}>
                      {item.label}
                    </span>
                    <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, color: isActive ? "var(--primary-color)" : "var(--text-muted)", background: isActive ? "rgba(108,95,252,0.12)" : "var(--default-background)", padding:"1px 7px", borderRadius:10 }}>
                      {(data[item.key] ?? []).filter((x) => x.active).length}
                    </span>
                  </button>
                );
              })}
              <div style={{ height:1, background:"var(--default-border)", margin:"4px 0" }} />
            </div>
          ))}
        </div>

        {/* ── Right Panel ── */}
        <div>
          {/* Panel header */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid var(--default-border)", padding:"20px 24px", marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
              <div>
                <h2 style={{ fontSize:18, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 4px" }}>{meta?.title}</h2>
                <p style={{ fontSize:13, color:"var(--text-muted)", margin:0 }}>{meta?.description}</p>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                <span style={{ fontSize:12, color:"var(--text-muted)", background:"var(--default-background)", padding:"4px 10px", borderRadius:8 }}>
                  <span style={{ color:"#16a34a", fontWeight:700 }}>{activeCount}</span> active &nbsp;·&nbsp; <span style={{ color:"var(--text-muted)" }}>{inactiveCount}</span> inactive
                </span>
                <button
                  onClick={() => setAdding(true)}
                  style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", background:"var(--primary-color,#6c5ffc)", color:"#fff", border:"none", borderRadius:9, fontWeight:700, fontSize:13, cursor:"pointer" }}
                >
                  <i className="ri-add-line" /> Add New
                </button>
              </div>
            </div>

            {/* Add form (inline) */}
            {adding && (
              <div style={{ marginTop:16, padding:"16px", background:"rgba(108,95,252,0.04)", border:"1px dashed rgba(108,95,252,0.3)", borderRadius:10 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--primary-color)", marginBottom:12 }}>
                  <i className="ri-add-circle-line" style={{ marginRight:6 }} />Add New {meta?.title.replace(/s$/, "")}
                </div>
                <div style={{ display:"grid", gridTemplateColumns: meta?.showCode ? "1fr 1fr 100px" : "1fr 1fr", gap:10, marginBottom:12 }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", display:"block", marginBottom:4 }}>Label *</label>
                    <input
                      autoFocus value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="e.g. LinkedIn" onKeyDown={(e) => e.key === "Enter" && addItem()}
                      style={{ ...inputStyle, width:"100%" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", display:"block", marginBottom:4 }}>Description</label>
                    <input
                      value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Short description (optional)"
                      style={{ ...inputStyle, width:"100%" }}
                    />
                  </div>
                  {meta?.showCode && (
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", display:"block", marginBottom:4 }}>Code</label>
                      <input
                        value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                        placeholder="e.g. LI" maxLength={8}
                        style={{ ...inputStyle, width:"100%", fontFamily:"monospace" }}
                      />
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={addItem} style={{ padding:"7px 16px", background:"var(--primary-color)", color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    <i className="ri-save-line" style={{ marginRight:4 }} />Save
                  </button>
                  <button onClick={() => { setAdding(false); setNewLabel(""); setNewDesc(""); setNewCode(""); }} style={{ padding:"7px 16px", background:"transparent", color:"var(--text-muted)", border:"1px solid var(--default-border)", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ background:"#fff", borderRadius:10, border:"1px solid var(--default-border)", padding:"0 14px", display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <i className="ri-search-line" style={{ color:"var(--text-muted)", fontSize:14 }} />
            <input
              type="text" placeholder={`Search ${meta?.title.toLowerCase()}…`}
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ border:"none", background:"transparent", outline:"none", fontSize:13, color:"var(--default-text-color)", padding:"10px 0", width:"100%" }}
            />
            {search && <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", padding:0 }}><i className="ri-close-line" /></button>}
          </div>

          {/* Items list */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
            {/* Table header */}
            <div style={{ display:"grid", gridTemplateColumns: meta?.showCode ? "1fr 1.5fr 80px 90px 80px" : "1fr 2fr 90px 80px", gap:0, background:"var(--default-background)", borderBottom:"1px solid var(--default-border)", padding:"10px 18px" }}>
              <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Label</span>
              <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Description</span>
              {meta?.showCode && <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Code</span>}
              <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Status</span>
              <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Actions</span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding:"48px 24px", textAlign:"center", color:"var(--text-muted)" }}>
                <i className="ri-search-line" style={{ fontSize:36, display:"block", marginBottom:8, opacity:0.3 }} />
                No items found
              </div>
            ) : (
              filtered.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    display:"grid",
                    gridTemplateColumns: meta?.showCode ? "1fr 1.5fr 80px 90px 80px" : "1fr 2fr 90px 80px",
                    gap:0,
                    padding:"13px 18px",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--default-border)" : "none",
                    alignItems:"center",
                    background: item.active ? "#fff" : "rgba(0,0,0,0.015)",
                    transition:"background 0.1s",
                  }}
                >
                  {/* Label */}
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {item.system && (
                      <span title="System item — cannot be deleted" style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4, background:"rgba(108,95,252,0.1)", color:"var(--primary-color)", letterSpacing:"0.04em" }}>SYS</span>
                    )}
                    <span style={{ fontSize:13, fontWeight:600, color: item.active ? "var(--default-text-color)" : "var(--text-muted)" }}>{item.label}</span>
                  </div>

                  {/* Description */}
                  <span style={{ fontSize:12, color:"var(--text-muted)", paddingRight:12 }}>{item.description ?? "—"}</span>

                  {/* Code */}
                  {meta?.showCode && (
                    <span style={{ fontSize:11, fontFamily:"monospace", fontWeight:700, color:"var(--primary-color)", background:"rgba(108,95,252,0.08)", padding:"2px 8px", borderRadius:6, letterSpacing:"0.04em", display:"inline-block" }}>
                      {item.code ?? "—"}
                    </span>
                  )}

                  {/* Toggle */}
                  <div>
                    <button
                      onClick={() => toggleActive(item.id)}
                      style={{
                        position:"relative",
                        width:38, height:20,
                        borderRadius:10,
                        border:"none",
                        background: item.active ? "var(--primary-color,#6c5ffc)" : "#d1d5db",
                        cursor:"pointer",
                        transition:"background 0.2s",
                        flexShrink:0,
                      }}
                    >
                      <span style={{
                        position:"absolute",
                        top:2,
                        left: item.active ? 20 : 2,
                        width:16, height:16,
                        borderRadius:"50%",
                        background:"#fff",
                        transition:"left 0.2s",
                        boxShadow:"0 1px 3px rgba(0,0,0,0.2)",
                      }} />
                    </button>
                    <span style={{ fontSize:10, color: item.active ? "#16a34a" : "var(--text-muted)", marginLeft:6, fontWeight:600 }}>
                      {item.active ? "Active" : "Off"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:6 }}>
                    <button title="Edit" style={{ ...actionBtn, color:"#2563eb" }}>
                      <i className="ri-edit-line" style={{ fontSize:13 }} />
                    </button>
                    <button
                      title={item.system ? "System item — cannot be deleted" : "Delete"}
                      disabled={item.system}
                      onClick={() => !item.system && deleteItem(item.id)}
                      style={{ ...actionBtn, color: item.system ? "#d1d5db" : "#dc2626", cursor: item.system ? "not-allowed" : "pointer" }}
                    >
                      <i className="ri-delete-bin-line" style={{ fontSize:13 }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer hint */}
          <div style={{ marginTop:12, fontSize:12, color:"var(--text-muted)", display:"flex", gap:16 }}>
            <span><span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4, background:"rgba(108,95,252,0.1)", color:"var(--primary-color)", marginRight:4 }}>SYS</span>System items cannot be deleted</span>
            <span>· Toggle to hide an option without deleting it</span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  border:"1px solid var(--default-border)",
  borderRadius:8, padding:"8px 12px",
  fontSize:13, color:"var(--default-text-color)",
  background:"#fff", outline:"none",
  boxSizing:"border-box",
};

const actionBtn: React.CSSProperties = {
  width:28, height:28, borderRadius:7,
  border:"1px solid var(--default-border)",
  background:"transparent",
  cursor:"pointer",
  display:"flex", alignItems:"center", justifyContent:"center",
  transition:"background 0.1s",
};
