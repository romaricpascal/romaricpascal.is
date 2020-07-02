---
date: 2020-06-02
title: Une base accessible - Les titres
slug: une-base-accessible-les-titres
type: post
layout: post.pug
---
Les titres sont un élément important pour rendre le contenu accessible. Ils découpent le contenu en parties bien identifiées, plus facile à absorber. Ils offrent également des raccourcis utiles pour les personnes utilisant des technologies d'assistance. Dans le sondage <span lang="en">WebAIM Screen Reader Survey</span>, <a href="https://webaim.org/projects/screenreadersurvey8/#finding" hreflang="en">68.8% des personnes ayant répondu indiquent utiliser les titres pour naviguer sur une page</a>. En effet, les lecteurs d'écran (par exemple) listent les titres de la page et permettent de sauter de l'un à l'autre. Ceci permet aux utilisateurs/trices de rejoindre rapidement une section qui les interesse.

Pas de magie
---

Pour que ça marche, par contre, rendre le texte plus gros et/ou plus gras n'a pas d'impact. Seuls les personnes qui peuvent le voir penseront que c'est un titre. Les machines ont besoin de balisage sémantique pour savoir avec certitude qu'un bout de texte en particulier est bien un titre.

C'est le rôle des balies `<h1>` à `<h6>` de HTML, chaque chiffre représentant un niveau de titre. `<h2>` marque une sous-section du `<h1>` le précédent, `<h3>` du `<h2>` d'avant, et ainsi de suite. Créer un plan clair grâce à ces éléments, avec des niveaux cohérents (sans en sauter, par exemple), <a href="https://webaim.org/projects/screenreadersurvey8/#heading" hreflang="en">permet aux utilisateurs/trices de parcourir rapidement la page</a>.

Rien n'empêche, techniquement, d'avoir plusieurs `<h1>` sur la page. Cependant, n'en avoir qu'un, annonçant habituellement le sujet de la page, donne un point d'entrée clair. Sur cette page, le titre de l'article, par exemple. 

Mais rien ne l'oblige à être le premier titre sur la page. <a href="https://www.w3.org/WAI/tutorials/page-structure/headings/#main-heading-after-navigation" hreflang="en">Des sections de l'en-tête de la page peuvent tout à fait être introduites par une balise `<h2>`</a>, par exemple. Et rien ne l'oblige non plus à être le plus gros/gras bout de texte sur la page. Il s'agit plus d'une préoccupation de design, mais c'est utile de s'en rappeler pour des designs de sites plus applicatifs.

Gérer les niveaux de titre
---

Sous ce `<h1>` principal, il faut ensuite gérer le niveau de chaque titre pour assurer une hiérarchie correcte. Vous aurez peut-être rencontré la proposition de HTML5 pour utiliser uniquement des `<h1>` et des éléments sectionnants pour <a href="ttps://html.spec.whatwg.org/multipage/sections.html#outline" hreflang="en">établir cette hiérarchie de titres</a>. Hélas, ceci n'a <a href="https://adrianroselli.com/2016/08/" hreflang="en">jamais été implémenté par les navigateurs</a>. `<h2>`,`<h3>`,... sont donc toujours à utiliser.

Celà devient problématique lorsque le contenu de la page provient de plusieurs sources, ou inclus à différent niveaux de titres (sur diffrentes pages). Sur cet article, par exemple, le `<h1>` provient de métadonnées dans le front-matter du fichier.

```md
---
title: Une base accessible - Les titres
type: post
---
```

Le reste des titres provient lui de la compilation du Markdown. Le hic, c'est qu'il faut donc commncer les titres en Markdown au second niveau.

```md
## Titre de second niveau

ou

Titre de second niveau
---

Je préfère ce dernier d'ailleurs ;)
```

Pas forcément un gros soucis pour une seule personne, surtout quand c'est celle qui construit le site. Ça marche moins bien quand on parle de plusieurs personnes au sein d'une organisation, qui doivent ajouter du contenu au CMS, par exemple.

Malheureusement, je n'ai pas de solution magique à offrir (je suis preneur si vous en avez). Peut-être que d'[ajuster automatiquement le niveau de titre minimum du contenu][heading-levels-shifting] peut aider. Limiter les options disponibles dans le CMS, ansi qu'ajouter des validations, est sûrement une autre piste à explorer. Par exemple, ne pas offrir d'ajouter des `<h1>` s'ils sont déja générés ailleurs, ou afficher un message d'erreur éducatif si la hiérarchie de titres a l'air cassée.

Vérifier la hiérarchie de titres
---

Chercher chaque titre au milieu de toutes le balises, ça fait pas vraiment rêver. Heureusement, il y a d'autres moyens de vérifier que les titres sont bien ordonnés.

J'aime bien l'[extension headingsMap pour Firefox][headingsmap-firefox] (disponible également [pour Chrome]) pour jeter un coup d'oeil à la liste des titres. Elle indique également si des titres ne sont pas au bon niveau dans la hiérarchie. C'est aussi quelque chose que fait <a href="https://www.deque.com/axe/" hreflang="en">Axe</a> (parmi d'autres vérifications d'accesibilité).

Et il est toujours possible de regarder ce que détectent les lecteurs d'écrans. [Mac][voiceover], [Windows 10][narrator] et [Ubuntu][orca] en embarque un tous les trois, et [NVDA][nvda] peut également être installé sur Windows.

En complément des titres, il y a d'autres moyens pour aider la navigation au sein d'une page pour les utilisateurs/trice de techologies d'assistance. Assez pour en faire le prochain article, qui parlera des landmarks ARIA.

[heading-levels-shifting]: https://github.com/cgillions/to-fro/blob/e98d889aaf909d68cc7126672bed0bd771ea6844/src/markup_help/templatetags/headings.py
[headingsmap-firefox]: https://addons.mozilla.org/fr/firefox/addon/headingsmap/
[headingsmap-chrome]: https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi
[voiceover]: https://help.apple.com/voiceover/mac/10.15/?lang=fr
[narrator]: https://support.microsoft.com/fr-fr/help/22798/windows-10-complete-guide-to-narrator
[orca]: https://help.gnome.org/users/orca/stable/index.html.fr
