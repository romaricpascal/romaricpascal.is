Lazy-loading
===========

The problem
-----------

Resources low down the page get loaded way before they're needed (if they're ever actually needed). Images are good clients here, but it can be also videos or iframes.

A solution
----------

Detect when an element is about to enter the screen and fill in the attributes that will make the network request happen only when needed. Mostly we're looking at the `src` attribute. But not only:
 - on an `<image>` tag, we'd also want to fill in the `srcset` to get proper responsiveness (the `sizes` attribute can be present all the time, it does not matter much)
- for an element showing a large background image, there can be different strategies:
   - filling in the `style.backgroundImage` property
   - filling in the `style` attribute, allowing to set other parameters at the same time
   - adding a `class`, which opens the door to defining responsive background images and loading something adapted to the viewport
- for more complex elements, the pattern can help delay a request loading a hefty bit of data to be rendered too.

> Which other scenarios to cater for?

For that, we can have the element hold the necessary values in a data attribute (commonly `data-src`, `data-srcset`...). And some JavaScript monitoring when the element will enter the viewport to trigger a swap from the data attribute to the actual attributes. This only need to happen once, so any scroll listening can (and should be cleaned up) after the swap happens.

Modern browsers provide the perfect tool for that, with `IntersectionObserver`. As its name hints at, it is meant to observe when Element intersect with the viewport or their scrolling area.

> Question: Or other elements? Doesn't matter for this but would be good to know (eg: intersects a fixed header)

A polyfill exist to widen the support to older browsers. Convenient. With it, lazy loading an image is just a couple of line of code.

> TODO: Example

The problem of the problem
--------------------------

In replacing the attributes with a `data-` counterpart, we've actually created a couple of problems:
 1. no JS, no content :(
 1. For content that would indeed be in the viewport from the start, we're adding some download delay :(
 1. `<image>` tags won't hold their space without an `src` attribute
 1. it would be nice to show something while loading

Let's start with the last one, which is actually a design decision to make. As long as what you show is lighter than the actual content, that's a win for your users. It could be a branded placeholder, a colored background (taking the dominant color of the image, for example), a light CSS loader (don't overdo it if there's to), a blurry low-res version of the image (maybe skip those extra requests using Data-URLs).

For the 3rd one, CSS can help by displaying your image withing an container with a fixed aspect ratio. The container will hold the space, ensuring no jump happens when the content is loaded.

Browsers start their load early to get the content to users as fast as possible. We're going against that for content that would be in the viewport from the start. Using lazy-loading doesn't mean lazy-loading all the things, and you can set it up only on content that's low down the page.

This leaves the "No JS, no content" issue. `<noscript>` content only solves a part of the problem, as it cannot do anything for when the browser actually runs JavaScript, but the JavaScript doesn't make it through the network. Depending on the experience you're after, there's a couple of options:
 - Providing a fallback link as the placeholder can give your users another way to access the content
 - Using a little JavaScript inlined in the head to backup the attributes values in their `data-` counterpart as the browser builds the page. A timeout callback, to be canceled by the lazyloading code, would act as a safeguard and swap the attributes back in case the lazyloading JS doesn't make it.

> TODO: Find back @heydonworks thread to credit both solutions

I'm partial to that last option, as it comes just as an enhancement. The server sends its data just as if there was no lazy-loading. The code in the `<head>` prepares everything (make sure to keep it light) and the lazyloading works its magic as users scroll.