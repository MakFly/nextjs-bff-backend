/**
 * TanStack Query Client Factory
 *
 * Creates a QueryClient with optimized defaults for BFF architecture.
 * Uses stale-while-revalidate pattern for better UX.
 */

import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays fresh for 1 minute before background refetch
        staleTime: 60 * 1000,
        // Cache garbage collected after 5 minutes
        gcTime: 5 * 60 * 1000,
        // Single retry on failure
        retry: 1,
        // Disabled for BFF - we control data freshness via invalidation
        refetchOnWindowFocus: false,
        // Keep refetch on mount for data freshness
        refetchOnMount: true,
      },
      dehydrate: {
        // Include pending queries for SSR streaming support
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Get or create QueryClient
 *
 * Server: Always creates new client (to avoid cross-request pollution)
 * Browser: Reuses singleton client
 */
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  }

  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
