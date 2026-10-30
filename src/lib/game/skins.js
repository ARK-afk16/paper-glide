// Paper plane skins: each has its own colours and flight attributes.
// lift    → how hard it climbs while holding (multiplies the lift force)
// gravity → how quickly it falls when released (multiplies gravity)

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export const SKINS = [
  {
    id: 'classic',
    name: 'Classic Fold',
    note: 'The original sheet off the desk.',
    unlockScore: 0,
    lift: 1,
    gravity: 1,
    body: '#FBF6EC',
    shade: 'rgba(36,31,26,0.05)',
    edge: 'rgba(36,31,26,0.55)',
    crease: 'rgba(36,31,26,0.26)',
    trail: '36,31,26',
  },
  {
    id: 'sunset',
    name: 'Sunset Dart',
    note: 'Sharp climb, a little nose-heavy.',
    unlockScore: 250,
    lift: 1.14,
    gravity: 1.06,
    body: '#E0795C',
    shade: 'rgba(122,44,24,0.16)',
    edge: 'rgba(122,44,24,0.6)',
    crease: 'rgba(122,44,24,0.32)',
    trail: '192,85,59',
  },
  {
    id: 'mint',
    name: 'Mint Glider',
    note: 'Floats like it weighs nothing.',
    unlockScore: 600,
    lift: 0.92,
    gravity: 0.82,
    body: '#AFC9A9',
    shade: 'rgba(70,96,64,0.16)',
    edge: 'rgba(70,96,64,0.58)',
    crease: 'rgba(70,96,64,0.3)',
    trail: '124,139,111',
  },
  {
    id: 'midnight',
    name: 'Midnight Jet',
    note: 'Dark, quick, greedy with altitude.',
    unlockScore: 1000,
    lift: 1.22,
    gravity: 1.12,
    body: '#2E2A3A',
    shade: 'rgba(255,253,247,0.09)',
    edge: 'rgba(255,253,247,0.6)',
    crease: 'rgba(255,253,247,0.34)',
    trail: '46,42,58',
  },
  {
    id: 'gold',
    name: 'Gold Leaf',
    note: 'Every fold finally pays off.',
    unlockScore: 1600,
    lift: 1.28,
    gravity: 0.92,
    body: '#D8A93E',
    shade: 'rgba(122,80,10,0.18)',
    edge: 'rgba(122,80,10,0.62)',
    crease: 'rgba(122,80,10,0.32)',
    trail: '192,147,52',
  },
  {
    id: 'crane',
    name: 'Paper Crane',
    note: 'Folded by someone with patience.',
    unlockScore: 2500,
    lift: 1.12,
    gravity: 0.86,
    body: '#D96A8A',
    shade: 'rgba(122,36,62,0.16)',
    edge: 'rgba(122,36,62,0.6)',
    crease: 'rgba(122,36,62,0.3)',
    trail: '199,86,122',
  },
];

export function skinById(id) {
  return SKINS.find((s) => s.id === id) || SKINS[0];
}

export function isSkinUnlocked(skin, best) {
  return (best || 0) >= skin.unlockScore;
}

// 1–5 ratings for the badges shown in the picker.
export function skinRatings(skin) {
  return {
    lift: Math.round(clamp((skin.lift - 0.86) / 0.1, 0, 4)) + 1,
    float: Math.round(clamp((1.18 - skin.gravity) / 0.09, 0, 4)) + 1,
  };
}