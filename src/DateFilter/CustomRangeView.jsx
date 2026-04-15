import { useEffect, useRef, useState } from 'react';
import Calendar from './Calendar.jsx';
import Option from './Option.jsx';
import { MONTH_NAMES } from './calendar.js';

function VerticalPicker({ items, selectedIndex, onPick, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current?.querySelector('[data-active="true"]');
    if (el) el.scrollIntoView({ block: 'center' });
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="df-picker max-h-[248px] overflow-y-auto flex flex-col gap-0.5 px-1 py-1"
      role="listbox"
    >
      {items.map((item, i) => (
        <Option
          key={item.key}
          label={item.label}
          active={i === selectedIndex}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  );
}

export default function CustomRangeView({ onBack, onApply, initialDate = new Date() }) {
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth());
  const [draft, setDraft] = useState({ from: null, to: null });
  const [picker, setPicker] = useState('none');

  function navigate(delta) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function pickDay(day) {
    const clone = new Date(day);
    if (!draft.from || (draft.from && draft.to)) {
      setDraft({ from: clone, to: null });
    } else {
      const from = draft.from;
      if (clone < from) setDraft({ from: clone, to: from });
      else setDraft({ from, to: clone });
    }
  }

  function apply() {
    if (!draft.from) return;
    const from = new Date(draft.from);
    from.setHours(0, 0, 0, 0);
    const to = new Date(draft.to || draft.from);
    to.setHours(23, 59, 59, 999);
    onApply({
      from: from.toISOString(),
      to: to.toISOString(),
      preset: 'custom',
    });
  }

  const monthKey = `${year}-${month}-${picker}`;
  const canApply = !!draft.from;

  const baseYear = initialDate.getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => baseYear - 10 + i);
  const yearIndex = years.indexOf(year);
  const monthItems = MONTH_NAMES.map((m) => ({ key: m, label: m }));
  const yearItems = years.map((y) => ({ key: y, label: String(y) }));

  return (
    <div
      className="w-[326px] bg-bg-white border border-border-primary rounded p-3 flex flex-col gap-3"
      style={{ boxShadow: '0 10px 30px -12px rgba(10,10,10,0.18), 0 2px 6px -2px rgba(10,10,10,0.06)' }}
    >
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="df-ghost inline-flex items-center gap-1">
          <span aria-hidden>←</span>
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={apply}
          disabled={!canApply}
          className="df-apply"
        >
          Apply
        </button>
      </div>

      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="df-ghost"
          aria-label="Previous month"
          disabled={picker !== 'none'}
          style={picker !== 'none' ? { opacity: 0.3, pointerEvents: 'none' } : undefined}
        >
          ←
        </button>
        <div className="text-paragraph-sm font-medium flex items-center gap-1">
          <button
            type="button"
            className="df-ghost px-1.5"
            onClick={() => setPicker((p) => (p === 'month' ? 'none' : 'month'))}
            data-open={picker === 'month'}
            aria-label="Select month"
          >
            <span key={monthKey + 'm'} className="df-month-title">
              {MONTH_NAMES[month]}
            </span>
          </button>
          <span className="text-text-placeholder">•</span>
          <button
            type="button"
            className="df-ghost px-1.5"
            onClick={() => setPicker((p) => (p === 'year' ? 'none' : 'year'))}
            data-open={picker === 'year'}
            aria-label="Select year"
          >
            <span key={monthKey + 'y'} className="df-month-title">
              {year}
            </span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigate(1)}
          className="df-ghost"
          aria-label="Next month"
          disabled={picker !== 'none'}
          style={picker !== 'none' ? { opacity: 0.3, pointerEvents: 'none' } : undefined}
        >
          →
        </button>
      </div>

      <div className="df-picker-swap" data-mode={picker}>
        {picker === 'none' && (
          <Calendar year={year} month={month} draftRange={draft} onPickDay={pickDay} />
        )}
        {picker === 'month' && (
          <VerticalPicker
            items={monthItems}
            selectedIndex={month}
            onPick={(i) => {
              setMonth(i);
              setPicker('none');
            }}
            onClose={() => setPicker('none')}
          />
        )}
        {picker === 'year' && (
          <VerticalPicker
            items={yearItems}
            selectedIndex={yearIndex}
            onPick={(i) => {
              setYear(years[i]);
              setPicker('none');
            }}
            onClose={() => setPicker('none')}
          />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border-primary pt-2 text-paragraph-sm">
        <span className="text-text-placeholder">🌐 Timezone • GMT</span>
        <button
          type="button"
          className="df-ghost"
          onClick={() => {
            /* TODO: timezone picker */
          }}
        >
          Change timezone
        </button>
      </div>
    </div>
  );
}
