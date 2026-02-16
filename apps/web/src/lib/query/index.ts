/**
 * TanStack Query Setup - Public API
 *
 * IMPORTANT: TanStack Query est opt-in, pas global.
 * Voir .claude/rules/data-fetching-strategy.md pour la matrice de décision.
 *
 * Usage (pour les cas où TanStack Query est justifié) :
 *
 * 1. Wrapper une page avec WithQuery :
 * ```tsx
 * import { WithQuery } from '@/lib/query';
 *
 * export default function PostsPage() {
 *   return (
 *     <WithQuery>
 *       <PostsManager />
 *     </WithQuery>
 *   );
 * }
 * ```
 *
 * 2. Créer des hooks personnalisés dans le dossier features :
 * ```tsx
 * import { useQuery, useMutation } from '@tanstack/react-query';
 * import { queryKeys } from '@/lib/query';
 *
 * export function useMyFeatureData() {
 *   return useQuery({
 *     queryKey: queryKeys.custom('my-feature'),
 *     queryFn: fetchMyFeatureData,
 *   });
 * }
 * ```
 *
 * 3. Prefetch in server components (advanced):
 * ```tsx
 * import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
 * import { getQueryClient, queryKeys } from '@/lib/query';
 *
 * export default async function Page() {
 *   const queryClient = getQueryClient();
 *
 *   await queryClient.prefetchQuery({
 *     queryKey: queryKeys.custom('my-data'),
 *     queryFn: fetchData,
 *   });
 *
 *   return (
 *     <HydrationBoundary state={dehydrate(queryClient)}>
 *       <MyComponent />
 *     </HydrationBoundary>
 *   );
 * }
 * ```
 */

// Lazy wrapper (opt-in per page)
export { WithQuery } from './with-query';

// Provider (for advanced use cases)
export { QueryProvider } from './provider';

// Client factory (for SSR prefetching)
export { getQueryClient } from './client';

// Query keys (for manual cache operations)
export { queryKeys } from './keys';
