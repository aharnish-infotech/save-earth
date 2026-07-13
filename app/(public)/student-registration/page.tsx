"use client";

/**
 * ZeroForm Campus — Student Registration Form
 * PUBLIC route: /student-registration  (no login required)
 * Share the link directly with students.
 * Replace course/specialization lists with real API data when backend is ready.
 */

import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type FormData = {
  // Step 1 — Personal
  firstName: string; middleName: string; lastName: string;
  dob: string; gender: string; category: string; religion: string;
  bloodGroup: string; aadhar: string; photoName: string;
  // Step 2 — Contact & Address
  mobile: string; alternateMobile: string; email: string;
  permAddr1: string; permAddr2: string; permCity: string; permState: string; permPin: string;
  sameAsPerm: boolean;
  corrAddr1: string; corrAddr2: string; corrCity: string; corrState: string; corrPin: string;
  // Step 3 — Academic Preference
  courseType: string; course: string; specialization: string;
  academicSession: string; admissionType: string;
  // Step 4 — Previous Education
  sscBoard: string; sscSchool: string; sscYear: string; sscTotal: string; sscObtained: string;
  hscBoard: string; hscSchool: string; hscYear: string; hscTotal: string; hscObtained: string; hscStream: string;
  gradInstitute: string; gradUniversity: string; gradCourse: string; gradYear: string; gradTotal: string; gradObtained: string;
  // Step 5 — Guardian
  fatherName: string; fatherOccupation: string; fatherMobile: string; fatherIncome: string;
  motherName: string; motherOccupation: string; motherMobile: string;
  guardianName: string; guardianRelation: string; guardianMobile: string; guardianAddress: string;
  // Step 6 — Documents & Declaration
  docs: Record<string, string>;
  declaration: boolean;
};

const INIT: FormData = {
  firstName: "", middleName: "", lastName: "",
  dob: "", gender: "", category: "", religion: "", bloodGroup: "", aadhar: "", photoName: "",
  mobile: "", alternateMobile: "", email: "",
  permAddr1: "", permAddr2: "", permCity: "", permState: "", permPin: "",
  sameAsPerm: false,
  corrAddr1: "", corrAddr2: "", corrCity: "", corrState: "", corrPin: "",
  courseType: "", course: "", specialization: "", academicSession: "", admissionType: "",
  sscBoard: "", sscSchool: "", sscYear: "", sscTotal: "", sscObtained: "",
  hscBoard: "", hscSchool: "", hscYear: "", hscTotal: "", hscObtained: "", hscStream: "",
  gradInstitute: "", gradUniversity: "", gradCourse: "", gradYear: "", gradTotal: "", gradObtained: "",
  fatherName: "", fatherOccupation: "", fatherMobile: "", fatherIncome: "",
  motherName: "", motherOccupation: "", motherMobile: "",
  guardianName: "", guardianRelation: "", guardianMobile: "", guardianAddress: "",
  docs: {},
  declaration: false,
};

const STEPS = [
  { id: 1, label: "Personal Info",   icon: "ri-user-3-line" },
  { id: 2, label: "Contact",         icon: "ri-map-pin-2-line" },
  { id: 3, label: "Academic",        icon: "ri-graduation-cap-line" },
  { id: 4, label: "Education",       icon: "ri-book-open-line" },
  { id: 5, label: "Guardian",        icon: "ri-group-line" },
  { id: 6, label: "Documents",       icon: "ri-file-upload-line" },
];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
  "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar","Chandigarh","Dadra & Nagar Haveli","Daman & Diu","Delhi","Jammu & Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

const COURSES: Record<string, { courses: string[]; specializations: Record<string, string[]> }> = {
  "UG": {
    courses: ["B.A.", "B.Sc.", "B.Com.", "BCA", "BBA", "B.Tech.", "B.Pharm.", "B.Ed.", "LLB", "MBBS", "BDS", "B.Arch."],
    specializations: {
      "B.A.": ["English","Hindi","Political Science","History","Sociology","Psychology","Economics"],
      "B.Sc.": ["Physics","Chemistry","Mathematics","Biology","Computer Science","Biotechnology","Microbiology"],
      "B.Com.": ["General","Computer Applications","Accounting & Finance"],
      "BCA": ["General"],
      "BBA": ["General","Marketing","Finance","HR"],
      "B.Tech.": ["CSE","IT","Mechanical","Civil","Electrical","Electronics"],
      "B.Pharm.": ["General"],
      "B.Ed.": ["General"],
      "LLB": ["General"],
      "MBBS": ["General"],
      "BDS": ["General"],
      "B.Arch.": ["General"],
    },
  },
  "PG": {
    courses: ["M.A.", "M.Sc.", "M.Com.", "MCA", "MBA", "M.Tech.", "M.Pharm.", "M.Ed.", "LLM"],
    specializations: {
      "M.A.": ["English","Hindi","Political Science","History","Sociology","Psychology","Economics"],
      "M.Sc.": ["Physics","Chemistry","Mathematics","Biology","Computer Science","Biotechnology"],
      "M.Com.": ["General","Accounting & Finance"],
      "MCA": ["General"],
      "MBA": ["Marketing","Finance","HR","Operations","IT"],
      "M.Tech.": ["CSE","IT","Mechanical","Civil","Electrical","Electronics"],
      "M.Pharm.": ["General"],
      "M.Ed.": ["General"],
      "LLM": ["General"],
    },
  },
  "Diploma / Certificate": {
    courses: ["Diploma in Engineering","Diploma in Pharmacy","Certificate in Computer","Certificate in Nursing","PGDCA","DCA"],
    specializations: {
      "Diploma in Engineering": ["Mechanical","Civil","Electrical","Electronics","Computer"],
      "Diploma in Pharmacy": ["General"],
      "Certificate in Computer": ["General"],
      "Certificate in Nursing": ["General"],
      "PGDCA": ["General"],
      "DCA": ["General"],
    },
  },
};

// ─── Shared Input Components ───────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", fontSize: 13, borderRadius: 8,
  border: "1.5px solid #e5e7eb", outline: "none", color: "#1f2937",
  background: "#fafafa", fontFamily: "inherit",
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4,
};
const reqStar = <span style={{ color: "#dc2626" }}>*</span>;

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={labelStyle}>{label} {required && reqStar}</label>
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "2px solid #ede9fe" }}>
      <h5 style={{ fontSize: 15, fontWeight: 700, color: "#4f46e5", margin: 0 }}>{title}</h5>
      {subtitle && <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

// ─── Step 1: Personal Information ─────────────────────────────────────────────
function Step1({ d, set }: { d: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div>
      <SectionTitle title="Personal Information" subtitle="Basic details of the applicant" />
      <div className="row g-3">
        <div className="col-md-4">
          <Field label="First Name" required>
            <input style={inputStyle} value={d.firstName} onChange={e => set("firstName", e.target.value)} placeholder="As per documents" />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Middle Name">
            <input style={inputStyle} value={d.middleName} onChange={e => set("middleName", e.target.value)} placeholder="Optional" />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Last Name / Surname" required>
            <input style={inputStyle} value={d.lastName} onChange={e => set("lastName", e.target.value)} placeholder="As per documents" />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Date of Birth" required>
            <input style={inputStyle} type="date" value={d.dob} onChange={e => set("dob", e.target.value)} max={new Date().toISOString().split("T")[0]} />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Gender" required>
            <select style={selectStyle} value={d.gender} onChange={e => set("gender", e.target.value)}>
              <option value="">Select Gender</option>
              <option>Male</option><option>Female</option><option>Transgender</option><option>Prefer not to say</option>
            </select>
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Blood Group">
            <select style={selectStyle} value={d.bloodGroup} onChange={e => set("bloodGroup", e.target.value)}>
              <option value="">Select Blood Group</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <option key={b}>{b}</option>)}
            </select>
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Category" required>
            <select style={selectStyle} value={d.category} onChange={e => set("category", e.target.value)}>
              <option value="">Select Category</option>
              <option>General</option><option>OBC</option><option>SC</option><option>ST</option>
              <option>NT-A</option><option>NT-B</option><option>NT-C</option><option>NT-D</option>
              <option>VJ-A</option><option>EWS</option>
            </select>
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Religion">
            <select style={selectStyle} value={d.religion} onChange={e => set("religion", e.target.value)}>
              <option value="">Select Religion</option>
              <option>Hindu</option><option>Muslim</option><option>Christian</option>
              <option>Sikh</option><option>Buddhist</option><option>Jain</option><option>Other</option>
            </select>
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Aadhar Number">
            <input style={inputStyle} value={d.aadhar} onChange={e => set("aadhar", e.target.value.replace(/\D/g,"").slice(0,12))}
              placeholder="12-digit Aadhar" maxLength={12} />
          </Field>
        </div>
        <div className="col-md-12">
          <Field label="Passport-size Photograph" required>
            <div style={{ border: "1.5px dashed #c4b5fd", borderRadius: 8, padding: "12px 16px", background: "#faf5ff", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="ri-image-add-line" style={{ color: "#7c3aed", fontSize: 20 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                  {d.photoName || "Click to upload photo"}
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>JPG or PNG, max 200KB, passport size</div>
              </div>
              <label style={{ cursor: "pointer", padding: "6px 14px", borderRadius: 6, background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                Browse
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => set("photoName", e.target.files?.[0]?.name ?? "")} />
              </label>
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Contact & Address ────────────────────────────────────────────────
function Step2({ d, set, setB }: { d: FormData; set: (k: keyof FormData, v: string) => void; setB: (k: keyof FormData, v: boolean) => void }) {
  const handleSameAsPerm = (checked: boolean) => {
    setB("sameAsPerm", checked);
    if (checked) {
      set("corrAddr1", d.permAddr1); set("corrAddr2", d.permAddr2);
      set("corrCity", d.permCity); set("corrState", d.permState); set("corrPin", d.permPin);
    }
  };
  return (
    <div>
      <SectionTitle title="Contact Information" subtitle="Mobile, email and address details" />
      <div className="row g-3">
        <div className="col-md-4">
          <Field label="Mobile Number" required>
            <input style={inputStyle} value={d.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g,"").slice(0,10))}
              placeholder="10-digit mobile" maxLength={10} />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Alternate Mobile">
            <input style={inputStyle} value={d.alternateMobile} onChange={e => set("alternateMobile", e.target.value.replace(/\D/g,"").slice(0,10))}
              placeholder="Optional" maxLength={10} />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Email Address" required>
            <input style={inputStyle} type="email" value={d.email} onChange={e => set("email", e.target.value)} placeholder="student@example.com" />
          </Field>
        </div>
      </div>

      <SectionTitle title="Permanent Address" subtitle="As per documents / Aadhar" />
      <div className="row g-3">
        <div className="col-md-6">
          <Field label="Address Line 1" required>
            <input style={inputStyle} value={d.permAddr1} onChange={e => set("permAddr1", e.target.value)} placeholder="House No., Street, Area" />
          </Field>
        </div>
        <div className="col-md-6">
          <Field label="Address Line 2">
            <input style={inputStyle} value={d.permAddr2} onChange={e => set("permAddr2", e.target.value)} placeholder="Landmark, Village (Optional)" />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="City / Town" required>
            <input style={inputStyle} value={d.permCity} onChange={e => set("permCity", e.target.value)} placeholder="City" />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="State" required>
            <select style={selectStyle} value={d.permState} onChange={e => set("permState", e.target.value)}>
              <option value="">Select State</option>
              {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="PIN Code" required>
            <input style={inputStyle} value={d.permPin} onChange={e => set("permPin", e.target.value.replace(/\D/g,"").slice(0,6))}
              placeholder="6-digit PIN" maxLength={6} />
          </Field>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0.5rem 0 1rem" }}>
        <input type="checkbox" id="sameAsPerm" checked={d.sameAsPerm}
          onChange={e => handleSameAsPerm(e.target.checked)} style={{ accentColor: "#7c3aed", width: 15, height: 15 }} />
        <label htmlFor="sameAsPerm" style={{ fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
          Correspondence address same as permanent address
        </label>
      </div>

      {!d.sameAsPerm && (
        <>
          <SectionTitle title="Correspondence Address" subtitle="Where to send communications" />
          <div className="row g-3">
            <div className="col-md-6">
              <Field label="Address Line 1" required>
                <input style={inputStyle} value={d.corrAddr1} onChange={e => set("corrAddr1", e.target.value)} placeholder="House No., Street, Area" />
              </Field>
            </div>
            <div className="col-md-6">
              <Field label="Address Line 2">
                <input style={inputStyle} value={d.corrAddr2} onChange={e => set("corrAddr2", e.target.value)} placeholder="Landmark (Optional)" />
              </Field>
            </div>
            <div className="col-md-4">
              <Field label="City / Town" required>
                <input style={inputStyle} value={d.corrCity} onChange={e => set("corrCity", e.target.value)} placeholder="City" />
              </Field>
            </div>
            <div className="col-md-4">
              <Field label="State" required>
                <select style={selectStyle} value={d.corrState} onChange={e => set("corrState", e.target.value)}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div className="col-md-4">
              <Field label="PIN Code" required>
                <input style={inputStyle} value={d.corrPin} onChange={e => set("corrPin", e.target.value.replace(/\D/g,"").slice(0,6))}
                  placeholder="6-digit PIN" maxLength={6} />
              </Field>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Step 3: Academic Preference ──────────────────────────────────────────────
function Step3({ d, set }: { d: FormData; set: (k: keyof FormData, v: string) => void }) {
  const courseList = d.courseType ? (COURSES[d.courseType]?.courses ?? []) : [];
  const specList   = d.course    ? (COURSES[d.courseType]?.specializations?.[d.course] ?? []) : [];
  return (
    <div>
      <SectionTitle title="Academic Preference" subtitle="Course and session you are applying for" />
      <div className="row g-3">
        <div className="col-md-6">
          <Field label="Course Type" required>
            <select style={selectStyle} value={d.courseType} onChange={e => { set("courseType", e.target.value); set("course", ""); set("specialization", ""); }}>
              <option value="">Select Course Type</option>
              <option>UG</option><option>PG</option><option>Diploma / Certificate</option>
            </select>
          </Field>
        </div>
        <div className="col-md-6">
          <Field label="Course" required>
            <select style={selectStyle} value={d.course} onChange={e => { set("course", e.target.value); set("specialization", ""); }} disabled={!d.courseType}>
              <option value="">Select Course</option>
              {courseList.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div className="col-md-6">
          <Field label="Specialization / Stream">
            <select style={selectStyle} value={d.specialization} onChange={e => set("specialization", e.target.value)} disabled={!d.course}>
              <option value="">Select Specialization</option>
              {specList.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Academic Session" required>
            <select style={selectStyle} value={d.academicSession} onChange={e => set("academicSession", e.target.value)}>
              <option value="">Select Session</option>
              <option>2025-26</option><option>2026-27</option><option>2027-28</option>
            </select>
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Admission Type" required>
            <select style={selectStyle} value={d.admissionType} onChange={e => set("admissionType", e.target.value)}>
              <option value="">Select Type</option>
              <option>Fresh Admission</option>
              <option>DHE / Government Counselling</option>
              <option>Lateral Entry</option>
              <option>Management Quota</option>
            </select>
          </Field>
        </div>
      </div>
      {d.admissionType === "DHE / Government Counselling" && (
        <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 8, padding: "10px 14px", marginTop: 8, fontSize: 13, color: "#92400e" }}>
          <i className="ri-information-line" style={{ marginRight: 6 }} />
          For DHE admissions, your Merit Number and DHE token will be required during document verification.
        </div>
      )}
    </div>
  );
}

// ─── Step 4: Previous Education ───────────────────────────────────────────────
function Step4({ d, set }: { d: FormData; set: (k: keyof FormData, v: string) => void; isPG: boolean }) {
  const isPG = d.courseType === "PG";
  return (
    <div>
      <SectionTitle title="SSC / 10th Standard" subtitle="Secondary School Certificate details" />
      <div className="row g-3">
        <div className="col-md-6">
          <Field label="Board Name" required>
            <select style={selectStyle} value={d.sscBoard} onChange={e => set("sscBoard", e.target.value)}>
              <option value="">Select Board</option>
              <option>Maharashtra State Board (MSBSHSE)</option><option>CBSE</option><option>ICSE</option>
              <option>UP Board</option><option>MP Board</option><option>Other State Board</option><option>International Board</option>
            </select>
          </Field>
        </div>
        <div className="col-md-6">
          <Field label="School Name" required>
            <input style={inputStyle} value={d.sscSchool} onChange={e => set("sscSchool", e.target.value)} placeholder="Full name of school" />
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Year of Passing" required>
            <input style={inputStyle} value={d.sscYear} onChange={e => set("sscYear", e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="YYYY" maxLength={4} />
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Total Marks" required>
            <input style={inputStyle} value={d.sscTotal} onChange={e => set("sscTotal", e.target.value)} placeholder="e.g. 600" />
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Marks Obtained" required>
            <input style={inputStyle} value={d.sscObtained} onChange={e => set("sscObtained", e.target.value)} placeholder="e.g. 520" />
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Percentage">
            <input style={{ ...inputStyle, background: "#f3f4f6", color: "#6b7280" }} readOnly
              value={d.sscTotal && d.sscObtained ? ((+d.sscObtained / +d.sscTotal) * 100).toFixed(2) + "%" : ""} placeholder="Auto-calculated" />
          </Field>
        </div>
      </div>

      <SectionTitle title="HSC / 12th Standard" subtitle="Higher Secondary Certificate details" />
      <div className="row g-3">
        <div className="col-md-6">
          <Field label="Board Name" required>
            <select style={selectStyle} value={d.hscBoard} onChange={e => set("hscBoard", e.target.value)}>
              <option value="">Select Board</option>
              <option>Maharashtra State Board (MSBSHSE)</option><option>CBSE</option><option>ICSE</option>
              <option>UP Board</option><option>MP Board</option><option>Other State Board</option><option>International Board</option>
            </select>
          </Field>
        </div>
        <div className="col-md-6">
          <Field label="College / School Name" required>
            <input style={inputStyle} value={d.hscSchool} onChange={e => set("hscSchool", e.target.value)} placeholder="Full name of college/school" />
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Stream / Faculty" required>
            <select style={selectStyle} value={d.hscStream} onChange={e => set("hscStream", e.target.value)}>
              <option value="">Select Stream</option>
              <option>Science (PCM)</option><option>Science (PCB)</option><option>Science (PCMB)</option>
              <option>Commerce</option><option>Arts / Humanities</option><option>Vocational</option>
            </select>
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Year of Passing" required>
            <input style={inputStyle} value={d.hscYear} onChange={e => set("hscYear", e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="YYYY" maxLength={4} />
          </Field>
        </div>
        <div className="col-md-2">
          <Field label="Total Marks" required>
            <input style={inputStyle} value={d.hscTotal} onChange={e => set("hscTotal", e.target.value)} placeholder="e.g. 600" />
          </Field>
        </div>
        <div className="col-md-2">
          <Field label="Marks Obtained" required>
            <input style={inputStyle} value={d.hscObtained} onChange={e => set("hscObtained", e.target.value)} placeholder="e.g. 520" />
          </Field>
        </div>
        <div className="col-md-2">
          <Field label="Percentage">
            <input style={{ ...inputStyle, background: "#f3f4f6", color: "#6b7280" }} readOnly
              value={d.hscTotal && d.hscObtained ? ((+d.hscObtained / +d.hscTotal) * 100).toFixed(2) + "%" : ""} placeholder="Auto" />
          </Field>
        </div>
      </div>

      {isPG && (
        <>
          <SectionTitle title="Graduation (Bachelor's Degree)" subtitle="Required for PG admissions" />
          <div className="row g-3">
            <div className="col-md-6">
              <Field label="Institution Name" required>
                <input style={inputStyle} value={d.gradInstitute} onChange={e => set("gradInstitute", e.target.value)} placeholder="College/University name" />
              </Field>
            </div>
            <div className="col-md-6">
              <Field label="University" required>
                <input style={inputStyle} value={d.gradUniversity} onChange={e => set("gradUniversity", e.target.value)} placeholder="Affiliating university" />
              </Field>
            </div>
            <div className="col-md-4">
              <Field label="Course / Degree" required>
                <input style={inputStyle} value={d.gradCourse} onChange={e => set("gradCourse", e.target.value)} placeholder="e.g. B.Sc. Computer Science" />
              </Field>
            </div>
            <div className="col-md-2">
              <Field label="Year of Passing" required>
                <input style={inputStyle} value={d.gradYear} onChange={e => set("gradYear", e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="YYYY" maxLength={4} />
              </Field>
            </div>
            <div className="col-md-3">
              <Field label="Total Marks / CGPA">
                <input style={inputStyle} value={d.gradTotal} onChange={e => set("gradTotal", e.target.value)} placeholder="Max marks or CGPA max" />
              </Field>
            </div>
            <div className="col-md-3">
              <Field label="Marks Obtained / CGPA" required>
                <input style={inputStyle} value={d.gradObtained} onChange={e => set("gradObtained", e.target.value)} placeholder="Your marks or CGPA" />
              </Field>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Step 5: Guardian / Parent Details ────────────────────────────────────────
function Step5({ d, set }: { d: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div>
      <SectionTitle title="Father's Details" />
      <div className="row g-3">
        <div className="col-md-4">
          <Field label="Father's Full Name" required>
            <input style={inputStyle} value={d.fatherName} onChange={e => set("fatherName", e.target.value)} placeholder="Full name" />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Occupation">
            <select style={selectStyle} value={d.fatherOccupation} onChange={e => set("fatherOccupation", e.target.value)}>
              <option value="">Select Occupation</option>
              <option>Government Employee</option><option>Private Employee</option><option>Business</option>
              <option>Farmer</option><option>Self-Employed</option><option>Retired</option><option>Deceased</option><option>Other</option>
            </select>
          </Field>
        </div>
        <div className="col-md-2">
          <Field label="Mobile">
            <input style={inputStyle} value={d.fatherMobile} onChange={e => set("fatherMobile", e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit" maxLength={10} />
          </Field>
        </div>
        <div className="col-md-2">
          <Field label="Annual Income (₹)">
            <input style={inputStyle} value={d.fatherIncome} onChange={e => set("fatherIncome", e.target.value)} placeholder="e.g. 250000" />
          </Field>
        </div>
      </div>

      <SectionTitle title="Mother's Details" />
      <div className="row g-3">
        <div className="col-md-5">
          <Field label="Mother's Full Name" required>
            <input style={inputStyle} value={d.motherName} onChange={e => set("motherName", e.target.value)} placeholder="Full name" />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Occupation">
            <select style={selectStyle} value={d.motherOccupation} onChange={e => set("motherOccupation", e.target.value)}>
              <option value="">Select Occupation</option>
              <option>Government Employee</option><option>Private Employee</option><option>Business</option>
              <option>Homemaker</option><option>Farmer</option><option>Self-Employed</option><option>Deceased</option><option>Other</option>
            </select>
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Mobile">
            <input style={inputStyle} value={d.motherMobile} onChange={e => set("motherMobile", e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit" maxLength={10} />
          </Field>
        </div>
      </div>

      <SectionTitle title="Local Guardian (if different from parents)" subtitle="Optional — fill only if student stays away from parents" />
      <div className="row g-3">
        <div className="col-md-4">
          <Field label="Guardian's Full Name">
            <input style={inputStyle} value={d.guardianName} onChange={e => set("guardianName", e.target.value)} placeholder="Full name" />
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Relation with Student">
            <select style={selectStyle} value={d.guardianRelation} onChange={e => set("guardianRelation", e.target.value)}>
              <option value="">Select Relation</option>
              <option>Uncle</option><option>Aunt</option><option>Elder Brother</option><option>Elder Sister</option>
              <option>Grandparent</option><option>Family Friend</option><option>Other</option>
            </select>
          </Field>
        </div>
        <div className="col-md-2">
          <Field label="Mobile">
            <input style={inputStyle} value={d.guardianMobile} onChange={e => set("guardianMobile", e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit" maxLength={10} />
          </Field>
        </div>
        <div className="col-md-3">
          <Field label="Address">
            <input style={inputStyle} value={d.guardianAddress} onChange={e => set("guardianAddress", e.target.value)} placeholder="Full address" />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ─── Step 6: Documents & Declaration ──────────────────────────────────────────
const DOC_LIST = [
  { key: "photo",          label: "Passport-size Photograph",          required: true  },
  { key: "aadhar",         label: "Aadhar Card (Front & Back)",         required: true  },
  { key: "ssc_marksheet",  label: "10th Marksheet & Passing Certificate", required: true  },
  { key: "hsc_marksheet",  label: "12th Marksheet & Passing Certificate", required: true  },
  { key: "tc",             label: "Transfer Certificate (TC)",           required: true  },
  { key: "migration",      label: "Migration Certificate",               required: false },
  { key: "caste",          label: "Caste Certificate (if applicable)",   required: false },
  { key: "income",         label: "Income Certificate (if applicable)",  required: false },
  { key: "gap_cert",       label: "Gap Year Certificate (if applicable)", required: false },
  { key: "grad_marksheet", label: "Graduation Marksheet (for PG)",        required: false },
];

function Step6({ d, setDoc, setB }: {
  d: FormData;
  setDoc: (key: string, name: string) => void;
  setB: (k: keyof FormData, v: boolean) => void;
}) {
  return (
    <div>
      <SectionTitle title="Document Upload" subtitle="Upload scanned copies — PDF or Image, max 500KB each" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DOC_LIST.map(doc => (
          <div key={doc.key} style={{
            display: "flex", alignItems: "center", gap: 12,
            border: `1.5px solid ${d.docs[doc.key] ? "#a78bfa" : "#e5e7eb"}`,
            borderRadius: 8, padding: "10px 14px",
            background: d.docs[doc.key] ? "#faf5ff" : "#fafafa",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: d.docs[doc.key] ? "#ede9fe" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={d.docs[doc.key] ? "ri-checkbox-circle-fill" : "ri-file-line"}
                style={{ color: d.docs[doc.key] ? "#7c3aed" : "#9ca3af", fontSize: 16 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                {doc.label} {doc.required && <span style={{ color: "#dc2626" }}>*</span>}
              </div>
              {d.docs[doc.key] && <div style={{ fontSize: 11, color: "#7c3aed", marginTop: 1 }}>{d.docs[doc.key]}</div>}
            </div>
            <label style={{ cursor: "pointer", padding: "5px 12px", borderRadius: 6, background: d.docs[doc.key] ? "#ede9fe" : "#f3f4f6", color: d.docs[doc.key] ? "#7c3aed" : "#6b7280", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {d.docs[doc.key] ? "Change" : "Upload"}
              <input type="file" accept=".pdf,image/*" style={{ display: "none" }}
                onChange={e => setDoc(doc.key, e.target.files?.[0]?.name ?? "")} />
            </label>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1.5rem", background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 10, padding: "16px 20px" }}>
        <h6 style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>
          <i className="ri-information-line" style={{ marginRight: 6 }} />Important Notes
        </h6>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#78350f", lineHeight: 1.8 }}>
          <li>All documents must be self-attested.</li>
          <li>Original documents must be presented at the time of admission.</li>
          <li>Submission of this form does not guarantee admission.</li>
          <li>Admission is subject to eligibility verification and seat availability.</li>
        </ul>
      </div>

      <div style={{ marginTop: "1.25rem", padding: "14px 16px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <input type="checkbox" id="declaration" checked={d.declaration}
          onChange={e => setB("declaration", e.target.checked)}
          style={{ accentColor: "#16a34a", width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
        <label htmlFor="declaration" style={{ fontSize: 12.5, color: "#166534", lineHeight: 1.6, cursor: "pointer" }}>
          I hereby declare that all the information provided in this form is true, complete, and correct to the best of my knowledge. I understand that any false information may result in cancellation of my admission.
        </label>
      </div>
    </div>
  );
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current - 1) / (total - 1)) * 100;
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        {STEPS.map(s => {
          const done    = s.id < current;
          const active  = s.id === current;
          return (
            <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: done ? "#7c3aed" : active ? "#4f46e5" : "#e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: active ? "0 0 0 4px rgba(79,70,229,0.15)" : "none",
                transition: "all 0.3s",
              }}>
                {done
                  ? <i className="ri-check-line" style={{ color: "#fff", fontSize: 16 }} />
                  : <i className={s.icon} style={{ color: active ? "#fff" : "#9ca3af", fontSize: 15 }} />
                }
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: active ? "#4f46e5" : done ? "#7c3aed" : "#9ca3af", textAlign: "center", lineHeight: 1.2 }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ height: 4, background: "#e5e7eb", borderRadius: 4, position: "relative" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#4f46e5,#7c3aed)", borderRadius: 4, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentRegistrationPage() {
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState<FormData>(INIT);
  const [submitted, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const set  = (k: keyof FormData, v: string)  => setForm(p => ({ ...p, [k]: v }));
  const setB = (k: keyof FormData, v: boolean) => setForm(p => ({ ...p, [k]: v }));
  const setDoc = (key: string, name: string)   => setForm(p => ({ ...p, docs: { ...p.docs, [key]: name } }));

  const next = () => setStep(s => Math.min(s + 1, 6));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: replace with real API call
    // await fetch("/api/student-registration", { method: "POST", body: JSON.stringify(form) });
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmit(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(79,70,229,0.12)", padding: "3rem 2.5rem", maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <i className="ri-check-double-line" style={{ color: "#fff", fontSize: 36 }} />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1e1b4b", marginBottom: 8 }}>Registration Submitted!</h3>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Your application has been received. The admission office will contact you on <strong>{form.mobile}</strong> and <strong>{form.email}</strong> within 2–3 working days.
          </p>
          <div style={{ background: "#f5f3ff", borderRadius: 10, padding: "12px 16px", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Applicant Name</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#4f46e5" }}>{form.firstName} {form.middleName} {form.lastName}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{form.course} {form.specialization ? `— ${form.specialization}` : ""} · {form.academicSession}</div>
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>
            Please keep a copy of this information for your records. Bring all original documents at the time of admission.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 12px rgba(79,70,229,0.25)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className="ri-graduation-cap-line" style={{ color: "#fff", fontSize: 22 }} />
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>Student Registration Form</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>ZeroForm Campus · Online Admission Portal</div>
        </div>
        <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 14px", color: "#fff", fontSize: 12, fontWeight: 600 }}>
          Step {step} of 6
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" }}>
        <ProgressBar current={step} total={6} />

        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(79,70,229,0.08)", border: "1px solid #ede9fe", padding: "2rem" }}>
          {step === 1 && <Step1 d={form} set={set} />}
          {step === 2 && <Step2 d={form} set={set} setB={setB} />}
          {step === 3 && <Step3 d={form} set={set} />}
          {step === 4 && <Step4 d={form} set={set} isPG={form.courseType === "PG"} />}
          {step === 5 && <Step5 d={form} set={set} />}
          {step === 6 && <Step6 d={form} setDoc={setDoc} setB={setB} />}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          <button onClick={prev} disabled={step === 1}
            style={{ padding: "10px 24px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: step === 1 ? "#d1d5db" : "#374151", fontSize: 14, fontWeight: 600, cursor: step === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <i className="ri-arrow-left-line" /> Previous
          </button>

          <div style={{ fontSize: 12, color: "#9ca3af", alignSelf: "center" }}>
            {step < 6 ? `${6 - step} step${6 - step > 1 ? "s" : ""} remaining` : "Final step"}
          </div>

          {step < 6
            ? <button onClick={next}
                style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                Next <i className="ri-arrow-right-line" />
              </button>
            : <button onClick={handleSubmit} disabled={!form.declaration || loading}
                style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: form.declaration ? "linear-gradient(135deg,#16a34a,#15803d)" : "#d1d5db", color: "#fff", fontSize: 14, fontWeight: 700, cursor: form.declaration ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8, opacity: loading ? 0.8 : 1 }}>
                {loading
                  ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Submitting…</>
                  : <><i className="ri-send-plane-line" /> Submit Application</>
                }
              </button>
          }
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "1rem", fontSize: 12, color: "#9ca3af" }}>
        © {new Date().getFullYear()} ZeroForm Campus · All rights reserved
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
