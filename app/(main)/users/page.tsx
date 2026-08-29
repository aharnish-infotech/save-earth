"use client";
import React, { useState } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────
interface User {
  id:                       string;  // UUID — internal PK
  employeeId:               string;  // "EMP-001" — display ID
  name:                     string;
  email:                    string;
  phone:                    string;
  role:                     "Super Admin" | "Admin" | "Coordinator" | "Field Auditor";
  designation:              string;
  dob:                      string;
  education:                string;
  joiningDate:              string;
  bloodGroup:               string;
  emergencyContact:         string;
  emergencyContactName:     string;
  emergencyContactRelation: string;
  status:                   "Active" | "Inactive";
  lastActive:               string;
  avatarColor:              string;
}

const uuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
});

// ── Seed Data ──────────────────────────────────────────────────────────────────
const USERS: User[] = [
  { id:uuid(), employeeId:"EMP-001", name:"Mukteshwar Sharma",  email:"mukteshwar@saveearth.in",  phone:"9876543210", role:"Super Admin",   designation:"Platform Owner",       dob:"1990-05-15", education:"B.E. Electrical", joiningDate:"2019-03-01", bloodGroup:"B+",  emergencyContact:"9988776655", emergencyContactName:"Ravi Sharma",   emergencyContactRelation:"Father",  status:"Active",   lastActive:"Today",       avatarColor:"#15803d" },
  { id:uuid(), employeeId:"EMP-002", name:"Priya Sharma",       email:"priya@saveearth.in",        phone:"9876543211", role:"Admin",         designation:"Operations Manager",   dob:"1992-08-20", education:"MBA Operations", joiningDate:"2020-06-15", bloodGroup:"A+",  emergencyContact:"9988776601", emergencyContactName:"Amit Sharma",   emergencyContactRelation:"Spouse",  status:"Active",   lastActive:"Today",       avatarColor:"#0284c7" },
  { id:uuid(), employeeId:"EMP-003", name:"Amit Singh",         email:"amit@saveearth.in",         phone:"9876543212", role:"Coordinator",   designation:"Audit Coordinator",    dob:"1988-11-03", education:"B.Sc. Physics", joiningDate:"2021-04-01", bloodGroup:"O+",  emergencyContact:"9988776602", emergencyContactName:"Neha Singh",    emergencyContactRelation:"Spouse",  status:"Active",   lastActive:"Yesterday",   avatarColor:"#16a34a" },
  { id:uuid(), employeeId:"EMP-004", name:"Rajesh Kumar",       email:"rajesh@saveearth.in",       phone:"9876543213", role:"Field Auditor", designation:"Senior Field Auditor", dob:"1986-07-22", education:"Diploma Electrical", joiningDate:"2021-07-15", bloodGroup:"AB+", emergencyContact:"9988776603", emergencyContactName:"Sita Kumar",    emergencyContactRelation:"Father",  status:"Active",   lastActive:"Today",       avatarColor:"#059669" },
  { id:uuid(), employeeId:"EMP-005", name:"Sneha Patel",        email:"sneha@saveearth.in",        phone:"9876543214", role:"Field Auditor", designation:"Field Auditor",        dob:"1995-02-14", education:"B.E. Electrical", joiningDate:"2022-01-01", bloodGroup:"A-",  emergencyContact:"9988776604", emergencyContactName:"Renu Patel",    emergencyContactRelation:"Father",  status:"Active",   lastActive:"Today",       avatarColor:"#db2777" },
  { id:uuid(), employeeId:"EMP-006", name:"Vikas Tiwari",       email:"vikas@saveearth.in",        phone:"9876543215", role:"Field Auditor", designation:"Field Auditor",        dob:"1993-09-30", education:"ITI Electrician", joiningDate:"2022-03-15", bloodGroup:"B-",  emergencyContact:"9988776605", emergencyContactName:"Meena Tiwari",  emergencyContactRelation:"Spouse",  status:"Active",   lastActive:"2 days ago",  avatarColor:"#ea580c" },
  { id:uuid(), employeeId:"EMP-007", name:"Divya Mehta",        email:"divya@saveearth.in",        phone:"9876543216", role:"Field Auditor", designation:"Field Auditor",        dob:"1994-04-17", education:"B.Sc. Electronics", joiningDate:"2022-06-01", bloodGroup:"O-",  emergencyContact:"9988776606", emergencyContactName:"Kiran Mehta",   emergencyContactRelation:"Father",  status:"Active",   lastActive:"Today",       avatarColor:"#0891b2" },
  { id:uuid(), employeeId:"EMP-008", name:"Arjun Yadav",        email:"arjun@saveearth.in",        phone:"9876543217", role:"Field Auditor", designation:"Jr. Field Auditor",    dob:"1998-01-25", education:"Diploma Electrical", joiningDate:"2023-02-01", bloodGroup:"A+",  emergencyContact:"9988776607", emergencyContactName:"Prem Yadav",    emergencyContactRelation:"Father",  status:"Active",   lastActive:"Today",       avatarColor:"#ca8a04" },
  { id:uuid(), employeeId:"EMP-009", name:"Sunita Verma",       email:"sunita@saveearth.in",       phone:"9876543218", role:"Coordinator",   designation:"Audit Coordinator",    dob:"1988-11-03", education:"M.Sc. Physics", joiningDate:"2021-09-15", bloodGroup:"B+",  emergencyContact:"9988776608", emergencyContactName:"Raj Verma",     emergencyContactRelation:"Spouse",  status:"Inactive", lastActive:"5 days ago",  avatarColor:"#8b5cf6" },
  { id:uuid(), employeeId:"EMP-010", name:"Karan Joshi",        email:"karan@saveearth.in",        phone:"9876543219", role:"Field Auditor", designation:"Field Auditor",        dob:"1997-12-11", education:"B.E. Electrical", joiningDate:"2023-05-15", bloodGroup:"AB-", emergencyContact:"9988776609", emergencyContactName:"Asha Joshi",    emergencyContactRelation:"Father",  status:"Inactive", lastActive:"3 weeks ago", avatarColor:"#374151" },
  { id:uuid(), employeeId:"EMP-011", name:"Pooja Gupta",        email:"pooja@saveearth.in",        phone:"9876543220", role:"Admin",         designation:"Admin Officer",        dob:"1991-03-28", education:"BCA", joiningDate:"2022-08-01", bloodGroup:"O+",  emergencyContact:"9988776610", emergencyContactName:"Manoj Gupta",   emergencyContactRelation:"Spouse",  status:"Active",   lastActive:"Today",       avatarColor:"#16a34a" },
  { id:uuid(), employeeId:"EMP-012", name:"Deepak Nair",        email:"deepak@saveearth.in",       phone:"9876543221", role:"Field Auditor", designation:"Sr. Field Auditor",    dob:"1985-10-05", education:"B.E. Electrical", joiningDate:"2020-11-01", bloodGroup:"A+",  emergencyContact:"9988776611", emergencyContactName:"Latha Nair",    emergencyContactRelation:"Father",  status:"Active",   lastActive:"Yesterday",   avatarColor:"#dc2626" },
];

// ── Constants ──────────────────────────────────────────────────────────────────
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const RELATIONS    = ["Father", "Mother", "Spouse", "Brother", "Sister", "Son", "Daughter", "Friend", "Other"];
const ROLES        = ["Super Admin", "Admin", "Coordinator", "Field Auditor"] as const;

const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  "Super Admin":   { color: "#15803d", bg: "#dcfce7" },
  "Admin":         { color: "#0284c7", bg: "#dbeafe" },
  "Coordinator":   { color: "#ca8a04", bg: "#fef9c3" },
  "Field Auditor": { color: "#374151", bg: "#f3f4f6" },
};
const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  "Active":   { color: "#16a34a", bg: "#dcfce7" },
  "Inactive": { color: "#dc2626", bg: "#fee2e2" },
};
const ROLES_FILTER  = ["All Roles",  ...ROLES];
const STATUS_FILTER = ["All Status", "Active", "Inactive"];
const PAGE_SIZE     = 10;

// ── Form ───────────────────────────────────────────────────────────────────────
type FormData = {
  name: string; email: string; phone: string; role: string;
  designation: string; employeeId: string; dob: string; education: string; joiningDate: string;
  bloodGroup: string; emergencyContact: string;
  emergencyContactName: string; emergencyContactRelation: string;
  status: string;
};
const EMPTY_FORM: FormData = {
  name: "", email: "", phone: "", role: "Field Auditor",
  designation: "", employeeId: "", dob: "", education: "", joiningDate: "",
  bloodGroup: "A+", emergencyContact: "",
  emergencyContactName: "", emergencyContactRelation: "Father",
  status: "Active",
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const inputSt: React.CSSProperties = {
  border: "1px solid var(--default-border)", borderRadius: 8, padding: "7px 12px",
  fontSize: 13, color: "var(--default-text-color)", background: "var(--custom-white)", outline: "none",
};
const PB: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
  background: "var(--primary-color,#16a34a)", color: "#fff", border: "none",
  borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: "pointer",
};
const OB: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
  background: "var(--custom-white)", color: "var(--default-text-color)",
  border: "1px solid var(--default-border)", borderRadius: 9, fontWeight: 600,
  fontSize: 13, cursor: "pointer",
};
const TH: React.CSSProperties = {
  padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#6b7280",
  textTransform: "uppercase", letterSpacing: "0.04em",
  borderBottom: "2px solid #dcfce7", whiteSpace: "nowrap", background: "#f9fafb",
};
const TD: React.CSSProperties = { padding: "11px 14px", verticalAlign: "middle", fontSize: 13 };
const IL: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.03em" };
const INP: React.CSSProperties = { ...inputSt, width: "100%", boxSizing: "border-box" };

// Section divider inside form
const SectionLabel = ({ icon, label }: { icon: string; label: string }) => (
  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--primary-color,#16a34a)", textTransform: "uppercase" as const, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5, borderTop: "1px dashed var(--default-border)", paddingTop: 12, marginTop: 4 }}>
    <i className={icon} />{label}
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users,   setUsers]   = useState<User[]>(USERS);
  const [search,  setSearch]  = useState("");
  const [roleF,   setRoleF]   = useState("All Roles");
  const [statusF, setStatusF] = useState("All Status");
  const [page,    setPage]    = useState(1);

  const [editRow, setEditRow] = useState<User | null>(null);
  const [form,    setForm]    = useState<FormData>({ ...EMPTY_FORM });
  const isEditMode = !!editRow;

  const F = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const q  = search.toLowerCase();
    const mQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.employeeId.toLowerCase().includes(q);
    const mR = roleF   === "All Roles"  || u.role   === roleF;
    const mS = statusF === "All Status" || u.status === statusF;
    return mQ && mR && mS;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pageNums   = () => { const n: number[] = []; for (let i = Math.max(1, safePage - 2); i <= Math.min(totalPages, safePage + 2); i++) n.push(i); return n; };

  // ── Panel actions ────────────────────────────────────────────────────────────
  const resetToAdd = () => { setForm({ ...EMPTY_FORM }); setEditRow(null); };
  const openEdit = (u: User) => {
    setEditRow(u);
    setForm({
      name: u.name, email: u.email, phone: u.phone, role: u.role,
      designation: u.designation, employeeId: u.employeeId, dob: u.dob, education: u.education, joiningDate: u.joiningDate,
      bloodGroup: u.bloodGroup, emergencyContact: u.emergencyContact,
      emergencyContactName: u.emergencyContactName, emergencyContactRelation: u.emergencyContactRelation,
      status: u.status,
    });
  };
  const saveUser = () => {
    if (!form.name.trim() || !form.email.trim() || !form.employeeId.trim()) return;
    if (isEditMode && editRow) {
      setUsers(prev => prev.map(u => u.id === editRow.id
        ? { ...u, ...form, role: form.role as User["role"], status: form.status as User["status"] }
        : u));
    } else {
      setUsers(prev => [{
        id: uuid(), ...form,
        role: form.role as User["role"],
        status: form.status as User["status"],
        lastActive: "Just now",
        avatarColor: "#16a34a",
      }, ...prev]);
    }
    resetToAdd();
  };
  const deleteUser = (id: string) => {
    if (editRow?.id === id) resetToAdd();
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // ── Stats ────────────────────────────────────────────────────────────────────
  const total         = users.length;
  const active        = users.filter(u => u.status === "Active").length;
  const fieldAuditors = users.filter(u => u.role === "Field Auditor").length;
  const inactive      = users.filter(u => u.status === "Inactive").length;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 20, padding: "1.5rem 0" }}>

      {/* ── LEFT PANEL — always visible ──────────────────────────────────────── */}
      <div style={{
        width: 340, flexShrink: 0, background: "var(--custom-white)",
        borderRadius: 14, border: "1px solid var(--default-border)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.09)", overflow: "hidden",
        position: "sticky", top: 80,
      }}>
        {/* Panel header */}
        <div style={{
          padding: "14px 18px", borderBottom: "1px solid var(--default-border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: isEditMode ? "#eff6ff" : "#f0fdf4",
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--default-text-color)", display: "flex", alignItems: "center", gap: 7 }}>
              <i className={isEditMode ? "ri-edit-line" : "ri-user-add-line"} style={{ fontSize: 15, color: isEditMode ? "#2563eb" : "#16a34a" }} />
              {isEditMode ? `Edit — ${editRow?.name.split(" ")[0]}` : "New User"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              {isEditMode ? `Editing ${editRow?.employeeId}` : "Register a new platform user"}
            </div>
          </div>
          {isEditMode && (
            <button onClick={resetToAdd} title="Switch to Add mode" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18, lineHeight: 1, padding: 2 }}>
              <i className="ri-close-line" />
            </button>
          )}
        </div>

        {/* Scrollable body */}
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 11, maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}>

          {/* ── Basic Info ── */}
          {/* Full Name */}
          <div>
            <label style={IL}>Full Name <span style={{ color: "#dc2626" }}>*</span></label>
            <input value={form.name} onChange={F("name")} placeholder="e.g. Rajesh Kumar" style={INP} />
          </div>

          {/* Email */}
          <div>
            <label style={IL}>Email <span style={{ color: "#dc2626" }}>*</span></label>
            {isEditMode ? (
              <>
                <div style={{ ...INP, background: "#f9fafb", color: "#6b7280", display: "flex", alignItems: "center", gap: 8, cursor: "not-allowed", userSelect: "none" }}>
                  <i className="ri-lock-line" style={{ fontSize: 12, color: "#9ca3af", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12 }}>{form.email}</span>
                </div>
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                  <i className="ri-information-line" style={{ fontSize: 11 }} />Email is the login identifier and cannot be changed.
                </div>
              </>
            ) : (
              <input type="email" value={form.email} onChange={F("email")} placeholder="email@saveearth.in" style={INP} />
            )}
          </div>

          {/* Mobile + Employee ID */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={IL}>Mobile Number <span style={{ color: "#dc2626" }}>*</span></label>
              <input value={form.phone} onChange={F("phone")} placeholder="9876543210" maxLength={10} style={INP} />
            </div>
            <div>
              <label style={IL}>Employee ID <span style={{ color: "#dc2626" }}>*</span></label>
              <input value={form.employeeId} onChange={F("employeeId")} placeholder="e.g. 101" style={INP} />
            </div>
          </div>

          {/* Role + Designation */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={IL}>Role <span style={{ color: "#dc2626" }}>*</span></label>
              <select value={form.role} onChange={F("role")} style={INP}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={IL}>Designation</label>
              <input value={form.designation} onChange={F("designation")} placeholder="e.g. Sr. Field Auditor" style={INP} />
            </div>
          </div>

          {/* Education */}
          <div>
            <label style={IL}>Education</label>
            <input value={form.education} onChange={F("education")} placeholder="e.g. B.E. Electrical, MBA" style={INP} />
          </div>

          {/* DOB + Joining Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={IL}>Date of Birth</label>
              <input type="date" value={form.dob} onChange={F("dob")} style={INP} />
            </div>
            <div>
              <label style={IL}>Joining Date</label>
              <input type="date" value={form.joiningDate} onChange={F("joiningDate")} style={INP} />
            </div>
          </div>

          {/* ── Emergency & Medical ── */}
          <SectionLabel icon="ri-heart-pulse-line" label="Emergency & Medical" />

          {/* Blood Group */}
          <div>
            <label style={IL}>Blood Group <span style={{ color: "#dc2626" }}>*</span></label>
            <select value={form.bloodGroup} onChange={F("bloodGroup")} style={INP}>
              {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          {/* Emergency Contact Number */}
          <div>
            <label style={IL}>Emergency Contact Number <span style={{ color: "#dc2626" }}>*</span></label>
            <input value={form.emergencyContact} onChange={F("emergencyContact")} placeholder="9876500000" maxLength={10} style={INP} />
          </div>

          {/* Emergency Contact Person */}
          <div>
            <label style={IL}>Emergency Contact Person <span style={{ color: "#dc2626" }}>*</span></label>
            <input value={form.emergencyContactName} onChange={F("emergencyContactName")} placeholder="e.g. Ravi Kumar" style={INP} />
          </div>

          {/* Relation */}
          <div>
            <label style={IL}>Relation <span style={{ color: "#dc2626" }}>*</span></label>
            <select value={form.emergencyContactRelation} onChange={F("emergencyContactRelation")} style={INP}>
              {RELATIONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

        </div>

        {/* Status + footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--default-border)", background: "var(--custom-white)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={IL}>Status</label>
            <div style={{ display: "flex", border: "1px solid var(--default-border)", borderRadius: 8, overflow: "hidden" }}>
              {(["Active", "Inactive"] as const).map((s, i) => {
                const isOn = form.status === s;
                const col  = s === "Active" ? "#16a34a" : "#dc2626";
                return (
                  <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                    style={{ flex: 1, padding: "6px 4px", border: "none", borderRight: i < 1 ? "1px solid var(--default-border)" : "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: isOn ? col : "transparent", color: isOn ? "#fff" : col, transition: "all 0.15s" }}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={resetToAdd} style={{ flex: 1, padding: "9px", border: "1px solid var(--default-border)", borderRadius: 8, background: "transparent", color: "var(--default-text-color)", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
              Clear
            </button>
            <button onClick={saveUser} disabled={!form.name.trim() || !form.email.trim() || !form.employeeId.trim()}
              style={{ flex: 2, padding: "9px", border: "none", borderRadius: 8, background: (!form.name.trim() || !form.email.trim() || !form.employeeId.trim()) ? "#9ca3af" : isEditMode ? "#2563eb" : "#16a34a", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <i className={isEditMode ? "ri-save-line" : "ri-user-add-line"} />
              {isEditMode ? "UPDATE USER" : "CREATE USER"}
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <h4 style={{ fontSize: 20, fontWeight: 800, color: "var(--default-text-color)", margin: 0 }}>Users & Roles</h4>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              Dashboard <i className="ri-arrow-right-s-line" style={{ margin: "0 2px" }} />
              <span style={{ color: "var(--primary-color)" }}>Users & Roles</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={OB}><i className="ri-upload-2-line" /> Import</button>
            <button style={OB}><i className="ri-download-2-line" /> Export</button>
            <button onClick={resetToAdd} style={PB}><i className="ri-add-line" /> Add User</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: "1.25rem" }}>
          {[
            { label: "Total Users",    value: total,         icon: "ri-group-line",           color: "#15803d", bg: "#dcfce7" },
            { label: "Active",         value: active,        icon: "ri-checkbox-circle-line", color: "#16a34a", bg: "#f0fdf4" },
            { label: "Field Auditors", value: fieldAuditors, icon: "ri-walk-line",            color: "#0891b2", bg: "#dbeafe" },
            { label: "Inactive",       value: inactive,      icon: "ri-user-forbid-line",     color: "#dc2626", bg: "#fee2e2" },
          ].map(c => (
            <div key={c.label} style={{ background: "var(--custom-white)", borderRadius: 12, border: "1px solid var(--default-border)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(22,163,74,0.05)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={c.icon} style={{ fontSize: 20, color: c.color }} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: "var(--custom-white)", borderRadius: 12, border: "1px solid var(--default-border)", padding: "10px 14px", display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 180px", background: "var(--default-background)", borderRadius: 8, padding: "0 12px", border: "1px solid var(--default-border)" }}>
            <i className="ri-search-line" style={{ color: "var(--text-muted)", fontSize: 14 }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email, Employee ID…"
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, padding: "8px 0", width: "100%" }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><i className="ri-close-line" /></button>}
          </div>
          <select value={roleF}   onChange={e => { setRoleF(e.target.value);   setPage(1); }} style={{ ...inputSt, padding: "8px 12px", minWidth: 130 }}>
            {ROLES_FILTER.map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={statusF} onChange={e => { setStatusF(e.target.value); setPage(1); }} style={{ ...inputSt, padding: "8px 12px", minWidth: 120 }}>
            {STATUS_FILTER.map(o => <option key={o}>{o}</option>)}
          </select>
          {(search || roleF !== "All Roles" || statusF !== "All Status") && (
            <button onClick={() => { setSearch(""); setRoleF("All Roles"); setStatusF("All Status"); setPage(1); }}
              style={{ ...OB, padding: "7px 12px", fontSize: 12, color: "#dc2626", borderColor: "#fecaca" }}>
              <i className="ri-refresh-line" /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ background: "var(--custom-white)", borderRadius: 14, border: "1px solid var(--default-border)", overflow: "hidden", boxShadow: "0 2px 8px rgba(22,163,74,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={TH}>User</th>
                  <th style={TH}>Employee ID</th>
                  <th style={TH}>Role</th>
                  <th style={TH}>Mobile</th>
                  <th style={TH}>Blood Group</th>
                  <th style={TH}>Emergency Contact</th>
                  <th style={TH}>Joining</th>
                  <th style={TH}>Status</th>
                  <th style={{ ...TH, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
                      <i className="ri-user-search-line" style={{ fontSize: 40, display: "block", marginBottom: 8, opacity: 0.3 }} />
                      No users found
                    </td>
                  </tr>
                ) : paged.map((u, i) => {
                  const rc = ROLE_COLORS[u.role];
                  const sc = STATUS_COLORS[u.status];
                  const isBeingEdited = editRow?.id === u.id;
                  const initials = u.name.split(" ").filter(Boolean).map(w => w[0].toUpperCase()).filter((_, idx, arr) => idx === 0 || idx === arr.length - 1).join("");
                  return (
                    <tr key={u.id} style={{
                      borderTop: i > 0 ? "1px solid var(--default-border)" : undefined,
                      background: isBeingEdited ? "#eff6ff" : undefined,
                      transition: "background 0.15s",
                    }}>
                      {/* User */}
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: u.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--default-text-color)" }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{u.email}</div>
                            {u.designation && <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{u.designation}</div>}
                          </div>
                        </div>
                      </td>
                      {/* Employee ID */}
                      <td style={TD}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", background: "#f3f4f6", borderRadius: 5, padding: "2px 8px", fontFamily: "monospace" }}>{u.employeeId}</span>
                      </td>
                      {/* Role */}
                      <td style={TD}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: rc.color, background: rc.bg, borderRadius: 20, padding: "3px 10px" }}>{u.role}</span>
                      </td>
                      {/* Mobile */}
                      <td style={{ ...TD, fontSize: 12, fontFamily: "monospace", color: "var(--default-text-color)" }}>
                        {u.phone}
                      </td>
                      {/* Blood Group */}
                      <td style={TD}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#dc2626", background: "#fee2e2", borderRadius: 6, padding: "2px 8px" }}>{u.bloodGroup}</span>
                      </td>
                      {/* Emergency Contact */}
                      <td style={TD}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--default-text-color)" }}>{u.emergencyContactName}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{u.emergencyContact} · {u.emergencyContactRelation}</div>
                      </td>
                      {/* Joining */}
                      <td style={{ ...TD, fontSize: 12, color: "var(--text-muted)" }}>
                        {u.joiningDate ? new Date(u.joiningDate).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—"}
                      </td>
                      {/* Status */}
                      <td style={TD}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: sc.color, background: sc.bg, borderRadius: 20, padding: "3px 10px" }}>{u.status}</span>
                      </td>
                      {/* Actions */}
                      <td style={{ ...TD, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <Link href={`/users/${u.id}`} title="View Profile"
                            style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--default-border)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-color)", textDecoration: "none" }}>
                            <i className="ri-eye-line" style={{ fontSize: 13 }} />
                          </Link>
                          <button title="Edit" onClick={() => openEdit(u)}
                            style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${isBeingEdited ? "#bfdbfe" : "var(--default-border)"}`, background: isBeingEdited ? "#dbeafe" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}>
                            <i className="ri-edit-line" style={{ fontSize: 13 }} />
                          </button>
                          <button title="Delete" onClick={() => deleteUser(u.id)}
                            style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--default-border)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626" }}>
                            <i className="ri-delete-bin-line" style={{ fontSize: 13 }} />
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
          {totalPages > 1 && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--default-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} users
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                  style={{ padding: "5px 10px", border: "1px solid var(--default-border)", borderRadius: 7, background: "transparent", cursor: safePage === 1 ? "not-allowed" : "pointer", color: safePage === 1 ? "var(--text-muted)" : "var(--default-text-color)", fontSize: 12 }}>
                  <i className="ri-arrow-left-s-line" />
                </button>
                {pageNums().map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    style={{ padding: "5px 10px", border: "1px solid var(--default-border)", borderRadius: 7, fontSize: 12, fontWeight: n === safePage ? 700 : 400, background: n === safePage ? "var(--primary-color)" : "transparent", color: n === safePage ? "#fff" : "var(--default-text-color)", cursor: "pointer" }}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                  style={{ padding: "5px 10px", border: "1px solid var(--default-border)", borderRadius: 7, background: "transparent", cursor: safePage === totalPages ? "not-allowed" : "pointer", color: safePage === totalPages ? "var(--text-muted)" : "var(--default-text-color)", fontSize: 12 }}>
                  <i className="ri-arrow-right-s-line" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>{/* end right panel */}
    </div>
  );
}
