import { redirect } from "next/navigation";

// Root → Login
// When real auth is added, check session here first:
//   if (session) redirect("/dashboard"); else redirect("/login");
export default function RootPage() {
  redirect("/login");
}
