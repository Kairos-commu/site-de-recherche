#!/usr/bin/env node
/**
 * Garde-fou des pages produit.
 *
 * Règle posée par Florent : dans tout ce qui présente ou vend l'application,
 * seul le mode Assisté existe. Les articles de recherche, eux, racontent le
 * projet et peuvent nommer ce qu'il contient.
 *
 * Ce test lit le site CONSTRUIT (_site), pas les sources : une mention qui
 * arrive par _data/kairos.json ou par un partial doit être attrapée aussi.
 * Écrit après avoir trouvé la règle enfreinte sur cinq fichiers à la fois —
 * meta description, JSON-LD, section dédiée, légende de capture et liste de
 * fonctionnalités — sans que rien ne l'ait jamais signalé.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE = '_site';

/** Ce qui présente ou vend l'application. Tout le reste est éditorial. */
const PAGES_PRODUIT = [
    'index.html',
    'presentation_kairos.html',
    'presentation_kairos_en.html',
    'download.html',
    'about.html',
];

/** Vocabulaire interdit sur ces pages, avec la raison — affichée en cas d'échec. */
const INTERDITS = [
    {
        motif: /\bmodes?\s+autonome\b|\bautonomous\s+modes?\b/gi,
        quoi: 'le mode Autonome',
        pourquoi: 'seul le mode Assisté est public',
    },
];

/** Le texte visible, débarrassé du balisage et des scripts sauf le JSON-LD. */
function texteExaminable(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;|&#\d+;/gi, ' ')
        .replace(/\s+/g, ' ');
}

let fautes = 0;
let examinees = 0;

for (const page of PAGES_PRODUIT) {
    const chemin = join(SITE, page);
    if (!existsSync(chemin)) {
        console.error(`✗ ${page} — page produit absente du build`);
        fautes++;
        continue;
    }
    examinees++;
    const brut = readFileSync(chemin, 'utf8');
    // les attributs porteurs de sens comptent autant que le texte visible
    const attributs = (brut.match(/(?:alt|content|title)="[^"]*"/gi) || []).join(' ');
    const texte = texteExaminable(brut) + ' ' + attributs;

    for (const { motif, quoi, pourquoi } of INTERDITS) {
        const trouves = texte.match(motif);
        if (trouves) {
            console.error(`✗ ${page} — ${quoi} y apparaît ${trouves.length} fois (${pourquoi})`);
            console.error(`    ex. : « ${trouves[0].trim()} »`);
            fautes++;
        }
    }
}

if (fautes > 0) {
    console.error(`\n${fautes} page(s) produit hors règle.`);
    console.error("Les articles ne sont pas concernés : la règle ne vaut que pour");
    console.error("ce qui présente ou vend l'application.");
    process.exit(1);
}

console.log(`✓ ${examinees} pages produit conformes — aucun mode non public mentionné`);
