import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { StepTransition } from '../types/step-transition.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber } from './utils.js';

export const stepTransitionMapper: ResourceMapper<StepTransition> = {
  type: 'step_transition',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    transitionType: parseString(resource.attributes['transition_type']),
    priority: parseOptionalNumber(resource.attributes['priority']),
    isDefault: resource.attributes['is_default'] != null ? parseBoolean(resource.attributes['is_default']) : undefined,
    allowsBackward: resource.attributes['allows_backward'] != null ? parseBoolean(resource.attributes['allows_backward']) : undefined,
    maxIterations: parseOptionalNumber(resource.attributes['max_iterations']),
    onLoop: parseString(resource.attributes['on_loop']),
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
