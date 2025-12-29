const BACKEND_URL = ""

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
}

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, any>;
}

export async function graphqlRequest<T = any>(
  query: string,
  variables?: Record<string, any>,
  options?: {
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
  }
): Promise<GraphQLResponse<T>> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: options?.credentials || "include",
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(result.errors[0].message);
    }

    return result;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
}
