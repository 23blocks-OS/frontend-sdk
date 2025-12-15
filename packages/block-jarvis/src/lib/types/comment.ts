export interface PromptComment {
  id: string;
  uniqueId: string;
  promptUniqueId: string;
  parentUniqueId?: string;
  userUniqueId: string;
  content: string;
  likesCount: number;
  repliesCount: number;
  isLiked?: boolean;
  isFollowed?: boolean;
  isSaved?: boolean;
  enabled: boolean;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePromptCommentRequest {
  content: string;
  userUniqueId: string;
  payload?: Record<string, unknown>;
}

export interface UpdatePromptCommentRequest {
  content?: string;
  enabled?: boolean;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListPromptCommentsParams {
  page?: number;
  perPage?: number;
  parentUniqueId?: string;
  userUniqueId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReplyToCommentRequest {
  content: string;
  userUniqueId: string;
  payload?: Record<string, unknown>;
}

export interface ExecutionComment {
  id: string;
  uniqueId: string;
  promptUniqueId: string;
  executionUniqueId: string;
  parentUniqueId?: string;
  userUniqueId: string;
  content: string;
  likesCount: number;
  repliesCount: number;
  isLiked?: boolean;
  isFollowed?: boolean;
  isSaved?: boolean;
  enabled: boolean;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExecutionCommentRequest {
  content: string;
  userUniqueId: string;
  payload?: Record<string, unknown>;
}

export interface UpdateExecutionCommentRequest {
  content?: string;
  enabled?: boolean;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListExecutionCommentsParams {
  page?: number;
  perPage?: number;
  parentUniqueId?: string;
  userUniqueId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
