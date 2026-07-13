// Auth layout — no sidebar, no header
// When real auth is wired up, add session checks here (redirect to /dashboard if already logged in)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
