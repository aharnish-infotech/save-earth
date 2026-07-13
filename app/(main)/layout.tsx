"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <Header />
      <Sidebar />
      <div className="main-content app-content">
        <div className="container-fluid">
          {children}
        </div>
      </div>
    </div>
  );
}
