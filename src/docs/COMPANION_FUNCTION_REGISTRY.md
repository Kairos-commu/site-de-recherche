# Companion — Registre des fonctions

- **Date de génération** : 2026-02-22
- **Nombre total de fonctions recensées** : 18
- **Fichiers analysés** : 4 fichiers (2 TypeScript renderer, 1 JS repository, 1 JS IPC handlers)

## Fichiers analysés

| # | Fichier | Fonctions |
|---|---------|-----------|
| 1 | src/renderer/js/companion-app.ts | 13 |
| 2 | src/renderer/js/companion/llm.ts | 2 |
| 3 | src/database/repositories/companion.js | 8 (sessions: 5, messages: 3) |
| 4 | src/renderer/js/companion/types.ts | 0 (types uniquement) |

---

## Fonctions qui mutent l'état

### SQLite (via IPC)
- `sessions.create` (companion.js) — INSERT companion_sessions
- `sessions.end` (companion.js) — UPDATE ended_at + synthesis
- `sessions.remove` (companion.js) — DELETE session + CASCADE messages
- `messages.create` (companion.js) — INSERT companion_messages
- `messages.update` (companion.js) — UPDATE message content

### Module-level state
- `init` (companion-app.ts) — set currentSession, kairosCanvases
- `openSession` (companion-app.ts) — set currentSession
- `render` (companion-app.ts) — reset currentSession context (DOM)
- `renderNewSessionForm > btn-create` (companion-app.ts) — set currentSession

### DOM
- `render` — remplace #app innerHTML (shell sidebar + main)
- `loadSessionList` — remplace #session-list innerHTML
- `renderNewSessionForm` — remplace #main innerHTML (formulaire)
- `renderChat` — remplace #main innerHTML (header + messages + input/synthèse)
- `setupMessageActions` — ajoute event listener délégué sur #chat-area
- `setupChatInput` — bind events textarea + bouton envoyer

---

## Registre détaillé par fichier

---

## src/renderer/js/companion-app.ts

### init
- **Rôle** : Point d'entrée. Charge les canvas KAIROS, rend le shell, charge la liste des sessions, pré-sélectionne le canvas passé en query param
- **Params** : —
- **Retour** : `Promise<void>`
- **Modifie** : kairosCanvases, DOM (#app, #session-list), ouvre le formulaire si canvasId en query param
- **Appelle** : window.fgraph.db.canvas.getAll, render, loadSessionList, renderNewSessionForm
- **Appelée par** : boot (ligne 536, auto-invoquée)

### render
- **Rôle** : Rend le shell principal (sidebar + zone main vide)
- **Params** : —
- **Retour** : `void`
- **Modifie** : DOM (#app innerHTML)
- **Appelle** : renderNewSessionForm (via onclick btn-new)
- **Appelée par** : init, btn-delete handler

### loadSessionList
- **Rôle** : Charge et affiche la liste des sessions dans la sidebar. Marque la session active
- **Params** : —
- **Retour** : `Promise<void>`
- **Modifie** : DOM (#session-list innerHTML)
- **Appelle** : window.fgraph.db.companion.sessions.getAll, esc, fmtDate, openSession (via onclick)
- **Appelée par** : init, openSession, renderChat (btn-create, btn-delete), send (fire-and-forget)

### renderNewSessionForm
- **Rôle** : Affiche le formulaire de création de session (intent, provider, modèle, canvas lié)
- **Params** : `preselectedCanvasId?: string`
- **Retour** : `void`
- **Modifie** : DOM (#main innerHTML)
- **Appelle** : esc, updateModelField, window.fgraph.db.companion.sessions.create, openSession, loadSessionList
- **Appelée par** : init (si canvasId en query param), render (via btn-new onclick)

### openSession
- **Rôle** : Charge une session par ID depuis la DB, met à jour l'état, rend la vue chat
- **Params** : `id: string`
- **Retour** : `Promise<void>`
- **Modifie** : currentSession, DOM (sidebar + main)
- **Appelle** : window.fgraph.db.companion.sessions.getById, window.fgraph.db.companion.messages.getAllBySession, loadSessionList, renderChat
- **Appelée par** : loadSessionList (onclick), renderNewSessionForm (btn-create), renderChat (btn-end, btn-cancel, setupMessageActions), setupMessageActions (edit save/cancel)

### renderChat
- **Rôle** : Rend la vue chat complète (header, messages, input ou synthèse). Installe les handlers Terminer, Supprimer
- **Params** : `session: CompanionSession, messages: CompanionMessage[]`
- **Retour** : `void`
- **Modifie** : DOM (#main innerHTML)
- **Appelle** : esc, renderMessage, renderSynthesisBlock, scrollToBottom, setupMessageActions, setupChatInput, generateSynthesis (via btn-end), window.fgraph.db.companion.sessions.end, window.fgraph.db.companion.sessions.remove, openSession, render, loadSessionList
- **Appelée par** : openSession

### renderMessage
- **Rôle** : Génère le HTML d'un message (bulle + meta + boutons copier/éditer)
- **Params** : `msg: CompanionMessage`
- **Retour** : `string` (HTML)
- **Modifie** : rien (pure)
- **Appelle** : esc, fmtTime
- **Appelée par** : renderChat, send (ajout optimiste)

### setupMessageActions
- **Rôle** : Installe un event listener délégué sur #chat-area pour copier et éditer les messages
- **Params** : `session: CompanionSession`
- **Retour** : `void`
- **Modifie** : DOM (event listener), clipboard (copier), SQLite (éditer via messages.update)
- **Appelle** : navigator.clipboard.writeText, window.fgraph.db.companion.messages.update, openSession
- **Appelée par** : renderChat

### setupChatInput
- **Rôle** : Configure le textarea d'entrée (auto-resize, Ctrl+Enter, envoi). Contient la closure `send()`
- **Params** : `session: CompanionSession`
- **Retour** : `void`
- **Modifie** : DOM (events), SQLite (messages.create ×2)
- **Appelle** : window.fgraph.db.companion.messages.create, sendToLLM, renderMessage, scrollToBottom, loadSessionList
- **Appelée par** : renderChat (si session non terminée)

### updateModelField
- **Rôle** : Met à jour le champ modèle selon le provider (input texte pour cloud, select dropdown pour Ollama)
- **Params** : `provider: string, container: HTMLElement`
- **Retour** : `void`
- **Modifie** : DOM (container innerHTML)
- **Appelle** : fetchOllamaModels
- **Appelée par** : renderNewSessionForm (provider onchange)

### parseSynthesis
- **Rôle** : Découpe le texte de synthèse en 3 sections (introduction, développement, ouverture)
- **Params** : `text: string`
- **Retour** : `string[]` (1 à 3 sections)
- **Modifie** : rien (pure)
- **Appelle** : —
- **Appelée par** : renderSynthesisBlock

### renderSynthesisBlock
- **Rôle** : Génère le HTML du bloc synthèse affiché en fin de session terminée
- **Params** : `synthesis: string | null`
- **Retour** : `string` (HTML)
- **Modifie** : rien (pure)
- **Appelle** : parseSynthesis, esc
- **Appelée par** : renderChat

### fetchOllamaModels
- **Rôle** : Récupère la liste des modèles Ollama installés localement via l'API tags
- **Params** : —
- **Retour** : `Promise<string[]>`
- **Modifie** : rien (pure, réseau uniquement)
- **Appelle** : fetch (localhost:11434/api/tags)
- **Appelée par** : updateModelField

---

## src/renderer/js/companion/llm.ts

### sendToLLM
- **Rôle** : Envoie l'historique conversation au LLM et retourne la réponse. System prompt = intent seul
- **Params** : `provider: string, model: string, intent: string, history: CompanionMessage[]`
- **Retour** : `Promise<{ content: string; usage?: { input: number; output: number } }>`
- **Modifie** : rien (réseau uniquement)
- **Appelle** : window.fgraph.secureGet, window.fgraph.llmQuery
- **Appelée par** : setupChatInput > send (companion-app.ts)

### generateSynthesis
- **Rôle** : Génère une synthèse de fin de session en 3 mouvements (introduction / développement / ouverture). Même pipeline que sendToLLM mais avec un system prompt de synthèse
- **Params** : `provider: string, model: string, intent: string, history: CompanionMessage[]`
- **Retour** : `Promise<{ content: string; usage?: { input: number; output: number } }>`
- **Modifie** : rien (réseau uniquement)
- **Appelle** : window.fgraph.secureGet, window.fgraph.llmQuery
- **Appelée par** : renderChat > btn-end handler (companion-app.ts)

---

## src/database/repositories/companion.js

### sessions.getAll
- **Rôle** : Liste toutes les sessions avec le nombre de messages (JOIN + COUNT)
- **Params** : —
- **Retour** : `CompanionSession[]`
- **Modifie** : rien (lecture)
- **Appelée par** : IPC handler db:companion:sessions:getAll

### sessions.getById
- **Rôle** : Récupère une session par son ID
- **Params** : `id: string`
- **Retour** : `CompanionSession | null`
- **Modifie** : rien (lecture)
- **Appelée par** : IPC handler db:companion:sessions:getById

### sessions.create
- **Rôle** : Crée une nouvelle session avec un UUID
- **Params** : `data: { intent, provider, model, kairos_canvas_id? }`
- **Retour** : `CompanionSession`
- **Modifie** : SQLite (INSERT companion_sessions)
- **Appelée par** : IPC handler db:companion:sessions:create

### sessions.end
- **Rôle** : Termine une session (set ended_at + synthesis). Idempotent (WHERE ended_at IS NULL)
- **Params** : `id: string, synthesis?: string`
- **Retour** : `{ changes: number }`
- **Modifie** : SQLite (UPDATE companion_sessions)
- **Appelée par** : IPC handler db:companion:sessions:end

### sessions.remove
- **Rôle** : Supprime une session et ses messages (CASCADE)
- **Params** : `id: string`
- **Retour** : `{ changes: number }`
- **Modifie** : SQLite (DELETE companion_sessions + companion_messages via CASCADE)
- **Appelée par** : IPC handler db:companion:sessions:remove

### messages.getAllBySession
- **Rôle** : Récupère tous les messages d'une session ordonnés par timestamp
- **Params** : `sessionId: string`
- **Retour** : `CompanionMessage[]`
- **Modifie** : rien (lecture)
- **Appelée par** : IPC handler db:companion:messages:getAllBySession

### messages.update
- **Rôle** : Met à jour le contenu d'un message
- **Params** : `id: string, data: { content: string }`
- **Retour** : `{ changes: number }`
- **Modifie** : SQLite (UPDATE companion_messages)
- **Appelée par** : IPC handler db:companion:messages:update

### messages.create
- **Rôle** : Crée un nouveau message avec UUID et timestamp
- **Params** : `sessionId: string, data: { role, content, ts?, tokens_in?, tokens_out?, latency_ms? }`
- **Retour** : `CompanionMessage`
- **Modifie** : SQLite (INSERT companion_messages)
- **Appelée par** : IPC handler db:companion:messages:create

---

## Utilitaires (companion-app.ts)

| Fonction | Rôle | Pure |
|----------|------|------|
| `scrollToBottom` | Scrolle #chat-area en bas via rAF | Non (DOM) |
| `fmtDate` | Formate un timestamp en dd/mm | Oui |
| `fmtTime` | Formate un timestamp en hh:mm | Oui |
| `esc` | Échappe HTML (`&`, `<`, `>`, `\n` → `<br>`) | Oui |

---

## Constantes

| Constante | Fichier | Valeur |
|-----------|---------|--------|
| `DEFAULT_MODELS` | companion-app.ts | `{ anthropic: 'claude-sonnet-4-6', openai: 'gpt-4o', gemini: 'gemini-2.0-flash', deepseek: 'deepseek-chat', ollama: 'qwen3:8b' }` |
| `API_KEY_MAP` | companion/llm.ts | `{ anthropic: 'claude_api_key', openai: 'openai_api_key', deepseek: 'deepseek_api_key', mistral: 'mistral_api_key', groq: 'groq_api_key' }` |
| `SECTION_LABELS` | companion-app.ts | `['introduction', 'développement', 'ouverture']` |

---

## Types (companion/types.ts)

| Type | Champs |
|------|--------|
| `CompanionSession` | id, intent, kairos_canvas_id, provider, model, created_at, ended_at, synthesis, message_count |
| `CompanionMessage` | id, session_id, role, content, ts, tokens_in?, tokens_out?, latency_ms? |
| `SessionCreateData` | intent, kairos_canvas_id?, provider, model |
| `KairosCanvas` | Re-export de `DBCanvas` (id, name, mode, created_at, updated_at) |

---

## Tables SQLite

### companion_sessions
| Colonne | Type | Description |
|---------|------|-------------|
| id | TEXT PK | crypto.randomUUID() |
| intent | TEXT NOT NULL | Intention de départ |
| kairos_canvas_id | TEXT | FK → canvases(id), ON DELETE SET NULL |
| provider | TEXT NOT NULL | anthropic, openai, gemini, deepseek, ollama |
| model | TEXT NOT NULL | Nom du modèle LLM |
| created_at | INTEGER NOT NULL | Timestamp création |
| ended_at | INTEGER | Timestamp fin (NULL si active) |
| synthesis | TEXT | Texte de synthèse 3 mouvements (NULL si pas générée) |

### companion_messages
| Colonne | Type | Description |
|---------|------|-------------|
| id | TEXT PK | crypto.randomUUID() |
| session_id | TEXT NOT NULL | FK → companion_sessions(id), ON DELETE CASCADE |
| role | TEXT NOT NULL | CHECK('user','assistant','system') |
| content | TEXT NOT NULL | Contenu du message |
| ts | INTEGER NOT NULL | Timestamp |
| tokens_in | INTEGER | Tokens entrée (optionnel) |
| tokens_out | INTEGER | Tokens sortie (optionnel) |
| latency_ms | INTEGER | Latence réponse LLM (optionnel) |

Index : `idx_companion_messages_session ON companion_messages(session_id, ts)`

---

## Format de maintenance

Après toute modification de fonction dans le module Companion :
1. Mettre à jour l'entrée correspondante dans ce registre
2. Ajuster le compteur total si ajout/suppression
3. Mettre à jour la date de génération
