---
title: Internationalising dates with JavaScript
date: 2020-08-05
type: post
layout: post.pug
---
Les articles ont besoin d'afficher une nouvelle métadonnée: leur date. Sans elle, impossible de savoir à quand remonte leur contenu et s'il peut encore être valide.

Heureusement, Metalsmith comprend déjà qu'une propriété `date` dans le front-matter d'un fichier doit être transformée en objet `Date` côté JavaScript. Il n'y a donc qu'à s'occuper de son formattage.

Pas juste en faire une chaine de caractère qu'un humain peut comprendre, mais écrite dans la bonne langue.

L'API d'internationalisation de JavaScript
---

Nativement, l'objet `Date` dispose d'une méthode `toLocaleString` pour justement s'occuper de ça. Elle offre tout [plein d'options][toLocaleString-params] pour:

- sélectioner la "locale" (la langue, ainsi que la manière de formatter dates, nombres… dans cette langue)
- choisir quelles parties de la date afficher (année, mois, jour, heures, minutes, secondes, fuseau horaires…)
- et comment les affichers (format court, long, numérique ou texte…)
- ou utiliser des formats pré-définis pour la date et/ou le temps

Par défaut, je m'oriente généralement vers les jours sur 2 chiffres (tous la même longueur), les mois écrits en abbrégé (ça évite les confusions entres les dates en anglais américain et en anglais... anglais?) et les années sur 2 ou 4 chiffres (suivant l'espace disponible). Avec cette méthode, ça donne:

```js
const date = new Date(2020,07,04);
date.toLocaleString('en-gb', {year: 'numeric', month: 'short', day:'2-digit'}) // 04 Aug 2020
date.toLocaleString('fr', {year: 'numeric', month: 'short', day:'2-digit'}) // 04 août 2020
```

C'est un peu plus verbeux que des descripteurs comme `DD MMM YYYY` utilisées par beaucoup de libraries de formattage. Mais c'est compensé par un gain de clareté, de mon point de vue (est-ce que 'M' est un mois <a href="https://date-fns.org/v2.14.0/docs/format" hreflang="en">sur un seul chiffre</a>? ou <a href="https://www.php.net/manual/en/datetime.format.php" hreflang="en">en texte court</a>?).

Pour formatter plusieurs dates de la même manière, il est plus intéressant (et [plus performant][toLocaleString-perf]) de créer un objet `Intl.DateTimeFormat` et de le réutiliser à chaque date. Parmis les pépites proposées par `Intl` pour l'internationalisation, c'est celui qui se charge de... mettre en forme les dates. Il prends les mêmes arguments que `toLocaleString` (ou plutôt `toLocaleString` prend les mêmes arguments que `DateTimeFormat`?): locale, puis options de mise en forme.

```js
const formatter = new Intl.DateTimeFormat('fr', {year: 'numeric', month: 'short', day:'2-digit'});
const date = new Date(2020,07,04);
formatter.format(date); // 04 août 2020
```

Ça a l'air parfait tout ça!

Internationalisation avec Node
---

Ces APIs d'internationalisation sont supportées par Node. Elles le sont [également par les navigateurs modernes (et IE11)][intl-browser-support], pensez-y avant d'envoyer un surplus de KB aux utilisateurs pour formatter des dates.

Cependant, sur les versions de Node inférieures à 13 (dont les 12.x actuellement en Long Term Support au moment de l'écriture), `toLocaleString()` ou `format()` vous retournera peut-être la date en anglais américain pour n'importe quelle locale.

Node délègue l'internationalisation à <a href="http://site.icu-project.org/" hreflang="en">ICU</a>, une librarie C/C++. Avant la version 13, Node n'embarquait par défaut qu'une partie des données pour ICU, <a href="https://nodejs.org/docs/latest-v12.x/api/intl.html#intl_internationalization_support" hreflang="en">supposant que la plupart des utilisateurs n'auraient pas besoin de tout</a>.

Le plus simple c'est de mettre à jour Node pour une version plus récente (par exemple 14.x, qui sera la prochaine Long Term Support).

Pas possible? Rien n'est perdu, les données complètes pour ICU peuvent être installées avec le package NPM `full-icu`. Une fois installé, il faudra dire à Node où les trouver avec son option `--icu-data-dir` ou la variable `NODE_ICU_DATA`. L'une ou l'autre peuvent être passées dans un script NPM pour lancer le project, ce qui rendra le tout plutôt portable:

```json
{
  "scripts": {
    "start": "node -icu-data-dir=node_modules/full-icu src/index.js",
    "dev": "nodemon --exec npm start"
  },
  "dependencies":{
    "full-icu": "^1.3.1"
  }
}
```

Enfin, en dernier recourt, il est toujours possible de compiler Node depuis les sources avec les options adéquates: `--with-intl=full-icu --download=all` (<a href="https://github.com/nvm-sh/nvm/issues/1719" hreflang="en">également avec NVM</a>). Ça implique, par contre, de vérifier que chaque machine qui fera tourner le code aura bien Node compilé de la bonne manière: les ordinateurs des développeurs, les serveurs, l'intégration continue… Une recette pour un bon mal de tête, à mon avis.

Metalsmith et l'API d'internationalisation
---

On va donc utiliser cette API d'internationalisation pour mettre en forme la date de chaque poste. Comme il y aura plusieurs dates à rendre à chaque génération du site, on va créer un objet `Intl.DateTimeFormat` par langue dans le fichier `src/index.js`:

```js
//...
const FORMATTERS = {
  en: new Intl.DateTimeFormat('en-gb', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }),
  fr: new Intl.DateTimeFormat('fr', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
};

metalsmith(process.cwd())
//...
```

En passant par les métadonnées de Metalsmith, on peut les passer aux templates. Sauf que Pug n'était pas content d'appeler leur méthode `format`. On peut par contre passer aux templates une fonction qui fait l'appel à `format` et tout marche nickel:

```js
//...
.metadata({
  //...
  dateFormats: {
    en: date => FORMATTERS.en.format(date),
    fr: date => FORMATTERS.fr.format(date)
  }
  //...
})
//...
```

On peut alors utiliser ces fonctions dans le gabarit `layout/post.pug` pour afficher la date juste après le titre. La balise `<time>` ajoutera un peu de sémantique et une représentation ISO de la date dans son attribut `datetime`:


```pug
  //- ...
  time.margin-top--0(datetime=date.toISOString())
    = get(dateFormats,i18n.language)(date)
  //- ...
```

La date est maintenant affichée pour chaque article, dans la bonne langue. Les pages de chaque article sont donc prête (enfin pour le redémarrage du site) et on pourra se pencher sur la liste des articles dans le prochain.

[toLocaleString-params]: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Date/toLocaleString
[toLocaleString-perf]: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#Performance
[intl-browser-support]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#Browser_compatibility
