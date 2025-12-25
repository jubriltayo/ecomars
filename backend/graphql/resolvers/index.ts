import { authResolvers } from "./auth";
import { productsResolvers } from "./products";
import { ordersResolvers } from "./orders";

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...productsResolvers.Query,
    ...ordersResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...productsResolvers.Mutation,
    ...ordersResolvers.Mutation,
  },
};
