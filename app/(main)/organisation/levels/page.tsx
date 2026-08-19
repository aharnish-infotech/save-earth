"use client";
import React, { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface HierarchyLevel {
  id: string;
  bankCode: string;
  bankName: string;
  code: string;
  name: string;
  levelOrder: number;
  isLeaf: boolean;
  hasSubType: boolean;
  canDirectBranch: boolean;
}

const uuid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// ── Seed — default hierarchy definitions per bank ─────────────────────────────
const SEED: HierarchyLevel[] = [
  // SBIN
  { id:uuid(), bankCode:"SBIN", bankName:"State Bank of India",  code:"HO",     name:"Head Office",             levelOrder:1, isLeaf:false, hasSubType:false, canDirectBranch:true  },
  { id:uuid(), bankCode:"SBIN", bankName:"State Bank of India",  code:"LHO",    name:"Local Head Office",        levelOrder:2, isLeaf:false, hasSubType:false, canDirectBranch:true  },
  { id:uuid(), bankCode:"SBIN", bankName:"State Bank of India",  code:"AO",     name:"Admin / Circle / Module",  levelOrder:3, isLeaf:false, hasSubType:true,  canDirectBranch:false },
  { id:uuid(), bankCode:"SBIN", bankName:"State Bank of India",  code:"RBO",    name:"Regional Business Office", levelOrder:4, isLeaf:false, hasSubType:false, canDirectBranch:false },
  { id:uuid(), bankCode:"SBIN", bankName:"State Bank of India",  code:"BRANCH", name:"Branch",                   levelOrder:5, isLeaf:true,  hasSubType:false, canDirectBranch:false },
  // PUNB
  { id:uuid(), bankCode:"PUNB", bankName:"Punjab National Bank", code:"HO",     name:"Head Office",     levelOrder:1, isLeaf:false, hasSubType:false, canDirectBranch:false },
  { id:uuid(), bankCode:"PUNB", bankName:"Punjab National Bank", code:"ZO",     name:"Zonal Office",    levelOrder:2, isLeaf:false, hasSubType:false, canDirectBranch:false },
  { id:uuid(), bankCode:"PUNB", bankName:"Punjab National Bank", code:"RO",     name:"Regional Office", levelOrder:3, isLeaf:false, hasSubType:false, canDirectBranch:true  },
  { id:uuid(), bankCode:"PUNB", bankName:"Punjab National Bank", code:"BRANCH", name:"Branch",           levelOrder:4, isLeaf:true,  hasSubType:false, canDirectBranch:false },
  // HDFC
  { id:uuid(), bankCode:"HDFC", bankName:"HDFC Bank",            code:"HO",     name:"Head Office",     levelOrder:1, isLeaf:false, hasSubType:false, canDirectBranch:false },
  { id:uuid(), bankCode:"HDFC", bankName:"HDFC Bank",            code:"ZO",     name:"Zonal Office",    levelOrder:2, isLeaf:false, hasSubType:false, canDirectBranch:false },
  { id:uuid(), bankCode:"HDFC", bankName:"HDFC Bank",            code:"RO",     name:"Regional Office", levelOrder:3, isLeaf:false, hasSubType:false, canDirectBranch:true  },
  { id:uuid(), bankCode:"HDFC", bankName:"HDFC Bank",            code:"BRANCH", name:"Branch",           levelOrder:4, isLeaf:true,  hasSubType:false, canDirectBranch:false },
];

type FormData = Omit<HierarchyLevel, "id">;
const EMPTY: FormData = { bankCode:"", bankName:"", code:"", name:"", levelOrder:1, isLeaf:false, hasSubType:false, canDirectBranch:false };

const BANKS = [
  // Public Sector Banks
  { code:"SBIN", name:"State Bank of India"    },
  { code:"PUNB", name:"Punjab National Bank"   },
  { code:"CNRB", name:"Canara Bank"            },
  { code:"UBIN", name:"Union Bank of India"    },
  { code:"BKID", name:"Bank of India"          },
  { code:"BARB", name:"Bank of Baroda"         },
  { code:"MAHB", name:"Bank of Maharashtra"    },
  { code:"CBIN", name:"Central Bank of India"  },
  { code:"IDIB", name:"Indian Bank"            },
  { code:"IBKL", name:"IDBI Bank"              },
  // Private Sector Banks
  { code:"HDFC", name:"HDFC Bank"              },
  { code:"ICIC", name:"ICICI Bank"             },
  { code:"UTIB", name:"Axis Bank"              },
  { code:"KKBK", name:"Kotak Mahindra Bank"    },
  { code:"INDB", name:"IndusInd Bank"          },
  { code:"YESB", name:"Yes Bank"               },
];

const TH: React.CSSProperties = { padding:"11px 14px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap", textAlign:"left" };
const TD: React.CSSProperties = { padding:"10px 14px", verticalAlign:"middle", fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const SEL: React.CSSProperties = { border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#374151", background:"#fff", outline:"none", cursor:"pointer" };
const LBL: React.CSSProperties = { display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.04em" };
const INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 11px", fontSize:13, color:"#374151", outline:"none", boxSizing:"border-box", background:"#fff" };

export default function HierarchyLevelsPage() {
  const [rows, setRows]       = useState<HierarchyLevel[]>(SEED);
  const [form, setForm]       = useState<FormData>({ ...EMPTY });
  const [editId, setEditId]   = useState<string | null>(null);
  const [bankFilter, setBankFilter] = useState("All Banks");

  const fp = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = k === "isLeaf" || k === "hasSubType" || k === "canDirectBranch"
      ? (e.target as HTMLInputElement).checked
      : k === "levelOrder" ? +e.target.value
      : e.target.value;
    setForm(f => {
      const next = { ...f, [k]: val };
      if (k === "bankCode") next.bankName = BANKS.find(b => b.code === String(val))?.name ?? String(val);
      return next;
    });
  };

  const filteredRows = rows.filter(r => bankFilter === "All Banks" || r.bankCode === bankFilter);
  const groupedBanks = [...new Set(rows.map(r => r.bankCode))];

  const handleSave = () => {
    if (!form.bankCode || !form.code.trim() || !form.name.trim()) return;
    if (editId) {
      setRows(rs => rs.map(r => r.id === editId ? { ...r, ...form, code: form.code.toUpperCase() } : r));
    } else {
      setRows(rs => [...rs, { id: uuid(), ...form, code: form.code.toUpperCase() }]);
    }
    setForm({ ...EMPTY }); setEditId(null);
  };

  const handleEdit = (r: HierarchyLevel) => {
    setForm({ bankCode:r.bankCode, bankName:r.bankName, code:r.code, name:r.name, levelOrder:r.levelOrder, isLeaf:r.isLeaf, hasSubType:r.hasSubType, canDirectBranch:r.canDirectBranch });
    setEditId(r.id);
  };
  const handleCancel = () => { setForm({ ...EMPTY }); setEditId(null); };
  const handleDelete = (id: string) => setRows(rs => rs.filter(r => r.id !== id));

  const editRow = rows.find(r => r.id === editId);
  const canSave = !!form.bankCode && !!form.code.trim() && !!form.name.trim();

  return (
    <div style={{ padding:"24px 0" }}>
      <div style={{ marginBottom:4 }}>
        <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Hierarchy Levels</h4>
        <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>
          Dashboard / Banking Structure / Organisation / <span style={{ color:"#16a34a", fontWeight:600 }}>Hierarchy Levels</span>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"12px 16px", marginBottom:16, display:"flex", gap:10, alignItems:"flex-start", fontSize:13, color:"#1d4ed8" }}>
        <i className="ri-information-line" style={{ fontSize:16, flexShrink:0, marginTop:1 }}/>
        <span>Hierarchy levels define the chain of command for each bank. SBI has 5 levels (HO → LHO → AO → RBO → Branch), other banks may have 3–4. These definitions power the Organisation page dropdowns automatically.</span>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, margin:"0 0 20px" }}>
        {[
          { label:"Total Levels",    value:rows.length,                                    color:"#2563eb", bg:"#eff6ff", icon:"ri-layers-line",         border:"#2563eb" },
          { label:"Banks Configured",value:groupedBanks.length,                            color:"#16a34a", bg:"#f0fdf4", icon:"ri-bank-line",            border:"#16a34a" },
          { label:"Sub-type Levels", value:rows.filter(r=>r.hasSubType).length,            color:"#d97706", bg:"#fffbeb", icon:"ri-git-branch-line",      border:"#d97706" },
          { label:"Skip-capable",    value:rows.filter(r=>r.canDirectBranch).length,       color:"#7c3aed", bg:"#f5f3ff", icon:"ri-arrow-up-double-line", border:"#7c3aed" },
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

      <div style={{ display:"grid", gridTemplateColumns:"360px 1fr", gap:18, alignItems:"start" }}>

        {/* LEFT: Form */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", position:"sticky", top:80 }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #f3f4f6", background: editId ? "#fffbeb" : "#f0fdf4" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:"#111827", display:"flex", alignItems:"center", gap:7 }}>
                  <i className={editId ? "ri-edit-line" : "ri-add-circle-line"} style={{ fontSize:15, color: editId ? "#d97706" : "#16a34a" }}/>
                  {editId ? `Edit — ${editRow?.bankCode} ${editRow?.code}` : "Add Hierarchy Level"}
                </div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>Define a level in a bank's hierarchy</div>
              </div>
              {editId && <button onClick={handleCancel} style={{ fontSize:11, color:"#6b7280", background:"#f3f4f6", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>Cancel</button>}
            </div>
          </div>

          <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:13 }}>

            <div>
              <label style={LBL}>Bank <span style={{ color:"#dc2626" }}>*</span></label>
              <select value={form.bankCode} onChange={fp("bankCode")} style={{ ...INP, cursor:"pointer" }}>
                <option value="">Select bank</option>
                {BANKS.map(b => <option key={b.code} value={b.code}>{b.name} ({b.code})</option>)}
              </select>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:10 }}>
              <div>
                <label style={LBL}>Level code <span style={{ color:"#dc2626" }}>*</span></label>
                <input
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. LHO, ZO, RBO"
                  style={{ ...INP, fontFamily:"monospace", fontWeight:700, letterSpacing:"0.06em" }}
                />
              </div>
              <div>
                <label style={LBL}>Order</label>
                <input type="number" min={1} max={10} value={form.levelOrder} onChange={fp("levelOrder")} style={INP}/>
              </div>
            </div>

            <div>
              <label style={LBL}>Level name <span style={{ color:"#dc2626" }}>*</span></label>
              <input value={form.name} onChange={fp("name")} placeholder="e.g. Local Head Office" style={INP}/>
            </div>

            {/* Flags */}
            <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", paddingBottom:6, borderBottom:"1px solid #f3f4f6" }}>
              Behaviour flags
            </div>

            {[
              { key:"isLeaf",          label:"Leaf node (Branch level)", hint:"Cannot have child units. Used for the lowest level." },
              { key:"hasSubType",      label:"Has sub-types (e.g. AO/CO/MODULE)", hint:"Allows sub-type selection within this level." },
              { key:"canDirectBranch", label:"Can have branches directly", hint:"Skip-level: branches can report directly to this level." },
            ].map(({ key, label, hint }) => (
              <label key={key} style={{ display:"flex", gap:10, alignItems:"flex-start", cursor:"pointer" }}>
                <input
                  type="checkbox"
                  checked={!!(form as Record<string, unknown>)[key]}
                  onChange={fp(key as keyof FormData)}
                  style={{ marginTop:2, width:15, height:15, accentColor:"#16a34a", flexShrink:0 }}
                />
                <div>
                  <div style={{ fontSize:13, color:"#111827", fontWeight:500 }}>{label}</div>
                  <div style={{ fontSize:11, color:"#9ca3af" }}>{hint}</div>
                </div>
              </label>
            ))}

            <button
              onClick={handleSave}
              disabled={!canSave}
              style={{ width:"100%", padding:"10px", borderRadius:8, border:"none", background: !canSave ? "#9ca3af" : editId ? "#2563eb" : "#16a34a", color:"#fff", cursor: !canSave ? "not-allowed" : "pointer", fontWeight:700, fontSize:13, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <i className={editId ? "ri-save-line" : "ri-add-circle-line"}/>
              {editId ? "Update Level" : "Save Level"}
            </button>

          </div>
        </div>

        {/* RIGHT: Table */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ fontSize:12, color:"#6b7280" }}>
              Showing <strong style={{ color:"#111827" }}>{filteredRows.length}</strong> levels
            </div>
            <div style={{ flex:1 }}/>
            <select value={bankFilter} onChange={e => setBankFilter(e.target.value)} style={SEL}>
              <option value="All Banks">All Banks</option>
              {groupedBanks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>
                <th style={TH}>BANK</th>
                <th style={TH}>LEVEL CODE</th>
                <th style={TH}>LEVEL NAME</th>
                <th style={{ ...TH, textAlign:"center" }}>ORDER</th>
                <th style={{ ...TH, textAlign:"center" }}>LEAF</th>
                <th style={{ ...TH, textAlign:"center" }}>SUB-TYPE</th>
                <th style={{ ...TH, textAlign:"center" }}>DIRECT BR.</th>
                <th style={{ ...TH, textAlign:"center" }}>ACTIONS</th>
              </tr></thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding:"40px", textAlign:"center", color:"#9ca3af" }}>
                    <i className="ri-layers-line" style={{ fontSize:28, display:"block", marginBottom:6, opacity:0.3 }}/>
                    No levels configured for this bank yet.
                  </td></tr>
                ) : filteredRows
                  .sort((a, b) => a.bankCode.localeCompare(b.bankCode) || a.levelOrder - b.levelOrder)
                  .map(r => {
                    const isEd = editId === r.id;
                    return (
                      <tr key={r.id}
                        style={{ background: isEd ? "#fffbeb" : "transparent" }}
                        onMouseEnter={e => { if (!isEd) e.currentTarget.style.background = "#f9fafb"; }}
                        onMouseLeave={e => { if (!isEd) e.currentTarget.style.background = "transparent"; }}>
                        <td style={TD}>
                          <span style={{ fontSize:11, fontWeight:700, color:"#2563eb", background:"#dbeafe", borderRadius:5, padding:"2px 8px", fontFamily:"monospace" }}>{r.bankCode}</span>
                        </td>
                        <td style={TD}>
                          <span style={{ fontSize:12, fontWeight:800, fontFamily:"monospace", color:"#111827", background:"#f3f4f6", borderRadius:5, padding:"2px 8px" }}>{r.code}</span>
                        </td>
                        <td style={{ ...TD, fontWeight:500 }}>{r.name}</td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <span style={{ fontWeight:800, color:"#374151" }}>#{r.levelOrder}</span>
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          {r.isLeaf
                            ? <i className="ri-checkbox-circle-fill" style={{ color:"#16a34a", fontSize:16 }}/>
                            : <i className="ri-close-circle-line" style={{ color:"#d1d5db", fontSize:16 }}/>}
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          {r.hasSubType
                            ? <i className="ri-checkbox-circle-fill" style={{ color:"#d97706", fontSize:16 }}/>
                            : <i className="ri-close-circle-line" style={{ color:"#d1d5db", fontSize:16 }}/>}
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          {r.canDirectBranch
                            ? <i className="ri-checkbox-circle-fill" style={{ color:"#7c3aed", fontSize:16 }}/>
                            : <i className="ri-close-circle-line" style={{ color:"#d1d5db", fontSize:16 }}/>}
                        </td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
                            <button onClick={() => handleEdit(r)} title="Edit"
                              style={{ width:28, height:28, borderRadius:6, border:`1px solid ${isEd?"#fbbf24":"#e5e7eb"}`, background:isEd?"#fef9c3":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:isEd?"#d97706":"#2563eb" }}>
                              <i className="ri-edit-line" style={{ fontSize:13 }}/>
                            </button>
                            <button onClick={() => handleDelete(r.id)} title="Delete"
                              style={{ width:28, height:28, borderRadius:6, border:"1px solid #fee2e2", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}>
                              <i className="ri-delete-bin-line" style={{ fontSize:13 }}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
