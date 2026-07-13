"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────
type SessionStatus = "Scheduled" | "In Progress" | "Completed" | "No Show" | "Rescheduled" | "Cancelled";
type Mode = "In-Person" | "Phone" | "Video Call";

interface Session {
  id: string; studentName: string; phone: string; course: string;
  counselor: string; date: string; time: string; mode: Mode;
  status: SessionStatus; outcome: string; duration: number; notes: string;
  source: string; category: string; followUpNeeded: boolean;
}

// ── Data ──────────────────────────────────────────────────────────
const FNAMES = ["Priya","Rahul","Anjali","Suresh","Meena","Deepak","Kavita","Arjun","Sunita","Vikram","Pooja","Karan","Nisha","Rohit","Sneha","Amit","Ritu","Sanjay","Divya","Mohit","Anita","Gaurav","Swati","Nitin","Rekha","Vishal","Shweta","Arun","Geeta","Rajan"];
const LNAMES = ["Sharma","Verma","Patel","Kumar","Singh","Gupta","Joshi","Mehta","Tiwari","Yadav","Chauhan","Malhotra","Agarwal","Rajput","Pandey","Shah","Soni","Mishra","Dubey","Nair"];
const COURSES = ["BCA","B.Com","B.Sc","BBA","MBA","B.Tech CSE","B.Tech ECE","M.Com","MCA","M.Sc","B.Pharm","BBA LLB"];
const COUNSELORS = ["Ananya Kapoor","Rohit Verma","Sunita Nair","Deepak Joshi","Meena Pillai"];
const STATUSES: SessionStatus[] = ["Scheduled","In Progress","Completed","No Show","Rescheduled","Cancelled"];
const MODES: Mode[] = ["In-Person","Phone","Video Call"];
const OUTCOMES = ["Highly Interested","Will Discuss with Parents","Needs Scholarship Info","Sent Brochure","Admission Confirmed","Not Interested","Call Back Later","Needs More Time","Application Shared","Documents Requested"];
const SOURCES = ["Walk-in","Website","Phone","Social Media","Referral","DHE Portal"];
const TIMES = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM"];
const DATES = ["14 Jul 2026","14 Jul 2026","14 Jul 2026","14 Jul 2026","14 Jul 2026","14 Jul 2026","14 Jul 2026","14 Jul 2026","15 Jul 2026","15 Jul 2026","15 Jul 2026","15 Jul 2026","16 Jul 2026","16 Jul 2026","17 Jul 2026","17 Jul 2026","18 Jul 2026","12 Jul 2026","12 Jul 2026","13 Jul 2026","13 Jul 2026","13 Jul 2026","11 Jul 2026","11 Jul 2026","10 Jul 2026","10 Jul 2026","09 Jul 2026","09 Jul 2026","08 Jul 2026","07 Jul 2026"];

function rnd(seed: number, max: number) { return ((seed * 1103515245 + 12345) & 0x7fffffff) % max; }

const SESSIONS: Session[] = Array.from({length:60}, (_,i) => {
  const stIdx = rnd(i*7+2,STATUSES.length);
  return {
    id: `CS-${(i+1).toString().padStart(4,"0")}`,
    studentName: `${FNAMES[rnd(i*7+1,FNAMES.length)]} ${LNAMES[rnd(i*13+3,LNAMES.length)]}`,
    phone: `+91-${9800000000+i*23+100}`,
    course: COURSES[rnd(i*17+5,COURSES.length)],
    counselor: COUNSELORS[rnd(i*11+6,COUNSELORS.length)],
    date: DATES[i % DATES.length],
    time: TIMES[rnd(i*19+7,TIMES.length)],
    mode: MODES[rnd(i*23+8,MODES.length)],
    status: STATUSES[stIdx],
    outcome: OUTCOMES[rnd(i*29+9,OUTCOMES.length)],
    duration: [20,30,45,60,90][rnd(i*31+10,5)],
    notes: ["Student very keen, follow up in 2 days","Parents want to visit campus","Scholarship eligibility confirmed","Brochure sent via WhatsApp","Application form shared","Requested fee structure details"][rnd(i*37+11,6)],
    source: SOURCES[rnd(i*41+12,SOURCES.length)],
    category: ["General","OBC","SC","ST","EWS"][rnd(i*43+13,5)],
    followUpNeeded: rnd(i*47+14,3)>0,
  };
});

// ── Counselor stats ───────────────────────────────────────────────
const COUNSELOR_STATS = COUNSELORS.map(name => {
  const mine = SESSIONS.filter(s=>s.counselor===name);
  const completed = mine.filter(s=>s.status==="Completed").length;
  const converted = mine.filter(s=>s.outcome==="Admission Confirmed").length;
  return { name, total:mine.length, completed, noShow:mine.filter(s=>s.status==="No Show").length, converted, rate:mine.length?Math.round(converted/mine.length*100):0 };
});

// ── Config ────────────────────────────────────────────────────────
const STATUS_CFG: Record<SessionStatus,{color:string;bg:string;border:string}> = {
  "Scheduled":   {color:"#6366f1",bg:"rgba(99,102,241,0.1)",  border:"#6366f120"},
  "In Progress": {color:"#d97706",bg:"rgba(217,119,6,0.1)",   border:"#d9770620"},
  "Completed":   {color:"#16a34a",bg:"rgba(22,163,74,0.1)",   border:"#16a34a20"},
  "No Show":     {color:"#dc2626",bg:"rgba(220,38,38,0.1)",   border:"#dc262620"},
  "Rescheduled": {color:"#7c3aed",bg:"rgba(124,58,237,0.1)", border:"#7c3aed20"},
  "Cancelled":   {color:"#6b7280",bg:"rgba(107,114,128,0.1)","border":"#6b728020"},
};
const MODE_CFG: Record<Mode,{icon:string;color:string}> = {
  "In-Person":  {icon:"ri-user-line",    color:"#7c3aed"},
  "Phone":      {icon:"ri-phone-line",   color:"#0284c7"},
  "Video Call": {icon:"ri-vidicon-line", color:"#16a34a"},
};

// ── Page ──────────────────────────────────────────────────────────
export default function CounselingPage() {
  const [tab, setTab] = useState<"today"|"upcoming"|"all"|"performance">("today");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SessionStatus|"All">("All");
  const [counselorFilter, setCounselorFilter] = useState("All Counselors");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const TODAY = "14 Jul 2026";
  const todaySessions = useMemo(()=>SESSIONS.filter(s=>s.date===TODAY),[]);
  const upcomingSessions = useMemo(()=>SESSIONS.filter(s=>s.date>TODAY),[]);

  const filtered = useMemo(()=>{
    let base = tab==="today"?todaySessions : tab==="upcoming"?upcomingSessions : SESSIONS;
    const q = search.toLowerCase();
    if(q) base = base.filter(s=>s.studentName.toLowerCase().includes(q)||s.course.toLowerCase().includes(q)||s.id.toLowerCase().includes(q));
    if(statusFilter!=="All") base = base.filter(s=>s.status===statusFilter);
    if(counselorFilter!=="All Counselors") base = base.filter(s=>s.counselor===counselorFilter);
    return base;
  },[tab,search,statusFilter,counselorFilter,todaySessions,upcomingSessions]);

  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const pages = Math.ceil(filtered.length/PAGE_SIZE);

  const kpis = [
    {label:"Today's Sessions",value:todaySessions.length,icon:"ri-calendar-2-line",color:"#7c3aed",bg:"rgba(124,58,237,0.1)"},
    {label:"Completed",value:SESSIONS.filter(s=>s.status==="Completed").length,icon:"ri-checkbox-circle-line",color:"#16a34a",bg:"rgba(22,163,74,0.1)"},
    {label:"In Progress",value:SESSIONS.filter(s=>s.status==="In Progress").length,icon:"ri-loader-4-line",color:"#d97706",bg:"rgba(217,119,6,0.1)"},
    {label:"No Shows",value:SESSIONS.filter(s=>s.status==="No Show").length,icon:"ri-user-unfollow-line",color:"#dc2626",bg:"rgba(220,38,38,0.1)"},
    {label:"Conversions",value:SESSIONS.filter(s=>s.outcome==="Admission Confirmed").length,icon:"ri-trophy-line",color:"#0284c7",bg:"rgba(2,132,199,0.1)"},
    {label:"Avg Duration",value:"42 min",icon:"ri-time-line",color:"#6366f1",bg:"rgba(99,102,241,0.1)"},
  ];

  const TABS = [
    {key:"today",label:"Today",count:todaySessions.length,icon:"ri-calendar-today-line"},
    {key:"upcoming",label:"Upcoming",count:upcomingSessions.length,icon:"ri-calendar-line"},
    {key:"all",label:"All Sessions",count:SESSIONS.length,icon:"ri-list-check"},
    {key:"performance",label:"Counselor Performance",count:null,icon:"ri-bar-chart-line"},
  ] as const;

  const SL: React.CSSProperties = {padding:"6px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:12,background:"#fafafa",color:"#374151",outline:"none"};

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h4 style={{fontSize:18,fontWeight:800,color:"var(--default-text-color)",marginBottom:2}}>Counseling Sessions</h4>
          <nav><ol className="breadcrumb mb-0" style={{fontSize:12}}>
            <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item active">Counseling</li>
          </ol></nav>
        </div>
        <div className="d-flex gap-2">
          <button style={{padding:"7px 14px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#374151"}}><i className="ri-download-2-line"/>Export</button>
          <button style={{padding:"7px 14px",borderRadius:8,border:"none",background:"#7c3aed",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><i className="ri-add-line"/>Schedule Session</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"0.75rem",marginBottom:"1.25rem"}}>
        {kpis.map(k=>(
          <div key={k.label} className="card custom-card mb-0" style={{padding:"0.875rem 1rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:k.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <i className={k.icon} style={{fontSize:16,color:k.color}}/>
              </div>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:"var(--default-text-color)",lineHeight:1}}>{k.value}</div>
                <div style={{fontSize:11,color:"var(--text-muted)",marginTop:2}}>{k.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card custom-card mb-0" style={{marginBottom:"1rem"}}>
        <div style={{borderBottom:"1px solid var(--default-border)",padding:"0 1rem",display:"flex",gap:0,overflowX:"auto" as const}}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>{setTab(t.key as any);setPage(1);}} style={{
              padding:"11px 16px",background:"none",border:"none",cursor:"pointer",whiteSpace:"nowrap" as const,fontSize:13,
              fontWeight:tab===t.key?700:500,color:tab===t.key?"#7c3aed":"#6b7280",
              borderBottom:tab===t.key?"2px solid #7c3aed":"2px solid transparent",marginBottom:-1,
              display:"flex",alignItems:"center",gap:6,
            }}>
              <i className={t.icon} style={{fontSize:13}}/>{t.label}
              {t.count!==null&&<span style={{background:tab===t.key?"#7c3aed":"#f3f4f6",color:tab===t.key?"#fff":"#6b7280",fontSize:10,fontWeight:700,borderRadius:20,padding:"1px 6px"}}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* Filters — hidden on performance tab */}
        {tab!=="performance" && (
          <div style={{padding:"0.75rem 1rem",borderBottom:"1px solid #f3f4f6",display:"flex",gap:8,flexWrap:"wrap" as const,alignItems:"center"}}>
            <div style={{position:"relative",flex:1,minWidth:180}}>
              <i className="ri-search-line" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9ca3af",fontSize:13}}/>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search student, course, session ID…"
                style={{width:"100%",padding:"6px 10px 6px 30px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:12,outline:"none",background:"#fafafa"}}/>
            </div>
            <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value as any);setPage(1);}} style={SL}>
              <option>All</option>
              {STATUSES.map(s=><option key={s}>{s}</option>)}
            </select>
            <select value={counselorFilter} onChange={e=>{setCounselorFilter(e.target.value);setPage(1);}} style={SL}>
              <option>All Counselors</option>
              {COUNSELORS.map(c=><option key={c}>{c}</option>)}
            </select>
            <span style={{marginLeft:"auto",fontSize:12,color:"#9ca3af"}}>{filtered.length} sessions</span>
          </div>
        )}

        {/* ── SESSION TABLE ── */}
        {tab!=="performance" && (
          <>
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{fontSize:13}}>
                <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
                  <tr>
                    {["ID","Student","Course","Date & Time","Mode","Counselor","Duration","Status","Outcome","Actions"].map(h=>(
                      <th key={h} style={{padding:"10px 14px",fontWeight:700,fontSize:11,color:"#6b7280",whiteSpace:"nowrap" as const}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map(s=>{
                    const sc = STATUS_CFG[s.status];
                    const mc = MODE_CFG[s.mode];
                    return (
                      <tr key={s.id} style={{borderBottom:"1px solid #f9fafb"}}>
                        <td style={{padding:"10px 14px"}}><span style={{fontFamily:"monospace",fontSize:11,color:"#7c3aed",fontWeight:700}}>{s.id}</span></td>
                        <td style={{padding:"10px 14px"}}>
                          <div style={{fontWeight:700,color:"#1e1b4b",fontSize:13}}>{s.studentName}</div>
                          <div style={{fontSize:11,color:"#9ca3af"}}>{s.phone}</div>
                        </td>
                        <td style={{padding:"10px 14px",fontSize:12,color:"#374151"}}>{s.course}</td>
                        <td style={{padding:"10px 14px"}}>
                          <div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{s.date}</div>
                          <div style={{fontSize:11,color:"#9ca3af"}}>{s.time}</div>
                        </td>
                        <td style={{padding:"10px 14px"}}>
                          <span style={{fontSize:11,display:"flex",alignItems:"center",gap:4,color:mc.color,fontWeight:600}}>
                            <i className={mc.icon}/>{s.mode}
                          </span>
                        </td>
                        <td style={{padding:"10px 14px",fontSize:12,color:"#374151"}}>{s.counselor.split(" ")[0]}</td>
                        <td style={{padding:"10px 14px",fontSize:12,color:"#374151"}}>{s.duration} min</td>
                        <td style={{padding:"10px 14px"}}>
                          <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`,whiteSpace:"nowrap" as const}}>{s.status}</span>
                        </td>
                        <td style={{padding:"10px 14px",fontSize:11,color:"#6b7280",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}} title={s.outcome}>{s.outcome}</td>
                        <td style={{padding:"10px 14px"}}>
                          <div style={{display:"flex",gap:4}}>
                            <button title="Notes" style={{width:27,height:27,borderRadius:6,border:"1px solid #e5e7eb",background:"#f5f3ff",color:"#7c3aed",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-sticky-note-line" style={{fontSize:11}}/></button>
                            <button title="Reschedule" style={{width:27,height:27,borderRadius:6,border:"1px solid #e5e7eb",background:"#eff6ff",color:"#2563eb",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-calendar-line" style={{fontSize:11}}/></button>
                            <button title="Mark Converted" style={{width:27,height:27,borderRadius:6,border:"1px solid #e5e7eb",background:"#f0fdf4",color:"#16a34a",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-checkbox-circle-line" style={{fontSize:11}}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paged.length===0 && (
                    <tr><td colSpan={10} style={{textAlign:"center",padding:"3rem",color:"#9ca3af"}}>
                      <i className="ri-calendar-2-line" style={{fontSize:28,display:"block",marginBottom:8}}/>No sessions found
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {pages>1 && (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.75rem 1rem",borderTop:"1px solid #f3f4f6"}}>
                <span style={{fontSize:12,color:"#9ca3af"}}>Page {page} of {pages}</span>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #e5e7eb",background:"#fff",fontSize:12,cursor:"pointer",color:page===1?"#d1d5db":"#374151"}}>Prev</button>
                  {Array.from({length:Math.min(5,pages)},(_,i)=>{
                    const pg=page<=3?i+1:page>=pages-2?pages-4+i:page-2+i;
                    if(pg<1||pg>pages) return null;
                    return <button key={pg} onClick={()=>setPage(pg)} style={{width:30,height:30,borderRadius:6,border:"1.5px solid "+(pg===page?"#7c3aed":"#e5e7eb"),background:pg===page?"#7c3aed":"#fff",color:pg===page?"#fff":"#374151",fontSize:12,cursor:"pointer",fontWeight:pg===page?700:400}}>{pg}</button>;
                  })}
                  <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #e5e7eb",background:"#fff",fontSize:12,cursor:"pointer",color:page===pages?"#d1d5db":"#374151"}}>Next</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PERFORMANCE TAB ── */}
        {tab==="performance" && (
          <div style={{padding:"1.25rem"}}>
            <div style={{marginBottom:"1.25rem",display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"0.75rem"}}>
              {COUNSELOR_STATS.map(cs=>(
                <div key={cs.name} style={{border:"1px solid #e5e7eb",borderRadius:12,padding:"1rem",background:"#fafafa"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"0.875rem"}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(124,58,237,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:13,fontWeight:800,color:"#7c3aed"}}>{cs.name.split(" ").map((w:string)=>w[0]).join("")}</span>
                    </div>
                    <div>
                      <div style={{fontWeight:700,fontSize:12,color:"#1e1b4b"}}>{cs.name.split(" ")[0]}</div>
                      <div style={{fontSize:10,color:"#9ca3af"}}>Counselor</div>
                    </div>
                  </div>
                  {[["Total Sessions",cs.total,"#6366f1"],["Completed",cs.completed,"#16a34a"],["No Shows",cs.noShow,"#dc2626"],["Converted",cs.converted,"#7c3aed"]].map(([lbl,val,col])=>(
                    <div key={String(lbl)} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px dashed #f3f4f6",fontSize:12}}>
                      <span style={{color:"#6b7280"}}>{lbl}</span>
                      <span style={{fontWeight:700,color:String(col)}}>{val}</span>
                    </div>
                  ))}
                  <div style={{marginTop:"0.75rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:11,color:"#6b7280"}}>Conversion Rate</span>
                      <span style={{fontSize:11,fontWeight:800,color:cs.rate>=30?"#16a34a":cs.rate>=15?"#d97706":"#dc2626"}}>{cs.rate}%</span>
                    </div>
                    <div style={{height:5,borderRadius:999,background:"#f3f4f6",overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:999,width:`${cs.rate}%`,background:cs.rate>=30?"#16a34a":cs.rate>=15?"#d97706":"#dc2626"}}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed performance table */}
            <div style={{border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"0.75rem 1rem",background:"#f9fafb",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",gap:8}}>
                <i className="ri-bar-chart-grouped-line" style={{color:"#7c3aed"}}/>
                <span style={{fontWeight:700,fontSize:13}}>Session Outcome Breakdown</span>
              </div>
              <div className="table-responsive">
                <table className="table mb-0" style={{fontSize:12}}>
                  <thead style={{background:"#f9fafb"}}>
                    <tr>
                      {["Counselor","Scheduled","In Progress","Completed","No Show","Rescheduled","Cancelled","Conversion %"].map(h=>(
                        <th key={h} style={{padding:"9px 14px",fontWeight:700,fontSize:11,color:"#6b7280",whiteSpace:"nowrap" as const}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COUNSELORS.map(name=>{
                      const mine = SESSIONS.filter(s=>s.counselor===name);
                      const byStatus = (st:SessionStatus) => mine.filter(s=>s.status===st).length;
                      const conv = mine.length?Math.round(mine.filter(s=>s.outcome==="Admission Confirmed").length/mine.length*100):0;
                      return (
                        <tr key={name} style={{borderBottom:"1px solid #f3f4f6"}}>
                          <td style={{padding:"10px 14px",fontWeight:700,color:"#1e1b4b"}}>{name}</td>
                          {(["Scheduled","In Progress","Completed","No Show","Rescheduled","Cancelled"] as SessionStatus[]).map(st=>(
                            <td key={st} style={{padding:"10px 14px"}}>
                              <span style={{fontSize:11,fontWeight:700,color:STATUS_CFG[st].color,background:STATUS_CFG[st].bg,padding:"2px 7px",borderRadius:20}}>{byStatus(st)}</span>
                            </td>
                          ))}
                          <td style={{padding:"10px 14px"}}>
                            <span style={{fontWeight:800,fontSize:13,color:conv>=30?"#16a34a":conv>=15?"#d97706":"#dc2626"}}>{conv}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
