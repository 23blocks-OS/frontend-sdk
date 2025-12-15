import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createUniversityBlock,
  type UniversityBlock,
  type UniversityBlockConfig,
  type Course,
  type CreateCourseRequest,
  type UpdateCourseRequest,
  type ListCoursesParams,
  type Lesson,
  type CreateLessonRequest,
  type UpdateLessonRequest,
  type ListLessonsParams,
  type ReorderLessonsRequest,
  type Enrollment,
  type EnrollRequest,
  type UpdateEnrollmentProgressRequest,
  type ListEnrollmentsParams,
  type Assignment,
  type CreateAssignmentRequest,
  type UpdateAssignmentRequest,
  type ListAssignmentsParams,
  type Submission,
  type SubmitAssignmentRequest,
  type GradeSubmissionRequest,
  type ListSubmissionsParams,
  type Subject,
  type CreateSubjectRequest,
  type UpdateSubjectRequest,
  type ListSubjectsParams,
  type Teacher,
  type ListTeachersParams,
  type TeacherAvailability,
  type CreateAvailabilityRequest,
  type UpdateAvailabilityRequest,
  type Student,
  type ListStudentsParams,
  type RegisterStudentRequest,
  type UpdateStudentRequest,
  type StudentAvailability,
  type CourseGroup,
  type CreateCourseGroupRequest,
  type CoachingSession,
  type CreateCoachingSessionRequest,
  type UpdateCoachingSessionRequest,
  type ListCoachingSessionsParams,
  type ContentTest,
  type TestQuestion,
  type TestOption,
  type CreateContentTestRequest,
  type UpdateContentTestRequest,
  type CreateQuestionRequest,
  type CreateOptionRequest,
  type ListContentTestsParams,
} from '@23blocks/block-university';
import { TRANSPORT, UNIVERSITY_TRANSPORT, UNIVERSITY_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the University block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class CourseListComponent {
 *   constructor(private university: UniversityService) {}
 *
 *   loadCourses() {
 *     this.university.listCourses({ page: 1, perPage: 10 }).subscribe({
 *       next: (result) => console.log('Courses:', result.data),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class UniversityService {
  private readonly block: UniversityBlock | null;

  constructor(
    @Optional() @Inject(UNIVERSITY_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(UNIVERSITY_CONFIG) config: UniversityBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createUniversityBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): UniversityBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] UniversityService is not configured. ' +
        "Add 'urls.university' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Courses Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCourses(params?: ListCoursesParams): Observable<PageResult<Course>> {
    return from(this.ensureConfigured().courses.list(params));
  }

  getCourse(uniqueId: string): Observable<Course> {
    return from(this.ensureConfigured().courses.get(uniqueId));
  }

  createCourse(data: CreateCourseRequest): Observable<Course> {
    return from(this.ensureConfigured().courses.create(data));
  }

  updateCourse(uniqueId: string, data: UpdateCourseRequest): Observable<Course> {
    return from(this.ensureConfigured().courses.update(uniqueId, data));
  }

  deleteCourse(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().courses.delete(uniqueId));
  }

  publishCourse(uniqueId: string): Observable<Course> {
    return from(this.ensureConfigured().courses.publish(uniqueId));
  }

  unpublishCourse(uniqueId: string): Observable<Course> {
    return from(this.ensureConfigured().courses.unpublish(uniqueId));
  }

  listCoursesByInstructor(instructorUniqueId: string, params?: ListCoursesParams): Observable<PageResult<Course>> {
    return from(this.ensureConfigured().courses.listByInstructor(instructorUniqueId, params));
  }

  listCoursesByCategory(categoryUniqueId: string, params?: ListCoursesParams): Observable<PageResult<Course>> {
    return from(this.ensureConfigured().courses.listByCategory(categoryUniqueId, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Lessons Service
  // ─────────────────────────────────────────────────────────────────────────────

  listLessons(params?: ListLessonsParams): Observable<PageResult<Lesson>> {
    return from(this.ensureConfigured().lessons.list(params));
  }

  getLesson(uniqueId: string): Observable<Lesson> {
    return from(this.ensureConfigured().lessons.get(uniqueId));
  }

  createLesson(data: CreateLessonRequest): Observable<Lesson> {
    return from(this.ensureConfigured().lessons.create(data));
  }

  updateLesson(uniqueId: string, data: UpdateLessonRequest): Observable<Lesson> {
    return from(this.ensureConfigured().lessons.update(uniqueId, data));
  }

  deleteLesson(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().lessons.delete(uniqueId));
  }

  reorderLessons(courseUniqueId: string, data: ReorderLessonsRequest): Observable<Lesson[]> {
    return from(this.ensureConfigured().lessons.reorder(courseUniqueId, data));
  }

  listLessonsByCourse(courseUniqueId: string, params?: ListLessonsParams): Observable<PageResult<Lesson>> {
    return from(this.ensureConfigured().lessons.listByCourse(courseUniqueId, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Enrollments Service
  // ─────────────────────────────────────────────────────────────────────────────

  listEnrollments(params?: ListEnrollmentsParams): Observable<PageResult<Enrollment>> {
    return from(this.ensureConfigured().enrollments.list(params));
  }

  getEnrollment(uniqueId: string): Observable<Enrollment> {
    return from(this.ensureConfigured().enrollments.get(uniqueId));
  }

  enroll(data: EnrollRequest): Observable<Enrollment> {
    return from(this.ensureConfigured().enrollments.enroll(data));
  }

  updateEnrollmentProgress(uniqueId: string, data: UpdateEnrollmentProgressRequest): Observable<Enrollment> {
    return from(this.ensureConfigured().enrollments.updateProgress(uniqueId, data));
  }

  completeEnrollment(uniqueId: string): Observable<Enrollment> {
    return from(this.ensureConfigured().enrollments.complete(uniqueId));
  }

  dropEnrollment(uniqueId: string): Observable<Enrollment> {
    return from(this.ensureConfigured().enrollments.drop(uniqueId));
  }

  listEnrollmentsByCourse(courseUniqueId: string, params?: ListEnrollmentsParams): Observable<PageResult<Enrollment>> {
    return from(this.ensureConfigured().enrollments.listByCourse(courseUniqueId, params));
  }

  listEnrollmentsByUser(userUniqueId: string, params?: ListEnrollmentsParams): Observable<PageResult<Enrollment>> {
    return from(this.ensureConfigured().enrollments.listByUser(userUniqueId, params));
  }

  getCertificate(uniqueId: string): Observable<{ certificateUrl: string }> {
    return from(this.ensureConfigured().enrollments.getCertificate(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Assignments Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAssignments(params?: ListAssignmentsParams): Observable<PageResult<Assignment>> {
    return from(this.ensureConfigured().assignments.list(params));
  }

  getAssignment(uniqueId: string): Observable<Assignment> {
    return from(this.ensureConfigured().assignments.get(uniqueId));
  }

  createAssignment(data: CreateAssignmentRequest): Observable<Assignment> {
    return from(this.ensureConfigured().assignments.create(data));
  }

  updateAssignment(uniqueId: string, data: UpdateAssignmentRequest): Observable<Assignment> {
    return from(this.ensureConfigured().assignments.update(uniqueId, data));
  }

  deleteAssignment(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().assignments.delete(uniqueId));
  }

  listAssignmentsByLesson(lessonUniqueId: string, params?: ListAssignmentsParams): Observable<PageResult<Assignment>> {
    return from(this.ensureConfigured().assignments.listByLesson(lessonUniqueId, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Submissions Service
  // ─────────────────────────────────────────────────────────────────────────────

  listSubmissions(params?: ListSubmissionsParams): Observable<PageResult<Submission>> {
    return from(this.ensureConfigured().submissions.list(params));
  }

  getSubmission(uniqueId: string): Observable<Submission> {
    return from(this.ensureConfigured().submissions.get(uniqueId));
  }

  submitAssignment(data: SubmitAssignmentRequest): Observable<Submission> {
    return from(this.ensureConfigured().submissions.submit(data));
  }

  gradeSubmission(uniqueId: string, data: GradeSubmissionRequest): Observable<Submission> {
    return from(this.ensureConfigured().submissions.grade(uniqueId, data));
  }

  listSubmissionsByAssignment(assignmentUniqueId: string, params?: ListSubmissionsParams): Observable<PageResult<Submission>> {
    return from(this.ensureConfigured().submissions.listByAssignment(assignmentUniqueId, params));
  }

  listSubmissionsByUser(userUniqueId: string, params?: ListSubmissionsParams): Observable<PageResult<Submission>> {
    return from(this.ensureConfigured().submissions.listByUser(userUniqueId, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Subjects Service
  // ─────────────────────────────────────────────────────────────────────────────

  listSubjects(params?: ListSubjectsParams): Observable<PageResult<Subject>> {
    return from(this.ensureConfigured().subjects.list(params));
  }

  getSubject(uniqueId: string): Observable<Subject> {
    return from(this.ensureConfigured().subjects.get(uniqueId));
  }

  createSubject(data: CreateSubjectRequest): Observable<Subject> {
    return from(this.ensureConfigured().subjects.create(data));
  }

  updateSubject(uniqueId: string, data: UpdateSubjectRequest): Observable<Subject> {
    return from(this.ensureConfigured().subjects.update(uniqueId, data));
  }

  getSubjectResources(uniqueId: string): Observable<unknown[]> {
    return from(this.ensureConfigured().subjects.getResources(uniqueId));
  }

  getSubjectTeacherResources(uniqueId: string, teacherUniqueId: string): Observable<unknown[]> {
    return from(this.ensureConfigured().subjects.getTeacherResources(uniqueId, teacherUniqueId));
  }

  getSubjectTests(uniqueId: string): Observable<unknown[]> {
    return from(this.ensureConfigured().subjects.getTests(uniqueId));
  }

  addSubjectLesson(uniqueId: string, lessonData: { name: string; description?: string }): Observable<unknown> {
    return from(this.ensureConfigured().subjects.addLesson(uniqueId, lessonData));
  }

  addSubjectResource(uniqueId: string, resourceData: unknown): Observable<unknown> {
    return from(this.ensureConfigured().subjects.addResource(uniqueId, resourceData));
  }

  updateSubjectResource(uniqueId: string, resourceUniqueId: string, resourceData: unknown): Observable<unknown> {
    return from(this.ensureConfigured().subjects.updateResource(uniqueId, resourceUniqueId, resourceData));
  }

  deleteSubjectResource(uniqueId: string, resourceUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().subjects.deleteResource(uniqueId, resourceUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Teachers Service
  // ─────────────────────────────────────────────────────────────────────────────

  listTeachers(params?: ListTeachersParams): Observable<PageResult<Teacher>> {
    return from(this.ensureConfigured().teachers.list(params));
  }

  listArchivedTeachers(params?: ListTeachersParams): Observable<PageResult<Teacher>> {
    return from(this.ensureConfigured().teachers.listArchived(params));
  }

  getTeacher(uniqueId: string): Observable<Teacher> {
    return from(this.ensureConfigured().teachers.get(uniqueId));
  }

  getTeacherCourses(uniqueId: string): Observable<Course[]> {
    return from(this.ensureConfigured().teachers.getCourses(uniqueId));
  }

  getTeacherGroups(uniqueId: string): Observable<CourseGroup[]> {
    return from(this.ensureConfigured().teachers.getGroups(uniqueId));
  }

  getTeacherAvailability(uniqueId: string): Observable<TeacherAvailability[]> {
    return from(this.ensureConfigured().teachers.getAvailability(uniqueId));
  }

  addTeacherAvailability(uniqueId: string, data: CreateAvailabilityRequest): Observable<TeacherAvailability> {
    return from(this.ensureConfigured().teachers.addAvailability(uniqueId, data));
  }

  updateTeacherAvailability(uniqueId: string, availabilityUniqueId: string, data: UpdateAvailabilityRequest): Observable<TeacherAvailability> {
    return from(this.ensureConfigured().teachers.updateAvailability(uniqueId, availabilityUniqueId, data));
  }

  deleteTeacherAvailability(uniqueId: string, availabilityUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().teachers.deleteAvailability(uniqueId, availabilityUniqueId));
  }

  deleteAllTeacherAvailability(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().teachers.deleteAllAvailability(uniqueId));
  }

  getTeacherContentTree(uniqueId: string, courseGroupUniqueId: string): Observable<unknown> {
    return from(this.ensureConfigured().teachers.getContentTree(uniqueId, courseGroupUniqueId));
  }

  getTeacherStudentContentTree(uniqueId: string, userUniqueId: string, courseGroupUniqueId: string): Observable<unknown> {
    return from(this.ensureConfigured().teachers.getStudentContentTree(uniqueId, userUniqueId, courseGroupUniqueId));
  }

  promoteStudent(teacherUniqueId: string, userUniqueId: string): Observable<unknown> {
    return from(this.ensureConfigured().teachers.promoteStudent(teacherUniqueId, userUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Students Service
  // ─────────────────────────────────────────────────────────────────────────────

  listStudents(params?: ListStudentsParams): Observable<PageResult<Student>> {
    return from(this.ensureConfigured().students.list(params));
  }

  listArchivedStudents(params?: ListStudentsParams): Observable<PageResult<Student>> {
    return from(this.ensureConfigured().students.listArchived(params));
  }

  getStudent(uniqueId: string): Observable<Student> {
    return from(this.ensureConfigured().students.get(uniqueId));
  }

  registerStudent(uniqueId: string, data: RegisterStudentRequest): Observable<Student> {
    return from(this.ensureConfigured().students.register(uniqueId, data));
  }

  updateStudent(uniqueId: string, data: UpdateStudentRequest): Observable<Student> {
    return from(this.ensureConfigured().students.update(uniqueId, data));
  }

  archiveStudent(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().students.archive(uniqueId));
  }

  restoreStudent(uniqueId: string): Observable<Student> {
    return from(this.ensureConfigured().students.restore(uniqueId));
  }

  getStudentCourses(uniqueId: string): Observable<Course[]> {
    return from(this.ensureConfigured().students.getCourses(uniqueId));
  }

  getStudentAvailableCourses(uniqueId: string): Observable<Course[]> {
    return from(this.ensureConfigured().students.getAvailableCourses(uniqueId));
  }

  getStudentGroups(uniqueId: string): Observable<CourseGroup[]> {
    return from(this.ensureConfigured().students.getGroups(uniqueId));
  }

  getStudentContentTree(uniqueId: string, courseGroupUniqueId: string): Observable<unknown> {
    return from(this.ensureConfigured().students.getContentTree(uniqueId, courseGroupUniqueId));
  }

  getStudentAvailability(uniqueId: string): Observable<StudentAvailability[]> {
    return from(this.ensureConfigured().students.getAvailability(uniqueId));
  }

  addStudentAvailability(uniqueId: string, data: { dayOfWeek: number; startTime: string; endTime: string; timezone?: string }): Observable<StudentAvailability> {
    return from(this.ensureConfigured().students.addAvailability(uniqueId, data));
  }

  updateStudentAvailability(uniqueId: string, availabilityUniqueId: string, data: { dayOfWeek?: number; startTime?: string; endTime?: string; timezone?: string }): Observable<StudentAvailability> {
    return from(this.ensureConfigured().students.updateAvailability(uniqueId, availabilityUniqueId, data));
  }

  updateStudentAvailabilitySlots(uniqueId: string, slots: { dayOfWeek: number; startTime: string; endTime: string }[]): Observable<StudentAvailability[]> {
    return from(this.ensureConfigured().students.updateAvailabilitySlots(uniqueId, slots));
  }

  deleteStudentAvailability(uniqueId: string, availabilityUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().students.deleteAvailability(uniqueId, availabilityUniqueId));
  }

  deleteAllStudentAvailability(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().students.deleteAllAvailability(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Course Groups Service
  // ─────────────────────────────────────────────────────────────────────────────

  getCourseGroup(uniqueId: string): Observable<CourseGroup> {
    return from(this.ensureConfigured().courseGroups.get(uniqueId));
  }

  createCourseGroup(data: CreateCourseGroupRequest): Observable<CourseGroup> {
    return from(this.ensureConfigured().courseGroups.create(data));
  }

  addStudentToCourseGroup(uniqueId: string, studentUniqueId: string): Observable<CourseGroup> {
    return from(this.ensureConfigured().courseGroups.addStudent(uniqueId, studentUniqueId));
  }

  addTeacherToCourseGroup(uniqueId: string, teacherUniqueId: string): Observable<CourseGroup> {
    return from(this.ensureConfigured().courseGroups.addTeacher(uniqueId, teacherUniqueId));
  }

  getCourseGroupTests(uniqueId: string): Observable<unknown[]> {
    return from(this.ensureConfigured().courseGroups.getTests(uniqueId));
  }

  getCourseGroupTestResponses(uniqueId: string, testUniqueId: string): Observable<unknown[]> {
    return from(this.ensureConfigured().courseGroups.getTestResponses(uniqueId, testUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Coaching Sessions Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCoachingSessions(params?: ListCoachingSessionsParams): Observable<PageResult<CoachingSession>> {
    return from(this.ensureConfigured().coachingSessions.list(params));
  }

  createCoachingSession(data: CreateCoachingSessionRequest): Observable<CoachingSession> {
    return from(this.ensureConfigured().coachingSessions.create(data));
  }

  updateCoachingSession(uniqueId: string, data: UpdateCoachingSessionRequest): Observable<CoachingSession> {
    return from(this.ensureConfigured().coachingSessions.update(uniqueId, data));
  }

  deleteCoachingSession(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().coachingSessions.delete(uniqueId));
  }

  getCoachingSessionsByStudent(studentUniqueId: string): Observable<CoachingSession[]> {
    return from(this.ensureConfigured().coachingSessions.getByStudent(studentUniqueId));
  }

  getCoachingSessionsByTeacher(teacherUniqueId: string): Observable<CoachingSession[]> {
    return from(this.ensureConfigured().coachingSessions.getByTeacher(teacherUniqueId));
  }

  studentConfirmCoachingSession(uniqueId: string): Observable<CoachingSession> {
    return from(this.ensureConfigured().coachingSessions.studentConfirm(uniqueId));
  }

  studentCheckInCoachingSession(uniqueId: string): Observable<CoachingSession> {
    return from(this.ensureConfigured().coachingSessions.studentCheckIn(uniqueId));
  }

  studentCheckOutCoachingSession(uniqueId: string): Observable<CoachingSession> {
    return from(this.ensureConfigured().coachingSessions.studentCheckOut(uniqueId));
  }

  addStudentNotesToCoachingSession(uniqueId: string, notes: string): Observable<CoachingSession> {
    return from(this.ensureConfigured().coachingSessions.studentNotes(uniqueId, notes));
  }

  teacherConfirmCoachingSession(uniqueId: string): Observable<CoachingSession> {
    return from(this.ensureConfigured().coachingSessions.teacherConfirm(uniqueId));
  }

  teacherCheckInCoachingSession(uniqueId: string): Observable<CoachingSession> {
    return from(this.ensureConfigured().coachingSessions.teacherCheckIn(uniqueId));
  }

  teacherCheckOutCoachingSession(uniqueId: string): Observable<CoachingSession> {
    return from(this.ensureConfigured().coachingSessions.teacherCheckOut(uniqueId));
  }

  addAdminNotesToCoachingSession(uniqueId: string, notes: string): Observable<CoachingSession> {
    return from(this.ensureConfigured().coachingSessions.adminNotes(uniqueId, notes));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Content Tests Service
  // ─────────────────────────────────────────────────────────────────────────────

  listContentTests(params?: ListContentTestsParams): Observable<PageResult<ContentTest>> {
    return from(this.ensureConfigured().tests.list(params));
  }

  getContentTest(uniqueId: string): Observable<ContentTest> {
    return from(this.ensureConfigured().tests.get(uniqueId));
  }

  createContentTest(data: CreateContentTestRequest): Observable<ContentTest> {
    return from(this.ensureConfigured().tests.create(data));
  }

  updateContentTest(uniqueId: string, data: UpdateContentTestRequest): Observable<ContentTest> {
    return from(this.ensureConfigured().tests.update(uniqueId, data));
  }

  getContentTestResults(uniqueId: string): Observable<unknown[]> {
    return from(this.ensureConfigured().tests.getResults(uniqueId));
  }

  getContentTestSolution(uniqueId: string): Observable<unknown> {
    return from(this.ensureConfigured().tests.getSolution(uniqueId));
  }

  createTestQuestion(uniqueId: string, data: CreateQuestionRequest): Observable<TestQuestion> {
    return from(this.ensureConfigured().tests.createQuestion(uniqueId, data));
  }

  updateTestQuestion(uniqueId: string, questionUniqueId: string, data: Partial<CreateQuestionRequest>): Observable<TestQuestion> {
    return from(this.ensureConfigured().tests.updateQuestion(uniqueId, questionUniqueId, data));
  }

  getTestQuestion(uniqueId: string, questionId: string): Observable<TestQuestion> {
    return from(this.ensureConfigured().tests.getQuestion(uniqueId, questionId));
  }

  listTestOptions(): Observable<TestOption[]> {
    return from(this.ensureConfigured().tests.listOptions());
  }

  createTestOption(data: CreateOptionRequest): Observable<TestOption> {
    return from(this.ensureConfigured().tests.createOption(data));
  }

  updateTestOption(uniqueId: string, optionUniqueId: string, data: Partial<CreateOptionRequest>): Observable<TestOption> {
    return from(this.ensureConfigured().tests.updateOption(uniqueId, optionUniqueId, data));
  }

  addOptionToQuestion(uniqueId: string, questionId: string, optionId: string): Observable<TestQuestion> {
    return from(this.ensureConfigured().tests.addOptionToQuestion(uniqueId, questionId, optionId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): UniversityBlock {
    return this.ensureConfigured();
  }
}
