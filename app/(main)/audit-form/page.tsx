"use client";
import React, { useState, useRef, useCallback } from "react";

// ─── STEP DEFINITIONS ─────────────────────────────────────────────────────────
type Step = "capture-branch" | "branch-photo" | "ups-parameters" | "ups-sld" | "ups-questionnaire" | "electrical-parameters" | "meter-details" | "questionnaire" | "load-sheet" | "onsite-atm" | "dg-set";

const STEPS: { id: Step; label: string; shortLabel: string; icon: string; color: string; desc: string }[] = [
  { id: "capture-branch",  label: "Capture Branch",     shortLabel: "Branch",    icon: "ri-building-2-line",    color: "#2563eb", desc: "Bank, IFSC, GPS & Classification" },
  { id: "branch-photo",    label: "Branch Photo",        shortLabel: "Photo",     icon: "ri-camera-line",        color: "#0d9488", desc: "Location verification photo" },
  { id: "ups-parameters",        label: "UPS Parameters",        shortLabel: "UPS",       icon: "ri-battery-charge-line", color: "#6d28d9", desc: "Voltage, current & earthing readings" },
  { id: "ups-sld",               label: "UPS SLD Data",          shortLabel: "SLD",       icon: "ri-flow-chart",          color: "#4c1d95", desc: "MCBs, MCCB, RCCB & distribution boards" },
  { id: "ups-questionnaire",     label: "UPS Questionnaire",     shortLabel: "UPS Q",     icon: "ri-questionnaire-line",  color: "#0e7490", desc: "UPS room safety & compliance checklist" },
  { id: "electrical-parameters", label: "Electrical Parameters", shortLabel: "Electrical",icon: "ri-plug-line",           color: "#166534", desc: "Panel-wise voltage, current, PF & earthing" },
  { id: "meter-details",   label: "Meter Details",    shortLabel: "Meters",        icon: "ri-flashlight-line",       color: "#b45309", desc: "Electricity meters & billing" },
  { id: "questionnaire",  label: "Questionnaire",   shortLabel: "Questions",     icon: "ri-questionnaire-line",    color: "#0891b2", desc: "All active audit questions" },
  { id: "load-sheet",     label: "Load Sheet",       shortLabel: "Load Sheet",    icon: "ri-lightbulb-line",        color: "#16a34a", desc: "Equipment & power load details" },
  { id: "onsite-atm",    label: "Onsite ATM",       shortLabel: "ATM",           icon: "ri-bank-card-line",        color: "#7c3aed", desc: "ATM safety & compliance checklist" },
  { id: "dg-set",                label: "Diesel Generator",      shortLabel: "DG Set",    icon: "ri-settings-3-line",    color: "#b91c1c", desc: "DG specs, batteries & risk" },
];

// ─── BANK MASTER ──────────────────────────────────────────────────────────────
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

// ─── BRANCH LOAD SHEET TYPES ──────────────────────────────────────────────────
interface EquipItem {
  id: string; name: string; nos: string; watt: string; tons?: string; optional?: boolean;
}
interface EquipGroup { id: string; label: string; hasAC?: boolean; items: EquipItem[]; }

const mkItem  = (id: string, name: string, watt: string, optional = false): EquipItem => ({ id, name, nos: "", watt, optional });
const mkAC    = (id: string, name: string, watt: string): EquipItem => ({ id, name, nos: "", watt, tons: "", optional: true });

const INITIAL_GROUPS: EquipGroup[] = [
  { id: "lighting", label: "Lighting Load", items: [
    mkItem("fl2x2","Flush Lights 2X2","36"), mkItem("dl","Down Lights","12"),
    mkItem("tl","Tubelights + GSB T/Ls","40"), mkItem("led","LED Bulbs","15"),
    mkItem("cfl","CFL / PL Lights","23",true), mkItem("panel","LED Panel Lights","18",true),
    mkItem("spot","Spotlights","7",true),
  ]},
  { id: "fans", label: "Fans", items: [
    mkItem("cfan","Ceiling Fans","100"), mkItem("wfan","Wall Fans / Table Fan","80"),
    mkItem("efan","Exhaust Fans","150"), mkItem("blow","Blower","100",true),
    mkItem("afan","Air Circulators","55",true),
  ]},
  { id: "ac", label: "AC / Air Conditioning", hasAC: true, items: [
    mkAC("sac","Split AC","1500"), mkAC("cac","Cassette AC","2000"),
    mkAC("wac","Window AC","1200"), mkAC("vrf","VRF / VRV AC","1800"),
  ]},
  { id: "computers", label: "Computer / IT Equipment", items: [
    mkItem("desk","Desktop Computers","200"), mkItem("lap","Laptops","65"),
    mkItem("monit","Monitors","30"), mkItem("print","Printers / Scanners","150",true),
    mkItem("srv","Servers / NAS","400",true),
  ]},
  { id: "other", label: "Other Equipment", items: [
    mkItem("wm","Water Machine / Cooler","150"), mkItem("mw","Microwave / OTG","1000",true),
    mkItem("ktle","Electric Kettle","1500",true), mkItem("geysr","Water Heater / Geyser","2000",true),
    mkItem("cctv","CCTV System","50"), mkItem("oth","Other Miscellaneous","0",true),
  ]},
];

// ─── METER TYPES ──────────────────────────────────────────────────────────────
interface Meter {
  id: string; provider: string; type: string;
  sanctionedLoad: string; meterNo: string; consumption: string; avgBill: string;
}
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
const newMeter = (): Meter => ({ id: uid(), provider:"", type:"", sanctionedLoad:"", meterNo:"", consumption:"", avgBill:"" });

// ─── DG TYPES & DATA ──────────────────────────────────────────────────────────
type RiskLevel = "Low" | "Medium" | "High" | "Critical" | "";
interface DGQuestion {
  id: string; no: number; label: string; badge: string;
  inputType: "select" | "text" | "number" | "yesno";
  options?: string[];
  value: string; obs: string; recommendation: string; risk: RiskLevel;
}
const INITIAL_DG: DGQuestion[] = [
  { id:"dg1", no:1, label:"Is the DG set on hiring or owned by the Bank?", badge:"Hired / Owned / Not Installed", inputType:"select", options:["Hired","Owned","Not Installed"], value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg2", no:2, label:"DG set capacity",                               badge:"KVA",        inputType:"number", value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg3", no:3, label:"DG set make",                                   badge:"OEM",        inputType:"text",   value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg4", no:4, label:"Is the DG set with Acoustic enclosure?",        badge:"YES / NO",   inputType:"yesno",  value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg5", no:5, label:"DG set model / year of manufacture",            badge:"Year",       inputType:"text",   value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg6", no:6, label:"No. of DG set Batteries",                       badge:"Nos.",       inputType:"number", value:"", obs:"", recommendation:"", risk:"" },
  { id:"dg7", no:7, label:"DG set Battery rating",                         badge:"AH",         inputType:"number", value:"", obs:"", recommendation:"", risk:"" },
];
const RISK_COLORS: Record<RiskLevel, { bg: string; text: string }> = {
  "Low":      { bg:"#f0fdf4", text:"#16a34a" },
  "Medium":   { bg:"#fffbeb", text:"#d97706" },
  "High":     { bg:"#fff7ed", text:"#ea580c" },
  "Critical": { bg:"#fef2f2", text:"#dc2626" },
  "":         { bg:"#f9fafb", text:"#6b7280" },
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const card: React.CSSProperties = { background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", marginBottom:14 };
const INP: React.CSSProperties  = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"9px 12px", fontSize:13, color:"#111827", outline:"none", background:"#fff", boxSizing:"border-box" };
const LBL: React.CSSProperties  = { fontSize:11, fontWeight:700, color:"#6b7280", marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:"0.04em" };
const TH_S: React.CSSProperties  = { padding:"8px 10px", fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", textAlign:"left", whiteSpace:"nowrap" };
const TD_S: React.CSSProperties  = { padding:"8px 10px", fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6", verticalAlign:"middle" };
const NI: React.CSSProperties   = { width:"100%", border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 8px", fontSize:13, fontWeight:700, color:"#111827", textAlign:"center", outline:"none", background:"#fff", boxSizing:"border-box" };

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
function SectionCard({ icon, iconBg, iconColor, title, children }: {
  icon: string; iconBg: string; iconColor: string; title: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)", marginBottom:12 }}>
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

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — Capture Branch
// ═══════════════════════════════════════════════════════════════════════════════
interface BranchData {
  bankCode: string; ifscSuffix: string; ifscData: IFSCData | null;
  gps: { lat: number; lng: number } | null;
  htlt: "HT" | "LT" | ""; sld: string;
  circle: string; rbo: string; branchType: string;
  openingYear: string; floors: string; branchStatus: string;
}

function CaptureBranchStep({
  onComplete,
}: {
  onComplete: (data: BranchData) => void;
}) {
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
  const [openingYear, setOpeningYear]   = useState("");
  const [floors, setFloors]             = useState("");
  const [branchStatus, setBranchStatus] = useState("Active");
  const suffixRef = useRef<HTMLInputElement>(null);

  const canProceed = ifscSuffix.trim().length === 7 && !!ifscData && !!gps && htlt !== "" && (htlt === "LT" || (htlt === "HT" && sld !== ""));

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
    setIfscSuffix(clean); setIfscData(null); setIfscError("");
    if (clean.length === 7) fetchIFSC(clean);
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bank = BANK_LIST.find(b => b.code === e.target.value) ?? BANK_LIST[0];
    setSelectedBank(bank); setIfscSuffix(""); setIfscData(null); setIfscError("");
  };

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

  const handleProceed = () => {
    if (!canProceed) return;
    onComplete({
      bankCode: selectedBank.code, ifscSuffix, ifscData, gps,
      htlt, sld, circle, rbo, branchType, openingYear, floors, branchStatus,
    });
  };

  const checklist = [
    { label: "Bank Selected",    done: true },
    { label: "IFSC Verified",    done: !!ifscData },
    { label: "GPS Captured",     done: !!gps },
    { label: "HT / LT Selected", done: htlt !== "" },
    { label: "SLD (if HT)",      done: htlt === "LT" || (htlt === "HT" && sld !== "") },
  ];
  const doneCt = checklist.filter(c => c.done).length;

  return (
    <div style={{ maxWidth:680, margin:"0 auto" }}>

      {/* Progress bar */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 18px", marginBottom:16, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>Completion</span>
          <span style={{ fontSize:13, fontWeight:800, color:"#2563eb" }}>{doneCt} / {checklist.length}</span>
        </div>
        <div style={{ height:6, background:"#f3f4f6", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${(doneCt/checklist.length)*100}%`, background:"linear-gradient(90deg,#2563eb,#60a5fa)", borderRadius:99, transition:"width 0.3s ease" }}/>
        </div>
        <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
          {checklist.map(item => (
            <div key={item.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <i className={item.done ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"} style={{ fontSize:13, color:item.done?"#2563eb":"#d1d5db" }}/>
              <span style={{ fontSize:11, color:item.done?"#374151":"#9ca3af", fontWeight:item.done?600:400 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

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
          <div style={{ flexShrink:0, background:"#111827", color:"#fff", borderRadius:8, padding:"10px 14px", fontSize:14, fontWeight:900, letterSpacing:"0.08em", fontFamily:"monospace" }}>
            {selectedBank.code}
          </div>
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
        <div style={{ fontSize:12, color:"#6b7280", marginBottom:8 }}>
          Full IFSC: <strong style={{ color:"#111827", fontFamily:"monospace", letterSpacing:"0.06em" }}>{selectedBank.code}{ifscSuffix.toUpperCase().padEnd(7,"0").slice(0,7)}</strong>
          <span style={{ marginLeft:6, fontSize:10, color:"#9ca3af" }}>{ifscSuffix.length}/7 characters</span>
        </div>
        {ifscError && (
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#dc2626", display:"flex", gap:7, alignItems:"center" }}>
            <i className="ri-error-warning-line"/>{ifscError}
          </div>
        )}
        {ifscData && (
          <div style={{ marginTop:10, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"12px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Branch Details — Auto Populated</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                { label:"Branch",   value: ifscData.BRANCH   },
                { label:"Address",  value: ifscData.ADDRESS  },
                { label:"City",     value: ifscData.CITY     },
                { label:"District", value: ifscData.DISTRICT },
                { label:"State",    value: ifscData.STATE    },
                { label:"MICR",     value: ifscData.MICR     },
                { label:"Contact",  value: ifscData.CONTACT  },
              ].filter(f => f.value).map(f => (
                <div key={f.label} style={{ display:"flex", gap:8 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:"#6b7280", minWidth:60, textTransform:"uppercase", paddingTop:1 }}>{f.label}</span>
                  <span style={{ fontSize:12, color:"#111827", fontWeight:500, flex:1 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* 3. GPS Co-ordinates */}
      <SectionCard icon="ri-map-pin-2-line" iconBg="#fef9c3" iconColor="#ca8a04" title="GPS Co-ordinates">
        {!gps ? (
          <>
            {gpsDenied ? (
              <div style={{ marginBottom:12 }}>
                <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}>
                    <i className="ri-lock-line" style={{ color:"#ea580c", fontSize:18, flexShrink:0, marginTop:1 }}/>
                    <div>
                      <div style={{ fontSize:13, fontWeight:800, color:"#9a3412" }}>Location Access Blocked</div>
                      <div style={{ fontSize:11, color:"#c2410c", marginTop:2 }}>Follow the steps below to enable location access.</div>
                    </div>
                  </div>
                  <div style={{ borderTop:"1px solid #fed7aa", paddingTop:10, display:"flex", flexDirection:"column", gap:6 }}>
                    {[
                      { step:"1", text:"Click the 🔒 lock icon in your browser's address bar" },
                      { step:"2", text:'Find "Location" and change it to "Allow"' },
                      { step:"3", text:"Refresh the page, then click Fetch GPS again" },
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
                  <i className="ri-refresh-line"/>Refresh Page & Retry
                </button>
              </div>
            ) : gpsError === "unavailable" ? (
              <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#dc2626", marginBottom:10, display:"flex", gap:7, alignItems:"center" }}>
                <i className="ri-map-pin-off-line" style={{ fontSize:16 }}/>Position unavailable. Check your device GPS and try again.
              </div>
            ) : gpsError === "timeout" ? (
              <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#dc2626", marginBottom:10, display:"flex", gap:7, alignItems:"center" }}>
                <i className="ri-time-line" style={{ fontSize:16 }}/>Location request timed out. Move to a better signal area and retry.
              </div>
            ) : gpsError === "not-supported" ? (
              <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#dc2626", marginBottom:10, display:"flex", gap:7, alignItems:"center" }}>
                <i className="ri-error-warning-line" style={{ fontSize:16 }}/>Geolocation not supported. Please use Chrome or Edge.
              </div>
            ) : (
              <div style={{ fontSize:12, color:"#9ca3af", marginBottom:10 }}>Tap to fetch current location coordinates</div>
            )}
            {!gpsDenied && (
              <button onClick={fetchGPS} disabled={gpsLoading}
                style={{ width:"100%", padding:"11px", borderRadius:9, border:"none", background:gpsLoading?"#9ca3af":"#16a34a", color:"#fff", cursor:gpsLoading?"not-allowed":"pointer", fontWeight:800, fontSize:12, letterSpacing:"0.06em", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
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
                <button onClick={() => setGps(null)} style={{ marginLeft:"auto", background:"none", border:"none", color:"#9ca3af", cursor:"pointer", fontSize:18, alignSelf:"flex-start" }}>×</button>
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
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom: htlt !== "" ? 12 : 0 }}>
          {(["HT","LT"] as const).map(type => (
            <button key={type} onClick={() => { setHtlt(type); setSld(type === "LT" ? "Yes" : ""); }}
              style={{
                padding:"12px", borderRadius:10,
                border: htlt === type ? `2px solid ${type==="HT"?"#dc2626":"#16a34a"}` : "2px solid #e5e7eb",
                background: htlt === type ? (type==="HT"?"#fef2f2":"#f0fdf4") : "#fff",
                color: htlt === type ? (type==="HT"?"#dc2626":"#16a34a") : "#6b7280",
                cursor:"pointer", fontWeight:800, fontSize:15, letterSpacing:"0.05em", transition:"all 0.15s",
              }}
            >{type}</button>
          ))}
        </div>
        {htlt !== "" && (
          <div style={{ marginTop:4 }}>
            <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>
              Do you want SLD?{htlt==="HT" && <span style={{ color:"#dc2626" }}> *</span>}
            </label>
            {htlt === "LT" ? (
              <div style={{ display:"flex", alignItems:"center", gap:8, border:"1.5px solid #86efac", borderRadius:9, padding:"10px 12px", background:"#f0fdf4" }}>
                <i className="ri-checkbox-circle-fill" style={{ color:"#16a34a", fontSize:16 }}/>
                <span style={{ fontSize:13, fontWeight:700, color:"#15803d" }}>Yes</span>
                <span style={{ fontSize:11, color:"#6b7280", marginLeft:4 }}>(Default for LT — always required)</span>
              </div>
            ) : (
              <select value={sld} onChange={e => setSld(e.target.value)}
                style={{ width:"100%", border:`1.5px solid ${sld?"#16a34a":"#e5e7eb"}`, borderRadius:9, padding:"10px 12px", fontSize:13, color:sld?"#111827":"#9ca3af", background:"#fff", outline:"none", cursor:"pointer", fontWeight:600 }}>
                <option value="">Select…</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            )}
          </div>
        )}
      </SectionCard>

      {/* 5. Branch Classification */}
      <SectionCard icon="ri-links-line" iconBg="#f5f3ff" iconColor="#7c3aed" title="Branch Classification">
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div>
            <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>Circle / Zone / AO</label>
            <input value={circle} onChange={e => setCircle(e.target.value)} placeholder="e.g. SBI Gujarat Circle"
              style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", outline:"none", boxSizing:"border-box", background:"#fafafa" }}/>
          </div>
          <div>
            <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>RBO / CO / Region / ZO</label>
            <input value={rbo} onChange={e => setRbo(e.target.value)} placeholder="e.g. Ahmedabad RBO"
              style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", outline:"none", boxSizing:"border-box", background:"#fafafa" }}/>
          </div>
          <div>
            <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>Branch Type</label>
            <select value={branchType} onChange={e => setBranchType(e.target.value)}
              style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", outline:"none", cursor:"pointer", background:"#fff", fontWeight:600 }}>
              {["Metro","Urban","Semi-Urban","Rural"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>Branch Opening Year</label>
              <select value={openingYear} onChange={e => setOpeningYear(e.target.value)}
                style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:openingYear?"#111827":"#9ca3af", outline:"none", cursor:"pointer", background:"#fff", fontWeight:600 }}>
                <option value="">— Select Year —</option>
                {Array.from({ length: 2035 - 1950 + 1 }, (_, i) => 2035 - i).map(y => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>No. of Floors</label>
              <input type="number" min="1" max="99" value={floors} onChange={e => setFloors(e.target.value)} placeholder="e.g. 3"
                style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", outline:"none", boxSizing:"border-box", background:"#fafafa" }}/>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 6. Status */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"14px 16px", marginBottom:16, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>STATUS</div>
        <div style={{ display:"flex", border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden" }}>
          {(["Active","Inactive"] as const).map((s, i) => {
            const sel = branchStatus === s;
            const col = s === "Active" ? "#16a34a" : "#dc2626";
            return (
              <button key={s} onClick={() => setBranchStatus(s)}
                style={{ flex:1, padding:"7px 10px", border:"none", borderRight:i<1?"1px solid #e5e7eb":"none", cursor:"pointer", fontSize:12, fontWeight:700,
                  background:sel?col:"#fff", color:sel?"#fff":col, transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <i className={s==="Active"?"ri-checkbox-circle-line":"ri-close-circle-line"} style={{ fontSize:14 }}/>{s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Proceed button — always enabled in testing mode */}
      <button onClick={handleProceed}
        style={{
          width:"100%", padding:"15px", borderRadius:12, border:"none",
          background: canProceed ? "#2563eb" : "#60a5fa",
          color:"#fff", cursor:"pointer",
          fontWeight:900, fontSize:13, letterSpacing:"0.08em",
          boxShadow:"0 4px 14px rgba(37,99,235,0.35)",
          transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        }}>
        <i className="ri-arrow-right-line"/>
        PROCEED TO BRANCH PHOTO
      </button>

      {!canProceed && (
        <p style={{ textAlign:"center", fontSize:11, color:"#9ca3af", marginTop:10 }}>
          ⚡ Testing mode — proceed freely without filling all fields
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — Branch Load Sheet
// ═══════════════════════════════════════════════════════════════════════════════
function LoadSheetSection({ branchName }: { branchName: string }) {
  const [groups, setGroups] = useState<EquipGroup[]>(INITIAL_GROUPS);
  const [open, setOpen]     = useState<Record<string,boolean>>({ lighting:true, fans:true, ac:true, computers:false, other:false });
  const [saved, setSaved]   = useState(false);

  const upd = useCallback((gid:string, iid:string, field:keyof EquipItem, val:string) =>
    setGroups(gs => gs.map(g => g.id!==gid ? g : { ...g, items: g.items.map(i => i.id!==iid ? i : {...i,[field]:val}) })), []);

  const grand  = groups.reduce((s,g) => s + g.items.reduce((a,i) => a + (parseFloat(i.nos)||0)*(parseFloat(i.watt)||0), 0), 0);
  const active = groups.reduce((s,g) => s + g.items.filter(i => parseFloat(i.nos)>0).length, 0);
  const save   = () => { setSaved(true); setTimeout(()=>setSaved(false),3000); };

  return (
    <div>
      {saved && <div style={{marginBottom:14,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
        <i className="ri-checkbox-circle-fill" style={{color:"#16a34a",fontSize:18}}/><span style={{fontSize:13,fontWeight:700,color:"#15803d"}}>Load Sheet saved successfully</span>
      </div>}

      <div style={card}>
        <div style={{padding:"13px 18px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="ri-building-2-line" style={{color:"#16a34a",fontSize:16}}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#111827"}}>{branchName}</div>
            <div style={{fontSize:11,color:"#9ca3af"}}>Branch Load Sheet — S.No 1</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr"}}>
          {[{l:"Total (W)",v:grand.toFixed(0),c:"#16a34a"},{l:"Total (kW)",v:(grand/1000).toFixed(2),c:"#2563eb"},{l:"Active Items",v:String(active),c:"#d97706"}].map((s,i)=>(
            <div key={s.l} style={{padding:"14px 18px",borderRight:i<2?"1px solid #f3f4f6":"none",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:10,color:"#9ca3af",fontWeight:600,marginTop:3,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{padding:"13px 18px",borderBottom:"1px solid #e5e7eb",background:"#f9fafb",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:13,fontWeight:900,color:"#fff"}}>1</span>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"#111827"}}>Equipment Load Details</div>
            <div style={{fontSize:11,color:"#9ca3af"}}>Enter Nos. and Wattage per item</div>
          </div>
        </div>
        {groups.map((group,gi) => {
          const gt = group.items.reduce((s,i) => s + (parseFloat(i.nos)||0)*(parseFloat(i.watt)||0), 0);
          const isOpen = open[group.id] !== false;
          return (
            <div key={group.id}>
              <div onClick={()=>setOpen(o=>({...o,[group.id]:!o[group.id]}))}
                style={{padding:"10px 18px",background:"#fafafa",borderTop:gi>0?"1px solid #e5e7eb":"none",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",userSelect:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:3,height:18,borderRadius:99,background:"#16a34a"}}/>
                  <span style={{fontSize:12,fontWeight:800,color:"#374151"}}>{group.label}</span>
                  {group.id==="ac" && <span style={{fontSize:10,fontWeight:700,color:"#d97706",background:"#fef3c7",borderRadius:20,padding:"1px 8px"}}>Optional</span>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {gt>0 && <span style={{fontSize:12,fontWeight:800,color:"#16a34a"}}>{gt.toFixed(0)} W</span>}
                  <i className={`ri-arrow-${isOpen?"up":"down"}-s-line`} style={{color:"#9ca3af",fontSize:16}}/>
                </div>
              </div>
              {isOpen && (
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr>
                      <th style={{...TH_S,width:"40%",paddingLeft:20}}>Equipment Installed</th>
                      {group.hasAC && <th style={{...TH_S,width:80,textAlign:"center"}}>Tons</th>}
                      <th style={{...TH_S,width:90,textAlign:"center"}}>Nos.</th>
                      <th style={{...TH_S,width:100,textAlign:"center"}}>Watt (W)</th>
                      <th style={{...TH_S,width:100,textAlign:"right",paddingRight:18}}>Total W</th>
                    </tr></thead>
                    <tbody>
                      {group.items.map(item => {
                        const tw = (parseFloat(item.nos)||0)*(parseFloat(item.watt)||0);
                        return (
                          <tr key={item.id} onMouseEnter={e=>(e.currentTarget.style.background="#f9fafb")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                            <td style={{...TD_S,paddingLeft:20,color:item.optional&&!parseFloat(item.nos)?"#9ca3af":"#374151"}}>{item.name}</td>
                            {group.hasAC && <td style={{...TD_S,textAlign:"center"}}>
                              <input type="number" value={item.tons??""} placeholder="-" onChange={e=>upd(group.id,item.id,"tons",e.target.value)} style={{...NI,width:60,color:"#7c3aed"}}/>
                            </td>}
                            <td style={{...TD_S,textAlign:"center"}}>
                              <input type="number" min="0" value={item.nos} placeholder="-" onChange={e=>upd(group.id,item.id,"nos",e.target.value)}
                                style={{...NI,width:70,background:parseFloat(item.nos)>0?"#f0fdf4":"#fff",color:parseFloat(item.nos)>0?"#16a34a":"#9ca3af",borderColor:parseFloat(item.nos)>0?"#86efac":"#e5e7eb"}}/>
                            </td>
                            <td style={{...TD_S,textAlign:"center"}}>
                              <input type="number" min="0" value={item.watt} onChange={e=>upd(group.id,item.id,"watt",e.target.value)} style={{...NI,width:80,color:"#2563eb"}}/>
                            </td>
                            <td style={{...TD_S,textAlign:"right",paddingRight:18}}>
                              <span style={{fontSize:13,fontWeight:tw>0?800:400,color:tw>0?"#111827":"#d1d5db"}}>{tw>0?tw.toFixed(0):"0"}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{padding:"10px 18px",background:gt>0?"#16a34a":"#374151",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#fff"}}>{group.label} Total</span>
                    <span style={{fontSize:15,fontWeight:900,color:"#fff"}}>{gt.toFixed(0)} W</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div style={{padding:"16px 18px",background:grand>0?"linear-gradient(135deg,#16a34a,#15803d)":"#374151",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"2px solid #fff"}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.8)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Grand Total Wattage</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>All equipment combined</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:26,fontWeight:900,color:"#fff",lineHeight:1}}>{grand.toFixed(0)} W</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>{(grand/1000).toFixed(2)} kW</div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={save} style={{padding:"12px 28px",borderRadius:10,border:"none",background:"#16a34a",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 14px rgba(22,163,74,0.35)"}}>
          <i className="ri-save-line"/>Save Load Sheet
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — Meter Details
// ═══════════════════════════════════════════════════════════════════════════════
function MeterDetailsSection({ branchName }: { branchName: string }) {
  const [meters, setMeters] = useState<Meter[]>([newMeter()]);
  const [saved, setSaved]   = useState(false);

  const upd        = (id:string, field:keyof Meter, val:string) => setMeters(ms => ms.map(m => m.id!==id ? m : {...m,[field]:val}));
  const addMeter   = () => setMeters(ms => [...ms, newMeter()]);
  const removeMeter= (id:string) => setMeters(ms => ms.filter(m => m.id!==id));
  const save       = () => { setSaved(true); setTimeout(()=>setSaved(false),3000); };

  const amber = "#b45309"; const amberBg = "#fef3c7"; const amberDark = "#92400e";

  return (
    <div>
      {saved && <div style={{marginBottom:14,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
        <i className="ri-checkbox-circle-fill" style={{color:amber,fontSize:18}}/><span style={{fontSize:13,fontWeight:700,color:amberDark}}>Meter details saved successfully</span>
      </div>}
      <div style={{...card,overflow:"hidden"}}>
        <div style={{padding:"12px 18px",background:"linear-gradient(135deg,#b45309,#92400e)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="ri-flashlight-line" style={{color:"#fff",fontSize:16}}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{branchName}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.75)"}}>Electricity meter info, sanctioned load &amp; billing</div>
          </div>
          <div style={{marginLeft:"auto",background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:700,color:"#fff"}}>{meters.length} Meter{meters.length>1?"s":""}</div>
        </div>
      </div>
      {meters.map((m, idx) => (
        <div key={m.id} style={card}>
          <div style={{padding:"12px 18px",background:amberBg,borderBottom:"1px solid #fde68a",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:8,background:amber,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:13,fontWeight:900,color:"#fff"}}>{idx+1}</span>
              </div>
              <span style={{fontSize:14,fontWeight:800,color:amberDark}}>Meter {idx+1}</span>
            </div>
            {meters.length > 1 && (
              <button onClick={()=>removeMeter(m.id)} style={{border:"none",background:"transparent",cursor:"pointer",color:"#ef4444",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                <i className="ri-delete-bin-line"/>Remove
              </button>
            )}
          </div>
          <div style={{padding:18,display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={LBL}>Services Provider</label><input placeholder="e.g. TORRENT" value={m.provider} onChange={e=>upd(m.id,"provider",e.target.value)} style={INP}/></div>
              <div>
                <label style={LBL}>Type</label>
                <select value={m.type} onChange={e=>upd(m.id,"type",e.target.value)} style={INP}>
                  <option value="">e.g. 3 PHASE</option>
                  <option>1 PHASE</option><option>3 PHASE</option>
                  <option>HT (High Tension)</option><option>LT (Low Tension)</option>
                </select>
              </div>
            </div>
            <div><label style={LBL}>Qty. Sanctioned Load (KW)</label><input type="number" placeholder="e.g. 21.780" value={m.sanctionedLoad} onChange={e=>upd(m.id,"sanctionedLoad",e.target.value)} style={INP}/></div>
            <div><label style={LBL}>Meter No.</label><input placeholder="e.g. 27001760" value={m.meterNo} onChange={e=>upd(m.id,"meterNo",e.target.value)} style={INP}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={LBL}>Consumption (units/month)</label><input placeholder="e.g. 2000-3000" value={m.consumption} onChange={e=>upd(m.id,"consumption",e.target.value)} style={INP}/></div>
              <div><label style={LBL}>Avg. Bill/month</label><input placeholder="e.g. 20-40K" value={m.avgBill} onChange={e=>upd(m.id,"avgBill",e.target.value)} style={INP}/></div>
            </div>
          </div>
        </div>
      ))}
      <button onClick={addMeter}
        style={{width:"100%",padding:"13px",borderRadius:12,border:`2px dashed ${amber}`,background:"transparent",color:amber,fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <i className="ri-add-line" style={{fontSize:16}}/>+ Add Another Meter
      </button>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={save}
          style={{padding:"12px 28px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#b45309,#92400e)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 14px rgba(180,83,9,0.35)"}}>
          <i className="ri-save-line"/>Save Meter Details
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 9 — DG Set  (questions sourced from Question Library — "DG Set / Generator" section)
// ═══════════════════════════════════════════════════════════════════════════════
function DGSetSection({ branchName }: { branchName: string }) {
  // Spec fields (7 operational items)
  const [specs, setSpecs]     = useState<DGQuestion[]>(INITIAL_DG);
  // Library questions (Q-031–Q-033)
  const DG_LIB = AUDIT_QUESTIONS.filter(q => q.section === "DG Set / Generator");
  const initAnswers = () => Object.fromEntries(DG_LIB.map(q => [q.id, { answer:"", remarks:"", photo:null } as AuditAnswer]));
  const [answers, setAnswers] = useState<Record<string, AuditAnswer>>(initAnswers);
  const [saved, setSaved]     = useState(false);

  const updSpec  = (id: string, field: keyof DGQuestion, val: string) =>
    setSpecs(qs => qs.map(q => q.id !== id ? q : { ...q, [field]: val }));
  const onAnswer = (id: string, field: keyof AuditAnswer, val: string | null) =>
    setAnswers(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const red = "#b91c1c"; const redBg = "#fef2f2"; const redDark = "#7f1d1d";

  return (
    <div>
      {saved && (
        <div style={{ marginBottom:14, background:redBg, border:"1px solid #fecaca", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <i className="ri-checkbox-circle-fill" style={{ color:red, fontSize:18 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:redDark }}>DG Set details saved successfully</span>
        </div>
      )}

      {/* Header */}
      <div style={{ ...card, overflow:"hidden" }}>
        <div style={{ padding:"12px 18px", background:"linear-gradient(135deg,#b91c1c,#7f1d1d)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="ri-settings-3-line" style={{ color:"#fff", fontSize:16 }}/>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>{branchName}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)" }}>DG specs, batteries, acoustic enclosure &amp; risk level</div>
          </div>
        </div>
      </div>

      {/* ── Section A: DG Specifications ── */}
      <div style={{ fontSize:11, fontWeight:800, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8, marginTop:4 }}>
        A — DG Set Specifications
      </div>
      {specs.map(q => {
        const rCol = RISK_COLORS[q.risk];
        return (
          <div key={q.id} style={card}>
            <div style={{ padding:"12px 16px", background:redBg, borderBottom:"1px solid #fecaca", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ minWidth:28, height:28, borderRadius:8, background:red, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:12, fontWeight:900, color:"#fff" }}>{q.no}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:800, color:"#1f2937" }}>{q.label}</span>
              </div>
              <span style={{ fontSize:10, fontWeight:700, color:"#6b7280", background:"#fff", border:"1px solid #e5e7eb", borderRadius:20, padding:"2px 10px", whiteSpace:"nowrap" }}>{q.badge}</span>
            </div>
            <div style={{ padding:16, display:"flex", flexDirection:"column", gap:12 }}>
              {q.inputType === "select" && (
                <div><label style={LBL}>Observations / Remarks</label>
                  <select value={q.value} onChange={e => updSpec(q.id, "value", e.target.value)} style={INP}>
                    <option value="">— Select —</option>
                    {q.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              )}
              {(q.inputType === "text" || q.inputType === "number") && (
                <div><label style={LBL}>Observations / Remarks</label>
                  <input type={q.inputType} placeholder={`Enter ${q.badge}`} value={q.value} onChange={e => updSpec(q.id, "value", e.target.value)} style={INP}/>
                </div>
              )}
              {q.inputType === "yesno" && (
                <div><label style={LBL}>Observations / Remarks</label>
                  <div style={{ display:"flex", gap:10 }}>
                    {["Yes","No"].map(opt => (
                      <button key={opt} onClick={() => updSpec(q.id, "value", opt)}
                        style={{ flex:1, padding:"9px", borderRadius:8, border:`2px solid ${q.value===opt ? red : "#e5e7eb"}`, background:q.value===opt ? redBg : "#fff", color:q.value===opt ? red : "#374151", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={LBL}>Recommendation (Safety)</label>
                  <input placeholder="Enter recommendation" value={q.recommendation} onChange={e => updSpec(q.id, "recommendation", e.target.value)} style={INP}/>
                </div>
                <div>
                  <label style={LBL}>Risk Level</label>
                  <select value={q.risk} onChange={e => updSpec(q.id, "risk", e.target.value as RiskLevel)}
                    style={{ ...INP, background:rCol.bg, color:rCol.text, fontWeight:700 }}>
                    <option value="">— Select —</option>
                    {(["Low","Medium","High","Critical"] as RiskLevel[]).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Section B: Question Library ── */}
      <div style={{ fontSize:11, fontWeight:800, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8, marginTop:6 }}>
        B — Audit Checklist (Question Library)
      </div>
      {DG_LIB.map(q => (
        <QuestionCard key={q.id} q={q} ans={answers[q.id]} onAnswer={onAnswer} />
      ))}

      {/* Save */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
        <button onClick={save}
          style={{ padding:"12px 28px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#b91c1c,#7f1d1d)", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 14px rgba(185,28,28,0.35)" }}>
          <i className="ri-save-line"/>Save DG Set Details
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — Branch Photo
// ═══════════════════════════════════════════════════════════════════════════════
function BranchPhotoSection({ branchName, onContinue }: { branchName: string; onContinue: () => void }) {
  const [photo, setPhoto]       = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const teal = "#0d9488"; const tealDark = "#0f766e"; const tealBg = "#f0fdfa"; const tealBorder = "#99f6e4";

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => setPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ maxWidth:600, margin:"0 auto" }}>

      {/* Instruction card */}
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", padding:"32px 24px", textAlign:"center", marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ width:72, height:72, borderRadius:20, background:tealBg, border:`1px solid ${tealBorder}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
          <i className="ri-camera-line" style={{ fontSize:34, color:teal }}/>
        </div>
        <h3 style={{ fontSize:20, fontWeight:900, color:"#111827", margin:"0 0 10px" }}>Please step outside the branch</h3>
        <p style={{ fontSize:14, color:"#6b7280", lineHeight:1.6, margin:0 }}>
          Take a clear photo of the branch entrance / building exterior and submit to proceed.
        </p>
      </div>

      {/* Drop / capture zone */}
      {photo ? (
        <div style={{ borderRadius:16, overflow:"hidden", border:`2px solid ${teal}`, marginBottom:16, position:"relative", boxShadow:"0 4px 16px rgba(13,148,136,0.2)" }}>
          <img src={photo} alt="Branch exterior" style={{ width:"100%", display:"block", maxHeight:320, objectFit:"cover" }}/>
          <div style={{ position:"absolute", top:10, right:10, display:"flex", gap:8 }}>
            <button
              onClick={() => setPhoto(null)}
              style={{ background:"rgba(0,0,0,0.6)", border:"none", borderRadius:8, padding:"6px 12px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
              <i className="ri-refresh-line"/>Retake
            </button>
          </div>
          <div style={{ background:`linear-gradient(135deg,${teal},${tealDark})`, padding:"10px 16px", display:"flex", alignItems:"center", gap:8 }}>
            <i className="ri-checkbox-circle-fill" style={{ color:"#fff", fontSize:16 }}/>
            <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>Photo captured — ready to submit</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{
            borderRadius:16, border:`2px dashed ${dragging ? teal : "#d1d5db"}`,
            background: dragging ? tealBg : "#fafafa",
            padding:"48px 24px", textAlign:"center", cursor:"pointer",
            marginBottom:16, transition:"all 0.15s",
          }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
            <i className="ri-camera-line" style={{ fontSize:28, color:"#9ca3af" }}/>
          </div>
          <div style={{ fontSize:16, fontWeight:800, color:"#111827", marginBottom:5 }}>Tap to capture photo</div>
          <div style={{ fontSize:13, color:"#9ca3af" }}>Branch exterior / entrance</div>
          <div style={{ fontSize:11, color:"#d1d5db", marginTop:10 }}>or drag and drop an image here</div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display:"none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}

      {/* Photo tips */}
      <div style={{ background:tealBg, border:`1px solid ${tealBorder}`, borderRadius:12, padding:"14px 16px", marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
          <i className="ri-camera-2-line" style={{ color:teal, fontSize:16 }}/>
          <span style={{ fontSize:13, fontWeight:800, color:tealDark }}>Photo Tips</span>
        </div>
        {[
          "Ensure the bank name board is clearly visible",
          "Stand at least 5–8 metres from the entrance",
          "Avoid glare or obstructions in the frame",
        ].map(tip => (
          <div key={tip} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:6 }}>
            <span style={{ color:teal, fontSize:13, lineHeight:1.5, flexShrink:0 }}>•</span>
            <span style={{ fontSize:13, color:"#374151", lineHeight:1.5 }}>{tip}</span>
          </div>
        ))}
      </div>

      {/* Submit & Continue */}
      <button
        onClick={onContinue}
        style={{
          width:"100%", padding:"15px", borderRadius:12, border:"none",
          background: photo
            ? `linear-gradient(135deg,${teal},${tealDark})`
            : "#d1d5db",
          color:"#fff", cursor:"pointer",
          fontWeight:900, fontSize:14, letterSpacing:"0.06em",
          boxShadow: photo ? "0 4px 14px rgba(13,148,136,0.35)" : "none",
          transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        }}>
        Submit &amp; Continue →
      </button>

      {!photo && (
        <p style={{ textAlign:"center", fontSize:11, color:"#9ca3af", marginTop:8 }}>
          Capture a photo above to enable submit
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — UPS Parameters  (multi-UPS, phase-conditional readings)
// ═══════════════════════════════════════════════════════════════════════════════
interface MCBEntry { id: string; amp: string; pole: string; nos: string; }
const newMCB = (): MCBEntry => ({ id: uid(), amp: "", pole: "", nos: "" });

interface UPSUnit {
  id: string; name: string;
  type: "Branch" | "ATM" | "";
  isInverter: "UPS" | "Inverter" | "";
  // Spec table
  make: string; kva: string; phase: "1-Phase" | "3-Phase" | "";
  batteryMake: string; batteryAh: string; batteryCount: string;
  specPhoto: string | null;
  // Readings
  r_inputPN: string; r_inputRN: string; r_inputYN: string; r_inputBN: string;
  r_inputNE: string; r_outputPN: string; r_outputNEPhoto: string | null;
  r_current: string; r_currentR: string; r_currentY: string; r_currentB: string;
  r_frequency: string;
  // Distribution / SLD data
  changeoverSwitch: "Yes" | "No" | "";
  cosRating: string;
  inputMCBs: MCBEntry[];
  outputMCBs: MCBEntry[];
  cdbMCBs: MCBEntry[];
  securityDBMCBs: MCBEntry[];
  eldbMCBs: MCBEntry[];
  rccbA: string;
  rccbMA: string;
  mcbPhotos: (string | null)[];
}

const newUPS = (idx: number): UPSUnit => ({
  id: uid(), name: `UPS ${idx + 1}`,
  type: idx === 0 ? "Branch" : "",
  isInverter: "",
  make: "", kva: "", phase: "", batteryMake: "", batteryAh: "", batteryCount: "",
  specPhoto: null,
  r_inputPN: "", r_inputRN: "", r_inputYN: "", r_inputBN: "", r_inputNE: "",
  r_outputPN: "", r_outputNEPhoto: null,
  r_current: "", r_currentR: "", r_currentY: "", r_currentB: "", r_frequency: "",
  changeoverSwitch: "", cosRating: "",
  inputMCBs:      [newMCB()],
  outputMCBs:     [newMCB()],
  cdbMCBs:        [newMCB()],
  securityDBMCBs: [newMCB()],
  eldbMCBs:       [newMCB()],
  rccbA: "", rccbMA: "",
  mcbPhotos: [null, null, null, null],
});

// ── MCB Photo Grid — 4 slots, each with its own ref (hooks-compliant) ────────
function MCBPhotoSlot({ idx, photo, violet, onSet }: {
  idx: number; photo: string | null; violet: string;
  onSet: (val: string | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      {photo ? (
        <div style={{ position:"relative", borderRadius:9, overflow:"hidden", border:"1.5px solid #ddd6fe" }}>
          <img src={photo} alt={`MCB ${idx+1}`} style={{ width:"100%", height:100, objectFit:"cover", display:"block" }}/>
          <button onClick={() => onSet(null)}
            style={{ position:"absolute", top:4, right:4, background:"rgba(0,0,0,0.6)", border:"none", borderRadius:5, padding:"2px 7px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>✕</button>
          <div style={{ position:"absolute", bottom:4, left:6, fontSize:10, fontWeight:800, color:"#fff", background:"rgba(0,0,0,0.5)", borderRadius:4, padding:"1px 6px" }}>Photo {idx+1}</div>
        </div>
      ) : (
        <button onClick={() => ref.current?.click()}
          style={{ width:"100%", height:100, borderRadius:9, border:"2px dashed #c4b5fd", background:"#faf9ff", color:"#9ca3af", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
          <i className="ri-camera-line" style={{ fontSize:20, color:violet }}/>
          <span>Photo {idx+1}</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" capture="environment" style={{ display:"none" }}
        onChange={e => {
          const f = e.target.files?.[0]; if (!f) return;
          const reader = new FileReader();
          reader.onload = ev => onSet(ev.target?.result as string);
          reader.readAsDataURL(f);
        }}/>
    </div>
  );
}
function MCBPhotoGrid({ photos, violet, onSet, onAdd }: {
  photos: (string | null)[]; violet: string;
  onSet: (idx: number, val: string | null) => void;
  onAdd?: () => void;
}) {
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        {photos.map((p, i) => (
          <MCBPhotoSlot key={i} idx={i} photo={p} violet={violet} onSet={val => onSet(i, val)}/>
        ))}
      </div>
      {onAdd && (
        <button onClick={onAdd}
          style={{ fontSize:11, fontWeight:700, color:violet, background:"#f5f3ff", border:`1.5px dashed ${violet}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <i className="ri-add-line"/>Add Photo {photos.length + 1}
        </button>
      )}
      {!onAdd && photos.length >= 4 && (
        <div style={{ fontSize:11, color:"#9ca3af", fontStyle:"italic", marginTop:4 }}>Maximum 4 photos reached</div>
      )}
    </div>
  );
}

// ── Single UPS card ───────────────────────────────────────────────────────────
function UPSCard({
  ups, idx, isFirst, onChange, onRemove,
}: {
  ups: UPSUnit; idx: number; isFirst: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (id: string, field: keyof UPSUnit, val: any) => void;
  onRemove: (id: string) => void;
}) {
  const violet = "#6d28d9"; const violetBg = "#f5f3ff"; const violetDark = "#4c1d95";
  const specRef = useRef<HTMLInputElement>(null);
  const nePhotoRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upd = (field: keyof UPSUnit, val: any) => onChange(ups.id, field, val);

  const readFile = (file: File, field: keyof UPSUnit) => {
    const reader = new FileReader();
    reader.onload = e => upd(field, e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const ROW_STYLE: React.CSSProperties = {
    display:"grid", gridTemplateColumns:"1.6fr 1.4fr 1.2fr",
    borderTop:"1px solid #f3f4f6",
  };
  const TH: React.CSSProperties = {
    padding:"9px 12px", fontSize:10, fontWeight:800, color:violet,
    textTransform:"uppercase", letterSpacing:"0.06em",
    background: violetBg, borderBottom:`2px solid #ddd6fe`,
  };
  const PARAM: React.CSSProperties = {
    padding:"10px 12px", fontSize:12, fontWeight:800, color:"#374151",
    background:"#faf9ff", display:"flex", alignItems:"center",
  };
  const TP: React.CSSProperties = {
    padding:"10px 12px", fontSize:12, color:"#6b7280", display:"flex", alignItems:"center",
  };

  const ReadingCell = ({ field, unit, autoVal }: { field: keyof UPSUnit; unit: string; autoVal?: string }) => {
    const isAuto = autoVal !== undefined;
    const val = isAuto ? autoVal : (ups[field] as string);
    return (
      <div style={{ padding:"6px 10px", display:"flex", alignItems:"center", gap:6 }}>
        {isAuto ? (
          <div style={{ flex:1, padding:"7px 10px", borderRadius:8, background:"#f0fdf4", border:"1.5px solid #bbf7d0", fontSize:13, fontWeight:700, color:"#16a34a" }}>
            {val || <span style={{ color:"#9ca3af", fontWeight:400 }}>auto</span>}
          </div>
        ) : (
          <input type="number" value={ups[field] as string}
            onChange={e => upd(field, e.target.value)}
            placeholder="—"
            style={{ flex:1, border:`1.5px solid ${ups[field] ? violet : "#e5e7eb"}`, borderRadius:8, padding:"7px 10px", fontSize:13, fontWeight:700, color:"#111827", outline:"none", background: ups[field] ? violetBg : "#fff", boxSizing:"border-box" }}/>
        )}
        <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af", flexShrink:0 }}>{unit}</span>
      </div>
    );
  };

  const PhotoPrompt = ({ field, label }: { field: keyof UPSUnit; label: string }) => {
    const ref = field === "specPhoto" ? specRef : nePhotoRef;
    const val = ups[field] as string | null;
    return (
      <div style={{ margin:"10px 12px" }}>
        {val ? (
          <div style={{ position:"relative", borderRadius:9, overflow:"hidden", border:"1.5px solid #ddd6fe" }}>
            <img src={val} alt={label} style={{ width:"100%", maxHeight:140, objectFit:"cover", display:"block" }}/>
            <button onClick={() => upd(field, null)}
              style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,0.6)", border:"none", borderRadius:6, padding:"3px 8px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              ✕
            </button>
          </div>
        ) : (
          <button onClick={() => ref.current?.click()}
            style={{ width:"100%", padding:"10px", borderRadius:9, border:"2px dashed #c4b5fd", background:"#faf9ff", color:violet, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <i className="ri-camera-line" style={{ fontSize:16 }}/>{label}
          </button>
        )}
        <input ref={ref} type="file" accept="image/*" capture="environment" style={{ display:"none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, field); }}/>
      </div>
    );
  };

  return (
    <div style={{ background:"#fff", borderRadius:14, border:`1.5px solid ${violetBg}`, overflow:"hidden", boxShadow:"0 2px 8px rgba(109,40,217,0.08)", marginBottom:16 }}>

      {/* UPS Card Header */}
      <div style={{ padding:"12px 16px", background:`linear-gradient(135deg,${violet},${violetDark})`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="ri-battery-charge-line" style={{ color:"#fff", fontSize:16 }}/>
          </div>
          <input
            value={ups.name}
            onChange={e => upd("name", e.target.value)}
            style={{ fontSize:15, fontWeight:900, color:"#fff", background:"transparent", border:"none", outline:"none", width:120 }}
          />
        </div>
        {!isFirst && (
          <button onClick={() => onRemove(ups.id)}
            style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:8, padding:"5px 12px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            <i className="ri-delete-bin-line"/>Remove
          </button>
        )}
      </div>

      <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:12 }}>

        {/* TYPE + IS IT UPS/INVERTER */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={LBL}>TYPE</label>
            {isFirst ? (
              <div style={{ ...INP, background:"#f3f4f6", color:"#6b7280", fontWeight:700 }}>Branch (Bank Only)</div>
            ) : (
              <select value={ups.type} onChange={e => upd("type", e.target.value)} style={INP}>
                <option value="">— Select —</option>
                <option>Branch</option>
                <option>ATM</option>
              </select>
            )}
            {isFirst && <p style={{ fontSize:10, color:"#9ca3af", margin:"4px 0 0", lineHeight:1.4 }}>1st UPS is Bank Only. ATM UPS can be added from UPS 2 onwards.</p>}
          </div>
          <div>
            <label style={LBL}>Is it UPS / Inverter?</label>
            <select value={ups.isInverter} onChange={e => upd("isInverter", e.target.value)} style={INP}>
              <option value="">— Select —</option>
              <option>UPS</option>
              <option>Inverter</option>
            </select>
          </div>
        </div>

        {/* Spec Table */}
        <div style={{ borderRadius:10, border:"1px solid #e5e7eb", overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr", background:violetBg, borderBottom:"2px solid #ddd6fe" }}>
            {["UPS/Inverter Make","Capacity (KVA)","1-Ph or 3-Ph","Battery Make","Battery (Ah)","No. of Batteries"].map(h => (
              <div key={h} style={{ padding:"8px 10px", fontSize:9, fontWeight:800, color:violet, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr" }}>
            {[
              { field:"make" as keyof UPSUnit, placeholder:"e.g. APC", type:"text" },
              { field:"kva"  as keyof UPSUnit, placeholder:"e.g. 10", type:"number" },
            ].map(({ field, placeholder, type }) => (
              <input key={field} type={type} value={ups[field] as string} onChange={e => upd(field, e.target.value)}
                placeholder={placeholder}
                style={{ margin:8, border:"1px solid #e5e7eb", borderRadius:7, padding:"7px 9px", fontSize:12, color:"#111827", outline:"none", background:"#fff", boxSizing:"border-box" }}/>
            ))}
            <select value={ups.phase} onChange={e => upd("phase", e.target.value)}
              style={{ margin:8, border:"1px solid #e5e7eb", borderRadius:7, padding:"7px 9px", fontSize:12, color:"#111827", outline:"none", background:"#fff", boxSizing:"border-box" }}>
              <option value="">—</option>
              <option>1-Phase</option>
              <option>3-Phase</option>
            </select>
            {[
              { field:"batteryMake"  as keyof UPSUnit, placeholder:"e.g. Exide", type:"text" },
              { field:"batteryAh"    as keyof UPSUnit, placeholder:"e.g. 42", type:"number" },
              { field:"batteryCount" as keyof UPSUnit, placeholder:"e.g. 8", type:"number" },
            ].map(({ field, placeholder, type }) => (
              <input key={field} type={type} value={ups[field] as string} onChange={e => upd(field, e.target.value)}
                placeholder={placeholder}
                style={{ margin:8, border:"1px solid #e5e7eb", borderRadius:7, padding:"7px 9px", fontSize:12, color:"#111827", outline:"none", background:"#fff", boxSizing:"border-box" }}/>
            ))}
          </div>
        </div>

        {/* UPS Photo */}
        <PhotoPrompt field="specPhoto" label="Capture UPS Photo" />

        {/* Reading table — conditional on phase */}
        {ups.phase && (
          <div style={{ borderRadius:10, border:"1px solid #e5e7eb", overflow:"hidden" }}>
            {/* Column headers */}
            <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1.4fr 1.2fr" }}>
              {["Parameters","Test Point","Actual Reading"].map(h => (
                <div key={h} style={TH}>{h}</div>
              ))}
            </div>

            {ups.phase === "1-Phase" && (<>
              {/* Input Voltage */}
              <div style={ROW_STYLE}><div style={PARAM}>INPUT VOLTAGE (V)</div><div style={TP}>P-N</div><ReadingCell field="r_inputPN" unit="V"/></div>
              <div style={ROW_STYLE}><div style={{ ...PARAM, background:"#fff" }}></div><div style={TP}>Input N-E Earthing</div><ReadingCell field="r_inputNE" unit="V"/></div>
              {/* Output Voltage */}
              <div style={{ ...ROW_STYLE, borderTop:"2px solid #f3f4f6" }}><div style={PARAM}>OUTPUT VOLTAGE (V)</div><div style={TP}>P-N</div><ReadingCell field="r_outputPN" unit="V"/></div>
              <div style={ROW_STYLE}>
                <div style={{ ...PARAM, background:"#fff" }}></div>
                <div style={{ ...TP, flexDirection:"column", alignItems:"flex-start", gap:4 }}>
                  <span>Output N-E Earthing</span>
                  <span style={{ fontSize:9, color:"#9ca3af" }}>auto from Input N-E</span>
                </div>
                <ReadingCell field="r_inputNE" unit="V" autoVal={ups.r_inputNE}/>
              </div>
              {/* N-E photo */}
              <div style={{ ...ROW_STYLE, display:"block" }}>
                <PhotoPrompt field="r_outputNEPhoto" label="Capture Output N-E Earthing Photo" />
              </div>
              {/* Current & Frequency */}
              <div style={{ ...ROW_STYLE, borderTop:"2px solid #f3f4f6" }}><div style={PARAM}>CURRENT READING (A)</div><div style={TP}></div><ReadingCell field="r_current" unit="A"/></div>
              <div style={{ ...ROW_STYLE, borderTop:"1px solid #f3f4f6" }}><div style={PARAM}>Frequency (Hz)</div><div style={TP}></div><ReadingCell field="r_frequency" unit="Hz"/></div>
            </>)}

            {ups.phase === "3-Phase" && (<>
              {/* Input Voltage */}
              <div style={ROW_STYLE}><div style={PARAM}>INPUT VOLTAGE (V)</div><div style={TP}>R-N</div><ReadingCell field="r_inputRN" unit="V"/></div>
              <div style={ROW_STYLE}><div style={{ ...PARAM, background:"#fff" }}></div><div style={TP}>Y-N</div><ReadingCell field="r_inputYN" unit="V"/></div>
              <div style={ROW_STYLE}><div style={{ ...PARAM, background:"#fff" }}></div><div style={TP}>B-N</div><ReadingCell field="r_inputBN" unit="V"/></div>
              <div style={ROW_STYLE}><div style={{ ...PARAM, background:"#fff" }}></div><div style={TP}>Input N-E Earthing</div><ReadingCell field="r_inputNE" unit="V"/></div>
              {/* Output Voltage */}
              <div style={{ ...ROW_STYLE, borderTop:"2px solid #f3f4f6" }}><div style={PARAM}>OUTPUT VOLTAGE (V)</div><div style={TP}>P-N</div><ReadingCell field="r_outputPN" unit="V"/></div>
              <div style={ROW_STYLE}>
                <div style={{ ...PARAM, background:"#fff" }}></div>
                <div style={{ ...TP, flexDirection:"column", alignItems:"flex-start", gap:4 }}>
                  <span>Output N-E Earthing</span>
                  <span style={{ fontSize:9, color:"#9ca3af" }}>auto from Input N-E</span>
                </div>
                <ReadingCell field="r_inputNE" unit="V" autoVal={ups.r_inputNE}/>
              </div>
              {/* N-E photo */}
              <div style={{ ...ROW_STYLE, display:"block" }}>
                <PhotoPrompt field="r_outputNEPhoto" label="Capture Output N-E Earthing Photo" />
              </div>
              {/* Current */}
              <div style={{ ...ROW_STYLE, borderTop:"2px solid #f3f4f6" }}><div style={PARAM}>CURRENT READING (A)</div><div style={TP}>R Phase</div><ReadingCell field="r_currentR" unit="A"/></div>
              <div style={ROW_STYLE}><div style={{ ...PARAM, background:"#fff" }}></div><div style={TP}>Y Phase</div><ReadingCell field="r_currentY" unit="A"/></div>
              <div style={ROW_STYLE}><div style={{ ...PARAM, background:"#fff" }}></div><div style={TP}>B Phase</div><ReadingCell field="r_currentB" unit="A"/></div>
              {/* Frequency */}
              <div style={{ ...ROW_STYLE, borderTop:"2px solid #f3f4f6" }}><div style={PARAM}>Frequency (Hz)</div><div style={TP}>Output current freq</div><ReadingCell field="r_frequency" unit="Hz"/></div>
            </>)}
          </div>
        )}

        {!ups.phase && (
          <div style={{ padding:"16px", textAlign:"center", background:"#faf9ff", borderRadius:10, border:"1px dashed #ddd6fe", color:"#9ca3af", fontSize:13 }}>
            Select 1-Phase or 3-Phase in the spec table above to see reading fields
          </div>
        )}

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — UPS SLD Data  (standalone step, one card per UPS unit)
// ═══════════════════════════════════════════════════════════════════════════════
interface SLDUnit {
  id: string; name: string;
  changeoverSwitch: "Yes" | "No" | "";
  cosRating: string;
  inputMCBs: MCBEntry[]; outputMCBs: MCBEntry[];
  cdbMCBs: MCBEntry[]; securityDBMCBs: MCBEntry[]; eldbMCBs: MCBEntry[];
  rccbA: string; rccbMA: string;
  mcbPhotos: (string | null)[];
}

const newSLD = (idx: number): SLDUnit => ({
  id: uid(), name: `UPS ${idx + 1}`,
  changeoverSwitch: "", cosRating: "",
  inputMCBs: [newMCB()], outputMCBs: [newMCB()],
  cdbMCBs: [newMCB()], securityDBMCBs: [newMCB()], eldbMCBs: [newMCB()],
  rccbA: "", rccbMA: "",
  mcbPhotos: [null],
});

function SLDCard({ sld, onChange }: {
  sld: SLDUnit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (id: string, field: keyof SLDUnit, val: any) => void;
}) {
  const violet = "#4c1d95"; const violetLight = "#6d28d9";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upd = (field: keyof SLDUnit, val: any) => onChange(sld.id, field, val);

  const MCBRows = ({ label, sublabel, withPole, entries, fieldKey }: {
    label: string; sublabel: string; withPole: boolean;
    entries: MCBEntry[]; fieldKey: keyof SLDUnit;
  }) => {
    const addRow    = () => upd(fieldKey, [...entries, newMCB()]);
    const removeRow = (id: string) => upd(fieldKey, entries.filter(e => e.id !== id));
    const updRow    = (id: string, f: keyof MCBEntry, v: string) =>
      upd(fieldKey, entries.map(e => e.id !== id ? e : { ...e, [f]: v }));

    return (
      <div>
        <div style={{ marginBottom:8 }}>
          {label && <span style={{ fontSize:12, fontWeight:900, color:violet, fontStyle:"italic" }}>{label} </span>}
          <span style={{ fontSize:13, fontWeight:800, color:"#1f2937" }}>{sublabel}</span>
        </div>
        {entries.map(entry => (
          <div key={entry.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, flex:1, flexWrap:"wrap" }}>
              <input type="number" value={entry.amp} onChange={e => updRow(entry.id,"amp",e.target.value)}
                placeholder="Amp" style={{ width:72, border:"1.5px solid #e5e7eb", borderRadius:8, padding:"8px 9px", fontSize:13, fontWeight:700, color:"#111827", outline:"none", background:"#fff" }}/>
              <span style={{ fontSize:12, color:"#6b7280", fontWeight:700 }}>A</span>
              {withPole && <>
                <input type="number" value={entry.pole} onChange={e => updRow(entry.id,"pole",e.target.value)}
                  placeholder="Pole" style={{ width:56, border:"1.5px solid #e5e7eb", borderRadius:8, padding:"8px 9px", fontSize:13, fontWeight:700, color:"#111827", outline:"none", background:"#fff" }}/>
                <span style={{ fontSize:12, color:"#6b7280", fontWeight:700 }}>pole ×</span>
              </>}
              {!withPole && <span style={{ fontSize:12, color:"#6b7280", fontWeight:700 }}>×</span>}
              <input type="number" value={entry.nos} onChange={e => updRow(entry.id,"nos",e.target.value)}
                placeholder="Nos." style={{ width:56, border:"1.5px solid #e5e7eb", borderRadius:8, padding:"8px 9px", fontSize:13, fontWeight:700, color:"#111827", outline:"none", background:"#fff" }}/>
              <span style={{ fontSize:12, color:"#6b7280", fontWeight:700 }}>nos.</span>
            </div>
            {entries.length > 1 && (
              <button onClick={() => removeRow(entry.id)}
                style={{ border:"none", background:"transparent", color:"#ef4444", cursor:"pointer", fontSize:18, padding:"2px", lineHeight:1, flexShrink:0 }}>
                <i className="ri-close-circle-line"/>
              </button>
            )}
          </div>
        ))}
        <button onClick={addRow}
          style={{ fontSize:11, fontWeight:700, color:violetLight, background:"#f5f3ff", border:`1.5px dashed ${violetLight}`, borderRadius:8, padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <i className="ri-add-line"/>Add more
        </button>
      </div>
    );
  };

  const Divider = ({ label }: { label: string }) => (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ flex:1, height:1, background:"#ede9fe" }}/>
      <span style={{ fontSize:10, fontWeight:800, color:violetLight, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</span>
      <div style={{ flex:1, height:1, background:"#ede9fe" }}/>
    </div>
  );

  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1.5px solid #ddd6fe", overflow:"hidden", boxShadow:"0 2px 10px rgba(76,29,149,0.1)", marginBottom:16 }}>
      {/* Card header */}
      <div style={{ padding:"13px 18px", background:"linear-gradient(135deg,#4c1d95,#3b0764)", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <i className="ri-flow-chart" style={{ color:"#c4b5fd", fontSize:17 }}/>
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:900, color:"#fff" }}>{sld.name} — SLD Distribution Data</div>
          <div style={{ fontSize:11, color:"#c4b5fd", marginTop:2 }}>MCBs, MCCB, RCCB &amp; Distribution Boards</div>
        </div>
      </div>

      <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:14 }}>

        {/* Changeover + COS */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={LBL}>Changeover / Switch</label>
            <select value={sld.changeoverSwitch} onChange={e => upd("changeoverSwitch", e.target.value)} style={INP}>
              <option value="">— Select —</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div>
            <label style={LBL}>COS Rating</label>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input type="number" value={sld.cosRating} onChange={e => upd("cosRating", e.target.value)} placeholder="e.g. 63" style={{ ...INP, flex:1 }}/>
              <span style={{ fontSize:13, fontWeight:800, color:"#374151" }}>AMP</span>
            </div>
          </div>
        </div>

        <Divider label="Input"/>
        <MCBRows label="INPUT:" sublabel="UPS MAIN input MCB/MCCB" withPole entries={sld.inputMCBs} fieldKey="inputMCBs"/>

        <Divider label="Output"/>
        <MCBRows label="OUTPUT:" sublabel="UPS MAIN output MCB/MCCB" withPole entries={sld.outputMCBs} fieldKey="outputMCBs"/>

        {/* DB group */}
        <div style={{ background:"#faf9ff", borderRadius:12, padding:"14px", display:"flex", flexDirection:"column", gap:14, border:"1px solid #ede9fe" }}>
          <MCBRows label="" sublabel="CDB:" withPole={false} entries={sld.cdbMCBs} fieldKey="cdbMCBs"/>
          <div style={{ height:1, background:"#ede9fe" }}/>
          <MCBRows label="" sublabel="SECURITY DB:" withPole={false} entries={sld.securityDBMCBs} fieldKey="securityDBMCBs"/>
          <div style={{ height:1, background:"#ede9fe" }}/>
          <MCBRows label="" sublabel="ELDB:" withPole={false} entries={sld.eldbMCBs} fieldKey="eldbMCBs"/>
        </div>

        {/* RCCB Rating */}
        <div style={{ background:"#f5f3ff", borderRadius:12, padding:"14px 16px", border:"1.5px solid #ddd6fe" }}>
          <label style={{ ...LBL, color:violet, marginBottom:10 }}>UPS MAIN INPUT / OUTPUT RCCB RATING</label>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <input type="number" value={sld.rccbA} onChange={e => upd("rccbA", e.target.value)}
              placeholder="—" style={{ width:90, border:"2px solid #7c3aed", borderRadius:9, padding:"10px", fontSize:15, fontWeight:900, color:"#111827", outline:"none", textAlign:"center", background:"#fff" }}/>
            <span style={{ fontSize:13, fontWeight:900, color:violet }}>Amp</span>
            <div style={{ width:1, height:28, background:"#ddd6fe" }}/>
            <input type="number" value={sld.rccbMA} onChange={e => upd("rccbMA", e.target.value)}
              placeholder="—" style={{ width:90, border:"2px solid #7c3aed", borderRadius:9, padding:"10px", fontSize:15, fontWeight:900, color:"#111827", outline:"none", textAlign:"center", background:"#fff" }}/>
            <span style={{ fontSize:13, fontWeight:900, color:violet }}>mA</span>
          </div>
        </div>

        {/* MCB Photos */}
        <div>
          <label style={{ ...LBL, display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
            <i className="ri-camera-fill" style={{ color:violetLight, fontSize:14 }}/>Photos of MCBs
          </label>
          <MCBPhotoGrid photos={sld.mcbPhotos} violet={violetLight}
            onSet={(pi, val) => { const u = [...sld.mcbPhotos]; u[pi] = val; upd("mcbPhotos", u); }}
            onAdd={sld.mcbPhotos.length < 4 ? () => upd("mcbPhotos", [...sld.mcbPhotos, null]) : undefined}/>
        </div>
      </div>
    </div>
  );
}

function UPSSLDSection({ branchName }: { branchName: string }) {
  const [units, setUnits] = useState<SLDUnit[]>([newSLD(0)]);
  const [saved, setSaved] = useState(false);
  const violet = "#4c1d95"; const violetLight = "#6d28d9";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (id: string, field: keyof SLDUnit, val: any) =>
    setUnits(us => us.map(u => u.id !== id ? u : { ...u, [field]: val }));
  const addUnit    = () => setUnits(us => [...us, newSLD(us.length)]);
  const removeUnit = (id: string) => setUnits(us => us.filter(u => u.id !== id));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div>
      {saved && (
        <div style={{ marginBottom:14, background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <i className="ri-checkbox-circle-fill" style={{ color:violetLight, fontSize:18 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:violet }}>UPS SLD data saved successfully</span>
        </div>
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#4c1d95,#3b0764)", borderRadius:14, padding:"16px 18px", marginBottom:16, boxShadow:"0 4px 12px rgba(76,29,149,0.3)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ri-flow-chart" style={{ color:"#fff", fontSize:20 }}/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>{branchName}</div>
              <div style={{ fontSize:11, color:"#c4b5fd", marginTop:2 }}>UPS Distribution Data for SLD — {units.length} UPS unit{units.length > 1 ? "s" : ""}</div>
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700, color:"#fff" }}>Step 4</div>
        </div>
      </div>

      {units.map((u, idx) => (
        <div key={u.id} style={{ position:"relative" }}>
          {units.length > 1 && (
            <button onClick={() => removeUnit(u.id)}
              style={{ position:"absolute", top:14, right:14, zIndex:10, background:"rgba(239,68,68,0.1)", border:"1px solid #fecaca", borderRadius:8, padding:"4px 10px", color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
              <i className="ri-delete-bin-line"/>Remove
            </button>
          )}
          <SLDCard sld={u} onChange={onChange}/>
        </div>
      ))}

      {/* Add UPS SLD */}
      <button onClick={addUnit}
        style={{ width:"100%", padding:"14px", borderRadius:12, border:`2px dashed ${violetLight}`, background:"#faf9ff", color:violetLight, fontSize:13, fontWeight:800, cursor:"pointer", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        <i className="ri-add-circle-line" style={{ fontSize:18 }}/>+ Add UPS {units.length + 1} SLD Data
      </button>

      {/* Save */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
        <button onClick={save}
          style={{ padding:"13px 32px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#4c1d95,#3b0764)", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 14px rgba(76,29,149,0.35)" }}>
          <i className="ri-save-line"/>Save SLD Data
        </button>
      </div>

      {/* ── DB Schema Panel ─────────────────────────────────────────────────── */}
      {(() => {
        const [schemaOpen, setSchemaOpen] = useState(false);
        const schema = `-- ═══════════════════════════════════════════════════════════════════════
-- UPS SLD DATA — PostgreSQL Schema
-- Step 4 of the Audit Form
-- ═══════════════════════════════════════════════════════════════════════

-- ENUM: MCB group types
CREATE TYPE sld_mcb_group AS ENUM (
  'input',        -- UPS MAIN input MCB/MCCB
  'output',       -- UPS MAIN output MCB/MCCB
  'cdb',          -- CDB distribution MCBs
  'security_db',  -- Security DB MCBs
  'eldb'          -- ELDB MCBs
);

-- ─────────────────────────────────────────────────────────────────────
-- TABLE: ups_sld_entries
-- One row per UPS unit per audit session.
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE ups_sld_entries (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id            UUID          NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  branch_unique_id    VARCHAR(64)   NOT NULL,          -- denormalized for fast lookup & offline sync
  ups_unit_index      SMALLINT      NOT NULL DEFAULT 0, -- 0-based: UPS 1, UPS 2 …
  ups_unit_name       VARCHAR(64)   NOT NULL DEFAULT 'UPS 1',
  changeover_switch   BOOLEAN,                         -- NULL = not answered
  cos_rating_amp      NUMERIC(8,2),                    -- COS Rating in Amps
  rccb_amp            NUMERIC(8,2),                    -- RCCB current rating (Amp)
  rccb_ma             NUMERIC(8,2),                    -- RCCB sensitivity (mA)
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
  deleted_at          TIMESTAMPTZ,                     -- soft delete

  CONSTRAINT uq_sld_audit_ups UNIQUE (audit_id, ups_unit_index)
);

CREATE INDEX idx_sld_entries_audit       ON ups_sld_entries(audit_id);
CREATE INDEX idx_sld_entries_branch      ON ups_sld_entries(branch_unique_id);
CREATE INDEX idx_sld_entries_deleted_at  ON ups_sld_entries(deleted_at) WHERE deleted_at IS NULL;

-- Auto-update updated_at
CREATE TRIGGER trg_sld_entries_updated_at
  BEFORE UPDATE ON ups_sld_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- TABLE: ups_sld_mcb_rows
-- Each MCB/MCCB entry per group (input, output, CDB, Security DB, ELDB)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE ups_sld_mcb_rows (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  sld_entry_id    UUID          NOT NULL REFERENCES ups_sld_entries(id) ON DELETE CASCADE,
  group_type      sld_mcb_group NOT NULL,
  amp             NUMERIC(8,2),            -- MCB current rating in Amps
  pole            SMALLINT,                -- pole count (1P, 2P, 3P, 4P) — only for input/output
  nos             SMALLINT,                -- number of MCBs of this rating
  sort_order      SMALLINT      NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_sld_mcb_entry   ON ups_sld_mcb_rows(sld_entry_id);
CREATE INDEX idx_sld_mcb_group   ON ups_sld_mcb_rows(sld_entry_id, group_type);

-- ─────────────────────────────────────────────────────────────────────
-- TABLE: ups_sld_photos
-- MCB panel photos (max 4 per SLD unit)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE ups_sld_photos (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sld_entry_id    UUID        NOT NULL REFERENCES ups_sld_entries(id) ON DELETE CASCADE,
  object_key      TEXT        NOT NULL,  -- S3/MinIO key: audits/{audit_id}/sld/{sld_entry_id}/mcb_{sort_order}.jpg
  sort_order      SMALLINT    NOT NULL DEFAULT 0,
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_sld_photo_slot UNIQUE (sld_entry_id, sort_order),  -- enforce max-4 at app layer
  CONSTRAINT chk_sld_photo_max CHECK (sort_order BETWEEN 0 AND 3)  -- 0..3 = max 4 photos
);

CREATE INDEX idx_sld_photos_entry ON ups_sld_photos(sld_entry_id);


-- ═══════════════════════════════════════════════════════════════════════
-- PRISMA SCHEMA  (schema.prisma)
-- ═══════════════════════════════════════════════════════════════════════

enum SldMcbGroup {
  input
  output
  cdb
  security_db
  eldb
}

model UpsSldEntry {
  id               String         @id @default(uuid())
  auditId          String         @map("audit_id")
  branchUniqueId   String         @map("branch_unique_id") @db.VarChar(64)
  upsUnitIndex     Int            @map("ups_unit_index") @db.SmallInt
  upsUnitName      String         @map("ups_unit_name") @db.VarChar(64)
  changeoverSwitch Boolean?       @map("changeover_switch")
  cosRatingAmp     Decimal?       @map("cos_rating_amp") @db.Decimal(8, 2)
  rccbAmp          Decimal?       @map("rccb_amp")       @db.Decimal(8, 2)
  rccbMa           Decimal?       @map("rccb_ma")        @db.Decimal(8, 2)
  createdAt        DateTime       @default(now())         @map("created_at")
  updatedAt        DateTime       @updatedAt              @map("updated_at")
  deletedAt        DateTime?                              @map("deleted_at")

  audit            Audit          @relation(fields: [auditId], references: [id], onDelete: Cascade)
  mcbRows          UpsSldMcbRow[]
  photos           UpsSldPhoto[]

  @@unique([auditId, upsUnitIndex])
  @@index([branchUniqueId])
  @@map("ups_sld_entries")
}

model UpsSldMcbRow {
  id           String        @id @default(uuid())
  sldEntryId   String        @map("sld_entry_id")
  groupType    SldMcbGroup   @map("group_type")
  amp          Decimal?      @db.Decimal(8, 2)
  pole         Int?          @db.SmallInt
  nos          Int?          @db.SmallInt
  sortOrder    Int           @default(0) @map("sort_order") @db.SmallInt
  createdAt    DateTime      @default(now()) @map("created_at")

  sldEntry     UpsSldEntry   @relation(fields: [sldEntryId], references: [id], onDelete: Cascade)

  @@index([sldEntryId, groupType])
  @@map("ups_sld_mcb_rows")
}

model UpsSldPhoto {
  id           String      @id @default(uuid())
  sldEntryId   String      @map("sld_entry_id")
  objectKey    String      @map("object_key")
  sortOrder    Int         @default(0) @map("sort_order") @db.SmallInt
  uploadedAt   DateTime    @default(now()) @map("uploaded_at")

  sldEntry     UpsSldEntry @relation(fields: [sldEntryId], references: [id], onDelete: Cascade)

  @@unique([sldEntryId, sortOrder])
  @@map("ups_sld_photos")
}


-- ─────────────────────────────────────────────────────────────────────
-- S3 / MinIO Object Key Pattern
-- ─────────────────────────────────────────────────────────────────────
-- audits/{audit_id}/sld/{sld_entry_id}/mcb_0.jpg   ← Photo 1
-- audits/{audit_id}/sld/{sld_entry_id}/mcb_1.jpg   ← Photo 2
-- audits/{audit_id}/sld/{sld_entry_id}/mcb_2.jpg   ← Photo 3
-- audits/{audit_id}/sld/{sld_entry_id}/mcb_3.jpg   ← Photo 4 (max)

-- ─────────────────────────────────────────────────────────────────────
-- BUSINESS RULES
-- ─────────────────────────────────────────────────────────────────────
-- 1. max 4 photos per SLD unit (enforced by CHECK constraint + app layer)
-- 2. pole column is only populated for group_type IN ('input','output')
-- 3. soft delete on ups_sld_entries cascades logically — MCB rows and
--    photos are hard-deleted via ON DELETE CASCADE (photos also purged from S3)
-- 4. branch_unique_id is denormalized to support offline-first sync without
--    joining to the branches table on the mobile device
-- 5. @@unique([auditId, upsUnitIndex]) prevents duplicate UPS slots per audit`;

        return (
          <div style={{ borderRadius:14, overflow:"hidden", border:"1.5px solid #312e81" }}>
            <button onClick={() => setSchemaOpen(o => !o)}
              style={{ width:"100%", padding:"14px 18px", background:"linear-gradient(135deg,#1e1b4b,#312e81)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <i className="ri-database-2-line" style={{ color:"#a5b4fc", fontSize:18 }}/>
                <span style={{ fontSize:13, fontWeight:800, color:"#e0e7ff", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                  DB Schema — UPS SLD Step 4
                </span>
                <span style={{ fontSize:10, background:"rgba(165,180,252,0.2)", color:"#a5b4fc", borderRadius:99, padding:"2px 8px", fontWeight:700 }}>
                  PostgreSQL + Prisma
                </span>
              </div>
              <i className={`ri-arrow-${schemaOpen?"up":"down"}-s-line`} style={{ color:"#a5b4fc", fontSize:18 }}/>
            </button>
            {schemaOpen && (
              <div style={{ background:"#0f0e17", padding:"20px 18px", overflowX:"auto" }}>
                <pre style={{ margin:0, fontSize:11.5, lineHeight:1.7, color:"#e0e7ff", fontFamily:"'Fira Code','Cascadia Code','Consolas',monospace", whiteSpace:"pre" }}>
                  {schema}
                </pre>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

function UPSParametersSection({ branchName }: { branchName: string }) {
  const [units, setUnits]       = useState<UPSUnit[]>([newUPS(0)]);
  const [saved, setSaved]       = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);

  const violet = "#6d28d9"; const violetDark = "#4c1d95";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (id: string, field: keyof UPSUnit, val: any) =>
    setUnits(us => us.map(u => u.id !== id ? u : { ...u, [field]: val }));

  const addUPS   = () => setUnits(us => [...us, newUPS(us.length)]);
  const removeUPS = (id: string) => setUnits(us => us.filter(u => u.id !== id));

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div>
      {saved && (
        <div style={{ marginBottom:14, background:"#f5f3ff", border:"1px solid #c4b5fd", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <i className="ri-checkbox-circle-fill" style={{ color:violet, fontSize:18 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:violetDark }}>UPS Parameters saved successfully</span>
        </div>
      )}

      {/* Section header */}
      <div style={{ padding:"14px 18px", background:`linear-gradient(135deg,${violet},${violetDark})`, borderRadius:14, marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 12px rgba(109,40,217,0.3)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="ri-battery-charge-line" style={{ color:"#fff", fontSize:20 }}/>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>{branchName}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:2 }}>UPS Room — {units.length} UPS unit{units.length > 1 ? "s" : ""}</div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700, color:"#fff" }}>
          Step 3
        </div>
      </div>

      {units.map((u, idx) => (
        <UPSCard key={u.id} ups={u} idx={idx} isFirst={idx === 0} onChange={onChange} onRemove={removeUPS}/>
      ))}

      {/* Add UPS */}
      <button onClick={addUPS}
        style={{ width:"100%", padding:"14px", borderRadius:12, border:`2px dashed ${violet}`, background:"#faf9ff", color:violet, fontSize:13, fontWeight:800, cursor:"pointer", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        <i className="ri-add-circle-line" style={{ fontSize:18 }}/>+ Add New UPS
      </button>

      {/* Save */}
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button onClick={save}
          style={{ padding:"13px 32px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${violet},${violetDark})`, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 14px rgba(109,40,217,0.35)" }}>
          <i className="ri-save-line"/>Save UPS Parameters
        </button>
      </div>

      {/* ── DB Schema Reference ─────────────────────────────────────────────── */}
      <div style={{ marginTop:24, borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden" }}>
        {/* Toggle header */}
        <button
          onClick={() => setSchemaOpen(o => !o)}
          style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background:"#1e1b4b", border:"none", cursor:"pointer", outline:"none" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"rgba(167,139,250,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ri-database-2-line" style={{ color:"#a78bfa", fontSize:16 }}/>
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>Developer Reference — DB Schema</div>
              <div style={{ fontSize:11, color:"#a78bfa", marginTop:2 }}>PostgreSQL + Prisma — UPS Parameters (Step 3)</div>
            </div>
          </div>
          <i className={`ri-arrow-${schemaOpen ? "up" : "down"}-s-line`} style={{ color:"#a78bfa", fontSize:20 }}/>
        </button>

        {schemaOpen && (
          <div style={{ background:"#0f172a", padding:"20px 22px", overflowX:"auto" }}>

            {/* Branch Unique ID callout */}
            <div style={{ background:"rgba(167,139,250,0.12)", border:"1px solid rgba(167,139,250,0.3)", borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Primary Reference Key</div>
              <code style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>branch_unique_id  UUID  FK → branches(id)</code>
              <p style={{ fontSize:12, color:"#94a3b8", margin:"6px 0 0", lineHeight:1.6 }}>
                Denormalised into <code style={{ color:"#c4b5fd" }}>audit_ups_units</code> so any UPS record can be queried directly by branch without joining through <code style={{ color:"#c4b5fd" }}>audit_sessions</code>.
              </p>
            </div>

            {/* ERD */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Entity Relationship</div>
              <pre style={{ fontSize:12, color:"#94a3b8", margin:0, lineHeight:1.8, fontFamily:"monospace" }}>{`branches
  └── audit_sessions       [1 branch : many sessions]
        └── audit_ups_units  [1 session : many UPS units]`}</pre>
            </div>

            {/* Enums */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Enums</div>
              <pre style={{ fontSize:12, color:"#e2e8f0", margin:0, lineHeight:1.9, fontFamily:"monospace", background:"#1e293b", padding:14, borderRadius:9, overflowX:"auto" }}>{`CREATE TYPE ups_type_enum    AS ENUM ('Branch', 'ATM');
CREATE TYPE ups_device_enum  AS ENUM ('UPS', 'Inverter');
CREATE TYPE ups_phase_enum   AS ENUM ('1-Phase', '3-Phase');
CREATE TYPE audit_status_enum AS ENUM (
  'DRAFT','IN_PROGRESS','COMPLETED','SUBMITTED','APPROVED','REJECTED'
);`}</pre>
            </div>

            {/* audit_sessions */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Table: audit_sessions</div>
              <pre style={{ fontSize:12, color:"#e2e8f0", margin:0, lineHeight:1.9, fontFamily:"monospace", background:"#1e293b", padding:14, borderRadius:9, overflowX:"auto" }}>{`CREATE TABLE audit_sessions (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_unique_id UUID          NOT NULL REFERENCES branches(id),
  auditor_id       UUID          NOT NULL REFERENCES users(id),
  audit_date       DATE          NOT NULL,
  status           audit_status_enum NOT NULL DEFAULT 'DRAFT',
  audit_lat        DOUBLE PRECISION,
  audit_lng        DOUBLE PRECISION,
  submitted_at     TIMESTAMPTZ,
  approved_at      TIMESTAMPTZ,
  approved_by      UUID          REFERENCES users(id),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ
);

CREATE INDEX idx_audit_sessions_branch  ON audit_sessions(branch_unique_id);
CREATE INDEX idx_audit_sessions_auditor ON audit_sessions(auditor_id);
CREATE INDEX idx_audit_sessions_date    ON audit_sessions(audit_date);
CREATE INDEX idx_audit_sessions_status  ON audit_sessions(status);`}</pre>
            </div>

            {/* audit_ups_units */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Table: audit_ups_units</div>
              <pre style={{ fontSize:12, color:"#e2e8f0", margin:0, lineHeight:1.9, fontFamily:"monospace", background:"#1e293b", padding:14, borderRadius:9, overflowX:"auto" }}>{`CREATE TABLE audit_ups_units (
  id                    UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Reference keys
  audit_session_id      UUID    NOT NULL REFERENCES audit_sessions(id) ON DELETE CASCADE,
  branch_unique_id      UUID    NOT NULL REFERENCES branches(id),  -- denormalised

  -- Identity
  unit_index            SMALLINT NOT NULL DEFAULT 1,     -- 1-based display order
  unit_name             VARCHAR(50) NOT NULL DEFAULT 'UPS 1',

  -- Classification
  ups_type              ups_type_enum,    -- Branch | ATM
  device_type           ups_device_enum,  -- UPS | Inverter

  -- Spec table
  make                  VARCHAR(100),
  capacity_kva          NUMERIC(10,3),
  phase_type            ups_phase_enum,   -- drives reading layout
  battery_make          VARCHAR(100),
  battery_capacity_ah   NUMERIC(8,2),
  battery_count         SMALLINT,
  spec_photo_key        TEXT,             -- S3/MinIO object key

  -- Shared readings (1-Phase + 3-Phase)
  input_ne_earthing_v   NUMERIC(8,3),    -- V  ← auto-fills output
  output_voltage_pn_v   NUMERIC(8,3),    -- V
  output_ne_earthing_v  NUMERIC(8,3),    -- V  default = input_ne_earthing_v
  output_ne_photo_key   TEXT,
  frequency_hz          NUMERIC(6,2),    -- Hz

  -- 1-Phase only (NULL for 3-Phase)
  input_voltage_pn_v    NUMERIC(8,3),    -- V  Input P-N
  current_reading_a     NUMERIC(8,3),    -- A

  -- 3-Phase only (NULL for 1-Phase)
  input_voltage_rn_v    NUMERIC(8,3),    -- V
  input_voltage_yn_v    NUMERIC(8,3),    -- V
  input_voltage_bn_v    NUMERIC(8,3),    -- V
  current_r_phase_a     NUMERIC(8,3),    -- A
  current_y_phase_a     NUMERIC(8,3),    -- A
  current_b_phase_a     NUMERIC(8,3),    -- A

  -- Audit trail
  created_by            UUID REFERENCES users(id),
  updated_by            UUID REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ,

  CONSTRAINT unique_ups_per_session UNIQUE (audit_session_id, unit_index),
  CONSTRAINT ups_index_positive     CHECK  (unit_index >= 1),
  CONSTRAINT ups_kva_positive       CHECK  (capacity_kva IS NULL OR capacity_kva > 0),
  CONSTRAINT ups_batt_positive      CHECK  (battery_capacity_ah IS NULL OR battery_capacity_ah > 0),
  CONSTRAINT ups_batt_count_pos     CHECK  (battery_count IS NULL OR battery_count > 0)
);

CREATE INDEX idx_ups_session        ON audit_ups_units(audit_session_id);
CREATE INDEX idx_ups_branch         ON audit_ups_units(branch_unique_id);
CREATE INDEX idx_ups_branch_session ON audit_ups_units(branch_unique_id, audit_session_id);
CREATE INDEX idx_ups_phase          ON audit_ups_units(phase_type);
CREATE INDEX idx_ups_deleted        ON audit_ups_units(deleted_at) WHERE deleted_at IS NULL;`}</pre>
            </div>

            {/* Trigger */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Trigger — Auto-fill Output N-E Earthing</div>
              <pre style={{ fontSize:12, color:"#e2e8f0", margin:0, lineHeight:1.9, fontFamily:"monospace", background:"#1e293b", padding:14, borderRadius:9, overflowX:"auto" }}>{`CREATE OR REPLACE FUNCTION fn_ups_ne_earthing_default()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.output_ne_earthing_v IS NULL AND NEW.input_ne_earthing_v IS NOT NULL THEN
    NEW.output_ne_earthing_v := NEW.input_ne_earthing_v;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_ups_ne_earthing_default
  BEFORE INSERT OR UPDATE ON audit_ups_units
  FOR EACH ROW EXECUTE FUNCTION fn_ups_ne_earthing_default();`}</pre>
            </div>

            {/* Prisma model */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Prisma Schema (schema.prisma)</div>
              <pre style={{ fontSize:12, color:"#e2e8f0", margin:0, lineHeight:1.9, fontFamily:"monospace", background:"#1e293b", padding:14, borderRadius:9, overflowX:"auto" }}>{`model AuditUpsUnit {
  id                  String      @id @default(uuid())
  auditSessionId      String      @map("audit_session_id")
  branchUniqueId      String      @map("branch_unique_id")
  unitIndex           Int         @map("unit_index")          @db.SmallInt
  unitName            String      @map("unit_name")           @db.VarChar(50)
  upsType             UpsType?    @map("ups_type")
  deviceType          UpsDevice?  @map("device_type")
  make                String?     @db.VarChar(100)
  capacityKva         Decimal?    @map("capacity_kva")        @db.Decimal(10,3)
  phaseType           UpsPhase?   @map("phase_type")
  batteryMake         String?     @map("battery_make")        @db.VarChar(100)
  batteryCapacityAh   Decimal?    @map("battery_capacity_ah") @db.Decimal(8,2)
  batteryCount        Int?        @map("battery_count")       @db.SmallInt
  specPhotoKey        String?     @map("spec_photo_key")
  inputNeEarthingV    Decimal?    @map("input_ne_earthing_v") @db.Decimal(8,3)
  outputVoltagePnV    Decimal?    @map("output_voltage_pn_v") @db.Decimal(8,3)
  outputNeEarthingV   Decimal?    @map("output_ne_earthing_v")@db.Decimal(8,3)
  outputNePhotoKey    String?     @map("output_ne_photo_key")
  frequencyHz         Decimal?    @map("frequency_hz")        @db.Decimal(6,2)
  inputVoltagePnV     Decimal?    @map("input_voltage_pn_v")  @db.Decimal(8,3)
  currentReadingA     Decimal?    @map("current_reading_a")   @db.Decimal(8,3)
  inputVoltageRnV     Decimal?    @map("input_voltage_rn_v")  @db.Decimal(8,3)
  inputVoltageYnV     Decimal?    @map("input_voltage_yn_v")  @db.Decimal(8,3)
  inputVoltageBnV     Decimal?    @map("input_voltage_bn_v")  @db.Decimal(8,3)
  currentRPhaseA      Decimal?    @map("current_r_phase_a")   @db.Decimal(8,3)
  currentYPhaseA      Decimal?    @map("current_y_phase_a")   @db.Decimal(8,3)
  currentBPhaseA      Decimal?    @map("current_b_phase_a")   @db.Decimal(8,3)
  createdBy           String?     @map("created_by")
  updatedBy           String?     @map("updated_by")
  createdAt           DateTime    @default(now()) @map("created_at")
  updatedAt           DateTime    @updatedAt      @map("updated_at")
  deletedAt           DateTime?   @map("deleted_at")
  auditSession        AuditSession @relation(fields:[auditSessionId], references:[id], onDelete:Cascade)
  branch              Branch       @relation(fields:[branchUniqueId], references:[id])
  @@unique([auditSessionId, unitIndex])
  @@index([branchUniqueId])
  @@index([branchUniqueId, auditSessionId])
  @@map("audit_ups_units")
}`}</pre>
            </div>

            {/* Field mapping table */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>UI → DB Field Mapping</div>
              <div style={{ background:"#1e293b", borderRadius:9, overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1.8fr 0.8fr 1fr", borderBottom:"2px solid #334155" }}>
                  {["UI Label","DB Column","Type","Notes"].map(h => (
                    <div key={h} style={{ padding:"8px 12px", fontSize:10, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</div>
                  ))}
                </div>
                {[
                  ["Branch Unique ID",       "branch_unique_id",       "UUID",         "FK → branches(id)"],
                  ["Audit Session ID",        "audit_session_id",       "UUID",         "FK → audit_sessions(id)"],
                  ["UPS Label",               "unit_name",              "VARCHAR(50)",  "Editable, e.g. 'UPS 1'"],
                  ["Order",                   "unit_index",             "SMALLINT",     "1-based"],
                  ["TYPE dropdown",           "ups_type",               "UpsType",      "Branch | ATM"],
                  ["UPS / Inverter?",         "device_type",            "UpsDevice",    "UPS | Inverter"],
                  ["Make",                    "make",                   "VARCHAR(100)", ""],
                  ["Capacity KVA",            "capacity_kva",           "DECIMAL(10,3)",""],
                  ["1-Ph / 3-Ph",             "phase_type",             "UpsPhase",     "Drives reading layout"],
                  ["Battery Make",            "battery_make",           "VARCHAR(100)", ""],
                  ["Battery Ah",              "battery_capacity_ah",    "DECIMAL(8,2)", ""],
                  ["No. of Batteries",        "battery_count",          "SMALLINT",     ""],
                  ["UPS Photo",               "spec_photo_key",         "TEXT",         "S3/MinIO key"],
                  ["Input Voltage P-N",       "input_voltage_pn_v",     "DECIMAL(8,3)", "1-Phase only · V"],
                  ["Input N-E Earthing",      "input_ne_earthing_v",    "DECIMAL(8,3)", "Both · V · auto-fills output"],
                  ["Output Voltage P-N",      "output_voltage_pn_v",    "DECIMAL(8,3)", "Both · V"],
                  ["Output N-E Earthing",     "output_ne_earthing_v",   "DECIMAL(8,3)", "Both · V · default=input NE"],
                  ["Output N-E Photo",        "output_ne_photo_key",    "TEXT",         "S3/MinIO key"],
                  ["Current Reading",         "current_reading_a",      "DECIMAL(8,3)", "1-Phase only · A"],
                  ["Frequency",               "frequency_hz",           "DECIMAL(6,2)", "Both · Hz"],
                  ["Input Voltage R-N",       "input_voltage_rn_v",     "DECIMAL(8,3)", "3-Phase only · V"],
                  ["Input Voltage Y-N",       "input_voltage_yn_v",     "DECIMAL(8,3)", "3-Phase only · V"],
                  ["Input Voltage B-N",       "input_voltage_bn_v",     "DECIMAL(8,3)", "3-Phase only · V"],
                  ["Current R Phase",         "current_r_phase_a",      "DECIMAL(8,3)", "3-Phase only · A"],
                  ["Current Y Phase",         "current_y_phase_a",      "DECIMAL(8,3)", "3-Phase only · A"],
                  ["Current B Phase",         "current_b_phase_a",      "DECIMAL(8,3)", "3-Phase only · A"],
                ].map(([label, col, type, note], i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"1.5fr 1.8fr 0.8fr 1fr", borderTop:"1px solid #1e293b", background: i%2===0 ? "#1e293b" : "#263145" }}>
                    <div style={{ padding:"7px 12px", fontSize:11, color:"#e2e8f0", fontWeight:600 }}>{label}</div>
                    <div style={{ padding:"7px 12px", fontFamily:"monospace", fontSize:11, color:"#c4b5fd" }}>{col}</div>
                    <div style={{ padding:"7px 12px", fontFamily:"monospace", fontSize:10, color:"#94a3b8" }}>{type}</div>
                    <div style={{ padding:"7px 12px", fontSize:11, color:"#64748b" }}>{note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample API payload */}
            <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Sample API Payload — POST /api/v1/audits/{"{session_id}"}/ups</div>
              <pre style={{ fontSize:12, color:"#e2e8f0", margin:0, lineHeight:1.9, fontFamily:"monospace", background:"#1e293b", padding:14, borderRadius:9, overflowX:"auto" }}>{`{
  "branchUniqueId":   "b1a2c3d4-e5f6-7890-abcd-ef1234567890",
  "auditSessionId":   "a9b8c7d6-e5f4-3210-fedc-ba0987654321",
  "units": [
    {
      "unitIndex":        1,
      "unitName":         "UPS 1",
      "upsType":          "Branch",
      "deviceType":       "UPS",
      "make":             "APC",
      "capacityKva":      10.0,
      "phaseType":        "3-Phase",
      "batteryMake":      "Exide",
      "batteryCapacityAh": 42,
      "batteryCount":     8,
      "specPhotoKey":     "audits/{session_id}/ups/1/spec.jpg",
      "inputVoltageRnV":  230.5,
      "inputVoltageYnV":  231.0,
      "inputVoltageBnV":  229.8,
      "inputNeEarthingV": 1.2,
      "outputVoltagePnV": 230.0,
      "outputNeEarthingV": 1.2,
      "outputNePhotoKey": "audits/{session_id}/ups/1/ne.jpg",
      "currentRPhaseA":   12.4,
      "currentYPhaseA":   11.9,
      "currentBPhaseA":   12.1,
      "frequencyHz":      50.0
    }
  ]
}`}</pre>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — Electrical Parameters (multi-panel)
// ═══════════════════════════════════════════════════════════════════════════════
interface ElecRow  { id: string; testPt: string; reading: string; normRange: string; remarks: string; }
interface ElecGroup { id: string; label: string; rows: ElecRow[]; }
interface ElecPanel { id: string; name: string; groups: ElecGroup[]; }

const makeElecGroups = (): ElecGroup[] => [
  { id: "voltage", label: "VOLTAGE READING", rows: [
    { id:"ry",  testPt:"R-Y",         reading:"", normRange:"380–420V", remarks:"" },
    { id:"yb",  testPt:"Y-B",         reading:"", normRange:"380–420V", remarks:"" },
    { id:"br",  testPt:"B-R",         reading:"", normRange:"380–420V", remarks:"" },
    { id:"rn",  testPt:"R-N",         reading:"", normRange:"210–240V", remarks:"" },
    { id:"yn",  testPt:"Y-N",         reading:"", normRange:"210–240V", remarks:"" },
    { id:"bn",  testPt:"B-N",         reading:"", normRange:"210–240V", remarks:"" },
  ]},
  { id: "current", label: "CURRENT READING", rows: [
    { id:"cr",  testPt:"R Phase",     reading:"", normRange:"—", remarks:"" },
    { id:"cy",  testPt:"Y Phase",     reading:"", normRange:"—", remarks:"" },
    { id:"cb",  testPt:"B Phase",     reading:"", normRange:"—", remarks:"" },
    { id:"ca",  testPt:"Avg Current", reading:"", normRange:"—", remarks:"" },
  ]},
  { id: "frequency", label: "FREQUENCY", rows: [
    { id:"hz",  testPt:"Hz",          reading:"", normRange:"49.5–50Hz", remarks:"" },
  ]},
  { id: "pf", label: "POWER FACTOR", rows: [
    { id:"pf",  testPt:"PF",          reading:"", normRange:"—", remarks:"" },
  ]},
  { id: "ne", label: "N-E VOLTAGE", rows: [
    { id:"ne",  testPt:"Earthing",    reading:"", normRange:"0–3V", remarks:"" },
  ]},
];

const makePanel = (idx: number): ElecPanel => ({
  id: `panel-${Date.now()}-${idx}`,
  name: "",
  groups: makeElecGroups(),
});

function ElecPanelCard({
  panel, panelIdx, totalPanels,
  onNameChange, onRowChange, onRemove,
}: {
  panel: ElecPanel; panelIdx: number; totalPanels: number;
  onNameChange: (id: string, name: string) => void;
  onRowChange: (panelId: string, gid: string, rid: string, field: "reading" | "remarks", val: string) => void;
  onRemove: (id: string) => void;
}) {
  const green = "#166534"; const greenBg = "#dcfce7"; const greenMid = "#16a34a";

  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", marginBottom:16 }}>

      {/* Panel header */}
      <div style={{ background:"#f0fdf4", borderBottom:"2px solid #bbf7d0", padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:13, fontWeight:900, color:green, background:greenBg, borderRadius:8, padding:"4px 12px", flexShrink:0, border:"1px solid #86efac" }}>
          Panel {panelIdx + 1}
        </span>
        <input
          value={panel.name}
          onChange={e => onNameChange(panel.id, e.target.value)}
          placeholder="Enter panel name"
          style={{ flex:1, border:"1.5px solid #d1fae5", borderRadius:9, padding:"8px 12px", fontSize:13, color:"#111827", outline:"none", background:"#fff", fontWeight:600 }}
        />
        {totalPanels > 1 && (
          <button
            onClick={() => onRemove(panel.id)}
            style={{ fontSize:12, fontWeight:700, color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:7, padding:"6px 12px", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:4 }}>
            <i className="ri-delete-bin-line"/>Remove
          </button>
        )}
      </div>

      {/* Column headers */}
      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1.1fr 1fr 1.1fr", background:"#f9fafb", borderBottom:"1px solid #e5e7eb" }}>
        {["Test Pt.", "Reading", "Norm. Range", "Remarks"].map(h => (
          <div key={h} style={{ padding:"8px 12px", fontSize:10, fontWeight:800, color:greenMid, letterSpacing:"0.06em", textTransform:"uppercase" }}>{h}</div>
        ))}
      </div>

      {/* Groups & rows */}
      {panel.groups.map((group, gi) => (
        <div key={group.id}>
          {/* Group label */}
          <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1.1fr 1fr 1.1fr", background:"#f0fdf4", borderTop: gi > 0 ? "2px solid #d1fae5" : "none" }}>
            <div style={{ padding:"8px 12px", gridColumn:"1 / -1", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:3, height:15, borderRadius:99, background:green, flexShrink:0 }}/>
              <span style={{ fontSize:11, fontWeight:900, color:green, letterSpacing:"0.05em" }}>{group.label}</span>
            </div>
          </div>

          {/* Data rows */}
          {group.rows.map(row => (
            <div
              key={row.id}
              style={{ display:"grid", gridTemplateColumns:"1.2fr 1.1fr 1fr 1.1fr", borderTop:"1px solid #f3f4f6" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#fafffe")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Test point */}
              <div style={{ padding:"10px 12px", fontSize:13, color:"#6b7280", display:"flex", alignItems:"center", fontWeight:500 }}>
                {row.testPt}
              </div>

              {/* Reading input */}
              <div style={{ padding:"6px 8px", display:"flex", alignItems:"center" }}>
                <input
                  type="text"
                  value={row.reading}
                  onChange={e => onRowChange(panel.id, group.id, row.id, "reading", e.target.value)}
                  placeholder="—"
                  style={{
                    width:"100%", border:`1.5px solid ${row.reading ? green : "#e5e7eb"}`,
                    borderRadius:7, padding:"6px 10px", fontSize:13, fontWeight:700,
                    color:"#111827", outline:"none",
                    background: row.reading ? "#f0fdf4" : "#fff",
                    boxSizing:"border-box", transition:"all 0.15s",
                  }}
                />
              </div>

              {/* Normal range */}
              <div style={{ padding:"10px 12px", fontSize:12, color: row.normRange === "—" ? "#d1d5db" : "#6b7280", display:"flex", alignItems:"center", fontFamily:"monospace" }}>
                {row.normRange}
              </div>

              {/* Remarks input */}
              <div style={{ padding:"6px 8px", display:"flex", alignItems:"center" }}>
                <input
                  type="text"
                  value={row.remarks}
                  onChange={e => onRowChange(panel.id, group.id, row.id, "remarks", e.target.value)}
                  placeholder="—"
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#6b7280", outline:"none", background:"#fff", boxSizing:"border-box" }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5 — UPS Questionnaire (14 Yes/No/NA questions with conditional photos)
// ═══════════════════════════════════════════════════════════════════════════════
type UPSQAnswer = "Yes" | "No" | "NA" | "";

interface UPSQItem {
  no: number;
  question: string;
  photoTrigger?: "Yes" | "No"; // show photo upload when this answer is selected
  answer: UPSQAnswer;
  photo: string | null;
  remarks: string;
}

const UPS_Q_INITIAL: Omit<UPSQItem, "answer" | "photo" | "remarks">[] = [
  { no:1,  question:"UPS kept in separate fire resistant wall enclosure?" },
  { no:2,  question:"Whether proper Metal Body exhaust fan for Ventilation of electrical room/UPS room is provided" },
  { no:3,  question:"2 Exhaust Fans/ACs run alternately via timer?", photoTrigger:"Yes" },
  { no:4,  question:"Rubber Mat placed?", photoTrigger:"Yes" },
  { no:5,  question:"Whether light and emergency light are provided for easy operation & maintenance works" },
  { no:6,  question:"Are Stationery / records / old obsolete items stored / kept in the system / UPS room", photoTrigger:"Yes" },
  { no:7,  question:"Whether UPS room maintained dry and in good condition and obsolete/hazardous/old items are not dumped there" },
  { no:8,  question:"Whether water seepage is observed near any of the Electrical Panel, Distribution Boards, Electrical equipment etc.", photoTrigger:"Yes" },
  { no:9,  question:"Whether Earthing DB is provided and connected to the equipment, Body of the connected equipment" },
  { no:10, question:"Is General Condition OK of electrical control panels, wiring cables dressing etc. is good and all DBs, Panels, Switch boards are properly covered", photoTrigger:"No" },
  { no:11, question:"Whether the contact numbers of AMC, persons, electricians, power distribution company, Generator service provider, Vendor UPS vendor, Ac's etc. are available with Accountant / Security guard and other staff and they are displayed in Electric Room / UPS room" },
  { no:12, question:"Server room have dual AC units having timer circuit device with independent circuit" },
  { no:13, question:"Battery Racks earthed?" },
  { no:14, question:"Are FIRE EXTINGUISHERS available in the following work area and clearly marked and accessible IN Systems/UPS Room: CO2(3kg/4.5kg)×2", photoTrigger:"Yes" },
];

const makeUPSQItems = (): UPSQItem[] =>
  UPS_Q_INITIAL.map(q => ({ ...q, answer: "", photo: null, remarks: "" }));

function UPSQuestionnaireSection({ branchName }: { branchName: string }) {
  const [items, setItems] = useState<UPSQItem[]>(makeUPSQItems());
  const [saved, setSaved] = useState(false);
  const teal = "#0e7490"; const tealLight = "#0891b2"; const tealBg = "#ecfeff";

  const upd = (no: number, field: keyof UPSQItem, val: string | null) =>
    setItems(prev => prev.map(i => i.no !== no ? i : { ...i, [field]: val }));

  const answered = items.filter(i => i.answer !== "").length;
  const pct = Math.round((answered / items.length) * 100);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const PhotoSlot = ({ item }: { item: UPSQItem }) => {
    const ref = useRef<HTMLInputElement>(null);
    return (
      <div style={{ marginTop:10 }}>
        <div style={{ fontSize:11, fontWeight:800, color:"#b45309", background:"#fef3c7", border:"1.5px solid #fcd34d", borderRadius:6, padding:"5px 10px", display:"inline-flex", alignItems:"center", gap:5, marginBottom:8 }}>
          <i className="ri-camera-fill" style={{ fontSize:13 }}/>
          Photo required — answer is &quot;{item.photoTrigger}&quot;
        </div>
        {item.photo ? (
          <div style={{ position:"relative", display:"inline-block" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.photo} alt="Q photo" style={{ width:120, height:80, objectFit:"cover", borderRadius:10, border:"2px solid #a5f3fc" }}/>
            <button onClick={() => upd(item.no, "photo", null)}
              style={{ position:"absolute", top:-6, right:-6, width:20, height:20, borderRadius:"50%", border:"none", background:"#ef4444", color:"#fff", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>
              <i className="ri-close-line"/>
            </button>
          </div>
        ) : (
          <button onClick={() => ref.current?.click()}
            style={{ width:120, height:80, borderRadius:10, border:`2px dashed ${tealLight}`, background:tealBg, color:teal, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
            <i className="ri-camera-line" style={{ fontSize:22 }}/>Capture
          </button>
        )}
        <input ref={ref} type="file" accept="image/*" capture="environment" style={{ display:"none" }}
          onChange={e => {
            const f = e.target.files?.[0]; if (!f) return;
            const reader = new FileReader();
            reader.onload = ev => upd(item.no, "photo", ev.target?.result as string);
            reader.readAsDataURL(f);
          }}/>
      </div>
    );
  };

  return (
    <div>
      {saved && (
        <div style={{ marginBottom:14, background:tealBg, border:"1px solid #a5f3fc", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <i className="ri-checkbox-circle-fill" style={{ color:teal, fontSize:18 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:teal }}>UPS Questionnaire saved successfully</span>
        </div>
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0e7490,#155e75)", borderRadius:14, padding:"16px 18px", marginBottom:14, boxShadow:"0 4px 12px rgba(14,116,144,0.3)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ri-questionnaire-line" style={{ color:"#fff", fontSize:20 }}/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>UPS Questionnaire</div>
              <div style={{ fontSize:11, color:"#a5f3fc", marginTop:2 }}>{branchName} — UPS Room Safety &amp; Compliance Checklist</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:20, fontWeight:900, color:"#fff" }}>{pct}%</div>
            <div style={{ fontSize:10, color:"#a5f3fc" }}>{answered}/{items.length} answered</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop:12, background:"rgba(255,255,255,0.2)", borderRadius:99, height:6 }}>
          <div style={{ width:`${pct}%`, height:6, borderRadius:99, background:"#a5f3fc", transition:"width 0.4s ease" }}/>
        </div>
      </div>

      {/* Question cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {items.map(item => {
          const showPhoto = item.photoTrigger && item.answer === item.photoTrigger;
          return (
            <div key={item.no} style={{
              background:"#fff", borderRadius:12,
              border:`1.5px solid ${item.answer !== "" ? "#a5f3fc" : "#e5e7eb"}`,
              padding:"14px 16px",
              boxShadow: item.answer !== "" ? "0 2px 8px rgba(14,116,144,0.08)" : "none",
            }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                {/* Number badge */}
                <div style={{ minWidth:28, height:28, borderRadius:8, background: item.answer !== "" ? teal : "#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:12, fontWeight:900, color: item.answer !== "" ? "#fff" : "#6b7280" }}>{item.no}</span>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:600, color:"#111827", lineHeight:1.5 }}>{item.question}</p>
                  {/* YES / NO / NA toggle */}
                  <div style={{ display:"flex", gap:8 }}>
                    {(["Yes","No","NA"] as UPSQAnswer[]).map(opt => (
                      <button key={opt} onClick={() => upd(item.no, "answer", item.answer === opt ? "" : opt)}
                        style={{
                          padding:"7px 18px", borderRadius:8, fontSize:12, fontWeight:800, cursor:"pointer", border:"2px solid",
                          borderColor: item.answer === opt ? (opt === "Yes" ? "#16a34a" : opt === "No" ? "#dc2626" : "#9ca3af") : "#e5e7eb",
                          background: item.answer === opt ? (opt === "Yes" ? "#dcfce7" : opt === "No" ? "#fee2e2" : "#f3f4f6") : "#fff",
                          color: item.answer === opt ? (opt === "Yes" ? "#15803d" : opt === "No" ? "#b91c1c" : "#374151") : "#9ca3af",
                        }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  {/* Conditional photo prompt */}
                  {showPhoto && <PhotoSlot item={item}/>}
                  {/* Remarks */}
                  <div style={{ marginTop:10 }}>
                    <input type="text" value={item.remarks} onChange={e => upd(item.no, "remarks", e.target.value)}
                      placeholder="Remarks (optional)"
                      style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#374151", outline:"none", background:"#f9fafb", boxSizing:"border-box" }}/>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16 }}>
        <button onClick={save}
          style={{ padding:"13px 32px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#0e7490,#155e75)", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 14px rgba(14,116,144,0.35)" }}>
          <i className="ri-save-line"/>Save Questionnaire
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
function ElectricalParametersSection({ branchName }: { branchName: string }) {
  const [panels, setPanels] = useState<ElecPanel[]>([makePanel(0)]);
  const [saved, setSaved]   = useState(false);

  const green = "#166534"; const greenMid = "#16a34a"; const greenBg = "#dcfce7";

  const addPanel    = () => setPanels(ps => [...ps, makePanel(ps.length)]);
  const removePanel = (id: string) => setPanels(ps => ps.filter(p => p.id !== id));

  const onNameChange = (pid: string, name: string) =>
    setPanels(ps => ps.map(p => p.id !== pid ? p : { ...p, name }));

  const onRowChange = (pid: string, gid: string, rid: string, field: "reading" | "remarks", val: string) =>
    setPanels(ps => ps.map(p => p.id !== pid ? p : {
      ...p,
      groups: p.groups.map(g => g.id !== gid ? g : {
        ...g,
        rows: g.rows.map(r => r.id !== rid ? r : { ...r, [field]: val }),
      }),
    }));

  const totalRows   = panels.reduce((s, p) => s + p.groups.reduce((gs, g) => gs + g.rows.length, 0), 0);
  const filledRows  = panels.reduce((s, p) => s + p.groups.reduce((gs, g) => gs + g.rows.filter(r => r.reading.trim()).length, 0), 0);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div>
      {saved && (
        <div style={{ marginBottom:14, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <i className="ri-checkbox-circle-fill" style={{ color:greenMid, fontSize:18 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:green }}>Electrical Parameters saved successfully</span>
        </div>
      )}

      {/* Page header card */}
      <div style={{ background:`linear-gradient(135deg,${green},#14532d)`, borderRadius:14, padding:"16px 18px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 12px rgba(22,101,52,0.3)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="ri-plug-line" style={{ color:"#fff", fontSize:20 }}/>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>{branchName}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>Recorded at site — voltage, current, PF &amp; earthing</div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.18)", borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700, color:"#fff" }}>
          {panels.length} Panel{panels.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background:"#fff", borderRadius:10, border:"1px solid #e5e7eb", padding:"12px 16px", marginBottom:16, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <span style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>Readings Entered</span>
          <span style={{ fontSize:13, fontWeight:800, color:greenMid }}>{filledRows} / {totalRows}</span>
        </div>
        <div style={{ height:5, background:"#f3f4f6", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${totalRows ? (filledRows/totalRows)*100 : 0}%`, background:`linear-gradient(90deg,${greenMid},#4ade80)`, borderRadius:99, transition:"width 0.3s ease" }}/>
        </div>
      </div>

      {/* Panel cards */}
      {panels.map((panel, idx) => (
        <ElecPanelCard
          key={panel.id}
          panel={panel}
          panelIdx={idx}
          totalPanels={panels.length}
          onNameChange={onNameChange}
          onRowChange={onRowChange}
          onRemove={removePanel}
        />
      ))}

      {/* Add Panel */}
      <button
        onClick={addPanel}
        style={{ width:"100%", padding:"14px", borderRadius:12, border:`2px dashed ${greenMid}`, background:"transparent", color:greenMid, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.15s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
      >
        <i className="ri-add-line" style={{ fontSize:16 }}/>+ Add Panel
      </button>

      {/* Save button */}
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button
          onClick={save}
          style={{ padding:"13px 32px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${green},#14532d)`, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 14px rgba(22,101,52,0.35)" }}>
          <i className="ri-save-line"/>Save Electrical Parameters
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 6 — Questionnaire  (sourced from Question Library — Active questions only)
// ═══════════════════════════════════════════════════════════════════════════════
type AuditQType = "YES_NO_NA" | "YES_NO" | "OK_NOT_OK" | "RATING_1_5" | "NUMERIC" | "TEXT";

interface AuditQuestion {
  id: string; code: string; textEn: string; section: string;
  type: AuditQType; mandatory: boolean; allowRemarks: boolean; allowPhoto: boolean;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  recommendEn: string;
}

interface AuditAnswer {
  answer: string; remarks: string; photo: string | null;
}

// ── Active questions pulled from Question Library ─────────────────────────────
const AUDIT_QUESTIONS: AuditQuestion[] = [
  // General
  { id:"q001", code:"Q-001", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether MCCBs/MCBs/ELCBs are provided with proper rating to cater the load" },
  { id:"q002", code:"Q-002", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether light and emergency light are provided in electrical rooms/operating areas for easy operation & maintenance works" },
  { id:"q003", code:"Q-003", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether Pump room, DG set room, UPS room, electrical room etc. are maintained dry and in good condition and obsolete/hazardous/old items are not dumped there" },
  { id:"q004", code:"Q-004", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether water seepage is observed near any of the Electrical Panel, Distribution Boards, Electrical equipment etc." },
  { id:"q005", code:"Q-005", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether Earthing pits are provided and connected to the equipment, body of the connected equipment" },
  { id:"q006", code:"Q-006", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether the Earthing Pits are properly maintained" },
  { id:"q007", code:"Q-007", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether proper exhaust fan for ventilation of panel room/electrical room/UPS room is provided and paper, old materials or any other scrap kept near DB/Panels/UPS/Batteries etc. are not kept there" },
  { id:"q008", code:"Q-008", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether penalty is being imposed in electricity bills on account of higher load/poor power factor etc." },
  { id:"q009", code:"Q-009", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Additional electrical load required if any (from Power Distribution Company)" },
  { id:"q010", code:"Q-010", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether load is distributed in all 3 phases to avoid unbalancing and no loose electrical connection/haphazard wiring observed in the branch/office premises" },
  { id:"q011", code:"Q-011", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether isolating switches are provided for switching off non-essential loads during night and main switch to switch off power in case of Fire/Emergency" },
  { id:"q012", code:"Q-012", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether electrical equipments of Pantry etc. are properly connected to Iron socket box with MCBs and protect them from overload" },
  { id:"q013", code:"Q-013", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether proper preventive maintenance after opening of Panel boards and Distribution Boards are carried out by licensed Electricians or skilled technicians" },
  { id:"q014", code:"Q-014", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether appropriate timers used for Server Room ACs and Signage Boards for auto ON/OFF. Thermostat of ACs at server rooms should be set to 30°C" },
  { id:"q015", code:"Q-015", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether preventive maintenance of electric installation and equipment is carried out by skilled license holder electricians/skilled technician" },
  { id:"q016", code:"Q-016", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"General condition of electrical control panels, Main switch, electric meter board, ACs, Water coolers, wiring cables etc. is good and all DBs, Panels, Switch boards are properly covered" },
  { id:"q017", code:"Q-017", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether contact numbers of electricians, power distribution company, Generator service provider, UPS vendor, ACs etc. are available with staff and displayed in Electric Room/UPS room" },
  { id:"q018", code:"Q-018", section:"General", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether the Power Factor (PF) panel of appropriate rating is installed" },
  // Fire Prevention
  { id:"q019", code:"Q-019", section:"Fire Prevention Measures", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"All old disposable records, broken furniture etc. accumulated at the premises have been cleared" },
  { id:"q020", code:"Q-020", section:"Fire Prevention Measures", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Combustible leaf, litter/waste papers etc. in and around the branch is removed/cleaned periodically" },
  { id:"q021", code:"Q-021", section:"Fire Prevention Measures", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"No stationery/Records/old obsolete items are stored/kept in the system/UPS room" },
  { id:"q022", code:"Q-022", section:"Fire Prevention Measures", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Storage racks in Stationery/Record room kept at a safe distance of at least 3 ft from electrical points/switch/junction boxes" },
  { id:"q023", code:"Q-023", section:"Fire Prevention Measures", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"In the pantry/canteen LPG is used" },
  // Server and UPS Room
  { id:"q024", code:"Q-024", section:"Server and UPS Room", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Server room has dual AC units having timer circuit device with independent circuit" },
  { id:"q025", code:"Q-025", section:"Server and UPS Room", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether metal body exhaust fan is installed in UPS room" },
  { id:"q026", code:"Q-026", section:"Server and UPS Room", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether all ceiling fans installed are of BLDC type" },
  // Electrical Safety
  { id:"q027", code:"Q-027", section:"Electrical Safety", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Power supply to record/stationery room is made through plug and socket arrangement" },
  { id:"q028", code:"Q-028", section:"Electrical Safety", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether LED lights have been installed. If not, specify number required: Down lights (12/15W) — NOS: ___ | 2×2 Flush lights (36W) — NOS: ___" },
  { id:"q029", code:"Q-029", section:"Electrical Safety", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether motion sensors/occupancy sensors have been installed. If not, record the number of sensors required in observations" },
  // Fire Protection
  { id:"q030", code:"Q-030", section:"Fire Protection", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Are fire extinguishers available in: A. Systems/UPS Room: CO2 (3Kg/4.5Kg) × 2  |  B. Banking Hall: Water/CO2 type × 1  |  C. Stationery Room: Water/CO2 type × 1" },
  // DG Set
  { id:"q031", code:"Q-031", section:"DG Set / Generator", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"DG Set / Generator is installed at the branch/office" },
  { id:"q032", code:"Q-032", section:"DG Set / Generator", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"At least two 6 Kg. ABC capacity fire extinguishers are placed near the diesel generator" },
  { id:"q033", code:"Q-033", section:"DG Set / Generator", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether electrical safety and energy saving awareness meeting with the staff members was conducted after electrical safety audit" },
  // Onsite ATM
  { id:"q034", code:"Q-034", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"5 Kg ABC Automatic Modular Fire Extinguisher is provided and protected in the back room" },
  { id:"q035", code:"Q-035", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"ATM room is having fire detector connected through branch AFDS (Applicable for Onsite ATMs only)" },
  { id:"q036", code:"Q-036", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Whether MCCB/MCB/ELCB are provided and apparently in working condition" },
  { id:"q037", code:"Q-037", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"AC units are provided with timer circuit device" },
  { id:"q038", code:"Q-038", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Main supply switch/MCB to cut-off the electric supply of ATM has been marked" },
  { id:"q039", code:"Q-039", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Power supply to AC, UPS and ATM machines is through metal clad plug receptacle socket" },
  { id:"q040", code:"Q-040", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Electrical wires are properly covered/insulated to prevent exposure of wire" },
  { id:"q041", code:"Q-041", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Is there any cooking stove/electric heater coil stove noticed in the ATM" },
  { id:"q042", code:"Q-042", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Is there any water accumulation/seepage in the premises or dripping on electrical gadgets" },
  { id:"q043", code:"Q-043", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Any combustible container provided in the ATM" },
  { id:"q044", code:"Q-044", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Steel dustbin container provided in the ATM" },
  { id:"q045", code:"Q-045", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"No smoking board is provided in the ATM cabin" },
  { id:"q046", code:"Q-046", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Main entrance shutter is in working condition" },
  { id:"q047", code:"Q-047", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"Proper locking arrangement is there at the main shutter" },
  { id:"q048", code:"Q-048", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"All electrical lights are in working condition" },
  { id:"q049", code:"Q-049", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"ATM is provided with external CCTV camera" },
  { id:"q050", code:"Q-050", section:"Onsite ATM", type:"YES_NO_NA", mandatory:true, allowRemarks:true, allowPhoto:false, riskLevel:"HIGH", recommendEn:"COMPLIED", textEn:"CCTV is in working condition" },
];

// "Onsite ATM" → Step 8, "DG Set / Generator" → Step 9 — both excluded here
const SECTION_ORDER = ["General","Fire Prevention Measures","Server and UPS Room","Electrical Safety","Fire Protection"];
const SECTION_COLORS: Record<string,{ color:string; bg:string; border:string }> = {
  "General":                  { color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
  "Fire Prevention Measures": { color:"#dc2626", bg:"#fef2f2", border:"#fecaca" },
  "Server and UPS Room":      { color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
  "Electrical Safety":        { color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  "Fire Protection":          { color:"#ea580c", bg:"#fff7ed", border:"#fed7aa" },
  "DG Set / Generator":       { color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe" },
  "Onsite ATM":               { color:"#0891b2", bg:"#ecfeff", border:"#a5f3fc" },
};
const RISK_DOT: Record<string,string> = { HIGH:"#dc2626", MEDIUM:"#d97706", LOW:"#16a34a" };

// ── Answer option definitions ─────────────────────────────────────────────────
const ANSWER_OPTIONS: Record<AuditQType, { label:string; color:string; bg:string; border:string }[]> = {
  YES_NO_NA: [
    { label:"YES",  color:"#16a34a", bg:"#f0fdf4", border:"#16a34a" },
    { label:"NO",   color:"#dc2626", bg:"#fef2f2", border:"#dc2626" },
    { label:"N/A",  color:"#6b7280", bg:"#f9fafb", border:"#9ca3af" },
  ],
  YES_NO: [
    { label:"YES",  color:"#16a34a", bg:"#f0fdf4", border:"#16a34a" },
    { label:"NO",   color:"#dc2626", bg:"#fef2f2", border:"#dc2626" },
  ],
  OK_NOT_OK: [
    { label:"OK",      color:"#16a34a", bg:"#f0fdf4", border:"#16a34a" },
    { label:"NOT OK",  color:"#dc2626", bg:"#fef2f2", border:"#dc2626" },
  ],
  RATING_1_5: [],
  NUMERIC:    [],
  TEXT:       [],
};

function QuestionCard({
  q, ans, onAnswer,
}: {
  q: AuditQuestion;
  ans: AuditAnswer;
  onAnswer: (id: string, field: keyof AuditAnswer, val: string | null) => void;
}) {
  const sc = SECTION_COLORS[q.section] || { color:"#374151", bg:"#f9fafb", border:"#e5e7eb" };
  const opts = ANSWER_OPTIONS[q.type];
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => onAnswer(q.id, "photo", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const answered = !!ans.answer;

  return (
    <div style={{
      background:"#fff", borderRadius:12, border:`1px solid ${answered ? sc.border : "#e5e7eb"}`,
      overflow:"hidden", boxShadow: answered ? `0 2px 8px ${sc.color}18` : "0 1px 3px rgba(0,0,0,0.05)",
      marginBottom:10, transition:"all 0.15s",
    }}>
      {/* Question header */}
      <div style={{ padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:10, borderBottom:"1px solid #f3f4f6" }}>
        {/* Status dot + code */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0, paddingTop:2 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background: answered ? sc.color : "#d1d5db" }}/>
          <span style={{ fontSize:9, fontWeight:800, color:"#9ca3af", fontFamily:"monospace", letterSpacing:"0.03em" }}>{q.code}</span>
        </div>
        {/* Text */}
        <div style={{ flex:1 }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#111827", margin:0, lineHeight:1.55 }}>{q.textEn}</p>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
            {q.mandatory && <span style={{ fontSize:9, fontWeight:700, color:"#dc2626", background:"#fee2e2", borderRadius:4, padding:"1px 6px" }}>MANDATORY</span>}
            <span style={{ fontSize:9, fontWeight:700, color: RISK_DOT[q.riskLevel], background:`${RISK_DOT[q.riskLevel]}18`, borderRadius:4, padding:"1px 6px" }}>{q.riskLevel} RISK</span>
          </div>
        </div>
      </div>

      {/* Answer area */}
      <div style={{ padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 }}>

        {/* Button-type answers */}
        {opts.length > 0 && (
          <div style={{ display:"flex", gap:8 }}>
            {opts.map(opt => {
              const sel = ans.answer === opt.label;
              return (
                <button
                  key={opt.label}
                  onClick={() => onAnswer(q.id, "answer", sel ? "" : opt.label)}
                  style={{
                    flex:1, padding:"10px 8px", borderRadius:9,
                    border:`2px solid ${sel ? opt.border : "#e5e7eb"}`,
                    background: sel ? opt.bg : "#fff",
                    color: sel ? opt.color : "#9ca3af",
                    fontWeight:800, fontSize:13, cursor:"pointer",
                    transition:"all 0.15s", letterSpacing:"0.03em",
                    boxShadow: sel ? `0 2px 6px ${opt.color}30` : "none",
                  }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Rating 1-5 */}
        {q.type === "RATING_1_5" && (
          <div style={{ display:"flex", gap:6 }}>
            {[1,2,3,4,5].map(n => {
              const sel = parseInt(ans.answer) >= n;
              return (
                <button key={n} onClick={() => onAnswer(q.id, "answer", String(n))}
                  style={{ flex:1, padding:"10px 0", borderRadius:9, border:`2px solid ${sel?"#f59e0b":"#e5e7eb"}`, background:sel?"#fffbeb":"#fff", color:sel?"#d97706":"#9ca3af", fontWeight:800, fontSize:14, cursor:"pointer" }}>
                  ★
                </button>
              );
            })}
          </div>
        )}

        {/* Numeric */}
        {q.type === "NUMERIC" && (
          <input type="number" value={ans.answer} onChange={e => onAnswer(q.id, "answer", e.target.value)}
            placeholder="Enter numeric value"
            style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:14, fontWeight:700, color:"#111827", outline:"none", boxSizing:"border-box", background:"#fafafa" }}/>
        )}

        {/* Text */}
        {q.type === "TEXT" && (
          <textarea value={ans.answer} onChange={e => onAnswer(q.id, "answer", e.target.value)}
            placeholder="Enter your observation"
            rows={2}
            style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:9, padding:"10px 12px", fontSize:13, color:"#111827", outline:"none", boxSizing:"border-box", background:"#fafafa", resize:"vertical" }}/>
        )}

        {/* Remarks */}
        {q.allowRemarks && ans.answer && (
          <div>
            <label style={{ fontSize:10, fontWeight:700, color:"#6b7280", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.05em" }}>
              Recommendation / Remarks
            </label>
            <input
              value={ans.remarks}
              onChange={e => onAnswer(q.id, "remarks", e.target.value)}
              placeholder={`Default: ${q.recommendEn}`}
              style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"8px 11px", fontSize:12, color:"#374151", outline:"none", boxSizing:"border-box", background:"#f9fafb" }}
            />
          </div>
        )}

        {/* Photo */}
        {q.allowPhoto && ans.answer && (
          <div>
            {ans.photo ? (
              <div style={{ position:"relative", borderRadius:9, overflow:"hidden", border:"1.5px solid #e5e7eb" }}>
                <img src={ans.photo} alt="Evidence" style={{ width:"100%", maxHeight:140, objectFit:"cover", display:"block" }}/>
                <button onClick={() => onAnswer(q.id, "photo", null)}
                  style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,0.6)", border:"none", borderRadius:6, padding:"3px 8px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                  ✕ Remove
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                style={{ width:"100%", padding:"9px", borderRadius:9, border:"2px dashed #d1d5db", background:"#fafafa", color:"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <i className="ri-camera-line"/>Attach Photo Evidence
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); }}/>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionnaireSection({ branchName }: { branchName: string }) {
  const initAnswers = () => Object.fromEntries(AUDIT_QUESTIONS.map(q => [q.id, { answer:"", remarks:"", photo:null }]));
  const [answers, setAnswers]         = useState<Record<string, AuditAnswer>>(initAnswers);
  const [openSections, setOpenSections] = useState<Record<string,boolean>>(Object.fromEntries(SECTION_ORDER.map(s => [s, true])));
  const [saved, setSaved]             = useState(false);

  const onAnswer = (id: string, field: keyof AuditAnswer, val: string | null) =>
    setAnswers(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

  const toggleSection = (s: string) => setOpenSections(prev => ({ ...prev, [s]: !prev[s] }));

  const total     = AUDIT_QUESTIONS.length;
  const answered  = Object.values(answers).filter(a => a.answer).length;
  const pct       = Math.round((answered / total) * 100);

  const bySection = SECTION_ORDER.map(sec => ({
    section: sec,
    questions: AUDIT_QUESTIONS.filter(q => q.section === sec),
  })).filter(g => g.questions.length > 0);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const cyan = "#0891b2";

  return (
    <div>
      {saved && (
        <div style={{ marginBottom:14, background:"#ecfeff", border:"1px solid #a5f3fc", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <i className="ri-checkbox-circle-fill" style={{ color:cyan, fontSize:18 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:"#164e63" }}>Questionnaire saved successfully</span>
        </div>
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0891b2,#0e7490)", borderRadius:14, padding:"16px 18px", marginBottom:16, boxShadow:"0 4px 12px rgba(8,145,178,0.3)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ri-questionnaire-line" style={{ color:"#fff", fontSize:20 }}/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>{branchName}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:2 }}>All active audit questions — {total} questions across {bySection.length} sections</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:24, fontWeight:900, color:"#fff", lineHeight:1 }}>{pct}%</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{answered}/{total} answered</div>
          </div>
        </div>
        {/* Progress */}
        <div style={{ marginTop:12, height:6, background:"rgba(255,255,255,0.2)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"#fff", borderRadius:99, transition:"width 0.3s ease" }}/>
        </div>
      </div>

      {/* Section groups */}
      {bySection.map(({ section, questions }) => {
        const sc = SECTION_COLORS[section] || { color:"#374151", bg:"#f9fafb", border:"#e5e7eb" };
        const secAnswered = questions.filter(q => answers[q.id]?.answer).length;
        const isOpen = openSections[section] !== false;

        return (
          <div key={section} style={{ marginBottom:12 }}>
            {/* Section header */}
            <button
              onClick={() => toggleSection(section)}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 16px", background:sc.bg, border:`1px solid ${sc.border}`, borderRadius: isOpen ? "12px 12px 0 0" : "12px", cursor:"pointer", outline:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:4, height:20, borderRadius:99, background:sc.color, flexShrink:0 }}/>
                <span style={{ fontSize:13, fontWeight:800, color:sc.color }}>{section}</span>
                <span style={{ fontSize:11, color:"#9ca3af" }}>{questions.length} questions</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:12, fontWeight:700, color: secAnswered === questions.length ? "#16a34a" : sc.color }}>
                  {secAnswered}/{questions.length}
                </span>
                {secAnswered === questions.length && <i className="ri-checkbox-circle-fill" style={{ color:"#16a34a", fontSize:16 }}/>}
                <i className={`ri-arrow-${isOpen ? "up" : "down"}-s-line`} style={{ color:sc.color, fontSize:18 }}/>
              </div>
            </button>

            {/* Questions */}
            {isOpen && (
              <div style={{ border:`1px solid ${sc.border}`, borderTop:"none", borderRadius:"0 0 12px 12px", padding:"12px", background:"#fff" }}>
                {questions.map(q => (
                  <QuestionCard key={q.id} q={q} ans={answers[q.id]} onAnswer={onAnswer}/>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Save */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
        <button onClick={save}
          style={{ padding:"13px 32px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#0891b2,#0e7490)", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 14px rgba(8,145,178,0.35)" }}>
          <i className="ri-save-line"/>Save Questionnaire
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 8 — Onsite ATM  (questions sourced from Question Library — "Onsite ATM" section)
// ═══════════════════════════════════════════════════════════════════════════════
const ATM_QUESTIONS = AUDIT_QUESTIONS.filter(q => q.section === "Onsite ATM");

function OnsiteATMSection({ branchName }: { branchName: string }) {
  const initAnswers = () => Object.fromEntries(ATM_QUESTIONS.map(q => [q.id, { answer:"", remarks:"", photo:null } as AuditAnswer]));
  const [answers, setAnswers] = useState<Record<string, AuditAnswer>>(initAnswers);
  const [saved, setSaved]     = useState(false);

  const onAnswer = (id: string, field: keyof AuditAnswer, val: string | null) =>
    setAnswers(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

  const total    = ATM_QUESTIONS.length;
  const answered = Object.values(answers).filter(a => a.answer).length;
  const pct      = Math.round((answered / total) * 100);
  const purple   = "#7c3aed";

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div>
      {saved && (
        <div style={{ marginBottom:14, background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <i className="ri-checkbox-circle-fill" style={{ color:purple, fontSize:18 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:"#4c1d95" }}>Onsite ATM checklist saved successfully</span>
        </div>
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#7c3aed,#6d28d9)", borderRadius:14, padding:"16px 18px", marginBottom:16, boxShadow:"0 4px 12px rgba(124,58,237,0.3)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ri-bank-card-line" style={{ color:"#fff", fontSize:20 }}/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>{branchName}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:2 }}>Onsite ATM — {total} questions from Question Library</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:24, fontWeight:900, color:"#fff", lineHeight:1 }}>{pct}%</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{answered}/{total} answered</div>
          </div>
        </div>
        <div style={{ marginTop:12, height:6, background:"rgba(255,255,255,0.2)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"#fff", borderRadius:99, transition:"width 0.3s ease" }}/>
        </div>
      </div>

      {/* Question cards — same layout as Questionnaire section */}
      {ATM_QUESTIONS.map(q => (
        <QuestionCard key={q.id} q={q} ans={answers[q.id]} onAnswer={onAnswer} />
      ))}

      {/* Save */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
        <button onClick={save}
          style={{ padding:"13px 32px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#7c3aed,#6d28d9)", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 14px rgba(124,58,237,0.35)" }}>
          <i className="ri-save-line"/>Save ATM Checklist
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT PAGE — Multi-Step Audit Form
// ═══════════════════════════════════════════════════════════════════════════════
export default function AuditFormPage() {
  const [currentStep, setCurrentStep] = useState<Step>("capture-branch");
  const [branchData, setBranchData]   = useState<BranchData | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());

  const currentIdx = STEPS.findIndex(s => s.id === currentStep);

  // ── TESTING MODE: all steps freely navigable ──────────────────────────────
  const goToStep = (stepId: Step) => {
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    const next = STEPS[currentIdx + 1];
    if (next) goToStep(next.id);
  };

  const handleBranchComplete = (data: BranchData) => {
    setBranchData(data);
    setCompletedSteps(prev => new Set([...prev, "capture-branch"]));
    goToStep("branch-photo");
  };

  const branchDisplayName = branchData?.ifscData
    ? `${BANK_LIST.find(b=>b.code===branchData.bankCode)?.name?.split(" ").slice(0,2).join(" ")} — ${branchData.ifscData.BRANCH}`
    : "Branch not yet captured";

  const active = STEPS.find(s => s.id === currentStep)!;

  return (
    <div style={{ padding:"24px 0" }}>

      {/* Page header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Audit Form</h4>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>
            Dashboard / Audits / <span style={{ color:active.color, fontWeight:600 }}>New Audit</span>
          </div>
        </div>
        {branchData && (
          <div style={{ fontSize:12, fontWeight:700, color:"#6b7280", background:"#f3f4f6", borderRadius:8, padding:"6px 14px", display:"flex", alignItems:"center", gap:6 }}>
            <i className="ri-building-2-line"/>{branchDisplayName}
          </div>
        )}
      </div>

      {/* ── Step Indicator ──────────────────────────────────────────────────── */}
      <div style={{ display:"flex", gap:0, marginBottom:28, position:"relative" }}>
        {STEPS.map((step, idx) => {
            const isDone    = completedSteps.has(step.id);
          const isCurrent = step.id === currentStep;
          const canClick  = true; // testing mode — all steps freely accessible

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => canClick && goToStep(step.id)}
                style={{
                  flex:1, border:"1px solid #e5e7eb",
                  borderRadius: idx===0 ? "12px 0 0 12px" : idx===STEPS.length-1 ? "0 12px 12px 0" : "0",
                  borderRight: idx<STEPS.length-1 ? "none" : "1px solid #e5e7eb",
                  padding:"12px 10px", cursor: canClick ? "pointer" : "not-allowed",
                  outline:"none", transition:"all 0.15s",
                  background: isCurrent ? `${step.color}10` : isDone ? "#f0fdf4" : "#fff",
                  borderTop: isCurrent ? `3px solid ${step.color}` : isDone ? "3px solid #16a34a" : "3px solid transparent",
                  boxShadow: isCurrent ? "0 2px 8px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
                  position:"relative",
                }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
                  <div style={{
                    width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                    background: isDone ? "#16a34a" : isCurrent ? step.color : "#e5e7eb",
                  }}>
                    {isDone
                      ? <i className="ri-check-line" style={{ color:"#fff", fontSize:13, fontWeight:900 }}/>
                      : isCurrent
                        ? <i className={step.icon} style={{ color:"#fff", fontSize:13 }}/>
                        : <span style={{ fontSize:11, fontWeight:800, color:"#9ca3af" }}>{idx+1}</span>
                    }
                  </div>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontSize:11, fontWeight:800, color: isCurrent ? step.color : isDone ? "#16a34a" : "#9ca3af", lineHeight:1.2 }}>{step.shortLabel}</div>
                    <div style={{ fontSize:10, color:"#9ca3af", marginTop:1, display: isCurrent ? "block" : "none" }}>{step.desc}</div>
                  </div>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Active Step Header ───────────────────────────────────────────────── */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 3px rgba(0,0,0,0.05)", borderLeft:`4px solid ${active.color}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:`${active.color}15`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className={active.icon} style={{ fontSize:20, color:active.color }}/>
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:9, fontWeight:800, color:active.color, background:`${active.color}15`, borderRadius:20, padding:"2px 9px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Step {currentIdx+1} of {STEPS.length}</span>
            </div>
            <div style={{ fontSize:16, fontWeight:900, color:"#111827", marginTop:3 }}>{active.label}</div>
            <div style={{ fontSize:12, color:"#9ca3af", marginTop:1 }}>{active.desc}</div>
          </div>
        </div>
        {/* Back nav */}
        {currentIdx > 0 && (
          <button
            onClick={() => goToStep(STEPS[currentIdx-1].id)}
            style={{ fontSize:12, fontWeight:700, color:"#6b7280", background:"#f3f4f6", border:"none", borderRadius:8, padding:"7px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
            <i className="ri-arrow-left-line"/>Back
          </button>
        )}
      </div>

      {/* ── Step Content ──────────────────────────────────────────────────────── */}
      {currentStep === "capture-branch" && (
        <CaptureBranchStep onComplete={handleBranchComplete} />
      )}
      {currentStep === "branch-photo" && (
        <BranchPhotoSection
          branchName={branchDisplayName}
          onContinue={() => { setCompletedSteps(prev => new Set([...prev, "branch-photo"])); goNext(); }}
        />
      )}
      {currentStep === "load-sheet" && (
        <LoadSheetSection branchName={branchDisplayName} />
      )}
      {currentStep === "meter-details" && (
        <MeterDetailsSection branchName={branchDisplayName} />
      )}
      {currentStep === "dg-set" && (
        <DGSetSection branchName={branchDisplayName} />
      )}
      {currentStep === "ups-parameters" && (
        <UPSParametersSection branchName={branchDisplayName} />
      )}
      {currentStep === "ups-sld" && (
        <UPSSLDSection branchName={branchDisplayName} />
      )}
      {currentStep === "ups-questionnaire" && (
        <UPSQuestionnaireSection branchName={branchDisplayName} />
      )}
      {currentStep === "electrical-parameters" && (
        <ElectricalParametersSection branchName={branchDisplayName} />
      )}
      {currentStep === "questionnaire" && (
        <QuestionnaireSection branchName={branchDisplayName} />
      )}
      {currentStep === "onsite-atm" && (
        <OnsiteATMSection branchName={branchDisplayName} />
      )}

      {/* ── Next Step Navigation (not capture-branch, branch-photo, or the final dg-set step) */}
      {currentStep !== "capture-branch" && currentStep !== "branch-photo" && currentStep !== "dg-set" && (
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:20 }}>
          <button
            onClick={() => { setCompletedSteps(prev => new Set([...prev, currentStep])); goNext(); }}
            style={{ padding:"12px 28px", borderRadius:10, border:"none", background:active.color, color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:`0 4px 14px ${active.color}55` }}>
            <i className="ri-arrow-right-line"/>Next — {STEPS[currentIdx+1]?.label}
          </button>
        </div>
      )}

      {/* Spin animation */}
      <style>{`
        @keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0 }
        input[type=number] { -moz-appearance:textfield }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE SCHEMA — UPS Parameters (Step 3)
// For developer reference. All tables use PostgreSQL + Prisma ORM.
// branch_unique_id is the UUID from the `branches` table and is the
// primary foreign key linking every audit record back to the branch.
// ═══════════════════════════════════════════════════════════════════════════════

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ENTITY RELATIONSHIP OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  branches (existing)
    └── audit_sessions          [1 branch : many audit sessions]
          └── audit_ups_units   [1 session : many UPS units]

  branch_unique_id flows through EVERY table so that any record can be
  directly queried by branch without joining through audit_sessions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  POSTGRESQL — RAW SQL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ── ENUMS ───────────────────────────────────────────────────────────────────

CREATE TYPE ups_type_enum      AS ENUM ('Branch', 'ATM');
CREATE TYPE ups_device_enum    AS ENUM ('UPS', 'Inverter');
CREATE TYPE ups_phase_enum     AS ENUM ('1-Phase', '3-Phase');
CREATE TYPE audit_status_enum  AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- ── audit_sessions ───────────────────────────────────────────────────────────
-- One row per audit visit to a branch.
-- All step data (UPS, Electrical, Meters, Questionnaire…) hangs off this table.

CREATE TABLE audit_sessions (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_unique_id  UUID          NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
  auditor_id        UUID          NOT NULL REFERENCES users(id),
  audit_date        DATE          NOT NULL,
  status            audit_status_enum NOT NULL DEFAULT 'DRAFT',

  -- GPS at time of audit (from Step 1 GPS capture)
  audit_lat         DOUBLE PRECISION,
  audit_lng         DOUBLE PRECISION,

  -- Timestamps
  submitted_at      TIMESTAMPTZ,
  approved_at       TIMESTAMPTZ,
  approved_by       UUID          REFERENCES users(id),
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ   -- soft delete
);

CREATE INDEX idx_audit_sessions_branch   ON audit_sessions(branch_unique_id);
CREATE INDEX idx_audit_sessions_auditor  ON audit_sessions(auditor_id);
CREATE INDEX idx_audit_sessions_date     ON audit_sessions(audit_date);
CREATE INDEX idx_audit_sessions_status   ON audit_sessions(status);

-- ── audit_ups_units ──────────────────────────────────────────────────────────
-- One row per UPS/Inverter unit captured during the audit.
-- A branch may have multiple UPS units (UPS 1, UPS 2 …).
-- UPS 1 (unit_index = 1) TYPE is always 'Branch'.
-- UPS 2+ can be 'Branch' or 'ATM'.

CREATE TABLE audit_ups_units (
  id                    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reference keys
  audit_session_id      UUID          NOT NULL REFERENCES audit_sessions(id) ON DELETE CASCADE,
  branch_unique_id      UUID          NOT NULL REFERENCES branches(id),        -- denormalised for fast branch queries

  -- Identity / ordering
  unit_index            SMALLINT      NOT NULL DEFAULT 1,                       -- 1-based display order
  unit_name             VARCHAR(50)   NOT NULL DEFAULT 'UPS 1',                 -- editable label e.g. "UPS 1", "UPS 2"

  -- Classification (Step 3 header dropdowns)
  ups_type              ups_type_enum,                                          -- Branch | ATM
  device_type           ups_device_enum,                                        -- UPS | Inverter

  -- ── Spec Table ─────────────────────────────────────────────────────────────
  make                  VARCHAR(100),                                            -- UPS/Inverter Make   e.g. "APC", "Emerson"
  capacity_kva          NUMERIC(10,3),                                           -- Capacity in KVA     e.g. 10.000
  phase_type            ups_phase_enum,                                          -- 1-Phase | 3-Phase   drives reading table layout
  battery_make          VARCHAR(100),                                            -- Make of Batteries   e.g. "Exide", "Amara Raja"
  battery_capacity_ah   NUMERIC(8,2),                                            -- Battery capacity Ah e.g. 42.00
  battery_count         SMALLINT,                                                -- Number of batteries e.g. 8

  -- UPS spec photo (stored as S3/MinIO object key; resolve to URL via CDN)
  spec_photo_key        TEXT,                                                    -- e.g. "audits/{session_id}/ups/{id}/spec.jpg"

  -- ── Readings — SHARED (both 1-Phase and 3-Phase) ──────────────────────────
  -- Input side
  input_ne_earthing_v   NUMERIC(8,3),  -- Input N-E Earthing (V). This value auto-fills Output N-E Earthing.

  -- Output side
  output_voltage_pn_v   NUMERIC(8,3),  -- Output Voltage P-N (V)
  output_ne_earthing_v  NUMERIC(8,3),  -- Output N-E Earthing (V). Default = input_ne_earthing_v. Store separately for audit trail.
  output_ne_photo_key   TEXT,          -- Photo evidence for Output N-E Earthing

  -- Frequency
  frequency_hz          NUMERIC(6,2),  -- Output frequency (Hz) e.g. 50.00

  -- ── Readings — 1-Phase ONLY ───────────────────────────────────────────────
  -- (NULL when phase_type = '3-Phase')
  input_voltage_pn_v    NUMERIC(8,3),  -- Input Voltage P-N (V)
  current_reading_a     NUMERIC(8,3),  -- Current Reading (A)

  -- ── Readings — 3-Phase ONLY ───────────────────────────────────────────────
  -- (NULL when phase_type = '1-Phase')
  input_voltage_rn_v    NUMERIC(8,3),  -- Input Voltage R-N (V)
  input_voltage_yn_v    NUMERIC(8,3),  -- Input Voltage Y-N (V)
  input_voltage_bn_v    NUMERIC(8,3),  -- Input Voltage B-N (V)
  current_r_phase_a     NUMERIC(8,3),  -- Current R Phase (A)
  current_y_phase_a     NUMERIC(8,3),  -- Current Y Phase (A)
  current_b_phase_a     NUMERIC(8,3),  -- Current B Phase (A)

  -- ── Audit trail ───────────────────────────────────────────────────────────
  created_by            UUID          REFERENCES users(id),
  updated_by            UUID          REFERENCES users(id),
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ,  -- soft delete

  -- Constraints
  CONSTRAINT unique_ups_per_session UNIQUE (audit_session_id, unit_index),
  CONSTRAINT ups_index_positive     CHECK  (unit_index >= 1),
  CONSTRAINT ups_kva_positive       CHECK  (capacity_kva IS NULL OR capacity_kva > 0),
  CONSTRAINT ups_batt_positive      CHECK  (battery_capacity_ah IS NULL OR battery_capacity_ah > 0),
  CONSTRAINT ups_batt_count_pos     CHECK  (battery_count IS NULL OR battery_count > 0)
);

-- Indexes
CREATE INDEX idx_ups_session          ON audit_ups_units(audit_session_id);
CREATE INDEX idx_ups_branch           ON audit_ups_units(branch_unique_id);           -- direct branch lookup
CREATE INDEX idx_ups_branch_session   ON audit_ups_units(branch_unique_id, audit_session_id);
CREATE INDEX idx_ups_phase            ON audit_ups_units(phase_type);
CREATE INDEX idx_ups_type             ON audit_ups_units(ups_type);
CREATE INDEX idx_ups_deleted          ON audit_ups_units(deleted_at) WHERE deleted_at IS NULL;

-- Trigger: auto-copy input_ne_earthing_v → output_ne_earthing_v if output not explicitly set
CREATE OR REPLACE FUNCTION fn_ups_ne_earthing_default()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.output_ne_earthing_v IS NULL AND NEW.input_ne_earthing_v IS NOT NULL THEN
    NEW.output_ne_earthing_v := NEW.input_ne_earthing_v;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_ups_ne_earthing_default
  BEFORE INSERT OR UPDATE ON audit_ups_units
  FOR EACH ROW EXECUTE FUNCTION fn_ups_ne_earthing_default();


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PRISMA SCHEMA  (schema.prisma)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

enum UpsType {
  Branch
  ATM
}

enum UpsDevice {
  UPS
  Inverter
}

enum UpsPhase {
  OnePhase   @map("1-Phase")
  ThreePhase @map("3-Phase")
}

enum AuditStatus {
  DRAFT
  IN_PROGRESS
  COMPLETED
  SUBMITTED
  APPROVED
  REJECTED
}

model AuditSession {
  id               String      @id @default(uuid())
  branchUniqueId   String      @map("branch_unique_id")
  auditorId        String      @map("auditor_id")
  auditDate        DateTime    @map("audit_date") @db.Date
  status           AuditStatus @default(DRAFT)

  auditLat         Float?      @map("audit_lat")
  auditLng         Float?      @map("audit_lng")

  submittedAt      DateTime?   @map("submitted_at")
  approvedAt       DateTime?   @map("approved_at")
  approvedBy       String?     @map("approved_by")

  createdAt        DateTime    @default(now()) @map("created_at")
  updatedAt        DateTime    @updatedAt      @map("updated_at")
  deletedAt        DateTime?   @map("deleted_at")

  // Relations
  branch           Branch      @relation(fields: [branchUniqueId], references: [id])
  auditor          User        @relation("AuditSessionAuditor", fields: [auditorId], references: [id])
  upsUnits         AuditUpsUnit[]

  @@index([branchUniqueId])
  @@index([auditorId])
  @@index([auditDate])
  @@index([status])
  @@map("audit_sessions")
}

model AuditUpsUnit {
  id                  String      @id @default(uuid())

  // Reference keys
  auditSessionId      String      @map("audit_session_id")
  branchUniqueId      String      @map("branch_unique_id")   // denormalised

  // Identity
  unitIndex           Int         @map("unit_index")          @db.SmallInt
  unitName            String      @map("unit_name")           @db.VarChar(50)

  // Classification
  upsType             UpsType?    @map("ups_type")
  deviceType          UpsDevice?  @map("device_type")

  // Spec table
  make                String?     @db.VarChar(100)
  capacityKva         Decimal?    @map("capacity_kva")        @db.Decimal(10, 3)
  phaseType           UpsPhase?   @map("phase_type")
  batteryMake         String?     @map("battery_make")        @db.VarChar(100)
  batteryCapacityAh   Decimal?    @map("battery_capacity_ah") @db.Decimal(8, 2)
  batteryCount        Int?        @map("battery_count")       @db.SmallInt
  specPhotoKey        String?     @map("spec_photo_key")

  // Shared readings
  inputNeEarthingV    Decimal?    @map("input_ne_earthing_v") @db.Decimal(8, 3)
  outputVoltagePnV    Decimal?    @map("output_voltage_pn_v") @db.Decimal(8, 3)
  outputNeEarthingV   Decimal?    @map("output_ne_earthing_v")@db.Decimal(8, 3) // default = inputNeEarthingV via trigger
  outputNePhotoKey    String?     @map("output_ne_photo_key")
  frequencyHz         Decimal?    @map("frequency_hz")        @db.Decimal(6, 2)

  // 1-Phase only
  inputVoltagePnV     Decimal?    @map("input_voltage_pn_v")  @db.Decimal(8, 3)
  currentReadingA     Decimal?    @map("current_reading_a")   @db.Decimal(8, 3)

  // 3-Phase only
  inputVoltageRnV     Decimal?    @map("input_voltage_rn_v")  @db.Decimal(8, 3)
  inputVoltageYnV     Decimal?    @map("input_voltage_yn_v")  @db.Decimal(8, 3)
  inputVoltageBnV     Decimal?    @map("input_voltage_bn_v")  @db.Decimal(8, 3)
  currentRPhaseA      Decimal?    @map("current_r_phase_a")   @db.Decimal(8, 3)
  currentYPhaseA      Decimal?    @map("current_y_phase_a")   @db.Decimal(8, 3)
  currentBPhaseA      Decimal?    @map("current_b_phase_a")   @db.Decimal(8, 3)

  // Audit trail
  createdBy           String?     @map("created_by")
  updatedBy           String?     @map("updated_by")
  createdAt           DateTime    @default(now()) @map("created_at")
  updatedAt           DateTime    @updatedAt      @map("updated_at")
  deletedAt           DateTime?   @map("deleted_at")

  // Relations
  auditSession        AuditSession @relation(fields: [auditSessionId], references: [id], onDelete: Cascade)
  branch              Branch       @relation(fields: [branchUniqueId], references: [id])

  @@unique([auditSessionId, unitIndex])
  @@index([branchUniqueId])
  @@index([branchUniqueId, auditSessionId])
  @@index([phaseType])
  @@index([upsType])
  @@map("audit_ups_units")
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  FIELD REFERENCE — For developer mapping UI → DB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  UI Label                    DB Column                    Type          Notes
  ─────────────────────────────────────────────────────────────────────────────
  [Branch Unique ID]           branch_unique_id             UUID          FK → branches.id
  [Audit Session ID]           audit_session_id             UUID          FK → audit_sessions.id
  UPS 1 / UPS 2 (label)        unit_name                    VARCHAR(50)
  Order / sequence             unit_index                   SMALLINT      1-based
  TYPE dropdown                ups_type                     UpsType       'Branch'|'ATM'
  Is it UPS/Inverter?          device_type                  UpsDevice     'UPS'|'Inverter'
  UPS/Inverter Make            make                         VARCHAR(100)
  Capacity in KVA              capacity_kva                 DECIMAL(10,3)
  1-Phase or 3-Phase           phase_type                   UpsPhase      drives reading layout
  Make of Batteries            battery_make                 VARCHAR(100)
  Capacity of Batteries Ah     battery_capacity_ah          DECIMAL(8,2)
  Number of Batteries          battery_count                SMALLINT
  UPS Photo                    spec_photo_key               TEXT          S3/MinIO object key
  ─ 1-Phase readings ──────────────────────────────────────────────────────────
  Input Voltage P-N            input_voltage_pn_v           DECIMAL(8,3)  V
  Input N-E Earthing           input_ne_earthing_v          DECIMAL(8,3)  V  ← auto-fills output
  Output Voltage P-N           output_voltage_pn_v          DECIMAL(8,3)  V
  Output N-E Earthing          output_ne_earthing_v         DECIMAL(8,3)  V  ← default = input_ne_earthing_v
  Output N-E Photo             output_ne_photo_key          TEXT
  Current Reading              current_reading_a            DECIMAL(8,3)  A
  Frequency                    frequency_hz                 DECIMAL(6,2)  Hz
  ─ 3-Phase readings ──────────────────────────────────────────────────────────
  Input Voltage R-N            input_voltage_rn_v           DECIMAL(8,3)  V
  Input Voltage Y-N            input_voltage_yn_v           DECIMAL(8,3)  V
  Input Voltage B-N            input_voltage_bn_v           DECIMAL(8,3)  V
  Input N-E Earthing           input_ne_earthing_v          DECIMAL(8,3)  V  ← same as 1-phase
  Output Voltage P-N           output_voltage_pn_v          DECIMAL(8,3)  V  ← same as 1-phase
  Output N-E Earthing          output_ne_earthing_v         DECIMAL(8,3)  V  ← same as 1-phase
  Output N-E Photo             output_ne_photo_key          TEXT          same as 1-phase
  Current R Phase              current_r_phase_a            DECIMAL(8,3)  A
  Current Y Phase              current_y_phase_a            DECIMAL(8,3)  A
  Current B Phase              current_b_phase_a            DECIMAL(8,3)  A
  Frequency                    frequency_hz                 DECIMAL(6,2)  Hz  same as 1-phase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SAMPLE API PAYLOAD  (POST /api/v1/audits/{session_id}/ups)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    "branchUniqueId":     "b1a2c3d4-e5f6-7890-abcd-ef1234567890",
    "auditSessionId":     "a9b8c7d6-e5f4-3210-fedc-ba0987654321",
    "units": [
      {
        "unitIndex":          1,
        "unitName":           "UPS 1",
        "upsType":            "Branch",
        "deviceType":         "UPS",
        "make":               "APC",
        "capacityKva":        10.0,
        "phaseType":          "3-Phase",
        "batteryMake":        "Exide",
        "batteryCapacityAh":  42,
        "batteryCount":       8,
        "specPhotoKey":       "audits/a9b8c.../ups/1/spec.jpg",
        "inputVoltageRnV":    230.5,
        "inputVoltageYnV":    231.0,
        "inputVoltageBnV":    229.8,
        "inputNeEarthingV":   1.2,
        "outputVoltagePnV":   230.0,
        "outputNeEarthingV":  1.2,
        "outputNePhotoKey":   "audits/a9b8c.../ups/1/ne.jpg",
        "currentRPhaseA":     12.4,
        "currentYPhaseA":     11.9,
        "currentBPhaseA":     12.1,
        "frequencyHz":        50.0
      }
    ]
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NOTES FOR DEVELOPER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. branch_unique_id is denormalised into audit_ups_units intentionally.
     This allows a direct `WHERE branch_unique_id = ?` without joining
     audit_sessions — critical for dashboard and reporting queries.

  2. Photos are stored as object KEYS (not full URLs). Resolve to signed
     CDN URLs at query time via S3/MinIO presigned URL.

  3. output_ne_earthing_v defaults to input_ne_earthing_v via a DB trigger.
     The API should still accept an explicit value (override case).
     The frontend pre-fills it in green as "auto" until overridden.

  4. 1-Phase columns (input_voltage_pn_v, current_reading_a) will be NULL
     for 3-Phase UPS records, and vice versa. Add a CHECK constraint or
     application-layer validation to ensure consistency with phase_type.

  5. unit_index = 1 must always have ups_type = 'Branch'. Enforce this
     in the API service layer, not just the frontend.

  6. Soft deletes: always filter `WHERE deleted_at IS NULL` in queries.
     Use a Prisma middleware or global query scope to enforce this.

  7. Migration order: audit_sessions → audit_ups_units (foreign key dependency).
*/
