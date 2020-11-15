---
date: 2020-06-17
title: Detecting language - Round 2
type: post
layout: post.pug
---
Let's make that second pass at detecting languages from the file's path. [Detecting it from the first folder][previous-article] provided a good base for the structure of the plugin. This time, [as intended][plan], let's get it from an optional `--<language>` suffix in the filename.

A little refactoring
---

The code for `getLanguageInfo` currently takes care of two things:

- detecting the language from the first folder in the file's path

    ```js
    const prefix = new RegExp(`^(${languages.join('|')})/(.*)`);
    const result = prefix.exec(file.pathInfo.stem);

    if (result) {
      return {
        language: result[1],
        key: result[2]
      };
    //...
    ```

- assigning a default language if there is none

    ```js
    // ...
    } else {
      return {
        language: defaultLanguage,
        key: file.pathInfo.stem
      }
    }
    ```

To make things more flexible, let's split that into two little functions.

```js
function pathPrefix(file,{ languages } = {}) {
  const prefix = new RegExp(`^(${languages.join('|')})/(.*)`);
  const result = prefix.exec(file.pathInfo.stem);
  if (result) {
    return {
      language: result[1],
      key: result[2]
    };
  }
}

function defaultLanguageInfo(file, { defaultLanguage } = {}) {
  return {
    key: file.pathInfo.stem,
    language: defaultLanguage
  };
}
```

With them, `getLanguageInfo`'s role will be to pick up the result of the first that detects a language. Because each of them take their option from a second `Object` parameter, this also makes `getLanguageInfo`'s code simpler. No need to concern itself with which key of the options to pick and pass as second argument. Each detection function is responsible for the entirety of its business. Tidy!

```js
function getLanguageInfo(file, options) {
  return (
    pathPrefix(file,options) ||
    defaultLanguageInfo(file, options)
  )
}
```

This not only makes the code read more explicitly, it'll allow to add new methods for grabbing the language more easily.
Create a new function for the detection and call it before the others. And that's what we're going to do just now!

Not quite the same, not so different
---

[Regular expression did a good job to detect the initial folder][regular-expressions]. Let's use them again for detecting a possible suffix at the end of the files.

```js
function filenameSuffix(file, { languages } = {}) {

  const suffix = new RegExp(`(.*)--(${languages.join('|')})`);
  const result = suffix.exec(file.pathInfo.stem);

  if (result) {
    // Given the shape of the regular expression
    // the language will be in second place this time
    return {
      language: result[2],
      key: result[1]
    };
  }
}
```

Once added first in the series of detection of `getLanguageInfo`, a `index--fr.md` content will have its language detected properly.

```js
function getLanguageInfo(file, options) {
  return (
    filenameSuffix(file, options) ||
    pathPrefix(file,options) ||
    defaultLanguageInfo(file, options)
  )
}
```

And that's the language detection in. You could imagine using other parts of the `pathInfo`, like the first extension (`.fr.md`), to provide alternative detection too. But we have enough here.

It's only half of generating the content from that `index--fr.md` file. For now it ends up in the `/index--fr/` URL. Not quite the `/fr/` place it's meant to be. That'll be the work of the next article.

[previous-article]: ../detecting-language-first-pass/
[plan]: ../planning-ahead
[previous-article]: ../detecting-language-first-pass/#language-detection
