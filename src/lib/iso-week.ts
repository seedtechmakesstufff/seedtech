/* ── ISO 8601 Week Helpers ──
 * Weeks start Monday. Week 1 of a year is the week containing the first
 * Thursday. Format: "YYYY-Www" (e.g. "2026-W19").
 */

export function toIsoWeek(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((date.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getUTCDay() + 6) % 7)) /
        7
    );
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function isoWeekRange(week: string): { start: Date; end: Date } {
  const m = week.match(/^(\d{4})-W(\d{2})$/);
  if (!m) throw new Error(`Invalid ISO week: ${week}`);
  const year = parseInt(m[1]!, 10);
  const w = parseInt(m[2]!, 10);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfJan4 = (jan4.getUTCDay() + 6) % 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - dayOfJan4);
  const start = new Date(week1Monday);
  start.setUTCDate(week1Monday.getUTCDate() + (w - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 7);
  return { start, end };
}

/** Human-friendly label, e.g. "May 4 – May 10, 2026". */
export function isoWeekLabel(week: string): string {
  const { start, end } = isoWeekRange(week);
  const last = new Date(end);
  last.setUTCDate(last.getUTCDate() - 1);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${fmt(start)} – ${fmt(last)}, ${last.getUTCFullYear()}`;
}
