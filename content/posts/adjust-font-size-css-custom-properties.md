---
title: Adjust font size with CSS custom properties
date: 2122-01-01
type: post
layout: post.pug
draft: true
---
For a given font-size, different fonts will render at a different height. More details: <https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align>
This calls for some adjustments to minimise layout shifts.
In the future, there'll be `font-size-adjust` and it'll be great.
It's not quite there yet though.

In the meantime, besides messing with the font file (which you might or might not have access to, and which might or might not be fine with the font's licensing), CSS custom properties can help.

Enter a `--font-size-scale` property
---

Next to the relevant `font-family` declaration, we're going to introduce a `--font-size-scale` property. Initially set to `1`, while the fonts are loading, it can be set to the appropriate value when the fonts are loaded. It might come handy to introduce `--font-size-scale--font-A`, `--font-size-scale--font-B` to manage those values more easily.

```css
:root {
  --font-size-scale: 1;
}

.class {
  font-family: Remote font, fallback font;
}

.fonts-loaded .class{
  --font-size-scale: 1.25;
}
```

Scale the `rem` `font-size` to use each font scale
---

By multiplying the `font-size` expressed in `rem` we'll make them scale appropriately once the font is loaded. We don't want to touch any of the other font-size relative unit (`em`,`ex`, `ch`) as we'd compound the scaling.

Technically we should scale the absolute font-sizes too (`px`, `pt`, `cm` and whatnot), but as they should be expressed in `rem` so they scale accessibly for people that need the base font-size tweaked, we'll leave them out. It'll be easier to spot issues.

```css
font-size: calc(1rem * var(--font-size-scale));
```

Keep the root font-size intact
---

The idea is to scale up/down the font-size of the fancy font to the size of the fallback font. We don't want to mess with all the spacing and other values that might be set in `rem` across the site. So we'll start scaling fonts at the `body` level.

```css
body {
  font-size: calc(1rem * var(--font-size-scale))
}
```

Scale down the `em`,`ch` and other font-specific units
---

Say you have an icon scaled to match the size of the text next to it.
Scaling the font-size just scaled it too, and it's not something we want.
So we need to scale `em`, `ch` and other font-size relative units the inverse way we scaled the font-sizes.

```css
.icon {
  width: calc(1em / var(--font-size-scale));
  height: calc(1em / var(--font-size));
}
```

Use Sass to make things manageable
---

```scss
%font-family--A {
  font-family: Font family A, fallback-font;
}

%font-family--B {
  font-family: Font family B, fallback-font;
  --font-size-scale: 1.45;
}

.class {
  @extend %font-family--A;
}

.class2 {
  @extend %font-family--B;
}

#id {
  @extend %font-family--A;
}

.loaded {
  %font-family--A {
    --font-size-scale: 1.25;
  }

  %font-family--B {
    --font-size-scale: 1.45;
  }
}
```

TODO:

Check how to handle other custom properties: when applied to `font-size` or non-font-size. Don't scale their declaration, only their application though.
Mention the `font` shorthand that would need similar scaling as `font-size`.
Hint at how PostCSS could reduce the workload to apply this technique.
