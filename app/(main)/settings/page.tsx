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
      { key:"audit-general", label:"Audit Settings",       icon:"ri-settings-3-line"      },
      { key:"templates",     label:"Checklist Templates",  icon:"ri-layout-3-line"        },
      { key:"scoring",       label:"Scoring & Grading",    icon:"ri-bar-chart-2-line"     },
      { key:"due-dates",     label:"Due Date Rules",       icon:"ri-calendar-check-line"  },
    ],
  },
  {
    group: "Reports",
    icon: "ri-file-pdf-line",
    color: "#0891b2",
    items: [
      { key:"report-config", label:"Report Configuration", icon:"ri-file-pdf-line"        },
      { key:"pdf-template",  label:"PDF Template",         icon:"ri-layout-column-line"   },
    ],
  },
  {
    group: "Notifications",
    icon: "ri-notification-3-line",
    color: "#ca8a04",
    items: [
      { key:"email-smtp",    label:"Email / SMTP",         icon:"ri-mail-settings-line"   },
      { key:"alerts",        label:"Alert Rules",          icon:"ri-alarm-line"           },
      { key:"sms",           label:"SMS / WhatsApp",       icon:"ri-message-3-line"       },
    ],
  },
  {
    group: "Security & Access",
    icon: "ri-shield-keyhole-line",
    color: "#dc2626",
    items: [
      { key:"password",      label:"Password Policy",      icon:"ri-lock-password-line"   },
      { key:"session",       label:"Session & 2FA",        icon:"ri-key-2-line"           },
      { key:"ip-allowlist",  label:"IP Allowlist",         icon:"ri-global-line"          },
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
      { key:"retention",     label:"Data Retention",       icon:"ri-archive-line"         },
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
  const [f, setF] = useState({
    companyName:"Save Earth Energy Services Pvt. Ltd.",
    shortName:"Save Earth Energy",
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
  const F = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({...f, [k]:e.target.value});
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
    { name:"Twilio (SMS)",     desc:"SMS alerts and OTP delivery",                    status:"Inactive", icon:"ri-message-3-line",    color:"#374151", bg:"#f3f4f6" },
    { name:"Razorpay",         desc:"Payment processing for invoices",                status:"Inactive", icon:"ri-bank-card-line",    color:"#374151", bg:"#f3f4f6" },
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

// ── Panel router ──────────────────────────────────────────────────────────────
function RenderPanel({ activeKey }: { activeKey: string }) {
  switch(activeKey) {
    case "company":       return <CompanyPanel/>;
    case "branding":      return <ComingSoonPanel label="Branding & Logo"/>;
    case "audit-general": return <AuditSettingsPanel/>;
    case "templates":     return <ComingSoonPanel label="Checklist Templates"/>;
    case "scoring":       return <ScoringPanel/>;
    case "due-dates":     return <ComingSoonPanel label="Due Date Rules"/>;
    case "report-config": return <ReportConfigPanel/>;
    case "pdf-template":  return <ComingSoonPanel label="PDF Template Builder"/>;
    case "email-smtp":    return <EmailSMTPPanel/>;
    case "alerts":        return <ComingSoonPanel label="Alert Rules"/>;
    case "sms":           return <ComingSoonPanel label="SMS / WhatsApp"/>;
    case "password":      return <PasswordPolicyPanel/>;
    case "session":       return <PasswordPolicyPanel/>;
    case "ip-allowlist":  return <ComingSoonPanel label="IP Allowlist"/>;
    case "backup":        return <BackupPanel/>;
    case "retention":     return <ComingSoonPanel label="Data Retention"/>;
    case "integrations":   return <IntegrationsPanel/>;
    case "status-master":  return <StatusMasterPanel/>;
    default:               return <CompanyPanel/>;
  }
}

// ── Section meta ──────────────────────────────────────────────────────────────
const META: Record<string, { title:string; description:string }> = {
  company:       { title:"Company Profile",       description:"Legal name, registration details, and contact information for Save Earth Energy" },
  branding:      { title:"Branding & Logo",       description:"Upload logos and configure the visual identity of the platform and reports" },
  "audit-general":{ title:"Audit Settings",       description:"Default templates, photo requirements, GPS capture, and submission rules" },
  templates:     { title:"Checklist Templates",   description:"Manage and version electrical safety audit checklist templates" },
  scoring:       { title:"Scoring & Grading",     description:"Configure passing scores, section weights, and audit grade bands" },
  "due-dates":   { title:"Due Date Rules",        description:"Auto-assign due dates based on branch type and audit frequency" },
  "report-config":{ title:"Report Configuration", description:"Header, footer, logo placement, and content inclusions in generated PDF reports" },
  "pdf-template":{ title:"PDF Template",          description:"Visual layout and section order of the audit PDF report" },
  "email-smtp":  { title:"Email / SMTP",          description:"Configure email server and define which events trigger email notifications" },
  alerts:        { title:"Alert Rules",           description:"Define escalation rules and alert thresholds for overdue and critical audits" },
  sms:           { title:"SMS / WhatsApp",        description:"Set up SMS gateway for field auditor notifications and OTP delivery" },
  password:      { title:"Password Policy",       description:"Complexity rules, expiry, lockout settings, and 2FA configuration" },
  session:       { title:"Session & 2FA",         description:"Session timeout, trusted devices, and two-factor authentication" },
  "ip-allowlist":{ title:"IP Allowlist",          description:"Restrict admin access to specific IP addresses or CIDR ranges" },
  backup:        { title:"Backup & Export",       description:"Automatic backup schedule, retention period, and manual export options" },
  retention:     { title:"Data Retention",        description:"Set how long audit records, logs, and photos are retained" },
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
