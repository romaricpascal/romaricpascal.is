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

En attendant, on peut utiliser les propriétés personalisées pour arriver plus ou moins au même résultat.

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
    // de l'utilisateur (ce que l'on ne peut pas détecter)
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

Adjusting the font-size with custom properties
---

Now we know when the font is loaded, we can tackle the CSS. Sorry for the wait!

### Configuring the scaling

With a custom `--font-size-scale` property, we can express a similar concept to `font-size-adjust`. Once the font is loaded rules setting the `font-family` property to the "problematic" font will adjust its value as needed.

```css
:root {
  /* 
    Scaling will happen through multiplication (spoiler!)
    so we'll initialise it to 1
  */
  --font-size-scale: 1;

  /* 
    As the scaling factor for specific fonts
    will likely be applied in more than one place,
    it's worth storing them in their own properties
  */
  --font-size-scale--bariol: 1.25;

  /* --font-size-scale--another-font: 0.75; */
}

.font-family--bariol,
h1,
.h1 {
  /* 
    Use the custom name to avoid picking up installed fonts
    without detecting their loading
  */
  font-family: Remote-Bariol, sans-serif;
}

.font-loaded--bariol .font-family--bariol,
.font-loaded--bariol h1,
.font-loaded--bariol .h1 {
  /*
    Apply a different scale for the font
    once loaded
  */
  --font-size-scale: var(--font-size-scale--bariol, 1);
}
```

But we also need to take care of rules setting a `font-family` that does not need scaling. Child elements will inherit the custom property value from their parents. If font stacks that do not need scaling don't reset the factor to `1`, they'll get blown up or shrunk when they didn't need to.

```css
.font-family--does-not-need-scaling {
  font-family: serif;

  --font-size-scale: 1;
}
```

### Applying the scaling

Now each `font-family` is accompanied by its corresponding `--font-size-scale`,
we can start using the property to adjust the font size. First step is replacing all the `font-size` properties set in `rem` with the scaling computation.

We'll also want to scale the font-size of the `<body>` element too. Not the `<html>` one as it'd affect the value of all `rem` lengths, possibly used for spacing and what not.

Technically, we'd also want to apply the same computation to absolute units, like `px`. But `rem`s should be preferred to allow users to set the font-size they need via user stylesheets, so we'll leave them out. This'll have the nice side effect of revealling poor choices of unit.

```css
body {
  font-size: calc(1rem * var(--font-size-scale, 1));
}

h1 {
  font-size: calc(2rem * var(--font-size-scale, 1));
}
```

### Reverting the scaling

Avoiding to touch the font-size of the `<html>` element, safeguarded any length expressed in `rem`. Tweaking the `font-size` of elements will change any length set in `em`, `ch`, `ex`, though, as well as relative or unitless `line-height`. To match `font-size-adjust`, properties using `em` and unitless `line-height` will need to run the inverse computation to be scaled back to their proper value.

```css
h1 {
  font-size: calc(2rem * var(--font-size-scale, 1));
  line-height: calc(1.5 / var(--font-size-scale, 1));
  padding: calc(1.2em / var(--font-size-scale, 1));
}
```

Tooling up
---

Handling all this manually is doable, but cumbersome and error prone. [SASS]
can aleviate a bit of the burden in two ways.

### Tracking which selectors need to get the `--font-size-scale` property

There'll likely be more than one selector setting the problematic `font-family`. Placeholder classes and `@extend` can help spread the application of `font-family` and the `--font-size-scale` properties once the font is loaded.

```scss
// The placeholder class will "collect" all the selectors
// applying the font-family
%font-family--bariol {
  font-family: Remote-Bariol, sans-serif;
}

// Instead of applying the `font-family` property
// rules use `@extend`
.font-family--bariol {
  @extend %font-family--bariol;
}

h1,
.h1 {
  @extend %font-family--bariol;
}

.font-loaded--bariol {
  // This'll output all the selectors "collected" by the placeholder class.
  // Even those written after. Here it'll generate:
  //   .font-loaded--bariol .font-family--bariol,
  //   .font-loaded--bariol h1,
  //   .font-loaded--bariol .h1
  %font-family--bariol {
    --font-size-scale: $font-size-scale--bariol;
  }
}
```

### Helping write lenghts that get scaled

A function like the following one could also help with applying the scaling (use with caution, it's very lightly tested):

```scss
@function font-size-scalable($value) {
  // Scale rems
  @if (unit($value) == rem) {
    @return #{"calc(#{$value} * var(--font-size-scale, 1))"};
  } 
  // Revert scaling for ems, chs, exs and unitless
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
```

There's still room for forgetting to use the placeholder or the function, but that's already less `calc` formulas to write manually, and no list of selector to keep track of.

Ultimately, a [PostCSS] plugin would be ideal to reduce the burden even more:

- pick up automatically the use of `rem` lengths for `font-size` (and `font`) to scale them, and the use of `em` lengths and unitless `line-height` to scale them down
- track the use of `font-family` (and `font`) to automatically generate extra selectors for setting `--font-size-scale` once the font is loaded

That's its own bulk of work, though... maybe one day ;) In the meantime, it's SASS or manually writing the right properties. Oh, and there's always the option to tweak the font files too. But that means having them at hand and their license allowing such tampering, which is not always the case.

[PostCSS]: https://postcss.org
[SASS]: https://sass-lang.com
