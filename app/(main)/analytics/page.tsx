"use client";
import React from "react";

const COMING: { icon: string; label: string; desc: string; color: string; bg: string }[] = [
  { icon:"ri-bar-chart-grouped-line", label:"Audit Performance",     desc:"Monthly audit scores, pass rates, and NCR trends across all banks and circles",   color:"#16a34a", bg:"#f0fdf4" },
  { icon:"ri-map-pin-line",           label:"Branch Coverage Map",   desc:"Geographic heatmap of covered vs uncovered branches by state and zone",             color:"#2563eb", bg:"#eff6ff" },
  { icon:"ri-user-star-line",         label:"Auditor Productivity",  desc:"Per-auditor audit counts, average scores, on-time delivery, and NCR raise rates",   color:"#7c3aed", bg:"#f5f3ff" },
  { icon:"ri-line-chart-line",        label:"Trend Analysis",        desc:"Approval cycle time, submission-to-delivery duration, and compliance score trends",  color:"#d97706", bg:"#fefce8" },
  { icon:"ri-building-2-line",        label:"Bank-wise Insights",    desc:"SBI, BOB, UCO, PNB — side-by-side compliance health and audit frequency reports",   color:"#0891b2", bg:"#ecfeff" },
  { icon:"ri-pie-chart-2-line",       label:"NCR Breakdown",         desc:"Non-conformance distribution by category, severity, bank, and resolution status",   color:"#dc2626", bg:"#fef2f2" },
];

export default function AnalyticsPage() {
  return (
    <div style={{ padding:"1.5rem 0" }}>

      {/* Page header */}
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontSize:22, fontWeight:900, color:"var(--default-text-color)", margin:0, letterSpacing:"-0.3px" }}>
          Analytics
        </h1>
        <p style={{ fontSize:13, color:"var(--text-muted)", margin:"4px 0 0" }}>
          Insights, trends, and compliance performance across all bank branch audits
        </p>
      </div>

      {/* Coming Soon card */}
      <div style={{ background:"#fff", borderRadius:18, border:"1px solid #e5e7eb", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>

        {/* Hero section */}
        <div style={{ background:"linear-gradient(135deg,#f0fdf4 0%,#dcfce7 50%,#bbf7d0 100%)", padding:"52px 40px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", left:-60, top:-60, width:200, height:200, borderRadius:"50%", background:"rgba(22,163,74,0.06)" }}/>
          <div style={{ position:"absolute", right:-40, bottom:-40, width:160, height:160, borderRadius:"50%", background:"rgba(22,163,74,0.06)" }}/>
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ width:72, height:72, borderRadius:20, background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
              <i className="ri-bar-chart-2-line" style={{ fontSize:32, color:"#fff" }}/>
            </div>
            <h2 style={{ fontSize:24, fontWeight:900, color:"#14532d", margin:"0 0 10px" }}>Analytics Dashboard</h2>
            <p style={{ fontSize:14, color:"#166534", margin:"0 auto", maxWidth:460, lineHeight:1.7 }}>
              A comprehensive analytics suite is being built for ORBIT Compliance. It will bring real-time intelligence to every audit decision.
            </p>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:18, fontSize:12, fontWeight:700, color:"#15803d", background:"rgba(22,163,74,0.12)", borderRadius:20, padding:"6px 16px" }}>
              <i className="ri-tools-line"/>Under Development — Coming Soon
            </span>
          </div>
        </div>

        {/* What's coming grid */}
        <div style={{ padding:"32px 40px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:20 }}>
            What's being built
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
            {COMING.map(c => (
              <div key={c.label} style={{ border:"1px solid #f3f4f6", borderRadius:14, padding:"20px", display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={c.icon} style={{ fontSize:20, color:c.color }}/>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#111827", marginBottom:5 }}>{c.label}</div>
                  <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.6 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
