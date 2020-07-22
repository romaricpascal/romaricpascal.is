---
title: Typing French text with an English keyboard on Ubuntu
date: 2020-07-22
type: post
layout: post.pug
---
As I live in the UK, I find myself typing on a UK keyboard (QWERTY). Unlike a keyboards you find in France (AZERTY), it's not really planned for the many accented characters that appear in French words (though I happily trade that off for not having to press <kbd>Shift</kbd> every time I want to type a number).

Remembering the unicode code for each character and entering them after pressing <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> is both a lot of mental effort and a lot of keypresses. Fortunately, Ubuntu (actually GNOME) supports something called a [Compose key][compose-key-wiki]. Its role it to mark that the upcoming keystrokes are a shortcut for a specific character. This makes entering an "é" a three key thing: <kbd>e</kbd>, <kbd>'</kbd> after hitting the compose key. Much more memorable than <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> + `00E9`.

Configuring the compose key
---

First step is to enable the compose key and pick which it will be on the keyboard. I don't use the right <kbd>Ctrl</kbd> key often, and it's pretty reachable, so this makes it a good candidate. Now setting it as a compose key requires to tweak Gnome settings. But how? where? which option?… a graphical interface would make that much more straightforward so I installed [GNOME Tweaks, as recommended by Gnome's documentation][gnome-compose].

```sh
sudo apt install gnome-tweaks
```

Once installed and launched, under the "Keyboard and Mouse" category, there's the sought after "Compose Key" option. It lets you pick between a few options of what looks like the least used keys on a keyboard. After logging out and back in, the chosen Compose key will be ready for use.

<img src="/media/control-key.png" alt="Screenshot of Gnome Tweaks showing the options for setting the Compose key">

If the key you'd want to use is not there, don't have a graphical environment running or just prefer the command line, [`gsettings`][gnome-gsettings] might be your option. It'll let you set the `xkb-options` in the `org.gnome.desktop.input-sources` schema (looks like that's how GNOME settings are organised):

```sh
gsettings set org.gnome.desktop.input-sources xkb-options "['compose:rctrl']"
```

There's also a way to [set the compose key system wide][compose-key-system-wide], involving quite a few more steps.

Customizing combinations
---

Ubuntu comes with (a long list of) preset of key combinations. If you're curious, have a look at the `/usr/share/X11/locale/<your-locale>.UTF-8/Compose` file, you might find some interesting series of keystrokes there.

You can also define your own in a `.XCompose` file inside your home directory. This came particularly handy to speed up the typing of some accents and set a convention for the most used accented forms:

- drop the <kbd>Shift</kbd> press required for circumflex accent (above the <kbd>6</kbd>) and tréma (above the <kbd>2</kbd>)
- use <kbd>Letter</kbd> + <kbd>Space</kbd> to type the accented forms I type most often

```sh
# Shortcuts for diacritics used in French (both lower and upper case)
# à - â - ä - é - è - ê - ë - ï - î - ô - ö - ù - û - ü - ÿ - ç.
# https://fr.wikipedia.org/wiki/Diacritiques_utilis%C3%A9s_en_fran%C3%A7ais

# Quicker entry of common diacritics for each letter
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

# Avoid a shift keypress to enter the circumflex
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
# Accent-first
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

# Avoid a shift keypress to enter the trema
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
# Trema-first
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

Those shorcuts can only be used to type one character, but that's already enough to vastly speed up typing French text on a UK keyboard. If you're on a US keyboard or Mac UK keyboard, those shorcuts should still work too. You might just want to swap the `<2>` for something more memorable, as the `@` over it doesn't really scream "tréma". `<'>` being already taken for the acute accents, maybe `<;>` (which is under the `<:>`) would do.

Now enough sidetracking, the next article will (hopefully) be back talking about the static site generator.

[compose-key-wiki]: https://en.wikipedia.org/wiki/Compose_key
[gnome-compose]: https://help.gnome.org/users/gnome-help/stable/tips-specialchars.html.en#compose
[gnome-gsettings]: http://manpages.ubuntu.com/manpages/bionic/en/man1/gsettings.1.html
[compose-key-system-wide]: https://help.gnome.org/admin/system-admin-guide/stable/keyboard-compose-key.html.en
