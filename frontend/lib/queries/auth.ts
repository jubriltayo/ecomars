export const AUTH_QUERIES = {
  GET_ME: `
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
} as const;

export const AUTH_MUTATIONS = {
  LOGIN: `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        user {
          id
          email
          name
          image
          role
        }
        token
        success
      }
    }
  `,

  REGISTER: `
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        user {
          id
          email
          name
          image
          role
        }
        token
        success
      }
    }
  `,

  LOGOUT: `
    mutation Logout {
      logout {
        success
      }
    }
  `,
} as const;
