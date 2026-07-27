import React from "react";
import Link from "next/link";
import { INCOMPLETE_AUDITS } from "@/lib/constants/dashboard-data";

const STATUS_STYLE: Record<string, { color: string; bg: string; icon: string }> = {
  "In Progress": { color: "#2563eb", bg: "#dbeafe", icon: "ri-loader-4-line"      },
  "Overdue":     { color: "#dc2626", bg: "#fee2e2", icon: "ri-alarm-warning-line"  },
  "Assigned":    { color: "#ca8a04", bg: "#fef9c3", icon: "ri-calendar-check-line" },
};

export default function IncompleteAudits() {
  const overdue     = INCOMPLETE_AUDITS.filter(a => a.status === "Overdue").length;
  const inProgress  = INCOMPLETE_AUDITS.filter(a => a.status === "In Progress").length;
  const assigned    = INCOMPLETE_AUDITS.filter(a => a.status === "Assigned").length;

  return (
    <div className="card custom-card mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Incomplete Audits</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#dc2626", background: "#fee2e2", borderRadius: 6, padding: "2px 8px" }}>{overdue} Overdue</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", background: "#dbeafe", borderRadius: 6, padding: "2px 8px" }}>{inProgress} In Progress</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#ca8a04", background: "#fef9c3", borderRadius: 6, padding: "2px 8px" }}>{assigned} Assigned</span>
          <Link href="#" className="zf-view-all" style={{ marginLeft: 4 }}>View All <i className="ri-arrow-right-s-line" /></Link>
        </div>
      </div>
      <div className="card-body" style={{ padding: "0 0 4px 0", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9f9fb" }}>
              <th style={TH}>Audit ID</th>
              <th style={{ ...TH, textAlign: "left" }}>Auditor</th>
              <th style={{ ...TH, textAlign: "left" }}>Bank</th>
              <th style={{ ...TH, textAlign: "left" }}>Branch</th>
              <th style={{ ...TH, textAlign: "center" }}>Assigned</th>
              <th style={{ ...TH, textAlign: "center" }}>Due Date</th>
              <th style={{ ...TH, textAlign: "center" }}>Progress</th>
              <th style={{ ...TH, textAlign: "center" }}>Status</th>
              <th style={{ ...TH, textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {INCOMPLETE_AUDITS.map((a) => {
              const ss = STATUS_STYLE[a.status] ?? { color: "#6b7280", bg: "#f3f4f6", icon: "ri-time-line" };
              const dueBg = a.daysLeft < 0 ? "#fee2e2" : a.daysLeft === 0 ? "#fef9c3" : "transparent";
              const dueColor = a.daysLeft < 0 ? "#dc2626" : a.daysLeft === 0 ? "#ca8a04" : "#6b7280";
              const dueLabel = a.daysLeft < 0
                ? `${Math.abs(a.daysLeft)}d overdue`
                : a.daysLeft === 0
                ? "Due today"
                : `${a.daysLeft}d left`;
              return (
                <tr key={a.auditId} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#15803d", background: "#dcfce7", borderRadius: 6, padding: "2px 8px" }}>{a.auditId}</span>
                  </td>
                  <td style={TD}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                        {a.auditor.split(" ").map(w => w[0]).join("").slice(0,2)}
                      </div>
                      <span style={{ fontWeight: 600, color: "#1e1b4b", fontSize: 12 }}>{a.auditor}</span>
                    </div>
                  </td>
                  <td style={TD}><span style={{ fontSize: 12, color: "#374151" }}>{a.bank}</span></td>
                  <td style={TD}><span style={{ fontWeight: 600, color: "#374151", fontSize: 12 }}>{a.branch}</span></td>
                  <td style={{ ...TD, textAlign: "center", color: "#9ca3af", fontSize: 11 }}>{a.assignedDate}</td>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: dueColor, background: dueBg, borderRadius: 6, padding: "2px 8px" }}>
                      {a.dueDate}<br/><span style={{ fontSize: 10, fontWeight: 700 }}>({dueLabel})</span>
                    </span>
                  </td>
                  <td style={{ ...TD, textAlign: "center", minWidth: 100 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#e5e7eb", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${a.progress}%`, background: a.progress >= 70 ? "#16a34a" : a.progress >= 30 ? "#ca8a04" : "#dc2626", borderRadius: 3, transition: "width 0.3s" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", minWidth: 28 }}>{a.progress}%</span>
                    </div>
                  </td>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: ss.color, background: ss.bg, borderRadius: 20, padding: "2px 10px" }}>
                      <i className={ss.icon} style={{ fontSize: 11 }} />{a.status}
                    </span>
                  </td>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <button style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#15803d", background: "#dcfce7", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
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

const TH: React.CSSProperties = { padding: "9px 14px", fontWeight: 700, fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", borderBottom: "2px solid #dcfce7", textAlign: "center" };
const TD: React.CSSProperties = { padding: "10px 14px", verticalAlign: "middle", whiteSpace: "nowrap" };
