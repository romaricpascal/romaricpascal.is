Detecting language
===

Create a second plugin. Goal is to extract two piece of info:

- `language`
- translation `key` for the page, which will help match translations of the same content

To keep things tidy, we'll add them to the file under an `i18n` key.

First, we need some site wide metadata: a defaultLanguage as well as the supported languages.

Initial implementation to match what we have so far and use the path prefix.

Set the function in the options to easily override the matching. Other options could be default language and supported languages
