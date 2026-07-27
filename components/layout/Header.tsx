"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── Digital Clock ─────────────────────────────────────────────────────────────
function DigitalClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "5px 14px",
      borderRadius: 8,
      border: "1px solid var(--default-border)",
      background: "var(--custom-white)",
      userSelect: "none",
    }}>
      {/* Time */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 16, fontWeight: 800, color: "var(--primary-color)", letterSpacing: 1 }}>
          {hh}:{mm}
        </span>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: 700, color: "#4ade80", marginLeft: 2 }}>
          :{ss}
        </span>
      </div>
      {/* Divider */}
      <div style={{ width: 1, height: 22, background: "var(--default-border)" }} />
      {/* Date */}
      <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.02em", lineHeight: 1 }}>
        {dateStr}
      </div>
    </div>
  );
}

export default function Header() {
  const [quickOpen, setQuickOpen] = useState(false);
  const quickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) setQuickOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleSidebar = () => window.dispatchEvent(new CustomEvent("zf:toggle-sidebar"));

  return (
    <header className="app-header sticky" id="header" style={{ height: "var(--zf-header-h)", display: "flex", alignItems: "center" }}>
      <div className="main-header-container container-fluid" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", height: "100%" }}>

        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", height: "100%" }}>

          {/* Hamburger */}
          <button onClick={toggleSidebar} aria-label="Toggle sidebar"
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: "6px", borderRadius: 8, color: "var(--default-text-color)" }}>
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
            <span style={{ display: "block", width: 15, height: 2, background: "currentColor", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
          </button>

          {/* Search bar + Save Earth logo badge */}
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "var(--default-background)", border: "1px solid var(--default-border)",
              borderRight: "none", borderRadius: "8px 0 0 8px",
              padding: "0 10px", gap: 6, minWidth: 280,
            }}>
              <i className="ri-search-line" style={{ color: "var(--text-muted)", fontSize: 14 }} />
              <input
                type="text"
                placeholder="Search audits, branches, users..."
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 12, color: "var(--default-text-color)", padding: "6px 0", width: "100%" }}
              />
              <kbd style={{ fontSize: 10, color: "var(--text-muted)", background: "var(--custom-white)", border: "1px solid var(--default-border)", borderRadius: 4, padding: "1px 5px", whiteSpace: "nowrap" }}>Ctrl K</kbd>
            </div>
            {/* Client logo — personalised touch */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0 10px",
              background: "var(--custom-white)",
              border: "1px solid var(--default-border)",
              borderRadius: "0 8px 8px 0",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/savearth_logo.png"
                alt="Save Earth Energy"
                style={{ height: 22, width: "auto", objectFit: "contain", display: "block" }}
              />
            </div>
          </div>
        </div>

        {/* Centre — Digital Clock */}
        <DigitalClock />

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

          {/* Quick Create */}
          <div ref={quickRef} style={{ position: "relative" }}>
            <button onClick={() => setQuickOpen(o => !o)} title="Quick Create"
              style={{ ...iconBtn, background: quickOpen ? "rgba(22,163,74,0.1)" : "none", color: quickOpen ? "var(--primary-color)" : "var(--default-text-color)" }}>
              <i className="ri-add-circle-line" style={{ fontSize: 20 }} />
            </button>

            {quickOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 220, zIndex: 9999, borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid var(--default-border)", background: "var(--custom-white)", padding: "6px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "6px 10px 4px" }}>
                  Quick Create
                </div>
                {([
                  { label: "New Audit",       icon: "ri-file-add-line",   href: "/audits/new"   },
                  { label: "Register Branch", icon: "ri-building-2-line", href: "/branches/new" },
                ] as const).map(item => (
                  <Link key={item.label} href={item.href} onClick={() => setQuickOpen(false)} style={quickItemStyle}>
                    <span style={quickIconWrap}><i className={item.icon} style={{ fontSize: 15 }} /></span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <button style={{ ...iconBtn, position: "relative" }}>
            <i className="ri-notification-3-line" style={{ fontSize: 18, color: "var(--default-text-color)" }} />
            <span style={badge("#ef4444")}>3</span>
          </button>

          {/* Messages */}
          <button style={{ ...iconBtn, position: "relative" }}>
            <i className="ri-message-3-line" style={{ fontSize: 18, color: "var(--default-text-color)" }} />
            <span style={badge("#10b981")}>2</span>
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: "var(--default-border)", margin: "0 6px" }} />

          {/* Profile */}
          <button style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #16a34a, #86efac)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
              AU
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--default-text-color)", lineHeight: 1.2 }}>Admin User</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.2 }}>Super Admin</div>
            </div>
            <i className="ri-arrow-down-s-line" style={{ fontSize: 14, color: "var(--text-muted)" }} />
          </button>

        </div>
      </div>
    </header>
  );
}

const iconBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 8,
  background: "none", border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const quickItemStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10,
  padding: "8px 10px", borderRadius: 8,
  fontSize: 13, fontWeight: 600, color: "#374151",
  textDecoration: "none", cursor: "pointer",
};

const quickIconWrap: React.CSSProperties = {
  width: 30, height: 30, borderRadius: 8,
  background: "#dcfce7", display: "flex",
  alignItems: "center", justifyContent: "center",
  color: "#16a34a", flexShrink: 0,
};

function badge(bg: string): React.CSSProperties {
  return {
    position: "absolute", top: 4, right: 4,
    width: 16, height: 16, borderRadius: "50%",
    background: bg, color: "#fff", fontSize: 9, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1, border: "2px solid var(--custom-white)", pointerEvents: "none",
  };
}
