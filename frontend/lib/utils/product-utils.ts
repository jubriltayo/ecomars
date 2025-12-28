import { Product, ProductCardData } from "@/lib/types";

export function convertToProductCardData(
  products: Product[]
): ProductCardData[] {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description || "",
    price: product.price,
    fileUrl: product.fileUrl || undefined,
  }));
}

export function convertToProductCardDataSingle(
  product: Product
): ProductCardData {
  return {
    id: product.id,
    title: product.title,
    description: product.description || "",
    price: product.price,
    fileUrl: product.fileUrl || undefined,
  };
}
