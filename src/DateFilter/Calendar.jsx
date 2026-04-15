import { buildMonthMatrix, WEEKDAYS, sameDay } from './calendar.js';

function isBetween(day, a, b) {
  if (!a || !b) return false;
  const t = new Date(day).setHours(12, 0, 0, 0);
  const lo = Math.min(a.getTime(), b.getTime());
  const hi = Math.max(a.getTime(), b.getTime());
  return t >= lo && t <= hi;
}

export default function Calendar({ year, month, draftRange, onPickDay }) {
  const weeks = buildMonthMatrix(year, month);
  const { from, to } = draftRange;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-[11px] text-text-placeholder text-center py-1 tracking-wider">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day, i) => {
          const isCurrentMonth = day.getMonth() === month;
          const isStart = from && sameDay(day, from);
          const isEnd = to && sameDay(day, to);
          const selected = !!(isStart || isEnd);
          const inRange = isBetween(day, from, to) && !selected;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPickDay(day)}
              className="df-day"
              data-selected={selected}
              data-in-range={inRange}
              data-muted={!isCurrentMonth}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
