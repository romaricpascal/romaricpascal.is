---
date: 2020-07-28
title: Dernière ligne droite
slug: derniere-ligne-droite
type: post
layout: post.pug
---
Le site est presque en l'état dans lequel il a été relance. Il reste une dernière fonctionnalité à ajouter: publier des articles. Ils ne sont en effet pas tout à fait identiques aux pages publiées jusqu'alors. Ils sont datés, partagent une mise en page particulière (et à terme certainement d'autres fonctionalités telles que des catégories, une navigation suivant/précédent...). Ils devront aussi être regroupés dans une liste sur une page d'archive, pour permettre leur découverte. Et pour aider les gens à suivre leur parution, ils seront égalements listés dans un flux RSS.

Tout un programme, qu'il serait bon de découper un peu. Voyons-donc ce qui va suivre.

Page d'article
---

Afficher le contenu des articles en lui-même ne sera pas bien différent de l'affichage du contenu des autres page.
Ce qui change ici, ça sera la mise en page autour du contenu. Tout comme les pages du site doivent être cohérentes les unes avec les autres, on veut des articles à la mise en page similaire de l'un à l'autre. Ça va demander:

1. D'identifier quels contenu sont des articles
2. De leur associer une mise en page particulière

Les articles devront aussi être datés, pour permettre aux visiteurs/euses de juger si les informations sont encore pertinentes. Celà amène de nouveaux défis pour l'internationalisation. Les parties des dates devront être affichées dans le bon ordre (et avec les mois dans la bonne langue, si possible ;) )

Page d'archive et flux RSS
---

Une fois les articles distincts des autres pages, la première étape pour en afficher une liste sera de collecter cette liste. Ou plutôt ces listes, car il en faudra une pour chaque langue.

Ensuite, il faudra générer le HTML pour la liste. Vu le contenu dynamique, il faudra se tourner vers Pug pour générer le contenu, plutôt que Markdown comme les autres pages.

Et pour le flux RSS, plutôt que d'écrire les balises "à la main", pourquoi ne pas utiliser le package `rss`. Il date un peu, mais RSS est un format qui n'a pas bien bougé et ce package à l'air d'être la solution privilégiée pour publier un flux RSS au vu des package qui en dépendent (Ghost, plugins VuePress, Gatsby et autres).

Une fois tout en place, le générateur de site statique sera enfin dans l'état où il se trouvait au moment de relancer le site (il y a deux mois, déja). L'occasion de pouvoir passer à d'autres améliorations, ou peut-être prendre une pause pour documenter une autre aventure. Peut-être un mélange des deux, qui sait. Pour le moment, en avant pour la gestion des articles. Le prochain parlera d'ailleurs de les distinguer des simples pages et de leur donner une mise en page particulière.

