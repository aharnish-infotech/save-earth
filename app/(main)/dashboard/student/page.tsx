"use client";

import React, { useState } from "react";
import Link from "next/link";
import KPICard from "@/components/dashboard/KPICard";

// ── Data ──────────────────────────────────────────────────────────────────────
const STUDENT = {
  id:      "ZF2526001",
  name:    "Arjun Mehta",
  course:  "BCA",
  semester:"Semester 3",
  session: "2025-26",
  rollNo:  "BCA2526001",
  section: "A",
};

const FEE = { total:180000, paid:120000, due:60000, nextDue:"31 Jul 2025" };
const feePct = Math.round((FEE.paid / FEE.total) * 100);

const ATTENDANCE = [
  { subject:"Programming in C",            attended:38, total:42, pct:90 },
  { subject:"Data Structures",             attended:35, total:42, pct:83 },
  { subject:"Mathematics-II",              attended:40, total:42, pct:95 },
  { subject:"Database Management System",  attended:29, total:42, pct:69 },
  { subject:"Web Technologies",            attended:36, total:42, pct:85 },
  { subject:"Software Engineering",        attended:33, total:42, pct:78 },
];
const avgAtt = Math.round(ATTENDANCE.reduce((s,a) => s + a.pct, 0) / ATTENDANCE.length);

const UPCOMING = [
  { date:"15 Jul", event:"Mid-term — Data Structures",      time:"10:00 AM", type:"exam",   icon:"ri-file-list-3-line",         color:"#dc2626", bg:"#fee2e2" },
  { date:"17 Jul", event:"Mid-term — Web Technologies",     time:"10:00 AM", type:"exam",   icon:"ri-file-list-3-line",         color:"#dc2626", bg:"#fee2e2" },
  { date:"20 Jul", event:"DBMS Project Submission",         time:"05:00 PM", type:"assign", icon:"ri-task-line",                color:"#d97706", bg:"#fef3c7" },
  { date:"25 Jul", event:"Fee Installment 2 Due",           time:"Before 5PM",type:"fee",   icon:"ri-money-rupee-circle-line",  color:"#059669", bg:"#d1fae5" },
  { date:"31 Jul", event:"College Annual Day",              time:"10:00 AM", type:"event",  icon:"ri-star-line",                color:"#7c3aed", bg:"#ede9fe" },
];

const NOTICES = [
  { date:"12 Jul", title:"Semester 3 Exam Form Last Date",     tag:"Exam",    badgeClass:"bg-danger-transparent",  urgent:true  },
  { date:"10 Jul", title:"Holiday: College Annual Day",         tag:"Holiday", badgeClass:"bg-success-transparent", urgent:false },
  { date:"08 Jul", title:"Fee Payment Reminder — Installment 2",tag:"Fee",    badgeClass:"bg-warning-transparent", urgent:true  },
  { date:"05 Jul", title:"Sports Day Registration Open",        tag:"Event",   badgeClass:"bg-primary-transparent", urgent:false },
  { date:"01 Jul", title:"Library — New Books for BCA Sem 3",  tag:"Library", badgeClass:"bg-info-transparent",    urgent:false },
];

const DOCS = [
  { label:"10th Mark Sheet",          status:"verified" },
  { label:"12th Mark Sheet",          status:"verified" },
  { label:"Aadhar Card",              status:"verified" },
  { label:"Category Certificate",     status:"pending"  },
  { label:"Migration Certificate",    status:"missing"  },
];

const DOC_STYLE: Record<string,{ icon:string; badgeClass:string; label:string }> = {
  verified: { icon:"ri-checkbox-circle-fill", badgeClass:"bg-success-transparent", label:"Verified" },
  pending:  { icon:"ri-time-fill",             badgeClass:"bg-warning-transparent", label:"Pending"  },
  missing:  { icon:"ri-close-circle-fill",     badgeClass:"bg-danger-transparent",  label:"Missing"  },
};

const KPIS = [
  { id:"attendance", label:"Attendance",  value:`${avgAtt}%`,  trend:avgAtt>=75?"Good":"Risk", trendDir:avgAtt>=75?"up" as const:"down" as const, trendLabel:avgAtt>=75?"standing":"below 75%", icon:"ri-calendar-check-line",    colorClass:avgAtt>=75?"success":"danger" },
  { id:"fee-paid",   label:"Fee Paid",    value:`${feePct}%`,  trend:"+0",                     trendDir:"up"   as const,                          trendLabel:"₹1.2L of ₹1.8L",                 icon:"ri-money-rupee-circle-line", colorClass:"primary" },
  { id:"fee-due",    label:"Fee Due",     value:"₹60K",        trend:"Due",                    trendDir:"down" as const,                          trendLabel:FEE.nextDue,                       icon:"ri-error-warning-line",      colorClass:"warning" },
  { id:"docs",       label:"Documents",   value:`${DOCS.filter(d=>d.status==="verified").length}/${DOCS.length}`, trend:`${DOCS.filter(d=>d.status==="missing").length}`, trendDir:"down" as const, trendLabel:"missing", icon:"ri-folder-check-line", colorClass:"info" },
];

export default function StudentDashboard() {
  const [activeNotice, setActiveNotice] = useState<number|null>(null);

  return (
    <>
      {/* ── Student Identity Banner ── */}
      <div className="card custom-card mb-3" style={{ background:"linear-gradient(135deg,#6c5ffc 0%,#a78bfa 100%)", border:"none", overflow:"hidden" }}>
        <div className="card-body p-4" style={{ position:"relative" }}>
          {/* decorative circles */}
          <div style={{ position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.06)" }} />
          <div style={{ position:"absolute",bottom:-50,right:100,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.04)" }} />

          <div className="d-flex align-items-center gap-4" style={{ position:"relative" }}>
            <span
              style={{ width:68,height:68,borderRadius:16,background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:24,fontWeight:800,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"2px solid rgba(255,255,255,0.3)" }}
            >
              {STUDENT.name.split(" ").map(w=>w[0]).join("")}
            </span>
            <div className="flex-fill">
              <h4 className="mb-1 fw-bold" style={{ color:"#fff",fontSize:20 }}>{STUDENT.name}</h4>
              <p className="mb-0 fs-13" style={{ color:"rgba(255,255,255,0.8)" }}>
                {STUDENT.course} &nbsp;·&nbsp; {STUDENT.semester} &nbsp;·&nbsp; Section {STUDENT.section}
              </p>
              <p className="mb-0 fs-12 mt-1" style={{ color:"rgba(255,255,255,0.65)" }}>
                Roll No: {STUDENT.rollNo} &nbsp;·&nbsp; Session: {STUDENT.session}
              </p>
            </div>
            <Link
              href={`/students/${STUDENT.id}`}
              className="btn btn-sm"
              style={{ background:"rgba(255,255,255,0.2)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",fontWeight:600,fontSize:12 }}
            >
              <i className="ri-user-line me-1" />My Profile
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="zf-kpi-grid">
        {KPIS.map((c) => <KPICard key={c.id} {...c} />)}
      </div>

      {/* ── Row 1: Attendance + Upcoming ── */}
      <div className="row g-3 mb-3">

        {/* Subject Attendance */}
        <div className="col-xxl-6">
          <div className="card custom-card h-100 mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0 d-flex align-items-center gap-2">
                Subject Attendance
                <span className={`badge ${avgAtt >= 75 ? "bg-success-transparent" : "bg-danger-transparent"}`}>
                  Avg: {avgAtt}%
                </span>
              </div>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-3 d-flex flex-column gap-3">
                {ATTENDANCE.map((s) => {
                  const color  = s.pct >= 75 ? "#059669" : s.pct >= 65 ? "#d97706" : "#dc2626";
                  const badge  = s.pct >= 75 ? "bg-success-transparent" : s.pct >= 65 ? "bg-warning-transparent" : "bg-danger-transparent";
                  return (
                    <li key={s.subject}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fs-13 fw-medium text-default" title={s.subject} style={{ maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                          {s.subject}
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-12 text-muted">{s.attended}/{s.total}</span>
                          <span className={`badge ${badge}`}>{s.pct}%</span>
                        </div>
                      </div>
                      <div className="progress" style={{ height:5 }}>
                        <div className="progress-bar" style={{ width:`${s.pct}%`, background:color, borderRadius:4 }} />
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Warning */}
              <div className="alert alert-warning d-flex align-items-center gap-2 mb-0 py-2 px-3" style={{ fontSize:12 }}>
                <i className="ri-alert-line fs-14" />
                Minimum 75% attendance required to appear for exams.
                {ATTENDANCE.some(s => s.pct < 75) && <span className="badge bg-danger ms-1">DBMS at risk</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="col-xxl-6">
          <div className="card custom-card h-100 mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0">Upcoming Events & Deadlines</div>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                {UPCOMING.map((u, i) => (
                  <li key={i} className="d-flex align-items-center gap-3 p-2 rounded-2" style={{ background:"var(--default-background)" }}>
                    <span
                      style={{ width:36,height:36,borderRadius:10,background:u.bg,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}
                    >
                      <i className={u.icon} style={{ fontSize:16,color:u.color }} />
                    </span>
                    <div className="flex-fill">
                      <span className="d-block fs-13 fw-semibold text-default lh-1 mb-1">{u.event}</span>
                      <span className="fs-11 text-muted">{u.time}</span>
                    </div>
                    <span className="badge bg-light text-default border fs-11">{u.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Fee + Documents + Notices ── */}
      <div className="row g-3">

        {/* Fee Status */}
        <div className="col-xxl-4">
          <div className="card custom-card mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0">Fee Status</div>
              <Link href="/fees" className="text-muted fs-13">Details <i className="ri-arrow-right-s-line" /></Link>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <h2 className="fw-bold mb-0" style={{ color:"#059669" }}>₹1,20,000</h2>
                <p className="text-muted fs-12 mb-0">Paid of ₹1,80,000 total</p>
              </div>

              <div className="progress mb-3" style={{ height:10,borderRadius:8 }}>
                <div className="progress-bar bg-success" style={{ width:`${feePct}%`,borderRadius:8 }} />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="p-2 rounded-2 text-center" style={{ background:"#d1fae5" }}>
                    <p className="mb-0 fs-12 fw-medium" style={{ color:"#059669" }}>Paid</p>
                    <h6 className="mb-0 fw-bold" style={{ color:"#059669" }}>₹1,20,000</h6>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 rounded-2 text-center" style={{ background:"#fee2e2" }}>
                    <p className="mb-0 fs-12 fw-medium" style={{ color:"#dc2626" }}>Due</p>
                    <h6 className="mb-0 fw-bold" style={{ color:"#dc2626" }}>₹60,000</h6>
                  </div>
                </div>
              </div>

              <div className="alert alert-warning d-flex align-items-center gap-2 mb-0 py-2 px-3" style={{ fontSize:12 }}>
                <i className="ri-calendar-line fs-14" />
                Next due date: <strong className="ms-1">{FEE.nextDue}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="col-xxl-4">
          <div className="card custom-card mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0 d-flex align-items-center gap-2">
                Documents
                {DOCS.some(d => d.status === "missing") && (
                  <span className="badge bg-danger-transparent">{DOCS.filter(d=>d.status==="missing").length} missing</span>
                )}
              </div>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {DOCS.map((d) => {
                  const ds = DOC_STYLE[d.status];
                  return (
                    <li key={d.label} className="list-group-item d-flex align-items-center justify-content-between px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <i className={ds.icon} style={{ fontSize:14, color: d.status==="verified"?"#059669":d.status==="pending"?"#d97706":"#dc2626" }} />
                        <span className="fs-13 fw-medium text-default">{d.label}</span>
                      </div>
                      <span className={`badge ${ds.badgeClass}`}>{ds.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="card-footer">
              <Link href={`/students/${STUDENT.id}`} className="btn btn-primary-light btn-sm w-100">
                Upload Missing Documents
              </Link>
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="col-xxl-4">
          <div className="card custom-card mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0">Notices</div>
              <span className="badge bg-primary-transparent">{NOTICES.length} new</span>
            </div>
            <div className="card-body p-0">
              <ul className="list-unstyled mb-0">
                {NOTICES.map((n, i) => (
                  <li
                    key={i}
                    onClick={() => setActiveNotice(activeNotice === i ? null : i)}
                    className="px-4 py-3 cursor-pointer"
                    style={{ borderBottom:"1px solid var(--default-border)", cursor:"pointer", background: activeNotice===i ? "var(--default-background)" : "transparent" }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      {n.urgent && <i className="ri-error-warning-fill text-danger" style={{ fontSize:12 }} />}
                      <span className={`badge ${n.badgeClass}`}>{n.tag}</span>
                      <span className="text-muted fs-11 ms-auto">{n.date}</span>
                    </div>
                    <p className="mb-0 fs-13 fw-medium text-default lh-base">{n.title}</p>
                    {activeNotice === i && (
                      <p className="mb-0 mt-1 fs-12 text-muted">
                        Click to view full notice details and any attached documents.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
