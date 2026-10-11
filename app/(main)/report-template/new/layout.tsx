import { Metadata } from "next";
export const metadata: Metadata = { title: "New Report Template" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
