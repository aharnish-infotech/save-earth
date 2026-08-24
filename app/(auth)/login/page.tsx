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
            <circle cx="1310" cy="40" r="36" fill="url(#sc-sun)" opacity="0.95"/>
            <circle cx="1310" cy="40" r="48" fill="#ffd54f" opacity="0.15"/>
            <circle cx="1310" cy="40" r="60" fill="#ffecb3" opacity="0.09"/>

            {/* ── CLOUDS ── */}
            <g opacity="0.93">
              <ellipse cx="155" cy="32" rx="50" ry="20" fill="white"/>
              <ellipse cx="116" cy="40" rx="34" ry="17" fill="white"/>
              <ellipse cx="194" cy="40" rx="30" ry="15" fill="white"/>
              <ellipse cx="152" cy="46" rx="52" ry="13" fill="white"/>
            </g>
            <g opacity="0.78">
              <ellipse cx="490" cy="22" rx="36" ry="15" fill="white"/>
              <ellipse cx="462" cy="28" rx="25" ry="12" fill="white"/>
              <ellipse cx="518" cy="28" rx="22" ry="11" fill="white"/>
              <ellipse cx="490" cy="34" rx="38" ry="9"  fill="white"/>
            </g>
            <g opacity="0.65">
              <ellipse cx="860" cy="18" rx="28" ry="11" fill="white"/>
              <ellipse cx="840" cy="24" rx="19" ry="9"  fill="white"/>
              <ellipse cx="880" cy="24" rx="17" ry="8"  fill="white"/>
              <ellipse cx="860" cy="29" rx="30" ry="7"  fill="white"/>
            </g>

            {/* ── FLAT GROUND STRIP ── */}
            <rect x="0" y="183" width="1400" height="27" fill="url(#sc-ground)"/>
            <line x1="0" y1="183" x2="1400" y2="183" stroke="#81c784" strokeWidth="2"/>

            {/* ── SOLAR PANELS — left ── */}
            {[18,68,118,168,218,268].map((x) => (
              <g key={x}>
                <line x1={x+12} y1="183" x2={x+8}  y2="148" stroke="#78909c" strokeWidth="2"/>
                <line x1={x+30} y1="183" x2={x+34} y2="148" stroke="#78909c" strokeWidth="2"/>
                <rect x={x} y="126" width="44" height="26" rx="3"
                  transform={`rotate(-16 ${x+22} 139)`} fill="#1565c0"/>
                <line x1={x+14} y1="129" x2={x+12} y2="149" stroke="#42a5f5" strokeWidth="0.8" opacity="0.5"
                  transform={`rotate(-16 ${x+22} 139)`}/>
                <line x1={x+22} y1="128" x2={x+20} y2="150" stroke="#42a5f5" strokeWidth="0.8" opacity="0.5"
                  transform={`rotate(-16 ${x+22} 139)`}/>
                <line x1={x+30} y1="128" x2={x+28} y2="150" stroke="#42a5f5" strokeWidth="0.8" opacity="0.5"
                  transform={`rotate(-16 ${x+22} 139)`}/>
                <line x1={x+2}  y1="136" x2={x+42} y2="134" stroke="#42a5f5" strokeWidth="0.6" opacity="0.35"
                  transform={`rotate(-16 ${x+22} 139)`}/>
                <rect x={x+2} y="127" width="40" height="7" rx="1" fill="white" opacity="0.1"
                  transform={`rotate(-16 ${x+22} 139)`}/>
              </g>
            ))}

            {/* ── TREE 1 — x=378 ── */}
            <rect x="375" y="158" width="8" height="25" rx="3" fill="#795548"/>
            <ellipse cx="379" cy="146" rx="22" ry="24" fill="#388e3c"/>
            <ellipse cx="379" cy="139" rx="17" ry="18" fill="#43a047"/>
            <ellipse cx="381" cy="132" rx="12" ry="14" fill="#66bb6a"/>

            {/* ── WIND TURBINE X-LARGE — x=480, hub y=22 ── */}
            <line x1="480" y1="22" x2="480" y2="183" stroke="#90a4ae" strokeWidth="5"/>
            <circle cx="480" cy="22" r="9" fill="#546e7a"/>
            <circle cx="480" cy="22" r="5" fill="#cfd8dc"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 480 22" to="360 480 22" dur="3.5s" repeatCount="indefinite"/>
              <ellipse cx="480" cy="-10" rx="5" ry="33" fill="white" stroke="#90a4ae" strokeWidth="1.2"/>
              <ellipse cx="480" cy="-10" rx="5" ry="33" fill="white" stroke="#90a4ae" strokeWidth="1.2" transform="rotate(120 480 22)"/>
              <ellipse cx="480" cy="-10" rx="5" ry="33" fill="white" stroke="#90a4ae" strokeWidth="1.2" transform="rotate(240 480 22)"/>
            </g>

            {/* ── WIND TURBINE LARGE — x=590, hub y=40 ── */}
            <line x1="590" y1="40" x2="590" y2="183" stroke="#90a4ae" strokeWidth="4.5"/>
            <circle cx="590" cy="40" r="8" fill="#546e7a"/>
            <circle cx="590" cy="40" r="4.5" fill="#cfd8dc"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 590 40" to="360 590 40" dur="4.2s" repeatCount="indefinite"/>
              <ellipse cx="590" cy="14" rx="4.5" ry="27" fill="white" stroke="#90a4ae" strokeWidth="1.2"/>
              <ellipse cx="590" cy="14" rx="4.5" ry="27" fill="white" stroke="#90a4ae" strokeWidth="1.2" transform="rotate(120 590 40)"/>
              <ellipse cx="590" cy="14" rx="4.5" ry="27" fill="white" stroke="#90a4ae" strokeWidth="1.2" transform="rotate(240 590 40)"/>
            </g>

            {/* ── WIND TURBINE MEDIUM — x=692, hub y=60 ── */}
            <line x1="692" y1="60" x2="692" y2="183" stroke="#90a4ae" strokeWidth="4"/>
            <circle cx="692" cy="60" r="7" fill="#546e7a"/>
            <circle cx="692" cy="60" r="4" fill="#cfd8dc"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 692 60" to="360 692 60" dur="3s" repeatCount="indefinite"/>
              <ellipse cx="692" cy="38" rx="4" ry="23" fill="white" stroke="#90a4ae" strokeWidth="1.1"/>
              <ellipse cx="692" cy="38" rx="4" ry="23" fill="white" stroke="#90a4ae" strokeWidth="1.1" transform="rotate(120 692 60)"/>
              <ellipse cx="692" cy="38" rx="4" ry="23" fill="white" stroke="#90a4ae" strokeWidth="1.1" transform="rotate(240 692 60)"/>
            </g>

            {/* ── WIND TURBINE SMALL — x=782, hub y=78 ── */}
            <line x1="782" y1="78" x2="782" y2="183" stroke="#90a4ae" strokeWidth="3.5"/>
            <circle cx="782" cy="78" r="6" fill="#546e7a"/>
            <circle cx="782" cy="78" r="3.5" fill="#cfd8dc"/>
            <g>
              <animateTransform attributeName="transform" attributeType="XML"
                type="rotate" from="0 782 78" to="360 782 78" dur="2.6s" repeatCount="indefinite"/>
              <ellipse cx="782" cy="60" rx="3.5" ry="19" fill="white" stroke="#90a4ae" strokeWidth="1"/>
              <ellipse cx="782" cy="60" rx="3.5" ry="19" fill="white" stroke="#90a4ae" strokeWidth="1" transform="rotate(120 782 78)"/>
              <ellipse cx="782" cy="60" rx="3.5" ry="19" fill="white" stroke="#90a4ae" strokeWidth="1" transform="rotate(240 782 78)"/>
            </g>

            {/* ── TREE 2 — x=870 ── */}
            <rect x="867" y="162" width="7" height="21" rx="3" fill="#795548"/>
            <ellipse cx="871" cy="150" rx="19" ry="21" fill="#2e7d32"/>
            <ellipse cx="871" cy="143" rx="14" ry="16" fill="#388e3c"/>
            <ellipse cx="873" cy="137" rx="10" ry="12" fill="#43a047"/>

            {/* ── POWER POLE — x=960 ── */}
            <line x1="960" y1="80" x2="960" y2="183" stroke="#78716c" strokeWidth="4.5"/>
            <line x1="930" y1="80" x2="990" y2="80" stroke="#78716c" strokeWidth="3.5"/>
            <line x1="960" y1="80" x2="960" y2="108" stroke="#9e9e9e" strokeWidth="2.5"/>
            <line x1="944" y1="108" x2="976" y2="108" stroke="#78716c" strokeWidth="3"/>
            <line x1="930" y1="80" x2="944" y2="108" stroke="#78716c" strokeWidth="2"/>
            <line x1="990" y1="80" x2="976" y2="108" stroke="#78716c" strokeWidth="2"/>
            <circle cx="930" cy="80" r="5" fill="#90a4ae"/>
            <circle cx="960" cy="80" r="5" fill="#90a4ae"/>
            <circle cx="990" cy="80" r="5" fill="#90a4ae"/>

            {/* ── TREE 3 — x=1058 ── */}
            <rect x="1055" y="165" width="6" height="18" rx="3" fill="#795548"/>
            <ellipse cx="1058" cy="154" rx="16" ry="18" fill="#388e3c"/>
            <ellipse cx="1058" cy="148" rx="12" ry="13" fill="#43a047"/>

            {/* ── TRANSFORMER — x=1140 ── */}
            <line x1="1140" y1="82" x2="1140" y2="183" stroke="#78716c" strokeWidth="4.5"/>
            <rect x="1118" y="78" width="46" height="40" rx="6" fill="#37474f"/>
            <rect x="1123" y="82" width="36" height="14" rx="3" fill="#546e7a"/>
            <rect x="1123" y="98" width="36" height="7"  rx="2" fill="#455a64"/>
            <rect x="1123" y="107" width="36" height="7" rx="2" fill="#455a64"/>
            <line x1="1130" y1="74" x2="1130" y2="79" stroke="#90a4ae" strokeWidth="3"/>
            <line x1="1140" y1="72" x2="1140" y2="79" stroke="#90a4ae" strokeWidth="3"/>
            <line x1="1150" y1="74" x2="1150" y2="79" stroke="#90a4ae" strokeWidth="3"/>
            <circle cx="1130" cy="74" r="3.5" fill="#78909c"/>
            <circle cx="1140" cy="72" r="3.5" fill="#78909c"/>
            <circle cx="1150" cy="74" r="3.5" fill="#78909c"/>

            {/* ── BUILDINGS ── */}
            {/* Tall B1 x=1220 */}
            <rect x="1220" y="55" width="72" height="128" rx="4" fill="#b0bec5"/>
            <rect x="1220" y="55" width="72" height="11"  rx="3" fill="#90a4ae"/>
            {[0,1,2,3,4,5,6].map(r => [0,1,2].map(c => (
              <rect key={`b1r${r}c${c}`} x={1228+c*21} y={72+r*16} width="14" height="10" rx="2"
                fill={[1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0][r*3+c] ? "#fff9c4" : "#eceff1"} opacity="0.95"/>
            )))}
            {/* Medium B2 x=1308 */}
            <rect x="1308" y="76" width="58" height="107" rx="4" fill="#cfd8dc"/>
            <rect x="1308" y="76" width="58" height="10"  rx="3" fill="#b0bec5"/>
            {[0,1,2,3,4,5].map(r => [0,1].map(c => (
              <rect key={`b2r${r}c${c}`} x={1316+c*26} y={92+r*16} width="16" height="10" rx="2"
                fill={[1,0,0,1,1,0,1,1,0,1,0,1][r*2+c] ? "#fff9c4" : "#eceff1"} opacity="0.9"/>
            )))}
            {/* Small B3 x=1382 */}
            <rect x="1382" y="108" width="40" height="75" rx="3" fill="#b0bec5"/>
            <rect x="1382" y="108" width="40" height="8"  rx="2" fill="#90a4ae"/>
            {[0,1,2,3].map(r => (
              <rect key={`b3r${r}`} x={1390} y={122+r*16} width="24" height="9" rx="2"
                fill={[1,0,1,1][r] ? "#fff9c4" : "#eceff1"} opacity="0.9"/>
            ))}

          </svg>
        </div>

      </div>
    </>
  );
}
