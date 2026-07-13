"use client";

import React, { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────
type AttendanceStatus = "P" | "A" | "H" | "HD" | "L" | "OL" | "DO" | "-";

interface Employee {
  id: number;
  name: string;
  designation: string;
  department: string;
  avatar: string;
  attendance: Record<number, AttendanceStatus>;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
// July 2026: starts Wednesday (day 3), 31 days
// Sundays in July 2026: 5, 12, 19, 26
const SUNDAYS = new Set([5, 12, 19, 26]);
const HOLIDAYS = new Set([15]); // Independence Day placeholder

function mockAttendance(seed: number): Record<number, AttendanceStatus> {
  const record: Record<number, AttendanceStatus> = {};
  const today = 14; // July 14, 2026
  for (let d = 1; d <= 31; d++) {
    if (d > today) { record[d] = "-"; continue; }
    if (SUNDAYS.has(d)) { record[d] = "DO"; continue; }
    if (HOLIDAYS.has(d)) { record[d] = "H"; continue; }
    const r = ((seed * d * 1664525 + 1013904223) & 0x7fffffff) % 10;
    if (r < 1) record[d] = "OL";
    else if (r < 2) record[d] = "HD";
    else if (r < 3) record[d] = "L";
    else if (r < 4) record[d] = "A";
    else record[d] = "P";
  }
  return record;
}

const EMPLOYEES: Employee[] = [
  { id: 1, name: "Mukteshwar Sharma", designation: "CEO & Founder",  department: "Management", avatar: "MS", attendance: mockAttendance(11) },
  { id: 2, name: "Akash Rai",         designation: "Sr. Developer",   department: "Technology", avatar: "AR", attendance: mockAttendance(22) },
  { id: 3, name: "Harsh Mishra",      designation: "Trainee",         department: "Technology", avatar: "HM", attendance: mockAttendance(33) },
  { id: 4, name: "Sanjana Goldar",    designation: "Intern",          department: "HR",         avatar: "SG", attendance: mockAttendance(44) },
  { id: 5, name: "Geeta Rajpoot",     designation: "Sr. Developer",   department: "Technology", avatar: "GR", attendance: mockAttendance(55) },
  { id: 6, name: "Bhagvendra Singh",  designation: "Sr. Developer",   department: "Technology", avatar: "BS", attendance: mockAttendance(66) },
  { id: 7, name: "Pooja Singh",       designation: "CEO & Founder",   department: "Management", avatar: "PS", attendance: mockAttendance(77) },
  { id: 8, name: "Rahul Verma",       designation: "HR Manager",      department: "HR",         avatar: "RV", attendance: mockAttendance(88) },
];

const DEPARTMENTS = ["All", "Management", "Technology", "HR", "Finance", "Operations"];
const DESIGNATIONS = ["All", "CEO & Founder", "Sr. Developer", "Trainee", "Intern", "HR Manager"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Day of week for July 2026 (July 1 = Wednesday = index 3)
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function getDayName(dayOfMonth: number): string {
  // July 1, 2026 is Wednesday (3)
  return DAY_NAMES[(3 + dayOfMonth - 1) % 7];
}

// ─── Status Config ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<AttendanceStatus, { label: string; bg: string; color: string; icon: string }> = {
  P:  { label: "Present",  bg: "#dcfce7", color: "#16a34a", icon: "ri-check-line" },
  A:  { label: "Absent",   bg: "#fee2e2", color: "#dc2626", icon: "ri-close-line" },
  H:  { label: "Holiday",  bg: "#fef9c3", color: "#ca8a04", icon: "ri-star-line"  },
  HD: { label: "Half Day", bg: "#fed7aa", color: "#ea580c", icon: "ri-contrast-line" },
  L:  { label: "Late",     bg: "#fce7f3", color: "#db2777", icon: "ri-time-line"  },
  OL: { label: "On Leave", bg: "#e0f2fe", color: "#0284c7", icon: "ri-logout-box-line" },
  DO: { label: "Day Off",  bg: "#f3f4f6", color: "#6b7280", icon: "ri-rest-time-line" },
  "-":{ label: "—",        bg: "transparent", color: "#d1d5db", icon: "" },
};

function StatusCell({ status }: { status: AttendanceStatus }) {
  const cfg = STATUS_CONFIG[status];
  if (status === "-") return <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 26, height: 26, borderRadius: 6,
      background: cfg.bg, color: cfg.color, fontSize: 13,
    }} title={cfg.label}>
      <i className={cfg.icon} />
    </span>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AttendancePage() {
  const [month,       setMonth]       = useState(6);   // July = index 6
  const [year,        setYear]        = useState(2026);
  const [empFilter,   setEmpFilter]   = useState("All");
  const [deptFilter,  setDeptFilter]  = useState("All");
  const [desgFilter,  setDesgFilter]  = useState("All");

  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 31 for July

  const filtered = EMPLOYEES.filter(e => {
    if (deptFilter !== "All" && e.department !== deptFilter) return false;
    if (desgFilter !== "All" && e.designation !== desgFilter) return false;
    if (empFilter  !== "All" && e.name !== empFilter) return false;
    return true;
  });

  const countPresent = (emp: Employee) =>
    Object.values(emp.attendance).filter(s => s === "P" || s === "HD" || s === "L").length;
  const totalWorkDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .filter(d => !SUNDAYS.has(d) && !HOLIDAYS.has(d) && d <= 14).length;

  return (
    <div style={{ padding: "1.5rem 0" }}>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h4 style={{ fontSize: 20, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Attendance</h4>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            <span style={{ color: "#9ca3af" }}>Home</span>
            <i className="ri-arrow-right-s-line" style={{ margin: "0 4px" }} />
            <span style={{ color: "#4f46e5" }}>Attendance</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "1.5px solid #ede9fe", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <i className="ri-download-2-line" /> Import
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "1.5px solid #ede9fe", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <i className="ri-upload-2-line" /> Export
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            <i className="ri-add-line" /> Mark Attendance
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede9fe", padding: "12px 16px", marginBottom: "1rem", display: "flex", gap: 12, flexWrap: "wrap" as const, alignItems: "center" }}>
        <FilterSelect label="Employee"    value={empFilter}  onChange={setEmpFilter}
          options={["All", ...EMPLOYEES.map(e => e.name)]} />
        <FilterSelect label="Department"  value={deptFilter} onChange={setDeptFilter} options={DEPARTMENTS} />
        <FilterSelect label="Designation" value={desgFilter} onChange={setDesgFilter} options={DESIGNATIONS} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Month</span>
          <select value={month} onChange={e => setMonth(+e.target.value)} style={selStyle}>
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Year</span>
          <select value={year} onChange={e => setYear(+e.target.value)} style={selStyle}>
            {[2024, 2025, 2026, 2027].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const, marginBottom: "1rem" }}>
        {(Object.entries(STATUS_CONFIG) as [AttendanceStatus, typeof STATUS_CONFIG[AttendanceStatus]][])
          .filter(([k]) => k !== "-")
          .map(([key, cfg]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#374151" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 5, background: cfg.bg, color: cfg.color, fontSize: 12 }}>
                <i className={cfg.icon} />
              </span>
              {cfg.label}
            </div>
          ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede9fe", overflow: "auto", boxShadow: "0 2px 12px rgba(79,70,229,0.06)" }}>
        <table style={{ borderCollapse: "collapse", minWidth: "100%", fontSize: 12 }}>
          <thead>
            {/* Day name row */}
            <tr style={{ background: "#f5f3ff" }}>
              <th style={{ ...thStyle, minWidth: 200, textAlign: "left", position: "sticky" as const, left: 0, background: "#f5f3ff", zIndex: 2 }}>
                Employee
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                const dayName = getDayName(d);
                const isSun = SUNDAYS.has(d);
                const isHol = HOLIDAYS.has(d);
                return (
                  <th key={d} style={{ ...thStyle, minWidth: 36, background: isHol ? "#fef9c3" : isSun ? "#f9fafb" : "#f5f3ff", color: isSun ? "#9ca3af" : isHol ? "#ca8a04" : "#6b7280" }}>
                    <div style={{ fontSize: 9, fontWeight: 500 }}>{dayName}</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{d}</div>
                  </th>
                );
              })}
              <th style={{ ...thStyle, minWidth: 64, background: "#ede9fe", color: "#4f46e5" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, idx) => {
              const present = countPresent(emp);
              return (
                <tr key={emp.id} style={{ borderTop: "1px solid #f3f4f6", background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  {/* Employee cell */}
                  <td style={{ padding: "8px 12px", position: "sticky" as const, left: 0, background: idx % 2 === 0 ? "#fff" : "#fafafa", zIndex: 1, borderRight: "1px solid #ede9fe" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                        {emp.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 13 }}>{emp.name}</div>
                        <div style={{ color: "#9ca3af", fontSize: 11 }}>{emp.designation}</div>
                      </div>
                    </div>
                  </td>
                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const isSun = SUNDAYS.has(d);
                    const status = emp.attendance[d] ?? "-";
                    return (
                      <td key={d} style={{ padding: "4px 4px", textAlign: "center", background: isSun ? "rgba(249,250,251,0.8)" : "transparent" }}>
                        <StatusCell status={status} />
                      </td>
                    );
                  })}
                  {/* Total */}
                  <td style={{ padding: "8px", textAlign: "center", fontWeight: 700, color: present > 0 ? "#16a34a" : "#dc2626", background: "#f5f3ff" }}>
                    {present} / {totalWorkDays}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="row g-3" style={{ marginTop: "1.25rem" }}>
        {[
          { label: "Total Employees", value: filtered.length,                                                                  icon: "ri-group-line",           color: "#4f46e5", bg: "#ede9fe" },
          { label: "Present Today",   value: filtered.filter(e => e.attendance[14] === "P").length,                            icon: "ri-checkbox-circle-line", color: "#16a34a", bg: "#dcfce7" },
          { label: "Absent Today",    value: filtered.filter(e => e.attendance[14] === "A").length,                            icon: "ri-close-circle-line",    color: "#dc2626", bg: "#fee2e2" },
          { label: "On Leave Today",  value: filtered.filter(e => e.attendance[14] === "OL" || e.attendance[14] === "HD").length, icon: "ri-calendar-close-line", color: "#0284c7", bg: "#e0f2fe" },
        ].map(card => (
          <div key={card.label} className="col-md-3">
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede9fe", padding: "16px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 8px rgba(79,70,229,0.06)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={card.icon} style={{ fontSize: 22, color: card.color }} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const selStyle: React.CSSProperties = {
  padding: "5px 10px", borderRadius: 7, border: "1.5px solid #e5e7eb",
  fontSize: 12, color: "#374151", background: "#fafafa", cursor: "pointer", outline: "none",
};

const thStyle: React.CSSProperties = {
  padding: "8px 4px", textAlign: "center", fontWeight: 700,
  color: "#6b7280", fontSize: 11, whiteSpace: "nowrap",
  borderBottom: "2px solid #ede9fe",
};

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={selStyle}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
