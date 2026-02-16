/**
 * Demo Server Actions
 *
 * Public API for demo/test data operations using JSONPlaceholder.
 *
 * @example
 * ```typescript
 * import { getPostsAction, getTodosAction } from '@/lib/actions/demo';
 *
 * const posts = await getPostsAction(10);
 * const todos = await getTodosAction(1);
 * ```
 */

// Re-export server actions (these already have 'use server' in actions.ts)
export {
  // Posts
  getPostsAction,
  getPostAction,
  getPostCommentsAction,
  createPostAction,
  updatePostAction,
  deletePostAction,
  // Todos
  getTodosAction,
  // Albums & Photos
  getAlbumsAction,
  getAlbumPhotosAction,
} from './actions';

// Types
export type {
  Post,
  Comment,
  Album,
  Photo,
  Todo,
  CreatePostData,
  UpdatePostData,
} from './types';
