---
date: 2020-06-15
title: Detecting language - A first pass
type: post
layout: post.pug
---
The [prep' work done to process the source file path with that first plugin][previous-article] was mostly done to help this second plugin. Its role will be to detect the language of each file, as well as a translation key to link translations of the same content together.

Ultimately, for a file named `posts/an/article--fr.md` the language should be detected as French (`fr`) thanks to the `--fr` suffix. Everything preceding that suffix should be used as a the translation key. This will match it to `posts/an/article.md`, its English counterpart (and to have them right next to each other).

For now, though, the French page is `fr/index.md`, so let's use that for a first version of language detection.

Plugin structure
---

In `plugins/detectLanguage.js`, the structure of this second plugin will be pretty similar to the path splitting one. It loops over the files and:

- delegate to a `getLanguageInfo` function the detection of the language
- set its result to the `i18n` key (short for internationalisation) of the file data, so things are kept tidy

```js
module.exports = function detectLanguage() {

  return function(files, metalsmith) {
    //Grab site-wide data from the metadata
    const config = metalsmith.metadata();

    // Given all the information are in the file
    // we can iterate on the values of the object this time
    Object.values(files).forEach(function(file){

      file.i18n = getLanguageInfo(file, config);
    });
  };
};

function getLanguageInfo(file, options){
  // Coming soon, really soon ;)
}
```

You might have noticed the plugin grabs some information from the metadata. Whether at the start of the path like now, or as a suffix, we'll want to limit which values are interpreted as language. "la/confiture.md" doesn't write about jam in Lao, it's just a way to make a nice URL.

We can rely on the list of `languages` already set when [creating the language switcher][language-switcher]. We'll also add a `defaultLanguage` to set the default language. Oh, and let's not forget to register the plugin after the `pathInfo` one, in `src/index.js`:

```js
// ...
const detectLanguage = require('./plugins/detectLanguage')
// ...
.metadata({
  i18n: {
    defaultLanguage: 'en',
    language: ['en','fr'],
    //...
  }
})
.use(pathInfo())
.use(detectLanguage())
// ...
```

Language detection
---

Of all the parts extracted in the `pathInfo`, the `stem` is the one of interest for this. A regular expression, built from the supported `languages`, will capture the language of the file and the translation key from it.

```js
function getLanguageInfo(
  file,
  { defaultLanguage, languages } = {}
) {

  const prefix = new RegExp(`^(${languages.join('|')})/(.*)`);
  const result = prefix.exec(file.pathInfo.stem);

  // `result` will only have a value if the RegExp
  // matched anything. This way we can provide default
  // with the `else`
  if (result) {
    return {
      language: result[1],
      key: result[2]
    };
  } else {
    return {
      language: defaultLanguage,
      key: file.pathInfo.stem
    }
  }
}
```

A little cleanup
---

With that in place, the existing `fr/index.md` automatically get its `i18n.language` variable set to `fr`, while the `index.md` file should have its set to `en`. This means we can move on from using the `language` key to this new value:

- in the global `site.pug` layout, to set [the `lang` attribute of `<html>`][first-step-i18n] 
- in the [language switcher][language-switcher], to display the current language

We can now drop the variable from the front-matter in each of the content file (actually, the whole front-matter as it was all it content). That's that less information to add manually to each file! 

It's not quite the system explained in the intro, but it's a first step. In the next article, let's finally switch to using the suffix of the file to grab the language.

[previous-article]: ../disecting-the-files-path/
[first-step-i18n]: ../first-step-towards-internationalisation/
[language-switcher]: ../switching-language/
