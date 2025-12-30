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

  useEffect(() => {
    const handleOAuthRedirect = () => {
      // Check URL params for token (from Google OAuth)
      const params = new URLSearchParams(window.location.search);
      let token = params.get("token");
      let loginSuccess = params.get("login");

      // Also check hash (more secure)
      if (!token) {
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        token = hashParams.get("token");
        loginSuccess = hashParams.get("login");
      }

      if (token && loginSuccess === "success") {
        localStorage.setItem("auth_token", token);

        // Clear the token from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);

        toast.success("Logged in successfully!");

        // Trigger a refetch
        return true;
      }
      return false;
    };

    const hasToken = handleOAuthRedirect();
    if (hasToken) {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      // Check if token exists
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const { data, errors } = await graphqlRequest<{ me: User }>(
        AUTH_QUERIES.GET_ME
      );

      if (errors) {
        throw new Error(errors[0]?.message || "Failed to fetch user");
      }

      setUser(data?.me || null);
    } catch (err: any) {
      console.error("Error fetching user:", err.message);
      setError(err.message || "Failed to fetch user");
      setUser(null);
      // Clear invalid token
      localStorage.removeItem("auth_token");
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
        login: { user: User; token: string; success: boolean };
      }>(AUTH_MUTATIONS.LOGIN, {
        input: { email, password },
      });

      if (errors || !data?.login.success) {
        throw new Error(errors?.[0]?.message || "Login failed");
      }

      localStorage.setItem("auth_token", data.login.token);

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
          register: { user: User; token: string; success: boolean };
        }>(AUTH_MUTATIONS.REGISTER, {
          input: { name, email, password },
        });

        if (errors || !data?.register.success) {
          throw new Error(errors?.[0]?.message || "Registration failed");
        }

        localStorage.setItem("auth_token", data.register.token);

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

      // Clear token from localStorage
      localStorage.removeItem("auth_token");

      setUser(null);
      toast.success("Logged out successfully!");
    } catch (err: any) {
      console.error("Logout error:", err);
      // Still clear token even if API call fails
      localStorage.removeItem("auth_token");
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
