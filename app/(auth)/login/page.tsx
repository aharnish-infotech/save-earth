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
        paddingBottom: "200px",
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
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:185, pointerEvents:"none" }}>
          <svg viewBox="0 0 1400 185" preserveAspectRatio="xMidYMax slice"
            style={{ width:"100%", height:"100%" }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lg-ground" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#bbf7d0"/>
                <stop offset="100%" stopColor="#86efac"/>
              </linearGradient>
              <filter id="lg-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              {/* wire paths */}
              <path id="wp1" d="M 270 95 C 350 85 500 72 640 65"/>
              <path id="wp2" d="M 640 65 C 680 62 710 60 740 58"/>
              <path id="wp3" d="M 870 58 C 900 58 930 60 960 62"/>
              <path id="wp4" d="M 960 62 C 990 64 1020 62 1050 60"/>
              <path id="wp5" d="M 1050 60 C 1100 58 1130 58 1160 60"/>
            </defs>

            {/* Ground */}
            <rect x="0" y="152" width="1400" height="33" fill="url(#lg-ground)"/>
            <line x1="0" y1="152" x2="1400" y2="152" stroke="#6ee7b7" strokeWidth="1.5"/>

            {/* ── SOLAR PANELS ── */}
            {[30,78,126,174,222].map((x) => (
              <g key={x}>
                <line x1={x+10} y1="150" x2={x+8}  y2="118" stroke="#6b7280" strokeWidth="1.8"/>
                <line x1={x+30} y1="150" x2={x+32} y2="118" stroke="#6b7280" strokeWidth="1.8"/>
                <rect x={x} y="100" width="42" height="22" rx="2"
                  transform={`rotate(-18 ${x+21} 111)`} fill="#1e3a5f"/>
                <line x1={x+14} y1="103" x2={x+12} y2="120" stroke="#60a5fa" strokeWidth="0.6" opacity="0.5"
                  transform={`rotate(-18 ${x+21} 111)`}/>
                <line x1={x+21} y1="102" x2={x+19} y2="121" stroke="#60a5fa" strokeWidth="0.6" opacity="0.5"
                  transform={`rotate(-18 ${x+21} 111)`}/>
                <line x1={x+28} y1="102" x2={x+26} y2="121" stroke="#60a5fa" strokeWidth="0.6" opacity="0.5"
                  transform={`rotate(-18 ${x+21} 111)`}/>
                <line x1={x+2}  y1="108" x2={x+40} y2="106" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4"
                  transform={`rotate(-18 ${x+21} 111)`}/>
                <rect x={x+1} y="101" width="40" height="5" rx="1" fill="white" opacity="0.07"
                  transform={`rotate(-18 ${x+21} 111)`}/>
              </g>
            ))}

            {/* ── WIND TURBINE LARGE — hub (395,22) ── */}
            <line x1="395" y1="22" x2="395" y2="152" stroke="#9ca3af" strokeWidth="3.5"/>
            <circle cx="395" cy="22" r="6" fill="#6b7280"/>
            <circle cx="395" cy="22" r="3" fill="#e5e7eb"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 395 22" to="360 395 22" dur="3s" repeatCount="indefinite"/>
              <ellipse cx="395" cy="0"  rx="4"   ry="22" fill="white" opacity="0.9"/>
              <ellipse cx="395" cy="0"  rx="4"   ry="22" fill="white" opacity="0.9" transform="rotate(120 395 22)"/>
              <ellipse cx="395" cy="0"  rx="4"   ry="22" fill="white" opacity="0.9" transform="rotate(240 395 22)"/>
            </g>

            {/* ── WIND TURBINE MEDIUM — hub (510,40) ── */}
            <line x1="510" y1="40" x2="510" y2="152" stroke="#9ca3af" strokeWidth="3"/>
            <circle cx="510" cy="40" r="5" fill="#6b7280"/>
            <circle cx="510" cy="40" r="2.5" fill="#e5e7eb"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 510 40" to="360 510 40" dur="4.2s" repeatCount="indefinite"/>
              <ellipse cx="510" cy="22" rx="3.5" ry="18" fill="white" opacity="0.87"/>
              <ellipse cx="510" cy="22" rx="3.5" ry="18" fill="white" opacity="0.87" transform="rotate(120 510 40)"/>
              <ellipse cx="510" cy="22" rx="3.5" ry="18" fill="white" opacity="0.87" transform="rotate(240 510 40)"/>
            </g>

            {/* ── WIND TURBINE SMALL — hub (600,60) ── */}
            <line x1="600" y1="60" x2="600" y2="152" stroke="#9ca3af" strokeWidth="2.5"/>
            <circle cx="600" cy="60" r="4" fill="#6b7280"/>
            <circle cx="600" cy="60" r="2" fill="#e5e7eb"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 600 60" to="360 600 60" dur="2.8s" repeatCount="indefinite"/>
              <ellipse cx="600" cy="46" rx="3" ry="14" fill="white" opacity="0.85"/>
              <ellipse cx="600" cy="46" rx="3" ry="14" fill="white" opacity="0.85" transform="rotate(120 600 60)"/>
              <ellipse cx="600" cy="46" rx="3" ry="14" fill="white" opacity="0.85" transform="rotate(240 600 60)"/>
            </g>

            {/* ── POWER LINE POLE 1 — x=740 ── */}
            <line x1="740" y1="55" x2="740" y2="152" stroke="#78716c" strokeWidth="3.5"/>
            <line x1="714" y1="55" x2="766" y2="55" stroke="#78716c" strokeWidth="2.5"/>
            <circle cx="714" cy="55" r="3.5" fill="#9ca3af"/>
            <circle cx="740" cy="55" r="3.5" fill="#9ca3af"/>
            <circle cx="766" cy="55" r="3.5" fill="#9ca3af"/>
            {/* bracing */}
            <line x1="740" y1="55" x2="740" y2="85" stroke="#9ca3af" strokeWidth="1.5"/>
            <line x1="726" y1="85" x2="754" y2="85" stroke="#78716c" strokeWidth="2"/>
            <line x1="714" y1="55" x2="726" y2="85" stroke="#78716c" strokeWidth="1.5"/>
            <line x1="766" y1="55" x2="754" y2="85" stroke="#78716c" strokeWidth="1.5"/>

            {/* ── POWER LINE POLE 2 — x=870 ── */}
            <line x1="870" y1="55" x2="870" y2="152" stroke="#78716c" strokeWidth="3.5"/>
            <line x1="844" y1="55" x2="896" y2="55" stroke="#78716c" strokeWidth="2.5"/>
            <circle cx="844" cy="55" r="3.5" fill="#9ca3af"/>
            <circle cx="870" cy="55" r="3.5" fill="#9ca3af"/>
            <circle cx="896" cy="55" r="3.5" fill="#9ca3af"/>
            <line x1="870" y1="55" x2="870" y2="85" stroke="#9ca3af" strokeWidth="1.5"/>
            <line x1="856" y1="85" x2="884" y2="85" stroke="#78716c" strokeWidth="2"/>
            <line x1="844" y1="55" x2="856" y2="85" stroke="#78716c" strokeWidth="1.5"/>
            <line x1="896" y1="55" x2="884" y2="85" stroke="#78716c" strokeWidth="1.5"/>

            {/* Catenary wires between poles */}
            <path d="M 714 55 Q 777 64 844 55" fill="none" stroke="#4b5563" strokeWidth="1.5"/>
            <path d="M 740 55 Q 805 62 870 55" fill="none" stroke="#4b5563" strokeWidth="1.5"/>
            <path d="M 766 55 Q 831 62 896 55" fill="none" stroke="#4b5563" strokeWidth="1.5"/>

            {/* ── TRANSFORMER — x=960 ── */}
            <line x1="960" y1="60" x2="960" y2="152" stroke="#78716c" strokeWidth="3.5"/>
            <rect x="940" y="60" width="40" height="32" rx="4" fill="#374151"/>
            <rect x="944" y="63" width="32" height="10" rx="2" fill="#6b7280"/>
            <rect x="944" y="75" width="32" height="5"  rx="1" fill="#4b5563"/>
            <rect x="944" y="82" width="32" height="5"  rx="1" fill="#4b5563"/>
            <line x1="950" y1="57" x2="950" y2="61" stroke="#9ca3af" strokeWidth="2.5"/>
            <line x1="960" y1="55" x2="960" y2="61" stroke="#9ca3af" strokeWidth="2.5"/>
            <line x1="970" y1="57" x2="970" y2="61" stroke="#9ca3af" strokeWidth="2.5"/>
            <circle cx="950" cy="57" r="2.5" fill="#6b7280"/>
            <circle cx="960" cy="55" r="2.5" fill="#6b7280"/>
            <circle cx="970" cy="57" r="2.5" fill="#6b7280"/>
            {/* output wires down */}
            <line x1="950" y1="92" x2="950" y2="100" stroke="#4b5563" strokeWidth="1.5"/>
            <line x1="960" y1="92" x2="960" y2="100" stroke="#4b5563" strokeWidth="1.5"/>
            <line x1="970" y1="92" x2="970" y2="100" stroke="#4b5563" strokeWidth="1.5"/>

            {/* ── WIRE: solar → pole 1 ── */}
            <path d="M 270 95 C 350 85 500 72 640 65" fill="none" stroke="#4b5563" strokeWidth="1.5"/>
            {/* ── WIRE: pole 1 → pole 2 (via insulators) ── */}
            <path d="M 640 65 C 680 62 710 60 740 58" fill="none" stroke="#4b5563" strokeWidth="1.5"/>
            {/* ── WIRE: pole 2 → transformer ── */}
            <path d="M 870 58 C 900 58 930 60 960 62" fill="none" stroke="#4b5563" strokeWidth="1.5"/>
            {/* ── WIRE: transformer → buildings ── */}
            <path d="M 980 75 C 1010 72 1035 66 1060 65" fill="none" stroke="#4b5563" strokeWidth="1.5"/>
            <path d="M 1060 65 C 1100 63 1130 62 1160 63" fill="none" stroke="#4b5563" strokeWidth="1.5"/>

            {/* ── BUILDINGS ── */}
            {/* Tall B1 x=1060 */}
            <rect x="1060" y="42" width="72" height="110" rx="3" fill="#d1d5db"/>
            <rect x="1060" y="42" width="72" height="9"   rx="2" fill="#9ca3af"/>
            {/* windows fixed pattern */}
            {[0,1,2,3,4,5].map(r => [0,1,2].map(c => (
              <rect key={`w1-${r}-${c}`} x={1068+c*22} y={57+r*16} width="14" height="10" rx="1.5"
                fill={[1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0][r*3+c] ? "#fef3c7" : "#e5e7eb"} opacity="0.9"/>
            )))}
            {/* Tall B2 x=1150 */}
            <rect x="1150" y="58" width="60" height="94" rx="3" fill="#e5e7eb"/>
            <rect x="1150" y="58" width="60" height="8"  rx="2" fill="#d1d5db"/>
            {[0,1,2,3,4].map(r => [0,1].map(c => (
              <rect key={`w2-${r}-${c}`} x={1158+c*26} y={72+r*16} width="16" height="10" rx="1.5"
                fill={[1,0,0,1,1,0,1,1,0,1][r*2+c] ? "#fef9c3" : "#f3f4f6"} opacity="0.9"/>
            )))}
            {/* Medium B3 x=1228 */}
            <rect x="1228" y="74" width="55" height="78" rx="3" fill="#d1fae5"/>
            <rect x="1228" y="74" width="55" height="7"  rx="2" fill="#a7f3d0"/>
            {[0,1,2,3].map(r => [0,1].map(c => (
              <rect key={`w3-${r}-${c}`} x={1236+c*24} y={87+r*16} width="14" height="10" rx="1.5"
                fill={[1,0,1,1,0,1,1,0][r*2+c] ? "#fef3c7" : "#dcfce7"} opacity="0.9"/>
            )))}
            {/* Short B4 x=1300 */}
            <rect x="1300" y="94" width="50" height="58" rx="3" fill="#e5e7eb"/>
            <rect x="1300" y="94" width="50" height="7"  rx="2" fill="#d1d5db"/>
            {[0,1].map(r => [0,1].map(c => (
              <rect key={`w4-${r}-${c}`} x={1308+c*22} y={107+r*16} width="13" height="9" rx="1.5"
                fill={[1,1,0,1][r*2+c] ? "#fef3c7" : "#e5e7eb"} opacity="0.9"/>
            )))}
            {/* Far building x=1365 */}
            <rect x="1365" y="108" width="40" height="44" rx="3" fill="#f3f4f6"/>
            <rect x="1365" y="108" width="40" height="6"  rx="2" fill="#e5e7eb"/>
            {[0].map(r => [0].map(c => (
              <rect key={`w5-${r}-${c}`} x={1373} y={120} width="24" height="9" rx="1.5" fill="#fef3c7" opacity="0.85"/>
            )))}

            {/* ── TREES ── */}
            {[290, 445, 655, 1005, 1355].map((x, i) => (
              <g key={i}>
                <line x1={x} y1="122" x2={x} y2="152" stroke="#78716c" strokeWidth="2"/>
                <ellipse cx={x}   cy="110" rx="13" ry="16" fill="#86efac" opacity="0.75"/>
                <ellipse cx={x}   cy="105" rx="10" ry="12" fill="#4ade80" opacity="0.65"/>
                <ellipse cx={x+2} cy="101" rx="7"  ry="9"  fill="#22c55e" opacity="0.55"/>
              </g>
            ))}

            {/* ── ELECTRICITY DOTS ── */}
            {/* solar → pole1 */}
            <circle r="3.5" fill="#fbbf24" filter="url(#lg-glow)">
              <animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#wp1"/></animateMotion>
            </circle>
            <circle r="2.5" fill="#fde68a" opacity="0.75">
              <animateMotion dur="2.8s" begin="1.4s" repeatCount="indefinite"><mpath href="#wp1"/></animateMotion>
            </circle>
            {/* pole1 → pole2 */}
            <circle r="3.5" fill="#fbbf24" filter="url(#lg-glow)">
              <animateMotion dur="1.2s" repeatCount="indefinite"><mpath href="#wp2"/></animateMotion>
            </circle>
            {/* pole2 → transformer */}
            <circle r="3.5" fill="#fbbf24" filter="url(#lg-glow)">
              <animateMotion dur="1.5s" repeatCount="indefinite"><mpath href="#wp3"/></animateMotion>
            </circle>
            {/* transformer → building1 */}
            <circle r="3.5" fill="#fbbf24" filter="url(#lg-glow)">
              <animateMotion dur="1.2s" repeatCount="indefinite"><mpath href="#wp4"/></animateMotion>
            </circle>
            <circle r="2.5" fill="#fde68a" opacity="0.7">
              <animateMotion dur="1.2s" begin="0.6s" repeatCount="indefinite"><mpath href="#wp4"/></animateMotion>
            </circle>
            {/* building1 → building2 */}
            <circle r="3" fill="#fbbf24" filter="url(#lg-glow)">
              <animateMotion dur="1.4s" repeatCount="indefinite"><mpath href="#wp5"/></animateMotion>
            </circle>

          </svg>
        </div>

      </div>
    </>
  );
}
