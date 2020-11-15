---
date: 2020-06-25
title: Les joies du combinateur de voisin direct
slug: les-joies-du-combinateur-de-voisin-direct
type: post
layout: post.pug
---
Ma méthode préférée pour contrôler les marges verticales est d'utiliser le <a href="https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/" hreflang="en">selecteur "chouette lobotomisée" proposé par Heydon Pickering</a>, `* + *`, combiné à la propriété `margin-top`.

```css
/* n'importe quel élément précédé de n'importe quel élément */
* + * { 
  margin-top: 1.5rem;
  margin-bottom: 0;
}
```

Outre le nom du sélecteur (que j'adore), cela permet de s'assurer que les éléments n'ont de marges que lorsqu'ils doivent être espacés par rapport à un autre élément. Moins d'espace "surprise" en haut ou en bas d'un élément quand il est premier ou dernier et que ses [marges ne sont pas fusionnées][margin-collapse] avec son parent (bordure, padding, contexte de formatage de bloc, layout avec grid ou flexbox...).

Utiliser une seule des direction `top`/`bottom` permet aussi de réduire les "surprises" quand la fusion des marges ne se fait pas entre voisins (à cause de grid, flexbox ou un `clear` pour les flottants, quoi que c'est moins courant de nos jours).

Et sa <a href="https://www.w3.org/TR/selectors-3/#specificity" hreflang="en">faible spécificité</a> (0 en fait) permet d'utiliser plus de sélecteurs pour faire des ajustements ciblé.

Par exemple pour réduire l'espacement entre des `<li>` qui se suivent.

```css
* + * {
  margin-top: 1.5rem;
  margin-bottom: 0;
}

li + li {
  margin-top: 0.5rem
}
```

Isoler les effets
---

C'est bien rare de vouloir utiliser ces styles sur tous les éléments d'un site. Si le layout est horizontal, `margin-top` va juste semer le bazar (`margin-left`/`margin-right` seront plus utiles).

C'est pourquoi il vaut mieux cibler ses effets à l'intérieur d'un élément spécifique. Et isoler encore plus avec le selecteur d'éléments enfants `>`, plutôt que tous les descendants. L'exception la plus notable pour se passer de ce dernier serait lorsqu'il est impossible d'ajouter des classes facilement, par exemple à un contenu provenant d'un CMS.

```css
.spaced > * + * {
  margin-top: 1.5rem;
  margin-bottom: 0;
}
```

Marge avant, marge après
---

Pour des ajustements d'espacement très ciblés, on pourrait ajouter une classe utilitaire `margin-top--1rem` pour réduire le `margin-top` d'un élément à `1rem`. Cela ferait perdre tout l'effort pour s'assurer qu'il n'a de marge que s'il y a un autre élément avec lequel l'espacer.

On peut aussi exprimer que le voisin précédent à besoin de marge après lui. S'il se retrouve supprimé l'élément ne se retrouve pas avec une marge:

```css
.margin-after--1rem + * {
  margin-top: 1rem;
}
```

De manière similaire, on peut exprimer que l'élément à besoin de marges avec son voisin précédent, s'il en a un:

```css
* + .margin-before--1rem {
  margin-top: 1rem;
}
```

C'est ce qui est utilisé sur ce site (ou en tout cas l'était, au moment d'écrire cet article) pour ajuster l'espacement des titres.

```css
h1 + * {
  margin-top: 0.25rem;
}

* + h1 {
  margin-top: 1.75rem;
}
```

Mais c'est surtout intéressant lorsque des éléments ne sont pas forcément présent sur toutes les pages. En exprimant les ajustements avec `+`, on peut se préoccuper uniquement de mettre ou non l'élément dans le DOM. Pas besoin d'ajuster aussi la marge du voisin suivant sa présence.

Il y a d'autres méthodes pour controler l'espacement vertical. Utiliser `margin-bottom` et `:last-child`/`:first-child` en est une autre qui me vient vite à l'esprit. Celle que je viens de présenter est juste celle que je préfère. Elle s'applique également bien pour des layouts horizontaux, en utilisant `margin-left`/`margin-right` (suivant la direction d'écriture, [vivement `margin-inline-start`][margin-inline-start]).

Et si le layout passe de horizontal a vertical suivant la taille de la zone d'affichage? J'en parlerai dans le prochain article.


[margin-collapse]: https://developer.mozilla.org/fr/docs/Web/CSS/Mod%C3%A8le_de_bo%C3%AEte_CSS/Fusion_des_marges
[margin-inline-start]: https://developer.mozilla.org/fr/docs/Web/CSS/margin-inline-start
