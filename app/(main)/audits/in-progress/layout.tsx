import { Metadata } from "next";
export const metadata: Metadata = { title: "In Progress" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
