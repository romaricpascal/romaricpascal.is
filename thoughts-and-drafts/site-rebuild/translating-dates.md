Translating dates
===

Built ins fail on NodeJS. `Intl.DateTimeFormat` is KO :(
https://github.com/nodejs/node/issues/24051

Bring in DateFns. Functional, works in the browser.
A couple of gotchas:

- add a little conversion from our languages to actual locales
- pick a default format when rendering the date if none are passed

And there we go! We have international date!... A bit verbose though.

So how do we pick the format?

Fortunately (for now), the format is the same for both language, so I can just hardcode it.
