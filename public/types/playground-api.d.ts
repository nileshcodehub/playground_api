/**
 * Playground API — Full TypeScript Type Definitions (.d.ts)
 * https://playground-api-xi.vercel.app/
 */

export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo?: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number | string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  website?: string;
  address?: Address;
  company?: Company;
  _sandbox?: 'created' | 'updated';
}

export interface Post {
  id: number | string;
  userId: number | string;
  user_id?: number | string;
  title: string;
  body: string;
  thumbnail?: string;
  _sandbox?: 'created' | 'updated';
}

export interface Comment {
  id: number | string;
  postId: number | string;
  post_id?: number | string;
  name: string;
  email: string;
  body: string;
  _sandbox?: 'created' | 'updated';
}

export interface Todo {
  id: number | string;
  userId: number | string;
  user_id?: number | string;
  title: string;
  completed: boolean;
  _sandbox?: 'created' | 'updated';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface SessionStats {
  identityId: string;
  totalCreatedRecords: number;
  maxQuotaPerResource: number;
  resources: {
    users: number;
    posts: number;
    comments: number;
    todos: number;
  };
  expiresInDays: number;
}

export interface HealthMetrics {
  status: 'ok' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  database: {
    connected: boolean;
    latencyMs: number;
  };
  activeSessions: number;
}

// Input Types for Mutations
export type CreateUserInput = Omit<User, 'id' | '_sandbox'>;
export type CreatePostInput = Omit<Post, 'id' | '_sandbox'>;
export type CreateCommentInput = Omit<Comment, 'id' | '_sandbox'>;
export type CreateTodoInput = Omit<Todo, 'id' | '_sandbox'>;

export type UpdateUserInput = Partial<CreateUserInput>;
export type UpdatePostInput = Partial<CreatePostInput>;
export type UpdateCommentInput = Partial<CreateCommentInput>;
export type UpdateTodoInput = Partial<CreateTodoInput>;

// Auth Simulation Types
export interface AuthLoginInput {
  username?: string;
  email?: string;
  password?: string;
}

export interface AuthRegisterInput {
  name: string;
  username: string;
  email: string;
  password?: string;
  company?: Company;
  address?: Address;
  phone?: string;
  website?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}
