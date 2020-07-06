---
title: Accessible foundations - Landmarks
type: post
layout: post.pug
---
Headings are not the only way to help people navigate through the content of a page. The page design (usually) visbily separates the different areas of the page: that bit's the header, here is the main content, over there's the navigation... Some very useful information, that can also be conveyed to assistive technology users.

This is the job of ARIA (Accessible Rich Internet Applications) landmarks. The ARIA specification allows to define a role for the elements on the page. This role then conveys what the element is to assistive technology. Those landmarks are specific roles identifying relevant areas of the page:

- `main` to wrap the main content
- `banner` for what's more commonly called the site's header
- `contentinfo` for what's more commonly called the site's footer
- `complementary` for enclosing complements to the main content, like in a sidebar for example
- `navigation` to wrap, well..., navigation links
- `form` & `search` for forms and more specifically search forms for the second
- `region` for generic regions of the page that don't fit any of the previous ones

These can be assigned with the `role` attribute, but all except `search` are automatically attached to specific HTML elements:

- `main` to `<main>` 
- `banner` to `<header>`, unless it's inside an `<article>` or another landmark
- `contentinfo` to `<footer>`, unless, it's inside an `<article>` or another landmark
- `complementary` to `<aside>`
- `navigation` to `<nav>`
- `form` to `<form>`, if it is has an accessible name
- `region` to `<section>`, if it has an accessible name

Providing landmarks to help navigation pretty much comes down to using the right HTML element. However, you may want to complement your `<footer>`,`<nav>`,`<section>` and `<aside>` with the appropriate role to make up for the [compatibility issues uncovered by Scott O'Hara][landmark-compatibility].

A little inventory
---

Despite its simplicity, this site (at the time of the writing) offers 5 landmarks to speed up navigation:

- A `main` area where the content of articles and pages gets inserted by the static site generator
- A `banner` with the site `navigation`, as well as the language `navigation`
- A `contentinfo` with some extra links (maybe I should introduce a `navigation` there too to reach the links to my accounts on other sites)

<img src="/media/romaricpascal-homepage-landmarks.png" alt="Screenshot of the site homepage highlighting the position of the 5 landmarks">

Clarifying duplicate landmarks
---

Some landmarks ([`main`, especially,][only-one-main] but `banner` and `contentinfo` too) should only be there once on the page. Others, like `navigation` for which it happens often, might appear multiple times. Listing "Navigation" for each of them won't be much help for users.

In such situation, it's important to [provide an accessible name to each landmark][provide-accessible-name]. For example, the site and language navigation are given a different name using `aria-labelledby` pointing to a hidden `h2` in each of them (more likely to be translated OK than `aria-label`). This results in them being preceived respectively as `Site` and `Languages` navigation, making it clear where to go.

```html
<nav aria-labelledby="languageSwitcherHeading" role="navigation">
  <h2 id="languageSwitcherHeading" hidden="">Languages</h2>
  <!-- ... -->
</nav>
```

Providing an accessible name is also what will turn a `<section>` or a `<form>` into a landmark.

Checking the landmarks
---

Similarly to when checking headings, digging into the source looking for tags or `role` attributes is not going to be fun. The [Landmarks extension for both Firefox and Chrome][landmarks-extension] can grab a list of them for us, much better.

The [Axe extension][axe] can also check a few things, like ensuring that there is a unique `main` landmark or that all content is within landmarks.

And giving a peek at what screen readers detect is also a good option. Especially with [Mac][voiceover], [Windows 10][narrator] and [Ubuntu][orca] coming with one built in, and [NVDA][nvda] freely installable on Windows.

Alongside a correct heading structure, landmarks are really helpful to guide users to the content they're after. There is one more accessibility related feature I'd like to discuss in the next article, and then it'll be back to the static site generator.

[landmark-compatibility]: https://www.scottohara.me/blog/2019/04/05/landmarks-exposed.html
[only-one-main]: https://dequeuniversity.com/rules/axe/3.5/landmark-one-main
[provide-accessible-name]: https://adrianroselli.com/2020/01/my-priority-of-methods-for-labeling-a-control.html
[landmarks-extension]: http://matatk.agrip.org.uk/landmarks/
[axe]: https://www.deque.com/axe/
[voiceover]: https://help.apple.com/voiceover/mac/
[narrator]: https://support.microsoft.com/en-us/help/22798/windows-10-complete-guide-to-narrator
[orca]: https://help.gnome.org/users/orca/stable/index.html.en
[nvda]: https://www.nvaccess.org/download/
