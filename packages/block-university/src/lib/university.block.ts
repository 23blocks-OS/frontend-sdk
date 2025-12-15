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
} from './services';

export interface UniversityBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface UniversityBlock {
  courses: CoursesService;
  lessons: LessonsService;
  enrollments: EnrollmentsService;
  assignments: AssignmentsService;
  submissions: SubmissionsService;
  subjects: SubjectsService;
  teachers: TeachersService;
  students: StudentsService;
  courseGroups: CourseGroupsService;
  coachingSessions: CoachingSessionsService;
  tests: ContentTestsService;
}

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
  };
}

export const universityBlockMetadata: BlockMetadata = {
  name: 'university',
  version: '0.1.0',
  description: 'University and education management - courses, lessons, enrollments, assignments, submissions',
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
  ],
};
