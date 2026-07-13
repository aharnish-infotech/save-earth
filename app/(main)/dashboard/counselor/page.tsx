"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import KPICard from "@/components/dashboard/KPICard";

// ── Data ──────────────────────────────────────────────────────────────────────
const MY_KPIS = [
  { id:"my-enquiries",   label:"My Enquiries",     value:"84", trend:"+6", trendDir:"up"   as const, trendLabel:"this week",      icon:"ri-questionnaire-line",   colorClass:"primary" },
  { id:"followups-today",label:"Follow-ups Today", value:"9",  trend:"3",  trendDir:"down" as const, trendLabel:"overdue",        icon:"ri-calendar-check-line",  colorClass:"danger"  },
  { id:"converted",      label:"Converted",        value:"31", trend:"+4", trendDir:"up"   as const, trendLabel:"this month",     icon:"ri-checkbox-circle-line", colorClass:"success" },
  { id:"hot-leads",      label:"Hot Leads",        value:"12", trend:"+2", trendDir:"up"   as const, trendLabel:"since yesterday",icon:"ri-fire-line",            colorClass:"warning" },
];

const TODAY_FOLLOWUPS = [
  { id: "ZF2526001", name: "Arjun Mehta",    course: "BCA",   time: "10:30 AM", type: "Call",     status: "pending", temp: "Hot",  phone: "9876543210" },
  { id: "ZF2526008", name: "Kavya Nair",     course: "MBA",   time: "11:00 AM", type: "Walk-in",  status: "done",    temp: "Warm", phone: "9123456789" },
  { id: "ZF2526015", name: "Rohan Das",      course: "B.Com", time: "12:30 PM", type: "WhatsApp", status: "overdue", temp: "Hot",  phone: "9988776655" },
  { id: "ZF2526022", name: "Divya Sharma",   course: "BBA",   time: "02:00 PM", type: "Call",     status: "pending", temp: "Cold", phone: "8765432109" },
  { id: "ZF2526031", name: "Manish Gupta",   course: "MCA",   time: "03:30 PM", type: "Call",     status: "pending", temp: "Warm", phone: "9654321098" },
  { id: "ZF2526044", name: "Priya Agarwal",  course: "B.Sc",  time: "04:00 PM", type: "Email",    status: "pending", temp: "Warm", phone: "9543210987" },
  { id: "ZF2526057", name: "Sunil Verma",    course: "MBA",   time: "Overdue",  type: "Call",     status: "overdue", temp: "Hot",  phone: "9432109876" },
  { id: "ZF2526063", name: "Anjali Singh",   course: "B.Com", time: "Overdue",  type: "WhatsApp", status: "overdue", temp: "Warm", phone: "9321098765" },
];

const PIPELINE = [
  { stage: "New Enquiries",    count: 22, color: "#0891b2",  bg: "#e0f2fe" },
  { stage: "In Follow-up",     count: 19, color: "#7c3aed",  bg: "#ede9fe" },
  { stage: "Interested",       count: 14, color: "#d97706",  bg: "#fef3c7" },
  { stage: "Very Interested",  count: 8,  color: "#059669",  bg: "#d1fae5" },
  { stage: "Converted",        count: 31, color: "#16a34a",  bg: "#dcfce7" },
  { stage: "Lost",             count: 7,  color: "#dc2626",  bg: "#fee2e2" },
];

const RECENT_ACTIVITY = [
  { time: "09:45 AM", text: "Arjun Mehta rescheduled to 10:30 AM",           icon: "ri-calendar-event-line", color: "#7c3aed" },
  { time: "09:20 AM", text: "Kavya Nair walk-in done — marked Positive",      icon: "ri-walk-line",           color: "#059669" },
  { time: "Yesterday",text: "Rohan Das not reachable — 3 attempts made",      icon: "ri-phone-off-line",      color: "#dc2626" },
  { time: "Yesterday",text: "New enquiry assigned — Deepak Tiwari (BCA)",     icon: "ri-user-add-line",       color: "#0891b2" },
  { time: "2 days ago",text: "Sunita Kapoor converted — fee paid ₹45,000",   icon: "ri-checkbox-circle-line",color: "#16a34a" },
];

const AVATAR_COLORS = ["#7c3aed","#2563eb","#059669","#d97706","#0891b2","#ec4899","#dc2626","#16a34a"];

const TYPE_ICON: Record<string, string> = {
  Call: "ri-phone-line",
  "Walk-in": "ri-walk-line",
  WhatsApp: "ri-whatsapp-line",
  Email: "ri-mail-line",
};

const STATUS_CONFIG: Record<string, { badgeClass: string; label: string }> = {
  pending: { badgeClass: "bg-primary-transparent",  label: "Pending" },
  done:    { badgeClass: "bg-success-transparent",   label: "Done"    },
  overdue: { badgeClass: "bg-danger-transparent",    label: "Overdue" },
};

const TEMP_CONFIG: Record<string, { badgeClass: string }> = {
  Hot:  { badgeClass: "bg-danger-transparent"  },
  Warm: { badgeClass: "bg-warning-transparent" },
  Cold: { badgeClass: "bg-info-transparent"    },
};

export default function CounselorDashboard() {
  const [filter, setFilter] = useState<"all" | "pending" | "overdue" | "done">("all");

  // Live clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const conversionRate = Math.round((31 / 84) * 100); // converted / total enquiries

  const shown = filter === "all"
    ? TODAY_FOLLOWUPS
    : TODAY_FOLLOWUPS.filter((f) => f.status === filter);

  const totalPipeline = PIPELINE.reduce((s, p) => s + p.count, 0);

  return (
    <>
      {/* ── Page Header ── */}
      <div className="zf-page-header">
        <div>
          <h1 className="zf-page-title">Counselor Dashboard</h1>
          <p className="zf-page-sub">
            Riya Sharma &nbsp;·&nbsp;
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link
            href="/admission-crm/enquiries"
            className="btn btn-light btn-sm d-flex align-items-center gap-1"
          >
            <i className="ri-user-add-line" /> New Enquiry
          </Link>
          <Link
            href="/admission-crm/followups"
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          >
            <i className="ri-calendar-check-line" /> All Follow-ups
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="zf-kpi-grid">
        {MY_KPIS.map((card) => (
          <KPICard key={card.id} {...card} />
        ))}

        {/* 5th slot — Live Date & Time */}
        <div className="card custom-card dashboard-main-card info mb-0">
          <div className="card-body">
            <div className="d-flex align-items-center gap-2 justify-content-between flex-wrap">
              <div>
                <span className="d-block mb-2 fw-medium text-muted fs-13">Current Time</span>
                <h4 className="fw-bold mb-2" style={{ fontFamily:"monospace", fontSize:"1.1rem", letterSpacing:"0.03em" }}>{timeStr}</h4>
                <span className="fs-12 text-muted">{dateStr}</span>
              </div>
              <div className="lh-1">
                <span className="avatar avatar-lg bg-info-transparent">
                  <i className="ri-time-line" style={{ fontSize:24 }} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6th slot — Conversion Rate */}
        <div className="card custom-card dashboard-main-card secondary mb-0">
          <div className="card-body">
            <div className="d-flex align-items-center gap-2 justify-content-between">
              <div style={{ minWidth: 0 }}>
                <span className="d-block mb-2 fw-medium text-muted fs-13">Conversion Rate</span>
                <h4 className="fw-bold mb-2">{conversionRate}%</h4>
                <div className="progress mb-1" style={{ height:4 }}>
                  <div className="progress-bar bg-secondary" style={{ width:`${conversionRate}%`, borderRadius:4 }} />
                </div>
                <span className="fs-12 text-muted">31 of 84 leads</span>
              </div>
              <div className="lh-1">
                <span className="avatar avatar-lg bg-secondary-transparent">
                  <i className="ri-percent-line" style={{ fontSize:24 }} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main: Today's Follow-ups + Right Sidebar ── */}
      <div className="row g-3">

        {/* Today's Follow-ups */}
        <div className="col-xxl-8">
          <div className="card custom-card mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title d-flex align-items-center gap-2 mb-0">
                Today&apos;s Follow-ups
                <span className="badge bg-primary-transparent">{TODAY_FOLLOWUPS.length}</span>
              </div>
              <div className="d-flex gap-1">
                {(["all", "pending", "overdue", "done"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-light"}`}
                    style={{ textTransform: "capitalize", fontSize: 11 }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table text-nowrap mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Student</th>
                      <th style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Course</th>
                      <th style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Time</th>
                      <th style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Via</th>
                      <th style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Temp</th>
                      <th style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                      <th style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((f, i) => {
                      const sc = STATUS_CONFIG[f.status];
                      const tc = TEMP_CONFIG[f.temp];
                      const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                      const initials = f.name.split(" ").map((w) => w[0]).join("");
                      return (
                        <tr key={f.id} style={{ borderLeft: f.status === "overdue" ? "3px solid #dc2626" : "3px solid transparent" }}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className="avatar avatar-sm avatar-rounded"
                                style={{ background: avatarColor, color: "#fff", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }}
                              >
                                {initials}
                              </span>
                              <div>
                                <Link href={`/students/${f.id}`} className="fw-semibold text-default lh-1" style={{ fontSize: 13, textDecoration: "none" }}>
                                  {f.name}
                                </Link>
                                <span className="d-block text-muted fs-11">{f.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-muted fs-13">{f.course}</td>
                          <td>
                            <span className={`fs-13 fw-semibold ${f.status === "overdue" ? "text-danger" : "text-muted"}`}>
                              {f.time}
                            </span>
                          </td>
                          <td>
                            <span className="d-flex align-items-center gap-1 fs-13 text-muted">
                              <i className={TYPE_ICON[f.type]} style={{ fontSize: 14 }} />
                              {f.type}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${tc.badgeClass}`}>{f.temp}</span>
                          </td>
                          <td>
                            <span className={`badge ${sc.badgeClass}`}>{sc.label}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <a
                                href={`tel:${f.phone}`}
                                className="btn btn-sm btn-success-light"
                                title="Call"
                                style={{ width: 28, height: 28, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 7 }}
                              >
                                <i className="ri-phone-line" style={{ fontSize: 12 }} />
                              </a>
                              <button
                                className="btn btn-sm btn-primary-light"
                                title="Log Follow-up"
                                style={{ width: 28, height: 28, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 7 }}
                              >
                                <i className="ri-edit-line" style={{ fontSize: 12 }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer d-flex align-items-center justify-content-between border-top">
              <span className="fs-12 text-muted">Showing {shown.length} of {TODAY_FOLLOWUPS.length} follow-ups</span>
              <Link href="/admission-crm/followups" className="btn btn-primary-light btn-sm">
                View All <i className="ri-arrow-right-s-line ms-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar — Pipeline + Activity + Quick Actions */}
        <div className="col-xxl-4 d-flex flex-column gap-3">

          {/* My Pipeline */}
          <div className="card custom-card mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0">My Pipeline</div>
              <Link href="/admission-crm/leads" className="text-muted fs-13">
                View All <i className="ri-arrow-right-s-line ms-1" />
              </Link>
            </div>
            <div className="card-body">
              <div className="mb-3" style={{ height: 8, borderRadius: 8, overflow: "hidden", display: "flex" }}>
                {PIPELINE.map((p) => (
                  <div key={p.stage} title={`${p.stage}: ${p.count}`} style={{ flex: p.count, background: p.color }} />
                ))}
              </div>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                {PIPELINE.map((p) => (
                  <li key={p.stage} className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block", flexShrink: 0 }} />
                      <span className="fs-13 fw-medium text-default">{p.stage}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 60, height: 4, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${(p.count / totalPipeline) * 100}%`, height: "100%", background: p.color, borderRadius: 4 }} />
                      </div>
                      <span className="fs-13 fw-semibold" style={{ color: p.color, minWidth: 18, textAlign: "right" }}>{p.count}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-top mt-3 pt-2 d-flex align-items-center justify-content-between">
                <span className="fs-12 text-muted fw-medium">Total Leads</span>
                <span className="fs-16 fw-bold text-default">{totalPipeline}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card custom-card mb-0">
            <div className="card-header">
              <div className="card-title mb-0">Recent Activity</div>
            </div>
            <div className="card-body py-3">
              <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                {RECENT_ACTIVITY.map((a, i) => (
                  <li key={i} className="d-flex align-items-start gap-2">
                    <span style={{ width: 28, height: 28, borderRadius: 7, background: `${a.color}18`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className={a.icon} style={{ fontSize: 13, color: a.color }} />
                    </span>
                    <div>
                      <span className="d-block fs-12 fw-medium text-default lh-base">{a.text}</span>
                      <span className="fs-11 text-muted">{a.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card custom-card mb-0">
            <div className="card-header">
              <div className="card-title mb-0">Quick Actions</div>
            </div>
            <div className="card-body">
              <div className="row g-2">
                {[
                  { label: "Log Follow-up",    icon: "ri-chat-check-line",     color: "#7c3aed", bg: "#ede9fe", href: "/admission-crm/followups" },
                  { label: "New Enquiry",       icon: "ri-user-add-line",       color: "#2563eb", bg: "#dbeafe", href: "/admission-crm/enquiries"  },
                  { label: "Schedule Meeting",  icon: "ri-calendar-event-line", color: "#059669", bg: "#d1fae5", href: "#"                         },
                  { label: "Update Status",     icon: "ri-filter-3-line",       color: "#d97706", bg: "#fef3c7", href: "/admission-crm/leads"      },
                  { label: "Send WhatsApp",     icon: "ri-whatsapp-line",       color: "#16a34a", bg: "#dcfce7", href: "#"                         },
                  { label: "All Enquiries",     icon: "ri-questionnaire-line",  color: "#0891b2", bg: "#e0f2fe", href: "/admission-crm/enquiries"  },
                ].map((a) => (
                  <div key={a.label} className="col-6">
                    <Link href={a.href} className="d-flex align-items-center gap-2 p-2 rounded-2 text-decoration-none" style={{ background: a.bg, border: `1px solid ${a.color}22` }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className={a.icon} style={{ fontSize: 14, color: a.color }} />
                      </span>
                      <span className="fs-12 fw-semibold" style={{ color: a.color, lineHeight: 1.3 }}>{a.label}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
