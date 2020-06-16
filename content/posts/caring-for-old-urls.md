---
date: 2020-06-05
title: Caring for old URLs
type: post
layout: post.pug
---
Even if the URLs are designed to last for long, the underlying content is bound to move.
A small reorganising or complete site overhaul, and the content doesn't live where it used to.
URLs pointing to it are out in the wild, though, with no mean to know when they'll be used next.
It would be a shame to break access through them.

Usually, keeping them live requires:

- a solid inventory of the existing URLs,
- planning where the content will end up on the new site,
- migrating the content to the system powering the new version,
- and finally setting up appropriate links/redirections to point to the right new place.

Costly steps, when I want to get a new version out quickly. Instead, I opted for a lighter alternative, [4042302 proposed by Aral Balkan][4042302]:

- keep hosting the old version, at a different domain
- [temporarily redirect][mdn-redirections] 404 errors to this backed up version


Freeing the old site from WordPress
---
The old version was running on WordPress, which needs to be kept up to date as new versions are released. Perfectly fine when posting regularly(ish), but now it's just for a backup site, that's an extra burden. Best to make that backup a static site too.

The content is already generated and won't move, we can grab it with `wget`. The tool's `--recursive`/`-r` option makes it crawl the links it found on the website and download each page. Adding the `--page-requisites`/`-p` will also make it download the images, stylesheets and scripts on the page. We'll want to make sure we stay on the site's domain with the `--domains` option and ignore any directives from `robots.txt`. There we go:

```sh
wget --random-wait -r -p --no-parent --domains=example.com -e robots=off example.com
```

### Cleaning the URLs

Not quite the end of the road, though. WordPress' URLs all contain the domain of the website. Given the site is to be relocated to a new domain, this needs updating. I thinkered with a convoluted command to get it to work (not my brightest idea, but it worked with what I knew):

```sh
grep -P -rl 'https?://romaricpascal.is' www | xargs perl -pi -e 's/
https?:\/\/romaricpascal.is//g'
```

That was before I learnt of `sed` which would have let me do that in one little command: `sed -i 's/https?:\/\/romaricpascal.is//g`, and let me fix the empty `href` the previous replacement left:

```sh
sed -i 's/href=""/href="\/"/g' www/**/*.html www/*.html
```

### Cleaning other Wordpress ties

String based search and replace wouldn't be enough to remove the other bits of WordPress lying around and that the site wasn't using: some `<script>`,`<link>` and `<style>` tags from WordPress itself or plugins that won't be there anymore.

For that `rehype` is much better suited. Instead of working with strings, it turns the HTML into a tree of JavaScript objects (a syntax tree), from which we can single out specific nodes to remove.

Using a `.rehyperc.js` configuration file, we can make it load a custom plugin stored in `./rehype/drop-wordpress-scripts.js`:

```js
module.exports = {
  plugins: [
    './rehype/drop-wordpress-scripts.js',
  ]
}
```

The removal is simplified by one of the many utility modules provided for `unist`, the format of the syntax tree created by `rehype`. `unist-util-remove` lets us focus on which node to pick, based on their properties or children, and takes care of the removal.

```js
const remove = require('unist-util-remove');

module.exports = function attacher() {
  
  return function transformer(tree, file) {
  
    remove(tree,{},function(node) {
      if (node.tagName === 'script') {
        if (node.properties.src) {
          return /wp-includes/.test(node.properties.src) || /wp-content\/plugins/.test(node.properties.src)
        } else {
          return /wpemoji/.test(node.children[0].value) || /wpcf7/.test(node.children[0].value);
        }
      }
      if (node.tagName === 'link') {
        return /(wp-content\/plugins|s.w.org)/.test(node.properties.href);
      }
      if (node.tagName === 'style') {
        return /img.emoji/.test(node.children[0].value)
      }
      return false;
    })
  }
}
```

After installing `rehype-cli` with `npm i rehype-cli`, running `npx rehype www -o` will process all the files in the `www` folder and overwrite them with the updated version. Now the old site is cleaned of WordPress references.

4042302 with a twist
---

With the old site tidied up and deployed at old.romaricpascal.is, it's now possible to set up 4042302. Apache would support the following `ErrorDocument` directive to do some redirection:

```apache
ErrorDocument 404 https://old.romaricpascal.is%{REQUEST_URI}?%{QUERY_STRING}
```

However, besides inserting an ugly `?` for each failed request, it would display the 404 page of the old website, not the new one. Luckily, the server hosting the site can run some PHP, so we check if the page exists on the old site before redirecting:

```php
$base_url = "https://old.romaricpascal.is";

if (!empty($base_url)) {
  $url = "$base_url$_SERVER[REQUEST_URI]";
  // Prepare a request to the server
  $ch = curl_init($url);
  // Only send an OPTION request
  curl_setopt($ch, CURLOPT_NOBODY, true);
  // Follow any redirects
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  // Finally send the request
  $response = curl_exec($ch);
  // And grab the response code
  $response_code = curl_getinfo($ch,CURLINFO_RESPONSE_CODE);
  curl_close($ch);

  if ($response_code >= 200 && $response_code < 300) {
    // The URL exists, let's redirect!
    header("Location: $url", true, 302);
    die();
  }
}

// By that point, the URL didn't exist, or we didn't set up
// a `$base_url`, so we need to pick our own redirect method
// Mimicking those of Apache: redirect somewhere, display a document or just show some text
$error_redirect = '';
$error_document = '';
$error_message = 'Not found';

if (!empty($error_redirect)) {
  header("Location: $error_redirect", true, 302);
  die();
} else if (!empty($error_document)) {
  include $error_document;
} else {
  echo $error_message;
}
```

We can place this `4042302.php` file within the `content` folder of the website and configure Apache to use it in the `.htaccess`:

```apache
ErrorDocument 404 /4042302.php
```

One day, I'll migrate the old content to the new website. In the meantime, all the old URLs should still point to their original content, keeping their access alive. Almost done with the logistics, a little bit of automation ahead, and it'll be back to building the site itself.

[4042302]: https://4042302.org
[mdn-redirections]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections#Temporary_redirections
