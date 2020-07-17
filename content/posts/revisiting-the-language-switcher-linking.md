---
date: 2020-07-17
title: Revisiting the language switcher - Linking to the right place
type: post
layout: post.pug
---
Time to use all that [indexing done in the previous article][previous-article] to actually send users to the translated pages. The bulk of the work is behind, but there's still a few little things to take care of:

- grabbing the URL of the file to link to
- accessing the index in the template
- handling missing translations

Let's go!

Where to send
---

The [`outputPath` plugin][outputpath-plugin] computes where the resulting file will be. It's not quite its URL, though. Because we're aiming for URLs with a trailing slash, most pages end up written in an `index.html` file, which won't appear in the URL. `/about-me/index.html` will actually be accessed through `/about-me/`.

As a quick way to get past that, we can have it also compute an `outputUrl` property. It will naively replace any trailing `index.html` by an empty string, and that should be enough to move forward. Ultimately, this might get moved into a plugin of its own, or maybe a helper `url` available in the templates... but that's something to revisit later.

Right at the end of the `computeOutputPath` function, we can add that extra computation:

```js
// ...
      file.outputPath = outputPath;
      // Wrap in a `normalize` to prevent 
      // ugly `/./` bits inside the URL
      file.outputUrl = '/' + normalize(outputPath).replace('index.html', '');
// ...
```

Now that every file announces its URL, we can look into accessing those in the templates.

Accessing the translated pages
---

So far, the [language switcher loops on the languages][language-switcher] and picks the right homepage to link to:

```pug
//- ...
each availableLanguage in languages
  -
    href = language == 'en' ? '/' : `/${language}/`
  //-...
//-...
```

This needs to be changed into a lookup in the [`byKeyByLanguage` index we created previously][previous-article].
The key is held in the `i18n.key` property of the page, the language given by the loop and we just added an `outputUrl` on each file. Looks like we have everything to link to the translated page with:

```pug
//- ...
each availableLanguage in languages
  -
    href = groups.byKeyByLanguage[i18n.key][language].outputUrl
  //-...
//-...
```

Boom! Job done!... Not quite, unfortunately. There will always be a value for `groups.byKeyByLanguage[i18n.key]`. The page currently being rendered will be listed there. However there's no guarantee that there's on for each of the `languages`. Directly accessing `outputUrl` will blow if one is missing, so we need to handle that.

Providing a fallback
---

The [optional chaining operator][optional-chaining-operator] (`?.`) would avoid an error here, but doesn't play well with Pug's parser. Just like we did in the plugin indexing the files, we can rely on [Lodash's `get`][lodash-get] to access deep values without breaking when a part of the path is missing.

To have access to it in the templates, we need to pass it as one of the global metadata, inside `src/index.js`:

```js
//...
.metadata({
  //...
  get: require('lodash/get'),
  //...
})
//...
```

This allows to turn accessing the URL into:

```pug
//- ...
each availableLanguage in languages
  -
    href = get(groups.byKeyByLanguage, [i18n.key, language, 'outputUrl']);
  //-...
//-...
```

To which we can finally add a fallback to the homepage in the appropriate language if we get an empty value:

```pug
//- ...
each availableLanguage in languages
    -
      href = get(groups.byKeyByLanguage, [i18n.key, language, 'outputUrl']);
      if (!href) { 
        href = language === defaultLanguage ? '/' : `/${language}`  
      }
      //-...
//-...
```

The language switcher is now much more useful, linking to translation of the current content rather than back to the homepage.

Extra: Translation `<meta>`
---

Navigation improvement is not the only opening from easily accessing translations. It's now also possible to generate `<meta>` tags that help some search engine to associate translated content.

With a similar loop as for the navigation, we can create a series of `<meta rel="alternate">` tags in a `layout/i18n/_head_links.pug` partial:

```pug
each language in languages
  //- Only output other translations
  if (language !== i18n.language)
    - let translationUrl = get(groups.byKeyByLanguage, [i18n.key, language, 'outputUrl']);
      if (translationUrl)
        link(rel="alternate",hreflang=language,href=translationUrl)
```

We can then include it inside the `head` tag in the `layouts/site.pug` file.

Now navigation between languages is much nicer, it's time to look into adding more content. Like the posts that's you've been reading here so far. The last step to get to the state of the site when it launched. Or steps, more accurately. Which we'll start looking into in the next article.

[previous-article]: ../revisiting-the-language-switcher-indexing-content/
[outputpath-plugin]: ../in-the-right-place/
[language-switcher]: ../detecting-language-round-2/
[optional-chaining-operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
[lodash-get]: https://lodash.com/docs/4.17.15#get
