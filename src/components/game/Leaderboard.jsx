import React from 'react';

export default function Leaderboard({ scores, best, loading }) {
  return (
    <aside className="flex flex-col rounded-[26px] border border-[rgba(36,31,26,0.12)] bg-[#FBF6EC] p-6 shadow-[0_24px_50px_-34px_rgba(36,31,26,0.45)]">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl text-[#241F1A]">Leaderboard</h2>
        <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[rgba(36,31,26,0.4)]">
          Top 8
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-[#241F1A] px-5 py-4 text-[#FBF6EC]">
        <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[rgba(251,246,236,0.55)]">
          Your best
        </p>
        <p className="font-display text-3xl leading-tight">{best}</p>
      </div>

      <ul className="mt-4 flex-1 space-y-0.5">
        {loading && <li className="px-3 py-2 text-sm text-[rgba(36,31,26,0.4)]">Loading…</li>}
        {!loading && scores.length === 0 && (
          <li className="px-3 py-2 text-sm leading-relaxed text-[rgba(36,31,26,0.4)]">
            No flights logged yet — the first name here could be yours.
          </li>
        )}
        {scores.map((s, i) => (
          <li
            key={s.id}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
              i === 0 ? 'bg-[#C0553B]/8' : ''
            }`}
          >
            <span className="w-4 text-[11px] tabular-nums text-[rgba(36,31,26,0.38)]">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-[#241F1A]">{s.player_name}</span>
            <span className="font-display text-base tabular-nums text-[#241F1A]">{s.score}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-[rgba(36,31,26,0.08)] pt-4 text-[10px] leading-relaxed uppercase tracking-[0.14em] text-[rgba(36,31,26,0.35)]">
        Space bar, tap or click to lift
      </p>
    </aside>
  );
}