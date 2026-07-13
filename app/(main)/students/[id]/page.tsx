"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────
type DocStatus = "Verified" | "Pending" | "Rejected" | "Not Submitted";
interface StudentDoc {
  id: string; name: string; type: string; size: string;
  uploadedOn: string; status: DocStatus; required: boolean; previewUrl?: string;
}

// ── Static Data ───────────────────────────────────────────────────────────────
const DOCS: StudentDoc[] = [
  { id:"d1", name:"10th Mark Sheet",       type:"PDF",   size:"1.2 MB", uploadedOn:"12 Jul 2025", status:"Verified",      required:true,  previewUrl:"#e0e7ff" },
  { id:"d2", name:"12th Mark Sheet",       type:"PDF",   size:"980 KB", uploadedOn:"12 Jul 2025", status:"Verified",      required:true,  previewUrl:"#e0e7ff" },
  { id:"d3", name:"Birth Certificate",     type:"PDF",   size:"450 KB", uploadedOn:"12 Jul 2025", status:"Verified",      required:true,  previewUrl:"#dcfce7" },
  { id:"d4", name:"Category Certificate",  type:"PDF",   size:"320 KB", uploadedOn:"14 Jul 2025", status:"Pending",       required:true,  previewUrl:"#fef9c3" },
  { id:"d5", name:"Aadhar Card",           type:"Image", size:"850 KB", uploadedOn:"12 Jul 2025", status:"Verified",      required:true,  previewUrl:"#ffe4e6" },
  { id:"d6", name:"Income Certificate",    type:"PDF",   size:"290 KB", uploadedOn:"15 Jul 2025", status:"Pending",       required:false, previewUrl:"#fef9c3" },
  { id:"d7", name:"Migration Certificate", type:"PDF",   size:"410 KB", uploadedOn:"16 Jul 2025", status:"Rejected",      required:false, previewUrl:"#fee2e2" },
  { id:"d8", name:"Character Certificate", type:"PDF",   size:"0 KB",   uploadedOn:"—",           status:"Not Submitted", required:false, previewUrl:"#f3f4f6" },
];

const STUDENTS: Record<string, any> = {
  ZF2526001: {
    id:"ZF2526001", roll:"2526BCA01", name:"Rahul Kumar",
    gender:"Male", dob:"14 Mar 2005", blood:"B+",
    region:"Hinduism", caste:"Sharma (General)", category:"General",
    motherTongue:"Hindi", languages:["Hindi","English"],
    phone:"+91 98765 43210", email:"rahul.kumar@email.com",
    course:"BCA", sem:"Semester 3", section:"A", status:"Active",
    doa:"12 Jul 2025", color:"#7c3aed",
    admissionType:"Regular", nationality:"Indian",
    aadhar:"4521 XXXX XXXX 3456", abc:"7845 1230 0015",
    siblings:[
      { name:"Rohit Kumar", course:"BCA", sem:"Semester 5", color:"#2563eb", roll:"2426BCA11" },
    ],
    parents:[
      { name:"Suresh Kumar",  role:"Father",   occupation:"Government Employee", qualification:"Graduate",         income:"Rs.4,80,000/yr",  phone:"+91 98765 11111", email:"suresh.kumar@email.com",  color:"#7c3aed" },
      { name:"Sunita Kumar",  role:"Mother",   occupation:"Homemaker",           qualification:"Higher Secondary", income:"—",               phone:"+91 98765 22222", email:"sunita.kumar@email.com",  color:"#ec4899" },
      { name:"Ramesh Sharma", role:"Guardian", occupation:"Business",            qualification:"Graduate",         income:"Rs.6,00,000/yr",  phone:"+91 98765 33333", email:"ramesh.sharma@email.com", color:"#0891b2" },
    ],
    documents: DOCS,
    address:{
      currentLine1:"45, Gandhi Nagar, Lane 3", currentLine2:"Near City Mall, Bhopal",
      currentCity:"Bhopal", currentState:"Madhya Pradesh", currentPin:"462001", currentCountry:"India",
      permanentLine1:"45, Gandhi Nagar, Lane 3", permanentLine2:"Near City Mall, Bhopal",
      permanentCity:"Bhopal", permanentState:"Madhya Pradesh", permanentPin:"462001", permanentCountry:"India",
    },
    prevSchool:{ name:"St. Xavier's Senior Secondary School", board:"CBSE", passYear:"2024", subjects:"Physics, Chemistry, Mathematics, English, CS", percent:"82.4%", grade:"First Division" },
    bank:{ name:"State Bank of India", branch:"Bhopal Main Branch", ifsc:"SBIN0001234", account:"3215xxxxxxxx", type:"Savings" },
    medical:{ allergies:["Dust","Pollen"], medications:"None currently", conditions:"None", bloodGroup:"B+", height:"172 cm", weight:"65 kg", vaccinated:"Yes — COVID, Hepatitis B" },
    otherInfo:{ quota:"Open Merit", ncc:"No", sports:"Cricket, Badminton", pw:"No", ex_serviceman:"No", hostelRequired:"Yes", transportRequired:"Yes" },
    hostel:{ name:"A Block Hostel", room:"Room No : 14", floor:"Ground Floor", warden:"Mr. D.K. Tiwari" },
    transport:{ route:"Route 3 – Kolar Road", bus:"Bus No : MH-04-AB-1234", stop:"Gandhi Nagar Stop", driver:"Ramkishan Yadav" },
    academic:{
      cgpa:8.05,
      history:[
        { period:"Semester 1", year:"2024-25", status:"Promoted", sgpa:8.2,  attendance:88 },
        { period:"Semester 2", year:"2024-25", status:"Promoted", sgpa:7.9,  attendance:82 },
        { period:"Semester 3", year:"2025-26", status:"Current",  sgpa:null, attendance:74 },
      ],
      currentSubjects:[
        { code:"BCA301", name:"Data Structures",      internal:22, max_internal:30, attendance:76 },
        { code:"BCA302", name:"Database Management",  internal:25, max_internal:30, attendance:80 },
        { code:"BCA303", name:"Operating Systems",    internal:19, max_internal:30, attendance:68 },
        { code:"BCA304", name:"Computer Networks",    internal:24, max_internal:30, attendance:82 },
        { code:"BCA305", name:"Web Technologies",     internal:27, max_internal:30, attendance:90 },
        { code:"BCA306", name:"Software Engineering", internal:21, max_internal:30, attendance:72 },
      ],
    },
    fees:{
      session:"2025-26", totalFee:58000, totalPaid:56500, totalDue:1500,
      concession:{ type:"Merit Scholarship", amount:5000, status:"Approved", appliedOn:"15 Jul 2025" },
      structure:[
        { head:"Tuition Fee",     amount:45000, paid:45000, due:0    },
        { head:"Development Fee", amount:8000,  paid:8000,  due:0    },
        { head:"Exam Fee",        amount:2500,  paid:2500,  due:0    },
        { head:"Library Fee",     amount:1500,  paid:0,     due:1500 },
        { head:"Sports Fee",      amount:1000,  paid:1000,  due:0    },
      ],
      receipts:[
        { no:"ZF-R-001234", date:"12 Jul 2025", amount:55500, mode:"Online – UPI", heads:"Tuition + Dev + Exam + Sports", status:"Success" },
        { no:"ZF-R-001297", date:"14 Aug 2025", amount:1000,  mode:"Cash",         heads:"Miscellaneous",                 status:"Success" },
      ],
    },
    exam:[
      {
        period:"Semester 1", year:"2024-25", result:"Pass", sgpa:8.2, cgpa:8.2,
        subjects:[
          { code:"BCA101", name:"Fundamentals of Computer", internal:24, external:58, total:82, max:100, grade:"A",  credits:4, status:"Pass" },
          { code:"BCA102", name:"Mathematics I",            internal:20, external:52, total:72, max:100, grade:"B+", credits:4, status:"Pass" },
          { code:"BCA103", name:"Digital Electronics",      internal:22, external:55, total:77, max:100, grade:"B+", credits:3, status:"Pass" },
          { code:"BCA104", name:"C Programming",            internal:26, external:62, total:88, max:100, grade:"A+", credits:4, status:"Pass" },
          { code:"BCA105", name:"English Communication",    internal:23, external:50, total:73, max:100, grade:"B+", credits:2, status:"Pass" },
          { code:"BCA106", name:"Practical – C Lab",        internal:28, external:46, total:74, max:100, grade:"B+", credits:2, status:"Pass" },
        ],
      },
      {
        period:"Semester 2", year:"2024-25", result:"Pass", sgpa:7.9, cgpa:8.05,
        subjects:[
          { code:"BCA201", name:"Data Structures",         internal:21, external:50, total:71, max:100, grade:"B+", credits:4, status:"Pass" },
          { code:"BCA202", name:"Mathematics II",          internal:19, external:48, total:67, max:100, grade:"B",  credits:4, status:"Pass" },
          { code:"BCA203", name:"Object Oriented Prog.",   internal:24, external:58, total:82, max:100, grade:"A",  credits:4, status:"Pass" },
          { code:"BCA204", name:"Computer Architecture",   internal:20, external:45, total:65, max:100, grade:"B",  credits:3, status:"Pass" },
          { code:"BCA205", name:"DBMS Fundamentals",       internal:25, external:60, total:85, max:100, grade:"A",  credits:4, status:"Pass" },
          { code:"BCA206", name:"Practical – OOP Lab",     internal:27, external:44, total:71, max:100, grade:"B+", credits:2, status:"Pass" },
        ],
      },
    ],
    crm:{
      assignedCounselor: "Riya Sharma",
      interestLevel: 4,          // out of 5
      temperature: "Warm",       // Hot / Warm / Cold
      enquiryDate: "28 Jun 2025",
      conversionDate: "12 Jul 2025",
      source: "Walk-in",
      interestedCourse: "BCA",
      lastStatement: "Student said parents are happy with the fee structure. Needs hostel confirmation before final payment.",
      nextFollowUp: null,        // null = converted / no more follow-up
      followUps: [
        { date:"28 Jun 2025", time:"10:30 AM", counselor:"Riya Sharma",    type:"Walk-in",  outcome:"Interested",    notes:"First visit. Collected brochure. Parents accompanied. Interested in BCA. Needs to confirm hostel availability." },
        { date:"02 Jul 2025", time:"03:15 PM", counselor:"Riya Sharma",    type:"Call",     outcome:"Callback",      notes:"Called to check decision. Father was busy. Asked to call again after 5th July." },
        { date:"05 Jul 2025", time:"11:00 AM", counselor:"Amit Verma",     type:"Call",     outcome:"Positive",      notes:"Spoke to father. Confirmed hostel is available. Father asked about fee installment option." },
        { date:"07 Jul 2025", time:"04:00 PM", counselor:"Riya Sharma",    type:"WhatsApp", outcome:"Positive",      notes:"Sent fee structure and hostel details on WhatsApp. Student confirmed they will visit campus again." },
        { date:"10 Jul 2025", time:"02:00 PM", counselor:"Riya Sharma",    type:"Walk-in",  outcome:"Very Positive", notes:"Student and parents visited campus. Took campus tour. Father satisfied with infrastructure. Discussed scholarship eligibility." },
        { date:"12 Jul 2025", time:"10:00 AM", counselor:"Riya Sharma",    type:"Walk-in",  outcome:"Converted",     notes:"Admission form submitted. First installment paid. Allotted Roll No ZF2526001. Hostel Room 14 allotted." },
      ],
    },
    library:{
      cardNo:"LIB-2526-0421", memberSince:"12 Jul 2025",
      totalIssued:3, maxAllowed:3, totalFine:700,
      current:[
        { isbn:"978-81-7350-123-1", title:"Data Structures & Algorithms", author:"T.H. Cormen",    issuedOn:"01 Jun 2026", dueOn:"15 Jun 2026", overdue:27, fine:270 },
        { isbn:"978-81-2651-456-7", title:"Database System Concepts",     author:"Silberschatz",   issuedOn:"05 Jun 2026", dueOn:"19 Jun 2026", overdue:23, fine:230 },
        { isbn:"978-81-3221-789-3", title:"Computer Networks",            author:"A.S. Tanenbaum", issuedOn:"08 Jun 2026", dueOn:"22 Jun 2026", overdue:20, fine:200 },
      ],
      history:[
        { title:"Programming in C",     author:"Dennis Ritchie",   issuedOn:"10 Jan 2026", returnedOn:"24 Jan 2026", fine:0  },
        { title:"Operating Systems",    author:"Galvin",            issuedOn:"05 Sep 2025", returnedOn:"25 Sep 2025", fine:20 },
        { title:"Discrete Mathematics", author:"Rosen",             issuedOn:"15 Nov 2025", returnedOn:"29 Nov 2025", fine:0  },
        { title:"C++ Programming",      author:"Bjarne Stroustrup", issuedOn:"20 Mar 2026", returnedOn:"03 Apr 2026", fine:0  },
      ],
    },
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#7c3aed","#2563eb","#059669","#d97706","#dc2626","#0891b2"];
function avatarColor(name: string) {
  let h = 0; for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name: string) {
  return name.split(" ").map((w: string) => w[0]).slice(0,2).join("").toUpperCase();
}

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  Active:   { background:"#dcfce7", color:"#16a34a" },
  Inactive: { background:"#fee2e2", color:"#dc2626" },
  Detained: { background:"#fef3c7", color:"#d97706" },
};
const DOC_STATUS_STYLE: Record<DocStatus, { bg:string; color:string; icon:string }> = {
  "Verified":      { bg:"#dcfce7", color:"#16a34a", icon:"ri-checkbox-circle-fill" },
  "Pending":       { bg:"#fef9c3", color:"#ca8a04", icon:"ri-time-fill" },
  "Rejected":      { bg:"#fee2e2", color:"#dc2626", icon:"ri-close-circle-fill" },
  "Not Submitted": { bg:"#f3f4f6", color:"#6b7280", icon:"ri-file-unknow-line" },
};
const GRADE_COLOR: Record<string, { bg:string; color:string }> = {
  "A+":{ bg:"#dcfce7", color:"#16a34a" },
  "A": { bg:"#dbeafe", color:"#2563eb" },
  "B+":{ bg:"#e0e7ff", color:"#4f46e5" },
  "B": { bg:"#fef9c3", color:"#ca8a04" },
  "C": { bg:"#fee2e2", color:"#dc2626" },
  "F": { bg:"#fee2e2", color:"#dc2626" },
};

const TABS = ["Student Details","Academic History","Fees","Documents","Exam & Results","Library","CRM"];
const TAB_ICONS: Record<string,string> = {
  "Student Details": "ri-user-3-line",
  "Academic History":"ri-calendar-check-line",
  "Fees":            "ri-money-rupee-circle-line",
  "Documents":       "ri-folder-open-line",
  "Exam & Results":  "ri-file-chart-line",
  "Library":         "ri-book-open-line",
  "CRM":             "ri-customer-service-2-line",
};

// ══════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════
export default function StudentDetailPage() {
  const { id } = useParams<{ id:string }>();
  const [activeTab,    setActiveTab]    = useState("Student Details");
  const [subTab,       setSubTab]       = useState("Hostel");
  const [selectedDoc,  setSelectedDoc]  = useState<StudentDoc>(DOCS[0]);
  const [docStatuses,  setDocStatuses]  = useState<Record<string,DocStatus>>(() =>
    Object.fromEntries(DOCS.map((d) => [d.id, d.status]))
  );
  const [verifyOpen,   setVerifyOpen]   = useState(false);
  const [examSemIdx,   setExamSemIdx]   = useState(0);
  const [feeSubTab,    setFeeSubTab]    = useState<"structure"|"receipts">("structure");

  const s     = STUDENTS[id as string] || STUDENTS["ZF2526001"];
  const color = s.color || avatarColor(s.name);
  const sts   = STATUS_STYLE[s.status] || {};

  const handleStatusChange = (status: DocStatus) => {
    setDocStatuses((prev) => ({ ...prev, [selectedDoc.id]: status }));
    setVerifyOpen(false);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h4 style={{ fontSize:18, fontWeight:800, color:"var(--default-text-color)", marginBottom:2 }}>Student Details</h4>
          <nav><ol className="breadcrumb mb-0" style={{ fontSize:12 }}>
            <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item"><Link href="/students">Students</Link></li>
            <li className="breadcrumb-item active">Student Details</li>
          </ol></nav>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-light" style={{ fontSize:12, border:"1px solid var(--default-border)" }}>
            <i className="ri-lock-line me-1" />Login Details
          </button>
          <button className="btn btn-sm" style={{ fontSize:12, background:"var(--primary-color)", color:"#fff", border:"none" }}>
            <i className="ri-edit-line me-1" />Edit Student
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:"1rem", alignItems:"start" }}>

        {/* ─── LEFT PANEL ─── */}
        <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>

          {/* Profile */}
          <div className="card custom-card mb-0">
            <div className="card-body" style={{ padding:"1.5rem 1.25rem", textAlign:"center" }}>
              <div style={{ position:"relative", display:"inline-block", marginBottom:"0.875rem" }}>
                <div style={{ width:80, height:80, borderRadius:"50%", background:color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:800, margin:"0 auto" }}>
                  {initials(s.name)}
                </div>
                <span style={{ ...sts, position:"absolute", bottom:0, right:-4, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:10, border:"2px solid var(--custom-white)" }}>
                  {s.status}
                </span>
              </div>
              <div style={{ fontWeight:800, fontSize:17, color:"var(--default-text-color)", marginBottom:2 }}>{s.name}</div>
              <div style={{ fontSize:12, color:"var(--primary-color)", fontWeight:600, marginBottom:"0.4rem" }}>{s.id}</div>
              <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:"0.75rem" }}>{s.course} · {s.sem} · Section {s.section}</div>
              <div style={{ display:"flex", justifyContent:"center", gap:6 }}>
                <span style={{ background:"rgba(108,95,252,0.1)", color:"var(--primary-color)", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20 }}>{s.admissionType}</span>
                <span style={{ background:"#dcfce7", color:"#16a34a", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20 }}>{s.nationality}</span>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="card custom-card mb-0">
            <div className="card-header" style={{ padding:"0.625rem 1rem", borderBottom:"1px solid var(--default-border)" }}>
              <span style={{ fontSize:12, fontWeight:700, color:"var(--default-text-color)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Basic Information</span>
            </div>
            <div className="card-body" style={{ padding:"0.5rem 1rem" }}>
              {([
                ["Roll No",s.roll],["Gender",s.gender],["Date of Birth",s.dob],["Blood Group",s.blood],
                ["Religion",s.region],["Caste",s.caste],["Category",s.category],["Mother Tongue",s.motherTongue],
                ["Aadhar No",s.aadhar],["ABC ID",s.abc],["Admission Date",s.doa],
              ] as [string,string][]).map(([label,value]) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"5px 0", borderBottom:"1px dashed var(--default-border)", fontSize:12 }}>
                  <span style={{ color:"var(--text-muted)", fontWeight:500, flexShrink:0, marginRight:8 }}>{label}</span>
                  <span style={{ color:"var(--default-text-color)", fontWeight:600, textAlign:"right" }}>{value}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", fontSize:12 }}>
                <span style={{ color:"var(--text-muted)", fontWeight:500 }}>Language</span>
                <div style={{ display:"flex", gap:4 }}>
                  {s.languages.map((l: string) => (
                    <span key={l} style={{ background:"rgba(108,95,252,0.1)", color:"var(--primary-color)", fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4 }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="card custom-card mb-0">
            <div className="card-header" style={{ padding:"0.625rem 1rem", borderBottom:"1px solid var(--default-border)" }}>
              <span style={{ fontSize:12, fontWeight:700, color:"var(--default-text-color)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Primary Contact</span>
            </div>
            <div className="card-body" style={{ padding:"0.75rem 1rem", display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { label:"Phone Number",  value:s.phone, icon:"ri-phone-line", bg:"rgba(108,95,252,0.1)", ic:"var(--primary-color)" },
                { label:"Email Address", value:s.email, icon:"ri-mail-line",  bg:"rgba(16,185,129,0.1)", ic:"#10b981" },
              ].map(({ label, value, icon, bg, ic }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className={icon} style={{ fontSize:14, color:ic }} />
                  </div>
                  <div>
                    <div style={{ fontSize:10, color:"var(--text-muted)", fontWeight:500 }}>{label}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:"var(--default-text-color)" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Siblings */}
          {s.siblings?.length > 0 && (
            <div className="card custom-card mb-0">
              <div className="card-header" style={{ padding:"0.625rem 1rem", borderBottom:"1px solid var(--default-border)" }}>
                <span style={{ fontSize:12, fontWeight:700, color:"var(--default-text-color)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Sibling Information</span>
              </div>
              <div className="card-body" style={{ padding:"0.75rem 1rem" }}>
                {s.siblings.map((sib: any) => (
                  <div key={sib.name} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:38, height:38, borderRadius:"50%", background:sib.color||avatarColor(sib.name), color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>
                      {initials(sib.name)}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)" }}>{sib.name}</div>
                      <div style={{ fontSize:11, color:"var(--text-muted)" }}>{sib.roll} · {sib.course} · {sib.sem}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button style={{ width:"100%", padding:"10px", background:"var(--primary-color)", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}>
            <i className="ri-money-rupee-circle-line me-2" />Add / View Fees
          </button>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="card custom-card mb-0" style={{ overflow:"hidden" }}>

          {/* Tab bar */}
          <div style={{ borderBottom:"1px solid var(--default-border)", padding:"0 1rem", display:"flex", overflowX:"auto", scrollbarWidth:"none" }}>
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding:"12px 14px", background:"none", border:"none", cursor:"pointer",
                whiteSpace:"nowrap", fontSize:13,
                fontWeight:activeTab===tab ? 700 : 500,
                color:activeTab===tab ? "var(--primary-color)" : "var(--text-muted)",
                borderBottom:activeTab===tab ? "2px solid var(--primary-color)" : "2px solid transparent",
                marginBottom:-1, display:"flex", alignItems:"center", gap:6,
              }}>
                <i className={TAB_ICONS[tab]} style={{ fontSize:14 }} />{tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {activeTab === "Student Details" && (
              <StudentDetailsTab s={s} subTab={subTab} setSubTab={setSubTab} />
            )}
            {activeTab === "Academic History" && (
              <AcademicHistoryTab data={s.academic} />
            )}
            {activeTab === "Fees" && (
              <FeesTab data={s.fees} subTab={feeSubTab} setSubTab={setFeeSubTab} />
            )}
            {activeTab === "Documents" && (
              <DocumentsTab
                docs={DOCS.map((d) => ({ ...d, status: docStatuses[d.id] }))}
                selected={selectedDoc}
                onSelect={setSelectedDoc}
                verifyOpen={verifyOpen}
                setVerifyOpen={setVerifyOpen}
                currentStatus={docStatuses[selectedDoc.id]}
                onStatusChange={handleStatusChange}
              />
            )}
            {activeTab === "Exam & Results" && (
              <ExamResultsTab data={s.exam} semIdx={examSemIdx} setSemIdx={setExamSemIdx} />
            )}
            {activeTab === "Library" && (
              <LibraryTab data={s.library} />
            )}
            {activeTab === "CRM" && (
              <CrmTab data={s.crm} studentName={s.name} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function SecHeader({ icon, title, right }: { icon:string; title:string; right?: React.ReactNode }) {
  return (
    <div style={{ padding:"10px 16px", background:"var(--default-background)", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <i className={icon} style={{ fontSize:15, color:"var(--primary-color)" }} />
        <span style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)" }}>{title}</span>
      </div>
      {right}
    </div>
  );
}
function Sec({ icon, title, children, right }: { icon:string; title:string; children:React.ReactNode; right?:React.ReactNode }) {
  return (
    <div style={{ border:"1px solid var(--default-border)", borderRadius:12, overflow:"hidden", marginBottom:"1rem" }}>
      <SecHeader icon={icon} title={title} right={right} />
      <div style={{ padding:"1rem" }}>{children}</div>
    </div>
  );
}
function IRow({ label, value }: { label:string; value:string }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"5px 0", borderBottom:"1px dashed var(--default-border)", fontSize:13 }}>
      <span style={{ color:"var(--text-muted)", fontWeight:500, flexShrink:0, marginRight:8 }}>{label}</span>
      <span style={{ color:"var(--default-text-color)", fontWeight:600, textAlign:"right" }}>{value}</span>
    </div>
  );
}
function KpiCard({ label, value, icon, bg, color }: { label:string; value:string; icon:string; bg:string; color:string }) {
  return (
    <div style={{ background:bg, borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ width:40, height:40, borderRadius:10, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        <i className={icon} style={{ fontSize:18, color }} />
      </div>
      <div>
        <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:2 }}>{label}</div>
        <div style={{ fontSize:17, fontWeight:800, color }}>{value}</div>
      </div>
    </div>
  );
}
function Th({ children }: { children:string }) {
  return <th style={{ padding:"10px 16px", fontWeight:700, fontSize:12, color:"var(--text-muted)", borderBottom:"1px solid var(--default-border)", whiteSpace:"nowrap" }}>{children}</th>;
}
function Td({ children, style }: { children:React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding:"12px 16px", ...style }}>{children}</td>;
}
function Badge({ label, bg, color }: { label:string; bg:string; color:string }) {
  return <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:bg, color }}>{label}</span>;
}

// ══════════════════════════════════════════════════════════════════
// STUDENT DETAILS TAB
// ══════════════════════════════════════════════════════════════════
function StudentDetailsTab({ s, subTab, setSubTab }: { s:any; subTab:string; setSubTab:(t:string)=>void }) {
  return (
    <div style={{ padding:"1.25rem" }}>

      {/* Parents */}
      <Sec icon="ri-parent-line" title="Parents & Guardian Information">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:"0.75rem" }}>
          {s.parents.map((p: any) => (
            <div key={p.name} style={{ border:"1px solid var(--default-border)", borderRadius:10, padding:"1rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:p.color||avatarColor(p.name), color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 }}>
                  {initials(p.name)}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:"var(--default-text-color)" }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"var(--primary-color)", fontWeight:600 }}>{p.role}</div>
                </div>
              </div>
              {[
                ["ri-briefcase-line", p.occupation],["ri-money-dollar-circle-line", p.income],
                ["ri-phone-line", p.phone],["ri-mail-line", p.email],["ri-book-open-line", p.qualification],
              ].map(([icon, val]) => (
                <div key={icon as string} style={{ fontSize:12, color:"var(--text-muted)", marginBottom:3 }}>
                  <i className={icon as string} style={{ marginRight:4 }} />{val as string}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Sec>

      {/* Address */}
      <Sec icon="ri-map-pin-line" title="Address Details">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
          {[
            { label:"Current Address",   fields:[s.address.currentLine1,  s.address.currentLine2,  s.address.currentCity,  s.address.currentState,  s.address.currentPin,  s.address.currentCountry]  },
            { label:"Permanent Address", fields:[s.address.permanentLine1, s.address.permanentLine2, s.address.permanentCity, s.address.permanentState, s.address.permanentPin, s.address.permanentCountry] },
          ].map(({ label, fields }) => (
            <div key={label}>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--primary-color)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>{label}</div>
              {(["Address Line 1","Address Line 2","City / Tehsil","State","PIN Code","Country"] as string[]).map((k, i) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px dashed var(--default-border)", fontSize:12 }}>
                  <span style={{ color:"var(--text-muted)" }}>{k}</span>
                  <span style={{ fontWeight:600, color:"var(--default-text-color)" }}>{fields[i]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Sec>

      {/* Previous School */}
      <Sec icon="ri-building-4-line" title="Previous School / College Details">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"0.75rem" }}>
          {(["School / College Name","Board / University","Passing Year","Subjects","Percentage","Division / Grade"] as string[]).map((label, i) => {
            const vals = [s.prevSchool.name, s.prevSchool.board, s.prevSchool.passYear, s.prevSchool.subjects, s.prevSchool.percent, s.prevSchool.grade];
            return (
              <div key={label} style={{ background:"var(--default-background)", borderRadius:8, padding:"10px 12px" }}>
                <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:3 }}>{label}</div>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--default-text-color)" }}>{vals[i]}</div>
              </div>
            );
          })}
        </div>
      </Sec>

      {/* Bank + Medical */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        <Sec icon="ri-bank-line" title="Bank Details">
          <IRow label="Bank Name"  value={s.bank.name} />
          <IRow label="Branch"     value={s.bank.branch} />
          <IRow label="IFSC Code"  value={s.bank.ifsc} />
          <IRow label="Account No" value={s.bank.account} />
          <IRow label="Acct. Type" value={s.bank.type} />
        </Sec>
        <Sec icon="ri-heart-pulse-line" title="Medical History">
          <IRow label="Blood Group"  value={s.medical.bloodGroup} />
          <IRow label="Height"       value={s.medical.height} />
          <IRow label="Weight"       value={s.medical.weight} />
          <IRow label="Vaccinated"   value={s.medical.vaccinated} />
          <div style={{ padding:"5px 0", borderBottom:"1px dashed var(--default-border)", fontSize:13 }}>
            <div style={{ color:"var(--text-muted)", fontWeight:500, marginBottom:4 }}>Allergies</div>
            <div style={{ display:"flex", gap:4 }}>
              {s.medical.allergies.map((a: string) => (
                <span key={a} style={{ background:"#fee2e2", color:"#dc2626", fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4 }}>{a}</span>
              ))}
            </div>
          </div>
          <IRow label="Medications" value={s.medical.medications} />
          <IRow label="Conditions"  value={s.medical.conditions} />
        </Sec>
      </div>

      {/* Other Info */}
      <Sec icon="ri-information-line" title="Other Information">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"0.75rem" }}>
          {(["Admission Quota","NCC","Sports / Activity","PH / Differently Abled","Ex-Serviceman Ward","Hostel Required","Transport Required"] as string[]).map((label, i) => {
            const vals = [s.otherInfo.quota, s.otherInfo.ncc, s.otherInfo.sports, s.otherInfo.pw, s.otherInfo.ex_serviceman, s.otherInfo.hostelRequired, s.otherInfo.transportRequired];
            return (
              <div key={label} style={{ background:"var(--default-background)", borderRadius:8, padding:"10px 12px" }}>
                <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:3 }}>{label}</div>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--default-text-color)" }}>{vals[i]}</div>
              </div>
            );
          })}
        </div>
      </Sec>

      {/* Hostel / Transport sub-tabs */}
      <div style={{ border:"1px solid var(--default-border)", borderRadius:12, overflow:"hidden" }}>
        <div style={{ display:"flex", borderBottom:"1px solid var(--default-border)" }}>
          {["Hostel","Transport"].map((t) => (
            <button key={t} onClick={() => setSubTab(t)} style={{
              padding:"10px 20px", background:subTab===t ? "rgba(108,95,252,0.06)" : "none",
              border:"none", cursor:"pointer", fontSize:13,
              fontWeight:subTab===t ? 700 : 500,
              color:subTab===t ? "var(--primary-color)" : "var(--text-muted)",
              borderBottom:subTab===t ? "2px solid var(--primary-color)" : "2px solid transparent",
              marginBottom:-1, display:"flex", alignItems:"center", gap:6,
            }}>
              <i className={t==="Hostel" ? "ri-hotel-line" : "ri-bus-line"} />{t}
            </button>
          ))}
        </div>
        <div style={{ padding:"1rem" }}>
          {subTab === "Hostel" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"0.75rem" }}>
              {([
                ["Hostel Name",s.hostel.name,"ri-building-2-line"],["Room",s.hostel.room,"ri-door-lock-line"],
                ["Floor",s.hostel.floor,"ri-stack-line"],["Warden",s.hostel.warden,"ri-user-star-line"],
              ] as [string,string,string][]).map(([label,value,icon]) => (
                <div key={label} style={{ padding:"12px", background:"var(--default-background)", borderRadius:10, display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:"rgba(108,95,252,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className={icon} style={{ fontSize:16, color:"var(--primary-color)" }} />
                  </div>
                  <div><div style={{ fontSize:11, color:"var(--text-muted)" }}>{label}</div><div style={{ fontSize:12, fontWeight:600, color:"var(--default-text-color)" }}>{value}</div></div>
                </div>
              ))}
            </div>
          )}
          {subTab === "Transport" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"0.75rem" }}>
              {([
                ["Route",s.transport.route,"ri-route-line"],["Bus No",s.transport.bus,"ri-bus-line"],
                ["Bus Stop",s.transport.stop,"ri-map-pin-line"],["Driver",s.transport.driver,"ri-user-line"],
              ] as [string,string,string][]).map(([label,value,icon]) => (
                <div key={label} style={{ padding:"12px", background:"var(--default-background)", borderRadius:10, display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:"rgba(16,185,129,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className={icon} style={{ fontSize:16, color:"#10b981" }} />
                  </div>
                  <div><div style={{ fontSize:11, color:"var(--text-muted)" }}>{label}</div><div style={{ fontSize:12, fontWeight:600, color:"var(--default-text-color)" }}>{value}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ACADEMIC HISTORY TAB
// ══════════════════════════════════════════════════════════════════
function AcademicHistoryTab({ data }: { data:any }) {
  const sgpaColor = (v: number) => v >= 9 ? "#16a34a" : v >= 8 ? "#2563eb" : v >= 7 ? "#ca8a04" : "#dc2626";
  return (
    <div style={{ padding:"1.25rem" }}>
      {/* KPI strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"0.75rem", marginBottom:"1.25rem" }}>
        <KpiCard label="CGPA (Overall)"      value={data.cgpa.toFixed(2)} icon="ri-award-line"        bg="rgba(108,95,252,0.1)" color="var(--primary-color)" />
        <KpiCard label="Semesters Completed" value={`${data.history.filter((h:any)=>h.status!=="Current").length} of 6`} icon="ri-calendar-check-line" bg="rgba(37,99,235,0.1)" color="#2563eb" />
        <KpiCard label="Current Period"      value="Semester 3"           icon="ri-book-open-line"    bg="rgba(16,185,129,0.1)" color="#10b981" />
        <KpiCard label="Current Attendance"  value={`${data.history.find((h:any)=>h.status==="Current")?.attendance??0}%`} icon="ri-user-follow-line" bg="rgba(234,179,8,0.1)" color="#ca8a04" />
      </div>

      {/* Promotion history */}
      <Sec icon="ri-history-line" title="Promotion History">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize:13 }}>
            <thead style={{ background:"var(--default-background)" }}>
              <tr><Th>Academic Period</Th><Th>Session</Th><Th>Status</Th><Th>Attendance</Th><Th>SGPA</Th><Th>CGPA</Th></tr>
            </thead>
            <tbody>
              {data.history.map((row: any) => {
                const cur = row.status === "Current";
                return (
                  <tr key={row.period} style={{ background:cur ? "rgba(108,95,252,0.03)" : "transparent" }}>
                    <Td><div style={{ display:"flex", alignItems:"center", gap:8, fontWeight:600, color:"var(--default-text-color)" }}><div style={{ width:8, height:8, borderRadius:"50%", background:cur?"var(--primary-color)":"#10b981" }} />{row.period}</div></Td>
                    <Td style={{ color:"var(--text-muted)" }}>{row.year}</Td>
                    <Td><Badge label={row.status} bg={cur?"rgba(108,95,252,0.1)":"#dcfce7"} color={cur?"var(--primary-color)":"#16a34a"} /></Td>
                    <Td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:80, height:6, borderRadius:3, background:"var(--default-border)", overflow:"hidden" }}>
                          <div style={{ width:`${row.attendance}%`, height:"100%", background:row.attendance>=75?"#10b981":"#ef4444", borderRadius:3 }} />
                        </div>
                        <span style={{ fontWeight:600, fontSize:12, color:row.attendance>=75?"#16a34a":"#dc2626" }}>{row.attendance}%</span>
                      </div>
                    </Td>
                    <Td>{row.sgpa ? <span style={{ fontWeight:800, color:sgpaColor(row.sgpa), fontSize:14 }}>{row.sgpa.toFixed(1)}</span> : <span style={{ color:"var(--text-muted)", fontSize:12 }}>In Progress</span>}</Td>
                    <Td>{row.sgpa ? <span style={{ fontWeight:600, color:"var(--default-text-color)" }}>{data.cgpa.toFixed(2)}</span> : <span style={{ color:"var(--text-muted)" }}>—</span>}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Sec>

      {/* Current semester attendance */}
      <Sec icon="ri-user-follow-line" title="Semester 3 — Subject Attendance & Internal Marks" right={<span style={{ fontSize:11, color:"var(--text-muted)" }}>2025-26</span>}>
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize:13 }}>
            <thead style={{ background:"var(--default-background)" }}>
              <tr><Th>Code</Th><Th>Subject</Th><Th>Internal Marks</Th><Th>Attendance</Th><Th>Status</Th></tr>
            </thead>
            <tbody>
              {data.currentSubjects.map((sub: any) => {
                const atOk = sub.attendance >= 75;
                return (
                  <tr key={sub.code}>
                    <Td style={{ fontWeight:700, color:"var(--primary-color)", fontFamily:"monospace", fontSize:12 }}>{sub.code}</Td>
                    <Td style={{ fontWeight:600, color:"var(--default-text-color)" }}>{sub.name}</Td>
                    <Td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:80, height:6, borderRadius:3, background:"var(--default-border)", overflow:"hidden" }}>
                          <div style={{ width:`${(sub.internal/sub.max_internal)*100}%`, height:"100%", background:"var(--primary-color)", borderRadius:3 }} />
                        </div>
                        <span style={{ fontWeight:600, fontSize:12 }}>{sub.internal}/{sub.max_internal}</span>
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:80, height:6, borderRadius:3, background:"var(--default-border)", overflow:"hidden" }}>
                          <div style={{ width:`${sub.attendance}%`, height:"100%", background:atOk?"#10b981":"#ef4444", borderRadius:3 }} />
                        </div>
                        <span style={{ fontWeight:600, fontSize:12, color:atOk?"#16a34a":"#dc2626" }}>{sub.attendance}%</span>
                      </div>
                    </Td>
                    <Td><Badge label={atOk?"Regular":"Short"} bg={atOk?"#dcfce7":"#fee2e2"} color={atOk?"#16a34a":"#dc2626"} /></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Sec>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// FEES TAB
// ══════════════════════════════════════════════════════════════════
function FeesTab({ data, subTab, setSubTab }: { data:any; subTab:string; setSubTab:(t:any)=>void }) {
  const paidPct = Math.round((data.totalPaid / data.totalFee) * 100);
  const fmt = (n: number) => "Rs." + n.toLocaleString("en-IN");
  return (
    <div style={{ padding:"1.25rem" }}>
      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"0.75rem", marginBottom:"1.25rem" }}>
        <KpiCard label="Total Fees"      value={fmt(data.totalFee)}         icon="ri-file-list-3-line"      bg="rgba(108,95,252,0.1)" color="var(--primary-color)" />
        <KpiCard label="Total Paid"      value={fmt(data.totalPaid)}        icon="ri-checkbox-circle-line"  bg="rgba(16,185,129,0.1)" color="#10b981" />
        <KpiCard label="Outstanding Due" value={fmt(data.totalDue)}         icon="ri-error-warning-line"    bg="rgba(239,68,68,0.1)"  color="#dc2626" />
        <KpiCard label="Concession"      value={fmt(data.concession.amount)} icon="ri-gift-line"            bg="rgba(234,179,8,0.1)"  color="#ca8a04" />
      </div>

      {/* Progress bar */}
      <div style={{ border:"1px solid var(--default-border)", borderRadius:12, padding:"1rem 1.25rem", marginBottom:"1.25rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)" }}>Payment Progress</span>
          <span style={{ fontSize:13, fontWeight:800, color:paidPct===100?"#16a34a":"var(--primary-color)" }}>{paidPct}% Paid</span>
        </div>
        <div style={{ height:10, borderRadius:5, background:"var(--default-border)", overflow:"hidden", marginBottom:8 }}>
          <div style={{ width:`${paidPct}%`, height:"100%", background:paidPct===100?"#10b981":"var(--primary-color)", borderRadius:5 }} />
        </div>
        <div style={{ display:"flex", gap:16, fontSize:12, flexWrap:"wrap" }}>
          <span style={{ color:"#16a34a" }}><i className="ri-checkbox-circle-fill me-1" />Paid: {fmt(data.totalPaid)}</span>
          <span style={{ color:"#dc2626" }}><i className="ri-time-fill me-1" />Due: {fmt(data.totalDue)}</span>
          <span style={{ color:"#ca8a04", marginLeft:"auto" }}>
            <i className="ri-gift-line me-1" />{data.concession.type} — {fmt(data.concession.amount)} ({data.concession.status})
          </span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ border:"1px solid var(--default-border)", borderRadius:12, overflow:"hidden" }}>
        <div style={{ display:"flex", borderBottom:"1px solid var(--default-border)", background:"var(--default-background)", alignItems:"center" }}>
          {(["structure","receipts"] as const).map((t) => (
            <button key={t} onClick={() => setSubTab(t)} style={{
              padding:"10px 20px", background:subTab===t?"rgba(108,95,252,0.06)":"none",
              border:"none", cursor:"pointer", fontSize:13, fontWeight:subTab===t?700:500,
              color:subTab===t?"var(--primary-color)":"var(--text-muted)",
              borderBottom:subTab===t?"2px solid var(--primary-color)":"2px solid transparent",
              marginBottom:-1, display:"flex", alignItems:"center", gap:6,
            }}>
              <i className={t==="structure"?"ri-list-check-3":"ri-receipt-line"} />
              {t==="structure" ? "Fee Structure" : "Payment Receipts"}
            </button>
          ))}
          <button style={{ marginLeft:"auto", marginRight:12, padding:"5px 14px", borderRadius:8, background:"var(--primary-color)", color:"#fff", border:"none", cursor:"pointer", fontSize:12, fontWeight:600 }}>
            <i className="ri-add-line me-1" />Collect Fee
          </button>
        </div>

        {subTab === "structure" && (
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize:13 }}>
              <thead style={{ background:"var(--default-background)" }}>
                <tr><Th>Fee Head</Th><Th>Total Amount</Th><Th>Paid</Th><Th>Outstanding</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {data.structure.map((row: any) => (
                  <tr key={row.head}>
                    <Td style={{ fontWeight:600, color:"var(--default-text-color)" }}>{row.head}</Td>
                    <Td style={{ color:"var(--text-muted)" }}>{fmt(row.amount)}</Td>
                    <Td style={{ color:"#16a34a", fontWeight:600 }}>{fmt(row.paid)}</Td>
                    <Td style={{ color:row.due>0?"#dc2626":"var(--text-muted)", fontWeight:row.due>0?700:400 }}>{fmt(row.due)}</Td>
                    <Td><Badge label={row.due===0?"Paid":"Pending"} bg={row.due===0?"#dcfce7":"#fee2e2"} color={row.due===0?"#16a34a":"#dc2626"} /></Td>
                  </tr>
                ))}
                <tr style={{ background:"rgba(108,95,252,0.04)" }}>
                  <Td style={{ fontWeight:800, color:"var(--default-text-color)" }}>TOTAL</Td>
                  <Td style={{ fontWeight:700, color:"var(--default-text-color)" }}>{fmt(data.totalFee)}</Td>
                  <Td style={{ fontWeight:700, color:"#16a34a" }}>{fmt(data.totalPaid)}</Td>
                  <Td style={{ fontWeight:700, color:data.totalDue>0?"#dc2626":"var(--text-muted)" }}>{fmt(data.totalDue)}</Td>
                  <Td />
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {subTab === "receipts" && (
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize:13 }}>
              <thead style={{ background:"var(--default-background)" }}>
                <tr><Th>Receipt No</Th><Th>Date</Th><Th>Fee Heads</Th><Th>Amount</Th><Th>Mode</Th><Th>Status</Th><Th>Action</Th></tr>
              </thead>
              <tbody>
                {data.receipts.map((r: any) => (
                  <tr key={r.no}>
                    <Td style={{ fontWeight:700, color:"var(--primary-color)", fontFamily:"monospace", fontSize:12 }}>{r.no}</Td>
                    <Td style={{ color:"var(--text-muted)" }}>{r.date}</Td>
                    <Td style={{ color:"var(--default-text-color)" }}>{r.heads}</Td>
                    <Td style={{ fontWeight:700, color:"#16a34a" }}>{fmt(r.amount)}</Td>
                    <Td style={{ color:"var(--text-muted)" }}>{r.mode}</Td>
                    <Td><Badge label={r.status} bg="#dcfce7" color="#16a34a" /></Td>
                    <Td>
                      <button style={{ width:28, height:28, borderRadius:6, background:"rgba(108,95,252,0.1)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <i className="ri-download-line" style={{ fontSize:13, color:"var(--primary-color)" }} />
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DOCUMENTS TAB
// ══════════════════════════════════════════════════════════════════
function DocumentsTab({
  docs, selected, onSelect, verifyOpen, setVerifyOpen, currentStatus, onStatusChange,
}: {
  docs:StudentDoc[]; selected:StudentDoc; onSelect:(d:StudentDoc)=>void;
  verifyOpen:boolean; setVerifyOpen:(o:boolean)=>void;
  currentStatus:DocStatus; onStatusChange:(s:DocStatus)=>void;
}) {
  const verified = docs.filter((d) => d.status==="Verified").length;
  const pending  = docs.filter((d) => d.status==="Pending").length;
  const rejected = docs.filter((d) => d.status==="Rejected").length;
  const VERIFY_OPTIONS: DocStatus[] = ["Verified","Pending","Rejected","Not Submitted"];
  const cs = DOC_STATUS_STYLE[currentStatus];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", height:680 }}>

      {/* Left: list */}
      <div style={{ borderRight:"1px solid var(--default-border)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"10px 12px", borderBottom:"1px solid var(--default-border)", background:"var(--default-background)", display:"flex", gap:8 }}>
          <StatChip label="Verified" count={verified} color="#16a34a" bg="#dcfce7" />
          <StatChip label="Pending"  count={pending}  color="#ca8a04" bg="#fef9c3" />
          <StatChip label="Rejected" count={rejected} color="#dc2626" bg="#fee2e2" />
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>
          {docs.map((doc) => {
            const ds = DOC_STATUS_STYLE[doc.status];
            const active = selected.id===doc.id;
            return (
              <button key={doc.id} onClick={() => onSelect(doc)} style={{
                width:"100%", textAlign:"left",
                background:active?"rgba(108,95,252,0.06)":"none",
                border:"none", borderBottom:"1px solid var(--default-border)",
                borderLeft:active?"3px solid var(--primary-color)":"3px solid transparent",
                padding:"10px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:10,
              }}>
                <div style={{ width:36, height:36, borderRadius:8, background:doc.previewUrl, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={doc.type==="PDF"?"ri-file-pdf-line":"ri-image-line"} style={{ fontSize:18, color:doc.status==="Rejected"?"#dc2626":"var(--primary-color)" }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"var(--default-text-color)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.name}</div>
                  <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>{doc.size==="0 KB"?"Not uploaded":doc.size}</div>
                </div>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:10, background:ds.bg, color:ds.color, flexShrink:0 }}>{doc.status}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: viewer */}
      <div style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Toolbar */}
        <div style={{ padding:"10px 16px", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"var(--default-background)", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
            <i className={selected.type==="PDF"?"ri-file-pdf-line":"ri-image-line"} style={{ fontSize:18, color:"var(--primary-color)", flexShrink:0 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selected.name}</div>
              <div style={{ fontSize:11, color:"var(--text-muted)" }}>Uploaded on {selected.uploadedOn} · {selected.size}</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <button style={{ height:32, padding:"0 12px", borderRadius:8, border:"1px solid var(--default-border)", background:"none", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:4, color:"var(--default-text-color)" }}>
              <i className="ri-download-line" style={{ fontSize:14 }} />Download
            </button>
            {/* Verify dropdown */}
            <div style={{ position:"relative" }}>
              <button onClick={() => setVerifyOpen(!verifyOpen)} style={{
                height:32, padding:"0 12px", borderRadius:8,
                border:`1px solid ${cs.color}`, background:cs.bg,
                cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:6,
                color:cs.color, fontWeight:700,
              }}>
                <i className={cs.icon} style={{ fontSize:14 }} />
                {currentStatus}
                <i className="ri-arrow-down-s-line" style={{ fontSize:14, transform:verifyOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.15s" }} />
              </button>
              {verifyOpen && (
                <div style={{
                  position:"absolute", top:"calc(100% + 6px)", right:0,
                  minWidth:190, zIndex:9999, borderRadius:10,
                  boxShadow:"0 8px 24px rgba(0,0,0,0.12)",
                  border:"1px solid var(--default-border)",
                  background:"var(--custom-white)", overflow:"hidden",
                }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", padding:"8px 14px 4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                    Document Verification
                  </div>
                  {VERIFY_OPTIONS.map((opt) => {
                    const os = DOC_STATUS_STYLE[opt];
                    const sel = currentStatus===opt;
                    return (
                      <button key={opt} onClick={() => onStatusChange(opt)} style={{
                        display:"flex", alignItems:"center", gap:8, width:"100%", textAlign:"left",
                        padding:"8px 14px", background:sel?os.bg:"none", border:"none", cursor:"pointer",
                        fontSize:12, fontWeight:sel?700:400, color:sel?os.color:"var(--default-text-color)",
                      }}>
                        <i className={os.icon} style={{ fontSize:14, color:os.color }} />
                        {opt}
                        {sel && <i className="ri-check-line" style={{ marginLeft:"auto", color:os.color }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        {selected.size==="0 KB" ? (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, color:"var(--text-muted)" }}>
            <i className="ri-file-unknow-line" style={{ fontSize:56, opacity:0.2 }} />
            <div style={{ fontWeight:600, fontSize:14 }}>Document Not Uploaded</div>
            <div style={{ fontSize:12 }}>Student has not submitted this document yet.</div>
            <button style={{ padding:"8px 18px", borderRadius:8, background:"var(--primary-color)", color:"#fff", border:"none", cursor:"pointer", fontSize:12, fontWeight:600, marginTop:4 }}>
              <i className="ri-upload-line me-1" />Request Upload
            </button>
          </div>
        ) : (
          <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#f8f9fa", overflow:"hidden" }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem", overflow:"hidden" }}>
              <div style={{ width:"100%", maxWidth:520, aspectRatio:"3/4", background:"#fff", borderRadius:8, boxShadow:"0 4px 20px rgba(0,0,0,0.12)", display:"flex", flexDirection:"column", overflow:"hidden", border:"1px solid #e5e7eb" }}>
                <div style={{ background:selected.previewUrl, padding:"1rem 1.5rem", borderBottom:"1px solid #e5e7eb" }}>
                  <div style={{ fontWeight:800, fontSize:14, color:"#1f2937", marginBottom:2 }}>{selected.name}</div>
                  <div style={{ fontSize:11, color:"#6b7280" }}>{selected.type==="PDF"?"PDF Document":"Image File"} · {selected.size}</div>
                </div>
                <div style={{ flex:1, padding:"1.5rem", display:"flex", flexDirection:"column", gap:8, overflow:"hidden" }}>
                  {Array.from({ length:18 }).map((_,i) => (
                    <div key={i} style={{ height:10, borderRadius:3, background:"#e5e7eb", width:`${[90,75,80,95,60,85,70,88,55,82,78,65,90,72,68,85,92,50][i]}%`, opacity:0.7 }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding:"10px 16px", borderTop:"1px solid var(--default-border)", background:"#fff", display:"flex", gap:20, fontSize:12, color:"var(--text-muted)", flexWrap:"wrap" }}>
              <span><b style={{ color:"var(--default-text-color)" }}>Type:</b> {selected.type}</span>
              <span><b style={{ color:"var(--default-text-color)" }}>Size:</b> {selected.size}</span>
              <span><b style={{ color:"var(--default-text-color)" }}>Uploaded:</b> {selected.uploadedOn}</span>
              <span><b style={{ color:"var(--default-text-color)" }}>Required:</b> {selected.required?"Yes":"Optional"}</span>
              <span style={{ marginLeft:"auto" }}><b style={{ color:"var(--default-text-color)" }}>Status:</b> <span style={{ color:DOC_STATUS_STYLE[currentStatus].color, fontWeight:700 }}>{currentStatus}</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatChip({ label, count, color, bg }: { label:string; count:number; color:string; bg:string }) {
  return (
    <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:bg, color, display:"flex", alignItems:"center", gap:4 }}>
      {count} {label}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════
// EXAM & RESULTS TAB
// ══════════════════════════════════════════════════════════════════
function ExamResultsTab({ data, semIdx, setSemIdx }: { data:any[]; semIdx:number; setSemIdx:(i:number)=>void }) {
  const sem = data[semIdx];
  if (!sem) return null;
  const totalMarks   = sem.subjects.reduce((a:number,s:any)=>a+s.total,0);
  const maxMarks     = sem.subjects.reduce((a:number,s:any)=>a+s.max,0);
  const totalCredits = sem.subjects.reduce((a:number,s:any)=>a+s.credits,0);
  const overallPct   = Math.round((totalMarks/maxMarks)*100);

  return (
    <div style={{ padding:"1.25rem" }}>
      {/* Semester selector */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
        {data.map((s:any, i:number) => (
          <button key={i} onClick={() => setSemIdx(i)} style={{
            padding:"7px 16px", borderRadius:20,
            border:`1.5px solid ${i===semIdx?"var(--primary-color)":"var(--default-border)"}`,
            background:i===semIdx?"rgba(108,95,252,0.1)":"none",
            color:i===semIdx?"var(--primary-color)":"var(--text-muted)",
            fontWeight:i===semIdx?700:400, fontSize:12, cursor:"pointer",
          }}>
            {s.period} — {s.year}
          </button>
        ))}
        <span style={{ marginLeft:"auto", fontSize:11, color:"var(--text-muted)" }}>Declared results only</span>
      </div>

      {/* Result KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:"0.75rem", marginBottom:"1.25rem" }}>
        {([
          ["Result",      sem.result,             sem.result==="Pass"?"#16a34a":"#dc2626", "ri-checkbox-circle-line"],
          ["SGPA",        sem.sgpa.toFixed(1),    "var(--primary-color)",                  "ri-award-line"],
          ["CGPA",        sem.cgpa.toFixed(2),    "#2563eb",                               "ri-bar-chart-2-line"],
          ["Total Marks", `${totalMarks}/${maxMarks}`, "var(--default-text-color)",       "ri-file-chart-line"],
          ["Percentage",  `${overallPct}%`,        overallPct>=75?"#16a34a":"#ca8a04",    "ri-percent-line"],
        ] as [string,string,string,string][]).map(([label,value,color,icon]) => (
          <div key={label} style={{ border:"1px solid var(--default-border)", borderRadius:12, padding:"12px 16px", textAlign:"center" }}>
            <i className={icon} style={{ fontSize:20, color, display:"block", marginBottom:4 }} />
            <div style={{ fontSize:18, fontWeight:800, color, marginBottom:2 }}>{value}</div>
            <div style={{ fontSize:11, color:"var(--text-muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Subject table */}
      <Sec icon="ri-file-chart-line" title={`Subject-wise Marks — ${sem.period}`}
        right={
          <button style={{ padding:"5px 14px", borderRadius:8, background:"var(--primary-color)", color:"#fff", border:"none", cursor:"pointer", fontSize:12, fontWeight:600 }}>
            <i className="ri-download-line me-1" />Download Marksheet
          </button>
        }
      >
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize:13 }}>
            <thead style={{ background:"var(--default-background)" }}>
              <tr><Th>Code</Th><Th>Subject</Th><Th>Credits</Th><Th>Internal</Th><Th>External</Th><Th>Total</Th><Th>Grade</Th><Th>Status</Th></tr>
            </thead>
            <tbody>
              {sem.subjects.map((sub: any) => {
                const gc = GRADE_COLOR[sub.grade] || { bg:"#f3f4f6", color:"#6b7280" };
                return (
                  <tr key={sub.code}>
                    <Td style={{ fontWeight:700, color:"var(--primary-color)", fontFamily:"monospace", fontSize:12 }}>{sub.code}</Td>
                    <Td style={{ fontWeight:600, color:"var(--default-text-color)" }}>{sub.name}</Td>
                    <Td style={{ color:"var(--text-muted)", textAlign:"center" }}>{sub.credits}</Td>
                    <Td style={{ textAlign:"center" }}>{sub.internal}</Td>
                    <Td style={{ textAlign:"center" }}>{sub.external}</Td>
                    <Td style={{ fontWeight:700, textAlign:"center" }}>{sub.total}/{sub.max}</Td>
                    <Td><Badge label={sub.grade} bg={gc.bg} color={gc.color} /></Td>
                    <Td><Badge label={sub.status} bg={sub.status==="Pass"?"#dcfce7":"#fee2e2"} color={sub.status==="Pass"?"#16a34a":"#dc2626"} /></Td>
                  </tr>
                );
              })}
              <tr style={{ background:"rgba(108,95,252,0.04)" }}>
                <Td style={{ fontWeight:800, color:"var(--default-text-color)" }} colSpan={2 as any}>TOTAL</Td>
                <Td style={{ fontWeight:700, textAlign:"center" }}>{totalCredits}</Td>
                <Td /><Td />
                <Td style={{ fontWeight:800, textAlign:"center" }}>{totalMarks}/{maxMarks}</Td>
                <Td /><Td />
              </tr>
            </tbody>
          </table>
        </div>
      </Sec>

      {/* Grade legend */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:11, color:"var(--text-muted)" }}>Grade Scale:</span>
        {([["A+",">=90"],["A","75-89"],["B+","60-74"],["B","50-59"],["C","40-49"],["F","<40"]] as [string,string][]).map(([g,r]) => {
          const gc = GRADE_COLOR[g] || { bg:"#f3f4f6", color:"#6b7280" };
          return <span key={g} style={{ fontSize:11, padding:"2px 10px", borderRadius:20, background:gc.bg, color:gc.color, fontWeight:600 }}>{g} ({r}%)</span>;
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// CRM TAB
// ══════════════════════════════════════════════════════════════════
const OUTCOME_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  "Interested":    { bg:"#eff6ff", color:"#2563eb",  icon:"ri-thumb-up-line" },
  "Callback":      { bg:"#fef9c3", color:"#ca8a04",  icon:"ri-phone-line" },
  "Positive":      { bg:"#dcfce7", color:"#16a34a",  icon:"ri-arrow-up-circle-line" },
  "Very Positive": { bg:"#d1fae5", color:"#059669",  icon:"ri-emotion-happy-line" },
  "Converted":     { bg:"#f0fdf4", color:"#16a34a",  icon:"ri-checkbox-circle-fill" },
  "No Response":   { bg:"#fee2e2", color:"#dc2626",  icon:"ri-phone-off-line" },
  "Not Interested":{ bg:"#f3f4f6", color:"#6b7280",  icon:"ri-thumb-down-line" },
};
const TOUCH_TYPE_ICON: Record<string, string> = {
  "Walk-in": "ri-walk-line", "Call":"ri-phone-line", "WhatsApp":"ri-whatsapp-line",
  "Email":"ri-mail-line", "SMS":"ri-message-2-line",
};
const TEMP_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  "Hot":  { color:"#dc2626", bg:"#fef2f2", icon:"ri-fire-line" },
  "Warm": { color:"#d97706", bg:"#fffbeb", icon:"ri-sun-line" },
  "Cold": { color:"#2563eb", bg:"#eff6ff", icon:"ri-snowflake-line" },
};

function CrmTab({ data, studentName }: { data: any; studentName: string }) {
  const temp = TEMP_CONFIG[data.temperature] ?? TEMP_CONFIG["Warm"];
  const stars = Array.from({ length: 5 });

  return (
    <div style={{ padding:"1.25rem" }}>

      {/* ── Overview KPIs ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.75rem", marginBottom:"1.25rem" }}>
        {/* Temperature */}
        <div style={{ background: temp.bg, borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
            <i className={temp.icon} style={{ fontSize:18, color: temp.color }} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:2 }}>Temperature</div>
            <div style={{ fontSize:17, fontWeight:800, color: temp.color }}>{data.temperature}</div>
          </div>
        </div>
        {/* Interest */}
        <div style={{ background:"rgba(108,95,252,0.08)", borderRadius:12, padding:"14px 16px" }}>
          <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:6 }}>Interest Level</div>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            {stars.map((_,i) => (
              <i key={i} className={i < data.interestLevel ? "ri-star-fill" : "ri-star-line"} style={{ fontSize:16, color: i < data.interestLevel ? "#f59e0b" : "var(--default-border)" }} />
            ))}
            <span style={{ fontSize:13, fontWeight:700, color:"var(--primary-color)", marginLeft:4 }}>{data.interestLevel}/5</span>
          </div>
        </div>
        {/* Source */}
        <div style={{ background:"rgba(16,185,129,0.08)", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
            <i className="ri-map-pin-user-line" style={{ fontSize:18, color:"#10b981" }} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:2 }}>Lead Source</div>
            <div style={{ fontSize:15, fontWeight:800, color:"#10b981" }}>{data.source}</div>
          </div>
        </div>
        {/* Total touchpoints */}
        <div style={{ background:"rgba(37,99,235,0.08)", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
            <i className="ri-contacts-line" style={{ fontSize:18, color:"#2563eb" }} />
          </div>
          <div>
            <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:2 }}>Touchpoints</div>
            <div style={{ fontSize:17, fontWeight:800, color:"#2563eb" }}>{data.followUps.length}</div>
          </div>
        </div>
      </div>

      {/* ── Counselor + Status row ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", marginBottom:"1.25rem" }}>
        {/* Counselor info */}
        <div style={{ border:"1px solid var(--default-border)", borderRadius:12, overflow:"hidden" }}>
          <div style={{ padding:"10px 16px", background:"var(--default-background)", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", gap:8 }}>
            <i className="ri-customer-service-2-line" style={{ fontSize:14, color:"var(--primary-color)" }} />
            <span style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)" }}>Assigned Counselor</span>
          </div>
          <div style={{ padding:"1rem", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,var(--primary-color),#a78bfa)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, flexShrink:0 }}>
              {data.assignedCounselor.split(" ").map((w: string) => w[0]).join("")}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:"var(--default-text-color)" }}>{data.assignedCounselor}</div>
              <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>Admission Counselor</div>
              <div style={{ display:"flex", gap:8, marginTop:6 }}>
                <button style={{ fontSize:11, padding:"3px 10px", borderRadius:6, background:"rgba(108,95,252,0.1)", color:"var(--primary-color)", border:"none", cursor:"pointer", fontWeight:600 }}>
                  <i className="ri-phone-line" style={{ marginRight:3 }} />Call
                </button>
                <button style={{ fontSize:11, padding:"3px 10px", borderRadius:6, background:"rgba(16,185,129,0.1)", color:"#10b981", border:"none", cursor:"pointer", fontWeight:600 }}>
                  <i className="ri-message-3-line" style={{ marginRight:3 }} />Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry → Conversion summary */}
        <div style={{ border:"1px solid var(--default-border)", borderRadius:12, overflow:"hidden" }}>
          <div style={{ padding:"10px 16px", background:"var(--default-background)", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", gap:8 }}>
            <i className="ri-route-line" style={{ fontSize:14, color:"var(--primary-color)" }} />
            <span style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)" }}>Conversion Summary</span>
          </div>
          <div style={{ padding:"1rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
            {[
              { label:"Enquiry Date",   value: data.enquiryDate },
              { label:"Converted On",   value: data.conversionDate ?? "—" },
              { label:"Interested In",  value: data.interestedCourse },
              { label:"Next Follow-up", value: data.nextFollowUp ?? "Converted — None" },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding:"8px 0", borderBottom:"1px dashed var(--default-border)" }}>
                <div style={{ fontSize:11, color:"var(--text-muted)" }}>{label}</div>
                <div style={{ fontSize:12, fontWeight:700, color:"var(--default-text-color)", marginTop:2 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Last Statement ── */}
      <div style={{ border:"1px solid rgba(108,95,252,0.25)", borderRadius:12, overflow:"hidden", marginBottom:"1.25rem", background:"rgba(108,95,252,0.03)" }}>
        <div style={{ padding:"10px 16px", background:"rgba(108,95,252,0.08)", borderBottom:"1px solid rgba(108,95,252,0.15)", display:"flex", alignItems:"center", gap:8 }}>
          <i className="ri-chat-quote-line" style={{ fontSize:14, color:"var(--primary-color)" }} />
          <span style={{ fontSize:13, fontWeight:700, color:"var(--primary-color)" }}>Last Student Statement</span>
          <span style={{ marginLeft:"auto", fontSize:11, color:"var(--text-muted)" }}>Recorded by {data.assignedCounselor} · {data.followUps[data.followUps.length - 1]?.date}</span>
        </div>
        <div style={{ padding:"1rem 1.25rem" }}>
          <i className="ri-double-quotes-l" style={{ fontSize:22, color:"var(--primary-color)", opacity:0.3, display:"block", marginBottom:4 }} />
          <p style={{ fontSize:14, color:"var(--default-text-color)", lineHeight:1.7, margin:0, fontStyle:"italic" }}>{data.lastStatement}</p>
        </div>
      </div>

      {/* ── Follow-up Timeline ── */}
      <div style={{ border:"1px solid var(--default-border)", borderRadius:12, overflow:"hidden" }}>
        <div style={{ padding:"10px 16px", background:"var(--default-background)", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <i className="ri-timeline-view" style={{ fontSize:14, color:"var(--primary-color)" }} />
            <span style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)" }}>Follow-up Timeline</span>
          </div>
          <Badge label={`${data.followUps.length} Touchpoints`} bg="rgba(108,95,252,0.1)" color="var(--primary-color)" />
        </div>
        <div style={{ padding:"1.25rem" }}>
          <div style={{ position:"relative", paddingLeft:32 }}>
            {/* Vertical line */}
            <div style={{ position:"absolute", left:11, top:8, bottom:8, width:2, background:"var(--default-border)", borderRadius:2 }} />

            {[...data.followUps].reverse().map((fu: any, i: number) => {
              const os  = OUTCOME_STYLE[fu.outcome] ?? OUTCOME_STYLE["Interested"];
              const typeIcon = TOUCH_TYPE_ICON[fu.type] ?? "ri-question-line";
              const isLast = i === 0;
              return (
                <div key={i} style={{ position:"relative", marginBottom: i < data.followUps.length - 1 ? "1.5rem" : 0 }}>
                  {/* Dot */}
                  <div style={{
                    position:"absolute", left:-32, top:4,
                    width:22, height:22, borderRadius:"50%",
                    background: isLast ? "var(--primary-color)" : "#fff",
                    border: `2px solid ${isLast ? "var(--primary-color)" : "var(--default-border)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    zIndex:1,
                  }}>
                    <i className={typeIcon} style={{ fontSize:11, color: isLast ? "#fff" : "var(--text-muted)" }} />
                  </div>

                  <div style={{ background: isLast ? "rgba(108,95,252,0.04)" : "#fff", border:`1px solid ${isLast ? "rgba(108,95,252,0.2)" : "var(--default-border)"}`, borderRadius:10, padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, flexWrap:"wrap", gap:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:"var(--default-text-color)" }}>{fu.date}</span>
                        <span style={{ fontSize:11, color:"var(--text-muted)" }}>{fu.time}</span>
                        <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:6, background:"rgba(0,0,0,0.05)", color:"var(--text-muted)" }}>
                          <i className={typeIcon} style={{ marginRight:3 }} />{fu.type}
                        </span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:11, color:"var(--text-muted)" }}>by {fu.counselor}</span>
                        <span style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:20, background:os.bg, color:os.color }}>
                          <i className={os.icon} style={{ marginRight:3, fontSize:10 }} />{fu.outcome}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize:13, color:"var(--default-text-color)", margin:0, lineHeight:1.6 }}>{fu.notes}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// LIBRARY TAB
// ══════════════════════════════════════════════════════════════════
function LibraryTab({ data }: { data:any }) {
  return (
    <div style={{ padding:"1.25rem" }}>
      {/* Card + KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr repeat(3, 1fr)", gap:"0.75rem", marginBottom:"1.25rem" }}>
        <div style={{ background:"linear-gradient(135deg, var(--primary-color) 0%, #a78bfa 100%)", borderRadius:14, padding:"1rem 1.25rem", color:"#fff" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <i className="ri-book-open-line" style={{ fontSize:20 }} />
            <span style={{ fontWeight:700, fontSize:14 }}>Library Card</span>
          </div>
          <div style={{ fontSize:20, fontWeight:800, letterSpacing:1, marginBottom:4 }}>{data.cardNo}</div>
          <div style={{ fontSize:11, opacity:0.8 }}>Member since {data.memberSince}</div>
        </div>
        <KpiCard label="Books Issued"    value={`${data.totalIssued} / ${data.maxAllowed}`} icon="ri-book-2-line"          bg="rgba(37,99,235,0.1)"  color="#2563eb" />
        <KpiCard label="Total Fine Due"  value={`Rs.${data.totalFine}`}                     icon="ri-error-warning-line"   bg="rgba(239,68,68,0.1)"  color="#dc2626" />
        <KpiCard label="Slots Available" value={`${data.maxAllowed-data.totalIssued} slots`} icon="ri-inbox-unarchive-line" bg="rgba(16,185,129,0.1)" color="#10b981" />
      </div>

      {/* Currently issued */}
      <Sec icon="ri-book-2-line" title="Currently Issued Books"
        right={<Badge label={`${data.current.length} Active`} bg="#fee2e2" color="#dc2626" />}
      >
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize:13 }}>
            <thead style={{ background:"var(--default-background)" }}>
              <tr><Th>ISBN</Th><Th>Book Title</Th><Th>Author</Th><Th>Issued On</Th><Th>Due Date</Th><Th>Overdue</Th><Th>Fine</Th><Th>Action</Th></tr>
            </thead>
            <tbody>
              {data.current.map((b: any) => (
                <tr key={b.isbn}>
                  <Td style={{ fontFamily:"monospace", fontSize:11, color:"var(--text-muted)" }}>{b.isbn}</Td>
                  <Td style={{ fontWeight:600, color:"var(--default-text-color)" }}>{b.title}</Td>
                  <Td style={{ color:"var(--text-muted)" }}>{b.author}</Td>
                  <Td style={{ color:"var(--text-muted)" }}>{b.issuedOn}</Td>
                  <Td style={{ color:"#dc2626", fontWeight:600 }}>{b.dueOn}</Td>
                  <Td><Badge label={`${b.overdue} days`} bg="#fee2e2" color="#dc2626" /></Td>
                  <Td style={{ fontWeight:700, color:"#dc2626" }}>Rs.{b.fine}</Td>
                  <Td>
                    <button style={{ padding:"4px 12px", borderRadius:6, background:"rgba(16,185,129,0.1)", color:"#10b981", border:"1px solid #10b981", cursor:"pointer", fontSize:11, fontWeight:600 }}>Return</button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sec>

      {/* History */}
      <Sec icon="ri-history-line" title="Issue History">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize:13 }}>
            <thead style={{ background:"var(--default-background)" }}>
              <tr><Th>Book Title</Th><Th>Author</Th><Th>Issued On</Th><Th>Returned On</Th><Th>Fine Paid</Th></tr>
            </thead>
            <tbody>
              {data.history.map((b: any, i: number) => (
                <tr key={i}>
                  <Td style={{ fontWeight:600, color:"var(--default-text-color)" }}><i className="ri-book-line me-2" style={{ color:"var(--text-muted)" }} />{b.title}</Td>
                  <Td style={{ color:"var(--text-muted)" }}>{b.author}</Td>
                  <Td style={{ color:"var(--text-muted)" }}>{b.issuedOn}</Td>
                  <Td><Badge label={b.returnedOn} bg="#dcfce7" color="#16a34a" /></Td>
                  <Td style={{ fontWeight:700, color:b.fine>0?"#dc2626":"#16a34a" }}>{b.fine>0?`Rs.${b.fine}`:"NIL"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sec>
    </div>
  );
}
