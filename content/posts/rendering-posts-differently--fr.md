---
date: 2020-07-30
title: Afficher les articles différemment
slug: afficher-les-articles-differemment
type: post
layout: post.pug
---
Les articles, ou posts comme j'ai eu le malheur de les appeler lors du développement (et donc comme ils seront nommés dans le code à suivre), ont besoin d'une mise en page différente des autres pages. Non seulement l'en-tête et le pied de page du site doivent rester cohérent avec le reste, mais la structure du contenu doit le rester d'un article à l'autre: titre, date et texte de l'article en lui-même.

Voyons donc comment s'en charger!

Choisir un layout différent
---

Le layout des pages est pris en charge par le plugin `metalsmith-layout`. Il offre une option pour choisir un layout spécifique pour un contenu donné. Pour celà, il faut lui faire porter une propriété `layout` indiquant quel gabarit utiliser. Ce que l'on peut faire dans le front-matter de chaque post:

```md
---
layout: post.pug
---
```

Et voilà! Ça pourrait être plus automatisé plus tard, par exemple en assignant ce layout en fonction du chemin du fichier. Mais pour le moment, ça sera suffisant pour relancer le site. Les articles auront leur propre layout… enfin une fois que ce fichier `layouts/post.pug` existera.

Réutiliser les layouts
---

Le layout du site est déjà défini dans le gabarit `layouts/site.pug`. Grâce à <a href="https://pugjs.org/language/inheritance.html" hreflang="en">l'extensibilité de Pug</a> (comme beaucoup de langages de template), on va pouvoir le réutiliser pour créer le layout spécifique aux articles. Celà assurera que des changements qui doivent toucher tout le site toucheront aussi les pages d'articles, sans avoir à éditer différents fichiers (surtout si le nombre de layouts vennait à grandir).

Il faut dans un premier temps modifier le gabarit du site. Jusqu'ici il affiche simplement le contenu de chaque page dans le `<body>`:

```pug
//- layouts/site.pug
//- ...
body
  != contents
//- ...
```

Pour permettre à d'autres gabarits de choisir quoi afficher dans le `<body>`, il va lui falloir définir un `block` (appelons le `contents`) qu'ils rempliront. Si aucun contenu n'est fournit (comme lorsque le gabarit est utilisé tel quel pour les pages "normales"), il continuera d'afficher le contenu de la page, comme jusqu'alors:


```pug
//- layouts/site.pug
//- ...
body
  block contents
    != contents
//-...
```

Maintenant que le gabarit du site est prêt, on peut créer le fichier `layouts/post.pug` qui donnera une structure commune à tous les articles:

1. Titre
2. Date (pour le moment, on va la laisser de côté pour un futur article)
3. Contenu de l'article

```pug
//- layouts/posts.pug

//- Réutilise le gabarit `site.pug`
//- Notez l'absence de l'extension `.pug`
extend site

//- Fournit au gabarit parent le block `contents`
block contents
  h1= title
  //- Date will come here in a future article ;)
  != contents
```

Le gabarit peut donc maintenant être utilisé pour afficher les articles. Son code implique deux contraintes pour les fichiers qui stockeront les articles:

1. Ils devront fournir une propriété `title`, qui sera utilisé pour créer la balise `<h1>`
2. Ça signifie que les titres au sein du Markdown devront commencer au second niveau (`##`, ou soulignés par `---` au lieu de `===`)

On peut d'ailleurs tirer profit de cette nouvelle propriété `title` pour corriger un petit quelque chose: mettre à jour le titre qui apparaîtra dans l'onglet du navigateur.

Mettre à jour le titre
---

Lors de la création du layout du site, le titre du document avait été laissé de côté avec la promesse d'y revenir plus tard. Plus tard, c'est donc maintenant. On va pouvoir donner à chaque page un titre unique. C'est très important car celà permet aux personnes d'identifier sur quelle page iels se trouvent.

Comme celà touche tout le site, la modification se fera dans le fichier `layouts/site.pug`. On va préfixer le contenu de la balise `<title>` avec cette nouvelle propriété `title`, si elle existe.

```pug
//- ...
//- Remplace `title Romaric Pascal`
title
  if title
    = title
    = ' - ' //- Pour s'assurer qu'il y ait des espaces autour
  = "Romaric Pascal" //- Sinon, Pug tente de créer un tag `<Romaric>`
//- ...
```

On a donc donner aux articles un layout spécifique, et au passage corrigé <a href="https://www.w3.org/TR/WCAG21/#page-titled" hreflang="en">un soucis d'accessibilité basique</a>. Reste à afficher la date des articles, ce qui sera le sujet du prochain, l'internationalisation amenant son lot de défis ici.

[shared-layout]: ../layout-partage/
