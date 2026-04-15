import { useEffect, useRef, useState } from 'react';
import PresetList from './PresetList.jsx';
import CustomRangeView from './CustomRangeView.jsx';
import { PRESETS, resolvePreset } from './presets.js';

function useDelayedUnmount(open, exitMs = 200) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(t);
  }, [open, exitMs]);
  return { mounted, visible };
}

function labelFor(selectedPresetId, customLabel, currentRange) {
  if (selectedPresetId) {
    const p = PRESETS.find((x) => x.id === selectedPresetId);
    if (p) return p.label;
  }
  if (customLabel) return customLabel;
  if (currentRange?.from && currentRange?.to) return 'Custom range';
  return 'Date/time';
}

export default function DateFilter({ value, defaultValue = null, onChange, timezone = 'GMT' }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value : internal;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState('presets');
  const [viewDirection, setViewDirection] = useState('forward');
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [customLabel, setCustomLabel] = useState(null);
  const rootRef = useRef(null);

  const { mounted, visible } = useDelayedUnmount(open, 200);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function emit(result) {
    if (!isControlled) setInternal({ from: result.from, to: result.to });
    onChange?.(result);
  }

  function handlePreset(id) {
    const r = resolvePreset(id);
    if (!r) return;
    setSelectedPresetId(id);
    setCustomLabel(null);
    emit({ ...r, preset: id });
    setOpen(false);
  }

  function handleShorthand(r) {
    setSelectedPresetId(null);
    setCustomLabel(r.label || null);
    emit({ from: r.from, to: r.to, preset: 'custom', label: r.label });
    setOpen(false);
  }

  function handleApplyCustom(r) {
    setSelectedPresetId(null);
    setCustomLabel(r.label || null);
    emit(r);
    setOpen(false);
    setTimeout(() => {
      setView('presets');
      setViewDirection('forward');
    }, 220);
  }

  function openCustom() {
    setViewDirection('forward');
    setView('custom');
  }

  function backToPresets() {
    setViewDirection('back');
    setView('presets');
  }

  const label = labelFor(selectedPresetId, customLabel, current);

  return (
    <div ref={rootRef} className="relative inline-block font-sans">
      <button
        type="button"
        data-open={open}
        onClick={() => {
          setOpen((o) => !o);
          if (!open) {
            setView('presets');
            setViewDirection('forward');
          }
        }}
        className="df-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span key={label} className="df-trigger-label">{label}</span>
        <svg
          className="df-caret"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {mounted && (
        <div
          className="df-popover absolute left-0 top-full mt-2 z-50"
          data-state={visible ? 'open' : 'closed'}
        >
          <div className="df-view" data-direction={viewDirection} key={view}>
            {view === 'presets' ? (
              <PresetList
                selectedPresetId={selectedPresetId}
                onPreset={handlePreset}
                onShorthand={handleShorthand}
                onOpenCustom={openCustom}
              />
            ) : (
              <CustomRangeView onBack={backToPresets} onApply={handleApplyCustom} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
