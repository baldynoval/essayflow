/**
 * Realistic seed data for EssayFlow.
 * Read through `src/lib/data/repository.ts` — pages never import this file directly,
 * so swapping in a database only means replacing the repository implementation.
 */

import type {
  ActivityItemData,
  Assessment,
  ClassRoom,
  JoinRequest,
  RubricCriterion,
  Student,
  Submission,
  Task,
  Teacher,
} from '@/types/domain';

export const TEACHER: Teacher = {
  id: 'usr-pengajar-01',
  name: 'Dr. Budi Santoso',
  email: 'budi.santoso@kampus.ac.id',
  identityNumber: '198203142008011003',
};

export const STUDENTS: Student[] = [
  { id: 'std-01', name: 'Andi Pratama', nim: '26231001', email: 'andi.pratama@student.kampus.ac.id' },
  { id: 'std-02', name: 'Rizky Pratama', nim: '26231002', email: 'rizky.pratama@student.kampus.ac.id' },
  { id: 'std-03', name: 'Siti Nurhaliza', nim: '26231003', email: 'siti.nurhaliza@student.kampus.ac.id' },
  { id: 'std-04', name: 'Dewi Anggraini', nim: '26231004', email: 'dewi.anggraini@student.kampus.ac.id' },
  { id: 'std-05', name: 'Eka Saputra', nim: '26231005', email: 'eka.saputra@student.kampus.ac.id' },
  { id: 'std-06', name: 'Fajar Nugroho', nim: '26231006', email: 'fajar.nugroho@student.kampus.ac.id' },
  { id: 'std-07', name: 'Intan Permatasari', nim: '26231007', email: 'intan.permatasari@student.kampus.ac.id' },
  { id: 'std-08', name: 'Bagus Hermawan', nim: '26231008', email: 'bagus.hermawan@student.kampus.ac.id' },
  { id: 'std-09', name: 'Nadia Salsabila', nim: '26231009', email: 'nadia.salsabila@student.kampus.ac.id' },
  { id: 'std-10', name: 'Yoga Aditya', nim: '26231010', email: 'yoga.aditya@student.kampus.ac.id' },
];

export const CLASSES: ClassRoom[] = [
  {
    id: 'cls-01',
    name: 'Pemrograman Dasar',
    program: 'Teknik Informatika',
    semester: 'Semester 3',
    code: 'IF-101',
    studentIds: STUDENTS.slice(0, 8).map((s) => s.id),
    teacherId: TEACHER.id,
    createdAt: '2026-08-04T02:00:00+07:00',
  },
  {
    id: 'cls-02',
    name: 'Algoritma dan Struktur Data',
    program: 'Teknik Informatika',
    semester: 'Semester 3',
    code: 'IF-153',
    studentIds: STUDENTS.slice(2, 10).map((s) => s.id),
    teacherId: TEACHER.id,
    createdAt: '2026-08-05T02:00:00+07:00',
  },
  {
    id: 'cls-03',
    name: 'Basis Data',
    program: 'Sistem Informasi',
    semester: 'Semester 4',
    code: 'SI-210',
    studentIds: STUDENTS.slice(0, 6).map((s) => s.id),
    teacherId: TEACHER.id,
    createdAt: '2026-08-11T02:00:00+07:00',
  },
];

export const JOIN_REQUESTS: JoinRequest[] = [
  { id: 'req-01', classId: 'cls-02', studentId: 'std-09', status: 'menunggu', requestedAt: '2026-09-17T09:12:00+07:00' },
  { id: 'req-02', classId: 'cls-03', studentId: 'std-07', status: 'menunggu', requestedAt: '2026-09-18T14:05:00+07:00' },
];

export const DEFAULT_RUBRIC: RubricCriterion[] = [
  { id: 'rb-01', name: 'Kesesuaian dengan Topik', weight: 30, description: 'Jawaban menjawab pertanyaan dan tetap pada ruang lingkup topik.' },
  { id: 'rb-02', name: 'Struktur Argumentasi', weight: 25, description: 'Alur penjelasan runtut, klaim didukung alasan yang jelas.' },
  { id: 'rb-03', name: 'Kedalaman Analisis', weight: 25, description: 'Analisis menyentuh sebab, akibat, dan perbandingan, bukan sekadar definisi.' },
  { id: 'rb-04', name: 'Penggunaan Bahasa', weight: 20, description: 'Bahasa akademik, ejaan tepat, istilah teknis digunakan secara konsisten.' },
];

function assessment(scores: number[], overrides: Partial<Assessment> = {}): Assessment {
  const criteria = DEFAULT_RUBRIC.map((criterion, index) => ({ ...criterion, score: scores[index] }));
  const aiScore =
    Math.round((criteria.reduce((sum, c) => sum + c.score * c.weight, 0) / 100) * 10) / 10;
  return {
    criteria,
    aiScore,
    released: false,
    feedback: {
      strengths: [
        'Struktur argumentasi tersusun rapi dari definisi menuju perbandingan kompleksitas.',
        'Contoh penerapan binary search pada data terurut dijelaskan dengan tepat.',
        'Penggunaan istilah teknis konsisten sepanjang jawaban.',
      ],
      improvements: [
        'Analisis kompleksitas ruang belum dibahas sama sekali.',
        'Perbandingan dengan algoritma hashing masih pada tataran permukaan.',
      ],
      suggestions: [
        'Tambahkan tabel perbandingan kompleksitas waktu dan ruang untuk setiap algoritma.',
        'Sertakan satu contoh kasus ketika linear search justru lebih efisien.',
      ],
    },
    ...overrides,
  };
}

export const TASKS: Task[] = [
  {
    id: 'tsk-01',
    title: 'Analisis Algoritma Pencarian',
    instructions:
      'Jelaskan perbedaan algoritma pencarian linear dan binary search. Sertakan analisis kompleksitas waktu, kondisi data yang dibutuhkan, serta satu contoh kasus penerapan pada sistem nyata. Jawaban ditulis minimal 400 kata dengan bahasa akademik.',
    classId: 'cls-01',
    status: 'active',
    deadline: '2026-09-20T23:59:00+07:00',
    createdAt: '2026-09-12T08:00:00+07:00',
    rubric: DEFAULT_RUBRIC,
    settings: {
      submissionTypes: ['teks', 'kode', 'pdf'],
      latePolicy: 'maksimal-keterlambatan',
      maxLateHours: 24,
      maxFileSizeMb: 10,
      allowRevision: true,
      maxRevisions: 2,
      revisionDeadline: '2026-09-25T23:59:00+07:00',
      aiGrading: true,
      aiReEvaluateRevisions: true,
    },
  },
  {
    id: 'tsk-02',
    title: 'Struktur Data Linked List',
    instructions:
      'Implementasikan singly linked list beserta operasi insert, delete, dan search. Sertakan penjelasan kompleksitas setiap operasi.',
    classId: 'cls-02',
    status: 'active',
    deadline: '2026-09-25T23:59:00+07:00',
    createdAt: '2026-09-14T08:00:00+07:00',
    rubric: DEFAULT_RUBRIC,
    settings: {
      submissionTypes: ['kode', 'pdf'],
      latePolicy: 'sampai-tugas-ditutup',
      maxFileSizeMb: 10,
      allowRevision: true,
      maxRevisions: 1,
      aiGrading: true,
      aiReEvaluateRevisions: false,
    },
  },
  {
    id: 'tsk-03',
    title: 'Normalisasi Basis Data',
    instructions:
      'Lakukan normalisasi tabel transaksi penjualan sampai bentuk normal ketiga. Jelaskan setiap tahap beserta alasannya.',
    classId: 'cls-03',
    status: 'active',
    deadline: '2026-09-28T23:59:00+07:00',
    createdAt: '2026-09-15T08:00:00+07:00',
    rubric: DEFAULT_RUBRIC,
    settings: {
      submissionTypes: ['teks', 'pdf', 'word'],
      latePolicy: 'tidak-diizinkan',
      maxFileSizeMb: 15,
      allowRevision: false,
      maxRevisions: 0,
      aiGrading: true,
      aiReEvaluateRevisions: false,
    },
  },
  {
    id: 'tsk-04',
    title: 'Rekursi dan Backtracking',
    instructions: 'Uraikan perbedaan rekursi dan iterasi, lalu selesaikan persoalan N-Queens dengan backtracking.',
    classId: 'cls-02',
    status: 'draft',
    deadline: '2026-10-05T23:59:00+07:00',
    createdAt: '2026-09-18T08:00:00+07:00',
    rubric: DEFAULT_RUBRIC,
    settings: {
      submissionTypes: ['kode'],
      latePolicy: 'tidak-diizinkan',
      maxFileSizeMb: 10,
      allowRevision: false,
      maxRevisions: 0,
      aiGrading: true,
      aiReEvaluateRevisions: false,
    },
  },
  {
    id: 'tsk-05',
    title: 'Konsep Pemrograman Berorientasi Objek',
    instructions: 'Jelaskan empat pilar OOP dengan contoh implementasi pada studi kasus sistem perpustakaan.',
    classId: 'cls-01',
    status: 'closed',
    deadline: '2026-09-08T23:59:00+07:00',
    createdAt: '2026-08-30T08:00:00+07:00',
    rubric: DEFAULT_RUBRIC,
    settings: {
      submissionTypes: ['teks', 'pdf'],
      latePolicy: 'sampai-tugas-ditutup',
      maxFileSizeMb: 10,
      allowRevision: false,
      maxRevisions: 0,
      aiGrading: true,
      aiReEvaluateRevisions: false,
    },
  },
];

const ANSWER_V1 = `Algoritma pencarian merupakan metode untuk menemukan data tertentu di dalam suatu kumpulan data. Dalam penelitian ini saya membandingkan dua pendekatan yang paling sering digunakan, yaitu linear search dan binary search.

Linear search bekerja dengan memeriksa setiap elemen satu per satu dari awal hingga akhir. Karena tidak ada syarat khusus terhadap data, algoritma ini dapat digunakan pada data yang belum terurut. Kompleksitas waktunya adalah O(n) pada kasus terburuk.

Binary search bekerja dengan membagi ruang pencarian menjadi dua bagian pada setiap langkah. Syaratnya, data harus dalam keadaan terurut. Dengan pembagian tersebut kompleksitas waktu menurun menjadi O(log n), sehingga jauh lebih efisien untuk data berukuran besar.

Pada sistem nyata, binary search banyak dipakai pada indeks basis data dan pencarian pada daftar yang jarang berubah. Sebaliknya, linear search tetap relevan untuk data berukuran kecil atau data yang terus berubah, karena biaya pengurutan ulang justru lebih mahal dibanding keuntungan pencariannya.`;

const ANSWER_V2 = `${ANSWER_V1}

Selain kompleksitas waktu, kompleksitas ruang juga perlu diperhatikan. Linear search membutuhkan ruang tambahan O(1). Binary search versi iteratif juga O(1), sedangkan versi rekursif membutuhkan O(log n) karena penggunaan call stack.

Sebagai pembanding, struktur hash table mampu mencapai rata-rata O(1) untuk pencarian, namun mengorbankan urutan data dan memerlukan penanganan tabrakan kunci.`;

export const SUBMISSIONS: Submission[] = [
  {
    id: 'sub-01',
    taskId: 'tsk-01',
    studentId: 'std-01',
    status: 'sudah-dinilai',
    finalVersion: 2,
    versions: [
      {
        version: 1,
        submittedAt: '2026-09-16T14:32:00+07:00',
        type: 'teks',
        content: ANSWER_V1,
        late: false,
        status: 'sudah-dinilai',
        assessment: assessment([84, 80, 76, 88], {
          released: true,
          reviewedBy: TEACHER.name,
          reviewedAt: '2026-09-17T10:15:00+07:00',
        }),
      },
      {
        version: 2,
        submittedAt: '2026-09-18T16:32:00+07:00',
        type: 'teks',
        content: ANSWER_V2,
        late: false,
        status: 'sudah-dinilai',
        assessment: assessment([92, 90, 84, 89], {
          adjustedScore: 87.5,
          adjustmentReason: 'Penyesuaian kedalaman analisis setelah ditinjau manual.',
          released: true,
          reviewedBy: TEACHER.name,
          reviewedAt: '2026-09-19T09:20:00+07:00',
        }),
      },
    ],
  },
  {
    id: 'sub-02',
    taskId: 'tsk-01',
    studentId: 'std-02',
    status: 'menunggu-review',
    versions: [
      {
        version: 1,
        submittedAt: '2026-09-18T14:32:00+07:00',
        type: 'teks',
        content: ANSWER_V1,
        late: false,
        status: 'menunggu-review',
        assessment: assessment([87, 90, 84, 89]),
      },
    ],
  },
  {
    id: 'sub-03',
    taskId: 'tsk-01',
    studentId: 'std-03',
    status: 'menunggu-review',
    versions: [
      {
        version: 1,
        submittedAt: '2026-09-18T20:11:00+07:00',
        type: 'pdf',
        content: 'Berkas PDF 6 halaman berisi analisis algoritma pencarian.',
        fileName: 'analisis-algoritma-siti.pdf',
        fileSizeKb: 842,
        late: false,
        status: 'menunggu-review',
        assessment: assessment([78, 74, 70, 82]),
      },
    ],
  },
  {
    id: 'sub-04',
    taskId: 'tsk-01',
    studentId: 'std-04',
    status: 'terlambat',
    versions: [
      {
        version: 1,
        submittedAt: '2026-09-21T08:40:00+07:00',
        type: 'teks',
        content: ANSWER_V1,
        late: true,
        status: 'ai-menilai',
      },
    ],
  },
  {
    id: 'sub-05',
    taskId: 'tsk-01',
    studentId: 'std-05',
    status: 'ai-gagal',
    versions: [
      {
        version: 1,
        submittedAt: '2026-09-18T22:05:00+07:00',
        type: 'kode',
        content: 'def binary_search(data, target):\n    low, high = 0, len(data) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if data[mid] == target:\n            return mid\n        if data[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1',
        late: false,
        status: 'ai-gagal',
      },
    ],
  },
  {
    id: 'sub-06',
    taskId: 'tsk-02',
    studentId: 'std-01',
    status: 'dikumpulkan',
    versions: [
      {
        version: 1,
        submittedAt: '2026-09-19T11:02:00+07:00',
        type: 'kode',
        content: 'class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None',
        late: false,
        status: 'ai-menilai',
      },
    ],
  },
];

export const ACTIVITIES: ActivityItemData[] = [
  {
    id: 'act-01',
    kind: 'pengumpulan',
    title: 'Mahasiswa mengumpulkan tugas',
    description: 'Rizky Pratama — Analisis Algoritma Pencarian',
    at: '2026-09-18T14:32:00+07:00',
    read: false,
  },
  {
    id: 'act-02',
    kind: 'ai-selesai',
    title: 'AI selesai menganalisis 5 tugas',
    description: 'Analisis Algoritma Pencarian — menunggu review Anda',
    at: '2026-09-18T15:10:00+07:00',
    read: false,
  },
  {
    id: 'act-03',
    kind: 'tugas-baru',
    title: 'Tugas "Normalisasi Basis Data" dibuat',
    description: 'Kelas Basis Data — tenggat 28 September 2026',
    at: '2026-09-15T08:12:00+07:00',
    read: true,
  },
  {
    id: 'act-04',
    kind: 'kelas-baru',
    title: 'Kelas baru dibuat: Basis Data',
    description: 'Kode kelas SI-210 — 6 mahasiswa bergabung',
    at: '2026-09-11T09:00:00+07:00',
    read: true,
  },
  {
    id: 'act-05',
    kind: 'ai-gagal',
    title: 'AI gagal menilai satu pengumpulan',
    description: 'Eka Saputra — Analisis Algoritma Pencarian',
    at: '2026-09-18T22:09:00+07:00',
    read: false,
  },
];

/** Mahasiswa yang sedang masuk pada lingkungan demo. */
export const CURRENT_STUDENT_ID = 'std-01';
