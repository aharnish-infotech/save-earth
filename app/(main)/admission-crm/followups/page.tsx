"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────
type FollowUpStatus = "Pending" | "Contacted" | "Converted" | "No Response" | "Rescheduled";
type Priority = "High" | "Medium" | "Low";

interface FollowUp {
  id: string;
  studentId: string;
  studentName: string;
  phone: string;
  course: string;
  enquiryDate: string;
  lastContact: string;
  nextFollowUp: string;
  status: FollowUpStatus;
  priority: Priority;
  counselor: string;
  notes: string;
  attemptCount: number;
  category: string;
}

// ── Data Generator ────────────────────────────────────────────────────────────
const FIRST_NAMES = ["Priya","Rahul","Anjali","Suresh","Meena","Deepak","Kavita","Arjun","Sunita","Vikram","Pooja","Karan","Nisha","Rohit","Sneha","Amit","Ritu","Sanjay","Divya","Mohit","Anita","Gaurav","Swati","Nitin","Rekha","Vishal","Shweta","Arun","Geeta","Rajan","Sapna","Hemant","Poonam","Rajesh","Neha","Sunil","Mamta","Vijay","Reena","Ashok","Usha","Prakash","Lata","Mahesh","Seema","Rakesh","Manju","Dinesh","Asha","Naresh"];
const LAST_NAMES  = ["Sharma","Verma","Patel","Kumar","Singh","Gupta","Joshi","Mehta","Tiwari","Yadav","Chauhan","Malhotra","Agarwal","Rajput","Pandey","Shah","Soni","Mishra","Dubey","Nair","Pillai","Reddy","Iyer","Chopra","Bose","Das","Ghosh","Roy","Sen","Mukherjee","Kapoor","Khanna","Arora","Sethi","Bhatia","Anand","Saxena","Bansal","Garg","Mittal"];
const COURSES     = ["BCA","B.Com","B.Sc","BBA","MBA","B.Tech","M.Com","MCA","M.Sc","BA","MA","BBA LLB","B.Pharm"];
const CATEGORIES  = ["General","Management","Science","Commerce","Engineering","Arts","Pharmacy"];
const COUNSELORS  = ["Riya Sharma","Amit Verma","Neha Shah","Raj Patel","Sunita Nair"];
const STATUSES: FollowUpStatus[] = ["Pending","Contacted","Converted","No Response","Rescheduled"];
const PRIORITIES: Priority[] = ["High","Medium","Low"];
const NOTES_POOL  = [
  "Interested, waiting for parent approval","Not picking calls — try WhatsApp","Asked to call after 14th July","Very interested, sending brochure","Admission confirmed, fee pending","Comparing with other colleges","Will decide after results","Dropped call twice","Out of town, will call back","Urgent follow-up needed","Interested in evening batch","Needs scholarship info","Documents submitted","Campus visit scheduled","Fee concession requested","Wants hostel facility info","Enquired about distance learning","Asked about placement record","Parents want to visit campus","Needs more time to decide",
];

function rng(seed: number) {
  // Simple deterministic pseudo-random
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function pad2(n: number) { return n < 10 ? "0" + n : "" + n; }
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function randomDate(rand: () => number, base: Date, minDays: number, maxDays: number): string {
  const offset = Math.floor(rand() * (maxDays - minDays) + minDays);
  const d = new Date(base.getTime() + offset * 86400000);
  return `${pad2(d.getDate())} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

const BASE_DATE = new Date(2026, 5, 1); // 1 Jun 2026
const TODAY_DATE = new Date(2026, 6, 12); // 12 Jul 2026

const ALL_FOLLOWUPS: FollowUp[] = (() => {
  const result: FollowUp[] = [];
  for (let i = 0; i < 3000; i++) {
    const rand = rng(i * 9999 + 7);
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastName  = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const courseIdx = Math.floor(rand() * COURSES.length);
    const course    = COURSES[courseIdx];
    const status    = STATUSES[Math.floor(rand() * STATUSES.length)];
    const priority  = PRIORITIES[Math.floor(rand() * PRIORITIES.length)];
    const counselor = COUNSELORS[Math.floor(rand() * COUNSELORS.length)];
    const category  = CATEGORIES[Math.min(courseIdx, CATEGORIES.length - 1)];
    const attempts  = Math.floor(rand() * 5) + 1;
    const note      = NOTES_POOL[Math.floor(rand() * NOTES_POOL.length)];
    const phone     = `9${Math.floor(rand() * 900000000 + 100000000)}`;
    const enquiryDate   = randomDate(rand, BASE_DATE, 0, 40);
    const lastContact   = randomDate(rand, TODAY_DATE, -10, 0);
    // nextFollowUp: mix of overdue, today, upcoming
    const fuOffset = Math.floor(rand() * 20) - 5; // -5 to +15 days from today
    const nextFollowUp  = randomDate(rand, TODAY_DATE, fuOffset, fuOffset + 1);

    // First record links to our demo student; rest get generated IDs
    const studentId = i === 0 ? "ZF2526001" : `ZF2526${String(i + 2).padStart(3, "0")}`;
    result.push({
      id: `FU${String(i + 1).padStart(5, "0")}`,
      studentId,
      studentName: `${firstName} ${lastName}`,
      phone,
      course,
      enquiryDate,
      lastContact,
      nextFollowUp,
      status,
      priority,
      counselor,
      notes: note,
      attemptCount: attempts,
      category,
    });
  }
  return result;
})();

// ── Constants ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 15;
const TODAY_STR = "12 Jul 2026";

const STATUS_CONFIG: Record<FollowUpStatus, { color: string; bg: string; icon: string }> = {
  "Pending":      { color: "#d97706", bg: "#fffbeb", icon: "ri-time-line" },
  "Contacted":    { color: "#2563eb", bg: "#eff6ff", icon: "ri-phone-line" },
  "Converted":    { color: "#16a34a", bg: "#f0fdf4", icon: "ri-checkbox-circle-line" },
  "No Response":  { color: "#dc2626", bg: "#fef2f2", icon: "ri-phone-off-line" },
  "Rescheduled":  { color: "#7c3aed", bg: "#f5f3ff", icon: "ri-calendar-line" },
};

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string }> = {
  "High":   { color: "#dc2626", bg: "#fef2f2" },
  "Medium": { color: "#d97706", bg: "#fffbeb" },
  "Low":    { color: "#16a34a", bg: "#f0fdf4" },
};

const ALL_STATUSES: ("All" | FollowUpStatus)[] = ["All","Pending","Contacted","Converted","No Response","Rescheduled"];
const ALL_PRIORITIES: ("All" | Priority)[] = ["All","High","Medium","Low"];
const ALL_COUNSELORS = ["All Counselors", ...COUNSELORS];

function parseDateStr(s: string): Date {
  const [d, m, y] = s.split(" ");
  const mIdx = MONTH_NAMES.indexOf(m);
  return new Date(parseInt(y), mIdx, parseInt(d));
}

function isOverdue(dateStr: string) {
  return parseDateStr(dateStr) < new Date(2026, 6, 12);
}
function isDueToday(dateStr: string) {
  return dateStr === TODAY_STR;
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color }: { icon: string; label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div style={{ background:"#fff", borderRadius:14, padding:"18px 22px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", border:"1px solid rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:16, flex:1, minWidth:0 }}>
      <div style={{ width:48, height:48, borderRadius:12, background:color+"18", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <i className={icon} style={{ fontSize:22, color }} />
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:24, fontWeight:800, color:"var(--default-text-color)", lineHeight:1.1 }}>{value.toLocaleString()}</div>
        <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color, marginTop:2, fontWeight:600 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const btn = (label: React.ReactNode, disabled: boolean, onClick: () => void, active = false): React.ReactNode => (
    <button
      key={String(label)}
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 32, height: 32, borderRadius: 8,
        border: active ? "none" : "1px solid var(--default-border)",
        background: active ? "var(--primary-color,#6c5ffc)" : disabled ? "var(--default-background)" : "#fff",
        color: active ? "#fff" : disabled ? "var(--text-muted)" : "var(--default-text-color)",
        fontWeight: active ? 700 : 500,
        fontSize: 13, cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 6px",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display:"flex", gap:4, alignItems:"center" }}>
      {btn(<i className="ri-arrow-left-s-line" />, page === 1, () => onPage(page - 1))}
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e${i}`} style={{ width:32, textAlign:"center", color:"var(--text-muted)", fontSize:13 }}>…</span>
          : btn(p, false, () => onPage(p as number), p === page)
      )}
      {btn(<i className="ri-arrow-right-s-line" />, page === totalPages, () => onPage(page + 1))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FollowUpsPage() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatus]     = useState<"All" | FollowUpStatus>("All");
  const [priorityFilter, setPriority] = useState<"All" | Priority>("All");
  const [counselorFilter, setCounselor] = useState("All Counselors");
  const [page, setPage]               = useState(1);
  const [selectedIds, setSelected]    = useState<Set<string>>(new Set());
  const [showNotes, setShowNotes]     = useState<string | null>(null);

  // Reset to page 1 on filter change
  const setStatusAndReset  = useCallback((v: "All" | FollowUpStatus) => { setStatus(v); setPage(1); setSelected(new Set()); }, []);
  const setPriorityAndReset = useCallback((v: "All" | Priority) => { setPriority(v); setPage(1); setSelected(new Set()); }, []);
  const setCounselorAndReset = useCallback((v: string) => { setCounselor(v); setPage(1); setSelected(new Set()); }, []);
  const setSearchAndReset  = useCallback((v: string) => { setSearch(v); setPage(1); setSelected(new Set()); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_FOLLOWUPS.filter((f) => {
      if (q && !f.studentName.toLowerCase().includes(q) && !f.phone.includes(q) && !f.course.toLowerCase().includes(q) && !f.id.toLowerCase().includes(q)) return false;
      if (statusFilter !== "All" && f.status !== statusFilter) return false;
      if (priorityFilter !== "All" && f.priority !== priorityFilter) return false;
      if (counselorFilter !== "All Counselors" && f.counselor !== counselorFilter) return false;
      return true;
    });
  }, [search, statusFilter, priorityFilter, counselorFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const kpis = useMemo(() => ({
    total:      ALL_FOLLOWUPS.length,
    dueToday:   ALL_FOLLOWUPS.filter((f) => isDueToday(f.nextFollowUp) && f.status !== "Converted").length,
    overdue:    ALL_FOLLOWUPS.filter((f) => isOverdue(f.nextFollowUp) && f.status !== "Converted").length,
    converted:  ALL_FOLLOWUPS.filter((f) => f.status === "Converted").length,
    noResponse: ALL_FOLLOWUPS.filter((f) => f.status === "No Response").length,
  }), []);

  const statusCounts = useMemo(() => {
    const m: Record<string, number> = {};
    ALL_FOLLOWUPS.forEach((f) => { m[f.status] = (m[f.status] ?? 0) + 1; });
    return m;
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    setSelected((prev) => prev.size === pageData.length ? new Set() : new Set(pageData.map((f) => f.id)));
  };

  return (
    <div style={{ padding:"24px 28px", minHeight:"100%", background:"var(--default-background,#f8f9fa)" }}>

      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-muted)", marginBottom:6 }}>
        <Link href="/dashboard" style={{ color:"var(--text-muted)", textDecoration:"none" }}>Dashboard</Link>
        <i className="ri-arrow-right-s-line" />
        <span style={{ color:"var(--text-muted)" }}>Admission CRM</span>
        <i className="ri-arrow-right-s-line" />
        <span style={{ color:"var(--default-text-color)", fontWeight:600 }}>Follow-ups</span>
      </div>

      {/* Title row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>Follow-ups</h1>
          <p style={{ fontSize:13, color:"var(--text-muted)", margin:"3px 0 0" }}>Track and manage enquiry follow-ups across all counselors</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button style={outlineBtn}><i className="ri-download-line" style={{ fontSize:14 }} /> Export</button>
          <button style={primaryBtn}><i className="ri-add-line" style={{ fontSize:14 }} /> Add Follow-up</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"flex", gap:16, marginBottom:24, flexWrap:"wrap" }}>
        <KpiCard icon="ri-calendar-check-line" label="Total Follow-ups"  value={kpis.total}      color="#6c5ffc" />
        <KpiCard icon="ri-alarm-line"          label="Due Today"         value={kpis.dueToday}   color="#f59e0b" sub="Action required" />
        <KpiCard icon="ri-error-warning-line"  label="Overdue"           value={kpis.overdue}    color="#ef4444" sub="Needs attention" />
        <KpiCard icon="ri-checkbox-circle-line" label="Converted"        value={kpis.converted}  color="#10b981" />
        <KpiCard icon="ri-phone-off-line"      label="No Response"       value={kpis.noResponse} color="#8b5cf6" />
      </div>

      {/* Status tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {ALL_STATUSES.map((s) => (
          <button key={s} onClick={() => setStatusAndReset(s)} style={{
            padding:"6px 16px", borderRadius:8, border:"1px solid", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s",
            ...(statusFilter === s
              ? { background:"var(--primary-color,#6c5ffc)", color:"#fff", borderColor:"var(--primary-color,#6c5ffc)" }
              : { background:"#fff", color:"var(--text-muted)", borderColor:"var(--default-border)" }),
          }}>
            {s}
            {s !== "All" && (
              <span style={{ marginLeft:6, background: statusFilter===s ? "rgba(255,255,255,0.25)" : "var(--default-background)", borderRadius:10, padding:"1px 7px", fontSize:10 }}>
                {statusCounts[s] ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ background:"#fff", borderRadius:12, padding:"14px 18px", border:"1px solid var(--default-border)", display:"flex", gap:12, alignItems:"center", marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--default-background)", border:"1px solid var(--default-border)", borderRadius:8, padding:"0 12px", flex:"1 1 220px", minWidth:200 }}>
          <i className="ri-search-line" style={{ color:"var(--text-muted)", fontSize:14 }} />
          <input
            type="text" placeholder="Search by name, phone, ID, course…"
            value={search} onChange={(e) => setSearchAndReset(e.target.value)}
            style={{ border:"none", background:"transparent", outline:"none", fontSize:13, color:"var(--default-text-color)", padding:"8px 0", width:"100%" }}
          />
          {search && <button onClick={() => setSearchAndReset("")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", padding:0 }}><i className="ri-close-line" /></button>}
        </div>
        <select value={priorityFilter} onChange={(e) => setPriorityAndReset(e.target.value as "All" | Priority)} style={selectStyle}>
          {ALL_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={counselorFilter} onChange={(e) => setCounselorAndReset(e.target.value)} style={selectStyle}>
          {ALL_COUNSELORS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div style={{ fontSize:12, color:"var(--text-muted)", marginLeft:"auto", whiteSpace:"nowrap" }}>
          <strong>{filtered.length.toLocaleString()}</strong> of <strong>{ALL_FOLLOWUPS.length.toLocaleString()}</strong> records
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div style={{ background:"rgba(108,95,252,0.06)", border:"1px solid rgba(108,95,252,0.2)", borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", gap:12, marginBottom:12, fontSize:13 }}>
          <span style={{ fontWeight:600, color:"var(--primary-color)" }}>{selectedIds.size} selected</span>
          <div style={{ width:1, height:18, background:"rgba(108,95,252,0.3)" }} />
          <button style={{ ...bulkBtn, color:"#16a34a" }}><i className="ri-checkbox-circle-line" /> Mark Contacted</button>
          <button style={{ ...bulkBtn, color:"#2563eb" }}><i className="ri-calendar-line" /> Reschedule</button>
          <button style={{ ...bulkBtn, color:"#d97706" }}><i className="ri-user-follow-line" /> Reassign</button>
          <button style={{ ...bulkBtn, color:"#dc2626" }}><i className="ri-close-circle-line" /> Mark Lost</button>
          <button onClick={() => setSelected(new Set())} style={{ ...bulkBtn, marginLeft:"auto", color:"var(--text-muted)" }}><i className="ri-close-line" /> Clear</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"var(--default-background,#f8f9fa)", borderBottom:"1px solid var(--default-border)" }}>
                <Th style={{ width:40 }}>
                  <input type="checkbox" checked={selectedIds.size===pageData.length && pageData.length>0} onChange={toggleAll} style={{ cursor:"pointer" }} />
                </Th>
                <Th style={{ width:40 }}>#</Th>
                <Th>Student</Th>
                <Th>Course</Th>
                <Th>Next Follow-up</Th>
                <Th>Last Contact</Th>
                <Th>Attempts</Th>
                <Th>Status</Th>
                <Th>Priority</Th>
                <Th>Counselor</Th>
                <Th style={{ width:110 }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign:"center", padding:"60px 20px", color:"var(--text-muted)" }}>
                    <i className="ri-calendar-check-line" style={{ fontSize:40, display:"block", marginBottom:10, opacity:0.3 }} />
                    No follow-ups found
                  </td>
                </tr>
              ) : pageData.map((f, i) => {
                const overdue  = isOverdue(f.nextFollowUp) && f.status !== "Converted";
                const dueToday = isDueToday(f.nextFollowUp) && f.status !== "Converted";
                const sc  = STATUS_CONFIG[f.status];
                const pc  = PRIORITY_CONFIG[f.priority];
                const checked = selectedIds.has(f.id);
                const rowNum  = (safePage - 1) * PAGE_SIZE + i + 1;

                return (
                  <tr
                    key={f.id}
                    style={{
                      borderBottom:"1px solid var(--default-border)",
                      background: checked ? "rgba(108,95,252,0.04)" : (i%2===0 ? "#fff" : "rgba(0,0,0,0.01)"),
                      transition:"background 0.1s",
                    }}
                    onMouseEnter={(e) => { if(!checked)(e.currentTarget as HTMLElement).style.background="rgba(108,95,252,0.03)"; }}
                    onMouseLeave={(e) => { if(!checked)(e.currentTarget as HTMLElement).style.background=i%2===0?"#fff":"rgba(0,0,0,0.01)"; }}
                  >
                    <Td><input type="checkbox" checked={checked} onChange={() => toggleSelect(f.id)} style={{ cursor:"pointer" }} /></Td>

                    {/* Row number */}
                    <Td><span style={{ fontSize:11, color:"var(--text-muted)", fontWeight:500 }}>{rowNum}</span></Td>

                    {/* Student */}
                    <Td>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{
                          width:34, height:34, borderRadius:"50%",
                          background:`hsl(${(f.id.charCodeAt(2)*37+f.id.charCodeAt(4)*19)%360},65%,88%)`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontWeight:700, fontSize:12,
                          color:`hsl(${(f.id.charCodeAt(2)*37+f.id.charCodeAt(4)*19)%360},55%,32%)`,
                          flexShrink:0,
                        }}>
                          {f.studentName.split(" ").map((n)=>n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <Link
                            href={`/students/${f.studentId}`}
                            style={{ fontWeight:600, fontSize:13, color:"var(--primary-color,#6c5ffc)", whiteSpace:"nowrap", textDecoration:"none" }}
                            title="View student profile"
                          >
                            {f.studentName}
                            <i className="ri-external-link-line" style={{ fontSize:10, marginLeft:4, opacity:0.6 }} />
                          </Link>
                          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:1 }}>
                            <i className="ri-phone-line" style={{ fontSize:10 }} /> {f.phone}
                          </div>
                        </div>
                      </div>
                    </Td>

                    {/* Course */}
                    <Td>
                      <span style={{ fontSize:12, fontWeight:600, color:"var(--default-text-color)" }}>{f.course}</span>
                      <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:1 }}>Enq: {f.enquiryDate}</div>
                    </Td>

                    {/* Next Follow-up */}
                    <Td>
                      {overdue && (
                        <div>
                          <span style={{ fontSize:11, fontWeight:700, color:"#dc2626", background:"#fef2f2", padding:"2px 7px", borderRadius:6 }}>
                            <i className="ri-error-warning-fill" style={{ fontSize:10, marginRight:2 }} />OVERDUE
                          </span>
                          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>{f.nextFollowUp}</div>
                        </div>
                      )}
                      {dueToday && !overdue && (
                        <div>
                          <span style={{ fontSize:11, fontWeight:700, color:"#d97706", background:"#fef3c7", padding:"2px 7px", borderRadius:6 }}>
                            <i className="ri-alarm-fill" style={{ fontSize:10, marginRight:2 }} />TODAY
                          </span>
                          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>{f.nextFollowUp}</div>
                        </div>
                      )}
                      {!overdue && !dueToday && (
                        <span style={{ fontSize:12, color:"var(--default-text-color)", fontWeight:500 }}>{f.nextFollowUp}</span>
                      )}
                    </Td>

                    {/* Last Contact */}
                    <Td><span style={{ fontSize:12, color:"var(--default-text-color)" }}>{f.lastContact}</span></Td>

                    {/* Attempts */}
                    <Td>
                      <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                        {Array.from({ length:5 }).map((_,idx) => (
                          <div key={idx} style={{
                            width:7, height:7, borderRadius:"50%",
                            background: idx < f.attemptCount
                              ? (f.attemptCount >= 4 ? "#ef4444" : f.attemptCount >= 2 ? "#f59e0b" : "#10b981")
                              : "var(--default-border)",
                          }} />
                        ))}
                        <span style={{ fontSize:11, color:"var(--text-muted)", marginLeft:3 }}>{f.attemptCount}</span>
                      </div>
                    </Td>

                    {/* Status */}
                    <Td>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:sc.color, background:sc.bg, whiteSpace:"nowrap" }}>
                        <i className={sc.icon} style={{ fontSize:11 }} />{f.status}
                      </span>
                    </Td>

                    {/* Priority */}
                    <Td>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:pc.color, background:pc.bg }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:pc.color, display:"inline-block" }} />{f.priority}
                      </span>
                    </Td>

                    {/* Counselor */}
                    <Td>
                      <div style={{ fontSize:12, fontWeight:600, color:"var(--default-text-color)", whiteSpace:"nowrap" }}>{f.counselor}</div>
                      <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:1 }}>{f.category}</div>
                    </Td>

                    {/* Actions */}
                    <Td>
                      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <ABtn icon="ri-phone-line"           title="Call Now"         color="#2563eb" />
                        <ABtn icon="ri-checkbox-circle-line" title="Mark Contacted"   color="#16a34a" />
                        <button
                          title="View Notes"
                          onClick={() => setShowNotes(showNotes === f.id ? null : f.id)}
                          style={{ ...aBase, background: showNotes===f.id ? "#f5f3ff" : "transparent", color:"#7c3aed" }}
                        >
                          <i className="ri-sticky-note-line" />
                        </button>
                        <ABtn icon="ri-more-2-fill" title="More" color="var(--text-muted)" />
                      </div>
                      {showNotes === f.id && (
                        <div style={{ position:"absolute", zIndex:9999, background:"#fff", border:"1px solid var(--default-border)", borderRadius:10, padding:"10px 14px", boxShadow:"0 8px 24px rgba(0,0,0,0.12)", minWidth:220, maxWidth:280, fontSize:12, color:"var(--default-text-color)", marginTop:4, lineHeight:1.6 }}>
                          <div style={{ fontWeight:700, marginBottom:6, color:"var(--primary-color)" }}><i className="ri-sticky-note-line" style={{ marginRight:4 }} />Notes</div>
                          {f.notes}
                        </div>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderTop:"1px solid var(--default-border)", background:"#fff", gap:12, flexWrap:"wrap" }}>
          <span style={{ fontSize:13, color:"var(--text-muted)" }}>
            Showing <strong>{((safePage-1)*PAGE_SIZE)+1}–{Math.min(safePage*PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length.toLocaleString()}</strong> follow-ups
          </span>
          <Pagination page={safePage} totalPages={totalPages} onPage={(p) => { setPage(p); setSelected(new Set()); }} />
          <div style={{ fontSize:13, color:"var(--text-muted)" }}>
            Page <strong>{safePage}</strong> of <strong>{totalPages.toLocaleString()}</strong>
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Micro-components ──────────────────────────────────────────────────────────
function Th({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <th style={{ padding:"11px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.05em", textTransform:"uppercase", whiteSpace:"nowrap", ...style }}>
      {children}
    </th>
  );
}

function Td({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding:"12px 14px", verticalAlign:"middle", position:"relative", ...style }}>{children}</td>;
}

function ABtn({ icon, title, color }: { icon: string; title: string; color: string }) {
  return (
    <button title={title} style={{ ...aBase, color }}>
      <i className={icon} />
    </button>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const primaryBtn: React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", background:"var(--primary-color,#6c5ffc)", color:"#fff", border:"none", borderRadius:9, fontWeight:700, fontSize:13, cursor:"pointer" };
const outlineBtn: React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", background:"#fff", color:"var(--default-text-color)", border:"1px solid var(--default-border)", borderRadius:9, fontWeight:600, fontSize:13, cursor:"pointer" };
const selectStyle: React.CSSProperties = { border:"1px solid var(--default-border)", borderRadius:8, padding:"7px 12px", fontSize:13, color:"var(--default-text-color)", background:"#fff", cursor:"pointer", outline:"none" };
const bulkBtn: React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:5, background:"none", border:"none", cursor:"pointer", fontSize:12, fontWeight:600, padding:"4px 8px", borderRadius:6 };
const aBase: React.CSSProperties = { width:28, height:28, borderRadius:7, border:"1px solid var(--default-border)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, transition:"background 0.1s" };
