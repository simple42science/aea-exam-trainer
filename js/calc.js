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
    const upd = () => {
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
  const mat = (rows, cls) => `<table style="width:auto;display:inline-table;margin:2px 6px 2px 0" class="${cls || ''}">${rows.map((r) => `<tr>${r.map((c) => `<td style="text-align:right;padding:2px 7px;border:0">${typeof c === 'number' ? U.sig(c, 3) : c}</td>`).join('')}</tr>`).join('')}</table>`;

  // 1 ─────────────────────────────────────────── matrix LCA
  def('matrix', 'Matrix LCA step by step (2 processes, 2 emissions)', 'Process 1 delivers the product (f = 1) and needs a units of product 2 from process 2. Change the values and watch how s, g and h respond.', (el) => {
    panel(el, {
      inputs: [
        { k: 'a', label: 'Input of product 2 into process 1 (a)', min: 0, max: 2, step: 0.05, v: 0.2 },
        { k: 'c1', label: 'CO₂ from process 1 [kg/unit]', min: 0, max: 2, step: 0.05, v: 0.5 },
        { k: 's1', label: 'SO₂ from process 1 [kg/unit]', min: 0, max: 1, step: 0.01, v: 0.1 },
        { k: 'c2', label: 'CO₂ from process 2 [kg/unit]', min: 0, max: 2, step: 0.05, v: 0.4 },
        { k: 's2', label: 'SO₂ from process 2 [kg/unit]', min: 0, max: 1, step: 0.01, v: 0.3 },
        { k: 'q', label: 'CF of SO₂ (Q, points/kg; CO₂ = 1)', min: 0, max: 5, step: 0.1, v: 2, dec: 1 },
      ],
      out: (v) => {
        const s = [1, v.a], g = [v.c1 + v.a * v.c2, v.s1 + v.a * v.s2], h = g[0] + v.q * g[1];
        return `<div class="small">A (rows = products, columns = processes; inputs negative) and A⁻¹:</div>${mat([[1, 0], [-v.a, 1]])} → ${mat([[1, 0], [v.a, 1]])}
          <div class="small mt">s = A⁻¹·f = [${U.sig(s[0])}; ${U.sig(s[1])}] → process 2 runs ${U.sig(v.a)} times per FU.</div>
          <div class="small">g = B·s = [CO₂ ${U.sig(g[0])} kg; SO₂ ${U.sig(g[1])} kg]</div>
          <div class="mt">h = Q·g = 1·${U.sig(g[0])} + ${U.sig(v.q)}·${U.sig(g[1])} = <b>${U.sig(h, 4)}</b> points per FU</div>
          <div class="tiny muted mt">If a is uncertain (e.g. lognormal), h = g(x₁ … xₖ) becomes a distribution → Monte Carlo.</div>`;
      },
    });
  });

  // 2 ─────────────────────────────────────────── allocation
  def('alloc', 'Allocation: mass vs. economic vs. energy (salmon processing)', 'Exam case HS16: 1 t of salmon yields 750 kg fillet, 150 kg cat food and 100 kg fish food. How much of the burden does the fillet carry?', (el) => {
    panel(el, {
      inputs: [
        { k: 'tot', label: 'Total burden per t salmon [kg CO₂-eq]', min: 500, max: 6000, step: 100, v: 3000, dec: 0 },
        { k: 'p1', label: 'Price of fillet [CHF/kg]', min: 5, max: 40, step: 1, v: 20, dec: 0 },
        { k: 'p2', label: 'Price of cat food [CHF/kg]', min: 0.5, max: 10, step: 0.5, v: 2, dec: 1 },
        { k: 'p3', label: 'Price of fish food [CHF/kg]', min: 0.2, max: 5, step: 0.1, v: 1, dec: 1 },
      ],
      out: (v) => {
        const m = [750, 150, 100], e = [8.5, 4, 15], p = [v.p1, v.p2, v.p3], names = ['Fillet', 'Cat food', 'Fish food'];
        const share = (w) => { const t = w.reduce((a, b) => a + b, 0); return w.map((x) => x / t); };
        const sm = share(m), se = share(m.map((x, i) => x * p[i])), sn = share(m.map((x, i) => x * e[i]));
        const perkg = (sh, i) => (v.tot * sh[i]) / m[i];
        let t = '<div class="tbl-wrap"><table><tr><th></th><th>Mass</th><th>Economic</th><th>Energy</th></tr>';
        names.forEach((n, i) => { t += `<tr><td>${n}</td><td>${U.pct(sm[i])}<br><span class="tiny">${U.num(perkg(sm, i))} kg/kg</span></td><td>${U.pct(se[i])}<br><span class="tiny">${U.num(perkg(se, i))} kg/kg</span></td><td>${U.pct(sn[i])}<br><span class="tiny">${U.num(perkg(sn, i))} kg/kg</span></td></tr>`; });
        t += '</table></div>';
        return t + CH.bars([{ label: 'Fillet – mass', value: perkg(sm, 0), cls: 'p' }, { label: 'Fillet – econ.', value: perkg(se, 0), cls: 'c' }, { label: 'Fillet – energy', value: perkg(sn, 0), cls: 'y' }], { dec: 2, axis: 'kg CO₂-eq per kg fillet' }) +
          '<div class="tiny muted">Energy content (exercise values): fillet 8.5, cat food 4, fish food 15 MJ/kg. ISO: first avoid (subdivision, system expansion: credit for the displaced fish meal or cat food), then physical, then economic.</div>';
      },
    });
  });

  // 3 ─────────────────────────────────────────── recycling approaches
  def('recycling', 'Recycling approaches: 10 kg of aluminium beverage cans', 'Frischknecht\'s exercise (fictive numbers): primary Al 7.5, recycling 0.4 (input and end of life), can production 1.2, use 0.2, landfill 0.1 kg CO₂-eq/kg. R1 = recycled content, R2 = recycling rate at end of life.', (el) => {
    panel(el, {
      inputs: [
        { k: 'r1', label: 'R1 – recycled content in the product', min: 0, max: 1, step: 0.05, v: 0.2, fmt: (x) => U.pct(x) },
        { k: 'r2', label: 'R2 – recycling rate at end of life', min: 0, max: 1, step: 0.05, v: 0.7, fmt: (x) => U.pct(x) },
        { k: 'ev', label: 'E_V primary Al [kg CO₂-eq/kg]', min: 2, max: 15, step: 0.1, v: 7.5, dec: 1 },
        { k: 'er', label: 'E_rec recycling [kg CO₂-eq/kg]', min: 0.1, max: 2, step: 0.05, v: 0.4 },
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
          { label: 'RC / cut-off', parts: [{ v: prim, cls: 'o', name: 'Primary Al' }, { v: recIn, cls: 'g', name: 'Recycled input' }, { v: mu, cls: 'n', name: 'Manufacture + use' }, { v: land, cls: 'y', name: 'Landfill' }] },
          { label: 'EOR', parts: [{ v: EOR_p, cls: 'o', name: 'Primary Al' }, { v: mu, cls: 'n', name: 'Manufacture + use' }, { v: EOR_rec, cls: 'b', name: 'EoL recycling' }, { v: land, cls: 'y', name: 'Landfill' }, { v: EOR_cr, cls: 'r', name: 'Credit' }] },
          { label: 'EPD A–C', parts: [{ v: prim, cls: 'o' }, { v: recIn, cls: 'g' }, { v: mu, cls: 'n' }, { v: land, cls: 'y' }] },
          { label: 'EPD A–D', parts: [{ v: prim, cls: 'o' }, { v: recIn, cls: 'g' }, { v: mu, cls: 'n' }, { v: land, cls: 'y' }, { v: Math.max(0, m * (v.r2 - v.r1) * v.er), cls: 'b' }, { v: Math.min(0, -m * (v.r2 - v.r1) * v.ev), cls: 'r' }, { v: Math.max(0, -m * (v.r2 - v.r1) * v.ev), cls: 'o' }, { v: Math.min(0, m * (v.r2 - v.r1) * v.er), cls: 'g' }] },
          { label: 'PEF 50:50', parts: [{ v: PEF_p, cls: 'o' }, { v: PEF_ri, cls: 'g' }, { v: mu, cls: 'n' }, { v: PEF_rec, cls: 'b' }, { v: land, cls: 'y' }, { v: PEF_cr, cls: 'r' }] },
        ];
        return CH.stack(rows, { dec: 1 }) +
          `<dl class="kv mt"><dt>RC (cut-off)</dt><dd>${U.num(RC, 1)} kg CO₂-eq</dd><dt>EOR (avoided burden)</dt><dd>${U.num(EOR, 1)}</dd><dt>EN 15804: A–C | D</dt><dd>${U.num(RC, 1)} | ${U.num(D, 1)} (sum ${U.num(RC + D, 1)})</dd><dt>PEF 50:50 (simplified)</dt><dd>${U.num(PEF, 1)}</dd></dl>
          <div class="tiny muted mt">Formulas: RC = m[(1−R1)E_V + R1·E_rec] + m(1.2+0.2) + m(1−R2)E_D · EOR = m·E_V + … + m·R2(E_rec,EoL − E*_V) + m(1−R2)E_D (recycled input is charged as primary = offsetting position) · module D = m(R2−R1)(E_rec,EoL − E*_V) · PEF simplified here, without quality factors and energy recovery. The vertical stroke marks the net result.</div>`;
      },
    });
  });

  // 4 ─────────────────────────────────────────── pedigree
  def('pedigree', 'Pedigree matrix → geometric standard deviation', 'When only one data point exists: score the data quality (1 = very good … 5 = poor), combine the uncertainty factors and derive a lognormal distribution.', (el) => {
    const F = { rel: [1, 1.05, 1.1, 1.2, 1.5], com: [1, 1.02, 1.05, 1.1, 1.2], tem: [1, 1.03, 1.1, 1.2, 1.5], geo: [1, 1.01, 1.02, 1.05, 1.1], tec: [1, 1.1, 1.2, 1.5, 2] };
    const lab = { rel: 'Reliability', com: 'Completeness', tem: 'Temporal correlation (age)', geo: 'Geographical correlation', tec: 'Further technological correlation' };
    const desc = { rel: ['verified measurement', 'verified, partly assumptions', 'non-verified, partly assumptions', 'qualified estimate', 'non-qualified estimate'], com: ['all sites, adequate period', '> 50 % of sites', '< 50 % of sites', 'one site', 'unknown'], tem: ['< 3 years', '< 6 years', '< 10 years', '< 15 years', '> 15 years / unknown'], geo: ['same area', 'larger area incl. study area', 'similar conditions', 'slightly similar conditions', 'unknown / very different'], tec: ['same companies & technology', 'same technology, other companies', 'different technology', 'related processes (lab scale)', 'related processes, other technology'] };
    let top = '<div class="grid two">';
    Object.keys(F).forEach((k) => { top += `<label class="small">${lab[k]}<br><select data-k="${k}" class="field" style="width:100%">${F[k].map((f, i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${i + 1} – ${desc[k][i]} (U=${f})</option>`).join('')}</select></label>`; });
    top += '<label class="small">Basic uncertainty U_b<br><select data-k="ub" class="field" style="width:100%"><option value="1.05" selected>1.05 – energy/material demand, CO₂ (combustion)</option><option value="1.5">1.5 – SO₂, NOₓ, land occupation</option><option value="2">2.0 – transport (tkm), land transformation, CH₄ (agriculture)</option><option value="3">3.0 – infrastructure, PM2.5, heavy metals to water</option><option value="5">5.0 – CO, heavy metals to air, PAH</option></select></label>';
    top += '<label class="small">Median value (e.g. kWh)<br><input type="number" data-k="med" value="100" class="field" style="width:100%"></label></div>';
    panel(el, {
      top,
      out: (v) => {
        const u = ['rel', 'com', 'tem', 'geo', 'tec'].map((k) => F[k][v[k]]);
        const sum = Math.pow(Math.log(v.ub), 2) + u.reduce((a, x) => a + Math.pow(Math.log(x), 2), 0);
        const gsd2 = Math.exp(Math.sqrt(sum)), sig = 0.5 * Math.sqrt(sum), gsd = Math.exp(sig);
        const med = v.med || 0;
        return `<div class="formula">GSD² = exp(√[(ln U_b)² + Σ (ln U_i)²]) = <b>${U.num(gsd2, 3)}</b></div>
          <dl class="kv"><dt>σ (of ln x, for the Activity Browser)</dt><dd>${U.num(sig, 4)}</dd><dt>GSD</dt><dd>${U.num(gsd, 3)}</dd><dt>95 % interval</dt><dd>${U.sig(med / gsd2)} … ${U.sig(med * gsd2)}</dd></dl>
          <div class="tiny muted mt">Interpretation: with 95 % probability the true value lies between median/GSD² and median·GSD². Pedigree = characterization (step 1); Monte Carlo then does the propagation.</div>`;
      },
    });
  });

  // 5 ─────────────────────────────────────────── Monte Carlo
  def('montecarlo', 'Monte Carlo: comparing A vs. B (independent vs. dependent sampling)', 'Both products use electricity with the same uncertain emission factor (triangular 0.1/0.4/0.8 kg CO₂/kWh). A: 10 kWh + specific part (median 3), B: 14 kWh + specific part (median 1.5). Because A and B share the electricity factor, it must be drawn identically in each run.', (el) => {
    panel(el, {
      inputs: [
        { k: 'n', label: 'Number of runs N', min: 100, max: 5000, step: 100, v: 1000, dec: 0 },
        { k: 'g', label: 'GSD of the specific parts', min: 1.05, max: 2.5, step: 0.05, v: 1.4 },
      ],
      mid: '<button class="btn sm sec mt" data-act="rerun">🎲 run again</button>',
      out: (v) => {
        const tri = (a, c, b) => { const u = Math.random(), fc = (c - a) / (b - a); return u < fc ? a + Math.sqrt(u * (b - a) * (c - a)) : b - Math.sqrt((1 - u) * (b - a) * (b - c)); };
        const ln = (med, gsd) => Math.exp(Math.log(med) + Math.log(gsd) * U.randn());
        const N = v.n, Ad = [], Bd = [];
        let pi = 0, pd = 0;
        for (let i = 0; i < N; i++) {
          const ef1 = tri(0.1, 0.4, 0.8), ef2 = tri(0.1, 0.4, 0.8), xa = ln(3, v.g), xb = ln(1.5, v.g);
          const ai = 10 * ef1 + xa, bi = 14 * ef2 + xb, ad = 10 * ef1 + xa, bd = 14 * ef1 + xb;
          Ad.push(ad); Bd.push(bd);
          if (ai < bi) pi++;
          if (ad < bd) pd++;
        }
        const st = (arr) => { const s = arr.slice().sort((a, b) => a - b); const mean = s.reduce((a, b) => a + b, 0) / s.length; return { mean, lo: U.quantile(s, 0.025), hi: U.quantile(s, 0.975) }; };
        const sa = st(Ad), sb = st(Bd), diff = Ad.map((a, i) => Bd[i] - a);
        const all = Ad.concat(Bd), lo = Math.min(...all), hi = Math.max(...all);
        return `<div class="small"><b>A</b>: mean ${U.num(sa.mean)}, 95 % [${U.num(sa.lo)} … ${U.num(sa.hi)}] · <b>B</b>: mean ${U.num(sb.mean)}, 95 % [${U.num(sb.lo)} … ${U.num(sb.hi)}]</div>` +
          '<div class="tiny muted mt">Histogram A (teal) and B (violet):</div>' + CH.hist(Ad, { min: lo, max: hi, cls: 'p', h: 90 }) + CH.hist(Bd, { min: lo, max: hi, cls: 'c', h: 90 }) +
          '<div class="tiny muted">Difference B − A per run (dependent sampling):</div>' + CH.hist(diff, { cls: 'g', h: 90, marks: [{ v: 0, label: '0' }] }) +
          `<dl class="kv mt"><dt>P(A &lt; B), independent sampling</dt><dd>${U.pct(pi / N)}</dd><dt>P(A &lt; B), dependent sampling</dt><dd>${U.pct(pd / N)}</dd></dl>
          <div class="tiny muted mt">The 95 % intervals of A and B overlap strongly. Still, A is better in most runs once the shared uncertainty (electricity factor) is coupled correctly. That is why you analyse differences or ratios.</div>`;
      },
    });
    el.addEventListener('click', (e) => { if (e.target.dataset.act === 'rerun') el.dispatchEvent(new Event('input')); });
  });

  // 6 ─────────────────────────────────────────── eco-factor
  def('ecofactor', 'Eco-factor (method of ecological scarcity)', 'EF = K · (1 UBP / Fₙ) · (F / F_k)² · c. Default: NOₓ in Switzerland (UBP 2021). Watch how strongly the weighting reacts when the current flow exceeds the critical flow.', (el) => {
    panel(el, {
      inputs: [
        { k: 'F', label: 'Current flow F [t/a]', min: 10000, max: 150000, step: 500, v: 70733, dec: 0 },
        { k: 'Fk', label: 'Critical flow F_k [t/a]', min: 10000, max: 150000, step: 500, v: 46518, dec: 0 },
        { k: 'e', label: 'Emissions of a company [kg NOₓ/a]', min: 0, max: 5000, step: 50, v: 800, dec: 0 },
      ],
      out: (v) => {
        const Fn = v.F * 1000, ef = (1 / Fn) * Math.pow(v.F / v.Fk, 2) * 1e12;
        return `<div class="formula">(F/F_k)² = ${U.num(Math.pow(v.F / v.Fk, 2), 3)} · EF = <b>${U.num(ef, 0)} UBP/kg</b></div>
          <dl class="kv"><dt>Environmental impact of the company</dt><dd>${U.num((ef * v.e) / 1e6, 2)} million UBP/a</dd><dt>EF once F = F_k is reached</dt><dd>${U.num((1 / (v.Fk * 1000)) * 1e12, 0)} UBP/kg</dd></dl>
          <div class="tiny muted mt">Here Fₙ = F (reference area Switzerland). Slide value for NOₓ: 33,000 UBP/kg. The critical flow comes from policy (e.g. ozone limits) → the weighting reflects Swiss environmental policy, not "natural science".</div>`;
      },
    });
  });

  // 7 ─────────────────────────────────────────── LCC compressors
  def('lcc', 'Life cycle costing: three compressors (case Stoffel AG)', '10 kW of cooling are needed, 24 h × 365 days. The FE18 delivers 13 kW of cooling at 10 kW electric → for 10 kW of cooling it needs only 10 × 10/13 ≈ 7.7 kW (Braunschweig\'s hint). Optional: external costs of CO₂ from electricity and refrigerant leakage.', (el) => {
    panel(el, {
      inputs: [
        { k: 'pe', label: 'Electricity price [CHF/kWh]', min: 0.05, max: 0.4, step: 0.01, v: 0.15 },
        { k: 'n', label: 'Lifetime [years]', min: 5, max: 20, step: 1, v: 10, dec: 0 },
        { k: 'r', label: 'Discount rate', min: 0, max: 0.08, step: 0.005, v: 0, fmt: (x) => U.pct(x, 1) },
        { k: 'co2', label: 'CO₂ price for external costs [CHF/t]', min: 0, max: 250, step: 10, v: 0, dec: 0 },
        { k: 'ef', label: 'Electricity emission factor [kg CO₂/kWh]', min: 0.02, max: 0.6, step: 0.01, v: 0.1 },
      ],
      out: (v) => {
        const M = [['FE12', 7300, 10, 13, 110, 3922], ['FE18', 14200, 13, 10, 100, 3922], ['PBa', 9100, 10, 8, 120, 3985]];
        const af = v.r > 0 ? (1 - Math.pow(1 + v.r, -v.n)) / v.r : v.n;
        const k = (x) => U.num(x / 1000, 1);
        let t = '<div class="tbl-wrap"><table><tr><th>kCHF</th><th>Inv.</th><th>Power</th><th>Refr.</th><th>Market</th><th>ext.</th><th>Env.</th></tr>';
        const rows = [], exact = [];
        M.forEach(([n, price, cap, pel, ref, gwp]) => {
          const pEff = pel * (10 / cap), kwhA = pEff * 8760, el1 = kwhA * v.pe * af, refC = (ref * 50 / v.n) * af;
          const mk = price + el1 + refC;
          const ext = ((kwhA * v.n * v.ef) / 1000 + (ref * gwp) / 1000) * v.co2;
          t += `<tr><td><b>${n}</b><br><span class="tiny">${U.num(pEff, 1)} kW</span></td><td>${k(price)}</td><td>${k(el1)}</td><td>${k(refC)}</td><td><b>${k(mk)}</b></td><td>${k(ext)}</td><td><b>${k(mk + ext)}</b></td></tr>`;
          rows.push({ label: n, parts: [{ v: price, cls: 'o', name: 'Investment' }, { v: el1, cls: 'b', name: 'Electricity' }, { v: refC, cls: 'y', name: 'Refrigerant' }, { v: ext, cls: 'g', name: 'External costs' }] });
          exact.push(`${n} ${U.num(mk, 0)} CHF`);
        });
        t += '</table></div>';
        return t + `<div class="small">Market LCC exact: ${exact.join(' · ')}</div>` + CH.stack(rows, { dec: 0 }) + `<div class="tiny muted">Market = total cost of ownership; Env. = market + external costs. Annuity factor = ${U.num(af, 2)} (equals the lifetime at 0 %). Refrigerants: R404A (GWP 3,922) or R507A (GWP 3,985); assumption: refilled amount = leakage. Key message: for "active products" the use phase dominates; the purchase price is almost irrelevant or even misleading.</div>`;
      },
    });
  });

  // 8 ─────────────────────────────────────────── water scarcity footprint
  def('water', 'Water scarcity footprint (AWARE): rice from three countries', 'Water scarcity footprint = water consumption × AWARE CF (0.1 to 100). Exercise from Task 4: compare national averages with growing regions.', (el) => {
    const R = [['USA', 'Arkansas South', 0.15], ['USA', 'Arkansas North', 2.66], ['USA', 'USA average', 36.5], ['China', 'Yellow River', 90.58], ['China', 'Southern region', 0.49], ['China', 'China average', 45.5], ['India', 'Ganges', 13.82], ['India', 'Central India', 2.22], ['India', 'India average', 29.9]];
    panel(el, {
      inputs: [
        { k: 'us', label: 'Consumption USA [m³/kg rice]', min: 0.02, max: 1, step: 0.01, v: 0.08 },
        { k: 'cn', label: 'Consumption China [m³/kg rice]', min: 0.02, max: 1, step: 0.01, v: 0.46 },
        { k: 'in', label: 'Consumption India [m³/kg rice]', min: 0.02, max: 1, step: 0.01, v: 0.78 },
      ],
      out: (v) => {
        const c = { USA: v.us, China: v.cn, India: v.in };
        const rows = R.map(([land, reg, cf]) => ({ label: reg, value: c[land] * cf, cls: reg.includes('average') ? 'n' : land === 'USA' ? 'b' : land === 'China' ? 'r' : 'o' }));
        return CH.bars(rows, { labelW: 104, dec: 2, axis: 'm³ world-eq per kg rice' }) + '<div class="tiny muted">Grey = national average. The differences within a country (Yellow River vs. southern region: factor ~185 in the CF) are larger than between the national averages → regionalization is decisive. The LCI varies too: the dry Yellow River area needs more irrigation than the rainy south.</div>';
      },
    });
  });

  // 9 ─────────────────────────────────────────── GWP time horizon
  def('gwp', 'Time horizon as a value choice (ReCiPe perspectives)', 'Option A emits more methane, option B more CO₂. Depending on the time horizon the ranking flips. CH₄: I 84 · H 34 · E 4.8; N₂O: I 264 · H 298 · E 78.8 kg CO₂-eq/kg (ReCiPe 2016).', (el) => {
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
          txt += `<dt>${n}</dt><dd>A ${U.num(a, 0)} vs. B ${U.num(b, 0)} → ${a < b ? 'A better' : a > b ? 'B better' : 'equal'}</dd>`;
        });
        return CH.bars(rows, { labelW: 104, dec: 0, axis: 'kg CO₂-eq' }) + `<dl class="kv mt">${txt}</dl><div class="tiny muted mt">Short-lived CH₄ (≈ 12 a) counts much more with a short time horizon. Disclose the value choice and show the sensitivity.</div>`;
      },
    });
  });

  // 10 ─────────────────────────────────────────── MCDA
  def('mcda', 'MCDA: heating system for new buildings (weighted sum)', 'Linear value functions (best value = 1, worst = 0). Move the weights and see when the ranking flips (sensitivity analysis).', (el) => {
    panel(el, {
      inputs: [
        { k: 'wc', label: 'Weight: cost', min: 0, max: 1, step: 0.05, v: 0.5 },
        { k: 'we', label: 'Weight: CO₂', min: 0, max: 1, step: 0.05, v: 0.4 },
        { k: 'wr', label: 'Weight: reliability', min: 0, max: 1, step: 0.05, v: 0.1 },
      ],
      out: (v) => {
        const O = [['A gas', 1200, 2500, 4], ['B heat pump', 1000, 500, 3], ['C wood pellets', 900, 1000, 2]];
        const sw = v.wc + v.we + v.wr || 1, w = [v.wc / sw, v.we / sw, v.wr / sw];
        const vf = (x, best, worst) => (best === worst ? 1 : (x - worst) / (best - worst));
        const sc = O.map(([n, c, e, r]) => [n, w[0] * vf(c, 900, 1200) + w[1] * vf(e, 500, 2500) + w[2] * vf(r, 4, 2)]);
        const best = sc.slice().sort((a, b) => b[1] - a[1])[0][0];
        return `<div class="tbl-wrap"><table><tr><th>Option</th><th>CHF/a</th><th>kg CO₂/a</th><th>Reliab. (1–5)</th></tr>${O.map((o) => `<tr><td>${o[0]}</td><td>${o[1]}</td><td>${o[2]}</td><td>${o[3]}</td></tr>`).join('')}</table></div>` +
          CH.bars(sc.map(([n, s]) => ({ label: n, value: s, cls: n === best ? 'g' : 'n' })), { labelW: 96, dec: 3, axis: 'total value V = Σ wᵢ·vᵢ' }) +
          `<div class="small">Normalized weights: cost ${U.pct(w[0])}, CO₂ ${U.pct(w[1])}, reliability ${U.pct(w[2])} → best option: <b>${best}</b></div>`;
      },
    });
  });

  // 11 ─────────────────────────────────────────── Leontief
  def('leontief', 'Leontief model with 2 sectors (EE-IO)', 'x = (I − A)⁻¹ y and emissions e = d · x. The Leontief inverse contains all supply rounds, so the total intensity is larger than the direct one.', (el) => {
    panel(el, {
      inputs: [
        { k: 'a11', label: 'a₁₁ agriculture bought by agriculture [CHF/CHF]', min: 0, max: 0.5, step: 0.01, v: 0.1 },
        { k: 'a12', label: 'a₁₂ agriculture bought by industry', min: 0, max: 0.5, step: 0.01, v: 0.2 },
        { k: 'a21', label: 'a₂₁ industry bought by agriculture', min: 0, max: 0.5, step: 0.01, v: 0.15 },
        { k: 'a22', label: 'a₂₂ industry bought by industry', min: 0, max: 0.5, step: 0.01, v: 0.3 },
        { k: 'y1', label: 'Final demand agriculture y₁ [M CHF]', min: 0, max: 500, step: 10, v: 100, dec: 0 },
        { k: 'y2', label: 'Final demand industry y₂ [M CHF]', min: 0, max: 500, step: 10, v: 200, dec: 0 },
      ],
      out: (v) => {
        const d1 = 0.8, d2 = 0.3;
        const det = (1 - v.a11) * (1 - v.a22) - v.a12 * v.a21;
        const L = [[(1 - v.a22) / det, v.a12 / det], [v.a21 / det, (1 - v.a11) / det]];
        const x1 = L[0][0] * v.y1 + L[0][1] * v.y2, x2 = L[1][0] * v.y1 + L[1][1] * v.y2;
        const m1 = d1 * L[0][0] + d2 * L[1][0], m2 = d1 * L[0][1] + d2 * L[1][1];
        return `<div class="small">L = (I − A)⁻¹ = </div>${mat([[L[0][0], L[0][1]], [L[1][0], L[1][1]]])}
          <dl class="kv mt"><dt>Output x₁, x₂</dt><dd>${U.num(x1, 1)} / ${U.num(x2, 1)} M CHF</dd><dt>Emissions e = d·x</dt><dd>${U.num(d1 * x1 + d2 * x2, 1)} kt CO₂</dd><dt>Direct intensity d</dt><dd>0.80 / 0.30 kg CO₂/CHF</dd><dt>Total intensity d·L</dt><dd>${U.num(m1, 3)} / ${U.num(m2, 3)} kg CO₂/CHF</dd></dl>
          <div class="tiny muted mt">Total intensity (multiplier) = emissions per CHF of final demand incl. all upstream chains. This is exactly how a spend-based Scope 3 analysis works (Swisscom): spending × intensity.</div>`;
      },
    });
  });

  // 12 ─────────────────────────────────────────── scope calculator
  def('scopes', 'Scope calculator for a company (exercise values)', 'Enter activity data. The calculator assigns the emissions to Scopes 1, 2 and 3 and shows Scope 2 both location-based and market-based. Emission factors are rounded exercise values.', (el) => {
    const f = (k, l, v) => `<label class="small">${l}<br><input type="number" data-k="${k}" value="${v}" class="field" style="width:100%"></label>`;
    const top = '<div class="grid two">' + f('oil', 'Heating oil [l/a]', 20000) + f('gas', 'Natural gas [kWh/a]', 0) + f('diesel', 'Diesel for company vehicles [l/a]', 8000) + f('el', 'Electricity [kWh/a]', 400000) + f('green', 'of which with renewable certificates [%]', 50) + f('fly', 'Business flights [person-km/a]', 300000) + f('comm', 'Commuting by car [person-km/a]', 250000) + f('buy', 'Purchased goods & services [CHF/a]', 3000000) + '</div>';
    panel(el, {
      top,
      out: (v) => {
        const s1 = (v.oil * 2.65 + v.gas * 0.2 + v.diesel * 2.65) / 1000;
        const s2loc = (v.el * 0.1) / 1000, s2mkt = (v.el * (1 - v.green / 100) * 0.3 + v.el * (v.green / 100) * 0.01) / 1000;
        const c3 = (v.oil * 0.55 + v.gas * 0.03 + v.diesel * 0.6 + v.el * 0.02) / 1000;
        const c1 = (v.buy * 0.25) / 1000, c6 = (v.fly * 0.18) / 1000, c7 = (v.comm * 0.17) / 1000;
        const s3 = c1 + c3 + c6 + c7, tot = s1 + s2loc + s3;
        return CH.bars([{ label: 'Scope 1', value: s1, cls: 'o' }, { label: 'Scope 2 (location)', value: s2loc, cls: 'y' }, { label: 'Scope 2 (market)', value: s2mkt, cls: 'y' }, { label: 'S3 cat. 1 purchases', value: c1, cls: 'n' }, { label: 'S3 cat. 3 energy upstr.', value: c3, cls: 'n' }, { label: 'S3 cat. 6 flights', value: c6, cls: 'n' }, { label: 'S3 cat. 7 commuting', value: c7, cls: 'n' }], { labelW: 130, dec: 1, axis: 't CO₂-eq per year' }) +
          `<dl class="kv"><dt>Total (Scope 2 location-based)</dt><dd>${U.num(tot, 1)} t CO₂-eq</dd><dt>Share of Scope 3</dt><dd>${U.pct(s3 / (tot || 1))}</dd></dl>
          <div class="tiny muted mt">Factors: heating oil 2.65 kg/l (+0.55 upstream), diesel 2.65 kg/l (+0.6), natural gas 0.2 kg/kWh, Swiss consumer mix 0.1 kg/kWh (location), residual mix 0.3 / renewable 0.01 (market), flight 0.18 kg/pkm, car 0.17 kg/pkm, purchases 0.25 kg/CHF (EE-IO average). Upstream emissions of fuels belong to Scope 3 category 3, not to Scope 1/2!</div>`;
      },
    });
  });

  // 13 ─────────────────────────────────────────── indoor box model
  def('boxmodel', 'Indoor concentration: one-box and two-box model', 'Steady state, well-mixed room: C = E / (ACH · V). For the worker right at the source add the near-field increase E/β.', (el) => {
    panel(el, {
      inputs: [
        { k: 'E', label: 'Emission rate E [mg/h]', min: 10, max: 5000, step: 10, v: 1000, dec: 0 },
        { k: 'V', label: 'Room volume V [m³]', min: 20, max: 5000, step: 10, v: 500, dec: 0 },
        { k: 'ach', label: 'Air exchange rate ACH [1/h]', min: 0.2, max: 10, step: 0.1, v: 2, dec: 1 },
        { k: 'b', label: 'Interzonal airflow β [m³/h]', min: 5, max: 500, step: 5, v: 50, dec: 0 },
        { k: 'lim', label: 'Limit value [mg/m³]', min: 0.1, max: 50, step: 0.1, v: 5, dec: 1 },
      ],
      out: (v) => {
        const Q = v.ach * v.V, cff = v.E / Q, cnf = cff + v.E / v.b;
        return `<dl class="kv"><dt>Q = ACH · V</dt><dd>${U.num(Q, 0)} m³/h</dd><dt>C (one-box / far field)</dt><dd>${U.num(cff, 3)} mg/m³ → RQ ${U.num(cff / v.lim, 2)}</dd><dt>C near field</dt><dd>${U.num(cnf, 3)} mg/m³ → RQ ${U.num(cnf / v.lim, 2)}</dd></dl>
          <div class="tiny muted mt">RQ = concentration / limit (analogous to PEC/PNEC); RQ &gt; 1 → risk. The one-box model underestimates the exposure close to the source.</div>`;
      },
    });
  });

  // 14 ─────────────────────────────────────────── growth
  def('growth', 'Growth & doubling time', 'Rule of thumb: doubling time ≈ 70 / rate (in %). Braunschweig: "1 CHF saved in Jesus\'s time" at 2.5 % would today be a gold cube with a side length of 54 km.', (el) => {
    panel(el, {
      inputs: [
        { k: 'r', label: 'Growth rate per year', min: 0.001, max: 0.08, step: 0.001, v: 0.025, fmt: (x) => U.pct(x, 1) },
        { k: 't', label: 'Period [years]', min: 1, max: 200, step: 1, v: 100, dec: 0 },
      ],
      out: (v) => `<dl class="kv"><dt>Doubling time (exact)</dt><dd>${U.num(Math.log(2) / Math.log(1 + v.r), 1)} years</dd><dt>Rule of 70</dt><dd>${U.num(70 / (v.r * 100), 1)} years</dd><dt>Factor after ${v.t} years</dt><dd>× ${U.sig(Math.pow(1 + v.r, v.t), 3)}</dd></dl>`,
    });
  });
})();
