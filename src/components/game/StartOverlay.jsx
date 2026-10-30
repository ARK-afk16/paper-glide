import React from 'react';

export default function StartOverlay({ onStart }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(246,239,226,0.66)] px-6 text-center backdrop-blur-[3px]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[rgba(36,31,26,0.45)]">
        Endless flight
      </p>
      <h2 className="mt-3 font-display text-3xl leading-tight text-[#241F1A] sm:text-4xl">
        Thread the living room
      </h2>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-[rgba(36,31,26,0.58)]">
        Hold to lift, release to glide. Slip between the shelves, lamps, chairs and plants — the room
        speeds up the longer you stay airborne.
      </p>
      <button
        onClick={onStart}
        className="mt-7 rounded-full bg-[#241F1A] px-9 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#FBF6EC] transition hover:bg-[#3A322B] active:scale-[0.98]"
      >
        Start flying
      </button>
    </div>
  );
}