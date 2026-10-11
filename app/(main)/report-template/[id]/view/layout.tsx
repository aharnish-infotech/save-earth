import { Metadata } from "next";
export const metadata: Metadata = { title: "View Report Template" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
