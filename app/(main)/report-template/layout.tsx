import { Metadata } from "next";
export const metadata: Metadata = { title: "Report Template" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
