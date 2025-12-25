import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import { createCorsResponse, addCorsHeaders } from "@/lib/cors";
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
  return addCorsHeaders(response, request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  // Handle GraphQL request
  const response = await handler(request);

  // Parse response to check for auth mutations
  const responseData = (await response.json()) as GraphQLAuthResponse;

  // Create new response with auth handling
  const newResponse = NextResponse.json(responseData, {
    status: response.status,
  });

  // Handle auth cookies if needed
  await handleAuthResponse(newResponse, responseData);

  // Add CORS and return
  return addCorsHeaders(newResponse, request.headers.get("origin"));
}
