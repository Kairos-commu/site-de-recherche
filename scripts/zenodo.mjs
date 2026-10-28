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
 *   npm run zenodo -- publier <slug>            premier dépôt d'un article absent de Zenodo
 *   npm run zenodo -- maj <slug>                nouvelle version (nouveau PDF) d'un dépôt existant
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
const CHROME = '/usr/bin/google-chrome';
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

const empreinte = (texte) => createHash('sha256').update(mots(texte).join(' ')).digest('hex').slice(0, 16);

/** Part des passages de 5 mots de `a` qu'on retrouve dans `b` (0-1). */
function recouvrement(a, b) {
    const sh = (m) => { const s = new Set(); for (let i = 0; i + 5 <= m.length; i++) s.add(m.slice(i, i + 5).join(' ')); return s; };
    const sa = sh(mots(a)); const sb = sh(mots(b));
    if (!sa.size) return 0;
    let commun = 0; for (const x of sa) if (sb.has(x)) commun++;
    return commun / sa.size;
}

// ─── Zenodo : lecture publique ──────────────────────────────────────

async function getJson(url, options = {}) {
    const r = await fetch(url, { ...options, headers: { ...UA, ...(options.headers || {}) } });
    const corps = await r.text();
    let json; try { json = corps ? JSON.parse(corps) : {}; } catch { json = { brut: corps }; }
    if (!r.ok) throw new Error(`${options.method || 'GET'} ${url} → ${r.status} ${json.message || ''} ${JSON.stringify(json.errors || '')}`);
    return json;
}

/** Dernière version publiée d'un concept (recherche publique, sans token). */
async function derniereVersion(concept) {
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
    const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profil}`, '--no-first-run', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
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

function token() {
    const nom = SANDBOX ? 'ZENODO_SANDBOX_TOKEN' : 'ZENODO_TOKEN';
    const t = process.env[nom];
    if (!t) throw new Error(`${nom} absent de l'environnement (token Zenodo, scopes deposit:write et deposit:actions)`);
    return t;
}

const api = (chemin, method = 'GET', corps, type = 'application/json') => getJson(chemin.startsWith('http') ? chemin : `${BASE}/api${chemin}`, {
    method,
    headers: { Authorization: `Bearer ${token()}`, ...(corps !== undefined ? { 'Content-Type': type } : {}) },
    body: corps === undefined ? undefined : type === 'application/json' ? JSON.stringify(corps) : corps,
});

/** L'URL de l'article sur le site, en identifiant alternatif ; les anciennes URL du site retirées. */
function avecUrlDuSite(metadata, art) {
    const autres = (metadata.related_identifiers || []).filter((r) => !(r.relation === 'isAlternateIdentifier' && r.identifier.startsWith(SITE_URL)));
    return [...autres, { identifier: art.url, relation: 'isAlternateIdentifier', scheme: 'url' }];
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
        related_identifiers: avecUrlDuSite({}, art),
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
    m.related_identifiers = avecUrlDuSite(m, art);
    return m;
}

async function confirmer(slug, quoi) {
    if (!ENVOYER) {
        console.log(`\n(simulation : rien n'est envoyé. Ajouter --envoyer pour ${quoi}${SANDBOX ? ' sur la sandbox' : ' sur Zenodo, de façon IRRÉVERSIBLE'}.)`);
        return false;
    }
    if (SANDBOX) return true;
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const rep = await rl.question(`\n${quoi} sur zenodo.org est irréversible (un DOI est créé). Retaper « ${slug} » pour confirmer : `);
    rl.close();
    if (rep.trim() !== slug) { console.log('Annulé.'); return false; }
    return true;
}

async function televerser(bucket, pdf, slug) {
    await api(`${bucket}/${encodeURIComponent(slug + '.pdf')}`, 'PUT', readFileSync(pdf), 'application/octet-stream');
}

/** Après publication : correspondance, empreinte du texte déposé, DOI de concept sur le site. */
function enregistrer(art, publie) {
    depots[art.slug] = { ...(depots[art.slug] || {}), concept: String(publie.conceptrecid), texte: empreinte(texteRendu(art.slug)), depose: new Date().toISOString().slice(0, 10) };
    sauver();
    console.log(`✓ publié : https://doi.org/${publie.doi} (concept ${publie.conceptdoi})`);
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
    const besoinSlug = ['pdf', 'publier', 'maj', 'references', 'marquer'];
    if (besoinSlug.includes(commande) && !slug) throw new Error(`usage : npm run zenodo -- ${commande} <slug>`);

    if (commande === 'etat') return etat();

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

    construire();

    if (commande === 'pdf') {
        console.log(`PDF : ${await rendrePdf(slug)}`);
        return;
    }

    if (commande === 'publier') {
        if (depots[slug]) throw new Error(`${slug} est déjà sur Zenodo (concept ${depots[slug].concept}) : utiliser « maj ».`);
        const pdf = await rendrePdf(slug);
        const metadata = metadataNeuves(art, reglages);
        console.log(`PDF : ${pdf}\nMétadonnées :\n${JSON.stringify(metadata, null, 2)}`);
        if (!(await confirmer(slug, 'publier'))) return;
        const depot = await api('/deposit/depositions', 'POST', {});
        await televerser(depot.links.bucket, pdf, slug);
        await api(`/deposit/depositions/${depot.id}`, 'PUT', { metadata });
        enregistrer(art, await api(`/deposit/depositions/${depot.id}/actions/publish`, 'POST'));
        return;
    }

    if (commande === 'maj' || commande === 'references') {
        if (!depots[slug]) throw new Error(`${slug} n'a pas de dépôt : utiliser « publier ».`);
        if (commande === 'maj' && reglages.edition === 'longue' && !drapeau('forcer')) {
            throw new Error(`${slug} : Zenodo garde l'édition longue (zenodo.json, edition: "longue"). « references » corrige les métadonnées ; --forcer remplacerait le PDF.`);
        }
        const record = await derniereVersion(reglages.concept);
        const pdf = commande === 'maj' ? await rendrePdf(slug) : null;
        if (pdf) console.log(`PDF : ${pdf}`);
        console.log(`Dépôt actuel : ${record.id} — « ${record.metadata.title} »`);
        if (!ENVOYER) {
            // Aperçu à partir des métadonnées publiques ; l'envoi repart de celles du dépôt.
            const apercu = { title: reglages.titre || record.metadata.title, access_right: 'open', related_identifiers: avecUrlDuSite(record.metadata, art) };
            if (commande === 'maj') Object.assign(apercu, { version: art.dateModified, publication_date: new Date().toISOString().slice(0, 10) });
            console.log(`Changements :\n${JSON.stringify(apercu, null, 2)}`);
        }
        if (!(await confirmer(slug, commande === 'maj' ? 'publier une nouvelle version' : 'corriger les métadonnées'))) return;
        if (commande === 'maj') {
            const nv = await api(`/deposit/depositions/${record.id}/actions/newversion`, 'POST');
            const brouillon = await api(nv.links.latest_draft);
            for (const f of brouillon.files || []) await api(`/deposit/depositions/${brouillon.id}/files/${f.id}`, 'DELETE');
            await televerser(brouillon.links.bucket, pdf, slug);
            await api(`/deposit/depositions/${brouillon.id}`, 'PUT', { metadata: metadataVersion(brouillon.metadata, art, reglages) });
            enregistrer(art, await api(`/deposit/depositions/${brouillon.id}/actions/publish`, 'POST'));
        } else {
            await api(`/deposit/depositions/${record.id}/actions/edit`, 'POST');
            const depot = await api(`/deposit/depositions/${record.id}`);
            const m = { ...depot.metadata, related_identifiers: avecUrlDuSite(depot.metadata, art) };
            if (reglages.titre) m.title = reglages.titre;
            delete m.doi; delete m.prereserve_doi;
            await api(`/deposit/depositions/${record.id}`, 'PUT', { metadata: m });
            const publie = await api(`/deposit/depositions/${record.id}/actions/publish`, 'POST');
            console.log(`✓ métadonnées corrigées : https://doi.org/${publie.doi}`);
            if (!SANDBOX && reglages.afficher !== false) ecrireDoiSite(art, publie.conceptdoi);
        }
        return;
    }

    throw new Error(`commande inconnue : ${commande}`);
}

main().catch((e) => { console.error(`✗ ${e.message}`); process.exit(1); });
