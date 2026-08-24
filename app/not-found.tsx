"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes ping1 {
          0%   { transform: scale(0.4); opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes ping2 {
          0%   { transform: scale(0.4); opacity: 0.6; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes ping3 {
          0%   { transform: scale(0.4); opacity: 0.4; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes sweep {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes glitch1 {
          0%, 90%, 100% { clip-path: none; transform: none; }
          91%            { clip-path: polygon(0 10%, 100% 10%, 100% 30%, 0 30%); transform: translateX(-4px); }
          93%            { clip-path: polygon(0 55%, 100% 55%, 100% 70%, 0 70%); transform: translateX(4px); }
          95%            { clip-path: polygon(0 75%, 100% 75%, 100% 90%, 0 90%); transform: translateX(-2px); }
        }
        @keyframes glitch2 {
          0%, 85%, 100% { opacity: 0; }
          86%            { opacity: 0.7; transform: translateX(6px); clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); }
          88%            { opacity: 0.7; transform: translateX(-6px); clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); }
          90%            { opacity: 0; }
        }
        @keyframes scanline {
          0%   { top: -10%; }
          100% { top: 110%; }
        }
        .not-found-btn:hover {
          background: #15803d !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22,163,74,0.35) !important;
        }
        .not-found-ghost:hover {
          background: #f3f4f6 !important;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Grid background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(22,163,74,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}/>

        {/* Scanline effect */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: "3px",
          background: "linear-gradient(90deg, transparent, rgba(22,163,74,0.4), transparent)",
          animation: "scanline 3.5s linear infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}/>

        {/* Floating particles */}
        {[
          { left:"8%",  top:"15%", size:3, delay:"0s",    dur:"3.2s" },
          { left:"92%", top:"20%", size:2, delay:"0.8s",  dur:"4s"   },
          { left:"15%", top:"75%", size:4, delay:"1.2s",  dur:"3.7s" },
          { left:"85%", top:"70%", size:2, delay:"0.3s",  dur:"2.9s" },
          { left:"50%", top:"5%",  size:3, delay:"1.8s",  dur:"4.3s" },
          { left:"5%",  top:"50%", size:2, delay:"0.6s",  dur:"3.5s" },
          { left:"95%", top:"45%", size:3, delay:"2.1s",  dur:"3.1s" },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute", left: p.left, top: p.top,
            width: p.size, height: p.size, borderRadius: "50%",
            background: "#16a34a",
            animation: `blink ${p.dur} ${p.delay} ease-in-out infinite`,
            pointerEvents: "none",
          }}/>
        ))}

        {/* Radar + 404 container */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>

          {/* Radar rings */}
          <div style={{ position: "relative", width: 200, height: 200, marginBottom: 40, animation: "float 4s ease-in-out infinite" }}>

            {/* Ping rings */}
            {[
              { animation: "ping1 2.4s 0s ease-out infinite" },
              { animation: "ping2 2.4s 0.8s ease-out infinite" },
              { animation: "ping3 2.4s 1.6s ease-out infinite" },
            ].map((r, i) => (
              <div key={i} style={{
                position: "absolute", inset: "25%",
                borderRadius: "50%",
                border: "1px solid rgba(22,163,74,0.5)",
                animation: r.animation,
              }}/>
            ))}

            {/* Static rings */}
            {[0.85, 0.65, 0.45].map((s, i) => (
              <div key={i} style={{
                position: "absolute",
                top: `${(1-s)*50}%`, left: `${(1-s)*50}%`,
                width: `${s*100}%`, height: `${s*100}%`,
                borderRadius: "50%",
                border: "1px solid rgba(22,163,74,0.15)",
              }}/>
            ))}

            {/* Crosshair lines */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", height: 1, background: "rgba(22,163,74,0.12)" }}/>
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 1, height: "100%", background: "rgba(22,163,74,0.12)" }}/>
            </div>

            {/* Sweep arm */}
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: "50%",
              overflow: "hidden",
              animation: "sweep 3s linear infinite",
            }}>
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: "50%", height: 2,
                transformOrigin: "0% 50%",
                background: "linear-gradient(90deg, rgba(22,163,74,0.9), transparent)",
              }}/>
              {/* Sweep glow trail */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: "50%",
                background: "conic-gradient(from 0deg, rgba(22,163,74,0.15) 0deg, transparent 60deg)",
              }}/>
            </div>

            {/* Center dot */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 12px 4px rgba(22,163,74,0.6)" }}/>
            </div>

            {/* Blip — "nothing found" dot at edge */}
            <div style={{
              position: "absolute",
              top: "18%", left: "68%",
              width: 6, height: 6, borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 8px 2px rgba(239,68,68,0.7)",
              animation: "blink 1.1s ease-in-out infinite",
            }}/>

          </div>

          {/* 404 Glitch text */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <div style={{
              fontSize: 96, fontWeight: 900, letterSpacing: "-4px",
              color: "#fff", lineHeight: 1,
              animation: "glitch1 6s ease-in-out infinite",
              textShadow: "0 0 40px rgba(22,163,74,0.3)",
            }}>
              404
            </div>
            {/* Glitch overlay */}
            <div style={{
              position: "absolute", inset: 0,
              fontSize: 96, fontWeight: 900, letterSpacing: "-4px",
              color: "#16a34a", lineHeight: 1,
              animation: "glitch2 6s ease-in-out infinite",
              pointerEvents: "none",
            }}>
              404
            </div>
          </div>

          {/* Status chip */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 20, padding: "4px 14px", marginBottom: 20,
            animation: "fadeUp 0.6s 0.2s both",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "blink 1s ease-in-out infinite" }}/>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fca5a5", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Signal Lost
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: "#f9fafb",
            margin: "0 0 10px", textAlign: "center",
            animation: "fadeUp 0.6s 0.35s both",
          }}>
            Nothing to Inspect Here
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: 14, color: "#6b7280", textAlign: "center",
            maxWidth: 380, lineHeight: 1.7, margin: "0 0 36px",
            animation: "fadeUp 0.6s 0.5s both",
          }}>
            Our audit system scanned every corner of this URL and found no record.
            The page may have been moved, deleted, or never existed.
          </p>

          {/* Terminal line */}
          <div style={{
            fontFamily: "monospace", fontSize: 12, color: "#374151",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "10px 18px", marginBottom: 32,
            animation: "fadeUp 0.6s 0.6s both",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ color: "#ef4444" }}>✕</span>
            <span style={{ color: "#4b5563" }}>GET</span>
            <span style={{ color: "#9ca3af" }}>{typeof window !== "undefined" ? window.location.pathname : "/..."}</span>
            <span style={{ color: "#ef4444", fontWeight: 700 }}>404 Not Found</span>
          </div>

          {/* Actions */}
          <div style={{
            display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
            animation: "fadeUp 0.6s 0.75s both",
          }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button className="not-found-btn" style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#16a34a", color: "#fff",
                border: "none", borderRadius: 10,
                padding: "11px 24px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 4px 14px rgba(22,163,74,0.25)",
              }}>
                <i className="ri-dashboard-line" style={{ fontSize: 15 }}/>
                Back to Dashboard
              </button>
            </Link>
            <button className="not-found-ghost" onClick={() => history.back()} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.05)", color: "#9ca3af",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              padding: "11px 24px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
            }}>
              <i className="ri-arrow-left-line" style={{ fontSize: 15 }}/>
              Go Back
            </button>
          </div>

          {/* ORBIT brand watermark */}
          <div style={{
            marginTop: 52, display: "flex", alignItems: "center", gap: 8,
            animation: "fadeUp 0.6s 0.9s both",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="ri-focus-3-line" style={{ fontSize: 14, color: "#fff" }}/>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#374151", letterSpacing: "0.05em" }}>ORBIT</span>
            <span style={{ fontSize: 11, color: "#4b5563" }}>InspectFlow ERP</span>
          </div>

        </div>
      </div>
    </>
  );
}
