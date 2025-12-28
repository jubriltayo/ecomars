import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { StorageProvider, UploadResult } from "../types";

export class CloudinaryStorage implements StorageProvider {
  name = "cloudinary";

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
      secure: true,
    });
  }

  async upload(
    file: File,
    folder: string = "uploads",
    metadata?: Record<string, any>
  ): Promise<UploadResult> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    const result: UploadApiResponse = await cloudinary.uploader.upload(
      base64String,
      {
        upload_preset: "ecomars-public",
        folder,
        resource_type: "auto",
      }
    );

    console.log("Upload result:", {
      url: result.secure_url,
      public_id: result.public_id,
      original_filename: result.original_filename,
    });

    return {
      url: result.secure_url,
      key: result.public_id,
      fileName: file.name,
      fileSize: result.bytes,
      provider: "cloudinary",
    };
  }

  async getDownloadUrl(key: string, fileName: string): Promise<string> {
    return cloudinary.url(key, {
      secure: true,
      resource_type: "raw",
      type: "upload",
    });
  }

  async delete(key: string): Promise<void> {
    await cloudinary.uploader.destroy(key, {
      resource_type: "auto",
      type: "upload",
    });
  }

  async exists(key: string): Promise<boolean> {
    try {
      await cloudinary.api.resource(key, {
        resource_type: "auto",
        type: "upload",
      });
      return true;
    } catch (error: any) {
      if (error.http_code === 404) return false;
      throw error;
    }
  }
}
