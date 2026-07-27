"use client";
import React, { useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Super Admin" | "Admin" | "Coordinator" | "Field Auditor";
  designation: string;
  department: string;
  beeEaNo: string;
  electricalSupNo: string;
  zone: string;
  bank: string;
  joiningDate: string;
  status: "Active" | "Inactive" | "On Leave";
  lastActive: string;
  avatarColor: string;
}

// ── Seed Data ─────────────────────────────────────────────────────────────────
const USERS: User[] = [
  { id:"EMP-001", name:"Mukteshwar Sharma",  email:"mukteshwar@saveearth.in",  phone:"9876543210", role:"Super Admin",  designation:"Platform Owner",        department:"Management",   beeEaNo:"BEE/EA/2019/0045", electricalSupNo:"ES/GJ/2019/1122", zone:"All Zones",       bank:"All Banks",        joiningDate:"01 Mar 2019", status:"Active",   lastActive:"Today",         avatarColor:"#15803d" },
  { id:"EMP-002", name:"Priya Sharma",       email:"priya@saveearth.in",        phone:"9876543211", role:"Admin",        designation:"Operations Manager",    department:"Operations",   beeEaNo:"BEE/EA/2020/0087", electricalSupNo:"ES/GJ/2020/2345", zone:"Gujarat Circle",  bank:"SBI, BOB",         joiningDate:"15 Jun 2020", status:"Active",   lastActive:"Today",         avatarColor:"#0284c7" },
  { id:"EMP-003", name:"Amit Singh",         email:"amit@saveearth.in",         phone:"9876543212", role:"Coordinator",  designation:"Audit Coordinator",     department:"Audit Ops",    beeEaNo:"BEE/EA/2021/0134", electricalSupNo:"ES/GJ/2021/3456", zone:"SBI Gujarat",     bank:"SBI",              joiningDate:"01 Apr 2021", status:"Active",   lastActive:"Yesterday",     avatarColor:"#16a34a" },
  { id:"EMP-004", name:"Rajesh Kumar",       email:"rajesh@saveearth.in",       phone:"9876543213", role:"Field Auditor",designation:"Senior Field Auditor",  department:"Field Ops",    beeEaNo:"BEE/EA/2021/0156", electricalSupNo:"ES/GJ/2021/4567", zone:"SBI Gujarat",     bank:"SBI",              joiningDate:"15 Jul 2021", status:"Active",   lastActive:"Today",         avatarColor:"#059669" },
  { id:"EMP-005", name:"Sneha Patel",        email:"sneha@saveearth.in",        phone:"9876543214", role:"Field Auditor",designation:"Field Auditor",         department:"Field Ops",    beeEaNo:"BEE/EA/2022/0198", electricalSupNo:"ES/GJ/2022/5678", zone:"SBI Gujarat",     bank:"SBI",              joiningDate:"01 Jan 2022", status:"Active",   lastActive:"Today",         avatarColor:"#db2777" },
  { id:"EMP-006", name:"Vikas Tiwari",       email:"vikas@saveearth.in",        phone:"9876543215", role:"Field Auditor",designation:"Field Auditor",         department:"Field Ops",    beeEaNo:"BEE/EA/2022/0223", electricalSupNo:"ES/MP/2022/6789", zone:"BOB Madhya Pradesh",bank:"Bank of Baroda",   joiningDate:"15 Mar 2022", status:"Active",   lastActive:"2 days ago",    avatarColor:"#ea580c" },
  { id:"EMP-007", name:"Divya Mehta",        email:"divya@saveearth.in",        phone:"9876543216", role:"Field Auditor",designation:"Field Auditor",         department:"Field Ops",    beeEaNo:"BEE/EA/2022/0267", electricalSupNo:"ES/WB/2022/7890", zone:"UCO East Zone",   bank:"UCO Bank",         joiningDate:"01 Jun 2022", status:"Active",   lastActive:"Today",         avatarColor:"#0891b2" },
  { id:"EMP-008", name:"Arjun Yadav",        email:"arjun@saveearth.in",        phone:"9876543217", role:"Field Auditor",designation:"Jr. Field Auditor",     department:"Field Ops",    beeEaNo:"BEE/EA/2023/0312", electricalSupNo:"ES/GJ/2023/8901", zone:"SBI Gujarat",     bank:"SBI",              joiningDate:"01 Feb 2023", status:"Active",   lastActive:"Today",         avatarColor:"#ca8a04" },
  { id:"EMP-009", name:"Sunita Verma",       email:"sunita@saveearth.in",       phone:"9876543218", role:"Coordinator",  designation:"Audit Coordinator",     department:"Audit Ops",    beeEaNo:"BEE/EA/2021/0145", electricalSupNo:"ES/RJ/2021/9012", zone:"PNB Rajasthan",   bank:"PNB",              joiningDate:"15 Sep 2021", status:"On Leave", lastActive:"5 days ago",    avatarColor:"#8b5cf6" },
  { id:"EMP-010", name:"Karan Joshi",        email:"karan@saveearth.in",        phone:"9876543219", role:"Field Auditor",designation:"Field Auditor",         department:"Field Ops",    beeEaNo:"BEE/EA/2023/0356", electricalSupNo:"ES/GJ/2023/0123", zone:"SBI MP",          bank:"SBI",              joiningDate:"15 May 2023", status:"Inactive", lastActive:"3 weeks ago",   avatarColor:"#374151" },
  { id:"EMP-011", name:"Pooja Gupta",        email:"pooja@saveearth.in",        phone:"9876543220", role:"Admin",        designation:"Admin Officer",         department:"Operations",   beeEaNo:"N/A",              electricalSupNo:"N/A",             zone:"All Zones",       bank:"All Banks",        joiningDate:"01 Aug 2022", status:"Active",   lastActive:"Today",         avatarColor:"#16a34a" },
  { id:"EMP-012", name:"Deepak Nair",        email:"deepak@saveearth.in",       phone:"9876543221", role:"Field Auditor",designation:"Sr. Field Auditor",     department:"Field Ops",    beeEaNo:"BEE/EA/2020/0099", electricalSupNo:"ES/MH/2020/1234", zone:"Canara Maharashtra",bank:"Canara Bank",      joiningDate:"01 Nov 2020", status:"Active",   lastActive:"Yesterday",     avatarColor:"#dc2626" },
];

const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  "Super Admin":  { color: "#15803d", bg: "#dcfce7" },
  "Admin":        { color: "#0284c7", bg: "#dbeafe" },
  "Coordinator":  { color: "#ca8a04", bg: "#fef9c3" },
  "Field Auditor":{ color: "#374151", bg: "#f3f4f6" },
};

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  "Active":   { color: "#16a34a", bg: "#dcfce7" },
  "Inactive": { color: "#dc2626", bg: "#fee2e2" },
  "On Leave": { color: "#ca8a04", bg: "#fef9c3" },
};

const ROLES_FILTER = ["All Roles", "Super Admin", "Admin", "Coordinator", "Field Auditor"];
const STATUS_FILTER = ["All Status", "Active", "Inactive", "On Leave"];
const BANKS_FILTER  = ["All Banks", "SBI", "Bank of Baroda", "UCO Bank", "PNB", "Canara Bank"];
const PAGE_SIZE = 10;

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputSt: React.CSSProperties = {
  border:"1px solid var(--default-border)", borderRadius:8, padding:"7px 12px",
  fontSize:13, color:"var(--default-text-color)", background:"var(--custom-white)", outline:"none",
};
const PB: React.CSSProperties = {
  display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px",
  background:"var(--primary-color,#16a34a)", color:"#fff", border:"none",
  borderRadius:9, fontWeight:700, fontSize:13, cursor:"pointer", textDecoration:"none",
};
const OB: React.CSSProperties = {
  display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px",
  background:"var(--custom-white)", color:"var(--default-text-color)",
  border:"1px solid var(--default-border)", borderRadius:9, fontWeight:600,
  fontSize:13, cursor:"pointer",
};
const TH: React.CSSProperties = {
  padding:"10px 14px", fontSize:11, fontWeight:700, color:"#6b7280",
  textTransform:"uppercase", letterSpacing:"0.04em", borderBottom:"2px solid #dcfce7",
  whiteSpace:"nowrap", background:"#f9fafb",
};
const TD: React.CSSProperties = { padding:"11px 14px", verticalAlign:"middle", fontSize:13 };

// ── Modal form ────────────────────────────────────────────────────────────────
type FormData = {
  name:string; email:string; phone:string; role:string; designation:string;
  department:string; beeEaNo:string; electricalSupNo:string; zone:string;
  bank:string; joiningDate:string; status:string;
};
const EMPTY_FORM: FormData = {
  name:"", email:"", phone:"", role:"Field Auditor", designation:"",
  department:"Field Ops", beeEaNo:"", electricalSupNo:"", zone:"",
  bank:"", joiningDate:"", status:"Active",
};

function Modal({ form, setForm, onClose, onSave, editing }: {
  form: FormData; setForm: (f: FormData) => void;
  onClose: () => void; onSave: () => void; editing: boolean;
}) {
  const F = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });
  const IL: React.CSSProperties = { fontSize:11, fontWeight:700, color:"var(--text-muted)", display:"block", marginBottom:4 };
  const INP: React.CSSProperties = { ...inputSt, width:"100%", boxSizing:"border-box" };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"var(--custom-white)", borderRadius:16, width:700, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h3 style={{ fontSize:17, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>
              {editing ? "Edit User" : "Add New User"}
            </h3>
            <p style={{ fontSize:12, color:"var(--text-muted)", margin:"3px 0 0" }}>
              {editing ? "Update employee details and access level" : "Register a new platform user"}
            </p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"var(--text-muted)" }}>
            <i className="ri-close-line" />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding:"24px", display:"flex", flexDirection:"column", gap:16 }}>
          {/* Row 1 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div><label style={IL}>Full Name *</label><input value={form.name} onChange={F("name")} placeholder="e.g. Rajesh Kumar" style={INP} /></div>
            <div><label style={IL}>Email *</label><input type="email" value={form.email} onChange={F("email")} placeholder="email@saveearth.in" style={INP} /></div>
          </div>
          {/* Row 2 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
            <div><label style={IL}>Phone</label><input value={form.phone} onChange={F("phone")} placeholder="9876543210" style={INP} /></div>
            <div>
              <label style={IL}>Role *</label>
              <select value={form.role} onChange={F("role")} style={INP}>
                {["Super Admin","Admin","Coordinator","Field Auditor"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={IL}>Status</label>
              <select value={form.status} onChange={F("status")} style={INP}>
                {["Active","Inactive","On Leave"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {/* Row 3 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div><label style={IL}>Designation</label><input value={form.designation} onChange={F("designation")} placeholder="e.g. Senior Field Auditor" style={INP} /></div>
            <div>
              <label style={IL}>Department</label>
              <select value={form.department} onChange={F("department")} style={INP}>
                {["Management","Operations","Audit Ops","Field Ops","Finance","HR"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          {/* Divider */}
          <div style={{ borderTop:"1px dashed var(--default-border)", paddingTop:4 }}>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--primary-color)", margin:"0 0 12px", textTransform:"uppercase", letterSpacing:"0.06em" }}>
              <i className="ri-award-line" style={{ marginRight:5 }} />Electrical Credentials
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div><label style={IL}>BEE EA Number</label><input value={form.beeEaNo} onChange={F("beeEaNo")} placeholder="BEE/EA/2023/XXXX" style={INP} /></div>
              <div><label style={IL}>Electrical Supervisor No.</label><input value={form.electricalSupNo} onChange={F("electricalSupNo")} placeholder="ES/GJ/2023/XXXX" style={INP} /></div>
            </div>
          </div>
          {/* Row 5 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
            <div><label style={IL}>Assigned Zone</label><input value={form.zone} onChange={F("zone")} placeholder="e.g. SBI Gujarat" style={INP} /></div>
            <div>
              <label style={IL}>Primary Bank</label>
              <select value={form.bank} onChange={F("bank")} style={INP}>
                <option value="">Select Bank</option>
                {["All Banks","SBI","Bank of Baroda","UCO Bank","PNB","Canara Bank"].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div><label style={IL}>Joining Date</label><input type="date" value={form.joiningDate} onChange={F("joiningDate")} style={INP} /></div>
          </div>
        </div>
        {/* Footer */}
        <div style={{ padding:"16px 24px", borderTop:"1px solid var(--default-border)", display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={OB}>Cancel</button>
          <button onClick={onSave} style={PB}>
            <i className="ri-save-line" /> {editing ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers]       = useState<User[]>(USERS);
  const [search, setSearch]     = useState("");
  const [roleF,  setRoleF]      = useState("All Roles");
  const [statusF,setStatusF]    = useState("All Status");
  const [bankF,  setBankF]      = useState("All Banks");
  const [page,   setPage]       = useState(1);
  const [modal,  setModal]      = useState(false);
  const [editing,setEditing]    = useState<User | null>(null);
  const [form,   setForm]       = useState<FormData>(EMPTY_FORM);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const mQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || u.beeEaNo.toLowerCase().includes(q);
    const mR = roleF   === "All Roles"   || u.role   === roleF;
    const mS = statusF === "All Status"  || u.status === statusF;
    const mB = bankF   === "All Banks"   || u.bank.includes(bankF);
    return mQ && mR && mS && mB;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const clearF     = () => { setSearch(""); setRoleF("All Roles"); setStatusF("All Status"); setBankF("All Banks"); setPage(1); };
  const hasFilter  = search || roleF !== "All Roles" || statusF !== "All Status" || bankF !== "All Banks";

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name:u.name, email:u.email, phone:u.phone, role:u.role, designation:u.designation, department:u.department, beeEaNo:u.beeEaNo, electricalSupNo:u.electricalSupNo, zone:u.zone, bank:u.bank, joiningDate:u.joiningDate, status:u.status });
    setModal(true);
  };
  const saveUser = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...form, role: form.role as User["role"], status: form.status as User["status"] } : u));
    } else {
      const newUser: User = { id:`EMP-${String(users.length + 1).padStart(3,"0")}`, ...form, role:form.role as User["role"], status:form.status as User["status"], lastActive:"Just now", avatarColor:"#16a34a" };
      setUsers(prev => [newUser, ...prev]);
    }
    setModal(false);
  };
  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));

  // Stats
  const total      = users.length;
  const active     = users.filter(u => u.status === "Active").length;
  const fieldAuditors = users.filter(u => u.role === "Field Auditor").length;
  const onLeave    = users.filter(u => u.status === "On Leave").length;

  const pageNums = () => {
    const nums: number[] = [];
    for (let i = Math.max(1, safePage - 2); i <= Math.min(totalPages, safePage + 2); i++) nums.push(i);
    return nums;
  };

  return (
    <div style={{ padding:"1.5rem 0" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <div>
          <h4 style={{ fontSize:20, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>Users & Roles</h4>
          <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>
            <span>Dashboard</span><i className="ri-arrow-right-s-line" style={{ margin:"0 4px" }}/><span style={{ color:"var(--primary-color)" }}>Users & Roles</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={OB}><i className="ri-upload-2-line" /> Import</button>
          <button style={OB}><i className="ri-download-2-line" /> Export</button>
          <button onClick={openAdd} style={PB as React.CSSProperties}><i className="ri-add-line" /> Add User</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:"1.25rem" }}>
        {[
          { label:"Total Users",     value:total,        icon:"ri-group-line",            color:"#15803d", bg:"#dcfce7" },
          { label:"Active",          value:active,       icon:"ri-checkbox-circle-line",  color:"#16a34a", bg:"#dcfce7" },
          { label:"Field Auditors",  value:fieldAuditors,icon:"ri-walk-line",             color:"#0891b2", bg:"#dbeafe" },
          { label:"On Leave",        value:onLeave,      icon:"ri-calendar-close-line",   color:"#ca8a04", bg:"#fef9c3" },
        ].map(c => (
          <div key={c.label} style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", padding:"14px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 2px 8px rgba(22,163,74,0.05)" }}>
            <div style={{ width:42, height:42, borderRadius:10, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={c.icon} style={{ fontSize:20, color:c.color }}/>
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
              <div style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600, marginTop:2 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background:"var(--custom-white)", borderRadius:12, border:"1px solid var(--default-border)", padding:"12px 16px", display:"flex", gap:10, alignItems:"center", marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flex:"1 1 200px", background:"var(--default-background)", borderRadius:8, padding:"0 12px", border:"1px solid var(--default-border)" }}>
          <i className="ri-search-line" style={{ color:"var(--text-muted)", fontSize:14 }}/>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, ID, BEE EA No…" style={{ border:"none", background:"transparent", outline:"none", fontSize:13, padding:"8px 0", width:"100%" }}/>
          {search && <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)" }}><i className="ri-close-line"/></button>}
        </div>
        {[
          { val:roleF,   set:(v:string) => { setRoleF(v); setPage(1); },   opts:ROLES_FILTER  },
          { val:statusF, set:(v:string) => { setStatusF(v); setPage(1); }, opts:STATUS_FILTER },
          { val:bankF,   set:(v:string) => { setBankF(v); setPage(1); },   opts:BANKS_FILTER  },
        ].map((f, i) => (
          <select key={i} value={f.val} onChange={e => f.set(e.target.value)}
            style={{ ...inputSt, padding:"8px 12px", minWidth:140 }}>
            {f.opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
        {hasFilter && <button onClick={clearF} style={{ ...OB, padding:"7px 12px", fontSize:12, color:"#dc2626", borderColor:"#fecaca" }}><i className="ri-refresh-line"/> Clear</button>}
      </div>

      {/* Table */}
      <div style={{ background:"var(--custom-white)", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 2px 8px rgba(22,163,74,0.05)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                <th style={TH}>User</th>
                <th style={TH}>Role</th>
                <th style={TH}>BEE EA No.</th>
                <th style={TH}>Zone / Bank</th>
                <th style={TH}>Joining</th>
                <th style={TH}>Last Active</th>
                <th style={TH}>Status</th>
                <th style={{ ...TH, textAlign:"center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={8} style={{ padding:"60px 24px", textAlign:"center", color:"var(--text-muted)" }}>
                  <i className="ri-user-search-line" style={{ fontSize:40, display:"block", marginBottom:8, opacity:0.3 }}/>
                  No users found
                </td></tr>
              ) : paged.map((u, i) => {
                const rc = ROLE_COLORS[u.role];
                const sc = STATUS_COLORS[u.status];
                return (
                  <tr key={u.id} style={{ borderTop: i > 0 ? "1px solid var(--default-border)" : undefined }}>
                    <td style={TD}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:u.avatarColor, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:700, flexShrink:0 }}>
                          {u.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <Link href={`/users/${u.id}`} style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)", textDecoration:"none" }}>{u.name}</Link>
                          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:1 }}>{u.email}</div>
                          <div style={{ fontSize:10, color:"var(--text-muted)", fontFamily:"monospace" }}>{u.id} · {u.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td style={TD}>
                      <span style={{ fontSize:11, fontWeight:700, color:rc.color, background:rc.bg, borderRadius:20, padding:"3px 10px" }}>{u.role}</span>
                    </td>
                    <td style={TD}>
                      <span style={{ fontSize:11, fontFamily:"monospace", fontWeight:600, color:"#374151" }}>{u.beeEaNo !== "N/A" ? u.beeEaNo : <span style={{ color:"var(--text-muted)" }}>—</span>}</span>
                    </td>
                    <td style={TD}>
                      <div style={{ fontSize:12, fontWeight:600, color:"var(--default-text-color)" }}>{u.zone}</div>
                      <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:1 }}>{u.bank}</div>
                    </td>
                    <td style={{ ...TD, fontSize:12, color:"var(--text-muted)" }}>{u.joiningDate}</td>
                    <td style={TD}>
                      <span style={{ fontSize:12, color: u.lastActive === "Today" ? "#16a34a" : "var(--text-muted)", fontWeight: u.lastActive === "Today" ? 700 : 400 }}>
                        {u.lastActive === "Today" && <i className="ri-radio-button-line" style={{ fontSize:10, marginRight:4, color:"#16a34a" }}/>}
                        {u.lastActive}
                      </span>
                    </td>
                    <td style={TD}>
                      <span style={{ fontSize:11, fontWeight:600, color:sc.color, background:sc.bg, borderRadius:20, padding:"3px 10px" }}>{u.status}</span>
                    </td>
                    <td style={{ ...TD, textAlign:"center" }}>
                      <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                        <Link href={`/users/${u.id}`} title="View Profile" style={{ width:28, height:28, borderRadius:7, border:"1px solid var(--default-border)", background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--primary-color)", textDecoration:"none" }}>
                          <i className="ri-eye-line" style={{ fontSize:13 }}/>
                        </Link>
                        <button title="Edit" onClick={() => openEdit(u)} style={{ width:28, height:28, borderRadius:7, border:"1px solid var(--default-border)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#2563eb" }}>
                          <i className="ri-edit-line" style={{ fontSize:13 }}/>
                        </button>
                        <button title="Delete" onClick={() => deleteUser(u.id)} style={{ width:28, height:28, borderRadius:7, border:"1px solid var(--default-border)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}>
                          <i className="ri-delete-bin-line" style={{ fontSize:13 }}/>
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
          <div style={{ padding:"12px 16px", borderTop:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"var(--text-muted)" }}>
              Showing {(safePage-1)*PAGE_SIZE+1}–{Math.min(safePage*PAGE_SIZE, filtered.length)} of {filtered.length} users
            </span>
            <div style={{ display:"flex", gap:4 }}>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage===1} style={{ padding:"5px 10px", border:"1px solid var(--default-border)", borderRadius:7, background:"transparent", cursor:safePage===1?"not-allowed":"pointer", color:safePage===1?"var(--text-muted)":"var(--default-text-color)", fontSize:12 }}>
                <i className="ri-arrow-left-s-line"/>
              </button>
              {pageNums().map(n => (
                <button key={n} onClick={() => setPage(n)} style={{ padding:"5px 10px", border:"1px solid var(--default-border)", borderRadius:7, fontSize:12, fontWeight:n===safePage?700:400, background:n===safePage?"var(--primary-color)":"transparent", color:n===safePage?"#fff":"var(--default-text-color)", cursor:"pointer" }}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage===totalPages} style={{ padding:"5px 10px", border:"1px solid var(--default-border)", borderRadius:7, background:"transparent", cursor:safePage===totalPages?"not-allowed":"pointer", color:safePage===totalPages?"var(--text-muted)":"var(--default-text-color)", fontSize:12 }}>
                <i className="ri-arrow-right-s-line"/>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && <Modal form={form} setForm={setForm} onClose={() => setModal(false)} onSave={saveUser} editing={!!editing}/>}
    </div>
  );
}
