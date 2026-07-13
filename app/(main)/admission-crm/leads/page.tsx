"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────
type Stage = "New Enquiry" | "Contacted" | "Interested" | "Application Sent" | "Admission Confirmed";
type Source = "Walk-in" | "Website" | "Phone" | "Social Media" | "Referral" | "DHE Portal" | "School Visit";
type Temp = "Hot" | "Warm" | "Cold";

interface Lead {
  id: string; name: string; phone: string; email: string;
  course: string; source: Source; stage: Stage; temp: Temp;
  counselor: string; enquiryDate: string; lastActivity: string;
  score: number; category: string; city: string; notes: string;
}

// ── Seed data ─────────────────────────────────────────────────────
const FNAMES = ["Priya","Rahul","Anjali","Suresh","Meena","Deepak","Kavita","Arjun","Sunita","Vikram","Pooja","Karan","Nisha","Rohit","Sneha","Amit","Ritu","Sanjay","Divya","Mohit","Anita","Gaurav","Swati","Nitin","Rekha","Vishal","Shweta","Arun","Geeta","Rajan","Sapna","Hemant","Poonam","Rajesh","Neha","Sunil","Mamta","Vijay","Reena","Ashok"];
const LNAMES = ["Sharma","Verma","Patel","Kumar","Singh","Gupta","Joshi","Mehta","Tiwari","Yadav","Chauhan","Malhotra","Agarwal","Rajput","Pandey","Shah","Soni","Mishra","Dubey","Nair"];
const COURSES = ["BCA","B.Com","B.Sc","BBA","MBA","B.Tech CSE","B.Tech ECE","M.Com","MCA","M.Sc","BA","BBA LLB","B.Pharm","B.Tech Mech"];
const SOURCES: Source[] = ["Walk-in","Website","Phone","Social Media","Referral","DHE Portal","School Visit"];
const STAGES: Stage[] = ["New Enquiry","Contacted","Interested","Application Sent","Admission Confirmed"];
const COUNSELORS = ["Ananya Kapoor","Rohit Verma","Sunita Nair","Deepak Joshi","Meena Pillai"];
const CITIES = ["Indore","Bhopal","Ujjain","Jabalpur","Gwalior","Rewa","Sagar","Dewas"];
const CATEGORIES = ["General","OBC","SC","ST","EWS","Minority"];

function rnd(seed: number, max: number) { return ((seed * 1103515245 + 12345) & 0x7fffffff) % max; }

const LEADS: Lead[] = Array.from({length:80}, (_,i) => {
  const s1=rnd(i*7+1,FNAMES.length), s2=rnd(i*13+3,LNAMES.length);
  const stageIdx = rnd(i*11+2, STAGES.length);
  const score = 20 + rnd(i*17+5, 80);
  const temp: Temp = score>=70?"Hot":score>=45?"Warm":"Cold";
  const days = rnd(i*9+4, 30)+1;
  const actDays = rnd(i*3+6, days)+1;
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul"][rnd(i*19+7,7)];
  const day1 = (rnd(i*23+8,27)+1).toString().padStart(2,"0");
  const day2 = (rnd(i*29+9,actDays)+1).toString().padStart(2,"0");
  return {
    id: `LID-${(i+1).toString().padStart(4,"0")}`,
    name: `${FNAMES[s1]} ${LNAMES[s2]}`,
    phone: `+91-${9000000000+i*17+234}`,
    email: `${FNAMES[s1].toLowerCase()}${i}@email.com`,
    course: COURSES[rnd(i*31+10,COURSES.length)],
    source: SOURCES[rnd(i*37+11,SOURCES.length)],
    stage: STAGES[stageIdx],
    temp,
    counselor: COUNSELORS[rnd(i*41+12,COUNSELORS.length)],
    enquiryDate: `${day1} ${month} 2026`,
    lastActivity: `${day2} Jul 2026`,
    score,
    category: CATEGORIES[rnd(i*43+13,CATEGORIES.length)],
    city: CITIES[rnd(i*47+14,CITIES.length)],
    notes: ["Called twice, interested","Visited campus","Sent brochure","Awaiting documents","Ready to join","Needs scholarship info","Parent counseling done","Undecided"][rnd(i*53+15,8)],
  };
});

// ── Constants ─────────────────────────────────────────────────────
const STAGE_CONFIG: Record<Stage,{color:string;bg:string;icon:string;border:string}> = {
  "New Enquiry":        {color:"#6366f1",bg:"rgba(99,102,241,0.08)",  icon:"ri-user-add-line",       border:"#6366f1"},
  "Contacted":          {color:"#0284c7",bg:"rgba(2,132,199,0.08)",   icon:"ri-phone-line",           border:"#0284c7"},
  "Interested":         {color:"#d97706",bg:"rgba(217,119,6,0.08)",   icon:"ri-heart-line",           border:"#d97706"},
  "Application Sent":   {color:"#7c3aed",bg:"rgba(124,58,237,0.08)", icon:"ri-file-text-line",       border:"#7c3aed"},
  "Admission Confirmed":{color:"#16a34a",bg:"rgba(22,163,74,0.08)",  icon:"ri-checkbox-circle-line", border:"#16a34a"},
};
const TEMP_CONFIG: Record<Temp,{color:string;bg:string;icon:string}> = {
  Hot:  {color:"#dc2626",bg:"#fee2e2",icon:"ri-fire-line"},
  Warm: {color:"#d97706",bg:"#fef3c7",icon:"ri-sun-line"},
  Cold: {color:"#0284c7",bg:"#dbeafe",icon:"ri-snowy-line"},
};
const SOURCE_ICONS: Record<Source,string> = {
  "Walk-in":"ri-walk-line","Website":"ri-global-line","Phone":"ri-phone-line",
  "Social Media":"ri-instagram-line","Referral":"ri-user-shared-line",
  "DHE Portal":"ri-government-line","School Visit":"ri-school-line",
};
const ALL_COURSES = ["All Courses",...Array.from(new Set(LEADS.map(l=>l.course))).sort()];
const ALL_COUNSELORS = ["All Counselors",...COUNSELORS];
const ALL_SOURCES: string[] = ["All Sources",...SOURCES];

// ── Components ────────────────────────────────────────────────────
function ScoreBadge({score}:{score:number}) {
  const color = score>=70?"#16a34a":score>=45?"#d97706":"#6b7280";
  const bg = score>=70?"#dcfce7":score>=45?"#fef3c7":"#f3f4f6";
  return (
    <div style={{display:"flex",alignItems:"center",gap:3}}>
      <div style={{width:28,height:28,borderRadius:"50%",background:`conic-gradient(${color} ${score*3.6}deg, #f3f4f6 0deg)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color}}>{score}</div>
      </div>
    </div>
  );
}

function TempBadge({temp}:{temp:Temp}) {
  const t = TEMP_CONFIG[temp];
  return <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,background:t.bg,color:t.color,display:"inline-flex",alignItems:"center",gap:3}}><i className={t.icon}/>{temp}</span>;
}

function StagePill({stage}:{stage:Stage}) {
  const s = STAGE_CONFIG[stage];
  return <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:s.bg,color:s.color,border:`1px solid ${s.color}22`,whiteSpace:"nowrap" as const}}>{stage}</span>;
}

function KanbanCard({lead}:{lead:Lead}) {
  const sc = STAGE_CONFIG[lead.stage];
  return (
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"0.75rem",marginBottom:"0.5rem",boxShadow:"0 1px 4px rgba(0,0,0,0.04)",borderLeft:`3px solid ${sc.border}`,cursor:"pointer"}}
      onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 4px 12px rgba(124,58,237,0.10)")}
      onMouseLeave={e=>(e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)")}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div style={{fontWeight:700,fontSize:13,color:"#1e1b4b"}}>{lead.name}</div>
        <TempBadge temp={lead.temp}/>
      </div>
      <div style={{fontSize:11,color:"#6b7280",marginBottom:4}}><i className="ri-book-line" style={{marginRight:4}}/>{lead.course}</div>
      <div style={{fontSize:11,color:"#6b7280",marginBottom:6}}><i className={SOURCE_ICONS[lead.source]} style={{marginRight:4}}/>{lead.source} · {lead.city}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:10,color:"#9ca3af"}}><i className="ri-time-line" style={{marginRight:3}}/>{lead.lastActivity}</div>
        <ScoreBadge score={lead.score}/>
      </div>
      <div style={{marginTop:6,paddingTop:6,borderTop:"1px dashed #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:10,color:"#9ca3af"}}><i className="ri-user-line" style={{marginRight:3}}/>{lead.counselor.split(" ")[0]}</span>
        <span style={{fontSize:10,color:"#9ca3af"}}>{lead.phone.slice(-10)}</span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function LeadsPipelinePage() {
  const [view, setView] = useState<"kanban"|"list">("kanban");
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [counselor, setCounselor] = useState("All Counselors");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [tempFilter, setTempFilter] = useState<"All"|Temp>("All");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const filtered = useMemo(()=>LEADS.filter(l=>{
    const q = search.toLowerCase();
    const mQ = !q || l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.course.toLowerCase().includes(q) || l.id.toLowerCase().includes(q);
    const mC = course==="All Courses" || l.course===course;
    const mCo = counselor==="All Counselors" || l.counselor===counselor;
    const mS = sourceFilter==="All Sources" || l.source===sourceFilter;
    const mT = tempFilter==="All" || l.temp===tempFilter;
    return mQ&&mC&&mCo&&mS&&mT;
  }),[search,course,counselor,sourceFilter,tempFilter]);

  const byStage = useMemo(()=>Object.fromEntries(STAGES.map(s=>[s,filtered.filter(l=>l.stage===s)])),[filtered]);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const pages = Math.ceil(filtered.length/PAGE_SIZE);

  const kpis = [
    {label:"Total Leads",value:LEADS.length,icon:"ri-user-3-line",color:"#7c3aed",bg:"rgba(124,58,237,0.1)"},
    {label:"Hot Leads",value:LEADS.filter(l=>l.temp==="Hot").length,icon:"ri-fire-line",color:"#dc2626",bg:"rgba(220,38,38,0.1)"},
    {label:"New Today",value:12,icon:"ri-user-add-line",color:"#0284c7",bg:"rgba(2,132,199,0.1)"},
    {label:"Converted",value:LEADS.filter(l=>l.stage==="Admission Confirmed").length,icon:"ri-checkbox-circle-line",color:"#16a34a",bg:"rgba(22,163,74,0.1)"},
    {label:"Avg Score",value:Math.round(LEADS.reduce((a,l)=>a+l.score,0)/LEADS.length),icon:"ri-bar-chart-line",color:"#d97706",bg:"rgba(217,119,6,0.1)"},
    {label:"App Sent",value:LEADS.filter(l=>l.stage==="Application Sent").length,icon:"ri-file-text-line",color:"#6366f1",bg:"rgba(99,102,241,0.1)"},
  ];

  const SL: React.CSSProperties = {padding:"7px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:12,background:"#fafafa",color:"#374151",outline:"none",cursor:"pointer"};
  const VB = (active:boolean):React.CSSProperties => ({padding:"6px 12px",borderRadius:7,border:"1.5px solid "+(active?"#7c3aed":"#e5e7eb"),background:active?"#7c3aed":"#fff",color:active?"#fff":"#6b7280",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5});

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h4 style={{fontSize:18,fontWeight:800,color:"var(--default-text-color)",marginBottom:2}}>Lead Pipeline</h4>
          <nav><ol className="breadcrumb mb-0" style={{fontSize:12}}>
            <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item active">Lead Pipeline</li>
          </ol></nav>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button style={{padding:"7px 14px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#374151"}}>
            <i className="ri-download-2-line"/>Export
          </button>
          <button style={{padding:"7px 14px",borderRadius:8,border:"none",background:"#7c3aed",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <i className="ri-add-line"/>Add Lead
          </button>
        </div>
      </div>

      {/* KPI Strip */}
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

      {/* Filters + View Toggle */}
      <div className="card custom-card mb-0" style={{padding:"0.875rem 1rem",marginBottom:"1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" as const}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <i className="ri-search-line" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9ca3af",fontSize:14}}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search name, phone, ID, course…"
              style={{width:"100%",padding:"7px 10px 7px 32px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:12,outline:"none",background:"#fafafa"}}/>
          </div>
          <select value={course} onChange={e=>{setCourse(e.target.value);setPage(1);}} style={SL}>
            {ALL_COURSES.map(c=><option key={c}>{c}</option>)}
          </select>
          <select value={counselor} onChange={e=>{setCounselor(e.target.value);setPage(1);}} style={SL}>
            {ALL_COUNSELORS.map(c=><option key={c}>{c}</option>)}
          </select>
          <select value={sourceFilter} onChange={e=>{setSourceFilter(e.target.value);setPage(1);}} style={SL}>
            {ALL_SOURCES.map(s=><option key={s}>{s}</option>)}
          </select>
          <div style={{display:"flex",gap:4}}>
            {(["All","Hot","Warm","Cold"] as const).map(t=>(
              <button key={t} onClick={()=>{setTempFilter(t);setPage(1);}} style={{
                padding:"5px 10px",borderRadius:20,border:"1.5px solid "+(tempFilter===t?"#7c3aed":"#e5e7eb"),
                background:tempFilter===t?"#7c3aed":"#fff",color:tempFilter===t?"#fff":"#6b7280",
                fontSize:11,fontWeight:600,cursor:"pointer"
              }}>{t}</button>
            ))}
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:6}}>
            <button onClick={()=>setView("kanban")} style={VB(view==="kanban")}><i className="ri-layout-column-line"/>Kanban</button>
            <button onClick={()=>setView("list")} style={VB(view==="list")}><i className="ri-list-check"/>List</button>
          </div>
        </div>
        <div style={{marginTop:8,fontSize:12,color:"#9ca3af"}}>
          Showing <strong style={{color:"#374151"}}>{filtered.length}</strong> of {LEADS.length} leads
          {search||course!=="All Courses"||counselor!=="All Counselors"||sourceFilter!=="All Sources"||tempFilter!=="All"
            ? <button onClick={()=>{setSearch("");setCourse("All Courses");setCounselor("All Counselors");setSourceFilter("All Sources");setTempFilter("All");}} style={{marginLeft:8,fontSize:11,color:"#dc2626",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Clear Filters</button>
            : null}
        </div>
      </div>

      {/* ── KANBAN VIEW ── */}
      {view==="kanban" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"0.875rem",alignItems:"start"}}>
          {STAGES.map(stage=>{
            const sc = STAGE_CONFIG[stage];
            const leads = byStage[stage]??[];
            return (
              <div key={stage}>
                {/* Column header */}
                <div style={{padding:"0.625rem 0.875rem",borderRadius:"10px 10px 0 0",background:sc.bg,border:`1px solid ${sc.color}22`,borderBottom:"none",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <i className={sc.icon} style={{fontSize:14,color:sc.color}}/>
                    <span style={{fontSize:12,fontWeight:700,color:sc.color}}>{stage}</span>
                  </div>
                  <span style={{fontSize:11,fontWeight:800,background:sc.color,color:"#fff",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>{leads.length}</span>
                </div>
                {/* Cards */}
                <div style={{background:"#f8f7ff",border:`1px solid ${sc.color}22`,borderRadius:"0 0 10px 10px",padding:"0.625rem",minHeight:200,maxHeight:"calc(100vh - 340px)",overflowY:"auto" as const}}>
                  {leads.length===0
                    ? <div style={{textAlign:"center",padding:"1.5rem 0",color:"#d1d5db",fontSize:12}}>No leads</div>
                    : leads.map(l=><KanbanCard key={l.id} lead={l}/>)
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {view==="list" && (
        <div className="card custom-card mb-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{fontSize:13}}>
                <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
                  <tr>
                    {["Lead ID","Name","Course","Source","Stage","Temp","Score","Counselor","Last Activity","Actions"].map(h=>(
                      <th key={h} style={{padding:"10px 14px",fontWeight:700,fontSize:11,color:"#6b7280",whiteSpace:"nowrap" as const}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map(l=>(
                    <tr key={l.id} style={{borderBottom:"1px solid #f3f4f6"}}>
                      <td style={{padding:"10px 14px"}}><span style={{fontFamily:"monospace",fontSize:11,color:"#7c3aed",fontWeight:700}}>{l.id}</span></td>
                      <td style={{padding:"10px 14px"}}>
                        <div style={{fontWeight:700,color:"#1e1b4b",fontSize:13}}>{l.name}</div>
                        <div style={{fontSize:11,color:"#9ca3af"}}>{l.phone}</div>
                      </td>
                      <td style={{padding:"10px 14px",fontSize:12,color:"#374151"}}>{l.course}</td>
                      <td style={{padding:"10px 14px"}}>
                        <span style={{fontSize:11,display:"flex",alignItems:"center",gap:4,color:"#6b7280"}}>
                          <i className={SOURCE_ICONS[l.source]}/>{l.source}
                        </span>
                      </td>
                      <td style={{padding:"10px 14px"}}><StagePill stage={l.stage}/></td>
                      <td style={{padding:"10px 14px"}}><TempBadge temp={l.temp}/></td>
                      <td style={{padding:"10px 14px"}}><ScoreBadge score={l.score}/></td>
                      <td style={{padding:"10px 14px",fontSize:12,color:"#374151"}}>{l.counselor.split(" ")[0]}</td>
                      <td style={{padding:"10px 14px",fontSize:11,color:"#9ca3af"}}>{l.lastActivity}</td>
                      <td style={{padding:"10px 14px"}}>
                        <div style={{display:"flex",gap:5}}>
                          <button title="Call" style={{width:28,height:28,borderRadius:6,border:"1px solid #e5e7eb",background:"#f0fdf4",color:"#16a34a",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-phone-line" style={{fontSize:12}}/></button>
                          <button title="Follow Up" style={{width:28,height:28,borderRadius:6,border:"1px solid #e5e7eb",background:"#eff6ff",color:"#2563eb",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-calendar-line" style={{fontSize:12}}/></button>
                          <button title="Move Stage" style={{width:28,height:28,borderRadius:6,border:"1px solid #e5e7eb",background:"#faf5ff",color:"#7c3aed",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-arrow-right-line" style={{fontSize:12}}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paged.length===0 && (
                    <tr><td colSpan={10} style={{textAlign:"center",padding:"3rem",color:"#9ca3af"}}>
                      <i className="ri-search-line" style={{fontSize:28,display:"block",marginBottom:8}}/>No leads found
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {pages>1 && (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.75rem 1rem",borderTop:"1px solid #f3f4f6"}}>
                <span style={{fontSize:12,color:"#9ca3af"}}>Page {page} of {pages} · {filtered.length} leads</span>
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
          </div>
        </div>
      )}
    </div>
  );
}
