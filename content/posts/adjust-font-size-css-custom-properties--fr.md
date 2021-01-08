---
title: Ajuster la taille de police avec les propriétés personalisées CSS
slug: ajuster-taille-police-proprietes-personalisees-css
date: 2021-01-06
type: post
layout: post.pug
draft: true
---
Lors de l'ajout d'une police spécifique pour un projet, je me suis rendu compte qu'elle rendait le texte bien plus petit que le faisait son fallback `sans-serif`.

<figure class="tint-content">
  <img src="/media/font-size-fallback.jpg" alt="Capture d'écran du projet avec la police de fallback">
  <img class="margin-top--md" src="/media/font-size-bariol.jpg" alt="Capture d'écran avec la police spécifique">
  <figcaption class="no-max-width">
    Avec la police de fallback (première image), le texte est assez grand.
    <br>
    La police spécifique (seconde image) le rend trop petit.
  </figcaption>
</figure>

Ça peut paraître étrange, mais ce n'est pas un bug. Différentes polices peuvent créer un texte de différente taille pour une valeur de `font-size` donnée. Vincent De Oliveira a écrit [une explication très complête sur ce qui se passe][vdo-font-metrics].

Si ça n'avait été qu'un petit écart, j'aurais volontier laissé passer. Mais la police choisie (la jolie [Bariol, par Atipo (en)][atipo-bariol]) rendait le texte bien trop petit pour une utilisation confortable. Regardons donc comment résoudre tout ça!

[vdo-font-metrics]: https://iamvdo.me/blog/css-avance-metriques-des-fontes-line-height-et-vertical-align
[atipo-bariol]: https://www.atipofoundry.com/fonts/bariol

Ajuster la taille de police avec du CSS natif
---

Pour aider avec ce problème, les spécifications [CSS Fonts Module Level 3 (en)][css-fonts-level-3] introduisent `font-size-adjust`. La propriété définit comment mettre à l'échelle la valeur de `font-size` lors du rendu du texte.

Contrairement aux changement de `font-size`, utiliser [`font-size-adjust` ne va pas changer les dimensions exprimées en `em`, ni les `line-height` sans unitées][css-fonts-level-3-font-size-adjust]. Celà permet par exemple, de mettre la police que vous chargez à la même taille (peu ou prou) que celle de fallback sans impacter la taille des icônes dimensionnées pour s'adapter au texte. Attention, `font-size-adjust` affectera par contre les dimensions en `ex` et `ch` (car celles ci sont basées sur les métriques de la police).

La propriété rend également le code plus expressif. Elle décrit "cette police a un rendu trop grand/petit, donc je la met à l'échelle de tant". C'est plus clair que "Je met une taille de police te tant" sans plus d'explications (qu'un commentaire qui ne sera sûrement pas écrit).

C'est bien beau, mais [le support n'est malheureusement pas encore au rendez-vous][mdn-font-size-adjust]. Firefox l'a implémentée depuis un moment déjà, mais Blink la garde derrière l'option <span lang="en">"Experimental web platform features"</span> et [Webkit n'a personne d'assigné au ticket (en)][webkit-font-size-adjust].

En attendant, on peut utiliser les propriétés personalisées pour arriver à quelque chose de proche.

[css-fonts-level-3]: https://drafts.csswg.org/css-fonts-3/
[css-fonts-level-3-font-size-adjust]: https://drafts.csswg.org/css-fonts-3/#font-size-adjust-prop
[webkit-font-size-adjust]: https://bugs.webkit.org/show_bug.cgi?id=15257
[mdn-font-size-adjust]: https://developer.mozilla.org/fr/docs/Web/CSS/font-size-adjust#compatibilit%C3%A9_des_navigateurs

Charger les polices avec JavaScript
---

Le but est de rendre la taille du texte rendu par la police téléchargée proche de celle de la police de fallback. Donc tant que la police n'est pas chargée, on ne veut rien mettre à l'échelle (ni avec `font-size-adjust`, ni avec des propriétés personalisées). Avant de toucher au CSS, préparons donc le terrain en téléchargeant la police avec JavaScript puis en appliquant une class au `<html>` une fois qu'elle est arrivée.

C'est une alternative plus robused que d'utiliser `@font-face` en CSS et [l'événement `document.fonts.onloadingdone` (en)][mdn-font-face-set-events] pour appliquer la classe. Un navigateur qui ne supporterait pas l'API `document.fonts` (ou [n'aurait pas reçu le JavaScript (en)][javascript-everywhere]) ne se retrouvera pas avec un texte dans la bonne police, mais non mis à l'échelle.

Les navigateurs ont maintenant une API pour charger des polices. Elle permet de créer des objets [`FontFace` (en)][mdn-font-face] pour définir les polices comme on le ferait avec `@font-face` en CSS. Elle donne le controle sur quand lancer le chargement et finalement rendre la police disponible en l'ajoutant à `documents.fonts`. Celà permet, par exemple, d'ajouter des conditions supplémentaires pour charger la police, comme éviter un lourd téléchargement si le débit de la connexion est faible.

```js
if (supportsFontLoading() && shouldLoadFonts()) {
  loadFonts();
}

function supportsFontLoading() {
  return 'fonts' in document;
}

function shouldLoadFonts() {
  return !(
    // En l'absence de l'API, impossible de savoir
    // donc autant imaginer que le débit est faible
    navigator.connection &&
    (navigator.connection.saveData || 
      navigator.connection.effectiveType == 'slow-2g' ||
      navigator.connection.effectiveType == '2g')
  );
}

function loadFonts() {
  var font = new FontFace(
    // Un nom différent de celui original de la police évite
    // de rendre le texte avec la police installée sur le poste
    // de l'utilisateur (indétectable) qui afficherait le texte trop petit
    'Remote-Bariol',
    // Mais on peut quand même charger la police locale grâce à la fonction `local`
    "local(Bariol), url(fonts/bariol_regular-webfont.woff2) format('woff2'), url(fonts/bariol_regular-webfont.woff) format('woff')"
  );

  // FontFace.load retourne une `Promise`
  // dont on attend la résolution pour:
  // - ajouter la police au document
  // - et appliquer la classe qui déclenchera la mise à l'échelle
  font.load().then(function(font) {
    document.fonts.add(font);
    document.documentElement.classList.add('font-loaded--bariol');
  });
}
```

[mdn-font-face-set-events]: https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet#events
[javascript-everywhere]: https://kryogenix.org/code/browser/everyonehasjs.html
[mdn-font-face]: https://developer.mozilla.org/en-US/docs/Web/API/FontFace

Ajuster la taille de police avec les propriétés personalisées
---

Maintenant que l'on sait quand la police est chargée, on peut s'attaquer au CSS. Enfin! (désolé pour l'attente).

### Configurer la mise à l'échelle

Avec une propriété `--font-size-scale`, on va exprimer la même idée que `font-size-adjust`: une valeur pour mettre à l'échelle la valeur définie par `font-size`. Une fois la police chargée, les règles qui appliquent `font-family` avec la police "problématique" changeront sa valeur comme nécessaire.

```css
:root {
  /* 
    La mise à l'échelle se fait par multiplication (spoiler!)
    donc on initialise la propriété a 1
  */
  --font-size-scale: 1;

  /* 
    Comme le facteur sera sûrement appliqué
    dans différentes règles, on peut utiliser
    une propriété clairement nommée pour stocker
    l'ajustement
  */
  --font-size-scale--bariol: 1.25;

  /* 
    Et définir autant de propriétés que necessaire
    si plusieurs polices demandent un ajustement
    --font-size-scale--another-font: 0.75; 
  */
}

.font-family--bariol,
h1,
.h1 {
  /* 
    On utilise le nom défini lors du chargement
    pour éviter de se retrouver avec la police
    locale sans le savoir
  */
  font-family: Remote-Bariol, sans-serif;
}

.font-loaded--bariol .font-family--bariol,
.font-loaded--bariol h1,
.font-loaded--bariol .h1 {
  /*
    Pour tous ces sélécteurs qui appliquent la police,
    on ajuste la variable une fois la police chargée.
  */
  --font-size-scale: var(--font-size-scale--bariol, 1);
}
```

Mais il faut aussi prendre en compte les règles qui appliquent des polices qui n'ont pas besoin de mise à l'échelle. Les éléments enfants vont hériter de la valeur de la propriété `--font-size-scale` de leurs parents. Si les règles appliquant des polices qui ne doivent pas mises à l'échelle ne remettent pas la valeur à `1`, le texte sera aggrandi ou rétréci inutilement.

```css
.font-family--does-not-need-scaling {
  font-family: serif;

  --font-size-scale: 1;
}
```

### Appliquer la mise à l'échelle

Chaque changement de `font-family` est maintenant accompagné d'une déclarations `--font-size-scale`. On va donc pouvoir s'en servir pour ajuster la taille de police.

Première chose à faire: remplacer toutes les déclarations `font-size` en `rem` avec le calcul de mise à l'échelle. Il faudra également en rajouter une initiale sur l'élément `<body>` pour permettre à la taille du texte d'être ajustée globalement. Attention, pas sur l'élément `<html>`, car celà affecterait toutes les autres dimensions déclarées en `rem`, par exemple pour l'espacement.

Techniquement, il faudrait aussi appliquer la mise à l'échelle aux unités absolues, comme `px`. L'unité `rem` étant préférable pour permettre aux utilisateurs d'appliquer la taille de police dont ils ont besoin avec une feuille de style utilisateur, on ne va pas toucher aux unités absolues. Celà permettra de révéler des choix d'unités malencontreux.

Pour ce qui est des `em` et autre unités relatives à la taille de police "locale" (`ex`,`ch`), on en parlera juste après.

```css
body {
  font-size: calc(1rem * var(--font-size-scale, 1));
}

h1 {
  font-size: calc(2rem * var(--font-size-scale, 1));
}
```

### Compenser la mise à l'échelle

En évitant de toucher à la taille de police du `<html>`, on n'affecte pas les dimensions exprimées en `rem`. Par contre, celles exprimées en `em`, `ch`, `ex`, ainsi que la propriété `line-height` vont être impactées.

Pour reproduire le même comportement que `font-size-adjust`, les propriétés utilisant `em` et les `line-height` sans unités vont devoir appliquer un calcul inverse pour conserver la bonne valeur.

```css
h1 {
  font-size: calc(2rem * var(--font-size-scale, 1));
  line-height: calc(1.5 / var(--font-size-scale, 1));
  padding: calc(1.2em / var(--font-size-scale, 1));
}
```

La propriété `font-size`, lorsqu'elle est exprimée en `em`, demande un fonctionnement un peu différent:

- si le texte défini en `em` est de la même police que l'élément ancêtre auquel se rapportent les `em`, il faudra laisser la taille en `em` telle quelle, la mise à l'échelle est déja appliquée
- s'ils sont de polices différentes, il faudra appliquer un calcul légérement différent pour tenir en compte de l'échelle des deux polices:

  ```css
  font-size: calc(1em / var(--font-size-scale--font-of-ancestor, 1) * var(--font-size-scale, 1))
  ```

S'outiller un peu
---

Gérer tout ça a la main, c'est jouable, mais pas très fun et on peut rapidement faire des erreurs. [Sass (en)][sass] permet de réduire un peu le travail de deux façons.

### Suivre quelles règles ont besoin de `--font-size-scale`

Il y aura surement plus d'un sélecteur qui appliqueront une police ayant besoin de mise à l'échelle, et ils seront rarement dans le même fichier. Facile donc d'en oublier quelques un lors qu'on va rajouter `--font-size-scale`.

Avec `@extend` et des [sélecteurs "placeholders" (en)][sass-placeholder-selectors], Sass peut s'en charger pour nous.

```scss
// Le sélecteur "placeholder" va collecter
// les sélecteurs qui appliquent la `font-family`
%font-family--bariol {
  font-family: Remote-Bariol, sans-serif;
}

// Il sera utilisé à la place de la déclaration `font-family`
.font-family--bariol {
  @extend %font-family--bariol;
}

h1,
.h1 {
  @extend %font-family--bariol;
}

.font-loaded--bariol {
  // Cette règle va inscrire chaque sélecteur collecté par le placeholder.
  // Même ceux écrits après. Ici, il créera:
  //   .font-loaded--bariol .font-family--bariol,
  //   .font-loaded--bariol h1,
  //   .font-loaded--bariol .h1
  %font-family--bariol {
    --font-size-scale: $font-size-scale--bariol;
  }
}
```

### Aider à écrire les calculs de mise à l'échelle

Pas qu'elles soient très compliquées en soient, les formules de mise à l'échelle ne sont pas très pratiques à écrire. Une fonction Sass permet de donner un peu de légéreté et de lisibilité au code (attention, code pas trop testé, à utiliser à vos risques et périls):

```scss
@function font-size-scalable($value, $scale-back-factor: null) {
    // Pour mettre à l'échelle les `rem`
    @if (unit($value) == rem) {
        @return #{"calc(#{$value} * var(--font-size-scale, 1))"};
    }
    // Pour les tailles de police en `em`
    @if ($scale-back-factor) {
        @return #{"calc(#{$value} / #{$scale-back-factor} * var(--font-size-scale, 1))"};
    }
    // Pour les autres propriétés en `em` ou sans unités
    @if (unit($value) == em or unit($value) == "") {
        @return #{"calc(#{$value} / var(--font-size-scale, 1))"};
    }
    @return $value;
}

body {
  font-size: font-size-scalable(1rem);
}

h1 {
  font-size: font-size-scalable(2rem);
  line-height: font-size-scalable(1.5);
  padding: font-size-scalable(0.75em);
}

.font-size-in-em-needing-adjustment {
    font-size: font-size-scalable(1em, var(--font-size-scale--font-of-parent,1));
}
```

Ça laisse encore de la place pour oublier d'utiliser le placeholder ou la fonction, mais c'est déja moins de `calc` à écrire à la main et surtout plus de liste de sélecteurs à garder en tête.

Au final, le mieux serait sûrement un plugin [PostCSS (en)][postcss] qui:

- détecterait automatiquement l'usage de `font-size` (et `font`) en `rem` pour le les mettre à l'échelle, et celui de dimensions en `em` sur d'autres propriétés (ainsi que `line-height` sans unités) pour compenser celle-ci
- suivrait quelles règles appliquent `font-family` (et `font`) pour générer automatiquement les propriétés `--font-size-scale` appropriées.

Tout un projet, donc... peut-être un jour ;) En attentant, ça restera à la main, ou avec SASS. Il reste aussi la possibilité d'éditer les fichiers de la police. Mais il faut pour cela les avoir sous la main et que leur license permette de telles modifications, ce qui n'est pas forcément le cas.

[PostCSS]: https://postcss.org
[Sass]: https://sass-lang.com
[sass-placeholder-selectors]: https://sass-lang.com/documentation/style-rules/placeholder-selectors
