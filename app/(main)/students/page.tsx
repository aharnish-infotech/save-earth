"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";

// ── Dummy student data ────────────────────────────────────────────────────────
const COURSES: Record<string, string> = {
  BCA: "BCA", MCA: "MCA", BCOM: "B.Com", MCOM: "M.Com",
  BSC: "B.Sc CS", MSC: "M.Sc CS", BBA: "BBA", MBA: "MBA",
};

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"] as const;
const GENDERS = ["Male", "Female"] as const;

const RAW_STUDENTS = [
  { id: "ZF2526001", roll: "2526BCA01", name: "Rahul Kumar",      course: "BCA", sem: "Sem 3", gender: "Male",   cat: "General", doa: "2025-07-12", dob: "2005-03-14", phone: "9876543210", status: "Active" },
  { id: "ZF2526002", roll: "2526MCA01", name: "Priya Sharma",     course: "MCA", sem: "Sem 1", gender: "Female", cat: "OBC",     doa: "2025-07-14", dob: "2002-11-22", phone: "9876543211", status: "Active" },
  { id: "ZF2526003", roll: "2526BCA02", name: "Amit Verma",       course: "BCA", sem: "Sem 3", gender: "Male",   cat: "SC",      doa: "2025-07-15", dob: "2004-06-30", phone: "9876543212", status: "Active" },
  { id: "ZF2526004", roll: "2526BCM01", name: "Sneha Patel",      course: "BCOM", sem: "Sem 1", gender: "Female", cat: "General", doa: "2025-07-16", dob: "2006-01-08", phone: "9876543213", status: "Active" },
  { id: "ZF2526005", roll: "2526BBA01", name: "Arjun Singh",      course: "BBA", sem: "Sem 5", gender: "Male",   cat: "EWS",     doa: "2024-07-10", dob: "2003-09-18", phone: "9876543214", status: "Active" },
  { id: "ZF2526006", roll: "2526BSC01", name: "Anjali Mehta",     course: "BSC", sem: "Sem 3", gender: "Female", cat: "OBC",     doa: "2024-07-11", dob: "2004-05-25", phone: "9876543215", status: "Active" },
  { id: "ZF2526007", roll: "2526MBA01", name: "Vikram Joshi",     course: "MBA", sem: "Sem 2", gender: "Male",   cat: "General", doa: "2025-07-18", dob: "2000-12-03", phone: "9876543216", status: "Inactive" },
  { id: "ZF2526008", roll: "2526MCA02", name: "Neha Gupta",       course: "MCA", sem: "Sem 1", gender: "Female", cat: "ST",      doa: "2025-07-19", dob: "2001-07-17", phone: "9876543217", status: "Active" },
  { id: "ZF2526009", roll: "2526BCA03", name: "Karan Yadav",      course: "BCA", sem: "Sem 5", gender: "Male",   cat: "OBC",     doa: "2023-07-08", dob: "2004-02-28", phone: "9876543218", status: "Active" },
  { id: "ZF2526010", roll: "2526BCM02", name: "Ritu Agarwal",     course: "BCOM", sem: "Sem 3", gender: "Female", cat: "SC",      doa: "2024-07-13", dob: "2003-10-11", phone: "9876543219", status: "Detained" },
  { id: "ZF2526011", roll: "2526BBA02", name: "Deepak Nair",      course: "BBA", sem: "Sem 1", gender: "Male",   cat: "General", doa: "2025-07-20", dob: "2005-04-20", phone: "9876543220", status: "Active" },
  { id: "ZF2526012", roll: "2526MSC01", name: "Pooja Iyer",       course: "MSC", sem: "Sem 2", gender: "Female", cat: "General", doa: "2025-07-21", dob: "2001-08-15", phone: "9876543221", status: "Active" },
  { id: "ZF2526013", roll: "2526BCA04", name: "Suresh Reddy",     course: "BCA", sem: "Sem 1", gender: "Male",   cat: "ST",      doa: "2025-07-22", dob: "2006-03-07", phone: "9876543222", status: "Active" },
  { id: "ZF2526014", roll: "2526MCM01", name: "Kavita Jain",      course: "MCOM", sem: "Sem 1", gender: "Female", cat: "EWS",     doa: "2025-07-23", dob: "2002-12-19", phone: "9876543223", status: "Active" },
  { id: "ZF2526015", roll: "2526MBA02", name: "Rohan Mishra",     course: "MBA", sem: "Sem 2", gender: "Male",   cat: "OBC",     doa: "2025-07-24", dob: "1999-06-09", phone: "9876543224", status: "Active" },
  { id: "ZF2526016", roll: "2526BSC02", name: "Simran Kaur",      course: "BSC", sem: "Sem 1", gender: "Female", cat: "General", doa: "2025-07-25", dob: "2005-11-30", phone: "9876543225", status: "Active" },
  { id: "ZF2526017", roll: "2526BCA05", name: "Ajay Tiwari",      course: "BCA", sem: "Sem 3", gender: "Male",   cat: "SC",      doa: "2024-07-09", dob: "2004-07-22", phone: "9876543226", status: "Inactive" },
  { id: "ZF2526018", roll: "2526BBA03", name: "Meena Pillai",     course: "BBA", sem: "Sem 3", gender: "Female", cat: "General", doa: "2024-07-10", dob: "2003-01-05", phone: "9876543227", status: "Active" },
  { id: "ZF2526019", roll: "2526MCA03", name: "Gaurav Sharma",    course: "MCA", sem: "Sem 3", gender: "Male",   cat: "OBC",     doa: "2024-07-12", dob: "2001-09-27", phone: "9876543228", status: "Active" },
  { id: "ZF2526020", roll: "2526BCM03", name: "Asha Desai",       course: "BCOM", sem: "Sem 5", gender: "Female", cat: "EWS",     doa: "2023-07-07", dob: "2003-04-16", phone: "9876543229", status: "Active" },
];

// ── Avatar colours by initials ─────────────────────────────────────────────
const AVATAR_COLORS = ["#7c3aed","#2563eb","#059669","#d97706","#dc2626","#0891b2","#7c2d12","#065f46"];
function avatarColor(name: string) {
  let hash = 0;
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function initials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Status badge ───────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, React.CSSProperties> = {
  Active:   { background: "#dcfce7", color: "#16a34a" },
  Inactive: { background: "#fee2e2", color: "#dc2626" },
  Detained: { background: "#fef3c7", color: "#d97706" },
};

const CAT_STYLE: Record<string, React.CSSProperties> = {
  General: { background: "#ede9fe", color: "#6d28d9" },
  OBC:     { background: "#dbeafe", color: "#1d4ed8" },
  SC:      { background: "#d1fae5", color: "#065f46" },
  ST:      { background: "#ffedd5", color: "#c2410c" },
  EWS:     { background: "#fce7f3", color: "#be185d" },
};

const PAGE_SIZES = [10, 25, 50];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(() => {
    return RAW_STUDENTS.filter((s) => {
      const q = search.toLowerCase();
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q) || s.phone.includes(q);
      const matchCourse = !filterCourse || s.course === filterCourse;
      const matchStatus = !filterStatus || s.status === filterStatus;
      const matchCat    = !filterCat    || s.cat === filterCat;
      return matchQ && matchCourse && matchStatus && matchCat;
    });
  }, [search, filterCourse, filterStatus, filterCat]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const rows = filtered.slice((page - 1) * perPage, page * perPage);

  const resetPage = () => setPage(1);

  return (
    <div>
      {/* Page header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0" style={{ fontSize: 18, color: "var(--default-text-color)" }}>All Students</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: 12 }}>
              <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
              <li className="breadcrumb-item active">Students</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-light" style={{ fontSize: 12, border: "1px solid var(--default-border)" }}>
            <i className="ri-download-line me-1" /> Export
          </button>
          <button className="btn btn-sm" style={{ fontSize: 12, background: "var(--primary-color)", color: "#fff", border: "none" }}>
            <i className="ri-user-add-line me-1" /> Add Student
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-3">
        {[
          { label: "Total Students", value: RAW_STUDENTS.length, color: "#7c3aed", bg: "#ede9fe", icon: "ri-group-line" },
          { label: "Active", value: RAW_STUDENTS.filter(s => s.status === "Active").length, color: "#16a34a", bg: "#dcfce7", icon: "ri-checkbox-circle-line" },
          { label: "Inactive", value: RAW_STUDENTS.filter(s => s.status === "Inactive").length, color: "#dc2626", bg: "#fee2e2", icon: "ri-close-circle-line" },
          { label: "Detained", value: RAW_STUDENTS.filter(s => s.status === "Detained").length, color: "#d97706", bg: "#fef3c7", icon: "ri-error-warning-line" },
        ].map(stat => (
          <div key={stat.label} className="col-6 col-md-3">
            <div className="card custom-card mb-0" style={{ borderLeft: `4px solid ${stat.color}` }}>
              <div className="card-body py-3 px-3 d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={stat.icon} style={{ fontSize: 18, color: stat.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--default-text-color)", lineHeight: 1.2 }}>{stat.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main table card */}
      <div className="card custom-card mb-0">
        {/* Toolbar */}
        <div className="card-header" style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid var(--default-border)" }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            {/* Left: rows per page */}
            <div className="d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
              <span style={{ color: "var(--text-muted)" }}>Show</span>
              <select
                className="form-select form-select-sm"
                style={{ width: 65, fontSize: 12 }}
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); resetPage(); }}
              >
                {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span style={{ color: "var(--text-muted)" }}>entries</span>
            </div>

            {/* Right: filters + search */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <select className="form-select form-select-sm" style={{ width: 120, fontSize: 12 }}
                value={filterCourse} onChange={(e) => { setFilterCourse(e.target.value); resetPage(); }}>
                <option value="">All Courses</option>
                {Object.entries(COURSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select className="form-select form-select-sm" style={{ width: 110, fontSize: 12 }}
                value={filterCat} onChange={(e) => { setFilterCat(e.target.value); resetPage(); }}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="form-select form-select-sm" style={{ width: 105, fontSize: 12 }}
                value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); resetPage(); }}>
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Detained">Detained</option>
              </select>
              <div className="input-group input-group-sm" style={{ width: 210 }}>
                <span className="input-group-text bg-transparent border-end-0" style={{ fontSize: 12 }}>
                  <i className="ri-search-line" style={{ color: "var(--text-muted)" }} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search students…"
                  style={{ fontSize: 12 }}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0" style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--default-background)", borderBottom: "2px solid var(--default-border)" }}>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", whiteSpace: "nowrap" }}>Admission No</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", whiteSpace: "nowrap" }}>Roll No</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Student Name</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Course</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Semester</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Gender</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Category</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", whiteSpace: "nowrap" }}>Admission Date</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>DOB</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Status</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                      <i className="ri-search-line" style={{ fontSize: 32, display: "block", marginBottom: 8, opacity: 0.4 }} />
                      No students found
                    </td>
                  </tr>
                ) : rows.map((s) => {
                  const color = avatarColor(s.name);
                  const sts = STATUS_STYLE[s.status] || {};
                  const catSty = CAT_STYLE[s.cat] || {};
                  return (
                    <tr key={s.id}>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <Link href={`/students/${s.id}`} style={{ color: "var(--primary-color)", fontWeight: 600, textDecoration: "none", fontSize: 12 }}>
                          {s.id}
                        </Link>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{s.roll}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: color, color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700, flexShrink: 0,
                          }}>
                            {initials(s.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--default-text-color)", lineHeight: 1.2 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 500, color: "var(--default-text-color)" }}>
                        {COURSES[s.course] || s.course}
                      </td>
                      <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{s.sem}</td>
                      <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <i className={s.gender === "Male" ? "ri-men-line" : "ri-women-line"} style={{ color: s.gender === "Male" ? "#3b82f6" : "#ec4899", fontSize: 14 }} />
                          {s.gender}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ ...catSty, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4 }}>
                          {s.cat}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "var(--text-muted)", whiteSpace: "nowrap", fontSize: 12 }}>{fmtDate(s.doa)}</td>
                      <td style={{ padding: "10px 14px", color: "var(--text-muted)", whiteSpace: "nowrap", fontSize: 12 }}>{fmtDate(s.dob)}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ ...sts, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                          {s.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <Link href={`/students/${s.id}`} title="View" style={{ width: 28, height: 28, borderRadius: 6, background: "#ede9fe", color: "#7c3aed", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                            <i className="ri-eye-line" style={{ fontSize: 13 }} />
                          </Link>
                          <button title="Edit" style={{ width: 28, height: 28, borderRadius: 6, background: "#dbeafe", color: "#1d4ed8", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="ri-edit-line" style={{ fontSize: 13 }} />
                          </button>
                          <button title="Delete" style={{ width: 28, height: 28, borderRadius: 6, background: "#fee2e2", color: "#dc2626", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
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
        </div>

        {/* Pagination footer */}
        <div className="card-footer" style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--default-border)", background: "var(--custom-white)" }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Showing <strong>{filtered.length === 0 ? 0 : (page - 1) * perPage + 1}</strong> to{" "}
              <strong>{Math.min(page * perPage, filtered.length)}</strong> of{" "}
              <strong>{filtered.length}</strong> entries
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button
                className="btn btn-sm"
                style={{ fontSize: 12, padding: "4px 10px", border: "1px solid var(--default-border)", background: page === 1 ? "var(--default-background)" : "var(--custom-white)", color: "var(--default-text-color)" }}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    className="btn btn-sm"
                    style={{
                      fontSize: 12, padding: "4px 10px", minWidth: 32,
                      background: page === pg ? "var(--primary-color)" : "var(--custom-white)",
                      color: page === pg ? "#fff" : "var(--default-text-color)",
                      border: `1px solid ${page === pg ? "var(--primary-color)" : "var(--default-border)"}`,
                      fontWeight: page === pg ? 600 : 400,
                    }}
                    onClick={() => setPage(pg)}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                className="btn btn-sm"
                style={{ fontSize: 12, padding: "4px 10px", border: "1px solid var(--default-border)", background: page === totalPages ? "var(--default-background)" : "var(--custom-white)", color: "var(--default-text-color)" }}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
