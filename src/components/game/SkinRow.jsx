import React from 'react';
import { Check, Lock } from 'lucide-react';
import { skinRatings } from '@/lib/game/skins';

function Bars({ label, value }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[rgba(36,31,26,0.38)]">
        {label}
      </span>
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`h-1 w-2 rounded-full ${
              n <= value ? 'bg-[#241F1A]' : 'bg-[rgba(36,31,26,0.14)]'
            }`}
          />
        ))}
      </span>
    </span>
  );
}

export default function SkinRow({ skin, unlocked, equipped, onSelect }) {
  const ratings = skinRatings(skin);

  return (
    <li>
      <button
        type="button"
        onClick={() => unlocked && onSelect(skin.id)}
        disabled={!unlocked}
        aria-pressed={equipped}
        className={`flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition ${
          equipped
            ? 'bg-[#241F1A]/6 ring-1 ring-[rgba(36,31,26,0.22)]'
            : unlocked
              ? 'hover:bg-[rgba(36,31,26,0.04)]'
              : 'cursor-not-allowed opacity-60'
        }`}
      >
        <span
          className="h-9 w-9 shrink-0 rounded-xl border"
          style={{ backgroundColor: skin.body, borderColor: skin.edge }}
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-sm text-[#241F1A]">{skin.name}</span>
            {equipped && <Check className="h-3.5 w-3.5 shrink-0 text-[#7C8B6F]" />}
            {!unlocked && <Lock className="h-3 w-3 shrink-0 text-[rgba(36,31,26,0.4)]" />}
          </span>
          {unlocked ? (
            <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <Bars label="Lift" value={ratings.lift} />
              <Bars label="Float" value={ratings.float} />
            </span>
          ) : (
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.12em] text-[rgba(36,31,26,0.42)]">
              Unlocks at {skin.unlockScore}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}