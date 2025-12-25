import { gql } from "graphql-tag";

export const ordersTypeDefs = gql`
  type Order {
    id: ID!
    customerId: ID!
    totalAmount: Float!
    status: String!
    stripePaymentIntentId: String
    createdAt: String!
    items: [OrderItem!]!
  }

  type OrderItem {
    id: ID!
    orderId: ID!
    productId: ID!
    price: Float!
    product: Product
  }

  type Download {
    id: ID!
    userId: ID!
    productId: ID!
    orderId: ID!
    downloadedAt: String!
    downloadUrl: String! 
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
  }

  input OrderItemInput {
    productId: ID!
    price: Float!
  }

  type OrderResponse {
    order: Order!
    clientSecret: String! # For Stripe payment processing
  }

  extend type Query {
    myOrders: [Order!]!
    order(id: ID!): Order
    myDownloads: [Download!]!
  }

  extend type Mutation {
    createOrder(input: CreateOrderInput!): OrderResponse!
    completeOrder(paymentIntentId: String!): Order!
    downloadProduct(productId: ID!, orderId: ID!): Download!
  }
`;
