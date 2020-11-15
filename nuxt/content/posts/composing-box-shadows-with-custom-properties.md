---
title: Composing box shadows with custom properties
date: 2020-10-17
type: post
layout: post.pug
---
[`box-shadow`][mdn-box-shadow] supports having a list of shadow definitions. However when different classes both apply a `box-shadow` property, the shadows don't get composed with each other. Only the declaration of the one with the highest specificity wins:

```css
.box-shadow--elevation-1 {
  box-shadow: 0 0.125rem rgba(0,0,0,0.2);
}

input:focus {
  box-shadow: 0 0 0.25rem var(--primary);
}
```

```html
<label for="input">Focus me and I'll lose my drop shadow</label>
<input id="input" class="box-shadow--elevation-1">
```

In this example, the input will lose its drop shadow when it receives the focus :( [As Sarah Dayan points out][initial-tweet], this makes the property not super friendly for a system of utility classes:

- Maybe having a set of classes to control elevation,
- but also allow use the shadows for a nicely rounded outline for the focus (don't forget to cater for Windows High contrast mode in that case ;)),
- or also have another set to give a little shadow inside for a subtle 3d effect
- …

```html
<p class="box-shadow--elevation-1 box-shadow--inset">
  Could this paragraph have a drop shadow that lifts it up a bit,
  as well as a little shadow inside, please?
</p> 
```

[CSS Custom properties][mdn-custom-properties] can help a lot towards that, provided we're happy with composing **a limited number of shadows**. Given utility classes are there to provide a system of limited reusable pieces, that shouldn't be too much of a limitation though. Likely we'd want a shadow outside for the elevation, one for the outline, one for an inset shadow (and maybe one for an inside line), but not many more.

A starting point
---

Transparent box-shadows won't show, so as a starting point we can imagine setting custom properties for each of the shadow's color, to be tuned by the utility classes. Oh and let's not forget the x & y offset, the blur and the spread parameters:

```css
[class*="box-shadow"] {
  /*
    Avoid properties set on parent elements
    to affect elements with `box-shadow--...` classes.
  */
  --box-shadow__inset-x: 0;
  --box-shadow__inset-y: 0;
  --box-shadow__inset-blur: 0;
  --box-shadow__inset-spread: 0;
  --box-shadow__inset-color: transparent;
  /* 
    repeat for 
    `--box-shadow__outline-...`
    `--box-shadow__elevation-...` 
  */
  box-shadow: 
    var(--box-shadow__inset-x) var(--box-shadow__inset-y) var(--box-shadow__inset-blur) var(--box-shadow__inset-spread) var(--box-shadow__inset-color),
    var(--box-shadow__outline-x) var(--box-shadow__outline-y) var(--box-shadow__outline-blur) var(--box-shadow__outline-spread) var(--box-shadow__outline-color),
    var(--box-shadow__elevation-x) var(--box-shadow__elevation-y) var(--box-shadow__elevation-blur) var(--box-shadow__elevation-spread) var(--box-shadow__elevation-color);
}

.box-shadow--elevation-1 {
  --box-shadow__elevation-y: 0.125rem;
  --box-shadow__elevation-color: var(--color-shadow);
}

.box-shadow--elevation-2 {
  --box-shadow__elevation-y: 0.25rem;
  --box-shadow__elevation-color: var(--color-shadow);
}

/* ... */

.box-shadow--outline {
  --box-shadow__outline-spread: 0.25rem;
  --box-shadow__outline-color: var(--color-primary);
}
```

It's verbose, but does the job. Likely a good few of those properties will be 0, so that might reduce the amount of properties to juggle. Still, we're not really composing shadows, more configuring them.

Composing shadows
---

[Using empty properties, a technique borrowed from Lea Verou][empty-vars], we can start actually composing the shadows with each other. The number of shadows is still set, but this allows more flexibility. Especially, it opens the door to composing complex shadows, like [Tobias Ahlin's layered shadows][layered-shadows], multiple outline shadows to simulate a transparent offset on a plain background.

```css
[class*="box-shadow"] {
  --box-shadow__inset: ; /* 1 */
  --box-shadow__outline: ; /* 1 */
  --box-shadow__elevation: ; /* 1 */
  box-shadow: var(--box-shadow__inset) var(--box-shadow__outline) var(--box-shadow__elevation) /* 2 */ 0 0 0 transparent; /* 3 */
}
```

That's so much more readable! Each custom property will contain a whole shadow declaration: offsets, blur, spread, color (1). Even the comma that separates it from the next! Without it, there'd be empty parts in the box-shadow declaration and browsers would discard it.

The `box-shadow` declaration then list them out in the right order, space separated as the comas will come in the properties (2). Last a final transparent shadows is there to compensate for the comma that will be in the final property (3). Hopefully browsers can be clever and detect that a no blur no spread transparent shadow can be skipped.

Each utility class then brings one or more shadow declarations (without forgetting the trailing comma!):

```css
.box-shadow--elevation-1 {
  --box-shadow__elevation: 0 0.0625rem rgba(0,0,0, 0.1), 0 0.125rem rgba(0,0,0,0.1),;
}

.box-shadow--inset {
  --box-shadow__inset: 0 0.125rem rgba(0,0,0,0.2);
}

.box-shadow--outline {
  --box-shadow__outline: 0 0 0 0.25rem var(--primary);
}
```

[This Codepen demo shows it in action on an input field][codepen-demo], allowing for the `:focus` state to inject an outline without wiping the elevation or inset shadow.

While limited to a set number of shadows, this brings a step closer to having composable shadow utility classes. And I guess it could be applied similarly to any of property accepting a comma separated list of options (like `transform` or `background-image`).


[initial-tweet]: https://twitter.com/frontstuff_io/status/1316398189789024257
[empty-vars]: https://lea.verou.me/2020/10/the-var-space-hack-to-toggle-multiple-values-with-one-custom-property/
[layered-shadows]: https://tobiasahlin.com/blog/layered-smooth-box-shadows/
[codepen-demo]: https://codepen.io/rhumaric/pen/rNLxeXK
[mdn-box-shadow]: https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow
[mdn-custom-properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
