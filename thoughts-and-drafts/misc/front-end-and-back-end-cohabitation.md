Front-end/back-end code cohabitation
===

Having JavaScript back-end and front-end code in the same repository brings a few decisions to make.

Modules
---

NodeJS consumes CommonJS modules for now. On the front-end, bundlers take advantage of ES6 modules to only pack the exports that are actually used.

Writing only one type of module definitely has advantages for codebase consistency. In that respect, ES6 is the one to pick. That's also where JavaScript is headed as a whole. 

Now how to make it work for the backend? NodeJS 13 has experimental support for them, so hopefully the next LTS version will have full support and we can write ES6 modules.

For older versions, there is the `esm` modules that replaces `require` globally to allow importing ES6 modules. A couple of things to check:

- import of `.mjs` files with `esm`, rather than `.js`
- use alongside `nyc` seems to report no coverage :'(

Linting
---

Linting also requires a little configuration. Frontend and backend code will run in different environments, hence having access to different globals and language features (though the later can be taken care of by compilers). Different sets of rules or presets might need to be enforced too (for ex. `eslint-plugin-node` for the backend).

As both are broken down in smaller packages, the linting needs to affect only the relevant files with the right options.

Loading the frontend code
---

First, compiled frontend code should end up somewhere that'll be served by the backend. Maybe in a `public/front-end` directory that's `.gitignore`d.

The compiled bundle will likely have a hash in their name to allow long-term caching. This will require a manifest file to link `app.js` to `app-b846a2ed6.js` so the backend can set the right path in the `<script>`'s `src`. Most (all?) bundlers have a plugin for that.

Dev
---

During development, live-reloading is a big time saver (simple live-reloading, I'm not sold on HMR, to be honest). 

`nodemon` can handle the backend part and `browser-sync` watch the compiled bundles. Two things:

- can `nodemon` ping `browser-sync`
- `nodemon` needs to ignore the frontend files
- the bundler need to only watch and build, not live-reload.
