---
title: À propos
slug: a-propos
---
A propos
===

<div>

<img src="/media/me.png" alt="" class="avatar" role="presentation">

**Enchanté, je suis Romaric** et je construis des sites web depuis plus de 12 ans maintenant. En cours de route, j'en suis venu à m'interesser de près à l'accessibilité et aux performances, qui permettent d'offrir une bonne expérience au plus grand nombre.

Je me spécialise dans l'écriture de templates ou composants sémantiques, et de CSS maintenable (de zéro ou en complément de librairies telles que Bootstrap) pour supporter des backends variés: côté serveur comme Rails ou Django, ou côté client comme React ou Vue.

</div>

Si je suis également très attaché à la protection des données privées, je crois beaucoup au partage, qu'il soit de [code open-source][github-profile] ou de [connaissances](#articles).

En ce moment
---

Après un peu plus de deux ans à mon poste précédent, j'ai ressenti le besoin de prendre du temps pour des expérimentations personelles: [quelques expériences](#autres-projets) mais aussi des projets plus aboutis:

<article class="project">

### [Site personel][romaricpascal.is]

<p class="lead">Explorer la génération de site statiques, l'internationalisation et la production d'articles</p>

Repartant de zéro, j'ai reconstruit ce site en utilisant un générateur de site statique (Metalsmith), implémentant des fonctionnalités pour publier à la fois en français et en anglais. Des [articles sur le blog][/fr/posts/] documentent en détail le processur, du JavaScript pour implémenter les fonctionnalités aux CSS mis en place pour les styles, en passant par des bases d'accessibilité.

<p class="tech-list">JavaScript (NodeJS), Metalsmith, HTML, CSS, Markdown</p>

</article>

<article class="project">

### [To/Fro][to-fro]

<p class="lead">Collaboration bénévole à une application pour coordonner les volontaires de <a href="https://knowlewestalliance.co.uk/" hreflang="en" lang="en">Knowle West Alliance</a> qui aident les personnes isolées par la crise du Covid-19</p>

J'ai participé au hackathon <a href="https://www.euvsvirus.org/" hreflang="en">EUvsVirus</a> qui a vu le démarrage du projet et ai continué sa construction après. L'équipe étant très réduite, j'ai pu participer sur des aspects variés: mise en place d'outils pour le front-end, implémentation de templates Django et leur styles avec Bootstrap, mais aussi utilisation de l'ORM de Django pour requêter les données à afficher, personalisation de l'admin Django, de l'authentification et des emails.

<p class="tech-list">Django, HTML, CSS (Bootstrap, SASS), JavaScript (jQuery), tooling (Parcel)</p>

</article>

Par le passé
---

### Nov. 2017 - Fev. 2020: Cookies HQ - Développeur front-end

Conception et développement de composants front-end pour diverses applications, en collaboration avec les développeurs backend et designers. Support à l'équipe sur les problèmes front-end.

J'ai également sensibilisé à l'accessibilité, au travers de:

- <a href="https://www.cookieshq.co.uk/posts/building-accessible-websites-is-a-job-for-the-whole-team" hreflang="en">une présentation interne</a>
- <a href="https://www.cookieshq.co.uk/posts/author/romaric" hreflang="en">divers articles</a>
- <a href="https://cookieshq.github.io/accessibility-smart-cookies" hreflang="en">une présentation publique</a> au  <a href="https://www.meetup.com/Smart-Cookies-Bristol/events/264888812/" hreflang="en">meetup Smart Cookies</a>

<blockquote lang="en">

He was a key member of our team, leading the front-end development on many projects. He was our accessibility and ethics champion. He has challenged us more than anyone else, pushing us to constantly improve our processes and the way we approach projects.

We have learnt a lot from him. I think that, going forward, Nic and I will always have a little Romaric's voice in our heads but above all, we're very grateful for the 2 years that he has spent with us.

<cite><a href="https://www.linkedin.com/feed/update/urn%3Ali%3Aactivity%3A6638408058257055744/">Nathalie Alpi - Co Founder and Managing Director at CookiesHQ</a></cite>

</blockquote>

<article class="project">

#### <a href="https://stornaway.io" hreflang="en" lang="en">Stornaway</a>

<p class="lead">
Développement d'un éditeur de graphes pour faciliter la <a href="https://www.stornaway.io/#homevideoplayer" hreflang="en">création de vidéos interactives</a>
</p>

En dehors de l'implémentation générale des styles, j'ai plus particulièrement travaillé sur l'éditeur de graphe lui-même. Il permet aux créateurs/trices de cartographier les histoirs qu'iels créent: quelles scènes composent l'histoire, quels choix sont offerts à la fin de chacune et comment ceux-ci affectent la scène choisie. Iels peuvent ensuite uploader une vidéo pour chaque scène et exporter l'histoire.

Plus particulièrement:

- Prototypage de la faisabilité des fonctionnalités à ajouter à la bibliothèque de graphes (JointJS/RappidJS)
- Collaboration avec les développeurs back-end sur l'achitecture pour sauver et charger les graphes
- Intégration de l'édition de graphe avec des formulaires Rails pour éditer les données des noeuds
- Implémentation de contrôles de forulaires spécifiques (onglets, upload, color-picker)

<p class="tech-list">Rails, HTML (HAML), CSS (Bootstrap, SASS, SCSS), JavaScript (RappidJS), tooling (Webpack)</p>

</article>

<article class="project">

#### <a href="https://bigcleanswitch.org" hreflang="en" lang="en">Big Clean Switch</a>

<p class="lead">
Développement d'un "éditeur de blocs" pour aider la création de variantes d'un comparateur de fournisseurs d'énergie renouvelables.
</p>

Pour aider Big Clean Switch à adapter leur formulaire aux utilisateurs/trices ainsi qu'à leurs partenaires, j'ai aidé à:

- l'implémentation d'un "éditeur de blocs" qui leur permet d'organisers des champs prédéfinis en différentes étapes,
- choisir un thème pour leur rendu,
- intégrer le résultat à leur site Wordpress ou un site externe, en minimisant l'impact au performance (au travers de JS "vanilla" et de CSS spécifiques) et en évitant les styles extérieurs d'affecter le forumlaire.

Notamment:

- Implémentation sémantique de divers champs de formulaire
- Écriture de styles CSS responsive pour leur mise en page
- Réalisation de la navigation entre étapes par JavaScript ainsi que de comportements spécifiques aux champs (gestion d'erreurs, visibilité, adaptation des valeurs aux choix...)
- Selection de styles (choix de thémes)
- Collaboration avec les développeurs backend, à la fois sur le design et l'implémentation, à la sauvegarde, au rendu et la soumission du formulaire
- Intégration du formulaire sur le site marketting, ainsi que sites tiers
- Intégration d'un éditeur d'options réalisé avec Vue avec des formulaires Rails dans l'administration

<p class="tech-list">Rails, HTML (HAML), CSS (SASS, PostCSS), JavaScript (Vanilla), tooling (Webpack)</p>

</article>

<article class="project">

#### <a href="http://patternbank.com" hreflang="en">Patternbank</a>

<p class="lead">
Développement d'un "éditeur de blocs" pour faciliter la création de pages de contenu en support d'un site ecommerce.
</p>

Pour aider Patternbank à ajouter des pages de contenu à leur site ecommer, j'ai participé à la construction d'un "éditeur de bloc". Il permet de construire les pages en combinant des sections configurables. L'aspect visuel fort de ce site a demandé de se pencher particulièrement sur:

- des images responsive et performantes (lazy loading, srcset, arrière plans responsive)
- proposer des mises en pages responsives variées
- offrir des choix de styles (typographie, couleurs, variantes de composants)
- permettre une typographie fluide, mais accessible
- donner le contrôle sur les niveaux de titre.

D'un point de vue plus technique:

- Réalisation d'un prototype côté client pour explorer rapidement le concept avec Vue
- Collaboration, à la fois sur le design et l'implémentation, avec les développeurs backend pour sauver et charger le contenu
- Implémentation des composants et du rendu des page
- Écriture de styles
- Intégration d'un éditeur d'options réalisé avec Vue avec des formulaires Rails dans l'administration

<p class="tech-list">Rails, HTML (HAML), CSS (SASS, PostCSS), JavaScript (Vue, Vanilla), tooling (Webpack)</p>

</article>

<article class="project">

#### Mise à jour de sites ecommerce existant

<p class="lead">
Implémentation de changements de design et nouvelles fonctionnalités à des sites ecommerce en production
</p>

Pour des sites comme <a href="https://www.goodsixty.co.uk/retailers/bristol/115-earthcake" hreflang="en" lang="en">Good Sixty</a>, <a href="https://patternbank.com/studio" hreflang="en" lang="en">Patternbank</a> ou <a href="https://www.roughtrade.com/gb/s" hreflang="en" lang="en">Roughtrade</a>, j'ai implémenté les changements d'interface utilisateur/trice, notamment:

- liste de produits
- formulaire de filtrage
- pages produits
- checkout

<p class="tech-list">Rails, HTML, CSS (SASS), JavaScript (jQuery, Turbolinks)</p>

</article>

### Avant Nov. 2017

- Jan 2016 - Nov 2017: Artiste lettreur indépendant
- Jan 2012 - Dec 2016: Développeur front-end et web designer indépendant - Travaux incluant la réalisation d'un interface utilisateur/trice pour le <a href="https://community.hpe.com/t5/behind-the-scenes-at-labs/introducing-loom-a-new-tool-for-managing-complex-systems/ba-p/6793962" hreflang="en">projet Loom de HP Labs</a>
- Avr. 2008 - Aout 2011: Atos Worldine - De stagiaire à lead-developer sur l'API de cartes du géoportail de l'IGN

Autres projets
---

En dehors de travaux pour des clients, et de [ce site][romaricpascal.is], je bricole aussi sur différents projets: petites applications, outils ou juste expérimentations avec des concepts ou technologies qui me semblent intéressantes. En voici quelque uns:

<article class="project project--side">

### <a href="https://taskfight.romaricpascal.com" hreflang="en">Taskfight</a>

Une application (plus toute jeune) React où les tâches se confrontent les une aux autres pour décider de leur priorité.

</article>

<article class="project project--side">

### <a href="https://github.com/rhumaric/express-mount-files" hreflang="en">express-mount-files</a>

Un middleware ExpressJS pour déclarer les routes avec des fichiers et dossiers, nostalgie des jeunes jours de PHP.

</article>

<article class="project project--side">

### <a href="https://github.com/rhumaric/implicitjs" hreflang="en">implicitjs</a>

Détourner la syntaxe de JavaScript avec Babel pour essayer d'en faire un langage de template. Extrêmement expérimental.

</article>

<article class="project project--side">

### <a href="https://github.com/rhumaric/bezier-spline-experiment" hreflang="en"> Une expérience sur les courbes de Bézier</a>

Une application Svelte qui illustre une idée pour dessiner une courbe de Bézier passant par une liste de points.

</article>

Publications
---

J'ai beaucoup appris de ce que les autres ont partagé. Il me semble donc normal d'essayer de rendre la pareil (avec un succès mitigé sur la régularité):

- [sur ce site](/fr/posts/): Pour le moment, un pas à pas de la reconstruction de ce site
- <a href="https://www.cookieshq.co.uk/posts/author/romaric" hreflang="en">sur le blog de CookiesHQ</a>: Conseils sur l'accessibilité et les performance lorsque j'y étais employé
- <a href="https://old.romaricpascal.is/writing-about/">sur mon site précédent</a>: Mélange d'articles sur le lettrage et le développement web.

[github-profile]: https://github.com/rhumaric/
[to-fro]: https://github.com/cgillions/to-fro/
[romaricpascal.is]: https://github.com/rhumaric/romaricpascal.is
