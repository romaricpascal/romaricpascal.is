---
title: Des URLs longue conservation
slug: urls-longue-conservation
type: post
layout: post.pug
---
Pour accéder à n'importe quel contenu sur le web, il vous faut son URL. Peut-être était-elle dans un lien sur un autre site, peut-être imprimé sur une brochure distribuée hors ligne. C'est elle qui vous emmènera à la page que vous cherchez. Une fois une URL diffusée, il est impossible de savoir quand elle sera utilisée malheureusement. C'est pourquoi il est important que les URLs restent accessible le plus longtemps possible, tant que le contenu auxquel elle réfèrent est en ligne (et même apres pour dire qu'il n'est plus là. `410 Gone`).

Pas d'extension, pas de prison
---
Un premier pas pour prolonger la durée de vie des URLs est d'en enlever les extension. Les technologies et besoins changent avec le temps. Cette `/merveilleuse/page.html` d'aujourd'hui aura peut-être besoin d'être dynamisée avec un peu de PHP dans le future. Et voilà, les liens existants ne fonctionnent plus, râtant la nouvelle version à `/merveilleuse/page.php`.

L'URL `/merveilleuse/page/` est bien plus résiliente. Aucune hypothèse sur ce qui génère son contenu. Aucune hypothèse sur quelle format elle renvoie. Cela la rend flexible non seulemennt sur ce qui fournit son contenu, mais aussi ce qu'elle renvoie. Peut-être un jour elle permettra de requêter un JSON avec des métadonnées sur la page. Ça serait bizarre d'envoyer une requête terminant en `.html` pour ça, non?

Mise en place
---
Rien ne garantit que ce site statique le reste pour toujours. Mieux vaut donc s'assurer que ses URLs sont pérennes. Pour celà, on peut s'appuyer sur une convention suivie par une grande majorité des serveurs: si la requête pointe sur un dossier, ils renverront le fichier `index.html`.

Comme il s'agit la encore d'un besoin récurrent, il existe déjà un plugin Metalsmith pour ça: `metalsmith-permalinks`. Il réécrit le chemin de destination des fichiers, transformant `merveilleuse/page.html` en `merveilleuse/page/index.html`.

Après l'installation des deux plugins précédent, rien de bien nouveau pour la mise en place. C'est même plus rapide car il n'y a pas de bibliothèque de templating à installer cette fois.

```sh
npm i metalsmith-permalinks
```

Une fois téléchargée par NPM, on peut l'ajouter comme dernière étape des transformations dans Metalsmith:

```js
const permalinks = require('metalsmith-permalinks')
/* ... */
.use(permalinks())
.build(function(err) {
/* ... */
```

Une page, plusieurs URLs
---

Avec cette structure, ce sont trois URLs qui permettent d'accéder à cette "merveilleuse page":

1. `/merveilleuse/page` (sans slash final)
2. `/merveilleuse/page/` (avec slash final)
3. `/merveilleuse/page/index.html` (pointing to the index file itself).

Peu de chance que la troisième se retrouve dans la nature. Et les gens seront sûrement heureux que la 1 et la 2 renvoient la même page. Qui veut se souvenir s'il faut ou non un slash à la fin.

En revanche, les robots indexeurs des moteurs de recherche le seront un peu moins. Pour eux, ces 3 URLs sont complètement différente et ils risquent de pénaliser le contenu pour cause de duplication. C'est pourquoi il est important de choisir une des versions et de s'y tenir.

Je n'ai pas pu trouver d'argument fort pour garder le `/` final ou non. Mais étant donné que les URLs pointent maintenant vers des dossiers, il est cohérent de garder le slash final.

Avec le module [mod_rewrite] de Apache, on peut utiliser des redirections HTTP pour donner aux robots une unique version, avec un slash final. Une exception, cependant, lorsque l'URL contient une extension. Il s'agirait alors d'une requête vers un fichier spécifique, plutôt qu'une page HTML. Celà évitera une redirection inutile si le fichier n'existe pas.

Directement dans la configuration du Virtual Host, ou dans le fichier `.htaccess` à la racine du site:

```apache
# S'assure que le module est activé
<IfModule mod_rewrite.c>
  RewriteEngine On

  # Rajoute le slash final si absent
  ## Filtre les URLs sans slash final
  RewriteCond %{REQUEST_URI} !(.+)/$

  ## et qui n'ont pas d'extension
  RewriteCond %{REQUEST_URI} !\..+$

  ## et qui ne correspondent pas à un fichier
  RewriteCond %{REQUEST_FILENAME} !-f

  ## Répond avec une redirection 301 avec le slash
  RewriteRule ^(.+)$ https://romaricpascal.is/$1/ [R=301,L]

  # Supprime le `index.html` des requêtes, à l'intérieur de dossiers ou a la racine
  RewriteRule ^(.+)/index.html$ https://next.romaricpascal.is/$1/ [R=301,L]
  RewriteRule ^index.html$ https://next.romaricpascal.is/ [R=301,L]
</IfModule>
```

Avec ça, les URLs sont stucturées pour durer et ne causent pas de duplications pour les robots. Cela fait beaucoup de redirections, par contre. Peut-être que la balise `<link rel="canonical"> pourait éviter quelques requêtes. A voir plus tard.

Ces URLs ne sont que celles de la nouvelle version. Comme il s'agit d'une refonte, il faut aussi se préoccuper des URLs de l'anciennent version, déjà éparpillées sur le Web. Il serait vraiment dommage de les casser. Ça sera le sujet du prochain article.
