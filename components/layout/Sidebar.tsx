"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RAIL_ITEMS } from "@/lib/constants/navigation";

// ── SVG icons for the icon rail ──────────────────────────────────────────────
const SECTION_ICONS: Record<string, React.ReactNode> = {
  dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" width="20" height="20">
      <path d="M104,40H40a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V48A8,8,0,0,0,104,40Z" opacity="0.2" fill="currentColor"/>
      <path d="M216,40H152a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V48A8,8,0,0,0,216,40Z" opacity="0.2" fill="currentColor"/>
      <path d="M104,152H40a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160A8,8,0,0,0,104,152Z" opacity="0.2" fill="currentColor"/>
      <path d="M216,152H152a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160A8,8,0,0,0,216,152Z" opacity="0.2" fill="currentColor"/>
      <rect x="32" y="40" width="80" height="80" rx="8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <rect x="144" y="40" width="80" height="80" rx="8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <rect x="32" y="152" width="80" height="80" rx="8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <rect x="144" y="152" width="80" height="80" rx="8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
  ),
  "admission-crm": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" width="20" height="20">
      <circle cx="128" cy="96" r="64" opacity="0.2" fill="currentColor"/>
      <circle cx="128" cy="96" r="64" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <path d="M32,216c19.37-33.47,54.55-56,96-56s76.63,22.53,96,56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
  ),
  "dhe-admissions": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" width="20" height="20">
      <path d="M48,208V96l80-64,80,64V208Z" opacity="0.2" fill="currentColor"/>
      <polyline points="48 208 48 96 128 32 208 96 208 208" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <line x1="16" y1="208" x2="240" y2="208" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <rect x="96" y="152" width="64" height="56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
  ),
  students: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" width="20" height="20">
      <path d="M232,96l-104,40L24,96l104-40Z" opacity="0.2" fill="currentColor"/>
      <polygon points="232 96 128 56 24 96 128 136 232 96" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <polyline points="184 112 184 176 128 200 72 176 72 112" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <line x1="232" y1="96" x2="232" y2="168" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
  ),
  fees: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" width="20" height="20">
      <rect x="24" y="64" width="208" height="144" rx="8" opacity="0.2" fill="currentColor"/>
      <rect x="24" y="64" width="208" height="144" rx="8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <path d="M168,64V48a8,8,0,0,0-8-8H96a8,8,0,0,0-8,8V64" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <line x1="128" y1="112" x2="128" y2="160" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <path d="M104,148c0,6.63,10.75,12,24,12s24-5.37,24-12-10.75-12-24-12-24-5.37-24-12,10.75-12,24-12,24,5.37,24,12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
  ),
  scholarships: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" width="20" height="20">
      <circle cx="128" cy="96" r="72" opacity="0.2" fill="currentColor"/>
      <circle cx="128" cy="96" r="72" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <polyline points="88 136 88 240 128 216 168 240 168 136" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
  ),
  reports: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" width="20" height="20">
      <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Z" opacity="0.2" fill="currentColor"/>
      <path d="M152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <polyline points="148 24 148 88 212 88" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <line x1="96" y1="136" x2="96" y2="176" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <line x1="128" y1="120" x2="128" y2="176" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <line x1="160" y1="152" x2="160" y2="176" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" width="20" height="20">
      <circle cx="128" cy="128" r="40" opacity="0.2" fill="currentColor"/>
      <circle cx="128" cy="128" r="40" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <path d="M130.05,206.11c-1.34.06-2.68.06-4.06,0l-5.53-9.5a75.06,75.06,0,0,1-17.66-10.22l-10.7,2.6a74.07,74.07,0,0,1-14-16l4.72-9.67a74.11,74.11,0,0,1-5.4-19.36l-9.44-5.7A73.65,73.65,0,0,1,66,128c0-1.34.06-2.68.11-4l9.5-5.53A75.06,75.06,0,0,1,85.83,101l-2.6-10.7a74.07,74.07,0,0,1,16-14l9.67,4.72a74.11,74.11,0,0,1,19.36-5.4l5.7-9.44A73.65,73.65,0,0,1,144,64h4l5.53,9.5A75.06,75.06,0,0,1,171.19,83.72l10.7-2.6a74.07,74.07,0,0,1,14,16l-4.72,9.67a74.11,74.11,0,0,1,5.4,19.36l9.44,5.7A73.65,73.65,0,0,1,208,144c0,1.34-.06,2.68-.11,4l-9.5,5.53A75.06,75.06,0,0,1,188.17,171l2.6,10.7a74.07,74.07,0,0,1-16,14l-9.67-4.72a74.11,74.11,0,0,1-19.36,5.4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
  ),
};

// ── Helper: find which section owns the current path ─────────────────────────
function getActiveSectionId(pathname: string): string {
  for (const item of RAIL_ITEMS) {
    const match = item.sections.some((s) =>
      s.items.some((n) => pathname === n.href || pathname.startsWith(n.href + "/"))
    );
    if (match) return item.id;
  }
  return "dashboard";
}

// ── Sidebar Component ─────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();

  const [expandedId, setExpandedId] = useState<string>(() => getActiveSectionId(pathname));
  const [panelOpen, setPanelOpen] = useState(true);

  // Keep content area margin in sync via CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--zf-sidebar-w",
      panelOpen ? "288px" : "64px"
    );
  }, [panelOpen]);

  // Sync expanded section when navigating
  useEffect(() => {
    setExpandedId(getActiveSectionId(pathname));
    setPanelOpen(true);
  }, [pathname]);

  // Hamburger toggle — listen for custom event fired by Header
  useEffect(() => {
    const handleToggle = () => setPanelOpen((prev) => !prev);
    window.addEventListener("zf:toggle-sidebar", handleToggle);
    return () => window.removeEventListener("zf:toggle-sidebar", handleToggle);
  }, []);

  // Rail icon click behaviour
  const handleIconClick = (id: string) => {
    if (!panelOpen) {
      // Panel closed — open it and jump to this section
      setPanelOpen(true);
      setExpandedId(id);
    } else if (expandedId === id) {
      // Same icon clicked — collapse panel (auto-hide)
      setPanelOpen(false);
    } else {
      // Different icon — switch active section
      setExpandedId(id);
    }
  };

  // Accordion section header click
  const handleSectionToggle = (id: string) => {
    if (!panelOpen) setPanelOpen(true);
    // Only one section open at a time (accordion)
    setExpandedId((prev) => (prev === id ? "" : id));
  };

  return (
    <aside className="zf-sidebar" id="sidebar">

      {/* ── Icon Rail ── */}
      <div className="zf-rail">
        {/* Product logo */}
        <div className="zf-rail-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/ZeroFormCampus.png"
            alt="ZeroForm Campus"
            width={42}
            height={42}
            style={{ borderRadius: 10, display: "block" }}
          />
        </div>

        {/* Stacked icon buttons */}
        <nav className="zf-rail-nav" aria-label="Main navigation">
          {RAIL_ITEMS.map((item) => {
            const isActive = expandedId === item.id && panelOpen;
            return (
              <button
                key={item.id}
                className={`zf-rail-btn${isActive ? " active" : ""}`}
                onClick={() => handleIconClick(item.id)}
                title={item.label}
                aria-label={item.label}
                aria-expanded={isActive}
              >
                <span className="zf-rail-icon">{SECTION_ICONS[item.id]}</span>
                <span className="zf-rail-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Accordion Nav Panel ── */}
      <div className={`zf-nav-panel${panelOpen ? " open" : ""}`} aria-hidden={!panelOpen}>
        {/* Institution logo */}
        <div className="zf-panel-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/shmcnys-logo-full.png"
            alt="Institution Logo"
            height={44}
            style={{ maxWidth: 190, width: "auto", display: "block" }}
          />
        </div>

        {/* All sections as accordion */}
        <div className="zf-accordion" id="sidebar-scroll">
          {RAIL_ITEMS.map((item) => {
            const isExpanded = expandedId === item.id;
            const allItems = item.sections.flatMap((s) => s.items);

            return (
              <div key={item.id} className={`zf-accord-section${isExpanded ? " expanded" : ""}`}>

                {/* Section toggle button */}
                <button
                  className={`zf-accord-header${isExpanded ? " active" : ""}`}
                  onClick={() => handleSectionToggle(item.id)}
                  aria-expanded={isExpanded}
                >
                  <span className="zf-accord-header-icon">{SECTION_ICONS[item.id]}</span>
                  <span className="zf-accord-title">{item.label}</span>
                  <i
                    className="ri-arrow-down-s-line zf-accord-chevron"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {/* Expandable items list */}
                <div
                  className="zf-accord-body"
                  style={{ maxHeight: isExpanded ? `${allItems.length * 44}px` : "0px" }}
                >
                  {allItems.map((nav) => {
                    const isNavActive =
                      pathname === nav.href || pathname.startsWith(nav.href + "/");
                    return (
                      <Link
                        key={nav.href}
                        href={nav.href}
                        className={`zf-nav-link${isNavActive ? " active" : ""}`}
                      >
                        {nav.icon && <i className={`${nav.icon} zf-nav-link-icon`} />}
                        <span>{nav.label}</span>
                      </Link>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
