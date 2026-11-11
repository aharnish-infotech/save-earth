"use client";
import { useState, useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type Operator =
  | "lt"        // less than
  | "lte"       // less than or equal
  | "gt"        // greater than
  | "gte"       // greater than or equal
  | "eq"        // equals
  | "ne"        // not equal (to a value)
  | "ne_field"  // not equal (to another field)
  | "between"   // value between min and max
  | "contains"  // string contains
  | "is_yes"    // boolean/selection is YES
  | "is_no";    // boolean/selection is NO

type ConditionLogic = "AND" | "OR";

/** A single programmatic condition the report engine evaluates */
export interface RuleCondition {
  step: string;           // e.g. "step_7_distribution"
  dataField: string;      // e.g. "incomer_cable_size" — the DB field / JSON key
  operator: Operator;
  value?: string | number;         // threshold (for lt/gt/eq/ne/contains)
  valueMin?: string | number;      // lower bound (for between)
  valueMax?: string | number;      // upper bound (for between)
  compareField?: string;           // other field to compare against (for ne_field)
  unit?: string;                   // e.g. "sqmm", "V", "OHMS", "KVA"
  note?: string;                   // human-readable label shown in UI
}

export interface AutoRecommendation {
  id: string;
  sNo: number;
  shortName: string;
  recommendationText: string;
  riskRating: RiskLevel;
  approxCost: string;
  enabled: boolean;
  conditionLogic: ConditionLogic;
  conditions: RuleCondition[];
}

// ── Seed Data (18 rules from PDF) ────────────────────────────────────────────

const SEED: AutoRecommendation[] = [
  {
    id: "wire_sizing",
    sNo: 1,
    shortName: "Wire Sizing",
    recommendationText:
      "Phase wire size is observed inadequate to cater to the connected load of the branch. This may lead to overheating and degradation of wire insulation and Fire hazard in case of prolonged usage. Appropriate Cable size of at least 25sqmm be used for main supply.",
    riskRating: "MEDIUM",
    approxCost: "AS PER MATERIAL",
    enabled: true,
    conditionLogic: "OR",
    conditions: [
      { step: "step_7_distribution", dataField: "incomer_cable_size",    operator: "lt", value: 12, unit: "sqmm", note: "Incomer cable size < 12 sqmm" },
      { step: "step_7_distribution", dataField: "distribution_cable_size", operator: "lt", value: 12, unit: "sqmm", note: "Distribution cable size < 12 sqmm" },
    ],
  },
  {
    id: "wire_sizing_mismatch",
    sNo: 2,
    shortName: "Wire Sizing Mismatch",
    recommendationText:
      "Wire sizing mismatch is observed between Main meter supply and Distribution from Main Isolator/ Phase cutouts at main incomer panel, which may lead to overheating of the undersized wire connecting the phase. Equal/same sized wiring be used on both sides of the cutout/Main MCCB.",
    riskRating: "HIGH",
    approxCost: "AS PER MATERIAL",
    enabled: true,
    conditionLogic: "AND",
    conditions: [
      { step: "step_7_distribution", dataField: "distribution_cable_size", operator: "ne_field", compareField: "incomer_cable_size", note: "Distribution cable size ≠ Incomer cable size" },
    ],
  },
  {
    id: "old_db_mdb",
    sNo: 3,
    shortName: "Old DB, MDB Required",
    recommendationText:
      "Old Distribution is recommended to be replaced with New integrated MDB Panel with Main and Master MCCBs so as to isolate non-essential load during closing hours of the bank.",
    riskRating: "MEDIUM",
    approxCost: "UPTO 50K",
    enabled: true,
    conditionLogic: "OR",
    conditions: [
      { step: "step_7_distribution", dataField: "distribution_type", operator: "eq", value: "VDB",    note: "Distribution Type = VDB"    },
      { step: "step_7_distribution", dataField: "distribution_type", operator: "eq", value: "Direct", note: "Distribution Type = Direct" },
    ],
  },
  {
    id: "busbar_required",
    sNo: 4,
    shortName: "Bus Bar Required",
    recommendationText:
      "BUS-BAR is not installed in the Main DB/panel of the branch and Distribution is directly via MCB DBs. Installation of MDB with Bus Bar and Digital indication lamps is recommended.",
    riskRating: "LOW",
    approxCost: "UPTO 10K",
    enabled: true,
    conditionLogic: "AND",
    conditions: [
      { step: "step_7_distribution", dataField: "busbar_installed", operator: "is_no", note: "BUS-BAR is selected NO" },
    ],
  },
  {
    id: "ups_earthing_not_ok",
    sNo: 5,
    shortName: "UPS Earthing Not OK",
    recommendationText:
      "UPS Earthing found weak (refer Earthing data, E-N Voltage).",
    riskRating: "HIGH",
    approxCost: "UPTO 25K",
    enabled: true,
    conditionLogic: "OR",
    conditions: [
      { step: "step_3_ups", dataField: "ups_input_ne_voltage_1ph",  operator: "gt", value: 5, unit: "V", note: "Input N-E (1-ph) > 5V"  },
      { step: "step_3_ups", dataField: "ups_input_ne_voltage_3ph",  operator: "gt", value: 5, unit: "V", note: "Input N-E (3-ph) > 5V"  },
      { step: "step_3_ups", dataField: "ups_output_ne_voltage_1ph", operator: "gt", value: 5, unit: "V", note: "Output N-E (1-ph) > 5V" },
      { step: "step_3_ups", dataField: "ups_output_ne_voltage_3ph", operator: "gt", value: 5, unit: "V", note: "Output N-E (3-ph) > 5V" },
    ],
  },
  {
    id: "ups_sizing",
    sNo: 6,
    shortName: "UPS Sizing Not Appropriate",
    recommendationText:
      "UPS is undersized: upgradation required to cater to Connected UPS load as per load sheet enclosed.",
    riskRating: "MEDIUM",
    approxCost: "AS PER EQUIPMENT COST",
    enabled: true,
    conditionLogic: "AND",
    conditions: [
      { step: "step_3_ups",       dataField: "total_ups_capacity_kva", operator: "lt", compareField: "total_it_equipment_load_kva", note: "Sum of all UPS KVA < Total IT/Computer Equipment Load (Step 9 Loadsheet)" },
    ],
  },
  {
    id: "weak_ne_ups_raw",
    sNo: 7,
    shortName: "Weak N-E V — UPS/RAW",
    recommendationText:
      "Earthing Pit be opened and Watered with Basic Chemical replenishment of the Earthing rod. If this doesn't bring earthing levels to below ~3V, new earthing is recommended.",
    riskRating: "MEDIUM",
    approxCost: "NA",
    enabled: true,
    conditionLogic: "OR",
    conditions: [
      { step: "step_3_ups",           dataField: "ups_input_ne_voltage",  operator: "between", valueMin: 5, valueMax: 15, unit: "V", note: "Step 3 — Input N-E: 5–15V"       },
      { step: "step_3_ups",           dataField: "ups_output_ne_voltage", operator: "between", valueMin: 5, valueMax: 15, unit: "V", note: "Step 3 — Output N-E: 5–15V"      },
      { step: "step_6_electrical",    dataField: "panel_ne_voltage",      operator: "between", valueMin: 5, valueMax: 15, unit: "V", note: "Step 6 — Panel N-E: 5–15V"       },
      { step: "step_6_electrical",    dataField: "acdb_ne_voltage",       operator: "between", valueMin: 5, valueMax: 15, unit: "V", note: "Step 6 — ACDB N-E: 5–15V"        },
    ],
  },
  {
    id: "weak_earth_resistance",
    sNo: 8,
    shortName: "Weak Earth Resistance",
    recommendationText:
      "Earthing resistance is observed marginally higher than permissible limit. Chemical replenishment and regular watering of earth pit is recommended.",
    riskRating: "MEDIUM",
    approxCost: "NA",
    enabled: true,
    conditionLogic: "OR",
    conditions: [
      { step: "step_6_electrical", dataField: "earth_resistance_1", operator: "between", valueMin: 3, valueMax: 12, unit: "OHMS", note: "Earthing Resistance #1: 3–12 Ω" },
      { step: "step_6_electrical", dataField: "earth_resistance_2", operator: "between", valueMin: 3, valueMax: 12, unit: "OHMS", note: "Earthing Resistance #2: 3–12 Ω" },
      { step: "step_6_electrical", dataField: "earth_resistance_3", operator: "between", valueMin: 3, valueMax: 12, unit: "OHMS", note: "Earthing Resistance #3: 3–12 Ω" },
      { step: "step_6_electrical", dataField: "earth_resistance_4", operator: "between", valueMin: 3, valueMax: 12, unit: "OHMS", note: "Earthing Resistance #4: 3–12 Ω" },
    ],
  },
  {
    id: "faulty_ne_ups_raw",
    sNo: 9,
    shortName: "Faulty N-E V — UPS/RAW",
    recommendationText:
      "Earthing is observed FAULTY (REFER E-N voltage): new Chemical earthing is recommended to be installed with looping through a proper Earthing DB in UPS room/Electrical panel room.",
    riskRating: "HIGH",
    approxCost: "UPTO 25K",
    enabled: true,
    conditionLogic: "OR",
    conditions: [
      { step: "step_3_ups",        dataField: "ups_input_ne_voltage",  operator: "gt", value: 15, unit: "V", note: "Step 3 — Input N-E > 15V"  },
      { step: "step_3_ups",        dataField: "ups_output_ne_voltage", operator: "gt", value: 15, unit: "V", note: "Step 3 — Output N-E > 15V" },
      { step: "step_6_electrical", dataField: "panel_ne_voltage",      operator: "gt", value: 15, unit: "V", note: "Step 6 — Panel N-E > 15V"  },
      { step: "step_6_electrical", dataField: "acdb_ne_voltage",       operator: "gt", value: 15, unit: "V", note: "Step 6 — ACDB N-E > 15V"   },
    ],
  },
  {
    id: "faulty_earth_resistance",
    sNo: 10,
    shortName: "Faulty Earthing Resistance",
    recommendationText:
      "Earthing resistance is observed too high. New Earthing is recommended.",
    riskRating: "HIGH",
    approxCost: "UPTO 25K",
    enabled: true,
    conditionLogic: "OR",
    conditions: [
      { step: "step_6_electrical", dataField: "earth_resistance_1", operator: "gt", value: 12, unit: "OHMS", note: "Earthing Resistance #1 > 12 Ω" },
      { step: "step_6_electrical", dataField: "earth_resistance_2", operator: "gt", value: 12, unit: "OHMS", note: "Earthing Resistance #2 > 12 Ω" },
      { step: "step_6_electrical", dataField: "earth_resistance_3", operator: "gt", value: 12, unit: "OHMS", note: "Earthing Resistance #3 > 12 Ω" },
      { step: "step_6_electrical", dataField: "earth_resistance_4", operator: "gt", value: 12, unit: "OHMS", note: "Earthing Resistance #4 > 12 Ω" },
    ],
  },
  {
    id: "load_enhancement",
    sNo: 11,
    shortName: "Load Enhancement",
    recommendationText:
      "Connected load is found to be more than Sanctioned load: hence Sanctioned load be enhanced to minimum Connected Load value (refer load sheets) to avoid penalty imposition by EB authorities.",
    riskRating: "LOW",
    approxCost: "AS PER EB",
    enabled: true,
    conditionLogic: "AND",
    conditions: [
      { step: "step_12_eb", dataField: "sanctioned_load_kw", operator: "lt", compareField: "total_connected_load_kw", note: "Sanctioned Load < Total Connected Load (Branch + ATM Loadsheets)" },
    ],
  },
  {
    id: "1ph_to_3ph",
    sNo: 12,
    shortName: "1-ph to 3-ph Upgrade",
    recommendationText:
      "It is recommended to upgrade Single phase to Three phase, as per connected load of the branch.",
    riskRating: "MEDIUM",
    approxCost: "AS PER EB",
    enabled: true,
    conditionLogic: "AND",
    conditions: [
      { step: "step_7_distribution", dataField: "supply_phase_type", operator: "eq", value: "1-phase", note: "Supply type = 1-phase" },
    ],
  },
  {
    id: "pf_penalty",
    sNo: 13,
    shortName: "PF Penalty",
    recommendationText:
      "PF Penalty is imposed on the branch, which is majorly caused by inductive loads increasing the reactive and apparent power. Installation or reconfiguration of appropriately sized PF controller/APFC is recommended by empaneled competent A class contractor.",
    riskRating: "MEDIUM",
    approxCost: "AS PER VENDOR",
    enabled: true,
    conditionLogic: "AND",
    conditions: [
      { step: "step_12_eb", dataField: "pf_penalty_applicable", operator: "is_yes", note: "Step 12 — Penalty = YES" },
    ],
  },
  {
    id: "voltage_high",
    sNo: 14,
    shortName: "Voltage High",
    recommendationText:
      "High Voltage observed in Main supply — to be rectified by installing Mainline Stabilizer as per connected load.",
    riskRating: "HIGH",
    approxCost: "AS PER VENDOR",
    enabled: true,
    conditionLogic: "OR",
    conditions: [
      { step: "step_6_electrical", dataField: "voltage_r_n", operator: "gt", value: 270, unit: "V", note: "R-N > 270V" },
      { step: "step_6_electrical", dataField: "voltage_y_n", operator: "gt", value: 270, unit: "V", note: "Y-N > 270V" },
      { step: "step_6_electrical", dataField: "voltage_b_n", operator: "gt", value: 270, unit: "V", note: "B-N > 270V" },
      { step: "step_6_electrical", dataField: "voltage_r_b", operator: "gt", value: 470, unit: "V", note: "R-B > 470V" },
      { step: "step_6_electrical", dataField: "voltage_y_b", operator: "gt", value: 470, unit: "V", note: "Y-B > 470V" },
      { step: "step_6_electrical", dataField: "voltage_r_y", operator: "gt", value: 470, unit: "V", note: "R-Y > 470V" },
    ],
  },
  {
    id: "voltage_low",
    sNo: 15,
    shortName: "Voltage Low",
    recommendationText:
      "Low Voltage observed in Main supply — to be rectified by installing Mainline Stabilizer as per connected load. This also be reported to EB.",
    riskRating: "HIGH",
    approxCost: "AS PER VENDOR",
    enabled: true,
    conditionLogic: "OR",
    conditions: [
      { step: "step_6_electrical", dataField: "voltage_r_n", operator: "lt", value: 180, unit: "V", note: "R-N < 180V" },
      { step: "step_6_electrical", dataField: "voltage_y_n", operator: "lt", value: 180, unit: "V", note: "Y-N < 180V" },
      { step: "step_6_electrical", dataField: "voltage_b_n", operator: "lt", value: 180, unit: "V", note: "B-N < 180V" },
      { step: "step_6_electrical", dataField: "voltage_r_b", operator: "lt", value: 350, unit: "V", note: "R-B < 350V" },
      { step: "step_6_electrical", dataField: "voltage_y_b", operator: "lt", value: 350, unit: "V", note: "Y-B < 350V" },
      { step: "step_6_electrical", dataField: "voltage_r_y", operator: "lt", value: 350, unit: "V", note: "R-Y < 350V" },
    ],
  },
  {
    id: "main_supply_cable",
    sNo: 16,
    shortName: "Main Supply Cable Size",
    recommendationText:
      "Main Electrical Supply cable from EB is observed to be undersized as per connected load. This be reported to EB and appropriate Cable sizing be ensured by the EB.",
    riskRating: "MEDIUM",
    approxCost: "AS PER EB",
    enabled: true,
    conditionLogic: "AND",
    conditions: [
      { step: "step_7_distribution", dataField: "incomer_cable_size", operator: "lte", value: 8, unit: "sqmm", note: "Incomer cable size ≤ 8 sqmm" },
    ],
  },
  {
    id: "dg_no_acoustic",
    sNo: 17,
    shortName: "DG No Acoustic Enclosure",
    recommendationText:
      "DG is found to be installed without soundproofing, which creates Sound pollution and makes it prone to rusting and inefficiency due to no Acoustic enclosure. Acoustic enclosure is recommended.",
    riskRating: "LOW",
    approxCost: "AS PER AMC HOLDER",
    enabled: true,
    conditionLogic: "AND",
    conditions: [
      { step: "step_11_dg", dataField: "dg_soundproof", operator: "is_no", note: "Step 11 — DG Soundproof = NO" },
    ],
  },
  {
    id: "ac_not_working",
    sNo: 18,
    shortName: "AC Not Working",
    recommendationText:
      "ACs found defunct be repaired by AMC holder or replaced, and ensured to be run via standard stabilizers (refer AC details).",
    riskRating: "LOW",
    approxCost: "AS PER AMC HOLDER",
    enabled: true,
    conditionLogic: "OR",
    conditions: [
      { step: "step_9_loadsheet",  dataField: "ac_load_remark", operator: "contains", value: "NW", note: "Step 9 — AC Load remark contains 'NW' or 'nw'" },
      { step: "step_10_atm",       dataField: "ac_load_remark", operator: "contains", value: "NW", note: "Step 10 (ATM) — AC Load remark contains 'NW' or 'nw'" },
    ],
  },
];

// ── Audit Steps reference ────────────────────────────────────────────────────

const AUDIT_STEPS: { value: string; label: string }[] = [
  { value: "step_3_ups",          label: "Step 3 — UPS" },
  { value: "step_6_electrical",   label: "Step 6 — Electrical Panel / Earthing / Voltage" },
  { value: "step_7_distribution", label: "Step 7 — Distribution / DB / Cable" },
  { value: "step_9_loadsheet",    label: "Step 9 — Branch Load Sheet" },
  { value: "step_10_atm",         label: "Step 10 — ATM Load Sheet" },
  { value: "step_11_dg",          label: "Step 11 — DG / Generator" },
  { value: "step_12_eb",          label: "Step 12 — EB / Sanctions / Penalty" },
];

const OPERATORS: { value: Operator; label: string }[] = [
  { value: "lt",       label: "< Less than"                      },
  { value: "lte",      label: "≤ Less than or equal"             },
  { value: "gt",       label: "> Greater than"                   },
  { value: "gte",      label: "≥ Greater than or equal"          },
  { value: "eq",       label: "= Equals (value)"                 },
  { value: "ne",       label: "≠ Not equal (value)"              },
  { value: "ne_field", label: "≠ Not equal to another field"     },
  { value: "between",  label: "⟷ Between (min – max)"           },
  { value: "contains", label: "∈ Contains string"                },
  { value: "is_yes",   label: "✓ Is YES / selected"              },
  { value: "is_no",    label: "✗ Is NO / not selected"           },
];

// ── Risk helpers ──────────────────────────────────────────────────────────────

function riskColor(r: RiskLevel) {
  if (r === "HIGH")   return { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" };
  if (r === "MEDIUM") return { bg: "#ffedd5", color: "#c2410c", border: "#fdba74" };
  return                     { bg: "#f0fdf4", color: "#15803d", border: "#86efac" };
}

function stepLabel(val: string) {
  return AUDIT_STEPS.find(s => s.value === val)?.label ?? val;
}

function operatorLabel(val: string) {
  return OPERATORS.find(o => o.value === val)?.label ?? val;
}

function conditionSummary(c: RuleCondition): string {
  const op = c.operator;
  if (op === "is_yes")   return `${c.dataField} = YES`;
  if (op === "is_no")    return `${c.dataField} = NO`;
  if (op === "ne_field") return `${c.dataField} ≠ ${c.compareField}`;
  if (op === "between")  return `${c.dataField}: ${c.valueMin}–${c.valueMax}${c.unit ? " " + c.unit : ""}`;
  if (op === "contains") return `${c.dataField} contains "${c.value}"`;
  const sym = op === "lt" ? "<" : op === "lte" ? "≤" : op === "gt" ? ">" : op === "gte" ? "≥" : op === "eq" ? "=" : "≠";
  return `${c.dataField} ${sym} ${c.value}${c.unit ? " " + c.unit : ""}`;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const INP: React.CSSProperties = { border: "1px solid #e5e7eb", borderRadius: 7, padding: "7px 10px", fontSize: 12, color: "#374151", background: "#fff", outline: "none", width: "100%", boxSizing: "border-box" as const };
const LBL: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 4 };
const SEL: React.CSSProperties = { ...INP, cursor: "pointer" };

// ── Empty condition factory ───────────────────────────────────────────────────

function emptyCondition(): RuleCondition {
  return { step: "step_7_distribution", dataField: "", operator: "lt", value: "", unit: "" };
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AutoRecommendationsPage() {
  const [rules, setRules] = useState<AutoRecommendation[]>(SEED);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState<"ALL" | RiskLevel>("ALL");
  const [filterStep, setFilterStep] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");
  const [panelRule, setPanelRule] = useState<AutoRecommendation | null>(null);
  const [form, setForm] = useState<AutoRecommendation | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total   = rules.length;
  const enabled = rules.filter(r => r.enabled).length;
  const disabled = total - enabled;
  const highRisk = rules.filter(r => r.riskRating === "HIGH" && r.enabled).length;

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => rules.filter(r => {
    const q = search.toLowerCase();
    if (q && !r.shortName.toLowerCase().includes(q) && !r.recommendationText.toLowerCase().includes(q)) return false;
    if (filterRisk !== "ALL" && r.riskRating !== filterRisk) return false;
    if (filterStep !== "ALL" && !r.conditions.some(c => c.step === filterStep)) return false;
    if (filterStatus === "ENABLED"  && !r.enabled) return false;
    if (filterStatus === "DISABLED" &&  r.enabled) return false;
    return true;
  }), [rules, search, filterRisk, filterStep, filterStatus]);

  // ── Toggle enabled ─────────────────────────────────────────────────────────
  const toggleEnabled = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  // ── Open edit panel ────────────────────────────────────────────────────────
  const openPanel = (rule: AutoRecommendation) => {
    setPanelRule(rule);
    setForm(JSON.parse(JSON.stringify(rule)));
  };

  // ── Save form ──────────────────────────────────────────────────────────────
  const saveForm = () => {
    if (!form) return;
    setRules(prev => prev.map(r => r.id === form.id ? form : r));
    setPanelRule(null);
    setForm(null);
  };

  // ── Form helpers ───────────────────────────────────────────────────────────
  const fp = (key: keyof AutoRecommendation, val: unknown) =>
    setForm(f => f ? { ...f, [key]: val } : f);

  const updateCondition = (idx: number, key: keyof RuleCondition, val: unknown) =>
    setForm(f => {
      if (!f) return f;
      const conds = [...f.conditions];
      conds[idx] = { ...conds[idx], [key]: val };
      return { ...f, conditions: conds };
    });

  const addCondition = () =>
    setForm(f => f ? { ...f, conditions: [...f.conditions, emptyCondition()] } : f);

  const removeCondition = (idx: number) =>
    setForm(f => {
      if (!f) return f;
      const conds = f.conditions.filter((_, i) => i !== idx);
      return { ...f, conditions: conds };
    });

  // ── Export JSON ────────────────────────────────────────────────────────────
  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(rules, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", background: "#f9fafb" }}>

      {/* ── Main scroll area ── */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Auto Recommendations</h1>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
                Rules engine — each rule defines when a recommendation is auto-triggered in the audit report based on measured data.
              </p>
            </div>
            <button onClick={copyJSON}
              style={{ display: "flex", alignItems: "center", gap: 6, background: copied ? "#f0fdf4" : "#111827", color: copied ? "#15803d" : "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <i className={copied ? "ri-check-line" : "ri-code-box-line"} style={{ fontSize: 14 }} />
              {copied ? "Copied!" : "Export JSON"}
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Total Rules",    value: total,    accent: "#6366f1", icon: "ri-list-check-2"       },
              { label: "Active",         value: enabled,  accent: "#10b981", icon: "ri-toggle-line"        },
              { label: "Disabled",       value: disabled, accent: "#9ca3af", icon: "ri-toggle-fill"        },
              { label: "High Risk (On)", value: highRisk, accent: "#dc2626", icon: "ri-alarm-warning-line" },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: "#fff", border: "1px solid #e5e7eb", borderLeft: `4px solid ${s.accent}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: s.accent + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={s.icon} style={{ fontSize: 18, color: s.accent }} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" as const }}>
            <div style={{ position: "relative" as const, flex: "1 1 200px", minWidth: 180 }}>
              <i className="ri-search-line" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#9ca3af" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search rules…"
                style={{ ...INP, paddingLeft: 28 }} />
            </div>
            <select value={filterRisk} onChange={e => setFilterRisk(e.target.value as typeof filterRisk)}
              style={{ ...SEL, flex: "0 0 auto", width: 140 }}>
              <option value="ALL">All Risk</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select value={filterStep} onChange={e => setFilterStep(e.target.value)}
              style={{ ...SEL, flex: "0 0 auto", width: 220 }}>
              <option value="ALL">All Steps</option>
              {AUDIT_STEPS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
              style={{ ...SEL, flex: "0 0 auto", width: 130 }}>
              <option value="ALL">All Status</option>
              <option value="ENABLED">Enabled</option>
              <option value="DISABLED">Disabled</option>
            </select>
            <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: "auto" }}>{filtered.length} of {total}</span>
          </div>

          {/* Rules table */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "36px 48px 1fr 90px 140px 90px 80px 72px", gap: 0, background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "0 12px" }}>
              {["", "#", "Rule & Trigger Condition", "Risk", "Approx Cost", "Step", "Status", ""].map((h, i) => (
                <div key={i} style={{ padding: "9px 8px", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{h}</div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: "48px 24px", textAlign: "center" as const, color: "#9ca3af", fontSize: 13 }}>
                <i className="ri-filter-off-line" style={{ fontSize: 28, display: "block", marginBottom: 8 }} />
                No rules match the current filters.
              </div>
            )}

            {filtered.map((rule, idx) => {
              const rc = riskColor(rule.riskRating);
              const expanded = expandedId === rule.id;
              return (
                <div key={rule.id} style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f3f4f6" : "none", opacity: rule.enabled ? 1 : 0.55 }}>
                  {/* Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "36px 48px 1fr 90px 140px 90px 80px 72px", gap: 0, padding: "0 12px", alignItems: "center", cursor: "default" }}>
                    {/* Expand toggle */}
                    <div style={{ padding: "12px 8px" }}>
                      <button onClick={() => setExpandedId(expanded ? null : rule.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2, borderRadius: 4, lineHeight: 1 }}>
                        <i className={expanded ? "ri-subtract-line" : "ri-add-line"} style={{ fontSize: 14 }} />
                      </button>
                    </div>
                    {/* S.No */}
                    <div style={{ padding: "12px 8px", fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{rule.sNo}</div>
                    {/* Name + text */}
                    <div style={{ padding: "12px 8px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{rule.shortName}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{rule.recommendationText}</div>
                      {/* Condition chips */}
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4, marginTop: 6 }}>
                        {rule.conditions.slice(0, 3).map((c, ci) => (
                          <span key={ci} style={{ fontSize: 10, background: "#f3f4f6", color: "#374151", borderRadius: 4, padding: "2px 6px", fontFamily: "monospace", whiteSpace: "nowrap" as const }}>
                            {c.note ?? conditionSummary(c)}
                          </span>
                        ))}
                        {rule.conditions.length > 3 && (
                          <span style={{ fontSize: 10, background: "#eff6ff", color: "#2563eb", borderRadius: 4, padding: "2px 6px" }}>+{rule.conditions.length - 3} more</span>
                        )}
                        {rule.conditions.length > 1 && (
                          <span style={{ fontSize: 10, background: rule.conditionLogic === "OR" ? "#fef9c3" : "#eff6ff", color: rule.conditionLogic === "OR" ? "#854d0e" : "#1d4ed8", borderRadius: 4, padding: "2px 6px", fontWeight: 700 }}>
                            {rule.conditionLogic}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Risk */}
                    <div style={{ padding: "12px 8px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, borderRadius: 6, padding: "3px 8px" }}>{rule.riskRating}</span>
                    </div>
                    {/* Cost */}
                    <div style={{ padding: "12px 8px", fontSize: 11, color: "#374151", fontWeight: 500 }}>{rule.approxCost}</div>
                    {/* Step count */}
                    <div style={{ padding: "12px 8px", fontSize: 11, color: "#6b7280" }}>
                      {[...new Set(rule.conditions.map(c => c.step))].map(s => {
                        const short = s.replace("step_", "S").replace(/_[a-z]+$/, "").toUpperCase();
                        return <span key={s} style={{ marginRight: 3 }}>{short}</span>;
                      })}
                    </div>
                    {/* Status */}
                    <div style={{ padding: "12px 8px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, background: rule.enabled ? "#f0fdf4" : "#f3f4f6", color: rule.enabled ? "#15803d" : "#9ca3af", borderRadius: 6, padding: "3px 8px" }}>
                        {rule.enabled ? "Active" : "Off"}
                      </span>
                    </div>
                    {/* Actions */}
                    <div style={{ padding: "12px 8px", display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      <button onClick={() => openPanel(rule)}
                        title="Edit" style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#374151" }}>
                        <i className="ri-edit-line" style={{ fontSize: 13 }} />
                      </button>
                      <button onClick={() => toggleEnabled(rule.id)}
                        title={rule.enabled ? "Disable" : "Enable"}
                        style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: rule.enabled ? "#dc2626" : "#15803d" }}>
                        <i className={rule.enabled ? "ri-toggle-fill" : "ri-toggle-line"} style={{ fontSize: 13 }} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded — structured condition table */}
                  {expanded && (
                    <div style={{ padding: "0 12px 16px 60px", background: "#fafafa", borderTop: "1px solid #f0f0f0" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 8, marginTop: 10 }}>
                        Trigger Conditions &nbsp;
                        <span style={{ background: rule.conditionLogic === "OR" ? "#fef9c3" : "#eff6ff", color: rule.conditionLogic === "OR" ? "#854d0e" : "#1d4ed8", borderRadius: 4, padding: "1px 6px", fontWeight: 700, fontSize: 10 }}>
                          {rule.conditionLogic} logic
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {rule.conditions.map((c, ci) => (
                          <div key={ci} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "8px 12px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", minWidth: 18, paddingTop: 1 }}>#{ci + 1}</span>
                            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "180px 1fr 120px 1fr", gap: 8, fontSize: 11, alignItems: "center" }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, marginBottom: 2 }}>Step / Source</div>
                                <div style={{ color: "#374151", fontWeight: 600 }}>{stepLabel(c.step)}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, marginBottom: 2 }}>Data Field</div>
                                <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>{c.dataField}</code>
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, marginBottom: 2 }}>Operator</div>
                                <div style={{ color: "#374151" }}>{operatorLabel(c.operator)}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, marginBottom: 2 }}>Threshold / Reference</div>
                                <div style={{ color: "#374151" }}>
                                  {c.operator === "between"  && `${c.valueMin} – ${c.valueMax}${c.unit ? " " + c.unit : ""}`}
                                  {c.operator === "ne_field" && <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>{c.compareField}</code>}
                                  {c.operator === "is_yes"   && "YES / selected"}
                                  {c.operator === "is_no"    && "NO / not selected"}
                                  {!["between","ne_field","is_yes","is_no"].includes(c.operator) && `${c.value}${c.unit ? " " + c.unit : ""}`}
                                </div>
                              </div>
                            </div>
                            {c.note && (
                              <div style={{ fontSize: 10, color: "#6b7280", maxWidth: 220, fontStyle: "italic", paddingTop: 1 }}>{c.note}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Developer note */}
          <div style={{ background: "#1e293b", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <i className="ri-code-s-slash-line" style={{ fontSize: 18, color: "#7dd3fc", flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>Developer Integration Note</div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>
                Call <code style={{ background: "#0f172a", color: "#7dd3fc", padding: "1px 5px", borderRadius: 3 }}>GET /api/settings/auto-recommendations</code> to fetch the full rule set as JSON. Each rule exposes <code style={{ background: "#0f172a", color: "#7dd3fc", padding: "1px 5px", borderRadius: 3 }}>conditions[]</code> with <code style={{ background: "#0f172a", color: "#7dd3fc", padding: "1px 5px", borderRadius: 3 }}>step</code>, <code style={{ background: "#0f172a", color: "#7dd3fc", padding: "1px 5px", borderRadius: 3 }}>dataField</code>, <code style={{ background: "#0f172a", color: "#7dd3fc", padding: "1px 5px", borderRadius: 3 }}>operator</code>, and <code style={{ background: "#0f172a", color: "#7dd3fc", padding: "1px 5px", borderRadius: 3 }}>value/compareField</code>. The report engine evaluates each condition against the audit&apos;s captured step data, applies <code style={{ background: "#0f172a", color: "#7dd3fc", padding: "1px 5px", borderRadius: 3 }}>conditionLogic</code> (AND / OR), and auto-inserts the <code style={{ background: "#0f172a", color: "#7dd3fc", padding: "1px 5px", borderRadius: 3 }}>recommendationText</code> into the PDF recommendation section with the specified <code style={{ background: "#0f172a", color: "#7dd3fc", padding: "1px 5px", borderRadius: 3 }}>riskRating</code> color.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Slide-in Edit Panel ── */}
      <div style={{ position: "fixed" as const, inset: 0, zIndex: 50, pointerEvents: panelRule ? "auto" : "none" }}>
        {/* Overlay */}
        <div onClick={() => { setPanelRule(null); setForm(null); }}
          style={{ position: "absolute" as const, inset: 0, background: "rgba(0,0,0,0.3)", opacity: panelRule ? 1 : 0, transition: "opacity 220ms" }} />

        {/* Panel */}
        <div style={{ position: "absolute" as const, top: 0, right: 0, bottom: 0, width: 560, background: "#fff", boxShadow: "-8px 0 32px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", transform: panelRule ? "translateX(0)" : "translateX(100%)", transition: "transform 240ms cubic-bezier(.4,0,.2,1)" }}>

          {/* Panel header */}
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <i className="ri-flashlight-line" style={{ fontSize: 18, color: "#6366f1" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Edit Rule</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{panelRule?.shortName}</div>
            </div>
            <button onClick={() => { setPanelRule(null); setForm(null); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6 }}>
              <i className="ri-close-line" style={{ fontSize: 18 }} />
            </button>
          </div>

          {/* Panel body */}
          {form && (
            <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>

              {/* Short name */}
              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Short Name</label>
                <input value={form.shortName} onChange={e => fp("shortName", e.target.value)} style={INP} />
              </div>

              {/* Recommendation text */}
              <div style={{ marginBottom: 14 }}>
                <label style={LBL}>Recommendation Text</label>
                <textarea value={form.recommendationText} onChange={e => fp("recommendationText", e.target.value)}
                  rows={4} style={{ ...INP, resize: "vertical", lineHeight: 1.55 }} />
              </div>

              {/* Risk + Cost row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={LBL}>Risk Rating</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["LOW","MEDIUM","HIGH"] as RiskLevel[]).map(r => {
                      const rc = riskColor(r);
                      const sel = form.riskRating === r;
                      return (
                        <button key={r} onClick={() => fp("riskRating", r)}
                          style={{ flex: 1, fontSize: 11, fontWeight: 700, padding: "6px 4px", borderRadius: 7, border: `1.5px solid ${sel ? rc.border : "#e5e7eb"}`, background: sel ? rc.bg : "#fff", color: sel ? rc.color : "#9ca3af", cursor: "pointer" }}>
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={LBL}>Approx Cost</label>
                  <input value={form.approxCost} onChange={e => fp("approxCost", e.target.value)} style={INP} />
                </div>
              </div>

              {/* Condition Logic */}
              <div style={{ marginBottom: 16 }}>
                <label style={LBL}>Condition Logic</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["OR","AND"] as ConditionLogic[]).map(l => (
                    <button key={l} onClick={() => fp("conditionLogic", l)}
                      style={{ padding: "6px 20px", borderRadius: 7, border: `1.5px solid ${form.conditionLogic === l ? "#6366f1" : "#e5e7eb"}`, background: form.conditionLogic === l ? "#eff6ff" : "#fff", color: form.conditionLogic === l ? "#4f46e5" : "#6b7280", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                      {l}
                      <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 4, color: "#9ca3af" }}>
                        {l === "OR" ? "(any condition)" : "(all conditions)"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ ...LBL, marginBottom: 0 }}>Trigger Conditions</label>
                  <button onClick={addCondition}
                    style={{ fontSize: 11, fontWeight: 600, color: "#4f46e5", background: "#eff6ff", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="ri-add-line" style={{ fontSize: 12 }} /> Add Condition
                  </button>
                </div>

                {form.conditions.map((c, ci) => (
                  <div key={ci} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280" }}>Condition #{ci + 1}</span>
                      {form.conditions.length > 1 && (
                        <button onClick={() => removeCondition(ci)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>
                          <i className="ri-delete-bin-line" />
                        </button>
                      )}
                    </div>

                    {/* Step */}
                    <div style={{ marginBottom: 8 }}>
                      <label style={LBL}>Audit Step / Data Source</label>
                      <select value={c.step} onChange={e => updateCondition(ci, "step", e.target.value)} style={SEL}>
                        {AUDIT_STEPS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>

                    {/* Data field */}
                    <div style={{ marginBottom: 8 }}>
                      <label style={LBL}>Data Field (DB column / JSON key)</label>
                      <input value={c.dataField} onChange={e => updateCondition(ci, "dataField", e.target.value)}
                        placeholder="e.g. incomer_cable_size" style={INP} />
                    </div>

                    {/* Operator */}
                    <div style={{ marginBottom: 8 }}>
                      <label style={LBL}>Operator</label>
                      <select value={c.operator} onChange={e => updateCondition(ci, "operator", e.target.value as Operator)} style={SEL}>
                        {OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>

                    {/* Value fields — conditional */}
                    {!["is_yes","is_no"].includes(c.operator) && (
                      <div style={{ display: "grid", gridTemplateColumns: c.operator === "between" ? "1fr 1fr 80px" : c.operator === "ne_field" ? "1fr 80px" : "1fr 80px", gap: 8, marginBottom: 8 }}>
                        {c.operator === "between" ? (
                          <>
                            <div>
                              <label style={LBL}>Min Value</label>
                              <input value={c.valueMin ?? ""} onChange={e => updateCondition(ci, "valueMin", e.target.value)} style={INP} />
                            </div>
                            <div>
                              <label style={LBL}>Max Value</label>
                              <input value={c.valueMax ?? ""} onChange={e => updateCondition(ci, "valueMax", e.target.value)} style={INP} />
                            </div>
                          </>
                        ) : c.operator === "ne_field" ? (
                          <div>
                            <label style={LBL}>Compare Field</label>
                            <input value={c.compareField ?? ""} onChange={e => updateCondition(ci, "compareField", e.target.value)}
                              placeholder="e.g. incomer_cable_size" style={INP} />
                          </div>
                        ) : (
                          <div>
                            <label style={LBL}>Value / Threshold</label>
                            <input value={c.value ?? ""} onChange={e => updateCondition(ci, "value", e.target.value)} style={INP} />
                          </div>
                        )}
                        <div>
                          <label style={LBL}>Unit</label>
                          <input value={c.unit ?? ""} onChange={e => updateCondition(ci, "unit", e.target.value)}
                            placeholder="V / sqmm…" style={INP} />
                        </div>
                      </div>
                    )}

                    {/* Note */}
                    <div>
                      <label style={LBL}>Human-readable Note (shown as chip in UI)</label>
                      <input value={c.note ?? ""} onChange={e => updateCondition(ci, "note", e.target.value)}
                        placeholder="e.g. Incomer cable size < 12 sqmm" style={INP} />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Panel footer */}
          <div style={{ padding: "14px 20px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, justifyContent: "flex-end", flexShrink: 0 }}>
            <button onClick={() => { setPanelRule(null); setForm(null); }}
              style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={saveForm}
              style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#111827", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Save Rule
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
