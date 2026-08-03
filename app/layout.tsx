import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ORBIT Compliance ERP",
    template: "%s | ORBIT Compliance",
  },
  description: "Enterprise ERP for Save Earth Energy — Bank Branch Inspection Management, Audit Workflows & Compliance Reporting",
  icons: {
    icon: "/media/orbit-compliance-app.png",
    shortcut: "/media/orbit-compliance-app.png",
    apple: "/media/orbit-compliance-app.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-nav-layout="vertical"
      data-theme-mode="light"
      data-header-styles="transparent"
      data-menu-styles="transparent"
      data-page-style="flat"
      data-width="fullwidth"
      data-menu-position="fixed"
      data-header-position="fixed"
    >
      <body className="font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
