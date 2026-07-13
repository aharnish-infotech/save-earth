"use client";

import React from "react";
import Link from "next/link";
import KPICard from "@/components/dashboard/KPICard";

// ── Data ──────────────────────────────────────────────────────────────────────
const KPIS = [
  { id:"enrolled",    label:"Total Enrolled",      value:"1,842",  trend:"+127", trendDir:"up"   as const, trendLabel:"this session",   icon:"ri-team-line",               colorClass:"primary"   },
  { id:"rate",        label:"Admission Rate",       value:"68.4%",  trend:"+4.2%",trendDir:"up"   as const, trendLabel:"vs last year",   icon:"ri-percent-line",            colorClass:"info"      },
  { id:"fee",         label:"Fee Collected",        value:"₹1.24Cr",trend:"82%", trendDir:"up"   as const, trendLabel:"of target",      icon:"ri-money-rupee-circle-line", colorClass:"success"   },
  { id:"approvals",   label:"Pending Approvals",    value:"23",     trend:"23",   trendDir:"down" as const, trendLabel:"needs action",   icon:"ri-timer-line",              colorClass:"warning"   },
  { id:"counselors",  label:"Active Counselors",    value:"12",     trend:"2",    trendDir:"down" as const, trendLabel:"on leave today", icon:"ri-customer-service-2-line", colorClass:"secondary" },
  { id:"scholarship", label:"Scholarships Pending", value:"47",     trend:"8",    trendDir:"down" as const, trendLabel:"critical",       icon:"ri-award-line",              colorClass:"danger"    },
];

const COURSE_STRENGTH = [
  { course:"BCA",   enrolled:180, target:200, pct:90  },
  { course:"B.Com", enrolled:220, target:240, pct:91  },
  { course:"BBA",   enrolled:160, target:180, pct:88  },
  { course:"B.Sc",  enrolled:140, target:160, pct:87  },
  { course:"MBA",   enrolled:95,  target:120, pct:79  },
  { course:"MCA",   enrolled:72,  target:100, pct:72  },
  { course:"M.Com", enrolled:58,  target:80,  pct:72  },
];

const PENDING_APPROVALS = [
  { type:"Fee Concession",    student:"Amit Sharma",  course:"BCA",   date:"Today",      urgency:"high"   },
  { type:"Transfer Request",  student:"Priya Verma",  course:"B.Com", date:"Today",      urgency:"high"   },
  { type:"Scholarship",       student:"Ravi Patel",   course:"MBA",   date:"Yesterday",  urgency:"medium" },
  { type:"Document Waiver",   student:"Sneha Joshi",  course:"BBA",   date:"2 days ago", urgency:"low"    },
  { type:"Fee Concession",    student:"Mohit Gupta",  course:"MCA",   date:"2 days ago", urgency:"medium" },
];

const COUNSELORS = [
  { name:"Riya Sharma", enquiries:84, converted:31, rate:"36.9%" },
  { name:"Amit Verma",  enquiries:76, converted:27, rate:"35.5%" },
  { name:"Neha Shah",   enquiries:91, converted:29, rate:"31.8%" },
  { name:"Raj Patel",   enquiries:68, converted:22, rate:"32.3%" },
  { name:"Sunita Nair", enquiries:58, converted:18, rate:"31.0%" },
];

const FEE_BREAKDOWN = [
  { label:"Collected",  amount:"₹1,24,80,000", color:"#059669", badgeClass:"bg-success-transparent", pct:82 },
  { label:"Outstanding",amount:"₹27,40,000",   color:"#dc2626", badgeClass:"bg-danger-transparent",  pct:18 },
  { label:"Concession", amount:"₹8,20,000",    color:"#d97706", badgeClass:"bg-warning-transparent", pct:5  },
  { label:"Refunded",   amount:"₹1,80,000",    color:"#0891b2", badgeClass:"bg-info-transparent",    pct:1  },
];

const URGENCY: Record<string,{ badgeClass:string; label:string }> = {
  high:   { badgeClass:"bg-danger-transparent",  label:"Urgent" },
  medium: { badgeClass:"bg-warning-transparent", label:"Medium" },
  low:    { badgeClass:"bg-success-transparent", label:"Normal" },
};

const AVATAR_COLORS = ["#7c3aed","#2563eb","#059669","#d97706","#0891b2"];

export default function PrincipalDashboard() {
  return (
    <>
      {/* Page Header */}
      <div className="zf-page-header">
        <div>
          <h1 className="zf-page-title">Principal Dashboard</h1>
          <p className="zf-page-sub">Session 2025-26 · Institution-wide overview</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-light btn-sm d-flex align-items-center gap-1">
            <i className="ri-download-line" /> Export Report
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
            <i className="ri-check-double-line" /> Review Approvals
            <span className="badge bg-white text-primary ms-1" style={{ fontSize:10 }}>23</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="zf-kpi-grid">
        {KPIS.map((c) => <KPICard key={c.id} {...c} />)}
      </div>

      {/* Row 1 — Course Strength + Pending Approvals */}
      <div className="row g-3 mb-3">

        {/* Course-wise Strength */}
        <div className="col-xxl-5">
          <div className="card custom-card h-100 mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0">Course-wise Strength</div>
              <Link href="/reports/students" className="btn btn-primary-light btn-sm">View Report</Link>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                {COURSE_STRENGTH.map((c) => {
                  const color = c.pct >= 85 ? "#059669" : c.pct >= 75 ? "#d97706" : "#dc2626";
                  const badgeClass = c.pct >= 85 ? "bg-success-transparent" : c.pct >= 75 ? "bg-warning-transparent" : "bg-danger-transparent";
                  return (
                    <li key={c.course}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fs-13 fw-semibold text-default">{c.course}</span>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-12 text-muted">{c.enrolled}/{c.target}</span>
                          <span className={`badge ${badgeClass}`}>{c.pct}%</span>
                        </div>
                      </div>
                      <div className="progress" style={{ height:5 }}>
                        <div
                          className="progress-bar"
                          style={{ width:`${c.pct}%`, background:color, borderRadius:4 }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="col-xxl-7">
          <div className="card custom-card h-100 mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0 d-flex align-items-center gap-2">
                Pending Approvals
                <span className="badge bg-danger-transparent">23 total</span>
              </div>
              <Link href="#" className="btn btn-primary-light btn-sm">View All</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table text-nowrap mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="fs-11 fw-bold text-muted" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>Student</th>
                      <th className="fs-11 fw-bold text-muted" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>Type</th>
                      <th className="fs-11 fw-bold text-muted" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>Course</th>
                      <th className="fs-11 fw-bold text-muted" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>Raised</th>
                      <th className="fs-11 fw-bold text-muted" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>Priority</th>
                      <th className="fs-11 fw-bold text-muted" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PENDING_APPROVALS.map((p, i) => {
                      const u = URGENCY[p.urgency];
                      return (
                        <tr key={i}>
                          <td className="fw-semibold fs-13">{p.student}</td>
                          <td className="fs-13 text-muted">{p.type}</td>
                          <td className="fs-13 text-muted">{p.course}</td>
                          <td className="fs-13 text-muted">{p.date}</td>
                          <td><span className={`badge ${u.badgeClass}`}>{u.label}</span></td>
                          <td>
                            <div className="d-flex gap-1">
                              <button className="btn btn-sm btn-success-light" style={{ width:28,height:28,padding:0,display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:7 }} title="Approve">
                                <i className="ri-check-line" style={{ fontSize:12 }} />
                              </button>
                              <button className="btn btn-sm btn-danger-light" style={{ width:28,height:28,padding:0,display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:7 }} title="Reject">
                                <i className="ri-close-line" style={{ fontSize:12 }} />
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
          </div>
        </div>
      </div>

      {/* Row 2 — Counselor Performance + Fee Summary */}
      <div className="row g-3">

        {/* Counselor Performance */}
        <div className="col-xxl-7">
          <div className="card custom-card mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0">Counselor Performance</div>
              <Link href="/admission-crm/counseling" className="text-muted fs-13">
                View Details <i className="ri-arrow-right-s-line ms-1" />
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table text-nowrap mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="fs-11 fw-bold text-muted" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>#</th>
                      <th className="fs-11 fw-bold text-muted" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>Counselor</th>
                      <th className="fs-11 fw-bold text-muted text-center" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>Enquiries</th>
                      <th className="fs-11 fw-bold text-muted text-center" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>Converted</th>
                      <th className="fs-11 fw-bold text-muted text-center" style={{ textTransform:"uppercase", letterSpacing:"0.05em" }}>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COUNSELORS.map((c, i) => (
                      <tr key={c.name}>
                        <td className="text-muted fs-13 fw-semibold">{i + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="avatar avatar-sm avatar-rounded"
                              style={{ width:30,height:30,borderRadius:"50%",background:AVATAR_COLORS[i],color:"#fff",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}
                            >
                              {c.name.split(" ").map(w=>w[0]).join("")}
                            </span>
                            <span className="fw-semibold fs-13">{c.name}</span>
                            {i === 0 && <span className="badge bg-warning-transparent ms-1">🏆 Top</span>}
                          </div>
                        </td>
                        <td className="text-center fs-13 text-muted">{c.enquiries}</td>
                        <td className="text-center fs-13 fw-semibold text-success">{c.converted}</td>
                        <td className="text-center">
                          <span className="badge bg-primary-transparent">{c.rate}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Summary */}
        <div className="col-xxl-5">
          <div className="card custom-card mb-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="card-title mb-0">Fee Summary</div>
              <Link href="/fees" className="text-muted fs-13">
                Full Report <i className="ri-arrow-right-s-line ms-1" />
              </Link>
            </div>
            <div className="card-body">

              {/* Stacked bar */}
              <div className="mb-3" style={{ height:8, borderRadius:8, overflow:"hidden", display:"flex" }}>
                {FEE_BREAKDOWN.map((f) => (
                  <div key={f.label} title={f.label} style={{ flex:f.pct, background:f.color }} />
                ))}
              </div>

              <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                {FEE_BREAKDOWN.map((f) => (
                  <li key={f.label} className="d-flex align-items-center justify-content-between p-2 rounded-2" style={{ background:"var(--default-background)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width:10,height:10,borderRadius:"50%",background:f.color,display:"inline-block",flexShrink:0 }} />
                      <span className="fs-13 fw-medium text-default">{f.label}</span>
                    </div>
                    <span className="fs-13 fw-bold" style={{ color:f.color }}>{f.amount}</span>
                  </li>
                ))}
              </ul>

              <div className="border-top mt-3 pt-3 text-center">
                <p className="text-muted fs-12 mb-1">Total Fee Demand · Session 2025-26</p>
                <h3 className="fw-bold mb-0" style={{ color:"var(--default-text-color)" }}>₹1,62,20,000</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
