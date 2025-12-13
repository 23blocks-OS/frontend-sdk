import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { UserJourney } from '../types/user-journey';
import { parseString, parseDate, parseOptionalNumber, parseNumberArray, parseJourneyStatus } from './utils';

export const userJourneyMapper: ResourceMapper<UserJourney> = {
  type: 'UserJourney',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    onboardingUniqueId: parseString(resource.attributes['onboarding_unique_id']) || '',
    flowUniqueId: parseString(resource.attributes['flow_unique_id']),
    currentStep: parseOptionalNumber(resource.attributes['current_step']),
    completedSteps: parseNumberArray(resource.attributes['completed_steps']),
    progress: parseOptionalNumber(resource.attributes['progress']),
    startedAt: parseDate(resource.attributes['started_at']) || new Date(),
    completedAt: parseDate(resource.attributes['completed_at']),
    status: parseJourneyStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
