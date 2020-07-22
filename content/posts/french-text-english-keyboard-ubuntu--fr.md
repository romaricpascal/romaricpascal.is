---
title: Ecrire en français avec un clavier anglais sur Ubuntu
slug: ecrire-francais-clavier-anglais-ubuntu
date: 2020-07-22
type: post
layout: post.pug
---
Habitant en Angleterre, je me retrouve à écrire sur un clavier anglais (QWERTY). Contrairement aux claviers en France (AZERTY), il n'est pas vraiment prévu pour taper tous les accents qu'on rencontre (mais je garde ça volontier pour ne pas avoir à appuyer sur <kbd>Shift</kbd> pour entrer des chiffres).

Se souvenir du code unicode de chaque caractère et le taper après avoir appuyé sur <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd>, c'est un gros effort de mémoire et beaucoup de touches. Heureusement, Ubuntu (GNOME, en fait) supporte une [touche de composition][compose-key-wiki]. Son rôle est d'indiquer que les prochains appuient son en fait un raccourci pour un caractère spécifique. Celà rend l'écriture d'un "é" une histoire de trois touches: <kbd>e</kbd>, <kbd>'</kbd> après la touche de composition. Bien plus simple que <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> suivi de `00E9`.

Configurer la touche de composition
---

La première étape est d'activer la touche de composition et de choisir laquelle utiliser. Je ne me sers pas souvent du <kbd>Ctrl</kbd> droit, et la touche est plutôt accessible. Ça en fait une bonne option. Maintenant, pour configurer la touche de composition, il faut aller bidouiller la configuration de GNOME. Mais quoi? où? comment?… Ça serait plus navigable avec une interface graphique, donc on va utiliser [GNOME Tweaks, comme recommandé dans la documentation de GNOME][gnome-compose].

```sh
sudo apt install gnome-tweaks
```

Une fois installé et lancé, l'option pour la touche "compose" se trouve dans la section <span lang="en">"Keyboard and Mouse"</span>. Elle permet de choisir parmis plusieurs touches, celles les moins utilisées sur un clavier on dirait. Après s'être déconnecté puis reconnecté, la touche choisie est prête à être utilisée.

<img src="/media/control-key.png" alt="Capture d'écran de la configuration de la touche de composition avec l'outil GNOME Tweaks">

Si la touche que vous voulez utiliser n'est pas dans la liste, que vous n'avez pas d'environement graphique ou juste que vous préférez la ligne de commande, <a href="http://manpages.ubuntu.com/manpages/bionic/en/man1/gsettings.1.html" hreflang="en">gsettings</a> peut faire l'affaire. Il vous permettra de configurer l'option `xkb-options` du schéma `org.gnome.desktop.input-sources` (c'est visiblement comme ça que les options de GNOME sont organisées):

If the key you'd want to use is not there, don't have a graphical environment running or just prefer the command line, [`gsettings`][gnome-gsettings] might be your option. It'll let you set the `xkb-options` in the `org.gnome.desktop.input-sources` schema, which configures the compose key:

```sh
gsettings set org.gnome.desktop.input-sources xkb-options "['compose:rctrl']"
```

Il est également possible de <a href="https://help.gnome.org/admin/system-admin-guide/stable/keyboard-compose-key.html.en" hreflang="en">configurer la touche de composition pour l'ensemble du système</a>, mais ça demande un peu plus d'étapes.

Ajouter des combinaisons
---

Ubuntu fournit par défaut une palanquée de combinaisons. Si vous êtes curieux, je vous invite à jeter un œil au fichier `/usr/share/X11/locale/<votre-locale>.UTF-8/Compose`, vous y trouverez sûrement des séries de touches intéressantes.

Il est également possible de définir ses propres combinaisons dans un fichier `.XCompose` au sein de son <span lang="en">home directory</span>. C'est particulièrement pratique pour accélérer l'écriture de certains accents et créer une convetion pour les formes accentuées les plus courantes:

- éviter d'avoir a appuyer sur <kbd>Shift</kbd> pour un accent circonflexe (au dessus du <kbd>6</kbd>) ou tréma (au dessus du <kbd>2</kbd>)
- utiliser <kbd>lettre</kbd> + <kbd>Espace</kbd> pour les formes accentuées que je tape le plus souvent

```sh
# Racourcis pour les lettres avec diacritiques utilisées en français (maj. et min.)
# à - â - ä - é - è - ê - ë - ï - î - ô - ö - ù - û - ü - ÿ - ç.
# https://fr.wikipedia.org/wiki/Diacritiques_utilis%C3%A9s_en_fran%C3%A7ais

# Racourcis pour les formes les plus usitées
<Multi_key> <a> <space>: "à"
<Multi_key> <A> <space>: "À"
<Multi_key> <e> <space>: "é"
<Multi_key> <E> <space>: "É"
<Multi_key> <u> <space>: "ù"
<Multi_key> <U> <space>: "Ù"
<Multi_key> <o> <space>: "ô"
<Multi_key> <O> <space>: "Ô"
<Multi_key> <c> <space>: "ç"
<Multi_key> <C> <space>: "Ç"

# Evite un appui sur Shift pour l'accent circonflexe
<Multi_key> <a> <6>: "â"
<Multi_key> <A> <6>: "Â"
<Multi_key> <e> <6>: "ê"
<Multi_key> <E> <6>: "Ê"
<Multi_key> <o> <6>: "ô"
<Multi_key> <O> <6>: "Ô"
<Multi_key> <i> <6>: "î"
<Multi_key> <I> <6>: "Î"
<Multi_key> <u> <6>: "û"
<Multi_key> <U> <6>: "Û"
# Accent en premier
<Multi_key> <6> <a>: "â"
<Multi_key> <6> <A>: "Â"
<Multi_key> <6> <e>: "ê"
<Multi_key> <6> <E>: "Ê"
<Multi_key> <6> <o>: "ô"
<Multi_key> <6> <O>: "Ô"
<Multi_key> <6> <i>: "î"
<Multi_key> <6> <I>: "Î"
<Multi_key> <6> <u>: "û"
<Multi_key> <6> <U>: "Û"

# Evite un appui sur Shift pour le tréma
<Multi_key> <a> <2>: "ä"
<Multi_key> <A> <2>: "Ä"
<Multi_key> <e> <2>: "ë"
<Multi_key> <E> <2>: "Ë"
<Multi_key> <i> <2>: "ï"
<Multi_key> <i> <2>: "Ï"
<Multi_key> <o> <2>: "ö"
<Multi_key> <O> <2>: "Ö"
<Multi_key> <u> <2>: "ü"
<Multi_key> <U> <2>: "Ü"
<Multi_key> <y> <2>: "ÿ"
<Multi_key> <Y> <2>: "Ÿ"
# Tréma en premier
<Multi_key> <2> <a>: "ä"
<Multi_key> <2> <A>: "Ä"
<Multi_key> <2> <e>: "ë"
<Multi_key> <2> <E>: "Ë"
<Multi_key> <2> <i>: "ï"
<Multi_key> <2> <i>: "Ï"
<Multi_key> <2> <o>: "ö"
<Multi_key> <2> <O>: "Ö"
<Multi_key> <2> <u>: "ü"
<Multi_key> <2> <U>: "Ü"
<Multi_key> <2> <y>: "ÿ"
<Multi_key> <2> <Y>: "Ÿ"
```

Ces combinaisons avec la touche de composition ne peuvent entrer qu'un seul caractère, mais c'est déja assez pour bien accélérer l'écriture en français sur un clavier anglais. Si vous avec un clavier américain ou un clavier anglais Apple, ça devrait marcher tout pareil. Il faudra peut-être juste ajuster le raccourci pour le tréma, le '@' au dessus du '2' fait pas vraiment penser au tréma. Vu que `<'>` est utilisé pour l'accent aigu, peut-être `<;>` (en dessous du `:`).

Bon, c'était un petit détour. Le prochain article parlera (enfin devrait parler) du générateur de site statique à nouveau.



Those shorcuts can only be used to type one character, but that's already enough to vastly speed up typing French text on a UK keyboard. If you're on a US keyboard or Mac UK keyboard, those shorcuts should still work too. You might just want to swap the `<2>` for something more memorable, as the `@` over it doesn't really scream "tréma". `<'>` being already taken for the acute accents, maybe `<;>` (which is under the `<:>`) would do.

Now enough sidetracking, the next article will (hopefully) be back talking about the static site generator.

[compose-key-wiki]: https://fr.wikipedia.org/wiki/Touche_de_composition
[gnome-compose]: https://help.gnome.org/users/gnome-help/stable/tips-specialchars.html.fr#compose
[gnome-gsettings]: http://manpages.ubuntu.com/manpages/bionic/en/man1/gsettings.1.html

