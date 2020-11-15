---
date: 2020-07-15
title: Revisiting the language switcher - Indexing content
type: post
layout: post.pug
---
When we left the static site generator, it was [detecting the language from a `--fr` suffix][ssg-language-detection] and [outputing the files at the right place][ssg-file-output]. The language switcher still sends to the homepage when people swap language. 

Not ideal at all. If a translation exists, it would be much better to send them to it. Now we have a translation key under the `i18n.key` property of each file, we can use that to send to the translated page.

The language switcher being displayed on each page, it would be very inefficient to naively loop through the list of pages each time we need to find a translation. Building a tree of objects that groups files by key, then by language would make looking them up much more direct: going through 2 properties, rather than an evergrowing amount of files. This is the structure we'll end up with:

```js
{
  index: {
    en: File,
    fr: File
  },
  'about-me': {
    en: File,
    fr: File
  }
  //...
}
```

Scaffolding a new plugin
---

This calls for a new plugin to generate that tree and store it in the site metadata for future access in the templates.
There'll likely be more than one way to group the files as the site grows, so we'll have it set them at `groups.byKeyByLanguage`, so there's only one new key introduced in the metadata.

Inside the `plugins/group.js` file, we can scaffold the plugin:

```js
module.exports = function group() {
  return function (files, metalsmith) {
    const groups = {
      byKeyByLanguage: {}
    }
    // Coming soon, the indexing of the files ;)
    metalsmith.metadata().groups = groups;
  }
}
```

And then add it to Metalsmith's processing. It'll need to be after the language and translation key have been detected, so they can be used for the indexing:

```js
// ...
const group = require('./plugins/group');
// ...
.use(detectLanguage())
.use(computeOutputPath())
.use(group())
// ...
```

Indexing the files
---

Indexing the files into that tree structure is a two step thing:

1. Read the files properties that make the path in the index, here `i18n.key` and `i18n.language`
2. Set the file in the corresponding path in the index

That second step requires to create new intermediate `Object`s as new paths get added to the index. Instead of coding it ourselves, we can rely on [Lodash's `set` function][lodash-set]. Similarly, to avoid breaking if the `i18n` property is missing, we can rely on Lodash's `get` to access deep values.

After installing lodash with `npm i lodash`, we can update the plugin:

```js
const get = require('lodash/get');
const set = require('lodash/set');
    // ...
    Object.values(files).forEach(file => {
      // 1. Collect the properties from the file
      const language = get(file, 'i18n.language');
      const key = get(file, 'i18n.key');
      // 2. Add them to the index
      set(groups.byKeyByLanguage, [key,language], file);
    });
    metalsmith.metadata().groups = groups;
    //...
```

With the files neatly grouped by translation key and then language, we're a good step closer to letting users navigate between the translations of the content. Next will be updating the language switcher to grab the translated pages' URLs, but that'll be for the next article.

[ssg-detect-language]: ../detecting-language-round-2/
[ssg-file-output]: ../in-the-right-place/
[lodash-set]: https://lodash.com/docs/4.17.15#set
