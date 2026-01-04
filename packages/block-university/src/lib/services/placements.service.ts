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
} from '../types/placement';
import {
  placementTestMapper,
  placementSectionMapper,
  placementQuestionMapper,
  placementOptionMapper,
  placementRuleMapper,
  placementInstanceMapper,
} from '../mappers/placement.mapper';

export interface PlacementsService {
  // Placement Tests
  get(uniqueId: string): Promise<PlacementTest>;
  listByCourse(courseUniqueId: string, params?: ListPlacementsParams): Promise<PageResult<PlacementTest>>;
  create(courseUniqueId: string, data: CreatePlacementRequest): Promise<PlacementTest>;

  // Sections
  getSection(placementUniqueId: string, sectionId: string): Promise<PlacementSection>;
  createSection(placementUniqueId: string, data: CreatePlacementSectionRequest): Promise<PlacementSection>;

  // Questions
  getQuestion(placementUniqueId: string, questionId: string): Promise<PlacementQuestion>;
  createQuestion(placementUniqueId: string, data: CreatePlacementQuestionRequest): Promise<PlacementQuestion>;
  addQuestionToSection(placementUniqueId: string, sectionId: string, questionId: string): Promise<void>;

  // Options
  listOptions(): Promise<PlacementOption[]>;
  createOption(data: CreatePlacementOptionRequest): Promise<PlacementOption>;
  addOptionToQuestion(placementUniqueId: string, questionId: string, optionId: string): Promise<void>;
  setRightOption(placementUniqueId: string, questionId: string, optionId: string): Promise<void>;
  removeOption(placementUniqueId: string, questionId: string, optionId: string): Promise<void>;

  // Rules
  createRule(placementUniqueId: string, data: CreatePlacementRuleRequest): Promise<PlacementRule>;

  // User Placements
  getUserPlacement(userUniqueId: string): Promise<PlacementInstance | null>;
  startPlacement(userUniqueId: string, placementUniqueId: string): Promise<PlacementInstance>;
  submitResponse(userUniqueId: string, instanceUniqueId: string, responses: PlacementResponse[]): Promise<PlacementInstance>;
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
