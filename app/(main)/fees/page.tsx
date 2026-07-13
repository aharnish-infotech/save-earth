"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const FEE_KPIS = [
  {
    id: "collected",
    label: "Total Collected",
    value: "₹ 12.76 Cr",
    sub: "2026-27",
    trend: "+14.2%",
    trendDir: "up" as const,
    trendLabel: "vs last year",
    icon: "ri-money-rupee-circle-line",
    color: "success",
  },
  {
    id: "outstanding",
    label: "Outstanding Amount",
    value: "₹ 2.35 Cr",
    sub: "Pending",
    trend: "-3.4%",
    trendDir: "down" as const,
    trendLabel: "vs last year",
    icon: "ri-error-warning-line",
    color: "danger",
  },
  {
    id: "defaulters",
    label: "Total Defaulters",
    value: "342",
    sub: "Students",
    trend: "+18",
    trendDir: "up" as const,
    trendLabel: "this month",
    icon: "ri-user-unfollow-line",
    color: "warning",
  },
  {
    id: "efficiency",
    label: "Collection Efficiency",
    value: "84.4%",
    sub: "This Year",
    trend: "+2.1%",
    trendDir: "up" as const,
    trendLabel: "vs last year",
    icon: "ri-pie-chart-2-line",
    color: "primary",
  },
  {
    id: "receipts",
    label: "Receipts Generated",
    value: "9,218",
    sub: "This Year",
    trend: "+11.3%",
    trendDir: "up" as const,
    trendLabel: "vs last year",
    icon: "ri-receipt-line",
    color: "info",
  },
  {
    id: "refunds",
    label: "Refunds Processed",
    value: "₹ 18.4 L",
    sub: "This Year",
    trend: "-6.2%",
    trendDir: "down" as const,
    trendLabel: "vs last year",
    icon: "ri-refund-2-line",
    color: "secondary",
  },
];

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const COLLECTION_SERIES = {
  collected:   [82, 95, 110, 76, 88, 124, 105, 98, 87, 120, 92, 99],
  outstanding: [18, 14, 12, 22, 20, 8,   12, 16, 24, 11, 18, 14],
};

const PAYMENT_MODE = [
  { mode: "Online (UPI / Net Banking)", amount: "₹ 7.42 Cr", pct: 58, color: "#7c3aed" },
  { mode: "Demand Draft",               amount: "₹ 2.55 Cr", pct: 20, color: "#06b6d4" },
  { mode: "Cash",                       amount: "₹ 1.53 Cr", pct: 12, color: "#10b981" },
  { mode: "Cheque",                     amount: "₹ 1.28 Cr", pct: 10, color: "#f59e0b" },
];

const COURSE_COLLECTION = [
  { course: "B.Tech",       collected: 420, target: 480, pct: 87 },
  { course: "BCA",          collected: 185, target: 210, pct: 88 },
  { course: "MBA",          collected: 310, target: 340, pct: 91 },
  { course: "B.Com",        collected: 145, target: 170, pct: 85 },
  { course: "B.Sc",         collected: 98,  target: 120, pct: 82 },
  { course: "M.Tech",       collected: 72,  target: 80,  pct: 90 },
];

const RECENT_RECEIPTS = [
  { id: "REC-2627-09218", student: "Aarav Sharma",    course: "B.Tech CSE",  amount: "₹ 42,500", mode: "UPI",  date: "14 Jul 2026", status: "Paid" },
  { id: "REC-2627-09217", student: "Priya Nair",      course: "MBA",         amount: "₹ 65,000", mode: "NEFT", date: "14 Jul 2026", status: "Paid" },
  { id: "REC-2627-09216", student: "Rohan Verma",     course: "BCA",         amount: "₹ 28,000", mode: "Cash", date: "13 Jul 2026", status: "Paid" },
  { id: "REC-2627-09215", student: "Sneha Patil",     course: "B.Com",       amount: "₹ 22,500", mode: "DD",   date: "13 Jul 2026", status: "Paid" },
  { id: "REC-2627-09214", student: "Karthik Rajan",   course: "B.Sc Maths",  amount: "₹ 18,000", mode: "UPI",  date: "12 Jul 2026", status: "Paid" },
  { id: "REC-2627-09213", student: "Meera Iyer",      course: "M.Tech",      amount: "₹ 55,000", mode: "NEFT", date: "12 Jul 2026", status: "Paid" },
  { id: "REC-2627-09212", student: "Aditya Joshi",    course: "B.Tech ECE",  amount: "₹ 42,500", mode: "UPI",  date: "11 Jul 2026", status: "Paid" },
  { id: "REC-2627-09211", student: "Divya Menon",     course: "MBA",         amount: "₹ 65,000", mode: "Chq",  date: "11 Jul 2026", status: "Paid" },
];

const TOP_DEFAULTERS = [
  { rank: 1,  student: "Vikram Chauhan",   course: "B.Tech Mech", due: "₹ 85,000", overdue: "90+ days", tier: "red"    },
  { rank: 2,  student: "Pallavi Singh",    course: "MBA",         due: "₹ 1,30,000", overdue: "60 days",  tier: "red"  },
  { rank: 3,  student: "Suresh Kumar",     course: "BCA",         due: "₹ 56,000", overdue: "45 days",  tier: "orange" },
  { rank: 4,  student: "Ananya Reddy",     course: "B.Com",       due: "₹ 45,000", overdue: "30 days",  tier: "orange" },
  { rank: 5,  student: "Manoj Tiwari",     course: "B.Tech CSE",  due: "₹ 85,000", overdue: "28 days",  tier: "orange" },
  { rank: 6,  student: "Pooja Desai",      course: "B.Sc Bio",    due: "₹ 36,000", overdue: "22 days",  tier: "orange" },
  { rank: 7,  student: "Rahul Soni",       course: "M.Tech",      due: "₹ 1,10,000", overdue: "90+ days", tier: "red" },
];

// ─── Sub Components ──────────────────────────────────────────────────────────

function KpiCard({ card }: { card: typeof FEE_KPIS[0] }) {
  return (
    <div className={`card custom-card dashboard-main-card ${card.color} mb-0`}>
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 justify-content-between flex-wrap">
          <div>
            <span className="d-block mb-1 fw-medium text-muted fs-13">{card.label}</span>
            <h4 className="fw-bold mb-2">{card.value}</h4>
            <div className="d-flex align-items-center gap-1 flex-wrap">
              <span className={`badge bg-${card.trendDir === "up" ? "success" : "danger"}-transparent rounded-pill d-inline-flex align-items-center`}>
                <i className={`ri-trending-${card.trendDir === "up" ? "up" : "down"}-line me-1`} />
                {card.trend}
              </span>
              <span className="fs-12 text-muted">{card.trendLabel}</span>
            </div>
          </div>
          <span className={`avatar avatar-lg bg-${card.color}-transparent`}>
            <i className={card.icon} style={{ fontSize: 24 }} />
          </span>
        </div>
      </div>
    </div>
  );
}

function CollectionTrendChart() {
  const [Chart, setChart] = useState<any>(null);
  useEffect(() => { import("react-apexcharts").then(m => setChart(() => m.default)); }, []);

  const options: any = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#7c3aed", "#f43f5e"],
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 3 } },
    dataLabels: { enabled: false },
    stroke: { width: [0, 2.5], curve: "smooth" },
    xaxis: {
      categories: MONTHS,
      labels: { style: { fontSize: "11px", colors: "#9ca3af" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "11px", colors: "#9ca3af" },
        formatter: (v: number) => `₹${v}L`,
      },
    },
    legend: {
      position: "top" as const, horizontalAlign: "right" as const,
      fontSize: "12px", markers: { size: 8, shape: "circle" as const },
    },
    grid: { borderColor: "var(--default-border)", strokeDashArray: 4 },
    tooltip: { theme: "light", y: { formatter: (v: number) => `₹ ${v} Lakhs` } },
  };

  const series = [
    { name: "Collected",    type: "bar",  data: COLLECTION_SERIES.collected   },
    { name: "Outstanding",  type: "line", data: COLLECTION_SERIES.outstanding },
  ];

  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Fee Collection Trend</h3>
        <div className="d-flex align-items-center gap-1 border rounded px-2 py-1" style={{ fontSize: 12, cursor: "pointer", color: "var(--default-text-color)" }}>
          2026-27 <i className="ri-arrow-down-s-line" />
        </div>
      </div>
      <div className="card-body zf-widget-body pt-0">
        {Chart ? (
          <Chart options={options} series={series} type="bar" height={280} />
        ) : (
          <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Loading chart…
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentModeChart() {
  const [Chart, setChart] = useState<any>(null);
  useEffect(() => { import("react-apexcharts").then(m => setChart(() => m.default)); }, []);

  const options: any = {
    chart: { type: "donut", fontFamily: "inherit" },
    colors: PAYMENT_MODE.map(p => p.color),
    labels: PAYMENT_MODE.map(p => p.mode),
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: { donut: { size: "70%", labels: {
        show: true,
        total: {
          show: true, label: "Total", fontSize: "13px", color: "#6b7280",
          formatter: () => "₹ 12.76 Cr",
        },
        value: { fontSize: "18px", fontWeight: 700, color: "var(--default-text-color)" },
      } } },
    },
    tooltip: { theme: "light", y: { formatter: (v: number) => `${v}%` } },
  };

  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Payment Mode Breakdown</h3>
      </div>
      <div className="card-body zf-widget-body">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {Chart && (
            <Chart
              options={options}
              series={PAYMENT_MODE.map(p => p.pct)}
              type="donut"
              height={200}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {PAYMENT_MODE.map(p => (
              <div key={p.mode} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--text-muted)", flex: 1 }}>{p.mode}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--default-text-color)" }}>{p.amount}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 32, textAlign: "right" }}>{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCollectionWidget() {
  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Course-wise Collection</h3>
        <Link href="#" className="zf-view-all">Details <i className="ri-arrow-right-s-line" /></Link>
      </div>
      <div className="card-body zf-widget-body">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {COURSE_COLLECTION.map(c => (
            <div key={c.course}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--default-text-color)" }}>{c.course}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  ₹{c.collected}L / ₹{c.target}L
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--default-border)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 999,
                    width: `${c.pct}%`,
                    background: c.pct >= 90 ? "#10b981" : c.pct >= 85 ? "#7c3aed" : "#f59e0b",
                  }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, minWidth: 34, color: c.pct >= 90 ? "#10b981" : c.pct >= 85 ? "#7c3aed" : "#f59e0b" }}>
                  {c.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentReceiptsTable() {
  return (
    <div className="card custom-card mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Recent Receipts</h3>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm btn-light d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
            <i className="ri-download-line" /> Export
          </button>
          <Link href="/fees/receipts" className="zf-view-all">View All <i className="ri-arrow-right-s-line" /></Link>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
            <thead style={{ background: "var(--light)", borderBottom: "1px solid var(--default-border)" }}>
              <tr>
                <th className="px-3 py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Receipt No.</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Student</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Course</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Amount</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Mode</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Date</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Status</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}></th>
              </tr>
            </thead>
            <tbody>
              {RECENT_RECEIPTS.map(r => (
                <tr key={r.id}>
                  <td className="px-3 py-2">
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--primary-color)", fontWeight: 600 }}>{r.id}</span>
                  </td>
                  <td className="py-2 fw-semibold">{r.student}</td>
                  <td className="py-2 text-muted">{r.course}</td>
                  <td className="py-2 fw-bold">{r.amount}</td>
                  <td className="py-2">
                    <span className="badge bg-light text-dark" style={{ fontSize: 11 }}>{r.mode}</span>
                  </td>
                  <td className="py-2 text-muted">{r.date}</td>
                  <td className="py-2">
                    <span className="badge bg-success-transparent text-success rounded-pill">{r.status}</span>
                  </td>
                  <td className="py-2">
                    <button className="btn btn-sm btn-light" style={{ padding: "2px 8px", fontSize: 12 }}>
                      <i className="ri-download-2-line" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TopDefaultersTable() {
  return (
    <div className="card custom-card mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Top Defaulters</h3>
        <Link href="/fees/outstanding" className="zf-view-all">View All <i className="ri-arrow-right-s-line" /></Link>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
            <thead style={{ background: "var(--light)", borderBottom: "1px solid var(--default-border)" }}>
              <tr>
                <th className="px-3 py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>#</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Student</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Course</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Due Amount</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Overdue</th>
                <th className="py-2 fw-semibold text-muted" style={{ fontSize: 12 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {TOP_DEFAULTERS.map(d => (
                <tr key={d.rank}>
                  <td className="px-3 py-2 fw-bold text-muted">{d.rank}</td>
                  <td className="py-2 fw-semibold">{d.student}</td>
                  <td className="py-2 text-muted">{d.course}</td>
                  <td className="py-2 fw-bold" style={{ color: "#ef4444" }}>{d.due}</td>
                  <td className="py-2">
                    <span
                      className="badge rounded-pill"
                      style={{
                        background: d.tier === "red" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                        color: d.tier === "red" ? "#ef4444" : "#d97706",
                        fontSize: 11,
                      }}
                    >
                      {d.overdue}
                    </span>
                  </td>
                  <td className="py-2">
                    <button
                      className="btn btn-sm"
                      style={{ fontSize: 11, padding: "3px 10px", background: "rgba(124,58,237,0.08)", color: "var(--primary-color)", fontWeight: 600 }}
                    >
                      Send Notice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeeDashboardPage() {
  return (
    <>
      {/* Header */}
      <div className="zf-page-header">
        <div>
          <h1 className="zf-page-title">Fee Dashboard</h1>
          <p className="zf-page-sub">Academic Session 2026-27 · Fee & Finance Overview</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light d-flex align-items-center gap-2" style={{ fontWeight: 600, fontSize: 13 }}>
            <i className="ri-download-line" /> Export Report
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2" style={{ fontWeight: 600, fontSize: 13 }}>
            <i className="ri-bank-card-line" /> Record Payment
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="zf-kpi-grid">
        {FEE_KPIS.map(card => <KpiCard key={card.id} card={card} />)}
      </div>

      {/* Row 1: Collection Trend (wide) | Payment Mode */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem", marginBottom: "1.25rem" }}>
        <CollectionTrendChart />
        <PaymentModeChart />
      </div>

      {/* Row 2: Course-wise collection */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
        <CourseCollectionWidget />
        <div className="card custom-card mb-0">
          <div className="card-header zf-widget-header">
            <h3 className="zf-widget-title">Category-wise Collection</h3>
          </div>
          <div className="card-body zf-widget-body pt-0">
            <CategoryBar />
          </div>
        </div>
      </div>

      {/* Row 3: Recent Receipts */}
      <div style={{ marginBottom: "1.25rem" }}>
        <RecentReceiptsTable />
      </div>

      {/* Row 4: Top Defaulters */}
      <TopDefaultersTable />
    </>
  );
}

// ─── Category Bar chart ──────────────────────────────────────────────────────

const CATEGORY_DATA = [
  { cat: "General",   collected: 520, target: 600, color: "#7c3aed" },
  { cat: "OBC",       collected: 280, target: 310, color: "#06b6d4" },
  { cat: "SC",        collected: 175, target: 195, color: "#10b981" },
  { cat: "ST",        collected: 88,  target: 105, color: "#f59e0b" },
  { cat: "EWS",       collected: 60,  target: 72,  color: "#ec4899" },
  { cat: "Minority",  collected: 42,  target: 50,  color: "#8b5cf6" },
];

function CategoryBar() {
  const [Chart, setChart] = useState<any>(null);
  useEffect(() => { import("react-apexcharts").then(m => setChart(() => m.default)); }, []);

  const options: any = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#7c3aed", "#e5e7eb"],
    plotOptions: {
      bar: {
        horizontal: true, borderRadius: 4, columnWidth: "60%",
        dataLabels: { position: "top" },
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: CATEGORY_DATA.map(c => c.cat),
      labels: { style: { fontSize: "12px", colors: "#9ca3af" }, formatter: (v: number) => `₹${v}L` },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { fontSize: "12px", colors: "#6b7280" } } },
    legend: {
      position: "top" as const, horizontalAlign: "right" as const,
      fontSize: "12px", markers: { size: 8, shape: "circle" as const },
    },
    grid: { borderColor: "var(--default-border)", strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    tooltip: { theme: "light", y: { formatter: (v: number) => `₹ ${v} Lakhs` } },
  };

  const series = [
    { name: "Collected", data: CATEGORY_DATA.map(c => c.collected) },
    { name: "Target",    data: CATEGORY_DATA.map(c => c.target)    },
  ];

  return Chart ? (
    <Chart options={options} series={series} type="bar" height={280} />
  ) : (
    <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>
      Loading chart…
    </div>
  );
}
