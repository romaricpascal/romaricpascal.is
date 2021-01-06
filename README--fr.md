romaricpascal.is
===

Code et contenu de [mon site personnel](https://romaricpascal.is).

Développement
---

La version actuelle utilise [NuxtJS](https://nuxtjs.org/)

```sh
npm install

npm run dev
```

Production
---

La commande `generate` de Nuxt crée une version de production dans le dossier `dist`.

```sh
npm run generate
```

Il est ensuite possible de la servir localement avec `npx serve dist` ou de la déployer sur une machine distante.

## Vérifier les liens

`wget` est super utile pour vérifier que tous les liens pointent vers un contenu existant, avec son option `--spider`. Seul bémol, il télécharge chaque page dans un dossier qu'il faut supprimer une fois la commande terminée.

```sh
wget --spider --recursive --no-verbose localhost:3000 && rm -r localhost:3000
```

## Deploiement

Le script `deploy.sh` à la racine du repository copie le site sur un serveur distant et le décompresse dans le dossier approprié (en faisant une sauvegarde du dossier précédant, au cas où).

```sh
./deploy user@example.com destination_folder
```
