"use client";

/**
 * ZeroForm Campus — Login Page
 *
 * Source: Vyzor theme · authentication/sign-in/cover
 *
 * AUTH INTEGRATION HOOK:
 * Replace the handleSubmit body with your real API call, e.g.:
 *
 *   const res = await fetch("/api/auth/login", {
 *     method: "POST",
 *     body: JSON.stringify({ email, password }),
 *   });
 *   if (res.ok) router.replace("/dashboard");
 *   else setErrors({ form: "Invalid credentials" });
 *
 * The form state (email, password) and validation are already wired up.
 * For NextAuth / Laravel Sanctum, swap the fetch call only — nothing else changes.
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

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e: typeof errors = {};
    if (!email)                          e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email  = "Invalid email format.";
    if (!password)                       e.password = "Password is required.";
    else if (password.length < 6)        e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  // TODO: Replace this block with real API call when auth system is ready
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // ── MOCK: bypass auth for now, go straight to dashboard ──────────────
      await new Promise(r => setTimeout(r, 600)); // simulate network
      router.replace("/dashboard");
      // ─────────────────────────────────────────────────────────────────────
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row authentication authentication-cover-main mx-0" style={{ minHeight: "100vh" }}>

      {/* ── Left panel: form ────────────────────────────────────────────── */}
      <div className="col-xxl-9 col-xl-9 col-12">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-6 col-sm-8 col-11">
            <div className="card custom-card border-0 shadow-none my-4">
              <div className="card-body p-5">

                {/* Logo */}
                <div className="mb-4" style={{ position: "relative", width: 120, height: 36 }}>
                  <Image
                    src="/assets/brand-logos/desktop-logo.png"
                    alt="ZeroForm Campus"
                    fill
                    style={{ objectFit: "contain", objectPosition: "left" }}
                  />
                </div>

                <div className="mb-4">
                  <h4 className="mb-1 fw-semibold">Hi, Welcome back!</h4>
                  <p className="mb-0 text-muted fw-normal fs-13">Sign in to ZeroForm Campus</p>
                </div>

                {/* Form-level error */}
                {errors.form && (
                  <div className="alert alert-danger py-2 fs-13 mb-3">{errors.form}</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="login-email" className="form-label text-default">Email</label>
                    <input
                      id="login-email"
                      type="email"
                      className={`form-control${errors.email ? " is-invalid" : ""}`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: undefined })); }}
                      autoComplete="email"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  {/* Password */}
                  <div className="mb-2">
                    <label htmlFor="login-password" className="form-label text-default d-block">
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
                      />
                      <button
                        type="button"
                        className="show-password-button text-muted bg-transparent border-0 p-0"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        <i className={showPassword ? "ri-eye-line align-middle" : "ri-eye-off-line align-middle"} />
                      </button>
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>

                  {/* Remember me + Forgot password */}
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                      <Link
                        href="#"
                        className="float-end link-danger fw-medium fs-12"
                        onClick={e => e.preventDefault()}
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="d-grid mt-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading
                        ? <><span className="spinner-border spinner-border-sm me-2" role="status" /> Signing in…</>
                        : "Sign In"
                      }
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: cover ───────────────────────────────────────────── */}
      <div className="col-xxl-3 col-xl-3 d-xl-block d-none px-0">
        <div className="authentication-cover overflow-hidden" style={{ position: "relative", height: "100%" }}>

          {/* Background */}
          <div className="authentication-cover-background">
            <Image
              src="/assets/media-bg-9.png"
              alt=""
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* Logo on cover */}
          <div className="authentication-cover-logo">
            <div style={{ position: "relative", width: 36, height: 36 }}>
              <Image
                src="/assets/brand-logos/toggle-logo.png"
                alt="ZeroForm"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Cover text */}
          <div className="authentication-cover-content">
            <div className="p-5">
              <h3 className="fw-semibold lh-base text-white">Welcome to<br />ZeroForm Campus</h3>
              <p className="mb-0 text-white-50 fw-medium fs-13">
                Simplifying admissions, student management and fee collection for Indian colleges.
              </p>
            </div>
            <div style={{ position: "relative", width: "100%", height: 260 }}>
              <Image
                src="/assets/media-72.png"
                alt=""
                fill
                style={{ objectFit: "contain", objectPosition: "bottom" }}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
