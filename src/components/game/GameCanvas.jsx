import React, { useEffect, useRef } from 'react';
import {
  drawRoom,
  drawObstacle,
  drawPlane,
  drawTrail,
  drawHud,
  drawFinish,
  drawLevelHud,
} from '@/lib/game/scene';

const GRAVITY = 980;
const LIFT = 1760;
const MAX_FALL = 660;
const MAX_RISE = -440;

const TOP_TYPES = ['lamp', 'fan', 'hangingPlant', 'shelfTop'];
const BOTTOM_TYPES = ['shelf', 'crates', 'plant', 'chair'];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function makeObstacle(w, h, elapsed, startX) {
  const gapH = Math.max(152, 244 - elapsed * 2.6);
  const margin = 54;
  const span = Math.max(12, h - gapH - margin * 2);
  return {
    x: startX,
    w: 76,
    gapTop: margin + Math.random() * span,
    gapH,
    topType: pick(TOP_TYPES),
    bottomType: pick(BOTTOM_TYPES),
  };
}

function levelObstacles(level, h) {
  return level.pieces.map((piece, i) => {
    const gapH = h * piece.size;
    const gapTop = Math.max(40, Math.min(h - gapH - 40, h * piece.gap - gapH / 2));
    return {
      worldX: piece.at,
      x: 0,
      w: 76,
      gapTop,
      gapH,
      topType: TOP_TYPES[i % TOP_TYPES.length],
      bottomType: BOTTOM_TYPES[(i + 1) % BOTTOM_TYPES.length],
    };
  });
}

export default function GameCanvas({
  mode,
  level,
  skin,
  startSignal,
  idleSignal,
  onGameOver,
  onLevelComplete,
  onStartRequest,
}) {
  const canvasRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef(1);
  const overRef = useRef(onGameOver);
  const completeRef = useRef(onLevelComplete);
  const startRef = useRef(onStartRequest);
  const optsRef = useRef({ mode, level });
  const skinRef = useRef(skin);
  const gameRef = useRef({
    phase: 'idle',
    mode: 'free',
    levelName: '',
    baseSpeed: 215,
    finishWorld: 0,
    pressing: false,
    time: 0,
    elapsed: 0,
    distance: 0,
    score: 0,
    spawnIn: 0,
    deadAt: -10,
    plane: { x: 0, y: 0, vy: 0, rot: 0 },
    obstacles: [],
    trail: [],
  });

  overRef.current = onGameOver;
  completeRef.current = onLevelComplete;
  startRef.current = onStartRequest;
  optsRef.current = { mode, level };
  skinRef.current = skin;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      sizeRef.current = { w: rect.width, h: rect.height };
      const g = gameRef.current;
      if (g.phase === 'idle') {
        g.plane.x = rect.width * 0.28;
        g.plane.y = rect.height * 0.46;
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const die = (g) => {
      if (g.phase !== 'playing') return;
      g.phase = 'dead';
      g.deadAt = g.time;
      overRef.current?.(g.score, Math.round(g.distance / 10));
    };

    const finish = (g) => {
      if (g.phase !== 'playing') return;
      g.phase = 'done';
      g.deadAt = g.time;
      g.pressing = false;
      completeRef.current?.(g.score, Math.round(g.distance / 10));
    };

    const step = (g, dt, w, h) => {
      g.elapsed += dt;
      const speed =
        g.mode === 'levels'
          ? g.baseSpeed + Math.min(70, g.elapsed * 8)
          : 215 + Math.min(250, g.elapsed * 17);
      g.distance += speed * dt;
      g.score = Math.floor(g.distance / 9);

      const p = g.plane;
      p.x = w * 0.28;
      const equipped = skinRef.current;
      const lift = equipped?.lift || 1;
      const gravity = equipped?.gravity || 1;
      const accel = g.pressing ? -LIFT * lift : GRAVITY * gravity;
      p.vy = Math.max(MAX_RISE * lift, Math.min(MAX_FALL * gravity, p.vy + accel * dt));
      p.y += p.vy * dt;

      if (p.y < 16) {
        p.y = 16;
        p.vy = Math.max(p.vy, 60);
      }
      if (p.y > h - 12) {
        p.y = h - 12;
        die(g);
        return;
      }
      p.rot = Math.max(-0.34, Math.min(0.5, p.vy / 900));

      g.trail.push({ x: p.x, y: p.y });
      if (g.trail.length > 16) g.trail.shift();

      if (g.mode === 'free') {
        g.spawnIn -= speed * dt;
        if (g.spawnIn <= 0) {
          g.obstacles.push(makeObstacle(w, h, g.elapsed, w + 70));
          g.spawnIn = speed * (1.6 + Math.random() * 0.5);
        }
        for (let i = 0; i < g.obstacles.length; i += 1) {
          g.obstacles[i].x -= speed * dt;
        }
        g.obstacles = g.obstacles.filter((o) => o.x + o.w > -30);
      } else {
        for (let i = 0; i < g.obstacles.length; i += 1) {
          g.obstacles[i].x = w * 0.28 + (g.obstacles[i].worldX - g.distance);
        }
      }

      const r = 11;
      const hit = g.obstacles.some(
        (o) =>
          o.x < w + 40 &&
          o.x + o.w > -40 &&
          p.x + r > o.x &&
          p.x - r < o.x + o.w &&
          (p.y - r < o.gapTop || p.y + r > o.gapTop + o.gapH)
      );
      if (hit) {
        die(g);
        return;
      }

      if (g.mode === 'levels' && g.distance >= g.finishWorld) finish(g);
    };

    const crash = (g, dt, h) => {
      const p = g.plane;
      p.vy = Math.min(p.vy + 1500 * dt, 900);
      p.y += p.vy * dt;
      p.rot = Math.min(1.5, p.rot + dt * 2.2);
      if (p.y > h - 14) {
        p.y = h - 14;
        p.vy = 0;
      }
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.034, (now - last) / 1000);
      last = now;
      const { w, h } = sizeRef.current;
      if (!w || !h) return;
      const g = gameRef.current;
      g.time += dt;

      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

      if (g.phase === 'playing') {
        step(g, dt, w, h);
      } else if (g.phase === 'dead') {
        crash(g, dt, h);
      } else if (g.phase === 'done') {
        g.plane.rot *= 0.94;
      } else {
        g.plane.x = w * 0.28;
        g.plane.y = h * 0.46 + Math.sin(g.time * 1.5) * 9;
        g.plane.rot = Math.sin(g.time * 1.5) * 0.1 - 0.02;
      }

      drawRoom(ctx, w, h, g.distance, g.time);
      for (let i = 0; i < g.obstacles.length; i += 1) {
        drawObstacle(ctx, g.obstacles[i], h);
      }
      if (g.mode === 'levels' && g.finishWorld > 0) {
        const fx = w * 0.28 + (g.finishWorld - g.distance);
        if (fx < w + 60 && fx > -60) drawFinish(ctx, fx, h);
      }
      if (g.phase !== 'idle') drawTrail(ctx, g.trail, skinRef.current);
      drawPlane(ctx, g.plane.x, g.plane.y, g.plane.rot, skinRef.current);
      if (g.phase !== 'idle') {
        drawHud(ctx, g.score);
        if (g.mode === 'levels' && g.finishWorld > 0) {
          drawLevelHud(ctx, w, g.levelName, g.distance / g.finishWorld);
        }
      }
    };

    raf = requestAnimationFrame(frame);

    const press = () => {
      const g = gameRef.current;
      if (g.phase === 'playing') {
        g.pressing = true;
        return;
      }
      if (g.phase === 'idle') {
        g.pressing = true;
        startRef.current?.();
        return;
      }
      if (g.phase === 'dead' && g.time - g.deadAt > 1) {
        g.pressing = true;
        startRef.current?.();
      }
    };

    const release = () => {
      gameRef.current.pressing = false;
    };

    const onKeyDown = (e) => {
      if (e.code !== 'Space' && e.code !== 'ArrowUp' && e.code !== 'KeyW') return;
      e.preventDefault();
      if (e.repeat) return;
      press();
    };

    const onKeyUp = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') release();
    };

    const onPointerDown = (e) => {
      if (gameRef.current.phase !== 'playing') return;
      e.preventDefault();
      press();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    canvas.addEventListener('pointerdown', onPointerDown);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', release);
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  useEffect(() => {
    if (!startSignal) return;
    const { w, h } = sizeRef.current;
    if (!w || !h) return;
    const g = gameRef.current;
    const opts = optsRef.current;
    g.phase = 'playing';
    g.elapsed = 0;
    g.distance = 0;
    g.score = 0;
    g.deadAt = -10;
    g.trail = [];
    g.plane = { x: w * 0.28, y: h * 0.38, vy: -300, rot: -0.2 };
    g.pressing = false;

    if (opts.mode === 'levels' && opts.level) {
      g.mode = 'levels';
      g.levelName = opts.level.name;
      g.baseSpeed = opts.level.speed;
      g.finishWorld = opts.level.length;
      g.obstacles = levelObstacles(opts.level, h);
    } else {
      g.mode = 'free';
      g.levelName = '';
      g.baseSpeed = 215;
      g.finishWorld = 0;
      g.obstacles = [makeObstacle(w, h, 0, w * 0.88)];
      g.spawnIn = 460;
    }
  }, [startSignal]);

  useEffect(() => {
    if (!idleSignal) return;
    const g = gameRef.current;
    g.phase = 'idle';
    g.obstacles = [];
    g.trail = [];
    g.distance = 0;
    g.score = 0;
    g.finishWorld = 0;
    g.levelName = '';
  }, [idleSignal]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Paper airplane game"
      className="block h-full w-full touch-none select-none"
    />
  );
}