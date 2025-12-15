import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ContentTest,
  TestQuestion,
  TestOption,
  CreateContentTestRequest,
  UpdateContentTestRequest,
  CreateQuestionRequest,
  CreateOptionRequest,
  ListContentTestsParams,
} from '../types/content-test';
import { contentTestMapper, testQuestionMapper, testOptionMapper } from '../mappers/content-test.mapper';

export interface ContentTestsService {
  list(params?: ListContentTestsParams): Promise<PageResult<ContentTest>>;
  get(uniqueId: string): Promise<ContentTest>;
  create(data: CreateContentTestRequest): Promise<ContentTest>;
  update(uniqueId: string, data: UpdateContentTestRequest): Promise<ContentTest>;
  getResults(uniqueId: string): Promise<unknown[]>;
  getSolution(uniqueId: string): Promise<unknown>;
  createQuestion(uniqueId: string, data: CreateQuestionRequest): Promise<TestQuestion>;
  updateQuestion(uniqueId: string, questionUniqueId: string, data: Partial<CreateQuestionRequest>): Promise<TestQuestion>;
  getQuestion(uniqueId: string, questionId: string): Promise<TestQuestion>;
  listOptions(): Promise<TestOption[]>;
  createOption(data: CreateOptionRequest): Promise<TestOption>;
  updateOption(uniqueId: string, optionUniqueId: string, data: Partial<CreateOptionRequest>): Promise<TestOption>;
  addOptionToQuestion(uniqueId: string, questionId: string, optionId: string): Promise<TestQuestion>;
}

export function createContentTestsService(transport: Transport, _config: { appId: string }): ContentTestsService {
  return {
    async list(params?: ListContentTestsParams): Promise<PageResult<ContentTest>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.courseUniqueId) queryParams['course_unique_id'] = params.courseUniqueId;
      if (params?.subjectUniqueId) queryParams['subject_unique_id'] = params.subjectUniqueId;
      if (params?.lessonUniqueId) queryParams['lesson_unique_id'] = params.lessonUniqueId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/tests', { params: queryParams });
      return decodePageResult(response, contentTestMapper);
    },

    async get(uniqueId: string): Promise<ContentTest> {
      const response = await transport.get<unknown>(`/tests/${uniqueId}`);
      return decodeOne(response, contentTestMapper);
    },

    async create(data: CreateContentTestRequest): Promise<ContentTest> {
      const response = await transport.post<unknown>('/tests/', {
        test: {
          name: data.name,
          description: data.description,
          course_unique_id: data.courseUniqueId,
          subject_unique_id: data.subjectUniqueId,
          lesson_unique_id: data.lessonUniqueId,
          test_type: data.testType,
          passing_score: data.passingScore,
          time_limit: data.timeLimit,
          max_attempts: data.maxAttempts,
          shuffle_questions: data.shuffleQuestions,
          payload: data.payload,
        },
      });
      return decodeOne(response, contentTestMapper);
    },

    async update(uniqueId: string, data: UpdateContentTestRequest): Promise<ContentTest> {
      const response = await transport.put<unknown>(`/tests/${uniqueId}`, {
        test: {
          name: data.name,
          description: data.description,
          test_type: data.testType,
          passing_score: data.passingScore,
          time_limit: data.timeLimit,
          max_attempts: data.maxAttempts,
          shuffle_questions: data.shuffleQuestions,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, contentTestMapper);
    },

    async getResults(uniqueId: string): Promise<unknown[]> {
      const response = await transport.get<unknown>(`/test/${uniqueId}/results`);
      return Array.isArray(response) ? response : [];
    },

    async getSolution(uniqueId: string): Promise<unknown> {
      const response = await transport.get<unknown>(`/test/${uniqueId}/solution`);
      return response;
    },

    async createQuestion(uniqueId: string, data: CreateQuestionRequest): Promise<TestQuestion> {
      const response = await transport.post<unknown>(`/tests/${uniqueId}/questions`, {
        question: {
          question_text: data.questionText,
          question_type: data.questionType,
          points: data.points,
          sort_order: data.sortOrder,
          payload: data.payload,
        },
      });
      return decodeOne(response, testQuestionMapper);
    },

    async updateQuestion(uniqueId: string, questionUniqueId: string, data: Partial<CreateQuestionRequest>): Promise<TestQuestion> {
      const response = await transport.put<unknown>(`/tests/${uniqueId}/questions/${questionUniqueId}`, {
        question: {
          question_text: data.questionText,
          question_type: data.questionType,
          points: data.points,
          sort_order: data.sortOrder,
          payload: data.payload,
        },
      });
      return decodeOne(response, testQuestionMapper);
    },

    async getQuestion(uniqueId: string, questionId: string): Promise<TestQuestion> {
      const response = await transport.get<unknown>(`/tests/${uniqueId}/questions/${questionId}`);
      return decodeOne(response, testQuestionMapper);
    },

    async listOptions(): Promise<TestOption[]> {
      const response = await transport.get<unknown>('/tests/questions/options');
      return decodeMany(response, testOptionMapper);
    },

    async createOption(data: CreateOptionRequest): Promise<TestOption> {
      const response = await transport.post<unknown>('/tests/options', {
        option: {
          option_text: data.optionText,
          is_correct: data.isCorrect,
          sort_order: data.sortOrder,
        },
      });
      return decodeOne(response, testOptionMapper);
    },

    async updateOption(uniqueId: string, optionUniqueId: string, data: Partial<CreateOptionRequest>): Promise<TestOption> {
      const response = await transport.put<unknown>(`/tests/${uniqueId}/options/${optionUniqueId}`, {
        option: {
          option_text: data.optionText,
          is_correct: data.isCorrect,
          sort_order: data.sortOrder,
        },
      });
      return decodeOne(response, testOptionMapper);
    },

    async addOptionToQuestion(uniqueId: string, questionId: string, optionId: string): Promise<TestQuestion> {
      const response = await transport.put<unknown>(`/tests/${uniqueId}/questions/${questionId}/options`, {
        option_id: optionId,
      });
      return decodeOne(response, testQuestionMapper);
    },
  };
}
