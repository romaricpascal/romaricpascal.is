---
date: 2020-06-30
title: Les marges négatives sont nos amies
slug: les-marges-negatives-sont-nos-amies
type: post
layout: post.pug
---
Les liens de navigation entre les traductions s'adaptent à la largeur de la zone d'affichage. Si l'espace le permet, les deux liens sont l'un à côté de l'autre. Mais quand elle est trop étroite, ils sont l'un au dessus de l'autre.

Les liens ont un padding vertical généreux, pour aider leur accessibilité, mais un peu d'espace entre eux ne serait pas du luxe. Le soucis, c'est que suivant leur position, il faut des marges soit horizontales soit verticales.

Des marges de tous les côtés
---

Utiliser une media query demanderait de la mettre à jour quand le contenu change. Pas forcément un souci ici, vu que j'écris à la fois le code et le contenu. C'est plus problématique quand le contenu est fourni par les utilisateurs (couts, délais...).

Comme alternative, on peut commencer par metter des marges dans toutes les directions autour du lien. Il faut garder en tête que les marges horizontales ne vont pas fusionner, par contre. Donc si on veut un espace de `1rem` entre les éléments, il faudra une marge horizontale de seulement `0.5rem`. Pour les marges verticales, cela dépendra du layout. `clear`, `display:flex` et `display: grid` vont par exemple empêcher la fusion egalement (dans le cas de grid, il sera plus simple d'utiliser `gap` de toutes façon).

Pour les liens (en tout cas au moment où j'écrit cet article), on va viser un peu moins de `1rem`. Pour faciliter l'application des styles, on va aussi utiliser le selecteur enfant `> *`. Cela permettra de n'avoir à ajouter une classe qu'à un seul endroit et de ne pas se préoccuper de si on a oublié un des éléments.

```css
.language-switcher > * {
  margin: 0.25rem;
}
```

Rectifier l'alignement
---

Bon, mettre des marges partout, c'est bien, mais maintenant, les éléments ne touchent plus les bords.

<div class="demo demo--shallow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem; height: 2rem"></div>
      </div>
    </div>
  </div>
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%;margin: 1rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%; margin: 1rem; height: 2rem"></div>
      </div>
    </div>
  </div>
</div>

C'est ici que les marges négatives entrent en jeu. En rajoutant une marge négative de la même valeur de chaque côté du parent, on va pouvoir compenser l'espace supplémentaire.

```css
.language-switcher {
  margin: -0.25rem;
}

.language-switcher > * {
  margin: 0.25rem;
}
```

<div class="demo demo--shallow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin: -1rem">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem; height: 2rem"></div>
      </div>
    </div>
  </div>
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin: -1rem">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%;margin: 1rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%; margin: 1rem; height: 2rem"></div>
      </div>
    </div>
  </div>
</div>

Au revoir, espaces!
---

Des liens en `inline-block` changeraient de position comme voulu. Cependant, suivant si le code est écrit/généré avec un espace entre les balises, cet espace va se retrouver à l'affichage. Une autre source de problème d'alignements (plus discret que les marges, c'est vrai).

Pour ne pas avoir à s'en préoccuper, `display: flex` s'assure que ces espaces ne sont pas pris en compte. `flex-wrap: wrap` permet de renvoyer à la ligne. Et dans le cas de la navigation par langue, `justify-content: center` ramène les liens au centre.

```css
.language-switcher {
  margin: -0.25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content:center;
}

.language-switcher > * {
  margin: 0.25rem;
}
```

Des marges différentes
---

Rien n'empêche d'avoir des marges horizontales et verticales différentes. Tant que les marges négatives du parent correspondent dans chaque direction, le pattern peut être utilisé pour appliquer des marges différentes suivant que les éléments soient côte à côte ou l'un au dessus de l'autre.

```css
.with-different-margins {
  margin: -1.5rem -0.25rem; 
}

.with-different-margins > * {
  margin: 1.5rem 0.25rem;
}
```

<div class="demo demo--shallow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin: -1rem -0.5rem">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem 0.5rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin: 1rem 0.5rem; height: 2rem"></div>
      </div>
    </div>
  </div>
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin: -1rem -0.5rem">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%;margin: 1rem 0.5rem; height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%; margin: 1rem 0.5rem; height: 2rem"></div>
      </div>
    </div>
  </div>
</div>

Fusionner les bordures
---

Le pattern peut aussi s'utiliser pour fusionner les bordures des élements. Cette fois, les marges négatives devront être sur les éléments eux-mêmes, plutôt que le parent. Là encore, vu qu les marges ne fusionnent pas, il faudra qu'elles soient la moitié de la taille de la bordure.

```css
.collapsed-borders {
  display: flex;
  flex-wrap: wrap;
  margin: 0.125rem;
}

.collapsed-borders > * {
  border: solid 0.25rem;
  margin: -0.125rem; /* Half the size of the border */
}
```

<div class="demo demo--shallow">
  <div>
    <div style="display:flex;flex-wrap: wrap; margin: 0.125rem">
      <div class="demo-element" style="flex: 1 1 1%;margin: -0.125rem; border: solid 0.25rem; height: 2rem"></div>
      <div class="demo-element" style="flex: 1 1 1%;margin: -0.125rem; border: solid 0.25rem; height: 2rem"></div>
    </div>
  </div>
  <div>
      <div style="display:flex;flex-wrap: wrap; padding: 0.125rem;">
        <div class="demo-element" style="flex: 1 1 1%;min-width: 55%;margin: -0.125rem; border: solid 0.25rem; height: 2rem"></div>
        <div class="demo-element" style="flex: 1 1 1%;min-width: 55%; margin: -0.125rem; border: solid 0.25rem; height: 2rem"></div>
      </div>
  </div>
</div>

`padding` marcherait aussi pour compenser les marges des éléments, mais pour éviter les variations, je préfère rester sur `margin`.

Eviter les impair(e)s!
---

Comme le pattern demande de diviser en deux certaines valeurs, des espaces ou bordures impaires vont causer quelques soucis. Impossible de garantir que tous le monde aura un navigateur et écran qui affiche des demi pixels. De nouveaux soucis d'aligment en vue!

Après avoir confirmé avec le designer que "oui, les espaces ou bordures doivent absolument être impaires", tout n'est pas perdu. Le problème peut se contourner en réduisant les marges utiliser à une par axe (vertical/horizontal). Par exemple, `margin-bottom` et `margin-right` seulement (qui ont l'avantage de ne pas entrer en conflit avec [`margin-top`/`margin-left` et `* + *` pour controller l'espacement][sibling-combinator]).

```css
.with-odd-gaps {
  /* Pour un espace de 15px, par exemple */
  margin-bottom: calc(-15rem / 16);
  margin-left: calc(-15rem / 16);
}

.with-odd-gaps > * {
  margin-bottom: calc(15rem / 16);
  margin-left: calc(15rem / 16);
}
```

<div class="demo demo--shallow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin-bottom: calc(-15rem / 16); margin-right: calc(-15rem / 16)">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin-bottom: calc(15rem / 16); margin-right: calc(15rem / 16); height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;margin-bottom: calc(15rem / 16); margin-right: calc(15rem / 16); height: 2rem"></div>
      </div>
    </div>
  </div>
  <div>
    <div class="demo-element demo-element-striped">
      <div style="display:flex;flex-wrap: wrap; margin-bottom: calc(-15rem / 16); margin-right: calc(-15rem / 16)">
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%;margin-bottom: calc(15rem / 16); margin-right: calc(15rem / 16); height: 2rem"></div>
        <div class="demo-element demo-element-filled" style="flex: 1 1 1%;min-width: 55%; margin-bottom: calc(15rem / 16); margin-right: calc(15rem / 16); height: 2rem"></div>
      </div>
    </div>
  </div>
</div>

C'est un peu plus que ce qui est utilisé sur la navigation par langue (en tout cas, au moment de l'écriture), mais c'est un patter utile. En attendant que <a href="https://caniuse.com/#feat=flexbox-gap" hreflang="en">`gap` pour Flexbox</a> soit largement supporté, c'est une option solide pour laisser les éléments se réorganiser mais s'assurer qu'ils ont le bon espacement, sans recourir à des media queries plus rigides.

Avant de retouner au JavaScript, avec les dernières fonctionnalités qu'il manquait au générateur pour pouvoir relancer le site, si on faisait un petit détour pour parler HTML et accessibilité dans le prochain article.

[sibling-combinator]: ../les-joies-du-combinateur-de-voisin-direct/
[flexbox-gap-support]: https://caniuse.com/#feat=flexbox-gap
