import React from 'react';

export default function LevelResultOverlay({
  complete,
  level,
  result,
  hasNext,
  onRetry,
  onNext,
  onMap,
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(246,239,226,0.72)] px-5 backdrop-blur-[3px]">
      <div className="w-full max-w-sm rounded-3xl border border-[rgba(36,31,26,0.12)] bg-[#FBF6EC] p-6 text-center shadow-[0_24px_50px_-24px_rgba(36,31,26,0.45)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[rgba(36,31,26,0.42)]">
          {complete ? 'Finish line crossed' : 'Flight ended'}
        </p>
        <h2 className="mt-2 font-display text-2xl leading-tight text-[#241F1A]">
          {complete ? `${level.name} cleared` : `${level.name} wins this round`}
        </h2>
        <p className="mt-3 font-display text-4xl leading-none text-[#241F1A]">{result.score}</p>
        <p className="mt-2 text-xs text-[rgba(36,31,26,0.5)]">{result.distance} m flown</p>

        {complete && result.isBest && (
          <p className="mt-3 inline-block rounded-full bg-[#C0553B]/12 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#C0553B]">
            New room best
          </p>
        )}
        {!complete && (
          <p className="mt-3 text-[11px] leading-relaxed text-[rgba(36,31,26,0.45)]">
            The finish line is still ahead — keep the plane off the furniture.
          </p>
        )}

        <div className="mt-5 space-y-2">
          {complete && hasNext && (
            <button
              onClick={onNext}
              className="w-full rounded-full bg-[#241F1A] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF6EC] transition hover:bg-[#3A322B]"
            >
              Next room
            </button>
          )}
          <button
            onClick={onRetry}
            className={`w-full rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              complete && hasNext
                ? 'border border-[rgba(36,31,26,0.15)] text-[#241F1A] hover:bg-[rgba(36,31,26,0.05)]'
                : 'bg-[#241F1A] text-[#FBF6EC] hover:bg-[#3A322B]'
            }`}
          >
            {complete ? 'Fly it again' : 'Try again'}
          </button>
          <button
            onClick={onMap}
            className="w-full rounded-full px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgba(36,31,26,0.45)] transition hover:text-[#241F1A]"
          >
            Back to house map
          </button>
        </div>
      </div>
    </div>
  );
}