---
title: Listing posts
date: 2020-08-07
type: post
layout: post.pug
---
Each post can now be displayed on its own, but for discovery, better to have a page to list them all.
This will require a couple of new steps in the static site generator:

1. gathering all the posts, but separating them by language. Would be awkward for someone expecting to read in French to end up sent to an article in Engligh
2. rendering the list. Unlike regular posts or pages, its content isn't written by hand in Markdown, this will require rendering a Pug template
3. sorting the posts latest first. Did you know that you can substract `Date`s in JavaScript and it's perfectly fine?

Let's dive in!

Gathering the posts
---

Before we gather a list of posts, we'll need a property to separate them from the rest of the other content. For that, we can set a `type` attribute to each of them in their front-matter:

```md
---
type: 'post'
---
```

Alongside their language, this gives all the information needed to group them into a list. It won't be dissimilar from the one done for [the language navigation][language-navigation]. We'll create a little tree of `Object`s again, first with the file's language as key, and then with their type. 

Unlike the grouping for the language navigation, though, each "language, type" group will hold an `Array` of files, not a unique file. We can no longer use Lodash's `set` to easily put the files where they need to be. But we can create a `push` function, in the `plugins/group.js` file, that'll work similarly and `push` the value into an `Array` set at a given key.

```js
//...
/**
 * @param {Object} object
 * @param {Array|String} key
 * @param {*} value
 */
function push(object, key, value) {
  const array = getOrCreate(object, key, Array);
  array.push(value);
}

/**
 * @param {Object} object
 * @param {Array|String} key
 * @param {Function} factory - A function used to create new Objects
 */
function getOrCreate(object, key, factory) {
  let value = get(key, object);
  if (!value) {
    value = factory();
    set(object, key, value);
  }

  return value;
}
//...
```

We can the use it to update the plugin and create a second group `byLanguageByType`:

```js
//...
module.exports = function() {
  return function(files, metalsmith) {
    const groups = {
      byKeyByLanguage: {},
      byLanguageByType: {}
    };
    Object.values(files).forEach(file => {
      const language = get(file, 'i18n.language')
      const key = get(file, 'i18n.key')
      const type = get(file,'type')
      set(groups.byKeyByLanguage, [key, language], file);
      push(groups.byLanguageByType, [language, type], file);
    });

    metalsmith.metadata().groups = groups;
  };
};
//...
```

Now the information for each page is prepared, we can use it to render the list of posts

Pug pages
---

The `metalsmith-in-place` plugin, used for [rendering the pages content][content-rendering], is not limited to Markdown. It works with any language supported by `jstransformer`. This means it'll render any `.pug` file we put in the content folder, as we've already brought `jstransformer-pug` for handling the layouts.

To make sure the pages will have the appropriate title in the browser tab, we'll need to give them a `title` property in their front-matter. We can then handily use it to render the `<h1>` tag. This kickstarts the `content/posts/index.pug`:

```pug
---
title: All posts
---
h1= title
```

It's now time to grab the lists we computed earlier, and loop through to display them. `<h2>` will ensure the list can be skimmed through by heading and the `<time>` will properly mark the article date. 

```pug
//-...
- const posts = groups.byLanguageByType[i18n.language]['post']
ul.post-list
  each post in (posts)
    li.post-list-item
      h2
        a(href=post.outputUrl)
          = post.title
      time.margin-top--0(datetime=date.toISOString())
        = get(dateFormats,i18n.language)(post.date)
```

At that point, we're almost there. The French version is a matter of duplicating the file into `index--fr.pug` and updating the title. There's nothing guaranteeing the order of the articles yet, though. So let's take care of that.

Latest first
---

Like most blogs, the articles will be listed most recent first. This requires to `sort` the list of articles before rendering it. The simplest implementation is to make that `sort` happen right before rendering the `<ul>` (though, ideally, we'd probably want that sorted list computed ahead of even rendering the template). 

One thing to be aware of: `sort` will change the order of the Array itself. This could lead to nasty surprises if other parts were trying to access the list of posts after rendering the page. Or worse, if the order is not guaranteed and the other part some times gets run before we render the list of posts, other times after. They'd get two very different lists.

To guard against that, we'll make sure to `sort` our own copy of the post list, which can be easily duplicated with the [spread operator][spread-operator] (`...`).

When not dealing with simple numbers or strings, sorting an `Array` requires the help of a [comparator function][sort-comparator-function]. It'll get two items from the array, and will need to return `-1`, `1`, or `0` depending if the first should come before the second, come after the second or the two should remain in the same order they are now.

`Date`s are very happy being substracted to one another (returning the number of ms between them). This makes creating such comparator a matter of returning the difference between the two posts `date` attributes. To get which to substract to the other, picking an order, checking what's on screen and inverting if the order is the wrong way around is still the least painful ;)

```pug
- const posts = [...groups.byLanguageByType[i18n.language]['post']].sort(function(a, b) {
    return b.date - a.date
  })
```

That makes the list of posts ready now. It just needs a bit of styling (you might have noticed the couple of classes lying around in the template), which we'll talk about in the next article. Getting so close to the state of the relaunch now!

[language-navigation]: ../revisiting-the-language-switcher-indexing-content/
[content-rendering]: ../writing-markdown/
[spread-operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
[sort-comparator-function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters
