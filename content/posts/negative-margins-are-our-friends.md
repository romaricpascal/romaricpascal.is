---
date: 2020-06-30
title: Negative margins are our friends
type: post
layout: post.pug
---
The language switcher responds to the width of the viewport. If space allows, the two languages sit side by side. But when the viewport is too narrow, they'll go on top of each other.

The links have generous padding to ensure good accessibility, but a little spacing between them would be better. Thing is, depending on their layout, they need either vertical or horizontal margins.

Margins on all sides!
---

A media query would need tweaking every time the content changes. I'm the writing both the content and the code for this site, so that wouldn't be an issue. When content is filled by users, that adjustment will be trickier to make happen (costs, delays...).

Instead, we can start by applying margins all around the links. On the language switcher. The main thing to keep in mind is that the horizontal margins won't collapse. So to make a gap of `1rem` between the elements you'd need to set a horizontal margin of `0.5rem`. For vertical margins, it will depend on the layout. Clearing floats, `display:flex` and `display: grid` (though in that last case using `gap` is probably a better option), will also prevent the collapse.

Here I'm aiming for a much smaller margin, and prefer the setting to be due to the parent rather than setting a class on each child. This will limit the number of elements to touch to remove the styles.

```css
.language-switcher > * {
  margin: 0.25rem;
}
```

Fixing the alignment
---

Now, adding margin all around has a nasty side effects. The elements are no longer aligned with the edges. 

<div class="demo demo--shallow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem; height: 2rem"></div>
      </div>
    </div>
  </div>
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%;margin: 1rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%; margin: 1rem; height: 2rem"></div>
      </div>
    </div>
  </div>
</div>

That's where negative margin come to play. By setting a negative margin on the parent, we can compensate all this extra margin around and reallign things.

```css
.language-switcher {
  margin: -0.25rem;
}

.language-switcher > * {
  margin: 0.25rem;
}
```

<div class="demo demo--shallow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin: -1rem">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem; height: 2rem"></div>
      </div>
    </div>
  </div>
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin: -1rem">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%;margin: 1rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%; margin: 1rem; height: 2rem"></div>
      </div>
    </div>
  </div>
</div>

Bye bye whitespace
---

`inline-block` elements will reflow as intended. However, depending on how the code is generated, there might or might not be some whitespace between them. Another cause for alignment issues.

To gain some consistency, making the parent `display: flex` with `flex-wrap:wrap` for the reflow ensures that the whitespace gets out of the equation. And `justify-content: center` brings the elements to the centre here.

```css
.language-switcher {
  margin: -0.25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content:center;
}

.language-switcher > * {
  margin: 0.25rem;
}
```

Varying margins
---

There's nothing forcing the vertical and horizontal margins to be the same. Ensuring the parent's negative margin match the values in each direction, the pattern can be used to space the elements differently whether they're stacked or side by side.

```css
.with-different-margins {
  margin: -1.5rem -0.25rem; 
}

.with-different-margins > * {
  margin: 1.5rem 0.25rem;
}
```

<div class="demo demo--shallow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin: -1rem -0.5rem">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem 0.5rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem 0.5rem; height: 2rem"></div>
      </div>
    </div>
  </div>
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin: -1rem -0.5rem">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%;margin: 1rem 0.5rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%; margin: 1rem 0.5rem; height: 2rem"></div>
      </div>
    </div>
  </div>
</div>

Collapsing borders
---

The pattern can also be used to collapse borders between adjacent elements. This time, negative margins need to be applied to the elements themselves, rather than the parent. Because each element will bring its own margin, the value will need to be half the size of the border.

```css
.collapsed-borders {
  display: flex;
  flex-wrap: wrap;
  margin: 0.125rem;
}

.collapsed-borders > * {
  border: solid 0.25rem;
  margin: -0.125rem; /* Half the size of the border */
}
```

<div class="demo demo--shallow" role="presentation">
  <div>
    <div style="display:flex;flex-wrap: wrap; margin: 0.125rem">
      <div class="demo-element" style="flex: 1 1 1%;margin: -0.125rem; border: solid 0.25rem; height: 2rem"></div>
      <div class="demo-element" style="flex: 1 1 1%;margin: -0.125rem; border: solid 0.25rem; height: 2rem"></div>
    </div>
  </div>
  <div>
      <div style="display:flex;flex-wrap: wrap; padding: 0.125rem;">
        <div class="demo-element" style="flex: 1 1 1%;min-width: 55%;margin: -0.125rem; border: solid 0.25rem; height: 2rem"></div>
        <div class="demo-element" style="flex: 1 1 1%;min-width: 55%; margin: -0.125rem; border: solid 0.25rem; height: 2rem"></div>
      </div>
  </div>
</div>

`padding` could also be used to compensate the elements' margins, but for consistency, I prefer sticking to `margin`.

Help! My margins are odd!
---

As the pattern relies on halfing some values, odd numbers are going to be an issue. Not everyone will use a browser and a screen that can render half-pixels. This means rounded values will cause alignment issues.

If you've confirmed with the designer that the gaps or borders do absolutely need to be an odd number, all is not lost. This can be worked around by reducing the margins used to only one direction per axis (vertical/horizontal).
For example, `margin-bottom` and `margin-right` only (which don't conflict with [controlling space with `margin-top`/`margin-left` and `* + *`][sibling-combinator]).

```css
.with-odd-gaps {
  /* say we need 15px gaps */
  margin-bottom: calc(-15rem / 16);
  margin-left: calc(-15rem / 16);
}

.with-odd-gaps > * {
  margin-bottom: calc(15rem / 16);
  margin-left: calc(15rem / 16);
}
```

<div class="demo demo--shallow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin-bottom: calc(-15rem / 16); margin-right: calc(-15rem / 16)">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin-bottom: calc(15rem / 16); margin-right: calc(15rem / 16); height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin-bottom: calc(15rem / 16); margin-right: calc(15rem / 16); height: 2rem"></div>
      </div>
    </div>
  </div>
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin-bottom: calc(-15rem / 16); margin-right: calc(-15rem / 16)">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%;margin-bottom: calc(15rem / 16); margin-right: calc(15rem / 16); height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%; margin-bottom: calc(15rem / 16); margin-right: calc(15rem / 16); height: 2rem"></div>
      </div>
    </div>
  </div>
</div>

This went a bit further than what's just used on the language switcher (again at the time of this writing), but this is a handy pattern. Waiting for [`gap` for Flexbox][flexbox-gap-support] to get widely supported, it's a solid option to let items reflow according to their size, but still get spaced, without the rigidity of media queries.

Before we get back to JavaScript and the last few features the static site generator needed before launch, let's make a little detour to talk HTML and accessibility in the next article.

[sibling-combinator]: ../embracing-the-adjacent-sibling-combinator/
[flexbox-gap-support]: https://caniuse.com/#feat=flexbox-gap
