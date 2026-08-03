import { Metadata } from "next";
export const metadata: Metadata = { title: "Zones" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
