---
date: 2020-06-11
title: Quelques plans
slug: quelques-plans
type: post
layout: post.pug
---
Une page d'accueil traduite, c'est bien, mais au final le site aura bien plus d'une page. Le système mis en place jusque là était très bien pour se lancer. Mais avec de nouvelles pages, il va vite montrer ses limites. Il est donc temps de le modifier un peu.

Les soucis qui arrivent
---

Le premier point qui coince, c'est la langue inscrite dans le front-matter de chaque fichier. Parfait pour faire perdre du temps pour avoir oublié de l'ajouter là où il faut. Ça serait plus sympa si elle était détectée automatiquement. Sans parler d'analyser le contenu des fichiers en lui-même (je ne sais pas trop si on pourrait s'y fier d'accord), on pourrait utiliser leur chemin pour trouver leur langue. Il faudra toujours écrire quelque chose à la main, mais cela rendra la langue plus visible. Plus besoin d'ouvrir les fichiers, on le voit directement grâce au dossier où ils se trouvent (ou à leur noms, je préfere).

Il manque également un moyen d'associer un contenu à sa version traduite. Avec un seule page, l'autre page ne peut être que sa traduction. Mais avec l'ajout d'autre pages, il faudra leur donner chacune une variable dont la valeur est partagée avec leur traduction. C'est crucial pour pouvoir diriger les personnes vers la version traduite de la page courante, plutôt que la page d'accueil, lorsqu'elles choisissent une autre langue. Et surement pour d'autres choses aussi...

Enfin, les contenus et leurs traductions sont bien loin les uns des autres. Les pages en français sont dans le dossier `content/fr/`, les versions anglaises directement à la racine du dossier `content`. Cela correspond à la structure du site généré. Cependant lorsque les pages seront dans des sous-dossier, ou juste qu'il y en aura plein, ça va vite devenir difficile de savoir ce qui est traduit de ce qui ne l'est pas. Encore pire, les noms risquent de ne pas correspondre pour que les URLs soient elles aussi traduites. Je préfèrerais les fichiers les uns juste à côté des autres, avec des noms qui reflètent qu'ils correspondent au même contenu.

Le plan
---

Pour faire face à ces trois soucis:

- chaque contenu et sa traduction seront dans le même dossier, avec un suffixe `--fr` pour dénoter la version française. Ce nommage inspiré par <a href="http://getbem.com/naming/" hreflang="en">BEM, une methodologie CSS</a>, permet aux extensions de ne faire que marquer le type de fichier, ce qu'elles font habituellement.
- C'est ce suffixe qui sera utilisé pour choisir la langue, ce qui évitera de l'écrire dans le front-matter. Les fichiers qui n'en ont pas se veront associé une langue par défaut configurée dans les metadonnées de Metalsmith.
- Enfin, le reste du chemin du fichier, une fois l'extension et le suffixe retiré sera utilisé pour associer les traductions.

Par exemple, `posts/article--fr.md` sera détecté "en français". Il sera associé à `posts/article.md`, lui dans la langue par défaut, grâce au chemin `posts/article` qu'ils partagents lorsqu'on retire leurs extension et le suffixe.

Et pour la traduction des URLs? Chaque fichier pourra définir le slug qu'il souhaite avoir dans l'URL, ce qui permettra aux traductions d'en avoir un dans leur langue. On peut même imaginer traduire les autres parties du chemin... mais chaque chose en son temps !

Tout ça fait un bon bout de boulot, il va falloir procéder par étapes:

1. Un peu de préparation pour découper le chemin des fichiers pour pouvoir en extraire la langue et la clé de traduction qui unit les fichiers plus facilement
2. Extraire la langue et la clé de traduction de ces bouts de chemins
3. Ecrire les fichiers à leur destination finale, en tenant compte de leur langue et d'un possible `slug`

C'est donc l'heure d'écrire les premiers plugins Metalsmith pour ces fonctionalités spécifiques au projet. J'ai plutôt hate de commencer à en parler dans les prochains articles.
