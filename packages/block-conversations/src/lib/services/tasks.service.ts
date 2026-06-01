import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import type { Task } from '../types/conversation.js';

export type TaskStatus = 'pending' | 'completed' | 'dismissed';
export type TaskPriority = 'normal' | 'high' | 'urgent';

export interface ListTasksForConversationParams {
  status?: TaskStatus;
  page?: number;
  perPage?: number;
}

export interface ListTasksForUserParams {
  status?: TaskStatus;
  contextUniqueId?: string;
  reference?: string;
  source?: string;
  sourceType?: string;
  sourceId?: string;
  page?: number;
  perPage?: number;
}

export interface CreateTaskRequest {
  description: string;
  priority?: TaskPriority;
  /** Optional summary id to link this task to (when manually filing under a summary). */
  conversationSummaryId?: string;
}

export interface UpdateTaskRequest {
  description?: string;
  priority?: TaskPriority;
}

function parseTaskResource(data: any): Task {
  const a = data?.attributes ?? data ?? {};
  return {
    uniqueId: String(a.unique_id ?? data?.id ?? ''),
    description: String(a.description ?? ''),
    priority: a.priority as TaskPriority | undefined,
    status: a.status as TaskStatus | undefined,
    completedAt: a.completed_at ? new Date(a.completed_at) : undefined,
    dismissedAt: a.dismissed_at ? new Date(a.dismissed_at) : undefined,
    contextUniqueId: a.context_unique_id as string | undefined,
    userUniqueId: a.user_unique_id as string | undefined,
    createdAt: a.created_at ? new Date(a.created_at) : undefined,
    updatedAt: a.updated_at ? new Date(a.updated_at) : undefined,
  };
}

function decodeTask(response: unknown): Task {
  const doc = response as { data?: unknown } | null | undefined;
  return parseTaskResource(doc?.data ?? response ?? {});
}

function decodeTaskPage(response: unknown): PageResult<Task> {
  const doc = response as { data?: unknown[]; meta?: Record<string, unknown> } | null | undefined;
  const data = Array.isArray(doc?.data) ? doc!.data.map(parseTaskResource) : [];
  const meta = doc?.meta ?? {};
  return {
    data,
    meta: {
      totalCount: Number(meta['total_count'] ?? meta['totalRecords'] ?? data.length),
      currentPage: Number(meta['current_page'] ?? meta['currentPage'] ?? 1),
      perPage: Number(meta['per_page'] ?? meta['perPage'] ?? data.length),
      totalPages: Number(meta['total_pages'] ?? meta['totalPages'] ?? 1),
    },
  };
}

export interface TasksService {
  /**
   * List tasks scoped to a single conversation (context).
   * Requires `conversations:read`.
   */
  listForConversation(contextUniqueId: string, params?: ListTasksForConversationParams): Promise<PageResult<Task>>;

  /**
   * List tasks across all conversations the user has access to, optionally
   * filtered by status / context / reference / source. Used for cross-
   * conversation task digests ("my pending tasks across everything").
   * Requires `conversations:read`.
   */
  listForUser(userUniqueId: string, params?: ListTasksForUserParams): Promise<PageResult<Task>>;

  /**
   * Manually create a task on a conversation. Most tasks are auto-created
   * from AI summary action_items; use this when consumers want to file a
   * task by hand. Requires `conversations:write`.
   */
  create(contextUniqueId: string, data: CreateTaskRequest): Promise<Task>;

  /**
   * Update task attributes (description and/or priority). Cannot be combined
   * with a lifecycle action in the same call — use `complete`/`dismiss`/
   * `reopen` for status transitions. Requires `conversations:write`.
   */
  update(uniqueId: string, data: UpdateTaskRequest): Promise<Task>;

  /**
   * Mark a task as completed. Sets status='completed' and completed_at.
   * Requires `conversations:write`.
   */
  complete(uniqueId: string): Promise<Task>;

  /**
   * Dismiss a task (user doesn't want to do it). Sets status='dismissed'
   * and dismissed_at. Requires `conversations:write`.
   */
  dismiss(uniqueId: string): Promise<Task>;

  /**
   * Reopen a previously completed or dismissed task. Returns status to
   * 'pending' and clears completed_at/dismissed_at. Requires
   * `conversations:write`.
   */
  reopen(uniqueId: string): Promise<Task>;

  /**
   * Hard-delete a task. Requires `conversations:write`.
   */
  delete(uniqueId: string): Promise<void>;
}

export function createTasksService(transport: Transport, _config: { apiKey: string }): TasksService {
  const queryParamsForUser = (params?: ListTasksForUserParams): Record<string, string> => {
    const q: Record<string, string> = {};
    if (params?.status) q['status'] = params.status;
    if (params?.contextUniqueId) q['context_unique_id'] = params.contextUniqueId;
    if (params?.reference) q['reference'] = params.reference;
    if (params?.source) q['source'] = params.source;
    if (params?.sourceType) q['source_type'] = params.sourceType;
    if (params?.sourceId) q['source_id'] = params.sourceId;
    if (params?.page) q['page'] = String(params.page);
    if (params?.perPage) q['records'] = String(params.perPage);
    return q;
  };

  return {
    async listForConversation(contextUniqueId, params): Promise<PageResult<Task>> {
      assertUuid(contextUniqueId, 'contextUniqueId');
      const q: Record<string, string> = {};
      if (params?.status) q['status'] = params.status;
      if (params?.page) q['page'] = String(params.page);
      if (params?.perPage) q['records'] = String(params.perPage);
      const response = await transport.get<unknown>(`/conversations/${contextUniqueId}/tasks`, { params: q });
      return decodeTaskPage(response);
    },

    async listForUser(userUniqueId, params): Promise<PageResult<Task>> {
      assertUuid(userUniqueId, 'userUniqueId');
      const response = await transport.get<unknown>(`/users/${userUniqueId}/tasks`, {
        params: queryParamsForUser(params),
      });
      return decodeTaskPage(response);
    },

    async create(contextUniqueId, data): Promise<Task> {
      assertUuid(contextUniqueId, 'contextUniqueId');
      const body: Record<string, unknown> = { description: data.description };
      if (data.priority) body['priority'] = data.priority;
      if (data.conversationSummaryId) body['conversation_summary_id'] = data.conversationSummaryId;
      const response = await transport.post<unknown>(`/conversations/${contextUniqueId}/tasks`, { task: body });
      return decodeTask(response);
    },

    async update(uniqueId, data): Promise<Task> {
      assertUuid(uniqueId, 'uniqueId');
      const body: Record<string, unknown> = {};
      if (data.description !== undefined) body['description'] = data.description;
      if (data.priority) body['priority'] = data.priority;
      const response = await transport.put<unknown>(`/tasks/${uniqueId}`, { task: body });
      return decodeTask(response);
    },

    async complete(uniqueId): Promise<Task> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/tasks/${uniqueId}`, {}, { params: { action_type: 'complete' } });
      return decodeTask(response);
    },

    async dismiss(uniqueId): Promise<Task> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/tasks/${uniqueId}`, {}, { params: { action_type: 'dismiss' } });
      return decodeTask(response);
    },

    async reopen(uniqueId): Promise<Task> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/tasks/${uniqueId}`, {}, { params: { action_type: 'reopen' } });
      return decodeTask(response);
    },

    async delete(uniqueId): Promise<void> {
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/tasks/${uniqueId}`);
    },
  };
}
