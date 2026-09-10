#!/usr/bin/env node
/**
 * Fraîcheur des captures d'écran KAIROS.
 *
 * Les captures du site ont vieilli d'un mois sans que rien ne le signale :
 * 38 commits de kairos-app avaient passé, dont la refonte de l'identité
 * visuelle de l'assisté. Le site montrait une version qui n'existait plus.
 *
 * Ce script compare le commit noté à la prise avec l'état réel du dépôt
 * voisin, et dit combien de commits touchent le mode assisté — le seul
 * public. Il n'échoue jamais : il informe. Les deux dépôts restent
 * indépendants, rien n'est importé de l'un dans l'autre.
 */

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const APP = join(homedir(), 'kairos', 'kairos-app');
const RELEVE = 'src/_data/captures-kairos.json';

if (!existsSync(APP)) {
    console.log('kairos-app introuvable — rien à comparer.');
    process.exit(0);
}
if (!existsSync(RELEVE)) {
    console.error(`✗ ${RELEVE} manquant : impossible de savoir quand les captures ont été prises.`);
    process.exit(0);
}

const releve = JSON.parse(readFileSync(RELEVE, 'utf8'));
const git = (...args) => execFileSync('git', ['-C', APP, ...args], { encoding: 'utf8' }).trim();

let depuis;
try {
    depuis = git('rev-parse', '--short', 'HEAD');
} catch {
    console.log('kairos-app illisible — rien à comparer.');
    process.exit(0);
}

if (depuis === releve.commit) {
    console.log(`✓ captures à jour — kairos-app est toujours sur ${depuis} (${releve.version})`);
    process.exit(0);
}

const journal = git('log', '--oneline', `${releve.commit}..HEAD`).split('\n').filter(Boolean);
const assiste = journal.filter((l) => /assist|guide|canvas|onboarding|landing|ui|ux/i.test(l));

console.log(`Captures prises sur ${releve.commit} (${releve.version}, ${releve.date}).`);
console.log(`kairos-app est aujourd'hui sur ${depuis} : ${journal.length} commits d'écart.`);
if (assiste.length) {
    console.log(`\n${assiste.length} touchent ce qui est PUBLIC (mode assisté) :`);
    for (const l of assiste.slice(0, 8)) console.log('  ' + l);
    console.log('\n→ les captures méritent probablement d\'être refaites.');
} else {
    console.log('\nAucun ne touche le mode assisté : les captures restent valables.');
}
