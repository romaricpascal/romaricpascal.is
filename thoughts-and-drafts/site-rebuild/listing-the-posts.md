Listing the posts
===

Created a couple of posts, but it'd be great to have a listing of them,
on an archive page.

Distinguishing the posts from the rest
---

The first step will be to distinguish the posts to list,
among all the content. For that, we'll add a `type` data that'll be `page` by default.

We'll set the posts type to `post` using the frontmatter for now. It'll be a bit cumbersome in the long run,
but we'll revisit later. For now, the important is to have that bit of data handy.

Grouping the posts
---

Similarly to when we were grouping the content by key, then by language, we want to do the same. Except by language first,
then by type. We also want a different kind of grouping, where each key will hold an array of values.

Displaying the list
---

Looping through the collection, we can now display a list of links... if only each post had some kind of title to display.
Just like for the `type` we'll set to write it in the frontmatter for now. The URL is already taken care of by the `rewrite` plugin, that creates a neat `outputUrl`.

Internationalizing the archive
---

Copy paste our archive page to `index--fr.pug` and voila, we have an archive of the french posts. Same here, to be revisited after, this will open the path to internationalized pieces of text and dates.

Upcoming:

- having only one archive page to generate both French and English version
  
  - pulling pieces of text from the file data
  - pulling date formats according to language
  - generating French page

- pulling the type from somewhere (folder? data files a-la Eleventy? both? choice?)
- pulling the title from somewhere (first markdown heading, first HTML heading)
