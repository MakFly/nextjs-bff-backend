/**
 * Server Actions for user management (RBAC)
 *
 * These actions use the BFF to communicate with the Laravel API.
 * All routes require admin role.
 */

'use server';

import type { User, Role, Permission } from '@rbac/types';
import { bffGet, bffPost, bffDelete } from '../_shared/bff-client';

/**
 * User with roles
 */
export type UserWithRoles = User & { roles: Role[] };

/**
 * User with roles and permissions
 */
export type UserWithRolesAndPermissions = User & {
  roles: Role[];
  permissions: Permission[];
};

/**
 * Get list of users with their roles
 */
export async function getUsersAction(): Promise<UserWithRoles[]> {
  const response = await bffGet<{ data: UserWithRoles[] }>('/api/v1/users');
  return response.data;
}

/**
 * Get a user by ID with roles and permissions
 */
export async function getUserAction(
  userId: number
): Promise<UserWithRolesAndPermissions> {
  const response = await bffGet<{ data: UserWithRolesAndPermissions }>(
    `/api/v1/admin/users/${userId}`
  );
  return response.data;
}

/**
 * Assign a role to a user
 */
export async function assignRoleAction(
  userId: number,
  roleSlug: string
): Promise<{ message: string; data: UserWithRoles }> {
  const response = await bffPost<{
    message: string;
    data: UserWithRoles;
  }>(`/api/v1/admin/users/${userId}/roles`, { role: roleSlug });
  return response;
}

/**
 * Remove a role from a user
 */
export async function removeRoleAction(
  userId: number,
  roleId: number
): Promise<{ message: string }> {
  const response = await bffDelete<{ message: string }>(
    `/api/v1/admin/users/${userId}/roles/${roleId}`
  );
  return response;
}
