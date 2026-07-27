"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ── Seed users (same pool as list page) ──────────────────────────────────────
const USERS = [
  { id:"EMP-001", name:"Mukteshwar Sharma",  role:"Super Admin",   designation:"Platform Owner",        department:"Management",  email:"mukteshwar@saveearth.in",  phone:"+91 9876543210", altPhone:"+91 9876543200", dob:"15 Aug 1988", gender:"Male",   bloodGroup:"O+", aadhar:"XXXX XXXX 1234", pan:"ABCDE1234F", address:"12, Green Avenue, Ahmedabad, Gujarat - 380001", emergencyName:"Kavita Sharma",   emergencyPhone:"9876540001", emergencyRelation:"Spouse",  bank:"SBI", accountNo:"XXXX XXXX 4567",  ifsc:"SBIN0000123", beeEaNo:"BEE/EA/2019/0045", electricalSupNo:"ES/GJ/2019/1122", zone:"All Zones",       banks:["SBI","Bank of Baroda","UCO Bank","PNB","Canara Bank"], joiningDate:"01 Mar 2019", status:"Active",   avatarColor:"#15803d" },
  { id:"EMP-002", name:"Priya Sharma",       role:"Admin",          designation:"Operations Manager",    department:"Operations",  email:"priya@saveearth.in",        phone:"+91 9876543211", altPhone:"",                dob:"22 Jan 1992", gender:"Female", bloodGroup:"B+", aadhar:"XXXX XXXX 2345", pan:"FGHIJ5678G", address:"45, Navrangpura, Ahmedabad, Gujarat - 380009", emergencyName:"Rohan Sharma",    emergencyPhone:"9876540002", emergencyRelation:"Husband", bank:"HDFC", accountNo:"XXXX XXXX 5678", ifsc:"HDFC0000456", beeEaNo:"BEE/EA/2020/0087", electricalSupNo:"ES/GJ/2020/2345", zone:"Gujarat Circle",  banks:["SBI","Bank of Baroda"], joiningDate:"15 Jun 2020", status:"Active",   avatarColor:"#0284c7" },
  { id:"EMP-003", name:"Amit Singh",         role:"Coordinator",    designation:"Audit Coordinator",     department:"Audit Ops",   email:"amit@saveearth.in",         phone:"+91 9876543212", altPhone:"",                dob:"10 Mar 1990", gender:"Male",   bloodGroup:"A+", aadhar:"XXXX XXXX 3456", pan:"KLMNO9012H", address:"78, Satellite, Ahmedabad, Gujarat - 380015",   emergencyName:"Sunita Singh",    emergencyPhone:"9876540003", emergencyRelation:"Mother",  bank:"SBI", accountNo:"XXXX XXXX 6789",  ifsc:"SBIN0000789", beeEaNo:"BEE/EA/2021/0134", electricalSupNo:"ES/GJ/2021/3456", zone:"SBI Gujarat",     banks:["SBI"],                   joiningDate:"01 Apr 2021", status:"Active",   avatarColor:"#16a34a" },
  { id:"EMP-004", name:"Rajesh Kumar",       role:"Field Auditor",  designation:"Senior Field Auditor",  department:"Field Ops",   email:"rajesh@saveearth.in",       phone:"+91 9876543213", altPhone:"+91 9876543203", dob:"05 Jul 1989", gender:"Male",   bloodGroup:"AB+",aadhar:"XXXX XXXX 4567", pan:"PQRST3456I", address:"23, Maninagar, Ahmedabad, Gujarat - 380008",   emergencyName:"Meena Kumar",     emergencyPhone:"9876540004", emergencyRelation:"Wife",    bank:"SBI", accountNo:"XXXX XXXX 7890",  ifsc:"SBIN0001234", beeEaNo:"BEE/EA/2021/0156", electricalSupNo:"ES/GJ/2021/4567", zone:"SBI Gujarat",     banks:["SBI"],                   joiningDate:"15 Jul 2021", status:"Active",   avatarColor:"#059669" },
  { id:"EMP-005", name:"Sneha Patel",        role:"Field Auditor",  designation:"Field Auditor",         department:"Field Ops",   email:"sneha@saveearth.in",        phone:"+91 9876543214", altPhone:"",                dob:"18 Nov 1994", gender:"Female", bloodGroup:"O+", aadhar:"XXXX XXXX 5678", pan:"UVWXY7890J", address:"56, CG Road, Ahmedabad, Gujarat - 380006",     emergencyName:"Priti Patel",     emergencyPhone:"9876540005", emergencyRelation:"Mother",  bank:"ICICI", accountNo:"XXXX XXXX 8901", ifsc:"ICIC0001567", beeEaNo:"BEE/EA/2022/0198", electricalSupNo:"ES/GJ/2022/5678", zone:"SBI Gujarat",     banks:["SBI"],                   joiningDate:"01 Jan 2022", status:"Active",   avatarColor:"#db2777" },
];

// ── Audit history ─────────────────────────────────────────────────────────────
const AUDIT_HISTORY = [
  { auditId:"AU-2024-131", bank:"SBI", branch:"SBI Maninagar",    date:"27 Jul 2024", score:87, status:"Submitted", template:"Electrical Safety v2.1" },
  { auditId:"AU-2024-125", bank:"SBI", branch:"SBI CG Road",      date:"24 Jul 2024", score:92, status:"Approved",  template:"Electrical Safety v2.1" },
  { auditId:"AU-2024-119", bank:"SBI", branch:"SBI Navrangpura",  date:"21 Jul 2024", score:78, status:"Approved",  template:"Electrical Safety v2.1" },
  { auditId:"AU-2024-114", bank:"SBI", branch:"SBI Bodakdev",     date:"18 Jul 2024", score:95, status:"Delivered", template:"Electrical Safety v2.1" },
  { auditId:"AU-2024-108", bank:"SBI", branch:"SBI Vastrapur",    date:"15 Jul 2024", score:81, status:"Delivered", template:"Electrical Safety v2.0" },
  { auditId:"AU-2024-101", bank:"SBI", branch:"SBI Satellite",    date:"12 Jul 2024", score:88, status:"Delivered", template:"Electrical Safety v2.0" },
  { auditId:"AU-2024-095", bank:"SBI", branch:"SBI MP Nagar",     date:"08 Jul 2024", score:74, status:"Delivered", template:"Electrical Safety v2.0" },
];

// ── Documents ─────────────────────────────────────────────────────────────────
const DOCUMENTS = [
  { id:"d1", name:"BEE Electrical Auditor Certificate", type:"Certification", date:"01 Mar 2019", expiry:"28 Feb 2025", status:"Valid",   icon:"ri-award-line",      color:"#16a34a", bg:"#dcfce7" },
  { id:"d2", name:"Electrical Supervisor License",      type:"License",       date:"10 Jan 2019", expiry:"09 Jan 2025", status:"Valid",   icon:"ri-shield-check-line",color:"#0284c7", bg:"#dbeafe" },
  { id:"d3", name:"Aadhar Card",                        type:"ID Proof",      date:"N/A",         expiry:"Lifetime",    status:"Valid",   icon:"ri-fingerprint-line", color:"#059669", bg:"#d1fae5" },
  { id:"d4", name:"PAN Card",                           type:"ID Proof",      date:"N/A",         expiry:"Lifetime",    status:"Valid",   icon:"ri-bank-card-line",   color:"#059669", bg:"#d1fae5" },
  { id:"d5", name:"Electrical Safety Training — Level 3",type:"Training Cert",date:"15 Aug 2023", expiry:"14 Aug 2026", status:"Valid",   icon:"ri-book-mark-line",   color:"#ca8a04", bg:"#fef9c3" },
  { id:"d6", name:"Site Safety & PPE Training",         type:"Training Cert", date:"01 Jun 2023", expiry:"31 May 2025", status:"Valid",   icon:"ri-shield-line",      color:"#ca8a04", bg:"#fef9c3" },
];

// ── Activity log ──────────────────────────────────────────────────────────────
const ACTIVITY_LOG = [
  { id:"al1", action:"Audit submitted",      detail:"AU-2024-131 · SBI Maninagar", time:"27 Jul 2024, 09:45 AM", icon:"ri-file-upload-line",    color:"#16a34a" },
  { id:"al2", action:"Audit approved",       detail:"AU-2024-125 approved by Admin", time:"25 Jul 2024, 02:10 PM", icon:"ri-checkbox-circle-line", color:"#16a34a" },
  { id:"al3", action:"Login",                detail:"Web portal · Chrome / Windows",  time:"27 Jul 2024, 08:30 AM", icon:"ri-login-box-line",       color:"#2563eb" },
  { id:"al4", action:"Profile updated",      detail:"BEE EA Number updated",          time:"20 Jul 2024, 11:00 AM", icon:"ri-edit-line",            color:"#ca8a04" },
  { id:"al5", action:"Password changed",     detail:"Security update",                time:"15 Jun 2024, 04:45 PM", icon:"ri-lock-line",            color:"#dc2626" },
  { id:"al6", action:"Audit assigned",       detail:"AU-2024-132 · SBI Bodakdev",    time:"27 Jul 2024, 10:15 AM", icon:"ri-calendar-check-line",  color:"#0891b2" },
  { id:"al7", action:"Report downloaded",    detail:"AU-2024-114 PDF Report",         time:"20 Jul 2024, 03:30 PM", icon:"ri-file-pdf-line",        color:"#8b5cf6" },
];

// ── Permission matrix ─────────────────────────────────────────────────────────
const PERM_MODULES = [
  { module:"Dashboard",        view:true,  create:false, edit:false, delete:false },
  { module:"Audit Operations", view:true,  create:true,  edit:true,  delete:false },
  { module:"Banking Structure",view:true,  create:false, edit:false, delete:false },
  { module:"Audit Questions",  view:true,  create:false, edit:false, delete:false },
  { module:"Reports / PDFs",   view:true,  create:false, edit:false, delete:false },
  { module:"Users & Roles",    view:false, create:false, edit:false, delete:false },
  { module:"Settings",         view:false, create:false, edit:false, delete:false },
];

// ── Helper components ─────────────────────────────────────────────────────────
const SEP = () => <div style={{ height:1, background:"var(--default-border)", margin:"12px 0" }}/>;
const IRow = ({ label, value, mono }: { label: string; value?: string; mono?: boolean }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:9 }}>
    <span style={{ fontSize:12, color:"var(--text-muted)", fontWeight:500, flexShrink:0, minWidth:130 }}>{label}</span>
    <span style={{ fontSize:12.5, color:"var(--default-text-color)", fontWeight:600, textAlign:"right", fontFamily:mono?"monospace":undefined }}>{value || "—"}</span>
  </div>
);
const Badge = ({ text, color="#16a34a", bg="#dcfce7" }: { text:string; color?:string; bg?:string }) => (
  <span style={{ fontSize:11, fontWeight:700, color, background:bg, borderRadius:20, padding:"2px 10px", display:"inline-block" }}>{text}</span>
);
const ScoreColor = (s: number) => s >= 90 ? "#16a34a" : s >= 75 ? "#ca8a04" : "#dc2626";
const ScoreBg    = (s: number) => s >= 90 ? "#dcfce7" : s >= 75 ? "#fef9c3" : "#fee2e2";
const AuditStatus: Record<string,{color:string;bg:string}> = {
  "Submitted":{ color:"#2563eb", bg:"#dbeafe" },
  "Approved": { color:"#16a34a", bg:"#dcfce7" },
  "Delivered":{ color:"#059669", bg:"#d1fae5" },
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const params  = useParams();
  const uid     = params?.id as string;
  const user    = USERS.find(u => u.id === uid) ?? USERS[0];
  const [tab, setTab] = useState<"details"|"audits"|"documents"|"permissions"|"activity">("details");

  const TABS = [
    { id:"details",     label:"Employee Details", icon:"ri-user-3-line"          },
    { id:"audits",      label:"Audit History",    icon:"ri-file-list-3-line"     },
    { id:"documents",   label:"Documents",        icon:"ri-folder-3-line"        },
    { id:"permissions", label:"Permissions",      icon:"ri-shield-keyhole-line"  },
    { id:"activity",    label:"Activity Log",     icon:"ri-history-line"         },
  ] as const;

  const approvedAudits  = AUDIT_HISTORY.filter(a => a.status !== "Submitted").length;
  const avgScore        = Math.round(AUDIT_HISTORY.reduce((s, a) => s + a.score, 0) / AUDIT_HISTORY.length);
  const thisMonthAudits = AUDIT_HISTORY.filter(a => a.date.includes("Jul")).length;

  return (
    <div style={{ padding:"1.5rem 0" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:16, display:"flex", alignItems:"center", gap:4 }}>
        <Link href="/dashboard" style={{ color:"var(--text-muted)", textDecoration:"none" }}>Dashboard</Link>
        <i className="ri-arrow-right-s-line"/>
        <Link href="/users" style={{ color:"var(--text-muted)", textDecoration:"none" }}>Users & Roles</Link>
        <i className="ri-arrow-right-s-line"/>
        <span style={{ color:"var(--primary-color)", fontWeight:600 }}>{user.name}</span>
      </div>

      {/* Two-column layout */}
      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:20, alignItems:"start" }}>

        {/* ══ LEFT PANEL ══════════════════════════════════════════════════════ */}
        <div style={{ display:"flex", flexDirection:"column", gap:14, position:"sticky", top:80 }}>

          {/* Avatar card */}
          <div style={{ background:"var(--custom-white)", borderRadius:16, border:"1px solid var(--default-border)", padding:"24px 20px", textAlign:"center", boxShadow:"0 2px 8px rgba(22,163,74,0.06)" }}>
            <div style={{ width:84, height:84, borderRadius:20, background:user.avatarColor, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:28, fontWeight:800, margin:"0 auto 12px" }}>
              {user.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <h2 style={{ fontSize:16, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 4px" }}>{user.name}</h2>
            <p style={{ fontSize:12, color:"var(--text-muted)", margin:"0 0 10px" }}>{user.designation}</p>
            <Badge
              text={user.role}
              color={user.role==="Super Admin"?"#15803d":user.role==="Admin"?"#0284c7":user.role==="Coordinator"?"#ca8a04":"#374151"}
              bg={user.role==="Super Admin"?"#dcfce7":user.role==="Admin"?"#dbeafe":user.role==="Coordinator"?"#fef9c3":"#f3f4f6"}
            />
            <div style={{ marginTop:8 }}>
              <Badge
                text={user.status}
                color={user.status==="Active"?"#16a34a":user.status==="On Leave"?"#ca8a04":"#dc2626"}
                bg={user.status==="Active"?"#dcfce7":user.status==="On Leave"?"#fef9c3":"#fee2e2"}
              />
            </div>
            <div style={{ marginTop:14, display:"flex", justifyContent:"center", gap:8 }}>
              <button style={{ padding:"7px 16px", fontSize:12, fontWeight:700, background:"var(--primary-color)", color:"#fff", border:"none", borderRadius:8, cursor:"pointer" }}>
                <i className="ri-edit-line" style={{ marginRight:4 }}/>Edit Profile
              </button>
              <button style={{ padding:"7px 14px", fontSize:12, fontWeight:600, background:"transparent", color:"var(--text-muted)", border:"1px solid var(--default-border)", borderRadius:8, cursor:"pointer" }}>
                <i className="ri-more-2-line"/>
              </button>
            </div>
          </div>

          {/* Employee Info */}
          <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"16px 18px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>
              <i className="ri-id-card-line" style={{ marginRight:5, color:"var(--primary-color)" }}/>Employee Info
            </div>
            <IRow label="Employee ID"   value={user.id}/>
            <IRow label="Department"    value={user.department}/>
            <IRow label="Joining Date"  value={user.joiningDate}/>
            <IRow label="Blood Group"   value={user.bloodGroup}/>
            <SEP/>
            <div style={{ fontSize:11, fontWeight:800, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>
              <i className="ri-award-line" style={{ marginRight:5, color:"var(--primary-color)" }}/>Credentials
            </div>
            <IRow label="BEE EA No."    value={user.beeEaNo}    mono/>
            <IRow label="Elec. Sup. No."value={user.electricalSupNo} mono/>
          </div>

          {/* Contact */}
          <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"16px 18px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>
              <i className="ri-contacts-line" style={{ marginRight:5, color:"var(--primary-color)" }}/>Contact
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { icon:"ri-phone-line",    text:user.phone,  href:`tel:${user.phone}` },
                { icon:"ri-mail-line",     text:user.email,  href:`mailto:${user.email}` },
              ].map((c,i) => (
                <a key={i} href={c.href} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:9, background:"var(--default-background)", textDecoration:"none" }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className={c.icon} style={{ fontSize:13, color:"var(--primary-color)" }}/>
                  </div>
                  <span style={{ fontSize:12, color:"var(--default-text-color)", fontWeight:500, wordBreak:"break-all" }}>{c.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Assigned Banks */}
          <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"16px 18px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>
              <i className="ri-bank-line" style={{ marginRight:5, color:"var(--primary-color)" }}/>Assigned Banks
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {user.banks.map(b => (
                <div key={b} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", borderRadius:8, background:"var(--default-background)" }}>
                  <i className="ri-bank-line" style={{ fontSize:12, color:"var(--primary-color)" }}/>
                  <span style={{ fontSize:12, fontWeight:600, color:"var(--default-text-color)" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"16px 18px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>
              <i className="ri-bar-chart-line" style={{ marginRight:5, color:"var(--primary-color)" }}/>Performance
            </div>
            {[
              { label:"Total Audits",    value:AUDIT_HISTORY.length, color:"#16a34a" },
              { label:"Approved",        value:approvedAudits,       color:"#0284c7" },
              { label:"Avg Score",       value:`${avgScore}%`,       color:"#ca8a04" },
              { label:"This Month",      value:thisMonthAudits,      color:"#059669" },
            ].map(s => (
              <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:12, color:"var(--text-muted)" }}>{s.label}</span>
                <span style={{ fontSize:14, fontWeight:800, color:s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
        <div>
          {/* Tab bar */}
          <div style={{ display:"flex", gap:0, borderBottom:"2px solid var(--default-border)", marginBottom:20, overflowX:"auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={{
                display:"flex", alignItems:"center", gap:6, padding:"10px 18px",
                background:"none", border:"none", cursor:"pointer",
                fontSize:13, fontWeight:tab===t.id?700:500,
                color:tab===t.id?"var(--primary-color)":"var(--text-muted)",
                borderBottom:tab===t.id?"2px solid var(--primary-color)":"2px solid transparent",
                marginBottom:-2, whiteSpace:"nowrap",
              }}>
                <i className={t.icon} style={{ fontSize:14 }}/>{t.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Employee Details ──────────────────────────────────────── */}
          {tab === "details" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* Personal Info */}
              <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"20px 24px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
                <h3 style={{ fontSize:14, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 16px", display:"flex", alignItems:"center", gap:8 }}>
                  <i className="ri-user-3-line" style={{ color:"var(--primary-color)" }}/>Personal Information
                </h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                  <IRow label="Full Name"    value={user.name}/>
                  <IRow label="Date of Birth"value={user.dob}/>
                  <IRow label="Gender"       value={user.gender}/>
                  <IRow label="Blood Group"  value={user.bloodGroup}/>
                  <IRow label="Aadhar No."   value={user.aadhar} mono/>
                  <IRow label="PAN Number"   value={user.pan} mono/>
                </div>
              </div>

              {/* Professional Info */}
              <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"20px 24px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
                <h3 style={{ fontSize:14, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 16px", display:"flex", alignItems:"center", gap:8 }}>
                  <i className="ri-briefcase-line" style={{ color:"var(--primary-color)" }}/>Professional Details
                </h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                  <IRow label="Employee ID"          value={user.id}/>
                  <IRow label="Role"                 value={user.role}/>
                  <IRow label="Designation"          value={user.designation}/>
                  <IRow label="Department"           value={user.department}/>
                  <IRow label="Joining Date"         value={user.joiningDate}/>
                  <IRow label="Assigned Zone"        value={user.zone}/>
                  <IRow label="BEE EA Number"        value={user.beeEaNo} mono/>
                  <IRow label="Elec. Supervisor No." value={user.electricalSupNo} mono/>
                </div>
              </div>

              {/* Address */}
              <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"20px 24px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
                <h3 style={{ fontSize:14, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 16px", display:"flex", alignItems:"center", gap:8 }}>
                  <i className="ri-map-pin-line" style={{ color:"var(--primary-color)" }}/>Address
                </h3>
                <p style={{ fontSize:13, color:"var(--default-text-color)", margin:0, lineHeight:1.6 }}>{user.address}</p>
              </div>

              {/* Emergency contact */}
              <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"20px 24px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
                <h3 style={{ fontSize:14, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 16px", display:"flex", alignItems:"center", gap:8 }}>
                  <i className="ri-emergency-line" style={{ color:"#dc2626" }}/>Emergency Contact
                </h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                  <IRow label="Name"       value={user.emergencyName}/>
                  <IRow label="Relation"   value={user.emergencyRelation}/>
                  <IRow label="Phone"      value={user.emergencyPhone} mono/>
                </div>
              </div>

              {/* Bank Details */}
              <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"20px 24px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
                <h3 style={{ fontSize:14, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 16px", display:"flex", alignItems:"center", gap:8 }}>
                  <i className="ri-bank-line" style={{ color:"var(--primary-color)" }}/>Bank Details <span style={{ fontSize:11, color:"var(--text-muted)", fontWeight:500, marginLeft:4 }}>(for payroll)</span>
                </h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                  <IRow label="Bank Name"    value={user.bank}/>
                  <IRow label="Account No."  value={user.accountNo} mono/>
                  <IRow label="IFSC Code"    value={user.ifsc} mono/>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Audit History ─────────────────────────────────────────── */}
          {tab === "audits" && (
            <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <h3 style={{ fontSize:14, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>
                  Audit History <span style={{ fontWeight:400, color:"var(--text-muted)", fontSize:12 }}>— {AUDIT_HISTORY.length} audits</span>
                </h3>
                <span style={{ fontSize:11, fontWeight:700, color:"var(--primary-color)", background:"#dcfce7", borderRadius:20, padding:"3px 12px" }}>
                  Avg Score: {avgScore}%
                </span>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f9fafb" }}>
                    {["Audit ID","Bank","Branch","Date","Score","Status","Template"].map(h => (
                      <th key={h} style={{ padding:"10px 16px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.04em", textAlign:h==="Score"?"center":"left", borderBottom:"2px solid #dcfce7" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_HISTORY.map((a, i) => {
                    const sc = AuditStatus[a.status] ?? { color:"#6b7280", bg:"#f3f4f6" };
                    return (
                      <tr key={a.auditId} style={{ borderTop: i > 0 ? "1px solid var(--default-border)" : undefined }}>
                        <td style={{ padding:"11px 16px", fontSize:11, fontWeight:700, color:"#15803d", background:"transparent" }}>
                          <span style={{ background:"#dcfce7", padding:"2px 8px", borderRadius:6 }}>{a.auditId}</span>
                        </td>
                        <td style={{ padding:"11px 16px", fontSize:12, color:"var(--text-muted)" }}>{a.bank}</td>
                        <td style={{ padding:"11px 16px", fontSize:12.5, fontWeight:600, color:"var(--default-text-color)" }}>{a.branch}</td>
                        <td style={{ padding:"11px 16px", fontSize:12, color:"var(--text-muted)" }}>{a.date}</td>
                        <td style={{ padding:"11px 16px", textAlign:"center" }}>
                          <span style={{ fontSize:12, fontWeight:800, color:ScoreColor(a.score), background:ScoreBg(a.score), borderRadius:6, padding:"2px 8px" }}>{a.score}%</span>
                        </td>
                        <td style={{ padding:"11px 16px" }}>
                          <span style={{ fontSize:11, fontWeight:600, color:sc.color, background:sc.bg, borderRadius:20, padding:"2px 10px" }}>{a.status}</span>
                        </td>
                        <td style={{ padding:"11px 16px", fontSize:11.5, color:"var(--text-muted)" }}>{a.template}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Tab: Documents ────────────────────────────────────────────── */}
          {tab === "documents" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <h3 style={{ fontSize:14, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>Employee Documents</h3>
                <button style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", background:"var(--primary-color)", color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:12, cursor:"pointer" }}>
                  <i className="ri-upload-cloud-line"/>Upload Document
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
                {DOCUMENTS.map(doc => (
                  <div key={doc.id} style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", padding:"16px", display:"flex", gap:12, alignItems:"flex-start", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:doc.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className={doc.icon} style={{ fontSize:18, color:doc.color }}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)", margin:"0 0 4px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.name}</p>
                      <p style={{ fontSize:11, color:"var(--text-muted)", margin:"0 0 6px" }}>{doc.type}</p>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontSize:10, color:"var(--text-muted)" }}>Expires: {doc.expiry}</span>
                        <span style={{ fontSize:10, fontWeight:700, color:"#16a34a", background:"#dcfce7", borderRadius:10, padding:"1px 8px" }}>{doc.status}</span>
                      </div>
                    </div>
                    <button style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", padding:0, flexShrink:0 }}>
                      <i className="ri-download-line" style={{ fontSize:15 }}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: Permissions ────────────────────────────────────────────── */}
          {tab === "permissions" && (
            <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <h3 style={{ fontSize:14, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 3px" }}>Permissions</h3>
                  <p style={{ fontSize:12, color:"var(--text-muted)", margin:0 }}>Role: <strong>{user.role}</strong> — permissions are inherited from this role</p>
                </div>
                <button style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"7px 14px", background:"transparent", color:"var(--primary-color)", border:"1px solid var(--primary-color)", borderRadius:8, fontWeight:700, fontSize:12, cursor:"pointer" }}>
                  <i className="ri-settings-line"/>Edit Role Permissions
                </button>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f9fafb" }}>
                    {["Module","View","Create","Edit","Delete"].map(h => (
                      <th key={h} style={{ padding:"10px 16px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.04em", textAlign:h==="Module"?"left":"center", borderBottom:"2px solid #dcfce7" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERM_MODULES.map((p, i) => (
                    <tr key={p.module} style={{ borderTop: i > 0 ? "1px solid var(--default-border)" : undefined }}>
                      <td style={{ padding:"11px 16px", fontSize:13, fontWeight:600, color:"var(--default-text-color)" }}>{p.module}</td>
                      {[p.view, p.create, p.edit, p.delete].map((v, j) => (
                        <td key={j} style={{ padding:"11px 16px", textAlign:"center" }}>
                          {v
                            ? <i className="ri-checkbox-circle-fill" style={{ fontSize:16, color:"#16a34a" }}/>
                            : <i className="ri-close-circle-fill" style={{ fontSize:16, color:"#d1d5db" }}/>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Tab: Activity Log ────────────────────────────────────────────── */}
          {tab === "activity" && (
            <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"20px 24px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
              <h3 style={{ fontSize:14, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 20px" }}>Activity Log</h3>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:19, top:0, bottom:0, width:1, background:"var(--default-border)" }}/>
                {ACTIVITY_LOG.map((a) => (
                  <div key={a.id} style={{ display:"flex", gap:14, marginBottom:20, alignItems:"flex-start" }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:`${a.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, position:"relative", zIndex:1 }}>
                      <i className={a.icon} style={{ fontSize:15, color:a.color }}/>
                    </div>
                    <div style={{ flex:1, paddingTop:6 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)", margin:"0 0 2px" }}>{a.action}</p>
                      <p style={{ fontSize:12, color:"var(--text-muted)", margin:"0 0 2px" }}>{a.detail}</p>
                      <p style={{ fontSize:11, color:"var(--text-muted)", margin:0 }}><i className="ri-time-line" style={{ marginRight:4 }}/>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
