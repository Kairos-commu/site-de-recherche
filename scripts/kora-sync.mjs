#!/usr/bin/env node
/**
 * Synchronise l'état public de Kora depuis sa SOURCE : le dépôt voisin ~/kairos/kora
 * (github.com/Kairos-commu/kora), tel qu'il est COMMITÉ — `git show HEAD:<fichier>`, jamais la
 * copie de travail : une proposition locale non commitée n'arrive pas sur le site.
 *
 *   state.json       → src/_data/koraEtat.json   (identique, octet pour octet)
 *   spec/tools.json  → src/_data/koraTools.json  (identique ; paliers de la page État de Kora)
 *   GUIDE.md         → src/_data/koraGuide.json  (révisions + addenda COLLÉS dans le guide ;
 *                                                  addenda/*.md n'est jamais lu : ce sont des
 *                                                  propositions tant qu'elles ne sont pas collées)
 *
 *   npm run kora:sync
 *
 * Ne modifie aucun chiffre : ce qui est lu n'est pas tapé deux fois.
 */
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const KORA = join(homedir(), 'kairos', 'kora');
if (!existsSync(join(KORA, '.git'))) {
  console.error(`✗ ${KORA} introuvable — clone github.com/Kairos-commu/kora à côté du site.`);
  process.exit(1);
}
const git = (...args) => execFileSync('git', ['-C', KORA, ...args], { encoding: 'utf8' });
const show = (f) => git('show', `HEAD:${f}`);

const head = git('rev-parse', '--short', 'HEAD').trim();
let enAvance = '';
try { enAvance = git('rev-list', '--count', '@{u}..HEAD').trim(); } catch { /* pas d'amont */ }
if (enAvance && enAvance !== '0') {
  console.log(`⚠️  kora : ${enAvance} commit(s) non poussé(s) — le site publierait un état absent de GitHub.`);
}

function ecrire(out, contenu) {
  const avant = existsSync(out) ? readFileSync(out, 'utf8') : null;
  writeFileSync(out, contenu);
  console.log(`${avant === contenu ? '=' : '✎'} ${out}`);
}

// 1. état et outils : copies exactes
const state = show('state.json');
JSON.parse(state);
ecrire('src/_data/koraEtat.json', state);
const tools = show('spec/tools.json');
JSON.parse(tools);
ecrire('src/_data/koraTools.json', tools);

// 2. le guide : ce qui y est collé, rien d'autre
const MOIS = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8,
  September: 9, October: 10, November: 11, December: 12 };
const iso = (j, m, a) => `${a}-${String(MOIS[m] || 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
const guide = show('GUIDE.md');

const revisions = [];
const blocRev = guide.split(/^## Revisions\s*$/m)[1] || '';
for (const m of blocRev.matchAll(/^- \*\*(\d{1,2}) (\w+) (\d{4})\*\* — ([\s\S]*?)(?=^- \*\*|$(?![\s\S]))/gm)) {
  revisions.push({ date: iso(m[1], m[2], m[3]), texte: m[4].replace(/\s+/g, ' ').trim() });
}

const addenda = [];
for (const sec of guide.split(/^(?=## \d+\. )/m)) {
  const t = sec.match(/^## (\d+)\. ([^\n]+)/);
  if (!t) continue;
  for (const m of sec.matchAll(/\*\*Addendum, (\d{1,2}) (\w+) (\d{4})\.\*\*\s*([^\n]+(?:\n(?!\n)[^\n]+)*)/g)) {
    const premiere = m[4].replace(/\s+/g, ' ').split(/(?<=\.)\s/)[0];
    addenda.push({ date: iso(m[1], m[2], m[3]), section: Number(t[1]), titreSection: t[2].trim(), phrase: premiere });
  }
}
addenda.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.section - b.section));
const dernier = addenda.length ? addenda[0].date : null;

ecrire('src/_data/koraGuide.json', JSON.stringify({
  commit: head,
  revisions,
  dernierAddendum: dernier,
  addenda: dernier ? addenda.filter((a) => a.date === dernier) : []
}, null, 2) + '\n');

// la page État de Kora est en français : chaque révision / addendum affiché attend sa traduction
const FR = 'src/_data/koraGuideFr.json';
if (existsSync(FR)) {
  const fr = JSON.parse(readFileSync(FR, 'utf8'));
  const manque = [];
  const derniere = revisions[revisions.length - 1];
  if (!dernier && derniere && !fr.revisions?.[derniere.date]) manque.push(`révision ${derniere.date}`);
  for (const a of (dernier ? addenda.filter((x) => x.date === dernier) : [])) {
    if (!fr.addenda?.[`${a.date}#${a.section}`]) manque.push(`addendum ${a.date}#${a.section}`);
  }
  if (manque.length) console.log(`⚠️  à traduire dans ${FR} : ${manque.join(', ')} (sinon la page affiche l'anglais)`);
}

console.log(`kora ${head} — ${revisions.length} révision(s), ` +
  (dernier ? `dernier addendum collé : ${dernier}` : 'aucun addendum collé dans GUIDE.md'));
