Interacting with a web page
===

For someone to interact successfully with a web page, there's a series of things that need to happen. At a very high level, it goes like this:

1. The person finds which bit of the page they need to interact with
2. They action the element that handles the interaction
3. The page updates, fully or partially as a result.

This is just a pattern for a single interaction. More complex tasks require the repetition of it. Diving deeper, there are smaller "steps" that need to happen for each of these.

Finding which bit of the page to interact with
---

This requires the page to be well structured to help the user navigate to the element they need for their interaction:

1. Identify where they are (favicon, page title, site logo, main heading, breadcrumbs...)
2. Being able to identify in which area of the page they need to look (through visual design, landmarks, headings)
3. Recognizing that it's an element they need to interact with (affordance,cursor, role for AT) and the right one (label & state).

Actioning the element
---

Not much here, more of something to not trip on: the elements need to be actionable in various ways: mouse/touch (big enough to be interacted with), keyboard and through AT (focusable and with the appropriate interactions available for its role).

The page updates...
---

Not all actions will have all these steps. Some quicker actions won't need to show any loading state for example. Other will have minimal updates to the page,
maybe only a notification...

An action originates from a `source` and may update 0 or more `targets` on the page.

### Instant feedback

The element gives feedback that it's been interacted with (`:active` CSS state).

### Confirmation

Some actions or the current state may require to double check that the user really wants the action happens. Maybe there will be unrecoverable loss of data if the user continues, or something else of similar impact.

### Start the action

That's where what the user wanted to do actually happens. It may begin with some validation that will either result in some error being displayed to the user, or maybe a warning asking them to confirm they really want to run that action.

### Optimistic updates

To give the user a more responsive feel, you can start updating the page as if the action (or part of it) had already completed, trusting that things will be OK. For ex. Twitter likes, or updating the URL in the address bar early.

### Loading state

Some actions need a bit longer to complete than others, maybe heavy computations or a request to the server. Users need feedback that the device is working on it.

Both `source` and `target` can show a loading state for that

### Concurrency controls

If users are still able to action the source while the action is running,
you need to handle concurrent actions being run and what to do with them.
A couple of options:

- Prevent future actions: disabling the source, or better notifying the user that an action is already running on future interactions. A classic example is a POST form, where you probably don't want multiple requests sent.
- Cancel past actions: More for "GET" interactions, where you want the last one to win.
- Enforcing a sequence: Not sure how, but if there's a network & server involved, there's no guarantee that the result will come back in the same order as they were sent (latency...). Is there even a guarantee they get to the server in that same order? Feels a bit of an edge case
- Doing nothing might be enough for some cases too :)

### Handle the result

Whether the action succeeds or fails, handling the results follows pretty much the same pattern:

1. Render the updates: this can range from simply swapping a CSS class, updating text all the way through to replacing entire pans of DOM. This can happen instantly or have some transition/animation set up to make things smoother for the user. And can happen directly, or through updating the application state and responding to it by updating the DOM.
  Other interesting candidates for updates: the title of the tab, maybe the favicon or the URL.
  Special attention needs to be given to the focused element, to not lose users if they were focused on one of the areas that's getting updated.
2. [If applicable] Roll back optimistic updates if the action errored
3. [If applicable] Update focus position if it needs to be moved. Maybe the action closed a modal and the focus needs to be put on the element that opened it.
4. [If applicable] Notify the user, they need feedback on the result of their action both visually on the page and for assistive technologies. This might:
   - not be necessary because of the nature of the update (for example, a collapsible element that is now visibly open doesn't need a "success" message)
   - have already been handled by the update (for example showing the page for the product you've just created after submitting the form to create a new product)
   - for assistive technology, have already happened via the update (eg. new content inside an `aria-live` element) or the movement of the focus to a new element.
5. [If applicable] Clearing the loading states set as the action started (unless the rendering took care of that already)
6. [If applicable] Cancelling concurrency controls set as the action started
