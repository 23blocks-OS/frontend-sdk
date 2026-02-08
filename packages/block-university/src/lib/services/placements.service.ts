import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  PlacementTest,
  PlacementSection,
  PlacementQuestion,
  PlacementOption,
  PlacementRule,
  PlacementInstance,
  CreatePlacementRequest,
  CreatePlacementSectionRequest,
  CreatePlacementQuestionRequest,
  CreatePlacementOptionRequest,
  CreatePlacementRuleRequest,
  PlacementResponse,
  ListPlacementsParams,
} from '../types/placement.js';
import {
  placementTestMapper,
  placementSectionMapper,
  placementQuestionMapper,
  placementOptionMapper,
  placementRuleMapper,
  placementInstanceMapper,
} from '../mappers/placement.mapper.js';

export interface PlacementsService {
  // Placement Tests

  /**
   * Get a placement test by unique ID.
   * @returns The matching PlacementTest record.
   */
  get(uniqueId: string): Promise<PlacementTest>;

  /**
   * List placement tests for a course.
   * @returns Paginated list of PlacementTest records.
   */
  listByCourse(courseUniqueId: string, params?: ListPlacementsParams): Promise<PageResult<PlacementTest>>;

  /**
   * Create a new placement test for a course.
   * @returns The newly created PlacementTest record.
   */
  create(courseUniqueId: string, data: CreatePlacementRequest): Promise<PlacementTest>;

  // Sections

  /**
   * Get a section within a placement test.
   * @returns The matching PlacementSection record.
   */
  getSection(placementUniqueId: string, sectionId: string): Promise<PlacementSection>;

  /**
   * Create a section for a placement test.
   * @returns The newly created PlacementSection record.
   */
  createSection(placementUniqueId: string, data: CreatePlacementSectionRequest): Promise<PlacementSection>;

  // Questions

  /**
   * Get a question within a placement test.
   * @returns The matching PlacementQuestion record.
   */
  getQuestion(placementUniqueId: string, questionId: string): Promise<PlacementQuestion>;

  /**
   * Create a question for a placement test.
   * @returns The newly created PlacementQuestion record.
   */
  createQuestion(placementUniqueId: string, data: CreatePlacementQuestionRequest): Promise<PlacementQuestion>;

  /**
   * Add a question to a section in a placement test.
   */
  addQuestionToSection(placementUniqueId: string, sectionId: string, questionId: string): Promise<void>;

  // Options

  /**
   * List all available placement options.
   * @returns Array of PlacementOption records.
   */
  listOptions(): Promise<PlacementOption[]>;

  /**
   * Create a new placement option.
   * @returns The newly created PlacementOption record.
   */
  createOption(data: CreatePlacementOptionRequest): Promise<PlacementOption>;

  /**
   * Add an option to a question.
   */
  addOptionToQuestion(placementUniqueId: string, questionId: string, optionId: string): Promise<void>;

  /**
   * Set an option as the correct answer for a question.
   */
  setRightOption(placementUniqueId: string, questionId: string, optionId: string): Promise<void>;

  /**
   * Remove an option from a question.
   */
  removeOption(placementUniqueId: string, questionId: string, optionId: string): Promise<void>;

  // Rules

  /**
   * Create a placement rule for score-based assignment.
   * @returns The newly created PlacementRule record.
   */
  createRule(placementUniqueId: string, data: CreatePlacementRuleRequest): Promise<PlacementRule>;

  // User Placements

  /**
   * Get the current placement instance for a user.
   * @returns The PlacementInstance record, or null if none exists.
   * @note Returns null instead of throwing when no placement is found.
   */
  getUserPlacement(userUniqueId: string): Promise<PlacementInstance | null>;

  /**
   * Start a placement test for a user.
   * @returns The newly created PlacementInstance record.
   */
  startPlacement(userUniqueId: string, placementUniqueId: string): Promise<PlacementInstance>;

  /**
   * Submit responses for a placement test instance.
   * @returns The updated PlacementInstance record.
   */
  submitResponse(userUniqueId: string, instanceUniqueId: string, responses: PlacementResponse[]): Promise<PlacementInstance>;

  /**
   * Finish a placement test instance and trigger scoring.
   * @returns The PlacementInstance record with final results.
   */
  finishPlacement(userUniqueId: string, instanceUniqueId: string): Promise<PlacementInstance>;
}

export function createPlacementsService(transport: Transport, _config: { appId: string }): PlacementsService {
  return {
    // Placement Tests
    async get(uniqueId: string): Promise<PlacementTest> {
      const response = await transport.get<unknown>(`/placements/${uniqueId}`);
      return decodeOne(response, placementTestMapper);
    },

    async listByCourse(courseUniqueId: string, params?: ListPlacementsParams): Promise<PageResult<PlacementTest>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;

      const response = await transport.get<unknown>(`/courses/${courseUniqueId}/placement`, { params: queryParams });
      return decodePageResult(response, placementTestMapper);
    },

    async create(courseUniqueId: string, data: CreatePlacementRequest): Promise<PlacementTest> {
      const response = await transport.post<unknown>(`/courses/${courseUniqueId}/placement`, {
        placement: {
          name: data.name,
          description: data.description,
          passing_score: data.passingScore,
          time_limit: data.timeLimit,
          payload: data.payload,
        },
      });
      return decodeOne(response, placementTestMapper);
    },

    // Sections
    async getSection(placementUniqueId: string, sectionId: string): Promise<PlacementSection> {
      const response = await transport.get<unknown>(`/placements/${placementUniqueId}/sections/${sectionId}`);
      return decodeOne(response, placementSectionMapper);
    },

    async createSection(placementUniqueId: string, data: CreatePlacementSectionRequest): Promise<PlacementSection> {
      const response = await transport.post<unknown>(`/placements/${placementUniqueId}/sections`, {
        section: {
          name: data.name,
          description: data.description,
          sort_order: data.sortOrder,
        },
      });
      return decodeOne(response, placementSectionMapper);
    },

    // Questions
    async getQuestion(placementUniqueId: string, questionId: string): Promise<PlacementQuestion> {
      const response = await transport.get<unknown>(`/placements/${placementUniqueId}/questions/${questionId}`);
      return decodeOne(response, placementQuestionMapper);
    },

    async createQuestion(placementUniqueId: string, data: CreatePlacementQuestionRequest): Promise<PlacementQuestion> {
      const response = await transport.post<unknown>(`/placements/${placementUniqueId}/questions`, {
        question: {
          question_text: data.questionText,
          question_type: data.questionType,
          points: data.points,
          sort_order: data.sortOrder,
          payload: data.payload,
        },
      });
      return decodeOne(response, placementQuestionMapper);
    },

    async addQuestionToSection(placementUniqueId: string, sectionId: string, questionId: string): Promise<void> {
      await transport.put(`/placements/${placementUniqueId}/section/${sectionId}/questions`, {
        question_unique_id: questionId,
      });
    },

    // Options
    async listOptions(): Promise<PlacementOption[]> {
      const response = await transport.get<unknown>('/placements/questions/options');
      return decodeMany(response, placementOptionMapper);
    },

    async createOption(data: CreatePlacementOptionRequest): Promise<PlacementOption> {
      const response = await transport.post<unknown>('/placements/options', {
        option: {
          option_text: data.optionText,
          is_correct: data.isCorrect,
          sort_order: data.sortOrder,
        },
      });
      return decodeOne(response, placementOptionMapper);
    },

    async addOptionToQuestion(placementUniqueId: string, questionId: string, optionId: string): Promise<void> {
      await transport.put(`/placements/${placementUniqueId}/questions/${questionId}/options`, {
        option_unique_id: optionId,
      });
    },

    async setRightOption(placementUniqueId: string, questionId: string, optionId: string): Promise<void> {
      await transport.put(`/placements/${placementUniqueId}/questions/${questionId}/options/${optionId}/set-right`, {});
    },

    async removeOption(placementUniqueId: string, questionId: string, optionId: string): Promise<void> {
      await transport.delete(`/placements/${placementUniqueId}/questions/${questionId}/options/${optionId}`);
    },

    // Rules
    async createRule(placementUniqueId: string, data: CreatePlacementRuleRequest): Promise<PlacementRule> {
      const response = await transport.post<unknown>(`/placements/${placementUniqueId}/rules`, {
        rule: {
          min_score: data.minScore,
          max_score: data.maxScore,
          course_group_unique_id: data.courseGroupUniqueId,
          subject_unique_id: data.subjectUniqueId,
          action: data.action,
          payload: data.payload,
        },
      });
      return decodeOne(response, placementRuleMapper);
    },

    // User Placements
    async getUserPlacement(userUniqueId: string): Promise<PlacementInstance | null> {
      try {
        const response = await transport.get<unknown>(`/users/${userUniqueId}/placement`);
        return decodeOne(response, placementInstanceMapper);
      } catch {
        return null;
      }
    },

    async startPlacement(userUniqueId: string, placementUniqueId: string): Promise<PlacementInstance> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/placement/${placementUniqueId}`, {});
      return decodeOne(response, placementInstanceMapper);
    },

    async submitResponse(userUniqueId: string, instanceUniqueId: string, responses: PlacementResponse[]): Promise<PlacementInstance> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/placement/${instanceUniqueId}`, {
        responses: responses.map((r) => ({
          question_unique_id: r.questionUniqueId,
          option_unique_id: r.optionUniqueId,
          answer: r.answer,
        })),
      });
      return decodeOne(response, placementInstanceMapper);
    },

    async finishPlacement(userUniqueId: string, instanceUniqueId: string): Promise<PlacementInstance> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/placement/${instanceUniqueId}/finish`, {});
      return decodeOne(response, placementInstanceMapper);
    },
  };
}
