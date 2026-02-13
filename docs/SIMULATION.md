# GUIDE DE SIMULATION ET TEST - KAIROS

**Version:** 0.3.0
**Date:** Février 2026

Ce document décrit toutes les fonctionnalités de KAIROS à tester de manière exhaustive. Chaque section contient des scénarios de test avec les résultats attendus.

---

## TABLE DES MATIÈRES

1. [Page d'Accueil (Landing)](#1-page-daccueil-landing)
2. [Sas d'Intention (Mode Autonome)](#2-sas-dintention-mode-autonome)
3. [Canvas - Fonctions Communes](#3-canvas---fonctions-communes)
4. [Mode Autonome - Spécificités](#4-mode-autonome---spécificités)
5. [Mode Assisté - Spécificités](#5-mode-assisté---spécificités)
6. [Intégration LLM (Webview)](#6-intégration-llm-webview)
7. [Système de Captures](#7-système-de-captures)
8. [Système de Synthèses](#8-système-de-synthèses)
9. [Détection de Friction et Circularité](#9-détection-de-friction-et-circularité)
10. [Persistance et Stockage](#10-persistance-et-stockage)
11. [Export et Import](#11-export-et-import)
12. [Lecteur Audio](#12-lecteur-audio)
13. [Raccourcis Clavier](#13-raccourcis-clavier)
14. [Cas Limites et Erreurs](#14-cas-limites-et-erreurs)

---

## 1. PAGE D'ACCUEIL (LANDING)

### 1.1 Affichage Initial

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T1.1.1 | Lancer l'application | Page landing s'affiche avec titre "KAIROS" animé (shimmer gradient) |
| T1.1.2 | Observer le header | Lueur violette/bleue oscillante sous le titre |
| T1.1.3 | Observer les cartes | 2 cartes : "Mode Assisté" (rouge) et "Mode Autonome" (violet) |
| T1.1.4 | Observer le footer | Version "v0.2.0" et lien "Roadmap" |

### 1.2 Interactions Cartes

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T1.2.1 | Hover sur carte "Assisté" | Carte monte de 4px, bordure rouge, ombre rouge |
| T1.2.2 | Hover sur carte "Autonome" | Carte monte de 4px, bordure violette, ombre violette |
| T1.2.3 | Clic sur "Assisté" | Redirection vers `assisted.html` |
| T1.2.4 | Clic sur "Autonome" | Redirection vers `intention.html` |

### 1.3 Raccourcis Clavier

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T1.3.1 | Appuyer sur `1` | Mode Assisté sélectionné (redirection) |
| T1.3.2 | Appuyer sur `A` | Mode Assisté sélectionné (redirection) |
| T1.3.3 | Appuyer sur `2` | Mode Autonome sélectionné (redirection) |
| T1.3.4 | Appuyer sur `O` | Mode Autonome sélectionné (redirection) |

### 1.4 Contenu des Cartes

| Test | Vérification |
|------|--------------|
| T1.4.1 | Carte Assisté affiche : "L'IA comme assistant méthodologique" |
| T1.4.2 | Carte Assisté liste : Suggestions, Opérations, Patterns/contradictions |
| T1.4.3 | Carte Autonome affiche : "L'IA comme compagnon de pensée" |
| T1.4.4 | Carte Autonome liste : Construction manuelle, Dialogue non-directif |

---

## 2. SAS D'INTENTION (MODE AUTONOME)

### 2.1 Vidéo d'Introduction

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T2.1.1 | Arriver sur intention.html (première fois) | Overlay vidéo s'affiche automatiquement |
| T2.1.2 | Laisser la vidéo jouer | Vidéo se lit jusqu'à la fin |
| T2.1.3 | Cliquer sur "Passer" | Overlay disparaît, contenu principal visible |
| T2.1.4 | Revenir sur la page (même session) | Pas de vidéo (déjà vue) |
| T2.1.5 | Cliquer sur "🎬 Revoir vidéo" (en bas) | Overlay vidéo réapparaît |

### 2.2 Sélection d'Intention

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T2.2.1 | Cliquer sur "Explorer sans but" | Bouton sélectionné (fond coloré), bouton "Continuer" apparaît |
| T2.2.2 | Cliquer sur "Clarifier une intuition" | Sélection change, bouton Continuer reste visible |
| T2.2.3 | Cliquer sur "Créer quelque chose de nouveau" | Sélection change |
| T2.2.4 | Cliquer sur "Comprendre ce que je ressens" | Sélection change |
| T2.2.5 | Cliquer sur "Résoudre un problème" | Sélection change |
| T2.2.6 | Cliquer sur "Autre chose..." | Textarea apparaît pour saisie libre |
| T2.2.7 | Saisir texte dans "Autre chose" | Texte sauvegardé comme intention libre |

### 2.3 Contrôles Discrets

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T2.3.1 | Cliquer sur "🔊" (Audio toggle) | Audio ambient démarre/s'arrête |
| T2.3.2 | Cliquer sur "🎬 Revoir vidéo" | Overlay vidéo réapparaît |
| T2.3.3 | Cliquer sur "Extended Thinking: OFF" | Toggle passe à "ON" |
| T2.3.4 | Cliquer sur "Extended Thinking: ON" | Toggle passe à "OFF" |

### 2.4 Navigation

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T2.4.1 | Cliquer sur bouton retour (← en haut gauche) | Retour à landing.html |
| T2.4.2 | Appuyer sur Échap (vidéo visible) | Vidéo skip |
| T2.4.3 | Appuyer sur Échap (vidéo masquée) | Retour à landing.html |
| T2.4.4 | Cliquer sur "Entrer dans l'espace" | Redirection vers index.html avec intention sauvée |

### 2.5 Ambiance Visuelle

| Test | Vérification |
|------|--------------|
| T2.5.1 | Fond avec effet "respiration" (lueur qui pulse) |
| T2.5.2 | Indicateur de respiration (point qui pulse doucement) |
| T2.5.3 | Textes apparaissent avec animation fade-in décalée |
| T2.5.4 | Boutons d'intention avec animation au hover (translateX) |

---

## 3. CANVAS - FONCTIONS COMMUNES

### 3.1 Création de Vignettes

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.1.1 | Cliquer sur "+ Vignette" | Nouvelle vignette créée à position libre |
| T3.1.2 | Double-clic sur le canvas (fond) | Nouvelle vignette à la position cliquée |
| T3.1.3 | Clic-droit sur le canvas → "Créer vignette" | Menu contextuel puis création |
| T3.1.4 | Créer plusieurs vignettes rapidement | Chaque vignette trouve position sans collision |

### 3.2 Édition de Vignettes

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.2.1 | Double-clic sur une vignette | Modal d'édition s'ouvre |
| T3.2.2 | Modifier le texte et sauvegarder | Texte mis à jour sur la vignette |
| T3.2.3 | Cliquer en dehors du modal | Modal se ferme (avec ou sans sauvegarde selon config) |
| T3.2.4 | Clic-droit sur vignette → "Éditer" | Modal d'édition s'ouvre |

### 3.3 Suppression de Vignettes

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.3.1 | Clic-droit sur vignette → "Supprimer" | Vignette supprimée + connexions associées |
| T3.3.2 | Sélectionner vignette + touche Suppr | Vignette supprimée |
| T3.3.3 | Supprimer vignette connectée | Connexions supprimées également |

### 3.4 Déplacement (Drag & Drop)

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.4.1 | Cliquer-glisser une vignette | Vignette suit le curseur |
| T3.4.2 | Relâcher la vignette | Position sauvegardée |
| T3.4.3 | Déplacer vignette connectée | Connexions suivent (lignes se mettent à jour) |
| T3.4.4 | Déplacer vers le bord | Scroll automatique du canvas si nécessaire |

### 3.5 Création de Connexions

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.5.1 | Appuyer sur `L` | Mode connexion activé (indicateur visuel) |
| T3.5.2 | En mode connexion : cliquer vignette A puis vignette B | Connexion créée entre A et B |
| T3.5.3 | Clic-droit sur vignette → "Connecter" | Mode connexion démarré depuis cette vignette |
| T3.5.4 | Créer connexion → Menu type apparaît | 4 choix : implies, resonance, conflicts, example |
| T3.5.5 | Sélectionner "implies" | Connexion dorée avec flèche |
| T3.5.6 | Sélectionner "resonance" | Connexion turquoise bidirectionnelle |
| T3.5.7 | Sélectionner "conflicts" | Connexion rouge |
| T3.5.8 | Sélectionner "example" | Connexion grise |
| T3.5.9 | Appuyer sur `L` ou Échap | Mode connexion désactivé |

### 3.6 Suppression de Connexions

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.6.1 | Clic-droit sur une connexion | Menu avec option "Supprimer" |
| T3.6.2 | Cliquer "Supprimer" | Connexion supprimée |

### 3.7 Pan (Défilement du Canvas)

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.7.1 | Cliquer-glisser avec bouton milieu | Canvas se déplace |
| T3.7.2 | Cliquer-glisser sur le fond (pas sur vignette) | Canvas se déplace |
| T3.7.3 | Pan vers les bords | Pas de limite (canvas infini) |

### 3.8 Zoom

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.8.1 | Scroll molette vers le haut | Zoom in (indicateur zoom augmente) |
| T3.8.2 | Scroll molette vers le bas | Zoom out (indicateur zoom diminue) |
| T3.8.3 | Zoom centré sur position souris | Zoom se fait à partir du point souris |
| T3.8.4 | Ctrl + Scroll | Zoom fin (pas plus précis) |
| T3.8.5 | Zoom minimum | Environ 25% (limite basse) |
| T3.8.6 | Zoom maximum | Environ 200% (limite haute) |

### 3.9 Minimap

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.9.1 | Vérifier présence minimap | Minimap visible en bas à droite |
| T3.9.2 | Créer plusieurs vignettes | Points apparaissent sur minimap |
| T3.9.3 | Cliquer sur la minimap | Canvas se centre sur cette zone |
| T3.9.4 | Glisser le viewport sur la minimap | Canvas suit |
| T3.9.5 | Redimensionner minimap (bouton resize) | Minimap change de taille |

### 3.10 Sélection Multiple

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.10.1 | Cocher la checkbox d'une vignette | Vignette ajoutée à la sélection |
| T3.10.2 | Cocher plusieurs vignettes | Toutes ajoutées à la sélection |
| T3.10.3 | Décocher une vignette | Retirée de la sélection |
| T3.10.4 | Sélection visible | Vignettes sélectionnées ont bordure spéciale |

### 3.11 Recherche

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.11.1 | Taper dans le champ de recherche | Filtrage en temps réel |
| T3.11.2 | Rechercher un mot existant | Vignettes correspondantes mises en évidence |
| T3.11.3 | Rechercher un mot inexistant | Message "0 résultat" |
| T3.11.4 | Appuyer sur Entrée dans recherche | Navigation vers le résultat suivant |
| T3.11.5 | Cliquer sur le "×" de recherche | Champ vidé, filtre retiré |

### 3.12 Historique (Undo/Redo)

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T3.12.1 | Créer vignette puis Ctrl+Z | Vignette supprimée (undo) |
| T3.12.2 | Après undo, Ctrl+Y | Vignette restaurée (redo) |
| T3.12.3 | Supprimer vignette puis Ctrl+Z | Vignette restaurée |
| T3.12.4 | Déplacer vignette puis Ctrl+Z | Position restaurée |
| T3.12.5 | Modifier texte puis Ctrl+Z | Texte précédent restauré |
| T3.12.6 | Vérifier boutons Undo/Redo | Désactivés si pile vide |
| T3.12.7 | 50+ actions puis Undo max | Limité à 50 états |

---

## 4. MODE AUTONOME - SPÉCIFICITÉS

### 4.1 Affichage Initial

| Test | Vérification |
|------|--------------|
| T4.1.1 | Badge "Mode Autonome" visible (violet) |
| T4.1.2 | Intention affichée discrètement (ex: "✧ Clarifier une intuition") |
| T4.1.3 | Palette violette/mauve générale |
| T4.1.4 | Grille de repère subtile sur le canvas |

### 4.2 Interface Simplifiée

| Test | Vérification |
|------|--------------|
| T4.2.1 | Pas de filtres par statut |
| T4.2.2 | Pas de boutons de sélection par statut |
| T4.2.3 | Pas de bandeau suggestion |
| T4.2.4 | Modal d'édition simplifié (pas de statut/tags) |

### 4.3 Indicateur d'Intention

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T4.3.1 | Hover sur l'indicateur d'intention | Opacité augmente |
| T4.3.2 | Cliquer sur l'indicateur | Modal de modification d'intention |
| T4.3.3 | Modifier l'intention | Nouvel affichage |

---

## 5. MODE ASSISTÉ - SPÉCIFICITÉS

### 5.1 Affichage Initial

| Test | Vérification |
|------|--------------|
| T5.1.1 | Badge "Mode Assisté" visible (rouge) |
| T5.1.2 | Palette rouge/orange générale |
| T5.1.3 | Filtres par statut visibles dans toolbar |
| T5.1.4 | Boutons de sélection par statut visibles |
| T5.1.5 | Bandeau suggestion visible en bas |
| T5.1.6 | Légende des statuts et connexions visible |

### 5.2 Statuts des Vignettes

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T5.2.1 | Créer nouvelle vignette | Statut par défaut "○" (non évalué, ambre) |
| T5.2.2 | Éditer vignette → changer statut "✓" | Vignette devient verte (validée) |
| T5.2.3 | Éditer vignette → changer statut "✗" | Vignette devient rouge (rejetée) |
| T5.2.4 | Clic sur sélecteur de statut inline | Menu déroulant avec 3 options |

### 5.3 Filtres par Statut

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T5.3.1 | Cliquer sur filtre "Tous" | Toutes les vignettes visibles |
| T5.3.2 | Cliquer sur filtre "○" (Non évalué) | Seules vignettes non évaluées visibles |
| T5.3.3 | Cliquer sur filtre "✓" (Validé) | Seules vignettes validées visibles |
| T5.3.4 | Cliquer sur filtre "✗" (Rejeté) | Seules vignettes rejetées visibles |
| T5.3.5 | Combiner filtres (cliquer plusieurs) | Filtrage combiné |

### 5.4 Sélection par Statut

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T5.4.1 | Cliquer sur bouton sélection "○" | Toutes vignettes non évaluées sélectionnées |
| T5.4.2 | Cliquer sur bouton sélection "✓" | Toutes vignettes validées sélectionnées |
| T5.4.3 | Cliquer sur bouton sélection "✗" | Toutes vignettes rejetées sélectionnées |
| T5.4.4 | Cliquer sur "Tout" | Toutes les vignettes sélectionnées |
| T5.4.5 | Cliquer sur "Aucun" | Sélection vidée |

### 5.5 Suggestions Adaptatives

| Test | Condition | Résultat Attendu |
|------|-----------|------------------|
| T5.5.1 | Canvas vide (< 3 vignettes) | Suggestion "DÉVELOPPER" (priorité haute) |
| T5.5.2 | 3-8 vignettes | Suggestion "DÉVELOPPER" |
| T5.5.3 | 8+ vignettes bien connectées | Suggestion "RELIER" |
| T5.5.4 | Beaucoup de vignettes isolées | Suggestion "RELIER" (priorité haute) |
| T5.5.5 | 15+ vignettes connectées | Suggestion "SYNTHÉTISER" |
| T5.5.6 | 25+ vignettes connectées | Suggestion "SYNTHÉTISER" (urgent) |
| T5.5.7 | Circularité détectée | Suggestion "FRICTION" |
| T5.5.8 | 1 vignette sélectionnée | Suggestion "DÉVELOPPER cette idée" |
| T5.5.9 | 2-5 vignettes sélectionnées | Suggestion "RELIER ces idées" |
| T5.5.10 | 5+ vignettes sélectionnées | Suggestion "SYNTHÉTISER sélection" |

### 5.6 Opérations Adaptatives

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T5.6.1 | Cliquer "✓ Accepter" sur suggestion | Opération exécutée (prompt envoyé au LLM) |
| T5.6.2 | Cliquer sur dropdown "Autre opération" | Menu avec DÉVELOPPER, RELIER, SYNTHÉTISER |
| T5.6.3 | Choisir opération alternative | Cette opération s'exécute |

### 5.7 Bouton Flottant Sélection → LLM

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T5.7.1 | Sélectionner 1+ vignettes | Bouton flottant apparaît "X vignette(s)" |
| T5.7.2 | Cliquer sur le bouton | Vignettes envoyées au LLM |
| T5.7.3 | Désélectionner tout | Bouton disparaît |

### 5.8 Détection d'Attracteurs

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T5.8.1 | Cliquer sur "🧲 Attracteurs" | Mode attracteurs activé |
| T5.8.2 | Créer 5+ vignettes avec beaucoup de connexions | Attracteurs détectés (vignettes clés) |
| T5.8.3 | Vérifier indicateur friction | Score affiché (⚡ + Turn count) |

### 5.9 Modal de Session

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T5.9.1 | Lancer mode assisté avec session précédente | Modal "Reprendre / Nouvelle / Importer" |
| T5.9.2 | Choisir "Reprendre" | Session précédente restaurée |
| T5.9.3 | Choisir "Nouvelle session" | Canvas vide, nouvelle session |
| T5.9.4 | Choisir "Importer fichier" | Dialog de sélection fichier JSON |

### 5.10 Métriques Affichées

| Test | Vérification |
|------|--------------|
| T5.10.1 | Compteur de vignettes visible (ex: "12 vignettes") |
| T5.10.2 | Métriques se mettent à jour en temps réel |

---

## 6. INTÉGRATION LLM (WEBVIEW)

### 6.1 Sélection de Provider

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T6.1.1 | Ouvrir le sélecteur de provider | Liste : Claude, ChatGPT, Gemini, DeepSeek, Grok |
| T6.1.2 | Sélectionner "Claude" | Webview charge claude.ai |
| T6.1.3 | Sélectionner "ChatGPT" | Webview charge chatgpt.com |
| T6.1.4 | Sélectionner "Gemini" | Webview charge gemini.google.com |
| T6.1.5 | Sélectionner "DeepSeek" | Webview charge chat.deepseek.com |
| T6.1.6 | Sélectionner "Grok" | Webview charge grok.com |

### 6.2 État de la Webview

| Test | Vérification |
|------|--------------|
| T6.2.1 | Indicateur "Chargement..." pendant le load |
| T6.2.2 | Indicateur "Connecté" quand prêt |
| T6.2.3 | Indicateur "Erreur" si échec de chargement |

### 6.3 Bouton Reload

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T6.3.1 | Cliquer sur "↻" (reload) | Webview rechargée |

### 6.4 Capture de Réponse (Mode Assisté)

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T6.4.1 | Envoyer un message au LLM via webview | Message visible dans la conversation |
| T6.4.2 | Attendre la réponse LLM | Réponse affichée |
| T6.4.3 | Cliquer sur "📥 Capturer réponse" | Dropdown options |
| T6.4.4 | Choisir "🌱 Vignettes" | Vignette créée avec le texte de la réponse |
| T6.4.5 | Choisir "🔗 Connexions" | Suggestions de connexions |
| T6.4.6 | Choisir "📦 Synthèse" | Synthèse créée |
| T6.4.7 | Choisir "🧲 Attracteurs" | Mode qualification attracteurs |

### 6.5 Injection de Prompts

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T6.5.1 | Utiliser opération DÉVELOPPER | Prompt injecté dans webview + envoi auto |
| T6.5.2 | Utiliser opération RELIER | Prompt injecté avec vignettes sélectionnées |
| T6.5.3 | Utiliser opération SYNTHÉTISER | Prompt de synthèse injecté |

### 6.6 Toggle Panneau Webview

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T6.6.1 | Cliquer sur bouton ">" (masquer webview) | Panneau se collapse (0px) |
| T6.6.2 | Cliquer sur bouton "<" (afficher webview) | Panneau réapparaît |
| T6.6.3 | Webview masquée : canvas prend toute la largeur | Layout s'adapte |

### 6.7 DevTools Webview

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T6.7.1 | Cliquer sur bouton DevTools | DevTools de la webview s'ouvre |

---

## 7. SYSTÈME DE CAPTURES

### 7.1 Import de Captures

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T7.1.1 | Cliquer sur "Importer" dans sidebar | Dialog de sélection fichier |
| T7.1.2 | Sélectionner fichier JSON valide | Captures importées et listées |
| T7.1.3 | Importer fichier invalide | Message d'erreur |
| T7.1.4 | Importer fichier vide | Message "Aucune conversation" |

### 7.2 Affichage des Captures

| Test | Vérification |
|------|--------------|
| T7.2.1 | Conversations listées avec metadata (plateforme, nb messages) |
| T7.2.2 | Icône du provider (Claude 🟠, ChatGPT 💬, etc.) |
| T7.2.3 | Nombre de messages user/assistant affiché |

### 7.3 Expansion de Conversation

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T7.3.1 | Cliquer sur une conversation | Liste des messages s'affiche |
| T7.3.2 | Messages user avec badge "user" | Style distinct |
| T7.3.3 | Messages assistant avec badge "assistant" | Style distinct |
| T7.3.4 | Messages thinking avec badge "thinking" | Style distinct (Extended Thinking) |
| T7.3.5 | Cliquer à nouveau sur la conversation | Liste se collapse |

### 7.4 Épinglage de Messages

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T7.4.1 | Cliquer sur "📌" d'un message | Vignette créée sur le canvas |
| T7.4.2 | Vérifier la vignette créée | Contient le texte du message + metadata capture |
| T7.4.3 | Re-cliquer sur "📌" (déjà épinglé) | Vignette supprimée (toggle) |
| T7.4.4 | Vignette épinglée a un halo "newly imported" | Visual feedback |

### 7.5 Suppression de Capture

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T7.5.1 | Cliquer sur "🗑️" d'une conversation | Confirmation demandée |
| T7.5.2 | Confirmer suppression | Conversation supprimée de la liste |

---

## 8. SYSTÈME DE SYNTHÈSES

### 8.1 Création de Synthèse (Mode Assisté)

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T8.1.1 | Avoir 5+ vignettes validées | Suggestion SYNTHÉTISER apparaît |
| T8.1.2 | Accepter suggestion SYNTHÉTISER | Prompt envoyé au LLM |
| T8.1.3 | Capturer la réponse en "Synthèse" | Synthèse créée et archivée |

### 8.2 Liste des Synthèses

| Test | Vérification |
|------|--------------|
| T8.2.1 | Onglet "Synthèses" dans sidebar |
| T8.2.2 | Synthèses listées avec titre et date |
| T8.2.3 | Nombre de vignettes sources affiché |

### 8.3 Actions sur Synthèse

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T8.3.1 | Cliquer sur une synthèse | Détails affichés (texte complet) |
| T8.3.2 | Modifier le titre de la synthèse | Titre mis à jour |
| T8.3.3 | Cliquer sur "Archiver" | Synthèse marquée comme réinjectée |
| T8.3.4 | Cliquer sur "Supprimer" | Synthèse supprimée |

### 8.4 Réinjection

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T8.4.1 | Archiver une synthèse | Badge "Réinjectée" visible |
| T8.4.2 | Opération LLM suivante | Synthèse archivée incluse dans le contexte |

---

## 9. DÉTECTION DE FRICTION ET CIRCULARITÉ

### 9.1 Indicateur de Friction

| Test | Vérification |
|------|--------------|
| T9.1.1 | Indicateur "⚡ 0 | Turn: 0" visible |
| T9.1.2 | Score augmente quand circularité détectée |
| T9.1.3 | Turn incrémente à chaque tour |

### 9.2 Signaux de Circularité

| Test | Condition | Résultat Attendu |
|------|-----------|------------------|
| T9.2.1 | Créer 2 vignettes avec texte quasi-identique | Signal "reformulation" détecté |
| T9.2.2 | Créer cycle A→B→C→A | Signal "boucle_connexion" détecté |
| T9.2.3 | 3+ tours sans nouveau concept | Signal "stagnation" détecté |
| T9.2.4 | Valider avec "oui", "ok" uniquement | Signal "validation_vide" détecté |
| T9.2.5 | 5+ vignettes avec même tag | Signal "tags_saturés" détecté |

### 9.3 Injection de Friction

| Test | Condition | Résultat Attendu |
|------|-----------|------------------|
| T9.3.1 | Score friction > 3 | Bloc friction injecté dans prompt LLM |
| T9.3.2 | Vérifier le prompt injecté | Contient message de friction avec signaux détectés |
| T9.3.3 | Cooldown 3 tours | Pas de réinjection pendant 3 tours |

---

## 10. PERSISTANCE ET STOCKAGE

### 10.1 Auto-Save

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T10.1.1 | Créer des vignettes et attendre 30s | Sauvegarde automatique |
| T10.1.2 | Fermer l'application et rouvrir | État restauré |
| T10.1.3 | Vérifier localStorage | Clé `graph_canvas_data` présente |

### 10.2 Sauvegarde Manuelle

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T10.2.1 | Appuyer sur Ctrl+S | Notification "Sauvegardé" |

### 10.3 Stockage des Clés API

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T10.3.1 | Configurer une clé API | Stockée de manière chiffrée (safeStorage) |
| T10.3.2 | Redémarrer l'app | Clé toujours disponible |

### 10.4 Effacer le Canvas

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T10.4.1 | Cliquer sur "Effacer" | Confirmation demandée |
| T10.4.2 | Confirmer | Canvas vidé, vignettes et connexions supprimées |

---

## 11. EXPORT ET IMPORT

### 11.1 Export JSON

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T11.1.1 | Cliquer sur Export → JSON | Dialog de sauvegarde |
| T11.1.2 | Sauvegarder le fichier | Fichier .json créé |
| T11.1.3 | Vérifier le contenu | Contient nodes, connections, viewport |

### 11.2 Export PNG

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T11.2.1 | Cliquer sur Export → PNG | Dialog de sauvegarde |
| T11.2.2 | Sauvegarder le fichier | Image PNG du canvas créée |

### 11.3 Export Markdown

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T11.3.1 | Cliquer sur Export → Markdown | Dialog de sauvegarde |
| T11.3.2 | Sauvegarder le fichier | Fichier .md avec liste des vignettes |

### 11.4 Import JSON

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T11.4.1 | Cliquer sur "Importer" | Dialog de sélection fichier |
| T11.4.2 | Sélectionner fichier JSON exporté | Données importées |
| T11.4.3 | Choix "Fusionner ou Remplacer" | Option proposée si canvas non vide |
| T11.4.4 | Importer fichier invalide | Message d'erreur |

---

## 12. LECTEUR AUDIO

### 12.1 Toggle Audio Panel

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T12.1.1 | Cliquer sur bouton musique (🎵) | Panneau audio s'affiche |
| T12.1.2 | Re-cliquer sur le bouton | Panneau se masque |

### 12.2 Contrôles de Lecture

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T12.2.1 | Cliquer sur ▶ (Play) | Lecture démarre |
| T12.2.2 | Cliquer sur ⏸ (Pause) | Lecture en pause |
| T12.2.3 | Cliquer sur ⏹ (Stop) | Lecture arrêtée, position reset |
| T12.2.4 | Cliquer sur ⏮ (Précédent) | Piste précédente |
| T12.2.5 | Cliquer sur ⏭ (Suivant) | Piste suivante |
| T12.2.6 | Cliquer sur 🔁 (Loop) | Mode boucle activé |

### 12.3 Volume

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T12.3.1 | Déplacer slider volume | Volume change |
| T12.3.2 | Volume à 0% | Son coupé |
| T12.3.3 | Volume à 100% | Volume maximum |

### 12.4 Progression

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T12.4.1 | Observer barre de progression | Avance avec la lecture |
| T12.4.2 | Cliquer sur la barre | Position de lecture change |

### 12.5 Playlist

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T12.5.1 | Cliquer sur "+ Ajouter fichiers" | Dialog sélection fichiers audio |
| T12.5.2 | Sélectionner fichier mp3/wav/ogg | Ajouté à la playlist |
| T12.5.3 | Cliquer sur une piste dans la liste | Lecture démarre |
| T12.5.4 | Supprimer une piste | Retirée de la playlist |

### 12.6 Dossier Musiques

| Test | Action | Résultat Attendu |
|------|--------|------------------|
| T12.6.1 | Sélectionner un dossier musiques | Fichiers scannés |
| T12.6.2 | Formats supportés : mp3, wav, ogg, m4a, flac | Listés dans playlist |
| T12.6.3 | Persistance du dossier | Mémorisé entre sessions |

---

## 13. RACCOURCIS CLAVIER

### 13.1 Raccourcis Globaux

| Test | Raccourci | Résultat Attendu |
|------|-----------|------------------|
| T13.1.1 | Ctrl+S | Sauvegarde manuelle |
| T13.1.2 | Ctrl+Z | Undo |
| T13.1.3 | Ctrl+Y | Redo |
| T13.1.4 | Ctrl+Shift+Z | Redo (alternative) |
| T13.1.5 | Échap | Fermer modal / annuler action |
| T13.1.6 | Entrée | Valider / continuer |

### 13.2 Raccourcis Landing

| Test | Raccourci | Résultat Attendu |
|------|-----------|------------------|
| T13.2.1 | 1 ou A | Mode Assisté |
| T13.2.2 | 2 ou O | Mode Autonome |

### 13.3 Raccourcis Canvas

| Test | Raccourci | Résultat Attendu |
|------|-----------|------------------|
| T13.3.1 | L | Toggle mode connexion |
| T13.3.2 | Suppr | Supprimer sélection |

### 13.4 Non-Interférence

| Test | Condition | Résultat Attendu |
|------|-----------|------------------|
| T13.4.1 | Focus dans input/textarea | Raccourcis désactivés (saisie normale) |
| T13.4.2 | Focus dans webview | Raccourcis capturés par webview |

---

## 14. CAS LIMITES ET ERREURS

### 14.1 Performance

| Test | Condition | Résultat Attendu |
|------|-----------|------------------|
| T14.1.1 | Créer 100+ vignettes | Pas de lag notable |
| T14.1.2 | Créer 500+ vignettes | Performance acceptable (virtual scrolling prévu) |
| T14.1.3 | Zoom/pan avec beaucoup de vignettes | Fluide |

### 14.2 Webview Timeouts

| Test | Condition | Résultat Attendu |
|------|-----------|------------------|
| T14.2.1 | Capture après 8s sans réponse | Timeout avec message d'erreur |
| T14.2.2 | Bouton "Réessayer" après timeout | Nouvelle tentative |
| T14.2.3 | Bouton "Capture manuelle" | Modal de saisie manuelle |

### 14.3 Erreurs de Stockage

| Test | Condition | Résultat Attendu |
|------|-----------|------------------|
| T14.3.1 | localStorage plein | Message d'erreur quota |
| T14.3.2 | Fichier JSON corrompu | Message d'erreur import |

### 14.4 Erreurs Réseau

| Test | Condition | Résultat Attendu |
|------|-----------|------------------|
| T14.4.1 | Webview ne charge pas | Indicateur "Erreur" affiché |
| T14.4.2 | API LLM indisponible | Message d'erreur avec retry |

### 14.5 États Incohérents

| Test | Condition | Résultat Attendu |
|------|-----------|------------------|
| T14.5.1 | Supprimer vignette source d'une connexion | Connexion supprimée aussi |
| T14.5.2 | Undo après suppression multiple | État cohérent restauré |
| T14.5.3 | Refresh page pendant opération | État sauvegardé restauré |

---

## CHECKLIST DE VALIDATION GLOBALE

### Avant Release

- [ ] Tous les tests de la section 1 (Landing) passent
- [ ] Tous les tests de la section 2 (Intention) passent
- [ ] Tous les tests de la section 3 (Canvas commun) passent
- [ ] Tous les tests de la section 4 (Mode Autonome) passent
- [ ] Tous les tests de la section 5 (Mode Assisté) passent
- [ ] Tous les tests de la section 6 (Webview LLM) passent
- [ ] Tous les tests de la section 7 (Captures) passent
- [ ] Tous les tests de la section 8 (Synthèses) passent
- [ ] Tous les tests de la section 9 (Friction) passent
- [ ] Tous les tests de la section 10 (Persistance) passent
- [ ] Tous les tests de la section 11 (Export/Import) passent
- [ ] Tous les tests de la section 12 (Audio) passent
- [ ] Tous les tests de la section 13 (Raccourcis) passent
- [ ] Tous les tests de la section 14 (Cas limites) passent

### Plateformes à Tester

- [ ] Windows 10/11
- [ ] macOS (si applicable)
- [ ] Linux (si applicable)

---

**Fin du guide de simulation et test**
