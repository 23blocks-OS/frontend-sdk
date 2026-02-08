import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createCoursesService,
  createLessonsService,
  createEnrollmentsService,
  createAssignmentsService,
  createSubmissionsService,
  createSubjectsService,
  createTeachersService,
  createStudentsService,
  createCourseGroupsService,
  createCoachingSessionsService,
  createContentTestsService,
  createPlacementsService,
  createCalendarsService,
  createMatchesService,
  createAttendanceService,
  createNotesService,
  createRegistrationTokensService,
  type CoursesService,
  type LessonsService,
  type EnrollmentsService,
  type AssignmentsService,
  type SubmissionsService,
  type SubjectsService,
  type TeachersService,
  type StudentsService,
  type CourseGroupsService,
  type CoachingSessionsService,
  type ContentTestsService,
  type PlacementsService,
  type CalendarsService,
  type MatchesService,
  type AttendanceService,
  type NotesService,
  type RegistrationTokensService,
} from './services/index.js';

/**
 * Configuration for the University block.
 */
export interface UniversityBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Education and learning management block interface.
 */
export interface UniversityBlock {
  /** Course CRUD operations */
  courses: CoursesService;
  /** Lesson management */
  lessons: LessonsService;
  /** Student enrollment management */
  enrollments: EnrollmentsService;
  /** Assignment management */
  assignments: AssignmentsService;
  /** Assignment submission management */
  submissions: SubmissionsService;
  /** Subject/topic management */
  subjects: SubjectsService;
  /** Teacher management */
  teachers: TeachersService;
  /** Student management */
  students: StudentsService;
  /** Course group management */
  courseGroups: CourseGroupsService;
  /** Coaching session management */
  coachingSessions: CoachingSessionsService;
  /** Content test management */
  tests: ContentTestsService;
  /** Placement test management */
  placements: PlacementsService;
  /** Calendar and scheduling management */
  calendars: CalendarsService;
  /** Student-teacher match management */
  matches: MatchesService;
  /** Attendance tracking */
  attendance: AttendanceService;
  /** Note management */
  notes: NotesService;
  /** Registration token management */
  registrationTokens: RegistrationTokensService;
}

/**
 * Create the University block.
 *
 * @example
 * ```typescript
 * const block = createUniversityBlock(transport, { appId: 'xxx' });
 * const courses = await block.courses.list({ page: 1 });
 * ```
 */
export function createUniversityBlock(
  transport: Transport,
  config: UniversityBlockConfig
): UniversityBlock {
  return {
    courses: createCoursesService(transport, config),
    lessons: createLessonsService(transport, config),
    enrollments: createEnrollmentsService(transport, config),
    assignments: createAssignmentsService(transport, config),
    submissions: createSubmissionsService(transport, config),
    subjects: createSubjectsService(transport, config),
    teachers: createTeachersService(transport, config),
    students: createStudentsService(transport, config),
    courseGroups: createCourseGroupsService(transport, config),
    coachingSessions: createCoachingSessionsService(transport, config),
    tests: createContentTestsService(transport, config),
    placements: createPlacementsService(transport, config),
    calendars: createCalendarsService(transport, config),
    matches: createMatchesService(transport, config),
    attendance: createAttendanceService(transport, config),
    notes: createNotesService(transport, config),
    registrationTokens: createRegistrationTokensService(transport, config),
  };
}

export const universityBlockMetadata: BlockMetadata = {
  name: 'university',
  version: '0.1.0',
  description: 'University and education management - courses, lessons, enrollments, assignments, submissions, placements, calendars, and coaching matches',
  resourceTypes: [
    'Course',
    'Lesson',
    'Enrollment',
    'Assignment',
    'Submission',
    'Subject',
    'Teacher',
    'Student',
    'CourseGroup',
    'CoachingSession',
    'ContentTest',
    'TestQuestion',
    'TestOption',
    'PlacementTest',
    'PlacementSection',
    'PlacementQuestion',
    'PlacementOption',
    'PlacementRule',
    'PlacementInstance',
    'Availability',
    'CalendarEvent',
    'Match',
    'MatchEvaluation',
    'Attendance',
    'Note',
    'RegistrationToken',
  ],
};
