"use client";

import { useState, useEffect, useCallback } from "react";
import { graphqlRequest } from "@/lib/api/client";
import { ORDER_QUERIES, ORDER_MUTATIONS } from "@/lib/queries/orders";
import { Order } from "@/lib/types";
import { toast } from "sonner";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, errors } = await graphqlRequest<{ myOrders: Order[] }>(
        ORDER_QUERIES.GET_MY_ORDERS
      );

      if (errors) {
        throw new Error(errors[0]?.message || "Failed to fetch orders");
      }

      setOrders(data?.myOrders || []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
      toast.error("Failed to load your purchases");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(
    async (items: { productId: string; price: number }[]) => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, errors } = await graphqlRequest<{
          createOrder: {
            order: {
              id: string;
              totalAmount: number;
              status: string;
            };
            clientSecret: string;
          };
        }>(ORDER_MUTATIONS.CREATE_ORDER, {
          input: { items },
        });

        if (errors || !data?.createOrder) {
          throw new Error(errors?.[0]?.message || "Failed to create order");
        }

        return data.createOrder;
      } catch (err: any) {
        setError(err.message || "Failed to create order");
        toast.error(err.message || "Failed to create order");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const downloadProduct = useCallback(
    async (productId: string, orderId: string) => {
      try {
        const { data, errors } = await graphqlRequest<{
          downloadProduct: {
            id: string;
            downloadUrl: string;
          };
        }>(ORDER_MUTATIONS.DOWNLOAD_PRODUCT, {
          productId,
          orderId,
        });

        if (errors || !data?.downloadProduct) {
          throw new Error(errors?.[0]?.message || "Download failed");
        }

        const downloadPath = data.downloadProduct.downloadUrl;
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
        const downloadApiUrl = `${backendUrl}${downloadPath}`;

        // Call the REST API with Authorization header
        const token = localStorage.getItem("auth_token");
        console.log("Token exists:", !!token);

        if (!token) {
          toast.error("Please login to download");
          throw new Error("Not authenticated");
        }

        const response = await fetch(downloadApiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.log("REST API error response:", errorText);
          if (response.status === 401) {
            toast.error("Session expired. Please login again.");
            throw new Error("Session expired");
          }
          if (response.status === 403) {
            toast.error("You don't have permission to download this product.");
            throw new Error("No permission");
          }
          throw new Error("Download failed");
        }

        // Get the Cloudinary URL from the redirect
        const cloudinaryUrl = response.url;

        return cloudinaryUrl;
      } catch (err: any) {
        console.error("Download error details:", err);
        console.error("Error stack:", err.stack);
        toast.error(err.message || "Failed to download");
        throw err;
      }
    },
    []
  );

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    downloadProduct,
  };
}
