From nothing to a website
===

Everything is blank, and you want to create a website, published to all on the internet.
What happens next.

First a web page
---

You open a **text editor**, inside you write something like this:

```html
<html>
  <head>
    <title>This is a webpage</title>
  </head>
  <body>
    <h1>I'm alive</h1>
  </body>
</html>
```

You **save it**, as a file named `index.html` for example. Here you go, you have a minimal web page now!
You can open it in a <strong>web browser</strong> and see it in all its glory.

It's only one page though, it looks pretty rough and you can only access it from your computer...Not quite a website, published to all on the internet.

Styling the page with CSS
---

We can add a `<style>` tag inside the `<head>` to customise the style of the elements on the page.

```html
<html>
  <head>
    <title>This is a webpage</title>
    <style>
      h1 {
        font-family: sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>I'm alive</h1>
  </body>
</html>
```

Still rough, but we're set up to produce something much more pleasant for the eye.
Now we said multiple pages.

A second page
---

Just like we created the `index.html` before, you can create a second page with its own content.

```html
<html>
  <head>
    <title>This is a second webpage</title>
  </head>
  <body>
    <h1>I'm alive too</h1>
  </body>
</html>
```

Saving work accross multiple pages
---

We have two pages. Our text editor would allow to save each separately. This is not quite the same as "saving the whole website". There are tools meant to save work across multiple files. These are called **version control systems**. More than just saving the work across the file, they keep a full history of that work, allowing to travel back in time, in case we want to understand how we got where we are in the project, or to reinstate something that had been removed.

Servers
---

So far, the work is only accessible on our machine. Nobody else can see it. For it to be visible by more people, we need a server. You can run one on your machine, like `npx serve` but the audience will be quite limited: only the people in the same network as your machine will be able to see it. Handy for sharing across your team, but it's not quite the whole internet yet.

To share with the whole internet, you'll need to find something to host the files.

Domain names
---

This is the key to having your own corner of the internet. 

Linking between pages
---

Great, we have two pages, but how do we get from one to another. HTML provides the `<a>` tag to create links between pages. `<a href="second-page.html">` and boom!

Sharing CSS between the pages
---

That second page looks just as bare as the first one. Would be great if we could reuse the styling we did for it.
We can take the content of the `<style>` tag and place it in its own file, let's name it `style.css`.
Now we can swap that `<style>` tag for `<link rel="stylesheet" href="style.css">` to get that second page styled.
When the browser encounters that tag, it will download the `style.css` file and use it to style the page.

Cost: 1 network request during which the browser does not carry on rendering (mitigated by caching)
Benefit: Sharing style across the different pages without having to copy them in each file (separate caching of HTML & CSS)

Sharing HTML between the pages
---

Most often these pages will share some common parts. Maybe a header with a logo and shared navigation, or a footer with a copyright notice. Using a **templating engine**, like `ejs`, we can set that common part in its own file and `include` it in each file.

Generating the HTML from some data
---

Templates also let you create pages out of data. This is especially handy when you have a set of pages that all follow the same structure. You set the content in some data file, and reuse a template to format that data into a nice piece of HTML for the browser. Usually this happens using a static site generator. Data formats can vary, but main ones can be JSON, MarkDown, CSV.

Dynamic sites
---

Editing JSON files is not a pleasant experience for everyone, even for developers used to working with that format (they're also humans after all). There are other formats more human friendly, like YAML, but it's only a minor improvements. Getting a nice user interface to edit the data might be much simpler. Fortunately HTTP allows sending data to a server. For now we can let it store the data in JSON and it'll be just fine.

Relational databases
---

JSON/YML files are nice, but not really optimised for storing data, especially when you need to build relations between different pieces of data.
