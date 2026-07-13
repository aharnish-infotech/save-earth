"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────
type EnqStatus  = "New" | "Contacted" | "In Counseling" | "Converted" | "Lost" | "Hold";
type Source     = "Walk-in" | "Website" | "Phone Call" | "Social Media" | "Referral" | "School Visit" | "DHE Portal" | "Email" | "WhatsApp";
type Priority   = "Hot" | "Warm" | "Cold";
type Gender     = "Male" | "Female" | "Other";

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: Gender;
  dob: string;
  city: string;
  state: string;
  category: string;
  course: string;
  courseType: string;
  source: Source;
  status: EnqStatus;
  priority: Priority;
  counselor: string;
  enquiryDate: string;
  enquiryTime: string;
  lastUpdated: string;
  notes: string;
  parentName: string;
  parentPhone: string;
  qualification: string;
  percentage: number;
  board: string;
  scholarshipInterest: boolean;
  hostelRequired: boolean;
  followUpDate: string;
  referredBy: string;
  assignedTo: string;
}

// ── Data Generator ─────────────────────────────────────────────────
const FIRST_NAMES_M = ["Rahul","Suresh","Deepak","Arjun","Vikram","Karan","Rohit","Amit","Sanjay","Mohit","Gaurav","Nitin","Vishal","Arun","Rajan","Hemant","Rajesh","Sunil","Vijay","Ashok","Prakash","Mahesh","Rakesh","Dinesh","Naresh","Aman","Harsh","Akash","Vikas","Sachin","Sandeep","Pradeep","Manish","Ramesh","Umesh","Yogesh","Lokesh","Rajendra","Narendra","Bharat"];
const FIRST_NAMES_F = ["Priya","Anjali","Meena","Kavita","Sunita","Pooja","Nisha","Sneha","Ritu","Divya","Anita","Swati","Rekha","Shweta","Geeta","Sapna","Poonam","Neha","Mamta","Reena","Usha","Lata","Seema","Manju","Asha","Komal","Pallavi","Shivani","Richa","Nidhi","Preeti","Sonal","Jyoti","Vandana","Sudha","Radha","Sunidhi","Payal","Monika","Shruti"];
const LNAMES = ["Sharma","Verma","Patel","Kumar","Singh","Gupta","Joshi","Mehta","Tiwari","Yadav","Chauhan","Malhotra","Agarwal","Rajput","Pandey","Shah","Soni","Mishra","Dubey","Nair","Pillai","Reddy","Iyer","Chopra","Bose","Das","Roy","Sen","Kapoor","Khanna","Arora","Sethi","Bhatia","Saxena","Bansal","Garg","Mittal","Trivedi","Shukla","Dwivedi"];
const COURSES = ["BCA","B.Com","B.Sc (Maths)","B.Sc (Computer)","B.Sc (Biology)","BBA","MBA","B.Tech CSE","B.Tech ECE","B.Tech Mech","B.Tech Civil","M.Com","MCA","M.Sc","BA","MA","BBA LLB","B.Pharm","M.Pharm","B.Ed"];
const COURSE_TYPES = ["UG","UG","UG","UG","UG","UG","PG","UG","UG","UG","UG","PG","PG","PG","UG","PG","UG","UG","PG","UG"];
const SOURCES: Source[] = ["Walk-in","Website","Phone Call","Social Media","Referral","School Visit","DHE Portal","Email","WhatsApp"];
const STATUSES: EnqStatus[] = ["New","Contacted","In Counseling","Converted","Lost","Hold"];
const COUNSELORS = ["Ananya Kapoor","Rohit Verma","Sunita Nair","Deepak Joshi","Meena Pillai","Unassigned"];
const CITIES = ["Indore","Bhopal","Ujjain","Jabalpur","Gwalior","Rewa","Sagar","Dewas","Vidisha","Satna","Damoh","Chhindwara","Betul","Hoshangabad","Khandwa","Khargone","Mandsaur","Neemuch","Ratlam","Shivpuri"];
const BOARDS = ["MP Board","CBSE","ICSE","MP Open Board"];
const QUALS = ["12th Science","12th Commerce","12th Arts","12th PCM","12th PCB","Diploma","B.Sc","B.Com","BCA","BBA"];
const PARENT_FIRST = ["Ramesh","Suresh","Mahesh","Rajesh","Dinesh","Umesh","Naresh","Yogesh","Ganesh","Prakash","Mukesh","Lokesh","Hitesh","Nitesh","Bhupesh","Kamlesh","Brijesh","Jagdish","Ramkishore","Shivprasad"];
const NOTES_LIST = [
  "Very interested in BCA, will discuss with parents",
  "Called twice, shared brochure via WhatsApp",
  "Visited campus, liked infrastructure",
  "Needs scholarship information urgently",
  "Father is an alumni, strong referral",
  "Interested in hostel facility",
  "Comparing with other colleges, follow up needed",
  "Ready to pay fee, awaiting documents",
  "Application form partially filled",
  "Asked about placement records",
  "Wants to join July batch only",
  "Interested in tech courses, undecided on branch",
  "Parents visited, very impressed with faculty",
  "Needs lateral entry information",
  "Asked about evening batch availability",
  "Scholarship eligibility being checked",
  "Referred by alumni Rakesh Sharma",
  "Online enquiry, needs campus tour",
  "Fee concession requested",
  "All documents ready, admission likely",
];
const FOLLOW_DATES = ["15 Jul 2026","16 Jul 2026","17 Jul 2026","18 Jul 2026","19 Jul 2026","20 Jul 2026","21 Jul 2026","22 Jul 2026","25 Jul 2026","28 Jul 2026","30 Jul 2026","01 Aug 2026"];
const ENQ_DATES = ["01 Jul 2026","02 Jul 2026","03 Jul 2026","04 Jul 2026","05 Jul 2026","07 Jul 2026","08 Jul 2026","09 Jul 2026","10 Jul 2026","11 Jul 2026","12 Jul 2026","13 Jul 2026","14 Jul 2026","14 Jul 2026","14 Jul 2026","14 Jul 2026","14 Jul 2026"];
const ENQ_TIMES = ["09:15 AM","09:45 AM","10:20 AM","10:50 AM","11:10 AM","11:35 AM","12:05 PM","02:15 PM","02:40 PM","03:05 PM","03:30 PM","04:00 PM","04:25 PM","05:00 PM"];

function rnd(seed: number, max: number) { return ((seed * 1103515245 + 12345) & 0x7fffffff) % max; }

const ENQUIRIES: Enquiry[] = Array.from({ length: 120 }, (_, i) => {
  const isFemale = rnd(i * 7 + 1, 2) === 0;
  const fn = isFemale ? FIRST_NAMES_F[rnd(i * 7 + 1, FIRST_NAMES_F.length)] : FIRST_NAMES_M[rnd(i * 7 + 1, FIRST_NAMES_M.length)];
  const ln = LNAMES[rnd(i * 13 + 3, LNAMES.length)];
  const courseIdx = rnd(i * 17 + 5, COURSES.length);
  const statusIdx = rnd(i * 23 + 9, STATUSES.length);
  const pct = 55 + rnd(i * 31 + 11, 45);
  const prio: Priority = statusIdx === 3 ? "Hot" : pct >= 80 ? "Hot" : pct >= 65 ? "Warm" : "Cold";
  const pf = PARENT_FIRST[rnd(i * 37 + 12, PARENT_FIRST.length)];
  const dayBorn = (rnd(i * 41 + 13, 28) + 1).toString().padStart(2, "0");
  const yrBorn = 2004 + rnd(i * 43 + 14, 5);
  const monthBorn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][rnd(i * 47 + 15, 12)];
  return {
    id: `ENQ-2627-${(i + 1).toString().padStart(4, "0")}`,
    name: `${fn} ${ln}`,
    phone: `+91-${9800000000 + i * 97 + 123}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@gmail.com`,
    gender: isFemale ? "Female" : "Male",
    dob: `${dayBorn} ${monthBorn} ${yrBorn}`,
    city: CITIES[rnd(i * 53 + 16, CITIES.length)],
    state: "Madhya Pradesh",
    category: ["General","OBC","SC","ST","EWS","Minority"][rnd(i * 59 + 17, 6)],
    course: COURSES[courseIdx],
    courseType: COURSE_TYPES[courseIdx],
    source: SOURCES[rnd(i * 61 + 18, SOURCES.length)],
    status: STATUSES[statusIdx],
    priority: prio,
    counselor: COUNSELORS[rnd(i * 67 + 19, COUNSELORS.length)],
    enquiryDate: ENQ_DATES[rnd(i * 71 + 20, ENQ_DATES.length)],
    enquiryTime: ENQ_TIMES[rnd(i * 73 + 21, ENQ_TIMES.length)],
    lastUpdated: ENQ_DATES[Math.min(rnd(i * 79 + 22, ENQ_DATES.length), ENQ_DATES.length - 1)],
    notes: NOTES_LIST[rnd(i * 83 + 23, NOTES_LIST.length)],
    parentName: `${pf} ${ln}`,
    parentPhone: `+91-${9700000000 + i * 61 + 456}`,
    qualification: QUALS[rnd(i * 89 + 24, QUALS.length)],
    percentage: pct,
    board: BOARDS[rnd(i * 97 + 25, BOARDS.length)],
    scholarshipInterest: rnd(i * 101 + 26, 3) > 0,
    hostelRequired: rnd(i * 103 + 27, 3) === 0,
    followUpDate: FOLLOW_DATES[rnd(i * 107 + 28, FOLLOW_DATES.length)],
    referredBy: rnd(i * 109 + 29, 4) === 0 ? `${PARENT_FIRST[rnd(i * 113 + 30, PARENT_FIRST.length)]} ${LNAMES[rnd(i * 127 + 31, LNAMES.length)]}` : "—",
    assignedTo: COUNSELORS[rnd(i * 131 + 32, COUNSELORS.length - 1)],
  };
});

// ── Config ─────────────────────────────────────────────────────────
const STATUS_CFG: Record<EnqStatus, { color: string; bg: string; border: string; icon: string }> = {
  "New":          { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  border: "#6366f130", icon: "ri-user-add-line" },
  "Contacted":    { color: "#0284c7", bg: "rgba(2,132,199,0.1)",   border: "#0284c730", icon: "ri-phone-line" },
  "In Counseling":{ color: "#d97706", bg: "rgba(217,119,6,0.1)",   border: "#d9770630", icon: "ri-chat-voice-line" },
  "Converted":    { color: "#16a34a", bg: "rgba(22,163,74,0.1)",   border: "#16a34a30", icon: "ri-checkbox-circle-line" },
  "Lost":         { color: "#dc2626", bg: "rgba(220,38,38,0.1)",   border: "#dc262630", icon: "ri-close-circle-line" },
  "Hold":         { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "#6b728030", icon: "ri-pause-circle-line" },
};
const PRIO_CFG: Record<Priority, { color: string; bg: string; icon: string }> = {
  Hot:  { color: "#dc2626", bg: "#fee2e2",          icon: "ri-fire-line" },
  Warm: { color: "#d97706", bg: "#fef3c7",          icon: "ri-sun-line" },
  Cold: { color: "#0284c7", bg: "rgba(2,132,199,0.1)", icon: "ri-snowy-line" },
};
const SOURCE_ICONS: Record<Source, string> = {
  "Walk-in":     "ri-walk-line",
  "Website":     "ri-global-line",
  "Phone Call":  "ri-phone-line",
  "Social Media":"ri-instagram-line",
  "Referral":    "ri-user-shared-line",
  "School Visit":"ri-school-line",
  "DHE Portal":  "ri-government-line",
  "Email":       "ri-mail-line",
  "WhatsApp":    "ri-whatsapp-line",
};

const ALL_COURSES  = ["All Courses",  ...Array.from(new Set(ENQUIRIES.map(e => e.course))).sort()];
const ALL_SOURCES  = ["All Sources",  ...SOURCES];
const ALL_STATUSES = ["All Status",   ...STATUSES];
const ALL_COUNSELORS = ["All Counselors", ...COUNSELORS.filter(c => c !== "Unassigned")];

// ── Sub-components ─────────────────────────────────────────────────
function StatusBadge({ status }: { status: EnqStatus }) {
  const c = STATUS_CFG[status];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: c.bg, color: c.color, border: `1px solid ${c.border}`, display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" as const }}>
      <i className={c.icon} style={{ fontSize: 9 }} />{status}
    </span>
  );
}
function PrioBadge({ prio }: { prio: Priority }) {
  const c = PRIO_CFG[prio];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: c.bg, color: c.color, display: "inline-flex", alignItems: "center", gap: 3 }}>
      <i className={c.icon} style={{ fontSize: 9 }} />{prio}
    </span>
  );
}

// ── Detail Drawer ──────────────────────────────────────────────────
function EnquiryDrawer({ enq, onClose }: { enq: Enquiry; onClose: () => void }) {
  const sc = STATUS_CFG[enq.status];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} />
      <div style={{ width: 480, background: "#fff", boxShadow: "-8px 0 32px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" as const, overflowY: "auto" as const }}>
        {/* Drawer header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky" as const, top: 0, background: "#fff", zIndex: 1 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#1e1b4b" }}>{enq.name}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{enq.id} · {enq.enquiryDate} at {enq.enquiryTime}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ri-close-line" style={{ fontSize: 16, color: "#6b7280" }} />
          </button>
        </div>

        {/* Status + Priority row */}
        <div style={{ padding: "0.875rem 1.5rem", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const }}>
          <StatusBadge status={enq.status} />
          <PrioBadge prio={enq.priority} />
          {enq.scholarshipInterest && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac" }}><i className="ri-award-line" style={{ marginRight: 3 }} />Scholarship</span>}
          {enq.hostelRequired && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "#eff6ff", color: "#2563eb", border: "1px solid #93c5fd" }}><i className="ri-home-4-line" style={{ marginRight: 3 }} />Hostel</span>}
        </div>

        <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
          {/* Contact Info */}
          <Section title="Contact Information" icon="ri-contacts-line">
            <Row label="Phone"       value={enq.phone} />
            <Row label="Email"       value={enq.email} />
            <Row label="Gender"      value={enq.gender} />
            <Row label="Date of Birth" value={enq.dob} />
            <Row label="City"        value={`${enq.city}, ${enq.state}`} />
            <Row label="Category"    value={enq.category} />
            <Row label="Parent Name" value={enq.parentName} />
            <Row label="Parent Phone" value={enq.parentPhone} />
          </Section>

          {/* Academic Background */}
          <Section title="Academic Background" icon="ri-book-open-line">
            <Row label="Last Qualification" value={enq.qualification} />
            <Row label="Percentage / CGPA"  value={`${enq.percentage}%`} />
            <Row label="Board"              value={enq.board} />
          </Section>

          {/* Course Interest */}
          <Section title="Course Interest" icon="ri-graduation-cap-line">
            <Row label="Course Interested"  value={enq.course} />
            <Row label="Course Type"        value={enq.courseType} />
            <Row label="Scholarship Interest" value={enq.scholarshipInterest ? "Yes" : "No"} />
            <Row label="Hostel Required"    value={enq.hostelRequired ? "Yes" : "No"} />
          </Section>

          {/* Enquiry Details */}
          <Section title="Enquiry Details" icon="ri-information-line">
            <Row label="Source"           value={enq.source} />
            <Row label="Referred By"      value={enq.referredBy} />
            <Row label="Assigned Counselor" value={enq.assignedTo} />
            <Row label="Follow-up Date"   value={enq.followUpDate} />
            <Row label="Last Updated"     value={enq.lastUpdated} />
          </Section>

          {/* Notes */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "8px 12px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="ri-sticky-note-line" style={{ color: "#7c3aed", fontSize: 13 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Counselor Notes</span>
            </div>
            <div style={{ padding: "0.75rem", fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{enq.notes || "No notes added yet."}</div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            <button style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <i className="ri-phone-line" />Call Student
            </button>
            <button style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1.5px solid #7c3aed", background: "#fff", color: "#7c3aed", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <i className="ri-calendar-line" />Schedule Session
            </button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1.5px solid #16a34a", background: "#f0fdf4", color: "#16a34a", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <i className="ri-checkbox-circle-line" />Mark Converted
            </button>
            <button style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1.5px solid #dc2626", background: "#fff5f5", color: "#dc2626", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <i className="ri-close-circle-line" />Mark Lost
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "8px 12px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 6 }}>
        <i className={icon} style={{ color: "#7c3aed", fontSize: 13 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{title}</span>
      </div>
      <div style={{ padding: "0.5rem 0.75rem" }}>{children}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px dashed #f3f4f6", fontSize: 12 }}>
      <span style={{ color: "#9ca3af", fontWeight: 500, flexShrink: 0, marginRight: 8 }}>{label}</span>
      <span style={{ color: "#1e1b4b", fontWeight: 600, textAlign: "right" as const }}>{value || "—"}</span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────
const PAGE_SIZE = 15;

export default function EnquiriesPage() {
  const [search, setSearch]             = useState("");
  const [statusF, setStatusF]           = useState("All Status");
  const [sourceF, setSourceF]           = useState("All Sources");
  const [courseF, setCourseF]           = useState("All Courses");
  const [counselorF, setCounselorF]     = useState("All Counselors");
  const [prioF, setPrioF]               = useState<"All" | Priority>("All");
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");
  const [page, setPage]                 = useState(1);
  const [selected, setSelected]         = useState<Set<string>>(new Set());
  const [drawerEnq, setDrawerEnq]       = useState<Enquiry | null>(null);

  const filtered = useMemo(() => {
    return ENQUIRIES.filter(e => {
      const q = search.toLowerCase();
      const mQ = !q || e.name.toLowerCase().includes(q) || e.phone.includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.course.toLowerCase().includes(q) || e.city.toLowerCase().includes(q);
      const mSt = statusF === "All Status" || e.status === statusF;
      const mSo = sourceF === "All Sources" || e.source === sourceF;
      const mCo = courseF === "All Courses" || e.course === courseF;
      const mCn = counselorF === "All Counselors" || e.assignedTo === counselorF;
      const mP  = prioF === "All" || e.priority === prioF;
      return mQ && mSt && mSo && mCo && mCn && mP;
    });
  }, [search, statusF, sourceF, courseF, counselorF, prioF, dateFrom, dateTo]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pages = Math.ceil(filtered.length / PAGE_SIZE);

  const hasFilter = search || statusF !== "All Status" || sourceF !== "All Sources" || courseF !== "All Courses" || counselorF !== "All Counselors" || prioF !== "All";
  const clearFilters = () => { setSearch(""); setStatusF("All Status"); setSourceF("All Sources"); setCourseF("All Courses"); setCounselorF("All Counselors"); setPrioF("All"); setDateFrom(""); setDateTo(""); setPage(1); };

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(prev => prev.size === paged.length ? new Set() : new Set(paged.map(e => e.id)));

  // KPIs
  const total     = ENQUIRIES.length;
  const newCount  = ENQUIRIES.filter(e => e.status === "New").length;
  const contacted = ENQUIRIES.filter(e => e.status === "Contacted").length;
  const counsel   = ENQUIRIES.filter(e => e.status === "In Counseling").length;
  const converted = ENQUIRIES.filter(e => e.status === "Converted").length;
  const lost      = ENQUIRIES.filter(e => e.status === "Lost").length;
  const convRate  = Math.round(converted / total * 100);

  const kpis = [
    { label: "Total Enquiries", value: total,     icon: "ri-user-3-line",           color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
    { label: "New",             value: newCount,  icon: "ri-user-add-line",          color: "#6366f1", bg: "rgba(99,102,241,0.1)"  },
    { label: "Contacted",       value: contacted, icon: "ri-phone-line",             color: "#0284c7", bg: "rgba(2,132,199,0.1)"   },
    { label: "In Counseling",   value: counsel,   icon: "ri-chat-voice-line",        color: "#d97706", bg: "rgba(217,119,6,0.1)"   },
    { label: "Converted",       value: converted, icon: "ri-checkbox-circle-line",   color: "#16a34a", bg: "rgba(22,163,74,0.1)"   },
    { label: "Conversion Rate", value: `${convRate}%`, icon: "ri-pie-chart-2-line", color: "#db2777", bg: "rgba(219,39,119,0.1)"  },
  ];

  // Source breakdown mini bars
  const sourceBreakdown = SOURCES.map(s => ({
    source: s, count: ENQUIRIES.filter(e => e.source === s).length,
    icon: SOURCE_ICONS[s],
  })).sort((a, b) => b.count - a.count);
  const maxSrc = sourceBreakdown[0]?.count || 1;

  const SL: React.CSSProperties = { padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 12, background: "#fafafa", color: "#374151", outline: "none", cursor: "pointer" };
  const TH: React.CSSProperties = { padding: "10px 14px", fontWeight: 700, fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" as const, background: "#f9fafb", borderBottom: "1px solid #e5e7eb" };
  const TD: React.CSSProperties = { padding: "10px 14px", verticalAlign: "middle" as const };

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h4 style={{ fontSize: 18, fontWeight: 800, color: "var(--default-text-color)", marginBottom: 2 }}>Enquiries</h4>
          <nav><ol className="breadcrumb mb-0" style={{ fontSize: 12 }}>
            <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item active">Enquiries</li>
          </ol></nav>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#374151" }}>
            <i className="ri-upload-2-line" />Import
          </button>
          <button style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#374151" }}>
            <i className="ri-download-2-line" />Export
          </button>
          <button style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <i className="ri-add-line" />Add Enquiry
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {kpis.map(k => (
          <div key={k.label} className="card custom-card mb-0" style={{ padding: "0.875rem 1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={k.icon} style={{ fontSize: 16, color: k.color }} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--default-text-color)", lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{k.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Source Breakdown + Status Funnel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        {/* Source breakdown */}
        <div className="card custom-card mb-0">
          <div className="card-header zf-widget-header">
            <h3 className="zf-widget-title">Enquiries by Source</h3>
          </div>
          <div className="card-body" style={{ padding: "0.875rem 1rem" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.5rem" }}>
              {sourceBreakdown.map(s => (
                <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <i className={s.icon} style={{ fontSize: 13, color: "#7c3aed", width: 16 }} />
                  <span style={{ fontSize: 12, color: "#374151", width: 110, flexShrink: 0 }}>{s.source}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 999, background: "#f3f4f6", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 999, width: `${s.count / maxSrc * 100}%`, background: "#7c3aed" }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", minWidth: 24, textAlign: "right" as const }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status funnel */}
        <div className="card custom-card mb-0">
          <div className="card-header zf-widget-header">
            <h3 className="zf-widget-title">Status Funnel</h3>
          </div>
          <div className="card-body" style={{ padding: "0.875rem 1rem" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.5rem" }}>
              {STATUSES.map(st => {
                const cnt = ENQUIRIES.filter(e => e.status === st).length;
                const pct = Math.round(cnt / total * 100);
                const cfg = STATUS_CFG[st];
                return (
                  <div key={st} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <i className={cfg.icon} style={{ fontSize: 13, color: cfg.color, width: 16 }} />
                    <span style={{ fontSize: 12, color: "#374151", width: 110, flexShrink: 0 }}>{st}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 999, background: "#f3f4f6", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 999, width: `${pct}%`, background: cfg.color }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, minWidth: 46, textAlign: "right" as const }}>{cnt} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card custom-card mb-0" style={{ padding: "0.875rem 1rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <i className="ri-search-line" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14 }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, phone, email, ID, course, city…"
              style={{ width: "100%", padding: "7px 10px 7px 32px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 12, outline: "none", background: "#fafafa" }} />
          </div>
          <select value={statusF} onChange={e => { setStatusF(e.target.value); setPage(1); }} style={SL}>
            {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={sourceF} onChange={e => { setSourceF(e.target.value); setPage(1); }} style={SL}>
            {ALL_SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={courseF} onChange={e => { setCourseF(e.target.value); setPage(1); }} style={SL}>
            {ALL_COURSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={counselorF} onChange={e => { setCounselorF(e.target.value); setPage(1); }} style={SL}>
            {ALL_COUNSELORS.map(c => <option key={c}>{c}</option>)}
          </select>
          {/* Hot/Warm/Cold pills */}
          <div style={{ display: "flex", gap: 4 }}>
            {(["All", "Hot", "Warm", "Cold"] as const).map(p => (
              <button key={p} onClick={() => { setPrioF(p); setPage(1); }} style={{
                padding: "5px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer",
                border: "1.5px solid " + (prioF === p ? "#7c3aed" : "#e5e7eb"),
                background: prioF === p ? "#7c3aed" : "#fff",
                color: prioF === p ? "#fff" : "#6b7280",
              }}>{p}</button>
            ))}
          </div>
          {hasFilter && (
            <button onClick={clearFilters} style={{ fontSize: 11, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              <i className="ri-close-line" />Clear
            </button>
          )}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
          Showing <strong style={{ color: "#374151" }}>{filtered.length}</strong> of {ENQUIRIES.length} enquiries
          {selected.size > 0 && <span style={{ marginLeft: 12, color: "#7c3aed", fontWeight: 600 }}>{selected.size} selected</span>}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div style={{ background: "#f5f3ff", border: "1.5px solid #ede9fe", borderRadius: 10, padding: "0.625rem 1rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed" }}>{selected.size} selected</span>
          <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
            {[["ri-user-line","Assign Counselor"],["ri-calendar-line","Schedule Follow-up"],["ri-arrow-right-line","Move Stage"],["ri-download-2-line","Export Selected"]].map(([icon,label])=>(
              <button key={label} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #ede9fe", background: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#7c3aed", display: "flex", alignItems: "center", gap: 4 }}>
                <i className={icon} />{label}
              </button>
            ))}
          </div>
          <button onClick={() => setSelected(new Set())} style={{ marginLeft: "auto", fontSize: 11, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>Clear selection</button>
        </div>
      )}

      {/* Table */}
      <div className="card custom-card mb-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: 40 }}>
                  <input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={toggleAll} style={{ accentColor: "#7c3aed" }} />
                </th>
                <th style={TH}>Enquiry ID</th>
                <th style={TH}>Student</th>
                <th style={TH}>Course</th>
                <th style={TH}>Source</th>
                <th style={TH}>Priority</th>
                <th style={TH}>Status</th>
                <th style={TH}>Counselor</th>
                <th style={TH}>Date</th>
                <th style={TH}>Follow-up</th>
                <th style={{ ...TH, textAlign: "center" as const }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(e => (
                <tr key={e.id} style={{ borderBottom: "1px solid #f3f4f6", background: selected.has(e.id) ? "#faf5ff" : "transparent" }}>
                  <td style={{ ...TD, width: 40, textAlign: "center" as const }}>
                    <input type="checkbox" checked={selected.has(e.id)} onChange={() => toggleSelect(e.id)} style={{ accentColor: "#7c3aed" }} />
                  </td>
                  <td style={TD}>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: "#7c3aed", fontWeight: 700 }}>{e.id}</span>
                  </td>
                  <td style={TD}>
                    <button onClick={() => setDrawerEnq(e)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" as const }}>
                      <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 13 }}
                        onMouseEnter={ev => (ev.currentTarget.style.color = "#7c3aed")}
                        onMouseLeave={ev => (ev.currentTarget.style.color = "#1e1b4b")}>
                        {e.name}
                      </div>
                    </button>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{e.phone} · {e.city}</div>
                  </td>
                  <td style={TD}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{e.course}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af" }}>{e.courseType} · {e.category}</div>
                  </td>
                  <td style={TD}>
                    <span style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: "#6b7280" }}>
                      <i className={SOURCE_ICONS[e.source]} />{e.source}
                    </span>
                  </td>
                  <td style={TD}><PrioBadge prio={e.priority} /></td>
                  <td style={TD}><StatusBadge status={e.status} /></td>
                  <td style={{ ...TD, fontSize: 12, color: "#374151" }}>
                    {e.assignedTo === "Unassigned"
                      ? <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 600 }}>Unassigned</span>
                      : e.assignedTo.split(" ")[0]}
                  </td>
                  <td style={{ ...TD, fontSize: 11, color: "#6b7280" }}>
                    <div>{e.enquiryDate}</div>
                    <div style={{ color: "#d1d5db" }}>{e.enquiryTime}</div>
                  </td>
                  <td style={{ ...TD, fontSize: 11, color: "#6b7280" }}>{e.followUpDate}</td>
                  <td style={{ ...TD, textAlign: "center" as const }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                      <button onClick={() => setDrawerEnq(e)} title="View Detail" style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #e5e7eb", background: "#f5f3ff", color: "#7c3aed", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="ri-eye-line" style={{ fontSize: 11 }} /></button>
                      <button title="Call" style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #e5e7eb", background: "#f0fdf4", color: "#16a34a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="ri-phone-line" style={{ fontSize: 11 }} /></button>
                      <button title="Schedule" style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #e5e7eb", background: "#eff6ff", color: "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="ri-calendar-line" style={{ fontSize: 11 }} /></button>
                      <button title="Edit" style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fafafa", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="ri-edit-line" style={{ fontSize: 11 }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={11} style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
                  <i className="ri-search-line" style={{ fontSize: 28, display: "block", marginBottom: 8 }} />No enquiries found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", borderTop: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>Page {page} of {pages} · {filtered.length} enquiries</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, cursor: "pointer", color: page === 1 ? "#d1d5db" : "#374151" }}>Prev</button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const pg = page <= 3 ? i + 1 : page >= pages - 2 ? pages - 4 + i : page - 2 + i;
                if (pg < 1 || pg > pages) return null;
                return <button key={pg} onClick={() => setPage(pg)} style={{ width: 30, height: 30, borderRadius: 6, border: "1.5px solid " + (pg === page ? "#7c3aed" : "#e5e7eb"), background: pg === page ? "#7c3aed" : "#fff", color: pg === page ? "#fff" : "#374151", fontSize: 12, cursor: "pointer", fontWeight: pg === page ? 700 : 400 }}>{pg}</button>;
              })}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, cursor: "pointer", color: page === pages ? "#d1d5db" : "#374151" }}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {drawerEnq && <EnquiryDrawer enq={drawerEnq} onClose={() => setDrawerEnq(null)} />}
    </div>
  );
}
