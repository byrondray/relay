import type { CodegenConfig } from '@graphql-codegen/cli';

const isDev = process.env.EXPO_PUBLIC_IS_DEV === 'true';

const httpUrl = isDev
  ? `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:4000/graphql`
  : `${process.env.EXPO_PUBLIC_API_URL}/graphql`;

const config: CodegenConfig = {
  overwrite: true,
  schema: httpUrl,
  documents: 'graphql/**/*.ts', 
  generates: {
    './graphql/generated.ts': {
      plugins: [
        'typescript', 
        'typescript-operations', 
      ],
    },
    './graphql.schema.json': {
      plugins: ['introspection'], 
    },
  },
};

export default config;
