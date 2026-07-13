"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ── Country flag mapping ───────────────────────────────────────────────────
const COUNTRY_FLAGS: Record<string,string> = {
  "India":"🇮🇳","United States":"🇺🇸","United Kingdom":"🇬🇧","Canada":"🇨🇦",
  "Australia":"🇦🇺","Germany":"🇩🇪","France":"🇫🇷","Japan":"🇯🇵","Singapore":"🇸🇬","UAE":"🇦🇪",
};

// ── Mock employee data (keyed by id param) ─────────────────────────────────
const EMP_DB: Record<string, {
  id:string; name:string; salutation:string; avatar:string; photo?:string;
  designation:string; department:string; email:string; mobile:string;
  gender:string; dob:string; workAnniversary:string; joining:string;
  employmentType:string; maritalStatus:string; marriageAnniversary:string;
  country:string; address:string; skills:string[]; language:string;
  slackId:string; hourlyRate:string; probationEnd:string; noticePeriodStart:string;
  noticePeriodEnd:string; userRole:string; reportingTo:string | null;
  reportingTeam:{name:string;designation:string;avatar:string}[];
  status:string; lastLogin:string; openTasks:number; hoursLogged:number; tickets:number;
  lateAttendance:number; leavesTaken:number; exitDate?:string;
}> = {
  "1": {
    id:"EMP-001", name:"Mukteshwar Sharma", salutation:"Mr.", avatar:"MS",
    designation:"CEO & Founder", department:"Management", email:"itsmukteshwar@gmail.com",
    mobile:"+91-91955-22972", gender:"Male", dob:"14 September",
    workAnniversary:"3 months from now", joining:"01-01-2022",
    employmentType:"Full Time", maritalStatus:"Married", marriageAnniversary:"29 November",
    country:"India", address:"S-3, Aala Apartment Bagh Dilkusha, Lala Lajpat Rai Colony",
    skills:["React","Next.js","TypeScript","Product Management","UI/UX"],
    language:"English", slackId:"U0MUKSHE01", hourlyRate:"₹2,500",
    probationEnd:"—", noticePeriodStart:"—", noticePeriodEnd:"—",
    userRole:"Super Admin", reportingTo:null,
    reportingTeam:[{name:"Sanjana Goldar",designation:"Intern",avatar:"SG"},{name:"Akash Rai",designation:"Sr. Developer",avatar:"AR"}],
    status:"Active", lastLogin:"14-07-2026 12:58 am",
    openTasks:0, hoursLogged:0, tickets:0,
    lateAttendance:0, leavesTaken:0,
  },
  "2": {
    id:"EMP-002", name:"Akash Rai", salutation:"Mr.", avatar:"AR",
    designation:"Sr. Developer", department:"Technology", email:"akash@zeroform.in",
    mobile:"+91-98765-43210", gender:"Male", dob:"22 March",
    workAnniversary:"Joined 15 Mar 2022", joining:"15-03-2022",
    employmentType:"Full Time", maritalStatus:"Single", marriageAnniversary:"—",
    country:"India", address:"B-12, Vijay Nagar, Indore, MP",
    skills:["Laravel","MySQL","PHP","REST API","Vue.js"],
    language:"English", slackId:"U0AKASH02", hourlyRate:"₹1,800",
    probationEnd:"15-06-2022", noticePeriodStart:"—", noticePeriodEnd:"—",
    userRole:"Developer", reportingTo:"Mukteshwar Sharma",
    reportingTeam:[{name:"Harsh Mishra",designation:"Trainee",avatar:"HM"}],
    status:"Active", lastLogin:"13-07-2026 06:30 pm",
    openTasks:2, hoursLogged:9, tickets:1,
    lateAttendance:3, leavesTaken:2,
  },
};

// Default fallback for other IDs
function getEmp(id: string) {
  return EMP_DB[id] ?? EMP_DB["1"];
}

const TABS = [
  {id:"profile",    label:"Profile",             icon:"ri-user-3-line"},
  {id:"tasks",      label:"Tasks",               icon:"ri-task-line"},
  {id:"leaves",     label:"Leaves",              icon:"ri-calendar-close-line"},
  {id:"leaves-quota",label:"Leaves Quota",       icon:"ri-umbrella-line"},
  {id:"timesheet",  label:"Timesheet",           icon:"ri-time-line"},
  {id:"documents",  label:"Documents",           icon:"ri-folder-open-line"},
  {id:"emergency",  label:"Emergency Contacts",  icon:"ri-alarm-warning-line"},
  {id:"tickets",    label:"Tickets",             icon:"ri-customer-service-2-line"},
  {id:"appreciation",label:"Appreciation",       icon:"ri-award-line"},
  {id:"shift-roster",label:"Shift Roster",       icon:"ri-calendar-2-line"},
  {id:"permissions", label:"Permissions",        icon:"ri-shield-user-line"},
  {id:"activity",   label:"Activity",            icon:"ri-pulse-line"},
];

const AVATAR_COLORS = ["#4f46e5","#7c3aed","#0284c7","#16a34a","#dc2626","#db2777","#ea580c","#ca8a04"];

function InfoRow({label, value, highlight}:{label:string;value:React.ReactNode;highlight?:boolean}) {
  return (
    <div style={{display:"flex",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid #f3f4f6"}}>
      <span style={{minWidth:200,fontSize:12,fontWeight:600,color:"#9ca3af",flexShrink:0}}>{label}</span>
      <span style={{fontSize:13,color:highlight?"#4f46e5":"#1e1b4b",fontWeight:highlight?700:500,wordBreak:"break-word"}}>{value||"—"}</span>
    </div>
  );
}

function EmptyState({icon,label}:{icon:string;label:string}) {
  return (
    <div style={{textAlign:"center",padding:"2rem",color:"#d1d5db"}}>
      <i className={icon} style={{fontSize:32,display:"block",marginBottom:8}}/>
      <div style={{fontSize:12,fontWeight:600}}>{label}</div>
    </div>
  );
}

export default function EmployeeProfilePage() {
  const params = useParams();
  const id = String(params?.id ?? "1");
  const emp = getEmp(id);
  const [tab, setTab] = useState("profile");

  const flag = COUNTRY_FLAGS[emp.country] ?? "🌐";
  const avatarColor = AVATAR_COLORS[(parseInt(emp.id.replace("EMP-",""))-1) % AVATAR_COLORS.length];

  return (
    <div style={{padding:"1.5rem 0"}}>
      {/* Breadcrumb */}
      <div style={{fontSize:12,color:"#9ca3af",marginBottom:"1rem",display:"flex",alignItems:"center",gap:4}}>
        <Link href="/dashboard" style={{color:"#9ca3af",textDecoration:"none"}}>Home</Link>
        <i className="ri-arrow-right-s-line"/>
        <Link href="/hr/employees" style={{color:"#9ca3af",textDecoration:"none"}}>Employees</Link>
        <i className="ri-arrow-right-s-line"/>
        <span style={{color:"#4f46e5",fontWeight:600}}>{emp.name}</span>
      </div>

      {/* ── Hero Card ── */}
      <div style={{background:"#fff",borderRadius:16,border:"1px solid #ede9fe",marginBottom:"1.25rem",overflow:"hidden",boxShadow:"0 2px 16px rgba(79,70,229,0.07)"}}>
        {/* Purple banner */}
        <div style={{height:80,background:"linear-gradient(135deg,#4f46e5 0%,#7c3aed 60%,#9333ea 100%)",position:"relative"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 20% 50%,rgba(255,255,255,0.08) 0%,transparent 60%)"}}/>
        </div>

        <div style={{padding:"0 24px 20px",position:"relative"}}>
          {/* Avatar — overlaps banner */}
          <div style={{position:"relative",display:"inline-block",marginTop:-44,marginBottom:12}}>
            <div style={{width:88,height:88,borderRadius:"50%",background:avatarColor,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:28,border:"4px solid #fff",boxShadow:"0 4px 16px rgba(79,70,229,0.25)"}}>
              {emp.avatar}
            </div>
            <span style={{position:"absolute",bottom:2,right:2,width:20,height:20,borderRadius:"50%",background:emp.status==="Active"?"#16a34a":"#dc2626",border:"3px solid #fff",display:"block"}}/>
          </div>

          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <h4 style={{fontSize:20,fontWeight:800,color:"#1e1b4b",margin:0}}>{emp.salutation} {emp.name}</h4>
                <span style={{fontSize:18}} title={emp.country}>{flag}</span>
                <span style={{fontSize:11,fontWeight:700,color:"#4f46e5",background:"#ede9fe",padding:"2px 10px",borderRadius:20}}>{emp.userRole}</span>
                <span style={{fontSize:11,fontWeight:700,color:emp.status==="Active"?"#16a34a":"#dc2626",background:emp.status==="Active"?"#dcfce7":"#fee2e2",padding:"2px 10px",borderRadius:20,display:"inline-flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:emp.status==="Active"?"#16a34a":"#dc2626",display:"inline-block"}}/>{emp.status}</span>
              </div>
              <div style={{fontSize:13,color:"#6b7280",marginTop:4}}>
                {emp.designation} <span style={{color:"#d1d5db",margin:"0 6px"}}>·</span> {emp.department}
                <span style={{color:"#d1d5db",margin:"0 6px"}}>·</span>
                <span style={{fontSize:11,color:"#9ca3af"}}>Last login: {emp.lastLogin}</span>
              </div>
              <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{emp.id}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Link href="/hr/employees" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:12,fontWeight:600,textDecoration:"none"}}><i className="ri-arrow-left-line"/> Back</Link>
              <button style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}><i className="ri-edit-line"/> Edit Profile</button>
              <button style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:12,fontWeight:600,cursor:"pointer"}}><i className="ri-more-2-line"/></button>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{display:"flex",gap:0,marginTop:16,background:"#f9fafb",borderRadius:12,border:"1px solid #f3f4f6",overflow:"hidden"}}>
            {[
              {label:"Open Tasks",   value:emp.openTasks,   icon:"ri-task-line",           color:"#4f46e5"},
              {label:"Hours Logged", value:emp.hoursLogged, icon:"ri-time-line",           color:"#7c3aed"},
              {label:"Tickets",      value:emp.tickets,     icon:"ri-customer-service-2-line",color:"#0284c7"},
              {label:"Late Entries", value:emp.lateAttendance,icon:"ri-alarm-warning-line",color:"#db2777"},
              {label:"Leaves Taken", value:emp.leavesTaken, icon:"ri-plane-line",          color:"#dc2626"},
            ].map((s,i)=>(
              <div key={s.label} style={{flex:1,padding:"12px 16px",borderLeft:i>0?"1px solid #e5e7eb":"none",textAlign:"center"}}>
                <i className={s.icon} style={{fontSize:16,color:s.color,display:"block",marginBottom:4}}/>
                <div style={{fontSize:18,fontWeight:800,color:"#1e1b4b"}}>{s.value}</div>
                <div style={{fontSize:10,color:"#9ca3af",fontWeight:600}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",marginBottom:"1.25rem",overflowX:"auto",boxShadow:"0 2px 8px rgba(79,70,229,0.05)"}}>
        <div style={{display:"flex",gap:0,minWidth:"max-content"}}>
          {TABS.map((t,i)=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{display:"flex",alignItems:"center",gap:5,padding:"11px 16px",border:"none",borderBottom:tab===t.id?"2.5px solid #4f46e5":"2.5px solid transparent",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:tab===t.id?700:500,color:tab===t.id?"#4f46e5":"#6b7280",whiteSpace:"nowrap",transition:"all 0.15s"}}>
              <i className={t.icon} style={{fontSize:13}}/>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      {tab === "profile" && (
        <div className="row g-4">
          {/* Left — Profile Info */}
          <div className="col-md-8">
            <div style={{background:"#fff",borderRadius:14,border:"1px solid #ede9fe",overflow:"hidden",boxShadow:"0 2px 12px rgba(79,70,229,0.05)"}}>
              <div style={{padding:"14px 20px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-id-card-line" style={{fontSize:16,color:"#4f46e5"}}/></div>
                <span style={{fontWeight:800,fontSize:14,color:"#1e1b4b"}}>Profile Information</span>
              </div>
              <div style={{padding:"4px 20px 16px"}}>
                <InfoRow label="Employee ID" value={<span style={{fontFamily:"monospace",fontWeight:700,color:"#4f46e5"}}>{emp.id}</span>}/>
                <InfoRow label="Full Name" value={`${emp.salutation} ${emp.name}`}/>
                <InfoRow label="Designation" value={emp.designation}/>
                <InfoRow label="Department" value={emp.department}/>
                <InfoRow label="Gender" value={emp.gender==="Male"?"♂ Male":"♀ Female"}/>
                <InfoRow label="Date of Birth" value={emp.dob}/>
                <InfoRow label="Work Anniversary" value={emp.workAnniversary}/>
                <InfoRow label="Joining Date" value={emp.joining}/>
                <InfoRow label="Employment Type" value={<span style={{display:"inline-flex",alignItems:"center",gap:5,color:"#16a34a",background:"#dcfce7",padding:"2px 10px",borderRadius:20,fontSize:12,fontWeight:700}}>{emp.employmentType}</span>}/>
                <InfoRow label="Marital Status" value={emp.maritalStatus}/>
                {emp.maritalStatus==="Married"&&<InfoRow label="Marriage Anniversary" value={emp.marriageAnniversary}/>}
                <InfoRow label="Exit Date" value={emp.exitDate||"—"}/>
              </div>
            </div>

            {/* Contact & Identity */}
            <div style={{background:"#fff",borderRadius:14,border:"1px solid #ede9fe",overflow:"hidden",marginTop:"1rem",boxShadow:"0 2px 12px rgba(79,70,229,0.05)"}}>
              <div style={{padding:"14px 20px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-contacts-line" style={{fontSize:16,color:"#4f46e5"}}/></div>
                <span style={{fontWeight:800,fontSize:14,color:"#1e1b4b"}}>Contact & Identity</span>
              </div>
              <div style={{padding:"4px 20px 16px"}}>
                <InfoRow label="Email Address" value={<a href={`mailto:${emp.email}`} style={{color:"#4f46e5",textDecoration:"none"}}>{emp.email}</a>}/>
                <InfoRow label="Mobile" value={emp.mobile}/>
                <InfoRow label="Country" value={<span>{COUNTRY_FLAGS[emp.country]??""} {emp.country}</span>}/>
                <InfoRow label="Address" value={emp.address}/>
                <InfoRow label="Language" value={emp.language}/>
                <InfoRow label="Slack Member ID" value={emp.slackId||"—"}/>
              </div>
            </div>

            {/* Work & Compensation */}
            <div style={{background:"#fff",borderRadius:14,border:"1px solid #ede9fe",overflow:"hidden",marginTop:"1rem",boxShadow:"0 2px 12px rgba(79,70,229,0.05)"}}>
              <div style={{padding:"14px 20px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ri-briefcase-4-line" style={{fontSize:16,color:"#4f46e5"}}/></div>
                <span style={{fontWeight:800,fontSize:14,color:"#1e1b4b"}}>Work & Compensation</span>
              </div>
              <div style={{padding:"4px 20px 16px"}}>
                <InfoRow label="User Role" value={<span style={{fontWeight:700,color:"#4f46e5",background:"#ede9fe",padding:"2px 10px",borderRadius:20,fontSize:12}}>{emp.userRole}</span>}/>
                <InfoRow label="Hourly Rate" value={emp.hourlyRate||"—"}/>
                <InfoRow label="Probation End Date" value={emp.probationEnd}/>
                <InfoRow label="Notice Period Start" value={emp.noticePeriodStart}/>
                <InfoRow label="Notice Period End" value={emp.noticePeriodEnd}/>
                <InfoRow label="Skills" value={
                  emp.skills.length>0
                    ? <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{emp.skills.map(s=><span key={s} style={{fontSize:11,fontWeight:600,color:"#7c3aed",background:"#f3e8ff",padding:"2px 8px",borderRadius:20}}>{s}</span>)}</div>
                    : "—"
                }/>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-md-4">

            {/* Reporting To */}
            <div style={{background:"#fff",borderRadius:14,border:"1px solid #ede9fe",overflow:"hidden",marginBottom:"1rem",boxShadow:"0 2px 12px rgba(79,70,229,0.05)"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6",fontWeight:800,fontSize:13,color:"#1e1b4b"}}>Reporting To</div>
              <div style={{padding:"12px 16px"}}>
                {emp.reportingTo
                  ? <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:"#7c3aed",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12}}>{emp.reportingTo.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                      <div><div style={{fontWeight:700,fontSize:13,color:"#1e1b4b"}}>{emp.reportingTo}</div><div style={{fontSize:11,color:"#9ca3af"}}>Manager</div></div>
                    </div>
                  : <span style={{fontSize:12,color:"#9ca3af"}}>— (Top of hierarchy)</span>}
              </div>
            </div>

            {/* Reporting Team */}
            {emp.reportingTeam.length>0&&(
              <div style={{background:"#fff",borderRadius:14,border:"1px solid #ede9fe",overflow:"hidden",marginBottom:"1rem",boxShadow:"0 2px 12px rgba(79,70,229,0.05)"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6",fontWeight:800,fontSize:13,color:"#1e1b4b"}}>Reporting Team ({emp.reportingTeam.length})</div>
                <div style={{padding:"8px 16px"}}>
                  {emp.reportingTeam.map((m,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderTop:i>0?"1px solid #f3f4f6":"none"}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:AVATAR_COLORS[i%AVATAR_COLORS.length],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:11}}>{m.avatar}</div>
                      <div><div style={{fontWeight:700,fontSize:12,color:"#1e1b4b"}}>{m.name}</div><div style={{fontSize:10,color:"#9ca3af"}}>{m.designation}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Late Attendance + Leaves */}
            <div className="row g-3" style={{marginBottom:"1rem"}}>
              <div className="col-6">
                <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",padding:"14px",textAlign:"center",boxShadow:"0 2px 8px rgba(79,70,229,0.05)"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",marginBottom:6}}>Late Attendance</div>
                  <div style={{fontSize:26,fontWeight:800,color:emp.lateAttendance>0?"#db2777":"#16a34a"}}>{emp.lateAttendance}</div>
                  <div style={{fontSize:10,color:"#9ca3af"}}>this month</div>
                  <i className="ri-alarm-warning-line" style={{fontSize:16,color:emp.lateAttendance>0?"#db2777":"#16a34a",marginTop:4,display:"block"}}/>
                </div>
              </div>
              <div className="col-6">
                <div style={{background:"#fff",borderRadius:12,border:"1px solid #ede9fe",padding:"14px",textAlign:"center",boxShadow:"0 2px 8px rgba(79,70,229,0.05)"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",marginBottom:6}}>Leaves Taken</div>
                  <div style={{fontSize:26,fontWeight:800,color:emp.leavesTaken>0?"#0284c7":"#16a34a"}}>{emp.leavesTaken}</div>
                  <div style={{fontSize:10,color:"#9ca3af"}}>this month</div>
                  <i className="ri-plane-line" style={{fontSize:16,color:emp.leavesTaken>0?"#0284c7":"#16a34a",marginTop:4,display:"block"}}/>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div style={{background:"#fff",borderRadius:14,border:"1px solid #ede9fe",overflow:"hidden",marginBottom:"1rem",boxShadow:"0 2px 12px rgba(79,70,229,0.05)"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6",fontWeight:800,fontSize:13,color:"#1e1b4b"}}>Tasks</div>
              <EmptyState icon="ri-task-line" label="No tasks assigned"/>
            </div>

            {/* Appreciation */}
            <div style={{background:"#fff",borderRadius:14,border:"1px solid #ede9fe",overflow:"hidden",boxShadow:"0 2px 12px rgba(79,70,229,0.05)"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6",fontWeight:800,fontSize:13,color:"#1e1b4b"}}>Appreciation</div>
              <div style={{padding:"16px",textAlign:"center"}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:"#fef9c3",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px"}}>
                  <i className="ri-award-line" style={{fontSize:24,color:"#ca8a04"}}/>
                </div>
                <div style={{fontSize:12,color:"#9ca3af"}}>No appreciations yet</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs — placeholder */}
      {tab !== "profile" && (
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #ede9fe",padding:"3rem",textAlign:"center",boxShadow:"0 2px 12px rgba(79,70,229,0.05)"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1rem"}}>
            <i className={TABS.find(t=>t.id===tab)?.icon||"ri-file-line"} style={{fontSize:28,color:"#4f46e5"}}/>
          </div>
          <div style={{fontWeight:700,fontSize:16,color:"#1e1b4b",marginBottom:6}}>{TABS.find(t=>t.id===tab)?.label}</div>
          <div style={{fontSize:13,color:"#9ca3af"}}>This section is under development.</div>
        </div>
      )}
    </div>
  );
}
