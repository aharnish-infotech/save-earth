"use client";
import React, { useState } from "react";
import Link from "next/link";

// ── Types & Data ──────────────────────────────────────────────────────────────
type PermValue = "full" | "own" | "none";

interface RoleDef {
  id: string;
  name: string;
  description: string;
  userCount: number;
  color: string;
  bg: string;
  icon: string;
}

const ROLES: RoleDef[] = [
  { id:"super-admin",   name:"Super Admin",   description:"Full platform access — all data, all settings, all actions", userCount:1, color:"#15803d", bg:"#dcfce7",  icon:"ri-shield-star-line"    },
  { id:"admin",         name:"Admin",          description:"Operational control — manage users, audits, reports, and settings", userCount:2, color:"#0284c7", bg:"#dbeafe",  icon:"ri-user-settings-line"  },
  { id:"coordinator",   name:"Coordinator",    description:"Zone-level management — assign audits, review submissions",         userCount:2, color:"#ca8a04", bg:"#fef9c3",  icon:"ri-user-2-line"         },
  { id:"field-auditor", name:"Field Auditor",  description:"Execute field audits — submit forms, upload photos, view reports",  userCount:7, color:"#374151", bg:"#f3f4f6",  icon:"ri-walk-line"           },
];

interface Module {
  id: string;
  label: string;
  icon: string;
  subModules?: string[];
}

const MODULES: Module[] = [
  { id:"dashboard",  label:"Dashboard",          icon:"ri-dashboard-line",        subModules:["Overview Stats","Role Dashboards","Analytics"] },
  { id:"audits",     label:"Audit Operations",   icon:"ri-file-list-3-line",      subModules:["All Audits","Pending Review","Approved","Delivered"] },
  { id:"reports",    label:"Reports / PDFs",     icon:"ri-file-pdf-line",         subModules:["Generate Report","Download Report","Share Report"] },
  { id:"banking",    label:"Banking Structure",  icon:"ri-building-2-line",       subModules:["Branches","Clients/Banks","Zones","RBO","Branch Types"] },
  { id:"questions",  label:"Audit Questions",    icon:"ri-questionnaire-line",    subModules:["Question Library","Template Builder","Bank-Zone Mapping"] },
  { id:"users",      label:"Users & Roles",      icon:"ri-team-line",             subModules:["User List","User Profile","Add/Edit/Delete Users"] },
  { id:"permissions",label:"Roles & Permissions",icon:"ri-shield-keyhole-line",   subModules:["View Permissions","Modify Role Permissions"] },
  { id:"audit-trail",label:"Audit Trail",        icon:"ri-history-line",          subModules:["View Activity Log"] },
  { id:"notifications",label:"Notifications",   icon:"ri-notification-3-line",   subModules:["Configure Alerts","Email Templates"] },
  { id:"settings",   label:"Settings & Masters", icon:"ri-settings-3-line",       subModules:["App Config","Masters Management","Security Settings"] },
];

type PermMatrix = Record<string, Record<string, PermValue>>;

const DEFAULT_PERMS: PermMatrix = {
  "super-admin": {
    dashboard:"full", audits:"full", reports:"full", banking:"full", questions:"full",
    users:"full", permissions:"full", "audit-trail":"full", notifications:"full", settings:"full",
  },
  "admin": {
    dashboard:"full", audits:"full", reports:"full", banking:"full", questions:"full",
    users:"full", permissions:"none", "audit-trail":"full", notifications:"full", settings:"full",
  },
  "coordinator": {
    dashboard:"own", audits:"own", reports:"own", banking:"own", questions:"own",
    users:"none", permissions:"none", "audit-trail":"own", notifications:"own", settings:"none",
  },
  "field-auditor": {
    dashboard:"own", audits:"own", reports:"own", banking:"none", questions:"own",
    users:"none", permissions:"none", "audit-trail":"none", notifications:"own", settings:"none",
  },
};

const PERM_LABEL: Record<PermValue, { label:string; color:string; bg:string; icon:string }> = {
  "full": { label:"Full Access", color:"#16a34a", bg:"#dcfce7",  icon:"ri-checkbox-circle-fill" },
  "own":  { label:"Own Data",    color:"#0284c7", bg:"#dbeafe",  icon:"ri-user-lock-line"       },
  "none": { label:"No Access",   color:"#9ca3af", bg:"#f3f4f6",  icon:"ri-close-circle-fill"    },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function PermissionsPage() {
  const [perms, setPerms] = useState<PermMatrix>(DEFAULT_PERMS);
  const [activeRole, setActiveRole] = useState("super-admin");
  const [expandedModule, setExpandedModule] = useState<string|null>(null);
  const [saved, setSaved] = useState(false);

  const cyclePermission = (roleId: string, moduleId: string) => {
    if (roleId === "super-admin") return; // Super admin always full
    const cur = perms[roleId]?.[moduleId] ?? "none";
    const next: PermValue = cur === "none" ? "own" : cur === "own" ? "full" : "none";
    setPerms(prev => ({ ...prev, [roleId]: { ...prev[roleId], [moduleId]: next } }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const activeRoleDef = ROLES.find(r => r.id === activeRole)!;

  return (
    <div style={{ padding:"24px 28px", minHeight:"100%", background:"var(--default-background,#f8f9fa)" }}>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-muted)", marginBottom:6 }}>
        <Link href="/dashboard" style={{ color:"var(--text-muted)", textDecoration:"none" }}>Dashboard</Link>
        <i className="ri-arrow-right-s-line"/>
        <span style={{ color:"var(--default-text-color)", fontWeight:600 }}>Roles & Permissions</span>
      </div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"var(--default-text-color)", margin:0 }}>Roles & Permissions</h1>
          <p style={{ fontSize:13, color:"var(--text-muted)", margin:"3px 0 0" }}>Define what each role can see and do across the platform</p>
        </div>
        <button onClick={handleSave} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 20px", background: saved ? "#059669" : "var(--primary-color,#16a34a)", color:"#fff", border:"none", borderRadius:9, fontWeight:700, fontSize:13, cursor:"pointer" }}>
          <i className={saved ? "ri-check-line" : "ri-save-line"}/> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Role selector cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {ROLES.map(r => (
          <button key={r.id} onClick={() => setActiveRole(r.id)} style={{
            display:"flex", flexDirection:"column", gap:8, padding:"16px",
            background:"var(--custom-white)", borderRadius:13,
            border:`2px solid ${activeRole===r.id?r.color:"var(--default-border)"}`,
            cursor:"pointer", textAlign:"left", transition:"all 0.15s",
            boxShadow: activeRole===r.id ? `0 0 0 3px ${r.color}22` : "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className={r.icon} style={{ fontSize:17, color:r.color }}/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:r.color }}>{r.name}</div>
                <div style={{ fontSize:11, color:"var(--text-muted)" }}>{r.userCount} user{r.userCount!==1?"s":""}</div>
              </div>
            </div>
            <p style={{ fontSize:11, color:"var(--text-muted)", margin:0, lineHeight:1.5 }}>{r.description}</p>
          </button>
        ))}
      </div>

      {/* Permission matrix */}
      <div style={{ background:"var(--custom-white)", borderRadius:16, border:"1px solid var(--default-border)", overflow:"hidden", boxShadow:"0 2px 8px rgba(22,163,74,0.05)" }}>
        {/* Matrix header */}
        <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--default-border)", display:"flex", alignItems:"center", gap:12, background:"#f9fafb" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:activeRoleDef.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className={activeRoleDef.icon} style={{ fontSize:17, color:activeRoleDef.color }}/>
          </div>
          <div>
            <h2 style={{ fontSize:15, fontWeight:800, color:activeRoleDef.color, margin:0 }}>{activeRoleDef.name}</h2>
            <p style={{ fontSize:12, color:"var(--text-muted)", margin:0 }}>{activeRoleDef.description}</p>
          </div>
          {activeRole === "super-admin" && (
            <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color:"#15803d", background:"#dcfce7", borderRadius:20, padding:"4px 14px" }}>
              <i className="ri-lock-line" style={{ marginRight:4 }}/>All permissions locked — always full access
            </span>
          )}
        </div>

        {/* Legend */}
        <div style={{ padding:"10px 24px", borderBottom:"1px solid var(--default-border)", display:"flex", gap:16, background:"#fafbfa" }}>
          {(Object.entries(PERM_LABEL) as [PermValue, typeof PERM_LABEL[PermValue]][]).map(([k,v]) => (
            <div key={k} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <i className={v.icon} style={{ fontSize:14, color:v.color }}/>
              <span style={{ fontSize:11, fontWeight:600, color:v.color }}>{v.label}</span>
            </div>
          ))}
          {activeRole !== "super-admin" && (
            <span style={{ marginLeft:"auto", fontSize:11, color:"var(--text-muted)" }}>
              <i className="ri-mouse-line" style={{ marginRight:4 }}/>Click a permission to cycle through access levels
            </span>
          )}
        </div>

        {/* Module rows */}
        {MODULES.map((m) => {
          const pv: PermValue = perms[activeRole]?.[m.id] ?? "none";
          const pl = PERM_LABEL[pv];
          const isExpanded = expandedModule === m.id;
          return (
            <div key={m.id} style={{ borderBottom:"1px solid var(--default-border)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 24px", transition:"background 0.1s" }}>
                {/* Module icon + name */}
                <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:`${pl.color}14`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className={m.icon} style={{ fontSize:15, color:pl.color }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--default-text-color)" }}>{m.label}</div>
                    {m.subModules && (
                      <button onClick={() => setExpandedModule(isExpanded ? null : m.id)} style={{ fontSize:11, color:"var(--text-muted)", background:"none", border:"none", cursor:"pointer", padding:0, marginTop:1 }}>
                        <i className={`ri-arrow-${isExpanded?"up":"down"}-s-line`} style={{ marginRight:2 }}/>{m.subModules.length} sub-actions
                      </button>
                    )}
                  </div>
                </div>

                {/* Permission badge (clickable) */}
                <button
                  onClick={() => cyclePermission(activeRole, m.id)}
                  disabled={activeRole === "super-admin"}
                  style={{
                    display:"flex", alignItems:"center", gap:6, padding:"6px 16px",
                    background:pl.bg, color:pl.color, border:`1px solid ${pl.color}44`,
                    borderRadius:20, fontWeight:700, fontSize:12, cursor: activeRole==="super-admin" ? "default" : "pointer",
                    transition:"all 0.15s",
                  }}
                >
                  <i className={pl.icon} style={{ fontSize:13 }}/>{pl.label}
                  {activeRole !== "super-admin" && <i className="ri-refresh-line" style={{ fontSize:10, opacity:0.6, marginLeft:2 }}/>}
                </button>
              </div>

              {/* Expanded sub-modules */}
              {isExpanded && m.subModules && (
                <div style={{ background:"#f9fafb", borderTop:"1px solid var(--default-border)", padding:"8px 24px 8px 72px" }}>
                  {m.subModules.map(sub => (
                    <div key={sub} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px dashed var(--default-border)" }}>
                      <i className="ri-corner-down-right-line" style={{ fontSize:12, color:"var(--text-muted)" }}/>
                      <span style={{ fontSize:12, color:"var(--default-text-color)", flex:1 }}>{sub}</span>
                      <span style={{ fontSize:10, fontWeight:600, color:pl.color, background:pl.bg, borderRadius:10, padding:"1px 8px" }}>
                        {pv === "full" ? "Allowed" : pv === "own" ? "Own Only" : "Blocked"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:12 }}>
        <i className="ri-information-line" style={{ marginRight:4 }}/>
        Permissions apply to all users assigned the selected role. Individual overrides must be managed via Super Admin.
      </p>
    </div>
  );
}
