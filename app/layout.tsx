import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORBIT Inspectflow ERP",
  description: "Enterprise ERP for Save Earth Energy — Bank Branch Inspection Management, Audit Workflows & Compliance Reporting",
  icons: {
    icon: "/media/orbit-inspectflow-app.png",
    shortcut: "/media/orbit-inspectflow-app.png",
    apple: "/media/orbit-inspectflow-app.png",
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
