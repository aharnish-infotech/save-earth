// Navigation configuration for ZeroForm Campus
// All nav items are config-driven — never hardcoded in components

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

export interface RailItem {
  id: string;
  icon: string;
  label: string;
  sections: NavSection[];
}

export const RAIL_ITEMS: RailItem[] = [
  {
    id: "dashboard",
    icon: "ri-home-5-line",
    label: "Dashboard",
    sections: [
      {
        section: "DASHBOARDS",
        items: [
          { label: "Admin Dashboard",      href: "/dashboard",                    icon: "ri-dashboard-line"         },
          { label: "Principal Dashboard",  href: "/dashboard/principal",          icon: "ri-user-star-line"         },
          { label: "Counselor Dashboard",  href: "/dashboard/counselor",          icon: "ri-customer-service-2-line"},
          { label: "Student Dashboard",    href: "/dashboard/student",            icon: "ri-graduation-cap-line"    },
        ],
      },
    ],
  },
  {
    id: "admission-crm",
    icon: "ri-group-line",
    label: "Admission CRM",
    sections: [
      {
        section: "ADMISSION CRM",
        items: [
          { label: "Enquiries", href: "/admission-crm/enquiries", icon: "ri-questionnaire-line" },
          { label: "Leads Pipeline", href: "/admission-crm/leads", icon: "ri-filter-3-line" },
          { label: "Counseling", href: "/admission-crm/counseling", icon: "ri-chat-voice-line" },
          { label: "Follow-ups", href: "/admission-crm/followups", icon: "ri-calendar-check-line" },
          { label: "Lost / Inactive Leads", href: "/admission-crm/lost-leads", icon: "ri-user-unfollow-line" },
        ],
      },
    ],
  },
  {
    id: "dhe-admissions",
    icon: "ri-government-line",
    label: "DHE / Govt Admissions",
    sections: [
      {
        section: "DHE / GOVT ADMISSIONS",
        items: [
          { label: "DHE Registration", href: "/dhe/registration", icon: "ri-file-list-3-line" },
          { label: "Choice Filling", href: "/dhe/choice-filling", icon: "ri-checkbox-multiple-line" },
          { label: "Allotment Rounds", href: "/dhe/allotment-rounds", icon: "ri-refresh-line" },
          { label: "Allotment Import", href: "/dhe/allotment-import", icon: "ri-download-cloud-line" },
          { label: "Reporting Status", href: "/dhe/reporting-status", icon: "ri-bar-chart-grouped-line" },
        ],
      },
    ],
  },
  {
    id: "students",
    icon: "ri-graduation-cap-line",
    label: "Students",
    sections: [
      {
        section: "STUDENTS",
        items: [
          { label: "All Students", href: "/students", icon: "ri-team-line" },
          { label: "Student Profiles", href: "/students/profiles", icon: "ri-user-3-line" },
          { label: "Documents", href: "/students/documents", icon: "ri-folder-open-line" },
          { label: "Admission Confirmed", href: "/students/confirmed", icon: "ri-checkbox-circle-line" },
          { label: "Transfer / Migration", href: "/students/transfer", icon: "ri-exchange-line" },
        ],
      },
    ],
  },
  {
    id: "fees",
    icon: "ri-money-rupee-circle-line",
    label: "Fees & Finance",
    sections: [
      {
        section: "FEES & FINANCE",
        items: [
          { label: "Fee Dashboard", href: "/fees", icon: "ri-pie-chart-2-line" },
          { label: "Fee Collection", href: "/fees/collection", icon: "ri-bank-card-line" },
          { label: "Installments", href: "/fees/installments", icon: "ri-calendar-line" },
          { label: "Receipts", href: "/fees/receipts", icon: "ri-receipt-line" },
          { label: "Refunds", href: "/fees/refunds", icon: "ri-refund-2-line" },
          { label: "Outstanding", href: "/fees/outstanding", icon: "ri-error-warning-line" },
        ],
      },
    ],
  },
  {
    id: "scholarships",
    icon: "ri-gift-line",
    label: "Scholarships",
    sections: [
      {
        section: "SCHOLARSHIPS",
        items: [
          { label: "Scholarship Schemes", href: "/scholarships/schemes", icon: "ri-award-line" },
          { label: "Eligible Students", href: "/scholarships/eligible", icon: "ri-user-star-line" },
        ],
      },
    ],
  },
  {
    id: "reports",
    icon: "ri-bar-chart-2-line",
    label: "Reports",
    sections: [
      {
        section: "REPORTS",
        items: [
          { label: "Admission Reports", href: "/reports/admission", icon: "ri-file-chart-line" },
          { label: "Fee Reports", href: "/reports/fees", icon: "ri-file-list-2-line" },
          { label: "Student Reports", href: "/reports/students", icon: "ri-file-user-line" },
          { label: "DHE Reports", href: "/reports/dhe", icon: "ri-government-line" },
        ],
      },
    ],
  },
  {
    id: "settings",
    icon: "ri-settings-3-line",
    label: "Settings",
    sections: [
      {
        section: "SETTINGS",
        items: [
          { label: "Masters & Configuration", href: "/settings", icon: "ri-settings-3-line" },
        ],
      },
    ],
  },
];
