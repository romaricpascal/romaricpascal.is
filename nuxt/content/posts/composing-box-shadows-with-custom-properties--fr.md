---
title: Combiner des ombres avec les propriétés personnalisées en CSS
slug: ombres-proprietes-personnalisees-css
date: 2020-10-17
type: post
layout: post.pug
---
La propriété [`box-shadow`][mdn-box-shadow] accepte un liste de définitions. Cependant, quand plusieurs sélecteurs appliquent cette propriété à un même élément, les ombres ne se combinent pas les une aux autres. Seule la déclaration de celui avec la plus haute spécificité l'emporte.

```css
.box-shadow--elevation-1 {
  box-shadow: 0 0.125rem rgba(0,0,0,0.2);
}

input:focus {
  box-shadow: 0 0 0.25rem var(--primary);
}
```

```html
<label for="input">Focus me and I'll lose my drop shadow</label>
<input id="input" class="box-shadow--elevation-1">
```

Dans cet exemple, le champ de formulaire va perdre son ombre portée lorsqu'il prendra le focus. [Comme le signale Sarah Dayan (en)][initial-tweet], cela rend la propriété peu agréable pour créer un système de classes utilitaires:

- peut-être une liste de classe pour contrôler l'élévation,
- mais aussi des ombres pour entourer l'élément au focus (ne pas oublier les utilisateurs du mode contraste élevé de Windows dans ce cas ;) )
- ou encore une autre liste d'ombre pour donner du relief à l'intérieur des éléments
- …

Par exemple:

```html
<p class="box-shadow--elevation-1 box-shadow--inset">
  Est-ce que ce paragraphe pourrait avoir une ombre portée
  pour le faire flotter un petit peu, mais aussi
  un peu de relief à l'intérieur?
</p> 
```

[Les propriétés personnalisées de CSS][mdn-custom-properties] permettent de se rapprocher de cet usage, si l'on se limite à composer **un nombre pré-défini d'ombres**. Étant donné que les classes utilitaires servent à créer un système bordé de pièces réutilisables, ça ne devrait pas poser de problèmes. Il y a des chances qu'il faille une ombre portée pour élever les éléments, une pour entourer l'extérieur de leur forme, une pour leur donner du relief (et peut-être une pour entourer l'intérieur), mais rarement plus.

Un point de départ
---

Des ombres portées transparentes ne vont pas s'afficher. On peut donc imaginer se lancer avec des propriétés personnalisées pour la couleur de chaque ombre, qui seraient activées par des classes utilitaires. Sans oublier des propriétés pour le décalage sur les deux axes, le flou et l'étendue de l'ombre.

Pour les 3 types d'ombres identifiées juste avant, ça donne ça:

```css
[class*="box-shadow"] {
  /*
    Évite que les propriétés personnalisées appliquées à un parent
    affectent un de leurs enfant avec `box-shadow--...`
  */
  --box-shadow__inset-x: 0;
  --box-shadow__inset-y: 0;
  --box-shadow__inset-blur: 0;
  --box-shadow__inset-spread: 0;
  --box-shadow__inset-color: transparent;
  /* 
    A répéter pour les deux autres types d'ombres
    `--box-shadow__outline-...`
    `--box-shadow__elevation-...` 
  */
  box-shadow: 
    var(--box-shadow__inset-x) var(--box-shadow__inset-y) var(--box-shadow__inset-blur) var(--box-shadow__inset-spread) var(--box-shadow__inset-color),
    var(--box-shadow__outline-x) var(--box-shadow__outline-y) var(--box-shadow__outline-blur) var(--box-shadow__outline-spread) var(--box-shadow__outline-color),
    var(--box-shadow__elevation-x) var(--box-shadow__elevation-y) var(--box-shadow__elevation-blur) var(--box-shadow__elevation-spread) var(--box-shadow__elevation-color);
}

.box-shadow--elevation-1 {
  --box-shadow__elevation-y: 0.125rem;
  --box-shadow__elevation-color: var(--color-shadow);
}

.box-shadow--elevation-2 {
  --box-shadow__elevation-y: 0.25rem;
  --box-shadow__elevation-color: var(--color-shadow);
}

/* ... */

.box-shadow--outline {
  --box-shadow__outline-spread: 0.25rem;
  --box-shadow__outline-color: var(--color-primary);
}
```

C'est verbeux, mais ça fait l'affaire. Certaines des propriétés auront sûrement une valeur constante de 0, ce qui simplifiera les choses. Mais globalement, cette technique configure les ombres plus qu'elle ne les compose.

Composer les ombres
---

[En utilisant des propriétés vides, une technique empruntée à Lea Verou (en)][empty-vars], on peut commencer à composer les ombres les unes aux autres. Le nombre d'ombres reste fixe, mais cela permet plus des flexibilité. Plus particulièrement, ça ouvre la porte à des ombres complexes, comme [ces ombres superposées de Tobias Ahlin (en)][layered-shadows], ou plusieurs ombres de contour pour simuler un espace entre l'élément et le contour sur un arrière plan uni.

```css
[class*="box-shadow"] {
  --box-shadow__inset: ; /* 1 */
  --box-shadow__outline: ; /* 1 */
  --box-shadow__elevation: ; /* 1 */
  box-shadow: var(--box-shadow__inset) var(--box-shadow__outline) var(--box-shadow__elevation) /* 2 */ 0 0 0 transparent; /* 3 */
}
```

Premier gain, c'est vraiment plus lisible! Chaque propriété personnalisée va contenir la déclaration complète de l'ombre: décalages, flou, étendue, couleur (1). Même la virgule qui la séparera de la déclaration suivante! Sans elle, la déclaration `box-shadow` se retrouverait avec des bouts vides entre deux virgules et les navigateurs l'ignorerait.

La déclaration `box-shadow` les liste ensuite dans le bon ordre, séparées par des espaces vu que les virgules seront dans chaque propriétés (2). Enfin une dernière ombre transparente est là à cause de la virgule qui sera amenée par la dernière propriété active (3). Avec un peu de chance, les navigateurs seront malins et détecteront que sans flou ou étendue et en étant transparente, elle peut être ignorée.

Chaque classe utilitaire amène ensuite une ou plusieurs déclaration d'ombres (sans oublier la virgule finale!):

```css
.box-shadow--elevation-1 {
  --box-shadow__elevation: 0 0.0625rem rgba(0,0,0, 0.1), 0 0.125rem rgba(0,0,0,0.1),;
}

.box-shadow--inset {
  --box-shadow__inset: 0 0.125rem rgba(0,0,0,0.2);
}

.box-shadow--outline {
  --box-shadow__outline: 0 0 0 0.25rem var(--primary);
}
```

[Cette démo sur Codepen montre la technique en action sur un champ de formulaire][codepen-demo]. Elle permet au `:focus` d'ajouter un ombre créant un contour sans écraser l'ombre portée ou le relief à l'intérieur de l'élément.

Malgré sa limitation à un nombre fixe, c'est un bon pas vers un système de classes utilitaires pour les ombres. Et j'imagine que cela pourrait aussi s'appliquer aux autres propriétés qui acceptent une liste de déclarations (`background-image` ou `transform`, par exemple).

[initial-tweet]: https://twitter.com/frontstuff_io/status/1316398189789024257
[empty-vars]: https://lea.verou.me/2020/10/the-var-space-hack-to-toggle-multiple-values-with-one-custom-property/
[layered-shadows]: https://tobiasahlin.com/blog/layered-smooth-box-shadows/
[codepen-demo]: https://codepen.io/rhumaric/pen/rNLxeXK
[mdn-box-shadow]: https://developer.mozilla.org/fr/docs/Web/CSS/box-shadow
[mdn-custom-properties]: https://developer.mozilla.org/fr/docs/Web/CSS/--*
