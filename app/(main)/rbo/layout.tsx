import { Metadata } from "next";
export const metadata: Metadata = { title: "Regional Banking Offices" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
