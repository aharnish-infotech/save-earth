"use client";
import React, { useState } from "react";
import Link from "next/link";

const FIELD: React.CSSProperties = {
  width: "100%", border: "1px solid #e5e7eb", borderRadius: 9,
  padding: "9px 12px", fontSize: 13, color: "#374151",
  outline: "none", boxSizing: "border-box" as const, background: "#fff",
};
const LABEL: React.CSSProperties = {
  display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280",
  marginBottom: 5, textTransform: "uppercase" as const, letterSpacing: "0.05em",
};
const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
  padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

const STATS = [
  { label: "Total",       value: 21,  icon: "ri-file-list-3-line",     color: "#374151", bg: "#f9fafb" },
  { label: "In Progress", value: 3,   icon: "ri-loader-4-line",        color: "#2563eb", bg: "#eff6ff" },
  { label: "Completed",   value: 18,  icon: "ri-checkbox-circle-line", color: "#16a34a", bg: "#f0fdf4" },
];

const AUDIT_HISTORY = [
  { id: "AUD-2026-018", branch: "Koramangala Branch",  date: "14 Aug 2026", status: "Completed"   },
  { id: "AUD-2026-017", branch: "Whitefield Branch",   date: "12 Aug 2026", status: "Completed"   },
  { id: "AUD-2026-016", branch: "MG Road Branch",      date: "10 Aug 2026", status: "In Progress" },
  { id: "AUD-2026-015", branch: "Indiranagar Branch",  date: "08 Aug 2026", status: "Draft"       },
  { id: "AUD-2026-014", branch: "HSR Layout Branch",   date: "05 Aug 2026", status: "Completed"   },
];
const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  "Completed":   { color: "#16a34a", bg: "#f0fdf4" },
  "In Progress": { color: "#2563eb", bg: "#eff6ff" },
  "Draft":       { color: "#d97706", bg: "#fffbeb" },
};

export default function ProfilePage() {
  const [editMode,   setEditMode]   = useState(false);
  const [donutHover, setDonutHover] = useState(false);
  const [form, setForm] = useState({
    name:    "Admin User",
    email:   "admin@saveearth.in",
    phone:   "+91 98765 43210",
    role:    "Super Admin",
    zone:    "All Zones",
    empId:   "SE-001",
    joined:  "01 Jan 2024",
    city:    "Bengaluru",
  });

  const fp = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ padding: "24px 0" }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>
        Dashboard / <Link href="/settings" style={{ color: "#9ca3af", textDecoration: "none" }}>Administration</Link> /{" "}
        <span style={{ color: "#16a34a", fontWeight: 600 }}>My Profile</span>
      </div>

      {/* ── Hero Card ── */}
      <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", borderRadius: 18, padding: "32px 32px 0", marginBottom: 20, position: "relative", overflow: "hidden", border: "1px solid #bbf7d0" }}>

        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(22,163,74,0.07)" }} />
        <div style={{ position: "absolute", bottom: -60, right: 100, width: 180, height: 180, borderRadius: "50%", background: "rgba(22,163,74,0.05)" }} />
        {/* Green top accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #16a34a, #4ade80)", borderRadius: "18px 18px 0 0" }} />

        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, position: "relative", zIndex: 1 }}>

          {/* Avatar */}
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg, #16a34a, #4ade80)", border: "4px solid #fff", boxShadow: "0 4px 16px rgba(22,163,74,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 30, flexShrink: 0 }}>
            AU
          </div>

          {/* Identity */}
          <div style={{ paddingBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>{form.name}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{form.email}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "#16a34a", borderRadius: 20, padding: "3px 12px" }}>
                {form.role}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#15803d", background: "#fff", borderRadius: 20, padding: "3px 12px", border: "1px solid #bbf7d0" }}>
                ID: {form.empId}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#15803d", background: "#fff", borderRadius: 20, padding: "3px 12px", border: "1px solid #bbf7d0" }}>
                <i className="ri-map-pin-line" style={{ marginRight: 3 }} />{form.zone}
              </span>
            </div>
          </div>

          {/* Edit toggle */}
          <div style={{ marginLeft: "auto", paddingBottom: 24 }}>
            <button onClick={() => setEditMode(e => !e)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10, border: "1px solid #16a34a", background: editMode ? "#16a34a" : "#fff", color: editMode ? "#fff" : "#16a34a", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
              <i className={editMode ? "ri-close-line" : "ri-edit-line"} />
              {editMode ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid #bbf7d0", marginTop: 8, background: "rgba(255,255,255,0.5)" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: "16px 20px", borderRight: i < 2 ? "1px solid #bbf7d0" : "none", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#16a34a" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 }}>

        {/* LEFT — Personal Info + Security */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Personal Information */}
          <div style={CARD}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>Personal Information</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>Your basic account details</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="ri-user-3-line" style={{ fontSize: 17, color: "#16a34a" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Full Name",   key: "name",   icon: "ri-user-line" },
                { label: "Employee ID", key: "empId",  icon: "ri-id-card-line", locked: true },
                { label: "Email",       key: "email",  icon: "ri-mail-line",   locked: true },
                { label: "Phone",       key: "phone",  icon: "ri-phone-line" },
                { label: "City",        key: "city",   icon: "ri-map-pin-line" },
                { label: "Joined On",   key: "joined", icon: "ri-calendar-line", locked: true },
              ].map(({ label, key, icon, locked }) => (
                <div key={key}>
                  <label style={LABEL}>{label}</label>
                  {editMode && !locked ? (
                    <div style={{ position: "relative" }}>
                      <i className={icon} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
                      <input value={form[key as keyof typeof form]} onChange={e => fp(key as keyof typeof form, e.target.value)}
                        style={{ ...FIELD, paddingLeft: 30 }} />
                    </div>
                  ) : (
                    <div style={{ ...FIELD, background: locked ? "#f9fafb" : "#f9fafb", cursor: locked ? "not-allowed" : "default", display: "flex", alignItems: "center", gap: 8 }}>
                      <i className={icon} style={{ fontSize: 13, color: "#9ca3af" }} />
                      <span style={{ color: "#374151" }}>{form[key as keyof typeof form]}</span>
                      {locked && <i className="ri-lock-line" style={{ fontSize: 11, color: "#d1d5db", marginLeft: "auto" }} />}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
              <div>
                <label style={LABEL}>Role</label>
                <div style={{ ...FIELD, background: "#f9fafb", display: "flex", alignItems: "center", gap: 8, cursor: "not-allowed" }}>
                  <i className="ri-shield-user-line" style={{ fontSize: 13, color: "#9ca3af" }} />
                  <span style={{ fontWeight: 700, color: "#16a34a" }}>{form.role}</span>
                  <i className="ri-lock-line" style={{ fontSize: 11, color: "#d1d5db", marginLeft: "auto" }} />
                </div>
              </div>
              <div>
                <label style={LABEL}>Zone Access</label>
                <div style={{ ...FIELD, background: "#f9fafb", display: "flex", alignItems: "center", gap: 8, cursor: "not-allowed" }}>
                  <i className="ri-map-2-line" style={{ fontSize: 13, color: "#9ca3af" }} />
                  <span style={{ color: "#374151" }}>{form.zone}</span>
                  <i className="ri-lock-line" style={{ fontSize: 11, color: "#d1d5db", marginLeft: "auto" }} />
                </div>
              </div>
            </div>

            {editMode && (
              <div style={{ marginTop: 18, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setEditMode(false)}
                  style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  Cancel
                </button>
                <button onClick={() => setEditMode(false)}
                  style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
                  <i className="ri-save-line" /> Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Security */}
          <div style={{ maxWidth: "50%" }}>
          <div style={CARD}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="ri-shield-keyhole-line" style={{ fontSize: 17, color: "#dc2626" }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>Security</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Password and authentication settings</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Current Password", placeholder: "Enter current password" },
                { label: "New Password",     placeholder: "At least 8 characters" },
                { label: "Confirm Password", placeholder: "Re-enter new password" },
              ].map(f => (
                <div key={f.label}>
                  <label style={LABEL}>{f.label}</label>
                  <div style={{ position: "relative" }}>
                    <i className="ri-lock-password-line" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
                    <input type="password" placeholder={f.placeholder} style={{ ...FIELD, paddingLeft: 30 }} />
                  </div>
                </div>
              ))}
              <button style={{ alignSelf: "flex-end", padding: "9px 20px", borderRadius: 9, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
                <i className="ri-key-2-line" /> Update Password
              </button>
            </div>
          </div>
          </div>
        </div>

        {/* RIGHT — Stats + Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Quick Stats */}
          <div style={CARD}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
              <i className="ri-bar-chart-2-line" style={{ color: "#16a34a" }} /> Performance
            </div>

            {/* Completion Donut */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div
                onMouseEnter={() => setDonutHover(true)}
                onMouseLeave={() => setDonutHover(false)}
                style={{
                  position: "relative", width: 88, height: 88, cursor: "pointer",
                  transform: donutHover ? "scale(1.1)" : "scale(1)",
                  transition: "transform 0.22s ease",
                  filter: donutHover ? "drop-shadow(0 0 10px rgba(22,163,74,0.45))" : "none",
                }}>
                <svg width="88" height="88" viewBox="0 0 88 88">
                  <circle cx="44" cy="44" r="36" fill="none" stroke="#e5e7eb" strokeWidth="9" />
                  <circle cx="44" cy="44" r="36" fill="none" stroke="#16a34a" strokeWidth="9"
                    strokeDasharray={`${226.2 * 0.857} 226.2`}
                    strokeLinecap="round"
                    transform="rotate(-90 44 44)"
                    style={{ transition: "stroke 0.2s" }} />
                  <circle cx="44" cy="44" r="36" fill="none" stroke="#fbbf24" strokeWidth="9"
                    strokeDasharray={`${226.2 * 0.143} 226.2`}
                    strokeDashoffset={`${-226.2 * 0.857}`}
                    strokeLinecap="round"
                    transform="rotate(-90 44 44)" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  <div style={{ fontSize: donutHover ? 15 : 20, fontWeight: 900, color: donutHover ? "#16a34a" : "#111827", lineHeight: 1, transition: "all 0.2s" }}>
                    {donutHover ? "18/21" : "85%"}
                  </div>
                  <div style={{ fontSize: 8, color: "#9ca3af", fontWeight: 700, letterSpacing: "0.05em", marginTop: 2 }}>
                    {donutHover ? "AUDITS" : "COMPLETE"}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6b7280" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} /> 18 Completed
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6b7280" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} /> 3 Remaining
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: s.bg, borderRadius: 9 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={s.icon} style={{ fontSize: 15, color: s.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>{s.label}</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div style={CARD}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
              <i className="ri-information-line" style={{ color: "#2563eb" }} /> Account Info
            </div>
            {[
              { label: "Account Status", value: "Active",        icon: "ri-checkbox-circle-fill", color: "#16a34a" },
              { label: "Last Login",     value: "Today, 19:00",  icon: "ri-time-line",            color: "#6b7280" },
              { label: "Login IP",       value: "192.168.1.6",   icon: "ri-global-line",          color: "#6b7280" },
              { label: "Member Since",   value: "01 Jan 2024",   icon: "ri-calendar-check-line",  color: "#6b7280" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#6b7280" }}>
                  <i className={r.icon} style={{ fontSize: 13, color: r.color }} />{r.label}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: r.color === "#16a34a" ? "#16a34a" : "#374151" }}>{r.value}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Audit History ── */}
      <div style={{ ...CARD, marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ri-history-line" style={{ fontSize: 16, color: "#7c3aed" }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Audit History</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Your last 5 audit submissions</div>
            </div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
            <i className="ri-download-line" style={{ fontSize: 13 }} /> Export
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Audit ID", "Branch", "Date", "Status", "Action"].map(h => (
                <th key={h} style={{ padding: "9px 14px", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", textAlign: "left" as const, borderBottom: "1px solid #e5e7eb" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AUDIT_HISTORY.map((a, i) => {
              const ss = STATUS_STYLE[a.status];
              return (
                <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.15s" }}>
                  <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 700, color: "#374151", borderBottom: "1px solid #f3f4f6", fontFamily: "monospace" }}>{a.id}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: "#111827", fontWeight: 600, borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <i className="ri-building-2-line" style={{ fontSize: 13, color: "#9ca3af" }} /> {a.branch}
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: "#6b7280", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <i className="ri-calendar-line" style={{ fontSize: 12, color: "#9ca3af" }} /> {a.date}
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ss.color, background: ss.bg, borderRadius: 20, padding: "3px 10px" }}>{a.status}</span>
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid #f3f4f6" }}>
                    <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      <i className="ri-eye-line" style={{ fontSize: 12 }} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
