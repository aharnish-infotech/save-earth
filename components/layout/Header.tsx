"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SESSIONS = ["2026-27", "2025-26", "2024-25", "2023-24"];

export default function Header() {
  const [activeSession, setActiveSession] = useState("2025-26");
  const [sessionOpen, setSessionOpen] = useState(false);
  const sessionRef = useRef<HTMLDivElement>(null);

  // Close session dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sessionRef.current && !sessionRef.current.contains(e.target as Node)) {
        setSessionOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("zf:toggle-sidebar"));
  };

  return (
    <header className="app-header sticky" id="header" style={{ height: "var(--zf-header-h)", display: "flex", alignItems: "center" }}>
      <div className="main-header-container container-fluid" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", height: "100%" }}>

        {/* ── Left ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", height: "100%" }}>

          {/* Hamburger toggle */}
          <button
            onClick={toggleSidebar}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 5,
              padding: "6px", borderRadius: 8,
              color: "var(--default-text-color)",
            }}
            aria-label="Toggle sidebar"
          >
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
            <span style={{ display: "block", width: 15, height: 2, background: "currentColor", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
          </button>

          {/* Active Session selector */}
          <div ref={sessionRef} style={{ position: "relative" }}>
            <button
              onClick={() => setSessionOpen((o) => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px",
                background: "rgba(108,95,252,0.08)",
                border: "1px solid rgba(108,95,252,0.25)",
                borderRadius: 8,
                color: "var(--primary-color)",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
                <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z" />
              </svg>
              ACTIVE SESSION : {activeSession}
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 256 256" fill="currentColor">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
              </svg>
            </button>

            {sessionOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0,
                minWidth: 150, zIndex: 9999,
                borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: "1px solid var(--default-border)",
                background: "var(--custom-white)", padding: "4px 0",
              }}>
                {SESSIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setActiveSession(s); setSessionOpen(false); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "7px 14px", background: "none", border: "none",
                      cursor: "pointer", fontSize: 13,
                      fontWeight: activeSession === s ? 700 : 400,
                      color: activeSession === s ? "var(--primary-color)" : "var(--default-text-color)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", background: "var(--default-background)", border: "1px solid var(--default-border)", borderRadius: 8, padding: "0 10px", gap: 6, minWidth: 260 }}>
            <i className="ri-search-line" style={{ color: "var(--text-muted)", fontSize: 14 }} />
            <input
              type="text"
              placeholder="Search students, enquiries, receipts…"
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 12, color: "var(--default-text-color)", padding: "6px 0", width: "100%" }}
            />
            <kbd style={{ fontSize: 10, color: "var(--text-muted)", background: "var(--custom-white)", border: "1px solid var(--default-border)", borderRadius: 4, padding: "1px 5px", whiteSpace: "nowrap" }}>⌘ K</kbd>
          </div>
        </div>

        {/* ── Right ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

          {/* Quick Create */}
          <button style={{ ...iconBtn }}>
            <i className="ri-add-circle-line" style={{ fontSize: 18, color: "var(--default-text-color)" }} />
          </button>

          {/* Notifications */}
          <button style={{ ...iconBtn, position: "relative" }}>
            <i className="ri-notification-3-line" style={{ fontSize: 18, color: "var(--default-text-color)" }} />
            <span style={badgeStyle("#ef4444")}>5</span>
          </button>

          {/* Messages */}
          <button style={{ ...iconBtn, position: "relative" }}>
            <i className="ri-message-3-line" style={{ fontSize: 18, color: "var(--default-text-color)" }} />
            <span style={badgeStyle("#10b981")}>3</span>
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: "var(--default-border)", margin: "0 6px" }} />

          {/* Profile */}
          <button style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary-color), #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0,
            }}>
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

// ── Shared micro-styles ────────────────────────────────────────────────────
const iconBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 8,
  background: "none", border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};

function badgeStyle(bg: string): React.CSSProperties {
  return {
    position: "absolute",
    top: 4, right: 4,
    width: 16, height: 16,
    borderRadius: "50%",
    background: bg,
    color: "#fff",
    fontSize: 9,
    fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1,
    border: "2px solid var(--custom-white)",
    pointerEvents: "none",
  };
}
