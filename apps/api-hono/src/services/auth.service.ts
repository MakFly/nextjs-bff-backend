/**
 * Authentication service
 */

import { userRepository, tokenRepository } from '../repositories/index.ts';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getAccessTokenExpiration,
  getRefreshTokenExpirationDate,
} from '../lib/index.ts';
import type { AuthResponse, SafeUser, Role } from '../types/index.ts';

/**
 * Service error
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Register a new user
 */
export async function register(data: {
  email: string;
  name: string;
  password: string;
}): Promise<AuthResponse> {
  // Check if email already exists
  const exists = await userRepository.emailExists(data.email);
  if (exists) {
    throw new AuthError('Email already registered', 'EMAIL_EXISTS', 409);
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user
  const user = await userRepository.create({
    email: data.email,
    name: data.name,
    passwordHash,
  });

  // Get user with roles
  const userWithRoles = await userRepository.findWithRoles(user.id);

  // Generate tokens
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  // Store refresh token
  await tokenRepository.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: getRefreshTokenExpirationDate(),
  });

  return {
    user: userWithRoles || { ...user, roles: [] },
    accessToken,
    refreshToken,
    expiresIn: getAccessTokenExpiration(),
    tokenType: 'Bearer',
  };
}

/**
 * Login a user
 */
export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  // Find user by email (includes password hash)
  const user = await userRepository.findByEmail(data.email);
  if (!user) {
    throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
  }

  // Verify password
  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) {
    throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
  }

  // Get user with roles
  const userWithRoles = await userRepository.findWithRoles(user.id);

  // Create safe user (without password)
  const safeUser: SafeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerifiedAt: user.emailVerifiedAt,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // Generate tokens
  const accessToken = await generateAccessToken(safeUser);
  const refreshToken = await generateRefreshToken(user.id);

  // Store refresh token
  await tokenRepository.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: getRefreshTokenExpirationDate(),
  });

  return {
    user: userWithRoles || { ...safeUser, roles: [] },
    accessToken,
    refreshToken,
    expiresIn: getAccessTokenExpiration(),
    tokenType: 'Bearer',
  };
}

/**
 * Refresh access token
 */
export async function refresh(refreshToken: string): Promise<AuthResponse> {
  // Verify refresh token JWT
  const userId = await verifyRefreshToken(refreshToken);
  if (!userId) {
    throw new AuthError('Invalid refresh token', 'INVALID_TOKEN', 401);
  }

  // Check if token exists and is valid in database
  const tokenValid = await tokenRepository.isValid(refreshToken);
  if (!tokenValid) {
    throw new AuthError('Refresh token expired or revoked', 'TOKEN_EXPIRED', 401);
  }

  // Get user
  const user = await userRepository.findWithRoles(userId);
  if (!user) {
    throw new AuthError('User not found', 'USER_NOT_FOUND', 401);
  }

  // Delete old refresh token
  await tokenRepository.deleteByToken(refreshToken);

  // Generate new tokens
  const newAccessToken = await generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user.id);

  // Store new refresh token
  await tokenRepository.create({
    userId: user.id,
    token: newRefreshToken,
    expiresAt: getRefreshTokenExpirationDate(),
  });

  return {
    user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: getAccessTokenExpiration(),
    tokenType: 'Bearer',
  };
}

/**
 * Logout user (revoke refresh token)
 */
export async function logout(refreshToken?: string, userId?: string): Promise<void> {
  if (refreshToken) {
    await tokenRepository.deleteByToken(refreshToken);
  } else if (userId) {
    // Revoke all tokens for user
    await tokenRepository.deleteByUserId(userId);
  }
}

/**
 * Get current user by ID
 */
export async function getCurrentUser(
  userId: string
): Promise<(SafeUser & { roles: Role[] }) | null> {
  return userRepository.findWithRoles(userId);
}
