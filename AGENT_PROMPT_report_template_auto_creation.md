# Feature Prompt: Auto-Create Report Template When Audit Template Is Saved

## Context & Background

This project is a Next.js 15 + TypeScript ERP called **Orbit InspectFlow** — an electrical safety audit platform for banking branches. It has two distinct template systems:

1. **Audit Template** — defines the inspection questionnaire (questions, sections, scoring). Already exists in the system.
2. **Report Template** — defines how the final PDF report is structured (which blocks/sections appear, their order, which fields are visible). This is what we have just finished building.

Both live in the same codebase. The Report Template feature is complete and has these routes:
- `/report-template` — listing page
- `/report-template/new` — 2-step wizard to create a report template manually
- `/report-template/[id]/view` — read-only view of a report template
- `/report-template/[id]` (edit) — block builder to reorder/toggle report sections

---

## The Feature You Need to Build

### Goal
When a user **saves a new Audit Template** (or updates an existing one), the system must **automatically create (or update) a corresponding Report Template** with:
- The same `name`
- The same `bank` / `bankCode` / `bankColor`
- The same `circle` (mapped LHO/ZO)
- The same `status` (Draft or Active)
- All 11 default report blocks (cover page, annexures, UPS, meter, DG, load sheet, photos, electricity bill, sample images) — all visible by default
- A system-generated `id` prefixed with `RT-` (e.g. `RT-007`)
- `version` starting at `v1.0`
- `description` auto-generated as: `"Auto-generated report template for [Audit Template Name] — [Bank Name] [Circle]"`
- `createdOn` set to today's date
- `timesUsed: 0`
- `blocksCount: 11`, `questionsCount: 33` (default full block set)

This auto-creation must be **invisible to the user** — it happens in the background the moment the audit template save is confirmed (no extra prompts, no extra form).

---

## Report Template Data Model

Below is the **exact TypeScript interface** the Report Template system uses. Your database schema and API must match this precisely.

```typescript
interface ReportTemplate {
  id: string;           // "RT-001", "RT-002" etc.
  bank: string;         // Full bank name: "State Bank of India"
  bankCode: string;     // Abbreviation: "SBI", "BOB", "UCO", "PNB", "CNRB", "IB"
  bankColor: string;    // Hex brand color: "#1a3c8f"
  name: string;         // Same as Audit Template name
  description: string;  // Auto-generated or user-edited
  status: "Active" | "Draft" | "Archived";
  version: string;      // "v1.0", "v2.1" etc.
  circle: string;       // "LHO-GAN — Gandhinagar" format (code + em-dash + name)
  blocksCount: number;
  questionsCount: number;
  timesUsed: number;
  createdOn: string;    // "15 Jan 2024" format
  tags: string[];       // e.g. ["Cover Page", "Annexure I–III", "Load Sheet", "Photos"]
}
```

---

## Report Block Data Model

Each Report Template contains an ordered array of **ReportBlock** objects. Here are all 11 default blocks you must persist when auto-creating:

```typescript
interface BlockItem {
  id: string;
  label: string;
  visible: boolean;
}

interface ReportBlock {
  id: string;
  title: string;
  subtitle: string;
  icon: string;         // Remix Icon class name e.g. "ri-file-shield-2-line"
  color: string;        // Hex accent color
  bg: string;           // Hex background color
  type: "fixed" | "questions" | "images" | "table";
  visible: boolean;
  expanded: boolean;
  items: BlockItem[];
}
```

### The 11 Default Blocks (in order)

```typescript
const DEFAULT_BLOCKS: ReportBlock[] = [
  {
    id: "cover", title: "Cover Page",
    subtitle: "Branch identity, FY, audit date, company branding",
    icon: "ri-file-shield-2-line", color: "#2563eb", bg: "#eff6ff",
    type: "fixed", visible: true, expanded: false,
    items: [
      { id:"c1",  label:"Bank Name",              visible:true },
      { id:"c2",  label:"Branch Name",            visible:true },
      { id:"c3",  label:"Branch Code",            visible:true },
      { id:"c4",  label:"Branch Address",         visible:true },
      { id:"c5",  label:"Financial Year",         visible:true },
      { id:"c6",  label:"Audit Date",             visible:true },
      { id:"c7",  label:"Auditor Name",           visible:true },
      { id:"c8",  label:"RBO",                    visible:true },
      { id:"c9",  label:"AO (Area Office)",       visible:true },
      { id:"c10", label:"LHO (Local Head Office)",visible:true },
      { id:"c11", label:"Company Logo & Address", visible:true },
    ],
  },
  {
    id: "annexure1", title: "Annexure I — Electrical Safety Audit",
    subtitle: "Branch metadata: load, area, controllers, UPS & DG details",
    icon: "ri-file-list-2-line", color: "#0891b2", bg: "#ecfeff",
    type: "fixed", visible: true, expanded: false,
    items: [
      { id:"a1",  label:"Branch Code / Name",                    visible:true },
      { id:"a2",  label:"Address",                               visible:true },
      { id:"a3",  label:"BM's PF No., Name and Contact",        visible:true },
      { id:"a4",  label:"Sanctioned Load (KW/KVA)",             visible:true },
      { id:"a5",  label:"Connected Load (KW/KVA)",              visible:true },
      { id:"a6",  label:"Monthly Energy Bill Amount",           visible:true },
      { id:"a7",  label:"Tonnage of Air-Conditioners (TR)",     visible:true },
      { id:"a8",  label:"Area of Branch / Office (Sq. Ft.)",   visible:true },
      { id:"a9",  label:"UPS Details",                          visible:true },
      { id:"a10", label:"Generator Details",                    visible:true },
    ],
  },
  {
    id: "annexure2", title: "Annexure II — Audit Questions",
    subtitle: "Main compliance checklist: Yes/No and Observations/Remarks",
    icon: "ri-questionnaire-line", color: "#7c3aed", bg: "#f5f3ff",
    type: "questions", visible: true, expanded: false,
    items: [
      { id:"q1",  label:"MCCBs/MCBs/ELCBs with proper rating",              visible:true },
      { id:"q2",  label:"Light & emergency light in electrical rooms",       visible:true },
      { id:"q3",  label:"Pump/DG/UPS rooms maintained dry and clean",       visible:true },
      { id:"q4",  label:"Water seepage near electrical panels",             visible:true },
      { id:"q5",  label:"Earthing pits properly maintained",                visible:true },
      { id:"q6",  label:"Preventive maintenance by licensed electrician",   visible:true },
      { id:"q7",  label:"PF panel of appropriate rating installed",          visible:true },
      { id:"q8",  label:"Fire Protection / Fire Extinguishers",             visible:true },
      { id:"q9",  label:"DG set recorded in equipment details",             visible:true },
      { id:"q10", label:"Load distributed in all 3 phases",                visible:true },
    ],
  },
  {
    id: "annexure3", title: "Annexure III — Onsite ATM",
    subtitle: "ATM-specific electrical and safety compliance questions",
    icon: "ri-bank-card-line", color: "#0369a1", bg: "#f0f9ff",
    type: "questions", visible: true, expanded: false,
    items: [
      { id:"atm1", label:"Fire detector connected to branch AFDS",            visible:true },
      { id:"atm2", label:"MCCB/MCB/ELCB provided and in working condition",  visible:true },
      { id:"atm3", label:"AC units provided with timer circuit device",       visible:true },
      { id:"atm4", label:"Main supply switch/MCB marked for ATM cutoff",     visible:true },
      { id:"atm5", label:"No cooking stove / heater coil in ATM",           visible:true },
    ],
  },
  {
    id: "ups", title: "UPS Details",
    subtitle: "UPS/Inverter table, battery specs and live parameter readings",
    icon: "ri-battery-charge-line", color: "#15803d", bg: "#f0fdf4",
    type: "table", visible: true, expanded: false,
    items: [
      { id:"ups1", label:"UPS / Inverter Capacity Table",                     visible:true },
      { id:"ups2", label:"UPS Parameters (Voltage, Current, Frequency)",     visible:true },
    ],
  },
  {
    id: "meter", title: "Meter Details & Electrical Parameters",
    subtitle: "Meter info, voltage readings, current readings and power factor",
    icon: "ri-dashboard-3-line", color: "#b45309", bg: "#fffbeb",
    type: "table", visible: true, expanded: false,
    items: [
      { id:"m1", label:"Meter Details",         visible:true },
      { id:"m2", label:"Voltage Readings",      visible:true },
      { id:"m3", label:"Current Readings",      visible:true },
      { id:"m4", label:"Power Factor (PF)",     visible:true },
    ],
  },
  {
    id: "dg", title: "DG Set Details",
    subtitle: "Diesel generator specifications, observations and safety standards",
    icon: "ri-plug-line", color: "#6b21a8", bg: "#faf5ff",
    type: "table", visible: true, expanded: false,
    items: [
      { id:"dg1", label:"DG Set — Hired or Owned",     visible:true },
      { id:"dg2", label:"DG Set Capacity (KVA)",       visible:true },
      { id:"dg3", label:"DG Set Make (OEM)",           visible:true },
      { id:"dg4", label:"Acoustic Enclosure Provided", visible:true },
    ],
  },
  {
    id: "loadsheet", title: "Branch Load Sheet",
    subtitle: "Equipment-wise load calculation grouped by category",
    icon: "ri-table-2", color: "#0f766e", bg: "#f0fdfa",
    type: "table", visible: true, expanded: false,
    items: [
      { id:"ls1", label:"Lighting Load",               visible:true },
      { id:"ls2", label:"Fan Load",                    visible:true },
      { id:"ls3", label:"UPS Load",                    visible:true },
      { id:"ls4", label:"Air Conditioning Load",       visible:true },
      { id:"ls5", label:"Power Load",                  visible:true },
      { id:"ls6", label:"Total Connected Load Summary",visible:true },
    ],
  },
  {
    id: "photos", title: "Photographic Overview",
    subtitle: "Audit observations with risk classification and photo evidence",
    icon: "ri-camera-lens-line", color: "#be123c", bg: "#fff1f2",
    type: "images", visible: true, expanded: false,
    items: [
      { id:"po1", label:"LOW RISK — Observations & Photographs",  visible:true },
      { id:"po2", label:"MEDIUM RISK — Observations & Photographs",visible:true },
      { id:"po3", label:"HIGH RISK — Observations & Photographs", visible:true },
      { id:"po4", label:"Signatures",                             visible:true },
    ],
  },
  {
    id: "ebill", title: "Electricity Bill Image",
    subtitle: "Scanned copy of latest electricity bill submitted at branch",
    icon: "ri-receipt-line", color: "#ca8a04", bg: "#fefce8",
    type: "images", visible: true, expanded: false,
    items: [
      { id:"eb1", label:"Electricity Bill Scan / Photo", visible:true },
    ],
  },
  {
    id: "samplepics", title: "Sample Images",
    subtitle: "Location-wise photographs captured during the audit visit",
    icon: "ri-image-2-line", color: "#475569", bg: "#f8fafc",
    type: "images", visible: true, expanded: false,
    items: [
      { id:"si1", label:"Branch Front Photo",       visible:true },
      { id:"si2", label:"UPS Room Photo",           visible:true },
      { id:"si3", label:"Main Panel Photo",         visible:true },
      { id:"si4", label:"Fire Extinguishers Photo", visible:true },
    ],
  },
];
```

---

## Auto-Creation Logic (Backend / Service Layer)

### Where to Hook In
Find the existing service function that handles **Audit Template creation/save** — it will be something like `AuditTemplateService.create()` or `createAuditTemplate()`. After the audit template is successfully persisted, call the report template auto-creation function.

### Auto-Creation Function

```typescript
// services/reportTemplateService.ts

async function autoCreateReportTemplate(auditTemplate: AuditTemplate): Promise<ReportTemplate> {
  const id = await generateReportTemplateId(); // e.g. "RT-007"

  const reportTemplate: ReportTemplate = {
    id,
    bank:           auditTemplate.bank,
    bankCode:       auditTemplate.bankCode,
    bankColor:      auditTemplate.bankColor,
    name:           auditTemplate.name,
    description:    `Auto-generated report template for ${auditTemplate.name} — ${auditTemplate.bank} ${auditTemplate.circle}`,
    status:         auditTemplate.status, // inherit Draft or Active
    version:        "v1.0",
    circle:         auditTemplate.circle, // must be in "CODE — Name" format
    blocksCount:    11,
    questionsCount: 33,
    timesUsed:      0,
    createdOn:      formatDate(new Date()), // "15 Jan 2024" format
    tags:           ["Cover Page", "Annexure I–III", "Load Sheet", "Photos"],
    blocks:         DEFAULT_BLOCKS,        // the full 11-block array defined above
  };

  await ReportTemplateRepository.create(reportTemplate);
  return reportTemplate;
}
```

### ID Generation
If using a database: query `MAX(id)` from report_templates table, extract the numeric suffix, increment by 1, zero-pad to 3 digits: `RT-${String(maxNum + 1).padStart(3, "0")}`.

### Idempotency
If an Audit Template is **updated** (not just created), check if a Report Template already exists with the same `auditTemplateId` foreign key:
- If **not found** → create a new one (same logic as above)
- If **found** → update only `name`, `bank`, `bankCode`, `bankColor`, `circle`, `status` — do NOT reset blocks (the user may have already customized them) and do NOT reset `version` or `timesUsed`

---

## Database Schema

Add this table (Prisma example):

```prisma
model ReportTemplate {
  id              String   @id @default(uuid())
  displayId       String   @unique // "RT-001"
  auditTemplateId String?  // FK → AuditTemplate.id (null if manually created)
  bank            String
  bankCode        String
  bankColor       String
  name            String
  description     String
  status          String   // "Active" | "Draft" | "Archived"
  version         String   @default("v1.0")
  circle          String
  blocksCount     Int      @default(11)
  questionsCount  Int      @default(33)
  timesUsed       Int      @default(0)
  createdOn       DateTime @default(now())
  tags            String[] // Postgres array
  blocks          Json     // Stores the full ReportBlock[] array
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime? // soft delete

  auditTemplate   AuditTemplate? @relation(fields:[auditTemplateId], references:[id])
}
```

---

## Frontend: View Page Reference

The **Report Template view page** at `/report-template/[id]/view` is already built. Its design is the reference UI standard. Do not rebuild it — just make sure the API/data it fetches matches the schema above.

### What the View Page Shows

**Sticky top bar:**
- Back arrow → `/report-template`
- Breadcrumb: `Report Templates / [Template Name] / View`
- Status pill (green = Active, yellow = Draft, gray = Archived)
- "Edit" button → `/report-template/[id]`
- "Generate Report" button (primary CTA)

**Template identity card:**
- Bank avatar (colored square with bank code abbreviation)
- Template name (large heading)
- Bank full name · Circle · Template ID · Version
- 4 stat tiles: Total Blocks, Visible in Report, Active Questions, Times Used

**Page order preview strip:**
- Shows all visible blocks as colored pills labeled P1, P2, P3... in their current order

**11 block accordion rows:**
- Each row shows: drag grip area (visual only in view), block number badge, icon, title, type badge (Fields/Questions/Images/Table), subtitle
- Item count badge (e.g. "10/10")
- Eye icon (display-only, not interactive in view mode)
- Expand chevron → reveals items as a read-only list with visibility dots

### What the Edit Page Shows

The **edit page** at `/report-template/[id]` (no `/view` suffix) opens **directly on the block builder** — no Step 1 wizard, no template details form. It shows:
- Same sticky top bar as view, but with "Update Template" button instead of "Generate Report"
- A compact read-only identity strip (bank avatar, name, circle, version — not editable here)
- The full block list with **live drag-and-drop** reordering (grip handle only — `draggable` attribute on the `⠿` icon div only, not the full card)
- Toggle visibility per block and per item
- Expand/collapse per block to reorder items within the block
- Bottom save bar

---

## UI Design Rules

All frontend components in this codebase follow these strict rules — maintain them:

1. **Inline styles only** — every style via `style={{ ... }}`. No Tailwind utility classes in component files.
2. **No external UI libraries** — no Shadcn, no MUI, no Radix in these pages.
3. **Remix Icons** — icon classes use `ri-*` prefix (e.g. `ri-eye-line`, `ri-draggable`, `ri-file-shield-2-line`). These are loaded via CDN in the global layout.
4. **Next.js 15 App Router** — all pages are `"use client"` components using `useParams<{ id: string }>()`, `useRouter()`, `useState`, `useCallback`.
5. **TypeScript strict** — `npx tsc --noEmit` must pass with 0 errors before every commit.
6. **Feature-first folder structure** — all report template files live in `app/(main)/report-template/`.

---

## API Endpoints Required

```
GET    /api/report-templates              → list all (with pagination, filters)
GET    /api/report-templates/:id          → get one by displayId
POST   /api/report-templates              → manually create (from /new wizard)
PUT    /api/report-templates/:id          → update blocks/visibility
DELETE /api/report-templates/:id          → soft delete

POST   /api/report-templates/from-audit/:auditTemplateId
       → auto-create from an audit template (called internally by AuditTemplateService)
```

---

## Summary of What You Need to Implement

1. **Database**: Add `ReportTemplate` table with the Prisma schema above. Run migration.
2. **Repository layer**: `ReportTemplateRepository` with `findById`, `findAll`, `create`, `update`, `softDelete`, `findByAuditTemplateId`.
3. **Service layer**: `ReportTemplateService` with `autoCreateFromAuditTemplate(auditTemplate)` function that builds the full object using DEFAULT_BLOCKS and saves it.
4. **Hook into Audit Template save**: In `AuditTemplateService.create()` and `AuditTemplateService.update()`, call `ReportTemplateService.autoCreateFromAuditTemplate()` after the audit template is persisted. Handle errors gracefully — if report template auto-creation fails, log it but do NOT roll back the audit template save.
5. **API routes**: Implement the REST endpoints listed above using Next.js Route Handlers (`app/api/report-templates/route.ts`, etc.).
6. **Replace seed data with real API calls**: The existing frontend pages (`/report-template`, `/report-template/[id]/view`, `/report-template/[id]`) currently use in-memory `SEED` arrays. Replace these with `fetch()` calls to the API routes above. Use TanStack Query (`useQuery`, `useMutation`) for data fetching and cache invalidation.
7. **TypeScript check**: Run `npx tsc --noEmit` — must exit 0.
8. **No UI changes** to the view page or edit page — the design is final. Only replace the data source.

---

## File Locations for Reference

```
app/(main)/report-template/
  page.tsx                    ← Listing page (replace SEED with API call)
  new/
    layout.tsx
    page.tsx                  ← 2-step wizard (POST to API on save)
  [id]/
    layout.tsx
    page.tsx                  ← Edit page — block builder only (PUT to API on update)
    view/
      layout.tsx
      page.tsx                ← View page — read-only (GET from API)
```

All UI design and interaction patterns are finalized. Your task is purely backend + data wiring.
