// schema.org Event dates must be ISO 8601. The CMS API sends "Oct 23, 2026"
// plus a separate "19:30"; this joins them as local venue time.
const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

/** "Oct 23, 2026" + "19:30" → "2026-10-23T19:30"; null if unparseable. */
export function isoStartDate(
  date: string,
  time?: string | null,
): string | null {
  const m = /^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),\s*(\d{4})$/.exec(date.trim());
  if (!m) return null;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  if (month === -1) return null;
  const day = `${m[3]}-${String(month + 1).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  const t = time ? /^(\d{1,2}):(\d{2})$/.exec(time.trim()) : null;
  return t ? `${day}T${t[1].padStart(2, "0")}:${t[2]}` : day;
}
