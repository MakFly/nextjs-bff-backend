/**
 * Refresh token repository
 */

import { eq, lt } from 'drizzle-orm';
import { db, schema } from '../db/index.ts';
import type { RefreshToken } from '../types/index.ts';
import { nanoid } from 'nanoid';

/**
 * Create a refresh token
 */
export async function create(data: {
  userId: string;
  token: string;
  expiresAt: Date;
}): Promise<RefreshToken> {
  const id = nanoid();
  const now = new Date().toISOString();

  await db.insert(schema.refreshTokens).values({
    id,
    userId: data.userId,
    token: data.token,
    expiresAt: data.expiresAt.toISOString(),
    createdAt: now,
  });

  return {
    id,
    userId: data.userId,
    token: data.token,
    expiresAt: data.expiresAt.toISOString(),
    createdAt: now,
  };
}

/**
 * Find refresh token by token value
 */
export async function findByToken(token: string): Promise<RefreshToken | null> {
  const result = await db.query.refreshTokens.findFirst({
    where: eq(schema.refreshTokens.token, token),
  });

  if (!result) return null;

  return {
    id: result.id,
    userId: result.userId,
    token: result.token,
    expiresAt: result.expiresAt,
    createdAt: result.createdAt,
  };
}

/**
 * Delete refresh token by token value
 */
export async function deleteByToken(token: string): Promise<boolean> {
  const existing = await findByToken(token);
  if (!existing) return false;

  await db.delete(schema.refreshTokens).where(eq(schema.refreshTokens.token, token));

  return true;
}

/**
 * Delete all refresh tokens for a user
 */
export async function deleteByUserId(userId: string): Promise<void> {
  await db.delete(schema.refreshTokens).where(eq(schema.refreshTokens.userId, userId));
}

/**
 * Delete expired tokens
 */
export async function deleteExpired(): Promise<void> {
  const now = new Date().toISOString();
  await db.delete(schema.refreshTokens).where(lt(schema.refreshTokens.expiresAt, now));
}

/**
 * Check if token is valid (exists and not expired)
 */
export async function isValid(token: string): Promise<boolean> {
  const now = new Date().toISOString();

  const result = await db.query.refreshTokens.findFirst({
    where: eq(schema.refreshTokens.token, token),
  });

  if (!result) return false;

  return result.expiresAt > now;
}
