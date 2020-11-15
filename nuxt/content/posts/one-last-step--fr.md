---
title: Une dernière étape
slug: une-derniere-etape
date: 2020-08-13
type: post
layout: post.pug
---
La dernière étape avant réouverture est d'ajouter un flux RSS, pour aider les gens à suivre les nouveaux articles. Le <a href="https://www.npmjs.com/package/rss" hreflang="en">package `rss`</a> semble être le principal pour générer ces flux avec Node. Il se charge de créer les bonnes balises, dans la bonne structure, ce qui simplifie beaucoup la tâche.

Malheureusement, Pug ne permet pas de l'importer dans les templates. Et je préférerai avoir un fichier correspondant dans le dossier `content`, plutôt qu'un plugin fasse magiquement apparaitre une page.

<a href="https://www.npmjs.com/package/jstransformer-function" hreflang="en">`jstransformer-function`</a> permet justement cela: un template qui execute du code JavaScript. Une fois installé, en même temps que `rss`, avec`npm i jstransformer-function rss`, on peut créer deux fichiers identiques: `content/feed.xml.function` and `content/feed--fr.xml.function`. L'extension `.function` sera supprimée par `metalsmith-in-place` pour créer les page `/feed.xml` and `/fr/feed.xml` respectively.

A l'intérieur, on va pouvoir [récupérer la list d'articles comme sur le site][list-articles] et les fournir au package `rss` qui fera le gros du travail. Il faudra seulement corriger un petit souci de data. Le package `rss` définit la `lastBuildDate` à la date de génération du flux, plutot que celle du contenu le plus récent. Un expression régulière fera l'affaire pour le remplacement.

Et n'oublions pas de désactiver le layout, sans quoi ce flux XML se retrouverait entouré de la coquille HTML qu'on trouve sur chaque page. Oups.

```js
---
layout: false
---
const RSS = require('rss');

const posts = [...(this.groups.byLanguageByType[this.i18n.language]['post'] || [])].sort(function(a, b) {
  return b.date - a.date
})

const feed = new RSS({
  title: this.siteTitle,
  site_url: this.siteUrl,
  feed_url: `${this.siteUrl}${this.outputUrl}`,
  author: 'hello@romaricpascal.is',
  language: this.i18n.language
})

posts.forEach(post => {
  feed.item({
    title: post.title,
    url: `${this.siteUrl}${post.outputUrl}`,
    date: post.date
  })
})

return feed.xml().replace(/<lastBuildDate>.*<\/lastBuildDate>/, `<lastBuildDate>${posts[0].date.toUTCString()}</lastBuildDate>`);
```

Clap de fin (temporaire)
---

C'était la dernière fonctionalité ajoutée au site avant sa relance. 

Cette reconstruction m'a bien aidé à clarifier à quelles parties faire attention lors de l'internationalisation d'un site ([messages][i18n-messages], [dates][i18n-dates], [changement de langue][i18n-language-switching],[URLs et structure des fichiers][i18n-file-structure]). Utiliser Metlasmith m'aura également donné un controle total sur le processus de génération de pages (collection du contenu, calcul de métadonnées supplémentaires, groupes/indexation, génération de page et finallement leur rendu). C'était bien pour expérimenter, pas forcément la méthode la plus rapide.

Décrire cette reconstruction (après, plutôt que pendant comme prévu) aura permis de découvrir plein de petites améliorations à apporter à l'implémentation original. Et le design simple aura aussi permis de présenter quelques patterns CSS ([combinateur de voisin direct][css-adjacent-sibling], [marges négatives][css-negative-margins], [colonne centrée][css-centred-column], [bordures partielles][css-partial-borders]) et d'accessibilité ([titres][a11y-headings],[landmarks][a11y-landmarks], [skip-links][a11y-skip-links]), des détails auxquels je suis attaché. Le design à venir devrait donner encore plus à discuter sur ces aspects.

J'espère que suivre cette aventure vous a plu. Si vous avez des questions ou commentaires, m'hésitez pas à m'en faire part sur [Twitter][twitter] ou par [email][email]. Les articles à venir vont laisser le site de côté quelques temps, histoire de lui donner un joli design dont je pourrais détailler l'implémentation. Pas question de s'arrêter par contre, il y en aura de nouveaux (et il y a même un [flux RSS][feed] pour en être averti ;)). À bientôt!

[list-articles]: ../lister-les-articles/
[twitter]: https://twitter.com/romaricpascal
[email]: mailto:hello@romaricpascal.is
[feed]: /fr/feed.xml
[i18n-messages]: ../passer-d-une-langue-a-l-autre/#grouper-tout-ça-dans-un-composant
[i18n-file-structure]: ../au-bon-endroit/
[i18n-dates]: ../internationaliser-dates-en-javascript/
[i18n-language-switching]: ../revisiter-la-navigation-par-langue-liens/
[i18n-urls]: ../au-bon-endroit/
[css-adjacent-sibling]: ../les-joies-du-combinateur-de-voisin-direct/
[css-negative-margins]: ../les-marges-negatives-sont-nos-amies/
[css-centered-column]: ../colonne-centree-en-css/
[css-partial-borders]: ../styler-liste-articles/#dessiner-les-séparateurs
[a11y-headings]: ../une-base-accessible-les-titres/
[a11y-landmarks]: ../une-base-accessible-les-landmarks/
[a11y-skip-links]: ../des-bases-accessibles-les-liens-d'evitement/
[npm-jstransformer-function]: https://www.npmjs.com/package/jstransformer-function
[npm-rss]: https://www.npmjs.com/package/rss
