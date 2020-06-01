---
title: Un layout partagé
slug: layout-partage
type: post
layout: post.pug
---

Maintenant que Metalsmith est en place, il est temps de faire un peu plus que des copier des fichiers. La plupart des pages du site vont partager une mise en page commune, jusque dans le code qui les compose. La copier-coller d'un fichier à l'autre serait innefficace et source d'oublis, erreurs. Pour y remédier, nous allons séparer le contenu de cette enveloppe de code commun et les placer dans des fichiers séparés.

Cette séparation est une opération classique lorsqu'on utilise un générateur de site statique, ou que l'on crée un site web en général. Il existe donc un plugin tout prêt pour Metalsmith, [metalsmith-layouts], donc autant en tirer parti.

Choisir un système de templates
---

Pour partager ce layout commun, il va falloir recourir a un système de templates. Et il en existe de nombreux, avec chacun sa propre syntaxe et sa propre API pour l'utiliser depuis JavaScript.

Pour moi, l'un des aspects les plus importants pour ce système c'est qu'il permette d'exécuter du code JavaScript à l'intérieur des templates. On cherche, à raison, à ne pas introduire de code dans les templates, mais il y a toujours quelques manipulations qui vont un peu plus loin qu'un simple `if` ou une boucle. Peut-être la construction d'attributs HTML en fonction d'une des données passée au template. Devoir éditer un fichier séparé, souvent bien loin du template lui-même, mets plutôt des battons dans les roues qu'autre chose.

C'est ce qui m'amène a utiliser Pug pour les templates.

Installation
---

Pour mettre en place ce système de layouts, il faut bien sûr le plugin `metalsmith-layout`. Pour se câbler aux differents systèmes de templates, il utilise `jstransformer`, une librairie qui uniformise l'API pour générer le rendu des differents systèmes de template existants. Il faut donc l'installer aussi, et la completer de son pendant spécifique pour Pug, `jstransformer-pug`.

```sh
npm i metalsmith-layouts jstransformer jstransformer-pug
```

On peut donc maintenant ajouter le plugin à Metalsmith, dans le fichier `src/index.js`. Le plugin aura besoin du nom du template a utiliser par défaut, on va dire `site.pug`.

```js
/* ... */
const layouts = require('metalsmith-layouts')
/* ... */
  .destination('./site')
  .use(
    layouts({
      default: 'site.pug'
    })
  )
  .build(function(err) {
/* ... */
```

Metalsmith est prêt, il reset à créer ce layout par défaut. Sauf configuration spéciﬁque, le plugin charge les fichiers du dossier `layouts`. On peut donc ajouter le code commun aux différentes page dans le fichier `layouts/site.pug`:

```pug
<!doctype html>
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Romaric Pascal
  body
    != contents
```

Il faudra rapidement metter à jour ce template pour s'assurer que chaque page aie un titre distinct, mais ça fera l'affaire pour envelopper chaque contenu dans une structure commune.

Pour éviter l'injection de tags HTML malicieux, Pug échappe le rendu de toutes les variables. Pratique quand elles ont été entrées par des utilisateurs, mais ici il s'agit de contenu que l'on contrôle totalement. On peut donc sans soucis se passer de cet échappement, en utilisant `!=` au lieu de `=`.

Avec le layout en place, les fichiers du dossier `content` peuvent être réduits à leur contenu spécifique. Par example, un fichier `src/index.html` come celui ci:

```html
<h1>Ça marche!</h1>
```

En lançant `node src/index.js`, Metalsmith le combinera avec le layout pour produire le HTML suivant dans `site/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Romaric Pascal</title>
  </head>
  <body>
    <h1>Ça marche</h1>
  </body>
</html>
```

Et voilà! On peut maintenant éditer un unique fichier pour changer quelque chose sur toutes les pages du site. Bien mieux que copier-coller. Prochaine étape, utiliser Markdown, plutôt que HTML, dans les fichiers de contenu. Ça sera plus facile pour écrire, mais ça sera pour le prochain article.
