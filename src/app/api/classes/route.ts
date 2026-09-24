import { NextResponse } from 'next/server';
import { createClass, listClasses } from '@/lib/data/repository';
import { readSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

/** Lists the signed-in user's classes — RLS already scopes this to their own (teacher) or enrolled (student) classes. */
export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ ok: false, error: 'Tidak ada sesi aktif.' }, { status: 401 });
  const classes = await listClasses();
  return NextResponse.json({ ok: true, classes });
}

export async function POST(request: Request) {
  const session = await readSession();
  if (!session || session.role !== 'pengajar') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.name !== 'string' || !body.name.trim()) {
    return NextResponse.json({ ok: false, error: 'Nama kelas wajib diisi.' }, { status: 400 });
  }
  if (typeof body.code !== 'string' || !body.code.trim()) {
    return NextResponse.json({ ok: false, error: 'Kode kelas wajib diisi.' }, { status: 400 });
  }

  try {
    const created = await createClass({
      name: body.name.trim(),
      program: typeof body.program === 'string' ? body.program : '',
      semester: typeof body.semester === 'string' ? body.semester : '',
      code: body.code.trim(),
    });
    return NextResponse.json({ ok: true, class: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal membuat kelas.';
    // Postgres unique-violation on classes.code surfaces here as a generic message; make it readable.
    const readable = message.includes('duplicate key') ? 'Kode kelas sudah dipakai. Pilih kode lain.' : message;
    return NextResponse.json({ ok: false, error: readable }, { status: 400 });
  }
}
