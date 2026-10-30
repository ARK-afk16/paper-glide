import React from 'react';

const MODES = [
  { id: 'free', label: 'Free ride' },
  { id: 'levels', label: 'House map' },
];

export default function ModeSwitch({ mode, onChange, disabled }) {
  return (
    <div className="inline-flex rounded-full border border-[rgba(36,31,26,0.12)] bg-[#FBF6EC] p-1">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          disabled={disabled}
          className={`rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
            mode === m.id
              ? 'bg-[#241F1A] text-[#FBF6EC]'
              : 'text-[rgba(36,31,26,0.5)] hover:text-[#241F1A]'
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}