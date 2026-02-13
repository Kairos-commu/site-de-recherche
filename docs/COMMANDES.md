# KAIROS --- Commandes NPM

Toutes les commandes disponibles dans `package.json`.

---

## Lancer l'application

| Commande | Description |
|----------|-------------|
| `npm start` | Lance l'app Electron (build de production) |
| `npm run dev` | Mode developpement : Vite HMR + Electron en parallele |

> `npm run dev` attend que Vite soit pret sur `http://localhost:5173` avant de lancer Electron.

---

## Build

| Commande | Description |
|----------|-------------|
| `npm run build:renderer` | Build Vite uniquement (renderer dans `dist/renderer/`) |
| `npm run build` | Build complet : Vite + electron-builder |
| `npm run build:win` | Build pour Windows (Vite + electron-builder --win) |
| `npm run build:mac` | Build pour macOS |
| `npm run build:linux` | Build pour Linux |

> Les builds finaux sont dans le dossier `release/`.

---

## Tests

| Commande | Description |
|----------|-------------|
| `npm test` | Tout : tests unitaires + build + tests E2E |
| `npm run test:unit` | Tests unitaires Vitest (125 tests, 6 fichiers) |
| `npm run test:unit:watch` | Tests unitaires en mode watch (relance auto) |
| `npm run test:unit:coverage` | Tests unitaires avec rapport de couverture |
| `npm run test:e2e` | Tests E2E Playwright (build Vite d'abord) |
| `npm run test:e2e:headed` | E2E avec fenetre visible (pour debug visuel) |
| `npm run test:e2e:ui` | E2E dans l'interface Playwright (timeline, snapshots) |
| `npm run test:e2e:debug` | E2E avec inspecteur Playwright (pas-a-pas) |

> Les commandes E2E font automatiquement un `vite build` avant de lancer les tests.

---

## Qualite de code

| Commande | Description |
|----------|-------------|
| `npm run lint` | Verifie le code avec ESLint |
| `npm run lint:fix` | Corrige automatiquement les erreurs ESLint |
| `npm run format` | Formate le code avec Prettier |
| `npm run format:check` | Verifie le formatage sans modifier les fichiers |

> Husky + lint-staged executent automatiquement lint + format sur chaque commit.

---

## Documentation (VitePress)

| Commande | Description |
|----------|-------------|
| `npm run docs:dev` | Lance le site de doc en local (hot reload) |
| `npm run docs:build` | Build statique du site de doc |

> `docs:dev` ouvre un serveur local (generalement `http://localhost:5173` ou `5174`).
> Les fichiers `.md` dans `doc projet/` sont rendus automatiquement.

---

## Divers

| Commande | Description |
|----------|-------------|
| `npm run prepare` | Installe les hooks Husky (lance automatiquement apres `npm install`) |
