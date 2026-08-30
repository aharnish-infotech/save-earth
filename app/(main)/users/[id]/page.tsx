"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ── Same data shape as the list page ─────────────────────────────────────────
const USERS = [
  { id:"101", name:"Mukteshwar Sharma",  email:"mukteshwar@saveearth.in",  phone:"9876543210", role:"Super Admin",   designation:"Platform Owner",       dob:"1990-05-15", education:"B.E. Electrical",    joiningDate:"2019-03-01", bloodGroup:"B+",  emergencyContact:"9988776655", emergencyContactName:"Ravi Sharma",   emergencyContactRelation:"Father",  status:"Active",   avatarColor:"#15803d" },
  { id:"102", name:"Priya Sharma",       email:"priya@saveearth.in",        phone:"9876543211", role:"Admin",         designation:"Operations Manager",   dob:"1992-08-20", education:"MBA Operations",      joiningDate:"2020-06-15", bloodGroup:"A+",  emergencyContact:"9988776601", emergencyContactName:"Amit Sharma",   emergencyContactRelation:"Spouse",  status:"Active",   avatarColor:"#0284c7" },
  { id:"103", name:"Amit Singh",         email:"amit@saveearth.in",         phone:"9876543212", role:"Coordinator",   designation:"Audit Coordinator",    dob:"1988-11-03", education:"B.Sc. Physics",       joiningDate:"2021-04-01", bloodGroup:"O+",  emergencyContact:"9988776602", emergencyContactName:"Neha Singh",    emergencyContactRelation:"Spouse",  status:"Active",   avatarColor:"#16a34a" },
  { id:"104", name:"Rajesh Kumar",       email:"rajesh@saveearth.in",       phone:"9876543213", role:"Field Auditor", designation:"Senior Field Auditor", dob:"1986-07-22", education:"Diploma Electrical",  joiningDate:"2021-07-15", bloodGroup:"AB+", emergencyContact:"9988776603", emergencyContactName:"Sita Kumar",    emergencyContactRelation:"Father",  status:"Active",   avatarColor:"#059669" },
  { id:"105", name:"Sneha Patel",        email:"sneha@saveearth.in",        phone:"9876543214", role:"Field Auditor", designation:"Field Auditor",        dob:"1995-02-14", education:"B.E. Electrical",    joiningDate:"2022-01-01", bloodGroup:"A-",  emergencyContact:"9988776604", emergencyContactName:"Renu Patel",    emergencyContactRelation:"Father",  status:"Active",   avatarColor:"#db2777" },
  { id:"106", name:"Vikas Tiwari",       email:"vikas@saveearth.in",        phone:"9876543215", role:"Field Auditor", designation:"Field Auditor",        dob:"1993-09-30", education:"ITI Electrician",     joiningDate:"2022-03-15", bloodGroup:"B-",  emergencyContact:"9988776605", emergencyContactName:"Meena Tiwari",  emergencyContactRelation:"Spouse",  status:"Active",   avatarColor:"#ea580c" },
  { id:"107", name:"Divya Mehta",        email:"divya@saveearth.in",        phone:"9876543216", role:"Field Auditor", designation:"Field Auditor",        dob:"1994-04-17", education:"B.Sc. Electronics",   joiningDate:"2022-06-01", bloodGroup:"O-",  emergencyContact:"9988776606", emergencyContactName:"Kiran Mehta",   emergencyContactRelation:"Father",  status:"Active",   avatarColor:"#0891b2" },
  { id:"108", name:"Arjun Yadav",        email:"arjun@saveearth.in",        phone:"9876543217", role:"Field Auditor", designation:"Jr. Field Auditor",    dob:"1998-01-25", education:"Diploma Electrical",  joiningDate:"2023-02-01", bloodGroup:"A+",  emergencyContact:"9988776607", emergencyContactName:"Prem Yadav",    emergencyContactRelation:"Father",  status:"Active",   avatarColor:"#ca8a04" },
  { id:"109", name:"Sunita Verma",       email:"sunita@saveearth.in",       phone:"9876543218", role:"Coordinator",   designation:"Audit Coordinator",    dob:"1988-11-03", education:"M.Sc. Physics",       joiningDate:"2021-09-15", bloodGroup:"B+",  emergencyContact:"9988776608", emergencyContactName:"Raj Verma",     emergencyContactRelation:"Spouse",  status:"Inactive", avatarColor:"#8b5cf6" },
  { id:"110", name:"Karan Joshi",        email:"karan@saveearth.in",        phone:"9876543219", role:"Field Auditor", designation:"Field Auditor",        dob:"1997-12-11", education:"B.E. Electrical",    joiningDate:"2023-05-15", bloodGroup:"AB-", emergencyContact:"9988776609", emergencyContactName:"Asha Joshi",    emergencyContactRelation:"Father",  status:"Inactive", avatarColor:"#374151" },
  { id:"111", name:"Pooja Gupta",        email:"pooja@saveearth.in",        phone:"9876543220", role:"Admin",         designation:"Admin Officer",        dob:"1991-03-28", education:"BCA",                 joiningDate:"2022-08-01", bloodGroup:"O+",  emergencyContact:"9988776610", emergencyContactName:"Manoj Gupta",   emergencyContactRelation:"Spouse",  status:"Active",   avatarColor:"#16a34a" },
  { id:"112", name:"Deepak Nair",        email:"deepak@saveearth.in",       phone:"9876543221", role:"Field Auditor", designation:"Sr. Field Auditor",    dob:"1985-10-05", education:"B.E. Electrical",    joiningDate:"2020-11-01", bloodGroup:"A+",  emergencyContact:"9988776611", emergencyContactName:"Latha Nair",    emergencyContactRelation:"Father",  status:"Active",   avatarColor:"#dc2626" },
];

// ── Audit history ─────────────────────────────────────────────────────────────
const AUDIT_HISTORY = [
  { auditId:"AU-2024-131", bank:"SBI", branch:"SBI Maninagar",   date:"27 Jul 2024", status:"In Progress", template:"Electrical Safety v2.1" },
  { auditId:"AU-2024-125", bank:"SBI", branch:"SBI CG Road",     date:"24 Jul 2024", status:"Draft",       template:"Electrical Safety v2.1" },
  { auditId:"AU-2024-119", bank:"SBI", branch:"SBI Navrangpura", date:"21 Jul 2024", status:"Pending Approval", template:"Electrical Safety v2.1" },
  { auditId:"AU-2024-114", bank:"SBI", branch:"SBI Bodakdev",    date:"18 Jul 2024", status:"Delivered",   template:"Electrical Safety v2.1" },
  { auditId:"AU-2024-108", bank:"SBI", branch:"SBI Vastrapur",   date:"15 Jul 2024", status:"Delivered",   template:"Electrical Safety v2.0" },
  { auditId:"AU-2024-101", bank:"SBI", branch:"SBI Satellite",   date:"12 Jul 2024", status:"Delivered",   template:"Electrical Safety v2.0" },
];


const ROLE_COLORS: Record<string,{color:string;bg:string}> = {
  "Super Admin":   { color:"#15803d", bg:"#dcfce7" },
  "Admin":         { color:"#0284c7", bg:"#dbeafe" },
  "Coordinator":   { color:"#ca8a04", bg:"#fef9c3" },
  "Field Auditor": { color:"#374151", bg:"#f3f4f6" },
};
const STATUS_STYLE: Record<string,{color:string;bg:string;icon:string}> = {
  "In Progress":     { color:"#2563eb", bg:"#dbeafe",  icon:"ri-loader-4-line"    },
  "Draft":           { color:"#ca8a04", bg:"#fef9c3",  icon:"ri-draft-line"       },
  "Pending Approval":{ color:"#7c3aed", bg:"#f3e8ff",  icon:"ri-time-line"        },
  "Delivered":       { color:"#16a34a", bg:"#dcfce7",  icon:"ri-send-plane-line"  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const IRow = ({ label, value, mono }: { label:string; value?:string; mono?:boolean }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:10 }}>
    <span style={{ fontSize:12, color:"var(--text-muted)", fontWeight:500, flexShrink:0, minWidth:140 }}>{label}</span>
    <span style={{ fontSize:12.5, color:"var(--default-text-color)", fontWeight:600, textAlign:"right", fontFamily:mono?"monospace":undefined }}>{value || "—"}</span>
  </div>
);
const Badge = ({ text, color="#16a34a", bg="#dcfce7" }: { text:string; color?:string; bg?:string }) => (
  <span style={{ fontSize:11, fontWeight:700, color, background:bg, borderRadius:20, padding:"2px 10px", display:"inline-block" }}>{text}</span>
);
const SCard = ({ icon, title, children }: { icon:string; title:string; children:React.ReactNode }) => (
  <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"18px 22px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
    <h3 style={{ fontSize:13, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 14px", display:"flex", alignItems:"center", gap:7 }}>
      <i className={icon} style={{ color:"var(--primary-color)", fontSize:15 }}/>{title}
    </h3>
    {children}
  </div>
);

const fmtDate = (d: string) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }); }
  catch { return d; }
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const params = useParams();
  const uid    = params?.id as string;
  const user   = USERS.find(u => u.id === uid) ?? USERS[0];
  const [tab, setTab] = useState<"details"|"audits">("details");

  const rc = ROLE_COLORS[user.role] ?? { color:"#374151", bg:"#f3f4f6" };
  const initials = user.name.split(" ").filter(Boolean).map(w => w[0].toUpperCase()).filter((_, i, a) => i === 0 || i === a.length - 1).join("");

  const TABS = [
    { id:"details", label:"Employee Details", icon:"ri-user-3-line"      },
    { id:"audits",  label:"Audit History",    icon:"ri-file-list-3-line" },
  ] as const;

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

      <div style={{ display:"grid", gridTemplateColumns:"290px 1fr", gap:20, alignItems:"start" }}>

        {/* ══ LEFT PANEL ══════════════════════════════════════════════════════ */}
        <div style={{ display:"flex", flexDirection:"column", gap:14, position:"sticky", top:80 }}>

          {/* Avatar card */}
          <div style={{ background:"var(--custom-white)", borderRadius:16, border:"1px solid var(--default-border)", padding:"24px 18px", textAlign:"center", boxShadow:"0 2px 8px rgba(22,163,74,0.06)" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:user.avatarColor, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:26, fontWeight:800, margin:"0 auto 12px" }}>
              {initials}
            </div>
            <h2 style={{ fontSize:16, fontWeight:800, color:"var(--default-text-color)", margin:"0 0 3px" }}>{user.name}</h2>
            <p style={{ fontSize:12, color:"var(--text-muted)", margin:"0 0 10px" }}>{user.designation || "—"}</p>
            <div style={{ display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap" }}>
              <Badge text={user.role} color={rc.color} bg={rc.bg}/>
              <Badge
                text={user.status}
                color={user.status === "Active" ? "#16a34a" : "#dc2626"}
                bg={user.status === "Active" ? "#dcfce7" : "#fee2e2"}
              />
            </div>
            <div style={{ marginTop:12, display:"flex", gap:8, justifyContent:"center" }}>
              <Link href="/users" style={{ padding:"7px 16px", fontSize:12, fontWeight:700, background:"var(--primary-color)", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:5 }}>
                <i className="ri-edit-line"/>Edit
              </Link>
            </div>
          </div>

          {/* Employee Info */}
          <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"16px 18px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"var(--text-muted)", textTransform:"uppercase" as const, letterSpacing:"0.07em", marginBottom:12, display:"flex", alignItems:"center", gap:5 }}>
              <i className="ri-id-card-line" style={{ color:"var(--primary-color)" }}/>Employee Info
            </div>
            <IRow label="Employee ID"   value={user.id}/>
            <IRow label="Joining Date"  value={fmtDate(user.joiningDate)}/>
            <IRow label="Date of Birth" value={fmtDate(user.dob)}/>
            <IRow label="Blood Group"   value={user.bloodGroup}/>
            <IRow label="Education"     value={user.education}/>
          </div>

          {/* Contact */}
          <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", padding:"16px 18px", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"var(--text-muted)", textTransform:"uppercase" as const, letterSpacing:"0.07em", marginBottom:12, display:"flex", alignItems:"center", gap:5 }}>
              <i className="ri-contacts-line" style={{ color:"var(--primary-color)" }}/>Contact
            </div>
            {[
              { icon:"ri-phone-line", text:user.phone,  href:`tel:${user.phone}` },
              { icon:"ri-mail-line",  text:user.email,  href:`mailto:${user.email}` },
            ].map((c, i) => (
              <a key={i} href={c.href} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:9, background:"var(--default-background)", textDecoration:"none", marginBottom:6 }}>
                <div style={{ width:28, height:28, borderRadius:7, background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={c.icon} style={{ fontSize:13, color:"var(--primary-color)" }}/>
                </div>
                <span style={{ fontSize:12, color:"var(--default-text-color)", fontWeight:500, wordBreak:"break-all" }}>{c.text}</span>
              </a>
            ))}
          </div>

          {/* Emergency Contact */}
          <div style={{ background:"#fff5f5", borderRadius:14, border:"1px solid #fecaca", padding:"16px 18px" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#dc2626", textTransform:"uppercase" as const, letterSpacing:"0.07em", marginBottom:12, display:"flex", alignItems:"center", gap:5 }}>
              <i className="ri-heart-pulse-line"/>Emergency Contact
            </div>
            <IRow label="Name"     value={user.emergencyContactName}/>
            <IRow label="Relation" value={user.emergencyContactRelation}/>
            <IRow label="Mobile"   value={user.emergencyContact} mono/>
          </div>

        </div>

        {/* ══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
        <div>
          {/* Tab bar */}
          <div style={{ display:"flex", gap:0, borderBottom:"2px solid var(--default-border)", marginBottom:20, overflowX:"auto" as const }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={{
                display:"flex", alignItems:"center", gap:6, padding:"10px 18px",
                background:"none", border:"none", cursor:"pointer",
                fontSize:13, fontWeight:tab === t.id ? 700 : 500,
                color:tab === t.id ? "var(--primary-color)" : "var(--text-muted)",
                borderBottom:tab === t.id ? "2px solid var(--primary-color)" : "2px solid transparent",
                marginBottom:-2, whiteSpace:"nowrap" as const,
              }}>
                <i className={t.icon} style={{ fontSize:14 }}/>{t.label}
              </button>
            ))}
          </div>

          {/* ── Employee Details ──────────────────────────────────────────── */}
          {tab === "details" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              <SCard icon="ri-user-3-line" title="Personal Information">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                  <IRow label="Full Name"     value={user.name}/>
                  <IRow label="Date of Birth" value={fmtDate(user.dob)}/>
                  <IRow label="Blood Group"   value={user.bloodGroup}/>
                  <IRow label="Education"     value={user.education}/>
                </div>
              </SCard>

              <SCard icon="ri-briefcase-line" title="Professional Details">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                  <IRow label="Employee ID"  value={user.id}/>
                  <IRow label="Role"         value={user.role}/>
                  <IRow label="Designation"  value={user.designation}/>
                  <IRow label="Joining Date" value={fmtDate(user.joiningDate)}/>
                  <IRow label="Status"       value={user.status}/>
                </div>
              </SCard>

              <SCard icon="ri-contacts-line" title="Contact Information">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                  <IRow label="Mobile"  value={user.phone} mono/>
                  <IRow label="Email"   value={user.email}/>
                </div>
              </SCard>

              <div style={{ background:"#fff5f5", borderRadius:14, border:"1px solid #fecaca", padding:"18px 22px" }}>
                <h3 style={{ fontSize:13, fontWeight:800, color:"#dc2626", margin:"0 0 14px", display:"flex", alignItems:"center", gap:7 }}>
                  <i className="ri-heart-pulse-line" style={{ fontSize:15 }}/>Emergency Contact
                </h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                  <IRow label="Person Name" value={user.emergencyContactName}/>
                  <IRow label="Relation"    value={user.emergencyContactRelation}/>
                  <IRow label="Mobile"      value={user.emergencyContact} mono/>
                </div>
              </div>

            </div>
          )}

          {/* ── Audit History ─────────────────────────────────────────────── */}
          {tab === "audits" && (
            <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 2px 8px rgba(22,163,74,0.04)" }}>
              <div style={{ padding:"14px 20px", borderBottom:"1px solid var(--default-border)" }}>
                <h3 style={{ fontSize:14, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>
                  Audit History <span style={{ fontWeight:400, color:"var(--text-muted)", fontSize:12 }}>— {AUDIT_HISTORY.length} audits</span>
                </h3>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f9fafb" }}>
                    {["Audit ID","Bank","Branch","Date","Status","Template"].map(h => (
                      <th key={h} style={{ padding:"10px 16px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase" as const, letterSpacing:"0.04em", textAlign:"left" as const, borderBottom:"2px solid #dcfce7" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_HISTORY.map((a, i) => {
                    const ss = STATUS_STYLE[a.status] ?? { color:"#6b7280", bg:"#f3f4f6", icon:"ri-question-line" };
                    return (
                      <tr key={a.auditId} style={{ borderTop: i > 0 ? "1px solid var(--default-border)" : undefined }}>
                        <td style={{ padding:"11px 16px" }}>
                          <span style={{ fontSize:11, fontWeight:700, color:"#15803d", background:"#dcfce7", padding:"2px 8px", borderRadius:6 }}>{a.auditId}</span>
                        </td>
                        <td style={{ padding:"11px 16px", fontSize:12, color:"var(--text-muted)" }}>{a.bank}</td>
                        <td style={{ padding:"11px 16px", fontSize:12.5, fontWeight:600, color:"var(--default-text-color)" }}>{a.branch}</td>
                        <td style={{ padding:"11px 16px", fontSize:12, color:"var(--text-muted)" }}>{a.date}</td>
                        <td style={{ padding:"11px 16px" }}>
                          <span style={{ fontSize:11, fontWeight:700, color:ss.color, background:ss.bg, borderRadius:20, padding:"2px 10px", display:"inline-flex", alignItems:"center", gap:4 }}>
                            <i className={ss.icon} style={{ fontSize:10 }}/>{a.status}
                          </span>
                        </td>
                        <td style={{ padding:"11px 16px", fontSize:11.5, color:"var(--text-muted)" }}>{a.template}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
