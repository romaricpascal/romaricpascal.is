---
title: Writing markdown
type: post
layout: post.pug
---
Let's face it, editing HTML to write content is not the most enjoyable experience. HTML sure helps giving meaning to said content, but littering the page with opening and closing tags gets in the way of just writing. Markdown is a much lighter alternative.

Just like using templates for doing the layout, converting Markdown to HTML is also a pretty standard thing when it comes to static site generation. And here again, Metalsmith offers a pre-exising plugin to handle that, `metalsmith-in-place`.

Installation
---

Like `metalsmith-layouts`, this plugin also relies on `jstransformer` to transform the Markdown. And the same as for the layouts, we'll need to bring in the corresponding library for processing Markdown. Each of the main Markdown processing libraries have their `jstransformer-...` counterpart.

`remark` is the most appealing to me, with its numerous plugins and extensibility. It is also compatible with `retext` (for processing the text itself) and `rehype` (for the HTML part), which opens up even more possibilities.

```sh
npm i metalsmith-in-place jstransformer-remark
```

With the packages installed, we can then add the plugin to Metalsmith to get the markdown compiled.

```js
/* ... */
const inPlace = require('metalsmith-in-place')
/* ... */
  .destination('./site')
  .use(inPlace())
  .use(
    layouts({
/* ... */
```

Now we can turn the `content/index.html` page into `content/index.md`:

```md
# It works!

We can even have:

- some lists
- with multiple items

And **all** the nice markdown things.
```

The plugin will not only turn it into HTML, but also update the path where the file will be written to become `site/index.html` rather than `site/index.md`. Perfect!

Adding Remark plugins
---

Remark was chosen for its extensibility. It supports a [system of plugins](remark-plugins) to customise how the Markdown becomes HTML.

Unfortunately, using a `.remarkrc.js` file to export Remark's configuration won't work. Bit of a shame, but thankfully, `metalsmith-in-place` allows to pass option to the library transforming the content. 

Using its `engineOption` option, we can configure `remark` to use the `remark-slug` and `remark-autolink-headings` to make each heading linkable.

```js
/* ... */
.use(inPlace(
  engineOptions: {
    plugins: [
      require('remark-slug'),
      require('remark-autolink-headings)
    ]
  }
))
/* ... */
```

It'll need a little styling, but now there's markup to let users easily link to specific sections in the page. Might need some revisiting later (accessibility, especially), but `remark` got configured OK. Win!

One last premade Metalsmith plugin to sort some URL logistic, and then it'll be custom features for internationalised content.

[remark-plugins]: https://github.com/remarkjs/remark/tree/master/doc/plugins.md
