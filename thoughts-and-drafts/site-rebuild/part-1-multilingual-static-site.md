Part 1 - Multilingual static site
===

Rough list of ideas to go through re. the multi-lingual static site generator.

Multilingual features
---

- translate pieces of texts throughout the app
- translate dates (both format and name of months)
- translate URLs (final slug, parts or full path, domain)
- notify language in links (`hreflang`)
- switch between languages (to root, to same content)
- pick templates according to language (may not be needed)

Rough plan
---

1. The bare minimum: 2 HTML pages (+ 2 feed.xml page to let people follow?)
2. Prologue: Out with the current version (spidering the old site, fixing errors, 4042302). Maybe 2.1 and 2.2
3. Setting up a static site generator: What is it, why Metalsmith and getting it set-up
4. Basic logistics: Layout + MD compilation + Locale key for I18n to be picked up by the layout
5. Language detection from path + URL generation
6. Language switcher per page: Index pages by translation key
7. Translating messages
8. Translating dates
9. Indexing pages
10. Archive page (blog archive and feed... finally, up to then, it'll have been generated)
11. Pagination

At that point, that should be enough JavaScript ;) Time to move to HTML & CSS
