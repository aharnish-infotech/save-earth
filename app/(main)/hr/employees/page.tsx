"use client";
import React, { useState } from "react";
import Link from "next/link";

interface Employee {
  id: string; name: string; avatar: string; designation: string; department: string;
  email: string; role: string; reportingTo: string; status: "Active" | "Inactive";
  joining: string; longStanding?: boolean;
}

const EMPLOYEES: Employee[] = [
  { id:"EMP-001", name:"Mukteshwar Sharma", avatar:"MS", designation:"CEO & Founder",   department:"Management", email:"mukteshwar@zeroform.in",  role:"Super Admin",    reportingTo:"—",               status:"Active", joining:"01 Jan 2022", longStanding:true  },
  { id:"EMP-002", name:"Akash Rai",         avatar:"AR", designation:"Sr. Developer",   department:"Technology", email:"akash@zeroform.in",       role:"Developer",      reportingTo:"Mukteshwar Sharma",status:"Active", joining:"15 Mar 2022", longStanding:true  },
  { id:"EMP-003", name:"Harsh Mishra",      avatar:"HM", designation:"Trainee",         department:"Technology", email:"harsh@zeroform.in",       role:"Viewer",         reportingTo:"Akash Rai",        status:"Active", joining:"01 Jun 2025"  },
  { id:"EMP-004", name:"Sanjana Goldar",    avatar:"SG", designation:"Intern",          department:"HR",         email:"sanjana@zeroform.in",     role:"Viewer",         reportingTo:"Mukteshwar Sharma",status:"Active", joining:"15 Jan 2026"  },
  { id:"EMP-005", name:"Geeta Rajpoot",     avatar:"GR", designation:"Sr. Developer",   department:"Technology", email:"geeta@zeroform.in",       role:"Developer",      reportingTo:"Akash Rai",        status:"Active", joining:"10 Apr 2023", longStanding:true  },
  { id:"EMP-006", name:"Bhagvendra Singh",  avatar:"BS", designation:"Sr. Developer",   department:"Technology", email:"bhagvendra@zeroform.in",  role:"Developer",      reportingTo:"Akash Rai",        status:"Active", joining:"22 Jul 2023"  },
  { id:"EMP-007", name:"Pooja Singh",       avatar:"PS", designation:"HR Manager",      department:"HR",         email:"pooja@zeroform.in",       role:"HR Manager",     reportingTo:"Mukteshwar Sharma",status:"Active", joining:"05 Feb 2022", longStanding:true  },
  { id:"EMP-008", name:"Rahul Verma",       avatar:"RV", designation:"Accountant",      department:"Finance",    email:"rahul@zeroform.in",       role:"Accountant",     reportingTo:"Mukteshwar Sharma",status:"Inactive",joining:"12 Sep 2024"  },
];

const ROLES     = ["All Roles","Super Admin","Developer","HR Manager","Accountant","Viewer"];
const DESGS     = ["All Designations","CEO & Founder","Sr. Developer","HR Manager","Trainee","Intern","Accountant"];
const AVATAR_COLORS = ["#4f46e5","#7c3aed","#0284c7","#16a34a","#dc2626","#db2777","#ea580c","#ca8a04"];

export default function EmployeesPage() {
  const [search,  setSearch]  = useState("");
  const [role,    setRole]    = useState("All Roles");
  const [desg,    setDesg]    = useState("All Designations");
  const [selected,setSelected]= useState<Set<string>>(new Set());
  const [openMenu,setOpenMenu]= useState<string|null>(null);

  const filtered = EMPLOYEES.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
    const matchR = role === "All Roles" || e.role === role;
    const matchD = desg === "All Designations" || e.designation === desg;
    return matchQ && matchR && matchD;
  });

  const allSelected = filtered.length > 0 && filtered.every(e => selected.has(e.id));
  const toggleAll   = () => setSelected(prev => {
    const next = new Set(prev);
    if (allSelected) filtered.forEach(e => next.delete(e.id));
    else filtered.forEach(e => next.add(e.id));
    return next;
  });

  return (
    <div style={{ padding: "1.5rem 0" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h4 style={{ fontSize: 20, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Employees</h4>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            <span>Home</span><i className="ri-arrow-right-s-line" style={{ margin: "0 4px" }} />
            <span>HR</span><i className="ri-arrow-right-s-line" style={{ margin: "0 4px" }} />
            <span style={{ color: "#4f46e5" }}>Employees</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={outlineBtn}><i className="ri-user-shared-line" /> Invite Employee</button>
          <button style={outlineBtn}><i className="ri-upload-2-line" /> Import</button>
          <button style={outlineBtn}><i className="ri-download-2-line" /> Export</button>
          <Link href="/hr/employees/new" style={primaryBtn}><i className="ri-add-line" /> Add Employee</Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3" style={{ marginBottom: "1.25rem" }}>
        {[
          { label: "Total Employees", value: EMPLOYEES.length,                              icon: "ri-group-line",           color: "#4f46e5", bg: "#ede9fe" },
          { label: "Active",          value: EMPLOYEES.filter(e=>e.status==="Active").length,icon: "ri-checkbox-circle-line", color: "#16a34a", bg: "#dcfce7" },
          { label: "Inactive",        value: EMPLOYEES.filter(e=>e.status==="Inactive").length,icon:"ri-close-circle-line",  color: "#dc2626", bg: "#fee2e2" },
          { label: "Long Standing",   value: EMPLOYEES.filter(e=>e.longStanding).length,   icon: "ri-medal-line",           color: "#ca8a04", bg: "#fef9c3" },
        ].map(c => (
          <div key={c.label} className="col">
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede9fe", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(79,70,229,0.06)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={c.icon} style={{ fontSize: 20, color: c.color }} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginTop: 2 }}>{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Table Card */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ede9fe", boxShadow: "0 2px 12px rgba(79,70,229,0.06)", overflow: "hidden" }}>

        {/* Filter Bar */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" as const }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <i className="ri-search-line" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..."
              style={{ width: "100%", padding: "7px 10px 7px 32px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 12, outline: "none", background: "#fafafa" }} />
          </div>
          <select value={desg} onChange={e => setDesg(e.target.value)} style={selStyle}>
            {DESGS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={role} onChange={e => setRole(e.target.value)} style={selStyle}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          {(search || role !== "All Roles" || desg !== "All Designations") && (
            <button onClick={() => { setSearch(""); setRole("All Roles"); setDesg("All Designations"); }}
              style={{ fontSize: 12, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              <i className="ri-close-line" /> Clear
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>
            Showing {filtered.length} of {EMPLOYEES.length} employees
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9f9fb" }}>
                <th style={TH}><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor: "#7c3aed" }} /></th>
                <th style={{ ...TH, textAlign: "left" }}>Employee</th>
                <th style={{ ...TH, textAlign: "left" }}>Email</th>
                <th style={{ ...TH, textAlign: "left" }}>User Role</th>
                <th style={{ ...TH, textAlign: "left" }}>Reporting To</th>
                <th style={{ ...TH, textAlign: "center" }}>Status</th>
                <th style={{ ...TH, textAlign: "center" }}>Joining Date</th>
                <th style={{ ...TH, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, idx) => {
                const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                return (
                  <tr key={emp.id} style={{ borderTop: "1px solid #f3f4f6", background: selected.has(emp.id) ? "#faf5ff" : "transparent" }}
                    onMouseEnter={e => { if (!selected.has(emp.id)) (e.currentTarget as HTMLTableRowElement).style.background = "#fafafa"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = selected.has(emp.id) ? "#faf5ff" : "transparent"; }}>
                    <td style={{ ...TD, textAlign: "center", width: 40 }}>
                      <input type="checkbox" checked={selected.has(emp.id)} onChange={() => setSelected(prev => { const n = new Set(prev); n.has(emp.id) ? n.delete(emp.id) : n.add(emp.id); return n; })} style={{ accentColor: "#7c3aed" }} />
                    </td>
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{emp.avatar}</div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontWeight: 700, color: "#1e1b4b" }}>{emp.name}</span>
                            {emp.longStanding && <span style={{ fontSize: 10, fontWeight: 700, color: "#ca8a04", background: "#fef9c3", borderRadius: 20, padding: "1px 7px" }}>Long Standing</span>}
                          </div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{emp.designation} · {emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={TD}><span style={{ color: "#374151" }}>{emp.email}</span></td>
                    <td style={TD}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#4f46e5", background: "#ede9fe", borderRadius: 6, padding: "2px 10px" }}>
                        <i className="ri-shield-user-line" style={{ fontSize: 12 }} />{emp.role}
                      </span>
                    </td>
                    <td style={TD}><span style={{ color: "#6b7280" }}>{emp.reportingTo}</span></td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: emp.status === "Active" ? "#16a34a" : "#dc2626", background: emp.status === "Active" ? "#dcfce7" : "#fee2e2", borderRadius: 20, padding: "2px 10px" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: emp.status === "Active" ? "#16a34a" : "#dc2626", display: "inline-block" }} />
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ ...TD, textAlign: "center", color: "#6b7280" }}>{emp.joining}</td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button onClick={() => setOpenMenu(openMenu === emp.id ? null : emp.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 6, color: "#6b7280", fontSize: 18 }}>
                          <i className="ri-more-2-line" />
                        </button>
                        {openMenu === emp.id && (
                          <div style={{ position: "absolute", right: 0, top: "100%", zIndex: 100, background: "#fff", border: "1px solid #ede9fe", borderRadius: 10, boxShadow: "0 8px 24px rgba(79,70,229,0.12)", minWidth: 160, padding: "4px 0" }}>
                            {[
                              { icon: "ri-eye-line",          label: "View Profile" },
                              { icon: "ri-edit-line",         label: "Edit Details" },
                              { icon: "ri-calendar-check-line",label:"Attendance" },
                              { icon: "ri-delete-bin-6-line", label: "Remove",        danger: true },
                            ].map(a => (
                              <button key={a.label} onClick={() => setOpenMenu(null)}
                                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: (a as { danger?: boolean }).danger ? "#dc2626" : "#374151", fontWeight: 500, textAlign: "left" as const }}>
                                <i className={a.icon} />{a.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
                  <i className="ri-search-line" style={{ fontSize: 32, display: "block", marginBottom: 8 }} />
                  No employees found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>Showing 1 to {filtered.length} of {EMPLOYEES.length} entries</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["Prev","1","Next"].map(p => (
              <button key={p} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: p==="1"?"#4f46e5":"#fff", color: p==="1"?"#fff":"#6b7280", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TH: React.CSSProperties = { padding: "10px 14px", fontWeight: 700, fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", borderBottom: "2px solid #ede9fe" };
const TD: React.CSSProperties = { padding: "12px 14px", verticalAlign: "middle", whiteSpace: "nowrap" };
const selStyle: React.CSSProperties = { padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 12, color: "#374151", background: "#fafafa", cursor: "pointer", outline: "none" };
const outlineBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #ede9fe", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none" };
const primaryBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none" };
