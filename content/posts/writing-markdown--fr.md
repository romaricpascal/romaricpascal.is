---
title: Markdown plutôt que HTML
slug: markdown-plutot-que-html
type: post
layout: post.pug
---
Bon, écrire directement le contenu du site en HTML, c'est pas franchement la meilleure expérience. HTML permet de donner du sens a ce contenu, mais toutes ces balises au milieu, ce sont autant d'obsacles quand il s'agit de "juste écrire". Markdown offre un format bien plus léger.

Tout comme pour l'utilisation de templates afin de partager le layout entre les page, convertir du Markdown en HTML est quelque chose de récurrent lorsqu'on génère des sites statique. Et là encore, Metalsmith à déja un plugin existant pour s'en charger, `metalsmith-in-place`.

Installation
---

Comme `metalsmith-layouts`, ce plugin s'appuie sur `jstransformer` pour transformer le Markdown. Et comme pour les layouts, il faudra aussi installer la librairie spécifique pour ce format. Les principales libraries pour Markdown ont leur pendant `jstransformer-...`. 

`remark` est la plus attrayante, notamment de par ses plugins et son extensibilité. Elle est compatible avec `retext` (pour modifier le texte en lui-même) et `rehype` (de son côté pour le HTML), ce qui ouvre plein d'autres possibilités.


Installons donc tout ca avec: 

```sh
npm i metalsmith-in-place jstransformer-remark
```

Une fois instalée, rendez-vous dans le fichier `src/index.js` pour y ajouter le nouveau plugin.

```js
/* ... */
const inPlace = require('metalsmith-in-place')
/* ... */
  .destination('./site')
  .use(inPlace())
  .use(
    layouts({
/* ... */
```

On peut maintenant transformer le fichier `content/index.html` en `content/index.md`:

```md
# It works!

We can even have:

- some lists
- with multiple items

And **all** the nice markdown things.
```

Le plugin va non seulement convertir le Markdown en HTML, il va aussi changer le fichier de destination en `site/index.html` (à la place de `site/index.md`). Parfait!

Utiliser les plugins de Remark
---

Remark à été choisi car il est extensible à souhait. Grâce [à de nombreux plugins](remark-plugins), il est possible de configurer comment le Markdown devient HTML.

Malheureusement, utiliser un fichier `.remarkrc.js` (comme avec `remark-cli`) ne fonctionne pas. C'est dommage, mais heureusement, `metalsmith-in-place` permet de passer un objet a la librarie `jstransformer-...` afin de la configurer.

Grâce à cette propriété `engineOption`, on peut donc configurer `remark`. Par exemple, lui ajouter `remark-slug` et `remark-autolink-headings` pour ajouter un lien à chaque titre.

```js
/* ... */
.use(inPlace(
  engineOptions: {
    plugins: [
      require('remark-slug'),
      require('remark-autolink-headings)
    ]
  }
))
/* ... */
```

Quelques styles à rajouter (plus tard) et les gens pourront partager rapidement une section spécifique des articles. Il faudra peut-être revisiter le balisage aussi (accessibilité, notamment), mais la configuration fonctionne.

Un dernier plugin Metalsmith à installer pour bidouiller un peu les URLs, et il sera enfin temps d'avancer sur l'internationalisation!

[remark-plugins]: https://github.com/remarkjs/remark/tree/master/doc/plugins.md
