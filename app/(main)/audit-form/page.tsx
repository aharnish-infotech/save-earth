"use client";
import React, { useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface EquipItem {
  id: string;
  name: string;
  nos: string;
  watt: string;     // editable default
  tons?: string;    // only for AC items
  optional?: boolean;
}

interface EquipGroup {
  id: string;
  label: string;
  hasAC?: boolean;
  items: EquipItem[];
}

// ── Seed equipment groups (S.No 1 — Distributed Load) ────────────────────────
const makeItem = (id: string, name: string, watt: string, optional = false): EquipItem =>
  ({ id, name, nos: "", watt, optional });

const makeAC = (id: string, name: string, watt: string): EquipItem =>
  ({ id, name, nos: "", watt, tons: "", optional: true });

const INITIAL_GROUPS: EquipGroup[] = [
  {
    id: "lighting",
    label: "Lighting Load",
    items: [
      makeItem("fl2x2",  "Flush Lights 2X2",      "36"),
      makeItem("dl",     "Down Lights",            "12"),
      makeItem("tl",     "Tubelights + GSB T/Ls",  "40"),
      makeItem("led",    "LED Bulbs",              "15"),
      makeItem("cfl",    "CFL / PL Lights",        "23", true),
      makeItem("panel",  "LED Panel Lights",       "18", true),
      makeItem("spot",   "Spotlights",             "7",  true),
    ],
  },
  {
    id: "fans",
    label: "Fans",
    items: [
      makeItem("cfan",   "Ceiling Fans",           "100"),
      makeItem("wfan",   "Wall Fans / Table Fan",  "80"),
      makeItem("efan",   "Exhaust Fans",           "150"),
      makeItem("blow",   "Blower",                 "100", true),
      makeItem("afan",   "Air Circulators",        "55",  true),
    ],
  },
  {
    id: "ac",
    label: "AC / Air Conditioning",
    hasAC: true,
    items: [
      makeAC("sac",  "Split AC",    "1500"),
      makeAC("cac",  "Cassette AC", "2000"),
      makeAC("wac",  "Window AC",   "1200"),
      makeAC("vrf",  "VRF / VRV AC","1800"),
    ],
  },
  {
    id: "computers",
    label: "Computer / IT Equipment",
    items: [
      makeItem("desk",  "Desktop Computers",      "200"),
      makeItem("lap",   "Laptops",                "65"),
      makeItem("monit", "Monitors",               "30"),
      makeItem("print", "Printers / Scanners",    "150", true),
      makeItem("srv",   "Servers / NAS",          "400", true),
    ],
  },
  {
    id: "other",
    label: "Other Equipment",
    items: [
      makeItem("wm",    "Water Machine / Cooler", "150"),
      makeItem("mw",    "Microwave / OTG",        "1000", true),
      makeItem("ktle",  "Electric Kettle",        "1500", true),
      makeItem("geysr", "Water Heater / Geyser",  "2000", true),
      makeItem("cctv",  "CCTV System",            "50"),
      makeItem("oth",   "Other Miscellaneous",    "0",   true),
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const totalW = (item: EquipItem): number => {
  const n = parseFloat(item.nos) || 0;
  const w = parseFloat(item.watt) || 0;
  return n * w;
};

const groupTotal = (g: EquipGroup): number => g.items.reduce((s, i) => s + totalW(i), 0);

const fmtW = (w: number) => w >= 1000 ? `${(w/1000).toFixed(2)} kW` : `${w} W`;

// ── Styles ────────────────────────────────────────────────────────────────────
const TH: React.CSSProperties = { padding:"8px 10px", fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", textAlign:"left", whiteSpace:"nowrap" };
const TD: React.CSSProperties = { padding:"8px 10px", fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6", verticalAlign:"middle" };
const NUM_INP: React.CSSProperties = { width:"100%", border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 8px", fontSize:13, fontWeight:700, color:"#111827", textAlign:"center", outline:"none", background:"#fff", boxSizing:"border-box" };

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AuditFormPage() {
  const [branchName, setBranchName] = useState("SBI - Paldi Branch");
  const [groups, setGroups] = useState<EquipGroup[]>(INITIAL_GROUPS);
  const [saved, setSaved] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    lighting: true, fans: true, ac: true, computers: false, other: false,
  });

  const updateItem = useCallback((gid: string, iid: string, field: keyof EquipItem, val: string) => {
    setGroups(gs => gs.map(g => g.id !== gid ? g : {
      ...g,
      items: g.items.map(i => i.id !== iid ? i : { ...i, [field]: val }),
    }));
  }, []);

  const toggleGroup = (id: string) => setOpenGroups(o => ({ ...o, [id]: !o[id] }));

  const grandTotal   = groups.reduce((s, g) => s + groupTotal(g), 0);
  const activeItems  = groups.reduce((s, g) => s + g.items.filter(i => parseFloat(i.nos) > 0).length, 0);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div style={{ padding:"24px 0" }}>

      {/* Page header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h4 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Audit Form</h4>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>
            Audit Questions / <span style={{ color:"#16a34a", fontWeight:600 }}>Audit Form</span>
          </div>
        </div>
        <button onClick={handleSave}
          style={{ padding:"9px 20px", borderRadius:8, border:"none", background:"#16a34a", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
          <i className="ri-save-line"/>Save Load Sheet
        </button>
      </div>

      {saved && (
        <div style={{ marginBottom:16, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <i className="ri-checkbox-circle-fill" style={{ color:"#16a34a", fontSize:18 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:"#15803d" }}>Load Sheet saved successfully</span>
        </div>
      )}

      {/* Branch card + live stats */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", marginBottom:16 }}>
        {/* Branch name bar */}
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="ri-building-2-line" style={{ color:"#16a34a", fontSize:16 }}/>
          </div>
          <div style={{ flex:1 }}>
            <input value={branchName} onChange={e => setBranchName(e.target.value)}
              style={{ fontSize:15, fontWeight:800, color:"#111827", border:"none", outline:"none", background:"transparent", width:"100%" }}
              placeholder="Branch name…"/>
            <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>Branch Load Sheet — S.No 1</div>
          </div>
        </div>

        {/* Live stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr" }}>
          {[
            { label:"Total (W)",    value: grandTotal.toFixed(0),       color:"#16a34a", sub:"watts"  },
            { label:"Total (kW)",   value: (grandTotal/1000).toFixed(2), color:"#2563eb", sub:"kilowatts" },
            { label:"Active Items", value: String(activeItems),          color:"#d97706", sub:"equipment" },
          ].map((s, i) => (
            <div key={s.label} style={{ padding:"14px 18px", borderRight:i<2?"1px solid #f3f4f6":"none", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:10, color:"#9ca3af", fontWeight:600, marginTop:3, textTransform:"uppercase", letterSpacing:"0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment groups */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>

        {/* Card header */}
        <div style={{ padding:"13px 18px", borderBottom:"1px solid #e5e7eb", background:"#f9fafb", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13, fontWeight:900, color:"#fff" }}>1</span>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"#111827" }}>Equipment Load Details</div>
            <div style={{ fontSize:11, color:"#9ca3af" }}>S.No 1 — Enter Nos. and Wattage per item</div>
          </div>
        </div>

        {groups.map((group, gi) => {
          const gt  = groupTotal(group);
          const isOpen = openGroups[group.id] !== false;
          return (
            <div key={group.id}>
              {/* Group header */}
              <div onClick={() => toggleGroup(group.id)}
                style={{ padding:"10px 18px", background:"#fafafa", borderTop: gi>0?"1px solid #e5e7eb":"none",
                  display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", userSelect:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:3, height:18, borderRadius:99, background:"#16a34a" }}/>
                  <span style={{ fontSize:12, fontWeight:800, color:"#374151" }}>{group.label}</span>
                  {group.id === "ac" && (
                    <span style={{ fontSize:10, fontWeight:700, color:"#d97706", background:"#fef3c7", borderRadius:20, padding:"1px 8px" }}>Optional</span>
                  )}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  {gt > 0 && <span style={{ fontSize:12, fontWeight:800, color:"#16a34a" }}>{gt.toFixed(0)} W</span>}
                  <i className={`ri-arrow-${isOpen?"up":"down"}-s-line`} style={{ color:"#9ca3af", fontSize:16 }}/>
                </div>
              </div>

              {isOpen && (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ ...TH, width:"40%", paddingLeft:20 }}>Equipment Installed</th>
                        {group.hasAC && <th style={{ ...TH, width:80, textAlign:"center" }}>Tons</th>}
                        <th style={{ ...TH, width:90, textAlign:"center" }}>Nos.</th>
                        <th style={{ ...TH, width:100, textAlign:"center" }}>Watt (W)</th>
                        <th style={{ ...TH, width:100, textAlign:"right", paddingRight:18 }}>Total W</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map(item => {
                        const tw = totalW(item);
                        return (
                          <tr key={item.id}
                            onMouseEnter={e => (e.currentTarget.style.background="#f9fafb")}
                            onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
                            <td style={{ ...TD, paddingLeft:20, color: item.optional && !parseFloat(item.nos) ? "#9ca3af":"#374151" }}>
                              {item.name}
                            </td>
                            {group.hasAC && (
                              <td style={{ ...TD, textAlign:"center" }}>
                                <input type="number" value={item.tons??""} placeholder="-"
                                  onChange={e => updateItem(group.id, item.id, "tons", e.target.value)}
                                  style={{ ...NUM_INP, width:60, color:"#7c3aed" }}/>
                              </td>
                            )}
                            <td style={{ ...TD, textAlign:"center" }}>
                              <input type="number" min="0" value={item.nos} placeholder="-"
                                onChange={e => updateItem(group.id, item.id, "nos", e.target.value)}
                                style={{ ...NUM_INP, width:70,
                                  background: parseFloat(item.nos) > 0 ? "#f0fdf4" : "#fff",
                                  color: parseFloat(item.nos) > 0 ? "#16a34a" : "#9ca3af",
                                  borderColor: parseFloat(item.nos) > 0 ? "#86efac" : "#e5e7eb" }}/>
                            </td>
                            <td style={{ ...TD, textAlign:"center" }}>
                              <input type="number" min="0" value={item.watt}
                                onChange={e => updateItem(group.id, item.id, "watt", e.target.value)}
                                style={{ ...NUM_INP, width:80, color:"#2563eb" }}/>
                            </td>
                            <td style={{ ...TD, textAlign:"right", paddingRight:18 }}>
                              <span style={{ fontSize:13, fontWeight:tw>0?800:400, color:tw>0?"#111827":"#d1d5db" }}>
                                {tw > 0 ? tw.toFixed(0) : "0"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Group subtotal */}
                  <div style={{ padding:"10px 18px 10px 20px", background: gt>0?"#16a34a":"#374151",
                    display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>
                      {group.label === "AC / Air Conditioning" ? "AC / Air Conditioning Total" : `Distributed Load (S.No 1)`}
                    </span>
                    <span style={{ fontSize:15, fontWeight:900, color:"#fff" }}>
                      {gt.toFixed(0)} W
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Grand total */}
        <div style={{ padding:"16px 18px", background: grandTotal>0 ? "linear-gradient(135deg,#16a34a,#15803d)" : "#374151",
          display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"2px solid #fff" }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.8)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Grand Total Wattage</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginTop:2 }}>All equipment combined</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:26, fontWeight:900, color:"#fff", lineHeight:1 }}>{grandTotal.toFixed(0)} W</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{(grandTotal/1000).toFixed(2)} kW</div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
        <button onClick={handleSave}
          style={{ padding:"12px 28px", borderRadius:10, border:"none", background:"#16a34a", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 14px rgba(22,163,74,0.35)" }}>
          <i className="ri-save-line"/>Save Load Sheet
        </button>
      </div>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
