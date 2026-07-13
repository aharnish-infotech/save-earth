import React from "react";
import Link from "next/link";
import { TODAY_EVENTS } from "@/lib/constants/dashboard-data";

export default function TodayEvents() {
  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Today&apos;s Events</h3>
        <Link href="#" className="zf-view-all">View All <i className="ri-arrow-right-s-line" /></Link>
      </div>
      <div className="card-body zf-widget-body">
        {TODAY_EVENTS.map((event, i) => (
          <div key={i} className="zf-event-item">
            <div className="zf-event-icon" style={{ background: event.iconBg }}>
              <i className={event.icon} style={{ color: event.iconColor }} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="zf-event-title">{event.title}</div>
              <div className="zf-event-meta">{event.meta}</div>
            </div>
            <div className="zf-event-time">{event.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
