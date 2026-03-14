import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { OpenAIModel } from '../services/ai-models.service.js';
import { parseString } from './utils.js';

export const openaiModelMapper: ResourceMapper<OpenAIModel> = {
  type: 'openai_model',
  map: (resource) => ({
    id: parseString(resource.attributes['name']) || resource.id,
    name: parseString(resource.attributes['name']) || resource.id,
  }),
};
