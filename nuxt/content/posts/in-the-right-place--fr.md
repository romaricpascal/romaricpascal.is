---
date: 2020-06-19
title: Au bon endroit
slug: au-bon-endroit
type: post
layout: post.pug
---
Les pages avec le suffixe `--fr`, pour indiquer qu'elles sont en français, doivent maintenant être écrites au bon endroit. Prenez `blog-entry--fr.md`, par exemple. Au lieu de finir en `site/blog-entry--fr/index.html` ([les permalinks et tout ça...][permalink-article]), elle doit être écrite dans le fichier `site/fr/blog-entry/index.html`.

Encore mieux si on peut au passage traduire `blog-entry`, pour par exemple arriver dans `site/fr/article/index.html`. On va laisse ça de côté pour l'instant, et commencer à poser de bonnes bases avant d'ajouter des choses.

En deux temps
---

Pour écrire le fichier au bon emplacement, il faut que deux choses se passent:

1. Calculer le chemin du fichier où écrire, en fonction de sa langue et de sa clé de traduction
2. "Bouger" le fichier à cette location, ce qui, avec Metalsmith, demande de lui donner la clé correspondante dans l'objet `files`.

L'étape 1 doit se passer assez tôt dans la chaîne. En tout cas avant le rendu du HTML, pour pouvoir utiliser le chemin d'écriture dans des liens, par exemple. Cependant, `metalsmith-in-place` à besoin de l'extension originale pour détecter qu'il s'agit de Markdown et le transformer en HTML. Il faut donc attendre un peu avant de bouger le fichier, sinon, on se retrouve avec du Markdown brut en sortie.

Il va donc falloir non pas un, mais deux plugins: `computeOutputPath` pour calculer le chemin et `moveToOutputPath` pour changer où le fichier est écrit. Comme ils sont liés l'un à l'autre, autant les placer dans le même module node `plugins/outputPath.js`:

```js
exports.computeOutputPath = function computeOutputPath() {
  // Ça arrive tout bientôt
}

exports.moveToOutputPath = function moveToOutputPath() {
  // Et celui là juste après!
}
```

On peu ensuite ajouter chacun d'eux à la chaine de plugins de Metalsmith:

```js
// ...
const { computeOutputPath, moveToOutputPath } = require('./plugins/outputPath');
// ...
.use(detectLanguage())
// On calcule le chemin dès qu'on a 
// toutes les infos
.use(computeOutputPath())
// ...
// Et on bonge le fichier juste avant d'écrire
.use(moveToOutputPath())
.build(function(err) {
//...
```

Vu que ce dernier plugin va changer le chemin que `metalsmith-permalinks` aura calculé, on peu maintenant se passer de ce dernier. `moveToOutputPath` se chargera de génerer de joli permalinks.

Calculer le chemin de sortie
---

A vue de nez, les étapes suivantes semblent faire l'affaire:

- Récupérer la langue et clé de traduction du fichier
- Si la langue n'est pas celle par défaut, choisir pour chemin de sortie `<langue>/<clé-de-traduction>/index.html`
- Sinon, utiliser `<clé-de-traduction>/index.html`

Mais comme l'implémentation de la plupart des fonctionnalités, il y a quelques subtilités.

Tout d'abord, les fichiers `index.md`, par exemple `index--fr.md` pour la traduction de la page d'accueil. Il ne faut pas qu'il se retrouve dans `/fr/index/index.html`. Il serait accessible pour l'URL `/fr/index/` alors qu'on recherche `/fr/`. Pour cela, il doit finir écrit dans `/fr/index.html`.

L'autre soucis, c'est que tous les fichier ne sont pas destinés à finir en HTML. Une feuille de style ou une image dans le dossier `content` sera copiée dans le dossier `site`. Il devra conserver son extension, donc il va falloir s'occuper de ça aussi.

Cela fait assez de choses pour en faire une petite fonction qui sera utilisée par le plugin lui-même.

```js
const { basename, dirname, join } = require('path');

function newOutputPath(file) {

  const slug = basename(file.i18n.key);
  const path = dirname(file.i18n.key);

  // C'est la première extension de la liste
  // qui compte. `feed.xml.pug`, par exemple,
  // doit devenir `feed.xml`
  const extension = file.pathInfo.extensionList[0];

  // Ce sont les extensions qui deviendront
  // du HTML au final
  if (extension == 'md' || extension == 'html' || extension == 'pug') {
    // Seuls les fichiers HTML ont besoin
    // de se préoccuper de s'ils s'appellent
    // `index`
    if (slug === 'index') {
      return join(path, 'index.html')
    } else {
      return join(path, slug, 'index.html')
    }
  }
  
  if (extension) {
    // On s'assure que l'extension est conservée
    return join(path, `${slug}.${extension}`)
  }
  return join(path, slug)
}
```

On peut ensuite utiliser la fonction pour calculer quel sera le chemin de sortie final et l'attacher aux données de `files`

```js
// On rajoute `normalize` à la liste 
// pour éliminer des `/./` dans les chemins
const { basename, dirname, join , normalize } = require('path');

exports.computeOutputPath = function rewrite() {

  return function(files, metalsmith) {

    Object.values(files).forEach(file => {

      const { defaultLanguage } = metalsmith.metadata();

      let outputPath = newOutputPath(file);

      if (file.i18n.language !== defaultLanguage) {
        
        outputPath = normalize(join(file.i18n.language, outputPath));
      }

      file.outputPath = outputPath;
    });
  };
};

function newOutputPath(file) {
// ...
```

Bouger les fichiers
----

Le gros du travail est maintenant derrière nous. Mettre les fichiers au bon endroit est bien plus léger que de calculer où ils vont. Il s'agit de:

1. les supprimer de leur clé actuelle dans `files`, pour qu'ils ne finissent pas écrits à deux endroits différents
2. les ajouter avec la clé qu'on vient de caluler

Dans cet ordre, sinon les fichiers vont se retrouver supprimés si leur chemin n'a pas changé... pas top.

```js
exports.moveToOutputPath = function moveToOutputPath() {

  return function(files) {

    Object.entries(files).forEach(([currentPath, file]) => {

      if (file.outputPath) {
        // On suppprime d'abord au cas où `outputPath` est 
        // le même que `currentPath`
        delete files[currentPath];
        files[file.outputPath] = file;
      }
    });
  };
};
```

Ça serait bien de s'assurer aussi que différents fichier ne se marchent pas sur les pieds. `fr/index.md` serait écrit au même endroit que `index--fr.md`.

Pour s'en charger on peu lever une exception lorsqu'un fichier existe déja à l'`outputPath`. Pour débugger, il sera utile de savoir à quel chemin on essaie d'écrire, mais aussi quels fichiers essaient d'y aller tous les deux. Heureusement ces infos sont gardées bien au chaud dans `pathInfo` (ce [premier plugin][first-plugin] est bien utile au final).

```js
// ...
  delete files[currentPath];
  // Avant d'écrire on vérifie
  // s'il n'y a pas déja quelque chose
  if (files[file.outputPath]) {
    throw new DuplicateOutput(
      file.outputPath,
      file,
      files[file.outputPath]
    );
  }
// ...

class DuplicateOutput extends Error {
  constructor(outputPath, fileA, fileB) {
    // On construit un message d'erreur
    // utile avec les infos passées au constructeur
    super(`
      Duplicate output at ${outputPath}.

      - ${fileA.pathInfo.path}
      - ${fileB.pathInfo.path}
    `);
  }
}
```

C'est un peu brutal d'arrêter la génération dès qu'une seule collision est détectée, mais on sait rapidement quels fichiers sont en faute.

Traduire les chemins
---

La dernière étape est de traduire les chemin de fichiers eux mêmes. Enfin, pour le moment, juste leur dernière partie, ce qui sera suffisant pour lancer cette nouvelle version du site. 

Pour cela, on va demander à chaque fichier qui veut une dernière partie d'URL différente d'avoir une variable `slug` dans son front-matter. On pourra ensuite l'utiliser pour générer la dernière partie du fichier.

```js
// ...
// Au lieu de const slug = basename(file.i18n.key);
const slug = file.slug || basename(file.i18n.key);
// ...
```

Avec tout ça, on peut enfin placer les traductions dans des fichiers les uns à côté des autres. Elles se retrouveront chacunes dans leurs arborescence. On y reviendra certainement dans le futur pour traduire le reste du chemin. Mais c'est un effort un peu conséquent. Vu que l'objectif est de ressortir un site rapidement, on va passer à quelque chose qui permet de s'en rapprocher.

On pourrait par exemple mettre à jour la navigation par langue pour envoyer vers la traduction de la page courante, maintenant qu'on a des clés de traduction pour les associer. Mais j'ai envie de parler un peu de CSS plutôt. Pourquoi pas quelques mots sur les styles minimalistes du relancement. Si, si, il y a déja des choses dont parler avec si peu. On voit ça dans le prochain article!

[permalink-article]:../urls-longue-conservation
[first-plugin]:../disecter-le-chemin-des-fichiers
