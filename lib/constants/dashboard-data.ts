// ORBIT Compliance ERP — Dashboard seed data
// Client: Save Earth Energy | Domain: Bank Branch Audit Inspection
// Replace these arrays with API calls when backend is ready.

export const KPI_CARDS = [
  {
    id: "total-audits",
    label: "Total Audits",
    value: "128",
    trend: "+14",
    trendDir: "up" as const,
    trendLabel: "This Month",
    icon: "ri-file-list-3-line",
    colorClass: "primary",
  },
  {
    id: "approved",
    label: "Approved",
    value: "74",
    trend: "+8.1%",
    trendDir: "up" as const,
    trendLabel: "This Month",
    icon: "ri-checkbox-circle-line",
    colorClass: "success",
  },
  {
    id: "pending-review",
    label: "Pending Review",
    value: "7",
    trend: "-2",
    trendDir: "down" as const,
    trendLabel: "vs Last Week",
    icon: "ri-time-line",
    colorClass: "danger",
  },
  {
    id: "branches-covered",
    label: "Branches Covered",
    value: "312",
    trend: "+22",
    trendDir: "up" as const,
    trendLabel: "This Month",
    icon: "ri-building-2-line",
    colorClass: "info",
  },
  {
    id: "active-auditors",
    label: "Active Auditors",
    value: "5",
    trend: "3 On Field",
    trendDir: "up" as const,
    trendLabel: "Live Now",
    icon: "ri-user-star-line",
    colorClass: "warning",
  },
  {
    id: "reports-generated",
    label: "Reports Generated",
    value: "34",
    trend: "+6",
    trendDir: "up" as const,
    trendLabel: "This Month",
    icon: "ri-file-pdf-line",
    colorClass: "secondary",
  },
];

// Audit workflow pipeline stages
export const FUNNEL_STAGES = [
  { label: "Assigned",    count: 128, pct: 100,  color: "#16a34a" },
  { label: "In Progress", count: 96,  pct: 75.0, color: "#2563eb" },
  { label: "Submitted",   count: 81,  pct: 63.3, color: "#10b981" },
  { label: "In Review",   count: 54,  pct: 42.2, color: "#15803d" },
  { label: "Approved",    count: 74,  pct: 57.8, color: "#16a34a" },
  { label: "Delivered",   count: 61,  pct: 47.7, color: "#0891b2" },
];

// Monthly audit submission vs approval trend
export const TREND_SERIES = {
  months:    ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  submitted: [18, 22, 31, 28, 35, 29, 26, 33, 30, 38, 42, 48],
  approved:  [12, 16, 24, 20, 28, 22, 19, 26, 24, 30, 35, 40],
};

// Bank-wise branch coverage breakdown
export const BANK_COVERAGE = [
  { name: "SBI Gujarat",   value: 84, pct: 27, color: "#16a34a" },
  { name: "SBI MP",        value: 62, pct: 20, color: "#2563eb" },
  { name: "SBI Rajasthan", value: 55, pct: 18, color: "#10b981" },
  { name: "Bank of Baroda",value: 38, pct: 12, color: "#15803d" },
  { name: "UCO Bank",      value: 29, pct: 9,  color: "#0891b2" },
  { name: "Others",        value: 44, pct: 14, color: "#94a3b8" },
];

// Today's completed / submitted audits
export const TODAY_AUDITS = [
  { auditId: "AU-2024-131", auditor: "Rajesh Kumar",  bank: "SBI",           branch: "SBI Maninagar",   completedAt: "09:45 AM", score: 87, status: "Submitted" },
  { auditId: "AU-2024-130", auditor: "Sneha Patel",   bank: "SBI",           branch: "SBI CG Road",     completedAt: "11:20 AM", score: 92, status: "Approved"  },
  { auditId: "AU-2024-129", auditor: "Vikas Tiwari",  bank: "Bank of Baroda",branch: "BOB Ahmedabad",   completedAt: "01:10 PM", score: 78, status: "Submitted" },
  { auditId: "AU-2024-128", auditor: "Divya Mehta",   bank: "UCO Bank",      branch: "UCO Kolkata HO",  completedAt: "03:00 PM", score: 95, status: "Approved"  },
  { auditId: "AU-2024-127", auditor: "Arjun Yadav",   bank: "SBI",           branch: "SBI Navrangpura", completedAt: "04:30 PM", score: 81, status: "Submitted" },
];

// In-progress and overdue audits (used by IncompleteAudits widget)
export const INCOMPLETE_AUDITS = [
  { auditId:"AU-2024-132", auditor:"Rajesh Kumar", bank:"SBI",           branch:"SBI Bodakdev",    assignedDate:"27 Jul 2024", dueDate:"30 Jul 2024", daysLeft:3,  progress:60, status:"In Progress" },
  { auditId:"AU-2024-133", auditor:"Sneha Patel",  bank:"SBI",           branch:"SBI Satellite",   assignedDate:"26 Jul 2024", dueDate:"29 Jul 2024", daysLeft:2,  progress:40, status:"In Progress" },
  { auditId:"AU-2024-134", auditor:"Vikas Tiwari", bank:"Bank of Baroda",branch:"BOB Baroda Main", assignedDate:"25 Jul 2024", dueDate:"28 Jul 2024", daysLeft:1,  progress:75, status:"In Progress" },
  { auditId:"AU-2024-135", auditor:"Divya Mehta",  bank:"SBI",           branch:"SBI MP Nagar",    assignedDate:"24 Jul 2024", dueDate:"27 Jul 2024", daysLeft:0,  progress:20, status:"Overdue"     },
  { auditId:"AU-2024-136", auditor:"Arjun Yadav",  bank:"UCO Bank",      branch:"UCO Patna",       assignedDate:"23 Jul 2024", dueDate:"26 Jul 2024", daysLeft:-1, progress:10, status:"Overdue"     },
  { auditId:"AU-2024-137", auditor:"Rajesh Kumar", bank:"SBI",           branch:"SBI Vastrapur",   assignedDate:"27 Jul 2024", dueDate:"31 Jul 2024", daysLeft:4,  progress:0,  status:"Assigned"    },
  { auditId:"AU-2024-138", auditor:"Sneha Patel",  bank:"SBI",           branch:"SBI Indore Main", assignedDate:"27 Jul 2024", dueDate:"01 Aug 2024", daysLeft:5,  progress:0,  status:"Assigned"    },
];

// Top auditors leaderboard
export const AUDITORS_LEADERBOARD = [
  { rank: 1, name: "Rajesh Kumar", count: 38, trophy: true  },
  { rank: 2, name: "Sneha Patel",  count: 31, trophy: false },
  { rank: 3, name: "Vikas Tiwari", count: 24, trophy: false },
  { rank: 4, name: "Divya Mehta",  count: 18, trophy: false },
  { rank: 5, name: "Arjun Yadav",  count: 9,  trophy: false },
];

// Overdue / pending-action audits
export const OVERDUE_AUDITS = [
  { rank: 1, name: "SBI Vastrapur",   auditId: "AU-2024-115", overdue: "12+ Days", tier: "red"    as const },
  { rank: 2, name: "SBI Bodakdev",    auditId: "AU-2024-118", overdue: "9 Days",   tier: "red"    as const },
  { rank: 3, name: "SBI Bhopal Main", auditId: "AU-2024-120", overdue: "7 Days",   tier: "red"    as const },
  { rank: 4, name: "SBI MP Nagar",    auditId: "AU-2024-123", overdue: "4 Days",   tier: "orange" as const },
  { rank: 5, name: "SBI Satellite",   auditId: "AU-2024-126", overdue: "2 Days",   tier: "orange" as const },
];

// Recent activity feed
export const RECENT_ACTIVITIES = [
  { color: "#16a34a", text: "Audit submitted for",             highlight: "SBI Paldi Branch",        time: "10 mins ago" },
  { color: "#2563eb", text: "AU-2024-122 approved by",         highlight: "Admin — Priya Sharma",     time: "25 mins ago" },
  { color: "#10b981", text: "Report delivered to client for",  highlight: "SBI CG Road",              time: "40 mins ago" },
  { color: "#15803d", text: "New branch registered —",         highlight: "SBI Navrangpura, Gujarat", time: "1 hour ago"  },
  { color: "#0891b2", text: "Audit assigned to Rajesh Kumar —",highlight: "SBI Maninagar",            time: "2 hours ago" },
];
