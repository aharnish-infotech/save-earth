"use client";

import React, { useState, useCallback, useMemo } from "react";

/* ─── Types ────────────────────────────────────────────────────────────────── */
type ErrorStatus = "New" | "Acknowledged" | "Resolved";

interface ErrorEntry {
  id: number;
  ref: string;
  reportedAt: Date;
  user: string;
  userEmail: string;
  userRole: string;
  auditIfsc: string;
  branchName: string;
  step: string;
  errorCode: string;
  errorMessage: string;
  status: ErrorStatus;
  appVersion: string;
  device: string;
  network: string;
  battery: string;
  lastSync: string;
  pendingItems: number;
  resolutionNote?: string;
}

/* ─── Seed Data ─────────────────────────────────────────────────────────────── */
const SEED: ErrorEntry[] = [
  {
    id: 1, ref: "ERR-20261103-A1B2",
    reportedAt: new Date("2026-11-03T13:41:00"),
    user: "Arun Wagadre", userEmail: "arun.wagadre@saveearth.in", userRole: "Field Auditor",
    auditIfsc: "SBIN0012661", branchName: "SBI Gandhinagar Main",
    step: "13/14 — Submit & Sync",
    errorCode: "NO_CONNECTION", errorMessage: "Network request failed: Unable to reach the sync endpoint. The device had no active internet connection at the time of submission.",
    status: "New",
    appVersion: "v2.4.1 (Build 241)", device: "Samsung Galaxy A54 (Android 14)",
    network: "No Connection", battery: "34%", lastSync: "03-Nov-2026 10:12 AM", pendingItems: 4,
  },
  {
    id: 2, ref: "ERR-20261102-C3D4",
    reportedAt: new Date("2026-11-02T17:41:00"),
    user: "Arun Wagadre", userEmail: "arun.wagadre@saveearth.in", userRole: "Field Auditor",
    auditIfsc: "SBIN0070624", branchName: "SBI Patan Branch",
    step: "13/14 — Submit & Sync",
    errorCode: "AUDIT_CONFLICT", errorMessage: "Audit conflict detected: A newer version of this audit already exists on the server. The local draft may have been modified offline while another session was active.",
    status: "Acknowledged",
    appVersion: "v2.4.1 (Build 241)", device: "Samsung Galaxy A54 (Android 14)",
    network: "4G (Jio)", battery: "61%", lastSync: "02-Nov-2026 04:55 PM", pendingItems: 1,
  },
  {
    id: 3, ref: "ERR-20261029-E5F6",
    reportedAt: new Date("2026-10-29T11:48:00"),
    user: "Akash Bhowate", userEmail: "akash.bhowate@saveearth.in", userRole: "Senior Auditor",
    auditIfsc: "SBIN0040463", branchName: "SBI Mehsana District",
    step: "13/14 — Submit & Sync",
    errorCode: "AUDIT_CONFLICT", errorMessage: "Audit conflict detected: A newer version of this audit already exists on the server. Conflict was resolved by overwriting with the server version.",
    status: "Resolved",
    appVersion: "v2.4.0 (Build 238)", device: "Redmi Note 12 Pro (Android 13)",
    network: "WiFi (SBI_BRANCH_NET)", battery: "82%", lastSync: "29-Oct-2026 11:30 AM", pendingItems: 0,
    resolutionNote: "Conflict resolved — server version confirmed correct. Auditor re-submitted with updated data.",
  },
  {
    id: 4, ref: "ERR-20261028-G7H8",
    reportedAt: new Date("2026-10-28T09:22:00"),
    user: "Priya Desai", userEmail: "priya.desai@saveearth.in", userRole: "Field Auditor",
    auditIfsc: "SBIN0031847", branchName: "SBI Ahmedabad West",
    step: "11/14 — Upload Photos",
    errorCode: "UPLOAD_TIMEOUT", errorMessage: "Photo upload timed out after 30 seconds. The image bundle (23 MB) could not be transmitted within the allowed window on a weak 3G signal.",
    status: "Resolved",
    appVersion: "v2.4.0 (Build 238)", device: "OnePlus Nord CE 3 (Android 14)",
    network: "3G (BSNL)", battery: "45%", lastSync: "28-Oct-2026 09:00 AM", pendingItems: 0,
    resolutionNote: "Auditor retried upload on WiFi. Upload succeeded. No data loss.",
  },
  {
    id: 5, ref: "ERR-20261027-I9J0",
    reportedAt: new Date("2026-10-27T14:05:00"),
    user: "Ramesh Kulkarni", userEmail: "ramesh.kulkarni@saveearth.in", userRole: "Field Auditor",
    auditIfsc: "SBIN0002345", branchName: "SBI Baroda Sayajigunj",
    step: "3/14 — Branch Details",
    errorCode: "GPS_DENIED", errorMessage: "Location permission was denied by the device. GPS coordinates could not be captured for the audit check-in. The step requires precise geo-tagging.",
    status: "Resolved",
    appVersion: "v2.3.9 (Build 235)", device: "Poco M5 (Android 12)",
    network: "WiFi (Local)", battery: "71%", lastSync: "27-Oct-2026 02:00 PM", pendingItems: 0,
    resolutionNote: "Auditor enabled location permissions and re-started the step. GPS captured successfully.",
  },
  {
    id: 6, ref: "ERR-20261025-K1L2",
    reportedAt: new Date("2026-10-25T16:30:00"),
    user: "Snehal Patil", userEmail: "snehal.patil@saveearth.in", userRole: "Field Auditor",
    auditIfsc: "SBIN0009988", branchName: "SBI Pune Camp",
    step: "14/14 — Final Submission",
    errorCode: "AUTH_EXPIRED", errorMessage: "Authentication token has expired. The session exceeded the 8-hour inactivity limit. The user must log in again to continue syncing.",
    status: "Acknowledged",
    appVersion: "v2.4.0 (Build 238)", device: "Samsung Galaxy M34 (Android 14)",
    network: "4G (Airtel)", battery: "29%", lastSync: "25-Oct-2026 08:00 AM", pendingItems: 2,
  },
  {
    id: 7, ref: "ERR-20261024-M3N4",
    reportedAt: new Date("2026-10-24T11:15:00"),
    user: "Vikram Sharma", userEmail: "vikram.sharma@saveearth.in", userRole: "Senior Auditor",
    auditIfsc: "SBIN0005671", branchName: "SBI Nagpur Sitabuldi",
    step: "8/14 — Electrical Findings",
    errorCode: "FORM_VALIDATION", errorMessage: "Required field 'Panel Rating (kVA)' was left empty. The form schema version 3.2 requires this field for all HT panels above 250 kVA.",
    status: "Acknowledged",
    appVersion: "v2.4.1 (Build 241)", device: "Motorola G84 (Android 13)",
    network: "WiFi (SBI_BRANCH_NET)", battery: "90%", lastSync: "24-Oct-2026 11:00 AM", pendingItems: 1,
  },
  {
    id: 8, ref: "ERR-20261023-O5P6",
    reportedAt: new Date("2026-10-23T08:52:00"),
    user: "Deepa Nair", userEmail: "deepa.nair@saveearth.in", userRole: "Field Auditor",
    auditIfsc: "SBIN0016432", branchName: "SBI Mumbai Andheri East",
    step: "12/14 — Generate PDF",
    errorCode: "PDF_GEN_FAILED", errorMessage: "PDF generation failed: MemoryError — the device ran out of available RAM while rendering the report. The audit has 87 photos attached which exceeded the on-device limit.",
    status: "Resolved",
    appVersion: "v2.4.0 (Build 238)", device: "Lava Blaze 2 Pro (Android 13)",
    network: "4G (Vi)", battery: "55%", lastSync: "23-Oct-2026 08:30 AM", pendingItems: 0,
    resolutionNote: "PDF generation re-attempted with photo compression enabled. Report generated successfully.",
  },
  {
    id: 9, ref: "ERR-20261020-Q7R8",
    reportedAt: new Date("2026-10-20T15:42:00"),
    user: "Kiran Joshi", userEmail: "kiran.joshi@saveearth.in", userRole: "Field Auditor",
    auditIfsc: "SBIN0003321", branchName: "SBI Surat Ring Road",
    step: "13/14 — Submit & Sync",
    errorCode: "SYNC_FAILED", errorMessage: "Sync failed after 3 retries. Server returned HTTP 503 — Service Unavailable. The central sync API may have been temporarily down during maintenance.",
    status: "Resolved",
    appVersion: "v2.3.9 (Build 235)", device: "Realme Narzo 60 (Android 14)",
    network: "4G (Jio)", battery: "68%", lastSync: "20-Oct-2026 03:10 PM", pendingItems: 0,
    resolutionNote: "Server maintenance window ended. Auditor manually triggered sync at 4:15 PM. Data uploaded successfully.",
  },
  {
    id: 10, ref: "ERR-20261018-S9T0",
    reportedAt: new Date("2026-10-18T10:33:00"),
    user: "Mohan Yadav", userEmail: "mohan.yadav@saveearth.in", userRole: "Field Auditor",
    auditIfsc: "SBIN0007654", branchName: "SBI Jaipur Vaishali",
    step: "2/14 — Auditor Check-In",
    errorCode: "NO_CONNECTION", errorMessage: "Network request failed: Device was in airplane mode. The check-in beacon could not be transmitted to the server.",
    status: "Resolved",
    appVersion: "v2.4.0 (Build 238)", device: "Samsung Galaxy F15 (Android 14)",
    network: "No Connection (Airplane Mode)", battery: "88%", lastSync: "18-Oct-2026 10:00 AM", pendingItems: 0,
    resolutionNote: "Auditor disabled airplane mode and retried. Check-in recorded at 10:49 AM.",
  },
];

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
function fmt(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
  const hh = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 || 12;
  return `${dd}-${mon} ${h12}:${mm} ${ampm}`;
}

function fmtLong(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
  const yr = d.getFullYear();
  const hh = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 || 12;
  return `${day}-${mon}-${yr} ${h12}:${mm} ${ampm}`;
}

function statusColor(s: ErrorStatus): { fg: string; bg: string; dot: string } {
  if (s === "New")          return { fg: "#b91c1c", bg: "#fee2e2", dot: "#ef4444" };
  if (s === "Acknowledged") return { fg: "#92400e", bg: "#fef3c7", dot: "#f59e0b" };
  return                           { fg: "#14532d", bg: "#dcfce7", dot: "#22c55e" };
}

const TOTAL  = 47;
const NEW_CT = 3;
const ACK_CT = 5;
const RES_CT = 39;

const ERROR_CODES = ["ALL", "NO_CONNECTION", "AUDIT_CONFLICT", "UPLOAD_TIMEOUT", "GPS_DENIED", "AUTH_EXPIRED", "FORM_VALIDATION", "PDF_GEN_FAILED", "SYNC_FAILED"];
const USERS       = ["ALL", "Arun Wagadre", "Akash Bhowate", "Priya Desai", "Ramesh Kulkarni", "Snehal Patil", "Vikram Sharma", "Deepa Nair", "Kiran Joshi", "Mohan Yadav"];

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function ErrorLogsPage() {
  const [data, setData] = useState<ErrorEntry[]>(SEED);
  const [selected, setSelected] = useState<ErrorEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [resNote, setResNote] = useState("");

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [filterUser, setFilterUser]   = useState("ALL");
  const [filterCode, setFilterCode]   = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterIfsc, setFilterIfsc]   = useState("");

  const filtered = useMemo(() => {
    return data.filter(e => {
      if (filterUser   !== "ALL" && e.user      !== filterUser)   return false;
      if (filterCode   !== "ALL" && e.errorCode !== filterCode)   return false;
      if (filterStatus !== "ALL" && e.status    !== filterStatus) return false;
      if (filterIfsc && !e.auditIfsc.toLowerCase().includes(filterIfsc.toLowerCase())) return false;
      if (dateFrom) {
        const from = new Date(dateFrom + "T00:00:00");
        if (e.reportedAt < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo + "T23:59:59");
        if (e.reportedAt > to) return false;
      }
      return true;
    });
  }, [data, filterUser, filterCode, filterStatus, filterIfsc, dateFrom, dateTo]);

  const resetFilters = useCallback(() => {
    setDateFrom(""); setDateTo(""); setFilterUser("ALL");
    setFilterCode("ALL"); setFilterStatus("ALL"); setFilterIfsc("");
  }, []);

  const copyRef = useCallback((ref: string) => {
    navigator.clipboard.writeText(ref).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const handleAcknowledge = useCallback(() => {
    if (!selected) return;
    setData(prev => prev.map(e => e.id === selected.id ? { ...e, status: "Acknowledged" } : e));
    setSelected(prev => prev ? { ...prev, status: "Acknowledged" } : prev);
  }, [selected]);

  const handleResolve = useCallback(() => {
    if (!selected) return;
    setData(prev => prev.map(e => e.id === selected.id ? { ...e, status: "Resolved", resolutionNote: resNote || e.resolutionNote } : e));
    setSelected(prev => prev ? { ...prev, status: "Resolved", resolutionNote: resNote || prev.resolutionNote } : prev);
  }, [selected, resNote]);

  const openPanel = useCallback((e: ErrorEntry) => {
    setSelected(e);
    setResNote(e.resolutionNote ?? "");
  }, []);

  const closePanel = useCallback(() => setSelected(null), []);

  const exportCsv = useCallback(() => {
    const header = ["#","Reference","Time Reported","User","Audit IFSC","Step","Error Code","Status"];
    const rows = filtered.map((e, i) => [
      String(i + 1), e.ref, fmtLong(e.reportedAt), e.user, e.auditIfsc, e.step, e.errorCode, e.status
    ]);
    const csv = [header, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "error-logs.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const sc = selected ? statusColor(selected.status) : { fg: "", bg: "", dot: "" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8f9fb", position: "relative" }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: "24px 32px 0", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
          <i className="ri-error-warning-line" style={{ fontSize: 22, color: "#ef4444" }} />
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827", letterSpacing: -0.3 }}>Error Logs</h1>
        </div>
        <p style={{ margin: "2px 0 16px", fontSize: 13.5, color: "#6b7280" }}>
          Mobile app sync errors reported by field auditors — review, acknowledge, and resolve.
        </p>

        {/* ── Stats Row ─────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 20, paddingBottom: 20 }}>
          {[
            { label: "Total Errors",  value: TOTAL,  color: "#374151", bg: "#f3f4f6", icon: "ri-bar-chart-line" },
            { label: "New",           value: NEW_CT, color: "#b91c1c", bg: "#fee2e2", icon: "ri-error-warning-line" },
            { label: "Acknowledged",  value: ACK_CT, color: "#92400e", bg: "#fef3c7", icon: "ri-time-line" },
            { label: "Resolved",      value: RES_CT, color: "#14532d", bg: "#dcfce7", icon: "ri-checkbox-circle-line" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "12px 20px", minWidth: 120, display: "flex", alignItems: "center", gap: 12 }}>
              <i className={s.icon} style={{ fontSize: 22, color: s.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: 11.5, color: s.color, opacity: 0.8, marginTop: 1, fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter Bar ────────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 32px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {/* Date From */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 7, padding: "6px 10px", fontSize: 13, color: "#111827", background: "#fff", outline: "none", height: 34 }} />
        </div>
        {/* Date To */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 7, padding: "6px 10px", fontSize: 13, color: "#111827", background: "#fff", outline: "none", height: 34 }} />
        </div>
        {/* User */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>User</label>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 7, padding: "6px 10px", fontSize: 13, color: "#111827", background: "#fff", outline: "none", height: 34 }}>
            {USERS.map(u => <option key={u} value={u}>{u === "ALL" ? "All Users" : u}</option>)}
          </select>
        </div>
        {/* Error Code */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>Error Code</label>
          <select value={filterCode} onChange={e => setFilterCode(e.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 7, padding: "6px 10px", fontSize: 13, color: "#111827", background: "#fff", outline: "none", height: 34 }}>
            {ERROR_CODES.map(c => <option key={c} value={c}>{c === "ALL" ? "All Codes" : c}</option>)}
          </select>
        </div>
        {/* Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 7, padding: "6px 10px", fontSize: 13, color: "#111827", background: "#fff", outline: "none", height: 34 }}>
            <option value="ALL">All Status</option>
            <option value="New">New</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        {/* IFSC Search */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>IFSC Search</label>
          <div style={{ position: "relative" }}>
            <i className="ri-search-line" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#9ca3af" }} />
            <input type="text" value={filterIfsc} onChange={e => setFilterIfsc(e.target.value)} placeholder="e.g. SBIN0012661"
              style={{ border: "1px solid #d1d5db", borderRadius: 7, padding: "6px 10px 6px 28px", fontSize: 13, color: "#111827", background: "#fff", outline: "none", height: 34, width: 150 }} />
          </div>
        </div>
        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label style={{ fontSize: 10.5, color: "transparent", fontWeight: 600, userSelect: "none" }}>X</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={resetFilters}
              style={{ height: 34, padding: "0 14px", background: "#f9fafb", border: "1px solid #d1d5db", borderRadius: 7, fontSize: 13, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
              <i className="ri-refresh-line" style={{ fontSize: 13 }} />
              Reset
            </button>
            <button onClick={exportCsv}
              style={{ height: 34, padding: "0 14px", background: "#111827", border: "none", borderRadius: 7, fontSize: 13, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
              <i className="ri-download-2-line" style={{ fontSize: 13 }} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 32px" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          {/* Table Header */}
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 48 }} />
              <col style={{ width: 190 }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 145 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 170 }} />
              <col style={{ width: 145 }} />
              <col style={{ width: 120 }} />
            </colgroup>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["#", "Reference", "Time Reported", "User", "Audit IFSC", "Step", "Error Code", "Status"].map((h, i) => (
                  <th key={h} style={{
                    padding: i === 0 ? "11px 0 11px 16px" : "11px 12px",
                    textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#6b7280",
                    textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px 0", textAlign: "center" }}>
                    <i className="ri-file-search-line" style={{ fontSize: 36, color: "#d1d5db", display: "block", marginBottom: 8 }} />
                    <span style={{ fontSize: 14, color: "#9ca3af" }}>No errors match the current filters</span>
                  </td>
                </tr>
              ) : filtered.map((e, i) => {
                const { fg, bg, dot } = statusColor(e.status);
                const isSelected = selected?.id === e.id;
                return (
                  <tr key={e.id}
                    onClick={() => openPanel(e)}
                    style={{
                      borderBottom: "1px solid #f3f4f6", cursor: "pointer",
                      background: isSelected ? "#f0f9ff" : "#fff",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={ev => { if (!isSelected) (ev.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                    onMouseLeave={ev => { (ev.currentTarget as HTMLElement).style.background = isSelected ? "#f0f9ff" : "#fff"; }}
                  >
                    <td style={{ padding: "12px 0 12px 16px", fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>{i + 1}</td>
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12.5, color: "#1d4ed8", fontWeight: 600, letterSpacing: 0.3 }}>{e.ref}</span>
                    </td>
                    <td style={{ padding: "12px 12px", fontSize: 13, color: "#374151" }}>{fmt(e.reportedAt)}</td>
                    <td style={{ padding: "12px 12px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.user}</div>
                      <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{e.userRole}</div>
                    </td>
                    <td style={{ padding: "12px 12px", fontFamily: "monospace", fontSize: 12.5, color: "#374151", fontWeight: 500 }}>{e.auditIfsc}</td>
                    <td style={{ padding: "12px 12px", fontSize: 12.5, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.step}</td>
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 11.5, fontWeight: 700, borderRadius: 5, padding: "3px 7px", fontFamily: "monospace", letterSpacing: 0.2 }}>
                        {e.errorCode}
                      </span>
                    </td>
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{ background: bg, color: fg, fontSize: 12, fontWeight: 600, borderRadius: 20, padding: "4px 10px", display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                        {e.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", background: "#fafafa", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12.5, color: "#9ca3af" }}>
              Showing <strong style={{ color: "#374151" }}>{filtered.length}</strong> of <strong style={{ color: "#374151" }}>{TOTAL}</strong> errors
            </span>
          </div>
        </div>
      </div>

      {/* ── Slide-In Detail Panel ─────────────────────────────────────────────── */}
      {/* Backdrop */}
      {selected && (
        <div
          onClick={closePanel}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 40,
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 480,
        background: "#fff", zIndex: 50, boxShadow: "-4px 0 32px rgba(0,0,0,0.14)",
        transform: selected ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1)",
        display: "flex", flexDirection: "column",
        overflowY: "auto",
      }}>
        {selected && (
          <>
            {/* Panel Header */}
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <i className="ri-error-warning-fill" style={{ fontSize: 18, color: sc.fg }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Error Report #{selected.id}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginTop: 3, letterSpacing: -0.2 }}>{selected.errorCode}</div>
              </div>
              <button onClick={closePanel}
                style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className="ri-close-line" style={{ fontSize: 16, color: "#6b7280" }} />
              </button>
            </div>

            {/* Panel Body */}
            <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0 }}>

              {/* Reference + Copy */}
              <div style={{ background: "#f8f9fb", borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Reference</div>
                  <span style={{ fontFamily: "monospace", fontSize: 13.5, color: "#1d4ed8", fontWeight: 700, letterSpacing: 0.4 }}>{selected.ref}</span>
                </div>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => copyRef(selected.ref)}
                    style={{ height: 32, padding: "0 12px", background: "#fff", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#374151", fontWeight: 500 }}>
                    <i className={copied ? "ri-check-line" : "ri-file-copy-line"} style={{ fontSize: 13, color: copied ? "#22c55e" : "#6b7280" }} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Timestamp */}
              <PanelRow icon="ri-time-line" label="Reported At" value={fmtLong(selected.reportedAt)} />

              {/* Divider + Section: User */}
              <PanelSection label="USER" />
              <PanelRow icon="ri-user-line"  label="Name"  value={selected.user} />
              <PanelRow icon="ri-mail-line"  label="Email" value={selected.userEmail} mono />
              <PanelRow icon="ri-shield-user-line" label="Role" value={selected.userRole} />

              {/* Divider + Section: Audit Context */}
              <PanelSection label="AUDIT CONTEXT" />
              <PanelRow icon="ri-bank-line"    label="Branch IFSC"   value={selected.auditIfsc} mono />
              <PanelRow icon="ri-building-line" label="Branch Name"  value={selected.branchName} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <i className="ri-route-line" style={{ fontSize: 14, color: "#9ca3af", marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>Step</div>
                    <div style={{ fontSize: 13.5, color: "#111827", marginTop: 2 }}>{selected.step}</div>
                  </div>
                </div>
                <a href="#" style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  Open Audit <i className="ri-external-link-line" style={{ fontSize: 11 }} />
                </a>
              </div>

              {/* Divider + Section: Error */}
              <PanelSection label="ERROR" />
              <PanelRow icon="ri-error-warning-line" label="Error Code" value={selected.errorCode} mono badge />
              <div style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <i className="ri-chat-quote-line" style={{ fontSize: 14, color: "#9ca3af", marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>Message</div>
                    <div style={{ fontSize: 13, color: "#374151", marginTop: 3, lineHeight: 1.55 }}>{selected.errorMessage}</div>
                  </div>
                </div>
              </div>

              {/* Divider + Section: Device & Environment */}
              <PanelSection label="DEVICE & ENVIRONMENT" />
              <PanelRow icon="ri-smartphone-line"    label="App Version" value={selected.appVersion} />
              <PanelRow icon="ri-device-line"        label="Device"      value={selected.device} />
              <PanelRow icon="ri-wifi-line"          label="Network"     value={selected.network} />
              <PanelRow icon="ri-battery-2-charge-line" label="Battery"  value={selected.battery} />
              <PanelRow icon="ri-refresh-line"       label="Last Sync"   value={selected.lastSync} />
              <PanelRow icon="ri-inbox-line"         label="Pending Items" value={String(selected.pendingItems)} />

              {/* Divider + Section: Status & Actions */}
              <PanelSection label="STATUS & RESOLUTION" />

              {/* Current Status */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                <i className="ri-flag-line" style={{ fontSize: 14, color: "#9ca3af" }} />
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, minWidth: 90 }}>Current Status</div>
                <span style={{ background: sc.bg, color: sc.fg, fontSize: 12, fontWeight: 600, borderRadius: 20, padding: "3px 10px", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                  {selected.status}
                </span>
              </div>

              {/* Resolution Note */}
              {selected.resolutionNote && (
                <div style={{ padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>Resolution Note</div>
                  <div style={{ fontSize: 13, color: "#374151", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "8px 12px", lineHeight: 1.55 }}>
                    {selected.resolutionNote}
                  </div>
                </div>
              )}

              {/* Resolution textarea + action buttons (only if not resolved) */}
              {selected.status !== "Resolved" && (
                <div style={{ paddingTop: 16 }}>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Resolution Note</label>
                  <textarea
                    value={resNote}
                    onChange={e => setResNote(e.target.value)}
                    placeholder="Add a resolution note or next steps…"
                    rows={3}
                    style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 7, padding: "8px 10px", fontSize: 13, color: "#111827", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  />
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    {selected.status === "New" && (
                      <button onClick={handleAcknowledge}
                        style={{ flex: 1, height: 36, background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 7, fontSize: 13, color: "#92400e", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <i className="ri-time-line" style={{ fontSize: 14 }} />
                        Acknowledge
                      </button>
                    )}
                    <button onClick={handleResolve}
                      style={{ flex: 1, height: 36, background: "#22c55e", border: "none", borderRadius: 7, fontSize: 13, color: "#fff", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <i className="ri-checkbox-circle-line" style={{ fontSize: 14 }} />
                      Mark Resolved
                    </button>
                  </div>
                </div>
              )}

            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}

/* ─── Sub-components ────────────────────────────────────────────────────────── */
function PanelSection({ label }: { label: string }) {
  return (
    <div style={{ margin: "16px 0 8px", display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
    </div>
  );
}

function PanelRow({ icon, label, value, mono, badge }: {
  icon: string; label: string; value: string; mono?: boolean; badge?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
      <i className={icon} style={{ fontSize: 14, color: "#9ca3af", marginTop: 1, flexShrink: 0 }} />
      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, minWidth: 90, paddingTop: 1, flexShrink: 0 }}>{label}</div>
      {badge ? (
        <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 12, fontWeight: 700, borderRadius: 5, padding: "2px 8px", fontFamily: "monospace", letterSpacing: 0.2 }}>{value}</span>
      ) : (
        <div style={{ fontSize: 13.5, color: "#111827", fontFamily: mono ? "monospace" : "inherit", letterSpacing: mono ? 0.3 : 0, wordBreak: "break-all" }}>{value}</div>
      )}
    </div>
  );
}
