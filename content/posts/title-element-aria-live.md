---
date: 2020-07-23
title: Announcing document's title changes with aria-live
type: post
layout: post.pug
---
<p class="note">
<strong>Important: The content that follows is an experiment with very limited testing. It would need testing on a broader range of browser and screenreader combination before being used in production.</strong>
</p>

Building a single page applications requires taking over <a href="https://access42.net/accessibilite-rechargement-page-single-page-applications" hreflang="fr">the browser's responsibility for navigating from page to page</a>. This  means responding to changes to the page URL and showing the page that corresponds, of course. But browsers also broadcast the title of the new page to assistive technologies, making the new location clear to the users. This is also something that needs to be taken care of.

The [Accessible Rich Internet Application (ARIA) specification][aria-spec] brings the [`aria-live` attribute][aria-live] to let assistive technologies announce updates of the page as they happen. It has [good support][aria-live-support], so could it be used on the document's title tag? This is a test to find out.

The experiment
---

This page hosts an experiment to test if the title gets announced OK upon update. Click a button, the title gets updated and hopefully announced. 

<div class="note font-size--inherit">

To witness the announcements, you'll need to have a screen-reader alongside your browser. Both [Mac][voiceover], [Windows 10][narrator] and [Ubuntu][orca] come with one built in, and [NVDA][nvda] can be freely installed on Windows.

</div>

Before trying to update a fancy element like `<title>`, let's start by checking everything works as intended with a more common candidate for `aria-live`: a simple `<p>` element,for example.

Clicking the next button will update a `<p>` tag right after. Because it has an `aria-live="polite"` attribute, this should trigger an annoucement of "Clicks" followed by a number.

<div class="interactive">
  <button data-target="live-div">Update the paragraph</button>
  <p id="live-div">Clicks: 0</p>
</div>

Now for the actual test, the form that follows will trigger an update of the document's title. If things work, it should trigger the same kind of announcement: "Clicks" followed by a number. The title in the tab will be updated too, but that part is more likely to work.

It offers two ways to update the title, in case it makes a difference (both worked in my limited testing):

- updating the `document.title` property directly
- fishing the title element from the `<head>` and updating its `textContent`

<form class="interactive">
  <fieldset>
    <legend>How to update the title</legend>
    <div class="radio">
      <input checked id="updateType-property" name="updateType" type="radio" value="property">
      <label for="updateType-property">Use
        <code>document.title</code>
      </label>
    </div>
    <div class="radio">
      <input id="updateType-element" name="updateType" type="radio" value="element">
      <label for="updateType-element">Use the title element's
        <code>textContent</code>
      </label>
    </div>
  </fieldset>
  <button>Update title</button>
</form>

Behind the scene
---

The first step is to add the `aria-live` attribute to the `<title>` element. Not sure if having it in the markup when the page loads would trigger a duplicate announcement (with the title already announced by the browser), so I prefered playing is safe and add it via JavaScript.

<script type="application/javascript">
  var titleElement = document
    .head
    .querySelector("title");
  // Announcement feels important, so using `assertive`
  titleElement.setAttribute('aria-live', 'assertive');

  // Same for the `<p>`, except it's not as important so `polite`
  document.getElementById('live-div').setAttribute('aria-live','polite')

</script>

Only adding the attribute is not enough, though. The `<title>` element hidden by default and doesn't make its way into the [accessibility tree][accessibility-tree].

<figure>
<img src="/media/title-not-in-accessibility-tree.png" alt="Screenshot of Firefox developper tools' Accessibility panel before doing anything with no entry for the title.">
<figcaption  class="no-default-spacing"> Firefox developper tools' Accessibility panel shows no node for the title in the elements of the accessibility tree, only the name of the document.</figcaption>
</figure>

Using `display:block` on the `<head>` and itself will allow it to make its way there.

<figure>
<img src="/media/title-in-accessibility-tree.png" alt="Screenshot of Firefox developper tools' Accessibility panel showing the title inside the accessibility tree.">
<figcaption class="no-default-spacing">With <code>display:block</code> in, Firefox developper tools' Accessibility panel shows a new node for the title in the accessibility tree.</figcaption>
</figure>

As we don't want it shown on the page, though, we need to use some CSS to hide it accessibly:

<style>
  head {
    display: block;
  }

  title {
    display: block;
    /*
      From Bootstrap's visually-hidden mixin
      https://github.com/twbs/bootstrap/blob/main/scss/mixins/_screen-reader.scss#L8
    */
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

</style>

With that, any change to the title should get announced. If not all changes needed announcement, toggling either the `display` of the `<title>` or the `aria-live` attribute as necessary should give control. But it would need further testing, past this experiment focusing only on `aria-live` being recognised.

For the updates, it's a little more JavaScript to listen to events of the form and button, and update the appropriate values:

<script type="application/javascript">
  var value = 0;
  var content = "Clicks: " + value;

  function updateContent() {
    value++;
    content = "Clicks: " + value;
  }
  document.addEventListener("click", function(event) {
    // Only consider clicks on buttons
    if (event.target.tagName == "BUTTON") {
      // Grab the target on the page
      var updateTarget = event.target.getAttribute("data-target");
      if (updateTarget) {
        updateContent();
        document.getElementById(updateTarget).innerHTML = content;
      }
    }
  });

  document.addEventListener('submit', function(event) {
    // Otherwise, the page reloads, whoops!
    event.preventDefault();
    updateContent();
    // Grab which way we should update the title
    if (document.querySelector('[name="updateType"]:checked').value === 'property') {
      document.title = content;
    } else {
      document.head.querySelector('title').textContent = content;
    }
  });
  
</script>

Now hopefully that works across all kinds of browsers and screenreaders, but I could only test with Firefox + Orca on Ubuntu and Safari + Voiceover on Mac. [If you try it with another combination, I'd be glad to know][tweet].

OK, for real, next article will be back to the static site generator.

Updates
---

23 Jul 2020: Add a link detailing what needs to be handled when taking over the browser navigation with JavaScript. Thanks <a href="https://twitter.com/firewalkwizme/status/1286331334365982721" hreflang="fr">Yann</a> for the link, and <a href="https://access42.net/audrey-maniez" hreflang="fr">Audrey</a> for the article!

[aria-live]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
[aria-spec]: https://www.w3.org/TR/wai-aria-1.1/
[aria-live-support]: https://a11ysupport.io/tech/aria/aria-live_attribute
[accessibility-tree]: https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/the-accessibility-tree
[voiceover]: https://help.apple.com/voiceover/mac/
[narrator]: https://support.microsoft.com/en-us/help/22798/windows-10-complete-guide-to-narrator
[orca]: https://help.gnome.org/users/orca/stable/index.html.en
[nvda]: https://www.nvaccess.org/download/
[tweet]: https://twitter.com/romaricpascal/status/1286322110789554184
[yann-tweet]:https://twitter.com/firewalkwizme/status/1286331334365982721
