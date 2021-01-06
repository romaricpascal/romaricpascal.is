---
title: Hover effects with CSS custom properties
slug: hover-effects-css-custom-properties
date: 2020-11-11
type: post
layout: post.pug
ogDescription:
  Where a button serves as a pretext
  to explore patterns around CSS custom properties
---
<style class="d--none">
  .demo-content {
    background-color: #fbe1ce;
    padding: 2rem;
    text-align: center;
  }
</style>

Let's look into a `<button>`. One sticks out of the page thanks to some drop shadow, making it appear pressable. On hover (or focus), we'll have it stick out a bit more and when active, get pressed closer to the page. Like this one:

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button button--with-elevation button--with-elevation__elevate">
      The final result
    </button>
  </div>
</div>

Behind the scene, it's CSS custom properties that coordinate `box-shadow` and `transform`. Adjusting multiple properties is only one of the benefits CSS custom properties provide. So let's use this button to discover different patterns around them.

First, a button
---

To start with, we'll need a button so let's quickly make one. Nothing fancy, just a custom background and text color, some rounded corners (well, maybe a bit fancy) and a border. Oh, and a nice solid shadow to make it stick out, we said a shadow for the effect. We'll give it more classes as the article goes.

<style>
  /*
    Using a custom class to not hook
    onto all the buttons on this page
  */
  .button {
    font: inherit;
    border-radius: 0.375rem / 50% ;
    background: #460160;
    color: white;
    border: solid 0.125rem white;
    padding: 0.5rem 1rem;
    box-shadow: 0 0.25rem 0 rgba(70, 1, 96, 0.7);
  }
</style>

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button">I do nothing</button>
  </div>
</div>

We could have put some custom properties already for the colors, pulling from a list defined in `:root` (or `html`). But this is not about themeability (even if it's one of the gains from custom properties too).

Breaking down complex property values
---

To make the button stick out more, or appear pressed, the first part of the effect is adjusting its shadow. Longer shadow and the button looks taller, smaller one and it looks shorter. Bluntly, we could define the whole `box-shadow` property on both states:

<style>
  .button--with-static-adjustable-shadows:hover,
  .button--with-static-adjustable-shadows:focus {
    box-shadow: 0 0.375rem 0 rgba(70, 1, 96, 0.7);
  }

  .button--with-static-adjustable-shadows:active {
    box-shadow: 0 0.125rem 0 rgba(70, 1, 96, 0.7);
  }
</style>

For only adjusting the offset on the `y` axis, it's quite a lot to duplicate. It's a "chance" for a mistake when duplicating the values, and opportunities to forget updating one of the declarations if the color was to change.

By introducing a custom `--elevation` property, we can tweak just the value we need to touch and keep the rest of the `box-shadow` value in a unique place.

<style>
  .button--with-adjustable-shadows {
    --elevation: 0.25rem;

    box-shadow: 0 var(--elevation) 0 rgba(70, 1, 96, 0.7);
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
    <button class="button button--with-adjustable-shadows">My shadow changes</button>
  </div>
</div>

Controlling multiple properties
---

For now, the shadow changes, but the button remains stuck in place. It still needs the `transform` that'll translate it up or down. How much the button is translated depends on its elevation, and thanks to the `--elevation` property we just introduced, we got that nice and ready to use.

With `calc` we can reuse it to compute how much we need to translate the button. We'll need to store the original property first, as `--base-elevation`. And now by changing only one (custom) property, two properties get adjusted as needed.

<style>
  .button--with-translation {
    --base-elevation: 0.25rem;
    --elevation: var(--base-elevation);

    transform: translateY(calc(var(--base-elevation) - var(--elevation)));
  }
</style>

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button button--with-adjustable-shadows button--with-translation">My shadow changes and I translate</button>
  </div>
</div>

Creating configurable patterns
---

The previous example already illustrated it a bit. The new `button--with-translation` class was able to set the property defined by `button--with-adjustable-shadow`. Regular specificity rules apply as to which declaration will actually be applied to the element. And the values will trickle down accordingly: `--elevation` takes the value from `--base-elevation`, and in turn the `box-shadow` value will get adjusted accordingly.

We can push this further by introducing two other properties that'll let us set how high or low the button needs to go. This makes the element a central point for updating the whole pattern, without need to define extra `:hover`,`:focus` and `:active` selectors when we want to use different elevations for each state.

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
    <button class="button button--with-adjustable-shadows button--with-translation">My shadow still changes and I translate</button>
    <br><br>
    <button class="button button--with-adjustable-shadows button--with-translation button--configurable button--configurable-low">I'm closer to the page</button>
  </div>
</div>

Offering values to be consumed by other classes
---

So far, we've just used the values from the properties, either set inside the pattern or by another class. Custom properties can also be set for other classes to consume, helping with computations of their styles.

Let's say we have another style of button already using `box-shadow`, for a double border using an `inset` shadow for example. `box-shadow` does support multiple shadows, but only as part of the same declaration. When multiple classes apply the property, they don't get composed together. Only the declaration for the most specific rule applies. This means our button will either lose its double border or it's drop-shadow. Not ideal at all!

By introducing a new custom property to store the elevation shadow, we can help their composition. And either can rely on other custom properties to be made configurable as needed. The same can be done for the `transform` which has the same composability issue as `box-shadow`.

<style>
  .button--secondary {
    --shadow-inset: inset 0 0 0 0.125rem #460160;

    box-shadow: var(--shadow-inset);
    background: white;
    color: #460160;
  }

  .button--with-composable-shadow {
    --shadow-elevation: 0 var(--elevation) 0 rgba(70, 1, 96, 0.7);

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
    <button class="button button--secondary button--with-adjustable-shadows button--with-translation">I lost my drop shadow</button>
    <br><br>
    <button class="button button--secondary button--with-adjustable-shadows button--with-composable-shadow button--with-composable-transform button--with-translation">
    I kept my drop shadow
    </button>
  </div>
</div>

Separating configuration from usage
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
    --shadow-elevation: 0 var(--elevation) 0 rgba(70, 1, 96, 0.7);
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

<div class="demo demo--shallow demo--centered">
  <div class="demo-content">
    <button class="button button--fancy">All in one class!</button>
  </div>
</div>

Much tidier, only one class to use now! That said, there's a last bit of flexibility that can be added by splitting that class into two (good thing we just regrouped everything!).

Because child elements will also get the values of the custom properties, we can separate where the properties get set from where they get applied. This will allow the `box-shadow` and `transform` not to be set on the element itself, but on one or several of its children. Like the little badge of the button below.

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

  /*The trigger for actually lifting the button*/
  .button--with-elevation__elevate {
    box-shadow: var(--shadow-elevation);
    transform: var(--transform-elevation);
  }

  /*And let's not forget the composition with the secondary button*/
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
      <span>My badge moves, but no shadow!</span>
      <span class="button--with-badge__badge">Argh!</span>
    </button>
    <br>
    <br>
    <button class="button button--with-badge button--secondary button--with-elevation button--with-elevation__elevate">
      <span>Look at mine, it does both!</span>
      <span class="button--with-badge__badge button--with-elevation__elevate">Ta-da!</span>
    </button>
  </div>
</div>

Custom properties open up new ways of creating reusable patterns in CSS. They let us create small APIs to combine them with other classes, letting them input values or consume the ones we create thanks to the cascade (there's just [a little gotcha to be aware of when using them to set cutting-edge values][css-custom-props-gotcha]). Makes our rulesets kind of little functions.

They open the door to very intersting things. [Theming][css-custom-props-theming] might come to mind first. But they also let us go past just "replacing" values, with [logical operators][css-custom-props-logical], [stacks of default values][css-custom-props-stacks],...

[Browser support is great][css-custom-props-browser-support]. Progressive enhancement (either using fallback values or [`@supports`][css-custom-props-support]) takes care of the older browsers (or even [a polyfill][css-custom-props-polyfill] if really necessary). It's all very exciting!

[css-custom-props-logical]: https://css-tricks.com/logical-operations-with-css-variables/
[css-custom-props-stacks]: https://css-tricks.com/using-custom-property-stacks-to-tame-the-cascade/
[css-custom-props-browser-support]: https://caniuse.com/css-variables
[css-custom-props-polyfill]: https://github.com/nuxodin/ie11CustomProperties
[css-custom-props-support]: https://stackoverflow.com/a/38012166
[css-custom-props-theming]: https://csswizardry.com/2016/10/pragmatic-practical-progressive-theming-with-custom-properties/
[css-custom-props-gotcha]: https://adactio.com/journal/16993
