Improving language switcher - Round 2
===

Language switcher currently switches you to the home page all the time.
Poor UX. Let's make it link to the translated content if it can.
It'll involve a couple of steps.

Gathering translations for a given content
---

This'll be done building an index, first by translation key, then by language.

Refactoring the languageSwitcher
---

A little initial refactor to base the language switcher on the list of languages
supported on the site, as well as tidy up the markup (yay for running JS inside the template!)

Refactoring the rewriting
---

Initial implementation got us forward, but doesn't quite suit our case.
To get a link to the translated resource, we need to store the URL it'll be at.
Which is not quite the path it'll be generated at, as we want permalinks.


So let's:

- introduce two concepts: the `ouputPath` and the `outputUrl` (
  got big hopes that the later will also allow to handle some languages being on different domains
)
- compute the permalinks ourselves (for now, we'll set aside the fact that permalinks had a `false` option for not rewriting as permalink)
- split the rewriting into two: computing the path and actually moving the file in the index of files. This'll let plugins like inPlace and layouts do their computation properly as they base it on the key in the index.

Adding the lookup for translated content to the language switcher
---

With all that setup, that's the easy part. Lookup in the index, if it's there, we're good! if not, fallback.
We can inject `lodash/get` to easily lookup values, waiting for optional chaining to be supported by Pug
