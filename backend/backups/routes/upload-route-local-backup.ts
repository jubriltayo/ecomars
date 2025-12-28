import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { ZodError } from "zod";
import { hasuraClient } from "@/lib/hasura";
import { addCorsHeaders } from "@/lib/cors";
import { UploadFileSchema, validateFile } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;

    // Validate input with Zod
    try {
      UploadFileSchema.parse({ productId });
    } catch (error) {
      if (error instanceof ZodError) {
        const response = NextResponse.json(
          { error: error.issues[0]?.message || "Invalid product ID" },
          { status: 400 }
        );
        return addCorsHeaders(response, request.headers.get("origin"));
      }
      const response = NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
      return addCorsHeaders(response, request.headers.get("origin"));
    }

    // Validate file exists
    if (!file) {
      const response = NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
      return addCorsHeaders(response, request.headers.get("origin"));
    }

    // Validate file type and size
    try {
      validateFile(file);
    } catch (fileError) {
      const response = NextResponse.json(
        {
          error:
            fileError instanceof Error ? fileError.message : "Invalid file",
        },
        { status: 400 }
      );
      return addCorsHeaders(response, request.headers.get("origin"));
    }

    // Get current product to delete old file
    let oldFilePath: string | null = null;
    try {
      const productQuery = `
        query GetProductFile($id: uuid!) {
          products_by_pk(id: $id) {
            file_url
          }
        }
      `;

      const productResult = await hasuraClient.execute<{
        products_by_pk: { file_url: string | null } | null;
      }>(productQuery, { id: productId });

      if (productResult.products_by_pk?.file_url) {
        const oldFileName = productResult.products_by_pk.file_url
          .split("/")
          .pop();
        if (oldFileName) {
          oldFilePath = join(process.cwd(), "public", "uploads", oldFileName);
        }
      }
    } catch (error) {
      console.warn("Could not fetch old file info:", error);
    }

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "bin";
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Save new file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Delete old file if it exists
    if (oldFilePath) {
      try {
        await unlink(oldFilePath);
        console.log(`Deleted old file: ${oldFilePath}`);
      } catch (error) {
        console.warn("Could not delete old file:", error);
      }
    }

    // File URL for access
    const fileUrl = `/uploads/${fileName}`;

    // Update product in Hasura
    const updateQuery = `
      mutation UpdateProductFile($id: uuid!, $file_url: String!, $file_name: String!, $file_size: Int!) {
        update_products_by_pk(
          pk_columns: { id: $id }
          _set: { 
            file_url: $file_url,
            file_name: $file_name,
            file_size: $file_size
          }
        ) {
          id
          file_url
          file_name
          file_size
        }
      }
    `;

    await hasuraClient.execute(updateQuery, {
      id: productId,
      file_url: fileUrl,
      file_name: file.name,
      file_size: file.size,
    });

    // Return success response
    const response = NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      productId,
    });

    return addCorsHeaders(response, request.headers.get("origin"));
  } catch (error) {
    console.error("Upload error:", error);
    const response = NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
    return addCorsHeaders(response, request.headers.get("origin"));
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
