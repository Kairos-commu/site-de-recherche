(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();window.onerror=function(t,e,n,s,o){return console.error("[KAIROS ERROR]",t,"at",e,"line",n),!1};function I(t){const e=`[${t}]`;return{debug(...n){console.log(e,...n)},info(...n){console.log(e,...n)},warn(...n){console.warn(e,...n)},error(...n){console.error(e,...n)}}}const Q=I("FgraphShim"),Be=new Map;let ve=null;const on=[/^\/api\//,/^https?:\/\/localhost(:\d+)?\//,/^https:\/\/kairos-llm-proxy\.[a-z0-9-]+\.workers\.dev\/api\/llm$/];function rn(t){return on.some(e=>e.test(t))}function an(t){if(!rn(t)){Q.error(`Proxy URL refusée (non whitelistée): ${t}`);return}ve=t,Q.info(`Proxy URL configurée: ${t}`)}async function cn(t){const{provider:e,apiKey:n,model:s,messages:o,systemPrompt:i,options:r}=t,a=r?.max_tokens||r?.maxTokens||4096;let c,l,d;if(e==="anthropic"||e==="claude")c="https://api.anthropic.com/v1/messages",l={"Content-Type":"application/json","x-api-key":n||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},d={model:s||"claude-sonnet-4-20250514",max_tokens:a,messages:o},i&&(d.system=i);else if(e==="openai"||e==="chatgpt"){c="https://api.openai.com/v1/chat/completions",l={"Content-Type":"application/json",Authorization:`Bearer ${n}`};const f=i?[{role:"system",content:i},...o]:o;d={model:s||"gpt-4o",messages:f,max_tokens:a}}else if(e==="gemini")c=`https://generativelanguage.googleapis.com/v1beta/models/${s||"gemini-1.5-pro"}:generateContent?key=${n}`,l={"Content-Type":"application/json"},d={contents:o.map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:m.content}]})),generationConfig:{maxOutputTokens:a}},i&&(d.systemInstruction={parts:[{text:i}]});else if(e==="deepseek"){c="https://api.deepseek.com/chat/completions",l={"Content-Type":"application/json",Authorization:`Bearer ${n}`};const f=i?[{role:"system",content:i},...o]:o;d={model:s||"deepseek-chat",messages:f,max_tokens:a}}else if(e==="grok"){c="https://api.x.ai/v1/chat/completions",l={"Content-Type":"application/json",Authorization:`Bearer ${n}`};const f=i?[{role:"system",content:i},...o]:o;d={model:s||"grok-2",messages:f,max_tokens:a}}else return{success:!1,error:`Provider inconnu: ${e}`};const u=await fetch(c,{method:"POST",headers:l,body:JSON.stringify(d)});if(!u.ok){const m=(await u.text()).slice(0,300).replace(/sk-[a-zA-Z0-9]{4,}/g,"sk-***").replace(/key-[a-zA-Z0-9]{4,}/g,"key-***").replace(/AIza[a-zA-Z0-9_-]{4,}/g,"AIza***");return{success:!1,error:`API Error ${u.status}: ${m}`}}const h=await u.json();let g="",p=null;if(e==="anthropic"||e==="claude"){if(h.content?.length>0)for(const f of h.content)f.type==="text"?g+=f.text:f.type==="thinking"&&(p=f.thinking)}else e==="gemini"?g=h.candidates?.[0]?.content?.parts?.[0]?.text||"":g=h.choices?.[0]?.message?.content||"";return{success:!0,content:g,thinking:p,usage:h.usage||h.usageMetadata}}async function ln(t){if(!ve)return cn(t);try{const e=await fetch(ve,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok){const n=await e.text();return{success:!1,error:`Proxy Error ${e.status}: ${n.slice(0,300)}`}}return await e.json()}catch(e){return{success:!1,error:`Proxy unreachable: ${e.message}`}}}function dn(){window.fgraph={db:{canvas:{saveAll:async()=>({success:!0}),loadAll:async()=>({nodes:[],connections:[]}),ensureDefault:async()=>{},getAll:async()=>[],getById:async()=>null,create:async()=>{},update:async()=>{},remove:async()=>{}},nodes:{replaceAll:async()=>{}},connections:{replaceAll:async()=>{}},syntheses:{getAllByCanvas:async()=>[],replaceAll:async()=>{}},promptLogs:{create:async()=>{},getAllByCanvas:async()=>[],removeAllByCanvas:async()=>{},update:async()=>{},prune:async()=>{}},attractors:{upsert:async()=>{},getData:async()=>({}),mergeData:async()=>{}},captures:{replaceAll:async()=>{}}},secureGet:async t=>({success:!0,value:Be.get(t)||null}),secureSet:async(t,e)=>(Be.set(t,e),{success:!0}),llmQuery:async t=>(Q.info(`LLM query: provider=${t.provider}, model=${t.model}`),ln(t)),focusMainWindow:async()=>{}},window.CircularityDetector={REFERENTIELS:{}},Q.info("Shim installé — mode web éphémère")}const He=I("ApiKeyUI"),qe={claude:"claude-sonnet-4-20250514",chatgpt:"gpt-4o",gemini:"gemini-1.5-pro",deepseek:"deepseek-chat",grok:"grok-2"};function un(t,e){const n=document.getElementById("api-key-modal"),s=document.getElementById("api-provider-select"),o=document.getElementById("api-model-input"),i=document.getElementById("api-key-input"),r=document.getElementById("api-key-save-btn"),a=document.getElementById("api-key-cancel-btn"),c=document.getElementById("api-config-btn");if(!n||!s||!o||!i||!r||!a){He.error("Éléments DOM de la modal API manquants");return}let l="";function d(){const p=s.value,f=qe[p]||"";o.placeholder=`ex: ${f}`,p!==l&&(o.value=t.providers[p]?.model||f,l=p)}s.addEventListener("change",d);function u(){const p=t.currentProvider||"claude";s.value=p,l=p,o.value=t.providers[p]?.model||qe[p]||"",i.value="",n.classList.remove("hidden"),i.focus()}function h(){i.value="",n.classList.add("hidden")}c&&c.addEventListener("click",u);function g(){return Object.values(t.providers).some(p=>p.apiKey)}a.addEventListener("click",()=>{g()&&h()}),n.addEventListener("click",p=>{p.target===n&&g()&&h()}),document.addEventListener("keydown",p=>{p.key==="Escape"&&!n.classList.contains("hidden")&&g()&&h()}),r.addEventListener("click",async()=>{const p=s.value,f=o.value.trim(),m=i.value.trim();if(!m){i.classList.add("input-error"),setTimeout(()=>i.classList.remove("input-error"),1500);return}t.currentProvider=p,f&&(t.providers[p].model=f),t.providers[p].apiKey=m,await t.saveConfig(),He.info(`Clé API configurée pour provider: ${p}`),i.value="",h(),e?.()}),i.addEventListener("keydown",p=>{p.key==="Enter"&&(p.preventDefault(),r.click())}),l=s.value,d(),setTimeout(()=>{Object.values(t.providers).some(f=>f.apiKey)||u()},500)}const A=I("IframeAPI"),ze=["http://localhost:3000","http://localhost:5173","http://localhost:5174","https://kairos-commu.github.io"];let Z=null;function hn(t){return t instanceof Error?t.message.replace(/sk-[a-zA-Z0-9]{4,}/g,"sk-***").replace(/key-[a-zA-Z0-9]{4,}/g,"key-***"):"Erreur interne KAIROS"}function st(t){Z&&window.parent!==window&&window.parent.postMessage(t,Z)}function pn(t){const e=window.parent!==window;if(window.addEventListener("message",n=>{if(!ze.includes(n.origin)){A.warn(`Message ignoré depuis origin non autorisée: ${n.origin}`);return}Z||(Z=n.origin);const s=n.data;if(!(!s||typeof s.type!="string"))try{switch(s.type){case"kairos:config":gn(s,t);break;case"kairos:setApiKey":fn(s,t);break;default:A.warn(`Message type inconnu: ${s.type}`)}}catch(o){A.error("Erreur traitement message:",o),st({type:"kairos:error",message:hn(o)})}}),e){for(const n of ze)window.parent.postMessage({type:"kairos:ready"},n);A.info("Message kairos:ready envoyé aux origins autorisées")}document.addEventListener("canvas:nodeAdded",()=>Ve(t)),document.addEventListener("nodeDeleted",()=>Ve(t)),A.info(`iframe API initialisée (iframe: ${e})`)}function gn(t,e){t.theme&&(t.theme==="obsidian"||t.theme==="porcelain")&&(document.documentElement.setAttribute("data-theme",t.theme),localStorage.setItem("kairos_theme",t.theme),A.info(`Thème configuré: ${t.theme}`)),t.proxyUrl&&an(t.proxyUrl)}function fn(t,e){if(!t.provider||!t.key){A.warn("kairos:setApiKey: provider ou key manquant");return}A.info(`Clé API reçue pour provider: ${t.provider}`);const n=e.llm;n&&n.providers[t.provider]&&(n.providers[t.provider].apiKey=t.key,n.currentProvider=t.provider,n.saveConfig())}function Ve(t){const e=t.canvas?.state?.nodes?.length||0;st({type:"kairos:nodeCount",count:e})}function mn(t){const e=document.getElementById("btn-undo"),n=document.getElementById("btn-redo");e&&e.addEventListener("click",()=>{t.history.undo()}),n&&n.addEventListener("click",()=>{t.history.redo()})}const b={systemPrompt:`Tu reçois un graphe de pensée non-linéaire.

Les nœuds sont des éléments simultanés, pas des étapes.
Leur ordre de présentation n'implique aucune hiérarchie.

Statuts :
- ○ neutre
- 🎯 ancre du graphe — objectif structurant. Toutes les vignettes et connexions doivent être lues en rapport à cette ancre. Il n'y en a qu'une.

Connexions entre nœuds :
- → implication ou dépendance
- ↔ co-conditionnement mutuel

Tags (#) : dimensions transversales du graphe.
Un tag partagé par plusieurs nœuds signale un axe qui les traverse.
Un tag isolé signale une dimension amorcée mais pas déployée.

Réponds toujours en français.`,systemPromptChatSuffix:`

Réponds de manière concise en tenant compte du contexte.`,systemPromptChatEmpty:`
Réponds de manière concise et utile.`,structuralFraming:{DÉVELOPPER:`CADRE STRUCTUREL :
Un graphe sain contient des boucles de rétroaction,
pas seulement des ramifications.
Si tes vignettes ne font que descendre du général au particulier,
tu produis une arborescence, pas une cartographie.

Critères :
- Au moins une vignette doit REMONTER vers un nœud existant
  en position haute (🎯 ou fortement connecté) pour le contester,
  le nuancer, ou poser une condition à sa validité.
- Les vignettes qui prolongent sans contester sont du bruit,
  pas du développement.
- Si le graphe dépasse 15 vignettes, ce critère est OBLIGATOIRE.
  En dessous, il reste une orientation.
`,RELIER:`CADRE STRUCTUREL :
Un graphe où toutes les connexions descendent
(du général au particulier) est arborescent, pas systémique.

Critères :
- Vérifie la directionnalité globale des connexions existantes.
- Propose au moins une connexion REMONTANTE :
  un nœud périphérique qui contraint, invalide,
  ou conditionne un nœud central.
- Une connexion qui redouble un lien existant
  sous une autre formulation n'est pas une connexion,
  c'est un écho.
- Si le graphe dépasse 15 vignettes et que TOUTES les connexions
  existantes sont descendantes, signale-le explicitement
  avant de proposer tes connexions.
`,SYNTHÉTISER:`CADRE STRUCTUREL :
Avant d'écrire, observe la FORME du graphe :
- Les connexions vont-elles toutes dans le même sens (arborescence) ou forment-elles des boucles ?
- La densité de connexions est-elle homogène ou y a-t-il des clusters isolés ?

Adapte ton texte à la complexité réelle du graphe.
Un graphe linéaire de 5 vignettes donne un texte court et direct.
Un graphe dense de 20 vignettes avec des boucles donne un texte plus riche.
La forme du graphe guide la forme du texte.
`},operations:{DÉVELOPPER:{deepen:{full:`TÂCHE : Génère {targetCount} nouvelles vignettes pour ce graphe.

Observe d'abord :
- Quelles zones du graphe sont sous-explorées ?
- Quels tags n'apparaissent que sur un seul nœud ?
- Quelles tensions entre nœuds ne sont pas nommées ?
- Que suggèrent les connexions sans le dire ?

Les vignettes peuvent prolonger, contester, ou ouvrir
un territoire adjacent. Elles ne reformulent pas l'existant.

FORMAT DE RÉPONSE — chaque vignette sur ce modèle exact :
[NOUVELLE VIGNETTE] Texte concis de l'idée | #tag1 #tag2

Si une vignette remet en question un présupposé du graphe,
utilise [FRICTION] au lieu de [NOUVELLE VIGNETTE].

CONNEXIONS — pour chaque vignette qui prolonge, conteste
ou précise un nœud existant, indique le lien :
[CONNEXION] "Texte exact source" → "Texte exact cible" | Mécanisme précis
[CONNEXION] "Texte exact source" ↔ "Texte exact cible" | Mécanisme précis

→ = implication (A conditionne B)
↔ = co-conditionnement (A et B se contraignent mutuellement)

IMPORTANT : utilise le TEXTE EXACT des vignettes entre guillemets.
Le mécanisme nomme COMMENT les nœuds sont liés.`,branch:`TÂCHE : Génère {targetCount} nouvelles vignettes
qui prolongent cette branche.

Observe d'abord :
- Quelle direction cette séquence dessine-t-elle
  sans la nommer ?
- Qu'est-ce qui manquerait pour que cette branche
  tienne toute seule ?
- Les nœuds voisins signalent-ils une bifurcation
  que la sélection ignore ?
- Y a-t-il une tension interne entre ces nœuds
  que leur connexion masque ?

Les vignettes restent dans le prolongement de la branche
ou révèlent ce qu'elle présuppose sans le dire.
Elles ne reformulent pas l'existant.

FORMAT DE RÉPONSE — chaque vignette sur ce modèle exact :
[NOUVELLE VIGNETTE] Texte concis de l'idée | #tag1 #tag2

Si une vignette remet en question un présupposé du graphe,
utilise [FRICTION] au lieu de [NOUVELLE VIGNETTE].

CONNEXIONS — pour chaque vignette qui prolonge, conteste
ou précise un nœud de la branche, indique le lien :
[CONNEXION] "Texte exact source" → "Texte exact cible" | Mécanisme précis
[CONNEXION] "Texte exact source" ↔ "Texte exact cible" | Mécanisme précis

→ = implication (A conditionne B)
↔ = co-conditionnement (A et B se contraignent mutuellement)

IMPORTANT : utilise le TEXTE EXACT des vignettes entre guillemets.
Le mécanisme nomme COMMENT les nœuds sont liés.`},diverge:{full:`Mots-clés DÉJÀ surreprésentés sur ce canvas :
{topKeywordsCanvas}

TÂCHE : Ce canvas converge autour des mêmes concepts.
Il a besoin de TERRITOIRES ADJACENTS, pas de reformulations.

Propose 2 à 4 nouvelles vignettes qui :
1. Ne réutilisent AUCUN des mots-clés surreprésentés listés ci-dessus
2. Ouvrent un CHAMP CONCEPTUEL DIFFÉRENT relié au sujet par un pont logique
3. Apportent une perspective, une discipline ou un angle
   que le canvas n'explore pas encore

Pour chaque vignette, indique le PONT CONCEPTUEL
qui la relie au canvas existant.

FORMAT DE RÉPONSE :
[NOUVELLE VIGNETTE] Texte de la vignette | #tag1 #tag2
Pont : explication du lien avec le canvas existant

[CONNEXION] "Texte vignette source" → "Texte vignette cible" | Mécanisme : le pont conceptuel

Si une vignette remet en question un présupposé du graphe,
utilise [FRICTION] au lieu de [NOUVELLE VIGNETTE].`,branch:`Mots-clés DÉJÀ surreprésentés sur ce canvas :
{topKeywordsCanvas}

TÂCHE : À partir des vignettes sélectionnées,
propose 1 à 3 nouvelles vignettes qui ouvrent vers
un CHAMP ADJACENT non encore exploré par le canvas.

Les nouvelles vignettes ne doivent PAS reformuler
les concepts existants. Elles doivent apporter
un ANGLE NOUVEAU relié par un pont logique.

N'utilise PAS les mots-clés surreprésentés listés ci-dessus.

FORMAT DE RÉPONSE :
[NOUVELLE VIGNETTE] Texte de la vignette | #tag1 #tag2
Pont : lien avec les vignettes sélectionnées

[CONNEXION] "Texte source" → "Texte cible" | Mécanisme : pont conceptuel

Si une vignette remet en question un présupposé du graphe,
utilise [FRICTION] au lieu de [NOUVELLE VIGNETTE].`}},RELIER:{full:`TÂCHE : Propose {connectionTarget} connexions manquantes dans ce graphe.
{isolatedCount} nœud(s) n'ont actuellement AUCUNE connexion.

PRIORITÉ : connecter les nœuds isolés en premier.
Un nœud isolé dans un graphe de 20+ vignettes est une anomalie —
il a forcément un lien avec au moins un autre nœud.

Observe ensuite :
- Quels nœuds partagent des tags sans être connectés ?
- Quels nœuds semblent éloignés mais présupposent
  la même chose ?
- Les connexions existantes laissent-elles un chemin
  implicite non tracé ?

IMPORTANT : Utilise le TEXTE EXACT des vignettes entre guillemets.
Ne reformule pas, ne résume pas, ne paraphrase pas les textes.
Copie-les mot pour mot depuis la liste ci-dessus.

FORMAT DE RÉPONSE — chaque connexion sur ce modèle exact :
[CONNEXION] "Texte exact A" → "Texte exact B" | Mécanisme précis
[CONNEXION] "Texte exact A" ↔ "Texte exact B" | Mécanisme précis

→ = implication ou dépendance (A conditionne B)
↔ = co-conditionnement mutuel (A et B se contraignent réciproquement)

Le mécanisme nomme COMMENT les nœuds sont liés,
pas seulement QU'ils le sont.
Le mécanisme sera affiché dans le graphe.
Formule-le comme une phrase lisible autonome.

Exemples :
✗ "Lien thématique" / "Relation de cause à effet" / "Écho"
✓ "Le premier pose la condition que le second présuppose"
✓ "Opposition : l'un traite l'écriture comme processus,
    l'autre comme produit"`,branch:`TÂCHE : Propose {connectionTarget} connexions manquantes
dans cette branche ou entre cette branche et son voisinage.
{isolatedCount} nœud(s) de la sélection n'ont aucune connexion interne.

Observe d'abord :
- La séquence interne a-t-elle des sauts ?
  Deux nœuds qui devraient être reliés mais ne le sont pas ?
- Un nœud voisin complète-t-il ou contredit-il
  un nœud de la sélection ?
- Les tags dessinent-ils un lien transversal
  que les connexions directes ne montrent pas ?
- Y a-t-il une dépendance implicite que la branche
  traite comme acquise ?

IMPORTANT : Utilise le TEXTE EXACT des vignettes entre guillemets.
Ne reformule pas, ne résume pas, ne paraphrase pas les textes.
Copie-les mot pour mot depuis la liste ci-dessus.

FORMAT DE RÉPONSE — chaque connexion sur ce modèle exact :
[CONNEXION] "Texte exact A" → "Texte exact B" | Mécanisme précis
[CONNEXION] "Texte exact A" ↔ "Texte exact B" | Mécanisme précis

→ = implication ou dépendance (A conditionne B)
↔ = co-conditionnement mutuel (A et B se contraignent réciproquement)

Le mécanisme nomme COMMENT les nœuds sont liés,
pas seulement QU'ils le sont.
Le mécanisme sera affiché dans le graphe.
Formule-le comme une phrase lisible autonome.

Exemples :
✗ "Lien thématique" / "Relation de cause à effet" / "Écho"
✓ "Le premier pose la condition que le second présuppose"
✓ "Opposition : l'un traite l'écriture comme processus,
    l'autre comme produit"`},SYNTHÉTISER:{full:`Tu reçois un graphe cognitif (vignettes + connexions + tags).

Rédige un texte structuré qui restitue le contenu de ce graphe.

INTRODUCTION
- Pose le contexte : quel territoire ce graphe explore-t-il ?
- Si une ancre (🎯) existe, pars d'elle.
- 2-3 phrases.

DÉVELOPPEMENT
- Déploie les idées en suivant les connexions comme fil conducteur.
- → (implication) : une idée conduit à une autre.
- ↔ (résonance) : deux idées se répondent.
- Nomme les vignettes et tags quand c'est utile, sans les lister mécaniquement.
- Fais apparaître les tensions, les complémentarités, les zones denses.
- N'ajoute pas de concepts absents du graphe. Le texte restitue, il n'interprète pas.
- Adapte la longueur au graphe : un graphe de 5 vignettes ne demande pas le même développement qu'un graphe de 20.

OUVERTURE
- Termine par ce que le graphe n'a pas encore exploré : présupposés non questionnés, zones absentes, directions possibles.
- Formule-le comme une invitation à poursuivre, pas comme un diagnostic.

Écris en prose continue. Pas de listes à puces, pas de titres de section visibles.
Pas de préambule ("Voici la synthèse..."), commence directement.
Réponds en français.`,branch:`Tu reçois une branche d'un graphe cognitif (vignettes sélectionnées + voisinage + connexions).

Rédige un texte structuré qui restitue le contenu de cette branche.

INTRODUCTION
- Quel sous-territoire cette sélection dessine-t-elle ?
- 2-3 phrases.

DÉVELOPPEMENT
- Suis les connexions internes comme fil conducteur.
- Si le voisinage (nœuds non sélectionnés mais connectés) apporte un éclairage, intègre-le.
- Fais apparaître ce que la branche articule et les tensions qu'elle contient.
- N'ajoute pas de concepts absents du graphe.

OUVERTURE
- Ce que cette branche présuppose sans le dire, ou les directions qu'elle ouvre sans les suivre.

Écris en prose continue. Pas de listes à puces, pas de titres de section visibles.
Pas de préambule, commence directement.
Réponds en français.`}},friction:{develop:{moderate:`
---
⚠️ Ce graphe montre des signes de circularité.
Au moins une vignette DOIT être marquée [FRICTION].
---
`,strong:`
---
⚠️ Les dernières générations ont produit des vignettes
proches de : "{recentKeywords}"

Le graphe stagne dans cette zone.
Tes vignettes DOIVENT sortir de ce périmètre sémantique.
Au moins une DOIT être marquée [FRICTION].
---
`},link:{moderate:`
---
⚠️ Ce graphe montre des signes de circularité.
Vérifie que les connexions proposées ne redoublent pas
des liens déjà présents sous une autre formulation.
---
`,strong:`
---
⚠️ Les dernières connexions produites utilisaient
des mécanismes proches de : "{recentMechanisms}"

Propose des connexions dont le mécanisme est structurellement
différent de ceux déjà présents.
---
`}},synthesis:{simple:`TÂCHE : Rédiger un texte développé à partir de ces vignettes connectées.

RÈGLES :
1. Chaque vignette = un paragraphe développé
2. Suivre les connexions comme fil conducteur :
   - → (implique) : "Ceci conduit à...", "De là découle..."
   - ↔ (résonance) : "En parallèle...", "Ce qui fait écho à..."
3. Commencer par les vignettes les plus connectées (hubs)
4. Ne pas fusionner les idées distinctes
5. Ne pas ajouter de concepts absents du graphe

Le texte est une mise en prose du graphe, pas une interprétation.
Réponds directement avec le texte, sans préambule.`,simpleWithReinjection:`TÂCHE : Rédiger un texte développé à partir de ces vignettes connectées.

RÈGLES :
1. Chaque vignette = un paragraphe développé
2. Suivre les connexions comme fil conducteur :
   - → (implique) : "Ceci conduit à...", "De là découle..."
   - ↔ (résonance) : "En parallèle...", "Ce qui fait écho à..."
3. Commencer par les vignettes les plus connectées (hubs)
4. Ne pas fusionner les idées distinctes
5. Ne pas ajouter de concepts absents du graphe
6. S'inscrire dans la continuité des explorations passées

Le texte est une mise en prose du graphe, pas une interprétation.
Réponds directement avec le texte, sans préambule.`,mini:`TÂCHE : Rédiger un texte développé pour ce groupe.
Règles : 1 paragraphe par vignette, suivre les connexions (→/↔), ne pas fusionner.
Réponds directement, sans préambule.`,meta:`TÂCHE : Assembler ces textes en un document cohérent.
Règles : préserver le contenu de chaque groupe, ajouter uniquement des transitions entre groupes.
Réponds directement avec le texte final, sans préambule.`}};function N(t,e){let n=t;for(const[s,o]of Object.entries(e))n=n.replace(new RegExp(`\\{${s}\\}`,"g"),o);return n}let L={...b};function C(){return L}function vn(t){if(L={...b,...t},t.operations){L.operations={...b.operations};for(const[e,n]of Object.entries(t.operations)){const s=e;if(b.operations[s])if(s==="DÉVELOPPER"){const o=n,i=b.operations.DÉVELOPPER;L.operations.DÉVELOPPER={deepen:{...i.deepen,...o.deepen||{}},diverge:{...i.diverge,...o.diverge||{}}}}else L.operations[s]={...b.operations[s],...n}}}if(t.structuralFraming&&(L.structuralFraming={...b.structuralFraming,...t.structuralFraming}),t.friction){L.friction={...b.friction};for(const[e,n]of Object.entries(t.friction)){const s=e;b.friction[s]&&(L.friction[s]={...b.friction[s],...n})}}t.synthesis&&(L.synthesis={...b.synthesis,...t.synthesis})}function yn(){L={...b}}const q=I("PostureManager"),ot="kairos_posture",it="nommer",rt=["accompagner","nommer","provoquer"],xn={accompagner:"#4db8a8",nommer:"#b8a04d",provoquer:"#c05050"},bn={accompagner:"Accompagner",nommer:"Nommer",provoquer:"Provoquer"},En={accompagner:{oxygen:{moderateFrictionThreshold:35,radicalFrictionThreshold:15,stagnationMalus:-8,echoJaccardThreshold:.45},metrics:{synthesisVignetteThresholdHigh:17,synthesisVignetteThresholdMid:10,synthesisVignetteThresholdLow:5,synthesisDensityThreshold:.6,synthesisDensityMinNodes:8},prompt:{systemPromptSuffix:`

POSTURE : Prolonge avant de contester. Si tu perçois une tension, nomme-la sans insister.`}},nommer:{oxygen:{moderateFrictionThreshold:50,radicalFrictionThreshold:30,stagnationMalus:-15,echoJaccardThreshold:.35},metrics:{synthesisVignetteThresholdHigh:25,synthesisVignetteThresholdMid:15,synthesisVignetteThresholdLow:8,synthesisDensityThreshold:.8,synthesisDensityMinNodes:12},prompt:{systemPromptSuffix:""}},provoquer:{oxygen:{moderateFrictionThreshold:65,radicalFrictionThreshold:45,stagnationMalus:-22,echoJaccardThreshold:.25},metrics:{synthesisVignetteThresholdHigh:37,synthesisVignetteThresholdMid:22,synthesisVignetteThresholdLow:12,synthesisDensityThreshold:1.2,synthesisDensityMinNodes:16},prompt:{systemPromptSuffix:`

POSTURE : Chaque opération doit déplacer le cadre, pas le confirmer. Ce que le graphe évite de formuler t'intéresse plus que ce qu'il dit déjà.`}}};let R=it;function wn(){const t=localStorage.getItem(ot);return R=t&&rt.includes(t)?t:it,q.info(`Posture initiale : ${R}`),R}function at(t,e){R=t,localStorage.setItem(ot,t);const n=En[t];e.oxygen?.updateConfig&&e.oxygen.updateConfig(n.oxygen),e.metrics&&(e.metrics.postureConfig=n.metrics),n.prompt.systemPromptSuffix?vn({systemPrompt:b.systemPrompt+n.prompt.systemPromptSuffix}):yn(),ct(t),e.oxygen?.evaluate&&e.canvas&&e.oxygen.evaluate(e.canvas.state.nodes,e.canvas.state.connections),e.metrics?.recalculateDebounced&&e.metrics.recalculateDebounced(),q.info(`Posture appliquée : ${t}`)}function Cn(){return R}function Sn(t){const e=document.getElementById("btn-posture"),n=document.getElementById("posture-menu");if(!e||!n){q.warn("Bouton ou menu posture introuvable dans le DOM");return}e.addEventListener("click",s=>{s.stopPropagation(),n.classList.contains("visible")?n.classList.remove("visible"):(ct(R),n.classList.add("visible"))}),n.addEventListener("click",s=>{const o=s.target.closest(".posture-option");if(!o)return;const i=o.dataset.posture;i&&rt.includes(i)&&(at(i,t),n.classList.remove("visible"),q.info(`Posture changée : ${i}`))}),document.addEventListener("click",()=>{n.classList.remove("visible")}),n.addEventListener("click",s=>{s.stopPropagation()}),q.info("Sélecteur de posture configuré")}function ct(t){if(typeof document>"u"||!document.getElementById)return;document.querySelectorAll(".posture-option").forEach(o=>{const i=o;i.dataset.posture===t?i.classList.add("active"):i.classList.remove("active")});const n=document.getElementById("posture-label");n&&(n.textContent=bn[t]);const s=document.getElementById("posture-btn-swatch");s&&(s.style.background=xn[t])}function Mn(t){let n=0;return t.frictionLevel==="radical"?n=Math.ceil(3*1.5)+1:t.frictionLevel==="moderate"&&(n=4),{score:n,signals:t.signals?Object.entries(t.signals).filter(([,s])=>s.malus<0||s.bonus>0).map(([s])=>s):[],shouldInjectFriction:t.shouldInjectFriction,details:{threshold:3,oxygenScore:t.score,frictionLevel:t.frictionLevel}}}async function Ln(t,e){t.currentOperation=e;const n=t.canvas.interaction.selectedNodes;console.log("[KAIROS DEBUG] selectedIds:",n,"size:",n?.size);const s=n&&n.size>0?t.canvas.state.nodes.filter(h=>n.has(h.id)):[];console.log("[KAIROS DEBUG] selectedVignettes count:",s.length);const o=t.llm.buildContexteOptimise(e,t.canvas.state.nodes,t.canvas.state.connections,s);if(o.vignettes.length===0){e==="SYNTHÉTISER"?t.showNotification("Aucune vignette connectée à synthétiser"):e==="RELIER"?t.showNotification("Aucune vignette à relier"):t.showNotification("Canvas vide, créez d'abord des vignettes");return}t.llm.updateCanvasHistory(t.canvas.state.nodes,t.canvas.state.connections);let i=null;if(t.oxygen)try{e==="SYNTHÉTISER"?i=t.oxygen.evaluate(t.canvas.state.nodes,t.canvas.state.connections):i=await t.oxygen.recordTurn(t.canvas.state.nodes,t.canvas.state.connections)}catch(h){console.warn("[Adaptive] Oxygen recordTurn/evaluate failed:",h)}i&&document.dispatchEvent(new CustomEvent("oxygenUpdated"));let r;i?r=Mn(i):r=t.llm.detectCircularity(t.canvas.state.nodes,t.canvas.state.connections,null,null),lt(t,r);const c=t.metrics?.suggestionActive?.subMode||"approfondir",l=t.syntheses?t.syntheses.getReinjectedSyntheses():[],d=t.llm.buildAdaptivePrompt(e,o,l,r,c);e==="SYNTHÉTISER"&&(t.lastSyntheseVignettes=o.vignettes,console.log("[KAIROS] Vignettes stockées pour synthèse:",t.lastSyntheseVignettes.length)),t.llm.canvasAnalyzer&&(t.llm.canvasAnalyzer.lastUserInput=d),t.oxygen&&t.oxygen.setUserInput(d);const u=t.promptLog?.recordStart({operation:e,regime:o.regime,provider:t.llmApiManager?.getProvider()?.name||t.webviewHandler?.currentProvider||"unknown",mode:t.llmApiManager?"api":"webview",vignetteCount:o.vignettes?.length||o.selection?.length||0,selectedCount:s.length,prompt:d,systemPrompt:t.llm.buildSystemPrompt(e),friction:r?{score:r.score,threshold:r.details?.threshold||3,signals:r.signals||[],injected:r.shouldInjectFriction}:void 0});if(r?.shouldInjectFriction){const h=(r.signals||[]).map(g=>g.name||g).join(", ");t.showNotification?.(`⚡ Friction injectée (score: ${r.score}) — ${h}`)}if(t.llmApiManager)try{const h=await t.llmApiManager.executeOperation(e,d,o);u&&h&&await t.promptLog?.recordEnd(u,h.raw||"",h)}catch(h){console.error("[KAIROS] Erreur LLMApiManager:",h)}else if(t.webviewHandler){t.webviewHandler.currentOperation=e,t.webviewHandler.updateCaptureButtonText(e);const h=s.length>0?" (sélection)":"";await t.webviewHandler.injectPromptToWebview(d)&&t.showNotification(`${e}: ${o.vignettes.length} vignette(s)${h} → envoyez dans le LLM`)}else t.showNotification("WebviewHandler non disponible");t.metrics&&t.metrics.updateSuggestionBanner()}function In(t,e){if(console.log("[KAIROS] Réponse capturée:",e),e.content&&t.llm&&t.llm.canvasAnalyzer&&(t.llm.canvasAnalyzer.lastLLMOutput=e.content,console.log("[KAIROS] lastLLMOutput stocké pour détection circularité")),e.content&&t.oxygen&&t.oxygen.setLLMOutput(e.content),(e.operation==="SYNTHÉTISER"||t.currentOperation==="SYNTHÉTISER")&&t.syntheses&&e.content){let s;if(t.lastSyntheseVignettes&&t.lastSyntheseVignettes.length>0)s=t.lastSyntheseVignettes;else{const i=t.canvas.state.connections||[],r=new Set;i.forEach(a=>{r.add(a.from),r.add(a.to)}),s=t.canvas.state.nodes.filter(a=>r.has(a.id))}if(s.length===0){t.showNotification("Aucune vignette pour la synthèse");return}const o=t.syntheses.creerSyntheseDepuisReponse(e.content,s);o&&(t.syntheses.afficherModalArchivage(o),t.lastSyntheseVignettes=null)}}function lt(t,e=null){dt(t,e)}function dt(t,e=null){const n=document.getElementById("oxygen-strip");if(n){const s=t.oxygen?.getScore()??50,o=t.oxygen?.getLastResult(),i=o?.level??"moderate";n.setAttribute("data-level",i);const r=document.getElementById("oxygen-strip-score");if(r){const a=o?.delta??0;let c=String(Math.round(s));a>0?c+=" ↑":a<0&&(c+=" ↓"),r.textContent=c}}Tn(t)}function Tn(t){if(!document.getElementById("debug-metrics-strip"))return;const n=t.oxygen?.getScore?.()??50,s=t.oxygen?.getLastResult?.(),o=t.metrics?.suggestionActive,i=document.getElementById("dms-oxygen");if(i){const h=s?.level??"moderate",g=n>=50?"ok":n>=30?"warn":"bad";i.textContent=`O₂ ${Math.round(n)} (${h})`,i.setAttribute("data-state",g)}const r=document.getElementById("dms-submode");if(r){const h=o?.subMode||"approfondir",g=o?.operation?.replace("DÉVELOPPER","DEV").replace("SYNTHÉTISER","SYNTH").replace("RELIER","REL")||"—";r.textContent=`${g} ${h==="diverger"?"↗ diverger":"↘ approfondir"}`,r.setAttribute("data-state",h==="diverger"?"warn":"ok")}const a=document.getElementById("dms-friction");if(a){const h=s?.frictionLevel??"none",g=s?.shouldInjectFriction??!1;a.textContent=g?`friction ${h}`:"friction non",a.setAttribute("data-state",h==="radical"?"bad":h==="moderate"?"warn":"ok")}const c=document.getElementById("dms-echo");if(c){const h=s?.signals?.llmEcho?.maxJaccard??0,g=s?.signals?.llmEcho?.overlap>0,p=g?"bad":h>.25?"warn":"ok";c.textContent=`J ${h.toFixed(2)}${g?" !":""}`,c.setAttribute("data-state",p)}const l=document.getElementById("dms-structure");if(l){const h=s?.signals?.graphStructure;if(h?.enabled){const g=h.malus<0?"bad":h.bonus>0?"ok":"warn";l.textContent=`ratio ${h.ratio.toFixed(1)} · ${h.components} comp`,l.setAttribute("data-state",g)}else l.textContent="struct < 8 nodes",l.setAttribute("data-state","ok")}const d=document.getElementById("dms-posture");if(d){const h=Cn(),g=t.oxygen?.config;g?d.textContent=`${h} | mod:${g.moderateFrictionThreshold} rad:${g.radicalFrictionThreshold} echo:${g.echoJaccardThreshold}`:d.textContent=h}const u=document.getElementById("dms-synthesis");if(u){const h=t.metrics?.isSynthesisReady?.()??!1;u.textContent=h?"synth ●":"synth —",u.setAttribute("data-state",h?"ok":"warn")}}function Nn(t){const e=document.getElementById("selection-llm-button"),n=document.getElementById("selection-llm-count");if(!e)return;const s=t.canvas.interaction.selectedNodes.size;s>0?(e.classList.remove("hidden"),n&&(n.textContent=String(s))):e.classList.add("hidden")}const An="kairos_active_canvas_id";let Pn=(()=>{try{return localStorage.getItem(An)||"default"}catch{return"default"}})();function j(){return Pn}const ut=new Set(["implies","resonance","conflicts","example"]);function ht(t,e,n={}){const s=[],o=[],i=new Set,r=new Set;for(const u of t)i.has(u.id)?(r.add(u.id),s.push({code:"DUPLICATE_NODE_ID",severity:"error",message:`Node ID dupliqué : ${u.id}`,details:{nodeId:u.id}})):i.add(u.id);const a=[];for(const u of t)u.status==="priority"&&a.push(u.id);a.length>1&&o.push({code:"MULTIPLE_PRIORITY",severity:"warning",message:`${a.length} nodes avec status='priority' (max 1 attendu)`,details:{nodeId:a[1]}});const c=new Set,l=new Set;for(const u of e){c.has(u.id)?s.push({code:"DUPLICATE_CONNECTION_ID",severity:"error",message:`Connexion ID dupliqué : ${u.id}`,details:{connectionId:u.id}}):c.add(u.id),i.has(u.from)||s.push({code:"ORPHAN_CONNECTION_FROM",severity:"error",message:`Connexion ${u.id} : from '${u.from}' inexistant`,details:{connectionId:u.id,from:u.from}}),i.has(u.to)||s.push({code:"ORPHAN_CONNECTION_TO",severity:"error",message:`Connexion ${u.id} : to '${u.to}' inexistant`,details:{connectionId:u.id,to:u.to}}),u.from===u.to&&o.push({code:"SELF_CONNECTION",severity:"warning",message:`Auto-connexion détectée : ${u.id} (${u.from})`,details:{connectionId:u.id,from:u.from,to:u.to}});const h=`${u.from}|${u.to}`;l.has(h)?o.push({code:"DUPLICATE_CONNECTION_PAIR",severity:"warning",message:`Paire de connexion dupliquée : ${u.from} → ${u.to}`,details:{connectionId:u.id,from:u.from,to:u.to}}):l.add(h),ut.has(u.type)||o.push({code:"INVALID_CONNECTION_TYPE",severity:"warning",message:`Type de connexion invalide : '${u.type}' (connexion ${u.id})`,details:{connectionId:u.id}})}const d={valid:s.length===0,errors:s,warnings:o};return n.repair&&(d.repaired=On(t,e)),d}function On(t,e){const n=new Set;let s=t.filter(l=>n.has(l.id)?!1:(n.add(l.id),!0)),o=!1;s=s.map(l=>{if(l.status==="priority"){if(o)return{...l,status:"neutral"};o=!0}return l});const i=new Set(s.map(l=>l.id)),r=new Set,a=new Set,c=e.filter(l=>{if(r.has(l.id)||(r.add(l.id),!i.has(l.from)||!i.has(l.to))||l.from===l.to)return!1;const d=`${l.from}|${l.to}`;return a.has(d)?!1:(a.add(d),!0)}).map(l=>ut.has(l.type)?l:{...l,type:"implies"});return{nodes:s,connections:c}}class Dn{storageKey;version;canvasId;_cachedData;constructor(){this.storageKey="graph_canvas_data",this.version="2.0",this.canvasId=j(),this._cachedData=null}async save(e){try{const n=(e.vignettes||e.nodes||[]).map(a=>({id:a.id,text:a.text||"",x:a.x||0,y:a.y||0,status:a.status||"neutral",tags:a.tags||[],synthesized:a.synthesized||!1,created:a.created||a.createdAt||Date.now(),modified:a.modified||a.updatedAt||Date.now()})),s=(e.connections||[]).map(a=>({id:a.id,from:a.from||a.fromId,to:a.to||a.toId,type:a.type||"implies",mechanism:a.mechanism||null})),o=ht(n,s,{repair:!0});if(!o.valid){console.warn(`[Storage] State réparé avant save : ${o.errors.length} erreur(s), ${o.warnings.length} warning(s)`);for(const a of o.errors)console.warn(`  [${a.code}] ${a.message}`)}const i=o.repaired?.connections??s,r=await window.fgraph.db.canvas.saveAll(this.canvasId,{nodes:n,connections:i});return this._cachedData=e,console.log("Données sauvegardées avec succès",r),!0}catch(n){return console.error("Erreur lors de la sauvegarde:",n),!1}}async load(){try{const e=await window.fgraph.db.canvas.loadAll(this.canvasId);if(!e||!e.nodes?.length&&!e.connections?.length)return console.log("Aucune donnée sauvegardée trouvée"),null;const n={vignettes:e.nodes.map(s=>({id:s.id,text:s.text,x:s.x,y:s.y,status:s.status,tags:s.tags,synthesized:s.synthesized||!1,created:s.created_at,modified:s.updated_at})),connections:e.connections.map(s=>({id:s.id,from:s.from,to:s.to,type:s.type,mechanism:s.mechanism||null}))};return this._cachedData=n,console.log("Données chargées avec succès"),n}catch(e){return console.error("Erreur lors du chargement:",e),null}}async clear(){try{return await window.fgraph.db.nodes.replaceAll(this.canvasId,[]),await window.fgraph.db.connections.replaceAll(this.canvasId,[]),this._cachedData=null,console.log("Données effacées"),!0}catch(e){return console.error("Erreur lors de l'effacement:",e),!1}}async hasData(){try{const e=await window.fgraph.db.canvas.loadAll(this.canvasId);if(!e)return!1;const n=e.nodes&&e.nodes.length>0,s=e.connections&&e.connections.length>0;return n||s}catch{return!1}}hasDataSync(){if(this._cachedData){const e=this._cachedData.vignettes?.length>0,n=this._cachedData.connections?.length>0;return e||n}try{const e=localStorage.getItem(this.storageKey);if(!e)return!1;const n=JSON.parse(e);if(n.data){const s=n.data.vignettes?.length>0,o=n.data.nodes?.length>0,i=n.data.poles?.length>0,r=n.data.connections?.length>0;return s||o||i||r}return!1}catch{return!1}}async export(){const e=await this.load();if(!e)return;const n=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(n),o=document.createElement("a");o.href=s,o.download=`graph_canvas_${Date.now()}.json`,o.click(),URL.revokeObjectURL(s)}import(e){return new Promise((n,s)=>{const o=new FileReader;o.onload=async i=>{try{const r=JSON.parse(i.target.result);await this.save(r),n(r)}catch(r){s(r)}},o.onerror=s,o.readAsText(e)})}handleQuotaExceeded(){console.warn("Cette méthode n'est plus utilisée avec SQLite")}migrate(e){return console.log("Migration gérée par db-migration.js"),e.data}}class kn{canvas;viewport;container;resizeBtn;canvasManager;ctx;isExpanded;normalWidth;normalHeight;expandedWidth;expandedHeight;width;height;_animationFrameId;scale;isDragging;dragStartX;dragStartY;initialPanX;initialPanY;worldWidth;worldHeight;constructor(e){if(this.canvas=document.getElementById("minimap-canvas"),this.viewport=document.getElementById("minimap-viewport"),this.container=document.getElementById("minimap-container"),this.resizeBtn=document.getElementById("minimap-resize-btn"),this.canvasManager=e,!this.canvas||!this.viewport){console.error("Mini-map elements not found"),this.ctx=null,this.isExpanded=!1,this.normalWidth=200,this.normalHeight=150,this.expandedWidth=300,this.expandedHeight=225,this.width=this.normalWidth,this.height=this.normalHeight,this._animationFrameId=null,this.scale=.05,this.isDragging=!1,this.dragStartX=0,this.dragStartY=0,this.initialPanX=0,this.initialPanY=0,this.worldWidth=0,this.worldHeight=0;return}this.ctx=this.canvas.getContext("2d"),this.isExpanded=!1,this.normalWidth=200,this.normalHeight=150,this.expandedWidth=300,this.expandedHeight=225,this.width=this.normalWidth,this.height=this.normalHeight,this.canvas.width=this.width,this.canvas.height=this.height,this._animationFrameId=null,this.scale=.05,this.isDragging=!1,this.dragStartX=0,this.dragStartY=0,this.initialPanX=0,this.initialPanY=0,this.worldWidth=0,this.worldHeight=0,this.setupResizeButton(),this.setupEventListeners(),this.startAutoUpdate()}setupResizeButton(){!this.resizeBtn||!this.container||this.resizeBtn.addEventListener("click",e=>{e.stopPropagation(),this.toggleSize()})}toggleSize(){this.isExpanded=!this.isExpanded,this.container.classList.toggle("expanded",this.isExpanded),this.width=this.isExpanded?this.expandedWidth:this.normalWidth,this.height=this.isExpanded?this.expandedHeight:this.normalHeight,this.canvas.width=this.width,this.canvas.height=this.height,this.update()}setupEventListeners(){this.canvas.addEventListener("click",e=>{if(this.isDragging)return;const n=this.canvas.getBoundingClientRect(),s=e.clientX-n.left,o=e.clientY-n.top,i=this.calculateBounds(),r=this.canvasManager.state.zoom||1,a=this.canvasManager.polesContainer.getBoundingClientRect(),c=s/this.scale+i.minX,l=o/this.scale+i.minY;this.canvasManager.state.panX=-c*r+a.width/2,this.canvasManager.state.panY=-l*r+a.height/2,this.canvasManager.applyTransform(),this.update()}),this.viewport.addEventListener("mousedown",e=>{e.stopPropagation(),this.isDragging=!0,this.dragStartX=e.clientX,this.dragStartY=e.clientY,this.initialPanX=this.canvasManager.state.panX,this.initialPanY=this.canvasManager.state.panY,this.viewport.classList.add("dragging")}),document.addEventListener("mousemove",e=>{if(!this.isDragging)return;const n=e.clientX-this.dragStartX,s=e.clientY-this.dragStartY,o=this.canvasManager.state.zoom||1,i=n/this.scale,r=s/this.scale;this.canvasManager.state.panX=this.initialPanX-i*o,this.canvasManager.state.panY=this.initialPanY-r*o,this.canvasManager.applyTransform(),this.update()}),document.addEventListener("mouseup",()=>{this.isDragging&&(this.isDragging=!1,this.viewport.classList.remove("dragging"))}),this.canvas.addEventListener("dblclick",e=>{const n=this.canvas.getBoundingClientRect(),s=e.clientX-n.left,o=e.clientY-n.top,i=this.calculateBounds(),r=s/this.scale+i.minX,a=o/this.scale+i.minY,c=Math.min(this.canvasManager.state.zoom*1.2,3),l=this.canvasManager.polesContainer.getBoundingClientRect();this.canvasManager.state.panX=-r*c+l.width/2,this.canvasManager.state.panY=-a*c+l.height/2,this.canvasManager.state.zoom=c,this.canvasManager.applyTransform(),this.update()})}startAutoUpdate(){let e=0;const n=500,s=o=>{o-e>=n&&(this.update(),e=o),this._animationFrameId=requestAnimationFrame(s)};this._animationFrameId=requestAnimationFrame(s),this.update()}calculateBounds(){const e=this.canvasManager.state.nodes,n=this.canvasManager.state.zoom||1,s=this.canvasManager.state.panX||0,o=this.canvasManager.state.panY||0,i=this.canvasManager.polesContainer.getBoundingClientRect(),r=-s/n,a=-o/n,c=r+i.width/n,l=a+i.height/n;if(e.length===0)return{minX:r-100,minY:a-100,maxX:c+100,maxY:l+100};let d=1/0,u=1/0,h=-1/0,g=-1/0;e.forEach(f=>{d=Math.min(d,f.x),u=Math.min(u,f.y),h=Math.max(h,f.x+300),g=Math.max(g,f.y+120)}),d=Math.min(d,r),u=Math.min(u,a),h=Math.max(h,c),g=Math.max(g,l);const p=100;return d-=p,u-=p,h+=p,g+=p,{minX:d,minY:u,maxX:h,maxY:g}}update(){const e=this.calculateBounds();this.worldWidth=e.maxX-e.minX,this.worldHeight=e.maxY-e.minY;const n=this.width/this.worldWidth,s=this.height/this.worldHeight;this.scale=Math.min(n,s);const o=getComputedStyle(document.documentElement),i=o.getPropertyValue("--theme-bg-deep").trim()||"#1a1a1a",r=o.getPropertyValue("--theme-node-bg-start").trim()||"#2a2a2a",a=o.getPropertyValue("--theme-border").trim()||"#3a3a3a",c=o.getPropertyValue("--theme-text-secondary").trim()||"#8a8070",l=o.getPropertyValue("--theme-connection-implies").trim()||"#6a9ac0",d=o.getPropertyValue("--theme-connection-resonance").trim()||"#9a6ac0",u=o.getPropertyValue("--theme-badge-red-bg").trim()||"#3a2a2a";this.ctx.fillStyle=i,this.ctx.fillRect(0,0,this.width,this.height),this.canvasManager.state.nodes.forEach(g=>{const p=(g.x-e.minX)*this.scale,f=(g.y-e.minY)*this.scale,m=Math.max(300*this.scale,6),y=Math.max(120*this.scale,4);let v,x;g.status==="priority"?(v="#e74c3c",x=u):(v=c,x=r),this.ctx.fillStyle=x,this.ctx.fillRect(p,f,m,y),this.ctx.fillStyle=v,this.ctx.fillRect(p,f,Math.max(2,m*.05),y),this.ctx.strokeStyle=a,this.ctx.lineWidth=.5,this.ctx.strokeRect(p,f,m,y)});const h=new Map(this.canvasManager.state.nodes.map(g=>[g.id,g]));this.canvasManager.state.connections.forEach(g=>{const p=h.get(g.from),f=h.get(g.to);if(p&&f){const m=(p.x+150-e.minX)*this.scale,y=(p.y+60-e.minY)*this.scale,v=(f.x+150-e.minX)*this.scale,x=(f.y+60-e.minY)*this.scale;g.type==="resonance"?(this.ctx.strokeStyle=d,this.ctx.setLineDash([3,2])):(this.ctx.strokeStyle=l,this.ctx.setLineDash([])),this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(m,y),this.ctx.lineTo(v,x),this.ctx.stroke()}}),this.ctx.setLineDash([]),this.updateViewport(e)}updateViewport(e){const n=this.canvasManager.polesContainer.getBoundingClientRect(),s=this.canvasManager.state.zoom||1,o=this.canvasManager.state.panX||0,i=this.canvasManager.state.panY||0,r=-o/s,a=-i/s,c=n.width/s,l=n.height/s,d=(r-e.minX)*this.scale,u=(a-e.minY)*this.scale,h=c*this.scale,g=l*this.scale;this.viewport.style.left=`${d}px`,this.viewport.style.top=`${u}px`,this.viewport.style.width=`${Math.max(h,10)}px`,this.viewport.style.height=`${Math.max(g,10)}px`}destroy(){this._animationFrameId&&cancelAnimationFrame(this._animationFrameId)}}function oe(t){if(!t._nodeMap||t._nodeMapDirty){t._nodeMap=new Map;for(const e of t.state.nodes)t._nodeMap.set(e.id,e);t._nodeMapDirty=!1}return t._nodeMap}function Rn(t,e){t.interaction.connectionMode=!0,t.interaction.connectionFromNode=e;const n=document.getElementById(e.id);n&&(n.style.boxShadow="0 0 20px rgba(74, 124, 89, 0.8)")}function pt(t){if(t.interaction.connectionFromNode){const e=document.getElementById(t.interaction.connectionFromNode.id);e&&(e.style.boxShadow="")}t.interaction.connectionMode=!1,t.interaction.connectionFromNode=null,t.polesContainer.classList.remove("connection-mode-waiting")}function $n(t){if(t.interaction.connectionMode&&t.interaction.connectionFromNode){pt(t),console.log("Mode connexion annulé");return}t.polesContainer.classList.contains("connection-mode-waiting")?(t.polesContainer.classList.remove("connection-mode-waiting"),t.interaction.connectionMode=!1,console.log("Mode connexion désactivé")):(t.polesContainer.classList.add("connection-mode-waiting"),t.interaction.connectionMode=!0,t.interaction.connectionFromNode=null,console.log("Mode connexion activé - Cliquez sur un pôle pour commencer"))}function _n(t,e,n,s="implies",o=null){if(e.id===n.id)return;if(t.state.connections.some(a=>a.from===e.id&&a.to===n.id)){console.log("Connexion déjà existante");return}const r={id:`c_${crypto.randomUUID()}`,from:e.id,to:n.id,type:s,mechanism:o||null,created:new Date().toISOString()};t.state.connections.push(r),gt(t),document.dispatchEvent(new CustomEvent("connectionCreated",{detail:{fromId:e.id,toId:n.id,type:s,mechanism:o}}))}function gt(t){t._connectionRenderTimeout&&clearTimeout(t._connectionRenderTimeout),t._connectionRenderTimeout=setTimeout(()=>{U(t),t._connectionRenderTimeout=null},50)}function Fn(t,e,n,s="implies",o=null){if(e===n)return;const i=t.state.connections.some(c=>c.from===e&&c.to===n),r=t.state.pendingConnections.some(c=>c.from===e&&c.to===n);if(i||r){console.log(`Connexion ${e} → ${n} déjà existante ou en attente`);return}const a={id:`c_${crypto.randomUUID()}`,from:e,to:n,type:s,mechanism:o||null,created:new Date().toISOString()};t.state.pendingConnections.push(a),console.log(`Connexion mise en attente: ${e} → ${n}${o?` [${o}]`:""}`)}function Bn(t){if(t.state.pendingConnections.length===0){console.log("Aucune connexion en attente");return}console.log(`Traitement de ${t.state.pendingConnections.length} connexions en attente...`),ft(t).then(()=>{const e=[],n=[];t.state.pendingConnections.forEach(s=>{const o=t.state.nodes.find(r=>r.id===s.from),i=t.state.nodes.find(r=>r.id===s.to);if(o&&i){const r=document.getElementById(s.from),a=document.getElementById(s.to);r&&a?(t.state.connections.push(s),e.push(s)):(console.warn(`Éléments DOM non trouvés pour connexion ${s.from} → ${s.to}`),n.push(s))}else console.warn(`Nodes non trouvés pour connexion ${s.from} → ${s.to}`),n.push(s)}),t.state.pendingConnections=[],e.length>0&&(U(t),console.log(`✓ ${e.length} connexions créées avec succès`),document.dispatchEvent(new CustomEvent("connectionsChanged",{detail:{count:e.length,total:t.state.connections.length}}))),n.length>0&&(console.warn(`✗ ${n.length} connexions ont échoué`),document.dispatchEvent(new CustomEvent("connectionsPendingResult",{detail:{processed:e.length,failed:n.length,total:e.length+n.length}})))})}function ft(t,e=500){return new Promise(n=>{let s=Date.now(),o=!1;const i=new MutationObserver(()=>{s=Date.now()});i.observe(t.polesContainer,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]});const r=()=>{if(o)return;Date.now()-s>=100?(o=!0,i.disconnect(),console.log("DOM stable, traitement des connexions..."),n()):Date.now()-s<e?requestAnimationFrame(r):(o=!0,i.disconnect(),console.log("Timeout atteint, forçage du traitement des connexions..."),n())};setTimeout(r,50)})}function Hn(t,e){t.state.connections=t.state.connections.filter(n=>n.id!==e.id),U(t),document.dispatchEvent(new CustomEvent("connectionsChanged",{detail:{deleted:1,total:t.state.connections.length}}))}function U(t){const e=t.svgConnections.querySelectorAll(".connection-line"),n=t.svgConnections.querySelectorAll(".connection-hitbox"),s=new Map;e.forEach(a=>{const c=a.getAttribute("data-connection-id");c&&s.set(c,a)});const o=new Map;n.forEach(a=>{const c=a.getAttribute("data-connection-id");c&&o.set(c.replace("hitbox-",""),a)});const i=new Set(t.state.connections.map(a=>a.id));s.forEach((a,c)=>{i.has(c)||a.remove()}),o.forEach((a,c)=>{i.has(c)||a.remove()});const r=oe(t);t.state.connections.forEach(a=>{const c=r.get(a.from),l=r.get(a.to);if(!c||!l)return;const d=T(t,c),u=T(t,l),h=ie(d,u);if(s.has(a.id)){s.get(a.id).setAttribute("d",h);const g=o.get(a.id);g&&g.setAttribute("d",h)}else re(t,a)})}function qn(t){U(t)}function zn(t){const e=t.svgConnections.querySelector("defs");t.svgConnections.innerHTML="",e&&t.svgConnections.appendChild(e),t.state.connections.forEach(n=>re(t,n))}function Vn(t){const e=oe(t);t.state.connections.forEach(n=>{const s=e.get(n.from),o=e.get(n.to);if(!s||!o)return;const i=T(t,s),r=T(t,o),a=ie(i,r),c=t.svgConnections.querySelector(`[data-connection-id="${n.id}"]`),l=t.svgConnections.querySelector(`[data-connection-id="hitbox-${n.id}"]`);c&&c.setAttribute("d",a),l&&l.setAttribute("d",a)})}function jn(t,e){const n=oe(t),s=t.state.connections.filter(o=>o.from===e||o.to===e);for(const o of s){const i=n.get(o.from),r=n.get(o.to);if(!i||!r)continue;const a=T(t,i),c=T(t,r),l=ie(a,c),d=t.svgConnections.querySelector(`[data-connection-id="${o.id}"]`);d?d.setAttribute("d",l):re(t,o)}}const ee=new Map;function Y(t){t?ee.delete(t):ee.clear()}function ie(t,e){const n=e.y-t.y,s=Math.min(Math.abs(n)*.4,80),o=t.x,i=t.y+s,r=e.x,a=e.y-s;return`M ${t.x} ${t.y} C ${o} ${i}, ${r} ${a}, ${e.x} ${e.y}`}function T(t,e){const n=typeof e.x=="number"&&!isNaN(e.x)?e.x:0,s=typeof e.y=="number"&&!isNaN(e.y)?e.y:0;let o=t.NODE_WIDTH,i=t.NODE_HEIGHT;const r=ee.get(e.id);if(r)o=r.width,i=r.height;else{const a=document.getElementById(e.id);a&&(o=a.offsetWidth||o,i=a.offsetHeight||i,ee.set(e.id,{width:o,height:i}))}return{x:n+o/2,y:s+i/2}}function re(t,e){const n=oe(t),s=n.get(e.from),o=n.get(e.to);if(!s||!o){console.warn("renderConnection: node non trouvé",{from:e.from,to:e.to,fromNode:s,toNode:o});return}const i=T(t,s),r=T(t,o),a=ie(i,r),c=s.synthesized||o.synthesized,l=document.createElementNS("http://www.w3.org/2000/svg","path");l.classList.add("connection-hitbox"),c&&l.classList.add("connection-archived"),l.setAttribute("data-connection-id",`hitbox-${e.id}`),l.setAttribute("d",a);const d=document.createElementNS("http://www.w3.org/2000/svg","path");if(d.classList.add("connection-line",`connection-${e.type}`),c&&d.classList.add("connection-archived"),d.setAttribute("data-connection-id",e.id),d.setAttribute("d",a),e.type==="implies"?d.setAttribute("stroke","url(#grad-implies)"):e.type==="resonance"&&d.setAttribute("stroke","url(#grad-resonance)"),d.setAttribute("filter","url(#connection-glow)"),e.mechanism){const h=document.createElementNS("http://www.w3.org/2000/svg","title");h.textContent=e.mechanism,d.appendChild(h);const g=document.createElementNS("http://www.w3.org/2000/svg","title");g.textContent=e.mechanism,l.appendChild(g)}const u={implies:"arrow-implies",tension:"arrow-tension",resonance:"arrow-resonance",hypothesis:"",opposition:"arrow-tension"};u[e.type]&&d.setAttribute("marker-end",`url(#${u[e.type]})`),l.addEventListener("click",h=>{h.stopPropagation(),t.showConnectionContextMenu(e,h.clientX,h.clientY)}),l.addEventListener("mouseenter",()=>{d.classList.add("hovered")}),l.addEventListener("mouseleave",()=>{d.classList.remove("hovered")}),d.addEventListener("click",h=>{h.stopPropagation(),t.showConnectionContextMenu(e,h.clientX,h.clientY)}),t.svgConnections.appendChild(l),t.svgConnections.appendChild(d)}function Un(t){return{version:2,vignettes:t.state.nodes,connections:t.state.connections,zoom:t.state.zoom,panX:t.state.panX,panY:t.state.panY,mode:t.state.mode}}function Yn(t,e){t.polesContainer.innerHTML="",t.svgConnections.querySelectorAll(".connection-line").forEach(r=>r.remove()),t.state.poles=[];let s;e.vignettes?s=e.vignettes:e.poles&&Array.isArray(e.poles)&&e.poles.length>0&&!e.poles[0].width?s=e.poles:s=[];const o=e.connections||[],i=ht(s,o,{repair:!0});if(!i.valid){console.warn(`[loadData] Données réparées : ${i.errors.length} erreur(s), ${i.warnings.length} warning(s)`);for(const r of i.errors)console.warn(`  [${r.code}] ${r.message}`)}t.state.nodes=i.repaired?.nodes??s,t.state.connections=i.repaired?.connections??o,t.nodeIdCounter=t.state.nodes.length,t._nodeMapDirty=!0,Y(),t.state.nodes.forEach(r=>t.renderNode(r)),e.zoom!=null&&(t.state.zoom=e.zoom),e.panX!=null&&(t.state.panX=e.panX),e.panY!=null&&(t.state.panY=e.panY),e.mode&&(t.state.mode=e.mode),t.applyTransform(),t.forceRefreshConnections(),console.log("Données chargées:",e)}function Xn(t){t.editModal&&t.editModal.style.display==="block"&&(t.interaction.isNewNodeBeingEdited=!1,t.hideEditModal()),t.interaction.selectedNodeForMenu=null,t.interaction.selectedNodes.clear(),t.interaction.connectionMode=!1,t.interaction.connectionFromNode=null,t.state.nodes=[],t.state.poles=[],t.state.connections=[],t._nodeMapDirty=!0,Y(),t.polesContainer.innerHTML="",t.renderAllConnections(),document.activeElement&&document.activeElement.blur(),window.focus(),t.minimap&&t.minimap.update()}function Wn(t,e){e==="all"?t.state.statusFilters.size===2?t.state.statusFilters.clear():t.state.statusFilters=new Set(["neutral","priority"]):t.state.statusFilters.has(e)?t.state.statusFilters.delete(e):t.state.statusFilters.add(e),mt(t)}function mt(t){t.state.nodes.forEach(e=>{const n=document.getElementById(e.id);if(!n)return;t.state.statusFilters.has(e.status)?n.classList.remove("filtered"):n.classList.add("filtered")}),vt(t)}function vt(t){t.state.connections.forEach(e=>{const n=t.state.nodes.find(a=>a.id===e.from),s=t.state.nodes.find(a=>a.id===e.to),o=t.svgConnections.querySelector(`[data-connection-id="${e.id}"]`);if(!o)return;const i=n&&t.state.statusFilters.has(n.status),r=s&&t.state.statusFilters.has(s.status);i&&r?o.style.display="":o.style.display="none"})}class Kn{cellW;cellH;grid=new Map;nodePositions=new Map;constructor(e,n){this.cellW=e,this.cellH=n}key(e,n){return`${e},${n}`}cellCoords(e,n){return[Math.floor(e/this.cellW),Math.floor(n/this.cellH)]}build(e){this.grid.clear(),this.nodePositions.clear();for(const n of e)this.insert(n.id,n.x,n.y)}insert(e,n,s){const[o,i]=this.cellCoords(n,s),r=this.key(o,i);this.grid.has(r)||this.grid.set(r,new Set),this.grid.get(r).add(e),this.nodePositions.set(e,{x:n,y:s})}remove(e){const n=this.nodePositions.get(e);if(!n)return;const[s,o]=this.cellCoords(n.x,n.y),i=this.key(s,o),r=this.grid.get(i);r&&(r.delete(e),r.size===0&&this.grid.delete(i)),this.nodePositions.delete(e)}update(e,n,s){this.remove(e),this.insert(e,n,s)}queryRect(e,n,s,o){const i=new Set,[r,a]=this.cellCoords(e,n),[c,l]=this.cellCoords(e+s,n+o);for(let d=r-1;d<=c+1;d++)for(let u=a-1;u<=l+1;u++){const h=this.grid.get(this.key(d,u));if(h)for(const g of h)i.add(g)}return i}get size(){return this.nodePositions.size}}const $=300,_=120,ye=20;function te(t,e,n,s,o,i,r,a){return!(t+n<o||o+r<t||e+s<i||i+a<e)}function xe(t,e,n,s){const o=t.NODE_WIDTH+t.COLLISION_MARGIN,i=t.NODE_HEIGHT+t.COLLISION_MARGIN;if(s){const r=s.queryRect(e,n,o,i);for(const a of r){const c=t.state.nodes.find(l=>l.id===a);if(c&&te(e,n,o,i,c.x,c.y,o,i))return!1}return!0}for(const r of t.state.nodes)if(te(e,n,o,i,r.x,r.y,o,i))return!1;return!0}function yt(t,e,n){const s=t.state.nodes.length>50?Te(t):void 0;if(xe(t,e,n,s))return{x:e,y:n};const o=50,i=100;for(let r=1;r<i;r++){const a=r*o,c=[0,45,90,135,180,225,270,315];for(const l of c){const d=l*Math.PI/180,u=Math.round(e+a*Math.cos(d)),h=Math.round(n+a*Math.sin(d));if(xe(t,u,h,s))return{x:u,y:h}}}return{x:e,y:n}}function Te(t){const e=new Kn(t.NODE_WIDTH+t.COLLISION_MARGIN,t.NODE_HEIGHT+t.COLLISION_MARGIN);return e.build(t.state.nodes),e}function xt(t,e=0,n=1){const s=t.state.zoom||1,o=t.state.panX||0,i=t.state.panY||0,r=t.canvasArea.getBoundingClientRect(),a=280,c=120,l=30,d=(-i+r.height-c-l*2)/s,u=(-o+l)/s,h=r.width/s,g=Math.min(n,Math.floor(h/(a+l))),p=u+(h-g*(a+l))/2,f=e%g,m=Math.floor(e/g),y=p+f*(a+l),v=d-m*(c+l);return{x:Math.round(y),y:Math.round(v)}}function Gn(t,e,n,s){const o=t.NODE_WIDTH,i=t.NODE_HEIGHT,r=10,a=t.state.nodes.length>50?Te(t):void 0;let c=e,l=n,d=!0;const u=20;let h=0;for(;d&&h<u;){d=!1,h++;const g=a?[...a.queryRect(c,l,o,i)].map(p=>t.state.nodes.find(f=>f.id===p)).filter(Boolean):t.state.nodes;for(const p of g)if(p.id!==s&&te(c,l,o,i,p.x,p.y,o,i)){d=!0;const f=c+o/2,m=l+i/2,y=p.x+o/2,v=p.y+i/2,x=f-y,E=m-v,M=Math.sqrt(x*x+E*E);if(M<1){c+=r;continue}const B=x/M*r,de=E/M*r;c+=B,l+=de}}return{x:Math.round(c),y:Math.round(l)}}function Jn(t,e,n,s){if(e){const o=t.state.nodes.find(i=>i.id===e);if(o){const i=80+n%2*($+ye),r=_+60+Math.floor(n/2)*(_+ye),a=o.x+i,c=o.y+r;return yt(t,a,c)}}return xt(t,n,s)}const Qn=200,Zn=20;function es(t,e){const n=t.state.nodes.filter(l=>l.synthesized);if(n.length===0)return;const s=t.state.nodes.filter(l=>!l.synthesized);let o=0,i=1/0;if(s.length>0)for(const l of s){const d=l.x+$;d>o&&(o=d),l.y<i&&(i=l.y)}else i=0;const r=o+Qn,a=i,c=new Map;n.forEach((l,d)=>{c.set(l.id,{x:r,y:a+d*(_+Zn)})}),Ne(t,c,400)}function Ne(t,e,n=500,s){const o=[];for(const[a,c]of e){const l=t.state.nodes.find(u=>u.id===a);if(!l)continue;l.x=Math.round(c.x),l.y=Math.round(c.y);const d=document.getElementById(a);d&&(d.classList.add("layout-animating"),o.push(d),d.style.left=`${l.x}px`,d.style.top=`${l.y}px`)}let i;const r=()=>{t.renderAllConnections(),i=requestAnimationFrame(r)};i=requestAnimationFrame(r),setTimeout(()=>{cancelAnimationFrame(i),o.forEach(a=>a.classList.remove("layout-animating")),t.renderAllConnections(),t.minimap&&t.minimap.update(),t._nodeMapDirty=!0,s?.()},n+50)}const he=I("Collisions");function bt(t){const e=[],n=t.state.nodes;if(n.length<=50){for(let i=0;i<n.length;i++)for(let r=i+1;r<n.length;r++){const a=n[i],c=n[r];t.checkCollision(a.x,a.y,t.NODE_WIDTH,t.NODE_HEIGHT,c.x,c.y,t.NODE_WIDTH,t.NODE_HEIGHT)&&e.push({node1:a,node2:c})}return e}const s=Te(t),o=new Set;for(const i of n){const r=s.queryRect(i.x,i.y,t.NODE_WIDTH,t.NODE_HEIGHT);for(const a of r){if(a===i.id)continue;const c=i.id<a?`${i.id}|${a}`:`${a}|${i.id}`;if(o.has(c))continue;o.add(c);const l=n.find(d=>d.id===a);l&&t.checkCollision(i.x,i.y,t.NODE_WIDTH,t.NODE_HEIGHT,l.x,l.y,t.NODE_WIDTH,t.NODE_HEIGHT)&&e.push({node1:i,node2:l})}}return e}function ts(t){const e=bt(t);if(e.length===0)return he.info("Aucune collision détectée"),0;he.info(`${e.length} collision(s) détectée(s), résolution...`);const n=new Set;for(const{node2:s}of e)if(!n.has(s.id)){const o=t.findFreePosition(s.x,s.y);s.x=o.x,s.y=o.y,t.updateNodeElement(s),n.add(s.id),he.debug(`Node ${s.id} déplacé vers (${o.x}, ${o.y})`)}return n.size}function ns(t,e){const n=t.state.zoom,s=e.deltaY>0?.9:1.1,o=Math.max(.1,Math.min(3,n*s)),i=t.polesContainer.parentElement.getBoundingClientRect(),r=e.clientX-i.left,a=e.clientY-i.top,c=(r-t.state.panX)/n,l=(a-t.state.panY)/n;t.state.panX=r-c*o,t.state.panY=a-l*o,t.state.zoom=o,document.getElementById("current-zoom").textContent=`${Math.round(t.state.zoom*100)}%`,X(t)}function X(t){const e=`translate(${t.state.panX}px, ${t.state.panY}px) scale(${t.state.zoom})`;t.polesContainer.style.transform=e,t.svgConnections.style.transform=e;const n=Math.max(1,1/t.state.zoom);t.polesContainer.style.setProperty("--node-scale",String(n))}function ss(t,e){t.interaction.isPanning=!0,t.interaction.dragStartX=e.clientX-t.state.panX,t.interaction.dragStartY=e.clientY-t.state.panY,t.polesContainer.style.cursor="grabbing",document.body.style.cursor="grabbing"}function os(t,e){t.state.panX=e.clientX-t.interaction.dragStartX,t.state.panY=e.clientY-t.interaction.dragStartY,X(t)}function is(t){t.interaction.panRafId&&(cancelAnimationFrame(t.interaction.panRafId),t.interaction.panRafId=null),t.interaction.isPanning=!1,t.polesContainer.style.cursor="",document.body.style.cursor=""}function rs(t,e){const n=t.polesContainer.parentElement.getBoundingClientRect(),s=n.width/2,o=n.height/2;t.state.panX=s-e.x*t.state.zoom,t.state.panY=o-e.y*t.state.zoom,t.polesContainer.style.transition="transform 0.3s ease",t.svgConnections.style.transition="transform 0.3s ease",X(t),setTimeout(()=>{t.polesContainer.style.transition="",t.svgConnections.style.transition=""},300)}const W=I("TreeLayout"),be=200,je=350,as=100;function cs(t,e){const n=new Map;for(const o of t)o.synthesized||n.set(o.id,{id:o.id,children:[],parents:[],depth:-1,order:0});for(const o of e){if(o.type!=="implies")continue;const i=n.get(o.from),r=n.get(o.to);i&&r&&(i.children.push(o.to),r.parents.push(o.from))}const s=[];for(const[o,i]of n)i.parents.length===0&&s.push(o);return{graph:n,roots:s}}function ls(t,e){const n=new Set,s=[];for(const i of e)s.push({id:i,depth:0});for(;s.length>0;){const{id:i,depth:r}=s.shift(),a=t.get(i);if(a&&(r>a.depth&&(a.depth=r),!(n.has(i)&&r<=a.depth&&r!==a.depth))){n.add(i);for(const c of a.children){const l=t.get(c);l&&r+1>l.depth&&s.push({id:c,depth:r+1})}}}for(const[,i]of t)i.depth===-1&&(i.depth=0);const o=new Map;for(const[i,r]of t){const a=o.get(r.depth)||[];a.push(i),o.set(r.depth,a)}return o}function ds(t,e){const n=Math.max(...t.keys());for(let s=1;s<=n;s++){const o=t.get(s);if(!o||o.length<=1)continue;const i=t.get(s-1);if(!i)continue;const r=new Map;i.forEach((c,l)=>r.set(c,l));const a=new Map;for(const c of o){const l=e.get(c);if(!l||l.parents.length===0){a.set(c,1/0);continue}let d=0,u=0;for(const h of l.parents){const g=r.get(h);g!==void 0&&(d+=g,u++)}a.set(c,u>0?d/u:1/0)}o.sort((c,l)=>(a.get(c)??1/0)-(a.get(l)??1/0))}for(let s=n-1;s>=0;s--){const o=t.get(s);if(!o||o.length<=1)continue;const i=t.get(s+1);if(!i)continue;const r=new Map;i.forEach((c,l)=>r.set(c,l));const a=new Map;for(const c of o){const l=e.get(c);if(!l||l.children.length===0){a.set(c,1/0);continue}let d=0,u=0;for(const h of l.children){const g=r.get(h);g!==void 0&&(d+=g,u++)}a.set(c,u>0?d/u:1/0)}o.sort((c,l)=>(a.get(c)??1/0)-(a.get(l)??1/0))}}function us(t,e=0,n=0){const s=new Map,o=Math.max(...t.keys(),0);let i=0;const r=new Map;for(let c=0;c<=o;c++){const l=t.get(c);if(!l)continue;const d=(l.length-1)*je;r.set(c,d),d>i&&(i=d)}for(let c=0;c<=o;c++){const l=t.get(c);if(!l)continue;const d=r.get(c),u=(i-d)/2;for(let h=0;h<l.length;h++)s.set(l[h],{x:e+u+h*je,y:n+c*be})}const a=o*be+_;return{positions:s,width:i+$,height:a}}function hs(t){const e=new Set,n=[];for(const[s]of t){if(e.has(s))continue;const o=[],i=[s];for(;i.length>0;){const r=i.pop();if(e.has(r))continue;e.add(r),o.push(r);const a=t.get(r);if(a)for(const c of[...a.children,...a.parents])!e.has(c)&&t.has(c)&&i.push(c)}n.push(o)}return n}function ps(t,e){const{graph:n}=cs(t,e);if(n.size===0)return new Map;const s=hs(n),o=new Map,i=s.filter(l=>l.length>1),r=s.filter(l=>l.length===1).map(l=>l[0]);let a=0,c=0;for(const l of i){const d=new Map;for(const y of l)d.set(y,n.get(y));const u=l.filter(y=>d.get(y).parents.length===0),h=u.length>0?u:[l[0]],g=ls(d,h);ds(g,d);const{positions:p,width:f,height:m}=us(g,a,0);for(const[y,v]of p)o.set(y,v);a+=f+as,m>c&&(c=m)}if(r.length>0){const l=c>0?c+be:0,d=$+ye;r.forEach((u,h)=>{o.set(u,{x:h*d,y:l})})}return o}function gs(t){const e=t.state.nodes.filter(o=>!o.synthesized);if(e.length===0){W.info("Aucune vignette active pour le layout");return}if(t.state.nodes.some(o=>o.newlyImported)){W.info("Layout bloqué : vignettes newlyImported en attente");return}W.info(`Layout arbre : ${e.length} vignettes, ${t.state.connections.length} connexions`);const s=ps(e,t.state.connections);if(s.size===0){W.info("Aucune position calculée");return}Ne(t,s,500,()=>{Et(t)})}function Et(t){const e=t.state.nodes.filter(p=>!p.synthesized);if(e.length===0)return;let n=1/0,s=1/0,o=-1/0,i=-1/0;for(const p of e)p.x<n&&(n=p.x),p.y<s&&(s=p.y),p.x+$>o&&(o=p.x+$),p.y+_>i&&(i=p.y+_);const r=t.canvasArea.getBoundingClientRect(),a=r.width,c=r.height,l=t.state.zoom,d=(n+o)/2,u=(s+i)/2,h=a/2-d*l,g=c/2-u*l;t.state.panX=h,t.state.panY=g,t.polesContainer.style.transition="transform 0.3s ease",t.svgConnections.style.transition="transform 0.3s ease",X(t),setTimeout(()=>{t.polesContainer.style.transition="",t.svgConnections.style.transition=""},300)}function fs(t,e,n){n?t.interaction.selectedNodes.add(e.id):t.interaction.selectedNodes.delete(e.id),Ae(t,e),ae(t),document.dispatchEvent(new CustomEvent("nodeSelected",{detail:{nodeId:e.id,selected:n}}))}function Ae(t,e){const n=document.getElementById(e.id);n&&(t.interaction.selectedNodes.has(e.id)?n.classList.add("selected"):n.classList.remove("selected"))}function wt(t){t.interaction.selectedNodes.forEach(e=>{const n=document.getElementById(e);if(n){n.classList.remove("selected");const s=n.querySelector(".node-checkbox");s&&(s.checked=!1)}}),t.interaction.selectedNodes.clear(),ae(t)}function ms(t){t.state.nodes.forEach(e=>{t.interaction.selectedNodes.add(e.id),Ae(t,e);const n=document.getElementById(e.id);if(n){const s=n.querySelector(".node-checkbox");s&&(s.checked=!0)}}),ae(t)}function vs(t,e){const n=new Set;return e.forEach(s=>{t.state.connections.forEach(o=>{o.from===s&&!e.has(o.to)&&n.add(o.to),o.to===s&&!e.has(o.from)&&n.add(o.from)})}),n}let pe=null;function ae(t){pe&&clearTimeout(pe),pe=setTimeout(()=>ys(t),50)}function ys(t){let e=document.getElementById("selection-toolbar");const n=t.interaction.selectedNodes.size;n>0?(e||(e=Ct(t)),e.querySelector(".selection-count").textContent=`${n} vignette${n>1?"s":""} sélectionnée${n>1?"s":""}`,e.style.display="flex"):e&&(e.style.display="none");const s=document.getElementById("selection-count-indicator");s&&(s.textContent=n),document.dispatchEvent(new CustomEvent("selectionChanged",{detail:{count:n}}))}function Ct(t){const e=document.createElement("div");e.id="selection-toolbar",e.style.cssText=`
    position: absolute;
    top: 80px;
    left: 20px;
    background: var(--theme-btn-success);
    border: 1px solid var(--theme-btn-success-hover);
    border-radius: 8px;
    padding: 10px 15px;
    display: none;
    gap: 10px;
    align-items: center;
    z-index: 100;
  `;const n=document.createElement("span");n.className="selection-count",n.style.cssText="color: var(--theme-text-on-accent); font-size: 13px; font-weight: 600;";const s=document.createElement("button");s.textContent="🗑️ Supprimer",s.title="Supprimer les vignettes sélectionnées",s.style.cssText=`
    background: var(--theme-btn-danger);
    border: 1px solid var(--theme-btn-danger-hover);
    color: var(--theme-text-on-accent);
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 10px;
  `,s.addEventListener("click",()=>t.deleteSelectedNodes()),s.addEventListener("mouseenter",()=>{s.style.background="var(--theme-btn-danger-hover)"}),s.addEventListener("mouseleave",()=>{s.style.background="var(--theme-btn-danger)"});const o=document.createElement("button");return o.textContent="✕",o.title="Désélectionner tout",o.style.cssText=`
    background: transparent;
    border: none;
    color: var(--theme-text-on-accent);
    padding: 4px 8px;
    cursor: pointer;
    font-size: 16px;
  `,o.addEventListener("click",()=>wt(t)),e.appendChild(n),e.appendChild(s),e.appendChild(o),document.querySelector(".canvas-area").appendChild(e),e}function xs(t){t.contextMenu=document.createElement("div"),t.contextMenu.style.cssText=`
    position: fixed;
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border-hover);
    border-radius: 6px;
    padding: 8px 0;
    display: none;
    z-index: 1000;
    min-width: 180px;
  `,[{text:"📝 Créer une vignette",action:()=>{const n=parseInt(t.contextMenu.dataset.x,10),s=parseInt(t.contextMenu.dataset.y,10);console.log("Création vignette à:",{x:n,y:s}),St(t),t.showCreateModal(n,s)}}].forEach(({text:n,action:s})=>{const o=document.createElement("div");o.textContent=n,o.style.cssText=`
      padding: 8px 16px;
      cursor: pointer;
      color: var(--theme-text-primary);
      font-size: 14px;
    `,o.addEventListener("mouseenter",()=>o.style.background="var(--theme-bg-hover)"),o.addEventListener("mouseleave",()=>o.style.background=""),o.addEventListener("click",s),t.contextMenu.appendChild(o)}),document.body.appendChild(t.contextMenu)}function bs(t,e,n,s,o){t.contextMenu.dataset.x=Math.round(e),t.contextMenu.dataset.y=Math.round(n),t.contextMenu.style.left=`${s}px`,t.contextMenu.style.top=`${o}px`,t.contextMenu.style.display="block",console.log("Menu contextuel:",{canvasX:e,canvasY:n,screenX:s,screenY:o})}function St(t){t.contextMenu.style.display="none"}function Es(t){t.nodeMenu=document.createElement("div"),t.nodeMenu.style.cssText=`
    position: fixed;
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border-hover);
    border-radius: 6px;
    padding: 8px 0;
    display: none;
    z-index: 1000;
    min-width: 180px;
  `,[{text:"✏️ Éditer",action:"edit"},{text:"🔗 Connecter",action:"connect"},{text:"🗑️ Supprimer",action:"delete"}].forEach(n=>{const s=document.createElement("div");s.textContent=n.text,s.style.cssText=`
      padding: 8px 16px;
      cursor: pointer;
      color: var(--theme-text-primary);
      font-size: 14px;
    `,s.addEventListener("mouseenter",()=>s.style.background="var(--theme-bg-hover)"),s.addEventListener("mouseleave",()=>s.style.background=""),s.addEventListener("click",o=>{o.stopPropagation(),o.preventDefault();const i=t.interaction.selectedNodeForMenu;Mt(t),Lt(t,n.action,i)}),t.nodeMenu.appendChild(s)}),document.body.appendChild(t.nodeMenu)}function ws(t,e,n,s){t.interaction.selectedNodeForMenu=e,t.nodeMenu.style.left=`${n}px`,t.nodeMenu.style.top=`${s}px`,t.nodeMenu.style.display="block"}function Mt(t){t.nodeMenu.style.display="none",t.editModal&&t.editModal.style.display!=="block"&&(t.interaction.selectedNodeForMenu=null)}async function Lt(t,e,n){if(n)switch(e){case"edit":t.showEditModal(n);break;case"connect":t.enterConnectionMode(n),t.polesContainer.classList.add("connection-mode-waiting");break;case"delete":confirm("Supprimer ce nœud ?")&&await t.deleteNode(n);break}}function Cs(t){t.editModal=document.createElement("div"),t.editModal.style.cssText=`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border-hover);
    border-radius: 8px;
    padding: 20px;
    display: none;
    z-index: 1001;
    min-width: 400px;
    max-width: 600px;
  `,t.editModal.innerHTML=`
    <h3 style="color: var(--theme-text-primary); margin-bottom: 15px;">Éditer </h3>
    <textarea id="edit-modal-textarea" class="pole-text-input" tabindex="0" autofocus spellcheck="true" placeholder="Texte du pôle..." style="
      width: 100%;
      min-height: 100px;
      background: var(--theme-bg-surface);
      border: 1px solid var(--theme-border-hover);
      color: var(--theme-text-primary);
      padding: 10px;
      border-radius: 6px;
      font-family: inherit;
      font-size: 14px;
      margin-bottom: 10px;
      resize: vertical;
    "></textarea>

    <label style="display: block; color: var(--theme-text-primary); margin-bottom: 6px; font-size: 13px;">Statut</label>
    <select class="pole-status-select" style="
      width: 100%;
      background: var(--theme-bg-surface);
      border: 1px solid var(--theme-border-hover);
      color: var(--theme-text-primary);
      padding: 10px;
      border-radius: 6px;
      font-family: inherit;
      font-size: 14px;
      margin-bottom: 10px;
      cursor: pointer;
    ">
      <option value="neutral">○ Neutre</option>
      <option value="priority">🎯 Priorité</option>
    </select>

    <input class="pole-tags-input" placeholder="Tags (séparés par des espaces, ex: #tech #ai)" style="
      width: 100%;
      background: var(--theme-bg-surface);
      border: 1px solid var(--theme-border-hover);
      color: var(--theme-text-primary);
      padding: 10px;
      border-radius: 6px;
      font-family: inherit;
      font-size: 14px;
      margin-bottom: 15px;
    ">
    <div style="display: flex; gap: 10px; justify-content: flex-end;">
      <button class="modal-cancel-btn" style="
        background: var(--theme-btn-bg);
        border: 1px solid var(--theme-border-hover);
        color: var(--theme-text-primary);
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
      ">Annuler</button>
      <button class="modal-save-btn" style="
        background: var(--theme-btn-success);
        border: 1px solid var(--theme-btn-success-hover);
        color: var(--theme-text-on-accent);
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
      ">Sauvegarder</button>
    </div>
  `,document.body.appendChild(t.editModal);const e=t.editModal.querySelector(".modal-cancel-btn"),n=t.editModal.querySelector(".modal-save-btn");e.addEventListener("mousedown",s=>{s.preventDefault(),s.stopPropagation()}),e.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),t.hideEditModal()}),n.addEventListener("mousedown",s=>{s.preventDefault(),s.stopPropagation()}),n.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),t.saveEditModal()}),t.editModal.addEventListener("click",s=>s.stopPropagation()),t.editModal.addEventListener("mousedown",s=>s.stopPropagation()),t.editModal.addEventListener("keydown",s=>{s.ctrlKey&&s.key==="Enter"&&(s.preventDefault(),t.saveEditModal()),s.key==="Escape"&&(s.preventDefault(),t.hideEditModal())})}async function Ss(t,e,n){t.interaction.pendingNodePosition={x:e,y:n},t.interaction.isCreatingNewNode=!0,t.interaction.selectedNodeForMenu=null,t.interaction.isNewNodeBeingEdited=!1,It(t),await Is(),ce(t,!0);const s=t.editModal.querySelector(".pole-text-input"),o=t.editModal.querySelector(".pole-status-select"),i=t.editModal.querySelector(".pole-tags-input");s.value="",s.placeholder="Entrez le texte de la vignette...",o&&(o.value="neutral"),i.value="",t.editModal.style.display="block",setTimeout(async()=>{window.fgraph&&window.fgraph.focusMainWindow&&await window.fgraph.focusMainWindow(),s.focus(),console.log("[Canvas] Focus textarea, activeElement:",document.activeElement?.tagName)},100)}async function Ms(t,e){t.interaction.selectedNodeForMenu=e,t.interaction.isCreatingNewNode=!1,t.interaction.pendingNodePosition=null,document.dispatchEvent(new CustomEvent("nodeEditStart",{detail:{nodeId:e.id}})),ce(t,!0);const n=t.editModal.querySelector(".pole-text-input"),s=t.editModal.querySelector(".pole-status-select"),o=t.editModal.querySelector(".pole-tags-input");n.value=e.text||"",n.placeholder="Texte du pôle...",s&&(s.value=e.status||"neutral"),o.value=e.tags.join(" "),t.editModal.style.display="block",setTimeout(async()=>{window.fgraph&&window.fgraph.focusMainWindow&&await window.fgraph.focusMainWindow(),n.focus(),console.log("[Canvas] Edit modal focus, activeElement:",document.activeElement?.tagName)},100)}function Ee(t){t.editModal.style.display="none",t.interaction.selectedNodeForMenu=null,t.interaction.isCreatingNewNode=!1,t.interaction.pendingNodePosition=null,ce(t,!1)}function Ls(t){const e=t.editModal.querySelector(".pole-text-input").value,n=t.editModal.querySelector(".pole-status-select").value,o=t.editModal.querySelector(".pole-tags-input").value.split(/\s+/).map(r=>r.trim()).filter(r=>r.startsWith("#")&&r.length>1);if(t.interaction.isCreatingNewNode&&t.interaction.pendingNodePosition){const{x:r,y:a}=t.interaction.pendingNodePosition,c=t.createNode(r,a,e,n,o);console.log("Nouvelle vignette créée via modal:",c.id),document.dispatchEvent(new CustomEvent("nodeCreated",{detail:{nodeId:c.id}})),Ee(t);return}const i=t.interaction.selectedNodeForMenu;if(!i){console.error("Aucun node sélectionné pour la sauvegarde");return}i.text=e,i.status=n,i.tags=o,t.updateNodeElement(i),document.dispatchEvent(new CustomEvent("nodeEdited",{detail:{nodeId:i.id}})),t.interaction.isNewNodeBeingEdited=!1,Ee(t)}function It(t){const e=t.polesContainer.querySelectorAll("input, select, button, [tabindex]");e.forEach(n=>n.blur()),console.log("[Canvas] Blurred",e.length,"focusable elements in nodes")}async function Is(t){const e=document.getElementById("llm-webview");if(e)try{e.blur(),e.executeJavaScript(`
        if (document.activeElement) {
          document.activeElement.blur();
        }
        document.body.focus();
      `).catch(()=>{}),console.log("[Canvas] Webview blurred")}catch(n){console.warn("[Canvas] Could not blur webview:",n)}if(window.fgraph&&window.fgraph.focusMainWindow)try{await window.fgraph.focusMainWindow()}catch(n){console.warn("[Canvas] Could not focus main window:",n)}}function ce(t,e){const n=document.getElementById("llm-webview"),s=document.querySelector(".llm-panel");n&&(e?(n.setAttribute("inert",""),s&&s.setAttribute("inert",""),console.log("[Canvas] Webview set to inert")):(n.removeAttribute("inert"),s&&s.removeAttribute("inert"),console.log("[Canvas] Webview inert removed")))}function Ts(t){t.connectionTypeMenu=document.createElement("div"),t.connectionTypeMenu.style.cssText=`
    position: fixed;
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border-hover);
    border-radius: 6px;
    padding: 8px 0;
    display: none;
    z-index: 1000;
    min-width: 200px;
  `,[{text:"→ Implique",type:"implies",description:"Relation de cause à effet"},{text:"↔ Résonance",type:"resonance",description:"Renforce mutuellement"}].forEach(s=>{const o=document.createElement("div");o.style.cssText=`
      padding: 8px 16px;
      cursor: pointer;
      color: var(--theme-text-primary);
      font-size: 14px;
      border-bottom: 1px solid var(--theme-border-hover);
    `,o.innerHTML=`
      <div style="font-weight: 600; margin-bottom: 4px;">${s.text}</div>
      <div style="font-size: 11px; color: var(--theme-text-muted);">${s.description}</div>
    `,o.addEventListener("mouseenter",()=>o.style.background="var(--theme-bg-hover)"),o.addEventListener("mouseleave",()=>o.style.background=""),o.addEventListener("click",()=>{Tt(t,s.type),Pe(t)}),t.connectionTypeMenu.appendChild(o)});const n=t.connectionTypeMenu.lastChild;n&&(n.style.borderBottom="none"),document.body.appendChild(t.connectionTypeMenu)}function Ns(t,e,n,s,o){t.interaction.pendingConnection={fromNode:e,toNode:n},t.connectionTypeMenu.style.left=`${s}px`,t.connectionTypeMenu.style.top=`${o}px`,t.connectionTypeMenu.style.display="block"}function Pe(t){t.connectionTypeMenu.style.display="none",t.interaction.pendingConnection=null,t.exitConnectionMode()}function Tt(t,e){if(!t.interaction.pendingConnection)return;const{fromNode:n,toNode:s}=t.interaction.pendingConnection;Pe(t),t.createConnection(n,s,e),t.exitConnectionMode()}function As(t){t.connectionContextMenu=document.createElement("div"),t.connectionContextMenu.style.cssText=`
    position: fixed;
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border-hover);
    border-radius: 6px;
    padding: 8px 0;
    display: none;
    z-index: 1000;
    min-width: 150px;
  `;const e=document.createElement("div");e.textContent="🗑️ Supprimer le lien",e.style.cssText=`
    padding: 8px 16px;
    cursor: pointer;
    color: var(--theme-text-primary);
    font-size: 14px;
  `,e.addEventListener("mouseenter",()=>e.style.background="var(--theme-bg-hover)"),e.addEventListener("mouseleave",()=>e.style.background=""),e.addEventListener("click",()=>{t.interaction.selectedConnectionForMenu&&t.deleteConnection(t.interaction.selectedConnectionForMenu),Nt(t)}),t.connectionContextMenu.appendChild(e),document.body.appendChild(t.connectionContextMenu)}function Ps(t,e,n,s){t.interaction.selectedConnectionForMenu=e,t.connectionContextMenu.style.left=`${n}px`,t.connectionContextMenu.style.top=`${s}px`,t.connectionContextMenu.style.display="block"}function Nt(t){t.connectionContextMenu&&(t.connectionContextMenu.style.display="none"),t.interaction.selectedConnectionForMenu=null}function Os(t,e){const n=e.closest(".pole");return n?t.state.nodes.find(s=>s.id===n.id):null}function Ds(t,e,n){if(e.button!==0||e.ctrlKey||!n||!n.id)return;(t.interaction.draggedNode||t.interaction.isDragging||t.interaction.dragMoveListener||t.interaction.dragUpListener)&&we(t),t.interaction.isPanning&&t.stopPan();const s=t.interaction.selectedNodes.has(n.id)&&t.interaction.selectedNodes.size>1;let o;s?(o=t.state.nodes.filter(v=>t.interaction.selectedNodes.has(v.id)),console.log(`startDragNode: déplacement multiple de ${o.length} vignettes`)):(o=[n],console.log("startDragNode pour:",n.id.substring(0,20),"pos:",n.x,n.y));const i=new Map;o.forEach(v=>{i.set(v.id,{x:v.x,y:v.y})});const r=e.clientX,a=e.clientY,c=3;t.interaction.isDragging=!1,t.interaction.draggedNode=n,t.interaction.draggedNodes=o;const l=t.canvasArea.getBoundingClientRect(),d=(e.clientX-l.left-t.state.panX)/t.state.zoom,u=(e.clientY-l.top-t.state.panY)/t.state.zoom;t.interaction.dragStartX=d-n.x,t.interaction.dragStartY=u-n.y;const h=new Map;o.forEach(v=>{const x=document.getElementById(v.id);x&&(h.set(v.id,x),x.style.zIndex="9999")});let g=e.clientX,p=e.clientY,f=!1;const m=v=>{g=v.clientX,p=v.clientY;const x=Math.sqrt(Math.pow(g-r,2)+Math.pow(p-a,2));!f&&x>c&&(f=!0,t.interaction.isDragging=!0,h.forEach(E=>E.classList.add("dragging")),document.dispatchEvent(new CustomEvent("nodeDragStart",{detail:{nodeId:n.id,isMultiDrag:s}}))),f&&(t.interaction.dragRafId&&cancelAnimationFrame(t.interaction.dragRafId),t.interaction.dragRafId=requestAnimationFrame(()=>{if(t.interaction.isDragging&&t.interaction.draggedNode){const E=(g-l.left-t.state.panX)/t.state.zoom,M=(p-l.top-t.state.panY)/t.state.zoom,B=Math.round(E-t.interaction.dragStartX),de=Math.round(M-t.interaction.dragStartY),_e=i.get(n.id),nn=B-_e.x,sn=de-_e.y;o.forEach(P=>{const Fe=i.get(P.id);P.x=Fe.x+nn,P.y=Fe.y+sn;const ue=h.get(P.id);ue&&(ue.style.left=`${P.x}px`,ue.style.top=`${P.y}px`),t.updateNodeConnections(P.id)})}}))},y=v=>{h.forEach(x=>{x.classList.remove("dragging"),x.style.zIndex=""}),t.interaction.draggedNode&&f&&(t.updateConnections(),document.dispatchEvent(new CustomEvent("nodeDragEnd",{detail:{nodeId:t.interaction.draggedNode.id,isMultiDrag:s,nodeIds:o.map(x=>x.id)}}))),we(t)};t.interaction.dragMoveListener=m,t.interaction.dragUpListener=y,document.addEventListener("mousemove",m),document.addEventListener("mouseup",y)}function we(t){if(t.interaction.dragRafId&&(cancelAnimationFrame(t.interaction.dragRafId),t.interaction.dragRafId=null),t.interaction.draggedNodes&&t.interaction.draggedNodes.length>0)t.interaction.draggedNodes.forEach(e=>{const n=document.getElementById(e.id);n&&(n.classList.remove("dragging"),n.style.zIndex="")});else if(t.interaction.draggedNode){const e=document.getElementById(t.interaction.draggedNode.id);e&&(e.classList.remove("dragging"),e.style.zIndex="")}t.interaction.dragMoveListener&&(document.removeEventListener("mousemove",t.interaction.dragMoveListener),t.interaction.dragMoveListener=null),t.interaction.dragUpListener&&(document.removeEventListener("mouseup",t.interaction.dragUpListener),t.interaction.dragUpListener=null),t.interaction.isDragging=!1,t.interaction.draggedNode=null,t.interaction.draggedNodes=[]}function ks(t){t._nodeDelegationSetUp||(t._nodeDelegationSetUp=!0,t.polesContainer.addEventListener("mousedown",e=>{const n=e.target;if(n.tagName==="SELECT"||n.tagName==="INPUT"||n.classList.contains("pole-menu")||n.classList.contains("pole-connect-btn"))return;const s=n.closest(".pole");if(!s)return;e.stopPropagation();const o=t.state.nodes.find(i=>i.id===s.id);o&&t.startDragNode(e,o)}),t.polesContainer.addEventListener("dblclick",e=>{if(!e.target.closest(".pole"))return;e.stopPropagation();const s=t.getNodeFromElement(e.target);s&&t.centerOnNode(s)}),t.polesContainer.addEventListener("click",e=>{const n=e.target.closest(".pole");if(!n)return;const s=e.target;if(s.tagName==="SELECT"||s.tagName==="INPUT"||s.classList.contains("pole-menu")||s.classList.contains("pole-connect-btn"))return;e.stopPropagation();const o=t.getNodeFromElement(e.target);if(o){if(o.newlyImported&&(o.newlyImported=!1,n.classList.remove("newly-imported")),n.classList.contains("friction-vignette")&&!n.classList.contains("friction-seen")&&n.classList.add("friction-seen"),e.ctrlKey){const i=n.querySelector(".node-checkbox"),r=t.interaction.selectedNodes.has(o.id);t.toggleNodeSelection(o,!r),i&&(i.checked=!r);return}t.interaction.connectionMode&&(t.interaction.connectionFromNode?t.showConnectionTypeMenu(t.interaction.connectionFromNode,o,e.clientX,e.clientY):(t.enterConnectionMode(o),t.polesContainer.classList.remove("connection-mode-waiting")))}}))}function Rs(t,e,n,s="",o="neutral",i=[],r=!1,a={}){let c={x:e,y:n};r||(c=t.findFreePosition(e,n),console.log(`Position ajustée: (${e}, ${n}) → (${c.x}, ${c.y})`));const l={id:`n_${crypto.randomUUID()}`,x:Math.round(c.x),y:Math.round(c.y),text:s,status:o,tags:i,poleId:null,created:new Date().toISOString(),imported:!1,newlyImported:a.newlyImported||!1};return console.log("Node créé:",l),t.state.nodes.push(l),t._nodeMapDirty=!0,Oe(t,l),document.dispatchEvent(new CustomEvent("nodeCreated",{detail:{nodeId:l.id}})),l}function Oe(t,e){const n=document.createElement("div");let s=`pole status-${e.status}${e.reinjected?" reinjected":""}${e.synthesized?" synthesized":""}`;e.captureSource&&(s+=" from-capture",n.setAttribute("data-capture-role",e.captureSource.role||"assistant")),e.newlyImported&&(s+=" newly-imported");const o=e.tags&&e.tags.some(p=>p.toLowerCase()==="#friction"||p.toLowerCase()==="friction");(e.isFriction||o)&&(s+=" friction-vignette"),n.className=s,n.id=e.id,n.style.left=`${e.x}px`,n.style.top=`${e.y}px`;const i=document.createElement("div");i.className="pole-header";const r=document.createElement("input");r.type="checkbox",r.className="node-checkbox",r.tabIndex=-1,r.checked=t.interaction.selectedNodes.has(e.id),r.addEventListener("click",p=>{p.stopPropagation()}),r.addEventListener("change",p=>{p.stopPropagation(),t.toggleNodeSelection(e,r.checked)});const a=document.createElement("select");a.className="pole-status-select-inline",a.tabIndex=-1,a.innerHTML=`
          <option value="neutral">○</option>
          <option value="priority">🎯</option>
      `,a.value=e.status||"neutral",a.addEventListener("click",p=>{p.stopPropagation()}),a.addEventListener("change",p=>{p.stopPropagation(),t.cycleNodeStatus(e),a.value=e.status});const c=document.createElement("span");c.className="pole-connect-btn",c.textContent="🔗",c.title="Créer une connexion (L)",c.addEventListener("click",p=>{p.stopPropagation(),t.enterConnectionMode(e),t.polesContainer.classList.add("connection-mode-waiting")});const l=document.createElement("span");l.className="pole-menu",l.textContent="⋮",l.addEventListener("click",p=>{p.stopPropagation(),t.showNodeMenu(e,p.clientX,p.clientY)}),i.appendChild(r),i.appendChild(a),i.appendChild(c),i.appendChild(l);let d=null;if(e.captureSource){d=document.createElement("div"),d.className="capture-meta-bar";const p={claude:"🟠",chatgpt:"🟢",openai:"🟢",gemini:"🔵",unknown:"💬"},f=p[e.captureSource.platform?.toLowerCase()]||p.unknown,y={user:"User",thinking:"Thinking",assistant:"Assistant"}[e.captureSource.role]||"Message";d.innerHTML=`
      <span class="capture-meta-platform">${f} ${e.captureSource.platform||"unknown"}</span>
      <span class="capture-meta-role capture-role-${e.captureSource.role}">${y}</span>
    `}const u=document.createElement("div");u.className="pole-content",u.textContent=e.text||"Nouvelle vignette";const h=document.createElement("div");h.className="pole-tags",e.tags.forEach(p=>{const f=document.createElement("span");f.className="pole-tag",f.textContent=p,h.appendChild(f)});const g=document.createElement("div");g.className="node-accent-bar",n.appendChild(g),["top","bottom","left","right"].forEach(p=>{const f=document.createElement("div");f.className=`node-port port-${p}`,n.appendChild(f)}),n.appendChild(i),d&&n.appendChild(d),n.appendChild(u),n.appendChild(h),ks(t),t.polesContainer.appendChild(n)}function Ce(t,e){const n=document.getElementById(e.id);if(!n)return;const s=t.interaction.selectedNodes.has(e.id),o=e.reinjected?" reinjected":"",i=e.synthesized?" synthesized":"",r=e.captureSource?" from-capture":"",a=e.newlyImported?" newly-imported":"",c=e.tags&&e.tags.some(p=>p.toLowerCase()==="#friction"||p.toLowerCase()==="friction"),l=e.isFriction||c?" friction-vignette":"";if(n.className=`pole status-${e.status}${s?" selected":""}${o}${i}${r}${a}${l}`,e.captureSource){n.setAttribute("data-capture-role",e.captureSource.role||"assistant");let p=n.querySelector(".capture-meta-bar");if(!p){p=document.createElement("div"),p.className="capture-meta-bar";const x=n.querySelector(".pole-header");x&&x.nextSibling?n.insertBefore(p,x.nextSibling):n.appendChild(p)}const f={claude:"🟠",chatgpt:"🟢",openai:"🟢",gemini:"🔵",unknown:"💬"},m=f[e.captureSource.platform?.toLowerCase()]||f.unknown,v={user:"User",thinking:"Thinking",assistant:"Assistant"}[e.captureSource.role]||"Message";p.innerHTML=`
      <span class="capture-meta-platform">${m} ${e.captureSource.platform||"unknown"}</span>
      <span class="capture-meta-role capture-role-${e.captureSource.role}">${v}</span>
    `}n.style.left=`${e.x}px`,n.style.top=`${e.y}px`;const d=n.querySelector(".pole-status-badge");d&&(d.textContent=At(e.status));const u=n.querySelector(".pole-status-select-inline");u&&u.value!==e.status&&(u.value=e.status);const h=n.querySelector(".pole-content");h&&(h.textContent=e.text||"Nouvelle vignette",Y(e.id));const g=n.querySelector(".pole-tags");g&&(g.innerHTML="",e.tags.forEach(p=>{const f=document.createElement("span");f.className="pole-tag",f.textContent=p,g.appendChild(f)})),t.renderAllConnections()}async function $s(t,e,n=!1){console.log("[Canvas] deleteNode called for:",e.id);const s=document.getElementById(e.id);t.interaction.selectedNodeForMenu&&t.interaction.selectedNodeForMenu.id===e.id&&(t.interaction.isNewNodeBeingEdited=!1,t.editModal.style.display="none",t.interaction.selectedNodeForMenu=null),t.interaction.selectedNodes.has(e.id)&&t.interaction.selectedNodes.delete(e.id),t.state.connections=t.state.connections.filter(o=>o.from!==e.id&&o.to!==e.id),t.state.nodes=t.state.nodes.filter(o=>o.id!==e.id),t._nodeMapDirty=!0,Y(e.id),console.log("[Canvas] Node removed from state, remaining nodes:",t.state.nodes.length),t.renderAllConnections(),document.dispatchEvent(new CustomEvent("nodeDeleted",{detail:{nodeId:e.id}})),s&&(s.style.visibility="hidden",s.style.pointerEvents="none",setTimeout(()=>{s.remove(),console.log("[Canvas] DOM element removed after delay")},150)),t.updateSelectionToolbar(),n||De()}async function _s(t){const e=Array.from(t.interaction.selectedNodes),n=e.length;if(n===0)return;const s=n===1?"Supprimer cette vignette ?":`Supprimer ces ${n} vignettes ?`;if(confirm(s)){console.log(`[Canvas] Deleting ${n} selected nodes`);for(const o of e){const i=t.state.nodes.find(r=>r.id===o);i&&await t.deleteNode(i,!0)}De(),console.log(`[Canvas] Deleted ${n} nodes`)}}async function De(t){const e=document.getElementById("llm-webview");if(e)try{e.blur(),e.executeJavaScript(`
        if (document.activeElement) {
          document.activeElement.blur();
        }
        document.body.focus();
      `).catch(()=>{}),console.log("[Canvas] Webview blurred after deletion")}catch(n){console.warn("[Canvas] Could not blur webview:",n)}if(window.fgraph&&window.fgraph.focusMainWindow)try{await window.fgraph.focusMainWindow(),console.log("[Canvas] Main window focus requested via IPC")}catch(n){console.warn("[Canvas] Could not focus main window:",n)}}function Fs(t){console.log("[Canvas] Force refresh - recreating all DOM elements"),t._nodeMapDirty=!0,Y(),t.polesContainer.innerHTML="",t.svgConnections.innerHTML="",t.state.nodes.forEach(e=>Oe(t,e)),t.renderAllConnections(),window.focus(),document.body.focus(),console.log("[Canvas] Force refresh complete")}function At(t){return{neutral:"○",priority:"🎯"}[t]||"○"}function Bs(t,e){const n=["neutral","priority"],s=n.indexOf(e.status),o=n[(s+1)%n.length];if(o==="priority")for(const i of t.state.nodes)i.id!==e.id&&i.status==="priority"&&(i.status="neutral",Ce(t,i));e.status=o,Ce(t,e)}class Hs{polesContainer;svgConnections;canvasArea;state;interaction;contextMenu;nodeMenu;editModal;connectionTypeMenu;connectionContextMenu;minimap;nodeIdCounter;constructor(){this.polesContainer=document.getElementById("poles-container"),this.svgConnections=document.getElementById("connections"),this.canvasArea=document.querySelector(".canvas-area"),this.state={nodes:[],poles:[],connections:[],pendingConnections:[],zoom:1,panX:0,panY:0,mode:"explorer",statusFilters:new Set(["neutral","priority"])},this.interaction={isDragging:!1,isPanning:!1,draggedNode:null,draggedNodes:[],dragStartX:0,dragStartY:0,connectionMode:!1,connectionFromNode:null,selectedNodeForMenu:null,selectedConnectionForMenu:null,selectedNodes:new Set,dragMoveListener:null,dragUpListener:null,dragRafId:null,panRafId:null},this.contextMenu=null,this.nodeMenu=null,this.editModal=null,this.connectionTypeMenu=null,this.connectionContextMenu=null,this.minimap=null,this.nodeIdCounter=0,this._nodeMap=null,this._nodeMapDirty=!0,this.init()}updateNodeConnections(e){jn(this,e)}init(){this.setupEventListeners(),this.createContextMenu(),this.createNodeMenu(),this.createEditModal(),this.createConnectionTypeMenu(),this.createConnectionContextMenu(),this.minimap=new kn(this),console.log("CanvasManager initialisé")}setupEventListeners(){this.canvasArea.addEventListener("contextmenu",e=>{if(e.target.closest(".pole"))return;e.preventDefault();const n=this.canvasArea.getBoundingClientRect(),s=(e.clientX-n.left-this.state.panX)/this.state.zoom,o=(e.clientY-n.top-this.state.panY)/this.state.zoom;this.showContextMenu(s,o,e.clientX,e.clientY)}),this.canvasArea.addEventListener("mousedown",e=>{if(e.button===1){e.preventDefault(),this.startPan(e);return}if(e.button===0&&(e.target===this.canvasArea||e.target===this.polesContainer||e.target===this.svgConnections)&&!this.interaction.draggedNode&&!this.interaction.isDragging){if(e.preventDefault(),this.interaction.connectionMode){this.exitConnectionMode();return}this.startPan(e)}}),document.addEventListener("mousemove",e=>{this.interaction.isPanning&&!this.interaction.isDragging&&!this.interaction.draggedNode&&(this.interaction.panRafId&&cancelAnimationFrame(this.interaction.panRafId),this.interaction.panRafId=requestAnimationFrame(()=>{this.interaction.panRafId=null,this.interaction.isPanning&&this.updatePan(e)}))}),document.addEventListener("mouseup",()=>{this.interaction.isPanning&&this.stopPan()}),document.addEventListener("wheel",e=>{const n=document.querySelector(".canvas-area");n&&n.contains(e.target)&&(e.preventDefault(),this.handleZoom(e))},{passive:!1}),document.addEventListener("keydown",e=>{e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA"||e.target.tagName==="SELECT"||((e.key==="l"||e.key==="L")&&(e.preventDefault(),this.toggleConnectionModeWaiting()),e.key==="Escape"&&(this.interaction.connectionMode&&this.exitConnectionMode(),this.hideContextMenu(),this.hideNodeMenu(),this.hideConnectionTypeMenu(),this.hideConnectionContextMenu()))}),document.addEventListener("click",e=>{this.editModal&&this.editModal.contains(e.target)||(this.contextMenu&&!this.contextMenu.contains(e.target)&&this.hideContextMenu(),this.nodeMenu&&!this.nodeMenu.contains(e.target)&&this.hideNodeMenu(),this.connectionTypeMenu&&!this.connectionTypeMenu.contains(e.target)&&this.hideConnectionTypeMenu(),this.connectionContextMenu&&!this.connectionContextMenu.contains(e.target)&&this.hideConnectionContextMenu())})}get NODE_WIDTH(){return 300}get NODE_HEIGHT(){return 120}get COLLISION_MARGIN(){return 20}checkCollision(e,n,s,o,i,r,a,c){return te(e,n,s,o,i,r,a,c)}isPositionFree(e,n){return xe(this,e,n)}findFreePosition(e,n){return yt(this,e,n)}getVisibleBottomPosition(e=0,n=1){return xt(this,e,n)}getSmartImportPosition(e,n,s){return Jn(this,e,n,s)}relocateSynthesizedNodes(e){es(this)}animateNodesToPositions(e,n=500,s){Ne(this,e,n,s)}applyTreeLayout(){gs(this)}fitViewportToNodes(){Et(this)}createNode(e,n,s="",o="neutral",i=[],r=!1,a={}){return Rs(this,e,n,s,o,i,r,a)}renderNode(e){Oe(this,e)}updateNodeElement(e){Ce(this,e)}async deleteNode(e,n=!1){await $s(this,e,n)}async deleteSelectedNodes(){await _s(this)}async _blurWebview(){await De()}forceRefreshCanvas(){Fs(this)}getStatusIcon(e){return At(e)}cycleNodeStatus(e){Bs(this,e)}toggleNodeSelection(e,n){fs(this,e,n)}updateNodeSelectionVisual(e){Ae(this,e)}clearSelection(){wt(this)}selectAllNodes(){ms(this)}getConnectedNodes(e){return vs(this,e)}updateSelectionToolbar(){ae(this)}createSelectionToolbar(){return Ct(this)}adjustPositionForCollisions(e,n,s){return Gn(this,e,n,s)}getNodeFromElement(e){return Os(this,e)}startDragNode(e,n){Ds(this,e,n)}cleanupDrag(){we(this)}enterConnectionMode(e){Rn(this,e)}exitConnectionMode(){pt(this)}toggleConnectionModeWaiting(){$n(this)}createConnection(e,n,s="implies",o=null){_n(this,e,n,s,o)}_scheduleConnectionRender(){gt(this)}queueConnection(e,n,s="implies",o=null){Fn(this,e,n,s,o)}processPendingConnections(){Bn(this)}_waitForDOMStable(e=500){return ft(this,e)}deleteConnection(e){Hn(this,e)}renderAllConnections(){U(this)}forceRefreshConnections(){qn(this)}rebuildAllConnections(){zn(this)}updateConnections(){Vn(this)}_getNodeCenter(e){return T(this,e)}renderConnection(e){re(this,e)}handleZoom(e){ns(this,e)}applyTransform(){X(this)}startPan(e){ss(this,e)}updatePan(e){os(this,e)}stopPan(){is(this)}centerOnNode(e){rs(this,e)}createContextMenu(){xs(this)}showContextMenu(e,n,s,o){bs(this,e,n,s,o)}hideContextMenu(){St(this)}createNodeMenu(){Es(this)}showNodeMenu(e,n,s){ws(this,e,n,s)}hideNodeMenu(){Mt(this)}async handleNodeMenuAction(e,n){await Lt(this,e,n)}createEditModal(){Cs(this)}async showCreateModal(e,n){await Ss(this,e,n)}_blurAllNodeElements(){It(this)}_setWebviewInert(e){ce(this,e)}async showEditModal(e){await Ms(this,e)}hideEditModal(){Ee(this)}saveEditModal(){Ls(this)}createConnectionTypeMenu(){Ts(this)}showConnectionTypeMenu(e,n,s,o){Ns(this,e,n,s,o)}hideConnectionTypeMenu(){Pe(this)}handleConnectionTypeSelection(e){Tt(this,e)}createConnectionContextMenu(){As(this)}showConnectionContextMenu(e,n,s){Ps(this,e,n,s)}hideConnectionContextMenu(){Nt(this)}detectCollisions(){return bt(this)}resolveAllCollisions(){return ts(this)}toggleStatusFilter(e){Wn(this,e)}applyFilters(){mt(this)}updateConnectionsVisibility(){vt(this)}getData(){return Un(this)}loadData(e){Yn(this,e)}clear(){Xn(this)}}class qs{app;maxSize;undoStack;redoStack;isRestoring;constructor(e,n=50){this.app=e,this.maxSize=n,this.undoStack=[],this.redoStack=[],this.isRestoring=!1,this.setupKeyboardShortcuts()}setupKeyboardShortcuts(){document.addEventListener("keydown",e=>{e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA"||(e.ctrlKey&&e.key==="z"&&!e.shiftKey&&(e.preventDefault(),this.undo()),(e.ctrlKey&&e.key==="y"||e.ctrlKey&&e.shiftKey&&e.key==="z")&&(e.preventDefault(),this.redo()))})}saveState(e=""){if(this.isRestoring)return;const n=this.captureState();if(this.undoStack.length>0){const s=this.undoStack[this.undoStack.length-1];if(this.statesAreEqual(s.data,n))return}this.undoStack.push({data:n,action:e,timestamp:Date.now()}),this.undoStack.length>this.maxSize&&this.undoStack.shift(),this.redoStack=[],this.updateUI(),e&&console.log(`[History] Saved: ${e} (${this.undoStack.length} états)`)}captureState(){return{nodes:JSON.parse(JSON.stringify(this.app.canvas.state.nodes)),connections:JSON.parse(JSON.stringify(this.app.canvas.state.connections))}}statesAreEqual(e,n){return JSON.stringify(e)===JSON.stringify(n)}undo(){if(this.undoStack.length===0){this.app.showNotification("Rien à annuler");return}const e=this.captureState();this.redoStack.push({data:e,action:"undo",timestamp:Date.now()});const n=this.undoStack.pop();this.restoreState(n.data),this.updateUI(),this.app.showNotification("Action annulée ↩"),console.log(`[History] Undo: ${n.action||"unknown"}`)}redo(){if(this.redoStack.length===0){this.app.showNotification("Rien à rétablir");return}const e=this.captureState();this.undoStack.push({data:e,action:"redo",timestamp:Date.now()});const n=this.redoStack.pop();this.restoreState(n.data),this.updateUI(),this.app.showNotification("Action rétablie ↪"),console.log("[History] Redo")}async restoreState(e){this.isRestoring=!0;try{this.app.canvas.state.nodes=JSON.parse(JSON.stringify(e.nodes)),this.app.canvas.state.connections=JSON.parse(JSON.stringify(e.connections)),this.app.canvas.polesContainer.innerHTML="",this.app.canvas.state.nodes.forEach(n=>{this.app.canvas.renderNode(n)}),this.app.canvas.renderAllConnections(),await this.app.saveData(),this.app.metrics&&this.app.metrics.recalculateDebounced(),this.app.canvas.minimap&&this.app.canvas.minimap.update()}finally{this.isRestoring=!1}}updateUI(){const e=document.getElementById("btn-undo"),n=document.getElementById("btn-redo");e&&(e.disabled=this.undoStack.length===0,e.title=this.undoStack.length>0?`Annuler (${this.undoStack.length})`:"Rien à annuler"),n&&(n.disabled=this.redoStack.length===0,n.title=this.redoStack.length>0?`Rétablir (${this.redoStack.length})`:"Rien à rétablir")}clear(){this.undoStack=[],this.redoStack=[],this.updateUI(),console.log("[History] Cleared")}getStats(){return{undoCount:this.undoStack.length,redoCount:this.redoStack.length,maxSize:this.maxSize}}}class zs{canvasAnalyzer;canvasHistory;frictionEnabled;lastFrictionLog;providers;currentProvider;_ready;constructor(){this.canvasAnalyzer=null,this.canvasHistory=null,this.frictionEnabled=!0,this.lastFrictionLog=null,this.providers={claude:{name:"Claude (Anthropic)",apiUrl:"https://api.anthropic.com/v1/messages",apiKey:null,model:"claude-sonnet-4-20250514",icon:"C"},openai:{name:"ChatGPT (OpenAI)",apiUrl:"https://api.openai.com/v1/chat/completions",apiKey:null,model:"gpt-4o",icon:"G"},gemini:{name:"Gemini (Google)",apiUrl:"https://generativelanguage.googleapis.com/v1beta/models",apiKey:null,model:"gemini-1.5-pro",icon:"Ge"},deepseek:{name:"DeepSeek",apiUrl:"https://api.deepseek.com/chat/completions",apiKey:null,model:"deepseek-chat",icon:"D"},grok:{name:"Grok (xAI)",apiUrl:"https://api.x.ai/v1/chat/completions",apiKey:null,model:"grok-2",icon:"X"}},this.currentProvider="claude",this._ready=this.loadConfig()}whenReady(){return this._ready}sortNodesTopologically(e,n=[]){if(e.length<=1||n.length===0)return[...e].sort((d,u)=>{const h=parseInt(d.id.split("_")[1])||0,g=parseInt(u.id.split("_")[1])||0;return h-g});const s=new Set(e.map(d=>d.id)),o=new Map(e.map(d=>[d.id,d])),i=n.filter(d=>s.has(d.from)&&s.has(d.to)&&d.type!=="resonance"),r=new Map,a=new Map;for(const d of e)r.set(d.id,0),a.set(d.id,[]);for(const d of i)r.set(d.to,(r.get(d.to)||0)+1),a.get(d.from)?.push(d.to);const c=[],l=[];for(const[d,u]of r)u===0&&l.push(d);for(l.sort((d,u)=>{const h=parseInt(d.split("_")[1])||0,g=parseInt(u.split("_")[1])||0;return h-g});l.length>0;){const d=l.shift(),u=o.get(d);u&&c.push(u);for(const h of a.get(d)||[]){const g=(r.get(h)||1)-1;r.set(h,g),g===0&&(l.push(h),l.sort((p,f)=>{const m=parseInt(p.split("_")[1])||0,y=parseInt(f.split("_")[1])||0;return m-y}))}}for(const d of e)c.includes(d)||c.push(d);return c}async loadConfig(){try{if(window.fgraph&&window.fgraph.secureGet){for(const n of Object.keys(this.providers)){const s=await window.fgraph.secureGet(`${n}_api_key`);s.success&&s.value&&(this.providers[n].apiKey=s.value)}const e=localStorage.getItem("fgraph_llm_config");if(e){const n=JSON.parse(e);n.currentProvider&&(this.currentProvider=n.currentProvider);for(const s of Object.keys(this.providers))n[s]?.model&&(this.providers[s].model=n[s].model)}}else{const e=localStorage.getItem("fgraph_llm_config");if(e){const n=JSON.parse(e);for(const s of Object.keys(this.providers))n[s]&&(this.providers[s].apiKey=n[s].apiKey||null,this.providers[s].model=n[s].model||this.providers[s].model);n.currentProvider&&(this.currentProvider=n.currentProvider)}}}catch(e){console.error("Erreur lors du chargement de la config LLM:",e)}}async saveConfig(){try{if(window.fgraph&&window.fgraph.secureSet){for(const n of Object.keys(this.providers))this.providers[n].apiKey&&await window.fgraph.secureSet(`${n}_api_key`,this.providers[n].apiKey);const e={currentProvider:this.currentProvider};for(const n of Object.keys(this.providers))e[n]={model:this.providers[n].model};localStorage.setItem("fgraph_llm_config",JSON.stringify(e))}else{const e={currentProvider:this.currentProvider};for(const n of Object.keys(this.providers))e[n]={apiKey:this.providers[n].apiKey,model:this.providers[n].model};localStorage.setItem("fgraph_llm_config",JSON.stringify(e))}}catch(e){console.error("Erreur lors de la sauvegarde de la config LLM:",e)}}setApiKey(e,n){this.providers[e]&&(this.providers[e].apiKey=n,this.saveConfig())}setModel(e,n){this.providers[e]&&(this.providers[e].model=n,this.saveConfig())}setProvider(e){this.providers[e]&&(this.currentProvider=e,this.saveConfig())}isConfigured(){return!!this.providers[this.currentProvider].apiKey}getCurrentProvider(){return{id:this.currentProvider,...this.providers[this.currentProvider]}}buildContexteOptimise(e,n,s,o=[]){console.log("[LLM DEBUG] buildContexteOptimise v2 called"),console.log("[LLM DEBUG] operation:",e),console.log("[LLM DEBUG] vignetteSelectionnees.length:",o.length),console.log("[LLM DEBUG] total vignettes:",n.length);const i=this.detectRegime(o);if(console.log("[LLM DEBUG] Régime détecté:",i),i==="branch"){const d=[...o],u=new Set(d.map(f=>f.id)),h=s.filter(f=>u.has(f.from)&&u.has(f.to)),g=n.filter(f=>!f.synthesized||u.has(f.id)),p=this.getVoisinage(d,g,s);return console.log("[LLM DEBUG] Régime B - Sélection:",d.length,"vignettes"),console.log("[LLM DEBUG] Régime B - Voisinage (actif):",p.length,"vignettes"),console.log("[LLM DEBUG] Régime B - Connexions internes:",h.length),{regime:"branch",selection:d,voisinage:p,connectionsInternes:h,connections:s,vignettes:d,totalCanvasNodes:g.length}}const r=n.filter(d=>!d.synthesized);console.log("[LLM DEBUG] Vignettes actives (non-archivées):",r.length,"/",n.length);let a=[];switch(e){case"DÉVELOPPER":a=this.sortNodesTopologically(r,s);break;case"RELIER":a=this.sortNodesTopologically(r,s);break;case"SYNTHÉTISER":a=this.sortNodesTopologically(r,s);break;default:a=r}console.log("[LLM DEBUG] Final vignettes count:",a.length);const c=new Set(a.map(d=>d.id)),l=s.filter(d=>c.has(d.from)&&c.has(d.to));return{regime:"full",vignettes:a,connections:l,selection:null,voisinage:null,connectionsInternes:null,totalCanvasNodes:r.length}}echantillonner(e,n,s=[]){const o=new Set(s.map(a=>a.id)),i=e.filter(a=>o.has(a.id)),r=e.filter(a=>!o.has(a.id)).sort((a,c)=>new Date(c.created).getTime()-new Date(a.created).getTime());return i.push(...r.slice(0,n-i.length)),i}getAdaptiveVignetteCount(e){return e<10?"3-5":"2-3"}detectRegime(e=[]){return e.length>0?"branch":"full"}getVoisinage(e,n,s){const o=new Set(e.map(r=>r.id)),i=new Map;for(const r of s){const a=o.has(r.from),c=o.has(r.to);if(a&&!c){const l=n.find(d=>d.id===r.to);l&&(i.has(r.to)||i.set(r.to,{node:l,connectionsToSelection:[]}),i.get(r.to).connectionsToSelection.push({...r,selectionNodeId:r.from}))}else if(!a&&c){const l=n.find(d=>d.id===r.from);l&&(i.has(r.from)||i.set(r.from,{node:l,connectionsToSelection:[]}),i.get(r.from).connectionsToSelection.push({...r,selectionNodeId:r.to}))}}return Array.from(i.values())}formatVignetteV2(e,n,s=null){const i=s||{neutral:"○",priority:"🎯"}[e.status]||"○",r=e.tags&&e.tags.length>0?` | ${e.tags.join(" ")}`:"";return`${n}. [${e.text}] ${i}${r}`}formatConnectionV2(e,n){const s=n.get(e.from),o=n.get(e.to);if(!s||!o)return null;const i=e.type==="resonance"?"↔":"→",r=e.mechanism?` [${e.mechanism}]`:"";return`- "${s.text}" ${i} "${o.text}"${r}`}buildAdaptivePrompt(e,n,s=[],o=null,i="approfondir"){let r="";s.length>0&&(e==="DÉVELOPPER"||e==="SYNTHÉTISER")&&(r+=`[SYNTHÈSES RÉINJECTÉES]
Explorations passées :
`,s.forEach(u=>{const h=u.vignettesSourceIds?.length||0,g=new Date(u.dateCreation).toLocaleDateString("fr-FR");r+=`Synthèse "${u.titre}" (${h} vignettes, ${g}) :
`,r+=`${u.texte}
`}),r+=`---

`);const a=n.regime,c=new Map;a==="branch"?r+=this.buildGraphDataRegimeB(n,c):r+=this.buildGraphDataRegimeA(n,c);const l=C(),d=e;return l.structuralFraming[d]&&(r+=l.structuralFraming[d]+`
`),r+=this.buildOperationInstruction(e,n,a,i),o&&o.shouldInjectFriction&&(r=this.applyFriction(r,o,e)),r}buildGraphDataRegimeA(e,n){let s=`Graphe actuel :

`;const o=e.vignettes.find(i=>i.status==="priority");return o&&(s+=`ANCRE DU GRAPHE : "${o.text}"
Toutes les vignettes et connexions doivent être lues en rapport à cet objectif structurant.

`),e.vignettes.forEach((i,r)=>{n.set(i.id,i),s+=this.formatVignetteV2(i,r+1)+`
`}),e.connections&&e.connections.length>0&&(s+=`
CONNEXIONS :
`,e.connections.forEach(i=>{const r=this.formatConnectionV2(i,n);r&&(s+=r+`
`)})),s+=`
---

`,s}buildGraphDataRegimeB(e,n){let s="";const o=e.selection.find(a=>a.status==="priority"),i=e.voisinage?.find(a=>a.node.status==="priority"),r=o?.text||i?.node.text;if(r&&(s+=`ANCRE DU GRAPHE : "${r}"
Cette branche doit être lue en rapport à cet objectif structurant.

`),s+=`SÉLECTION (focus) :
`,e.selection.forEach((a,c)=>{n.set(a.id,a),s+=this.formatVignetteV2(a,c+1,"✓")+`
`}),e.connectionsInternes&&e.connectionsInternes.length>0&&(s+=`
CONNEXIONS INTERNES :
`,e.connectionsInternes.forEach(a=>{const c=this.formatConnectionV2(a,n);c&&(s+=c+`
`)})),e.voisinage&&e.voisinage.length>0){s+=`
VOISINAGE (hors sélection mais connecté) :
`;const a=e.selection.length+1;e.voisinage.forEach((c,l)=>{n.set(c.node.id,c.node),s+=this.formatVignetteV2(c.node,a+l,"○")+`
`,c.connectionsToSelection.forEach(d=>{const u=n.get(d.selectionNodeId);if(u){const h=d.type==="resonance"?"↔":"→",g=d.mechanism?` [${d.mechanism}]`:"";s+=`   ${h} "${u.text}"${g}
`}})})}return s+=`
---

`,s}buildOperationInstruction(e,n,s,o="approfondir"){const i=this.getAdaptiveVignetteCount(n.totalCanvasNodes);switch(e){case"DÉVELOPPER":return o==="diverger"?s==="branch"?this.buildDevelopDivergeInstructionB():this.buildDevelopDivergeInstructionA():s==="branch"?this.buildDevelopInstructionB(i):this.buildDevelopInstructionA(i);case"RELIER":{const r=this.countIsolatedNodes(n),a=this.getAdaptiveConnectionCount(n.totalCanvasNodes,r);return s==="branch"?this.buildLinkInstructionB(a,r):this.buildLinkInstructionA(a,r)}case"SYNTHÉTISER":return s==="branch"?this.buildSynthesizeInstructionB():this.buildSynthesizeInstructionA();default:return""}}buildDevelopInstructionA(e){return N(C().operations.DÉVELOPPER.deepen.full,{targetCount:e})}buildDevelopInstructionB(e){return N(C().operations.DÉVELOPPER.deepen.branch,{targetCount:e})}buildDevelopDivergeInstructionA(){const e=this.canvasAnalyzer?.getCanvasTopKeywords?.(10)||[],n=e.length>0?e.map(s=>`- "${s.keyword}" (${s.count} occurrences)`).join(`
`):"(aucun mot-clé dominant détecté)";return N(C().operations.DÉVELOPPER.diverge.full,{topKeywordsCanvas:n})}buildDevelopDivergeInstructionB(){const e=this.canvasAnalyzer?.getCanvasTopKeywords?.(10)||[],n=e.length>0?e.map(s=>`- "${s.keyword}" (${s.count} occurrences)`).join(`
`):"(aucun mot-clé dominant détecté)";return N(C().operations.DÉVELOPPER.diverge.branch,{topKeywordsCanvas:n})}countIsolatedNodes(e){const n=e.regime==="branch"?e.selection||[]:e.vignettes||[],s=e.regime==="branch"?e.connectionsInternes||[]:e.connections||[],o=new Set;for(const i of s)o.add(i.from),o.add(i.to);return n.filter(i=>!o.has(i.id)).length}getAdaptiveConnectionCount(e,n){return n>5?"5-8":n>2?"3-5":e>15?"2-4":"1-3"}buildLinkInstructionA(e,n){return N(C().operations.RELIER.full,{connectionTarget:e,isolatedCount:String(n)})}buildLinkInstructionB(e,n){return N(C().operations.RELIER.branch,{connectionTarget:e,isolatedCount:String(n)})}buildSynthesizeInstructionA(){return C().operations.SYNTHÉTISER.full}buildSynthesizeInstructionB(){return C().operations.SYNTHÉTISER.branch}buildSystemPrompt(e,n=null){const s=C();let o=s.systemPrompt;return e==="chat"&&n&&n.vignetteCount>0?(o+=`

--- ÉTAT DU CANVAS ---
`,o+=`${n.vignetteCount} vignette(s) :
${n.vignettesText}`,n.connectionsText&&(o+=`

Connexions :
${n.connectionsText}`),o+=`
--- FIN ---`,o+=s.systemPromptChatSuffix):e==="chat"&&(o+=s.systemPromptChatEmpty),o}async query(e,n,s="chat"){const o=this.providers[this.currentProvider];if(!o.apiKey)throw new Error(`Clé API ${o.name} non configurée. Cliquez sur ⚙ pour configurer.`);const i=s==="chat",r=this.buildSystemPrompt(s,i?n:null);let a=e;if(!i&&n&&n.vignetteCount>0){let c=`Mes vignettes actuelles :
${n.vignettesText}`;n.connectionsText&&(c+=`

Connexions :
${n.connectionsText}`),a=c+`

---

`+e}try{const c=[{role:"user",content:a}];let l;if(window.fgraph&&window.fgraph.llmQuery){const d=await window.fgraph.llmQuery({provider:this.currentProvider,apiKey:o.apiKey,model:o.model,messages:c,systemPrompt:r,options:{max_tokens:2048}});if(!d.success)throw new Error(d.error||"Erreur LLM");l={text:d.content,usage:d.usage}}else l=await this.callProviderDirect(r,c,o);return l}catch(c){throw console.error("Erreur LLM:",c),c}}async callProviderDirect(e,n,s){switch(this.currentProvider){case"claude":return await this.callClaude(e,n,s);case"openai":case"deepseek":case"grok":return await this.callOpenAICompatible(e,n,s);case"gemini":return await this.callGemini(e,n,s);default:throw new Error(`Provider ${this.currentProvider} non supporté`)}}async callClaude(e,n,s){const o=await fetch(s.apiUrl,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":s.apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:s.model,max_tokens:2048,system:e,messages:n})});if(!o.ok){const r=await o.json().catch(()=>({}));throw new Error(r.error?.message||`Erreur Claude: ${o.status}`)}const i=await o.json();return{text:i.content[0].text,usage:i.usage}}async callOpenAICompatible(e,n,s){const o=[{role:"system",content:e},...n],i=await fetch(s.apiUrl,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s.apiKey}`},body:JSON.stringify({model:s.model,max_tokens:2048,messages:o})});if(!i.ok){const a=await i.json().catch(()=>({}));throw new Error(a.error?.message||`Erreur ${s.name}: ${i.status}`)}const r=await i.json();return{text:r.choices[0].message.content,usage:r.usage}}async callGemini(e,n,s){const o=`${s.apiUrl}/${s.model}:generateContent?key=${s.apiKey}`,i=n.map(l=>({role:l.role==="assistant"?"model":"user",parts:[{text:l.content}]})),r=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:i,systemInstruction:{parts:[{text:e}]},generationConfig:{maxOutputTokens:2048}})});if(!r.ok){const l=await r.json().catch(()=>({}));throw new Error(l.error?.message||`Erreur Gemini: ${r.status}`)}const a=await r.json();return{text:a.candidates?.[0]?.content?.parts?.[0]?.text||"",usage:a.usageMetadata}}setCanvasAnalyzer(e){this.canvasAnalyzer=e,console.log("[LLM] CanvasAnalyzer configuré (système unifié)")}initFriction(e){this.canvasHistory=e,e&&(e.init(),console.log("[LLM] Module friction initialise (legacy)"))}setFrictionEnabled(e){this.frictionEnabled=e,console.log("[LLM] Friction:",e?"activee":"desactivee")}detectCircularity(e,n,s="",o=""){return this.frictionEnabled?this.canvasAnalyzer?(this.canvasAnalyzer.lastUserInput=s||"",this.canvasAnalyzer.lastLLMOutput=o||"",this.canvasAnalyzer.detectCircularity()):!this.canvasHistory||typeof CircularityDetector>"u"?{score:0,signals:[],shouldInjectFriction:!1,details:{}}:CircularityDetector.detect(e,this.canvasHistory.state,n,s,o):{score:0,signals:[],shouldInjectFriction:!1,details:{}}}applyFriction(e,n,s){return n.shouldInjectFriction?this.canvasAnalyzer?(this.lastFrictionLog={timestamp:Date.now(),operation:s,score:n.score,signals:n.signals},console.log("[LLM] Friction injectée (CanvasAnalyzer):",this.lastFrictionLog),this.canvasAnalyzer.injectFriction(e,n,s)):typeof FrictionInjector>"u"?e:(this.lastFrictionLog=FrictionInjector.createFrictionLog(n,s),console.log("[LLM] Friction injectee (legacy):",this.lastFrictionLog),this.canvasHistory&&this.canvasHistory.recordFrictionInjection(this.lastFrictionLog),FrictionInjector.buildPromptWithFriction(e,n)):e}updateCanvasHistory(e,n){if(this.canvasAnalyzer){this.canvasAnalyzer.updateHistory(e,n);return}this.canvasHistory&&this.canvasHistory.update(e,n)}getFrictionStats(){return this.canvasAnalyzer?{history:this.canvasAnalyzer.history,behaviorLogs:this.canvasAnalyzer.behaviorLogs}:this.canvasHistory?this.canvasHistory.getFrictionStats():null}resetFrictionHistory(){if(this.canvasAnalyzer){this.canvasAnalyzer.reset();return}this.canvasHistory&&this.canvasHistory.reset()}analyzeCanvas(e=""){return this.canvasAnalyzer?this.canvasAnalyzer.analyze(e):{attractors:[],circularity:this.detectCircularity([],[],e,""),shouldInjectFriction:!1,recommendations:[]}}}class Vs{canvas;analyzer;metriques;suggestionActive;_debounceTimer;_debounceDelay;oxygen;postureConfig={synthesisVignetteThresholdHigh:25,synthesisVignetteThresholdMid:15,synthesisVignetteThresholdLow:8,synthesisDensityThreshold:.8,synthesisDensityMinNodes:12};constructor(e){this.canvas=e,this.analyzer=null,this.oxygen=null,this.metriques=this.calculateMetrics(),this.suggestionActive=null,this._debounceTimer=null,this._debounceDelay=100}isSynthesisReady(){return(this.oxygen?.getScore?.()??50)>60&&this.metriques.vignetteConnectees>=8}calculateMetrics(){const e=this.canvas.state.nodes,n=this.canvas.state.connections,s=e.filter(v=>!v.synthesized),o=new Set(s.map(v=>v.id)),i=s.filter(v=>v.status==="priority").length,r=s.filter(v=>v.status==="neutral").length,a=n.filter(v=>o.has(v.from)&&o.has(v.to)),c=a.filter(v=>v.type==="implies").length,l=a.filter(v=>v.type==="resonance").length,d=new Set;a.forEach(v=>{d.add(v.from),d.add(v.to)});const u=s.filter(v=>d.has(v.id)).length,h=s.filter(v=>!d.has(v.id)).length,g=s.length,p=g,f=a.length,m=p>0?f/p:0,y=g>0?i/g:0;return this.metriques={totalVignettes:g,vignettesActives:p,vignettePrioritaires:i,vignetteNeutres:r,vignetteConnectees:u,connexionsTotal:f,connexionsImplique:c,connexionsResonance:l,vignetteIsolees:h,densiteConnexions:Math.round(m*100)/100,ratioPriorite:Math.round(y*100)/100},this.metriques}recalculateDebounced(){this._debounceTimer&&clearTimeout(this._debounceTimer),this._debounceTimer=setTimeout(()=>{this.calculateMetrics(),this.updateMetricsDisplay(),this.oxygen&&this.canvas&&(this.oxygen.evaluate(this.canvas.state.nodes,this.canvas.state.connections),document.dispatchEvent(new CustomEvent("oxygenUpdated"))),this.updateSuggestionBanner()},this._debounceDelay)}decideOperation(){const e=this.metriques,n=this.canvas.interaction?.selectedNodes,s=n?.size||0;if(s>0)return this.decideOperationForSelection(s,n);const o=e.totalVignettes,i=o>0?e.vignetteIsolees/o:0;if(o<3)return{operation:"DÉVELOPPER",raison:"Canvas en construction — ajoutons des idées et tissons des liens.",priorite:"haute"};const r=this.oxygen?.getScore?.()??50;if(r<50&&o>=5)return{operation:"DÉVELOPPER",subMode:"diverger",raison:`Canvas stale (O₂ ${Math.round(r)}) — explorer un territoire adjacent.`,priorite:r<30?"urgente":"haute"};const a=this.analyzer;if(!a)return this._decideOperationLegacy();const c=a.diversityTrend(),l=a.detectCircularity();if(c==="insufficient_data")return this._decideOperationLegacy();if(c==="converging"){if(l.score>1){const d=a.config?.circularityThreshold??3;return l.score>d?{operation:"DÉVELOPPER",subMode:"diverger",raison:"Le canvas converge et tourne — bifurcation nécessaire.",priorite:"urgente"}:{operation:"DÉVELOPPER",subMode:"diverger",raison:"Le canvas se referme — explorer un territoire adjacent.",priorite:"haute"}}return{operation:"DÉVELOPPER",subMode:"diverger",raison:"Tendance à la convergence — varier les angles.",priorite:"moyenne"}}if(c==="exploring"||c==="stable"){if(i>.3&&o>=5)return{operation:"RELIER",raison:"Exploration active — créer des ponts entre les clusters.",priorite:"moyenne"};if(e.densiteConnexions>this.postureConfig.synthesisDensityThreshold&&o>=this.postureConfig.synthesisDensityMinNodes)return{operation:"DÉVELOPPER",subMode:"approfondir",raison:"Canvas dense et diversifié — approfondissons.",priorite:"moyenne"}}return c==="stable"&&l.score<=1?{operation:null,raison:"Le canvas explore naturellement. Continuez.",priorite:"normale"}:{operation:"DÉVELOPPER",subMode:"approfondir",raison:"Approfondir et relier les pistes existantes.",priorite:"normale"}}_decideOperationLegacy(){const e=this.metriques;return e.vignetteConnectees>=this.postureConfig.synthesisVignetteThresholdHigh?{operation:"DÉVELOPPER",subMode:"approfondir",raison:"Canvas riche — approfondissons les pistes.",priorite:"haute"}:e.vignetteConnectees>=this.postureConfig.synthesisVignetteThresholdMid?{operation:"DÉVELOPPER",subMode:"approfondir",raison:`${e.vignetteConnectees} idées connectées, poursuivons l'exploration.`,priorite:"moyenne"}:(e.totalVignettes>0?e.vignetteIsolees/e.totalVignettes:0)>.3&&e.vignettesActives>=5?{operation:"RELIER",raison:`${e.vignetteIsolees} idées isolées à connecter`,priorite:"moyenne"}:e.densiteConnexions<.5&&e.vignettesActives>=5?{operation:"DÉVELOPPER",raison:"Les idées sont peu connectées — développons et relions.",priorite:"moyenne"}:{operation:"DÉVELOPPER",raison:"Développons et connectons de nouvelles idées.",priorite:"normale"}}decideOperationForSelection(e,n){const s=this.canvas.state.connections,o=n instanceof Set?n:new Set(n),i=s.filter(c=>o.has(c.from)&&o.has(c.to)).length,r=e*(e-1)/2;return(r>0?i/r:0)<.3&&e>=5?{operation:"RELIER",raison:`${e} vignettes sélectionnées — peu connectées entre elles.`,priorite:"moyenne"}:{operation:"DÉVELOPPER",raison:`${e} vignette${e>1?"s":""} sélectionnée${e>1?"s":""} — développons et relions.`,priorite:"normale"}}updateSuggestion(){return this.suggestionActive=this.decideOperation(),this.suggestionActive.timestamp=Date.now(),this.suggestionActive}updateMetricsDisplay(){const e=document.getElementById("metriques-texte");if(!e)return;const n=this.metriques;let s=`${n.totalVignettes} vignette${n.totalVignettes>1?"s":""}, ${n.connexionsTotal} connexion${n.connexionsTotal>1?"s":""}`;n.vignettePrioritaires>0&&(s+=` (${n.vignettePrioritaires} prioritaire${n.vignettePrioritaires>1?"s":""})`),n.vignetteIsolees>0&&(s+=` • ${n.vignetteIsolees} isolée${n.vignetteIsolees>1?"s":""}`),e.textContent=s}updateSuggestionBanner(){const e=document.getElementById("suggestion-texte"),n=document.getElementById("bandeau-suggestion");if(!e||!n)return;const s=this.updateSuggestion();if(!s.operation){e.textContent=`✦ ${s.raison}`,n.style.background="";return}const i={DÉVELOPPER:"🌱",RELIER:"🔗",SYNTHÉTISER:"📦"}[s.operation]||"💡";s.subMode,e.textContent=`${i} ${s.raison}`,n.style.background="",s.priorite==="urgente"?n.classList.add("urgente"):n.classList.remove("urgente");const r=document.getElementById("synthesis-ready-badge");r&&r.classList.toggle("hidden",!this.isSynthesisReady())}getMetrics(){return this.metriques}getSuggestion(){return this.suggestionActive}formatMetricsForDisplay(){const e=this.metriques;return{summary:`${e.totalVignettes} vignettes (${e.vignettePrioritaires} prioritaires, ${e.vignetteNeutres} neutres)`,connections:`${e.connexionsTotal} connexions (densité: ${e.densiteConnexions})`,isolated:`${e.vignetteIsolees} isolées`}}}const js="kairos_canvas_analyzer",le={circularityThreshold:3,minTurnsBetweenFriction:3,stagnationThreshold:3,tagSaturationThreshold:5,echoSimilarityThreshold:.6,diversityConvergenceThreshold:-.1,diversityExplorationThreshold:.1,diversityHistoryMax:50},O={reformulation:{weight:2,description:"Vignette sémantiquement proche d'une existante"},boucle_connexion:{weight:3,description:"Connexion qui forme un cycle A → B → C → A"},stagnation:{weight:2,description:"3+ tours sans concept nouveau"},validation_vide:{weight:1,description:"Réponse utilisateur type 'oui', 'ok'"},tags_satures:{weight:1,description:"Même tag sur >5 vignettes"},echo_llm:{weight:2,description:"LLM répète une formulation de l'utilisateur"}},Pt=[/^(oui|ok|d'accord|ouais|yep|yes|yeah)[\s!.]*$/i,/^c'est [çc]a[\s!.]*$/i,/^exactement[\s!.]*$/i,/^parfait[\s!.]*$/i,/^bien[\s!.]*$/i,/^super[\s!.]*$/i,/^cool[\s!.]*$/i,/^je vois[\s!.]*$/i,/^(hm+|ah|oh)[\s!.]*$/i],ke=new Set(["le","la","les","un","une","de","du","des","et","ou","est","sont","dans","pour","qui","que","sur","par","avec","sans","ce","cette","ces","au","aux","en","ne","pas","plus","moins","tout","tous","toute","toutes","autre","autres","meme","comme","mais","donc","car","ni","si","se","son","sa","ses","leur","leurs","nous","vous","ils","elles","lui","elle","il","on","je","tu","etre","avoir","faire","dit","fait","peut","faut","doit","vers","chez"]);function Ot(){return{vignettes:[],connections:[],turns:0,turnsWithoutNewConcept:0,lastFrictionInjection:-1/0,frictionLogs:[],frictionBonus:!1,attractorScores:new Map,diversityHistory:[]}}function Dt(){return{selections:new Map,llmSends:new Map,captures:new Map,degreeHistory:new Map,connectionEvents:[]}}const Ue={BASE_PATH:"data/variables/friction/",referentiels:{initiateurs:null,reponses:null,parasitaire:null,seuils:null},loaded:!1,loading:!1,async loadAll(){if(this.loaded)return!0;if(this.loading){for(;this.loading;)await new Promise(t=>setTimeout(t,50));return this.loaded}this.loading=!0,console.log("[ReferentielsLoader] Chargement des referentiels friction...");try{const t=[{key:"initiateurs",file:"initiateurs_friction.json"},{key:"reponses",file:"reponses_friction.json"},{key:"parasitaire",file:"friction_parasitaire.json"},{key:"seuils",file:"seuils.json"}],e=await Promise.all(t.map(async({key:s,file:o})=>{try{const i=await fetch(this.BASE_PATH+o);if(!i.ok)return console.warn(`[ReferentielsLoader] ${o}: ${i.status}`),{key:s,data:null};const r=await i.json();return{key:s,data:r}}catch(i){return console.warn(`[ReferentielsLoader] Erreur ${o}:`,i.message),{key:s,data:null}}}));for(const{key:s,data:o}of e)this.referentiels[s]=o;const n=Object.values(this.referentiels).filter(Boolean).length;return this.loaded=n>0,console.log(`[ReferentielsLoader] ${n}/4 referentiels charges`),this.loaded&&this.applyToDetector(),this.loaded}catch(t){return console.error("[ReferentielsLoader] Erreur globale:",t),!1}finally{this.loading=!1}},applyToDetector(){if(typeof CircularityDetector>"u"){console.warn("[ReferentielsLoader] CircularityDetector non disponible");return}this.referentiels.parasitaire,this.referentiels.seuils&&this.referentiels.seuils.conversion_score?.moyenne?.points_min&&console.log("[ReferentielsLoader] Seuils friction appliques"),this.referentiels.initiateurs&&(CircularityDetector.REFERENTIELS=CircularityDetector.REFERENTIELS||{},CircularityDetector.REFERENTIELS.initiateurs=this.referentiels.initiateurs),this.referentiels.parasitaire&&(CircularityDetector.REFERENTIELS=CircularityDetector.REFERENTIELS||{},CircularityDetector.REFERENTIELS.parasitaire=this.referentiels.parasitaire),console.log("[ReferentielsLoader] Referentiels appliques a CircularityDetector")},extractAllItems(t){if(!t)return[];const e=[];for(const[n,s]of Object.entries(t))n!=="_meta"&&s&&Array.isArray(s.items)&&e.push(...s.items);return e},extractItemsWithWeights(t){if(!t)return[];const e=[];for(const[n,s]of Object.entries(t))if(n!=="_meta"&&s&&Array.isArray(s.items)){const o=s.poids||1;for(const i of s.items)e.push({pattern:i,weight:o,category:n})}return e},getInitiateurs(){return this.extractItemsWithWeights(this.referentiels.initiateurs)},getParasitaires(){return this.extractItemsWithWeights(this.referentiels.parasitaire)},getSeuils(){return this.referentiels.seuils},detectInitiateurs(t){if(!t||!this.referentiels.initiateurs)return[];const e=t.toLowerCase(),n=[];for(const s of this.getInitiateurs())e.includes(s.pattern.toLowerCase())&&n.push(s);return n},detectParasitaires(t){if(!t||!this.referentiels.parasitaire)return[];const e=t.toLowerCase(),n=[];for(const s of this.getParasitaires())e.includes(s.pattern.toLowerCase())&&n.push(s);return n}};function z(t){return!t||t.length===0?[]:[...new Set(t.map(e=>e.replace(/^#/,"").toLowerCase().trim()).filter(e=>e.length>0))]}function ne(t){return t?t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").split(/\W+/).filter(e=>e.length>3&&!ke.has(e)):[]}function kt(t,e){if(t.length===0&&e.length===0)return 1;const n=new Set(t),s=new Set(e),o=[...n].filter(r=>s.has(r)).length,i=new Set([...n,...s]).size;return i>0?1-o/i:1}function Rt(t){const e=t.canvas?.state?.nodes||[];if(e.length<2)return{currentDistance:1,timestamp:Date.now()};const n=e[e.length-1],s=z(n.tags),o=s.length===0?ne(n.text):[];if(s.length===0&&o.length===0)return{currentDistance:1,timestamp:Date.now()};const i=[];for(const a of e){if(a.id===n.id)continue;const c=z(a.tags);if(s.length>0&&c.length>0){const u=s.filter(g=>c.includes(g)),h=Math.max(s.length,c.length);i.push(1-u.length/h);continue}const l=s.length>0?s:o,d=c.length>0?c:ne(a.text);d.length!==0&&i.push(kt(l,d))}return i.length===0?{currentDistance:1,timestamp:Date.now()}:{currentDistance:i.reduce((a,c)=>a+c,0)/i.length,nodeId:n.id,timestamp:Date.now()}}function Us(t){const e=t.history.diversityHistory||[];if(e.length<5)return"insufficient_data";const n=e.slice(-8),s=n.map((f,m)=>m+1),i=s.reduce((f,m)=>f+m,0)/2;let r=0,a=0,c=0,l=0,d=0;for(let f=0;f<n.length;f++)r+=s[f],r<=i?(a+=n[f].currentDistance*s[f],l+=s[f]):(c+=n[f].currentDistance*s[f],d+=s[f]);const u=l>0?a/l:0,g=(d>0?c/d:0)-u,p=t.config||le;return g<(p.diversityConvergenceThreshold??-.1)?"converging":g>(p.diversityExplorationThreshold??.1)?"exploring":"stable"}function Ys(t,e=10){const n=t.canvas?.state?.nodes||[],s={};for(const o of n){const i=z(o.tags);for(const r of i)s[r]=(s[r]||0)+1}return Object.entries(s).sort((o,i)=>i[1]-o[1]).slice(0,e).map(([o,i])=>({keyword:o,count:i}))}function Xs(t){const e=t.canvas?.state?.nodes||[];if(e.length<3||(t.history.diversityHistory||[]).length>=3)return 0;const s=[];for(let i=1;i<e.length;i++){const r=e[i],a=z(r.tags),c=a.length===0?ne(r.text):[];if(a.length===0&&c.length===0)continue;const l=[];for(let d=0;d<i;d++){const u=z(e[d].tags);if(a.length>0&&u.length>0){const p=a.filter(m=>u.includes(m)),f=Math.max(a.length,u.length);l.push(1-p.length/f);continue}const h=a.length>0?a:c,g=u.length>0?u:ne(e[d].text);g.length!==0&&l.push(kt(h,g))}l.length>0&&s.push({currentDistance:l.reduce((d,u)=>d+u,0)/l.length,nodeId:r.id,timestamp:Date.now()})}if(s.length===0)return 0;const o=t.config?.diversityHistoryMax??le.diversityHistoryMax;return t.history.diversityHistory=s.slice(-o),console.log(`[CanvasAnalyzer] Bootstrap diversité : ${s.length} points calculés pour ${e.length} nœuds`),s.length}async function k(t){try{const e={history:{...t.history,attractorScores:Object.fromEntries(t.history.attractorScores),diversityHistory:t.history.diversityHistory||[]},behaviorLogs:{selections:Object.fromEntries(t.behaviorLogs.selections),llmSends:Object.fromEntries(t.behaviorLogs.llmSends),captures:Object.fromEntries(t.behaviorLogs.captures),degreeHistory:Object.fromEntries(t.behaviorLogs.degreeHistory),connectionEvents:t.behaviorLogs.connectionEvents}};await window.fgraph.db.attractors.upsert(j(),e)}catch(e){console.warn("[CanvasAnalyzer] Erreur sauvegarde:",e.message)}}async function Ye(t){try{const e=await window.fgraph.db.attractors.getData(j());e&&Object.keys(e).length>0&&(e.history&&(t.history={...t.history,...e.history,attractorScores:new Map(Object.entries(e.history.attractorScores||{})),diversityHistory:e.history.diversityHistory||[]}),e.behaviorLogs&&(t.behaviorLogs={selections:new Map(Object.entries(e.behaviorLogs.selections||{})),llmSends:new Map(Object.entries(e.behaviorLogs.llmSends||{})),captures:new Map(Object.entries(e.behaviorLogs.captures||{})),degreeHistory:new Map(Object.entries(e.behaviorLogs.degreeHistory||{})),connectionEvents:e.behaviorLogs.connectionEvents||[]}))}catch(e){console.warn("[CanvasAnalyzer] Erreur chargement:",e.message),await $t(t)}}async function Xe(t){console.log("[CanvasAnalyzer] Migration gérée par db-migration.js")}async function Ws(t){const e=t.canvas?.state?.nodes||[],n=t.canvas?.state?.connections||[],s=new Set(t.history.vignettes.map(r=>r.id));let o=!1,i=!1;for(const r of e)s.has(r.id)||(o=!0,qt(r)&&(i=!0,console.log("[CanvasAnalyzer] Nouvelle vignette friction:",r.id)));i&&(t.history.frictionBonus=!0,document.dispatchEvent(new CustomEvent("frictionVignetteAccepted")),console.log("[CanvasAnalyzer] Bonus friction activé")),o?t.history.turnsWithoutNewConcept=0:t.history.turnsWithoutNewConcept++,t.history.vignettes=e.map(r=>({id:r.id,text:r.text,tags:r.tags?[...r.tags]:[],status:r.status})),t.history.connections=n.map(r=>({id:r.id,from:r.from,to:r.to,type:r.type})),t.history.turns++,await k(t),console.log(`[CanvasAnalyzer] Tour ${t.history.turns}, stagnation: ${t.history.turnsWithoutNewConcept}`)}async function Ks(t,e,n){const s=new Set(t.history.vignettes.map(r=>r.id));let o=!1,i=!1;console.log(`[CanvasAnalyzer] updateHistory: ${e.length} vignettes, previousIds: ${s.size}, diversityHistory: ${(t.history.diversityHistory||[]).length}`);for(const r of e)s.has(r.id)||(o=!0,console.log(`[CanvasAnalyzer] Nouveau concept détecté: ${r.id}`),qt(r)&&(i=!0,console.log("[CanvasAnalyzer] Nouvelle vignette friction détectée:",r.id)));if(i&&(t.history.frictionBonus=!0,document.dispatchEvent(new CustomEvent("frictionVignetteAccepted"))),o?t.history.turnsWithoutNewConcept=0:t.history.turnsWithoutNewConcept++,t.history.vignettes=e.map(r=>({id:r.id,text:r.text,tags:r.tags?[...r.tags]:[],status:r.status})),t.history.connections=n.map(r=>({id:r.id,from:r.from,to:r.to,type:r.type})),t.history.turns++,o){const r=Rt(t);t.history.diversityHistory||(t.history.diversityHistory=[]),t.history.diversityHistory.push(r);const a=t.config?.diversityHistoryMax??le.diversityHistoryMax;t.history.diversityHistory.length>a&&(t.history.diversityHistory=t.history.diversityHistory.slice(-a)),console.log(`[CanvasAnalyzer] Diversité calculée: distance=${r.currentDistance.toFixed(3)}, total=${t.history.diversityHistory.length}`)}else console.log("[CanvasAnalyzer] Pas de nouveau concept, diversité non calculée");await k(t)}async function $t(t){t.history=Ot(),t.behaviorLogs=Dt(),t.lastLLMOutput="",t.lastUserInput="",await k(t),console.log("[CanvasAnalyzer] Reset")}async function We(t){try{await Ue.loadAll()&&(t.referentiels=Ue.referentiels,console.log("[CanvasAnalyzer] Référentiels chargés"))}catch(e){console.warn("[CanvasAnalyzer] Référentiels non chargés:",e.message)}}function Ke(t){document.addEventListener("nodeSelected",e=>{_t(t,e.detail.nodeId)}),document.addEventListener("connectionCreated",e=>{Ht(t,e.detail.fromId,e.detail.toId,"created")}),document.addEventListener("llmSend",e=>{e.detail.nodeId&&Ft(t,e.detail.nodeId,e.detail.operation)}),document.addEventListener("captureTracked",e=>{e.detail.nodeId&&Bt(t,e.detail.nodeId)})}function _t(t,e){const n=t.behaviorLogs.selections.get(e)||{count:0,timestamps:[]};n.count++,n.timestamps.push(Date.now()),n.timestamps.length>50&&(n.timestamps=n.timestamps.slice(-50)),t.behaviorLogs.selections.set(e,n)}function Ft(t,e,n){const s=t.behaviorLogs.llmSends.get(e)||{count:0,timestamps:[],operations:[]};s.count++,s.timestamps.push(Date.now()),s.operations.push(n),s.timestamps.length>50&&(s.timestamps=s.timestamps.slice(-50),s.operations=s.operations.slice(-50)),t.behaviorLogs.llmSends.set(e,s)}function Bt(t,e){const n=t.behaviorLogs.captures.get(e)||{count:0,timestamps:[]};n.count++,n.timestamps.push(Date.now()),n.timestamps.length>50&&(n.timestamps=n.timestamps.slice(-50)),t.behaviorLogs.captures.set(e,n)}function Ht(t,e,n,s){t.behaviorLogs.connectionEvents.push({timestamp:Date.now(),fromId:e,toId:n,type:s}),t.behaviorLogs.connectionEvents.length>100&&(t.behaviorLogs.connectionEvents=t.behaviorLogs.connectionEvents.slice(-100))}function qt(t){if(!t)return!1;const e=t.text?.includes("[FRICTION]"),n=t.tags?.some(s=>s==="friction"||s==="#friction"||s.toLowerCase()==="friction");return e||n}function Ge(t){const e=t.canvas?.state?.nodes||[],n=t.canvas?.state?.connections||[],s=[];let o=0;const i=zt(t,e);i.length>0&&(s.push(`reformulation (${i.length})`),o+=O.reformulation.weight*i.length),jt(n)&&(s.push("boucle_connexion"),o+=O.boucle_connexion.weight),t.history.turnsWithoutNewConcept>=t.config.stagnationThreshold&&(s.push(`stagnation (${t.history.turnsWithoutNewConcept} tours)`),o+=O.stagnation.weight),t.lastUserInput&&Yt(t.lastUserInput)&&(s.push("validation_vide"),o+=O.validation_vide.weight);const r=Ut(t,e);r.length>0&&(s.push(`tags_saturés (${r.join(", ")})`),o+=O.tags_satures.weight*r.length),t.lastUserInput&&t.lastLLMOutput&&Xt(t)&&(s.push("echo_llm"),o+=O.echo_llm.weight);let a=!1;return t.history.frictionBonus&&(o=Math.max(0,o-1),a=!0,t.history.frictionBonus=!1,console.log("[CanvasAnalyzer] Bonus friction appliqué (-1)")),{score:o,signals:s,shouldInjectFriction:o>t.config.circularityThreshold&&se(t),frictionBonusApplied:a,details:{threshold:t.config.circularityThreshold,cooldownActive:!se(t)}}}function zt(t,e){const n=[];for(let s=0;s<e.length;s++)for(let o=s+1;o<e.length;o++)Vt(t,e[s].text,e[o].text)&&n.push([e[s].id,e[o].id]);return n}function Vt(t,e,n){const s=F(e),o=F(n);return s.length<2||o.length<2?!1:s.filter(a=>o.includes(a)).length/Math.max(s.length,o.length)>t.config.echoSimilarityThreshold}function jt(t){if(!t||t.length<3)return!1;const e=new Map;for(const i of t)e.has(i.from)||e.set(i.from,[]),e.get(i.from).push(i.to),i.type==="resonance"&&(e.has(i.to)||e.set(i.to,[]),e.get(i.to).push(i.from));const n=new Set,s=new Set,o=i=>{n.add(i),s.add(i);for(const r of e.get(i)||[])if(n.has(r)){if(s.has(r))return!0}else if(o(r))return!0;return s.delete(i),!1};for(const i of e.keys())if(!n.has(i)&&o(i))return!0;return!1}function Ut(t,e){const n=new Map;for(const s of e)for(const o of s.tags||[]){const i=o.toLowerCase().replace(/^#/,"");n.set(i,(n.get(i)||0)+1)}return[...n.entries()].filter(([s,o])=>o>t.config.tagSaturationThreshold).map(([s])=>`#${s}`)}function Gs(t,e,n){const s=e.tags||[];if(s.length===0)return!1;const o=new Map;for(const i of n)for(const r of i.tags||[]){const a=r.toLowerCase().replace(/^#/,"");o.set(a,(o.get(a)||0)+1)}for(const i of s){const r=i.toLowerCase().replace(/^#/,"");if((o.get(r)||0)>t.config.tagSaturationThreshold)return!0}return!1}function Yt(t){return Pt.some(e=>e.test(t.trim()))}function Xt(t){const e=F(t.lastUserInput),n=F(t.lastLLMOutput);return e.length<3?!1:e.filter(i=>n.includes(i)).length/e.length>t.config.echoSimilarityThreshold}function Js(t){if(!t)return!1;const e=t.text?.includes("[FRICTION]"),n=t.tags?.some(s=>s==="friction"||s==="#friction"||s.toLowerCase()==="friction");return e||n}function se(t){return t.history.turns-t.history.lastFrictionInjection>=t.config.minTurnsBetweenFriction}function Se(t,e="DÉVELOPPER",n={}){if(e==="SYNTHÉTISER")return"";const s=t.score||0,o=t.details?.threshold||2,i=s>o*1.5,r=C().friction;return e==="DÉVELOPPER"?i&&n.recentKeywords?N(r.develop.strong,{recentKeywords:n.recentKeywords}):r.develop.moderate:e==="RELIER"?i&&n.recentMechanisms?N(r.link.strong,{recentMechanisms:n.recentMechanisms}):r.link.moderate:""}function Qs(t,e,n,s="DÉVELOPPER"){if(!n.shouldInjectFriction||s==="SYNTHÉTISER")return e;t.history.lastFrictionInjection=t.history.turns,t.history.frictionLogs.push({turn:t.history.turns,score:n.score,signals:n.signals,operation:s,injected:!0,timestamp:new Date().toISOString()}),t.history.frictionLogs.length>50&&(t.history.frictionLogs=t.history.frictionLogs.slice(-50)),k(t);const o=Zs(t,s);return e+Se(n,s,o)}function Zs(t,e){const n={},s=t.canvas?.state?.nodes||[],o=t.canvas?.state?.connections||[];if(e==="DÉVELOPPER"){const r=s.slice(-5).map(a=>F(a.text)).flat().slice(0,10);r.length>0&&(n.recentKeywords=r.join(", "))}else if(e==="RELIER"){const r=o.filter(a=>a.mechanism).slice(-5).map(a=>a.mechanism).filter(Boolean);r.length>0&&(n.recentMechanisms=r.join(" / "))}return n}function Je(t,e,n){const s=[];return n.score>0&&n.score<=t.config.circularityThreshold&&s.push({type:"warning_circularity",message:"Légère circularité détectée — varier les angles",priority:"low"}),n.signals.some(o=>o.includes("stagnation"))&&s.push({type:"stagnation",message:"Stagnation détectée — introduire un nouveau concept",priority:"high"}),s}function F(t){return t?t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").split(/\W+/).filter(e=>e.length>3&&!ke.has(e)):[]}class eo{app;canvas;history;behaviorLogs;lastLLMOutput;lastUserInput;config;SIGNALS;EMPTY_VALIDATION_PATTERNS;STOPWORDS;STORAGE_KEY;referentiels;constructor(e){this.app=e,this.canvas=e.canvas,this.history=Ot(),this.behaviorLogs=Dt(),this.lastLLMOutput="",this.lastUserInput="",this.config={...le},this.SIGNALS=O,this.EMPTY_VALIDATION_PATTERNS=Pt,this.STOPWORDS=ke,this.STORAGE_KEY=js,this.referentiels=null}async init(){await We(this),await Ye(this),await Xe(),Ke(this),Xs(this)>0&&await k(this),console.log("[CanvasAnalyzer] Initialisé, tour:",this.history.turns)}analyze(e=""){e&&(this.lastUserInput=e);const n=Ge(this),s=n.score>this.config.circularityThreshold&&se(this);return{circularity:n,shouldInjectFriction:s,recommendations:Je(this,[],n),history:{turns:this.history.turns,turnsWithoutNewConcept:this.history.turnsWithoutNewConcept,lastFrictionInjection:this.history.lastFrictionInjection}}}saveHistory(){return k(this)}loadHistory(){return Ye(this)}migrateOldStorage(){return Xe()}recordTurn(){return Ws(this)}updateHistory(e,n){return Ks(this,e,n)}reset(){return $t(this)}loadReferentiels(){return We(this)}setupEventListeners(){Ke(this)}trackSelection(e){_t(this,e)}trackLLMSend(e,n){Ft(this,e,n)}trackCapture(e){Bt(this,e)}trackConnectionEvent(e,n,s){Ht(this,e,n,s)}saveState(){return k(this)}detectCircularity(){return Ge(this)}detectReformulations(e){return zt(this,e)}isSemanticallyClose(e,n){return Vt(this,e,n)}hasConnectionCycle(e){return jt(e)}detectSaturatedTags(e){return Ut(this,e)}nodeHasSaturatedTag(e,n){return Gs(this,e,n)}isEmptyValidation(e){return Yt(e)}detectLLMEcho(){return Xt(this)}isFrictionVignette(e){return Js(e)}canInjectFriction(){return se(this)}buildFrictionBlock(e,n="DÉVELOPPER",s={}){return Se(e,n,s)}injectFriction(e,n,s="DÉVELOPPER"){return Qs(this,e,n,s)}generateRecommendations(e){return Je(this,[],e)}extractKeywords(e){return F(e)}calculateDiversity(){return Rt(this)}diversityTrend(){return Us(this)}getCanvasTopKeywords(e){return Ys(this,e)}status(){console.group("[CanvasAnalyzer] Status"),console.log("Configuration:"),console.log("  - Seuil circularité:",this.config.circularityThreshold),console.log("  - Cooldown friction:",this.config.minTurnsBetweenFriction,"tours"),console.log("Historique:"),console.log("  - Tours:",this.history.turns),console.log("  - Stagnation:",this.history.turnsWithoutNewConcept,"tours"),console.log("  - Dernière friction:",this.history.lastFrictionInjection),console.log("  - Bonus friction:",this.history.frictionBonus),console.log("Tracking:"),console.log("  - Sélections:",this.behaviorLogs.selections.size,"nodes"),console.log("  - Envois LLM:",this.behaviorLogs.llmSends.size,"nodes"),console.log("  - Events connexions:",this.behaviorLogs.connectionEvents.length);const e=this.analyze();return console.log("Analyse actuelle:"),console.log("  - Score circularité:",e.circularity.score),console.log("  - Signaux:",e.circularity.signals),console.log("  - Injection friction:",e.shouldInjectFriction?"OUI":"NON"),console.groupEnd(),e}simulateCircularity(){console.group("[CanvasAnalyzer] Simulation"),this.history.turnsWithoutNewConcept=5,this.lastUserInput="oui";const e=this.analyze();return console.log("Score:",e.circularity.score),console.log("Signaux:",e.circularity.signals),console.log("Friction:",e.shouldInjectFriction?"OUI":"NON"),e.shouldInjectFriction&&(console.log("Bloc friction:"),console.log(Se(e.circularity))),this.history.turnsWithoutNewConcept=0,console.groupEnd(),e}forceNextFriction(){const e=this.config.circularityThreshold;this.config.circularityThreshold=0,console.log("[CanvasAnalyzer] Seuil abaissé à 0"),setTimeout(()=>{this.config.circularityThreshold=e,console.log("[CanvasAnalyzer] Seuil restauré à",e)},3e4)}}const S=I("WebviewHandler");function to(t){if(!t)return"";const e=[/\n\s*Souhaite[sz]?-(?:tu|vous)[^\n]*/gi,/\n\s*Veu[xt]-(?:tu|vous)[^\n]*/gi,/\n\s*Voulez-vous[^\n]*/gi,/\n\s*Si (?:tu |vous )souhaite[sz]?[^\n]*/gi,/\n\s*N'hésite[sz]? pas[^\n]*/gi,/\n\s*Je peux (?:aussi|également)[^\n]*/gi,/\n\s*Dois-je[^\n]*/gi,/\n\s*Faut-il[^\n]*/gi,/\n\s*(?:Est-ce que |)(?:tu veux|vous voulez)[^\n]*/gi,/\n\s*Je reste à (?:ta|votre) disposition[^\n]*/gi,/\n\s*(?:Que |Qu'est-ce que )(?:tu |vous )(?:en )?pense[sz]?[^\n]*/gi];let n=t;for(const s of e)n=n.replace(s,"");return n=n.replace(/\n\s*\n\s*$/g,`
`).trim(),n}function no(t){const e=[],n=u=>{if(!u)return[];const h=/#[\w\u00C0-\u017F][\w\u00C0-\u017F-]*/g;return u.match(h)||[]},s=u=>{const h=[/\[NOUVELLE\s*VIGNETTE(?:\s*\d+)?\]/i,/\[FRICTION\]/i,/\[CONNEXION\]/i],g=[/Souhaitez-vous/i,/Voulez-vous/i,/Si vous souhaitez/i,/N'h\u00E9sitez pas/i,/Je peux aussi/i,/Dois-je/i];let p=u.length;for(const f of h){const m=u.match(f);m&&m.index>0&&m.index<p&&(p=m.index)}for(const f of g){const m=u.match(f);m&&m.index>0&&m.index<p&&(p=m.index)}return u.substring(0,p).trim()},o=/(\[NOUVELLE\s*VIGNETTE(?:\s*\d+)?\]|\[FRICTION\])/gi,i=t.split(o);S.info(`Split unifié: ${i.length} parties`),S.info("Texte brut (200 premiers chars):",t.substring(0,200));for(let u=1;u<i.length;u+=2){const h=i[u],g=i[u+1]||"";if(!h||!g.trim())continue;const p=g.trim();if(S.info(`Marqueur: ${h}, Segment:`,p.substring(0,100)),p.length<5)continue;const f=/\[FRICTION\]/i.test(h);let m=p,y=[];m=s(m),m=m.split(`
`)[0].trim();const v=m.indexOf("|");if(v>0){const M=m.substring(0,v).trim(),B=m.substring(v+1).trim();y=n(B),m=M}else{const M=n(m);M.length>0&&(y=M,m=m.replace(/\s*#[\w\u00C0-\u017F][\w\u00C0-\u017F-]*/g,"").trim())}const x=m.search(/[\u2192\u2194]/);x>0&&(m=m.substring(0,x).trim());const E=m.trim();E.length>5&&E.length<=500&&(f&&!y.includes("#friction")&&y.push("#friction"),e.push({text:E,status:"neutral",tags:y,isFriction:f}),S.debug(`${f?"Friction":"Vignette"} ajoutée: "${E.substring(0,50)}..." tags:`,y))}if(S.info(`Méthode split unifié: ${e.length} vignettes extraites`),e.length>0)return e.slice(0,10);let r;const a=/\d+\.\s*\[([^\]]+)\]\s*([^|#\n]*)?(?:\s*\|[^|#\n]*)?(?:\s*\|\s*(#[^\n]+))?/gi;for(;(r=a.exec(t))!==null;){const u=r[1].trim();if(u.toUpperCase()==="CONNEXION")continue;const h=r[2]?r[2].trim():"",g=r[3]||"",p=h?`${u} - ${h}`:u;p.length>5&&e.push({text:p,status:"neutral",tags:n(g)})}if(S.info(`Pattern numéroté [Titre]: ${e.length} total`),e.length>0)return e.slice(0,10);const c=/\d+\.\s*[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]\s*(?:\|[^|#\n]*)?(?:\s*\|\s*(#[^\n]+))?/gi;for(;(r=c.exec(t))!==null;){const u=r[1].trim(),h=r[2]||"";u.length>5&&e.push({text:u,status:"neutral",tags:n(h)})}if(S.info(`Pattern guillemets: ${e.length} total`),e.length>0)return e.slice(0,10);const l=/^-\s+(.{10,200})$/gm;for(;(r=l.exec(t))!==null;){const u=r[1].trim(),h=n(u),g=u.replace(/\s*#[\w\u00C0-\u017F-]+/g,"").trim();g.length>5&&e.push({text:g,status:"neutral",tags:h})}if(S.info(`Pattern tiret: ${e.length} total`),e.length>0)return e.slice(0,10);const d=/-\s*\[([^\]]+)\]\s*([^|#\n]*)?(?:\|[^|#\n]*)?(?:\s*\|\s*(#[^\n]+))?/gi;for(;(r=d.exec(t))!==null;){const u=r[1].trim();if(u.toUpperCase()==="CONNEXION")continue;const h=r[2]?r[2].trim():"",g=r[3]||"",p=h?`${u} - ${h}`:u;p.length>5&&e.push({text:p,status:"neutral",tags:n(g)})}return S.info(`Pattern 5 (tiret crochets): ${e.length} total`),e.slice(0,10)}function Qe(t){const e=[],n=o=>o.replace(/^[""\u201C\u201D\s]+|[""\u201C\u201D\s]+$/g,"").trim(),s=t.split(/\[CONNEXION\]/gi);for(let o=1;o<s.length;o++){const i=s[o].trim();if(!i)continue;const r=i.match(/([\u2192\u2194])/);if(!r)continue;const a=r.index,c=r[1];let l=i.substring(0,a).trim();const d=i.substring(a+1).trim();l=n(l);let u=d,h="";const g=d.indexOf("|");if(g>0?(u=d.substring(0,g).trim(),h=d.substring(g+1).trim(),h=h.split(/\n|\[CONNEXION\]|\[NOUVELLE/i)[0].trim()):u=d.split(/\n|\[CONNEXION\]|\[NOUVELLE/i)[0].trim(),u=n(u),l.length<3||u.length<3)continue;const p=c==="↔"||c==="↔"?"↔":"→",f=p==="↔"?"resonance":"implies";e.push({fromText:l,toText:u,type:f,symbol:p,justification:h}),S.debug(`Connexion parsée: "${l.substring(0,30)}..." ${p} "${u.substring(0,30)}..."${h?` | ${h.substring(0,20)}...`:""}`)}return S.info(`${e.length} connexion(s) parsée(s)`),e.slice(0,10)}const K=I("WebviewHandler");function Ze(t,e){if(!t.canvas||!t.canvas.state||!t.canvas.state.nodes)return null;const n=e.toLowerCase().trim(),s=t.canvas.state.nodes;let o=s.find(i=>i.text.toLowerCase().trim()===n);if(!o){let i=null,r=0;for(const a of s){const c=a.text.toLowerCase().trim();if(c.includes(n)||n.includes(c)){const l=Math.min(c.length,n.length)/Math.max(c.length,n.length);l>r&&(r=l,i=a)}}o=i}if(!o){const i=n.substring(0,50);o=s.find(r=>{const a=r.text.toLowerCase().substring(0,50);return a.includes(i)||i.includes(a)})}if(!o){const i=n.split(/\s+/).filter(c=>c.length>3);let r=null,a=0;for(const c of s){const l=c.text.toLowerCase().split(/\s+/),d=i.filter(u=>l.some(h=>h.includes(u)||u.includes(h))).length;d>=Math.min(2,i.length)&&d>a&&(a=d,r=c)}o=r}if(!o){const i=new Set(n.split(/\s+/).filter(c=>c.length>2));let r=null,a=0;for(const c of s){const l=new Set(c.text.toLowerCase().split(/\s+/).filter(g=>g.length>2)),d=[...i].filter(g=>l.has(g)).length,u=new Set([...i,...l]).size,h=u>0?d/u:0;h>a&&h>=.3&&(a=h,r=c)}o=r}return o||K.info(`Vignette non trouvée pour: "${e.substring(0,40)}..."`),o}function so(t,e){let n=0;for(const s of e){const o=Ze(t,s.fromText),i=Ze(t,s.toText);o&&i&&o.id!==i.id?(t.canvas.queueConnection(o.id,i.id,s.type,s.justification||null),n++,K.debug(`Connexion en file: ${o.text.substring(0,20)}... ${s.symbol} ${i.text.substring(0,20)}...${s.justification?` [${s.justification.substring(0,30)}...]`:""}`)):K.warn(`Vignettes non trouvées pour connexion: "${s.fromText.substring(0,30)}..." → "${s.toText.substring(0,30)}..."`)}return n>0&&(K.info(`${n} connexion(s) mises en file, traitement...`),t.canvas.processPendingConnections()),n}const G=["claude","openai","gemini","deepseek","grok","lmstudio"];function ge(t,e){const n=t.providers[e];return n?e==="lmstudio"?!0:!!n.apiKey:!1}function V(t){const e=localStorage.getItem("kairos_api_provider");if(e&&G.includes(e)&&ge(t,e))return{name:e,provider:t.providers[e]};if(G.includes(t.currentProvider)&&ge(t,t.currentProvider))return{name:t.currentProvider,provider:t.providers[t.currentProvider]};for(const n of G)if(ge(t,n))return{name:n,provider:t.providers[n]};return null}function oo(t){return V(t)!==null}function io(t,e){if(localStorage.getItem("kairos_force_webview_mode")==="true")return{mode:"webview",reason:"Mode webview forcé (test)"};if(localStorage.getItem("kairos_api_mode_enabled")==="false")return{mode:"webview",reason:"Mode API désactivé par l'utilisateur"};const n=V(t);return n?{mode:"api",reason:`API ${n.provider.name||n.name} disponible`,provider:n}:{mode:"webview",reason:"Aucune clé API configurée"}}function ro(t){G.includes(t)&&localStorage.setItem("kairos_api_provider",t)}function ao(t){localStorage.setItem("kairos_api_mode_enabled",t?"true":"false")}async function co({llm:t,operation:e,prompt:n,apiProvider:s,onSuccess:o,onError:i,onProgress:r}){const{name:a,provider:c}=s;r?.({state:"loading",message:`Envoi à ${c.name||a}...`});try{const l=t.buildSystemPrompt(e),d=[{role:"user",content:n}],u={max_tokens:4096};if(!window.fgraph||!window.fgraph.llmQuery)throw new Error("API Electron non disponible (window.fgraph.llmQuery)");console.log(`[LLM-API Executor] Appel ${a}, operation: ${e}`);const h=3e4,g=new Promise((m,y)=>setTimeout(()=>y(new Error(`Timeout: pas de réponse de ${c.name||a} après ${h/1e3}s`)),h)),p=await Promise.race([window.fgraph.llmQuery({provider:a,apiKey:c.apiKey,model:c.model,messages:d,systemPrompt:l,options:u}),g]);if(!p.success)throw new Error(p.error||"Erreur API inconnue");if(!p.content||p.content.trim().length===0)throw new Error("Réponse vide du LLM");console.log(`[LLM-API Executor] Réponse reçue (${p.content.length} chars)`),r?.({state:"parsing",message:"Analyse de la réponse..."});let f;try{f=lo(p.content,e)}catch(m){throw new Error(`Erreur de parsing (${e}): ${m.message}`)}f.provider=a,f.usage=p.usage,o?.(f)}catch(l){console.error("[LLM-API Executor] Erreur:",l),i?.(l)}}function lo(t,e){switch(e){case"DÉVELOPPER":{const n=no(t),s=Qe(t);return console.log(`[LLM-API Executor] DÉVELOPPER: ${n.length} vignettes, ${s.length} connexions`),{type:"vignettes",vignettes:n,connections:s,raw:t}}case"RELIER":{const n=Qe(t);return console.log(`[LLM-API Executor] RELIER: ${n.length} connexions`),{type:"connections",connections:n,raw:t}}case"SYNTHÉTISER":{const n=to(t);return console.log(`[LLM-API Executor] SYNTHÉTISER: ${n.length} chars (nettoyé)`),{type:"synthesis",text:n,raw:t}}default:return console.warn(`[LLM-API Executor] Opération inconnue: ${e}`),{type:"raw",content:t}}}function uo(t,e=""){Me();const n=document.createElement("div");n.id="api-loading-overlay",n.className="api-loading-overlay";const s=e?` via ${e}`:"";n.innerHTML=`
        <div class="api-loading-content">
            <div class="api-loading-spinner"></div>
            <div class="api-loading-text">${t} en cours${s}...</div>
            <div class="api-loading-subtext">Appel API direct</div>
        </div>
    `,document.body.appendChild(n),requestAnimationFrame(()=>{n.classList.add("visible")})}function ho(t){const e=document.querySelector(".api-loading-text");e&&(e.textContent=t)}function Me(){const t=document.getElementById("api-loading-overlay");t&&(t.classList.remove("visible"),setTimeout(()=>t.remove(),200))}function po(t,{onRetry:e,onFallbackWebview:n,onDismiss:s}){const o=document.getElementById("api-error-modal");o&&o.remove();const i=document.createElement("div");i.id="api-error-modal",i.className="api-error-overlay";const r=t.message||String(t);let a="",c=!0;r.includes("API key")||r.includes("Unauthorized")||r.includes("401")?(a="Vérifiez votre clé API dans les paramètres.",c=!1):r.includes("rate")||r.includes("429")?a="Limite de requêtes atteinte. Réessayez dans quelques instants.":(r.includes("timeout")||r.includes("network"))&&(a="Problème de connexion. Vérifiez votre réseau."),i.innerHTML=`
        <div class="api-error-content">
            <div class="api-error-header">
                <span class="api-error-icon">⚠️</span>
                <span class="api-error-title">Erreur API</span>
            </div>
            <div class="api-error-message"></div>
            ${a?`<div class="api-error-suggestion">${a}</div>`:""}
            <div class="api-error-actions">
                ${c?'<button class="api-error-btn api-error-retry">Réessayer</button>':""}
                <button class="api-error-btn api-error-webview">Utiliser webview</button>
                <button class="api-error-btn api-error-close">Annuler</button>
            </div>
        </div>
    `;const l=i.querySelector(".api-error-message");l&&(l.textContent=r),document.body.appendChild(i),requestAnimationFrame(()=>{i.classList.add("visible")});const d=()=>{i.classList.remove("visible"),setTimeout(()=>i.remove(),200),s?.()};c&&i.querySelector(".api-error-retry")?.addEventListener("click",()=>{i.remove(),e?.()}),i.querySelector(".api-error-webview")?.addEventListener("click",()=>{i.remove(),n?.()}),i.querySelector(".api-error-close")?.addEventListener("click",d),i.addEventListener("click",u=>{u.target===i&&d()})}function H(t,e=3e3){const n=document.querySelector(".api-success-notification");n&&n.remove();const s=document.createElement("div");s.className="api-success-notification",s.innerHTML=`
        <span class="api-success-icon">✅</span>
        <span class="api-success-message">${t}</span>
    `,document.body.appendChild(s),requestAnimationFrame(()=>{s.classList.add("visible")}),setTimeout(()=>{s.classList.remove("visible"),setTimeout(()=>s.remove(),200)},e)}function go(){if(document.getElementById("api-states-styles"))return;const t=document.createElement("style");t.id="api-states-styles",t.textContent=`
        /* Overlay de chargement */
        .api-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .api-loading-overlay.visible {
            opacity: 1;
        }

        .api-loading-content {
            background: var(--bg-tertiary, #2a2a3e);
            padding: 2rem 3rem;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .api-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--accent-color, #6366f1);
            border-top-color: transparent;
            border-radius: 50%;
            animation: api-spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        @keyframes api-spin {
            to { transform: rotate(360deg); }
        }

        .api-loading-text {
            color: var(--text-primary, #fff);
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }

        .api-loading-subtext {
            color: var(--text-secondary, #888);
            font-size: 0.85rem;
        }

        /* Modal d'erreur */
        .api-error-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .api-error-overlay.visible {
            opacity: 1;
        }

        .api-error-content {
            background: var(--bg-tertiary, #2a2a3e);
            padding: 1.5rem 2rem;
            border-radius: 12px;
            max-width: 450px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .api-error-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .api-error-icon {
            font-size: 1.5rem;
        }

        .api-error-title {
            color: var(--text-primary, #fff);
            font-size: 1.2rem;
            font-weight: 600;
        }

        .api-error-message {
            color: var(--text-secondary, #ccc);
            margin-bottom: 0.75rem;
            line-height: 1.4;
        }

        .api-error-suggestion {
            color: var(--accent-color, #6366f1);
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }

        .api-error-actions {
            display: flex;
            gap: 0.75rem;
            justify-content: flex-end;
        }

        .api-error-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.2s;
        }

        .api-error-retry {
            background: var(--accent-color, #6366f1);
            color: white;
        }

        .api-error-retry:hover {
            background: var(--accent-hover, #5558e3);
        }

        .api-error-webview {
            background: var(--bg-secondary, #1e1e2e);
            color: var(--text-primary, #fff);
            border: 1px solid var(--border-color, #444);
        }

        .api-error-webview:hover {
            background: var(--bg-hover, #2e2e3e);
        }

        .api-error-close {
            background: transparent;
            color: var(--text-secondary, #888);
        }

        .api-error-close:hover {
            color: var(--text-primary, #fff);
        }

        /* Notification de succès */
        .api-success-notification {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--success-color, #22c55e);
            color: white;
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .api-success-notification.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .api-success-icon {
            font-size: 1.1rem;
        }

        .api-success-message {
            font-size: 0.95rem;
        }
    `,document.head.appendChild(t)}const Le={claude:{label:"Claude (Anthropic)",placeholder:"sk-ant-...",keyPrefix:"sk-ant-"},openai:{label:"ChatGPT (OpenAI)",placeholder:"sk-...",keyPrefix:"sk-"},gemini:{label:"Gemini (Google)",placeholder:"AIza...",keyPrefix:"AIza"},deepseek:{label:"DeepSeek",placeholder:"sk-...",keyPrefix:"sk-"},grok:{label:"Grok (xAI)",placeholder:"xai-...",keyPrefix:"xai-"}};async function fo(t,e){t.whenReady&&await t.whenReady();const n=document.getElementById("api-config-modal");n&&n.remove();const s=localStorage.getItem("kairos_api_mode_enabled")!=="false",o=localStorage.getItem("kairos_api_provider")||"",i=document.createElement("div");i.id="api-config-modal",i.className="api-config-overlay",i.innerHTML=`
        <div class="api-config-content">
            <div class="api-config-header">
                <h3>Configuration API</h3>
                <button class="api-config-close">✕</button>
            </div>

            <div class="api-config-body">
                <div class="api-config-toggle-row">
                    <label for="api-mode-toggle">Mode API pour opérations</label>
                    <div class="api-toggle-switch">
                        <input type="checkbox" id="api-mode-toggle" ${s?"checked":""}>
                        <span class="api-toggle-slider"></span>
                    </div>
                </div>
                <p class="api-config-hint">Quand activé, DÉVELOPPER / RELIER / SYNTHÉTISER utilisent l'API directe au lieu du webview.</p>

                <div class="api-config-provider-select">
                    <label for="api-provider-select">Provider API (opérations)</label>
                    <select id="api-provider-select">
                        <option value="">Automatique (même que webview)</option>
                        ${Object.entries(Le).map(([a,c])=>`<option value="${a}" ${o===a?"selected":""}>${c.label}</option>`).join("")}
                    </select>
                </div>

                <div class="api-config-keys">
                    <h4>Clés API</h4>
                    ${Object.entries(Le).map(([a,c])=>{const l=!!t.providers[a]?.apiKey;return`
                        <div class="api-key-row" data-provider="${a}">
                            <label>${c.label}</label>
                            <div class="api-key-input-group">
                                <input type="password"
                                    class="api-key-input"
                                    data-provider="${a}"
                                    placeholder="${c.placeholder}"
                                    value="${l?"••••••••••••":""}"
                                    data-has-key="${l}"
                                >
                                <button class="api-key-toggle" title="Afficher/masquer">👁</button>
                                ${l?'<span class="api-key-status configured">✓</span>':'<span class="api-key-status"></span>'}
                            </div>
                        </div>`}).join("")}
                </div>
            </div>

            <div class="api-config-footer">
                <button class="api-config-cancel">Annuler</button>
                <button class="api-config-save">Sauvegarder</button>
            </div>
        </div>
    `,document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("visible"));const r=()=>{i.classList.remove("visible"),setTimeout(()=>i.remove(),200)};i.querySelector(".api-config-close").addEventListener("click",r),i.querySelector(".api-config-cancel").addEventListener("click",r),i.addEventListener("click",a=>{a.target===i&&r()}),i.querySelectorAll(".api-key-toggle").forEach(a=>{a.addEventListener("click",()=>{const c=a.previousElementSibling;if(c.type==="password"){if(c.type="text",c.dataset.hasKey==="true"&&c.value==="••••••••••••"){const l=c.dataset.provider;c.value=t.providers[l]?.apiKey||""}}else c.type="password"})}),i.querySelectorAll(".api-key-input").forEach(a=>{a.addEventListener("focus",()=>{const c=a;c.value==="••••••••••••"&&(c.value="",c.dataset.cleared="true")}),a.addEventListener("blur",()=>{const c=a;c.dataset.cleared==="true"&&c.value===""?(c.value="••••••••••••",c.dataset.cleared="false"):c.dataset.cleared==="true"&&c.value!==""&&(c.dataset.hasKey="false",c.dataset.cleared="false")})}),i.querySelector(".api-config-save").addEventListener("click",async()=>{const a=document.getElementById("api-mode-toggle").checked;ao(a);const c=document.getElementById("api-provider-select").value;c?ro(c):localStorage.removeItem("kairos_api_provider");const l=i.querySelectorAll(".api-key-input");for(const d of l){const u=d,h=u.dataset.provider,g=u.value.trim();g!=="••••••••••••"&&(g?t.setApiKey(h,g):u.dataset.hasKey==="false"&&t.setApiKey(h,null))}await t.saveConfig(),r(),e?.()})}function mo(t,e,n){t&&(e.whenReady?e.whenReady().then(()=>fe(t,e)):fe(t,e),t.addEventListener("click",()=>{fo(e,()=>{if(fe(t,e),n){const s=n.isAvailable(),o=n.getProvider();console.log(`[API Config] Mode API: ${s?"actif":"inactif"}${o?` (${o.name})`:""}`)}})}))}function fe(t,e){const n=Object.values(e.providers).some(i=>!!i.apiKey),s=localStorage.getItem("kairos_api_mode_enabled")!=="false";t.classList.toggle("api-configured",n&&s),t.title=n&&s?"API configurée - Cliquer pour modifier":"Configurer les clés API";const o=document.getElementById("api-provider-badge");if(o){const i=n&&s?V(e):null;if(i){const r=Le[i.name];o.textContent=r?.label||i.name,o.classList.remove("hidden")}else o.textContent="",o.classList.add("hidden")}}function vo(){if(document.getElementById("api-config-styles"))return;const t=document.createElement("style");t.id="api-config-styles",t.textContent=`
        .api-config-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        .api-config-overlay.visible { opacity: 1; }

        .api-config-content {
            background: var(--bg-tertiary, #2a2a3e);
            border-radius: 12px;
            width: 480px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .api-config-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid var(--border-color, #444);
        }
        .api-config-header h3 {
            margin: 0;
            color: var(--text-primary, #fff);
            font-size: 1.1rem;
        }
        .api-config-close {
            background: none;
            border: none;
            color: var(--text-secondary, #888);
            font-size: 1.2rem;
            cursor: pointer;
        }
        .api-config-close:hover { color: var(--text-primary, #fff); }

        .api-config-body {
            padding: 1.5rem;
        }

        .api-config-toggle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        .api-config-toggle-row label {
            color: var(--text-primary, #fff);
            font-weight: 500;
        }

        .api-toggle-switch {
            position: relative;
            width: 44px;
            height: 24px;
        }
        .api-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .api-toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--bg-secondary, #1e1e2e);
            border-radius: 24px;
            transition: 0.3s;
        }
        .api-toggle-slider::before {
            content: "";
            position: absolute;
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background: white;
            border-radius: 50%;
            transition: 0.3s;
        }
        .api-toggle-switch input:checked + .api-toggle-slider {
            background: var(--accent-color, #6366f1);
        }
        .api-toggle-switch input:checked + .api-toggle-slider::before {
            transform: translateX(20px);
        }

        .api-config-hint {
            color: var(--text-secondary, #888);
            font-size: 0.8rem;
            margin: 0 0 1.25rem;
            line-height: 1.4;
        }

        .api-config-provider-select {
            margin-bottom: 1.25rem;
        }
        .api-config-provider-select label {
            display: block;
            color: var(--text-primary, #fff);
            font-size: 0.9rem;
            margin-bottom: 0.4rem;
        }
        .api-config-provider-select select {
            width: 100%;
            padding: 0.5rem;
            background: var(--bg-secondary, #1e1e2e);
            color: var(--text-primary, #fff);
            border: 1px solid var(--border-color, #444);
            border-radius: 6px;
            font-size: 0.9rem;
        }

        .api-config-keys h4 {
            color: var(--text-primary, #fff);
            margin: 0 0 0.75rem;
            font-size: 0.95rem;
        }

        .api-key-row {
            margin-bottom: 0.75rem;
        }
        .api-key-row label {
            display: block;
            color: var(--text-secondary, #ccc);
            font-size: 0.85rem;
            margin-bottom: 0.3rem;
        }

        .api-key-input-group {
            display: flex;
            align-items: center;
            gap: 0.4rem;
        }
        .api-key-input {
            flex: 1;
            padding: 0.45rem 0.6rem;
            background: var(--bg-secondary, #1e1e2e);
            color: var(--text-primary, #fff);
            border: 1px solid var(--border-color, #444);
            border-radius: 6px;
            font-size: 0.85rem;
            font-family: monospace;
        }
        .api-key-input:focus {
            outline: none;
            border-color: var(--accent-color, #6366f1);
        }

        .api-key-toggle {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            padding: 0.3rem;
        }

        .api-key-status {
            font-size: 0.9rem;
            width: 1.2rem;
            text-align: center;
        }
        .api-key-status.configured {
            color: var(--success-color, #22c55e);
        }

        .api-config-footer {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            border-top: 1px solid var(--border-color, #444);
        }

        .api-config-cancel,
        .api-config-save {
            padding: 0.5rem 1.25rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .api-config-cancel {
            background: var(--bg-secondary, #1e1e2e);
            color: var(--text-primary, #fff);
        }
        .api-config-save {
            background: var(--accent-color, #6366f1);
            color: white;
        }
        .api-config-save:hover {
            background: var(--accent-hover, #5558e3);
        }

        /* Bouton config dans la toolbar */
        #api-config-btn {
            background: none;
            border: 1px solid var(--border-color, #444);
            color: var(--text-secondary, #888);
            cursor: pointer;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 14px;
            transition: all 0.2s;
        }
        #api-config-btn:hover {
            color: var(--text-primary, #fff);
            border-color: var(--text-secondary, #888);
        }
        #api-config-btn.api-configured {
            color: var(--success-color, #22c55e);
            border-color: var(--success-color, #22c55e);
        }

        .api-provider-badge {
            font-size: 11px;
            color: var(--success-color, #22c55e);
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 4px;
            padding: 1px 6px;
            white-space: nowrap;
        }
        .api-provider-badge.hidden {
            display: none;
        }
    `,document.head.appendChild(t)}class yo{app;llm;webviewHandler;canvas;constructor(e){this.app=e,this.llm=e.llm,this.webviewHandler=e.webviewHandler,this.canvas=e.canvas,go(),vo();const n=document.getElementById("api-config-btn");n&&mo(n,this.llm,this),console.log("[LLMApiManager] Initialisé")}isAvailable(){return oo(this.llm)}getProvider(){return V(this.llm)}async executeOperation(e,n,s){const o=io(this.llm);return console.log(`[LLMApiManager] Route: ${o.mode} (${o.reason})`),o.mode==="api"?this.executeViaAPIPath(e,n,s,o.provider):this.executeViaWebviewPath(e,n)}async executeViaAPIPath(e,n,s,o){return new Promise((i,r)=>{co({llm:this.llm,operation:e,prompt:n,apiProvider:o,onSuccess:a=>{Me(),this.handleParsedResponse(e,a,s),i(a)},onError:a=>{Me(),this.handleAPIError(a,e,n,s),r(a)},onProgress:({state:a,message:c})=>{a==="loading"?uo(e,o.provider.name||o.name):ho(c)}})})}async executeViaWebviewPath(e,n){if(!this.webviewHandler)throw new Error("WebviewHandler non disponible");this.webviewHandler.currentOperation=e,this.webviewHandler.updateCaptureButtonText(e);const s=await this.webviewHandler.injectPromptToWebview(n);if(s){const o=`${e}: Prompt injecté → envoyez dans le webview`;this.app.showNotification?.(o)}return{mode:"webview",success:s}}handleParsedResponse(e,n,s){switch(this.updateCircularityTracking(n.raw||n.content||""),n.type){case"vignettes":this.importVignettes(n.vignettes,n.connections);break;case"connections":this.importConnections(n.connections);break;case"synthesis":this.handleSynthesis(n.text,s);break;default:console.warn("[LLMApiManager] Type de réponse inconnu:",n.type)}}updateCircularityTracking(e){this.llm?.canvasAnalyzer&&e&&(this.llm.canvasAnalyzer.lastLLMOutput=e,console.log("[LLMApiManager] lastLLMOutput stocké pour circularité"))}importVignettes(e,n){if(e.length===0&&n.length===0){H("Aucun contenu à importer",2e3);return}if(e.length===0&&n.length>0){this.importConnections(n);return}this.webviewHandler?(this.webviewHandler.pendingTextConnections=n,this.webviewHandler.showVignetteSelectionUI(e,"",n.length)):this.importVignettesDirect(e,n),H(`${e.length} vignette(s) proposée(s)`,2e3)}importVignettesDirect(e,n){e.forEach((s,o)=>{let i=null;for(const a of n)if(a.toText){const c=a.toText.toLowerCase().trim().substring(0,50),l=s.text.toLowerCase().trim().substring(0,50);if(c===l||c.includes(l)||l.includes(c)){const d=this.canvas.state.nodes.find(u=>{const h=u.text.toLowerCase().trim().substring(0,50),g=a.fromText.toLowerCase().trim().substring(0,50);return h===g||h.includes(g)||g.includes(h)});if(d){i=d.id;break}}}const r=this.canvas.getSmartImportPosition(i,o,e.length);this.canvas.createNode(r.x,r.y,s.text,s.status||"neutral",s.tags||[],!0,{newlyImported:!0})}),n.length>0&&setTimeout(()=>{this.importConnections(n)},100)}importConnections(e){if(e.length===0)return;if(!this.webviewHandler){console.error("[LLMApiManager] webviewHandler non disponible");return}const n=so(this.webviewHandler,e);H(`${n} connexion(s) créée(s)`,2e3),setTimeout(()=>{this.app.metrics?.updateSuggestionBanner?.()},150)}handleSynthesis(e,n){if(!e||e.trim().length===0){H("Synthèse vide",2e3);return}document.dispatchEvent(new CustomEvent("responseCaptured",{detail:{content:e,operation:"SYNTHÉTISER"}})),H("Synthèse capturée",2e3)}handleAPIError(e,n,s,o){console.error("[LLMApiManager] Erreur:",e),po(e,{onRetry:()=>{const i=V(this.llm);i&&this.executeViaAPIPath(n,s,o,i)},onFallbackWebview:()=>{this.executeViaWebviewPath(n,s)},onDismiss:()=>{console.log("[LLMApiManager] Erreur ignorée par l'utilisateur")}})}}function xo(t,e){if(t.length===0)return 0;const n=new Map;for(const i of t)n.set(i.id,new Set);for(const i of e)n.get(i.from)?.add(i.to),n.get(i.to)?.add(i.from);const s=new Set;let o=0;for(const i of t){if(s.has(i.id))continue;o++;const r=[i.id];for(s.add(i.id);r.length>0;){const a=r.shift();for(const c of n.get(a)||[])s.has(c)||(s.add(c),r.push(c))}}return o}function bo(t,e){return t.length>0?e.length/t.length:0}function Eo(t,e,n,s){if(t.length<n)return{enabled:!1,ratio:0,components:0,malus:0,bonus:0};const o=bo(t,e),i=xo(t,e);let r=0,a=0;return o<s.underConnectedThreshold?r+=s.underConnectedMalus:o>s.overConnectedThreshold?r+=s.overConnectedMalus:o>=1&&o<=2&&(a+=s.neutralBonusMax),i>1&&(r+=(i-1)*s.disconnectedMalus),{enabled:!0,ratio:o,components:i,malus:r,bonus:a}}const Re={defaultScore:50,newTagBonus:10,llmEchoThreshold:.7,llmEchoMalus:-20,stagnationMalus:-15,frictionAcceptedBonus:15,graphMinNodes:8,graphUnderConnectedThreshold:.5,graphOverConnectedThreshold:3,graphNeutralBonusMax:10,graphDisconnectedMalus:-5,graphUnderConnectedMalus:-25,graphOverConnectedMalus:-25,moderateFrictionThreshold:50,radicalFrictionThreshold:30,echoJaccardThreshold:.35,maxHistory:100,tagLookbackTurns:3},wo=20,et=15,Co=2,$e=.35,So=-20;function tt(t=Re){return{score:t.defaultScore,history:[],turnCount:0,lastTurnTags:[],lastLLMOutput:"",lastUserInput:"",frictionBonusPending:!1,lastFrictionAcceptedTurn:-1/0}}const Mo=new Set(["le","la","les","un","une","de","du","des","et","ou","est","sont","dans","pour","qui","que","sur","par","avec","sans","ce","cette","ces","au","aux","en","ne","pas","plus","moins","tout","tous","toute","toutes","autre","autres","meme","comme","mais","donc","car","ni","si","se","son","sa","ses","leur","leurs","nous","vous","ils","elles","lui","elle","il","on","je","tu","etre","avoir","faire","dit","fait","peut","faut","doit","vers","chez"]);function Lo(t){return t?t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").split(/\W+/).filter(e=>e.length>3&&!Mo.has(e)):[]}function Wt(t,e=$e){const n={detected:!1,maxJaccard:0,pairsAbove:0,totalPairs:0,topPairs:[]};if(t.length<2)return n;const s=t.map(o=>new Set(Lo(o.text)));for(let o=0;o<s.length;o++)if(s[o].size!==0)for(let i=o+1;i<s.length;i++){if(s[i].size===0)continue;n.totalPairs++;const r=[...s[o]].filter(l=>s[i].has(l)).length,a=new Set([...s[o],...s[i]]).size,c=a>0?r/a:0;c>n.maxJaccard&&(n.maxJaccard=c),c>e&&(n.pairsAbove++,n.detected=!0,n.topPairs.length<10&&n.topPairs.push({nodeA:t[o].text.substring(0,60),nodeB:t[i].text.substring(0,60),idA:t[o].id,idB:t[i].id,jaccard:Math.round(c*100)/100}))}return n.topPairs.sort((o,i)=>i.jaccard-o.jaccard),n.maxJaccard=Math.round(n.maxJaccard*100)/100,n}let D=null;function Io(t,e=$e){return D=Wt(t,e),D.detected&&console.log("[OXYGEN ECHO]",{maxJaccard:D.maxJaccard,pairsAbove:D.pairsAbove,topPair:D.topPairs[0]||null}),D.detected}function Kt(){return D}function Ie(t){const e=new Set;for(const n of t)if(n.tags)for(const s of n.tags)e.add(s.replace(/^#/,"").toLowerCase());return[...e]}function Gt(t){return t<20?"critical":t<40?"low":t<60?"moderate":t<80?"healthy":"thriving"}function nt(t,e,n,s){const o={newTags:{count:0,bonus:0},llmEcho:{overlap:0,malus:0,maxJaccard:0},stagnation:{turns:0,malus:0},frictionBonus:{accepted:!1,bonus:0},graphStructure:{enabled:!1,ratio:0,components:0,malus:0,bonus:0}};let i=s.defaultScore;o.graphStructure=Eo(e,n,s.graphMinNodes,{underConnectedThreshold:s.graphUnderConnectedThreshold,overConnectedThreshold:s.graphOverConnectedThreshold,neutralBonusMax:s.graphNeutralBonusMax,disconnectedMalus:s.graphDisconnectedMalus,underConnectedMalus:s.graphUnderConnectedMalus,overConnectedMalus:s.graphOverConnectedMalus}),i+=o.graphStructure.malus+o.graphStructure.bonus;const r=Io(e,s.echoJaccardThreshold),a=Kt();o.llmEcho.overlap=r?1:0,o.llmEcho.maxJaccard=a?.maxJaccard??0,r&&(o.llmEcho.malus=So),i+=o.llmEcho.malus;const c=Ie(e),l=To(c,t.lastTurnTags,t.turnCount,s);o.newTags.count=l.newCount,o.newTags.bonus=l.bonus,o.stagnation.turns=l.stagnant?1:0,o.stagnation.malus=l.stagnationMalus,i+=l.bonus+l.stagnationMalus;const d=No(t,s);o.frictionBonus.accepted=d.active,o.frictionBonus.bonus=d.bonus,i+=d.bonus;const u=Math.max(0,Math.min(100,i));console.log("[OXYGEN SNAPSHOT]",{base:s.defaultScore,structural:o.graphStructure.malus+o.graphStructure.bonus,echo:o.llmEcho.malus,tagDiversity:l.bonus+l.stagnationMalus,friction:d.bonus,rawScore:i,clampedScore:u,ratio:o.graphStructure.ratio,components:o.graphStructure.components,turnCount:t.turnCount});const h=Gt(u),g=u<s.radicalFrictionThreshold?"radical":u<s.moderateFrictionThreshold?"moderate":"none";return{score:u,previousScore:t.score,delta:u-t.score,signals:o,level:h,shouldInjectFriction:g!=="none",frictionLevel:g,timestamp:Date.now()}}function To(t,e,n,s){if(e.length===0||n===0)return{bonus:0,stagnationMalus:0,newCount:0,stagnant:!1};const o=new Set(e[0]),i=t.filter(r=>!o.has(r));return i.length>0?{bonus:Math.min(i.length*s.newTagBonus,wo),stagnationMalus:0,newCount:i.length,stagnant:!1}:n>=s.tagLookbackTurns?{bonus:0,stagnationMalus:s.stagnationMalus,newCount:0,stagnant:!0}:{bonus:0,stagnationMalus:0,newCount:0,stagnant:!1}}function No(t,e){return t.frictionBonusPending?{active:!0,bonus:Math.min(e.frictionAcceptedBonus,et)}:t.lastFrictionAcceptedTurn>-1/0&&t.turnCount-t.lastFrictionAcceptedTurn<=Co?{active:!0,bonus:Math.min(e.frictionAcceptedBonus,et)}:{active:!1,bonus:0}}async function me(t){try{const e=window.fgraph;e?.db?.attractors?.mergeData&&await e.db.attractors.mergeData(j(),{oxygen:Po(t)})}catch(e){console.warn("[Oxygen] Save failed:",e)}}async function Ao(){try{const t=window.fgraph;if(!t?.db?.attractors?.getData)return null;const e=await t.db.attractors.getData(j());if(e?.oxygen)return Oo(e.oxygen)}catch(t){console.warn("[Oxygen] Load failed:",t)}return null}function Po(t){return{score:t.score,history:t.history,turnCount:t.turnCount,lastTurnTags:t.lastTurnTags,lastFrictionAcceptedTurn:t.lastFrictionAcceptedTurn}}function Oo(t){return{score:typeof t.score=="number"?t.score:Re.defaultScore,history:Array.isArray(t.history)?t.history:[],turnCount:typeof t.turnCount=="number"?t.turnCount:0,lastTurnTags:Array.isArray(t.lastTurnTags)?t.lastTurnTags:[],lastLLMOutput:"",lastUserInput:"",frictionBonusPending:!1,lastFrictionAcceptedTurn:typeof t.lastFrictionAcceptedTurn=="number"?t.lastFrictionAcceptedTurn:-1/0}}class Do{state;config;lastResult=null;constructor(e){this.config={...Re,...e},this.state=tt(this.config)}updateConfig(e){this.config={...this.config,...e}}async init(){const e=await Ao();e&&(this.state=e)}evaluate(e,n){this.state.lastTurnTags.length===0&&(this.state.lastTurnTags=[Ie(e)]);const s=nt(this.state,e,n,this.config);return this.state.score=s.score,this.lastResult=s,s}async recordTurn(e,n){const s=nt(this.state,e,n,this.config);this.state.score=s.score,this.state.turnCount++;const o=Ie(e);return this.state.lastTurnTags.push(o),this.state.lastTurnTags.length>this.config.tagLookbackTurns&&this.state.lastTurnTags.shift(),this.state.frictionBonusPending&&(this.state.lastFrictionAcceptedTurn=this.state.turnCount,this.state.frictionBonusPending=!1),this.state.history.push({turn:this.state.turnCount,score:s.score,delta:s.delta,signals:ko(s.signals),timestamp:s.timestamp}),this.state.history.length>this.config.maxHistory&&this.state.history.shift(),this.lastResult=s,await me(this.state),s}setLLMOutput(e){this.state.lastLLMOutput=e}setUserInput(e){this.state.lastUserInput=e}markFrictionAccepted(){this.state.frictionBonusPending=!0}getScore(){return this.state.score}getLastResult(){return this.lastResult}getFrictionLevel(){return this.state.score<this.config.radicalFrictionThreshold?"radical":this.state.score<this.config.moderateFrictionThreshold?"moderate":"none"}async save(){await me(this.state)}async reset(){this.state=tt(this.config),this.lastResult=null,await me(this.state)}status(){console.group("[OxygenManager] Status"),console.log("Score:",this.state.score),console.log("Level:",Gt(this.state.score)),console.log("Turn:",this.state.turnCount),console.log("Friction:",this.getFrictionLevel()),console.log("Last result:",this.lastResult),console.log("Tags window:",this.state.lastTurnTags),console.log("History entries:",this.state.history.length),console.groupEnd()}jaccardReport(e){const n=Wt(e);return console.group(`[Jaccard Report] ${e.length} nodes, ${n.totalPairs} paires`),console.log(`Max Jaccard: ${n.maxJaccard} (seuil: ${$e})`),console.log(`Paires au-dessus du seuil: ${n.pairsAbove}`),console.log(`Écho détecté: ${n.detected?"OUI":"non"}`),n.topPairs.length>0?(console.log("Top paires:"),console.table(n.topPairs)):console.log("Aucune paire au-dessus du seuil."),console.groupEnd(),n}getLastJaccardAnalysis(){return Kt()}}function ko(t){const e=[];return t.newTags.bonus>0&&e.push(`tags+${t.newTags.count}`),t.llmEcho.malus<0&&e.push(`echo(${t.llmEcho.overlap.toFixed(2)})`),t.stagnation.malus<0&&e.push(`stagnation(${t.stagnation.turns}t)`),t.frictionBonus.accepted&&e.push("friction+"),t.graphStructure.enabled&&(t.graphStructure.malus<0&&e.push(`graph(r=${t.graphStructure.ratio.toFixed(1)},c=${t.graphStructure.components})`),t.graphStructure.bonus>0&&e.push("graph+")),e}const J=I("ThemeManager"),Jt="kairos_theme",Qt="obsidian",Zt=["obsidian","porcelain","aurora","kraft"],Ro={obsidian:"#0f1117",porcelain:"#e8e6e0",aurora:"#0c1222",kraft:"#1a1714"},$o={obsidian:"Obsidian",porcelain:"Porcelain",aurora:"Aurora",kraft:"Kraft"};function _o(){const t=localStorage.getItem(Jt),e=t&&Zt.includes(t)?t:Qt;en(e),J.info(`Thème initial : ${e}`)}function en(t){document.documentElement.setAttribute("data-theme",t),localStorage.setItem(Jt,t),tn(t)}function Fo(){return document.documentElement.getAttribute("data-theme")||Qt}function Bo(){const t=document.getElementById("btn-theme"),e=document.getElementById("theme-menu");if(!t||!e){J.warn("Bouton ou menu thème introuvable dans le DOM");return}t.addEventListener("click",n=>{n.stopPropagation(),e.classList.contains("visible")?e.classList.remove("visible"):(tn(Fo()),e.classList.add("visible"))}),e.addEventListener("click",n=>{const s=n.target.closest(".theme-option");if(!s)return;const o=s.dataset.theme;o&&Zt.includes(o)&&(en(o),e.classList.remove("visible"),J.info(`Thème changé : ${o}`))}),document.addEventListener("click",()=>{e.classList.remove("visible")}),e.addEventListener("click",n=>{n.stopPropagation()}),J.info("Sélecteur de thème configuré")}function tn(t){document.querySelectorAll(".theme-option").forEach(o=>{const i=o;i.dataset.theme===t?i.classList.add("active"):i.classList.remove("active")});const n=document.getElementById("theme-label");n&&(n.textContent=$o[t]);const s=document.getElementById("theme-btn-swatch");s&&(s.style.background=Ro[t])}const w=I("WebApp");class Ho{canvas;storage;llm;webviewHandler;metrics;syntheses;history;currentOperation;canvasAnalyzer;llmApiManager;oxygen;_switching;_saveChain;_debounceSaveTimer;constructor(){this.canvas=null,this.storage=null,this.llm=null,this.webviewHandler=null,this.metrics=null,this.syntheses=null,this.history=null,this.currentOperation="DÉVELOPPER",this.canvasAnalyzer=null,this.llmApiManager=null,this.oxygen=null,this._switching=!1,this._saveChain=Promise.resolve(),this._debounceSaveTimer=null,this.init()}async init(){w.info("Initialisation KAIROS Web..."),dn(),_o();try{this.storage=new Dn,this.canvas=new Hs,this.webviewHandler={canvas:this.canvas},this.llm=new zs,await this.llm.loadConfig(),this.metrics=new Vs(this.canvas);try{this.oxygen=new Do,await this.oxygen.init(),this.metrics&&(this.metrics.oxygen=this.oxygen),w.info(`OxygenManager initialisé, score: ${this.oxygen.getScore()}`)}catch(o){w.error("Erreur init OxygenManager:",o)}this.history=new qs(this),mn(this);try{this.canvasAnalyzer=new eo(this),await this.canvasAnalyzer.init(),this.llm.setCanvasAnalyzer(this.canvasAnalyzer),this.metrics&&(this.metrics.analyzer=this.canvasAnalyzer),w.info("CanvasAnalyzer initialisé")}catch(o){w.error("Erreur init CanvasAnalyzer:",o)}this.llmApiManager=new yo(this);const e=this.llmApiManager.importVignettesDirect.bind(this.llmApiManager);this.llmApiManager.importVignettes=(o,i)=>{if(o.length===0&&i.length>0){this.llmApiManager.importConnections(i);return}o.length!==0&&e(o,i)},w.info(`LLMApiManager: ${this.llmApiManager.isAvailable()?"API disponible":"pas de clé"}`);const n=wn();at(n,this),this.setupToolbar(),Bo(),Sn(this),this.setupAdaptiveSystem(),this.setupEventListeners(),un(this.llm,()=>{this.llmApiManager&&w.info(`API key configurée, available: ${this.llmApiManager.isAvailable()}`)}),pn(this),this.metrics.calculateMetrics(),this.metrics.updateMetricsDisplay(),this.oxygen&&this.canvas&&this.oxygen.evaluate(this.canvas.state.nodes,this.canvas.state.connections),this.metrics.updateSuggestionBanner(),this.updateDebugPanel();const s=this;window.app=new Proxy(s,{get(o,i){return i==="llm"?{currentProvider:o.llm?.currentProvider,providers:Object.fromEntries(Object.entries(o.llm?.providers||{}).map(([r,a])=>[r,{...a,apiKey:a.apiKey?"***":null}]))}:o[i]}}),w.info("KAIROS Web initialisé avec succès")}catch(e){w.error("Erreur initialisation:",e)}}setupToolbar(){const e=document.getElementById("create-pole-btn"),n=document.getElementById("clear-btn"),s=document.getElementById("btn-tree-layout");e&&e.addEventListener("click",()=>this.createNewNode()),n&&n.addEventListener("click",()=>this.clearGraph()),s&&s.addEventListener("click",async()=>{if(this.canvas.state.nodes.some(i=>i.newlyImported)){this.showNotification("Validez d'abord les vignettes importées");return}if(this.canvas.state.nodes.filter(i=>!i.synthesized).length===0){this.showNotification("Aucune vignette à réorganiser");return}this.history&&this.history.saveState("layout arbre"),this.canvas.applyTreeLayout(),this.showNotification("Layout en arbre appliqué")})}setupAdaptiveSystem(){document.querySelectorAll(".btn-operation").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.operation;n&&this.executeAdaptiveOperation(n)})}),document.querySelectorAll(".btn-sel-op").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.operation;n&&this.executeAdaptiveOperation(n)})}),this.setupMetricsHooks()}setupMetricsHooks(){const e=this.canvas.createNode.bind(this.canvas);this.canvas.createNode=(...a)=>{this.history&&this.history.saveState("création vignette");const c=e(...a);return this.metrics.recalculateDebounced(),this.scheduleSave(),c};const n=this.canvas.deleteNode.bind(this.canvas);this.canvas.deleteNode=async(...a)=>{this.history&&this.history.saveState("suppression vignette");const c=await n(...a);return this.metrics.recalculateDebounced(),await this.saveData(),c};const s=this.canvas.createConnection.bind(this.canvas);this.canvas.createConnection=(...a)=>{this.history&&this.history.saveState("création connexion");const c=s(...a);return this.metrics.recalculateDebounced(),this.scheduleSave(),c};const o=this.canvas.updateNodeElement.bind(this.canvas);this.canvas.updateNodeElement=(...a)=>{const c=o(...a);return this.metrics.recalculateDebounced(),c};const i=this.canvas.deleteConnection.bind(this.canvas);this.canvas.deleteConnection=(...a)=>{this.history&&this.history.saveState("suppression connexion");const c=i(...a);return this.metrics.recalculateDebounced(),this.scheduleSave(),c};const r=this.canvas.cycleNodeStatus.bind(this.canvas);this.canvas.cycleNodeStatus=(...a)=>{this.history&&this.history.saveState("changement statut");const c=r(...a),l=a[0];return l&&l.status==="priority"&&this.showNotification("Ancre du graphe — le LLM structurera ses réponses autour de cette vignette"),this.metrics.recalculateDebounced(),this.scheduleSave(),c},document.addEventListener("nodeDragStart",()=>{this.history&&this.history.saveState("déplacement vignette")}),document.addEventListener("nodeDragEnd",async()=>{await this.saveData()}),document.addEventListener("nodeEditStart",()=>{this.history&&this.history.saveState("édition vignette")}),document.addEventListener("nodeEdited",async()=>{await this.saveData()})}setupEventListeners(){document.addEventListener("keydown",async e=>{if(e.ctrlKey&&e.shiftKey&&(e.key==="D"||e.key==="d")){e.preventDefault();const n=document.getElementById("oxygen-strip");n&&n.classList.toggle("oxygen-strip-hidden")}}),document.addEventListener("frictionVignetteAccepted",()=>{this.oxygen?.markFrictionAccepted()}),document.addEventListener("selectionChanged",()=>{this.updateSelectionLLMButton(),this.metrics&&this.metrics.updateSuggestionBanner()}),document.addEventListener("connectionsChanged",()=>{this.metrics&&this.metrics.recalculateDebounced()}),document.addEventListener("connectionsPendingResult",e=>{const n=e.detail;this.showNotification(`${n.processed}/${n.total} connexions créées, ${n.failed} introuvable(s)`)}),document.addEventListener("nodeDeleted",()=>{this.metrics&&this.metrics.recalculateDebounced()}),document.addEventListener("oxygenUpdated",()=>{this.updateDebugPanel()})}async executeAdaptiveOperation(e){if(this.llmApiManager&&!this.llmApiManager.isAvailable()){this.showNotification("Configurez une clé API pour utiliser cette opération");const n=document.getElementById("api-key-modal");n&&n.classList.remove("hidden");return}await Ln(this,e)}handleResponseCaptured(e){In(this,e)}updateSelectionLLMButton(){Nn(this)}updateFrictionIndicator(e=null){lt(this,e)}updateDebugPanel(e=null){dt(this,e)}async loadData(){const e=await this.storage.load();e&&this.canvas.loadData(e)}scheduleSave(){this._switching||(this._debounceSaveTimer&&clearTimeout(this._debounceSaveTimer),this._debounceSaveTimer=setTimeout(()=>{this._debounceSaveTimer=null,this.saveData()},300))}async saveData(e=null){this._switching||(e&&this.history&&this.history.saveState(e),this._debounceSaveTimer&&(clearTimeout(this._debounceSaveTimer),this._debounceSaveTimer=null),this._saveChain=this._saveChain.then(async()=>{const n=this.canvas.getData();await this.storage.save(n)}).catch(n=>w.error("Erreur sauvegarde:",n)),await this._saveChain)}createNewNode(){const e=this.canvas.polesContainer.getBoundingClientRect(),n=e.width/2-this.canvas.state.panX,s=e.height/2-this.canvas.state.panY,o=this.canvas.createNode(n,s,"Nouvelle vignette");setTimeout(()=>{this.canvas.showEditModal(o,!0)},10)}async clearGraph(){if(confirm("Effacer tout le canvas ? Cette action est irréversible."))try{this.history&&this.history.saveState("clear canvas"),this.canvas.clear(),this.history&&this.history.clear(),this.llm&&this.llm.canvasHistory&&this.llm.canvasHistory.reset(),this.canvasAnalyzer&&this.canvasAnalyzer.reset(),this.oxygen&&await this.oxygen.reset(),this.updateFrictionIndicator({score:0,signals:[],shouldInjectFriction:!1}),this.metrics&&(this.metrics.calculateMetrics(),this.metrics.updateMetricsDisplay(),this.metrics.updateSuggestionBanner()),this.showNotification("Canvas effacé")}catch(e){w.error("Erreur clearGraph:",e),this.showNotification("Erreur lors de l'effacement")}}showNotification(e,n){const s=document.createElement("div");s.style.cssText=`
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--theme-notification-bg);
            color: var(--theme-text-primary);
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 2000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        `,s.textContent=e,document.body.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transition="opacity 0.3s",setTimeout(()=>s.remove(),300)},2e3)}}new Ho;