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
      { key:"load-type",     label:"Load Type",            icon:"ri-flashlight-line"      },
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
  const [f, setF] = useState({
    companyName:"Save Earth Energy Services Pvt. Ltd.",
    shortName:"Save Earth Energy",
    description:"",
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
const LOAD_TYPE_OPTIONS = ["Lighting","Fans","AC","Air Conditioning","Computer","IT Equipment","Other Equipment"];

interface LoadTypeEntry {
  id: number; loadType: string; equipmentType: string; wattage: string; status: "Active"|"Inactive";
}

const BLANK_LT: Omit<LoadTypeEntry,"id"> = { loadType:"", equipmentType:"", wattage:"", status:"Active" };

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
  const [rows, setRows]         = useState<LoadTypeEntry[]>([]);
  const [form, setForm]         = useState<Omit<LoadTypeEntry,"id">>(BLANK_LT);
  const [editId, setEditId]     = useState<number|null>(null);
  const [payloadOpen, setPayloadOpen] = useState(true);
  const [sqlOpen, setSqlOpen]   = useState(false);
  const [copied, setCopied]     = useState(false);

  const F = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.loadType) return;
    if (editId !== null) {
      setRows(prev => prev.map(r => r.id === editId ? { ...r, ...form } : r));
      setEditId(null);
    } else {
      setRows(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setForm(BLANK_LT);
  };

  const handleEdit = (r: LoadTypeEntry) => {
    setForm({ loadType:r.loadType, equipmentType:r.equipmentType, wattage:r.wattage, status:r.status });
    setEditId(r.id);
  };

  const handleDelete = (id: number) => setRows(prev => prev.filter(r => r.id !== id));

  const payloadObj = {
    id: editId ?? "(uuid — auto-generated on save)",
    load_type: form.loadType || "(empty)",
    equipment_type: form.equipmentType || "(empty)",
    wattage_w: form.wattage ? Number(form.wattage) : "(empty)",
    status: form.status,
    created_at: "(auto — timestamptz)",
    updated_at: "(auto — timestamptz)",
  };
  const payloadStr = JSON.stringify(payloadObj, null, 2);

  const SQL_SCHEMA = `CREATE TABLE load_types (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  load_type      VARCHAR(50)   NOT NULL,
  equipment_type VARCHAR(150),
  wattage_w      NUMERIC(8,2),
  status         VARCHAR(10)   NOT NULL DEFAULT 'Active',
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
  CONSTRAINT chk_load_type_status
    CHECK (status IN ('Active','Inactive')),
  CONSTRAINT chk_load_type_name
    CHECK (load_type IN (
      'Lighting','Fans','AC','Air Conditioning',
      'Computer','IT Equipment','Other Equipment'
    ))
);

-- Indexes
CREATE INDEX idx_load_types_status    ON load_types (status);
CREATE INDEX idx_load_types_load_type ON load_types (load_type);`;

  const SQL_KW   = /\b(CREATE|TABLE|PRIMARY|KEY|DEFAULT|NOT|NULL|CHECK|IN|OR|IS|INDEX|ON|AND|CONSTRAINT)\b/g;
  const SQL_TYPE = /\b(UUID|VARCHAR|TEXT|NUMERIC|TIMESTAMPTZ|BOOLEAN|INT|SMALLINT)\b/g;
  const SQL_FN   = /\b(gen_random_uuid|now)\b/g;
  const tokenizeSQL = (s: string): React.ReactNode[] => {
    const parts = s.split(/(--[^\n]*|\b(?:CREATE|TABLE|PRIMARY|KEY|DEFAULT|NOT|NULL|CHECK|IN|OR|IS|INDEX|ON|AND|CONSTRAINT|UUID|VARCHAR|TEXT|NUMERIC|TIMESTAMPTZ|BOOLEAN|INT|SMALLINT|gen_random_uuid|now)\b|'[^']*'|\d+)/g);
    return parts.map((t, i) => {
      if (!t) return null;
      if (t.startsWith("--"))           return <span key={i} style={{ color:"#6a9955" }}>{t}</span>;
      if (SQL_KW.test(t))  { SQL_KW.lastIndex=0;   return <span key={i} style={{ color:"#569cd6", fontWeight:700 }}>{t}</span>; }
      if (SQL_TYPE.test(t)){ SQL_TYPE.lastIndex=0;  return <span key={i} style={{ color:"#4ec9b0" }}>{t}</span>; }
      if (SQL_FN.test(t))  { SQL_FN.lastIndex=0;    return <span key={i} style={{ color:"#dcdcaa" }}>{t}</span>; }
      if (t.startsWith("'"))            return <span key={i} style={{ color:"#ce9178" }}>{t}</span>;
      if (/^\d+$/.test(t))              return <span key={i} style={{ color:"#b5cea8" }}>{t}</span>;
      return <span key={i} style={{ color:"#d4d4d4" }}>{t}</span>;
    });
  };

  const TH: React.CSSProperties = {
    padding:"10px 14px", fontSize:11, fontWeight:700, color:"#6b7280",
    textTransform:"uppercase", letterSpacing:"0.05em", background:"#f9fafb",
    borderBottom:"1px solid #e5e7eb", textAlign:"left", whiteSpace:"nowrap",
  };
  const TD: React.CSSProperties = {
    padding:"12px 14px", fontSize:13, color:"#374151",
    borderBottom:"1px solid #f3f4f6", verticalAlign:"middle",
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:16, alignItems:"start" }}>

      {/* ── Left: Form + API Payload + DB Schema ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

        {/* Form card */}
        <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #f3f4f6", background: editId !== null ? "#fffbeb" : "#f0fdf4" }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#111827", display:"flex", alignItems:"center", gap:7 }}>
              <i className={editId !== null ? "ri-edit-line" : "ri-flashlight-line"} style={{ fontSize:15, color: editId !== null ? "#d97706" : "#16a34a" }}/>
              {editId !== null ? "Edit Load Type" : "Add Load Type"}
            </div>
            <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>Fill details and save to register</div>
          </div>

          <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:13 }}>
            {/* Load Type dropdown */}
            <div>
              <label style={FS12}>LOAD TYPE <span style={{ color:"#dc2626" }}>*</span></label>
              <select value={form.loadType} onChange={e => F("loadType", e.target.value)} style={SEL}>
                <option value="">— Select Load Type —</option>
                {LOAD_TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Equipment Type */}
            <div>
              <label style={FS12}>EQUIPMENT TYPE</label>
              <input value={form.equipmentType} onChange={e => F("equipmentType", e.target.value)}
                placeholder={form.loadType ? "e.g. LED Tube Light" : "Select a load type first"}
                disabled={!form.loadType}
                style={{ ...INP, opacity: form.loadType ? 1 : 0.45, cursor: form.loadType ? "text" : "not-allowed" }}/>
            </div>

            {/* Wattage Rating */}
            <div>
              <label style={FS12}>WATTAGE RATING</label>
              <div style={{ display:"flex", gap:8 }}>
                <input type="number" value={form.wattage} onChange={e => F("wattage", e.target.value)}
                  placeholder="e.g. 36" disabled={!form.loadType}
                  style={{ ...INP, flex:1, opacity: form.loadType ? 1 : 0.45, cursor: form.loadType ? "text" : "not-allowed" }}/>
                <span style={{ display:"flex", alignItems:"center", fontSize:13, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:8, padding:"0 12px" }}>W</span>
              </div>
            </div>

            {/* Status — theme style */}
            <div>
              <label style={FS12}>STATUS</label>
              <div style={{ display:"flex", border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden" }}>
                {(["Active","Inactive"] as const).map((s, i) => {
                  const sel = form.status === s;
                  const col = s === "Active" ? "#16a34a" : "#dc2626";
                  return (
                    <button key={s} onClick={() => F("status", s)}
                      style={{ flex:1, padding:"8px", border:"none", borderRight:i<1?"1px solid #e5e7eb":"none", cursor:"pointer", fontSize:12, fontWeight:700, background: sel ? col : "#fff", color: sel ? "#fff" : col, transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                      <i className={s==="Active" ? "ri-checkbox-circle-line" : "ri-close-circle-line"} style={{ fontSize:13 }}/>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save / Cancel */}
            <button onClick={handleSave} disabled={!form.loadType}
              style={{ width:"100%", padding:"10px", borderRadius:8, border:"none", background: !form.loadType ? "#9ca3af" : editId !== null ? "#2563eb" : "#16a34a", color:"#fff", cursor: !form.loadType ? "not-allowed" : "pointer", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <i className={editId !== null ? "ri-save-line" : "ri-add-circle-line"}/>
              {editId !== null ? `UPDATE AS ${form.status.toUpperCase()}` : `SAVE AS ${form.status.toUpperCase()}`}
            </button>
            {editId !== null && (
              <button onClick={() => { setEditId(null); setForm(BLANK_LT); }}
                style={{ width:"100%", padding:"9px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontWeight:600, fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <i className="ri-close-line"/>Clear
              </button>
            )}
          </div>
        </div>

        {/* API Payload card */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
          <div onClick={() => setPayloadOpen(o=>!o)}
            style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", borderBottom: payloadOpen?"1px solid #e5e7eb":"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:"#f0f9ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="ri-braces-line" style={{ fontSize:16, color:"#0284c7" }}/>
              </div>
              <span style={{ fontSize:13, fontWeight:800, color:"#111827" }}>API Payload</span>
              <span style={{ fontSize:10, color:"#0284c7", background:"#e0f2fe", borderRadius:20, padding:"1px 8px", fontWeight:700 }}>POST /api/load-types</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {payloadOpen && (
                <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(payloadStr); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                  style={{ fontSize:11, fontWeight:700, color:copied?"#16a34a":"#6b7280", background:copied?"#dcfce7":"#f3f4f6", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                  <i className={copied?"ri-check-line":"ri-file-copy-line"}/>{copied?"Copied!":"Copy"}
                </button>
              )}
              <i className={`ri-arrow-${payloadOpen?"up":"down"}-s-line`} style={{ color:"#9ca3af", fontSize:18 }}/>
            </div>
          </div>
          {payloadOpen && (
            <div style={{ background:"#1e1e1e", padding:"14px 16px", overflowX:"auto", maxHeight:240, overflowY:"auto" }}>
              <pre style={{ margin:0, fontSize:11, fontFamily:"'Cascadia Code','Fira Code',monospace", lineHeight:1.6, whiteSpace:"pre" }}>
                {colorizeJsonLT(payloadStr)}
              </pre>
            </div>
          )}
        </div>

        {/* Database Schema card */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
          <div onClick={() => setSqlOpen(o=>!o)}
            style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", borderBottom: sqlOpen?"1px solid #e5e7eb":"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:"#fdf4ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="ri-database-2-line" style={{ fontSize:16, color:"#9333ea" }}/>
              </div>
              <span style={{ fontSize:13, fontWeight:800, color:"#111827" }}>Database Schema</span>
              <span style={{ fontSize:10, color:"#9333ea", background:"#faf5ff", borderRadius:20, padding:"1px 8px", fontWeight:700 }}>load_types</span>
            </div>
            <i className={`ri-arrow-${sqlOpen?"up":"down"}-s-line`} style={{ color:"#9ca3af", fontSize:18 }}/>
          </div>
          {sqlOpen && (
            <div style={{ background:"#1e1e1e", padding:"14px 16px", overflowX:"auto", maxHeight:280, overflowY:"auto" }}>
              <pre style={{ margin:0, fontSize:11, fontFamily:"'Cascadia Code','Fira Code',monospace", lineHeight:1.6, whiteSpace:"pre" }}>
                {tokenizeSQL(SQL_SCHEMA)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Table ── */}
      <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <span style={{ fontSize:14, fontWeight:700, color:"var(--default-text-color)" }}>Load Types</span>
            <span style={{ marginLeft:8, fontSize:11, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:10, padding:"2px 8px" }}>{rows.length} entries</span>
          </div>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                <th style={{ ...TH, width:36 }}>#</th>
                <th style={TH}>Load Type</th>
                <th style={TH}>Equipment Type</th>
                <th style={{ ...TH, textAlign:"center" }}>Wattage</th>
                <th style={{ ...TH, textAlign:"center" }}>Status</th>
                <th style={{ ...TH, textAlign:"center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} style={{ ...TD, textAlign:"center", color:"var(--text-muted)", padding:"40px" }}>
                  No load types added yet. Add one using the form.
                </td></tr>
              )}
              {rows.map((r, i) => (
                <tr key={r.id}
                  onMouseEnter={e => (e.currentTarget.style.background="#f9fafb")}
                  onMouseLeave={e => (e.currentTarget.style.background = editId===r.id ? "#eff6ff" : "transparent")}
                  style={{ transition:"background 0.1s", background: editId===r.id ? "#eff6ff" : "transparent" }}>
                  <td style={{ ...TD, color:"#d1d5db", fontSize:12 }}>{i+1}</td>
                  <td style={{ ...TD, fontWeight:600 }}>{r.loadType}</td>
                  <td style={{ ...TD, color:"#6b7280" }}>{r.equipmentType || "—"}</td>
                  <td style={{ ...TD, textAlign:"center" }}>
                    {r.wattage
                      ? <span style={{ fontWeight:700, color:"#2563eb", background:"#dbeafe", borderRadius:8, padding:"3px 10px", fontSize:12 }}>{r.wattage} W</span>
                      : <span style={{ color:"#d1d5db" }}>—</span>}
                  </td>
                  <td style={{ ...TD, textAlign:"center" }}>
                    <span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:"3px 12px",
                      color: r.status==="Active"?"#16a34a":"#dc2626",
                      background: r.status==="Active"?"#dcfce7":"#fee2e2" }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ ...TD, textAlign:"center" }}>
                    <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                      <button onClick={() => handleEdit(r)} style={{ background:"none", border:"none", cursor:"pointer", color:"#2563eb", fontSize:15 }}><i className="ri-pencil-line"/></button>
                      <button onClick={() => handleDelete(r.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#dc2626", fontSize:15 }}><i className="ri-delete-bin-line"/></button>
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
    case "audit-general": return <AuditSettingsPanel/>;
    case "load-type":     return <LoadTypePanel/>;
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
  "audit-general":{ title:"Audit Settings",       description:"Default templates, photo requirements, GPS capture, and submission rules" },
  "load-type":    { title:"Load Type",            description:"Define load categories, equipment types, and wattage ratings for audit load sheets" },
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
