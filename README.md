# Hone

Hone is the best backdrop and element highlighting utility available for modern browsers.

## Installation

Install with NPM, Bower, or manually:

```sh
$ npm install hone -S
$ bower install hone -S
```

add the script tag or import/require:

```html
<script src="node_modules/hone/dist/hone.js"></script>

<script src="bower_components/hone/dist/hone.js"></script>

<script src="resources/vender/hone.js"></script>
```

```js
import Hone from 'hone';

var Hone = require('hone');
```

**There are no dependencies!**

## API

### Instantiate

Start by creating a new `Hone` instance:

```js
import Hone from 'hone';

const lookAtMe = document.getElementById('showOff'),
    hone = new Hone(lookAtMe);
```

By default, when you pass an element to the constructor, the `Hone` instance will become visible immediately.

### Options

The constructor takes some options as well. Here are the defaults:

```js
const defaultOptions = {
    classPrefix: 'hone',    //all components are given style classes like "<prefix>-component"
    fixed: false,           //set to true if the element is position: fixed
    borderRadius: 0,        //creates rounded corners (all four or nothing)
    enabled: true,          //controls the visibility and event listeners
    padding: '0',           //adds padding around the target, same format as CSS padding rule
    fullScreen: false       //should the backdrop be full screen (for a modal window)
};
```

### Instance Methods

The `Hone` instance has a minimal public API:

| Method                     | Description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| `Hone#hide()`              | hides the backdrop                                                     |
| `Hone#show()`              | shows the backdrop                                                     |
| `Hone#position(target?)`   | repositions the backdrop, and can position to a new target if provided |
| `Hone#setOptions(options)` | change instance options                                                |
| `Hone#destroy()`           | removes all event listeners and DOM elements                           |

## Tips

- If you are going to be repositioning the `Hone` instance frequently, even with new targets, create a single `Hone` instance
and use the `Hone#position(target)` method to reposition instead of creating new instances for each target. (See example)
- Both constructor parameters are optional. Not providing a target just disables the `Hone` instance by default.
- Pass the `enabled` option into the constructor as false to initially hide the `Hone` instance

## Examples

For an element in a fixed header:

```js
import Hone from 'hone';

const menuItem = document.getElementById('menuItemAbout'),
    hone = new Hone(menuItem, {
        fixed: true
    });
```

Creating a backdrop behind a modal window:

```js
import Hone from 'hone';

//no target required for a full screen Hone instance
const hone = new Hone({
    fullScreen: true
});
```

Positioning against a new target:

```js
import Hone from 'hone';

const menuItemAbout = document.getElementById('menuItemAbout'),
    menuItemContact = document.getElementById('menuItemContact'),
    hone = new Hone(); //if no target is provided, it instantiates but does not enable

//position against first menu item
hone.position(menuItemAbout);

//wait for user input maybe? Then position against next menu item
hone.position(menuItemContact);
```