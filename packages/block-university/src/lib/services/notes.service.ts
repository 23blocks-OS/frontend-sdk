import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  ListNotesParams,
} from '../types/note';
import { noteMapper } from '../mappers/note.mapper';

export interface NotesService {
  list(params?: ListNotesParams): Promise<PageResult<Note>>;
  get(uniqueId: string): Promise<Note>;
  create(data: CreateNoteRequest): Promise<Note>;
  update(uniqueId: string, data: UpdateNoteRequest): Promise<Note>;
  delete(uniqueId: string): Promise<void>;
  listByAuthor(authorUniqueId: string, params?: ListNotesParams): Promise<PageResult<Note>>;
  listByTarget(targetUniqueId: string, targetType: string, params?: ListNotesParams): Promise<PageResult<Note>>;
  listByCourse(courseUniqueId: string, params?: ListNotesParams): Promise<PageResult<Note>>;
  listByLesson(lessonUniqueId: string, params?: ListNotesParams): Promise<PageResult<Note>>;
  pin(uniqueId: string): Promise<Note>;
  unpin(uniqueId: string): Promise<Note>;
  getReplies(uniqueId: string): Promise<Note[]>;
}

export function createNotesService(transport: Transport, _config: { appId: string }): NotesService {
  return {
    async list(params?: ListNotesParams): Promise<PageResult<Note>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.authorUniqueId) queryParams['author_unique_id'] = params.authorUniqueId;
      if (params?.targetUniqueId) queryParams['target_unique_id'] = params.targetUniqueId;
      if (params?.targetType) queryParams['target_type'] = params.targetType;
      if (params?.courseUniqueId) queryParams['course_unique_id'] = params.courseUniqueId;
      if (params?.lessonUniqueId) queryParams['lesson_unique_id'] = params.lessonUniqueId;
      if (params?.noteType) queryParams['note_type'] = params.noteType;
      if (params?.visibility) queryParams['visibility'] = params.visibility;
      if (params?.isPinned !== undefined) queryParams['is_pinned'] = String(params.isPinned);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/notes', { params: queryParams });
      return decodePageResult(response, noteMapper);
    },

    async get(uniqueId: string): Promise<Note> {
      const response = await transport.get<unknown>(`/notes/${uniqueId}`);
      return decodeOne(response, noteMapper);
    },

    async create(data: CreateNoteRequest): Promise<Note> {
      const response = await transport.post<unknown>('/notes', {
        note: {
          target_unique_id: data.targetUniqueId,
          target_type: data.targetType,
          course_unique_id: data.courseUniqueId,
          lesson_unique_id: data.lessonUniqueId,
          title: data.title,
          content: data.content,
          note_type: data.noteType,
          visibility: data.visibility,
          parent_note_unique_id: data.parentNoteUniqueId,
          attachment_urls: data.attachmentUrls,
          payload: data.payload,
        },
      });
      return decodeOne(response, noteMapper);
    },

    async update(uniqueId: string, data: UpdateNoteRequest): Promise<Note> {
      const response = await transport.put<unknown>(`/notes/${uniqueId}`, {
        note: {
          title: data.title,
          content: data.content,
          note_type: data.noteType,
          visibility: data.visibility,
          is_pinned: data.isPinned,
          attachment_urls: data.attachmentUrls,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, noteMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/notes/${uniqueId}`);
    },

    async listByAuthor(authorUniqueId: string, params?: ListNotesParams): Promise<PageResult<Note>> {
      const queryParams: Record<string, string> = {
        author_unique_id: authorUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.targetType) queryParams['target_type'] = params.targetType;
      if (params?.noteType) queryParams['note_type'] = params.noteType;
      if (params?.visibility) queryParams['visibility'] = params.visibility;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/notes', { params: queryParams });
      return decodePageResult(response, noteMapper);
    },

    async listByTarget(targetUniqueId: string, targetType: string, params?: ListNotesParams): Promise<PageResult<Note>> {
      const queryParams: Record<string, string> = {
        target_unique_id: targetUniqueId,
        target_type: targetType,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.noteType) queryParams['note_type'] = params.noteType;
      if (params?.visibility) queryParams['visibility'] = params.visibility;
      if (params?.isPinned !== undefined) queryParams['is_pinned'] = String(params.isPinned);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/notes', { params: queryParams });
      return decodePageResult(response, noteMapper);
    },

    async listByCourse(courseUniqueId: string, params?: ListNotesParams): Promise<PageResult<Note>> {
      const queryParams: Record<string, string> = {
        course_unique_id: courseUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.authorUniqueId) queryParams['author_unique_id'] = params.authorUniqueId;
      if (params?.noteType) queryParams['note_type'] = params.noteType;
      if (params?.visibility) queryParams['visibility'] = params.visibility;
      if (params?.isPinned !== undefined) queryParams['is_pinned'] = String(params.isPinned);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/notes', { params: queryParams });
      return decodePageResult(response, noteMapper);
    },

    async listByLesson(lessonUniqueId: string, params?: ListNotesParams): Promise<PageResult<Note>> {
      const queryParams: Record<string, string> = {
        lesson_unique_id: lessonUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.authorUniqueId) queryParams['author_unique_id'] = params.authorUniqueId;
      if (params?.noteType) queryParams['note_type'] = params.noteType;
      if (params?.visibility) queryParams['visibility'] = params.visibility;
      if (params?.isPinned !== undefined) queryParams['is_pinned'] = String(params.isPinned);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/notes', { params: queryParams });
      return decodePageResult(response, noteMapper);
    },

    async pin(uniqueId: string): Promise<Note> {
      const response = await transport.put<unknown>(`/notes/${uniqueId}/pin`, {});
      return decodeOne(response, noteMapper);
    },

    async unpin(uniqueId: string): Promise<Note> {
      const response = await transport.put<unknown>(`/notes/${uniqueId}/unpin`, {});
      return decodeOne(response, noteMapper);
    },

    async getReplies(uniqueId: string): Promise<Note[]> {
      const response = await transport.get<unknown>(`/notes/${uniqueId}/replies`);
      return decodeMany(response, noteMapper);
    },
  };
}
