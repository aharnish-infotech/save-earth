import { Metadata } from "next";
export const metadata: Metadata = { title: "Completed Audits" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
