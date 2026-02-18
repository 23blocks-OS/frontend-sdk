import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AIModel } from '../types/ai-model.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber } from './utils.js';

export const aiModelMapper: ResourceMapper<AIModel> = {
  type: 'ai_model',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    vendorName: parseString(resource.attributes['vendor_name']),
    vendorUniqueId: parseString(resource.attributes['vendor_unique_id']),
    contentUrl: parseString(resource.attributes['content_url']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    videoUrl: parseString(resource.attributes['video_url']),
    inputTokenCost: parseOptionalNumber(resource.attributes['input_token_cost']),
    outputTokenCost: parseOptionalNumber(resource.attributes['output_token_cost']),
    apiUrl: parseString(resource.attributes['api_url']),
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
