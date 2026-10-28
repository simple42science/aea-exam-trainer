/* AEA Coach – app: router, screens, daily plan */
(function () {
  'use strict';
  const A = window.AEA, U = A.u, St = A.store, G = A.games;
  const app = (A.app = {});
  let view;

  const MAIN = ['/', '/learn', '/practice', '/exam', '/progress'];
  const ROTATION = ['fu', 'basics', 'company', 'lcia', 'ghg', 'unc', 'weight', 'io', 'mgmt', 'alloc', 'ems', 'clca', 'targets', 'dec', 'lcc', 'review', 'econ', 'supply', 'risk'];
  const PART = { P: 'Stephan Pfister · Product LCA (AEA)', C: 'Arthur Braunschweig · Company LCA (IESG)', X: 'Cross-cutting' };

  // ───────────────────────────── helpers
  const params = () => { const h = location.hash.slice(1) || '/'; const i = h.indexOf('?'); return { path: i < 0 ? h : h.slice(0, i), q: Object.fromEntries(new URLSearchParams(i < 0 ? '' : h.slice(i + 1))) }; };
  const html = (s) => { view.innerHTML = s; mount(view); };
  const pbar = (v, cls = '') => `<div class="pbar ${cls}"><i style="width:${Math.round(v * 100)}%"></i></div>`;
  const topicsOf = (part) => A.topics.filter((t) => t.part === part);
  const learnTopics = () => A.topics.filter((t) => t.id !== 'iso');
  app.diagram = (id) => {
    const d = A.diagrams[id];
    if (!d) return `<div class="callout trap">Diagram "${U.esc(id)}" is missing.</div>`;
    const interactive = d.infoFn || Object.keys(d.info).length;
    return `<figure class="dgf" data-dg="${id}"><div class="dg-title">${U.esc(d.title)}</div>${d.draw()}${interactive ? '<div class="dg-hint">👆 Tap the elements for explanations</div>' : ''}<div class="dg-info"></div>${d.caption ? `<figcaption>${d.caption}</figcaption>` : ''}</figure>`;
  };
  app.calc = (id) => {
    const c = A.calcs[id];
    if (!c) return `<div class="callout trap">Calculator "${U.esc(id)}" is missing.</div>`;
    return `<div class="calc" data-calc="${id}"><h4>🧮 ${U.esc(c.title)}</h4><p class="small muted">${c.desc}</p><div class="calc-body"></div></div>`;
  };
  function mount(root) {
    U.$$('[data-calc]', root).forEach((el) => { const c = A.calcs[el.dataset.calc]; if (c && !el.dataset.done) { el.dataset.done = 1; try { c.render(U.$('.calc-body', el)); } catch (e) { U.$('.calc-body', el).textContent = 'Error: ' + e.message; } } });
  }
  document.addEventListener('click', (e) => {
    const g = e.target.closest('figure.dgf [data-k]');
    if (!g) return;
    const fig = g.closest('figure.dgf'), d = A.diagrams[fig.dataset.dg], k = g.dataset.k;
    const content = d && (d.infoFn ? d.infoFn(k) : d.info[k]);
    if (!content) return;
    U.$$('.sel', fig).forEach((x) => x.classList.remove('sel'));
    U.$$(`[data-k="${k}"]`, fig).forEach((x) => x.classList.add('sel'));
    const box = U.$('.dg-info', fig);
    box.innerHTML = content;
    box.classList.add('on');
  });

  function renderSection(s) {
    let h = '';
    if (s.h) h += `<h3>${s.h}</h3>`;
    if (s.t) h += `<div>${s.t}</div>`;
    if (s.box) h = `<div class="callout ${s.box}">${s.h ? `<b>${s.h}</b><br>` : ''}${s.t}</div>`;
    if (s.f) h += `<div class="formula">${s.f}</div>`;
    if (s.d) h += app.diagram(s.d);
    if (s.c) h += app.calc(s.c);
    return s.box ? h : `<div class="sec">${h}</div>`;
  }

  // ───────────────────────────── daily plan
  function weakestTopics(n = 3) {
    return learnTopics().filter((t) => t.part !== 'X' && t.q.length).map((t) => [St.mastery(t.q) + St.seenShare(t.q) * 0.05, t]).sort((a, b) => a[0] - b[0]).slice(0, n).map((x) => x[1]);
  }
  function plan(date) {
    const S = A.S, days = U.daysBetween(date, S.examDate);
    const phase = days < 0 ? 0 : days <= 14 ? 3 : days <= 49 ? 2 : 1;
    const dayIdx = U.daysBetween('2026-01-01', date), wd = U.weekday(date);
    const T = A.topicById(ROTATION[((dayIdx % ROTATION.length) + ROTATION.length) % ROTATION.length]) || A.topics[0];
    const due = St.dueItems().length;
    const tasks = [];
    tasks.push({ key: 'fu', icon: '🎯', title: 'FU warm-up', desc: '3 questions on the functional unit (always question 1 in the exam)', size: 'small', min: 3, href: '#/play?type=fu&n=3&task=fu' });
    tasks.push({ key: 'srs', icon: '🔁', title: 'Smart review', desc: due ? `${due} reviews due` : 'new and weak tasks from all topics', size: 'small', min: 8, href: `#/play?due=1&n=${phase === 3 ? 25 : 15}&task=srs` });
    if (phase === 1) {
      tasks.push({ key: 'read', icon: '📖', title: `Chapter ${T.no}: ${T.title}`, desc: 'Read the chapter, then redraw its diagram from memory', size: 'big', min: 20, href: `#/learn/${T.id}?task=read` });
      tasks.push({ key: 'quiz', icon: '❓', title: `Quiz on ${T.no}`, desc: '8 mixed tasks on the chapter', size: 'small', min: 8, href: `#/play?topic=${T.id}&n=8&task=quiz` });
      tasks.push({ key: 'oral', icon: '🎙️', title: '2 oral questions', desc: 'answer out loud in English, then tick the key points', size: 'small', min: 6, href: `#/play?type=oral&topic=${T.id}&n=2&task=oral` });
      if (wd === 3) tasks.push({ key: 'case', icon: '📝', title: 'Wednesday = mock exam', desc: 'case study: 30 min preparation, 30 min oral', size: 'big', min: 60, href: '#/mock?task=case' });
      else if (dayIdx % 2 === 0) tasks.push({ key: 'calc', icon: '🧮', title: '3 calculations', desc: 'allocation, recycling, pedigree, eco-points, LCC …', size: 'big', min: 15, href: '#/play?type=calc&n=3&task=calc' });
      else tasks.push({ key: 'game', icon: '🧩', title: 'Match, order, sort', desc: '4 game rounds across all topics', size: 'small', min: 8, href: '#/play?type=match,order,sort&n=4&task=game' });
    } else if (phase === 2) {
      const W = weakestTopics(2);
      tasks.push({ key: 'oral', icon: '🎙️', title: '4 oral questions (Pfister + Braunschweig)', desc: 'alternating product and company LCA', size: 'small', min: 12, href: '#/play?type=oral&n=4&mix=PB&task=oral' });
      tasks.push({ key: 'weak', icon: '📖', title: `Weak spot: ${W[0].no} ${W[0].title}`, desc: 'chapter + 6 tasks', size: 'big', min: 20, href: `#/play?topic=${W[0].id}&n=6&task=weak` });
      if (wd === 3 || wd === 6) tasks.push({ key: 'case', icon: '📝', title: 'Mock exam (case study)', desc: '30 min preparation + 30 min oral', size: 'big', min: 60, href: '#/mock?task=case' });
      else tasks.push({ key: 'calc', icon: dayIdx % 2 ? '🧩' : '🧮', title: dayIdx % 2 ? 'Game round' : '3 calculations', desc: dayIdx % 2 ? 'matching, ordering, sorting' : 'calculate as in the preparation time', size: 'small', min: 10, href: dayIdx % 2 ? '#/play?type=match,order,sort&n=4&task=calc' : '#/play?type=calc&n=3&task=calc' });
      tasks.push({ key: 'walk', icon: '🎧', title: 'Walk & talk (optional)', desc: 'questions read aloud – answer out loud while walking', size: 'big', min: 30, href: '#/walk?n=12&task=walk' });
    } else if (phase === 3) {
      const W = weakestTopics(1)[0];
      tasks.push({ key: 'case', icon: '⏱️', title: 'Mock exam (case study)', desc: 'full simulation 30 + 30 min', size: 'big', min: 60, href: '#/mock?task=case' });
      tasks.push({ key: 'oral', icon: '🎙️', title: '6 follow-up drills', desc: 'mixed Pfister and Braunschweig', size: 'small', min: 15, href: '#/play?type=oral&n=6&mix=PB&task=oral' });
      tasks.push({ key: 'weak', icon: '📖', title: `Weakest topic: ${W.title}`, desc: '8 tasks', size: 'small', min: 10, href: `#/play?topic=${W.id}&n=8&task=weak` });
      tasks.push({ key: 'iso', icon: '📜', title: 'ISO blitz', desc: '6 questions on standards', size: 'small', min: 5, href: '#/play?topic=iso&n=6&task=iso' });
    } else {
      tasks.push({ key: 'free', icon: '✨', title: 'Exam over?', desc: 'adjust the exam date under Progress', size: 'small', min: 1, href: '#/progress' });
    }
    return { phase, days, topic: T, tasks };
  }
  app.plan = plan;
  const PHASES = { 1: ['Phase 1 · Foundation', 'Understand one chapter per day plus small reviews. Mock exam every Wednesday.'], 2: ['Phase 2 · Application', 'Close weak spots, practise orally, two mock exams per week.'], 3: ['Phase 3 · Simulation', 'A mock exam and follow-up drills every day. Stay calm.'], 0: ['After the exam', 'Adjust the date if needed.'] };

  // ───────────────────────────── screens
  function home() {
    const S = A.S, today = U.today(), P = plan(today);
    const [ph, phd] = PHASES[P.phase];
    const doneN = P.tasks.filter((t) => St.taskDone(today, t.key)).length;
    const cards = A.allItems().filter((it) => it.t === 'card');
    const rnd = U.seeded(U.daysBetween('2026-01-01', today) * 7919 + 13);
    const cod = cards.length ? cards[Math.floor(rnd() * cards.length)] : null;
    const dIds = Object.keys(A.diagrams), dod = dIds[Math.floor(rnd() * dIds.length)];
    const mP = St.mastery(topicsOf('P').flatMap((t) => t.q)), mC = St.mastery(topicsOf('C').flatMap((t) => t.q));
    let h = `<div class="card hero"><div class="row between"><div><div class="big-num">${P.days >= 0 ? P.days : '–'}</div><p>days until the oral exam</p></div><div style="text-align:right"><p class="small">${U.dateLabel(today)}</p><p class="small">Exam: ${U.dateShort(S.examDate)}</p></div></div><span class="phase">${ph}</span><p class="small mt">${phd}</p></div>`;
    h += `<div class="section-title"><h2>Your plan for today</h2><span class="small muted">${doneN}/${P.tasks.length} done</span></div>`;
    P.tasks.forEach((t) => {
      const done = St.taskDone(today, t.key);
      h += `<div class="task ${done ? 'done' : ''}"><button class="ck" data-task="${t.key}" aria-label="done">✓</button><div class="tt"><b>${t.icon} ${U.esc(t.title)}</b><span>${U.esc(t.desc)}</span><div class="row mt" style="gap:6px"><span class="tag ${t.size}">${t.size} · ~${t.min} min</span></div></div><a class="btn sm go" href="${t.href}">Go</a></div>`;
    });
    h += `<div class="grid two mt2"><div class="card"><h3>Status</h3><div class="small row between"><span>🧪 Product LCA (Pfister)</span><b>${U.pct(mP)}</b></div>${pbar(mP, 'P')}<div class="small row between mt"><span>🏢 Company LCA (Braunschweig)</span><b>${U.pct(mC)}</b></div>${pbar(mC, 'C')}<div class="small muted mt">🔁 ${St.dueItems().length} due · 🔥 streak ${S.streak.n} (best ${S.streak.best || 0})</div></div>`;
    h += `<div class="card"><h3>Quick start</h3><div class="btn-row" style="margin-top:4px"><a class="btn sm" href="#/play?due=1&n=10">🔁 Review</a><a class="btn sm sec" href="#/play?type=fu&n=5">🎯 FU drill</a><a class="btn sm sec" href="#/mock">⏱️ Mock exam</a><a class="btn sm sec" href="#/walk?n=10">🎧 Walk</a></div></div></div>`;
    if (cod) h += `<div class="section-title"><h3>🃏 Term of the day</h3><span class="tag ${(A.topicById(cod.topic) || {}).part || ''}">${U.esc((A.topicById(cod.topic) || {}).title || '')}</span></div><div class="card flip" id="cod"><div class="front">${U.fmt(cod.f)}</div><div class="back hidden">${U.fmt(cod.b)}</div><div class="tiny muted center mt">tap to flip</div></div>`;
    h += `<div class="section-title"><h3>🖼️ Diagram of the day</h3><a class="small" href="#/graphs">all diagrams</a></div>${app.diagram(dod)}`;
    html(h);
    view.onclick = (e) => {
      const ck = e.target.closest('[data-task]');
      if (ck) { const k = ck.dataset.task; St.taskDone(today, k, !St.taskDone(today, k)); home(); return; }
      if (e.target.closest('#cod')) U.$('#cod .back').classList.toggle('hidden');
    };
  }

  function learnList() {
    let h = '<div class="section-title"><h2>Learn</h2><a class="small" href="#/search">🔎 Search</a></div>';
    h += `<div class="grid three"><a class="lrow" href="#/learn/strategy"><span class="li">🧭</span><span class="lt"><b>Exam strategy</b><span>format, FU first, answer pattern</span></span><span class="chev">›</span></a><a class="lrow" href="#/iso"><span class="li">📜</span><span class="lt"><b>ISO compass</b><span>all standards & frameworks</span></span><span class="chev">›</span></a><a class="lrow" href="#/graphs"><span class="li">🖼️</span><span class="lt"><b>Diagrams & calculators</b><span>${Object.keys(A.diagrams).length} diagrams · ${Object.keys(A.calcs).length} calculators</span></span><span class="chev">›</span></a></div>`;
    ['P', 'C'].forEach((p) => {
      h += `<div class="section-title"><h3>${p === 'P' ? '🧪' : '🏢'} ${PART[p]}</h3></div><div class="grid tiles">`;
      topicsOf(p).forEach((t) => {
        const m = St.mastery(t.q);
        h += `<a class="tile ${p}" href="#/learn/${t.id}"><span class="ti">${t.icon}</span><b>${U.esc(t.no)} · ${U.esc(t.title)}</b><span class="muted">${U.esc(t.short)}</span>${pbar(m, p)}</a>`;
      });
      h += '</div>';
    });
    html(h);
  }

  function topicPage(id, q) {
    const t = A.topicById(id);
    if (!t) return learnList();
    const counts = {};
    t.q.forEach((it) => { counts[it.t] = (counts[it.t] || 0) + 1; });
    let h = `<div class="card"><div class="row between"><span class="tag ${t.part}">${U.esc(PART[t.part] || '')}</span><span class="small muted">${t.q.length} tasks · ${U.pct(St.mastery(t.q))} mastered</span></div><h2 class="mt">${t.icon} ${U.esc(t.no)} · ${U.esc(t.title)}</h2><p class="muted mb0">${U.esc(t.short)}</p>${t.q.length ? `<div class="btn-row"><a class="btn" href="#/play?topic=${t.id}&n=10">🎯 Practise 10 tasks</a>${counts.oral ? `<a class="btn sec" href="#/play?topic=${t.id}&type=oral&n=5">🎙️ oral</a>` : ''}${counts.card ? `<a class="btn sec" href="#/play?topic=${t.id}&type=card&n=12">🃏 cards</a>` : ''}${counts.calc ? `<a class="btn sec" href="#/play?topic=${t.id}&type=calc&n=5">🧮 calculate</a>` : ''}</div>` : ''}</div>`;
    h += '<div class="card learn">' + (t.learn || []).map(renderSection).join('') + '</div>';
    if (t.phrases && t.phrases.length) h += `<div class="card"><h3>🗣️ How to say it in the exam</h3>${t.phrases.map((p) => `<div class="phrase">${U.fmt(p)}</div>`).join('')}</div>`;
    if (t.traps && t.traps.length) h += `<div class="card"><h3>⚠️ Typical traps</h3><ul>${t.traps.map((p) => `<li>${U.fmt(p)}</li>`).join('')}</ul></div>`;
    const orals = t.q.filter((it) => it.t === 'oral');
    if (orals.length) h += `<div class="card"><h3>🎙️ Exam questions on this topic</h3>${orals.map((o) => `<details class="acc"><summary><span class="who ${o.who || 'P'}">${o.who === 'B' ? 'B' : 'P'}</span> ${U.esc(U.strip(o.q))}</summary><div class="acc-body"><ul class="small">${o.k.map((k) => `<li>${U.fmt(k)}</li>`).join('')}</ul>${o.fu && o.fu.length ? `<div class="small"><b>Follow-up questions:</b><ul>${o.fu.map(([a, b]) => `<li><i>${U.fmt(a)}</i> → ${U.fmt(b)}</li>`).join('')}</ul></div>` : ''}</div></details>`).join('')}</div>`;
    if (q.task) h += '<div class="btn-row"><button class="btn block" data-act="readdone">✓ Mark chapter as read</button></div>';
    h += `<div class="btn-row"><a class="btn sec" href="#/learn">‹ all chapters</a>${t.q.length ? `<a class="btn" href="#/play?topic=${t.id}&n=10">Practise now</a>` : ''}</div>`;
    html(h);
    view.onclick = (e) => {
      if (e.target.closest('[data-act=readdone]')) { St.taskDone(U.today(), q.task, true); A.S.read[t.id] = U.today(); St.save(); U.toast('Done ✓'); location.hash = '#/'; }
    };
  }

  function practice() {
    const due = St.dueItems().length, all = A.allItems();
    const cnt = (ty) => all.filter((it) => ty.includes(it.t)).length;
    let h = '<div class="section-title"><h2>Practice</h2></div>';
    h += `<a class="lrow" href="#/play?due=1&n=15"><span class="li">🔁</span><span class="lt"><b>Smart review</b><span>${due} due · then new and weak tasks (spaced repetition)</span></span><span class="chev">›</span></a>`;
    h += '<div class="grid two"><a class="lrow" href="#/play?part=P&n=12"><span class="li">🧪</span><span class="lt"><b>Mix: product LCA</b><span>Pfister part</span></span><span class="chev">›</span></a><a class="lrow" href="#/play?part=C&n=12"><span class="li">🏢</span><span class="lt"><b>Mix: company LCA</b><span>Braunschweig part</span></span><span class="chev">›</span></a></div>';
    h += '<div class="section-title"><h3>By task type</h3></div><div class="grid two">';
    [['fu', '🎯', 'FU drill', 'choose and justify the functional unit'], ['oral', '🎙️', 'Oral questions', 'with key-point check and follow-ups'], ['card', '🃏', 'Flashcards', 'terms, definitions, lists'], ['mc', '❓', 'Quiz', 'multiple choice & true/false'], ['calc', '🧮', 'Calculations', 'with step-by-step solution'], ['match,order,sort', '🧩', 'Games', 'matching, ordering, sorting']].forEach(([ty, ic, ti, de]) => {
      h += `<a class="lrow" href="#/play?type=${ty}&n=${ty === 'oral' ? 5 : 10}"><span class="li">${ic}</span><span class="lt"><b>${ti}</b><span>${de} · ${cnt(ty.split(','))}</span></span><span class="chev">›</span></a>`;
    });
    h += '</div>';
    h += `<div class="card mt"><h3>🎧 Walk & talk</h3><p class="small muted">The app reads exam questions aloud in English, waits while you answer out loud, then reads the key points. Ideal for your walk after a mock exam.</p><div class="row"><label class="small">Thinking pause <select class="field" id="wp">${[15, 20, 30, 45, 60, 90].map((s) => `<option ${A.S.walk.pause === s ? 'selected' : ''}>${s}</option>`).join('')}</select> s</label><label class="small">Source <select class="field" id="ws"><option value="mix">mixed</option><option value="P">Pfister only</option><option value="C">Braunschweig only</option><option value="cases">case study questions</option></select></label></div><div class="btn-row"><button class="btn" id="wgo">▶ Start walk</button></div></div>`;
    h += '<div class="section-title"><h3>By topic</h3></div>';
    ['P', 'C', 'X'].forEach((p) => {
      const ts = A.topics.filter((t) => t.part === p && t.q.length);
      if (!ts.length) return;
      h += `<div class="chips">${ts.map((t) => `<a class="chip" href="#/play?topic=${t.id}&n=10">${t.icon} ${U.esc(t.no)} ${U.esc(t.title)}</a>`).join('')}</div>`;
    });
    h += '<div class="section-title"><h3>Diagrams & calculators</h3></div><a class="lrow" href="#/graphs"><span class="li">🖼️</span><span class="lt"><b>Gallery</b><span>all interactive diagrams and calculators</span></span><span class="chev">›</span></a>';
    html(h);
    U.$('#wgo').onclick = () => { const p = +U.$('#wp').value; A.S.walk.pause = p; St.save(); const src = U.$('#ws').value; location.hash = src === 'cases' ? '#/walk?src=cases&n=12' : src === 'mix' ? '#/walk?n=12' : `#/walk?part=${src}&n=12`; };
  }

  function selectItems(q) {
    if (q.ids) return q.ids.split(',').map((id) => A.itemById[id]).filter(Boolean);
    let items = A.allItems();
    if (q.topic) { const ts = q.topic.split(','); items = items.filter((it) => ts.includes(it.topic)); }
    else items = items.filter((it) => it.topic !== 'iso' || (q.type && q.type !== 'oral'));
    if (q.part) items = items.filter((it) => { const t = A.topicById(it.topic); return t && t.part === q.part; });
    if (q.type) { const ty = q.type.split(','); items = items.filter((it) => ty.includes(it.t)); }
    const n = +q.n || 10, S = A.S, today = U.today();
    const score = (it) => { const s = S.items[it.id]; if (!s) return 1 + Math.random(); if (s.d <= today) return 3 + Math.random(); return (5 - s.b) * 0.2 + Math.random() * 0.6; };
    const ranked = items.map((it) => [score(it), it]).sort((a, b) => b[0] - a[0]).map((x) => x[1]);
    if (q.mix === 'PB') {
      const P = ranked.filter((it) => it.who !== 'B'), B = ranked.filter((it) => it.who === 'B'), out = [];
      const p2 = U.shuffle(P.slice(0, n * 2)), b2 = U.shuffle(B.slice(0, n * 2));
      for (let i = 0; out.length < n && (i < p2.length || i < b2.length); i++) { if (p2[i]) out.push(p2[i]); if (b2[i] && out.length < n) out.push(b2[i]); }
      return out;
    }
    return q.due ? ranked.slice(0, n) : U.shuffle(ranked.slice(0, Math.max(n * 2, n))).slice(0, n);
  }
  function play(_, q) {
    const items = selectItems(q);
    const t = q.topic ? A.topicById(q.topic.split(',')[0]) : null;
    const title = q.due ? 'Smart review' : t ? `${t.no} ${t.title}` : q.type ? (A.TYPES[q.type.split(',')[0]] || {}).label : q.part ? PART[q.part] : 'Mixed';
    G.run(view, items, { taskKey: q.task, title, back: q.task ? '#/' : null });
  }
  function caseItems(c) {
    return c.q.map((x, i) => Object.assign({ t: 'oral', id: `case:${c.id}:${i}`, topic: x.topic }, x));
  }
  function walk(_, q) {
    let items;
    if (q.src === 'cases') items = U.shuffle(A.cases.flatMap(caseItems)).slice(0, +q.n || 12);
    else if (q.case) { const c = A.cases.find((x) => x.id === q.case); items = c ? caseItems(c) : []; }
    else items = selectItems(Object.assign({ type: 'oral', mix: q.part ? null : 'PB' }, q, { type: 'oral' }));
    if (q.task) St.taskDone(U.today(), q.task, true);
    G.walk(view, items, { pause: A.S.walk.pause, rate: A.S.walk.rate });
  }

  function exam() {
    const S = A.S;
    let h = '<div class="card hero"><h2>📝 Oral exam</h2><p>30 min alone with a case study → 30 min oral with both examiners. First Stephan Pfister (product LCA, question 1 = functional unit), then Arthur Braunschweig (company LCA).</p><div class="btn-row"><a class="btn sec" href="#/mock">⏱️ Start a mock exam</a><a class="btn sec" href="#/learn/strategy">🧭 Strategy</a></div></div>';
    h += '<div class="section-title"><h3>Case studies</h3><span class="small muted">from exam protocols + new ones</span></div>';
    A.cases.forEach((c) => {
      const r = S.cases[c.id];
      h += `<a class="lrow" href="#/case/${c.id}"><span class="li">${c.icon || '📄'}</span><span class="lt"><b>${U.esc(c.title)}</b><span>${U.esc(c.src)} · ${c.q.length} questions${r ? ` · last ${U.dateShort(r.d)}: ${r.ok}/${r.n}` : ''}</span></span><span class="chev">›</span></a>`;
    });
    h += '<div class="btn-row"><a class="btn sec" href="#/walk?src=cases&n=12">🎧 Case questions as audio</a></div>';
    html(h);
  }

  function casePage(id, q) {
    const c = A.cases.find((x) => x.id === id);
    if (!c) return exam();
    const S = A.S;
    if (q.mode === 'oral') {
      return G.run(view, caseItems(c), { title: c.title + ' · oral', taskKey: q.task, back: '#/case/' + c.id, onFinish: (res) => { S.cases[c.id] = { d: U.today(), ok: res.filter((r) => r.ok).length, n: res.length }; St.save(); } });
    }
    const dataTbl = c.data ? `<div class="tbl-wrap"><table>${c.data.map((r, i) => `<tr>${r.map((x) => (i ? `<td>${U.fmt(x)}</td>` : `<th>${U.fmt(x)}</th>`)).join('')}</tr>`).join('')}</table></div>` : '';
    let h = `<div class="card"><div class="row between"><span class="tag">${U.esc(c.src)}</span><span class="timer" id="tm">30:00</span></div><h2 class="mt">${c.icon || '📄'} ${U.esc(c.title)}</h2><div class="btn-row"><button class="btn sm" id="tgo">▶ 30-min timer</button><button class="btn sm sec" id="treset">↺</button></div></div>`;
    h += `<div class="card case-text"><h3>Case study</h3>${c.intro}${dataTbl}${c.fig ? app.diagram(c.fig) : ''}</div>`;
    h += `<div class="card"><h3>Questions</h3><ol>${c.q.map((x) => `<li style="margin:6px 0"><span class="who ${x.who}">${x.who === 'P' ? 'Pfister' : 'Braunschweig'}</span> ${U.fmt(x.q)}</li>`).join('')}</ol></div>`;
    h += `<div class="card"><h3>✍️ Your notes (key points per question)</h3><textarea class="notes" id="nt" placeholder="1) FU: …&#10;2) …">${U.esc(S.notes[c.id] || '')}</textarea><p class="tiny muted">Saved automatically on this device.</p></div>`;
    h += `<div class="btn-row"><a class="btn" href="#/case/${c.id}?mode=oral${q.task ? '&task=' + q.task : ''}">🎙️ Start the oral exam</a><a class="btn sec" href="#/walk?case=${c.id}">🎧 as audio</a></div>`;
    if (c.tips) h += `<div class="callout key mt"><b>Tips for this case:</b> ${c.tips}</div>`;
    html(h);
    U.$('#nt').addEventListener('input', (e) => { S.notes[c.id] = e.target.value; St.save(); });
    let left = 30 * 60, iv = null;
    const show = () => { U.$('#tm').textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0'); };
    U.$('#tgo').onclick = (e) => {
      if (iv) { clearInterval(iv); iv = null; e.target.textContent = '▶ resume'; return; }
      e.target.textContent = '⏸ pause';
      iv = setInterval(() => { left--; show(); if (left <= 0) { clearInterval(iv); iv = null; U.toast('⏰ Preparation time is over – start the oral part!', 4000); if (navigator.vibrate) navigator.vibrate([300, 150, 300]); } }, 1000);
      G._timers.push(iv);
    };
    U.$('#treset').onclick = () => { left = 30 * 60; show(); };
    if (q.mock) U.$('#tgo').click();
  }
  function mock(_, q) {
    const S = A.S;
    const sorted = A.cases.slice().sort((a, b) => ((S.cases[a.id] || {}).d || '0').localeCompare((S.cases[b.id] || {}).d || '0'));
    const pickFrom = sorted.filter((c) => !S.cases[c.id]).length ? sorted.filter((c) => !S.cases[c.id]) : sorted.slice(0, 4);
    const c = U.pick(pickFrom);
    location.replace(`#/case/${c.id}?mock=1${q.task ? '&task=' + q.task : ''}`);
  }

  function progress() {
    const S = A.S, all = A.allItems(), seen = all.filter((it) => S.items[it.id]).length;
    let h = '<div class="section-title"><h2>Progress</h2></div>';
    h += `<div class="card"><div class="stat-grid"><div class="stat"><b>${S.streak.n}</b><span>day streak</span></div><div class="stat"><b>${S.xp}</b><span>XP</span></div><div class="stat"><b>${seen}/${all.length}</b><span>tasks seen</span></div></div><div class="small muted mt">🔁 ${St.dueItems().length} due today · best streak ${S.streak.best || 0} days</div></div>`;
    const days = [];
    for (let i = 55; i >= 0; i--) { const d = U.addDays(U.today(), -i), v = S.log[d] || 0; days.push(`<i class="${v >= 40 ? 'l3' : v >= 15 ? 'l2' : v > 0 ? 'l1' : ''}" title="${d}: ${v} XP"></i>`); }
    h += `<div class="card"><h3>Activity (8 weeks)</h3><div class="heat">${days.join('')}</div></div>`;
    ['P', 'C', 'X'].forEach((p) => {
      const ts = A.topics.filter((t) => t.part === p && t.q.length);
      if (!ts.length) return;
      h += `<div class="card"><h3>${p === 'P' ? '🧪 Product LCA' : p === 'C' ? '🏢 Company LCA' : '🧭 Cross-cutting'}</h3>${ts.map((t) => { const m = St.mastery(t.q); return `<a href="#/learn/${t.id}" style="text-decoration:none;color:inherit"><div class="small row between mt"><span>${t.icon} ${U.esc(t.no)} ${U.esc(t.title)}</span><b>${U.pct(m)}</b></div>${pbar(m, p)}</a>`; }).join('')}</div>`;
    });
    h += `<div class="card"><h3>⚙️ Settings</h3><label class="small">Exam date<br><input type="date" id="ed" class="field" value="${S.examDate}"></label><div class="row mt"><span class="small">Theme</span>${['auto', 'light', 'dark'].map((t) => `<button class="chip ${S.theme === t ? 'on' : ''}" data-theme="${t}">${t === 'auto' ? 'Auto' : t === 'light' ? 'Light' : 'Dark'}</button>`).join('')}</div></div>`;
    h += '<div class="card"><h3>💾 Backup</h3><p class="small muted">Your progress is stored only in this browser. Export it before clearing website data or switching devices.</p><div class="btn-row"><button class="btn sec" id="bx">⬇️ Export (JSON)</button><label class="btn sec">⬆️ Import<input type="file" id="bi" accept="application/json" hidden></label><button class="btn warn" id="br">Reset</button></div></div>';
    h += `<p class="tiny muted center">AEA Coach · private study aid, not an official ETH product · ${A.topics.length} topics · ${all.length} tasks · ${A.cases.length} case studies</p>`;
    html(h);
    U.$('#ed').onchange = (e) => { if (e.target.value) { S.examDate = e.target.value; St.save(); app.updateHeader(); U.toast('Exam date saved'); } };
    view.onclick = (e) => { const b = e.target.closest('[data-theme]'); if (b) { S.theme = b.dataset.theme; St.save(); applyTheme(); progress(); } };
    U.$('#bx').onclick = () => St.exportJSON();
    U.$('#bi').onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { try { St.importJSON(t); U.toast('Backup imported'); progress(); app.updateHeader(); } catch (err) { U.toast('Import failed: ' + err.message, 3000); } }); };
    U.$('#br').onclick = () => { if (confirm('Really delete all your progress?')) { St.reset(); progress(); app.updateHeader(); } };
  }

  function search(_, q) {
    html(`<input class="search-box" id="sq" placeholder="Search: e.g. allocation, pedigree, Scope 3, SMART …" value="${U.esc(q.q || '')}" autofocus><div id="sr" class="mt"></div>`);
    const run = () => {
      const term = U.$('#sq').value.trim().toLowerCase();
      const out = U.$('#sr');
      if (term.length < 2) { out.innerHTML = '<p class="small muted">Type at least 2 characters.</p>'; return; }
      const res = [];
      const hit = (txt) => U.strip(txt).toLowerCase().includes(term);
      const snip = (txt) => { const s = U.strip(txt), i = s.toLowerCase().indexOf(term); if (i < 0) return U.esc(s.slice(0, 110)); const a = Math.max(0, i - 50); return (a ? '…' : '') + U.esc(s.slice(a, i)) + '<span class="hl">' + U.esc(s.slice(i, i + term.length)) + '</span>' + U.esc(s.slice(i + term.length, i + term.length + 70)) + '…'; };
      A.topics.forEach((t) => {
        const txt = t.title + ' ' + t.short + ' ' + (t.learn || []).map((s) => (s.h || '') + ' ' + (s.t || '')).join(' ');
        if (hit(txt)) res.push(`<a class="lrow" href="#/learn/${t.id}"><span class="li">${t.icon}</span><span class="lt"><b>${U.esc(t.no + ' ' + t.title)}</b><span>${snip(txt)}</span></span></a>`);
      });
      A.iso.forEach((e) => { const txt = e.code + ' ' + e.title + ' ' + e.what + ' ' + (e.points || []).join(' '); if (hit(txt)) res.push(`<a class="lrow" href="#/iso/${e.id}"><span class="li">📜</span><span class="lt"><b>${U.esc(e.code)} – ${U.esc(e.title)}</b><span>${snip(txt)}</span></span></a>`); });
      A.cases.forEach((c) => { const txt = c.title + ' ' + c.intro + ' ' + c.q.map((x) => x.q + ' ' + x.k.join(' ')).join(' '); if (hit(txt)) res.push(`<a class="lrow" href="#/case/${c.id}"><span class="li">${c.icon || '📄'}</span><span class="lt"><b>${U.esc(c.title)}</b><span>${snip(txt)}</span></span></a>`); });
      A.allItems().forEach((it) => { const txt = [it.q, it.f, it.b, it.e, (it.k || []).join(' '), (it.o || []).join(' ')].join(' '); if (hit(txt) && res.length < 80) res.push(`<a class="lrow" href="#/play?ids=${encodeURIComponent(it.id)}"><span class="li">${(A.TYPES[it.t] || {}).icon || '•'}</span><span class="lt"><b>${U.esc(U.strip(it.q || it.f).slice(0, 90))}</b><span>${snip(txt)}</span></span></a>`); });
      out.innerHTML = res.length ? `<p class="small muted">${res.length} results</p>` + res.join('') : '<p class="small muted">No results.</p>';
    };
    U.$('#sq').addEventListener('input', run);
    run();
  }

  function isoList(_, q) {
    const cats = [['all', 'All'], ['org', 'Organisation'], ['prod', 'Product'], ['com', 'Communication'], ['soc', 'Social & reporting']];
    const f = q.f || 'all';
    let h = `<div class="section-title"><h2>📜 ISO compass</h2><a class="small" href="#/play?topic=iso&n=8">ISO quiz</a></div>${app.diagram('iso-map')}<div class="chips">${cats.map(([k, l]) => `<a class="chip ${f === k ? 'on' : ''}" href="#/iso?f=${k}">${l}</a>`).join('')}</div>`;
    A.iso.filter((e) => f === 'all' || e.cat === f).forEach((e) => {
      h += `<a class="lrow" href="#/iso/${e.id}"><span class="li">${e.cert ? '🏅' : '📘'}</span><span class="lt"><b>${U.esc(e.code)} – ${U.esc(e.title)}</b><span>${U.esc(e.what)}</span></span><span class="chev">›</span></a>`;
    });
    html(h);
  }
  function isoPage(id) {
    const e = A.iso.find((x) => x.id === id);
    if (!e) return isoList(null, {});
    let h = `<div class="card"><span class="tag ${e.level === 'Product' ? 'P' : 'C'}">${U.esc(e.level)}</span> <span class="tag">${e.cert ? '🏅 certifiable / verifiable' : '📘 guidance / method'}</span><h2 class="mt">${U.esc(e.code)}</h2><p><b>${U.esc(e.title)}</b></p><p>${e.what}</p></div>`;
    if (e.points) h += `<div class="card"><h3>Key content</h3><ul>${e.points.map((p) => `<li>${U.fmt(p)}</li>`).join('')}</ul></div>`;
    if (e.exam) h += `<div class="callout exam"><b>Exam hook:</b> ${U.fmt(e.exam)}</div>`;
    if (e.confuse) h += `<div class="callout trap"><b>Don't confuse with:</b> ${U.fmt(e.confuse)}</div>`;
    if (e.diagram) h += app.diagram(e.diagram);
    if (e.rel) h += `<div class="chips">${e.rel.map((r) => { const x = A.iso.find((y) => y.id === r); return x ? `<a class="chip" href="#/iso/${x.id}">${U.esc(x.code)}</a>` : ''; }).join('')}</div>`;
    h += '<div class="btn-row"><a class="btn sec" href="#/iso">‹ all standards</a></div>';
    html(h);
  }

  function graphs() {
    let h = '<div class="section-title"><h2>🖼️ Diagrams</h2></div>';
    h += Object.values(A.diagrams).map((d) => `<a class="lrow" href="#/diagram/${d.id}"><span class="li">🖼️</span><span class="lt"><b>${U.esc(d.title)}</b></span><span class="chev">›</span></a>`).join('');
    h += '<div class="section-title"><h2>🧮 Calculators</h2></div>';
    h += Object.values(A.calcs).map((c) => `<a class="lrow" href="#/calc/${c.id}"><span class="li">🧮</span><span class="lt"><b>${U.esc(c.title)}</b></span><span class="chev">›</span></a>`).join('');
    html(h);
  }
  function diagramPage(id) {
    const used = A.topics.filter((t) => (t.learn || []).some((s) => s.d === id));
    html(app.diagram(id) + (used.length ? `<div class="chips">${used.map((t) => `<a class="chip" href="#/learn/${t.id}">${t.icon} ${U.esc(t.title)}</a>`).join('')}</div>` : '') + '<div class="callout tip">Study tip: look at the diagram, put the phone away and redraw it on paper from memory. Then compare. You are allowed to draw in the exam!</div>');
  }
  function calcPage(id) { html(app.calc(id)); }

  // ───────────────────────────── router & boot
  const ROUTES = [
    [/^\/?$/, home], [/^\/learn$/, learnList], [/^\/learn\/([\w-]+)$/, topicPage], [/^\/practice$/, practice], [/^\/play$/, play], [/^\/walk$/, walk],
    [/^\/exam$/, exam], [/^\/case\/([\w-]+)$/, casePage], [/^\/mock$/, mock], [/^\/progress$/, progress], [/^\/search$/, search],
    [/^\/iso$/, isoList], [/^\/iso\/([\w-]+)$/, isoPage], [/^\/graphs$/, graphs], [/^\/diagram\/([\w-]+)$/, diagramPage], [/^\/calc\/([\w-]+)$/, calcPage],
  ];
  const TAB = (p) => (p === '/' || p === '' ? 'home' : /^\/(learn|iso|graphs|diagram|calc)/.test(p) ? 'learn' : /^\/(practice|play|walk)/.test(p) ? 'practice' : /^\/(exam|case|mock)/.test(p) ? 'exam' : /^\/progress/.test(p) ? 'progress' : '');
  function route() {
    G.stopAll();
    view.onclick = null;
    const { path, q } = params();
    U.$$('.nav-in a').forEach((a) => a.classList.toggle('on', a.dataset.tab === TAB(path)));
    U.$('#backBtn').classList.toggle('hidden', MAIN.includes(path) || path === '');
    for (const [re, fn] of ROUTES) {
      const m = path.match(re);
      if (m) { try { fn(m[1], q); } catch (e) { view.innerHTML = `<div class="callout trap">Error: ${U.esc(e.message)}</div>`; console.error(e); } window.scrollTo(0, 0); return; }
    }
    home();
  }
  function applyTheme() {
    const t = A.S.theme;
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
  }
  app.updateHeader = () => {
    const S = A.S, d = U.daysBetween(U.today(), S.examDate);
    U.$('#hStreak').textContent = '🔥 ' + S.streak.n;
    U.$('#hDays').textContent = '⏳ ' + (d >= 0 ? d + ' d' : '–');
  };

  // generated ISO quiz topic
  function buildIsoTopic() {
    const mk = A.mk, items = [];
    const E = A.iso.filter((e) => e.quiz !== false);
    E.forEach((e, i) => {
      const others = U.shuffle(E.filter((x) => x.id !== e.id), U.seeded(i + 7)).slice(0, 3);
      const opts = [e, ...others];
      items.push(mk.mc(`What is **${e.code}** about?`, opts.map((x) => x.title), 0, `${e.code}: ${e.what}`));
      items.push(mk.mc(`Which standard or framework fits: "${e.title}"?`, opts.map((x) => x.code), 0, `${e.code}: ${e.what}`));
      items.push(mk.card(`${e.code}`, `**${e.title}**\n${U.strip(e.what)}${e.cert ? '\n🏅 certifiable / verifiable' : '\n📘 guidance / method'}`));
    });
    A.topic({ id: 'iso', no: 'X1', part: 'X', icon: '📜', title: 'ISO compass (quiz)', short: 'recognise and match standards and frameworks', learn: [], q: items });
  }

  A.boot = function () {
    view = U.$('#view');
    St.load();
    applyTheme();
    buildIsoTopic();
    app.updateHeader();
    U.$('#backBtn').onclick = () => { if (history.length > 1) history.back(); else location.hash = '#/'; };
    window.addEventListener('hashchange', route);
    route();
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) navigator.serviceWorker.register('sw.js').catch(() => {});
  };
})();
