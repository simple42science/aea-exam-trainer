/* ISO compass – standards and frameworks */
(function () {
  const A = window.AEA;
  const E = (o) => A.iso.push(o);

  E({ id: 'iso14040', code: 'ISO 14040', title: 'LCA – Principles and framework', cat: 'prod', level: 'Product', cert: false,
    what: 'Principles and framework of LCA: terms, the four phases (goal & scope, LCI, LCIA, interpretation), applications, critical review, report.',
    points: ['Edition 2006 (+ amendment 2020)', 'Defines functional unit, system boundary, allocation, elementary flow …', 'Iterative nature of LCA', 'Applications outside the framework: product development, strategy, policy, marketing'],
    exam: 'Be able to name and draw the four phases (graphic). "Described in ISO 14040/44."', confuse: 'ISO 14001 (management system of the organisation) – not the same!', rel: ['iso14044', 'iso14071', 'iso14067'], diagram: 'lca-framework' });
  E({ id: 'iso14044', code: 'ISO 14044', title: 'LCA – Requirements and guidelines', cat: 'prod', level: 'Product', cert: false,
    what: 'Requirements and guidelines for conducting an LCA: data quality, allocation hierarchy, LCIA elements (mandatory/optional), interpretation, critical review, report.',
    points: ['Allocation: 1 avoid (subdivision, system expansion) → 2 physical relationships → 3 other (economic)', 'LCIA mandatory: selection, classification, characterization; optional: normalization, grouping, weighting', '4.4.5: no weighting for comparative assertions disclosed to the public', 'Critical review mandatory for comparative assertions disclosed to the public (panel)', 'Transparency (5.1); confidential data may be omitted (5.2)'],
    exam: 'The allocation hierarchy word for word; the review obligation; the ban on weighting.', confuse: 'ISO 14040 = principles; ISO 14044 = requirements.', rel: ['iso14040', 'iso14071'], diagram: 'alloc-tree' });
  E({ id: 'iso14071', code: 'ISO/TS 14071', title: 'Critical review processes and reviewer competencies', cat: 'prod', level: 'Product', cert: false,
    what: 'Technical specification that details the critical review process of ISO 14044: procedure, roles, competences of the reviewers (2014, revised 2024).',
    points: ['Review by an internal or external expert or by a panel of interested parties', 'Panel: independent chair + members (at least 3)', 'Competences: knowledge of ISO, LCA methodology, sector knowledge, independence, language'],
    exam: 'Explain the procedure and the competences of the reviewers.', rel: ['iso14044'], diagram: 'critical-review' });
  E({ id: 'iso14067', code: 'ISO 14067', title: 'Carbon footprint of products', cat: 'prod', level: 'Product', cert: false,
    what: 'Requirements and guidelines for quantifying the carbon footprint of products (2018), based on ISO 14040/44; climate change only.',
    points: ['Partial or full CFP (cradle-to-gate or cradle-to-grave)', 'Report biogenic carbon separately', 'No offsetting in the CFP', 'Related: PAS 2050, GHG Protocol Product Standard'],
    exam: 'Difference between a carbon footprint and an LCA; ISO 14067 vs. PAS 2050.', confuse: 'ISO 14064-1 = GHG inventory of the organisation.', rel: ['pas2050', 'iso14064', 'iso14040'] });
  E({ id: 'pas2050', code: 'PAS 2050', title: 'Specification for the GHG emissions of goods and services (UK)', cat: 'prod', level: 'Product', cert: false,
    what: 'Publicly available specification of the BSI (UK, 2008, revised 2011) for the carbon footprint of goods and services; precursor of ISO 14067.',
    points: ['Assessment period of 100 years', 'B2B (cradle-to-gate) and B2C (cradle-to-grave)', 'The older version allowed weighting of delayed emissions'], exam: 'In older exams: "details on PAS 2050 and ISO 14067".', rel: ['iso14067'] });
  E({ id: 'iso14046', code: 'ISO 14046', title: 'Water footprint – principles, requirements, guidelines', cat: 'prod', level: 'Product & organisation', cert: false,
    what: 'Water footprint of products, processes and organisations following the LCA logic (2014): water scarcity, water pollution (eutrophication, toxicity …).',
    points: ['Assesses water consumption and the degradation of water quality', 'Regionalization is essential (e.g. AWARE factors)', 'Water scarcity footprint vs. comprehensive water footprint'], exam: 'For cotton, rice, lithium: assess water scarcity in a regionalized way.', rel: ['iso14040'] });
  E({ id: 'iso14072', code: 'ISO/TS 14072', title: 'Organizational LCA (O-LCA)', cat: 'org', level: 'Organisation', cert: false,
    what: 'Technical specification (2014) on how to apply ISO 14040/44 to whole organisations: life-cycle inventory of all products or activities of a company (basis of the company ecobalance).',
    points: ['Reference: organisation × reporting period instead of FU', 'Direct and indirect (upstream and downstream) activities', 'Analogous to the scope logic, but multi-criteria'], exam: 'Braunschweig\'s graphic: "Company ecobalance (ISO 14072)".', rel: ['iso14064', 'iso14031', 'iso14001'], diagram: 'product-company' });
  E({ id: 'iso14064', code: 'ISO 14064-1/-2/-3', title: 'GHG inventories (organisations), projects, verification', cat: 'org', level: 'Organisation', cert: true,
    what: 'Part 1: GHG inventory of organisations (direct and indirect emissions, scope logic); part 2: GHG projects (reductions/removals); part 3: verification and validation.',
    points: ['Compatible with the GHG Protocol', '2018: categories instead of scopes (direct, imported energy, transport, purchased products, use of products, other)', 'Third-party verification possible (part 3)'],
    exam: 'Beechtex "climate neutral": account for the company according to ISO 14064 with Scopes 1–3.', confuse: 'ISO 14067 = product footprint.', rel: ['ghgp', 'iso14068', 'sbti'], diagram: 'scopes' });
  E({ id: 'ghgp', code: 'GHG Protocol', title: 'Corporate, Scope 2, Scope 3 & Product Standards (WRI/WBCSD)', cat: 'org', level: 'Organisation', cert: false,
    what: 'The world\'s most widely used accounting standard for greenhouse gases (WRI/WBCSD): Corporate Standard (2004), Scope 2 Guidance (2015), Scope 3 Standard (2011, 15 categories), Product Standard.',
    points: ['Scope 1 direct, Scope 2 purchased energy (location- and market-based), Scope 3 rest of the value chain', 'Principles: relevance, completeness, consistency, transparency, accuracy', 'Organisational boundary: equity share or control'],
    exam: 'Explain the scopes and assign examples; "Scope 3 = window to LCA".', rel: ['iso14064', 'sbti', 'cdp'], diagram: 'scopes' });
  E({ id: 'iso14068', code: 'ISO 14068-1', title: 'Carbon neutrality', cat: 'org', level: 'Organisation & product', cert: false,
    what: 'Standard (2023) for the carbon neutrality of organisations and products: GHG inventory, reduction plan first, offsetting only for residual emissions with quality criteria, verification and communication.',
    points: ['Replaces PAS 2060', 'Reduction before offsetting', 'Requirements for credits (additionality, permanence, no double counting)'], exam: 'Critical check of a "climate neutral" claim.', rel: ['iso14064', 'sbti'] });
  E({ id: 'iso14001', code: 'ISO 14001', title: 'Environmental management systems – requirements', cat: 'org', level: 'Organisation', cert: true,
    what: 'The world\'s most important standard for environmental management systems (since 1996, revision 2015): PDCA with context, leadership, policy, planning (significant aspects, objectives), operation, performance evaluation, improvement.',
    points: ['Determine significant environmental aspects (controllable and influenceable, life-cycle perspective)', 'Fulfil compliance obligations', 'No prescribed performance level, only continual improvement', 'Certification by accredited third parties (annual surveillance audits)'],
    exam: 'Explain the elements and the cycle; what ISO 14001 tells you about a supplier (system, not performance).', confuse: 'Product labels (MSC, type I) and LCA standards (ISO 14040).', rel: ['iso14004', 'emas', 'iso50001', 'iso9001'], diagram: 'iso14001-cycle' });
  E({ id: 'iso14004', code: 'ISO 14004', title: 'EMS – general guidelines on implementation', cat: 'org', level: 'Organisation', cert: false,
    what: 'Guidance on implementing and improving an environmental management system according to ISO 14001 (not certifiable).', points: ['Practical advice on each element of ISO 14001'], rel: ['iso14001'] });
  E({ id: 'emas', code: 'EMAS', title: 'EU Eco-Management and Audit Scheme', cat: 'org', level: 'Organisation', cert: true,
    what: 'EU environmental management (since 1993/1995; Regulation 1221/2009): includes ISO 14001 and additionally requires a public, validated environmental statement, performance improvement, legal compliance and the involvement of the employees.',
    points: ['Registration after validation by an environmental verifier', 'Core indicators (energy, material, water, waste, biodiversity, emissions)'], exam: 'Difference to ISO 14001: public disclosure and performance.', rel: ['iso14001'] });
  E({ id: 'iso14031', code: 'ISO 14031', title: 'Environmental performance evaluation', cat: 'org', level: 'Organisation', cert: false,
    what: 'Guidance on evaluating environmental performance with indicators: management performance indicators (MPI), operational performance indicators (OPI) and environmental condition indicators (ECI).',
    points: ['Basis for eco-controlling and benchmarking'], exam: 'Braunschweig\'s graphic: "Environmental Performance Evaluation (ISO 14031)" covers both the product and the company view.', rel: ['iso14001', 'iso14072'] });
  E({ id: 'iso50001', code: 'ISO 50001', title: 'Energy management systems', cat: 'org', level: 'Organisation', cert: true,
    what: 'Certifiable energy management system (PDCA): energy review, energy performance indicators (EnPI), baseline, objectives, continual improvement of energy efficiency.', points: ['Same high-level structure as ISO 14001', 'Relevant for energy-intensive companies (e.g. 3 GWh for cooling/smoking)'], rel: ['iso14001'] });
  E({ id: 'iso9001', code: 'ISO 9001', title: 'Quality management systems', cat: 'org', level: 'Organisation', cert: true,
    what: 'Quality management via processes (process approach, PDCA, customer focus): planning → implementation → evaluation → improvement; management, business and support processes.',
    points: ['Process description: input – activities – output, responsibility, measures, documents', 'Basis for integrated management systems'], exam: '"What is a process and what elements are necessary to describe it?"', rel: ['iso14001', 'efqm'] });
  E({ id: 'iso45001', code: 'ISO 45001', title: 'Occupational health & safety management', cat: 'soc', level: 'Organisation', cert: true,
    what: 'Certifiable management system for occupational health and safety (2018), same structure as ISO 14001.', points: ['Hazard assessment, objectives, participation of the employees'], rel: ['iso14001', 'sa8000'] });
  E({ id: 'sa8000', code: 'SA8000', title: 'Social Accountability standard (SAI)', cat: 'soc', level: 'Organisation', cert: true,
    what: 'Certifiable social standard based on the ILO conventions and UN human rights: no child or forced labour, freedom of association, non-discrimination, health & safety, working hours, remuneration, management system.',
    points: ['Certified companies also require SA8000 from their suppliers → it propagates', 'Sectors: textiles, construction, leather & shoes, cleaning', '2015: approx. 3,500 organisations, 1.9 million employees'],
    exam: 'Salmon with suppliers in Chile, lithium mining: why SA8000 and what it requires.', confuse: 'ISO 26000 is not certifiable.', rel: ['iso26000', 'bsci', 'iso45001'] });
  E({ id: 'iso26000', code: 'ISO 26000', title: 'Guidance on social responsibility', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Guidance (2010, not certifiable) on social responsibility with a focus on a transparent stakeholder dialogue; 7 core subjects: organisational governance, human rights, labour practices, environment, fair operating practices, consumer issues, community involvement.',
    points: ['Can guide internal processes, but is no normative basis for contracts'], confuse: 'SA8000 (certifiable).', rel: ['sa8000', 'iso20400'] });
  E({ id: 'iso20400', code: 'ISO 20400', title: 'Sustainable procurement – guidance', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Guidance (2017, not certifiable) on integrating sustainability into procurement: principles, strategy, organisation incl. the knowledge of the staff, procurement process.', points: ['Complements ISO 26000 for purchasing'], rel: ['iso26000'] });
  E({ id: 'bsci', code: 'amfori BSCI', title: 'Business Social Compliance Initiative', cat: 'soc', level: 'Supply chain', cert: false,
    what: 'Industry initiative with a code of conduct and an audit system for social standards in supply chains (esp. retail, textiles); joint audits for many customers.', points: ['Basis: ILO standards', 'Audits and improvement plans at the suppliers'], rel: ['sa8000'] });
  E({ id: 'iso14020', code: 'ISO 14020', title: 'Environmental statements and programmes – principles', cat: 'com', level: 'Product', cert: false,
    what: 'Basic principles for environmental labels and declarations: accurate, verifiable, relevant, not misleading.', rel: ['iso14021', 'iso14024', 'iso14025'], diagram: 'labels' });
  E({ id: 'iso14021', code: 'ISO 14021', title: 'Type II – self-declared environmental claims', cat: 'com', level: 'Product', cert: false,
    what: 'Self-declared environmental claims of manufacturers without third-party verification (e.g. "recyclable", "30 % recycled content"); they must be verifiable and not misleading.', confuse: 'Type I = label of an independent body.', rel: ['iso14020'], diagram: 'labels' });
  E({ id: 'iso14024', code: 'ISO 14024', title: 'Type I – environmental labelling (ecolabels)', cat: 'com', level: 'Product', cert: true,
    what: 'Voluntary, multi-criteria ecolabels of an independent body based on the life cycle (pass/fail → logo), e.g. Blue Angel, EU Ecolabel, Nordic Swan.', rel: ['iso14020'], diagram: 'labels' });
  E({ id: 'iso14025', code: 'ISO 14025', title: 'Type III – environmental declarations (EPD)', cat: 'com', level: 'Product', cert: true,
    what: 'Quantitative environmental product declarations (EPD) based on LCA according to product category rules (PCR), verified by third parties and published via a programme operator; no valuation.',
    points: ['PCRs define the methodology, the report and the verification', 'Construction products: EN 15804'], exam: 'Recycling allocation in EPDs (module D).', rel: ['en15804', 'iso14040'], diagram: 'labels' });
  E({ id: 'en15804', code: 'EN 15804', title: 'EPD core rules for construction products', cat: 'com', level: 'Product', cert: false,
    what: 'European standard for EPDs of construction products with modules A1–A3 (production), A4–A5 (construction), B1–B7 (use), C1–C4 (end of life) and D (benefits and loads beyond the system boundary, net secondary flow, reported separately).', points: ['A2:2019 with EF impact categories'], exam: 'Recycling: module D = (R2 − R1)(E_rec,EoL − E*_V).', rel: ['iso14025'], diagram: 'recycling' });
  E({ id: 'pef', code: 'PEF / OEF', title: 'EU Product & Organisation Environmental Footprint', cat: 'prod', level: 'Product & organisation', cert: false,
    what: 'EU method (recommendation 2013, updated 2021): 16 impact categories (EF 3.1), product-group-specific rules (PEFCR), Circular Footprint Formula for recycling, normalization and weighting to a single score allowed.',
    points: ['Recycling: split between primary production and recycling (A factor 0.2–0.8; 2013: 50:50)', '100 % credit for recovered energy'], exam: 'One of the 4 recycling approaches (Frischknecht).', confuse: 'ISO forbids weighting in public comparisons; PEF allows a single score.', rel: ['iso14044', 'en15804'] });
  E({ id: 'iso14008', code: 'ISO 14008', title: 'Monetary valuation of environmental impacts', cat: 'org', level: 'Organisation & product', cert: false,
    what: 'Standard (2019) for the monetary valuation of environmental impacts and aspects (e.g. damage costs, willingness to pay), basis for external costs and environmental LCC.', rel: ['iso15686'] });
  E({ id: 'iso15686', code: 'ISO 15686-5', title: 'Buildings – service life planning: life-cycle costing', cat: 'org', level: 'Product (buildings)', cert: false,
    what: 'Standard for life-cycle costing of buildings and constructed assets: cost categories, discounting, period of analysis.', rel: ['iso14008'] });
  E({ id: 'efqm', code: 'EFQM Model', title: 'Excellence / TQM model', cat: 'org', level: 'Organisation', cert: false,
    what: 'Model of the European Foundation for Quality Management for total quality management: enablers (leadership, strategy, people, partnerships & resources, processes) → results (people, customers, society, key results).', confuse: 'Not an ISO standard, no certificate in the strict sense (recognition levels).', rel: ['iso9001'], diagram: 'ssc-efqm' });
  E({ id: 'gri', code: 'GRI Standards', title: 'Global Reporting Initiative – sustainability reporting', cat: 'soc', level: 'Organisation', cert: false,
    what: 'The world\'s most widely used standard for sustainability reports: universal standards (GRI 1–3), sector and topic standards (economic, environmental, social); impact materiality.',
    points: ['Indicators e.g. energy by carrier, water by source, GHG Scopes 1–3, injury rates, training, child labour risks, corruption'], exam: '"Explain the GRI standard."', rel: ['ungc', 'csrd', 'sasb'] });
  E({ id: 'ungc', code: 'UN Global Compact', title: '10 principles for responsible business', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Voluntary UN platform (founded under Kofi Annan): the CEO signs 10 principles on human rights (1–2), labour standards (3–6), environment (7–9) and corruption (10); annual communication on progress.', points: ['Approx. 9,000 companies, 12,000 organisations', 'Principle 7: precautionary principle'], confuse: 'GRI is a reporting standard.', rel: ['gri', 'sbti'] });
  E({ id: 'sasb', code: 'SASB Standards', title: 'Industry-specific ESG disclosure for investors (US)', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Industry-specific standards (77 industries) for financially material sustainability topics, for investors and SEC requirements; today with the IFRS Foundation (ISSB).', rel: ['gri', 'csrd'] });
  E({ id: 'csrd', code: 'EU CSRD / ESRS', title: 'Corporate Sustainability Reporting Directive', cat: 'soc', level: 'Organisation', cert: false,
    what: 'EU directive (2022): obligation to report on sustainability according to the European Sustainability Reporting Standards with double materiality and external assurance; staggered from financial year 2024; simplified and postponed in 2025 by the Omnibus package.', points: ['Also applies to non-EU companies with large EU business', 'Linked to the EU taxonomy'], exam: 'Explain double materiality.', rel: ['taxonomy', 'gri'], diagram: 'double-materiality' });
  E({ id: 'taxonomy', code: 'EU Taxonomy', title: 'Classification of sustainable economic activities', cat: 'soc', level: 'Organisation / finance', cert: false,
    what: 'EU regulation (2020): classification of environmentally sustainable economic activities for 6 environmental objectives: substantial contribution, do no significant harm (DNSH), minimum social safeguards. Against greenwashing in investments.', rel: ['csrd'] });
  E({ id: 'sbti', code: 'SBTi', title: 'Science Based Targets initiative', cat: 'org', level: 'Organisation', cert: false,
    what: 'Initiative of CDP, UN Global Compact, WRI and WWF: validation of GHG targets in line with 1.5 °C (Scope 1+2, relevant parts of Scope 3), near-term (5–10 years) and Net-Zero Standard (≈ 90 % reduction, the rest with permanent removals).', points: ['Voluntary; approx. 10,000 companies with targets (course)', 'Offsetting does not count as a reduction'], exam: '"Science based targets" is an exam topic.', rel: ['ghgp', 'cdp'] });
  E({ id: 'cdp', code: 'CDP', title: 'Carbon Disclosure Project', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Non-profit platform through which companies and cities disclose environmental data (climate, water, forests) to investors and customers; scoring from A to D−.', rel: ['sbti', 'ghgp'] });
})();
