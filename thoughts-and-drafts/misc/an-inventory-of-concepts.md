An inventory of concepts
===

**Browsers** request **HTML documents** from **servers** using **HTTP** over the **Internet**, that they then display to users.

Browsers and servers
---

Those are two kinds of applications. Servers stand by, ready to respond to requests from Browsers. Both can take many forms:

- Servers can simply send files stored on their hard drive, down to generating their response on the fly, based on data fetched from different sources.
- Browsing the web takes many forms, both in the way people consume the content (visual, sound, touch) and the way they interact with it (mouse, touch, keyboard, switch, voice commands...).

Internet
---

Internet is the network supporting the Web. It's not the web (and vice-versa). It's a network of computers that can communicate with each other. Each machine has an address, its IP, allowing the others to, well, address their communications to it.

IPs are sequences of numbers, so not super human-friendly. This is why we have domain names to map a more rememberable name (say romaricpascal.is) to an IP (46.105.57.169).

The Web itself
---

I like John Gruber's summmarization of what the web is (thanks HTeuMeuLeu). It comes down to two things, the two 'HT' as he says:

- HTTP: A protocol for machines to talk to each others
- HTML: A format of document exchanged over this protocol

### HTTP

Servers are ready to listen for clients to request documents, usually on port 80.

Clients can take various form, but the ones you're probably most familiar with are browsers. You're probably using one to read this document right now.
But HTTP is not limited to browsers, native apps on phones use it to request their data too, for example.

Request format:

```
METHOD URL VERSION
HEADERS

BODY
```

Response format:

```
VERSION STATUS-CODE REASON PHRASE
HEADERS

BODY
```

#### HTTPS

HTTP just sends the request in plain text. This means anyone snooping on the network can see what's inside... not ideal for privacy.

HTTPS comes to the rescue, adding a layer of encryption to protect the content of the request.

TODO:

- What does it protect exactly?
- How does it do the protection?

#### HTTP/2

TODO: Research

### HTML

This is the format of documents exchanged to make the Web work.

It is a markup language, inserting tags to describe the purpose of the text within the document. It also allows to embed other kinds of documents, like images, videos or audio files, as well as **CSS** to describe its style and event **JavaScript** to program interactions.

Markup
---

Everything starts with an HTML document

### Semantics

The most important part!
Needs to be as semantically rich as possible.
HTML already provides a lot of semantics on its own.
ARIA comes to enhance them when needed.

### Other responsibilities of the markup

Aside from semantics, the markup plays a role in:

- hooking CSS for styling
- hooking JS for adding behaviour
- SEO (title, desc, keywords -- if that's still a thing --, microdata/schema.org/... -- if that's relevant these days)
- performance (`preload`...)
- TODO: Anything else?

### Templating

As websites grow, there are repeated parts, or parts that can be generated from data, hence the use of templates, whether with an SSG or a server.

CSS
---

Styling the contents of a HTML page is done through CSS.
It's a list of rules that describe which styling rules to apply to which element:

```css
<selector> {
  <property>: <value>
}
```

Selector give the reason why the rule applies. Properties define what gets applied. Combining selectors allows to define more complex reasons. There's usually a limit past which the reason for applying the rules becomes the wrong reason. 6 selectors already allow you to express: I'm X (but not Y) and the child/descendant of A (but not B) and I'm a (direct) sibling of C (but not D).This is already a pretty complex reason to have some styles and maybe it's easier to have your template/JavaScript compress it to "I'm something else" by setting specific classes or attributes.

TODO: Find back the graph with the technical names of each part, esp. when selectors compound

#### The Cascade

#### Different selectors and when to use them

#### General principles

- naming scheme (BEM is nice)
- CSS concerns (picked from Harry Robert's vid.): layout, structure (border, padding, width/height), typography, appearance
- controlling isolation
  - use selectors to express "why"
  - OOCSS to split concerns and not fit everything in the same selector
  - finding reusable patterns
  - media queries
  - `@supports`
  - nesting, or limitations of (don't describe HTML structure in CSS)
- design tokens
  - colors (for bg, text, borders...)
  - typography (scales, loading)
  - spacing
  - icons?
  - shadows
- code structure (ITCSS, or a lighter 'abstract', 'generic', 'components')
- utility classes
- loading (render blocking, media queries...)
- code-splitting

#### Processors

SASS & PostCSS

JavaScript
---

- HTML binding: custom class, data attributes, custom elements
- The lifecycle of JavaScript:
  - `defer`, `async`
  - run once
  - event listening
  - setup + teardown
  - setup + teardown + active/inactive
- The platform provides a lot
- Polyfilling & cutting the mustard
- General concepts:
  - Events
  - Rendering & templates
  - Asynchronous programming (callbacks, promises, async/await)
  - XHRs
  - Debouncing & throttling
  - Working with functions (pipes, middlewares)
  - Timers
  - TODO: Grow the list

## The accessibility tree

What gets in there and how?

- elements themselves: `hidden`, `aria-hidden`, `disabled`, `display: none`, `visibility:hidden`...
- their labels: label from HTML (content, `for`, `alt`, `<caption>`...), `aria-label`, `aria-labelledby`...
- other stuff (`aria-describedby`, `roledesc`...)

Components
---

### Text content

- HTML: `<p>`, `<ul>`,`<ol>`,`<dl>`, `<blockquote>`

### Appearance

- Text & background colors (incl. WCAG contrast)
- Borders
  - color
  - `border-image`
  - drawing shapes
- Gradients
  - shapes
- Shadows

### Typography

- CSS: Font families map (grouping of font-family,font-weight and font-style)
- Font size and lineheight
- Uppercase and letter spacing
- Cancelling ascenders and descenders whitespace

### Structuring content

#### Landmarks

- Semantics
- Labelling
- Fixed header
  - min-height MQ
  - scroll-margin-top
  - headroom.js (how accessible is that?)
- Navigations
  - Responsive (full or partial overlay, enhanced to work without JS)
  - Drawer that pushes the content - meh
  - Dropdowns - requires ARIA disclosure pattern

#### Headings

- Button in headings

#### CSS

- Spacing & rythm classes
- Heading styles and classes
- Responsive typo (usually more for headings)
- Sticky footer

#### Layout techniques

- CSS grid
- Flexbox
- Fab four
- position: `sticky`
- Sticky sidebar (with JS)
- z-indices
- Floating
  - `shape-outside`

### Actions

#### Links & Buttons

#### CSS

- contrast rules (text, as well as graphic)
- button reset
- invisible & discreet links (when hover/focus supported by parent)
- link stylings
- button stylings

### Images & Multimedia

#### Images

##### `<img>`

- Basic
- Responsive
- Multi-format
- CSS: Aspect ratio
- JS: Lazy loading (on scroll, or other events)
- Template: Data structure for easy image embedding
- Template: Data structure for tracking image size

##### `<svg>`

- Inline
- SVG sprite
- CSS: Styling
- Workflow: Preparing SVG
- Template: Embedding SVG

##### `background-image`

- Basic
- Responsive

#### Videos

- `<video>`
- Youtube/Vimeo
- JS players (videoJS/plyr)

#### Audio

TODO: Research

### Forms

- Different types of fields
- Labeling (fieldsets & fields), incl. with buttons
- Error and hint association
- CSS: Text & textarea styling
- CSS: Select styling
- CSS: Checkbox and radio styling
- Validation
- Custom components:
  - Range
  - Switches
  - Hide/show password
  - Clearable inputs
  - 3 states checkable
  - File input (styled, allow removal, upload on selection)
  - Typeahead/autocomplete
  - Tag inputs
  - Color picker
  - Drag'n'drop

### Tables

- Markup
- Responsiveness
- Forms in tables? ARIA grid

### Embed

- Iframes
  - JS
- Object

### Overlays

- CSS `position: absolute/fixed` + different ways of pinning the object (inside, outside, on 1 to 4 blocks, how margins work with it...)
- dropdowns
- drawers
- toasts
- modals
  - lightboxes
- ARIA `haspopup`?

### Scrolling

- Horizontal & vertical overflow
- Smooth scrolling
- Scroll into view
- CSS: Shadows when scrolling

### Animations

- reduced-motion MQ
- CSS transitions
- CSS animations
- Animating with JS
  - Parallax

### Focus

- Use focusable elements
- `tabindex="-1"` to remove tababbility
- `tabindex="0"` to add tababbility
- focus management: restoring after closing modal, for ex
- roving tabindex
- CSS: `focus`
- CSS: `focus-within`
- CSS: `focus-visible`
- CSS Appearance: WCAG 2.2 Focus rules
- Visibility when tabbing/reverse tabbing and overlays (fixed, sticky or absolute)

### ARIA widgets

Frequently used:

- Disclosure
- Tabs
- What else?

The rest

### Maps

TBD

### Charts

TBD

### 3D

TBD

### Print

TBD

### Email

TBD

### Multilingual/Internationalization

TBD

Workflow
---

How to make sure to cover most bases when implementing front-end?

- UI Flows (Basecamp's shorthand:<https://signalvnoise.com/posts/1926-a-shorthand-for-designing-ui-flows>)
- Breakdown each screen into components containing components... with for each:
  - 9 states when applicable: <https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85>
  - Content:
    - semantics
    - source (hard coded or from data)
    - variability (present/absent, long/short, 1 line/multiline...)
  - Styling
  - Responsiveness
  - Triggered interaction
- For interactions, breakdown: <https://github.com/rhumaric/thoughts-and-drafts/blob/master/interacting-with-a-web-page.md> (this might highlight new components)

There will be missing pieces when design is first handed over. Ask questions, discuss ;) There'll also be missing pieces revealed when implementing. Same :)

Values
---

TBD, but TL;DR:

- Respect the user (accessibility, performance, respect their attention, their privacy, make it easy to leave...)!
- Respect the platform: Use what it gives you, and if your JS breaks some of its default behaviour, make sure you compensate for it.

Checklists
---

frontendchecklist.io
<https://checklists.opquast.com/fr/>

Tooling
---

### Versioning

Git

### Linting

ESLint
Stylelint
Husky + lint-staged

### Testing

- JS code
- SASS Code
- UI: Cypress.io

### CSS

SASS + PostCSS (handy plugins list)

### JavaScript

- Nothing
- Minifying (terser, uglifyjs)
- Bundling & code splitting (webpack, rollup, parcel)
- Transpiling (babel)

### Package management

- NPM
- patch-package

### Images

- minification
- SVG optimisation

### Documenting

- Docco
- JSDoc/SassDoc
- Markdown + SSG
