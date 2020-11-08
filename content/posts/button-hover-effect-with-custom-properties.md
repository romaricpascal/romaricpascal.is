---
title: Hover effects with custom properties
type: post
layout: post.pug
draft: true
---
Let's look into a button. Not any button, one sticks out of the page thanks to some drop shadow, making it appear pressable. On hover (or focus), we'll have it stick out a bit more and when active, get pressed closer to the page. Like this one:

TODO: DEMO

Behind the scene, it's custom properties that help coordinate two properties `box-shadow` and `transform` to the button. That's one of their benefits: they allow to affect multiple CSS properties by changing only one.

First, a button
---

To start with, we'll need a button so quickly make one. Nothing fancy, just a custom background and text color, some rounded corners (well, maybe a bit fancy) and a border. Oh, and a nice solid shadow to make it stick out, we said a shadow.

<style class="d--none">
  .demo {
    display: table;
    width: auto;
  }

  .demo-content {
    background-color: #fbe1ce;
    padding: 2rem;
    text-align: center;
  }
</style>

<style>
  /*
    Using custom classes to not hook onto any random button
    on the page
  */
  .button {
    font: inherit;
    border-radius: 0.375rem / 50% ;
    background: #460160;
    color: white;
    border: solid 0.125rem; /*Will be white*/
    padding: 0.5rem 1rem;
    box-shadow: 0 0.25rem 0 #460160;
  }
</style>

<div class="demo demo--shallow">
  <div class="demo-content">
    <button class="button">I do nothing</button>
  </div>
</div>

Breaking down shorthands
---

To make the button stick out more, or appear pressed, the first part of the effect is adjusting its shadow. Longer shadow and the button looks taller, smaller one and it looks shorter.

<style>
  .button--with-static-adjustable-shadows:hover,
  .button--with-static-adjustable-shadows:focus {
    box-shadow: 0 0.375rem 0 #460160;
  }

  .button--with-static-adjustable-shadows:active {
    box-shadow: 0 0.125rem 0 #460160;
  }
</style>

The only thing that varies here is the `y` offset of the shadow. That's 3 places where we'd need to change the colors now, all for tweaking a unique property. A good use case for custom properties is to allow tweaking individual parts of properties that only have shorthand-ish declarations, like `box-shadow`.

So let's refactor this by introducing a `--elevation` property that'll let us tweak just the elevation, without worrying about the color.

<style>
  .button--with-adjustable-shadows {
    --elevation: 0.25rem;
    box-shadow: 0 var(--elevation) 0 #460160;
  }

  .button--with-adjustable-shadows:hover,
  .button--with-adjustable-shadows:focus {
    --elevation: 0.375rem;
  }

  .button--with-adjustable-shadows:active {
    --elevation: 0.125rem;
  }
</style>

<div class="demo demo--shallow">
  <div class="demo-content">
    <button class="button button--with-adjustable-shadows">My shadow changes</button>
  </div>
</div>

Controlling multiple properties
---

For now, the shadow changes, but the button remains stuck in place. We still need to add a `transform` that'll translate the button. How much the button is translated depends on its elevation. The custom properties we just introduced will let us reuse that value.

We'll also need to store what the original elevation was to compute the amount of translation, thanks to `calc`. Change the elevation, and both the shadow and translation will update, now.

<style>
  .button--with-translation {
    --original-elevation: 0.25rem;
    --elevation: var(--original-elevation);
    transform: translateY(calc(var(--original-elevation) - var(--elevation)));
  }
</style>

<div class="demo demo--shallow">
  <div class="demo-content">
    <button class="button button--with-adjustable-shadows button--with-translation">My shadow changes and I translate</button>
  </div>
</div>

Creating configurable patterns
---

<style>
  .button--configurable {
    --original-elevation: 0.25rem;
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
    --original-elevation: 0.125rem;
    --up-elevation: 0.1875rem;
    --down-elevation: 0.0625rem;
  }
</style>

<div class="demo demo--shallow">
  <div class="demo-content">
    <button class="button button--with-adjustable-shadows button--with-translation">My shadow still changes and I translate</button>
    <br><br>
    <button class="button button--with-adjustable-shadows button--with-translation button--configurable button--configurable-low">I'm closer to the page</button>
  </div>
</div>

Allowing composition of non-composable properties
---

<style>
  .button--secondary {
    --inset-shadow: inset 0 0 0 0.125rem #460160;
    box-shadow: var(--shadow-inset);
    background: white;
    color: #460160;
  }

  .button--with-composable-shadow {
    --elevation-shadow: 0 var(--elevation) 0 #460160;
    box-shadow: var(--elevation-shadow);
  }

  .button--secondary.button--with-composable-shadow {
    box-shadow: var(--inset-shadow), var(--elevation-shadow);
  }
</style>

<div class="demo demo--shallow">
  <div class="demo-content">
    <button class="button button--secondary button--with-adjustable-shadows button--with-translation">I don't have a shadow</button>
    <br><br>
    <button class="button button--secondary button--with-adjustable-shadows button--with-composable-shadow button--with-translation">
    I do have one
    </button>
  </div>
</div>

Separating configuration from application
---

Probably one of the most widespread, as it's what happens when using `:root {}` variables. They get defined up there and applied by whichever element uses them.
