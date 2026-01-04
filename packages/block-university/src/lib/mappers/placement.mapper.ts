import type { ResourceMapper, JsonApiResource, IncludedMap } from '@23blocks/jsonapi-codec';
import type {
  PlacementTest,
  PlacementSection,
  PlacementQuestion,
  PlacementOption,
  PlacementRule,
  PlacementInstance,
} from '../types/placement';
import { parseString, parseDate, parseBoolean, parseNumber, parseStatus } from './utils';

export const placementOptionMapper: ResourceMapper<PlacementOption> = {
  type: 'PlacementOption',
  map(resource: JsonApiResource, _included: IncludedMap): PlacementOption {
    const attrs = resource.attributes ?? {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      questionUniqueId: parseString(attrs.question_unique_id) ?? '',
      optionText: parseString(attrs.option_text) ?? parseString(attrs.text) ?? '',
      isCorrect: parseBoolean(attrs.is_correct),
      sortOrder: parseNumber(attrs.sort_order),
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};

export const placementQuestionMapper: ResourceMapper<PlacementQuestion> = {
  type: 'PlacementQuestion',
  map(resource: JsonApiResource, _included: IncludedMap): PlacementQuestion {
    const attrs = resource.attributes ?? {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      sectionUniqueId: parseString(attrs.section_unique_id),
      placementUniqueId: parseString(attrs.placement_unique_id) ?? '',
      questionText: parseString(attrs.question_text) ?? parseString(attrs.text) ?? '',
      questionType: parseString(attrs.question_type),
      points: parseNumber(attrs.points),
      sortOrder: parseNumber(attrs.sort_order),
      payload: attrs.payload as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};

export const placementSectionMapper: ResourceMapper<PlacementSection> = {
  type: 'PlacementSection',
  map(resource: JsonApiResource, _included: IncludedMap): PlacementSection {
    const attrs = resource.attributes ?? {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      placementUniqueId: parseString(attrs.placement_unique_id) ?? '',
      name: parseString(attrs.name) ?? '',
      description: parseString(attrs.description),
      sortOrder: parseNumber(attrs.sort_order),
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};

export const placementTestMapper: ResourceMapper<PlacementTest> = {
  type: 'PlacementTest',
  map(resource: JsonApiResource, _included: IncludedMap): PlacementTest {
    const attrs = resource.attributes ?? {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      name: parseString(attrs.name) ?? '',
      description: parseString(attrs.description),
      courseUniqueId: parseString(attrs.course_unique_id) ?? '',
      passingScore: parseNumber(attrs.passing_score),
      timeLimit: parseNumber(attrs.time_limit),
      status: parseStatus(attrs.status),
      payload: attrs.payload as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};

export const placementRuleMapper: ResourceMapper<PlacementRule> = {
  type: 'PlacementRule',
  map(resource: JsonApiResource, _included: IncludedMap): PlacementRule {
    const attrs = resource.attributes ?? {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      placementUniqueId: parseString(attrs.placement_unique_id) ?? '',
      minScore: parseNumber(attrs.min_score),
      maxScore: parseNumber(attrs.max_score),
      courseGroupUniqueId: parseString(attrs.course_group_unique_id),
      subjectUniqueId: parseString(attrs.subject_unique_id),
      action: parseString(attrs.action),
      payload: attrs.payload as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};

export const placementInstanceMapper: ResourceMapper<PlacementInstance> = {
  type: 'PlacementInstance',
  map(resource: JsonApiResource, _included: IncludedMap): PlacementInstance {
    const attrs = resource.attributes ?? {};
    const status = parseString(attrs.status) as PlacementInstance['status'];
    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      userUniqueId: parseString(attrs.user_unique_id) ?? '',
      placementUniqueId: parseString(attrs.placement_unique_id) ?? '',
      status: status ?? 'started',
      startedAt: parseDate(attrs.started_at),
      completedAt: parseDate(attrs.completed_at),
      score: parseNumber(attrs.score),
      result: attrs.result as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};
