---
title: Once upon a time… an interaction in the browser
slug: front-end-interaction
date: 2020-09-02
type: post
layout: post.pug
---

This is the story of a web page a user wants to interact with.
It could be summed up shortly in those 3 steps, but that would be a very coarse summary:

1. The person finds which bit of the page they need to interact with
2. They action the element that handles the interaction
3. The page updates, fully or partially as a result.

These may repeat, for complex interactions. But more importantly, there's more to each steps than a single sentence. Let's try and grasp a more complete story to not miss any step of its implementation.

Finding what to interact with
---

Large or small, any kind of page need to guide the users so they can find what they're after.

### Identify where they are

That's the starting point. Without knowing where you are, it's tough to decide how to reach your destination. Pages can drop a variety of hints to tell users where their journey is starting:

- main heading
- site logo
- highlighting the current page in the navigation
- breadcrumbs
- title of the browser tab
- favicon

And possibly many others.

### Identify where they need to go

Once they've confirmed where they are, users need to understand which part of the page hosts the element they need to use for starting their interaction. For that again, the page leaves a variety of clues:

- its visual design should help separate sections of the page (and stays consistent from one page to another)
- ARIA landmarks would provide similar separation for assistive technologies
- its headings would help identify what each part is about

### Recognize what they can interact with

Inside the area they think the element starting the interaction would be users still need to recognise that:

1. it can be interacted with. Its design should provide clues that it is indeed something that can be actionned: in an easily recognisable shape of a button, a link, a checkbox… But it's not all, it needs to convey the proper role and state to assistive technologies too, through the right HTML semantics or ARIA attributes if absolutely necessary.
2. it can be identified as the right one. Its text, shape or icon should be large enough and contrasted enough to see, and clear enough to understand. And again, assistive technologies should get unambiguous text label that lets user identify they've got the right element.

Actionning the element
---

Interactions come in many forms and actionning an element is not just a matter of clicking or tapping. This is already enough to pose some constraints actually: making sure that the element is big enough and spaced enough from others that they can be targetted without mistake.

The element also needs to react to the appropriate keyboard interaction. It starts with being focusable so it can actually be reached, and ends with responding to the keypresses required by its role.

Oh, and tts labelling and shape should also make it easy to action through voice recognition.

The page updates…
---

Finally, the element is actionned and the page updates. Simple interactions will make their change straight away. Others, triggering longer processing might make two, three, maybe more successive updates.

There's plenty that can happen there, and not all interactions will go through all the steps to come.

### Instant feedback

The element gives feedback straight away that it has been interacted with, for example though a CSS `:active` style.

### Confirmation

Some actions or the current state of the website/application may require to double check that the user really wants the action to happen. Maybe there will be unrecoverable changes if they continue, or the action they're about to undertake has significant impact.

### Validations

Before anything further happens, some validations may be required to check that the action can actually happen. This might result in displaying some errors, or a warning asking them to confirm they really want to proceed

### Optimistic updates

To give a more responsive feel, the page updates as if the action (or part of it) had already completed, trusting that things will go OK. If they don't, the updates will be reverted. But things will go OK, won't they?

### Loading state

Some actions need a bit longer to complete than others, maybe heavy computations or a request to the server. Users need feedback that the device is working on it (and even better if they can be shown an accurate progress).

This can be shown either on the element that triggered the action or in the places that should be updated once the action completes. Maybe both.

### Concurrency control

Users might still be able to action the element while its computations are running. This means a decision to make regarding what to do with subsequent interactions.

Perhaps you actually want to prevent future interactions, and notify the user that something is already happening if they action the element again. This is particularly suited for POST forms, where you usually don't want multiple requests sent.

Or maybe only the last action should be taken into account, and the previous ones cancelled. Something that's more suited to GET forms, like filtering lists.

In any case, doing nothing is risky (especially with the network is in the way). Enforcing a sequence could also be a solution (though this might mean some cleverness if the network is in the way too, as it doesn't guarantee order).

### Handle the result

Finally the action completes. Whether it succeeded or failed, there is some more updates that await the page.

1. Update the content. This might range from swapping a CSS class, updating some text all the way through to replacing entire pans of DOM. And it might not be just that:
 
    - special care might needs to be given to not lose the focused element, if it is within one of the areas being updated
    - animations/transitions might be there to make the update look smoother
    - parts of the page outside the rendered document might need updating too: URL, title of the browser tab (possibly with care for assistive technology), favicon even maybe
    - maybe what gets updated is some in-memory state, that'll itself trickle into an update of the document

2. In case of error, revert any optimistic updates
3. Update the focus position if it needs to be moved. Maybe the interaction closed a modal and the focus needs to be put back on the element that opened it
4. Notify the user, making sure it's accessible both visually and to assistive technology. However this might:

    - Not be necessary due to the nature of the update (opening an accordion doesn't need a "success, you've opened the panel" notification)
    - have already been handled by the update (showing the page of a product you've just added via a form might be clear enough to show success)
    - for assistive technology, have already happened via the update (new content in an `aria-live` element, for example) or moving the focus to a new element.

5. Clearing the loading states set when the action started
6. Cancel concurrency controls set when the action started
  
Each interaction is its own story and follows its own path. But they share a common set of steps that need to be thought through when implementing them. Hopefully this list can avoid missing some of them and provide a more robust experience to users.
