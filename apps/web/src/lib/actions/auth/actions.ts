/**
 * Server Actions for authentication
 *
 * These actions use the adapter pattern to communicate with the configured backend
 * (Laravel, Symfony, or Node.js). The backend is determined by AUTH_BACKEND env var.
 *
 * Authentication uses HttpOnly cookies for secure token storage.
 */

'use server';

import type { User, LoginCredentials, RegisterData, AuthTokens, ApiResponse } from '@rbac/types';
import { getAuthAdapter, toUser, AdapterError } from '../../adapters';
import { createLogger } from '@/lib/logger';
import { AuthActionError, throwAuthError } from '../_shared/errors';

const log = createLogger('auth');

/**
 * Register a new user
 */
export async function registerAction(
  data: RegisterData
): Promise<ApiResponse<{ user: User; access_token: string }>> {
  try {
    const adapter = getAuthAdapter();
    const response = await adapter.register({
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });

    return {
      data: {
        user: toUser(response.user),
        access_token: response.tokens.access_token,
      },
    };
  } catch (error) {
    throwAuthError(error);
  }
}

/**
 * Log in a user
 */
export async function loginAction(
  credentials: LoginCredentials
): Promise<ApiResponse<{ user: User; access_token: string }>> {
  try {
    const adapter = getAuthAdapter();
    const response = await adapter.login({
      email: credentials.email,
      password: credentials.password,
    });

    return {
      data: {
        user: toUser(response.user),
        access_token: response.tokens.access_token,
      },
    };
  } catch (error) {
    throwAuthError(error);
  }
}

/**
 * Log out
 */
export async function logoutAction(): Promise<void> {
  try {
    const adapter = getAuthAdapter();
    await adapter.logout();
  } catch (error) {
    // Log but don't throw - we still want to clear local state
    log.error('Logout error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Ensure tokens are cleared even on error
    const adapter = getAuthAdapter();
    await adapter.clearTokens();
  }
}

/**
 * Refresh token
 */
export async function refreshTokenAction(): Promise<ApiResponse<AuthTokens>> {
  try {
    const adapter = getAuthAdapter();
    const response = await adapter.refresh();

    return {
      data: {
        access_token: response.tokens.access_token,
        token_type: (response.tokens.token_type as 'Bearer') || 'Bearer',
        expires_in: response.tokens.expires_in || 3600,
        refresh_token: response.tokens.refresh_token,
      },
    };
  } catch (error) {
    throwAuthError(error);
  }
}

/**
 * Get current user
 *
 * Note: Returns null if user is not logged in
 * (rather than throwing an error)
 */
export async function getCurrentUserAction(): Promise<User | null> {
  try {
    const adapter = getAuthAdapter();
    const user = await adapter.getUser();

    if (!user) {
      return null;
    }

    return toUser(user);
  } catch (error) {
    // If adapter throws for auth issues, return null
    if (error instanceof AdapterError) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        return null;
      }
    }
    throw error;
  }
}

/**
 * Get list of OAuth providers
 */
export async function getOAuthProvidersAction(): Promise<ApiResponse<string[]>> {
  try {
    const adapter = getAuthAdapter();
    const providers = await adapter.getOAuthProviders();

    return {
      data: providers,
    };
  } catch (error) {
    throwAuthError(error);
  }
}

/**
 * Get OAuth redirect URL
 */
export async function getOAuthUrlAction(provider: string): Promise<{ url: string }> {
  try {
    const adapter = getAuthAdapter();
    const url = await adapter.getOAuthUrl(provider);

    return { url };
  } catch (error) {
    throwAuthError(error);
  }
}

// Re-export error class for external use
export { AuthActionError };
