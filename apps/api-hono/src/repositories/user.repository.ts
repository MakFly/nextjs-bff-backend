/**
 * User repository
 */

import { eq } from 'drizzle-orm';
import { db, schema } from '../db/index.ts';
import type { User, SafeUser, Role } from '../types/index.ts';
import { nanoid } from 'nanoid';

/**
 * Convert database user to SafeUser
 */
function toSafeUser(user: typeof schema.users.$inferSelect): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerifiedAt: user.emailVerifiedAt,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Find user by ID
 */
export async function findById(id: string): Promise<SafeUser | null> {
  const result = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
  });

  return result ? toSafeUser(result) : null;
}

/**
 * Find user by email
 */
export async function findByEmail(email: string): Promise<User | null> {
  const result = await db.query.users.findFirst({
    where: eq(schema.users.email, email.toLowerCase()),
  });

  if (!result) return null;

  return {
    id: result.id,
    email: result.email,
    name: result.name,
    passwordHash: result.passwordHash,
    emailVerifiedAt: result.emailVerifiedAt,
    avatarUrl: result.avatarUrl,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}

/**
 * Find user with roles
 */
export async function findWithRoles(id: string): Promise<(SafeUser & { roles: Role[] }) | null> {
  const result = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
    with: {
      userRoles: {
        with: {
          role: true,
        },
      },
    },
  });

  if (!result) return null;

  const roles: Role[] = result.userRoles.map((ur) => ({
    id: ur.role.id,
    name: ur.role.name,
    slug: ur.role.slug,
    description: ur.role.description,
    createdAt: ur.role.createdAt,
    updatedAt: ur.role.updatedAt,
  }));

  return {
    ...toSafeUser(result),
    roles,
  };
}

/**
 * Create a new user
 */
export async function create(data: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<SafeUser> {
  const id = nanoid();
  const now = new Date().toISOString();

  await db.insert(schema.users).values({
    id,
    email: data.email.toLowerCase(),
    name: data.name,
    passwordHash: data.passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  // Assign default "user" role
  const userRole = await db.query.roles.findFirst({
    where: eq(schema.roles.slug, 'user'),
  });

  if (userRole) {
    await db.insert(schema.userRoles).values({
      userId: id,
      roleId: userRole.id,
    });
  }

  const user = await findById(id);
  if (!user) throw new Error('Failed to create user');

  return user;
}

/**
 * Update user
 */
export async function update(
  id: string,
  data: Partial<{
    email: string;
    name: string;
    passwordHash: string;
    emailVerifiedAt: string | null;
    avatarUrl: string | null;
  }>
): Promise<SafeUser | null> {
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (data.email) {
    updateData.email = data.email.toLowerCase();
  }

  await db.update(schema.users).set(updateData).where(eq(schema.users.id, id));

  return findById(id);
}

/**
 * Delete user
 */
export async function remove(id: string): Promise<boolean> {
  const existing = await findById(id);
  if (!existing) return false;

  await db.delete(schema.users).where(eq(schema.users.id, id));
  return true;
}

/**
 * Check if email exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const result = await db.query.users.findFirst({
    where: eq(schema.users.email, email.toLowerCase()),
    columns: { id: true },
  });

  return !!result;
}
