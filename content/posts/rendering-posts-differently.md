---
date: 2020-07-30
title: Rendering posts differently
type: post
layout: post.pug
---
Articles, or posts as I unfortunately named them at the time (so that's how the code will refer to them further on), need a slightly different rendering than the pages. Not only should the site header and footer be consistent with the rest of the site, the structure of the content should also be consistent from one article to another: title, date and then the text of the article itself.

Let's see how to get to it!

Picking a different layout
---

The [layout is handled by `metalsmith-layout`][shared-layout]. It comes with a built-in  option to pick a specific layout for a page looking at its `layout` property. This makes having the posts use a different layout a matter of adding that property in each front-matter.

```md
---
layout: post.pug
---
```

<span lang="fr">Voilà</span>! It could be automated further later on, assigning the layout based on the path of the file, for example. But for now it'll do. The articles will have a layout of their own… once that `layouts/post.pug` exists that is.

Reusing layouts
---

The site-wide layout is already defined in `layouts/site.pug`. Thanks to [Pug's extending capabilities][pug-extend] (like most template languages have), we can reuse that for the post layout. This will ensure any site wide change will also be reflected on the post pages, without us having to edit two files (or more if the number of custom layouts grows).

This requires to tweak the site layout a bit. For now, it simply outputs the `contents` property inside the `<body>`.

```pug
//- layouts/site.pug
//- ...
body
  != contents
//- ...
```

To allow extending layouts to tweak what goes in the body, it'll need to define a `block` (let's name it `contents`) that they'll then fill. If none is given (like when the layout is not being extended, on regular pages), it'll default to outputing the content like it does now:

```pug
//- layouts/site.pug
//- ...
body
  block contents
    != contents
//-...
```

Now the site template is ready, we can create the `layouts/post.pug` template that sets a common structure to all the posts:

1. Title
2. Date (for now, let's leave it out for a future article)
3. Content of the post

```pug
//- layouts/posts.pug

//- Re-use the site.pug layout, note the lack of `.pug`
extend site

//- Pass the parent layout what goes in the `contents` block
block contents
  h1= title
  //- Date will come here in a future article ;)
  != contents
```

The layout is ready for displaying the articles now. Its code implies two constraints for the files that'll store the posts contents though:

1. They'll need to provide a `title` property, that'll be use to create the `<h1>` tag
2. This means the headings in the markdown will need to start at the second level (`##`, or underlined by `---` instead of `===`)

We can actually take advantage of that `title` property to do something long overdue: set the document's title that appears in the browser tab.

Updating the title
---

When creating the site layout, that bit was [left out with a promise to take care of it later][../shared-layout/]. It's now time to make sure each page has its own title. It's very important as it helps user understand where they are on the site.

As it's a site-wide thing, it'll go in the `layouts/site.pug` file. There we can set the `<title>` tag to be prefixed by that `title` property if it exists:

```pug
//- ...
//- Replacing `title Romaric Pascal`
title
  if title
    = title
    = ' - ' //- To ensure the spaced do get there
  = "Romaric Pascal" //- Otherwise it tries to create a <Romaric> tag
//- ...
```

This gives the articles their own layout and fixes a [basic accessibility issue][wcag-title]. Remains displaying the date of the article, which will be the topic of next article as internationalisation brings its lots of challenge there.

[pug-extend]: https://pugjs.org/language/inheritance.html
[shared-layout]: ../shared-layout/
[wcag-title]: https://www.w3.org/TR/WCAG21/#page-titled
