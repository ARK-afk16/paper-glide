import React from 'react';
import { Check, Lock, Play } from 'lucide-react';

export default function LevelSelect({ levels, completed, bests, onPlay }) {
  return (
    <div className="absolute inset-0 overflow-y-auto bg-[rgba(246,239,226,0.84)] px-4 py-6 backdrop-blur-[3px] sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[rgba(36,31,26,0.45)]">
          House map
        </p>
        <h2 className="mt-2 font-display text-2xl leading-tight text-[#241F1A] sm:text-3xl">
          Fly a room to its finish line
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[rgba(36,31,26,0.55)]">
          Each room is a fixed course. Reach the checkered line to unlock the next one.
        </p>

        <ul className="mt-5 space-y-2">
          {levels.map((lv, i) => {
            const done = completed.includes(lv.id);
            const unlocked = i === 0 || completed.includes(levels[i - 1].id);
            const best = bests[lv.id];
            return (
              <li key={lv.id}>
                <button
                  onClick={() => onPlay(lv)}
                  disabled={!unlocked}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    unlocked
                      ? 'border-[rgba(36,31,26,0.12)] bg-[#FBF6EC] hover:border-[rgba(36,31,26,0.35)]'
                      : 'border-[rgba(36,31,26,0.08)] bg-[rgba(251,246,236,0.5)] opacity-60'
                  }`}
                >
                  <span className="font-display text-lg tabular-nums text-[rgba(36,31,26,0.35)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base text-[#241F1A]">{lv.name}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-[rgba(36,31,26,0.5)]">
                      {best ? `Best ${best} · ${lv.blurb}` : lv.blurb}
                    </span>
                  </span>
                  {done ? (
                    <Check className="h-4 w-4 shrink-0 text-[#7C8B6F]" />
                  ) : unlocked ? (
                    <Play className="h-4 w-4 shrink-0 text-[#241F1A]" />
                  ) : (
                    <Lock className="h-4 w-4 shrink-0 text-[rgba(36,31,26,0.35)]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}