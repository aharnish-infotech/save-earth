"use client";
import React, { useState } from "react";
import { HR_EMPLOYEES, HREmployee } from "@/lib/data/hr-employees";

// ── Types ──────────────────────────────────────────────────────────────────
type AttStatus = "P"|"A"|"H"|"HD"|"L"|"OL"|"DO"|"-";
interface EmpAtt extends HREmployee {
  attendance: Record<number, AttStatus>;
  hours: Record<number, number>;
}
interface DetailState { emp: EmpAtt; day: number; }

// ── Constants ──────────────────────────────────────────────────────────────
const SUNDAYS  = new Set([5,12,19,26]);
const HOLIDAYS = new Set([15]);
const TODAY    = 14;
const MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DEPTS    = ["All","Management","Technology","HR","Finance","Operations","Marketing","Sales","Design"];
const DESGS    = ["All","CEO & Founder","Sr. Developer","Jr. Developer","Trainee","Intern","HR Manager","Accountant","Admin Officer","Marketing Executive","Business Analyst","Project Manager","QA Engineer","DevOps Engineer","Data Analyst","Content Writer","Support Executive","Sales Manager","Operations Head","Finance Manager","UI/UX Designer"];
const AVATAR_COLORS = ["#15803d","#16a34a","#0284c7","#16a34a","#dc2626","#db2777","#ea580c","#ca8a04","#0891b2","#059669"];
const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const STATUS_CFG: {[k in AttStatus]: {label:string;bg:string;color:string;icon:string;badgeBg:string;badgeColor:string}} = {
  P:  {label:"Present",  bg:"#dcfce7",color:"#16a34a",icon:"ri-check-line",          badgeBg:"#dcfce7",badgeColor:"#16a34a"},
  A:  {label:"Absent",   bg:"#fee2e2",color:"#dc2626",icon:"ri-close-line",           badgeBg:"#fee2e2",badgeColor:"#dc2626"},
  H:  {label:"Holiday",  bg:"#fef9c3",color:"#ca8a04",icon:"ri-star-line",            badgeBg:"#fef9c3",badgeColor:"#ca8a04"},
  HD: {label:"Half Day", bg:"#fed7aa",color:"#ea580c",icon:"ri-contrast-line",        badgeBg:"#fed7aa",badgeColor:"#ea580c"},
  L:  {label:"Late",     bg:"#fce7f3",color:"#db2777",icon:"ri-time-line",            badgeBg:"#fce7f3",badgeColor:"#db2777"},
  OL: {label:"On Leave", bg:"#dbeafe",color:"#1d4ed8",icon:"ri-plane-line",           badgeBg:"#dbeafe",badgeColor:"#1d4ed8"},
  DO: {label:"Day Off",  bg:"#f3f4f6",color:"#6b7280",icon:"ri-rest-time-line",       badgeBg:"#f3f4f6",badgeColor:"#6b7280"},
  "-":{label:"—",        bg:"transparent",color:"#d1d5db",icon:"",                   badgeBg:"transparent",badgeColor:"#d1d5db"},
};

// ── Mock data generators ───────────────────────────────────────────────────
function mockAtt(seed: number): Record<number, AttStatus> {
  const r: Record<number, AttStatus> = {};
  for (let d = 1; d <= 31; d++) {
    if (d > TODAY)          { r[d] = "-";  continue; }
    if (SUNDAYS.has(d))     { r[d] = "DO"; continue; }
    if (HOLIDAYS.has(d))    { r[d] = "H";  continue; }
    const v = ((seed * d * 1664525 + 1013904223) & 0x7fffffff) % 10;
    r[d] = v < 1 ? "OL" : v < 2 ? "HD" : v < 3 ? "L" : v < 4 ? "A" : "P";
  }
  return r;
}
function mockHours(seed: number): Record<number, number> {
  const r: Record<number, number> = {};
  for (let d = 1; d <= 31; d++) {
    if (d > TODAY || SUNDAYS.has(d) || HOLIDAYS.has(d)) { r[d] = 0; continue; }
    const v = ((seed * d * 1664525 + 1013904223) & 0x7fffffff) % 10;
    r[d] = v < 4 ? 0 : Math.round((4 + ((seed * d * 7) % 400) / 100) * 10) / 10;
  }
  return r;
}
function fmtH(h: number) { const hr = Math.floor(h); const mn = Math.round((h - hr) * 60); return `${hr}h ${String(mn).padStart(2,"0")}m`; }
function fmtHs(h: number){ const hr = Math.floor(h); const mn = Math.round((h - hr) * 60); return `${hr}:${String(mn).padStart(2,"0")}`; }

const CI_POOL = ["09:05 AM","09:18 AM","09:32 AM","09:45 AM","10:02 AM","10:15 AM","08:55 AM"];
const CO_POOL = ["05:15 pm","05:30 pm","06:00 pm","06:30 pm","07:00 pm","07:30 pm","05:00 pm"];
const ci = (seed: number, d: number) => CI_POOL[((seed * d * 7 + 3) & 0x7fffffff) % CI_POOL.length];
const co = (seed: number, d: number) => CO_POOL[((seed * d * 13 + 5) & 0x7fffffff) % CO_POOL.length];

// Enrich HR_EMPLOYEES with attendance + hours
const EMPLOYEES: EmpAtt[] = HR_EMPLOYEES.map(e => ({
  ...e,
  attendance: mockAtt(e.attSeed),
  hours: mockHours(e.attSeed),
}));

const TABS = [
  { id:"summary",     label:"Summary",               icon:"ri-bar-chart-grouped-line" },
  { id:"by-member",   label:"Attendance by Member",  icon:"ri-user-3-line"            },
  { id:"by-hour",     label:"Attendance by Hour",    icon:"ri-time-line"              },
  { id:"by-location", label:"Attendance by Location",icon:"ri-map-pin-line"           },
];


const ATT_PAGE_SIZE = 15;

// ── Pagination widget ──────────────────────────────────────────────────────
function AttPager({ total, page, onChange }: { total:number;page:number;onChange:(p:number)=>void }) {
  const pages = Math.ceil(total / ATT_PAGE_SIZE);
  if (pages <= 1) return null;
  const start = (page - 1) * ATT_PAGE_SIZE + 1;
  const end   = Math.min(page * ATT_PAGE_SIZE, total);
  const nums: number[] = [];
  const lo = Math.max(1, page - 2);
  const hi = Math.min(pages, page + 2);
  for (let i = lo; i <= hi; i++) nums.push(i);
  const PBTN: React.CSSProperties = { padding:"4px 10px",borderRadius:6,border:"1.5px solid #dcfce7",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:"#15803d" };
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.75rem",padding:"8px 4px",flexWrap:"wrap",gap:8 }}>
      <span style={{ fontSize:12,color:"#6b7280",fontWeight:500 }}>Showing <b>{start}</b>–<b>{end}</b> of <b>{total}</b> employees</span>
      <div style={{ display:"flex",gap:4,alignItems:"center" }}>
        <button style={{ ...PBTN,color:page===1?"#d1d5db":"#15803d" }} disabled={page===1} onClick={()=>onChange(page-1)}><i className="ri-arrow-left-s-line"/></button>
        {lo > 1 && <><button style={PBTN} onClick={()=>onChange(1)}>1</button><span style={{ color:"#9ca3af" }}>…</span></>}
        {nums.map(n => <button key={n} style={{ ...PBTN,background:n===page?"#15803d":"#fff",color:n===page?"#fff":"#15803d",border:n===page?"none":"1.5px solid #dcfce7" }} onClick={()=>onChange(n)}>{n}</button>)}
        {hi < pages && <><span style={{ color:"#9ca3af" }}>…</span><button style={PBTN} onClick={()=>onChange(pages)}>{pages}</button></>}
        <button style={{ ...PBTN,color:page===pages?"#d1d5db":"#15803d" }} disabled={page===pages} onClick={()=>onChange(page+1)}><i className="ri-arrow-right-s-line"/></button>
      </div>
    </div>
  );
}

// ── Shared UI primitives ───────────────────────────────────────────────────
function AvatarEl({ emp, size = 32 }: { emp: EmpAtt; size?: number }) {
  const idx = HR_EMPLOYEES.findIndex(e => e.id === emp.id);
  return (
    <div style={{ width:size,height:size,borderRadius:"50%",background:AVATAR_COLORS[idx%AVATAR_COLORS.length],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*0.33,flexShrink:0 }}>
      {emp.avatar}
    </div>
  );
}
function EmpCell({ emp }: { emp: EmpAtt }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
      <AvatarEl emp={emp}/>
      <div>
        <div style={{ fontWeight:700,color:"#1e1b4b",fontSize:12,whiteSpace:"nowrap" }}>{emp.name}</div>
        <div style={{ color:"#9ca3af",fontSize:10 }}>{emp.designation}</div>
      </div>
    </div>
  );
}
function Sel({ label, value, onChange, options }: { label:string;value:string;onChange:(v:string)=>void;options:string[] }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
      <span style={{ fontSize:12,fontWeight:600,color:"#374151",whiteSpace:"nowrap" }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding:"5px 10px",borderRadius:7,border:"1.5px solid #e5e7eb",fontSize:12,color:"#374151",background:"#fafafa",cursor:"pointer",outline:"none" }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function StatusCell({ s }: { s: AttStatus }) {
  const c = STATUS_CFG[s];
  if (s === "-") return <span style={{ color:"#d1d5db",fontSize:11 }}>—</span>;
  return <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:26,height:26,borderRadius:6,background:c.bg,color:c.color,fontSize:13 }} title={c.label}><i className={c.icon}/></span>;
}
function Badge({ s }: { s: AttStatus }) {
  const c = STATUS_CFG[s];
  if (s === "-") return <span style={{ color:"#d1d5db" }}>—</span>;
  return <span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,background:c.badgeBg,color:c.badgeColor,fontSize:12,fontWeight:700 }}><i className={c.icon} style={{ fontSize:11 }}/>{c.label}</span>;
}

// ── Circular timer ─────────────────────────────────────────────────────────
function CircleTimer({ hours, max = 9 }: { hours: number; max?: number }) {
  const r = 60; const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(hours / max, 1) * circ);
  return (
    <div style={{ position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center" }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        <circle cx={80} cy={80} r={r} fill="none" stroke="#e5e7eb" strokeWidth={10}/>
        <circle cx={80} cy={80} r={r} fill="none" stroke="#15803d" strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 80 80)"
          style={{ transition:"stroke-dashoffset 0.6s ease" }}/>
      </svg>
      <div style={{ position:"absolute",textAlign:"center" }}>
        <div style={{ fontSize:20,fontWeight:800,color:"#1e1b4b" }}>{fmtH(hours)}</div>
        <div style={{ fontSize:10,color:"#9ca3af",fontWeight:600 }}>TOTAL</div>
      </div>
    </div>
  );
}

// ── Mark Attendance Modal ──────────────────────────────────────────────────
function MarkModal({ emp, day, onClose, onSave }: { emp:EmpAtt;day:number;onClose:()=>void;onSave:(d:{clockIn:string;clockOut:string})=>void }) {
  const [clockIn,  setClockIn]  = useState(ci(emp.attSeed, day));
  const [clockOut, setClockOut] = useState(co(emp.attSeed, day));
  const [late,     setLate]     = useState(false);
  const [halfDay,  setHalfDay]  = useState(false);
  const [wfh,      setWfh]      = useState("Office");
  const Toggle = ({ on, toggle }: { on:boolean; toggle:()=>void }) => (
    <div onClick={toggle} style={{ width:36,height:20,borderRadius:10,background:on?"#15803d":"#d1d5db",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0 }}>
      <div style={{ position:"absolute",top:2,left:on?18:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
    </div>
  );
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:10001,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#fff",borderRadius:16,width:"min(540px,95vw)",boxShadow:"0 20px 60px rgba(0,0,0,0.2)",overflow:"hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:"16px 20px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}><AvatarEl emp={emp} size={36}/><div><div style={{ fontWeight:800,fontSize:14,color:"#1e1b4b" }}>{emp.name}</div><div style={{ fontSize:11,color:"#9ca3af" }}>{emp.designation}</div></div></div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontSize:11,fontWeight:700,color:"#15803d",background:"#dcfce7",padding:"3px 10px",borderRadius:6 }}>Mark Attendance</span>
            <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#9ca3af" }}>&times;</button>
          </div>
        </div>
        <div style={{ padding:"18px 20px" }}>
          <div style={{ fontSize:13,fontWeight:700,color:"#374151",marginBottom:14 }}>Date — {String(day).padStart(2,"0")}-07-2026</div>
          <div className="row g-3">
            <div className="col-md-5"><label style={LBL}>Clock In <span style={{ color:"#dc2626" }}>*</span></label><input value={clockIn} onChange={e=>setClockIn(e.target.value)} style={INP}/></div>
            <div className="col-md-5"><label style={LBL}>Clock In IP</label><input value="49.36.16.99" readOnly style={{ ...INP,background:"#f9fafb",color:"#9ca3af" }}/></div>
            <div className="col-md-2"><label style={LBL}>Late</label><Toggle on={late} toggle={()=>setLate(v=>!v)}/></div>
            <div className="col-md-5"><label style={LBL}>Clock Out</label><input value={clockOut} onChange={e=>setClockOut(e.target.value)} style={INP}/></div>
            <div className="col-md-5"><label style={LBL}>Clock Out IP</label><input value="49.36.16.99" readOnly style={{ ...INP,background:"#f9fafb",color:"#9ca3af" }}/></div>
            <div className="col-md-2"><label style={LBL}>Half Day</label><Toggle on={halfDay} toggle={()=>setHalfDay(v=>!v)}/></div>
            <div className="col-md-6"><label style={LBL}>Location</label><select style={INP}><option>AHARNISH INFOTECH PRIVATE LIMITED (HO)</option><option>Branch Office – Bhopal</option></select></div>
            <div className="col-md-6"><label style={LBL}>Working From <span style={{ color:"#dc2626" }}>*</span></label><select value={wfh} onChange={e=>setWfh(e.target.value)} style={INP}><option>Office</option><option>Home</option><option>Client Site</option></select></div>
          </div>
        </div>
        <div style={{ padding:"12px 20px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"flex-end",gap:8 }}>
          <button onClick={onClose} style={{ padding:"8px 20px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer" }}>Close</button>
          <button onClick={()=>onSave({clockIn,clockOut})} style={{ padding:"8px 24px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#15803d,#16a34a)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}><i className="ri-check-line"/> Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Attendance Detail Modal ────────────────────────────────────────────────
function DetailModal({ detail, onClose }: { detail: DetailState; onClose: ()=>void }) {
  const { emp, day } = detail;
  const h = emp.hours[day] || 0;
  const [showMark, setShowMark] = useState(false);
  const [savedCi,  setSavedCi]  = useState(ci(emp.attSeed, day));
  const [savedCo,  setSavedCo]  = useState(co(emp.attSeed, day));
  const dateStr = `${String(day).padStart(2,"0")}-07-2026`;
  const dayStr  = DAY_NAMES[(3 + day - 1) % 7];
  const idx = HR_EMPLOYEES.findIndex(e => e.id === emp.id);
  return (
    <>
      <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={onClose}>
        <div style={{ background:"#fff",borderRadius:16,width:"min(780px,95vw)",maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
          <div style={{ padding:"16px 24px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <AvatarEl emp={emp} size={48}/>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ fontWeight:800,fontSize:16,color:"#1e1b4b" }}>{emp.name}</span><span style={{ fontSize:10,fontWeight:700,color:"#15803d",background:"#dcfce7",padding:"2px 8px",borderRadius:20 }}>{emp.role}</span></div>
                <div style={{ fontSize:12,color:"#9ca3af",marginTop:2 }}>{emp.designation} · {emp.department}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:24,color:"#9ca3af",lineHeight:1 }}>&times;</button>
          </div>
          <div className="row g-0">
            <div className="col-md-6" style={{ borderRight:"1px solid #f3f4f6",padding:"20px 24px" }}>
              <div style={{ fontSize:14,fontWeight:700,color:"#374151",marginBottom:16 }}>Date — {dateStr} ({dayStr})</div>
              <div style={{ border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 16px",marginBottom:16,background:"#fafafa" }}>
                <div style={{ fontSize:11,fontWeight:600,color:"#9ca3af",marginBottom:4 }}>Clock In</div>
                <div style={{ fontSize:18,fontWeight:800,color:"#1e1b4b" }}>{savedCi}</div>
              </div>
              <div style={{ display:"flex",justifyContent:"center",marginBottom:16 }}><CircleTimer hours={h}/></div>
              <div style={{ border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 16px",background:"#fafafa" }}>
                <div style={{ fontSize:11,fontWeight:600,color:"#9ca3af",marginBottom:4 }}>Clock Out</div>
                <div style={{ fontSize:18,fontWeight:800,color:"#1e1b4b" }}>{savedCo}</div>
              </div>
            </div>
            <div className="col-md-6" style={{ padding:"20px 24px" }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
                <span style={{ fontSize:14,fontWeight:700,color:"#374151" }}>Activity</span>
                <button onClick={()=>setShowMark(true)} style={{ padding:"6px 16px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#15803d,#16a34a)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}><i className="ri-add-line"/> Add</button>
              </div>
              <div style={{ display:"flex",flexDirection:"column" as const,gap:8 }}>
                <div style={{ background:"#f8f9fa",borderRadius:10,padding:"12px 14px",border:"1px solid #f3f4f6" }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <span style={{ width:10,height:10,borderRadius:"50%",background:"#15803d",boxShadow:"0 0 0 2px rgba(22,163,74,0.3)",display:"inline-block",flexShrink:0 }}/>
                      <span style={{ fontSize:12,fontWeight:700,color:"#1e1b4b" }}>Clock In</span>
                      <span style={{ fontSize:10,fontWeight:700,color:"#16a34a",background:"#dcfce7",padding:"1px 7px",borderRadius:20 }}>General Shift</span>
                    </div>
                    <i className="ri-more-2-line" style={{ color:"#9ca3af",cursor:"pointer" }}/>
                  </div>
                  <div style={{ paddingLeft:16,fontSize:12,color:"#6b7280" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:2 }}><i className="ri-time-line" style={{ fontSize:11 }}/> {dateStr} {savedCi.toLowerCase()}</div>
                    <div style={{ display:"flex",alignItems:"center",gap:5 }}><i className="ri-map-pin-line" style={{ fontSize:11 }}/> AHARNISH INFOTECH PRIVATE LIMITED (HO) (office)</div>
                  </div>
                </div>
                <div style={{ background:"#f8f9fa",borderRadius:10,padding:"12px 14px",border:"1px solid #f3f4f6" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:6 }}>
                    <span style={{ width:10,height:10,borderRadius:"50%",background:"#15803d",boxShadow:"0 0 0 2px rgba(22,163,74,0.3)",display:"inline-block",flexShrink:0 }}/>
                    <span style={{ fontSize:12,fontWeight:700,color:"#1e1b4b" }}>Clock Out</span>
                  </div>
                  <div style={{ paddingLeft:16,fontSize:12,color:"#6b7280",display:"flex",alignItems:"center",gap:5 }}><i className="ri-time-line" style={{ fontSize:11 }}/> {dateStr} {savedCo}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showMark && <MarkModal emp={emp} day={day} onClose={()=>setShowMark(false)} onSave={({clockIn,clockOut})=>{setSavedCi(clockIn);setSavedCo(clockOut);setShowMark(false);}}/>}
    </>
  );
}

// ── Summary Tab ────────────────────────────────────────────────────────────
function SummaryTab({ filtered, days, workDays }: { filtered:EmpAtt[];days:number;workDays:number }) {
  const [page, setPage] = useState(1);
  React.useEffect(()=>{ setPage(1); }, [filtered]);
  const paginated = filtered.slice((page-1)*ATT_PAGE_SIZE, page*ATT_PAGE_SIZE);
  const TH: React.CSSProperties = { padding:"8px 4px",textAlign:"center",fontWeight:700,color:"#6b7280",fontSize:11,whiteSpace:"nowrap",borderBottom:"2px solid #dcfce7" };
  const countP = (e: EmpAtt) => Object.values(e.attendance).filter(s => s==="P"||s==="HD"||s==="L").length;
  return (
    <>
      <div className="row g-3" style={{ marginBottom:"1.25rem" }}>
        {[
          { label:"Total",       value:filtered.length,                                          icon:"ri-group-line",           color:"#15803d",bg:"#dcfce7" },
          { label:"Present",     value:filtered.filter(e=>e.attendance[TODAY]==="P").length,     icon:"ri-checkbox-circle-line", color:"#16a34a",bg:"#dcfce7" },
          { label:"Absent",      value:filtered.filter(e=>e.attendance[TODAY]==="A").length,     icon:"ri-close-circle-line",    color:"#dc2626",bg:"#fee2e2" },
          { label:"On Leave",    value:filtered.filter(e=>e.attendance[TODAY]==="OL").length,    icon:"ri-plane-line",           color:"#1d4ed8",bg:"#dbeafe" },
          { label:"Working Days",value:workDays,                                                  icon:"ri-calendar-2-line",      color:"#16a34a",bg:"#dcfce7" },
        ].map(c => (
          <div key={c.label} className="col">
            <div style={{ background:"#fff",borderRadius:12,border:"1px solid #dcfce7",padding:"14px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(22,163,74,0.06)" }}>
              <div style={{ width:42,height:42,borderRadius:10,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><i className={c.icon} style={{ fontSize:20,color:c.color }}/></div>
              <div><div style={{ fontSize:22,fontWeight:800,color:c.color,lineHeight:1 }}>{c.value}</div><div style={{ fontSize:11,color:"#9ca3af",fontWeight:600,marginTop:2 }}>{c.label}</div></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:"#f9fafb",borderRadius:8,padding:"8px 12px",marginBottom:"1rem",display:"flex",gap:16,flexWrap:"wrap" as const }}>
        <span style={{ fontSize:11,fontWeight:600,color:"#6b7280" }}>Legend:</span>
        {(Object.entries(STATUS_CFG) as [AttStatus,typeof STATUS_CFG[AttStatus]][]).filter(([k])=>k!=="-").map(([k,c])=>(
          <div key={k} style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#374151" }}>
            <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:4,background:c.bg,color:c.color,fontSize:11 }}><i className={c.icon}/></span>{c.label}
          </div>
        ))}
      </div>
      <div style={{ background:"#fff",borderRadius:12,border:"1px solid #dcfce7",overflow:"auto",boxShadow:"0 2px 12px rgba(22,163,74,0.06)" }}>
        <table style={{ borderCollapse:"collapse",minWidth:"100%",fontSize:12 }}>
          <thead>
            <tr style={{ background:"#f0fdf4" }}>
              <th style={{ ...TH,minWidth:200,textAlign:"left",position:"sticky",left:0,background:"#f0fdf4",zIndex:2 }}>Employee</th>
              {Array.from({length:days},(_,i)=>i+1).map(d => {
                const isSun=SUNDAYS.has(d),isHol=HOLIDAYS.has(d),isToday=d===TODAY;
                return <th key={d} style={{ ...TH,minWidth:34,background:isToday?"#dcfce7":isHol?"#fef9c3":isSun?"#f9fafb":"#f0fdf4",color:isSun?"#9ca3af":isHol?"#ca8a04":isToday?"#15803d":"#6b7280" }}><div style={{ fontSize:9,fontWeight:500 }}>{DAY_SHORT[(3+d-1)%7]}</div><div style={{ fontSize:12,fontWeight:700 }}>{d}</div></th>;
              })}
              <th style={{ ...TH,minWidth:60,background:"#dcfce7",color:"#15803d" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((emp,idx) => (
              <tr key={emp.id} style={{ borderTop:"1px solid #f3f4f6",background:idx%2===0?"#fff":"#fafafa" }}>
                <td style={{ padding:"8px 12px",position:"sticky",left:0,background:idx%2===0?"#fff":"#fafafa",zIndex:1,borderRight:"1px solid #dcfce7" }}><EmpCell emp={emp}/></td>
                {Array.from({length:days},(_,i)=>i+1).map(d => (
                  <td key={d} style={{ padding:"3px",textAlign:"center",background:SUNDAYS.has(d)?"rgba(249,250,251,0.8)":d===TODAY?"rgba(237,233,254,0.3)":"transparent" }}>
                    <StatusCell s={emp.attendance[d]??"-"}/>
                  </td>
                ))}
                <td style={{ padding:"8px",textAlign:"center",fontWeight:700,color:countP(emp)>0?"#16a34a":"#dc2626",background:"#f0fdf4" }}>{countP(emp)}/{workDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AttPager total={filtered.length} page={page} onChange={p=>{setPage(p);}} />
    </>
  );
}

// ── By Member Tab ──────────────────────────────────────────────────────────
function ByMemberTab({ month, year }: { month:number;year:number }) {
  const [selId, setSelId] = useState(EMPLOYEES[0].id);
  const emp = EMPLOYEES.find(e => e.id === selId) ?? EMPLOYEES[0];
  const days = new Date(year, month+1, 0).getDate();
  const workDays = Array.from({length:days},(_,i)=>i+1).filter(d=>!SUNDAYS.has(d)&&!HOLIDAYS.has(d)&&d<=TODAY).length;
  const summary = {
    working:  workDays,
    present:  Object.values(emp.attendance).filter(s=>s==="P").length,
    late:     Object.values(emp.attendance).filter(s=>s==="L").length,
    halfDay:  Object.values(emp.attendance).filter(s=>s==="HD").length,
    absent:   Object.values(emp.attendance).filter(s=>s==="A").length,
    holiday:  Object.values(emp.attendance).filter(s=>s==="H").length,
  };
  const THs: React.CSSProperties = { padding:"10px 14px",fontWeight:700,fontSize:11,color:"#6b7280",textTransform:"uppercase" as const,letterSpacing:"0.04em",borderBottom:"2px solid #dcfce7",whiteSpace:"nowrap",background:"#f9f9fb" };
  const TDs: React.CSSProperties = { padding:"12px 14px",verticalAlign:"middle",fontSize:13,borderTop:"1px solid #f3f4f6" };
  return (
    <>
      <div style={{ marginBottom:"1.25rem" }}>
        <div style={{ fontSize:11,fontWeight:700,color:"#374151",marginBottom:5 }}>Employee</div>
        <select value={selId} onChange={e=>{setSelId(e.target.value);}} style={{ padding:"8px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,fontWeight:600,color:"#374151",background:"#fafafa",cursor:"pointer",outline:"none",minWidth:280 }}>
          {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} — {e.designation}</option>)}
        </select>
      </div>
      <div className="row g-3" style={{ marginBottom:"1.25rem" }}>
        {[{label:"Working Days",value:summary.working,color:"#15803d",bg:"#dcfce7",icon:"ri-calendar-2-line"},{label:"Present",value:summary.present,color:"#16a34a",bg:"#dcfce7",icon:"ri-checkbox-circle-line"},{label:"Late",value:summary.late,color:"#db2777",bg:"#fce7f3",icon:"ri-time-line"},{label:"Half Day",value:summary.halfDay,color:"#ea580c",bg:"#fed7aa",icon:"ri-contrast-line"},{label:"Absent",value:summary.absent,color:"#dc2626",bg:"#fee2e2",icon:"ri-close-circle-line"},{label:"Holidays",value:summary.holiday,color:"#ca8a04",bg:"#fef9c3",icon:"ri-star-line"}].map(c=>(
          <div key={c.label} className="col">
            <div style={{ background:"#fff",borderRadius:12,border:"1px solid #dcfce7",padding:"12px",textAlign:"center",boxShadow:"0 2px 8px rgba(22,163,74,0.06)" }}>
              <div style={{ width:34,height:34,borderRadius:8,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px" }}><i className={c.icon} style={{ fontSize:17,color:c.color }}/></div>
              <div style={{ fontSize:18,fontWeight:800,color:c.color }}>{c.value}</div>
              <div style={{ fontSize:10,color:"#9ca3af",fontWeight:600 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:"#fff",borderRadius:12,border:"1px solid #dcfce7",overflow:"hidden",boxShadow:"0 2px 12px rgba(22,163,74,0.06)" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead><tr><th style={{ ...THs,textAlign:"left" }}>Date</th><th style={{ ...THs,textAlign:"center" }}>Status</th><th style={{ ...THs,textAlign:"left" }}>Clock In</th><th style={{ ...THs,textAlign:"left" }}>Clock Out</th><th style={{ ...THs,textAlign:"center" }}>Total</th><th style={{ ...THs,textAlign:"center" }}>Details</th></tr></thead>
          <tbody>
            {Array.from({length:days},(_,i)=>days-i).map(d => {
              const s = emp.attendance[d] ?? "-";
              const showClock = s==="P"||s==="HD"||s==="L";
              const h = showClock ? (emp.hours[d]||0) : 0;
              return (
                <tr key={d} style={{ background:d%2===0?"#fafafa":"#fff" }}>
                  <td style={TDs}><div style={{ fontWeight:700,color:"#1e1b4b" }}>{String(d).padStart(2,"0")}-07-2026</div><div style={{ fontSize:11,color:"#9ca3af" }}>{DAY_NAMES[(3+d-1)%7]}</div></td>
                  <td style={{ ...TDs,textAlign:"center" }}><Badge s={s}/></td>
                  <td style={TDs}><span style={{ color:"#374151" }}>{showClock?ci(emp.attSeed,d):"—"}</span></td>
                  <td style={TDs}><span style={{ color:"#374151" }}>{showClock?co(emp.attSeed,d):"—"}</span></td>
                  <td style={{ ...TDs,textAlign:"center" }}><span style={{ fontWeight:700,color:h>0?"#16a34a":"#9ca3af" }}>{h>0?fmtHs(h):"—"}</span></td>
                  <td style={{ ...TDs,textAlign:"center" }}>{showClock&&<button style={{ fontSize:12,padding:"3px 10px",borderRadius:6,border:"1px solid #dcfce7",background:"#fafafa",color:"#15803d",cursor:"pointer",fontWeight:600 }}><i className="ri-search-line"/> Details</button>}{!showClock&&<span style={{ color:"#d1d5db" }}>—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── By Hour Tab ────────────────────────────────────────────────────────────
function ByHourTab({ filtered, days }: { filtered:EmpAtt[];days:number }) {
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<DetailState|null>(null);
  React.useEffect(()=>{ setPage(1); }, [filtered]);
  const paginated = filtered.slice((page-1)*ATT_PAGE_SIZE, page*ATT_PAGE_SIZE);
  const TH: React.CSSProperties = { padding:"8px 6px",textAlign:"center",fontWeight:700,color:"#6b7280",fontSize:11,whiteSpace:"nowrap",borderBottom:"2px solid #dcfce7" };
  return (
    <>
      <div style={{ background:"#fff",borderRadius:12,border:"1px solid #dcfce7",overflow:"auto",boxShadow:"0 2px 12px rgba(22,163,74,0.06)" }}>
        <div style={{ padding:"10px 14px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap" as const,background:"#fafafa" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,fontSize:11 }}>
            <span style={{ width:18,height:18,borderRadius:4,background:"#fef9c3",border:"1px solid #fde68a",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#ca8a04" }}><i className="ri-star-line"/></span> Holiday
            <span style={{ width:18,height:18,borderRadius:4,background:"#f3f4f6",border:"1px solid #e5e7eb",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#6b7280" }}><i className="ri-close-line"/></span> Day Off / Absent
            <span style={{ padding:"0 6px",height:18,borderRadius:4,background:"#dcfce7",color:"#16a34a",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center" }}>2:41</span> Hours worked (click to expand)
          </div>
        </div>
        <table style={{ borderCollapse:"collapse",minWidth:"100%",fontSize:12 }}>
          <thead>
            <tr style={{ background:"#f0fdf4" }}>
              <th style={{ ...TH,minWidth:200,textAlign:"left",position:"sticky",left:0,background:"#f0fdf4",zIndex:2 }}>Employee</th>
              {Array.from({length:days},(_,i)=>i+1).map(d => {
                const isSun=SUNDAYS.has(d),isHol=HOLIDAYS.has(d),isToday=d===TODAY;
                return <th key={d} style={{ ...TH,minWidth:40,background:isToday?"#dcfce7":isHol?"#fef9c3":isSun?"#f9fafb":"#f0fdf4",color:isSun?"#9ca3af":isHol?"#ca8a04":isToday?"#15803d":"#6b7280" }}><div style={{ fontSize:9,fontWeight:500 }}>{DAY_SHORT[(3+d-1)%7]}</div><div style={{ fontSize:12,fontWeight:700 }}>{d}</div></th>;
              })}
              <th style={{ ...TH,minWidth:70,background:"#dcfce7",color:"#15803d" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((emp,idx) => {
              const totalH = Object.values(emp.hours).reduce((a,b)=>a+b,0);
              return (
                <tr key={emp.id} style={{ borderTop:"1px solid #f3f4f6",background:idx%2===0?"#fff":"#fafafa" }}>
                  <td style={{ padding:"8px 12px",position:"sticky",left:0,background:idx%2===0?"#fff":"#fafafa",zIndex:1,borderRight:"1px solid #dcfce7" }}><EmpCell emp={emp}/></td>
                  {Array.from({length:days},(_,i)=>i+1).map(d => {
                    const s = emp.attendance[d] ?? "-";
                    const h = emp.hours[d] || 0;
                    const isSun=SUNDAYS.has(d),isHol=HOLIDAYS.has(d);
                    const clickable = h>0 && !isSun && !isHol && d<=TODAY;
                    let cell;
                    if (d>TODAY)              cell=<span style={{ color:"#d1d5db",fontSize:11 }}>—</span>;
                    else if (isHol)           cell=<span style={{ width:24,height:24,borderRadius:4,background:"#fef9c3",color:"#ca8a04",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11 }}><i className="ri-star-line"/></span>;
                    else if (isSun||s==="DO") cell=<span style={{ width:24,height:24,borderRadius:4,background:"#f3f4f6",color:"#9ca3af",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11 }}><i className="ri-close-line"/></span>;
                    else if (s==="A")         cell=<span style={{ width:24,height:24,borderRadius:4,background:"#fee2e2",color:"#dc2626",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11 }}><i className="ri-close-line"/></span>;
                    else if (s==="OL")        cell=<span style={{ width:24,height:24,borderRadius:4,background:"#dbeafe",color:"#1d4ed8",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11 }}><i className="ri-plane-line"/></span>;
                    else if (h>0)             cell=<span style={{ padding:"2px 6px",borderRadius:4,background:"#dcfce7",color:"#16a34a",fontSize:11,fontWeight:700,whiteSpace:"nowrap",border:"1px solid #bbf7d0",cursor:"pointer" }}>{fmtHs(h)}</span>;
                    else                      cell=<span style={{ color:"#d1d5db",fontSize:11 }}>—</span>;
                    return (
                      <td key={d} onClick={clickable?()=>setDetail({emp,day:d}):undefined}
                        style={{ padding:"4px 2px",textAlign:"center",cursor:clickable?"pointer":"default",background:isSun?"rgba(249,250,251,0.6)":d===TODAY?"rgba(237,233,254,0.2)":"transparent" }}>
                        {cell}
                      </td>
                    );
                  })}
                  <td style={{ padding:"8px",textAlign:"center",fontWeight:700,color:totalH>0?"#15803d":"#9ca3af",background:"#f0fdf4" }}>{totalH>0?fmtHs(totalH):"—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <AttPager total={filtered.length} page={page} onChange={p=>{setPage(p);}} />
      {detail && <DetailModal detail={detail} onClose={()=>setDetail(null)}/>}
    </>
  );
}

// ── By Location Tab ────────────────────────────────────────────────────────
function ByLocationTab({ filtered }: { filtered: EmpAtt[] }) {
  const presentToday = filtered.filter(e => e.attendance[TODAY]==="P"||e.attendance[TODAY]==="HD");
  return (
    <div>
      <div className="row g-3" style={{ marginBottom:"1.25rem" }}>
        {[{name:"AHARNISH INFOTECH PRIVATE LIMITED (HO)",city:"Indore, MP",count:Math.floor(presentToday.length*0.7),icon:"ri-building-4-line"},{name:"Branch Office – Bhopal",city:"Bhopal, MP",count:Math.floor(presentToday.length*0.2),icon:"ri-building-4-line"},{name:"Remote / Work from Home",city:"—",count:Math.ceil(presentToday.length*0.1),icon:"ri-home-4-line"}].map((o,i)=>(
          <div key={i} className="col-md-4">
            <div style={{ background:"#fff",borderRadius:12,border:"1px solid #dcfce7",padding:"16px",boxShadow:"0 2px 8px rgba(22,163,74,0.06)" }}>
              <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
                <div style={{ width:40,height:40,borderRadius:10,background:i===2?"#f3f4f6":"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><i className={o.icon} style={{ fontSize:20,color:i===2?"#6b7280":"#15803d" }}/></div>
                <div><div style={{ fontSize:13,fontWeight:700,color:"#1e1b4b",lineHeight:1.4 }}>{o.name}</div><div style={{ fontSize:11,color:"#9ca3af",marginTop:2 }}>{o.city}</div><div style={{ marginTop:8,display:"flex",alignItems:"center",gap:6 }}><span style={{ fontSize:18,fontWeight:800,color:"#15803d" }}>{o.count}</span><span style={{ fontSize:11,color:"#9ca3af",fontWeight:600 }}>employees checked in</span></div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:"#fff",borderRadius:12,border:"1px solid #dcfce7",overflow:"hidden",boxShadow:"0 2px 12px rgba(22,163,74,0.06)" }}>
        <div style={{ padding:"14px 18px",borderBottom:"1px solid #f3f4f6" }}><span style={{ fontWeight:700,fontSize:14,color:"#1e1b4b" }}><i className="ri-map-pin-2-line" style={{ marginRight:6,color:"#15803d" }}/> Attendance by Location — Today</span></div>
        <div style={{ background:"#f0fdf4",minHeight:220,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",gap:12,padding:"2rem" }}>
          <div style={{ width:64,height:64,borderRadius:"50%",background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center" }}><i className="ri-map-2-line" style={{ fontSize:30,color:"#16a34a" }}/></div>
          <div style={{ textAlign:"center" }}><div style={{ fontWeight:700,fontSize:15,color:"#1e1b4b",marginBottom:4 }}>Map View</div><div style={{ fontSize:12,color:"#9ca3af",maxWidth:320 }}>Connect Google Maps API in Settings → Integrations to enable live location tracking.</div></div>
          <button style={{ padding:"8px 20px",borderRadius:8,border:"1.5px solid #86efac",background:"#fff",color:"#16a34a",fontSize:13,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6 }}><i className="ri-settings-3-line"/> Configure Maps API</button>
        </div>
        <div style={{ padding:"14px 18px",borderTop:"1px solid #f3f4f6" }}>
          <div style={{ fontSize:12,fontWeight:700,color:"#374151",marginBottom:10 }}>Today's Check-in ({presentToday.length} employees)</div>
          <div style={{ maxHeight:240,overflow:"auto" }}>
            {presentToday.map((emp,idx) => (
              <div key={emp.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderTop:idx>0?"1px solid #f3f4f6":"none" }}>
                <AvatarEl emp={emp} size={30}/>
                <div style={{ flex:1 }}><div style={{ fontSize:12,fontWeight:700,color:"#1e1b4b" }}>{emp.name}</div><div style={{ fontSize:11,color:"#9ca3af" }}>{emp.designation}</div></div>
                <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:20,background:"#dcfce7",color:"#16a34a",fontSize:10,fontWeight:700 }}><span style={{ width:5,height:5,borderRadius:"50%",background:"#16a34a",display:"inline-block" }}/> Office</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AttendancePage() {
  const [tab,   setTab]   = useState("summary");
  const [month, setMonth] = useState(6);
  const [year,  setYear]  = useState(2026);
  const [dept,  setDept]  = useState("All");
  const [desg,  setDesg]  = useState("All");

  const days = new Date(year, month+1, 0).getDate();
  const workDays = Array.from({length:days},(_,i)=>i+1).filter(d=>!SUNDAYS.has(d)&&!HOLIDAYS.has(d)&&d<=TODAY).length;
  const filtered = EMPLOYEES.filter(e =>
    (dept==="All"||e.department===dept) && (desg==="All"||e.designation===desg)
  );

  return (
    <div style={{ padding:"1.5rem 0" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem" }}>
        <div>
          <h4 style={{ fontSize:20,fontWeight:800,color:"#1e1b4b",margin:0 }}>Attendance</h4>
          <div style={{ fontSize:12,color:"#9ca3af",marginTop:2 }}><span>Home</span><i className="ri-arrow-right-s-line" style={{ margin:"0 4px" }}/><span style={{ color:"#15803d" }}>Attendance</span></div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"1.5px solid #dcfce7",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer" }}><i className="ri-download-2-line"/> Import</button>
          <button style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"1.5px solid #dcfce7",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer" }}><i className="ri-upload-2-line"/> Export</button>
          <button style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#15803d,#16a34a)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer" }}><i className="ri-add-line"/> Mark Attendance</button>
        </div>
      </div>

      {/* Tab bar + Filters */}
      <div style={{ background:"#fff",borderRadius:12,border:"1px solid #dcfce7",marginBottom:"1.25rem",padding:"4px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap" as const,gap:8,boxShadow:"0 2px 8px rgba(22,163,74,0.05)" }}>
        <div style={{ display:"flex",gap:2 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:500,background:tab===t.id?"#dcfce7":"transparent",color:tab===t.id?"#15803d":"#6b7280" }}>
              <i className={t.icon} style={{ fontSize:15 }}/>{t.label}
            </button>
          ))}
        </div>
        <div style={{ display:"flex",gap:10,flexWrap:"wrap" as const,alignItems:"center" }}>
          {tab!=="by-member"&&<Sel label="Dept"   value={dept} onChange={setDept} options={DEPTS}/>}
          {tab!=="by-member"&&<Sel label="Desig." value={desg} onChange={setDesg} options={DESGS}/>}
          <Sel label="Month" value={MONTHS[month]} onChange={v=>setMonth(MONTHS.indexOf(v))} options={MONTHS}/>
          <Sel label="Year"  value={String(year)}  onChange={v=>setYear(+v)}                  options={["2024","2025","2026","2027"]}/>
        </div>
      </div>

      {tab==="summary"      && <SummaryTab    filtered={filtered} days={days} workDays={workDays}/>}
      {tab==="by-member"    && <ByMemberTab   month={month} year={year}/>}
      {tab==="by-hour"      && <ByHourTab     filtered={filtered} days={days}/>}
      {tab==="by-location"  && <ByLocationTab filtered={filtered}/>}
    </div>
  );
}

const LBL: React.CSSProperties = { display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:5 };
const INP: React.CSSProperties = { width:"100%",padding:"9px 12px",fontSize:13,borderRadius:8,border:"1.5px solid #e5e7eb",outline:"none",color:"#1f2937",background:"#fafafa" };
