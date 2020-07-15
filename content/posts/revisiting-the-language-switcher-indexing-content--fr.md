---
date: 2020-07-09
title: Revisiter la navigation par langue - Indexer les page
slug: revisiter-la-navigation-par-langue-indexer-les-pages
type: post
layout: post.pug
---
Lorsqu'on a laissé le générateur de site statique, il [détectait la langue grâce au suffixe `--fr`][ssg-detect-language] et [placait les fichiers au bon endroit][ssg-file-output]. La navigation par langue envoyait encore vers la page d'accueil lorsque les gens changent de langue.

C'est pas terrible. Si une traduction existe, mieux vaut les envoyers vers celle-ci. Maintenant que chaque fichier dispose d'une clé de traduction, stockée dans sa propriété `i18n.key`, on peut l'utiliser pour diriger vers la page traduite.

Comme la navigation par langue est sur toutes les pages, il serait très inefficace de parcourir naïvement la liste des fichiers chaque fois qu'on cherche une traduction. Construire à l'avance un arbre d'objets qui groupe les fichiers par clé de traduction, puis par langue, rendrait la recherche bien plus directe: naviguer 2 propriétés, plutôt qu'une liste de fichier qui ne vas que grandir. Ça va nous donner la structure suivante:

```js
{
  index: {
    en: Fichier,
    fr: Fichier
  },
  'about-me': {
    en: Fichier,
    fr: Fichier
  }
  // ...
}
```

Scaffolding a new plugin
---

On va donc devoir créer un nouveau plugin pour générer cet arbre et le stocker dans les métadonnées du site pour pouvoir ensuite y accéder depuis les templates.
Lorsque le site va grandir, il y aura surement besoin d'autres moyens de grouper les fichiers. Pour éviter de poluer les métadonnées avec autant de nouvelles propriétés que de manière de grouper les pages, on va les regrouper dans un objet `groups`, inauguré par ce premier regroupement: `groups.byKeyByLanguage`.

Dans le fichier `plugins/group.js`, on peut donc créer un squelette de plugin:

```js
module.exports = function group() {
  return function (files, metalsmith) {
    const groups = {
      byKeyByLanguage: {}
    }
    // Coming soon, the indexing of the files ;)
    metalsmith.metadata().groups = groups;
  }
}
```

On peut ensuite l'ajouter à la chaîne de transformation de Metalsmith. Il faudra le placer après la détection de la langue et de la clé de traduction, pour pouvoir les utiliser pour indexer:

```js
// ...
const group = require('./plugins/group');
// ...
.use(detectLanguage())
.use(computeOutputPath())
.use(group())
// ...
```

Indexer les fichiers
---

Indexer les fichiers dans cet arbre d'objets demande deux étapes:

1. Lire les propriétés du fichier qui constituent l'index, ici `i18n.key` et `i18n.language`
2. Placer le fichier au chemin leur correspondant dans l'index.

Lors de cette seconde étape, il faut créer à la volée les objets intermédiaires lorsque de nouveaux chemins sont ajoutés. Plutôt que de le coder nous-mêmes, on peut s'appuyer sur la <a href="https://lodash.com/docs/4.17.15#set" hreflang="en">fonction `set` de Lodash</a>. Et afin de ne pas exploser si la propriété `i18n` n'était pas là, on peut compter sur la <a href="https://lodash.com/docs/4.17.15#get" hreflang="en">fonction `get` de Lodash</a> pour accéder aux valeurs en profondeur.

Après avoir installé Lodash avec `npm i lodash`, on peut mettre à jour le plugin:

```js
const get = require('lodash/get');
const set = require('lodash/set');
    // ...
    Object.values(files).forEach(file => {
      // 1. Collect the properties from the file
      const language = get(file, 'i18n.language');
      const key = get(file, 'i18n.key');
      // 2. Add them to the index
      set(groups.byKeyByLanguage, [key,language], file);
    });
    metalsmith.metadata().groups = groups;
    //...
```

Les fichiers sont maintenant bien groupés par clé de traduction et langue, un premier pas pour envoyer les utilisateurs/trices vers la pages traduite. Il faut maintenant mettre à jour la navigation par langue pour profiter de ce nouvel index, ça sera pour le prochain article.

[ssg-detect-language]: ../detecter-la-langue-seconde-passe/
[ssg-file-output]: ../au-bon-endroit/
