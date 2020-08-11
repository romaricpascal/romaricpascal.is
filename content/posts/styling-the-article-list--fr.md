---
title: Styler la liste d'articles
slug: styler-liste-articles
date: 2020-08-11
type: post
layout: post.pug
---
On a laissé la liste d'article bien balisée, mais sans styles. L'apparence par défaut de la balise `<ul>` ne se prête pas vraiment à ce qu'on cherche, voyons donc comment la transformer un peu.

<img src="/media/romaricpascal-post-list.png" alt="Screenshot de la liste d'articles" width="734" height="378">

Penser à l'espace, à nouveau
---

Lorsque l'arrière plan des objets d'une liste est transparent, il faut décider s'il faut utiliser `margin` ou `padding` pour les espacer. En effet, le manque de limites rend plus difficile de distinguer l'espace à l'intérieur de l'élément de celui à l'extérieur.

Une autre façon de regarder cet espace dedans ou dehors est de décider si l'espace est plutôt autour ou entre le contenu de chaque élément. `margin` s'occupe alors plutôt de l'espace entre, et `padding` si l'espace est autour. La présence de séparateurs, par exemple, donne une impression d'espace "autour du contenu". Ce n'est pas le seul critère. Moins visible, la zone où il est possible de cliquer/toucher pour intéragir avec l'élément peut aussi impliquer que l'espace soit "autour".

Vu les séparateurs entre chaque article, ça sera `padding` pour la list d'article. Parce que ce padding est lié au fait que les éléments font partie de la liste, je préfère attacher les styles au sélecteur `post-list` plutôt qu'à chaque élément. Cela en fera un point central pour controller tout ce qui touche à la liste (en complément de supprimer les styles par défaut de la balise `<ul>`).

```css
.post-list {
  list-style-type: none;
  padding: 0;
}

.post-list > * {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
```

Maintenant que les éléments sont correctements espacés, on peut ajouter les séparateurs.

Dessiner les séparateurs
---

Ce n'est pas une bordure complète qui sépare chaque articles, mais un ligne moins large. Impossible donc de juste utiliser `border` pour l'implémenter. Quelle que soit la solution, les styles se retrouveront encore liés au sélecteur `.post-list`, ces séparateurs étant là à cause de la liste. En utilisant le combinateur `* + *`, on les affichera entre chaque élément.

Comment les afficher, donc... Il y a (au moins) 3 options:

- un pseudo élément en `position: absolute`: cela permet d'utiliser `min/max-width` pour limiter la largeur. Mais ça force l'élément à avoir une `position`.

  ```css
  .post-list > * + * {
    position: relative;

    /*
      On rajoute une bordure pour éviter de prendre 1px
      sur le padding de l'élément
    */
    border-top: solid 0.0625rem transparent;
  }

  .post-list > * + ::before {
    content: '';
    display: block;
    position: absolute;

    /*
      Positione le pseudo élément au dessus de la bordure
    */
    top: -0.0625rem;
    left: 0;

    height: 0.0625rem;
    width: 20%;

    /*
      On peut utiliser `min-width` pour s'assurer d'une taille minimum
    */
    min-width: 2rem;
    background: #111;
  }
  ```

- background-image: pas d'élément supplémentaire (1 par item) à positionner pour le navigateur, il n'a qu'a peindre l'arrière-plan. Les propriétés `background-xxx` rendent assez clair ce qui contrôle la taille, la position...

  ```css
  .post-list > * + * {
    /* On évite de manger le padding */
    border-top: solid 0.0625rem transparent;

    /* On dessine un block de couleur #111 */
    background-image: linear-gradient(#111,#111);

    /* On s'assure de dessiner là ou est la bordure */
    background-origin: border-box;

    /* 
      Pas de `min-width` ici, mais on peut utiliser `max` pour
      le même résultat. Avec un fallback pour les vieux navigateurs.
    */
    background-size: 15% 0.0625rem;
    background-size: max(20%, 2rem) 0.0625rem;

    /* On évite de répéter, ce qui peindrait tout l'élément */
    background-repeat: no-repeat;
  }
  ```

- border-image: c'est ce qui est le plus proche de ce qui se passe sur le design (dessiner une petite bordure entre chaque élément). L'épaisseur s'ajuste également automatiquement à celle de la bordure. C'est plus compact à écrire, mais les propriétés moins usuelles.

  ```css
    .post-list > * + * {
      /* On évite  toujours de manger le padding */
      border-top: solid 0.0625rem transparent;

      /*
        Ici c'est un gradient horizontal 
        avec une transition instantanée 
        qui dessine la bordure, de 20% ou 2rem, 
        suivant lequel est le plus grand. 
        
        Les 20% se rapportent à la border-box de l'élément, 
        étant donné que le gradient prendra cette largeur.
        
        Et on oublie pas un petit fallback pour les navigateurs sans `max`
      */
      border-image-source: linear-gradient(90deg, #111 15%, transparent 0);
      border-image-source: linear-gradient(90deg, #111 max(20%, 2rem), transparent 0);
      /*
        On prend une tranche horizontale de 1px 
        en partant du haut du gradient. C'est cette tranche 
        qui sera copiée pour convrir la bordure 
        supérieure de l'élément. 
        
        L'image sera étirée verticalement 
        pour s'adapter à l'épaisseur de la bordure, 
        grâce au défaut de `1` pour `border-image-width`

        On ne découpe pas d'autres tranches (gauches/droites et bas),
        étant donné qu'il n'y a pas de bordures.
      */
      border-image-slice: 1 0 0;
    }
  ```

N'importe laquelle fera l'affaire pour la liste. En variant les gradients, il serait surement également possible de dessiner des tirets, mais laissons ça pour un autre article.

Plein d'espace pour les interactions
---

Avec sa taille généreuse, le titre donne déja une large zone pour activer les liens. On peut l'aggrandir encore un peu plus pour donner aux gens la totalité de l'élément à cliquer/toucher. 

Malheureusement, entourer la balise `<li>` d'un lien n'est pas valide en HTML. Ça serait OK pour d'autres éléments comme une simple `<div>` ou un `<article>`. Il faudrait également faire attention au nom accessible donné à la balise `<a>`. Elle prendrait par défaut l'ensemble du contenu de la balise `<li>` (le titre suivi de la date). Ennuyeux à lire ou entendre pour les utilisateurs/trices de technologies d'assistance, essayons autre chose.

À la place, on peut rendre la zone interactive de la balise `<a>` aussi grande que la balise `<li>`. En effet, les pseudo-éléments `::before` et `::after` peuvent aussi recevoir les interactions et activeront le lien. En positioner un pour couvrir la balise `<li>` rendra toute sa surface cliquable.

Il y un prix à payer, les utilisateurs/trices ne pourront plus sélectionner le texte dans le `<li>`. Ça reste plus léger que d'introduire du JavaScript pour détecter les clicks (et <a href="https://inclusive-components.design/cards/#theredundantclickevent" hreflang="en">devoir éviter de se déclencher quand les gens sélectionnent le texte</a>, et s'occuper correctement de <kbd>Ctrl</kbd> click,...).

Avoir une zone interactive plus grande, ce n'est pas la responsabilité de la liste, mais de chaque élément. Les styles vont donc être rattachés à `.post-list-item`:

```css
.post-list-item {
  position: relative;  
  z-index: 0;
}

.post-list-item a::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
```

Et voilà, la liste d'articles est maintenant présentable. Il ne reste donc plus que le flux RSS pour avoir un site prêt au lancement. Une autre liste d'articles, en quelques sorte, pour le prochain post, mais avec un balisage un peu différent.
