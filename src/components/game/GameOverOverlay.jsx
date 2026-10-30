import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, Loader2 } from 'lucide-react';
import { nameIsBlocked, BLOCKED_NAME_MESSAGE } from '@/lib/game/nameFilter';

export default function GameOverOverlay({ result, onRestart, onSaved }) {
  const [name, setName] = useState(() => localStorage.getItem('paperwing_name') || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const blocked = nameIsBlocked(name);

  const save = async () => {
    if (nameIsBlocked(name)) {
      setError(BLOCKED_NAME_MESSAGE);
      return;
    }
    setSaving(true);
    setError('');
    const player = (name.trim() || 'Anonymous flyer').slice(0, 18);
    localStorage.setItem('paperwing_name', name.trim());
    try {
      await base44.entities.HighScore.create({
        player_name: player,
        score: result.score,
        distance: result.distance,
      });
      setSaved(true);
      onSaved?.();
    } catch (e) {
      setError('Could not save that score. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(246,239,226,0.72)] px-5 backdrop-blur-[3px]">
      <div className="w-full max-w-sm rounded-3xl border border-[rgba(36,31,26,0.12)] bg-[#FBF6EC] p-6 text-center shadow-[0_24px_50px_-24px_rgba(36,31,26,0.45)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[rgba(36,31,26,0.42)]">
          Flight ended
        </p>
        <p className="mt-2 font-display text-5xl leading-none text-[#241F1A]">{result.score}</p>
        <p className="mt-2 text-xs text-[rgba(36,31,26,0.5)]">
          {result.distance} m flown
          {result.isBest && (
            <span className="ml-2 rounded-full bg-[#C0553B]/12 px-2 py-0.5 font-semibold uppercase tracking-[0.12em] text-[#C0553B]">
              New best
            </span>
          )}
        </p>

        {saved ? (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-[rgba(36,31,26,0.1)] bg-white/60 px-4 py-3 text-sm text-[#241F1A]">
            <Check className="h-4 w-4 text-[#7C8B6F]" />
            Score added to the leaderboard
          </div>
        ) : (
          <div className="mt-5">
            <label className="block text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-[rgba(36,31,26,0.42)]">
              Sign your flight
            </label>
            <div className="mt-2 flex gap-2">
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !saving) save();
                }}
                maxLength={18}
                placeholder="Your name"
                className="min-w-0 flex-1 rounded-full border border-[rgba(36,31,26,0.15)] bg-white/70 px-4 py-2.5 text-sm text-[#241F1A] outline-none placeholder:text-[rgba(36,31,26,0.3)] focus:border-[rgba(36,31,26,0.45)]"
              />
              <button
                onClick={save}
                disabled={saving || blocked}
                className="rounded-full bg-[#241F1A] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#FBF6EC] transition hover:bg-[#3A322B] disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </button>
            </div>
            {(blocked || error) && (
              <p className="mt-2 text-left text-xs text-[#C0553B]">
                {blocked ? BLOCKED_NAME_MESSAGE : error}
              </p>
            )}
          </div>
        )}

        <button
          onClick={onRestart}
          className="mt-4 w-full rounded-full border border-[rgba(36,31,26,0.15)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#241F1A] transition hover:bg-[rgba(36,31,26,0.05)]"
        >
          Fly again
        </button>
      </div>
    </div>
  );
}