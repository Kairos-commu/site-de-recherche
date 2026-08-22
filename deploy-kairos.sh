#!/bin/bash
# ─────────────────────────────────────────────────────
# deploy-kairos.sh — Publier une nouvelle version KAIROS
#
# Usage :
#   ./deploy-kairos.sh X.Y.Z
#
# Cherche les binaires dans :
#   ../kairos-app/release/
#
#   Linux   : KAIROS-X.Y.Z.AppImage        (requis pour 1.1.0+)
#   Windows : "KAIROS Setup X.Y.Z.exe"     (optionnel)
#
# Ce script :
#   1. Crée / met à jour la GitHub Release vX.Y.Z et uploade les binaires
#   2. Met à jour src/_data/kairos.json (version, URLs, tailles, date)
#   3. Build le site pour vérifier
#   4. Commit et push (le workflow GitHub Pages déploie)
#
# Ne pas lancer depuis un agent : action publique (release + site prod).
# ─────────────────────────────────────────────────────

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage : ./deploy-kairos.sh VERSION"
  echo "Exemple : ./deploy-kairos.sh 1.1.0"
  exit 1
fi

VERSION="$1"
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
KAIROS_JSON="$REPO_DIR/src/_data/kairos.json"
RELEASE_DIR="$(cd "$REPO_DIR/../kairos-app/release" && pwd)"

APPIMAGE_PATH="$RELEASE_DIR/KAIROS-${VERSION}.AppImage"
EXE_PATH="$RELEASE_DIR/KAIROS Setup ${VERSION}.exe"

if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Erreur : version invalide '$VERSION' (attendu X.Y.Z, ex: 1.1.0)"
  exit 1
fi

if [ ! -f "$KAIROS_JSON" ]; then
  echo "Erreur : $KAIROS_JSON introuvable"
  exit 1
fi

HAS_LINUX=0
HAS_WINDOWS=0
[ -f "$APPIMAGE_PATH" ] && HAS_LINUX=1
[ -f "$EXE_PATH" ] && HAS_WINDOWS=1

if [ "$HAS_LINUX" -eq 0 ] && [ "$HAS_WINDOWS" -eq 0 ]; then
  echo "Erreur : aucun binaire trouvé dans $RELEASE_DIR"
  echo "  attendu : KAIROS-${VERSION}.AppImage"
  echo "            KAIROS Setup ${VERSION}.exe"
  echo ""
  echo "Fichiers présents :"
  ls "$RELEASE_DIR" | sed 's/^/  /'
  exit 1
fi

if ! gh auth status &>/dev/null; then
  echo "Erreur : gh CLI non connecté. Lance 'gh auth login' d'abord."
  exit 1
fi

size_mo() {
  local bytes
  bytes=$(stat -c%s "$1" 2>/dev/null || stat -f%z "$1")
  echo $((bytes / 1048576))
}

TODAY=$(date +%Y-%m-%d)
TODAY_FR=$(date "+%-d %B %Y" | sed \
  -e 's/January/janvier/' -e 's/February/février/' -e 's/March/mars/' \
  -e 's/April/avril/' -e 's/May/mai/' -e 's/June/juin/' \
  -e 's/July/juillet/' -e 's/August/août/' \
  -e 's/September/septembre/' -e 's/October/octobre/' \
  -e 's/November/novembre/' -e 's/December/décembre/')

LINUX_MO=0
WIN_MO=0
[ "$HAS_LINUX" -eq 1 ] && LINUX_MO=$(size_mo "$APPIMAGE_PATH")
[ "$HAS_WINDOWS" -eq 1 ] && WIN_MO=$(size_mo "$EXE_PATH")

LINUX_NAME="KAIROS-${VERSION}.AppImage"
EXE_NAME="KAIROS.Setup.${VERSION}.exe"
BASE_URL="https://github.com/Kairos-commu/site-de-recherche/releases/download/v${VERSION}"

echo ""
echo "=== Déploiement KAIROS v${VERSION} ==="
echo "  Dossier : $RELEASE_DIR"
[ "$HAS_LINUX" -eq 1 ] && echo "  Linux   : $LINUX_NAME (${LINUX_MO} Mo)"
[ "$HAS_WINDOWS" -eq 1 ] && echo "  Windows : $EXE_NAME (${WIN_MO} Mo)"
[ "$HAS_LINUX" -eq 0 ] && echo "  Linux   : (absent — la page gardera l'AppImage précédente si présente)"
[ "$HAS_WINDOWS" -eq 0 ] && echo "  Windows : (absent — la page gardera l'installeur précédent)"
echo "  Date    : $TODAY_FR"
echo ""
read -p "Continuer ? (o/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Oo]$ ]]; then
  echo "Annulé."
  exit 0
fi

# --- 1. GitHub Release ---
echo ""
echo "[1/4] Release GitHub v${VERSION}..."

NOTES=$(cat <<EOF
KAIROS v${VERSION} — Bêta

EOF
)
[ "$HAS_LINUX" -eq 1 ] && NOTES+=$'Linux x86_64 (AppImage, '"${LINUX_MO}"$' Mo)\n'
[ "$HAS_WINDOWS" -eq 1 ] && NOTES+=$'Windows 10+ (installeur, '"${WIN_MO}"$' Mo)\n'
NOTES+=$'Pas besoin de droits administrateur.\n'

GH_ARGS=(release create "v${VERSION}"
  --repo Kairos-commu/site-de-recherche
  --title "KAIROS v${VERSION}"
  --notes "$NOTES"
  --prerelease
)

if gh release view "v${VERSION}" --repo Kairos-commu/site-de-recherche &>/dev/null; then
  echo "  Release v${VERSION} existe déjà — upload des assets manquants."
  [ "$HAS_LINUX" -eq 1 ] && gh release upload "v${VERSION}" "$APPIMAGE_PATH#${LINUX_NAME}" --repo Kairos-commu/site-de-recherche --clobber
  [ "$HAS_WINDOWS" -eq 1 ] && gh release upload "v${VERSION}" "$EXE_PATH#${EXE_NAME}" --repo Kairos-commu/site-de-recherche --clobber
else
  [ "$HAS_LINUX" -eq 1 ] && GH_ARGS+=("$APPIMAGE_PATH#${LINUX_NAME}")
  [ "$HAS_WINDOWS" -eq 1 ] && GH_ARGS+=("$EXE_PATH#${EXE_NAME}")
  gh "${GH_ARGS[@]}"
fi

echo "  Release OK."

# --- 2. kairos.json ---
echo "[2/4] Mise à jour de kairos.json..."

export KAIROS_JSON VERSION TODAY TODAY_FR
export HAS_LINUX HAS_WINDOWS LINUX_MO WIN_MO LINUX_NAME EXE_NAME BASE_URL

node <<'NODE'
const fs = require('fs');
const path = process.env.KAIROS_JSON;
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const version = process.env.VERSION;
const hasLinux = process.env.HAS_LINUX === '1';
const hasWindows = process.env.HAS_WINDOWS === '1';

data.version = version;
data.date = process.env.TODAY;
data.dateFr = process.env.TODAY_FR;
data.downloadsAvailable = true;

if (hasLinux) {
  data.primaryPlatform = 'linux';
  data.platforms.linux.available = true;
  data.platforms.linux.current = true;
  data.platforms.linux.filename = process.env.LINUX_NAME;
  data.platforms.linux.url = `${process.env.BASE_URL}/${process.env.LINUX_NAME}`;
  data.platforms.linux.sizeMo = Number(process.env.LINUX_MO);
  data.platforms.linux.version = version;
}
if (hasWindows) {
  data.platforms.windows.available = true;
  data.platforms.windows.current = !hasLinux;
  data.platforms.windows.filename = process.env.EXE_NAME;
  data.platforms.windows.url = `${process.env.BASE_URL}/${process.env.EXE_NAME}`;
  data.platforms.windows.sizeMo = Number(process.env.WIN_MO);
  data.platforms.windows.version = version;
  data.platforms.windows.dateFr = process.env.TODAY_FR;
  data.platforms.windows.note = 'Pas besoin de droits administrateur. Windows SmartScreen peut afficher un avertissement (bêta non signée).';
} else if (hasLinux) {
  data.platforms.windows.current = false;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('  kairos.json écrit.');
NODE

# --- 3. Build ---
echo "[3/4] Build du site..."
cd "$REPO_DIR"
npm run build --silent
echo "  Build OK."

# --- 4. Commit & push ---
echo "[4/4] Commit et push..."
git add src/_data/kairos.json
git commit -m "Déploiement KAIROS v${VERSION}

Mise à jour kairos.json : version ${VERSION}, binaires GitHub Releases."

git push

echo ""
echo "=== Déploiement terminé ==="
echo "  Release : https://github.com/Kairos-commu/site-de-recherche/releases/tag/v${VERSION}"
echo "  Site    : https://mecanique-invisible.com/download.html"
echo ""
