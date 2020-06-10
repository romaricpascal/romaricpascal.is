---
title: Switching language
type: post
layout: post.pug
---
With a homepage available in two languages, I can start adding some navigation between the languages. Thanks to the limited content so far, it'll let me focus on the core parts and enhance once the site handles multiple pages.

Linking to the translated version
---

People looking for a specific language will likely look for its name in that language, not the one of the page. The markup needs to reflect that, thanks to the `lang` attribute. Equally, the content of the linked page will be in another language, so that's another attribute to add, `hreflang`.

Given [the styles in place][hreflang-styling], that `hreflang` will trigger the insertion of a little content generated from the CSS. This is superfluous here as the link content already clarifies the destination language. That's why the selector handling the generated content has a `:not(.no-hreflang)`. This will allow to avoid the generated `(fr)` by adding the `no-hreflang` class.

All in all, this leads to the following link to send to the French version:

```html
<a href="/fr/" lang="fr" hreflang="fr" class="no-hreflang">Français<a>
```

Marking the current link
---

To keep things consistent between the pages in each language, I decided for showing the links to both languages (in the same order). Better highlight which is the current one now.

It's tempting to simply add a CSS class to the link and leave it there. But there is a way to add semantics, with [the `aria-current` attribute][aria-current]. This means the current page will not only be accessible to the eyes, but conveyed to assistive technologies too:

```html
<a href="/" aria-current="page">English<a>
```

This markup will allow to hook some styles with `[aria-current]` to show which page is in the current language. (The `lang` and `hreflang` could be left out because they're the same as the page)

Grouping all that in a component
---
The markup above is pretty static. The French page will need to swap the attributes for its link. Let's make things a bit more dynamic. 

As it's a very contained piece of functionality, we can isolate it in its own template. And then `include` it inside the `site.pug` layout to share it across the site:

```pug
//- ...
body
  header
    include i18n/_language_switcher.pug
//- ...
```

The component itself will need to know of a few things:

1. the language of the current page
2. the supported languages for the site
3. the label of the link for each language
4. a label, in each language too, for the `<nav>` landmark that will wrap it

Number 1 is taken care of by [the `language` variable introduced previously][language-variable]. The other three however will require new data for the template. Unlike the `language` these are site-wide, though. To handle that, Metalsmith offers a `metadata()` function, which sets data available for all pages.

```js
// ...
.destination('./site')
.metadata({
  languages: ['en', 'fr'],
  messages: {
    languageSwitcher: {
      en: 'English',
      fr: 'Francais'
    },
    languageSwitcherLabel: {
      en: 'Languages',
      fr: 'Langues'
    },
  })
// ...
```

Once in place, we can use them in the component's template `layouts/i18n/_language_switcher.pug`:

```pug
//- aria-labelledby prefered to aria-label because the later does not always
//- get translated properly by browsers and apps
//- https://adrianroselli.com/2019/11/aria-label-does-not-translate.html
nav.language-switcher(aria-labelledby="languageSwitcherHeading")
  h2#languageSwitcherHeading(hidden="")= messages.languageSwitcherLabel[language]
  each availableLanguage in languages
    -
      href = language == 'en' ? '/' : `/${language}/`
      currentAttr = language === availableLanguage ? 'page' : null
    //- Pug swallows whitespace by default
    = ' '
    a.no-hreflang(href=href,
      hreflang=language,
      lang=language
      aria-current=currentAttr)
      = messages.languageSwitcher[language]
```

That will be enough for that first version of the language switcher. As new pages get added, it'll need revisiting as we'd want to send people to the translated page, not the homepage. But that requires other pages, and that's the next chunk of work, which will be described in the next few articles.

[aria-current]: https://tink.uk/using-the-aria-current-attribute/
[language-variable]: ../first-step-towards-internationalisation/#describing-the-content-language-in-the-markup
[hreflang-styling]: ../first-step-towards-internationalisation/#linking-to-content-in-a-different-language
