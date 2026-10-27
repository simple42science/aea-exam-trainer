/* ISO compass – standards and frameworks */
(function () {
  const A = window.AEA;
  const E = (o) => A.iso.push(o);

  E({ id: 'iso14040', code: 'ISO 14040', title: 'LCA – Principles and framework', cat: 'prod', level: 'Produkt', cert: false,
    what: 'Grundsätze und Rahmen der Ökobilanz: Begriffe, die vier Phasen (Goal & scope, LCI, LCIA, Interpretation), Anwendungen, Critical Review, Bericht.',
    points: ['Ausgabe 2006 (+ Amendment 2020)', 'Definiert funktionelle Einheit, Systemgrenze, Allokation, Elementarfluss …', 'Iterativer Charakter der LCA', 'Anwendungen ausserhalb des Rahmens: Produktentwicklung, Strategie, Politik, Marketing'],
    exam: 'Die vier Phasen nennen und zeichnen können (Grafik). „Described in ISO 14040/44.“', confuse: 'ISO 14001 (Managementsystem der Organisation) – nicht dasselbe!', rel: ['iso14044', 'iso14071', 'iso14067'], diagram: 'lca-framework' });
  E({ id: 'iso14044', code: 'ISO 14044', title: 'LCA – Requirements and guidelines', cat: 'prod', level: 'Produkt', cert: false,
    what: 'Anforderungen und Anleitungen für die Durchführung einer LCA: Datenqualität, Allokationshierarchie, LCIA-Elemente (Pflicht/optional), Interpretation, Critical Review, Bericht.',
    points: ['Allokation: 1 vermeiden (Unterteilung, Systemerweiterung) → 2 physikalische Beziehungen → 3 andere (ökonomisch)', 'LCIA Pflicht: Auswahl, Klassifizierung, Charakterisierung; optional: Normierung, Gruppierung, Gewichtung', '4.4.5: keine Gewichtung bei öffentlichen vergleichenden Aussagen', 'Critical Review Pflicht bei comparative assertions disclosed to the public (Panel)', 'Transparenz (5.1); vertrauliche Daten dürfen fehlen (5.2)'],
    exam: 'Allokations-Hierarchie wörtlich; Review-Pflicht; Gewichtungsverbot.', confuse: 'ISO 14040 = Prinzipien; ISO 14044 = Anforderungen.', rel: ['iso14040', 'iso14071'], diagram: 'alloc-tree' });
  E({ id: 'iso14071', code: 'ISO/TS 14071', title: 'Critical review processes and reviewer competencies', cat: 'prod', level: 'Produkt', cert: false,
    what: 'Technische Spezifikation, die den Critical-Review-Prozess nach ISO 14044 präzisiert: Ablauf, Rollen, Kompetenzen der Reviewer (2014, revidiert 2024).',
    points: ['Review durch internen oder externen Experten oder durch ein Panel interessierter Kreise', 'Panel: unabhängiger Vorsitz + Mitglieder (mind. 3)', 'Kompetenzen: ISO-Kenntnis, LCA-Methodik, Branchenwissen, Unabhängigkeit, Sprache'],
    exam: 'Ablauf und Kompetenzen der Reviewer erklären.', rel: ['iso14044'], diagram: 'critical-review' });
  E({ id: 'iso14067', code: 'ISO 14067', title: 'Carbon footprint of products', cat: 'prod', level: 'Produkt', cert: false,
    what: 'Anforderungen und Leitlinien zur Quantifizierung des CO₂-Fussabdrucks von Produkten (2018), basierend auf ISO 14040/44; nur Klimawandel.',
    points: ['Partieller oder vollständiger CFP (cradle-to-gate bzw. -grave)', 'Biogener Kohlenstoff separat ausweisen', 'Keine Kompensation im CFP', 'Verwandt: PAS 2050, GHG Protocol Product Standard'],
    exam: 'Unterschied Carbon Footprint vs. LCA; ISO 14067 vs. PAS 2050.', confuse: 'ISO 14064-1 = THG-Bilanz der Organisation.', rel: ['pas2050', 'iso14064', 'iso14040'] });
  E({ id: 'pas2050', code: 'PAS 2050', title: 'Specification for the GHG emissions of goods and services (UK)', cat: 'prod', level: 'Produkt', cert: false,
    what: 'Öffentlich verfügbare Spezifikation der BSI (UK, 2008, revidiert 2011) für den Carbon Footprint von Gütern und Dienstleistungen; Vorläufer von ISO 14067.',
    points: ['Bewertungszeitraum 100 Jahre', 'B2B (cradle-to-gate) und B2C (cradle-to-grave)', 'Ältere Version erlaubte die Gewichtung verzögerter Emissionen'], exam: 'In älteren Prüfungen: „Details zu PAS 2050 und ISO 14067“.', rel: ['iso14067'] });
  E({ id: 'iso14046', code: 'ISO 14046', title: 'Water footprint – principles, requirements, guidelines', cat: 'prod', level: 'Produkt & Organisation', cert: false,
    what: 'Wasserfussabdruck von Produkten, Prozessen und Organisationen nach LCA-Logik (2014): Wasserknappheit, Wasserverschmutzung (Eutrophierung, Toxizität …).',
    points: ['Bewertet Wasserverbrauch und Verschlechterung der Qualität', 'Regionalisierung zwingend (z. B. AWARE-Faktoren)', 'Water scarcity footprint vs. umfassender Water footprint'], exam: 'Bei Baumwolle, Reis, Lithium: Wasserknappheit regionalisiert bewerten.', rel: ['iso14040'] });
  E({ id: 'iso14072', code: 'ISO/TS 14072', title: 'Organizational LCA (O-LCA)', cat: 'org', level: 'Organisation', cert: false,
    what: 'Technische Spezifikation (2014), wie man ISO 14040/44 auf ganze Organisationen anwendet: Lebenszyklus-Bilanz aller Produkte bzw. Aktivitäten einer Firma (Basis der Betriebsökobilanz).',
    points: ['Bezug: Organisation × Berichtsperiode statt FU', 'Direkte und indirekte (vor- und nachgelagerte) Aktivitäten', 'Analog zur Scope-Logik, aber multikriteriell'], exam: 'Braunschweigs Grafik: „Company ecobalance (ISO 14072)“.', rel: ['iso14064', 'iso14031', 'iso14001'], diagram: 'product-company' });
  E({ id: 'iso14064', code: 'ISO 14064-1/-2/-3', title: 'GHG inventories (organisations), projects, verification', cat: 'org', level: 'Organisation', cert: true,
    what: 'Teil 1: THG-Inventar von Organisationen (direkte und indirekte Emissionen, Scope-Logik); Teil 2: THG-Projekte (Reduktionen/Entnahmen); Teil 3: Verifizierung und Validierung.',
    points: ['Kompatibel mit dem GHG Protocol', '2018: Kategorien statt Scopes (direkt, importierte Energie, Transport, eingekaufte Produkte, Nutzung der Produkte, andere)', 'Verifizierung durch Dritte möglich (Teil 3)'],
    exam: 'Beechtex „klimaneutral“: Firma nach ISO 14064 mit Scope 1–3 bilanzieren.', confuse: 'ISO 14067 = Produkt-Fussabdruck.', rel: ['ghgp', 'iso14068', 'sbti'], diagram: 'scopes' });
  E({ id: 'ghgp', code: 'GHG Protocol', title: 'Corporate, Scope 2, Scope 3 & Product Standards (WRI/WBCSD)', cat: 'org', level: 'Organisation', cert: false,
    what: 'Weltweit meistgenutzter Bilanzierungsstandard für Treibhausgase (WRI/WBCSD): Corporate Standard (2004), Scope 2 Guidance (2015), Scope 3 Standard (2011, 15 Kategorien), Product Standard.',
    points: ['Scope 1 direkt, Scope 2 eingekaufte Energie (location- und market-based), Scope 3 übrige Wertschöpfungskette', 'Prinzipien: Relevanz, Vollständigkeit, Konsistenz, Transparenz, Genauigkeit', 'Organisationsgrenze: Equity share oder Control'],
    exam: 'Scopes erklären und Beispiele zuordnen; „Scope 3 = window to LCA“.', rel: ['iso14064', 'sbti', 'cdp'], diagram: 'scopes' });
  E({ id: 'iso14068', code: 'ISO 14068-1', title: 'Carbon neutrality', cat: 'org', level: 'Organisation & Produkt', cert: false,
    what: 'Norm (2023) für Klimaneutralität von Organisationen und Produkten: THG-Bilanz, Reduktionsplan zuerst, Kompensation nur für Restemissionen mit Qualitätskriterien, Verifizierung und Kommunikation.',
    points: ['Ersetzt PAS 2060', 'Reduktion vor Kompensation', 'Anforderungen an Zertifikate (Zusätzlichkeit, Dauerhaftigkeit, keine Doppelzählung)'], exam: 'Kritische Prüfung einer „climate neutral“-Aussage.', rel: ['iso14064', 'sbti'] });
  E({ id: 'iso14001', code: 'ISO 14001', title: 'Environmental management systems – requirements', cat: 'org', level: 'Organisation', cert: true,
    what: 'Weltweit wichtigste Norm für Umweltmanagementsysteme (seit 1996, Revision 2015): PDCA mit Kontext, Führung, Politik, Planung (bedeutende Aspekte, Ziele), Betrieb, Leistungsbewertung, Verbesserung.',
    points: ['Bedeutende Umweltaspekte bestimmen (kontrollierbar und beeinflussbar, Lebenszyklus-Perspektive)', 'Bindende Verpflichtungen einhalten', 'Kein vorgeschriebenes Leistungsniveau, nur fortlaufende Verbesserung', 'Zertifizierung durch akkreditierte Dritte (jährliche Überwachungsaudits)'],
    exam: 'Elemente und Zyklus erklären; was ISO 14001 über einen Lieferanten aussagt (System, nicht Leistung).', confuse: 'Produktlabel (MSC, Typ I) und LCA-Normen (ISO 14040).', rel: ['iso14004', 'emas', 'iso50001', 'iso9001'], diagram: 'iso14001-cycle' });
  E({ id: 'iso14004', code: 'ISO 14004', title: 'EMS – general guidelines on implementation', cat: 'org', level: 'Organisation', cert: false,
    what: 'Leitfaden zur Einführung und Verbesserung eines Umweltmanagementsystems nach ISO 14001 (nicht zertifizierbar).', points: ['Praktische Hinweise zu jedem Element von ISO 14001'], rel: ['iso14001'] });
  E({ id: 'emas', code: 'EMAS', title: 'EU Eco-Management and Audit Scheme', cat: 'org', level: 'Organisation', cert: true,
    what: 'EU-Umweltmanagement (seit 1993/1995; Verordnung 1221/2009): enthält ISO 14001 und verlangt zusätzlich eine öffentliche, validierte Umwelterklärung, Leistungsverbesserung, Rechtskonformität und Einbezug der Mitarbeitenden.',
    points: ['Registrierung nach Validierung durch Umweltgutachter', 'Kernindikatoren (Energie, Material, Wasser, Abfall, Biodiversität, Emissionen)'], exam: 'Unterschied zu ISO 14001: Öffentlichkeit und Leistung.', rel: ['iso14001'] });
  E({ id: 'iso14031', code: 'ISO 14031', title: 'Environmental performance evaluation', cat: 'org', level: 'Organisation', cert: false,
    what: 'Leitfaden zur Bewertung der Umweltleistung mit Kennzahlen: Management-Leistungsindikatoren (MPI), operative Leistungsindikatoren (OPI) und Umweltzustandsindikatoren (ECI).',
    points: ['Grundlage für Eco-Controlling und Benchmarking'], exam: 'Braunschweigs Grafik: „Environmental Performance Evaluation (ISO 14031)“ umfasst Produkt- und Firmensicht.', rel: ['iso14001', 'iso14072'] });
  E({ id: 'iso50001', code: 'ISO 50001', title: 'Energy management systems', cat: 'org', level: 'Organisation', cert: true,
    what: 'Zertifizierbares Energiemanagementsystem (PDCA): energetische Bewertung, Energieleistungskennzahlen (EnPI), Baseline, Ziele, kontinuierliche Verbesserung der Energieeffizienz.', points: ['Gleiche High-Level-Struktur wie ISO 14001', 'Relevant für energieintensive Firmen (z. B. 3 GWh Kühlen/Räuchern)'], rel: ['iso14001'] });
  E({ id: 'iso9001', code: 'ISO 9001', title: 'Quality management systems', cat: 'org', level: 'Organisation', cert: true,
    what: 'Qualitätsmanagement über Prozesse (Prozessansatz, PDCA, Kundenorientierung): Planung → Umsetzung → Bewertung → Verbesserung; Management-, Geschäfts- und Supportprozesse.',
    points: ['Prozessbeschreibung: Input – Aktivitäten – Output, Verantwortung, Messgrössen, Dokumente', 'Basis für integrierte Managementsysteme'], exam: '„What is a process and what elements are necessary to describe it?“', rel: ['iso14001', 'efqm'] });
  E({ id: 'iso45001', code: 'ISO 45001', title: 'Occupational health & safety management', cat: 'soc', level: 'Organisation', cert: true,
    what: 'Zertifizierbares Managementsystem für Arbeitssicherheit und Gesundheitsschutz (2018), gleiche Struktur wie ISO 14001.', points: ['Gefährdungsbeurteilung, Ziele, Beteiligung der Mitarbeitenden'], rel: ['iso14001', 'sa8000'] });
  E({ id: 'sa8000', code: 'SA8000', title: 'Social Accountability standard (SAI)', cat: 'soc', level: 'Organisation', cert: true,
    what: 'Zertifizierbarer Sozialstandard auf Basis der ILO-Konventionen und UN-Menschenrechte: keine Kinder- und Zwangsarbeit, Vereinigungsfreiheit, Nichtdiskriminierung, Gesundheit & Sicherheit, Arbeitszeiten, Entlöhnung, Managementsystem.',
    points: ['Zertifizierte Firmen verlangen SA8000 auch von ihren Lieferanten → pflanzt sich fort', 'Branchen: Textil, Bau, Leder & Schuhe, Reinigung', '2015: ca. 3 500 Organisationen, 1.9 Mio. Beschäftigte'],
    exam: 'Lachs mit Lieferanten in Chile, Lithium-Mining: Warum SA8000 und was es verlangt.', confuse: 'ISO 26000 ist nicht zertifizierbar.', rel: ['iso26000', 'bsci', 'iso45001'] });
  E({ id: 'iso26000', code: 'ISO 26000', title: 'Guidance on social responsibility', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Leitfaden (2010, nicht zertifizierbar) zur gesellschaftlichen Verantwortung mit Fokus auf transparenten Stakeholder-Dialog; 7 Kernthemen: Organisationsführung, Menschenrechte, Arbeitspraktiken, Umwelt, faire Betriebspraktiken, Konsumentenanliegen, Gemeinschaft.',
    points: ['Kann interne Prozesse leiten, aber keine normative Vertragsbasis'], confuse: 'SA8000 (zertifizierbar).', rel: ['sa8000', 'iso20400'] });
  E({ id: 'iso20400', code: 'ISO 20400', title: 'Sustainable procurement – guidance', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Leitfaden (2017, nicht zertifizierbar) zur Integration von Nachhaltigkeit in die Beschaffung: Prinzipien, Strategie, Organisation inkl. Wissen der Mitarbeitenden, Beschaffungsprozess.', points: ['Ergänzt ISO 26000 für den Einkauf'], rel: ['iso26000'] });
  E({ id: 'bsci', code: 'amfori BSCI', title: 'Business Social Compliance Initiative', cat: 'soc', level: 'Lieferkette', cert: false,
    what: 'Brancheninitiative mit Verhaltenskodex und Auditsystem für soziale Standards in Lieferketten (v. a. Handel, Textil); gemeinsame Audits für viele Kunden.', points: ['Basis: ILO-Normen', 'Audits und Verbesserungspläne bei Lieferanten'], rel: ['sa8000'] });
  E({ id: 'iso14020', code: 'ISO 14020', title: 'Environmental statements and programmes – principles', cat: 'com', level: 'Produkt', cert: false,
    what: 'Grundprinzipien für Umweltkennzeichnungen und -deklarationen: genau, überprüfbar, relevant, nicht irreführend.', rel: ['iso14021', 'iso14024', 'iso14025'], diagram: 'labels' });
  E({ id: 'iso14021', code: 'ISO 14021', title: 'Type II – self-declared environmental claims', cat: 'com', level: 'Produkt', cert: false,
    what: 'Umweltbezogene Selbstdeklarationen der Hersteller ohne Drittprüfung (z. B. „rezyklierbar“, „30 % Rezyklat“); müssen überprüfbar und nicht irreführend sein.', confuse: 'Typ I = Label einer unabhängigen Stelle.', rel: ['iso14020'], diagram: 'labels' });
  E({ id: 'iso14024', code: 'ISO 14024', title: 'Type I – environmental labelling (ecolabels)', cat: 'com', level: 'Produkt', cert: true,
    what: 'Freiwillige, multikriterielle Umweltzeichen einer unabhängigen Stelle auf Basis des Lebenszyklus (Bestehen/Nichtbestehen → Logo), z. B. Blauer Engel, EU Ecolabel, Nordic Swan.', rel: ['iso14020'], diagram: 'labels' });
  E({ id: 'iso14025', code: 'ISO 14025', title: 'Type III – environmental declarations (EPD)', cat: 'com', level: 'Produkt', cert: true,
    what: 'Quantitative Umweltproduktdeklarationen (EPD) auf LCA-Basis nach Product Category Rules (PCR), von Dritten verifiziert und über einen Programmbetreiber publiziert; keine Wertung.',
    points: ['PCR legen Methodik, Bericht und Verifizierung fest', 'Bauprodukte: EN 15804'], exam: 'Recycling-Allokation in EPDs (Modul D).', rel: ['en15804', 'iso14040'], diagram: 'labels' });
  E({ id: 'en15804', code: 'EN 15804', title: 'EPD core rules for construction products', cat: 'com', level: 'Produkt', cert: false,
    what: 'Europäische Norm für EPDs von Bauprodukten mit Modulen A1–A3 (Herstellung), A4–A5 (Bau), B1–B7 (Nutzung), C1–C4 (Entsorgung) und D (Gutschriften und Lasten ausserhalb der Systemgrenze, Netto-Sekundärfluss, separat).', points: ['A2:2019 mit EF-Wirkungskategorien'], exam: 'Recycling: Modul D = (R2 − R1)(E_rec,EoL − E*_V).', rel: ['iso14025'], diagram: 'recycling' });
  E({ id: 'pef', code: 'PEF / OEF', title: 'EU Product & Organisation Environmental Footprint', cat: 'prod', level: 'Produkt & Organisation', cert: false,
    what: 'EU-Methode (Empfehlung 2013, aktualisiert 2021): 16 Wirkungskategorien (EF 3.1), produktgruppenspezifische Regeln (PEFCR), Circular Footprint Formula für Recycling, Normierung und Gewichtung zu einem Single Score erlaubt.',
    points: ['Recycling: Aufteilung zwischen Primärproduktion und Recycling (A-Faktor 0.2–0.8; 2013: 50:50)', '100 % Gutschrift für rückgewonnene Energie'], exam: 'Einer der 4 Recycling-Ansätze (Frischknecht).', confuse: 'ISO verbietet Gewichtung bei öffentlichen Vergleichen, PEF erlaubt einen Single Score.', rel: ['iso14044', 'en15804'] });
  E({ id: 'iso14008', code: 'ISO 14008', title: 'Monetary valuation of environmental impacts', cat: 'org', level: 'Organisation & Produkt', cert: false,
    what: 'Norm (2019) zur monetären Bewertung von Umweltwirkungen und -aspekten (z. B. Schadenskosten, Zahlungsbereitschaft), Basis für externe Kosten und Environmental LCC.', rel: ['iso15686'] });
  E({ id: 'iso15686', code: 'ISO 15686-5', title: 'Buildings – service life planning: life-cycle costing', cat: 'org', level: 'Produkt (Gebäude)', cert: false,
    what: 'Norm zur Lebenszykluskostenrechnung von Gebäuden und Bauwerken: Kostenkategorien, Diskontierung, Betrachtungszeitraum.', rel: ['iso14008'] });
  E({ id: 'efqm', code: 'EFQM Model', title: 'Excellence / TQM model', cat: 'org', level: 'Organisation', cert: false,
    what: 'Modell der European Foundation for Quality Management für Total Quality Management: Enablers (Führung, Strategie, Mitarbeitende, Partnerschaften & Ressourcen, Prozesse) → Results (Mitarbeitende, Kunden, Gesellschaft, Schlüsselergebnisse).', confuse: 'Keine ISO-Norm, kein Zertifikat im engeren Sinn (Anerkennungsstufen).', rel: ['iso9001'], diagram: 'ssc-efqm' });
  E({ id: 'gri', code: 'GRI Standards', title: 'Global Reporting Initiative – sustainability reporting', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Weltweit meistgenutzter Standard für Nachhaltigkeitsberichte: universelle Standards (GRI 1–3), Branchen- und Themenstandards (ökonomisch, ökologisch, sozial); Impact-Wesentlichkeit.',
    points: ['Indikatoren z. B. Energie nach Träger, Wasser nach Quelle, THG Scopes 1–3, Unfallraten, Weiterbildung, Kinderarbeit-Risiken, Korruption'], exam: '„Explain the GRI standard.“', rel: ['ungc', 'csrd', 'sasb'] });
  E({ id: 'ungc', code: 'UN Global Compact', title: '10 principles for responsible business', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Freiwillige UN-Plattform (gegründet unter Kofi Annan): CEO unterzeichnet 10 Prinzipien zu Menschenrechten (1–2), Arbeitsnormen (3–6), Umwelt (7–9) und Korruption (10); jährliche Communication on Progress.', points: ['ca. 9 000 Firmen, 12 000 Organisationen', 'Prinzip 7: Vorsorgeprinzip'], confuse: 'GRI ist ein Reporting-Standard.', rel: ['gri', 'sbti'] });
  E({ id: 'sasb', code: 'SASB Standards', title: 'Industry-specific ESG disclosure for investors (US)', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Branchenspezifische Standards (77 Branchen) für finanziell wesentliche Nachhaltigkeitsthemen, für Investoren und SEC-Anforderungen; heute bei der IFRS Foundation (ISSB).', rel: ['gri', 'csrd'] });
  E({ id: 'csrd', code: 'EU CSRD / ESRS', title: 'Corporate Sustainability Reporting Directive', cat: 'soc', level: 'Organisation', cert: false,
    what: 'EU-Richtlinie (2022): Pflicht zur Nachhaltigkeitsberichterstattung nach den European Sustainability Reporting Standards mit doppelter Wesentlichkeit und externer Prüfung; gestaffelt ab Geschäftsjahr 2024; 2025 durch das Omnibus-Paket vereinfacht und verschoben.', points: ['Gilt auch für Nicht-EU-Firmen mit grossem EU-Geschäft', 'Verknüpft mit EU-Taxonomie'], exam: 'Doppelte Wesentlichkeit erklären.', rel: ['taxonomy', 'gri'], diagram: 'double-materiality' });
  E({ id: 'taxonomy', code: 'EU Taxonomy', title: 'Classification of sustainable economic activities', cat: 'soc', level: 'Organisation / Finanz', cert: false,
    what: 'EU-Verordnung (2020): Klassifikation ökologisch nachhaltiger Wirtschaftstätigkeiten für 6 Umweltziele: wesentlicher Beitrag, keine erhebliche Beeinträchtigung (DNSH), soziale Mindeststandards. Gegen Greenwashing bei Investitionen.', rel: ['csrd'] });
  E({ id: 'sbti', code: 'SBTi', title: 'Science Based Targets initiative', cat: 'org', level: 'Organisation', cert: false,
    what: 'Initiative von CDP, UN Global Compact, WRI und WWF: Validierung von THG-Zielen im Einklang mit 1.5 °C (Scope 1+2, relevante Teile von Scope 3), Near-term (5–10 Jahre) und Net-Zero-Standard (≈ 90 % Reduktion, Rest mit dauerhaften Entnahmen).', points: ['Freiwillig; ca. 10 000 Firmen mit Zielen (Kurs)', 'Kompensation zählt nicht als Reduktion'], exam: '„Science based targets“ ist ein Exam topic.', rel: ['ghgp', 'cdp'] });
  E({ id: 'cdp', code: 'CDP', title: 'Carbon Disclosure Project', cat: 'soc', level: 'Organisation', cert: false,
    what: 'Gemeinnützige Plattform, über die Firmen und Städte Umweltdaten (Klima, Wasser, Wälder) an Investoren und Kunden offenlegen; Bewertung A bis D−.', rel: ['sbti', 'ghgp'] });
})();
