"use client";
import React, { useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Toggle { label: string; desc: string; on: boolean }

// ── Left nav structure ─────────────────────────────────────────────────────────
const SECTIONS = [
  {
    group: "Organisation",
    icon: "ri-building-2-line",
    color: "#16a34a",
    items: [
      { key:"company",       label:"Company Profile",      icon:"ri-building-2-line"      },
      { key:"branding",      label:"Branding & Logo",      icon:"ri-brush-line"           },
    ],
  },
  {
    group: "Audit Configuration",
    icon: "ri-file-list-3-line",
    color: "#2563eb",
    items: [
      { key:"load-type",     label:"Load Type",            icon:"ri-flashlight-line"      },
      { key:"ac-tonnage",    label:"AC Tonnage",           icon:"ri-temp-cold-line"       },
      { key:"scoring",       label:"Scoring & Grading",    icon:"ri-bar-chart-2-line"     },
    ],
  },
  {
    group: "Reports",
    icon: "ri-file-pdf-line",
    color: "#0891b2",
    items: [
      { key:"report-config", label:"Report Configuration", icon:"ri-file-pdf-line"        },
    ],
  },
  {
    group: "Notifications",
    icon: "ri-notification-3-line",
    color: "#ca8a04",
    items: [
      { key:"email-smtp",    label:"Email / SMTP",         icon:"ri-mail-settings-line"   },
      { key:"sms",           label:"SMS / WhatsApp",       icon:"ri-message-3-line"       },
    ],
  },
  {
    group: "Security & Access",
    icon: "ri-shield-keyhole-line",
    color: "#dc2626",
    items: [
      { key:"password",      label:"Password Policy",      icon:"ri-lock-password-line"   },
    ],
  },
  {
    group: "Masters",
    icon: "ri-list-settings-line",
    color: "#0891b2",
    items: [
      { key:"status-master",  label:"Status Master",        icon:"ri-flag-line"            },
    ],
  },
  {
    group: "Data & System",
    icon: "ri-database-2-line",
    color: "#374151",
    items: [
      { key:"backup",        label:"Backup & Export",      icon:"ri-save-3-line"          },
      { key:"integrations",  label:"Integrations / API",   icon:"ri-plug-line"            },
    ],
  },
];

// ── Shared styles ──────────────────────────────────────────────────────────────
const INP: React.CSSProperties = {
  border:"1px solid var(--default-border)", borderRadius:8, padding:"8px 12px",
  fontSize:13, color:"var(--default-text-color)", background:"var(--custom-white)",
  outline:"none", width:"100%", boxSizing:"border-box",
};
const SEL: React.CSSProperties = { ...INP };
const SB: React.CSSProperties = {
  display:"inline-flex", alignItems:"center", gap:6, padding:"9px 20px",
  background:"var(--primary-color,#16a34a)", color:"#fff", border:"none",
  borderRadius:9, fontWeight:700, fontSize:13, cursor:"pointer",
};
const OB: React.CSSProperties = {
  display:"inline-flex", alignItems:"center", gap:6, padding:"9px 16px",
  background:"transparent", color:"var(--text-muted)", border:"1px solid var(--default-border)",
  borderRadius:9, fontWeight:600, fontSize:13, cursor:"pointer",
};
const CARD: React.CSSProperties = {
  background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)",
  padding:"22px 24px", marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
};
const FS12: React.CSSProperties = { fontSize:12, color:"var(--text-muted)", display:"block", marginBottom:5, fontWeight:600 };
const SH: React.CSSProperties = { fontSize:13, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 16px", display:"flex", alignItems:"center", gap:8 };

// ── Toggle switch ──────────────────────────────────────────────────────────────
function ToggleSwitch({ on, onChange }: { on: boolean; onChange: (v:boolean)=>void }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width:40, height:22, borderRadius:11, border:"none", background:on?"var(--primary-color,#16a34a)":"#d1d5db", cursor:"pointer", position:"relative", flexShrink:0, transition:"background 0.2s" }}>
      <span style={{ position:"absolute", top:3, left:on?20:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
    </button>
  );
}
function ToggleRow({ label, desc, on, onChange }: Toggle & { onChange:(v:boolean)=>void }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid var(--default-border)" }}>
      <div>
        <p style={{ fontSize:13, fontWeight:600, color:"var(--default-text-color)", margin:0 }}>{label}</p>
        <p style={{ fontSize:11.5, color:"var(--text-muted)", margin:"2px 0 0" }}>{desc}</p>
      </div>
      <ToggleSwitch on={on} onChange={onChange}/>
    </div>
  );
}

// ── Content panels ─────────────────────────────────────────────────────────────
function CompanyPanel() {
  const [schemaOpen, setSchemaOpen] = useState(false);

  const COMPANY_SQL = `CREATE TABLE companies (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name     VARCHAR(255)  NOT NULL,
  short_name       VARCHAR(100),
  description      TEXT,
  gstin            VARCHAR(20)   UNIQUE,
  pan              VARCHAR(15)   UNIQUE,
  cin              VARCHAR(25)   UNIQUE,
  address          TEXT,
  city             VARCHAR(100),
  state            VARCHAR(100),
  pincode          VARCHAR(10),
  website          VARCHAR(255),
  email            VARCHAR(150),
  support_email    VARCHAR(150),
  phone            VARCHAR(20),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_companies_gstin ON companies (gstin);
CREATE INDEX idx_companies_pan   ON companies (pan);`;

  const SQL_KW   = /\b(CREATE|TABLE|PRIMARY|KEY|DEFAULT|NOT|NULL|UNIQUE|INDEX|ON|AND)\b/g;
  const SQL_TYPE = /\b(UUID|VARCHAR|TEXT|TIMESTAMPTZ|BOOLEAN|INT)\b/g;
  const SQL_FN   = /\b(gen_random_uuid|now)\b/g;
  const SQL_CMT  = /(--[^\n]*)/g;

  function colorizeSqlCompany(sql: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    let last = 0;
    const tokens: { index: number; end: number; type: string; text: string }[] = [];
    const scan = (rx: RegExp, type: string) => {
      rx.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = rx.exec(sql)) !== null) tokens.push({ index: m.index, end: m.index + m[0].length, type, text: m[0] });
    };
    scan(SQL_CMT, "cmt"); scan(SQL_KW, "kw"); scan(SQL_TYPE, "type"); scan(SQL_FN, "fn");
    tokens.sort((a, b) => a.index - b.index);
    const seen = new Set<number>();
    for (const t of tokens) {
      if (seen.has(t.index)) continue;
      seen.add(t.index);
      if (t.index > last) parts.push(sql.slice(last, t.index));
      const color = t.type === "kw" ? "#569cd6" : t.type === "type" ? "#4ec9b0" : t.type === "fn" ? "#dcdcaa" : "#6a9955";
      parts.push(<span key={t.index} style={{ color }}>{t.text}</span>);
      last = t.end;
    }
    if (last < sql.length) parts.push(sql.slice(last));
    return parts;
  }

  const [f, setF] = useState({
    companyName:"Save Earth Energy Services Pvt. Ltd.",
    shortName:"Save Earth Energy",
    description:"BEE CERTIFIED ENERGY AUDITOR, CONSULTANT FOR NRE, ELECTRICAL PROJECTS",
    gstin:"27AACES1234P1ZK",
    pan:"AACES1234P",
    cin:"U40100GJ2019PTC109876",
    address:"12, Green Avenue, Ahmedabad, Gujarat - 380001",
    city:"Ahmedabad", state:"Gujarat", pincode:"380001",
    website:"https://saveearth.energy",
    email:"info@saveearth.in",
    phone:"+91 79 4560 1234",
    supportEmail:"support@saveearth.in",
  });
  const F = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({...f, [k]:e.target.value});
  return (
    <div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-building-2-line" style={{ color:"var(--primary-color)" }}/>Company Details</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div><label style={FS12}>Company Legal Name</label><input value={f.companyName} onChange={F("companyName")} style={INP}/></div>
          <div><label style={FS12}>Short / Display Name</label><input value={f.shortName} onChange={F("shortName")} style={INP}/></div>
          <div><label style={FS12}>GSTIN</label><input value={f.gstin} onChange={F("gstin")} style={{ ...INP, fontFamily:"monospace" }}/></div>
          <div><label style={FS12}>PAN Number</label><input value={f.pan} onChange={F("pan")} style={{ ...INP, fontFamily:"monospace" }}/></div>
          <div><label style={FS12}>CIN</label><input value={f.cin} onChange={F("cin")} style={{ ...INP, fontFamily:"monospace" }}/></div>
          <div><label style={FS12}>Website</label><input value={f.website} onChange={F("website")} style={INP}/></div>
        </div>
        <div style={{ marginTop:14 }}>
          <label style={FS12}>Description</label>
          <textarea value={f.description} onChange={F("description")} placeholder="Write a short description." rows={3}
            style={{ ...INP, resize:"vertical", lineHeight:1.5, paddingTop:8, paddingBottom:8 }}/>
        </div>
      </div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-map-pin-line" style={{ color:"var(--primary-color)" }}/>Address & Contact</h3>
        <div style={{ marginBottom:14 }}>
          <label style={FS12}>Registered Address</label>
          <input value={f.address} onChange={F("address")} style={INP}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:14 }}>
          <div><label style={FS12}>City</label><input value={f.city} onChange={F("city")} style={INP}/></div>
          <div><label style={FS12}>State</label><input value={f.state} onChange={F("state")} style={INP}/></div>
          <div><label style={FS12}>Pincode</label><input value={f.pincode} onChange={F("pincode")} style={INP}/></div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div><label style={FS12}>Primary Email</label><input value={f.email} onChange={F("email")} style={INP}/></div>
          <div><label style={FS12}>Support Email</label><input value={f.supportEmail} onChange={F("supportEmail")} style={INP}/></div>
          <div><label style={FS12}>Phone</label><input value={f.phone} onChange={F("phone")} style={INP}/></div>
        </div>
      </div>
      {/* DB Schema card */}
      <div style={{ ...CARD, padding:0, overflow:"hidden" }}>
        <div onClick={() => setSchemaOpen(o => !o)}
          style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", cursor:"pointer", userSelect:"none" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"#faf5ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ri-database-2-line" style={{ fontSize:16, color:"#9333ea" }}/>
            </div>
            <span style={{ fontSize:13, fontWeight:800, color:"#111827" }}>Database Schema</span>
            <span style={{ fontSize:10, color:"#9333ea", background:"#faf5ff", borderRadius:20, padding:"1px 8px", fontWeight:700 }}>companies</span>
          </div>
          <i className={`ri-arrow-${schemaOpen ? "up" : "down"}-s-line`} style={{ color:"#9ca3af", fontSize:18 }}/>
        </div>
        {schemaOpen && (
          <div style={{ background:"#1e1e1e", padding:"14px 16px", overflowX:"auto", maxHeight:260, overflowY:"auto" }}>
            <pre style={{ margin:0, fontSize:11, fontFamily:"'Cascadia Code','Fira Code',monospace", lineHeight:1.6, whiteSpace:"pre", color:"#d4d4d4" }}>
              {colorizeSqlCompany(COMPANY_SQL)}
            </pre>
          </div>
        )}
      </div>

      <div style={{ display:"flex", gap:10 }}>
        <button style={SB}><i className="ri-save-line"/>Save Company Profile</button>
      </div>
    </div>
  );
}

function AuditSettingsPanel() {
  const [f, setF] = useState({
    defaultTemplate:"Electrical Safety v2.1", auditPrefix:"AU", yearFormat:"YYYY",
    autoAssignOnCreate:true, requirePhotos:true, requireGPS:false,
    maxPhotosPerSection:"10", allowOfflineSubmission:true,
    submitWithIncompletes:false, requireSupervisorApproval:true,
  });
  const T = (k: keyof typeof f) => setF({...f, [k]:!f[k]});
  return (
    <div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-settings-3-line" style={{ color:"#2563eb" }}/>General Audit Settings</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          <div>
            <label style={FS12}>Default Checklist Template</label>
            <select value={f.defaultTemplate} onChange={e => setF({...f, defaultTemplate:e.target.value})} style={SEL}>
              <option>Electrical Safety v2.1</option>
              <option>Electrical Safety v2.0</option>
              <option>Fire Safety v1.3</option>
              <option>HVAC Compliance v1.0</option>
            </select>
          </div>
          <div>
            <label style={FS12}>Audit ID Prefix</label>
            <input value={f.auditPrefix} onChange={e => setF({...f, auditPrefix:e.target.value})} placeholder="AU" style={INP}/>
          </div>
          <div>
            <label style={FS12}>Max Photos per Section</label>
            <input type="number" value={f.maxPhotosPerSection} onChange={e => setF({...f, maxPhotosPerSection:e.target.value})} style={INP}/>
          </div>
          <div>
            <label style={FS12}>Year Format in Audit ID</label>
            <select value={f.yearFormat} onChange={e => setF({...f, yearFormat:e.target.value})} style={SEL}>
              <option value="YYYY">2024</option>
              <option value="YY">24</option>
            </select>
          </div>
        </div>
        <div style={{ paddingTop:4 }}>
          {[
            { k:"autoAssignOnCreate",       label:"Auto-assign auditor on audit creation",           desc:"System assigns based on zone mapping" },
            { k:"requirePhotos",            label:"Require site photos for each section",             desc:"Auditor must upload at least 1 photo per section" },
            { k:"requireGPS",               label:"Require GPS coordinates on submission",            desc:"Capture location stamp when audit is submitted" },
            { k:"allowOfflineSubmission",   label:"Allow offline submission via mobile app",         desc:"Data synced when device comes online" },
            { k:"submitWithIncompletes",    label:"Allow submitting with incomplete questions",       desc:"Incomplete items flagged but not blocked" },
            { k:"requireSupervisorApproval",label:"Require admin approval before report delivery",   desc:"Audit moves to Pending Review before Approved" },
          ].map(item => (
            <ToggleRow key={item.k} label={item.label} desc={item.desc}
              on={!!f[item.k as keyof typeof f]} onChange={() => T(item.k as keyof typeof f)}/>
          ))}
        </div>
      </div>
      <button style={SB}><i className="ri-save-line"/>Save Audit Settings</button>
    </div>
  );
}

function ScoringPanel() {
  const [f, setF] = useState({
    passingScore:"75", excellentScore:"90",
    weightCompliance:"40", weightSafety:"35", weightDocumentation:"25",
  });
  const F = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({...f, [k]:e.target.value});
  const grades = [
    { label:"Excellent", range:"90–100", color:"#16a34a", bg:"#dcfce7" },
    { label:"Good",      range:"75–89",  color:"#0284c7", bg:"#dbeafe" },
    { label:"Average",   range:"60–74",  color:"#ca8a04", bg:"#fef9c3" },
    { label:"Poor",      range:"Below 60",color:"#dc2626", bg:"#fee2e2" },
  ];
  return (
    <div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-bar-chart-2-line" style={{ color:"#2563eb" }}/>Scoring Thresholds</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
          <div>
            <label style={FS12}>Passing Score (%)</label>
            <input type="number" value={f.passingScore} onChange={F("passingScore")} min="0" max="100" style={INP}/>
            <span style={{ fontSize:11, color:"var(--text-muted)", marginTop:4, display:"block" }}>Audits below this score are flagged as non-compliant</span>
          </div>
          <div>
            <label style={FS12}>Excellent Score (%)</label>
            <input type="number" value={f.excellentScore} onChange={F("excellentScore")} min="0" max="100" style={INP}/>
            <span style={{ fontSize:11, color:"var(--text-muted)", marginTop:4, display:"block" }}>Scores at or above this are graded Excellent</span>
          </div>
        </div>
        <h4 style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)", margin:"0 0 12px" }}>Section Weights (%)</h4>
        <p style={{ fontSize:12, color:"var(--text-muted)", margin:"0 0 12px" }}>Total must equal 100%. Affects weighted final score calculation.</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
          {[
            { k:"weightCompliance",     label:"Compliance Checks" },
            { k:"weightSafety",         label:"Safety Violations" },
            { k:"weightDocumentation",  label:"Documentation" },
          ].map(item => (
            <div key={item.k}>
              <label style={FS12}>{item.label}</label>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <input type="number" value={f[item.k as keyof typeof f]} onChange={F(item.k as keyof typeof f)} min="0" max="100" style={{ ...INP, width:70 }}/>
                <span style={{ fontSize:13, color:"var(--text-muted)" }}>%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-award-line" style={{ color:"#2563eb" }}/>Grade Bands</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {grades.map(g => (
            <div key={g.label} style={{ background:g.bg, borderRadius:10, padding:"14px", textAlign:"center" }}>
              <div style={{ fontSize:15, fontWeight:800, color:g.color, marginBottom:4 }}>{g.label}</div>
              <div style={{ fontSize:12, color:g.color, fontWeight:600 }}>{g.range}</div>
            </div>
          ))}
        </div>
      </div>
      <button style={SB}><i className="ri-save-line"/>Save Scoring Settings</button>
    </div>
  );
}

function ReportConfigPanel() {
  const [f, setF] = useState({
    reportHeaderTitle:"Electrical Safety Audit Report",
    footerText:"Save Earth Energy Services Pvt. Ltd. | Certified Electrical Auditor",
    showAuditorBEE:true, showElecSupNo:true, showClientLogo:true,
    showSELogo:true, showSignatureBlock:true, showGPSCoords:false,
    pageSize:"A4", orientation:"Portrait",
    includePhotoAppendix:true, includeDeficiencyTable:true,
  });
  const T = (k: keyof typeof f) => setF({...f, [k]:!f[k]});
  return (
    <div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-file-pdf-line" style={{ color:"#0891b2" }}/>Report Header & Footer</h3>
        <div style={{ marginBottom:14 }}>
          <label style={FS12}>Report Title (on PDF Cover)</label>
          <input value={f.reportHeaderTitle} onChange={e => setF({...f, reportHeaderTitle:e.target.value})} style={INP}/>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={FS12}>Footer Text</label>
          <input value={f.footerText} onChange={e => setF({...f, footerText:e.target.value})} style={INP}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div>
            <label style={FS12}>Page Size</label>
            <select value={f.pageSize} onChange={e => setF({...f, pageSize:e.target.value})} style={SEL}>
              <option>A4</option><option>Letter</option><option>Legal</option>
            </select>
          </div>
          <div>
            <label style={FS12}>Orientation</label>
            <select value={f.orientation} onChange={e => setF({...f, orientation:e.target.value})} style={SEL}>
              <option>Portrait</option><option>Landscape</option>
            </select>
          </div>
        </div>
      </div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-layout-column-line" style={{ color:"#0891b2" }}/>PDF Content Options</h3>
        {[
          { k:"showAuditorBEE",        label:"Show Auditor BEE EA Number on report",        desc:"Auto-filled from employee profile — required for BEE compliance" },
          { k:"showElecSupNo",         label:"Show Electrical Supervisor No. on report",    desc:"Required on SBI branch audit certificates" },
          { k:"showClientLogo",        label:"Show client bank logo in report header",      desc:"Bank logos are fetched from client records" },
          { k:"showSELogo",            label:"Show Save Earth Energy logo",                 desc:"Company logo appears in header alongside client logo" },
          { k:"showSignatureBlock",    label:"Include auditor signature block",             desc:"Digital signature placeholder on last page" },
          { k:"showGPSCoords",         label:"Include GPS coordinates in report",           desc:"Prints lat/long of audit site on cover page" },
          { k:"includePhotoAppendix",  label:"Include photo appendix section",             desc:"Appends all site photos at end of report" },
          { k:"includeDeficiencyTable",label:"Include deficiency / NCR summary table",     desc:"Lists all non-compliant checklist items" },
        ].map(item => (
          <ToggleRow key={item.k} label={item.label} desc={item.desc}
            on={!!f[item.k as keyof typeof f]} onChange={() => T(item.k as keyof typeof f)}/>
        ))}
      </div>
      <button style={SB}><i className="ri-save-line"/>Save Report Settings</button>
    </div>
  );
}

function EmailSMTPPanel() {
  const [f, setF] = useState({
    smtpHost:"smtp.gmail.com", smtpPort:"587", smtpUser:"noreply@saveearth.in",
    smtpPass:"••••••••••••", encryption:"TLS", fromName:"ORBIT Compliance",
    fromEmail:"noreply@saveearth.in", replyTo:"support@saveearth.in",
  });
  const F = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({...f, [k]:e.target.value});
  const [alerts, setAlerts] = useState<Toggle[]>([
    { label:"Audit assigned to field auditor",       desc:"Sent when coordinator assigns a new audit",       on:true  },
    { label:"Audit submitted for review",            desc:"Sent to admin when auditor submits",              on:true  },
    { label:"Audit approved",                        desc:"Sent to auditor and coordinator on approval",     on:true  },
    { label:"Report ready for download",             desc:"Sent to client contact when PDF is generated",   on:true  },
    { label:"Audit overdue",                         desc:"Daily reminder when audit passes due date",       on:true  },
    { label:"New user created",                      desc:"Welcome email sent to new platform user",        on:true  },
    { label:"Password reset",                        desc:"Triggered by user or admin reset",               on:true  },
    { label:"Weekly audit digest to Admin",          desc:"Summary of all audits for the week",             on:false },
    { label:"Monthly performance report",            desc:"Sent to Super Admin on 1st of each month",       on:false },
  ]);
  const toggleAlert = (i: number) => {
    setAlerts(prev => prev.map((a,j) => j===i ? {...a, on:!a.on} : a));
  };
  return (
    <div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-mail-settings-line" style={{ color:"#ca8a04" }}/>SMTP Configuration</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          <div><label style={FS12}>SMTP Host</label><input value={f.smtpHost} onChange={F("smtpHost")} style={INP}/></div>
          <div><label style={FS12}>Port</label><input value={f.smtpPort} onChange={F("smtpPort")} style={INP}/></div>
          <div><label style={FS12}>Username</label><input value={f.smtpUser} onChange={F("smtpUser")} style={INP}/></div>
          <div><label style={FS12}>Password</label><input type="password" value={f.smtpPass} onChange={F("smtpPass")} style={INP}/></div>
          <div>
            <label style={FS12}>Encryption</label>
            <select value={f.encryption} onChange={F("encryption")} style={SEL}>
              <option>TLS</option><option>SSL</option><option>None</option>
            </select>
          </div>
          <div><label style={FS12}>From Name</label><input value={f.fromName} onChange={F("fromName")} style={INP}/></div>
          <div><label style={FS12}>From Email</label><input value={f.fromEmail} onChange={F("fromEmail")} style={INP}/></div>
          <div><label style={FS12}>Reply-To</label><input value={f.replyTo} onChange={F("replyTo")} style={INP}/></div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button style={SB}><i className="ri-save-line"/>Save SMTP</button>
          <button style={OB}><i className="ri-mail-send-line"/>Send Test Email</button>
        </div>
      </div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-alarm-line" style={{ color:"#ca8a04" }}/>Email Alert Triggers</h3>
        {alerts.map((a, i) => (
          <ToggleRow key={i} label={a.label} desc={a.desc} on={a.on} onChange={() => toggleAlert(i)}/>
        ))}
      </div>
    </div>
  );
}

function PasswordPolicyPanel() {
  const [f, setF] = useState({
    minLength:"8", requireUppercase:true, requireNumbers:true,
    requireSpecial:true, maxAge:"90", maxAttempts:"5",
    lockoutDuration:"30", twoFAEnabled:false, twoFAMethod:"Email OTP",
    sessionTimeout:"8", rememberDevice:true,
  });
  const T = (k: keyof typeof f) => setF({...f, [k]:!f[k]});
  const F = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({...f, [k]:e.target.value});
  return (
    <div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-lock-password-line" style={{ color:"#dc2626" }}/>Password Policy</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          <div>
            <label style={FS12}>Minimum Password Length</label>
            <input type="number" value={f.minLength} onChange={F("minLength")} min="6" max="32" style={INP}/>
          </div>
          <div>
            <label style={FS12}>Password Expires After (days)</label>
            <input type="number" value={f.maxAge} onChange={F("maxAge")} min="0" style={INP}/>
            <span style={{ fontSize:11, color:"var(--text-muted)", marginTop:4, display:"block" }}>Set 0 to disable expiry</span>
          </div>
          <div>
            <label style={FS12}>Max Failed Login Attempts</label>
            <input type="number" value={f.maxAttempts} onChange={F("maxAttempts")} min="1" style={INP}/>
          </div>
          <div>
            <label style={FS12}>Lockout Duration (minutes)</label>
            <input type="number" value={f.lockoutDuration} onChange={F("lockoutDuration")} min="1" style={INP}/>
          </div>
        </div>
        {[
          { k:"requireUppercase", label:"Require uppercase letters",      desc:"At least one A-Z character" },
          { k:"requireNumbers",   label:"Require numbers",                desc:"At least one 0-9 digit" },
          { k:"requireSpecial",   label:"Require special characters",     desc:"At least one !@#$%^&* etc." },
        ].map(item => (
          <ToggleRow key={item.k} label={item.label} desc={item.desc}
            on={!!f[item.k as keyof typeof f]} onChange={() => T(item.k as keyof typeof f)}/>
        ))}
      </div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-key-2-line" style={{ color:"#dc2626" }}/>Session & Two-Factor Authentication</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          <div>
            <label style={FS12}>Session Timeout (hours)</label>
            <input type="number" value={f.sessionTimeout} onChange={F("sessionTimeout")} min="1" max="72" style={INP}/>
          </div>
          <div>
            <label style={FS12}>2FA Method</label>
            <select value={f.twoFAMethod} onChange={F("twoFAMethod")} style={SEL} disabled={!f.twoFAEnabled}>
              <option>Email OTP</option><option>SMS OTP</option><option>Google Authenticator</option>
            </select>
          </div>
        </div>
        <ToggleRow label="Enable Two-Factor Authentication (2FA)" desc="All users must verify identity with a second factor on login"
          on={!!f.twoFAEnabled} onChange={() => T("twoFAEnabled")}/>
        <ToggleRow label="Remember trusted devices for 30 days" desc="Skip 2FA for devices the user has verified before"
          on={!!f.rememberDevice} onChange={() => T("rememberDevice")}/>
      </div>
      <button style={SB}><i className="ri-save-line"/>Save Security Settings</button>
    </div>
  );
}

function BackupPanel() {
  const [f, setF] = useState({
    autoBackup:true, backupFrequency:"Daily", backupTime:"02:00", retentionDays:"90",
    auditLogRetention:"365", includePhotos:true, storageLocation:"Cloud (AWS S3)",
  });
  const T = (k: keyof typeof f) => setF({...f, [k]:!f[k]});
  const F = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({...f, [k]:e.target.value});
  const backups = [
    { date:"26 Jul 2024, 02:05 AM", size:"847 MB", status:"Success" },
    { date:"25 Jul 2024, 02:03 AM", size:"831 MB", status:"Success" },
    { date:"24 Jul 2024, 02:06 AM", size:"829 MB", status:"Success" },
    { date:"23 Jul 2024, 02:04 AM", size:"820 MB", status:"Success" },
    { date:"22 Jul 2024, 02:09 AM", size:"815 MB", status:"Success" },
  ];
  return (
    <div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-save-3-line" style={{ color:"#374151" }}/>Backup Configuration</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:14 }}>
          <div>
            <label style={FS12}>Backup Frequency</label>
            <select value={f.backupFrequency} onChange={F("backupFrequency")} style={SEL} disabled={!f.autoBackup}>
              <option>Daily</option><option>Weekly</option><option>Monthly</option>
            </select>
          </div>
          <div>
            <label style={FS12}>Backup Time</label>
            <input type="time" value={f.backupTime} onChange={F("backupTime")} style={INP} disabled={!f.autoBackup}/>
          </div>
          <div>
            <label style={FS12}>Retain Backups (days)</label>
            <input type="number" value={f.retentionDays} onChange={F("retentionDays")} style={INP}/>
          </div>
          <div>
            <label style={FS12}>Audit Log Retention (days)</label>
            <input type="number" value={f.auditLogRetention} onChange={F("auditLogRetention")} style={INP}/>
          </div>
          <div>
            <label style={FS12}>Storage Location</label>
            <select value={f.storageLocation} onChange={F("storageLocation")} style={SEL}>
              <option>Cloud (AWS S3)</option><option>Cloud (Azure Blob)</option><option>Local Server</option>
            </select>
          </div>
        </div>
        <ToggleRow label="Enable automatic backups" desc="System backs up database and files on the configured schedule"
          on={!!f.autoBackup} onChange={() => T("autoBackup")}/>
        <ToggleRow label="Include audit photos in backup" desc="Photos significantly increase backup size; disable to back up data only"
          on={!!f.includePhotos} onChange={() => T("includePhotos")}/>
      </div>
      <div style={CARD}>
        <h3 style={SH}><i className="ri-history-line" style={{ color:"#374151" }}/>Recent Backups</h3>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#f9fafb" }}>
              {["Date & Time","Size","Status","Action"].map(h => (
                <th key={h} style={{ padding:"9px 14px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.04em", textAlign:"left", borderBottom:"2px solid #dcfce7" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {backups.map((b, i) => (
              <tr key={i} style={{ borderTop:i>0?"1px solid var(--default-border)":undefined }}>
                <td style={{ padding:"10px 14px", fontWeight:600 }}>{b.date}</td>
                <td style={{ padding:"10px 14px", color:"var(--text-muted)" }}>{b.size}</td>
                <td style={{ padding:"10px 14px" }}><span style={{ fontSize:11, fontWeight:700, color:"#16a34a", background:"#dcfce7", borderRadius:20, padding:"2px 10px" }}>{b.status}</span></td>
                <td style={{ padding:"10px 14px" }}>
                  <button style={{ fontSize:12, fontWeight:600, color:"var(--primary-color)", background:"none", border:"none", cursor:"pointer" }}>
                    <i className="ri-download-line" style={{ marginRight:4 }}/>Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button style={SB}><i className="ri-save-line"/>Save Backup Settings</button>
        <button style={OB}><i className="ri-database-2-line"/>Run Backup Now</button>
        <button style={{...OB, color:"#0891b2", borderColor:"#bae6fd"}}><i className="ri-download-2-line"/>Export All Data</button>
      </div>
    </div>
  );
}

function IntegrationsPanel() {
  const integrations = [
    { name:"REST API",         desc:"Programmatic access to all platform data",        status:"Active",   icon:"ri-code-s-slash-line", color:"#16a34a", bg:"#dcfce7" },
    { name:"AWS S3",           desc:"Cloud storage for photos and PDF reports",        status:"Active",   icon:"ri-cloud-line",        color:"#ca8a04", bg:"#fef9c3" },
    { name:"Firebase (FCM)",   desc:"Push notifications to mobile app (Flutter)",     status:"Active",   icon:"ri-notification-4-line",color:"#0891b2", bg:"#dbeafe" },
    { name:"Google Maps API",  desc:"Branch location mapping and GPS validation",      status:"Inactive", icon:"ri-map-pin-line",      color:"#374151", bg:"#f3f4f6" },
  ];
  return (
    <div>
      <div style={{ ...CARD, marginBottom:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <h3 style={{ ...SH, margin:0 }}><i className="ri-plug-line" style={{ color:"#374151" }}/>Integrations & API Keys</h3>
          <button style={OB}><i className="ri-add-line"/>Add Integration</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {integrations.map(it => (
            <div key={it.name} style={{ borderRadius:12, border:"1px solid var(--default-border)", padding:"16px", display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ width:38, height:38, borderRadius:10, background:it.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className={it.icon} style={{ fontSize:17, color:it.color }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)" }}>{it.name}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:it.status==="Active"?"#16a34a":"#9ca3af", background:it.status==="Active"?"#dcfce7":"#f3f4f6", borderRadius:10, padding:"2px 8px" }}>{it.status}</span>
                </div>
                <p style={{ fontSize:11.5, color:"var(--text-muted)", margin:"4px 0 10px" }}>{it.desc}</p>
                <div style={{ display:"flex", gap:8 }}>
                  <button style={{ fontSize:11, fontWeight:600, color:"var(--primary-color)", background:"none", border:"none", cursor:"pointer", padding:0 }}><i className="ri-key-line" style={{ marginRight:3 }}/>API Key</button>
                  <button style={{ fontSize:11, fontWeight:600, color:"var(--text-muted)", background:"none", border:"none", cursor:"pointer", padding:0 }}><i className="ri-settings-line" style={{ marginRight:3 }}/>Configure</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Placeholder panel ─────────────────────────────────────────────────────────
function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div style={{ ...CARD, textAlign:"center", padding:"60px 24px" }}>
      <i className="ri-settings-3-line" style={{ fontSize:48, color:"var(--text-muted)", opacity:0.3, display:"block", marginBottom:12 }}/>
      <h3 style={{ fontSize:16, fontWeight:700, color:"var(--default-text-color)", margin:"0 0 6px" }}>{label}</h3>
      <p style={{ fontSize:13, color:"var(--text-muted)", margin:0 }}>This section is being configured. Check back soon.</p>
    </div>
  );
}

// ── Status Master Panel ───────────────────────────────────────────────────────
const STATUS_MASTER = [
  { status:"In Progress",     color:"#2563eb", bg:"#dbeafe", icon:"ri-loader-4-line",    description:"Auditor has opened the branch form and audit is actively in progress." },
  { status:"Draft",           color:"#ca8a04", bg:"#fef9c3", icon:"ri-draft-line",       description:"Auditor has completed all entries but has not yet sent the report to the Branch Manager." },
  { status:"Pending Approval",color:"#7c3aed", bg:"#f3e8ff", icon:"ri-time-line",        description:"Report copy sent to Branch Manager. Admin is verifying and generating the final report for physical submission." },
  { status:"Delivered",       color:"#16a34a", bg:"#dcfce7", icon:"ri-send-plane-line",  description:"Admin has physically submitted the final audit report. Audit is closed." },
];

function StatusMasterPanel() {
  const TH2: React.CSSProperties = {
    padding:"10px 16px", fontSize:11, fontWeight:700, color:"#6b7280",
    textTransform:"uppercase", letterSpacing:"0.05em", background:"#f9fafb",
    borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap", textAlign:"left",
  };
  const TD2: React.CSSProperties = {
    padding:"14px 16px", verticalAlign:"middle", fontSize:13,
    color:"#374151", borderBottom:"1px solid #f3f4f6",
  };
  return (
    <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
      {/* Header */}
      <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--default-text-color)" }}>Audit Status Definitions</div>
          <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>These statuses define the lifecycle of every audit in the system.</div>
        </div>
        <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:6, padding:"4px 10px" }}>
          {STATUS_MASTER.length} Statuses
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <th style={{ ...TH2, width:40 }}>#</th>
              <th style={TH2}>Status</th>
              <th style={TH2}>Description</th>
              <th style={{ ...TH2, textAlign:"center" }}>Stage</th>
            </tr>
          </thead>
          <tbody>
            {STATUS_MASTER.map((s, i) => (
              <tr key={s.status}
                onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                style={{ transition:"background 0.1s" }}>
                <td style={{ ...TD2, color:"#d1d5db", fontSize:12 }}>{i + 1}</td>
                <td style={TD2}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, color:s.color, background:s.bg, borderRadius:20, padding:"4px 12px", whiteSpace:"nowrap" }}>
                    <i className={s.icon} style={{ fontSize:12 }}/>{s.status}
                  </span>
                </td>
                <td style={{ ...TD2, color:"#6b7280", fontSize:13, maxWidth:480 }}>{s.description}</td>
                <td style={{ ...TD2, textAlign:"center" }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#374151", background:"#f3f4f6", borderRadius:6, padding:"3px 10px" }}>
                    Stage {i + 1} / {STATUS_MASTER.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Flow diagram */}
      <div style={{ padding:"16px 20px", borderTop:"1px solid var(--default-border)", background:"#fafafa" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>Audit Lifecycle Flow</div>
        <div style={{ display:"flex", alignItems:"center", gap:0, flexWrap:"wrap" }}>
          {STATUS_MASTER.map((s, i) => (
            <React.Fragment key={s.status}>
              <div style={{ display:"flex", alignItems:"center", gap:6, background:s.bg, border:`1.5px solid ${s.color}20`, borderRadius:8, padding:"7px 14px" }}>
                <i className={s.icon} style={{ fontSize:13, color:s.color }}/>
                <span style={{ fontSize:12, fontWeight:600, color:s.color, whiteSpace:"nowrap" }}>{s.status}</span>
              </div>
              {i < STATUS_MASTER.length - 1 && (
                <i className="ri-arrow-right-line" style={{ fontSize:16, color:"#d1d5db", margin:"0 4px" }}/>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Load Type Panel ───────────────────────────────────────────────────────────
const LOAD_CATEGORY_OPTIONS = [
  "Lighting Load","Fan Load","AC Load","Computer Load","IT Equipment","Power Load","Other Equipment",
];

interface LoadTypeEntry {
  id: number;
  loadType: string;
  equipmentName: string;
  nameHindi: string;
  wattage: string;
  appearsOn: ("branch"|"atm")[];
  status: "Active"|"Inactive";
}

const BLANK_LT: Omit<LoadTypeEntry,"id"> = {
  loadType:"", equipmentName:"", nameHindi:"", wattage:"", appearsOn:["branch"], status:"Active",
};

// ── JSON syntax highlighter (shared) ──────────────────────────────────────────
function colorizeJsonLT(json: string): React.ReactNode[] {
  const TOKEN = /("(?:[^"\\]|\\.)*"\s*:)|("(?:[^"\\]|\\.)*")|(true|false|null)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  const parts: React.ReactNode[] = [];
  let last = 0, m: RegExpExecArray | null;
  while ((m = TOKEN.exec(json)) !== null) {
    if (m.index > last) parts.push(<span key={`t${last}`} style={{ color:"#d4d4d4" }}>{json.slice(last, m.index)}</span>);
    if (m[1]) parts.push(<span key={`k${m.index}`} style={{ color:"#9cdcfe" }}>{m[1]}</span>);
    else if (m[2]) parts.push(<span key={`s${m.index}`} style={{ color:"#ce9178" }}>{m[2]}</span>);
    else if (m[3]) parts.push(<span key={`b${m.index}`} style={{ color:"#569cd6" }}>{m[3]}</span>);
    else if (m[4]) parts.push(<span key={`n${m.index}`} style={{ color:"#b5cea8" }}>{m[4]}</span>);
    last = m.index + m[0].length;
  }
  if (last < json.length) parts.push(<span key="end" style={{ color:"#d4d4d4" }}>{json.slice(last)}</span>);
  return parts;
}

function LoadTypePanel() {
  const [rows,   setRows]   = useState<LoadTypeEntry[]>([]);
  const [form,   setForm]   = useState<Omit<LoadTypeEntry,"id">>(BLANK_LT);
  const [editId, setEditId] = useState<number|null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  const F = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const toggleAppears = (key: "branch"|"atm") => {
    setForm(prev => {
      const has = prev.appearsOn.includes(key);
      // "branch" is always required — can't uncheck it
      if (key === "branch" && has) return prev;
      return { ...prev, appearsOn: has ? prev.appearsOn.filter(x => x !== key) : [...prev.appearsOn, key] };
    });
  };

  const handleSave = () => {
    if (!form.loadType || !form.equipmentName) return;
    if (editId !== null) {
      setRows(prev => prev.map(r => r.id === editId ? { ...r, ...form } : r));
      setEditId(null);
    } else {
      setRows(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setForm(BLANK_LT);
  };

  const handleEdit = (r: LoadTypeEntry) => {
    setForm({ loadType:r.loadType, equipmentName:r.equipmentName, nameHindi:r.nameHindi, wattage:r.wattage, appearsOn:r.appearsOn, status:r.status });
    setEditId(r.id);
  };

  const cancelEdit = () => { setEditId(null); setForm(BLANK_LT); };
  const handleDelete = (id: number) => { if (editId === id) cancelEdit(); setRows(prev => prev.filter(r => r.id !== id)); };

  const filtered = rows.filter(r => {
    const matchCat = !catFilter || r.loadType === catFilter;
    const matchQ   = !search || r.equipmentName.toLowerCase().includes(search.toLowerCase()) || r.nameHindi.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const isEditMode = editId !== null;
  const canSave    = !!form.loadType && !!form.equipmentName;

  const TH: React.CSSProperties = {
    padding:"11px 16px", fontSize:11, fontWeight:700, color:"#6b7280",
    textTransform:"uppercase" as const, letterSpacing:"0.05em", background:"#f9fafb",
    borderBottom:"1px solid #e5e7eb", textAlign:"left" as const, whiteSpace:"nowrap" as const,
  };
  const TD: React.CSSProperties = {
    padding:"13px 16px", fontSize:13, color:"#374151",
    borderBottom:"1px solid #f3f4f6", verticalAlign:"middle",
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:16, alignItems:"start" }}>

      {/* ── Left: Form card ── */}
      <div style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>

        {/* Header */}
        <div style={{ borderTop:`3px solid ${isEditMode ? "#f59e0b" : "#16a34a"}`, padding:"16px 18px 12px", borderBottom:"1px solid #f3f4f6" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <i className={isEditMode ? "ri-edit-line" : "ri-flashlight-line"}
               style={{ fontSize:16, color: isEditMode ? "#f59e0b" : "#16a34a" }}/>
            <span style={{ fontSize:14, fontWeight:700, color:"var(--default-text-color)" }}>
              {isEditMode ? "Edit load type" : "Add load type"}
            </span>
          </div>
          <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>
            This is what the auditor picks on the load sheet
          </p>
        </div>

        <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:15 }}>

          {/* Load Category */}
          <div>
            <label style={FS12}>LOAD CATEGORY <span style={{ color:"#dc2626" }}>*</span></label>
            <select value={form.loadType} onChange={e => F("loadType", e.target.value)} style={SEL}>
              <option value="">— Select a category —</option>
              {LOAD_CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <p style={{ fontSize:11, color:"#9ca3af", margin:"5px 0 0" }}>
              From the API&#39;s own list — never typed by hand
            </p>
          </div>

          {/* Equipment Name */}
          <div>
            <label style={FS12}>EQUIPMENT NAME <span style={{ color:"#dc2626" }}>*</span></label>
            <input value={form.equipmentName} onChange={e => F("equipmentName", e.target.value)}
              placeholder="e.g. LED Tube Light (4ft)"
              style={INP}/>
          </div>

          {/* Name (Hindi) */}
          <div>
            <label style={FS12}>NAME (HINDI)</label>
            <input value={form.nameHindi} onChange={e => F("nameHindi", e.target.value)}
              placeholder="एलईडी ट्यूब लाइट"
              style={INP}/>
          </div>

          {/* Default Wattage */}
          <div>
            <label style={FS12}>DEFAULT WATTAGE</label>
            <div style={{ position:"relative" }}>
              <input type="number" value={form.wattage} onChange={e => F("wattage", e.target.value)}
                placeholder="leave blank if unknown"
                style={{ ...INP, paddingRight:40 }}/>
              <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:12, fontWeight:700, color:"#6b7280" }}>W</span>
            </div>
            <p style={{ fontSize:11, color:"#9ca3af", margin:"5px 0 0", lineHeight:1.5 }}>
              Blank is stored as &ldquo;not established&rdquo;, so the load sheet leaves the box empty instead of pre-filling a zero.
            </p>
          </div>

          {/* Appears On */}
          <div>
            <label style={FS12}>APPEARS ON</label>
            <div style={{ display:"flex", gap:10 }}>
              {([
                { key:"branch" as const, label:"Branch sheet" },
                { key:"atm"    as const, label:"ATM sheet"    },
              ]).map(opt => {
                const checked = form.appearsOn.includes(opt.key);
                return (
                  <button key={opt.key} onClick={() => toggleAppears(opt.key)}
                    style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:8, cursor: opt.key === "branch" ? "default" : "pointer", fontSize:12, fontWeight:600, transition:"all 0.15s",
                      border: checked ? "1.5px solid #2563eb" : "1.5px solid #e5e7eb",
                      background: checked ? "#eff6ff" : "#fff",
                      color: checked ? "#2563eb" : "#6b7280" }}>
                    <i className={checked ? "ri-checkbox-line" : "ri-checkbox-blank-line"} style={{ fontSize:15 }}/>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize:11, color:"#9ca3af", margin:"6px 0 0", lineHeight:1.5 }}>
              The ATM sheet is a different list — its lighting is a subset of the branch&#39;s and its machine load appears nowhere else.
            </p>
          </div>

          {/* Status */}
          <div>
            <label style={FS12}>STATUS</label>
            <div style={{ display:"flex", border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden" }}>
              {(["Active","Inactive"] as const).map((s, i) => {
                const sel = form.status === s;
                return (
                  <button key={s} onClick={() => F("status", s)}
                    style={{ flex:1, padding:"9px 0", border:"none", borderRight:i<1?"1px solid #e5e7eb":"none", cursor:"pointer", fontSize:12, fontWeight:700, transition:"all 0.15s",
                      background: sel ? (s === "Active" ? "#16a34a" : "#6b7280") : "#fff",
                      color: sel ? "#fff" : (s === "Active" ? "#16a34a" : "#dc2626"),
                      display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                    <i className={s === "Active" ? "ri-checkbox-circle-line" : "ri-close-circle-line"} style={{ fontSize:13 }}/>{s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSave} disabled={!canSave}
            style={{ width:"100%", padding:"10px", borderRadius:8, border:"none",
              background: !canSave ? "#e5e7eb" : isEditMode ? "#2563eb" : "#111827",
              color: !canSave ? "#9ca3af" : "#fff",
              cursor: !canSave ? "not-allowed" : "pointer",
              fontWeight:700, fontSize:13 }}>
            {isEditMode ? "Update load type" : "Add load type"}
          </button>

          {isEditMode && (
            <button onClick={cancelEdit}
              style={{ width:"100%", padding:"9px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#6b7280", cursor:"pointer", fontWeight:600, fontSize:12 }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── Right: Table ── */}
      <div style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>

        {/* Table header */}
        <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:14, fontWeight:700, color:"var(--default-text-color)" }}>Load types</span>
          <span style={{ fontSize:12, color:"#6b7280" }}>{filtered.length} of {rows.length}</span>
          <div style={{ flex:1 }}/>
          {/* Search */}
          <div style={{ position:"relative" }}>
            <i className="ri-search-line" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#9ca3af" }}/>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              style={{ ...INP, paddingLeft:32, width:160, height:34, fontSize:12 }}/>
          </div>
          {/* Category filter */}
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ ...SEL, width:160, height:34, fontSize:12, padding:"0 12px" }}>
            <option value="">All categories</option>
            {LOAD_CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                <th style={TH}>CATEGORY</th>
                <th style={TH}>EQUIPMENT</th>
                <th style={{ ...TH, textAlign:"center" as const }}>WATTAGE</th>
                <th style={{ ...TH, textAlign:"center" as const }}>SHEETS</th>
                <th style={{ ...TH, textAlign:"center" as const }}>STATUS</th>
                <th style={{ ...TH, textAlign:"center" as const }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...TD, textAlign:"center", color:"#9ca3af", padding:"40px" }}>
                    No load types added yet. Use the form to add one.
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...TD, textAlign:"center", color:"#9ca3af", padding:"32px" }}>
                    No results match your search
                  </td>
                </tr>
              ) : filtered.map(r => {
                const inactive = r.status === "Inactive";
                const sheets   = r.appearsOn.includes("atm") ? "BRANCH + ATM" : "BRANCH";
                return (
                  <tr key={r.id}
                    onMouseEnter={e => { if (editId !== r.id) e.currentTarget.style.background = "#f9fafb"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = editId === r.id ? "#eff6ff" : "transparent"; }}
                    style={{ background: editId === r.id ? "#eff6ff" : "transparent", opacity: inactive ? 0.6 : 1, transition:"background 0.1s" }}>

                    {/* Category */}
                    <td style={TD}>
                      <span style={{ fontSize:13, color:"#374151" }}>{r.loadType}</span>
                    </td>

                    {/* Equipment + Hindi */}
                    <td style={TD}>
                      <div style={{ fontWeight:600, color:"#111827" }}>{r.equipmentName}</div>
                      {r.nameHindi && <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{r.nameHindi}</div>}
                    </td>

                    {/* Wattage */}
                    <td style={{ ...TD, textAlign:"center" as const }}>
                      {r.wattage
                        ? <span style={{ fontSize:12, fontWeight:700, color:"#1d4ed8", background:"#dbeafe", borderRadius:6, padding:"3px 10px" }}>{r.wattage} W</span>
                        : <span style={{ fontSize:12, color:"#9ca3af" }}>not set</span>}
                    </td>

                    {/* Sheets */}
                    <td style={{ ...TD, textAlign:"center" as const }}>
                      <span style={{ fontSize:11, fontWeight:600, color:"#374151", letterSpacing:"0.02em" }}>{sheets}</span>
                    </td>

                    {/* Status */}
                    <td style={{ ...TD, textAlign:"center" as const }}>
                      <span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:"3px 12px", display:"inline-block",
                        color:    r.status === "Active" ? "#15803d" : "#dc2626",
                        background: r.status === "Active" ? "#dcfce7" : "#fee2e2" }}>
                        {r.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ ...TD, textAlign:"center" as const }}>
                      <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                        <button onClick={() => handleEdit(r)} title="Edit"
                          style={{ width:28, height:28, border:"none", background:"transparent", cursor:"pointer", color:"#93c5fd", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#2563eb"; (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#93c5fd"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                          <i className="ri-pencil-line" style={{ fontSize:15 }}/>
                        </button>
                        <button onClick={() => handleDelete(r.id)} title="Delete"
                          style={{ width:28, height:28, border:"none", background:"transparent", cursor:"pointer", color:"#fca5a5", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#dc2626"; (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                          <i className="ri-delete-bin-line" style={{ fontSize:15 }}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── AC Tonnage Panel ──────────────────────────────────────────────────────────
interface TonnageEntry {
  id: number;
  value: number;
  label: string;
  watts: number;
  status: "Active" | "Inactive";
}

const DEFAULT_TONNAGES: TonnageEntry[] = [
  { id:1, value:0.75, label:"0.75 TR", watts:2638,  status:"Active" },
  { id:2, value:1,    label:"1 TR",    watts:3517,  status:"Active" },
  { id:3, value:1.5,  label:"1.5 TR",  watts:5275,  status:"Active" },
  { id:4, value:2,    label:"2 TR",    watts:7034,  status:"Active" },
  { id:5, value:2.5,  label:"2.5 TR",  watts:8792,  status:"Active" },
  { id:6, value:3,    label:"3 TR",    watts:10551, status:"Active" },
  { id:7, value:4,    label:"4 TR",    watts:14068, status:"Active" },
  { id:8, value:5,    label:"5 TR",    watts:17585, status:"Active" },
];

function AcTonnagePanel() {
  const [rows,   setRows]   = useState<TonnageEntry[]>(DEFAULT_TONNAGES);
  const [val,    setVal]    = useState("");
  const [editId, setEditId] = useState<number|null>(null);
  const [status, setStatus] = useState<"Active"|"Inactive">("Active");
  const [search, setSearch] = useState("");

  const parsedVal   = parseFloat(val);
  const isValid     = !isNaN(parsedVal) && parsedVal > 0;
  const derivedW    = isValid ? Math.round(parsedVal * 3517) : 0;
  const derivedLbl  = isValid ? `${parsedVal} TR` : "";
  const isDuplicate = isValid && rows.some(r => r.id !== editId && r.value === parsedVal);

  const handleSave = () => {
    if (!isValid || isDuplicate) return;
    const entry: TonnageEntry = { id: editId ?? Date.now(), value: parsedVal, label: derivedLbl, watts: derivedW, status };
    if (editId !== null) {
      setRows(prev => prev.map(r => r.id === editId ? entry : r).sort((a,b) => a.value - b.value));
      setEditId(null);
    } else {
      setRows(prev => [...prev, entry].sort((a,b) => a.value - b.value));
    }
    setVal(""); setStatus("Active");
  };

  const handleEdit = (r: TonnageEntry) => {
    setVal(String(r.value)); setStatus(r.status); setEditId(r.id);
  };

  const cancelEdit = () => { setEditId(null); setVal(""); setStatus("Active"); };
  const handleDelete = (id: number) => { if (editId === id) cancelEdit(); setRows(prev => prev.filter(r => r.id !== id)); };
  const toggleStatus = (id: number) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r));

  const filtered = rows.filter(r => r.label.toLowerCase().includes(search.toLowerCase()) || String(r.value).includes(search));

  const TH: React.CSSProperties = {
    padding:"11px 16px", fontSize:11, fontWeight:700, color:"#6b7280",
    textTransform:"uppercase" as const, letterSpacing:"0.05em",
    background:"#f9fafb", borderBottom:"1px solid #e5e7eb",
    textAlign:"left" as const, whiteSpace:"nowrap" as const,
  };
  const TD: React.CSSProperties = {
    padding:"13px 16px", fontSize:13, color:"#374151",
    borderBottom:"1px solid #f3f4f6", verticalAlign:"middle",
  };

  const isEditMode = editId !== null;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:16, alignItems:"start" }}>

      {/* ── Left: Form card ── */}
      <div style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>

        {/* Accent bar + header */}
        <div style={{ borderTop:`3px solid ${isEditMode ? "#f59e0b" : "#2563eb"}`, padding:"16px 18px 12px", borderBottom:"1px solid #f3f4f6" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <i className={isEditMode ? "ri-edit-line" : "ri-temp-cold-line"}
               style={{ fontSize:16, color: isEditMode ? "#f59e0b" : "#2563eb" }}/>
            <span style={{ fontSize:14, fontWeight:700, color:"var(--default-text-color)" }}>
              {isEditMode ? "Edit AC tonnage" : "Add AC tonnage"}
            </span>
          </div>
          <p style={{ fontSize:12, color:"#9ca3af", margin:0, lineHeight:1.4 }}>
            {isEditMode ? "Update the selected tonnage value" : "This is what the auditor picks in the Load Sheet"}
          </p>
        </div>

        <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:16 }}>

          {/* Tonnage value */}
          <div>
            <label style={FS12}>TONNAGE VALUE (TR) <span style={{ color:"#dc2626" }}>*</span></label>
            <div style={{ position:"relative" }}>
              <input
                type="number" step="0.25" min="0.25" max="20"
                value={val}
                onChange={e => setVal(e.target.value)}
                placeholder="e.g. 1.5"
                style={{ ...INP, paddingRight:46 }}
              />
              <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:12, fontWeight:700, color:"#6b7280" }}>TR</span>
            </div>
            {isDuplicate && (
              <p style={{ fontSize:11, color:"#dc2626", margin:"5px 0 0", display:"flex", alignItems:"center", gap:4 }}>
                <i className="ri-error-warning-line" style={{ fontSize:12 }}/>{derivedLbl} already exists
              </p>
            )}
            {val && !isValid && (
              <p style={{ fontSize:11, color:"#dc2626", margin:"5px 0 0" }}>Enter a valid positive number</p>
            )}
          </div>

          {/* Auto-generated label — read-only display */}
          <div>
            <label style={FS12}>DROPDOWN LABEL <span style={{ fontSize:10, color:"#9ca3af", fontWeight:500, textTransform:"none" }}>(auto-generated)</span></label>
            <div style={{ ...INP, background:"#f9fafb", color: derivedLbl ? "#374151" : "#d1d5db", display:"flex", alignItems:"center", userSelect:"none" as const }}>
              {derivedLbl || "Will be set automatically"}
            </div>
          </div>

          {/* Wattage equivalent — read-only */}
          <div>
            <label style={FS12}>WATTAGE EQUIVALENT <span style={{ fontSize:10, color:"#9ca3af", fontWeight:500, textTransform:"none" }}>(1 TR = 3,517 W)</span></label>
            <div style={{ position:"relative" }}>
              <div style={{ ...INP, background:"#f9fafb", color: derivedW ? "#374151" : "#d1d5db", display:"flex", alignItems:"center", userSelect:"none" as const, paddingRight:32 }}>
                {derivedW ? derivedW.toLocaleString() : "Auto-calculated"}
              </div>
              {derivedW > 0 && (
                <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:12, fontWeight:700, color:"#6b7280" }}>W</span>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={FS12}>STATUS</label>
            <div style={{ display:"flex", border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden" }}>
              {(["Active","Inactive"] as const).map((s, i) => {
                const sel = status === s;
                return (
                  <button key={s} onClick={() => setStatus(s)}
                    style={{ flex:1, padding:"9px 0", border:"none", borderRight:i<1?"1px solid #e5e7eb":"none", cursor:"pointer", fontSize:12, fontWeight:700,
                      background: sel ? (s === "Active" ? "#16a34a" : "#6b7280") : "#fff",
                      color: sel ? "#fff" : (s === "Active" ? "#16a34a" : "#6b7280"),
                      transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                    <i className={s === "Active" ? "ri-checkbox-circle-line" : "ri-close-circle-line"} style={{ fontSize:13 }}/>{s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSave} disabled={!isValid || isDuplicate}
            style={{ width:"100%", padding:"10px", borderRadius:8, border:"none",
              background: (!isValid || isDuplicate) ? "#e5e7eb" : isEditMode ? "#2563eb" : "#111827",
              color: (!isValid || isDuplicate) ? "#9ca3af" : "#fff",
              cursor: (!isValid || isDuplicate) ? "not-allowed" : "pointer",
              fontWeight:700, fontSize:13 }}>
            {isEditMode ? "Update AC tonnage" : "Add AC tonnage"}
          </button>

          {isEditMode && (
            <button onClick={cancelEdit}
              style={{ width:"100%", padding:"9px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#6b7280", cursor:"pointer", fontWeight:600, fontSize:12 }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── Right: Table ── */}
      <div style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>

        {/* Table header */}
        <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:14, fontWeight:700, color:"var(--default-text-color)", marginRight:4 }}>
            AC tonnage values
          </span>
          <span style={{ fontSize:12, color:"#6b7280" }}>
            {filtered.length} of {rows.length}
          </span>
          <div style={{ flex:1 }}/>
          {/* Search */}
          <div style={{ position:"relative" }}>
            <i className="ri-search-line" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#9ca3af" }}/>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              style={{ ...INP, paddingLeft:32, width:160, height:34, fontSize:12 }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                <th style={TH}>LABEL</th>
                <th style={{ ...TH, textAlign:"center" as const }}>TONNAGE</th>
                <th style={{ ...TH, textAlign:"center" as const }}>WATTAGE</th>
                <th style={{ ...TH, textAlign:"center" as const }}>STATUS</th>
                <th style={{ ...TH, textAlign:"center" as const }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ ...TD, textAlign:"center", color:"#9ca3af", padding:"32px" }}>
                    No entries found
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id}
                  onMouseEnter={e => { if (editId !== r.id) e.currentTarget.style.background = "#f9fafb"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = editId === r.id ? "#eff6ff" : "transparent"; }}
                  style={{ background: editId === r.id ? "#eff6ff" : "transparent", transition:"background 0.1s" }}>

                  {/* Label */}
                  <td style={TD}>
                    <div style={{ fontWeight:600, color:"#111827" }}>{r.label}</div>
                    <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>Appears in Load Sheet → AC</div>
                  </td>

                  {/* Tonnage badge */}
                  <td style={{ ...TD, textAlign:"center" as const }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#1d4ed8", background:"#dbeafe", borderRadius:6, padding:"3px 12px" }}>
                      {r.value} TR
                    </span>
                  </td>

                  {/* Wattage */}
                  <td style={{ ...TD, textAlign:"center" as const }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{r.watts.toLocaleString()} W</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{(r.watts/1000).toFixed(2)} kW</div>
                  </td>

                  {/* Status chip — click to toggle */}
                  <td style={{ ...TD, textAlign:"center" as const }}>
                    <span onClick={() => toggleStatus(r.id)}
                      title="Click to toggle"
                      style={{ cursor:"pointer", fontSize:11, fontWeight:700, borderRadius:20, padding:"3px 12px", display:"inline-block",
                        color:  r.status === "Active" ? "#15803d" : "#6b7280",
                        background: r.status === "Active" ? "#dcfce7" : "#f3f4f6" }}>
                      {r.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ ...TD, textAlign:"center" as const }}>
                    <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                      <button onClick={() => handleEdit(r)} title="Edit"
                        style={{ width:28, height:28, borderRadius:6, border:"none", background:"transparent", cursor:"pointer", color:"#6b7280", display:"flex", alignItems:"center", justifyContent:"center" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#2563eb"; (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#6b7280"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                        <i className="ri-pencil-line" style={{ fontSize:14 }}/>
                      </button>
                      <button onClick={() => handleDelete(r.id)} title="Delete"
                        style={{ width:28, height:28, borderRadius:6, border:"none", background:"transparent", cursor:"pointer", color:"#6b7280", display:"flex", alignItems:"center", justifyContent:"center" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#dc2626"; (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#6b7280"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                        <i className="ri-delete-bin-line" style={{ fontSize:14 }}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Panel router ──────────────────────────────────────────────────────────────
function RenderPanel({ activeKey }: { activeKey: string }) {
  switch(activeKey) {
    case "company":       return <CompanyPanel/>;
    case "branding":      return <ComingSoonPanel label="Branding & Logo"/>;
    case "load-type":     return <LoadTypePanel/>;
    case "ac-tonnage":    return <AcTonnagePanel/>;
    case "scoring":       return <ScoringPanel/>;
    case "report-config": return <ReportConfigPanel/>;
    case "email-smtp":    return <EmailSMTPPanel/>;
    case "sms":           return <ComingSoonPanel label="SMS / WhatsApp"/>;
    case "password":      return <PasswordPolicyPanel/>;
    case "backup":        return <BackupPanel/>;
    case "integrations":   return <IntegrationsPanel/>;
    case "status-master":  return <StatusMasterPanel/>;
    default:               return <CompanyPanel/>;
  }
}

// ── Section meta ──────────────────────────────────────────────────────────────
const META: Record<string, { title:string; description:string }> = {
  company:       { title:"Company Profile",       description:"Legal name, registration details, and contact information for Save Earth Energy" },
  branding:      { title:"Branding & Logo",       description:"Upload logos and configure the visual identity of the platform and reports" },
  "load-type":    { title:"Load Type",            description:"Define load categories, equipment types, and wattage ratings for audit load sheets" },
  "ac-tonnage":   { title:"AC Tonnage",           description:"Manage AC tonnage values that appear in the Load Sheet dropdown during audits" },
  scoring:       { title:"Scoring & Grading",     description:"Configure passing scores, section weights, and audit grade bands" },
  "report-config":{ title:"Report Configuration", description:"Header, footer, logo placement, and content inclusions in generated PDF reports" },
  "email-smtp":  { title:"Email / SMTP",          description:"Configure email server and define which events trigger email notifications" },
  sms:           { title:"SMS / WhatsApp",        description:"Set up SMS gateway for field auditor notifications and OTP delivery" },
  password:      { title:"Password Policy",       description:"Complexity rules, expiry, lockout settings, and 2FA configuration" },
  backup:        { title:"Backup & Export",       description:"Automatic backup schedule, retention period, and manual export options" },
  integrations:     { title:"Integrations / API",    description:"Connect third-party services and manage API keys" },
  "status-master":  { title:"Status Master",          description:"Manage audit lifecycle statuses, their descriptions, and flow order" },
};

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeKey, setActiveKey] = useState("company");

  const switchSection = (key: string) => setActiveKey(key);
  const meta = META[activeKey];

  return (
    <div style={{ padding:"24px 28px", minHeight:"100%", background:"var(--default-background,#f8f9fa)" }}>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-muted)", marginBottom:6 }}>
        <Link href="/dashboard" style={{ color:"var(--text-muted)", textDecoration:"none" }}>Dashboard</Link>
        <i className="ri-arrow-right-s-line"/>
        <span style={{ color:"var(--default-text-color)", fontWeight:600 }}>Settings</span>
      </div>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>Settings</h1>
        <p style={{ fontSize:13, color:"var(--text-muted)", margin:"3px 0 0" }}>Configure platform behaviour, report settings, security, and integrations</p>
      </div>

      {/* Two-col layout */}
      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:20, alignItems:"start" }}>

        {/* ── Left Nav ── */}
        <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", position:"sticky", top:80 }}>
          {SECTIONS.map((sec) => (
            <div key={sec.group}>
              <div style={{ padding:"10px 16px 6px", display:"flex", alignItems:"center", gap:8 }}>
                <i className={sec.icon} style={{ fontSize:13, color:sec.color }}/>
                <span style={{ fontSize:10, fontWeight:800, color:sec.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>{sec.group}</span>
              </div>
              {sec.items.map((item) => {
                const isActive = activeKey === item.key;
                return (
                  <button key={item.key} onClick={() => switchSection(item.key)} style={{
                    display:"flex", alignItems:"center", gap:10, width:"100%", textAlign:"left",
                    padding:"9px 16px 9px 28px",
                    background: isActive ? "rgba(22,163,74,0.08)" : "transparent",
                    border:"none", cursor:"pointer",
                    borderLeft: isActive ? "3px solid var(--primary-color,#16a34a)" : "3px solid transparent",
                    transition:"all 0.15s",
                  }}>
                    <i className={item.icon} style={{ fontSize:14, color:isActive?"var(--primary-color)":"var(--text-muted)", flexShrink:0 }}/>
                    <span style={{ fontSize:13, fontWeight:isActive?700:500, color:isActive?"var(--primary-color)":"var(--default-text-color)" }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
              <div style={{ height:1, background:"var(--default-border)", margin:"4px 0" }}/>
            </div>
          ))}
        </div>

        {/* ── Right Panel ── */}
        <div>
          {/* Panel header */}
          <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"18px 24px", marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 3px" }}>{meta?.title}</h2>
            <p style={{ fontSize:13, color:"var(--text-muted)", margin:0 }}>{meta?.description}</p>
          </div>
          <RenderPanel activeKey={activeKey}/>
        </div>
      </div>
    </div>
  );
}
