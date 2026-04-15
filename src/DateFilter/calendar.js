export function buildMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const start = new Date(year, month, 1 - startOffset);
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      row.push(day);
    }
    weeks.push(row);
  }
  return weeks;
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function inRange(day, from, to) {
  if (!from || !to) return false;
  const t = day.getTime();
  const [lo, hi] = from <= to ? [from, to] : [to, from];
  return t >= lo.setHours(0, 0, 0, 0) && t <= hi.setHours(23, 59, 59, 999);
}
