"use client";
import React, { useEffect, useRef } from "react";
import { CATEGORY_ALLOTMENT } from "@/lib/constants/dashboard-data";

const TOTAL = CATEGORY_ALLOTMENT.reduce((s, c) => s + c.value, 0);

export default function CategoryAllotmentChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 160;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const outerR = 68;
    const innerR = 44;
    const gap = 0.018; // small gap between segments

    let startAngle = -Math.PI / 2;

    CATEGORY_ALLOTMENT.forEach((seg) => {
      const slice = (seg.value / TOTAL) * (2 * Math.PI) - gap;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle + gap / 2, startAngle + gap / 2 + slice);
      ctx.arc(cx, cy, innerR, startAngle + gap / 2 + slice, startAngle + gap / 2, true);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      startAngle += slice + gap;
    });

    // Center text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#1f2937";
    ctx.font = `bold ${dpr > 1 ? 14 : 15}px -apple-system, sans-serif`;
    ctx.fillText(TOTAL.toLocaleString(), cx, cy - 8);
    ctx.font = `10px -apple-system, sans-serif`;
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("Total Allotted", cx, cy + 10);
  }, []);

  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Category-wise Allotment</h3>
      </div>
      <div className="card-body zf-widget-body">
        {/* Canvas chart */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <canvas ref={canvasRef} width={160} height={160} />
        </div>

        {/* Legend */}
        {CATEGORY_ALLOTMENT.map((c) => (
          <div
            key={c.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "6px",
              fontSize: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: c.color, display: "inline-block", flexShrink: 0,
                }}
              />
              <span style={{ color: "var(--default-text-color)", fontWeight: 500 }}>{c.name}</span>
            </div>
            <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>
              {c.pct}%&nbsp;
              <span style={{ fontWeight: 400 }}>({c.value.toLocaleString()})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
