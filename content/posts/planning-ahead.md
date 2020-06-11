---
title: Planning ahead
type: post
layout: post.pug
---
A translated homepage is nice, but in the end the site will have a little more content. The simple system in place was great to get started. As the site grows, though, a couple of things will get in the way and need changing.

Some issues ahead
---

First, the language is set manually in each file front-matter. Perfect for future time loss for having forgotten to add it where it needed. Better to detect it automatically. Without analysing the content of the files (not sure how reliable that would be), we could use their path to set the language. Feels a bit like setting a variable manually, but it has the advantage to make things more visible. Instead of digging in the file to look at its first line, the language appears from the folder the file is in (or rather how it's named).

There is also no way to match a piece of content and its translation. With only one page, the other page can only be its translation. As more come in, each page will need some kind of variable, shared by all its translation. This will be the key to sending readers to the translated version of the page rather than the homepage when switching language. And possibly other features.

Finally, translated pieces of content live far appart. English versions are at the root of `content`, the French versions in the `content/fr/` folder. This matches the structure of the generated site. However, as pages get created inside deeper folders, or the number of pages just increases, it'll be tough to see which content is translated and which translations still need writing. Even worse, the names of the files might not even match in order to have translated URLs too. I'd much prefer translations to live side by side and their filename reflect that they're the same piece of content.

The plan
---

To address these 3 issues:

- Each piece of content and its translation will be next to each other, with an `--fr` suffix denoting the French version. This naming inspired by [BEM, a CSS methodology][bem-naming], leaves the extensions for marking the type of file, as most file extensions do.
- This token will be used to detect the language, which will avoid writing it in the front-matter. Files without it will be assumed to be in a default language, configured in Metalsmith's metadata. 
- Finally, the path of the file, once the suffix and extensions are removed, will be used to match translated content.

For example, `posts/article--fr.md` will be detected as French. It will be matched with `posts/article.md`, set in the default language, thanks to the `posts/article` path they share once the extenstions and suffix are dropped.

What about translated URLs? It'll be up to the translated file to provide a translated slug in their front-matter, say with a `slug` variable. We could even imagine providing slug for parts of the path... but one thing at a time!

All this is a large chunk of work, so let's break it down a bit:

1. Some preparatory work to break down the file path into different parts so we can easily extract the language and translation key from it
2. Actually extracting the language and translation key from those path parts
3. Writing files at their final location, according to their language and possibly custom slug.

This will be the start of writing custom Metalsmith plugins, as these features become quite project specific. Looking forward to get started in the next articles.


[bem-naming]: http://getbem.com/naming/
