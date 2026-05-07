# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Présentation

Web app complète de vision par ordinateur (style SaaS). L'utilisateur peut uploader des images/vidéos ou activer sa webcam et obtenir des résultats en temps réel.

### Modules

| Module | Description |
|--------|-------------|
| 📸 Analyse image/webcam | Détection d'objets + bounding boxes, description de scène par Claude, historique, export PDF |
| 🎥 Analyse vidéo | Upload vidéo → analyse frame par frame, détection de mouvement, timeline interactive |
| 🔍 Recherche visuelle | Images similaires, identification de contexte, comparaison côte à côte avec diff IA |
| 📊 Dashboard & Analytics | Stats globales, heatmaps des zones actives, historique des sessions, graphiques interactifs |
| 🎨 Artiste IA | Stylisation d'image + génération de prompt Stable Diffusion |
| 🌍 Accessibilité | Alt-text automatique pour malvoyants, traduction multi-langue |

## Stack

Next.js App Router · TypeScript · Tailwind CSS

## Commandes

```bash
npm run dev     # localhost:3000
npm run build
npm run lint
```
