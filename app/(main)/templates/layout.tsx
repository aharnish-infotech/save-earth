import { Metadata } from "next";
export const metadata: Metadata = { title: "Audit Templates" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
