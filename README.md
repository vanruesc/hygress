# Hygress 
[![Build Status](https://travis-ci.org/vanruesc/hygress.svg?branch=master)](https://travis-ci.org/vanruesc/hygress) 
[![GitHub version](https://badge.fury.io/gh/vanruesc%2Fhygress.svg)](http://badge.fury.io/gh/vanruesc%2Fhygress) 
[![npm version](https://badge.fury.io/js/hygress.svg)](http://badge.fury.io/js/hygress) 
[![Dependencies](https://david-dm.org/vanruesc/hygress.svg?branch=master)](https://david-dm.org/vanruesc/hygress)

A hypotrochoid progress visualisation library.

## Installation

This module can be used directly in the browser:

```html
<script src="/js/hygress.min.js"></script>
```

You can also install it with [npm](https://www.npmjs.com).

```sh
$ npm install hygress
``` 

## Usage

```javascript
// Note: using require is not necessary with the browser bundle.
var Hygress = require("hygress");

var hygress = new Hygress({
 size: [400, 300]
});

// Grab the canvas and put in on the page.
document.body.appendChild(hygress.canvas);

// Starts the animation.
hygress.start();

// Stops the animation.
hygress.stop();
```

## Documentation
_(Coming soon)_

## Contributing
Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
_Version: 0.0.0 (28.06.2015)_
> The basic animation works. The next step is to focus on the progress aspect!

## License
Copyright (c) 2015 Raoul van Rüschen  
Licensed under the Zlib license.
