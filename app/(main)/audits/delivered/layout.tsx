import { Metadata } from "next";
export const metadata: Metadata = { title: "Delivered Audits" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
