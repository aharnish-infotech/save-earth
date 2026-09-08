"use client";
import React from "react";

// ── Audit data shape (will come from API/DB in production) ────────────────────
const AUDIT_DATA: Record<string, AuditReport> = {
  "AU-2024-131": {
    auditId: "AU-2024-131", auditDate: "27 Jul 2024", auditorName: "Mukteshwar Sharma",
    bank: "Canara Bank", bankCode: "CNRB", branchName: "MEERUT ABU LANE",
    branchCode: "0199", ifsc: "CNRB0000199",
    address: "187, Abu lane, meerut, Uttar Pradesh", city: "Meerut", district: "Meerut",
    state: "Uttar Pradesh", micr: "250015003", circle: "Agra", region: "Meerut",
    riskLevel: "MEDIUM", htlt: "LT",
    overview: [
      ["Bank Name", "Canara Bank"], ["Branch Name", "MEERUT ABU LANE"], ["Branch Code", "0199"],
      ["IFSC Code", "CNRB0000199"], ["Address", "187, Abu lane, meerut, Uttar Pradesh"],
      ["Circle", "Agra"], ["Region / Zone", "Meerut"], ["State", "Uttar Pradesh"],
      ["City", "Meerut"], ["Audit Date", "27 Jul 2024"], ["Auditor", "Mukteshwar Sharma"],
      ["Risk Level", "MEDIUM"],
    ],
    loadAnalysis: [
      ["Sanctioned Load", "15 KW"], ["Connected Load", "12.5 KW"],
      ["Maximum Demand", "10 KW"], ["Power Factor", "0.85"],
      ["Voltage (R-N)", "230 V"], ["Voltage (Y-N)", "229 V"], ["Voltage (B-N)", "231 V"],
      ["Current (R Phase)", "18 A"], ["Current (Y Phase)", "17 A"], ["Current (B Phase)", "16 A"],
    ],
    voltageReadings: [
      { param: "R-N", panel: "230", acdb: "229", unit: "V", remarks: "Normal" },
      { param: "Y-N", panel: "229", acdb: "228", unit: "V", remarks: "Normal" },
      { param: "B-N", panel: "231", acdb: "230", unit: "V", remarks: "Normal" },
      { param: "R-Y", panel: "398", acdb: "397", unit: "V", remarks: "Normal" },
      { param: "Y-B", panel: "400", acdb: "399", unit: "V", remarks: "Normal" },
      { param: "R-B", panel: "401", acdb: "400", unit: "V", remarks: "Normal" },
      { param: "N-E", panel: "1.2", acdb: "1.1", unit: "V", remarks: "Acceptable" },
    ],
    currentReadings: [
      { param: "R Phase", panel: "18", acdb: "18", unit: "A", remarks: "Normal" },
      { param: "Y Phase", panel: "17", acdb: "17", unit: "A", remarks: "Normal" },
      { param: "B Phase", panel: "16", acdb: "16", unit: "A", remarks: "Normal" },
      { param: "Neutral", panel: "3", acdb: "3", unit: "A", remarks: "Normal" },
    ],
    safetyChecklist: [
      { sr: "1", item: "Main switch / MCB / MCCB properly rated and functional", result: "OK", remark: "" },
      { sr: "2", item: "Earth leakage protection (ELCB/RCCB) installed and functional", result: "OK", remark: "" },
      { sr: "3", item: "All wiring in conduit / cable tray, no open wiring", result: "OK", remark: "" },
      { sr: "4", item: "Proper earthing of all equipment", result: "OK", remark: "" },
      { sr: "5", item: "DB (Distribution Board) is properly covered with door", result: "OK", remark: "" },
      { sr: "6", item: "Fire extinguisher available and within validity", result: "OK", remark: "" },
      { sr: "7", item: "No water leakage near electrical equipment", result: "OK", remark: "" },
      { sr: "8", item: "Cable insulation intact, no damaged insulation", result: "NOT OK", remark: "Minor cable damage near UPS" },
      { sr: "9", item: "Proper cable labelling on all circuits", result: "OK", remark: "" },
      { sr: "10", item: "Emergency lighting / exit lighting functional", result: "OK", remark: "" },
    ],
    meterDetails: [
      ["Meter Type", "3-Phase Digital"], ["Meter Sr. No.", "EB2024001"], ["Make", "L&T"],
      ["Import Units (KWh)", "14523"], ["Maximum Demand (KW)", "10"],
      ["Multiplying Factor", "1"], ["Meter Status", "Functional"],
    ],
    acDetails: [
      ["No. of AC Units", "4"], ["Total AC Capacity (Ton)", "6"],
      ["AC Make", "Voltas / Blue Star"], ["AC Type", "Split"], ["AC Condition", "Good"],
    ],
    dgDetails: [
      ["DG Available", "Yes"], ["DG Capacity (KVA)", "25"],
      ["DG Make", "Kirloskar"], ["DG Sr. No.", "KIR2023456"],
      ["Last Service Date", "Jan 2024"], ["DG Condition", "Good"],
    ],
    earthingDetails: [
      ["No. of Earth Pits", "3"], ["Earth Pit 1 Resistance (Ohms)", "1.8"],
      ["Earth Pit 2 Resistance (Ohms)", "2.1"], ["Earth Pit 3 Resistance (Ohms)", "1.9"],
      ["Last Testing Date", "Mar 2024"], ["Earth Pit Condition", "Good"],
      ["UPS Earthing Resistance (Ohms)", "0.9"],
    ],
    upsDetails: [
      ["UPS Make", "APC / Numeric"], ["UPS Capacity (KVA)", "10"],
      ["Battery Make", "Exide"], ["Battery Condition", "Good"],
      ["UPS Output Voltage (V)", "230"], ["UPS Output Frequency (Hz)", "49.9"],
    ],
    luxLevels: [
      ["Lobby / Banking Hall", "320 Lux", "300 Lux", "Adequate"],
      ["Manager Cabin", "290 Lux", "300 Lux", "Slightly Low"],
      ["ATM Area", "350 Lux", "200 Lux", "Adequate"],
      ["Server Room", "280 Lux", "300 Lux", "Slightly Low"],
      ["Locker Room", "260 Lux", "200 Lux", "Adequate"],
    ],
    riskRating: [
      ["Electrical Wiring & Cabling", "B", "8", "Good"],
      ["Earthing System", "A", "10", "Excellent"],
      ["Fire Safety & Protection", "B", "8", "Good"],
      ["UPS & Battery System", "A", "10", "Excellent"],
      ["DG Set & Maintenance", "B", "8", "Good"],
      ["Panel & Distribution Board", "B+", "9", "Very Good"],
      ["Overall Risk Level", "MEDIUM", "—", "—"],
    ],
    observations: [
      { sr: "1", area: "UPS Room", observation: "Minor cable insulation damage near UPS input terminal", recommendation: "Replace cable insulation / rewire the section", cost: "₹ 2,500", priority: "High" },
      { sr: "2", area: "Main Panel", observation: "Main panel door hinge is loose", recommendation: "Repair / replace the panel door hinge", cost: "₹ 800", priority: "Medium" },
      { sr: "3", area: "Earthing", observation: "Earth pit no. 2 resistance slightly above 2 ohms", recommendation: "Add GEM compound to improve earthing", cost: "₹ 1,500", priority: "Medium" },
    ],
  },
};

const FALLBACK: AuditReport = AUDIT_DATA["AU-2024-131"];

interface AuditReport {
  auditId: string; auditDate: string; auditorName: string;
  bank: string; bankCode: string; branchName: string;
  branchCode: string; ifsc: string; address: string;
  city: string; district: string; state: string; micr: string;
  circle: string; region: string; riskLevel: string; htlt: string;
  overview: string[][];
  loadAnalysis: string[][];
  voltageReadings: { param: string; panel: string; acdb: string; unit: string; remarks: string }[];
  currentReadings: { param: string; panel: string; acdb: string; unit: string; remarks: string }[];
  safetyChecklist: { sr: string; item: string; result: string; remark: string }[];
  meterDetails: string[][];
  acDetails: string[][];
  dgDetails: string[][];
  earthingDetails: string[][];
  upsDetails: string[][];
  luxLevels: string[][];
  riskRating: string[][];
  observations: { sr: string; area: string; observation: string; recommendation: string; cost: string; priority: string }[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="section-title">{children}</div>
);

const InfoTable = ({ rows }: { rows: string[][] }) => (
  <table className="report-table">
    <tbody>
      {rows.map(([label, value], i) => (
        <tr key={i}>
          <td style={{ width: "40%", fontWeight: 700 }}>{label}</td>
          <td>{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ReadingsTable = ({
  title, rows,
}: {
  title: string;
  rows: { param: string; panel: string; acdb: string; unit: string; remarks: string }[];
}) => (
  <>
    <SectionTitle>{title}</SectionTitle>
    <table className="report-table">
      <thead>
        <tr>
          <th style={{ width: "20%" }}>Test Point</th>
          <th style={{ width: "22%" }}>Reading at Panel/Meter</th>
          <th style={{ width: "22%" }}>Reading at ACDB</th>
          <th style={{ width: "10%" }}>Unit</th>
          <th>Observations / Remarks</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td style={{ fontWeight: 700 }}>{r.param}</td>
            <td>{r.panel}</td>
            <td>{r.acdb}</td>
            <td>{r.unit}</td>
            <td>{r.remarks}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

const PhotoPlaceholder = ({ label }: { label: string }) => (
  <div style={{ border: "1px solid #cdd9dd", background: "#fafcfc", minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: "#9ca3af", fontSize: 11, fontStyle: "italic", marginBottom: 8 }}>
    📷 {label}
  </div>
);

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
:root{--brand:#078da7;--brand-dark:#075d70;--brand-light:#eaf5f7;--ink:#17252d;--line:#cdd9dd;--success:#17845b}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#eef2f4;color:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:11px}
body{padding:18px 0}
.print-toolbar{position:fixed;right:22px;top:18px;z-index:9999;display:flex;gap:8px}
.print-toolbar button{border:0;border-radius:8px;padding:11px 18px;color:#fff;font-size:13px;font-weight:800;cursor:pointer}
.btn-print{background:linear-gradient(135deg,var(--brand-dark),var(--brand));box-shadow:0 6px 18px rgba(0,65,80,.2)}
.btn-close{background:#374151}
.report{width:210mm;margin:auto;background:#fff;box-shadow:0 8px 35px rgba(20,50,60,.12)}
.sheet{width:210mm;min-height:257mm;position:relative;background:#fff;padding:10mm 13mm 18mm}
.cover{min-height:257mm;break-after:page;page-break-after:always;padding:0;display:flex;align-items:stretch}
.cover .cover-box{width:100%;min-height:257mm;border:1px solid #17272e;position:relative;background:linear-gradient(145deg,#fff 0%,#fbfdfe 100%)}
.cover .cover-box:before{content:"";position:absolute;left:0;top:0;width:4px;height:100%;background:linear-gradient(#ffd35a,var(--brand),#ffd35a)}
.cover .cover-left{position:absolute;left:11mm;top:126mm;line-height:1.9;border-left:3px solid var(--brand);padding-left:7mm;width:78mm}
.cover .cover-right{position:absolute;left:108mm;top:72mm;line-height:1.65;width:82mm}
.cover .divider{position:absolute;left:101mm;top:20mm;height:215mm;border-left:1px solid #26343a}
.cover .cover-right:before{content:"AUDIT CERTIFICATE";display:block;font-size:8.5px;letter-spacing:2px;color:var(--brand);font-weight:800;margin-bottom:5mm}
.label{color:var(--brand);font-weight:800}
.ok{color:var(--success);font-weight:800}
.notok{color:#dc2626;font-weight:800}
.report-flow-block{position:relative;width:180mm;max-width:100%;padding-top:2mm;margin:0 auto 8mm;break-inside:auto;page-break-inside:auto}
.report-flow-block:not(.block-1){break-before:page;page-break-before:always;padding-top:2mm}
.report-flow-block:after{content:"";display:block;position:absolute;left:-4mm;right:-4mm;top:0;bottom:0;border-left:1px solid #edf2f3;border-right:1px solid #edf2f3;pointer-events:none;z-index:0}
.report-flow-block > *{position:relative;z-index:1}
.section-title{font-size:13.5px;font-weight:900;text-transform:uppercase;text-align:left;color:#fff;background:linear-gradient(90deg,var(--brand-dark),var(--brand));padding:9px 12px;margin:0 0 4.5mm;border-radius:4px;letter-spacing:.55px;box-shadow:0 2px 7px rgba(0,75,90,.13);break-after:avoid-page;page-break-after:avoid}
.section-title.small{font-size:10.5px;padding:7px 10px}
.report-table{width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed;margin:0 0 4mm;border:1px solid var(--line);border-radius:4px;overflow:hidden;break-inside:auto;page-break-inside:auto}
.report-table thead{display:table-header-group}
.report-table tr{break-inside:avoid;page-break-inside:avoid}
.report-table th,.report-table td{border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:5.5px 6px;vertical-align:top;line-height:1.3;word-wrap:break-word;overflow-wrap:anywhere}
.report-table th{font-weight:900;text-align:left;color:#164f60;background:var(--brand-light);font-size:10.2px}
.report-table td{font-size:10.2px}
.report-table tr:last-child td{border-bottom:0}
.report-table th:last-child,.report-table td:last-child{border-right:0}
.report-table tbody tr:nth-child(even) td{background:#fbfcfd}
.report-table td:first-child{font-weight:600}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-bottom:4mm}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;margin-bottom:4mm}
.risk-badge{display:inline-block;padding:2px 10px;border-radius:12px;font-weight:800;font-size:10px}
.risk-high{background:#fee2e2;color:#dc2626}
.risk-medium{background:#fef9c3;color:#ca8a04}
.risk-low{background:#dcfce7;color:#16a34a}
.prio-high{color:#dc2626;font-weight:800}
.prio-medium{color:#ca8a04;font-weight:800}
.cover-watermark{position:absolute;right:8mm;bottom:12mm;font-size:7px;color:#9ca3af;letter-spacing:1px;text-transform:uppercase}
.footer-line{margin-top:6mm;border-top:1px solid #cdd9dd;padding-top:4mm;font-size:8.5px;color:#9ca3af;display:flex;justify-content:space-between}
@page{size:A4;margin:18mm 14mm 18mm 14mm}
.print-header,.print-footer{display:none}
@media print{
  html,body{background:#fff;padding:0}
  .print-toolbar{display:none}
  .report{width:auto;margin:0;box-shadow:none}
  .sheet{width:auto;min-height:257mm;padding:8mm 8mm 17mm}
  .print-header{display:flex;position:fixed;z-index:9999;left:14mm;right:14mm;top:2mm;height:12mm;align-items:center;justify-content:center;border-bottom:1px solid #dce5e8;background:#fff;font-weight:800;font-size:10px;color:var(--brand-dark)}
  .print-footer{display:block;position:fixed;z-index:9999;left:14mm;right:14mm;bottom:2mm;height:11mm;border-top:1px solid #dce5e8;background:#fff;font-size:7.5px;color:#9ca3af;padding-top:3mm;text-align:center}
}
`;

// ── Page Component ─────────────────────────────────────────────────────────────
export default function AuditReportPage({ params }: { params: { id: string } }) {
  const d = AUDIT_DATA[params.id] ?? FALLBACK;

  const riskClass = d.riskLevel === "HIGH" ? "risk-high" : d.riskLevel === "MEDIUM" ? "risk-medium" : "risk-low";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Electrical Audit Report — {d.branchName} | {d.bank}</title>
        <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      </head>
      <body>

        {/* Print header/footer (print only) */}
        <div className="print-header">ORBIT Compliance ERP — Electrical Audit Report — {d.bank} · {d.branchName}</div>
        <div className="print-footer">Save Earth Energy Pvt. Ltd. | Audit ID: {d.auditId} | Generated by ORBIT Compliance ERP | Confidential</div>

        {/* Toolbar */}
        <div className="print-toolbar">
          <button className="btn-print" onClick={() => window.print()}>🖨 Print / Download PDF</button>
          <button className="btn-close" onClick={() => window.close()}>✕ Close</button>
        </div>

        <div className="report">

          {/* ══ COVER PAGE ════════════════════════════════════════════════════ */}
          <section className="sheet cover">
            <div className="cover-box">
              {/* Left side */}
              <div className="cover-left">
                <div style={{ fontSize: 8, letterSpacing: 2, color: "#9ca3af", fontWeight: 800, marginBottom: 4 }}>ELECTRICAL SAFETY AUDIT REPORT</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#075d70", lineHeight: 1.2, marginBottom: 3 }}>{d.bank}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#17252d", marginBottom: 10 }}>{d.branchName}</div>
                <div><span className="label">REGION:</span> {d.region}</div>
                <div><span className="label">CIRCLE:</span> {d.circle}</div>
                <div><span className="label">AUDIT DATE:</span> {d.auditDate}</div>
                <div><span className="label">AUDIT ID:</span> {d.auditId}</div>
                <div><span className="label">RISK LEVEL:</span> <span className={`risk-badge ${riskClass}`}>{d.riskLevel}</span></div>
              </div>

              {/* Divider */}
              <div className="divider"/>

              {/* Right side */}
              <div className="cover-right">
                <div><span className="label">BRANCH:</span> {d.branchName}</div>
                <div><span className="label">BRANCH CODE:</span> {d.branchCode}</div>
                <div><span className="label">IFSC:</span> {d.ifsc}</div>
                <div><span className="label">ADDRESS:</span> {d.address}</div>
                <div><span className="label">CITY / DISTRICT:</span> {d.city}, {d.district}</div>
                <div><span className="label">STATE:</span> {d.state}</div>
                <div><span className="label">MICR:</span> {d.micr}</div>
                <div style={{ marginTop: 8 }}><span className="label">RISK LEVEL:</span> <span className={`risk-badge ${riskClass}`}>{d.riskLevel}</span></div>
                <div style={{ marginTop: 8 }}><span className="label">Audited by:</span> {d.auditorName}</div>
                <div><span className="label">Date:</span> {d.auditDate}</div>
              </div>

              {/* Watermark */}
              <div className="cover-watermark">Save Earth Energy Pvt. Ltd. · ORBIT Compliance ERP</div>
            </div>
          </section>

          {/* ══ BLOCK 1 — Branch Overview + Load Analysis ════════════════════ */}
          <div className="report-flow-block block-1">
            <SectionTitle>Branch / Office Overview</SectionTitle>
            <InfoTable rows={d.overview}/>

            <SectionTitle>Electrical Load Analysis</SectionTitle>
            <InfoTable rows={d.loadAnalysis}/>
          </div>

          {/* ══ BLOCK 2 — Voltage Readings ══════════════════════════════════ */}
          <div className="report-flow-block block-2">
            <ReadingsTable title="Voltage Readings (V)" rows={d.voltageReadings}/>
            <ReadingsTable title="Current Readings (A)" rows={d.currentReadings}/>
          </div>

          {/* ══ BLOCK 3 — Safety Checklist ══════════════════════════════════ */}
          <div className="report-flow-block block-3">
            <SectionTitle>Electrical Safety Checklist</SectionTitle>
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{ width: "6%" }}>Sr.</th>
                  <th style={{ width: "52%" }}>Safety Parameter</th>
                  <th style={{ width: "14%" }}>Result</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {d.safetyChecklist.map((r, i) => (
                  <tr key={i}>
                    <td>{r.sr}</td>
                    <td>{r.item}</td>
                    <td className={r.result === "OK" ? "ok" : "notok"}>{r.result}</td>
                    <td>{r.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ══ BLOCK 4 — Meter / AC / DG ═══════════════════════════════════ */}
          <div className="report-flow-block block-4">
            <div className="two-col">
              <div>
                <SectionTitle>Meter Details</SectionTitle>
                <InfoTable rows={d.meterDetails}/>
              </div>
              <div>
                <SectionTitle>Air Conditioner Details</SectionTitle>
                <InfoTable rows={d.acDetails}/>
              </div>
            </div>
            <SectionTitle>DG Set Details</SectionTitle>
            <InfoTable rows={d.dgDetails}/>
          </div>

          {/* ══ BLOCK 5 — Earthing / UPS / Lux ══════════════════════════════ */}
          <div className="report-flow-block block-5">
            <SectionTitle>Earthing Details</SectionTitle>
            <InfoTable rows={d.earthingDetails}/>

            <div className="two-col">
              <div>
                <SectionTitle>UPS Details</SectionTitle>
                <InfoTable rows={d.upsDetails}/>
              </div>
              <div>
                <SectionTitle>Lux Levels</SectionTitle>
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Area</th>
                      <th>Measured</th>
                      <th>Required</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.luxLevels.map((r, i) => (
                      <tr key={i}>
                        {r.map((c, j) => <td key={j}>{c}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ══ BLOCK 6 — Risk Rating ════════════════════════════════════════ */}
          <div className="report-flow-block block-6">
            <SectionTitle>Risk Rating Format of Branch / Office on Basis of Electricity</SectionTitle>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th style={{ width: "12%" }}>Grade</th>
                  <th style={{ width: "12%" }}>Score</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {d.riskRating.map((r, i) => (
                  <tr key={i} style={i === d.riskRating.length - 1 ? { background: "#eaf5f7" } : {}}>
                    <td style={{ fontWeight: i === d.riskRating.length - 1 ? 900 : 600 }}>{r[0]}</td>
                    <td style={{ fontWeight: 800, color: "#078da7" }}>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ══ BLOCK 7 — Thermal Photos ════════════════════════════════════ */}
          <div className="report-flow-block block-7">
            <SectionTitle>Photographs of Thermal Image</SectionTitle>
            <div className="two-col">
              <PhotoPlaceholder label="Thermal Image — Main Panel"/>
              <PhotoPlaceholder label="Thermal Image — UPS / Battery"/>
            </div>
            <div className="two-col">
              <PhotoPlaceholder label="Thermal Image — Distribution Board"/>
              <PhotoPlaceholder label="Thermal Image — Cable Terminations"/>
            </div>
          </div>

          {/* ══ BLOCK 8 — Site Photographs ══════════════════════════════════ */}
          <div className="report-flow-block block-8">
            <SectionTitle>Photographs of Main Electric Panels, UPS Room &amp; Electric Wiring</SectionTitle>
            <div className="two-col">
              <PhotoPlaceholder label="Main Incoming Panel"/>
              <PhotoPlaceholder label="Distribution Board"/>
            </div>
            <div className="two-col">
              <PhotoPlaceholder label="UPS Room"/>
              <PhotoPlaceholder label="Earthing Pit"/>
            </div>
            <div className="two-col">
              <PhotoPlaceholder label="DG Set"/>
              <PhotoPlaceholder label="Cable Tray / Wiring"/>
            </div>
          </div>

          {/* ══ BLOCK 9 — Special Observations ══════════════════════════════ */}
          <div className="report-flow-block block-9">
            <SectionTitle>Special Observations and Tentative Estimated Cost of Compliance Work</SectionTitle>
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>Sr.</th>
                  <th style={{ width: "15%" }}>Area</th>
                  <th style={{ width: "30%" }}>Observation</th>
                  <th style={{ width: "30%" }}>Recommendation</th>
                  <th style={{ width: "10%" }}>Est. Cost</th>
                  <th style={{ width: "10%" }}>Priority</th>
                </tr>
              </thead>
              <tbody>
                {d.observations.map((r, i) => (
                  <tr key={i}>
                    <td>{r.sr}</td>
                    <td>{r.area}</td>
                    <td>{r.observation}</td>
                    <td>{r.recommendation}</td>
                    <td>{r.cost}</td>
                    <td className={r.priority === "High" ? "prio-high" : "prio-medium"}>{r.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* SLD Placeholder */}
            <div style={{ marginTop: 8 }}>
              <SectionTitle>SLD — Single Line Diagram</SectionTitle>
              <div style={{ border: "1px solid #cdd9dd", minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: "#9ca3af", fontSize: 13, fontStyle: "italic" }}>
                📐 SLD Image will be displayed here
              </div>
            </div>
          </div>

          {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
          <div style={{ width: "180mm", margin: "0 auto", padding: "4mm 0 8mm" }}>
            <div className="footer-line">
              <span>Audit ID: <strong>{d.auditId}</strong></span>
              <span>Branch: <strong>{d.branchName}</strong></span>
              <span>Audited by: <strong>{d.auditorName}</strong></span>
              <span>Date: <strong>{d.auditDate}</strong></span>
            </div>
            <div style={{ fontSize: 8, color: "#b0bfc5", textAlign: "center", marginTop: 3 }}>
              This report is generated by ORBIT Compliance ERP — Save Earth Energy Pvt. Ltd. | Confidential — For Authorised Use Only
            </div>
          </div>

        </div>
      </body>
    </html>
  );
}
