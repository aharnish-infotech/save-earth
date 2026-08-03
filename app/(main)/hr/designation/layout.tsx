import { Metadata } from "next";
export const metadata: Metadata = { title: "Designations" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
