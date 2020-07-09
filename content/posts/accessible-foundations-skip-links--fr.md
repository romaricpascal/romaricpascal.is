---
title: Des bases accessibles - Les liens d'évitement
slug: des-bases-accessibles-les-liens-d'evitement
type: post
layout: post.pug
---
Entre le haut de la page et son contenu, on trouve l'en-tête du site. Malgré le contenu limité du site, il contient déjà 6 liens. Cela veut dire qu'avant d'accéder au contenu qu'iels souhaittent consulter, il faut 6 appuis sur la touche tab pour les utilisateurs/trices de clavier ou 6 swipes pour celleux sur mobiles ou tablettes utilisant VoiceOver ou Talkback. Et après chaque changement de page, rebelotte, autant d'actions avant de rejoindre le contenu de nouveau. Pas. Top.

C'est pourquoi les liens d'évitements sont si importants (et encore plus quand le nombre de liens dans l'en-tête augmente). Comme l'indique leur nom, ils permettent d'éviter tous ces liens et de sauter directement au contenu, accélérant leur navigation. Il s'agit d'une des techniques permettant de valider l'un des <a href="https://www.w3.org/TR/WCAG21/#bypass-blocks" hreflang="en">critères pour le plus bas niveau des <span lang="en">Web Content Accessibility Guidelines</span></a>

Comment ça marche
---

HTML fournit tout ce qu'il faut pour les mettres en place. Les fragments d'URLs, commençant avec un `#`, permettent aux balises `<a>` d'envoyer vers n'importe quel élément de la page qui a un `id`. Une fois atteint, le prochain appui sur la touche Tab ou le prochain swipe commenceront de là. 

Au final, celà revient donc à:

- Ajouter un attribut `id` à l'élément qui contient le contenu principal de la page (généralement la [landmark ARIA][aria-landmark] `main`)
- Ajouter un lien qui envoie vers cet `id` comme premier élément du `<body>`

```html
<body>
  <a href="#main">Skip to main content</a>
  <header><!-- L'en-tête plein de liens --></header>
  <main id="main">
```

C'était un peu plus compliqué que ça avant, à cause de bugs des navigateurs et des lecteurs d'écrans, mais <a href="https://axesslab.com/skip-links/#update-april-2020" hreflang="en">tout à l'air rentré dans l'ordre</a>.

Argh, le design ne prévoit pas de place pour ce lien
---

Sur ce site, le lien est visible. Mais souvent les maquettes ne montrent aucun lien d'évitement, prévoyant (quand elles le font) de le rendre visible qu'à la demande de l'utiliateur. Cela peut se faire au moyen d'un peu de CSS, en masquant le lien de manière accessible tant qu'il n'a pas le focus. Une fois focusé par l'utilisateur/trice, le lien apparait et permet de naviguer au contenu.

Masquer "de manière acessible" est très important ici. `display:none` ou `visibility:hidden` empêcheraient totalement de donner le focus à l'élément, qui ne serait donc jamais révélé. Cela requiert de combine un petit paquet de propriétés, comme le fait par exemple la classe `sr-only-focusable` (qui deviendra `visually-hidden-focusable` dans la version 5) de Bootstrap, par exemple:

```css
.sr-only-focusable:not(:focus) {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0,0,0,0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}
```

Si vous êtes curieux du pourquoi du comment, je vous invite à aller jeter un oeil aux <a href="https://github.com/twbs/bootstrap/blob/main/scss/mixins/_screen-reader.scss#L5" hreflang="en">sources de Bootstrap, qui cite quelques liens</a>.

Aller plus loin
---

Une page listant des produits sur un site e-commerce propose peut-être un formulaire de filtrage, avec une palanqué de contrôles avant d'atteindre enfin la liste. Une autre source de nombreux éléments que l'utilisateur/trice devra traverser pour atteindre le contenu. Mais également une partie importante de la page manquée si le lien d'évitement les envoie directement à la liste.

Rien n'oblige à n'avoir qu'un seul lien d'évitement en début de page. Dans ce scénario, en avoir un qui envoie vers la liste et un vers le filtre serait très utile.

Rien n'oblige non plus à n'avoir ces liens qu'en début de page. En dehors de en-tête, les éléments `<iframe>` sont de bon fournisseurs d'éléments qui peuvent prendre le focus. Prenez une video Youtube embarquée sur une page par exemple. Il faudra quelques tabulations/swipes avant d'en sortir, sans même l'avoir lancée. Comme le propose Manuel Matuzovic, il peut être bien utile de <a href="https://www.matuzo.at/blog/improving-the-keyboard-accessibility-of-codepen-embeds/#skip-links" hreflang="en"> placer un petit lien d'évitement avant l'iframe pour permettre à l'utilisateur de continuer sa lecture</a>.

Et rien n'oblige non plus à cacher ces liens d'évitements, mais bon, ça tient des préférences de design là ;)

Souvent cachés, quand ils ne sont pas oubliés, les liens d'évitement sont très utiles pour accélérer l'accès au contenu. Avec l'évolution du design du site, il y aura de nouvelles occasion de parler accessibilité, sémantique et CSS. Mais pour le moment on va laisser ça de côté et replonger dans la génération du site statique, avec un prochain article qui mettra à jour la navigation par langue.

[aria-landmark]: ../une-base-accessible-les-landmarks/
