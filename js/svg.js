/* AEA Coach – tiny SVG drawing helpers used by diagrams.js */
(function () {
  'use strict';
  const A = window.AEA, U = A.u;
  const D = (A.svg = {});

  D.svg = (w, h, inner, label) => `<svg class="dg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${U.esc(label || '')}">${inner}</svg>`;
  D.lines = (txt) => (txt == null || txt === '' ? [] : String(txt).split('\n'));

  // free text, multi-line. o: {fs, a (start|middle|end), cls, bold, ital, lh}
  D.text = (x, y, txt, o = {}) => {
    const fs = o.fs || 11, lh = o.lh || fs * 1.22, a = o.a || 'start';
    const cls = [o.cls || '', o.bold ? 'bold' : '', o.ital ? 'ital' : ''].join(' ').trim();
    return D.lines(txt).map((l, i) => `<text x="${x}" y="${(y + i * lh).toFixed(1)}" font-size="${fs}" text-anchor="${a}"${cls ? ` class="${cls}"` : ''}>${U.esc(l)}</text>`).join('');
  };

  // rectangle with (multi-line) text. o: {c, r, fs, bold, boldFirst, k, dash, ta:'start', top, pad, op}
  D.box = (x, y, w, h, txt, o = {}) => {
    const c = o.c || 'n', fs = o.fs || 11, lh = fs * 1.22, pad = o.pad || 7;
    const lines = D.lines(txt);
    const left = o.ta === 'start';
    const tx = left ? x + pad : x + w / 2;
    const ty = o.top ? y + pad + fs * 0.8 : y + h / 2 - ((lines.length - 1) * lh) / 2 + fs * 0.36;
    let s = `<g${o.k ? ` class="hot" data-k="${o.k}"` : ''}>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r == null ? 7 : o.r}" class="b-${c}${o.dash ? ' dash' : ''}"${o.op ? ` opacity="${o.op}"` : ''}/>`;
    lines.forEach((l, i) => {
      const b = o.bold || (o.boldFirst && i === 0);
      s += `<text x="${tx}" y="${(ty + i * lh).toFixed(1)}" font-size="${fs}" text-anchor="${left ? 'start' : 'middle'}" class="t-${c}${b ? ' bold' : ''}">${U.esc(l)}</text>`;
    });
    return s + '</g>';
  };

  // ellipse/circle with text
  D.ell = (cx, cy, rx, ry, txt, o = {}) => {
    const c = o.c || 'n', fs = o.fs || 11, lh = fs * 1.22, lines = D.lines(txt);
    const ty = cy - ((lines.length - 1) * lh) / 2 + fs * 0.36;
    let s = `<g${o.k ? ` class="hot" data-k="${o.k}"` : ''}><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="b-${c}${o.dash ? ' dash' : ''}"/>`;
    lines.forEach((l, i) => { s += `<text x="${cx}" y="${(ty + i * lh).toFixed(1)}" font-size="${fs}" text-anchor="middle" class="t-${c}${o.bold || (o.boldFirst && i === 0) ? ' bold' : ''}">${U.esc(l)}</text>`; });
    return s + '</g>';
  };

  const mk = (c) => (c === 'a' || c === 'g' || c === 'r' ? `url(#ah-${c})` : 'url(#ah)');
  // arrow. o: {c: a|g|r, dash, both}
  D.arrow = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ar${o.c ? ' ar-' + o.c : ''}${o.dash ? ' dash' : ''}" marker-end="${mk(o.c)}"${o.both ? ` marker-start="${mk(o.c)}"` : ''}/>`;
  // path, optionally with arrow head
  D.path = (d, o = {}) => `<path d="${d}" class="${o.cls || 'ar' + (o.c ? ' ar-' + o.c : '')}${o.dash ? ' dash' : ''}"${o.arrow ? ` marker-end="${mk(o.c)}"` : ''}${o.both ? ` marker-start="${mk(o.c)}"` : ''}/>`;
  D.line = (x1, y1, x2, y2, cls = 'ln') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
  D.rect = (x, y, w, h, cls, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r == null ? 4 : o.r}" class="${cls}"${o.op ? ` opacity="${o.op}"` : ''}/>`;

  // build a path from a function on [x0,x1] mapped into a box
  D.curve = (fn, x0, x1, box, n = 60, close = false) => {
    let ys = [];
    for (let i = 0; i <= n; i++) ys.push(fn(x0 + ((x1 - x0) * i) / n));
    const ymax = Math.max(...ys) || 1;
    let d = '';
    ys.forEach((y, i) => {
      const px = box.x + (box.w * i) / n, py = box.y + box.h - (y / ymax) * box.h;
      d += (i ? 'L' : 'M') + px.toFixed(1) + ',' + py.toFixed(1) + ' ';
    });
    if (close) d += `L${box.x + box.w},${box.y + box.h} L${box.x},${box.y + box.h} Z`;
    return d;
  };
})();
