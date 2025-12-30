import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  [key: string]: string;
}

// Create JWT session token
export async function createSession(data: SessionData): Promise<string> {
  const token = await new SignJWT({
    userId: data.userId,
    email: data.email,
    name: data.name || data.email,
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
