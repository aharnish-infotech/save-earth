import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZeroForm Campus",
  description: "College Admission, Student Information & Fee Management System",
  icons: {
    icon: "/media/ZeroFormCampus.png",
    shortcut: "/media/ZeroFormCampus.png",
    apple: "/media/ZeroFormCampus.png",
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
