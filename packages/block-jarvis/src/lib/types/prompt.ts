/**
 * Discriminator allowing consumers to narrow `Prompt | PromptVersion`
 * returned from `prompts.create()` and `prompts.update()`. Use it to detect
 * whether the backend returned the parent Prompt (legacy shape) or the
 * newly-created PromptVersion (post-2026-05-30 Jarvis API change).
 */
export interface Prompt {
  /** Discriminator — always 'Prompt' for this type. */
  resourceType?: 'Prompt';
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

/**
 * A snapshot version of a Prompt. As of 2026-05-30, POST /prompts and
 * PUT /prompts/:uid return PromptVersion (the newly-created version),
 * not the parent Prompt. Older deployments still return Prompt — the
 * SDK normalizes by returning the union `Prompt | PromptVersion`.
 *
 * Discriminate via the `resourceType` field.
 */
export interface PromptVersion {
  /** Discriminator — always 'PromptVersion' for this type. */
  resourceType: 'PromptVersion';
  id: string;
  uniqueId: string;
  /** Sequential version number assigned by the backend. */
  version?: number;
  /** Revision counter within a version (incremented on each save). */
  revision?: number;
  /** Parent Prompt's unique id. */
  promptUniqueId?: string;

  /** Snapshot of the prompt content at the time this version was created. */
  content?: string;
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

  /** Author of the version (typically the user who saved it). */
  userUniqueId?: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;

  status?: string;
  enabled?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Union returned by `prompts.create()` and `prompts.update()`. Discriminate
 * via the `resourceType` field:
 *
 *   const result = await jarvis.prompts.create(data);
 *   if (result.resourceType === 'PromptVersion') {
 *     // post-2026-05-30 Jarvis API: result is a PromptVersion
 *     console.log(result.version, result.revision, result.promptUniqueId);
 *   } else {
 *     // legacy / older deployments: result is a Prompt
 *     console.log(result.name, result.version);
 *   }
 */
export type PromptOrVersion = Prompt | PromptVersion;

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
