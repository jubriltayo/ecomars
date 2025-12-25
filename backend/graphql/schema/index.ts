import { gql } from "graphql-tag";
import { authTypeDefs } from "./auth";
import { productsTypeDefs } from "./products";
import { ordersTypeDefs } from "./orders";

const baseTypeDefs = gql`
  scalar Date

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
  baseTypeDefs,
  authTypeDefs,
  productsTypeDefs,
  ordersTypeDefs,
];
