import dotenv from "dotenv";
import { generate } from "@graphql-codegen/cli";

dotenv.config({ path: ".env.local" });

await generate({
  schema: [
    {
      [`${process.env.HASURA_GRAPHQL_URL}`]: {
        headers: {
          "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET,
        },
      },
    },
  ],
  generates: {
    "./types/hasura.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        skipTypename: true,
        enumsAsTypes: true,
        defaultScalarType: "unknown",
        scalars: {
          uuid: "string",
          timestamptz: "string",
          date: "string",
        },
      },
    },
  },
  overwrite: true,
});
