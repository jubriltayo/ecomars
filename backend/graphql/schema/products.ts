import { gql } from "graphql-tag";

export const productsTypeDefs = gql`
  type Product {
    id: ID!
    title: String!
    description: String
    price: Float!
    fileUrl: String
    fileName: String
    fileSize: Int
    sellerId: ID!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateProductInput {
    title: String!
    description: String
    price: Float!
  }

  input UpdateProductInput {
    title: String
    description: String
    price: Float
    isPublished: Boolean
    fileUrl: String
    fileName: String
    fileSize: Int
  }

  type ProductResponse {
    products: [Product!]!
    totalCount: Int!
  }

  extend type Query {
    products(limit: Int = 20, offset: Int = 0): ProductResponse
    product(id: ID!): Product
    myProducts: [Product!]!
  }

  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;
