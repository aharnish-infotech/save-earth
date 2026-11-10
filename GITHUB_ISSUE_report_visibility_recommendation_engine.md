# [Feature] Report Visibility & Recommendation Engine — Question-Level Configuration

**Labels:** `feature`, `backend`, `flutter`, `report-generation`, `database`
**Priority:** High
**Affects:** Question Library, Audit Template, Report Generation, Flutter Mobile App, PDF Engine

---

## Background

Each question in the Question Library now carries two new configuration fields:

| Field | Type | Values |
|---|---|---|
| `reportVisibility` | `enum` | `both`, `report_only`, `recommendation_only`, `not_applicable` |
| `showRecommendWhen` | `string` | `"yes"` \| `"no"` \| `"na"` |

These fields control **where** and **under what condition** each question's output appears in the final generated PDF report. The admin configures this per-question in the Question Library. The Flutter app captures the auditor's answer. The report engine then uses these rules to place content correctly.

---

## The Four Visibility Modes — Exact Behaviour

### 1. `both` — Main Report Body + Recommendation Section

The question appears **twice** in the report:

**In the Main Report Body (Observations / Findings table):**
- Question text (English + Hindi)
- Auditor's selected answer (YES / NO / N/A or OK / NOT OK / N/A)
- Auditor's on-site remark (if entered)
- Photo(s) attached (if any)

**In the Recommendation Section (end of report), BUT ONLY IF:**
- The auditor's answer matches the `showRecommendWhen` trigger value

If triggered:
- Question text shown as the finding heading
- `recommendEn` / `recommendHi` text shown as the recommended corrective action
- Auditor may override this default text in the app before submission

If NOT triggered:
- The question does NOT appear in the Recommendation Section at all
- It still appears in the main body

**Example:**
> Q: "Whether earthing pits are properly maintained?" → `reportVisibility: both`, `showRecommendWhen: no`
> Auditor answers **NO** → appears in main body AND appears in recommendation section with text "Earthing pits must be repaired and verified by a licensed electrician."
> Auditor answers **YES** → appears in main body only. No recommendation entry generated.

---

### 2. `report_only` — Main Report Body Only

The question appears **only in the Main Report Body** (Observations / Findings table).

- Included: question text, answer, remark, photos
- **Never** generates a recommendation entry, regardless of the answer
- The `showRecommendWhen` and `recommendEn` / `recommendHi` fields are irrelevant and should be ignored during report generation
- The admin UI hides these fields when this mode is selected

**Use case:** Questions that are purely observational / data-capture (e.g., "Record the phase-wise current readings: R: ___ A, Y: ___ A, B: ___ A") — the answer is numeric data for the report, not an action item.

---

### 3. `recommendation_only` — Recommendation Section Only

The question is **not shown in the Main Report Body**.

- It does NOT appear in the Observations / Findings table
- **But**, if the auditor's answer matches `showRecommendWhen`, the recommendation entry IS generated in the Recommendation Section at the end of the report

If triggered:
- Recommendation section entry: Question text as heading + `recommendEn` / `recommendHi` text as the corrective action
- Photos attached for this question are included in the recommendation entry

If NOT triggered:
- Nothing appears anywhere in the report (the question was asked silently)

**Use case:** Stand-alone corrective action items. E.g., "Is there a valid fire NOC on display?" — if NO, the recommendation goes straight into the punch-list without cluttering the main body.

---

### 4. `not_applicable` — Not in Report (Invisible Output)

The question is asked on the Flutter mobile app during the audit. The answer is **recorded in the database**. However:

- The question does **NOT appear** in the Main Report Body
- The question does **NOT appear** in the Recommendation Section
- **No output is generated** for this question anywhere in the PDF

The answer is still stored (for analytics, compliance tracking, internal dashboards) but is completely excluded from the client-facing report.

**Use case:** Internal audit control questions, checklist items for auditor discipline (e.g., "Did the auditor carry a calibrated instrument?"), or questions used only for scoring/risk calculation but not shown to the branch.

---

## Decision Table for Report Generation

```
reportVisibility      | Appears in Main Body | Appears in Rec Section (if trigger matches)
─────────────────────────────────────────────────────────────────────────────────────────
both                  | ✅ Always             | ✅ Yes, if answer == showRecommendWhen
report_only           | ✅ Always             | ❌ Never
recommendation_only   | ❌ Never              | ✅ Yes, if answer == showRecommendWhen
not_applicable        | ❌ Never              | ❌ Never
```

---

## Recommendation Trigger Logic (Pseudo-code)

```typescript
function shouldShowInMainBody(q: Question, answer: AuditAnswer): boolean {
  return q.reportVisibility === "both" || q.reportVisibility === "report_only";
}

function shouldGenerateRecommendation(q: Question, answer: AuditAnswer): boolean {
  if (q.reportVisibility === "report_only" || q.reportVisibility === "not_applicable") {
    return false;
  }
  // "both" or "recommendation_only"
  return answer.value === q.showRecommendWhen; // "yes" | "no" | "na"
}
```

---

## Database Schema Changes

### `questions` table — add columns:

```sql
ALTER TABLE questions
  ADD COLUMN report_visibility VARCHAR(30) NOT NULL DEFAULT 'both'
    CHECK (report_visibility IN ('both', 'report_only', 'recommendation_only', 'not_applicable')),
  ADD COLUMN show_recommend_when VARCHAR(5) NOT NULL DEFAULT 'no'
    CHECK (show_recommend_when IN ('yes', 'no', 'na'));

-- Existing columns that are now used differently:
-- recommend_en TEXT   — paragraph-length text (was VARCHAR; increase limit or change to TEXT)
-- recommend_hi TEXT   — same
```

### `audit_answers` table — no schema change needed
The existing `value` column already stores `'yes'`, `'no'`, `'na'`, `'ok'`, `'not_ok'` as strings.

> **Note on OK / NOT OK questions:** `showRecommendWhen` stores `"yes"` / `"no"` / `"na"` as internal keys regardless of question type. The display label (OK / NOT OK) is derived from `question.type` at render time only. The comparison logic always uses the internal key.

---

## API Changes

### `GET /api/questions/:id` — response additions:
```json
{
  "reportVisibility": "both",
  "showRecommendWhen": "no",
  "recommendEn": "The earthing pits must be repaired and verified by a licensed electrician before the next audit cycle.",
  "recommendHi": "अर्थिंग पिट की मरम्मत की जानी चाहिए और अगले ऑडिट चक्र से पहले एक लाइसेंस प्राप्त इलेक्ट्रीशियन द्वारा सत्यापित किया जाना चाहिए।"
}
```

### `POST /api/questions` and `PATCH /api/questions/:id` — accept the new fields in body:
```json
{
  "reportVisibility": "both",
  "showRecommendWhen": "no",
  "recommendEn": "...",
  "recommendHi": "..."
}
```

---

## Prisma Schema

```prisma
model Question {
  // ... existing fields ...

  recommendEn        String  @default("COMPLIED") @db.Text
  recommendHi        String  @default("ठीक है")   @db.Text
  reportVisibility   String  @default("both")     // both | report_only | recommendation_only | not_applicable
  showRecommendWhen  String  @default("no")       // yes | no | na
}
```

---

## Flutter Mobile App Changes

### During Audit (Question Rendering)
- The Flutter app receives `reportVisibility` and `showRecommendWhen` as part of the synced question data
- **All four visibility types are shown to the auditor equally** — the mobile UI does not hide or skip any question based on visibility
- The visibility setting affects only the **report output**, not the mobile experience
- The auditor answers every question normally regardless of `reportVisibility`

### Recommendation Override (Optional)
- For questions where `reportVisibility` is `both` or `recommendation_only`:
  - After the auditor selects an answer, if `answer == showRecommendWhen`, show an editable text field pre-filled with `recommendEn` (or `recommendHi` based on language setting)
  - The auditor can edit this text before submitting
  - The final submitted `recommendText` (custom or default) is stored in `audit_answers.recommend_text`
  - This overridden text is what goes into the PDF, not the question-level default

### Sync
- Include `reportVisibility` and `showRecommendWhen` in the question sync payload
- These are needed offline (SQLite local schema) so report generation can work without network

---

## PDF Report Generation — Section Structure

### Main Report Body (Findings / Observations Table)

Include only questions where:
```
reportVisibility IN ('both', 'report_only')
```

Columns: Sr. No. | Question | Answer | Remark | Photos

### Recommendation Section (End of Report)

Include only questions where:
```
(reportVisibility IN ('both', 'recommendation_only'))
AND
(audit_answer.value == question.showRecommendWhen)
```

Format per recommendation entry:
```
Sr. | Finding (Question Text) | Recommended Action (recommendEn or auditor-overridden text)
```

---

## Admin UI Behaviour (Already Implemented in Web App)

| `reportVisibility` selected | "Show Recommendation When" visible? | "Default Recommendation Text" visible? |
|---|---|---|
| `both` | ✅ Yes | ✅ Yes |
| `report_only` | ❌ Hidden | ❌ Hidden |
| `recommendation_only` | ✅ Yes | ✅ Yes |
| `not_applicable` | ❌ Hidden | ❌ Hidden — info banner shown instead |

The "Default Recommendation Text" fields are now `<textarea>` (resizable, multi-line) to accommodate paragraph-length corrective action descriptions.

---

## Acceptance Criteria

- [ ] `report_visibility` and `show_recommend_when` columns added to `questions` table with correct constraints and defaults
- [ ] `recommend_en` and `recommend_hi` columns changed to `TEXT` type (no truncation)
- [ ] API endpoints accept and return both new fields
- [ ] Flutter app syncs both fields to local SQLite and uses them during report generation
- [ ] PDF main body includes only `both` and `report_only` questions
- [ ] PDF recommendation section includes only triggered `both` and `recommendation_only` questions
- [ ] Auditor can override the default recommendation text on mobile before submission
- [ ] `not_applicable` questions are stored in DB but produce zero output in any PDF section
- [ ] Existing 50 seed questions default to `report_visibility = 'both'`, `show_recommend_when = 'no'` (no data migration needed beyond defaults)

---

## Files to Change

| File | Change |
|---|---|
| `prisma/schema.prisma` | Add `reportVisibility`, `showRecommendWhen`; change recommend fields to `@db.Text` |
| `prisma/migrations/` | New migration for the two new columns |
| `lib/services/question.service.ts` | Accept + validate new fields in create/update |
| `lib/dto/question.dto.ts` | Add fields to CreateQuestionDto and UpdateQuestionDto |
| `app/api/questions/route.ts` | Pass new fields through |
| `lib/services/report.service.ts` | Implement visibility filter logic in PDF generation |
| `lib/services/pdf.service.ts` | Split main body vs recommendation section by visibility rule |
| `flutter/lib/models/question.dart` | Add `reportVisibility`, `showRecommendWhen` fields |
| `flutter/lib/db/schema.sql` | Add columns to local SQLite questions table |
| `flutter/lib/services/report_generator.dart` | Implement the two-section filter logic |
| `flutter/lib/screens/audit/question_screen.dart` | Show editable recommendation text field when triggered |
