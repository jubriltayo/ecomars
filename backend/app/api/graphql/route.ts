import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import { createCorsResponse, getCorsHeaders } from "@/lib/cors";
import { GraphQLContext } from "@/types/context";
import { getSession } from "@/lib/session";
import { handleAuthResponse, GraphQLAuthResponse } from "@/lib/auth-middleware";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(
  server,
  {
    context: async (req) => {
      const session = await getSession(req);
      return {
        user: session
          ? {
              id: session.userId,
              email: session.email,
              name: session.name,
            }
          : null,
        request: req,
      };
    },
  }
);

export async function OPTIONS(request: NextRequest) {
  return createCorsResponse(
    null,
    { status: 204 },
    request.headers.get("origin")
  );
}

export async function GET(request: NextRequest) {
  const response = await handler(request);
  const corsHeaders = getCorsHeaders(request.headers.get("origin"));

  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function POST(request: NextRequest) {
  // Handle GraphQL request
  const response = await handler(request);

  // Read response body (clone first to avoid consuming it)
  const clonedResponse = response.clone();
  const responseData = (await clonedResponse.json()) as GraphQLAuthResponse;

  // Start with existing headers from Apollo response
  const headers = new Headers(response.headers);

  // Add CORS headers
  const corsHeaders = getCorsHeaders(request.headers.get("origin"));
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  // Check if we need to set auth cookie
  let cookieHeader: string | null = null;

  if (responseData.data?.login?.user || responseData.data?.register?.user) {
    const user =
      responseData.data?.login?.user || responseData.data?.register?.user;
    if (user) {
      const { createSession, createSessionCookie } = await import(
        "@/lib/session"
      );
      const sessionToken = await createSession({
        userId: user.id,
        email: user.email,
        name: user.name,
      });
      cookieHeader = createSessionCookie(sessionToken);
    }
  } else if (responseData.data?.logout) {
    const { clearSessionCookie } = await import("@/lib/session");
    cookieHeader = clearSessionCookie();
  }

  // Set cookie header if we have one
  if (cookieHeader) {
    headers.set("Set-Cookie", cookieHeader);
  }

  // Return new response with all headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
