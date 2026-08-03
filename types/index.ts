// Shared type definitions for ORBIT Compliance ERP — Save Earth Energy
// Domain: Bank Branch Audit Inspection & Compliance Management

export type UserRole =
  | "Super Admin"
  | "Admin"
  | "Coordinator"
  | "Field Auditor"
  | "HR Manager"
  | "Developer"
  | "Accountant"
  | "Viewer";

export type AuditStatus =
  | "Assigned"
  | "In Progress"
  | "Submitted"
  | "In Review"
  | "Approved"
  | "Delivered"
  | "Overdue";

export type BranchType = "Metro" | "Urban" | "Semi-Urban" | "Rural";

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type QuestionType =
  | "YES_NO_NA"
  | "YES_NO"
  | "RATING_1_5"
  | "NUMERIC"
  | "TEXT"
  | "MULTI_CHOICE";

export type OverdueTier = "red" | "orange" | "yellow";

export type SyncStatus = "Synced" | "Pending" | "Failed";
