import type { ResourceMapper, JsonApiResource, IncludedMap } from '@23blocks/jsonapi-codec';
import type { Match, MatchEvaluation, AvailableCoach, AvailableCoachee } from '../types/match';
import { parseString, parseDate, parseNumber, parseStringArray } from './utils';

export const matchMapper: ResourceMapper<Match> = {
  type: 'Match',
  map(resource: JsonApiResource, _included: IncludedMap): Match {
    const attrs = resource.attributes ?? {};
    const status = parseString(attrs.status) as Match['status'];
    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      teacherUniqueId: parseString(attrs.teacher_unique_id) ?? '',
      studentUniqueId: parseString(attrs.student_unique_id) ?? '',
      courseUniqueId: parseString(attrs.course_unique_id),
      subjectUniqueId: parseString(attrs.subject_unique_id),
      status: status ?? 'pending',
      startedAt: parseDate(attrs.started_at),
      endedAt: parseDate(attrs.ended_at),
      payload: attrs.payload as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};

export const matchEvaluationMapper: ResourceMapper<MatchEvaluation> = {
  type: 'MatchEvaluation',
  map(resource: JsonApiResource, _included: IncludedMap): MatchEvaluation {
    const attrs = resource.attributes ?? {};
    return {
      teacherUniqueId: parseString(attrs.teacher_unique_id) ?? '',
      studentUniqueId: parseString(attrs.student_unique_id) ?? '',
      score: parseNumber(attrs.score),
      availabilityOverlap: parseNumber(attrs.availability_overlap),
      compatibilityFactors: attrs.compatibility_factors as Record<string, unknown> | undefined,
    };
  },
};

export const availableCoachMapper: ResourceMapper<AvailableCoach> = {
  type: 'AvailableCoach',
  map(resource: JsonApiResource, _included: IncludedMap): AvailableCoach {
    const attrs = resource.attributes ?? {};
    return {
      teacherUniqueId: parseString(attrs.teacher_unique_id) ?? parseString(attrs.unique_id) ?? resource.id,
      name: parseString(attrs.name),
      email: parseString(attrs.email),
      availabilityScore: parseNumber(attrs.availability_score),
      courseUniqueIds: parseStringArray(attrs.course_unique_ids),
      subjectUniqueIds: parseStringArray(attrs.subject_unique_ids),
    };
  },
};

export const availableCoacheeMapper: ResourceMapper<AvailableCoachee> = {
  type: 'AvailableCoachee',
  map(resource: JsonApiResource, _included: IncludedMap): AvailableCoachee {
    const attrs = resource.attributes ?? {};
    return {
      studentUniqueId: parseString(attrs.student_unique_id) ?? parseString(attrs.unique_id) ?? resource.id,
      name: parseString(attrs.name),
      email: parseString(attrs.email),
      availabilityScore: parseNumber(attrs.availability_score),
      courseUniqueIds: parseStringArray(attrs.course_unique_ids),
      subjectUniqueIds: parseStringArray(attrs.subject_unique_ids),
    };
  },
};
