Patterns for front-end Rails components
---

Over the last few years, the latest JavaScript frameworks have pushed components to the front of the scene.
Similarly to functions and classes, they help split the code generating HTML into manageable, encapsulated bits of functionalities helping loads with consistency, testability and maintainability. While most of those frameworks offer server side rendering, not all projects run a JavaScript server. This doesn't mean Ruby on Rails project have to miss out. As we'll see Rails comes with plenty to start splitting the UI code into reusable components.

At the core, especially on the server where there's no events to respond to, most components are pretty much functions that receives data and spits out some HTML. Rails actually comes with its own sets of components. The `link_to` helper and all the form helpers, for example, can be thought of as components. Digging further `content_tag` is kind of the most generic of components: give it the name of a tag, its answer and the attributes, it creates the appropriate HTML.

Partials are another form of components. They offer an encapsulated way to render HTML based on the data they're given. And despite not outputing any HTML, `fields_for` can be considered a kind of component too, encapsulating the logistics of digging deeper in the model to support the rendering of form components.

Starting with a `helper` let's explore different patterns that appear while implementing an FAQ component showing a question and its answer.

A starting point
---

As a starting point the responsibilities of the component will be pretty limited: given a `question` and an `answer` parameters, wrap them in the appropriate markup. Let's write it in the `FaqHelper` module, that'll live, as Rails convention commands, in `app/helpers/card_helper`.

```ruby
module FaqHelper
  def faq(question, answer)
    content_tag(:div, class: 'faq') do
      [
      content_tag('h2', question),
      concat content_tag('div',answer, class: 'faq-answer')
      ].join.html_safe
      # The strings need to be joined together and marked safe
      # without this, only the last one would be rendered
      # and the HTML would be escaped
    end
  end
end
```

It can the be used in a template or partial as such:

```erb
<%= faq "What's happening?", "The content of the FAQ appears on the screen in neat markup" %>
```

It's not much but it's a start.

Keyword parameters
---

Soon enough, that card would need to be used with different levels of questions because it's rendered in different parts of the application. Maybe its display within a grid system that calls for it to bear a `column` class too. Components parameters (or attributes, properties, props) are not limited to their content.

Its list of parameters will grow and relying on positional parameters become a big issue: "wait, is the question level, the 3rd or 4th parameter?"Keyword arguments provide a much clearer way to define which parameters the component can be configured with, even if it looks a bit more verbose in the partial:

```erb
<%= card(
    question: "What now?",
    answer: "The question is now a h3 and the faq has an extra class",
    extra_class:"column",
    heading_level: 3
  )
%>
```

```ruby
def faq(question: '', answer: '', extra_classes: '', heading_level: 2)
  classnames = ['faq', extra_classes].select(&:present?).join(' ')
  content_tag(:div, class: classnames) do
    [
    content_tag("h#{heading_level}", question),
    content_tag('div',answer, class: 'faq-answer')
    ].join.html_safe
  end
end
```

Reaching in
---

On one of the pages, the number of questions is growing so large that the designers would like the answer should appear/disappear when users click the title. The JavaScript is all ready to turn the heading content into a `<button>` implementing the [ARIA disclosure][aria-disclosure] pattern. It just needs to know which element to turn into a button. For that it expects a `data-disclosure` attribute on the heading it needs to inject the button in.

This means the faq component needs a way to add extra attributes to the the heading living inside it. This calls for a decision in how much the component exposes of its inner behaviour. We can either:

- allow attributes to be set on the question, through a `question_attributes` or `question_html` (as long as the naming is consistent project wide) parameter of the component

  ```ruby
  def faq(question: '', answer: '', extra_classes: '', heading_level: 2, question_html: {})
    classnames = ['faq', extra_classes].select(&:present?).join(' ')
    content_tag(:div, class: classnames) do
      [
      content_tag("h#{heading_level}", question, **question_html),
      content_tag('div',answer, class: 'faq-answer')
      ].join.html_safe
    end
  end
  ```

  ```erb
  <%= faq(
    question: 'What do I hide?',
    answer: 'Not much',
    question_html: {data:{collapsible: ''}})
  %>
  ```

- define an attribute on the question, say `collapsible`, which will tell the component to add the appropriate parameter.

  ```ruby
  def faq(question: '', answer: '', extra_classes: '', heading_level: 2, collapsible: nil)
    classnames = ['faq', extra_classes].select(&:present?).join(' ')
    content_tag(:div, class: classnames) do
      [
      content_tag("h#{heading_level}", question, data: {disclosure: ('' if collapsible)}),
      content_tag('div',answer, class: 'faq-answer')
      ].join.html_safe
    end
  end
  ```

  ```erb
  <%= faq(
    question: 'What do I hide?',
    answer: 'Not much',
    collapsible: true
  %>
  ```

The choice depends on how much flexibility you want to leave to the developers using the component, the complexity of the attributes that need to be passed. I tend to prefer starting with flexibility and locking things into parameters as similar uses emerge for the component accross the app. This limits the risks of picking a bad abstraction early on and lock things that way.

A single block of content
---

Some of the questions now need to have images rendered in them. This means the answer needs to accept HTML. It could be `capture`d ahead of the rendering of the FAQ, but it doesn't really make a nice API.

```erb
<% answer = capture do %>
  <p>As a guideline, you can follow this flow.</p>
  <img src="flow.png" alt="If it needs HTML, use a block, otherwise, use parameter">
<% end %>
<%= faq(
  question: 'How should I choose?',
  answer: answer
) %>
```

Instead, we can take advantage of Ruby blocks to provide the content for the answer. It'll make it clear that the bit of HTML is actually part of the FAQ:

```erb
<%= faq(
  question: 'How should I choose?'
) do %>
  <p>As a guideline, you can follow these steps.</p>
  <p>Description of the steps that make the image presentational</p>
  <img src="flow.svg" alt="">
<% end %>
```

To achieve that, we can make the `faq` helper responsible for capturing the answer and displaying it:

```ruby
def faq(question: '', answer: '', extra_classes: '', heading_level: 2, collapsible: nil)
  classnames = ['faq', extra_classes].select(&:present?).join(' ')
  
  content_tag(:div, class: classnames) do
    [
    content_tag("h#{heading_level}", question, data: {disclosure: ('' if collapsible)}),
    content_tag('div', class: 'faq-answer') do
      yield || answer # Favour block over parameter if it outputs anything
    end
    ].join.html_safe
  end
end
```

You might have noticed the `answer` parameter is still present. It remains useful when the answer comes from a variable or is short enough. Using it as a fallback if no block is given makes the most visible content the chosen value when both a block and the parameter might end up used. Alternatively, there's the option to `raise` if both the `answer` and a `block` are given.

Multiple blocks of content
---

Damn, some of the questions need to explain some icons and need an image in there too. Except they'll need an image in the answer too (tough luck). Using `capture` ahead still makes for a poor experience. But there's nothing that says the helper has to yield only once. Blocks can be run multiple times and accept arguments. We can `yield` a different argument depending on if we're looking for the question or the answer and leave it to the template calling the helper to change the block output based on that.

```erb
<%= faq do |slot| %>
  <% if slot == :question %>
    What does this icon, <img src="icon.svg" alt="Exclamation mark inside a triangle">, mean?
  <% else %>
    <p>As a guideline, you can follow this flow.</p>
    <p>Description of the steps that make the image presentational</p>
    <img src="flow.svg" alt="">
  <% end %>
<% end %>
```

Like for the `answer` we can leave the parameter available for passing in a variable or short text and favour the block if it outputs anything.
Note that the parenthesis in the `yield` call are important here. Otherwise

```ruby
def faq(question: '', answer: '', extra_classes: '', heading_level: 2, collapsible: nil)
  classnames = ['faq', extra_classes].select(&:present?).join(' ')
  
  content_tag(:div, class: classnames) do
    [
    content_tag("h#{heading_level}", data: {disclosure: ('' if collapsible)}) do
      yield(:question) || question
    end,
    content_tag('div', class: 'faq-answer') do
      yield(:answer) || answer
    end
    ].join.html_safe
  end
end
```

A note about `yield`
---

Empty values for the question or answer will lead to empty tags in the markup. A real FAQ component might want to assert that neither are empty. But for the sake of example, let's go another route and prevent the output of tags when their content is empty (which might be more something you'd find in a card component, whose heading and body might actually be optional).

We can `yield` multiple times, so why not `yield` once more to check if there is content or not? maybe something like:

```ruby
  #...
  [
  (content_tag('h2') do
    yield(:question)
  end if yield(:question).present?)
  #...
```

This runs the block twice though. Depending on what's in there, it might waste server resources that could be put to better use. But that's not the most pressing worry here. Blocks comming from partials actually send their content directly to the output. Running them twice means the HTML of the question is rendered twice to the users :'(

Instead, our component needs to capture the content ahead:

```ruby
def faq(question: '', answer: '', extra_classes: '', heading_level: 2, collapsible: nil)
  classnames = ['faq', extra_classes].select(&:present?).join(' ')
  
  question_content = capture{yield(:question)}
  question_content = question if question_content.blank?
  
  answer_content = capture{yield(:answer)}
  answer_content = answer if answer_content.blank?

  content_tag(:div, class: classnames) do
    [
    (content_tag("h#{heading_level}", question_content, data: {disclosure: ('' if collapsible)}) if question_content.present?),
    (content_tag('div', answer_content , class: 'faq-answer') if answer_content.present?)
    ].join.html_safe
  end
end
```

Moving to templates
---

`content_tag` is nice, but it quickly become tough to read as soon as there's more than a couple of tags. Even for one wrapper `<div>`, a `<h2>` and a body `<div>` the faq component already feels heavy.

For complex markup, partials are a much more readable and allow the same patterns we've used so far:

- `render` accepts a `locals` hash to provide parameters, enforcing the use of keyword to provide values
- using the `layout` option allows to `yield`
- ERB, HAML or Slim allow running arbitrary code like the one concatenating the classnames within the template, allowing UI logic to live right next to its markup

I'd also expect some performance gain when there's a couple of "static" tags (as in not relying on any of the components parameters). I'd expect the template engines to be clever and just make one big string of it when compiling the template. Which I'd expect to be faster than a series of function calls. But (a) I might be wrong and (b) the gains might be marginal.

There's a little subtlety about the use of `yield` though. When passing a symbol as argument to `yield` in a Rails layout, as we're doing with `:question` and `:answer`, Rails goes looking for content provided via `content_for` ahead of the `render`ing.

Even worse than using `capture`, `content_for` means content would leak to any layout `yield`ing the same symbol. Fortunately, yielding anything else than a symbol still passes the argument to the block. As block accept keywords arguments like any method, we can swap to that for passing which slot of the component we're looking to render: `yield(slot: :answer)` for example.

```erb
<%# app/views/components/faq.html.erb %>
<%
  question ||= ''
  answer ||= ''
  extra_classes ||= nil
  heading_level ||= 2
  collapsible ||= nil

  question_content = capture{yield(slot: :question)}
  question_content = question if question_content.blank?
  
  answer_content = capture{yield(slot: :answer)}
  answer_content = answer if answer_content.blank?

  classnames = ['faq', extra_classes].select(&:present?).join(' ')
%>

<div class="<%= classnames %>">
  <% if question_content.present? %>
  <h<%=heading_level%> <%= ('data-disclosure' if collapsible)%>>
    <%= question_content %>
  </h<%=heading_level%>>
  <% end %>

  <% if answer_content.present? %>
  <div class="faq-answer">
    <%= answer_content %>
  </div>
  <% end %>
</div>
```

The component can then be used as such from within other templates:

```erb
<%= render layout: 'components/faq', locals: {heading_level: 3} do |slot: nil|%>
  % if slot == :question %>
    What does this icon, <img src="icon.svg" alt="Exclamation mark inside a triangle">, mean?
  <% else %>
    <p>As a guideline, you can follow this flow.</p>
    <p>Description of the steps that make the image presentational</p>
    <img src="flow.svg" alt="">
  <% end %>
<% end %>
```

Notes:

- Switching to a template makes the different responsibilities of the component clearer: gathering parameters (from locals or `yield`ing), computing derived information based on those and actually doing the rendering
- for boolean parameters that needs to default to `true`, `||=` will get triggered if the value provided is `false`. Instead, using `local_assigns.has_key?(:param_name)` allows to know if the param was passed.

Formalising slots
---

That `slot:nil` and the multiple `if`s are a bit ugly. We can formalise the behaviour of those `slots` with a custom class:

1. The component instanciates it, `yields` it and then accesses the values set by the block

  ```rb
  def faq()
    slots = Slots.new
    yield slots

    question_content = capture{slots.question}
    #…
  end
  ```

2. The block the fills specific slots with whichever is necessary, values, variables or blocks

  ```rb
  <%= faq do |slots| %>
    <% slots.question= 'Does it work?' %>
    <% slots.answer do %>
      <p>You bet it does!</p>
    <% end>
  <% end %>
  ```

In my opinion, this makes for a much nicer API than using `if`s. This also completely bypasses the difference between `yield` inside templates and helpers, which is a plus. And makes passing arguments (for example shared IDs needed for labelling or ARIA patterns) to specific blocks a bit clearer if necessary.

The Slots class allowing this looks like this.

```rb
class Slots
  def initialize(**defaults)
    @slots = defaults
  end

  def method_missing(name, *args,**kwargs, &block)
    if (name[-1] == '?')
      has?(name[0..-2].to_sym)
    elsif (block_given?)
      set(name,block)
    elsif (name[-1] == '=')
      set(name[0..-2].to_sym, args[0])
    else
      get(name, *args, **kwargs)
    end
  end

  def get(name, *args, **kwargs)
    value = @slots.fetch(name, nil)
    if (args.present? || kwargs.present?)
      value.call(*args, **kwargs)
    else
      value
    end
  end

  def set(name, value)
    @slots[name] = value
  end

  def has?(name)
    @slots.has_key?(name)
  end
end
```

Specialised versions could be used for limitting the API of specific components to a restricted lists of slots.

Partial or helper
---

As components can be defined as either partials or helpers, this causes a burden on programmers that have to remember which components is defined in which way. Not ideal at all.

Using a `missing_method` helper and some conventions, we can make all component calls a helper call. If the helper exists, `missing_method` won't be invoked. If not we can have it try to render a specific component based on the method name.

```rb
def method_missing(name, *args, **kwargs, &block)
    partial_name = to_partial_name(name)
    begin
      if block_given?
        render layout: partial_name, locals: kwargs do |*args,**kwargs|
          block.call(*args, **kwargs)
        end
      else
        render partial: partial_name, locals: kwargs
      end
    rescue ActionView::MissingTemplate
      super
    end
  end

  def to_partial_name(name)
    "components/#{name.to_s.gsub('__','/')}"
  end
```

The `to_partial_name` method allows to set the convention for translating a helper name into the path of a partial. In this implementation, the components would be gathered in a `components` folder. Nesting for organising the components would be handled by translating any double underscores into a `/`, turning `user__avatar` into `components/user/avatar`.

This puts an overhead on the rendering of any template based component, though. every time they render, there's a failed call to a helper then the call to `missing_method`. A better option might be to collect components and define the appropriate helpers at server startup, but I haven't pursued this direction so can't say which gains it yields.

Context
---

Passing the `heading_level` parameter is more flexible than hardcoding it inside the component. However, it doesn't make it less error prone when the code rendering the component gets moved. It's basically hardcoding it in the component calling the `faq` rather than in the component itself.

Imagining that the `faq` component is rendered within another partial (for example, to allow fetching this specific part through AJAX), passing a `heading_level` parameter through each partial until reaching the call of the component is cumbersome.

JavaScript component frameworks have a concept of context to store some values on the side of the component tree and retrieve them further down the tree without passing it to each level.

This would allow the following API for managing the heading levels

```erb
<% with_heading_level(2) do %>
  <%= heading 'This will be an H2' %>
  Some content
  <% with_next_heading_level do %>
    <%# 
      If `faq` uses the same `heading` helper,
      it will automatically output an `h3`
    %>
    <%= faq(question: 'Q',answer: 'A') %>
  <% end %>
  <%= heading 'This will be an H2 again' %>
  <%= heading 'And this will be an H3', level: 2 %>
  Other content
<% end %>
```

This is made possible by the following helpers:

```ruby
def initialize(*args)
  super
  @heading_level = 1
end

# Defines a block where the headings start at the given level
def with_heading_level(level)
  current_level = @heading_level
  @heading_level = level
  yield
  @heading_level = current_level
end

def with_next_heading_level(level_shift: 1)
  with_heading_level(@heading_level + level_shift) do
    yield
  end
end

def heading(*args, level_shift: 1, **kwargs, &block)
  heading_level = @heading_level + level_shift - 1
  tag_name = heading_level < 7 ? "h#{heading_level}" : "p"
  if (block_given?)
    content_tag(tag_name, *args, **kwargs) do
      yield
    end
  else
    content_tag(tag_name, *args, **kwargs)
  end
end
```

Other applications of this pattern could be automatically handling the `sizes` attribute of `img`, with each component declaring how its layout affects the size of images.

The concept can be generalised to, allowing components to pass data down the child components in an encapsulated manner without having to pass it to each component along the way:

```rb
def initialize(*args)
  @contexts = {}
end

def with_context(name, value)
  current_context = @contexts[name]
  @contexts[name] = value
  yield
  @contexts[name] = current_context
end

def get_context(name)
  @contexts[name]
end
```

- managing HTML attributes: Rails helpers handle data-attribute hashes, HAML does too. Outside ot that, the rendering of attributes has to be handled manually. There's a `tag_options` lying around in Rails source, but it's private. To help build reusable components, it'd be great to have:

- a helper for handling classes. Similar to [JavaScript's `classnames` package][npm-classnames], that accepts string, arrays, but most importantly hashes of classes with true/false (`true`, the class appears, `false` it doesn't)
- a helper for handling class
- aria-... support
- a `merge_html_attributes` helper for merging hashes of HTML attributes together, taking care of merging classes appropriately (relying on the `classname` helper)

- inlining SVGs, transforming them at runtime (adjust viewBox, set title, remove focusable for IE11, add default "role: presentation" for icons…), handle spriting when SVGs are repeated (for ex. when rendering a collection), load SVGs optimized by Webpacker, from node_modules

- managing responsive images: Generating `srcset`s from ActiveStorage or Paperclip objects. Managing `sizes` with helpers. Generating the `img` tag attribute or CSS for background images floated up to the template with `content_for`



[aria-disclosure]: https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure
[npm-classnames]: https://www.npmjs.com/package/classnames
