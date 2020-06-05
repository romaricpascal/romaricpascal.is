---
title: Prendre soin de ses anciennes URLs
slug: prendre-soin-de-ses-anciennes-URLs
type: post
layout: post.pug
---
Même avec des URLs prévues pour durer, le site vit et son contenu va changer. Une petite réorganisation ou une refonte complète, et le contenu n'est plus où il était. Des URLs pointant vers ce contenu déplacé sont déjà diffusée, sans moyen de savoir la prochaine fois qu'elles seront utilisées. Il serait vraiment dommage qu'elles n'amènent plus a rien.

Généralement, les maintenir active requiert:

- un bon inventaire des URLs avant le changement,
- de prévoir où le contenu qu'elles représente sera dans la nouvelle version
- de migrer ce contenu dans le système de la nouvelle version
- et enfin de mettre a jour les liens et mettre en place les redirections adéquates pour amener les gens au bon endroit.

Des étapes couteuses (mais nécessaires à long terme) pour démarrer rapidement une nouvelle version, comme ici. <a href="https://4042302.org" hreflang="en">Aral Balkan propose une méthode, 4042302</a>, différente et plus légère:

- maintenir l'ancienne version en ligne, sur un domaine différent,
- [rediriger temporairement][mdn-redirections] les erreurs 404 vers cette version de sauvegarde.

Libérer l'ancien site de WordPress
---

L'ancienne version du site tournait sur WordPress, qu'il faut maintenir à jour chaque fois qu'une nouvelle version sort. C'est très bien lorsque le site est active, mais pour juste conserver une sauvegarde, c'est beaucoup. Autant héberger un site statique plus léger.

Le contenu est déjà générer sur le site, il est prêt au téléchargement avec `wget`. Son option `--recursive`/`-r` lui permet de suivre les liens de chaque page et de les télécharger. Il manquerait les images, feuilles de style et scripts, mais l'option `--page-requisites`/`-p` permet de les télécharger. En restant sur le domaine du site avec l'option `--domains` et en ignorant les directives des fichiers `robots.txt`, cela permet de sauvegarder tout le contenu du site.

```sh
wget --random-wait -r -p --no-parent --domains=example.com -e robots=off example.com
```

### Nettoyer les liens

C'est un début, mais il reste quelques détails à arranger avant de pouvoir republier l'ancien site sur son nouveau domaine. Tout d'abord les liens, dans lesquels WordPress injectait le domaine du site. Pour le remplacer, j'ai d'abord bricolé une série de commande un peu alambiquée (pas ma meilleur idée, mais elle à marché avec ce que je savais):

```sh
grep -P -rl 'https?://romaricpascal.is' www | xargs perl -pi -e 's/
https?:\/\/romaricpascal.is//g'
```

C'était avant de découvrir `sed`, qui m'aurait permis de faire ça bien plus simplement:
`sed -i 's/https?:\/\/romaricpascal.is//g`. Il m'a d'ailleur permis de réparer les `href` laissés vides par le remplacement initial:

```sh
sed -i 's/href=""/href="\/"/g' www/**/*.html www/*.html
```

### Nettoyer les autres restes de WordPress

WordPress injectait aussi un certain nombre de balises `<script>`,`<link>` et `<style>`, qui ne seront plus utilisées. Un remplacement un peu trop complexe pour `sed`. `rehype` est un outil plus adapté ici. Plutôt que se baser sur des chaînes de caractère, il transforme le HTML en un arbre d'objets JavaScripts (arbre de syntaxe). On peut alors en isoler certain noeuds à supprimer.

Grâce à un fichier de configuration `.rehyperc.js`, on peut lui indiquer de charger un plugin spécifique, depuis le fichier `./rehype/drop-wordpress-scripts.js`:

```js
module.exports = {
  plugins: [
    './rehype/drop-wordpress-scripts.js',
  ]
}
```

Supprimer des noeuds est facilité par l'un des nombreux plugins pour `unist` (le format d'arbre de syntaxe manipulé par `rehype`). `unist-util-remove` permet de ne penser qu'à la sélection des noeuds, en fonctions de leurs propriétés ou contenu, et se charge de la supression.

```js
const remove = require('unist-util-remove');

module.exports = function attacher() {
  
  return function transformer(tree, file) {
  
    remove(tree,{},function(node) {
      if (node.tagName === 'script') {
        if (node.properties.src) {
          return /wp-includes/.test(node.properties.src) || /wp-content\/plugins/.test(node.properties.src)
        } else {
          return /wpemoji/.test(node.children[0].value) || /wpcf7/.test(node.children[0].value);
        }
      }
      if (node.tagName === 'link') {
        return /(wp-content\/plugins|s.w.org)/.test(node.properties.href);
      }
      if (node.tagName === 'style') {
        return /img.emoji/.test(node.children[0].value)
      }
      return false;
    })
  }
}
```

Après avoir installé `rehype-cli` avec `npm i rehype-cli`, lancer `npx rehype www -o` passera à la moulinette tous les fichiers HTML du dossier `www` pour les mettre à jour. Le site ne devrait maintenant plus avoir de lien inutiles à WordPress.

4042302
---

Maintenant que l'ancien site est nettoyé et déployé sur old.romaricpascal.is, on peut mettre en place 4042302. Apache, grâce aux variables qu'il crée pour chaque requête, support cette directive `ErrorDocument` pour rediriger les erreurs 404:

```apache
ErrorDocument 404 https://old.romaricpascal.is%{REQUEST_URI}?%{QUERY_STRING}
```

Ça marche, mais c'est un peu moche. Sans `QUERY_STRING`, on se retrouve avec un `?` dans l'URL. Mais surtout les pages 404 affichées seraient celles de l'ancien site.

Heureusement, le serveur qui héberge ce site supporte PHP. Il est donc possible de vérifier si la page existe sur l'ancien site avant de rediriger:

```php
$base_url = "https://old.romaricpascal.is";

if (!empty($base_url)) {
  $url = "$base_url$_SERVER[REQUEST_URI]";
  // Prépare une requête à l'ancien site
  $ch = curl_init($url);
  // Envoie une requête OPTION plutôt que GET
  curl_setopt($ch, CURLOPT_NOBODY, true);
  // Suis les redirections
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  // Envoie la requête
  $response = curl_exec($ch);
  // Et récupère le status de réponse
  $response_code = curl_getinfo($ch,CURLINFO_RESPONSE_CODE);
  curl_close($ch);

  if ($response_code >= 200 && $response_code < 300) {
    // La page existe, on peut rediriger!
    header("Location: $url", true, 302);
    die();
  }
}

// Si on arrive ici, l'URL n'était pas valide pour l'ancien site non plus, ou aucune `$base_url` n'était spécifié. 
// Il faut donc afficher la page 404 du nouveau site, en imitant le comportement d'Apache pour accepter: une redirection, le rendu d'un document (ou un texte arbitraire).
$error_redirect = '';
$error_document = '';
$error_message = 'Not found';

if (!empty($error_redirect)) {
  header("Location: $error_redirect", true, 302);
  die();
} else if (!empty($error_document)) {
  include $error_document;
} else {
  echo $error_message;
}
```

En plaçant ceci dans un fichier `4042302.php` dans le dossier `content` du site, il reste à configurer Apache pour l'utiliser dans le `.htaccess`:

```apache
ErrorDocument 404 /4042302.php
```

Bon, c'est plus un site 100% statique, mais la partie dynamique est uniquement pour les erreurs. Pas si pire. En attendant la migration de l'ancien contenu vers le nouveau site et la mise en place de redirections plus permanentes, les anciennes URLs restent utilisables.

Plus qu'une petite étape d'automatisation avant de reprendre la construction du site en elle-même.

[mdn-redirections]: https://developer.mozilla.org/fr/docs/Web/HTTP/Redirections#Redirections_temporaires
