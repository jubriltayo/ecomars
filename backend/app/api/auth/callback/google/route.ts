import { NextRequest, NextResponse } from "next/server";
import { hasuraClient } from "@/lib/hasura";
import { createSession } from "@/lib/session";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const REDIRECT_URI = `${BACKEND_URL}/api/auth/callback/google`;

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }

  try {
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    const userResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();

    const accountResult = await hasuraClient.getUserByAccount(
      "google",
      googleUser.id
    );

    let userId: string;

    if (accountResult.accounts.length > 0) {
      userId = accountResult.accounts[0].user.id;
    } else {
      const emailResult = await hasuraClient.getUserByEmail(googleUser.email);

      if (emailResult.users.length > 0) {
        userId = emailResult.users[0].id;
      } else {
        const userResult = await hasuraClient.createUser({
          email: googleUser.email,
          name: googleUser.name || googleUser.email.split("@")[0],
          image: googleUser.picture || null,
          email_verified: new Date().toISOString(),
          password: null,
          role: "customer",
        });
        userId = userResult.insert_users_one.id;
      }

      await hasuraClient.createAccount({
        user_id: userId,
        type: "oauth",
        provider: "google",
        provider_account_id: googleUser.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_in
          ? Math.floor(Date.now() / 1000) + tokens.expires_in
          : undefined,
        token_type: tokens.token_type || "Bearer",
        scope: tokens.scope,
        id_token: tokens.id_token,
        session_state: undefined,
      });
    }

    const userData = await hasuraClient.getUserById(userId);
    const user = userData.users_by_pk!;

    // Create session token
    const sessionToken = await createSession({
      userId: user.id,
      email: user.email,
      name: user.name || user.email,
    });

    // Redirect with token in URL (frontend will store in localStorage)
    const redirectUrl = new URL(FRONTEND_URL);
    redirectUrl.hash = `token=${sessionToken}&login=success`;
    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
}
