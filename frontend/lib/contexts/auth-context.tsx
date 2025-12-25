"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // CRITICAL: Send cookies
        body: JSON.stringify({
          query: `
            query Me {
              me {
                id
                email
                name
                image
                role
              }
            }
          `,
        }),
      });

      const data = await response.json();

      if (data.data?.me) {
        setUser(data.data.me);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // CRITICAL: Send/receive cookies
        body: JSON.stringify({
          operationName: "Login",
          query: `
            mutation Login($input: LoginInput!) {
              login(input: $input) {
                user {
                  id
                  email
                  name
                  image
                  role
                }
                success
              }
            }
          `,
          variables: { input: { email, password } },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Update user state
      setUser(result.data.login.user);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // CRITICAL: Send/receive cookies
        body: JSON.stringify({
          operationName: "Register",
          query: `
            mutation Register($input: RegisterInput!) {
              register(input: $input) {
                user {
                  id
                  email
                  name
                  image
                  role
                }
                success
              }
            }
          `,
          variables: { input: { name, email, password } },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Update user state (auto-login after register)
      setUser(result.data.register.user);
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // CRITICAL: Clear cookies
        body: JSON.stringify({
          operationName: "Logout",
          query: `
            mutation Logout {
              logout {
                success
              }
            }
          `,
        }),
      });

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Clear user anyway
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
