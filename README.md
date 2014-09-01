angular-widgets
===============

Reusable AngularJS components/directives.

Development
-----------------
After downloading the code you'll need to perform the typical install procedures.
```bash
$ npm install
$ bower install
```

To start the development ```grunt``` server execute
```bash
$ grunt server
```
This setup a server instance with livereload on port ```9000```. You can navigate to http://locahost:9000 to see a demo app that shows the components (it is currently in a pretty plain state, I'm just getting started).

Components
----------------
Currently there is a single component, I hope to add more in the future.

###click-to-edit
This is a nice directive inspired by ```Jira``` form elements. The gist is that a form field is wrapped by this directive to provide two modes of display - ```display mode``` and ```edit mode```.  In ```display mode``` a simple text rendering is displayed. When hovering over the element it morphs into a bordered ```click to edit``` box with a bootstrap pencil glyph. Click the element toggles into ```edit mode``` where the field can then be edited. The user is offered a ```save``` and ```cancel```.

Any element can serve as the root of either mode, a simple example is show below.
```html
<click-to-edit>
     <span display-mode>{{model.value}}</span>
     <input edit-mode type="text" ng-model="model.value"/>
 </click-to-edit>
```
It can also wrap complex blocks or other directives (ui-select has been the primary test case for this).
 
The most powerful aspect of this directive is to use it as template to create other directives.

> **Note:**
> - The library has not been packaged for distribution yet so if you want to use it you'll have to copy the source.