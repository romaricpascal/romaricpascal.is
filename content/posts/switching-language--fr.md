---
date: 2020-06-10
title: Passer d'une langue à l'autre
slug: passer-d-une-langue-a-l-autre
type: post
layout: post.pug
---
Maintenant que la page d'accueil est écrite en deux langues différentes, c'est l'occasion de démarrer le travail sur la navigation entre ces deux versions. Le contenu encore limité du site permettra de se concentrer sur les bases de la fonctionnalité puis de l'améliorer lorsque d'autre pages seront disponibles.

Un lien vers la version traduite
---

Les personnes à la recherche du contenu dans une langue spécifique chercheront surement son nom dans cette langue, plutôt que celle de la page. Le HTML devra indiquer que ce contenu est dans une langue différente, grâce à l'attribut `lang`. Le contenu de la page ciblée sera également dans une autre langue, qu'il faudra indiquer avec l'attribut `hreflang`.

Étant donné [les styles mis en places précédemment][hreflang-styling], la présence de cet attribut `hreflang` va entraîner l'ajout de contenu par le CSS. C'est superflu ici car le label du lien clarifie déjà la langue de destination. C'est justement pour cette situation que le sélecteur qui ajoute le contenu comporte un `:not(.no-hreflang)`. Cela permet de facilement éviter le `(en)` généré en ajoutant au lien la classe `no-hreflang`.

Cela donne donc, pour le lien menant à la version anglaise:

```html
<a href="/" lang="en" hreflang="en" class="no-hreflang">English<a>
```

Marquer le lien courant
---

Pour garder les même liens entre les pages de chaque langue, j'ai choisi d'afficher les liens des deux langues de partout. Mieux vaut donc indiquer à l'utilisateur lequel représente la langue courante.

Il serait tentant de juste ajouter une classe CSS et d'en rester là. Mais il est possible d'améliorer la sémantique du balisage, grâce à <a href="https://tink.uk/using-the-aria-current-attribute/" hreflang="en">l'attribut `aria-current`</a>. Ainsi, non seulement la version courante sera visible à l'écran, mais également transmises aux technologies d'assistance:

```html
<a href="/fr/" aria-current="page">Français<a>
```

Cette balise permettra d'attacher des styles spécifiques avec le sélecteur `[aria-current]` pour indiquer quelle lien mène a la langue courante. (Et vu que le lien et le contenu pointé sont le même que la page, les attributs `lang` et `hreflang` peuvent être évités)

Grouper tout ça dans un composant
---

Les deux liens précédents sont vraiment statique. La page en anglais devra inverser les attributs pour chaque lien.

Comme il s'agit d'une fonctionnalité bien délimitée, on peut l'isoler dans son propre template. Et ensute l'inclure dans le layout  `site.pug` pour la partager sur toutes les pages du site:

```pug
//- ...
body
  header
    include i18n/_language_switcher.pug
//- ...
```

Le component en lui-même aura besoin de quelques données:

1. la langue de la page courante
2. les langues supportées sur le site
3. l'intitulé des liens pour chaque langue
4. un nom accessible, dans chaque langue également, pour la balise `<nav>`

La première contrainte est déjà couverte par [la variable `language` introduite précédemment][language-variable]. Les trois autres, en revanchent, demande de passer de nouvelles données. Mais contrairement à `language`, celles ci sont partagées par tout le site. Ce que Metalsmith permet de mettre en place grâce à sa fonction `metadata()`.

```js
// ...
.destination('./site')
.metadata({
  languages: ['en', 'fr'],
  messages: {
    languageSwitcher: {
      en: 'English',
      fr: 'Français'
    },
    languageSwitcherLabel: {
      en: 'Languages',
      fr: 'Langues'
    },
  })
// ...
```

Une fois en place, elles peuvent être utilisées par le template du composant, `layouts/i18n/_language_switcher.pug`:
```pug
//- `aria-labelledby` plutôt que `aria-label` car ce dernier
//- n'est pas toujours traduit par les navigateurs et applications
//- (en anglais) https://adrianroselli.com/2019/11/aria-label-does-not-translate.html
nav.language-switcher(aria-labelledby="languageSwitcherHeading")
  h2#languageSwitcherHeading(hidden="")= messages.languageSwitcherLabel[language]
  each availableLanguage in languages
    -
      href = language == 'en' ? '/' : `/${language}/`
      currentAttr = language === availableLanguage ? 'page' : null
    //- Pug supprime l'espace entre ses balises par défaut
    = ' '
    a.no-hreflang(href=href,
      hreflang=language,
      lang=language
      aria-current=currentAttr)
      = messages.languageSwitcher[language]
```

Ça fait un bon début pour la navigation entre les langues. Avec l'ajout de nouvelles pages, il faudra revenir dessus comme il est préférable d'envoyer vers la version traduite plutôt que la page d'accueil. Mais pour ça, il faut d'autres pages, ce qui sera l'objet de la prochaine étape... et des articles à venir.

[language-variable]:../premiers-pas-vers-l-internationalisation/#décrire-la-langue-du-contenu-dans-le-html
[hreflang-styling]:../premiers-pas-vers-l-internationalisation/#des-liens-en-dautre-langue
