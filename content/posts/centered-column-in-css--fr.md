---
date: 2020-06-23
title: Colonne centrée en CSS
slug: colonne-centree-en-css
type: post
layout: post.pug
---
Sortons un peu du backend du site pour parler un peu de ses feuilles de style. Le design est plutôt minimaliste, mais il y a déjà quelques patterns intéressants. A commencer par la colonne de contenu, centrée et avec une largeur limitée.

Peut-être êtes-vous sur un mobile, avec une fenêtre étroite ou un fort zoom et la largeur ne vous semble pas très limitée. Un peu d'espace sur les côtés, mais ça prend plutôt toute la largeur. Avec plus d'espace horizontal, voici à quoi ça ressemble:

<img src="/media/romaricpascal-homepage.png" alt="Screenshot of this site's homepage, showing large space on each side of the column of content" height="659" width="1299">

Ne pas laisser le texte filer d'un bord à l'autre, comme il le ferait par défaut, est crucial pour garantir une bonne lecture. Cette colonne centrée est d'ailleurs quelque chose que l'on rencontre fréquemment, parfois sous le nom de `container`. Voyons donc de quoi il retourne!


Limiter la largeur du contenu
---

Le but est de limiter la largeur du contenu. Mais si la zone d'affichage est assez petite, pas de soucis pour qu'il aille d'un bord à l'autre (moyennant un peu d'espace sur les bords, on en reparlera plus tard). Ce qui importe vraiment, c'est qu'il ne deviennent pas plus large que ce que l'on décide. Et c'est exactement ce qu'offre la propriété `max-width`.

Suivant les articles, la largeur maximale à choisir varie, avec un minimum autour des 40 caractères par line et un maximum vers 70-80. On va dire 60, pour l'exemple.

On parle de caractères par lignes, il est donc tentant de mesurer cette limite en `ch`. Seulement `60ch`, ça ne sera pas la même largeur suivant la taille du texte de l'élément ciblé. Les titres, avec leur taille plus large, auraient droit à plus de largeur que le texte, par exemple.

Pas très isolé, donc on va plutôt s'appuyer sur l'unité `rem`. Elle gardera la largeur relative à la taille de police de base du site, permettant de s'adapter au choix des utilisateurs. Mais elle ne variera pas d'un élément à l'autre parce que d'autres styles en changent sa taille de police.

```css
max-width: 45rem;
```

<div class="demo" role="presentation">
  <div>
    <div class="demo-element demo-element-striped" style="height: 100%; max-width: 25%"></div>
  </div>
</div>

Centrer le contenu
---

La colonne a bien une largeur limitée, mais elle reste coincée à gauche de l'écran. Pour l'envoyer au milieu, on peut utiliser ses marges horizontales, avec la valeur `auto` à la fois à gauche et à droite.

```css
max-width: 45rem;
margin-left: auto;
margin-right: auto;
```

<div class="demo" role="presentation">
  <div>
    <div class="demo-element demo-element-striped" style="height: 100%; max-width: 25%; margin-left: auto; margin-right: auto;"></div>
  </div>
</div>

Et lorsque `margin-inline` sera supporté plus largement, ça ne fera plus qu'une ligne pour remplacer les deux `margin-...`. A noter qu'on ne veut surtout pas utiliser le raccourci `margin` ici. On ne souhaite modifier que les marges horizontales, sans causer d'interférence avec les marges verticales.

Un peu d'espace sur les côtés
---

C'est tout bien centré maintenant. Mais quand la zone d'affichage est plus petite, la colonne va d'un bord à l'écran.

<div class="demo demo--narrow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped" style="height: 100%; margin-left: auto; margin-right: auto;"></div>
  </div>
</div>

Ça ne rend pas vraiment la lecture agréable. Un peu d'espace de chaque côté serait le bienvenu. Rajouter un peu de `padding` horizonal est tentant aussi, mais cause deux soucis:

1. quand la largeur limite est atteinte, la largeur du contenu n'est pas celle définie par `max-width`. Il faut lui enlever deux fois (une pour chaque côté) le padding.
2. si on essaie d'appliquer les styles à un élément qui a déja du padding, conflit. Soit on change l'espacement qu'il souhaite avoir à l'intérieur, soit c'est lui qui change l'espace au bord de la colonne.

Il y a des solutions, par exemple s'assurer que le `box-sizing` est `content-box` pour le premier cas (au lieu de `border-box` comme il est généralement modifié globallement de nos jours). Et pour le second entourer l'élément d'un parent auquel s'appliquera la limite de taille et le padding.

Pas vraiment fan des deux contournements. Au final, ce qu'on recherche, c'est que l'élément prennent toute la largeur, moins un peu d'espace de chaque côté. On peut l'exprimer "mot pour mot" avec la propriété `width` et `calc()`:

```css
width: calc(100% - 2 * 1.5rem);
max-width: 45rem;
margin-left: auto;
margin-right: auto;
```

<div class="demo demo--narrow" role="presentation">
  <div>
    <div class="demo-element demo-element-striped" style="width: calc(100% - 2 * 1rem); height: 20%; margin-left: auto; margin-right: auto;"></div>
    <div class="demo-element demo-element-filled" style="width: calc(100% - 2 * 1rem); height: 20%; margin-left: auto; margin-right: auto; padding: 0.5rem" >
      <div class="demo-element demo-element-striped" style="height: 100%; " ></div>
    </div>
    <div class="demo-element demo-element-striped" style="width: calc(100% - 2 * 1rem); height: 20%; margin-left: auto; margin-right: auto;" ></div>
  </div>
</div>

Et hop! De l'espace sur les côtés, la largeur maximale qui est bien celle écrite dans le CSS et les styles qui peuvent s'appliquer à des éléments qui ont leur propre padding.

Choisir ses cibles
---

En utilisant le sélecteur `SELECTEUR > *` , on peut créer un conteneur dont tous les enfants se retrouvent dans cette colonne centrée. Et sans ajout de spécificité par dessus le sélecteur qui précède le `>` (top ces astérisques).

Comparé à styler le parent directement, les choses seront plus simple s'il faut ajouter la largeur de quelques éléments pour qu'ils dépassent un peu de part et d'autre de la colonne. Pas que ça soit impossible, juste <a href="https://css-tricks.com/full-width-containers-limited-width-parents/" hreflang="en">un peu plus complexe que d'ajuster leur `max-width`</a>. 

```css
.centered-children > * {
  width: calc(100% - 2 * 1.5rem);
  max-width: 45rem;
  margin-left: auto;
  margin-right: auto;
}

.wider-element {
  max-width: 55rem;
}
```

<div class="demo" role="presentation">
  <div>
    <div class="demo-element demo-element-striped" style="max-width: 25%; height: 20%; margin-left: auto; margin-right: auto;"></div>
    <div class="demo-element demo-element-filled" style="max-width: 35%; height: 20%; margin-left: auto; margin-right: auto; padding: 0.5rem" >
    </div>
    <div class="demo-element demo-element-striped" style="max-width: 25%; height: calc(60% - 2rem); margin-left: auto; margin-right: auto;" ></div>
  </div>
</div>

Et c'est à peu près tout ce qu'il y a derrière la colonne centrale de ce design minimal pour le re-lancement. Maintenant qu'on a centré horizontalement, au prochain article pour parler d'espacement vertical!

[breaking-out-of-column]:https://css-tricks.com/full-width-containers-limited-width-parents/
