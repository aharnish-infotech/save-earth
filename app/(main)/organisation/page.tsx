"use client";
import React, { useState, useMemo, useRef } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface OrgLevel {
  code: string;
  name: string;
  order: number;
  isLeaf?: boolean;
  hasSubType?: boolean;
  canDirectBranch?: boolean; // e.g. HO & LHO in SBI can have branches directly
}

interface BankConfig {
  name: string;
  ifsc?: string;
  levels: OrgLevel[];
}

interface OrgUnit {
  id: string;
  bankCode: string;
  bankName: string;
  level: string;       // "HO" | "LHO" | "AO" | "RBO" | "BRANCH" | "ZO" | "RO" …
  levelOrder: number;
  subType?: string;    // "AO" | "CO" | "MODULE" — only when level="AO" in SBI
  code: string;
  name: string;
  parentId: string | null;
  isActive: boolean;
  skipLevel?: boolean; // branch reports to a unit higher than its normal parent level
}

type FormData = {
  bankCode: string;
  level: string;
  parentId: string;
  name: string;
  isActive: boolean;
};

// ── Auto code generation ───────────────────────────────────────────────────────
// Format: {LEVEL_PREFIX}-{NAME_ABBR}-{SEQ:03d}
// e.g.  LHO-CHA-001  |  BR-MOD-002  |  ZO-NOR-001  |  CO-AMR-001
const STOP_WORDS = new Set(["the","and","of","for","in","at","ho","lho","ao","rbo","zo","ro","co","module","branch","branches","office","local","head","administrative","circle","zone","regional","zonal","national","state","bank","india"]);

function generateCode(bankCode: string, level: string, name: string, existing: OrgUnit[]): string {
  if (!bankCode || !level || !name.trim()) return "";

  // Level prefix — BRANCH shortens to "BR", everything else uses its own code
  const prefix = level === "BRANCH" ? "BR" : level;

  // Name abbreviation: first 3 chars of the first meaningful word
  const words = name.trim().split(/[\s\-_/]+/);
  const meaningful = words.filter(w => w.length > 1 && !STOP_WORDS.has(w.toLowerCase()));
  const src = meaningful.length > 0 ? meaningful[0] : words[0] ?? name;
  const abbr = src.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 3).padEnd(3, "X");

  // Sequence: count existing units for this bank + level prefix
  const count = existing.filter(u =>
    u.bankCode === bankCode && (u.level === "BRANCH" ? "BR" : u.level) === prefix
  ).length;

  const seq = String(count + 1).padStart(3, "0");
  return `${prefix}-${abbr}-${seq}`;
}

// ── Bank hierarchy configurations (metadata-driven) ────────────────────────────
// Standard 4-level hierarchy shared by most PSBs and private banks
const STD_LEVELS: OrgLevel[] = [
  { code: "HO",     name: "Head Office",     order: 1                         },
  { code: "ZO",     name: "Zonal Office",    order: 2                         },
  { code: "RO",     name: "Regional Office", order: 3, canDirectBranch: true  },
  { code: "BRANCH", name: "Branch",          order: 4, isLeaf: true           },
];

const BANK_CONFIGS: Record<string, BankConfig> = {
  // ── Public Sector Banks ──────────────────────────────────────────────────────
  SBIN: {
    name: "State Bank of India",
    levels: [
      { code: "HO",     name: "Head Office",             order: 1, canDirectBranch: true },
      { code: "LHO",    name: "Local Head Office",        order: 2, canDirectBranch: true },
      { code: "AO",     name: "Admin / Circle / Module",  order: 3, hasSubType: true      },
      { code: "RBO",    name: "Regional Business Office", order: 4                        },
      { code: "BRANCH", name: "Branch",                   order: 5, isLeaf: true          },
    ],
  },
  PUNB: {
    name: "Punjab National Bank",
    levels: [
      { code: "HO",     name: "Head Office",     order: 1 },
      { code: "ZO",     name: "Zonal Office",    order: 2 },
      { code: "RO",     name: "Regional Office", order: 3, canDirectBranch: true },
      { code: "BRANCH", name: "Branch",           order: 4, isLeaf: true },
    ],
  },
  CNRB: { name: "Canara Bank",           levels: STD_LEVELS },
  UBIN: { name: "Union Bank of India",   levels: STD_LEVELS },
  BKID: { name: "Bank of India",         levels: STD_LEVELS },
  BARB: { name: "Bank of Baroda",        levels: STD_LEVELS },
  MAHB: { name: "Bank of Maharashtra",   levels: STD_LEVELS },
  CBIN: { name: "Central Bank of India", levels: STD_LEVELS },
  IDIB: { name: "Indian Bank",           levels: STD_LEVELS },
  IBKL: { name: "IDBI Bank",            levels: STD_LEVELS },
  // ── Private Sector Banks ─────────────────────────────────────────────────────
  HDFC: { name: "HDFC Bank",            levels: STD_LEVELS },
  ICIC: { name: "ICICI Bank",           levels: STD_LEVELS },
  UTIB: { name: "Axis Bank",            levels: STD_LEVELS },
  KKBK: { name: "Kotak Mahindra Bank",  levels: STD_LEVELS },
  INDB: { name: "IndusInd Bank",        levels: STD_LEVELS },
  YESB: { name: "Yes Bank",            levels: STD_LEVELS },
};

const uuid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// ── Seed data — reflects real-world SBI + PNB hierarchy ───────────────────────
const SEED: OrgUnit[] = [
  // SBIN — HO is auto-created from the Bank record; only intermediate levels are added here
  { id:"s-lho1", bankCode:"SBIN", bankName:"State Bank of India", level:"LHO",   levelOrder:2, code:"LHO-CHD",   name:"Chandigarh",      parentId:null,    isActive:true  },
  { id:"s-lho2", bankCode:"SBIN", bankName:"State Bank of India", level:"LHO",   levelOrder:2, code:"LHO-MUM",   name:"Mumbai",          parentId:null,    isActive:true  },
  { id:"s-ao1",  bankCode:"SBIN", bankName:"State Bank of India", level:"AO",    levelOrder:3, code:"AO-LDH",    name:"Ludhiana",        parentId:"s-lho1",isActive:true  },
  { id:"s-ao2",  bankCode:"SBIN", bankName:"State Bank of India", level:"AO",    levelOrder:3, code:"CO-AMR",    name:"Amritsar",        parentId:"s-lho1",isActive:true  },
  { id:"s-ao3",  bankCode:"SBIN", bankName:"State Bank of India", level:"AO",    levelOrder:3, code:"AO-MUM1",   name:"Mumbai North",    parentId:"s-lho2",isActive:true  },
  { id:"s-rbo1", bankCode:"SBIN", bankName:"State Bank of India", level:"RBO",   levelOrder:4, code:"RBO-LDH",   name:"Ludhiana",        parentId:"s-ao1", isActive:true  },
  { id:"s-rbo2", bankCode:"SBIN", bankName:"State Bank of India", level:"RBO",   levelOrder:4, code:"RBO-JAL",   name:"Jalandhar",       parentId:"s-ao1", isActive:true  },
  // PUNB — HO auto-created from Bank record
  { id:"p-zo1",  bankCode:"PUNB", bankName:"Punjab National Bank",level:"ZO",    levelOrder:2, code:"ZO-NORTH",  name:"North",           parentId:null,    isActive:true  },
  { id:"p-zo2",  bankCode:"PUNB", bankName:"Punjab National Bank",level:"ZO",    levelOrder:2, code:"ZO-WEST",   name:"West",            parentId:null,    isActive:false },
  { id:"p-rbo1", bankCode:"PUNB", bankName:"Punjab National Bank",level:"RO",    levelOrder:3, code:"RO-DEL",    name:"Delhi",           parentId:"p-zo1", isActive:true  },
];

const EMPTY_FORM: FormData = {
  bankCode: "", level: "", parentId: "", name: "", isActive: true,
};

// ── Level badge colors ─────────────────────────────────────────────────────────
const LEVEL_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  HO:     { color:"#1d4ed8", bg:"#dbeafe", border:"#bfdbfe" },
  LHO:    { color:"#166534", bg:"#dcfce7", border:"#bbf7d0" },
  AO:     { color:"#92400e", bg:"#fef3c7", border:"#fde68a" },
  CO:     { color:"#92400e", bg:"#fef3c7", border:"#fde68a" },
  MODULE: { color:"#92400e", bg:"#fef3c7", border:"#fde68a" },
  RBO:    { color:"#6b21a8", bg:"#f3e8ff", border:"#e9d5ff" },
  ZO:     { color:"#0e7490", bg:"#cffafe", border:"#a5f3fc" },
  RO:     { color:"#0e7490", bg:"#cffafe", border:"#a5f3fc" },
  BRANCH: { color:"#374151", bg:"#f3f4f6", border:"#e5e7eb" },
};

function getLevelStyle(level: string) {
  return LEVEL_STYLE[level] ?? LEVEL_STYLE.BRANCH;
}

// User stores just the location name ("Ludhiana").
// Display appends the level so it reads "Ludhiana — AO" or "Chandigarh — LHO".
// HO stores the full institution name so it shows as-is.
function getDisplayName(unit: OrgUnit): string {
  if (unit.level === "HO") return unit.name;
  const label = unit.level === "BRANCH" ? "Branch" : unit.level;
  return `${unit.name} — ${label}`;
}

// ── Shared style objects (matches codebase convention) ────────────────────────
const TH: React.CSSProperties = { padding:"11px 14px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap", textAlign:"left" };
const TD: React.CSSProperties = { padding:"10px 14px", verticalAlign:"middle", fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };
const LBL: React.CSSProperties = { display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.04em" };
const INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 11px", fontSize:13, color:"#374151", outline:"none", boxSizing:"border-box", background:"#fff" };

// ── Tree flattening (BFS order with depth info) ────────────────────────────────
function flattenTree(
  allNodes: OrgUnit[],
  parentId: string | null,
  depth: number,
  expanded: Set<string>,
  bankFilter: string,
  search: string,
): { node: OrgUnit; depth: number; hasChildren: boolean }[] {
  const children = allNodes.filter(n => n.parentId === parentId
    && (!bankFilter || n.bankCode === bankFilter)
    && (!search || n.name.toLowerCase().includes(search) || n.code.toLowerCase().includes(search))
  );

  // When searching: show all matching nodes regardless of expand state
  const forceExpand = search.length > 0;

  const result: { node: OrgUnit; depth: number; hasChildren: boolean }[] = [];
  for (const child of children) {
    const hasChildren = allNodes.some(n => n.parentId === child.id
      && (!bankFilter || n.bankCode === bankFilter)
    );
    result.push({ node: child, depth, hasChildren });
    if (hasChildren && (expanded.has(child.id) || forceExpand)) {
      result.push(...flattenTree(allNodes, child.id, depth + 1, expanded, bankFilter, search));
    }
  }
  return result;
}

// ── Main page component ────────────────────────────────────────────────────────
export default function OrganisationPage() {
  const [rows, setRows]           = useState<OrgUnit[]>(SEED);
  const [form, setForm]           = useState<FormData>({ ...EMPTY_FORM });
  const [editId, setEditId]       = useState<string | null>(null);
  const [expanded, setExpanded]   = useState<Set<string>>(new Set(["s-ho","s-lho1","s-ao1","p-ho","p-zo1"]));
  const [bankFilter, setBankFilter] = useState("");
  const [search, setSearch]       = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  // ── Derived state ────────────────────────────────────────────────────────────
  const currentBankLevels: OrgLevel[] = useMemo(() =>
    BANK_CONFIGS[form.bankCode]?.levels ?? [], [form.bankCode]);

  const currentLevelDef: OrgLevel | undefined = useMemo(() =>
    currentBankLevels.find(l => l.code === form.level), [currentBankLevels, form.level]);

  // Valid parent units for the selected bank + level
  const validParents: OrgUnit[] = useMemo(() => {
    if (!form.bankCode || !form.level) return [];
    const levels = BANK_CONFIGS[form.bankCode]?.levels ?? [];
    const levelDef = levels.find(l => l.code === form.level);
    if (!levelDef) return [];

    // HO has no parent
    if (levelDef.order === 1) return [];

    // Branch in SBI can go under any non-leaf level (HO, LHO, AO, RBO)
    if (form.level === "BRANCH" && form.bankCode === "SBI") {
      return rows.filter(r => r.bankCode === form.bankCode && !levels.find(l => l.code === r.level)?.isLeaf);
    }

    // Normal: parent must be one level above
    const parentLevel = levels.find(l => l.order === levelDef.order - 1);
    if (!parentLevel) return [];
    return rows.filter(r => r.bankCode === form.bankCode && r.level === parentLevel.code);
  }, [form.bankCode, form.level, rows]);

  // Detect skip-level when a branch is parented to a non-normal level
  const isSkipLevel = useMemo(() => {
    if (form.level !== "BRANCH" || !form.parentId || !form.bankCode) return false;
    const levels = BANK_CONFIGS[form.bankCode]?.levels ?? [];
    const branchDef = levels.find(l => l.code === "BRANCH");
    if (!branchDef) return false;
    const normalParentOrder = branchDef.order - 1;
    const actualParent = rows.find(r => r.id === form.parentId);
    if (!actualParent) return false;
    return actualParent.levelOrder < normalParentOrder;
  }, [form.bankCode, form.level, form.parentId, rows]);

  const normalParentLevel = useMemo(() => {
    if (!form.bankCode || !form.level) return "";
    const levels = BANK_CONFIGS[form.bankCode]?.levels ?? [];
    const levelDef = levels.find(l => l.code === form.level);
    if (!levelDef || levelDef.order === 1) return "";
    const parent = levels.find(l => l.order === levelDef.order - 1);
    return parent?.code ?? "";
  }, [form.bankCode, form.level]);

  // Flatten visible tree rows
  const treeRows = useMemo(() =>
    flattenTree(rows, null, 0, expanded, bankFilter, search),
  [rows, expanded, bankFilter, search]);

  // Stats
  const totalUnits    = rows.length;
  const totalActive   = rows.filter(r => r.isActive).length;
  const totalSkips    = rows.filter(r => r.skipLevel).length;
  const totalBanks    = new Set(rows.map(r => r.bankCode)).size;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(rows.filter(r => rows.some(c => c.parentId === r.id)).map(r => r.id)));
  const collapseAll = () => setExpanded(new Set());

  const fp = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = k === "isActive" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm(f => {
        const next = { ...f, [k]: val };
        // Reset downstream when bank changes
        if (k === "bankCode") { next.level = ""; next.parentId = ""; }
        if (k === "level")    { next.parentId = ""; }
        return next;
      });
    };

  const handleSave = () => {
    if (!form.bankCode || !form.level || !form.name.trim()) return;
    const levelDef = currentBankLevels.find(l => l.code === form.level);

    if (editId) {
      setRows(rs => rs.map(r => r.id === editId ? {
        ...r,
        bankCode: form.bankCode,
        bankName: BANK_CONFIGS[form.bankCode]?.name ?? form.bankCode,
        level: form.level,
        levelOrder: levelDef?.order ?? r.levelOrder,
        code: autoCode,
        name: form.name.trim(),
        parentId: form.parentId || null,
        isActive: form.isActive,
        skipLevel: isSkipLevel,
      } : r));
    } else {
      const newUnit: OrgUnit = {
        id: uuid(),
        bankCode: form.bankCode,
        bankName: BANK_CONFIGS[form.bankCode]?.name ?? form.bankCode,
        level: form.level,
        levelOrder: levelDef?.order ?? 99,
        code: autoCode,
        name: form.name.trim(),
        parentId: form.parentId || null,
        isActive: form.isActive,
        skipLevel: isSkipLevel,
      };
      setRows(rs => [...rs, newUnit]);
      // Auto-expand parent so new node is visible
      if (newUnit.parentId) setExpanded(prev => new Set([...prev, newUnit.parentId!]));
    }

    setForm({ ...EMPTY_FORM });
    setEditId(null);
  };

  const handleEdit = (unit: OrgUnit) => {
    setForm({
      bankCode: unit.bankCode,
      level: unit.level,
      parentId: unit.parentId ?? "",
      name: unit.name,
      isActive: unit.isActive,
    });
    setEditId(unit.id);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 50);
  };

  const handleAddChild = (parentUnit: OrgUnit) => {
    const levels = BANK_CONFIGS[parentUnit.bankCode]?.levels ?? [];
    const parentLevelDef = levels.find(l => l.code === parentUnit.level);
    // Skip BRANCH — branches are managed separately via Branch Addition
    const childLevel = parentLevelDef
      ? levels.find(l => l.order === parentLevelDef.order + 1 && !l.isLeaf)
      : undefined;
    setForm({
      bankCode: parentUnit.bankCode,
      level: childLevel?.code ?? "",
      parentId: parentUnit.id,
      name: "",
      isActive: true,
    });
    setEditId(null);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 50);
  };

  const handleCancel = () => { setForm({ ...EMPTY_FORM }); setEditId(null); };

  const toggleStatus = (id: string) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));

  const editUnit = rows.find(r => r.id === editId) ?? null;

  // When editing preserve the original code; when adding, generate live from form state
  const autoCode = useMemo(() => {
    if (editId) return editUnit?.code ?? "";
    return generateCode(form.bankCode, form.level, form.name, rows);
  }, [editId, editUnit, form.bankCode, form.level, form.name, rows]);

  const canSave  = !!form.bankCode && !!form.level && !!form.name.trim();

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding:"24px 0" }}>

      {/* ── Page header ───────────────────────────────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:4 }}>
        <div>
          <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Organisation</h4>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>
            Dashboard / Banking Structure / <span style={{ color:"#16a34a", fontWeight:600 }}>Organisation</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={expandAll}
            style={{ fontSize:12, color:"#6b7280", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
            <i className="ri-expand-up-down-line" style={{ fontSize:13 }}/>Expand all
          </button>
          <button onClick={collapseAll}
            style={{ fontSize:12, color:"#6b7280", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
            <i className="ri-contract-up-down-line" style={{ fontSize:13 }}/>Collapse
          </button>
        </div>
      </div>

      {/* ── Stats cards ───────────────────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, margin:"16px 0 20px" }}>
        {[
          { label:"Total Units",      value:totalUnits,    color:"#2563eb", bg:"#eff6ff", icon:"ri-organization-chart",   border:"#2563eb" },
          { label:"Active Units",      value:totalActive,   color:"#16a34a", bg:"#f0fdf4", icon:"ri-checkbox-circle-line", border:"#16a34a" },
          { label:"Skip-level Links", value:totalSkips,    color:"#d97706", bg:"#fffbeb", icon:"ri-links-line",           border:"#d97706" },
          { label:"Banks Configured", value:totalBanks,    color:"#7c3aed", bg:"#f5f3ff", icon:"ri-bank-line",            border:"#7c3aed" },
        ].map(c => (
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

      {/* ── Split layout ──────────────────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"390px 1fr", gap:18, alignItems:"start" }}>

        {/* ── LEFT: Form + Cards ────────────────────────────────────────────── */}
        <div ref={formRef} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>

            {/* Form header */}
            <div style={{ padding:"14px 18px", borderBottom:"1px solid #f3f4f6", background: editId ? "#fffbeb" : "#f0fdf4" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:"#111827", display:"flex", alignItems:"center", gap:7 }}>
                    <i className={editId ? "ri-edit-line" : "ri-add-circle-line"} style={{ fontSize:15, color: editId ? "#d97706" : "#16a34a" }}/>
                    {editId ? `Edit — ${editUnit?.code ?? ""}` : "Add Org Unit"}
                  </div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>
                    {editId ? "Modify unit details and update" : "Fill details and save to register unit"}
                  </div>
                </div>
                {editId && (
                  <button onClick={handleCancel} style={{ fontSize:11, color:"#6b7280", background:"#f3f4f6", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:13 }}>

              {/* ── Section: Bank & Level ── */}
              <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", paddingBottom:6, borderBottom:"1px solid #f3f4f6" }}>
                Bank &amp; Level
              </div>

              {/* Bank */}
              <div>
                <label style={LBL}>Bank <span style={{ color:"#dc2626" }}>*</span></label>
                <select value={form.bankCode} onChange={fp("bankCode")} style={{ ...INP, cursor:"pointer" }}>
                  <option value="">Select bank</option>
                  {Object.entries(BANK_CONFIGS).map(([code, cfg]) => (
                    <option key={code} value={code}>{cfg.name} ({code})</option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div>
                <label style={LBL}>Unit Level <span style={{ color:"#dc2626" }}>*</span></label>
                <select
                  value={form.level}
                  onChange={fp("level")}
                  disabled={!form.bankCode}
                  style={{ ...INP, cursor: form.bankCode ? "pointer" : "not-allowed", opacity: form.bankCode ? 1 : 0.5 }}
                >
                  <option value="">{form.bankCode ? "Select level" : "Select bank first"}</option>
                  {currentBankLevels.filter(l => !l.isLeaf && l.order > 1).map(l => (
                    <option key={l.code} value={l.code}>{l.code} — {l.name}</option>
                  ))}
                </select>
                {currentLevelDef?.isLeaf && (
                  <div style={{ fontSize:10, color:"#9ca3af", marginTop:3 }}>
                    <i className="ri-information-line"/> Leaf node — cannot have child units
                  </div>
                )}
              </div>


              {/* ── Section: Reporting to ── */}
              <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", paddingBottom:6, borderBottom:"1px solid #f3f4f6", marginTop:2 }}>
                Reports to
              </div>

              {/* Parent unit */}
              <div>
                <label style={LBL}>Parent unit {form.level !== "HO" && <span style={{ color:"#dc2626" }}>*</span>}</label>
                {form.level === "HO" ? (
                  <div style={{ ...INP, color:"#9ca3af", display:"flex", alignItems:"center" }}>
                    None — HO is the top level
                  </div>
                ) : (
                  <select
                    value={form.parentId}
                    onChange={fp("parentId")}
                    disabled={!form.level}
                    style={{ ...INP, cursor: form.level ? "pointer" : "not-allowed", opacity: form.level ? 1 : 0.5 }}
                  >
                    <option value="">{form.level ? "Select parent unit" : "Select level first"}</option>
                    {validParents.map(p => (
                      <option key={p.id} value={p.id}>{p.code} — {getDisplayName(p)}</option>
                    ))}
                  </select>
                )}

              </div>

              {/* ── Section: Unit details ── */}
              <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", paddingBottom:6, borderBottom:"1px solid #f3f4f6", marginTop:2 }}>
                Unit details
              </div>

              {/* Name — label & placeholder update based on selected level / sub-type */}
              <div>
                {(() => {
                  const effectiveLevel = form.level || "";
                  const placeholders: Record<string, string> = {
                    HO:     "e.g. State Bank of India",
                    LHO:    "e.g. Chandigarh",
                    AO:     "e.g. Ludhiana",
                    RBO:    "e.g. Ludhiana",
                    ZO:     "e.g. North",
                    RO:     "e.g. Delhi",
                  };
                  const displayLabel = !effectiveLevel ? "Location / area name"
                    : effectiveLevel === "HO" ? "HO name"
                    : `${effectiveLevel} name`;
                  return (
                    <>
                      <label style={LBL}>
                        {displayLabel} <span style={{ color:"#dc2626" }}>*</span>
                      </label>
                      <input
                        value={form.name}
                        onChange={fp("name")}
                        placeholder={placeholders[effectiveLevel] ?? `Enter ${displayLabel.toLowerCase()}`}
                        style={INP}
                      />
                    </>
                  );
                })()}
              </div>

              {/* Auto-generated code + Status side by side */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={LBL}>
                    Unit code
                    <span style={{ marginLeft:6, fontSize:9, fontWeight:700, color:"#16a34a", background:"#dcfce7", border:"1px solid #bbf7d0", borderRadius:10, padding:"1px 6px", letterSpacing:"0.04em" }}>
                      AUTO
                    </span>
                  </label>
                  <div style={{ ...INP, fontFamily:"monospace", fontWeight:700, fontSize:13, letterSpacing:"0.08em", background:"#f9fafb", color: autoCode ? "#111827" : "#9ca3af", display:"flex", alignItems:"center", justifyContent:"space-between", gap:6, cursor:"default" }}>
                    <span>{autoCode || (form.bankCode && form.level && form.name ? "Generating…" : "Fill name first")}</span>
                    {autoCode && (
                      <i className="ri-magic-line" style={{ fontSize:13, color:"#16a34a", flexShrink:0 }}/>
                    )}
                  </div>
                  <div style={{ fontSize:10, color:"#9ca3af", marginTop:3 }}>
                    Generated from bank, level &amp; name
                  </div>
                </div>
                <div>
                  <label style={LBL}>Status</label>
                  <div style={{ display:"flex", border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden", height:38 }}>
                    {([true, false] as const).map((val, i) => {
                      const sel = form.isActive === val;
                      const col = val ? "#16a34a" : "#dc2626";
                      return (
                        <button key={String(val)} onClick={() => setForm(f => ({ ...f, isActive: val }))}
                          style={{ flex:1, border:"none", borderRight:i===0?"1px solid #e5e7eb":"none", cursor:"pointer", fontSize:11, fontWeight:700, background: sel ? col : "#fff", color: sel ? "#fff" : col, transition:"all 0.15s" }}>
                          {val ? "Active" : "Inactive"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={!canSave}
                style={{ width:"100%", padding:"10px", borderRadius:8, border:"none", background: !canSave ? "#9ca3af" : editId ? "#2563eb" : "#16a34a", color:"#fff", cursor: !canSave ? "not-allowed" : "pointer", fontWeight:700, fontSize:13, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"background 0.15s" }}>
                <i className={editId ? "ri-save-line" : "ri-add-circle-line"}/>
                {editId ? "Update Unit" : "Save Unit"}
              </button>

            </div>
          </div>

          {/* ── SQL Query Card ──────────────────────────────────────────────────── */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ padding:"11px 16px", borderBottom:"1px solid #e5e7eb", background:"#f8fafc", display:"flex", alignItems:"center", gap:7 }}>
              <i className="ri-database-2-line" style={{ fontSize:14, color:"#7c3aed" }}/>
              <span style={{ fontSize:12, fontWeight:800, color:"#111827" }}>SQL Schema</span>
              <span style={{ fontSize:10, color:"#9ca3af", marginLeft:2 }}>org_units table definition</span>
            </div>
            <pre style={{ margin:0, padding:"14px 16px", fontSize:11, background:"#1e1e2e", overflowX:"auto", overflowY:"auto", maxHeight:300, lineHeight:1.8, fontFamily:"'Courier New', Consolas, monospace", color:"#cdd6f4" }}>{
`CREATE TABLE org_units (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_code    VARCHAR(4)   NOT NULL,          -- IFSC prefix e.g. SBIN, HDFC
  bank_name    VARCHAR(100) NOT NULL,
  level        VARCHAR(10)  NOT NULL,          -- HO | LHO | AO | RBO | ZO | RO
  level_order  SMALLINT     NOT NULL,          -- 1=HO, 2=LHO/ZO, 3=AO/RO, 4=RBO
  code         VARCHAR(20)  NOT NULL UNIQUE,   -- e.g. LHO-CHD-001
  name         VARCHAR(100) NOT NULL,          -- location name only e.g. "Chandigarh"
  parent_id    UUID         REFERENCES org_units(id) ON DELETE RESTRICT,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  skip_level   BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_org_units_bank   ON org_units (bank_code);
CREATE INDEX idx_org_units_parent ON org_units (parent_id);
CREATE INDEX idx_org_units_level  ON org_units (bank_code, level_order);

-- Hierarchy reference
-- SBI  (SBIN): HO(1) → LHO(2) → AO/CO/MO(3) → RBO(4) → Branch (separate table)
-- Others:      HO(1) → ZO(2)  → RO(3)         → Branch (separate table)`
            }</pre>
          </div>

          {/* ── API Payload Card ───────────────────────────────────────────────── */}
          {(() => {
            const autoCode = form.bankCode && form.level && form.name.trim()
              ? generateCode(form.bankCode, form.level, form.name, rows)
              : "(auto-generated on save)";
            const payload = {
              id:          editId ?? "(uuid — auto-generated on save)",
              bankCode:    form.bankCode    || "(select bank)",
              bankName:    BANK_CONFIGS[form.bankCode]?.name ?? "",
              level:       form.level       || "(select level)",
              levelOrder:  form.bankCode && form.level
                ? (BANK_CONFIGS[form.bankCode]?.levels.find(l => l.code === form.level)?.order ?? null)
                : null,
              code:        autoCode,
              name:        form.name        || "(enter name)",
              parentId:    form.parentId    || null,
              isActive:    form.isActive,
              skipLevel:   false,
            };
            const json = JSON.stringify(payload, null, 2);
            return (
              <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ padding:"11px 16px", borderBottom:"1px solid #e5e7eb", background:"#f8fafc", display:"flex", alignItems:"center", gap:7 }}>
                  <i className="ri-code-s-slash-line" style={{ fontSize:14, color:"#2563eb" }}/>
                  <span style={{ fontSize:12, fontWeight:800, color:"#111827" }}>API Payload</span>
                  <span style={{ fontSize:10, color:"#9ca3af", marginLeft:2 }}>POST /api/v1/org-units</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(json)}
                    style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4, padding:"3px 9px", borderRadius:6, border:"1px solid #e5e7eb", background:"#f3f4f6", color:"#374151", fontSize:10, fontWeight:700, cursor:"pointer" }}>
                    <i className="ri-file-copy-line" style={{ fontSize:11 }}/>Copy
                  </button>
                </div>
                <pre style={{ margin:0, padding:"14px 16px", fontSize:11, background:"#0d1117", overflowX:"auto", overflowY:"auto", maxHeight:260, lineHeight:1.7, fontFamily:"'Courier New', Consolas, monospace", color:"#e6edf3" }}>
                  {json}
                </pre>
              </div>
            );
          })()}

        </div>

        {/* ── RIGHT: Tree table ─────────────────────────────────────────────── */}
        <div>

          {/* Toolbar */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            <div style={{ fontSize:12, color:"#6b7280" }}>
              Showing <strong style={{ color:"#111827" }}>{treeRows.length}</strong> units
            </div>
            <div style={{ flex:1 }}/>
            <select value={bankFilter} onChange={e => setBankFilter(e.target.value)} style={SEL}>
              <option value="">All banks</option>
              {Object.entries(BANK_CONFIGS).map(([code, cfg]) => (
                <option key={code} value={code}>{cfg.name}</option>
              ))}
            </select>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 10px" }}>
              <i className="ri-search-line" style={{ color:"#9ca3af", fontSize:13 }}/>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name or code…"
                style={{ border:"none", outline:"none", fontSize:12, color:"#374151", width:160 }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, fontSize:14, lineHeight:1 }}>×</button>
              )}
            </div>
          </div>

          {/* Tree table */}
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:560 }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, width:"40%" }}>UNIT NAME</th>
                    <th style={TH}>LEVEL</th>
                    <th style={TH}>CODE</th>
                    <th style={TH}>BANK</th>
                    <th style={{ ...TH, textAlign:"center" }}>STATUS</th>
                    <th style={{ ...TH, textAlign:"center" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {treeRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding:"50px", textAlign:"center", color:"#9ca3af" }}>
                        <i className="ri-sitemap-line" style={{ fontSize:32, display:"block", marginBottom:8, opacity:0.3 }}/>
                        No units found. Add your first org unit using the form.
                      </td>
                    </tr>
                  ) : treeRows.map(({ node, depth, hasChildren }) => {
                    const isEditing = editId === node.id;
                    const lvlLabel  = node.level === "BRANCH" ? "Branch" : node.level;
                    const lvlStyle  = getLevelStyle(node.level);

                    return (
                      <tr key={node.id}
                        style={{ background: isEditing ? "#fffbeb" : "transparent", transition:"background 0.15s" }}
                        onMouseEnter={e => { if (!isEditing) e.currentTarget.style.background = "#f9fafb"; }}
                        onMouseLeave={e => { if (!isEditing) e.currentTarget.style.background = "transparent"; }}
                      >
                        {/* Name column — indented by depth */}
                        <td style={{ ...TD, paddingLeft: 14 + depth * 22 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            {/* Expand / collapse toggle */}
                            <button
                              onClick={() => hasChildren && toggleExpand(node.id)}
                              style={{ width:18, height:18, borderRadius:4, border:"none", background:"transparent", cursor: hasChildren ? "pointer" : "default", display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af", flexShrink:0, padding:0 }}
                              aria-label={expanded.has(node.id) ? "collapse" : "expand"}
                            >
                              {hasChildren
                                ? <i className={expanded.has(node.id) ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"} style={{ fontSize:15 }}/>
                                : <i className="ri-checkbox-blank-circle-fill" style={{ fontSize:5, color:"#d1d5db" }}/>
                              }
                            </button>

                            <span style={{ fontWeight: depth === 0 ? 800 : depth === 1 ? 700 : 500, color:"#111827", fontSize:13 }}>
                              {getDisplayName(node)}
                            </span>

                            {/* Skip-level badge */}
                            {node.skipLevel && (
                              <span style={{ fontSize:9, fontWeight:700, color:"#b45309", background:"#fef3c7", border:"1px solid #fde68a", borderRadius:10, padding:"1px 6px", flexShrink:0 }}>
                                SKIP
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Level badge */}
                        <td style={TD}>
                          <span style={{ fontSize:10, fontWeight:700, color:lvlStyle.color, background:lvlStyle.bg, border:`1px solid ${lvlStyle.border}`, borderRadius:20, padding:"2px 9px", whiteSpace:"nowrap" }}>
                            {lvlLabel}
                          </span>
                        </td>

                        {/* Code */}
                        <td style={TD}>
                          <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:700, color:"#374151", background:"#f3f4f6", borderRadius:5, padding:"2px 8px" }}>
                            {node.code}
                          </span>
                        </td>

                        {/* Bank */}
                        <td style={{ ...TD, fontSize:12, color:"#6b7280" }}>{node.bankCode}</td>

                        {/* Status toggle */}
                        <td style={{ ...TD, textAlign:"center" }}>
                          <button onClick={() => toggleStatus(node.id)}
                            style={{ fontSize:10, fontWeight:700, color: node.isActive ? "#16a34a" : "#dc2626", background: node.isActive ? "#dcfce7" : "#fee2e2", border:"none", borderRadius:20, padding:"3px 10px", cursor:"pointer" }}>
                            {node.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ ...TD, textAlign:"center" }}>
                          <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
                            {/* Add child */}
                            {!currentLevelDef?.isLeaf && !BANK_CONFIGS[node.bankCode]?.levels.find(l => l.code === node.level)?.isLeaf && (
                              <button onClick={() => handleAddChild(node)} title="Add child unit"
                                style={{ width:28, height:28, borderRadius:6, border:"1px solid #e5e7eb", background:"#f0fdf4", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#16a34a" }}>
                                <i className="ri-add-line" style={{ fontSize:14 }}/>
                              </button>
                            )}
                            {/* Edit */}
                            <button onClick={() => handleEdit(node)} title="Edit unit"
                              style={{ width:28, height:28, borderRadius:6, border:`1px solid ${isEditing ? "#fbbf24" : "#e5e7eb"}`, background: isEditing ? "#fef9c3" : "transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color: isEditing ? "#d97706" : "#2563eb" }}>
                              <i className="ri-edit-line" style={{ fontSize:13 }}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{ padding:"10px 16px", borderTop:"1px solid #f3f4f6", background:"#fafafa", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:11, color:"#6b7280" }}>
                <strong style={{ color:"#111827" }}>{treeRows.length}</strong> units visible
                {" · "}
                <strong style={{ color:"#111827" }}>{rows.filter(r => r.skipLevel).length}</strong> skip-level links
                {bankFilter && ` · Filtered to ${BANK_CONFIGS[bankFilter]?.name ?? bankFilter}`}
              </span>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <span style={{ fontSize:10, color:"#9ca3af" }}>Legend:</span>
                {[
                  { code:"HO", label:"Head Office" },
                  { code:"LHO", label:"LHO" },
                  { code:"AO", label:"AO/CO" },
                  { code:"RBO", label:"RBO" },
                  { code:"ZO", label:"ZO" },
                  { code:"BRANCH", label:"Branch" },
                ].map(({ code, label }) => {
                  const st = getLevelStyle(code);
                  return (
                    <span key={code} style={{ fontSize:9, fontWeight:700, color:st.color, background:st.bg, border:`1px solid ${st.border}`, borderRadius:10, padding:"1px 7px" }}>
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
