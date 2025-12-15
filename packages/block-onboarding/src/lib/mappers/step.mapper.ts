import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { OnboardingStep } from '../types/step';
import { parseDate } from './utils';

export const onboardingStepMapper: ResourceMapper<OnboardingStep> = {
  type: 'onboarding_step',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    onboardingUniqueId: resource.attributes['onboarding_unique_id'] as string,
    stepNumber: resource.attributes['step_number'] as number,
    name: resource.attributes['name'] as string,
    description: resource.attributes['description'] as string | undefined,
    type: resource.attributes['type'] as string | undefined,
    config: resource.attributes['config'] as Record<string, unknown> | undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
