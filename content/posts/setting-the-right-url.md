---
date: 2020-06-19
title: Setting the right URL
type: post
layout: post.pug
---
Pages using the `--fr` suffix to show they're in French need to be moved in the right place. Take the `a/blog-entry--fr.md`, for example. Instead of landing in `site/a/blog-entry--fr/index.html` ([remember the permalink][permalink-article]), it needs to be output to `site/fr/a/blog-entry/index.html`.

Even better if we can rename the `blog-entry` to a French translation, say `article`. But let's leave that last bit aside for now, start with the base of the feature and build on it.

A two step process
---

Putting the files in the right place requires two things:

1. Computing the (possibly new) output path for the file, based on its language and translation key
2. "Moving" the file to its final location, which, for Metalsmith, means setting it to the right key in the `files` object.

The first one needs to happen early-ish. This will allow to grab the computed path to generate links. However, `metalsmith-in-place` will use the original file extension to pick-up that it needs to process the Markdown into HTML. If we move the file too early, it'll just not process it.

This requires to break down the feature into two plugins: `computeOutputPath` and `moveToOutputPath`. As they're related, we can place them in the same `plugins/outputPath.js` module that exports both:

```js
exports.computeOutputPath = function computeOutputPath() {
  // Coming soon ;)
}

exports.moveToOutputPath = function moveToOutputPath() {
  // And this one a bit later ;) ;)
}
```

We can then set each of them in the right position in the list of Metalsmith plugins:

```js
// ...
const { computeOutputPath, moveToOutputPath } = require('./plugins/outputPath');
// ...
.use(detectLanguage())
// Compute the output path right after we have all the info
.use(computeOutputPath())
// ...
// And move the file right before the end
.use(moveToOutputPath())
.build(function(err) {
//...
```

Because that last plugin would overwrite the output from `metalsmith-permalinks` we can remove that plugin. We'll take care of generating a nice path in `moveToOutputPath`.

Computing the output path
---

At first, it would seem that the following would do the trick:

- Grab the language and translation key
- If the language is not the default language, set the output path to `<language>/<translation-key>/index.html`
- Otherwise, use `<translation-key>/index.html`

But like the implementation of most features in projects, there are a couple more subtleties.

First, `index.md` files, say the `index--fr.md` of the homepage translation. We don't want it moved to `/fr/index/index.html`, it would be served for `/fr/index/` rather than just `/fr/`. Instead it needs to just remain `<language>/index.html`.

The other issue is that not all files are bound to be output as HTML. Throw a stylesheet or an image in the `content` folder and it'll get copied accross. It has to retain its extension, so we'll have to handle that too.

This is definitely worth its own helper function to be used by the plugin itself:

```js
const { basename, dirname, join } = require('path');

function newOutputPath(file) {

  const slug = basename(file.i18n.key);
  const path = dirname(file.i18n.key);

  // Grab the first extension in the list as the final
  // extension. `feed.xml.pug`, for example,
  // would need to become `feed.xml`
  const extension = file.pathInfo.extensionList[0];

  // Only process extensions that'll output HTML
  if (extension == 'md' || extension == 'html' || extension == 'pug') {
    // Only handle the `index` case when outputing HTML
    if (slug === 'index') {
      return join(path, 'index.html')
    } else {
      return join(path, slug, 'index.html')
    }
  }
  
  if (extension) {
    // Ensure they get the proper extension
    return join(path, `${slug}.${extension}`)
  }
  return join(path, slug)
}
```

We can then use that function to compute the final output path and attach it to the `file`'s data.

```js
// Add `normalize` to the list of required functions
// to deal with `./` paths
const { basename, dirname, join , normalize } = require('path');

exports.computeOutputPath = function rewrite() {

  return function(files, metalsmith) {

    Object.values(files).forEach(file => {

      const { defaultLanguage } = metalsmith.metadata();

      let outputPath = newOutputPath(file);

      if (file.i18n.language !== defaultLanguage) {
        // Remove any `/./` that might have sneaked in
        outputPath = normalize(join(file.i18n.language, outputPath));
      }

      file.outputPath = outputPath;
    });
  };
};

function newOutputPath(file) {
// ...
```

Moving the files
---

Thankfully, moving the files is way less heavy than computing where they should go. With their `outputPath` already computed, it's a matter of:

1. deleting where they were previously so they don't get writen in two different place.
2. adding them at the right key in Metalsmith's `files` object

In that order, otherwise the files would get deleted if their path didn't change... not ideal.

```js
exports.moveToOutputPath = function moveToOutputPath() {

  return function(files) {

    Object.entries(files).forEach(([currentPath, file]) => {

      if (file.outputPath) {
        // Delete first in case the outputPath
        // is the same as the current path
        delete files[currentPath];
        files[file.outputPath] = file;
      }
    });
  };
};
```

This would be good place to check that different files don't step on each other's toes. `fr/index.md` would get written in the same place as `index--fr.md`.

To handle this, we can throw a custom exception when a file already exist for the `outputPath`. For debugging, it'll be handy to know which `outputPath` is at fault, but also which source files are trying to get written there. Fortunately, the information is kept nice and warm in the `pathInfo` of the file (that first plugin is really paying off now).

```js
// ...
  delete files[currentPath];
  // Check if there's a file left before
  // writing at `file.outputPath`
  if (files[file.outputPath]) {
    throw new DuplicateOutput(
      file.outputPath,
      file,
      files[file.outputPath]
    );
  }
// ...

class DuplicateOutput extends Error {
  constructor(outputPath, fileA, fileB) {
    // Build a nice helpful message with all the info
    // coming from the constructor's argument
    super(`
      Duplicate output at ${outputPath}.

      - ${fileA.pathInfo.path}
      - ${fileB.pathInfo.path}
    `);
  }
}
```

This will bluntly break the build if two files write in the same place, but let us know which files to look for for fixing things.

Translating paths
---

The last part is about translating paths. Well, for now, just their last part, which is enough to get the site launched again. For that, let's expect each file that wants a different name to have a `slug` attribute in their front-matter.

We can then use that in the `newOutputPath` function to set the last part of the path for this file.

```js
// ...
// Instead of const slug = basename(file.i18n.key);
const slug = file.slug || basename(file.i18n.key);
// ...
```

This marks the finish line (for now) for placing translated files right next to each other. Future efforts will certainly include translating the rest of the path. That's a good bit of effort, though. Keeping in mind that the original aim is to get the new website out, better move on to something that gets it closer.

The next bit of work on the generation itself would be updating the language switcher to send to the translated pages, now that there's a translation key to link them together. However, I feel like talking CSS a bit. How about some words on the minimal launch styles. Yes, yes, there's already enough to talk about with so little styling. See you for the next article.
