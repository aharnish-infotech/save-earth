"use client";
import React, { useEffect, useState } from "react";
import { TREND_SERIES } from "@/lib/constants/dashboard-data";

export default function EnquiryTrendChart() {
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    import("react-apexcharts").then((mod) => setChart(() => mod.default));
  }, []);

  const options: any = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#7c3aed", "#ec4899"],
    plotOptions: { bar: { columnWidth: "50%", borderRadius: 3 } },
    dataLabels: { enabled: false },
    stroke: { width: [0, 2.5], curve: "smooth" },
    xaxis: {
      categories: TREND_SERIES.months,
      labels: { style: { fontSize: "11px", colors: "#9ca3af" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { fontSize: "11px", colors: "#9ca3af" } } },
    legend: {
      position: "top" as const, horizontalAlign: "right" as const,
      fontSize: "12px", markers: { size: 8, shape: "circle" as const },
    },
    grid: { borderColor: "var(--default-border)", strokeDashArray: 4 },
    tooltip: { theme: "light" },
  };

  const series = [
    { name: "Enquiries",  type: "bar",  data: TREND_SERIES.enquiries  },
    { name: "Admissions", type: "line", data: TREND_SERIES.admissions },
  ];

  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Enquiry vs Admission Trend</h3>
        <div className="d-flex align-items-center gap-1 border rounded px-2 py-1" style={{ fontSize: 12, cursor: "pointer", color: "var(--default-text-color)" }}>
          This Year <i className="ri-arrow-down-s-line" />
        </div>
      </div>
      <div className="card-body zf-widget-body pt-0">
        {Chart ? (
          <Chart options={options} series={series} type="bar" height={260} />
        ) : (
          <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Loading chart…
          </div>
        )}
      </div>
    </div>
  );
}
