---
slug: kairos-technical-overview
pageTitle: "KAIROS : Vue d'ensemble technique — Florent Klimacek"
headline: "KAIROS : Vue d'ensemble technique"
description: "Architecture, jauge Oxygène, friction cognitive, triangle PQC. Comment le cadre théorique devient un logiciel de cartographie cognitive assistée par IA."
ogTitle: "KAIROS : Vue d'ensemble technique"
ogDescription: "Architecture, jauge Oxygène, friction cognitive, triangle PQC. Comment le cadre théorique devient un logiciel de cartographie cognitive assistée par IA."
ogUrl: "/kairos-technical-overview.html"
canonical: "/kairos-technical-overview.html"
datePublished: "2026-03-21"
dateModified: "2026-03-21"
keywords:
  - KAIROS
  - architecture technique
  - jauge Oxygène
  - friction cognitive
  - triangle PQC
  - cartographie cognitive
  - souveraineté cognitive
  - interactions humain-IA
  - Electron
  - TypeScript
permalink: "/kairos-technical-overview.html"
navLabel: "Architecture"
navDescription: "Comment le cadre PQC devient un logiciel"
heroLabel: "Architecture"
heroH1: "<span class=\"glitch-text\">KAIROS</span><br><span>Vue d'ensemble technique</span>"
heroIntro: "51 000 lignes TypeScript, 725 tests, 8 fournisseurs LLM. Comment le cadre de la Physique Quantique Conversationnelle devient un logiciel de cartographie cognitive — architecture, jauge Oxygène, friction, souveraineté."
headerTitle: "KAIROS — Vue d'ensemble technique"
heroImage: "/images/kairos-canvas.png"
heroImageAlt: "Capture d'écran KAIROS — canvas de cartographie cognitive avec jauge Oxygène"
breadcrumbName: "KAIROS — Vue d'ensemble technique"
sections:
  - id: abstract
    title: "Abstract"
  - id: probleme
    title: "Problème : la linéarisation"
  - id: architecture
    title: "Architecture"
  - id: oxygene
    title: "Système Oxygène"
  - id: friction
    title: "Mécanismes de friction"
  - id: etat-actuel
    title: "État actuel"
  - id: fondements
    title: "Fondements théoriques"
  - id: travaux-futurs
    title: "Travaux futurs"
  - id: references
    title: "Références"
card:
  label: "Architecture"
  title: "KAIROS — Vue d'ensemble technique"
  desc: "Architecture, jauge Oxygène, friction cognitive, triangle PQC. Le pont entre la théorie et le code."
  readingTime: "20 min"
  linkText: "Lire le document"
  featured: false
feedCategory: "Architecture"
feedTime: "10:00:00"
sitemapPriority: "0.8"
sitemapChangefreq: "monthly"
doi: "https://doi.org/10.5281/zenodo.19159722"
order: 0
---

<!-- ==================== ABSTRACT ==================== -->
<section id="abstract">
  <div class="section-number">Section 01</div>
  <h2>Abstract</h2>

  <p class="lead">
    KAIROS est une application de bureau (Electron) qui transforme l'exploration d'idées en cartographie spatiale non-linéaire, assistée par intelligence artificielle. Contrairement aux interfaces conversationnelles linéaires (chat), KAIROS représente les concepts comme des <strong>vignettes</strong> positionnées sur un canvas 2D, reliées par des connexions typées (implication, co-conditionnement, conflit, exemple).
  </p>

  <p>
    Le système intègre une <strong>jauge d'oxygène cognitive</strong> (O₂) mesurant en temps réel la vitalité d'un graphe d'idées selon 8 signaux structurels, 4 grandeurs topologiques et 3 axes dynamiques (divergence, cohérence, souveraineté). Un mécanisme de <strong>friction</strong> détecte automatiquement les circularités cognitives (reformulations, cycles, stagnation) et injecte des perturbations dans les prompts LLM pour forcer l'exploration hors des attracteurs locaux.
  </p>

  <p>
    L'application opérationnalise le cadre théorique de la <a href="/physique-quantique-conversationnelle.html">Physique Quantique Conversationnelle</a> (PQC), reliant les métriques logicielles aux quatre variables conversationnelles (alignement, friction, intention, linéarisation). Le code source comprend ~51 000 lignes TypeScript, 725 tests unitaires, et supporte 8 fournisseurs LLM incluant des modèles locaux (Ollama).
  </p>

  <div class="key-insight">
    <strong>Mots-clés</strong> — cartographie cognitive, interaction humain-IA, friction conversationnelle, métriques topologiques, linéarisation, souveraineté cognitive
  </div>
</section>

<!-- ==================== PROBLÈME ==================== -->
<section id="probleme">
  <div class="section-number">Section 02</div>
  <h2>Problème : la linéarisation mutuelle</h2>

  <h3>L'interface chat comme réducteur cognitif</h3>

  <p class="lead">
    L'interface conversationnelle séquentielle (chat) impose une <strong>linéarisation</strong> structurelle à la pensée exploratoire. Chaque tour de parole écrase la simultanéité des idées en une séquence ordonnée, créant trois effets documentés empiriquement.
  </p>

  <p>
    <strong>Appauvrissement cognitif</strong> — Klein &amp; Klein (2025) montrent que l'interaction prolongée avec l'IA érode les connaissances fondationnelles, l'utilisateur déléguant progressivement les opérations de structuration.
  </p>

  <p>
    <strong>Amplification des biais</strong> — Glickman &amp; Sharot (2024) mesurent une augmentation de 15 à 25% des biais perceptuels, émotionnels et sociaux dans les boucles de rétroaction humain-IA.
  </p>

  <p>
    <strong>Dette cognitive</strong> — Kosmyna et al. (2025, MIT Media Lab) observent une réduction de 55% de l'activité cérébrale lors de la rédaction assistée par ChatGPT, suggérant un désengagement cognitif structurel.
  </p>

  <h3>L'accordage passif</h3>

  <p>
    Au-delà de la linéarisation, les interfaces conversationnelles produisent un <strong>accordage passif</strong> : l'utilisateur s'aligne progressivement sur le registre, le rythme et les catégories de l'IA, perdant la capacité de maintenir une direction propre. Ce phénomène correspond à la variable <em>alignement</em> du cadre PQC (Klimacek, 2026), qui distingue l'alignement productif (convergence vers un objet commun) de l'alignement passif (adoption non-critique du cadre proposé).
  </p>

  <h3>Hypothèse de KAIROS</h3>

  <p>
    La spatialisation non-linéaire des idées, combinée à des mécanismes de friction automatisés et à une mesure continue de la souveraineté cognitive, peut <strong>maintenir l'engagement actif</strong> de l'utilisateur dans l'exploration assistée par IA. Le score O₂ rend visible ce qui est habituellement invisible : la qualité structurelle de la pensée en cours.
  </p>
</section>

<!-- ==================== ARCHITECTURE ==================== -->
<section id="architecture">
  <div class="section-number">Section 03</div>
  <h2>Architecture</h2>

  <h3>Stack technique</h3>

  <table>
    <thead>
      <tr><th>Composant</th><th>Technologie</th><th>Détail</th></tr>
    </thead>
    <tbody>
      <tr><td>Runtime</td><td>Electron 28+</td><td>Multi-process (main + renderer)</td></tr>
      <tr><td>Langage</td><td>TypeScript (ES modules)</td><td>~51 000 lignes, aucun framework</td></tr>
      <tr><td>Bundler</td><td>Vite 7.3</td><td>Multi-page, esbuild (pas de tsc emit)</td></tr>
      <tr><td>Base de données</td><td>SQLite (better-sqlite3)</td><td>WAL mode, 15 tables, IPC bridge</td></tr>
      <tr><td>Stockage clés</td><td>electron-store + safeStorage</td><td>Chiffrement natif OS</td></tr>
      <tr><td>Visualisation</td><td>Canvas 2D + SVG</td><td>Géométrie sacrée, radar, sparklines</td></tr>
      <tr><td>Page d'accueil</td><td>Three.js 0.183</td><td>Icosaèdre wireframe + bloom</td></tr>
      <tr><td>Tests</td><td>Vitest</td><td>725 tests, 23 fichiers</td></tr>
    </tbody>
  </table>

  <p>
    <strong>Architecture sans framework</strong> : KAIROS n'utilise ni React, ni Vue, ni Angular. L'ensemble du rendu est piloté par du TypeScript vanilla avec manipulation directe du DOM, des événements personnalisés (<code>document.dispatchEvent</code>) et un pattern de hooks pour la persistence.
  </p>

  <h3>Architecture multi-process</h3>

  <pre><code>┌─────────────────────────────────────────┐
│  main.js (Electron Main Process)        │
│  ├─ IPC handlers (71 routes)            │
│  ├─ SQLite (better-sqlite3)             │
│  ├─ LLM proxy (fetch → providers)       │
│  ├─ safeStorage (clés API chiffrées)    │
│  └─ CSP centralisé                      │
├─────────────────────────────────────────┤
│  preload.js (Context Bridge)            │
│  └─ window.fgraph (API sécurisée)       │
├─────────────────────────────────────────┤
│  Renderer (6 pages HTML)                │
│  ├─ Canvas spatial (vignettes + liens)  │
│  ├─ Jauge O₂ (radar SVG + sparkline)   │
│  ├─ LLM streaming (SSE parser)         │
│  ├─ Système de friction                 │
│  └─ 123 modules TypeScript              │
└─────────────────────────────────────────┘</code></pre>

  <p>
    <strong>Sécurité</strong> : <code>nodeIntegration: false</code>, <code>contextIsolation: true</code>, sandbox activé sur les fenêtres secondaires. Les clés API ne transitent jamais en clair via IPC (pattern <code>keyRef</code> — le renderer envoie une référence, le main process résout via safeStorage).
  </p>

  <h3>Deux modes d'exploration</h3>

  <p>KAIROS propose deux modes incarnant deux postures épistémologiques distinctes :</p>

  <table>
    <thead>
      <tr><th></th><th>Mode Assisté</th><th>Mode Autonome</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Accent visuel</strong></td><td>Rouge / orange</td><td>Violet / mauve</td></tr>
      <tr><td><strong>Posture IA</strong></td><td>Assistant méthodologique</td><td>Miroir non-directif</td></tr>
      <tr><td><strong>Opérations</strong></td><td>DÉVELOPPER, RELIER, SYNTHÉTISER, CONVERGENCE</td><td>Dialogue libre</td></tr>
      <tr><td><strong>Friction</strong></td><td>Injection automatique (O₂ &lt; 30)</td><td>Pas d'injection</td></tr>
      <tr><td><strong>Métriques</strong></td><td>Affichage temps réel</td><td>Suivi silencieux</td></tr>
      <tr><td><strong>Équation</strong></td><td colspan="2">E = f(S) · (O × Δ) / (P + R)</td></tr>
    </tbody>
  </table>

  <p>
    <strong>Mode Assisté</strong> — L'IA propose activement des vignettes et connexions via 4 opérations structurées. Le bandeau de suggestion orchestre les actions selon une chaîne de priorité à 8 niveaux basée sur le profil topologique du graphe.
  </p>

  <p>
    <strong>Mode Autonome</strong> — L'IA adopte une posture de questionnement non-directif, inspirée de l'« Équation de l'Entre » : superposition (maintenir les possibles ouverts), test de prédictibilité (vérifier si la pensée est vivante ou mécanique), mutation (permettre au sens de se transformer).
  </p>

  <h3>Canvas spatial vs. chat linéaire</h3>

  <p>
    Le canvas est l'unité fondamentale de KAIROS. Chaque <strong>vignette</strong> (node) est un élément positionné dans un espace 2D continu, avec :
  </p>

  <ul>
    <li><strong>ID unique</strong> : <code>n_{crypto.randomUUID()}</code> (jamais <code>Date.now()</code> — contrainte critique pour éviter les collisions SQLite)</li>
    <li><strong>Texte</strong> : 15 mots maximum recommandés (simultanéité, pas narration)</li>
    <li><strong>Statut</strong> : <code>neutral</code> ou <code>priority</code> (ancre structurante, 1 par canvas)</li>
    <li><strong>Tags</strong> : dimensions transversales (hashtags)</li>
    <li><strong>Origine</strong> : <code>user</code> | <code>llm</code> | <code>friction</code> | <code>capture</code> (traçabilité complète)</li>
  </ul>

  <p>Les <strong>connexions</strong> sont typées :</p>
  <ul>
    <li><code>implies</code> (→) : implication, dépendance</li>
    <li><code>resonance</code> (↔) : co-conditionnement</li>
    <li><code>conflicts</code> : tension explicite</li>
    <li><code>example</code> : instanciation</li>
  </ul>

  <p>
    Cette spatialisation permet de <strong>voir</strong> la structure de la pensée : un arbre descendant (décomposition linéaire) se distingue visuellement d'un graphe à boucles de rétroaction (pensée systémique). Le système O₂ quantifie cette distinction.
  </p>
</section>

<!-- ==================== SYSTÈME OXYGÈNE ==================== -->
<section id="oxygene">
  <div class="section-number">Section 04</div>
  <h2>Système Oxygène (O₂)</h2>

  <p class="lead">
    Le cœur technique de KAIROS est un système de scoring cognitif temps réel, implémenté en 2 918 lignes réparties sur 6 modules. Ce système constitue le lien direct avec le cadre <a href="/physique-quantique-conversationnelle.html">PQC</a> (Klimacek, 2026).
  </p>

  <h3>Score O₂ — Modèle snapshot pur</h3>

  <p>Le score O₂ (0–100, défaut 50) est recalculé à chaque action utilisateur et à chaque cycle LLM. Il suit un modèle <strong>additif pondéré</strong> :</p>

  <pre><code>score = 50 (base)
      + structure       (Signal 1 : -30 à +5)
      + tagDiversity    (Signal 4 : -20 à +10)
      + friction        (Signal 5 :   0 à +10)
      + convergence     (Signal 6 :   0 à +15)
      + topological     (Signal 7 : -11 à +20)
      + posture         (Signal 8 :  -8 à  +5)

score = score × (0.70 + 0.30 × triangleHealth)
score = min(score, contentCap)
score = clamp(0, 100)</code></pre>

  <p><strong>Trois zones opérationnelles</strong> :</p>
  <ul>
    <li><strong>Respiration</strong> (&gt; 50) : exploration productive</li>
    <li><strong>Stagnation</strong> (30–50) : force le sous-mode <em>diverger</em></li>
    <li><strong>Asphyxie</strong> (&lt; 30) : déclenche l'injection automatique de friction</li>
  </ul>

  <h3>Signaux structurels</h3>

  <p>
    <strong>Signal 1 — Structure du graphe</strong> (activé ≥ 4 vignettes) :
    le ratio <code>connexions / vignettes</code> mesure la densité du graphe. Un ratio &lt; 0.5 (sous-connecté) entraîne un malus de -25 ; un ratio entre 1.0 et 2.0 (équilibré) donne un bonus de +5. Les composantes déconnectées (îlots) coûtent -5 chacune. Un mécanisme de <strong>rampe d'atténuation</strong> évite l'effet falaise au seuil d'activation (50% du malus au seuil, 75% au seuil+1, 100% au seuil+2).
  </p>

  <p>
    <strong>Signal 4 — Diversité des tags</strong> (fenêtre glissante 3 tours) :
    les nouveaux tags détectés rapportent +5 chacun (max +10/tour). L'absence de nouveaux tags pendant ≥ 3 tours déclenche un malus de stagnation de -20. Période de grâce : pas de stagnation sous 4 vignettes ni quand la friction est active.
  </p>

  <p>
    <strong>Signal 5 — Friction</strong> (décroissance 1 tour) :
    l'acceptation d'une vignette friction par l'utilisateur donne un bonus de +10, consommé en exactement 1 tour.
  </p>

  <p>
    <strong>Signal 6 — Convergence</strong> (optionnel) :
    l'exécution d'une analyse de convergence (extraction d'actions concrètes) donne +5 à +15. Aucun malus si pas de convergence.
  </p>

  <h3>Grandeurs topologiques (Signal 7)</h3>

  <p>Quatre métriques purement topologiques mesurent la <em>forme</em> du graphe en écho aux variables PQC :</p>

  <table>
    <thead>
      <tr><th>Grandeur</th><th>Symbole</th><th>Activation</th><th>Mesure</th><th>Bonus</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Ouverture</strong></td><td>ψ</td><td>≥ 4 nœuds</td><td>Ratio nœuds sans <code>implies</code> sortant (questions ouvertes)</td><td>-3 à +5</td></tr>
      <tr><td><strong>Résolution</strong></td><td>▼</td><td>≥ 6 nœuds</td><td>Ratio nœuds avec <code>implies</code> entrant ET sortant</td><td>0 à +5</td></tr>
      <tr><td><strong>Propagation</strong></td><td>»</td><td>≥ 6 nœuds</td><td>Plus longue chaîne <code>implies</code> (BFS)</td><td>0 à +5</td></tr>
      <tr><td><strong>Souveraineté</strong></td><td>◉</td><td>≥ 1 nœud LLM</td><td>Ratio nœuds utilisateur / total</td><td>-5 à +5</td></tr>
    </tbody>
  </table>

  <p>
    La souveraineté utilise un <strong>ratio enrichi</strong> : <code>50% nodeRatio + 25% connectionRatio + 25% editedRatio</code>. Cette formule capture non seulement la proportion de création utilisateur, mais aussi l'appropriation active du matériel IA — les nœuds LLM modifiés par l'utilisateur comptent comme reconquis.
  </p>

  <div class="key-insight">
    <strong>Contribution topologique totale</strong> : -11 à +20 points sur le score O₂.
  </div>

  <h3>Triangle radar PQC (3 axes hybrides)</h3>

  <p>Le triangle radar visualise trois axes indépendants (0–100), chacun combinant <strong>70% snapshot + 30% dynamique temporelle</strong> :</p>

  <table>
    <thead>
      <tr><th>Axe</th><th>Snapshot (70%)</th><th>Dynamique (30%)</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Divergence</strong> (ψ)</td><td>ouverture.ratio × 100</td><td>Score de motilité</td></tr>
      <tr><td><strong>Cohérence</strong> (»)</td><td>min((chaîne-1)/4, 1) × 100</td><td>normalizeDeltaP(ΔP)</td></tr>
      <tr><td><strong>Souveraineté</strong> (◉)</td><td>enrichedRatio × 100</td><td>conversionRate × 100</td></tr>
    </tbody>
  </table>

  <p><strong>Pondération par posture cognitive</strong> :</p>
  <ul>
    <li><strong>Accompagner</strong> : 40% D, 40% C, 20% S (priorité à l'exploration structurée)</li>
    <li><strong>Nommer</strong> : 35% D, 35% C, 30% S (équilibre)</li>
    <li><strong>Provoquer</strong> : 30% D, 30% C, 40% S (priorité à l'autonomie de l'utilisateur)</li>
  </ul>

  <p>Le triangle module le score brut : <code>finalScore = rawScore × (0.70 + 0.30 × triangleHealth)</code>. Un triangle déséquilibré réduit le score de 30% maximum.</p>

  <h3>Composantes dynamiques</h3>

  <p>
    <strong>Motilité</strong> (dérivée temporelle) — Mesure le mouvement tour-à-tour dans l'espace du triangle :
  </p>
  <ul>
    <li>4 composantes : déplacement euclidien (40%), churn de tags (30%), tendance écho (20%), variation de densité (10%)</li>
    <li>4 classifications : <strong>statique</strong> (≤ 5 déplacement ET ≤ 5% churn), <strong>flottant</strong> (≤ 15 ET ≤ 10%), <strong>navigant</strong> (≥ 40 ET ≥ 25%), <strong>dérivant</strong> (reste)</li>
    <li>La motilité alimente le bandeau de suggestion : un graphe <em>flottant</em> absorbe la friction sans changer de trajectoire → suggestion de divergence radicale</li>
  </ul>

  <p>
    <strong>Respiration (ΔP)</strong> — Profondeur BFS moyenne depuis les racines du graphe. <strong>Normalisation asymétrique</strong> : expansion linéaire (ΔP +0.25 → 100), contraction quadratique (ΔP -0.30 → 0). L'asymétrie reflète que l'approfondissement est graduel mais l'effondrement structurel est significatif (« apnée »).
  </p>

  <p>
    <strong>Taux de conversion</strong> (souveraineté dynamique) — Ratio nœuds LLM édités / total LLM sur fenêtre glissante 3 tours. Mesure l'appropriation active du matériel IA par l'utilisateur.
  </p>

  <h3>Diagnostic contenu</h3>

  <p>Trois signaux sémantiques calculés mais <strong>non inclus</strong> dans le score — ils <em>plafonnent</em> le score si pathologiques :</p>

  <ol>
    <li><strong>Écho sémantique</strong> — Comparaison Jaccard des empreintes sémantiques (mots → clusters thesaurus français ~42 000 entrées). Seuil ≥ 0.30 = paire redondante. Malus virtuel -5/paire (max -50).</li>
    <li><strong>Saturation des tags</strong> — Parmi les paires connectées, proportion partageant ≥ 1 cluster de tag. &gt; 50% = malus virtuel -10 à -20.</li>
    <li><strong>Concentration des tags</strong> — Fréquence du tag dominant. &gt; 40% = malus virtuel -10 (monoculture thématique).</li>
  </ol>

  <p>Quand le malus virtuel total ≤ -25 (sévérité <em>warning</em>), le score est plafonné : ≤ -50 → max 55, ≤ -35 → max 65, ≤ -25 → max 75.</p>

  <h3>Correspondance PQC ↔ O₂</h3>

  <table>
    <thead>
      <tr><th>Variable PQC</th><th>Grandeur O₂</th><th>Axe radar</th></tr>
    </thead>
    <tbody>
      <tr><td>σ (superposition)</td><td>Ouverture (ψ)</td><td>Divergence</td></tr>
      <tr><td>μ (taux d'effondrement)</td><td>Propagation (»)</td><td>Cohérence</td></tr>
      <tr><td>ε (portée d'intrication)</td><td>Chaîne <code>implies</code></td><td>Cohérence</td></tr>
      <tr><td>δ (divergence humain-IA)</td><td>enrichedRatio</td><td>Souveraineté</td></tr>
    </tbody>
  </table>
</section>

<!-- ==================== FRICTION ==================== -->
<section id="friction">
  <div class="section-number">Section 05</div>
  <h2>Mécanismes de friction</h2>

  <h3>Détection de circularité (6 signaux)</h3>

  <p class="lead">
    Le module de friction surveille en permanence 6 indicateurs de circularité cognitive, chacun pondéré selon sa sévérité.
  </p>

  <table>
    <thead>
      <tr><th>Signal</th><th>Description</th><th>Poids</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Reformulation</strong></td><td>Similarité Jaccard sémantique &gt; 0.30 entre vignettes</td><td>Élevé</td></tr>
      <tr><td><strong>Cycles</strong></td><td>Cycles dirigés détectés par DFS dans le graphe</td><td>Élevé</td></tr>
      <tr><td><strong>Stagnation</strong></td><td>N tours consécutifs sans nouveau concept</td><td>Moyen</td></tr>
      <tr><td><strong>Validation vide</strong></td><td>Inputs utilisateur type « ok », « oui », « très bien »</td><td>Faible</td></tr>
      <tr><td><strong>Tags saturés</strong></td><td>Un tag apparaissant &gt; 5 fois</td><td>Moyen</td></tr>
      <tr><td><strong>Écho LLM</strong></td><td>Similarité output LLM ↔ input utilisateur &gt; seuil</td><td>Moyen</td></tr>
    </tbody>
  </table>

  <p>Les seuils dépendent de la <strong>posture cognitive</strong> active :</p>

  <table>
    <thead>
      <tr><th>Posture</th><th>Seuil modéré</th><th>Seuil radical</th></tr>
    </thead>
    <tbody>
      <tr><td>Accompagner</td><td>35</td><td>15</td></tr>
      <tr><td>Nommer</td><td>50</td><td>30</td></tr>
      <tr><td>Provoquer</td><td>65</td><td>45</td></tr>
    </tbody>
  </table>

  <h3>Injection de friction dans les prompts</h3>

  <p>Quand le score de circularité franchit un seuil, un bloc contextuel est injecté dans le prompt LLM :</p>
  <ul>
    <li><strong>Friction modérée</strong> : « Évite les reformulations d'idées existantes » / « Évite les mécanismes déjà présents »</li>
    <li><strong>Friction radicale</strong> : « Évite explicitement ces mots-clés : [liste] » / « Évite explicitement ces mécanismes : [liste] »</li>
  </ul>

  <p>Un <strong>cooldown</strong> (nombre minimum de tours entre injections) empêche la fatigue de friction.</p>

  <h3>Vignettes friction (signal visuel)</h3>

  <p>
    En-dessous du seuil O₂ &lt; 30 (zone d'asphyxie), le système génère des vignettes marquées <code>[FRICTION]</code> avec un halo rouge pulsant. L'utilisateur peut :
  </p>
  <ul>
    <li><strong>Conserver</strong> la vignette → bonus O₂ +10 (1 tour), le contenu provocateur est intégré au graphe</li>
    <li><strong>Supprimer</strong> la vignette → pas de bonus, le signal est enregistré mais pas pénalisé</li>
    <li><strong>Modifier</strong> la vignette → comptabilisée comme appropriation (editedRatio de souveraineté)</li>
  </ul>

  <h3>Génération dégressive</h3>

  <p>Le nombre de vignettes proposées par le LLM diminue avec la densité du canvas :</p>
  <ul>
    <li>&lt; 8 vignettes → « 2 à 3 » nouvelles vignettes</li>
    <li>8–15 vignettes → « 2 »</li>
    <li>&gt; 15 vignettes → « 1 »</li>
  </ul>

  <p>Ce mécanisme évite la dilution par surproduction IA et maintient la proportion de vignettes utilisateur dans le graphe.</p>

  <h3>Traçabilité des origines</h3>

  <p>
    Chaque vignette porte son <code>origin</code> (<code>user</code>, <code>llm</code>, <code>friction</code>, <code>capture</code>). Dans les prompts LLM, les vignettes sont annotées :
  </p>
  <ul>
    <li><code>[USER·NEW]</code> : créée par l'utilisateur depuis le dernier cycle (priorité maximale)</li>
    <li><code>[USER]</code> : créée dans les cycles précédents (« Construis dessus, ne la reformule pas »)</li>
    <li><code>[EDITED]</code> : proposée par l'IA puis modifiée par l'utilisateur (« Appropriée, traiter comme semi-user »)</li>
  </ul>

  <div class="key-insight">
    Cette sémantique permet au LLM de <strong>distinguer la direction de l'utilisateur</strong> du matériel qu'il a lui-même produit — un mécanisme clé pour maintenir la souveraineté cognitive.
  </div>
</section>

<!-- ==================== ÉTAT ACTUEL ==================== -->
<section id="etat-actuel">
  <div class="section-number">Section 06</div>
  <h2>État actuel</h2>

  <h3>Métriques du codebase</h3>

  <table>
    <thead>
      <tr><th>Métrique</th><th>Valeur</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>TypeScript</strong></td><td>50 844 lignes (123 fichiers)</td></tr>
      <tr><td><strong>CSS</strong></td><td>19 909 lignes (7 couches <code>@layer</code> + modes)</td></tr>
      <tr><td><strong>JavaScript (backend)</strong></td><td>2 690 lignes (SQLite + IPC)</td></tr>
      <tr><td><strong>HTML</strong></td><td>6 points d'entrée</td></tr>
      <tr><td><strong>Tests unitaires</strong></td><td>725 (Vitest, 23 fichiers)</td></tr>
      <tr><td><strong>Tables SQLite</strong></td><td>15</td></tr>
      <tr><td><strong>Handlers IPC</strong></td><td>71</td></tr>
      <tr><td><strong>Thèmes visuels</strong></td><td>4 (Obsidian, Porcelain, Aurora, Kraft)</td></tr>
      <tr><td><strong>Total source</strong></td><td>~72 000 lignes</td></tr>
    </tbody>
  </table>

  <h3>Fournisseurs LLM supportés</h3>

  <table>
    <thead>
      <tr><th>Fournisseur</th><th>Type</th><th>Timeout</th><th>Statut</th></tr>
    </thead>
    <tbody>
      <tr><td>Claude (Anthropic)</td><td>Cloud</td><td>30s</td><td>Complet</td></tr>
      <tr><td>ChatGPT (OpenAI)</td><td>Cloud</td><td>30s</td><td>Complet</td></tr>
      <tr><td>DeepSeek</td><td>Cloud</td><td>30s</td><td>Complet</td></tr>
      <tr><td>Mistral</td><td>Cloud (API)</td><td>30s</td><td>Complet</td></tr>
      <tr><td>Groq</td><td>Cloud (API)</td><td>30s</td><td>Complet</td></tr>
      <tr><td>Grok (xAI)</td><td>Cloud</td><td>30s</td><td>Complet</td></tr>
      <tr><td>Ollama</td><td>Local</td><td>240s</td><td>Complet</td></tr>
      <tr><td>KAIROS Cloud</td><td>Backend Supabase</td><td>60s</td><td>Phase 3</td></tr>
    </tbody>
  </table>

  <p><strong>Modèles locaux testés</strong> : qwen3:8b, gemma3:4b (compatibles avec le format structuré des templates KAIROS).</p>

  <h3>Fonctionnalités principales</h3>

  <ul>
    <li><strong>Jauge O₂</strong> : scoring temps réel, triangle radar SVG, sparkline historique, diagnostic contenu, détection de seuils</li>
    <li><strong>Friction automatisée</strong> : 6 détecteurs, injection prompt, vignettes friction visuelles, génération dégressive</li>
    <li><strong>Synthèses</strong> : archivage structuré (fil rouge, angles morts, question), réinjection dans les prompts</li>
    <li><strong>Convergence</strong> : extraction d'actions concrètes (3 scopes : graphe, synthèse, sélection), tensions identifiées</li>
    <li><strong>Détection d'attracteurs</strong> : surveillance rétrospective des patterns LLM (9 détecteurs, score d'émergence 0–100)</li>
    <li><strong>Prompt Lab</strong> : calibration du prompt système en mode autonome (bibliothèque presets SQLite, zone de test)</li>
    <li><strong>Multi-canvas</strong> : onglets, métriques indépendantes, copier-coller inter-canvas</li>
    <li><strong>Géométrie sacrée</strong> : 11 motifs de fond génératifs (Fleur de Vie, Métatron, Vesica Piscis, etc.)</li>
    <li><strong>Accessibilité</strong> : 3 niveaux de police, mode simple/expert, onboarding progressif (4 paliers)</li>
    <li><strong>Sécurité</strong> : sandbox, safeStorage, pattern keyRef, validation payload, CSP centralisé</li>
  </ul>
</section>

<!-- ==================== FONDEMENTS THÉORIQUES ==================== -->
<section id="fondements">
  <div class="section-number">Section 07</div>
  <h2>Fondements théoriques</h2>

  <h3>Physique Quantique Conversationnelle (PQC)</h3>

  <p class="lead">
    KAIROS opérationnalise le cadre <a href="/physique-quantique-conversationnelle.html">PQC</a> (Klimacek, 2026), qui décrit quatre forces agissant sur toute conversation humain-IA.
  </p>

  <p>
    <strong>Alignement</strong> — La convergence progressive des cadres de référence entre locuteurs. En interaction humain-IA, le risque est l'alignement passif : l'utilisateur adopte les catégories de l'IA sans les contester (Pickering &amp; Garrod, 2004 ; Clark &amp; Brennan, 1991 ; Schegloff, 1982).
  </p>

  <p>
    <strong>Friction</strong> — La résistance productive qui force la réorganisation cognitive. Le conflit socio-cognitif (Doise &amp; Mugny, 1984 ; Butera, Sommet &amp; Darnon, 2019) est le moteur de l'apprentissage : le désaccord oblige à décentrer, argumenter, restructurer. Piaget (1985) formalise ce processus comme équilibration par perturbation.
  </p>

  <p>
    <strong>Intention</strong> — La direction cognitive de l'utilisateur. Austin (1962) et Searle (1976) distinguent les actes illocutoires ; KAIROS trace l'intention via les marqueurs <code>[USER·NEW]</code> et <code>[USER]</code> qui signalent au LLM la direction active de l'utilisateur.
  </p>

  <p>
    <strong>Linéarisation</strong> — La perte structurelle par séquentialisation. Schiffrin (1987), Fraser (1999) et Mann &amp; Thompson (1988) analysent comment la mise en séquence impose une hiérarchie artificielle aux idées. La spatialisation 2D de KAIROS contourne cette contrainte en permettant la coexistence simultanée.
  </p>

  <h3>Réparation conversationnelle</h3>

  <p>
    Le mécanisme de friction s'inspire directement des <strong>séquences de réparation</strong> de Schegloff, Jefferson &amp; Sacks (1977) : dans la conversation naturelle, les participants détectent et corrigent les malentendus via des marqueurs spécifiques. KAIROS automatise cette détection (6 signaux de circularité) et injecte des réparations sous forme de contraintes dans le prompt LLM.
  </p>

  <h3>Conflit socio-cognitif</h3>

  <p>
    Doise &amp; Mugny (1984) montrent que le progrès cognitif résulte de la confrontation entre perspectives contradictoires, à condition que le conflit soit <strong>épistémique</strong> (centré sur la tâche) plutôt que <strong>compétitif</strong> (centré sur les individus). Butera et al. (2019) précisent les conditions de régulation productive du conflit. La friction de KAIROS est conçue pour produire un conflit épistémique : elle ne prescrit pas quoi penser, elle force l'exploration hors des attracteurs locaux.
  </p>

  <h3>Marqueurs discursifs et structure</h3>

  <p>
    Fraser (1999) analyse les marqueurs discursifs comme signaux de relations entre segments. Dans KAIROS, les connexions typées (<code>implies</code>, <code>resonance</code>, <code>conflicts</code>) et les tags transversaux jouent ce rôle structurel, rendant explicites les relations que la conversation linéaire laisse implicites.
  </p>
</section>

<!-- ==================== TRAVAUX FUTURS ==================== -->
<section id="travaux-futurs">
  <div class="section-number">Section 08</div>
  <h2>Travaux futurs</h2>

  <h3>Court terme (en cours)</h3>

  <p>
    <strong>Backend cloud</strong> — Déploiement Supabase Edge Functions + PostgreSQL, proxy OpenRouter, authentification JWT, quotas par tier (free/contributor/byok), paiement Stripe. Phase 3 testée localement.
  </p>

  <p>
    <strong>Streaming temps réel</strong> — Relay SSE depuis OpenRouter, parser SSE existant côté Electron.
  </p>

  <h3>Moyen terme</h3>

  <p>
    <strong>Pipeline « Le Pli »</strong> — Architecture multi-étapes où le LLM (1) lit le graphe, (2) identifie les tensions non-résolues, (3) propose des vignettes qui plient l'espace conceptuel, créant des raccourcis entre clusters distants.
  </p>

  <p>
    <strong>Thinking Capture</strong> — Extraction du raisonnement interne des LLM (extended thinking Claude, chaîne de pensée DeepSeek) comme métriques O₂ informatives.
  </p>

  <p>
    <strong>Analyse comparative multi-providers</strong> — Superposition de triangles radar pour visualiser comment différents LLM déforment l'espace cognitif différemment.
  </p>

  <h3>Long terme</h3>

  <p>
    <strong>Multi-agent</strong> — Plusieurs LLM opérant simultanément sur le même canvas avec des postures distinctes (un explore, un critique, un synthétise), chacun produisant un triangle radar superposé.
  </p>

  <p>
    <strong>KAIROS Lite</strong> — Version PWA mobile/tablette avec layout force-directed automatique, StorageAdapter IndexedDB, bottom sheet.
  </p>

  <p>
    <strong>Validation empirique</strong> — Protocole expérimental mesurant l'effet de KAIROS sur la profondeur de réflexion, la diversité conceptuelle et la souveraineté cognitive par rapport à une interface chat standard.
  </p>
</section>

<!-- ==================== RÉFÉRENCES ==================== -->
<section id="references">
  <div class="section-number">Section 09</div>
  <h2>Références</h2>

  <div class="sources-section">

    <h3>Travaux de l'auteur</h3>

    <p>Klimacek, F. (2026). <em>Physique Quantique Conversationnelle</em>. Zenodo. <a href="https://doi.org/10.5281/zenodo.19023026" target="_blank" rel="noopener">https://doi.org/10.5281/zenodo.19023026</a></p>

    <h3>Études empiriques récentes</h3>

    <p>Glickman, M. &amp; Sharot, T. (2024). How human–AI feedback loops alter human perceptual, emotional and social judgements. <em>Nature Human Behaviour</em>, 9, 345–359. <a href="https://doi.org/10.1038/s41562-024-02077-2" target="_blank" rel="noopener">DOI</a></p>

    <p>Klein, C. R. &amp; Klein, R. (2025). The extended hollowed mind: why foundational knowledge is indispensable in the age of AI. <em>Frontiers in Artificial Intelligence</em>, 8, 1719019. <a href="https://doi.org/10.3389/frai.2025.1719019" target="_blank" rel="noopener">DOI</a></p>

    <p>Kosmyna, N. et al. (2025). Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task. MIT Media Lab. <a href="https://arxiv.org/abs/2506.08872" target="_blank" rel="noopener">arXiv:2506.08872</a></p>

    <h3>Analyse conversationnelle</h3>

    <p>Schegloff, E. A. (1982). Discourse as an interactional achievement. In <em>Analyzing Discourse: Text and Talk</em> (pp. 71–93). Georgetown University Press.</p>

    <p>Schegloff, E. A., Jefferson, G. &amp; Sacks, H. (1977). The preference for self-correction in the organization of repair in conversation. <em>Language</em>, 53(2), 361–382.</p>

    <p>Pomerantz, A. (1984). Agreeing and disagreeing with assessments. In <em>Structures of Social Action</em> (pp. 57–101). Cambridge University Press.</p>

    <h3>Conflit socio-cognitif</h3>

    <p>Butera, F., Sommet, N. &amp; Darnon, C. (2019). Sociocognitive conflict regulation: How to make sense of diverging ideas. <em>Current Directions in Psychological Science</em>, 28(2), 145–151.</p>

    <p>Doise, W. &amp; Mugny, G. (1984). <em>The Social Development of the Intellect</em>. Pergamon Press.</p>

    <p>Piaget, J. (1985). <em>The Equilibration of Cognitive Structures: The Central Problem of Intellectual Development</em>. University of Chicago Press.</p>

    <h3>Alignement et grounding</h3>

    <p>Clark, H. H. &amp; Brennan, S. E. (1991). Grounding in communication. In <em>Perspectives on Socially Shared Cognition</em> (pp. 127–149). APA.</p>

    <p>Pickering, M. J. &amp; Garrod, S. (2004). Toward a mechanistic psychology of dialogue. <em>Behavioral and Brain Sciences</em>, 27(2), 169–226.</p>

    <p>Roschelle, J. (1992). Learning by collaborating: Convergent conceptual change. <em>Journal of the Learning Sciences</em>, 2(3), 235–276.</p>

    <h3>Marqueurs discursifs et structure textuelle</h3>

    <p>Fraser, B. (1999). What are discourse markers? <em>Journal of Pragmatics</em>, 31(7), 931–952.</p>

    <p>Mann, W. C. &amp; Thompson, S. A. (1988). Rhetorical Structure Theory: Toward a functional theory of text organization. <em>Text</em>, 8(3), 243–281.</p>

    <p>Schiffrin, D. (1987). <em>Discourse Markers</em>. Cambridge University Press.</p>

    <h3>Actes de langage</h3>

    <p>Austin, J. L. (1962). <em>How to Do Things with Words</em>. Oxford University Press.</p>

    <p>Searle, J. R. (1976). A Classification of Illocutionary Acts. <em>Language in Society</em>, 5(1), 1–23.</p>

  </div>

  <div class="chapter-divider"></div>

  <p><em>Document généré le 21 mars 2026 à partir de l'état réel du codebase KAIROS v1.0.2 (commit 3d6df63). Version PDF disponible sur <a href="https://doi.org/10.5281/zenodo.19159722" target="_blank" rel="noopener">Zenodo</a>.</em></p>
</section>
