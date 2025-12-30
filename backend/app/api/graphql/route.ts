import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import { createCorsResponse, getCorsHeaders } from "@/lib/cors";
import { GraphQLContext } from "@/types/context";
import { verifySession } from "@/lib/session";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(
  server,
  {
    context: async (req) => {
      const authHeader = req.headers.get("authorization");
      const token = authHeader?.replace("Bearer ", "");

      let user = null;
      if (token) {
        const session = await verifySession(token);
        if (session) {
          user = {
            id: session.userId,
            email: session.email,
            name: session.name,
          };
        }
      }

      return {
        user,
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
  const response = await handler(request);

  const headers = new Headers(response.headers);
  const corsHeaders = getCorsHeaders(request.headers.get("origin"));

  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
