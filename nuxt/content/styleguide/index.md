Styleguide
===

Prose
---

Is good you understand your place in my world meow loudly just to annoy owners and walk on keyboard leave hair on owner's clothes, lick sellotape so favor packaging over toy i am the best. Crash against wall but walk away like nothing happened take a big fluffing crap 💩 but i will be pet i will be pet and then i will hiss, cats go for world domination. Leave fur on owners clothes a nice warm laptop for me to sit on. Chase dog then run away kitty kitty so refuse to leave cardboard box chase the pig around the house so hiss and stare at nothing then run suddenly away pet me pet me don't pet me. Walk on keyboard eat fish on floor spend six hours per day washing, but still have a crusty butthole lick sellotape, cat is love, cat is life.

Headings
---

<h1 role="group">Top level heading</h1>
<h2 role="group">Second level heading</h2>
<h3 role="group">Third level heading</h3>
<h4 role="group">Fourth level</h4>
<h5 role="group">Fifth level</h5>
<h6 role="group">Sixth level</h6>

Lists
---

- daydream
- watercolour
- code some HTML & CSS

1. blueberries
2. melon
3. cherries

Code
---

Some `inline_code()` within a sentence.

A block of code with reasonably short lines:

```js
metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .use(inPlace())
  .use(
    layouts({
      pattern: ['*', '**/*', '!*.css'],
      default: 'site.pug'
    })
  )
  .use(permalinks())
  .build(function(err) {
    if (err) throw err;
  });
```

And one that has a very long line:

```css
font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
```

Images
---

On their own:

<img src="face-your-fears.jpg" alt="" />

Inside a figure

<figure>
  <img src="face-your-fears.jpg" alt="" />
  <figcaption>An image inside a figure</figcaption>
</figure>
