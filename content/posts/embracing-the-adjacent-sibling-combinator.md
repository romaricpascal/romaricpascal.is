---
date: 2020-06-25
title: Embracing the adjacent sibling combinator
type: post
layout: post.pug
---
My preferred way to handle vertical margins is to use [Heydon Pickering's "lobotomized owl" selector][lobotomized-owl], `* + *`, combined with the `margin-top` property.

```css
* + * { /* any element preceded by any element */
  margin-top: 1.5rem;
  margin-bottom: 0;
}
```

Aside from the amazing selector name, this ensures element only have margins when there is another element to space them from. Less "surprise" space at the top or bottom of elements when first or last and [margin collapse][margin-collapse] doesn't happen (because the parent has border, padding, block formatting context, grid or flexbox layout). 

Using only one of the top/bottom direction also avoid extra "surprises" when the collapse of margins between siblings doesn't happen (due to grid, flexbox or cleared floats, though that last one is less likely these days).

 And its [low specificity][css-specificity] (nothing actually) allows to use more selectors to make targetted adjustment.

 For example, to reduce the spacing between subsequent `<li>`:

```css
* + * {
  margin-top: 1.5rem;
  margin-bottom: 0;
}

li + li {
  margin-top: 0.5rem
}
```

Isolating the effects
---

It's rare you'd want to apply this style to all elements of a site, though. For elements laid out horizontally, the `margin-top` will get in the way (`margin-left`/`margin-right` will be more helpful).

That's why most of the time it needs to be scoped to inside specific elements, and its reach limited with the child combinator `>`. One exception would be when styling content on which you can't add new classes, like content comming from a CMS.

```css
.spaced > * + * {
  margin-top: 1.5rem;
  margin-bottom: 0;
}
```

Margin before, margin after
---

For one off adjustments, you could add say a `margin-top--1rem` utility class to an element needing a `1rem` top margin. This would break all the effort to ensure the element only has margin if there is something to space it with.

Instead, we can express that the previous sibling needs some margin after itself. If the sibling gets removed, no more margin:

```css
.margin-after--1rem + * {
  margin-top: 1rem;
}
```

A similar pattern can be used for expressing that an element needs some margin with its previous sibling:

```css
* + .margin-before--1rem {
  margin-top: 1rem;
}
```

This pattern is used right on this article (or was, at the time of its writing): headings get their spacing ajusted to get closer to their content.

```css
h1 + * {
  margin-top: 0.25rem;
}

* + h1 {
  margin-top: 1.75rem;
}
```

But it's mostly interesting when some elements are not necessarily present on all pages. Targetting with the `+` combinator, the focus can remain on just whether to put the element or not on the DOM. No need to worry whether to adjust the sibling's margin depending on its presence.

There are other ways to handle the vertical spacing (using `margin-bottom` and some control of the `:first-child` and `:last-child` being the other one I can think of). This one just tends to be the one I favour. It also translates well to horizontal layouts, using `margin-left`/`margin-right` (depending on the direction of reading, [can't wait for `margin-inline-start`][margin-inline-start]).

What if the layout switches between horizontal and vertical as viewport resizes? I'll have a word about that in the next article.


[lobotomized-owl]: https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/
[css-specificity]: https://www.w3.org/TR/selectors-3/#specificity
[margin-inline-start]: https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start
[margin-collapse]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing
