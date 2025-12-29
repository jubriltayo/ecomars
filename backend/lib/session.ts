import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  [key: string]: string;
}

function getCookieDomain(): string {
  return process.env.COOKIE_DOMAIN || "localhost";
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

// Create JWT session token
export async function createSession(data: SessionData): Promise<string> {
  const token = await new SignJWT({
    userId: data.userId,
    email: data.email,
    name: data.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // 30 days
    .sign(SECRET);

  return token;
}

// Verify JWT session token
export async function verifySession(
  token: string
): Promise<SessionData | null> {
  try {
    const verified = await jwtVerify(token, SECRET);
    const payload = verified.payload;

    // Validate payload has required fields
    if (
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string"
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Get session from request cookies
export async function getSession(
  request: NextRequest
): Promise<SessionData | null> {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

// Create session cookie string
export function createSessionCookie(token: string): string {
  const domain = getCookieDomain();
  const isLocalhost = domain === "localhost";
  const secure = isProduction() ? "; Secure" : "";
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  
  // Don't set Domain for localhost
  const domainAttr = isLocalhost ? "" : `; Domain=${domain}`;

  return `session=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${domainAttr}${secure}`;
}

// Clear session cookie string
export function clearSessionCookie(): string {
  const domain = getCookieDomain();
  const isLocalhost = domain === "localhost";
  
  // Don't set Domain for localhost
  const domainAttr = isLocalhost ? "" : `; Domain=${domain}`;

  return `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${domainAttr}`;
}