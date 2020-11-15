---
title: Lister les articles
slug: lister-les-articles
date: 2020-08-07
type: post
layout: post.pug
---
Chaque article peut être affiché seul, mais pour aider à leur découverte, mieux vaut avoir un page qui les liste tous. Ça va demander quelques ajouts au générateur de site:

1. Collecter tous les articles, mais en les séparant par langue. Ça serait bizarre qu'une personne qui s'attend à lire du français se retrouve avec un article en anglais.
2. Afficher la liste. Contrairement aux pages d'articles ou simples pages, leur contenu ne provient pas d'un fichier Markdown et il faudra recourir à un template Pug.
3. Trier la liste. Saviez-vous qu'on peut soustraire deux `Date`s l'une à l'autre en JavaScript et que rien n'explose?

Allez, c'est parti!

Collecter les articles
---

Avant la collecte à properment parler, il va falloir quelque chose pour distinguer les articles du reste des contenu. Pour celà, on peut les marquer avec un attribut `type` dans leur front-matter: 

```md
---
type: 'post'
---
```

Avec la langue, ça nous donne toutes les infos nécessaires pour les regrouper dans une liste. Le processus ne sera pas très différent de celui pour [collecter les traductions][translations]. On va donc créer un arbre d'`Object` à nouveau, avec la langue en clé d'abord, puis le type ensuite.

Contrairement au groupement des traductions, par contre, chaque groupe "langue, type" devra contenir un `Array` de fichiers et non plus un fichier unique. La fonction `set` de Lodash ne pourra donc plus nous aider à placer les fichiers au bon endroit. Mais on peut créer, dans le fichier `plugins/group.js` une fonction `push` qui ajoutera une valeur à un `Array` positionné à une clé donnée.

```js
//...
/**
 * @param {Object} object
 * @param {Array|String} key
 * @param {*} value
 */
function push(object, key, value) {
  const array = getOrCreate(object, key, Array);
  array.push(value);
}

/**
 * @param {Object} object
 * @param {Array|String} key
 * @param {Function} factory - A function used to create new Objects
 */
function getOrCreate(object, key, factory) {
  let value = get(key, object);
  if (!value) {
    value = factory();
    set(object, key, value);
  }

  return value;
}
//...
```

On peut ensuite l'utiliser pour créer un second groupe dans le plugin, `byLanguageByType`:

```js
//...
module.exports = function() {
  return function(files, metalsmith) {
    const groups = {
      byKeyByLanguage: {},
      byLanguageByType: {}
    };
    Object.values(files).forEach(file => {
      const language = get(file, 'i18n.language')
      const key = get(file, 'i18n.key')
      const type = get(file,'type')
      set(groups.byKeyByLanguage, [key, language], file);
      push(groups.byLanguageByType, [language, type], file);
    });

    metalsmith.metadata().groups = groups;
  };
};
//...
```

Maintenant que toutes les données sont prêtes, on peut passer à l'affichage.

Des pages avec Pug
---

Le plugin `metalsmith-in-place`, utilisé pour [le rendu du contenu des pages][content-rendering], ne se limite pas au Markdown. Il marche avec n'importe quel langage supporté par `jstransformer`. Ça signifie qu'il peut également rendre n'importe quel template `.pug` que l'on placerait dans le dossier `content`, étant donné que `jstranformer-pug` est déjà là pour se charger des layouts.

Pour s'assure que les pages listant les articles auront le bon titre dans l'onglet du navigateur, il faut leur donner un attribut `title` dans leur front-matter. On peut ensuite le réutiliser pour la balise `<h1>` du gabarit `content/posts/index--fr.pug`:

```pug
---
title: Tous les posts
---
h1= title
```

On peut maintenant prendre les listes (enfin celle qui correspond à la langue de la page) qu'on a collecté un peu plus tôt et itérer pour afficher leur contenu. Les balises `<h2>` s'assureront que la liste peut être parcourue par titre et `<time>` marquera la date des articles proprement.

```pug
//-...
- const posts = groups.byLanguageByType[i18n.language]['post']
ul.post-list
  each post in (posts)
    li.post-list-item
      h2
        a(href=post.outputUrl)
          = post.title
      time.margin-top--0(datetime=date.toISOString())
        = get(dateFormats,i18n.language)(post.date)
```

On y est presque! Pour la version anglaise, dupliquer le fichier en `index.pug` et changer le titre devrait faire l'affaire. Pour le moment, rien ne garantit l'ordre des articles, par contre. Il va falloir s'en charger.

Les derniers en premier
---

Comme la plupart des blogs, on va lister les articles du plus récent aux plus ancient. Il faudra donc trier la list d'articles avant affichage. Le plus simple, c'est de le faire dans le gabarit juste avant le rendu de la liste elle même (même si, idéallement, ça se ferait en amont du rendu du gabarit).

Les `Array` en JavaScript disposent d'une fonction `sort` qui fera bien l'affaire. Une chose à garder en tête: elle ne crée pas une copie, mais change l'ordre de l'`Array` en lui-même. Ça pourait entrainer de mauvaises surprises si d'autres parties de code essayaient d'accéder àla list d'articles. Encore pire si parfois elle le faisaient avant que la page de liste soit rendue, et d'autres fois après. Elles se retrouveraient avec des listes vraiment différentes.

Pour s'en protéger, on va donc trier notre propre copie de la liste, que l'on peut dupliquer facilement grâce à la [syntaxe de décomposition][spread-operator] (`...`).

Lorsqu'on ne trie pas de simples nombres ou chaines de caractère, il faut avoir recours à une fonction de comparaison. Elle attend deux éléments de l'`Array`, et devra retourner `-1`,`1`, ou `0` suivant si le premier élément doit être placé avant le second, après celui-ci, ou si les deux doivent garder leur ordre.

Vu que deux `Date` peuvent tout à fait être soustraites l'une à l'autre, cette fonction de comparaison n'aura qu'à faire la différence entre l'attribute `date` des deux articles. Pour savoir laquelle soustraire à l'autre, choisir un ordre, vérifier le résultat et inverser si besoin fait le moins mal au cerveau ;)

```pug
- const posts = [...groups.byLanguageByType[i18n.language]['post']].sort(function(a, b) {
    return b.date - a.date
  })
```

La liste d'articles est donc maintenant prête. Il lui faut juste un peu de mise en page (vous aurez peut-être remarqué les quelques classes qui traînent dans le gabarit). On en parlera dans le prochain article. Tout tout prêt de l'état au relancement maintenant!

[translations]: ../revisiter-la-navigation-par-langue-indexer-les-pages/
[content-rendering]: ../markdown-plutot-que-html/
[spread-operator]: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Syntaxe_d%C3%A9composition
[sort-comparator-function]: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/sort#Param%C3%A8tres
