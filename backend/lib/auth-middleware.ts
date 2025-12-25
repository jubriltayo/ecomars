import { NextResponse } from "next/server";
import {
  createSession,
  createSessionCookie,
  clearSessionCookie,
} from "./session";

export interface GraphQLUser {
  id: string;
  email: string;
  name: string;
}

export interface GraphQLAuthResponse {
  data?: {
    login?: {
      user?: GraphQLUser;
      success?: boolean;
    };
    register?: {
      user?: GraphQLUser;
      success?: boolean;
    };
    logout?: {
      success?: boolean;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

export async function handleAuthResponse(response: NextResponse, body: GraphQLAuthResponse) {
  // Check if this was a login or register mutation
  if (body.data?.login?.user || body.data?.register?.user) {
    const user = body.data?.login?.user || body.data?.register?.user;

    if (user) {
      // Create session token
      const sessionToken = await createSession({
        userId: user.id,
        email: user.email,
        name: user.name,
      });
      
      // Set cookie
      response.headers.set("Set-Cookie", createSessionCookie(sessionToken));
    }
  }

  // Check if this was a logout mutation
  if (body.data?.logout) {
    // Clear cookie
    response.headers.set("Set-Cookie", clearSessionCookie());
  }

  return response;
}
