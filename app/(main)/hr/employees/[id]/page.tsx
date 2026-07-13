"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const FLAGS: Record<string,string> = {
  "India":"🇮🇳","United States":"🇺🇸","United Kingdom":"🇬🇧","Canada":"🇨🇦","UAE":"🇦🇪",
};

const EMP_DB: Record<string, any> = {
  "1": {
    id:"EMP-001", name:"Mukteshwar Sharma", salutation:"Mr.", avatar:"MS",
    designation:"CEO & Founder", department:"Management", email:"itsmukteshwar@gmail.com",
    mobile:"+91-91955-22972", gender:"Male", dob:"14 Sep 1990", blood:"B+",
    nationality:"Indian", religion:"Hinduism", maritalStatus:"Married",
    marriageAnniversary:"29 November", workAnniversary:"4 Yrs 6 Mths",
    joining:"01-01-2022", employmentType:"Full Time", aadhar:"4521 XXXX XXXX 1234",
    pan:"ABCDE1234F", country:"India",
    currentAddress:"S-3, Aala Apartment, Bagh Dilkusha", currentCity:"Indore",
    currentState:"Madhya Pradesh", currentPin:"452001",
    permanentAddress:"S-3, Aala Apartment, Bagh Dilkusha", permanentCity:"Indore",
    permanentState:"Madhya Pradesh", permanentPin:"452001",
    language:["English","Hindi"],
    slackId:"U0MUKSHE01", hourlyRate:"₹2,500",
    probationEnd:"—", noticePeriod:"90 Days",
    userRole:"Super Admin", reportingTo:null,
    reportingTeam:[
      {"name":"Akash Rai","role":"Sr. Developer","avatar":"AR","color":"#7c3aed","phone":"+91-98765-43210","email":"akash@zeroform.in","designation":"Sr. Developer"},
      {"name":"Sanjana Goldar","role":"Intern","avatar":"SG","color":"#db2777","phone":"+91-98765-00004","email":"sanjana@zeroform.in","designation":"Intern"},
    ],
    status:"Active", lastLogin:"14-07-2026 12:58 am",
    openTasks:0, hoursLogged:0, tickets:0, lateAttendance:0, leavesTaken:0,
    emergencyContact:{"name":"Suman Sharma","relation":"Spouse","phone":"+91-98765-00001","email":"suman@email.com"},
    prevEmployment:null,
    bank:{"name":"State Bank of India","branch":"Indore Main","ifsc":"SBIN0001122","account":"3215XXXXXXXX","type":"Savings"},
    skills:["React","Next.js","TypeScript","Product Management","UI/UX"],
    certifications:[{"name":"Google Project Management","issuer":"Coursera","year":"2023"},{"name":"AWS Solutions Architect","issuer":"Amazon","year":"2022"}],
    payroll:{
      ctc:"₹30,00,000/yr", basic:"₹12,50,000", hra:"₹5,00,000", allowances:"₹3,00,000",
      pf:"₹1,50,000", tds:"₹2,40,000", takeHome:"₹25,60,000",
      slips:[
        {"month":"June 2026","gross":"₹2,08,333","deductions":"₹32,500","net":"₹1,75,833","status":"Paid","date":"30 Jun 2026"},
        {"month":"May 2026","gross":"₹2,08,333","deductions":"₹32,500","net":"₹1,75,833","status":"Paid","date":"31 May 2026"},
      ],
    },
    leaves:{
      annual:{"entitled":21,"used":0,"balance":21}, sick:{"entitled":7,"used":0,"balance":7}, casual:{"entitled":7,"used":0,"balance":7},
      history:[],
    },
    documents:[
      {"name":"Offer Letter","type":"PDF","size":"245 KB","date":"01 Jan 2022","status":"Verified"},
      {"name":"Aadhar Card","type":"Image","size":"850 KB","date":"01 Jan 2022","status":"Verified"},
      {"name":"PAN Card","type":"Image","size":"420 KB","date":"01 Jan 2022","status":"Verified"},
    ],
    attendance:{"thisMonth":{"present":12,"absent":0,"halfDay":0,"late":0,"dayOff":2},"lastMonth":{"present":22,"absent":1,"halfDay":0,"late":0,"dayOff":4}},
  },
  "2": {
    id:"EMP-002", name:"Akash Rai", salutation:"Mr.", avatar:"AR",
    designation:"Sr. Developer", department:"Technology", email:"akash@zeroform.in",
    mobile:"+91-98765-43210", gender:"Male", dob:"22 Mar 1995", blood:"O+",
    nationality:"Indian", religion:"Hinduism", maritalStatus:"Single",
    marriageAnniversary:"—", workAnniversary:"4 Yrs 4 Mths",
    joining:"15-03-2022", employmentType:"Full Time", aadhar:"7845 XXXX XXXX 6789",
    pan:"BCDEG5678H", country:"India",
    currentAddress:"B-12, Vijay Nagar", currentCity:"Indore",
    currentState:"Madhya Pradesh", currentPin:"452010",
    permanentAddress:"Village Rampura, Dist. Rewa", permanentCity:"Rewa",
    permanentState:"Madhya Pradesh", permanentPin:"486001",
    language:["English","Hindi"],
    slackId:"U0AKASH02", hourlyRate:"₹1,800",
    probationEnd:"15-06-2022", noticePeriod:"60 Days",
    userRole:"Developer", reportingTo:"Mukteshwar Sharma",
    reportingTeam:[
      {"name":"Harsh Mishra","role":"Trainee","avatar":"HM","color":"#16a34a","phone":"+91-98765-00002","email":"harsh@zeroform.in","designation":"Trainee"},
      {"name":"Bhagvendra Singh","role":"Sr. Developer","avatar":"BS","color":"#0284c7","phone":"+91-98765-00003","email":"bhagvendra@zeroform.in","designation":"Sr. Developer"},
    ],
    status:"Active", lastLogin:"13-07-2026 06:30 pm",
    openTasks:2, hoursLogged:9, tickets:1, lateAttendance:3, leavesTaken:2,
    emergencyContact:{"name":"Ramesh Rai","relation":"Father","phone":"+91-94567-11111","email":"ramesh.rai@email.com"},
    prevEmployment:{"company":"Infosys Ltd.","role":"Junior Developer","from":"Jun 2018","to":"Feb 2022","location":"Pune, Maharashtra","reason":"Better Opportunity"},
    bank:{"name":"Punjab National Bank","branch":"Vijay Nagar, Indore","ifsc":"PUNB0123456","account":"5678XXXXXXXX","type":"Savings"},
    skills:["Laravel","MySQL","PHP","REST API","Vue.js","Redis","Docker"],
    certifications:[{"name":"PHP Certification","issuer":"Zend","year":"2021"},{"name":"MySQL DBA","issuer":"Oracle","year":"2020"}],
    payroll:{
      ctc:"₹12,00,000/yr", basic:"₹5,00,000", hra:"₹2,00,000", allowances:"₹1,20,000",
      pf:"₹60,000", tds:"₹72,000", takeHome:"₹9,88,000",
      slips:[
        {"month":"June 2026","gross":"₹82,333","deductions":"₹11,000","net":"₹71,333","status":"Paid","date":"30 Jun 2026"},
        {"month":"May 2026","gross":"₹82,333","deductions":"₹11,000","net":"₹71,333","status":"Paid","date":"31 May 2026"},
        {"month":"April 2026","gross":"₹82,333","deductions":"₹11,000","net":"₹71,333","status":"Paid","date":"30 Apr 2026"},
      ],
    },
    leaves:{
      annual:{"entitled":21,"used":2,"balance":19}, sick:{"entitled":7,"used":0,"balance":7}, casual:{"entitled":7,"used":0,"balance":7},
      history:[{"type":"Annual Leave","from":"10 May 2026","to":"11 May 2026","days":2,"status":"Approved","reason":"Personal work"}],
    },
    documents:[
      {"name":"Offer Letter","type":"PDF","size":"245 KB","date":"15 Mar 2022","status":"Verified"},
      {"name":"Appointment Letter","type":"PDF","size":"318 KB","date":"15 Mar 2022","status":"Verified"},
      {"name":"Aadhar Card","type":"Image","size":"920 KB","date":"15 Mar 2022","status":"Verified"},
      {"name":"PAN Card","type":"Image","size":"430 KB","date":"15 Mar 2022","status":"Verified"},
      {"name":"Graduation Certificate","type":"PDF","size":"1.1 MB","date":"15 Mar 2022","status":"Pending"},
      {"name":"Experience Letter","type":"PDF","size":"0 KB","date":"—","status":"Not Submitted"},
    ],
    attendance:{"thisMonth":{"present":9,"absent":1,"halfDay":0,"late":3,"dayOff":2},"lastMonth":{"present":20,"absent":2,"halfDay":1,"late":2,"dayOff":4}},
  },
};

function getEmp(id: string) { return EMP_DB[id] ?? EMP_DB["2"]; }

const AVATAR_COLORS = ["#4f46e5","#7c3aed","#0284c7","#16a34a","#dc2626","#db2777","#ea580c","#ca8a04"];
function avatarBg(id: string) { return AVATAR_COLORS[(parseInt(id.replace("EMP-",""))-1) % AVATAR_COLORS.length]; }

const DOC_STYLE: Record<string,{bg:string;color:string;icon:string}> = {
  "Verified":      {bg:"#dcfce7",color:"#16a34a",icon:"ri-checkbox-circle-fill"},
  "Pending":       {bg:"#fef9c3",color:"#ca8a04",icon:"ri-time-fill"},
  "Rejected":      {bg:"#fee2e2",color:"#dc2626",icon:"ri-close-circle-fill"},
  "Not Submitted": {bg:"#f3f4f6",color:"#6b7280",icon:"ri-file-unknow-line"},
};

const TABS = ["Employee Details","Attendance","Payroll","Documents","Leave Management","Tasks","Activity"];
const TAB_ICONS: Record<string,string> = {
  "Employee Details":"ri-id-card-line",
  "Attendance":"ri-calendar-check-line",
  "Payroll":"ri-money-rupee-circle-line",
  "Documents":"ri-folder-open-line",
  "Leave Management":"ri-plane-line",
  "Tasks":"ri-task-line",
  "Activity":"ri-pulse-line",
};

// ── Shared helpers ──────────────────────────────────────────────
function Th({children}: {children:React.ReactNode}) {
  return <th style={{padding:"10px 16px",fontWeight:700,fontSize:12,color:"var(--text-muted)",borderBottom:"1px solid var(--default-border)",whiteSpace:"nowrap"}}>{children}</th>;
}
function Td({children,style,colSpan}: {children?:React.ReactNode;style?:React.CSSProperties;colSpan?:number}) {
  return <td colSpan={colSpan} style={{padding:"11px 16px",...style}}>{children}</td>;
}
function SBadge({label,bg,color}: {label:string;bg:string;color:string}) {
  return <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:bg,color}}>{label}</span>;
}
function IRow({label,value}: {label:string;value:string}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"5px 0",borderBottom:"1px dashed var(--default-border)",fontSize:12}}>
      <span style={{color:"var(--text-muted)",fontWeight:500,flexShrink:0,marginRight:8}}>{label}</span>
      <span style={{color:"var(--default-text-color)",fontWeight:600,textAlign:"right"}}>{value||"—"}</span>
    </div>
  );
}
function Sec({icon,title,children,right}: {icon:string;title:string;children:React.ReactNode;right?:React.ReactNode}) {
  return (
    <div style={{border:"1px solid var(--default-border)",borderRadius:12,overflow:"hidden",marginBottom:"1.25rem"}}>
      <div style={{padding:"10px 16px",background:"var(--default-background)",borderBottom:"1px solid var(--default-border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <i className={icon} style={{fontSize:15,color:"var(--primary-color)"}}/>
          <span style={{fontSize:13,fontWeight:700,color:"var(--default-text-color)"}}>{title}</span>
        </div>
        {right}
      </div>
      <div style={{padding:"1rem"}}>{children}</div>
    </div>
  );
}

// ── Employee Details Tab ─────────────────────────────────────────
function EmployeeDetailsTab({emp}: {emp:any}) {
  return (
    <div style={{padding:"1.25rem"}}>

      {/* Reporting Structure — mirrors Parents & Guardian */}
      <Sec icon="ri-team-line" title="Reporting Structure">
        <div className="row g-3">
          {emp.reportingTo && (
            <div className="col-md-4">
              <div style={{border:"1px solid var(--default-border)",borderRadius:10,padding:"1rem",height:"100%"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"0.75rem"}}>
                  <div style={{width:42,height:42,borderRadius:"50%",background:"#4f46e5",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>
                    {emp.reportingTo.split(" ").map((w:string)=>w[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:"var(--default-text-color)"}}>{emp.reportingTo}</div>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:"rgba(108,95,252,0.1)",color:"var(--primary-color)"}}>Reporting Manager</span>
                  </div>
                </div>
                <div style={{fontSize:12,color:"var(--text-muted)",display:"flex",flexDirection:"column" as const,gap:4}}>
                  <span><i className="ri-briefcase-4-line" style={{marginRight:5}}/> Management</span>
                </div>
              </div>
            </div>
          )}
          {emp.reportingTeam.map((m:any,i:number)=>(
            <div key={i} className="col-md-4">
              <div style={{border:"1px solid var(--default-border)",borderRadius:10,padding:"1rem",height:"100%"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"0.75rem"}}>
                  <div style={{width:42,height:42,borderRadius:"50%",background:m.color||AVATAR_COLORS[i%AVATAR_COLORS.length],color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>
                    {m.avatar}
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:"var(--default-text-color)"}}>{m.name}</div>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:"#dcfce7",color:"#16a34a"}}>{m.role}</span>
                  </div>
                </div>
                <div style={{fontSize:12,color:"var(--text-muted)",display:"flex",flexDirection:"column" as const,gap:4}}>
                  <span><i className="ri-briefcase-4-line" style={{marginRight:5}}/> {m.designation}</span>
                  <span><i className="ri-phone-line" style={{marginRight:5}}/> {m.phone}</span>
                  <span><i className="ri-mail-line" style={{marginRight:5}}/> {m.email}</span>
                </div>
              </div>
            </div>
          ))}
          {!emp.reportingTo && emp.reportingTeam.length===0 && (
            <div className="col-12" style={{textAlign:"center",padding:"1.5rem",color:"var(--text-muted)"}}>
              <i className="ri-team-line" style={{fontSize:28,display:"block",marginBottom:6}}/> No reporting structure defined
            </div>
          )}
        </div>
      </Sec>

      {/* Address Details — exact mirror */}
      <Sec icon="ri-map-pin-line" title="Address Details">
        <div className="row g-4">
          <div className="col-md-6">
            <div style={{fontSize:11,fontWeight:700,color:"var(--primary-color)",letterSpacing:"0.06em",marginBottom:"0.75rem",textTransform:"uppercase" as const}}>Current Address</div>
            {[["Address Line 1",emp.currentAddress],["City / Tehsil",emp.currentCity],["State",emp.currentState],["PIN Code",emp.currentPin],["Country",`${FLAGS[emp.country]??""} ${emp.country}`]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px dashed var(--default-border)",fontSize:12}}>
                <span style={{color:"var(--text-muted)",fontWeight:500}}>{l}</span>
                <span style={{color:"var(--default-text-color)",fontWeight:600,textAlign:"right"}}>{v}</span>
              </div>
            ))}
          </div>
          <div className="col-md-6">
            <div style={{fontSize:11,fontWeight:700,color:"var(--primary-color)",letterSpacing:"0.06em",marginBottom:"0.75rem",textTransform:"uppercase" as const}}>Permanent Address</div>
            {[["Address Line 1",emp.permanentAddress],["City / Tehsil",emp.permanentCity],["State",emp.permanentState],["PIN Code",emp.permanentPin],["Country",`${FLAGS[emp.country]??""} ${emp.country}`]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px dashed var(--default-border)",fontSize:12}}>
                <span style={{color:"var(--text-muted)",fontWeight:500}}>{l}</span>
                <span style={{color:"var(--default-text-color)",fontWeight:600,textAlign:"right"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      {/* Previous Employment — mirrors Previous School */}
      {emp.prevEmployment && (
        <Sec icon="ri-building-4-line" title="Previous Employment">
          <div className="row g-3">
            {[
              ["Company / Organisation", emp.prevEmployment.company],
              ["Role / Designation",     emp.prevEmployment.role],
              ["From",                   emp.prevEmployment.from],
              ["To",                     emp.prevEmployment.to],
              ["Location",               emp.prevEmployment.location],
              ["Reason for Leaving",     emp.prevEmployment.reason],
            ].map(([l,v])=>(
              <div key={l} className="col-md-4">
                <div style={{fontSize:11,color:"var(--text-muted)",fontWeight:500,marginBottom:2}}>{l}</div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--default-text-color)"}}>{v}</div>
              </div>
            ))}
          </div>
        </Sec>
      )}

      {/* Bank Details — exact mirror */}
      <Sec icon="ri-bank-line" title="Bank Details">
        <div className="row g-3">
          {[["Bank Name",emp.bank.name],["Branch",emp.bank.branch],["IFSC Code",emp.bank.ifsc],["Account No",emp.bank.account],["Account Type",emp.bank.type]].map(([l,v])=>(
            <div key={l} className="col-md-4">
              <div style={{fontSize:11,color:"var(--text-muted)",fontWeight:500,marginBottom:2}}>{l}</div>
              <div style={{fontSize:13,fontWeight:700,color:"var(--default-text-color)"}}>{v}</div>
            </div>
          ))}
        </div>
      </Sec>

      {/* Skills & Certifications — mirrors Medical History */}
      <Sec icon="ri-award-line" title="Skills & Certifications">
        <div className="row g-4">
          <div className="col-md-6">
            <div style={{fontSize:11,fontWeight:700,color:"var(--primary-color)",letterSpacing:"0.06em",marginBottom:"0.75rem",textTransform:"uppercase" as const}}>Technical Skills</div>
            <div style={{display:"flex",flexWrap:"wrap" as const,gap:6}}>
              {emp.skills.map((s:string)=><span key={s} style={{fontSize:11,fontWeight:600,color:"#7c3aed",background:"#f3e8ff",padding:"3px 10px",borderRadius:20}}>{s}</span>)}
            </div>
          </div>
          <div className="col-md-6">
            <div style={{fontSize:11,fontWeight:700,color:"var(--primary-color)",letterSpacing:"0.06em",marginBottom:"0.75rem",textTransform:"uppercase" as const}}>Certifications</div>
            {emp.certifications.map((c:any,i:number)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px dashed var(--default-border)",fontSize:12}}>
                <span style={{color:"var(--default-text-color)",fontWeight:600}}>{c.name}</span>
                <span style={{color:"var(--text-muted)"}}>{c.issuer} · {c.year}</span>
              </div>
            ))}
          </div>
        </div>
      </Sec>

    </div>
  );
}

// ── Attendance Tab ───────────────────────────────────────────────
function AttendanceTab({emp}: {emp:any}) {
  return (
    <div style={{padding:"1.25rem"}}>
      <div className="row g-3 mb-4">
        {[{label:"This Month",d:emp.attendance.thisMonth},{label:"Last Month",d:emp.attendance.lastMonth}].map(({label,d})=>(
          <div key={label} className="col-md-6">
            <div style={{border:"1px solid var(--default-border)",borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"10px 16px",background:"var(--default-background)",borderBottom:"1px solid var(--default-border)",fontWeight:700,fontSize:13,color:"var(--default-text-color)"}}>
                <i className="ri-calendar-2-line" style={{marginRight:6,color:"var(--primary-color)"}}/>{label}
              </div>
              <div style={{padding:"1rem",display:"flex",gap:8,flexWrap:"wrap" as const}}>
                {([["present","Present","#16a34a","#dcfce7"],["absent","Absent","#dc2626","#fee2e2"],["halfDay","Half Day","#ea580c","#fed7aa"],["late","Late","#db2777","#fce7f3"],["dayOff","Day Off","#6b7280","#f3f4f6"]] as [string,string,string,string][]).map(([k,lbl,color,bg])=>(
                  <div key={k} style={{flex:1,minWidth:60,textAlign:"center",background:bg,borderRadius:10,padding:"10px 4px"}}>
                    <div style={{fontSize:20,fontWeight:800,color}}>{d[k]}</div>
                    <div style={{fontSize:10,color,fontWeight:600}}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Sec icon="ri-list-check-3" title="Monthly Attendance Summary">
        <table style={{width:"100%",borderCollapse:"collapse" as const,fontSize:12}}>
          <thead><tr style={{background:"var(--default-background)"}}><Th>Month</Th><Th>Working Days</Th><Th>Present</Th><Th>Absent</Th><Th>Late</Th><Th>Half Day</Th><Th>Status</Th></tr></thead>
          <tbody>
            {[
              {m:"July 2026",wd:12,p:9,a:1,l:3,hd:0,s:"In Progress"},
              {m:"June 2026",wd:26,p:20,a:2,l:2,hd:1,s:"Closed"},
              {m:"May 2026",wd:27,p:24,a:1,l:3,hd:0,s:"Closed"},
              {m:"April 2026",wd:26,p:23,a:2,l:1,hd:0,s:"Closed"},
              {m:"March 2026",wd:27,p:25,a:1,l:2,hd:1,s:"Closed"},
            ].map((r,i)=>(
              <tr key={r.m} style={{borderBottom:"1px solid var(--default-border)",background:i%2===0?"":"var(--default-background)"}}>
                <Td><span style={{fontWeight:700,color:"var(--default-text-color)"}}>{r.m}</span></Td>
                <Td>{r.wd}</Td>
                <Td><SBadge label={String(r.p)} bg="#dcfce7" color="#16a34a"/></Td>
                <Td><SBadge label={String(r.a)} bg="#fee2e2" color="#dc2626"/></Td>
                <Td><SBadge label={String(r.l)} bg="#fce7f3" color="#db2777"/></Td>
                <Td><SBadge label={String(r.hd)} bg="#fed7aa" color="#ea580c"/></Td>
                <Td><SBadge label={r.s} bg={r.s==="Closed"?"#f3f4f6":"#ede9fe"} color={r.s==="Closed"?"#6b7280":"#4f46e5"}/></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>
    </div>
  );
}

// ── Payroll Tab ──────────────────────────────────────────────────
function PayrollTab({emp}: {emp:any}) {
  const [sub, setSub] = useState<"slips"|"structure">("slips");
  return (
    <div style={{padding:"1.25rem"}}>
      <div style={{display:"flex",gap:4,marginBottom:"1rem",borderBottom:"1px solid var(--default-border)"}}>
        {(["slips","structure"] as const).map(t=>(
          <button key={t} onClick={()=>setSub(t)} style={{padding:"7px 14px",background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:sub===t?700:500,color:sub===t?"var(--primary-color)":"var(--text-muted)",borderBottom:sub===t?"2px solid var(--primary-color)":"2px solid transparent",marginBottom:-1,textTransform:"capitalize" as const}}>
            {t==="slips"?"Salary Slips":"Pay Structure"}
          </button>
        ))}
      </div>
      {sub==="slips" && (
        <table style={{width:"100%",borderCollapse:"collapse" as const,fontSize:13}}>
          <thead><tr style={{background:"var(--default-background)"}}><Th>Month</Th><Th>Gross</Th><Th>Deductions</Th><Th>Net Pay</Th><Th>Status</Th><Th>Paid On</Th><Th>Action</Th></tr></thead>
          <tbody>
            {emp.payroll.slips.map((s:any,i:number)=>(
              <tr key={s.month} style={{borderBottom:"1px solid var(--default-border)",background:i%2===0?"":"var(--default-background)"}}>
                <Td><span style={{fontWeight:700,color:"var(--default-text-color)"}}>{s.month}</span></Td>
                <Td>{s.gross}</Td>
                <Td style={{color:"#dc2626"}}>- {s.deductions}</Td>
                <Td style={{fontWeight:700,color:"#16a34a"}}>{s.net}</Td>
                <Td><SBadge label={s.status} bg="#dcfce7" color="#16a34a"/></Td>
                <Td>{s.date}</Td>
                <Td><button style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:"1px solid var(--default-border)",background:"#fff",color:"var(--primary-color)",cursor:"pointer",fontWeight:600}}><i className="ri-download-line"/> Download</button></Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {sub==="structure" && (
        <div>
          <div className="row g-3 mb-3">
            {[{label:"Annual CTC",value:emp.payroll.ctc,icon:"ri-money-rupee-circle-line",bg:"#ede9fe",color:"#7c3aed"},
              {label:"Monthly Take Home",value:emp.payroll.slips[0]?.net||"—",icon:"ri-wallet-3-line",bg:"#dcfce7",color:"#16a34a"},
              {label:"Hourly Rate",value:emp.hourlyRate,icon:"ri-time-line",bg:"#dbeafe",color:"#2563eb"}].map(c=>(
              <div key={c.label} className="col-md-4">
                <div style={{background:c.bg,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}><i className={c.icon} style={{fontSize:18,color:c.color}}/></div>
                  <div><div style={{fontSize:11,color:"var(--text-muted)",marginBottom:2}}>{c.label}</div><div style={{fontSize:17,fontWeight:800,color:c.color}}>{c.value}</div></div>
                </div>
              </div>
            ))}
          </div>
          <Sec icon="ri-file-list-3-line" title="Earnings & Deductions">
            <table style={{width:"100%",borderCollapse:"collapse" as const,fontSize:13}}>
              <thead><tr style={{background:"var(--default-background)"}}><Th>Component</Th><Th>Type</Th><Th>Annual Amount</Th></tr></thead>
              <tbody>
                {[
                  {c:"Basic Salary",t:"Earning",v:emp.payroll.basic},
                  {c:"HRA",t:"Earning",v:emp.payroll.hra},
                  {c:"Allowances",t:"Earning",v:emp.payroll.allowances},
                  {c:"PF Contribution",t:"Deduction",v:emp.payroll.pf},
                  {c:"TDS",t:"Deduction",v:emp.payroll.tds},
                ].map((r,i)=>(
                  <tr key={r.c} style={{borderBottom:"1px solid var(--default-border)",background:i%2===0?"":"var(--default-background)"}}>
                    <Td><span style={{fontWeight:600,color:"var(--default-text-color)"}}>{r.c}</span></Td>
                    <Td><SBadge label={r.t} bg={r.t==="Earning"?"#dcfce7":"#fee2e2"} color={r.t==="Earning"?"#16a34a":"#dc2626"}/></Td>
                    <Td style={{fontWeight:600,color:r.t==="Earning"?"#16a34a":"#dc2626"}}>{r.t==="Deduction"?"- ":""}{r.v}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Sec>
        </div>
      )}
    </div>
  );
}

// ── Documents Tab ────────────────────────────────────────────────
function DocumentsTab({emp}: {emp:any}) {
  const [statuses, setStatuses] = useState<Record<string,string>>(() =>
    Object.fromEntries(emp.documents.map((d:any)=>[d.name,d.status]))
  );
  const [sel, setSel] = useState(emp.documents[0]);
  const [vOpen, setVOpen] = useState(false);
  const curStatus = statuses[sel?.name] ?? sel?.status;
  const dc = DOC_STYLE[curStatus] ?? DOC_STYLE["Pending"];
  return (
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:0,minHeight:400}}>
      <div style={{borderRight:"1px solid var(--default-border)",padding:"0.75rem 0"}}>
        {emp.documents.map((d:any) => {
          const ds = statuses[d.name] ?? d.status;
          const c = DOC_STYLE[ds] ?? DOC_STYLE["Pending"];
          return (
            <div key={d.name} onClick={()=>{setSel(d);setVOpen(false);}} style={{padding:"10px 14px",cursor:"pointer",background:sel?.name===d.name?"rgba(108,95,252,0.06)":"transparent",borderLeft:sel?.name===d.name?"3px solid var(--primary-color)":"3px solid transparent"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <i className={c.icon} style={{fontSize:14,color:c.color,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--default-text-color)",lineHeight:1.3}}>{d.name}</div>
                  <div style={{fontSize:10,color:"var(--text-muted)"}}>{d.type} · {d.size}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{padding:"1.25rem"}}>
        {sel && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
              <div>
                <h6 style={{fontWeight:800,color:"var(--default-text-color)",marginBottom:4}}>{sel.name}</h6>
                <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
                  <SBadge label={curStatus} bg={dc.bg} color={dc.color}/>
                  <span style={{fontSize:11,color:"var(--text-muted)"}}>{sel.type} · {sel.size} · Uploaded: {sel.date}</span>
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>setVOpen(v=>!v)} style={{padding:"6px 14px",borderRadius:8,border:"1.5px solid var(--default-border)",background:"#fff",color:"var(--default-text-color)",fontSize:12,fontWeight:600,cursor:"pointer"}}><i className="ri-checkbox-circle-line" style={{marginRight:4,color:"var(--primary-color)"}}/>Verify</button>
                <button style={{padding:"6px 12px",borderRadius:8,border:"1.5px solid var(--default-border)",background:"#fff",color:"var(--default-text-color)",fontSize:12,cursor:"pointer"}}><i className="ri-download-line"/></button>
              </div>
            </div>
            {vOpen && (
              <div style={{background:"var(--default-background)",borderRadius:10,border:"1px solid var(--default-border)",padding:"1rem",marginBottom:"1rem"}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--default-text-color)",marginBottom:10}}>Update Status</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
                  {["Verified","Pending","Rejected","Not Submitted"].map(s=>(
                    <button key={s} onClick={()=>{setStatuses(p=>({...p,[sel.name]:s}));setVOpen(false);}} style={{padding:"6px 14px",borderRadius:8,border:"1.5px solid "+(DOC_STYLE[s]?.color||"#e5e7eb"),background:DOC_STYLE[s]?.bg||"#f9fafb",color:DOC_STYLE[s]?.color||"#374151",fontSize:12,fontWeight:700,cursor:"pointer"}}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{height:260,background:curStatus==="Not Submitted"?"#f9fafb":"#e0e7ff",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",border:"1px dashed var(--default-border)"}}>
              {curStatus==="Not Submitted"
                ? <div style={{textAlign:"center",color:"var(--text-muted)"}}><i className="ri-file-upload-line" style={{fontSize:36,display:"block",marginBottom:8}}/><div style={{fontSize:13,fontWeight:600}}>Not Submitted</div></div>
                : <div style={{textAlign:"center",color:"#4f46e5"}}><i className="ri-file-pdf-2-line" style={{fontSize:48,display:"block",marginBottom:8}}/><div style={{fontSize:13,fontWeight:700,color:"var(--default-text-color)"}}>{sel.name}</div><div style={{fontSize:11,color:"var(--text-muted)",marginTop:4}}>Click Download to open</div></div>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Leave Tab ────────────────────────────────────────────────────
function LeaveTab({emp}: {emp:any}) {
  return (
    <div style={{padding:"1.25rem"}}>
      <div className="row g-3 mb-3">
        {[{label:"Annual Leave",d:emp.leaves.annual,color:"#4f46e5",bg:"#ede9fe"},
          {label:"Sick Leave",d:emp.leaves.sick,color:"#16a34a",bg:"#dcfce7"},
          {label:"Casual Leave",d:emp.leaves.casual,color:"#0284c7",bg:"#dbeafe"}].map(({label,d,color,bg})=>(
          <div key={label} className="col-md-4">
            <div style={{background:bg,borderRadius:12,padding:"16px",textAlign:"center"}}>
              <div style={{fontSize:11,fontWeight:700,color,marginBottom:8,textTransform:"uppercase" as const,letterSpacing:"0.04em"}}>{label}</div>
              <div style={{display:"flex",justifyContent:"space-around"}}>
                {[["Entitled",d.entitled],["Used",d.used],["Balance",d.balance]].map(([k,v])=>(
                  <div key={k}><div style={{fontSize:20,fontWeight:800,color}}>{v}</div><div style={{fontSize:10,color,opacity:0.7,fontWeight:600}}>{k}</div></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Sec icon="ri-list-check-3" title="Leave History">
        {emp.leaves.history.length===0
          ? <div style={{textAlign:"center",padding:"2rem",color:"var(--text-muted)"}}><i className="ri-calendar-close-line" style={{fontSize:32,display:"block",marginBottom:8}}/><div style={{fontSize:12,fontWeight:600}}>No leave records found</div></div>
          : <table style={{width:"100%",borderCollapse:"collapse" as const,fontSize:13}}>
              <thead><tr style={{background:"var(--default-background)"}}><Th>Type</Th><Th>From</Th><Th>To</Th><Th>Days</Th><Th>Status</Th><Th>Reason</Th></tr></thead>
              <tbody>
                {emp.leaves.history.map((l:any,i:number)=>(
                  <tr key={i} style={{borderBottom:"1px solid var(--default-border)"}}>
                    <Td><span style={{fontWeight:700,color:"var(--default-text-color)"}}>{l.type}</span></Td>
                    <Td>{l.from}</Td><Td>{l.to}</Td>
                    <Td><SBadge label={l.days+" day"+(l.days>1?"s":"")} bg="#ede9fe" color="#4f46e5"/></Td>
                    <Td><SBadge label={l.status} bg="#dcfce7" color="#16a34a"/></Td>
                    <Td style={{color:"var(--text-muted)"}}>{l.reason}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </Sec>
    </div>
  );
}

// ── Tasks Tab ────────────────────────────────────────────────────
function TasksTab({emp}: {emp:any}) {
  const tasks = emp.openTasks > 0
    ? [{title:"Complete API integration for Fees Module",priority:"High",due:"20 Jul 2026",status:"In Progress"},
       {title:"Code review for student registration flow",priority:"Medium",due:"22 Jul 2026",status:"Pending"}]
    : [];
  const PRIO: Record<string,{bg:string;color:string}> = {High:{bg:"#fee2e2",color:"#dc2626"},Medium:{bg:"#fef9c3",color:"#ca8a04"},Low:{bg:"#dcfce7",color:"#16a34a"}};
  const SST: Record<string,{bg:string;color:string}> = {"In Progress":{bg:"#ede9fe",color:"#4f46e5"},Pending:{bg:"#f3f4f6",color:"#6b7280"},Completed:{bg:"#dcfce7",color:"#16a34a"}};
  return (
    <div style={{padding:"1.25rem"}}>
      <Sec icon="ri-task-line" title={`Tasks (${tasks.length})`}>
        {tasks.length===0
          ? <div style={{textAlign:"center",padding:"2rem",color:"var(--text-muted)"}}><i className="ri-task-line" style={{fontSize:32,display:"block",marginBottom:8}}/><div style={{fontSize:12,fontWeight:600}}>No tasks assigned</div></div>
          : <table style={{width:"100%",borderCollapse:"collapse" as const,fontSize:13}}>
              <thead><tr style={{background:"var(--default-background)"}}><Th>Task</Th><Th>Priority</Th><Th>Due Date</Th><Th>Status</Th></tr></thead>
              <tbody>
                {tasks.map((t,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid var(--default-border)"}}>
                    <Td><span style={{fontWeight:600,color:"var(--default-text-color)"}}>{t.title}</span></Td>
                    <Td><SBadge label={t.priority} {...PRIO[t.priority]}/></Td>
                    <Td>{t.due}</Td>
                    <Td><SBadge label={t.status} {...SST[t.status]}/></Td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </Sec>
    </div>
  );
}

// ── Activity Tab ─────────────────────────────────────────────────
function ActivityTab() {
  const items = [
    {time:"13 Jul 2026, 6:30 PM",icon:"ri-login-circle-line",color:"#16a34a",text:"Logged in from IP 49.36.16.99"},
    {time:"13 Jul 2026, 5:30 PM",icon:"ri-logout-circle-line",color:"#6b7280",text:"Clocked out"},
    {time:"13 Jul 2026, 9:05 AM",icon:"ri-time-line",color:"#4f46e5",text:"Clocked in — Late by 5 min"},
    {time:"11 Jul 2026, 5:00 PM",icon:"ri-logout-circle-line",color:"#6b7280",text:"Clocked out"},
    {time:"11 Jul 2026, 9:00 AM",icon:"ri-time-line",color:"#16a34a",text:"Clocked in on time"},
    {time:"10 Jul 2026, 3:00 PM",icon:"ri-file-edit-line",color:"#ca8a04",text:"Profile updated by Admin"},
    {time:"05 Jul 2026, 9:20 AM",icon:"ri-time-line",color:"#db2777",text:"Late check-in — 20 min delay"},
  ];
  return (
    <div style={{padding:"1.25rem"}}>
      <Sec icon="ri-pulse-line" title="Activity Log">
        {items.map((a,i)=>(
          <div key={i} style={{display:"flex",gap:12,paddingBottom:"1rem",position:"relative"}}>
            {i<items.length-1&&<div style={{position:"absolute",left:15,top:30,bottom:0,width:1,background:"var(--default-border)"}}/>}
            <div style={{width:30,height:30,borderRadius:"50%",background:`${a.color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,zIndex:1}}>
              <i className={a.icon} style={{fontSize:14,color:a.color}}/>
            </div>
            <div style={{paddingTop:4}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--default-text-color)"}}>{a.text}</div>
              <div style={{fontSize:11,color:"var(--text-muted)",marginTop:2}}>{a.time}</div>
            </div>
          </div>
        ))}
      </Sec>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function EmployeeProfilePage() {
  const params = useParams();
  const id = String(params?.id ?? "2");
  const emp = getEmp(id);
  const [activeTab, setActiveTab] = useState("Employee Details");

  const bg   = avatarBg(emp.id);
  const flag = FLAGS[emp.country] ?? "🌐";
  const sts  = emp.status==="Active" ? {bg:"#dcfce7",color:"#16a34a"} : {bg:"#fee2e2",color:"#dc2626"};

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h4 style={{fontSize:18,fontWeight:800,color:"var(--default-text-color)",marginBottom:2}}>Employee Details</h4>
          <nav><ol className="breadcrumb mb-0" style={{fontSize:12}}>
            <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item"><Link href="/hr/employees">Employees</Link></li>
            <li className="breadcrumb-item active">Employee Details</li>
          </ol></nav>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-light" style={{fontSize:12,border:"1px solid var(--default-border)"}}>
            <i className="ri-lock-line me-1"/>Login Details
          </button>
          <button className="btn btn-sm" style={{fontSize:12,background:"var(--primary-color)",color:"#fff",border:"none"}}>
            <i className="ri-edit-line me-1"/>Edit Employee
          </button>
        </div>
      </div>

      {/* Two-column layout — identical to student view */}
      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:"1rem",alignItems:"start"}}>

        {/* ── LEFT PANEL ── */}
        <div style={{display:"flex",flexDirection:"column" as const,gap:"0.875rem"}}>

          {/* Profile Card */}
          <div className="card custom-card mb-0">
            <div className="card-body" style={{padding:"1.5rem 1.25rem",textAlign:"center"}}>
              <div style={{position:"relative",display:"inline-block",marginBottom:"0.875rem"}}>
                <div style={{width:80,height:80,borderRadius:"50%",background:bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,margin:"0 auto"}}>
                  {emp.avatar}
                </div>
                <span style={{...sts,position:"absolute",bottom:0,right:-4,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,border:"2px solid var(--custom-white)"}}>
                  {emp.status}
                </span>
              </div>
              <div style={{fontWeight:800,fontSize:17,color:"var(--default-text-color)",marginBottom:2}}>
                {emp.salutation} {emp.name} <span title={emp.country}>{flag}</span>
              </div>
              <div style={{fontSize:12,color:"var(--primary-color)",fontWeight:600,marginBottom:"0.3rem"}}>{emp.id}</div>
              <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:"0.75rem"}}>{emp.designation} · {emp.department}</div>
              <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap" as const}}>
                <span style={{background:"rgba(108,95,252,0.1)",color:"var(--primary-color)",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20}}>{emp.userRole}</span>
                <span style={{background:"#dcfce7",color:"#16a34a",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20}}>{emp.nationality}</span>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="card custom-card mb-0">
            <div className="card-header" style={{padding:"0.625rem 1rem",borderBottom:"1px solid var(--default-border)"}}>
              <span style={{fontSize:12,fontWeight:700,color:"var(--default-text-color)",textTransform:"uppercase" as const,letterSpacing:"0.05em"}}>Basic Information</span>
            </div>
            <div className="card-body" style={{padding:"0.5rem 1rem"}}>
              {([
                ["Employee ID",    emp.id],
                ["Gender",         emp.gender],
                ["Date of Birth",  emp.dob],
                ["Blood Group",    emp.blood],
                ["Religion",       emp.religion],
                ["Marital Status", emp.maritalStatus],
                ["Aadhar No",      emp.aadhar],
                ["PAN",            emp.pan],
                ["Joining Date",   emp.joining],
                ["Employment Type",emp.employmentType],
                ["Probation End",  emp.probationEnd],
                ["Notice Period",  emp.noticePeriod],
              ] as [string,string][]).map(([label,value])=>(
                <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"5px 0",borderBottom:"1px dashed var(--default-border)",fontSize:12}}>
                  <span style={{color:"var(--text-muted)",fontWeight:500,flexShrink:0,marginRight:8}}>{label}</span>
                  <span style={{color:"var(--default-text-color)",fontWeight:600,textAlign:"right"}}>{value||"—"}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",fontSize:12}}>
                <span style={{color:"var(--text-muted)",fontWeight:500}}>Language</span>
                <div style={{display:"flex",gap:4}}>
                  {emp.language.map((l:string)=>(
                    <span key={l} style={{background:"rgba(108,95,252,0.1)",color:"var(--primary-color)",fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:4}}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Primary Contact */}
          <div className="card custom-card mb-0">
            <div className="card-header" style={{padding:"0.625rem 1rem",borderBottom:"1px solid var(--default-border)"}}>
              <span style={{fontSize:12,fontWeight:700,color:"var(--default-text-color)",textTransform:"uppercase" as const,letterSpacing:"0.05em"}}>Primary Contact</span>
            </div>
            <div className="card-body" style={{padding:"0.75rem 1rem",display:"flex",flexDirection:"column" as const,gap:10}}>
              {[{label:"Phone Number",value:emp.mobile,icon:"ri-phone-line",bg:"rgba(108,95,252,0.1)",ic:"var(--primary-color)"},
                {label:"Email Address",value:emp.email,icon:"ri-mail-line",bg:"rgba(16,185,129,0.1)",ic:"#10b981"}].map(({label,value,icon,bg,ic})=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <i className={icon} style={{fontSize:14,color:ic}}/>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"var(--text-muted)",fontWeight:500}}>{label}</div>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--default-text-color)"}}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* This Month Stats */}
          <div className="card custom-card mb-0">
            <div className="card-header" style={{padding:"0.625rem 1rem",borderBottom:"1px solid var(--default-border)"}}>
              <span style={{fontSize:12,fontWeight:700,color:"var(--default-text-color)",textTransform:"uppercase" as const,letterSpacing:"0.05em"}}>This Month Stats</span>
            </div>
            <div className="card-body" style={{padding:"0.5rem 1rem"}}>
              {([["Present Days",emp.attendance.thisMonth.present,"#16a34a"],["Late Entries",emp.lateAttendance,"#db2777"],["Leaves Taken",emp.leavesTaken,"#0284c7"],["Open Tasks",emp.openTasks,"#4f46e5"],["Hours Logged",emp.hoursLogged+" hrs","#7c3aed"]] as [string,any,string][]).map(([label,value,color],i,arr)=>(
                <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:i<arr.length-1?"1px dashed var(--default-border)":"none",fontSize:12}}>
                  <span style={{color:"var(--text-muted)",fontWeight:500}}>{label}</span>
                  <span style={{fontWeight:800,color}}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card custom-card mb-0">
            <div className="card-header" style={{padding:"0.625rem 1rem",borderBottom:"1px solid var(--default-border)"}}>
              <span style={{fontSize:12,fontWeight:700,color:"var(--default-text-color)",textTransform:"uppercase" as const,letterSpacing:"0.05em"}}>Emergency Contact</span>
            </div>
            <div className="card-body" style={{padding:"0.5rem 1rem"}}>
              {[["Name",emp.emergencyContact.name],["Relation",emp.emergencyContact.relation],["Phone",emp.emergencyContact.phone],["Email",emp.emergencyContact.email]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"5px 0",borderBottom:"1px dashed var(--default-border)",fontSize:12}}>
                  <span style={{color:"var(--text-muted)",fontWeight:500}}>{l}</span>
                  <span style={{color:"var(--default-text-color)",fontWeight:600,textAlign:"right"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <button style={{width:"100%",padding:"10px",background:"var(--primary-color)",color:"#fff",border:"none",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer"}}>
            <i className="ri-calendar-check-line me-2"/>View Full Attendance
          </button>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="card custom-card mb-0" style={{overflow:"hidden"}}>
          {/* Tab bar */}
          <div style={{borderBottom:"1px solid var(--default-border)",padding:"0 1rem",display:"flex",overflowX:"auto" as const,scrollbarWidth:"none" as any}}>
            {TABS.map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)} style={{
                padding:"12px 14px",background:"none",border:"none",cursor:"pointer",
                whiteSpace:"nowrap" as const,fontSize:13,
                fontWeight:activeTab===tab?700:500,
                color:activeTab===tab?"var(--primary-color)":"var(--text-muted)",
                borderBottom:activeTab===tab?"2px solid var(--primary-color)":"2px solid transparent",
                marginBottom:-1,display:"flex",alignItems:"center",gap:6,
              }}>
                <i className={TAB_ICONS[tab]} style={{fontSize:14}}/>{tab}
              </button>
            ))}
          </div>
          {/* Tab content */}
          <div>
            {activeTab==="Employee Details"  && <EmployeeDetailsTab emp={emp}/>}
            {activeTab==="Attendance"        && <AttendanceTab emp={emp}/>}
            {activeTab==="Payroll"           && <PayrollTab emp={emp}/>}
            {activeTab==="Documents"         && <DocumentsTab emp={emp}/>}
            {activeTab==="Leave Management"  && <LeaveTab emp={emp}/>}
            {activeTab==="Tasks"             && <TasksTab emp={emp}/>}
            {activeTab==="Activity"          && <ActivityTab/>}
          </div>
        </div>
      </div>
    </div>
  );
}
