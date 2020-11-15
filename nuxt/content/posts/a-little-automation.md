---
date: 2020-06-08
title: A little automation
type: post
layout: post.pug
---
Running `node src/index.js` every time I want to see the effect of a change quickly becomes annoying. Let's make this automatic, and also reload the page in the browser while we're at it!

For that, I'll rely on two widely used projects, rather than the `metalsmith-watch` plugin, which looked a bit too dormant to me:

- [Nodemon](https://nodemon.io) for the automatic rebuild
- [BrowserSync](https://browsersync.io) for the browser reloading.

Let's dive in!

Automating the site generation
---

`nodemon` takes care of watching files and re-running the code of a NodeJS (or even in another other language) project when they change. As it will only be used for development, let's install it with the `--save-dev`/`-D` flag:

```sh
npm i -D nodemon
```

Out of the box, without any parameter `npx nodemon` runs the file set in the `"main"` field of `package.json`. Let's make sure we got it right and set it to `src/index.js` (this will also enable to generate the site with only `node .`).

For now, the site will only rebuild when changing JavaScript or JSON files (the default Nodemon behaviour). Thing is, we'll want it to rebuild when the content changes, or the layout, or later when changing the stylesheets. This can be configured in a `nodemon.json` file at the root of the project. While there, we can also set it to ignore the `site` folder to avoid ending in an infinite loop of rebuilding.

```json
{
  "ext": "js,pug,md,json,css",
  "ignore": [
    "site"
  ]
}
```

That should cover most of the changes for now.

Live-reloading
---

Now the site gets built automatically, let's see how to reload the page automatically with `browser-sync`. Just like `nodemon`, it's a development dependency so let's install it with the `-D` flag:

```sh
npm i -D browser-sync
```

To check that everything is installed OK, we can have it serve the `site` folder with:

```sh
npx browser-sync start -s site
```

This should open a browser window on `http://localhost:3000` (if the 3000 port not free, BrowserSync will let you know which port it uses in the console).

With the previous command, BrowserSync only serves the site. Its reloading feature need to be enabled with the `-w` flag:

```sh
npx browser-sync start -s site -w
```

Everytime the files in the `site` folder change now, BrowserSync should reload the browser. 

Co-ordinating Nodemon and Browsersync
---

Unfortunately, more than once the reloading didn't happen for me, so I had to look at another way.

BrowserSync offers another way to reload the pages. An HTTP request to `/__browser_sync__?method=reload` will trigger a reload. On its side, Nodemon allows to run scripts when specific events happen, like when the project `exit`s cleanly. This'll be perfect for making that call to BrowserSync.

Inside the `nodemon.json` configuration, we can make the two tools work together:

```json
  "events": {
    "exit": "curl -s http://localhost:3000/__browser_sync__?method=reload > /dev/null && echo 'Restarted browser-sync' || echo 'Failed to restart broswer-sync'"
  }
```

A little cleaning up of the output with the `> /dev/null`, some nicer feedback with a couple of `echo` triggered when the request works (`&&`) or fails (`||`) and the reload was much more reliable for me (though a little slower).

Running both commands together
---

Most often, they'll be run alongside each other as I work on the project. [The `concurrently` package](https://www.npmjs.com/package/concurrently) will allow to start them in a single command. Even better, it allows to keep typing `rs` to Nodemon for restarting manually if needed.

```sh
npm i -D concurrently
```

Once installed, a couple of scripts in the `package.json` will launch everything with a single `npm run dev`. `concurrently` will run all the tasks starting with `dev:`, allowing future tasks to be easily added. And the input will be specifically redirected to `dev:watch` corresponding to Nodemon.

```json
"script": {
  "dev": "concurrently --handle-input --default-input-target dev:watch 'npm:dev:*'",
  "dev:watch": "nodemon",
  "dev:serve": "browser-sync start -s site --no-open",
}
```

All set and ready to (finally) start building the internationalisation features... which was the initial aim.
