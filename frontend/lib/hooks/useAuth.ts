"use client";

import { useState, useEffect, useCallback } from "react";
import { graphqlRequest } from "@/lib/api/client";
import { AUTH_QUERIES, AUTH_MUTATIONS } from "@/lib/queries/auth";
import { User } from "@/lib/types";
import { toast } from "sonner";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await graphqlRequest<{ me: User }>(AUTH_QUERIES.GET_ME);

      setUser(data?.me || null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, errors } = await graphqlRequest<{
        login: { user: User; success: boolean };
      }>(AUTH_MUTATIONS.LOGIN, {
        input: { email, password },
      });

      if (errors || !data?.login.success) {
        throw new Error(errors?.[0]?.message || "Login failed");
      }

      setUser(data.login.user);
      toast.success("Logged in successfully!");
      return data.login.user;
    } catch (err: any) {
      setError(err.message || "Login failed");
      toast.error(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, errors } = await graphqlRequest<{
          register: { user: User; success: boolean };
        }>(AUTH_MUTATIONS.REGISTER, {
          input: { name, email, password },
        });

        if (errors || !data?.register.success) {
          throw new Error(errors?.[0]?.message || "Registration failed");
        }

        setUser(data.register.user);
        toast.success("Account created successfully!");
        return data.register.user;
      } catch (err: any) {
        setError(err.message || "Registration failed");
        toast.error(err.message || "Registration failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      await graphqlRequest(AUTH_MUTATIONS.LOGOUT);

      setUser(null);
      toast.success("Logged out successfully!");
    } catch (err: any) {
      console.error("Logout error:", err);
      // Still clear user even if API call fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    refetchUser: fetchCurrentUser,
  };
}
