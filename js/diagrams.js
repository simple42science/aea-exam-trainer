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
  def('lca-framework', 'Die 4 Phasen der Ökobilanz (ISO 14040)', 'Tippe auf eine Phase. Die Auswertung ist mit allen Phasen verbunden: LCA ist iterativ. Anwendungen liegen ausserhalb des LCA-Rahmens.', () => {
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
    goal: '<b>Goal & scope:</b> Zweck, Zielgruppe, vergleichende Aussage geplant? Funktion, <b>funktionelle Einheit</b>, Referenzfluss, Systemgrenzen (cradle-to-gate/-grave), Abschneidekriterien, Allokationsregeln, LCIA-Methode, Datenqualitätsanforderungen, Annahmen, Limitationen, Critical Review.',
    lci: '<b>Inventory (Sachbilanz):</b> Flussdiagramm, Datensammlung pro Prozess (Inputs: Material, Energie; Outputs: Produkte, Emissionen, Abfall), Bezug auf die FU, Allokation bei multifunktionalen Prozessen. Vordergrund = Primärdaten, Hintergrund = Datenbanken (ecoinvent).',
    lcia: '<b>Impact assessment:</b> Pflicht: Auswahl der Wirkungskategorien, Indikatoren und Modelle, Klassifizierung, Charakterisierung. Optional: Normierung, Gruppierung, Gewichtung (Gewichtung darf <b>nicht</b> für öffentliche vergleichende Aussagen verwendet werden).',
    interp: '<b>Interpretation:</b> begleitet alle Phasen (iterativ). Signifikante Parameter identifizieren; Prüfungen auf Vollständigkeit, Sensitivität und Konsistenz; Schlussfolgerungen, Einschränkungen, Empfehlungen.',
    apps: '<b>Anwendungen</b> (ausserhalb der LCA): Produktentwicklung/Ökodesign, strategische Planung, Politik, Marketing (EPD, Umweltaussagen).',
  });

  // 2 ─────────────────────────────────────────── product vs company view
  def('product-company', 'Produktsicht vs. Organisationssicht', 'Die Grafik, die in beiden Kursen gezeigt wurde: Ein Produkt-Lebenszyklus läuft horizontal durch mehrere Firmen, eine Firmenbilanz schneidet vertikal durch viele Lebenszyklen. Beide überlappen nur teilweise.', () => {
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
    lc: '<b>Produkt-LCA (horizontal):</b> Ein Lebenszyklus läuft durch mehrere Firmen (Rohstoff → Herstellung → Nutzung → Entsorgung). Bezugsgrösse: <b>funktionelle Einheit</b>.',
    compA: '<b>Company A = Lieferant.</b> Aus Sicht von B: vorgelagerter Scope 3 (z. B. Kat. 1 Purchased goods).',
    compB: '<b>Company B = unsere Organisation (vertikal):</b> alle Aktivitäten in einer Periode (meist 1 Jahr), über alle Produkte. Bezugsgrösse: Organisation × Jahr. Werkzeuge: Betriebsökobilanz (ecobalance), THG-Bilanz (Scopes 1–3), EMS nach ISO 14001.',
    compC: '<b>Company C = Kunde, Nutzung, Entsorgung.</b> Aus Sicht von B: nachgelagerter Scope 3 (Kat. 11 Use of sold products, 12 End-of-life).',
    overlap: '<b>Überlappung nur teilweise!</b> Prüfungsklassiker Banknoten: Papierherstellung und Druck finden teils ausserhalb der Nationalbank statt, und Banknoten sind nur ein Teil der Bank-Aktivitäten. Um die Relevanz der Banknoten zu beurteilen, braucht es Umweltdaten <b>aller</b> anderen Aktivitäten (Gebäude, IT, Reisen, Einkauf) und eine passende Einheit (CO₂-eq, UBP, MJ, Kosten).',
    pv: 'Produktnormen: ISO 14040/44 (LCA), ISO 14067 (Carbon Footprint of Products), ISO 14025 + EN 15804 (EPD, Typ III), ISO 14046 (Water Footprint).',
    ov: 'Organisationsnormen: ISO 14001 (Umweltmanagementsystem), ISO 14064-1 bzw. GHG Protocol (THG-Inventar Scopes 1–3), ISO/TS 14072 (Organisations-LCA), ISO 14031 (Umweltleistungsbewertung).',
  });

  // 3 ─────────────────────────────────────────── GHG scopes
  def('scopes', 'GHG Protocol: Scope 1, 2, 3', 'Tippe auf einen Scope. Scope 3 hat 15 Kategorien (8 vorgelagert, 7 nachgelagert) und ist meist der grösste Teil.', () => {
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
    s1: '<b>Scope 1 – direkte Emissionen</b> aus Quellen, die die Firma besitzt oder kontrolliert: Heizöl/Gas, eigene Fahrzeuge, Prozessemissionen, Kältemittel-Leckagen.',
    s2: '<b>Scope 2 – indirekte Energie-Emissionen:</b> eingekaufter Strom, Wärme, Dampf, Kälte. Zwei Methoden: <b>location-based</b> (Netzmix) und <b>market-based</b> (Herkunftsnachweise, Verträge). Beide berichten (Dual Reporting).',
    s3u: '<b>Scope 3 vorgelagert (Kat. 1–8):</b> eingekaufte Güter & Dienstleistungen, Investitionsgüter, Vorkette der Energie, Transport, Abfall, Geschäftsreisen, Pendeln, geleaste Anlagen. Datenquelle oft spend-based (EE-IO, z. B. Swisscom) oder LCA-Daten.',
    s3d: '<b>Scope 3 nachgelagert (Kat. 9–15):</b> Transport zum Kunden, Weiterverarbeitung, <b>Nutzung der verkauften Produkte</b> (bei Autos/Geräten dominant), End-of-Life, Franchises, Investitionen (bei Banken dominant: „financed emissions“).',
    co: '<b>Organisationsgrenze</b>: Equity-share- oder Control-Ansatz (finanziell/operativ). Basisjahr festlegen; Ziele (SBTi) für Scope 1+2 und relevante Teile von Scope 3.',
  });

  // 4 ─────────────────────────────────────────── cause-effect chain
  def('cause-effect', 'Von der Sachbilanz zum Single Score (Midpoint → Endpoint)', 'Tippe auf eine Wirkungskategorie für Einheit und Modell. Je weiter unten, desto einfacher zu kommunizieren, aber desto unsicherer und wertgeladener.', () => {
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
    lci: 'Sachbilanz: Emissionen und Ressourcenentnahmen pro funktionelle Einheit (Elementarflüsse, oft >1000).',
    cc: '<b>Climate change</b>: kg CO₂-eq (GWP100, IPCC). Global, Emissionsort egal. Wichtigste Werteentscheidung: Zeithorizont (20/100/500 a).',
    od: '<b>Ozone depletion</b>: kg CFC-11-eq. Mehr UV-B → Hautkrebs, Katarakt (Human health).',
    pocp: '<b>Photochemical ozone formation</b> (Sommersmog): kg NMVOC-eq bzw. NOₓ-eq. Atemwege (HH) und Vegetation (EQ). Regional.',
    pm: '<b>Particulate matter</b>: primäres PM2.5 und sekundäres aus NOₓ, SO₂, NH₃ → Krankheitsfälle bzw. DALY. CF = Fate × Effect (bzw. Intake Fraction × Effekt). Stark regional: Bevölkerungsdichte, Kaminhöhe, Wetter.',
    htox: '<b>Human toxicity</b> (cancer / non-cancer): USEtox, CTUh = cases/kg. CF = FF × XF × EF.',
    ion: '<b>Ionising radiation</b>: kBq U235-eq → Human health.',
    acid: '<b>Acidification</b>: mol H⁺-eq bzw. kg SO₂-eq. Böden, Seen (EQ). Regional, da SO₂/NOₓ kurzlebig.',
    eutro: '<b>Eutrophication</b> (Süsswasser P, Meer N, terrestrisch): kg P-eq / N-eq. Algenblüten, Sauerstoffmangel.',
    etox: '<b>Freshwater ecotoxicity</b>: USEtox, CTUe = PAF·m³·d/kg (potentially affected fraction of species).',
    land: '<b>Land use</b>: Besetzung (occupation, m²·a) und Umwandlung (transformation, m²) → Artenverlust via Species-Area-Relationship. Stark regional.',
    water: '<b>Water use</b>: Wasser<b>verbrauch</b> (consumption, nicht withdrawal) × Knappheitsfaktor (AWARE 0.1–100) → m³ world-eq. HH (Mangelernährung) und EQ (Feuchtgebiete). Stark regional.',
    res: '<b>Resource use</b>: Mineralien und fossile Ressourcen, kg Sb-eq, MJ oder surplus cost (USD).',
    HH: '<b>Human health</b>: DALY = YLL + YLD (Years of Life Lost + Years Lived with Disability). 1 DALY = 1 verlorenes gesundes Lebensjahr.',
    EQ: '<b>Ecosystem quality</b>: potenziell verschwundene Arten, PDF·m²·yr oder species·yr.',
    R: '<b>Natural resources</b>: zukünftige Mehrkosten der Förderung (surplus cost, USD) bzw. MJ surplus energy.',
    single: '<b>Single score</b>: Gewichtung nach gesellschaftlichen Präferenzen (Panel, Politikziele: UBP = distance-to-target). Subjektiv, deshalb nach ISO 14044 <b>nicht</b> für öffentliche vergleichende Aussagen.',
  });

  // 5 ─────────────────────────────────────────── climate change chain
  def('climate-chain', 'Ursache-Wirkungs-Kette Klimawandel', 'In der Prüfung oft gefragt: die ganze Kette von der Emission bis zum Schaden, inklusive der Stufe, auf der GWP und GTP liegen.', () => {
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
    em: 'Treibhausgas-Emission in kg (Sachbilanz). CO₂, CH₄ (fossil/biogen), N₂O, F-Gase.',
    conc: '<b>Fate</b>: Wie lange bleibt das Gas in der Atmosphäre? CH₄ ca. 12 Jahre, N₂O ca. 110 Jahre, CO₂ mehrere Zerfallsterme (ein Teil bleibt Jahrhunderte). Atmosphäre ist gut durchmischt (One-Box), deshalb ist der Emissionsort egal.',
    rf: '<b>Radiative forcing</b> (Strahlungsantrieb) in W/m²: zusätzliche Energie pro Fläche durch höhere Konzentration.',
    temp: 'Temperaturanstieg (°C) als Folge des Strahlungsantriebs (mit Trägheit der Ozeane).',
    hh: 'Gesundheitsschäden in DALY: Mangelernährung, Malaria, Durchfallerkrankungen, Hitzestress, Überschwemmungen.',
    eq: 'Ökosystemschäden: Artenverlust (PDF·m²·yr bzw. species·yr) durch Verschiebung von Klimazonen.',
    vc: '<b>Werteentscheidungen</b>: v. a. der <b>Zeithorizont</b>. ReCiPe-Perspektiven: Individualist 20 a, Hierarchist 100 a, Egalitarian 1000 a bzw. unendlich. CH₄: GWP20 ≈ 80, GWP100 ≈ 27–30 (IPCC AR6), deshalb verändert der Zeithorizont Rankings.',
    gwp: '<b>GWP</b> = über den Zeithorizont integrierter Strahlungsantrieb von 1 kg Gas relativ zu 1 kg CO₂. Standard: GWP100.',
    gtp: '<b>GTP</b> (Global Temperature change Potential) = Temperaturänderung am Ende des Zeithorizonts, relativ zu CO₂. Näher am Schaden, aber unsicherer.',
    ep: 'Endpunkt: am relevantesten, aber am unsichersten (Klimamodelle, Anpassung, Sozioökonomie).',
  });

  // 6 ─────────────────────────────────────────── allocation tree
  def('alloc-tree', 'ISO 14044: Allokations-Hierarchie', 'Exakte Begriffe sind in der Prüfung wichtig: "subdivision", "system expansion", "allocation based on physical relationships", "other relationships (economic)".', () => {
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
    s1: '<b>Schritt 1: Allokation vermeiden.</b> ISO bevorzugt dies, weil jede Aufteilung eine Konvention ist.',
    sub: '<b>Unterteilung</b>: Den Prozess in Teilprozesse aufteilen, die jeweils nur ein Produkt liefern (z. B. separate Strommessung pro Produktionslinie). Geht nur, wenn die Prozesse technisch trennbar sind.',
    se: '<b>Systemerweiterung</b>: Das System umfasst alle Funktionen (z. B. Behandlung von Banknoten + Strom + Dampf) und wird mit einem Referenzsystem mit gleichen Funktionen verglichen. Variante <b>Substitution / avoided burden</b>: Gutschrift für das verdrängte Produkt (z. B. marginaler Strom, Wärme aus Erdgas). Daten nötig: Menge Koprodukt pro FU × Umweltlast des verdrängten Produkts.',
    s2: '<b>Physikalische Beziehungen</b>: Aufteilung nach Masse, Energiegehalt, Exergie oder kausal (wie ändern sich Inputs, wenn sich die Produktmengen ändern?). Beispiel Milch/Fleisch: Protein- oder kausale Allokation (Futterenergie).',
    s3: '<b>Andere Beziehungen</b>, meist <b>ökonomisch</b> (Erlösanteil = Preis × Menge). Spiegelt den Grund der Produktion, schwankt aber mit Preisen und Regionen.',
    rules: 'Die Summe der zugeordneten Flüsse muss 100 % ergeben. Gleiche Regeln für Wiederverwendung und Recycling (ISO 14044 4.3.4.3). Wahl transparent dokumentieren und Sensitivitätsanalyse mit Alternativen machen.',
  });

  // 7 ─────────────────────────────────────────── recycling approaches
  def('recycling', 'Recycling-Allokation: Cut-off vs. Avoided burden, EPD und PEF', 'RC bucht Emissionen, wenn sie entstehen (starke Nachhaltigkeit, Vorsorge). EOR gibt Gutschriften für künftig vermiedene Primärproduktion (schwache Nachhaltigkeit, „Umweltkredit“ der Zukunft).', () => {
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
    prim: 'Primärmaterial (z. B. Primäraluminium 7.5–9.3 kg CO₂-eq/kg) trägt beim Cut-off der <b>erste</b> Nutzer.',
    recRC: 'Beim Cut-off gehört der Recyclingprozess zum Produkt, das das Sekundärmaterial <b>nutzt</b> (recycled content). Das Altmaterial verlässt Produkt 1 ohne Lasten und ohne Gutschrift.',
    credit: '<b>Gutschrift (avoided burden):</b> Das Recycling am Lebensende vermeidet künftig Primärproduktion. Die ganze Gutschrift geht an Produkt 1. Kritik: Heutige Emissionen werden „wegkompensiert“, die Gutschrift liegt in der Zukunft (sunk impacts) und dürfte wegen Dekarbonisierung kleiner sein.',
    offset: '<b>Gegenposition (offsetting):</b> Wer Sekundärmaterial einsetzt, muss beim EOR-Ansatz die Primärlast tragen, denn die Gutschrift hat schon der Vorgänger erhalten. Sonst Doppelzählung.',
    modD: '<b>EN 15804 Modul D:</b> Gutschriften und Lasten ausserhalb der Systemgrenze, berechnet mit dem <b>Netto</b>-Sekundärfluss (R2 − R1), muss separat ausgewiesen werden. So sieht man A–C (was heute passiert) und D (potenzieller künftiger Nutzen) getrennt.',
  });

  // 8 ─────────────────────────────────────────── matrix LCA
  def('matrix-lca', 'Matrix-LCA: h = Q · B · A⁻¹ · f', 'Konvention: In der Technologiematrix A sind Outputs positiv und Inputs negativ (Zeilen = Produkte, Spalten = Prozesse). Unsicherheit steckt in A, B und Q.', () => {
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
    f: '<b>f</b>: Nachfragevektor = funktionelle Einheit bzw. Referenzfluss (z. B. 1 kg Produkt).',
    A: '<b>A</b>: Technosphäre. Jede Spalte ist ein Prozess (z. B. 1 kWh Strom), jede Zeile ein Produkt. Outputs +, Inputs −. Die Lösung s = A⁻¹f sagt, wie stark jeder Prozess skaliert werden muss (inkl. aller Vorketten).',
    B: '<b>B</b>: Biosphäre (Interventionen): direkte Emissionen und Ressourcen pro Prozesseinheit. g = B·s ergibt die Sachbilanz pro FU.',
    Q: '<b>Q</b>: Charakterisierungsfaktoren (z. B. CH₄ → 27 kg CO₂-eq/kg). h = Q·g ergibt die Wirkungsindikatoren.',
  });

  // 9 ─────────────────────────────────────────── IO table
  def('io-table', 'Umwelterweiterte Input-Output-Tabelle (EE-IO)', 'Tipp aus den Protokollen: Die Umwelt-Satellitenmatrix gehört UNTER die ökonomische Tabelle, so wie auf den Folien.', () => {
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
    Z: '<b>Vorleistungsmatrix Z</b>: Wie viel kauft Sektor j (Spalte) von Sektor i (Zeile) – in CHF. Eine LCA-Produktsystem ist wie ein Ausschnitt daraus, nur in physikalischen Einheiten.',
    y: '<b>Endnachfrage y</b>: Haushalte, Staat, Investitionen, Exporte. Entspricht der funktionellen Einheit in der LCA.',
    x: '<b>Gesamtproduktion x</b> = Vorleistungen an andere Sektoren + Endnachfrage: x = Z·1 + y.',
    va: '<b>Wertschöpfung</b> (Löhne, Gewinne, Steuern): Spaltensumme = Produktionswert.',
    imp: '<b>Importe</b>: In einer Einzelland-IO-Tabelle werden Importe oft mit inländischer Technologie angenähert (Fehlerquelle). Lösung: MRIO (z. B. EXIOBASE, Eora).',
    sat: '<b>Satellitenmatrix (Umwelterweiterung)</b>: direkte Emissionen und Ressourcen pro CHF Output je Sektor (d). Gesamte Intensität inkl. Vorketten: d·(I−A)⁻¹. Anwendung: spend-based Scope 3 (Swisscom), Konsumperspektive eines Landes.',
  });

  // 10 ─────────────────────────────────────────── uncertainty types
  def('uncertainty-types', 'Unsicherheit vs. Variabilität und der 3-Schritt-Ablauf', 'Prüfungsfalle aus dem Feedback: Pedigree-Matrix = Unsicherheit SCHÄTZEN (Charakterisierung), Monte Carlo = Unsicherheit FORTPFLANZEN (Propagation).', () => {
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
    unc: '<b>Unsicherheit</b> = fehlendes Wissen: keine, falsche, ungenaue oder unvollständige Daten. Mit besseren Daten reduzierbar.',
    var: '<b>Variabilität</b> = echte Unterschiede im System, unabhängig von der Datenqualität. Nicht reduzierbar, aber durch spezifischere Daten (z. B. welcher Lieferant genau) wird die daraus entstehende Unsicherheit kleiner.',
    par: '<b>Parameterunsicherheit</b>: Messfehler, Schätzungen bei Inputs (Energieverbrauch, Emissionsfaktoren, Erträge). In Monte Carlo gut abbildbar.',
    mod: '<b>Modellunsicherheit</b>: Vereinfachungen, z. B. Linearität, fehlende Korrelationen, unterschiedliche Fate-Modelle. Über Modellvergleich bzw. Szenarien behandeln.',
    scen: '<b>Szenario-Unsicherheit (Entscheidungen)</b>: normative Wahl von FU, Systemgrenzen, Cut-off, Allokation, marginalem Lieferanten, Zeithorizont. Über Szenario- bzw. Sensitivitätsanalyse behandeln.',
    spat: '<b>Räumliche Variabilität</b>: z. B. Strommix Frankreich (Kernkraft) vs. Polen (Kohle), Wasserknappheit je Region.',
    temp: '<b>Zeitliche Variabilität</b>: von Jahr zu Jahr, Tag/Nacht, Saison (Solarstrom, Ernteerträge).',
    obj: '<b>Variabilität zwischen Objekten/Quellen</b>: verschiedene Lieferanten, Technologien, Effizienzen, Menschen. Prüfungsbeispiel Baumwoll-Lieferanten für Banknoten: durch Wissen, welcher Lieferant genau liefert, reduzierbar.',
    w1: '<b>1 Charakterisieren</b>: Verteilungen (uniform, dreieckig, normal, lognormal) fitten, falls viele Daten vorliegen. Bei nur einem Wert: <b>Pedigree-Matrix</b> (Expertenurteil → geometrische Standardabweichung).',
    w2: '<b>2 Fortpflanzen</b>: Boundary analysis (alle Best/Worst-Werte), analytisch (Varianzformeln, nur einfache Modelle), <b>Monte Carlo</b> (zufällige Ziehungen, viele Läufe, modellunabhängig, keine bestimmte Verteilung nötig).',
    w3: '<b>3 Analysieren</b>: Mittelwert, Median, Standardabweichung, 2.5–97.5-Perzentil; Histogramm, Boxplot, Violin-Plot. Für Vergleiche: abhängige Ziehung (gemeinsame Parameter gleich) → Anteil der Läufe mit A < B.',
  });

  // 11 ─────────────────────────────────────────── distributions
  def('distributions', 'Wahrscheinlichkeitsverteilungen in der LCA', 'Lognormal ist in ecoinvent Standard: nur positive Werte, rechtsschief, für multiplikative Zusammenhänge. 95 %-Intervall: [μg / GSD², μg · GSD²].', () => {
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
    uni: '<b>Uniform</b>: Nur Minimum und Maximum bekannt, alle Werte gleich wahrscheinlich. Beispiel: Maschine braucht 20–30 kWh pro Jahr.',
    tri: '<b>Dreiecksverteilung</b>: Min, Max und wahrscheinlichster Wert (Modus). Beispiel: Transportdistanz mit klaren Grenzen.',
    nor: '<b>Normalverteilung</b>: Mittelwert und Standardabweichung; symmetrisch. 68 % in μ ± σ, 95 % in μ ± 2σ, 99.7 % in μ ± 3σ. Negative Werte möglich (Problem bei Mengen).',
    log: '<b>Lognormal</b>: ln(x) ist normalverteilt. Nur positiv, rechtsschief (Modus < Median < Mittelwert). Parameter: μ und σ der zugrunde liegenden Normalverteilung; Median = e^μ, GSD = e^σ, 95 %-Intervall = [Median/GSD², Median·GSD²]. Standard in ecoinvent (Pedigree).',
  });

  // 12 ─────────────────────────────────────────── Monte Carlo
  def('monte-carlo', 'Monte-Carlo-Simulation (Fortpflanzung)', 'In jedem Lauf wird für jeden unsicheren Parameter ein Wert aus seiner Verteilung gezogen und das ganze Modell berechnet. Nach z. B. 1000 Läufen ergibt sich eine Verteilung des Resultats.', () => {
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
    model: 'Das Modell bleibt deterministisch; die Zufälligkeit steckt in den Inputs. Monte Carlo ist <b>stochastisch</b>, modellunabhängig und braucht <b>keine bestimmte Verteilungsform</b> (lognormal ist nur häufig). Nachteil: rechenintensiv.',
    res: 'Resultat ist eine Verteilung. Bei Vergleichen nicht zwei getrennte Intervalle vergleichen (überlappen wegen gemeinsamer Unsicherheiten stark), sondern die <b>Differenz</b> bzw. das Verhältnis A/B in jedem Lauf berechnen (gekoppelte Analyse, Heeren et al. 2015).',
  });

  // 13 ─────────────────────────────────────────── sensitivity
  def('sensitivity', 'Sensitivitätsanalyse: lokal vs. global', 'Lokal (one-at-a-time) ist schnell, gilt aber nur um einen Punkt und ignoriert Wechselwirkungen. Global variiert alle Inputs gleichzeitig (Monte Carlo + Regression/Korrelation oder Sobol-Indizes).', () => {
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
  def('attr-conseq', 'Attributional vs. consequential LCA', 'ALCA verteilt die heutigen Lasten auf Produkte (Durchschnitt). CLCA fragt, was sich als Folge einer Entscheidung ändert (marginal).', () => {
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
    alca: '<b>ALCA</b>: Welcher Anteil der weltweiten Umweltlasten gehört zu meinem Produkt? Durchschnittsdaten, lineare homogene Produktionsfunktionen, Allokation. Die Summe aller ALCAs ergibt die Gesamtbelastung. Praktisch, reproduzierbar (ecoinvent), aber vereinfacht die tatsächliche Wirkung einer Entscheidung.',
    clca: '<b>CLCA</b>: Welche Flüsse ändern sich als Folge einer Entscheidung (meist Nachfrageänderung)? Nur betroffene Prozesse. Schlüsselelemente (Ekvall & Weidema 2004): Allokation über Systemerweiterung, konkurrierendes Produkt, marginale Technologie, begrenzte Produktionsfaktoren, allgemeine Markteffekte. Beispiel: 20 % Fairtrade-Orangensaft bis 2030, Wasserversorgung für 20 % der Bevölkerung.',
    marg: '<b>Marginale Technologie</b>: Zeithorizont (kurz: bestehende Kapazität; lang: neue Kapazität) und Markt-Trend bestimmen. Wachsender Markt: nächste installierte bzw. günstigste Technologie. Schrumpfender Markt: nächste abgeschaltete bzw. teuerste. Beschränkte Technologien reagieren nicht.',
  });

  // 15 ─────────────────────────────────────────── PDCA
  def('pdca', 'Deming-Kreis: Plan – Do – Check – Act', 'Grundlage aller Managementsysteme (ISO 9001, 14001, 50001). Funktioniert wie eine Kette: nur wenn alle Elemente vorhanden sind.', () => {
    const cx = 120, cy = 125, r = 100;
    let s = '';
    const q = [['plan', 'M120,125 L20,125 A100,100 0 0,1 120,25 Z', 'p', 'PLAN\nanalyse, goals,\ntargets, measures', 70, 88], ['do', 'M120,125 L120,25 A100,100 0 0,1 220,125 Z', 'b', 'DO\nimplement\n(daily work)', 170, 88], ['check', 'M120,125 L220,125 A100,100 0 0,1 120,225 Z', 'y', 'CHECK\nmonitor, measure,\nreport', 170, 166], ['act', 'M120,125 L120,225 A100,100 0 0,1 20,125 Z', 'c', 'ACT / ADAPT\nimprove, mgmt\nreview', 70, 166]];
    q.forEach(([k, d, c, t, tx, ty]) => { s += `<g class="hot" data-k="${k}"><path d="${d}" class="b-${c}"/>` + D.text(tx, ty - 10, t, { fs: 9.2, a: 'middle', cls: 't-' + c }) + '</g>'; });
    s += D.ell(cx, cy, 30, 30, 'continuous\nimprovement', { c: 'g', fs: 8.2, k: 'ci' });
    [[188, 262], [278, 352], [8, 82], [98, 172]].forEach(([a1, a2]) => { s += D.path(arc(cx, cy, r + 9, a1, a2), { arrow: true, c: 'a' }); });
    s += D.text(240, 40, 'Plan, Check, Act =\nmanagement tasks\n\nDo = daily work\n\nBasis of all ISO\nmanagement\nstandards (9001,\n14001, 50001 …)', { fs: 9.2, lh: 13 });
    return D.svg(360, 250, s, 'PDCA');
  }, {
    plan: '<b>Plan</b>: Situation analysieren (z. B. Ökobilanz → relevante Umweltaspekte), organisieren, Ziele, Zielwerte (SMART) und Massnahmen festlegen.',
    do: '<b>Do</b>: Umsetzen – das Tagesgeschäft. Ressourcen, Schulung, Kommunikation.',
    check: '<b>Check</b>: Kontrollieren und berichten: Kennzahlen, Ökobilanz-Update, Audits, Abweichungen von Zielen verstehen.',
    act: '<b>Act / Adapt</b>: Verbessern, Korrekturmassnahmen, Management Review, neue Ziele → nächster Zyklus.',
    ci: 'Fortlaufende Verbesserung und eine Politik sind in allen Managementnormen Pflicht; die Strategie ist meist kein expliziter Teil.',
  });

  // 16 ─────────────────────────────────────────── ISO 14001 cycle
  def('iso14001-cycle', 'ISO 14001 (2015): der Umweltmanagement-Zyklus', 'So zeigt Braunschweig den Zyklus. Tippe auf die Elemente. Die Ökobilanz liefert Input für 1 (relevante Aspekte), 5 (Ziele) und 7 (Controlling).', () => {
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
    e1: '<b>1 Kontext & Stakeholder</b> (Kap. 4): interne/externe Themen, Erwartungen der interessierten Parteien, Geltungsbereich des EMS.',
    e2: '<b>2 Bindende Verpflichtungen</b> (6.1.3): Gesetze, Bewilligungen, Branchenvereinbarungen, freiwillige Selbstverpflichtungen.',
    e3: '<b>3 Führung & Geltungsbereich</b> (Kap. 5): Top-Management trägt Verantwortung, Rollen und Zuständigkeiten, Integration in die Geschäftsprozesse.',
    e4: '<b>4 Umweltpolitik</b> (5.2): Verpflichtung zum Umweltschutz (inkl. Vermeidung von Belastungen), zur Einhaltung der Verpflichtungen und zur fortlaufenden Verbesserung. Öffentlich verfügbar.',
    e5: '<b>5 Plan</b> (Kap. 6): <b>bedeutende Umweltaspekte</b> bestimmen (inkl. Lebenszyklus-Perspektive), Risiken & Chancen, Umweltziele (SMART), Programme (wer, was, bis wann, Ressourcen).',
    e6: '<b>6 Do</b> (Kap. 7–8): Ressourcen, Kompetenz, Bewusstsein, Kommunikation, dokumentierte Information, betriebliche Steuerung, Notfallvorsorge.',
    e7: '<b>7 Check</b> (Kap. 9): Überwachung und Messung (Kennzahlen, Ökobilanz), Bewertung der Compliance, internes Audit.',
    e8: '<b>8 Act</b> (9.3 + Kap. 10): Managementbewertung, Nichtkonformitäten, Korrekturmassnahmen, neue Ziele.',
    ci: '<b>Fortlaufende Verbesserung</b>, aber ISO 14001 schreibt <b>kein bestimmtes Leistungsniveau</b> vor (ausser Rechtskonformität). „Ökologischer Champion“ und „knapp legal“ sind beide zertifizierbar. Verbesserung ist nicht immer kontinuierlich: grosse Schritte nicht vergessen!',
  });

  // 17 ─────────────────────────────────────────── management model & EFQM
  def('ssc-efqm', 'Management-Modell: Strategie – Struktur – Kultur + EFQM', 'Mit Strategie, Struktur und Kultur lässt sich jede Organisation beschreiben. EFQM: „Profits are the result of what you did in the past“ – wer nur Finanzzahlen anschaut, fährt mit dem Blick in den Rückspiegel.', () => {
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
    strat: '<b>Strategie</b>: Leitbild (Vision, Mission), Unternehmensstrategie, Ziele. Kernelemente einer Strategie: Produkt/Dienstleistung (was?), Märkte (wo, für wen?), Technologien (was können wir, was kaufen wir?). Ergänzt um Stakeholder und Nachhaltigkeitstreiber.',
    struct: '<b>Struktur</b>: Organisation und Prozesse inkl. Verantwortlichkeiten, Personal, Infrastruktur.',
    cult: '<b>Kultur</b>: Führung und Zusammenarbeit, Werte und Verhalten. Für Veränderung (z. B. Nachhaltigkeit) oft der härteste Teil.',
    enab: '<b>Enablers (Befähiger)</b>: was die Organisation tut. Führung, Politik & Strategie, Mitarbeitende, Partnerschaften & Ressourcen, Prozesse.',
    res: '<b>Resultate</b>: was sie erreicht. Mitarbeitende, Kunden, Gesellschaft & Umwelt, Schlüsselergebnisse. Messung z. B. mit Balanced Scorecard (Markt-, Finanz-, Umwelt-, Sozialleistung).',
  });

  // 18 ─────────────────────────────────────────── ecological scarcity
  def('ecoscarcity', 'Methode der ökologischen Knappheit (UBP)', 'Distance-to-target-Gewichtung nach Schweizer Umweltpolitik. Ein Fluss, der den kritischen Fluss überschreitet, wird überproportional (quadratisch) gewichtet.', () => {
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
    ef: '<b>Ökofaktor</b> in UBP pro Einheit Schadstoff bzw. Ressource. Umweltbelastung = Σ Menge × Ökofaktor.',
    K: '<b>K</b>: Charakterisierung (optional), z. B. GWP für Treibhausgase relativ zur Leitsubstanz.',
    fn: '<b>Normierung</b> 1 UBP/Fₙ: Fₙ ist die aktuelle jährliche Gesamtfracht im Referenzgebiet (meist Schweiz). Eine Einheit des Flusses ist so ein Anteil an der Gesamtbelastung.',
    w: '<b>Gewichtung</b> (F/F_k)²: F = aktueller Fluss, F_k = kritischer Fluss (politisches bzw. gesetzliches Ziel). Liegt F über F_k, wird der Fluss stärker als linear gewichtet. Darin stecken politische Prioritäten (subjektiv!).',
    c: '<b>c</b> = 10¹²/a: Konstante, damit handliche Zahlen entstehen.',
    ex: 'Rechnung: 1/(70.733·10⁶ kg) × (70\'733/46\'518)² × 10¹² ≈ 1.414·10⁻⁸ × 2.312 × 10¹² ≈ 32\'700 ≈ 33\'000 UBP/kg NOₓ.',
  });

  // 19 ─────────────────────────────────────────── LCC layers
  def('lcc-layers', 'Life Cycle Costing: von den Firmenkosten zur „Full LCC“', 'Business-LCC findet Ineffizienzen und überwindet getrennte Budgets (Einkauf vs. Unterhalt). Environmental LCC bringt LCA-Denken in die Kalkulation; Full LCC ist noch im Konzeptstadium.', () => {
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
    r0: '<b>Externe gesellschaftliche Kosten</b> (z. B. Gesundheitskosten, Arbeitslosigkeit): erste methodische Ansätze (Social Hotspot Database).',
    r1: '<b>Externe Umweltkosten</b> (z. B. Luftverschmutzung, CO₂ mit Schadenskosten von ca. 100–200 CHF/t): Bewertung über Zahlungsbereitschaft, Schadenskosten oder Vermeidungs- bzw. Ersatzkosten.',
    r2: '<b>Direkte (interne) Kosten</b>: eigene Kosten (Entwicklung, Produktion) sind bekannt; Lieferantenkosten stecken in den Preisen; Nutzungs- und Entsorgungskosten der Kunden müssen modelliert werden (Annahmen!). Market-LCC = Total Cost of Ownership.',
  });

  // 20 ─────────────────────────────────────────── critical review
  def('critical-review', 'Critical Review nach ISO 14044 / ISO/TS 14071', 'Drei Prüfungsprotokolle fragten nach Ablauf, Prüfinhalt und Kompetenzen der Reviewer. Das Review beginnt am Anfang der Studie, nicht erst am Schluss.', () => {
    let s = D.box(8, 6, 344, 40, 'Critical review: ensures consistency of an LCA with the\nprinciples and requirements of ISO 14040/44', { c: 'c', fs: 9.4, bold: true, k: 'def' });
    const st = ['1 Appoint reviewer / panel\nat the START of the study', '2 Review goal & scope\n(FU, boundaries, methods)', '3 Data review (LCI):\nmodels, data sources', '4 Draft report →\nwritten review comments', '5 Revised report +\nresponses to comments', '6 Final report + review\nstatement (part of report)'];
    st.forEach((t, i) => { s += D.box(8, 56 + i * 42, 168, 34, t, { c: 'p', fs: 8.8, boldFirst: false, k: 'proc' }); if (i < 5) s += D.arrow(92, 90 + i * 42, 92, 98 + i * 42); });
    s += D.box(186, 56, 166, 118, 'Reviewers assess whether:\n1 methods consistent with ISO\n2 methods scientifically &\n   technically valid\n3 data appropriate & reason-\n   able in relation to the goal\n4 interpretation reflects the\n   limitations & the goal\n5 report transparent &\n   consistent', { c: 'g', fs: 8.6, ta: 'start', top: true, boldFirst: true, k: 'what' });
    s += D.box(186, 182, 166, 50, 'It CANNOT verify: the goal\nchosen by the commissioner,\nnor how results are used', { c: 'r', fs: 8.6, ta: 'start', boldFirst: false, k: 'not' });
    s += D.box(186, 240, 166, 66, 'Reviewer skills (ILCD):\nindependence · language ·\nLCA methodology · review/\naudit experience · system\n(sector) expertise', { c: 'b', fs: 8.6, ta: 'start', top: true, boldFirst: true, k: 'skills' });
    s += D.box(8, 314, 344, 50, 'MANDATORY for comparative assertions disclosed to the public\n→ panel of interested parties (chair + at least 2 members);\notherwise optional: internal or external independent expert.', { c: 'o', fs: 8.8, ta: 'start', boldFirst: true, k: 'when' });
    return D.svg(360, 370, s, 'Critical review');
  }, {
    def: 'Das Review stellt sicher, dass die LCA mit den Prinzipien und Anforderungen der ISO-Normen übereinstimmt. Es erhöht die Glaubwürdigkeit, ist aber <b>kein vollwertiger Ersatz für Transparenz</b>.',
    proc: '<b>Ablauf</b> (Beispiel EAGM-Studie): Panel beauftragt → 1. Entwurf → 2. Entwurf → Meeting mit Auftraggeber → Datenreview → Kommentare des Panels → angepasster Bericht → Schlussbericht + Review-Bericht. Begleitend (interaktiv) ist besser als nachträglich.',
    what: 'Die Reviewer beurteilen: Methoden konsistent mit ISO, wissenschaftlich und technisch gültig; Daten angemessen und plausibel im Bezug auf das Ziel; Interpretation berücksichtigt Einschränkungen und Ziel; Bericht transparent und konsistent. Typisch kritisch bei Vergleichen: FU (gleiche Funktion, Lebensdauer), Systemgrenzen, Allokation, Datenqualität, Auswahl der Wirkungskategorien, keine Gewichtung.',
    not: 'Das Review kann weder das vom Auftraggeber gewählte <b>Ziel</b> noch die <b>Verwendung</b> der Resultate validieren.',
    skills: 'Anforderungen (ILCD 2012): Unabhängigkeit, Sprache, LCA-Methodik, Review- bzw. Audit-Erfahrung, System- bzw. Branchenkenntnis. Probleme: Wer bezahlt (Unabhängigkeit)? Versteckte Interessen (Know-how-Abfluss, Konkurrenz, Datenlieferant)?',
    when: '<b>Pflicht</b> nur bei <b>vergleichenden Aussagen, die veröffentlicht werden</b> (comparative assertion disclosed to the public), und zwar als <b>Panel interessierter Kreise</b> (mind. 3 Mitglieder inkl. Vorsitz). Sonst freiwillig.',
  });

  // 21 ─────────────────────────────────────────── double materiality
  def('double-materiality', 'Doppelte Wesentlichkeit (CSRD)', 'Frühe „nachhaltige“ Investoren schauten nur von aussen nach innen. Ein echter Nachhaltigkeitsansatz betrachtet auch die Wirkung der Firma auf Umwelt und Gesellschaft (Ökobilanz).', () => {
    let s = D.text(180, 30, 'Financial materiality (outside-in)\nhow climate risks, regulation, scarcity\naffect cash flows and company value', { fs: 9, a: 'middle', lh: 11.5 });
    s += D.box(8, 84, 104, 82, 'Company', { c: 'c', fs: 13, bold: true, k: 'co' });
    s += D.box(248, 84, 104, 82, 'Environment\n& society', { c: 'g', fs: 12, bold: true, k: 'env' });
    s += D.arrow(246, 104, 114, 104, { c: 'r' });
    s += D.arrow(114, 146, 246, 146, { c: 'g' });
    s += D.text(180, 186, 'Impact materiality (inside-out)\ncompany impacts on people & planet\n→ ecobalance, LCA, GHG balance', { fs: 9, a: 'middle', lh: 11.5 });
    s += D.text(180, 236, 'CSRD/ESRS require BOTH perspectives', { fs: 9.6, a: 'middle', bold: true });
    return D.svg(360, 246, s, 'Double materiality');
  }, {
    co: 'Wesentlichkeitsanalyse: Vorab-Analyse der Relevanz, um sich auf die Schlüsselthemen zu konzentrieren.',
    env: 'Impact-Sicht: Was bewirkt die Firma bei Umwelt und Menschen (inkl. Lieferkette)? Werkzeuge: Ökobilanz, THG-Bilanz, Social Hotspots.',
  });

  // 22 ─────────────────────────────────────────── stakeholders
  def('stakeholders', 'Stakeholder-Landkarte (Beispiel Hotel)', 'Stakeholder = Person oder Gruppe, die eine Organisation beeinflusst oder von ihr beeinflusst wird (ISO 14001: „interessierte Partei“). Sie geben oft die Gründe für eine Nachhaltigkeitsorientierung.', () => {
    const cx = 180, cy = 150;
    const L = ['Owners /\nshareholders', 'Staff', 'Clients\n(guests)', 'Suppliers', 'Banks', 'Insurances', 'Authorities\n(local, federal)', 'NGOs', 'Media,\npublic', 'Competitors', 'Partners (tour\noperators)', 'Local\ncommunity'];
    let s = '';
    const pts = L.map((t, i) => { const a = (-90 + i * 30) * Math.PI / 180; return [cx + 134 * Math.cos(a), cy + 116 * Math.sin(a), t]; });
    pts.forEach(([x, y]) => { s += D.line(cx, cy, x, y); });
    pts.forEach(([x, y, t], i) => { s += D.box(x - 42, y - 15, 84, 30, t, { c: i % 3 === 0 ? 'p' : i % 3 === 1 ? 'b' : 'y', fs: 8.4, k: 'st' + i }); });
    s += D.ell(cx, cy, 58, 30, 'Organisation\n(e.g. hotel)', { c: 'c', fs: 10, bold: true });
    return D.svg(360, 300, s, 'Stakeholders');
  }, (() => {
    const t = ['Eigentümer/Aktionäre: Rendite, Risiko, Reputation, langfristiger Wert.', 'Mitarbeitende: Arbeitsbedingungen, Sinn, Gesundheit, Weiterbildung.', 'Kunden/Gäste: Qualität, Preis, ökologische Erwartungen, Labels.', 'Lieferanten: Anforderungen weitergeben (Lieferkette), Partnerschaften.', 'Banken: Kreditrisiken, ESG-Kriterien, Green Loans.', 'Versicherungen: Umwelt- und Haftungsrisiken, Prämien.', 'Behörden: Gesetze, Bewilligungen, Kontrollen, Reporting (z. B. ETH → Bund).', 'NGOs: Kampagnen, Watchdogs, Kooperationen.', 'Medien/Öffentlichkeit: Image, Skandale, Vertrauen.', 'Konkurrenten: Benchmark, Branchenstandards, Kooperation in Initiativen.', 'Partner (Reiseveranstalter, Tourismusverbände): Labels, Anforderungen.', 'Lokale Bevölkerung: Lärm, Verkehr, Arbeitsplätze, Landschaft.'];
    const o = {}; t.forEach((x, i) => { o['st' + i] = x; }); return o;
  })());

  // 23 ─────────────────────────────────────────── MCDA
  def('mcda', 'Multi-Criteria Decision Analysis (MCDA)', 'MCDA trennt „Fakten“ (Vorhersagen der Wirkungen) von „Werten“ (Präferenzen der Stakeholder). MAVT: Gesamtwert = Σ Gewicht × Wertfunktion.', () => {
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
    m1: 'Problem strukturieren: Was ist die Entscheidung, wer ist betroffen (Stakeholder-Analyse), welcher Rahmen (Zeit, Raum, Budget)?',
    m2: 'Ziele (objectives) hierarchisch strukturieren und messbare Attribute festlegen, z. B. Kosten in CHF/a, CO₂ in kg/a, N- und P-Rückgewinnung in %.',
    m3: 'Alternativen bzw. Optionen identifizieren (z. B. zentrale ARA, dezentrale Kleinkläranlagen, hybrid), auch kreative und Status quo.',
    m4: 'Vorhersagen = Wissen der Experten (z. B. LCA-Resultate, Kosten, Zuverlässigkeit), inklusive Unsicherheit.',
    m5: 'Präferenzen = Werte der Stakeholder: Gewichte (z. B. Swing-Methode) und Wertfunktionen (0 = schlechtester, 1 = bester Wert). Beschreibende Entscheidungsanalyse (wie Menschen entscheiden) vs. präskriptive (wie man rational entscheiden sollte).',
    m6: 'MAVT/MAUT: additives Modell V = Σ wᵢ·vᵢ(xᵢ). Ranking der Alternativen.',
    m7: 'Sensitivitätsanalyse auf Gewichte und Wertfunktionen: Bleibt die beste Option stabil?',
  });

  // 24 ─────────────────────────────────────────── optimization / Pareto
  def('pareto', 'Optimierung & Pareto-Front', 'Optimierung findet die beste Lösung unter vielen Möglichkeiten, statt nur wenige Szenarien zu vergleichen. Bei mehreren Zielen gibt es keine einzelne beste Lösung, sondern eine Pareto-Front.', () => {
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
    lp: '<b>LP-Struktur</b>: Zielfunktion (Kosten, Umweltwirkung oder gewichtet), Entscheidungsvariablen (Prozessintensitäten s), Nebenbedingungen (Nachfrage erfüllen, Kapazitäten, Emissionsgrenzen, verfügbare Technologien). Optimierung ≠ konsequentielle LCA, braucht aber marginale (konsequentielle) Denkweise. Beispiel Gebäudesanierung: min Kosten bzw. Umweltwirkung s.t. Wärmebedarf gedeckt, Budget ≤ X, Dachfläche für PV ≤ Y m².',
  });

  // 25 ─────────────────────────────────────────── global vs regional
  def('regional', 'Global vs. regional: Wann braucht es Regionalisierung?', 'Regionalisierung lohnt sich bei Kategorien, deren Wirkung stark vom Ort abhängt. Dazu braucht es regionalisierte LCI-Daten UND regionalisierte Charakterisierungsfaktoren.', () => {
    let s = D.arrow(14, 30, 346, 30, { both: true, c: 'a' });
    s += D.text(14, 18, 'GLOBAL (location irrelevant)', { fs: 9, bold: true }) + D.text(346, 18, 'LOCAL / REGIONAL', { fs: 9, a: 'end', bold: true });
    const chips = [[8, 40, 'Climate change', 'g', 'cc'], [8, 70, 'Ozone depletion', 'g', 'od'], [124, 40, 'Acidification', 'y', 'ac'], [124, 70, 'Eutrophication', 'y', 'eu'], [124, 100, 'Photochem. ozone', 'y', 'po'], [240, 40, 'PM2.5 (health)', 'o', 'pm'], [240, 70, 'Toxicity', 'o', 'tox'], [240, 100, 'Land use', 'o', 'land'], [240, 130, 'Water use', 'o', 'water'], [240, 160, 'Noise', 'o', 'noise']];
    chips.forEach(([x, y, t, c, k]) => { s += D.box(x, y, 112, 24, t, { c, fs: 9, k }); });
    s += D.box(8, 196, 168, 64, 'Global: well-mixed, long-lived\n(CO₂ ~ centuries) → one CF\nworldwide. Impacts still differ\nregionally!', { c: 'n', fs: 8.6, ta: 'start', k: 'glob' });
    s += D.box(184, 196, 168, 64, 'Regional: CF depends on place\n(population density, ecosystem\nsensitivity, water scarcity, e.g.\nAWARE 0.1–100) → need both', { c: 'n', fs: 8.6, ta: 'start', k: 'reg' });
    return D.svg(360, 266, s, 'Regionalization');
  }, {
    cc: 'Klimawandel: Emissionsort egal (gut durchmischt, langlebig) → Regionalisierung der CFs nicht nötig. Aber die Schäden treffen Regionen unterschiedlich (oft arme Länder).',
    od: 'Ozonabbau: global, langlebige Stoffe (FCKW).',
    ac: 'Versauerung: SO₂/NOₓ sind kurzlebig → Deposition regional, Empfindlichkeit der Böden unterschiedlich.',
    eu: 'Eutrophierung: hängt vom empfangenden Gewässer ab (P-limitiert vs. N-limitiert).',
    po: 'Sommersmog: abhängig von Sonneneinstrahlung, NOₓ/VOC-Verhältnis, Bevölkerung.',
    pm: 'Feinstaub: CFs variieren um Grössenordnungen (Stadt China vs. ländliche USA). Abhängig von Bevölkerungsdichte, Kaminhöhe, Wetter. Hohe Auflösung nötig.',
    tox: 'Toxizität: Fate und Exposition hängen von Umweltmedium, Klima, Bevölkerung und Ernährung ab.',
    land: 'Landnutzung: Biodiversitätsverlust stark ökoregion-abhängig (Species-Area-Relationship, Verwundbarkeit endemischer Arten).',
    water: 'Wassernutzung: 1 m³ in der Wüste ≠ 1 m³ in der Schweiz. AWARE-CFs 0.1 bis 100. Innerhalb eines Landes oft grössere Unterschiede als zwischen Ländern (Yellow River 90.6 vs. Southern China 0.5).',
    noise: 'Lärm: rein lokal (Distanz, Anzahl betroffener Personen, Tageszeit).',
    glob: 'Bei globalen Kategorien genügt ein Faktor pro Stoff.',
    reg: 'Regionalisierung reduziert die (räumliche) Unsicherheit. Dafür braucht es Ortsinformationen im LCI (wo wird emittiert oder Wasser entnommen?) und passende regionale CFs. LCI- und LCIA-Auflösung sollten zusammenpassen.',
  });

  // 26 ─────────────────────────────────────────── weighting pyramid
  def('weighting-pyramid', 'Aggregationsstufen: Sachbilanz → Single Score', 'Je höher in der Pyramide, desto einfacher für das Management, aber desto mehr Werturteile. Für interne Prozessoptimierung sind physikalische Daten oft am besten, idealerweise auf Basis einer gewichteten Analyse.', () => {
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
    ss: '<b>Single Score</b>: Überblick, Prioritäten, Trade-offs werden „gelöst“, Entscheidungsunterstützung. Aber politische und gesellschaftliche Werte drin, wirkt „endgültig“, nach ISO nicht für öffentliche Vergleiche. Gewichtungsmethoden gibt es nur für einzelne Weltregionen (CH, EU, JP, Lateinamerika).',
    dm: '<b>Endpunkte</b>: Human health, Ecosystem quality, Resources. Relevanter, aber unsicherer.',
    mp: '<b>Midpoints</b>: z. B. nur THG (CO₂-eq) ist leicht verständlich und international akzeptiert, deckt aber nur ein Umweltproblem ab (Burden Shifting möglich).',
    inv: '<b>Sachbilanz-Kennzahlen</b> (kWh/m², kg Papier/FTE, km/FTE): nahe am Prozess, leicht verständlich, gut für Benchmarking – sagen aber nichts über die Umweltrelevanz.',
  });

  // 27 ─────────────────────────────────────────── supply chain approach
  def('supply-chain', 'Nachhaltiges Lieferkettenmanagement: Stufen', 'Mit Einkaufsmacht und identifizierbaren Marken wird es nötig, Menschenrechte und Umweltstandards in der Lieferkette sicherzustellen: Erklärungen, Schulungen, Audits, klare Konsequenzen.', () => {
    let s = '';
    const st = [['0 No activity', 'n'], ['1 Check supply\nchains for risks', 'y'], ['2 Suppliers\nsign code of\nconduct', 'y'], ['3 Detailed\nanalysis:\n(a) key suppliers\n(b) own\npurchasing', 'o'], ['4 Plan &\nimplement\nimprove-\nments', 'g']];
    st.forEach(([t, c], i) => { const h = 40 + i * 32, y = 200 - h; s += D.box(8 + i * 70, y, 66, h, t, { c, fs: 8.2, top: true, k: 'sc' + i }); });
    s += D.arrow(14, 214, 346, 214, { c: 'a' }) + D.text(180, 230, 'increasing depth of supply chain management', { fs: 8.8, a: 'middle', cls: 'lab' });
    s += D.text(180, 248, 'Tools: declarations · training · audits · consequences · SA8000 · BSCI', { fs: 8.8, a: 'middle', bold: true });
    return D.svg(360, 256, s, 'Supply chain steps');
  }, {
    sc0: 'Keine Aktivität: Risiko für Image und (z. B. CSRD/CSDDD) für Compliance.',
    sc1: 'Risiken screenen: Länder, Branchen, Rohstoffe (Kinderarbeit, Zwangsarbeit, Entwaldung, Wasser).',
    sc2: 'Lieferanten unterschreiben einen Verhaltenskodex. Aber: „Papier ist geduldig“.',
    sc3: 'Detaillierte Analyse der Schlüssellieferanten (Fragebogen, Audits) und der eigenen Einkaufsprozesse (z. B. Preisdruck, kurze Lieferfristen verursachen Überstunden).',
    sc4: 'Verbesserungen planen und umsetzen: Schulung, Partnerschaften, Audits, klare Konsequenzen, Brancheninitiativen (BSCI, RSPO bei Palmöl).',
  });

  // 28 ─────────────────────────────────────────── conditions for change
  def('conditions-change', 'Bedingungen für Veränderung', 'Neue Strategie und Ziele allein genügen nicht. Es braucht auch neue strukturelle und kulturelle Rahmenbedingungen und die Einbindung aller.', () => {
    let s = '';
    [['New strategy\n& targets', 'p', 8], ['New structural\nframework', 'b', 124], ['New cultural\nframework', 'o', 240]].forEach(([t, c, x]) => { s += D.box(x, 6, 112, 36, t, { c, fs: 9, bold: true }); });
    const cols = [['1 Mission &\nannual\ngoals of\nsenior\npositions', 'p'], ['2 Periodic\ninfo on\ntarget\nachieve-\nment', 'p'], ['3 Assess-\nment &\nincentives\nbased on\ntargets', 'b'], ['4 Organi-\nsational &\ntechnical\nsupport', 'b'], ['5 Superiors\nas role\nmodels', 'o'], ['6 Sensiti-\nsation,\ninfo,\ntraining', 'o']];
    cols.forEach(([t, c], i) => { s += D.box(8 + i * 58, 50, 54, 92, t, { c, fs: 8, top: true, k: 'cc' + (i + 1) }); });
    s += D.box(8, 150, 344, 30, '7 Optimal involvement of and communication between all involved', { c: 'g', fs: 9, k: 'cc7' });
    s += D.arrow(180, 180, 180, 196) + D.box(100, 198, 160, 34, 'Change of conduct', { c: 'c', fs: 11, bold: true });
    return D.svg(360, 238, s, 'Conditions for change');
  }, {
    cc1: 'Leitbild und jährliche Ziele, auch für Kaderstellen (Nachhaltigkeitsziele in den Zielvereinbarungen).',
    cc2: 'Regelmässige Information über die Zielerreichung (Reporting, Dashboards).',
    cc3: 'Beurteilung und Anreize auf Basis der Zielerreichung (z. B. Bonusanteil).',
    cc4: 'Organisatorische und technische Unterstützung (Fachstelle, Tools, Budget).',
    cc5: 'Vorgesetzte als Vorbilder (Kultur!).',
    cc6: 'Sensibilisierung, Information, Schulung.',
    cc7: 'Optimale Einbindung und Kommunikation zwischen allen Beteiligten.',
  });

  // 29 ─────────────────────────────────────────── banknote relevance
  def('banknote', 'Prüfungsfall Banknoten: Produkt-LCA vs. Bank-Footprint', 'Antwort auf „Wie relevant sind die Banknoten für die Umweltleistung der Nationalbank?“: Die beiden Sichten überlappen nur teilweise. Man braucht Daten aller Bank-Aktivitäten und eine passende Einheit.', () => {
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
    lc: 'Die Produkt-LCA folgt der Banknote von der Baumwolle bis zur Verbrennung, unabhängig davon, welche Firma den Schritt macht.',
    eol: 'Verbrennung mit Strom- und Dampfproduktion → multifunktional: Systemerweiterung bzw. Gutschrift (vermiedener Strom und Wärme) nach ISO-Hierarchie.',
    dn: 'Die Firmenbilanz umfasst alle Aktivitäten der Bank in einem Jahr: Scope 1 (Heizung, Fahrzeuge), Scope 2 (Strom), Scope 3 (Einkauf inkl. Banknotendruck, Reisen, IT, Pendeln …).',
    both: 'Überlappung: Lagerung und Verteilung der Banknoten gehören zu beiden Sichten.',
    other: 'Andere Bank-Aktivitäten sind nicht Teil der Banknoten-LCA, aber Teil der Firmenbilanz.',
    pur: 'Eingekaufte Banknoten bzw. Druckdienstleistungen erscheinen in der Firmenbilanz als Scope 3, Kategorie 1.',
    rel: '<b>Relevanz beurteilen</b>: (1) Daten zu allen relevanten Aktivitäten erheben (Scopes 1–3 bzw. Betriebsökobilanz), (2) Einheit bewusst wählen und diskutieren: CO₂-eq (verständlich, nur Klima), UBP-Single-Score (umfassend, gewichtet), MJ (Energie), CHF (Kosten zeigen Hebel und Prioritäten fürs Management), (3) Anteil der Banknoten am Total vergleichen.',
  });

  // 30 ─────────────────────────────────────────── ISO map
  def('iso-map', 'ISO-Landkarte: Organisation vs. Produkt', 'Tippe auf eine Norm. Organisationsnormen links (Management und Leistungsbewertung), Produktnormen rechts (Bewertung und Kommunikation).', () => {
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
  }, null, { infoFn: (k) => { const e = A.iso.find((x) => x.id === k); return e ? `<b>${e.code} – ${e.title}</b><br>${e.what}<br><a href="#/iso/${e.id}">→ im ISO-Kompass öffnen</a>` : ''; } });

  // 31 ─────────────────────────────────────────── risk vs LCA (bonus)
  def('risk-vs-lca', 'Risikoanalyse vs. Ökobilanz', 'Ältere Prüfungen fragten oft nach Gemeinsamkeiten und Unterschieden. Beide nutzen Fate-, Expositions- und Effektmodelle, aber mit anderer Frage.', () => {
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
  def('box-model', 'Innenraum-Exposition: One-Box und Near-/Far-Field', 'Steady state: Konzentration = Emissionsrate / Luftwechsel. Für nahe Quellen (Arbeiter beim Abfüllen) unterschätzt das One-Box-Modell die Konzentration → Two-Box (Near/Far Field) oder Eddy-Diffusion.', () => {
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
  def('labels', 'Umweltkennzeichnungen Typ I, II, III (ISO 14020-Familie)', 'Häufig verwechselt: Typ I ist ein Label (Logo, Drittprüfung), Typ II ist eine Selbstdeklaration, Typ III ist eine Datendeklaration (EPD) auf LCA-Basis.', () => {
    const c = [['Type I – ecolabel\nISO 14024', 'g', '• third-party certified\n• multi-criteria, life\n  cycle based\n• pass/fail → logo\n• e.g. Blauer Engel,\n  EU Ecolabel, Nordic\n  Swan', 't1'], ['Type II – self-\ndeclared claim\nISO 14021', 'y', '• by the company itself\n• single claim, e.g.\n  "recyclable",\n  "30 % recycled"\n• must be verifiable,\n  not misleading\n  (EU Green Claims)', 't2'], ['Type III – EPD\nISO 14025\n(+ EN 15804)', 'p', '• quantified LCA data\n• Product Category\n  Rules (PCR)\n• third-party verified\n• no judgement: user\n  compares', 't3']];
    let s = '';
    c.forEach(([h, col, t, k], i) => { const x = 8 + i * 118; s += D.box(x, 6, 108, 48, h, { c: col, fs: 8.8, bold: true, k }); s += D.box(x, 60, 108, 112, t, { c: 'w', fs: 8.3, ta: 'start', top: true, k }); });
    s += D.text(180, 192, 'ISO 14020: general principles (accurate, verifiable, relevant, not misleading)', { fs: 8.6, a: 'middle', cls: 'lab' });
    return D.svg(360, 200, s, 'Ecolabels');
  }, {
    t1: '<b>Typ I</b> (ISO 14024): freiwilliges, multikriterielles Label einer unabhängigen Stelle; Kriterien über den Lebenszyklus, Vergabe bei Erfüllung.',
    t2: '<b>Typ II</b> (ISO 14021): Selbstdeklaration der Firma ohne Drittprüfung (z. B. „kompostierbar“). Muss genau, überprüfbar und nicht irreführend sein.',
    t3: '<b>Typ III</b> (ISO 14025): quantitative Umweltdeklaration (EPD) auf Basis LCA nach Product Category Rules, extern verifiziert. Bau: EN 15804 mit Modulen A–D.',
  });

  // 34 ─────────────────────────────────────────── growth dynamics
  def('growth', 'Wachstumsdynamik: exponentielles Wachstum', 'Verdopplungszeit ≈ 70 / Wachstumsrate in %. Auch eine reduzierte Rate führt zu Wachstum, aber langsamer – das gibt Zeit, Lösungen umzusetzen.', () => {
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
  def('policy', 'Umweltpolitische Instrumente', 'Ökologische Steuerreform: „bads“ (Energie, CO₂) besteuern statt „goods“ (Arbeit), Einnahmen rückverteilen. Beispiel CO₂-Abgabe Schweiz auf Brennstoffen.', () => {
    const g = [['Communication', 'b', '• moral suasion\n• information &\n  education\n• behavioural hints\n  (nudges)', 'com'], ['Laws & regulation', 'o', '• emission limits\n• bans (e.g. toxic\n  substances)\n• standards', 'law'], ['Financial incentives', 'g', '• subsidies\n• (incentive) taxes,\n  ecological tax\n  reform\n• pollution rights\n  (cap & trade)', 'fin']];
    let s = '';
    g.forEach(([h, c, t, k], i) => { const x = 8 + i * 118; s += D.box(x, 6, 108, 30, h, { c, fs: 9, bold: true, k }); s += D.box(x, 42, 108, 104, t, { c: 'w', fs: 8.6, ta: 'start', top: true, k }); });
    s += D.box(8, 154, 344, 26, 'Political frameworks: voluntary commitments (e.g. sector agreements, SBTi)', { c: 'n', fs: 8.8, k: 'vol' });
    return D.svg(360, 186, s, 'Policy instruments');
  }, {
    com: '<b>Kommunikation</b>: günstig, freiheitlich, aber schwache Wirkung (Moral, Info, Nudges wie Default-Ökostrom).',
    law: '<b>Gebote/Verbote</b>: wirksam und klar (z. B. Katalysator-Pflicht, FCKW-Verbot), aber starr, Vollzugsaufwand, kein Anreiz, besser als der Grenzwert zu sein.',
    fin: '<b>Finanzielle Anreize</b>: Lenkungsabgaben nutzen den Preismechanismus, sind stabil und berechenbar; Wahlfreiheit bleibt; Rückverteilung sichert Akzeptanz. Nachteile: Carbon Leakage, Verteilungswirkung, politisch heikel, wirkungslos wenn zu tief. Kriterien (öbu): notwendig, wirksam, voraussehbar (stufenweise), fiskalneutral, keine grossen Verteilungsverzerrungen, nicht exportschädigend, neutral auf den Konsumentenpreisindex.',
    vol: 'Freiwillige Vereinbarungen: flexibel, aber Trittbrettfahrer und Greenwashing-Risiko.',
  });

  // 36 ─────────────────────────────────────────── planetary boundaries / doughnut
  def('doughnut', 'Doughnut-Ökonomie & planetare Grenzen', 'Kate Raworth: ein sicherer und gerechter Raum zwischen sozialem Fundament (innen) und ökologischer Decke (aussen). 2023: 6 von 9 planetaren Grenzen überschritten (Richardson et al.); 2025-Update: 7 von 9 (inkl. Ozeanversauerung).', () => {
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
