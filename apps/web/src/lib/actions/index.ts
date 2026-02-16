/**
 * Server Actions
 *
 * Centralized exports for all Server Actions organized by domain.
 *
 * Usage:
 * - Import from specific domains for better tree-shaking
 * - Use this index for convenience in small projects
 *
 * @example
 * ```typescript
 * // Preferred: Import from specific domain
 * import { loginAction } from '@/lib/actions/auth';
 * import { getUsersAction } from '@/lib/actions/rbac';
 *
 * // Alternative: Import from index
 * import { loginAction, getUsersAction } from '@/lib/actions';
 * ```
 */

// Re-export from domains (each has 'use server' in their action files)

// Auth domain
export * from './auth';

// RBAC domain
export * from './rbac';

// Demo domain
export * from './demo';

// Shared utilities (for advanced usage)
export {
  ActionError,
  AuthActionError,
  RbacActionError,
  BffActionError,
} from './_shared/errors';

export type {
  PaginatedResponse,
  ApiDataResponse,
  ActionResult,
} from './_shared/types';
