---
date: 2020-06-09
title: First step towards internationalisation
type: post
layout: post.pug
---
Let's get started towards publishing in two languages. To keep things simple for starting, I'll focus on the homepage. It will be enough to highlight the first things to take care of, before building up complexity to handle deeper pages.

With only a unique page, handling translated versions already requires:

- to [add hints about languages to the markup][w3c-markup]
- to provide a way to switch between languages

That first part should already be enough to focus on for this article, so let's dive in!

Describing the content language in the markup
---

Every element in HTML can hold a [`lang` attribute][lang-attribute] to describe the language of its content. **At the very least, the `<html>` tag wrapping the document must have one**. Deeper elements, can then describe that their content is in another language by setting their own `lang` attribute.

For example on this page, the `<html>` tag sets the language to "English". The link to swap the site in French is written in French, though, so anounces it with `lang="fr"`.

This attribute is [especially important for screenreader users][screenreader-lang]. This is what will ensure that the software pronounce the word correctly.

This means the [shared `site.pug` layout, set a couple of articles ago][layout-setup], needs to become a bit more flexible. The hardcoded `lang="en"` will need to accept a variable, say `language` set for each page. 

```pug
html(lang=language)
```

To define this `language`, we can use the front-matter of each page. For now, the `index.md` file will be starting with:

```md
---
language: en
---
```

While its French counterpart `fr/index.md` will start with:

```md
---
language: fr
---
```

With that, each page will get the appropriate language. This will quickly become cumbersome and error prone, so it'll be revisited in the future, though.

Linking to content in a different language
---

Similarly to how pages or parts of the page can announce their language, links can announce the language of the content they point to with the `hreflang` attribute.

The value of the attribute can then be used with CSS to enhance the link by showing the language.

```css
[hreflang]:not(.no-hreflang)::after {
  content: ' (' attr(hreflang) ')'
}
```

All links with an `hreflang` attribute will now show the language. In some situations, the content will make the destination language clear enough (for example, when switching between languages), so there's a little bypass in the form of the `no-hreflang` class.

This will also make the language get across to assistive technologies, as [generated content is added to the accessible name of elements][accessible-name-generated-content]. Hopefully it won't double up with any existing announcement of the `hreflang`, but I couldn't find anything on the matter.

Now we're started! Onwards to allowing to switch between pages, and further to organise the content, match translated versions and more... in future articles.

[w3c-markup]: https://www.w3.org/International/questions/qa-html-language-declarations
[lang-attribute]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
[screenreader-lang]:https://www.powermapper.com/tests/screen-readers/content/html-page-lang/
[accessible-name-generated-content]: https://blog.benmyers.dev/css-can-influence-screenreaders/#css-generated-content
[layout-setup]: ../shared-layout
