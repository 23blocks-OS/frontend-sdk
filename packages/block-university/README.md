# @23blocks/block-university

University block for the 23blocks SDK - courses, lessons, enrollments, and assignments.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-university.svg)](https://www.npmjs.com/package/@23blocks/block-university)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-university @23blocks/transport-http
```

## Overview

This package provides learning management functionality including:

- **Courses** - Course creation and management
- **Lessons** - Lesson content and ordering
- **Enrollments** - Student enrollment and progress tracking
- **Assignments** - Homework and quizzes
- **Submissions** - Assignment submission and grading

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createUniversityBlock } from '@23blocks/block-university';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const university = createUniversityBlock(transport, {
  apiKey: 'your-api-key',
});

// List courses
const { data: courses } = await university.courses.list({
  status: 'published',
  limit: 20,
});

// Enroll in a course
const enrollment = await university.enrollments.enroll({
  courseId: 'course-id',
  userId: 'user-id',
});
```

## Services

### courses - Course Management

```typescript
// List courses
const { data: courses, meta } = await university.courses.list({
  limit: 20,
  status: 'published',
  categoryId: 'category-id',
});

// Get course by ID
const course = await university.courses.get('course-id');

// Create course
const newCourse = await university.courses.create({
  title: 'Introduction to TypeScript',
  description: 'Learn TypeScript from scratch',
  instructorId: 'instructor-id',
  categoryId: 'category-id',
  level: 'beginner',
  duration: 600, // minutes
  price: 49.99,
  status: 'draft',
});

// Update course
await university.courses.update('course-id', {
  status: 'published',
  publishedAt: new Date().toISOString(),
});

// Delete course
await university.courses.delete('course-id');
```

### lessons - Lesson Management

```typescript
// List lessons for a course
const { data: lessons } = await university.lessons.list({
  courseId: 'course-id',
});

// Get lesson by ID
const lesson = await university.lessons.get('lesson-id');

// Create lesson
const newLesson = await university.lessons.create({
  courseId: 'course-id',
  title: 'Getting Started',
  description: 'Introduction to the course',
  contentType: 'video',
  content: {
    videoUrl: 'https://example.com/video.mp4',
    duration: 600, // seconds
  },
  order: 1,
});

// Update lesson
await university.lessons.update('lesson-id', {
  title: 'Updated Title',
  content: { videoUrl: 'https://example.com/new-video.mp4' },
});

// Reorder lessons
await university.lessons.reorder({
  courseId: 'course-id',
  lessonIds: ['lesson-3', 'lesson-1', 'lesson-2'],
});

// Delete lesson
await university.lessons.delete('lesson-id');
```

### enrollments - Student Enrollments

```typescript
// List enrollments
const { data: enrollments } = await university.enrollments.list({
  userId: 'user-id',
  status: 'active',
});

// Get enrollment by ID
const enrollment = await university.enrollments.get('enrollment-id');

// Enroll user in course
const newEnrollment = await university.enrollments.enroll({
  courseId: 'course-id',
  userId: 'user-id',
});

// Update progress
await university.enrollments.updateProgress({
  enrollmentId: 'enrollment-id',
  lessonId: 'lesson-id',
  progress: 100, // percentage
  completed: true,
  timeSpent: 600, // seconds
});

// Get enrollment progress
const progress = await university.enrollments.getProgress('enrollment-id');
console.log('Completed lessons:', progress.completedLessons);
console.log('Overall progress:', progress.percentage, '%');

// Complete course
await university.enrollments.update('enrollment-id', {
  status: 'completed',
  completedAt: new Date().toISOString(),
});

// Unenroll
await university.enrollments.delete('enrollment-id');
```

### assignments - Assignment Management

```typescript
// List assignments
const { data: assignments } = await university.assignments.list({
  courseId: 'course-id',
});

// Get assignment by ID
const assignment = await university.assignments.get('assignment-id');

// Create assignment
const newAssignment = await university.assignments.create({
  courseId: 'course-id',
  lessonId: 'lesson-id',
  title: 'TypeScript Basics Quiz',
  description: 'Test your understanding of TypeScript basics',
  type: 'quiz',
  dueDate: '2024-12-31T23:59:59Z',
  maxScore: 100,
  passingScore: 70,
  questions: [
    {
      type: 'multiple_choice',
      question: 'What is TypeScript?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'A',
      points: 10,
    },
    // more questions...
  ],
});

// Update assignment
await university.assignments.update('assignment-id', {
  dueDate: '2025-01-15T23:59:59Z',
});

// Delete assignment
await university.assignments.delete('assignment-id');
```

### submissions - Assignment Submissions

```typescript
// List submissions
const { data: submissions } = await university.submissions.list({
  assignmentId: 'assignment-id',
  status: 'submitted',
});

// Get submission by ID
const submission = await university.submissions.get('submission-id');

// Submit assignment
const newSubmission = await university.submissions.submit({
  assignmentId: 'assignment-id',
  userId: 'user-id',
  content: {
    answers: [
      { questionId: 1, answer: 'A' },
      { questionId: 2, answer: 'C' },
    ],
  },
});

// Grade submission (instructor)
await university.submissions.grade({
  submissionId: 'submission-id',
  score: 85,
  feedback: 'Great work! Review question 3.',
  gradedBy: 'instructor-id',
});

// Request resubmission
await university.submissions.update('submission-id', {
  status: 'revision_requested',
  feedback: 'Please review and resubmit.',
});
```

## Types

```typescript
import type {
  Course,
  Lesson,
  LessonContentType,
  Enrollment,
  EnrollmentStatus,
  Assignment,
  Submission,
  SubmissionStatus,
  CreateCourseRequest,
  CreateLessonRequest,
  EnrollRequest,
  CreateAssignmentRequest,
  SubmitAssignmentRequest,
  GradeSubmissionRequest,
} from '@23blocks/block-university';
```

### LessonContentType

- `video` - Video content
- `text` - Text/article content
- `quiz` - Interactive quiz
- `pdf` - PDF document
- `interactive` - Interactive content
- `live` - Live session

### EnrollmentStatus

- `pending` - Enrollment pending
- `active` - Actively enrolled
- `completed` - Course completed
- `dropped` - Student dropped
- `expired` - Enrollment expired

### SubmissionStatus

- `draft` - Work in progress
- `submitted` - Submitted for review
- `graded` - Graded by instructor
- `revision_requested` - Needs revision
- `approved` - Approved/passed

## Related Packages

- [`@23blocks/block-files`](https://www.npmjs.com/package/@23blocks/block-files) - File uploads for content
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
