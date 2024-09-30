import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql', // Your GraphQL server URL
  documents: 'graphql/**/*.ts', // Path to your frontend GraphQL operations (queries/mutations)
  generates: {
    './graphql/generated.ts': {
      plugins: [
        'typescript', // Generates TypeScript types based on schema
        'typescript-operations', // Generates types for your GraphQL operations (queries/mutations)
      ],
    },
    './graphql.schema.json': {
      plugins: ['introspection'], // Generates the introspection result (which you've already received)
    },
  },
};

export default config;
