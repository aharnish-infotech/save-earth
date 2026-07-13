"use client";

/**
 * ZeroForm Campus — Login Page
 * AUTH INTEGRATION HOOK: Replace the handleSubmit MOCK block with your API call.
 *   const res = await fetch("/api/auth/login", { method:"POST", body: JSON.stringify({ email, password }) });
 *   if (res.ok) router.replace("/dashboard"); else setErrors({ form: "Invalid credentials" });
 */

import React, { useState } from "react";
import Image from "next/image";
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
    else if (password.length < 6)          e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── MOCK: replace this block with real API call ──────────────────────────
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>

      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL — Login Form
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#ffffff",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* College Logo */}
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <div style={{ position: "relative", width: 180, height: 52, margin: "0 auto 0.5rem" }}>
              <Image
                src="/assets/brand-logos/desktop-logo.png"
                alt="ZeroForm Campus"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
              Campus Management System
            </div>
          </div>

          {/* Card */}
          <div className="card custom-card border-0" style={{ borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <div className="card-body" style={{ padding: "2rem" }}>

              <h4 className="fw-semibold mb-1" style={{ color: "var(--default-text-color)", fontSize: 20 }}>
                Hi, Welcome back!
              </h4>
              <p className="mb-4" style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 400 }}>
                Sign in to your account to continue
              </p>

              {errors.form && (
                <div className="alert alert-danger py-2 fs-13 mb-3">{errors.form}</div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="login-email" className="form-label fw-medium" style={{ fontSize: 13, color: "var(--default-text-color)" }}>
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className={`form-control${errors.email ? " is-invalid" : ""}`}
                    placeholder="admin@college.edu.in"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: undefined })); }}
                    autoComplete="email"
                    style={{ fontSize: 13, borderRadius: 8 }}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="login-password" className="form-label fw-medium d-block" style={{ fontSize: 13, color: "var(--default-text-color)" }}>
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      className={`form-control${errors.password ? " is-invalid" : ""}`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: undefined })); }}
                      autoComplete="current-password"
                      style={{ fontSize: 13, borderRadius: 8, paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                      style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0,
                      }}
                    >
                      <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"} style={{ fontSize: 16 }} />
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe" style={{ fontSize: 13 }}>
                      Remember me
                    </label>
                  </div>
                  <Link href="#" onClick={e => e.preventDefault()} className="link-danger fw-medium" style={{ fontSize: 12 }}>
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                  style={{ borderRadius: 8, fontWeight: 600, fontSize: 14, padding: "0.65rem" }}
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Signing in…</>
                    : <><i className="ri-login-box-line me-2" />Sign In</>
                  }
                </button>
              </form>

            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: "1.5rem" }}>
            © {new Date().getFullYear()} ZeroForm Campus · All rights reserved
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — Branding
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        width: "42%",
        background: "linear-gradient(145deg, #4f46e5 0%, #7c3aed 40%, #9333ea 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }} className="d-none d-xl-flex">

        {/* Top-right company logo */}
        <div style={{
          position: "absolute", top: 28, right: 28,
          display: "flex", alignItems: "center", gap: 10, zIndex: 10,
        }}>
          <div style={{ position: "relative", width: 32, height: 32 }}>
            <Image src="/assets/brand-logos/toggle-logo.png" alt="ZeroForm" fill style={{ objectFit: "contain" }} />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "0.02em" }}>ZeroForm</span>
        </div>

        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", top: 80, right: -120, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -100, left: -80, width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem", position: "relative", zIndex: 2 }}>

          {/* SVG Illustration */}
          <div style={{ marginBottom: "2.5rem" }}>
            <svg viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 400 }}>
              <rect x="60" y="120" width="300" height="140" rx="4" fill="rgba(255,255,255,0.15)" />
              <polygon points="50,120 210,50 370,120" fill="rgba(255,255,255,0.2)" />
              {[100,145,190,235,280,325].map((x,i) => (
                <rect key={i} x={x} y="120" width="16" height="140" rx="3" fill="rgba(255,255,255,0.12)" />
              ))}
              <rect x="173" y="190" width="54" height="70" rx="4" fill="rgba(255,255,255,0.25)" />
              <circle cx="220" cy="227" r="3" fill="rgba(255,255,255,0.6)" />
              {[100,155,255,310].map((x,i) => (
                <rect key={i} x={x} y="148" width="34" height="28" rx="3" fill="rgba(255,255,255,0.2)" />
              ))}
              <line x1="210" y1="50" x2="210" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <polygon points="210,14 236,22 210,30" fill="rgba(255,220,50,0.8)" />
              <rect x="40" y="258" width="340" height="10" rx="2" fill="rgba(255,255,255,0.18)" />
              <rect x="55" y="250" width="310" height="10" rx="2" fill="rgba(255,255,255,0.13)" />
              <rect x="16" y="220" width="6" height="40" fill="rgba(255,255,255,0.2)" />
              <ellipse cx="19" cy="210" rx="18" ry="22" fill="rgba(255,255,255,0.15)" />
              <rect x="398" y="220" width="6" height="40" fill="rgba(255,255,255,0.2)" />
              <ellipse cx="401" cy="210" rx="18" ry="22" fill="rgba(255,255,255,0.15)" />
              <rect x="8" y="70" width="90" height="46" rx="8" fill="rgba(255,255,255,0.18)" />
              <circle cx="26" cy="86" r="8" fill="rgba(255,255,255,0.35)" />
              <rect x="42" y="80" width="48" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
              <rect x="42" y="92" width="32" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
              <rect x="322" y="60" width="90" height="46" rx="8" fill="rgba(255,255,255,0.18)" />
              <circle cx="340" cy="76" r="8" fill="rgba(255,255,255,0.35)" />
              <rect x="355" y="70" width="48" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
              <rect x="355" y="82" width="32" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>

          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 28, lineHeight: 1.3, marginBottom: "1rem" }}>
            Welcome to<br />ZeroForm Campus
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7, marginBottom: "2rem", maxWidth: 320 }}>
            A modern platform for college admissions, student management, and fee collection — built for Indian higher education.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { icon: "ri-user-add-line",          label: "Admissions" },
              { icon: "ri-graduation-cap-line",     label: "Student SIS" },
              { icon: "ri-money-rupee-circle-line", label: "Fee Management" },
              { icon: "ri-bar-chart-2-line",        label: "Analytics" },
            ].map(f => (
              <div key={f.label} style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 20, padding: "6px 14px",
                color: "#fff", fontSize: 12, fontWeight: 600,
              }}>
                <i className={f.icon} style={{ fontSize: 14 }} />
                {f.label}
              </div>
            ))}
          </div>
        </div>

        <svg viewBox="0 0 500 60" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 60 }}>
          <path d="M0,30 C150,60 350,0 500,30 L500,60 L0,60 Z" fill="rgba(255,255,255,0.08)" />
        </svg>
      </div>

    </div>
  );
}
