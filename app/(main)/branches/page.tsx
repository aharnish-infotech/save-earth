"use client";
import React, { useState, useRef } from "react";

// ── Bank Master ──────────────────────────────────────────────────────────────
const BANK_LIST = [
  { name: "State Bank of India",   code: "SBIN" },
  { name: "HDFC Bank",             code: "HDFC" },
  { name: "ICICI Bank",            code: "ICIC" },
  { name: "Axis Bank",             code: "UTIB" },
  { name: "Bank of Baroda",        code: "BARB" },
  { name: "Punjab National Bank",  code: "PUNB" },
  { name: "Canara Bank",           code: "CNRB" },
  { name: "Union Bank of India",   code: "UBIN" },
  { name: "Bank of India",         code: "BKID" },
  { name: "Bank of Maharashtra",   code: "MAHB" },
  { name: "Central Bank of India", code: "CBIN" },
  { name: "Indian Bank",           code: "IDIB" },
  { name: "IDBI Bank",             code: "IBKL" },
  { name: "Kotak Mahindra Bank",   code: "KKBK" },
  { name: "IndusInd Bank",         code: "INDB" },
  { name: "Yes Bank",              code: "YESB" },
];

interface IFSCData {
  STATE: string; DISTRICT: string; BRANCH: string; CENTRE: string;
  ADDRESS: string; CITY: string; MICR: string; ISO3166: string;
  CONTACT: string; BANK: string; BANKCODE: string; IFSC: string;
}

// ── Seed Table Data ──────────────────────────────────────────────────────────
interface Row {
  id: string; name: string; bank: string; ifsc: string;
  city: string; state: string; district: string; address: string;
  micr: string; contact: string; lat: string; lng: string;
  htlt: string; sld: string; status: string;
}

const SEED: Row[] = [
  { id:"BR-001", name:"SBI Maninagar",    bank:"State Bank of India",  ifsc:"SBIN0001234", city:"Ahmedabad", state:"Gujarat",     district:"Ahmedabad", address:"",  micr:"",  contact:"", lat:"",  lng:"",  htlt:"LT", sld:"",  status:"Active"   },
  { id:"BR-002", name:"SBI CG Road",      bank:"State Bank of India",  ifsc:"SBIN0001235", city:"Ahmedabad", state:"Gujarat",     district:"Ahmedabad", address:"",  micr:"",  contact:"", lat:"",  lng:"",  htlt:"LT", sld:"",  status:"Active"   },
  { id:"BR-003", name:"SBI Navrangpura",  bank:"State Bank of India",  ifsc:"SBIN0001236", city:"Ahmedabad", state:"Gujarat",     district:"Ahmedabad", address:"",  micr:"",  contact:"", lat:"",  lng:"",  htlt:"HT", sld:"Yes", status:"Active" },
  { id:"BR-004", name:"SBI Vastrapur",    bank:"State Bank of India",  ifsc:"SBIN0001237", city:"Ahmedabad", state:"Gujarat",     district:"Ahmedabad", address:"",  micr:"",  contact:"", lat:"",  lng:"",  htlt:"LT", sld:"",  status:"Inactive" },
  { id:"BR-005", name:"BOB Ahmedabad",    bank:"Bank of Baroda",       ifsc:"BARB0AHMCIT", city:"Ahmedabad", state:"Gujarat",     district:"Ahmedabad", address:"",  micr:"",  contact:"", lat:"",  lng:"",  htlt:"LT", sld:"",  status:"Active"   },
  { id:"BR-006", name:"PNB Delhi Main",   bank:"Punjab National Bank", ifsc:"PUNB0000100", city:"New Delhi", state:"Delhi",       district:"Central",   address:"",  micr:"",  contact:"", lat:"",  lng:"",  htlt:"HT", sld:"No",  status:"Active"  },
  { id:"BR-007", name:"Canara Bengaluru", bank:"Canara Bank",          ifsc:"CNRB0001234", city:"Bengaluru", state:"Karnataka",   district:"Bengaluru", address:"",  micr:"",  contact:"", lat:"",  lng:"",  htlt:"LT", sld:"",  status:"Active"   },
];

const FILTER_BANKS    = ["All Banks",   ...Array.from(new Set(SEED.map(r => r.bank)))];
const FILTER_STATUSES = ["All Status",  "Active", "Inactive"];
const FILTER_HTLT     = ["All Types",   "HT", "LT"];
const PAGE_SIZE = 10;

const TH: React.CSSProperties = { padding:"11px 14px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap", textAlign:"left" };
const TD: React.CSSProperties = { padding:"11px 14px", verticalAlign:"middle", fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };

// ── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ icon, iconBg, iconColor, title, children }: {
  icon: string; iconBg: string; iconColor: string; title: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ padding:"12px 16px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <i className={icon} style={{ fontSize:16, color:iconColor }}/>
        </div>
        <span style={{ fontSize:13, fontWeight:800, color:"#111827" }}>{title}</span>
      </div>
      <div style={{ padding:"14px 16px" }}>{children}</div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function BranchesPage() {
  const [rows, setRows]   = useState<Row[]>(SEED);
  const [search, setSearch]   = useState("");
  const [bankF, setBankF]     = useState("All Banks");
  const [statusF, setStatusF] = useState("All Status");
  const [htltF, setHtltF]     = useState("All Types");
  const [page, setPage]       = useState(1);

  // ── Form state ──────────────────────────────────────────────
  const [selectedBank, setSelectedBank] = useState(BANK_LIST[0]);
  const [ifscSuffix, setIfscSuffix]     = useState("");
  const [ifscData, setIfscData]         = useState<IFSCData | null>(null);
  const [ifscLoading, setIfscLoading]   = useState(false);
  const [ifscError, setIfscError]       = useState("");
  const [gps, setGps]                   = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading]     = useState(false);
  const [gpsError, setGpsError]         = useState("");
  const [gpsDenied, setGpsDenied]       = useState(false);
  const [htlt, setHtlt]                 = useState<"HT" | "LT" | "">("");
  const [sld, setSld]                   = useState("");
  const [circle, setCircle]             = useState("");
  const [rbo, setRbo]                   = useState("");
  const [branchType, setBranchType]     = useState("Urban");
  const [branchStatus, setBranchStatus] = useState("Active");
  const [success, setSuccess]           = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [viewRow, setViewRow]           = useState<Row | null>(null);
  const suffixRef = useRef<HTMLInputElement>(null);

  const fullIFSC  = `${selectedBank.code}${ifscSuffix.toUpperCase().padEnd(7,"0").slice(0,7)}`;
  const ifscReady = ifscSuffix.trim().length === 7;
  const canSubmit = ifscReady && ifscData && gps && htlt !== "" && (htlt === "LT" || (htlt === "HT" && sld !== ""));

  // ── IFSC API fetch ───────────────────────────────────────────
  const fetchIFSC = async (suffix: string) => {
    if (suffix.length !== 7) return;
    const code = `${selectedBank.code}${suffix.toUpperCase()}`;
    setIfscLoading(true); setIfscError(""); setIfscData(null);
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${code}`);
      if (!res.ok) throw new Error("IFSC not found");
      const data: IFSCData = await res.json();
      setIfscData(data);
    } catch {
      setIfscError("Invalid IFSC or branch not found. Please check and retry.");
    } finally {
      setIfscLoading(false);
    }
  };

  const handleSuffixChange = (v: string) => {
    const clean = v.replace(/[^a-zA-Z0-9]/g,"").toUpperCase().slice(0,7);
    setIfscSuffix(clean);
    setIfscData(null); setIfscError("");
    if (clean.length === 7) fetchIFSC(clean);
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bank = BANK_LIST.find(b => b.code === e.target.value) ?? BANK_LIST[0];
    setSelectedBank(bank);
    setIfscSuffix(""); setIfscData(null); setIfscError("");
  };

  // ── GPS fetch ────────────────────────────────────────────────
  const fetchGPS = () => {
    if (!navigator.geolocation) { setGpsError("not-supported"); return; }
    setGpsLoading(true); setGpsError(""); setGpsDenied(false);
    navigator.geolocation.getCurrentPosition(
      pos => { setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGpsLoading(false); },
      err => {
        setGpsLoading(false);
        if (err.code === 1) { setGpsDenied(true); setGpsError("denied"); }
        else if (err.code === 2) setGpsError("unavailable");
        else setGpsError("timeout");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleCapture = () => {
    if (!canSubmit || !ifscData || !gps) return;
    setSubmitting(true);
    const id = `BR-${String(rows.length + 1).padStart(3,"0")}`;
    const newRow: Row = {
      id,
      name:     `${selectedBank.name.split(" ").slice(0,2).join(" ")} — ${ifscData.BRANCH}`,
      bank:     selectedBank.name,
      ifsc:     ifscData.IFSC,
      city:     ifscData.CITY,
      state:    ifscData.STATE,
      district: ifscData.DISTRICT,
      address:  ifscData.ADDRESS,
      micr:     ifscData.MICR,
      contact:  ifscData.CONTACT,
      lat:      String(gps.lat),
      lng:      String(gps.lng),
      htlt,
      sld:      htlt === "HT" ? sld : "",
      status:   branchStatus,
    };
    setRows(rs => [newRow, ...rs]);
    // Reset form
    setSelectedBank(BANK_LIST[0]); setIfscSuffix(""); setIfscData(null); setIfscError("");
    setGps(null); setGpsError(""); setHtlt(""); setSld("");
    setCircle(""); setRbo(""); setBranchType("Urban"); setBranchStatus("Active");
    setSuccess(true); setSubmitting(false);
    setTimeout(() => setSuccess(false), 4000);
  };

  const handleReset = () => {
    setViewRow(null);
    setSelectedBank(BANK_LIST[0]); setIfscSuffix(""); setIfscData(null); setIfscError("");
    setGps(null); setGpsError(""); setGpsDenied(false); setHtlt(""); setSld("");
    setCircle(""); setRbo(""); setBranchType("Urban"); setBranchStatus("Active");
    setSuccess(false);
  };

  // ── Table filter ─────────────────────────────────────────────
  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    return (!q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.ifsc.toLowerCase().includes(q) || r.city.toLowerCase().includes(q))
      && (bankF   === "All Banks"   || r.bank   === bankF)
      && (statusF === "All Status"  || r.status === statusF)
      && (htltF   === "All Types"   || r.htlt   === htltF);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p     = Math.min(page, totalPages);
  const paged = filtered.slice((p-1)*PAGE_SIZE, p*PAGE_SIZE);
  const nums  = () => { const n:number[]=[]; for(let i=Math.max(1,p-2);i<=Math.min(totalPages,p+2);i++)n.push(i); return n; };

  return (
    <div style={{ padding:"24px 0" }}>
      <div style={{ marginBottom:4 }}>
        <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Branches</h4>
        <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>Dashboard / Banking Structure / <span style={{ color:"#16a34a", fontWeight:600 }}>Branches</span></div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, margin:"16px 0 20px" }}>
        {[
          { label:"Total Branches", value:rows.length,                                color:"#2563eb", bg:"#eff6ff", icon:"ri-building-2-line",      border:"#2563eb" },
          { label:"Active",         value:rows.filter(r=>r.status==="Active").length, color:"#16a34a", bg:"#f0fdf4", icon:"ri-checkbox-circle-line", border:"#16a34a" },
          { label:"HT Branches",    value:rows.filter(r=>r.htlt==="HT").length,       color:"#d97706", bg:"#fefce8", icon:"ri-flashlight-line",       border:"#d97706" },
          { label:"Banks Covered",  value:new Set(rows.map(r=>r.bank)).size,           color:"#7c3aed", bg:"#f5f3ff", icon:"ri-bank-line",             border:"#7c3aed" },
        ].map(c=>(
          <div key={c.label} style={{ background:"#fff", borderRadius:10, border:"1px solid #e5e7eb", padding:"13px 15px", display:"flex", alignItems:"center", gap:11, borderLeft:`4px solid ${c.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={c.icon} style={{ fontSize:17, color:c.color }}/>
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
              <div style={{ fontSize:10, color:"#9ca3af", fontWeight:600, marginTop:2 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Split layout */}
      <div style={{ display:"grid", gridTemplateColumns:"400px 1fr", gap:18, alignItems:"start" }}>

        {/* ── LEFT — Add Branch Form / View Panel ───────────── */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, position:"sticky", top:80 }}>

          {/* Header */}
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:"#111827" }}>{viewRow ? `Viewing — ${viewRow.id}` : "Add New Branch"}</div>
              <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>{viewRow ? viewRow.name : "Fill all sections to capture a branch"}</div>
            </div>
            {viewRow
              ? <button onClick={() => setViewRow(null)} style={{ fontSize:11, color:"#2563eb", background:"#eff6ff", border:"none", borderRadius:6, padding:"5px 11px", cursor:"pointer", fontWeight:700 }}>← Add New</button>
              : <button onClick={handleReset} style={{ fontSize:11, color:"#6b7280", background:"#f3f4f6", border:"none", borderRadius:6, padding:"5px 11px", cursor:"pointer", fontWeight:600 }}>Reset</button>
            }
          </div>

          {/* ── VIEW MODE ─────────────────────────────────────── */}
          {viewRow && (
            <>
              <SectionCard icon="ri-bank-line" iconBg="#dbeafe" iconColor="#2563eb" title="Bank Details">
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    { label:"Bank",     value: viewRow.bank   },
                    { label:"IFSC",     value: viewRow.ifsc   },
                    { label:"Branch",   value: viewRow.name   },
                    { label:"Address",  value: viewRow.address || "—" },
                    { label:"City",     value: viewRow.city   },
                    { label:"District", value: viewRow.district || "—" },
                    { label:"State",    value: viewRow.state  },
                    { label:"MICR",     value: viewRow.micr   || "—" },
                    { label:"Contact",  value: viewRow.contact || "—" },
                  ].map(f => (
                    <div key={f.label} style={{ display:"flex", gap:8 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:"#6b7280", minWidth:62, textTransform:"uppercase", paddingTop:1 }}>{f.label}</span>
                      <span style={{ fontSize:12, color:"#111827", fontWeight:500, flex:1, fontFamily: f.label==="IFSC"||f.label==="MICR"?"monospace":"inherit" }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard icon="ri-map-pin-2-line" iconBg="#fef9c3" iconColor="#ca8a04" title="GPS Co-ordinates">
                {viewRow.lat ? (
                  <div style={{ display:"flex", gap:20 }}>
                    <div>
                      <div style={{ fontSize:9, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>Latitude</div>
                      <div style={{ fontSize:14, fontWeight:800, color:"#15803d", fontFamily:"monospace", marginTop:2 }}>{parseFloat(viewRow.lat).toFixed(7)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:9, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>Longitude</div>
                      <div style={{ fontSize:14, fontWeight:800, color:"#15803d", fontFamily:"monospace", marginTop:2 }}>{parseFloat(viewRow.lng).toFixed(7)}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize:12, color:"#9ca3af" }}>GPS not captured for this branch.</div>
                )}
              </SectionCard>

              <SectionCard icon="ri-flashlight-line" iconBg="#fee2e2" iconColor="#dc2626" title="HT / LT & SLD">
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <span style={{ fontSize:20, fontWeight:900, color: viewRow.htlt==="HT"?"#dc2626":"#16a34a", background:viewRow.htlt==="HT"?"#fef2f2":"#dcfce7", borderRadius:9, padding:"8px 22px" }}>{viewRow.htlt || "—"}</span>
                  {viewRow.htlt === "HT" && (
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase" }}>SLD</div>
                      <div style={{ fontSize:13, fontWeight:700, color: viewRow.sld==="Yes"?"#d97706":"#6b7280" }}>{viewRow.sld || "—"}</div>
                    </div>
                  )}
                  {viewRow.htlt === "LT" && (
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase" }}>SLD</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#16a34a" }}>Yes (Default)</div>
                    </div>
                  )}
                </div>
              </SectionCard>

              <SectionCard icon="ri-links-line" iconBg="#f5f3ff" iconColor="#7c3aed" title="Branch Classification">
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    { label:"Status", value: viewRow.status },
                  ].map(f => (
                    <div key={f.label} style={{ display:"flex", gap:8 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:"#6b7280", minWidth:62, textTransform:"uppercase", paddingTop:1 }}>{f.label}</span>
                      <span style={{ fontSize:12, fontWeight:600, color: f.value==="Active"?"#16a34a":"#9ca3af" }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <button onClick={() => setViewRow(null)}
                style={{ width:"100%", padding:"12px", borderRadius:12, border:"none", background:"#2563eb", color:"#fff", cursor:"pointer", fontWeight:800, fontSize:13, letterSpacing:"0.05em", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <i className="ri-add-line"/>ADD NEW BRANCH
              </button>
            </>
          )}

          {/* ── ADD MODE ──────────────────────────────────────── */}
          {!viewRow && (<>

          {/* Success banner */}
          {success && (
            <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
              <i className="ri-checkbox-circle-fill" style={{ color:"#16a34a", fontSize:20 }}/>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#15803d" }}>Branch Captured Successfully</div>
                <div style={{ fontSize:11, color:"#166534", marginTop:1 }}>Branch has been added to the list below.</div>
              </div>
            </div>
          )}

          {/* 1. Bank Selection */}
          <SectionCard icon="ri-bank-line" iconBg="#dbeafe" iconColor="#2563eb" title="Bank Selection">
            <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>BANK NAME</label>
            <select
              value={selectedBank.code}
              onChange={handleBankChange}
              style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", background:"#fff", outline:"none", cursor:"pointer", fontWeight:600 }}
            >
              {BANK_LIST.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
          </SectionCard>

          {/* 2. IFSC Code */}
          <SectionCard icon="ri-barcode-line" iconBg="#dcfce7" iconColor="#16a34a" title="IFSC Code">
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
              {/* Bank code prefix pill */}
              <div style={{ flexShrink:0, background:"#111827", color:"#fff", borderRadius:8, padding:"10px 14px", fontSize:14, fontWeight:900, letterSpacing:"0.08em", fontFamily:"monospace" }}>
                {selectedBank.code}
              </div>
              {/* Suffix input */}
              <input
                ref={suffixRef}
                value={ifscSuffix}
                onChange={e => handleSuffixChange(e.target.value)}
                placeholder="0000000"
                maxLength={7}
                style={{ flex:1, border:`1.5px solid ${ifscSuffix.length===7?(ifscData?"#16a34a":ifscError?"#dc2626":"#e5e7eb"):"#e5e7eb"}`, borderRadius:9, padding:"10px 12px", fontSize:15, color:"#111827", outline:"none", fontFamily:"monospace", letterSpacing:"0.1em", fontWeight:700, textTransform:"uppercase", background:"#fafafa" }}
              />
              {ifscLoading && <i className="ri-loader-4-line" style={{ color:"#9ca3af", fontSize:18, animation:"spin 1s linear infinite" }}/>}
              {ifscData && !ifscLoading && <i className="ri-checkbox-circle-fill" style={{ color:"#16a34a", fontSize:18 }}/>}
            </div>

            {/* Full IFSC preview */}
            <div style={{ fontSize:12, color:"#6b7280", marginBottom:8 }}>
              Full IFSC: <strong style={{ color:"#111827", fontFamily:"monospace", letterSpacing:"0.06em" }}>{selectedBank.code}{ifscSuffix.toUpperCase().padEnd(7,"0").slice(0,7)}</strong>
              <span style={{ marginLeft:6, fontSize:10, color:"#9ca3af" }}>{ifscSuffix.length}/7 characters</span>
            </div>

            {/* Error */}
            {ifscError && (
              <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#dc2626", display:"flex", gap:7, alignItems:"center" }}>
                <i className="ri-error-warning-line"/>
                {ifscError}
              </div>
            )}

            {/* Fetched branch data */}
            {ifscData && (
              <div style={{ marginTop:10, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"12px", display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>Branch Details — Auto Populated</div>
                {[
                  { label:"Branch",   value: ifscData.BRANCH   },
                  { label:"Address",  value: ifscData.ADDRESS  },
                  { label:"City",     value: ifscData.CITY     },
                  { label:"District", value: ifscData.DISTRICT },
                  { label:"State",    value: ifscData.STATE    },
                  { label:"MICR",     value: ifscData.MICR     },
                  { label:"Contact",  value: ifscData.CONTACT  },
                ].map(f => f.value ? (
                  <div key={f.label} style={{ display:"flex", gap:8 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:"#6b7280", minWidth:60, textTransform:"uppercase", paddingTop:1 }}>{f.label}</span>
                    <span style={{ fontSize:12, color:"#111827", fontWeight:500, flex:1 }}>{f.value}</span>
                  </div>
                ) : null)}
              </div>
            )}
          </SectionCard>

          {/* 3. GPS Co-ordinates */}
          <SectionCard icon="ri-map-pin-2-line" iconBg="#fef9c3" iconColor="#ca8a04" title="GPS Co-ordinates">
            {!gps ? (
              <>
                {/* Permission denied — show how to enable */}
                {gpsDenied ? (
                  <div style={{ marginBottom:12 }}>
                    <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}>
                        <i className="ri-lock-line" style={{ color:"#ea580c", fontSize:18, flexShrink:0, marginTop:1 }}/>
                        <div>
                          <div style={{ fontSize:13, fontWeight:800, color:"#9a3412" }}>Location Access Blocked</div>
                          <div style={{ fontSize:11, color:"#c2410c", marginTop:2 }}>Your browser has blocked location access for this site. Follow the steps below to enable it.</div>
                        </div>
                      </div>
                      <div style={{ borderTop:"1px solid #fed7aa", paddingTop:10, display:"flex", flexDirection:"column", gap:6 }}>
                        {[
                          { step:"1", text:'Click the 🔒 lock icon in your browser\'s address bar' },
                          { step:"2", text:'Find "Location" and change it to "Allow"' },
                          { step:"3", text:'Refresh the page, then click Fetch GPS again' },
                        ].map(s => (
                          <div key={s.step} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                            <span style={{ width:18, height:18, borderRadius:"50%", background:"#ea580c", color:"#fff", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.step}</span>
                            <span style={{ fontSize:11, color:"#7c2d12", lineHeight:1.5 }}>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => window.location.reload()}
                      style={{ width:"100%", padding:"9px", borderRadius:8, border:"1px solid #fed7aa", background:"#fff7ed", color:"#ea580c", cursor:"pointer", fontWeight:700, fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <i className="ri-refresh-line"/>Refresh Page &amp; Retry
                    </button>
                  </div>
                ) : gpsError === "unavailable" ? (
                  <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#dc2626", marginBottom:10, display:"flex", gap:7, alignItems:"center" }}>
                    <i className="ri-map-pin-off-line" style={{ fontSize:16 }}/>Position unavailable. Check your device GPS or network and try again.
                  </div>
                ) : gpsError === "timeout" ? (
                  <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#dc2626", marginBottom:10, display:"flex", gap:7, alignItems:"center" }}>
                    <i className="ri-time-line" style={{ fontSize:16 }}/>Location request timed out. Move to a better signal area and retry.
                  </div>
                ) : gpsError === "not-supported" ? (
                  <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#dc2626", marginBottom:10, display:"flex", gap:7, alignItems:"center" }}>
                    <i className="ri-error-warning-line" style={{ fontSize:16 }}/>Geolocation is not supported by this browser. Please use Chrome or Edge.
                  </div>
                ) : (
                  <div style={{ fontSize:12, color:"#9ca3af", marginBottom:10 }}>Tap to fetch current location coordinates</div>
                )}

                {!gpsDenied && (
                  <button
                    onClick={fetchGPS}
                    disabled={gpsLoading}
                    style={{ width:"100%", padding:"11px", borderRadius:9, border:"none", background:gpsLoading?"#9ca3af":"#16a34a", color:"#fff", cursor:gpsLoading?"not-allowed":"pointer", fontWeight:800, fontSize:12, letterSpacing:"0.06em", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
                  >
                    {gpsLoading ? <><i className="ri-loader-4-line" style={{ animation:"spin 1s linear infinite" }}/>FETCHING LOCATION…</> : <><i className="ri-crosshair-2-line"/>FETCH GPS CO-ORDINATES</>}
                  </button>
                )}
              </>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:9, padding:"10px 14px" }}>
                  <div style={{ display:"flex", gap:16 }}>
                    <div>
                      <div style={{ fontSize:9, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>Latitude</div>
                      <div style={{ fontSize:14, fontWeight:800, color:"#15803d", fontFamily:"monospace", marginTop:2 }}>{gps.lat.toFixed(7)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:9, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>Longitude</div>
                      <div style={{ fontSize:14, fontWeight:800, color:"#15803d", fontFamily:"monospace", marginTop:2 }}>{gps.lng.toFixed(7)}</div>
                    </div>
                    <button onClick={()=>setGps(null)} style={{ marginLeft:"auto", background:"none", border:"none", color:"#9ca3af", cursor:"pointer", fontSize:18, alignSelf:"flex-start" }}>×</button>
                  </div>
                </div>
                <div style={{ fontSize:11, color:"#16a34a", display:"flex", alignItems:"center", gap:5 }}>
                  <i className="ri-checkbox-circle-fill"/>GPS co-ordinates captured
                </div>
              </div>
            )}
          </SectionCard>

          {/* 4. HT / LT */}
          <SectionCard icon="ri-flashlight-line" iconBg="#fee2e2" iconColor="#dc2626" title="Is this branch HT or LT?">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom: htlt === "HT" ? 12 : 0 }}>
              {(["HT","LT"] as const).map(type => (
                <button
                  key={type}
                  onClick={() => { setHtlt(type); setSld(type === "LT" ? "Yes" : ""); }}
                  style={{
                    padding:"12px",
                    borderRadius:10,
                    border: htlt === type ? `2px solid ${type==="HT"?"#dc2626":"#16a34a"}` : "2px solid #e5e7eb",
                    background: htlt === type ? (type==="HT"?"#fef2f2":"#f0fdf4") : "#fff",
                    color: htlt === type ? (type==="HT"?"#dc2626":"#16a34a") : "#6b7280",
                    cursor:"pointer",
                    fontWeight:800,
                    fontSize:15,
                    letterSpacing:"0.05em",
                    transition:"all 0.15s",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* SLD — only shown if HT */}
            {htlt === "HT" && (
              <div style={{ marginTop:4 }}>
                <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>Do you want SLD? <span style={{ color:"#dc2626" }}>*</span></label>
                <select
                  value={sld}
                  onChange={e => setSld(e.target.value)}
                  style={{ width:"100%", border:`1.5px solid ${sld?"#16a34a":"#e5e7eb"}`, borderRadius:9, padding:"10px 12px", fontSize:13, color: sld?"#111827":"#9ca3af", background:"#fff", outline:"none", cursor:"pointer", fontWeight:600 }}
                >
                  <option value="">Select…</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}
          </SectionCard>

          {/* 5. Branch Classification */}
          <SectionCard icon="ri-links-line" iconBg="#f5f3ff" iconColor="#7c3aed" title="Branch Classification">
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div>
                <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>Circle / Zone / AO</label>
                <input
                  value={circle}
                  onChange={e => setCircle(e.target.value)}
                  placeholder="e.g. SBI Gujarat Circle"
                  style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", outline:"none", boxSizing:"border-box", background:"#fafafa" }}
                />
              </div>
              <div>
                <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>RBO / CO / Region / ZO</label>
                <input
                  value={rbo}
                  onChange={e => setRbo(e.target.value)}
                  placeholder="e.g. Ahmedabad RBO"
                  style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", outline:"none", boxSizing:"border-box", background:"#fafafa" }}
                />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>Branch Type</label>
                  <select value={branchType} onChange={e => setBranchType(e.target.value)}
                    style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", outline:"none", cursor:"pointer", background:"#fff", fontWeight:600 }}>
                    {["Metro","Urban","Semi-Urban","Rural"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>Status</label>
                  <select value={branchStatus} onChange={e => setBranchStatus(e.target.value)}
                    style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", outline:"none", cursor:"pointer", background:"#fff", fontWeight:600 }}>
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* CAPTURE BANK */}
          <button
            onClick={handleCapture}
            disabled={!canSubmit || submitting}
            style={{
              width:"100%", padding:"14px",
              borderRadius:12, border:"none",
              background: canSubmit ? "#16a34a" : "#d1d5db",
              color:"#fff", cursor: canSubmit ? "pointer" : "not-allowed",
              fontWeight:900, fontSize:13, letterSpacing:"0.08em",
              boxShadow: canSubmit ? "0 4px 14px rgba(22,163,74,0.35)" : "none",
              transition:"all 0.2s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}
          >
            <i className="ri-map-pin-add-line"/>
            CAPTURE BANK
          </button>

          {/* Checklist */}
          <div style={{ background:"#fff", borderRadius:10, border:"1px solid #e5e7eb", padding:"12px 14px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Completion Checklist</div>
            {[
              { label:"Bank Selected",         done: true },
              { label:"IFSC Verified",          done: !!ifscData },
              { label:"GPS Captured",           done: !!gps },
              { label:"HT / LT Selected",       done: htlt !== "" },
              { label:"SLD (if HT)",            done: htlt === "LT" || (htlt === "HT" && sld !== ""), skip: htlt !== "HT" },
            ].map(item => (
              <div key={item.label} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <i className={item.done ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"} style={{ fontSize:14, color:item.done?"#16a34a":"#d1d5db" }}/>
                <span style={{ fontSize:12, color:item.done?"#374151":"#9ca3af", fontWeight:item.done?600:400 }}>{item.label}</span>
              </div>
            ))}
          </div>

          </>)}

        </div>

        {/* ── RIGHT — Table ──────────────────────────────────────── */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            <div style={{ fontSize:12, color:"#6b7280" }}>Showing <strong style={{ color:"#111827" }}>{filtered.length}</strong> branches</div>
            <div style={{ flex:1 }}/>
            <select value={bankF}   onChange={e=>{setBankF(e.target.value);setPage(1);}}   style={SEL}>{FILTER_BANKS.map(b=><option key={b}>{b}</option>)}</select>
            <select value={htltF}   onChange={e=>{setHtltF(e.target.value);setPage(1);}}   style={SEL}>{FILTER_HTLT.map(h=><option key={h}>{h}</option>)}</select>
            <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}} style={SEL}>{FILTER_STATUSES.map(s=><option key={s}>{s}</option>)}</select>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 10px" }}>
              <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:13 }}/>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Name, IFSC, city…" style={{ border:"none", outline:"none", fontSize:12, color:"#374151", width:150 }}/>
              {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:13 }}>×</button>}
            </div>
          </div>

          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>
                  <th style={TH}>ID</th>
                  <th style={TH}>BRANCH NAME</th>
                  <th style={TH}>BANK</th>
                  <th style={TH}>IFSC</th>
                  <th style={TH}>CITY / STATE</th>
                  <th style={{ ...TH, textAlign:"center" }}>HT/LT</th>
                  <th style={{ ...TH, textAlign:"center" }}>SLD</th>
                  <th style={{ ...TH, textAlign:"center" }}>GPS</th>
                  <th style={{ ...TH, textAlign:"center" }}>STATUS</th>
                  <th style={{ ...TH, textAlign:"center" }}>VIEW</th>
                </tr></thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan={10} style={{ padding:"50px", textAlign:"center", color:"#9ca3af" }}>
                      <i className="ri-building-2-line" style={{ fontSize:32, display:"block", marginBottom:8, opacity:0.3 }}/>No branches found
                    </td></tr>
                  ) : paged.map((r, i) => (
                    <tr key={r.id}
                      style={{ background: i % 2 === 0 ? "#fff" : "transparent" }}
                      onMouseEnter={e => e.currentTarget.style.background="#f9fafb"}
                      onMouseLeave={e => e.currentTarget.style.background= i % 2 === 0 ? "#fff" : "transparent"}
                    >
                      <td style={TD}><span style={{ fontSize:11, fontWeight:700, color:"#374151", background:"#f3f4f6", borderRadius:5, padding:"2px 8px", fontFamily:"monospace" }}>{r.id}</span></td>
                      <td style={TD}><span style={{ fontWeight:700, color:"#111827" }}>{r.name}</span></td>
                      <td style={{ ...TD, fontSize:12 }}>{r.bank}</td>
                      <td style={TD}><code style={{ fontSize:11, color:"#374151" }}>{r.ifsc}</code></td>
                      <td style={{ ...TD, fontSize:12, color:"#6b7280" }}>{r.city}{r.state ? `, ${r.state}` : ""}</td>
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ fontSize:11, fontWeight:800, color: r.htlt==="HT"?"#dc2626":"#16a34a", background:r.htlt==="HT"?"#fef2f2":"#dcfce7", borderRadius:6, padding:"2px 10px" }}>{r.htlt || "—"}</span>
                      </td>
                      <td style={{ ...TD, textAlign:"center" }}>
                        {r.htlt === "HT"
                          ? <span style={{ fontSize:11, fontWeight:700, color:r.sld==="Yes"?"#d97706":"#6b7280", background:r.sld==="Yes"?"#fefce8":"#f3f4f6", borderRadius:6, padding:"2px 9px" }}>{r.sld || "—"}</span>
                          : <span style={{ fontSize:11, color:"#d1d5db" }}>N/A</span>
                        }
                      </td>
                      <td style={{ ...TD, textAlign:"center" }}>
                        {r.lat
                          ? <i className="ri-map-pin-2-fill" style={{ color:"#16a34a", fontSize:16 }} title={`${r.lat}, ${r.lng}`}/>
                          : <i className="ri-map-pin-line" style={{ color:"#d1d5db", fontSize:16 }}/>
                        }
                      </td>
                      <td style={{ ...TD, textAlign:"center" }}>
                        <span style={{ fontSize:11, fontWeight:700, color:r.status==="Active"?"#16a34a":"#9ca3af", background:r.status==="Active"?"#dcfce7":"#f3f4f6", borderRadius:20, padding:"3px 10px" }}>{r.status}</span>
                      </td>
                      <td style={{ ...TD, textAlign:"center" }}>
                        <button
                          onClick={() => { setViewRow(r); setSuccess(false); }}
                          style={{ width:28, height:28, borderRadius:6, border:"1px solid #e5e7eb", background: viewRow?.id===r.id?"#eff6ff":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color: viewRow?.id===r.id?"#2563eb":"#6b7280" }}
                          title="View branch details"
                        >
                          <i className="ri-eye-line" style={{ fontSize:13 }}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding:"10px 16px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafafa" }}>
              <span style={{ fontSize:11, color:"#6b7280" }}>
                Showing <strong style={{ color:"#111827" }}>{Math.min((p-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(p*PAGE_SIZE,filtered.length)}</strong> of <strong style={{ color:"#111827" }}>{filtered.length}</strong>
              </span>
              <div style={{ display:"flex", gap:3 }}>
                <button onClick={()=>setPage(pp=>Math.max(1,pp-1))} disabled={p===1} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===1?"#f9fafb":"#fff", color:p===1?"#d1d5db":"#374151", cursor:p===1?"not-allowed":"pointer", fontSize:12 }}>‹</button>
                {nums().map(n=><button key={n} onClick={()=>setPage(n)} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, fontSize:12, fontWeight:n===p?700:400, background:n===p?"#16a34a":"#fff", color:n===p?"#fff":"#374151", cursor:"pointer" }}>{n}</button>)}
                <button onClick={()=>setPage(pp=>Math.min(totalPages,pp+1))} disabled={p===totalPages} style={{ padding:"4px 9px", border:"1px solid #e5e7eb", borderRadius:5, background:p===totalPages?"#f9fafb":"#fff", color:p===totalPages?"#d1d5db":"#374151", cursor:p===totalPages?"not-allowed":"pointer", fontSize:12 }}>›</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
