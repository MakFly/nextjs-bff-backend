/**
 * Server Actions for demo data (JSONPlaceholder)
 *
 * These actions fetch fake data from JSONPlaceholder API
 * for testing RBAC business logic without a real backend.
 */

'use server';

import type {
  Post,
  Comment,
  Album,
  Photo,
  Todo,
  CreatePostData,
  UpdatePostData,
} from './types';

const API_BASE = 'https://jsonplaceholder.typicode.com';

// =========================================================================
// Posts
// =========================================================================

/**
 * Get all posts
 */
export async function getPostsAction(limit = 20): Promise<Post[]> {
  const response = await fetch(`${API_BASE}/posts?_limit=${limit}`);
  return response.json();
}

/**
 * Get a post by ID
 */
export async function getPostAction(id: number): Promise<Post> {
  const response = await fetch(`${API_BASE}/posts/${id}`);
  return response.json();
}

/**
 * Get comments of a post
 */
export async function getPostCommentsAction(postId: number): Promise<Comment[]> {
  const response = await fetch(`${API_BASE}/posts/${postId}/comments`);
  return response.json();
}

/**
 * Create a post (simulation)
 */
export async function createPostAction(data: CreatePostData): Promise<Post> {
  const response = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

/**
 * Update a post (simulation)
 */
export async function updatePostAction(
  id: number,
  data: UpdatePostData
): Promise<Post> {
  const response = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

/**
 * Delete a post (simulation)
 */
export async function deletePostAction(id: number): Promise<void> {
  await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
  });
}

// =========================================================================
// Todos
// =========================================================================

/**
 * Get todos of a user (or all if no userId)
 */
export async function getTodosAction(userId?: number): Promise<Todo[]> {
  const url = userId
    ? `${API_BASE}/users/${userId}/todos`
    : `${API_BASE}/todos?_limit=20`;
  const response = await fetch(url);
  return response.json();
}

// =========================================================================
// Albums & Photos
// =========================================================================

/**
 * Get albums
 */
export async function getAlbumsAction(limit = 10): Promise<Album[]> {
  const response = await fetch(`${API_BASE}/albums?_limit=${limit}`);
  return response.json();
}

/**
 * Get photos of an album
 */
export async function getAlbumPhotosAction(albumId: number): Promise<Photo[]> {
  const response = await fetch(`${API_BASE}/albums/${albumId}/photos`);
  return response.json();
}
