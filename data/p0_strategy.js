/* X0 – exam strategy */
(function () {
  const A = window.AEA, { card, mc, tf, ord, oral } = A.mk;
  A.topic({
    id: 'strategy', no: 'X0', part: 'X', icon: '🧭', title: 'Exam strategy',
    short: 'Format, the 30-minute preparation, answer pattern and what the examiners want to hear according to the protocols',
    learn: [
      { h: 'How the exam works', t: `<ul>
        <li><b>Combined exam</b> (Advanced Environmental, Social and Economic Assessments): <b>30 min preparation</b> alone with a case study (text, tables, flowchart, about 6–10 questions), then <b>30 min oral</b> with both examiners.</li>
        <li>First <b>Stephan Pfister</b>: product LCA methodology (FU, system boundaries, allocation, uncertainty, LCIA, regionalization, IO, review …). <b>Question 1 is always the functional unit.</b></li>
        <li>Then <b>Arthur Braunschweig</b>: the organisational view (company ecobalance, scopes, ISO 14001, Deming circle, targets, stakeholders, LCC, weighting, economics and sustainability).</li>
        <li>Language: usually <b>English</b> (the course language) – train the terms in English.</li>
        <li>The examiners <b>keep asking until they hear the key word</b>. Nodding means you are on the right track. You do not always get through all questions.</li>
        <li>You can <b>steer</b> the exam: if you mention a key word (e.g. recycling), they often pick it up.</li>
        <li>The rectorate schedules a 35-minute slot, but plan for twice that time.</li></ul>` },
      { box: 'exam', h: 'Golden rule', t: 'For every question start with a <b>one-sentence definition</b> (with the ISO term), then a <b>structured list</b>, then <b>apply it to the case</b>. The protocols show that points were lost mainly through imprecise terms and missing reference to the case.' },
      { h: 'The 30 minutes of preparation', t: `<ol>
        <li><b>3 min:</b> read all questions first, then the case – so you read with a purpose.</li>
        <li><b>5 min:</b> formulate the FU (function + quantity + quality + time) and sketch a small flowchart with the system boundary.</li>
        <li><b>2–3 min per question:</b> 5–8 key words, and a mini diagram where useful (scopes, product vs. company view, ISO 14001 cycle, allocation hierarchy, uncertainty types).</li>
        <li><b>Use the numbers:</b> if prices and amounts are in the table, calculate an allocation factor – it shows that you understand the data.</li>
        <li><b>2 min:</b> sort your notes and mark the opening sentence for each question.</li></ol>` },
      { h: 'Answer pattern in 5 steps', t: `<ol>
        <li><b>Define</b>: what is it? (ISO wording)</li>
        <li><b>Structure</b>: types, hierarchy, steps (e.g. the 3 ISO steps, the 6 uncertainty types)</li>
        <li><b>Apply</b>: concretely to the case (which process, which product, which data)</li>
        <li><b>Data</b>: which information do you need and where does it come from?</li>
        <li><b>Caveat</b>: limitations, alternatives, sensitivity, uncertainty</li></ol>` },
      { h: 'What the examiners expect according to the feedback', t: `<ul>
        <li><b>FU</b>: never only mass ("1 g of banknotes" was graded 4.0). Function instead of material: "use of a 200-DKK note (or a set of all denominations) during one year". When materials differ, the <b>lifetime</b> belongs in the FU.</li>
        <li><b>Allocation</b>: the ISO 14044 hierarchy with exact terms (<i>subdivision, system expansion, allocation based on physical relationships, other relationships</i>). Cut-off and EOR are <b>recycling</b> approaches, not "physical allocation". Explain avoided burden completely: impacts of the avoided products × amounts per FU – the result can become negative.</li>
        <li><b>Uncertainty</b>: name the types (parameter, model, scenario/choices + variability: spatial, temporal, between objects). Pedigree = estimate uncertainty, Monte Carlo = propagate it. Mixing them up was graded 2.5.</li>
        <li><b>Relevance of a product for the company</b>: product LCA and company footprint overlap only partly; data on all activities are needed; discuss the choice of unit (CO₂-eq, UBP, MJ, CHF).</li>
        <li><b>Deming circle</b>: where does the company use the LCA (plan: aspects and targets; check: monitoring)? Plus the other EMS elements (policy, organisation, aspects, compliance, programmes, audits, management review).</li>
        <li><b>Critical review</b>: procedure, content (5 points), reviewer skills, when it is mandatory (public comparative assertion → panel).</li></ul>` },
      { d: 'product-company' },
      { h: 'Diagrams you must be able to draw', t: 'ISO 14040 framework · product vs. organisational view · Scopes 1–3 · cause-effect chain (midpoint/endpoint) · climate change chain · allocation hierarchy · cut-off vs. avoided burden · uncertainty types + 3 steps · matrix LCA · IO table with satellite below · Deming circle · ISO 14001 cycle · critical review procedure. All of them are under <a href="#/graphs">Diagrams & calculators</a>.' },
      { h: 'If you get stuck', t: `<ul><li>Structure out loud: "There are three aspects I would consider …"</li><li>Go back to the case: what happens physically? Which data do I have?</li><li>Asking for clarification is allowed: "Do you mean the procedure of the review or its content?"</li><li>Do not drop a correct answer just because they follow up – a follow-up does not automatically mean "wrong".</li><li>Say something relevant rather than nothing; the examiners help when you are stuck.</li></ul>` },
    ],
    phrases: [
      'Let me start with the functional unit: the function is …, so I would define the FU as … over a period of …',
      'According to ISO 14044, allocation should be avoided first, either by subdivision or by system expansion. If that is not possible, we partition based on physical relationships, and only then on other relationships such as economic value.',
      'I would distinguish between uncertainty – a lack of knowledge – and variability, which is inherent in the system.',
      'The pedigree matrix is used to characterize the uncertainty of a single data point; Monte Carlo simulation then propagates all input uncertainties to the result.',
      'A product LCA and a company assessment usually only partially overlap: …',
      'This is a value choice, so I would make it transparent and test it in a sensitivity analysis.',
      'In the Deming cycle, the LCA results would mainly feed into the Plan phase – identifying significant aspects and setting targets – and into the Check phase for monitoring.',
    ],
    traps: [
      'A mass-only FU ("1 kg of product") although the products differ in function or lifetime.',
      'Calling cut-off or avoided burden "physical allocation" (they are recycling approaches).',
      'Mixing up the pedigree matrix and Monte Carlo.',
      'In the company question, talking only about the product LCA and forgetting the company\'s other activities.',
      'Answers without reference to the case (the examiners – especially Braunschweig – want to see the concept applied).',
    ],
    q: [
      card('Format of the combined oral exam?', '30 min preparation alone (case study with questions) + 30 min oral with both examiners. First Pfister (product LCA, question 1 = FU), then Braunschweig (company LCA).'),
      card('Answer pattern in 5 steps?', 'Define → Structure → Apply (to the case) → Data → Caveat (limitations, alternatives, sensitivity).'),
      ord('Put the preparation steps in a sensible order.', ['Read all questions', 'Read the case and mark the data', 'FU + flowchart with system boundary', 'Key words and a mini diagram per question', 'Prepare a calculation if data are given', 'Sort the notes, mark opening sentences']),
      mc('An examiner follows up after you gave a correct answer. What do you do?', ['Change your answer right away to be on the safe side', 'Stay with your answer, then refine and complete it', 'Stay silent and wait until they ask the next question', 'Ask the examiners which answer they would like to hear'], 1, 'According to the protocols, the examiners also follow up on correct answers when you seem unsure. Refine instead of overturning.'),
      tf('The functional unit is typically the first question in the combined exam.', true, 'That is Stephan Pfister\'s standard opening.'),
      tf('The exam is normally held in German because both examiners are Swiss.', false, 'The course language is English; earlier protocols report English as the exam language. Train the terms in English.'),
      mc('Which statement from the examiners\' feedback on uncertainty is correct?', ['The pedigree matrix propagates uncertainty through the product system', 'Monte Carlo requires lognormal distributions for every uncertain parameter', 'Pedigree estimates uncertainty without data; Monte Carlo propagates it', 'Differences between suppliers are model uncertainty, fixed by a better model'], 2, 'Pedigree = characterization (estimate when data are missing), Monte Carlo = stochastic propagation without a specific distribution form. Supplier differences = variability between objects/sources.'),
      oral('Introduce the topic: what is life cycle assessment, and what is it good for?', ['Systematic method to quantify environmental impacts of a product/service over its whole life cycle (cradle to grave)', 'Standardized in ISO 14040/14044; four phases: goal & scope, LCI, LCIA, interpretation (iterative)', 'Uses: identify hotspots/improvement potentials, compare alternatives with the same function (FU), eco-design, strategic decisions, policy, communication (EPD)', 'Avoids burden shifting between life cycle stages, regions and impact categories', 'Limitations: data intensive, value choices (FU, allocation, weighting), uncertainty, not site-specific risk'], { who: 'P' }),
      oral('What is the difference between the AEA part (product view) and the IESG part (organisational view)?', ['Product view: one product life cycle across many companies; reference = functional unit; ISO 14040/44, ISO 14067', 'Organisational view: all activities of one organisation in a period (1 year); EMS ISO 14001, GHG balance ISO 14064-1 / GHG Protocol, company ecobalance (ISO/TS 14072)', 'They overlap only partially (intersection of a life cycle and a company)', 'Scope 3 is the "window to LCA": links company accounting with life cycle thinking'], { who: 'B' }),
    ],
  });
})();
