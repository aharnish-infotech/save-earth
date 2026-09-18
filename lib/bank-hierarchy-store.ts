// ── Bank Hierarchy Store ───────────────────────────────────────────────────────
// Shared, localStorage-backed config for bank hierarchy levels.
// Used by: /hierarchy (builder) and /organisation (org units form).

export interface BankLevel {
  code: string;           // e.g. "LHO", "AO", "RBO"
  name: string;           // e.g. "Local Head Office"
  order: number;          // 1 = HO (always first), ascending
  isLeaf?: boolean;       // true for BRANCH — cannot have children
  canDirectBranch?: boolean; // this level can parent a Branch directly
  hasSubType?: boolean;   // display-only flag (AO → AO/CO/MO label)
}

export interface BankConfig {
  code: string;           // IFSC prefix e.g. "SBIN", "CNRB"
  name: string;           // Full name e.g. "State Bank of India"
  hoCity: string;         // Auto-display when bank selected e.g. "Mumbai"
  levels: BankLevel[];    // ordered by `order` asc
}

// ── Defaults ───────────────────────────────────────────────────────────────────
export const DEFAULT_BANK_CONFIGS: BankConfig[] = [
  {
    code: "SBIN",
    name: "State Bank of India",
    hoCity: "Mumbai",
    levels: [
      { code: "HO",     name: "Head Office",                          order: 1, canDirectBranch: true },
      { code: "LHO",    name: "Local Head Office (LHO) / Zonal Office (ZO)", order: 2, canDirectBranch: true },
      { code: "AO",     name: "Administrative Office (AO) / Circle Office (CO) / Module Office (MO)", order: 3, hasSubType: true },
      { code: "RBO",    name: "Regional Business Office (RBO) / Regional Office (RO)", order: 4 },
      { code: "BRANCH", name: "Branch",                               order: 5, isLeaf: true          },
    ],
  },
  {
    code: "CNRB",
    name: "Canara Bank",
    hoCity: "Bengaluru",
    levels: [
      { code: "HO",     name: "Head Office",       order: 1                        },
      { code: "ZO",     name: "Zonal Office",      order: 2                        },
      { code: "RO",     name: "Regional Office",   order: 3, canDirectBranch: true },
      { code: "BRANCH", name: "Branch",            order: 4, isLeaf: true          },
    ],
  },
];

const LS_KEY = "orbit_bank_hierarchy_v2";

// ── Read ───────────────────────────────────────────────────────────────────────
export function getBankConfigs(): BankConfig[] {
  if (typeof window === "undefined") return DEFAULT_BANK_CONFIGS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as BankConfig[];
  } catch { /* ignore */ }
  return DEFAULT_BANK_CONFIGS;
}

// ── Write ──────────────────────────────────────────────────────────────────────
export function saveBankConfigs(configs: BankConfig[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(configs));
  } catch { /* ignore */ }
}

// ── Color palette — rotates by level order (HO always blue, BRANCH always gray) ──
export interface LevelStyle { color: string; bg: string; border: string }

const PALETTE: LevelStyle[] = [
  { color:"#166534", bg:"#dcfce7", border:"#bbf7d0" }, // green  — order 2 (LHO/ZO)
  { color:"#92400e", bg:"#fef3c7", border:"#fde68a" }, // amber  — order 3 (AO/RO)
  { color:"#6b21a8", bg:"#f3e8ff", border:"#e9d5ff" }, // purple — order 4 (RBO)
  { color:"#0e7490", bg:"#cffafe", border:"#a5f3fc" }, // cyan   — order 5
  { color:"#be185d", bg:"#fce7f3", border:"#fbcfe8" }, // pink   — order 6
  { color:"#065f46", bg:"#d1fae5", border:"#a7f3d0" }, // emerald— order 7
  { color:"#7c3aed", bg:"#ede9fe", border:"#ddd6fe" }, // violet — order 8
];
const HO_STYLE:     LevelStyle = { color:"#1d4ed8", bg:"#dbeafe", border:"#bfdbfe" };
const BRANCH_STYLE: LevelStyle = { color:"#374151", bg:"#f3f4f6", border:"#e5e7eb" };

/**
 * Returns a color/bg/border triple for any level code in a given bank config.
 * HO is always blue, BRANCH always gray, everything else rotates through PALETTE by order.
 * Falls back gracefully for codes not in the config (e.g. during seed data render).
 */
export function getLevelStyle(levelCode: string, bankConfig?: BankConfig): LevelStyle {
  if (levelCode === "HO")     return HO_STYLE;
  if (levelCode === "BRANCH") return BRANCH_STYLE;
  if (bankConfig) {
    const lvl = bankConfig.levels.find(l => l.code === levelCode);
    if (lvl) return PALETTE[(lvl.order - 2) % PALETTE.length];   // order 2 → index 0
  }
  // Fallback: cycle by a stable hash of the code string
  const hash = levelCode.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
export function configsToRecord(configs: BankConfig[]): Record<string, BankConfig> {
  return Object.fromEntries(configs.map(c => [c.code, c]));
}
