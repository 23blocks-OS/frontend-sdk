import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Prompt } from '../types/prompt';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseStringArray } from './utils';

export const promptMapper: ResourceMapper<Prompt> = {
  type: 'Prompt',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    // Core identifiers
    promptVersionUniqueId: parseString(resource.attributes['prompt_version_unique_id']),
    agentUniqueId: parseString(resource.attributes['agent_unique_id']),

    // Basic info
    name: parseString(resource.attributes['name']) || '',
    code: parseString(resource.attributes['code']),
    promptType: parseString(resource.attributes['prompt_type']),
    abstract: parseString(resource.attributes['abstract']),
    keywords: parseString(resource.attributes['keywords']),
    description: parseString(resource.attributes['description']),

    // Content
    content: parseString(resource.attributes['content']),
    template: parseString(resource.attributes['template']),
    variables: parseStringArray(resource.attributes['variables']),

    // Media
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    mediaUrl: parseString(resource.attributes['media_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    repoUrl: parseString(resource.attributes['repo_url']),

    // Publishing
    publishAt: parseDate(resource.attributes['publish_at']),
    publishUntil: parseDate(resource.attributes['publish_until']),
    isPublic: parseBoolean(resource.attributes['is_public']),
    source: parseString(resource.attributes['source']),

    // AI Model Settings
    model: parseString(resource.attributes['model']),
    frequencyPenalty: parseOptionalNumber(resource.attributes['frequency_penalty']),
    maxTokens: parseOptionalNumber(resource.attributes['max_tokens']),
    responses: parseOptionalNumber(resource.attributes['responses']),
    responseFormat: parseString(resource.attributes['response_format']),
    seed: parseOptionalNumber(resource.attributes['seed']),
    temperature: parseOptionalNumber(resource.attributes['temperature']),
    topP: parseOptionalNumber(resource.attributes['top_p']),

    // Prompt Components
    user: parseString(resource.attributes['user']),
    persona: parseString(resource.attributes['persona']),
    guidelines: parseString(resource.attributes['guidelines']),
    actions: parseString(resource.attributes['actions']),
    references: parseString(resource.attributes['references']),
    sample: parseString(resource.attributes['sample']),
    outputTemplate: parseString(resource.attributes['output_template']),
    safeguard: parseString(resource.attributes['safeguard']),

    // Versioning & Status
    version: parseOptionalNumber(resource.attributes['version']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // Engagement
    likes: parseOptionalNumber(resource.attributes['likes']),
    dislikes: parseOptionalNumber(resource.attributes['dislikes']),
    comments: parseOptionalNumber(resource.attributes['comments']),

    // Author info
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    userName: parseString(resource.attributes['user_name']),
    userAlias: parseString(resource.attributes['user_alias']),
    userAvatarUrl: parseString(resource.attributes['user_avatar_url']),

    // Custom data
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
