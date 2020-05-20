Setting up Metalsmith
===

Scaffold a Node project
---

Using my project template.

```sh
npx degit https://github.com/rhumaric/project-template-node --force
```

Install metalsmith
---

```sh
npm i metalsmith
```

Then in index.js

```js
const metalsmith = require('metalsmith');

metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .build(function(err) {
    if (err) throw err;
  })
```

Compile markdown
---

```sh
npm i metalsmith-in-place jstransformer-remark
```

Then add to the pipeline

```js
.use(inPlace())
```

Templating
===

```sh
npm i metalsmith-layouts jstransformer-pug
```

Pug because it allows arbitrary blocks of JavaScript to be run within the template (and doesn't force their syntax, you can write plain HTML if you want)

Add a `layouts/site.pug` file

```pug
<!doctype html>
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Document
  body
    != contents

```

Then add to `index.js`

```js
.use(
  layouts({
    default: 'site.pug'
  })
)
```

Browser reload
---

Shorten feedback when developing.

browser-sync as a server, triggered by nodemon's exit event (rather than it watching `site` which proved unreliable on my machine).
