/**
 * Symfony response transformer
 *
 * Normalizes Symfony BetterAuth API responses to the common adapter format
 */

import type { NormalizedUser, TokenStorage, AuthResponse } from '../types';

/**
 * Symfony user response structure (BetterAuth)
 */
type SymfonyUser = {
  id: string;
  email: string;
  name: string;
  email_verified_at?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  roles?: string[];
};

/**
 * Symfony auth response structure (BetterAuth)
 */
type SymfonyAuthResponse = {
  user: SymfonyUser;
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
};

/**
 * Transform Symfony user to normalized user
 */
export function transformUser(symfonyUser: SymfonyUser): NormalizedUser {
  // Symfony BetterAuth returns roles as string array
  const roles = symfonyUser.roles?.map((role, index) => ({
    id: index + 1,
    name: role.replace('ROLE_', '').toLowerCase(),
    slug: role.replace('ROLE_', '').toLowerCase(),
  }));

  return {
    id: symfonyUser.id,
    email: symfonyUser.email,
    name: symfonyUser.name,
    email_verified_at: symfonyUser.email_verified_at ?? null,
    avatar_url: symfonyUser.avatar_url ?? null,
    created_at: symfonyUser.created_at,
    updated_at: symfonyUser.updated_at,
    roles,
    permissions: [], // Symfony BetterAuth doesn't return permissions in the same way
  };
}

/**
 * Transform Symfony auth response to normalized auth response
 */
export function transformAuthResponse(response: SymfonyAuthResponse): AuthResponse {
  const tokens: TokenStorage = {
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    token_type: response.token_type || 'Bearer',
    expires_in: response.expires_in,
  };

  return {
    user: transformUser(response.user),
    tokens,
  };
}

/**
 * Transform Symfony /me response to normalized user
 */
export function transformMeResponse(response: SymfonyUser | { user: SymfonyUser }): NormalizedUser {
  // Handle both { user: ... } and direct user object
  const user = 'user' in response ? response.user : response;
  return transformUser(user);
}

/**
 * Transform Symfony OAuth providers response
 */
export function transformOAuthProviders(response: { providers: string[] } | string[]): string[] {
  if (Array.isArray(response)) {
    return response;
  }
  return response.providers;
}

/**
 * Transform Symfony OAuth redirect response
 */
export function transformOAuthRedirect(
  response: { url: string } | { redirect_url: string }
): string {
  if ('url' in response) {
    return response.url;
  }
  return response.redirect_url;
}
