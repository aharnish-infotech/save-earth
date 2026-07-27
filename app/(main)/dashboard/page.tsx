"use client";

/**
 * ORBIT Inspectflow ERP — Dashboard
 * Role switcher is the ONLY new functional addition.
 * All visual components and CSS classes are the original theme — untouched.
 */

import React, { useState, useEffect } from "react";
import KPICard from "@/components/dashboard/KPICard";
import TodayEvents from "@/components/dashboard/TodayEvents";
import AuditorsLeaderboard from "@/components/dashboard/AuditorsLeaderboard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import IncompleteAudits from "@/components/dashboard/IncompleteAudits";
import { KPI_CARDS } from "@/lib/constants/dashboard-data";

// ── Role definitions ───────────────────────────────────────────────────────────
type Role = "super-admin" | "admin" | "coordinator" | "field-auditor";

const ROLES: { id: Role; label: string; icon: string; name: string; subtitle: string }[] = [
  { id: "super-admin",   label: "Super Admin",   icon: "ri-shield-star-line",   name: "Mukteshwar Sharma", subtitle: "Full platform overview · Save Earth Energy"    },
  { id: "admin",         label: "Admin",          icon: "ri-user-settings-line", name: "Priya Sharma",      subtitle: "Operations overview · Save Earth Energy"       },
  { id: "coordinator",   label: "Coordinator",    icon: "ri-user-2-line",        name: "Amit Singh",        subtitle: "SBI Gujarat Zone · 14 assigned branches"       },
  { id: "field-auditor", label: "Field Auditor",  icon: "ri-walk-line",          name: "Rajesh Kumar",      subtitle: "On field · SBI Maninagar Branch"               },
];

// ── Role-specific KPI sets ─────────────────────────────────────────────────────
const ROLE_KPIS: Record<Role, typeof KPI_CARDS> = {
  "super-admin": KPI_CARDS,
  "admin": [
    { id: "active-audits",    label: "Active Audits",     value: "47",  trend: "+6",      trendDir: "up",   trendLabel: "This week",   icon: "ri-file-list-3-line",     colorClass: "primary"   },
    { id: "approved-today",   label: "Approved Today",    value: "12",  trend: "+4",      trendDir: "up",   trendLabel: "vs yesterday", icon: "ri-checkbox-circle-line", colorClass: "success"   },
    { id: "pending-review",   label: "Pending Review",    value: "7",   trend: "-2",      trendDir: "down", trendLabel: "vs yesterday", icon: "ri-time-line",            colorClass: "danger"    },
    { id: "reports-gen",      label: "Reports Generated", value: "34",  trend: "+8",      trendDir: "up",   trendLabel: "This month",  icon: "ri-file-pdf-line",        colorClass: "info"      },
    { id: "branches-covered", label: "Branches Covered",  value: "312", trend: "+12",     trendDir: "up",   trendLabel: "This month",  icon: "ri-building-2-line",      colorClass: "secondary" },
    { id: "incomplete",       label: "Incomplete Audits", value: "7",   trend: "2 urgent",trendDir: "down", trendLabel: "Need action", icon: "ri-alarm-warning-line",   colorClass: "warning"   },
  ],
  "coordinator": [
    { id: "my-branches",  label: "My Branches",      value: "14",  trend: "SBI Gujarat",  trendDir: "up",   trendLabel: "Zone",        icon: "ri-building-2-line",      colorClass: "primary"   },
    { id: "assigned",     label: "Audits Assigned",  value: "28",  trend: "+5",           trendDir: "up",   trendLabel: "This month",  icon: "ri-file-list-3-line",     colorClass: "info"      },
    { id: "completed",    label: "Completed",        value: "21",  trend: "75%",          trendDir: "up",   trendLabel: "Completion",  icon: "ri-checkbox-circle-line", colorClass: "success"   },
    { id: "in-review",    label: "In Review",        value: "5",   trend: "2 urgent",     trendDir: "up",   trendLabel: "Pending",     icon: "ri-time-line",            colorClass: "warning"   },
    { id: "overdue",      label: "Overdue",          value: "2",   trend: "Action needed",trendDir: "down", trendLabel: "Follow up",   icon: "ri-alarm-warning-line",   colorClass: "danger"    },
    { id: "auditors",     label: "My Auditors",      value: "3",   trend: "1 on field",   trendDir: "up",   trendLabel: "Active",      icon: "ri-user-star-line",       colorClass: "secondary" },
  ],
  "field-auditor": [
    { id: "today-target",    label: "Today's Target",   value: "2",  trend: "1 done",     trendDir: "up",   trendLabel: "Branches",    icon: "ri-map-pin-line",         colorClass: "primary"   },
    { id: "completed-today", label: "Completed Today",  value: "1",  trend: "SBI Paldi",  trendDir: "up",   trendLabel: "Done ✓",      icon: "ri-checkbox-circle-line", colorClass: "success"   },
    { id: "month-total",     label: "This Month",       value: "15", trend: "+3",          trendDir: "up",   trendLabel: "Best so far", icon: "ri-trophy-line",          colorClass: "warning"   },
    { id: "approved",        label: "Approved",         value: "12", trend: "80%",         trendDir: "up",   trendLabel: "Approval rate",icon: "ri-award-line",          colorClass: "info"      },
    { id: "in-review-fa",   label: "In Review",        value: "3",  trend: "Pending",     trendDir: "up",   trendLabel: "Admin check", icon: "ri-time-line",            colorClass: "secondary" },
    { id: "incomplete",      label: "Incomplete",       value: "1",  trend: "Due today",   trendDir: "down", trendLabel: "Action needed",icon: "ri-alarm-warning-line",  colorClass: "danger"    },
  ],
};

// ── Smart Greeting Banner (all roles) ─────────────────────────────────────────
function GreetingBanner({ name, subtitle, role }: { name: string; subtitle: string; role: Role }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const hour         = now.getHours();
  const isMorning    = hour >= 5  && hour < 12;
  const isAfternoon  = hour >= 12 && hour < 17;
  const isEvening    = hour >= 17 && hour < 21;
  const isNight      = !isMorning && !isAfternoon && !isEvening;

  const greeting = isMorning ? "Good Morning" : isAfternoon ? "Good Afternoon" : isEvening ? "Good Evening" : "Good Night";
  const tagline  = isMorning ? "Start the day strong 🌱" : isAfternoon ? "Keep up the momentum" : isEvening ? "Almost done for the day" : "Rest well, tomorrow awaits";

  const T = isMorning ? {
    gradient: "linear-gradient(150deg, #fffbeb 0%, #fef3c7 35%, #fde68a 65%, #fb923c 100%)",
    text:"#7c2d12", sub:"#a16207", pill:"rgba(124,45,18,0.1)", pillT:"#92400e",
  } : isAfternoon ? {
    gradient: "linear-gradient(150deg, #f0f9ff 0%, #e0f2fe 30%, #bae6fd 65%, #38bdf8 100%)",
    text:"#0c4a6e", sub:"#0369a1", pill:"rgba(14,165,233,0.1)", pillT:"#0284c7",
  } : isEvening ? {
    gradient: "linear-gradient(150deg, #1e1b4b 0%, #4c1d95 28%, #7c3aed 55%, #c2410c 82%, #f97316 100%)",
    text:"#fff", sub:"rgba(255,255,255,0.72)", pill:"rgba(255,255,255,0.13)", pillT:"rgba(255,255,255,0.92)",
  } : {
    gradient: "linear-gradient(150deg, #020617 0%, #0f172a 40%, #1e1b4b 75%, #312e81 100%)",
    text:"#e0e7ff", sub:"rgba(224,231,255,0.6)", pill:"rgba(224,231,255,0.09)", pillT:"#c7d2fe",
  };

  const roleIcon: Record<Role,string> = {
    "super-admin":"ri-shield-star-line","admin":"ri-user-settings-line","coordinator":"ri-user-2-line","field-auditor":"ri-walk-line",
  };
  const roleLabel: Record<Role,string> = {
    "super-admin":"Super Admin","admin":"Admin","coordinator":"Coordinator","field-auditor":"Field Auditor",
  };

  const STARS = isEvening || isNight ? [
    {x:72,y:12,d:1.5,s:0.4},{x:83,y:28,d:2,s:0.8},{x:67,y:22,d:1.5,s:1.2},{x:91,y:18,d:2.5,s:0.2},
    {x:78,y:42,d:1.5,s:0.6},{x:88,y:55,d:2,s:1.0},{x:62,y:8,d:1,s:0.9},{x:94,y:38,d:1.5,s:1.5},
    {x:75,y:60,d:2,s:0.3},{x:87,y:8,d:1,s:0.7},
  ] : [];

  const dateStr = now.toLocaleDateString("en-IN",{ weekday:"long", day:"numeric", month:"long", year:"numeric" });
  const timeStr = now.toLocaleTimeString("en-IN",{ hour:"2-digit", minute:"2-digit" });

  return (
    <div style={{ borderRadius:18, overflow:"hidden", position:"relative", padding:"30px 36px", background:T.gradient, minHeight:168 }}>
      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes gb-rise   { from{transform:translateY(28px) scale(0.88);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
        @keyframes gb-spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes gb-pulse  { 0%,100%{opacity:0.65;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes gb-twinkle{ 0%,100%{opacity:0.15} 50%{opacity:1} }
        @keyframes gb-moongl { 0%,100%{filter:drop-shadow(0 0 8px rgba(199,210,254,0.5))} 50%{filter:drop-shadow(0 0 22px rgba(199,210,254,1))} }
        @keyframes gb-float  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-9px)} }
        @keyframes gb-shimmer{ 0%,100%{opacity:0.35} 50%{opacity:0.8} }
      `}</style>

      {/* ── Stars (evening/night) ── */}
      {STARS.map((s,i)=>(
        <div key={i} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`,
          width:s.d, height:s.d, borderRadius:"50%", background:isNight?"#e0e7ff":"rgba(255,255,255,0.9)",
          animation:`gb-twinkle ${1.8+(i%3)*0.4}s ease-in-out ${s.s}s infinite`, pointerEvents:"none" }}/>
      ))}

      {/* ── Celestial body ── */}
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:260, pointerEvents:"none", overflow:"hidden" }}>

        {/* Morning — rising sun, bottom-right */}
        {isMorning && (
          <div style={{ position:"absolute", bottom:-12, right:-8, animation:"gb-rise 1.1s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
            <div style={{ animation:"gb-float 5s ease-in-out 1.1s infinite" }}>
              <svg width="170" height="170" viewBox="0 0 170 170" fill="none">
                <g style={{ transformOrigin:"85px 85px", animation:"gb-spin 22s linear infinite" }}>
                  {[0,30,60,90,120,150,180,210,240,270,300,330].map(d=>(
                    <line key={d}
                      x1={85+Math.cos(d*Math.PI/180)*56} y1={85+Math.sin(d*Math.PI/180)*56}
                      x2={85+Math.cos(d*Math.PI/180)*(d%90===0?82:74)} y2={85+Math.sin(d*Math.PI/180)*(d%90===0?82:74)}
                      stroke="#fbbf24" strokeWidth={d%90===0?3:1.5} strokeLinecap="round" opacity={d%90===0?0.85:0.45}/>
                  ))}
                </g>
                <circle cx="85" cy="85" r="54" fill="rgba(251,191,36,0.1)" style={{ animation:"gb-pulse 3.5s ease-in-out infinite" }}/>
                <circle cx="85" cy="85" r="38" fill="url(#mg1)"/>
                <defs>
                  <radialGradient id="mg1" cx="40%" cy="35%">
                    <stop offset="0%" stopColor="#fef9c3"/>
                    <stop offset="45%" stopColor="#fbbf24"/>
                    <stop offset="100%" stopColor="#f97316"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        )}

        {/* Afternoon — high sun, top-right */}
        {isAfternoon && (
          <div style={{ position:"absolute", top:-18, right:10, animation:"gb-float 7s ease-in-out infinite" }}>
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
              <g style={{ transformOrigin:"75px 75px", animation:"gb-spin 18s linear infinite" }}>
                {[0,45,90,135,180,225,270,315].map(d=>(
                  <line key={d}
                    x1={75+Math.cos(d*Math.PI/180)*50} y1={75+Math.sin(d*Math.PI/180)*50}
                    x2={75+Math.cos(d*Math.PI/180)*(d%90===0?72:64)} y2={75+Math.sin(d*Math.PI/180)*(d%90===0?72:64)}
                    stroke="#0284c7" strokeWidth={d%90===0?2.5:1.5} strokeLinecap="round" opacity={d%90===0?0.5:0.25}/>
                ))}
              </g>
              <circle cx="75" cy="75" r="44" fill="rgba(14,165,233,0.12)" style={{ animation:"gb-pulse 4s ease-in-out infinite" }}/>
              <circle cx="75" cy="75" r="32" fill="url(#ag1)"/>
              <defs>
                <radialGradient id="ag1" cx="38%" cy="32%">
                  <stop offset="0%" stopColor="#f0f9ff"/>
                  <stop offset="40%" stopColor="#38bdf8"/>
                  <stop offset="100%" stopColor="#0284c7"/>
                </radialGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* Evening — setting sun at bottom horizon */}
        {isEvening && (
          <div style={{ position:"absolute", bottom:-20, right:20, animation:"gb-pulse 4.5s ease-in-out infinite" }}>
            <svg width="200" height="130" viewBox="0 0 200 130" fill="none">
              <ellipse cx="100" cy="125" rx="100" ry="45" fill="rgba(249,115,22,0.22)"/>
              <ellipse cx="100" cy="125" rx="70"  ry="32" fill="rgba(249,115,22,0.16)"/>
              <path d="M 25 118 A 75 75 0 0 1 175 118 Z" fill="url(#eg1)"/>
              {[-55,-25,0,25,55].map((a,i)=>(
                <line key={i} x1={100} y1={115}
                  x2={100+Math.sin(a*Math.PI/180)*88} y2={115-Math.cos(a*Math.PI/180)*88}
                  stroke="#fb923c" strokeWidth={1.5} opacity={0.28} strokeLinecap="round"
                  style={{ animation:`gb-shimmer 2.2s ease-in-out ${i*0.28}s infinite alternate` }}/>
              ))}
              <defs>
                <radialGradient id="eg1" cx="50%" cy="100%">
                  <stop offset="0%" stopColor="#fef3c7"/>
                  <stop offset="40%" stopColor="#f97316"/>
                  <stop offset="100%" stopColor="#b91c1c"/>
                </radialGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* Night — crescent moon, top-right */}
        {isNight && (
          <div style={{ position:"absolute", top:18, right:28, animation:"gb-float 9s ease-in-out infinite, gb-moongl 4.5s ease-in-out infinite" }}>
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
              <circle cx="48" cy="48" r="48" fill="rgba(199,210,254,0.04)"/>
              <defs>
                <mask id="crescent">
                  <circle cx="48" cy="48" r="32" fill="white"/>
                  <circle cx="64" cy="38" r="25" fill="black"/>
                </mask>
                <radialGradient id="moonG" cx="32%" cy="28%">
                  <stop offset="0%" stopColor="#f8fafc"/>
                  <stop offset="50%" stopColor="#c7d2fe"/>
                  <stop offset="100%" stopColor="#818cf8"/>
                </radialGradient>
              </defs>
              <circle cx="48" cy="48" r="32" fill="url(#moonG)" mask="url(#crescent)"/>
            </svg>
          </div>
        )}
      </div>

      {/* ── Text content ── */}
      <div style={{ position:"relative", zIndex:1, maxWidth:"58%" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <span style={{ fontSize:12, fontWeight:700, color:T.pillT, background:T.pill, borderRadius:20, padding:"3px 12px", backdropFilter:"blur(6px)", display:"inline-flex", alignItems:"center", gap:5 }}>
            <i className={roleIcon[role]}/>{roleLabel[role]}
          </span>
        </div>
        <div style={{ fontSize:13.5, color:T.sub, fontWeight:500, marginBottom:3 }}>{greeting},</div>
        <div style={{ fontSize:29, fontWeight:900, color:T.text, letterSpacing:"-0.6px", lineHeight:1.1 }}>{name}</div>
        <div style={{ fontSize:13, color:T.sub, marginTop:7, lineHeight:1.45, maxWidth:380 }}>{subtitle}</div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:14, flexWrap:"wrap" }}>
          <span style={{ fontSize:11, fontWeight:500, color:T.sub }}>{dateStr}</span>
          <span style={{ color:T.sub, opacity:0.4 }}>·</span>
          <span style={{ fontSize:11, fontWeight:700, color:T.pillT, background:T.pill, borderRadius:10, padding:"2px 9px" }}>{timeStr}</span>
          <span style={{ color:T.sub, opacity:0.4 }}>·</span>
          <span style={{ fontSize:11, color:T.sub, fontStyle:"italic" }}>{tagline}</span>
        </div>
      </div>
    </div>
  );
}

// ── Field Auditor seed data ────────────────────────────────────────────────────
const FA_RECENT = [
  { icon:"ri-checkbox-circle-fill", iconColor:"#16a34a", iconBg:"#dcfce7", title:"Audit completed", sub:"SBI – Paldi Branch",        time:"10 May 2025, 11:45 AM", status:"Completed",    sColor:"#16a34a", sBg:"#dcfce7" },
  { icon:"ri-loader-4-line",        iconColor:"#d97706", iconBg:"#fef9c3", title:"Audit in progress",sub:"SBI – Navrangpura Branch",  time:"10 May 2025, 09:10 AM", status:"In Progress",  sColor:"#d97706", sBg:"#fef9c3" },
  { icon:"ri-upload-cloud-2-line",  iconColor:"#2563eb", iconBg:"#dbeafe", title:"Report synced",   sub:"SBI – Maninagar Branch",    time:"09 May 2025, 05:30 PM", status:"Synced",       sColor:"#2563eb", sBg:"#dbeafe" },
  { icon:"ri-checkbox-circle-fill", iconColor:"#16a34a", iconBg:"#dcfce7", title:"Audit completed", sub:"BOB – Baroda Main Branch",  time:"08 May 2025, 03:00 PM", status:"Completed",    sColor:"#16a34a", sBg:"#dcfce7" },
  { icon:"ri-alarm-warning-line",   iconColor:"#dc2626", iconBg:"#fee2e2", title:"NCR raised",      sub:"UCO – Kolkata HO",          time:"08 May 2025, 01:15 PM", status:"NCR",          sColor:"#dc2626", sBg:"#fee2e2" },
  { icon:"ri-file-text-line",       iconColor:"#7c3aed", iconBg:"#f5f3ff", title:"Draft saved",     sub:"PNB – Delhi Main Branch",   time:"07 May 2025, 10:00 AM", status:"Draft",        sColor:"#7c3aed", sBg:"#f5f3ff" },
];

const FA_TODAY_AUDITS = [
  { branch:"SBI – Paldi Branch",        bank:"SBI",  time:"09:00 AM", status:"Completed", score:88 },
  { branch:"SBI – Navrangpura Branch",  bank:"SBI",  time:"02:00 PM", status:"In Progress",score:0 },
];

// ── Field Auditor Dashboard ────────────────────────────────────────────────────
function FieldAuditorDashboard() {
  const G = "1.25rem";
  const card: React.CSSProperties = { background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:G }}>

      {/* ── Greeting Banner ───────────────────────────────────────────────── */}
      <GreetingBanner name="Rajesh Kumar" subtitle="SBI Maninagar Branch · Save Earth Energy" role="field-auditor" />

      {/* ── Overview Cards ────────────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:G }}>
        {[
          { label:"Total Audits",   value:"12", icon:"ri-file-list-3-line",     color:"#2563eb", bg:"#eff6ff", border:"#2563eb", sub:"All time"       },
          { label:"Completed",      value:"05", icon:"ri-checkbox-circle-line", color:"#16a34a", bg:"#f0fdf4", border:"#16a34a", sub:"This month"     },
          { label:"In Progress",    value:"04", icon:"ri-loader-4-line",        color:"#d97706", bg:"#fefce8", border:"#d97706", sub:"Active audits"  },
          { label:"Pending Sync",   value:"02", icon:"ri-upload-cloud-2-line",  color:"#dc2626", bg:"#fef2f2", border:"#dc2626", sub:"Awaiting upload"},
        ].map(c=>(
          <div key={c.label} style={{ ...card, padding:"20px", borderLeft:`4px solid ${c.border}`, cursor:"pointer" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:42, height:42, borderRadius:11, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className={c.icon} style={{ fontSize:20, color:c.color }}/>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:"#6b7280" }}>{c.label}</div>
            </div>
            <div style={{ fontSize:36, fontWeight:900, color:c.color, lineHeight:1, marginBottom:8 }}>{c.value}</div>
            <div style={{ fontSize:11, color:"#9ca3af" }}>{c.sub}</div>
            <div style={{ fontSize:11, fontWeight:700, color:c.color, marginTop:10, display:"flex", alignItems:"center", gap:4 }}>
              View all <i className="ri-arrow-right-line"/>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sync / Connectivity Banner ────────────────────────────────────── */}
      <div style={{ ...card, padding:"14px 20px", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <i className="ri-wifi-line" style={{ fontSize:19, color:"#16a34a" }}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>Connected — All data synced</div>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:1 }}>2 audits pending upload · Tap Sync to push now</div>
        </div>
        <button style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"#16a34a", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <i className="ri-refresh-line"/>Sync Now
        </button>
      </div>

      {/* ── Row: Quick Actions + Today's Audits ──────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:G }}>

        {/* Quick Actions */}
        <div style={{ ...card, padding:"20px" }}>
          <div style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:16 }}>Quick Actions</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { label:"Start New Audit",    sub:"Create a new electrical audit for a branch",    icon:"ri-file-add-line",    color:"#16a34a", bg:"#f0fdf4" },
              { label:"Pending Sync",       sub:"View and sync your pending audits",              icon:"ri-upload-cloud-2-line",color:"#2563eb",bg:"#eff6ff" },
              { label:"Draft Audits",       sub:"Continue your incomplete audits",                icon:"ri-draft-line",       color:"#7c3aed", bg:"#f5f3ff" },
              { label:"Completed Reports",  sub:"View all completed and submitted audits",        icon:"ri-bar-chart-2-line", color:"#d97706", bg:"#fefce8" },
            ].map(a=>(
              <div key={a.label} style={{ border:"1px solid #e5e7eb", borderRadius:12, padding:"16px", cursor:"pointer", display:"flex", flexDirection:"column", gap:8, transition:"box-shadow 0.15s" }}
                onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.1)")}
                onMouseLeave={e=>(e.currentTarget.style.boxShadow="none")}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:a.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <i className={a.icon} style={{ fontSize:19, color:a.color }}/>
                  </div>
                  <div style={{ width:28, height:28, borderRadius:8, background:a.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <i className="ri-arrow-right-line" style={{ fontSize:14, color:a.color }}/>
                  </div>
                </div>
                <div style={{ fontSize:13, fontWeight:800, color:"#111827" }}>{a.label}</div>
                <div style={{ fontSize:11, color:"#9ca3af", lineHeight:1.4 }}>{a.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Audits */}
        <div style={{ ...card, padding:"20px", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#111827" }}>Today&apos;s Audits</div>
            <span style={{ fontSize:11, color:"#16a34a", fontWeight:700, cursor:"pointer" }}>See All →</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, flex:1 }}>
            {FA_TODAY_AUDITS.map((a,i)=>(
              <div key={i} style={{ border:"1px solid #e5e7eb", borderRadius:12, padding:"16px", display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:11, background: a.status==="Completed"?"#f0fdf4":"#fefce8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={a.status==="Completed"?"ri-checkbox-circle-fill":"ri-loader-4-line"} style={{ fontSize:22, color:a.status==="Completed"?"#16a34a":"#d97706" }}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{a.branch}</div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{a.bank} · Scheduled {a.time}</div>
                  {a.score > 0 && <div style={{ fontSize:11, fontWeight:700, color:"#16a34a", marginTop:3 }}>Score: {a.score}%</div>}
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:a.status==="Completed"?"#16a34a":"#d97706", background:a.status==="Completed"?"#dcfce7":"#fef9c3", borderRadius:20, padding:"4px 12px", whiteSpace:"nowrap" as const }}>{a.status}</span>
              </div>
            ))}
            {/* Empty slot */}
            <div style={{ border:"2px dashed #e5e7eb", borderRadius:12, padding:"20px 16px", display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}
              onMouseEnter={e=>(e.currentTarget.style.borderColor="#16a34a")}
              onMouseLeave={e=>(e.currentTarget.style.borderColor="#e5e7eb")}>
              <div style={{ width:44, height:44, borderRadius:11, background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className="ri-add-circle-line" style={{ fontSize:22, color:"#9ca3af" }}/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#9ca3af" }}>Start a new audit</div>
                <div style={{ fontSize:11, color:"#d1d5db", marginTop:1 }}>Tap to begin a new inspection</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Activity ───────────────────────────────────────────────── */}
      <div style={{ ...card, padding:"20px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ fontSize:15, fontWeight:800, color:"#111827" }}>Recent Activity</div>
          <span style={{ fontSize:11, color:"#16a34a", fontWeight:700, cursor:"pointer" }}>See All →</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column" }}>
          {FA_RECENT.map((a,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom: i<FA_RECENT.length-1?"1px solid #f3f4f6":"none" }}>
              <div style={{ width:38, height:38, borderRadius:10, background:a.iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className={a.icon} style={{ fontSize:17, color:a.iconColor }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{a.title}</div>
                <div style={{ fontSize:11, color:"#6b7280", marginTop:1 }}>{a.sub}</div>
                <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{a.time}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                <span style={{ fontSize:11, fontWeight:700, color:a.sColor, background:a.sBg, borderRadius:20, padding:"3px 10px" }}>{a.status}</span>
                <i className="ri-arrow-right-s-line" style={{ color:"#d1d5db", fontSize:16 }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [role, setRole] = useState<Role>("super-admin");
  const active = ROLES.find(r => r.id === role)!;
  const kpis   = ROLE_KPIS[role];

  return (
    <>
      {/* ── Role Switcher ── */}
      <div className="card custom-card mb-3">
        <div className="card-body py-2 px-3">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span className="fs-12 fw-semibold text-muted text-uppercase" style={{ letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
              Preview as:
            </span>
            <ul className="nav nav-pills gap-1 flex-grow-1" style={{ margin: 0 }}>
              {ROLES.map(r => (
                <li className="nav-item" key={r.id}>
                  <button
                    className={`nav-link py-1 px-3 d-flex align-items-center gap-2${role === r.id ? " active" : ""}`}
                    style={{
                      fontSize: 12.5,
                      fontWeight: role === r.id ? 700 : 500,
                      border: "none",
                      background: role === r.id ? "var(--primary-color)" : "transparent",
                      color: role === r.id ? "#fff" : "var(--default-text-color)",
                    }}
                    onClick={() => setRole(r.id)}
                  >
                    <i className={r.icon} style={{ fontSize: 14 }} />
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>
            <span className="fs-12 text-muted d-none d-md-block" style={{ whiteSpace: "nowrap" }}>
              Logged in as: <strong className="text-primary">{active.name}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── Field Auditor: dedicated mobile-inspired layout ── */}
      {role === "field-auditor" ? (
        <FieldAuditorDashboard />
      ) : (
        <>
          {/* ── Greeting Banner ── */}
          <GreetingBanner name={active.name} subtitle={active.subtitle} role={role} />

          {/* ── Page Header ── */}
          <div className="zf-page-header" style={{ marginTop:"1.25rem" }}>
            <div>
              <h1 className="zf-page-title">{active.label} Dashboard</h1>
              <p className="zf-page-sub">{active.subtitle}</p>
            </div>
          </div>

          {/* ── KPI Cards ── */}
          <div className="zf-kpi-grid">
            {kpis.map((card) => (
              <KPICard key={card.id} {...card} />
            ))}
          </div>

          {/* ── Row 1: Today's Audits | Top Auditors | Recent Activities ── */}
          <div style={{ display: "flex", gap: "var(--zf-dash-gap, 1.25rem)", alignItems: "stretch", marginTop: "var(--zf-dash-gap, 1.25rem)" }}>
            <div style={{ flex: "0 0 38%" }}><TodayEvents /></div>
            <div style={{ flex: "0 0 22%" }}><AuditorsLeaderboard /></div>
            <div style={{ flex: "1 1 0" }}><RecentActivity /></div>
          </div>

          {/* ── Row 2: Incomplete Audits (full-width) ── */}
          <div style={{ marginTop: "var(--zf-dash-gap, 1.25rem)" }}>
            <IncompleteAudits />
          </div>
        </>
      )}
    </>
  );
}
