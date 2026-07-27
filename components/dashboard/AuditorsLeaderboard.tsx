import React from "react";
import Link from "next/link";
import { AUDITORS_LEADERBOARD } from "@/lib/constants/dashboard-data";

const COLORS  = ["#16a34a","#2563eb","#10b981","#15803d","#ec4899"];
const INITIALS = ["RS","AV","NS","SP","RY"];

export default function AuditorsLeaderboard() {
  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Top Auditors</h3>
        <Link href="#" className="zf-view-all">View All <i className="ri-arrow-right-s-line" /></Link>
      </div>
      <div className="card-body zf-widget-body">
        {AUDITORS_LEADERBOARD.map((c, i) => (
          <div key={c.rank} className="zf-lb-item">
            <span className="zf-lb-rank">{c.rank}</span>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: COLORS[i], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
              {INITIALS[i]}
            </div>
            <span className="zf-lb-name">{c.name}</span>
            <span className="zf-lb-count">{c.count} Audits {c.trophy && "🏆"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
