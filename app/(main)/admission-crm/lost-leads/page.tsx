"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────
type LostReason = "Fee Too High" | "Admitted Elsewhere" | "Not Interested" | "No Response" | "Course Unavailable" | "Family Decision" | "Location Issue" | "Scholarship Denied";
type LostStatus = "Lost" | "Inactive" | "Win-Back Initiated" | "Re-Engaged";

interface LostLead {
  id: string; studentName: string; phone: string; email: string;
  course: string; counselor: string; enquiryDate: string; lostDate: string;
  inactiveSince: number; reason: LostReason; status: LostStatus;
  lastContact: string; attempts: number; potentialScore: number;
  notes: string; source: string; category: string; city: string;
  winBackSent: boolean;
}

// ── Data ──────────────────────────────────────────────────────────
const FNAMES=["Priya","Rahul","Anjali","Suresh","Meena","Deepak","Kavita","Arjun","Sunita","Vikram","Pooja","Karan","Nisha","Rohit","Sneha","Amit","Ritu","Sanjay","Divya","Mohit","Anita","Gaurav","Swati","Nitin","Rekha","Vishal","Shweta","Arun","Geeta","Rajan","Sapna","Hemant","Poonam","Rajesh","Neha","Sunil","Mamta","Vijay","Reena","Ashok"];
const LNAMES=["Sharma","Verma","Patel","Kumar","Singh","Gupta","Joshi","Mehta","Tiwari","Yadav","Chauhan","Malhotra","Agarwal","Rajput","Pandey","Shah","Soni","Mishra","Dubey","Nair"];
const COURSES=["BCA","B.Com","B.Sc","BBA","MBA","B.Tech CSE","B.Tech ECE","M.Com","MCA","M.Sc","BA","BBA LLB","B.Pharm"];
const COUNSELORS=["Ananya Kapoor","Rohit Verma","Sunita Nair","Deepak Joshi","Meena Pillai"];
const REASONS:LostReason[]=["Fee Too High","Admitted Elsewhere","Not Interested","No Response","Course Unavailable","Family Decision","Location Issue","Scholarship Denied"];
const LOST_STATUSES:LostStatus[]=["Lost","Inactive","Win-Back Initiated","Re-Engaged"];
const SOURCES=["Walk-in","Website","Phone","Social Media","Referral","DHE Portal"];
const CITIES=["Indore","Bhopal","Ujjain","Jabalpur","Gwalior","Rewa","Sagar","Dewas","Vidisha","Satna"];
const NOTES_LIST=["Fee too high compared to other colleges","Already joined another institution","Never responded after initial enquiry","Parents denied admission","No suitable course available","Too far from home","Scholarship not approved","Changed career plans","Appeared interested but went silent","Called 6 times, no response"];

function rnd(seed:number,max:number){return((seed*1103515245+12345)&0x7fffffff)%max;}

const LOST_LEADS:LostLead[]=Array.from({length:65},(_,i)=>{
  const score=10+rnd(i*11+1,60);
  return {
    id:`LL-${(i+1).toString().padStart(4,"0")}`,
    studentName:`${FNAMES[rnd(i*7+1,FNAMES.length)]} ${LNAMES[rnd(i*13+3,LNAMES.length)]}`,
    phone:`+91-${9600000000+i*41+777}`,
    email:`lost${i}@email.com`,
    course:COURSES[rnd(i*17+5,COURSES.length)],
    counselor:COUNSELORS[rnd(i*19+6,COUNSELORS.length)],
    enquiryDate:`${(rnd(i*23+7,25)+1).toString().padStart(2,"0")} ${["Jan","Feb","Mar","Apr","May","Jun"][rnd(i*29+8,6)]} 2026`,
    lostDate:`${(rnd(i*31+9,27)+1).toString().padStart(2,"0")} ${["Apr","May","Jun","Jul"][rnd(i*37+10,4)]} 2026`,
    inactiveSince:7+rnd(i*41+11,83),
    reason:REASONS[rnd(i*43+12,REASONS.length)],
    status:LOST_STATUSES[rnd(i*47+13,LOST_STATUSES.length)],
    lastContact:`${(rnd(i*53+14,27)+1).toString().padStart(2,"0")} ${["May","Jun","Jul"][rnd(i*59+15,3)]} 2026`,
    attempts:1+rnd(i*61+16,8),
    potentialScore:score,
    notes:NOTES_LIST[rnd(i*67+17,NOTES_LIST.length)],
    source:SOURCES[rnd(i*71+18,SOURCES.length)],
    category:["General","OBC","SC","ST","EWS"][rnd(i*73+19,5)],
    city:CITIES[rnd(i*79+20,CITIES.length)],
    winBackSent:rnd(i*83+21,3)===0,
  };
});

// ── Config ────────────────────────────────────────────────────────
const REASON_CFG:Record<LostReason,{color:string;bg:string;icon:string}> = {
  "Fee Too High":        {color:"#dc2626",bg:"#fee2e2",icon:"ri-money-rupee-circle-line"},
  "Admitted Elsewhere":  {color:"#7c3aed",bg:"#f3e8ff",icon:"ri-school-line"},
  "Not Interested":      {color:"#6b7280",bg:"#f3f4f6",icon:"ri-emotion-unhappy-line"},
  "No Response":         {color:"#d97706",bg:"#fef3c7",icon:"ri-phone-off-line"},
  "Course Unavailable":  {color:"#0284c7",bg:"#dbeafe",icon:"ri-book-2-line"},
  "Family Decision":     {color:"#db2777",bg:"#fce7f3",icon:"ri-home-heart-line"},
  "Location Issue":      {color:"#16a34a",bg:"#dcfce7",icon:"ri-map-pin-2-line"},
  "Scholarship Denied":  {color:"#ea580c",bg:"#ffedd5",icon:"ri-award-line"},
};
const STATUS_CFG:Record<LostStatus,{color:string;bg:string;border:string}> = {
  "Lost":               {color:"#dc2626",bg:"#fee2e2",border:"#fca5a5"},
  "Inactive":           {color:"#6b7280",bg:"#f3f4f6",border:"#d1d5db"},
  "Win-Back Initiated": {color:"#d97706",bg:"#fef3c7",border:"#fcd34d"},
  "Re-Engaged":         {color:"#16a34a",bg:"#dcfce7",border:"#86efac"},
};

// Reason breakdown for analytics
const REASON_COUNTS = REASONS.map(r=>({
  reason:r, count:LOST_LEADS.filter(l=>l.reason===r).length,
  cfg:REASON_CFG[r],
})).sort((a,b)=>b.count-a.count);

function ReasonBreakdown() {
  const total = LOST_LEADS.length;
  return (
    <div className="card custom-card mb-0 h-100">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Lost Reason Analysis</h3>
      </div>
      <div className="card-body" style={{padding:"1rem"}}>
        <div style={{display:"flex",flexDirection:"column" as const,gap:"0.625rem"}}>
          {REASON_COUNTS.map(r=>{
            const pct=Math.round(r.count/total*100);
            return (
              <div key={r.reason}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:r.cfg.color,display:"inline-block",flexShrink:0}}/>
                    <span style={{fontSize:12,color:"var(--default-text-color)",fontWeight:600}}>{r.reason}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:12,fontWeight:800,color:r.cfg.color}}>{r.count}</span>
                    <span style={{fontSize:11,color:"var(--text-muted)",minWidth:30,textAlign:"right" as const}}>{pct}%</span>
                  </div>
                </div>
                <div style={{height:5,borderRadius:999,background:"var(--default-border)",overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:999,width:`${pct}%`,background:r.cfg.color,transition:"width 0.6s ease"}}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WinBackPanel() {
  const winBackable = LOST_LEADS.filter(l=>l.potentialScore>=40&&l.status!=="Re-Engaged"&&l.status!=="Win-Back Initiated");
  return (
    <div className="card custom-card mb-0 h-100">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Win-Back Candidates</h3>
        <span style={{fontSize:10,fontWeight:700,background:"rgba(124,58,237,0.1)",color:"#7c3aed",padding:"2px 8px",borderRadius:20}}>{winBackable.length} high potential</span>
      </div>
      <div className="card-body" style={{padding:"0.75rem 1rem"}}>
        <div style={{marginBottom:"0.75rem",padding:"0.625rem",background:"#f5f3ff",borderRadius:8,border:"1px solid #ede9fe",fontSize:12,color:"#6b7280"}}>
          <i className="ri-information-line" style={{color:"#7c3aed",marginRight:6}}/>
          Leads with potential score ≥ 40 and recoverable loss reasons. Send personalised re-engagement.
        </div>
        {winBackable.slice(0,6).map(l=>{
          const rc=REASON_CFG[l.reason];
          return (
            <div key={l.id} style={{display:"flex",alignItems:"center",gap:10,padding:"0.5rem 0",borderBottom:"1px dashed var(--default-border)"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(124,58,237,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,fontWeight:800,color:"#7c3aed"}}>
                {l.studentName.split(" ").map((w:string)=>w[0]).join("").slice(0,2)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:12,color:"var(--default-text-color)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{l.studentName}</div>
                <div style={{fontSize:10,color:"var(--text-muted)"}}>{l.course} · Score: <strong style={{color:"#7c3aed"}}>{l.potentialScore}</strong></div>
              </div>
              <span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:20,background:rc.bg,color:rc.color,flexShrink:0}}>{l.reason.split(" ").slice(0,2).join(" ")}</span>
              <button style={{padding:"4px 8px",borderRadius:6,border:"1px solid #7c3aed",background:"rgba(124,58,237,0.08)",color:"#7c3aed",fontSize:10,fontWeight:700,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap" as const}}>
                Re-engage
              </button>
            </div>
          );
        })}
        {winBackable.length>6&&(
          <div style={{textAlign:"center",paddingTop:"0.5rem",fontSize:12,color:"#9ca3af"}}>+{winBackable.length-6} more candidates</div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function LostLeadsPage() {
  const [search,setSearch]=useState("");
  const [reasonFilter,setReasonFilter]=useState<LostReason|"All">("All");
  const [statusFilter,setStatusFilter]=useState<LostStatus|"All">("All");
  const [counselorFilter,setCounselorFilter]=useState("All Counselors");
  const [page,setPage]=useState(1);
  const PAGE_SIZE=15;

  const filtered=useMemo(()=>{
    let base=LOST_LEADS;
    const q=search.toLowerCase();
    if(q) base=base.filter(l=>l.studentName.toLowerCase().includes(q)||l.phone.includes(q)||l.course.toLowerCase().includes(q)||l.id.toLowerCase().includes(q));
    if(reasonFilter!=="All") base=base.filter(l=>l.reason===reasonFilter);
    if(statusFilter!=="All") base=base.filter(l=>l.status===statusFilter);
    if(counselorFilter!=="All Counselors") base=base.filter(l=>l.counselor===counselorFilter);
    return base;
  },[search,reasonFilter,statusFilter,counselorFilter]);

  const paged=filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
  const pages=Math.ceil(filtered.length/PAGE_SIZE);

  const kpis=[
    {label:"Total Lost / Inactive",value:LOST_LEADS.length,icon:"ri-user-unfollow-line",color:"#dc2626",bg:"rgba(220,38,38,0.1)"},
    {label:"Lost",value:LOST_LEADS.filter(l=>l.status==="Lost").length,icon:"ri-close-circle-line",color:"#dc2626",bg:"rgba(220,38,38,0.1)"},
    {label:"Inactive",value:LOST_LEADS.filter(l=>l.status==="Inactive").length,icon:"ri-sleep-line",color:"#6b7280",bg:"#f3f4f6"},
    {label:"Win-Back Initiated",value:LOST_LEADS.filter(l=>l.status==="Win-Back Initiated").length,icon:"ri-refresh-line",color:"#d97706",bg:"rgba(217,119,6,0.1)"},
    {label:"Re-Engaged",value:LOST_LEADS.filter(l=>l.status==="Re-Engaged").length,icon:"ri-heart-add-line",color:"#16a34a",bg:"rgba(22,163,74,0.1)"},
    {label:"High Potential",value:LOST_LEADS.filter(l=>l.potentialScore>=40).length,icon:"ri-star-line",color:"#7c3aed",bg:"rgba(124,58,237,0.1)"},
  ];

  const SL:React.CSSProperties={padding:"6px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:12,background:"#fafafa",color:"#374151",outline:"none"};

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h4 style={{fontSize:18,fontWeight:800,color:"var(--default-text-color)",marginBottom:2}}>Lost / Inactive Leads</h4>
          <nav><ol className="breadcrumb mb-0" style={{fontSize:12}}>
            <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item active">Lost / Inactive</li>
          </ol></nav>
        </div>
        <div className="d-flex gap-2">
          <button style={{padding:"7px 14px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#374151"}}><i className="ri-download-2-line"/>Export</button>
          <button style={{padding:"7px 14px",borderRadius:8,border:"none",background:"#7c3aed",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><i className="ri-refresh-line"/>Win-Back Campaign</button>
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

      {/* Analytics row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.25rem"}}>
        <ReasonBreakdown/>
        <WinBackPanel/>
      </div>

      {/* Table */}
      <div className="card custom-card mb-0">
        {/* Filters */}
        <div style={{padding:"0.875rem 1rem",borderBottom:"1px solid #f3f4f6",display:"flex",gap:8,flexWrap:"wrap" as const,alignItems:"center"}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <i className="ri-search-line" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9ca3af",fontSize:13}}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search name, phone, course, ID…"
              style={{width:"100%",padding:"6px 10px 6px 30px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:12,outline:"none",background:"#fafafa"}}/>
          </div>
          <select value={reasonFilter} onChange={e=>{setReasonFilter(e.target.value as any);setPage(1);}} style={SL}>
            <option value="All">All Reasons</option>
            {REASONS.map(r=><option key={r}>{r}</option>)}
          </select>
          <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value as any);setPage(1);}} style={SL}>
            <option value="All">All Status</option>
            {LOST_STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={counselorFilter} onChange={e=>{setCounselorFilter(e.target.value);setPage(1);}} style={SL}>
            <option>All Counselors</option>
            {COUNSELORS.map(c=><option key={c}>{c}</option>)}
          </select>
          <span style={{marginLeft:"auto",fontSize:12,color:"#9ca3af"}}>{filtered.length} records</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{fontSize:13}}>
            <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
              <tr>
                {["ID","Student","Course","Lost Reason","Status","Counselor","Inactive Since","Last Contact","Attempts","Potential","Actions"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",fontWeight:700,fontSize:11,color:"#6b7280",whiteSpace:"nowrap" as const}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(l=>{
                const rc=REASON_CFG[l.reason];
                const sc=STATUS_CFG[l.status];
                const potColor=l.potentialScore>=60?"#16a34a":l.potentialScore>=40?"#d97706":"#6b7280";
                return (
                  <tr key={l.id} style={{borderBottom:"1px solid #f9fafb"}}>
                    <td style={{padding:"10px 14px"}}><span style={{fontFamily:"monospace",fontSize:11,color:"#7c3aed",fontWeight:700}}>{l.id}</span></td>
                    <td style={{padding:"10px 14px"}}>
                      <div style={{fontWeight:700,color:"#1e1b4b",fontSize:13}}>{l.studentName}</div>
                      <div style={{fontSize:11,color:"#9ca3af"}}>{l.phone} · {l.city}</div>
                    </td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#374151"}}>{l.course}</td>
                    <td style={{padding:"10px 14px"}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:rc.bg,color:rc.color,display:"inline-flex",alignItems:"center",gap:4,whiteSpace:"nowrap" as const}}>
                        <i className={rc.icon} style={{fontSize:9}}/>{l.reason}
                      </span>
                    </td>
                    <td style={{padding:"10px 14px"}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`,whiteSpace:"nowrap" as const}}>{l.status}</span>
                    </td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#374151"}}>{l.counselor.split(" ")[0]}</td>
                    <td style={{padding:"10px 14px"}}>
                      <span style={{fontSize:12,fontWeight:700,color:l.inactiveSince>30?"#dc2626":l.inactiveSince>14?"#d97706":"#6b7280"}}>{l.inactiveSince} days</span>
                    </td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#6b7280"}}>{l.lastContact}</td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#374151",fontWeight:600}}>{l.attempts}x</td>
                    <td style={{padding:"10px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <div style={{width:32,height:5,borderRadius:999,background:"#f3f4f6",overflow:"hidden"}}>
                          <div style={{height:"100%",borderRadius:999,width:`${l.potentialScore}%`,background:potColor}}/>
                        </div>
                        <span style={{fontSize:11,fontWeight:800,color:potColor}}>{l.potentialScore}</span>
                      </div>
                    </td>
                    <td style={{padding:"10px 14px"}}>
                      <div style={{display:"flex",gap:4}}>
                        <button title="Re-engage" style={{width:27,height:27,borderRadius:6,border:"1px solid #e5e7eb",background:"#f5f3ff",color:"#7c3aed",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-refresh-line" style={{fontSize:11}}/></button>
                        <button title="Call" style={{width:27,height:27,borderRadius:6,border:"1px solid #e5e7eb",background:"#f0fdf4",color:"#16a34a",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-phone-line" style={{fontSize:11}}/></button>
                        <button title="Send WhatsApp" style={{width:27,height:27,borderRadius:6,border:"1px solid #e5e7eb",background:"#f0fdf4",color:"#15803d",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-whatsapp-line" style={{fontSize:11}}/></button>
                        <button title="Mark Permanently Lost" style={{width:27,height:27,borderRadius:6,border:"1px solid #fee2e2",background:"#fff5f5",color:"#dc2626",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-close-circle-line" style={{fontSize:11}}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length===0&&(
                <tr><td colSpan={11} style={{textAlign:"center",padding:"3rem",color:"#9ca3af"}}>
                  <i className="ri-user-unfollow-line" style={{fontSize:28,display:"block",marginBottom:8}}/>No records found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pages>1&&(
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
