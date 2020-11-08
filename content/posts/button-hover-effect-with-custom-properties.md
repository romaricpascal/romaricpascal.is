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
    border: solid 0.125rem white;
    padding: 0.5rem 1rem;
    box-shadow: 0 0.25rem 0 RGBA(70, 1, 96, 0.7);
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
    box-shadow: 0 0.375rem 0 RGBA(70, 1, 96, 0.7);
  }

  .button--with-static-adjustable-shadows:active {
    box-shadow: 0 0.125rem 0 RGBA(70, 1, 96, 0.7);
  }
</style>

The only thing that varies here is the `y` offset of the shadow. That's 3 places where we'd need to change the colors now, all for tweaking a unique property. A good use case for custom properties is to allow tweaking individual parts of properties that only have shorthand-ish declarations, like `box-shadow`.

So let's refactor this by introducing a `--elevation` property that'll let us tweak just the elevation, without worrying about the color.

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
    --base-elevation: 0.25rem;
    --elevation: var(--base-elevation);
    transform: translateY(calc(var(--base-elevation) - var(--elevation)));
  }
</style>

<div class="demo demo--shallow">
  <div class="demo-content">
    <button class="button button--with-adjustable-shadows button--with-translation">My shadow changes and I translate</button>
  </div>
</div>

Creating configurable patterns
---

The above created our own little CSS behaviour. Set `--base-elevation` and you get a button that goes up on hover, down on active. We can push this further by introducing two other properties that'll let us set how high or low the button needs to go.

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

<div class="demo demo--shallow">
  <div class="demo-content">
    <button class="button button--with-adjustable-shadows button--with-translation">My shadow still changes and I translate</button>
    <br><br>
    <button class="button button--with-adjustable-shadows button--with-translation button--configurable button--configurable-low">I'm closer to the page</button>
  </div>
</div>

Allowing composition of non-composable properties
---

Let's say we have another style of button already using `box-shadow`, for a double border using an `inset` shadow for example. `box-shadow` does support multiple shadows, but only as part of the same declaration. When multiple classes apply the property, they don't get composed together. Only the declaration for the most specific rule applies. This means our button will either lose its double border or it's drop-shadow. Not ideal at all!

By introducing a new custom property to store each of the shadows, we can help their composition. And either can rely on other custom properties to be made configurable as needed. The same can be done for the `transform` which has the same composability issue as `box-shadow`.

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

<div class="demo demo--shallow">
  <div class="demo-content">
    <button class="button button--secondary button--with-adjustable-shadows button--with-translation">I lost my drop shadow</button>
    <br><br>
    <button class="button button--secondary button--with-adjustable-shadows button--with-composable-shadow button--with-composable-transform button--with-translation">
    I kept my drop shadow
    </button>
  </div>
</div>

Separating configuration from application
---

So far, each new behaviour has been brought by different classes, the ones coming later overriding the declarations of the earlier ones thanks to the cascade. Great for explaining, but ultimately, we'd probably want to gather that into one unique class.

<style>
  .button--fancy {
    /*The configuration of the whole pattern*/
    --base-elevation: 0.25rem;
    --up-elevation: 0.375rem;
    --down-elevation: 0.125rem;

    /*The one property that'll end up tweaking both shadow and transform*/
    --elevation: var(--base-elevation);

    /*Variables to help composing the shadow and transform*/
    --shadow-elevation: 0 var(--elevation) 0 RGBA(70, 1, 96, 0.7);
    --transform-elevation: translateY(calc(var(--base-elevation) - var(--elevation)));

    /*The application through CSS properties*/
    box-shadow: var(--shadow-elevation);
    transform: var(--transform-elevation);
  }

  /*The changes of properties due to different states*/
  .button--fancy:hover,
  .button--fancy:focus {
    --elevation: var(--up-elevation);
  }

  .button--fancy:active {
    --elevation: var(--down-elevation);
  }

  /*Let's not forget our secondary button*/
  .button--secondary.button--fancy {
    box-shadow: var(--shadow-inset), var(--shadow-elevation);
  }
</style>

<div class="demo demo--shallow">
  <div class="demo-content">
    <button class="button button--fancy">All in one class!</button>
  </div>
</div>

Much tidier! That said, there's a last welcome bit of flexibility that can be added by splitting that class into two. Because child elements will also get the custom properties, we can separate where the properties get set from where they get applied. This will allow the `box-shadow` and `transform` not to be set on the element itself, but on one or several of its children. Like the little badge of the button below.

<style>
  .button--with-elevation {
    /*The configuration of the whole pattern*/
    --base-elevation: 0.25rem;
    --up-elevation: 0.375rem;
    --down-elevation: 0.125rem;

    /*The one property that'll end up tweaking both shadow and transform*/
    --elevation: var(--base-elevation);

    /*Variables to help composing the shadow and transform*/
    --shadow-elevation: 0 var(--elevation) 0 #853D84; /*Turned into a solid color to allow shadows to overlap*/
    --transform-elevation: translateY(calc(var(--base-elevation) - var(--elevation)));
  }

    /*The changes of properties due to different states*/
  .button--with-elevation:hover,
  .button--with-elevation:focus {
    --elevation: var(--up-elevation);
  }

  .button--with-elevation:active {
    --elevation: var(--down-elevation);
  }

  .button--with-elevation__elevate {
    box-shadow: var(--shadow-elevation);
    transform: var(--transform-elevation);
  }

  .button--with-elevation__elevate.button--secondary {
    box-shadow: var(--shadow-inset), var(--shadow-elevation);
  }
</style>
<details>
  <summary>Badge styling</summary>
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

<div class="demo demo--shallow">
  <div class="demo-content">
    <button class="button button--with-badge button--secondary button--with-elevation button--with-elevation__elevate">
      <span>Text of the button</span>
      <span class="button--with-badge__badge button--with-elevation__elevate">boom!</span>
    </button>
  </div>
</div>
