/* AEA Coach – diagrams (inline SVG, tap elements with data-k for explanations) */
(function () {
  'use strict';
  const A = window.AEA, D = A.svg;
  const def = (id, title, caption, draw, info, extra) => { A.diagrams[id] = Object.assign({ id, title, caption, draw, info: info || {} }, extra); };
  const sub = (n) => String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[d]);
  const arc = (cx, cy, R, a1, a2) => {
    const p = (a) => [cx + R * Math.cos((a * Math.PI) / 180), cy + R * Math.sin((a * Math.PI) / 180)];
    const [x1, y1] = p(a1), [x2, y2] = p(a2);
    return `M${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${a2 - a1 > 180 ? 1 : 0},1 ${x2.toFixed(1)},${y2.toFixed(1)}`;
  };

  // 1 ─────────────────────────────────────────── LCA framework
  def('lca-framework', 'The 4 phases of LCA (ISO 14040)', 'Tap a phase. Interpretation is connected to all phases – LCA is iterative. Applications lie outside the LCA framework.', () => {
    let s = D.box(6, 6, 262, 288, '', { c: 'w', r: 12, dash: true });
    s += D.text(16, 23, 'Life cycle assessment framework', { fs: 10, bold: true, cls: 'lab' });
    s += D.box(18, 34, 150, 58, 'Goal and scope\ndefinition', { c: 'p', k: 'goal', bold: true, fs: 12 });
    s += D.box(18, 124, 150, 58, 'Inventory analysis\n(LCI)', { c: 'p', k: 'lci', bold: true, fs: 12 });
    s += D.box(18, 214, 150, 58, 'Impact assessment\n(LCIA)', { c: 'p', k: 'lcia', bold: true, fs: 12 });
    s += D.box(190, 34, 66, 238, 'Inter-\npre-\ntation', { c: 'c', k: 'interp', bold: true, fs: 12 });
    s += D.arrow(93, 94, 93, 122, { both: true }) + D.arrow(93, 184, 93, 212, { both: true });
    s += D.arrow(170, 63, 188, 63, { both: true }) + D.arrow(170, 153, 188, 153, { both: true }) + D.arrow(170, 243, 188, 243, { both: true });
    s += D.box(278, 64, 78, 178, 'Direct\napplications\n\n• Product\n  development\n• Strategic\n  planning\n• Public\n  policy\n• Marketing\n• Other', { c: 'n', k: 'apps', fs: 9.5, ta: 'start', top: true, bold: false, boldFirst: true });
    s += D.arrow(258, 153, 276, 153, { both: true });
    return D.svg(360, 300, s, 'LCA framework');
  }, {
    goal: '<b>Goal & scope:</b> purpose, intended audience, comparative assertion planned? Function, <b>functional unit</b>, reference flow, system boundaries (cradle-to-gate/-grave), cut-off criteria, allocation rules, LCIA method, data quality requirements, assumptions, limitations, critical review.',
    lci: '<b>Inventory analysis:</b> flowchart, data collection per process (inputs: materials, energy; outputs: products, emissions, waste), relating data to the FU, allocation of multifunctional processes. Foreground = primary data, background = databases (ecoinvent).',
    lcia: '<b>Impact assessment:</b> mandatory: selection of impact categories, indicators and models, classification, characterization. Optional: normalization, grouping, weighting (weighting must <b>not</b> be used for comparative assertions disclosed to the public).',
    interp: '<b>Interpretation:</b> accompanies all phases (iterative). Identify significant issues; completeness, sensitivity and consistency checks; conclusions, limitations, recommendations.',
    apps: '<b>Applications</b> (outside the LCA): product development / eco-design, strategic planning, public policy, marketing (EPDs, environmental claims).',
  });

  // 2 ─────────────────────────────────────────── product vs company view
  def('product-company', 'Product view vs. organisational view', 'The overview graph shown in both courses: a product life cycle runs horizontally through several companies, a company assessment cuts vertically through many life cycles. They overlap only partly.', () => {
    let s = D.text(6, 15, 'Product view → (a life cycle crosses several companies)', { fs: 9.6, bold: true, cls: 't-p' });
    [['Company A', 'n', 'compA', 66], ['Company B ("we")', 'c', 'compB', 160], ['Company C', 'n', 'compC', 254]].forEach(([t, c, k, x]) => {
      s += D.box(x, 24, 88, 210, '', { c, k, r: 10 });
      s += D.text(x + 44, 42, t, { fs: 9.4, a: 'middle', bold: true, cls: 't-' + c });
    });
    s += `<g class="hot" data-k="overlap"><rect x="160" y="91" width="88" height="27" rx="4" class="b-o" opacity=".9"/><text x="204" y="115" font-size="8.6" text-anchor="middle" class="t-o bold">overlap</text></g>`;
    [['Product 1', 104], ['Product 2', 152], ['Product n', 198]].forEach(([t, y]) => {
      s += D.box(2, y - 10, 60, 20, t, { c: 'p', fs: 9, k: 'lc', r: 5 });
      s += D.arrow(62, y, 354, y, { c: 'a' });
    });
    s += D.text(204, 228, 'Organisational view ↓', { fs: 8.8, a: 'middle', bold: true, cls: 't-c' });
    s += D.box(2, 244, 174, 52, 'Product view (LCA)\nISO 14040/44 · CF: ISO 14067\nEPD: ISO 14025 / EN 15804', { c: 'p', fs: 9.2, k: 'pv', boldFirst: true });
    s += D.box(184, 244, 174, 52, 'Organisational view\nEMS: ISO 14001 · GHG: 14064-1\nEcobalance: ISO/TS 14072', { c: 'c', fs: 9.2, k: 'ov', boldFirst: true });
    return D.svg(360, 300, s, 'Product vs company view');
  }, {
    lc: '<b>Product LCA (horizontal):</b> a life cycle runs through several companies (raw material → production → use → disposal). Reference: the <b>functional unit</b>.',
    compA: '<b>Company A = supplier.</b> From B\'s point of view: upstream Scope 3 (e.g. category 1, purchased goods).',
    compB: '<b>Company B = our organisation (vertical):</b> all activities in one period (usually a year) across all products. Reference: organisation × year. Tools: company ecobalance, GHG inventory (Scopes 1–3), EMS according to ISO 14001.',
    compC: '<b>Company C = customer, use, disposal.</b> From B\'s point of view: downstream Scope 3 (category 11 use of sold products, 12 end of life).',
    overlap: '<b>Only partial overlap!</b> Classic exam case of the banknotes: paper making and printing happen partly outside the national bank, and banknotes are only one of the bank\'s activities. To judge their relevance you need environmental data on <b>all</b> other activities (buildings, IT, travel, purchasing) and a suitable unit (CO₂-eq, UBP, MJ, costs).',
    pv: 'Product standards: ISO 14040/44 (LCA), ISO 14067 (carbon footprint of products), ISO 14025 + EN 15804 (EPD, type III), ISO 14046 (water footprint).',
    ov: 'Organisational standards: ISO 14001 (environmental management system), ISO 14064-1 or GHG Protocol (GHG inventory, Scopes 1–3), ISO/TS 14072 (organisational LCA), ISO 14031 (environmental performance evaluation).',
  });

  // 3 ─────────────────────────────────────────── GHG scopes
  def('scopes', 'GHG Protocol: Scope 1, 2, 3', 'Tap a scope. Scope 3 has 15 categories (8 upstream, 7 downstream) and is usually the largest part.', () => {
    let s = D.text(180, 13, 'GHG Protocol Corporate Standard / ISO 14064-1', { fs: 9.4, a: 'middle', cls: 'lab', bold: true });
    s += D.box(3, 22, 115, 208, 'Scope 3 – upstream\n1 Purchased goods\n2 Capital goods\n3 Fuel- & energy-rel.\n4 Transport (upstream)\n5 Waste generated\n6 Business travel\n7 Employee commuting\n8 Leased assets (up)', { c: 'n', fs: 8.4, ta: 'start', top: true, boldFirst: true, k: 's3u', pad: 6 });
    s += D.box(122, 22, 116, 208, '', { c: 'c', r: 10, k: 'co' });
    s += D.text(180, 38, 'Reporting company', { fs: 9.6, a: 'middle', bold: true, cls: 't-c' });
    s += D.box(129, 47, 102, 84, 'Scope 1 – direct\nheating fuels,\nown vehicles,\nprocess emissions,\nrefrigerant leaks', { c: 'o', fs: 8.6, boldFirst: true, k: 's1' });
    s += D.box(129, 139, 102, 84, 'Scope 2 – energy\nindirect:\npurchased\nelectricity, heat,\nsteam, cooling', { c: 'y', fs: 8.6, boldFirst: true, k: 's2' });
    s += D.box(242, 22, 115, 208, 'Scope 3 – downstream\n9 Transport (downstr.)\n10 Processing (sold)\n11 Use of sold products\n12 End-of-life (sold)\n13 Leased assets (down)\n14 Franchises\n15 Investments', { c: 'n', fs: 8.4, ta: 'start', top: true, boldFirst: true, k: 's3d', pad: 6 });
    s += D.arrow(10, 244, 350, 244, { c: 'a' });
    s += D.text(60, 260, 'upstream', { fs: 9.4, a: 'middle', cls: 'lab' }) + D.text(180, 260, 'own operations', { fs: 9.4, a: 'middle', cls: 'lab' }) + D.text(300, 260, 'downstream', { fs: 9.4, a: 'middle', cls: 'lab' });
    s += D.text(180, 278, 'Scope 3 = the "window to LCA" – usually the largest share', { fs: 9.4, a: 'middle', bold: true });
    return D.svg(360, 286, s, 'GHG scopes');
  }, {
    s1: '<b>Scope 1 – direct emissions</b> from sources the company owns or controls: heating oil and gas, own vehicles, process emissions, refrigerant leakage.',
    s2: '<b>Scope 2 – indirect energy emissions:</b> purchased electricity, heat, steam, cooling. Two methods: <b>location-based</b> (grid mix) and <b>market-based</b> (certificates, contracts). Report both (dual reporting).',
    s3u: '<b>Scope 3 upstream (categories 1–8):</b> purchased goods & services, capital goods, upstream fuel and energy, transport, waste, business travel, commuting, leased assets. Data often spend-based (EE-IO, e.g. Swisscom) or from LCA databases.',
    s3d: '<b>Scope 3 downstream (categories 9–15):</b> transport to customers, processing, <b>use of sold products</b> (dominant for cars and appliances), end of life, franchises, investments (dominant for banks: "financed emissions").',
    co: '<b>Organisational boundary:</b> equity share or control approach (financial or operational). Define a base year; targets (SBTi) for Scopes 1+2 and the relevant parts of Scope 3.',
  });

  // 4 ─────────────────────────────────────────── cause-effect chain
  def('cause-effect', 'From inventory to single score (midpoint → endpoint)', 'Tap an impact category for its unit and model. The further down, the easier to communicate – but the more uncertain and value-laden.', () => {
    let s = D.box(8, 6, 344, 40, 'Life cycle inventory (LCI): 1000s of elementary flows\nCO₂ · CH₄ · NOₓ · SO₂ · NH₃ · PM2.5 · Cd · pesticides · water · land', { c: 'n', fs: 9.3, boldFirst: true, k: 'lci' });
    s += D.text(180, 61, '▼ classification + characterization (mandatory)', { fs: 9, a: 'middle', cls: 'lab' });
    const mids = [['Climate change', 'cc'], ['Ozone depletion', 'od'], ['Photochem. ozone', 'pocp'], ['PM2.5 (fine dust)', 'pm'], ['Human toxicity', 'htox'], ['Ionising rad.', 'ion'], ['Acidification', 'acid'], ['Eutrophication', 'eutro'], ['Ecotoxicity', 'etox'], ['Land use', 'land'], ['Water use', 'water'], ['Resource use', 'res']];
    const pos = {};
    mids.forEach(([, k], i) => { const x = 8 + (i % 4) * 87, y = 68 + Math.floor(i / 4) * 32; pos[k] = [x + 41, y + 26]; });
    const ends = { HH: [62, 196], EQ: [180, 196], R: [298, 196] };
    const links = { cc: ['HH', 'EQ'], od: ['HH'], pocp: ['HH', 'EQ'], pm: ['HH'], htox: ['HH'], ion: ['HH'], acid: ['EQ'], eutro: ['EQ'], etox: ['EQ'], land: ['EQ'], water: ['HH', 'EQ'], res: ['R'] };
    Object.keys(links).forEach((k) => links[k].forEach((e) => { s += D.line(pos[k][0], pos[k][1], ends[e][0], ends[e][1], 'ln'); }));
    mids.forEach(([t, k], i) => { s += D.box(8 + (i % 4) * 87, 68 + Math.floor(i / 4) * 32, 82, 26, t, { c: 'p', fs: 8.8, k }); });
    s += D.text(180, 186, '▼ damage modelling', { fs: 9, a: 'middle', cls: 'lab' });
    s += D.box(8, 196, 108, 44, 'Human health\n[DALY]', { c: 'r', fs: 10, boldFirst: true, k: 'HH' });
    s += D.box(126, 196, 108, 44, 'Ecosystem quality\n[species·yr]', { c: 'g', fs: 10, boldFirst: true, k: 'EQ' });
    s += D.box(244, 196, 108, 44, 'Resources\n[USD surplus cost]', { c: 'y', fs: 10, boldFirst: true, k: 'R' });
    ['HH', 'EQ', 'R'].forEach((e) => { s += D.line(ends[e][0], 240, 180, 276, 'ln'); });
    s += D.text(180, 262, '▼ normalization · weighting (optional, value-based)', { fs: 9, a: 'middle', cls: 'lab' });
    s += D.box(70, 276, 220, 36, 'Single score (weighting)\nUBP · ReCiPe points · EF single score', { c: 'c', fs: 9.5, boldFirst: true, k: 'single' });
    s += D.text(180, 328, 'Midpoint: closer to the flow, less uncertain', { fs: 9, a: 'middle', cls: 'lab' });
    s += D.text(180, 341, 'Endpoint / single score: easier to communicate, more value choices', { fs: 9, a: 'middle', cls: 'lab' });
    return D.svg(360, 348, s, 'Cause-effect chain');
  }, {
    lci: 'Inventory: emissions and resource extractions per functional unit (elementary flows, often more than 1,000).',
    cc: '<b>Climate change</b>: kg CO₂-eq (GWP100, IPCC). Global – the emission location does not matter. Most important value choice: the time horizon (20/100/500 a).',
    od: '<b>Ozone depletion</b>: kg CFC-11-eq. More UV-B → skin cancer, cataract (human health).',
    pocp: '<b>Photochemical ozone formation</b> (summer smog): kg NMVOC-eq or NOₓ-eq. Respiratory effects (HH) and vegetation damage (EQ). Regional.',
    pm: '<b>Particulate matter</b>: primary PM2.5 and secondary PM from NOₓ, SO₂, NH₃ → disease cases or DALY. CF = fate × effect (or intake fraction × effect). Strongly regional: population density, stack height, weather.',
    htox: '<b>Human toxicity</b> (cancer / non-cancer): USEtox, CTUh = cases per kg. CF = FF × XF × EF.',
    ion: '<b>Ionising radiation</b>: kBq U235-eq → human health.',
    acid: '<b>Acidification</b>: mol H⁺-eq or kg SO₂-eq. Soils, lakes (EQ). Regional, because SO₂ and NOₓ are short-lived.',
    eutro: '<b>Eutrophication</b> (freshwater P, marine N, terrestrial): kg P-eq / N-eq. Algal blooms, oxygen depletion.',
    etox: '<b>Freshwater ecotoxicity</b>: USEtox, CTUe = PAF·m³·d per kg (potentially affected fraction of species).',
    land: '<b>Land use</b>: occupation (m²·a) and transformation (m²) → species loss via the species-area relationship. Strongly regional.',
    water: '<b>Water use</b>: water <b>consumption</b> (not withdrawal) × scarcity factor (AWARE 0.1–100) → m³ world-eq. HH (malnutrition) and EQ (wetlands). Strongly regional.',
    res: '<b>Resource use</b>: minerals and fossil resources, kg Sb-eq, MJ or surplus cost (USD).',
    HH: '<b>Human health</b>: DALY = YLL + YLD (years of life lost + years lived with disability). 1 DALY = one lost year of healthy life.',
    EQ: '<b>Ecosystem quality</b>: potentially disappeared species, PDF·m²·yr or species·yr.',
    R: '<b>Natural resources</b>: future extra costs of extraction (surplus cost, USD) or MJ surplus energy.',
    single: '<b>Single score</b>: weighting according to societal preferences (panels, policy targets: UBP = distance-to-target). Subjective, therefore <b>not</b> allowed by ISO 14044 for comparative assertions disclosed to the public.',
  });

  // 5 ─────────────────────────────────────────── climate change chain
  def('climate-chain', 'Cause-effect chain of climate change', 'A frequent exam question: the whole chain from emission to damage, including the level at which GWP and GTP sit.', () => {
    let s = '';
    const st = [[10, 'GHG emission\nkg CO₂, CH₄, N₂O …', 'em'], [72, 'Atmospheric concentration\nfate: CH₄ ≈ 12 a, CO₂ centuries', 'conc'], [134, 'Radiative forcing\n[W/m²]', 'rf'], [196, 'Temperature increase\n[°C]', 'temp']];
    st.forEach(([y, t, k], i) => { s += D.box(10, y, 200, 42, t, { c: 'p', fs: 9.6, boldFirst: true, k }); if (i < 3) s += D.arrow(110, y + 42, 110, y + 60); });
    s += D.arrow(60, 238, 60, 256) + D.arrow(160, 238, 160, 256);
    s += D.box(10, 258, 96, 62, 'Human health\n[DALY]\nmalnutrition,\nmalaria, heat', { c: 'r', fs: 9, boldFirst: true, k: 'hh' });
    s += D.box(114, 258, 96, 62, 'Ecosystems\n[species loss]\nshifting climate\nzones', { c: 'g', fs: 9, boldFirst: true, k: 'eq' });
    s += D.box(222, 10, 134, 108, 'Value choices\n• time horizon 20/100/500 a\n  (individualist / hierar-\n  chist / egalitarian)\n• climate-carbon feedback\n• adaptation, discounting', { c: 'o', fs: 8.6, ta: 'start', top: true, boldFirst: true, k: 'vc' });
    s += D.box(222, 128, 134, 54, 'GWP (midpoint)\n= ∫ RF over time horizon,\nrelative to CO₂', { c: 'c', fs: 8.8, boldFirst: true, k: 'gwp' });
    s += D.box(222, 190, 134, 54, 'GTP\n= ΔT at the end of the\ntime horizon, rel. to CO₂', { c: 'c', fs: 8.8, boldFirst: true, k: 'gtp' });
    s += D.box(222, 258, 134, 62, 'Endpoint (damage)\nmost uncertain; global\nemission effect, regionally\ndifferent impacts', { c: 'n', fs: 8.6, boldFirst: true, k: 'ep' });
    s += D.line(210, 155, 222, 155, 'ln') + D.line(210, 217, 222, 217, 'ln');
    return D.svg(360, 326, s, 'Climate change chain');
  }, {
    em: 'GHG emission in kg (inventory): CO₂, CH₄ (fossil/biogenic), N₂O, F-gases.',
    conc: '<b>Fate</b>: how long does the gas stay in the atmosphere? CH₄ about 12 years, N₂O about 110 years, CO₂ several decay terms (a part stays for centuries). The atmosphere is well mixed (one-box), so the emission location does not matter.',
    rf: '<b>Radiative forcing</b> in W/m²: additional energy per area caused by the higher concentration.',
    temp: 'Temperature increase (°C) as a consequence of radiative forcing (with the inertia of the oceans).',
    hh: 'Damage to human health in DALY: malnutrition, malaria, diarrhoeal diseases, heat stress, flooding.',
    eq: 'Damage to ecosystems: species loss (PDF·m²·yr or species·yr) through shifting climate zones.',
    vc: '<b>Value choices</b>: above all the <b>time horizon</b>. ReCiPe perspectives: individualist 20 a, hierarchist 100 a, egalitarian 1,000 a or infinite. CH₄: GWP20 ≈ 80, GWP100 ≈ 27–30 (IPCC AR6), so the time horizon can change rankings.',
    gwp: '<b>GWP</b> = radiative forcing of 1 kg of a gas integrated over the time horizon, relative to 1 kg of CO₂. Default: GWP100.',
    gtp: '<b>GTP</b> (global temperature change potential) = temperature change at the end of the time horizon, relative to CO₂. Closer to the damage, but more uncertain.',
    ep: 'Endpoint: most relevant, but most uncertain (climate models, adaptation, socio-economics).',
  });

  // 6 ─────────────────────────────────────────── allocation tree
  def('alloc-tree', 'ISO 14044: allocation hierarchy', 'Exact terms matter in the exam: "subdivision", "system expansion", "allocation based on physical relationships", "other relationships (economic)".', () => {
    let s = D.box(70, 6, 220, 36, 'Multifunctional process?\n(several co-products / functions)', { c: 'n', bold: true, fs: 10 });
    s += D.arrow(180, 42, 180, 56);
    s += D.box(8, 58, 344, 98, '', { c: 'g', r: 10, k: 's1' });
    s += D.text(18, 75, 'Step 1 – AVOID allocation (preferred)', { fs: 10.5, bold: true, cls: 't-g' });
    s += D.box(16, 84, 160, 64, '(a) Subdivision\n"increase the level of detail":\nsplit the process into\nsub-processes', { c: 'w', fs: 9, boldFirst: true, k: 'sub' });
    s += D.box(184, 84, 160, 64, '(b) System expansion\nexpand the product system\nto include the additional\nfunctions (substitution)', { c: 'w', fs: 9, boldFirst: true, k: 'se' });
    s += D.arrow(180, 156, 180, 174) + D.text(188, 169, 'not possible', { fs: 8.5, cls: 'lab', ital: true });
    s += D.box(8, 176, 344, 54, 'Step 2 – allocation based on PHYSICAL relationships\nmass, energy, exergy, protein … – reflecting how inputs/\noutputs change with quantitative changes in the products', { c: 'y', fs: 9.3, boldFirst: true, k: 's2' });
    s += D.arrow(180, 230, 180, 248) + D.text(188, 243, 'not possible', { fs: 8.5, cls: 'lab', ital: true });
    s += D.box(8, 250, 344, 44, 'Step 3 – allocation based on OTHER relationships\ne.g. economic value (price × quantity) of the co-products', { c: 'o', fs: 9.3, boldFirst: true, k: 's3' });
    s += D.box(8, 304, 344, 50, 'Always: Σ allocated = unallocated flows (100 %) · same rules for\nreuse/recycling · several plausible methods → sensitivity\nanalysis and document the choice', { c: 'n', fs: 8.8, k: 'rules' });
    return D.svg(360, 360, s, 'Allocation decision tree');
  }, {
    s1: '<b>Step 1: avoid allocation.</b> ISO prefers this, because every partitioning is a convention.',
    sub: '<b>Subdivision</b>: split the process into sub-processes that each deliver only one product (e.g. separate electricity metering per production line). Only possible if the processes are technically separable.',
    se: '<b>System expansion</b>: the system includes all functions (e.g. treatment of banknotes + electricity + steam) and is compared with a reference system delivering the same functions. Variant <b>substitution / avoided burden</b>: credit for the displaced product (e.g. marginal electricity, heat from natural gas). Data needed: amount of co-product per FU × burden of the displaced product.',
    s2: '<b>Physical relationships</b>: partition by mass, energy content, exergy or causally (how do inputs change when product quantities change?). Example milk/meat: protein or causal allocation (feed energy).',
    s3: '<b>Other relationships</b>, usually <b>economic</b> (revenue share = price × quantity). Reflects why the process is run, but fluctuates with prices and regions.',
    rules: 'The sum of the allocated flows must equal 100 %. Apply the same rules to reuse and recycling (ISO 14044 4.3.4.3). Document the choice transparently and run a sensitivity analysis with alternatives.',
  });

  // 7 ─────────────────────────────────────────── recycling approaches
  def('recycling', 'Recycling allocation: cut-off vs. avoided burden, EPD and PEF', 'RC books emissions when they occur (strong sustainability, precaution). EOR gives credits for future avoided primary production (weak sustainability, an "environmental loan" from the future).', () => {
    let s = '';
    const row = (y, items) => items.map(([x, w, t, c, k, dash]) => D.box(x, y, w, 30, t, { c, fs: 8.6, k, dash })).join('');
    s += D.text(8, 15, 'Recycled content / cut-off (RC)', { fs: 10.5, bold: true });
    s += D.text(352, 15, 'strong sustainability', { fs: 9, a: 'end', cls: 't-g', bold: true });
    s += row(22, [[8, 58, 'Primary\nmaterial', 'o', 'prim'], [70, 50, 'Manu-\nfacture', 'n'], [124, 40, 'Use', 'n']]);
    s += D.line(174, 18, 174, 58, 'ar ar-r dash') + D.text(174, 66, 'cut-off', { fs: 8.5, a: 'middle', cls: 't-r', bold: true });
    s += row(22, [[184, 56, 'Recycling', 'g', 'recRC'], [244, 48, 'Manu-\nfacture', 'n'], [296, 56, 'Use', 'n']]);
    s += D.text(86, 66, 'Product 1 (today)', { fs: 8.5, a: 'middle', cls: 'lab' }) + D.text(268, 66, 'Product 2 (future)', { fs: 8.5, a: 'middle', cls: 'lab' });
    s += D.text(8, 81, 'P1 carries primary production; scrap leaves burden-free, no credit.', { fs: 8.8 });
    s += D.text(8, 93, 'Recycling burden → product 2 (the user of the secondary material).', { fs: 8.8 });
    s += D.text(8, 121, 'End-of-life recycling / avoided burden (EOR)', { fs: 10.5, bold: true });
    s += D.text(352, 121, 'weak sustainability', { fs: 9, a: 'end', cls: 't-o', bold: true });
    s += row(128, [[8, 58, 'Primary\nmaterial', 'o'], [70, 50, 'Manu-\nfacture', 'n'], [124, 40, 'Use', 'n'], [168, 48, 'Recy-\ncling', 'g'], [220, 56, 'Credit:\n− primary', 'r', 'credit']]);
    s += D.line(282, 124, 282, 164, 'ar ar-r dash');
    s += row(128, [[288, 64, 'Primary\n(offsetting)', 'o', 'offset']]);
    s += D.text(142, 172, 'Product 1 (today)', { fs: 8.5, a: 'middle', cls: 'lab' }) + D.text(320, 172, 'Product 2', { fs: 8.5, a: 'middle', cls: 'lab' });
    s += D.text(8, 187, 'P1 is credited for the avoided future primary production →', { fs: 8.8 });
    s += D.text(8, 199, 'P2 must carry primary burdens ("environmental loan" from the future).', { fs: 8.8 });
    s += D.text(8, 222, 'EPD (EN 15804) and PEF', { fs: 10.5, bold: true });
    s += [[8, 62, 'A1–A3\nproduct', 'p'], [74, 56, 'A4–A5\nconstruct.', 'p'], [134, 54, 'B1–B7\nuse', 'p'], [192, 58, 'C1–C4\nend of life', 'p'], [256, 96, 'D: benefits &\nloads beyond', 'g', 'modD', true]].map(([x, w, t, c, k, d]) => D.box(x, 230, w, 34, t, { c, fs: 8.6, k, dash: d })).join('');
    s += D.text(8, 282, 'Module D = (R2 − R1) · (E_rec,EoL − E*v): only the NET', { fs: 8.8 });
    s += D.text(8, 294, 'secondary flow, reported SEPARATELY from modules A–C.', { fs: 8.8 });
    s += D.text(8, 310, 'PEF (Circular Footprint Formula): burdens/benefits shared between', { fs: 8.8 });
    s += D.text(8, 322, 'supplier and user of recycled material (A-factor 0.2–0.8; 2013: 50:50).', { fs: 8.8 });
    return D.svg(360, 330, s, 'Recycling allocation');
  }, {
    prim: 'Primary material (e.g. primary aluminium, 7.5–9.3 kg CO₂-eq/kg) is carried by the <b>first</b> user under the cut-off approach.',
    recRC: 'Under cut-off, the recycling process belongs to the product that <b>uses</b> the secondary material (recycled content). The scrap leaves product 1 without burdens and without credit.',
    credit: '<b>Credit (avoided burden):</b> recycling at end of life avoids future primary production, and the whole credit goes to product 1. Critique: today\'s emissions are "compensated away", the credit lies in the future (sunk impacts) and will probably be smaller because of decarbonization.',
    offset: '<b>Offsetting position:</b> under EOR, whoever uses secondary material has to carry primary burdens, because the predecessor already received the credit. Otherwise double counting.',
    modD: '<b>EN 15804 module D:</b> benefits and loads beyond the system boundary, calculated with the <b>net</b> secondary flow (R2 − R1), and reported separately. This keeps A–C (what happens today) and D (potential future benefit) apart.',
  });

  // 8 ─────────────────────────────────────────── matrix LCA
  def('matrix-lca', 'Matrix LCA: h = Q · B · A⁻¹ · f', 'Convention: in the technology matrix A, outputs are positive and inputs negative (rows = products, columns = processes). Uncertainty sits in A, B and Q.', () => {
    let s = '';
    s += D.box(8, 8, 344, 42, 'f  – final demand (functional unit)\ne.g. f = [1; 0] → 1 unit of product 1', { c: 'n', ta: 'start', fs: 9.8, boldFirst: true, k: 'f' });
    s += D.arrow(180, 50, 180, 60);
    s += D.box(8, 62, 344, 54, 'A  – technology matrix (products × processes)\noutputs +, inputs −  →  s = A⁻¹ · f\n(scaling vector: how often each process must run)', { c: 'p', ta: 'start', fs: 9.8, boldFirst: true, k: 'A' });
    s += D.arrow(180, 116, 180, 126);
    s += D.box(8, 128, 344, 42, 'B  – intervention matrix (elementary flows × processes)\ng = B · s  (inventory: kg CO₂, kg SO₂ … per FU)', { c: 'b', ta: 'start', fs: 9.8, boldFirst: true, k: 'B' });
    s += D.arrow(180, 170, 180, 180);
    s += D.box(8, 182, 344, 42, 'Q  – characterization matrix (categories × flows)\nh = Q · g  (impact scores, e.g. kg CO₂-eq)', { c: 'c', ta: 'start', fs: 9.8, boldFirst: true, k: 'Q' });
    s += D.text(180, 248, 'h = Q · B · A⁻¹ · f   =  g(x₁, x₂, …, xₖ)', { fs: 13, a: 'middle', bold: true });
    return D.svg(360, 258, s, 'Matrix LCA');
  }, {
    f: '<b>f</b>: demand vector = functional unit or reference flow (e.g. 1 kg of product).',
    A: '<b>A</b>: technosphere. Each column is a process (e.g. 1 kWh of electricity), each row a product. Outputs +, inputs −. The solution s = A⁻¹f tells how much each process must be scaled (incl. all upstream chains).',
    B: '<b>B</b>: biosphere (interventions): direct emissions and resource uses per unit of process. g = B·s gives the inventory per FU.',
    Q: '<b>Q</b>: characterization factors (e.g. CH₄ → 27 kg CO₂-eq/kg). h = Q·g gives the impact scores.',
  });

  // 9 ─────────────────────────────────────────── IO table
  def('io-table', 'Environmentally extended input-output table (EE-IO)', 'Tip from the protocols: the environmental satellite matrix belongs BELOW the economic table, as on the slides.', () => {
    let s = '';
    s += D.box(8, 8, 60, 36, 'Z: inter-\nindustry', { c: 'p', fs: 8.5, k: 'Z' });
    for (let i = 0; i < 3; i++) s += D.box(70 + i * 50, 8, 48, 36, 'Sector\n' + (i + 1), { c: 'p', fs: 8.5 });
    s += D.box(222, 8, 68, 36, 'Final\ndemand y', { c: 'y', fs: 8.5, k: 'y' });
    s += D.box(294, 8, 58, 36, 'Total\noutput x', { c: 'n', fs: 8.5, k: 'x' });
    for (let r = 0; r < 3; r++) {
      const y = 46 + r * 30;
      s += D.box(8, y, 60, 28, 'Sector ' + (r + 1), { c: 'p', fs: 8.5 });
      for (let c = 0; c < 3; c++) s += D.box(70 + c * 50, y, 48, 28, 'z' + sub(r + 1) + sub(c + 1), { c: 'w', fs: 9.5, k: 'Z' });
      s += D.box(222, y, 68, 28, 'y' + sub(r + 1), { c: 'y', fs: 9.5, k: 'y' });
      s += D.box(294, y, 58, 28, 'x' + sub(r + 1), { c: 'n', fs: 9.5, k: 'x' });
    }
    s += D.box(8, 138, 60, 26, 'Value\nadded', { c: 'n', fs: 8.5, k: 'va' }) + D.box(70, 138, 148, 26, 'wages, profits, taxes', { c: 'n', fs: 8.5, k: 'va' });
    s += D.box(8, 168, 60, 22, 'Imports', { c: 'n', fs: 8.5, k: 'imp' }) + D.box(70, 168, 148, 22, 'imported inputs', { c: 'n', fs: 8.5, k: 'imp' });
    s += D.line(8, 197, 352, 197, 'ln dash');
    s += D.box(8, 204, 60, 28, 'CO₂ [kg]', { c: 'g', fs: 8.5, k: 'sat' });
    s += D.box(8, 234, 60, 28, 'Water,\njobs …', { c: 'g', fs: 8.5, k: 'sat' });
    for (let c = 0; c < 3; c++) { s += D.box(70 + c * 50, 204, 48, 28, 'd' + sub(c + 1), { c: 'g', fs: 9.5, k: 'sat' }); s += D.box(70 + c * 50, 234, 48, 28, '…', { c: 'g', fs: 9.5, k: 'sat' }); }
    s += D.box(222, 204, 130, 58, 'Environmental extension\n(satellite) BELOW the\neconomic table: flows\nper CHF of output', { c: 'g', fs: 8.5, boldFirst: true, k: 'sat' });
    s += D.text(8, 282, 'A = Z · x̂⁻¹   technical coefficients [CHF/CHF]', { fs: 9.8 });
    s += D.text(8, 298, 'x = (I − A)⁻¹ · y   Leontief inverse L = (I − A)⁻¹', { fs: 9.8 });
    s += D.text(8, 314, 'e = d · (I − A)⁻¹ · y   total incl. all upstream sectors', { fs: 9.8 });
    return D.svg(360, 322, s, 'Input-output table');
  }, {
    Z: '<b>Intermediate matrix Z</b>: how much sector j (column) buys from sector i (row), in CHF. An LCA product system is like an excerpt of it, only in physical units.',
    y: '<b>Final demand y</b>: households, government, investment, exports. Corresponds to the functional unit in LCA.',
    x: '<b>Total output x</b> = intermediate deliveries to other sectors + final demand: x = Z·1 + y.',
    va: '<b>Value added</b> (wages, profits, taxes): the column sum equals the output value.',
    imp: '<b>Imports</b>: in a single-country IO table, imports are often approximated with domestic technology (a source of error). Solution: MRIO (e.g. EXIOBASE, Eora).',
    sat: '<b>Satellite matrix (environmental extension)</b>: direct emissions and resource uses per CHF of output per sector (d). Total intensity incl. upstream: d·(I−A)⁻¹. Applications: spend-based Scope 3 (Swisscom), consumption perspective of a country.',
  });

  // 10 ─────────────────────────────────────────── uncertainty types
  def('uncertainty-types', 'Uncertainty vs. variability and the 3-step procedure', 'Exam trap from the feedback: the pedigree matrix ESTIMATES uncertainty (characterization), Monte Carlo PROPAGATES it.', () => {
    let s = '';
    s += D.box(8, 8, 168, 44, 'Uncertainty\n= lack of knowledge (reducible)', { c: 'o', fs: 9.4, boldFirst: true, k: 'unc' });
    s += D.box(184, 8, 168, 44, 'Variability\n= inherent in the system', { c: 'b', fs: 9.4, boldFirst: true, k: 'var' });
    [['Parameter uncertainty\ninput data: kWh, EF, yields', 'par'], ['Model uncertainty\nlinearity, fate models', 'mod'], ['Scenario uncertainty\nchoices: FU, allocation, …', 'scen']].forEach(([t, k], i) => {
      s += D.box(20, 62 + i * 46, 156, 40, t, { c: 'w', fs: 9, boldFirst: true, k });
      s += D.line(12, 52, 12, 82 + i * 46) + D.line(12, 82 + i * 46, 20, 82 + i * 46);
    });
    [['Spatial\nregions, grid mixes', 'spat'], ['Temporal\nyears, day/night, seasons', 'temp'], ['Between objects/sources\nsuppliers, technologies, people', 'obj']].forEach(([t, k], i) => {
      s += D.box(196, 62 + i * 46, 156, 40, t, { c: 'w', fs: 9, boldFirst: true, k });
      s += D.line(188, 52, 188, 82 + i * 46) + D.line(188, 82 + i * 46, 196, 82 + i * 46);
    });
    s += D.text(8, 216, 'Uncertainty analysis in 3 steps', { fs: 10, bold: true });
    [['1 Characterize\nquantify input\nuncertainty:\ndistributions,\npedigree matrix', 'w1'], ['2 Propagate\nboundary analysis,\nanalytical\n(variances),\nMonte Carlo', 'w2'], ['3 Analyze\nmean, SD, 95 %\ninterval; histo-\ngram, boxplot;\nA vs. B', 'w3']].forEach(([t, k], i) => {
      s += D.box(8 + i * 118, 224, 108, 74, t, { c: 'p', fs: 8.8, boldFirst: true, k });
      if (i < 2) s += D.arrow(116 + i * 118, 261, 124 + i * 118, 261);
    });
    s += D.text(180, 316, 'Pedigree = characterize  ·  Monte Carlo = propagate', { fs: 9.4, a: 'middle', bold: true, cls: 't-r' });
    return D.svg(360, 324, s, 'Uncertainty types');
  }, {
    unc: '<b>Uncertainty</b> = lack of knowledge: no, wrong, imprecise or incomplete data. Reducible with better data.',
    var: '<b>Variability</b> = real differences in the system, independent of data quality. Not reducible, but more specific data (e.g. which supplier exactly) reduce the uncertainty it causes.',
    par: '<b>Parameter uncertainty</b>: measurement errors, estimates of inputs (energy use, emission factors, yields). Well represented in Monte Carlo.',
    mod: '<b>Model uncertainty</b>: simplifications, e.g. linearity, missing correlations, different fate models. Address via model comparison or scenarios.',
    scen: '<b>Scenario uncertainty (choices)</b>: normative choices of FU, system boundaries, cut-off, allocation, marginal supplier, time horizon. Address via scenario or sensitivity analysis.',
    spat: '<b>Spatial variability</b>: e.g. electricity mix of France (nuclear) vs. Poland (coal), water scarcity per region.',
    temp: '<b>Temporal variability</b>: from year to year, day/night, seasons (solar power, crop yields).',
    obj: '<b>Variability between objects/sources</b>: different suppliers, technologies, efficiencies, people. Exam example of the cotton suppliers for banknotes: reducible by knowing exactly which supplier delivers.',
    w1: '<b>1 Characterize</b>: fit distributions (uniform, triangular, normal, lognormal) if many data points exist. With only one value: <b>pedigree matrix</b> (expert judgement → geometric standard deviation).',
    w2: '<b>2 Propagate</b>: boundary analysis (all best/worst values), analytical (variance formulas, simple models only), <b>Monte Carlo</b> (random draws, many runs, model-independent, no specific distribution required).',
    w3: '<b>3 Analyse</b>: mean, median, standard deviation, 2.5–97.5 percentiles; histogram, boxplot, violin plot. For comparisons: dependent sampling (shared parameters drawn identically) → share of runs with A < B.',
  });

  // 11 ─────────────────────────────────────────── distributions
  def('distributions', 'Probability distributions in LCA', 'Lognormal is the ecoinvent default: only positive values, right-skewed, suited to multiplicative relationships. 95 % interval: [μg / GSD², μg · GSD²].', () => {
    let s = '';
    const panels = [
      ['Uniform', 'min, max', (x) => (x >= 0.15 && x <= 0.85 ? 1 : 0), 'only the range is known', 'uni'],
      ['Triangular', 'min, mode, max', (x) => (x < 0.12 || x > 0.9 ? 0 : x < 0.38 ? (x - 0.12) / 0.26 : (0.9 - x) / 0.52), 'range + most likely value', 'tri'],
      ['Normal', 'mean μ, SD σ', (x) => Math.exp(-((x - 0.5) ** 2) / (2 * 0.12 ** 2)), 'symmetric; 95 % in μ ± 2σ', 'nor'],
      ['Lognormal', 'μ, σ of ln x (→ GSD)', (x) => (x <= 0.001 ? 0 : Math.exp(-(Math.log(x / 0.28) ** 2) / (2 * 0.45 ** 2)) / x), 'positive, skewed: LCA default', 'log'],
    ];
    panels.forEach(([t, p, fn, note, k], i) => {
      const px = 8 + (i % 2) * 176, py = 8 + Math.floor(i / 2) * 102;
      s += `<g class="hot" data-k="${k}">` + D.rect(px, py, 168, 96, 'b-w', { r: 8 });
      s += D.text(px + 8, py + 15, t, { fs: 10.5, bold: true }) + D.text(px + 8, py + 27, p, { fs: 8.6, cls: 'lab' });
      const box = { x: px + 10, y: py + 34, w: 148, h: 40 };
      const d = D.curve(fn, 0, 1, box, 80, true);
      s += `<path d="${d}" class="fill-p" opacity=".22"/>` + `<path d="${D.curve(fn, 0, 1, box, 80)}" class="stroke-p" fill="none" stroke-width="1.8"/>`;
      s += D.line(box.x, box.y + box.h, box.x + box.w, box.y + box.h);
      s += D.text(px + 8, py + 88, note, { fs: 8.4 }) + '</g>';
    });
    return D.svg(360, 214, s, 'Distributions');
  }, {
    uni: '<b>Uniform</b>: only minimum and maximum are known, all values equally likely. Example: a machine uses 20–30 kWh per year.',
    tri: '<b>Triangular</b>: minimum, maximum and most likely value (mode). Example: transport distance with clear limits.',
    nor: '<b>Normal</b>: mean and standard deviation; symmetric. 68 % within μ ± σ, 95 % within μ ± 2σ, 99.7 % within μ ± 3σ. Negative values possible (a problem for quantities).',
    log: '<b>Lognormal</b>: ln(x) is normally distributed. Only positive, right-skewed (mode < median < mean). Parameters: μ and σ of the underlying normal distribution; median = e^μ, GSD = e^σ, 95 % interval = [median/GSD², median·GSD²]. Default in ecoinvent (pedigree).',
  });

  // 12 ─────────────────────────────────────────── Monte Carlo
  def('monte-carlo', 'Monte Carlo simulation (propagation)', 'In every run, one value is drawn for each uncertain parameter from its distribution and the whole model is calculated. After e.g. 1,000 runs you get a distribution of the result.', () => {
    let s = '';
    const ins = [['electricity [kWh]', (x) => (x <= 0.01 ? 0 : Math.exp(-(Math.log(x / 0.35) ** 2) / 0.18) / x), 'log'], ['EF [kg CO₂/kWh]', (x) => (x < 0.15 || x > 0.85 ? 0 : x < 0.4 ? (x - 0.15) / 0.25 : (0.85 - x) / 0.45), 'tri'], ['transport [km]', (x) => (x > 0.2 && x < 0.8 ? 1 : 0), 'uni']];
    ins.forEach(([t, fn], i) => {
      const y = 8 + i * 58;
      s += D.rect(8, y, 104, 52, 'b-w', { r: 8 }) + D.text(14, y + 13, t, { fs: 8.6, bold: true });
      const box = { x: 14, y: y + 18, w: 92, h: 26 };
      s += `<path d="${D.curve(fn, 0, 1, box, 50, true)}" class="fill-o" opacity=".3"/><path d="${D.curve(fn, 0, 1, box, 50)}" class="stroke-o" fill="none" stroke-width="1.5"/>`;
      s += D.arrow(112, y + 26, 128, 92);
    });
    s += D.box(130, 52, 96, 82, 'Model\nh = Q·B·A⁻¹·f\nrandom draw per\nparameter, run\nN = 1000× ', { c: 'p', fs: 9, boldFirst: true, k: 'model' });
    s += D.arrow(226, 93, 242, 93);
    s += D.rect(244, 22, 108, 126, 'b-w', { r: 8 }) + D.text(298, 37, 'output: h', { fs: 9, a: 'middle', bold: true });
    const hb = [2, 6, 13, 20, 24, 22, 17, 12, 8, 5, 3, 2, 1];
    hb.forEach((v, i) => { s += D.rect(252 + i * 7.3, 138 - v * 3.6, 6.3, v * 3.6, 'fill-p', { r: 1, op: 0.85 }); });
    s += D.line(250, 138, 348, 138);
    s += D.box(8, 182, 344, 52, 'Output: mean, median, 2.5th–97.5th percentile (95 % interval)\nComparing A vs B: same random draws for shared parameters\n(dependent sampling) → share of runs in which A < B', { c: 'n', fs: 9, ta: 'start', k: 'res' });
    return D.svg(360, 240, s, 'Monte Carlo');
  }, {
    model: 'The model stays deterministic; the randomness is in the inputs. Monte Carlo is <b>stochastic</b>, model-independent and needs <b>no specific distribution form</b> (lognormal is just common). Drawback: computationally heavy.',
    res: 'The result is a distribution. For comparisons, do not compare two separate intervals (they overlap strongly because of shared uncertainties) – compute the <b>difference</b> or ratio A/B in each run (coupled analysis, Heeren et al. 2015).',
  });

  // 13 ─────────────────────────────────────────── sensitivity
  def('sensitivity', 'Sensitivity analysis: local vs. global', 'Local (one-at-a-time) is fast, but only valid around one point and ignores interactions. Global varies all inputs together (Monte Carlo + regression/correlation or Sobol indices).', () => {
    let s = D.text(8, 14, 'Local – one-at-a-time (tornado)', { fs: 9.6, bold: true });
    const tor = [['Electricity EF', 28], ['Transport km', 12], ['Yield', 9], ['Packaging', 3]];
    const cx = 110;
    tor.forEach(([t, v], i) => {
      const y = 26 + i * 26;
      s += D.text(8, y + 13, t, { fs: 8.8 });
      s += D.rect(cx - v * 2, y + 2, v * 2, 16, 'fill-b', { r: 2, op: 0.75 }) + D.rect(cx, y + 2, v * 2, 16, 'fill-o', { r: 2, op: 0.75 });
    });
    s += D.line(cx, 22, cx, 132, 'ln-a') + D.text(cx, 146, 'baseline', { fs: 8.4, a: 'middle', cls: 'lab' });
    s += D.text(8, 160, 'each input ±10 %, others fixed', { fs: 8.4, cls: 'lab' });
    s += D.text(196, 14, 'Global – Sobol indices', { fs: 9.6, bold: true });
    const sob = [['EF', 0.55], ['km', 0.2], ['yield', 0.12], ['interactions', 0.13]];
    sob.forEach(([t, v], i) => {
      const y = 26 + i * 26;
      s += D.text(196, y + 13, t, { fs: 8.8 }) + D.rect(262, y + 2, v * 160, 16, i === 3 ? 'fill-v' : 'fill-p', { r: 2, op: 0.8 }) + D.text(266 + v * 160, y + 14, v.toFixed(2), { fs: 8.6, bold: true });
    });
    s += D.text(196, 146, 'share of output variance', { fs: 8.4, cls: 'lab' });
    s += D.text(196, 160, 'all inputs vary together', { fs: 8.4, cls: 'lab' });
    s += D.box(8, 172, 344, 60, 'Contribution analysis: which PROCESSES contribute most to the result\n(e.g. 70 % electricity). Sensitivity analysis: which uncertain INPUTS\ndrive the variation of the result. SA settings: factor prioritization,\nfactor fixing, factor mapping, variance cutting.', { c: 'n', fs: 8.8, ta: 'start' });
    return D.svg(360, 238, s, 'Sensitivity analysis');
  });

  // 14 ─────────────────────────────────────────── attributional vs consequential
  def('attr-conseq', 'Attributional vs. consequential LCA', 'ALCA distributes today\'s burdens to products (average). CLCA asks what changes as a consequence of a decision (marginal).', () => {
    let s = D.box(8, 8, 168, 46, 'Attributional (ALCA)\n"Which share of global burdens\nbelongs to my product?"', { c: 'p', fs: 8.8, boldFirst: true, k: 'alca' });
    s += D.box(184, 8, 168, 46, 'Consequential (CLCA)\n"What changes as a consequence\nof a decision?"', { c: 'c', fs: 8.8, boldFirst: true, k: 'clca' });
    s += D.text(14, 72, 'average electricity mix', { fs: 8.6, cls: 'lab' });
    s += D.rect(14, 78, 84, 18, 'fill-b', { r: 2, op: 0.8 }) + D.rect(98, 78, 44, 18, 'fill-v', { r: 2, op: 0.8 }) + D.rect(142, 78, 26, 18, 'fill-n', { r: 2, op: 0.8 });
    s += D.text(56, 91, 'hydro', { fs: 8.4, a: 'middle', cls: 't-a' }) + D.text(120, 91, 'nuclear', { fs: 8.4, a: 'middle', cls: 't-a' });
    s += D.text(190, 72, 'marginal supplier (what reacts)', { fs: 8.6, cls: 'lab' });
    s += D.rect(190, 78, 156, 18, 'fill-o', { r: 2, op: 0.85 }) + D.text(268, 91, 'e.g. gas CC or new wind', { fs: 8.4, a: 'middle', cls: 't-a' });
    s += D.text(14, 116, '• average data, status quo\n• linear & homogeneous\n• allocation (partitioning)\n• Σ all ALCAs = world total\n• EPD, footprint, reporting', { fs: 8.8, lh: 13 });
    s += D.text(190, 116, '• marginal data\n• system expansion,\n  substitution\n• market effects, rebound,\n  price elasticity\n• policy & strategic decisions', { fs: 8.8, lh: 13 });
    s += D.box(8, 200, 344, 62, 'Marginal technology = the one that reacts to the change in demand\n• expanding market → next to be installed (lowest production cost)\n• shrinking market → next to be shut down (highest production cost)\n• constrained technologies (e.g. limited hydro potential) are NOT marginal', { c: 'o', fs: 8.6, ta: 'start', boldFirst: true, k: 'marg' });
    return D.svg(360, 268, s, 'ALCA vs CLCA');
  }, {
    alca: '<b>ALCA</b>: which share of the global environmental burdens belongs to my product? Average data, linear homogeneous production functions, allocation. The sum of all ALCAs equals the total burden. Practical and reproducible (ecoinvent), but simplifies the actual effect of a decision.',
    clca: '<b>CLCA</b>: which environmental flows change as a consequence of a decision (usually a change in demand)? Only affected processes. Key elements (Ekvall & Weidema 2004): allocation via system expansion, competing product, marginal technology, constrained production factors, general market effects. Examples: 20 % Fairtrade orange juice by 2030, water supply for 20 % of the population.',
    marg: '<b>Marginal technology</b>: determined by the time horizon (short: existing capacity; long: new capacity) and the market trend. Expanding market: next technology installed or the cheapest. Shrinking market: next to be shut down or the most expensive. Constrained technologies do not react.',
  });

  // 15 ─────────────────────────────────────────── PDCA
  def('pdca', 'Deming circle: Plan – Do – Check – Act', 'Basis of all management systems (ISO 9001, 14001, 50001). Works like a chain – only if all elements are in place.', () => {
    const cx = 120, cy = 125, r = 100;
    let s = '';
    const q = [['plan', 'M120,125 L20,125 A100,100 0 0,1 120,25 Z', 'p', 'PLAN\nanalyse, goals,\ntargets, measures', 70, 88], ['do', 'M120,125 L120,25 A100,100 0 0,1 220,125 Z', 'b', 'DO\nimplement\n(daily work)', 170, 88], ['check', 'M120,125 L220,125 A100,100 0 0,1 120,225 Z', 'y', 'CHECK\nmonitor, measure,\nreport', 170, 166], ['act', 'M120,125 L120,225 A100,100 0 0,1 20,125 Z', 'c', 'ACT / ADAPT\nimprove, mgmt\nreview', 70, 166]];
    q.forEach(([k, d, c, t, tx, ty]) => { s += `<g class="hot" data-k="${k}"><path d="${d}" class="b-${c}"/>` + D.text(tx, ty - 10, t, { fs: 9.2, a: 'middle', cls: 't-' + c }) + '</g>'; });
    s += D.ell(cx, cy, 30, 30, 'continuous\nimprovement', { c: 'g', fs: 8.2, k: 'ci' });
    [[188, 262], [278, 352], [8, 82], [98, 172]].forEach(([a1, a2]) => { s += D.path(arc(cx, cy, r + 9, a1, a2), { arrow: true, c: 'a' }); });
    s += D.text(240, 40, 'Plan, Check, Act =\nmanagement tasks\n\nDo = daily work\n\nBasis of all ISO\nmanagement\nstandards (9001,\n14001, 50001 …)', { fs: 9.2, lh: 13 });
    return D.svg(360, 250, s, 'PDCA');
  }, {
    plan: '<b>Plan</b>: analyse the situation (e.g. ecobalance → relevant environmental aspects), organise, set goals, target values (SMART) and measures.',
    do: '<b>Do</b>: implement – the daily business. Resources, training, communication.',
    check: '<b>Check</b>: control and report: KPIs, ecobalance update, audits, understanding deviations from targets.',
    act: '<b>Act / adapt</b>: improve, corrective actions, management review, new targets → next cycle.',
    ci: 'Continual improvement and a policy are mandatory in all management standards; the strategy is usually not an explicit part.',
  });

  // 16 ─────────────────────────────────────────── ISO 14001 cycle
  def('iso14001-cycle', 'ISO 14001 (2015): the environmental management cycle', 'This is how Braunschweig shows the cycle. Tap the elements. The ecobalance provides input to 1 (relevant aspects), 5 (targets) and 7 (controlling).', () => {
    let s = '';
    const B = [[1, 8, 262, 'Context &\nstakeholders', 'n'], [2, 8, 192, 'Compliance\nobligations', 'n'], [3, 8, 122, 'Leadership\n& scope', 'n'], [4, 8, 52, 'Environmental\npolicy', 'c'], [5, 128, 6, 'PLAN\nobjectives, pro-\ngrams, resources', 'p'], [6, 250, 96, 'DO\noperation, com-\nmunication, emerg.', 'b'], [7, 250, 210, 'CHECK\nperformance\nevaluation, audits', 'y'], [8, 128, 290, 'ACT\ncorrective action,\nmgmt review', 'o']];
    B.forEach(([n, x, y, t, c]) => { s += D.box(x, y, 104, 46, t, { c, fs: 8.8, boldFirst: n >= 5 || n === 4, k: 'e' + n }); s += D.ell(x + 6, y + 6, 9, 9, String(n), { c: 'a', fs: 9, bold: true }); });
    s += D.arrow(60, 262, 60, 240) + D.arrow(60, 192, 60, 170) + D.arrow(60, 122, 60, 100);
    s += D.path('M112,72 C120,50 120,32 126,30', { arrow: true });
    s += D.path('M232,30 C282,32 300,60 302,94', { arrow: true });
    s += D.arrow(302, 142, 302, 208);
    s += D.path('M300,256 C298,300 270,312 234,312', { arrow: true });
    s += D.ell(180, 172, 52, 40, 'Continual\nimprovement', { c: 'g', fs: 9.5, bold: true, k: 'ci' });
    s += D.arrow(180, 290, 180, 214, { dash: true, c: 'a' }) + D.arrow(180, 132, 180, 54, { dash: true, c: 'a' });
    return D.svg(360, 342, s, 'ISO 14001 cycle');
  }, {
    e1: '<b>1 Context & stakeholders</b> (clause 4): internal and external issues, expectations of interested parties, scope of the EMS.',
    e2: '<b>2 Compliance obligations</b> (6.1.3): laws, permits, sector agreements, voluntary commitments.',
    e3: '<b>3 Leadership & scope</b> (clause 5): top management takes responsibility, roles and responsibilities, integration into business processes.',
    e4: '<b>4 Environmental policy</b> (5.2): commitment to protect the environment (incl. prevention of pollution), to fulfil compliance obligations and to continual improvement. Publicly available.',
    e5: '<b>5 Plan</b> (clause 6): determine <b>significant environmental aspects</b> (incl. life cycle perspective), risks & opportunities, environmental objectives (SMART), programmes (who, what, by when, resources).',
    e6: '<b>6 Do</b> (clauses 7–8): resources, competence, awareness, communication, documented information, operational control, emergency preparedness.',
    e7: '<b>7 Check</b> (clause 9): monitoring and measurement (KPIs, ecobalance), evaluation of compliance, internal audit.',
    e8: '<b>8 Act</b> (9.3 + clause 10): management review, nonconformities, corrective actions, new objectives.',
    ci: '<b>Continual improvement</b> – but ISO 14001 does <b>not prescribe a specific performance level</b> (other than legal compliance). An "ecological champion" and a "just legal" company can both be certified. Improvement is not always continuous: do not forget the big steps!',
  });

  // 17 ─────────────────────────────────────────── management model & EFQM
  def('ssc-efqm', 'Management model: strategy – structure – culture + EFQM', 'Strategy, structure and culture describe any organisation. EFQM: "Profits are the result of what you did in the past" – looking only at financial figures is like driving by looking in the rear-view mirror.', () => {
    let s = D.box(8, 8, 168, 76, 'Strategy\n• Leitbild (vision, mission)\n• company strategy\n• goals & targets', { c: 'p', fs: 9, ta: 'start', top: true, boldFirst: true, k: 'strat' });
    s += D.box(184, 8, 168, 76, 'Structure\n• organisation & processes\n  incl. responsibilities\n• staff, infrastructure', { c: 'b', fs: 9, ta: 'start', top: true, boldFirst: true, k: 'struct' });
    s += D.box(96, 92, 168, 58, 'Culture\n• leadership & cooperation\n• values & behaviour', { c: 'o', fs: 9, ta: 'start', top: true, boldFirst: true, k: 'cult' });
    s += D.text(8, 172, 'EFQM / TQM model', { fs: 10, bold: true });
    s += D.box(8, 180, 168, 92, 'Enablers (50 %)\nleadership · policy & strategy\npeople · partnerships &\nresources · processes', { c: 'n', fs: 8.8, boldFirst: true, k: 'enab' });
    s += D.arrow(176, 226, 192, 226);
    s += D.box(194, 180, 158, 92, 'Results (50 %)\npeople · customers ·\nsociety & environment ·\nkey (financial) results', { c: 'g', fs: 8.8, boldFirst: true, k: 'res' });
    s += D.path('M272,272 C272,292 92,292 92,274', { arrow: true, dash: true });
    s += D.text(182, 302, 'learning, creativity, innovation', { fs: 8.6, a: 'middle', cls: 'lab' });
    return D.svg(360, 308, s, 'Management model');
  }, {
    strat: '<b>Strategy</b>: mission statement (vision, mission), company strategy, goals. Core elements of a strategy: product/service (what?), markets (where, for whom?), technologies (what are we good at, what do we buy?). Complemented by stakeholders and sustainability drivers.',
    struct: '<b>Structure</b>: organisation and processes incl. responsibilities, staff, infrastructure.',
    cult: '<b>Culture</b>: leadership and cooperation, values and behaviour. Often the hardest part when changing (e.g. towards sustainability).',
    enab: '<b>Enablers</b>: what the organisation does. Leadership, policy & strategy, people, partnerships & resources, processes.',
    res: '<b>Results</b>: what it achieves. People, customers, society & environment, key results. Measured e.g. with a balanced scorecard (market, financial, environmental, social performance).',
  });

  // 18 ─────────────────────────────────────────── ecological scarcity
  def('ecoscarcity', 'Method of ecological scarcity (UBP)', 'Distance-to-target weighting based on Swiss environmental policy. A flow above its critical flow is weighted over-proportionally (quadratically).', () => {
    let s = '';
    s += D.box(6, 14, 46, 42, 'EF', { c: 'c', fs: 13, bold: true, k: 'ef' });
    s += D.text(60, 40, '=', { fs: 14, a: 'middle', bold: true });
    s += D.box(68, 14, 46, 42, 'K\ncharact.', { c: 'n', fs: 9, boldFirst: true, k: 'K' });
    s += D.text(121, 40, '×', { fs: 14, a: 'middle', bold: true });
    s += D.box(128, 14, 70, 42, '1 UBP / Fₙ\nnormalization', { c: 'p', fs: 9, boldFirst: true, k: 'fn' });
    s += D.text(205, 40, '×', { fs: 14, a: 'middle', bold: true });
    s += D.box(212, 14, 86, 42, '(F / F_k)²\nweighting', { c: 'o', fs: 9.6, boldFirst: true, k: 'w' });
    s += D.text(305, 40, '×', { fs: 14, a: 'middle', bold: true });
    s += D.box(312, 14, 42, 42, 'c\n10¹²/a', { c: 'n', fs: 9, boldFirst: true, k: 'c' });
    s += D.text(8, 78, 'Fₙ = normalization flow (current annual load, e.g. Switzerland)\nF = current flow · F_k = critical flow (target from law/policy)\n(F/F_k)² = distance-to-target: above target → weighted more\nResult: eco-points (UBP, Umweltbelastungspunkte) per kg, MJ, m³', { fs: 9, lh: 13 });
    s += D.box(8, 136, 344, 56, "Example NOₓ (CH, UBP'21): F ≈ 70'733 t/a,  F_k ≈ 46'518 t/a\n(F/F_k)² ≈ 2.31  →  EF ≈ 33'000 UBP per kg NOₓ\n(F_k = level that keeps the legal ozone limits; here Fₙ = F)", { c: 'y', fs: 9.2, ta: 'start', boldFirst: true, k: 'ex' });
    const box = { x: 40, y: 206, w: 150, h: 44 };
    s += D.line(box.x, box.y + box.h, box.x + box.w, box.y + box.h) + D.line(box.x, box.y, box.x, box.y + box.h);
    s += `<path d="${D.curve((x) => x * x, 0, 2, box, 40)}" class="stroke-o" fill="none" stroke-width="2"/>`;
    s += D.line(box.x + box.w / 2, box.y, box.x + box.w / 2, box.y + box.h, 'ar dash');
    s += D.text(box.x + box.w / 2, box.y + box.h + 12, 'F = F_k', { fs: 8.4, a: 'middle', cls: 'lab' }) + D.text(box.x + box.w, box.y + box.h + 12, 'F/F_k = 2', { fs: 8.4, a: 'end', cls: 'lab' });
    s += D.text(8, box.y + 8, 'weight', { fs: 8.4, cls: 'lab' });
    s += D.text(204, 218, 'weighting factor grows\nquadratically with F/F_k:\n1 at target, 4 at 2× target', { fs: 8.8, lh: 12 });
    return D.svg(360, 266, s, 'Ecological scarcity');
  }, {
    ef: '<b>Eco-factor</b> in UBP (eco-points) per unit of pollutant or resource. Environmental impact = Σ amount × eco-factor.',
    K: '<b>K</b>: characterization (optional), e.g. GWP for greenhouse gases relative to the reference substance.',
    fn: '<b>Normalization</b> 1 UBP/Fₙ: Fₙ is the current total annual load in the reference area (usually Switzerland), so one unit of the flow is a share of the total load.',
    w: '<b>Weighting</b> (F/F_k)²: F = current flow, F_k = critical flow (political or legal target). If F lies above F_k, the flow is weighted more than linearly. This contains political priorities (subjective!).',
    c: '<b>c</b> = 10¹²/a: constant to obtain handy numbers.',
    ex: 'Calculation: 1/(70.733·10⁶ kg) × (70,733/46,518)² × 10¹² ≈ 1.414·10⁻⁸ × 2.312 × 10¹² ≈ 32,700 ≈ 33,000 UBP/kg NOₓ.',
  });

  // 19 ─────────────────────────────────────────── LCC layers
  def('lcc-layers', 'Life cycle costing: from company costs to "full LCC"', 'Business LCC reveals inefficiencies and overcomes split budgets (purchasing vs. maintenance). Environmental LCC brings LCA thinking into costing; full LCC is still at the concept stage.', () => {
    let s = '';
    const rows = [['External\nsocietal\n(health, jobs)', 'v'], ['External\nenviron.\n(CO₂, air)', 'g'], ['Direct\n(internal)', 'o']];
    const cols = ['Develop-\nment', 'Supply\nchain', 'Produc-\ntion', 'Use &\nmaint.', 'End of\nlife'];
    rows.forEach(([t, c], r) => {
      const y = 26 + r * 52;
      s += D.box(4, y, 62, 48, t, { c: 'n', fs: 8, boldFirst: true });
      cols.forEach((col, i) => {
        let cc = c, tt = '';
        if (r === 2) { cc = i <= 2 ? 'o' : 'b'; tt = ['own', 'prices', 'own', 'client', 'client'][i]; }
        s += D.box(70 + i * 46, y, 44, 48, tt, { c: cc, fs: 7.8, k: 'r' + r });
      });
    });
    cols.forEach((col, i) => { s += D.text(92 + i * 46, 196, col, { fs: 8.2, a: 'middle', cls: 'lab' }); });
    s += D.text(305, 40, '3 Full LCC', { fs: 8.8, bold: true, cls: 't-v' }) + D.text(305, 52, '= 2 + societal', { fs: 8, cls: 'lab' });
    s += D.text(305, 92, '2 Environm.', { fs: 8.8, bold: true, cls: 't-g' }) + D.text(305, 104, 'LCC = 1 + env.', { fs: 8, cls: 'lab' });
    s += D.text(305, 144, '1 Market LCC', { fs: 8.8, bold: true, cls: 't-b' }) + D.text(305, 156, '= all direct', { fs: 8, cls: 'lab' }) + D.text(305, 168, '0 = own cost', { fs: 8, cls: 'lab' });
    s += D.text(8, 232, 'Discounting: conventional costs usually > 0 %; environmental', { fs: 8.8 });
    s += D.text(8, 244, 'costs: discounting not recommended. Many LCC studies use 0 %.', { fs: 8.8 });
    return D.svg(360, 252, s, 'LCC layers');
  }, {
    r0: '<b>External societal costs</b> (e.g. health costs, unemployment): first methodological attempts (Social Hotspot Database).',
    r1: '<b>External environmental costs</b> (e.g. air pollution, CO₂ with damage costs of roughly 100–200 CHF/t): valued via willingness to pay, damage costs or avoidance/replacement costs.',
    r2: '<b>Direct (internal) costs</b>: own costs (development, production) are known; supplier costs are contained in prices; use and disposal costs of the customers must be modelled (assumptions!). Market LCC = total cost of ownership.',
  });

  // 20 ─────────────────────────────────────────── critical review
  def('critical-review', 'Critical review according to ISO 14044 / ISO/TS 14071', 'Three exam protocols asked about the procedure, the content and the reviewers\' skills. The review starts at the beginning of the study, not at the end.', () => {
    let s = D.box(8, 6, 344, 40, 'Critical review: ensures consistency of an LCA with the\nprinciples and requirements of ISO 14040/44', { c: 'c', fs: 9.4, bold: true, k: 'def' });
    const st = ['1 Appoint reviewer / panel\nat the START of the study', '2 Review goal & scope\n(FU, boundaries, methods)', '3 Data review (LCI):\nmodels, data sources', '4 Draft report →\nwritten review comments', '5 Revised report +\nresponses to comments', '6 Final report + review\nstatement (part of report)'];
    st.forEach((t, i) => { s += D.box(8, 56 + i * 42, 168, 34, t, { c: 'p', fs: 8.8, boldFirst: false, k: 'proc' }); if (i < 5) s += D.arrow(92, 90 + i * 42, 92, 98 + i * 42); });
    s += D.box(186, 56, 166, 118, 'Reviewers assess whether:\n1 methods consistent with ISO\n2 methods scientifically &\n   technically valid\n3 data appropriate & reason-\n   able in relation to the goal\n4 interpretation reflects the\n   limitations & the goal\n5 report transparent &\n   consistent', { c: 'g', fs: 8.6, ta: 'start', top: true, boldFirst: true, k: 'what' });
    s += D.box(186, 182, 166, 50, 'It CANNOT verify: the goal\nchosen by the commissioner,\nnor how results are used', { c: 'r', fs: 8.6, ta: 'start', boldFirst: false, k: 'not' });
    s += D.box(186, 240, 166, 66, 'Reviewer skills (ILCD):\nindependence · language ·\nLCA methodology · review/\naudit experience · system\n(sector) expertise', { c: 'b', fs: 8.6, ta: 'start', top: true, boldFirst: true, k: 'skills' });
    s += D.box(8, 314, 344, 50, 'MANDATORY for comparative assertions disclosed to the public\n→ panel of interested parties (chair + at least 2 members);\notherwise optional: internal or external independent expert.', { c: 'o', fs: 8.8, ta: 'start', boldFirst: true, k: 'when' });
    return D.svg(360, 370, s, 'Critical review');
  }, {
    def: 'The review ensures that the LCA is consistent with the principles and requirements of the ISO standards. It increases credibility but is <b>no full substitute for transparency</b>.',
    proc: '<b>Procedure</b> (example EAGM study): panel commissioned → 1st draft → 2nd draft → meeting with the commissioner → data review → panel comments → amended report → final report + review report. Accompanying (interactive) is better than retrospective.',
    what: 'The reviewers assess: methods consistent with ISO, scientifically and technically valid; data appropriate and reasonable in relation to the goal; interpretation reflects the limitations and the goal; report transparent and consistent. Typically critical in comparisons: FU (same function, lifetime), system boundaries, allocation, data quality, choice of impact categories, no weighting.',
    not: 'The review can validate neither the <b>goal</b> chosen by the commissioner nor the <b>use</b> of the results.',
    skills: 'Requirements (ILCD 2012): independence, language, LCA methodology, review/audit experience, system or sector expertise. Problems: who pays (independence)? Hidden interests (know-how drain, competition, reviewer is a data provider)?',
    when: '<b>Mandatory</b> only for <b>comparative assertions disclosed to the public</b>, as a <b>panel of interested parties</b> (at least 3 members incl. the chair). Otherwise voluntary.',
  });

  // 21 ─────────────────────────────────────────── double materiality
  def('double-materiality', 'Double materiality (CSRD)', 'Early "sustainable" investors only looked from the outside in. A real sustainability approach also considers the company\'s impact on the environment and society (ecobalance).', () => {
    let s = D.text(180, 30, 'Financial materiality (outside-in)\nhow climate risks, regulation, scarcity\naffect cash flows and company value', { fs: 9, a: 'middle', lh: 11.5 });
    s += D.box(8, 84, 104, 82, 'Company', { c: 'c', fs: 13, bold: true, k: 'co' });
    s += D.box(248, 84, 104, 82, 'Environment\n& society', { c: 'g', fs: 12, bold: true, k: 'env' });
    s += D.arrow(246, 104, 114, 104, { c: 'r' });
    s += D.arrow(114, 146, 246, 146, { c: 'g' });
    s += D.text(180, 186, 'Impact materiality (inside-out)\ncompany impacts on people & planet\n→ ecobalance, LCA, GHG balance', { fs: 9, a: 'middle', lh: 11.5 });
    s += D.text(180, 236, 'CSRD/ESRS require BOTH perspectives', { fs: 9.6, a: 'middle', bold: true });
    return D.svg(360, 246, s, 'Double materiality');
  }, {
    co: 'Materiality assessment: a pre-analysis of relevance to focus on the key topics.',
    env: 'Impact perspective: what does the company cause for the environment and people (incl. the supply chain)? Tools: ecobalance, GHG inventory, social hotspots.',
  });

  // 22 ─────────────────────────────────────────── stakeholders
  def('stakeholders', 'Stakeholder map (example hotel)', 'Stakeholder = person or group that affects or is affected by an organisation (ISO 14001: "interested party"). They often provide the reasons for a sustainability orientation.', () => {
    const cx = 180, cy = 150;
    const L = ['Owners /\nshareholders', 'Staff', 'Clients\n(guests)', 'Suppliers', 'Banks', 'Insurances', 'Authorities\n(local, federal)', 'NGOs', 'Media,\npublic', 'Competitors', 'Partners (tour\noperators)', 'Local\ncommunity'];
    let s = '';
    const pts = L.map((t, i) => { const a = (-90 + i * 30) * Math.PI / 180; return [cx + 134 * Math.cos(a), cy + 116 * Math.sin(a), t]; });
    pts.forEach(([x, y]) => { s += D.line(cx, cy, x, y); });
    pts.forEach(([x, y, t], i) => { s += D.box(x - 42, y - 15, 84, 30, t, { c: i % 3 === 0 ? 'p' : i % 3 === 1 ? 'b' : 'y', fs: 8.4, k: 'st' + i }); });
    s += D.ell(cx, cy, 58, 30, 'Organisation\n(e.g. hotel)', { c: 'c', fs: 10, bold: true });
    return D.svg(360, 300, s, 'Stakeholders');
  }, (() => {
    const t = ['Owners/shareholders: return, risk, reputation, long-term value.', 'Employees: working conditions, purpose, health, training.', 'Customers/guests: quality, price, environmental expectations, labels.', 'Suppliers: passing on requirements (supply chain), partnerships.', 'Banks: credit risks, ESG criteria, green loans.', 'Insurances: environmental and liability risks, premiums.', 'Authorities: laws, permits, inspections, reporting (e.g. ETH → federal government).', 'NGOs: campaigns, watchdogs, cooperation.', 'Media/public: image, scandals, trust.', 'Competitors: benchmarks, sector standards, cooperation in initiatives.', 'Partners (tour operators, tourism associations): labels, requirements.', 'Local community: noise, traffic, jobs, landscape.'];
    const o = {}; t.forEach((x, i) => { o['st' + i] = x; }); return o;
  })());

  // 23 ─────────────────────────────────────────── MCDA
  def('mcda', 'Multi-criteria decision analysis (MCDA)', 'MCDA separates "facts" (predictions of the outcomes) from "values" (stakeholder preferences). MAVT: total value = Σ weight × value function.', () => {
    const st = ['1 Structure problem, stakeholders', '2 Objectives & attributes', '3 Alternatives (options)', '4 Predict outcomes (+ uncertainty)', '5 Elicit preferences: weights,\n   value functions (swing)', '6 Aggregate: V = Σ wᵢ · vᵢ(xᵢ), rank', '7 Sensitivity analysis, discuss'];
    let s = '';
    st.forEach((t, i) => { const h = i === 4 ? 36 : 26; const y = 8 + i * 32 + (i > 4 ? 10 : 0); s += D.box(8, y, 200, h, t, { c: i === 3 ? 'p' : i === 4 ? 'c' : 'n', fs: 8.8, ta: 'start', k: 'm' + (i + 1) }); });
    const box = { x: 232, y: 18, w: 112, h: 72 };
    s += D.text(222, 12, 'value function v(x)', { fs: 8.8, bold: true });
    s += D.line(box.x, box.y + box.h, box.x + box.w, box.y + box.h) + D.line(box.x, box.y, box.x, box.y + box.h);
    s += `<path d="${D.curve((x) => 1 - Math.exp(-3 * x), 0, 1, box, 40)}" class="stroke-c" fill="none" stroke-width="2"/>`;
    s += D.text(box.x - 3, box.y + 6, '1', { fs: 8, a: 'end', cls: 'lab' }) + D.text(box.x - 3, box.y + box.h, '0', { fs: 8, a: 'end', cls: 'lab' }) + D.text(box.x + box.w, box.y + box.h + 11, 'attribute', { fs: 8, a: 'end', cls: 'lab' });
    s += D.text(222, 128, 'weights (swing method)', { fs: 8.8, bold: true });
    [['cost', 0.5], ['CO₂', 0.4], ['reliability', 0.1]].forEach(([t, w], i) => { const y = 138 + i * 22; s += D.text(222, y + 12, t, { fs: 8.6 }) + D.rect(282, y + 2, w * 120, 14, 'fill-c', { r: 2, op: 0.8 }) + D.text(286 + w * 120, y + 13, w.toFixed(1), { fs: 8.6, bold: true }); });
    s += D.text(222, 226, 'facts ↔ values', { fs: 8.8, bold: true, cls: 't-o' }) + D.text(222, 238, 'kept separate', { fs: 8.6, cls: 'lab' });
    return D.svg(360, 252, s, 'MCDA');
  }, {
    m1: 'Structure the problem: what is the decision, who is affected (stakeholder analysis), what is the frame (time, space, budget)?',
    m2: 'Structure the objectives hierarchically and define measurable attributes, e.g. cost in CHF/a, CO₂ in kg/a, N and P recovery in %.',
    m3: 'Identify alternatives (e.g. central WWTP, decentralized package plants, hybrid), including creative ones and the status quo.',
    m4: 'Predictions = knowledge of the experts (e.g. LCA results, costs, reliability), including uncertainty.',
    m5: 'Preferences = values of the stakeholders: weights (e.g. swing method) and value functions (0 = worst, 1 = best value). Descriptive decision analysis (how people decide) vs. prescriptive (how one should decide rationally).',
    m6: 'MAVT/MAUT: additive model V = Σ wᵢ·vᵢ(xᵢ). Ranking of the alternatives.',
    m7: 'Sensitivity analysis on weights and value functions: does the best option remain stable?',
  });

  // 24 ─────────────────────────────────────────── optimization / Pareto
  def('pareto', 'Optimization & Pareto front', 'Optimization finds the best solution among many possibilities instead of comparing only a few scenarios. With several objectives there is no single best solution but a Pareto front.', () => {
    let s = '';
    const X = 40, Y = 14, W = 300, H = 140;
    s += D.line(X, Y + H, X + W, Y + H) + D.line(X, Y, X, Y + H);
    s += D.text(X + W, Y + H + 14, 'cost →', { fs: 9, a: 'end', cls: 'lab' }) + D.text(X - 4, Y + 8, 'impact', { fs: 9, a: 'end', cls: 'lab' }) + D.text(X - 4, Y + 20, '↑', { fs: 9, a: 'end', cls: 'lab' });
    const front = [[0.06, 0.9], [0.14, 0.55], [0.26, 0.33], [0.42, 0.2], [0.62, 0.12], [0.88, 0.08]];
    const dom = [[0.3, 0.7], [0.5, 0.5], [0.7, 0.4], [0.45, 0.82], [0.8, 0.7], [0.6, 0.28], [0.9, 0.3]];
    const px = ([a, b]) => [X + a * W, Y + H - b * H];
    let d = ''; front.forEach((p, i) => { const [x, y] = px(p); d += (i ? 'L' : 'M') + x + ',' + y + ' '; });
    s += `<path d="${d}" class="stroke-c" fill="none" stroke-width="2"/>`;
    dom.forEach((p) => { const [x, y] = px(p); s += `<circle cx="${x}" cy="${y}" r="4.5" class="fill-n" opacity=".6"/>`; });
    front.forEach((p) => { const [x, y] = px(p); s += `<circle cx="${x}" cy="${y}" r="5" class="fill-c"/>`; });
    s += D.text(X + 0.3 * W, Y + H - 0.82 * H, 'Pareto front: improving one\nobjective worsens another', { fs: 8.8, cls: 't-c', bold: true });
    s += D.text(X + 0.66 * W, Y + H - 0.58 * H, 'dominated', { fs: 8.6, cls: 'lab' });
    s += D.box(8, 172, 344, 72, 'Linear program: min z = cost (or Σ impact = Q·B·s)\nsubject to: demand met (A·s = f) · capacity limits ·\npollution / legal limits · technology network · s ≥ 0\nDecision variables: e.g. which technologies, how much of each', { c: 'n', fs: 8.8, ta: 'start', boldFirst: true, k: 'lp' });
    return D.svg(360, 250, s, 'Pareto front');
  }, {
    lp: '<b>LP structure</b>: objective function (cost, environmental impact or weighted), decision variables (process intensities s), constraints (meet demand, capacities, emission limits, available technologies). Optimization ≠ consequential LCA, but it needs marginal (consequential) thinking. Example house refurbishment: min cost or impact s.t. heat demand covered, budget ≤ X, PV area ≤ Y m².',
  });

  // 25 ─────────────────────────────────────────── global vs regional
  def('regional', 'Global vs. regional: when is regionalization needed?', 'Regionalization pays off for categories whose impact depends strongly on the location. It needs regionalized LCI data AND regionalized characterization factors.', () => {
    let s = D.arrow(14, 30, 346, 30, { both: true, c: 'a' });
    s += D.text(14, 18, 'GLOBAL (location irrelevant)', { fs: 9, bold: true }) + D.text(346, 18, 'LOCAL / REGIONAL', { fs: 9, a: 'end', bold: true });
    const chips = [[8, 40, 'Climate change', 'g', 'cc'], [8, 70, 'Ozone depletion', 'g', 'od'], [124, 40, 'Acidification', 'y', 'ac'], [124, 70, 'Eutrophication', 'y', 'eu'], [124, 100, 'Photochem. ozone', 'y', 'po'], [240, 40, 'PM2.5 (health)', 'o', 'pm'], [240, 70, 'Toxicity', 'o', 'tox'], [240, 100, 'Land use', 'o', 'land'], [240, 130, 'Water use', 'o', 'water'], [240, 160, 'Noise', 'o', 'noise']];
    chips.forEach(([x, y, t, c, k]) => { s += D.box(x, y, 112, 24, t, { c, fs: 9, k }); });
    s += D.box(8, 196, 168, 64, 'Global: well-mixed, long-lived\n(CO₂ ~ centuries) → one CF\nworldwide. Impacts still differ\nregionally!', { c: 'n', fs: 8.6, ta: 'start', k: 'glob' });
    s += D.box(184, 196, 168, 64, 'Regional: CF depends on place\n(population density, ecosystem\nsensitivity, water scarcity, e.g.\nAWARE 0.1–100) → need both', { c: 'n', fs: 8.6, ta: 'start', k: 'reg' });
    return D.svg(360, 266, s, 'Regionalization');
  }, {
    cc: 'Climate change: the emission location does not matter (well mixed, long-lived) → no regionalized CFs needed. But the damages hit regions differently (often poor countries).',
    od: 'Ozone depletion: global, long-lived substances (CFCs).',
    ac: 'Acidification: SO₂ and NOₓ are short-lived → regional deposition; soil sensitivity differs.',
    eu: 'Eutrophication: depends on the receiving water body (P-limited vs. N-limited).',
    po: 'Summer smog: depends on solar radiation, the NOₓ/VOC ratio and population.',
    pm: 'Particulate matter: CFs vary by orders of magnitude (urban China vs. rural USA). Depends on population density, stack height, weather. High resolution needed.',
    tox: 'Toxicity: fate and exposure depend on the environmental medium, climate, population and diet.',
    land: 'Land use: biodiversity loss depends strongly on the ecoregion (species-area relationship, vulnerability of endemic species).',
    water: 'Water use: 1 m³ in the desert ≠ 1 m³ in Switzerland. AWARE CFs from 0.1 to 100. Within a country the differences are often larger than between countries (Yellow River 90.6 vs. southern China 0.5).',
    noise: 'Noise: purely local (distance, number of people affected, time of day).',
    glob: 'For global categories one factor per substance is enough.',
    reg: 'Regionalization reduces (spatial) uncertainty. It requires location information in the LCI (where is it emitted or where is water withdrawn?) and matching regional CFs. The resolutions of LCI and LCIA should fit together.',
  });

  // 26 ─────────────────────────────────────────── weighting pyramid
  def('weighting-pyramid', 'Levels of aggregation: inventory → single score', 'The higher up the pyramid, the easier for management – but the more value judgements. For internal process optimization physical data are often best, ideally derived from a weighted analysis.', () => {
    let s = '';
    const lv = [['Single score (1)', 'c', 'UBP, ReCiPe points', 'ss'], ['Damage / endpoints (3)', 'r', 'DALY, species·yr, USD', 'dm'], ['Midpoint categories (10–15)', 'p', 'kg CO₂-eq, mol H⁺-eq', 'mp'], ['Inventory (≈ 1000s of flows)', 'n', 'kg CO₂, kg NOₓ, kWh, m³', 'inv']];
    lv.forEach(([t, c, ex, k], i) => {
      const y = 10 + i * 50, top = 40 + (3 - i) * 0, w1 = 50 + i * 60, w2 = 110 + i * 60, cx = 130;
      s += `<g class="hot" data-k="${k}"><polygon points="${cx - w1 / 2},${y} ${cx + w1 / 2},${y} ${cx + w2 / 2},${y + 46} ${cx - w2 / 2},${y + 46}" class="b-${c}"/>`;
      s += D.text(cx, y + 20, t, { fs: 8.8, a: 'middle', bold: true, cls: 't-' + c }) + D.text(cx, y + 33, ex, { fs: 8, a: 'middle', cls: 't-' + c }) + '</g>';
      void top;
    });
    s += D.arrow(318, 200, 318, 14, { c: 'a' }) + D.text(312, 60, 'easier to\ncommunicate,\nmore value\nchoices', { fs: 8.6, a: 'end', lh: 11 });
    s += D.arrow(338, 14, 338, 200, { c: 'g' }) + D.text(312, 150, 'more complete,\nmore objective,\nharder to\ninterpret', { fs: 8.6, a: 'end', lh: 11 });
    return D.svg(360, 214, s, 'Weighting pyramid');
  }, {
    ss: '<b>Single score</b>: overview, priorities, trade-offs are "resolved", decision support. But it contains political and societal values, seems "final", and ISO does not allow it for public comparisons. Weighting methods exist only for some world regions (CH, EU, Japan, Latin America).',
    dm: '<b>Endpoints</b>: human health, ecosystem quality, resources. More relevant, but more uncertain.',
    mp: '<b>Midpoints</b>: e.g. GHG only (CO₂-eq) is easy to understand and internationally accepted, but covers only one environmental problem (burden shifting possible).',
    inv: '<b>Inventory key figures</b> (kWh/m², kg paper/FTE, km/FTE): close to the process, easy to understand, good for benchmarking – but they say nothing about environmental relevance.',
  });

  // 27 ─────────────────────────────────────────── supply chain approach
  def('supply-chain', 'Sustainable supply chain management: steps', 'With buying power and identifiable brands, it becomes necessary to ensure human rights and environmental standards in the supply chain: declarations, training, audits, clear consequences.', () => {
    let s = '';
    const st = [['0 No activity', 'n'], ['1 Check supply\nchains for risks', 'y'], ['2 Suppliers\nsign code of\nconduct', 'y'], ['3 Detailed\nanalysis:\n(a) key suppliers\n(b) own\npurchasing', 'o'], ['4 Plan &\nimplement\nimprove-\nments', 'g']];
    st.forEach(([t, c], i) => { const h = 40 + i * 32, y = 200 - h; s += D.box(8 + i * 70, y, 66, h, t, { c, fs: 8.2, top: true, k: 'sc' + i }); });
    s += D.arrow(14, 214, 346, 214, { c: 'a' }) + D.text(180, 230, 'increasing depth of supply chain management', { fs: 8.8, a: 'middle', cls: 'lab' });
    s += D.text(180, 248, 'Tools: declarations · training · audits · consequences · SA8000 · BSCI', { fs: 8.8, a: 'middle', bold: true });
    return D.svg(360, 256, s, 'Supply chain steps');
  }, {
    sc0: 'No activity: a risk for the image and (e.g. under CSRD/CSDDD) for compliance.',
    sc1: 'Screen risks: countries, sectors, raw materials (child labour, forced labour, deforestation, water).',
    sc2: 'Suppliers sign a code of conduct. But: "paper is patient".',
    sc3: 'Detailed analysis of the key suppliers (questionnaires, audits) and of the own purchasing processes (e.g. price pressure and short lead times cause overtime).',
    sc4: 'Plan and implement improvements: training, partnerships, audits, clear consequences, sector initiatives (BSCI, RSPO for palm oil).',
  });

  // 28 ─────────────────────────────────────────── conditions for change
  def('conditions-change', 'Conditions for change', 'A new strategy and targets alone are not enough. New structural and cultural frameworks and the involvement of everyone are needed too.', () => {
    let s = '';
    [['New strategy\n& targets', 'p', 8], ['New structural\nframework', 'b', 124], ['New cultural\nframework', 'o', 240]].forEach(([t, c, x]) => { s += D.box(x, 6, 112, 36, t, { c, fs: 9, bold: true }); });
    const cols = [['1 Mission &\nannual\ngoals of\nsenior\npositions', 'p'], ['2 Periodic\ninfo on\ntarget\nachieve-\nment', 'p'], ['3 Assess-\nment &\nincentives\nbased on\ntargets', 'b'], ['4 Organi-\nsational &\ntechnical\nsupport', 'b'], ['5 Superiors\nas role\nmodels', 'o'], ['6 Sensiti-\nsation,\ninfo,\ntraining', 'o']];
    cols.forEach(([t, c], i) => { s += D.box(8 + i * 58, 50, 54, 92, t, { c, fs: 8, top: true, k: 'cc' + (i + 1) }); });
    s += D.box(8, 150, 344, 30, '7 Optimal involvement of and communication between all involved', { c: 'g', fs: 9, k: 'cc7' });
    s += D.arrow(180, 180, 180, 196) + D.box(100, 198, 160, 34, 'Change of conduct', { c: 'c', fs: 11, bold: true });
    return D.svg(360, 238, s, 'Conditions for change');
  }, {
    cc1: 'Mission statement and annual goals, also for senior positions (sustainability targets in target agreements).',
    cc2: 'Periodic information on target achievement (reporting, dashboards).',
    cc3: 'Assessment and incentives based on target achievement (e.g. a share of the bonus).',
    cc4: 'Organisational and technical support (specialist unit, tools, budget).',
    cc5: 'Superiors as role models (culture!).',
    cc6: 'Sensitisation, information, training.',
    cc7: 'Optimal involvement of and communication between everyone involved.',
  });

  // 29 ─────────────────────────────────────────── banknote relevance
  def('banknote', 'Exam case banknotes: product LCA vs. the bank\'s footprint', 'Answer to "How relevant are the banknotes for the national bank\'s environmental performance?": the two views overlap only partly. You need data on all of the bank\'s activities and a suitable unit.', () => {
    let s = D.text(8, 14, 'Product LCA: banknote life cycle (functional unit)', { fs: 9.4, bold: true, cls: 't-p' });
    const ch = [['Cotton\nfarming', 8], ['Paper mill\n(security paper)', 96], ['Printing\nworks', 184], ['Use /\ncirculation', 272]];
    ch.forEach(([t, x], i) => { s += D.box(x, 22, 80, 40, t, { c: 'p', fs: 8.6, k: 'lc' }); if (i < 3) s += D.arrow(x + 80, 42, x + 88, 42); });
    s += D.arrow(312, 62, 312, 80) + D.box(272, 82, 80, 42, 'Incineration\n(+ electricity,\nsteam)', { c: 'p', fs: 8.4, k: 'eol' });
    s += D.box(8, 96, 252, 150, '', { c: 'c', r: 10, dash: true, k: 'dn' });
    s += D.text(16, 113, 'Nationalbank – company footprint (1 year)', { fs: 9, bold: true, cls: 't-c' });
    s += D.box(16, 122, 76, 50, 'Storage &\ndistribution\n(vaults)', { c: 'p', fs: 8.4, k: 'both' });
    s += D.box(98, 122, 76, 50, 'Buildings,\nheating\n(Scope 1/2)', { c: 'c', fs: 8.4, k: 'other' });
    s += D.box(180, 122, 74, 50, 'IT, offices,\ntravel\n(Scope 1–3)', { c: 'c', fs: 8.4, k: 'other' });
    s += D.box(16, 182, 238, 54, 'Purchased banknotes / printing services\n= Scope 3, cat. 1 (purchased goods)\n(only partly inside the bank)', { c: 'y', fs: 8.6, k: 'pur' });
    s += D.path('M224,62 C224,120 236,150 236,180', { arrow: true, dash: true });
    s += D.box(268, 150, 84, 96, 'Relevance?\nneeds data on\nALL activities;\nunits: CO₂-eq,\nUBP, MJ, CHF', { c: 'o', fs: 8.4, boldFirst: true, k: 'rel' });
    return D.svg(360, 252, s, 'Banknote relevance');
  }, {
    lc: 'The product LCA follows the banknote from cotton to incineration, regardless of which company performs a step.',
    eol: 'Incineration with electricity and steam production → multifunctional: system expansion or credit (avoided electricity and heat) following the ISO hierarchy.',
    dn: 'The company footprint covers all of the bank\'s activities in one year: Scope 1 (heating, vehicles), Scope 2 (electricity), Scope 3 (purchases incl. banknote printing, travel, IT, commuting …).',
    both: 'Overlap: storage and distribution of the banknotes belong to both views.',
    other: 'Other bank activities are not part of the banknote LCA, but part of the company footprint.',
    pur: 'Purchased banknotes or printing services appear in the company footprint as Scope 3, category 1.',
    rel: '<b>Judging relevance</b>: (1) collect data on all relevant activities (Scopes 1–3 or company ecobalance), (2) choose and discuss the unit: CO₂-eq (understandable, climate only), UBP single score (comprehensive, weighted), MJ (energy), CHF (costs show leverage and priorities for management), (3) compare the share of the banknotes in the total.',
  });

  // 30 ─────────────────────────────────────────── ISO map
  def('iso-map', 'ISO map: organisation vs. product', 'Tap a standard. Organisational standards on the left (management and performance assessment), product standards on the right (assessment and communication).', () => {
    let s = D.box(8, 6, 168, 24, 'Standards for ORGANISATIONS', { c: 'c', fs: 9.4, bold: true }) + D.box(184, 6, 168, 24, 'Standards for PRODUCTS', { c: 'p', fs: 9.4, bold: true });
    const grp = (x, y, title, items, c) => {
      let g = D.text(x, y, title, { fs: 8.8, bold: true, cls: 'lab' });
      items.forEach(([t, k], i) => { g += D.box(x + (i % 2) * 85, y + 6 + Math.floor(i / 2) * 34, 81, 30, t, { c, fs: 8.2, k }); });
      return g;
    };
    s += grp(8, 46, 'Management systems', [['14001\nEMS', 'iso14001'], ['14004\nEMS guidance', 'iso14004'], ['50001\nenergy mgmt', 'iso50001'], ['9001\nquality', 'iso9001']], 'c');
    s += grp(8, 132, 'Performance assessment', [['14064-1\nGHG inventory', 'iso14064'], ['14072 (TS)\norg. LCA', 'iso14072'], ['14031\nenv. perf. eval.', 'iso14031'], ['14068-1\ncarbon neutral.', 'iso14068']], 'c');
    s += grp(8, 218, 'Social / procurement', [['SA8000\nsocial (cert.)', 'sa8000'], ['26000\nsocial resp.', 'iso26000'], ['20400\nsust. procurem.', 'iso20400'], ['GHG Protocol\n(WRI/WBCSD)', 'ghgp']], 'v');
    s += grp(184, 46, 'Assessment', [['14040\nLCA principles', 'iso14040'], ['14044\nLCA requirem.', 'iso14044'], ['14067\ncarbon footprint', 'iso14067'], ['14046\nwater footprint', 'iso14046'], ['14071 (TS)\ncritical review', 'iso14071'], ['PEF / OEF\n(EU)', 'pef']], 'p');
    s += grp(184, 166, 'Labels & declarations', [['14021 Type II\nself-declared', 'iso14021'], ['14024 Type I\necolabel', 'iso14024'], ['14025 Type III\nEPD', 'iso14025'], ['EN 15804\nEPD building', 'en15804']], 'g');
    return D.svg(360, 296, s, 'ISO map');
  }, null, { infoFn: (k) => { const e = A.iso.find((x) => x.id === k); return e ? `<b>${e.code} – ${e.title}</b><br>${e.what}<br><a href="#/iso/${e.id}">→ open in the ISO compass</a>` : ''; } });

  // 31 ─────────────────────────────────────────── risk vs LCA (bonus)
  def('risk-vs-lca', 'Risk assessment vs. LCA', 'Older exams often asked about similarities and differences. Both use fate, exposure and effect models, but answer different questions.', () => {
    const rows = [['', 'Risk assessment (RA)', 'LCA'], ['Question', 'Is it safe here?', 'Which option is better?'], ['Reference', 'site, concentration', 'functional unit'], ['Space/time', 'local, specific time', 'global, integrated'], ['Thresholds', 'yes: PEC/PNEC, NOEC', 'no: linear, marginal'], ['Result', 'absolute risk (RQ)', 'relative impact score'], ['Approach', 'conservative (worst case)', 'best estimate'], ['Common', 'fate · exposure · effect models', '']];
    let s = '';
    rows.forEach((r, i) => {
      const y = 6 + i * 28;
      if (i === 7) { s += D.box(8, y, 344, 24, 'Common: fate → exposure → effect modelling (e.g. USEtox in LCA)', { c: 'g', fs: 8.8 }); return; }
      s += D.box(8, y, 84, 24, r[0], { c: i === 0 ? 'w' : 'n', fs: 8.6, bold: true });
      s += D.box(96, y, 126, 24, r[1], { c: i === 0 ? 'o' : 'w', fs: 8.6, bold: i === 0 });
      s += D.box(226, y, 126, 24, r[2], { c: i === 0 ? 'p' : 'w', fs: 8.6, bold: i === 0 });
    });
    return D.svg(360, 232, s, 'RA vs LCA');
  });

  // 32 ─────────────────────────────────────────── indoor box models (bonus)
  def('box-model', 'Indoor exposure: one-box and near-/far-field', 'Steady state: concentration = emission rate / ventilation. For nearby sources (workers filling solvents) the one-box model underestimates the concentration → two-box (near/far field) or eddy diffusion.', () => {
    let s = D.rect(8, 22, 160, 120, 'b-w', { r: 8 }) + D.text(88, 16, 'One-box (well mixed)', { fs: 9.4, a: 'middle', bold: true });
    s += D.ell(88, 92, 14, 14, 'E', { c: 'o', fs: 10, bold: true });
    s += D.arrow(0, 44, 26, 44, { c: 'a' }) + D.arrow(150, 120, 176, 120, { c: 'a' }) + D.text(30, 40, 'Q in', { fs: 8.6 }) + D.text(130, 114, 'Q out', { fs: 8.6, a: 'end' });
    s += D.text(88, 160, 'C_ss = E / Q,   Q = ACH · V', { fs: 9.6, a: 'middle', bold: true });
    s += D.rect(190, 22, 162, 120, 'b-w', { r: 8 }) + D.text(271, 16, 'Near field / far field', { fs: 9.4, a: 'middle', bold: true });
    s += `<circle cx="271" cy="86" r="34" class="b-y"/>`;
    s += D.ell(271, 86, 12, 12, 'E', { c: 'o', fs: 10, bold: true });
    s += D.text(271, 62, 'NF', { fs: 8.6, a: 'middle', bold: true }) + D.text(330, 40, 'FF', { fs: 8.6, a: 'middle', bold: true }) + D.text(306, 116, 'β', { fs: 10, bold: true });
    s += D.text(271, 160, 'C_FF = E/Q,  C_NF = C_FF + E/β', { fs: 9.6, a: 'middle', bold: true });
    s += D.text(8, 186, 'Data needs: emission rate, room volume, ventilation (ACH), number &', { fs: 8.8 });
    s += D.text(8, 198, 'position of sources, worker behaviour, interzonal airflow β (two-box).', { fs: 8.8 });
    s += D.text(8, 214, 'Risk: RQ = exposure / limit (e.g. PEC/PNEC; occupational limit).', { fs: 8.8, bold: true });
    return D.svg(360, 222, s, 'Box models');
  });

  // 33 ─────────────────────────────────────────── ecolabels
  def('labels', 'Environmental labels type I, II, III (ISO 14020 family)', 'Often confused: type I is a label (logo, third-party certification), type II a self-declaration, type III a data declaration (EPD) based on LCA.', () => {
    const c = [['Type I – ecolabel\nISO 14024', 'g', '• third-party certified\n• multi-criteria, life\n  cycle based\n• pass/fail → logo\n• e.g. Blauer Engel,\n  EU Ecolabel, Nordic\n  Swan', 't1'], ['Type II – self-\ndeclared claim\nISO 14021', 'y', '• by the company itself\n• single claim, e.g.\n  "recyclable",\n  "30 % recycled"\n• must be verifiable,\n  not misleading\n  (EU Green Claims)', 't2'], ['Type III – EPD\nISO 14025\n(+ EN 15804)', 'p', '• quantified LCA data\n• Product Category\n  Rules (PCR)\n• third-party verified\n• no judgement: user\n  compares', 't3']];
    let s = '';
    c.forEach(([h, col, t, k], i) => { const x = 8 + i * 118; s += D.box(x, 6, 108, 48, h, { c: col, fs: 8.8, bold: true, k }); s += D.box(x, 60, 108, 112, t, { c: 'w', fs: 8.3, ta: 'start', top: true, k }); });
    s += D.text(180, 192, 'ISO 14020: general principles (accurate, verifiable, relevant, not misleading)', { fs: 8.6, a: 'middle', cls: 'lab' });
    return D.svg(360, 200, s, 'Ecolabels');
  }, {
    t1: '<b>Type I</b> (ISO 14024): voluntary, multi-criteria label of an independent body; criteria cover the life cycle, awarded if met.',
    t2: '<b>Type II</b> (ISO 14021): self-declaration by the company without third-party certification (e.g. "compostable"). Must be accurate, verifiable and not misleading.',
    t3: '<b>Type III</b> (ISO 14025): quantitative environmental declaration (EPD) based on LCA according to product category rules, externally verified. Construction: EN 15804 with modules A–D.',
  });

  // 34 ─────────────────────────────────────────── growth dynamics
  def('growth', 'Growth dynamics: exponential growth', 'Doubling time ≈ 70 / growth rate in %. Even a reduced rate leads to growth, just more slowly – which gives time to implement solutions.', () => {
    const X = 40, Y = 12, W = 300, H = 150;
    let s = D.line(X, Y + H, X + W, Y + H) + D.line(X, Y, X, Y + H);
    const rates = [[0.005, 'n', '0.5 %'], [0.025, 'p', '2.5 %'], [0.035, 'c', '3.5 %'], [0.045, 'o', '4.5 %']];
    const yr = 100, max = Math.pow(1.045, yr);
    rates.forEach(([r, c, t]) => {
      let d = '';
      for (let i = 0; i <= 50; i++) { const t2 = (yr * i) / 50, v = Math.pow(1 + r, t2); d += (i ? 'L' : 'M') + (X + (W * i) / 50).toFixed(1) + ',' + (Y + H - (v / max) * H).toFixed(1) + ' '; }
      s += `<path d="${d}" class="stroke-${c}" fill="none" stroke-width="2"/>`;
      const vEnd = Math.pow(1 + r, yr);
      s += D.text(X + W + 2, Math.max(Y + 8, Y + H - (vEnd / max) * H + 3), t, { fs: 8.6, bold: true });
    });
    s += D.text(X + W, Y + H + 14, '100 years', { fs: 8.6, a: 'end', cls: 'lab' }) + D.text(X, Y + H + 14, '0', { fs: 8.6, cls: 'lab' });
    s += D.text(8, 196, 'Doubling time: 2.5 % → 28 a · 3.5 % → 20 a · 4.5 % → 16 a', { fs: 9, bold: true });
    s += D.text(8, 210, 'Growth has no intrinsic value: ask WHAT grows and which side effects occur.', { fs: 8.8 });
    return D.svg(360, 218, s, 'Growth');
  });

  // 35 ─────────────────────────────────────────── policy instruments
  def('policy', 'Environmental policy instruments', 'Ecological tax reform: tax "bads" (energy, CO₂) instead of "goods" (labour) and redistribute the revenue. Example: the Swiss CO₂ levy on heating fuels.', () => {
    const g = [['Communication', 'b', '• moral suasion\n• information &\n  education\n• behavioural hints\n  (nudges)', 'com'], ['Laws & regulation', 'o', '• emission limits\n• bans (e.g. toxic\n  substances)\n• standards', 'law'], ['Financial incentives', 'g', '• subsidies\n• (incentive) taxes,\n  ecological tax\n  reform\n• pollution rights\n  (cap & trade)', 'fin']];
    let s = '';
    g.forEach(([h, c, t, k], i) => { const x = 8 + i * 118; s += D.box(x, 6, 108, 30, h, { c, fs: 9, bold: true, k }); s += D.box(x, 42, 108, 104, t, { c: 'w', fs: 8.6, ta: 'start', top: true, k }); });
    s += D.box(8, 154, 344, 26, 'Political frameworks: voluntary commitments (e.g. sector agreements, SBTi)', { c: 'n', fs: 8.8, k: 'vol' });
    return D.svg(360, 186, s, 'Policy instruments');
  }, {
    com: '<b>Communication</b>: cheap and liberal, but weak effect (moral suasion, information, nudges such as default green electricity).',
    law: '<b>Command and control</b>: effective and clear (e.g. mandatory catalytic converters, CFC ban), but rigid, enforcement effort, no incentive to do better than the limit.',
    fin: '<b>Financial incentives</b>: incentive taxes use the price mechanism, are stable and predictable; freedom of choice remains; redistribution secures acceptance. Drawbacks: carbon leakage, distributional effects, politically sensitive, ineffective if too low. Criteria (öbu): necessary, effective, predictable (stepwise), fiscally neutral, no major distributional distortions, not harming exports, neutral for the consumer price index.',
    vol: 'Voluntary agreements: flexible, but free riders and a risk of greenwashing.',
  });

  // 36 ─────────────────────────────────────────── planetary boundaries / doughnut
  def('doughnut', 'Doughnut economics & planetary boundaries', 'Kate Raworth: a safe and just space between the social foundation (inside) and the ecological ceiling (outside). 2023: 6 of 9 planetary boundaries exceeded (Richardson et al.); 2025 update: 7 of 9 (incl. ocean acidification).', () => {
    const cx = 130, cy = 120;
    let s = `<circle cx="${cx}" cy="${cy}" r="100" class="b-r" opacity=".55"/><circle cx="${cx}" cy="${cy}" r="82" class="b-g"/><circle cx="${cx}" cy="${cy}" r="48" class="b-o" opacity=".6"/><circle cx="${cx}" cy="${cy}" r="34" class="b-w"/>`;
    s += D.text(cx, cy - 89, 'overshoot', { fs: 8.4, a: 'middle', bold: true, cls: 't-r' });
    s += D.text(cx, cy - 62, 'safe & just space', { fs: 8.8, a: 'middle', bold: true, cls: 't-g' });
    s += D.text(cx, cy - 37, 'shortfall', { fs: 8.2, a: 'middle', bold: true, cls: 't-o' });
    s += D.text(cx, cy + 4, 'social\nfoundation', { fs: 8.2, a: 'middle', cls: 'lab' });
    s += D.text(cx, cy + 74, 'ecological ceiling', { fs: 8.4, a: 'middle', cls: 'lab' });
    s += D.text(246, 22, 'Exceeded (2023):', { fs: 9, bold: true, cls: 't-r' }) + D.text(246, 36, '• climate change\n• biosphere integrity\n• land-system change\n• freshwater change\n• biogeochemical\n  flows (N, P)\n• novel entities', { fs: 8.6, lh: 11.5 });
    s += D.text(246, 134, 'Not (yet) / close:', { fs: 9, bold: true, cls: 't-g' }) + D.text(246, 148, '• ozone depletion\n• aerosol loading\n• ocean acidification\n  (2025: crossed)', { fs: 8.6, lh: 11.5 });
    return D.svg(360, 240, s, 'Doughnut');
  });
})();
