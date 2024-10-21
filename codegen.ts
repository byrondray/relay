import type { CodegenConfig } from "@graphql-codegen/cli";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const isDev = process.env.EXPO_PUBLIC_IS_DEV === "true";

const httpUrl = isDev
  ? `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:4000/graphql`
  : `https://relay-api-ibel.onrender.com/graphql`;

console.log(httpUrl, "httpUrl");

const codegenConfig: CodegenConfig = {
  overwrite: true,
  schema: httpUrl,
  documents: "graphql/**/*.ts",
  generates: {
    "./graphql/generated.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default codegenConfig;
