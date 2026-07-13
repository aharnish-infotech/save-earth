import React from "react";

interface KPICardProps {
  label: string;
  value: string;
  trend: string;
  trendDir: "up" | "down";
  trendLabel: string;
  icon: string;
  colorClass: string; // "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "purple" | "pink"
  // legacy props kept for backward compat — ignored if colorClass is set
  iconBg?: string;
  iconColor?: string;
}

export default function KPICard({
  label, value, trend, trendDir, trendLabel, icon, colorClass,
}: KPICardProps) {
  return (
    <div className={`card custom-card dashboard-main-card ${colorClass} mb-0`}>
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 justify-content-between flex-wrap">
          <div>
            <span className="d-block mb-2 fw-medium text-muted fs-13">{label}</span>
            <h4 className="fw-bold mb-2">{value}</h4>
            <div className="d-flex align-items-center gap-1 flex-wrap">
              <span
                className={`badge bg-${trendDir === "up" ? "success" : "danger"}-transparent rounded-pill d-inline-flex align-items-center`}
              >
                <i className={`ri-trending-${trendDir === "up" ? "up" : "down"}-line me-1`} />
                {trend}
              </span>
              <span className="fs-12 text-muted">{trendLabel}</span>
            </div>
          </div>
          <div className="lh-1">
            <span className={`avatar avatar-lg bg-${colorClass}-transparent`}>
              <i className={icon} style={{ fontSize: 24 }} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
