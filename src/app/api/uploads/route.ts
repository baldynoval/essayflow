import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { readSession } from '@/lib/auth/session';
import { getTask } from '@/lib/data/repository';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

/**
 * Accepts a multipart/form-data upload (fields: file, taskId) for PDF/Word
 * submissions, stores it in the private "submissions" Storage bucket under
 * <student_id>/<task_id>/<filename>, and returns a short-lived signed URL the
 * client sends on to POST /api/submissions as `content`.
 *
 * Requires the "submissions" bucket + policies from supabase/schema_additions.sql.
 */
export async function POST(request: Request) {
  const session = await readSession();
  if (!session || session.role !== 'mahasiswa') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  const taskId = form?.get('taskId');
  if (!(file instanceof File) || typeof taskId !== 'string' || !taskId) {
    return NextResponse.json({ ok: false, error: 'Berkas atau tugas tidak valid.' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ ok: false, error: 'Jenis berkas harus PDF atau Word.' }, { status: 400 });
  }

  const task = await getTask(taskId);
  if (!task) return NextResponse.json({ ok: false, error: 'Tugas tidak ditemukan.' }, { status: 404 });
  const maxBytes = task.settings.maxFileSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ ok: false, error: `Ukuran berkas melebihi batas ${task.settings.maxFileSizeMb}MB.` }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${session.userId}/${taskId}/${Date.now()}-${safeName}`;

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from('submissions')
    .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
  if (uploadError) {
    return NextResponse.json({ ok: false, error: `Gagal mengunggah berkas: ${uploadError.message}` }, { status: 500 });
  }

  // Valid for 1 year — long enough for teacher review; re-signed on demand would be more correct but adds complexity not needed yet.
  const { data: signed, error: signError } = await supabase.storage
    .from('submissions')
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signError || !signed) {
    return NextResponse.json({ ok: false, error: 'Berkas tersimpan tapi gagal membuat tautan akses.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    url: signed.signedUrl,
    fileName: file.name,
    fileSizeKb: Math.round(file.size / 1024),
  });
}
