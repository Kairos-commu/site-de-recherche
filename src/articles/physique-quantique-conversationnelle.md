---
slug: physique-quantique-conversationnelle
pageTitle: "Physique Quantique Conversationnelle — Florent Klimacek"
headline: "Physique Quantique Conversationnelle"
description: "Cadre théorique pour mesurer la vitalité d'une conversation humain-IA par la trajectoire des possibles, pas par le résultat."
ogTitle: "Physique Quantique Conversationnelle"
ogDescription: "Cadre théorique pour mesurer la vitalité d'une conversation humain-IA par la trajectoire des possibles, pas par le résultat."
ogUrl: "/physique-quantique-conversationnelle.html"
canonical: "/physique-quantique-conversationnelle.html"
datePublished: "2026-02-26"
dateModified: "2026-02-26"
keywords:
  - physique quantique conversationnelle
  - superposition conversationnelle
  - résonance
  - souveraineté cognitive
  - interactions humain-IA
  - KAIROS
  - mécanique invisible
permalink: "/physique-quantique-conversationnelle.html"
navLabel: "Thèse"
navDescription: "Cadre théorique — Physique Quantique Conversationnelle"
heroLabel: "Cadre théorique"
heroH1: "Physique Quantique<br><span>Conversationnelle</span>"
heroIntro: "La qualité d'une conversation humain-IA ne se mesure ni à la satisfaction
            ni à la justesse, mais à la capacité du système à maintenir une
            superposition féconde tout en convergeant."
headerTitle: "Physique Quantique Conversationnelle"
heroImage: "/images/pqc.webp"
heroImageAlt: "Illustration — Physique Quantique Conversationnelle"
breadcrumbName: "Physique Quantique Conversationnelle"
sections:
  - id: observation
    title: "Observation"
  - id: cadre
    title: "Cadre"
  - id: grandeurs
    title: "Grandeurs"
  - id: transition
    title: "Transition"
  - id: observateur
    title: "Observateur"
  - id: donnees
    title: "Données"
  - id: discussion
    title: "Discussion"
card:
  featured: true
  tag: "Thèse"
  title: "Physique Quantique Conversationnelle"
  desc: "Un cadre théorique pour mesurer la dynamique d'une conversation humain-IA. Quatre grandeurs, une transition de phase, et la question de la souveraineté cognitive."
  readingTime: "15 min"
  linkText: "Lire la thèse"
  quote: "La valeur d'une conversation ne se loge pas dans la réponse finale.<br><span>Elle se loge dans la trajectoire.</span>"
  stats:
    - value: "4"
      label: "grandeurs"
    - value: "7"
      label: "sections"
    - value: "11"
      label: "diagrammes"
feedCategory: "Thèse"
feedTime: "10:00:00"
sitemapPriority: "0.9"
sitemapChangefreq: "monthly"
order: 0
---

<!-- ==================== SECTION 1 ==================== -->
<section id="observation" data-reveal="fade-up">
  <div class="section-number">Section 01</div>
  <h2>Observation — Ce que les métriques actuelles ne voient pas</h2>

  <p>Ouvrez n'importe quel leaderboard. MMLU, HumanEval, Chatbot Arena. Des colonnes de chiffres, des barres de progression, des classements ELO. Le message est clair : on sait mesurer une IA. On sait dire laquelle est la meilleure.</p>

  <p>J'ai cherché ce qu'on mesurait exactement.</p>

  <p>MMLU teste si le modèle répond juste à des questions à choix multiples. HumanEval vérifie si le code qu'il génère passe les tests unitaires. Arena ELO demande à des humains lequel de deux modèles ils préfèrent. Trois angles, un même geste : on isole le modèle, on lui pose une question, on note la réponse.</p>

  <p class="pqc-verdict">La conversation n'apparaît nulle part.</p>

  <!-- Visual: the blind spot -->
  <div class="pqc-visual">
    <div class="pqc-visual__label">L'angle mort</div>
    <svg width="100%" height="180" viewBox="0 0 660 180">
      <!-- Left block: benchmarks -->
      <rect x="20" y="30" width="170" height="120" rx="8" fill="none" stroke="#2a2a32" stroke-width="1"/>
      <text x="105" y="22" text-anchor="middle" class="mono">BENCHMARKS</text>
      <text x="105" y="65" text-anchor="middle" class="label">Justesse</text>
      <text x="105" y="85" text-anchor="middle" class="label">du modèle</text>
      <text x="105" y="115" text-anchor="middle" class="label-bright">MMLU · HumanEval</text>
      <text x="105" y="135" text-anchor="middle" class="label-bright">Arena ELO</text>
      <!-- Right block: UX -->
      <rect x="470" y="30" width="170" height="120" rx="8" fill="none" stroke="#2a2a32" stroke-width="1"/>
      <text x="555" y="22" text-anchor="middle" class="mono">MÉTRIQUES UX</text>
      <text x="555" y="65" text-anchor="middle" class="label">Satisfaction</text>
      <text x="555" y="85" text-anchor="middle" class="label">après coup</text>
      <text x="555" y="115" text-anchor="middle" class="label-bright">CSAT · NPS</text>
      <text x="555" y="135" text-anchor="middle" class="label-bright">Complétion</text>
      <!-- Center: the gap -->
      <rect x="230" y="20" width="200" height="140" rx="10" fill="rgba(74,222,128,0.04)" stroke="#4ade80" stroke-width="1" stroke-dasharray="6 4" opacity="0.6"/>
      <text x="330" y="75" text-anchor="middle" fill="#4ade80" font-size="13" font-weight="500">CE QUI SE PASSE</text>
      <text x="330" y="95" text-anchor="middle" fill="#4ade80" font-size="13" font-weight="500">PENDANT</text>
      <text x="330" y="125" text-anchor="middle" class="label">dynamique · trajectoire</text>
      <text x="330" y="142" text-anchor="middle" class="label">vitalité cognitive</text>
      <!-- Arrows -->
      <line x1="190" y1="90" x2="228" y2="90" stroke="#2a2a32" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="432" y1="90" x2="470" y2="90" stroke="#2a2a32" stroke-width="1" stroke-dasharray="3 3"/>
    </svg>
  </div>

  <p>Pas la conversation comme enchaînement de messages — ça, les benchmarks multi-turn commencent à l'effleurer. La conversation comme espace où deux intelligences, l'une humaine, l'autre artificielle, font émerger quelque chose qu'aucune des deux ne portait seule.</p>

  <p>D'un côté, la justesse d'un modèle isolé. De l'autre, la satisfaction d'un utilisateur après coup. Entre les deux, un espace entier que personne ne regarde : ce qui se passe <em>pendant</em>.</p>

  <p>Les benchmarks héritent d'une logique de test : une entrée, une sortie, un score. Les métriques UX héritent d'une logique de service : un besoin, une réponse, une satisfaction. Les deux présupposent que la valeur d'un échange se situe dans son point d'arrivée.</p>

  <p class="pqc-verdict">L'hypothèse de ce travail est inverse.</p>

  <p>La valeur d'une conversation humain-IA ne se loge pas dans la réponse finale. Elle se loge dans la trajectoire. Dans la manière dont les possibles s'ouvrent, se referment, se reconfigurent au fil de l'échange.</p>

  <!-- Visual: two topologies -->
  <div class="pqc-visual">
    <div class="pqc-visual__label">Deux sessions, même sujet — topologies opposées</div>
    <svg width="100%" height="200" viewBox="0 0 660 200">
      <!-- Left: living graph -->
      <text x="165" y="18" text-anchor="middle" class="label-bright" font-size="12">Conversation vivante</text>
      <circle cx="60" cy="70" r="6" fill="#4ade80" opacity="0.8"/>
      <circle cx="120" cy="45" r="6" fill="#4ade80" opacity="0.7"/>
      <circle cx="100" cy="110" r="6" fill="#f59e0b" opacity="0.7"/>
      <circle cx="170" cy="80" r="6" fill="#4ade80" opacity="0.6"/>
      <circle cx="200" cy="130" r="6" fill="#f59e0b" opacity="0.6"/>
      <circle cx="250" cy="55" r="6" fill="#c8c5be" opacity="0.5"/>
      <circle cx="230" cy="160" r="6" fill="#4ade80" opacity="0.5"/>
      <circle cx="140" cy="155" r="6" fill="#c8c5be" opacity="0.4"/>
      <circle cx="280" cy="110" r="6" fill="#f59e0b" opacity="0.5"/>
      <line x1="60" y1="70" x2="120" y2="45" stroke="#4ade80" stroke-width="1.2" opacity="0.5"/>
      <line x1="60" y1="70" x2="100" y2="110" stroke="#4ade80" stroke-width="1.2" opacity="0.4"/>
      <line x1="120" y1="45" x2="170" y2="80" stroke="#4ade80" stroke-width="1.2" opacity="0.4"/>
      <line x1="100" y1="110" x2="200" y2="130" stroke="#f59e0b" stroke-width="1.2" opacity="0.35"/>
      <line x1="170" y1="80" x2="250" y2="55" stroke="#4ade80" stroke-width="1.2" opacity="0.35"/>
      <line x1="120" y1="45" x2="250" y2="55" stroke="#f59e0b" stroke-width="1.2" opacity="0.3"/>
      <line x1="200" y1="130" x2="280" y2="110" stroke="#4ade80" stroke-width="1.2" opacity="0.3"/>
      <line x1="100" y1="110" x2="140" y2="155" stroke="#f59e0b" stroke-width="1.2" opacity="0.25"/>
      <line x1="200" y1="130" x2="230" y2="160" stroke="#4ade80" stroke-width="1.2" opacity="0.3"/>
      <!-- Divider -->
      <line x1="330" y1="30" x2="330" y2="180" stroke="#2a2a32" stroke-width="1" stroke-dasharray="4 4"/>
      <!-- Right: dead line -->
      <text x="500" y="18" text-anchor="middle" class="label-bright" font-size="12">Conversation linéarisée</text>
      <circle cx="380" cy="100" r="6" fill="#706d65" opacity="0.7"/>
      <circle cx="420" cy="100" r="6" fill="#706d65" opacity="0.65"/>
      <circle cx="460" cy="100" r="6" fill="#706d65" opacity="0.6"/>
      <circle cx="500" cy="100" r="6" fill="#706d65" opacity="0.55"/>
      <circle cx="540" cy="100" r="6" fill="#706d65" opacity="0.5"/>
      <circle cx="580" cy="100" r="6" fill="#706d65" opacity="0.45"/>
      <circle cx="620" cy="100" r="6" fill="#706d65" opacity="0.4"/>
      <line x1="386" y1="100" x2="414" y2="100" stroke="#706d65" stroke-width="1.2" opacity="0.5"/>
      <line x1="426" y1="100" x2="454" y2="100" stroke="#706d65" stroke-width="1.2" opacity="0.45"/>
      <line x1="466" y1="100" x2="494" y2="100" stroke="#706d65" stroke-width="1.2" opacity="0.4"/>
      <line x1="506" y1="100" x2="534" y2="100" stroke="#706d65" stroke-width="1.2" opacity="0.35"/>
      <line x1="546" y1="100" x2="574" y2="100" stroke="#706d65" stroke-width="1.2" opacity="0.3"/>
      <line x1="586" y1="100" x2="614" y2="100" stroke="#706d65" stroke-width="1.2" opacity="0.25"/>
    </svg>
  </div>

  <p>C'est en observant des centaines de sessions sur le canvas de KAIROS — une application de cartographie cognitive, 34 000 lignes de TypeScript, 7 modèles de langage intégrés — qu'un motif est apparu. Certaines conversations produisaient une carte dense, interconnectée, vivante. D'autres produisaient une ligne.</p>

  <p>Les deux types pouvaient avoir des scores de satisfaction élevés. Les deux pouvaient contenir des réponses justes. <strong>La différence n'était pas dans le résultat. Elle était dans la forme de la trajectoire.</strong></p>

  <p>Ce papier propose un cadre pour mesurer cette différence.</p>
</section>

<!-- ==================== SECTION 2 ==================== -->
<section id="cadre" data-reveal="fade-up">
  <div class="section-number">Section 02</div>
  <h2>Cadre — Le modèle quantique, ses correspondances et ses limites</h2>

  <p>Le mot "quantique" est un problème. Appliqué hors de la physique, il sert généralement à rendre flou ce qui était déjà vague. Conscience quantique, management quantique, marketing quantique — dans la plupart des cas, l'emprunt est décoratif.</p>

  <p>Il faut donc dire d'emblée ce que ce cadre n'est pas.</p>

  <p>Il n'y a pas de fonction d'onde dans une conversation. Pas de constante de Planck. On ne prétend pas que le cerveau fonctionne selon la mécanique quantique. Ce qu'on propose est plus modeste : un <strong>isomorphisme partiel</strong>. Trois propriétés quantiques ont un correspondant structurel dans la dynamique d'une conversation — pas par métaphore, mais par analogie de fonctionnement.</p>

  <!-- Visual: three correspondences -->
  <div class="pqc-visual pqc-visual--full">
    <div class="pqc-visual__label">Trois correspondances structurelles</div>
    <svg width="100%" height="360" viewBox="0 0 660 360">
      <!-- Superposition -->
      <rect x="20" y="10" width="200" height="95" rx="8" fill="rgba(74,222,128,0.05)" stroke="#4ade80" stroke-width="1" opacity="0.6"/>
      <text x="30" y="35" fill="#4ade80" font-size="13" font-weight="600">Superposition</text>
      <text x="30" y="58" class="label" font-size="12">Plusieurs états coexistent</text>
      <text x="30" y="76" class="label" font-size="12">avant la mesure</text>
      <text x="260" y="55" class="mono" font-size="16">→</text>
      <rect x="300" y="10" width="340" height="95" rx="8" fill="rgba(74,222,128,0.03)" stroke="#2a2a32" stroke-width="1"/>
      <text x="310" y="35" class="label-bright" font-size="13" font-weight="500">Ouverture</text>
      <text x="310" y="58" class="label" font-size="12">Plusieurs pistes coexistent sur le canvas.</text>
      <text x="310" y="76" class="label" font-size="12">Un message porte plusieurs sens à la fois.</text>
      <!-- Effondrement -->
      <rect x="20" y="130" width="200" height="95" rx="8" fill="rgba(96,165,250,0.05)" stroke="#60a5fa" stroke-width="1" opacity="0.6"/>
      <text x="30" y="155" fill="#60a5fa" font-size="13" font-weight="600">Effondrement</text>
      <text x="30" y="178" class="label" font-size="12">La mesure fixe un état</text>
      <text x="30" y="196" class="label" font-size="12">unique. Irréversible.</text>
      <text x="260" y="175" class="mono" font-size="16">→</text>
      <rect x="300" y="130" width="340" height="95" rx="8" fill="rgba(96,165,250,0.03)" stroke="#2a2a32" stroke-width="1"/>
      <text x="310" y="155" class="label-bright" font-size="13" font-weight="500">Résolution</text>
      <text x="310" y="178" class="label" font-size="12">Une question, un choix ferme une piste.</text>
      <text x="310" y="196" class="label" font-size="12">Connexion d'implication sur le canvas.</text>
      <!-- Intrication -->
      <rect x="20" y="250" width="200" height="95" rx="8" fill="rgba(245,158,11,0.05)" stroke="#f59e0b" stroke-width="1" opacity="0.6"/>
      <text x="30" y="275" fill="#f59e0b" font-size="13" font-weight="600">Intrication</text>
      <text x="30" y="298" class="label" font-size="12">Toucher un élément affecte</text>
      <text x="30" y="316" class="label" font-size="12">un élément distant.</text>
      <text x="260" y="295" class="mono" font-size="16">→</text>
      <rect x="300" y="250" width="340" height="95" rx="8" fill="rgba(245,158,11,0.03)" stroke="#2a2a32" stroke-width="1"/>
      <text x="310" y="275" class="label-bright" font-size="13" font-weight="500">Propagation</text>
      <text x="310" y="298" class="label" font-size="12">Une clarification restructure des nœuds</text>
      <text x="310" y="316" class="label" font-size="12">distants dans le graphe. Effet non-local.</text>
    </svg>
  </div>

  <p>Ce que le cadre quantique éclaire et que les cadres classiques — théorie de l'information, pragmatique linguistique — ne voient pas : <strong>le maintien volontaire de l'ambiguïté comme valeur</strong>, pas comme défaut à corriger.</p>

  <p>Shannon mesure l'information comme réduction d'incertitude. Grice pose des maximes de clarté. L'analyse de discours cherche des structures de cohérence. Le cadre quantique dit l'inverse : une conversation qui élimine l'ambiguïté à chaque tour est efficace, mais elle est stérile. Elle exécute. Elle ne pense pas.</p>

  <div class="pqc-sep"></div>

  <h3>Ce que l'analogie ne couvre pas</h3>

  <p>L'honnêteté impose de tracer la frontière. La non-clonabilité quantique n'a pas de correspondant conversationnel — on peut répéter une idée, la reformuler, la dupliquer. La décohérence a peut-être un écho dans l'essoufflement d'une conversation, mais l'analogie est trop lâche pour être utile. Les inégalités de Bell n'ont tout simplement pas de sens ici.</p>

  <p>L'analogie tient sur trois propriétés. Elle ne tient pas sur le reste. <strong>Ce n'est pas une théorie unifiée du dialogue. C'est une grille de lecture partielle</strong> qui éclaire un phénomène précis — la dynamique d'ouverture et de fermeture des possibles — que les outils existants ne savent pas voir.</p>

  <p>Trois propriétés suffisent si elles mènent à des grandeurs mesurables.</p>
</section>

<!-- ==================== SECTION 3 ==================== -->
<section id="grandeurs" data-reveal="fade-up">
  <div class="section-number">Section 03</div>
  <h2>Grandeurs — Ouverture, Résolution, Propagation, Souveraineté</h2>

  <p>Un cadre théorique qui ne mène pas à des grandeurs mesurables est un essai, pas un outil. Le terrain de mesure est le canvas de KAIROS — pas le flux textuel, mais le graphe qui en résulte. Des nœuds, des connexions, des timestamps. Une topologie.</p>

  <!-- Vocabulary table -->
  <div class="pqc-visual">
    <div class="pqc-visual__label">Quatre grandeurs</div>
    <table>
      <tr><th>Grandeur</th><th>Ce qu'elle mesure</th><th>Source sur le canvas</th></tr>
      <tr><td style="color:#4ade80">Ouverture</td><td>Combien de pistes restent ouvertes</td><td>Nœuds sans implication sortante</td></tr>
      <tr><td style="color:#60a5fa">Résolution</td><td>À quel rythme les pistes se ferment</td><td>Implications / nœuds ajoutés</td></tr>
      <tr><td style="color:#f59e0b">Propagation</td><td>Quand une idée en déplace plusieurs</td><td>Cascades de modification dans le graphe</td></tr>
      <tr><td style="color:#a78bfa">Souveraineté</td><td>Est-ce que l'humain filtre ou subit</td><td>Connexions LLM conservées / proposées</td></tr>
    </table>
  </div>

  <h3>Ouverture</h3>

  <p>Un nœud reste ouvert tant qu'aucune connexion d'implication ne part de lui. Il n'a pas encore mené quelque part. Les connexions de résonance — ces traits ambrés qui relient deux nœuds par écho — ne ferment rien. La résonance corrèle. Elle ne conclut pas.</p>

  <p>Une ouverture à 1 : rien n'est résolu. Si ça dure, c'est du bruit. Une ouverture à 0 : tout est résolu. C'est une conversation fermée — plus rien ne peut émerger.</p>

  <!-- Visual: breathing curve -->
  <div class="pqc-visual">
    <div class="pqc-visual__label">Ouverture — signature saine : la respiration</div>
    <svg width="100%" height="140" viewBox="0 0 660 140">
      <text x="10" y="20" class="mono">1.0</text>
      <text x="10" y="75" class="mono">0.5</text>
      <text x="10" y="128" class="mono">0.0</text>
      <line x1="45" y1="12" x2="45" y2="130" stroke="#2a2a32" stroke-width="1"/>
      <line x1="45" y1="130" x2="640" y2="130" stroke="#2a2a32" stroke-width="1"/>
      <!-- Breathing path -->
      <path d="M 45 50 Q 95 25, 140 45 Q 185 65, 230 35 Q 275 15, 320 55 Q 365 85, 410 40 Q 455 10, 500 50 Q 545 80, 590 38 Q 615 25, 640 45"
            fill="none" stroke="#4ade80" stroke-width="2" opacity="0.8" class="pqc-breath-line"/>
      <!-- Glow -->
      <path d="M 45 50 Q 95 25, 140 45 Q 185 65, 230 35 Q 275 15, 320 55 Q 365 85, 410 40 Q 455 10, 500 50 Q 545 80, 590 38 Q 615 25, 640 45"
            fill="none" stroke="#4ade80" stroke-width="6" opacity="0.08" class="pqc-breath-line"/>
      <!-- "jamais 0" annotation -->
      <line x1="45" y1="130" x2="640" y2="130" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 4" opacity="0.3"/>
      <text x="605" y="125" class="mono" fill="#ef4444" font-size="9" opacity="0.6">jamais 0</text>
      <text x="340" y="128" text-anchor="middle" class="mono">temps →</text>
    </svg>
  </div>

  <h3>Résolution</h3>

  <p>Chaque connexion d'implication est un acte de résolution. Une résolution constante — chaque nœud immédiatement connecté au précédent — produit une ligne droite. Une résolution nulle produit un nuage. Ce qu'on cherche, c'est l'irrégularité : des phases d'exploration suivies de bursts de cristallisation.</p>

  <!-- Visual: burst pattern -->
  <div class="pqc-visual">
    <div class="pqc-visual__label">Résolution — signature saine : les bursts</div>
    <svg width="100%" height="130" viewBox="0 0 660 130">
      <line x1="45" y1="10" x2="45" y2="115" stroke="#2a2a32" stroke-width="1"/>
      <line x1="45" y1="115" x2="640" y2="115" stroke="#2a2a32" stroke-width="1"/>
      <!-- Bars: irregular bursts -->
      <rect x="60" y="85" width="12" height="30" rx="2" fill="#60a5fa" opacity="0.25"/>
      <rect x="85" y="90" width="12" height="25" rx="2" fill="#60a5fa" opacity="0.2"/>
      <rect x="120" y="70" width="12" height="45" rx="2" fill="#60a5fa" opacity="0.35"/>
      <!-- Burst 1 -->
      <rect x="155" y="25" width="12" height="90" rx="2" fill="#60a5fa" opacity="0.9"/>
      <rect x="172" y="35" width="12" height="80" rx="2" fill="#60a5fa" opacity="0.8"/>
      <rect x="189" y="40" width="12" height="75" rx="2" fill="#60a5fa" opacity="0.7"/>
      <!-- Calm -->
      <rect x="225" y="90" width="12" height="25" rx="2" fill="#60a5fa" opacity="0.2"/>
      <rect x="250" y="85" width="12" height="30" rx="2" fill="#60a5fa" opacity="0.2"/>
      <rect x="275" y="92" width="12" height="23" rx="2" fill="#60a5fa" opacity="0.15"/>
      <rect x="300" y="88" width="12" height="27" rx="2" fill="#60a5fa" opacity="0.2"/>
      <rect x="325" y="95" width="12" height="20" rx="2" fill="#60a5fa" opacity="0.15"/>
      <!-- Burst 2 -->
      <rect x="365" y="20" width="12" height="95" rx="2" fill="#60a5fa" opacity="0.95"/>
      <rect x="382" y="30" width="12" height="85" rx="2" fill="#60a5fa" opacity="0.85"/>
      <rect x="399" y="42" width="12" height="73" rx="2" fill="#60a5fa" opacity="0.7"/>
      <rect x="416" y="50" width="12" height="65" rx="2" fill="#60a5fa" opacity="0.55"/>
      <!-- Calm -->
      <rect x="452" y="90" width="12" height="25" rx="2" fill="#60a5fa" opacity="0.2"/>
      <rect x="477" y="88" width="12" height="27" rx="2" fill="#60a5fa" opacity="0.2"/>
      <rect x="502" y="93" width="12" height="22" rx="2" fill="#60a5fa" opacity="0.15"/>
      <!-- Burst 3 -->
      <rect x="540" y="32" width="12" height="83" rx="2" fill="#60a5fa" opacity="0.85"/>
      <rect x="557" y="45" width="12" height="70" rx="2" fill="#60a5fa" opacity="0.7"/>
      <!-- Labels -->
      <text x="172" y="15" text-anchor="middle" class="mono" fill="#60a5fa" font-size="9">burst</text>
      <text x="390" y="13" text-anchor="middle" class="mono" fill="#60a5fa" font-size="9">burst</text>
      <text x="548" y="25" text-anchor="middle" class="mono" fill="#60a5fa" font-size="9">burst</text>
      <text x="340" y="113" text-anchor="middle" class="mono">temps →</text>
    </svg>
  </div>

  <h3>Propagation</h3>

  <p>Quand un nœud est connecté ou modifié, combien de nœuds distants sont affectés ? Une propagation de 1 : chaque action reste locale. Supérieure à 1 : une action a des effets à distance — c'est le signe d'une percée. Ces moments sont rares. C'est ce qui les rend précieux.</p>

  <!-- Visual: propagation cascade -->
  <div class="pqc-visual">
    <div class="pqc-visual__label">Propagation — un nœud modifié restructure un cluster distant</div>
    <svg width="100%" height="180" viewBox="0 0 660 180">
      <!-- Origin node -->
      <circle cx="80" cy="90" r="9" fill="#f59e0b" opacity="0.9"/>
      <circle cx="80" cy="90" r="9" fill="none" stroke="#f59e0b" stroke-width="1.5">
        <animate attributeName="r" values="9;24" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <text x="80" y="128" text-anchor="middle" class="mono" fill="#f59e0b" font-size="9">modifié</text>
      <!-- Wave lines -->
      <path d="M 110 90 Q 140 70, 170 90" fill="none" stroke="#f59e0b" stroke-width="1" opacity="0.3"/>
      <path d="M 130 90 Q 160 60, 190 90" fill="none" stroke="#f59e0b" stroke-width="1" opacity="0.2"/>
      <path d="M 150 90 Q 180 55, 210 90" fill="none" stroke="#f59e0b" stroke-width="1" opacity="0.15"/>
      <!-- Direct neighbors (distance 1) -->
      <circle cx="170" cy="55" r="5" fill="#706d65" opacity="0.6"/>
      <circle cx="160" cy="120" r="5" fill="#706d65" opacity="0.6"/>
      <text x="275" y="165" text-anchor="middle" class="mono" font-size="9">distance 1</text>
      <!-- Distance 2 cluster — affected -->
      <circle cx="320" cy="50" r="7" fill="#f59e0b" opacity="0.5"/>
      <circle cx="350" cy="80" r="7" fill="#f59e0b" opacity="0.45"/>
      <circle cx="310" cy="105" r="7" fill="#f59e0b" opacity="0.4"/>
      <line x1="320" y1="50" x2="350" y2="80" stroke="#f59e0b" stroke-width="1" opacity="0.3"/>
      <line x1="350" y1="80" x2="310" y2="105" stroke="#f59e0b" stroke-width="1" opacity="0.25"/>
      <line x1="310" y1="105" x2="320" y2="50" stroke="#f59e0b" stroke-width="1" opacity="0.2"/>
      <text x="327" y="140" text-anchor="middle" class="mono" fill="#f59e0b" font-size="9">affecté (d=2)</text>
      <!-- Distance 3 cluster — affected -->
      <circle cx="500" cy="45" r="6" fill="#f59e0b" opacity="0.3"/>
      <circle cx="530" cy="70" r="6" fill="#f59e0b" opacity="0.28"/>
      <circle cx="490" cy="90" r="6" fill="#f59e0b" opacity="0.25"/>
      <circle cx="540" cy="110" r="6" fill="#f59e0b" opacity="0.22"/>
      <line x1="500" y1="45" x2="530" y2="70" stroke="#f59e0b" stroke-width="1" opacity="0.2"/>
      <line x1="530" y1="70" x2="540" y2="110" stroke="#f59e0b" stroke-width="1" opacity="0.15"/>
      <line x1="490" y1="90" x2="530" y2="70" stroke="#f59e0b" stroke-width="1" opacity="0.15"/>
      <text x="515" y="140" text-anchor="middle" class="mono" fill="#f59e0b" font-size="9">affecté (d=3)</text>
      <!-- Dashed connection lines -->
      <line x1="170" y1="55" x2="320" y2="50" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 4" opacity="0.2"/>
      <line x1="350" y1="80" x2="490" y2="90" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 4" opacity="0.15"/>
    </svg>
  </div>

  <h3>Souveraineté</h3>

  <p>En mode assisté, le LLM propose des nœuds et des connexions. L'humain peut accepter, modifier, ou rejeter. La souveraineté mesure ce ratio. Élevée (tout accepté) : l'humain ne filtre plus — il suit. Nulle (tout rejeté) : pas de collaboration. Le corridor sain est entre les deux.</p>

  <!-- Visual: sovereignty spectrum -->
  <div class="pqc-visual">
    <div class="pqc-visual__label">Souveraineté — le corridor</div>
    <svg width="100%" height="100" viewBox="0 0 660 100">
      <!-- Track -->
      <rect x="50" y="40" width="560" height="8" rx="4" fill="#18181e"/>
      <!-- Danger zone left -->
      <rect x="50" y="40" width="100" height="8" rx="4" fill="#ef4444" opacity="0.15"/>
      <!-- Sweet spot -->
      <rect x="200" y="38" width="230" height="12" rx="6" fill="#4ade80" opacity="0.12" stroke="#4ade80" stroke-width="1" opacity="0.3"/>
      <!-- Danger zone right -->
      <rect x="510" y="40" width="100" height="8" rx="4" fill="#ef4444" opacity="0.15"/>
      <!-- Labels -->
      <text x="100" y="30" text-anchor="middle" class="mono" fill="#ef4444" font-size="9">tout rejeté</text>
      <text x="100" y="75" text-anchor="middle" class="label" font-size="10">conversation</text>
      <text x="100" y="88" text-anchor="middle" class="label" font-size="10">morte</text>
      <text x="315" y="28" text-anchor="middle" class="mono" fill="#4ade80" font-size="10">filtrage actif</text>
      <text x="315" y="78" text-anchor="middle" fill="#4ade80" font-size="11" font-weight="500">l'humain pense</text>
      <text x="560" y="30" text-anchor="middle" class="mono" fill="#ef4444" font-size="9">tout accepté</text>
      <text x="560" y="75" text-anchor="middle" class="label" font-size="10">soumission</text>
      <text x="560" y="88" text-anchor="middle" class="label" font-size="10">cognitive</text>
      <!-- Cursor -->
      <circle cx="290" cy="44" r="7" fill="#4ade80" opacity="0.9"/>
      <circle cx="290" cy="44" r="7" fill="none" stroke="#4ade80" stroke-width="1">
        <animate attributeName="r" values="7;14" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  </div>

  <p>La souveraineté est la seule des quatre grandeurs qui ne décrit pas la dynamique du sens. Elle décrit la dynamique du pouvoir. <strong>Ce n'est pas un concept moral. C'est une grandeur mesurable.</strong></p>
</section>

<!-- ==================== SECTION 4 ==================== -->
<section id="transition" data-reveal="fade-up">
  <div class="section-number">Section 04</div>
  <h2>Transition — La linéarisation comme changement de régime</h2>

  <p>Il y a un moment où une conversation meurt. Pas progressivement — d'un coup. Un échange qui explorait, ramifiait, maintenait des pistes ouvertes, bascule en quelques tours dans un mode séquentiel. Question, réponse. Question, réponse. Le canvas cesse de s'étendre latéralement. Il s'allonge en ligne.</p>

  <p>Ce basculement n'est pas une dégradation graduelle. C'est une <strong>transition de phase</strong>.</p>

  <!-- Visual: phase transition -->
  <div class="pqc-visual pqc-visual--full">
    <div class="pqc-visual__label">Transition de phase — l'ouverture s'effondre au seuil</div>
    <svg width="100%" height="220" viewBox="0 0 660 220">
      <!-- Axes -->
      <line x1="60" y1="20" x2="60" y2="190" stroke="#2a2a32" stroke-width="1"/>
      <line x1="60" y1="190" x2="620" y2="190" stroke="#2a2a32" stroke-width="1"/>
      <text x="15" y="30" class="mono" font-size="9">ouverture</text>
      <text x="580" y="208" class="mono" font-size="9">linéarisation →</text>
      <!-- Quantum regime -->
      <rect x="60" y="20" width="260" height="170" fill="rgba(74,222,128,0.03)"/>
      <text x="190" y="210" text-anchor="middle" class="mono" fill="#4ade80" font-size="10">régime quantique</text>
      <!-- Classical regime -->
      <rect x="380" y="20" width="240" height="170" fill="rgba(239,68,68,0.03)"/>
      <text x="500" y="210" text-anchor="middle" class="mono" fill="#ef4444" font-size="10">régime classique</text>
      <!-- Threshold line -->
      <line x1="320" y1="20" x2="320" y2="190" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>
      <text x="320" y="15" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="500">seuil</text>
      <!-- Curve: plateau then cliff -->
      <path d="M 70 55 Q 100 50, 130 60 Q 160 70, 190 52 Q 220 38, 250 58 Q 280 70, 300 50 Q 310 42, 320 80 Q 330 140, 340 165 Q 360 180, 400 182 L 600 184"
            fill="none" stroke="#4ade80" stroke-width="2.5" opacity="0.9"/>
      <!-- Glow on quantum part -->
      <path d="M 70 55 Q 100 50, 130 60 Q 160 70, 190 52 Q 220 38, 250 58 Q 280 70, 300 50"
            fill="none" stroke="#4ade80" stroke-width="8" opacity="0.06"/>
      <!-- Flat dead line -->
      <path d="M 340 165 Q 360 180, 400 182 L 600 184"
            fill="none" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
      <!-- Friction attempt arrow -->
      <path d="M 450 182 L 450 140" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.5"/>
      <polygon points="446,145 450,135 454,145" fill="#f59e0b" opacity="0.5"/>
      <text x="450" y="130" text-anchor="middle" class="mono" fill="#f59e0b" font-size="9">friction ?</text>
      <!-- Absorbed -->
      <path d="M 450 140 Q 455 150, 455 170 Q 455 178, 460 182" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3" opacity="0.3"/>
      <text x="500" y="160" class="mono" fill="#706d65" font-size="8">absorbée</text>
    </svg>
  </div>

  <p>En physique, l'eau passe de liquide à solide. Elle n'est pas "un peu plus solide" en refroidissant. Il y a un seuil. Dans une conversation, la linéarisation fonctionne de la même manière. Passé un certain point, l'ouverture chute. La résolution devient constante. La propagation tombe à 1. Le système a changé de nature.</p>

  <p>Ce qui rend cette transition dangereuse, c'est qu'elle est souvent <strong>invisible de l'intérieur</strong>. L'utilisateur continue de poser des questions. L'IA continue de répondre. Les métriques de satisfaction restent hautes. Mais sur le canvas, la topologie a changé. Ce n'est plus un graphe. C'est une liste.</p>

  <p>KAIROS a déjà un mécanisme qui y répond : quand la jauge d'oxygène descend sous 30, le système injecte de la friction — une question divergente, une provocation. Relu à travers ce cadre, c'est une tentative de réinjection de superposition. Mais dans beaucoup de sessions, la ligne absorbe la perturbation. Le régime classique résiste.</p>

  <p class="pqc-verdict">Empêcher la chute vaut mieux que tenter la relance.</p>
</section>

<!-- ==================== SECTION 5 ==================== -->
<section id="observateur" data-reveal="fade-up">
  <div class="section-number">Section 05</div>
  <h2>Observateur — Le problème humain/IA et la souveraineté cognitive</h2>

  <p>En physique quantique, l'observateur n'est pas passif. C'est son acte de mesure qui fait effondrer la superposition. Dans une conversation humain-IA en mode assisté, ce partage se complique : le modèle de langage génère les nœuds <em>et</em> propose les connexions. Il peuple la superposition et la fait effondrer. Il est à la fois le système et l'observateur.</p>

  <p class="pqc-verdict">C'est un problème.</p>

  <!-- Visual: double observer -->
  <div class="pqc-visual pqc-visual--full">
    <div class="pqc-visual__label">Le problème de l'observateur double</div>
    <svg width="100%" height="300" viewBox="0 0 660 300">
      <!-- Human side -->
      <rect x="30" y="30" width="260" height="240" rx="12" fill="none" stroke="#a78bfa" stroke-width="1.5" opacity="0.4"/>
      <text x="160" y="22" text-anchor="middle" fill="#a78bfa" font-size="13" font-weight="600">HUMAIN</text>
      <text x="55" y="70" class="label-bright" font-size="12">Choisit la direction</text>
      <text x="55" y="90" class="label" font-size="11">Sujet, questions, bifurcations</text>
      <text x="55" y="108" class="mono" fill="#a78bfa" font-size="9">→ contrôle le cadre</text>
      <text x="55" y="148" class="label-bright" font-size="12">Accepte ou refuse</text>
      <text x="55" y="168" class="label" font-size="11">Conserve, modifie, supprime</text>
      <text x="55" y="186" class="mono" fill="#a78bfa" font-size="9">→ mesure ultime</text>
      <text x="55" y="226" class="label-bright" font-size="12">Réorganise</text>
      <text x="55" y="246" class="label" font-size="11">Déplace, regroupe, crée de l'espace</text>
      <text x="55" y="264" class="mono" fill="#a78bfa" font-size="9">→ vision globale</text>
      <!-- AI side -->
      <rect x="370" y="30" width="260" height="240" rx="12" fill="none" stroke="#60a5fa" stroke-width="1.5" opacity="0.4"/>
      <text x="500" y="22" text-anchor="middle" fill="#60a5fa" font-size="13" font-weight="600">LLM</text>
      <text x="395" y="70" class="label-bright" font-size="12">Génère les nœuds</text>
      <text x="395" y="90" class="label" font-size="11">Idées, concepts, propositions</text>
      <text x="395" y="108" class="mono" fill="#60a5fa" font-size="9">→ peuple l'espace</text>
      <text x="395" y="148" class="label-bright" font-size="12">Propose les connexions</text>
      <text x="395" y="168" class="label" font-size="11">Implications, résonances</text>
      <text x="395" y="186" class="mono" fill="#60a5fa" font-size="9">→ propose des mesures</text>
      <text x="395" y="226" class="label-bright" font-size="12">Horizon local</text>
      <text x="395" y="246" class="label" font-size="11">Dernier message, contexte récent</text>
      <text x="395" y="264" class="mono" fill="#60a5fa" font-size="9">→ cohérence locale</text>
      <!-- Center: tension zone -->
      <line x1="310" y1="60" x2="350" y2="60" stroke="#4ade80" stroke-width="1.5" opacity="0.4"/>
      <line x1="310" y1="140" x2="350" y2="140" stroke="#4ade80" stroke-width="1.5" opacity="0.4"/>
      <line x1="310" y1="220" x2="350" y2="220" stroke="#4ade80" stroke-width="1.5" opacity="0.4"/>
      <text x="330" y="290" text-anchor="middle" fill="#4ade80" font-size="12" font-weight="500">← tension productive →</text>
    </svg>
  </div>

  <p>L'humain observe au niveau global — la forme du graphe, les clusters, les vides. Le LLM observe au niveau local — le dernier message, le contexte récent. C'est dans l'écart entre ces deux niveaux que la pensée se joue. L'IA propose du local cohérent. L'humain valide ou invalide par rapport à un global que l'IA ne voit pas.</p>

  <div class="pqc-sep"></div>

  <p>Le danger n'est pas l'IA qui se trompe. <strong>C'est l'IA qui a raison.</strong> Une IA qui propose des connexions pertinentes rend le filtrage humain inutile. L'humain cesse de filtrer non pas parce que l'IA est mauvaise, mais parce qu'elle est suffisamment bonne pour qu'il n'en ait plus besoin.</p>

  <p>La question que ce cadre pose n'est pas "l'IA est-elle utile ?". Tout le monde sait qu'elle l'est.</p>

  <p class="pqc-verdict">La question est : quand l'IA est utile, est-ce que l'humain pense encore ?</p>
</section>

<!-- ==================== SECTION 6 ==================== -->
<section id="donnees" data-reveal="fade-up">
  <div class="section-number">Section 06</div>
  <h2>Données — Protocole, premières mesures, profils providers</h2>

  <p>Un cadre sans terrain reste de la spéculation.</p>

  <!-- Visual: what exists -->
  <div class="pqc-visual">
    <div class="pqc-visual__label">KAIROS — état de l'instrument</div>
    <svg width="100%" height="100" viewBox="0 0 660 100">
      <text x="80" y="40" text-anchor="middle" fill="#4ade80" font-size="28" font-weight="600" font-family="'JetBrains Mono', monospace">34k</text>
      <text x="80" y="62" text-anchor="middle" class="label" font-size="11">lignes TypeScript</text>
      <text x="230" y="40" text-anchor="middle" fill="#60a5fa" font-size="28" font-weight="600" font-family="'JetBrains Mono', monospace">401</text>
      <text x="230" y="62" text-anchor="middle" class="label" font-size="11">tests unitaires</text>
      <text x="380" y="40" text-anchor="middle" fill="#f59e0b" font-size="28" font-weight="600" font-family="'JetBrains Mono', monospace">7</text>
      <text x="380" y="62" text-anchor="middle" class="label" font-size="11">LLM intégrés</text>
      <text x="530" y="40" text-anchor="middle" fill="#a78bfa" font-size="28" font-weight="600" font-family="'JetBrains Mono', monospace">1200+</text>
      <text x="530" y="62" text-anchor="middle" class="label" font-size="11">interactions</text>
      <line x1="30" y1="80" x2="630" y2="80" stroke="#2a2a32" stroke-width="1"/>
      <text x="330" y="95" text-anchor="middle" class="mono" font-size="9">SQLite · Electron · local-first · timestamps par nœud et connexion</text>
    </svg>
  </div>

  <p>Les quatre grandeurs sont extractibles des données existantes. L'ouverture se calcule comme ratio de nœuds actifs sans implication sortante. La résolution sur une fenêtre glissante. La propagation par analyse de cascades temporelles. La souveraineté nécessite de distinguer les connexions proposées par le LLM de celles créées manuellement — partiellement traçable aujourd'hui, explicite dans les prochaines versions.</p>

  <h3>Trois niveaux d'observation</h3>

  <!-- Visual: three levels -->
  <div class="pqc-visual">
    <div class="pqc-visual__label">Protocole progressif</div>
    <svg width="100%" height="200" viewBox="0 0 660 200">
      <!-- Level 1 -->
      <rect x="20" y="10" width="195" height="170" rx="8" fill="rgba(74,222,128,0.03)" stroke="#2a2a32" stroke-width="1"/>
      <text x="117" y="38" text-anchor="middle" fill="#4ade80" font-size="12" font-weight="500">Rétrospectif</text>
      <text x="35" y="65" class="label" font-size="11">Extraire les 4 grandeurs</text>
      <text x="35" y="82" class="label" font-size="11">des sessions existantes.</text>
      <text x="35" y="100" class="label" font-size="11">Tracer les courbes.</text>
      <text x="35" y="125" class="mono" font-size="9">Montrer que les grandeurs</text>
      <text x="35" y="140" class="mono" font-size="9">sont calculables</text>
      <text x="35" y="165" class="mono" fill="#4ade80" font-size="9">→ accessible maintenant</text>
      <!-- Level 2 -->
      <rect x="232" y="10" width="195" height="170" rx="8" fill="rgba(96,165,250,0.03)" stroke="#2a2a32" stroke-width="1"/>
      <text x="330" y="38" text-anchor="middle" fill="#60a5fa" font-size="12" font-weight="500">Comparatif</text>
      <text x="247" y="65" class="label" font-size="11">Même sujet, même durée,</text>
      <text x="247" y="82" class="label" font-size="11">plusieurs LLM.</text>
      <text x="247" y="100" class="label" font-size="11">Comparer les profils.</text>
      <text x="247" y="125" class="mono" font-size="9">Montrer que les signatures</text>
      <text x="247" y="140" class="mono" font-size="9">varient entre providers</text>
      <text x="247" y="165" class="mono" fill="#60a5fa" font-size="9">→ prochain objectif</text>
      <!-- Level 3 -->
      <rect x="444" y="10" width="195" height="170" rx="8" fill="rgba(167,139,250,0.03)" stroke="#2a2a32" stroke-width="1"/>
      <text x="542" y="38" text-anchor="middle" fill="#a78bfa" font-size="12" font-weight="500">Extensible</text>
      <text x="459" y="65" class="label" font-size="11">Autres utilisateurs.</text>
      <text x="459" y="82" class="label" font-size="11">Répondre à l'objection</text>
      <text x="459" y="100" class="label" font-size="11">N=1.</text>
      <text x="459" y="125" class="mono" font-size="9">Montrer que les signatures</text>
      <text x="459" y="140" class="mono" font-size="9">se retrouvent au-delà</text>
      <text x="459" y="155" class="mono" font-size="9">d'un seul opérateur</text>
      <text x="459" y="175" class="mono" fill="#a78bfa" font-size="9">→ horizon</text>
    </svg>
  </div>

  <blockquote>
    <p>L'auteur est à la fois le chercheur, l'utilisateur et le développeur. La circularité n'est pas un accident. C'est la condition du travail. La reconnaître explicitement est le minimum épistémique. Prétendre s'en extraire serait la véritable erreur.</p>
  </blockquote>
</section>

<!-- ==================== SECTION 7 ==================== -->
<section id="discussion" data-reveal="fade-up">
  <div class="section-number">Section 07</div>
  <h2>Discussion — Ce que le cadre éclaire, ce qu'il ne peut pas voir</h2>

  <p>Ce travail propose de regarder une conversation humain-IA non pas comme une série de questions-réponses à évaluer, mais comme un système dynamique dont la vitalité se mesure par la forme de sa trajectoire.</p>

  <p>Quatre grandeurs en découlent. Trois décrivent la dynamique du sens — ouverture, résolution, propagation. Une décrit la dynamique du pouvoir — souveraineté. C'est cette dernière qui porte la contribution la plus distincte.</p>

  <div class="pqc-sep"></div>

  <h3>Ce que le cadre ne voit pas</h3>

  <p>Il ne voit pas le contenu. Quatre grandeurs topologiques ne disent rien sur la profondeur d'un argument. Une conversation peut avoir une signature vivante et être creuse.</p>

  <p>Il ne voit pas l'émotion. Un pic de propagation peut correspondre à une percée ou à une confusion. La forme est la même. L'expérience ne l'est pas.</p>

  <p>Il ne voit pas ce qui se passe hors du canvas. L'humain pense aussi entre les sessions. Les grandeurs mesurent une fenêtre d'observation, pas un processus complet.</p>

  <div class="pqc-sep"></div>

  <h3>Ce que le cadre ouvre</h3>

  <p><strong>Direction instrumentale</strong> — intégrer les grandeurs dans KAIROS sous la jauge d'oxygène. La jauge dit "attention, ça s'essouffle". Les grandeurs disent pourquoi.</p>

  <p><strong>Direction comparative</strong> — profiler les LLM non pas sur leur justesse, mais sur leur signature conversationnelle. Pas "ce que le modèle sait faire" mais "ce que le modèle fait à la pensée de celui qui l'utilise".</p>

  <p><strong>Direction théorique</strong> — le seuil de transition de phase est-il identifiable ? Si oui, l'enjeu n'est plus de rendre l'IA plus performante. C'est de concevoir des interactions qui maintiennent l'ouverture au-dessus du seuil.</p>

  <div class="pqc-sep"></div>

  <p>Les métriques actuelles mesurent l'entrée et la sortie. Entre les deux, un espace entier échappe à l'instrument. Cet espace — ce qui se passe pendant que deux intelligences pensent ensemble — est l'objet de ce cadre.</p>

  <p class="pqc-verdict">Ce n'est pas une théorie achevée. C'est une mesure qui commence.</p>
</section>
