import { NextRequest, NextResponse } from "next/server";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const REDIRECT_URI = `${BACKEND_URL}/api/auth/callback/google`;

export async function GET(request: NextRequest) {
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");

  return NextResponse.redirect(url.toString());
}
