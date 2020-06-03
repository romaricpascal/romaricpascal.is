---
title: Let's get started
type: post
layout: post.pug
---
Let's get started. As with all projects, there'll be a little bit of setup up front. As well as a major decision to make: which static site generator to pick. And there are many to pick from. There is even a whole website dedicated to listing them.

Going tool-picking
---

For this rebuild, I have a couple of criteria that will shorten the list:

- **JavaScript based**: Building a website already requires to juggle 3 languages: HTML, CSS and JavaScript. Let's not add another one.
- **Not based on a client-side component library**: It's a content site, with no need for anything fancy/app-y on the client-side, so let's not bind it to unnecessary complexity.
- **Easily extensible**: Part of the reason for this rebuild is just having fun and learning how to build features around a static site generator. I want to easily be able to tweak or add features.

With all that in mind, I settled for [Metalsmith](https://metalsmith.io/). Not the newest shiny tool in the list, but it had the main advantage of a process I easily wrapped my head around:

1. Read all the content files in a source folder
2. Pass them through a series of plugins that extract data and transform it
3. Write the resulting files in the destination folder.

This simplicity means a lot of flexibility. The cost will be to pick/build the necessary plugins, I'm happy with that trade-off.

Rise, project!
---

Around the code of the projects themselves, there's always a series of things to set up: create a Git repository, an NPM package, linting, testing, CI...
Setting them all in turn takes precious time. Having a template project handy with all these pre-set is a massive time saver, allowing to focus on what actually matters (unless the project is about tweaking those presets... but this one is not).

My favourite way of scaffolding a project lately is by having [a template repository](https://github.com/rhumaric/project-template-node) at the ready and using `degit` ([discovered in the SvelteJS tutorials](https://svelte.dev/blog/the-easiest-way-to-get-started#2_Use_degit)) to bring its content in, edit a few files and be ready to go:

```sh
npx degit https://github.com/rhumaric/project-template-node
```

A very basic setup
---

With all the boring set up out of the way, it's time to actually set up the static site generator.

```sh
npm i metalsmith
```

Now let's set it up to compile files from the `content` folder into the `site` folder. Metalsmith CLI relies on a JSON configuration file. This will pose severe limitations in terms of commenting or providing functions as plugin options. Instead let's use the module in an `src/index.js` file that will run to build the site.

```js
const metalsmith = require('metalsmith');

metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .build(function(err) {
    if (err) throw err;
  })
```

Tada! Now running `node src/index.js` should copy any file from the `content` folder to the `site` one. That means Metalsmith is set up OK... though we haven't gained much yet, we might as well have written the files in the `site` folder directly. Next step will be to get something out of all that installation and actually transform some files. But that'll be for the next article.
