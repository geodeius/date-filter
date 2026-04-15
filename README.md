# Date Filter

A small React + Vite demo showcasing a reusable `DateFilter` component. It renders a table of sample events and lets you narrow the list down by selecting a date range.

## Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Vitest (unit tests)

## Getting started

Prerequisites: Node.js 18+ and npm.

```bash
npm install
```

## Running

Start the dev server:

```bash
npm run dev
```

Vite will print a local URL (typically http://localhost:5173) — open it in your browser.

## Other scripts

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm test          # run the Vitest suite
```

## Project layout

- [src/App.jsx](src/App.jsx) — demo page wiring the `DateFilter` to a sample events table
- [src/DateFilter.jsx](src/DateFilter.jsx) — the date range filter component
