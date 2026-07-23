import { createSessionToken, getSessionCookieValue } from "@/lib/auth";
import { createOrUpdateGoogleUser } from "@/services/user.service";
import { NextResponse, type NextRequest } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

function buildAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID ?? "",
    response_type: "code",
    scope: "openid email profile",
    redirect_uri: REDIRECT_URI ?? "",
    state,
    access_type: "offline",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function fetchToken(code: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID ?? "",
      client_secret: GOOGLE_CLIENT_SECRET ?? "",
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI ?? "",
    }),
  });
  return res.json();
}

async function fetchUserInfo(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code) {
    const url = buildAuthUrl("google-login");
    return NextResponse.redirect(url);
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !REDIRECT_URI) {
    return NextResponse.json({ error: "Google auth is not configured." }, { status: 500 });
  }

  try {
    const tokenResponse = await fetchToken(code);
    const accessToken = tokenResponse.access_token as string | undefined;
    if (!accessToken) {
      console.error("Google token response", tokenResponse);
      return NextResponse.json({ error: "Failed to sign in with Google." }, { status: 500 });
    }

    const userInfo = await fetchUserInfo(accessToken);
    if (!userInfo.sub || !userInfo.email) {
      console.error("Google userinfo response", userInfo);
      return NextResponse.json({ error: "Failed to retrieve Google profile." }, { status: 500 });
    }

    const user = await createOrUpdateGoogleUser({
      googleId: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
    });

    const userId = String((user as any)._id ?? (user as any).id);
    const token = createSessionToken(userId);
    return NextResponse.redirect("/", {
      headers: { "Set-Cookie": getSessionCookieValue(token) },
    });
  } catch (error) {
    console.error("Google auth failed:", error);
    return NextResponse.json({ error: "Google login failed." }, { status: 500 });
  }
}
