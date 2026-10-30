// Player-name moderation for the leaderboard.
// Names are normalised (leet-speak, spacing, padding repeats) before matching so
// simple evasions like "f u c k", "sh1t" or "fuuuuck" are still caught.

const SAFE_FRAGMENTS = [
  'raccoon',
  'cocoon',
  'spices',
  'spicy',
  'suspicious',
  'auspicious',
  'conspicuous',
  'pakistan',
  'vandyke',
  'peacock',
  'cocktail',
  'cockpit',
  'hancock',
  'shuttlecock',
];

// Matched anywhere inside the normalised name.
const BLOCKED_FRAGMENTS = [
  'fuck',
  'shit',
  'cunt',
  'bitch',
  'bastard',
  'dick',
  'pussy',
  'whore',
  'slut',
  'twat',
  'wank',
  'douche',
  'prick',
  'asshole',
  'arsehole',
  'bollock',
  'blowjob',
  'handjob',
  'jizz',
  'dildo',
  // racial and homophobic slurs
  'nigg',
  'niglet',
  'faggot',
  'fag',
  'dyke',
  'tranny',
  'retard',
  'spic',
  'spick',
  'chink',
  'kike',
  'wetback',
  'beaner',
  'coon',
  'gook',
  'paki',
  'raghead',
  'towelhead',
  'jigaboo',
  'darkie',
  'redskin',
];

// Only matched as a whole word, so "classic" or "cassette" stay usable.
const BLOCKED_WORDS = [
  'ass',
  'arse',
  'asses',
  'jackass',
  'dumbass',
  'damn',
  'hell',
  'crap',
  'piss',
  'tit',
  'tits',
  'boob',
  'boobs',
  'penis',
  'vagina',
  'anus',
  'cum',
  'suck',
  'sucks',
  'horny',
  'nga',
  'ngga',
  'nggas',
];

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/3/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/0/g, 'o')
    .replace(/[5$]/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/[^a-z]/g, '')
    .replace(/(.)\1{2,}/g, '$1');
}

function withoutSafeWords(value) {
  return SAFE_FRAGMENTS.reduce((acc, word) => acc.split(word).join(''), value);
}

export function nameIsBlocked(value) {
  const whole = normalize(value);
  if (!whole) return false;

  const body = withoutSafeWords(whole);
  if (BLOCKED_FRAGMENTS.some((fragment) => body.includes(fragment))) return true;

  const words = new Set([
    whole,
    ...String(value)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .map(normalize)
      .filter(Boolean),
  ]);
  return BLOCKED_WORDS.some((word) => words.has(word));
}

export const BLOCKED_NAME_MESSAGE =
  'That name is not allowed on the leaderboard. Swears and slurs do not fly here.';