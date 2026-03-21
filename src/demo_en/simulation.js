/**
 * KAIROS Demo — Simulation engine
 *
 * Simulates LLM operations (DEVELOP, CONNECT) without API calls.
 * Analyzes the real graph structure to generate contextually relevant
 * cards and connections.
 */

// ── Idea pools organized by conceptual themes ──

const THEMES = {
  cognition: {
    tags: ['#cognition', '#attention', '#memory', '#perception'],
    ideas: [
      "Cognitive load increases with the number of choices",
      "Selective attention filters 99% of information",
      "Working memory holds only 4 items",
      "The brain predicts more than it perceives",
      "Cognitive automation frees up attention",
      "Decision fatigue erodes the quality of choices",
      "Confirmation bias reinforces existing beliefs",
    ],
  },
  friction: {
    tags: ['#friction', '#emergence', '#rupture', '#contradiction'],
    ideas: [
      "Cognitive dissonance is a signal, not a defect",
      "Intellectual discomfort precedes discovery",
      "Without friction, thought loops on itself",
      "Contradiction opens a space of possibilities",
      "Cognitive conflict forces reorganization",
      "Error is a learning mechanism",
      "Resistance to change protects coherence",
    ],
  },
  epistemology: {
    tags: ['#epistemology', '#knowledge', '#representation', '#model'],
    ideas: [
      "Every model is a useful simplification",
      "Knowledge is built through falsification",
      "Observing modifies what is observed",
      "Mental categories structure perception",
      "Language delimits the boundaries of the thinkable",
      "Knowing that you don't know is the beginning of knowledge",
      "Metaphor is a cognitive tool, not an ornament",
    ],
  },
  bias: {
    tags: ['#bias', '#validation', '#illusion', '#systematic'],
    ideas: [
      "Survivorship bias distorts our view of success",
      "Mental anchoring fixes estimates to the first number",
      "The halo effect generalizes a local impression",
      "Groupthink eliminates dissenting voices",
      "Hindsight bias creates an illusion of predictability",
      "Loss aversion weighs more than equivalent gain",
      "Framing determines the decision more than facts",
    ],
  },
  productivity: {
    tags: ['#productivity', '#flow', '#system', '#organization'],
    ideas: [
      "Deep work requires blocks of at least 90 minutes",
      "Context switching costs 23 minutes of recovery",
      "Parkinson's law: work expands to fill the time available",
      "Local optimization can degrade the overall system",
      "Constraints stimulate creativity",
      "Simplicity is the result of a clarification effort",
      "A fragile system hides its fragility until it breaks",
    ],
  },
  ai: {
    tags: ['#ai', '#llm', '#interaction', '#language'],
    ideas: [
      "The LLM generates plausibility, not truth",
      "Human-AI interaction co-constructs meaning",
      "The prompt is an act of cognitive framing",
      "Algorithmic politeness masks the absence of thought",
      "AI reveals the implicit structures of language",
      "Dialogue with AI is not a conversation",
      "Perfect alignment is a form of servility",
    ],
  },
  general: {
    tags: ['#concept', '#idea', '#reflection'],
    ideas: [
      "Abstraction is both a power and a trap",
      "Naming changes the perception of the thing named",
      "Complexity emerges from simple rules",
      "The whole is different from the sum of its parts",
      "Understanding is transforming a surprise into evidence",
      "Linear thinking misses feedback loops",
      "What resists explanation deserves exploration",
    ],
  },
};

// ── Connection mechanisms (generated based on card content) ──

const MECHANISM_TEMPLATES = {
  implies: [
    "{from} makes {to} possible",
    "{from} is a precondition for {to}",
    "If {from}, then {to} becomes visible",
    "{from} naturally leads to {to}",
    "{from} sets the ground for {to}",
  ],
  resonance: [
    "{from} and {to} share a common structure",
    "{from} echoes {to} through another path",
    "Productive tension between {from} and {to}",
    "{from} and {to} reinforce each other",
    "{from} illuminates {to} from a different angle",
  ],
};

// ── Friction ideas (injected when graph is too convergent) ──

const FRICTION_IDEAS = [
  { text: "What if this entire graph rested on a false premise?", tags: ['#friction', '#meta'] },
  { text: "The opposite of this idea might also be true", tags: ['#friction', '#paradox'] },
  { text: "This looks like post-hoc rationalization", tags: ['#friction', '#bias'] },
  { text: "What is the blind spot of this reasoning?", tags: ['#friction', '#epistemology'] },
  { text: "Is the graph's coherence real or constructed?", tags: ['#friction', '#meta'] },
  { text: "What would someone who disagrees say?", tags: ['#friction', '#perspective'] },
  { text: "Does this thought structure serve understanding or comfort?", tags: ['#friction', '#critique'] },
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
 * DEVELOP — Generate 2-3 new cards connected to the graph
 *
 * Strategy:
 * 1. Analyze graph themes
 * 2. Pick ideas from related themes (70%) + divergent themes (30%)
 * 3. Connect new cards to existing nodes
 * 4. If convergence is high, inject a friction card
 */
export function simulateDevelopper(canvas) {
  const { nodes, connections } = canvas.state;
  if (nodes.length === 0) return { vignettes: [], connections: [], log: [] };

  const rankedThemes = analyzeGraphThemes(nodes);
  const convergence = calculateConvergence(nodes, connections);
  const log = [];

  // Decide how many cards (2-3)
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

    log.push({ type: 'friction', text: 'Convergence detected — friction injected' });
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
    text: `DEVELOP → ${newVignettes.length} card(s) generated${shouldFriction ? ' (incl. 1 friction)' : ''}`,
  });

  return { vignettes: newVignettes, connections: newConnections, log };
}


/**
 * CONNECT — Connect orphan cards and find missing links
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
    log.push({ type: 'success', text: `CONNECT → ${newConnections.length} connection(s) created` });
  } else {
    log.push({ type: 'info', text: 'No orphan cards — the graph is already well connected.' });
  }

  return { connections: newConnections, log };
}
