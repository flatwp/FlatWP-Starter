import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { registerApolloClient } from '@apollo/client-react-streaming';

/**
 * Create Apollo Client for WordPress GraphQL queries
 * Configured for server components and ISR
 */
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
      // No global cache directive - let individual queries control caching via context
    }),
  });
});

/**
 * Client-side Apollo Client instance
 * Use this in client components
 */
export function getClientSideClient() {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    cache: new InMemoryCache(),
  });
}
