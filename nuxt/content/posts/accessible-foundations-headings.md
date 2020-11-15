---
date: 2020-07-02
title: Accessible foundations - Headings
type: post
layout: post.pug
---
Headings are an good part of making content accessible. They break down content into well identified parts, easier to digest. They also provide important shortcuts for assistive technology users. In the 2019 WebAIM Screen Reader User Survey, [68.8% of the respondents said they use headings to find their way through the pages][webaim-survey-headings]. Indeed, screen readers (for example) provide a list of all the page headings and ways to jump between them, allowing users to quickly get to a section they'd be interested in.

No magic
---

For that to happen, though, making some text larger and/or bolder is irrelevant. Only sighted users will interpret that as a heading. Machines need semantic markup to tell with certainty that a particular piece of text is a heading.

This is the role of the `<h1>` to `<h6>` tags in HTML, each number representing the level of the heading. `<h2>` start subsections of the previous `<h1>`, `<h3>` of the previous `<h2>`... Creating a clear outline with these elements, with coherent levels (no skipping, for example), [helps users skim through the page][webaim-survey-heading-levels].

It's technically possible to have more than one `<h1>` on a page. However, having only one, usually announcing the topic of the page, gives a clear point of entry. On this page, the title of the article, for example. 

This doesn't mean it needs to be the first heading. [Sections of the header, can be introduced with an `<h2>`][w3c-headings], for example. This doesn't mean it needs to be the boldest/largest piece of text on the screen either. Here, it's more of a design concern, but it can be particularly useful for more app-like designs.

Managing heading levels
---

Past that main `<h1>`, there's no avoiding managing the level of each heading to ensure a correct hierarchy. You might have encountered HTML5's proposal of using sectioning elements and only `<h1>`s to [compute the heading's hierarchy][outline-algorithm]. Unfortunately, this [never got implemented by browsers][no-outline-algorithm]. `<h2>`, `<h3>`... are still very much needed.

This becomes a concern when some content gets to come from different sources, or rendered at different heading levels (on separate pages). On this article, for example, the `<h1>` comes from metadata in the file's front-matter.

```md
---
title:  Accessible foundations - Headings
type: post
---
```

The rest of the headings comes from the compiled Markdown. The catch is to start the headings in the Markdown at the second level.

```md
## Second level heading

or

Second level heading
---

I tend to prefer this last one, actually ;)
```

Easy enough for one person, especially when it's the one building the site. It doesn't really scale when we're talking of multiple people adding content to a CMS, for example. 

No magic solution to offer here ,though (happy to learn of one if you have it). Maybe [automatically shifting heading levels to the right depth][heading-levels-shifting] can help a bit. Limiting options and adding validations in the CMS could also be worth exploring. For example, not providing anything in the menus to insert a `<h1>` if already generated elsewhere, or display an educational error message if the heading hierarchy looks off.

Checking the heading hierarchy
---

Hunting each heading in the middle of all the markup doesn't feel like much fun. Fortunately, there's other ways to checks that headings are ordered properly.

I like the [headingsMap extension for Firefox][headingsmap-firefox] (also available [for Chrome][headingsmap-chrome]) to quickly give a glance at the list of headings. It'll highlight headings which are out of place in the hierarchy, as well. This is also something that the [Axe extension][axe] will do (among other accessibility checks).

And there's always the option to look at the lists detected by screen-readers. Both [Mac][voiceover], [Windows 10][narrator] and [Ubuntu][orca] come with one built in, and [NVDA][nvda] can be freely installed on Windows.
  
In complement of headings, there are other ways to help navigation inside a page for assistive technologie users. Definitely enough to fill the next article, which will deal with ARIA landmarks.

[webaim-survey-headings]: https://webaim.org/projects/screenreadersurvey8/#finding
[google-multiple-h1]: https://www.youtube.com/watch?v=zyqJJXWk0gk&list=PLKoqnv2vTMUM9wKeb-Gvm8bgpFM72yiXw
[webaim-survey-heading-levels]: https://webaim.org/projects/screenreadersurvey8/#heading
[w3c-headings]: https://www.w3.org/WAI/tutorials/page-structure/headings/#main-heading-after-navigation
[outline-algorithm]: https://html.spec.whatwg.org/multipage/sections.html#outline
[no-outline-algorithm]: https://adrianroselli.com/2016/08/there-is-no-document-outline-algorithm.html
[heading-levels-shifting]: https://github.com/cgillions/to-fro/blob/e98d889aaf909d68cc7126672bed0bd771ea6844/src/markup_help/templatetags/headings.py
[axe]: https://www.deque.com/axe/
[headingsmap-firefox]: https://addons.mozilla.org/en/firefox/addon/headingsmap/
[headingsmap-chrome]: https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi
[voiceover]: https://help.apple.com/voiceover/mac/
[narrator]: https://support.microsoft.com/en-us/help/22798/windows-10-complete-guide-to-narrator
[orca]: https://help.gnome.org/users/orca/stable/index.html.en
[nvda]: https://www.nvaccess.org/download/
