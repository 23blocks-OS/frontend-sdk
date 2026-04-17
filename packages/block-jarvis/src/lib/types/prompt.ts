export interface Prompt {
  id: string;
  uniqueId: string;
  promptVersionUniqueId?: string;

  name: string;
  promptType?: string;
  abstract?: string;
  keywords?: string;
  content?: string;

  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  contentUrl?: string;
  repoUrl?: string;

  publishAt?: Date;
  publishUntil?: Date;
  isPublic?: boolean;
  source?: string;

  provider?: string;
  model?: string;
  frequencyPenalty?: number;
  maxTokens?: number;
  responses?: number;
  responseFormat?: string;
  seed?: number;
  temperature?: number;
  topP?: number;

  user?: string;
  persona?: string;
  guidelines?: string;
  actions?: string;
  references?: string;
  sample?: string;
  outputTemplate?: string;
  safeguard?: string;

  promptTemplateId?: string;
  templateData?: Record<string, unknown>;

  version?: number;
  status: string;
  enabled?: boolean;

  likes?: number;
  dislikes?: number;
  comments?: number;

  userUniqueId?: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;

  agentUniqueId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches prompt_params in prompts_controller.rb */
export interface CreatePromptRequest {
  name: string;
  promptType?: string;
  abstract?: string;
  keywords?: string;
  content?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  publishAt?: Date;
  publishUntil?: Date;
  provider?: string;
  model?: string;
  frequencyPenalty?: number;
  maxTokens?: number;
  responses?: number;
  responseFormat?: string;
  seed?: number;
  temperature?: number;
  topP?: number;
  user?: string;
  persona?: string;
  guidelines?: string;
  actions?: string;
  references?: string;
  sample?: string;
  outputTemplate?: string;
  safeguard?: string;
  promptTemplateId?: string;
  contentUrl?: string;
  repoUrl?: string;
  status?: string;
  isPublic?: boolean;
  source?: string;
  templateData?: Record<string, unknown>;
}

export type UpdatePromptRequest = CreatePromptRequest;

export interface ListPromptsParams {
  page?: number;
  perPage?: number;
  agentUniqueId?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ExecutePromptRequest {
  agentUniqueId?: string;
  variables?: Record<string, string>;
}

export interface ExecutePromptResponse {
  output: string;
  executionUniqueId?: string;
  tokens?: number;
  cost?: number;
  duration?: number;
}

export type PlaceholderValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | Record<string, unknown>
  | Array<Record<string, unknown>>;

export interface RenderPromptRequest {
  placeholders: Record<string, PlaceholderValue>;
}

export interface RenderPromptMeta {
  placeholdersProvided: string[];
  placeholdersMissing: string[];
  allPlaceholders: string[];
  renderedAt: string;
}

export interface RenderPromptResponse {
  id: number;
  renderedContent: string;
  promptUniqueId: string;
  versionUniqueId?: string;
  name: string;
  promptType?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  meta: RenderPromptMeta;
}

/** Matches execution_params in prompt_versions_controller.rb */
export interface ExecutePromptVersionRequest {
  content?: string;
  additionalData?: string;
}
