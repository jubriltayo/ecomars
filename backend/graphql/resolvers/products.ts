import { join } from "path";
import { unlink } from "fs/promises";
import { hasuraClient } from "@/lib/hasura";
import { GraphQLContext } from "@/types/context";
import { Products_Set_Input } from "@/types/hasura";
import { CreateProductSchema, UpdateProductSchema } from "@/lib/validation";

interface ProductInput {
  title: string;
  description?: string;
  price: number;
}

interface UpdateProductInput {
  title?: string;
  description?: string;
  price?: number;
  isPublished?: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export const productsResolvers = {
  Query: {
    products: async (
      _: unknown,
      { limit = 20, offset = 0 }: { limit?: number; offset?: number }
    ) => {
      try {
        const data = await hasuraClient.getProducts({
          where: { is_published: { _eq: true } },
          limit,
          offset,
        });

        const products = data.products.map((product) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          price: parseFloat(product.price as string),
          fileUrl: product.file_url,
          fileName: product.file_name,
          fileSize: product.file_size,
          sellerId: product.seller_id,
          isPublished: product.is_published,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        }));

        return {
          products,
          totalCount: products.length,
        };
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }
    },

    product: async (_: unknown, { id }: { id: string }) => {
      try {
        const data = await hasuraClient.getProductById(id);
        if (!data.products_by_pk) {
          throw new Error("Product not found");
        }

        const product = data.products_by_pk;
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: parseFloat(product.price as string),
          fileUrl: product.file_url,
          fileName: product.file_name,
          fileSize: product.file_size,
          sellerId: product.seller_id,
          isPublished: product.is_published,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        };
      } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error("Failed to fetch product");
      }
    },

    myProducts: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        const data = await hasuraClient.getProducts({
          where: { seller_id: { _eq: context.user.id } },
        });

        return data.products.map((product) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          price: parseFloat(product.price as string),
          fileUrl: product.file_url,
          fileName: product.file_name,
          fileSize: product.file_size,
          sellerId: product.seller_id,
          isPublished: product.is_published,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        }));
      } catch (error) {
        console.error("Error fetching user products:", error);
        throw new Error("Failed to fetch your products");
      }
    },
  },

  Mutation: {
    createProduct: async (
      _: unknown,
      { input }: { input: ProductInput },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        // Validate input with Zod
        const validation = CreateProductSchema.safeParse(input);
        if (!validation.success) {
          const errorMessage =
            validation.error.issues[0]?.message || "Validation failed";
          throw new Error(errorMessage);
        }

        const validatedInput = validation.data;

        const data = await hasuraClient.createProduct({
          title: validatedInput.title,
          description: validatedInput.description,
          price: validatedInput.price,
          seller_id: context.user.id,
          is_published: true,
        });

        const product = data.insert_products_one;
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: parseFloat(product.price as string),
          fileUrl: product.file_url,
          fileName: product.file_name,
          fileSize: product.file_size,
          sellerId: product.seller_id,
          isPublished: product.is_published,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        };
      } catch (error) {
        console.error("Error creating product:", error);
        throw new Error("Failed to create product");
      }
    },

    updateProduct: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateProductInput },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        // Validate input with Zod
        const validation = UpdateProductSchema.safeParse(input);
        if (!validation.success) {
          const errorMessage =
            validation.error.issues[0]?.message || "Validation failed";
          throw new Error(errorMessage);
        }

        const validatedInput = validation.data;

        // Verify product ownership
        const productData = await hasuraClient.getProductWithOwner(id);
        if (!productData.products_by_pk) {
          throw new Error("Product not found");
        }

        if (productData.products_by_pk.seller_id !== context.user.id) {
          throw new Error("Not authorized to update this product");
        }

        // Prepare changes
        const changes: Products_Set_Input = {};
        if (validatedInput.title !== undefined)
          changes.title = validatedInput.title;
        if (validatedInput.description !== undefined)
          changes.description = validatedInput.description;
        if (validatedInput.price !== undefined)
          changes.price = validatedInput.price;
        if (validatedInput.isPublished !== undefined)
          changes.is_published = validatedInput.isPublished;
        if (validatedInput.fileUrl !== undefined)
          changes.file_url = validatedInput.fileUrl;
        if (validatedInput.fileName !== undefined)
          changes.file_name = validatedInput.fileName;
        if (validatedInput.fileSize !== undefined)
          changes.file_size = validatedInput.fileSize;

        // Update product
        const data = await hasuraClient.updateProduct(id, changes);
        if (!data.update_products_by_pk) {
          throw new Error("Failed to update product");
        }

        const product = data.update_products_by_pk;
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: parseFloat(product.price as string),
          fileUrl: product.file_url,
          fileName: product.file_name,
          fileSize: product.file_size,
          sellerId: product.seller_id,
          isPublished: product.is_published,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        };
      } catch (error) {
        console.error("Error updating product:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to update product"
        );
      }
    },

    deleteProduct: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        // 1. Verify product ownership AND get file info
        const productData = await hasuraClient.getProductWithOwner(id);
        if (!productData.products_by_pk) {
          throw new Error("Product not found");
        }

        if (productData.products_by_pk.seller_id !== context.user.id) {
          throw new Error("Not authorized to delete this product");
        }

        const fileUrl = productData.products_by_pk.file_url;

        // 2. Delete product from database
        const data = await hasuraClient.deleteProduct(id);
        if (!data.delete_products_by_pk) {
          throw new Error("Failed to delete product");
        }

        // 3. Delete the file if it exists
        if (fileUrl) {
          try {
            const fileName = fileUrl.split("/").pop();
            if (fileName) {
              const filePath = join(
                process.cwd(),
                "public",
                "uploads",
                fileName
              );
              await unlink(filePath);
              console.log(`Deleted file: ${filePath}`);
            }
          } catch (error) {
            console.warn("Could not delete file:", error);
            // Continue even if file deletion fails
          }
        }

        return true;
      } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to delete product"
        );
      }
    },
  },
};
