# [Feature] Auto-Create Report Template When Audit Template Is Saved

## 📋 Summary

When a user creates or updates an **Audit Template**, the system should automatically generate a linked **Report Template** in the background — with the same name, bank, circle, and status — pre-populated with all 11 default report blocks. No extra steps, no extra form for the user.

---

## 🧩 Background & Context

The platform has two distinct template systems:

| Template Type | Purpose | Status |
|---|---|---|
| **Audit Template** | Defines the inspection questionnaire — sections, questions, scoring | ✅ Exists |
| **Report Template** | Defines how the final PDF report is structured — block order, visible fields | ✅ UI Complete, needs backend |

The Report Template feature UI is **fully built and merged**:
- `/report-template` — listing page
- `/report-template/new` — 2-step manual creation wizard
- `/report-template/[id]/view` — read-only view
- `/report-template/[id]` — block builder (edit mode)

What's missing is the **backend + auto-creation bridge** between the two template systems.

---

## ✅ Acceptance Criteria

- [ ] When an Audit Template is **created**, a Report Template is automatically created with matching metadata and all 11 default blocks
- [ ] When an Audit Template is **updated**, only the Report Template metadata is updated (name, bank, circle, status) — blocks are NOT reset (user may have customised them)
- [ ] Auto-creation is **silent** — no extra UI, no extra confirmation, no interruption to the Audit Template save flow
- [ ] If auto-creation fails, the error is **logged but does not roll back** the Audit Template save
- [ ] The Report Template is linked to its source Audit Template via `auditTemplateId` foreign key
- [ ] Manually created Report Templates (via `/report-template/new`) work independently with no `auditTemplateId`
- [ ] All 5 REST API endpoints are implemented and functional
- [ ] Existing frontend pages replace hardcoded seed arrays with real API calls (TanStack Query)
- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] Soft delete is supported on Report Templates

---

## 🗄️ Database Schema (Prisma)

Add the following model to `prisma/schema.prisma`:

```prisma
model ReportTemplate {
  id              String    @id @default(uuid())
  displayId       String    @unique          // "RT-001", "RT-002"
  auditTemplateId String?                    // FK → AuditTemplate.id (null if manual)
  bank            String
  bankCode        String                     // "SBI", "BOB", "UCO" etc.
  bankColor       String                     // Hex: "#1a3c8f"
  name            String
  description     String
  status          String                     // "Active" | "Draft" | "Archived"
  version         String    @default("v1.0")
  circle          String                     // "LHO-GAN — Gandhinagar"
  blocksCount     Int       @default(11)
  questionsCount  Int       @default(33)
  timesUsed       Int       @default(0)
  tags            String[]
  blocks          Json                       // ReportBlock[] array
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime?                  // soft delete

  auditTemplate   AuditTemplate? @relation(fields: [auditTemplateId], references: [id])
}
```

Run: `npx prisma migrate dev --name add_report_template`

---

## 🔌 API Endpoints

Implement the following Route Handlers under `app/api/report-templates/`:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/report-templates` | List all (pagination, status filter) |
| `GET` | `/api/report-templates/:id` | Get one by `displayId` |
| `POST` | `/api/report-templates` | Manually create (from wizard) |
| `PUT` | `/api/report-templates/:id` | Update blocks/metadata |
| `DELETE` | `/api/report-templates/:id` | Soft delete |
| `POST` | `/api/report-templates/from-audit/:auditTemplateId` | Internal: auto-create from audit template |

---

## ⚙️ Service Layer

### `ReportTemplateService.autoCreateFromAuditTemplate()`

```typescript
// Called inside AuditTemplateService.create() and AuditTemplateService.update()

async function autoCreateFromAuditTemplate(auditTemplate: AuditTemplate): Promise<void> {
  try {
    const existing = await ReportTemplateRepository.findByAuditTemplateId(auditTemplate.id);

    if (!existing) {
      // CREATE
      const displayId = await generateNextDisplayId(); // "RT-007" etc.
      await ReportTemplateRepository.create({
        displayId,
        auditTemplateId: auditTemplate.id,
        bank:           auditTemplate.bank,
        bankCode:       auditTemplate.bankCode,
        bankColor:      auditTemplate.bankColor,
        name:           auditTemplate.name,
        description:    `Auto-generated report template for ${auditTemplate.name} — ${auditTemplate.bank} ${auditTemplate.circle}`,
        status:         auditTemplate.status,
        version:        "v1.0",
        circle:         auditTemplate.circle,
        blocksCount:    11,
        questionsCount: 33,
        timesUsed:      0,
        tags:           ["Cover Page", "Annexure I–III", "Load Sheet", "Photos"],
        blocks:         DEFAULT_BLOCKS, // full 11-block array — see below
      });
    } else {
      // UPDATE metadata only — never reset blocks
      await ReportTemplateRepository.update(existing.id, {
        name:      auditTemplate.name,
        bank:      auditTemplate.bank,
        bankCode:  auditTemplate.bankCode,
        bankColor: auditTemplate.bankColor,
        circle:    auditTemplate.circle,
        status:    auditTemplate.status,
      });
    }
  } catch (error) {
    // Log but do NOT throw — audit template save must not be blocked
    console.error("[ReportTemplate] Auto-creation failed:", error);
  }
}
```

### ID Generation

```typescript
async function generateNextDisplayId(): Promise<string> {
  const latest = await prisma.reportTemplate.findFirst({
    orderBy: { displayId: "desc" },
    select:  { displayId: true },
  });
  const num = latest ? parseInt(latest.displayId.replace("RT-", ""), 10) : 0;
  return `RT-${String(num + 1).padStart(3, "0")}`;
}
```

---

## 📦 Default Blocks Data

The 11 default blocks that must be saved into the `blocks` JSON column on auto-creation:

<details>
<summary>Click to expand — DEFAULT_BLOCKS array</summary>

```typescript
const DEFAULT_BLOCKS = [
  { id:"cover",      title:"Cover Page",                            subtitle:"Branch identity, FY, audit date, company branding",                     icon:"ri-file-shield-2-line", color:"#2563eb", bg:"#eff6ff", type:"fixed",     visible:true, expanded:false,
    items:[{id:"c1",label:"Bank Name",visible:true},{id:"c2",label:"Branch Name",visible:true},{id:"c3",label:"Branch Code",visible:true},{id:"c4",label:"Branch Address",visible:true},{id:"c5",label:"Financial Year",visible:true},{id:"c6",label:"Audit Date",visible:true},{id:"c7",label:"Auditor Name",visible:true},{id:"c8",label:"RBO",visible:true},{id:"c9",label:"AO (Area Office)",visible:true},{id:"c10",label:"LHO (Local Head Office)",visible:true},{id:"c11",label:"Company Logo & Address",visible:true}] },

  { id:"annexure1",  title:"Annexure I — Electrical Safety Audit",  subtitle:"Branch metadata: load, area, controllers, UPS & DG details",            icon:"ri-file-list-2-line",   color:"#0891b2", bg:"#ecfeff", type:"fixed",     visible:true, expanded:false,
    items:[{id:"a1",label:"Branch Code / Name",visible:true},{id:"a2",label:"Address",visible:true},{id:"a3",label:"BM's PF No., Name and Contact",visible:true},{id:"a4",label:"Sanctioned Load (KW/KVA)",visible:true},{id:"a5",label:"Connected Load (KW/KVA)",visible:true},{id:"a6",label:"Monthly Energy Bill Amount",visible:true},{id:"a7",label:"Tonnage of Air-Conditioners (TR)",visible:true},{id:"a8",label:"Area of Branch / Office (Sq. Ft.)",visible:true},{id:"a9",label:"UPS Details",visible:true},{id:"a10",label:"Generator Details",visible:true}] },

  { id:"annexure2",  title:"Annexure II — Audit Questions",         subtitle:"Main compliance checklist: Yes/No and Observations/Remarks",             icon:"ri-questionnaire-line", color:"#7c3aed", bg:"#f5f3ff", type:"questions", visible:true, expanded:false,
    items:[{id:"q1",label:"MCCBs/MCBs/ELCBs with proper rating",visible:true},{id:"q2",label:"Light & emergency light in electrical rooms",visible:true},{id:"q3",label:"Pump/DG/UPS rooms maintained dry and clean",visible:true},{id:"q4",label:"Water seepage near electrical panels",visible:true},{id:"q5",label:"Earthing pits properly maintained",visible:true},{id:"q6",label:"Preventive maintenance by licensed electrician",visible:true},{id:"q7",label:"PF panel of appropriate rating installed",visible:true},{id:"q8",label:"Fire Protection / Fire Extinguishers",visible:true},{id:"q9",label:"DG set recorded in equipment details",visible:true},{id:"q10",label:"Load distributed in all 3 phases",visible:true}] },

  { id:"annexure3",  title:"Annexure III — Onsite ATM",             subtitle:"ATM-specific electrical and safety compliance questions",                 icon:"ri-bank-card-line",     color:"#0369a1", bg:"#f0f9ff", type:"questions", visible:true, expanded:false,
    items:[{id:"atm1",label:"Fire detector connected to branch AFDS",visible:true},{id:"atm2",label:"MCCB/MCB/ELCB provided and in working condition",visible:true},{id:"atm3",label:"AC units provided with timer circuit device",visible:true},{id:"atm4",label:"Main supply switch/MCB marked for ATM cutoff",visible:true},{id:"atm5",label:"No cooking stove / heater coil in ATM",visible:true}] },

  { id:"ups",        title:"UPS Details",                           subtitle:"UPS/Inverter table, battery specs and live parameter readings",            icon:"ri-battery-charge-line",color:"#15803d", bg:"#f0fdf4", type:"table",     visible:true, expanded:false,
    items:[{id:"ups1",label:"UPS / Inverter Capacity Table",visible:true},{id:"ups2",label:"UPS Parameters (Voltage, Current, Frequency)",visible:true}] },

  { id:"meter",      title:"Meter Details & Electrical Parameters",  subtitle:"Meter info, voltage readings, current readings and power factor",        icon:"ri-dashboard-3-line",   color:"#b45309", bg:"#fffbeb", type:"table",     visible:true, expanded:false,
    items:[{id:"m1",label:"Meter Details",visible:true},{id:"m2",label:"Voltage Readings",visible:true},{id:"m3",label:"Current Readings",visible:true},{id:"m4",label:"Power Factor (PF)",visible:true}] },

  { id:"dg",         title:"DG Set Details",                        subtitle:"Diesel generator specifications, observations and safety standards",       icon:"ri-plug-line",          color:"#6b21a8", bg:"#faf5ff", type:"table",     visible:true, expanded:false,
    items:[{id:"dg1",label:"DG Set — Hired or Owned",visible:true},{id:"dg2",label:"DG Set Capacity (KVA)",visible:true},{id:"dg3",label:"DG Set Make (OEM)",visible:true},{id:"dg4",label:"Acoustic Enclosure Provided",visible:true}] },

  { id:"loadsheet",  title:"Branch Load Sheet",                     subtitle:"Equipment-wise load calculation grouped by category",                     icon:"ri-table-2",            color:"#0f766e", bg:"#f0fdfa", type:"table",     visible:true, expanded:false,
    items:[{id:"ls1",label:"Lighting Load",visible:true},{id:"ls2",label:"Fan Load",visible:true},{id:"ls3",label:"UPS Load",visible:true},{id:"ls4",label:"Air Conditioning Load",visible:true},{id:"ls5",label:"Power Load",visible:true},{id:"ls6",label:"Total Connected Load Summary",visible:true}] },

  { id:"photos",     title:"Photographic Overview",                 subtitle:"Audit observations with risk classification and photo evidence",           icon:"ri-camera-lens-line",   color:"#be123c", bg:"#fff1f2", type:"images",    visible:true, expanded:false,
    items:[{id:"po1",label:"LOW RISK — Observations & Photographs",visible:true},{id:"po2",label:"MEDIUM RISK — Observations & Photographs",visible:true},{id:"po3",label:"HIGH RISK — Observations & Photographs",visible:true},{id:"po4",label:"Signatures",visible:true}] },

  { id:"ebill",      title:"Electricity Bill Image",                subtitle:"Scanned copy of latest electricity bill submitted at branch",             icon:"ri-receipt-line",       color:"#ca8a04", bg:"#fefce8", type:"images",    visible:true, expanded:false,
    items:[{id:"eb1",label:"Electricity Bill Scan / Photo",visible:true}] },

  { id:"samplepics", title:"Sample Images",                         subtitle:"Location-wise photographs captured during the audit visit",               icon:"ri-image-2-line",       color:"#475569", bg:"#f8fafc", type:"images",    visible:true, expanded:false,
    items:[{id:"si1",label:"Branch Front Photo",visible:true},{id:"si2",label:"UPS Room Photo",visible:true},{id:"si3",label:"Main Panel Photo",visible:true},{id:"si4",label:"Fire Extinguishers Photo",visible:true}] },
];
```

</details>

---

## 🖥️ Frontend Changes Required

The existing UI pages use hardcoded `SEED` arrays. Replace with real API calls:

### Files to Update

| File | Change |
|---|---|
| `app/(main)/report-template/page.tsx` | `useQuery` → `GET /api/report-templates` |
| `app/(main)/report-template/[id]/view/page.tsx` | `useQuery` → `GET /api/report-templates/:id` |
| `app/(main)/report-template/[id]/page.tsx` | `useQuery` + `useMutation` → GET + PUT |
| `app/(main)/report-template/new/page.tsx` | `useMutation` → `POST /api/report-templates` on Save |

### Pattern to Follow

```typescript
// Fetch one template
const { data: template, isLoading } = useQuery({
  queryKey: ["report-template", id],
  queryFn:  () => fetch(`/api/report-templates/${id}`).then(r => r.json()),
});

// Update blocks
const updateMutation = useMutation({
  mutationFn: (blocks: ReportBlock[]) =>
    fetch(`/api/report-templates/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ blocks }),
    }).then(r => r.json()),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["report-template", id] });
    showToast("Template updated!");
  },
});
```

---

## 🎨 UI Reference (Do Not Change)

The Report Template view and edit pages are **design-complete**. Screenshots and implementation are in:
- View: `app/(main)/report-template/[id]/view/page.tsx`
- Edit: `app/(main)/report-template/[id]/page.tsx`

**Do not modify any visual design or interaction patterns.** Only replace the data layer.

Key UI rules enforced across this feature:
- Inline styles only (`style={{ ... }}`) — no Tailwind classes
- Remix Icons (`ri-*` prefix) via CDN
- Next.js 15 App Router with `"use client"`
- TypeScript strict — `npx tsc --noEmit` must exit 0

---

## 📁 File Structure

```
app/
  (main)/report-template/
    page.tsx                     ← Update: replace SEED with API
    new/page.tsx                 ← Update: POST on save
    [id]/
      page.tsx                   ← Update: GET + PUT
      view/page.tsx              ← Update: GET
  api/report-templates/
    route.ts                     ← NEW: GET list, POST create
    [id]/
      route.ts                   ← NEW: GET one, PUT update, DELETE
    from-audit/
      [auditTemplateId]/
        route.ts                 ← NEW: POST auto-create

lib/
  report-template/
    repository.ts                ← NEW: Prisma CRUD
    service.ts                   ← NEW: business logic + auto-creation
    defaults.ts                  ← NEW: DEFAULT_BLOCKS constant
    types.ts                     ← NEW: TypeScript interfaces

prisma/
  schema.prisma                  ← UPDATE: add ReportTemplate model
  migrations/
    ..._add_report_template/     ← NEW: migration
```

---

## 🔗 Related

- Audit Template feature (hook point for auto-creation)
- Report Template listing page PR (already merged)
- Report Template view/edit UI PR (already merged)
- PDF generation feature (will consume Report Template blocks — future issue)

---

## Labels
`feature` `backend` `database` `api` `report-template` `priority: high`

## Milestone
`v1.0 — Core Template Engine`

## Assignees
_(assign to backend developer)_
