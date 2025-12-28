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

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
        return `${backendUrl}${data.downloadProduct.downloadUrl}`;
      } catch (err: any) {
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
