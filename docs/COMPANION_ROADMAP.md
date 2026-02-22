# Companion — Roadmap

**Module** : Chat LLM comparatif (fenêtre Electron secondaire)
**Objectif** : Explorer un sujet via conversation libre, puis comparer avec l'exploration par graphe KAIROS.
**Usage** : Companion d'abord (pas d'influence), puis KAIROS dans un second temps.

---

## Features livrées

| ID | Feature | Détails |
|----|---------|---------|
| C001 | Intégration Electron | Fenêtre secondaire partageant main process, DB, preload, providers LLM. Bouton dans le tiroir toolbar assisté. 6 fichiers créés, 6 modifiés. |
| C002 | Sessions CRUD | Créer / lister / ouvrir / terminer / supprimer. Persistance SQLite (`companion_sessions` + `companion_messages`). CASCADE on delete. |
| C003 | Chat multi-provider | Anthropic, OpenAI, Gemini, DeepSeek, Ollama. Clés API via safeStorage. System prompt = intent seul (pas de contenu canvas). |
| C004 | Sélection modèle dynamique | Input texte pour providers cloud (modèle par défaut auto), dropdown dynamique pour Ollama (fetch `/api/tags`). |
| C005 | Canvas KAIROS lié | Lien optionnel vers un canvas KAIROS (pré-sélection via query param `?canvasId=`). |
| C006 | Correcteur orthographique | Spell checker français + anglais, menu contextuel avec suggestions, changement de langue. |
| C007 | Synthèse de fin de session | 1 appel LLM au clic "Terminer". Format 3 mouvements (introduction / développement / ouverture) — même format que KAIROS SYNTHÉTISER. Persistée dans `companion_sessions.synthesis`. Fallback graceful si erreur LLM. |
| C008 | Actions sur messages | Copier (tous messages) + Modifier inline (messages user). Update en DB via `messages.update()`. |
| C009 | Compteur messages dynamique | Sidebar mise à jour après chaque échange LLM. |

---

## Bugs connus

| # | Description | Statut |
|---|-------------|--------|
| — | Aucun bug actif | — |

---

## Features planifiées

### C010 — Export de session

Exporter une session complète (messages + synthèse) en Markdown ou JSON pour archivage ou partage.

### C011 — Métriques conversation

Tableau de bord simple en fin de session :
- Nombre de tours
- Tokens totaux (in/out)
- Latence moyenne
- Coût estimé (par provider)
- Durée de la session

### C012 — Vue comparative Companion vs KAIROS

Quand une session est liée à un canvas KAIROS, afficher côte à côte :
- Synthèse Companion (3 mouvements)
- Synthèse KAIROS (3 mouvements)
- Différences visuelles (thèmes abordés vs ignorés)

Prérequis : les deux synthèses doivent exister.

### C013 — Historique de recherche

Permettre de rechercher dans les messages d'une session (Ctrl+F).

### C014 — Streaming des réponses

Afficher la réponse LLM en streaming (token par token) au lieu d'attendre la réponse complète. Requiert une adaptation du handler `llm-query` dans main.js.

---

## Architecture

```
src/renderer/
  companion.html              # Entry point HTML
  styles/companion.css         # CSS non-layered (451 lignes)
  js/companion-app.ts          # SPA principale (536 lignes, 13 fonctions)
  js/companion/
    llm.ts                     # Module LLM (2 fonctions : sendToLLM, generateSynthesis)
    types.ts                   # Types TS (4 interfaces/types)

src/database/
  repositories/companion.js    # Repository SQLite (8 méthodes)

main.js                        # createCompanionWindow()
preload.js                     # window.fgraph.db.companion.*
```

Tables SQLite : `companion_sessions` (8 colonnes), `companion_messages` (8 colonnes + index).

Registre des fonctions : `doc projet/COMPANION_FUNCTION_REGISTRY.md`
