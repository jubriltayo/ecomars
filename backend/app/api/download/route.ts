import { NextRequest, NextResponse } from "next/server";
import { hasuraClient } from "@/lib/hasura";
import { verifySession } from "@/lib/session";
import { getCorsHeaders, createCorsResponse } from "@/lib/cors";

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return createCorsResponse(
    null,
    { status: 204 },
    request.headers.get("origin")
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const orderId = searchParams.get("orderId");

    if (!productId || !orderId) {
      const response = NextResponse.json(
        { error: "Missing productId or orderId" },
        { status: 400 }
      );

      // Add CORS headers
      const corsHeaders = getCorsHeaders(request.headers.get("origin"));
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    // Get Authorization header for JWT token
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      const response = NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );

      // Add CORS headers
      const corsHeaders = getCorsHeaders(request.headers.get("origin"));
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    // Extract and verify JWT token
    const token = authHeader.replace("Bearer ", "");

    const session = await verifySession(token);

    if (!session?.userId) {
      const response = NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );

      // Add CORS headers
      const corsHeaders = getCorsHeaders(request.headers.get("origin"));
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    const userId = session.userId;

    const downloadsData = await hasuraClient.getUserDownloads(userId);

    const hasDownloaded = downloadsData.downloads.some(
      (download) =>
        download.product_id === productId &&
        download.order_id === orderId &&
        download.user_id === userId
    );

    if (!hasDownloaded) {
      const response = NextResponse.json(
        { error: "Download not authorized" },
        { status: 403 }
      );

      // Add CORS headers
      const corsHeaders = getCorsHeaders(request.headers.get("origin"));
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    const productData = await hasuraClient.getProductById(productId);

    if (!productData.products_by_pk) {
      const response = NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );

      // Add CORS headers
      const corsHeaders = getCorsHeaders(request.headers.get("origin"));
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    const product = productData.products_by_pk;

    if (!product.file_url) {
      const response = NextResponse.json(
        { error: "File not available" },
        { status: 404 }
      );

      // Add CORS headers
      const corsHeaders = getCorsHeaders(request.headers.get("origin"));
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    // Create redirect response with CORS headers
    const response = NextResponse.redirect(product.file_url);

    // Add CORS headers to redirect
    const corsHeaders = getCorsHeaders(request.headers.get("origin"));
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Download error:", error);
    const response = NextResponse.json(
      { error: "Download failed" },
      { status: 500 }
    );

    // Add CORS headers
    const corsHeaders = getCorsHeaders(request.headers.get("origin"));
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }
}
