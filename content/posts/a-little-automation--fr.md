---
title: Un peu d'automatisation
slug: un-peu-d-automatisation
type: post
layout: post.pug
---
Lancer `node src/index.js` chaque fois qu'il faut vérifier les effets d'un changement de code devient rapidement ennuyeux. Autant faire en sorte que ça se fasse automatiquement. Et le rechargement de la page dans le navigateur aussi, tant qu'on y est!

Pour cela, j'ai préféré utiliser deux projets plutôt répandus au plugin Metalsmith `metalsmith-watch`, qui avait l'air un peu à l'arrêt. Il s'agit de:

- <a href="https://nodemon.io" hreflang="en">Nodemon</a> pour le lancement automatique
- <a href="https://browsersync.io" hreflang="en">BrowserSync</a> pour le rechargement navigateur.

Allons-y!

Reconstruire le site automatiquement
---

`nodemon` se charge de surveiller les fichiers et relancer le code d'un project Node (ou autre, d'ailleurs) quand ils changent. Comme il sera utilisé uniquement pour le développement, il sera installé avec l'option `--save-dev`/`-D`:

```sh
npm i -D nodemon
```

Par défaut, et sans options, `npx nodemon` lance le fichier pointé par le champ `"main"` du `package.json`. C'est le moment de s'assurer qu'il envoie bien vers `src/index.js` (ce qui permettra au passage de lancer le build avec seulement `node .`).

Pour le moment, le site ne sera recompilé qu'au changement d'un fichier JavaScript ou JSON (c'est là aussi le comportement par défaut de Nodemon). Pour un site statique, il y aura aussi des changements de contenus (`.md`), de templates (`.pug` ici) ou même de feuilles de styles (`.css`). Quelques extensions à rajouter à celles déja surveillées par Nodemon. Ceci se fait depuis son fichier de configuration `nodemon.json` à placer à la racine du project. Et tant qu'on le configure, autant lui dire d'ignorer le dossier `site`. Celà évitera de relancer la compilation indéfiniement.

```json
{
  "ext": "js,pug,md,json,css",
  "ignore": [
    "site"
  ]
}
```

Ça devrait suffire à relancer après la plupart des changements pour le moment.

Recharger le navigateur
---

Maintenant que le site est recompilé automatiquement, c'est l'heure d'ajouter le rechargement automatique avec BrowserSync. Tout comme Nodemon, il sera installé pour le développement:

```sh
npm i -D browser-sync
```

Pour vérifier que tout est bien installé, on peut lui faire servir le dossier `site` (où se retrouve le site compilé):

```sh
npx browser-sync start -s site
```

Cela devrait ouvrir un navigateur sur `http://localhost:3000` (si le port 3000 n'est pas libre, BrowserSync annonce le port qu'il utilise dans la console). Mais cette commande ne recharge pas le navigateur lorsque les fichiers changent. Pour cela, il faut lui rajouter l'option `-w`:

```sh
npx browser-sync start -s site -w
```

Et maintenant, chaque fois que les fichiers de `site` changent, BrowserSync devraient recharger le site dans le/les navigateurs qui l'ont ouverte.

Co-ordonner Nodemon et BrowserSync
---

Malheureusement, plus d'une fois le rechargement ne s'est pas fait et j'ai donc du me tourner vers une autre solution.

BrowserSync propose une autre manière de déclencher le rechargement des pages. Une requête HTTP vers `/__browser_sync__?method=reload` recharge les pages ouvertes également. De son côté, Nodemon permet d'exécuter des scripts lors de certains événements, comme `exit` quand le projet termine avec succès. Parfait pour lancer cette requête vers BrowserSync.

Dans le fichier `nodemon.json`, on peut faire communiquer les deux outils avec:

```json
  "events": {
    "exit": "curl -s http://localhost:3000/__browser_sync__?method=reload > /dev/null && echo 'Restarted browser-sync' || echo 'Failed to restart broswer-sync'"
  }
```

Un peu de nettoyage de la sortie avec `> /dev/null`, des retours un peu plus utiles avec quelques `echo` lorsque la requête a fonctionné (`&&`) ou pas (`||`) et le rechargement est devenu bien plus fiable sur ma machine (bien qu'un peu plus lent).

Lancer les deux commandes en même temps
---

La plupart du temps, BrowserSync et Nodemon vont être lancés en même temps pour travailler sur le projet. <a href="https://www.npmjs.com/package/concurrently" hreflang="en">Le package `concurrently`</a> permet de les lancer tous les deux en une seule commande. Mieux encore, il perment de continuer a communiquer avec Nodemon pour relancer manuellement en tappant `rs`.

```sh
npm i -D concurrently
```

Une fois install, quelques scripts NPM dans le `package.json` permettent de tout lancer avec `npm run dev`. `concurrenlty` will run all the tasks starting with `dev:`, allowing future tasks to be easily added. And the keyboard input will be specifically redirected to `dev:watch`, corresponding to Nodemon.

```json
"script": {
  "dev": "concurrently --handle-input --default-input-target dev:watch 'npm:dev:*'",
  "dev:watch": "nodemon",
  "dev:serve": "browser-sync start -s site --no-open",
}
```

Tout est maintenant fin prêt pour (enfin) se tourner vers le développement des fonctionnalités d'internationalisation... ce qui était quand même le but à la base. 
