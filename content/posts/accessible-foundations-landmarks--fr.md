---
date: 2020-07-06
title: Une base accessible - Les landmarks
slug: une-base-accessible-les-landmarks
type: post
layout: post.pug
---
Les titres ne sont pas le seul outil pour aider les gens à trouver leur chemin sur une page. Le design du site (en général) sépare clairement les différentes zones de la page: cette partie c'est l'en-tête, ici le contenu principal, là bas la navigation... Des informations très importantes, qui peuvent également être fournies aux utilisateurs/trices de techonologies d'assistance.

C'est le boulot des landmarks ARIA (<span lang="en">Accessible Rich Internet Applications</span>). Les specifications ARIA permettent d'associer un rôle aux éléments de la page. Celui-ci indique aux technologies d'assistance ce que représente l'élément. Les landmarks sont des rôles spécifiques qui identifient certaines zones d'une page:

- `main` entoure le contenu principal
- `banner` pour l'en-tête
- `contentinfo` pour le pied de page
- `complementary` pour du contenu complémentaire, comme dans une sidebar par exemple
- `navigation` pour... la navigation... surprise!
- `form` et `search` pour les formulaires, et plus spécifiquement les formulaires de recherche pour ce dernier
- `region` pour une zone générique qui ne rentre pas dans les cas précédents

Ceux-ci peuvent être assignés avec l'attribute `role`, mais tous sauf `search` sont automatiquement associés à certaines balises HTML:

- `main` à `<main>`
- `banner` à `<header>`, sauf si elle est au sein d'un `<article>` ou autre landmark
- `contentinfo` à `<footer>`, sauf si elle est au sein d'un `<article>` ou autre landmark
- `complementary` à `<aside>`
- `navigation` à `<nav>`
- `form` à `<form>`, si l'élément a un nom accessible
- `region` à `<section>`, si l'élément a un nom accessible

Fournir des landmarks pour aider la navigation revient donc à utiliser la bonne balise HTML. Cependant, il est utile de compléter les éléments `<footer>`, `<nav>`, `<section>` et `<aside>` du role correspondant pour palier à ces <a href="https://www.scottohara.me/blog/2019/04/05/landmarks-exposed.html" hreflang="en">quelques soucis de rendus listés par Scott O'Hara</a>.

Petit inventaire
---

Malgé sa simplicité, le site (au moment où j'écris cet article) propose 5 landmarks:

- Une landmark `main` ou le contenu des articles et pages sont insérés par le générateur de site statique
- Une landmark `banner` qui contien la `navigation` du site, ainsi que la `navigation` par langue
- Une landmark `contentinfo` avec quelques liens supplémentaires (peut-être devrais-je introduire une autre `navigation` pour accéder aux liens vers mes comptes sur d'autres sites)

<img src="/media/romaricpascal-homepage-landmarks.png" alt="Capture d'écran montrant les 5 landmarks sur la page d'accueil du site">

Clarifier les landmarks en double
---

Quelques landmarks (<a href="https://dequeuniversity.com/rules/axe/3.5/landmark-one-main" hreflang="en">`main` tout spécialement</a>, mais aussi `banner` et `contentinfo`) ne devraient apparaître qu'une seule fois sur la page. D'autres, comme `navigation` pour laquelle ça arrive souvent, peuvent apparaître plusieurs fois. Lister "Navigation" pour chacune d'entre elle ne va pas vraiment aider les utilisateurs/trices.

Dans ces cas, il devient imporant de [donner un nom accessible à chaque landmark][provide-accessible-name]. Par exemple, la navigation du site et la navigation par langue portent chacune un nom différent grâce à l'attribut `aria-labelledby` qui pointe sur un `h2` caché pour chacun d'eux (plus de chance qu'un traducteur automatique ne les oublie pas qu'avec `aria-label`). Ils deviennent donc rendus en `Site` et `Langues` navigation. Tout de suite plus facile de voir laquelle fait quoi.

```html
<nav aria-labelledby="languageSwitcherHeading" role="navigation">
  <h2 id="languageSwitcherHeading" hidden="">Languages</h2>
  <!-- ... -->
</nav>
```

Donner à l'élément un nom accessible est aussi ce qui permettra à une `<section>` ou un `<form>` de devenir une landmark.

Vérifier les landmarks
---

Comme avec les titres, aller dans les sources à la recherche des balises ou de l'attribute `role` ne va pas être une partie de plaisir. <a href="http://matatk.agrip.org.uk/landmarks/" hreflang="en">L'extension Landmarks pour Firefox et Chrome</a> s'en charge à notre place, c'est bien mieux.

De son côté, <a href="https://www.deque.com/axe/" hreflang="en">l'extension Axe</a> se charge aussi de vérifier qu'il y a bien une seule landmark `main` et que le contenu est bien dans des landmarks.

Enfin, on peut aussi vérifier les listes fournies par les lecteurs d'écrans. Surtout quand [Mac][voiceover], [Windows 10][narrator] et [Ubuntu][orca] en fournissent un tous les 3, et que <a href="https://www.nvaccess.org/download/" hreflang="en">NVDA</a> peut être installé sur Windows.

En complément d'une bonne structure de titre, les landmarks fournissent des raccourcis utiles pour permettre aux utilisateurs/trices de rapidement naviguer dans la page. Il y a une dernière fonctionnalité pour l'accessibilité que je voudrais présenter dans le prochain article, puis on repassera au générateur de sites statiques.

[provide-accessible-name]: https://www.24joursdeweb.fr/2019/les-noms-accessibles-dans-tous-leurs-etats/
[landmarks-extension]: http://matatk.agrip.org.uk/landmarks/
[voiceover]: https://help.apple.com/voiceover/mac/10.15/?lang=fr
[narrator]: https://support.microsoft.com/fr-fr/help/22798/windows-10-complete-guide-to-narrator
[orca]: https://help.gnome.org/users/orca/stable/index.html.fr
