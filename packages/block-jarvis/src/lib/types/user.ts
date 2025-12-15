export interface JarvisUser {
  id: string;
  uniqueId: string;
  email?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterJarvisUserRequest {
  email?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateJarvisUserRequest {
  name?: string;
  username?: string;
  avatarUrl?: string;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListJarvisUsersParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserContext {
  id: string;
  uniqueId: string;
  userUniqueId: string;
  messages: UserMessage[];
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMessage {
  role: string;
  content: string;
  timestamp: Date;
  payload?: Record<string, unknown>;
}

export interface CreateUserContextRequest {
  systemPrompt?: string;
  payload?: Record<string, unknown>;
}

export interface SendUserMessageRequest {
  message: string;
  payload?: Record<string, unknown>;
}

export interface SendUserMessageResponse {
  message: UserMessage;
  response?: UserMessage;
  tokens?: number;
  cost?: number;
}

export interface UserContentContext {
  id: string;
  uniqueId: string;
  userUniqueId: string;
  contentIdentityUniqueId: string;
  messages: UserMessage[];
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserContentContextRequest {
  systemPrompt?: string;
  payload?: Record<string, unknown>;
}
