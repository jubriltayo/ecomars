export const PRODUCT_QUERIES = {
  GET_PRODUCTS: `
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

  GET_PRODUCT: `
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

  GET_MY_PRODUCTS: `
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
} as const;

export const PRODUCT_MUTATIONS = {
  CREATE_PRODUCT: `
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

  UPDATE_PRODUCT: `
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

  DELETE_PRODUCT: `
    mutation DeleteProduct($id: ID!) {
      deleteProduct(id: $id)
    }
  `,
} as const;
