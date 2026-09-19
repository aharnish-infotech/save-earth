"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  BankConfig, BankLevel,
  getBankConfigs, saveBankConfigs, DEFAULT_BANK_CONFIGS, getLevelStyle,
} from "@/lib/bank-hierarchy-store";

// ── Helpers ────────────────────────────────────────────────────────────────────
const uuid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

const EMPTY_BANK: Omit<BankConfig, "levels"> = { code: "", name: "", hoCity: "" };
const EMPTY_LEVEL: Omit<BankLevel, "order"> = { code: "", name: "" };

// Reserved level codes — always present for structural reasons
const RESERVED = new Set(["HO", "BRANCH"]);

// ── Styles ─────────────────────────────────────────────────────────────────────
const TH: React.CSSProperties = { padding:"10px 14px", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap", textAlign:"left" };
const TD: React.CSSProperties = { padding:"10px 14px", verticalAlign:"middle", fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" };
const LBL: React.CSSProperties = { display:"block", fontSize:10, fontWeight:700, color:"#6b7280", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.04em" };
const INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 11px", fontSize:13, color:"#374151", outline:"none", boxSizing:"border-box", background:"#fff" };

// lvlColor: looks up the level in the bank config for palette-based colors
function lvlColor(code: string, bank?: BankConfig) {
  return getLevelStyle(code, bank);
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HierarchyBuilderPage() {
  const [configs, setConfigs]           = useState<BankConfig[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [bankForm, setBankForm]         = useState({ ...EMPTY_BANK });
  const [addingBank, setAddingBank]     = useState(false);
  const [addingLevel, setAddingLevel]   = useState(false);
  const [newLevel, setNewLevel]         = useState<Omit<BankLevel, "order">>({ ...EMPTY_LEVEL });
  const [saved, setSaved]               = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const cfg = getBankConfigs();
    setConfigs(cfg);
    if (cfg.length > 0) setSelectedCode(cfg[0].code);
  }, []);

  const selectedBank = configs.find(c => c.code === selectedCode) ?? null;

  // ── Persist ──────────────────────────────────────────────────────────────────
  const persist = useCallback((next: BankConfig[]) => {
    saveBankConfigs(next);
    setConfigs(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  // ── Bank actions ─────────────────────────────────────────────────────────────
  const handleAddBank = () => {
    const code = bankForm.code.trim().toUpperCase();
    const name = bankForm.name.trim();
    const hoCity = bankForm.hoCity.trim();
    if (!code || !name || !hoCity) return;
    if (configs.some(c => c.code === code)) return;

    const newBank: BankConfig = {
      code, name, hoCity,
      levels: [
        { code: "HO",     name: "Head Office", order: 1 },
        { code: "BRANCH", name: "Branch",       order: 2, isLeaf: true },
      ],
    };
    const next = [...configs, newBank];
    persist(next);
    setSelectedCode(code);
    setBankForm({ ...EMPTY_BANK });
    setAddingBank(false);
  };

  const handleDeleteBank = (code: string) => {
    const next = configs.filter(c => c.code !== code);
    persist(next);
    setSelectedCode(next[0]?.code ?? "");
  };

  // ── Level actions ─────────────────────────────────────────────────────────────
  const updateBank = (updated: BankConfig) => {
    const next = configs.map(c => c.code === updated.code ? updated : c);
    persist(next);
  };

  const handleAddLevel = () => {
    if (!selectedBank) return;
    const code = newLevel.code.trim().toUpperCase();
    const name = newLevel.name.trim();
    if (!code || !name) return;
    if (selectedBank.levels.some(l => l.code === code)) return;

    // Insert before BRANCH (always last)
    const withoutBranch = selectedBank.levels.filter(l => l.code !== "BRANCH");
    const branch = selectedBank.levels.find(l => l.code === "BRANCH");
    const inserted: BankLevel = { ...newLevel, code, name, order: 0 };

    const reordered = [
      ...withoutBranch,
      inserted,
      ...(branch ? [branch] : []),
    ].map((l, i) => ({ ...l, order: i + 1 }));

    updateBank({ ...selectedBank, levels: reordered });
    setNewLevel({ ...EMPTY_LEVEL });
    setAddingLevel(false);
  };

  const handleDeleteLevel = (code: string) => {
    if (!selectedBank || RESERVED.has(code)) return;
    const next = selectedBank.levels
      .filter(l => l.code !== code)
      .map((l, i) => ({ ...l, order: i + 1 }));
    updateBank({ ...selectedBank, levels: next });
  };

  const handleMoveLevel = (code: string, dir: "up" | "down") => {
    if (!selectedBank) return;
    const levels = [...selectedBank.levels];
    const idx = levels.findIndex(l => l.code === code);
    if (idx < 0) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= levels.length) return;
    // Don't allow moving HO or BRANCH
    if (RESERVED.has(levels[swapIdx].code)) return;
    [levels[idx], levels[swapIdx]] = [levels[swapIdx], levels[idx]];
    const reordered = levels.map((l, i) => ({ ...l, order: i + 1 }));
    updateBank({ ...selectedBank, levels: reordered });
  };

  const toggleFlag = (levelCode: string, flag: "isLeaf" | "canDirectBranch" | "hasSubType") => {
    if (!selectedBank || RESERVED.has(levelCode)) return;
    const levels = selectedBank.levels.map(l =>
      l.code === levelCode ? { ...l, [flag]: !l[flag] } : l
    );
    updateBank({ ...selectedBank, levels });
  };

  const handleResetDefaults = () => {
    persist([...DEFAULT_BANK_CONFIGS]);
    setSelectedCode(DEFAULT_BANK_CONFIGS[0]?.code ?? "");
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding:"24px 0" }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom:24, display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ri-node-tree" style={{ fontSize:18, color:"#fff" }}/>
            </div>
            <div>
              <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:"#111827" }}>Hierarchy Builder</h1>
              <p style={{ margin:0, fontSize:12, color:"#6b7280" }}>Configure bank org hierarchy levels — used across Org Units</p>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {saved && (
            <span style={{ fontSize:12, fontWeight:600, color:"#16a34a", background:"#dcfce7", border:"1px solid #bbf7d0", borderRadius:8, padding:"5px 12px", display:"flex", alignItems:"center", gap:5 }}>
              <i className="ri-check-line"/>Saved
            </span>
          )}
          <button onClick={handleResetDefaults}
            style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", fontSize:12, fontWeight:600, color:"#6b7280", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            <i className="ri-refresh-line" style={{ fontSize:13 }}/>Reset to defaults
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:20, alignItems:"start" }}>

        {/* ── LEFT — Bank list ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

          {/* Bank cards */}
          {configs.map(bank => {
            const isSelected = bank.code === selectedCode;
            const midLevels = bank.levels.filter(l => !RESERVED.has(l.code));
            return (
              <div key={bank.code}
                onClick={() => setSelectedCode(bank.code)}
                style={{
                  background:"#fff", borderRadius:12,
                  border: isSelected ? "2px solid #6366f1" : "1px solid #e5e7eb",
                  padding:"14px 16px", cursor:"pointer", transition:"all 0.15s",
                  boxShadow: isSelected ? "0 0 0 3px rgba(99,102,241,0.12)" : "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, fontWeight:800, color: isSelected ? "#6366f1" : "#374151", background: isSelected ? "#eef2ff" : "#f3f4f6", border:`1px solid ${isSelected ? "#c7d2fe" : "#e5e7eb"}`, borderRadius:6, padding:"2px 8px" }}>
                      {bank.code}
                    </span>
                    <span style={{ fontSize:12, fontWeight:700, color:"#111827" }}>{bank.name}</span>
                  </div>
                  {!["SBIN","CNRB"].includes(bank.code) && (
                    <button onClick={e => { e.stopPropagation(); handleDeleteBank(bank.code); }}
                      style={{ width:22, height:22, border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626", borderRadius:4, opacity:0.6 }}>
                      <i className="ri-delete-bin-line" style={{ fontSize:12 }}/>
                    </button>
                  )}
                </div>
                {/* Level flow preview */}
                <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
                  {bank.levels.map((l, i) => {
                    const lc = lvlColor(l.code, bank);
                    return (
                      <React.Fragment key={l.code}>
                        <span style={{ fontSize:9, fontWeight:700, color:lc.color, background:lc.bg, border:`1px solid ${lc.border}`, borderRadius:10, padding:"1px 7px" }}>
                          {l.code}
                        </span>
                        {i < bank.levels.length - 1 && (
                          <i className="ri-arrow-right-s-line" style={{ fontSize:10, color:"#d1d5db" }}/>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                <div style={{ marginTop:6, fontSize:10, color:"#9ca3af" }}>
                  <i className="ri-map-pin-line" style={{ fontSize:10 }}/> HO: {bank.hoCity} · {midLevels.length} configurable level{midLevels.length !== 1 ? "s" : ""}
                </div>
              </div>
            );
          })}

          {/* Add bank form */}
          {addingBank ? (
            <div style={{ background:"#fff", borderRadius:12, border:"2px solid #6366f1", padding:"14px 16px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#6366f1", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                <i className="ri-bank-line"/> New Bank
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <div>
                  <label style={LBL}>IFSC Code (e.g. PUNB)</label>
                  <input value={bankForm.code} onChange={e => setBankForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. PUNB" maxLength={4} style={INP}/>
                </div>
                <div>
                  <label style={LBL}>Bank Full Name</label>
                  <input value={bankForm.name} onChange={e => setBankForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Punjab National Bank" style={INP}/>
                </div>
                <div>
                  <label style={LBL}>HO City</label>
                  <input value={bankForm.hoCity} onChange={e => setBankForm(f => ({ ...f, hoCity: e.target.value }))}
                    placeholder="e.g. New Delhi" style={INP}/>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:4 }}>
                  <button onClick={handleAddBank}
                    disabled={!bankForm.code || !bankForm.name || !bankForm.hoCity}
                    style={{ flex:1, padding:"8px", borderRadius:7, border:"none", background: (!bankForm.code||!bankForm.name||!bankForm.hoCity) ? "#9ca3af" : "#6366f1", color:"#fff", fontWeight:700, fontSize:12, cursor:(!bankForm.code||!bankForm.name||!bankForm.hoCity)?"not-allowed":"pointer" }}>
                    Add Bank
                  </button>
                  <button onClick={() => { setAddingBank(false); setBankForm({ ...EMPTY_BANK }); }}
                    style={{ padding:"8px 12px", borderRadius:7, border:"1px solid #e5e7eb", background:"#fff", fontWeight:600, fontSize:12, color:"#6b7280", cursor:"pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingBank(true)}
              style={{ width:"100%", padding:"11px", borderRadius:12, border:"2px dashed #d1d5db", background:"#fafafa", fontSize:12, fontWeight:600, color:"#6b7280", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"all 0.15s" }}>
              <i className="ri-add-circle-line" style={{ fontSize:15 }}/>
              Add Bank
            </button>
          )}
        </div>

        {/* ── RIGHT — Level editor ── */}
        {selectedBank ? (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Bank info header */}
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"18px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#0ea5e9,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <i className="ri-bank-line" style={{ fontSize:18, color:"#fff" }}/>
                </div>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:"#111827" }}>{selectedBank.name}</div>
                  <div style={{ fontSize:12, color:"#6b7280", display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:"#2563eb", background:"#dbeafe", border:"1px solid #bfdbfe", borderRadius:5, padding:"1px 7px" }}>{selectedBank.code}</span>
                    <span><i className="ri-map-pin-2-line" style={{ fontSize:11 }}/> HO: {selectedBank.hoCity}</span>
                    <span>{selectedBank.levels.length} levels total</span>
                  </div>
                </div>
              </div>

              {/* Flow diagram */}
              <div style={{ marginTop:14, padding:"12px 14px", background:"#f8fafc", borderRadius:10, border:"1px solid #e5e7eb", display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                <span style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em", marginRight:4 }}>Flow</span>
                {selectedBank.levels.map((l, i) => {
                  const lc = lvlColor(l.code, selectedBank);
                  return (
                    <React.Fragment key={l.code}>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:lc.color, background:lc.bg, border:`1px solid ${lc.border}`, borderRadius:20, padding:"3px 10px" }}>
                          {l.code}
                        </span>
                        <span style={{ fontSize:9, color:"#9ca3af", textAlign:"center", maxWidth:80 }}>{l.name.replace(/ \/ .+/, " /…")}</span>
                      </div>
                      {i < selectedBank.levels.length - 1 && (
                        <i className="ri-arrow-right-line" style={{ fontSize:14, color:"#d1d5db", flexShrink:0 }}/>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Levels table */}
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ padding:"14px 18px", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <span style={{ fontSize:14, fontWeight:800, color:"#111827" }}>Hierarchy Levels</span>
                  <span style={{ fontSize:11, color:"#9ca3af", marginLeft:8 }}>HO and Branch are fixed · drag or use arrows to reorder</span>
                </div>
                <button onClick={() => setAddingLevel(true)}
                  style={{ padding:"7px 14px", borderRadius:8, border:"none", background:"#6366f1", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                  <i className="ri-add-line"/>Add Level
                </button>
              </div>

              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, width:40 }}>#</th>
                    <th style={TH}>CODE</th>
                    <th style={{ ...TH, width:"40%" }}>LEVEL NAME</th>
                    <th style={{ ...TH, textAlign:"center" }}>LEAF</th>
                    <th style={{ ...TH, textAlign:"center" }}>DIRECT BRANCH</th>
                    <th style={{ ...TH, textAlign:"center" }}>VARIANTS</th>
                    <th style={{ ...TH, textAlign:"center" }}>REORDER</th>
                    <th style={{ ...TH, textAlign:"center" }}>REMOVE</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBank.levels.map((l, idx) => {
                    const lc = lvlColor(l.code, selectedBank);
                    const isReserved = RESERVED.has(l.code);
                    const isFirst = idx === 0;
                    const isLast  = idx === selectedBank.levels.length - 1;

                    return (
                      <tr key={l.code}
                        style={{ background:"transparent", transition:"background 0.12s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        {/* Order number */}
                        <td style={{ ...TD, color:"#9ca3af", fontWeight:700, textAlign:"center" }}>{l.order}</td>

                        {/* Code badge */}
                        <td style={TD}>
                          <span style={{ fontSize:11, fontWeight:800, color:lc.color, background:lc.bg, border:`1px solid ${lc.border}`, borderRadius:20, padding:"3px 10px", whiteSpace:"nowrap" }}>
                            {l.code}
                          </span>
                        </td>

                        {/* Name */}
                        <td style={TD}>
                          {isReserved ? (
                            <span style={{ fontSize:13, color:"#374151", fontWeight:600 }}>{l.name}</span>
                          ) : (
                            <input
                              value={l.name}
                              onChange={e => {
                                if (!selectedBank) return;
                                const levels = selectedBank.levels.map(lv =>
                                  lv.code === l.code ? { ...lv, name: e.target.value } : lv
                                );
                                updateBank({ ...selectedBank, levels });
                              }}
                              style={{ ...INP, padding:"5px 9px", fontSize:12 }}
                            />
                          )}
                          {isReserved && (
                            <span style={{ fontSize:9, fontWeight:700, color:"#9ca3af", background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:10, padding:"1px 6px", marginLeft:6 }}>FIXED</span>
                          )}
                        </td>

                        {/* Leaf toggle */}
                        <td style={{ ...TD, textAlign:"center" }}>
                          {l.code === "BRANCH" ? (
                            <i className="ri-check-line" style={{ fontSize:16, color:"#16a34a" }}/>
                          ) : (
                            <button onClick={() => toggleFlag(l.code, "isLeaf")} disabled={isReserved}
                              style={{ width:28, height:20, borderRadius:20, border:"none", background: l.isLeaf ? "#16a34a" : "#e5e7eb", cursor:isReserved?"default":"pointer", position:"relative", transition:"background 0.2s", opacity:isReserved?0.4:1 }}>
                              <div style={{ width:14, height:14, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left: l.isLeaf ? 11 : 3, transition:"left 0.2s" }}/>
                            </button>
                          )}
                        </td>

                        {/* Direct branch toggle */}
                        <td style={{ ...TD, textAlign:"center" }}>
                          {l.isLeaf || l.code === "BRANCH" ? (
                            <span style={{ color:"#d1d5db", fontSize:11 }}>—</span>
                          ) : (
                            <button onClick={() => toggleFlag(l.code, "canDirectBranch")}
                              style={{ width:28, height:20, borderRadius:20, border:"none", background: l.canDirectBranch ? "#2563eb" : "#e5e7eb", cursor:"pointer", position:"relative", transition:"background 0.2s" }}>
                              <div style={{ width:14, height:14, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left: l.canDirectBranch ? 11 : 3, transition:"left 0.2s" }}/>
                            </button>
                          )}
                        </td>

                        {/* Variants (hasSubType) toggle — e.g. AO → AO/CO/MO */}
                        <td style={{ ...TD, textAlign:"center" }}>
                          {l.isLeaf || l.code === "HO" || l.code === "BRANCH" ? (
                            <span style={{ color:"#d1d5db", fontSize:11 }}>—</span>
                          ) : (
                            <button onClick={() => toggleFlag(l.code, "hasSubType")}
                              style={{ width:28, height:20, borderRadius:20, border:"none", background: l.hasSubType ? "#d97706" : "#e5e7eb", cursor:"pointer", position:"relative", transition:"background 0.2s" }}>
                              <div style={{ width:14, height:14, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left: l.hasSubType ? 11 : 3, transition:"left 0.2s" }}/>
                            </button>
                          )}
                        </td>

                        {/* Reorder */}
                        <td style={{ ...TD, textAlign:"center" }}>
                          {isReserved ? (
                            <span style={{ color:"#e5e7eb", fontSize:11 }}>—</span>
                          ) : (
                            <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                              <button onClick={() => handleMoveLevel(l.code, "up")} disabled={isFirst || selectedBank.levels[idx - 1]?.code === "HO"}
                                style={{ width:26, height:26, borderRadius:6, border:"1px solid #e5e7eb", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#374151", opacity:(isFirst || selectedBank.levels[idx-1]?.code === "HO") ? 0.3 : 1 }}>
                                <i className="ri-arrow-up-s-line" style={{ fontSize:14 }}/>
                              </button>
                              <button onClick={() => handleMoveLevel(l.code, "down")} disabled={isLast || selectedBank.levels[idx + 1]?.code === "BRANCH"}
                                style={{ width:26, height:26, borderRadius:6, border:"1px solid #e5e7eb", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#374151", opacity:(isLast || selectedBank.levels[idx+1]?.code === "BRANCH") ? 0.3 : 1 }}>
                                <i className="ri-arrow-down-s-line" style={{ fontSize:14 }}/>
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Remove */}
                        <td style={{ ...TD, textAlign:"center" }}>
                          {isReserved ? (
                            <span style={{ color:"#e5e7eb", fontSize:11 }}>—</span>
                          ) : (
                            <button onClick={() => handleDeleteLevel(l.code)}
                              style={{ width:28, height:28, borderRadius:6, border:"1px solid #fee2e2", background:"#fef2f2", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}>
                              <i className="ri-delete-bin-line" style={{ fontSize:13 }}/>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Add level inline form */}
              {addingLevel && (
                <div style={{ padding:"14px 18px", borderTop:"1px solid #e5e7eb", background:"#f8fafc" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#6366f1", marginBottom:10 }}>New Level (inserted before Branch)</div>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
                    <div style={{ width:100 }}>
                      <label style={LBL}>Level Code</label>
                      <input value={newLevel.code} onChange={e => setNewLevel(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                        placeholder="e.g. ZO" maxLength={6} style={INP}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <label style={LBL}>Level Name</label>
                      <input value={newLevel.name} onChange={e => setNewLevel(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Zonal Office" style={INP}/>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={handleAddLevel} disabled={!newLevel.code || !newLevel.name}
                        style={{ padding:"8px 16px", borderRadius:8, border:"none", background:(!newLevel.code||!newLevel.name)?"#9ca3af":"#6366f1", color:"#fff", fontWeight:700, fontSize:12, cursor:(!newLevel.code||!newLevel.name)?"not-allowed":"pointer" }}>
                        Add
                      </button>
                      <button onClick={() => { setAddingLevel(false); setNewLevel({ ...EMPTY_LEVEL }); }}
                        style={{ padding:"8px 12px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", fontWeight:600, fontSize:12, color:"#6b7280", cursor:"pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info card */}
            <div style={{ background:"#eff6ff", borderRadius:12, border:"1px solid #bfdbfe", padding:"14px 16px", display:"flex", gap:10 }}>
              <i className="ri-information-line" style={{ fontSize:16, color:"#2563eb", flexShrink:0, marginTop:1 }}/>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#1d4ed8", marginBottom:3 }}>Changes apply immediately to Org Units</div>
                <div style={{ fontSize:11, color:"#3b82f6" }}>
                  All changes are auto-saved to your browser. The Org Unit form reads this configuration — so any level you add here will appear as an option there. HO and Branch are fixed structural levels and cannot be removed.
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"60px", textAlign:"center", color:"#9ca3af" }}>
            <i className="ri-node-tree" style={{ fontSize:40, display:"block", marginBottom:12, opacity:0.3 }}/>
            <div style={{ fontSize:14, fontWeight:600 }}>Select a bank to configure its hierarchy</div>
          </div>
        )}
      </div>
    </div>
  );
}
