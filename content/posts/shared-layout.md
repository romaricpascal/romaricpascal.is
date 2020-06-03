---
title: A shared layout
type: post
layout: post.pug
---

With Metalsmith in place, time to do a little more than just copying files around. Most the pages of the site will share a common layout, and it would be innefficient and error-prone to copy-paste it from file to file. Let's remediate to that and separate the layout from the content itself.

Wrapping the content in a common layout is a standard thing to do with static site generators, and when building websites in general. Metalsmith provides a ready made plugin for that, aptly named [metalsmith-layouts],so let's bring it in.

Picking a templating language
---

Sharing a common layout will require the use of templates. And there are plenty of templating languages around. Each with their own syntax more or less close to HTML, each with their own API.

A key thing for me is that is allows to run arbitrary JavaScript code inside the template. As much as we want to keep business logic out of the templates, there's always some templating logic that will require a little more than an `if` or a loop. Maybe building a couple of HTML attributes from the template data. Having to edit a file miles away from the template itself gets in the way more than it helps.

This led to the choice of [Pug] for templating.

The setup
---

To get the layouts in place, we'll need the `metalsmith-layouts` plugin itself. Under the hood, it uses [`jstransformer`][jstransformer], a library that standardises the API for calling the various existing template libraries. We'll need to install it too, along with the package for Pug, `jstransformer-pug`.

```sh
npm i metalsmith-layouts jstransformer jstransformer-pug
```

We can then add the plugin to Metalsmith in the `src/index.js` file.
The plugin will need the name of a default template, so let's say `site.pug`.

```js
/* ... */
const layouts = require('metalsmith-layouts')
/* ... */
  .destination('./site')
  .use(
    layouts({
      default: 'site.pug'
    })
  )
  .build(function(err) {
/* ... */
```

The layouts are looked up from the `layouts` folder, so let's create a `layouts/site.pug` file with some common parts:

```pug
<!doctype html>
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Romaric Pascal
  body
    != contents
```

We'll quickly need to update it to make sure each page has a different title, but it'll wrap each piece of content in the same shell of HTML. To avoid injecting malicious tags, Pug escapes all the data it outputs. Handy when it comes from user input, but here it's our own content that we fully control. We can safely output it unescaped with `!=` rather than `=`.

Having the layout in place now allows to reduce the files in the `content` folder to just the content bits. Say a `src/index.html` file like this:

```html
<h1>It works!<h1>
```

Running `node src/index.js`, Metalsmith will combine it with the layout to output the following as `site/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Romaric Pascal</title>
  </head>
  <body>
    <h1>It works</h1>
  </body>
</html>
```

There we go! We can edit a unique layout file to affect all the pages of the site. That's already better than copy-pasting. Now lets go further and shift to having the content written in Markdown, rather than plain HTML. It'll be much easier to edit, but it'll be for the next article.

[metalsmith-layouts]: https://github.com/metalsmith/metalsmith-layouts
[Pug]: https://pugjs.org
[jstransformer]: https://github.com/jstransformers
