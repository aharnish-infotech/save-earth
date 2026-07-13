"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";

// ── Constants ─────────────────────────────────────────────────────────────────
const COURSES: Record<string, string> = {
  BCA: "BCA", MCA: "MCA", BCOM: "B.Com", MCOM: "M.Com",
  BSC: "B.Sc CS", MSC: "M.Sc CS", BBA: "BBA", MBA: "MBA",
};

const COURSE_KEYS = Object.keys(COURSES) as (keyof typeof COURSES)[];

const COURSE_SEMS: Record<string, string[]> = {
  BCA:  ["Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Sem 6"],
  MCA:  ["Sem 1","Sem 2","Sem 3","Sem 4"],
  BCOM: ["Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Sem 6"],
  MCOM: ["Sem 1","Sem 2","Sem 3","Sem 4"],
  BSC:  ["Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Sem 6"],
  MSC:  ["Sem 1","Sem 2","Sem 3","Sem 4"],
  BBA:  ["Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Sem 6"],
  MBA:  ["Sem 1","Sem 2","Sem 3","Sem 4"],
};

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"] as const;
const CAT_WEIGHTS = [35, 28, 17, 12, 8]; // realistic distribution

const STATUSES = ["Active", "Active", "Active", "Active", "Active", "Inactive", "Detained"];

const FIRST_NAMES = [
  "Rahul","Priya","Amit","Sneha","Arjun","Anjali","Vikram","Neha","Karan","Ritu",
  "Deepak","Pooja","Suresh","Kavita","Rohan","Simran","Ajay","Meena","Gaurav","Asha",
  "Sanjay","Divya","Anil","Rekha","Vijay","Sunita","Manoj","Geeta","Rajesh","Anita",
  "Sachin","Savita","Vishal","Nisha","Aakash","Preeti","Mohit","Swati","Nikhil","Kajal",
  "Ravi","Seema","Akash","Manisha","Sunil","Bharti","Kapil","Jyoti","Vivek","Reena",
  "Rahul","Shruti","Hemant","Komal","Yash","Pallavi","Tushar","Shweta","Saurabh","Ankita",
  "Abhinav","Vandana","Varun","Tanvi","Mayank","Rupal","Pranav","Madhuri","Harshit","Sapna",
  "Kunal","Rashmi","Rohit","Mansi","Sumit","Sonal","Neeraj","Nidhi","Vikas","Poornima",
  "Dinesh","Meenakshi","Shyam","Usha","Gopal","Lata","Ramesh","Saroj","Naresh","Kamla",
  "Ashish","Namrata","Yogesh","Archana","Lokesh","Sheetal","Lalit","Radha","Pankaj","Renu",
];

const LAST_NAMES = [
  "Kumar","Sharma","Verma","Patel","Singh","Mehta","Joshi","Gupta","Yadav","Agarwal",
  "Nair","Iyer","Reddy","Jain","Mishra","Kaur","Tiwari","Pillai","Desai","Agarwal",
  "Bhatt","Chauhan","Dubey","Pandey","Srivastava","Bajaj","Malhotra","Kapoor","Khanna","Bansal",
  "Chandra","Bose","Das","Roy","Sen","Ghosh","Chatterjee","Mukherjee","Dey","Pal",
  "Naidu","Rao","Murthy","Swamy","Gowda","Hegde","Kamath","Shetty","Bhat","Pai",
  "Garg","Goyal","Jindal","Mittal","Aggarwal","Khandelwal","Saini","Meena","Gurjar","Jat",
];

// ── Seeded random (reproducible) ─────────────────────────────────────────────
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Generate students ─────────────────────────────────────────────────────────
function generateStudents(count: number) {
  const rand = seededRand(42);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const pickWeighted = (items: readonly string[], weights: number[]) => {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = rand() * total;
    for (let i = 0; i < items.length; i++) { r -= weights[i]; if (r <= 0) return items[i]; }
    return items[items.length - 1];
  };

  const students: { id:string; roll:string; name:string; course:string; sem:string; gender:string; cat:string; doa:string; dob:string; phone:string; status:string; }[] = [];
  const courseCounters: Record<string, number> = {};
  COURSE_KEYS.forEach(k => { courseCounters[k] = 0; });

  // Academic years (spread across 3 years)
  const doaYears = [2023, 2024, 2025];

  for (let i = 1; i <= count; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName  = pick(LAST_NAMES);
    const name      = `${firstName} ${lastName}`;
    const gender    = rand() < 0.52 ? "Male" : "Female";
    const course    = pick(COURSE_KEYS);
    courseCounters[course]++;
    const sems      = COURSE_SEMS[course];
    const sem       = pick(sems);
    const cat       = pickWeighted(CATEGORIES, CAT_WEIGHTS);
    const status    = pick(STATUSES);

    const doaYear   = pick(doaYears);
    const doaMonth  = Math.floor(rand() * 4) + 6; // Jun–Sep admissions
    const doaDay    = Math.floor(rand() * 28) + 1;
    const doa       = `${doaYear}-${String(doaMonth).padStart(2,"0")}-${String(doaDay).padStart(2,"0")}`;

    const dobYear   = Math.floor(rand() * 8) + 1999; // 1999–2006
    const dobMonth  = Math.floor(rand() * 12) + 1;
    const dobDay    = Math.floor(rand() * 28) + 1;
    const dob       = `${dobYear}-${String(dobMonth).padStart(2,"0")}-${String(dobDay).padStart(2,"0")}`;

    const phone     = `${pick(["7","8","9"])}${String(Math.floor(rand() * 900000000) + 100000000)}`;

    // Roll number: YYCOURSE+counter
    const yy        = String(doaYear).slice(2) + String(doaYear + 1).slice(2);
    const rollCode  = course === "BCOM" ? "BCM" : course === "MCOM" ? "MCM" : course;
    const roll      = `${yy}${rollCode}${String(courseCounters[course]).padStart(2,"0")}`;
    const id        = `ZF${yy}${String(i).padStart(3,"0")}`;

    students.push({ id, roll, name, course, sem, gender, cat, doa, dob, phone, status });
  }
  return students;
}

const ALL_STUDENTS = generateStudents(1000);

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── Badge styles ──────────────────────────────────────────────────────────────
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

const PAGE_SIZE = 20;

// ── Smart paginator ───────────────────────────────────────────────────────────
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  const addRange = (from: number, to: number) => {
    for (let i = from; i <= to; i++) pages.push(i);
  };
  pages.push(1);
  if (current <= 4) {
    addRange(2, 5);
    pages.push("...");
    pages.push(total);
  } else if (current >= total - 3) {
    pages.push("...");
    addRange(total - 4, total);
  } else {
    pages.push("...");
    addRange(current - 1, current + 1);
    pages.push("...");
    pages.push(total);
  }
  return pages;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function StudentsPage() {
  const [search,       setSearch]       = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCat,    setFilterCat]    = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [page,         setPage]         = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_STUDENTS.filter((s) => {
      const matchQ      = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q) || s.phone.includes(q);
      const matchCourse = !filterCourse || s.course === filterCourse;
      const matchStatus = !filterStatus || s.status === filterStatus;
      const matchCat    = !filterCat    || s.cat === filterCat;
      const matchGender = !filterGender || s.gender === filterGender;
      return matchQ && matchCourse && matchStatus && matchCat && matchGender;
    });
  }, [search, filterCourse, filterStatus, filterCat, filterGender]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const rows       = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pageNums   = getPageNumbers(safePage, totalPages);

  const resetPage = () => setPage(1);

  // Stats (always from full dataset)
  const totalActive   = ALL_STUDENTS.filter(s => s.status === "Active").length;
  const totalInactive = ALL_STUDENTS.filter(s => s.status === "Inactive").length;
  const totalDetained = ALL_STUDENTS.filter(s => s.status === "Detained").length;

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
          { label: "Total Students", value: ALL_STUDENTS.length, color: "#7c3aed", bg: "#ede9fe", icon: "ri-group-line" },
          { label: "Active",         value: totalActive,          color: "#16a34a", bg: "#dcfce7", icon: "ri-checkbox-circle-line" },
          { label: "Inactive",       value: totalInactive,        color: "#dc2626", bg: "#fee2e2", icon: "ri-close-circle-line" },
          { label: "Detained",       value: totalDetained,        color: "#d97706", bg: "#fef3c7", icon: "ri-error-warning-line" },
        ].map(stat => (
          <div key={stat.label} className="col-6 col-md-3">
            <div className="card custom-card mb-0" style={{ borderLeft: `4px solid ${stat.color}` }}>
              <div className="card-body py-3 px-3 d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={stat.icon} style={{ fontSize: 18, color: stat.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--default-text-color)", lineHeight: 1.2 }}>{stat.value.toLocaleString()}</div>
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
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Showing <strong style={{ color: "var(--default-text-color)" }}>{filtered.length.toLocaleString()}</strong> students · Page <strong style={{ color: "var(--default-text-color)" }}>{safePage}</strong> of <strong style={{ color: "var(--default-text-color)" }}>{totalPages}</strong>
            </div>
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
              <select className="form-select form-select-sm" style={{ width: 100, fontSize: 12 }}
                value={filterGender} onChange={(e) => { setFilterGender(e.target.value); resetPage(); }}>
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
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
                  placeholder="Search name, ID, roll, phone…"
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
                  <th style={TH}>Admission No</th>
                  <th style={TH}>Roll No</th>
                  <th style={TH}>Student Name</th>
                  <th style={TH}>Course</th>
                  <th style={TH}>Semester</th>
                  <th style={TH}>Gender</th>
                  <th style={TH}>Category</th>
                  <th style={TH}>Admission Date</th>
                  <th style={TH}>DOB</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Action</th>
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
                  const color  = avatarColor(s.name);
                  const sts    = STATUS_STYLE[s.status] || {};
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
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            {initials(s.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--default-text-color)", lineHeight: 1.2 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 500, color: "var(--default-text-color)" }}>{COURSES[s.course] || s.course}</td>
                      <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{s.sem}</td>
                      <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <i className={s.gender === "Male" ? "ri-men-line" : "ri-women-line"} style={{ color: s.gender === "Male" ? "#3b82f6" : "#ec4899", fontSize: 14 }} />
                          {s.gender}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ ...catSty, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4 }}>{s.cat}</span>
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
              Showing{" "}
              <strong>{filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}</strong>
              {" "}–{" "}
              <strong>{Math.min(safePage * PAGE_SIZE, filtered.length)}</strong>
              {" "}of <strong>{filtered.length.toLocaleString()}</strong> entries
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button
                className="btn btn-sm"
                style={navBtn(false)}
                disabled={safePage === 1}
                onClick={() => setPage(1)}
                title="First"
              >«</button>
              <button
                className="btn btn-sm"
                style={navBtn(false)}
                disabled={safePage === 1}
                onClick={() => setPage(p => p - 1)}
              >‹ Prev</button>

              {pageNums.map((pg, i) =>
                pg === "..." ? (
                  <span key={`e${i}`} style={{ padding: "4px 6px", fontSize: 12, color: "var(--text-muted)" }}>…</span>
                ) : (
                  <button
                    key={pg}
                    className="btn btn-sm"
                    style={{
                      fontSize: 12, padding: "4px 0", minWidth: 32, height: 30,
                      background: safePage === pg ? "var(--primary-color)" : "var(--custom-white)",
                      color: safePage === pg ? "#fff" : "var(--default-text-color)",
                        border: `1px solid ${safePage === pg ? "var(--primary-color)" : "var(--default-border)"}`,
                      fontWeight: safePage === pg ? 700 : 400,
                      borderRadius: 6,
                    }}
                    onClick={() => setPage(pg as number)}
                  >{pg}</button>
                )
              )}

              <button
                className="btn btn-sm"
                style={navBtn(false)}
                disabled={safePage >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >Next ›</button>
              <button
                className="btn btn-sm"
                style={navBtn(false)}
                disabled={safePage >= totalPages}
                onClick={() => setPage(totalPages)}
                title="Last"
              >»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Style helpers ────────────────────────────────────────────────
const TH: React.CSSProperties = {
  padding: "10px 14px", fontWeight: 700, fontSize: 11,
  textTransform: "uppercase", letterSpacing: "0.05em",
  color: "var(--text-muted)", whiteSpace: "nowrap",
};

function navBtn(_active: boolean): React.CSSProperties {
  return {
    fontSize: 12, padding: "4px 10px", height: 30,
    border: "1px solid var(--default-border)",
    background: "var(--custom-white)",
    color: "var(--default-text-color)",
    borderRadius: 6,
  };
}
