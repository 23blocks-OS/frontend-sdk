// Block factory and metadata
export { createUniversityBlock, universityBlockMetadata } from './lib/university.block';
export type { UniversityBlock, UniversityBlockConfig } from './lib/university.block';

// Types
export type {
  // Course types
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  ListCoursesParams,
  // Lesson types
  Lesson,
  LessonContentType,
  CreateLessonRequest,
  UpdateLessonRequest,
  ListLessonsParams,
  ReorderLessonsRequest,
  // Enrollment types
  Enrollment,
  EnrollmentStatus,
  EnrollRequest,
  UpdateEnrollmentProgressRequest,
  ListEnrollmentsParams,
  // Assignment types
  Assignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  ListAssignmentsParams,
  // Submission types
  Submission,
  SubmissionStatus,
  SubmitAssignmentRequest,
  GradeSubmissionRequest,
  ListSubmissionsParams,
} from './lib/types';

// Services
export type {
  CoursesService,
  LessonsService,
  EnrollmentsService,
  AssignmentsService,
  SubmissionsService,
} from './lib/services';

export {
  createCoursesService,
  createLessonsService,
  createEnrollmentsService,
  createAssignmentsService,
  createSubmissionsService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  courseMapper,
  lessonMapper,
  enrollmentMapper,
  assignmentMapper,
  submissionMapper,
} from './lib/mappers';
