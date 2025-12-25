// backend/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { stat } from "fs/promises";
import { hasuraClient } from "@/lib/hasura";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const orderId = searchParams.get("orderId");

    if (!productId || !orderId) {
      return NextResponse.json(
        { error: "Missing productId or orderId" },
        { status: 400 }
      );
    }

    // 🔐 Get user from session (like in GraphQL resolvers)
    const session = await getSession(request);
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.userId;

    // 1. Verify user has downloaded this product
    const downloadsData = await hasuraClient.getUserDownloads(userId);
    const hasDownloaded = downloadsData.downloads.some(
      (download) =>
        download.product_id === productId &&
        download.order_id === orderId &&
        download.user_id === userId
    );

    if (!hasDownloaded) {
      return NextResponse.json(
        { error: "Download not authorized" },
        { status: 403 }
      );
    }

    // 2. Get product file info
    const productData = await hasuraClient.getProductById(productId);
    if (!productData.products_by_pk) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = productData.products_by_pk;
    const fileName = product.file_url?.split("/").pop();

    if (!fileName || !product.file_url) {
      return NextResponse.json(
        { error: "File not available" },
        { status: 404 }
      );
    }

    // 3. Serve file
    const filePath = join(process.cwd(), "public", "uploads", fileName);

    try {
      await stat(filePath);
    } catch {
      return NextResponse.json(
        { error: "File not found on server" },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    const contentTypeMap: Record<string, string> = {
      pdf: "application/pdf",
      zip: "application/zip",
      rar: "application/x-rar-compressed",
      epub: "application/epub+zip",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      txt: "text/plain",
    };

    const contentType = contentTypeMap[extension] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
