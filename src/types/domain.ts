/** Core EssayFlow domain types shared across modules. Extend — do not fork. */

export type Role = 'pengajar' | 'mahasiswa';

export type TaskStatus = 'draft' | 'active' | 'closed' | 'archived';

export type SubmissionStatus =
  | 'belum-mengumpulkan'
  | 'dikumpulkan'
  | 'terlambat'
  | 'ai-menilai'
  | 'ai-gagal'
  | 'menunggu-review'
  | 'sudah-dinilai';

export interface RubricCriterion {
  id: string;
  name: string;
  description?: string;
  /** Percentage weight, 0–100. All criteria of a rubric total 100. */
  weight: number;
}

export interface ScoredCriterion extends RubricCriterion {
  /** 0–100 */
  score: number;
}

/* ------------------------------------------------------------------ */
/* People                                                              */
/* ------------------------------------------------------------------ */

export interface Teacher {
  id: string;
  name: string;
  email: string;
  /** NIP */
  identityNumber: string;
  avatarUrl?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  /** NIM */
  nim: string;
  avatarUrl?: string;
}

/* ------------------------------------------------------------------ */
/* Class                                                               */
/* ------------------------------------------------------------------ */

export interface ClassRoom {
  id: string;
  name: string;
  program: string;
  semester: string;
  /** Kode kelas yang dibagikan ke mahasiswa. */
  code: string;
  studentIds: string[];
  teacherId: string;
  createdAt: string;
}

export type JoinRequestStatus = 'menunggu' | 'disetujui' | 'ditolak';

export interface JoinRequest {
  id: string;
  classId: string;
  studentId: string;
  status: JoinRequestStatus;
  requestedAt: string;
  reason?: string;
}

/* ------------------------------------------------------------------ */
/* Task                                                                */
/* ------------------------------------------------------------------ */

export type SubmissionType = 'teks' | 'kode' | 'pdf' | 'word';

export type LatePolicy = 'tidak-diizinkan' | 'sampai-tugas-ditutup' | 'maksimal-keterlambatan';

export interface TaskSettings {
  submissionTypes: SubmissionType[];
  latePolicy: LatePolicy;
  /** Jam; dipakai bila latePolicy = 'maksimal-keterlambatan'. */
  maxLateHours?: number;
  maxFileSizeMb: number;
  allowRevision: boolean;
  maxRevisions: number;
  revisionDeadline?: string;
  aiGrading: boolean;
  aiReEvaluateRevisions: boolean;
}

export interface Task {
  id: string;
  title: string;
  instructions: string;
  classId: string;
  status: TaskStatus;
  deadline: string;
  createdAt: string;
  rubric: RubricCriterion[];
  settings: TaskSettings;
}

/* ------------------------------------------------------------------ */
/* Submission & assessment                                             */
/* ------------------------------------------------------------------ */

export interface Feedback {
  /** Yang sudah baik */
  strengths: string[];
  /** Yang perlu diperbaiki */
  improvements: string[];
  /** Saran */
  suggestions: string[];
}

export interface Assessment {
  criteria: ScoredCriterion[];
  feedback: Feedback;
  /** Skor berbobot hasil AI. */
  aiScore: number;
  /** Penyesuaian manual pengajar; bila ada, nilai inilah yang dirilis. */
  adjustedScore?: number;
  adjustmentReason?: string;
  released: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SubmissionVersion {
  version: number;
  submittedAt: string;
  type: SubmissionType;
  content: string;
  fileName?: string;
  fileSizeKb?: number;
  late: boolean;
  status: SubmissionStatus;
  assessment?: Assessment;
}

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  status: SubmissionStatus;
  versions: SubmissionVersion[];
  /** Versi yang dipilih pengajar sebagai final (default: versi terakhir). */
  finalVersion?: number;
}

/* ------------------------------------------------------------------ */
/* Activity                                                            */
/* ------------------------------------------------------------------ */

export type ActivityKind =
  | 'pengumpulan'
  | 'ai-selesai'
  | 'ai-gagal'
  | 'hasil-dirilis'
  | 'kelas-baru'
  | 'tugas-baru'
  | 'revisi';

export interface ActivityItemData {
  id: string;
  kind: ActivityKind;
  title: string;
  description: string;
  at: string;
  read: boolean;
}

export const AI_STAGE_LABELS = [
  'Menganalisis Jawaban',
  'Mencocokkan Rubrik',
  'Membuat Feedback',
  'Selesai',
] as const;
