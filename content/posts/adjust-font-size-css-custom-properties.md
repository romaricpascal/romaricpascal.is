---
title: Adjust font size with CSS custom properties
date: 2021-01-06
type: post
layout: post.pug
draft: true
---
As I was setting up a custom font on a side project, I realised that it was making the text much smaller than the default `sans-serif` used as a fallback.

<figure class="tint-content">
  <img src="/media/font-size-fallback.jpg" alt="Screeshot of the project using the fallback font.">
  <img class="margin-top--md" src="/media/font-size-bariol.jpg" alt="Screenshot of the project using the custom font.">
  <figcaption class="no-max-width">
    With the fallback font (first image), the app has large enough text.
    <br>
    The custom font (second image)makes it way too small.
  </figcaption>
</figure>

Having different fonts render text with different height for a given `font-size` is part of how things work. Vincent De Oliveira wrote a [comprehensive explanation of what happens behind the scene][vdo-font-metrics].
If it was just a small shift, I could have lived with it. But the custom font (the lovely [Bariol by Atipo][atipo-bariol]) was making things too small to be comfortable, so let's see what can be done!

[vdo-font-metrics]: https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align
[atipo-bariol]: https://www.atipofoundry.com/fonts/bariol

Adjusting font-size with native CSS
---

To help handling the issue, the [CSS Fonts Module Level 3][css-fonts-level-3] introduces `font-size-adjust`. The property defines how to scale the value of `font-size` when rendering the text.

Unlike changing `font-size`, using [`font-size-adjust` will not mess with lengths expressed in `em`, nor with unitless `line-height` values][css-fonts-level-3-font-size-adjust]. This means bringing the font you load to the same(ish) size as its fallback won't scale the icons you took care to size relative to the font size. It will affect lengths in `ex` and `ch` though (as they're based on the font metrics of the applied font).

It also makes the code more expressive. The property describes "this font renders too small/large so I'll scale by X". It makes things much clearer than "I need a new font size of Y" without much more explanation (than a comment that'll likely be not written).

Only hiccup, [support is widespread there yet][mdn-font-size-adjust]. Firefox has been supporting it for a while, but Blink browsers hold it behind the "Experimental web platform features" flag and [Webkit has no one assigned to the issue][webkit-font-size-adjust].

In the meantime, we can use CSS custom properties to get something close.

[css-fonts-level-3]: https://drafts.csswg.org/css-fonts-3/
[css-fonts-level-3-font-size-adjust]: https://drafts.csswg.org/css-fonts-3/#font-size-adjust-prop
[webkit-font-size-adjust]: https://bugs.webkit.org/show_bug.cgi?id=15257
[mdn-font-size-adjust]: https://developer.mozilla.org/en-US/docs/Web/CSS/font-size-adjust#browser_compatibility

Loading fonts with JavaScript
---

The aim is to make the loaded font match the fallback font's height. So until that final font is loaded, we don't want to be scaling anything (either through `font-size-adjust` or custom properties). Before we get to the CSS, let's take care of that by loading the fonts using JavaScript and set a class on the `<html>` element when they're done.

This provides a more robust alternative to using `@font-face` in CSS and [the `document.fonts.onloadingdone` event][mdn-font-face-set-events]. Browsers that wouldn't support the `document.fonts` API (or that [JavaScript would have failed to reach][javascript-everywhere]) won't end up with the tiny font loaded and no adjustment.

Browsers offer a native API for loading fonts, letting you create [`FontFace`][mdn-font-face] objects to define fonts similarly to how you would with `@font-face` in CSS. You control when you start loading them and finally add them to `documents.fonts` so they can be used for rendering. This allows to add extra conditions to when the font loads, for example avoiding to load them over a poor network connection.

```js
if (supportsFontLoading() && shouldLoadFonts()) {
  loadFonts();
}

function supportsFontLoading() {
  return 'fonts' in document;
}

function shouldLoadFonts() {
  return !(
    // In the abscense of navigator.connection
    // we can't say if the connection is good or not
    // so best treat it as if it's not
    navigator.connection &&
    (navigator.connection.saveData || 
      navigator.connection.effectiveType == 'slow-2g' ||
      navigator.connection.effectiveType == '2g')
  );
}

function loadFonts() {
  var font = new FontFace(
    // Using a custom name will avoid showing unscaled text
    // to users that would have the font installed on their machines
    'Remote-Bariol',
    // But we can still look up for installed fonts using the `local` function
    "local(Bariol), url(fonts/bariol_regular-webfont.woff2) format('woff2'), url(fonts/bariol_regular-webfont.woff) format('woff')"
  );

  // FontFace.load returns a promise that resolves
  // once the font is loaded, which we can use to
  // - add the font to our document
  // - and set the class that'll trigger the font-size adjustment
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

  /* 
    And we can create as many properties
    to store scaling factors as there are
    fonts needing adjustments
    --font-size-scale--another-font: 0.75; 
  */
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

There's also `em`s and the other units relative to the "local" font size (`ex`,`ch`), but we'll talk about them right after.

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

When it's `font-size` that's expressed in `em`, things are a little different:

- if the text set in `em` has the same font as the ancestor element the `em` refer to, we'll need to leave the size in `em` as is. The scaling is already applied.
- if they're different, it's another computation that needs applying, to account for the scaling needed by both the font of the element and the ancestor the `em` refer to:

  ```css
  font-size: calc(1em / var(--font-size-scale--font-of-ancestor, 1) * var(--font-size-scale, 1))
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
@function font-size-scalable($value, $scale-back-factor: null) {
    // For scaling the `rem`
    @if (unit($value) == rem) {
        @return #{"calc(#{$value} * var(--font-size-scale, 1))"};
    }
    // For scaling back `em` for `font-size`
    @if ($scale-back-factor) {
        @return #{"calc(#{$value} / #{$scale-back-factor} * var(--font-size-scale, 1))"};
    }
    // For other properties in `em` or unitless
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

There's still room for forgetting to use the placeholder or the function, but that's already less `calc` formulas to write manually, and no list of selector to keep track of.

Ultimately, a [PostCSS] plugin would be ideal to reduce the burden even more:

- pick up automatically the use of `rem` lengths for `font-size` (and `font`) to scale them, and the use of `em` lengths and unitless `line-height` to scale them down
- track the use of `font-family` (and `font`) to automatically generate extra selectors for setting `--font-size-scale` once the font is loaded

That's its own bulk of work, though... maybe one day ;) In the meantime, it's SASS or manually writing the right properties. Oh, and there's always the option to tweak the font files too. But that means having them at hand and their license allowing such tampering, which is not always the case.

[PostCSS]: https://postcss.org
[SASS]: https://sass-lang.com
