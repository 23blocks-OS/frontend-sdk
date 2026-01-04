import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Note } from '../types/note';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

function parseNoteType(value: unknown): 'general' | 'private' | 'shared' | 'feedback' | 'comment' {
  const type = parseString(value);
  if (type === 'general' || type === 'private' || type === 'shared' || type === 'feedback' || type === 'comment') {
    return type;
  }
  return 'general';
}

function parseVisibility(value: unknown): 'private' | 'instructors' | 'students' | 'public' {
  const visibility = parseString(value);
  if (visibility === 'private' || visibility === 'instructors' || visibility === 'students' || visibility === 'public') {
    return visibility;
  }
  return 'private';
}

export const noteMapper: ResourceMapper<Note> = {
  type: 'Note',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    authorUniqueId: parseString(resource.attributes['author_unique_id']) || '',
    authorType: parseString(resource.attributes['author_type']) || '',
    authorName: parseString(resource.attributes['author_name']),
    targetUniqueId: parseString(resource.attributes['target_unique_id']) || '',
    targetType: parseString(resource.attributes['target_type']) || '',
    courseUniqueId: parseString(resource.attributes['course_unique_id']),
    lessonUniqueId: parseString(resource.attributes['lesson_unique_id']),
    title: parseString(resource.attributes['title']),
    content: parseString(resource.attributes['content']) || '',
    noteType: parseNoteType(resource.attributes['note_type']),
    visibility: parseVisibility(resource.attributes['visibility']),
    isPinned: parseBoolean(resource.attributes['is_pinned']),
    parentNoteUniqueId: parseString(resource.attributes['parent_note_unique_id']),
    attachmentUrls: parseStringArray(resource.attributes['attachment_urls']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
