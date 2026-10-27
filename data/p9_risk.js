/* P10 – Risk assessment, indoor exposure, noise (bonus; frequent in older exams) */
(function () {
  const A = window.AEA, { card, mc, tf, ord, match, sort, calc, oral } = A.mk;
  A.topic({
    id: 'risk', no: 'P10', part: 'P', icon: '☣️', title: 'Risikoanalyse, Innenraum & Lärm (Bonus)',
    short: 'RA vs. LCA, PEC/PNEC, Fate-Exposure-Effect, Box-Modelle, Lärm → DALY. Oft in älteren Prüfungen',
    learn: [
      { box: 'tip', h: 'Warum dieses Kapitel?', t: 'Pfister: „Main topic LCA, but also bits of chemical risk assessment.“ In vielen älteren Protokollen kamen VOC-Emissionen beim Drucken, Lösungsmittel-Lagerhallen, Fungizide und Lärm vor. Kurz und sicher beherrschen lohnt sich.' },
      { d: 'risk-vs-lca' },
      { h: 'Chemische Risikoanalyse in 4 Schritten', t: '(1) <b>Gefahrenidentifikation</b> · (2) <b>Expositionsabschätzung</b>: PEC (predicted environmental concentration) bzw. Innenraumkonzentration aus Emission und Fate · (3) <b>Wirkungsabschätzung</b>: Dosis-Wirkung, NOEC, EC50 → PNEC = NOEC / Assessment factor · (4) <b>Risikocharakterisierung</b>: RQ = PEC / PNEC (RQ &gt; 1 → Risiko).' },
      { f: 'RQ = PEC / PNEC  ·  PNEC = NOEC / AF  (AF = 10 … 1000)' },
      { h: 'Assessment factors (Sicherheitsfaktoren)', t: 'Decken Unsicherheiten ab: Labor → Feld, akut → chronisch, wenige getestete Arten → Ökosystem, Tier → Mensch, Variabilität zwischen Individuen. Konservativer Ansatz (worst case), im Gegensatz zur LCA (best estimate).' },
      { h: 'Mischungen', t: 'Gleich wirkende Stoffe: <b>Konzentrationsaddition</b>: Σ (Cᵢ / EC50ᵢ) als Summe von „toxic units“ (dividieren, nicht multiplizieren!). Unterschiedliche Wirkmechanismen: unabhängige Wirkung (independent action).' },
      { h: 'Fate & Exposition', t: 'Emissionsrate ≠ Konzentration! Fate-Modelle (Multimedia-Boxmodelle) berücksichtigen Verteilung zwischen Luft, Wasser, Boden, Sediment (Kow, Henry-Konstante), Abbau, Transport. Relevante Stoffeigenschaften (z. B. Pestizide): Flüchtigkeit, Mobilität, Abbaubarkeit, Metaboliten. <b>Intake Fraction</b> iF = aufgenommene Masse / emittierte Masse. In der LCA in USEtox (FF × XF × EF) integriert.' },
      { d: 'box-model' },
      { h: 'Innenraum-Exposition', t: 'Determinanten: Emissionsrate, Raumvolumen, Luftwechselrate (ACH), Anzahl und Position der Quellen, Durchmischung, Verhalten der Arbeiter (Abstand, Aufenthaltsdauer), Flüchtigkeit des Stoffs. <b>Modelle</b> mit zunehmender Komplexität und Datenbedarf: One-Box (gut durchmischt) → Near-Field/Far-Field (Two-Box, interzonaler Luftstrom β) → Eddy-Diffusion (Konzentrationsgradient um die Quelle). Wahl über einen Entscheidungsbaum (nahe Quelle? Durchmischung?). Danach Vergleich mit Grenzwert (RQ) oder Gesundheitsbewertung (DALY). Fallstudie im Kurs: Holzböden (VOC).' },
      { c: 'boxmodel' },
      { h: 'Lärm (Fenster an lauter Strasse, FS11)', t: 'Analog zum Innenraum-Modell: Quelle (Verkehr, Emissionspegel) → Ausbreitung (Distanz, Hindernisse, Fensterdämmung) → Exposition (Pegel beim Empfänger, Anzahl Betroffener, Tageszeit) → Effekt (Belästigung, Schlafstörung, Herz-Kreislauf; Expositions-Wirkungs-Beziehungen) → <b>DALY</b> über Disability weights.' },
    ],
    phrases: [
      'Risk assessment asks whether exposure at a specific site exceeds a threshold – RQ = PEC/PNEC – whereas LCA compares potential impacts per functional unit without thresholds.',
      'The emission rate is not the concentration: I need a fate model and the mixing conditions, room volume and ventilation rate.',
      'For a well-mixed room at steady state, the concentration is the emission rate divided by the ventilation rate; close to the source, a near-field/far-field model is more realistic.',
    ],
    traps: ['Emissionsrate mit Konzentration gleichsetzen (Hellweg: „Start at the beginning!“).', 'Konzentrationsaddition mit Multiplikation statt Division durch EC50.', 'LCA und RA als austauschbar darstellen.'],
    q: [
      card('Risikoquotient?', 'RQ = PEC / PNEC (bzw. Exposition / Grenzwert). RQ > 1 → Risiko. PNEC = NOEC / Assessment factor.'),
      card('Wozu dienen Assessment factors?', 'Unsicherheiten abdecken: Labor → Feld, akut → chronisch, Arten → Ökosystem, Tier → Mensch, individuelle Empfindlichkeit. Konservativ.'),
      card('Konzentrationsaddition?', 'Für gleich wirkende Stoffe: Σ Cᵢ / EC50ᵢ (toxic units). Summe ≥ 1 → Effekt zu erwarten.'),
      card('One-Box-Modell (steady state)?', 'C = E / Q mit Q = ACH × V (Luftwechselrate × Raumvolumen). Annahme: vollständige Durchmischung.'),
      card('Was braucht man zusätzlich für ein Two-Box-Modell?', 'Den interzonalen Luftaustausch β zwischen Near Field und Far Field (z. B. mit Tracergas gemessen) und die Grösse des Near Field.'),
      card('Intake Fraction?', 'iF = vom Menschen aufgenommene Masse / emittierte Masse. Verknüpft Emission und Exposition (z. B. PM, Toxizität).'),
      card('Unterschiede RA vs. LCA?', 'RA: ortsspezifisch, konzentrationsbasiert, Schwellenwerte, absolutes Risiko, konservativ. LCA: FU-bezogen, global, keine Schwellen (linear), relativer Vergleich, best estimate. Gemeinsam: Fate-, Expositions-, Effektmodelle.'),
      mc('Workers fill solvents in a warehouse. What is the first thing you need to estimate their risk?', ['The GWP of the solvent', 'The concentration they are exposed to, from emission rate, ventilation, room size and distance to source', 'The price of the solvent', 'The functional unit'], 1),
      mc('For a worker standing directly at an emission source, the one-box model will usually …', ['overestimate the exposure', 'underestimate the exposure', 'give exactly the right value', 'not be applicable at all'], 1),
      mc('Which statement about risk assessment is correct?', ['It uses best estimates and no thresholds', 'It is site-specific and compares exposure with thresholds', 'It always uses functional units', 'It aggregates impacts globally'], 1),
      tf('In concentration addition, concentrations are multiplied by the EC50 values.', false, 'Dividiert: Σ Cᵢ / EC50ᵢ.'),
      ord('Order the steps of a chemical risk assessment.', ['Hazard identification', 'Exposure assessment (PEC)', 'Effect assessment (PNEC = NOEC/AF)', 'Risk characterization (RQ = PEC/PNEC)']),
      sort('Risk assessment or LCA?', ['Risk assessment', 'LCA'], [['Site-specific concentrations', 0], ['Functional unit as reference', 1], ['Thresholds such as PNEC', 0], ['Comparison of product alternatives', 1], ['Conservative assumptions (worst case)', 0], ['Global supply chains integrated', 1]]),
      calc('One-box model: emission rate 500 mg/h, room volume 250 m³, air exchange rate 2 /h. Steady-state concentration?', 1, 'mg/m³', ['Q = ACH × V = 2 × 250 = 500 m³/h', 'C = E / Q = 500 / 500 = 1 mg/m³']),
      calc('NOEC = 2 mg/L, assessment factor 100, PEC = 0.03 mg/L. Risk quotient?', 1.5, '–', ['PNEC = 2 / 100 = 0.02 mg/L', 'RQ = 0.03 / 0.02 = 1.5 → Risiko (RQ > 1)']),
      calc('Two similarly acting pesticides: C₁ = 0.2 mg/L (EC50 = 1 mg/L), C₂ = 0.6 mg/L (EC50 = 2 mg/L). Sum of toxic units?', 0.5, 'TU', ['Σ Cᵢ/EC50ᵢ = 0.2/1 + 0.6/2 = 0.2 + 0.3 = 0.5']),
      oral('There are VOC emissions from printing the banknotes. Which information do you need to analyse the indoor exposure and the human health risk?', ['Emission rates of VOC (measurement, product data), number and position of sources', 'Room volume, ventilation/air exchange rate, mixing conditions', 'Worker behaviour: distance to source, duration of exposure', 'Model choice via decision tree: one-box → near-field/far-field → eddy diffusion', 'Effect: occupational limits / toxicity data (NOEC, EC50) → RQ, or DALY in LCA', 'Uncertainties: parameters, model, animal → human extrapolation'], { who: 'P', fu: [['How do you calculate the concentration in the simple box model?', 'Steady state: C = E / Q, with Q = air exchange rate × room volume.'], ['What do you need additionally for a two-box model?', 'The airflow between near field and far field (β) and the size of the near field.']] }),
      oral('The window frames are used near a busy street. How would you quantify the noise impact on human health?', ['Analogy to indoor air: source → propagation → exposure → effect', 'Source: traffic noise level; propagation: distance, façade/window sound insulation', 'Exposure: noise level at the receptor, number of people affected, time of day', 'Effect: annoyance, sleep disturbance, cardiovascular disease – exposure-response functions', 'Translate into DALY via disability weights; compare window options'], { who: 'P' }),
      oral('A fungicide is added during wheat production for bread. What do you have to consider?', ['Fate: volatility, mobility, degradation, metabolites; transport paths to air, water, soil', 'Exposure of ecosystems and humans (residues in food, drinking water)', 'Effect assessment: EC50/NOEC, mixtures (concentration addition)', 'In LCA: USEtox (ecotox CTUe, human tox CTUh); in RA: PEC/PNEC at specific sites', 'Data gaps and uncertainty'], { who: 'P' }),
    ],
  });
})();
