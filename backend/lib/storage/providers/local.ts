import { writeFile, readFile, unlink, stat, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { StorageProvider, UploadResult } from "../types";

export class LocalStorage implements StorageProvider {
  name = "local";
  private baseDir: string;

  constructor(baseDir: string = "public/uploads") {
    this.baseDir = join(process.cwd(), baseDir);
  }

  async upload(
    file: File,
    folder: string = "uploads",
    metadata?: Record<string, any>
  ): Promise<UploadResult> {
    const targetDir = join(this.baseDir, folder);
    await mkdir(targetDir, { recursive: true });

    const extension = file.name.split(".").pop() || "bin";
    const uniqueName = `${uuidv4()}.${extension}`;
    const filePath = join(targetDir, uniqueName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${folder}/${uniqueName}`;

    return {
      url: fileUrl,
      key: `${folder}/${uniqueName}`,
      fileName: file.name,
      fileSize: file.size,
      provider: "local",
    };
  }

  async getDownloadUrl(key: string, fileName: string): Promise<string> {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    return `${backendUrl}/${key}`;
  }

  async delete(key: string): Promise<void> {
    const filePath = join(this.baseDir, key);
    await unlink(filePath).catch(() => {});
  }

  async exists(key: string): Promise<boolean> {
    try {
      const filePath = join(this.baseDir, key);
      await stat(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
