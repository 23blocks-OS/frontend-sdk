export interface PromptComment {
  id: string;
  uniqueId: string;
  promptUniqueId: string;
  parentUniqueId?: string;
  content: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  userUniqueId?: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;
  aiGenerated?: boolean;
  aiModel?: string;
  likesCount?: number;
  repliesCount?: number;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches comment_params in comments_controller.rb */
export interface CreatePromptCommentRequest {
  content: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  userUniqueId?: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;
  status?: string;
  aiGenerated?: boolean;
  aiModel?: string;
}

export type UpdatePromptCommentRequest = CreatePromptCommentRequest;
export type ReplyToCommentRequest = CreatePromptCommentRequest;

export interface ListPromptCommentsParams {
  page?: number;
  perPage?: number;
  parentUniqueId?: string;
  userUniqueId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ExecutionComment {
  id: string;
  uniqueId: string;
  promptUniqueId: string;
  executionUniqueId: string;
  parentUniqueId?: string;
  content: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  userUniqueId?: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;
  aiGenerated?: boolean;
  aiModel?: string;
  likesCount?: number;
  repliesCount?: number;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches comment_params in execution_comments_controller.rb */
export type CreateExecutionCommentRequest = CreatePromptCommentRequest;
export type UpdateExecutionCommentRequest = CreatePromptCommentRequest;

export interface ListExecutionCommentsParams {
  page?: number;
  perPage?: number;
  parentUniqueId?: string;
  userUniqueId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
