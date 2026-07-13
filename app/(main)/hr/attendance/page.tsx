"use client";
import React, { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type AttStatus = "P"|"A"|"H"|"HD"|"L"|"OL"|"DO"|"-";
interface Emp { id:number; name:string; avatar:string; designation:string; department:string; attendance:Record<number,AttStatus>; clockIn?:Record<number,string>; clockOut?:Record<number,string>; hours?:Record<number,number>; }

// ── Constants ──────────────────────────────────────────────────────────────
const SUNDAYS  = new Set([5,12,19,26]);
const HOLIDAYS = new Set([15]);
const TODAY    = 14;
const MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DEPTS    = ["All","Management","Technology","HR","Finance"];
const DESGS    = ["All","CEO & Founder","Sr. Developer","Trainee","Intern","HR Manager","Accountant"];

const STATUS_CFG:{[k in AttStatus]:{label:string;bg:string;color:string;icon:string;badgeBg:string;badgeColor:string}}={
  P: {label:"Present", bg:"#dcfce7",color:"#16a34a",icon:"ri-check-line",         badgeBg:"#dcfce7",badgeColor:"#16a34a"},
  A: {label:"Absent",  bg:"#fee2e2",color:"#dc2626",icon:"ri-close-line",          badgeBg:"#fee2e2",badgeColor:"#dc2626"},
  H: {label:"Holiday", bg:"#fef9c3",color:"#ca8a04",icon:"ri-star-line",           badgeBg:"#fef9c3",badgeColor:"#ca8a04"},
  HD:{label:"Half Day",bg:"#fed7aa",color:"#ea580c",icon:"ri-contrast-line",       badgeBg:"#fed7aa",badgeColor:"#ea580c"},
  L: {label:"Late",    bg:"#fce7f3",color:"#db2777",icon:"ri-time-line",           badgeBg:"#fce7f3",badgeColor:"#db2777"},
  OL:{label:"On Leave",bg:"#fee2e2",color:"#dc2626",icon:"ri-plane-line",           badgeBg:"#fee2e2",badgeColor:"#dc2626"},
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
    r[d]=v<4?0:Math.round((5.5+((seed*d)%30)/10)*10)/10;
  }
  return r;
}
function fmtHours(h:number){
  if(!h)return"-";
  const hr=Math.floor(h); const mn=Math.round((h-hr)*60);
  return `${hr}:${mn.toString().padStart(2,"0")}`;
}
const CIN  = ["09:00","09:15","09:30","09:45","10:00","10:15"];
const COUT = ["05:00 pm","05:15 pm","05:30 pm","06:00 pm","06:30 pm"];
function mockClockIn(seed:number,d:number){ return CIN[((seed*d)&0x7fffffff)%CIN.length]; }
function mockClockOut(seed:number,d:number){ return COUT[((seed*d)&0x7fffffff)%COUT.length]; }

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
const AVATAR_COLORS=["#4f46e5","#7c3aed","#0284c7","#16a34a","#dc2626","#db2777","#ea580c","#ca8a04"];

const DAY_NAMES=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function dayName(d:number){return DAY_NAMES[(3+d-1)%7];}
function dayDate(d:number){ return new Date(2026,6,d).toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"}); }

// ── Small Components ───────────────────────────────────────────────────────
function Cell({s}:{s:AttStatus}){
  const c=STATUS_CFG[s];
  if(s==="-") return <span style={{color:"#d1d5db",fontSize:11}}>—</span>;
  return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:26,height:26,borderRadius:6,background:c.bg,color:c.color,fontSize:13}} title={c.label}><i className={c.icon}/></span>;
}
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
function Badge({s}:{s:AttStatus}){
  const c=STATUS_CFG[s];
  if(s==="-")return <span style={{color:"#d1d5db",fontSize:12}}>—</span>;
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,background:c.badgeBg,color:c.badgeColor,fontSize:12,fontWeight:700}}>
      <i className={c.icon} style={{fontSize:11}}/>{c.label}
    </span>
  );
}
function AvatarEl({emp,idx}:{emp:Emp;idx:number}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:32,height:32,borderRadius:"50%",background:AVATAR_COLORS[idx%AVATAR_COLORS.length],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:11,flexShrink:0}}>{emp.avatar}</div>
      <div>
        <div style={{fontWeight:700,color:"#1e1b4b",fontSize:12,whiteSpace:"nowrap"}}>{emp.name}</div>
        <div style={{color:"#9ca3af",fontSize:10}}>{emp.designation}</div>
      </div>
    </div>
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
  return(
    <>
      <div className="row g-3" style={{marginBottom:"1.25rem"}}>
        {[
          {label:"Total Employees",value:filtered.length,icon:"ri-group-line",color:"#4f46e5",bg:"#ede9fe"},
          {label:"Present Today",value:todayP,icon:"ri-checkbox-circle-line",color:"#16a34a",bg:"#dcfce7"},
          {label:"Absent Today",value:todayA,icon:"ri-close-circle-line",color:"#dc2626",bg:"#fee2e2"},
          {label:"On Leave",value:todayL,icon:"ri-calendar-close-line",color:"#0284c7",bg:"#e0f2fe"},
          {label:"Working Days",value:workDays,icon:"ri-calendar-2-line",color:"#7c3aed",bg:"#f3e8ff"},
        ].map(c=>(
          <div key={c.label} className="col">
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",padding:"14px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(79,70,229,0.06)"}}>
              <div style={{width:42,height:42,borderRadius:10,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <i className={c.icon} style={{fontSize:20,color:c.color}}/>
              </div>
              <div>
                <div style={{fontSize:22,fontWeight:800,color:c.color,lineHeight:1}}>{c.value}</div>
                <div style={{fontSize:11,color:"#9ca3af",fontWeight:600,marginTop:2}}>{c.label}</div>
              </div>
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
              {Array.from({length:days},(_,i)=>i+1).map(d=>{
                const dn=dayName(d); const isSun=SUNDAYS.has(d); const isHol=HOLIDAYS.has(d); const isToday=d===TODAY;
                return(
                  <th key={d} style={{...TH,minWidth:34,background:isToday?"#ede9fe":isHol?"#fef9c3":isSun?"#f9fafb":"#f5f3ff",color:isSun?"#9ca3af":isHol?"#ca8a04":isToday?"#4f46e5":"#6b7280"}}>
                    <div style={{fontSize:9,fontWeight:500}}>{dn}</div>
                    <div style={{fontSize:12,fontWeight:700}}>{d}</div>
                  </th>
                );
              })}
              <th style={{...TH,minWidth:60,background:"#ede9fe",color:"#4f46e5"}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp,idx)=>{
              const p=countP(emp);
              return(
                <tr key={emp.id} style={{borderTop:"1px solid #f3f4f6",background:idx%2===0?"#fff":"#fafafa"}}>
                  <td style={{padding:"8px 12px",position:"sticky",left:0,background:idx%2===0?"#fff":"#fafafa",zIndex:1,borderRight:"1px solid #ede9fe"}}>
                    <AvatarEl emp={emp} idx={idx}/>
                  </td>
                  {Array.from({length:days},(_,i)=>i+1).map(d=>(
                    <td key={d} style={{padding:"3px",textAlign:"center",background:SUNDAYS.has(d)?"rgba(249,250,251,0.8)":d===TODAY?"rgba(237,233,254,0.3)":"transparent"}}>
                      <Cell s={emp.attendance[d]??"-"}/>
                    </td>
                  ))}
                  <td style={{padding:"8px",textAlign:"center",fontWeight:700,color:p>0?"#16a34a":"#dc2626",background:"#f5f3ff"}}>{p}/{workDays}</td>
                </tr>
              );
            })}
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
  const summary={
    working:workDays,
    present:Object.values(emp.attendance).filter(s=>s==="P").length,
    late:Object.values(emp.attendance).filter(s=>s==="L").length,
    halfDay:Object.values(emp.attendance).filter(s=>s==="HD").length,
    absent:Object.values(emp.attendance).filter(s=>s==="A").length,
    holiday:Object.values(emp.attendance).filter(s=>s==="H").length,
  };
  const THs:React.CSSProperties={padding:"10px 14px",fontWeight:700,fontSize:11,color:"#6b7280",textTransform:"uppercase" as const,letterSpacing:"0.04em",borderBottom:"2px solid #ede9fe",whiteSpace:"nowrap" as const,background:"#f9f9fb"};
  const TDs:React.CSSProperties={padding:"12px 14px",verticalAlign:"middle",fontSize:13,borderTop:"1px solid #f3f4f6"};
  return(
    <>
      <div style={{display:"flex",gap:12,marginBottom:"1.25rem",alignItems:"flex-end",flexWrap:"wrap" as const}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:5}}>Employee</div>
          <select value={selEmp} onChange={e=>setSelEmp(+e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,fontWeight:600,color:"#374151",background:"#fafafa",cursor:"pointer",outline:"none",minWidth:220}}>
            {EMPLOYEES.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      </div>
      {/* Summary cards */}
      <div className="row g-3" style={{marginBottom:"1.25rem"}}>
        {[
          {label:"Working Days",value:summary.working,color:"#4f46e5",bg:"#ede9fe",icon:"ri-calendar-2-line"},
          {label:"Days Present", value:summary.present, color:"#16a34a",bg:"#dcfce7",icon:"ri-checkbox-circle-line"},
          {label:"Late",         value:summary.late,    color:"#db2777",bg:"#fce7f3",icon:"ri-time-line"},
          {label:"Half Day",     value:summary.halfDay, color:"#ea580c",bg:"#fed7aa",icon:"ri-contrast-line"},
          {label:"Absent",       value:summary.absent,  color:"#dc2626",bg:"#fee2e2",icon:"ri-close-circle-line"},
          {label:"Holidays",     value:summary.holiday, color:"#ca8a04",bg:"#fef9c3",icon:"ri-star-line"},
        ].map(c=>(
          <div key={c.label} className="col">
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",padding:"12px 14px",textAlign:"center",boxShadow:"0 2px 8px rgba(79,70,229,0.06)"}}>
              <div style={{width:36,height:36,borderRadius:8,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px"}}>
                <i className={c.icon} style={{fontSize:18,color:c.color}}/>
              </div>
              <div style={{fontSize:20,fontWeight:800,color:c.color}}>{c.value}</div>
              <div style={{fontSize:11,color:"#9ca3af",fontWeight:600}}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",overflow:"hidden",boxShadow:"0 2px 12px rgba(79,70,229,0.06)"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr>
              <th style={{...THs,textAlign:"left"}}>Date</th>
              <th style={{...THs,textAlign:"center"}}>Status</th>
              <th style={{...THs,textAlign:"left"}}>Clock In</th>
              <th style={{...THs,textAlign:"left"}}>Clock Out</th>
              <th style={{...THs,textAlign:"center"}}>Total</th>
              <th style={{...THs,textAlign:"center"}}>Others</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({length:days},(_,i)=>days-i).map(d=>{
              const s=emp.attendance[d]??"-";
              const showClock=s==="P"||s==="HD"||s==="L";
              const ci=showClock?mockClockIn(emp.id,d):null;
              const co=showClock?mockClockOut(emp.id,d):null;
              const hrs=showClock?(emp.hours?.[d]||0):0;
              const dn=dayName(d);
              return(
                <tr key={d} style={{background:d%2===0?"#fafafa":"#fff"}}>
                  <td style={TDs}>
                    <div style={{fontWeight:700,color:"#1e1b4b"}}>{dayDate(d)}</div>
                    <div style={{fontSize:11,color:"#9ca3af"}}>{dn}</div>
                  </td>
                  <td style={{...TDs,textAlign:"center"}}><Badge s={s}/></td>
                  <td style={TDs}><span style={{color:"#374151"}}>{ci||"—"}</span></td>
                  <td style={TDs}><span style={{color:"#374151"}}>{co||"—"}</span></td>
                  <td style={{...TDs,textAlign:"center"}}><span style={{fontWeight:700,color:hrs>0?"#16a34a":"#9ca3af"}}>{hrs>0?fmtHours(hrs):"—"}</span></td>
                  <td style={{...TDs,textAlign:"center"}}>
                    {showClock&&<button style={{fontSize:12,padding:"3px 10px",borderRadius:6,border:"1px solid #ede9fe",background:"#fafafa",color:"#4f46e5",cursor:"pointer",fontWeight:600}}><i className="ri-search-line"/> Details</button>}
                    {!showClock&&<span style={{color:"#d1d5db"}}>—</span>}
                  </td>
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
function ByHourTab({month,year,dept,desg}:{month:number;year:number;dept:string;desg:string}){
  const days=new Date(year,month+1,0).getDate();
  const filtered=EMPLOYEES.filter(e=>(dept==="All"||e.department===dept)&&(desg==="All"||e.designation===desg));
  const TH:React.CSSProperties={padding:"8px 6px",textAlign:"center",fontWeight:700,color:"#6b7280",fontSize:11,whiteSpace:"nowrap",borderBottom:"2px solid #ede9fe"};
  return(
    <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",overflow:"auto",boxShadow:"0 2px 12px rgba(79,70,229,0.06)"}}>
      <div style={{padding:"10px 14px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap" as const,background:"#fafafa"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:11}}>
          <span style={{width:18,height:18,borderRadius:4,background:"#fef9c3",border:"1px solid #fde68a",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#ca8a04"}}><i className="ri-star-line"/></span> Holiday
          <span style={{width:18,height:18,borderRadius:4,background:"#f3f4f6",border:"1px solid #e5e7eb",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#6b7280"}}><i className="ri-close-line"/></span> Day Off
          <span style={{width:18,height:18,borderRadius:4,background:"#fee2e2",border:"1px solid #fca5a5",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#dc2626"}}><i className="ri-close-line"/></span> Absent
          <span style={{padding:"0 6px",height:18,borderRadius:4,background:"#dcfce7",color:"#16a34a",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center"}}>2:41</span> Hours Worked
        </div>
      </div>
      <table style={{borderCollapse:"collapse",minWidth:"100%",fontSize:12}}>
        <thead>
          <tr style={{background:"#f5f3ff"}}>
            <th style={{...TH,minWidth:200,textAlign:"left",position:"sticky",left:0,background:"#f5f3ff",zIndex:2}}>Employee</th>
            {Array.from({length:days},(_,i)=>i+1).map(d=>{
              const isSun=SUNDAYS.has(d); const isHol=HOLIDAYS.has(d); const isToday=d===TODAY;
              return(
                <th key={d} style={{...TH,minWidth:40,background:isToday?"#ede9fe":isHol?"#fef9c3":isSun?"#f9fafb":"#f5f3ff",color:isSun?"#9ca3af":isHol?"#ca8a04":isToday?"#4f46e5":"#6b7280"}}>
                  <div style={{fontSize:9,fontWeight:500}}>{dayName(d)}</div>
                  <div style={{fontSize:12,fontWeight:700}}>{d}</div>
                </th>
              );
            })}
            <th style={{...TH,minWidth:70,background:"#ede9fe",color:"#4f46e5"}}>Total</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((emp,idx)=>{
            const totalH=Object.values(emp.hours||{}).reduce((a,b)=>a+b,0);
            return(
              <tr key={emp.id} style={{borderTop:"1px solid #f3f4f6",background:idx%2===0?"#fff":"#fafafa"}}>
                <td style={{padding:"8px 12px",position:"sticky",left:0,background:idx%2===0?"#fff":"#fafafa",zIndex:1,borderRight:"1px solid #ede9fe"}}>
                  <AvatarEl emp={emp} idx={idx}/>
                </td>
                {Array.from({length:days},(_,i)=>i+1).map(d=>{
                  const s=emp.attendance[d]??"-";
                  const h=emp.hours?.[d]||0;
                  const isSun=SUNDAYS.has(d); const isHol=HOLIDAYS.has(d);
                  let cell;
                  if(d>TODAY) cell=<span style={{color:"#d1d5db",fontSize:11}}>—</span>;
                  else if(isHol) cell=<span style={{width:24,height:24,borderRadius:4,background:"#fef9c3",color:"#ca8a04",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11}}><i className="ri-star-line"/></span>;
                  else if(isSun||s==="DO") cell=<span style={{width:24,height:24,borderRadius:4,background:"#f3f4f6",color:"#9ca3af",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11}}><i className="ri-close-line"/></span>;
                  else if(s==="A") cell=<span style={{width:24,height:24,borderRadius:4,background:"#fee2e2",color:"#dc2626",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11}}><i className="ri-close-line"/></span>;
                  else if(s==="OL") cell=<span style={{width:24,height:24,borderRadius:4,background:"#e0f2fe",color:"#0284c7",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11}}><i className="ri-logout-box-line"/></span>;
                  else if(h>0) cell=<span style={{padding:"2px 5px",borderRadius:4,background:"#dcfce7",color:"#16a34a",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{fmtHours(h)}</span>;
                  else cell=<span style={{color:"#d1d5db",fontSize:11}}>—</span>;
                  return <td key={d} style={{padding:"4px 2px",textAlign:"center",background:isSun?"rgba(249,250,251,0.6)":d===TODAY?"rgba(237,233,254,0.2)":"transparent"}}>{cell}</td>;
                })}
                <td style={{padding:"8px",textAlign:"center",fontWeight:700,color:totalH>0?"#4f46e5":"#9ca3af",background:"#f5f3ff"}}>{fmtHours(totalH)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── By Location Tab ────────────────────────────────────────────────────────
function ByLocationTab(){
  const offices=[
    {name:"AHARNISH INFOTECH PRIVATE LIMITED (HO)", lat:22.7, lng:75.8, count:5, city:"Indore, MP"},
    {name:"Branch Office – Bhopal", lat:23.2, lng:77.4, count:2, city:"Bhopal, MP"},
    {name:"Remote / Work from Home", lat:null, lng:null, count:1, city:"—"},
  ];
  return(
    <div>
      <div className="row g-3" style={{marginBottom:"1.25rem"}}>
        {offices.map((o,i)=>(
          <div key={i} className="col-md-4">
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",padding:"16px",boxShadow:"0 2px 8px rgba(79,70,229,0.06)"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{width:40,height:40,borderRadius:10,background:i===2?"#f3f4f6":"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <i className={i===2?"ri-home-4-line":"ri-building-4-line"} style={{fontSize:20,color:i===2?"#6b7280":"#4f46e5"}}/>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#1e1b4b",lineHeight:1.4}}>{o.name}</div>
                  <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{o.city}</div>
                  <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:18,fontWeight:800,color:"#4f46e5"}}>{o.count}</span>
                    <span style={{fontSize:11,color:"#9ca3af",fontWeight:600}}>employees checked in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",overflow:"hidden",boxShadow:"0 2px 12px rgba(79,70,229,0.06)"}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontWeight:700,fontSize:14,color:"#1e1b4b"}}><i className="ri-map-pin-2-line" style={{marginRight:6,color:"#4f46e5"}}/> Attendance by Location — {new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}</span>
        </div>
        <div style={{background:"#f5f3ff",minHeight:340,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",gap:12,padding:"2rem"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="ri-map-2-line" style={{fontSize:30,color:"#7c3aed"}}/>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontWeight:700,fontSize:15,color:"#1e1b4b",marginBottom:4}}>Map View</div>
            <div style={{fontSize:12,color:"#9ca3af",maxWidth:320}}>Live map integration requires Google Maps API configuration. Connect your API key in Settings → Integrations to enable location-based attendance tracking.</div>
          </div>
          <button style={{padding:"8px 20px",borderRadius:8,border:"1.5px solid #c4b5fd",background:"#fff",color:"#7c3aed",fontSize:13,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
            <i className="ri-settings-3-line"/> Configure Maps API
          </button>
        </div>
        {/* Employee location list */}
        <div style={{padding:"14px 18px",borderTop:"1px solid #f3f4f6"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:10}}>Today's Check-in Locations</div>
          {EMPLOYEES.filter(e=>e.attendance[TODAY]==="P"||e.attendance[TODAY]==="HD").map((emp,idx)=>(
            <div key={emp.id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderTop:idx>0?"1px solid #f3f4f6":"none"}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:AVATAR_COLORS[EMPLOYEES.indexOf(emp)%AVATAR_COLORS.length],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:10,flexShrink:0}}>{emp.avatar}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:"#1e1b4b"}}>{emp.name}</div>
                <div style={{fontSize:11,color:"#9ca3af"}}>{emp.designation}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,fontWeight:600,color:"#4f46e5"}}>AHARNISH INFOTECH PRIVATE LIMITED (HO)</div>
                <div style={{fontSize:10,color:"#9ca3af"}}>Indore, Madhya Pradesh</div>
              </div>
              <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:20,background:"#dcfce7",color:"#16a34a",fontSize:10,fontWeight:700}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:"#16a34a",display:"inline-block"}}/> Office
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AttendancePage(){
  const [tab,    setTab]    = useState("summary");
  const [month,  setMonth]  = useState(6);
  const [year,   setYear]   = useState(2026);
  const [dept,   setDept]   = useState("All");
  const [desg,   setDesg]   = useState("All");

  return(
    <div style={{padding:"1.5rem 0"}}>
      {/* Page Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
        <div>
          <h4 style={{fontSize:20,fontWeight:800,color:"#1e1b4b",margin:0}}>Attendance</h4>
          <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>
            <span>Home</span><i className="ri-arrow-right-s-line" style={{margin:"0 4px"}}/><span style={{color:"#4f46e5"}}>Attendance</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"1.5px solid #ede9fe",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer"}}><i className="ri-download-2-line"/> Import</button>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"1.5px solid #ede9fe",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer"}}><i className="ri-upload-2-line"/> Export</button>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}><i className="ri-add-line"/> Mark Attendance</button>
        </div>
      </div>

      {/* Tabs + Filters row */}
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",marginBottom:"1.25rem",padding:"4px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap" as const,gap:8,boxShadow:"0 2px 8px rgba(79,70,229,0.05)"}}>
        <div style={{display:"flex",gap:2}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:500,background:tab===t.id?"#ede9fe":"transparent",color:tab===t.id?"#4f46e5":"#6b7280",transition:"all 0.15s"}}>
              <i className={t.icon} style={{fontSize:15}}/>{t.label}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap" as const,alignItems:"center"}}>
          {tab!=="by-member"&&<Sel label="Dept" value={dept} onChange={setDept} options={DEPTS}/>}
          {tab!=="by-member"&&<Sel label="Desig." value={desg} onChange={setDesg} options={DESGS}/>}
          <Sel label="Month" value={MONTHS[month]} onChange={v=>setMonth(MONTHS.indexOf(v))} options={MONTHS}/>
          <Sel label="Year" value={String(year)} onChange={v=>setYear(+v)} options={["2024","2025","2026","2027"]}/>
        </div>
      </div>

      {/* Tab Content */}
      {tab==="summary"     && <SummaryTab    month={month} year={year} dept={dept} desg={desg}/>}
      {tab==="by-member"   && <ByMemberTab   month={month} year={year}/>}
      {tab==="by-hour"     && <ByHourTab     month={month} year={year} dept={dept} desg={desg}/>}
      {tab==="by-location" && <ByLocationTab />}
    </div>
  );
}
