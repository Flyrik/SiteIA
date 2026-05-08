# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Présentation

**SnapDiag** — Web app d'identification instantanée de médicaments et de plantes par photo, propulsée par Claude Vision.

L'utilisateur prend une photo ou uploade une image → Claude Vision analyse → résultat structuré affiché proprement.

### Modules

| Module | Description |
|--------|-------------|
| 📸 Identification instantanée | Photo ou upload → détection automatique médicament ou plante → redirection vers le bon module |
| 💊 Module Médicament | Identification boîte/blister/comprimé, fiche complète (nom, labo, classe), posologie, contre-indications, effets secondaires, conservation, génériques |
| 🌿 Module Plante | Identification espèce, diagnostic santé, analyse visuelle (taches, jaunissement, parasites), causes probables, plan de soin, profil d'entretien, calendrier rappels |
| 📊 Historique & Suivi | Analyses sauvegardées, suivi évolution plantes, armoire à pharmacie digitale, alertes péremption |
| 🔍 Recherche | Recherche textuelle, par symptôme, par problème visible sur plante |
| ⚠️ Sécurité & Disclaimer | Avertissement médical, signalement interactions dangereuses, bouton contact professionnel / 15 SAMU |

## Architecture technique

```
Photo de l'utilisateur
        ↓
  Claude Vision API  ←── cerveau principal
        ↓
  Résultat structuré (nom, effets, conseils...)
        ↓
  Affiché proprement sur le site
```

## Stack

Next.js App Router · TypeScript · Tailwind CSS

## Commandes

```bash
npm run dev     # localhost:3000
npm run build
npm run lint
```

## Règles importantes

- Claude Vision reçoit l'image + une instruction précise et retourne toutes les infos structurées
- Les résultats doivent toujours être en langage simple, sans jargon médical
- Le module Sécurité doit toujours être visible — jamais masqué ou désactivé
- Ne jamais présenter l'outil comme un substitut à un médecin ou pharmacien
- Les interactions dangereuses entre médicaments doivent être signalées automatiquement
