Styleguide
===

Prose
---

Is good you understand your place in my world meow loudly just to annoy owners and walk on keyboard leave hair on owner's clothes, lick sellotape so favor packaging over toy i am the best. Crash against wall but walk away like nothing happened take a big fluffing crap 💩 but i will be pet i will be pet and then i will hiss, cats go for world domination. Leave fur on owners clothes a nice warm laptop for me to sit on. Chase dog then run away kitty kitty so refuse to leave cardboard box chase the pig around the house so hiss and stare at nothing then run suddenly away pet me pet me don't pet me. Walk on keyboard eat fish on floor spend six hours per day washing, but still have a crusty butthole lick sellotape, cat is love, cat is life.

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
