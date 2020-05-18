JavaScript
==========
- Concerns: data, presentation (at least), network, HTML binding (declarative or imperative )
- ResponsiveJS: `matchMedia` and `ResizeObserver` (https://developers.google.com/web/updates/2016/10/resizeobserver)
- Vanilla-Libraries-Framework spectrum
- Gather libraries that care about accessibility (eg. a11y-dialog, dragon-drop, https://van11y.net/...)
- Feature detection & polyfilling: Modernizr? polyfill.io (+ local fallback?), mustard cutting
- Loading in browsers: inline script, remote script, multiple scripts, built file, (`type=module`), async snippet, non blocking snippet (need to find link back((https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)
- Code splitting and cache invalidation
- Concept of replacing browser's functionnality (so not breaking them)
- Patterns/Concepts:
  - AJAX & Fetch
  - Array functions (map, filter...)
  - Immutability: `Object.assign`,
  spread operator for easily updating one property...
  - Functional aspects: Function as objects you can manipulate, debouncing/throttling, lazy evaluation, piping...
  - Asynchronous structures: Promises, Observables
  - Timers (setTimeout/setInterval, rAF,...)
  - Regex: https://flaviocopes.com/javascript-regular-expressions/
  - GDPR tracking: https://gist.github.com/joachimesque/cdb7393c7fe1024d9fa3a2c5e5bf8815