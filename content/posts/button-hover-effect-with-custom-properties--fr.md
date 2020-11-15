---
title: Effets de survol avec les propriétés personnalisées CSS
slug: effet-survol-proprietes-personnalisees-css
date: 2020-11-11
type: post
layout: post.pug
ogDescription:
  Où un bouton sert de prétexte à explorer différents patterns
  autour des propriétés personnalisées en CSS
draft: true
---
<style class="d--none">
  .demo-content {
    background-color: #fbe1ce;
    padding: 2rem;
    text-align: center;
  }
</style>

Prenons un `<button>`. Un qui ressort un peu de la page grâce à une ombre portée, pour qu'on ait l'impression de pouvoir le presser. Au survol (ou focus), on va le faire ressortir un peu plus. Et lorsqu'on l'active, il sera pressé plus près de la page. Comme celui-ci:

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button button--with-elevation button--with-elevation__elevate">
      Le résultat final
    </button>
  </div>
</div>

Derrière le rideau, ce sont des propriétés personnalisées qui coordonnent `box-shadow` et `transform`. Ajuster plusieurs propriétés n'est qu'un des avantages apportés par les propriétés personnalisées. Regardons donc de plus près ce boutton pour découvrir quelques patterns autour d'elles.

D'abord un bouton
---

Pour commencer, il nous faut donc un bouton. Rien de trop extravagant, juste un peu de couleurs pour l'arrière plan et le texte, une bordure et de coins arondis. Oh, et une ombre "solide" pour le faire ressortir de la page, on avait dit une ombre pour l'effet. On lui rajoutera d'autres classes au fur et à mesure de l'article.

<style>
  /*
    Utiliser un classe permettra d'éviter
    de cibler tous les boutons de la page
  */
  .button {
    font: inherit;
    border-radius: 0.375rem / 50% ;
    background: #460160;
    color: white;
    border: solid 0.125rem white;
    padding: 0.5rem 1rem;
    box-shadow: 0 0.25rem 0 RGBA(70, 1, 96, 0.7);
  }
</style>

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button">Je ne fais rien</button>
  </div>
</div>

On aurait déja pu introduire quelques propriétés pour les couleurs, tirées d'une liste définie dans `:root` (ou `html`). Mais on va se concentrer sur l'effet de survol, pas la thémabilité (même si c'est aussi un des apports des propriétés personnalisées).

Décomposer les valeurs complexes de certaines propriétés
---

Pour faire ressortir le bouton un peu plus, ou le rendre pressé, il faut d'abord ajuster son ombre. Plus longue et le bouton aura l'air plus haut, plus court et ils apparaitra pressé. À la va-vite, on peut définir une nouvelle `box-shadow` pour chacun des états:

<style>
  .button--with-static-adjustable-shadows:hover,
  .button--with-static-adjustable-shadows:focus {
    box-shadow: 0 0.375rem 0 RGBA(70, 1, 96, 0.7);
  }

  .button--with-static-adjustable-shadows:active {
    box-shadow: 0 0.125rem 0 RGBA(70, 1, 96, 0.7);
  }
</style>

Ça marche, mais pour just changer le décalage sur l'axe `y`, ça fait beaucoup de duplication. On rajoute des "chances" de faire des erreurs en recopiant les valeurs, et des "opportunités" d'oubli lorsqu'il faudra changer un autre aspect de l'ombre, la couleur par exemple.

En introduisant une propriété `--elevation`, on peu ajuster indépendament ce décalage, et seulement lui. Le reste de la `box-shadow` n'est qu'à un seul endroit, séparant bien ce qui change de ce qui ne change pas.

<style>
  .button--with-adjustable-shadows {
    --elevation: 0.25rem;
    box-shadow: 0 var(--elevation) 0 RGBA(70, 1, 96, 0.7);
  }

  .button--with-adjustable-shadows:hover,
  .button--with-adjustable-shadows:focus {
    --elevation: 0.375rem;
  }

  .button--with-adjustable-shadows:active {
    --elevation: 0.125rem;
  }
</style>

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button button--with-adjustable-shadows">Mon ombre change</button>
  </div>
</div>

Contrôler plusieurs propriétés
---

Bon, l'ombre change, mais le bouton ne bouge pas. Il lui manque la `transform` qui va le décaler plus haut ou plus bas. De combien le bouton bouge va dépendre de la hauteur que l'on veut lui donner. Et ça tombe bien, on a justement une propriété `--elevation` qui nous stocke cette valeur.

Grâce à `calc`, on peut la réutiliser pour calculer de combien bouger le bouton. Il faudra auparavent stocker l'élévation de départ, dans `--base-elevation` on va dire. Avec ça, en ajustant uniquement une valeur, on change deux propriétés.

<style>
  .button--with-translation {
    --base-elevation: 0.25rem;
    --elevation: var(--base-elevation);
    transform: translateY(calc(var(--base-elevation) - var(--elevation)));
  }
</style>

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button button--with-adjustable-shadows button--with-translation">Mon ombre change et je bouge</button>
  </div>
</div>

Créer des patterns configurables
---

L'exemple précédent l'illustre déja un peu. La nouvelle classe `button--with-translation` était capable de changer la propriété  utilisée par la classe `button--with-adjustable-shadow`. Les règles habituelles de spécificité s'appliquent pour savoir quelle sera la valeur finale de la propriété. Et les valeurs se propagent:
`--elevation` prend la valeur de `--base-elevation`, et à son tour, la propriété `box-shadow` se retrouve ajustée.

On peut pousser ça plus loin et introduire deux autres propriétés pour configurer à quelle hauteur le bouton se trouve dans ses deux autres états. On se retrouve alors avec un point central d'où changer l'ensemble du comportement. Plus besoin de définir des selecteurs pour `:hover`,`:focus` et `:active` lorsqu'on veut varier l'élévation.

<style>
  .button--configurable {
    --base-elevation: 0.25rem;
    --up-elevation: 0.375rem;
    --down-elevation: 0.125rem;
  }

  .button--configurable:hover,
  .button--configurable:focus {
    --elevation: var(--up-elevation);
  }

  .button--configurable:active {
    --elevation: var(--down-elevation);
  }

  .button--configurable-low {
    --base-elevation: 0.125rem;
    --up-elevation: 0.1875rem;
    --down-elevation: 0.0625rem;
  }
</style>

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button button--with-adjustable-shadows button--with-translation">Mon ombre change toujours et je bouge encore</button>
    <br><br>
    <button class="button button--with-adjustable-shadows button--with-translation button--configurable button--configurable-low">Pareil, mais plus près de la page</button>
  </div>
</div>

Offrir des valeurs que d'autres classes peuvent utiliser
---

Jusqu'ici, on s'est contenté de lire les valeurs des propriétés définies par notre pattern, qu'elles aient été données par le pattern lui-même ou une autre classe. Mais on peut aussi créer des propriétés personnalisées que d'autres classes vont utiliser, pour les aider à calculer leur styles.

Disons qu'on a un autre style de bouton, qui utilise déja `box-shadow`. Avec, il crée un double bordure en combinant une ombre `inset` avec une bordure "normale". `box-shadow` supporte d'avoir plusieurs ombres, mais seulement si elles viennent de la même déclaration. Quand plusieurs classes appliquent la propriété, elles ne se combinent pas. Seule celle de la déclaration la plus spécifique s'applique. Soit le bouton perdra sa double bordure, soit son ombre. Pas top du tout!

En introduisant une nouvelle propriété qui gardera l'ombre de l'élévation, on va faciliter leur composition. Et le bouton peut bien sûr utiliser un propriété à lui pour éviter les répétitions.

On peut également faire de même pour `transform` qui a le même soucis que `box-shadow` pour être combinée.

<style>
  .button--secondary {
    --shadow-inset: inset 0 0 0 0.125rem #460160;
    box-shadow: var(--shadow-inset);
    background: white;
    color: #460160;
  }

  .button--with-composable-shadow {
    --shadow-elevation: 0 var(--elevation) 0 RGBA(70, 1, 96, 0.7);
    box-shadow: var(--shadow-elevation);
  }

  .button--with-composable-transform {
    --transform-elevation: translateY(calc(var(--base-elevation) - var(--elevation)));
    transform: var(--transform-elevation);
  }

  .button--secondary.button--with-composable-shadow {
    box-shadow: var(--shadow-inset), var(--shadow-elevation);
  }
</style>

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button button--secondary button--with-adjustable-shadows button--with-translation">A l'aide! J'ai perdu mon ombre!</button>
    <br><br>
    <button class="button button--secondary button--with-adjustable-shadows button--with-composable-shadow button--with-composable-transform button--with-translation">
    Moi je l'ai gardée! Nah!
    </button>
  </div>
</div>

Séparer la configuration de l'utilisation
---

Jusqu'ici, chaque nouveau comportement était apporté par une classe différente. Celles définies plus tard écrasant les déclarations des précédentes (merci la cascade!). Super pour décortiquer les choses, mais au final, on préférera surement rassembler tout ça dans à un seul endroit.

<style>
  .button--fancy {
    /*La configuration du pattern*/
    --base-elevation: 0.25rem;
    --up-elevation: 0.375rem;
    --down-elevation: 0.125rem;

    /*La propriété qui change `box-shadow` et `transform`*/
    --elevation: var(--base-elevation);

    /*Des variables pour aider à composer l'ombre et la transformation*/
    --shadow-elevation: 0 var(--elevation) 0 RGBA(70, 1, 96, 0.7);
    --transform-elevation: translateY(calc(var(--base-elevation) - var(--elevation)));

    /*L'application avec les propriétés CSS*/
    box-shadow: var(--shadow-elevation);
    transform: var(--transform-elevation);
  }

  /*Les changements pour les différents états*/
  .button--fancy:hover,
  .button--fancy:focus {
    --elevation: var(--up-elevation);
  }

  .button--fancy:active {
    --elevation: var(--down-elevation);
  }

  /*Et n'oublions pas la combinaison avec l'autre bouton*/
  .button--secondary.button--fancy {
    box-shadow: var(--shadow-inset), var(--shadow-elevation);
  }
</style>

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button button--fancy">En une classe!</button>
  </div>
</div>

C'est plus simple, une seule classe à utiliser maintenant! Cependant, on peu gagner un chouilla de flexibilité en la redécoupant en deux (ça servait bien de tout rassembler, tiens!).

Les enfants de l'élément auquel s'applique la classe auront eux aussi accès à ces propriétés. On peut donc séparer là où les propriétés sont configurées de là où elles s'appliquent. Cela permet d'appliquer `box-shadow` et `transform` non plus sur l'élément lui-même, mais sur un de ses enfants (ou un pseudo-élément). Comme le badge sur le bouton ci-dessous.

<style>
  .button--with-elevation {
    /*La configuration du pattern*/
    --base-elevation: 0.25rem;
    --up-elevation: 0.375rem;
    --down-elevation: 0.125rem;

    /*La propriété qui change `box-shadow` et `transform`*/
    --elevation: var(--base-elevation);

    /*Des variables pour aider à composer l'ombre et la transformation*/
    /*Couleur sans transparence pour éviter que les opacités ne se composent*/
    --shadow-elevation: 0 var(--elevation) 0 #853D84;
    --transform-elevation: translateY(calc(var(--base-elevation) - var(--elevation)));
  }

  /*Les changements pour les différents états*/
  .button--with-elevation:hover,
  .button--with-elevation:focus {
    --elevation: var(--up-elevation);
  }

  .button--with-elevation:active {
    --elevation: var(--down-elevation);
  }

  /*The trigger for actually lifting the button*/
  .button--with-elevation__elevate {
    box-shadow: var(--shadow-elevation);
    transform: var(--transform-elevation);
  }

  /*Et n'oublions pas la combinaison avec l'autre bouton*/
  .button--with-elevation__elevate.button--secondary {
    box-shadow: var(--shadow-inset), var(--shadow-elevation);
  }
</style>
<details class="column--expanded hljs">
  <summary class="code-like">Support styles: Badge styling</summary>

  <style>
.button--with-badge {
  position: relative;
}

.button--with-badge__badge {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-width: max-content;
  margin-left: auto;
  margin-right: auto;
  margin-top: -0.75em;
  font-size: 0.75em;
  padding: 0.125em 0.75em;
  background-color: #460160;
  color: white;
  border-radius: 9999px;
}
  </style>

</details>

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button button--secondary button--fancy button--with-badge">
      <span>Mon badge bouge, mais sans ombre!</span>
      <span class="button--with-badge__badge">Argh!</span>
    </button>
    <br>
    <br>
    <button class="button button--with-badge button--secondary button--with-elevation button--with-elevation__elevate">
      <span>Regarde mon badge, il fait les deux!</span>
      <span class="button--with-badge__badge button--with-elevation__elevate">Ta-da!</span>
    </button>
  </div>
</div>

Les propriétés personnalisés ouvrent de nouvelles voies pour créer des patterns réutilisables en CSS. Elles permettre des définir de petites APIs à combiner à d'autres classes, leur laissant entrer des valeurs ou consommer celles que nous créons grâce à la cascade (il y a juste [un petit truc à ne pas oublier si on les utilise avec des valeurs qui ne sont pas supportées par tous les navigateurs (en)][css-custom-props-gotcha]).

Elles ouvrent la porte à des choses vraiment intéressantes. [Faciliter les thèmes (en)][css-custom-props-theming], par exemple. Mais aussi aller plus loin que juste "remplacer" des valeurs avec des [opérateurs logiques (en)][css-custom-props-logical], des [séries de valeurs par défaut (en)][css-custom-props-stacks],...

[Le support navigateur est très bon (en)][css-custom-props-browser-support]. L'amélioration progressive (en utilisant soit des valeurs de repli ou [`@supports` (en)][css-custom-props-support]) permet de prendre en charge les navigateurs plus vieux (ou même [un polyfill (en)][css-custom-props-polyfill] si vraiment il le faut). Très excitant tout ça!

[css-custom-props-logical]: https://css-tricks.com/logical-operations-with-css-variables/
[css-custom-props-stacks]: https://css-tricks.com/using-custom-property-stacks-to-tame-the-cascade/
[css-custom-props-browser-support]: https://caniuse.com/css-variables
[css-custom-props-polyfill]: https://github.com/nuxodin/ie11CustomProperties
[css-custom-props-support]: https://stackoverflow.com/a/38012166
[css-custom-props-theming]: https://csswizardry.com/2016/10/pragmatic-practical-progressive-theming-with-custom-properties/
[css-custom-props-gotcha]: https://adactio.com/journal/16993
