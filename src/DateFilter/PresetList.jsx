import { useState } from 'react';
import { PRESETS } from './presets.js';
import { parseShorthand } from './parseShorthand.js';
import Option from './Option.jsx';

export default function PresetList({ selectedPresetId, onPreset, onShorthand, onOpenCustom }) {
  const [text, setText] = useState('');
  const [invalid, setInvalid] = useState(false);

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return;
    const result = parseShorthand(text);
    if (!result) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    onShorthand(result);
  }

  return (
    <div
      className="w-[294px] bg-bg-white border border-border-primary rounded py-2 flex flex-col"
      style={{ boxShadow: '0 10px 30px -12px rgba(10,10,10,0.18), 0 2px 6px -2px rgba(10,10,10,0.06)' }}
      role="listbox"
    >
      <div className="px-2 pb-2">
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
        />
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
          <span>Custom range</span>
          <span aria-hidden className="transition-transform duration-200">→</span>
        </button>
      </div>
    </div>
  );
}
