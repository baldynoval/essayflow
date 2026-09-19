/**
 * Data access layer.
 *
 * Pages and components call these functions only. The implementation is in-memory
 * for now; replacing it with a real database means rewriting this file alone.
 * Every function is async on purpose so the call sites already await I/O.
 */

import {
  ACTIVITIES,
  CLASSES,
  CURRENT_STUDENT_ID,
  JOIN_REQUESTS,
  STUDENTS,
  SUBMISSIONS,
  TASKS,
  TEACHER,
} from '@/data/mock';
import type {
  ActivityItemData,
  ClassRoom,
  JoinRequest,
  Student,
  Submission,
  SubmissionVersion,
  Task,
  Teacher,
} from '@/types/domain';

export async function getTeacher(): Promise<Teacher> {
  return TEACHER;
}

export async function getCurrentStudent(): Promise<Student> {
  return STUDENTS.find((s) => s.id === CURRENT_STUDENT_ID) ?? STUDENTS[0];
}

export async function listStudents(ids?: string[]): Promise<Student[]> {
  return ids ? STUDENTS.filter((s) => ids.includes(s.id)) : STUDENTS;
}

export async function getStudent(id: string): Promise<Student | undefined> {
  return STUDENTS.find((s) => s.id === id);
}

export async function listClasses(): Promise<ClassRoom[]> {
  return CLASSES;
}

export async function getClass(id: string): Promise<ClassRoom | undefined> {
  return CLASSES.find((c) => c.id === id);
}

export async function listJoinRequests(classId?: string): Promise<JoinRequest[]> {
  return JOIN_REQUESTS.filter((r) => (classId ? r.classId === classId : true));
}

export async function listTasks(filter?: { classId?: string }): Promise<Task[]> {
  return TASKS.filter((t) => (filter?.classId ? t.classId === filter.classId : true));
}

export async function getTask(id: string): Promise<Task | undefined> {
  return TASKS.find((t) => t.id === id);
}

export async function listSubmissions(filter?: { taskId?: string; studentId?: string }): Promise<Submission[]> {
  return SUBMISSIONS.filter(
    (s) =>
      (filter?.taskId ? s.taskId === filter.taskId : true) &&
      (filter?.studentId ? s.studentId === filter.studentId : true),
  );
}

export async function getSubmission(id: string): Promise<Submission | undefined> {
  return SUBMISSIONS.find((s) => s.id === id);
}

export async function listActivities(): Promise<ActivityItemData[]> {
  return [...ACTIVITIES].sort((a, b) => (a.at < b.at ? 1 : -1));
}

/* ------------------------------------------------------------------ */
/* Derived helpers                                                     */
/* ------------------------------------------------------------------ */

export function latestVersion(submission: Submission): SubmissionVersion {
  return submission.versions[submission.versions.length - 1];
}

export function finalVersionOf(submission: Submission): SubmissionVersion {
  const picked = submission.versions.find((v) => v.version === submission.finalVersion);
  return picked ?? latestVersion(submission);
}

/** Released score a student is allowed to see, or null while still under review. */
export function releasedScore(submission: Submission): number | null {
  const version = finalVersionOf(submission);
  const assessment = version.assessment;
  if (!assessment || !assessment.released) return null;
  return assessment.adjustedScore ?? assessment.aiScore;
}

export async function teacherStats() {
  const tasks = await listTasks();
  const submissions = await listSubmissions();
  const classes = await listClasses();
  const studentIds = new Set(classes.flatMap((c) => c.studentIds));
  return {
    activeTasks: tasks.filter((t) => t.status === 'active').length,
    waitingReview: submissions.filter((s) => s.status === 'menunggu-review').length,
    graded: submissions.filter((s) => s.status === 'sudah-dinilai').length,
    students: studentIds.size,
  };
}

export async function studentStats(studentId: string) {
  const submissions = await listSubmissions({ studentId });
  const released = submissions.map(releasedScore).filter((value): value is number => value !== null);
  const average = released.length
    ? Math.round((released.reduce((sum, value) => sum + value, 0) / released.length) * 10) / 10
    : 0;
  const tasks = await listTasks();
  return {
    average,
    taskCount: tasks.filter((t) => t.status !== 'draft').length,
    completed: submissions.length,
    latest: released.length ? released[released.length - 1] : 0,
  };
}
