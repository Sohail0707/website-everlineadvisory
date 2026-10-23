/** Shared by BookingPanel's server render and its client script. */

export interface DayCell {
  day: number | null;
  open: boolean;
  /** ISO date (yyyy-mm-dd) for real days */
  iso?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');
export const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

/** "September 2026". Names come from Intl (built into browsers and Node), so any locale works. */
export function monthLabel(year: number, month: number, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
}

/** "Wed, Sep 16" (en-US) / "Mi., 16. Sept." (de-DE) */
export function dayLabel(iso: string, locale = 'en-US') {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(y, m - 1, d));
}

/** Weekday headers, Sunday first: short letters ("S", "M"…) and full names for tooltips. */
export function weekdayNames(locale = 'en-US') {
  // 4 Oct 2026 is a Sunday.
  const days = Array.from({ length: 7 }, (_, i) => new Date(2026, 9, 4 + i));
  return {
    narrow: days.map((d) => new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(d)),
    long: days.map((d) => new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(d)),
  };
}

/** Calendar cells for a month, padded with blanks to whole weeks (Sunday first). */
export function buildMonth(year: number, month: number, todayIso: string, openWeekdays: number[]): DayCell[] {
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: DayCell[] = [];
  for (let i = 0; i < first; i++) cells.push({ day: null, open: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toIso(year, month, d);
    const weekday = (first + d - 1) % 7;
    cells.push({ day: d, iso, open: openWeekdays.includes(weekday) && iso >= todayIso });
  }
  while (cells.length % 7) cells.push({ day: null, open: false });
  return cells;
}

/** First bookable date on or after `fromIso`, searching up to ~2 months ahead. */
export function firstOpenDay(fromIso: string, openWeekdays: number[]): string {
  const [y, m, d] = fromIso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  for (let i = 0; i < 62; i++) {
    if (openWeekdays.includes(date.getDay())) return toIso(date.getFullYear(), date.getMonth(), date.getDate());
    date.setDate(date.getDate() + 1);
  }
  return fromIso;
}

export function todayIso(now = new Date()) {
  return toIso(now.getFullYear(), now.getMonth(), now.getDate());
}
