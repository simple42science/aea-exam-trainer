/* X0 – exam strategy */
(function () {
  const A = window.AEA, { card, mc, tf, ord, oral } = A.mk;
  A.topic({
    id: 'strategy', no: 'X0', part: 'X', icon: '🧭', title: 'Prüfungsstrategie',
    short: 'Ablauf, 30-min-Vorbereitung, Antwortmuster und was die Prüfer laut Protokollen hören wollen',
    learn: [
      { h: 'So läuft die Prüfung', t: `<ul>
        <li><b>Kombinierte Prüfung</b> (Advanced Environmental, Social and Economic Assessments): <b>30 min Vorbereitung</b> allein mit einer Fallstudie (Text, Tabellen, Fliessbild, ca. 6–10 Fragen), danach <b>30 min mündlich</b> zu dritt.</li>
        <li>Zuerst <b>Stephan Pfister</b>: Produkt-LCA (Methodik: FU, Systemgrenzen, Allokation, Unsicherheit, LCIA, Regionalisierung, IO, Review …). <b>Frage 1 ist immer die funktionelle Einheit.</b></li>
        <li>Dann <b>Arthur Braunschweig</b>: Firmensicht (Betriebsökobilanz, Scopes, ISO 14001, Deming-Kreis, Ziele, Stakeholder, LCC, Gewichtung, Wirtschaft & Nachhaltigkeit).</li>
        <li>Sprache in der Regel <b>Englisch</b> (Kurssprache). Trainiere die Begriffe auf Englisch.</li>
        <li>Die Prüfer <b>fragen nach, bis das Stichwort fällt</b>. Nicken heisst: richtige Richtung. Man kommt nicht immer durch alle Fragen.</li>
        <li>Du kannst die Prüfung <b>steuern</b>: Erwähnst du ein Stichwort (z. B. Recycling), greifen sie es oft auf.</li>
        <li>Zeitslot laut Rektorat 35 min, aber mit dem Doppelten rechnen.</li></ul>` },
      { box: 'exam', h: 'Goldene Regel', t: 'Bei jeder Frage zuerst die <b>Definition in einem Satz</b> (mit ISO-Begriff), dann eine <b>strukturierte Liste</b>, dann <b>auf den Fall anwenden</b>. Die Protokolle zeigen: Punkte gingen vor allem durch ungenaue Begriffe und fehlenden Fallbezug verloren.' },
      { h: 'Die 30 Minuten Vorbereitung', t: `<ol>
        <li><b>3 min:</b> Alle Fragen zuerst lesen, dann den Fall. So liest du gezielt.</li>
        <li><b>5 min:</b> FU formulieren (Funktion + Menge + Qualität + Zeit) und ein kleines Fliessbild mit Systemgrenze skizzieren.</li>
        <li><b>je 2–3 min pro Frage:</b> 5–8 Stichworte, wo sinnvoll eine Mini-Grafik (Scopes, Produkt- vs. Firmensicht, ISO-14001-Zyklus, Allokations-Hierarchie, Unsicherheitstypen).</li>
        <li><b>Zahlen nutzen:</b> Stehen Preise und Mengen in der Tabelle, rechne einen Allokationsfaktor vor. Das beeindruckt und zeigt, dass du die Daten verstehst.</li>
        <li><b>2 min:</b> Notizen ordnen, Einstiegssatz für jede Frage markieren.</li></ol>` },
      { h: 'Antwortmuster in 5 Schritten', t: `<ol>
        <li><b>Define</b>: Was ist das? (ISO-Wortlaut)</li>
        <li><b>Structure</b>: Typen, Hierarchie, Schritte (z. B. 3 ISO-Schritte, 6 Unsicherheitstypen)</li>
        <li><b>Apply</b>: konkret auf den Fall (welcher Prozess, welches Produkt, welche Daten)</li>
        <li><b>Data</b>: Welche Informationen brauchst du, woher kommen sie?</li>
        <li><b>Caveat</b>: Grenzen, Alternativen, Sensitivität, Unsicherheit</li></ol>` },
      { h: 'Was die Prüfer laut Feedback erwarten', t: `<ul>
        <li><b>FU</b>: nie nur Masse („1 g Banknoten“ gab eine 4.0). Funktion statt Material: „Nutzung einer 200-DKK-Note (oder eines Sets aller Stückelungen) während eines Jahres“. Bei unterschiedlichen Materialien gehört die <b>Lebensdauer</b> rein.</li>
        <li><b>Allokation</b>: ISO-14044-Hierarchie mit exakten Begriffen (<i>subdivision, system expansion, allocation based on physical relationships, other relationships</i>). Cut-off und EOR sind <b>Recycling</b>-Ansätze, keine „physikalische Allokation“. Avoided burden vollständig erklären: Umweltlast der vermiedenen Produkte × Menge pro FU, das Resultat kann negativ werden.</li>
        <li><b>Unsicherheit</b>: Typen nennen (Parameter, Modell, Szenario/Entscheidungen + Variabilität räumlich, zeitlich, zwischen Objekten). Pedigree = Unsicherheit schätzen, Monte Carlo = fortpflanzen. Nicht verwechseln (das gab eine 2.5).</li>
        <li><b>Relevanz eines Produkts für die Firma</b>: Produkt-LCA und Firmenbilanz überlappen nur teilweise; Daten aller Aktivitäten nötig; Wahl der Einheit diskutieren (CO₂-eq, UBP, MJ, CHF).</li>
        <li><b>Deming-Kreis</b>: Wo nutzt die Firma die LCA (Plan: Aspekte und Ziele; Check: Monitoring)? Plus die anderen EMS-Elemente (Politik, Organisation, Aspekte, Compliance, Programme, Audits, Management Review).</li>
        <li><b>Critical Review</b>: Ablauf, Prüfinhalt (5 Punkte), Kompetenzen der Reviewer, wann Pflicht (öffentliche vergleichende Aussage → Panel).</li></ul>` },
      { d: 'product-company' },
      { h: 'Grafiken, die du zeichnen können musst', t: 'ISO-14040-Rahmen · Produkt- vs. Organisationssicht · Scopes 1–3 · Ursache-Wirkungs-Kette (Midpoint/Endpoint) · Klimawandel-Kette · Allokations-Hierarchie · Cut-off vs. Avoided burden · Unsicherheitstypen + 3 Schritte · Matrix-LCA · IO-Tabelle mit Satellit unten · Deming-Kreis · ISO-14001-Zyklus · Critical-Review-Ablauf. Alle findest du unter <a href="#/graphs">Grafiken & Rechner</a>.' },
      { h: 'Wenn du nicht weiterweisst', t: `<ul><li>Laut strukturieren: „There are three aspects I would consider …“</li><li>Auf den Fall zurückgehen: Was passiert physisch? Welche Daten habe ich?</li><li>Rückfrage ist erlaubt: „Do you mean the procedure of the review or its content?“</li><li>Eine richtige Antwort bei Nachhaken nicht vorschnell ändern. Nachfragen heisst nicht automatisch „falsch“.</li><li>Lieber etwas Relevantes sagen als schweigen; die Prüfer helfen, wenn du auf dem Schlauch stehst.</li></ul>` },
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
      'FU als reine Masse („1 kg Produkt“), obwohl die Produkte unterschiedliche Funktion oder Lebensdauer haben.',
      'Cut-off oder avoided burden als „physikalische Allokation“ bezeichnen (das sind Recycling-Ansätze).',
      'Pedigree-Matrix und Monte Carlo verwechseln.',
      'Bei der Firmenfrage nur über die Produkt-LCA sprechen und die übrigen Firmenaktivitäten vergessen.',
      'Antworten ohne Fallbezug (die Prüfer wollen das Konzept angewendet sehen, v. a. Braunschweig).',
    ],
    q: [
      card('Format der kombinierten mündlichen Prüfung?', '30 min Vorbereitung allein (Fallstudie mit Fragen) + 30 min mündlich mit beiden Prüfern. Erst Pfister (Product LCA, Frage 1 = FU), dann Braunschweig (Company LCA).'),
      card('Antwortmuster in 5 Schritten?', 'Define → Structure → Apply (Fall) → Data → Caveat (Grenzen, Alternativen, Sensitivität).'),
      ord('Bringe die Vorbereitungsschritte in eine sinnvolle Reihenfolge.', ['Alle Fragen lesen', 'Fall lesen und Daten markieren', 'FU + Fliessbild mit Systemgrenze', 'Stichworte und Mini-Grafik pro Frage', 'Rechnung vorbereiten, falls Daten gegeben', 'Notizen ordnen, Einstiegssätze markieren']),
      mc('Ein Prüfer fragt nach, nachdem du eine korrekte Antwort gegeben hast. Was tust du?', ['Antwort sofort ändern', 'Bei der Antwort bleiben, sie präzisieren und ergänzen', 'Schweigen', 'Um die nächste Frage bitten'], 1, 'Laut Protokollen haken die Prüfer auch bei richtigen Antworten nach, wenn man unsicher wirkt. Präzisieren statt umwerfen.'),
      tf('Die funktionelle Einheit ist in der kombinierten Prüfung typischerweise die erste Frage.', true, 'Das ist der Standard-Einstieg von Stephan Pfister.'),
      tf('Die Prüfung findet normalerweise auf Deutsch statt, da beide Prüfer Schweizer sind.', false, 'Kurssprache ist Englisch; frühere Protokolle berichten Englisch als Prüfungssprache. Begriffe auf Englisch trainieren.'),
      mc('Welche Aussage aus dem Prüfer-Feedback zur Unsicherheit ist korrekt?', ['Die Pedigree-Matrix propagiert Unsicherheit durch das System', 'Monte Carlo braucht zwingend lognormale Verteilungen', 'Pedigree schätzt Unsicherheit ohne Messdaten; Monte Carlo propagiert sie', 'Variabilität zwischen Lieferanten ist Modellunsicherheit'], 2, 'Pedigree = Charakterisierung (Schätzung bei fehlenden Daten), Monte Carlo = stochastische Fortpflanzung ohne bestimmte Verteilungsform. Lieferanten-Unterschiede = Variabilität zwischen Objekten/Quellen.'),
      oral('Introduce the topic: what is life cycle assessment, and what is it good for?', ['Systematic method to quantify environmental impacts of a product/service over its whole life cycle (cradle to grave)', 'Standardized in ISO 14040/14044; four phases: goal & scope, LCI, LCIA, interpretation (iterative)', 'Uses: identify hotspots/improvement potentials, compare alternatives with the same function (FU), eco-design, strategic decisions, policy, communication (EPD)', 'Avoids burden shifting between life cycle stages, regions and impact categories', 'Limitations: data intensive, value choices (FU, allocation, weighting), uncertainty, not site-specific risk'], { who: 'P' }),
      oral('What is the difference between the AEA part (product view) and the IESG part (organisational view)?', ['Product view: one product life cycle across many companies; reference = functional unit; ISO 14040/44, ISO 14067', 'Organisational view: all activities of one organisation in a period (1 year); EMS ISO 14001, GHG balance ISO 14064-1 / GHG Protocol, company ecobalance (ISO/TS 14072)', 'They overlap only partially (intersection of a life cycle and a company)', 'Scope 3 is the "window to LCA": links company accounting with life cycle thinking'], { who: 'B' }),
    ],
  });
})();
