import { redirect, RedirectType } from "next/navigation";

export default function Stock() {
  redirect("/dashboard", RedirectType.replace);
}
