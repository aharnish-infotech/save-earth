import React from "react";
import Link from "next/link";
import { RECENT_ACTIVITIES } from "@/lib/constants/dashboard-data";

export default function RecentActivity() {
  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Recent Activities</h3>
        <Link href="#" className="zf-view-all">View All <i className="ri-arrow-right-s-line" /></Link>
      </div>
      <div className="card-body zf-widget-body">
        {RECENT_ACTIVITIES.map((a, i) => (
          <div key={i} className="zf-activity-item">
            <span className="zf-activity-dot" style={{ background: a.color }} />
            <div className="zf-activity-text">
              {a.text} <strong>{a.highlight}</strong>
              <span className="zf-activity-time">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
