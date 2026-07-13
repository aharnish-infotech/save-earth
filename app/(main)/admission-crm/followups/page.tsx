"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────
type FUStatus = "Pending" | "Contacted" | "Converted" | "No Response" | "Rescheduled";
type Priority = "Critical" | "High" | "Medium" | "Low";
type DueBucket = "Overdue" | "Due Today" | "Upcoming" | "All";

interface FollowUp {
  id: string; studentName: string; phone: string; email: string;
  course: string; counselor: string; enquiryDate: string;
  lastContact: string; nextFollowUp: string; dueLabel: string;
  status: FUStatus; priority: Priority; attempts: number; maxAttempts: number;
  notes: string; source: string; stage: string; daysOverdue: number;
}

// ── Data ──────────────────────────────────────────────────────────
const FNAMES=["Priya","Rahul","Anjali","Suresh","Meena","Deepak","Kavita","Arjun","Sunita","Vikram","Pooja","Karan","Nisha","Rohit","Sneha","Amit","Ritu","Sanjay","Divya","Mohit","Anita","Gaurav","Swati","Nitin","Rekha","Vishal","Shweta","Arun","Geeta","Rajan","Sapna","Hemant","Poonam","Rajesh","Neha","Sunil","Mamta","Vijay","Reena","Ashok","Usha","Prakash","Lata","Mahesh","Seema","Rakesh","Manju","Dinesh","Asha","Naresh"];
const LNAMES=["Sharma","Verma","Patel","Kumar","Singh","Gupta","Joshi","Mehta","Tiwari","Yadav","Chauhan","Malhotra","Agarwal","Rajput","Pandey","Shah","Soni","Mishra","Dubey","Nair","Pillai","Reddy","Iyer","Chopra","Bose","Das","Ghosh","Roy","Sen","Mukherjee"];
const COURSES=["BCA","B.Com","B.Sc","BBA","MBA","B.Tech CSE","B.Tech ECE","M.Com","MCA","M.Sc","BA","BBA LLB","B.Pharm","B.Tech Mech"];
const COUNSELORS=["Ananya Kapoor","Rohit Verma","Sunita Nair","Deepak Joshi","Meena Pillai"];
const STATUSES:FUStatus[]=["Pending","Contacted","Converted","No Response","Rescheduled"];
const PRIORITIES:Priority[]=["Critical","High","Medium","Low"];
const STAGES=["New Enquiry","Contacted","Interested","Application Sent"];
const SOURCES=["Walk-in","Website","Phone","Social Media","Referral"];
const DUE_DATES = ["08 Jul 2026","09 Jul 2026","10 Jul 2026","11 Jul 2026","12 Jul 2026","13 Jul 2026","14 Jul 2026","14 Jul 2026","14 Jul 2026","15 Jul 2026","16 Jul 2026","17 Jul 2026","18 Jul 2026","19 Jul 2026","20 Jul 2026"];
const NOTES=["Called twice, no response","Interested, waiting for parents approval","Needs scholarship info urgently","Left voicemail","WhatsApp message sent","Visited campus, very interested","Application partially filled","Requested fee structure","College brochure sent","Awaiting documents","Will call back tomorrow","Seems interested in BCA","Asked about hostel facility","Wants to compare with other colleges","Parents want to visit"];

function rnd(seed:number,max:number){return((seed*1103515245+12345)&0x7fffffff)%max;}

const TODAY="14 Jul 2026";
const FOLLOWUPS:FollowUp[]=Array.from({length:75},(_,i)=>{
  const due=DUE_DATES[rnd(i*7+1,DUE_DATES.length)];
  const daysOverdue=due<TODAY?rnd(i*11+2,15)+1:0;
  const bucket:DueBucket=due<TODAY?"Overdue":due===TODAY?"Due Today":"Upcoming";
  const priority:Priority=daysOverdue>7?"Critical":daysOverdue>0?"High":bucket==="Due Today"?"High":PRIORITIES[rnd(i*13+3,PRIORITIES.length)];
  const attempts=rnd(i*17+4,5)+1;
  return {
    id:`FU-${(i+1).toString().padStart(4,"0")}`,
    studentName:`${FNAMES[rnd(i*7+1,FNAMES.length)]} ${LNAMES[rnd(i*13+3,LNAMES.length)]}`,
    phone:`+91-${9700000000+i*31+555}`,
    email:`student${i}@email.com`,
    course:COURSES[rnd(i*19+5,COURSES.length)],
    counselor:COUNSELORS[rnd(i*23+6,COUNSELORS.length)],
    enquiryDate:`${(rnd(i*29+7,25)+1).toString().padStart(2,"0")} Jun 2026`,
    lastContact:`${(rnd(i*31+8,13)+1).toString().padStart(2,"0")} Jul 2026`,
    nextFollowUp:due,
    dueLabel:bucket,
    status:STATUSES[rnd(i*37+9,STATUSES.length)],
    priority,
    attempts,
    maxAttempts:6,
    notes:NOTES[rnd(i*41+10,NOTES.length)],
    source:SOURCES[rnd(i*43+11,SOURCES.length)],
    stage:STAGES[rnd(i*47+12,STAGES.length)],
    daysOverdue,
  };
});

// ── Config ────────────────────────────────────────────────────────
const PRIO_CFG:Record<Priority,{color:string;bg:string;border:string}> = {
  Critical:{color:"#dc2626",bg:"#fee2e2",border:"#fca5a5"},
  High:    {color:"#d97706",bg:"#fef3c7",border:"#fcd34d"},
  Medium:  {color:"#6366f1",bg:"rgba(99,102,241,0.1)",border:"#a5b4fc"},
  Low:     {color:"#6b7280",bg:"#f3f4f6",border:"#d1d5db"},
};
const STATUS_CFG:Record<FUStatus,{color:string;bg:string}> = {
  "Pending":     {color:"#6366f1",bg:"rgba(99,102,241,0.1)"},
  "Contacted":   {color:"#0284c7",bg:"rgba(2,132,199,0.1)"},
  "Converted":   {color:"#16a34a",bg:"rgba(22,163,74,0.1)"},
  "No Response": {color:"#dc2626",bg:"rgba(220,38,38,0.1)"},
  "Rescheduled": {color:"#7c3aed",bg:"rgba(124,58,237,0.1)"},
};
const BUCKET_CFG:Record<string,{color:string;bg:string;icon:string}> = {
  "Overdue":  {color:"#dc2626",bg:"#fee2e2",icon:"ri-alarm-warning-line"},
  "Due Today":{color:"#d97706",bg:"#fef3c7",icon:"ri-time-line"},
  "Upcoming": {color:"#0284c7",bg:"#dbeafe",icon:"ri-calendar-line"},
};

function AttemptDots({done,max}:{done:number;max:number}) {
  return (
    <div style={{display:"flex",gap:2,alignItems:"center"}}>
      {Array.from({length:max},(_,i)=>(
        <div key={i} style={{width:7,height:7,borderRadius:"50%",background:i<done?"#7c3aed":"#e5e7eb"}}/>
      ))}
      <span style={{fontSize:10,color:"#9ca3af",marginLeft:3}}>{done}/{max}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function FollowUpsPage() {
  const [bucket,setBucket]=useState<DueBucket>("All");
  const [search,setSearch]=useState("");
  const [prioFilter,setPrioFilter]=useState<Priority|"All">("All");
  const [statusFilter,setStatusFilter]=useState<FUStatus|"All">("All");
  const [counselorFilter,setCounselorFilter]=useState("All Counselors");
  const [page,setPage]=useState(1);
  const PAGE_SIZE=15;

  const overdue  = useMemo(()=>FOLLOWUPS.filter(f=>f.dueLabel==="Overdue"),[]);
  const dueToday = useMemo(()=>FOLLOWUPS.filter(f=>f.dueLabel==="Due Today"),[]);
  const upcoming = useMemo(()=>FOLLOWUPS.filter(f=>f.dueLabel==="Upcoming"),[]);

  const filtered = useMemo(()=>{
    let base = bucket==="Overdue"?overdue:bucket==="Due Today"?dueToday:bucket==="Upcoming"?upcoming:FOLLOWUPS;
    const q=search.toLowerCase();
    if(q) base=base.filter(f=>f.studentName.toLowerCase().includes(q)||f.phone.includes(q)||f.course.toLowerCase().includes(q)||f.id.toLowerCase().includes(q));
    if(prioFilter!=="All") base=base.filter(f=>f.priority===prioFilter);
    if(statusFilter!=="All") base=base.filter(f=>f.status===statusFilter);
    if(counselorFilter!=="All Counselors") base=base.filter(f=>f.counselor===counselorFilter);
    return base;
  },[bucket,search,prioFilter,statusFilter,counselorFilter,overdue,dueToday,upcoming]);

  const paged=filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
  const pages=Math.ceil(filtered.length/PAGE_SIZE);

  const kpis=[
    {label:"Total Follow-ups",value:FOLLOWUPS.length,icon:"ri-phone-line",color:"#7c3aed",bg:"rgba(124,58,237,0.1)"},
    {label:"Overdue",value:overdue.length,icon:"ri-alarm-warning-line",color:"#dc2626",bg:"rgba(220,38,38,0.1)"},
    {label:"Due Today",value:dueToday.length,icon:"ri-time-line",color:"#d97706",bg:"rgba(217,119,6,0.1)"},
    {label:"Upcoming",value:upcoming.length,icon:"ri-calendar-line",color:"#0284c7",bg:"rgba(2,132,199,0.1)"},
    {label:"Converted",value:FOLLOWUPS.filter(f=>f.status==="Converted").length,icon:"ri-checkbox-circle-line",color:"#16a34a",bg:"rgba(22,163,74,0.1)"},
    {label:"Critical",value:FOLLOWUPS.filter(f=>f.priority==="Critical").length,icon:"ri-error-warning-line",color:"#dc2626",bg:"rgba(220,38,38,0.1)"},
  ];

  const BUCKETS:Array<{key:DueBucket;label:string;count:number;icon:string}> = [
    {key:"All",label:"All",count:FOLLOWUPS.length,icon:"ri-list-check"},
    {key:"Overdue",label:"Overdue",count:overdue.length,icon:"ri-alarm-warning-line"},
    {key:"Due Today",label:"Due Today",count:dueToday.length,icon:"ri-time-line"},
    {key:"Upcoming",label:"Upcoming",count:upcoming.length,icon:"ri-calendar-line"},
  ];

  const SL:React.CSSProperties={padding:"6px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:12,background:"#fafafa",color:"#374151",outline:"none"};

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h4 style={{fontSize:18,fontWeight:800,color:"var(--default-text-color)",marginBottom:2}}>Follow-ups</h4>
          <nav><ol className="breadcrumb mb-0" style={{fontSize:12}}>
            <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item active">Follow-ups</li>
          </ol></nav>
        </div>
        <div className="d-flex gap-2">
          <button style={{padding:"7px 14px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#374151"}}><i className="ri-download-2-line"/>Export</button>
          <button style={{padding:"7px 14px",borderRadius:8,border:"none",background:"#7c3aed",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><i className="ri-add-line"/>Add Follow-up</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"0.75rem",marginBottom:"1.25rem"}}>
        {kpis.map(k=>(
          <div key={k.label} className="card custom-card mb-0" style={{padding:"0.875rem 1rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:k.bg,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
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

      {/* Overdue alert banner */}
      {overdue.length>0 && (
        <div style={{background:"#fff5f5",border:"1.5px solid #fca5a5",borderRadius:10,padding:"0.75rem 1rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:10}}>
          <i className="ri-alarm-warning-fill" style={{fontSize:18,color:"#dc2626",flexShrink:0}}/>
          <div>
            <span style={{fontWeight:700,color:"#dc2626",fontSize:13}}>{overdue.length} overdue follow-up{overdue.length!==1?"s":""}</span>
            <span style={{fontSize:12,color:"#6b7280",marginLeft:8}}>Please prioritise these to avoid losing leads.</span>
          </div>
          <button onClick={()=>{setBucket("Overdue");setPage(1);}} style={{marginLeft:"auto",padding:"5px 12px",borderRadius:7,border:"1.5px solid #dc2626",background:"#dc2626",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>View Overdue</button>
        </div>
      )}

      {/* Tabs + Table */}
      <div className="card custom-card mb-0">
        {/* Tab bar */}
        <div style={{borderBottom:"1px solid var(--default-border)",padding:"0 1rem",display:"flex",gap:0}}>
          {BUCKETS.map(b=>{
            const bc=BUCKET_CFG[b.key]??{color:"#6b7280",bg:"#f3f4f6",icon:""};
            return (
              <button key={b.key} onClick={()=>{setBucket(b.key);setPage(1);}} style={{
                padding:"11px 16px",background:"none",border:"none",cursor:"pointer",whiteSpace:"nowrap" as const,fontSize:13,
                fontWeight:bucket===b.key?700:500,color:bucket===b.key?"#7c3aed":"#6b7280",
                borderBottom:bucket===b.key?"2px solid #7c3aed":"2px solid transparent",marginBottom:-1,
                display:"flex",alignItems:"center",gap:6,
              }}>
                <i className={b.icon} style={{fontSize:13,color:bucket===b.key?"#7c3aed":bc.color}}/>
                {b.label}
                <span style={{background:bucket===b.key?"#7c3aed":bc.bg,color:bucket===b.key?"#fff":bc.color,fontSize:10,fontWeight:700,borderRadius:20,padding:"1px 6px"}}>{b.count}</span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{padding:"0.75rem 1rem",borderBottom:"1px solid #f3f4f6",display:"flex",gap:8,flexWrap:"wrap" as const,alignItems:"center"}}>
          <div style={{position:"relative",flex:1,minWidth:180}}>
            <i className="ri-search-line" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9ca3af",fontSize:13}}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search student, phone, course, ID…"
              style={{width:"100%",padding:"6px 10px 6px 30px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:12,outline:"none",background:"#fafafa"}}/>
          </div>
          <select value={prioFilter} onChange={e=>{setPrioFilter(e.target.value as any);setPage(1);}} style={SL}>
            <option value="All">All Priority</option>
            {PRIORITIES.map(p=><option key={p}>{p}</option>)}
          </select>
          <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value as any);setPage(1);}} style={SL}>
            <option value="All">All Status</option>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={counselorFilter} onChange={e=>{setCounselorFilter(e.target.value);setPage(1);}} style={SL}>
            <option>All Counselors</option>
            {COUNSELORS.map(c=><option key={c}>{c}</option>)}
          </select>
          <span style={{marginLeft:"auto",fontSize:12,color:"#9ca3af"}}>{filtered.length} follow-up{filtered.length!==1?"s":""}</span>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{fontSize:13}}>
            <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
              <tr>
                {["ID","Student","Course","Due Date","Last Contact","Counselor","Priority","Attempts","Status","Actions"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",fontWeight:700,fontSize:11,color:"#6b7280",whiteSpace:"nowrap" as const}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(f=>{
                const pc=PRIO_CFG[f.priority];
                const sc=STATUS_CFG[f.status];
                const bc=BUCKET_CFG[f.dueLabel]??{color:"#6b7280",bg:"#f3f4f6",icon:""};
                return (
                  <tr key={f.id} style={{borderBottom:"1px solid #f9fafb",background:f.dueLabel==="Overdue"?"#fff9f9":f.dueLabel==="Due Today"?"#fffdf5":"transparent"}}>
                    <td style={{padding:"10px 14px"}}><span style={{fontFamily:"monospace",fontSize:11,color:"#7c3aed",fontWeight:700}}>{f.id}</span></td>
                    <td style={{padding:"10px 14px"}}>
                      <div style={{fontWeight:700,color:"#1e1b4b",fontSize:13}}>{f.studentName}</div>
                      <div style={{fontSize:11,color:"#9ca3af"}}>{f.phone}</div>
                    </td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#374151"}}>{f.course}</td>
                    <td style={{padding:"10px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <span style={{fontSize:10,padding:"2px 6px",borderRadius:20,background:bc.bg,color:bc.color,fontWeight:700,display:"flex",alignItems:"center",gap:3}}>
                          <i className={bc.icon} style={{fontSize:9}}/>{f.dueLabel}
                        </span>
                      </div>
                      <div style={{fontSize:11,color:f.dueLabel==="Overdue"?"#dc2626":"#374151",fontWeight:f.dueLabel==="Overdue"?700:400,marginTop:2}}>
                        {f.nextFollowUp}{f.daysOverdue>0&&<span style={{color:"#dc2626",marginLeft:4}}>({f.daysOverdue}d late)</span>}
                      </div>
                    </td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#6b7280"}}>{f.lastContact}</td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#374151"}}>{f.counselor.split(" ")[0]}</td>
                    <td style={{padding:"10px 14px"}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:pc.bg,color:pc.color,border:`1px solid ${pc.border}`}}>{f.priority}</span>
                    </td>
                    <td style={{padding:"10px 14px"}}><AttemptDots done={f.attempts} max={f.maxAttempts}/></td>
                    <td style={{padding:"10px 14px"}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:sc.bg,color:sc.color}}>{f.status}</span>
                    </td>
                    <td style={{padding:"10px 14px"}}>
                      <div style={{display:"flex",gap:4}}>
                        <button title="Mark Contacted" style={{width:27,height:27,borderRadius:6,border:"1px solid #e5e7eb",background:"#f0fdf4",color:"#16a34a",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-phone-line" style={{fontSize:11}}/></button>
                        <button title="Reschedule" style={{width:27,height:27,borderRadius:6,border:"1px solid #e5e7eb",background:"#eff6ff",color:"#2563eb",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-calendar-line" style={{fontSize:11}}/></button>
                        <button title="Convert to Admission" style={{width:27,height:27,borderRadius:6,border:"1px solid #e5e7eb",background:"#faf5ff",color:"#7c3aed",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-checkbox-circle-line" style={{fontSize:11}}/></button>
                        <button title="Add Note" style={{width:27,height:27,borderRadius:6,border:"1px solid #e5e7eb",background:"#fefce8",color:"#ca8a04",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-sticky-note-line" style={{fontSize:11}}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length===0 && (
                <tr><td colSpan={10} style={{textAlign:"center",padding:"3rem",color:"#9ca3af"}}>
                  <i className="ri-calendar-check-line" style={{fontSize:28,display:"block",marginBottom:8}}/>No follow-ups found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pages>1 && (
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.75rem 1rem",borderTop:"1px solid #f3f4f6"}}>
            <span style={{fontSize:12,color:"#9ca3af"}}>Page {page} of {pages} · {filtered.length} records</span>
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
  );
}
