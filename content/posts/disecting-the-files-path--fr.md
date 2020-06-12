---
title: Disecter le chemin des fichiers
slug: disecter-le-chemin-des-fichiers
type: post
layout: post.pug
---
[Les prochaines fonctionnalités][upcoming-features] nécessite des plugins Metalsmith spécifiques. Ce premier plugin simplifiera le travail de futur plugin en pré-découpant les chemins de fichiers pour y trouver les morceaux intéressants. Allons-y!

Anatomie d'un plugin Metalsmith
---

Ça a quelle tête au fait, un plugin Metalsmith? Jusqu'ici, tout ce qui s'est passé c'est de fournir à la méthode `use` de Metalsmith le résultat de fonctions importées depuis des packages existants.

Cette méthode `use` attend en paramètre une fonction, qu'elle utilisera pour traiter les fichiers avant de les passer au plugin suivant. La plupart du temps, cette fonction requiert un peu de configuration. C'est pourquoi elle est créée par une autre fonction, chargée de capturer ces `options`.

Même si un plugin n'est pas configurable, il vaut mieux toujours le faire créer par une fonction. Cela permet de ne pas avoir à penser si oui ou non, il faut exécuter la fonction importée.

Ça a l'air de faire beaucoup de fonctions, mais en pratique un plugin Metalsmith ressemble à ça:

```js
module.exports = function metalsmithPlugin(options) {
  return function processor(files,metalsmith, done) {
    // Traite les fichier de `files`
    // conformément aux `options`
  }
}
```

Des arguments de la fonction `processor`, `files` est le plus important. C'est la référence au contenu du site. Il s'agit d'un object qui indexe les fichiers: leur chemin en clé, les info du fichier (contenu et métadonnées an valeur). Les plugins peuvent en faire ce qu'ils en souhaite: ajouter/supprimer des entrées, modifier leur contenu, leur métadonnées, les placer à un chemin différent... Une fois tous les plugins exécutés le contenu des fichiers (dans leur attribut `contents`) seront écrit à l'emplacement indiqué par leur clé.

`metalsmith` fournit une référence à Metalsmith lui-même. Principalement, cela permet d'accéder à la methode `metadata()` pour lire ou modifier des données commune à l'ensemble du site. Enfin, `done` est un callback à appeler si le plugin est asynchrone.

Un plugin Metalsmith pour découper le chemin du fichier
---

Ce plugin va utiliser le <a href="https://nodejs.org/api/path.html" hreflang="en">module `path` de NodeJS</a> pour extraire quelques parties intéressant du chemin des fichiers. Il les ajoutera ensuite aux métadonnées sous l'attribute `pathInfo` (pour ne pas trop poluer les métadonnées avec plein de clés):

- `path`, le chemin du fichier lui-même, que Metalsmith ne stocke que dans les clés de `files`
- `dirName`, le chemin au dossier contenant le fichier
- `fileName`, le nom du fichier, extension(s) incluse(s)
- `baseName`, pareil, mais sans extensions
- `stem`, le chemin du fichier, sans extensions (pour faciliter l'extraction des clés de traduction)
- l'`extension` finale ud fichier, ainsi que toutes ses `extensions` (sous forme de chaine de caractère)
- et enfin `extensionsList` un `Array` avec la list des extensions.


Pour un chemin de fichier donné, on peut extraire tout ça avec la fonction suivante:

```js
const { dirname, basename, join } = require('path');

function getPathInfo(filePath) {
  const dirName = dirname(filePath);
  const fileName = basename(filePath);

  // En destructurant, on peut séparer le nom
  // du fichier du tableau de ses extensions
  const [baseName, ...extensionsList] = fileName.split('.');

  return {
    path: filePath,
    dirName,
    fileName,
    baseName,
    stem: join(dirName, baseName),
    extension: extensionsList[extensionsList.length - 1] || '',
    extensions: extensionsList.join('.'),
    extensionList: extensionsList,
  };
}
```

On peut ensuite l'utiliser pour créer le plugin Metalsmith. Il n'aura qu'à parcourir tous les fichiers et assigner le résultat à l'attribut `pathInfo`.

```js
const { dirname, basename, join } = require('path');

/**
 * A metalsmith plugin to provide path breakdown
 */
module.exports = function pathInfo() {

  return function processor(files) {

    Object.keys(files).forEach(function(filePath) {

      files[filePath].pathInfo = getPathInfo(filePath);
    });
  };
};

function getPathInfo(filePath) {
//...
```

C'est tout bien isolé comme ça: la fonction  `getPathInfo` extrait les infos, le plugin s'occupe de la logistique de Metalsmith. Bon, on va pas se mentir, lors du dévelopement, le plugin a longtemps tout fait avant de séparer la collecte des infos dans sa propre fonction.

Une fois le plugin importé dans `src/index.js`, on peu l'ajouter à la chaîne. Plutôt au début (en premier même), pour que les autres plugins puissent utiliser ses données.

```js
// ...
const pathInfo = require('./plugins/pathInfo');
// ...
.metadata(/*...*/)
.use(pathInfo())
.use(inPlace(/* ... */))
// ...
```

Ça ne va rien changer au contenu générer pour le moment (sauf à faire afficher par le layout le contenu d'une des nouvelles métadonnées). Mais il va grandement faciliter la tâche du prochain plugin, qui devra détecter la langue et la clé de traduction de chaque fichier. On verra ça dans le prochain article.

[upcoming-features]: https://romaricpascal.is/posts/planning-ahead/#le-plan
