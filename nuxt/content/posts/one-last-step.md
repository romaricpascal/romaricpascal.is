---
title: One last step
date: 2020-08-13
type: post
layout: post.pug
---
The last missing step before reopening is to add a RSS feed, to allow people to follow updates.
The [`rss` package][npm-rss] seems to be the main one for generating those with Node. It takes care of rendering the right tags, in the correct structure, which simplifies building the feed a lot.

Unfortunately, Pug won't allow `require` inside its templates. I'd still want to have a matching file inside the `content` folder, rather than have a page popping up "magically" from some new plugin.

[`jstransformer-function`][npm-jstransformer-function] allows just what: a template file that runs arbitrary JavaScript code. After installing it, along with `rss` with `npm i jstransformer-function rss`, we can add two identical `content/feed.xml.function` and `content/feed--fr.xml.function` files. The `.function` will be stripped by `metalsmith-in-place` to make them become `/feed.xml` and `/fr/feed.xml` respectively.

Inside, we can [grab the list of posts similarly to the article list][list-articles], and feed them to the `rss` package to do all the hard work. There's only on little bit of date logistics to fix. The `rss` package would set the `lastBuildDate` to the current date, rather than the most recent content, which we can update with a regular expression.

Let's not forget to disable the layout, too. We don't want that XML wrapped inside the site's HTML shell.

```js
---
layout: false
---
const RSS = require('rss');

const posts = [...(this.groups.byLanguageByType[this.i18n.language]['post'] || [])].sort(function(a, b) {
  return b.date - a.date
})

const feed = new RSS({
  title: this.siteTitle,
  site_url: this.siteUrl,
  feed_url: `${this.siteUrl}${this.outputUrl}`,
  author: 'hello@romaricpascal.is',
  language: this.i18n.language
})

posts.forEach(post => {
  feed.item({
    title: post.title,
    url: `${this.siteUrl}${post.outputUrl}`,
    date: post.date
  })
})

return feed.xml().replace(/<lastBuildDate>.*<\/lastBuildDate>/, `<lastBuildDate>${posts[0].date.toUTCString()}</lastBuildDate>`);
```

It's a wrap (for now)!
---

That was the last feature the site got before being relaunched.

This rebuild certainly gave me a clearer idea of parts that required special attention when internationalising sites ([messages][i18n-messages], [dates][i18n-dates], [language switching][i18n-language-switching], [URLs and file structure][i18n-file-structure]). Building with Metalsmith also allowed complete control of the flow for generating the pages (gather content, enhance it with computed data, group/index them, create pages out of them and finally render them). Great for tinkering, maybe not so much for getting stuff out quickly.

Writing about it (afterwards, rather than alongside as planned) was a great way to uncover little things to tweak from the original implementation. The simple design also allowed to present some CSS patterns ([adjacent sibling combinator][css-adjacent-sibling], [negative margins][css-negative-margins], [centered column][css-centered-column], [partial borders][css-partial-borders]) and accessibility ([headings][a11y-headings],  [landmarks][a11y-landmarks], [skip-links][a11y-skip-links]) which are details I care about. The upcoming design will bring much more to talk about in that area.

Hope you enjoyed reading along. If you have any question/comment/whatever, feel free to reach out on [Twitter][twitter] or by [email]. Future articles will leave the site aside for a bit, the time to give it a nice design so I can talk about its implementation. They won't stop, though, there's more to come (and there's even a [RSS feed][feed] that'll notify you of new ones ;) ). Stay tuned!

[list-articles]: ../listing-posts/
[twitter]: https://twitter.com/romaricpascal
[email]: mailto:hello@romaricpascal.is
[feed]: /feed.xml
[i18n-messages]: ../switching-language/#grouping-all-that-in-a-component
[i18n-file-structure]: ../in-the-right-place/
[i18n-dates]: ../internationalising-dates/
[i18n-language-switching]: ../revisiting-the-language-switcher-linking/
[i18n-urls]: ../in-the-right-place/
[css-adjacent-sibling]: ../embracing-the-adjacent-sibling-combinator/
[css-negative-margins]: ../negative-margins-are-our-friends/
[css-centered-column]: ../centered-column-in-css/
[css-partial-borders]: ../styling-the-article-list/#painting-separators
[a11y-headings]: ../accessible-foundations-headings/
[a11y-landmarks]: ../accessible-foundations-landmarks/
[a11y-skip-links]: ../accessible-foundations-skip-links/
[npm-jstransformer-function]: https://www.npmjs.com/package/jstransformer-function
[npm-rss]: https://www.npmjs.com/package/rss
