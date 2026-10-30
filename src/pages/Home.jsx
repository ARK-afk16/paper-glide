import React, { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { LEVELS } from '@/lib/game/levels';
import GameCanvas from '@/components/game/GameCanvas';
import StartOverlay from '@/components/game/StartOverlay';
import GameOverOverlay from '@/components/game/GameOverOverlay';
import LevelSelect from '@/components/game/LevelSelect';
import LevelResultOverlay from '@/components/game/LevelResultOverlay';
import Leaderboard from '@/components/game/Leaderboard';
import ModeSwitch from '@/components/game/ModeSwitch';
import SkinPicker from '@/components/game/SkinPicker';
import { SKINS, skinById, isSkinUnlocked } from '@/lib/game/skins';

const BEST_KEY = 'paperwing_best';
const SKIN_KEY = 'paperwing_skin';
const LEVELS_KEY = 'paperwing_levels';
const LEVEL_BEST_KEY = 'paperwing_level_best';

function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [mode, setMode] = useState('free');
  const [status, setStatus] = useState('idle');
  const [startSignal, setStartSignal] = useState(0);
  const [idleSignal, setIdleSignal] = useState(0);
  const [result, setResult] = useState(null);
  const [levelId, setLevelId] = useState(null);
  const [levelResult, setLevelResult] = useState(null);
  const [completed, setCompleted] = useState(() => readStored(LEVELS_KEY, []));
  const [bests, setBests] = useState(() => readStored(LEVEL_BEST_KEY, {}));
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY) || 0));
  const [skinId, setSkinId] = useState(() => localStorage.getItem(SKIN_KEY) || SKINS[0].id);

  const storedSkin = skinById(skinId);
  const skin = isSkinUnlocked(storedSkin, best) ? storedSkin : SKINS[0];
  const selectSkin = (id) => {
    setSkinId(id);
    localStorage.setItem(SKIN_KEY, id);
  };

  const activeLevel = LEVELS.find((l) => l.id === levelId) || null;
  const levelIndex = activeLevel ? LEVELS.findIndex((l) => l.id === activeLevel.id) : -1;
  const hasNext = levelIndex >= 0 && levelIndex < LEVELS.length - 1;

  const loadScores = useCallback(async () => {
    const { items } = await base44.entities.HighScore.list({ sort: '-score', limit: 8 });
    setScores(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadScores();
    const unsubscribe = base44.entities.HighScore.subscribe(() => {
      loadScores();
    });
    return unsubscribe;
  }, [loadScores]);

  const startFree = () => {
    setResult(null);
    setMode('free');
    setStatus('playing');
    setStartSignal((s) => s + 1);
  };

  const startLevel = (lv) => {
    if (!lv) return;
    setLevelResult(null);
    setLevelId(lv.id);
    setMode('levels');
    setStatus('playing');
    setStartSignal((s) => s + 1);
  };

  const goIdle = () => {
    setStatus('idle');
    setResult(null);
    setLevelResult(null);
    setIdleSignal((s) => s + 1);
  };

  const changeMode = (next) => {
    if (next === mode) return;
    setMode(next);
    goIdle();
  };

  const handleGameOver = (score, distance) => {
    if (mode === 'levels') {
      setStatus('dead');
      setLevelResult({ score, distance, isBest: false });
      return;
    }
    const isBest = score > best;
    if (isBest) {
      setBest(score);
      localStorage.setItem(BEST_KEY, String(score));
    }
    setStatus('dead');
    setResult({ score, distance, isBest });
  };

  const handleLevelComplete = (score, distance) => {
    const isBest = score > (bests[levelId] || 0);
    setStatus('complete');
    setLevelResult({ score, distance, isBest });
    setCompleted((prev) => {
      if (prev.includes(levelId)) return prev;
      const next = [...prev, levelId];
      localStorage.setItem(LEVELS_KEY, JSON.stringify(next));
      return next;
    });
    if (isBest) {
      setBests((prev) => {
        const next = { ...prev, [levelId]: score };
        localStorage.setItem(LEVEL_BEST_KEY, JSON.stringify(next));
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6EFE2] text-[#241F1A]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[rgba(36,31,26,0.42)]">
              A paper flight game
            </p>
            <h1 className="mt-2 font-display text-[2.6rem] leading-none tracking-tight sm:text-5xl">
              Paper Wing
            </h1>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <ModeSwitch mode={mode} onChange={changeMode} disabled={status === 'playing'} />
            <p className="max-w-[19rem] text-sm leading-relaxed text-[rgba(36,31,26,0.55)]">
              {mode === 'free'
                ? 'One folded sheet, one very cluttered apartment. Fly as far as the room allows.'
                : 'Four rooms, four courses. Reach each finish line without clipping the furniture.'}
            </p>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="overflow-hidden rounded-[26px] border border-[rgba(36,31,26,0.12)] bg-[#FBF6EC] shadow-[0_30px_60px_-38px_rgba(36,31,26,0.6)]">
            <div className="relative h-[58vh] min-h-[420px] w-full sm:h-[520px]">
              <GameCanvas
                mode={mode}
                level={activeLevel}
                skin={skin}
                startSignal={startSignal}
                idleSignal={idleSignal}
                onGameOver={handleGameOver}
                onLevelComplete={handleLevelComplete}
                onStartRequest={mode === 'levels' ? () => startLevel(activeLevel || LEVELS[0]) : startFree}
              />

              {status === 'idle' && mode === 'free' && <StartOverlay onStart={startFree} />}
              {status === 'idle' && mode === 'levels' && (
                <LevelSelect
                  levels={LEVELS}
                  completed={completed}
                  bests={bests}
                  onPlay={startLevel}
                />
              )}
              {status === 'dead' && mode === 'free' && result && (
                <GameOverOverlay result={result} onRestart={startFree} onSaved={loadScores} />
              )}
              {(status === 'dead' || status === 'complete') && mode === 'levels' && levelResult && activeLevel && (
                <LevelResultOverlay
                  complete={status === 'complete'}
                  level={activeLevel}
                  result={levelResult}
                  hasNext={hasNext}
                  onRetry={() => startLevel(activeLevel)}
                  onNext={() => startLevel(LEVELS[levelIndex + 1])}
                  onMap={goIdle}
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[rgba(36,31,26,0.1)] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[rgba(36,31,26,0.4)]">
              <span>{mode === 'free' ? 'Free ride' : 'House map'}</span>
              <span className="hidden sm:inline">Hold to lift · release to glide</span>
            </div>
          </section>

          <div className="flex flex-col gap-5">
            <Leaderboard scores={scores} best={best} loading={loading} />
            <SkinPicker best={best} selectedId={skin.id} onSelect={selectSkin} />
          </div>
        </div>
      </div>
    </div>
  );
}