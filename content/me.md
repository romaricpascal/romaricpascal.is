---
title: About me
---

About me
===

<div>

<img src="/media/me.png" alt="" class="avatar no-border" role="presentation">

**Hello, I'm Romaric** and I've been building websites for more that 12 years now. Along the way, I've come to care about accessibility and performance to offer a good experience to the widest audience.

I focus on writing semantic templates and components, as well as maintainable CSS (from scratch or on top of libraries like Bootstrap), in support of various backends whether server-side like Rails or Django, or client-side like React or Vue.

</div>

While I'm attached to privacy, I'm a big believer in sharing, whether it's [open-source code][github-profile] or [knowledge](#writings).

Mar. 2020 - Now
---

After a little more than 2 years in my previous position, I felt the need to take some time for personal explorations: [some experimental projects](#other-projects) as well as more complete pieces of work.

<div class="project">

### Personal site

<p class="lead">Explore static site generation, internationalisation and steady writing.</p>

Starting back from scratch, I rebuilt this website using a static site generator (Metalsmith), implementing features to publish both in English and French. The whole process is documented through [blog posts](/posts/), from the JavaScript implementing the features to the CSS patterns used for the styles, as well as accessibility fundamentals.

[Sources available on Github][website-sources].

<p class="tech-list">JavaScript (NodeJS), Metalsmith, HTML, CSS, Markdown</p>

</div>

<div class="project">

### To/Fro

<p class="lead">Volunteer work collaborating to the creation of an app that coordinates Knowle West Alliance volunteers who support isolated people during the Covid19 crisis.</p>

I took part to the EUvsVirus hackathon to kickstart the project and continued growing the project afterwards. Due to the small scale of the team, I got involved in most areas of the build: setting up the front-end build process, implementing Django templates and their styling using Bootstrap, but also using Django's ORM to query the necessary data or customizing Django admin, authentication and emails.

[Sources available on Github][to-fro].



</div>

Nov. 2017 - Feb. 2020: Cookies HQ - Front-end developer
---

Conception and development of front-end components for various applications, coordinating with the backend developers and designers. Alongside development, I also helped support the team when front-end issues arose. I also raised awareness about accessibility through:

- [an internal presentation][cookieshq-presentation]
- [articles on the company's blog][articles-at-cookies]
- [a public presentation][smart-cookies-presentation] at the [Smart Cookies meetup][smart-cookies-accessibility]

<blockquote>

He was a key member of our team, leading the front-end development on many projects. He was our accessibility and ethics champion. He has challenged us more than anyone else, pushing us to constantly improve our processes and the way we approach projects.

We have learnt a lot from him. I think that, going forward, Nic and I will always have a little Romaric's voice in our heads but above all, we're very grateful for the 2 years that he has spent with us.

<cite><a href="https://www.linkedin.com/feed/update/urn%3Ali%3Aactivity%3A6638408058257055744/">Nathalie Alpi - Co Founder and Managing Director at CookiesHQ</a></cite>
</blockquote>

<div class="project">

### Stornaway

<p class="lead">
Development of a graph editor to facilitate the <a href="https://www.stornaway.io/#homevideoplayer">creation of interactive videos</a>.
</p>

Aside from general styling, I mostly got involved with the implementation of the graph editor. It allows creators to map the stories they're building: which scenes make part of the story, which options viewers can take at the end of the scenes and how that affects the scene they're led to. They can then upload the video for each scene and export the story.

This included:

- Prototyping for feasability the extra features to be added to the graph library (JointJS/RappidJS)
- Collaborating with the back-end developers on the architecture for storing and loading the graph
- Integrating the graph edition with Rails forms for editing the node's data
- Implementing specialised form controls (tabs, file upload, color picking)

Live at https://stornaway.io

<p class="tech-list">Rails, HTML (HAML), CSS (Bootstrap, SASS, SCSS), JavaScript (RappidJS), tooling (Webpack)</p>

</div>

<div class="project">

### Big Clean Switch

<p class="lead">
Development of a "block editor" to help create variations of a green energy supplier switching form
</p>

To help Big Clean Switch customize the journey their users go through when looking for a new green energy provider, I helped:

- implement a "block editor" that lets them organise pre-set fields into different steps,
- pick a theme for their styling,
- integrate the resulting form on their Wordpress site or 3rd party, ensuring minimal bloat (though use of vanilla JS and bespoke CSS) and preventing styles leaking in.

This involved:

- Semantic implementation of various form control components
- Responsive styling of the form with CSS
- Building JavaScript navigation through the step and form fields behaviour (error handling, conditional visibility, adapting values to choices...)
- Offering styling options (theme switching)
- Collaborating to the architecture for handling form's saves, rendering and submission
- Allowing embedding of the form on the marketting site, as well as 3rd parties

Live at https://bigcleanswitch.org

</div>

<div class="project">

### Patternbank

<p class="lead">
Development of a block editor to facilitate the creation of content pages to alongside ecommerce site.
</p>

To help Patternbank publish content next to their ecommerce site, I helped implement a "block editor" that allows to build pages through a combination of configurable sections. Due to high importance of visuals for this site, particular attention had to be paid to:

- image responsiveness and performance (lazy loading, srcset...s)
- providing a variety of responsive layouts for each section
- offering styling options (typography, colors, component variants)
- allowing accessible fluid typography
- providing control for heading levels

On a more technical level, this project included:

- Making a client-side only prototype with Vue to quickly explore the concept
- Collaborating, both on design and implementation, with the backend developers for storing and loading the content
- Implementing components and the page rendering
- Styling the components with CSS
- Integrating a Vue editor to pick sections and configure their options with Rails form in the admin

Live at http://patternbank.com

<p class="tech-list">Rails, HTML (HAML), CSS (SASS, PostCSS), JavaScript (Vue, Vanilla), tooling (Webpack)</p>

</div>

<div class="project">

### Update existing ecommerce sites

<p class="lead">Implement design updates and new features on ecommerce sites already in production</p>

On ecommerce sites like [Good Sixty], [Patternbank][patternbank-studio] or [Roughtrade], I implemented updates to the user interface especially:

- product listing
- filtering forms
- product pages
- checkout

<p class="tech-list">Rails, HTML, CSS (SASS), JavaScript (jQuery, Turbolinks)</p>

</div>

Before Nov. 2017
---

- Jan. 2016 - Nov. 2017: Independent lettering artist
- Jan. 2012 - Dec. 2016: Independent front-end developer and web designer - Works included building a JavaScript UI for [HP Labs' Loom][hpe-loom].
- Apr. 2008 - Aug. 2011: Atos Wordline - Intern to Lead developer on the Geoportail mapping API for the French <span lang="fr">Institut géographique national</span>.

Other projects
---

Outside of client work, and [this website][romaricpascal.is], I also tinker with various little projects: small apps, tooling or just experiments with concepts or technology that feel interesting to me. Here are a selected few:

- [express-mount-files]: An ExpressJS middleware to declare routes through folders and files, nostalgia of PHP's early days.
- [implicitjs]: Twisting JavaScript syntax with Babel to try and turn it into a templating language. Highly experimental.
- [An experiment with Bezier curves][bezier-experiment]: A Svelte app illustrating an idea for drawing a Bezier spline passing through a list of points.
- [Taskfight]: A(n oldish) React app where tasks fight against one another to sort their priorities.

Writings
---

I learnt a lot from what others shared, so it's only normal to try and reciprocate (with varying success at regularity):

- [On this site](/posts/): Currently sharing a step by step of the site's rebuild
- [On CookiesHQ blog][articles-at-cookies]: Accessibility and performance tips from when I was working there
- [On my previous site](https://old.romaricpascal.is/writing-about/): Mix of lettering and web development articles

[stornaway]: https://www.stornaway.io/#homevideoplayer
[big-clean-switch]: https://bigcleanswitch.org/
[patternbank]: https://patterbank.com
[patternbank-studio]: https://patternbank.com/studio
[Roughtrade]: https://www.roughtrade.com/gb/s
[Good Sixty]: https://www.goodsixty.co.uk/retailers/bristol/115-earthcake
[to-fro]: https://github.com/cgillions/to-fro/
[hpe-loom]: https://community.hpe.com/t5/behind-the-scenes-at-labs/introducing-loom-a-new-tool-for-managing-complex-systems/ba-p/6793962
[hpe-loom-source]: https://github.com/HewlettPackard/loom
[cookieshq-presentation]: https://www.cookieshq.co.uk/posts/building-accessible-websites-is-a-job-for-the-whole-team
[articles-at-cookies]: https://www.cookieshq.co.uk/posts/author/romaric
[smart-cookies-presentation]: https://cookieshq.github.io/accessibility-smart-cookies
[smart-cookies-accessibility]: https://www.meetup.com/Smart-Cookies-Bristol/events/264888812/
[Taskfight]: https://taskfight.romaricpascal.com
[express-mount-files]: https://github.com/rhumaric/express-mount-files
[implicitjs]: https://github.com/rhumaric/implicitjs
[romaricpascal.is]: https://github.com/rhumaric/romaricpascal.is
[bezier-experiment]: https://github.com/rhumaric/bezier-spline-experiment
[github-profile]: https://github.com/rhumaric/
[website-sources]: https://github.com/rhumaric/romaricpascal.is/
