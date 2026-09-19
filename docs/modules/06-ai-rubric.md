# EssayFlow — Modul 06: AI Rubric Workspace

| Item | Keterangan |
|---|---|
| Nama | 06 — AI Rubric Workspace |
| Route | `/teacher/tasks/create/rubric`, `POST /api/ai/rubric` |

## Berkas baru
- `src/app/teacher/tasks/create/rubric/page.tsx`
- `src/app/api/ai/rubric/route.ts`
- `src/components/teacher/RubricWorkspace.tsx`

## Cakupan
Antarmuka dua kolom: kiri **Rubrik Penilaian** (editable), kanan **AI EssayFlow**.
Preset instruksi, instruksi tambahan bebas, Buat Ulang, Terapkan per kriteria,
Terapkan Semua, dan Simpan Rubrik (aktif hanya bila total bobot 100%).
Hasil AI selalu berstatus draf dan dapat diedit manual.

## Layanan AI
`src/lib/ai/ai-service.ts` berisi kontrak `AIService`. Implementasi aktif adalah mock
deterministik. Tidak ada kunci API palsu; provider nyata dibaca dari `AI_PROVIDER_API_KEY`.

## Modul berikutnya
07 — Teacher Task Detail


---

## MODULE_MANIFEST — 06 AI Rubric Workspace

MODULE: 06 — AI Rubric Workspace
ROUTES: `/teacher/tasks/create/rubric`, `POST /api/ai/rubric`
NEW COMPONENTS: `RubricWorkspace`
MODIFIED COMPONENTS: tidak ada
NEW TYPES: `RubricSuggestion`, `EvaluationDraft` (di `lib/ai/ai-service.ts`)
NEW UTILITIES: `presetRubric`, `RUBRIC_PRESETS`, `getAIService`, `isAIProviderConfigured`
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: `AI_PROVIDER_API_KEY`
API/SERVICE INTERFACES: `AIService.suggestRubric`, `AIService.evaluate`
INTEGRATION POINTS: Modul 08 memakai `AIService.evaluate` untuk draf penilaian
NEXT MODULE: 07 — Teacher Task Detail
KNOWN ISSUES: rubrik tersimpan belum otomatis terbawa ke formulir tugas (menunggu persistensi)
