# Instructions — Site de cours personnel

## Objectif

Site de cours personnel dédié à la **XR (Extended Reality)**, à l'**IA** et à la **vision par ordinateur**.
Usage privé, pas d'authentification ni de gestion d'utilisateurs.

## Stack technique

- **Next.js** (App Router)
- **Tailwind CSS**
- **MDX** pour le contenu des cours (Markdown + composants React)
- **TypeScript**

## Thèmes couverts

1. **Intelligence Artificielle** — fondamentaux, deep learning, LLMs, etc.
2. **Vision par ordinateur** — traitement d'image, détection d'objets, segmentation, etc.
3. **XR (AR/VR/MR)** — concepts, moteurs, cas d'usage, etc.
4. **Python pour l'IA** — syntaxe, NumPy, OpenCV, PyTorch, etc.

Chaque thème doit avoir des cours **débutant → avancé**.

## Structure des cours

Chaque cours MDX doit pouvoir contenir :

- **Explication théorique** : texte structuré avec titres, listes, formules
- **Blocs de code commentés** : morceaux de Python expliqués ligne par ligne
- **Quiz (QCM)** : questions à choix multiple avec feedback immédiat (bonne/mauvaise réponse)
- **Questions ouvertes** : avec bouton "voir la réponse"
- **Cartes de révision** : terme → définition, retournables
- **Exercices pratiques** : énoncé + solution révélable

## Composants React à créer

| Composant | Rôle |
|-----------|------|
| `Quiz` | QCM interactif avec feedback coloré |
| `CodeExplainer` | Bloc de code avec explication par ligne révélable |
| `Flashcard` | Carte retournable recto/verso |
| `RevealAnswer` | Bouton "voir la réponse" pour questions ouvertes |
| `Exercise` | Énoncé + solution cachée |

Ces composants sont utilisables directement dans les fichiers MDX.

## Style

- Dark mode par défaut (ambiance tech)
- Typographie lisible pour les longs textes théoriques
- Coloration syntaxique pour tout le code Python

## Organisation des fichiers de cours

```
/content
  /ia
    /fondamentaux
    /deep-learning
    /llm
  /vision
    /traitement-image
    /detection
  /xr
    /ar
    /vr
  /python
    /bases
    /numpy
    /pytorch
    /opencv
```

## Ce qui n'est PAS nécessaire

- Authentification / comptes utilisateurs
- Base de données (contenu statique en MDX)
- Commentaires ou interactions sociales
- Paiement ou accès restreint
