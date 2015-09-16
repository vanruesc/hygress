# Hygress 
[![Build Status](https://travis-ci.org/vanruesc/hygress.svg?branch=master)](https://travis-ci.org/vanruesc/hygress) 
[![GitHub version](https://badge.fury.io/gh/vanruesc%2Fhygress.svg)](http://badge.fury.io/gh/vanruesc%2Fhygress) 
[![npm version](https://badge.fury.io/js/hygress.svg)](http://badge.fury.io/js/hygress) 
[![Dependencies](https://david-dm.org/vanruesc/hygress.svg?branch=master)](https://david-dm.org/vanruesc/hygress)

A hy(potrochoid pro)gress visualisation library. The animation that this module 
provides can be combined with other rendering processes and doesn't use an 
isolated animation loop. The decision of where, when and how Hygress should 
draw something is entirely yours.

## Installation

Download the [minified library](http://vanruesc.github.io/hygress/build/hygress.min.js) and include it in your project:

```html
<script src="/js/hygress.min.js"></script>
```

You can also install it with [npm](https://www.npmjs.com).

```sh
$ npm install hygress
``` 

## Usage

```javascript
import Hygress from "hygress";

// All parameters are optional and can always 
// be adjusted later by accessing them as properties.
var hygress = new Hygress({
	hypotrochoid: Hygress.Hypotrochoid.PENTAGRAM,
	size: [400, 300],
	scale: 1.0,
	clearCanvas: false,
	colourRoll: false,
	saturation: 90.0,
	luminance: 75.0,
	opacity: 0.25,
	hue: 180.0
});

// Grab the canvas and put it on the page.
document.body.appendChild(hygress.canvas);

// You can also give Hygress your own canvas if you want.
var myCanvas = document.createElement("canvas");
hygress.canvas = myCanvas;
document.body.appendChild(myCanvas);

// Define the current canvas' size.
hygress.size = [window.innerWidth, window.innerHeight];

// Specifically define the hypotrochoid's size.
hygress.htSize = 100.0;

// Step the animation.
requestAnimationFrame(hygress.render);

// You need to clear the canvas if the clearCanvas flag has been set to false.
var ctx = hygress.canvas.getContext("2d");
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

// Sick of clearing manually?
hygress.clearCanvas = true;

// Linearly transition the opacity and scale.
hygress.transitionTime = 1.25; // seconds
hygress.opacity = 0.0;
hygress.scale = 0.0;
```

## Documentation
[API](http://vanruesc.github.io/hygress/docs)

## Contributing
Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
_Version: 0.0.0 (28.06.2015)_
> The basic animation works. The next step is to focus on the progress aspect!

## License
Copyright (c) 2015 Raoul van Rüschen  
Licensed under the Zlib license.
