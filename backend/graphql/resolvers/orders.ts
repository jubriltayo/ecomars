import { hasuraClient } from "@/lib/hasura";
import { GraphQLContext } from "@/types/context";
import { stripe } from "@/lib/stripe/config";
import { CreateOrderSchema } from "@/lib/validation";

interface OrderItemInput {
  productId: string;
  price: number;
}

interface OrderItemResponse {
  id: string;
  orderId: string;
  productId: string;
  price: number;
  productTitle?: string | null;
  productFileUrl?: string | null;
}

interface CreateOrderInput {
  items: OrderItemInput[];
}

export const ordersResolvers = {
  Query: {
    myOrders: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        const data = await hasuraClient.getOrdersByUser(context.user.id);

        // Get products for each order
        const ordersWithItems = await Promise.all(
          data.orders.map(async (order) => {
            const itemsData = await hasuraClient.getOrderItemsWithProduct(
              order.id
            );

            const items = itemsData.order_items.map((item) => ({
              id: item.id,
              orderId: item.order_id || "",
              productId: item.product_id || "",
              price: parseFloat(item.price as string),
              product: item.product
                ? {
                    id: item.product.id,
                    title: item.product.title,
                    fileUrl: item.product.file_url,
                    fileName: item.product.file_name,
                  }
                : null,
            }));

            return {
              id: order.id,
              customerId: order.customer_id,
              totalAmount: parseFloat(order.total_amount as string),
              status: order.status,
              stripePaymentIntentId: order.stripe_payment_intent_id,
              createdAt: order.created_at,
              items,
            };
          })
        );

        return ordersWithItems;
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
      }
    },

    order: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        const data = await hasuraClient.getOrderById(id);
        if (!data.orders_by_pk) {
          throw new Error("Order not found");
        }

        const order = data.orders_by_pk;

        // Verify order belongs to user
        if (order.customer_id !== context.user.id) {
          throw new Error("Not authorized");
        }

        // Get order items
        const itemsData = await hasuraClient.getOrderItemsWithProduct(order.id);

        const orderItems: OrderItemResponse[] = itemsData.order_items.map(
          (item) => ({
            id: item.id,
            orderId: item.order_id || "",
            productId: item.product_id || "",
            price: parseFloat(item.price as string),
            productTitle: item.product?.title || null,
            productFileUrl: item.product?.file_url || null,
          })
        );

        return {
          id: order.id,
          customerId: order.customer_id,
          totalAmount: parseFloat(order.total_amount as string),
          status: order.status,
          stripePaymentIntentId: order.stripe_payment_intent_id,
          createdAt: order.created_at,
          items: orderItems,
        };
      } catch (error) {
        console.error("Error fetching order:", error);
        throw new Error("Failed to fetch order");
      }
    },

    myDownloads: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        const data = await hasuraClient.getUserDownloads(context.user.id);

        return data.downloads.map((download) => ({
          id: download.id,
          userId: download.user_id,
          productId: download.product_id,
          orderId: download.order_id,
          downloadedAt: download.downloaded_at,
        }));
      } catch (error) {
        console.error("Error fetching downloads:", error);
        throw new Error("Failed to fetch downloads");
      }
    },
  },

  Mutation: {
    createOrder: async (
      _: unknown,
      { input }: { input: CreateOrderInput },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        // Validate input with Zod
        const validation = CreateOrderSchema.safeParse(input);
        if (!validation.success) {
          const errorMessage =
            validation.error.issues[0]?.message || "Validation failed";
          throw new Error(errorMessage);
        }

        const validatedInput = validation.data;

        // Calculate total amount
        const totalAmount = validatedInput.items.reduce(
          (sum, item) => sum + item.price,
          0
        );

        // Create order in database (pending status)
        const orderData = await hasuraClient.createOrder({
          customer_id: context.user.id,
          total_amount: totalAmount,
          status: "pending",
        });

        const order = orderData.insert_orders_one;

        // Create order items
        for (const item of validatedInput.items) {
          await hasuraClient.createOrderItem({
            order_id: order.id,
            product_id: item.productId,
            price: item.price,
          });
        }

        // Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100), // Convert to cents
          currency: "usd",
          metadata: {
            orderId: order.id,
            userId: context.user.id,
          },
        });

        // Update order with payment intent ID
        await hasuraClient.updateOrderStatus(
          order.id,
          "processing",
          paymentIntent.id
        );

        return {
          order: {
            id: order.id,
            customerId: order.customer_id,
            totalAmount: parseFloat(order.total_amount as string),
            status: "processing",
            stripePaymentIntentId: paymentIntent.id,
            createdAt: order.created_at,
            items: validatedInput.items.map((item) => ({
              productId: item.productId,
              price: item.price,
            })),
          },
          clientSecret: paymentIntent.client_secret,
        };
      } catch (error) {
        console.error("Error creating order:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to create order"
        );
      }
    },

    downloadProduct: async (
      _: unknown,
      { productId, orderId }: { productId: string; orderId: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        // Verify user owns the order and it's completed
        const orderData = await hasuraClient.getOrderById(orderId);
        if (!orderData.orders_by_pk) {
          throw new Error("Order not found");
        }

        const order = orderData.orders_by_pk;

        if (order.customer_id !== context.user.id) {
          throw new Error("Not authorized");
        }

        if (order.status !== "completed") {
          throw new Error("Order not completed");
        }

        // Create download record
        const downloadData = await hasuraClient.createDownload({
          user_id: context.user.id,
          product_id: productId,
          order_id: orderId,
        });

        const download = downloadData.insert_downloads_one;

        return {
          id: download.id,
          userId: download.user_id,
          productId: download.product_id,
          orderId: download.order_id,
          downloadedAt: download.downloaded_at,
          downloadUrl: `/api/download?productId=${productId}&orderId=${orderId}`,
        };
      } catch (error) {
        console.error("Error downloading product:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to download product"
        );
      }
    },
  },
};
