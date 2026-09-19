/** Indonesian formatting helpers. All output is deterministic (no ICU locale dependency). */

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const jakartaParts = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function parts(input: Date | string | number) {
  const map: Record<string, string> = {};
  for (const p of jakartaParts.formatToParts(new Date(input))) map[p.type] = p.value;
  return map;
}

/** 87.5 -> "87,5"; 91 -> "91" */
export function formatScore(value: number, fractionDigits = 1): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(fractionDigits).replace('.', ',');
}

/** -> "19 September 2026" (Asia/Jakarta) */
export function formatDate(input: Date | string | number): string {
  const p = parts(input);
  return `${Number(p.day)} ${MONTHS[Number(p.month) - 1]} ${p.year}`;
}

/** -> "15.30 WIB" */
export function formatTime(input: Date | string | number): string {
  const p = parts(input);
  const hour = p.hour === '24' ? '00' : p.hour;
  return `${hour}.${p.minute} WIB`;
}
