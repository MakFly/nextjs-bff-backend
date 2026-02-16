/**
 * Server Actions for permission management (RBAC)
 *
 * These actions use the BFF to communicate with the Laravel API.
 * All routes require admin role.
 */

'use server';

import type { Permission } from '@rbac/types';
import { bffGet } from '../_shared/bff-client';

/**
 * Get list of all permissions
 */
export async function getPermissionsAction(): Promise<Permission[]> {
  const response = await bffGet<{ data: Permission[] }>('/api/v1/admin/permissions');
  return response.data;
}
