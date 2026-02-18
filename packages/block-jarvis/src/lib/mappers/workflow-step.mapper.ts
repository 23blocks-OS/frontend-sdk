import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { WorkflowStep } from '../types/workflow-step.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber } from './utils.js';

export const workflowStepMapper: ResourceMapper<WorkflowStep> = {
  type: 'workflow_step',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    workflowUniqueId: parseString(resource.attributes['workflow_unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    source: parseString(resource.attributes['source']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    order: parseOptionalNumber(resource.attributes['order']),
    stepUrl: parseString(resource.attributes['step_url']),
    stepParams: parseString(resource.attributes['step_params']),
    agentUniqueId: parseString(resource.attributes['agent_unique_id']),
    agentName: parseString(resource.attributes['agent_name']),
    promptUniqueId: parseString(resource.attributes['prompt_unique_id']),
    promptName: parseString(resource.attributes['prompt_name']),
    customPrompt: parseString(resource.attributes['custom_prompt']),
    contentUrl: parseString(resource.attributes['content_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    videoUrl: parseString(resource.attributes['video_url']),
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
