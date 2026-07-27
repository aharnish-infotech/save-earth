"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HR_EMPLOYEES, HREmployee } from "@/lib/data/hr-employees";

type Employee = HREmployee;
const EMPLOYEES = HR_EMPLOYEES;
const PAGE_SIZE = 15;

const ROLES = ["All Roles","Super Admin","Admin","Developer","HR Manager","Accountant","Coordinator","Manager","Viewer"];
const DESGS = ["All Designations","CEO & Founder","Sr. Developer","Jr. Developer","Trainee","Intern","HR Manager","Accountant","Project Manager","QA Engineer","DevOps Engineer","Data Analyst","Admin Officer","Marketing Executive","Business Analyst","Content Writer","Support Executive","Sales Manager","Operations Head","Finance Manager","UI/UX Designer"];
const DEPTS = ["All Departments","Management","Technology","HR","Finance","Operations","Marketing","Sales","Design"];
const AVATAR_COLORS = ["#15803d","#16a34a","#0284c7","#16a34a","#dc2626","#db2777","#ea580c","#ca8a04","#0891b2","#059669"];

export default function EmployeesPage() {
  const [search,  setSearch]  = useState("");
  const [role,    setRole]    = useState("All Roles");
  const [desg,    setDesg]    = useState("All Designations");
  const [dept,    setDept]    = useState("All Departments");
  const [page,    setPage]    = useState(1);
  const [selected,setSelected]= useState<Set<string>>(new Set());
  const [openMenu,setOpenMenu]= useState<string|null>(null);

  const filtered = EMPLOYEES.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q);
    const matchR = role === "All Roles" || e.role === role;
    const matchD = desg === "All Designations" || e.designation === desg;
    const matchDept = dept === "All Departments" || e.department === dept;
    return matchQ && matchR && matchD && matchDept;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage-1)*PAGE_SIZE, safePage*PAGE_SIZE);
  const allSelected= paged.length > 0 && paged.every(e => selected.has(e.id));
  const toggleAll  = () => setSelected(prev => { const n=new Set(prev); if(allSelected) paged.forEach(e=>n.delete(e.id)); else paged.forEach(e=>n.add(e.id)); return n; });

  const clearFilters = () => { setSearch(""); setRole("All Roles"); setDesg("All Designations"); setDept("All Departments"); setPage(1); };
  const hasFilter = search || role!=="All Roles" || desg!=="All Designations" || dept!=="All Departments";

  const pageNums = () => {
    const nums:number[] = [];
    for(let i=Math.max(1,safePage-2); i<=Math.min(totalPages,safePage+2); i++) nums.push(i);
    return nums;
  };

  return (
    <div style={{ padding: "1.5rem 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <div>
          <h4 style={{ fontSize:20, fontWeight:800, color:"#1e1b4b", margin:0 }}>Employees</h4>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>
            <span>Home</span><i className="ri-arrow-right-s-line" style={{ margin:"0 4px" }}/><span>HR</span><i className="ri-arrow-right-s-line" style={{ margin:"0 4px" }}/><span style={{ color:"#15803d" }}>Employees</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{...OB}}><i className="ri-user-shared-line" /> Invite Employee</button>
          <button style={{...OB}}><i className="ri-upload-2-line" /> Import</button>
          <button style={{...OB}}><i className="ri-download-2-line" /> Export</button>
          <Link href="/hr/employees/new" style={{...PB}}><i className="ri-add-line" /> Add Employee</Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3" style={{ marginBottom:"1.25rem" }}>
        {[
          { label:"Total Employees", value:EMPLOYEES.length,                                icon:"ri-group-line",           color:"#15803d", bg:"#dcfce7" },
          { label:"Active",          value:EMPLOYEES.filter(e=>e.status==="Active").length,  icon:"ri-checkbox-circle-line", color:"#16a34a", bg:"#dcfce7" },
          { label:"Inactive",        value:EMPLOYEES.filter(e=>e.status==="Inactive").length,icon:"ri-close-circle-line",    color:"#dc2626", bg:"#fee2e2" },
          { label:"Long Standing",   value:EMPLOYEES.filter(e=>e.longStanding).length,       icon:"ri-medal-line",           color:"#ca8a04", bg:"#fef9c3" },
        ].map(c=>(
          <div key={c.label} className="col">
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #dcfce7", padding:"14px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 2px 8px rgba(22,163,74,0.06)" }}>
              <div style={{ width:42, height:42, borderRadius:10, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className={c.icon} style={{ fontSize:20, color:c.color }}/>
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
                <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, marginTop:2 }}>{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #dcfce7", boxShadow:"0 2px 12px rgba(22,163,74,0.06)", overflow:"hidden" }}>
        {/* Filters */}
        <div style={{ padding:"14px 16px", borderBottom:"1px solid #f3f4f6", display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" as const }}>
          <div style={{ position:"relative", flex:1, minWidth:200 }}>
            <i className="ri-search-line" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:14 }}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search name, email, ID, designation..."
              style={{ width:"100%", padding:"7px 10px 7px 32px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:12, outline:"none", background:"#fafafa" }}/>
          </div>
          <select value={dept} onChange={e=>{setDept(e.target.value);setPage(1);}} style={{...SS}}>
            {DEPTS.map(d=><option key={d}>{d}</option>)}
          </select>
          <select value={desg} onChange={e=>{setDesg(e.target.value);setPage(1);}} style={{...SS}}>
            {DESGS.map(d=><option key={d}>{d}</option>)}
          </select>
          <select value={role} onChange={e=>{setRole(e.target.value);setPage(1);}} style={{...SS}}>
            {ROLES.map(r=><option key={r}>{r}</option>)}
          </select>
          {hasFilter && <button onClick={clearFilters} style={{ fontSize:12, color:"#dc2626", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}><i className="ri-close-line"/> Clear</button>}
          <span style={{ marginLeft:"auto", fontSize:12, color:"#9ca3af", whiteSpace:"nowrap" }}>{filtered.length} of {EMPLOYEES.length} employees</span>
        </div>

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"#f9f9fb" }}>
                <th style={{...TH}}><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor:"#16a34a" }}/></th>
                <th style={{...TH, textAlign:"left"}}>Employee</th>
                <th style={{...TH, textAlign:"left"}}>Email</th>
                <th style={{...TH, textAlign:"left"}}>User Role</th>
                <th style={{...TH, textAlign:"left"}}>Reporting To</th>
                <th style={{...TH, textAlign:"center"}}>Status</th>
                <th style={{...TH, textAlign:"center"}}>Joining Date</th>
                <th style={{...TH, textAlign:"center"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((emp, idx) => {
                const globalIdx = EMPLOYEES.findIndex(e=>e.id===emp.id);
                const avatarColor = AVATAR_COLORS[globalIdx % AVATAR_COLORS.length];
                return (
                  <tr key={emp.id} style={{ borderTop:"1px solid #f3f4f6", background:selected.has(emp.id)?"#f0fdf4":"transparent" }}>
                    <td style={{...TD, textAlign:"center", width:40}}>
                      <input type="checkbox" checked={selected.has(emp.id)} onChange={()=>setSelected(prev=>{const n=new Set(prev);n.has(emp.id)?n.delete(emp.id):n.add(emp.id);return n;})} style={{ accentColor:"#16a34a" }}/>
                    </td>
                    <td style={{...TD}}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:"50%", background:avatarColor, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:11, flexShrink:0 }}>{emp.avatar}</div>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" as const }}>
                            <Link href={`/hr/employees/${globalIdx+1}`} style={{ fontWeight:700, color:"#1e1b4b", fontSize:13, textDecoration:"none" }} onMouseEnter={e=>(e.currentTarget.style.color="#16a34a")} onMouseLeave={e=>(e.currentTarget.style.color="#1e1b4b")}>{emp.name}</Link>
                            {emp.longStanding && <span style={{ fontSize:10, fontWeight:700, color:"#ca8a04", background:"#fef9c3", borderRadius:20, padding:"1px 7px" }}>Long Standing</span>}
                          </div>
                          <div style={{ fontSize:11, color:"#9ca3af" }}>{emp.designation} · {emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{...TD}}><span style={{ color:"#374151", fontSize:12 }}>{emp.email}</span></td>
                    <td style={{...TD}}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:"#15803d", background:"#dcfce7", borderRadius:6, padding:"2px 8px" }}>
                        <i className="ri-shield-user-line" style={{ fontSize:11 }}/>{emp.role}
                      </span>
                    </td>
                    <td style={{...TD}}><span style={{ color:"#6b7280", fontSize:12 }}>{emp.reportingTo}</span></td>
                    <td style={{...TD, textAlign:"center"}}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:emp.status==="Active"?"#16a34a":"#dc2626", background:emp.status==="Active"?"#dcfce7":"#fee2e2", borderRadius:20, padding:"2px 10px" }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:emp.status==="Active"?"#16a34a":"#dc2626", display:"inline-block" }}/>{emp.status}
                      </span>
                    </td>
                    <td style={{...TD, textAlign:"center", color:"#6b7280", fontSize:12}}>{emp.joining}</td>
                    <td style={{...TD, textAlign:"center"}}>
                      <div style={{ position:"relative", display:"inline-block" }}>
                        <button onClick={()=>setOpenMenu(openMenu===emp.id?null:emp.id)}
                          style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px", borderRadius:6, color:"#6b7280", fontSize:18 }}>
                          <i className="ri-more-2-line"/>
                        </button>
                        {openMenu===emp.id&&(
                          <div style={{ position:"absolute", right:0, top:"100%", zIndex:100, background:"#fff", border:"1px solid #dcfce7", borderRadius:10, boxShadow:"0 8px 24px rgba(22,163,74,0.12)", minWidth:160, padding:"4px 0" }}>
                            <Link href={`/hr/employees/${globalIdx+1}`} onClick={()=>setOpenMenu(null)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",fontSize:13,color:"#374151",fontWeight:500,textDecoration:"none"}}><i className="ri-eye-line"/>View Profile</Link>
                            <Link href={`/hr/employees/${globalIdx+1}`} onClick={()=>setOpenMenu(null)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",fontSize:13,color:"#374151",fontWeight:500,textDecoration:"none"}}><i className="ri-edit-line"/>Edit Details</Link>
                            <Link href="/hr/attendance" onClick={()=>setOpenMenu(null)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",fontSize:13,color:"#374151",fontWeight:500,textDecoration:"none"}}><i className="ri-calendar-check-line"/>Attendance</Link>
                            <button onClick={()=>setOpenMenu(null)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#dc2626",fontWeight:500,textAlign:"left" as const}}><i className="ri-delete-bin-6-line"/>Remove</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length===0&&(
                <tr><td colSpan={8} style={{ textAlign:"center", padding:"3rem", color:"#9ca3af" }}>
                  <i className="ri-search-line" style={{ fontSize:32, display:"block", marginBottom:8 }}/> No employees found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding:"12px 16px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:12, color:"#9ca3af" }}>
            Showing {(safePage-1)*PAGE_SIZE+1} to {Math.min(safePage*PAGE_SIZE,filtered.length)} of {filtered.length} entries
          </span>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={safePage===1}
              style={{ padding:"4px 10px", borderRadius:6, border:"1px solid #e5e7eb", background:"#fff", color:safePage===1?"#d1d5db":"#6b7280", fontSize:12, fontWeight:600, cursor:safePage===1?"not-allowed":"pointer" }}>
              <i className="ri-arrow-left-s-line"/> Prev
            </button>
            {pageNums().map(n=>(
              <button key={n} onClick={()=>setPage(n)}
                style={{ padding:"4px 10px", borderRadius:6, border:"1px solid #e5e7eb", background:n===safePage?"#15803d":"#fff", color:n===safePage?"#fff":"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                {n}
              </button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={safePage===totalPages}
              style={{ padding:"4px 10px", borderRadius:6, border:"1px solid #e5e7eb", background:"#fff", color:safePage===totalPages?"#d1d5db":"#6b7280", fontSize:12, fontWeight:600, cursor:safePage===totalPages?"not-allowed":"pointer" }}>
              Next <i className="ri-arrow-right-s-line"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TH: React.CSSProperties = { padding:"10px 14px", fontWeight:700, fontSize:11, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.04em", whiteSpace:"nowrap", borderBottom:"2px solid #dcfce7" };
const TD: React.CSSProperties = { padding:"10px 14px", verticalAlign:"middle", whiteSpace:"nowrap" };
const SS: React.CSSProperties = { padding:"7px 10px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:12, color:"#374151", background:"#fafafa", cursor:"pointer", outline:"none" };
const OB: React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, border:"1.5px solid #dcfce7", background:"#fff", color:"#374151", fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none" };
const PB: React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:6, padding:"7px 16px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#15803d,#16a34a)", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", textDecoration:"none" };

