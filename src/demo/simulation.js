/**
 * KAIROS Demo — Simulation engine
 *
 * Simulates LLM operations (DÉVELOPPER, RELIER) without API calls.
 * Analyzes the real graph structure to generate contextually relevant
 * vignettes and connections.
 */

// ── Idea pools organized by conceptual themes ──

const THEMES = {
  cognition: {
    tags: ['#cognition', '#attention', '#memoire', '#perception'],
    ideas: [
      "La charge cognitive augmente avec le nombre de choix",
      "L'attention selective filtre 99% de l'information",
      "La memoire de travail ne retient que 4 elements",
      "Le cerveau predit plus qu'il ne percoit",
      "L'automatisation cognitive libere l'attention",
      "La fatigue decisionnelle erode la qualite des choix",
      "Le biais de confirmation renforce les croyances existantes",
    ],
  },
  friction: {
    tags: ['#friction', '#emergence', '#rupture', '#contradiction'],
    ideas: [
      "La dissonance cognitive est un signal, pas un defaut",
      "L'inconfort intellectuel precede la decouverte",
      "Sans friction, la pensee tourne en boucle",
      "La contradiction ouvre un espace de possibilites",
      "Le conflit cognitif force la reorganisation",
      "L'erreur est un mecanisme d'apprentissage",
      "La resistance au changement protege la coherence",
    ],
  },
  epistemologie: {
    tags: ['#epistemologie', '#savoir', '#representation', '#modele'],
    ideas: [
      "Tout modele est une simplification utile",
      "La connaissance se construit par falsification",
      "Observer modifie ce qui est observe",
      "Les categories mentales structurent la perception",
      "Le langage delimite les frontieres du pensable",
      "Savoir que l'on ne sait pas est le debut du savoir",
      "La metaphore est un outil cognitif, pas un ornement",
    ],
  },
  biais: {
    tags: ['#biais', '#validation', '#illusion', '#systematique'],
    ideas: [
      "Le biais de survie deforme notre vision du succes",
      "L'ancrage mental fixe les estimations au premier chiffre",
      "L'effet de halo generalise une impression locale",
      "La pensee de groupe elimine les voix discordantes",
      "Le biais retrospectif cree une illusion de previsibilite",
      "L'aversion a la perte pese plus que le gain equivalent",
      "Le cadrage determine la decision plus que les faits",
    ],
  },
  productivite: {
    tags: ['#productivite', '#flux', '#systeme', '#organisation'],
    ideas: [
      "Le deep work requiert des blocs de 90 minutes minimum",
      "Le contexte switching coute 23 minutes de recuperation",
      "La loi de Parkinson : le travail remplit le temps disponible",
      "L'optimisation locale peut degrader le systeme global",
      "Les contraintes stimulent la creativite",
      "La simplicite est le resultat d'un effort de clarification",
      "Un systeme fragile masque sa fragilite jusqu'a la rupture",
    ],
  },
  ia: {
    tags: ['#ia', '#llm', '#interaction', '#langage'],
    ideas: [
      "Le LLM genere de la vraisemblance, pas de la verite",
      "L'interaction humain-IA co-construit le sens",
      "Le prompt est un acte de cadrage cognitif",
      "La politesse algorithmique masque l'absence de pensee",
      "L'IA revele les structures implicites du langage",
      "Le dialogue avec l'IA n'est pas une conversation",
      "L'alignement parfait est une forme de servilite",
    ],
  },
  general: {
    tags: ['#concept', '#idee', '#reflexion'],
    ideas: [
      "L'abstraction est un pouvoir et un piege",
      "Nommer change la perception de la chose nommee",
      "La complexite emerge de regles simples",
      "Le tout est different de la somme des parties",
      "Comprendre c'est transformer une surprise en evidence",
      "La pensee lineaire manque les boucles de retroaction",
      "Ce qui resiste a l'explication merite l'exploration",
    ],
  },
};

// ── Connection mechanisms (generated based on vignette content) ──

const MECHANISM_TEMPLATES = {
  implies: [
    "{from} rend possible {to}",
    "{from} est une condition de {to}",
    "Si {from}, alors {to} devient visible",
    "{from} conduit naturellement a {to}",
    "{from} cree le terrain pour {to}",
  ],
  resonance: [
    "{from} et {to} partagent une structure commune",
    "{from} fait echo a {to} par un autre chemin",
    "Tension productive entre {from} et {to}",
    "{from} et {to} se renforcent mutuellement",
    "{from} eclaire {to} sous un angle different",
  ],
};

// ── Friction ideas (injected when graph is too convergent) ──

const FRICTION_IDEAS = [
  { text: "Et si tout ce graphe reposait sur une premisse fausse ?", tags: ['#friction', '#meta'] },
  { text: "L'inverse de cette idee est peut-etre aussi vrai", tags: ['#friction', '#paradoxe'] },
  { text: "Ceci ressemble a une rationalisation a posteriori", tags: ['#friction', '#biais'] },
  { text: "Quel est l'angle mort de ce raisonnement ?", tags: ['#friction', '#epistemologie'] },
  { text: "La coherence du graphe est-elle reelle ou construite ?", tags: ['#friction', '#meta'] },
  { text: "Que dirait quelqu'un qui n'est pas d'accord ?", tags: ['#friction', '#perspective'] },
  { text: "Cette structure de pensee sert-elle la comprehension ou le confort ?", tags: ['#friction', '#critique'] },
];

// ── Helper functions ──

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function shortText(text, max = 25) {
  return text.length > max ? text.substring(0, max) + '...' : text;
}

function generateMechanism(type, fromText, toText) {
  const template = pickRandom(MECHANISM_TEMPLATES[type] || MECHANISM_TEMPLATES.implies);
  return template
    .replace('{from}', shortText(fromText, 30))
    .replace('{to}', shortText(toText, 30));
}

/**
 * Analyze graph to find dominant themes based on existing tags
 */
function analyzeGraphThemes(nodes) {
  const tagCount = {};
  for (const node of nodes) {
    for (const tag of (node.tags || [])) {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    }
  }

  // Match tags to theme pools
  const themeScores = {};
  for (const [themeKey, theme] of Object.entries(THEMES)) {
    let score = 0;
    for (const tag of theme.tags) {
      if (tagCount[tag]) score += tagCount[tag];
    }
    themeScores[themeKey] = score;
  }

  // Sort by score (dominant themes first)
  return Object.entries(themeScores)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);
}

/**
 * Get ideas not already present in the graph
 */
function getUnusedIdeas(nodes, themeKey) {
  const theme = THEMES[themeKey];
  if (!theme) return [];
  const existingTexts = new Set(nodes.map(n => n.text));
  return theme.ideas.filter(idea => !existingTexts.has(idea));
}

/**
 * Calculate graph "convergence" (how interconnected / repetitive it is)
 * Returns a value between 0 (fully divergent) and 1 (fully convergent).
 * The O₂ score is derived as: O₂ = 100 - convergence * 100
 */
export function calculateConvergence(nodes, connections) {
  if (nodes.length < 2) return 0;

  const degree = {};
  for (const n of nodes) degree[n.id] = 0;
  for (const c of connections) {
    degree[c.from] = (degree[c.from] || 0) + 1;
    degree[c.to] = (degree[c.to] || 0) + 1;
  }

  const maxDegree = Math.max(...Object.values(degree), 0);
  const density = connections.length / nodes.length;

  // High density + high max degree = convergent graph
  return Math.min(1, (density * 0.5 + (maxDegree / nodes.length) * 0.5));
}


// ══════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════

/**
 * DÉVELOPPER — Generate 2-3 new vignettes connected to the graph
 *
 * Strategy:
 * 1. Analyze graph themes
 * 2. Pick ideas from related themes (70%) + divergent themes (30%)
 * 3. Connect new vignettes to existing nodes
 * 4. If convergence is high, inject a friction vignette
 */
export function simulateDevelopper(canvas) {
  const { nodes, connections } = canvas.state;
  if (nodes.length === 0) return { vignettes: [], connections: [], log: [] };

  const rankedThemes = analyzeGraphThemes(nodes);
  const convergence = calculateConvergence(nodes, connections);
  const log = [];

  // Decide how many vignettes (2-3)
  const count = nodes.length < 4 ? 3 : 2;
  const newVignettes = [];
  const newConnections = [];

  // Pick source nodes to branch from
  const sourceNodes = pickRandomN(nodes, count);

  for (let i = 0; i < count; i++) {
    const source = sourceNodes[i] || pickRandom(nodes);

    // 70% related theme, 30% divergent
    let themeKey;
    if (Math.random() < 0.7 && rankedThemes.length > 0) {
      // Related: top 2 themes
      themeKey = pickRandom(rankedThemes.slice(0, 2));
    } else {
      // Divergent: random from bottom themes or general
      const divergent = rankedThemes.length > 2 ? rankedThemes.slice(2) : ['general'];
      themeKey = pickRandom(divergent);
    }

    const available = getUnusedIdeas(nodes, themeKey);
    if (available.length === 0) {
      // Fallback to general
      const fallback = getUnusedIdeas(nodes, 'general');
      if (fallback.length === 0) continue;
      themeKey = 'general';
    }

    const ideas = getUnusedIdeas(nodes, themeKey);
    if (ideas.length === 0) continue;

    const idea = pickRandom(ideas);
    const theme = THEMES[themeKey];
    const tags = pickRandomN(theme.tags, Math.min(2, theme.tags.length));

    // Position near source, offset
    const angle = Math.random() * Math.PI * 2;
    const dist = 250 + Math.random() * 150;
    const x = source.x + Math.cos(angle) * dist;
    const y = source.y + Math.sin(angle) * dist;

    newVignettes.push({ text: idea, x, y, tags, sourceId: source.id, sourceText: source.text });
  }

  // Check if we should inject friction (convergence > 0.6)
  const shouldFriction = convergence > 0.6 && nodes.length >= 4;
  if (shouldFriction) {
    const frictionIdea = pickRandom(FRICTION_IDEAS);
    const target = pickRandom(nodes);
    const angle = Math.random() * Math.PI * 2;
    const x = target.x + Math.cos(angle) * 300;
    const y = target.y + Math.sin(angle) * 300;

    newVignettes.push({
      text: frictionIdea.text,
      x, y,
      tags: frictionIdea.tags,
      sourceId: target.id,
      sourceText: target.text,
      isFriction: true,
    });

    log.push({ type: 'friction', text: 'Convergence detectee — friction injectee' });
  }

  // Generate connection info
  for (const v of newVignettes) {
    const connType = v.isFriction ? 'resonance' : (Math.random() < 0.7 ? 'implies' : 'resonance');
    newConnections.push({
      sourceId: v.sourceId,
      type: connType,
      mechanism: generateMechanism(connType, v.sourceText, v.text),
    });
  }

  log.push({
    type: 'success',
    text: `DEVELOPPER → ${newVignettes.length} vignette(s) generee(s)${shouldFriction ? ' (dont 1 friction)' : ''}`,
  });

  return { vignettes: newVignettes, connections: newConnections, log };
}


/**
 * RELIER — Connect orphan vignettes and find missing links
 *
 * Strategy:
 * 1. Find orphan nodes (0 connections)
 * 2. Find weakly connected nodes (1 connection)
 * 3. Create connections based on tag proximity
 */
export function simulateRelier(canvas) {
  const { nodes, connections } = canvas.state;
  if (nodes.length < 2) return { connections: [], log: [] };

  const degree = {};
  for (const n of nodes) degree[n.id] = 0;
  for (const c of connections) {
    degree[c.from] = (degree[c.from] || 0) + 1;
    degree[c.to] = (degree[c.to] || 0) + 1;
  }

  // Find orphans (degree 0) and weak nodes (degree 1)
  const orphans = nodes.filter(n => (degree[n.id] || 0) === 0);
  const weak = nodes.filter(n => (degree[n.id] || 0) === 1);

  const newConnections = [];
  const connectedPairs = new Set(
    connections.map(c => `${c.from}-${c.to}`).concat(connections.map(c => `${c.to}-${c.from}`))
  );

  function canConnect(a, b) {
    if (a.id === b.id) return false;
    return !connectedPairs.has(`${a.id}-${b.id}`);
  }

  function tagSimilarity(a, b) {
    const setA = new Set(a.tags || []);
    const setB = new Set(b.tags || []);
    let common = 0;
    for (const t of setA) if (setB.has(t)) common++;
    const total = setA.size + setB.size;
    return total > 0 ? (common * 2) / total : 0;
  }

  // Connect orphans to their closest tag-neighbor
  for (const orphan of orphans) {
    let bestMatch = null;
    let bestScore = -1;

    for (const other of nodes) {
      if (!canConnect(orphan, other)) continue;
      const score = tagSimilarity(orphan, other) + Math.random() * 0.3;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = other;
      }
    }

    if (bestMatch) {
      const type = bestScore > 0.5 ? 'resonance' : 'implies';
      newConnections.push({
        from: orphan,
        to: bestMatch,
        type,
        mechanism: generateMechanism(type, orphan.text, bestMatch.text),
      });
      connectedPairs.add(`${orphan.id}-${bestMatch.id}`);
      connectedPairs.add(`${bestMatch.id}-${orphan.id}`);
    }
  }

  // Connect some weak nodes to each other
  for (let i = 0; i < weak.length - 1; i += 2) {
    const a = weak[i];
    const b = weak[i + 1];
    if (canConnect(a, b)) {
      const sim = tagSimilarity(a, b);
      const type = sim > 0.3 ? 'resonance' : 'implies';
      newConnections.push({
        from: a,
        to: b,
        type,
        mechanism: generateMechanism(type, a.text, b.text),
      });
      connectedPairs.add(`${a.id}-${b.id}`);
    }
  }

  const log = [];
  if (newConnections.length > 0) {
    log.push({ type: 'success', text: `RELIER → ${newConnections.length} connexion(s) creee(s)` });
  } else {
    log.push({ type: 'info', text: 'Aucun orphelin — le graphe est deja bien connecte.' });
  }

  return { connections: newConnections, log };
}
