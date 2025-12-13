import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Submission } from '../types/submission';
import { parseString, parseDate, parseOptionalNumber, parseSubmissionStatus } from './utils';

export const submissionMapper: ResourceMapper<Submission> = {
  type: 'Submission',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    assignmentUniqueId: parseString(resource.attributes['assignment_unique_id']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    content: parseString(resource.attributes['content']),
    contentUrl: parseString(resource.attributes['content_url']),
    score: parseOptionalNumber(resource.attributes['score']),
    feedback: parseString(resource.attributes['feedback']),
    submittedAt: parseDate(resource.attributes['submitted_at']),
    gradedAt: parseDate(resource.attributes['graded_at']),
    status: parseSubmissionStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
