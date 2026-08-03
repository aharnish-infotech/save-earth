// ORBIT Compliance ERP — Shared Audit Seed Data
// Workflow: In Progress → Completed → Pending Review → Approved → Delivered

export type AuditStatus =
  | "In Progress"
  | "Completed"
  | "Pending Review"
  | "Approved"
  | "Delivered";

export interface Audit {
  id: string;
  bank: string;
  bankCode: string;
  branch: string;
  branchCode: string;
  circle: string;
  city: string;
  state: string;
  auditor: string;
  auditorId: string;
  coordinator: string;
  template: string;
  status: AuditStatus;
  startDate: string;
  dueDate: string;
  submittedDate?: string;
  reviewedDate?: string;
  approvedDate?: string;
  deliveredDate?: string;
  score?: number;
  progress: number; // 0–100
  ncr: number;      // Non-conformance reports
  photos: number;
  remarks?: string;
}

export const AUDITS: Audit[] = [
  // ── In Progress ────────────────────────────────────────────────────────────
  { id:"AU-2024-132", bank:"SBI",            bankCode:"SBI",  branch:"SBI Bodakdev",         branchCode:"SBI-GJ-BOD", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Rajesh Kumar",  auditorId:"EMP-004", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"In Progress",   startDate:"25 Jul 2024", dueDate:"30 Jul 2024", progress:60, ncr:0, photos:12 },
  { id:"AU-2024-133", bank:"SBI",            bankCode:"SBI",  branch:"SBI Satellite",        branchCode:"SBI-GJ-SAT", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Sneha Patel",   auditorId:"EMP-005", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"In Progress",   startDate:"26 Jul 2024", dueDate:"29 Jul 2024", progress:40, ncr:0, photos:8  },
  { id:"AU-2024-134", bank:"Bank of Baroda", bankCode:"BOB",  branch:"BOB Baroda Main",      branchCode:"BOB-GJ-BAR", circle:"BOB Gujarat",      city:"Vadodara",  state:"Gujarat",      auditor:"Vikas Tiwari",  auditorId:"EMP-006", coordinator:"Sunita Verma", template:"Electrical Safety v2.1", status:"In Progress",   startDate:"25 Jul 2024", dueDate:"28 Jul 2024", progress:75, ncr:1, photos:20 },
  { id:"AU-2024-141", bank:"SBI",            bankCode:"SBI",  branch:"SBI Vastrapur",        branchCode:"SBI-GJ-VAS", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Rajesh Kumar",  auditorId:"EMP-004", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"In Progress",   startDate:"27 Jul 2024", dueDate:"31 Jul 2024", progress:20, ncr:0, photos:4  },
  { id:"AU-2024-142", bank:"SBI",            bankCode:"SBI",  branch:"SBI Indore Main",      branchCode:"SBI-MP-IND", circle:"SBI MP",           city:"Indore",    state:"Madhya Pradesh",auditor:"Sneha Patel",   auditorId:"EMP-005", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"In Progress",   startDate:"27 Jul 2024", dueDate:"01 Aug 2024", progress:10, ncr:0, photos:2  },
  { id:"AU-2024-143", bank:"UCO Bank",       bankCode:"UCO",  branch:"UCO Patna",            branchCode:"UCO-BR-PAT", circle:"UCO East Zone",    city:"Patna",     state:"Bihar",        auditor:"Arjun Yadav",   auditorId:"EMP-008", coordinator:"Sunita Verma", template:"Electrical Safety v2.1", status:"In Progress",   startDate:"23 Jul 2024", dueDate:"26 Jul 2024", progress:15, ncr:0, photos:3  },

  // ── Completed (Auditor submitted, awaiting coordinator) ───────────────────
  { id:"AU-2024-127", bank:"SBI",            bankCode:"SBI",  branch:"SBI Navrangpura",      branchCode:"SBI-GJ-NAV", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Arjun Yadav",   auditorId:"EMP-008", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"Completed",     startDate:"22 Jul 2024", dueDate:"27 Jul 2024", submittedDate:"27 Jul 2024", score:81, progress:100, ncr:2, photos:22 },
  { id:"AU-2024-128", bank:"UCO Bank",       bankCode:"UCO",  branch:"UCO Kolkata HO",       branchCode:"UCO-WB-KOL", circle:"UCO East Zone",    city:"Kolkata",   state:"West Bengal",  auditor:"Divya Mehta",   auditorId:"EMP-007", coordinator:"Sunita Verma", template:"Electrical Safety v2.1", status:"Completed",     startDate:"22 Jul 2024", dueDate:"27 Jul 2024", submittedDate:"27 Jul 2024", score:95, progress:100, ncr:0, photos:30 },
  { id:"AU-2024-129", bank:"Bank of Baroda", bankCode:"BOB",  branch:"BOB Ahmedabad Main",   branchCode:"BOB-GJ-AHM", circle:"BOB Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Vikas Tiwari",  auditorId:"EMP-006", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"Completed",     startDate:"21 Jul 2024", dueDate:"26 Jul 2024", submittedDate:"26 Jul 2024", score:78, progress:100, ncr:3, photos:25 },
  { id:"AU-2024-144", bank:"PNB",            bankCode:"PNB",  branch:"PNB Jaipur Main",      branchCode:"PNB-RJ-JAI", circle:"PNB Rajasthan",    city:"Jaipur",    state:"Rajasthan",    auditor:"Deepak Nair",   auditorId:"EMP-012", coordinator:"Sunita Verma", template:"Electrical Safety v2.0", status:"Completed",     startDate:"24 Jul 2024", dueDate:"28 Jul 2024", submittedDate:"27 Jul 2024", score:88, progress:100, ncr:1, photos:18 },
  { id:"AU-2024-145", bank:"Canara Bank",    bankCode:"CAN",  branch:"Canara Pune Main",     branchCode:"CAN-MH-PUN", circle:"Canara Maharashtra",city:"Pune",     state:"Maharashtra",  auditor:"Deepak Nair",   auditorId:"EMP-012", coordinator:"Amit Singh",   template:"Electrical Safety v2.0", status:"Completed",     startDate:"25 Jul 2024", dueDate:"29 Jul 2024", submittedDate:"27 Jul 2024", score:72, progress:100, ncr:4, photos:16 },

  // ── Pending Review (Coordinator reviewing) ────────────────────────────────
  { id:"AU-2024-123", bank:"SBI",            bankCode:"SBI",  branch:"SBI MP Nagar",         branchCode:"SBI-MP-MPN", circle:"SBI MP",           city:"Bhopal",    state:"Madhya Pradesh",auditor:"Divya Mehta",   auditorId:"EMP-007", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"Pending Review", startDate:"20 Jul 2024", dueDate:"25 Jul 2024", submittedDate:"24 Jul 2024", reviewedDate:"25 Jul 2024", score:88, progress:100, ncr:1, photos:24 },
  { id:"AU-2024-124", bank:"SBI",            bankCode:"SBI",  branch:"SBI CG Road",          branchCode:"SBI-GJ-CGR", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Sneha Patel",   auditorId:"EMP-005", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"Pending Review", startDate:"21 Jul 2024", dueDate:"25 Jul 2024", submittedDate:"25 Jul 2024", reviewedDate:"26 Jul 2024", score:92, progress:100, ncr:0, photos:28 },
  { id:"AU-2024-146", bank:"Bank of Baroda", bankCode:"BOB",  branch:"BOB Surat Main",       branchCode:"BOB-GJ-SUR", circle:"BOB Gujarat",      city:"Surat",     state:"Gujarat",      auditor:"Rajesh Kumar",  auditorId:"EMP-004", coordinator:"Sunita Verma", template:"Electrical Safety v2.1", status:"Pending Review", startDate:"22 Jul 2024", dueDate:"26 Jul 2024", submittedDate:"26 Jul 2024", reviewedDate:"27 Jul 2024", score:84, progress:100, ncr:2, photos:22 },
  { id:"AU-2024-147", bank:"UCO Bank",       bankCode:"UCO",  branch:"UCO Delhi Main",       branchCode:"UCO-DL-DEL", circle:"UCO North Zone",   city:"Delhi",     state:"Delhi",        auditor:"Arjun Yadav",   auditorId:"EMP-008", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"Pending Review", startDate:"23 Jul 2024", dueDate:"27 Jul 2024", submittedDate:"27 Jul 2024", reviewedDate:"27 Jul 2024", score:76, progress:100, ncr:3, photos:20 },

  // ── Approved (Admin approved, not yet delivered) ──────────────────────────
  { id:"AU-2024-119", bank:"SBI",            bankCode:"SBI",  branch:"SBI Navrangpura",      branchCode:"SBI-GJ-NAV", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Rajesh Kumar",  auditorId:"EMP-004", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"Approved",       startDate:"16 Jul 2024", dueDate:"21 Jul 2024", submittedDate:"20 Jul 2024", reviewedDate:"22 Jul 2024", approvedDate:"23 Jul 2024", score:78, progress:100, ncr:3, photos:19 },
  { id:"AU-2024-120", bank:"SBI",            bankCode:"SBI",  branch:"SBI Bhopal Main",      branchCode:"SBI-MP-BHO", circle:"SBI MP",           city:"Bhopal",    state:"Madhya Pradesh",auditor:"Vikas Tiwari",  auditorId:"EMP-006", coordinator:"Sunita Verma", template:"Electrical Safety v2.1", status:"Approved",       startDate:"17 Jul 2024", dueDate:"22 Jul 2024", submittedDate:"21 Jul 2024", reviewedDate:"23 Jul 2024", approvedDate:"24 Jul 2024", score:85, progress:100, ncr:2, photos:26, remarks:"Good compliance, minor issues noted" },
  { id:"AU-2024-121", bank:"PNB",            bankCode:"PNB",  branch:"PNB Ahmedabad",        branchCode:"PNB-GJ-AHM", circle:"PNB Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Arjun Yadav",   auditorId:"EMP-008", coordinator:"Amit Singh",   template:"Electrical Safety v2.0", status:"Approved",       startDate:"18 Jul 2024", dueDate:"23 Jul 2024", submittedDate:"22 Jul 2024", reviewedDate:"24 Jul 2024", approvedDate:"25 Jul 2024", score:91, progress:100, ncr:0, photos:32 },
  { id:"AU-2024-148", bank:"Canara Bank",    bankCode:"CAN",  branch:"Canara Mumbai HO",     branchCode:"CAN-MH-MUM", circle:"Canara Maharashtra",city:"Mumbai",   state:"Maharashtra",  auditor:"Deepak Nair",   auditorId:"EMP-012", coordinator:"Amit Singh",   template:"Electrical Safety v2.1", status:"Approved",       startDate:"19 Jul 2024", dueDate:"24 Jul 2024", submittedDate:"23 Jul 2024", reviewedDate:"25 Jul 2024", approvedDate:"26 Jul 2024", score:89, progress:100, ncr:1, photos:28 },

  // ── Delivered ─────────────────────────────────────────────────────────────
  { id:"AU-2024-108", bank:"SBI",            bankCode:"SBI",  branch:"SBI Vastrapur",        branchCode:"SBI-GJ-VAS", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Rajesh Kumar",  auditorId:"EMP-004", coordinator:"Amit Singh",   template:"Electrical Safety v2.0", status:"Delivered",      startDate:"09 Jul 2024", dueDate:"14 Jul 2024", submittedDate:"13 Jul 2024", reviewedDate:"15 Jul 2024", approvedDate:"16 Jul 2024", deliveredDate:"17 Jul 2024", score:81, progress:100, ncr:2, photos:21 },
  { id:"AU-2024-109", bank:"SBI",            bankCode:"SBI",  branch:"SBI Maninagar",        branchCode:"SBI-GJ-MAN", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Rajesh Kumar",  auditorId:"EMP-004", coordinator:"Amit Singh",   template:"Electrical Safety v2.0", status:"Delivered",      startDate:"10 Jul 2024", dueDate:"15 Jul 2024", submittedDate:"14 Jul 2024", reviewedDate:"16 Jul 2024", approvedDate:"17 Jul 2024", deliveredDate:"18 Jul 2024", score:87, progress:100, ncr:1, photos:24 },
  { id:"AU-2024-110", bank:"Bank of Baroda", bankCode:"BOB",  branch:"BOB Ankleshwar",       branchCode:"BOB-GJ-ANK", circle:"BOB Gujarat",      city:"Ankleshwar",state:"Gujarat",      auditor:"Vikas Tiwari",  auditorId:"EMP-006", coordinator:"Sunita Verma", template:"Electrical Safety v2.0", status:"Delivered",      startDate:"11 Jul 2024", dueDate:"16 Jul 2024", submittedDate:"15 Jul 2024", reviewedDate:"17 Jul 2024", approvedDate:"18 Jul 2024", deliveredDate:"19 Jul 2024", score:73, progress:100, ncr:4, photos:18 },
  { id:"AU-2024-111", bank:"UCO Bank",       bankCode:"UCO",  branch:"UCO Kolkata South",    branchCode:"UCO-WB-KOS", circle:"UCO East Zone",    city:"Kolkata",   state:"West Bengal",  auditor:"Divya Mehta",   auditorId:"EMP-007", coordinator:"Sunita Verma", template:"Electrical Safety v2.0", status:"Delivered",      startDate:"12 Jul 2024", dueDate:"17 Jul 2024", submittedDate:"16 Jul 2024", reviewedDate:"18 Jul 2024", approvedDate:"19 Jul 2024", deliveredDate:"20 Jul 2024", score:94, progress:100, ncr:0, photos:35 },
  { id:"AU-2024-112", bank:"SBI",            bankCode:"SBI",  branch:"SBI Satellite",        branchCode:"SBI-GJ-SAT", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Sneha Patel",   auditorId:"EMP-005", coordinator:"Amit Singh",   template:"Electrical Safety v2.0", status:"Delivered",      startDate:"13 Jul 2024", dueDate:"18 Jul 2024", submittedDate:"17 Jul 2024", reviewedDate:"19 Jul 2024", approvedDate:"20 Jul 2024", deliveredDate:"21 Jul 2024", score:88, progress:100, ncr:1, photos:22 },
  { id:"AU-2024-113", bank:"PNB",            bankCode:"PNB",  branch:"PNB Jodhpur",          branchCode:"PNB-RJ-JOD", circle:"PNB Rajasthan",    city:"Jodhpur",   state:"Rajasthan",    auditor:"Deepak Nair",   auditorId:"EMP-012", coordinator:"Sunita Verma", template:"Electrical Safety v2.0", status:"Delivered",      startDate:"14 Jul 2024", dueDate:"19 Jul 2024", submittedDate:"18 Jul 2024", reviewedDate:"20 Jul 2024", approvedDate:"21 Jul 2024", deliveredDate:"22 Jul 2024", score:79, progress:100, ncr:2, photos:17 },
  { id:"AU-2024-114", bank:"SBI",            bankCode:"SBI",  branch:"SBI Bodakdev",         branchCode:"SBI-GJ-BOD", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Rajesh Kumar",  auditorId:"EMP-004", coordinator:"Amit Singh",   template:"Electrical Safety v2.0", status:"Delivered",      startDate:"15 Jul 2024", dueDate:"20 Jul 2024", submittedDate:"19 Jul 2024", reviewedDate:"21 Jul 2024", approvedDate:"22 Jul 2024", deliveredDate:"23 Jul 2024", score:95, progress:100, ncr:0, photos:30 },
  { id:"AU-2024-115", bank:"SBI",            bankCode:"SBI",  branch:"SBI CG Road",          branchCode:"SBI-GJ-CGR", circle:"SBI Gujarat",      city:"Ahmedabad", state:"Gujarat",      auditor:"Sneha Patel",   auditorId:"EMP-005", coordinator:"Amit Singh",   template:"Electrical Safety v2.0", status:"Delivered",      startDate:"16 Jul 2024", dueDate:"21 Jul 2024", submittedDate:"20 Jul 2024", reviewedDate:"22 Jul 2024", approvedDate:"23 Jul 2024", deliveredDate:"24 Jul 2024", score:82, progress:100, ncr:2, photos:20 },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
export const AUDIT_BANKS    = ["All Banks", "SBI", "Bank of Baroda", "UCO Bank", "PNB", "Canara Bank"];
export const AUDIT_STATES   = ["All States", "Gujarat", "Madhya Pradesh", "West Bengal", "Rajasthan", "Maharashtra", "Bihar", "Delhi"];
export const AUDIT_AUDITORS = ["All Auditors", "Rajesh Kumar", "Sneha Patel", "Vikas Tiwari", "Divya Mehta", "Arjun Yadav", "Deepak Nair"];

export const STATUS_STYLE: Record<AuditStatus, { color: string; bg: string; icon: string }> = {
  "In Progress":   { color:"#2563eb", bg:"#dbeafe",  icon:"ri-loader-4-line"        },
  "Completed":     { color:"#0891b2", bg:"#cffafe",  icon:"ri-check-line"           },
  "Pending Review":{ color:"#ca8a04", bg:"#fef9c3",  icon:"ri-time-line"            },
  "Approved":      { color:"#16a34a", bg:"#dcfce7",  icon:"ri-checkbox-circle-line" },
  "Delivered":     { color:"#059669", bg:"#d1fae5",  icon:"ri-send-plane-line"      },
};

export const scoreColor = (s: number) => s >= 90 ? "#16a34a" : s >= 75 ? "#ca8a04" : "#dc2626";
export const scoreBg    = (s: number) => s >= 90 ? "#dcfce7" : s >= 75 ? "#fef9c3" : "#fee2e2";
