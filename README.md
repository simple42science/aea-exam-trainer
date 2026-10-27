# 🌿 AEA Coach – Prüfungstrainer Product & Company LCA

Eine Lern-Web-App (PWA) für die **kombinierte mündliche Prüfung** an der ETH:
**Advanced Environmental Assessments** (Prof. Stephan Pfister, *Product LCA*) und
**Implementation of Environmental and other Sustainability Goals** (Dr. Arthur Braunschweig, *Company LCA*).

Format der Prüfung: 30 min Fallstudie allein vorbereiten → 30 min mündlich zu dritt.
Zuerst Pfister (Frage 1 ist immer die **funktionelle Einheit**), dann Braunschweig.

Keine Anmeldung, kein Server, keine Datenbank. Der Lernfortschritt bleibt **lokal auf dem Gerät**
(Browser-Speicher). Nach dem ersten Laden funktioniert die App auch **offline**.

👉 **App:** https://simple42science.github.io/aea-exam-trainer/

## Was drin ist

- **🗓️ Tagesplan (Leitfaden)**: jeden Tag kleine (3–10 min) und grosse Aufgaben (15–60 min), abgestimmt auf die Zeit bis zur Prüfung:
  - *Phase 1 · Fundament* (bis 7 Wochen vorher): ein Kapitel pro Tag, Quiz, mündliche Fragen; **Mittwoch = Probeprüfung**
  - *Phase 2 · Anwenden*: Schwachstellen, gemischte Pfister/Braunschweig-Fragen, zwei Probeprüfungen pro Woche, Walk & Talk
  - *Phase 3 · Simulation* (letzte 2 Wochen): täglich Probeprüfung, Nachfragen-Drill, ISO-Blitz
- **📚 20 Kapitel** (10 Pfister, 9 Braunschweig, Prüfungsstrategie) mit Erklärungen auf Deutsch und Prüfungsformulierungen auf Englisch,
  typischen Fallen und den Prüfungsfragen aus den Protokollen.
- **🖼️ 36 interaktive Grafiken** (antippen für Erklärungen): ISO-14040-Rahmen, Produkt- vs. Organisationssicht, Scopes 1–3,
  Ursache-Wirkungs-Kette, Klimakette, Allokations-Hierarchie, Cut-off vs. Avoided burden (+ EN 15804/PEF), Matrix-LCA,
  IO-Tabelle, Unsicherheitstypen, Verteilungen, Monte Carlo, Sensitivität, ALCA vs. CLCA, PDCA, ISO-14001-Zyklus,
  EFQM, Ökofaktor (UBP), LCC-Stufen, Critical Review, doppelte Wesentlichkeit, Stakeholder, MCDA, Pareto, Regionalisierung …
- **🧮 14 Rechner**: Matrix-LCA, Allokation, Recycling-Ansätze (Alu-Dosen), Pedigree → GSD², Monte Carlo (abhängig vs. unabhängig),
  Ökofaktor, LCC der Kompressoren, Wasserknappheit (AWARE), GWP-Zeithorizont, MCDA, Leontief, Scope-Rechner, Box-Modell, Wachstum.
- **🎯 Üben** mit Spaced Repetition: FU-Drill, Karteikarten, Quiz, Rechenaufgaben mit Lösungsweg, Zuordnen, Reihenfolge,
  Einsortieren und **mündliche Fragen** mit Stichwort-Check und typischen Nachfragen.
- **📝 13 Fallstudien** im Prüfungsformat (Banknoten, Fensterrahmen, Lachs, PV, Lithium, Brot, Recyclingbeton, Lyocell,
  Industrieabwasser, T-Shirts, Kaffee, Hotel, Kompressoren) mit 30-min-Timer, Notizfeld und mündlicher Simulation.
- **🎧 Walk & Talk**: Die App liest Fragen auf Englisch vor, wartet, während du laut antwortest, und liest dann die Stichworte.
- **📜 ISO-Kompass**: über 35 Normen und Standards (ISO 14040/44, 14001, 14064, 14067, 14025, SA8000, GRI, CSRD, SBTi …)
  mit Kerninhalten, Prüfungs-Hook und Verwechslungsgefahr.
- **📊 Fortschritt**: Beherrschung pro Kapitel, Streak, Aktivität, Prüfungsdatum, Hell/Dunkel, Backup.

## Auf dem iPhone installieren

1. Die App-URL in **Safari** öffnen.
2. **Teilen** → **„Zum Home-Bildschirm“**.
3. Fertig: startet im Vollbild wie eine native App, auch offline.

## Backup

Unter **Fortschritt → Backup** den Fortschritt als JSON exportieren bzw. importieren
(z. B. vor dem Löschen der Websitedaten oder beim Gerätewechsel).

## Lokal ausprobieren

```bash
python -m http.server 8080
# dann http://localhost:8080 öffnen
```

## Inhalte ändern

Alles ist reines HTML/CSS/JavaScript ohne Build-Schritt:

| Datei | Inhalt |
|---|---|
| `data/p*_*.js` | Kapitel Product LCA (Pfister): Lernseite (`learn`) und Aufgaben (`q`) |
| `data/c*_*.js` | Kapitel Company LCA (Braunschweig) |
| `data/p0_strategy.js` | Prüfungsstrategie |
| `data/cases.js` | Fallstudien |
| `data/iso.js` | ISO-Kompass |
| `js/diagrams.js` | Grafiken (SVG) |
| `js/calc.js` | Rechner |
| `js/games.js`, `js/app.js` | Übungs-Engines, Tagesplan, Navigation |

Aufgabentypen in den Datendateien: `card`, `mc`, `tf`, `ord`, `match`, `sort`, `calc`, `oral`, `fu` (siehe `js/core.js`).
Nach Änderungen in `sw.js` die Cache-Version (`CACHE`) erhöhen, damit Handys die neue Version laden.

## Hinweis

Private Lernhilfe, nicht offiziell von der ETH. Die Prüfungsfragen sind aus studentischen Gedächtnisprotokollen paraphrasiert;
Zahlen in Fallstudien sind teils fiktive Übungswerte. Erklärungen und Musterantworten sind eigene Ausarbeitungen auf Basis
der Vorlesungen. Bei Abweichungen gilt das offizielle Kursmaterial.

---

*Erstellt mit [Claude Code](https://claude.com/claude-code).*
