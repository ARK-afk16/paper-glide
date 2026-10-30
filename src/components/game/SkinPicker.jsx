import React from 'react';
import SkinRow from '@/components/game/SkinRow';
import { SKINS, isSkinUnlocked } from '@/lib/game/skins';

export default function SkinPicker({ best, selectedId, onSelect }) {
  const unlockedCount = SKINS.filter((s) => isSkinUnlocked(s, best)).length;

  return (
    <section className="rounded-[26px] border border-[rgba(36,31,26,0.12)] bg-[#FBF6EC] p-6 shadow-[0_24px_50px_-34px_rgba(36,31,26,0.45)]">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl text-[#241F1A]">Paper skins</h2>
        <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[rgba(36,31,26,0.4)]">
          {unlockedCount}/{SKINS.length}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-[rgba(36,31,26,0.45)]">
        New folds unlock as your best score climbs — each one flies a little differently.
      </p>
      <ul className="mt-3 space-y-1">
        {SKINS.map((skin) => (
          <SkinRow
            key={skin.id}
            skin={skin}
            unlocked={isSkinUnlocked(skin, best)}
            equipped={skin.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </section>
  );
}