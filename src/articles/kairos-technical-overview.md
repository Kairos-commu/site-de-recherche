---
slug: kairos-technical-overview
pageTitle: "KAIROS : Vue d'ensemble technique — Florent Klimacek"
headline: "KAIROS : Vue d'ensemble technique"
description: "Architecture, jauge Oxygène, friction, triangle radar, Gardien, Companion. Comment le cadre de L'Entre devient un logiciel de cartographie cognitive — état du code, sans DOI."
ogTitle: "KAIROS : Vue d'ensemble technique"
ogDescription: "Architecture, jauge Oxygène, friction, triangle radar. Comment le cadre de L'Entre devient un logiciel de cartographie cognitive."
ogUrl: "/kairos-technical-overview.html"
canonical: "/kairos-technical-overview.html"
datePublished: "2026-08-22"
dateModified: "2026-08-22"
keywords:
  - KAIROS
  - architecture technique
  - jauge Oxygène
  - friction cognitive
  - triangle radar
  - embeddings
  - cartographie cognitive
  - souveraineté cognitive
  - L'Entre — Théorie des Plis
  - interactions humain-IA
  - Electron
  - TypeScript
permalink: "/kairos-technical-overview.html"
navLabel: "Architecture"
navDescription: "Comment le cadre de L'Entre devient un logiciel"
heroLabel: "Architecture"
heroH1: "<span class=\"glitch-text\">KAIROS</span><br><span>Vue d'ensemble technique</span>"
heroIntro: "Comment le cadre de L'Entre — Théorie des Plis — devient un logiciel de cartographie cognitive : architecture, jauge Oxygène, friction, souveraineté. Document vivant, sans DOI."
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
    title: "Friction"
  - id: autour
    title: "Autour du canvas"
  - id: etat-actuel
    title: "État actuel"
  - id: fondements
    title: "Fondements théoriques"
  - id: references
    title: "Références"
card:
  label: "Architecture"
  title: "KAIROS — Vue d'ensemble technique"
  desc: "Architecture, jauge Oxygène, friction, triangle radar. Le pont entre la théorie et le code — document vivant."
  readingTime: "18 min"
  linkText: "Lire le document"
  featured: false
feedCategory: "Architecture"
feedTime: "10:00:00"
sitemapPriority: "0.8"
sitemapChangefreq: "monthly"
order: 12
---

<!-- ==================== ABSTRACT ==================== -->
<section id="abstract">
  <div class="section-number">Section 01</div>
  <h2>Abstract</h2>

  <div class="key-insight">
    <strong>Document vivant.</strong> Ce texte décrit KAIROS tel qu'il est aujourd'hui (août 2026). Ce n'est pas un preprint. Une version antérieure, figée en mars 2026 et déposée sur Zenodo, mélangeait déjà des couches du logiciel ; elle n'est plus la référence.
  </div>

  <p class="lead">
    KAIROS est une application de bureau (Electron) qui transforme l'exploration d'idées en cartographie spatiale non-linéaire, assistée par intelligence artificielle. Contrairement aux interfaces conversationnelles linéaires (chat), KAIROS représente les concepts comme des <strong>vignettes</strong> positionnées sur un canvas 2D, reliées par des connexions typées (implication, résonance, conflit, exemple).
  </p>

  <p>
    Le système intègre une <strong>jauge d'oxygène cognitive</strong> (O₂) : un score snapshot 0–100, un triangle radar (divergence, cohérence, souveraineté) et un diagnostic de contenu par embeddings locaux. Un mécanisme de <strong>friction</strong> détecte les circularités et injecte une perturbation quand la pensée s'asphyxie. Autour du canvas : mode Autonome, Companion, Mode Gardien, import de sources.
  </p>

  <p>
    L'application s'appuie sur le cadre de <a href="/lentre-theorie-des-plis.html">L'Entre — Théorie des Plis</a>. Les deux ne coïncident pas formule pour formule : O₂ a été construit avant la version actuelle de l'équation E<sub>T</sub>. Ils s'informent ; ils ne sont pas le même objet. TypeScript vanilla, pas de framework UI, SQLite embarqué, suite de tests unitaires.
  </p>
</section>

<!-- ==================== PROBLÈME ==================== -->
<section id="probleme">
  <div class="section-number">Section 02</div>
  <h2>Problème : la linéarisation mutuelle</h2>

  <h3>L'interface chat comme réducteur cognitif</h3>

  <p class="lead">
    L'interface conversationnelle séquentielle (chat) impose une <strong>linéarisation</strong> structurelle à la pensée exploratoire. Chaque tour de parole écrase la simultanéité des idées en une séquence ordonnée.
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
    Au-delà de la linéarisation, les interfaces conversationnelles produisent un <strong>accordage passif</strong> : l'utilisateur s'aligne progressivement sur le registre, le rythme et les catégories de l'IA. Ce phénomène correspond, dans <a href="/lentre-theorie-des-plis.html">L'Entre</a>, à une pression P qui se resserre sans qu'on l'ait décidé — convergence vers ce que le fil contient déjà.
  </p>

  <h3>Hypothèse de KAIROS</h3>

  <p>
    La spatialisation non-linéaire des idées, combinée à des mécanismes de friction et à une mesure continue de la souveraineté, peut <strong>maintenir l'engagement actif</strong> de l'utilisateur dans l'exploration assistée par IA. Le score O₂ rend visible ce qui est habituellement invisible : la qualité structurelle de la pensée en cours.
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
      <tr><td>Runtime</td><td>Electron 28</td><td>Processus main + renderer, Node 18 embarqué</td></tr>
      <tr><td>Langage</td><td>TypeScript (ES modules)</td><td>Aucun framework UI — DOM + événements custom</td></tr>
      <tr><td>Bundler</td><td>Vite 7</td><td>Multi-page, esbuild (pas de tsc emit)</td></tr>
      <tr><td>Base de données</td><td>SQLite (better-sqlite3)</td><td>WAL mode, persistence par canvas</td></tr>
      <tr><td>Stockage clés</td><td>electron-store + safeStorage</td><td>Chiffrement natif OS</td></tr>
      <tr><td>Visualisation</td><td>Canvas 2D + SVG</td><td>Fond génératif, connexions organiques, radar</td></tr>
      <tr><td>Page d'accueil</td><td>Three.js</td><td>Icosaèdre 3D</td></tr>
      <tr><td>Embeddings</td><td>Ollama + bge-m3</td><td>Diagnostic contenu local, hors score</td></tr>
      <tr><td>Tests</td><td>Vitest</td><td>Suite unitaire lancée hors Electron</td></tr>
    </tbody>
  </table>

  <p>
    <strong>Sécurité</strong> : <code>nodeIntegration: false</code>, <code>contextIsolation: true</code>. Les clés API ne transitent jamais en clair via IPC (le renderer envoie une référence, le main process résout via safeStorage). CSP centralisé dans le processus principal.
  </p>

  <h3>Deux modes d'exploration</h3>

  <table>
    <thead>
      <tr><th></th><th>Mode Assisté</th><th>Mode Autonome</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Accent visuel</strong></td><td>Rouge / orange</td><td>Violet / mauve</td></tr>
      <tr><td><strong>Rôle de l'IA</strong></td><td>Opérations structurées</td><td>Dialogue non-directif</td></tr>
      <tr><td><strong>Opérations</strong></td><td>DÉVELOPPER, RELIER, SYNTHÉTISER, PERSPECTIVES</td><td>Chat libre, Prompt Lab, cartes d'émergence</td></tr>
      <tr><td><strong>Friction</strong></td><td>Injection automatique (O₂ &lt; 30)</td><td>Pas d'injection</td></tr>
      <tr><td><strong>O₂</strong></td><td>Actif — score, triangle, bandeau</td><td>Passif — observation, pas de guidage</td></tr>
      <tr><td><strong>Providers</strong></td><td colspan="2">Roster complet, tous modes</td></tr>
    </tbody>
  </table>

  <p>
    Claude, ChatGPT, DeepSeek, Mistral, Groq, Grok, Ollama. Coller une clé API suffit : le fournisseur est détecté automatiquement. Ollama tourne en local, sans clé.
  </p>

  <h3>Canvas spatial</h3>

  <p>Chaque <strong>vignette</strong> est un nœud positionné dans un espace 2D continu :</p>
  <ul>
    <li><strong>ID</strong> : <code>n_{crypto.randomUUID()}</code> — jamais <code>Date.now()</code> (collisions SQLite, rollback complet)</li>
    <li><strong>Statut</strong> : <code>neutral</code> ou <code>priority</code> (ancres, maximum 3 par canvas)</li>
    <li><strong>Tags</strong> : dimensions transversales</li>
    <li><strong>Origine</strong> : <code>user</code>, <code>llm</code>, <code>friction</code> ou <code>import</code></li>
  </ul>

  <p>Les <strong>connexions</strong> sont typées : <code>implies</code> (→), <code>resonance</code> (↔), <code>conflicts</code>, <code>example</code>.</p>

  <p>
    Cette spatialisation permet de <strong>voir</strong> la structure de la pensée : un arbre descendant se distingue d'un graphe à boucles. O₂ quantifie cette distinction.
  </p>
</section>

<!-- ==================== SYSTÈME OXYGÈNE ==================== -->
<section id="oxygene">
  <div class="section-number">Section 04</div>
  <h2>Système Oxygène (O₂)</h2>

  <p class="lead">
    Scoring cognitif temps réel, snapshot pur : recalculé de zéro à chaque évaluation, sans accumulation. Score par défaut (canvas vide) : <strong>50</strong>.
  </p>

  <h3>Formule actuelle</h3>

  <pre><code>score = 50
      + structure      (Signal 1 : -25 à +5, modulé par le régime cognitif)
      + friction       (Signal 5 :   0 à +10)
      + convergence    (Signal 6 :   0 à +15, optionnel)
      + topologiques   (Signal 7 :  -8 à +20)

score = score × (0.70 + 0.30 × triangleHealth)
score = clamp(0, 100)
score = min(score, plafond contenu)   ← si pathologie sémantique, sauf régime Approfondissement sans écho</code></pre>

  <p>
    Ce qui <strong>n'entre plus</strong> dans le score : la diversité des tags (Signal 4, informatif seulement — les tags sont trop souvent générés par le LLM) et l'offset de posture (Signal 8, à 0 pour toutes les postures, puis le système de postures a été retiré).
  </p>

  <p><strong>Trois zones</strong> :</p>
  <ul>
    <li><strong>Respire</strong> (&gt; 50) : exploration libre</li>
    <li><strong>Stagne</strong> (30–50) : force le sous-mode <em>diverger</em></li>
    <li><strong>Asphyxie</strong> (&lt; 30) : injection automatique d'une friction</li>
  </ul>

  <h3>Signaux structurels (dans le score)</h3>

  <p>
    <strong>Structure</strong> (activé ≥ 4 vignettes) : ratio <code>connexions / vignettes</code>. Sous-connecté (&lt; 0.5) ou sur-connecté (&gt; 3) : malus −25. Équilibré (1–2) : +5. Îlots déconnectés : −5 par composante supplémentaire, atténué selon le régime cognitif. Rampe d'activation pour éviter un cliff à 4 nœuds.
  </p>

  <p>
    <strong>Friction</strong> : accepter une vignette friction donne +10 pendant un tour.
  </p>

  <p>
    <strong>Convergence</strong> : bonus optionnel +5 à +15 si une analyse Perspectives a été produite.
  </p>

  <h3>Grandeurs topologiques (dans le score)</h3>

  <table>
    <thead>
      <tr><th>Grandeur</th><th>Activation</th><th>Mesure</th><th>Bonus</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Ouverture</strong> (ψ)</td><td>≥ 4 nœuds</td><td>Ratio de nœuds sans <code>implies</code> sortant</td><td>−3 à +5</td></tr>
      <tr><td><strong>Résolution</strong></td><td>≥ 6 nœuds</td><td>Nœuds avec <code>implies</code> entrant <em>et</em> sortant</td><td>0 à +5</td></tr>
      <tr><td><strong>Propagation</strong></td><td>≥ 6 nœuds</td><td>Plus longue chaîne <code>implies</code></td><td>0 à +5</td></tr>
      <tr><td><strong>Souveraineté</strong> (◉)</td><td>≥ 1 nœud LLM</td><td>Ratio nœuds utilisateur / total</td><td>−5 à +5</td></tr>
    </tbody>
  </table>

  <p>
    La souveraineté du triangle utilise un <strong>ratio enrichi</strong> : 50% nœuds manuels + 25% connexions manuelles + 25% nœuds LLM ou friction édités. Contribution topologique totale au score : −8 à +20.
  </p>

  <h3>Triangle radar (poids fixes)</h3>

  <p>Trois axes hybrides 0–100, chacun = 70% snapshot + 30% dynamique :</p>

  <table>
    <thead>
      <tr><th>Axe</th><th>Snapshot (70%)</th><th>Dynamique (30%)</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Divergence</strong> (ψ)</td><td>ouverture.ratio × 100</td><td>motilité</td></tr>
      <tr><td><strong>Cohérence</strong> (»)</td><td>min((chaîne−1)/4, 1) × 100</td><td>normalizeDeltaP(ΔP)</td></tr>
      <tr><td><strong>Souveraineté</strong> (◉)</td><td>enrichedRatio × 100</td><td>taux de conversion</td></tr>
    </tbody>
  </table>

  <p>
    Les poids du triangle sont <strong>fixes</strong> (divergence 0.35, cohérence 0.35, souveraineté 0.30). Plus de redistribution par posture. Un geste ponctuel « Sans Filtre » change le ton d'une génération, pas le calcul du score.
  </p>

  <p>
    <code>triangleHealth</code> module le score : un triangle déséquilibré peut le réduire de 30% au maximum. ΔP (respiration) mesure si le graphe s'approfondit ou se replie ; normalisation asymétrique — expansion linéaire, contraction quadratique.
  </p>

  <h3>Régime cognitif</h3>

  <p>
    Un module séparé infère la phase (Exploration, Approfondissement, Synthèse, Inconnu) à partir de la motilité, de la densité de cluster embedding, des îlots et de l'écho. Il module deux choses seulement : le malus d'îlots (attendu en exploration) et le plafond de contenu (relâché en approfondissement, <em>sauf</em> si l'écho signale aussi de la paraphrase).
  </p>

  <h3>Diagnostic contenu (hors score, peut plafonner)</h3>

  <p>Trois signaux sémantiques, calculés par embeddings locaux (<code>bge-m3</code> via Ollama), pas par recouvrement de tags ni thésaurus :</p>
  <ol>
    <li><strong>Écho</strong> — similarité cosinus ≥ 0.6 entre paires de vignettes. −5 / paire (plafond −50).</li>
    <li><strong>Saturation</strong> — parmi les paires <em>connectées</em>, cosinus ≥ 0.65. Ratio &gt; 50% → malus virtuel −10 à −20.</li>
    <li><strong>Concentration</strong> — clustering (seuil 0.55). Plus gros cluster &gt; 60% → −10 virtuel ; ≤ 35% → +10 virtuel.</li>
  </ol>

  <p>
    Si le malus virtuel total ≤ −25 (sévérité <em>warning</em>), le score est plafonné (75 / 65 / 55 selon la gravité), sauf le cas d'approfondissement réel décrit plus haut. Un canvas saturé n'affiche pas 95.
  </p>
</section>

<!-- ==================== FRICTION ==================== -->
<section id="friction">
  <div class="section-number">Section 05</div>
  <h2>Friction</h2>

  <p class="lead">
    Deux mécanismes distincts, souvent confondus : le <strong>score O₂</strong> (asphyxie → vignette friction) et le <strong>score de circularité</strong> (injection dans le prompt).
  </p>

  <h3>Circularité (6 signaux)</h3>

  <table>
    <thead>
      <tr><th>Signal</th><th>Détection</th><th>Poids</th></tr>
    </thead>
    <tbody>
      <tr><td>Reformulation</td><td>Similarité sémantique entre vignettes</td><td>Élevé</td></tr>
      <tr><td>Cycles</td><td>Cycle dirigé dans le graphe (DFS)</td><td>Élevé</td></tr>
      <tr><td>Stagnation</td><td>Tours sans nouveau concept</td><td>Moyen</td></tr>
      <tr><td>Validation vide</td><td>« ok », « oui », « très bien »</td><td>Faible</td></tr>
      <tr><td>Tags saturés</td><td>Un tag &gt; 5 occurrences</td><td>Moyen</td></tr>
      <tr><td>Écho LLM</td><td>Sortie trop proche de l'entrée</td><td>Moyen</td></tr>
    </tbody>
  </table>

  <p>
    Seuils <strong>fixes</strong> (plus de réglage par posture) : friction modérée au-dessus de 50, radicale au-dessus de 30. Un cooldown empêche l'injection à chaque tour. Le geste Sans Filtre n'agit pas sur ces seuils : il pousse le ton de la <em>prochaine</em> génération DÉVELOPPER / RELIER, une fois, puis s'éteint.
  </p>

  <h3>Injection et vignettes friction</h3>

  <p>Friction modérée : « évite les reformulations / mécanismes déjà présents ». Radicale : listes explicites de mots-clés et de mécanismes à éviter.</p>

  <p>
    Sous O₂ &lt; 30, le système peut aussi poser une vignette <code>[FRICTION]</code> (halo rouge). La garder : +10 O₂ pendant un tour. La supprimer : pas de malus. L'éditer : compte comme appropriation (souveraineté).
  </p>

  <h3>Génération dégressive</h3>

  <p>
    Plus le canvas mûrit, moins l'IA génère. DÉVELOPPER propose d'abord plusieurs vignettes, puis deux, puis une seule ciblée. L'IA s'efface quand la pensée se structure.
  </p>

  <h3>Traçabilité</h3>

  <p>
    Dans les prompts, les vignettes manuelles récentes sont marquées <code>[USER·NEW]</code>, les plus anciennes <code>[USER]</code> (« construis dessus, ne la reformule pas »), les vignettes IA éditées <code>[EDITED]</code>. Le LLM doit pouvoir distinguer la direction de l'utilisateur du matériel qu'il a lui-même produit.
  </p>
</section>

<!-- ==================== AUTOUR DU CANVAS ==================== -->
<section id="autour">
  <div class="section-number">Section 06</div>
  <h2>Autour du canvas</h2>

  <h3>Mode Gardien</h3>

  <p>
    Filet cognitif, pas un contrôle. Il observe des patterns (souveraineté basse, angles morts, tension manquante), tient un journal, et — quand un insight LLM est déclenché — ancre le texte sur des vignettes réelles, citées. Deux gestes actionnables apparaissent dans le journal seulement quand un signal les justifie : <strong>Explorer</strong> et <strong>Sans Filtre</strong>. Rien n'agit de façon invisible.
  </p>

  <h3>Companion</h3>

  <p>
    Chat libre, fenêtre séparée, indépendant du canvas. Pour clarifier une idée sans structurer le graphe. Recherche web optionnelle (Ollama + Tavily), à portée locale, désactivée par défaut.
  </p>

  <h3>Import de sources</h3>

  <p>
    Fichiers, PDF, URLs : résumés automatiquement (Ollama) et posés comme vignettes <code>origin:'import'</code>. Le texte intégral n'est jamais injecté dans un prompt — seul le résumé l'est.
  </p>

  <h3>Perspectives</h3>

  <p>
    Analyse de convergence indépendante : graphe actif, synthèse archivée, ou sélection. Fil rouge, leviers d'action, tensions. Distinct de SYNTHÉTISER (lecture en trois blocs : fil rouge, angles morts, question structurelle).
  </p>
</section>

<!-- ==================== ÉTAT ACTUEL ==================== -->
<section id="etat-actuel">
  <div class="section-number">Section 07</div>
  <h2>État actuel</h2>

  <h3>Fournisseurs LLM</h3>

  <table>
    <thead>
      <tr><th>Fournisseur</th><th>Type</th><th>Timeout</th></tr>
    </thead>
    <tbody>
      <tr><td>Claude (Anthropic)</td><td>Cloud</td><td>30s</td></tr>
      <tr><td>ChatGPT (OpenAI)</td><td>Cloud</td><td>30s</td></tr>
      <tr><td>DeepSeek</td><td>Cloud</td><td>30s</td></tr>
      <tr><td>Mistral</td><td>Cloud</td><td>30s</td></tr>
      <tr><td>Groq</td><td>Cloud</td><td>30s</td></tr>
      <tr><td>Grok (xAI)</td><td>Cloud</td><td>30s</td></tr>
      <tr><td>Ollama</td><td>Local</td><td>240s</td></tr>
    </tbody>
  </table>

  <p>
    Tous disponibles dans tous les modes. Champ de détection automatique : coller une clé, le provider s'active. Ollama est spawné à la demande (pas de service système permanent), avec <code>keep_alive: 30s</code> pour libérer la VRAM. Modèles Ollama testés : <code>qwen3:14b</code> (prioritaire), <code>qwen3:8b</code>, <code>gemma3:4b</code>. Embeddings : <code>bge-m3</code>, séparé du chat.
  </p>

  <h3>Ce qui est en place</h3>

  <ul>
    <li>Jauge O₂ snapshot, triangle radar, régime cognitif, embeddings contenu</li>
    <li>Friction automatique, génération dégressive, bandeau de suggestion</li>
    <li>Quatre opérations assistées + mode Autonome (Prompt Lab, cartes d'émergence)</li>
    <li>Mode Gardien, Companion, import de sources</li>
    <li>Multi-canvas, 4 thèmes (Obsidian, Porcelain, Aurora, Kraft), onboarding progressif</li>
    <li>Build Linux (AppImage) et Windows ; macOS non publié. La bêta publique est en finalisation — le téléchargement est temporairement fermé.</li>
  </ul>

  <h3>Ce que ce n'est pas</h3>

  <p>
    O₂ n'isole pas O, Δ, P et R comme quatre calculs distincts. L'équation E<sub>T</sub> de L'Entre est un cadre plus récent que le score. Faire coïncider les deux demanderait une refonte, pas un ajustement — c'est dit aussi dans <a href="/lentre-theorie-des-plis.html">la thèse</a>.
  </p>
</section>

<!-- ==================== FONDEMENTS THÉORIQUES ==================== -->
<section id="fondements">
  <div class="section-number">Section 08</div>
  <h2>Fondements théoriques</h2>

  <p class="lead">
    KAIROS s'appuie sur <a href="/lentre-theorie-des-plis.html">L'Entre</a> et, en amont, sur un socle d'analyse conversationnelle et de psychologie cognitive.
  </p>

  <p>
    <strong>Friction productive</strong> — Le conflit socio-cognitif (Doise &amp; Mugny, 1984 ; Butera, Sommet &amp; Darnon, 2019) : le désaccord épistémique force à décentrer. La friction de KAIROS est conçue dans ce registre : elle ne prescrit pas quoi penser, elle force l'exploration hors des attracteurs locaux.
  </p>

  <p>
    <strong>Réparation conversationnelle</strong> — Schegloff, Jefferson &amp; Sacks (1977) : les participants détectent et corrigent les malentendus. KAIROS automatise une forme de cette détection et injecte des contraintes dans le prompt.
  </p>

  <p>
    <strong>Linéarisation</strong> — Schiffrin (1987), Fraser (1999), Mann &amp; Thompson (1988) : la mise en séquence impose une hiérarchie artificielle. La spatialisation 2D contourne cette contrainte.
  </p>

  <p>
    <strong>Alignement</strong> — Pickering &amp; Garrod (2004), Clark &amp; Brennan (1991) : la convergence des cadres. En interaction humain-IA, le risque est l'alignement passif. L'axe Souveraineté rend cette dérive mesurable.
  </p>
</section>

<!-- ==================== RÉFÉRENCES ==================== -->
<section id="references">
  <div class="section-number">Section 09</div>
  <h2>Références</h2>

  <div class="sources-section">

    <h3>Travaux de l'auteur</h3>

    <p>Klimacek, F. (2026). <em>L'Entre — Théorie des Plis</em>. <a href="https://doi.org/10.5281/zenodo.19023026" target="_blank" rel="noopener">https://doi.org/10.5281/zenodo.19023026</a></p>

    <h3>Études empiriques récentes</h3>

    <p>Glickman, M. &amp; Sharot, T. (2024). How human–AI feedback loops alter human perceptual, emotional and social judgements. <em>Nature Human Behaviour</em>, 9, 345–359.</p>

    <p>Klein, C. R. &amp; Klein, R. (2025). The extended hollowed mind: why foundational knowledge is indispensable in the age of AI. <em>Frontiers in Artificial Intelligence</em>, 8, 1719019.</p>

    <p>Kosmyna, N. et al. (2025). Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task. MIT Media Lab. <a href="https://arxiv.org/abs/2506.08872" target="_blank" rel="noopener">arXiv:2506.08872</a></p>

    <h3>Analyse conversationnelle et conflit</h3>

    <p>Schegloff, E. A., Jefferson, G. &amp; Sacks, H. (1977). The preference for self-correction in the organization of repair in conversation. <em>Language</em>, 53(2), 361–382.</p>

    <p>Doise, W. &amp; Mugny, G. (1984). <em>The Social Development of the Intellect</em>. Pergamon Press.</p>

    <p>Butera, F., Sommet, N. &amp; Darnon, C. (2019). Sociocognitive conflict regulation. <em>Current Directions in Psychological Science</em>, 28(2), 145–151.</p>

    <p>Pickering, M. J. &amp; Garrod, S. (2004). Toward a mechanistic psychology of dialogue. <em>Behavioral and Brain Sciences</em>, 27(2), 169–226.</p>

    <p>Clark, H. H. &amp; Brennan, S. E. (1991). Grounding in communication. In <em>Perspectives on Socially Shared Cognition</em>. APA.</p>

    <p>Fraser, B. (1999). What are discourse markers? <em>Journal of Pragmatics</em>, 31(7), 931–952.</p>

    <p>Mann, W. C. &amp; Thompson, S. A. (1988). Rhetorical Structure Theory. <em>Text</em>, 8(3), 243–281.</p>

    <p>Schiffrin, D. (1987). <em>Discourse Markers</em>. Cambridge University Press.</p>

  </div>

  <div class="chapter-divider"></div>

  <p><em>État du logiciel au 22 août 2026. Document vivant, sans DOI. Les constantes O₂ citées ici sont celles du guide interne vérifié contre le code (formule snapshot, embeddings bge-m3, poids du triangle fixes).</em></p>
</section>
