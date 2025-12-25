import { hasuraClient } from "@/lib/hasura";
import { GraphQLContext } from "@/types/context";
import { Users_Insert_Input } from "@/types/hasura";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/validation";

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) return null;

      const data = await hasuraClient.getUserById(context.user.id);
      if (!data.users_by_pk) return null;

      return {
        id: data.users_by_pk.id,
        email: data.users_by_pk.email,
        name: data.users_by_pk.name,
        image: data.users_by_pk.image,
        role: data.users_by_pk.role || "customer",
        createdAt: data.users_by_pk.created_at,
        updatedAt: data.users_by_pk.updated_at,
      };
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      { input }: { input: { email: string; name: string; password: string } }
    ) => {
      try {
        // Validate input with Zod
        const validation = RegisterSchema.safeParse(input);
        if (!validation.success) {
          const errorMessage =
            validation.error.issues[0]?.message || "Validation failed";
          throw new Error(errorMessage);
        }

        const validatedInput = validation.data;

        // Check if user exists
        const existingUser = await hasuraClient.getUserByEmail(
          validatedInput.email
        );

        if (existingUser.users.length > 0) {
          throw new Error("User already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 12);

        // Create user
        const userInput: Users_Insert_Input = {
          email: input.email,
          name: input.name,
          password: hashedPassword,
          role: "customer",
          image: null,
        };

        const data = await hasuraClient.createUser(userInput);

        const user = data.insert_users_one;

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role || "customer",
            createdAt: user.created_at,
            updatedAt: user.updated_at,
          },
          success: true,
        };
      } catch (error) {
        console.error("Registration error:", error);
        throw new Error(
          error instanceof Error ? error.message : "Registration failed"
        );
      }
    },

    login: async (
      _: unknown,
      { input }: { input: { email: string; password: string } },
      context: GraphQLContext
    ) => {
      try {
        const { email, password } = input;

        // Get user with password
        const data = await hasuraClient.getUserByEmail(email);

        if (data.users.length === 0) {
          throw new Error("Invalid email or password");
        }

        const user = data.users[0];

        // Verify password
        if (!user.password) {
          throw new Error("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        // Set user in context (session handling to be done in GraphQL route)
        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role || "customer",
            createdAt: user.created_at,
            updatedAt: user.updated_at,
          },
          success: true,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw new Error(
          error instanceof Error ? error.message : "Login failed"
        );
      }
    },

    logout: async (_: unknown, __: unknown, context: GraphQLContext) => {
      // Session will be cleared in the GraphQL route
      return { success: true };
    },
  },
};
