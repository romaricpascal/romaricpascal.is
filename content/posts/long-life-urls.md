---
title: Long life URLs
type: post
layout: post.pug
---
To locate anything on the web, you need its URL. Maybe it was inside a link on another site, maybe written on a leaflet you got handed offline, but that's what'll get you to the page you're after. Once the world learns of a specific URL, there's no knowing when it'll be used, though. This is why it is important to make sure URLs are as long lived as possible while the content they refer to is still live.

No extension, no lock-in
---
A first step towards longer-life URLs is to drop the file extension from them.
Technologies and needs change over time. That `/delightful/page.html` of now might need a little PHP thrown in to make it a little more dynamic. And there you go, existing links won't find the new version at `/delightful/page.php`. 

The `/delightful/page/` URL is much more stable. No assumption on what generated it. No assumption on the format it responds with. That means it can be flexible not only on how the content is generated, but also towards what kind of content it sends back. Maybe one day it'll allow requesting some JSON of stuctured page metadata. Would have been weird to get some JSON out of a request ending in `.html`, wouldn't it?

Setting it up
---
There's nothing to say that this statically generated site will remain so forever. Better make sure its URLs are future-proof. For that we can take advantage that the vast majority of servers will serve the `index.html` file when the request matches a folder.

Because it's such a common thing to want too, there's an existing plugin again: `metalsmith-permalinks` It'll rewrite the destination of files so that `delightful/page.html` is instead written as `delightful/page/index.html`.

This installation should feel familiar after the last two plugins installs. It's even shorter as there's no templating library to grab alongside the plugin.

```sh
npm i metalsmith-permalinks
```

Once downloaded by NPM, we can add it as the last step of the Metalsmith pipeline:

```js
const permalinks = require('metalsmith-permalinks')
/* ... */
.use(permalinks())
.build(function(err) {
/* ... */
```

One page multiple URLs
---

With this structure, this "delightful page" can be accessed at three different URLs:

1. `/delightful/page` (no slash at the end)
2. `/delightful/page/` (with slash at the end)
3. `/delightful/page/index.html` (pointing to the index file itself)

That last one is unlikely to happen. Humans will however be happy that either 1 or 2 will let them access the same page. Who wants to remember whether to type or not a slash at the end?

Search engine robots won't be so happy though. They will see those as different URLs and may penalize the content for being duplicated. That's why it's important to pick one and stick to it.

I couldn't find any strong argument for going all with slash or all without. But given URLs point to folders now, it feels right to force the trailing slash. The only exception would be for when the URL has an extension. Most likely this would be a request to a specific file, not an HTML page, and it'll save a useless redirect if it does not exist.

With [mod_rewrite] module of Apache, we can set up redirections to make search engines only consider the slash version. This can be configured either in the Virtual Host configuration, or in the `.htaccess`:

```apache
# Make sure we can rewrite URLs
RewriteEngine On

# Enforce trailing slash
## Pick URLs that don't have a trailing slash
RewriteCond %{REQUEST_URI} !(.+)/$

## And don't have a file extension.
RewriteCond %{REQUEST_URI} !\..+$

## And if the request is not actually a file
RewriteCond %{REQUEST_FILENAME} !-f

## Send a 301 Redirect to the URL with slash
RewriteRule ^(.+)$ https://romaricpascal.is/$1/ [R=301,L]

# Remove trailing index.html both inside folders and at the root
RewriteRule ^(.+)/index.html$ https://next.romaricpascal.is/$1/ [R=301,L]
RewriteRule ^index.html$ https://next.romaricpascal.is/ [R=301,L]
```

There we go, nicely structured URLs, made to last and seen as just one for the robots. That's a lot of redirects, though. Maybe using a `<link rel="canonical">` to set a unique URL would save a few requests. To be explored later.

This only deals with the URLs of this new version. As this site replaces an old version, I need to deal with the old URLs, already spread across the web. Would be a real shame to break them. That'll be the focus of the next article.


