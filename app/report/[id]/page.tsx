"use client";
import React, { useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuditReport {
  auditId: string; auditDate: string; auditorName: string;
  bank: string; bankCode: string; branchName: string;
  branchCode: string; ifsc: string; address: string;
  city: string; district: string; state: string; micr: string;
  circle: string; region: string; rbo: string; lho: string;
  riskLevel: string; htlt: string; score: number;
  beeReg: string; elecSup: string;
  overview: string[][];
  loadAnalysis: { param: string; reading: string; unit: string; range: string; remarks: string }[];
  voltageReadings: { param: string; panel: string; acdb: string; unit: string; range: string; remarks: string }[];
  currentReadings: { param: string; panel: string; acdb: string; unit: string; range: string; remarks: string }[];
  safetyChecklist: ({ type: "row"; sr: string; item: string; result: string; remark: string } | { type: "header"; label: string })[];
  meterDetails: string[][];
  acDetails: string[][];
  dgDetails: { sr: string; desc: string; obs: string; rec: string; risk: string }[];
  earthingDetails: string[][];
  upsDetails: string[][];
  luxLevels: string[][];
  riskRating: string[][];
  riskObservations: { level: "LOW" | "MEDIUM" | "HIGH"; items: string[] }[];
  loadSheet: { category: string; rows: { sr: string; equipment: string; tonnage: string; nos: string; wattage: string; total: string }[]; }[];
  loadTotals: { totalLoad: string; totalTonnage: string };
  observations: { sr: string; area: string; observation: string; recommendation: string; cost: string; priority: string }[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const AUDIT_DATA: Record<string, AuditReport> = {
  "AU-2024-131": {
    auditId: "AU-2024-131", auditDate: "27 Jul 2024", auditorName: "Mukteshwar Sharma",
    bank: "Canara Bank", bankCode: "CNRB", branchName: "MEERUT ABU LANE",
    branchCode: "0199", ifsc: "CNRB0000199",
    address: "187, Abu Lane, Meerut, Uttar Pradesh – 250001",
    city: "Meerut", district: "Meerut", state: "Uttar Pradesh", micr: "250015003",
    circle: "Agra", region: "Meerut", rbo: "RBO-5 MEERUT", lho: "LHO LUCKNOW",
    riskLevel: "MEDIUM", htlt: "LT", score: 72.4,
    beeReg: "BEE EA-613", elecSup: "Elec. Sup. No. 3096",
    overview: [
      ["Branch Code & Name", "0199 – MEERUT ABU LANE"],
      ["Bank Name", "Canara Bank"],
      ["IFSC Code", "CNRB0000199"],
      ["Address", "187, Abu Lane, Meerut, Uttar Pradesh – 250001"],
      ["Circle / Region", "Agra / Meerut"],
      ["RBO / LHO", "RBO-5 Meerut / LHO Lucknow"],
      ["Sanctioned Load", "15 KW"],
      ["Connected Load", "12.5 KW"],
      ["Total AC Tonnage", "6 TR (8 Years Old)"],
      ["Area of Branch", "Approx. 1800 Sq. Ft."],
      ["Audit Date", "27 Jul 2024"],
      ["Auditor", "Mukteshwar Sharma"],
    ],
    loadAnalysis: [
      { param: "Sanctioned Load", reading: "15", unit: "KW", range: "—", remarks: "As per EB sanction" },
      { param: "Connected Load", reading: "12.5", unit: "KW", range: "≤ Sanctioned", remarks: "Within limits" },
      { param: "Maximum Demand", reading: "10", unit: "KW", range: "—", remarks: "Normal" },
      { param: "Power Factor", reading: "0.85", unit: "—", range: "≥ 0.90", remarks: "Needs improvement" },
      { param: "Frequency", reading: "49.99", unit: "Hz", range: "49.5–50 Hz", remarks: "OK" },
    ],
    voltageReadings: [
      { param: "R-N", panel: "230", acdb: "229", unit: "V", range: "210–240 V", remarks: "Normal" },
      { param: "Y-N", panel: "229", acdb: "228", unit: "V", range: "210–240 V", remarks: "Normal" },
      { param: "B-N", panel: "231", acdb: "230", unit: "V", range: "210–240 V", remarks: "Normal" },
      { param: "R-Y", panel: "398", acdb: "397", unit: "V", range: "380–420 V", remarks: "Normal" },
      { param: "Y-B", panel: "400", acdb: "399", unit: "V", range: "380–420 V", remarks: "Normal" },
      { param: "R-B", panel: "401", acdb: "400", unit: "V", range: "380–420 V", remarks: "Normal" },
      { param: "N-E (Earthing)", panel: "1.2", acdb: "1.1", unit: "V", range: "0–3 V", remarks: "Acceptable" },
    ],
    currentReadings: [
      { param: "R Phase", panel: "18", acdb: "18", unit: "A", range: "—", remarks: "Unbalanced — see notes" },
      { param: "Y Phase", panel: "5", acdb: "5", unit: "A", range: "—", remarks: "Low — load unbalanced" },
      { param: "B Phase", panel: "16", acdb: "16", unit: "A", range: "—", remarks: "Normal" },
      { param: "Neutral", panel: "3", acdb: "3", unit: "A", range: "≤ 10% of max", remarks: "Acceptable" },
      { param: "Avg. Current", panel: "13", acdb: "13", unit: "A", range: "—", remarks: "—" },
    ],
    safetyChecklist: [
      { type: "row", sr: "1", item: "MCCBs/MCBs are provided with proper rating to cater the load", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "2", item: "ELCBs/RCCBs provided with proper rating", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "3", item: "Emergency and working lights provided in electrical rooms", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "4", item: "UPS room / electrical room maintained dry and in good condition", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "5", item: "Water seepage observed near any electrical panel, DB or equipment", result: "NO", remark: "NO SEEPAGE" },
      { type: "row", sr: "6", item: "Earthing pits provided and connected to equipment body", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "7", item: "Earthing pits properly maintained", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "8", item: "Proper exhaust fan in UPS/panel room; no scrap near DB/UPS/Batteries", result: "YES", remark: "WORKING" },
      { type: "row", sr: "9", item: "Penalty imposed in electricity bills (poor PF / higher load)", result: "NO", remark: "NA" },
      { type: "row", sr: "10", item: "Load distributed equally in all three phases; no loose/haphazard wiring", result: "NO", remark: "LOAD UNBALANCED" },
      { type: "row", sr: "11", item: "Isolating switch provided for non-essential loads and emergency main switch", result: "YES", remark: "MAIN MCCB INSTALLED" },
      { type: "row", sr: "12", item: "Electrical equipment of pantry properly connected with MCBs", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "13", item: "Preventive maintenance by licensed electrician / skilled technician", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "14", item: "Mechanical timers used for AC changeover in server room and signage", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "15", item: "Cables, conduits, DB boxes, panels properly covered and labelled", result: "NO", remark: "WIRE JOINTS OBSERVED" },
      { type: "header", label: "FIRE PREVENTION MEASURES" },
      { type: "row", sr: "16(i)", item: "Old records, broken furniture etc. cleared from premises", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "16(ii)", item: "Combustible waste / litter removed periodically", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "16(iii)", item: "No stationery / old items stored in UPS / server room", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "16(iv)", item: "Storage racks at ≥ 3 ft from electrical points / junction boxes", result: "YES", remark: "COMPLIED" },
      { type: "header", label: "SERVER AND UPS ROOM" },
      { type: "row", sr: "17(i)", item: "Server room has dual AC units with independent timer circuit", result: "NO", remark: "SINGLE AC" },
      { type: "row", sr: "17(ii)", item: "Metal body exhaust fan installed in UPS room", result: "YES", remark: "WORKING" },
      { type: "row", sr: "17(iii)", item: "LED lights installed in server/UPS room", result: "YES", remark: "COMPLIED" },
      { type: "header", label: "FIRE PROTECTION / EXTINGUISHERS" },
      { type: "row", sr: "18", item: "CO₂ fire extinguisher in UPS/server room – within validity", result: "YES", remark: "EXP: Aug 2026" },
      { type: "row", sr: "19", item: "Powder type extinguisher in banking hall – within validity", result: "YES", remark: "EXP: Aug 2026" },
      { type: "header", label: "DG SET" },
      { type: "row", sr: "20", item: "At least two 6 Kg ABC fire extinguishers near DG set", result: "YES", remark: "COMPLIED" },
      { type: "row", sr: "21", item: "Electrical safety awareness meeting conducted with staff after audit", result: "YES", remark: "DONE" },
    ],
    meterDetails: [
      ["Service Provider", "PVVNL"],
      ["Meter Type", "3-Phase Digital CT Meter"],
      ["Meter No.", "27001760"],
      ["Sanctioned Load", "15 KW"],
      ["Consumption (Units/Month)", "1,800 – 2,400 Units"],
      ["Average Bill / Month", "₹ 18,000 – 25,000"],
      ["Meter Status", "Functional"],
    ],
    acDetails: [
      ["No. of AC Units", "4"],
      ["Total AC Capacity", "6 TR"],
      ["AC Make", "Voltas / Blue Star"],
      ["AC Type", "Split"],
      ["Age of ACs", "8 Years"],
      ["AC Condition", "Good"],
    ],
    dgDetails: [
      { sr: "1", desc: "Is DG set on hiring or owned by bank?", obs: "OWNED", rec: "—", risk: "—" },
      { sr: "2", desc: "DG Set Capacity (KVA)", obs: "25 KVA", rec: "—", risk: "—" },
      { sr: "3", desc: "DG Set Make / OEM", obs: "Kirloskar", rec: "—", risk: "—" },
      { sr: "4", desc: "Is DG set with acoustic enclosure?", obs: "YES", rec: "—", risk: "LOW" },
      { sr: "5", desc: "No. of DG set batteries", obs: "1", rec: "—", risk: "—" },
      { sr: "6", desc: "Last service date", obs: "Jan 2024", rec: "Service every 6 months", risk: "MEDIUM" },
    ],
    earthingDetails: [
      ["No. of Earth Pits", "3"],
      ["Earth Pit 1 Resistance", "1.8 Ω"],
      ["Earth Pit 2 Resistance", "2.1 Ω (slightly high)"],
      ["Earth Pit 3 Resistance", "1.9 Ω"],
      ["Standard Acceptable Value", "< 2.0 Ω"],
      ["Last Testing Date", "Mar 2024"],
      ["UPS Earthing Resistance", "0.9 Ω"],
    ],
    upsDetails: [
      ["UPS Make", "APC / Numeric"],
      ["UPS Capacity", "10 KVA (Branch) + 2 KVA (ATM)"],
      ["Battery Make", "Exide"],
      ["No. & AH of Batteries", "42 AH × 17 Nos. (Branch)"],
      ["UPS Output Voltage", "229 V (Phase–Neutral)"],
      ["UPS Output Frequency", "49.9 Hz"],
      ["N-E Voltage at UPS Output", "1.1 V (OK, 0–3 V)"],
    ],
    luxLevels: [
      ["Lobby / Banking Hall", "320 Lux", "300 Lux", "Adequate"],
      ["Manager Cabin", "290 Lux", "300 Lux", "Slightly Low"],
      ["ATM Area", "350 Lux", "200 Lux", "Adequate"],
      ["Server / UPS Room", "280 Lux", "300 Lux", "Slightly Low"],
      ["Locker Room", "260 Lux", "200 Lux", "Adequate"],
    ],
    riskRating: [
      ["Electrical Wiring & Cabling", "B", "8", "Good"],
      ["Earthing System", "B+", "9", "Very Good"],
      ["Fire Safety & Protection", "B", "8", "Good"],
      ["UPS & Battery System", "A", "10", "Excellent"],
      ["DG Set & Maintenance", "B", "8", "Good"],
      ["Panel & Distribution Board", "B+", "9", "Very Good"],
      ["Load Balancing", "C", "6", "Needs Improvement"],
      ["Overall Score", "MEDIUM", "72.4 / 100", "—"],
    ],
    riskObservations: [
      { level: "LOW", items: [
        "Contact numbers of electrician, EB company, UPS/AC vendor must be displayed in UPS / control room.",
        "SLD of the electrical distribution in the branch to be displayed in UPS/control room.",
      ]},
      { level: "MEDIUM", items: [
        "Load distribution is unequal over three phases (R=18A, Y=5A, B=16A). Load balancing is recommended by redistribution of connected load equally over all three phases to avoid overloading/overheating.",
        "Wire joints with taping were observed near AC connection. Eliminate taped joints and provide proper terminal connections using approved connectors complying with IS standards.",
        "Earth pit no. 2 resistance (2.1 Ω) is slightly above the acceptable limit of 2.0 Ω. GEM compound to be added to improve earthing.",
        "Power factor (0.85) is below recommended value of 0.90. Power factor correction capacitor bank to be installed.",
      ]},
      { level: "HIGH", items: [] },
    ],
    loadSheet: [
      { category: "Lighting Load", rows: [
        { sr: "1", equipment: "Flush Lights 2×2 LED", tonnage: "—", nos: "14", wattage: "36", total: "504" },
        { sr: "2", equipment: "Down Lights LED", tonnage: "—", nos: "8", wattage: "12", total: "96" },
        { sr: "3", equipment: "LED Batten / T-Bar", tonnage: "—", nos: "10", wattage: "22", total: "220" },
      ]},
      { category: "Fans", rows: [
        { sr: "4", equipment: "Ceiling Fans", tonnage: "—", nos: "4", wattage: "100", total: "400" },
        { sr: "5", equipment: "Exhaust Fans", tonnage: "—", nos: "2", wattage: "150", total: "300" },
      ]},
      { category: "Power Load", rows: [
        { sr: "6", equipment: "Water Cooler / Purifier", tonnage: "—", nos: "2", wattage: "200", total: "400" },
        { sr: "7", equipment: "TV / Display", tonnage: "—", nos: "2", wattage: "250", total: "500" },
        { sr: "8", equipment: "Induction / Pantry", tonnage: "—", nos: "1", wattage: "700", total: "700" },
        { sr: "9", equipment: "Cheque Kiosk / Passbook M/C", tonnage: "—", nos: "2", wattage: "150", total: "300" },
      ]},
      { category: "UPS Load", rows: [
        { sr: "10", equipment: "Computers (PCs)", tonnage: "—", nos: "8", wattage: "150", total: "1200" },
        { sr: "11", equipment: "Printers / Scanners", tonnage: "—", nos: "4", wattage: "100", total: "400" },
        { sr: "12", equipment: "ATM / CDM / Passbook", tonnage: "—", nos: "2", wattage: "—", total: "1400" },
        { sr: "13", equipment: "Networking / CCTV / Alarm", tonnage: "—", nos: "1", wattage: "—", total: "800" },
        { sr: "14", equipment: "UPS Loss (10%)", tonnage: "—", nos: "—", wattage: "—", total: "380" },
      ]},
      { category: "Air Conditioning Load", rows: [
        { sr: "15", equipment: "Split AC 1.5 TR", tonnage: "1.5", nos: "2", wattage: "1450", total: "2900" },
        { sr: "16", equipment: "Split AC 1 TR (Server Room)", tonnage: "1", nos: "2", wattage: "943", total: "1886" },
      ]},
    ],
    loadTotals: { totalLoad: "12,386 W (12.4 KW)", totalTonnage: "6 TR" },
    observations: [
      { sr: "1", area: "Electrical Panel", observation: "Load distribution unequal over three phases (R=18A, Y=5A, B=16A)", recommendation: "Redistribute connected load equally across all three phases", cost: "₹ 1,500", priority: "High" },
      { sr: "2", area: "AC Connection", observation: "Wire joints with taping observed near AC input terminals", recommendation: "Replace taped joints with proper approved terminal connectors", cost: "₹ 2,500", priority: "High" },
      { sr: "3", area: "Earth Pit 2", observation: "Earthing resistance 2.1 Ω (above 2 Ω limit)", recommendation: "Add GEM compound / charcoal-salt treatment to improve earthing", cost: "₹ 1,500", priority: "Medium" },
      { sr: "4", area: "Power Factor", observation: "Power factor 0.85, below recommended 0.90", recommendation: "Install 5 KVAR APFC capacitor bank at main panel", cost: "₹ 12,000", priority: "Medium" },
    ],
  },
};

const FALLBACK = AUDIT_DATA["AU-2024-131"];

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
:root{--brand:#078da7;--brand-dark:#075d70;--brand-light:#eaf5f7;--ink:#17252d;--line:#cdd9dd;--success:#17845b}
*{margin:0;padding:0;box-sizing:border-box;font-family:'Times New Roman',Times,serif;color:var(--ink)}
.report-wrap{background:#e8ecee;min-height:100vh;padding:20px 0 40px}
.print-toolbar{position:fixed;right:20px;top:16px;z-index:9999;display:flex;gap:8px;font-family:Arial,sans-serif}
.print-toolbar button{border:0;border-radius:8px;padding:10px 18px;color:#fff;font-size:13px;font-weight:700;cursor:pointer}
.btn-print{background:linear-gradient(135deg,var(--brand-dark),var(--brand));box-shadow:0 4px 14px rgba(0,65,80,.25)}
.btn-close{background:#374151}
.report{width:210mm;margin:auto}

/* ── Page (each block = one A4 page) ── */
.page{width:210mm;min-height:297mm;background:#fff;position:relative;padding:12mm 14mm 18mm;margin-bottom:6px;box-shadow:0 2px 12px rgba(0,0,0,.10);display:flex;flex-direction:column}
.page-break{break-before:page;page-break-before:always}

/* ── Section title ── */
.sec-title{font-size:13pt;font-weight:bold;text-align:center;text-decoration:underline;text-transform:uppercase;margin-bottom:5mm;letter-spacing:.3px;font-family:Arial,Helvetica,sans-serif;color:var(--brand-dark)}
.sec-subtitle{font-size:10pt;font-weight:bold;text-align:center;margin-bottom:3mm;color:#374151;font-family:Arial,sans-serif}
.sec-label{font-size:10pt;font-weight:bold;margin:4mm 0 2mm;color:#17252d;font-family:Arial,sans-serif;border-left:3px solid var(--brand);padding-left:4px}

/* ── Tables ── */
.rt{width:100%;border-collapse:collapse;margin-bottom:4mm;font-size:9.5pt}
.rt th{border:1px solid #000;padding:2mm 3mm;background:#d9d9d9;font-weight:bold;text-align:center;vertical-align:middle;font-size:9pt}
.rt td{border:1px solid #000;padding:2mm 3mm;vertical-align:top;line-height:1.4}
.rt td.lbl{font-weight:bold;width:42%;background:#f5f5f5}
.rt td.c{text-align:center;vertical-align:middle}
.rt td.l{text-align:left}
.rt .sub-hdr td{background:#e8e8e8;font-weight:bold;font-size:9pt;text-align:center;letter-spacing:.3px}
.rt .total-row td{background:#e0e0e0;font-weight:bold}

/* ── Cover ── */
.cover{padding:14mm 16mm;display:flex;flex-direction:column;align-items:center;text-align:center}
.cover .c-title{font-size:18pt;font-weight:bold;text-decoration:underline;margin-bottom:2mm;font-family:Arial,sans-serif}
.cover .c-year{font-size:14pt;font-weight:bold;margin-bottom:6mm;font-family:Arial,sans-serif}
.cover .c-logo{width:42mm;height:42mm;border-radius:50%;border:3px solid #000;display:flex;align-items:center;justify-content:center;margin:0 auto 6mm;overflow:hidden}
.cover .c-rbo{font-size:10.5pt;font-weight:bold;margin-bottom:6mm;line-height:1.7;font-family:Arial,sans-serif}
.cover .c-branch-box{border:2px solid #000;padding:5mm 10mm;width:100%;text-align:left;font-size:10.5pt;line-height:2;margin-bottom:6mm}
.cover .c-branch-box .lbl{font-weight:bold}
.cover .c-auditor-box{border-top:1px solid #555;padding-top:5mm;font-size:9.5pt;text-align:center;line-height:1.8;width:100%}
.cover .c-auditor-box .co-name{font-weight:bold;font-size:11pt;font-family:Arial,sans-serif}

/* ── Risk boxes ── */
.risk-box{border:1.5px solid #000;padding:3mm 4mm;margin-bottom:3mm;font-size:9pt;font-weight:bold;border-radius:2px}
.risk-box.low{background:#c6efce;color:#276221}
.risk-box.medium{background:#ffeb9c;color:#7d5a00}
.risk-box.high{background:#ffc7ce;color:#9c0006}
.risk-box.na{background:#f2f2f2;color:#666}
.risk-box .risk-label{font-size:10pt;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:2mm}
.obs-list{margin-left:5mm;font-size:9pt;font-weight:normal;line-height:1.7}
.obs-list li{margin-bottom:1mm}

/* ── Signature ── */
.sig-row{display:flex;justify-content:space-between;margin-top:8mm;font-size:9pt}
.sig-block{text-align:center;min-width:55mm}
.sig-block .sig-line{border-top:1px solid #000;margin-top:10mm;padding-top:2mm;font-size:8.5pt;line-height:1.6}
.score-box{border:2px solid var(--brand-dark);border-radius:4px;padding:4mm 8mm;text-align:center;font-size:14pt;font-weight:bold;color:var(--brand-dark);font-family:Arial,sans-serif}

/* ── Page footer ── */
.page-footer{position:absolute;bottom:5mm;left:14mm;right:14mm;border-top:1px solid #bbb;padding-top:2mm;display:flex;justify-content:space-between;font-size:7.5pt;color:#666;font-family:Arial,sans-serif}

/* ── Misc ── */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-bottom:4mm}
.photo-ph{border:1px dashed #aaa;display:flex;align-items:center;justify-content:center;min-height:36mm;font-size:8pt;color:#aaa;border-radius:3px;margin-bottom:3mm;font-family:Arial,sans-serif;font-style:italic}

@page{size:A4;margin:0}
@media print{
  html,body,.report-wrap{background:#fff;padding:0;margin:0}
  .print-toolbar{display:none!important}
  .report{width:auto;margin:0}
  .page{box-shadow:none;margin-bottom:0;page-break-after:always;min-height:297mm}
  .page:last-child{page-break-after:auto}
}
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const PageFooter = ({ d }: { d: AuditReport }) => (
  <div className="page-footer">
    <span>SAVE EARTH ENERGY PVT. LTD. | {d.beeReg} | {d.elecSup}</span>
    <span>Branch: {d.branchName} – {d.branchCode} | Audit Date: {d.auditDate}</span>
  </div>
);

// ── Save Earth SVG Logo ───────────────────────────────────────────────────────
const SaveEarthLogo = () => (
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ width: "38mm", height: "38mm" }}>
    <circle cx="60" cy="60" r="56" fill="none" stroke="#000" strokeWidth="2"/>
    <polygon points="70,20 45,62 62,62 50,100 80,52 62,52 75,20" fill="#2e7d32" stroke="#000" strokeWidth="1"/>
    <path d="M20,80 Q60,30 100,80" fill="none" stroke="#2e7d32" strokeWidth="2.5"/>
    <text x="60" y="112" fontFamily="Arial" fontSize="7" textAnchor="middle" fontWeight="bold">SAVE EARTH ENERGY</text>
  </svg>
);

// ── Page Component ─────────────────────────────────────────────────────────────
export default function AuditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const d = AUDIT_DATA[id] ?? FALLBACK;

  useEffect(() => {
    document.title = `Electrical Audit Report — ${d.branchName} | ${d.bank}`;
  }, [d.branchName, d.bank]);

  const riskBg = d.riskLevel === "HIGH" ? "#ffc7ce" : d.riskLevel === "MEDIUM" ? "#ffeb9c" : "#c6efce";
  const riskCol = d.riskLevel === "HIGH" ? "#9c0006" : d.riskLevel === "MEDIUM" ? "#7d5a00" : "#276221";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Toolbar */}
      <div className="print-toolbar">
        <button className="btn-print" onClick={() => window.print()}>🖨 Print / Download PDF</button>
        <button className="btn-close" onClick={() => window.close()}>✕ Close</button>
      </div>

      <div className="report-wrap">
        <div className="report">

          {/* ══ PAGE 1 — COVER ══════════════════════════════════════════════ */}
          <div className="page">
            <div className="cover">
              <div className="c-title">ELECTRICAL AUDIT REPORT</div>
              <div className="c-year">2024–25</div>
              <div className="c-logo"><SaveEarthLogo /></div>
              <div className="c-rbo">{d.rbo} &nbsp;|&nbsp; {d.circle} &nbsp;|&nbsp; {d.lho}</div>
              <div className="c-branch-box">
                <div><span className="lbl">BRANCH: &nbsp;</span>{d.branchName}</div>
                <div><span className="lbl">BRANCH CODE: &nbsp;</span>{d.branchCode}</div>
                <div><span className="lbl">IFSC CODE: &nbsp;</span>{d.ifsc}</div>
                <div style={{ marginTop: "2mm" }}>
                  <span className="lbl">ADDRESS: &nbsp;</span>{d.address}
                </div>
                <div style={{ marginTop: "2mm" }}>
                  <span className="lbl">RISK LEVEL: &nbsp;</span>
                  <span style={{ background: riskBg, color: riskCol, padding: "1px 10px", borderRadius: "3px", fontWeight: "bold" }}>
                    {d.riskLevel}
                  </span>
                  &nbsp;&nbsp;
                  <span className="lbl">AUDIT SCORE: &nbsp;</span>
                  <span style={{ color: riskCol, fontWeight: "bold" }}>{d.score} / 100</span>
                </div>
              </div>
              <div className="c-auditor-box">
                <div style={{ marginBottom: "2mm" }}>Audited by:</div>
                <div className="co-name">SAVE EARTH ENERGY PRIVATE LIMITED</div>
                <div>BEE CERTIFIED ENERGY AUDITOR</div>
                <div>CONSULTANT FOR NRE, ELECTRICAL PROJECTS</div>
                <div style={{ marginTop: "3mm", borderTop: "1px solid #aaa", paddingTop: "3mm", fontSize: "9pt", color: "#555" }}>
                  B-66 Kasturba Nagar, Bhopal – 462023 &nbsp;|&nbsp; PH: 0755-4206768, 9644174447<br />
                  E: savearthenergy@gmail.com
                </div>
                <div style={{ marginTop: "2mm", fontSize: "8pt", color: "#888" }}>
                  {d.beeReg} &nbsp;|&nbsp; {d.elecSup}
                </div>
              </div>
            </div>
            <PageFooter d={d} />
          </div>

          {/* ══ PAGE 2 — BRANCH OVERVIEW + LOAD ANALYSIS ═══════════════════ */}
          <div className="page page-break">
            <div className="sec-title">Annexure-I — Branch / Office Overview</div>
            <table className="rt">
              <tbody>
                {d.overview.map(([label, value], i) => (
                  <tr key={i}><td className="lbl">{label}</td><td>{value}</td></tr>
                ))}
              </tbody>
            </table>

            <div className="sec-label">Electrical Load Analysis</div>
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>Parameter</th>
                  <th style={{ width: "15%" }}>Reading</th>
                  <th style={{ width: "10%" }}>Unit</th>
                  <th style={{ width: "22%" }}>Normal Range</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {d.loadAnalysis.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: "bold" }}>{r.param}</td>
                    <td className="c">{r.reading}</td>
                    <td className="c">{r.unit}</td>
                    <td className="c">{r.range}</td>
                    <td>{r.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PageFooter d={d} />
          </div>

          {/* ══ PAGE 3 — VOLTAGE + CURRENT READINGS ════════════════════════ */}
          <div className="page page-break">
            <div className="sec-title">Electrical Parameters Recorded at Site</div>

            <div className="sec-label">Voltage Readings</div>
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ width: "16%" }}>Test Point</th>
                  <th style={{ width: "18%" }}>Reading at Panel / Meter</th>
                  <th style={{ width: "18%" }}>Reading at ACDB</th>
                  <th style={{ width: "10%" }}>Unit</th>
                  <th style={{ width: "20%" }}>Normal Range</th>
                  <th>Observations / Remarks</th>
                </tr>
              </thead>
              <tbody>
                {d.voltageReadings.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: "bold" }}>{r.param}</td>
                    <td className="c">{r.panel}</td>
                    <td className="c">{r.acdb}</td>
                    <td className="c">{r.unit}</td>
                    <td className="c">{r.range}</td>
                    <td>{r.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sec-label">Current Readings</div>
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ width: "16%" }}>Test Point</th>
                  <th style={{ width: "18%" }}>Reading at Panel / Meter</th>
                  <th style={{ width: "18%" }}>Reading at ACDB</th>
                  <th style={{ width: "10%" }}>Unit</th>
                  <th style={{ width: "20%" }}>Normal Range</th>
                  <th>Observations / Remarks</th>
                </tr>
              </thead>
              <tbody>
                {d.currentReadings.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: "bold" }}>{r.param}</td>
                    <td className="c">{r.panel}</td>
                    <td className="c">{r.acdb}</td>
                    <td className="c">{r.unit}</td>
                    <td className="c">{r.range}</td>
                    <td>{r.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PageFooter d={d} />
          </div>

          {/* ══ PAGE 4 — SAFETY CHECKLIST ═══════════════════════════════════ */}
          <div className="page page-break">
            <div className="sec-title">Annexure-I — Electrical Safety Checklist</div>
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ width: "7%" }}>Sr. No.</th>
                  <th style={{ width: "55%" }}>Description</th>
                  <th style={{ width: "10%" }}>Details</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {d.safetyChecklist.map((row, i) => {
                  if (row.type === "header") {
                    return (
                      <tr key={i} className="sub-hdr">
                        <td colSpan={4}>{row.label}</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={i}>
                      <td className="c">{row.sr}</td>
                      <td>{row.item}</td>
                      <td className="c" style={{ fontWeight: "bold", color: row.result === "YES" ? "#276221" : row.result === "NO" ? "#9c0006" : "#555" }}>{row.result}</td>
                      <td>{row.remark}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <PageFooter d={d} />
          </div>

          {/* ══ PAGE 5 — UPS + METER + AC + DG ═════════════════════════════ */}
          <div className="page page-break">
            <div className="sec-title">UPS, Meter, AC & DG Set Details</div>

            <div className="two-col">
              <div>
                <div className="sec-label">UPS & Battery Details</div>
                <table className="rt">
                  <tbody>
                    {d.upsDetails.map(([label, value], i) => (
                      <tr key={i}><td className="lbl">{label}</td><td>{value}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="sec-label">Meter Details</div>
                <table className="rt">
                  <tbody>
                    {d.meterDetails.map(([label, value], i) => (
                      <tr key={i}><td className="lbl">{label}</td><td>{value}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sec-label">Air Conditioning Details</div>
            <table className="rt">
              <tbody>
                {d.acDetails.map(([label, value], i) => (
                  <tr key={i}><td className="lbl">{label}</td><td>{value}</td></tr>
                ))}
              </tbody>
            </table>

            <div className="sec-label">DG Set</div>
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ width: "6%" }}>S.No.</th>
                  <th style={{ width: "34%" }}>Description</th>
                  <th style={{ width: "26%" }}>Observations / Remarks</th>
                  <th style={{ width: "26%" }}>Recommendations</th>
                  <th style={{ width: "8%" }}>Risk</th>
                </tr>
              </thead>
              <tbody>
                {d.dgDetails.map((r, i) => (
                  <tr key={i}>
                    <td className="c">{r.sr}</td>
                    <td>{r.desc}</td>
                    <td className="c">{r.obs}</td>
                    <td>{r.rec}</td>
                    <td className="c" style={{ fontWeight: "bold", color: r.risk === "HIGH" ? "#9c0006" : r.risk === "MEDIUM" ? "#7d5a00" : "#276221" }}>{r.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PageFooter d={d} />
          </div>

          {/* ══ PAGE 6 — EARTHING + LUX + RISK RATING ══════════════════════ */}
          <div className="page page-break">
            <div className="sec-title">Earthing, Lux Levels & Risk Rating</div>

            <div className="two-col">
              <div>
                <div className="sec-label">Earthing Details</div>
                <table className="rt">
                  <tbody>
                    {d.earthingDetails.map(([label, value], i) => (
                      <tr key={i}><td className="lbl">{label}</td><td>{value}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="sec-label">Lux Levels</div>
                <table className="rt">
                  <thead>
                    <tr><th>Area</th><th>Measured</th><th>Required</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {d.luxLevels.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="c">{c}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sec-label">Risk Rating of Branch on Basis of Electricity</div>
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ width: "42%" }}>Parameter</th>
                  <th style={{ width: "12%" }}>Grade</th>
                  <th style={{ width: "20%" }}>Score</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {d.riskRating.map((r, i) => (
                  <tr key={i} style={i === d.riskRating.length - 1 ? { background: "#e0e0e0", fontWeight: "bold" } : {}}>
                    <td style={{ fontWeight: i === d.riskRating.length - 1 ? "bold" : "normal" }}>{r[0]}</td>
                    <td className="c" style={{ fontWeight: "bold", color: "#075d70" }}>{r[1]}</td>
                    <td className="c">{r[2]}</td>
                    <td>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PageFooter d={d} />
          </div>

          {/* ══ PAGE 7 — BRANCH LOAD SHEET ══════════════════════════════════ */}
          <div className="page page-break">
            <div className="sec-title">Branch Load Sheet</div>
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>S.No.</th>
                  <th style={{ width: "32%" }}>Equipment Installed</th>
                  <th style={{ width: "10%" }}>Tonnage</th>
                  <th style={{ width: "7%" }}>Nos.</th>
                  <th style={{ width: "13%" }}>Wattage (W)</th>
                  <th style={{ width: "15%" }}>Total (W)</th>
                  <th>Distributed Load</th>
                </tr>
              </thead>
              <tbody>
                {d.loadSheet.map((cat, ci) => (
                  <React.Fragment key={ci}>
                    <tr className="sub-hdr"><td colSpan={7}>{cat.category}</td></tr>
                    {cat.rows.map((r, ri) => (
                      <tr key={ri}>
                        <td className="c">{r.sr}</td>
                        <td className="l">{r.equipment}</td>
                        <td className="c">{r.tonnage}</td>
                        <td className="c">{r.nos}</td>
                        <td className="c">{r.wattage}</td>
                        <td className="c">{r.total}</td>
                        <td>—</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                <tr className="total-row">
                  <td colSpan={2}>Total Tonnage: <strong>{d.loadTotals.totalTonnage}</strong></td>
                  <td colSpan={5}>Total Connected Load: <strong>{d.loadTotals.totalLoad}</strong></td>
                </tr>
              </tbody>
            </table>
            <PageFooter d={d} />
          </div>

          {/* ══ PAGE 8 — PHOTOGRAPHS (THERMAL) ═════════════════════════════ */}
          <div className="page page-break">
            <div className="sec-title">Photographs of Thermal Image</div>
            <div className="two-col">
              <div><div className="photo-ph">📷 Thermal — Main Panel</div></div>
              <div><div className="photo-ph">📷 Thermal — UPS / Battery</div></div>
            </div>
            <div className="two-col">
              <div><div className="photo-ph">📷 Thermal — Distribution Board</div></div>
              <div><div className="photo-ph">📷 Thermal — Cable Terminations</div></div>
            </div>

            <div className="sec-title" style={{ marginTop: "5mm" }}>Photographs of Main Electric Panels & UPS Room</div>
            <div className="two-col">
              <div><div className="photo-ph">📷 Main Incoming Panel</div></div>
              <div><div className="photo-ph">📷 Distribution Board</div></div>
            </div>
            <div className="two-col">
              <div><div className="photo-ph">📷 UPS Room</div></div>
              <div><div className="photo-ph">📷 Earthing Pit / DG Set</div></div>
            </div>
            <PageFooter d={d} />
          </div>

          {/* ══ PAGE 9 — AUDIT OBSERVATIONS (RISK BOXES) ═══════════════════ */}
          <div className="page page-break">
            <div className="sec-title">Overview of Audit Observations & Proposed Rectification Works</div>

            <table className="rt">
              <thead>
                <tr>
                  <th style={{ width: "26%" }}>Branch Status</th>
                  <th style={{ width: "44%" }}>Observations & Proposed Rectification Work</th>
                  <th style={{ width: "30%" }}>Photographs</th>
                </tr>
              </thead>
              <tbody>
                {d.riskObservations.map((obs, i) => {
                  const cls = obs.level === "HIGH" ? "high" : obs.level === "MEDIUM" ? "medium" : "low";
                  const labels: Record<string, string> = {
                    LOW: "All electrical installations are within safety limits",
                    MEDIUM: "Requires improvement on electrical safety aspects",
                    HIGH: "Immediate action to be taken on electrical installations",
                  };
                  return (
                    <tr key={i}>
                      <td style={{ verticalAlign: "middle" }}>
                        <div className={`risk-box ${cls}`}>
                          <span className="risk-label">{obs.level} RISK</span>
                          {labels[obs.level]}
                          {obs.items.length === 0 && <div style={{ marginTop: "2mm", textAlign: "center" }}>NA</div>}
                        </div>
                      </td>
                      <td>
                        {obs.items.length > 0
                          ? <ol className="obs-list">{obs.items.map((item, j) => <li key={j}>{item}</li>)}</ol>
                          : <span style={{ color: "#aaa" }}>—</span>
                        }
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        <div style={{ border: "1px dashed #aaa", minHeight: "28mm", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8pt", color: "#aaa", fontStyle: "italic" }}>[ Photo ]</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <PageFooter d={d} />
          </div>

          {/* ══ PAGE 10 — SPECIAL OBSERVATIONS + SLD ═══════════════════════ */}
          <div className="page page-break">
            <div className="sec-title">Special Observations & Estimated Compliance Cost</div>
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>Sr.</th>
                  <th style={{ width: "14%" }}>Area</th>
                  <th style={{ width: "30%" }}>Observation</th>
                  <th style={{ width: "30%" }}>Recommendation</th>
                  <th style={{ width: "10%" }}>Est. Cost</th>
                  <th style={{ width: "11%" }}>Priority</th>
                </tr>
              </thead>
              <tbody>
                {d.observations.map((r, i) => (
                  <tr key={i}>
                    <td className="c">{r.sr}</td>
                    <td>{r.area}</td>
                    <td>{r.observation}</td>
                    <td>{r.recommendation}</td>
                    <td className="c">{r.cost}</td>
                    <td className="c" style={{ fontWeight: "bold", color: r.priority === "High" ? "#9c0006" : "#7d5a00" }}>{r.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sec-label">SLD — Single Line Diagram</div>
            <div style={{ border: "1.5px solid #000", minHeight: "80mm", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10pt", color: "#aaa", fontStyle: "italic", marginBottom: "5mm" }}>
              📐 SLD Image will be displayed here
            </div>

            {/* Signature row */}
            <div className="sig-row">
              <div className="sig-block">
                <div className="sig-line">
                  Signature of Certified Auditor<br/>
                  <span style={{ fontSize: "8pt" }}>SAVE EARTH ENERGY PVT. LTD.<br />{d.beeReg} | {d.elecSup}</span>
                </div>
              </div>
              <div className="sig-block">
                <div style={{ textAlign: "center" }}>
                  <div className="score-box">{d.score} / 100</div>
                  <div style={{ fontSize: "8pt", marginTop: "2mm", color: "#555" }}>Audit Score</div>
                </div>
              </div>
              <div className="sig-block">
                <div className="sig-line">
                  Signature of Branch Representative<br/>
                  <span style={{ fontSize: "8pt" }}>Branch: {d.branchName}<br/>Date: {d.auditDate}</span>
                </div>
              </div>
            </div>

            <PageFooter d={d} />
          </div>

        </div>
      </div>
    </>
  );
}
