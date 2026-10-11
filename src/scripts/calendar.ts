/** Shared by BookingPanel's server render and its client script. */

export interface DayCell {
  day: number | null;
  open: boolean;
  /** ISO date (yyyy-mm-dd) for real days */
  iso?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pad = (n: number) => String(n).padStart(2, '0');
export const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function monthLabel(year: number, month: number) {
  return `${MONTHS[month]} ${year}`;
}

/** "Wed, Sep 16" */
export function dayLabel(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAYS_SHORT[date.getDay()]}, ${MONTHS_SHORT[m - 1]} ${d}`;
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
