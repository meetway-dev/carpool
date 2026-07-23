import { getAuthenticatedUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function routeAuth() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}
