import { getUserFromSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("rc_session")?.value;
  if (!token) return null;
  return getUserFromSessionToken(token);
}
