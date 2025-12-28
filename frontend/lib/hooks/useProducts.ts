"use client";

import { useState, useEffect, useCallback } from "react";
import { graphqlRequest } from "@/lib/api/client";
import {
  PRODUCT_QUERIES,
  PRODUCT_MUTATIONS,
} from "@/lib/queries/products";
import { Product } from "@/lib/types";
import { toast } from "sonner";

export function useProducts(limit = 20, offset = 0) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await graphqlRequest<{
        products: {
          products: Product[];
          totalCount: number;
        };
      }>(PRODUCT_QUERIES.GET_PRODUCTS, { limit, offset });

      if (data?.products) {
        setProducts(data.products.products);
        setTotalCount(data.products.totalCount);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    totalCount,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data } = await graphqlRequest<{ product: Product }>(
        PRODUCT_QUERIES.GET_PRODUCT,
        { id }
      );

      setProduct(data?.product || null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch product");
      toast.error("Failed to load product");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}

export function useMyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await graphqlRequest<{ myProducts: Product[] }>(
        PRODUCT_QUERIES.GET_MY_PRODUCTS
      );

      setProducts(data?.myProducts || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch your products");
      toast.error("Failed to load your products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchMyProducts,
  };
}

export function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(
    async (input: { title: string; description: string; price: number }) => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, errors } = await graphqlRequest(
          PRODUCT_MUTATIONS.CREATE_PRODUCT,
          { input }
        );

        if (errors) {
          throw new Error(errors[0]?.message || "Failed to create product");
        }

        toast.success("Product created successfully!");
        return data?.createProduct;
      } catch (err: any) {
        setError(err.message || "Failed to create product");
        toast.error(err.message || "Failed to create product");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createProduct,
    isLoading,
    error,
  };
}

export function useUpdateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = useCallback(
    async (
      id: string,
      input: {
        title?: string;
        description?: string;
        price?: number;
        fileUrl?: string;
        fileName?: string;
        fileSize?: number;
      }
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, errors } = await graphqlRequest(
          PRODUCT_MUTATIONS.UPDATE_PRODUCT,
          { id, input }
        );

        if (errors) {
          throw new Error(errors[0]?.message || "Failed to update product");
        }

        toast.success("Product updated successfully!");
        return data?.updateProduct;
      } catch (err: any) {
        setError(err.message || "Failed to update product");
        toast.error(err.message || "Failed to update product");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    updateProduct,
    isLoading,
    error,
  };
}

export function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { errors } = await graphqlRequest(
        PRODUCT_MUTATIONS.DELETE_PRODUCT,
        { id }
      );

      if (errors) {
        throw new Error(errors[0]?.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully!");
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
      toast.error(err.message || "Failed to delete product");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteProduct,
    isLoading,
    error,
  };
}
