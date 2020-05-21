Adding styles
---

Dropping a stylesheet inside the `content` folder will get it copied across.

Let's not forget to update Nodemon to watch CSS files now.

Then from the layout, we can link it with a `<link>` tag. And voila... Not quite... Because of the layouts plugin, the content gets wrapped in the same layout at the pages.

Using the pattern option, we can exclude the CSS files from the layout project. 

```js
pattern: ['*', '**/*', '!*.css'],
```

Further down the line, we can look a how to not put the CSS in the content, most likely, when the proper design is implemented, it'll get build from SASS files. But for now, aim is to get something out so plain CSS in the content folder it is.
