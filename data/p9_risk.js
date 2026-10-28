/* P10 – Risk assessment, indoor exposure, noise (bonus; frequent in older exams) */
(function () {
  const A = window.AEA, { card, mc, tf, ord, match, sort, calc, oral } = A.mk;
  A.topic({
    id: 'risk', no: 'P10', part: 'P', icon: '☣️', title: 'Risk assessment, indoor exposure & noise (bonus)',
    short: 'RA vs. LCA, PEC/PNEC, fate–exposure–effect, box models, noise → DALY. Frequent in older exams',
    learn: [
      { box: 'tip', h: 'Why this chapter?', t: 'Pfister: "Main topic LCA, but also bits of chemical risk assessment." Many older exam protocols included VOC emissions from printing, solvent warehouses, fungicides and noise. It pays to master this briefly and confidently.' },
      { d: 'risk-vs-lca' },
      { h: 'Chemical risk assessment in 4 steps', t: '(1) <b>Hazard identification</b> · (2) <b>Exposure assessment</b>: PEC (predicted environmental concentration) or indoor concentration from emission and fate · (3) <b>Effect assessment</b>: dose–response, NOEC, EC50 → PNEC = NOEC / assessment factor · (4) <b>Risk characterization</b>: RQ = PEC / PNEC (RQ &gt; 1 → risk).' },
      { f: 'RQ = PEC / PNEC  ·  PNEC = NOEC / AF  (AF = 10 … 1000)' },
      { h: 'Assessment factors (safety factors)', t: 'Cover uncertainties: lab → field, acute → chronic, few tested species → ecosystem, animal → human, variability between individuals. Conservative approach (worst case), unlike LCA (best estimate).' },
      { h: 'Mixtures', t: 'Substances with the same mode of action: <b>concentration addition</b>: Σ (Cᵢ / EC50ᵢ) as a sum of "toxic units" (divide, do not multiply!). Different modes of action: independent action.' },
      { h: 'Fate & exposure', t: 'Emission rate ≠ concentration! Fate models (multimedia box models) account for the partitioning between air, water, soil and sediment (Kow, Henry constant), degradation and transport. Relevant substance properties (e.g. pesticides): volatility, mobility, degradability, metabolites. <b>Intake fraction</b> iF = mass taken in / mass emitted. Integrated in LCA in USEtox (FF × XF × EF).' },
      { d: 'box-model' },
      { h: 'Indoor exposure', t: 'Determinants: emission rate, room volume, air exchange rate (ACH), number and position of the sources, mixing, worker behaviour (distance, duration of stay), volatility of the substance. <b>Models</b> with increasing complexity and data demand: one-box (well mixed) → near-field/far-field (two-box, interzonal airflow β) → eddy diffusion (concentration gradient around the source). Choice via a decision tree (close to the source? mixing?). Then comparison with a limit value (RQ) or a health assessment (DALY). Case study in the course: wooden floors (VOC).' },
      { c: 'boxmodel' },
      { h: 'Noise (window on a busy street, FS11)', t: 'Analogous to the indoor model: source (traffic, emission level) → propagation (distance, obstacles, window sound insulation) → exposure (level at the receptor, number of people affected, time of day) → effect (annoyance, sleep disturbance, cardiovascular disease; exposure–response relationships) → <b>DALY</b> via disability weights.' },
    ],
    phrases: [
      'Risk assessment asks whether exposure at a specific site exceeds a threshold – RQ = PEC/PNEC – whereas LCA compares potential impacts per functional unit without thresholds.',
      'The emission rate is not the concentration: I need a fate model and the mixing conditions, room volume and ventilation rate.',
      'For a well-mixed room at steady state, the concentration is the emission rate divided by the ventilation rate; close to the source, a near-field/far-field model is more realistic.',
    ],
    traps: ['Equating the emission rate with the concentration (Hellweg: "Start at the beginning!").', 'Concentration addition with multiplication instead of division by the EC50.', 'Presenting LCA and RA as interchangeable.'],
    q: [
      card('Risk quotient?', 'RQ = PEC / PNEC (or exposure / limit value). RQ > 1 → risk. PNEC = NOEC / assessment factor.'),
      card('What are assessment factors for?', 'To cover uncertainties: lab → field, acute → chronic, species → ecosystem, animal → human, individual sensitivity. Conservative.'),
      card('Concentration addition?', 'For substances with the same mode of action: Σ Cᵢ / EC50ᵢ (toxic units). Sum ≥ 1 → effect expected.'),
      card('One-box model (steady state)?', 'C = E / Q with Q = ACH × V (air exchange rate × room volume). Assumption: complete mixing.'),
      card('What else do you need for a two-box model?', 'The interzonal air exchange β between near field and far field (e.g. measured with tracer gas) and the size of the near field.'),
      card('Intake fraction?', 'iF = mass taken in by humans / mass emitted. Links emission and exposure (e.g. PM, toxicity).'),
      card('Differences RA vs. LCA?', 'RA: site-specific, concentration-based, thresholds, absolute risk, conservative. LCA: FU-based, global, no thresholds (linear), relative comparison, best estimate. Shared: fate, exposure and effect models.'),
      mc('Workers fill solvents in a warehouse. What is the first thing you need to estimate their risk?', ['The global warming potential of the solvent', 'The concentration they are exposed to', 'The functional unit of the storage service', 'The USEtox characterization factor'], 1, 'Start at the beginning: emission rate, ventilation, room size and distance to the source determine the concentration.'),
      mc('For a worker standing directly at an emission source, the one-box model will usually …', ['overestimate the exposure', 'underestimate the exposure', 'give the exact value', 'not be applicable at all'], 1, 'It assumes complete mixing – close to the source the concentration is higher (near field).'),
      mc('Which statement about risk assessment is correct?', ['It uses best estimates and avoids any thresholds', 'It compares local exposure with a threshold', 'It always refers results to a functional unit', 'It sums potential impacts along global supply chains'], 1),
      tf('In concentration addition, concentrations are multiplied by the EC50 values.', false, 'Divided: Σ Cᵢ / EC50ᵢ.'),
      ord('Order the steps of a chemical risk assessment.', ['Hazard identification', 'Exposure assessment (PEC)', 'Effect assessment (PNEC = NOEC/AF)', 'Risk characterization (RQ = PEC/PNEC)']),
      sort('Risk assessment or LCA?', ['Risk assessment', 'LCA'], [['Site-specific concentrations', 0], ['Functional unit as reference', 1], ['Thresholds such as PNEC', 0], ['Comparison of product alternatives', 1], ['Conservative assumptions (worst case)', 0], ['Global supply chains integrated', 1]]),
      calc('One-box model: emission rate 500 mg/h, room volume 250 m³, air exchange rate 2 /h. Steady-state concentration?', 1, 'mg/m³', ['Q = ACH × V = 2 × 250 = 500 m³/h', 'C = E / Q = 500 / 500 = 1 mg/m³']),
      calc('NOEC = 2 mg/L, assessment factor 100, PEC = 0.03 mg/L. Risk quotient?', 1.5, '–', ['PNEC = 2 / 100 = 0.02 mg/L', 'RQ = 0.03 / 0.02 = 1.5 → risk (RQ > 1)']),
      calc('Two similarly acting pesticides: C₁ = 0.2 mg/L (EC50 = 1 mg/L), C₂ = 0.6 mg/L (EC50 = 2 mg/L). Sum of toxic units?', 0.5, 'TU', ['Σ Cᵢ/EC50ᵢ = 0.2/1 + 0.6/2 = 0.2 + 0.3 = 0.5']),
      oral('There are VOC emissions from printing the banknotes. Which information do you need to analyse the indoor exposure and the human health risk?', ['Emission rates of VOC (measurement, product data), number and position of sources', 'Room volume, ventilation/air exchange rate, mixing conditions', 'Worker behaviour: distance to source, duration of exposure', 'Model choice via decision tree: one-box → near-field/far-field → eddy diffusion', 'Effect: occupational limits / toxicity data (NOEC, EC50) → RQ, or DALY in LCA', 'Uncertainties: parameters, model, animal → human extrapolation'], { who: 'P', fu: [['How do you calculate the concentration in the simple box model?', 'Steady state: C = E / Q, with Q = air exchange rate × room volume.'], ['What do you need additionally for a two-box model?', 'The airflow between near field and far field (β) and the size of the near field.']] }),
      oral('The window frames are used near a busy street. How would you quantify the noise impact on human health?', ['Analogy to indoor air: source → propagation → exposure → effect', 'Source: traffic noise level; propagation: distance, façade/window sound insulation', 'Exposure: noise level at the receptor, number of people affected, time of day', 'Effect: annoyance, sleep disturbance, cardiovascular disease – exposure-response functions', 'Translate into DALY via disability weights; compare window options'], { who: 'P' }),
      oral('A fungicide is added during wheat production for bread. What do you have to consider?', ['Fate: volatility, mobility, degradation, metabolites; transport paths to air, water, soil', 'Exposure of ecosystems and humans (residues in food, drinking water)', 'Effect assessment: EC50/NOEC, mixtures (concentration addition)', 'In LCA: USEtox (ecotox CTUe, human tox CTUh); in RA: PEC/PNEC at specific sites', 'Data gaps and uncertainty'], { who: 'P' }),
    ],
  });
})();
