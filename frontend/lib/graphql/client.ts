const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

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

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  sellerId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: {
    products: Product[];
    totalCount: number;
  };
}

export interface ProductResponse {
  product: Product;
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

// Products queries
export const productsQueries = {
  getProducts: `
    query GetProducts($limit: Int = 20, $offset: Int = 0) {
      products(limit: $limit, offset: $offset) {
        products {
          id
          title
          description
          price
          fileUrl
          fileName
          fileSize
          sellerId
          isPublished
          createdAt
          updatedAt
        }
        totalCount
      }
    }
  `,

  getProduct: `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
        price
        fileUrl
        fileName
        fileSize
        sellerId
        isPublished
        createdAt
        updatedAt
      }
    }
  `,

  getMyProducts: `
    query GetMyProducts {
      myProducts {
        id
        title
        description
        price
        fileUrl
        fileName
        fileSize
        sellerId
        isPublished
        createdAt
        updatedAt
      }
    }
  `,
};

// Products mutations
export const productsMutations = {
  createProduct: `
    mutation CreateProduct($input: CreateProductInput!) {
      createProduct(input: $input) {
        id
        title
        description
        price
        fileUrl
        fileName
        fileSize
        sellerId
        isPublished
        createdAt
        updatedAt
      }
    }
  `,

  updateProduct: `
    mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
      updateProduct(id: $id, input: $input) {
        id
        title
        description
        price
        fileUrl
        fileName
        fileSize
        sellerId
        isPublished
        createdAt
        updatedAt
      }
    }
  `,

  deleteProduct: `
    mutation DeleteProduct($id: ID!) {
      deleteProduct(id: $id)
    }
  `
};
