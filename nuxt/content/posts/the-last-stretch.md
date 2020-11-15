---
date: 2020-07-28
title: The last stretch
type: post
layout: post.pug
---
Before reaching the relaunch of the site, there's still one more feature to add:
publishing articles. These are not quite like regular pages. They're dated, share a common layout
(and later on probably other features like categories, previous/next navigation and such).
They'll also need to be grouped together in a list on an archive page, allowing to browse what's availble.
And similarly, to help people follow the parution of new articles, be listed in an RSS feed.

Quite a program so it needs to be broken down a bit. Let's see what lies ahead.

Single articles
---

Displaying the content of the articles itself won't be much different than displaying the content of a page.
What changes here is the layout that'll be wrapping it. Just like there needs to be consistency from one page to another, we'll want extra consistency from one article to another. This will require:

1. To identify articles from regular pages
2. To associate a custom layout to the article pages

Articles will also be dated, to let users verify how fresh the information is. This brings its own challenge regarding internationalisation. Dates will need to be displayed in the right order (and with the months in the right language, preferably).

Archive page and feed
---

With posts neatly distinguishable from the regular pages, the first step towards displaying a list of them will be to collect said list. Or those list more accurately, as there'll need to be one for each language.

After that it'll be a matter of generating the HTML for the list. With such dynamic content, we'll need to turn to Pug for generating the content, instead of Markdown like on the other pages. 

As for the RSS feed, rather than writing the markup by hand, why not use the widely used `rss` package. Oldie, but RSS is pretty stable and it seems the goto way for publishing RSS with node looking at which packages depend on it (Ghost, plugins Vuepress, Gatsby...).

Once all that is in, the static site generator will finally be in the state it was at the relaunch (two months ago alreday). It'll then be time to move on towards further improvements, or maybe take a little break for a different adventure. A mix of both maybe, who knows. For now, onward to handling the articles. The next one, actually, will deal with identifying the articles among all the content and giving them a custom layout.
