export interface CorsConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

const config: CorsConfig = {
  allowedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
  allowedMethods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
};

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": config.allowedMethods.join(", "),
    "Access-Control-Allow-Headers": config.allowedHeaders.join(", "),
  };

  if (origin && config.allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    if (config.credentials) {
      headers["Access-Control-Allow-Credentials"] = "true";
    }
  } else {
    headers["Access-Control-Allow-Origin"] = config.allowedOrigins[0];
    if (config.credentials) {
      headers["Access-Control-Allow-Credentials"] = "true";
    }
  }

  return headers;
}

export function createCorsResponse(
  body: BodyInit | null,
  init: ResponseInit,
  origin: string | null
): Response {
  const corsHeaders = getCorsHeaders(origin);

  return new Response(body, {
    ...init,
    headers: {
      ...init.headers,
      ...corsHeaders,
    },
  });
}

export function addCorsHeaders(
  response: Response,
  origin: string | null
): Response {
  const corsHeaders = getCorsHeaders(origin);

  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export function withCors(req: Request, res: Response): Response {
  const origin =
    req.headers.get("origin") ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000";

  // Clone response to add headers
  const newHeaders = new Headers(res.headers);
  const corsHeaders = getCorsHeaders(origin);

  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: newHeaders,
  });
}