import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ContentTest, TestQuestion, TestOption } from '../types/content-test';
import { parseString, parseDate, parseStatus, parseOptionalNumber, parseBoolean } from './utils';

export const contentTestMapper: ResourceMapper<ContentTest> = {
  type: 'content_test',
  map: (resource) => ({
    uniqueId: resource.id,
    name: parseString(resource.attributes['name']) ?? '',
    description: parseString(resource.attributes['description']),
    courseUniqueId: parseString(resource.attributes['course_unique_id']),
    subjectUniqueId: parseString(resource.attributes['subject_unique_id']),
    lessonUniqueId: parseString(resource.attributes['lesson_unique_id']),
    testType: parseString(resource.attributes['test_type']),
    passingScore: parseOptionalNumber(resource.attributes['passing_score']),
    timeLimit: parseOptionalNumber(resource.attributes['time_limit']),
    maxAttempts: parseOptionalNumber(resource.attributes['max_attempts']),
    shuffleQuestions: parseBoolean(resource.attributes['shuffle_questions']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};

export const testQuestionMapper: ResourceMapper<TestQuestion> = {
  type: 'test_question',
  map: (resource) => ({
    uniqueId: resource.id,
    testUniqueId: parseString(resource.attributes['test_unique_id']) ?? '',
    questionText: parseString(resource.attributes['question_text']) ?? '',
    questionType: (parseString(resource.attributes['question_type']) as TestQuestion['questionType']) ?? 'multiple_choice',
    points: parseOptionalNumber(resource.attributes['points']),
    sortOrder: parseOptionalNumber(resource.attributes['sort_order']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const testOptionMapper: ResourceMapper<TestOption> = {
  type: 'test_option',
  map: (resource) => ({
    uniqueId: resource.id,
    questionUniqueId: parseString(resource.attributes['question_unique_id']) ?? '',
    optionText: parseString(resource.attributes['option_text']) ?? '',
    isCorrect: parseBoolean(resource.attributes['is_correct']),
    sortOrder: parseOptionalNumber(resource.attributes['sort_order']),
  }),
};
