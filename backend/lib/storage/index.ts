import { LocalStorage } from "./providers/local";
import { CloudinaryStorage } from "./providers/cloudinary";
import { StorageProvider, UploadResult } from "./types";

export type StorageType = "local" | "cloudinary";

export class StorageManager {
  private provider: StorageProvider;

  constructor(type: StorageType = "cloudinary") {
    switch (type) {
      case "local":
        this.provider = new LocalStorage();
        break;
      case "cloudinary":
        this.provider = new CloudinaryStorage();
        break;
      default:
        throw new Error(`Unsupported storage type: ${type}`);
    }
  }

  upload(
    file: File,
    folder: string,
    metadata?: Record<string, any>
  ): Promise<UploadResult> {
    return this.provider.upload(file, folder, metadata);
  }

  getDownloadUrl(key: string, fileName: string): Promise<string> {
    return this.provider.getDownloadUrl(key, fileName);
  }

  delete(key: string): Promise<void> {
    return this.provider.delete(key);
  }

  exists(key: string): Promise<boolean> {
    return this.provider.exists(key);
  }

  getProviderName(): string {
    return this.provider.name;
  }
}

const storageType = (process.env.STORAGE_PROVIDER ||
  "cloudinary") as StorageType;
export const storage = new StorageManager(storageType);
