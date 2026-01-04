import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Note extends IdentityCore {
  authorUniqueId: string;
  authorType: string;
  authorName?: string;
  targetUniqueId: string;
  targetType: string;
  courseUniqueId?: string;
  lessonUniqueId?: string;
  title?: string;
  content: string;
  noteType: 'general' | 'private' | 'shared' | 'feedback' | 'comment';
  visibility: 'private' | 'instructors' | 'students' | 'public';
  isPinned: boolean;
  parentNoteUniqueId?: string;
  attachmentUrls?: string[];
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateNoteRequest {
  targetUniqueId: string;
  targetType: string;
  courseUniqueId?: string;
  lessonUniqueId?: string;
  title?: string;
  content: string;
  noteType?: 'general' | 'private' | 'shared' | 'feedback' | 'comment';
  visibility?: 'private' | 'instructors' | 'students' | 'public';
  parentNoteUniqueId?: string;
  attachmentUrls?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  noteType?: 'general' | 'private' | 'shared' | 'feedback' | 'comment';
  visibility?: 'private' | 'instructors' | 'students' | 'public';
  isPinned?: boolean;
  attachmentUrls?: string[];
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListNotesParams {
  page?: number;
  perPage?: number;
  authorUniqueId?: string;
  targetUniqueId?: string;
  targetType?: string;
  courseUniqueId?: string;
  lessonUniqueId?: string;
  noteType?: 'general' | 'private' | 'shared' | 'feedback' | 'comment';
  visibility?: 'private' | 'instructors' | 'students' | 'public';
  isPinned?: boolean;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
