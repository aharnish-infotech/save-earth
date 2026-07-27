"use client";
import React, { useState } from "react";

type NType = "approval" | "assignment" | "overdue" | "sync" | "system";

interface Notification {
  id: string; type: NType; title: string; body: string;
  time: string; read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id:"N-001", type:"approval",   title:"Audit Approved",          body:"AU-2024-122 for SBI Paldi Branch has been approved by Admin.",          time:"10 mins ago",  read:false },
  { id:"N-002", type:"assignment", title:"New Audit Assigned",       body:"AU-2024-138 — SBI Vastrapur, Gujarat has been assigned to you.",        time:"35 mins ago",  read:false },
  { id:"N-003", type:"overdue",    title:"Audit Overdue",            body:"AU-2024-115 — SBI Bodakdev is 12 days past its due date.",              time:"1 hour ago",   read:false },
  { id:"N-004", type:"sync",       title:"Sync Completed",           body:"48 audit records synced successfully from the Field Auditor app.",       time:"2 hours ago",  read:true  },
  { id:"N-005", type:"approval",   title:"Report Delivered",         body:"AU-2024-119 — BOB Baroda Main report has been delivered to client.",    time:"3 hours ago",  read:true  },
  { id:"N-006", type:"assignment", title:"Audit Assigned to Sneha",  body:"AU-2024-133 — SBI Satellite has been assigned to Sneha Patel.",         time:"5 hours ago",  read:true  },
  { id:"N-007", type:"overdue",    title:"3 Audits Overdue",         body:"AU-2024-135, AU-2024-136, and AU-2024-120 require immediate attention.", time:"Yesterday",    read:true  },
  { id:"N-008", type:"system",     title:"Template Updated",         body:"Electrical Safety Audit Template v2.1 is now active for all zones.",    time:"Yesterday",    read:true  },
];

const TYPE_META: Record<NType, { icon: string; color: string; bg: string; label: string }> = {
  approval:   { icon:"ri-checkbox-circle-fill",  color:"#16a34a", bg:"#dcfce7", label:"Approval"   },
  assignment: { icon:"ri-file-add-line",          color:"#2563eb", bg:"#dbeafe", label:"Assignment" },
  overdue:    { icon:"ri-alarm-warning-fill",     color:"#dc2626", bg:"#fee2e2", label:"Overdue"    },
  sync:       { icon:"ri-refresh-line",           color:"#0891b2", bg:"#ecfeff", label:"Sync"       },
  system:     { icon:"ri-settings-3-line",        color:"#6b7280", bg:"#f3f4f6", label:"System"     },
};

const TABS = ["All","Unread","Approval","Assignment","Overdue","System"];

export default function NotificationsPage() {
  const [active, setActive] = useState("All");
  const [notes, setNotes]   = useState(NOTIFICATIONS);

  const filtered = notes.filter(n => {
    if (active === "All")    return true;
    if (active === "Unread") return !n.read;
    return n.type === active.toLowerCase();
  });

  const unreadCount = notes.filter(n => !n.read).length;

  const markAllRead = () => setNotes(prev => prev.map(n => ({ ...n, read: true })));
  const markRead    = (id: string) => setNotes(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div style={{ padding:"1.5rem 0" }}>

      {/* Page header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1.5rem" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <h1 style={{ fontSize:22, fontWeight:900, color:"var(--default-text-color)", margin:0, letterSpacing:"-0.3px" }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span style={{ fontSize:12, fontWeight:800, color:"#fff", background:"#dc2626", borderRadius:20, padding:"2px 9px", minWidth:22, textAlign:"center" }}>
                {unreadCount}
              </span>
            )}
          </div>
          <p style={{ fontSize:13, color:"var(--text-muted)", margin:"4px 0 0" }}>
            Platform-wide alerts, assignments, and status updates
          </p>
        </div>
        <button onClick={markAllRead} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", border:"1px solid #e5e7eb", borderRadius:9, background:"#fff", fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}>
          <i className="ri-check-double-line"/>Mark All Read
        </button>
      </div>

      {/* Tab strip */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"4px", display:"flex", gap:2, marginBottom:16, width:"fit-content" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActive(t)} style={{
            padding:"7px 16px", borderRadius:9, border:"none", fontSize:12, fontWeight:active===t?700:500,
            background: active===t ? "#16a34a" : "transparent",
            color: active===t ? "#fff" : "#6b7280", cursor:"pointer", transition:"all 0.15s",
          }}>
            {t}{t==="Unread" && unreadCount>0 ? ` (${unreadCount})` : ""}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding:"60px 24px", textAlign:"center" }}>
            <i className="ri-notification-off-line" style={{ fontSize:40, color:"#d1d5db", display:"block", marginBottom:10 }}/>
            <div style={{ fontSize:14, fontWeight:700, color:"#9ca3af" }}>No notifications here</div>
          </div>
        ) : filtered.map((n, i) => {
          const meta = TYPE_META[n.type];
          return (
            <div key={n.id} onClick={() => markRead(n.id)}
              style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"16px 20px",
                borderBottom: i < filtered.length-1 ? "1px solid #f9fafb" : "none",
                background: n.read ? "#fff" : "#fafffe",
                cursor:"pointer", transition:"background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
              onMouseLeave={e => (e.currentTarget.style.background = n.read ? "#fff" : "#fafffe")}
            >
              {/* Unread dot */}
              <div style={{ paddingTop:4, flexShrink:0 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background: n.read ? "transparent" : "#16a34a", boxShadow: n.read ? "none" : "0 0 0 3px rgba(22,163,74,0.2)" }}/>
              </div>
              {/* Icon */}
              <div style={{ width:40, height:40, borderRadius:11, background:meta.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className={meta.icon} style={{ fontSize:18, color:meta.color }}/>
              </div>
              {/* Content */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight: n.read ? 600 : 800, color:"#111827" }}>{n.title}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:meta.color, background:meta.bg, borderRadius:6, padding:"1px 7px" }}>{meta.label}</span>
                </div>
                <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.5 }}>{n.body}</div>
              </div>
              {/* Time */}
              <div style={{ fontSize:11, color:"#9ca3af", flexShrink:0, paddingTop:2 }}>{n.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
