/**
 * Types for demo data (JSONPlaceholder)
 *
 * These types represent fake data used for testing RBAC business logic.
 */

/**
 * Blog post
 */
export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

/**
 * Comment on a post
 */
export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

/**
 * Photo album
 */
export type Album = {
  id: number;
  userId: number;
  title: string;
};

/**
 * Photo in an album
 */
export type Photo = {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

/**
 * Todo item
 */
export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

/**
 * Data for creating a post
 */
export type CreatePostData = Omit<Post, 'id'>;

/**
 * Data for updating a post
 */
export type UpdatePostData = Partial<Omit<Post, 'id'>>;
