---
title: Internationalising dates with JavaScript
date: 2020-08-05
type: post
layout: post.pug
---
Articles come with a new metadata to display: their date. Without it, no way to know when their content was written and if it can still be applied.

Fortunately, Metalsmith already understand that a `date` property set in a file's front-matter needs to be transformed in a JavaScript `Date` object. This leaves only the formatting to do.

Not just turning the object into a human understandable `String`, but handling the correct rendering depending on the language.

JavaScript's internationalisation API
---

Natively, the `Date` object offers a `toLocaleString` method to handle just our situation. It provides [multiple options][toLocaleString-params] for:

- selecting a locale (the language and formatting properties for dates, numbers… in that language) 
- picking which parts of the date to display (year, month, day, hours, minutes, seconds, timezones…) 
- choosing how to display them (short, long, numeric or text...)
- or using some pre-sets formats for the date and/or time

My preferred format for displaying date is to have the days on 2 digits (consistent length), the months as abbreviated text (lifts ambiguity between UK and US date) and 2 digits or full year (depending on space available). To achieve this with the API, it becomes:

```js
const date = new Date(2020,07,04);
date.toLocaleString('en-gb', {year: 'numeric', month: 'short', day:'2-digit'}) // 04 Aug 2020
date.toLocaleString('fr', {year: 'numeric', month: 'short', day:'2-digit'}) // 04 août 2020
```

It's a bit more verbose than the `DD MMM YYYY` kind of strings used by a lot of formatting libraries. It makes it up in clarity, in my opinion (is 'M' the month on a [single digit][m-numeric]? or in [short text][m-short-text]?).

To format multiple dates the same way, it'll be more convenient (and [performant][toLocaleString-perf]) to build an `Intl.DateTimeFormat` and reuse it for each date. Among all the internationalisation goodies inside the `Intl` object, it's the one responsible for… well… formating dates. It takes the [same arguments as `toLocaleString`][toLocaleString-params] (or maybe `toLocaleString` takes the same as `DateTimeFormat`? feels likely): locale, then format options.

```js
const formatter = new Intl.DateTimeFormat('fr', {year: 'numeric', month: 'short', day:'2-digit'});
const date = new Date(2020,07,04);
formatter.format(date); // 04 août 2020
```

Sounds perfect!

Internationalisation with Node
---

Those internationalisation API is supported in Node. They're [also in modern browsers (and IE11)][intl-browser-support], have a thought before sending kilobytes to users for formatting dates. 

However, running a version of Node lower than 13 (like the 12.x versions with Long Term Support at the time of this writing), `toLocaleString()` or `format()` might keep returning an American English date for a any locale.

Node delegates internationalisation to [ICU][ICU],a C/C++ library. Before version 13, its default build embarked only a "small" part of the data for ICU, [assuming most users won't need the full version][node-icu-dataset].

The simplest workaround is to upgrade Node to a newer version (like 14.x, which will get Long Term Support).

Not possible? All is not lost, the full ICU data can be installed through the `full-icu` NPM package. From there, you can give Node a hint of where it is via the `--icu-data-dir` flag or the `NODE_ICU_DATA` variable. Either can be conveniently set in an NPM script for starting the project, making it very portable:

```json
{
  "scripts": {
    "start": "node -icu-data-dir=node_modules/full-icu src/index.js",
    "dev": "nodemon --exec npm start"
  },
  "dependencies":{
    "full-icu": "^1.3.1"
  }
}
```

As a last resort, it's always possible to build Node from source with the appropriate flag: `--with-intl=full-icu --download=all` (also [works with NVM][nvm-from-source]). This implies ensuring every machine that'll run the code has Node built the right way: each developer's device, each server, each continuous integrations environment… Feels like a recipe for headaches.

Metalsmith and the internationalisation API
---

Now let's use this internationalisation API to format the date of each post. As there'll be multiple dates to format in one run, we'll create one `Intl.DateTimeFormat` for each language, inside the `src/index.js` file:

```js
//...
const FORMATTERS = {
  en: new Intl.DateTimeFormat('en-gb', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }),
  fr: new Intl.DateTimeFormat('fr', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
};

metalsmith(process.cwd())
//...
```

We'll then need to have them reach the templates through the site's metadata. Pug unfortunately broke when calling their `format` method from the templates. Instead, we can provide the templates functions wrapping that call and things worked just fine:

```js
//...
.metadata({
  //...
  dateFormats: {
    en: date => FORMATTERS.en.format(date),
    fr: date => FORMATTERS.fr.format(date)
  }
  //...
})
//...
```

From there, we can use those functions in the `layout/post.pug` template to display the date right after the title.
The `<time>` tag will provide some semantics to indicate that it's some time data and provide an ISO representation of the date via its `datetime` attribute.

```pug
  //- ...
  time.margin-top--0(datetime=date.toISOString())
    = get(dateFormats,i18n.language)(date)
  //- ...
```

The date is now nicely set for each post, in the right language. That makes each single post page ready (for now) and we can move on to displaying the listing of posts in the next article.

[toLocaleString-params]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#Parameters
[toLocaleString-perf]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#Performance
[m-numeric]: https://date-fns.org/v2.14.0/docs/format
[m-short-text]: https://www.php.net/manual/en/datetime.format.php
[intl-browser-support]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#Browser_compatibility
[ICU]: http://site.icu-project.org/
[node-icu-dataset]: https://nodejs.org/docs/latest-v12.x/api/intl.html#intl_internationalization_support
[nvm-from-source]: https://github.com/nvm-sh/nvm/issues/1719
