import React from "react";
import Link from "next/link";
import { FEE_DEFAULTERS } from "@/lib/constants/dashboard-data";

const TIER_CLASS: Record<string, string> = { red: "overdue-red", orange: "overdue-orange" };

export default function FeeDefaulters() {
  return (
    <div className="card custom-card h-100 mb-0">
      <div className="card-header zf-widget-header">
        <h3 className="zf-widget-title">Top Fee Defaulters</h3>
        <Link href="#" className="zf-view-all">View All <i className="ri-arrow-right-s-line" /></Link>
      </div>
      <div className="card-body zf-widget-body">
        {FEE_DEFAULTERS.map((d) => (
          <div key={d.rank} className="zf-def-item">
            <span className="zf-def-rank">{d.rank}</span>
            <span className="zf-def-name">{d.name}</span>
            <span className="zf-def-amount">{d.amount}</span>
            <span className={`zf-overdue-badge ${TIER_CLASS[d.tier]}`}>{d.overdue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
