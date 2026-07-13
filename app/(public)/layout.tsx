// Public layout — no sidebar, no header, no auth required
// Used for student registration, public forms, etc.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
