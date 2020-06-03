---
title: C'est parti
slug: c-est-parti
type: post
layout: post.pug
---
Allons-y! Comme pour tous les projects, il y aura un peu d'installation à faire au debut. Et surtout une décision importante a prendre: quel générateur de site statique utiliser. Il en existe plein, tellement qu'un site se charge de les recenser.

A la chasse au générateur
---

Pour cette refonte, j'ai quelques critères en tête pour reduire cette liste:

- **un outil en JavaScript**: Pour construire un site, il faut déjà jongler avec 3 languages: HTML, CSS et JavaScript. Autant ne pas en rajouter un de plus.
- **ne pas etre basé sur une librarie de composants côté client**: C'est un simple site de contenu, sans besoins d'interactivité poussée dans le navigateur, inutile de lui attacher une complexité inutile.
- **aisément extensible**: En partie, la raison de cette refonte est s'amuser et apprendre comment construire des fonctionnalités pour un site statique. J'aurais donc besoin de le modifier facilement.

Avec tous ça en tête, mon choix s'est porté sur <a href="https://metalsmith.io" hreflang="en">Metalsmith</a>. Peut-être pas l'outil le plus neuf et flamboyant, mais il a pour lui un avantage majeur. J'ai pu très vite comprendre comment il fonctionnait:

1. Lecture des fichiers dans un dossier source
2. Extraction de données et transformations grace a un systeme de plugins
3. Ecriture dans un fichier de destination.

Cette simplicité devrait m'apporter beaucoup de flexibilité. Son prix sera d'avoir a choisir ou implémenter les plugins necessaire pour obtenir le fonctionnement que je souhaite. Mais c'est un compromis qui me convient.

Et le projet fût
---

Autour du code en lui-même, il y a toujours plein de choses a mettre en place: un dépôt Git, le descripteur de package pour NPM, le linting, les tests... Les ajouter chacun a la main fais perdre un temps précieux. Un bon moyen de gagner du temps sur cette partie est d'utiliser un gabarit de projet avec tous ces aspects pré-configurés. Cela permet de rester concentrer sur ce les parties les plus important (sauf si le projet est de changer la configuration des outils... mais c'est pas le but ici).

Ces derniers temps, ma méthode favorite pour démarrer rapidement un projet et d'avoir [un gabarit dans un dépôt Git](https://github.com/rhumaric/project-template-node) et d'utilier `degit` (<a href="https://svelte.dev/blog/the-easiest-way-to-get-started#2_Use_degit" hreflang="en">découvert dans les tutoriaux SvelteJS</a>) pour l'importer, editer 2-3 fichiers (ne pas oublier le nom dans le `package.json`) et c'est parti:

```sh
git init
npx degit https://github.com/rhumaric/project-template-node
```

Pas d'attache au system de template de projet du site qui héberge le dépôt en ligne. Et la commande est plus simple que celle pour changer/supprimer la remote `origin` après un `git clone`.

Il reste le générateur
---

Maintenant qu'on a passé cette partie "logistique", il est temps d'enfin installer le générateur de site statique.

```sh
npm i metalsmith
```

Il reste a le configurer pour transformer les fichier depuis un dossier `content` vers un dossier `site` (a ne pas oublier de metter dans le `.gitignore`). L'outil en ligne de commande de Metalsmith respose sur un fichier de configuration en JSON. Cela pose des soucis pour commenter, mais surtout s'il faudrait passer des fonctions a certains plugins. Je prefère donc utiliser le module dans un fichier `src/index.js` qui sera lancé pour construire le site.

```js
const metalsmith = require('metalsmith');

metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .build(function(err) {
    if (err) throw err;
  })
```

Et hop! En lançant `node src/index.js`, les fichier du dossier `content` se retrouvent dans `site`. Metalsmith est en place...mais bon, on a pas gagné grand chose. On aurait aussi vite fait d'avoir écrit les fichier directement dans `site`.

La prochaine étape sera donc de tirer quelques avantages de cette installation et de transformers quelques fichiers au passage. Mais ça sera pour le prochain article.
