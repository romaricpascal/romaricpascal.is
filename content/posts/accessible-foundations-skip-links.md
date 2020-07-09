---
title: Accessible foundations - Skip links
type: post
layout: post.pug
---
In between the top of the page and its content sits the site header. Despite the limited content of this site, it already contains 6 links. This means 6 tabs for keyboard users or 6 swipes for mobile/tablet users with VoiceOver or Talkback before they can access the content they're here for. And after each navigation, it's as many links to go through before reaching the content again. Not. Ideal.

That's why skip links are so important (especially so if when the number of links in the header grows). As their name tells, they let users skip to wherever the content is, speeding up their navigation. They're one of the ways to meet one of the [criteria for the lowest level of the Web Content Accessibility Guidelines][wcag-2.4.1] (WCAG).

Making it happen
---

HTML provides all that's needed for making it happen. Fragment URLS, starting with `#`, let `<a>` tags send to any element on the page with an `id`. The next tab/swipe will then start from there, rather than when the link was. 

So in the end, it boils down to:

- Adding an `id` attribute to the element holding the main content of the page (usually the `main` [landmark])
- Adding a link that sends to that `id` as first thing inside the `<body>` 

```html
<body>
  <a href="#main">Skip to main content</a>
  <header><!-- Header full of links --></header>
  <main id="main">
```

It used to be a bit more convoluted due to browser & screen reader bugs, but [it seems all is fixed now][accesslab-skip-links].

Argh, the design plans no space for that link
---

On here, the link is visible. Often the design mockups won't show any skip link, though, planning (when they do) for it not to be visible unless actually focused by the user. This can be handled with a little CSS, hidding the link accessibly as long as it's not focused. Once focused by the user, the link will appear and let them know they can navigate to the main content.

Note the "hidding accessibly", it's very important here. `display:none` or `visibility:hidden` would prevent any focus to ever reach the element, and it would never be revealed. This requires to combine a good few properties, like the ones applied by the `sr-only-focusable` class (to become `visually-hidden-focusable` in the version 5) in Bootstrap, for example:

```css
.sr-only-focusable:not(:focus) {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0,0,0,0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}
```

If you're curious as to where all these come from, I encourage you to [dig into the Bootstrap source][bootstrap-source] and follow the links they quote.

Going further
---

An e-commerce listing page might offer a filtering form, with its load of input, before reaching the actual list of products. Again a lot of tabbing/swiping before getting to the content. But also an important part of the page missed if skipping directly to the list.

There's nothing saying there should be only one skip link at the start. In this scenario, providing one link to the list and one link to the filter is really helpful.

There's nothing saying they should only be at the start of the page either. Aside from page headers, `<iframe>`s are  another provider of lots of focusable elements. It'll be a few tabs/swipes before you get through the controls of an embedded Youtube video, without even starting it, for example. As proposed by Manuel Matuzovic, it can be handy to [add a skip link before `<iframe>`s to let users keep moving through the content][skip-link-iframe].

There's also nothing saying that the skip links should be hidden, but that's a matter of design preferences ;)

Often hidden if not forgotten, skip links are really helpful to let users quickly get to the content they're after. As the design of the site will evolve there'll be plenty of occasions to talk semantics and CSS again. But it's time to dive back into the static site generation, with the next article looking at upgrading the language switcher.

[landmark]: ../accessible-foundations-landmarks/
[wcag-2.4.1]: https://www.w3.org/TR/WCAG21/#bypass-blocks
[accesslab-skip-links]: https://axesslab.com/skip-links/#update-april-2020
[bootstrap-source]: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_screen-reader.scss#L5
[skip-link-iframe]: https://www.matuzo.at/blog/improving-the-keyboard-accessibility-of-codepen-embeds/#skip-links
