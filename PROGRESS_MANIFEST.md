# EssayFlow — Progress Manifest (checkpoint setelah Modul 15)

COMPLETED MODULES
01 Landing · 02 Login · 03 Teacher Dashboard · 04 Student Dashboard · 05 Create Task ·
06 AI Rubric · 07 Teacher Task Detail · 08 AI Review · 09 Classes · 10 Student Task ·
11 Submission Processing · 12 Student Result · 13 Revision History · 14 Profile Settings ·
15 Derivative Pages

CURRENT MODULE: —
NEXT MODULE: —

ROUTES
Publik: `/`, `/login`, `/register`, `/lupa-password`, `/lengkapi-profil`, `/faq`, `/bantuan`, `/kontak`, `/tentang`, `/privasi`, `/ketentuan`
Pengajar: `/teacher`, `/teacher/tasks`, `/teacher/tasks/[id]`, `/teacher/tasks/create`, `/teacher/tasks/create/rubric`, `/teacher/review/[id]`, `/teacher/classes`, `/teacher/classes/[id]`, `/teacher/students`
Mahasiswa: `/student`, `/student/tasks`, `/student/tasks/[id]`, `/student/tasks/[id]/revisions`, `/student/submissions/[id]`, `/student/results`, `/student/results/[id]`, `/student/history`
Bersama: `/settings`
API: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/google`, `POST /api/tasks`, `POST /api/ai/rubric`, `POST /api/submissions`

SHARED COMPONENTS
ui: Button, Card, Badge, StatusBadge, Avatar, Logo, Container, SectionHeading, ScoreDisplay, AIIndicator, Reveal, Tabs, Accordion, Input, SegmentedControl, Alert, PageHeader, MetricCard, EmptyState, Skeleton, SearchInput, Select, Textarea, Toggle, Modal, Table, Timeline, FeedbackPanel
layout: TopNavigation, MarketingFooter, AppShell, Sidebar, MobileNav
app: GlobalSearch, NotificationBell, TaskCard, ActivityItem, RubricSummary, CriteriaScores, SettingsView
auth: AuthShell, AuthVisual, LoginForm, RegisterForm, GoogleIcon
teacher: CreateTaskForm, RubricWorkspace, SubmissionTable, ReviewWorkspace
student: SubmissionForm, AIProcessing

DEPENDENCIES
next 15.5, react 19, framer-motion 12, lucide-react 1.x, tailwindcss 3.4, typescript 5.9, eslint 9, @fontsource-variable/inter, clsx

DATABASE/SERVICE INTERFACES
- `src/lib/data/repository.ts` — satu-satunya akses data (mock in-memory)
- `src/lib/auth/auth-service.ts` — `AuthService` (mock)
- `src/lib/ai/ai-service.ts` — `AIService` (mock deterministik)
- `src/lib/auth/session.ts` — cookie httpOnly bertanda tangan HMAC

DESIGN TOKENS
`src/design/tokens.ts` → `tailwind.config.ts`. Palet, spasi 8–120, radius 10/16/24/32,
bayangan lembut, tipografi Inter, mode gelap lewat `[data-theme="dark"]`.

IMPORTANT IMPLEMENTATION NOTES
- Hanya nama token yang tersedia di Tailwind (mis. `text-body-sm`, `rounded-md` = 16px).
- Hasil AI selalu berlabel draf; nilai mahasiswa hanya tampil setelah pengajar merilis.
- Bahasa Indonesia formal; tanggal `19 September 2026`, waktu `15.30 WIB`, desimal `87,5`.

KNOWN ISSUES
- Belum ada persistensi: pembuatan tugas/kelas, pengumpulan, dan keputusan rilis kembali
  ke data contoh setelah muat ulang.
- Provider Google dan layanan AI nyata menunggu kredensial lingkungan.
