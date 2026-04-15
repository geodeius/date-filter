import { useMemo, useState } from 'react';
import { Agentation } from 'agentation';
import { DateFilter } from './DateFilter';

const ROWS = [
  { id: 'evt_8a31', user: 'ada.lovelace',    event: 'login',          status: 'success', amount: 0,      ts: '2026-04-15T09:12:04Z' },
  { id: 'evt_1f02', user: 'linus.torvalds',  event: 'checkout',       status: 'success', amount: 129.99, ts: '2026-04-15T08:47:51Z' },
  { id: 'evt_44b9', user: 'grace.hopper',    event: 'refund',         status: 'pending', amount: 42.10,  ts: '2026-04-14T22:03:18Z' },
  { id: 'evt_9c70', user: 'alan.turing',     event: 'signup',         status: 'success', amount: 0,      ts: '2026-04-14T17:30:00Z' },
  { id: 'evt_2e15', user: 'margaret.hamilton', event: 'password_reset', status: 'failed', amount: 0,    ts: '2026-04-14T11:12:44Z' },
  { id: 'evt_6d88', user: 'dennis.ritchie',  event: 'checkout',       status: 'failed',  amount: 58.00,  ts: '2026-04-13T19:58:22Z' },
  { id: 'evt_3a47', user: 'ken.thompson',    event: 'api_call',       status: 'success', amount: 0,      ts: '2026-04-13T14:05:09Z' },
  { id: 'evt_7b2c', user: 'barbara.liskov',  event: 'checkout',       status: 'success', amount: 312.45, ts: '2026-04-12T10:41:37Z' },
];

function StatusPill({ status }) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    failed:  'bg-rose-50 text-rose-700 border-rose-100',
  }[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${styles}`}>
      {status}
    </span>
  );
}

function formatTs(ts) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function YourApp() {
  const [range, setRange] = useState(null);

  const filtered = useMemo(() => {
    if (!range?.from || !range?.to) return ROWS;
    const from = new Date(range.from).getTime();
    const to = new Date(range.to).getTime();
    return ROWS.filter((r) => {
      const t = new Date(r.ts).getTime();
      return t >= from && t <= to;
    });
  }, [range]);

  return (
    <div className="min-h-full flex flex-col items-center justify-start pt-16 px-10 pb-10 gap-6">
      <DateFilter onChange={setRange} />

      <div className="w-full max-w-[720px] bg-white border border-border-secondary rounded overflow-hidden">
        <table className="w-full text-paragraph-sm text-left">
          <thead className="bg-[#fafafa] text-text-placeholder">
            <tr>
              <th className="font-medium px-4 py-2.5">Event</th>
              <th className="font-medium px-4 py-2.5">User</th>
              <th className="font-medium px-4 py-2.5">Status</th>
              <th className="font-medium px-4 py-2.5 text-right">Amount</th>
              <th className="font-medium px-4 py-2.5 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-border-primary">
                <td className="px-4 py-2.5 text-text-primary">{row.event}</td>
                <td className="px-4 py-2.5 text-text-primary">{row.user}</td>
                <td className="px-4 py-2.5"><StatusPill status={row.status} /></td>
                <td className="px-4 py-2.5 text-right tabular-nums text-text-primary">
                  {row.amount ? `$${row.amount.toFixed(2)}` : '—'}
                </td>
                <td className="px-4 py-2.5 text-right text-text-placeholder tabular-nums">
                  {formatTs(row.ts)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-text-placeholder">
                  No events in this range
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && <Agentation />}
    </>
  );
}
