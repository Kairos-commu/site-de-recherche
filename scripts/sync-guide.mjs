#!/usr/bin/env node
/**
 * Synchronise la note « Building a local agent you can trust » depuis sa SOURCE : le dépôt
 * public voisin (~/kairos/kora, github.com/Kairos-commu/kora, fichier GUIDE.md). Le site n'est
 * qu'un rendu — même logique que koraEtat.json pour les chiffres : ce qui est lu n'est pas
 * tapé deux fois. Le marqueur `<!-- state -->` du guide (suivi de sa phrase statique) devient
 * ici le bandeau d'état njk lu dans koraEtat.json ; les liens absolus vers le site redeviennent
 * relatifs ; dateModified = la date de la dernière ligne de « Revisions ».
 *
 *   npm run guide:sync      # réécrit src/notes/building-a-local-agent-you-can-trust.md
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const SRC = join(homedir(), 'kairos', 'kora', 'GUIDE.md');
const OUT = 'src/notes/building-a-local-agent-you-can-trust.md';
if (!existsSync(SRC)) { console.error(`✗ ${SRC} introuvable — clone github.com/Kairos-commu/kora à côté du site.`); process.exit(1); }

let body = readFileSync(SRC, 'utf8');
body = body.replace(/^# [^\n]*\n\n/, '');
const banner = `<div class="failure">
<p><strong>State as of {{ koraEtat.generatedAt.slice(0, 10) | dateEn }}</strong> (commit <code>{{ koraEtat.app.commit }}</code>, day {{ koraEtat.app.daysSinceStart }} of the project) —
local model <code>{{ koraEtat.kora.model }}</code>, {{ koraEtat.kora.orbsVisible }} orbs ({{ koraEtat.kora.moons }} moons);
{{ koraEtat.capabilities.tools }} tools, {{ koraEtat.capabilities.tools + koraEtat.capabilities.triggers + koraEtat.capabilities.chains + koraEtat.capabilities.selfInitiated }} capabilities in the in-app memo
(research {{ koraEtat.capabilities.byVertex.recherche }}, daily life {{ koraEtat.capabilities.byVertex.quotidien }}, play {{ koraEtat.capabilities.byVertex.jeu }}) —
{{ koraEtat.capabilities.byStatus.eprouve }} seen working in real use, {{ koraEtat.capabilities.byStatus['a-verifier'] }} never re-checked, {{ koraEtat.capabilities.gaps }} listed gaps.{% if koraEtat.usage %}
Since {{ koraEtat.usage.since.slice(0, 10) | dateEn }}: {{ koraEtat.usage.calls.local }} local calls, {{ koraEtat.usage.calls.cloud }} cloud calls, {{ koraEtat.usage.calls.web }} web searches, \${{ koraEtat.usage.costUsd | round(2) }} total.{% endif %}{% if koraEtat.corpus %}
Fine-tune corpus: {{ koraEtat.corpus.exchanges }} exchanges, {{ koraEtat.corpus.accepted + koraEtat.corpus.corrected + koraEtat.corpus.rejected }} judged.{% endif %}
Source and contracts: <a href="https://github.com/Kairos-commu/kora" target="_blank" rel="noopener">github.com/Kairos-commu/kora</a>.</p>
</div>`;
if (!/<!-- state -->\n_[^\n]*_\n/.test(body)) { console.error('✗ marqueur <!-- state --> absent du guide'); process.exit(1); }
body = body.replace(/<!-- state -->\n_[^\n]*_\n/, banner + '\n');
body = body.replace(/\]\(https:\/\/mecanique-invisible\.com\//g, '](/');
const rev = body.match(/## Revisions[\s\S]*?- \*\*(\d{1,2}) (\w+) (\d{4})/);
const months = { January: '01', February: '02', March: '03', April: '04', May: '05', June: '06', July: '07', August: '08', September: '09', October: '10', November: '11', December: '12' };
const modified = rev ? `${rev[3]}-${months[rev[2]] || '01'}-${rev[1].padStart(2, '0')}` : '2026-09-15';
const words = body.replace(/<[^>]+>|\{\{[^}]*\}\}|\{%[^%]*%\}/g, '').split(/\s+/).length;
const fm = `---
title: "Building a local agent you can trust — what we learned, in order"
label: "Guide · living document · source on GitHub"
description: "The decisions behind Kora, a desktop agent on a 12B local model with real access to one person's files, mail and voice — each with the incident that forced it and the mechanism that holds it. Rendered from github.com/Kairos-commu/kora."
published: "2026-09-15"
dateModified: "${modified}"
readingTime: "${Math.max(5, Math.round(words / 200))} min"
keywords:
  - local LLM agent
  - Ollama
  - tool calling
  - agent safety
  - wake word
  - fine-tuning
  - Raspberry Pi
  - gemma
---

`;
writeFileSync(OUT, fm + body);
console.log(`note synchronisée depuis ${SRC} — révision du ${modified}, ~${words} mots`);
