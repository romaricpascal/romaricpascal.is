Build automation
===

Nodemon to rebuild
---

```sh
npm i -D nodemon
```

Make sure that the main field is set.

Configure the files to be watched in `nodemon.json`:

```json
{
  "ext": "js,pug,md,json",
  "ignore": [
    "site"
  ]
}
```

Then `npx nodemon` will rebuild everytime we save
