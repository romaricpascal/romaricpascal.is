---
date: 2020-06-12
title: Dissecting the files' paths
type: post
layout: post.pug
---
[The upcoming features][upcoming-features] call for a few custom Metalsmith plugins. Let's dive in and create the first one. It will simplify extracting information from the path by pre-cutting it into interesting parts.

Anatomy of a Metalsmith plugin
---

But how does a Metalsmith plugin looks like? Up til now, all that happened is passing the results of a function coming from an existing package to Metalsmith's `use` method.

This `use` method expects to be given a `Function`, with which it will process the files before passing them on to the next plugin in the chain. Usually, this function requires some configuration, this is why it gets wrapped into another function that will capture some `options`. 

Even if the plugin doesn't require options, best to still wrap it to save having to think whether that specific plugin is wrapped or not.

Sounds like a lot of function, but in practice, it looks like that: 

```js
function metalsmithPlugin(options) {
  return function processor(files,metalsmith, done) {
    // Process the `files`, according to the `options`
  }
}
```

Of the 3 arguments for that `processor` function, `files` is the main one. It's an object indexing the files with their path as key and file information (contents, associated data) as value. Plugins can add/remove data from the file info, change their path by setting them to a different key... it's pretty free form there. Once all plugins have gone through, the resulting `contents` of the file object will be written at the location set as the key for that file.

`metalsmith` then provides a reference to Metalsmith. This mainly allows access to the `metadata()` content for reading or adding site-wide data. Finally, `done` is a callback if the plugin needs to be asynchronous.

Extracting path information with a Metalsmith plugin
---

This plugin will use [Node's path utilities][node-path] to grab a few parts of the path and add them to the file information. It'll add all these parts under a new `pathInfo` key (to keep things tidy):

- the `path` itself, that Metalsmith only stores in the key
- the `dirName`, path to the directory of the file
- the `fileName`, name of the file with its extension(s)
- the `baseName`, same, without its extension(s) 
- the `stem`, path to the file, with the file extension removed (this will help extract the translation key)
- the finale `extension` of the file, all its `extensions`, both as strings
- as well as an `extensionsList` `Array`.

Given a `filePath`, a function can return all this with:

```js
const { dirname, basename, join } = require('path');

function getPathInfo(filePath) {
  const dirName = dirname(filePath);
  const fileName = basename(filePath);
  // Use destructuring to quickly get the list of extensions
  const [baseName, ...extensionsList] = fileName.split('.');
  return {
    path: filePath,
    dirName,
    fileName,
    baseName,
    stem: join(dirName, baseName),
    extension: extensionsList[extensionsList.length - 1] || '',
    extensions: extensionsList.join('.'),
    extensionList: extensionsList,
  };
}
```

We can then use it to create the actual Metalsmith plugin. It will loop through each file and set a new `pathInfo` variable
with all the content of the function:

```js
const { dirname, basename, join } = require('path');

/**
 * A metalsmith plugin to provide path breakdown
 */
module.exports = function pathInfo() {

  return function processor(files) {

    Object.keys(files).forEach(function(filePath) {

      files[filePath].pathInfo = getPathInfo(filePath);
    });
  };
};

function getPathInfo(filePath) {
//...
```

It's all nice and tidy like that. `getPathInfo` extracts the parts of the path, the plugin takes care of Metalsmith logistics. Not gonna lie, it didn't quite come out nicely separated like that. During development, the plugin held everything for a long while before things got split to the `getPathInfo` function. 

Once the plugin imported in `src/index.js`, it can be added to the current processing. Pretty early in the list, right after setting the `metadata()` as future plugins will depend on its data.

```js
// ...
const pathInfo = require('./plugins/pathInfo');
// ...
.metadata(/*...*/)
.use(pathInfo())
.use(inPlace(/* ... */))
// ...
```

This won't change much to the output of the site for now. It'll enable the next plugin to detect the language and translation key much more easily though. This will be the topic of the next article.

[upcoming-features]: https://romaricpascal.is/posts/planning-ahead/#the-plan
[node-path]: https://nodejs.org/api/path.html
