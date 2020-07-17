---
date: 2020-07-17
title: Revisiter la navigation par langue - Envoyer au bon endroit
slug: revisiter-la-navigation-par-langue-liens
type: post
layout: post.pug
---
Grâce à [l'index construit dans l'article précedent][previous-article], on va maintenant pouvoir envoyer les gens vers le contenu traduit. Le gros du travail est derrière nous, mais il reste quelques détails à régler:

- accéder à l'URL de la page traduite
- lire l'index dans le template
- s'occuper des translation manquantes

Allons-y!

Où envoyer
---

[Le plugin `outputPath`][outputpath-plugin] calcule les chemins où écrire chaque fichier. Ce n'est pas tout à fait leurs URLs. Pour avoir des URLs avec un slash final, la plupart des pages sont écrites dans un fichier `index.html` qui n'apparait pas dans l'URL. `/about-me/index.html` sera servi pour `/about/me`.

Pour s'en occuper rapidement, on peut aussi demander au plugin de calculer une propriété `outputUrl`. Naivement, il peut remplacer le `index.html` final par une chaine de caractère vide, et ça devrait être suffisant pour avancer. Plus tard, cela pourra être déplacé dans un plugin à part, ou peut-être une fonction `url` accessible dans les templates... mais plus tard ;)

A la fin de la fonction `computeOutputPath` du plugin `plugins/outputPath`, on peut rajouter le calcul de cette nouvelle valeur:

```js
// ...
      file.outputPath = outputPath;
      // Entouré d'un `normalize` pour éviter
      // de villains `/./` dans l'URL 
      file.outputUrl = '/' + normalize(outputPath).replace('index.html', '');
// ...
```

Maintenant que chaque fichier porte son URL, on peut se pencher sur comment y accéder dans les templates.

Accessing the translated pages
---

Jusqu'ici, [la navigation par langue boucle sur la liste de langues][language-switcher] et utilise l'URL de la page d'accueil correspondante:

```pug
//- ...
each availableLanguage in languages
  -
    href = language == 'en' ? '/' : `/${language}/`
  //-...
//-...
```

Il faut donc remplacer tout ça par un accès à [l'index `byKeyByLanguage` créé précédemment][previous-article]. On retrouve la clé de traduction dans la propriété `i18n.key` de la page, la langue est fournie par la boucle et nous venons de rajouter l'URL à chaque fichier avec `outputUrl`. On devrait donc tout avoir pour un lien vers les traductions:

```pug
//- ...
each availableLanguage in languages
  -
    href = groups.byKeyByLanguage[i18n.key][language].outputUrl
  //-...
//-...
```

Vite fait, bien fait!... Enfin presque... On aura toujours une valeur pour `groups.byKeyByLanguage[i18n.key]`. La page en cours de rendu sera listée dedans. Mais on a aucune garantie qu'il y aura une entrée pour chaque langue. Accéder directement à `outputUrl` risque de tout faire exploser si une traduction manque. Il faut donc s'en occuper.

Fournir une alternative
---
[L'opérateur de chaînage optionel][optional-chaining-operator] (`?.`) éviterait une erreur ici, mais n'est pas compris par le parseur de Pug. Comme dans le plugin qui indexe les fichiers, on peut utiliser <a href="https://lodash.com/docs/4.17.15#get" hreflang="en">la fonction `get` de Lodash</a> pour accéder à des propriétés en profondeur sans casser si l'un des bouts du chemin manque.

Pour pouvoir l'utiliser dans les templates, il faut d'abord la passers dans les métadonnées globales du site, au sein de `src/index.js`:

```js
//...
.metadata({
  //...
  get: require('lodash/get'),
  //...
})
//...
```

Ce qui permet ensuite de transformer la lecture de l'URL en:

```pug
//- ...
each availableLanguage in languages
  -
    href = get(groups.byKeyByLanguage, [i18n.key, language, 'outputUrl']);
  //-...
//-...
```

On peut enfin ajouter en URL de secours la page d'accueil dans la langue adéquate si la valeur est vide:

```pug
//- ...
each availableLanguage in languages
    -
      href = get(groups.byKeyByLanguage, [i18n.key, language, 'outputUrl']);
      if (!href) { 
        href = language === defaultLanguage ? '/' : `/${language}`  
      }
      //-...
//-...
```

La navigation par langue est maintenant bien plus utiles, passant d'une traduction à l'autre plutôt que d'envoyer à la page d'accueil.

Extra: Balises `<meta>` pour les traductions
---

Améliorer la navigation n'est pas le seul avantage à pouvoir aisément accéder aux pages traduites. Il est maintenant possible de générer des balises `<meta>` pour aider certains moteurs de recherche à associer les contenus traduits.

Avec une boucle similaire à celle de la navigation, on peut ainsi créer une série de balises `<meta rel="alternate">` dans le fichier `layoutes/i18n/_head_links.pug`:

```pug
each language in languages
  //- Only output other translations
  if (language !== i18n.language)
    - let translationUrl = get(groups.byKeyByLanguage, [i18n.key, language, 'outputUrl']);
      if (translationUrl)
        link(rel="alternate",hreflang=language,href=translationUrl)
```

On peut ensuite inclure ce fichier dans la balise `head` du fichier `layouts/site.pug`.

Maintenant que la navigation entre les langues est bien meilleure, que ça soit sur le site où pour les moteurs de recherche, on va pouvoir ajouter plus de contenu. Comme les articles que vous avec lus jusqu'ici. Une dernière étape avant d'arriver à l'état du site à son relancement. Ou plutôt quelques dernières étapes. On commencera à s'y pencher dessus dès le prochain article.

[previous-article]: ../revisiter-la-navigation-par-langue-indexer-les-pages
[outputpath-plugin]:../au-bon-endroit
[language-switcher]:../detecter-la-langue-seconde-passe
[optional-chaining-operator]: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Optional_chaining
