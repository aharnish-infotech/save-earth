import { Metadata } from "next";
export const metadata: Metadata = { title: "Approved Audits" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
