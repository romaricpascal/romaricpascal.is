---
date: 2020-06-17
title: Detecter la langue - Seconde passe
slug: detecter-la-langue-seconde-passe
type: post
layout: post.pug
---
Deuxième passage sur la détection de la langue depuis le chemin du fichier. [Utiliser le premier dossier][previous-article] a permi de structurer le plugin. C'est l'heure maintenant de lui faire détecter un suffixe `--<langue>`, [comme prévu][plan].

Un peu de refactoring
---

Pour le moment, le code de la fonction `getLanguageInfo` se charge de deux choses:

- détecter la langue en utilisant le premier dossier dans le chemin du fichier

    ```js
    const prefix = new RegExp(`^(${languages.join('|')})/(.*)`);
    const result = prefix.exec(file.pathInfo.stem);

    if (result) {
      return {
        language: result[1],
        key: result[2]
      };
    //...
    ```

- définir une langue par défaut si aucune n'est détectée

  ```js
  // ...
  } else {
    return {
      language: defaultLanguage,
      key: file.pathInfo.stem
    }
  }
  ```

Pour plus de flexibilité, on va les séparer en deux fonctions spécifiques.

```js
function pathPrefix(file, { languages } = {}) {
  const prefix = new RegExp(`^(${languages.join('|')})/(.*)`);
  const result = prefix.exec(file.pathInfo.stem);
  if (result) {
    return {
      language: result[1],
      key: result[2]
    };
  }
}

function defaultLanguageInfo(file, { defaultLanguage } = {}) {
  return {
    key: file.pathInfo.stem,
    language: defaultLanguage
  };
}
```

Grâce à elles, `getLanguageInfo` n'a qu'à se charger de retourner le résultat de la première qui détecte une langue. Vu que chacune prend ses options depuis un `Object`, cela permet de garder `getLanguageInfo` au plus simple. Pas besoin de penser à quelle valeur des options prendre et passer en deuxième argument. Chaque fonction de détection est responsable de la totalité de ce qui la concerne, option comprises. Propre!

```js
function getLanguageInfo(file, options) {
  return (
    pathPrefix(file,options) ||
    defaultLanguageInfo(file, options)
  )
}
```

Non seulement cela facilite la lecture du code, l'insertion de nouvelles méthodes de détection est simplifiée: créer une nouvelle fonction de détection et l'appeler avant les autres. C'est d'ailleurs ce que nous allons faire.

Pas vraiment pareil, pas vraiment différent non plus
---

[Les expressions régulières ont bien fait leur boulot pour détecter le premier dossier][regular-expressions]. Rebelotte pour détecter le suffixe à la fin du fichier donc.

```js
function filenameSuffix(file, { languages } = {}) {

  const suffix = new RegExp(`(.*)--(${languages.join('|')})`);
  const result = suffix.exec(file.pathInfo.stem);

  if (result) {
    // Cette fois, vu l'expression régulière
    // la langue est en deuxième place 
    return {
      language: result[2],
      key: result[1]
    };
  }
}
```

Une fois ajouée à la série de détection de `getLanguageInfo`, un contenu `index--fr.md` verra sa langue détectée correctement.

```js
function getLanguageInfo(file, options) {
  return (
    filenameSuffix(file, options) ||
    pathPrefix(file,options) ||
    defaultLanguageInfo(file, options)
  )
}
```

Et voilà pour la détection de la langue! On pourrait imaginer utiliser d'autre parties de `pathInfo`, comme la première extension (`.fr.md`) pour implémenter d'autres moyens de détecter la langue. Mais on a déja assez ici.

C'est n'est que la moitié du chemin pour générer le contenu de ce contenu `index--fr.md`. En l'état, il va se retrouver à l'URL `/index--fr/`. Pas vraiment le `/fr/` où il devrait se trouver. Ça sera pour le prochain article.


[previous-article]: ../detecter-la-langue-premiere/
[plan]: ../quelques-plans
[regular-expressions]: ../detecter-la-langue-premiere/#detecter-la-langue
