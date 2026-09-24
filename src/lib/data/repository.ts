/**
 * Data access layer.
 *
 * Pages and components call these functions only. Backed by Supabase now —
 * every function still returns the same shape (and getTeacher/getCurrentStudent
 * still take no arguments; they read the signed-in user from the session
 * cookie internally) so no page or component needed to change.
 *
 * RLS policies in supabase/schema.sql are the real security boundary: e.g.
 * `listClasses()` runs the same query for a teacher and a student, and
 * Postgres itself only returns the rows each one is allowed to see.
 */

import { createClient } from '@/lib/supabase/server';
import { readSession } from '@/lib/auth/session';
import type {
  ActivityItemData,
  ClassRoom,
  Feedback,
  JoinRequest,
  RubricCriterion,
  ScoredCriterion,
  Student,
  Submission,
  SubmissionType,
  SubmissionVersion,
  Task,
  TaskSettings,
  Teacher,
} from '@/types/domain';

/* ------------------------------------------------------------------ */
/* Row → domain mappers                                                */
/* ------------------------------------------------------------------ */

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: 'pengajar' | 'mahasiswa';
  identity_number: string;
  avatar_url: string | null;
}

interface ClassRow {
  id: string;
  name: string;
  program: string;
  semester: string;
  code: string;
  teacher_id: string;
  created_at: string;
  class_students?: { student_id: string }[];
}

interface JoinRequestRow {
  id: string;
  class_id: string;
  student_id: string;
  status: JoinRequest['status'];
  requested_at: string;
  reason: string | null;
}

interface TaskRow {
  id: string;
  title: string;
  instructions: string;
  class_id: string;
  status: Task['status'];
  deadline: string;
  created_at: string;
  rubric: RubricCriterion[];
  settings: TaskSettings;
}

interface SubmissionVersionRow {
  version: number;
  submitted_at: string;
  type: SubmissionType;
  content: string | null;
  file_name: string | null;
  file_size_kb: number | null;
  late: boolean;
  status: SubmissionVersion['status'];
  assessment: SubmissionVersion['assessment'] | null;
}

interface SubmissionRow {
  id: string;
  task_id: string;
  student_id: string;
  status: Submission['status'];
  final_version: number | null;
  submission_versions?: SubmissionVersionRow[];
}

interface ActivityRow {
  id: string;
  kind: ActivityItemData['kind'];
  title: string;
  description: string;
  at: string;
  read: boolean;
}

function toTeacher(row: ProfileRow): Teacher {
  return { id: row.id, name: row.name, email: row.email, identityNumber: row.identity_number, avatarUrl: row.avatar_url ?? undefined };
}

function toStudent(row: ProfileRow): Student {
  return { id: row.id, name: row.name, email: row.email, nim: row.identity_number, avatarUrl: row.avatar_url ?? undefined };
}

function toClassRoom(row: ClassRow): ClassRoom {
  return {
    id: row.id,
    name: row.name,
    program: row.program,
    semester: row.semester,
    code: row.code,
    studentIds: (row.class_students ?? []).map((cs) => cs.student_id),
    teacherId: row.teacher_id,
    createdAt: row.created_at,
  };
}

function toJoinRequest(row: JoinRequestRow): JoinRequest {
  return {
    id: row.id,
    classId: row.class_id,
    studentId: row.student_id,
    status: row.status,
    requestedAt: row.requested_at,
    reason: row.reason ?? undefined,
  };
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    instructions: row.instructions,
    classId: row.class_id,
    status: row.status,
    deadline: row.deadline,
    createdAt: row.created_at,
    rubric: row.rubric ?? [],
    settings: row.settings,
  };
}

function toSubmissionVersion(row: SubmissionVersionRow): SubmissionVersion {
  return {
    version: row.version,
    submittedAt: row.submitted_at,
    type: row.type,
    content: row.content ?? '',
    fileName: row.file_name ?? undefined,
    fileSizeKb: row.file_size_kb ?? undefined,
    late: row.late,
    status: row.status,
    assessment: row.assessment ?? undefined,
  };
}

function toSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    taskId: row.task_id,
    studentId: row.student_id,
    status: row.status,
    versions: (row.submission_versions ?? []).slice().sort((a, b) => a.version - b.version).map(toSubmissionVersion),
    finalVersion: row.final_version ?? undefined,
  };
}

function toActivity(row: ActivityRow): ActivityItemData {
  return { id: row.id, kind: row.kind, title: row.title, description: row.description, at: row.at, read: row.read };
}

const SUBMISSION_SELECT = '*, submission_versions(*)';
const CLASS_SELECT = '*, class_students(student_id)';

/* ------------------------------------------------------------------ */
/* Reads                                                                */
/* ------------------------------------------------------------------ */

export async function getTeacher(): Promise<Teacher> {
  const session = await readSession();
  if (!session) throw new Error('Tidak ada sesi aktif.');
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', session.userId).single<ProfileRow>();
  if (error || !data) throw new Error('Profil pengajar tidak ditemukan.');
  return toTeacher(data);
}

export async function getCurrentStudent(): Promise<Student> {
  const session = await readSession();
  if (!session) throw new Error('Tidak ada sesi aktif.');
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', session.userId).single<ProfileRow>();
  if (error || !data) throw new Error('Profil mahasiswa tidak ditemukan.');
  return toStudent(data);
}

export async function listStudents(ids?: string[]): Promise<Student[]> {
  const supabase = await createClient();
  let query = supabase.from('profiles').select('*').eq('role', 'mahasiswa');
  if (ids) query = query.in('id', ids);
  const { data, error } = await query.returns<ProfileRow[]>();
  if (error || !data) return [];
  return data.map(toStudent);
}

export async function getStudent(id: string): Promise<Student | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('*').eq('id', id).eq('role', 'mahasiswa').maybeSingle<ProfileRow>();
  return data ? toStudent(data) : undefined;
}

export async function listClasses(): Promise<ClassRoom[]> {
  const supabase = await createClient();
  // RLS scopes this to the signed-in teacher's own classes, or the classes
  // the signed-in student is enrolled in — no manual filter needed here.
  const { data, error } = await supabase.from('classes').select(CLASS_SELECT).returns<ClassRow[]>();
  if (error || !data) return [];
  return data.map(toClassRoom);
}

export async function getClass(id: string): Promise<ClassRoom | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from('classes').select(CLASS_SELECT).eq('id', id).maybeSingle<ClassRow>();
  return data ? toClassRoom(data) : undefined;
}

export async function listJoinRequests(classId?: string): Promise<JoinRequest[]> {
  const supabase = await createClient();
  let query = supabase.from('join_requests').select('*');
  if (classId) query = query.eq('class_id', classId);
  const { data, error } = await query.returns<JoinRequestRow[]>();
  if (error || !data) return [];
  return data.map(toJoinRequest);
}

export async function listTasks(filter?: { classId?: string }): Promise<Task[]> {
  const supabase = await createClient();
  let query = supabase.from('tasks').select('*');
  if (filter?.classId) query = query.eq('class_id', filter.classId);
  const { data, error } = await query.returns<TaskRow[]>();
  if (error || !data) return [];
  return data.map(toTask);
}

export async function getTask(id: string): Promise<Task | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from('tasks').select('*').eq('id', id).maybeSingle<TaskRow>();
  return data ? toTask(data) : undefined;
}

export async function listSubmissions(filter?: { taskId?: string; studentId?: string }): Promise<Submission[]> {
  const supabase = await createClient();
  let query = supabase.from('submissions').select(SUBMISSION_SELECT);
  if (filter?.taskId) query = query.eq('task_id', filter.taskId);
  if (filter?.studentId) query = query.eq('student_id', filter.studentId);
  const { data, error } = await query.returns<SubmissionRow[]>();
  if (error || !data) return [];
  return data.map(toSubmission);
}

export async function getSubmission(id: string): Promise<Submission | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from('submissions').select(SUBMISSION_SELECT).eq('id', id).maybeSingle<SubmissionRow>();
  return data ? toSubmission(data) : undefined;
}

export async function listActivities(): Promise<ActivityItemData[]> {
  const supabase = await createClient();
  // RLS restricts `activities` to rows where user_id = the signed-in user.
  const { data, error } = await supabase.from('activities').select('*').order('at', { ascending: false }).returns<ActivityRow[]>();
  if (error || !data) return [];
  return data.map(toActivity);
}

/* ------------------------------------------------------------------ */
/* Writes                                                               */
/* ------------------------------------------------------------------ */

export interface CreateTaskInput {
  title: string;
  instructions: string;
  classId: string;
  status: Task['status'];
  deadline: string;
  rubric: RubricCriterion[];
  settings: TaskSettings;
}

/** Throws on failure (caller — the API route — translates that into a 4xx/5xx response). */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: input.title,
      instructions: input.instructions,
      class_id: input.classId,
      status: input.status,
      deadline: input.deadline,
      rubric: input.rubric,
      settings: input.settings,
    })
    .select('*')
    .single<TaskRow>();
  if (error || !data) throw new Error(error?.message ?? 'Gagal membuat tugas.');
  return toTask(data);
}

export interface CreateSubmissionInput {
  taskId: string;
  studentId: string;
  type: SubmissionType;
  content: string;
  fileName?: string;
  fileSizeKb?: number;
}

/**
 * Finds or creates the student's submission row for this task, then appends
 * the next version. Lateness is derived from the task's deadline, matching
 * SubmissionVersion.late in src/types/domain.ts.
 */
export async function createSubmission(input: CreateSubmissionInput): Promise<Submission> {
  const supabase = await createClient();

  const task = await getTask(input.taskId);
  if (!task) throw new Error('Tugas tidak ditemukan.');

  const late = Date.now() > new Date(task.deadline).getTime();
  const status: SubmissionVersion['status'] = late ? 'terlambat' : 'dikumpulkan';

  let { data: existing } = await supabase
    .from('submissions')
    .select('*')
    .eq('task_id', input.taskId)
    .eq('student_id', input.studentId)
    .maybeSingle<{ id: string }>();

  if (!existing) {
    const { data: created, error: createError } = await supabase
      .from('submissions')
      .insert({ task_id: input.taskId, student_id: input.studentId, status })
      .select('id')
      .single<{ id: string }>();
    if (createError || !created) throw new Error(createError?.message ?? 'Gagal membuat pengumpulan.');
    existing = created;
  }

  const { count } = await supabase
    .from('submission_versions')
    .select('*', { count: 'exact', head: true })
    .eq('submission_id', existing.id);
  const nextVersion = (count ?? 0) + 1;

  const { error: versionError } = await supabase.from('submission_versions').insert({
    submission_id: existing.id,
    version: nextVersion,
    type: input.type,
    content: input.content,
    file_name: input.fileName ?? null,
    file_size_kb: input.fileSizeKb ?? null,
    late,
    status,
  });
  if (versionError) throw new Error(versionError.message);

  const { error: updateError } = await supabase
    .from('submissions')
    .update({ status, final_version: nextVersion })
    .eq('id', existing.id);
  if (updateError) throw new Error(updateError.message);

  const submission = await getSubmission(existing.id);
  if (!submission) throw new Error('Gagal memuat pengumpulan setelah disimpan.');
  return submission;
}

export interface CreateClassInput {
  name: string;
  program: string;
  semester: string;
  code: string;
}

/** teacher_id is set implicitly by the RLS check (auth.uid() = teacher_id) — pass it explicitly too so the insert doesn't rely on a default. */
export async function createClass(input: CreateClassInput): Promise<ClassRoom> {
  const session = await readSession();
  if (!session) throw new Error('Tidak ada sesi aktif.');
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('classes')
    .insert({ name: input.name, program: input.program, semester: input.semester, code: input.code, teacher_id: session.userId })
    .select(CLASS_SELECT)
    .single<ClassRow>();
  if (error || !data) throw new Error(error?.message ?? 'Gagal membuat kelas.');
  return toClassRoom(data);
}

/** Student requests to join a class by its share code. Fails clearly if the code doesn't exist or was already used. */
export async function requestJoinClass(code: string, reason?: string): Promise<JoinRequest> {
  const session = await readSession();
  if (!session) throw new Error('Tidak ada sesi aktif.');
  const supabase = await createClient();

  const { data: classRow, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('code', code.trim())
    .maybeSingle<{ id: string }>();
  if (classError || !classRow) throw new Error('Kode kelas tidak ditemukan.');

  const { data: existingMembership } = await supabase
    .from('class_students')
    .select('class_id')
    .eq('class_id', classRow.id)
    .eq('student_id', session.userId)
    .maybeSingle<{ class_id: string }>();
  if (existingMembership) throw new Error('Anda sudah tergabung di kelas ini.');

  const { data: existingRequest } = await supabase
    .from('join_requests')
    .select('id')
    .eq('class_id', classRow.id)
    .eq('student_id', session.userId)
    .eq('status', 'menunggu')
    .maybeSingle<{ id: string }>();
  if (existingRequest) throw new Error('Permintaan gabung untuk kelas ini masih menunggu persetujuan.');

  const { data, error } = await supabase
    .from('join_requests')
    .insert({ class_id: classRow.id, student_id: session.userId, reason: reason ?? null })
    .select('*')
    .single<JoinRequestRow>();
  if (error || !data) throw new Error(error?.message ?? 'Gagal mengirim permintaan gabung.');
  return toJoinRequest(data);
}

/**
 * Teacher approves or rejects a join request. Approving also enrolls the
 * student (inserts into class_students) so the two stay consistent.
 */
export async function respondToJoinRequest(id: string, approve: boolean): Promise<JoinRequest> {
  const supabase = await createClient();

  const { data: existing, error: findError } = await supabase
    .from('join_requests')
    .select('*')
    .eq('id', id)
    .maybeSingle<JoinRequestRow>();
  if (findError || !existing) throw new Error('Permintaan gabung tidak ditemukan.');

  const nextStatus: JoinRequest['status'] = approve ? 'disetujui' : 'ditolak';
  const { data, error } = await supabase
    .from('join_requests')
    .update({ status: nextStatus })
    .eq('id', id)
    .select('*')
    .single<JoinRequestRow>();
  if (error || !data) throw new Error(error?.message ?? 'Gagal memperbarui permintaan.');

  if (approve) {
    const { error: enrollError } = await supabase
      .from('class_students')
      .insert({ class_id: existing.class_id, student_id: existing.student_id });
    // Ignore a duplicate-membership race (unique violation); anything else is real.
    if (enrollError && enrollError.code !== '23505') throw new Error(enrollError.message);
  }

  return toJoinRequest(data);
}

export interface UpdateTaskInput {
  title?: string;
  instructions?: string;
  status?: Task['status'];
  deadline?: string;
  rubric?: RubricCriterion[];
  settings?: TaskSettings;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const supabase = await createClient();
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.instructions !== undefined) patch.instructions = input.instructions;
  if (input.status !== undefined) patch.status = input.status;
  if (input.deadline !== undefined) patch.deadline = input.deadline;
  if (input.rubric !== undefined) patch.rubric = input.rubric;
  if (input.settings !== undefined) patch.settings = input.settings;

  const { data, error } = await supabase.from('tasks').update(patch).eq('id', id).select('*').single<TaskRow>();
  if (error || !data) throw new Error(error?.message ?? 'Gagal memperbarui tugas. Pastikan Anda pengajar kelas ini.');
  return toTask(data);
}

export interface ReviewSubmissionInput {
  /** Which version to attach the assessment to; defaults to the submission's current final/latest version. */
  version?: number;
  criteria: ScoredCriterion[];
  feedback: Feedback;
  aiScore: number;
  adjustedScore?: number;
  adjustmentReason?: string;
}

/** Teacher reviews (and optionally adjusts) a submission's AI-drafted score. Does not release it to the student yet. */
export async function reviewSubmission(submissionId: string, input: ReviewSubmissionInput): Promise<Submission> {
  const session = await readSession();
  if (!session) throw new Error('Tidak ada sesi aktif.');
  const supabase = await createClient();

  const submission = await getSubmission(submissionId);
  if (!submission) throw new Error('Pengumpulan tidak ditemukan.');
  const targetVersion = input.version ?? submission.finalVersion ?? latestVersion(submission).version;

  const assessment = {
    criteria: input.criteria,
    feedback: input.feedback,
    aiScore: input.aiScore,
    adjustedScore: input.adjustedScore,
    adjustmentReason: input.adjustmentReason,
    released: false,
    reviewedBy: session.userId,
    reviewedAt: new Date().toISOString(),
  };

  const { error: versionError } = await supabase
    .from('submission_versions')
    .update({ assessment, status: 'sudah-dinilai' })
    .eq('submission_id', submissionId)
    .eq('version', targetVersion);
  if (versionError) throw new Error(versionError.message);

  const { error: subError } = await supabase
    .from('submissions')
    .update({ status: 'sudah-dinilai', final_version: targetVersion })
    .eq('id', submissionId);
  if (subError) throw new Error(subError.message);

  const updated = await getSubmission(submissionId);
  if (!updated) throw new Error('Gagal memuat pengumpulan setelah dinilai.');
  return updated;
}

/** Releases the reviewed score/feedback to the student (Assessment.released = true). */
export async function releaseSubmission(submissionId: string): Promise<Submission> {
  const supabase = await createClient();
  const submission = await getSubmission(submissionId);
  if (!submission) throw new Error('Pengumpulan tidak ditemukan.');

  const version = finalVersionOf(submission);
  if (!version.assessment) throw new Error('Pengumpulan belum dinilai — beri nilai dulu sebelum dirilis.');

  const { error } = await supabase
    .from('submission_versions')
    .update({ assessment: { ...version.assessment, released: true } })
    .eq('submission_id', submissionId)
    .eq('version', version.version);
  if (error) throw new Error(error.message);

  const updated = await getSubmission(submissionId);
  if (!updated) throw new Error('Gagal memuat pengumpulan setelah dirilis.');
  return updated;
}

/** Stores an AI-generated draft assessment on a submission version without marking it teacher-reviewed. */
export async function saveAIDraftAssessment(
  submissionId: string,
  version: number,
  draft: { criteria: ScoredCriterion[]; feedback: Feedback; score: number },
): Promise<Submission> {
  const supabase = await createClient();
  const assessment = { criteria: draft.criteria, feedback: draft.feedback, aiScore: draft.score, released: false };

  const { error: versionError } = await supabase
    .from('submission_versions')
    .update({ assessment, status: 'menunggu-review' })
    .eq('submission_id', submissionId)
    .eq('version', version);
  if (versionError) throw new Error(versionError.message);

  const { error: subError } = await supabase.from('submissions').update({ status: 'menunggu-review' }).eq('id', submissionId);
  if (subError) throw new Error(subError.message);

  const updated = await getSubmission(submissionId);
  if (!updated) throw new Error('Gagal memuat pengumpulan setelah dinilai AI.');
  return updated;
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
