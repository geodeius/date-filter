export const PRESETS = [
  { id: 'last_1h',  label: 'Last hour',     ms: 60 * 60 * 1000 },
  { id: 'last_24h', label: 'Last 24 hours', ms: 24 * 60 * 60 * 1000 },
  { id: 'last_7d',  label: 'Last 7 days',   ms: 7  * 24 * 60 * 60 * 1000 },
  { id: 'last_14d', label: 'Last 14 days',  ms: 14 * 24 * 60 * 60 * 1000 },
  { id: 'last_30d', label: 'Last 30 days',  ms: 30 * 24 * 60 * 60 * 1000 },
  { id: 'last_90d', label: 'Last 90 days',  ms: 90 * 24 * 60 * 60 * 1000 },
];

export function resolvePreset(id, now = new Date()) {
  const p = PRESETS.find((x) => x.id === id);
  if (!p) return null;
  return {
    from: new Date(now.getTime() - p.ms).toISOString(),
    to: now.toISOString(),
  };
}
