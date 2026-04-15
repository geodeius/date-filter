# Date Filter — Implementation Plan

## Context

Greenfield project in `/Users/macbook/Documents/date filter` (empty directory). Goal: build a reusable React "Date/time" filter component matching the Figma design at `CR2ji0i920dZttq4uwek4m` (pages `14:3286` and `15:3287`). The filter is a dropdown with preset relative ranges (Last hour → Last 90 days), an inline shorthand input, and a secondary calendar view for picking a custom range — and emits a resolved `{from, to}` ISO timestamp pair via `onChange`.

## Design reference (Figma)

Two views on page `15:3287` ("date filter"):

1. **Trigger + preset dropdown** (`15:3288`, mirrors original `14:3286`)
   - Button "Date/time" with caret (`12:1047` / `15:3289`)
   - Dropdown `294 × 365`, rounded 8, white bg
   - Search input placeholder: `Custom range: 10min, 1H, 2H...` (parses shorthand)
   - Preset list: Last hour, Last 24 hours, Last 7 days, Last 14 days, Last 30 days, Last 90 days
   - Bottom-bordered row: `Custom range →` (opens calendar view)
   - Option states (`15:3304`): `default`, `onHover` (tinted bg), `active` (check icon + tinted bg)

2. **Custom range calendar view** (`15:3320`)
   - Header: `< Back` on left, `Apply` button (black) on right
   - Month navigation: `← April • 2026 →`
   - 7-column weekday grid SUN–SAT, day cells 28×28; selected day has black circular bg (e.g. `15`)
   - Footer: `🌐 Timezone • GMT` on left, `Change timezone` button on right

### Design tokens (from Figma)
- Font: Inter (Regular 400, Medium 500), 14px `paragraph-sm`, line-height 1.429
- Text primary `#0a0a0a`, placeholder `#a3a3a3`, border primary `#f0f0f0`, border secondary `#e5e5e5`
- Radii: button/input/option `8px`
- Spacing scale: 0/4/8/12/16 (maps cleanly to Tailwind)

## Stack

- **Vite + React (JavaScript) + Tailwind CSS**
- No extra date library — a tiny hand-written helper covers the month grid and shorthand parser (avoids pulling in date-fns/dayjs for ~30 lines of logic). Revisit if scope grows.
- No CLI wrapper. Library-only, with a demo `App.jsx` that renders the filter and shows the resolved `{from, to}` for manual verification.

## File layout

```
date filter/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                       # demo page
    ├── index.css                     # tailwind directives
    └── DateFilter/
        ├── index.js                  # re-exports
        ├── DateFilter.jsx            # top-level component (button + popover)
        ├── PresetList.jsx            # shorthand input + preset options + "Custom range →"
        ├── CustomRangeView.jsx       # calendar view (Back / Apply / month grid / timezone row)
        ├── Calendar.jsx              # month-grid primitive
        ├── Option.jsx                # reusable row (default / hover / active states)
        ├── presets.js                # PRESETS array + resolvePreset(preset, now) → {from, to}
        ├── parseShorthand.js         # "10min" | "1h" | "2H" | "3d" → duration → {from, to}
        ├── calendar.js               # buildMonthMatrix(year, month) → Date[][]
        └── DateFilter.module.css     # only if Tailwind can't express something
```

## Component contract

```jsx
<DateFilter
  value={{ from, to } | null}           // controlled ISO strings, optional
  defaultValue={{ from, to } | null}    // uncontrolled initial
  onChange={({ from, to, preset }) => …} // from/to = ISO strings, preset = id or 'custom'
  timezone="GMT"                         // display only for v1
/>
```

Internal state:
- `open` — dropdown visibility
- `view` — `"presets"` | `"custom"`
- `draftRange` — `{from: Date|null, to: Date|null}` while picking on the calendar
- `selectedPresetId` — for check-icon active state
- `shorthandText` — controlled input inside PresetList

Resolution rules:
- Preset click → compute `{from: now - duration, to: now}`, call `onChange`, close
- Shorthand input Enter → `parseShorthand` → same resolution; invalid → inline red border, no close
- Custom range: pick start day, then end day (or same day twice); `Apply` resolves to `{from: start 00:00, to: end 23:59:59.999}` in local tz for v1

## Key logic

### `presets.js`
```js
export const PRESETS = [
  { id: 'last_1h',  label: 'Last hour',    ms: 60 * 60 * 1000 },
  { id: 'last_24h', label: 'Last 24 hours', ms: 24 * 60 * 60 * 1000 },
  { id: 'last_7d',  label: 'Last 7 days',  ms: 7  * 24 * 60 * 60 * 1000 },
  { id: 'last_14d', label: 'Last 14 days', ms: 14 * 24 * 60 * 60 * 1000 },
  { id: 'last_30d', label: 'Last 30 days', ms: 30 * 24 * 60 * 60 * 1000 },
  { id: 'last_90d', label: 'Last 90 days', ms: 90 * 24 * 60 * 60 * 1000 },
];
export const resolvePreset = (id, now = new Date()) => {
  const p = PRESETS.find(x => x.id === id);
  return { from: new Date(now - p.ms).toISOString(), to: now.toISOString() };
};
```

### `parseShorthand.js`
Regex `^\s*(\d+)\s*(min|m|h|d|w)\s*$` (case-insensitive). Returns `{from, to}` in ISO or `null`.

### `calendar.js`
`buildMonthMatrix(year, month)` returns a 6×7 array of `Date` objects covering the visible month (leading/trailing grays). Week starts on Sunday to match the Figma layout.

## Critical files to create

- `src/DateFilter/DateFilter.jsx` — orchestrates button, popover, and view switching
- `src/DateFilter/PresetList.jsx` — matches Figma node `15:3291`
- `src/DateFilter/CustomRangeView.jsx` — matches Figma node `15:3321`
- `src/DateFilter/Calendar.jsx` — matches Figma node `15:3325`
- `src/DateFilter/presets.js`, `parseShorthand.js`, `calendar.js` — logic helpers

## Styling approach

Convert the Tailwind classes the Figma MCP already emitted (we got a full JSX snippet for the preset dropdown) into clean, readable Tailwind — drop the `var(--…)` custom properties in favor of direct hex/tokens in `tailwind.config.js`'s `theme.extend.colors`:

```js
colors: {
  bg: { white: '#ffffff', primary: '#ffffff' },
  text: { primary: '#0a0a0a', placeholder: '#a3a3a3' },
  border: { primary: '#f0f0f0', secondary: '#e5e5e5' },
}
```

Font: add `Inter` via `@fontsource/inter` (small, no CDN).

## Verification

1. `npm install && npm run dev` — serves the demo `App.jsx`.
2. Manual checks in the browser:
   - Click "Date/time" → dropdown opens, matches Figma `15:3288` visually
   - Click each preset → dropdown closes, demo page shows resolved `{from, to}` with correct offset from current time (today is 2026-04-15)
   - Type `2h` + Enter → same behavior; type `garbage` + Enter → red border, no close
   - Click "Custom range →" → calendar view opens, matches Figma `15:3320`
   - Click `< Back` → returns to preset view
   - Click two days on the calendar → range highlights, `Apply` emits ISO `{from, to}`
   - Active preset shows check icon on re-open
3. A tiny `parseShorthand.test.js` with Vitest covering: `10min`, `1h`, `2H`, `3d`, `1w`, `""`, `"abc"`. (Skip if scope feels too big — the logic is trivial.)

## Out of scope for v1

- Actually changing timezone (the "Change timezone" button is a no-op stub with a TODO)
- Keyboard navigation within the calendar (arrow keys)
- Range-crossing-months UI (v1 shows one month; `←`/`→` navigate)
- ARIA / full a11y pass — add basic `role="listbox"`/`role="option"` but defer full audit