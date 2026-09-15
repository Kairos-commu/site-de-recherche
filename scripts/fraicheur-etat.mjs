#!/usr/bin/env node
/**
 * Fraîcheur du relevé d'état de Kora (src/_data/koraEtat.json).
 *
 * Le relevé est écrit par `npm run etat:export` dans le dépôt voisin choragos — les chiffres
 * de la page Choragos & Kora en sont lus au build, jamais tapés. Ce script dit de quand date
 * le relevé et combien de commits de choragos ont passé depuis. Il n'échoue jamais : il
 * informe, comme fraicheur-captures.mjs pour KAIROS.
 */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const APP = join(homedir(), 'kairos', 'choragos');
const RELEVE = 'src/_data/koraEtat.json';
if (!existsSync(RELEVE)) { console.error(`✗ ${RELEVE} manquant — lance  npm run etat:export  dans choragos.`); process.exit(0); }
const etat = JSON.parse(readFileSync(RELEVE, 'utf8'));
const age = Math.floor((Date.now() - new Date(etat.generatedAt).getTime()) / 86_400_000);
let derriere = null;
if (existsSync(APP)) {
    try { derriere = execFileSync('git', ['-C', APP, 'rev-list', '--count', `${etat.app.commit}..HEAD`], { encoding: 'utf8' }).trim(); } catch { /* commit inconnu localement */ }
}
console.log(`relevé du ${etat.generatedAtFr} (${age} jour${age > 1 ? 's' : ''}), commit ${etat.app.commit}` + (derriere !== null ? ` — ${derriere} commit(s) de choragos depuis` : ''));
if (age > 14) console.log('⚠️  plus de deux semaines : relance  npm run etat:export  dans choragos, puis commite src/_data/koraEtat.json.');
