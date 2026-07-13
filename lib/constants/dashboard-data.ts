// All dashboard dummy data lives here — swap for API calls later

export const KPI_CARDS = [
  {
    id: "total-enquiries",
    label: "Total Enquiries",
    value: "12,850",
    trend: "+12.5%",
    trendDir: "up" as const,
    trendLabel: "This Year",
    icon: "ri-group-2-line",
    colorClass: "primary",
  },
  {
    id: "dhe-registered",
    label: "DHE Registered",
    value: "8,542",
    trend: "+8.1%",
    trendDir: "up" as const,
    trendLabel: "This Year",
    icon: "ri-file-list-3-line",
    colorClass: "info",
  },
  {
    id: "govt-allotted",
    label: "Govt Allotted",
    value: "4,125",
    trend: "+10.3%",
    trendDir: "up" as const,
    trendLabel: "This Year",
    icon: "ri-shield-check-line",
    colorClass: "success",
  },
  {
    id: "final-admissions",
    label: "Final Admissions",
    value: "2,854",
    trend: "+9.7%",
    trendDir: "up" as const,
    trendLabel: "This Year",
    icon: "ri-graduation-cap-line",
    colorClass: "secondary",
  },
  {
    id: "fee-collected",
    label: "Fee Collected",
    value: "₹ 12.76 Cr",
    trend: "+14.2%",
    trendDir: "up" as const,
    trendLabel: "This Year",
    icon: "ri-money-rupee-circle-line",
    colorClass: "warning",
  },
  {
    id: "outstanding",
    label: "Outstanding Amount",
    value: "₹ 2.35 Cr",
    trend: "-3.4%",
    trendDir: "down" as const,
    trendLabel: "This Year",
    icon: "ri-file-damage-line",
    colorClass: "danger",
  },
];

export const FUNNEL_STAGES = [
  { label: "Enquiries",     count: 12850, pct: 100,  color: "#7c3aed" },
  { label: "Interested",    count: 7245,  pct: 56.4, color: "#2563eb" },
  { label: "Counseling Done", count: 5128, pct: 39.9, color: "#10b981" },
  { label: "DHE Registered", count: 8542, pct: 66.2, color: "#f59e0b" },
  { label: "Allotted",      count: 4125,  pct: 48.3, color: "#f97316" },
  { label: "Admitted",      count: 2854,  pct: 69.1, color: "#ec4899" },
];

export const TREND_SERIES = {
  months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  enquiries: [820, 1050, 1680, 1920, 2100, 1750, 1580, 1640, 1520, 1720, 2050, 2400],
  admissions: [200,  380,  720,  850,  920,  760,  680,  710,  650,  740,  910, 1050],
};

export const CATEGORY_ALLOTMENT = [
  { name: "General", value: 1733, pct: 42, color: "#7c3aed" },
  { name: "OBC",     value: 1156, pct: 28, color: "#2563eb" },
  { name: "SC",      value: 619,  pct: 15, color: "#10b981" },
  { name: "ST",      value: 413,  pct: 10, color: "#f59e0b" },
  { name: "EWS",     value: 204,  pct: 5,  color: "#ec4899" },
];

export const TODAY_EVENTS = [
  {
    icon: "ri-user-voice-line",
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
    title: "Counseling Session",
    meta: "BCA 1st Year",
    time: "09:00 AM",
  },
  {
    icon: "ri-calendar-close-line",
    iconBg: "#fee2e2",
    iconColor: "#dc2626",
    title: "DHE Choice Filling Last Date",
    meta: "9 Days Remaining",
    time: "11:59 PM",
  },
  {
    icon: "ri-award-line",
    iconBg: "#d1fae5",
    iconColor: "#059669",
    title: "Allotment Round 2 Result",
    meta: "Announced",
    time: "02:00 PM",
  },
  {
    icon: "ri-bill-line",
    iconBg: "#fef9c3",
    iconColor: "#d97706",
    title: "Fee Due Reminder",
    meta: "24 Students",
    time: "03:30 PM",
  },
  {
    icon: "ri-folder-check-line",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
    title: "Document Verification",
    meta: "15 Pending",
    time: "04:00 PM",
  },
];

export const COUNSELOR_LEADERBOARD = [
  { rank: 1, name: "Riya Sharma",   count: 156, trophy: true },
  { rank: 2, name: "Amit Verma",    count: 128, trophy: false },
  { rank: 3, name: "Neha Singh",    count: 112, trophy: false },
  { rank: 4, name: "Sandeep Patel", count: 98,  trophy: false },
  { rank: 5, name: "Rahul Yadav",   count: 87,  trophy: false },
];

export const FEE_DEFAULTERS = [
  { rank: 1, name: "Vikram Singh",  amount: "₹ 95,000", overdue: "120+ Days", tier: "red" as const },
  { rank: 2, name: "Arjun Patel",   amount: "₹ 78,500", overdue: "90+ Days",  tier: "red" as const },
  { rank: 3, name: "Pooja Sharma",  amount: "₹ 65,000", overdue: "90+ Days",  tier: "red" as const },
  { rank: 4, name: "Karan Verma",   amount: "₹ 48,000", overdue: "60+ Days",  tier: "orange" as const },
  { rank: 5, name: "Neha Gupta",    amount: "₹ 42,500", overdue: "60+ Days",  tier: "orange" as const },
];

export const RECENT_ACTIVITIES = [
  {
    color: "#7c3aed",
    text: "New enquiry received from",
    highlight: "Rahul Kumar",
    time: "10 mins ago",
  },
  {
    color: "#10b981",
    text: "Payment of ₹25,000 received from",
    highlight: "Anjali Verma",
    time: "25 mins ago",
  },
  {
    color: "#2563eb",
    text: "DHE registration completed for",
    highlight: "Aman Patel",
    time: "40 mins ago",
  },
  {
    color: "#d97706",
    text: "Documents verified for",
    highlight: "Priya Singh",
    time: "1 hour ago",
  },
  {
    color: "#ec4899",
    text: "Counseling completed for",
    highlight: "Mohit Yadav",
    time: "2 hours ago",
  },
];
