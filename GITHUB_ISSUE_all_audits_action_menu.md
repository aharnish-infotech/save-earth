# [Feature] All Audits — Action Menu with Mark as Delivered & Mark as Cancelled

**Labels:** `feature`, `frontend`, `backend`, `api`, `access-control`
**Priority:** High
**Affects:** All Audits list (`/audits`), Audit detail API, Role-based access control

---

## Background

The All Audits list page previously had four separate icon buttons per row (View, Edit, Print, Delete). These have been consolidated into a single `⋯` (three-dot) action menu. Two new actions have been added to this menu: **Mark as Delivered** and **Mark as Cancelled**, each with its own eligibility rule and confirmation flow.

The admin UI already reflects these changes in the web app. The backend needs to implement the API endpoints and enforce the transition rules and access control described below.

---

## What Changed on the Frontend (Already Done)

1. **Action menu** — four icon buttons replaced with a single `⋯` button per row. Opens a dropdown with: View Audit, Edit Audit, View/Print Report, Mark as Delivered, Mark as Cancelled, Delete.
2. **Mark as Delivered** — enabled only when the audit's current status is `Completed`. Greyed out for all other statuses with a "Needs Completed" hint.
3. **Mark as Cancelled** — enabled for `In Progress`, `Draft`, and `Completed` audits. Disabled (greyed out, "Not allowed") for `Delivered` and already `Cancelled` audits.
4. **Confirm modal — Delivered** — a simple confirmation dialog. Single click to confirm. States that the action is irreversible.
5. **Confirm modal — Cancelled** — requires the admin to type a cancellation reason before the confirm button activates. Labelled "admin use only".
6. **Toast notification** — after confirmation, a brief bottom toast shows the result (e.g. "AU-2024-123 marked as Delivered").
7. **Instant UI update** — the status badge in the row updates immediately in local state without a page reload.

---

## What the Backend Must Implement

### 1. `PATCH /api/audits/:id/status`

This is the single endpoint that handles all status transitions triggered from the web app.

**Request body:**
```json
{
  "status": "DELIVERED"
}
```
```json
{
  "status": "CANCELLED",
  "cancellationReason": "Branch closed permanently. Audit voided by supervisor."
}
```

**Validation and rules:**

| Requested status | Allowed when current status is | Allowed for roles |
|---|---|---|
| `DELIVERED` | `COMPLETED` only | Any authenticated web user |
| `CANCELLED` | `IN_PROGRESS`, `DRAFT`, or `COMPLETED` | `ADMIN` role only |

If validation fails, return `422 Unprocessable Entity`:

```json
{ "error": "Cannot mark as Delivered — audit must be in Completed status first." }
{ "error": "Only admins can cancel an audit." }
{ "error": "Cannot cancel a Delivered audit." }
{ "error": "Cancellation reason is required." }
```

**On success:**

For `DELIVERED`:
```json
{
  "id": "AU-2024-123",
  "status": "DELIVERED",
  "deliveredAt": "2024-07-27T10:30:00Z",
  "deliveredByUserId": 12
}
```

For `CANCELLED`:
```json
{
  "id": "AU-2024-123",
  "status": "CANCELLED",
  "cancellationReason": "Branch closed permanently.",
  "cancelledAt": "2024-07-27T10:30:00Z",
  "cancelledByUserId": 7
}
```

---

### 2. Database changes

```sql
ALTER TABLE audits
  ADD COLUMN delivered_by_user_id  INT      NULL,
  ADD COLUMN delivered_at          DATETIME NULL,
  ADD COLUMN cancellation_reason   TEXT     NULL,
  ADD COLUMN cancelled_by_user_id  INT      NULL,
  ADD COLUMN cancelled_at          DATETIME NULL;
```

---

### 3. Prisma schema additions

```prisma
model Audit {
  // ... existing fields ...
  deliveredByUserId  Int?
  deliveredAt        DateTime?
  cancellationReason String?   @db.Text
  cancelledByUserId  Int?
  cancelledAt        DateTime?
}
```

---

### 4. Audit trail

Every call to `PATCH /api/audits/:id/status` must insert one row into `audit_status_history`:

```sql
INSERT INTO audit_status_history (audit_id, from_status, to_status, changed_by, changed_at, reason)
VALUES (:auditId, :fromStatus, :toStatus, :userId, NOW(), :reason);
```

The `reason` column is `NULL` for `DELIVERED` and contains the `cancellationReason` text for `CANCELLED`.

---

### 5. Role enforcement

The `CANCELLED` transition must be gated on the user's role at the service layer, not just the controller. The check must happen inside `AuditStatusService.canTransition()` so it cannot be bypassed by any other call path.

```typescript
if (to === "CANCELLED" && user.role !== "ADMIN") {
  throw new ForbiddenException("Only admins can cancel an audit.");
}
```

---

### 6. `GET /api/audits` — ensure `Cancelled` is a filterable status

The existing status filter query param must accept `CANCELLED` as a valid value and return matching records. Update any hard-coded status allow-lists in the filter layer.

---

## Acceptance Criteria

- [ ] `PATCH /api/audits/:id/status` endpoint exists and is authenticated
- [ ] `DELIVERED` transition rejected unless current status is `COMPLETED` (422 returned)
- [ ] `CANCELLED` transition rejected unless current status is `IN_PROGRESS`, `DRAFT`, or `COMPLETED` (422 returned)
- [ ] `CANCELLED` transition rejected if the requesting user is not `ADMIN` (403 returned)
- [ ] `CANCELLED` request with empty `cancellationReason` rejected (422 returned)
- [ ] `delivered_at`, `delivered_by_user_id`, `cancelled_at`, `cancelled_by_user_id`, `cancellation_reason` columns added to `audits` table and populated correctly
- [ ] Every status transition is logged in `audit_status_history`
- [ ] `GET /api/audits?status=CANCELLED` returns correct results
- [ ] The web app's `⋯` menu calls `PATCH /api/audits/:id/status` and updates the row status from the API response (replace local-state-only update with real API call)

---

## Files to Change

| File | Change |
|---|---|
| `prisma/schema.prisma` | Add 5 new nullable columns to `Audit` model |
| `prisma/migrations/` | New migration for the new columns |
| `app/api/audits/[id]/status/route.ts` | New PATCH endpoint |
| `lib/services/audit-status.service.ts` | `canTransition()` with role check |
| `lib/services/audit.service.ts` | Call `canTransition()`, write history row, update timestamp columns |
| `lib/dto/audit.dto.ts` | `UpdateAuditStatusDto` — `status` (enum), `cancellationReason` (optional string) |
| `app/(main)/audits/page.tsx` | Replace local-state update with real API call on confirm |
