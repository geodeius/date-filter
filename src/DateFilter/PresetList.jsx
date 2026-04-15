import { useMemo, useState } from 'react';
import { PRESETS } from './presets.js';
import { parseShorthand } from './parseShorthand.js';
import Option from './Option.jsx';

function predictUnit(n) {
  if (n === 1) return { unit: 'h', suffix: ' hour' };
  if ([7, 14, 30, 90].includes(n)) return { unit: 'd', suffix: ' days' };
  if (n === 24) return { unit: 'h', suffix: ' hours' };
  if (n <= 48) return { unit: 'h', suffix: n === 1 ? ' hour' : ' hours' };
  if (n <= 365) return { unit: 'd', suffix: ' days' };
  return { unit: 'w', suffix: ' weeks' };
}

export default function PresetList({ selectedPresetId, onPreset, onShorthand, onOpenCustom }) {
  const [text, setText] = useState('');
  const [invalid, setInvalid] = useState(false);

  const prediction = useMemo(() => {
    const m = text.match(/^(\s*)(\d+)(\s*)$/);
    if (!m) return null;
    const n = parseInt(m[2], 10);
    if (!n) return null;
    const p = predictUnit(n);
    return { ...p, raw: text, number: m[2], completed: `${m[2]}${p.unit}` };
  }, [text]);

  function resolve(input) {
    const result = parseShorthand(input);
    if (!result) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    onShorthand(result);
  }

  function handleKeyDown(e) {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && prediction) {
      // Only accept ArrowRight if caret is at the end
      if (e.key === 'ArrowRight') {
        const el = e.currentTarget;
        if (el.selectionStart !== el.value.length) return;
      }
      e.preventDefault();
      setText(prediction.completed);
      return;
    }
    if (e.key !== 'Enter') return;
    const value = prediction ? prediction.completed : text;
    resolve(value);
  }

  return (
    <div
      className="w-[294px] bg-bg-white border border-border-primary rounded py-2 flex flex-col"
      style={{ boxShadow: '0 10px 30px -12px rgba(10,10,10,0.18), 0 2px 6px -2px rgba(10,10,10,0.06)' }}
      role="listbox"
    >
      <div className="px-2 pb-2">
        <div className="df-input-wrap">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (invalid) setInvalid(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Custom range: 10min, 1H, 2H..."
            className="df-input"
            data-invalid={invalid}
            autoComplete="off"
            spellCheck="false"
          />
          {prediction && (
            <div className="df-input-ghost" aria-hidden>
              <span className="df-input-ghost-mirror">{prediction.raw}</span>
              <span className="df-input-ghost-suffix">{prediction.suffix}</span>
              <span className="df-input-ghost-kbd">Tab</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-2 flex flex-col gap-0.5">
        {PRESETS.map((p, i) => (
          <Option
            key={p.id}
            label={p.label}
            active={selectedPresetId === p.id}
            onClick={() => onPreset(p.id)}
            style={{
              animation: `df-view-in 360ms var(--ease-out-strong) both`,
              animationDelay: `${60 + i * 28}ms`,
            }}
          />
        ))}
      </div>
      <div className="mt-2 border-t border-border-primary pt-2 px-2">
        <button type="button" onClick={onOpenCustom} className="df-option">
          <span className="w-4 h-4 shrink-0" aria-hidden />
          <span>Custom range</span>
          <span aria-hidden className="ml-auto df-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
