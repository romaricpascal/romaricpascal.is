---
date: 2020-06-09
title: Premiers pas vers l'internationalisation
slug: premiers-pas-vers-l-internationalisation
type: post
layout: post.pug
---
Le moment est venu de commencer à travaillers sur la publication en deux langues différentes. Pour simplifier la tâche au démarrage, on ne va parler que de la page d'accueil. Elle sera suffisante pour mettre au jour les premières choses à faire, avant de s'attaquer aux pages nichées dans des dossiers.

Pour supporter des versions traduites, rien que pour cette page unique, il faut déjà:

- [ajouter des attributs de langue dans le HTML][w3c-markup]
- fournir un moyen de naviguer d'une langue à l'autre.

Cette première partie devrait être bien assez pour remplir cet article, donc allons-y!

Décrire la langue du contenu dans le HTML
---

Chaque élément HTML supporte [l'attribut `lang`][lang-attribute] pour décrire la langue de son contenu. **Au minimum, la balise `<html>` doit en avoir un**. Si besoin, ses descendants peuvent annoncer que leur contenu est dans une autre langue en portant leur propre attribut `lang`.

C'est par exemple le cas sur cette page, où la balise `<html>` annonce un contenu en français. Mais le lien pour accéder à version anglaise est écrit en anglais, qu'il annonce grâce à `lang="en"`.

Cet attribut est <a href="https://www.powermapper.com/tests/screen-readers/content/html-page-lang/" hreflang="en">extrêmement important pour les lecteurs d'écran</a>. C'est ce qui leur permet de choisir la bonne prononciation du contenu.

Cela veut dire que le [layout `site.pug`, mis en place il y a quelques articles][layout-setup], doit être un peu adapté. A la place d'un `lang="en"` en dur dans le code, il va maintenant devoir accepter une variable (on va dire `language` pour le moment) portée par chaque page.

```pug
html(lang=language)
```

Pour définir ce `language`, on peut utiliser le front-matter de chaque page. Sur le fichier `index.md` en ayant ces premières lignes:

```md
---
language: en
---
```

Et son pendant français, `fr/index.md` qui commencera lui avec:

```md
---
language: fr
---
```

Avec ça, le HTML de chaque page annoncera la bonne langue. Cela va vite devenir lourd de commencer chaque fichier ainsi (sans parler des erreurs), donc le système sera vite ammené à changer.

Des liens en d'autre langue
---

Comme les pages ou certains éléments peuvent annoncer leur langue, les liens peuvent annoncer la langue du contenu auquel ils voient, grâce à l'attribute `hreflang`.

La valeur de cet attribut peut ensuite être utilisé en CSS pour améliorer les liens en informant de la langue de destination.

```css
[hreflang]:not(.no-hreflang)::after {
  content: ' (' attr(hreflang) ')'
}
```

Les liens avec un attribut `hreflang` afficheront maintenant la langue de destination. Dans certaines situations, le contenu indique déjà clairement la langue de destination (par exemple pour naviguer d'une langue à l'autre), d'où la class `no-hreflang` qui permet de se passer de l'affichage.

Cela permettra également de signaler la langue de destination aux technologies d'assistance, <a href="https://blog.benmyers.dev/css-can-influence-screenreaders/#css-generated-content" hreflang="en">le contenu généré par le CSS étant intégré au nom accessible des éléments</a>. En espérant juste que ces technologies n'en fassent pas déjà l'annonce, mais je n'ai rien trouvé sur le sujet.

C'est donc parti pour internationaliser le site. Prochaines étapes: naviguer d'une langue à l'autre, puis organiser le contenu, faire correspondre les articles traduits...Mais c'est pour de futurs articles.

[w3c-markup]: https://www.w3.org/International/questions/qa-html-language-declarations.fr
[lang-attribute]: https://developer.mozilla.org/fr/docs/Web/HTML/Attributs_universels/lang
[layout-setup]: ../ layout-partage
