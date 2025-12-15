import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { OnboardJourney } from '../types/onboard';
import { parseDate } from './utils';

export const onboardJourneyMapper: ResourceMapper<OnboardJourney> = {
  type: 'onboard_journey',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    userUniqueId: resource.attributes['user_unique_id'] as string,
    onboardingUniqueId: resource.attributes['onboarding_unique_id'] as string,
    currentStep: resource.attributes['current_step'] as number | undefined,
    completedSteps: (resource.attributes['completed_steps'] as number[]) || [],
    status: resource.attributes['status'] as 'active' | 'completed' | 'suspended' | 'abandoned',
    progress: resource.attributes['progress'] as number || 0,
    startedAt: parseDate(resource.attributes['started_at']),
    completedAt: resource.attributes['completed_at'] ? parseDate(resource.attributes['completed_at']) : undefined,
    suspendedAt: resource.attributes['suspended_at'] ? parseDate(resource.attributes['suspended_at']) : undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
