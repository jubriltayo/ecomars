import { NextRequest } from "next/server";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface GraphQLContext {
  user: User | null;
  request?: NextRequest;
}
