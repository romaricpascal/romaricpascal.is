---
title: To build or not to build
---
Nowadays, the CSS and JavaScript browsers get is rarely the one written by the developers. In between it's been heavily processed in search for improved maintainability and/or performance: smaller files, better code organisation, better abstractions... Like a lot of things in development, those benefits come with trade-offs either for users or the developers. This article will try to highlight the gains and costs for 3 usual steps of building JavaScript and CSS:

- Minification
- Bundling
- Compiling

Minification
---
The aim of minification is to send as small a file as possible to the browser, in complement of any compression (GZip, Brotli…) set up for transfering the file. It usually gets rid of unnecessary characters (whitespace, comments), can try and regroup some rules or properties for CSS, shorten function and variable names in JavaScript… This is the role of tools like Terser for JavaScript or CSSNano for CSS.

Unless the asset are very minimal to start with, this is usually yields a welcome gain for users, shaving kilobytes of data to be transfered. However, because the code in the browser is now completely mangled, it makes it difficult/impossible to read, getting in the way of debugging. While this can be deactivated during development, it can make investigating bugs in production much trickier. Source-maps can be set up to let browsers convert back the code to the authored sources in their dev tools, though. A little bit of logistics to make sure is handled.

Bundling
---
Bundling gathers multiple files into one, allowing to split the code into well organised smaller modules, as well as consume libraries. This can bring welcome gain in maintainability and development speed. It also has a side effect of reducing the number of requests (with costly TLS setup for each of them), though HTTP/2 might be making this less of an issue.

It's not quite as simple as putting the files of each module after one another (though it can be a bundling strategy for small enough projects). Both CSS and JavaScript have syntaxes to control which module loads which and the order needs respecting, as well as encapsulation for JavaScript. That's the role of tools like `postcss-import`, SASS (or other pre-processors) for CSS. For JS, it'll be Webpack, Rollup, Parcel that'll handle that task (sometimes they'll also play some part in the CSS part too).

Aside from the configuration cost for those tools, the gain in maintainability and code reuse brings a few major questions that affect the performance of the site for the users:

- should everything end up in one big file? should some parts only be loaded on demand (for ex. a heavy feature used in a handful of places)? This calls for decisions on where and how (new entry point, dynamic import) to split the code
- how to make sure to pack only what's necessary and avoid including large unused chunks of code. This is especially a concern when loading libraries. On the JavaScript side, tree-shaking does a good job of leaving non imported code out of the final bundle. It's much harder to detect which CSS bits to leave out, but extra tools like purgecss or uncss can take step in that direction, looking at the HTML the bundled CSS will be applied to.

Compiling
---
It can be handy to use different abstractions that those offered by the browser: a different language or just cutting-edge features that are not yet supported across the board. Those need to be compiled down to something the browser to run first. That's what CSS preprocessors (SASS, LESS, Stylus…) do, as well as some PostCSS plugins (`postcss-preset-env` for example). On the JavaScript side, Babel seems to lead the way when it comes to using the latest features.

Those new abstractions help our work as developers, but we need to consider the cost on the final code run by the browser. They may hide the generation of unnanticipated code (SASS `@extends`) bloating the final file (when not the source of bugs). The extra code generated to make older browsers understand those new features might also grow the downloaded code unnecessarily. Progressive enhancement and loading uncompiled `module` bundles in newer browser can help provide a much lighter experience.

In the end, as the complexity of projects increase, build tools certainly help keeping things maintainable. More than a default, they should be chosen mindfully to match the project. Maybe somethimes part of the build could be left out in favour of a simpler setup, which would make things more approachable too. Especially with browsers supporting more and more modern features.
