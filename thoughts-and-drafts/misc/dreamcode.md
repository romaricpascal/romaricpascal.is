Dream code
===

Just a couple of thoughts as I go on some ideal architecture.

JIT Architecture
---

Start simple and aggregate files as needed as things go. Use file system based tools, like `express-mount-files` to make the mapping between where things are accessed by users and where things are in the code obvious, without having to jump through technical folders like controlers.

Use `node_modules` to allow easy linking between packages. Move to `packages` if the packages need exporting or to have their own set of dependencies. This might be a necessary requirement for separating front-end and back-end code anyways, so `packages` + `pnpm` or `lerna` might be the default for these kind of apps.

That said there's a chance a couple of recurring modules will appear:

- services: The functions that the app performs, whatever they are
- server: The code exposing those functions through HTTP, either as an API or with views.
- bin?cli?: Any CLI code, exposing the functions. Is launching the server part of that?
- frontend: The frontend code. Architecture to be detailed.
- config: Gathering of the configuration: CLI options (`config.x.y`) + ENV (All env variables end up in config, names are camelcased and `__` mark nesting) + config file (`cosmiconfig`) ?
- db: For database access. If with knex, make a root `knexfile.js` just exporting what's in the `db` package so that things like `knex migrate` work appropriately. By default, use stuff like `DB_xyz` environment variables to configure. `DB_URL` get superseeded by any `DB_NAME`... variables (most "precise" wins).

Testing
---

Closest to the source as possible for unit integration tests, in `__tests__` folder, with the `.test.js` extension (maybe `--test.js` instead to keep extension's role for file format).

DB testing:

- create the DB at start of tests
- truncate everything between tests
- close connections after tests to not crowd the DB

As a framework, `mocha` brings the most experience to the table. `ava` and its parallelism is pretty fast for testing libs (note: it's a no go for DB testing when you truncate the tables).
