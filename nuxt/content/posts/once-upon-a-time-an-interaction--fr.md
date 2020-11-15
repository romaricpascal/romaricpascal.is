---
title: Il était une fois… une interaction dans le navigateur
slug: interaction-navigateur
date: 2020-09-02
type: post
layout: post.pug
---
Voici l'histoire d'une page avec laquelle un/e utilisateur/trice voudrait interragir. Elle pourrait se résumer rapidement à ces 3 étapes, mais ça serait une vision grossière:

1. La personne trouve avec quelle partie de la page elle doit interagir
2. Iels actionne l'élément en charge de l'interaction
3. En réponse, la page de met à jour, totallement ou en partie.

Ces étapes peuvent se répêter, si l'intéraction est complexe. Mais plus important, chacune est bien plus que ce résumé en une phrase. Creusons donc pour une histoire plus complète et s'assurer de ne rien manquer lors de son implémentation.

Découvrir avec quoi interagir
---

Petite ou grande, dans une application ou un site de contenu, toutes les pages doivent guider les utilisatrices/teurs vers ce qu'ils recherchent.

### Identifier où l'on est

C'est le point de départ. Sans savoir où l'on est, difficile de décider comment se rendre où l'on veut. Les pages peuvent semer une grande variété d'indices pour indiquer aux visiteuses/teurs où démarre leur aventure:

- le titre principal
- le logo du site
- marquer la page courante dans la navigation
- fil d'Ariane
- le titre de l'onglet
- la favicon

Et sûrement bien d'autres.

### Identifier où l'on va

Une fois sûr(e)s du point de départ, il faut maintenant trouver quelle partie de la page abrite l'élément responsable de l'intéraction. Pour celà encore la page fournit une série d'information:

- son design visuel sépare clairement les différentes sections (et reste cohérent d'une page à l'autre)
- des landmarks ARIA fournissent un découpage similaire aux technologies d'assistantes
- des titres identifient à quoi chaque partie correspond.

### Reconnaître avec quoi interagir

Une fois trouvé dans quelle partie pourrait se trouver cet élément, il faut encore reconnnaitre:

1. que l'on peut interagir avec lui. Son visuel doit informer que l'on peut l'actionner, avec une forme reconnaissable de bouton, de lien, de checkbox… Mais il faut aussi fournir le bon rôle et le bon état aux techonogies d'assistance, grâce à du HTML sémantique ou des attributs ARIA si vraiment nécessaire.
2. que c'est le bon élément. Son texte, sa forme, son icône assez large et contrastée avec l'arrière plan pour être décelées, et assez claires pour être comprises. Et là encore, les technologies d'assistances doivent également recevoir un label textuel non-ambigu pour bien identifier l'élément.

Actionner l'élément
---

Les interractions avec un navigateur prennent de nombreuses formes et actionner un élément ne se limite pas à cliquer dessus ou le toucher. C'est déja assez pour poser quelques contraintes, par contre: s'assurer que l'élément soit assez gros et espacé des autres pour être ciblé sans erreur.

L'élément doit aussi répondre aux interactions claviers. Pouvoir recevoir le focus d'une part, et répondre aux touches requises par son rôle.

Oh, et le label et la forme de l'élément doivent aussi permettre de l'activer correctement par commande vocale.

La page se met à jour…
---

Enfin, l'élément est actionné et la page se met à jour. Des interactions simples la feront changer immédiatement. D'autres, nécessitant un traitement plus long entraineront deux, trois, peut-être plus, mises à jours successives.

Et il peut se passer plein de choses ici. D'ailleurs toutes les interactions ne suivront pas l'ensemble des étapes à venir.

### Retour instantané

L'élément informe immédiatement l'utilisatrice/teur qu'on a intéragit avec lui. C'est par exemple le rôle des styles `:active` en CSS

### Confirmation

Certaines actions, ou l'état actuel de l'application/site, peuvent requérir de s'assurer que la personne veut vraiment continuer. Peut-être des données seront irrémédiablement perdues si elle continue, ou l'action a un fort impact.

### Validations

Avant que quoi que ce soit ne se passe, des validations peuvent être nécessaires pour vérifier que l'action peut s'effectuer convenablement. Ceci peut entraîner l'affichage d'erreurs, ou d'une alerte demandant confirmation avant de continuer.

### Mises à jour optimistes

Pour donner une sensation de rapidité, la page se met à jour comme si l'action (ou une partie de l'action) avait réussi, avec la confiance que tout ira bien. Et si tout ne va pas bien, on remet tout en état. Mais tout ira bien, non?

### État de chargement

Certaines actions prennent plus de temps que d'autres pour s'exécuter. Peut-être de longs calculs, ou des requêtes vers un serveur. Les utilisatrices/teurs doivent savoir que leur machine est à la tache (et encore mieux s'iels peuvent voir l'avancement précis).

Ça peut se montrer directement sur l'élément qui déclenche l'action, ou dans la ou les zones qui seront mises à jour lorsque l'action est terminée.

### Concurrence

Les usagères/ers peuvent parfois continuer d'actionner l'élément pendant que les calculs se font. Il faut alors décider quoi faire des ces intéractions supplémentaires.

Possiblement les empêcher, et notifier la personne que quelque chose est déja en cours lors qu'elle actionne de nouveau l'élément. C'est particulièrement utile pour les formulaires POST, où l'on veut éviter plusieurs requêtes successives.

Ou peut-être seule la dernière intéraction devrait être prise en compte, et les précédentes annulées. Un traitement plus souvent utiles aux formulaires GET, comme des formulaires de filtrage.

Dans tous les cas ne rien faire peut-être risqué (surtout si des requêtes partent sur le réseau). S'assurer de l'ordre est également une solution (mais qui peut demander d'être malin si des requêtes sont impliquées, car le réseau ne garanti pas d'ordre).

### Traiter le résultat

Finallement, l'action se termine. Qu'elle ait réussi ou échoué, ce sont de nouvelles mises à jour à faire sur la page.

1. Mettre à jour le contenu. Cela peut aller d'un petit changement de classe CSS, la mise à jour de texte jusqu'à des changements de pans entiers de DOM. Et ce n'est pas tout:

    - une attention particulière peut-être demandée pour ne pas perdre l'élément qui a le focus, s'il est dans l'une des zones mises à jour
    - des animations/transitions peuvent s'ajouter pour rendre le changement plus fluide
    - des parties de la page hors du document visible doivent peut-être être mises à jour: URL, titre de l'onglet navigateur (possiblement avec une attention particulière pour les technologies d'assistance), favicon
    - peut-être n'est-ce pas directement le DOM, mais un état en mémoire qui devra être mis à jour

2. En cas d'erreur, renverser les mises à jours optimistes
3. Mettre à jour l'élément qui a le focus, si besoin. Peut-être l'intéraction a-t-elle fermée une modale et le focus doit se retrouver sur l'élément qui l'a ouvert.
4. Notifier les utilisatrices/teurs, en s'assurant de l'accessibilité. Cependant, il se peut que:

    - ça ne soit pas nécessaire, dû à la nature de la mise à jour (ouvrir un accordéon n'a pas vraiment besoin d'une notification "super, le paneau est ouvert!")
    - la mise à jour s'en soit déja chargé (afficher la page d'un produit que la soumission d'un formulaire vient d'ajouter est peut-être suffisant)
    - pour les technologies d'assistance, celà se soit déja produit par la mise à jour du DOM (nouveau contenu dans une zone `aria-live`) ou au changement de focus.

5. Supprimer les états de chargement mis en place au démarrage de l'action
6. Annuler les contrôles sur la concurrence des actions, si besoin

Au final, chaque interaction a sa propre histoire et suit son propre chemin. Mais elles partagent toutes cette liste d'étapes, auxquelles il faut penser lors de leur implémentation. Cette pourra, je l'espère, éviter de manquer certaines d'entre elles et fournir un expérience plus robuste aux utilisateurs/trices.
