const PAPER = '#FFFDF7';
const INK = 'rgba(36,31,26,';

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function drawWindow(ctx, x, y, w, h) {
  const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, w * 1.2);
  glow.addColorStop(0, 'rgba(255,248,226,0.85)');
  glow.addColorStop(1, 'rgba(255,248,226,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - w * 0.7, y - h * 0.6, w * 2.4, h * 2.4);

  roundRect(ctx, x, y, w, h, 5);
  ctx.fillStyle = 'rgba(255,252,242,0.9)';
  ctx.fill();
  ctx.strokeStyle = INK + '0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = INK + '0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.moveTo(x, y + h / 2);
  ctx.lineTo(x + w, y + h / 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(200,176,144,0.8)';
  ctx.fillRect(x - 8, y + h, w + 16, 7);
}

function drawFrame(ctx, x, y, w, h, variant) {
  roundRect(ctx, x, y, w, h, 2);
  ctx.fillStyle = 'rgba(255,253,247,0.55)';
  ctx.fill();
  ctx.strokeStyle = INK + '0.22)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  if (variant === 0) {
    ctx.arc(x + w * 0.5, y + h * 0.58, w * 0.24, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(192,85,59,0.55)';
  } else if (variant === 1) {
    ctx.moveTo(x + w * 0.26, y + h * 0.7);
    ctx.lineTo(x + w * 0.5, y + h * 0.34);
    ctx.lineTo(x + w * 0.74, y + h * 0.7);
    ctx.strokeStyle = 'rgba(124,139,111,0.7)';
  } else {
    ctx.moveTo(x + w * 0.26, y + h * 0.34);
    ctx.lineTo(x + w * 0.74, y + h * 0.66);
    ctx.moveTo(x + w * 0.74, y + h * 0.34);
    ctx.lineTo(x + w * 0.26, y + h * 0.66);
    ctx.strokeStyle = INK + '0.3)';
  }
  ctx.stroke();
}

export function drawRoom(ctx, w, h, scroll, time) {
  const wall = ctx.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, '#F7EEDE');
  wall.addColorStop(1, '#EADCC3');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, h);

  const step = 104;
  const off = -((scroll * 0.1) % step);
  ctx.strokeStyle = INK + '0.05)';
  ctx.lineWidth = 1;
  for (let x = off; x < w + step; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h * 0.86);
    ctx.stroke();
  }

  ctx.strokeStyle = INK + '0.08)';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.54);
  ctx.lineTo(w, h * 0.54);
  ctx.stroke();

  const winGap = 540;
  const winOff = -((scroll * 0.2) % winGap);
  for (let x = winOff - winGap; x < w + winGap; x += winGap) {
    drawWindow(ctx, x + 90, h * 0.13, 150, 142);
  }

  const frameGap = 360;
  const frameOff = -((scroll * 0.42) % frameGap);
  let idx = 0;
  for (let x = frameOff - frameGap; x < w + frameGap; x += frameGap) {
    drawFrame(ctx, x + 210, h * 0.22, 46, 60, idx % 3);
    idx += 1;
  }

  const floorY = h * 0.86;
  ctx.fillStyle = '#DFCBAE';
  ctx.fillRect(0, floorY, w, h - floorY);
  ctx.strokeStyle = INK + '0.14)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, floorY);
  ctx.lineTo(w, floorY);
  ctx.stroke();

  const boardGap = 88;
  const boardOff = -((scroll * 0.75) % boardGap);
  ctx.strokeStyle = INK + '0.06)';
  ctx.lineWidth = 1;
  for (let x = boardOff; x < w + boardGap; x += boardGap) {
    ctx.beginPath();
    ctx.moveTo(x, floorY);
    ctx.lineTo(x - 46, h);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  for (let i = 0; i < 16; i += 1) {
    const px = ((i * 181 + time * (7 + (i % 5) * 2)) % (w + 80)) - 40;
    const py = h * 0.1 + ((i * 97) % (h * 0.64)) + Math.sin(time * 0.7 + i) * 9;
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.arc(px, py, i % 3 === 0 ? 2.2 : 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawShelf(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, '#C7A077');
  g.addColorStop(0.5, '#DBBC93');
  g.addColorStop(1, '#B78D63');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = INK + '0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);

  const rows = Math.max(1, Math.floor(h / 58));
  const colors = ['#C0553B', '#7C8B6F', '#4F6D7A', '#D9A24A', '#8C6A8F'];

  for (let r = 1; r < rows; r += 1) {
    const yy = y + (h * r) / rows;
    ctx.strokeStyle = INK + '0.32)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 4, yy);
    ctx.lineTo(x + w - 4, yy);
    ctx.stroke();
  }

  for (let r = 0; r < rows; r += 1) {
    const yTop = y + (h * r) / rows + 9;
    const yBot = y + (h * (r + 1)) / rows - 5;
    let bx = x + 9;
    let i = 0;
    while (bx < x + w - 13 && i < 6) {
      const bw = 7 + ((i * 5 + r * 3) % 6);
      const bh = Math.max(7, (yBot - yTop) * (0.55 + ((i + r) % 4) * 0.1));
      ctx.fillStyle = colors[(i + r * 2) % colors.length];
      ctx.globalAlpha = 0.9;
      ctx.fillRect(bx, yBot - bh, bw, bh);
      ctx.globalAlpha = 1;
      bx += bw + 3;
      i += 1;
    }
  }
}

function drawCrates(ctx, x, y, w, h) {
  const rows = Math.max(1, Math.round(h / 60));
  const rh = h / rows;
  for (let r = 0; r < rows; r += 1) {
    const ry = y + r * rh;
    ctx.fillStyle = r % 2 ? '#C7A17A' : '#D5B38D';
    ctx.fillRect(x, ry, w, rh - 3);
    ctx.strokeStyle = INK + '0.48)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, ry + 1, w - 2, rh - 6);
    ctx.strokeStyle = INK + '0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 7, ry + 7);
    ctx.lineTo(x + w - 7, ry + rh - 10);
    ctx.moveTo(x + w - 7, ry + 7);
    ctx.lineTo(x + 7, ry + rh - 10);
    ctx.stroke();
  }
}

function drawPlant(ctx, x, y, w, h) {
  const potH = Math.min(52, Math.max(26, h * 0.22));
  const potW = Math.min(w * 0.8, 58);
  const potX = x + (w - potW) / 2;
  const potY = y + h - potH;

  ctx.strokeStyle = '#5E7052';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, potY);
  ctx.lineTo(x + w / 2, y + 8);
  ctx.stroke();

  const leaves = Math.max(3, Math.floor(h / 36));
  for (let i = 0; i < leaves; i += 1) {
    const t = i / leaves;
    const ly = y + 10 + t * (potY - y - 16);
    const dir = i % 2 ? 1 : -1;
    ctx.beginPath();
    ctx.ellipse(
      x + w / 2 + dir * (w * 0.19 + (i % 3) * 3),
      ly,
      w * 0.23,
      5 + h * 0.05,
      dir * 0.5,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = i % 2 ? '#7C8B6F' : '#8E9C7F';
    ctx.fill();
    ctx.strokeStyle = INK + '0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(potX, potY);
  ctx.lineTo(potX + potW, potY);
  ctx.lineTo(potX + potW * 0.84, y + h);
  ctx.lineTo(potX + potW * 0.16, y + h);
  ctx.closePath();
  ctx.fillStyle = '#C0553B';
  ctx.fill();
  ctx.strokeStyle = INK + '0.42)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = INK + '0.32)';
  ctx.fillRect(potX - 4, potY - 7, potW + 8, 8);
}

function drawChair(ctx, x, y, w, h) {
  const backH = h * 0.46;

  roundRect(ctx, x + w * 0.14, y, w * 0.72, backH, 7);
  ctx.fillStyle = '#BE9268';
  ctx.fill();
  ctx.strokeStyle = INK + '0.46)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = INK + '0.16)';
  ctx.lineWidth = 3;
  for (let i = 1; i <= 2; i += 1) {
    const sx = x + w * (0.32 + i * 0.2);
    ctx.beginPath();
    ctx.moveTo(sx, y + 10);
    ctx.lineTo(sx, y + backH - 8);
    ctx.stroke();
  }

  const seatY = y + backH + h * 0.05;
  roundRect(ctx, x + w * 0.05, seatY, w * 0.9, h * 0.1, 4);
  ctx.fillStyle = '#D5B38D';
  ctx.fill();
  ctx.strokeStyle = INK + '0.42)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = '#8C6A48';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + w * 0.18, seatY + h * 0.1);
  ctx.lineTo(x + w * 0.11, y + h);
  ctx.moveTo(x + w * 0.82, seatY + h * 0.1);
  ctx.lineTo(x + w * 0.89, y + h);
  ctx.stroke();
}

function drawLamp(ctx, x, y, w, h) {
  const shadeH = Math.min(h * 0.42, 74);
  const shadeY = y + h - shadeH;

  ctx.strokeStyle = INK + '0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, shadeY);
  ctx.stroke();

  const glow = ctx.createRadialGradient(x + w / 2, y + h, 4, x + w / 2, y + h, w * 1.5);
  glow.addColorStop(0, 'rgba(255,212,138,0.4)');
  glow.addColorStop(1, 'rgba(255,212,138,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h, w * 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x + w * 0.36, shadeY);
  ctx.lineTo(x + w * 0.64, shadeY);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fillStyle = '#D9A24A';
  ctx.fill();
  ctx.strokeStyle = INK + '0.42)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + w / 2, y + h - 4, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#FFF2CC';
  ctx.fill();
}

function drawFan(ctx, x, y, w, h) {
  const hubX = x + w / 2;
  const hubY = y + h * 0.64;

  ctx.strokeStyle = INK + '0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hubX, y);
  ctx.lineTo(hubX, hubY);
  ctx.stroke();

  for (let i = 0; i < 3; i += 1) {
    const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
    ctx.save();
    ctx.translate(hubX, hubY);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.ellipse(w * 0.2, 0, w * 0.22, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#CBB89C';
    ctx.fill();
    ctx.strokeStyle = INK + '0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(hubX, hubY, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#8C6A48';
  ctx.fill();
  ctx.strokeStyle = INK + '0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawHangingPlant(ctx, x, y, w, h) {
  const potY = y + h * 0.42;
  const potH = Math.min(42, h * 0.26);

  ctx.strokeStyle = INK + '0.38)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + w * 0.2, y);
  ctx.lineTo(x + w * 0.34, potY);
  ctx.moveTo(x + w * 0.8, y);
  ctx.lineTo(x + w * 0.66, potY);
  ctx.stroke();

  roundRect(ctx, x + w * 0.22, potY, w * 0.56, potH, 6);
  ctx.fillStyle = '#C0553B';
  ctx.fill();
  ctx.strokeStyle = INK + '0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = '#5E7052';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    const sx = x + w * (0.32 + i * 0.12);
    ctx.beginPath();
    ctx.moveTo(sx, potY + potH);
    ctx.quadraticCurveTo(sx + (i % 2 ? 8 : -8), potY + potH + h * 0.2, sx + (i % 2 ? -4 : 4), y + h);
    ctx.stroke();
  }
  for (let i = 0; i < 5; i += 1) {
    const t = (i + 1) / 6;
    const ly = potY + potH + (y + h - potY - potH) * t;
    ctx.beginPath();
    ctx.ellipse(x + w * (0.3 + (i % 3) * 0.2), ly, w * 0.13, 6, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 ? '#7C8B6F' : '#8E9C7F';
    ctx.fill();
  }
}

function drawPiece(ctx, type, x, y, w, h) {
  if (type === 'shelf' || type === 'shelfTop') drawShelf(ctx, x, y, w, h);
  else if (type === 'crates') drawCrates(ctx, x, y, w, h);
  else if (type === 'plant') drawPlant(ctx, x, y, w, h);
  else if (type === 'chair') drawChair(ctx, x, y, w, h);
  else if (type === 'lamp') drawLamp(ctx, x, y, w, h);
  else if (type === 'fan') drawFan(ctx, x, y, w, h);
  else if (type === 'hangingPlant') drawHangingPlant(ctx, x, y, w, h);
}

export function drawObstacle(ctx, o, h) {
  const topH = o.gapTop;
  const botY = o.gapTop + o.gapH;
  const botH = h - botY;

  if (topH > 4) drawPiece(ctx, o.topType, o.x, 0, o.w, topH);
  if (botH > 4) drawPiece(ctx, o.bottomType, o.x, botY, o.w, botH);

  ctx.strokeStyle = INK + '0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(o.x - 5, o.gapTop);
  ctx.lineTo(o.x + o.w + 5, o.gapTop);
  if (botH > 4) {
    ctx.moveTo(o.x - 5, botY);
    ctx.lineTo(o.x + o.w + 5, botY);
  }
  ctx.stroke();
}

export function drawPlane(ctx, x, y, rot, skin) {
  const body = skin?.body || PAPER;
  const shade = skin?.shade || INK + '0.05)';
  const edge = skin?.edge || INK + '0.55)';
  const crease = skin?.crease || INK + '0.26)';

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  ctx.beginPath();
  ctx.moveTo(19, 0);
  ctx.lineTo(-15, -11);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-15, 11);
  ctx.closePath();
  ctx.fillStyle = body;
  ctx.fill();
  ctx.strokeStyle = edge;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(19, 0);
  ctx.lineTo(-15, -11);
  ctx.lineTo(-4, 0);
  ctx.closePath();
  ctx.fillStyle = shade;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(19, 0);
  ctx.lineTo(-4, 0);
  ctx.strokeStyle = crease;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
}

export function drawTrail(ctx, trail, skin) {
  const color = skin?.trail || '36,31,26';
  for (let i = 0; i < trail.length; i += 1) {
    const t = trail[i];
    const p = i / Math.max(1, trail.length);
    ctx.beginPath();
    ctx.arc(t.x, t.y, 1 + p * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color}, ${(0.04 + p * 0.16).toFixed(3)})`;
    ctx.fill();
  }
}

export function drawHud(ctx, score) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = INK + '0.42)';
  ctx.font = '600 10px Inter, ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('SCORE', 22, 30);

  ctx.fillStyle = '#241F1A';
  ctx.font = '600 30px Fraunces, Georgia, serif';
  ctx.fillText(String(score), 20, 63);
  ctx.restore();
}

export function drawFinish(ctx, x, h) {
  const s = 15;
  const bandW = s * 2;

  const glow = ctx.createLinearGradient(x - 46, 0, x + bandW + 46, 0);
  glow.addColorStop(0, 'rgba(255,252,240,0)');
  glow.addColorStop(0.5, 'rgba(255,252,240,0.55)');
  glow.addColorStop(1, 'rgba(255,252,240,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - 46, 0, bandW + 92, h);

  for (let y = 0; y < h; y += s) {
    for (let c = 0; c < 2; c += 1) {
      const on = ((y / s) + c) % 2 === 0;
      ctx.fillStyle = on ? 'rgba(36,31,26,0.88)' : 'rgba(255,253,247,0.95)';
      ctx.fillRect(x + c * s, y, s, s);
    }
  }

  const py = h * 0.13;
  ctx.fillStyle = '#C0553B';
  ctx.beginPath();
  ctx.moveTo(x + bandW, py);
  ctx.lineTo(x + bandW + 46, py + 10);
  ctx.lineTo(x + bandW, py + 20);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFDF7';
  ctx.font = '600 9px Inter, ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('FINISH', x + bandW + 7, py + 13);
}

export function drawLevelHud(ctx, w, name, progress) {
  ctx.save();
  ctx.textAlign = 'right';
  ctx.fillStyle = INK + '0.42)';
  ctx.font = '600 10px Inter, ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(String(name || '').toUpperCase(), w - 22, 30);

  const bw = 132;
  const bx = w - 22 - bw;
  ctx.fillStyle = INK + '0.1)';
  ctx.fillRect(bx, 40, bw, 4);
  ctx.fillStyle = '#C0553B';
  ctx.fillRect(bx, 40, bw * Math.max(0, Math.min(1, progress)), 4);
  ctx.restore();
}