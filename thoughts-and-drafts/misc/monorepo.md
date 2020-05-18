Monorepo
===

Projects grow larger and larger, it's easier to break things down into modules with specific responsibilities. 

The `node_modules` approach
---

Node package resolution will go up the tree looking into each `node_modules` folder. This leads to the following:

```
project
-- package.json # Project wide dependencies from the registry
-- node_modules # Where the registry dependencies are installed
-- src
---- node_modules # Local dependencies
------ db
-------- index.js
----- index.js # Can run `require('db')`
```

This allows for quickly splitting things and requiring without a mess of `..`.

Main drawback is that tooling is usually a bit too eager to ignore `node_modules`.Instead of restricting themselves to the top-level `/node_modules` or `/packages/*/node_modules` (see after), they go for a wide `node_modules` that also catches the folder in `src`. Maybe your `.gitignore` is also pretty eager to ignore all `node_modules` too.

This requires some configuration adjustment:

- ESLint : Nothing to do, it ignores `/node_modules` not `node_modules` by default. Give a look at any `.eslintignore` though.
- Prettier: Use the `with-node-modules` option and a `.prettierignore` file (which will have the advantage to make the configuration a bit more obvious). The option is also available for the `eslint-plugin-prettier` ESLint plugin.

> ** TODO ** :
> 
> - Testing tools: Mocha, Jest, Ava
> - Bundler configurations: Webpack, Rollup, Parcel
> - CSS: node-sass/sass, stylelint (don't think PostCSS does any module resolution, but there might be a plugin or two that do)
> - Watchers: Nodemon, Browser-sync...
> - What else does module resolution?

The `packages` approach
---

Using [Lerna] or [PNPM], you can set the modules in a `packages` file. Each module will get its own `package.json` file, which will let it be deployed later on.

> ** TODO **
>
> - Flesh that up a bit more
