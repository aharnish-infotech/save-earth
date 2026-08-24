"use client";

/**
 * ORBIT Compliance ERP — Login Page
 * AUTH HOOK: Replace the MOCK block in handleSubmit with your real API call.
 */

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(true);
  const [errors,       setErrors]       = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading,      setLoading]      = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email)                            e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = "Invalid email format.";
    if (!password)                         e.password = "Password is required.";
    else if (password.length < 6)          e.password = "Minimum 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── MOCK ── replace with real API call ────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      router.replace("/dashboard");
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.6; }
          100% { transform: scale(1.6);  opacity: 0; }
        }
        .login-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #166534 0%, #15803d 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22,163,74,0.35) !important;
        }
        .login-input:focus {
          border-color: #16a34a !important;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdf4 0%, #fff 50%, #f0fdf4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        paddingBottom: "220px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(22,163,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}/>

        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: "-8%", left: "-6%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", bottom: "-10%", right: "-8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(21,128,61,0.07) 0%, transparent 70%)", pointerEvents: "none" }}/>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: 420,
          animation: "fadeUp 0.5s ease both",
          position: "relative", zIndex: 1,
        }}>

          {/* Form card */}
          <div style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 8px 48px rgba(22,163,74,0.10), 0 2px 12px rgba(0,0,0,0.06)",
            border: "1px solid rgba(22,163,74,0.12)",
            padding: "2rem 2rem 1.75rem",
          }}>

            {/* Header */}
            <div style={{ marginBottom: "1.5rem" }}>
              {/* Save Earth logo inside card — full width, aspect ratio preserved */}
              <div style={{ marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/savearth_logo.png"
                  alt="Save Earth Energy"
                  style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
                />
              </div>
              <h4 style={{ fontWeight: 800, fontSize: 22, color: "#111827", margin: "0 0 4px" }}>
                Welcome back 👋
              </h4>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                Sign in to <strong style={{ color: "#15803d" }}>ORBIT Compliance ERP</strong>
              </p>
            </div>

            {errors.form && (
              <div style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 8, padding: "8px 14px", fontSize: 13, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                <i className="ri-error-warning-line" style={{ fontSize: 15, flexShrink: 0 }}/>
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="login-email" style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <i className="ri-mail-line" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: errors.email ? "#dc2626" : "#9ca3af" }}/>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="admin@saveearth.in"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: undefined })); }}
                    autoComplete="email"
                    className="login-input"
                    style={{
                      width: "100%", padding: "10px 14px 10px 36px", fontSize: 13, borderRadius: 10,
                      border: errors.email ? "1.5px solid #dc2626" : "1.5px solid #e5e7eb",
                      outline: "none", color: "#1f2937", background: "#fafafa",
                      boxSizing: "border-box", transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                  />
                </div>
                {errors.email && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><i className="ri-information-line"/>  {errors.email}</div>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "0.75rem" }}>
                <label htmlFor="login-password" style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <i className="ri-lock-line" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: errors.password ? "#dc2626" : "#9ca3af" }}/>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: undefined })); }}
                    autoComplete="current-password"
                    className="login-input"
                    style={{
                      width: "100%", padding: "10px 40px 10px 36px", fontSize: 13, borderRadius: 10,
                      border: errors.password ? "1.5px solid #dc2626" : "1.5px solid #e5e7eb",
                      outline: "none", color: "#1f2937", background: "#fafafa",
                      boxSizing: "border-box", transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                    <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"} style={{ fontSize: 16 }} />
                  </button>
                </div>
                {errors.password && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><i className="ri-information-line"/> {errors.password}</div>}
              </div>

              {/* Remember + Forgot */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", cursor: "pointer" }}>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ accentColor: "#16a34a", width: 14, height: 14 }} />
                  Remember me
                </label>
                <Link href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, fontWeight: 600, color: "#16a34a", textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="login-submit"
                style={{
                  width: "100%", padding: "12px", borderRadius: 10, border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  background: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
                  color: "#fff", fontWeight: 700, fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: loading ? 0.8 : 1,
                  transition: "all 0.2s",
                  boxShadow: "0 4px 14px rgba(22,163,74,0.25)",
                }}>
                {loading
                  ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Signing in…</>
                  : <><i className="ri-login-box-line" style={{ fontSize: 16 }} /> Sign In</>
                }
              </button>

            </form>
          </div>

          {/* ORBIT logo below card */}
          <div style={{ textAlign: "center", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/orbit-compliance-full.png"
              alt="ORBIT Compliance ERP"
              style={{ height: 38, maxWidth: 200, objectFit: "contain", imageRendering: "crisp-edges" }}
            />
          </div>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: "0.5rem" }}>
            © {new Date().getFullYear()} ORBIT Compliance ERP · Save Earth Energy · All rights reserved
          </p>

        </div>

        {/* ── Energy Scene ── */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:210, pointerEvents:"none" }}>
          <svg viewBox="0 0 1400 210" preserveAspectRatio="xMidYMax slice"
            style={{ width:"100%", height:"100%" }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sc-sky" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#c8e8f8"/>
                <stop offset="100%" stopColor="#e8f5fd"/>
              </linearGradient>
              <linearGradient id="sc-hill1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#5cb85c"/>
                <stop offset="100%" stopColor="#4caf50"/>
              </linearGradient>
              <linearGradient id="sc-hill2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#66bb6a"/>
                <stop offset="100%" stopColor="#43a047"/>
              </linearGradient>
              <linearGradient id="sc-sun" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffd54f"/>
                <stop offset="100%" stopColor="#ffb300"/>
              </linearGradient>
              <filter id="sc-glow">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              {/* electricity wire paths */}
              <path id="sc-w1" d="M 390 148 L 580 145"/>
              <path id="sc-w2" d="M 580 145 L 800 140"/>
              <path id="sc-w3" d="M 800 140 L 980 138"/>
              <path id="sc-w4" d="M 980 138 L 1150 136"/>
              <path id="sc-w5" d="M 1150 136 L 1310 134"/>
            </defs>

            {/* ── SKY ── */}
            <rect x="0" y="0" width="1400" height="210" fill="url(#sc-sky)"/>

            {/* ── SUN ── top right */}
            <circle cx="1310" cy="42" r="38" fill="url(#sc-sun)" opacity="0.95"/>
            <circle cx="1310" cy="42" r="50" fill="#ffd54f" opacity="0.18"/>
            <circle cx="1310" cy="42" r="62" fill="#ffecb3" opacity="0.10"/>

            {/* ── CLOUDS ── */}
            {/* Cloud 1 */}
            <g opacity="0.92">
              <ellipse cx="160" cy="35" rx="52" ry="22" fill="white"/>
              <ellipse cx="120" cy="42" rx="36" ry="18" fill="white"/>
              <ellipse cx="200" cy="42" rx="32" ry="16" fill="white"/>
              <ellipse cx="155" cy="48" rx="55" ry="14" fill="white"/>
            </g>
            {/* Cloud 2 smaller */}
            <g opacity="0.80">
              <ellipse cx="480" cy="25" rx="38" ry="16" fill="white"/>
              <ellipse cx="452" cy="30" rx="26" ry="13" fill="white"/>
              <ellipse cx="508" cy="30" rx="24" ry="12" fill="white"/>
              <ellipse cx="480" cy="35" rx="40" ry="10" fill="white"/>
            </g>
            {/* Cloud 3 tiny */}
            <g opacity="0.70">
              <ellipse cx="850" cy="20" rx="30" ry="12" fill="white"/>
              <ellipse cx="830" cy="25" rx="20" ry="10" fill="white"/>
              <ellipse cx="870" cy="25" rx="18" ry="9"  fill="white"/>
              <ellipse cx="850" cy="30" rx="32" ry="8"  fill="white"/>
            </g>

            {/* ── BACK HILLS (darker, further) ── */}
            <path d="M 0 145 Q 200 110 400 135 Q 600 155 800 125 Q 1000 100 1200 130 Q 1300 142 1400 135 L 1400 210 L 0 210 Z"
              fill="#81c784" opacity="0.5"/>

            {/* ── MAIN GROUND HILL ── */}
            <path d="M 0 165 Q 180 148 360 158 Q 540 168 700 155 Q 860 142 1000 158 Q 1150 170 1400 160 L 1400 210 L 0 210 Z"
              fill="url(#sc-hill1)"/>
            {/* Ground top highlight */}
            <path d="M 0 165 Q 180 148 360 158 Q 540 168 700 155 Q 860 142 1000 158 Q 1150 170 1400 160"
              fill="none" stroke="#81c784" strokeWidth="2.5"/>

            {/* ── SOLAR PANELS — left cluster ── */}
            {[30,85,140,195,250,305].map((x) => (
              <g key={x}>
                {/* Stand */}
                <line x1={x+14} y1="162" x2={x+10} y2="132" stroke="#78909c" strokeWidth="2"/>
                <line x1={x+28} y1="162" x2={x+32} y2="132" stroke="#78909c" strokeWidth="2"/>
                {/* Panel */}
                <rect x={x} y="112" width="44" height="24" rx="2.5"
                  transform={`rotate(-16 ${x+22} 124)`} fill="#1565c0"/>
                {/* Grid */}
                <line x1={x+15} y1="115" x2={x+13} y2="133" stroke="#42a5f5" strokeWidth="0.7" opacity="0.55"
                  transform={`rotate(-16 ${x+22} 124)`}/>
                <line x1={x+22} y1="114" x2={x+20} y2="134" stroke="#42a5f5" strokeWidth="0.7" opacity="0.55"
                  transform={`rotate(-16 ${x+22} 124)`}/>
                <line x1={x+29} y1="114" x2={x+27} y2="134" stroke="#42a5f5" strokeWidth="0.7" opacity="0.55"
                  transform={`rotate(-16 ${x+22} 124)`}/>
                <line x1={x+3}  y1="120" x2={x+41} y2="118" stroke="#42a5f5" strokeWidth="0.6" opacity="0.4"
                  transform={`rotate(-16 ${x+22} 124)`}/>
                {/* Shine */}
                <rect x={x+2} y="113" width="40" height="6" rx="1" fill="white" opacity="0.1"
                  transform={`rotate(-16 ${x+22} 124)`}/>
              </g>
            ))}

            {/* ── WIND TURBINE LARGE — x=530, hub y=30 ── */}
            <line x1="530" y1="30" x2="530" y2="162" stroke="#90a4ae" strokeWidth="4"/>
            <circle cx="530" cy="30" r="7" fill="#546e7a"/>
            <circle cx="530" cy="30" r="4" fill="#b0bec5"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 530 30" to="360 530 30" dur="3.2s" repeatCount="indefinite"/>
              <path d="M 530 30 L 526 5  Q 525 -2 530 4  Z" fill="#1976d2"/>
              <path d="M 530 30 L 526 5  Q 525 -2 530 4  Z" fill="#1976d2" transform="rotate(120 530 30)"/>
              <path d="M 530 30 L 526 5  Q 525 -2 530 4  Z" fill="#1976d2" transform="rotate(240 530 30)"/>
              <ellipse cx="530" cy="10" rx="3.5" ry="22" fill="#1e88e5" opacity="0.9"/>
              <ellipse cx="530" cy="10" rx="3.5" ry="22" fill="#1e88e5" opacity="0.9" transform="rotate(120 530 30)"/>
              <ellipse cx="530" cy="10" rx="3.5" ry="22" fill="#1e88e5" opacity="0.9" transform="rotate(240 530 30)"/>
            </g>

            {/* ── WIND TURBINE MEDIUM — x=660, hub y=48 ── */}
            <line x1="660" y1="48" x2="660" y2="160" stroke="#90a4ae" strokeWidth="3.5"/>
            <circle cx="660" cy="48" r="6" fill="#546e7a"/>
            <circle cx="660" cy="48" r="3.5" fill="#b0bec5"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 660 48" to="360 660 48" dur="4s" repeatCount="indefinite"/>
              <ellipse cx="660" cy="30" rx="3" ry="19" fill="#1e88e5" opacity="0.9"/>
              <ellipse cx="660" cy="30" rx="3" ry="19" fill="#1e88e5" opacity="0.9" transform="rotate(120 660 48)"/>
              <ellipse cx="660" cy="30" rx="3" ry="19" fill="#1e88e5" opacity="0.9" transform="rotate(240 660 48)"/>
            </g>

            {/* ── WIND TURBINE SMALL — x=760, hub y=65 ── */}
            <line x1="760" y1="65" x2="760" y2="158" stroke="#90a4ae" strokeWidth="3"/>
            <circle cx="760" cy="65" r="5" fill="#546e7a"/>
            <circle cx="760" cy="65" r="2.5" fill="#b0bec5"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 760 65" to="360 760 65" dur="2.8s" repeatCount="indefinite"/>
              <ellipse cx="760" cy="50" rx="2.5" ry="15" fill="#1e88e5" opacity="0.85"/>
              <ellipse cx="760" cy="50" rx="2.5" ry="15" fill="#1e88e5" opacity="0.85" transform="rotate(120 760 65)"/>
              <ellipse cx="760" cy="50" rx="2.5" ry="15" fill="#1e88e5" opacity="0.85" transform="rotate(240 760 65)"/>
            </g>

            {/* ── TREES ── */}
            {/* Tree 1 */}
            <g>
              <rect x="458" y="138" width="7" height="22" rx="3" fill="#795548"/>
              <ellipse cx="462" cy="128" rx="20" ry="22" fill="#388e3c"/>
              <ellipse cx="462" cy="122" rx="15" ry="17" fill="#43a047"/>
              <ellipse cx="464" cy="116" rx="10" ry="13" fill="#66bb6a"/>
            </g>
            {/* Tree 2 */}
            <g>
              <rect x="876" y="140" width="6" height="20" rx="3" fill="#795548"/>
              <ellipse cx="879" cy="130" rx="17" ry="19" fill="#2e7d32"/>
              <ellipse cx="879" cy="124" rx="13" ry="15" fill="#388e3c"/>
              <ellipse cx="881" cy="119" rx="9"  ry="11" fill="#43a047"/>
            </g>
            {/* Tree 3 small */}
            <g>
              <rect x="1010" y="145" width="5" height="16" rx="2" fill="#795548"/>
              <ellipse cx="1013" cy="136" rx="13" ry="15" fill="#388e3c"/>
              <ellipse cx="1013" cy="131" rx="10" ry="11" fill="#43a047"/>
            </g>

            {/* ── POWER POLE — x=980 ── */}
            <line x1="980" y1="72" x2="980" y2="158" stroke="#78716c" strokeWidth="4"/>
            <line x1="952" y1="72" x2="1008" y2="72" stroke="#78716c" strokeWidth="3"/>
            <line x1="980" y1="72" x2="980" y2="96"  stroke="#9e9e9e" strokeWidth="2"/>
            <line x1="966" y1="96" x2="994" y2="96"  stroke="#78716c" strokeWidth="2.5"/>
            <line x1="952" y1="72" x2="966" y2="96"  stroke="#78716c" strokeWidth="2"/>
            <line x1="1008" y1="72" x2="994" y2="96" stroke="#78716c" strokeWidth="2"/>
            <circle cx="952"  cy="72" r="4" fill="#90a4ae"/>
            <circle cx="980"  cy="72" r="4" fill="#90a4ae"/>
            <circle cx="1008" cy="72" r="4" fill="#90a4ae"/>

            {/* ── TRANSFORMER — x=1150 ── */}
            <line x1="1150" y1="75" x2="1150" y2="158" stroke="#78716c" strokeWidth="4"/>
            <rect x="1128" y="72" width="44" height="36" rx="5" fill="#37474f"/>
            <rect x="1132" y="75" width="36" height="12" rx="2.5" fill="#546e7a"/>
            <rect x="1132" y="89" width="36" height="6"  rx="1.5" fill="#455a64"/>
            <rect x="1132" y="97" width="36" height="6"  rx="1.5" fill="#455a64"/>
            <line x1="1140" y1="69" x2="1140" y2="73" stroke="#90a4ae" strokeWidth="3"/>
            <line x1="1150" y1="67" x2="1150" y2="73" stroke="#90a4ae" strokeWidth="3"/>
            <line x1="1160" y1="69" x2="1160" y2="73" stroke="#90a4ae" strokeWidth="3"/>
            <circle cx="1140" cy="69" r="3" fill="#78909c"/>
            <circle cx="1150" cy="67" r="3" fill="#78909c"/>
            <circle cx="1160" cy="69" r="3" fill="#78909c"/>

            {/* ── BUILDINGS ── right side */}
            {/* Tall B1 */}
            <rect x="1230" y="50" width="68" height="112" rx="4" fill="#b0bec5"/>
            <rect x="1230" y="50" width="68" height="10"  rx="3" fill="#90a4ae"/>
            {[0,1,2,3,4,5].map(r => [0,1,2].map(c => (
              <rect key={`b1r${r}c${c}`} x={1238+c*20} y={66+r*16} width="13" height="10" rx="2"
                fill={[1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0][r*3+c] ? "#fff9c4" : "#eceff1"} opacity="0.95"/>
            )))}
            {/* Medium B2 */}
            <rect x="1315" y="72" width="55" height="90" rx="4" fill="#cfd8dc"/>
            <rect x="1315" y="72" width="55" height="9"  rx="3" fill="#b0bec5"/>
            {[0,1,2,3,4].map(r => [0,1].map(c => (
              <rect key={`b2r${r}c${c}`} x={1323+c*24} y={87+r*16} width="15" height="10" rx="2"
                fill={[1,0,0,1,1,0,1,1,0,1][r*2+c] ? "#fff9c4" : "#eceff1"} opacity="0.9"/>
            )))}

            {/* ── WIRES solar→turbine area→pole→transformer→building ── */}
            <path d="M 370 148 L 520 144" fill="none" stroke="#546e7a" strokeWidth="1.5" opacity="0.8"/>
            <path d="M 520 144 L 750 140" fill="none" stroke="#546e7a" strokeWidth="1.5" opacity="0.8"/>
            <path d="M 750 140 L 980 138" fill="none" stroke="#546e7a" strokeWidth="1.5" opacity="0.8"/>
            <path d="M 980 138 L 1150 136" fill="none" stroke="#546e7a" strokeWidth="1.5" opacity="0.8"/>
            <path d="M 1150 136 L 1315 133" fill="none" stroke="#546e7a" strokeWidth="1.5" opacity="0.8"/>

            {/* ── ELECTRICITY DOTS ── */}
            <circle r="4" fill="#ffd54f" filter="url(#sc-glow)" opacity="0.95">
              <animateMotion dur="2.5s" repeatCount="indefinite"><mpath href="#sc-w1"/></animateMotion>
            </circle>
            <circle r="3" fill="#ffe082" opacity="0.8">
              <animateMotion dur="2.5s" begin="1.2s" repeatCount="indefinite"><mpath href="#sc-w1"/></animateMotion>
            </circle>
            <circle r="4" fill="#ffd54f" filter="url(#sc-glow)" opacity="0.95">
              <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#sc-w2"/></animateMotion>
            </circle>
            <circle r="4" fill="#ffd54f" filter="url(#sc-glow)" opacity="0.95">
              <animateMotion dur="2s" repeatCount="indefinite"><mpath href="#sc-w3"/></animateMotion>
            </circle>
            <circle r="3" fill="#ffe082" opacity="0.8">
              <animateMotion dur="2s" begin="1s" repeatCount="indefinite"><mpath href="#sc-w3"/></animateMotion>
            </circle>
            <circle r="4" fill="#ffd54f" filter="url(#sc-glow)" opacity="0.95">
              <animateMotion dur="1.8s" repeatCount="indefinite"><mpath href="#sc-w4"/></animateMotion>
            </circle>
            <circle r="4" fill="#ffd54f" filter="url(#sc-glow)" opacity="0.95">
              <animateMotion dur="2.2s" repeatCount="indefinite"><mpath href="#sc-w5"/></animateMotion>
            </circle>
            <circle r="3" fill="#ffe082" opacity="0.75">
              <animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite"><mpath href="#sc-w5"/></animateMotion>
            </circle>

          </svg>
        </div>

      </div>
    </>
  );
}
