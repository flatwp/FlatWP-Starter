import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * GraphQL Code Generator Configuration
 *
 * Schema Source Priority:
 * 1. NEXT_PUBLIC_WORDPRESS_API_URL environment variable (live WordPress)
 * 2. Local schema.graphql file (fallback for development)
 *
 * To use live WordPress schema:
 * NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.flatwp.com/graphql npm run graphql:codegen
 */

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || './graphql/schema.graphql',
  documents: ['graphql/**/*.graphql', 'graphql/**/*.gql'],
  generates: {
    'lib/wordpress/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
