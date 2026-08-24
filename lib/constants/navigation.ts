// Navigation configuration for ORBIT Compliance ERP — Save Earth Energy
// Menu structure mirrors admin-ui.html exactly.

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
  href?: string;          // if set, renders as a direct link with no children
  sections: NavSection[];
}

export const RAIL_ITEMS: RailItem[] = [
  {
    id: "dashboard",
    icon: "ri-dashboard-line",
    label: "Dashboard",
    href: "/dashboard",
    sections: [],
  },
  {
    id: "audits",
    icon: "ri-file-list-3-line",
    label: "All Audits",
    href: "/audits",
    sections: [],
  },
  {
    id: "banking",
    icon: "ri-building-2-line",
    label: "Banking Structure",
    sections: [{
      section: "BANKING STRUCTURE",
      items: [
        { label: "Branches",         href: "/branches",      icon: "ri-building-2-line"    },
        { label: "Banks",            href: "/banks",         icon: "ri-bank-line"          },
        { label: "Org Units",        href: "/organisation",        icon: "ri-organization-chart" },
        { label: "Branch Types",     href: "/branch-types",  icon: "ri-git-branch-line"    },
      ],
    }],
  },
  {
    id: "questions",
    icon: "ri-questionnaire-line",
    label: "Audit Questions",
    sections: [{
      section: "AUDIT QUESTIONS",
      items: [
        { label: "Question Library", href: "/questions",   icon: "ri-questionnaire-line"  },
        { label: "Audit Form",       href: "/audit-form", icon: "ri-file-text-line"      },
        { label: "Template Builder", href: "/templates",  icon: "ri-layout-3-line"       },
        { label: "Bank-Zone Mapping",href: "/mappings",   icon: "ri-links-line"          },
      ],
    }],
  },
  {
    id: "administration",
    icon: "ri-team-line",
    label: "Administration",
    sections: [{
      section: "ADMINISTRATION",
      items: [
        { label: "Users & Roles",       href: "/users",        icon: "ri-team-line"           },
        { label: "Roles & Permissions", href: "/permissions",  icon: "ri-shield-keyhole-line" },
        { label: "Audit Trail",         href: "/audit-trail",  icon: "ri-history-line"        },
        { label: "Notifications",       href: "/notifications",icon: "ri-notification-3-line" },
      ],
    }],
  },
  {
    id: "settings",
    icon: "ri-settings-3-line",
    label: "Settings",
    sections: [{
      section: "SETTINGS",
      items: [
        { label: "Settings", href: "/settings", icon: "ri-settings-3-line" },
      ],
    }],
  },
];
