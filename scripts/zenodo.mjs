#!/usr/bin/env node
/**
 * Articles du site ↔ Zenodo (28/10).
 *
 * Constat de l'audit : les dépôts Zenodo dataient tous de mars, des articles avaient été
 * réécrits depuis, d'autres n'y étaient jamais allés, et le site affichait des DOI de
 * VERSION (périmés dès la version suivante). Ce script compare, puis publie à la demande.
 *
 *   npm run zenodo                              état de chaque article (lecture seule, sans token)
 *   npm run zenodo -- pdf <slug>                rend le PDF de l'article, sans rien envoyer
 *   npm run zenodo -- publier <slug> [<slug>…]  premier dépôt d'articles absents de Zenodo (--absents : tous)
 *   npm run zenodo -- liens [<slug>…]           complète les liens entre dépôts (« cites » d'après les liens du texte)
 *   npm run zenodo -- maj <slug> [<slug>…]      nouvelle version (nouveau PDF) d'un ou plusieurs dépôts
 *   npm run zenodo -- maj --modifies            … de tous ceux dont le texte a changé depuis le dépôt
 *   npm run zenodo -- sync                      absents + modifiés + liens, dans l'ordre (ce que lance la CI)
 *   npm run zenodo -- controle                  ligne de résumé, sans réseau (lancé par npm test)
 *   npm run zenodo -- references <slug>         corrige les métadonnées d'un dépôt, sans nouvelle version
 *   npm run zenodo -- site                      remplace dans le front matter les DOI de version par le DOI de CONCEPT
 *                                               (--ajouter : l'écrit aussi là où le site n'en affiche pas)
 *
 * Sans `--envoyer`, publier / maj / references n'envoient rien : ils rendent le PDF et
 * affichent ce qui serait envoyé. `--sandbox` vise sandbox.zenodo.org (token
 * ZENODO_SANDBOX_TOKEN, correspondances tenues à part). En production, token ZENODO_TOKEN
 * (scopes deposit:write et deposit:actions), dans l'environnement, jamais dans un fichier.
 * Une publication Zenodo est IRRÉVERSIBLE : le script demande de retaper le slug.
 *
 * Correspondances et empreintes : src/_data/zenodo.json. L'empreinte est celle du TEXTE
 * rendu de l'article (_site), pas du PDF : Chrome change les octets du PDF à chaque rendu.
 */
import { readFileSync, writeFileSync, existsSync, mkdtempSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const DONNEES = 'src/_data/zenodo.json';
const SITE_URL = JSON.parse(readFileSync('src/_data/site.json', 'utf8')).url;
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome';
// Zenodo répond 403 au fetch de Node sans User-Agent (constaté le 28/10 ; curl passe).
const UA = { 'User-Agent': 'mecanique-invisible-zenodo/1.0 (+https://mecanique-invisible.com)' };

const args = process.argv.slice(2);
const drapeau = (n) => args.includes('--' + n);
const [commande = 'etat', slugDemande] = args.filter((a) => !a.startsWith('--'));
const SANDBOX = drapeau('sandbox');
const ENVOYER = drapeau('envoyer');
const BASE = SANDBOX ? 'https://sandbox.zenodo.org' : 'https://zenodo.org';
const SECTION = SANDBOX ? 'sandbox' : 'production';

const donnees = JSON.parse(readFileSync(DONNEES, 'utf8'));
const depots = donnees[SECTION];

function sauver() {
    writeFileSync(DONNEES, JSON.stringify(donnees, null, 2) + '\n');
}

// ─── Articles du site ───────────────────────────────────────────────

/** Front matter (champs simples sur une ligne, + keywords) d'un article. */
function lireArticle(slug) {
    const chemin = `src/articles/${slug}.md`;
    if (!existsSync(chemin)) throw new Error(`article inconnu : ${slug}`);
    const brut = readFileSync(chemin, 'utf8');
    const fm = brut.slice(4, brut.indexOf('\n---', 4));
    const champ = (n) => {
        const m = fm.match(new RegExp(`^${n}:\\s*"?(.*?)"?\\s*$`, 'm'));
        return m ? m[1].replace(/\\"/g, '"') : undefined;
    };
    const kw = fm.match(/^keywords:\n((?:\s+- .*\n?)+)/m);
    return {
        slug, chemin,
        headline: champ('headline'),
        description: champ('description'),
        datePublished: champ('datePublished'),
        dateModified: champ('dateModified') || champ('datePublished'),
        doi: champ('doi'),
        horsZenodo: champ('zenodo') === 'false',
        keywords: kw ? kw[1].split('\n').map((l) => l.replace(/^\s+- /, '').replace(/^"|"$/g, '').trim()).filter(Boolean) : [],
        url: `${SITE_URL}/${slug}.html`,
    };
}

function tousLesSlugs() {
    return execFileSync('ls', ['src/articles']).toString().split('\n')
        .filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3));
}

/** Mots normalisés : casse, accents gardés, ponctuation et typographie retirées. */
function mots(texte) {
    return texte.toLowerCase()
        .replace(/[’‘`]/g, "'").replace(/[«»“”"]/g, ' ')
        .replace(/[  ]/g, ' ')
        .replace(/[^\p{L}\p{N}' ]+/gu, ' ')
        .split(/\s+/).filter(Boolean);
}

/** Texte de l'article tel que le site le rend (corps seul, sans marge ni partage). */
function texteRendu(slug) {
    const html = readFileSync(`_site/${slug}.html`, 'utf8');
    const debut = html.indexOf('id="artTexte"');
    const fin = html.indexOf('<aside class="art-marge"', debut);
    if (debut < 0 || fin < 0) throw new Error(`corps introuvable dans _site/${slug}.html`);
    const corps = html.slice(debut, fin)
        .replace(/<div class="art-partage"[\s\S]*?<\/div>/, ' ')
        .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    return corps.slice(corps.indexOf('>') + 1);
}

// Les nombres sont neutralisés : choragos-kora, ce-quon-tente-ici… lisent des comptes de Kora
// qui bougent à chaque relevé, ce n'est pas une nouvelle version du texte.
const empreinte = (texte) => createHash('sha256').update(mots(texte).join(' ').replace(/\d+/g, '#')).digest('hex').slice(0, 16);

/** Part des passages de 5 mots de `a` qu'on retrouve dans `b` (0-1). */
function recouvrement(a, b) {
    const sh = (m) => { const s = new Set(); for (let i = 0; i + 5 <= m.length; i++) s.add(m.slice(i, i + 5).join(' ')); return s; };
    const sa = sh(mots(a)); const sb = sh(mots(b));
    if (!sa.size) return 0;
    let commun = 0; for (const x of sa) if (sb.has(x)) commun++;
    return commun / sa.size;
}

// ─── Zenodo : lecture publique ──────────────────────────────────────

async function getJson(url, options = {}, essai = 1) {
    const auth = process.env[NOM_TOKEN] && url.startsWith(BASE) ? { Authorization: `Bearer ${process.env[NOM_TOKEN]}` } : {};
    const r = await fetch(url, { ...options, headers: { ...UA, ...auth, ...(options.headers || {}) } });
    // Zenodo : 30 recherches par minute sans token. On attend plutôt que d'échouer.
    if (r.status === 429 && essai <= 4) {
        const attente = (Number(r.headers.get('retry-after')) || 20) * 1000;
        process.stdout.write(`(limite de requêtes Zenodo : pause ${Math.round(attente / 1000)} s)\n`);
        await new Promise((ok) => setTimeout(ok, attente));
        return getJson(url, options, essai + 1);
    }
    const corps = await r.text();
    let json; try { json = corps ? JSON.parse(corps) : {}; } catch { json = { brut: corps }; }
    if (!r.ok) throw new Error(`${options.method || 'GET'} ${url} → ${r.status} ${json.message || ''} ${JSON.stringify(json.errors || '')}`);
    return json;
}

/** Dernière version publiée d'un concept (recherche publique, sans token). */
async function derniereVersion(concept) {
    if (DERNIERES.has(concept)) return DERNIERES.get(concept);
    const d = await getJson(`${BASE}/api/records?q=conceptrecid:${concept}&sort=mostrecent&size=1`);
    return d.hits.hits[0];
}

async function texteDepose(record) {
    const fichier = (record.files || []).find((f) => f.key.toLowerCase().endsWith('.pdf'));
    if (!fichier) return null;
    const r = await fetch(fichier.links.self, { headers: UA });
    if (!r.ok) return null;
    const dossier = mkdtempSync(join(tmpdir(), 'zenodo-'));
    const pdf = join(dossier, 'depot.pdf');
    writeFileSync(pdf, Buffer.from(await r.arrayBuffer()));
    return execFileSync('pdftotext', ['-q', pdf, '-']).toString();
}

const normTitre = (t) => mots(t || '').join(' ');

// ─── Rendu PDF (Chrome headless, instance isolée) ───────────────────

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

async function rendrePdf(slug) {
    const serveur = createServer((req, res) => {
        let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        if (p.endsWith('/')) p += 'index.html';
        const f = join('_site', p);
        if (!f.startsWith('_site') || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { 'Content-Type': TYPES[extname(f)] || 'application/octet-stream' });
        res.end(readFileSync(f));
    });
    await new Promise((r) => serveur.listen(0, '127.0.0.1', r));
    const port = serveur.address().port;
    const profil = mkdtempSync(join(tmpdir(), 'zenodo-chrome-'));
    const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profil}`, '--no-first-run', ...(process.env.CI ? ['--no-sandbox'] : []), 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
    try {
        const wsUrl = await new Promise((ok, ko) => {
            let tampon = '';
            chrome.stderr.on('data', (d) => { tampon += d; const m = tampon.match(/DevTools listening on (ws:\/\/\S+)/); if (m) ok(m[1]); });
            setTimeout(() => ko(new Error('Chrome ne répond pas')), 15000);
        });
        const http = wsUrl.replace(/^ws:\/\/([^/]+).*$/, 'http://$1');
        const cible = await (await fetch(`${http}/json/new?about:blank`, { method: 'PUT' })).json();
        const ws = new WebSocket(cible.webSocketDebuggerUrl);
        await new Promise((r) => ws.addEventListener('open', r));
        let id = 0; const attente = new Map();
        ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && attente.has(m.id)) { attente.get(m.id)(m); attente.delete(m.id); } });
        const cdp = (method, params = {}) => new Promise((r) => { const i = ++id; attente.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
        await cdp('Page.enable');
        // Mouvement réduit : notes affichées, rien d'animé (cf. CLAUDE.md, « Carnet »).
        await cdp('Emulation.setEmulatedMedia', { media: 'print', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        await cdp('Page.navigate', { url: `http://127.0.0.1:${port}/${slug}.html` });
        await new Promise((r) => setTimeout(r, 1500));
        await cdp('Runtime.evaluate', {
            awaitPromise: true,
            expression: `(async () => {
                document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
                await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
                await document.fonts.ready;
            })()`,
        });
        const art = lireArticle(slug);
        const pied = `<div style="font-size:8px;width:100%;padding:0 18mm;color:#555;display:flex;justify-content:space-between;font-family:sans-serif">`
            + `<span>Florent Klimacek · ${art.url}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
        const r = await cdp('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: pied });
        ws.close();
        if (!r.result) throw new Error('rendu PDF : ' + JSON.stringify(r.error));
        const sortie = join(tmpdir(), `zenodo-${slug}.pdf`);
        writeFileSync(sortie, Buffer.from(r.result.data, 'base64'));
        return sortie;
    } finally {
        chrome.kill();
        serveur.close();
    }
}

// ─── Zenodo : écriture (API de dépôt, token) ────────────────────────

const NOM_TOKEN = SANDBOX ? 'ZENODO_SANDBOX_TOKEN' : 'ZENODO_TOKEN';

function token() {
    const t = process.env[NOM_TOKEN];
    if (!t) throw new Error(`${NOM_TOKEN} absent (token Zenodo, scopes deposit:write et deposit:actions)`);
    return t;
}

/** Sans variable d'environnement, le token est demandé ici, saisie masquée, gardé en mémoire
 *  le temps de la commande — jamais écrit (le terminal de l'Atelier ne garde pas un `export`). */
async function demanderToken() {
    if (process.env[NOM_TOKEN]) return;
    if (!process.stdin.isTTY) throw new Error(`${NOM_TOKEN} absent et pas de terminal pour le demander`);
    process.stdout.write(`\nToken ${SANDBOX ? 'de la SANDBOX (sandbox.zenodo.org)' : 'de PRODUCTION (zenodo.org)'} — colle-le puis Entrée (rien ne s'affiche) : `);
    // Mode brut : le terminal n'affiche rien de ce qui est tapé ou collé.
    const saisi = await new Promise((ok) => {
        let t = '';
        process.stdin.setRawMode(true);
        process.stdin.setEncoding('utf8');
        const lire = (bloc) => {
            for (const c of bloc) {
                if (c === '\r' || c === '\n') { process.stdin.off('data', lire); process.stdin.setRawMode(false); process.stdin.pause(); ok(t.trim()); return; }
                if (c === '\u0003') { process.stdin.setRawMode(false); process.stdout.write('\nAnnulé.\n'); process.exit(1); }
                if (c === '\u007f' || c === '\b') t = t.slice(0, -1);
                else if (c >= ' ') t += c;
            }
        };
        process.stdin.on('data', lire);
        process.stdin.resume();
    });
    process.stdout.write('\n');
    if (!saisi) throw new Error('aucun token saisi');
    process.env[NOM_TOKEN] = saisi;
}

const api = (...a) => apiBrut(...a).catch((e) => {
    if (/→ (401|403) /.test(e.message)) {
        e.message += `\n  Token refusé par ${BASE.replace('https://', '')} : il doit venir de CE site (${SANDBOX ? 'sandbox' : 'pas la sandbox'}) et avoir les scopes deposit:write ET deposit:actions.`;
    }
    throw e;
});

const apiBrut = (chemin, method = 'GET', corps, type = 'application/json') => getJson(chemin.startsWith('http') ? chemin : `${BASE}/api${chemin}`, {
    method,
    headers: { Authorization: `Bearer ${token()}`, ...(corps !== undefined ? { 'Content-Type': type } : {}) },
    body: corps === undefined ? undefined : type === 'application/json' ? JSON.stringify(corps) : corps,
});

/** L'URL de l'article sur le site, en identifiant alternatif ; les anciennes URL du site retirées. */
const conceptDoi = (concept) => `${SANDBOX ? '10.5072' : '10.5281'}/zenodo.${concept}`;

/** DOI de chaque version de nos dépôts → DOI de concept (rempli par chargerVersions). */
const VERSIONS = new Map();
/** Dernière version publiée de chaque concept, lue par chargerVersions (une requête de moins chacun). */
const DERNIERES = new Map();
/** Publiés pendant cette exécution : leurs liens viennent d'être posés, et la recherche Zenodo
 *  peut encore renvoyer leur version précédente (index en retard) — « liens » les laisse. */
const PUBLIES = new Set();

async function chargerVersions() {
    for (const { concept } of Object.values(depots)) {
        const d = await getJson(`${BASE}/api/records?q=conceptrecid:${concept}&all_versions=true&size=25`);
        for (const h of d.hits.hits) {
            VERSIONS.set(h.doi, conceptDoi(concept));
            if (h.metadata.relations?.version?.[0]?.is_last) DERNIERES.set(concept, h);
        }
    }
}

/** Articles du site vers lesquels le corps de l'article renvoie. */
function liensInternes(slug) {
    const html = readFileSync(`_site/${slug}.html`, 'utf8');
    const debut = html.indexOf('id="artTexte"');
    const corps = html.slice(debut, html.indexOf('<aside class="art-marge"', debut));
    const cibles = new Set();
    for (const m of corps.matchAll(/href="(?:https:\/\/mecanique-invisible\.com)?\/?([a-z0-9-]+)\.html(?:#[^"]*)?"/g)) {
        if (m[1] !== slug && existsSync(`src/articles/${m[1]}.md`)) cibles.add(m[1]);
    }
    return [...cibles].sort();
}

/**
 * Liens du dépôt : ceux déjà posés (un DOI de version de nos dépôts devient le DOI de concept,
 * qui suit les versions), + « cites » vers chaque article déposé que le texte cite, + l'URL
 * de l'article sur le site en identifiant alternatif.
 */
function relations(metadata, art) {
    const vus = new Set(); const sortie = [];
    const ajouter = (r) => { const k = `${r.relation} ${r.identifier}`; if (!vus.has(k)) { vus.add(k); sortie.push(r); } };
    for (const r of metadata.related_identifiers || []) {
        if (r.relation === 'isAlternateIdentifier' && r.identifier.startsWith(SITE_URL)) continue;
        ajouter(VERSIONS.has(r.identifier) ? { ...r, identifier: VERSIONS.get(r.identifier) } : r);
    }
    const deja = new Set(sortie.map((r) => r.identifier));
    for (const cible of liensInternes(art.slug)) {
        if (!depots[cible] || deja.has(conceptDoi(depots[cible].concept))) continue;
        ajouter({ identifier: conceptDoi(depots[cible].concept), relation: 'cites', resource_type: 'publication-preprint', scheme: 'doi' });
    }
    ajouter({ identifier: art.url, relation: 'isAlternateIdentifier', scheme: 'url' });
    return sortie;
}

/** Ce qu'il manque au dépôt publié (métadonnées publiques) par rapport à relations(). */
function liensAManquer(record, art) {
    const m = record.metadata;
    const actuels = new Set((m.related_identifiers || []).map((r) => `${r.relation} ${r.identifier}`));
    const manque = relations(m, art).filter((r) => r.relation !== 'isAlternateIdentifier' && !actuels.has(`${r.relation} ${r.identifier}`))
        .map((r) => `${r.relation} ${r.identifier}`);
    if (!(m.alternate_identifiers || []).some((a) => a.identifier === art.url)) manque.push('URL du site');
    return manque;
}

function metadataNeuves(art, reglages) {
    return {
        upload_type: 'publication',
        publication_type: 'preprint',
        title: reglages.titre || art.headline,
        creators: [{ name: 'Klimacek, Florent' }],
        description: `<p>${art.description}</p><p>Version en ligne : <a href="${art.url}">${art.url}</a></p>`,
        access_right: 'open',
        license: 'cc-by-4.0',
        language: 'fra',
        keywords: art.keywords,
        publication_date: art.datePublished,
        version: art.dateModified,
        related_identifiers: relations({}, art),
    };
}

/** Métadonnées d'une nouvelle version : celles du dépôt, avec la date, l'URL et le titre tenus à jour. */
function metadataVersion(ancienne, art, reglages) {
    const m = { ...ancienne };
    delete m.doi; delete m.prereserve_doi;
    m.publication_date = new Date().toISOString().slice(0, 10);
    m.version = art.dateModified;
    m.access_right = 'open';
    m.license = m.license || 'cc-by-4.0';
    if (reglages.titre) m.title = reglages.titre;
    m.related_identifiers = relations(m, art);
    return m;
}

async function confirmer(slug, quoi) {
    if (!ENVOYER) {
        console.log(`\n(simulation : rien n'est envoyé. Ajouter --envoyer pour ${quoi}${SANDBOX ? ' sur la sandbox' : ' sur Zenodo, de façon IRRÉVERSIBLE'}.)`);
        return false;
    }
    if (SANDBOX || drapeau('oui')) return true;
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const rep = await rl.question(`\n${quoi} sur zenodo.org est public et sans retour. Retaper « ${slug} » pour confirmer : `);
    rl.close();
    if (rep.trim() !== slug) { console.log('Annulé.'); return false; }
    return true;
}

async function televerser(bucket, pdf, slug) {
    await api(`${bucket}/${encodeURIComponent(slug + '.pdf')}`, 'PUT', readFileSync(pdf), 'application/octet-stream');
}

/** Les DOI de la sandbox (10.5072) ne se résolvent pas sur doi.org : on donne la page du dépôt. */
const lien = (publie) => SANDBOX ? `${BASE}/records/${publie.id}` : `https://doi.org/${publie.doi}`;

/** Après publication : correspondance, empreinte du texte déposé, DOI de concept sur le site. */
function enregistrer(art, publie) {
    DERNIERES.delete(String(publie.conceptrecid));
    PUBLIES.add(art.slug);
    depots[art.slug] = { ...(depots[art.slug] || {}), concept: String(publie.conceptrecid), texte: empreinte(texteRendu(art.slug)), depose: new Date().toISOString().slice(0, 10) };
    sauver();
    console.log(`✓ publié : ${lien(publie)} (concept ${publie.conceptdoi})`);
    if (!SANDBOX && depots[art.slug].afficher !== false) ecrireDoiSite(art, publie.conceptdoi);
}

function ecrireDoiSite(art, conceptDoi) {
    const voulu = `https://doi.org/${conceptDoi}`;
    if (art.doi === voulu) return false;
    let brut = readFileSync(art.chemin, 'utf8');
    const finFm = brut.indexOf('\n---', 4);
    let fm = brut.slice(0, finFm);
    fm = /^doi:/m.test(fm) ? fm.replace(/^doi:.*$/m, `doi: "${voulu}"`) : `${fm}\ndoi: "${voulu}"`;
    writeFileSync(art.chemin, fm + brut.slice(finFm));
    console.log(`  ${art.slug} : doi → ${voulu}`);
    return true;
}

// ─── Commandes ──────────────────────────────────────────────────────

function construire() {
    execFileSync('npx', ['@11ty/eleventy', '--quiet'], { stdio: ['ignore', 'ignore', 'inherit'] });
}

async function etat() {
    construire();
    await chargerVersions();
    const lignes = [];
    for (const slug of tousLesSlugs()) {
        const art = lireArticle(slug);
        const reglages = depots[slug];
        if (!reglages) { lignes.push([slug, '—', 'ABSENT de Zenodo', art.doi ? 'le site affiche un DOI sans correspondance' : '']); continue; }
        const record = await derniereVersion(reglages.concept);
        if (!record) { lignes.push([slug, reglages.concept, 'introuvable', '']); continue; }
        const texte = texteRendu(slug);
        let statut;
        if (reglages.edition === 'longue') statut = 'édition longue (Zenodo garde la sienne)';
        else if (reglages.texte) statut = reglages.texte === empreinte(texte) ? 'à jour' : 'MODIFIÉ depuis le dépôt';
        else {
            const depose = await texteDepose(record);
            statut = depose === null ? 'fichier inaccessible' : `à comparer : ${Math.round(recouvrement(texte, depose) * 100)} % du texte du site se retrouve dans le dépôt`;
        }
        const refs = [];
        const m = record.metadata;
        const conceptDoi = `https://doi.org/${record.conceptdoi}`;
        if (reglages.afficher === false) { if (art.doi) refs.push('DOI affiché alors que le dépôt est retiré du site'); }
        else if (!art.doi) refs.push('DOI non affiché sur le site');
        else if (art.doi !== conceptDoi) refs.push(art.doi.endsWith(record.doi) ? 'DOI de version sur le site (pas de concept)' : `DOI du site ≠ ${record.conceptdoi}`);
        if (m.access_right !== 'open') refs.push(`accès ${m.access_right}`);
        const alt = (m.alternate_identifiers || []).map((a) => a.identifier);
        if (!alt.includes(art.url)) refs.push(alt.length ? `URL du site périmée (${alt.join(', ').replace(SITE_URL, '')})` : 'pas d\'URL du site');
        const cites = liensAManquer(record, art).filter((x) => x !== 'URL du site');
        if (cites.length) refs.push(`${cites.length} lien(s) à ajouter (npm run zenodo -- liens)`);
        const titreVoulu = reglages.titre || art.headline;
        if (!normTitre(m.title).startsWith(normTitre(titreVoulu)) && !reglages.titre) refs.push(`titre Zenodo : « ${m.title.slice(0, 50)}… »`);
        if (reglages.titre && m.title !== reglages.titre) refs.push(`titre à corriger → « ${reglages.titre} »`);
        lignes.push([slug, `${record.id} (v. ${m.publication_date.trim()})`, statut, refs.join(' ; ')]);
    }
    console.log(`\nZenodo ${SANDBOX ? '(SANDBOX) ' : ''}— ${lignes.length} articles\n`);
    for (const [slug, rec, statut, refs] of lignes) {
        console.log(`${slug}\n    dépôt : ${rec}\n    texte : ${statut}${refs ? `\n    réf.  : ${refs}` : ''}`);
    }
    console.log(`\nAbsents : ${lignes.filter((l) => l[1] === '—').length}. « à comparer » : aucune empreinte enregistrée, le dépôt est comparé au texte du site ;`
        + ` après vérification, \`npm run zenodo -- marquer <slug>\` enregistre le texte actuel comme déposé.`);
}

async function main() {
    const slug = slugDemande;
    const besoinSlug = ['pdf', 'references', 'marquer'];
    if (besoinSlug.includes(commande) && !slug) throw new Error(`usage : npm run zenodo -- ${commande} <slug>`);

    if (commande === 'etat') return etat();
    if (commande === 'controle') return controle();
    if (ENVOYER && ['publier', 'maj', 'references', 'liens', 'sync'].includes(commande)) await demanderToken();

    if (commande === 'site') {
        let n = 0;
        for (const [s, reglages] of Object.entries(depots)) {
            if (reglages.afficher === false || SANDBOX) continue;
            const art = lireArticle(s);
            if (!art.doi && !drapeau('ajouter')) continue;
            const record = await derniereVersion(reglages.concept);
            if (ecrireDoiSite(art, record.conceptdoi)) n++;
        }
        console.log(n ? `${n} front matter mis à jour — relire le diff, puis npm test.` : 'Rien à changer.');
        return;
    }

    const positionnels = args.filter((a) => !a.startsWith('--')).slice(1);
    if (['maj', 'publier', 'liens', 'references', 'sync'].includes(commande)) {
        construire();
        await chargerVersions();
    }
    if (commande === 'sync') return synchroniser();
    if (commande === 'liens') {
        return liensPlusieurs(positionnels.length ? positionnels : Object.keys(depots).filter((s) => existsSync(`src/articles/${s}.md`)));
    }
    if (commande === 'maj' || commande === 'publier') {
        const tous = commande === 'maj' ? drapeau('modifies') : drapeau('absents');
        const slugs = !tous ? positionnels
            : commande === 'maj' ? articlesModifies() : articlesAbsents();
        if (!slugs.length && !tous) throw new Error(`usage : npm run zenodo -- ${commande} <slug> [<slug>…] | ${commande === 'maj' ? '--modifies' : '--absents'}`);
        return commande === 'maj' ? majPlusieurs(slugs) : publierPlusieurs(slugs);
    }

    const art = lireArticle(slug);
    const reglages = depots[slug] || {};

    if (commande === 'marquer') {
        if (!depots[slug]) throw new Error(`${slug} n'a pas de dépôt dans ${DONNEES}`);
        construire();
        depots[slug].texte = empreinte(texteRendu(slug));
        sauver();
        console.log(`${slug} : texte actuel enregistré comme celui du dépôt.`);
        return;
    }

    if (commande === 'pdf') {
        construire();
        console.log(`PDF : ${await rendrePdf(slug)}`);
        return;
    }

    if (commande === 'references') {
        if (!depots[slug]) throw new Error(`${slug} n'a pas de dépôt : utiliser « publier ».`);
        const record = await derniereVersion(reglages.concept);
        console.log(`Dépôt actuel : ${record.id} — « ${record.metadata.title} »`);
        if (!ENVOYER) {
            // Aperçu à partir des métadonnées publiques ; l'envoi repart de celles du dépôt.
            const apercu = { title: reglages.titre || record.metadata.title, related_identifiers: relations(record.metadata, art) };
            console.log(`Changements :\n${JSON.stringify(apercu, null, 2)}`);
        }
        if (!(await confirmer(slug, 'corriger les métadonnées'))) return;
        await corrigerDepot(slug, record.id);
        return;
    }

    throw new Error(`commande inconnue : ${commande}`);
}

/** Métadonnées d'un dépôt publié corrigées (titre voulu, liens) : pas de nouvelle version, pas de nouveau DOI. */
async function corrigerDepot(slug, recid) {
    const art = lireArticle(slug);
    const reglages = depots[slug];
    await api(`/deposit/depositions/${recid}/actions/edit`, 'POST');
    const depot = await api(`/deposit/depositions/${recid}`);
    const m = { ...depot.metadata, related_identifiers: relations(depot.metadata, art) };
    if (reglages.titre) m.title = reglages.titre;
    delete m.doi; delete m.prereserve_doi;
    await api(`/deposit/depositions/${recid}`, 'PUT', { metadata: m });
    const publie = await api(`/deposit/depositions/${recid}/actions/publish`, 'POST');
    console.log(`✓ ${slug} : métadonnées corrigées — ${lien(publie)}`);
    if (!SANDBOX && reglages.afficher !== false) ecrireDoiSite(art, publie.conceptdoi);
}

/** Dans un lot, une erreur arrête tout : on dit ce qui est fait et ce qui ne l'est pas. */
function erreurDeLot(slug, e, tous, faits, brouillon) {
    if (e.deLot) return e;
    const reste = tous.filter((s) => s !== slug && !faits.includes(s));
    return Object.assign(new Error(`${slug} : ${e.message}\n  déjà faits : ${faits.join(', ') || 'aucun'}\n  pas tentés : ${reste.join(', ') || 'aucun'}`
        + (brouillon ? `\n  (un brouillon a pu rester ouvert sur Zenodo pour ${slug} : à supprimer depuis « Upload » avant de relancer)` : '')), { deLot: true });
}

const cleDeLot = (slugs, verbe) => slugs.length === 1 ? slugs[0] : `${verbe} ${slugs.length}`;

/** Premier dépôt d'un ou plusieurs articles. Les métadonnées sont calculées au moment d'envoyer :
 *  un article du lot cite ainsi ceux publiés juste avant lui. */
async function publierPlusieurs(slugs) {
    if (!slugs.length) { console.log('Aucun article absent de Zenodo.'); return; }
    const prets = [];
    for (const slug of slugs) {
        if (depots[slug]) throw new Error(`${slug} est déjà sur Zenodo (concept ${depots[slug].concept}) : utiliser « maj ».`);
        const art = lireArticle(slug);
        const pdf = await rendrePdf(slug);
        const m = metadataNeuves(art, {});
        console.log(`\n${slug}\n  PDF : ${pdf}\n  titre : ${m.title}\n  liens : ${m.related_identifiers.map((r) => `${r.relation} ${r.identifier}`).join(' ; ')}`);
        prets.push({ slug, art, pdf });
    }
    const autres = slugs.filter((s) => liensInternes(s).some((c) => slugs.includes(c)));
    if (autres.length) console.log(`\n(${autres.join(', ')} cite(nt) des articles du même lot : ces liens s'ajoutent pendant l'envoi, ou après avec « liens ».)`);
    if (!(await confirmer(cleDeLot(slugs, 'publier'), slugs.length === 1 ? 'publier' : `publier ${slugs.length} articles (${slugs.join(', ')})`))) return;
    const faits = [];
    for (const { slug, art, pdf } of prets) {
        try {
            let depot;
            try { depot = await api('/deposit/depositions', 'POST', {}); } catch (e) { throw erreurDeLot(slug, e, slugs, faits, false); }
            await televerser(depot.links.bucket, pdf, slug);
            await api(`/deposit/depositions/${depot.id}`, 'PUT', { metadata: metadataNeuves(art, depots[slug] || {}) });
            process.stdout.write(`${slug} : `);
            enregistrer(art, await api(`/deposit/depositions/${depot.id}/actions/publish`, 'POST'));
            faits.push(slug);
        } catch (e) { throw erreurDeLot(slug, e, slugs, faits, true); }
    }
}

/** Liens manquants sur les dépôts publiés (« cites » vers les articles déposés depuis, URL du site). */
async function liensPlusieurs(slugs) {
    const a_corriger = [];
    for (const slug of slugs) {
        if (!depots[slug] || PUBLIES.has(slug)) continue;
        const record = await derniereVersion(depots[slug].concept);
        const manque = liensAManquer(record, lireArticle(slug));
        if (manque.length) { console.log(`${slug} : ${manque.join(' ; ')}`); a_corriger.push({ slug, recid: record.id }); }
    }
    if (!a_corriger.length) { console.log('Tous les liens sont à jour.'); return; }
    const noms = a_corriger.map((x) => x.slug);
    if (!(await confirmer(cleDeLot(noms, 'liens'), `corriger les liens de ${noms.length} dépôt(s)`))) return;
    const faits = [];
    for (const { slug, recid } of a_corriger) {
        try { await corrigerDepot(slug, recid); faits.push(slug); } catch (e) { throw erreurDeLot(slug, e, noms, faits, false); }
    }
}

/** Nouvelle version d'un ou plusieurs articles : PDF et aperçu de chacun, une seule confirmation. */
async function majPlusieurs(slugs) {
    if (!slugs.length) { console.log('Aucun article à mettre à jour.'); return; }
    const prets = [];
    for (const slug of slugs) {
        const reglages = depots[slug];
        if (!reglages) throw new Error(`${slug} n'a pas de dépôt : utiliser « publier ».`);
        if (reglages.edition === 'longue' && !drapeau('forcer')) {
            throw new Error(`${slug} : Zenodo garde l'édition longue (zenodo.json, edition: "longue"). « references » corrige les métadonnées ; --forcer remplacerait le PDF.`);
        }
        const art = lireArticle(slug);
        const record = await derniereVersion(reglages.concept);
        const pdf = await rendrePdf(slug);
        console.log(`\n${slug}\n  PDF : ${pdf}\n  dépôt actuel : ${record.id} — « ${record.metadata.title} »`);
        if (!ENVOYER) {
            const apercu = { title: reglages.titre || record.metadata.title, access_right: 'open', version: art.dateModified,
                publication_date: new Date().toISOString().slice(0, 10), related_identifiers: relations(record.metadata, art) };
            console.log(`  changements : ${JSON.stringify(apercu, null, 2).replace(/\n/g, '\n  ')}`);
        }
        prets.push({ slug, art, reglages, record, pdf });
    }
    const cle = cleDeLot(prets.map((p) => p.slug), 'publier');
    const quoi = prets.length === 1 ? 'publier une nouvelle version' : `publier ${prets.length} nouvelles versions (${prets.map((p) => p.slug).join(', ')})`;
    if (!(await confirmer(cle, quoi))) return;
    const faits = [];
    for (const { slug, art, reglages, record, pdf } of prets) {
        try {
            const nv = await api(`/deposit/depositions/${record.id}/actions/newversion`, 'POST');
            const brouillon = await api(nv.links.latest_draft);
            for (const f of brouillon.files || []) await api(`/deposit/depositions/${brouillon.id}/files/${f.id}`, 'DELETE');
            await televerser(brouillon.links.bucket, pdf, slug);
            await api(`/deposit/depositions/${brouillon.id}`, 'PUT', { metadata: metadataVersion(brouillon.metadata, art, reglages) });
            process.stdout.write(`${slug} : `);
            enregistrer(art, await api(`/deposit/depositions/${brouillon.id}/actions/publish`, 'POST'));
            faits.push(slug);
        } catch (e) { throw erreurDeLot(slug, e, prets.map((p) => p.slug), faits, true); }
    }
}

/** Articles dont le texte a changé depuis leur dépôt, ou sans empreinte (hors édition longue). */
function articlesModifies() {
    return Object.entries(depots)
        .filter(([s, r]) => r.edition !== 'longue' && existsSync(`src/articles/${s}.md`) && !lireArticle(s).horsZenodo)
        .filter(([s, r]) => !r.texte || r.texte !== empreinte(texteRendu(s)))
        .map(([s]) => s);
}

/** Articles du site sans dépôt (hors `zenodo: false` en front matter). */
const articlesAbsents = () => tousLesSlugs().filter((s) => !depots[s] && !lireArticle(s).horsZenodo);

/**
 * Tout ce qui manque, dans l'ordre : absents, puis nouvelles versions, puis liens (les dépôts
 * publiés à l'instant peuvent enfin être cités). Lancé par .github/workflows/zenodo.yml à
 * chaque push qui touche un article. Au-delà de --plafond publications (10 par défaut), rien
 * n'est envoyé : une passe sur tout le site ne doit pas créer vingt versions d'un coup.
 */
async function synchroniser() {
    const absents = articlesAbsents();
    const modifies = articlesModifies();
    const plafond = Number((args.find((a) => a.startsWith('--plafond=')) || '').split('=')[1]) || 10;
    console.log(`Zenodo ${SANDBOX ? '(SANDBOX) ' : ''}: ${absents.length} absent(s) [${absents.join(', ')}], ${modifies.length} modifié(s) [${modifies.join(', ')}].`);
    if (absents.length + modifies.length > plafond) {
        throw new Error(`${absents.length + modifies.length} publications dépassent le plafond (${plafond}) : rien n'est envoyé. `
            + `Vérifier qu'aucune passe globale n'a touché tous les articles, puis relancer avec --plafond=N.`);
    }
    if (absents.length) await publierPlusieurs(absents);
    if (modifies.length) await majPlusieurs(modifies);
    if (absents.length || modifies.length || drapeau('liens')) {
        await liensPlusieurs(Object.keys(depots).filter((s) => existsSync(`src/articles/${s}.md`)));
    } else console.log('Rien à publier.');
}

/** Pour `npm test` : sans réseau, sans build (le test vient de construire), ne bloque jamais. */
function controle() {
    if (!existsSync('_site')) { console.log('Zenodo : _site absent, contrôle sauté.'); return; }
    const absents = tousLesSlugs().filter((s) => !donnees.production[s] && !lireArticle(s).horsZenodo);
    const modifies = []; const sansEmpreinte = [];
    for (const [s, r] of Object.entries(donnees.production)) {
        if (r.edition === 'longue' || !existsSync(`_site/${s}.html`) || lireArticle(s).horsZenodo) continue;
        if (!r.texte) sansEmpreinte.push(s);
        else if (r.texte !== empreinte(texteRendu(s))) modifies.push(s);
    }
    const morceaux = [];
    if (modifies.length) morceaux.push(`${modifies.length} modifié(s) depuis leur dépôt (${modifies.join(', ')}), publié(s) au prochain push`);
    if (sansEmpreinte.length) morceaux.push(`${sansEmpreinte.length} sans empreinte (${sansEmpreinte.join(', ')})`);
    if (absents.length) morceaux.push(`${absents.length} absent(s) de Zenodo`);
    console.log(morceaux.length ? `ⓘ Zenodo : ${morceaux.join(' ; ')}.` : '✓ Zenodo : tous les dépôts sont à jour.');

}

main().catch((e) => { console.error(`✗ ${e.message}`); process.exit(1); });
