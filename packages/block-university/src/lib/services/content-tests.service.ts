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
} from '../types/content-test.js';
import { contentTestMapper, testQuestionMapper, testOptionMapper } from '../mappers/content-test.mapper.js';

export interface ContentTestsService {
  /**
   * List content tests with optional filtering and sorting.
   * @returns Paginated list of ContentTest records with metadata.
   */
  list(params?: ListContentTestsParams): Promise<PageResult<ContentTest>>;

  /**
   * Get a single content test by unique ID.
   * @returns The matching ContentTest record.
   */
  get(uniqueId: string): Promise<ContentTest>;

  /**
   * Create a new content test.
   * @returns The newly created ContentTest record.
   */
  create(data: CreateContentTestRequest): Promise<ContentTest>;

  /**
   * Update an existing content test.
   * @returns The updated ContentTest record.
   */
  update(uniqueId: string, data: UpdateContentTestRequest): Promise<ContentTest>;

  /**
   * Get test results for a content test.
   * @returns Array of result objects.
   */
  getResults(uniqueId: string): Promise<unknown[]>;

  /**
   * Get the solution for a content test.
   * @returns The solution data.
   */
  getSolution(uniqueId: string): Promise<unknown>;

  /**
   * Create a question for a content test.
   * @returns The newly created TestQuestion record.
   */
  createQuestion(uniqueId: string, data: CreateQuestionRequest): Promise<TestQuestion>;

  /**
   * Update a question within a content test.
   * @returns The updated TestQuestion record.
   */
  updateQuestion(uniqueId: string, questionUniqueId: string, data: Partial<CreateQuestionRequest>): Promise<TestQuestion>;

  /**
   * Get a specific question within a content test.
   * @returns The matching TestQuestion record.
   */
  getQuestion(uniqueId: string, questionId: string): Promise<TestQuestion>;

  /**
   * List all available test options.
   * @returns Array of TestOption records.
   */
  listOptions(): Promise<TestOption[]>;

  /**
   * Create a new test option.
   * @returns The newly created TestOption record.
   */
  createOption(data: CreateOptionRequest): Promise<TestOption>;

  /**
   * Update an existing test option.
   * @returns The updated TestOption record.
   */
  updateOption(uniqueId: string, optionUniqueId: string, data: Partial<CreateOptionRequest>): Promise<TestOption>;

  /**
   * Add an option to a question within a content test.
   * @returns The updated TestQuestion record with the option linked.
   */
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
