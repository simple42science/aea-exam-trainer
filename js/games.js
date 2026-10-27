/* AEA Coach – practice engines: session runner, item renderers, walk (audio) mode */
(function () {
  'use strict';
  const A = window.AEA, U = A.u, St = A.store;
  const G = (A.games = {});
  const R = {};

  const rateBtns = () => '<button class="btn r0" data-q="0">Nochmal<small>heute</small></button><button class="btn r1" data-q="1">Schwer<small>morgen</small></button><button class="btn r2" data-q="2">Gut<small>später</small></button><button class="btn r3" data-q="3">Leicht<small>viel später</small></button>';
  const head = (it) => {
    const t = A.topicById(it.topic), ty = A.TYPES[it.t] || A.TYPES.card;
    return `<div class="qhead"><span class="tag">${ty.icon} ${ty.label}</span>${t ? `<span class="tag ${t.part}">${U.esc(t.no + ' ' + t.title)}</span>` : ''}</div>`;
  };
  const whoTag = (w) => (w ? `<span class="who ${w}">${w === 'P' ? 'Pfister · Product LCA' : 'Braunschweig · Company'}</span>` : '');
  const parseNum = (s) => parseFloat(String(s).replace(/['’\s]/g, '').replace(',', '.'));

  // ─────────────────────────────── session runner
  G.run = function (el, items, opts = {}) {
    G.stopAll();
    if (!items || !items.length) {
      el.innerHTML = '<div class="card center"><p>Keine passenden Aufgaben gefunden.</p><a class="btn sec" href="#/practice">Zurück zum Üben</a></div>';
      return;
    }
    const S = { i: 0, res: [] };
    const summary = () => {
      const n = S.res.length, ok = S.res.filter((r) => r.ok).length;
      if (opts.taskKey) St.taskDone(U.today(), opts.taskKey, true);
      if (opts.onFinish) opts.onFinish(S.res);
      const wrong = S.res.filter((r) => !r.ok).map((r) => r.it);
      el.innerHTML = `<div class="card center"><div class="summary-big">${ok}/${n}</div><p class="muted">richtig bzw. gut gewusst</p>${ok === n ? '<p>🎉 Perfekt!</p>' : ok / n >= 0.7 ? '<p>💪 Stark, weiter so.</p>' : '<p>📌 Die Fehler kommen in der Wiederholung bald wieder.</p>'}</div>` +
        (wrong.length ? `<div class="card"><h3>Nochmal anschauen</h3>${wrong.map((it) => `<div class="small" style="margin:4px 0">• ${U.esc(U.strip(it.q || it.f).slice(0, 140))}</div>`).join('')}</div>` : '') +
        `<div class="btn-row">${wrong.length ? '<button class="btn" data-act="redo">Fehler wiederholen</button>' : ''}<button class="btn sec" data-act="back">Fertig</button></div>`;
      el.onclick = (e) => {
        const a = e.target.closest('[data-act]');
        if (!a) return;
        if (a.dataset.act === 'redo') G.run(el, wrong, Object.assign({}, opts, { taskKey: null }));
        else if (a.dataset.act === 'back') { if (opts.back) location.hash = opts.back; else history.back(); }
      };
      window.scrollTo(0, 0);
    };
    const draw = () => {
      if (S.i >= items.length) return summary();
      const it = items[S.i];
      el.innerHTML = `<div class="progress-top"><button class="btn sm sec" data-act="quit" aria-label="Beenden">✕</button><div class="pbar"><i style="width:${(S.i / items.length) * 100}%"></i></div><span class="small muted">${S.i + 1}/${items.length}</span></div>${opts.title ? `<div class="small muted" style="margin:-4px 2px 8px">${U.esc(opts.title)}</div>` : ''}<div class="qcard" id="qc"></div>`;
      const qc = U.$('#qc', el);
      let graded = false;
      const done = (q, ok) => { if (graded) return; graded = true; St.grade(it.id, q); S.res.push({ it, q, ok: ok == null ? q >= 2 : ok }); };
      const next = () => { G.stopTimers(); S.i++; draw(); window.scrollTo(0, 0); };
      (R[it.t] || R.card)(it, qc, done, next, opts);
    };
    el.onclick = (e) => {
      if (e.target.closest('[data-act=quit]')) {
        G.stopTimers();
        if (S.res.length) summary(); else if (opts.back) location.hash = opts.back; else history.back();
      }
    };
    draw();
  };

  // ─────────────────────────────── renderers
  R.card = (it, el, done, next) => {
    el.innerHTML = head(it) + `<div class="flip"><div class="front">${U.fmt(it.f)}</div><div class="back hidden">${U.fmt(it.b)}</div><div class="tiny muted mt center tap">Tippen zum Umdrehen</div></div><div class="rate hidden">${rateBtns()}</div>`;
    U.$('.flip', el).onclick = () => { U.$('.back', el).classList.remove('hidden'); U.$('.tap', el).classList.add('hidden'); U.$('.rate', el).classList.remove('hidden'); };
    U.$('.rate', el).onclick = (e) => { const b = e.target.closest('[data-q]'); if (!b) return; done(+b.dataset.q); next(); };
  };

  R.mc = (it, el, done, next) => {
    const order = it.tf ? it.o.map((_, i) => i) : U.shuffle(it.o.map((_, i) => i));
    el.innerHTML = head(it) + (it.t === 'fu' ? '<div class="small muted">Welche funktionelle Einheit ist am besten?</div>' : '') + `<div class="qtext">${U.fmt(it.q)}</div>` + order.map((i) => `<button class="opt" data-i="${i}">${U.fmt(it.o[i])}</button>`).join('') + '<div class="after"></div>';
    let answered = false;
    el.onclick = (e) => {
      const nx = e.target.closest('[data-act=next]');
      if (nx) return next();
      const b = e.target.closest('.opt');
      if (!b || answered) return;
      answered = true;
      const i = +b.dataset.i, ok = i === it.a;
      U.$$('.opt', el).forEach((x) => { const j = +x.dataset.i; if (j === it.a) x.classList.add('ok'); else if (x === b) x.classList.add('bad'); else x.classList.add('dim'); });
      U.$('.after', el).innerHTML = (it.e ? `<div class="expl">${ok ? '✅ ' : '❌ '}${U.fmt(it.e)}</div>` : `<div class="expl">${ok ? '✅ Richtig' : '❌ Falsch'}</div>`) + (it.model ? `<div class="callout exam mt"><b>Muster-FU:</b> ${U.fmt(it.model)}</div>` : '') + '<div class="btn-row"><button class="btn" data-act="next">Weiter</button></div>';
      done(ok ? 2 : 0, ok);
    };
  };
  R.fu = R.mc;

  R.order = (it, el, done, next) => {
    let cur = U.shuffle(it.items.map((_, i) => i));
    if (cur.length > 1 && cur.every((v, i) => v === i)) cur.reverse();
    let checked = false;
    const draw = () => {
      el.innerHTML = head(it) + `<div class="qtext">${U.fmt(it.q)}</div><div class="olist">` + cur.map((v, pos) => `<div class="oi ${checked ? (v === pos ? 'ok' : 'bad') : ''}"><span class="num">${pos + 1}</span><span class="tx">${U.fmt(it.items[v])}</span>${checked ? '' : `<span class="mv"><button data-up="${pos}" aria-label="nach oben">▲</button><button data-dn="${pos}" aria-label="nach unten">▼</button></span>`}</div>`).join('') + '</div><div class="after"></div>';
      const af = U.$('.after', el);
      if (!checked) af.innerHTML = '<div class="btn-row"><button class="btn" data-act="check">Prüfen</button></div>';
      else {
        const nOk = cur.filter((v, i) => v === i).length;
        af.innerHTML = `<div class="expl">${nOk === cur.length ? '✅ Alles richtig!' : `❌ ${nOk}/${cur.length} an der richtigen Stelle. Richtig ist:<ol class="steps">${it.items.map((t) => `<li>${U.fmt(t)}</li>`).join('')}</ol>`}${it.e ? `<div class="mt">${U.fmt(it.e)}</div>` : ''}</div><div class="btn-row"><button class="btn" data-act="next">Weiter</button></div>`;
      }
    };
    el.onclick = (e) => {
      const up = e.target.closest('[data-up]'), dn = e.target.closest('[data-dn]');
      if (up) { const p = +up.dataset.up; if (p > 0) [cur[p - 1], cur[p]] = [cur[p], cur[p - 1]]; return draw(); }
      if (dn) { const p = +dn.dataset.dn; if (p < cur.length - 1) [cur[p + 1], cur[p]] = [cur[p], cur[p + 1]]; return draw(); }
      const a = e.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'check') {
        checked = true;
        const nOk = cur.filter((v, i) => v === i).length;
        done(nOk === cur.length ? 2 : nOk / cur.length >= 0.6 ? 1 : 0, nOk === cur.length);
        draw();
      } else if (a.dataset.act === 'next') next();
    };
    draw();
  };

  R.match = (it, el, done, next) => {
    const L = U.shuffle(it.pairs.map((_, i) => i)), RR = U.shuffle(it.pairs.map((_, i) => i));
    let selL = null, errors = 0;
    const matched = new Set();
    const draw = () => {
      el.innerHTML = head(it) + `<div class="qtext">${U.fmt(it.q || 'Ordne zu: links antippen, dann rechts.')}</div><div class="match"><div>${L.map((i) => `<div class="mi ${matched.has(i) ? 'done' : ''} ${selL === i ? 'sel' : ''}" data-l="${i}">${U.fmt(it.pairs[i][0])}</div>`).join('')}</div><div>${RR.map((i) => `<div class="mi ${matched.has(i) ? 'done' : ''}" data-r="${i}">${U.fmt(it.pairs[i][1])}</div>`).join('')}</div></div><div class="after"></div>`;
      if (matched.size === it.pairs.length) {
        U.$('.after', el).innerHTML = `<div class="expl">${errors === 0 ? '✅ Fehlerfrei zugeordnet!' : `Fertig mit ${errors} Fehlversuch(en).`}${it.e ? `<div class="mt">${U.fmt(it.e)}</div>` : ''}</div><div class="btn-row"><button class="btn" data-act="next">Weiter</button></div>`;
      }
    };
    el.onclick = (e) => {
      if (e.target.closest('[data-act=next]')) return next();
      const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
      if (l) { const i = +l.dataset.l; if (!matched.has(i)) { selL = i; draw(); } return; }
      if (r && selL != null) {
        const i = +r.dataset.r;
        if (matched.has(i)) return;
        if (i === selL) {
          matched.add(i); selL = null;
          if (matched.size === it.pairs.length) done(errors === 0 ? 2 : errors <= 2 ? 1 : 0, errors <= 1);
          draw();
        } else { errors++; r.classList.add('flash'); setTimeout(() => r.classList.remove('flash'), 450); }
      }
    };
    draw();
  };

  R.sort = (it, el, done, next) => {
    const order = U.shuffle(it.items.map((_, i) => i));
    const sel = {};
    let checked = false;
    const draw = () => {
      el.innerHTML = head(it) + `<div class="qtext">${U.fmt(it.q)}</div><div class="sortq">` + order.map((i) => {
        const right = it.items[i][1], st = checked ? (sel[i] === right ? 'ok' : 'bad') : '';
        return `<div class="si ${st}"><div class="tx">${U.fmt(it.items[i][0])}</div><div class="chips">${it.cats.map((c, ci) => `<button class="chip ${sel[i] === ci ? 'on' : ''}" data-i="${i}" data-c="${ci}"${checked ? ' disabled' : ''}>${U.esc(c)}</button>`).join('')}</div>${checked && sel[i] !== right ? `<div class="tiny mt">→ richtig: <b>${U.esc(it.cats[right])}</b></div>` : ''}</div>`;
      }).join('') + '</div><div class="after"></div>';
      const af = U.$('.after', el);
      if (!checked) af.innerHTML = '<div class="btn-row"><button class="btn" data-act="check">Prüfen</button></div>';
      else {
        const nOk = order.filter((i) => sel[i] === it.items[i][1]).length;
        af.innerHTML = `<div class="expl">${nOk === order.length ? '✅ Alles richtig!' : `${nOk}/${order.length} richtig.`}${it.e ? `<div class="mt">${U.fmt(it.e)}</div>` : ''}</div><div class="btn-row"><button class="btn" data-act="next">Weiter</button></div>`;
      }
    };
    el.onclick = (e) => {
      const c = e.target.closest('[data-c]');
      if (c && !checked) { sel[+c.dataset.i] = +c.dataset.c; return draw(); }
      const a = e.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'check') {
        checked = true;
        const nOk = order.filter((i) => sel[i] === it.items[i][1]).length, sh = nOk / order.length;
        done(sh === 1 ? 2 : sh >= 0.7 ? 1 : 0, sh >= 0.85);
        draw();
      } else if (a.dataset.act === 'next') next();
    };
    draw();
  };

  R.calc = (it, el, done, next) => {
    el.innerHTML = head(it) + `<div class="qtext">${U.fmt(it.q)}</div>${it.given ? `<div class="small muted">${U.fmt(it.given)}</div>` : ''}<div class="numin"><input type="text" inputmode="decimal" placeholder="Resultat" aria-label="Resultat"/><span class="small">${U.esc(it.unit || '')}</span></div>${it.hint ? `<details class="small mt"><summary>Hinweis</summary>${U.fmt(it.hint)}</details>` : ''}<div class="btn-row"><button class="btn" data-act="check">Prüfen</button><button class="btn sec" data-act="show">Lösung zeigen</button></div><div class="after"></div>`;
    const inp = U.$('input', el);
    const reveal = (ok, x) => {
      U.$('.after', el).innerHTML = `<div class="expl">${ok == null ? '' : ok ? '✅ Richtig! ' : `❌ Nicht ganz (deine Antwort: ${U.esc(String(x))}). `}Lösung: <b>${U.num(it.ans, 4)} ${U.esc(it.unit || '')}</b>${it.steps && it.steps.length ? `<ol class="steps">${it.steps.map((s) => `<li>${U.fmt(s)}</li>`).join('')}</ol>` : ''}${it.e ? `<div class="mt">${U.fmt(it.e)}</div>` : ''}</div><div class="btn-row"><button class="btn" data-act="next">Weiter</button></div>`;
      U.$$('[data-act=check],[data-act=show]', el).forEach((b) => (b.disabled = true));
    };
    el.onclick = (e) => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'check') {
        const x = parseNum(inp.value);
        if (!isFinite(x)) { U.toast('Bitte eine Zahl eingeben'); return; }
        const tol = Math.abs(it.ans) > 1e-9 ? Math.abs(it.ans) * (it.tol || 0.02) : 0.01;
        const ok = Math.abs(x - it.ans) <= tol;
        done(ok ? 2 : 0, ok);
        reveal(ok, inp.value);
      } else if (a.dataset.act === 'show') { done(0, false); reveal(null); }
      else if (a.dataset.act === 'next') next();
    };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') U.$('[data-act=check]', el).click(); });
  };

  R.oral = (it, el, done, next) => {
    el.innerHTML = head(it) + `<div class="row between">${whoTag(it.who)}<span class="timer small muted" data-t>0:00</span></div><div class="qtext">${U.fmt(it.q)}</div>${it.hint ? `<details class="small"><summary>Hinweis</summary>${U.fmt(it.hint)}</details>` : ''}<div class="small muted mt">Antworte laut oder in Stichworten. Dann aufdecken und abhaken, was du genannt hast.</div><div class="btn-row"><button class="btn" data-act="reveal">Antwort aufdecken</button></div><div class="after"></div>`;
    const t0 = Date.now(), tEl = U.$('[data-t]', el);
    G._timers.push(setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); tEl.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }, 1000));
    const on = new Set();
    const score = () => {
      const sh = on.size / it.k.length, sug = sh >= 0.8 ? 'Gut/Leicht' : sh >= 0.5 ? 'Schwer' : 'Nochmal';
      const sc = U.$('[data-score]', el);
      if (sc) sc.innerHTML = `${on.size}/${it.k.length} Stichworte → Vorschlag: <b>${sug}</b>`;
    };
    el.onclick = (e) => {
      const a = e.target.closest('[data-act]');
      if (a && a.dataset.act === 'reveal') {
        G.stopTimers();
        a.disabled = true;
        U.$('.after', el).innerHTML = '<div class="small muted mt">Stichworte der Musterantwort (antippen, was du gesagt hast):</div>' + it.k.map((k, i) => `<div class="kw" data-kw="${i}"><span class="box">✓</span><span>${U.fmt(k)}</span></div>`).join('') +
          (it.fu && it.fu.length ? `<div class="fuq"><div class="small"><b>Typische Nachfragen</b></div>${it.fu.map(([q, ans]) => `<details><summary>${U.fmt(q)}</summary><div class="small mt">${U.fmt(ans)}</div></details>`).join('')}</div>` : '') +
          (it.trap ? `<div class="callout trap mt"><b>Falle:</b> ${U.fmt(it.trap)}</div>` : '') + (it.e ? `<div class="expl">${U.fmt(it.e)}</div>` : '') +
          `<div class="small mt" data-score></div><div class="rate">${rateBtns()}</div>`;
        score();
        return;
      }
      const kw = e.target.closest('[data-kw]');
      if (kw) { const i = +kw.dataset.kw; if (on.has(i)) on.delete(i); else on.add(i); kw.classList.toggle('on'); score(); return; }
      const r = e.target.closest('[data-q]');
      if (r) { const q = +r.dataset.q; done(q, q >= 2); next(); }
    };
  };

  // ─────────────────────────────── timers & audio
  G._timers = [];
  G.stopTimers = () => { G._timers.forEach(clearInterval); G._timers = []; };
  G.stopAll = () => {
    G.stopTimers();
    if (G._walk) { G._walk.stopped = true; G._walk = null; }
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  };

  const speakable = (s) => U.strip(s)
    .replace(/→/g, ', leads to, ').replace(/≈/g, ' about ').replace(/×/g, ' times ').replace(/·/g, ' times ')
    .replace(/≥/g, ' at least ').replace(/≤/g, ' at most ').replace(/±/g, ' plus minus ').replace(/CO₂/g, 'C O 2').replace(/CH₄/g, 'methane')
    .replace(/N₂O/g, 'nitrous oxide').replace(/₂/g, '2').replace(/⁻¹/g, ' inverse').replace(/e\.g\./g, 'for example').replace(/i\.e\./g, 'that is').replace(/\bvs\./g, 'versus');

  // walk mode: reads questions aloud, waits, reads the key points
  G.walk = function (el, items, opts = {}) {
    G.stopAll();
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
      el.innerHTML = '<div class="card">Dieser Browser unterstützt keine Sprachausgabe. Tipp: Safari auf dem iPhone oder Chrome verwenden.</div>';
      return;
    }
    const W = (G._walk = { stopped: false, paused: false, i: 0, phase: 'ready', t: 0 });
    const pause = opts.pause || 30;
    const voice = () => { const vs = synth.getVoices(); return vs.find((v) => /en[-_]GB/i.test(v.lang)) || vs.find((v) => /^en/i.test(v.lang)) || null; };
    const say = (text, cb) => {
      const u = new SpeechSynthesisUtterance(text);
      const v = voice();
      if (v) u.voice = v;
      u.lang = v ? v.lang : 'en-GB';
      u.rate = opts.rate || 0.95;
      u.onend = () => { if (!W.stopped && cb) cb(); };
      synth.speak(u);
    };
    const ui = () => {
      const it = items[W.i];
      if (W.phase === 'done' || !it) {
        el.innerHTML = '<div class="card center"><div class="summary-big">🎧 ✓</div><p>Walk-Session fertig. Gut gemacht!</p><a class="btn" href="#/">Zurück</a></div>';
        return;
      }
      el.innerHTML = `<div class="progress-top"><div class="pbar"><i style="width:${(W.i / items.length) * 100}%"></i></div><span class="small muted">${W.i + 1}/${items.length}</span></div>
        <div class="qcard"><div class="row between">${whoTag(it.who)}<span class="tag">${W.phase === 'ready' ? 'bereit' : W.phase === 'q' ? '🔊 Frage' : W.phase === 'think' ? '🗣️ Du antwortest' : '🔊 Stichworte'}</span></div>
        <div class="qtext">${U.fmt(it.q)}</div>
        ${W.phase === 'think' ? `<div class="big-timer">${W.t}s</div>` : ''}
        ${W.phase === 'a' ? `<ul class="small">${it.k.map((k) => `<li>${U.fmt(k)}</li>`).join('')}</ul>` : ''}
        <div class="btn-row">${W.phase === 'ready' ? '<button class="btn" data-w="start">▶ Start</button>' : `<button class="btn sec" data-w="pause">${W.paused ? '▶ Weiter' : '⏸ Pause'}</button><button class="btn sec" data-w="skip">⏭ Nächste</button>`}<button class="btn sec" data-w="stop">⏹ Stopp</button></div></div>
        <p class="tiny muted center">Bildschirm darf aus sein, solange der Browser im Vordergrund läuft (je nach Gerät). Antworte laut auf Englisch.</p>`;
    };
    const step = () => {
      if (W.stopped) return;
      if (W.i >= items.length) { W.phase = 'done'; ui(); say('Session finished. Well done.'); return; }
      const it = items[W.i];
      W.phase = 'q'; ui();
      say(`Question ${W.i + 1}. ${speakable(it.q)}`, () => {
        W.phase = 'think'; W.t = pause; ui();
        const iv = setInterval(() => {
          if (W.stopped) { clearInterval(iv); return; }
          if (W.paused) return;
          W.t--;
          const bt = U.$('.big-timer', el);
          if (bt) bt.textContent = W.t + 's';
          if (W.t <= 0) {
            clearInterval(iv);
            W.phase = 'a'; ui();
            say('Key points. ' + it.k.map(speakable).join('. '), () => { W.i++; setTimeout(step, 1200); });
          }
        }, 1000);
        G._timers.push(iv);
      });
    };
    el.onclick = (e) => {
      const b = e.target.closest('[data-w]');
      if (!b) return;
      const a = b.dataset.w;
      if (a === 'start') { synth.cancel(); step(); }
      else if (a === 'pause') { W.paused = !W.paused; if (W.paused) synth.pause(); else synth.resume(); ui(); }
      else if (a === 'skip') { G.stopTimers(); synth.cancel(); W.i++; setTimeout(step, 300); }
      else if (a === 'stop') { G.stopAll(); W.phase = 'done'; location.hash = '#/practice'; }
    };
    if (synth.getVoices().length === 0) synth.onvoiceschanged = () => {};
    ui();
  };
})();
