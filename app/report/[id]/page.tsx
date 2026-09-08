"use client";
import React, { useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface CheckRow { type: "row"; sr: string; item: string; result: string; remark: string }
interface CheckHeader { type: "header"; label: string }
type CheckItem = CheckRow | CheckHeader;

interface LoadRow { sr: string; equipment: string; tonnage: string; nos: string; wattage: string; total: string }
interface LoadCat { category: string; rows: LoadRow[] }

interface AuditReport {
  auditId: string; auditDate: string; auditorName: string;
  bank: string; branchName: string; branchCode: string; ifsc: string;
  address: string; city: string; district: string; state: string;
  micr: string; circle: string; region: string; rbo: string; lho: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH"; htlt: string; score: number;
  beeReg: string; elecSup: string;
  bmName: string; sanctionedLoad: string; connectedLoad: string;
  avgBill: string; acTonnage: string; acAge: string; area: string;
  infoRows: string[][];
  checklist: CheckItem[];
  upsDetails: string[][];
  upsParams: { param: string; testPoint: string; reading: string; range: string; remarks: string }[];
  meterDetails: string[][];
  electricalParams: { param: string; testPoint: string; reading: string; range: string; remarks: string }[];
  dgSet: { sr: string; desc: string; obs: string; rec: string; risk: string }[];
  loadSheet: LoadCat[];
  loadTotals: { totalLoad: string; totalTonnage: string };
  riskObservations: { level: "LOW" | "MEDIUM" | "HIGH"; label: string; items: string[] }[];
  observations: { sr: string; area: string; obs: string; rec: string; cost: string; priority: string }[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const SAMPLE: AuditReport = {
  auditId: "AU-2024-131", auditDate: "27/07/2024", auditorName: "Mukteshwar Sharma",
  bank: "Canara Bank", branchName: "MEERUT ABU LANE", branchCode: "0199",
  ifsc: "CNRB0000199", address: "187, Abu Lane, Meerut, Uttar Pradesh – 250001",
  city: "Meerut", district: "Meerut", state: "Uttar Pradesh", micr: "250015003",
  circle: "Agra", region: "Meerut", rbo: "RBO-5 MEERUT", lho: "LHO LUCKNOW",
  riskLevel: "MEDIUM", htlt: "LT", score: 72.4,
  beeReg: "BEE EA-613", elecSup: "Elec. Sup. No. 3096",
  bmName: "Branch Manager",
  sanctionedLoad: "15 KW", connectedLoad: "12.5 KW",
  avgBill: "Rs. 18,000–25,000 / Month",
  acTonnage: "6 TR", acAge: "8 Years", area: "Approx. 1800 Sq. Ft.",
  infoRows: [
    ["Branch Code and Name", "0199 – MEERUT ABU LANE"],
    ["Address", "187, Abu Lane, Meerut, Uttar Pradesh – 250001"],
    ["BM PF No. and Name", "Branch Manager"],
    ["Sanctioned Load", "15 KW"],
    ["Connected Load", "12.5 KW"],
    ["Average Monthly Amount of Energy Bill (Approx.)", "Rs. 18,000–25,000 / Month"],
    ["Total Tonnage of Air Conditioners in Branch", "6 TR   How many years old?: 8 Years"],
    ["Area of the Branch", "Approx. 1800 Sq. Ft."],
  ],
  checklist: [
    { type: "row", sr: "1", item: "Whether MCCBs/MCBs are provided with proper rating to cater the load", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "2", item: "Whether ELCBs/RCCBs are provided with proper rating to cater the load", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "3", item: "Whether light and emergency light are provided in electrical rooms/operating areas for easy operation & maintenance works", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "4", item: "Whether Pump room, DG set room, UPS room, electrical room etc. are maintained dry and in good condition and obsolete/hazardous/old items are not dumped there", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "5", item: "Whether Water Seepage is observed near any of the Electrical Panel, Distribution Boards, Electrical equipment etc.", result: "NO", remark: "NO SEEPAGE" },
    { type: "row", sr: "6", item: "Whether Earthing pits are provided and connected to the equipment, Body of the connected equipment", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "7", item: "Whether the Earthing Pits are properly maintained", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "8", item: "Whether proper exhaust fan for ventilation of panel room/electrical room/UPS room is provided and paper, old materials or any other scrap kept near DB/Panels/UPS/Batteries etc. are not kept there.", result: "YES", remark: "WORKING" },
    { type: "row", sr: "9", item: "Whether Penalty is being imposed in electricity bills on account of higher load/poor power factor etc.", result: "NO", remark: "NA" },
    { type: "row", sr: "10", item: "Whether load is distributed in all three phases to avoid unbalancing of phases and no loose electrical connection/haphazard wirings observed in the Branch/office premises", result: "NO", remark: "LOAD UNBALANCED" },
    { type: "row", sr: "11", item: "Whether isolating switch is provided for the switching off of non-essential loads premises during night and main switch to switch off the power supply to the branch in case of Fire/emergency.", result: "YES", remark: "MAIN MCCB INSTALLED" },
    { type: "row", sr: "12", item: "Whether electrical equipments of pantry etc. are properly connected to iron socket box with MCBs.", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "13", item: "Whether proper preventive maintenance after opening of panel boards and distribution boards are carried out by the license holder Electrician or skilled technicians", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "14", item: "Whether mechanical timers used in the changeover of Air conditioners for server Room A/Cs and for Signage Boards to make auto ON/OFF", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "15", item: "Whether Preventive Maintenance of electric installation and equipment is carried out by skilled license holder electricians/skilled technician.", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "16", item: "General condition of electrical control panels, main switch, electric meter board and change over switch ACs, water cooler, water filter, wiring cables etc. is good and all DB's, Panels, switch boards are properly covered", result: "NO", remark: "WIRE JOINTS & TAPING OBSERVED" },
    { type: "row", sr: "17", item: "Whether the contact numbers of persons, electricians, power distribution company, Generator service provider, vendor, UPS vendors, ACs etc. are displayed in Electric room/UPS room", result: "NO", remark: "TO BE DISPLAYED" },
    { type: "row", sr: "18", item: "Whether the power factor panel of appropriate rating is installed", result: "NO", remark: "NOT INSTALLED" },
    { type: "header", label: "FIRE PREVENTION MEASURES" },
    { type: "row", sr: "19(i)", item: "All old disposable records, broken furniture etc. accumulated at the premises have been cleared.", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "19(ii)", item: "Combustible leaf, litter/waste papers etc in and around the branch is removed/cleaned periodically", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "19(iii)", item: "No stationary/Records/old obsolete items are stored/kept in the system/UPS room", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "19(iv)", item: "Storage racks in Stationery/Record room kept at a safe distance of at least 3 FEET from electrical points/switch/junction boxes", result: "YES", remark: "COMPLIED" },
    { type: "header", label: "SERVER AND UPS ROOM" },
    { type: "row", sr: "20(i)", item: "Server room has dual AC units having timer circuit device with independent circuit.", result: "NO", remark: "SINGLE AC INSTALLED" },
    { type: "row", sr: "20(ii)", item: "Whether metal body Exhaust fan installed in UPS room", result: "YES", remark: "WORKING" },
    { type: "row", sr: "20(iii)", item: "Whether LED lights have been installed in Server/UPS room", result: "YES", remark: "COMPLIED" },
    { type: "header", label: "FIRE PROTECTION / FIRE CONTROL EXTINGUISHERS AND FIRE ALARM SYSTEM" },
    { type: "row", sr: "21", item: "CO₂ fire extinguisher in UPS/server room – within validity", result: "YES", remark: "EXP. DATE – 17/08/2026" },
    { type: "row", sr: "22", item: "Powder type fire extinguisher in Banking Hall – within validity", result: "YES", remark: "EXP. DATE – 17/08/2026" },
    { type: "header", label: "DG SET / GENERATOR" },
    { type: "row", sr: "23", item: "At least two 6 Kg. ABC Capacity fire extinguishers are placed near the diesel generator", result: "YES", remark: "COMPLIED" },
    { type: "row", sr: "24", item: "Whether electrical safety and energy saving awareness meeting with the staff members conducted after electrical safety audit", result: "YES", remark: "DONE" },
  ],
  upsDetails: [
    ["UPS Make", "Branch: APC / Numeric | ATM: Numeric"],
    ["Capacity (KVA)", "Branch: 10 KVA | ATM: 2 KVA"],
    ["Phase", "Branch: 1-Phase | ATM: 1-Phase"],
    ["Battery Make", "Exide"],
    ["No. & AH of Batteries", "42 AH × 17 Nos. (Branch)  |  42 AH × 8 Nos. (ATM)"],
  ],
  upsParams: [
    { param: "INPUT VOLTAGE (V)", testPoint: "Phase to Neutral", reading: "232 V", range: "210–250 V", remarks: "—" },
    { param: "OUTPUT VOLTAGE (V)", testPoint: "Phase to Neutral", reading: "229 V", range: "210–230 V", remarks: "—" },
    { param: "CURRENT READING (A)", testPoint: "R Phase", reading: "2.5 A", range: "—", remarks: "—" },
    { param: "", testPoint: "Y Phase", reading: "—", range: "—", remarks: "—" },
    { param: "", testPoint: "B Phase", reading: "—", range: "—", remarks: "—" },
    { param: "", testPoint: "Avg. Current", reading: "2.2 A", range: "—", remarks: "—" },
    { param: "NEUTRAL TO EARTH VOLTAGE", testPoint: "—", reading: "1.1 V", range: "0–3 V OK", remarks: "—" },
  ],
  meterDetails: [
    ["Services Provider", "PVVNL"],
    ["Quantity", "1"],
    ["Sanctioned Load", "15 KW"],
    ["Type", "3-Phase Digital"],
    ["Meter No.", "27001760"],
    ["Consumption (Units) per Month", "1,800–2,400"],
    ["Average Bill per Month", "Rs. 18,000–25,000"],
  ],
  electricalParams: [
    { param: "VOLTAGE READING", testPoint: "R-Y", reading: "398 V", range: "380–420 V", remarks: "—" },
    { param: "", testPoint: "Y-B", reading: "400 V", range: "380–420 V", remarks: "—" },
    { param: "", testPoint: "B-R", reading: "401 V", range: "380–420 V", remarks: "—" },
    { param: "", testPoint: "R-N", reading: "230 V", range: "210–240 V", remarks: "—" },
    { param: "", testPoint: "Y-N", reading: "229 V", range: "210–240 V", remarks: "—" },
    { param: "", testPoint: "B-N", reading: "231 V", range: "210–240 V", remarks: "—" },
    { param: "CURRENT READING", testPoint: "R PHASE", reading: "18 A", range: "—", remarks: "LOAD BALANCING REQUIRED" },
    { param: "", testPoint: "Y PHASE", reading: "5 A", range: "—", remarks: "LOAD BALANCING REQUIRED" },
    { param: "", testPoint: "B PHASE", reading: "16 A", range: "—", remarks: "" },
    { param: "", testPoint: "AVG CURRENT", reading: "13 A", range: "—", remarks: "—" },
    { param: "FREQUENCY HZ", testPoint: "—", reading: "49.99", range: "49.5–50 Hz", remarks: "OK" },
    { param: "POWER FACTOR", testPoint: "PF", reading: "0.85", range: "≥ 0.90", remarks: "NEEDS IMPROVEMENT" },
    { param: "N-E VOLTAGE (Earthing)", testPoint: "—", reading: "1.2 V", range: "0–3 V", remarks: "OK" },
  ],
  dgSet: [
    { sr: "1", desc: "Is the DG set on hiring or owned by the Bank?", obs: "OWNED", rec: "—", risk: "—" },
    { sr: "2", desc: "DG set capacity KVA", obs: "25 KVA", rec: "—", risk: "—" },
    { sr: "3", desc: "DG set make OEM", obs: "Kirloskar", rec: "—", risk: "—" },
    { sr: "4", desc: "Is the DG set with Acoustic enclosure?", obs: "YES", rec: "—", risk: "LOW" },
    { sr: "5", desc: "No. of DG set Batteries", obs: "1", rec: "—", risk: "—" },
    { sr: "6", desc: "DG set Battery rating AH", obs: "150 AH", rec: "—", risk: "—" },
    { sr: "7", desc: "Last service date of DG set", obs: "Jan 2024", rec: "Service every 6 months", risk: "MEDIUM" },
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
      { sr: "12", equipment: "ATM / CDM / Passbook Machine", tonnage: "—", nos: "2", wattage: "—", total: "1400" },
      { sr: "13", equipment: "Networking / CCTV / Alarm", tonnage: "—", nos: "1", wattage: "—", total: "800" },
      { sr: "14", equipment: "UPS Loss (10% approx.)", tonnage: "—", nos: "—", wattage: "—", total: "380" },
    ]},
    { category: "Air Conditioning Load", rows: [
      { sr: "15", equipment: "Split AC 1.5 TR", tonnage: "1.5", nos: "2", wattage: "1450", total: "2900" },
      { sr: "16", equipment: "Split AC 1 TR (Server Room)", tonnage: "1", nos: "2", wattage: "943", total: "1886" },
    ]},
  ],
  loadTotals: { totalLoad: "12,386 W (12.4 KW)", totalTonnage: "6 TR" },
  riskObservations: [
    { level: "LOW", label: "All the Electrical installations are under safety limits", items: [
      "Contact numbers of persons, electricians, power distribution company, Generator service provider, vendor, UPS vendors, ACs etc. needs to be displayed in UPS/control room.",
      "SLD of the electrical distribution in the branch be displayed in UPS/control room.",
    ]},
    { level: "MEDIUM", label: "Requires improvement on Electrical safety aspects", items: [
      "Load distribution is observed unequal over three phases (R=18A, Y=5A, B=16A). Load balancing is recommended by redistribution of connected load equally over all three phases to avoid overloading/overheating of single phase.",
      "Wire joints with taping were observed at Panel & AC Connection, which may lead to loose connections, overheating, and potential fire hazards. It is recommended to eliminate taped joints and provide proper terminal connections using approved connectors.",
      "Earth pit no. 2 resistance (2.1 Ω) is slightly above the acceptable limit of 2.0 Ω. GEM compound to be added to improve earthing resistance.",
      "Power factor (0.85) is below recommended value of 0.90. Power factor correction capacitor bank of 5 KVAR to be installed at main panel.",
    ]},
    { level: "HIGH", label: "Immediate action to be taken on Electrical installations", items: [] },
  ],
  observations: [
    { sr: "1", area: "Main Panel", obs: "Load distribution unequal over three phases (R=18A, Y=5A, B=16A)", rec: "Redistribute connected load equally across all three phases", cost: "Rs. 1,500", priority: "HIGH" },
    { sr: "2", area: "AC Connection", obs: "Wire joints with taping observed near AC input terminals", rec: "Replace taped joints with proper approved terminal connectors", cost: "Rs. 2,500", priority: "HIGH" },
    { sr: "3", area: "Earthing Pit 2", obs: "Earthing resistance 2.1 Ω – above 2 Ω limit", rec: "Add GEM compound / charcoal-salt treatment", cost: "Rs. 1,500", priority: "MEDIUM" },
    { sr: "4", area: "Power Factor", obs: "Power factor 0.85, below recommended 0.90", rec: "Install 5 KVAR APFC capacitor bank at main panel", cost: "Rs. 12,000", priority: "MEDIUM" },
  ],
};

const PALDI: AuditReport = {
  auditId: "AU-2024-132", auditDate: "10/11/2025", auditorName: "Save Earth Energy",
  bank: "SBI", branchName: "PALDI", branchCode: "5306", ifsc: "SBIN0005306",
  address: "OPP, KOCHRAB, ASHRAM, NR. BONY TRAVELS, PALDI AHMEDABAD, GUJRAT PINCODE - 380006",
  city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", micr: "",
  circle: "AO- AHMEDABAD", region: "RBO-3 AHMEDABAD", rbo: "RBO-3 AHMEDABAD", lho: "LHO- AHMEDABAD",
  riskLevel: "MEDIUM", htlt: "LT", score: 46.1,
  beeReg: "BEE EA-613", elecSup: "Elec. Sup. No. 3096",
  bmName: "Branch Manager",
  sanctionedLoad: "21.780 KW", connectedLoad: "15.795 KW",
  avgBill: "Rs. 20–40 K / Month",
  acTonnage: "6.5 TR", acAge: "8 Years", area: "Approx. 2000 Sq. Feet",
  infoRows: [
    ["Branch Code and Name", "5306 – PALDI"],
    ["Address", "OPP, KOCHRAB, ASHRAM, NR. BONY TRAVELS, PALDI AHMEDABAD, GUJARAT PINCODE – 380006"],
    ["BM PF No. and Name", "BRANCH MANAGER"],
    ["Sanctioned load", "21.780 KW"],
    ["Connected load", "15.795 KW"],
    ["Average Monthly amount of energy bill (Approx.)", "Rs- 20-40 K /- per Month"],
    ["Total tonnage of Air Conditioners in branch", "6.5 TR (Tonnage of Refrigeration)   How many years old?: 8 Years"],
    ["Area of the Branch", "Approx. 2000 Sq. Feet"],
  ],
  checklist: SAMPLE.checklist,
  upsDetails: SAMPLE.upsDetails,
  upsParams: SAMPLE.upsParams,
  meterDetails: SAMPLE.meterDetails,
  electricalParams: SAMPLE.electricalParams,
  dgSet: SAMPLE.dgSet,
  loadSheet: SAMPLE.loadSheet,
  loadTotals: { totalLoad: "15,795 W (15.795 KW)", totalTonnage: "6.5 TR" },
  riskObservations: SAMPLE.riskObservations,
  observations: SAMPLE.observations,
};

const AUDIT_DATA: Record<string, AuditReport> = {
  "AU-2024-131": SAMPLE,
  "AU-2024-132": PALDI,
};

// ── CSS — exact PALDI style ───────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  @page { size: A4; margin: 0; }

  /* Only override what the Vyzor theme actually breaks — font & background */
  #rpt {
    display: block !important;
    font-family: 'Inter', Arial, sans-serif !important;
    font-size: 13pt !important;
    font-weight: 400 !important;
    color: #000 !important;
    background: #f1f5f9;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    padding: 10mm 0;
  }
  #rpt * { font-family: 'Inter', Arial, sans-serif !important; box-sizing: border-box; }
  #rpt strong, #rpt b { font-weight: 700 !important; }
  #rpt ol { list-style: decimal !important; padding-left: 4mm !important; }
  #rpt ol li { display: list-item !important; }

  @media print {
    html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
    #rpt { background: #fff !important; padding: 0 !important; }
    #rpt .rp { page-break-after: always !important; width: 210mm !important; margin: 0 !important; box-shadow: none !important; }
    .toolbar { display: none !important; }
    .no-break { page-break-inside: avoid; }
  }

  /* ── Pages ── */
  #rpt .rp {
    display: block;
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto 6mm;
    padding: 10mm 15mm 16mm 12mm;
    background: #fff !important;
    position: relative;
    box-sizing: border-box;
    box-shadow: 0 0 8px rgba(0,0,0,.12);
  }

  /* Toolbar */
  .toolbar{position:fixed;right:16px;top:12px;z-index:9999;display:flex;gap:8px;font-family:Arial,sans-serif}
  .toolbar button{border:0;border-radius:6px;padding:9px 16px;color:#fff;font-size:12px;font-weight:700;cursor:pointer}
  .btn-p{background:#075d70}
  .btn-c{background:#374151}

  /* ── Cover (exact reference layout) ─────────────────────────────────── */
  .cover-frame-outer{width:100%;height:100%;border:3px solid #000;padding:2.5mm;box-sizing:border-box;display:block}
  .cover-frame-inner{width:100%;height:100%;border:1px solid #000;display:flex;flex-direction:row;position:relative;box-sizing:border-box;overflow:hidden}
  .cover-divider{position:absolute;left:50%;top:0;bottom:0;width:1.5px;background:#c0392b;transform:translateX(-50%)}
  .cover-left{width:50%;padding:14mm 10mm 10mm 12mm;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;text-align:center}
  .sbi-logo-wrap{width:68mm;background:#1a237e;border-radius:2px;padding:4mm 6mm;margin-bottom:7mm;display:flex;align-items:center;justify-content:center;gap:4mm}
  .sbi-text{color:#fff;font-size:22pt;font-weight:700;letter-spacing:3px;font-family:'Inter',sans-serif}
  .cover-report-title{font-size:14pt;font-weight:700;color:#000;margin-bottom:2mm;line-height:1.3;text-align:center}
  .cover-year{font-size:13pt;font-weight:700;color:#000;margin-bottom:12mm}
  .cover-rbo{font-size:11pt;font-weight:700;color:#000;line-height:2.4;text-align:center}
  .cover-right{width:50%;padding:20mm 12mm 10mm 16mm;display:flex;flex-direction:column;justify-content:space-between}
  .cover-field{font-size:12pt;font-weight:700;color:#1a237e;margin-bottom:6mm;line-height:1.5}
  .cover-address{font-size:12pt;font-weight:700;color:#1a237e;line-height:1.6;margin-bottom:0}
  .cover-auditor{margin-top:auto;padding-top:6mm}
  .cover-audited-by{font-style:italic;font-size:10pt;color:#2e7d32;margin-bottom:2mm}
  .cover-co-name{font-size:11pt;font-weight:700;font-style:italic;color:#2e7d32;line-height:1.4;margin-bottom:3mm}
  .cover-co-sub{font-size:8pt;color:#333;line-height:1.6;margin-bottom:2mm}
  .cover-dashes{border:none;border-top:1px dashed #999;margin:2.5mm 0}
  .cover-co-addr{font-size:8pt;color:#333;line-height:1.7}
  .cover-bottom{position:absolute;bottom:8mm;right:12mm;display:flex;align-items:flex-end;gap:4mm}
  .cover-stamp{width:20mm;height:20mm;border-radius:50%;border:2px solid #2e7d32;display:flex;align-items:center;justify-content:center;font-size:5pt;color:#2e7d32;text-align:center;font-weight:700;line-height:1.4;padding:2mm}

  /* Section headers */
  .section-title{font-size:16pt;font-weight:bold;text-align:center;text-decoration:underline;margin-bottom:4mm}
  .sub-title{font-size:14pt;font-weight:bold;text-align:center;margin-bottom:3mm}
  .sec-lbl{font-weight:bold;font-size:13pt;margin:3mm 0 1.5mm}

  /* Info table */
  .info-table{width:100%;border-collapse:collapse;margin-bottom:4mm;font-size:13pt}
  .info-table tr td{border:1px solid #000;padding:1.5mm 2.5mm;vertical-align:top}
  .info-table .lbl{font-weight:bold;width:44%}

  /* Checklist table */
  .check-table{width:100%;border-collapse:collapse;font-size:12pt;margin-bottom:4mm}
  .check-table th{border:1px solid #000;padding:1.5mm 2mm;background:#d9d9d9;font-weight:bold;text-align:center;vertical-align:middle}
  .check-table td{border:1px solid #000;padding:1.5mm 2mm;vertical-align:top}
  .check-table .sno{width:6%;text-align:center;vertical-align:top}
  .check-table .desc{width:54%}
  .check-table .det{width:10%;text-align:center;vertical-align:middle}
  .check-table .rem{width:30%;text-align:center;vertical-align:middle}
  .check-table .sub-hdr{background:#f0f0f0;font-weight:bold;font-size:12pt;text-align:center}

  /* Data tables */
  .data-table{width:100%;border-collapse:collapse;font-size:12pt;margin-bottom:3mm}
  .data-table th{border:1px solid #000;padding:1.5mm 2mm;background:#d9d9d9;font-weight:bold;text-align:center;vertical-align:middle}
  .data-table td{border:1px solid #000;padding:1.5mm 2mm;text-align:center;vertical-align:middle}
  .data-table td.l{text-align:left}

  /* DG table */
  .dg-table{width:100%;border-collapse:collapse;font-size:12pt;margin-bottom:3mm}
  .dg-table th{border:1px solid #000;padding:1.5mm 2mm;background:#d9d9d9;font-weight:bold;text-align:center}
  .dg-table td{border:1px solid #000;padding:1.5mm 2mm;vertical-align:top}
  .dg-table .sno{width:8%;text-align:center}
  .dg-table .desc-col{width:36%}
  .dg-table .obs-col{width:24%;text-align:center}
  .dg-table .rec-col{width:22%}
  .dg-table .risk-col{width:10%;text-align:center;font-weight:bold}

  /* Load sheet */
  .load-table{width:100%;border-collapse:collapse;font-size:11pt;margin-bottom:3mm}
  .load-table th{border:1px solid #000;padding:1.2mm 1.8mm;background:#d9d9d9;font-weight:bold;text-align:center;vertical-align:middle}
  .load-table td{border:1px solid #000;padding:1.2mm 1.8mm;text-align:center;vertical-align:middle}
  .load-table td.l{text-align:left}
  .load-table .cat-hdr{background:#f0f0f0;font-weight:bold;text-align:left}
  .load-table .total-row{font-weight:bold;background:#e8e8e8}

  /* Observations */
  .obs-table{width:100%;border-collapse:collapse;font-size:12pt;margin-bottom:3mm}
  .obs-table th{border:1px solid #000;padding:1.8mm 2mm;background:#d9d9d9;font-weight:bold;text-align:center}
  .obs-table td{border:1px solid #000;padding:2mm;vertical-align:top}
  .obs-table .status-cell{width:26%;vertical-align:middle;text-align:center}
  .obs-table .obs-cell{width:44%}
  .obs-table .photo-cell{width:30%;text-align:center;vertical-align:middle}

  /* Risk boxes */
  .risk-box{border:1.5px solid #000;padding:2mm 3mm;margin-bottom:2mm;font-size:12pt;font-weight:bold}
  .risk-box.low{background:#c6efce}
  .risk-box.medium{background:#ffeb9c}
  .risk-box.high{background:#ffc7ce}
  .risk-box.na{background:#f2f2f2}

  /* Special obs */
  .sobs-table{width:100%;border-collapse:collapse;font-size:12pt;margin-bottom:3mm}
  .sobs-table th{border:1px solid #000;padding:1.5mm 2mm;background:#d9d9d9;font-weight:bold;text-align:center}
  .sobs-table td{border:1px solid #000;padding:1.5mm 2mm;vertical-align:top}

  /* SLD */
  .sld-box{border:1.5px solid #000;padding:3mm;margin-bottom:3mm}
  .sld-table{width:100%;border-collapse:collapse;font-size:11pt;margin-bottom:2mm}
  .sld-table th{border:1px solid #000;padding:1mm 1.5mm;background:#d9d9d9;font-weight:bold;text-align:center}
  .sld-table td{border:1px solid #000;padding:1mm 1.5mm;text-align:left;vertical-align:middle}
  .sld-table .c{text-align:center}

  /* Signatures */
  .sig-row{display:flex;justify-content:space-between;margin-top:6mm;font-size:12pt}
  .sig-block{text-align:center;min-width:60mm}
  .sig-block .sig-line{border-top:1px solid #000;margin-top:8mm;padding-top:1mm;line-height:1.6}

  /* Page footer */
  .page-footer{position:absolute;bottom:5mm;left:12mm;right:12mm;display:flex;justify-content:space-between;font-size:10pt;border-top:1px solid #ccc;padding-top:1.5mm;color:#555}
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const PF = ({ d }: { d: AuditReport }) => (
  <div className="page-footer">
    <span>SAVE EARTH ENERGY PVT. LTD. | {d.beeReg} | {d.elecSup}</span>
    <span>Branch: {d.branchName} – {d.branchCode} | Date: {d.auditDate}</span>
  </div>
);

const SaveEarthLogo = () => (
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" fill="none" stroke="#000" strokeWidth="2"/>
    <polygon points="70,20 45,62 62,62 50,100 80,52 62,52 75,20" fill="#2e7d32" stroke="#000" strokeWidth="1"/>
    <path d="M20,80 Q60,30 100,80" fill="none" stroke="#2e7d32" strokeWidth="2.5"/>
    <text x="60" y="112" fontFamily="Arial" fontSize="7" textAnchor="middle" fontWeight="bold">SAVE EARTH ENERGY</text>
  </svg>
);

// ── Page component ─────────────────────────────────────────────────────────────
export default function AuditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const d = AUDIT_DATA[id] ?? SAMPLE;

  useEffect(() => {
    document.title = `Electrical Audit Report – ${d.branchName} ${d.branchCode}`;
  }, [d.branchName, d.branchCode]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div id="rpt">

      {/* Toolbar */}
      <div className="toolbar">
        <button className="btn-p" onClick={() => window.print()}>🖨 Print / Save PDF</button>
        <button className="btn-c" onClick={() => window.close()}>✕ Close</button>
      </div>

      {/* ══ PAGE 1 — COVER ══════════════════════════════════════════════════ */}
      <div className="rp" style={{ padding: "6mm", height: "297mm", minHeight: "297mm", boxSizing: "border-box" }}>
        <div className="cover-frame-outer">
          <div className="cover-frame-inner">

            {/* Red vertical divider */}
            <div className="cover-divider" />

            {/* LEFT COLUMN */}
            <div className="cover-left">
              {/* Bank logo */}
              <div className="sbi-logo-wrap">
                <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="#1a237e"/>
                  <ellipse cx="16" cy="16" rx="9" ry="5" fill="none" stroke="#90caf9" strokeWidth="2.2"/>
                  <circle cx="16" cy="16" r="4" fill="#fff"/>
                </svg>
                <span className="sbi-text">SBI</span>
              </div>

              <div className="cover-report-title">ELECTRICAL AUDIT REPORT</div>
              <div className="cover-year">2025-26</div>

              <div className="cover-rbo">
                {d.rbo};<br />
                {d.circle};<br />
                {d.lho}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="cover-right">
              <div>
                <div className="cover-field"><strong>BRANCH: -</strong> {d.branchName}</div>
                <div className="cover-field"><strong>BRANCH CODE:-</strong> {d.branchCode}</div>
                <div className="cover-address">
                  <strong>ADDRESS: -</strong> OPP,<br />
                  KOCHRAB, ASHRAM,<br />
                  NR. BONY TRAVELS,<br />
                  PALDI AHMEDABAD,<br />
                  GUJRAT PINCODE - 380006
                </div>
              </div>

              <div className="cover-auditor">
                <div className="cover-audited-by">Audited by:</div>
                <div className="cover-co-name">SAVE EARTH ENERGY PRIVATE<br />LIMITED</div>
                <div className="cover-co-sub">
                  BEE CERTIFIED ENERGY AUDITOR,<br />
                  CONSULTANT FOR NRE, ELECTRICAL PROJECTS
                </div>
                <hr className="cover-dashes" />
                <div className="cover-co-addr">
                  B-66 Kasturba Nagar, Bhopal - 462023<br />
                  PH: 0755-4206768,9644174447<br />
                  E: savearthenergy@gmail.com
                </div>
              </div>
            </div>

            {/* Signature + Stamp — bottom right */}
            <div className="cover-bottom">
              <svg width="48" height="48" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.7 }}>
                <path d="M6,42 Q12,20 18,32 Q24,44 30,24 Q34,12 42,28 Q46,36 50,30" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div className="cover-stamp">
                SAVE<br />EARTH<br />ENERGY<br />PVT. LTD.<br />BHOPAL
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══ PAGE 2 — ANNEXURE-I (Branch info + full Checklist) ══════════════ */}
      <div className="rp">
        <div className="section-title">ANNEXURE-I<br />FORMAT FOR ELECTRICAL SAFETY AUDIT</div>

        <table className="info-table">
          <tbody>
            {d.infoRows.map(([label, value], i) => (
              <tr key={i}><td className="lbl">{label}</td><td>{value}</td></tr>
            ))}
          </tbody>
        </table>

        <table className="check-table">
          <thead>
            <tr>
              <th className="sno">Sr. No.</th>
              <th className="desc">Description</th>
              <th className="det">Details</th>
              <th className="rem">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {d.checklist.map((row, i) => {
              if (row.type === "header") {
                return <tr key={i} className="no-break"><td colSpan={4} className="sub-hdr">{row.label}</td></tr>;
              }
              return (
                <tr key={i} className="no-break">
                  <td className="sno">{row.sr}</td>
                  <td className="desc">{row.item}</td>
                  <td className="det" style={{ fontWeight: "bold", color: row.result === "YES" ? "#276221" : row.result === "NO" ? "#9c0006" : "#000" }}>{row.result}</td>
                  <td className="rem">{row.remark}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <PF d={d} />
      </div>

      {/* ══ PAGE 4 — UPS + ELECTRICAL PARAMETERS + METER ════════════════════ */}
      <div className="rp">
        <div className="sec-lbl">DETAILS OF UPS & BATTERIES IN THE BRANCH</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>UPS MAKE</th><th>CAPACITY IN KVA</th><th>1-PHASE OR 3-PHASE</th>
              <th>Make of Batteries</th><th>Number & AH Value of Batteries</th>
            </tr>
          </thead>
          <tbody>
            {d.upsDetails.map(([label, value], i) => (
              <tr key={i}><td className="l"><strong>{label}</strong></td><td colSpan={4}>{value}</td></tr>
            ))}
          </tbody>
        </table>

        <div className="sec-lbl" style={{ marginTop: "3mm" }}>UPS PARAMETERS</div>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "28%" }}>PARAMETER</th>
              <th style={{ width: "22%" }}>TEST POINT</th>
              <th style={{ width: "18%" }}>ACTUAL READING</th>
              <th style={{ width: "18%" }}>NORMAL RANGE</th>
              <th style={{ width: "14%" }}>REMARKS</th>
            </tr>
          </thead>
          <tbody>
            {d.upsParams.map((r, i) => (
              <tr key={i}>
                <td className="l">{r.param}</td>
                <td>{r.testPoint}</td>
                <td>{r.reading}</td>
                <td>{r.range}</td>
                <td>{r.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sec-lbl" style={{ marginTop: "3mm" }}>METER DETAILS</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Services Provider</th><th>Qty</th><th>Sanctioned Load</th>
              <th>Type</th><th>Meter No.</th><th>Units/Month</th><th>Avg. Bill/Month</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {d.meterDetails.map(([, v], i) => <td key={i}>{v}</td>)}
            </tr>
          </tbody>
        </table>

        <div className="sec-lbl" style={{ marginTop: "3mm" }}>ELECTRICAL PARAMETERS RECORDED AT SITE</div>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>PARAMETERS</th>
              <th style={{ width: "18%" }}>TEST POINT</th>
              <th style={{ width: "16%" }}>READING</th>
              <th style={{ width: "18%" }}>NORMAL RANGE</th>
              <th style={{ width: "18%" }}>REMARKS</th>
            </tr>
          </thead>
          <tbody>
            {d.electricalParams.map((r, i) => (
              <tr key={i}>
                <td className="l">{r.param}</td>
                <td>{r.testPoint}</td>
                <td>{r.reading}</td>
                <td>{r.range}</td>
                <td>{r.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PF d={d} />
      </div>

      {/* ══ PAGE 5 — DG SET ══════════════════════════════════════════════════ */}
      <div className="rp">
        <div className="sec-lbl">DIESEL GENERATOR (DG) SET</div>
        <table className="dg-table">
          <thead>
            <tr>
              <th className="sno">S.NO.</th>
              <th className="desc-col">DESCRIPTION</th>
              <th className="obs-col">OBSERVATIONS / REMARKS</th>
              <th className="rec-col">RECOMMENDATIONS AS PER SAFETY STANDARDS</th>
              <th className="risk-col">RISK LEVEL</th>
            </tr>
          </thead>
          <tbody>
            {d.dgSet.map((r, i) => (
              <tr key={i}>
                <td className="sno">{r.sr}</td>
                <td className="desc-col">{r.desc}</td>
                <td className="obs-col">{r.obs}</td>
                <td className="rec-col">{r.rec}</td>
                <td className="risk-col" style={{ color: r.risk === "HIGH" ? "#9c0006" : r.risk === "MEDIUM" ? "#7d5a00" : "#000" }}>{r.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PF d={d} />
      </div>

      {/* ══ PAGE 6 — BRANCH LOAD SHEET ══════════════════════════════════════ */}
      <div className="rp">
        <div className="section-title">BRANCH LOAD SHEET</div>
        <table className="load-table">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>S.No</th>
              <th style={{ width: "32%" }}>Equipment Installed</th>
              <th style={{ width: "10%" }}>Tonnage</th>
              <th style={{ width: "7%" }}>Nos.</th>
              <th style={{ width: "12%" }}>Wattage (W)</th>
              <th style={{ width: "14%" }}>Total Wattage</th>
              <th style={{ width: "20%" }}>Distributed Load</th>
            </tr>
          </thead>
          <tbody>
            {d.loadSheet.map((cat, ci) => (
              <React.Fragment key={ci}>
                <tr><td colSpan={7} className="cat-hdr">{cat.category}</td></tr>
                {cat.rows.map((r, ri) => (
                  <tr key={ri}>
                    <td>{r.sr}</td><td className="l">{r.equipment}</td>
                    <td>{r.tonnage}</td><td>{r.nos}</td>
                    <td>{r.wattage}</td><td>{r.total}</td><td>—</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr className="total-row">
              <td colSpan={2}>Total Tonnage: {d.loadTotals.totalTonnage}</td>
              <td colSpan={5}>Total Connected Load: {d.loadTotals.totalLoad}</td>
            </tr>
          </tbody>
        </table>
        <PF d={d} />
      </div>

      {/* ══ PAGE 7 — OVERVIEW OF AUDIT OBSERVATIONS ═════════════════════════ */}
      <div className="rp">
        <div className="section-title" style={{ fontSize: "10pt" }}>
          OVERVIEW OF AUDIT OBSERVATIONS AND PROPOSED RECTIFICATION WORKS IN PHOTOGRAPHIC FORM
        </div>

        <table className="obs-table">
          <thead>
            <tr>
              <th className="status-cell">BRANCH STATUS<br />(TICK MARK)</th>
              <th className="obs-cell">OBSERVATIONS AND PROPOSED RECTIFICATION WORK</th>
              <th className="photo-cell">PHOTOGRAPHS</th>
            </tr>
          </thead>
          <tbody>
            {d.riskObservations.map((obs, i) => {
              const cls = obs.level === "HIGH" ? "high" : obs.level === "MEDIUM" ? "medium" : "low";
              return (
                <tr key={i}>
                  <td className="status-cell">
                    <div className={`risk-box ${cls}`}>{obs.level} RISK:<br />{obs.label}</div>
                    {obs.items.length === 0 && <div style={{ fontSize: "8pt", textAlign: "center", marginTop: "2mm", fontWeight: "bold" }}>NA</div>}
                  </td>
                  <td className="obs-cell">
                    {obs.items.length > 0
                      ? <ol style={{ marginLeft: "4mm", fontSize: "8pt", lineHeight: "1.7" }}>{obs.items.map((item, j) => <li key={j}>{item}</li>)}</ol>
                      : "—"
                    }
                  </td>
                  <td className="photo-cell">
                    <div style={{ border: "1px dashed #999", width: "50mm", height: obs.level === "MEDIUM" ? "38mm" : "32mm", margin: "auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7pt", color: "#888" }}>[ Photo ]</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="sig-row" style={{ marginTop: "8mm" }}>
          <div className="sig-block">
            <div className="sig-line">
              Signatures: Certified Auditor<br />
              {d.beeReg} &nbsp;|&nbsp; {d.elecSup}
            </div>
          </div>
          <div className="sig-block">
            <div className="sig-line">
              Branch: {d.branchName}<br />
              Date of audit: {d.auditDate}
            </div>
          </div>
          <div className="sig-block">
            <div className="sig-line">
              Score: <strong>{d.score}</strong>
            </div>
          </div>
        </div>
        <PF d={d} />
      </div>

      {/* ══ PAGE 8 — PHOTOGRAPHS ════════════════════════════════════════════ */}
      <div className="rp">
        <div className="section-title">PHOTOGRAPHS OF MAIN ELECTRIC PANELS, UPS ROOM & ELECTRIC WIRING</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5mm", marginBottom: "5mm" }}>
          {["Main Incoming Panel", "Distribution Board", "UPS Room", "Earthing Pit", "DG Set", "Cable Tray / Wiring"].map((label, i) => (
            <div key={i} style={{ border: "1px dashed #aaa", minHeight: "40mm", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8pt", color: "#aaa", fontStyle: "italic" }}>📷 {label}</div>
          ))}
        </div>
        <div className="section-title" style={{ marginTop: "3mm" }}>PHOTOGRAPHS OF THERMAL IMAGE</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5mm" }}>
          {["Thermal — Main Panel", "Thermal — UPS / Battery", "Thermal — Distribution Board", "Thermal — Cable Terminations"].map((label, i) => (
            <div key={i} style={{ border: "1px dashed #aaa", minHeight: "32mm", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8pt", color: "#aaa", fontStyle: "italic" }}>📷 {label}</div>
          ))}
        </div>
        <PF d={d} />
      </div>

      {/* ══ PAGE 9 — SPECIAL OBSERVATIONS + SLD ════════════════════════════ */}
      <div className="rp">
        <div className="section-title">SPECIAL OBSERVATIONS AND TENTATIVE ESTIMATED COST OF COMPLIANCE WORK</div>
        <table className="sobs-table">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>Sr.</th>
              <th style={{ width: "14%" }}>Area</th>
              <th style={{ width: "30%" }}>Observation</th>
              <th style={{ width: "30%" }}>Recommendation</th>
              <th style={{ width: "11%" }}>Est. Cost</th>
              <th style={{ width: "10%" }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {d.observations.map((r, i) => (
              <tr key={i}>
                <td style={{ textAlign: "center" }}>{r.sr}</td>
                <td>{r.area}</td>
                <td>{r.obs}</td>
                <td>{r.rec}</td>
                <td style={{ textAlign: "center" }}>{r.cost}</td>
                <td style={{ textAlign: "center", fontWeight: "bold", color: r.priority === "HIGH" ? "#9c0006" : "#7d5a00" }}>{r.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="section-title" style={{ marginTop: "4mm" }}>SLD — SINGLE LINE DIAGRAM</div>
        <div className="sld-box" style={{ minHeight: "100mm", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "9pt", fontStyle: "italic" }}>
          📐 Single Line Diagram will be displayed here
        </div>

        {/* Signature */}
        <div className="sig-row">
          <div className="sig-block">
            <div className="sig-line">
              Signature of the Auditor<br />
              <span style={{ fontSize: "7.5pt" }}>SAVE EARTH ENERGY PVT. LTD.<br />{d.beeReg} | {d.elecSup}</span>
            </div>
          </div>
          <div className="sig-block">
            <div className="sig-line">
              Signature of the Branch Representative with seal<br />
              <span style={{ fontSize: "7.5pt" }}>Branch: {d.branchName} – {d.branchCode}</span>
            </div>
          </div>
        </div>
        <PF d={d} />
      </div>

      </div>
    </>
  );
}
