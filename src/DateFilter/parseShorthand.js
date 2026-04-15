const UNIT_MS = {
  min: 60 * 1000,
  m:   60 * 1000,
  h:   60 * 60 * 1000,
  d:   24 * 60 * 60 * 1000,
  w:   7 * 24 * 60 * 60 * 1000,
};

const UNIT_WORD = {
  min: 'minute',
  m:   'minute',
  h:   'hour',
  d:   'day',
  w:   'week',
};

export function formatDuration(n, unit) {
  const word = UNIT_WORD[unit];
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

export function parseShorthand(input, now = new Date()) {
  if (typeof input !== 'string') return null;
  const match = input.trim().toLowerCase().match(/^(\d+)\s*(min|m|h|d|w)$/);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  if (!n) return null;
  const unit = match[2];
  const ms = n * UNIT_MS[unit];
  return {
    from: new Date(now.getTime() - ms).toISOString(),
    to: now.toISOString(),
    label: formatDuration(n, unit),
  };
}
