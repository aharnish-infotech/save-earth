"use client";
import React, { useState } from "react";

type AttStatus = "P"|"A"|"H"|"HD"|"L"|"OL"|"DO"|"-";
interface Emp { id:number; name:string; avatar:string; designation:string; department:string; attendance:Record<number,AttStatus>; hours?:Record<number,number>; }
interface DetailState { emp:Emp; day:number; }

const SUNDAYS  = new Set([5,12,19,26]);
const HOLIDAYS = new Set([15]);
const TODAY    = 14;
const MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DEPTS    = ["All","Management","Technology","HR","Finance"];
const DESGS    = ["All","CEO & Founder","Sr. Developer","Trainee","Intern","HR Manager","Accountant"];
const AVATAR_COLORS=["#4f46e5","#7c3aed","#0284c7","#16a34a","#dc2626","#db2777","#ea580c","#ca8a04"];
const DAY_NAMES=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_SHORT=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const STATUS_CFG:{[k in AttStatus]:{label:string;bg:string;color:string;icon:string;badgeBg:string;badgeColor:string}}={
  P: {label:"Present", bg:"#dcfce7",color:"#16a34a",icon:"ri-check-line",         badgeBg:"#dcfce7",badgeColor:"#16a34a"},
  A: {label:"Absent",  bg:"#fee2e2",color:"#dc2626",icon:"ri-close-line",          badgeBg:"#fee2e2",badgeColor:"#dc2626"},
  H: {label:"Holiday", bg:"#fef9c3",color:"#ca8a04",icon:"ri-star-line",           badgeBg:"#fef9c3",badgeColor:"#ca8a04"},
  HD:{label:"Half Day",bg:"#fed7aa",color:"#ea580c",icon:"ri-contrast-line",       badgeBg:"#fed7aa",badgeColor:"#ea580c"},
  L: {label:"Late",    bg:"#fce7f3",color:"#db2777",icon:"ri-time-line",           badgeBg:"#fce7f3",badgeColor:"#db2777"},
  OL:{label:"On Leave",bg:"#fee2e2",color:"#dc2626",icon:"ri-plane-line",          badgeBg:"#fee2e2",badgeColor:"#dc2626"},
  DO:{label:"Day Off", bg:"#f3f4f6",color:"#6b7280",icon:"ri-rest-time-line",      badgeBg:"#f3f4f6",badgeColor:"#6b7280"},
  "-":{label:"—",      bg:"transparent",color:"#d1d5db",icon:"",                  badgeBg:"transparent",badgeColor:"#d1d5db"},
};

function mockAtt(seed:number): Record<number,AttStatus> {
  const r:Record<number,AttStatus>={};
  for(let d=1;d<=31;d++){
    if(d>TODAY){r[d]="-";continue;}
    if(SUNDAYS.has(d)){r[d]="DO";continue;}
    if(HOLIDAYS.has(d)){r[d]="H";continue;}
    const v=((seed*d*1664525+1013904223)&0x7fffffff)%10;
    r[d]=v<1?"OL":v<2?"HD":v<3?"L":v<4?"A":"P";
  }
  return r;
}
function mockHours(seed:number): Record<number,number> {
  const r:Record<number,number>={};
  for(let d=1;d<=31;d++){
    if(d>TODAY||SUNDAYS.has(d)||HOLIDAYS.has(d)){r[d]=0;continue;}
    const v=((seed*d*1664525+1013904223)&0x7fffffff)%10;
    r[d]=v<4?0:Math.round((4+((seed*d*7)%400)/100)*10)/10;
  }
  return r;
}
function fmtHours(h:number){ const hr=Math.floor(h); const mn=Math.round((h-hr)*60); return `${hr}h ${mn.toString().padStart(2,"0")}m`; }
function fmtHoursShort(h:number){ const hr=Math.floor(h); const mn=Math.round((h-hr)*60); return `${hr}:${mn.toString().padStart(2,"0")}`; }

const CI_POOL=["09:05 AM","09:18 AM","09:32 AM","09:45 AM","10:02 AM","10:15 AM","08:55 AM"];
const CO_POOL=["05:15 pm","05:30 pm","06:00 pm","06:30 pm","07:00 pm","07:30 pm","05:00 pm"];
function ci(seed:number,d:number){ return CI_POOL[((seed*d*7+3)&0x7fffffff)%CI_POOL.length]; }
function co(seed:number,d:number){ return CO_POOL[((seed*d*13+5)&0x7fffffff)%CO_POOL.length]; }

const EMPLOYEES:Emp[]=[
  {id:1,name:"Mukteshwar Sharma",avatar:"MS",designation:"CEO & Founder", department:"Management",attendance:mockAtt(11),hours:mockHours(11)},
  {id:2,name:"Akash Rai",        avatar:"AR",designation:"Sr. Developer", department:"Technology",attendance:mockAtt(22),hours:mockHours(22)},
  {id:3,name:"Harsh Mishra",     avatar:"HM",designation:"Trainee",       department:"Technology",attendance:mockAtt(33),hours:mockHours(33)},
  {id:4,name:"Sanjana Goldar",   avatar:"SG",designation:"Intern",        department:"HR",        attendance:mockAtt(44),hours:mockHours(44)},
  {id:5,name:"Geeta Rajpoot",    avatar:"GR",designation:"Sr. Developer", department:"Technology",attendance:mockAtt(55),hours:mockHours(55)},
  {id:6,name:"Bhagvendra Singh", avatar:"BS",designation:"Sr. Developer", department:"Technology",attendance:mockAtt(66),hours:mockHours(66)},
  {id:7,name:"Pooja Singh",      avatar:"PS",designation:"HR Manager",    department:"HR",        attendance:mockAtt(77),hours:mockHours(77)},
  {id:8,name:"Rahul Verma",      avatar:"RV",designation:"Accountant",    department:"Finance",   attendance:mockAtt(88),hours:mockHours(88)},
];

function Sel({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:string[]}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <span style={{fontSize:12,fontWeight:600,color:"#374151",whiteSpace:"nowrap"}}>{label}</span>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{padding:"5px 10px",borderRadius:7,border:"1.5px solid #e5e7eb",fontSize:12,color:"#374151",background:"#fafafa",cursor:"pointer",outline:"none"}}>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function AvatarEl({emp,idx,size=32}:{emp:Emp;idx:number;size?:number}){
  return(
    <div style={{width:size,height:size,borderRadius:"50%",background:AVATAR_COLORS[idx%AVATAR_COLORS.length],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*0.33,flexShrink:0}}>{emp.avatar}</div>
  );
}

// ── Circular Timer ─────────────────────────────────────────────────────────
function CircleTimer({hours,maxHours=9}:{hours:number;maxHours?:number}){
  const r=60; const circ=2*Math.PI*r;
  const pct=Math.min(hours/maxHours,1);
  const offset=circ-(pct*circ);
  return(
    <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        <circle cx={80} cy={80} r={r} fill="none" stroke="#e5e7eb" strokeWidth={10}/>
        <circle cx={80} cy={80} r={r} fill="none" stroke="#4f46e5" strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 80 80)" style={{transition:"stroke-dashoffset 0.6s ease"}}/>
      </svg>
      <div style={{position:"absolute",textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:800,color:"#1e1b4b"}}>{fmtHours(hours)}</div>
        <div style={{fontSize:10,color:"#9ca3af",fontWeight:600}}>TOTAL</div>
      </div>
    </div>
  );
}

// ── Mark Attendance Modal ──────────────────────────────────────────────────
function MarkModal({emp,day,empIdx,onClose,onSave}:{emp:Emp;day:number;empIdx:number;onClose:()=>void;onSave:(data:{clockIn:string;clockOut:string;late:boolean;halfDay:boolean})=>void}){
  const [clockIn, setClockIn]   = useState(ci(emp.id,day));
  const [clockOut,setClockOut]  = useState(co(emp.id,day));
  const [late,    setLate]      = useState(false);
  const [halfDay, setHalfDay]   = useState(false);
  const [wfh,     setWfh]       = useState("Office");
  const IP="49.36.16.99";
  const Toggle=({on,onToggle}:{on:boolean;onToggle:()=>void})=>(
    <div onClick={onToggle} style={{width:36,height:20,borderRadius:10,background:on?"#4f46e5":"#d1d5db",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
      <div style={{position:"absolute",top:2,left:on?18:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
    </div>
  );
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:10001,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:16,width:"min(540px,95vw)",boxShadow:"0 20px 60px rgba(0,0,0,0.2)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{padding:"16px 20px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <AvatarEl emp={emp} idx={empIdx} size={36}/>
            <div>
              <div style={{fontWeight:800,fontSize:14,color:"#1e1b4b"}}>{emp.name}</div>
              <div style={{fontSize:11,color:"#9ca3af"}}>{emp.designation}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:12,fontWeight:700,color:"#4f46e5",background:"#ede9fe",padding:"3px 10px",borderRadius:6}}>Mark Attendance</span>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#9ca3af",lineHeight:1}}>&times;</button>
          </div>
        </div>
        <div style={{padding:"18px 20px"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:14}}>
            Date - {`${String(day).padStart(2,"0")}-07-2026`}
          </div>
          <div className="row g-3">
            <div className="col-md-5">
              <label style={LBL}>Clock In <span style={{color:"#dc2626"}}>*</span></label>
              <input value={clockIn} onChange={e=>setClockIn(e.target.value)} style={INP}/>
            </div>
            <div className="col-md-5">
              <label style={LBL}>Clock In IP</label>
              <input value={IP} readOnly style={{...INP,background:"#f9fafb",color:"#9ca3af"}}/>
            </div>
            <div className="col-md-2">
              <label style={LBL}>Late</label>
              <Toggle on={late} onToggle={()=>setLate(v=>!v)}/>
            </div>
            <div className="col-md-5">
              <label style={LBL}>Clock Out</label>
              <input value={clockOut} onChange={e=>setClockOut(e.target.value)} placeholder="e.g. 10:00 AM" style={INP}/>
            </div>
            <div className="col-md-5">
              <label style={LBL}>Clock Out IP</label>
              <input value={IP} readOnly style={{...INP,background:"#f9fafb",color:"#9ca3af"}}/>
            </div>
            <div className="col-md-2">
              <label style={LBL}>Half Day</label>
              <Toggle on={halfDay} onToggle={()=>setHalfDay(v=>!v)}/>
            </div>
            <div className="col-md-6">
              <label style={LBL}>Location</label>
              <select style={INP}><option>AHARNISH INFOTECH PRIVATE LIMITED (HO)</option><option>Branch Office – Bhopal</option></select>
            </div>
            <div className="col-md-6">
              <label style={LBL}>Working From <span style={{color:"#dc2626"}}>*</span></label>
              <select value={wfh} onChange={e=>setWfh(e.target.value)} style={INP}><option>Office</option><option>Home</option><option>Client Site</option></select>
            </div>
          </div>
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"flex-end",gap:8}}>
          <button onClick={onClose} style={{padding:"8px 20px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer"}}>Close</button>
          <button onClick={()=>onSave({clockIn,clockOut,late,halfDay})} style={{padding:"8px 24px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><i className="ri-check-line"/> Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Attendance Detail Modal ────────────────────────────────────────────────
function DetailModal({detail,empIdx,onClose}:{detail:DetailState;empIdx:number;onClose:()=>void}){
  const {emp,day}=detail;
  const [showMark,setShowMark]=useState(false);
  const [savedCi,setSavedCi]=useState(ci(emp.id,day));
  const [savedCo,setSavedCo]=useState(co(emp.id,day));
  const h=emp.hours?.[day]||0;
  const dateStr=`${String(day).padStart(2,"0")}-07-2026`;
  const dayStr=DAY_NAMES[(3+day-1)%7];
  return(
    <>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
        <div style={{background:"#fff",borderRadius:16,width:"min(780px,95vw)",maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.18)"}} onClick={e=>e.stopPropagation()}>
          {/* Header */}
          <div style={{padding:"16px 24px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <AvatarEl emp={emp} idx={empIdx} size={48}/>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontWeight:800,fontSize:16,color:"#1e1b4b"}}>{emp.name}</span>
                  <span style={{fontSize:10,fontWeight:700,color:"#4f46e5",background:"#ede9fe",padding:"2px 8px",borderRadius:20}}>It's you</span>
                </div>
                <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>{emp.designation}</div>
              </div>
            </div>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:24,color:"#9ca3af",lineHeight:1}}>&times;</button>
          </div>
          {/* Body */}
          <div className="row g-0">
            {/* Left */}
            <div className="col-md-6" style={{borderRight:"1px solid #f3f4f6",padding:"20px 24px"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#374151",marginBottom:16}}>Date - {dateStr} ({dayStr})</div>
              {/* Clock In box */}
              <div style={{border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 16px",marginBottom:16,background:"#fafafa"}}>
                <div style={{fontSize:11,fontWeight:600,color:"#9ca3af",marginBottom:4}}>Clock In</div>
                <div style={{fontSize:18,fontWeight:800,color:"#1e1b4b"}}>{savedCi}</div>
              </div>
              {/* Circle */}
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                <CircleTimer hours={h}/>
              </div>
              {/* Clock Out box */}
              <div style={{border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 16px",background:"#fafafa"}}>
                <div style={{fontSize:11,fontWeight:600,color:"#9ca3af",marginBottom:4}}>Clock Out</div>
                <div style={{fontSize:18,fontWeight:800,color:"#1e1b4b"}}>{savedCo}</div>
              </div>
            </div>
            {/* Right — Activity */}
            <div className="col-md-6" style={{padding:"20px 24px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <span style={{fontSize:14,fontWeight:700,color:"#374151"}}>Activity</span>
                <button onClick={()=>setShowMark(true)} style={{padding:"6px 16px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><i className="ri-add-line"/> Add</button>
              </div>
              {/* Activity timeline */}
              <div style={{display:"flex",flexDirection:"column" as const,gap:2}}>
                {/* Clock In event */}
                <div style={{background:"#f8f9fa",borderRadius:10,padding:"12px 14px",marginBottom:8,border:"1px solid #f3f4f6"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{width:10,height:10,borderRadius:"50%",background:"#4f46e5",border:"2px solid #fff",boxShadow:"0 0 0 2px #4f46e5",display:"inline-block",flexShrink:0}}/>
                      <span style={{fontSize:12,fontWeight:700,color:"#1e1b4b"}}>Clock In</span>
                      <span style={{fontSize:10,fontWeight:700,color:"#7c3aed",background:"#ede9fe",padding:"1px 7px",borderRadius:20}}>General Shift</span>
                    </div>
                    <i className="ri-more-2-line" style={{color:"#9ca3af",cursor:"pointer"}}/>
                  </div>
                  <div style={{paddingLeft:16,fontSize:12,color:"#6b7280"}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><i className="ri-time-line" style={{fontSize:11}}/> {dateStr} {savedCi.toLowerCase()}</div>
                    <div style={{display:"flex",alignItems:"center",gap:5}}><i className="ri-map-pin-line" style={{fontSize:11}}/> AHARNISH INFOTECH PRIVATE LIMITED (HO) (office)</div>
                  </div>
                </div>
                {/* Clock Out event */}
                <div style={{background:"#f8f9fa",borderRadius:10,padding:"12px 14px",border:"1px solid #f3f4f6"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <span style={{width:10,height:10,borderRadius:"50%",background:"#4f46e5",border:"2px solid #fff",boxShadow:"0 0 0 2px #4f46e5",display:"inline-block",flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:700,color:"#1e1b4b"}}>Clock Out</span>
                  </div>
                  <div style={{paddingLeft:16,fontSize:12,color:"#6b7280",display:"flex",alignItems:"center",gap:5}}><i className="ri-time-line" style={{fontSize:11}}/> {dateStr} {savedCo}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showMark&&<MarkModal emp={emp} day={day} empIdx={empIdx} onClose={()=>setShowMark(false)} onSave={({clockIn,clockOut})=>{setSavedCi(clockIn);setSavedCo(clockOut);setShowMark(false);}}/>}
    </>
  );
}

// ── TABS ───────────────────────────────────────────────────────────────────
const TABS=[
  {id:"summary",    label:"Summary",              icon:"ri-bar-chart-grouped-line"},
  {id:"by-member",  label:"Attendance by Member", icon:"ri-user-3-line"},
  {id:"by-hour",    label:"Attendance by Hour",   icon:"ri-time-line"},
  {id:"by-location",label:"Attendance by Location",icon:"ri-map-pin-line"},
];

// ── Summary Tab ────────────────────────────────────────────────────────────
function SummaryTab({month,year,dept,desg}:{month:number;year:number;dept:string;desg:string}){
  const days=new Date(year,month+1,0).getDate();
  const filtered=EMPLOYEES.filter(e=>(dept==="All"||e.department===dept)&&(desg==="All"||e.designation===desg));
  const workDays=Array.from({length:days},(_,i)=>i+1).filter(d=>!SUNDAYS.has(d)&&!HOLIDAYS.has(d)&&d<=TODAY).length;
  const todayP=filtered.filter(e=>e.attendance[TODAY]==="P").length;
  const todayA=filtered.filter(e=>e.attendance[TODAY]==="A").length;
  const todayL=filtered.filter(e=>e.attendance[TODAY]==="OL"||e.attendance[TODAY]==="HD").length;
  const TH:React.CSSProperties={padding:"8px 4px",textAlign:"center",fontWeight:700,color:"#6b7280",fontSize:11,whiteSpace:"nowrap",borderBottom:"2px solid #ede9fe"};
  const countP=(e:Emp)=>Object.values(e.attendance).filter(s=>s==="P"||s==="HD"||s==="L").length;
  function Cell({s}:{s:AttStatus}){const c=STATUS_CFG[s];if(s==="-")return <span style={{color:"#d1d5db",fontSize:11}}>—</span>;return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:26,height:26,borderRadius:6,background:c.bg,color:c.color,fontSize:13}} title={c.label}><i className={c.icon}/></span>;}
  return(
    <>
      <div className="row g-3" style={{marginBottom:"1.25rem"}}>
        {[
          {label:"Total Employees",value:filtered.length,icon:"ri-group-line",color:"#4f46e5",bg:"#ede9fe"},
          {label:"Present Today",value:todayP,icon:"ri-checkbox-circle-line",color:"#16a34a",bg:"#dcfce7"},
          {label:"Absent Today",value:todayA,icon:"ri-close-circle-line",color:"#dc2626",bg:"#fee2e2"},
          {label:"On Leave",value:todayL,icon:"ri-plane-line",color:"#dc2626",bg:"#fee2e2"},
          {label:"Working Days",value:workDays,icon:"ri-calendar-2-line",color:"#7c3aed",bg:"#f3e8ff"},
        ].map(c=>(
          <div key={c.label} className="col">
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",padding:"14px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(79,70,229,0.06)"}}>
              <div style={{width:42,height:42,borderRadius:10,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className={c.icon} style={{fontSize:20,color:c.color}}/></div>
              <div><div style={{fontSize:22,fontWeight:800,color:c.color,lineHeight:1}}>{c.value}</div><div style={{fontSize:11,color:"#9ca3af",fontWeight:600,marginTop:2}}>{c.label}</div></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"#f9fafb",borderRadius:8,padding:"8px 12px",marginBottom:"1rem",display:"flex",gap:16,flexWrap:"wrap" as const}}>
        <span style={{fontSize:11,fontWeight:600,color:"#6b7280"}}>Legend:</span>
        {(Object.entries(STATUS_CFG) as [AttStatus,typeof STATUS_CFG[AttStatus]][]).filter(([k])=>k!=="-").map(([k,c])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#374151"}}>
            <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:4,background:c.bg,color:c.color,fontSize:11}}><i className={c.icon}/></span>{c.label}
          </div>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",overflow:"auto",boxShadow:"0 2px 12px rgba(79,70,229,0.06)"}}>
        <table style={{borderCollapse:"collapse",minWidth:"100%",fontSize:12}}>
          <thead>
            <tr style={{background:"#f5f3ff"}}>
              <th style={{...TH,minWidth:200,textAlign:"left",position:"sticky",left:0,background:"#f5f3ff",zIndex:2}}>Employee</th>
              {Array.from({length:days},(_,i)=>i+1).map(d=>{const isSun=SUNDAYS.has(d);const isHol=HOLIDAYS.has(d);const isToday=d===TODAY;return(<th key={d} style={{...TH,minWidth:34,background:isToday?"#ede9fe":isHol?"#fef9c3":isSun?"#f9fafb":"#f5f3ff",color:isSun?"#9ca3af":isHol?"#ca8a04":isToday?"#4f46e5":"#6b7280"}}><div style={{fontSize:9,fontWeight:500}}>{DAY_SHORT[(3+d-1)%7]}</div><div style={{fontSize:12,fontWeight:700}}>{d}</div></th>);})}
              <th style={{...TH,minWidth:60,background:"#ede9fe",color:"#4f46e5"}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp,idx)=>{const p=countP(emp);return(<tr key={emp.id} style={{borderTop:"1px solid #f3f4f6",background:idx%2===0?"#fff":"#fafafa"}}><td style={{padding:"8px 12px",position:"sticky",left:0,background:idx%2===0?"#fff":"#fafafa",zIndex:1,borderRight:"1px solid #ede9fe"}}><div style={{display:"flex",alignItems:"center",gap:8}}><AvatarEl emp={emp} idx={idx}/><div><div style={{fontWeight:700,color:"#1e1b4b",fontSize:12}}>{emp.name}</div><div style={{color:"#9ca3af",fontSize:10}}>{emp.designation}</div></div></div></td>{Array.from({length:days},(_,i)=>i+1).map(d=>(<td key={d} style={{padding:"3px",textAlign:"center",background:SUNDAYS.has(d)?"rgba(249,250,251,0.8)":d===TODAY?"rgba(237,233,254,0.3)":"transparent"}}><Cell s={emp.attendance[d]??"-"}/></td>))}<td style={{padding:"8px",textAlign:"center",fontWeight:700,color:p>0?"#16a34a":"#dc2626",background:"#f5f3ff"}}>{p}/{workDays}</td></tr>);})}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── By Member Tab ──────────────────────────────────────────────────────────
function ByMemberTab({month,year}:{month:number;year:number}){
  const [selEmp,setSelEmp]=useState(EMPLOYEES[0].id);
  const emp=EMPLOYEES.find(e=>e.id===selEmp)||EMPLOYEES[0];
  const empIdx=EMPLOYEES.findIndex(e=>e.id===selEmp);
  const days=new Date(year,month+1,0).getDate();
  const workDays=Array.from({length:days},(_,i)=>i+1).filter(d=>!SUNDAYS.has(d)&&!HOLIDAYS.has(d)&&d<=TODAY).length;
  const summary={working:workDays,present:Object.values(emp.attendance).filter(s=>s==="P").length,late:Object.values(emp.attendance).filter(s=>s==="L").length,halfDay:Object.values(emp.attendance).filter(s=>s==="HD").length,absent:Object.values(emp.attendance).filter(s=>s==="A").length,holiday:Object.values(emp.attendance).filter(s=>s==="H").length};
  const THs:React.CSSProperties={padding:"10px 14px",fontWeight:700,fontSize:11,color:"#6b7280",textTransform:"uppercase" as const,letterSpacing:"0.04em",borderBottom:"2px solid #ede9fe",whiteSpace:"nowrap" as const,background:"#f9f9fb"};
  const TDs:React.CSSProperties={padding:"12px 14px",verticalAlign:"middle",fontSize:13,borderTop:"1px solid #f3f4f6"};
  function Badge({s}:{s:AttStatus}){const c=STATUS_CFG[s];if(s==="-")return <span style={{color:"#d1d5db",fontSize:12}}>—</span>;return(<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,background:c.badgeBg,color:c.badgeColor,fontSize:12,fontWeight:700}}><i className={c.icon} style={{fontSize:11}}/>{c.label}</span>);}
  return(
    <>
      <div style={{display:"flex",gap:12,marginBottom:"1.25rem",alignItems:"flex-end",flexWrap:"wrap" as const}}>
        <div><div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:5}}>Employee</div>
          <select value={selEmp} onChange={e=>setSelEmp(+e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,fontWeight:600,color:"#374151",background:"#fafafa",cursor:"pointer",outline:"none",minWidth:220}}>
            {EMPLOYEES.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      </div>
      <div className="row g-3" style={{marginBottom:"1.25rem"}}>
        {[{label:"Working Days",value:summary.working,color:"#4f46e5",bg:"#ede9fe",icon:"ri-calendar-2-line"},{label:"Days Present",value:summary.present,color:"#16a34a",bg:"#dcfce7",icon:"ri-checkbox-circle-line"},{label:"Late",value:summary.late,color:"#db2777",bg:"#fce7f3",icon:"ri-time-line"},{label:"Half Day",value:summary.halfDay,color:"#ea580c",bg:"#fed7aa",icon:"ri-contrast-line"},{label:"Absent",value:summary.absent,color:"#dc2626",bg:"#fee2e2",icon:"ri-close-circle-line"},{label:"Holidays",value:summary.holiday,color:"#ca8a04",bg:"#fef9c3",icon:"ri-star-line"}].map(c=>(
          <div key={c.label} className="col">
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",padding:"12px 14px",textAlign:"center",boxShadow:"0 2px 8px rgba(79,70,229,0.06)"}}>
              <div style={{width:36,height:36,borderRadius:8,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px"}}><i className={c.icon} style={{fontSize:18,color:c.color}}/></div>
              <div style={{fontSize:20,fontWeight:800,color:c.color}}>{c.value}</div>
              <div style={{fontSize:11,color:"#9ca3af",fontWeight:600}}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",overflow:"hidden",boxShadow:"0 2px 12px rgba(79,70,229,0.06)"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={{...THs,textAlign:"left"}}>Date</th><th style={{...THs,textAlign:"center"}}>Status</th><th style={{...THs,textAlign:"left"}}>Clock In</th><th style={{...THs,textAlign:"left"}}>Clock Out</th><th style={{...THs,textAlign:"center"}}>Total</th><th style={{...THs,textAlign:"center"}}>Others</th></tr></thead>
          <tbody>
            {Array.from({length:days},(_,i)=>days-i).map(d=>{const s=emp.attendance[d]??"-";const showClock=s==="P"||s==="HD"||s==="L";const h=showClock?(emp.hours?.[d]||0):0;return(<tr key={d} style={{background:d%2===0?"#fafafa":"#fff"}}><td style={TDs}><div style={{fontWeight:700,color:"#1e1b4b"}}>{`${String(d).padStart(2,"0")}-07-2026`}</div><div style={{fontSize:11,color:"#9ca3af"}}>{DAY_NAMES[(3+d-1)%7]}</div></td><td style={{...TDs,textAlign:"center"}}><Badge s={s}/></td><td style={TDs}><span style={{color:"#374151"}}>{showClock?ci(emp.id,d):"—"}</span></td><td style={TDs}><span style={{color:"#374151"}}>{showClock?co(emp.id,d):"—"}</span></td><td style={{...TDs,textAlign:"center"}}><span style={{fontWeight:700,color:h>0?"#16a34a":"#9ca3af"}}>{h>0?fmtHoursShort(h):"—"}</span></td><td style={{...TDs,textAlign:"center"}}>{showClock&&<button style={{fontSize:12,padding:"3px 10px",borderRadius:6,border:"1px solid #ede9fe",background:"#fafafa",color:"#4f46e5",cursor:"pointer",fontWeight:600}}><i className="ri-search-line"/> Details</button>}{!showClock&&<span style={{color:"#d1d5db"}}>—</span>}</td></tr>);})}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── By Hour Tab ────────────────────────────────────────────────────────────
function ByHourTab({month,year,dept,desg}:{month:number;year:number;dept:string;desg:string}){
  const [detail,setDetail]=useState<DetailState|null>(null);
  const days=new Date(year,month+1,0).getDate();
  const filtered=EMPLOYEES.filter(e=>(dept==="All"||e.department===dept)&&(desg==="All"||e.designation===desg));
  const TH:React.CSSProperties={padding:"8px 6px",textAlign:"center",fontWeight:700,color:"#6b7280",fontSize:11,whiteSpace:"nowrap",borderBottom:"2px solid #ede9fe"};
  return(
    <>
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",overflow:"auto",boxShadow:"0 2px 12px rgba(79,70,229,0.06)"}}>
        <div style={{padding:"10px 14px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap" as const,background:"#fafafa"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,fontSize:11}}>
            <span style={{width:18,height:18,borderRadius:4,background:"#fef9c3",border:"1px solid #fde68a",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#ca8a04"}}><i className="ri-star-line"/></span> Holiday
            <span style={{width:18,height:18,borderRadius:4,background:"#f3f4f6",border:"1px solid #e5e7eb",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#6b7280"}}><i className="ri-close-line"/></span> Day Off
            <span style={{width:18,height:18,borderRadius:4,background:"#fee2e2",border:"1px solid #fca5a5",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#dc2626"}}><i className="ri-close-line"/></span> Absent
            <span style={{padding:"0 6px",height:18,borderRadius:4,background:"#dcfce7",color:"#16a34a",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center"}}>2:41</span> Hours (click to view details
          </div>
        </div>
        <table style={{borderCollapse:"collapse",minWidth:"100%",fontSize:12}}>
          <thead>
            <tr style={{background:"#f5f3ff"}}>
              <th style={{...TH,minWidth:200,textAlign:"left",position:"sticky",left:0,background:"#f5f3ff",zIndex:2}}>Employee</th>
              {Array.from({length:days},(_,i)=>i+1).map(d=>{const isSun=SUNDAYS.has(d);const isHol=HOLIDAYS.has(d);const isToday=d===TODAY;return(<th key={d} style={{...TH,minWidth:40,background:isToday?"#ede9fe":isHol?"#fef9c3":isSun?"#f9fafb":"#f5f3ff",color:isSun?"#9ca3af":isHol?"#ca8a04":isToday?"#4f46e5":"#6b7280"}}><div style={{fontSize:9,fontWeight:500}}>{DAY_SHORT[(3+d-1)%7]}</div><div style={{fontSize:12,fontWeight:700}}>{d}</div></th>);})}
              <th style={{...TH,minWidth:70,background:"#ede9fe",color:"#4f46e5"}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp,idx)=>{
              const totalH=Object.values(emp.hours||{}).reduce((a,b)=>a+b,0);
              return(
                <tr key={emp.id} style={{borderTop:"1px solid #f3f4f6",background:idx%2===0?"#fff":"#fafafa"}}>
                  <td style={{padding:"8px 12px",position:"sticky",left:0,background:idx%2===0?"#fff":"#fafafa",zIndex:1,borderRight:"1px solid #ede9fe"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><AvatarEl emp={emp} idx={idx}/><div><div style={{fontWeight:700,color:"#1e1b4b",fontSize:12}}>{emp.name}</div><div style={{color:"#9ca3af",fontSize:10}}>{emp.designation}</div></div></div>
                  </td>
                  {Array.from({length:days},(_,i)=>i+1).map(d=>{
                    const s=emp.attendance[d]??"-";
                    const h=emp.hours?.[d]||0;
                    const isSun=SUNDAYS.has(d);const isHol=HOLIDAYS.has(d);
                    const isClickable=h>0&&!isSun&&!isHol&&d<=TODAY;
                    let cell;
                    if(d>TODAY) cell=<span style={{color:"#d1d5db",fontSize:11}}>—</span>;
                    else if(isHol) cell=<span style={{width:24,height:24,borderRadius:4,background:"#fef9c3",color:"#ca8a04",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11}}><i className="ri-star-line"/></span>;
                    else if(isSun||s==="DO") cell=<span style={{width:24,height:24,borderRadius:4,background:"#f3f4f6",color:"#9ca3af",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11}}><i className="ri-close-line"/></span>;
                    else if(s==="A") cell=<span style={{width:24,height:24,borderRadius:4,background:"#fee2e2",color:"#dc2626",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11}}><i className="ri-close-line"/></span>;
                    else if(s==="OL") cell=<span style={{width:24,height:24,borderRadius:4,background:"#fee2e2",color:"#dc2626",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11}}><i className="ri-plane-line"/></span>;
                    else if(h>0) cell=<span style={{padding:"2px 6px",borderRadius:4,background:"#dcfce7",color:"#16a34a",fontSize:11,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",border:"1px solid #bbf7d0"}}>{fmtHoursShort(h)}</span>;
                    else cell=<span style={{color:"#d1d5db",fontSize:11}}>—</span>;
                    return(
                      <td key={d} style={{padding:"4px 2px",textAlign:"center",background:isSun?"rgba(249,250,251,0.6)":d===TODAY?"rgba(237,233,254,0.2)":"transparent",cursor:isClickable?"pointer":"default"}}
                        onClick={isClickable?()=>setDetail({emp,day:d}):undefined}
                        >
                        {cell}
                      </td>
                    );
                  })}
                  <td style={{padding:"8px",textAlign:"center",fontWeight:700,color:totalH>0?"#4f46e5":"#9ca3af",background:"#f5f3ff"}}>{fmtHoursShort(totalH)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {detail&&<DetailModal detail={detail} empIdx={EMPLOYEES.findIndex(e=>e.id===detail.emp.id)} onClose={()=>setDetail(null)}/>}
    </>
  );
}

// ── By Location Tab ────────────────────────────────────────────────────────
function ByLocationTab(){
  const offices=[{name:"AHARNISH INFOTECH PRIVATE LIMITED (HO)",city:"Indore, MP",count:5},{name:"Branch Office – Bhopal",city:"Bhopal, MP",count:2},{name:"Remote / Work from Home",city:"—",count:1}];
  return(
    <div>
      <div className="row g-3" style={{marginBottom:"1.25rem"}}>
        {offices.map((o,i)=>(
          <div key={i} className="col-md-4">
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",padding:"16px",boxShadow:"0 2px 8px rgba(79,70,229,0.06)"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{width:40,height:40,borderRadius:10,background:i===2?"#f3f4f6":"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className={i===2?"ri-home-4-line":"ri-building-4-line"} style={{fontSize:20,color:i===2?"#6b7280":"#4f46e5"}}/></div>
                <div><div style={{fontSize:13,fontWeight:700,color:"#1e1b4b",lineHeight:1.4}}>{o.name}</div><div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{o.city}</div><div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:18,fontWeight:800,color:"#4f46e5"}}>{o.count}</span><span style={{fontSize:11,color:"#9ca3af",fontWeight:600}}>employees checked in</span></div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",overflow:"hidden",boxShadow:"0 2px 12px rgba(79,70,229,0.06)"}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid #f3f4f6"}}><span style={{fontWeight:700,fontSize:14,color:"#1e1b4b"}}><i className="ri-map-pin-2-line" style={{marginRight:6,color:"#4f46e5"}}/> Attendance by Location</span></div>
        <div style={{background:"#f5f3ff",minHeight:280,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",gap:12,padding:"2rem"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-map-2-line" style={{fontSize:30,color:"#7c3aed"}}/></div>
          <div style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:15,color:"#1e1b4b",marginBottom:4}}>Map View</div><div style={{fontSize:12,color:"#9ca3af",maxWidth:320}}>Connect Google Maps API in Settings → Integrations to enable live location tracking.</div></div>
          <button style={{padding:"8px 20px",borderRadius:8,border:"1.5px solid #c4b5fd",background:"#fff",color:"#7c3aed",fontSize:13,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}><i className="ri-settings-3-line"/> Configure Maps API</button>
        </div>
        <div style={{padding:"14px 18px",borderTop:"1px solid #f3f4f6"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:10}}>Today's Check-in Locations</div>
          {EMPLOYEES.filter(e=>e.attendance[TODAY]==="P"||e.attendance[TODAY]==="HD").map((emp,idx)=>(
            <div key={emp.id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderTop:idx>0?"1px solid #f3f4f6":"none"}}>
              <AvatarEl emp={emp} idx={EMPLOYEES.indexOf(emp)} size={30}/>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:"#1e1b4b"}}>{emp.name}</div><div style={{fontSize:11,color:"#9ca3af"}}>{emp.designation}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:11,fontWeight:600,color:"#4f46e5"}}>AHARNISH INFOTECH PRIVATE LIMITED (HO)</div><div style={{fontSize:10,color:"#9ca3af"}}>Indore, Madhya Pradesh</div></div>
              <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:20,background:"#dcfce7",color:"#16a34a",fontSize:10,fontWeight:700}}><span style={{width:5,height:5,borderRadius:"50%",background:"#16a34a",display:"inline-block"}}/> Office</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AttendancePage(){
  const [tab,  setTab]   = useState("summary");
  const [month,setMonth] = useState(6);
  const [year, setYear]  = useState(2026);
  const [dept, setDept]  = useState("All");
  const [desg, setDesg]  = useState("All");
  return(
    <div style={{padding:"1.5rem 0"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
        <div>
          <h4 style={{fontSize:20,fontWeight:800,color:"#1e1b4b",margin:0}}>Attendance</h4>
          <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}><span>Home</span><i className="ri-arrow-right-s-line" style={{margin:"0 4px"}}/><span style={{color:"#4f46e5"}}>Attendance</span></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"1.5px solid #ede9fe",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer"}}><i className="ri-download-2-line"/> Import</button>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"1.5px solid #ede9fe",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer"}}><i className="ri-upload-2-line"/> Export</button>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}><i className="ri-add-line"/> Mark Attendance</button>
        </div>
      </div>
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",marginBottom:"1.25rem",padding:"4px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap" as const,gap:8,boxShadow:"0 2px 8px rgba(79,70,229,0.05)"}}>
        <div style={{display:"flex",gap:2}}>
          {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:500,background:tab===t.id?"#ede9fe":"transparent",color:tab===t.id?"#4f46e5":"#6b7280"}}><i className={t.icon} style={{fontSize:15}}/>{t.label}</button>))}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap" as const,alignItems:"center"}}>
          {tab!=="by-member"&&<Sel label="Dept" value={dept} onChange={setDept} options={DEPTS}/>}
          {tab!=="by-member"&&<Sel label="Desig." value={desg} onChange={setDesg} options={DESGS}/>}
          <Sel label="Month" value={MONTHS[month]} onChange={v=>setMonth(MONTHS.indexOf(v))} options={MONTHS}/>
          <Sel label="Year" value={String(year)} onChange={v=>setYear(+v)} options={["2024","2025","2026","2027"]}/>
        </div>
      </div>
      {tab==="summary"     && <SummaryTab    month={month} year={year} dept={dept} desg={desg}/>}
      {tab==="by-member"   && <ByMemberTab   month={month} year={year}/>}
      {tab==="by-hour"     && <ByHourTab     month={month} year={year} dept={dept} desg={desg}/>}
      {tab==="by-location" && <ByLocationTab />}
    </div>
  );
}

const LBL:React.CSSProperties={display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:5};
const INP:React.CSSProperties={width:"100%",padding:"9px 12px",fontSize:13,borderRadius:8,border:"1.5px solid #e5e7eb",outline:"none",color:"#1f2937",background:"#fafafa"};
