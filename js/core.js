/* AEA Coach – core: namespace, helpers, storage, spaced repetition, small charts */
(function () {
  'use strict';
  const A = (window.AEA = window.AEA || {});
  A.topics = [];
  A.iso = [];
  A.cases = [];
  A.diagrams = {};
  A.calcs = {};

  window.addEventListener('error', (e) => {
    const box = document.getElementById('err');
    if (!box) return;
    box.textContent = 'Error: ' + (e.message || e) + (e.filename ? '\n' + e.filename.split('/').pop() + ':' + e.lineno : '');
    box.classList.remove('hidden');
  });

  // ---------- helpers ----------
  const U = (A.u = {});
  U.$ = (sel, el = document) => el.querySelector(sel);
  U.$$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  U.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // light markup for trusted content: **bold**, `code`, newlines
  U.fmt = (s) => (s == null ? '' : String(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/\n/g, '<br>'));
  U.strip = (s) => String(s == null ? '' : s).replace(/<[^>]+>/g, ' ').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  U.hash = (str) => { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
  U.shuffle = (arr, rnd = Math.random) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  U.seeded = (seed) => { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s % 1000000) / 1000000; }; };
  U.today = (d = new Date()) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); };
  U.addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return U.today(d); };
  U.daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
  U.weekday = (iso) => new Date(iso + 'T12:00:00').getDay(); // 0 = Sunday
  U.dateLabel = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  U.dateShort = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  U.num = (x, d = 2) => {
    if (x == null || !isFinite(x)) return '–';
    const v = Math.abs(x) >= 1000 ? Number(x.toFixed(Math.min(d, 1))) : Number(x.toFixed(d));
    return v.toLocaleString('en-GB', { maximumFractionDigits: d });
  };
  U.sig = (x, n = 3) => (x == null || !isFinite(x) ? '–' : Number(x.toPrecision(n)).toLocaleString('en-GB', { maximumFractionDigits: 10 }));
  U.pct = (x, d = 0) => (x == null || !isFinite(x) ? '–' : (x * 100).toFixed(d) + ' %');
  U.clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  U.pick = (arr, rnd = Math.random) => arr[Math.floor(rnd() * arr.length)];
  U.toast = (msg, ms = 1800) => {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(U._tt);
    U._tt = setTimeout(() => t.classList.remove('on'), ms);
  };
  // standard normal sample (Box-Muller)
  U.randn = (rnd = Math.random) => { let u = 0, v = 0; while (u === 0) u = rnd(); while (v === 0) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  U.quantile = (sorted, p) => { if (!sorted.length) return NaN; const i = (sorted.length - 1) * p; const lo = Math.floor(i), hi = Math.ceil(i); return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo); };

  // ---------- item constructors (used by data files) ----------
  A.mk = {
    card: (f, b, o) => Object.assign({ t: 'card', f, b }, o),
    mc: (q, o, a, e, x) => Object.assign({ t: 'mc', q, o, a, e }, x),
    tf: (q, a, e, x) => Object.assign({ t: 'mc', q, o: ['True', 'False'], a: a ? 0 : 1, e, tf: true }, x),
    ord: (q, items, e, x) => Object.assign({ t: 'order', q, items, e }, x),
    match: (q, pairs, e, x) => Object.assign({ t: 'match', q, pairs, e }, x),
    sort: (q, cats, items, e, x) => Object.assign({ t: 'sort', q, cats, items, e }, x),
    calc: (q, ans, unit, steps, x) => Object.assign({ t: 'calc', q, ans, unit, steps, tol: 0.02 }, x),
    oral: (q, k, x) => Object.assign({ t: 'oral', q, k }, x),
    fu: (q, o, a, e, model, x) => Object.assign({ t: 'fu', q, o, a, e, model }, x),
  };
  A.TYPES = {
    card: { label: 'Flashcard', icon: '🃏' },
    mc: { label: 'Quiz', icon: '❓' },
    order: { label: 'Ordering', icon: '🪜' },
    match: { label: 'Matching', icon: '🔗' },
    sort: { label: 'Sorting', icon: '🗂️' },
    calc: { label: 'Calculation', icon: '🧮' },
    oral: { label: 'Oral', icon: '🎙️' },
    fu: { label: 'FU drill', icon: '🎯' },
  };

  A.itemById = {};
  A.topic = function (t) {
    const seen = new Set();
    t.q = (t.q || []).map((it) => {
      it.topic = t.id;
      let id = t.id + ':' + U.hash(it.t + '|' + (it.q || it.f || ''));
      while (seen.has(id)) id += 'x';
      seen.add(id);
      it.id = id;
      A.itemById[id] = it;
      return it;
    });
    A.topics.push(t);
  };
  A.topicById = (id) => A.topics.find((t) => t.id === id);
  A.allItems = () => A.topics.reduce((acc, t) => acc.concat(t.q), []);

  // ---------- storage ----------
  const KEY = 'aea-coach-v1';
  const DEF = () => ({ v: 1, examDate: '2027-01-28', items: {}, plan: {}, log: {}, streak: { n: 0, last: null, best: 0 }, xp: 0, notes: {}, cases: {}, read: {}, theme: 'auto', walk: { pause: 30, rate: 1 } });
  let S = DEF();
  const St = (A.store = {});
  St.load = () => {
    try { S = Object.assign(DEF(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = DEF(); }
    A.S = S;
    return S;
  };
  St.save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full or blocked */ } };
  St.get = () => S;

  // activity, xp & streak
  St.activity = (xp = 1) => {
    const d = U.today();
    S.xp += xp;
    S.log[d] = (S.log[d] || 0) + xp;
    if (S.streak.last !== d) {
      S.streak.n = S.streak.last === U.addDays(d, -1) ? S.streak.n + 1 : 1;
      S.streak.last = d;
      S.streak.best = Math.max(S.streak.best || 0, S.streak.n);
    }
    St.save();
    if (A.app && A.app.updateHeader) A.app.updateHeader();
  };

  // spaced repetition (Leitner boxes 0..5)
  const INTERVAL = [0, 1, 3, 7, 14, 30];
  St.grade = (id, q) => {
    // q: 0 = again, 1 = hard, 2 = good, 3 = easy
    const it = S.items[id] || (S.items[id] = { b: 0, n: 0, c: 0 });
    it.n++;
    it.l = U.today();
    if (q >= 2) { it.c++; it.b = Math.min(5, it.b + (q === 3 ? 2 : 1)); }
    else if (q === 1) { it.b = Math.max(1, it.b); }
    else { it.b = 1; }
    it.d = U.addDays(U.today(), q === 0 ? 0 : q === 1 ? 1 : INTERVAL[it.b]);
    St.activity(q >= 2 ? 2 : 1);
  };
  St.stat = (id) => S.items[id];
  St.isDue = (id) => { const s = S.items[id]; return !!(s && s.d && s.d <= U.today()); };
  St.dueItems = (pool) => (pool || A.allItems()).filter((it) => St.isDue(it.id));
  St.mastery = (items) => {
    if (!items || !items.length) return 0;
    let sum = 0;
    items.forEach((it) => { const s = S.items[it.id]; if (s) sum += Math.min(5, s.b) / 5; });
    return sum / items.length;
  };
  St.seenShare = (items) => (items && items.length ? items.filter((it) => S.items[it.id]).length / items.length : 0);

  // daily plan state
  St.taskDone = (date, key, val) => {
    const p = S.plan[date] || (S.plan[date] = {});
    if (val === undefined) return !!p[key];
    if (val && !p[key]) St.activity(3);
    p[key] = !!val;
    St.save();
    return p[key];
  };

  St.exportJSON = () => {
    const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'aea-coach-backup-' + U.today() + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  St.importJSON = (text) => {
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object' || !data.items) throw new Error('not a valid backup file');
    S = Object.assign(DEF(), data);
    A.S = S;
    St.save();
  };
  St.reset = () => { S = DEF(); A.S = S; St.save(); };

  // ---------- tiny SVG charts ----------
  const C = (A.chart = {});
  // horizontal bars, supports negative values. rows: [{label, value, cls, note}]
  C.bars = (rows, o = {}) => {
    const W = o.w || 360, lw = o.labelW || 110, rh = o.rowH || 24, pad = 6;
    const vals = rows.map((r) => r.value);
    const max = Math.max(0, ...vals), min = Math.min(0, ...vals);
    const span = max - min || 1;
    const x0 = lw + 8, x1 = W - (o.valueW || 64);
    const sx = (v) => x0 + ((v - min) / span) * (x1 - x0);
    const H = rows.length * rh + pad * 2 + (o.axis ? 14 : 0);
    let s = `<svg class="dg" viewBox="0 0 ${W} ${H}" role="img">`;
    const zx = sx(0);
    rows.forEach((r, i) => {
      const y = pad + i * rh;
      const a = sx(Math.min(0, r.value)), b = sx(Math.max(0, r.value));
      s += `<text x="${lw}" y="${y + rh / 2 + 4}" text-anchor="end" font-size="11">${U.esc(r.label)}</text>`;
      s += `<rect x="${a}" y="${y + 4}" width="${Math.max(1, b - a)}" height="${rh - 8}" rx="4" class="fill-${r.cls || (r.value < 0 ? 'r' : 'p')}"/>`;
      s += `<text x="${x1 + 6}" y="${y + rh / 2 + 4}" font-size="11" class="bold">${U.esc(r.note != null ? r.note : U.num(r.value, o.dec ?? 1))}</text>`;
    });
    s += `<line x1="${zx}" y1="${pad - 2}" x2="${zx}" y2="${pad + rows.length * rh + 2}" class="ln"/>`;
    if (o.axis) s += `<text x="${(x0 + x1) / 2}" y="${H - 3}" text-anchor="middle" font-size="10" class="lab">${U.esc(o.axis)}</text>`;
    return s + '</svg>';
  };
  // stacked horizontal bars with positive and negative segments. rows: [{label, parts:[{v, cls, name}]}]
  C.stack = (rows, o = {}) => {
    const W = o.w || 360, lw = o.labelW || 84, rh = o.rowH || 28, pad = 6;
    let max = 0, min = 0;
    rows.forEach((r) => {
      let pos = 0, neg = 0;
      r.parts.forEach((p) => { if (p.v >= 0) pos += p.v; else neg += p.v; });
      max = Math.max(max, pos); min = Math.min(min, neg);
    });
    const span = max - min || 1;
    const x0 = lw + 8, x1 = W - 58;
    const sx = (v) => x0 + ((v - min) / span) * (x1 - x0);
    const legend = [];
    rows.forEach((r) => r.parts.forEach((p) => { if (p.name && !legend.find((l) => l.name === p.name)) legend.push(p); }));
    const lc = legend.some((l) => l.name.length > 14) ? 2 : 3;
    const legRows = Math.ceil(legend.length / lc);
    const H = rows.length * rh + pad * 2 + legRows * 16 + 6;
    let s = `<svg class="dg" viewBox="0 0 ${W} ${H}" role="img">`;
    rows.forEach((r, i) => {
      const y = pad + i * rh;
      let pos = 0, neg = 0, net = 0;
      s += `<text x="${lw}" y="${y + rh / 2 + 4}" text-anchor="end" font-size="11" class="bold">${U.esc(r.label)}</text>`;
      r.parts.forEach((p) => {
        net += p.v;
        let a, b;
        if (p.v >= 0) { a = sx(pos); b = sx(pos + p.v); pos += p.v; } else { b = sx(neg); a = sx(neg + p.v); neg += p.v; }
        if (Math.abs(b - a) > 0.2) s += `<rect x="${a}" y="${y + 5}" width="${b - a}" height="${rh - 10}" class="fill-${p.cls}" opacity=".9"><title>${U.esc((p.name || '') + ': ' + U.num(p.v, 2))}</title></rect>`;
      });
      const nx = sx(net);
      s += `<line x1="${nx}" y1="${y + 1}" x2="${nx}" y2="${y + rh - 1}" stroke-width="2.6" class="stroke-ink"/>`;
      s += `<text x="${x1 + 4}" y="${y + rh / 2 + 4}" font-size="11" class="bold">${U.esc(U.num(net, o.dec ?? 1))}</text>`;
    });
    s += `<line x1="${sx(0)}" y1="${pad - 2}" x2="${sx(0)}" y2="${pad + rows.length * rh}" class="ln"/>`;
    legend.forEach((l, i) => {
      const cx = 8 + (i % lc) * (W / lc), cy = pad + rows.length * rh + 8 + Math.floor(i / lc) * 16;
      s += `<rect x="${cx}" y="${cy}" width="10" height="10" rx="2" class="fill-${l.cls}"/><text x="${cx + 14}" y="${cy + 9}" font-size="10">${U.esc(l.name)}</text>`;
    });
    return s + '</svg>';
  };
  // histogram of values. o: {bins, cls, marks:[{v,label}]}
  C.hist = (vals, o = {}) => {
    const W = o.w || 360, H = o.h || 150, padL = 8, padB = 22, bins = o.bins || 30;
    if (!vals.length) return '';
    const lo = o.min ?? Math.min(...vals), hi = o.max ?? Math.max(...vals);
    const bw = (hi - lo) / bins || 1;
    const counts = new Array(bins).fill(0);
    vals.forEach((v) => { const i = Math.min(bins - 1, Math.max(0, Math.floor((v - lo) / bw))); counts[i]++; });
    const cmax = Math.max(...counts) || 1;
    const sx = (v) => padL + ((v - lo) / (hi - lo || 1)) * (W - 2 * padL);
    let s = `<svg class="dg" viewBox="0 0 ${W} ${H}" role="img">`;
    counts.forEach((c, i) => {
      const x = sx(lo + i * bw), w = Math.max(0.5, sx(lo + (i + 1) * bw) - x - 1), h = (c / cmax) * (H - padB - 8);
      s += `<rect x="${x}" y="${H - padB - h}" width="${w}" height="${h}" class="fill-${o.cls || 'p'}" opacity=".85"/>`;
    });
    s += `<line x1="${padL}" y1="${H - padB}" x2="${W - padL}" y2="${H - padB}" class="ln"/>`;
    s += `<text x="${padL}" y="${H - 6}" font-size="10" class="lab">${U.esc(U.sig(lo, 3))}</text><text x="${W - padL}" y="${H - 6}" font-size="10" text-anchor="end" class="lab">${U.esc(U.sig(hi, 3))}</text>`;
    (o.marks || []).forEach((m) => {
      const x = sx(m.v);
      s += `<line x1="${x}" y1="6" x2="${x}" y2="${H - padB}" class="stroke-${m.cls || 'o'}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
      if (m.label) s += `<text x="${x + 3}" y="14" font-size="10" class="bold">${U.esc(m.label)}</text>`;
    });
    return s + '</svg>';
  };
})();
