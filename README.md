> This repository is now [hosted on Gitlab](https://gitlab.com/romaricpascal/romaricpascal-is). Please head there if you wish to contribute. Thanks 🙂

romaricpascal.is
===

Code and content of [my personal site](https://romaricpascal.is).

## Development

Current version is built with [NuxtJS](https://nuxtjs.org/)

```sh
npm install

npm run dev
```

### Production build

Nuxt's `generate` command creates a production build of the site in the `dist` folder.

```sh
npm run generate
```

The site can then be served locally with `npx serve dist` or deployed to a remote server.

## Checking for broken links

`wget` proves super handy for checking broken links, with its `--spider` option.
Only downside is that is downloads each page in a folder that needs to be cleaned up afterwards.

```sh
wget --spider --recursive --no-verbose localhost:3000 && rm -r localhost:3000
```

## Deployment

The `deploy.sh` script at the root of the repository will SCP the site to a remote server and unpack it in the appropriate folder (making a backup of the previous one).

```sh
./deploy user@example.com destination_folder
```
