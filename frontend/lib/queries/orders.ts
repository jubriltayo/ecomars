export const ORDER_QUERIES = {
  GET_MY_ORDERS: `
    query GetMyOrders {
      myOrders {
        id
        totalAmount
        status
        createdAt
        items {
          id
          orderId
          productId
          price
          product {
            id
            title
            fileUrl
            fileName
          }
        }
      }
    }
  `,
} as const;

export const ORDER_MUTATIONS = {
  CREATE_ORDER: `
    mutation CreateOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        order {
          id
          totalAmount
          status
        }
        clientSecret
      }
    }
  `,

  DOWNLOAD_PRODUCT: `
    mutation DownloadProduct($productId: ID!, $orderId: ID!) {
      downloadProduct(productId: $productId, orderId: $orderId) {
        id
        downloadUrl
      }
    }
  `,
} as const;
