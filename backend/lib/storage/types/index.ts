export interface UploadResult {
  url: string;
  key: string;
  fileName: string;
  fileSize: number;
  provider: "local" | "cloudinary" | "s3";
}

export interface StorageProvider {
  name: string;
  upload(
    file: File,
    folder: string,
    metadata?: Record<string, any>
  ): Promise<UploadResult>;
  getDownloadUrl(key: string, fileName: string): Promise<string>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}
