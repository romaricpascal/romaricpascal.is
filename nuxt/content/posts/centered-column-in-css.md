---
date: 2020-06-23
title: Centered column with CSS
type: post
layout: post.pug
---
Let's take a break from the backend of this site and talk a bit about its stylesheet. The design is pretty minimal, but there's already a couple of interesting patterns. Starting with the centered column of content, with a limited width.

Maybe you're on mobile, using a narrow window, or with a large zoom, and the width doesn't seem that limited. Just a little space on the side. Here is how it looks on wider viewports:

<img src="/media/romaricpascal-homepage.png" alt="Screenshot of this site's homepage, showing large space on each side of the column of content" height="659" width="1299">

Not letting the text run edge to edge, as it would without styling, is crucial for a good readability. This is a pretty common pattern, sometimes called a `container`. Let's take a peek at how to make it happen.

Limiting the content width
---

We're trying to control the width of the content, but we don't want to set it for all screens. We're happy to let it go full(ish) width as long as the viewport is narrow enough. What's important is that it doesn't grow wider than what we decide. This is exactly what the `max-width` property offers.

Depending on the litterature you find on the topic, you'll find different values for that limit, with the minimum in the 40 character per line and the maximum around 70-80. Let's say 60, as an example.

All this talk about characters leads to thinking the `ch` unit would be great to express that `max-width`. However, `60ch` won't be the same width depending on the element's own font-size. Headings, usually set at a larger size, would end up with a wider column than the copy for example.

Not super isolated, so we'll rely on the `rem` unit. It'll keep the width relative to the base font-size of the site, allowing it to adapt to user preferences. But it won't vary from one element to another because of styles changing their specific font-size.

```css
max-width: 45rem;
```

<div class="demo" role="presentation">
  <div>
    <div class="demo-element demo-element-striped" style="height: 100%; max-width: 25%"></div>
  </div>
</div>

Centering the content
---

The column now has a limited width, but it's stuck on the left hand side of the screen. To get it in the middle, we can use the `auto` value for its left and right `margin`.

```css
max-width: 45rem;
margin-left: auto;
margin-right: auto;
```

<div class="demo" role="presentation">
  <div>
    <div class="demo-element demo-element-striped" style="height: 100%; max-width: 25%; margin-left: auto; margin-right: auto;"></div>
  </div>
</div>

Looking forward to when `margin-inline` will be widely supported and reduce those two `margin-...` properties to one. Note that we do not want to use the `margin` shorthand as there's no need to affect the top and bottom margin.

A little space on the outside
---

When the viewport is too narrow, the column reaches both edges of the screen.

<div class="demo demo--narrow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped" style="height: 100%; margin-left: auto; margin-right: auto;"></div>
  </div>
</div>

It doesn't make for a pleasing experience, a little space on each side would make it so much nicer. Adding some horizontal `padding` is tempting, but brings in two issues:

1. when the limit applies, the width of the content is no longer the `max-width`. It becomes the `max-width`, minus twice the horizontal padding (one for each side).
2. it would conflict when applied to elements that have some padding already. Either we end up breaking its insides by trying to control its width, or its insides end up wreaking the spacing.

Both can be worked around. The first one can be adressed by ensuring `box-sizing` is set to `content-box` (usually it's reset to a much more convenient `border-box` nowadays) and the second by applying the styles to a wrapper element, rather than the one with the padding.

Not a found of those. In the end, what we want is something not quite full width, with a little space removed on each side. We can express that "word for word" with the `width` property and `calc()`:

```css
width: calc(100% - 2 * 1.5rem);
max-width: 45rem;
margin-left: auto;
margin-right: auto;
```

<div class="demo demo--narrow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped" style="width: calc(100% - 2 * 1rem); height: 20%; margin-left: auto; margin-right: auto;"></div>
    <div class="demo-element demo-element-filled" style="width: calc(100% - 2 * 1rem); height: 20%; margin-left: auto; margin-right: auto; padding: 0.5rem" >
      <div class="demo-element demo-element-striped" style="height: 100%; " ></div>
    </div>
    <div class="demo-element demo-element-striped" style="width: calc(100% - 2 * 1rem); height: 20%; margin-left: auto; margin-right: auto;" ></div>
  </div>
</div>

Boom! Space on the side, limited width that matches the `max-width` and the pattern can be applied to elements that already have padding.

Picking targets
---

Using the `SELECTOR > *` selector, it can also create a container where each children is centered. And without any specificity added to the selector preceeding `>` (so good these asterisks). 

Compared to styling the parent directly, it'll be much easier to have elements break out of the column and be slightly wider. Not that it's impossible, it's just [a bit more involved than tweaking the `max-width`][breaking-out-of-column]. 

```css
.centered-children > * {
  width: calc(100% - 2 * 1.5rem);
  max-width: 45rem;
  margin-left: auto;
  margin-right: auto;
}

.wider-element {
  max-width: 55rem;
}
```

<div class="demo" role="presentation">
  <div>
    <div class="demo-element demo-element-striped" style="max-width: 25%; height: 20%; margin-left: auto; margin-right: auto;"></div>
    <div class="demo-element demo-element-filled" style="max-width: 35%; height: 20%; margin-left: auto; margin-right: auto; padding: 0.5rem" >
    </div>
    <div class="demo-element demo-element-striped" style="max-width: 25%; height: calc(60% - 2rem); margin-left: auto; margin-right: auto;" ></div>
  </div>
</div>

And that's about all there is behind the centered column of this minimal relaunch design. Now we've dealt with the horizontal centering, see you in the next article to have a look at the vertical spacing!

[breaking-out-of-column]:https://css-tricks.com/full-width-containers-limited-width-parents/
