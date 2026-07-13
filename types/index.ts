// Shared type definitions for ZeroForm Campus
// Expand as modules are built out

export type AcademicSession = {
  id: string;
  label: string; // e.g. "2025-26"
  isActive: boolean;
};

export type CourseType = "UG" | "PG" | "Diploma" | "Certificate";

export type AcademicPattern = "Semester" | "Annual";

export type AdmissionType = "Regular" | "Lateral Entry" | "Management" | "DHE";

export type StudentCategory = "General" | "OBC" | "SC" | "ST" | "EWS";

export type UserRole =
  | "Super Admin"
  | "Director"
  | "Principal"
  | "Admission Head"
  | "Counselor"
  | "DHE Operator"
  | "Accountant"
  | "Scholarship Officer"
  | "Viewer";

export type OverdueTier = "red" | "orange" | "yellow";
