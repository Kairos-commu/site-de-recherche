#!/bin/bash
# ─────────────────────────────────────────────────────
# deploy-kairos.sh — Déployer une nouvelle version KAIROS
#
# Usage :
#   ./deploy-kairos.sh X.Y.Z
#
# Exemple :
#   ./deploy-kairos.sh 1.0.2
#
# Le script cherche automatiquement le .exe dans :
#   D:\Bureau\F - Graph\Application KAIROS\kairos\release\
#
# Ce script :
#   1. Crée une GitHub Release vX.Y.Z avec le .exe
#   2. Met à jour src/download.njk (version, lien, taille, date)
#   3. Build le site pour vérifier
#   4. Commit et push
# ─────────────────────────────────────────────────────

set -euo pipefail

# --- Validation des arguments ---
if [ $# -ne 1 ]; then
  echo "Usage : ./deploy-kairos.sh VERSION"
  echo "Exemple : ./deploy-kairos.sh 1.0.2"
  exit 1
fi

VERSION="$1"
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
DOWNLOAD_NJK="$REPO_DIR/src/download.njk"
RELEASE_DIR="/d/Bureau/F - Graph/Application KAIROS/kairos/release"
EXE_PATH="$RELEASE_DIR/KAIROS Setup ${VERSION}.exe"

# Vérifier le format de version
if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Erreur : version invalide '$VERSION' (attendu X.Y.Z, ex: 1.0.2)"
  exit 1
fi

# Vérifier que le fichier existe
if [ ! -f "$EXE_PATH" ]; then
  echo "Erreur : fichier introuvable : $EXE_PATH"
  echo ""
  echo "Fichiers disponibles dans le dossier release :"
  ls "$RELEASE_DIR"/*.exe 2>/dev/null || echo "  (aucun .exe trouvé)"
  exit 1
fi

# Vérifier que gh est connecté
if ! gh auth status &>/dev/null; then
  echo "Erreur : gh CLI non connecté. Lance 'gh auth login' d'abord."
  exit 1
fi

# --- Infos du fichier ---
FILE_SIZE_BYTES=$(stat -c%s "$EXE_PATH" 2>/dev/null || stat -f%z "$EXE_PATH" 2>/dev/null)
FILE_SIZE_MO=$((FILE_SIZE_BYTES / 1048576))
TODAY=$(date +%Y-%m-%d)
TODAY_FR=$(date "+%-d %B %Y" | sed \
  -e 's/January/janvier/' -e 's/February/février/' -e 's/March/mars/' \
  -e 's/April/avril/' -e 's/May/mai/' -e 's/June/juin/' \
  -e 's/July/juillet/' -e 's/August/août/' -e 's/September/septembre/' \
  -e 's/October/octobre/' -e 's/November/novembre/' -e 's/December/décembre/')

# Nom du fichier dans la release (espaces -> points pour l'URL)
EXE_NAME="KAIROS.Setup.${VERSION}.exe"
RELEASE_URL="https://github.com/Kairos-commu/site-de-recherche/releases/download/v${VERSION}/${EXE_NAME}"

echo ""
echo "=== Déploiement KAIROS v${VERSION} ==="
echo "  Fichier  : $EXE_PATH"
echo "  Taille   : ${FILE_SIZE_MO} Mo"
echo "  Release  : v${VERSION}"
echo "  Date     : $TODAY_FR"
echo ""
read -p "Continuer ? (o/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Oo]$ ]]; then
  echo "Annulé."
  exit 0
fi

# --- 1. Créer la GitHub Release ---
echo ""
echo "[1/4] Création de la release GitHub v${VERSION}..."

gh release create "v${VERSION}" "$EXE_PATH#${EXE_NAME}" \
  --repo Kairos-commu/site-de-recherche \
  --title "KAIROS v${VERSION}" \
  --notes "$(cat <<EOF
KAIROS v${VERSION} — Bêta

Installeur Windows (64 bits, ${FILE_SIZE_MO} Mo)
Windows 10+ requis, pas besoin de droits d'administrateur.
EOF
)" \
  --prerelease

echo "  Release créée."

# --- 2. Mettre à jour download.njk ---
echo "[2/4] Mise à jour de download.njk..."

cd "$REPO_DIR"

# Remplacer l'ancienne version par la nouvelle dans download.njk
sed -i \
  -e "s|releases/download/v[0-9.]\+/KAIROS\.Setup\.[0-9.]\+\.exe|releases/download/v${VERSION}/${EXE_NAME}|g" \
  -e "s|\"softwareVersion\": \"[0-9.]\+\"|\"softwareVersion\": \"${VERSION}\"|" \
  -e "s|\"fileSize\": \"[0-9]\+ MB\"|\"fileSize\": \"${FILE_SIZE_MO} MB\"|" \
  -e "s|KAIROS Setup [0-9.]\+|KAIROS Setup ${VERSION}|g" \
  -e "s|KAIROS-Setup-[0-9.]\+\.exe|KAIROS-Setup-${VERSION}.exe|g" \
  -e "s|<span>v[0-9.]\+</span>|<span>v${VERSION}</span>|" \
  -e "s|Télécharger KAIROS v[0-9.]\+|Télécharger KAIROS v${VERSION}|" \
  -e "s|${FILE_SIZE_MO} Mo|${FILE_SIZE_MO} Mo|" \
  "$DOWNLOAD_NJK"

# Mettre à jour la date dans la ligne "Version bêta · DATE ·"
sed -i "s|Version b[eê]ta &middot; [0-9a-zé]\+ [a-zé]\+ [0-9]\+ &middot;|Version bêta \&middot; ${TODAY_FR} \&middot;|" "$DOWNLOAD_NJK"

echo "  download.njk mis à jour."

# --- 3. Build ---
echo "[3/4] Build du site..."
npm run build --silent
echo "  Build OK."

# --- 4. Commit & push ---
echo "[4/4] Commit et push..."
git add src/download.njk
git commit -m "Déploiement KAIROS v${VERSION}

Mise à jour page de téléchargement : version ${VERSION}, release GitHub.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"

git push

echo ""
echo "=== Déploiement terminé ==="
echo "  Release : https://github.com/Kairos-commu/site-de-recherche/releases/tag/v${VERSION}"
echo "  Site    : https://mecanique-invisible.com/download.html"
echo ""
