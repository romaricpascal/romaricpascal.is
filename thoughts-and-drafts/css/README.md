- Selectors
     - Specificity: classes only (except ARIA states?), low specificity, with maybe an increase towards the end of the file
     - Naming: BEM, what it does (`btn--red` rather than `btn--delete`) rather than what it is, responsive affixes (`@size` suffix? not great with template languages like slim/haml though...)
     - Nesting: Specific elements > nope, unless with `:not([class])` (Implies JS hooking via `data-attributes`... doesn't sound bad to me)?, `*` or `* + *` have their uses, avoid styling other blocks in any case, use modifiers. What about nesting own elements in blocks? Sounds a great way to scope things further when using responsive suffixes. Elements styles only get triggered if the parent is active.
   - Isolation:
     - Of concerns (layout, structure, cosmetic... divide properties in list)
     - Of "target": Style only your elements, not other blocks
     - https://tzi.fr/slides/riviera2018-cmp/
   - Bringing into HTML: `style=""`,`<style>`,`<link rel="stylesheet">`, CSS in JS, which use for each?
   - Processing (SASS & PostCSS):
     - What for? Which plugins/libs to use
     - Variables -> maps -> functions -> mixins -> rulesets for single-source of truth
   - File structure:
     - ITCSS? Atomic looks simpler? Other?
     - Generators (`hygen`) to help manage structure
   - Enforcement: linting
      - Formatting -> Prettier (no time to spend debating this)
      - Linting -> Stylelint (which rules?)
   - Patterns
     - Grouped by concern? Relation to markup (should be light by now)
     - Base styles for elements (eg. buttons resets)
     - Responsive background images
     - Rythm pattern (` > * + * { margin-{top,left}: <length>;}` + `no-rythm` + `__half`...)
     - Utility classes (sole-ish use of `!important`)
     - z-index management
     - shadow management (elevation?)
     - color management (avoid opacity, prefer HSL in source which is more human and allows hue rotation) https://medium.com/@mwichary/dark-theme-in-a-day-3518dde2955a
     - typography management (map for weights, map for available font-families (+wgt/style), font loading (merges with JS a bit? WebFontLoader. ))
       https://mobile.twitter.com/levelsio/status/991721812344979456
       https://medium.com/eightshapes-llc/cropping-away-negative-impacts-of-line-height-84d744e016ce
       https://www.zachleat.com/web/the-compromise/
     - buttons (& their reset): https://fvsch.com/code/styling-buttons/
     - line breaks: https://css-tricks.com/where-lines-break-is-complicated-heres-all-the-related-css-and-html/
     - animations (`will-change`, easings, FLIP...)
     - focus (`:focus`, `:focus-within`, `:focus-visible`)
     - print stylesheets
       https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/
     - length management: relative lengths (`em`,`rem`, `%`), responsive ramps (combining `em`/`rem` and `vw`(/`vh`/`%`)?)