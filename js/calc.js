/* AEA Coach – interactive calculators */
(function () {
  'use strict';
  const A = window.AEA, U = A.u, CH = A.chart;
  const def = (id, title, desc, build) => { A.calcs[id] = { id, title, desc, render: build }; };

  // generic panel: range inputs + optional top html (selects/number inputs with data-k) + live output
  function panel(el, cfg) {
    let h = cfg.top || '';
    (cfg.inputs || []).forEach((d) => {
      h += `<label class="inp"><span>${d.label}</span><b class="val" data-v="${d.k}"></b><input type="range" min="${d.min}" max="${d.max}" step="${d.step}" value="${d.v}" data-k="${d.k}"></label>`;
    });
    h += (cfg.mid || '') + '<div class="out"></div>';
    el.innerHTML = h;
    const out = el.querySelector('.out');
    const read = () => {
      const v = {};
      el.querySelectorAll('[data-k]').forEach((i) => { v[i.dataset.k] = i.type === 'range' || i.type === 'number' ? parseFloat(i.value) : i.value; });
      return v;
    };
    const upd = (ev) => {
      if (cfg.onPreset && ev && ev.target && ev.target.dataset.preset) cfg.onPreset(ev.target.value, el);
      const v = read();
      (cfg.inputs || []).forEach((d) => {
        const s = el.querySelector(`[data-v="${d.k}"]`);
        if (s) s.textContent = (d.fmt ? d.fmt(v[d.k]) : U.num(v[d.k], d.dec == null ? 2 : d.dec)) + (d.unit ? ' ' + d.unit : '');
      });
      out.innerHTML = cfg.out(v, el);
    };
    el.addEventListener('input', upd);
    el.addEventListener('change', upd);
    upd();
    return { read, upd };
  }
  const setRange = (el, k, val) => { const i = el.querySelector(`[data-k="${k}"]`); if (i) i.value = val; };
  const mat = (rows, cls) => `<table style="width:auto;display:inline-table;margin:2px 6px 2px 0" class="${cls || ''}">${rows.map((r) => `<tr>${r.map((c) => `<td style="text-align:right;padding:2px 7px;border:0">${typeof c === 'number' ? U.sig(c, 3) : c}</td>`).join('')}</tr>`).join('')}</table>`;

  // 1 ─────────────────────────────────────────── matrix LCA
  def('matrix', 'Matrix-LCA zum Mitrechnen (2 Prozesse, 2 Emissionen)', 'Prozess 1 liefert das Produkt (f = 1) und braucht a Einheiten von Produkt 2 aus Prozess 2. Verändere die Werte und sieh, wie s, g und h reagieren.', (el) => {
    panel(el, {
      inputs: [
        { k: 'a', label: 'Input von Produkt 2 in Prozess 1 (a)', min: 0, max: 2, step: 0.05, v: 0.2 },
        { k: 'c1', label: 'CO₂ aus Prozess 1 [kg/Einheit]', min: 0, max: 2, step: 0.05, v: 0.5 },
        { k: 's1', label: 'SO₂ aus Prozess 1 [kg/Einheit]', min: 0, max: 1, step: 0.01, v: 0.1 },
        { k: 'c2', label: 'CO₂ aus Prozess 2 [kg/Einheit]', min: 0, max: 2, step: 0.05, v: 0.4 },
        { k: 's2', label: 'SO₂ aus Prozess 2 [kg/Einheit]', min: 0, max: 1, step: 0.01, v: 0.3 },
        { k: 'q', label: 'CF von SO₂ (Q, Punkte/kg; CO₂ = 1)', min: 0, max: 5, step: 0.1, v: 2, dec: 1 },
      ],
      out: (v) => {
        const s = [1, v.a], g = [v.c1 + v.a * v.c2, v.s1 + v.a * v.s2], h = g[0] + v.q * g[1];
        return `<div class="small">A (Zeilen = Produkte, Spalten = Prozesse; Inputs negativ) und A⁻¹:</div>${mat([[1, 0], [-v.a, 1]])} → ${mat([[1, 0], [v.a, 1]])}
          <div class="small mt">s = A⁻¹·f = [${U.sig(s[0])}; ${U.sig(s[1])}] → Prozess 2 läuft ${U.sig(v.a)}-mal pro FU.</div>
          <div class="small">g = B·s = [CO₂ ${U.sig(g[0])} kg; SO₂ ${U.sig(g[1])} kg]</div>
          <div class="mt">h = Q·g = 1·${U.sig(g[0])} + ${U.sig(v.q)}·${U.sig(g[1])} = <b>${U.sig(h, 4)}</b> Punkte pro FU</div>
          <div class="tiny muted mt">Wird a unsicher (z. B. lognormal), wird h = g(x₁ … xₖ) zu einer Verteilung → Monte Carlo.</div>`;
      },
    });
  });

  // 2 ─────────────────────────────────────────── allocation
  def('alloc', 'Allokation: Masse vs. ökonomisch vs. Energie (Lachsverarbeitung)', 'Prüfungsfall HS16: Aus 1 t Lachs entstehen 750 kg Filet, 150 kg Katzenfutter und 100 kg Fischfutter. Wie viel der Last trägt das Filet?', (el) => {
    panel(el, {
      inputs: [
        { k: 'tot', label: 'Gesamtlast pro t Lachs [kg CO₂-eq]', min: 500, max: 6000, step: 100, v: 3000, dec: 0 },
        { k: 'p1', label: 'Preis Filet [CHF/kg]', min: 5, max: 40, step: 1, v: 20, dec: 0 },
        { k: 'p2', label: 'Preis Katzenfutter [CHF/kg]', min: 0.5, max: 10, step: 0.5, v: 2, dec: 1 },
        { k: 'p3', label: 'Preis Fischfutter [CHF/kg]', min: 0.2, max: 5, step: 0.1, v: 1, dec: 1 },
      ],
      out: (v) => {
        const m = [750, 150, 100], e = [8.5, 4, 15], p = [v.p1, v.p2, v.p3], names = ['Filet', 'Katzenfutter', 'Fischfutter'];
        const share = (w) => { const t = w.reduce((a, b) => a + b, 0); return w.map((x) => x / t); };
        const sm = share(m), se = share(m.map((x, i) => x * p[i])), sn = share(m.map((x, i) => x * e[i]));
        const perkg = (sh, i) => (v.tot * sh[i]) / m[i];
        let t = '<div class="tbl-wrap"><table><tr><th></th><th>Masse</th><th>ökonomisch</th><th>Energie</th></tr>';
        names.forEach((n, i) => { t += `<tr><td>${n}</td><td>${U.pct(sm[i])}<br><span class="tiny">${U.num(perkg(sm, i))} kg/kg</span></td><td>${U.pct(se[i])}<br><span class="tiny">${U.num(perkg(se, i))} kg/kg</span></td><td>${U.pct(sn[i])}<br><span class="tiny">${U.num(perkg(sn, i))} kg/kg</span></td></tr>`; });
        t += '</table></div>';
        return t + CH.bars([{ label: 'Filet – Masse', value: perkg(sm, 0), cls: 'p' }, { label: 'Filet – ökon.', value: perkg(se, 0), cls: 'c' }, { label: 'Filet – Energie', value: perkg(sn, 0), cls: 'y' }], { dec: 2, axis: 'kg CO₂-eq pro kg Filet' }) +
          `<div class="tiny muted">Energiegehalt (Übungswerte): Filet 8.5, Katzenfutter 4, Fischfutter 15 MJ/kg. ISO: zuerst vermeiden (Unterteilung, Systemerweiterung: Gutschrift für verdrängtes Fischmehl bzw. Katzenfutter), dann physikalisch, dann ökonomisch.</div>`;
      },
    });
  });

  // 3 ─────────────────────────────────────────── recycling approaches
  def('recycling', 'Recycling-Ansätze: 10 kg Aluminium-Getränkedosen', 'Übung von Frischknecht (fiktive Zahlen): Primär-Al 7.5, Recycling 0.4 (Input und EoL), Dosenherstellung 1.2, Nutzung 0.2, Deponie 0.1 kg CO₂-eq/kg. R1 = Rezyklatanteil, R2 = Recyclingrate am Lebensende.', (el) => {
    panel(el, {
      inputs: [
        { k: 'r1', label: 'R1 – Rezyklatanteil im Produkt', min: 0, max: 1, step: 0.05, v: 0.2, fmt: (x) => U.pct(x) },
        { k: 'r2', label: 'R2 – Recyclingrate am Lebensende', min: 0, max: 1, step: 0.05, v: 0.7, fmt: (x) => U.pct(x) },
        { k: 'ev', label: 'E_V Primär-Al [kg CO₂-eq/kg]', min: 2, max: 15, step: 0.1, v: 7.5, dec: 1 },
        { k: 'er', label: 'E_rec Recycling [kg CO₂-eq/kg]', min: 0.1, max: 2, step: 0.05, v: 0.4 },
      ],
      out: (v) => {
        const m = 10, mu = m * (1.2 + 0.2), ed = 0.1;
        const prim = m * (1 - v.r1) * v.ev, recIn = m * v.r1 * v.er, land = m * (1 - v.r2) * ed;
        const RC = prim + recIn + mu + land;
        const EOR_p = m * v.ev, EOR_rec = m * v.r2 * v.er, EOR_cr = -m * v.r2 * v.ev;
        const EOR = EOR_p + mu + EOR_rec + EOR_cr + land;
        const D = m * (v.r2 - v.r1) * (v.er - v.ev);
        const PEF_p = m * (1 - v.r1 / 2) * v.ev, PEF_ri = m * (v.r1 / 2) * v.er, PEF_rec = m * (v.r2 / 2) * v.er, PEF_cr = -m * (v.r2 / 2) * v.ev;
        const PEF = PEF_p + PEF_ri + mu + PEF_rec + PEF_cr + land;
        const rows = [
          { label: 'RC / cut-off', parts: [{ v: prim, cls: 'o', name: 'Primär-Al' }, { v: recIn, cls: 'g', name: 'Rezyklat-Input' }, { v: mu, cls: 'n', name: 'Herstellung + Nutzung' }, { v: land, cls: 'y', name: 'Deponie' }] },
          { label: 'EOR', parts: [{ v: EOR_p, cls: 'o', name: 'Primär-Al' }, { v: mu, cls: 'n', name: 'Herstellung + Nutzung' }, { v: EOR_rec, cls: 'b', name: 'Recycling EoL' }, { v: land, cls: 'y', name: 'Deponie' }, { v: EOR_cr, cls: 'r', name: 'Gutschrift' }] },
          { label: 'EPD A–C', parts: [{ v: prim, cls: 'o' }, { v: recIn, cls: 'g' }, { v: mu, cls: 'n' }, { v: land, cls: 'y' }] },
          { label: 'EPD A–D', parts: [{ v: prim, cls: 'o' }, { v: recIn, cls: 'g' }, { v: mu, cls: 'n' }, { v: land, cls: 'y' }, { v: Math.max(0, m * (v.r2 - v.r1) * v.er), cls: 'b' }, { v: Math.min(0, -m * (v.r2 - v.r1) * v.ev), cls: 'r' }, { v: Math.max(0, -m * (v.r2 - v.r1) * v.ev), cls: 'o' }, { v: Math.min(0, m * (v.r2 - v.r1) * v.er), cls: 'g' }] },
          { label: 'PEF 50:50', parts: [{ v: PEF_p, cls: 'o' }, { v: PEF_ri, cls: 'g' }, { v: mu, cls: 'n' }, { v: PEF_rec, cls: 'b' }, { v: land, cls: 'y' }, { v: PEF_cr, cls: 'r' }] },
        ];
        return CH.stack(rows, { dec: 1 }) +
          `<dl class="kv mt"><dt>RC (cut-off)</dt><dd>${U.num(RC, 1)} kg CO₂-eq</dd><dt>EOR (avoided burden)</dt><dd>${U.num(EOR, 1)}</dd><dt>EN 15804: A–C | D</dt><dd>${U.num(RC, 1)} | ${U.num(D, 1)} (Summe ${U.num(RC + D, 1)})</dd><dt>PEF 50:50 (vereinfacht)</dt><dd>${U.num(PEF, 1)}</dd></dl>
          <div class="tiny muted mt">Formeln: RC = m[(1−R1)E_V + R1·E_rec] + m(1.2+0.2) + m(1−R2)E_D · EOR = m·E_V + … + m·R2(E_rec,EoL − E*_V) + m(1−R2)E_D (Rezyklat-Input wird als Primär belastet = Gegenposition) · Modul D = m(R2−R1)(E_rec,EoL − E*_V) · PEF hier vereinfacht ohne Qualitätsfaktoren und Energierückgewinnung. Der senkrechte Strich zeigt das Netto-Resultat.</div>`;
      },
    });
  });

  // 4 ─────────────────────────────────────────── pedigree
  def('pedigree', 'Pedigree-Matrix → geometrische Standardabweichung', 'Wenn nur ein Datenpunkt vorliegt: Datenqualität bewerten (1 = sehr gut … 5 = schlecht), Unsicherheitsfaktoren kombinieren, lognormale Verteilung ableiten.', (el) => {
    const F = { rel: [1, 1.05, 1.1, 1.2, 1.5], com: [1, 1.02, 1.05, 1.1, 1.2], tem: [1, 1.03, 1.1, 1.2, 1.5], geo: [1, 1.01, 1.02, 1.05, 1.1], tec: [1, 1.1, 1.2, 1.5, 2] };
    const lab = { rel: 'Reliability (Zuverlässigkeit)', com: 'Completeness (Vollständigkeit)', tem: 'Temporal correlation (Alter)', geo: 'Geographical correlation', tec: 'Further technological correlation' };
    const desc = { rel: ['verifizierte Messung', 'verifiziert, teils Annahmen', 'nicht verifiziert, teils Annahmen', 'qualifizierte Schätzung', 'unqualifizierte Schätzung'], com: ['alle Standorte, adäquate Periode', '> 50 % der Standorte', '< 50 % der Standorte', 'ein Standort', 'unbekannt'], tem: ['< 3 Jahre', '< 6 Jahre', '< 10 Jahre', '< 15 Jahre', '> 15 Jahre / unbekannt'], geo: ['gleiches Gebiet', 'grösseres Gebiet inkl. Studiengebiet', 'ähnliche Bedingungen', 'leicht ähnliche Bedingungen', 'unbekannt / ganz anders'], tec: ['gleiche Firmen & Technologie', 'gleiche Technologie, andere Firmen', 'andere Technologie', 'verwandte Prozesse (Labor)', 'verwandte Prozesse, andere Technologie'] };
    let top = '<div class="grid two">';
    Object.keys(F).forEach((k) => { top += `<label class="small">${lab[k]}<br><select data-k="${k}" class="field" style="width:100%">${F[k].map((f, i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${i + 1} – ${desc[k][i]} (U=${f})</option>`).join('')}</select></label>`; });
    top += `<label class="small">Basisunsicherheit U_b<br><select data-k="ub" class="field" style="width:100%"><option value="1.05" selected>1.05 – Energie-/Materialbedarf, CO₂ (Verbrennung)</option><option value="1.5">1.5 – SO₂, NOₓ, Landbesetzung</option><option value="2">2.0 – Transport (tkm), Landumwandlung, CH₄ (Landw.)</option><option value="3">3.0 – Infrastruktur, PM2.5, Schwermetalle in Wasser</option><option value="5">5.0 – CO, Schwermetalle in Luft, PAH</option></select></label>`;
    top += '<label class="small">Median-Wert (z. B. kWh)<br><input type="number" data-k="med" value="100" class="field" style="width:100%"></label></div>';
    panel(el, {
      top,
      out: (v) => {
        const u = ['rel', 'com', 'tem', 'geo', 'tec'].map((k) => F[k][v[k]]);
        const sum = Math.pow(Math.log(v.ub), 2) + u.reduce((a, x) => a + Math.pow(Math.log(x), 2), 0);
        const gsd2 = Math.exp(Math.sqrt(sum)), sig = 0.5 * Math.sqrt(sum), gsd = Math.exp(sig);
        const med = v.med || 0;
        return `<div class="formula">GSD² = exp(√[(ln U_b)² + Σ (ln U_i)²]) = <b>${U.num(gsd2, 3)}</b></div>
          <dl class="kv"><dt>σ (von ln x, für Activity Browser)</dt><dd>${U.num(sig, 4)}</dd><dt>GSD</dt><dd>${U.num(gsd, 3)}</dd><dt>95 %-Intervall</dt><dd>${U.sig(med / gsd2)} … ${U.sig(med * gsd2)}</dd></dl>
          <div class="tiny muted mt">Interpretation: Mit 95 % Wahrscheinlichkeit liegt der wahre Wert zwischen Median/GSD² und Median·GSD². Pedigree = Charakterisierung (Schritt 1). Die Fortpflanzung macht danach Monte Carlo.</div>`;
      },
    });
  });

  // 5 ─────────────────────────────────────────── Monte Carlo
  def('montecarlo', 'Monte Carlo: Vergleich A vs. B (unabhängig vs. abhängig gezogen)', 'Beide Produkte brauchen Strom mit demselben unsicheren Emissionsfaktor (dreieckig 0.1/0.4/0.8 kg CO₂/kWh). A: 10 kWh + spezifischer Teil (Median 3), B: 14 kWh + spezifischer Teil (Median 1.5). Teilen sich A und B den Strom-EF, muss man ihn in jedem Lauf gleich ziehen.', (el) => {
    panel(el, {
      inputs: [
        { k: 'n', label: 'Anzahl Läufe N', min: 100, max: 5000, step: 100, v: 1000, dec: 0 },
        { k: 'g', label: 'GSD der spezifischen Teile', min: 1.05, max: 2.5, step: 0.05, v: 1.4 },
      ],
      mid: '<button class="btn sm sec mt" data-act="rerun">🎲 neu simulieren</button>',
      out: (v) => {
        const tri = (a, c, b) => { const u = Math.random(), fc = (c - a) / (b - a); return u < fc ? a + Math.sqrt(u * (b - a) * (c - a)) : b - Math.sqrt((1 - u) * (b - a) * (b - c)); };
        const ln = (med, gsd) => Math.exp(Math.log(med) + Math.log(gsd) * U.randn());
        const N = v.n, Ai = [], Bi = [], Ad = [], Bd = [];
        let pi = 0, pd = 0;
        for (let i = 0; i < N; i++) {
          const ef1 = tri(0.1, 0.4, 0.8), ef2 = tri(0.1, 0.4, 0.8), xa = ln(3, v.g), xb = ln(1.5, v.g);
          const ai = 10 * ef1 + xa, bi = 14 * ef2 + xb, ad = 10 * ef1 + xa, bd = 14 * ef1 + xb;
          Ai.push(ai); Bi.push(bi); Ad.push(ad); Bd.push(bd);
          if (ai < bi) pi++;
          if (ad < bd) pd++;
        }
        const st = (arr) => { const s = arr.slice().sort((a, b) => a - b); const mean = s.reduce((a, b) => a + b, 0) / s.length; return { mean, med: U.quantile(s, 0.5), lo: U.quantile(s, 0.025), hi: U.quantile(s, 0.975) }; };
        const sa = st(Ad), sb = st(Bd), diff = Ad.map((a, i) => Bd[i] - a);
        const all = Ad.concat(Bd), lo = Math.min(...all), hi = Math.max(...all);
        return `<div class="small"><b>A</b>: Mittel ${U.num(sa.mean)}, 95 % [${U.num(sa.lo)} … ${U.num(sa.hi)}] · <b>B</b>: Mittel ${U.num(sb.mean)}, 95 % [${U.num(sb.lo)} … ${U.num(sb.hi)}]</div>` +
          '<div class="tiny muted mt">Histogramm A (teal) und B (violett):</div>' + CH.hist(Ad, { min: lo, max: hi, cls: 'p', h: 90 }) + CH.hist(Bd, { min: lo, max: hi, cls: 'c', h: 90 }) +
          '<div class="tiny muted">Differenz B − A pro Lauf (abhängig gezogen):</div>' + CH.hist(diff, { cls: 'g', h: 90, marks: [{ v: 0, label: '0' }] }) +
          `<dl class="kv mt"><dt>P(A &lt; B), unabhängig gezogen</dt><dd>${U.pct(pi / N)}</dd><dt>P(A &lt; B), abhängig gezogen</dt><dd>${U.pct(pd / N)}</dd></dl>
          <div class="tiny muted mt">Die 95 %-Intervalle von A und B überlappen stark. Trotzdem ist A in den meisten Läufen besser, wenn die gemeinsame Unsicherheit (Strom-EF) korrekt gekoppelt wird. Deshalb Differenzen bzw. Verhältnisse auswerten.</div>`;
      },
    });
    el.addEventListener('click', (e) => { if (e.target.dataset.act === 'rerun') el.dispatchEvent(new Event('input')); });
  });

  // 6 ─────────────────────────────────────────── eco-factor
  def('ecofactor', 'Ökofaktor nach der Methode der ökologischen Knappheit', 'EF = K · (1 UBP / Fₙ) · (F / F_k)² · c. Voreinstellung: NOₓ Schweiz (UBP 2021). Beobachte, wie stark die Gewichtung reagiert, wenn der aktuelle Fluss über dem kritischen liegt.', (el) => {
    panel(el, {
      inputs: [
        { k: 'F', label: 'Aktueller Fluss F [t/a]', min: 10000, max: 150000, step: 500, v: 70733, dec: 0 },
        { k: 'Fk', label: 'Kritischer Fluss F_k [t/a]', min: 10000, max: 150000, step: 500, v: 46518, dec: 0 },
        { k: 'e', label: 'Emission einer Firma [kg NOₓ/a]', min: 0, max: 5000, step: 50, v: 800, dec: 0 },
      ],
      out: (v) => {
        const Fn = v.F * 1000, ef = (1 / Fn) * Math.pow(v.F / v.Fk, 2) * 1e12;
        return `<div class="formula">(F/F_k)² = ${U.num(Math.pow(v.F / v.Fk, 2), 3)} · EF = <b>${U.num(ef, 0)} UBP/kg</b></div>
          <dl class="kv"><dt>Umweltbelastung der Firma</dt><dd>${U.num((ef * v.e) / 1e6, 2)} Mio. UBP/a</dd><dt>EF wenn F = F_k erreicht</dt><dd>${U.num((1 / (v.Fk * 1000)) * 1e12, 0)} UBP/kg</dd></dl>
          <div class="tiny muted mt">Hier ist Fₙ = F (Referenzgebiet Schweiz). Folienwert NOₓ: 33'000 UBP/kg. Der kritische Fluss stammt aus der Politik (z. B. Ozon-Grenzwerte) → Gewichtung = Schweizer Umweltpolitik, nicht „Naturwissenschaft“.</div>`;
      },
    });
  });

  // 7 ─────────────────────────────────────────── LCC compressors
  def('lcc', 'Life Cycle Costing: drei Kompressoren (Fall Stoffel AG)', 'Benötigt werden 10 kW Kälteleistung, 24 h × 365 Tage. Der FE18 hat 13 kW Kälteleistung bei 10 kW elektrisch → für 10 kW Kälte braucht er nur 10 × 10/13 ≈ 7.7 kW (Hinweis von Braunschweig). Optional: externe Kosten für CO₂ aus Strom und Kältemittel-Leckage.', (el) => {
    panel(el, {
      inputs: [
        { k: 'pe', label: 'Strompreis [CHF/kWh]', min: 0.05, max: 0.4, step: 0.01, v: 0.15 },
        { k: 'n', label: 'Lebensdauer [Jahre]', min: 5, max: 20, step: 1, v: 10, dec: 0 },
        { k: 'r', label: 'Diskontsatz', min: 0, max: 0.08, step: 0.005, v: 0, fmt: (x) => U.pct(x, 1) },
        { k: 'co2', label: 'CO₂-Preis für externe Kosten [CHF/t]', min: 0, max: 250, step: 10, v: 0, dec: 0 },
        { k: 'ef', label: 'Strom-Emissionsfaktor [kg CO₂/kWh]', min: 0.02, max: 0.6, step: 0.01, v: 0.1 },
      ],
      out: (v) => {
        const M = [['FE12', 7300, 10, 13, 110, 3922], ['FE18', 14200, 13, 10, 100, 3922], ['PBa', 9100, 10, 8, 120, 3985]];
        const af = v.r > 0 ? (1 - Math.pow(1 + v.r, -v.n)) / v.r : v.n;
        const k = (x) => U.num(x / 1000, 1);
        let t = '<div class="tbl-wrap"><table><tr><th>kCHF</th><th>Inv.</th><th>Strom</th><th>Kälte</th><th>Market</th><th>ext.</th><th>Env.</th></tr>';
        const rows = [], exact = [];
        M.forEach(([n, price, cap, pel, ref, gwp]) => {
          const pEff = pel * (10 / cap), kwhA = pEff * 8760, el1 = kwhA * v.pe * af, refC = (ref * 50 / v.n) * af;
          const mk = price + el1 + refC;
          const ext = ((kwhA * v.n * v.ef) / 1000 + (ref * gwp) / 1000) * v.co2;
          t += `<tr><td><b>${n}</b><br><span class="tiny">${U.num(pEff, 1)} kW</span></td><td>${k(price)}</td><td>${k(el1)}</td><td>${k(refC)}</td><td><b>${k(mk)}</b></td><td>${k(ext)}</td><td><b>${k(mk + ext)}</b></td></tr>`;
          rows.push({ label: n, parts: [{ v: price, cls: 'o', name: 'Investition' }, { v: el1, cls: 'b', name: 'Strom' }, { v: refC, cls: 'y', name: 'Kältemittel' }, { v: ext, cls: 'g', name: 'externe Kosten' }] });
          exact.push(`${n} ${U.num(mk, 0)} CHF`);
        });
        t += '</table></div>';
        return t + `<div class="small">Market LCC exakt: ${exact.join(' · ')}</div>` + CH.stack(rows, { dec: 0 }) + `<div class="tiny muted">Market = Total Cost of Ownership; Env. = Market + externe Kosten. Annuitätenfaktor = ${U.num(af, 2)} (bei 0 % = Lebensdauer). Kältemittel: R404A (GWP 3922) bzw. R507A (GWP 3985), angenommen: nachgefüllte Menge = Leckage. Kernaussage: Bei „aktiven Produkten“ dominiert die Nutzungsphase; der Kaufpreis ist fast irrelevant oder sogar irreführend.</div>`;
      },
    });
  });

  // 8 ─────────────────────────────────────────── water scarcity footprint
  def('water', 'Wasserknappheits-Fussabdruck (AWARE): Reis aus drei Ländern', 'Water scarcity footprint = Wasserverbrauch × AWARE-CF (0.1 bis 100). Übung aus Task 4: Vergleiche Landesdurchschnitt und Anbauregion.', (el) => {
    const R = [['USA', 'Arkansas South', 0.15], ['USA', 'Arkansas North', 2.66], ['USA', 'USA average', 36.5], ['China', 'Yellow River', 90.58], ['China', 'Southern region', 0.49], ['China', 'China average', 45.5], ['India', 'Ganges', 13.82], ['India', 'Central India', 2.22], ['India', 'India average', 29.9]];
    panel(el, {
      inputs: [
        { k: 'us', label: 'Verbrauch USA [m³/kg Reis]', min: 0.02, max: 1, step: 0.01, v: 0.08 },
        { k: 'cn', label: 'Verbrauch China [m³/kg Reis]', min: 0.02, max: 1, step: 0.01, v: 0.46 },
        { k: 'in', label: 'Verbrauch Indien [m³/kg Reis]', min: 0.02, max: 1, step: 0.01, v: 0.78 },
      ],
      out: (v) => {
        const c = { USA: v.us, China: v.cn, India: v.in };
        const rows = R.map(([land, reg, cf]) => ({ label: reg, value: c[land] * cf, cls: reg.includes('average') ? 'n' : land === 'USA' ? 'b' : land === 'China' ? 'r' : 'o' }));
        return CH.bars(rows, { labelW: 104, dec: 2, axis: 'm³ world-eq pro kg Reis' }) + '<div class="tiny muted">Grau = Landesdurchschnitt. Die Unterschiede innerhalb eines Landes (Yellow River vs. Southern region: Faktor ~185 beim CF) sind grösser als zwischen den Landesdurchschnitten → Regionalisierung ist entscheidend. Auch das LCI variiert: im trockenen Yellow-River-Gebiet ist mehr Bewässerung nötig als im regenreichen Süden.</div>';
      },
    });
  });

  // 9 ─────────────────────────────────────────── GWP time horizon
  def('gwp', 'Zeithorizont als Werteentscheidung (ReCiPe-Perspektiven)', 'Option A emittiert mehr Methan, Option B mehr CO₂. Je nach Zeithorizont dreht das Ranking. CH₄: I 84 · H 34 · E 4.8; N₂O: I 264 · H 298 · E 78.8 kg CO₂-eq/kg (ReCiPe 2016).', (el) => {
    panel(el, {
      inputs: [
        { k: 'ac', label: 'A: CO₂ [kg]', min: 0, max: 200, step: 5, v: 100, dec: 0 },
        { k: 'am', label: 'A: CH₄ [kg]', min: 0, max: 5, step: 0.1, v: 2, dec: 1 },
        { k: 'bc', label: 'B: CO₂ [kg]', min: 0, max: 300, step: 5, v: 160, dec: 0 },
        { k: 'bm', label: 'B: CH₄ [kg]', min: 0, max: 5, step: 0.1, v: 0.2, dec: 1 },
      ],
      out: (v) => {
        const P = [['Individualist (20 a)', 84], ['Hierarchist (100 a)', 34], ['Egalitarian (1000 a)', 4.8]];
        const rows = [];
        let txt = '';
        P.forEach(([n, g]) => {
          const a = v.ac + v.am * g, b = v.bc + v.bm * g;
          rows.push({ label: 'A · ' + n.split(' ')[0], value: a, cls: 'p' }, { label: 'B · ' + n.split(' ')[0], value: b, cls: 'c' });
          txt += `<dt>${n}</dt><dd>A ${U.num(a, 0)} vs. B ${U.num(b, 0)} → ${a < b ? 'A besser' : a > b ? 'B besser' : 'gleich'}</dd>`;
        });
        return CH.bars(rows, { labelW: 104, dec: 0, axis: 'kg CO₂-eq' }) + `<dl class="kv mt">${txt}</dl><div class="tiny muted mt">Kurzlebiges CH₄ (≈ 12 a) zählt bei kurzem Zeithorizont viel stärker. Werteentscheidung offenlegen und Sensitivität zeigen.</div>`;
      },
    });
  });

  // 10 ─────────────────────────────────────────── MCDA
  def('mcda', 'MCDA: Heizsystem für Neubauten (gewichtete Summe)', 'Lineare Wertfunktionen (bester Wert = 1, schlechtester = 0). Verschiebe die Gewichte und beobachte, wann die Rangfolge kippt (Sensitivitätsanalyse).', (el) => {
    panel(el, {
      inputs: [
        { k: 'wc', label: 'Gewicht Kosten', min: 0, max: 1, step: 0.05, v: 0.5 },
        { k: 'we', label: 'Gewicht CO₂', min: 0, max: 1, step: 0.05, v: 0.4 },
        { k: 'wr', label: 'Gewicht Zuverlässigkeit', min: 0, max: 1, step: 0.05, v: 0.1 },
      ],
      out: (v) => {
        const O = [['A Gas', 1200, 2500, 4], ['B Wärmepumpe', 1000, 500, 3], ['C Holzpellets', 900, 1000, 2]];
        const sw = v.wc + v.we + v.wr || 1, w = [v.wc / sw, v.we / sw, v.wr / sw];
        const vf = (x, best, worst) => (best === worst ? 1 : (x - worst) / (best - worst));
        const sc = O.map(([n, c, e, r]) => [n, w[0] * vf(c, 900, 1200) + w[1] * vf(e, 500, 2500) + w[2] * vf(r, 4, 2)]);
        const best = sc.slice().sort((a, b) => b[1] - a[1])[0][0];
        return `<div class="tbl-wrap"><table><tr><th>Option</th><th>CHF/a</th><th>kg CO₂/a</th><th>Zuverl. (1–5)</th></tr>${O.map((o) => `<tr><td>${o[0]}</td><td>${o[1]}</td><td>${o[2]}</td><td>${o[3]}</td></tr>`).join('')}</table></div>` +
          CH.bars(sc.map(([n, s]) => ({ label: n, value: s, cls: n === best ? 'g' : 'n' })), { labelW: 96, dec: 3, axis: 'Gesamtwert V = Σ wᵢ·vᵢ' }) +
          `<div class="small">Normierte Gewichte: Kosten ${U.pct(w[0])}, CO₂ ${U.pct(w[1])}, Zuverlässigkeit ${U.pct(w[2])} → Beste Option: <b>${best}</b></div>`;
      },
    });
  });

  // 11 ─────────────────────────────────────────── Leontief
  def('leontief', 'Leontief-Modell mit 2 Sektoren (EE-IO)', 'x = (I − A)⁻¹ y und Emissionen e = d · x. Die Leontief-Inverse enthält alle Vorleistungsrunden, deshalb ist die Gesamtintensität grösser als die direkte.', (el) => {
    panel(el, {
      inputs: [
        { k: 'a11', label: 'a₁₁ Landwirtschaft von Landwirtschaft [CHF/CHF]', min: 0, max: 0.5, step: 0.01, v: 0.1 },
        { k: 'a12', label: 'a₁₂ Landwirtschaft für Industrie', min: 0, max: 0.5, step: 0.01, v: 0.2 },
        { k: 'a21', label: 'a₂₁ Industrie für Landwirtschaft', min: 0, max: 0.5, step: 0.01, v: 0.15 },
        { k: 'a22', label: 'a₂₂ Industrie von Industrie', min: 0, max: 0.5, step: 0.01, v: 0.3 },
        { k: 'y1', label: 'Endnachfrage Landwirtschaft y₁ [Mio. CHF]', min: 0, max: 500, step: 10, v: 100, dec: 0 },
        { k: 'y2', label: 'Endnachfrage Industrie y₂ [Mio. CHF]', min: 0, max: 500, step: 10, v: 200, dec: 0 },
      ],
      out: (v) => {
        const d1 = 0.8, d2 = 0.3;
        const det = (1 - v.a11) * (1 - v.a22) - v.a12 * v.a21;
        const L = [[(1 - v.a22) / det, v.a12 / det], [v.a21 / det, (1 - v.a11) / det]];
        const x1 = L[0][0] * v.y1 + L[0][1] * v.y2, x2 = L[1][0] * v.y1 + L[1][1] * v.y2;
        const m1 = d1 * L[0][0] + d2 * L[1][0], m2 = d1 * L[0][1] + d2 * L[1][1];
        return `<div class="small">L = (I − A)⁻¹ = </div>${mat([[L[0][0], L[0][1]], [L[1][0], L[1][1]]])}
          <dl class="kv mt"><dt>Produktion x₁, x₂</dt><dd>${U.num(x1, 1)} / ${U.num(x2, 1)} Mio. CHF</dd><dt>Emissionen e = d·x</dt><dd>${U.num(d1 * x1 + d2 * x2, 1)} kt CO₂</dd><dt>Direkte Intensität d</dt><dd>0.80 / 0.30 kg CO₂/CHF</dd><dt>Gesamtintensität d·L</dt><dd>${U.num(m1, 3)} / ${U.num(m2, 3)} kg CO₂/CHF</dd></dl>
          <div class="tiny muted mt">Gesamtintensität (Multiplikator) = Emission pro CHF Endnachfrage inkl. aller Vorketten. Genau so rechnet die spend-based Scope-3-Analyse (Swisscom): Ausgaben × Intensität.</div>`;
      },
    });
  });

  // 12 ─────────────────────────────────────────── scope calculator
  def('scopes', 'Scope-Rechner für eine Firma (Übungswerte)', 'Trage Verbrauchsdaten ein. Die App ordnet die Emissionen Scope 1, 2 und 3 zu. Scope 2 wird location-based und market-based gezeigt. Emissionsfaktoren sind gerundete Übungswerte.', (el) => {
    const f = (k, l, v) => `<label class="small">${l}<br><input type="number" data-k="${k}" value="${v}" class="field" style="width:100%"></label>`;
    const top = '<div class="grid two">' + f('oil', 'Heizöl [l/a]', 20000) + f('gas', 'Erdgas [kWh/a]', 0) + f('diesel', 'Diesel Firmenfahrzeuge [l/a]', 8000) + f('el', 'Strom [kWh/a]', 400000) + f('green', 'davon mit Herkunftsnachweis erneuerbar [%]', 50) + f('fly', 'Geschäftsflüge [Personen-km/a]', 300000) + f('comm', 'Pendeln mit Auto [Personen-km/a]', 250000) + f('buy', 'Einkauf Güter & Dienstleistungen [CHF/a]', 3000000) + '</div>';
    panel(el, {
      top,
      out: (v) => {
        const s1 = (v.oil * 2.65 + v.gas * 0.2 + v.diesel * 2.65) / 1000;
        const s2loc = (v.el * 0.1) / 1000, s2mkt = (v.el * (1 - v.green / 100) * 0.3 + v.el * (v.green / 100) * 0.01) / 1000;
        const c3 = (v.oil * 0.55 + v.gas * 0.03 + v.diesel * 0.6 + v.el * 0.02) / 1000;
        const c1 = (v.buy * 0.25) / 1000, c6 = (v.fly * 0.18) / 1000, c7 = (v.comm * 0.17) / 1000;
        const s3 = c1 + c3 + c6 + c7, tot = s1 + s2loc + s3;
        return CH.bars([{ label: 'Scope 1', value: s1, cls: 'o' }, { label: 'Scope 2 (location)', value: s2loc, cls: 'y' }, { label: 'Scope 2 (market)', value: s2mkt, cls: 'y' }, { label: 'S3 cat. 1 Einkauf', value: c1, cls: 'n' }, { label: 'S3 cat. 3 Energie-Vorkette', value: c3, cls: 'n' }, { label: 'S3 cat. 6 Flüge', value: c6, cls: 'n' }, { label: 'S3 cat. 7 Pendeln', value: c7, cls: 'n' }], { labelW: 130, dec: 1, axis: 't CO₂-eq pro Jahr' }) +
          `<dl class="kv"><dt>Total (Scope 2 location-based)</dt><dd>${U.num(tot, 1)} t CO₂-eq</dd><dt>Anteil Scope 3</dt><dd>${U.pct(s3 / (tot || 1))}</dd></dl>
          <div class="tiny muted mt">Faktoren: Heizöl 2.65 kg/l (+0.55 Vorkette), Diesel 2.65 kg/l (+0.6), Erdgas 0.2 kg/kWh, Strom CH-Verbrauchermix 0.1 kg/kWh (location), Residualmix 0.3 / erneuerbar 0.01 (market), Flug 0.18 kg/pkm, Auto 0.17 kg/pkm, Einkauf 0.25 kg/CHF (EE-IO-Mittelwert). Vorketten der Energie gehören in Scope 3 Kat. 3, nicht in Scope 1/2!</div>`;
      },
    });
  });

  // 13 ─────────────────────────────────────────── indoor box model
  def('boxmodel', 'Innenraum-Konzentration: One-Box- und Two-Box-Modell', 'Steady state, gut durchmischter Raum: C = E / (ACH · V). Für den Arbeiter direkt an der Quelle zusätzlich die Near-Field-Erhöhung E/β.', (el) => {
    panel(el, {
      inputs: [
        { k: 'E', label: 'Emissionsrate E [mg/h]', min: 10, max: 5000, step: 10, v: 1000, dec: 0 },
        { k: 'V', label: 'Raumvolumen V [m³]', min: 20, max: 5000, step: 10, v: 500, dec: 0 },
        { k: 'ach', label: 'Luftwechselrate ACH [1/h]', min: 0.2, max: 10, step: 0.1, v: 2, dec: 1 },
        { k: 'b', label: 'Interzonaler Luftstrom β [m³/h]', min: 5, max: 500, step: 5, v: 50, dec: 0 },
        { k: 'lim', label: 'Grenzwert [mg/m³]', min: 0.1, max: 50, step: 0.1, v: 5, dec: 1 },
      ],
      out: (v) => {
        const Q = v.ach * v.V, cff = v.E / Q, cnf = cff + v.E / v.b;
        return `<dl class="kv"><dt>Q = ACH · V</dt><dd>${U.num(Q, 0)} m³/h</dd><dt>C (one-box / far field)</dt><dd>${U.num(cff, 3)} mg/m³ → RQ ${U.num(cff / v.lim, 2)}</dd><dt>C near field</dt><dd>${U.num(cnf, 3)} mg/m³ → RQ ${U.num(cnf / v.lim, 2)}</dd></dl>
          <div class="tiny muted mt">RQ = Konzentration / Grenzwert (analog PEC/PNEC); RQ &gt; 1 → Risiko. Das One-Box-Modell unterschätzt die Exposition nahe der Quelle.</div>`;
      },
    });
  });

  // 14 ─────────────────────────────────────────── growth
  def('growth', 'Wachstum & Verdopplungszeit', 'Faustregel: Verdopplungszeit ≈ 70 / Rate (in %). Braunschweig: „1 CHF zu Jesu Zeiten“ mit 2.5 % wäre heute ein Goldwürfel mit 54 km Kantenlänge.', (el) => {
    panel(el, {
      inputs: [
        { k: 'r', label: 'Wachstumsrate pro Jahr', min: 0.001, max: 0.08, step: 0.001, v: 0.025, fmt: (x) => U.pct(x, 1) },
        { k: 't', label: 'Zeitraum [Jahre]', min: 1, max: 200, step: 1, v: 100, dec: 0 },
      ],
      out: (v) => `<dl class="kv"><dt>Verdopplungszeit (exakt)</dt><dd>${U.num(Math.log(2) / Math.log(1 + v.r), 1)} Jahre</dd><dt>Faustregel 70/Rate</dt><dd>${U.num(70 / (v.r * 100), 1)} Jahre</dd><dt>Faktor nach ${v.t} Jahren</dt><dd>× ${U.sig(Math.pow(1 + v.r, v.t), 3)}</dd></dl>`,
    });
  });
})();
