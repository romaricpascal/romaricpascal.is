---
title: Mieux indiquer la langue de destination
slug: mieux-indiquer-la-langue-de-destination
type: post
layout: post.pug
ogDescription:
  Amélioration de l'accessibilité de la langue de destination des liens,
  en injectant du HTML grâce à remark et son arbre de sytaxe abstraite.
---
Le web est écrit dans de nombreuses langues. Savoir que vous allez cliquer sur un lien qui vous emmène vers une page dans une autre langue facilite la navigation.

[Thomas][twitter-iamtzi], un ami de longue date, a récemment publié [un article expliquant comment fournir des indices sur la langue de destination en CSS][tzi-article]. A la suite d'une discussion sur Twitter, il s'avère [qu'ajouter du contenu en CSS pose des soucis d'accessibilité (en)][wcag-failure-css-content] ([merci de l'avoir signalé Julie][twitter-thread]). Les utilisateurices avec des feuilles de styles personnalisées à leur besoins pourraient surcharger ces styles et passer à côté de l'information. Comme [j'utilise une technique similaire][own-article], il fallait donc changer ça.

Du JavaScript dans le navigateur aurait permis d'ajouter du HTML avec cet information, améliorant son accessibilité. Mais il souffre de la même fragilité que le CSS: si [le script ne charge pas (en)][javascript-not-loading], pas de contenu. J'ai donc préféré regarder comment ajouter ces indices à la génération du site.

Les arbres de syntaxe abstraite
---

Au milieu de tout ce Markdown, il faut dont détecter les liens qui ont un attribut `hreflang`. CSS et JavaScript côté client peuvent s'appuyer sur le sélecteur `a[hreflang]`. En utilisant [`remark` (en)](npm:), deja en place pour le rendu du contenu, on peut faire de même sur le Markdown.

Cet outil transforme le texte du fichier Markdown en un [arbre d'objets JavaScript (en)][mdast] (un arbre de syntaxe abstraite, ou <span lang="en">abstract syntax tree</span>, AST). Un peu comme un document HTML est transformé en DOM dans le navigateur, à la différence que chaque nœud représente ici un bout de Markdown: un lien (`Link`), un titre (`Heading`). L'arbre peut alors être traversé et ses nœuds transformés grâce à des plugins.

Travailler sur un AST rend le processus plus robuste que de modifier le texte directement, à l'aide d'expressions régulières par exemple. Ce passage à des objets permet de ne pas avoir à penser s'il y a d'autres attributs avant ou après `hreflang`, du contenu HTML à l'intérieur du lien, peut-être des retours à la ligne aussi. On peut se concentrer sur trouver les liens avec un `hreflang` dans leurs attributs et ajouter un nœud final à leurs liste d'enfants.

Convertir l'arbre
---

Mais en fait, il faut trouver toutes les balises `<a>`, pas juste les `[liens en Markdown]`, puis injecter une balise `<span>`. Ce sont des concepts liés à HTML, et non à Markdown. Ils n'apparaîtront donc pas dans l'AST manipulé par `remark`. Mais celui-ci peut être converti pour [représenter du HTML (en)][hast], grâce à [l'ecosystème d'outils pour manipuler du texte (en)][gh-unified] (structuré comme HTML ou Markdown, ou non) dont fait parti `remark`.

C'est le rôle de deux plugins:

- [`remark-rehype` (en)](npm:) qui transforme les nœuds `Link` du Markdown en nœuds `<a>`
- [`rehype-raw` (en)](npm:) qui se charge lui des balises `<a>` écrites directement en HTML

Il faut donc les ajouter à la liste de plugins actuellement utilisés pour la compilation du Markdown. A cause de l'API de `jstransformer-remark` pour recevoir les plugins, il y a un peu de gymnastique à faire avec des fonctions pour configurer `remark-rehype`. Sans l'option `allowDangerousHtml`, les balises `<a>` écrite directement en HTML ne seraient pas visibles par `rehype-raw`.

On se retrouve donc avec la liste suivante (après installation des plugins par `npm i remark-rehype rehype-raw`):

```js
/* … */
.use(
  inPlace({
    engineOptions: {
      plugins: [
        require('remark-slug'),
        require('remark-autolink-headings'),
        function() {
          return require('remark-rehype')({
            allowDangerousHtml: true
          });
        },
        require('rehype-raw')
      ]
    }
  })
/* … */
```

En l'état, le HTML compilé est un peut tout cassé malheureusement, ayant perdu toutes ces sémantiques. Un soucis lié à [`jstransformer-remark`](npm:) que l'on va contourner.

Patcher un module NPM
---

Pour transformer le Markdown en HTML sans configuration, `jstransformer-remark` ajoute par défaut le plugin [`remark-html` (en)](npm:). Cependant, on lui fournit maintenant un AST qui représente du HTML plutôt que du Markdown et il se retrouve tout perdu.

Reconvertir l'arbre en Markdown, avec [`rehype-remark` (en)](npm:), fait perdre de nombreuses classes et attributs, malheureusement. Echec :( On va donc se tourner vers un patch de `jstransformer-remark` pour supprimer l'ajout de `remark-html`.

Si on ne fait qu'éditer le fichier à l'intérieur de `node_modules`, le changement sera perdu à la prochaine installation et ne sera pas sauvé par Git. C'est là qu'intervient [`patch-package` (en)](npm:), qui permet de sauver ces changements dans un patch qui sera appliqué à chaque installation.

C'est parfait pour des changements ponctuels sur de petites bibliothèques, et bien plus léger que de faire un fork du projet. Cela n'empêche d'ailleurs pas de lever un bug sur le projet original pour discuter l'intégration du changement, qui permettrait de se passer d'un patch dans le futur.

Une fois `patch-package` installé avec `npm i -D patch-package`, on peut aller éditer le fichier fautif de `jstransformer-remark`, `node_modules/jstransformer-remark/index.js`:

```js
/* … */
// plugins.push(html)
/* … */
```

Une fois fait, lancer `npx patch-package` va créer le patch en comparant notre fichier éditer à une version propre et le stocker dans un dossier `patches`.

Il reste à appliquer le patch à chaque installation, grâce à un script `postinstall` dans `package.json`. Il lancera `patch-package` qui cette fois va appliquer les patches qu'il trouve dans le repo, et donc mettre `jstransform-remark` dans le bon état.

`remark-html` était aussi responsable de la transformation de l'arbre en HTML. Maintenant qu'on l'a supprimé, il faut restaurer la fonctionnalité. [`rehype-stringify` (en)](npm:), en fin de la liste de plugin, s'en chargera.

Coder le plugin (enfin!)
---

Tout est maintenant prêt pour créer notre plugin, dans `src/rehype/hreflang.hs` qui injectera les indices de langue aux liens. [remark/rehype plugins (en)][unified-plugins] ont une structure très similaire à ceux de Metalsmith: une fonction reçoit les options et retourne une autre fonction qui se chargera des transformations:

```js
module.exports = function hreflang(/* options */) {
  return function(tree) {
    /* transformation de l'arbre */
  }
}
```

N'oublions pas d'ajouter ce nouveau venu à la liste des plugins:

```js
/* … */
.use(
  inPlace({
    engineOptions: {
      plugins: [
        require('remark-slug'),
        require('remark-autolink-headings'),
        function() {
          return require('remark-rehype')({
            allowDangerousHtml: true
          });
        },
        require('rehype-raw'),
        require('./rehype/hreflang'),
        require('rehype-stringify')
      ]
    }
  })
/* … */
```

### Choisir les liens

Contrairement au DOM, l'AST n'a pas de fonction `document.querySelectorAll`. Mais le [package `hast-util-select`](npm:hast-util-select) fournit la même fonctionnalité avec sa fonction `selectAll`.

```js
const {selectAll} = require('hast-util-select');

module.exports = function hreflang({
  selector = 'a[hreflang]'
  } = {}) {
    return function(tree) {
      const linksWithHreflang = selectAll(selector, tree);
      /* Bientôt ;) */
    }
  }
```

Le CSS qui injectait les informations sur la langue jusqu'ici avait une option pour ne pas l'insérer: ajouter la classe `no-hreflang`. On peut utiliser la fonction `matches` de `hast-util-select` pour donner au plugin la même fonctionnalité:

```js
const {selectAll, matches} = require('hast-util-select');

module.exports = function hreflang({
  selector = 'a[hreflang]',
  ignoreSelector = '.no-hreflang'
} = {}) {
  return function(tree) {
    const linksWithHreflang = selectAll(selector, tree).filter(
      link => !ignoreSelector || !matches(ignoreSelector, link)
    );
    /* Encode un peu de patience ;) */
  }
}
```

### Ajouter la langue

Il faut maintenant ajouter une balise `<span>` à tous ces liens. Créer les nœuds à la mains est tout à fait possible. Un noeud qui représente un espace (celui à ajouter avant le span, par exemple) ressemble à ça: `{type: 'text', value: ' '}`.

Ces objets deviennent très vite verbeux pour construire des blocs HTML plus complexes. La bibliothèque [`hastscript` (en)](npm:) fournit un écriture grâce à des fonctions bien plus légère.

```js
const {selectAll, matches} = require('hast-util-select');
const h = require('hastscript');

module.exports = function({
  selector = '[hreflang]',
  ignoreSelector = '.no-hreflang',
  className = 'hreflang'
} = {}) {
  return function(tree) {
    const linksWithHreflang = selectAll(selector, tree).filter(
      link => !ignoreSelector || !matches(ignoreSelector, link)
    );
    for (const link of linksWithHreflang) {
      const span = h('span', { class: className }, link.properties.hrefLang);

      // Add a little space
      link.children.push({ type: 'text', value: ' ' });
      // Add the generated span with the language
      link.children.push(span);
    }
  };
};
```

On peut enfin supprimer le CSS qui injectait le contenu supplémentaire et styler le `.hreflang` comme souhaité:

```css
.hreflang {
  vertical-align: super;
  font-size: 80%;
}
```

La route était un peu chaotique, mais nous y voilà ! Avec le plugin et le CSS en place, les indications de langue pour les liens sont désormais plus accessibles et robustes, directement dans le HTML. `remark` et l'écosystème dont il fait parti sont vraiment utiles lorsqu'il s'agit de manipuler du HTML ou du Markdown. Ils ne sont d'ailleurs pas liés à la génération de sites statiques et peuvent être utilisés en bien d'autres situations, comme bibliothèque ou en ligne de commande. A garder sous le coude !

[twitter-iamtzi]: tw:iamtzi
[tzi-article]: https://tzi.fr/css/link-hreflang/
[wcag-failure-css-content]: https://www.w3.org/WAI/WCAG21/Techniques/failures/F87
[twitter-thread]: tw:juliemoynat/status/1301473966297477120
[own-article]: ../premiers-pas-vers-l-internationalisation/#linking-to-content-in-a-different-language
[javascript-not-loading]: https://kryogenix.org/code/browser/everyonehasjs.html
[mdast]: gh:syntax-tree/mdast
[hast]: gh:syntax-tree/hast
[gh-unified]: gh:unifiedjs/unified
[unified-plugins]: gh:unifiedjs/unified#plugin
