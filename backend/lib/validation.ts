import { z } from "zod";

// Product validation
export const CreateProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  price: z.number().min(0.01).max(10000),
});

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  isPublished: z.boolean().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().int().positive().optional(),
});

// Upload validation
export const UploadFileSchema = z.object({
  productId: z.uuid(),
});

// Order validation
export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.uuid(),
        price: z.number().min(0.01),
      })
    )
    .min(1),
});

// Auth validation
export const RegisterSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(100),
  password: z.string().min(6),
});

// File validation
export const validateFile = (file: File) => {
  const ALLOWED_TYPES = [
    "application/pdf",
    "application/zip",
    "application/x-rar-compressed",
    "application/epub+zip",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
  ];

  const MAX_SIZE = 100 * 1024 * 1024; // 100MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type not allowed: ${file.type}`);
  }

  if (file.size > MAX_SIZE) {
    throw new Error(`File too large: ${Math.round(file.size / 1024 / 1024)}MB`);
  }

  return true;
};

// Types
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type UploadFileInput = z.infer<typeof UploadFileSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
