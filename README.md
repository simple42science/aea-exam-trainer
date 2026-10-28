# 🌿 AEA Coach – exam trainer for product & company LCA

A learning web app (PWA) for the **combined oral exam** at ETH Zurich:
**Advanced Environmental Assessments** (Prof. Stephan Pfister, *product LCA*) and
**Implementation of Environmental and other Sustainability Goals** (Dr. Arthur Braunschweig, *company LCA*).

Exam format: 30 min preparing a case study alone → 30 min oral exam with both examiners.
Pfister asks first (question 1 is always the **functional unit**), then Braunschweig.

No sign-up, no server, no database. Your progress stays **locally on your device**
(browser storage). After the first visit the app also works **offline**.

👉 **App:** https://simple42science.github.io/aea-exam-trainer/

## What's inside

- **🗓️ Daily plan (study guide)**: small (3–10 min) and bigger tasks (15–60 min) every day, adapted to the time left until the exam:
  - *Phase 1 · Foundation* (until 7 weeks before): one chapter per day, quiz, oral questions; **Wednesday = mock exam**
  - *Phase 2 · Application*: weak spots, mixed Pfister/Braunschweig questions, two mock exams per week, walk & talk
  - *Phase 3 · Simulation* (last 2 weeks): a mock exam every day, follow-up question drill, ISO flash round
- **📚 20 chapters** (10 Pfister, 9 Braunschweig, exam strategy) with explanations, exam phrases,
  typical traps and the exam questions from the protocols.
- **🖼️ 36 interactive diagrams** (tap for explanations): ISO 14040 framework, product vs. organisational view, Scopes 1–3,
  cause–effect chain, climate chain, allocation hierarchy, cut-off vs. avoided burden (+ EN 15804/PEF), matrix LCA,
  IO table, types of uncertainty, distributions, Monte Carlo, sensitivity, ALCA vs. CLCA, PDCA, ISO 14001 cycle,
  EFQM, eco-factor (UBP), LCC levels, critical review, double materiality, stakeholders, MCDA, Pareto, regionalization …
- **🧮 14 calculators**: matrix LCA, allocation, recycling approaches (aluminium cans), pedigree → GSD², Monte Carlo (dependent vs. independent),
  eco-factor, LCC of the compressors, water scarcity (AWARE), GWP time horizon, MCDA, Leontief, scope calculator, box model, growth.
- **🎯 Practice** with spaced repetition: FU drill, flashcards, quizzes, calculations with worked solutions, matching, ordering,
  sorting and **oral questions** with keyword check and typical follow-up questions. In single- and multiple-choice
  questions the correct answer is not given away by its length.
- **📝 13 case studies** in exam format (banknotes, window frames, salmon, PV, lithium, bread, recycled concrete, lyocell,
  industrial wastewater, T-shirts, coffee, hotel, compressors) with a 30-min timer, notes field and oral simulation.
- **🎧 Walk & talk**: the app reads questions aloud, waits while you answer out loud, then reads the keywords.
- **📜 ISO compass**: more than 35 norms and standards (ISO 14040/44, 14001, 14064, 14067, 14025, SA8000, GRI, CSRD, SBTi …)
  with key content, exam hook and common confusions.
- **📊 Progress**: mastery per chapter, streak, activity, exam date, light/dark mode, backup.

## Install on an iPhone

1. Open the app URL in **Safari**.
2. **Share** → **"Add to Home Screen"**.
3. Done: it starts full screen like a native app, also offline.

## Backup

Under **Progress → Backup** you can export or import your progress as JSON
(e.g. before clearing website data or when switching devices).

## Try it locally

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Editing the content

Everything is plain HTML/CSS/JavaScript without a build step:

| File | Content |
|---|---|
| `data/p*_*.js` | Product LCA chapters (Pfister): learning page (`learn`) and tasks (`q`) |
| `data/c*_*.js` | Company LCA chapters (Braunschweig) |
| `data/p0_strategy.js` | Exam strategy |
| `data/cases.js` | Case studies |
| `data/iso.js` | ISO compass |
| `js/diagrams.js` | Diagrams (SVG) |
| `js/calc.js` | Calculators |
| `js/games.js`, `js/app.js` | Practice engines, daily plan, navigation |

Task types in the data files: `card`, `mc`, `tf`, `ord`, `match`, `sort`, `calc`, `oral`, `fu` (see `js/core.js`).
After changes, increase the cache version (`CACHE`) in `sw.js` so that phones load the new version.

## Note

Private study aid, not official ETH material. The exam questions are paraphrased from students' memory protocols;
numbers in the case studies are partly fictive practice values. Explanations and model answers are my own work based on
the lectures. Where they differ, the official course material applies.

---

*Built with [Claude Code](https://claude.com/claude-code).*
