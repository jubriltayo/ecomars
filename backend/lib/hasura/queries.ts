// =====================
// FRAGMENTS
// =====================
const USER_CORE_FIELDS = `
  fragment UserCoreFields on users {
    id
    email
    name
    image
    role
    created_at
    updated_at
  }
`;

const USER_WITH_PASSWORD_FIELDS = `
  fragment UserWithPasswordFields on users {
    ...UserCoreFields
    password
  }
`;

const USER_FOR_AUTH_FIELDS = `
  fragment UserForAuthFields on users {
    id
    email
    name
    image
    email_verified
    password
    created_at
    updated_at
  }
`;

const USER_FOR_NEXTAUTH_FIELDS = `
  fragment UserForNextAuthFields on users {
    id
    email
    name
    image
    email_verified
  }
`;

const PRODUCT_CORE_FIELDS = `
  fragment ProductCoreFields on products {
    id
    title
    description
    price
    file_url
    file_name
    file_size
    seller_id
    is_published
    created_at
    updated_at
  }
`;

const ORDER_CORE_FIELDS = `
  fragment OrderCoreFields on orders {
    id
    customer_id
    total_amount
    status
    stripe_payment_intent_id
    created_at
  }
`;

const ORDER_ITEM_CORE_FIELDS = `
  fragment OrderItemCoreFields on order_items {
    id
    order_id
    product_id
    price
  }
`;

const ORDER_ITEM_WITH_PRODUCT_FIELDS = `
  fragment OrderItemWithProductFields on order_items {
    id
    order_id
    product_id
    price
    product {
      id
      title
      file_url
      file_name
    }
  }
`;

const DOWNLOAD_CORE_FIELDS = `
  fragment DownloadCoreFields on downloads {
    id
    user_id
    product_id
    order_id
    downloaded_at
  }
`;

// =====================
// USER QUERIES
// =====================
export const GET_USER_BY_EMAIL = `
  ${USER_CORE_FIELDS}  
  ${USER_WITH_PASSWORD_FIELDS}
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }, limit: 1) {
      ...UserWithPasswordFields
    }
  }
`;

export const GET_USER_BY_ID = `
  ${USER_CORE_FIELDS}
  query GetUserById($id: uuid!) {
    users_by_pk(id: $id) {
      ...UserCoreFields
    }
  }
`;

// =====================
// NEXT AUTH QUERIES
// =====================
export const GET_USER_FOR_AUTH = `
  ${USER_FOR_AUTH_FIELDS}
  query GetUserForAuth($email: String!) {
    users(where: { email: { _eq: $email } }, limit: 1) {
      ...UserForAuthFields
    }
  }
`;

export const GET_USER_BY_ACCOUNT = `
  ${USER_FOR_NEXTAUTH_FIELDS}
  query GetUserByAccount($provider: String!, $provider_account_id: String!) {
    accounts(
      where: {
        provider: { _eq: $provider }
        provider_account_id: { _eq: $provider_account_id }
      }
      limit: 1
    ) {
      user {
        ...UserForNextAuthFields
      }
    }
  }
`;

// =====================
// PRODUCT QUERIES
// =====================
export const GET_PRODUCTS = `
  ${PRODUCT_CORE_FIELDS}
  query GetProducts($where: products_bool_exp, $limit: Int, $offset: Int) {
    products(where: $where, limit: $limit, offset: $offset, order_by: { created_at: desc }) {
      ...ProductCoreFields
    }
  }
`;

export const GET_PRODUCT_BY_ID = `
  ${PRODUCT_CORE_FIELDS}
  query GetProductById($id: uuid!) {
    products_by_pk(id: $id) {
      ...ProductCoreFields
    }
  }
`;

export const GET_PRODUCT_WITH_OWNER = `
  query GetProductWithOwner($id: uuid!) {
    products_by_pk(id: $id) {
      id
      seller_id
      file_url
    }
  }
`;

export const GET_PRODUCTS_FOR_ORDER = `
  query GetProductsForOrder($order_id: uuid!) {
    order_items(where: { order_id: { _eq: $order_id } }) {
      id
      product_id
      price
      product {
        id
        title
        file_url
        file_name
      }
    }
  }
`;

// =====================
// ORDER QUERIES
// =====================
export const GET_ORDERS_BY_USER = `
  ${ORDER_CORE_FIELDS}
  query GetOrdersByUser($customer_id: uuid!) {
    orders(where: { customer_id: { _eq: $customer_id } }, order_by: { created_at: desc }) {
      ...OrderCoreFields
    }
  }
`;

export const GET_ORDER_BY_ID = `
  ${ORDER_CORE_FIELDS}
  query GetOrderById($id: uuid!) {
    orders_by_pk(id: $id) {
      ...OrderCoreFields
    }
  }
`;

// =====================
// ORDER ITEMS QUERIES
// =====================
export const GET_ORDER_ITEMS_WITH_PRODUCT = `
  ${ORDER_ITEM_WITH_PRODUCT_FIELDS}
  query GetOrderItemsWithProduct($order_id: uuid!) {
    order_items(where: { order_id: { _eq: $order_id } }) {
      ...OrderItemWithProductFields
    }
  }
`;

// =====================
// DOWNLOAD QUERIES
// =====================
export const GET_USER_DOWNLOADS = `
  ${DOWNLOAD_CORE_FIELDS}
  query GetUserDownloads($user_id: uuid!) {
    downloads(
      where: { user_id: { _eq: $user_id } }
      order_by: { downloaded_at: desc }
    ) {
      ...DownloadCoreFields
    }
  }
`;

// =====================
// MUTATIONS (USER)
// =====================
export const CREATE_USER = `
  ${USER_CORE_FIELDS}  
  ${USER_WITH_PASSWORD_FIELDS}
  mutation CreateUser($object: users_insert_input!) {
    insert_users_one(object: $object) {
      ...UserWithPasswordFields
    }
  }
`;

// =====================
// MUTATIONS (NEXT AUTH ACCOUNT)
// =====================
export const CREATE_ACCOUNT = `
  mutation CreateAccount($object: accounts_insert_input!) {
    insert_accounts_one(object: $object) {
      id
      user_id
      provider
      provider_account_id
    }
  }
`;

// =====================
// MUTATIONS (PRODUCT)
// =====================
export const CREATE_PRODUCT = `
  ${PRODUCT_CORE_FIELDS}
  mutation CreateProduct($object: products_insert_input!) {
    insert_products_one(object: $object) {
      ...ProductCoreFields
    }
  }
`;

export const UPDATE_PRODUCT = `
  ${PRODUCT_CORE_FIELDS}
  mutation UpdateProduct($id: uuid!, $changes: products_set_input!) {
    update_products_by_pk(pk_columns: { id: $id }, _set: $changes) {
      ...ProductCoreFields
    }
  }
`;

export const DELETE_PRODUCT = `
  mutation DeleteProduct($id: uuid!) {
    delete_products_by_pk(id: $id) {
      id
    }
  }
`;

// =====================
// MUTATIONS (ORDER)
// =====================
export const CREATE_ORDER = `
  ${ORDER_CORE_FIELDS}
  mutation CreateOrder($object: orders_insert_input!) {
    insert_orders_one(object: $object) {
      ...OrderCoreFields
    }
  }
`;

export const UPDATE_ORDER_STATUS = `
  ${ORDER_CORE_FIELDS}
  mutation UpdateOrderStatus($id: uuid!, $status: String!, $payment_intent_id: String) {
    update_orders_by_pk(
      pk_columns: { id: $id }
      _set: { status: $status, stripe_payment_intent_id: $payment_intent_id }
    ) {
      ...OrderCoreFields
    }
  }
`;

// =====================
// MUTATIONS (ORDER ITEMS)
// =====================
export const CREATE_ORDER_ITEM = `
  ${ORDER_ITEM_CORE_FIELDS}
  mutation CreateOrderItem($object: order_items_insert_input!) {
    insert_order_items_one(object: $object) {
      ...OrderItemCoreFields
    }
  }
`;

// =====================
// MUTATIONS (DOWNLOADS)
// =====================
export const CREATE_DOWNLOAD = `
  ${DOWNLOAD_CORE_FIELDS}
  mutation CreateDownload($object: downloads_insert_input!) {
    insert_downloads_one(object: $object) {
      ...DownloadCoreFields
    }
  }
`;
