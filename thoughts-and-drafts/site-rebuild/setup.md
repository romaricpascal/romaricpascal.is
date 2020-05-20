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

Then

```js

```
