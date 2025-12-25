import {
  GET_USER_BY_EMAIL,
  GET_USER_BY_ID,
  GET_USER_FOR_AUTH,
  GET_USER_BY_ACCOUNT,
  GET_PRODUCTS,
  GET_PRODUCT_BY_ID,
  GET_ORDERS_BY_USER,
  GET_ORDER_BY_ID,
  GET_ORDER_ITEMS_WITH_PRODUCT,
  CREATE_USER,
  CREATE_ACCOUNT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCT_WITH_OWNER,
  CREATE_ORDER,
  CREATE_ORDER_ITEM,
  UPDATE_ORDER_STATUS,
  CREATE_DOWNLOAD,
  GET_USER_DOWNLOADS,
} from "./queries";

import {
  Users,
  Products,
  Orders,
  Downloads,
  Order_Items,
  Products_Bool_Exp,
  Users_Insert_Input,
  Products_Insert_Input,
  Products_Set_Input,
  Orders_Insert_Input,
  Order_Items_Insert_Input,
  Downloads_Insert_Input,
} from "@/types/hasura";

interface HasuraError {
  message: string;
  extensions?: {
    path: string;
    code: string;
  };
}

interface HasuraResponse<T> {
  data?: T;
  errors?: HasuraError[];
}

class HasuraClient {
  private endpoint: string;
  private adminSecret: string;

  constructor() {
    this.endpoint = process.env.HASURA_GRAPHQL_URL!;
    this.adminSecret = process.env.HASURA_ADMIN_SECRET!;

    if (!this.endpoint || !this.adminSecret) {
      throw new Error("Missing Hasura configuration");
    }
  }

  async execute<T>(
    query: string,
    variables: Record<string, unknown> = {}
  ): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Hasura-Admin-Secret": this.adminSecret,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: HasuraResponse<T> = await response.json();

      if (result.errors?.length) {
        throw new Error(`Hasura error: ${result.errors[0].message}`);
      }

      if (!result.data) {
        throw new Error("No data returned from Hasura");
      }

      return result.data;
    } catch (error) {
      console.error("Hasura request failed:", error);
      throw error;
    }
  }

  // User methods
  async getUserByEmail(email: string) {
    return this.execute<{ users: Users[] }>(GET_USER_BY_EMAIL, { email });
  }

  async getUserById(id: string) {
    return this.execute<{ users_by_pk: Users | null }>(GET_USER_BY_ID, { id });
  }

  async createUser(object: Users_Insert_Input) {
    return this.execute<{ insert_users_one: Users }>(CREATE_USER, { object });
  }

  // NextAuth specific methods
  async getUserForAuth(email: string) {
    return this.execute<{
      users: Array<{
        id: string;
        email: string;
        name: string | null;
        image: string | null;
        email_verified: string | null;
        password: string | null;
        created_at: string;
        updated_at: string;
      }>;
    }>(GET_USER_FOR_AUTH, { email });
  }

  async getUserByAccount(provider: string, providerAccountId: string) {
    return this.execute<{
      accounts: Array<{
        user: {
          id: string;
          email: string;
          name: string | null;
          image: string | null;
          email_verified: string | null;
        };
      }>;
    }>(GET_USER_BY_ACCOUNT, {
      provider,
      provider_account_id: providerAccountId,
    });
  }

  async createAccount(object: {
    user_id: string;
    type: string;
    provider: string;
    provider_account_id: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
  }) {
    return this.execute<{ insert_accounts_one: { id: string } }>(
      CREATE_ACCOUNT,
      { object }
    );
  }

  // Product methods
  async getProducts(
    variables: {
      where?: Products_Bool_Exp;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    return this.execute<{ products: Products[] }>(GET_PRODUCTS, variables);
  }

  async getProductById(id: string) {
    return this.execute<{ products_by_pk: Products | null }>(
      GET_PRODUCT_BY_ID,
      { id }
    );
  }

  async createProduct(object: Products_Insert_Input) {
    return this.execute<{ insert_products_one: Products }>(CREATE_PRODUCT, {
      object,
    });
  }

  async updateProduct(id: string, changes: Products_Set_Input) {
    return this.execute<{ update_products_by_pk: Products | null }>(
      UPDATE_PRODUCT,
      { id, changes }
    );
  }

  async deleteProduct(id: string) {
    return this.execute<{ delete_products_by_pk: { id: string } | null }>(
      DELETE_PRODUCT,
      { id }
    );
  }

  async getProductWithOwner(id: string) {
    return this.execute<{
      products_by_pk: {
        id: string;
        seller_id: string;
        file_url: string | null;
      } | null;
    }>(GET_PRODUCT_WITH_OWNER, { id });
  }

  // Order methods
  async getOrdersByUser(customer_id: string) {
    return this.execute<{ orders: Orders[] }>(GET_ORDERS_BY_USER, {
      customer_id,
    });
  }

  async getOrderById(id: string) {
    return this.execute<{ orders_by_pk: Orders | null }>(GET_ORDER_BY_ID, {
      id,
    });
  }

  async createOrder(object: Orders_Insert_Input) {
    return this.execute<{ insert_orders_one: Orders }>(CREATE_ORDER, {
      object,
    });
  }

  async updateOrderStatus(
    id: string,
    status: string,
    paymentIntentId?: string
  ) {
    return this.execute<{ update_orders_by_pk: Orders | null }>(
      UPDATE_ORDER_STATUS,
      { id, status, payment_intent_id: paymentIntentId }
    );
  }

  // Order item methods
  async createOrderItem(object: Order_Items_Insert_Input) {
    return this.execute<{ insert_order_items_one: Order_Items }>(
      CREATE_ORDER_ITEM,
      {
        object,
      }
    );
  }

  async getOrderItemsWithProduct(order_id: string) {
    return this.execute<{
      order_items: Array<
        Order_Items & {
          product?: {
            id: string;
            title: string;
            file_url: string | null;
            file_name: string | null;
          };
        }
      >;
    }>(GET_ORDER_ITEMS_WITH_PRODUCT, {
      order_id,
    });
  }

  // Download methods
  async createDownload(object: Downloads_Insert_Input) {
    return this.execute<{ insert_downloads_one: Downloads }>(CREATE_DOWNLOAD, {
      object,
    });
  }

  async getUserDownloads(user_id: string) {
    return this.execute<{ downloads: Downloads[] }>(GET_USER_DOWNLOADS, {
      user_id,
    });
  }
}

export const hasuraClient = new HasuraClient();
