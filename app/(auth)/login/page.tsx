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
          <svg viewBox="0 0 1400 210" preserveAspectRatio="none"
            style={{ width:"100%", height:"100%" }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sc-sky" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#c8e8f8"/>
                <stop offset="100%" stopColor="#e8f5fd"/>
              </linearGradient>
              <linearGradient id="sc-sun" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffd54f"/>
                <stop offset="100%" stopColor="#ffb300"/>
              </linearGradient>
              <linearGradient id="sc-ground" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#66bb6a"/>
                <stop offset="100%" stopColor="#43a047"/>
              </linearGradient>
            </defs>

            {/* ── SKY ── */}
            <rect x="0" y="0" width="1400" height="210" fill="url(#sc-sky)"/>

            {/* ── SUN ── */}
            <circle cx="1300" cy="38" r="34" fill="url(#sc-sun)"/>
            <circle cx="1300" cy="38" r="48" fill="#ffd54f" opacity="0.14"/>
            <circle cx="1300" cy="38" r="62" fill="#ffecb3" opacity="0.08"/>

            {/* ── CLOUDS ── */}
            <g opacity="0.93">
              <ellipse cx="155" cy="30" rx="50" ry="20" fill="white"/>
              <ellipse cx="116" cy="38" rx="34" ry="17" fill="white"/>
              <ellipse cx="194" cy="38" rx="30" ry="15" fill="white"/>
              <ellipse cx="152" cy="45" rx="52" ry="13" fill="white"/>
            </g>
            <g opacity="0.75">
              <ellipse cx="550" cy="20" rx="34" ry="14" fill="white"/>
              <ellipse cx="524" cy="26" rx="23" ry="11" fill="white"/>
              <ellipse cx="576" cy="26" rx="20" ry="10" fill="white"/>
              <ellipse cx="550" cy="31" rx="36" ry="8"  fill="white"/>
            </g>
            <g opacity="0.62">
              <ellipse cx="960" cy="16" rx="26" ry="10" fill="white"/>
              <ellipse cx="942" cy="22" rx="18" ry="8"  fill="white"/>
              <ellipse cx="978" cy="22" rx="16" ry="7"  fill="white"/>
              <ellipse cx="960" cy="27" rx="28" ry="6"  fill="white"/>
            </g>

            {/* ── FLAT GROUND ── */}
            <rect x="0" y="183" width="1400" height="27" fill="url(#sc-ground)"/>
            <line x1="0" y1="183" x2="1400" y2="183" stroke="#81c784" strokeWidth="2"/>

            {/* ── SOLAR PANELS — left cluster ── */}
            {[14,62,110,158,206,254].map((x) => (
              <g key={x}>
                <line x1={x+12} y1="183" x2={x+8}  y2="150" stroke="#78909c" strokeWidth="2"/>
                <line x1={x+30} y1="183" x2={x+34} y2="150" stroke="#78909c" strokeWidth="2"/>
                <rect x={x} y="128" width="44" height="26" rx="3"
                  transform={`rotate(-16 ${x+22} 141)`} fill="#1565c0"/>
                <line x1={x+14} y1="131" x2={x+12} y2="151" stroke="#42a5f5" strokeWidth="0.8" opacity="0.5"
                  transform={`rotate(-16 ${x+22} 141)`}/>
                <line x1={x+22} y1="130" x2={x+20} y2="152" stroke="#42a5f5" strokeWidth="0.8" opacity="0.5"
                  transform={`rotate(-16 ${x+22} 141)`}/>
                <line x1={x+30} y1="130" x2={x+28} y2="152" stroke="#42a5f5" strokeWidth="0.8" opacity="0.5"
                  transform={`rotate(-16 ${x+22} 141)`}/>
                <line x1={x+2} y1="138" x2={x+42} y2="136" stroke="#42a5f5" strokeWidth="0.6" opacity="0.35"
                  transform={`rotate(-16 ${x+22} 141)`}/>
                <rect x={x+2} y="129" width="40" height="7" rx="1" fill="white" opacity="0.1"
                  transform={`rotate(-16 ${x+22} 141)`}/>
              </g>
            ))}

            {/* ── TREE A — x=338 ── */}
            <rect x="335" y="160" width="8" height="23" rx="3" fill="#795548"/>
            <ellipse cx="339" cy="148" rx="21" ry="23" fill="#388e3c"/>
            <ellipse cx="339" cy="141" rx="16" ry="17" fill="#43a047"/>
            <ellipse cx="341" cy="134" rx="11" ry="13" fill="#66bb6a"/>

            {/* ── TURBINE 1 — x=420, hub y=18 (tallest) ── */}
            <line x1="420" y1="18" x2="420" y2="183" stroke="#b0bec5" strokeWidth="5"/>
            <circle cx="420" cy="18" r="8" fill="#546e7a"/>
            <circle cx="420" cy="18" r="4" fill="#e0e0e0"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 420 18" to="360 420 18" dur="3.8s" repeatCount="indefinite"/>
              <path d="M420,18 C416,12 413,-6 420,-10 C427,-6 424,12 420,18 Z" fill="#1565c0"/>
              <path d="M420,18 C416,12 413,-6 420,-10 C427,-6 424,12 420,18 Z" fill="#1565c0" transform="rotate(120 420 18)"/>
              <path d="M420,18 C416,12 413,-6 420,-10 C427,-6 424,12 420,18 Z" fill="#1565c0" transform="rotate(240 420 18)"/>
            </g>

            {/* ── TREE B — x=518 ── */}
            <rect x="515" y="163" width="7" height="20" rx="3" fill="#795548"/>
            <ellipse cx="519" cy="151" rx="18" ry="20" fill="#2e7d32"/>
            <ellipse cx="519" cy="145" rx="14" ry="15" fill="#388e3c"/>
            <ellipse cx="521" cy="139" rx="9"  ry="11" fill="#43a047"/>

            {/* ── TURBINE 2 — x=660, hub y=45 ── */}
            <line x1="660" y1="45" x2="660" y2="183" stroke="#b0bec5" strokeWidth="4.5"/>
            <circle cx="660" cy="45" r="7" fill="#546e7a"/>
            <circle cx="660" cy="45" r="3.5" fill="#e0e0e0"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 660 45" to="360 660 45" dur="4.5s" repeatCount="indefinite"/>
              <path d="M660,45 C657,40 654,23 660,20 C666,23 663,40 660,45 Z" fill="#1976d2"/>
              <path d="M660,45 C657,40 654,23 660,20 C666,23 663,40 660,45 Z" fill="#1976d2" transform="rotate(120 660 45)"/>
              <path d="M660,45 C657,40 654,23 660,20 C666,23 663,40 660,45 Z" fill="#1976d2" transform="rotate(240 660 45)"/>
            </g>

            {/* ── TURBINE 3 — x=850, hub y=22 ── */}
            <line x1="850" y1="22" x2="850" y2="183" stroke="#b0bec5" strokeWidth="5"/>
            <circle cx="850" cy="22" r="8" fill="#546e7a"/>
            <circle cx="850" cy="22" r="4" fill="#e0e0e0"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 850 22" to="360 850 22" dur="3.2s" repeatCount="indefinite"/>
              <path d="M850,22 C846,16 843,-2 850,-6 C857,-2 854,16 850,22 Z" fill="#1565c0"/>
              <path d="M850,22 C846,16 843,-2 850,-6 C857,-2 854,16 850,22 Z" fill="#1565c0" transform="rotate(120 850 22)"/>
              <path d="M850,22 C846,16 843,-2 850,-6 C857,-2 854,16 850,22 Z" fill="#1565c0" transform="rotate(240 850 22)"/>
            </g>

            {/* ── TREE C — x=940 ── */}
            <rect x="937" y="162" width="7" height="21" rx="3" fill="#795548"/>
            <ellipse cx="941" cy="150" rx="19" ry="21" fill="#388e3c"/>
            <ellipse cx="941" cy="143" rx="14" ry="15" fill="#43a047"/>
            <ellipse cx="943" cy="137" rx="10" ry="11" fill="#66bb6a"/>

            {/* ── TURBINE 4 — x=1065, hub y=55 ── */}
            <line x1="1065" y1="55" x2="1065" y2="183" stroke="#b0bec5" strokeWidth="4"/>
            <circle cx="1065" cy="55" r="6" fill="#546e7a"/>
            <circle cx="1065" cy="55" r="3" fill="#e0e0e0"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 1065 55" to="360 1065 55" dur="3s" repeatCount="indefinite"/>
              <path d="M1065,55 C1062,50 1059,34 1065,31 C1071,34 1068,50 1065,55 Z" fill="#1976d2"/>
              <path d="M1065,55 C1062,50 1059,34 1065,31 C1071,34 1068,50 1065,55 Z" fill="#1976d2" transform="rotate(120 1065 55)"/>
              <path d="M1065,55 C1062,50 1059,34 1065,31 C1071,34 1068,50 1065,55 Z" fill="#1976d2" transform="rotate(240 1065 55)"/>
            </g>

            {/* ── TREE D — x=1148 ── */}
            <rect x="1145" y="165" width="6" height="18" rx="2" fill="#795548"/>
            <ellipse cx="1148" cy="154" rx="16" ry="18" fill="#2e7d32"/>
            <ellipse cx="1148" cy="148" rx="12" ry="13" fill="#43a047"/>

            {/* ── BUILDINGS ── */}
            {/* Tall B1 */}
            <rect x="1190" y="52" width="68" height="131" rx="4" fill="#b0bec5"/>
            <rect x="1190" y="52" width="68" height="11"  rx="3" fill="#90a4ae"/>
            {[0,1,2,3,4,5,6].map((r: number) => [0,1,2].map((c: number) => (
              <rect key={`b1r${r}c${c}`} x={1198+c*20} y={69+r*16} width="13" height="10" rx="2"
                fill={[1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0][r*3+c] ? "#fff9c4" : "#eceff1"} opacity="0.95"/>
            )))}
            {/* Medium B2 */}
            <rect x="1272" y="72" width="58" height="111" rx="4" fill="#cfd8dc"/>
            <rect x="1272" y="72" width="58" height="10"  rx="3" fill="#b0bec5"/>
            {[0,1,2,3,4,5].map((r: number) => [0,1].map((c: number) => (
              <rect key={`b2r${r}c${c}`} x={1280+c*26} y={88+r*16} width="15" height="10" rx="2"
                fill={[1,0,0,1,1,0,1,1,0,1,0,1][r*2+c] ? "#fff9c4" : "#eceff1"} opacity="0.9"/>
            )))}
            {/* Short B3 */}
            <rect x="1344" y="98" width="50" height="85" rx="4" fill="#b0bec5"/>
            <rect x="1344" y="98" width="50" height="9"  rx="3" fill="#90a4ae"/>
            {[0,1,2,3,4].map((r: number) => [0,1].map((c: number) => (
              <rect key={`b3r${r}c${c}`} x={1351+c*22} y={113+r*16} width="13" height="10" rx="2"
                fill={[1,1,0,1,0,1,1,0,1,0][r*2+c] ? "#fff9c4" : "#eceff1"} opacity="0.9"/>
            )))}

            {/* ── ELECTRIC CAR — LTR blue ── */}
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="translate" from="-100 183" to="1520 183" dur="16s" repeatCount="indefinite"/>
              <rect x="2" y="-36" width="86" height="26" rx="5" fill="#1565c0"/>
              <rect x="14" y="-55" width="54" height="22" rx="7" fill="#1976d2"/>
              <rect x="18" y="-52" width="21" height="15" rx="2" fill="#b3e5fc" opacity="0.9"/>
              <rect x="43" y="-52" width="21" height="15" rx="2" fill="#b3e5fc" opacity="0.9"/>
              <circle cx="17" cy="-9" r="11" fill="#263238"/>
              <circle cx="17" cy="-9" r="5"  fill="#546e7a"/>
              <circle cx="73" cy="-9" r="11" fill="#263238"/>
              <circle cx="73" cy="-9" r="5"  fill="#546e7a"/>
              <ellipse cx="89" cy="-22" rx="3" ry="5" fill="#fffde7" opacity="0.95"/>
              <circle cx="10" cy="-40" r="4" fill="#4caf50"/>
            </g>

            {/* ── ELECTRIC CAR — RTL green ── */}
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="translate" from="1520 183" to="-100 183" dur="20s" begin="6s" repeatCount="indefinite"/>
              <g transform="translate(90,0) scale(-1,1)">
                <rect x="2" y="-36" width="86" height="26" rx="5" fill="#2e7d32"/>
                <rect x="14" y="-55" width="54" height="22" rx="7" fill="#388e3c"/>
                <rect x="18" y="-52" width="21" height="15" rx="2" fill="#c8e6c9" opacity="0.9"/>
                <rect x="43" y="-52" width="21" height="15" rx="2" fill="#c8e6c9" opacity="0.9"/>
                <circle cx="17" cy="-9" r="11" fill="#263238"/>
                <circle cx="17" cy="-9" r="5"  fill="#546e7a"/>
                <circle cx="73" cy="-9" r="11" fill="#263238"/>
                <circle cx="73" cy="-9" r="5"  fill="#546e7a"/>
                <ellipse cx="89" cy="-22" rx="3" ry="5" fill="#fffde7" opacity="0.95"/>
                <circle cx="10" cy="-40" r="4" fill="#ffb300"/>
              </g>
            </g>

            {/* ── ELECTRIC SCOOTER — LTR ── */}
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="translate" from="-60 183" to="1480 183" dur="11s" begin="3s" repeatCount="indefinite"/>
              <circle cx="10" cy="-10" r="10" fill="#37474f"/>
              <circle cx="10" cy="-10" r="4.5" fill="#607d8b"/>
              <circle cx="46" cy="-10" r="10" fill="#37474f"/>
              <circle cx="46" cy="-10" r="4.5" fill="#607d8b"/>
              <rect x="6" y="-30" width="44" height="10" rx="4" fill="#00897b"/>
              <rect x="8" y="-42" width="22" height="12" rx="4" fill="#00695c"/>
              <rect x="42" y="-50" width="5" height="26" rx="2" fill="#546e7a"/>
              <rect x="33" y="-51" rx="2" width="22" height="5" fill="#546e7a"/>
              <ellipse cx="22" cy="-52" rx="8" ry="12" fill="#ff7043"/>
              <circle  cx="22" cy="-65" r="9"  fill="#bf360c"/>
            </g>

            {/* ── ELECTRIC SCOOTER — RTL ── */}
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="translate" from="1480 183" to="-60 183" dur="13s" begin="9s" repeatCount="indefinite"/>
              <g transform="translate(56,0) scale(-1,1)">
                <circle cx="10" cy="-10" r="10" fill="#37474f"/>
                <circle cx="10" cy="-10" r="4.5" fill="#607d8b"/>
                <circle cx="46" cy="-10" r="10" fill="#37474f"/>
                <circle cx="46" cy="-10" r="4.5" fill="#607d8b"/>
                <rect x="6" y="-30" width="44" height="10" rx="4" fill="#0288d1"/>
                <rect x="8" y="-42" width="22" height="12" rx="4" fill="#01579b"/>
                <rect x="42" y="-50" width="5" height="26" rx="2" fill="#546e7a"/>
                <rect x="33" y="-51" rx="2" width="22" height="5" fill="#546e7a"/>
                <ellipse cx="22" cy="-52" rx="8" ry="12" fill="#ffa726"/>
                <circle  cx="22" cy="-65" r="9"  fill="#e65100"/>
              </g>
            </g>

          </svg>
        </div>

      </div>
    </>
  );
}
