import { gql } from "graphql-tag";

export const authTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
    image: String
    role: String
    createdAt: String!
    updatedAt: String!
    # Relationships (from Hasura)
    products: [Product!]!
    orders: [Order!]!
  }

  input RegisterInput {
    email: String!
    name: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    user: User!
    token: String!
    success: Boolean!
  }

  type LogoutPayload {
    success: Boolean!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: LogoutPayload!
  }
`;
