import React from "react";
import KPICard from "@/components/dashboard/KPICard";
import AdmissionFunnel from "@/components/dashboard/AdmissionFunnel";
import EnquiryTrendChart from "@/components/dashboard/EnquiryTrendChart";
import TodayEvents from "@/components/dashboard/TodayEvents";
import CategoryAllotmentChart from "@/components/dashboard/CategoryAllotmentChart";
import CounselorLeaderboard from "@/components/dashboard/CounselorLeaderboard";
import FeeDefaulters from "@/components/dashboard/FeeDefaulters";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { KPI_CARDS } from "@/lib/constants/dashboard-data";

export default function DashboardPage() {
  return (
    <>
      {/* Page title */}
      <div className="zf-page-header">
        <div>
          <h1 className="zf-page-title">Dashboard</h1>
          <p className="zf-page-sub">Welcome back, Admin!</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          style={{ fontWeight: 600, fontSize: 13 }}
        >
          <i className="ri-layout-grid-line" />
          Customize Dashboard
        </button>
      </div>

      {/* KPI Cards */}
      <div className="zf-kpi-grid">
        {KPI_CARDS.map((card) => (
          <KPICard key={card.id} {...card} />
        ))}
      </div>

      {/* Row 1: Funnel | Trend Chart | Events */}
      <div className="zf-dash-row zf-dash-row-1">
        <AdmissionFunnel />
        <EnquiryTrendChart />
        <TodayEvents />
      </div>

      {/* Row 2: Category | Counselors | Defaulters | Activity */}
      <div className="zf-dash-row zf-dash-row-2">
        <CategoryAllotmentChart />
        <CounselorLeaderboard />
        <FeeDefaulters />
        <RecentActivity />
      </div>
    </>
  );
}
