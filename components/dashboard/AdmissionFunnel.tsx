"use client";
import React from "react";
import { FUNNEL_STAGES } from "@/lib/constants/dashboard-data";

export default function AdmissionFunnel() {
  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Admission Funnel</h3>
      </div>
      <div className="card-body zf-widget-body">
        {/* Visual funnel */}
        <div className="zf-funnel-visual mb-3">
          {FUNNEL_STAGES.map((stage, i) => {
            const width = 100 - i * 10;
            return (
              <div
                key={stage.label}
                className="zf-funnel-shape"
                style={{
                  width: `${width}%`,
                  background: stage.color,
                  borderRadius: i === 0 ? "6px 6px 0 0" : i === FUNNEL_STAGES.length - 1 ? "0 0 6px 6px" : 0,
                  marginBottom: 1,
                }}
              >
                {stage.count.toLocaleString()}
              </div>
            );
          })}
        </div>

        {/* Legend rows */}
        {FUNNEL_STAGES.map((stage) => (
          <div key={stage.label} className="zf-funnel-row">
            <div className="zf-funnel-label">
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: stage.color, marginRight: 6 }} />
              {stage.label}
            </div>
            <div className="zf-funnel-bar-track">
              <div className="zf-funnel-bar" style={{ width: `${stage.pct}%`, background: stage.color }} />
            </div>
            <span className="zf-funnel-count">{stage.count.toLocaleString()}</span>
            <span className="zf-funnel-pct">{stage.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
