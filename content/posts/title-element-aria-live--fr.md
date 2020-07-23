---
date: 2020-07-23
title: Annoncer les changements de titres avec aria-live
slug: balise-titre-aria-live
type: post
layout: post.pug
---
<p class="note">
<strong>
Important: Le contenu de cet article est expérimental, avec des tests très limités. Il faudrait donc le tester sur un panel de navigateurs et lecteurs d'écran bien plus large avant de l'utiliser en production.
</strong>
</p>

Contruire une <span lang="en">Single Page Application</span> demande de prendre à sa charge [les résponsabilités du navigateur pour aller d'une page à l'autre][access42-article]. Celà implique de répondre aux changement d'URLs pour afficher le contenu correspondant, bien sûr. Mais les navigateurs annoncent également le titre de la nouvelle page aux technologies d'assistance, ce qui clarifie où se trouve maintenant l'utilisateur/trice. C'est donc quelque chose dont il faut s'occuper également (avec la position du focus également, mais c'est un tout autre problème).

La <a href="https://www.w3.org/TR/wai-aria-1.1/" hreflang="en">spécification ARIA (Accessible Rich Internet Application)</a> prévoit un [attribut `aria-live`][aria-live] pour permettre aux technologies d'assistance d'annoncer les changements dans la page en direct. Son <a href="https://a11ysupport.io/tech/aria/aria-live_attribute" hreflang="en">support est bon</a>, serait-il donc possible de l'utiliser sur la balise `<title>` du document? C'est une expérience pour le savoir.

L'expérience
---

Cette page abrite donc une expérience pour vérifier si un changement de titre sera bien annoncé en direct. Au clic d'un bouton, le titre est changé et, croisons les doigts, annoncé.

<div class="note font-size--inherit">

Pour être témoin de l'annonce, il vous faudra un lecteur d'écran en parallèle de votre navigateur. [Mac][voiceover], [Windows 10][narrator] et [Ubuntu][orca] en embarque un tous les trois, et <a href="https://www.nvaccess.org/download/" hreflang="en">NVDA</a> peut également être installé sur Windows.

</div>

Avant de viser un élément original comme `<title>`, on va déja commencer par vérifier que tout marche comme prévu avec une balise qui reçoit plus souvent `aria-live`: une balise `<p>`, par exemple.

Cliquer le bouton qui arrive mettra à jour le contenu de la balise `<p>` qui le suit. Grâce à l'attribut `aria-live="polite"` qu'elle porte, ça devrait entraîner l'annonce de "Clicks" suivi d'un nombre par les technologies d'assistance.

<div class="interactive">
  <button data-target="live-div">Mettre à jour le paragraphe</button>
  <p id="live-div" lang="en">Clicks: 0</p>
</div>

Maintenant pour le vrai test, le formulaire ci-après va mettre à jour le titre du document. Si tout fonctionne, ça va entraîner le même type d'annonce: "Clicks" suivi par un nombre. Le titre de l'onglet sera aussi mis à jour, mais ça c'est un peu plus sûr.

Le formulaire propose deux méthodes pour mettre à jour le titre, au cas où il y ait des différences (les deux ont fonctionné lors de mes tests, certes limités):

- mettre à jour la propriété `document.title` directement
- aller chercher l'élément `<title>` dans la balise `<head>` et mettre à jour son `textContent`

<form class="interactive">
  <fieldset>
    <legend>Comment mettre à jour le titre</legend>
    <div class="radio">
      <input checked id="updateType-property" name="updateType" type="radio" value="property">
      <label for="updateType-property">Avec
        <code>document.title</code>
      </label>
    </div>
    <div class="radio">
      <input id="updateType-element" name="updateType" type="radio" value="element">
      <label for="updateType-element">Avec
        <code>textContent</code>
      </label>
    </div>
  </fieldset>
  <button>Mettre à jour le titre</button>
</form>

Comment ça marche
---

La première étape, c'est de rajouter des attributs `aria-live` sur la balise `<title>`. Je suis pas super sûr si l'avoir dans le HTML au chargement entraînerait une double annonce (après le titre déja annoncé par le navigature), donc par prudence, on va l'ajouter en JavaScript

<script type="application/javascript">
  var titleElement = document
    .head
    .querySelector("title");
  // L'annonce est importante, donc on part sur `assertive`
  // ce qui interrompra les autres annonces
  titleElement.setAttribute('aria-live', 'assertive');

  // On l'ajoute aussi au `<p>`, mais sans couper la parole cette fois
  document.getElementById('live-div').setAttribute('aria-live','polite');

</script>

Uniquement ajouter l'attribut n'est pas suffisant, malheureusement. La balise `<title>` est cachée par défaut et n'arrive donc pags dans <a href="https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/the-accessibility-tree" hreflang="en">l'arbre d'accessibilité</a>.

<figure>
<img src="/media/title-not-in-accessibility-tree.png" alt="Screenshot of Firefox developper tools' Accessibility panel before doing anything with no entry for the title.">
<figcaption  class="no-default-spacing"> Les outils de développement de Firefox ne montrent aucun noeud pour le titre. Il apparait seulement dans le nom du document.</figcaption>
</figure>

Ajouter `display: block` sur les balise `<head>` et `<title>` lui permettra d'y être listée.

<figure>
<img src="/media/title-in-accessibility-tree.png" alt="Screenshot of Firefox developper tools' Accessibility panel showing the title inside the accessibility tree.">
<figcaption class="no-default-spacing">Avec l'ajout de <code>display:block</code>, un nouveau noeud pour le titre fait son apparition dans l'onglet Accessibilité des outils de developpement de Firefox.</figcaption>
</figure>

On ne veut pas qu'elle s'affiche sur la page par contre, donc on peut la cacher de manière accessible grâce à un peu de CSS:

<style>
  head {
    display: block;
  }

  title {
    display: block;
    /*
      Mixin `visually-hidden` de Bootstrap
      https://github.com/twbs/bootstrap/blob/main/scss/mixins/_screen-reader.scss#L8
    */
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

</style>

Avec ceci, chaque changement de titre devrait maintenant être annoncés. S'il ne fallait pas annoncer tous les changements, activer/désactiver soit le `display` du `<title>`, soit l'attribut `aria-live` devrait donner un contrôle plus fin. Mais c'est à tester et va plus loin que ce petit bout d'expérience, qui vérifie juste si `aria-live` est reconnu.

Pour les mises à jour du contenu, c'est un peu plus de JavaScript pour écouter les événements du formulaire et du bouton et changer les éléments appropriés:

<script type="application/javascript">
  var value = 0;
  var content = "Clicks: " + value;

  function updateContent() {
    value++;
    content = "Clicks: " + value;
  }
  document.addEventListener("click", function(event) {
    // On prend uniquement les clics sur les boutons
    if (event.target.tagName == "BUTTON") {
      // En ne considérant que ceux qui annoncent une cible
      // par l'attribut `data-target`
      var updateTarget = event.target.getAttribute("data-target");
      if (updateTarget) {
        updateContent();
        document.getElementById(updateTarget).innerHTML = content;
      }
    }
  });

  document.addEventListener('submit', function(event) {
    // Sans ça, la page se recharge, oups!
    event.preventDefault();
    updateContent();
    // On récupère quelle méthode utiliser 
    // pour mettre à jour le titre
    if (document.querySelector('[name="updateType"]:checked').value === 'property') {
      document.title = content;
    } else {
      document.head.querySelector('title').textContent = content;
    }
  });

</script>

Il reste plus qu'à espérer que ça marche avec toutes sortes de navigateurs et lecteurs d'écran. Je n'ai malheureusement pu tester qu'avec Firefox + Orca sur Ubuntu et Safari + Voiceover sur Mac. [Si vous essayez avec d'autres combinaisons, je serais heureux de connaître le résultat][tweet].

Bon, pour de vrai, le prochain article, on revient au générateur de site.

Mises à jour
---

23 Juillet 2020: Ajout d'un lien détaillant les différents aspects à prendre en charge quand on remplace la navigation par du JavaScript. Merci [Yann][yann-tweet] pour le lien, et [Audrey][audrey-profile] pour l'article!

[access42-article]: https://access42.net/accessibilite-rechargement-page-single-page-applications
[yann-tweet]:https://twitter.com/firewalkwizme/status/1286331334365982721
[aria-live]: https://developer.mozilla.org/fr/docs/Accessibilit%C3%A9/ARIA/Zones_live_ARIA
[voiceover]: https://help.apple.com/voiceover/mac/10.15/?lang=fr
[narrator]: https://support.microsoft.com/fr-fr/help/22798/windows-10-complete-guide-to-narrator
[orca]: https://help.gnome.org/users/orca/stable/index.html.fr
[tweet]: https://twitter.com/romaricpascal/status/1286322112576270342
[audrey-profile]: https://access42.net/audrey-maniez
