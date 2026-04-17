import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Prompt } from '../types/prompt.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils.js';

export const promptMapper: ResourceMapper<Prompt> = {
  type: 'Prompt',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    promptVersionUniqueId: parseString(resource.attributes['prompt_version_unique_id']),
    agentUniqueId: parseString(resource.attributes['agent_unique_id']),

    name: parseString(resource.attributes['name']) || '',
    promptType: parseString(resource.attributes['prompt_type']),
    abstract: parseString(resource.attributes['abstract']),
    keywords: parseString(resource.attributes['keywords']),
    content: parseString(resource.attributes['content']),

    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    mediaUrl: parseString(resource.attributes['media_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    repoUrl: parseString(resource.attributes['repo_url']),

    publishAt: parseDate(resource.attributes['publish_at']),
    publishUntil: parseDate(resource.attributes['publish_until']),
    isPublic: parseBoolean(resource.attributes['is_public']),
    source: parseString(resource.attributes['source']),

    provider: parseString(resource.attributes['provider']),
    model: parseString(resource.attributes['model']),
    frequencyPenalty: parseOptionalNumber(resource.attributes['frequency_penalty']),
    maxTokens: parseOptionalNumber(resource.attributes['max_tokens']),
    responses: parseOptionalNumber(resource.attributes['responses']),
    responseFormat: parseString(resource.attributes['response_format']),
    seed: parseOptionalNumber(resource.attributes['seed']),
    temperature: parseOptionalNumber(resource.attributes['temperature']),
    topP: parseOptionalNumber(resource.attributes['top_p']),

    user: parseString(resource.attributes['user']),
    persona: parseString(resource.attributes['persona']),
    guidelines: parseString(resource.attributes['guidelines']),
    actions: parseString(resource.attributes['actions']),
    references: parseString(resource.attributes['references']),
    sample: parseString(resource.attributes['sample']),
    outputTemplate: parseString(resource.attributes['output_template']),
    safeguard: parseString(resource.attributes['safeguard']),

    promptTemplateId: parseString(resource.attributes['prompt_template_id']),
    templateData: resource.attributes['template_data'] as Record<string, unknown> | undefined,

    version: parseOptionalNumber(resource.attributes['version']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    likes: parseOptionalNumber(resource.attributes['likes']),
    dislikes: parseOptionalNumber(resource.attributes['dislikes']),
    comments: parseOptionalNumber(resource.attributes['comments']),

    userUniqueId: parseString(resource.attributes['user_unique_id']),
    userName: parseString(resource.attributes['user_name']),
    userAlias: parseString(resource.attributes['user_alias']),
    userAvatarUrl: parseString(resource.attributes['user_avatar_url']),
  }),
};
