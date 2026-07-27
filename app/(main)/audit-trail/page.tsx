"use client";
import React from "react";

const SAMPLE_LOGS = [
  { id:"LOG-001", user:"Mukteshwar Sharma", role:"Super Admin",  action:"Audit Approved",       target:"AU-2024-122 — SBI Paldi Branch",      time:"27 Jul 2026, 11:42 AM", icon:"ri-checkbox-circle-fill",   iColor:"#16a34a", iBg:"#dcfce7" },
  { id:"LOG-002", user:"Priya Sharma",      role:"Admin",        action:"User Role Updated",     target:"Rajesh Kumar → Field Auditor",         time:"27 Jul 2026, 10:18 AM", icon:"ri-user-settings-line",     iColor:"#2563eb", iBg:"#dbeafe" },
  { id:"LOG-003", user:"Amit Singh",        role:"Coordinator",  action:"Audit Assigned",        target:"AU-2024-138 → Rajesh Kumar",           time:"27 Jul 2026, 09:55 AM", icon:"ri-file-add-line",          iColor:"#7c3aed", iBg:"#f5f3ff" },
  { id:"LOG-004", user:"Rajesh Kumar",      role:"Field Auditor",action:"Audit Submitted",       target:"AU-2024-131 — SBI Maninagar Branch",   time:"27 Jul 2026, 09:45 AM", icon:"ri-upload-cloud-2-line",    iColor:"#0891b2", iBg:"#ecfeff" },
  { id:"LOG-005", user:"Mukteshwar Sharma", role:"Super Admin",  action:"Template Activated",    target:"Electrical Safety Audit v2.1",         time:"26 Jul 2026, 04:30 PM", icon:"ri-layout-3-line",          iColor:"#d97706", iBg:"#fefce8" },
  { id:"LOG-006", user:"Priya Sharma",      role:"Admin",        action:"Branch Added",          target:"SBI Vastrapur, Gujarat",               time:"26 Jul 2026, 03:12 PM", icon:"ri-building-2-line",        iColor:"#16a34a", iBg:"#dcfce7" },
  { id:"LOG-007", user:"Amit Singh",        role:"Coordinator",  action:"Report Delivered",      target:"AU-2024-119 — BOB Baroda Main",        time:"26 Jul 2026, 01:00 PM", icon:"ri-send-plane-line",        iColor:"#ec4899", iBg:"#fdf4ff" },
  { id:"LOG-008", user:"System",            role:"System",       action:"Sync Completed",        target:"48 records synced from Field App",      time:"26 Jul 2026, 12:00 AM", icon:"ri-refresh-line",           iColor:"#6b7280", iBg:"#f3f4f6" },
];

export default function AuditTrailPage() {
  return (
    <div style={{ padding:"1.5rem 0" }}>

      {/* Page header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1.5rem" }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:900, color:"var(--default-text-color)", margin:0, letterSpacing:"-0.3px" }}>
            Audit Trail
          </h1>
          <p style={{ fontSize:13, color:"var(--text-muted)", margin:"4px 0 0" }}>
            Immutable log of every action performed across the platform
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", border:"1px solid #e5e7eb", borderRadius:9, background:"#fff", fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}>
            <i className="ri-filter-3-line"/>Filter
          </button>
          <button style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", border:"1px solid #e5e7eb", borderRadius:9, background:"#fff", fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}>
            <i className="ri-download-2-line"/>Export CSV
          </button>
        </div>
      </div>

      {/* Coming Soon notice */}
      <div style={{ background:"linear-gradient(135deg,#f8fafc,#f1f5f9)", border:"1px solid #e2e8f0", borderRadius:14, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"#fef9c3", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <i className="ri-information-line" style={{ color:"#ca8a04", fontSize:18 }}/>
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:"#374151" }}>Preview Mode — Full filtering and export coming soon</div>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>Showing recent system activity as sample data. Live audit trail will be database-backed with full search, date range, and user filters.</div>
        </div>
      </div>

      {/* Log table */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#111827", display:"flex", alignItems:"center", gap:8 }}>
            <i className="ri-history-line" style={{ color:"#16a34a" }}/>Recent Activity
          </div>
          <span style={{ fontSize:12, color:"#9ca3af" }}>Last 24 hours · {SAMPLE_LOGS.length} entries</span>
        </div>

        {SAMPLE_LOGS.map((log, i) => (
          <div key={log.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px", borderBottom: i < SAMPLE_LOGS.length - 1 ? "1px solid #f9fafb" : "none" }}>
            <div style={{ width:38, height:38, borderRadius:10, background:log.iBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={log.icon} style={{ fontSize:17, color:log.iColor }}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{log.action}</span>
                <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:6, padding:"1px 8px" }}>{log.role}</span>
              </div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>
                <span style={{ color:"#374151", fontWeight:600 }}>{log.user}</span> · {log.target}
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontSize:11, color:"#9ca3af" }}>{log.time}</div>
              <div style={{ fontSize:10, color:"#d1d5db", marginTop:2 }}>{log.id}</div>
            </div>
          </div>
        ))}

        <div style={{ padding:"14px 20px", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:12, color:"#9ca3af" }}>Full pagination and search available in the complete release</span>
        </div>
      </div>
    </div>
  );
}
