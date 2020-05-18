Lengths
=======

Lengths are values for quite a few properties in CSS. Sizing, spacing, font-sizes... they're pretty much everywhere.

The two main ones being variations when consuming a website, if we focus on accessing the content through a screen:

 1. The size of the viewport
 2. The base font-size

This is why it is preferable to use relative units when implementing a design. Fortunately CSS provides quite a few units to express lengths:

 - relative to the viewport (`vh`,`vw`,`vmin`,`vmax`...)
 - relative to the font size (`em`, `rem`, `%`)
 - relative to some measure of the containing element (`%` for some of the properties).

This is plenty. The mockups we usually get have a fixed size and we need to translate those into those relative units. This leads to two issues:

 - relative to what?
 - how to surface the design values in the source, to express the intent

> TODO:
> - List of rules of thumbs for picking which unit to chose
> - SASS functions (`rem()`,`em()`,`vh()`...) to help carry the design intent in the source
> - Resposnsiveness:
>   - Viewport relative units
>   - Percents
>   - Breakpoints
>   - `em` + viewport unit ramps