---
title: Detecter la langue - Première!
slug: detecter-la-langue-premiere
type: post
layout: post.pug
---
[Toute cette préparation pour découper le chemin des fichier dans le premier plugin][previous-article], c'était surtout pour préparer ce second. Son rôle sera de détecter la langue de chaque fichier, ainsi qu'une clé de traduction pour lier les contenu traduits entre eux.

Au final, pour le fichier `posts/an/article--fr.md`, la langue détectée sera le français, grâce au suffixe `--fr`. Tout ce qui précède ce suffixe sera la clé de traduction. Ceci permettra de l'associer à `posts/an/article.md`, son alter-ego anglais (et de les avoir juste à côté l'un de l'autre).

Pour le moment, par contre, la page en français est `fr/index.md`. On va commencer avec ça pour commencer gentillement à implémenter la détection de langue.

Structure du plugin
---

Dans `plugins/detectLanguage.js`, la structure de ce plugin sera très similaire au précédent. Il itère sur les fichiers et:

- délègue laisse à une fonction `getLanguageInfo` le soin de détecter la langue
- récupère son resultat pour le mettre dans la clé `i18n` (pour internationalisation) des données du fichier (histoire de garder ces données groupées)

```js
module.exports = function detectLanguage() {

  return function(files, metalsmith) {
    // Récupère un peu de configuration
    // dans les données globales du site
    const config = metalsmith.metadata();

    // Vu que toutes les infos sont dans les metadonnées
    // de chaque fichier, on peut itérer sur les valeurs
    // plutôt que les clés pour ce plugin
    Object.values(files).forEach(function(file){

      file.i18n = getLanguageInfo(file, config);
    });
  };
};

function getLanguageInfo(file, options){
  // Bientôt, très bientôt ;)
}
```

Vous avez peut-être remarqué que le plugin lit les metadonnées globales du site. Que ça soit au début du chemin, ou avec le suffixe comme plus targe, il ne faut pas que n'importe quelle valeur soit interprété comme langue. `la/confiture.md` ne parle pas de confiture en Lao, c'est juste une jolie URL.

On peut réutiliser la liste de langues ajoutée lors de la création de la navigation par langue: `languages`. On va lui rajouter `defaultLanguage` pour indiquer la langue par défaut. Oh, et n'oublions pas d'ajouter le plugin, après `pathInfo`, dans `src/index.js`.

```js
// ...
const detectLanguage = require('./plugins/detectLanguage')
// ...
.metadata({
  i18n: {
    defaultLanguage: 'en',
    language: ['en','fr'],
    //...
  }
})
.use(pathInfo())
.use(detectLanguage())
// ...
```

Détecter la langue
---

De toutes les partie extraite par le plugin `pathInfo`, c'est `stem` qui nous importe ici. En construisant une expression régulière à partir de la liste de langues supportées, on va pouvoir capturer à la fois la langue et la clé de traduction.

```js
function getLanguageInfo(
  file,
  { defaultLanguage, languages } = {}
) {

  const prefix = new RegExp(`^(${languages.join('|')})/(.*)`);
  const result = prefix.exec(file.pathInfo.stem);

  // `result` will only have a value if the RegExp
  // matched anything. This way we can provide default
  // with the `else`
  if (result) {
    return {
      language: result[1],
      key: result[2]
    };
  } else {
    return {
      language: defaultLanguage,
      key: file.pathInfo.stem
    }
  }
}
```

Un peu de nettoyage
---

Une fois tout ça en place, le fichier `fr/index.md` se verra associé la langue `fr` dans `i18n.language`. `index.md`, de son côté, se verra détecté `en`. On peut donc utiliser cette nouvelle valeur plutôt que `language` (dans le front-matter):

- dans le layout global `site.pug`, pour la valeur de [l'attribut `lang` de `<html>`][first-step-i18n]
- dans la [navigation entre langues][language-switcher], pour afficher la langue courante

Et surtout, plus besoin d'une valeur `language` dans le front-matter de chaque fichier (et pour le moment, plus besoin de front-matter du tout). C'est ça de moins à écrire à la main pour chacun d'eux.

On est pas encore au système présenté en introduction, mais ça prend forme. Dans le prochain article, on passera enfin à l'utilisatio du suffixe pour détecter la langue.

[previous-article]: ../disecter-le-chemin-des-fichiers/
[first-step-i18n]: ../premiers-pas-vers-l-internationalisation/
[langage-switcher]: ../passer-d-une-langue-a-l-autre/
