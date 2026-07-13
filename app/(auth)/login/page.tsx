"use client";

/**
 * ZeroForm Campus — Login Page
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
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── LEFT: Form ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#fff" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Institution Logo */}
          {/* Replace /media/institution.png with your college logo anytime */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/institution.png" alt="Institution Logo" style={{ height: 72, maxWidth: 280, objectFit: "contain" }} />
          </div>

          {/* Card */}
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 32px rgba(79,70,229,0.10)", border: "1px solid #ede9fe", padding: "2rem" }}>

            <h4 style={{ fontWeight: 700, fontSize: 20, color: "#1e1b4b", marginBottom: 4 }}>Hi, Welcome back!</h4>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem", fontWeight: 400 }}>Sign in to your account to continue</p>

            {errors.form && (
              <div style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 8, padding: "8px 14px", fontSize: 13, marginBottom: "1rem" }}>
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="login-email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@college.edu.in"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: undefined })); }}
                  autoComplete="email"
                  style={{
                    width: "100%", padding: "10px 14px", fontSize: 13, borderRadius: 8,
                    border: errors.email ? "1.5px solid #dc2626" : "1.5px solid #e5e7eb",
                    outline: "none", color: "#1f2937", background: "#fafafa",
                  }}
                />
                {errors.email && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "0.75rem" }}>
                <label htmlFor="login-password" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: undefined })); }}
                    autoComplete="current-password"
                    style={{
                      width: "100%", padding: "10px 40px 10px 14px", fontSize: 13, borderRadius: 8,
                      border: errors.password ? "1.5px solid #dc2626" : "1.5px solid #e5e7eb",
                      outline: "none", color: "#1f2937", background: "#fafafa",
                    }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                    <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"} style={{ fontSize: 16 }} />
                  </button>
                </div>
                {errors.password && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.password}</div>}
              </div>

              {/* Remember + Forgot */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", cursor: "pointer" }}>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ accentColor: "#7c3aed" }} />
                  Remember me
                </label>
                <Link href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "11px", borderRadius: 8, border: "none", cursor: loading ? "not-allowed" : "pointer",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff",
                  fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: loading ? 0.8 : 1,
                }}>
                {loading
                  ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Signing in…</>
                  : <><i className="ri-login-box-line" style={{ fontSize: 16 }} /> Sign In</>
                }
              </button>

            </form>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: "1.5rem" }}>
            © {new Date().getFullYear()} ZeroForm Campus · All rights reserved
          </p>
        </div>
      </div>

      {/* ── RIGHT: Branding ──────────────────────────────────────────────────── */}
      <div style={{
        width: "42%", minHeight: "100vh",
        background: "linear-gradient(145deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
        display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
      }} className="d-none d-xl-flex">

        {/* Top-right: ZeroForm Campus logo */}
        {/* Logo file: /media/ZeroFormCampus.png */}
        <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
          <div style={{ background: "#fff", borderRadius: 10, padding: "6px 12px", display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/ZeroFormCampus.png" alt="ZeroForm Campus" style={{ height: 32, width: "auto", objectFit: "contain" }} />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem 2.5rem", position: "relative", zIndex: 2 }}>

          {/* College Building SVG */}
          <div style={{ marginBottom: "2rem" }}>
            <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 380 }}>
              <rect x="60" y="120" width="300" height="130" rx="4" fill="rgba(255,255,255,0.15)" />
              <polygon points="45,120 210,48 375,120" fill="rgba(255,255,255,0.22)" />
              <rect x="96"  y="120" width="14" height="130" rx="3" fill="rgba(255,255,255,0.13)" />
              <rect x="140" y="120" width="14" height="130" rx="3" fill="rgba(255,255,255,0.13)" />
              <rect x="184" y="120" width="14" height="130" rx="3" fill="rgba(255,255,255,0.13)" />
              <rect x="228" y="120" width="14" height="130" rx="3" fill="rgba(255,255,255,0.13)" />
              <rect x="272" y="120" width="14" height="130" rx="3" fill="rgba(255,255,255,0.13)" />
              <rect x="316" y="120" width="14" height="130" rx="3" fill="rgba(255,255,255,0.13)" />
              <rect x="174" y="185" width="52" height="65" rx="5" fill="rgba(255,255,255,0.28)" />
              <circle cx="218" cy="218" r="3" fill="rgba(255,255,255,0.7)" />
              <rect x="97"  y="145" width="34" height="26" rx="3" fill="rgba(255,255,255,0.2)" />
              <rect x="157" y="145" width="34" height="26" rx="3" fill="rgba(255,255,255,0.2)" />
              <rect x="257" y="145" width="34" height="26" rx="3" fill="rgba(255,255,255,0.2)" />
              <rect x="317" y="145" width="34" height="26" rx="3" fill="rgba(255,255,255,0.2)" />
              <line x1="210" y1="48" x2="210" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
              <polygon points="210,14 234,23 210,32" fill="rgba(255,220,50,0.9)" />
              <rect x="38" y="248" width="344" height="9" rx="2" fill="rgba(255,255,255,0.2)" />
              <rect x="52" y="240" width="316" height="9" rx="2" fill="rgba(255,255,255,0.14)" />
              <rect x="14" y="216" width="6" height="34" fill="rgba(255,255,255,0.22)" />
              <ellipse cx="17" cy="206" rx="16" ry="20" fill="rgba(255,255,255,0.16)" />
              <rect x="400" y="216" width="6" height="34" fill="rgba(255,255,255,0.22)" />
              <ellipse cx="403" cy="206" rx="16" ry="20" fill="rgba(255,255,255,0.16)" />
              <rect x="6"   y="62" width="88" height="44" rx="8" fill="rgba(255,255,255,0.18)" />
              <circle cx="24" cy="78" r="8" fill="rgba(255,255,255,0.4)" />
              <rect x="39" y="71" width="46" height="6" rx="3" fill="rgba(255,255,255,0.6)" />
              <rect x="39" y="83" width="30" height="5" rx="2.5" fill="rgba(255,255,255,0.35)" />
              <rect x="326" y="52" width="88" height="44" rx="8" fill="rgba(255,255,255,0.18)" />
              <circle cx="344" cy="68" r="8" fill="rgba(255,255,255,0.4)" />
              <rect x="359" y="61" width="46" height="6" rx="3" fill="rgba(255,255,255,0.6)" />
              <rect x="359" y="73" width="30" height="5" rx="2.5" fill="rgba(255,255,255,0.35)" />
              <rect x="158" y="8"  width="88" height="34" rx="8" fill="rgba(255,255,255,0.15)" />
              <rect x="170" y="16" width="64" height="5" rx="2.5" fill="rgba(255,255,255,0.5)" />
              <rect x="170" y="26" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>

          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 26, lineHeight: 1.35, marginBottom: "0.75rem" }}>
            Welcome to<br />ZeroForm Campus
          </h2>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 13.5, lineHeight: 1.75, marginBottom: "2rem", maxWidth: 300 }}>
            A modern college management platform — admissions, student records, and fee management built for Indian higher education.
          </p>

          {/* Feature chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { icon: "ri-user-add-line",           label: "Admissions CRM" },
              { icon: "ri-graduation-cap-line",      label: "Student SIS" },
              { icon: "ri-money-rupee-circle-line",  label: "Fee Management" },
              { icon: "ri-bar-chart-2-line",         label: "Analytics" },
            ].map(f => (
              <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", borderRadius: 20, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                <i className={f.icon} style={{ fontSize: 14 }} />
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <svg viewBox="0 0 500 60" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 60 }}>
          <path d="M0,30 C150,60 350,0 500,30 L500,60 L0,60 Z" fill="rgba(255,255,255,0.08)" />
        </svg>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
