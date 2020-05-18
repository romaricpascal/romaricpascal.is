Form attributes & buttons
===

Taking advantage of `formaction` and the other [HTML attributes related to form submission](html-attributes-form-submission) makes it easy to create DELETE buttons inside larger forms.

Eg. A list of linked things, each a delete button

```html
<form method="POST">
<input type="hidden" name="csrf" value="CSRF_TOKEN">
<label for="name">Name</label>
<input name="name" id="name">
<button formaction="/resource/delete">Delete</button>
<button>Update</button>
</form>
```

Form's methods are restricted to POST, but you can use something like `method-override` with Express, the `_method` param in Rails (TODO: Check for Laravel) to mimick a DELETE request.

```html
<form method="POST">
<input type="hidden" name="csrf" value="CSRF_TOKEN">
<label for="name">Name</label>
<input name="name" id="name">
<button formaction="/resource" name="_method" value="DELETE">Delete</button>
<button>Update</button>
</form>
```

This will however send the `name` with the DELETE request, which is completely unnecessary. We should be able to use the [`form` attribute](html-form-attribute) to link our button to an empty form and just send the minimum amount of information. TODO: Check that it works

```html
<form method="POST">
<input type="hidden" name="csrf" value="CSRF_TOKEN">
<label for="name">Name</label>
<input name="name" id="name">
<button formaction="/resource" name="_method" value="DELETE" form="empty-form">Delete</button>
<button>Update</button>
</form>
<form method="POST" id="empty-form" hidden></form>
```

Support starts at EDGE 16. For older browsers, more data would get sent down the wire.


[html-attributes-form-submission]: https://caniuse.com/#feat=form-submit-attributes
[html-form-attribute]: https://caniuse.com/#feat=form-attributes
