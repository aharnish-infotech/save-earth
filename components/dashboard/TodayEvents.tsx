import React from "react";
import Link from "next/link";
import { TODAY_AUDITS } from "@/lib/constants/dashboard-data";

const scoreColor = (s: number) => s >= 90 ? "#16a34a" : s >= 75 ? "#ca8a04" : "#dc2626";
const scoreBg    = (s: number) => s >= 90 ? "#dcfce7" : s >= 75 ? "#fef9c3" : "#fee2e2";
const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Approved:  { color: "#16a34a", bg: "#dcfce7" },
  Submitted: { color: "#2563eb", bg: "#dbeafe" },
};

export default function TodayEvents() {
  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Today&apos;s Audits</h3>
        <Link href="#" className="zf-view-all">View All <i className="ri-arrow-right-s-line" /></Link>
      </div>
      <div className="card-body zf-widget-body" style={{ padding: "0.5rem 1rem" }}>
        {TODAY_AUDITS.map((a) => {
          const sc = STATUS_STYLE[a.status] ?? { color: "#6b7280", bg: "#f3f4f6" };
          return (
            <div key={a.auditId} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0", borderBottom: "1px solid var(--default-border)",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="ri-checkbox-circle-line" style={{ fontSize: 16, color: "#16a34a" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.branch} <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 11 }}>· {a.bank}</span>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                  <i className="ri-user-line" style={{ fontSize: 11, marginRight: 3 }} />{a.auditor} &nbsp;·&nbsp; {a.completedAt}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: scoreColor(a.score), background: scoreBg(a.score), borderRadius: 6, padding: "1px 7px" }}>{a.score}%</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: sc.color, background: sc.bg, borderRadius: 20, padding: "1px 8px" }}>{a.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
