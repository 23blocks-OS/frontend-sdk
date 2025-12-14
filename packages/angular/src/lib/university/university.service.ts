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
