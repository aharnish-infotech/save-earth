"use client";
import React, { useState } from "react";
import Link from "next/link";

type FormData = {
  salutation: string; firstName: string; lastName: string; email: string; mobile: string;
  dob: string; gender: string; designation: string; department: string; employeeId: string;
  joiningDate: string; reportingTo: string; userRole: string; language: string;
  country: string; address: string; about: string; profilePicture: File|null;
  loginAllowed: string; emailNotifications: string; hourlyRate: string;
  slackMemberId: string; skills: string[]; skillInput: string;
  probationEndDate: string; noticePeriodStart: string; noticePeriodEnd: string;
  employmentType: string; maritalStatus: string; businessAddress: string;
};

const INIT: FormData = {
  salutation:"Mr.", firstName:"", lastName:"", email:"", mobile:"",
  dob:"", gender:"", designation:"", department:"", employeeId:"EMP-009",
  joiningDate:"", reportingTo:"", userRole:"", language:"English",
  country:"India", address:"", about:"", profilePicture:null,
  loginAllowed:"Yes", emailNotifications:"Yes", hourlyRate:"",
  slackMemberId:"", skills:[], skillInput:"",
  probationEndDate:"", noticePeriodStart:"", noticePeriodEnd:"",
  employmentType:"Full Time", maritalStatus:"", businessAddress:"",
};

const SALUTATIONS  = ["Mr.","Mrs.","Ms.","Dr.","Prof."];
const GENDERS      = ["","Male","Female","Other","Prefer not to say"];
const DESIGNATIONS = ["CEO & Founder","Sr. Developer","Jr. Developer","Trainee","Intern","HR Manager","Accountant","Admin Officer"];
const DEPARTMENTS  = ["Management","Technology","HR","Finance","Operations","Marketing"];
const ROLES        = ["Super Admin","Admin","HR Manager","Developer","Accountant","Counselor","Viewer"];
const REPORTERS    = ["—","Mukteshwar Sharma","Akash Rai","Pooja Singh"];
const EMP_TYPES    = ["Full Time","Part Time","Contract","Intern","Consultant"];
const MARITAL      = ["","Single","Married","Divorced","Widowed"];

function Fld({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5 }}>
        {label} {req && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function AddEmployeePage() {
  const [form, setForm] = useState<FormData>(INIT);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const set = (k: keyof FormData, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", fontSize: 13, borderRadius: 8,
    border: "1.5px solid #e5e7eb", outline: "none", color: "#1f2937", background: "#fafafa",
  };
  const selStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

  const addSkill = () => {
    const s = form.skillInput.trim();
    if (s && !form.skills.includes(s)) set("skills", [...form.skills, s]);
    set("skillInput", "");
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (saved) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: 16, border: "1px solid #ede9fe", maxWidth: 400 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <i className="ri-check-line" style={{ fontSize: 28, color: "#16a34a" }} />
        </div>
        <h5 style={{ fontWeight: 800, color: "#1e1b4b", marginBottom: 8 }}>Employee Added!</h5>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>
          {form.salutation} {form.firstName} {form.lastName} has been successfully registered.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => { setForm(INIT); setSaved(false); }} style={{ padding: "8px 20px", borderRadius: 8, border: "1.5px solid #ede9fe", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add Another</button>
          <Link href="/hr/employees" style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none", display: "inline-block" }}>View Employees</Link>
        </div>
      </div>
    </div>
  );

  const SectionCard = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ede9fe", marginBottom: "1.5rem", overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className={icon} style={{ fontSize: 16, color: "#4f46e5" }} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 14, color: "#1e1b4b" }}>{title}</span>
      </div>
      <div style={{ padding: "1.25rem 1.5rem" }}>{children}</div>
    </div>
  );

  return (
    <div style={{ padding: "1.5rem 0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h4 style={{ fontSize: 20, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Add Employee</h4>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            <span>Home</span><i className="ri-arrow-right-s-line" style={{ margin: "0 4px" }} />
            <Link href="/hr/employees" style={{ color: "#9ca3af", textDecoration: "none" }}>Employees</Link>
            <i className="ri-arrow-right-s-line" style={{ margin: "0 4px" }} />
            <span style={{ color: "#4f46e5" }}>Add Employee</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/hr/employees" style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <i className="ri-arrow-left-line" /> Cancel
          </Link>
          <button onClick={handleSave} disabled={saving} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {saving ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Saving…</> : <><i className="ri-save-line" /> Save & Add More</>}
          </button>
          <button onClick={handleSave} disabled={saving} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {saving ? "Saving…" : <><i className="ri-check-line" /> Save</>}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column — main details */}
        <div className="col-md-8">

          {/* Account Details */}
          <SectionCard title="Account Details" icon="ri-user-settings-line">
            <div className="row g-3">
              <div className="col-md-3">
                <Fld label="Employee ID"><input value={form.employeeId} readOnly style={{ ...inputStyle, background: "#f3f4f6", color: "#9ca3af" }} /></Fld>
              </div>
              <div className="col-md-3">
                <Fld label="Salutation">
                  <select value={form.salutation} onChange={e => set("salutation", e.target.value)} style={selStyle}>
                    {SALUTATIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Fld>
              </div>
              <div className="col-md-3">
                <Fld label="First Name" req><input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="First name" style={inputStyle} /></Fld>
              </div>
              <div className="col-md-3">
                <Fld label="Last Name"><input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Last name" style={inputStyle} /></Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Email Address" req><input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="employee@college.edu.in" style={inputStyle} /></Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Mobile Number"><input type="tel" value={form.mobile} onChange={e => set("mobile", e.target.value)} placeholder="+91 98765 43210" style={inputStyle} /></Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Date of Birth"><input type="date" value={form.dob} onChange={e => set("dob", e.target.value)} style={inputStyle} /></Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Gender">
                  <select value={form.gender} onChange={e => set("gender", e.target.value)} style={selStyle}>
                    {GENDERS.map(g => <option key={g} value={g}>{g || "Select gender"}</option>)}
                  </select>
                </Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Designation" req>
                  <select value={form.designation} onChange={e => set("designation", e.target.value)} style={selStyle}>
                    <option value="">Select designation</option>
                    {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Department" req>
                  <select value={form.department} onChange={e => set("department", e.target.value)} style={selStyle}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Joining Date" req><input type="date" value={form.joiningDate} onChange={e => set("joiningDate", e.target.value)} style={inputStyle} /></Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Reporting To">
                  <select value={form.reportingTo} onChange={e => set("reportingTo", e.target.value)} style={selStyle}>
                    {REPORTERS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </Fld>
              </div>
              <div className="col-md-6">
                <Fld label="User Role">
                  <select value={form.userRole} onChange={e => set("userRole", e.target.value)} style={selStyle}>
                    <option value="">Select role</option>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Language"><input value={form.language} onChange={e => set("language", e.target.value)} placeholder="English" style={inputStyle} /></Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Country"><input value={form.country} onChange={e => set("country", e.target.value)} placeholder="India" style={inputStyle} /></Fld>
              </div>
              <div className="col-12">
                <Fld label="Address"><textarea value={form.address} onChange={e => set("address", e.target.value)} placeholder="Residential address" rows={2} style={{ ...inputStyle, resize: "vertical" }} /></Fld>
              </div>
              <div className="col-12">
                <Fld label="About"><textarea value={form.about} onChange={e => set("about", e.target.value)} placeholder="Brief introduction or bio..." rows={3} style={{ ...inputStyle, resize: "vertical" }} /></Fld>
              </div>
            </div>
          </SectionCard>

          {/* Other Details */}
          <SectionCard title="Other Details" icon="ri-file-list-3-line">
            <div className="row g-3">
              <div className="col-md-6">
                <Fld label="Login Allowed">
                  <div style={{ display: "flex", gap: 16 }}>
                    {["Yes","No"].map(v => (
                      <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", fontWeight: form.loginAllowed===v?700:400 }}>
                        <input type="radio" name="loginAllowed" value={v} checked={form.loginAllowed===v} onChange={() => set("loginAllowed",v)} style={{ accentColor: "#7c3aed" }} />{v}
                      </label>
                    ))}
                  </div>
                </Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Email Notifications">
                  <div style={{ display: "flex", gap: 16 }}>
                    {["Yes","No"].map(v => (
                      <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", fontWeight: form.emailNotifications===v?700:400 }}>
                        <input type="radio" name="emailNotif" value={v} checked={form.emailNotifications===v} onChange={() => set("emailNotifications",v)} style={{ accentColor: "#7c3aed" }} />{v}
                      </label>
                    ))}
                  </div>
                </Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Hourly Rate (₹)"><input type="number" value={form.hourlyRate} onChange={e => set("hourlyRate", e.target.value)} placeholder="0.00" style={inputStyle} /></Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Slack Member ID"><input value={form.slackMemberId} onChange={e => set("slackMemberId", e.target.value)} placeholder="U0XXXXXXX" style={inputStyle} /></Fld>
              </div>
              <div className="col-12">
                <Fld label="Skills">
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <input value={form.skillInput} onChange={e => set("skillInput", e.target.value)}
                      onKeyDown={e => { if (e.key==="Enter") { e.preventDefault(); addSkill(); } }}
                      placeholder="Type a skill and press Enter" style={{ ...inputStyle, flex: 1 }} />
                    <button onClick={addSkill} style={{ padding: "9px 14px", borderRadius: 8, border: "none", background: "#ede9fe", color: "#4f46e5", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Add</button>
                  </div>
                  {form.skills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                      {form.skills.map(s => (
                        <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, background: "#ede9fe", color: "#4f46e5", fontSize: 12, fontWeight: 600 }}>
                          {s}<button onClick={() => set("skills", form.skills.filter(x=>x!==s))} style={{ background: "none", border: "none", cursor: "pointer", color: "#7c3aed", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Employment Type">
                  <select value={form.employmentType} onChange={e => set("employmentType", e.target.value)} style={selStyle}>
                    {EMP_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Fld>
              </div>
              <div className="col-md-6">
                <Fld label="Marital Status">
                  <select value={form.maritalStatus} onChange={e => set("maritalStatus", e.target.value)} style={selStyle}>
                    {MARITAL.map(m => <option key={m} value={m}>{m||"Select"}</option>)}
                  </select>
                </Fld>
              </div>
              <div className="col-md-4">
                <Fld label="Probation End Date"><input type="date" value={form.probationEndDate} onChange={e => set("probationEndDate", e.target.value)} style={inputStyle} /></Fld>
              </div>
              <div className="col-md-4">
                <Fld label="Notice Period Start"><input type="date" value={form.noticePeriodStart} onChange={e => set("noticePeriodStart", e.target.value)} style={inputStyle} /></Fld>
              </div>
              <div className="col-md-4">
                <Fld label="Notice Period End"><input type="date" value={form.noticePeriodEnd} onChange={e => set("noticePeriodEnd", e.target.value)} style={inputStyle} /></Fld>
              </div>
              <div className="col-12">
                <Fld label="Business Address"><textarea value={form.businessAddress} onChange={e => set("businessAddress", e.target.value)} placeholder="Office / business address" rows={2} style={{ ...inputStyle, resize: "vertical" }} /></Fld>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Column — Profile + summary */}
        <div className="col-md-4">
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ede9fe", overflow: "hidden", marginBottom: "1rem", position: "sticky", top: 90 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="ri-image-add-line" style={{ fontSize: 16, color: "#4f46e5" }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 14, color: "#1e1b4b" }}>Profile Picture</span>
            </div>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "#fff", fontSize: 28, fontWeight: 800 }}>
                {form.firstName ? form.firstName[0].toUpperCase() : <i className="ri-user-line" />}
              </div>
              <label htmlFor="pp-upload" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "1.5px dashed #c4b5fd", background: "#faf5ff", color: "#7c3aed", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <i className="ri-upload-cloud-2-line" /> Upload Photo
                <input id="pp-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={e => set("profilePicture", e.target.files?.[0]||null)} />
              </label>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>JPG, PNG up to 2MB</p>
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f4f6" }}>
              {[
                { label: "Name",        value: [form.salutation, form.firstName, form.lastName].filter(Boolean).join(" ") || "—" },
                { label: "Designation", value: form.designation || "—" },
                { label: "Department",  value: form.department  || "—" },
                { label: "User Role",   value: form.userRole    || "—" },
                { label: "Emp. Type",   value: form.employmentType },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b", maxWidth: 140, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
