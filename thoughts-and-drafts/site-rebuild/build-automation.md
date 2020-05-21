Build automation
===

Nodemon to rebuild
---

```sh
npm i -D nodemon
```

Make sure that the main field is set.

Configure the files to be watched in `nodemon.json`:

```json
{
  "ext": "js,pug,md,json",
  "ignore": [
    "site"
  ]
}
```

Then `npx nodemon` will rebuild everytime we save

Browser-sync for live-reloading
---

Makes feedback quicker.

```sh
npm i -D browser-sync
```

Then `npx browser-sync start -s site` to serve the site.

Browser-sync could watch changes in `site` to reload. Unfortunately,
this proved unreliable. Thankfully, nodemon has an event system that allows to run commands after restarting the projects and browser-sync can receive HTTP requests to trigger a reload.

`curl` will do just fine for sending a quick request. `-s` to avoid cluttering the console and `> /dev/null` to not print the response from browser-sync, which doesn't give us any information.

```json
  "events": {
    "exit": "curl -s http://localhost:3000/__browser_sync__?method=reload > /dev/null && echo 'Restarted browser-sync' || echo 'Failed to restart broswer-sync'"
  }
```

Further steps should go a bit quicker now.
