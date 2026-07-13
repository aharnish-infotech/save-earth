# ZeroForm Campus

College Admission, Student Information & Fee Management System.

## Quick Start

```bash
cd "Zero Form Campus"
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

## Project Structure

```
Zero Form Campus/
├── app/
│   ├── (main)/              # All authenticated pages (sidebar + header layout)
│   │   ├── layout.tsx       # Shell with Sidebar + Header
│   │   └── dashboard/       # Dashboard page
│   ├── layout.tsx           # Root HTML layout
│   └── globals.css          # All ZeroForm CSS + theme imports
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      # 2-stage sidebar (icon rail + text nav)
│   │   └── Header.tsx       # Top bar (session, search, notifications)
│   └── dashboard/           # Dashboard widgets (KPI, charts, tables)
│
├── lib/
│   └── constants/
│       ├── navigation.ts    # All nav items — config-driven
│       └── dashboard-data.ts # Dummy data (replace with API calls)
│
├── modules/                 # Feature modules (add pages + API here)
│   ├── admission-crm/
│   ├── dhe-admissions/
│   ├── students/
│   ├── fees/
│   ├── scholarships/
│   ├── reports/
│   └── settings/
│
├── types/                   # Shared TypeScript types
└── public/assets/           # Theme CSS + icon fonts
```

## Adding a New Module Page

1. Create `app/(main)/<module>/<page>/page.tsx`
2. Add route to `lib/constants/navigation.ts` under the relevant rail item
3. Add components under `components/<module>/` or `modules/<module>/`

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- ApexCharts (react-apexcharts)
- Vyzor theme CSS
- Remix Icons
