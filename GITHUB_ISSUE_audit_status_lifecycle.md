# [Feature] Audit Status Lifecycle — 5-State Engine with Transition Rules & Access Control

**Labels:** `feature`, `backend`, `flutter`, `database`, `api`, `access-control`
**Priority:** High
**Affects:** Audit model, All Audits list, Flutter audit submission flow, API endpoints, Report generation, Dashboard counters

---

## Background

The audit lifecycle has been redesigned from 4 informal states to a formally defined 5-state engine. Each state now carries explicit rules for who can set it, from which states it can be reached, and whether the audit record is writable or frozen. The admin UI (Status Master in Settings) already reflects this. The backend, API, and Flutter app need to be brought in line.

---

## The Five States

| Code | Display Name | Set By | Writable | Transitions From |
|---|---|---|---|---|
| `IN_PROGRESS` | In Progress | Auditor — Flutter app | ✓ Yes | — Initial state |
| `DRAFT` | Draft | Auditor — Flutter app | ✓ Yes | `IN_PROGRESS` only |
| `COMPLETED` | Completed | Auditor — Flutter app | ✕ Frozen | `DRAFT` only |
| `DELIVERED` | Delivered | Web app — any authenticated user | ✕ Frozen | `COMPLETED` only |
| `CANCELLED` | Cancelled | Admin — Web app only | ✕ Frozen | `IN_PROGRESS`, `DRAFT`, or `COMPLETED` (not `DELIVERED`) |

### What each state means

**`IN_PROGRESS`**
Steps 1–12. The field auditor is on site and working through the data collection sheets. The audit record is fully editable. Set automatically when the auditor opens a new audit on the Flutter app.

**`DRAFT`**
Step 13 submitted. The branch has received a copy of the report for review. The audit is still editable so the auditor can make corrections while still on site. Triggered when the auditor submits Step 13 on Flutter.

**`COMPLETED`**
Step 14 submitted. The branch manager has physically signed and sealed the attendance sheet and the auditor has photographed it. This is the definition of complete — there is no additional admin approval step. The audit record is frozen from this point. No further edits by the auditor. Triggered when the auditor submits Step 14 on Flutter.

**`DELIVERED`**
The final report has been formally delivered to the branch/client. This status is set from the web application only. It cannot be set unless the current status is `COMPLETED`. Once set, the audit is frozen permanently — no path back to any previous state.

**`CANCELLED`**
The audit has been voided by an admin. Can be applied to any audit in `IN_PROGRESS`, `DRAFT`, or `COMPLETED`. **Cannot be applied to a `DELIVERED` audit under any circumstances.** Only a user with the `ADMIN` role can trigger this transition. A cancellation reason (plain text) is required and must be stored against the audit record. Once cancelled, the audit is frozen.

---

## Transition Rules — Enforcement Matrix

```
Current Status  │ → IN_PROGRESS │ → DRAFT   │ → COMPLETED │ → DELIVERED │ → CANCELLED
────────────────┼───────────────┼───────────┼─────────────┼─────────────┼────────────
IN_PROGRESS     │      —        │   ✓ App   │      ✗      │      ✗      │  ✓ Admin
DRAFT           │      ✗        │     —     │   ✓ App     │      ✗      │  ✓ Admin
COMPLETED       │      ✗        │     ✗     │      —      │  ✓ Web app  │  ✓ Admin
DELIVERED       │      ✗        │     ✗     │      ✗      │      —      │      ✗
CANCELLED       │      ✗        │     ✗     │      ✗      │      ✗      │      —
```

Any transition not marked ✓ must be rejected by the API with HTTP 422 and a descriptive error message.

---

## Backend Changes

### 1. Database — `audits` table

```sql
-- Rename existing status column values to match new codes
-- (or add a migration that maps old values → new codes)

ALTER TABLE audits
  MODIFY COLUMN status ENUM(
    'IN_PROGRESS',
    'DRAFT',
    'COMPLETED',
    'DELIVERED',
    'CANCELLED'
  ) NOT NULL DEFAULT 'IN_PROGRESS';

-- Add cancellation reason column
ALTER TABLE audits
  ADD COLUMN cancellation_reason TEXT NULL,
  ADD COLUMN cancelled_by_user_id INT NULL,
  ADD COLUMN cancelled_at DATETIME NULL,
  ADD COLUMN delivered_by_user_id INT NULL,
  ADD COLUMN delivered_at DATETIME NULL;
```

### 2. Prisma Schema

```prisma
enum AuditStatus {
  IN_PROGRESS
  DRAFT
  COMPLETED
  DELIVERED
  CANCELLED
}

model Audit {
  // ... existing fields ...
  status              AuditStatus  @default(IN_PROGRESS)
  cancellationReason  String?      @db.Text
  cancelledByUserId   Int?
  cancelledAt         DateTime?
  deliveredByUserId   Int?
  deliveredAt         DateTime?
}
```

### 3. Status Transition Service

Create `lib/services/audit-status.service.ts`:

```typescript
export type AuditStatus = "IN_PROGRESS" | "DRAFT" | "COMPLETED" | "DELIVERED" | "CANCELLED";

const ALLOWED_TRANSITIONS: Record<AuditStatus, AuditStatus[]> = {
  IN_PROGRESS: ["DRAFT",      "CANCELLED"],
  DRAFT:       ["COMPLETED",  "CANCELLED"],
  COMPLETED:   ["DELIVERED",  "CANCELLED"],
  DELIVERED:   [],
  CANCELLED:   [],
};

const ADMIN_ONLY: AuditStatus[] = ["CANCELLED"];
const WEB_ONLY:   AuditStatus[] = ["DELIVERED", "CANCELLED"];

export function canTransition(
  from: AuditStatus,
  to: AuditStatus,
  userRole: "AUDITOR" | "USER" | "ADMIN"
): { allowed: boolean; reason?: string } {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    return { allowed: false, reason: `Cannot transition from ${from} to ${to}` };
  }
  if (ADMIN_ONLY.includes(to) && userRole !== "ADMIN") {
    return { allowed: false, reason: `Only admins can set status to ${to}` };
  }
  return { allowed: true };
}
```

### 4. API Endpoints

#### `PATCH /api/audits/:id/status`

**Request body:**
```json
{
  "status": "DELIVERED",
  "cancellationReason": "optional — required when status is CANCELLED"
}
```

**Validation rules:**
- Load the current audit and check its status.
- Call `canTransition(current.status, body.status, req.user.role)`.
- If not allowed, return `422 Unprocessable Entity` with `{ error: "..reason.." }`.
- If `status === "CANCELLED"` and `cancellationReason` is empty or missing, return `422`.
- On success, update `status`, set `cancelledAt` / `deliveredAt` / `cancelledByUserId` / `deliveredByUserId` as appropriate.
- Write an audit trail entry: `{ auditId, fromStatus, toStatus, userId, timestamp, reason? }`.

**Response:**
```json
{
  "id": "AU-2024-123",
  "status": "DELIVERED",
  "deliveredAt": "2024-07-27T10:30:00Z",
  "deliveredByUserId": 12
}
```

#### `GET /api/audits` — filter support
Add `?status=COMPLETED` query param support. The filter accepts any valid `AuditStatus` value.

---

## Flutter App Changes

### State machine in Dart

```dart
enum AuditStatus { inProgress, draft, completed, delivered, cancelled }

extension AuditStatusX on AuditStatus {
  bool get isEditable => this == AuditStatus.inProgress || this == AuditStatus.draft;
  bool get isFrozen   => !isEditable;

  static AuditStatus fromString(String s) => switch (s) {
    'IN_PROGRESS' => AuditStatus.inProgress,
    'DRAFT'       => AuditStatus.draft,
    'COMPLETED'   => AuditStatus.completed,
    'DELIVERED'   => AuditStatus.delivered,
    'CANCELLED'   => AuditStatus.cancelled,
    _             => throw ArgumentError('Unknown status: $s'),
  };

  String toApiString() => name.toUpperCase();
}
```

### Audit submission flow

| Auditor action | Triggers transition | API call |
|---|---|---|
| Opens a new audit | Creates audit in `IN_PROGRESS` | `POST /api/audits` |
| Submits Step 13 | `IN_PROGRESS → DRAFT` | `PATCH /api/audits/:id/status` `{ status: "DRAFT" }` |
| Submits Step 14 (attendance photo + manager signature) | `DRAFT → COMPLETED` | `PATCH /api/audits/:id/status` `{ status: "COMPLETED" }` |

### Edit lock enforcement

After syncing an audit from the server, check `audit.status.isEditable`:
- If `false` (COMPLETED, DELIVERED, CANCELLED): render all Step forms in **read-only mode**. No save buttons. Show a banner: `"This audit is closed and cannot be edited."`
- If `true`: normal editable flow.

### Sync — SQLite local schema

```sql
ALTER TABLE audits
  ADD COLUMN cancellation_reason TEXT,
  ADD COLUMN cancelled_at TEXT,
  ADD COLUMN delivered_at TEXT;
```

The sync engine must pull and store the latest `status` from the server on every sync cycle, so the edit-lock state is always current even when the auditor goes back online after being offline.

---

## Access Control Summary

| Action | Allowed roles | Channel |
|---|---|---|
| Create audit (IN_PROGRESS) | Auditor, Admin | Flutter app + Web |
| Move to DRAFT (Step 13) | Auditor | Flutter app only |
| Move to COMPLETED (Step 14) | Auditor | Flutter app only |
| Move to DELIVERED | Any authenticated user | Web app only |
| Move to CANCELLED | Admin only | Web app only |
| View any audit | All roles | Both |
| Edit audit (while writable) | Auditor (owner), Admin | Flutter app + Web |

---

## Audit Trail

Every status transition must be recorded in an `audit_status_history` table:

```sql
CREATE TABLE audit_status_history (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  audit_id      VARCHAR(30) NOT NULL,
  from_status   VARCHAR(20) NOT NULL,
  to_status     VARCHAR(20) NOT NULL,
  changed_by    INT NOT NULL,          -- user ID
  changed_at    DATETIME DEFAULT NOW(),
  reason        TEXT NULL,             -- populated for CANCELLED
  FOREIGN KEY (audit_id) REFERENCES audits(id)
);
```

---

## Dashboard Counter Updates

The dashboard status counters must reflect all 5 states. Query:

```sql
SELECT status, COUNT(*) AS count
FROM audits
GROUP BY status;
```

Map to display labels:
- `IN_PROGRESS` → "In Progress"
- `DRAFT`       → "Draft"
- `COMPLETED`   → "Completed"
- `DELIVERED`   → "Delivered"
- `CANCELLED`   → "Cancelled"

---

## Data Migration

Existing status values in the database (old system) map to new codes as follows:

| Old value | New code |
|---|---|
| `In Progress` | `IN_PROGRESS` |
| `Draft` | `DRAFT` |
| `Pending Approval` | `COMPLETED` |
| `Delivered` | `DELIVERED` |

No existing status maps to `CANCELLED` — this is a new state.

```sql
UPDATE audits SET status = 'IN_PROGRESS' WHERE status = 'In Progress';
UPDATE audits SET status = 'DRAFT'       WHERE status = 'Draft';
UPDATE audits SET status = 'COMPLETED'   WHERE status = 'Pending Approval';
UPDATE audits SET status = 'DELIVERED'   WHERE status = 'Delivered';
```

Run these migrations **before** altering the column to the ENUM type.

---

## Acceptance Criteria

- [ ] `audits.status` column is `ENUM('IN_PROGRESS','DRAFT','COMPLETED','DELIVERED','CANCELLED')`
- [ ] `cancellation_reason`, `cancelled_at`, `delivered_at` columns added
- [ ] `audit_status_history` table created and populated on every transition
- [ ] `PATCH /api/audits/:id/status` enforces the transition matrix — invalid transitions return 422
- [ ] `CANCELLED` transition rejected unless `req.user.role === 'ADMIN'`
- [ ] `DELIVERED` transition rejected unless current status is `COMPLETED`
- [ ] `CANCELLED` transition rejected if current status is `DELIVERED`
- [ ] `CANCELLED` requires non-empty `cancellationReason` in request body
- [ ] Flutter Step 13 submission triggers `IN_PROGRESS → DRAFT`
- [ ] Flutter Step 14 submission triggers `DRAFT → COMPLETED`
- [ ] Flutter renders all step forms in read-only mode when `status.isFrozen === true`
- [ ] Flutter edit-lock state synced from server on every sync cycle
- [ ] Dashboard counters updated for all 5 states
- [ ] Existing data migration script tested on staging before production deploy
- [ ] All old "Pending Approval" values migrated to "COMPLETED"

---

## Files to Change

| File | Change |
|---|---|
| `prisma/schema.prisma` | Add `AuditStatus` enum, new nullable columns |
| `prisma/migrations/` | Migration for new ENUM + new columns + data migration |
| `lib/services/audit-status.service.ts` | New — transition matrix + `canTransition()` |
| `lib/services/audit.service.ts` | Use `canTransition()` in update flow |
| `app/api/audits/[id]/status/route.ts` | New PATCH endpoint |
| `app/api/audits/route.ts` | Add `?status=` filter param |
| `lib/dto/audit.dto.ts` | Add `UpdateAuditStatusDto` with Zod validation |
| `flutter/lib/models/audit.dart` | Update `AuditStatus` enum + `fromString` |
| `flutter/lib/db/schema.sql` | Add new columns to local SQLite |
| `flutter/lib/services/audit_submission_service.dart` | Trigger correct status transition on Step 13 / Step 14 submit |
| `flutter/lib/screens/audit/audit_form_screen.dart` | Enforce read-only mode when `isFrozen` |
| `flutter/lib/services/sync_service.dart` | Ensure status pulled on every sync |
