/**
 * hygress v0.0.12 build 04.08.2015
 * https://github.com/vanruesc/hygress
 * Copyright 2015 Raoul van Rueschen, Zlib
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Hygress = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = CanvasRenderer;

/**
 * A canvas renderer base class.
 *
 * @class CanvasRenderer
 * @constructor
 * @param {Object} [options] - The settings.
 * @param {Number} [options.dt=1/60] - The update rate in seconds.
 * @param {Boolean} [options.clearCanvas=true] - Whether the canvas should automatically be cleared.
 * @param {Boolean} [options.enabled=true] - Whether the animation should be rendered. If set to false, the render function will merely update the time.
 * @param {Number} [options.size] - The canvas size.
 */

function CanvasRenderer(options)
{
 var self = this;

 /**
  * Delta time in milliseconds.
  *
  * @property dt
  * @type Number
  */

 this.dt = 1000.0 / 60.0;

 /**
  * Used for time based rendering. Milliseconds.
  *
  * @property now
  * @type Number
  * @private
  */

 this.now = ((window.performance !== undefined) ? window.performance.now() : Date.now()) / 1000.0;

 /**
  * Used for time based rendering. Milliseconds.
  *
  * @property then
  * @type Number
  * @private
  */

 this.then = this.now;

 /**
  * Used for time based rendering. Milliseconds.
  *
  * @property accumulator
  * @type Number
  * @private
  */

 this.accumulator = 0;

 /**
  * The rendering context.
  *
  * @property ctx
  * @type CanvasRenderingContext2D
  * @private
  */

 this.ctx = null;

 // Create an initial canvas.
 this.canvas = document.createElement("canvas");

 /**
  * Clear flag.
  *
  * @property clearCanvas
  * @type Boolean
  */

 this.clearCanvas = true;

 /**
  * Enabled flag.
  *
  * @property enabled
  * @type Boolean
  */

 this.enabled = true;

 // Overwrite the defaults.
 if(options !== undefined)
 {
  if(options.dt !== undefined) { this.dt = options.dt * 1000.0; }
  if(options.canvas !== undefined) { this.canvas = options.canvas; }
  if(options.clearCanvas !== undefined) { this.clearCanvas = options.clearCanvas; }
  this.size = options.size;
 }

 /**
  * The animation loop.
  *
  * @method render
  */

 this.render = function(now) { self._render(now); };
}

/**
 * The canvas.
 *
 * @property canvas
 * @type HTMLCanvasElement
 */

Object.defineProperty(CanvasRenderer.prototype, "canvas", {
 get: function() { return this.ctx.canvas; },
 set: function(x)
 {
  if(x !== undefined && x.getContext !== undefined)
  {
   this.ctx = x.getContext("2d");
  }
 }
});

/**
 * The size of the canvas.
 *
 * @property size
 * @type Array
 * @example
 *  [width, height]
 */

Object.defineProperty(CanvasRenderer.prototype, "size", {
 get: function()
 {
  return [
   this.ctx.canvas.width,
   this.ctx.canvas.height
  ];
 },
 set: function(x)
 {
  if(x !== undefined && x.length === 2)
  {
   this.ctx.canvas.width = x[0];
   this.ctx.canvas.height = x[1];
  }
 }
});

/**
 * Abstract update method.
 *
 * This method will be called by the render function
 * at a maximum rate of 60 fps. If the framerate drops,
 * the animation will, of course, slow down. That's the
 * intended behaviour.
 *
 * @method update
 * @param {Number} elapsed - The time since the last update call in milliseconds.
 */

CanvasRenderer.prototype.update = function(elapsed) {};

/**
 * Abstract draw method.
 *
 * @method draw
 */

CanvasRenderer.prototype.draw = function() {};

/**
 * Renders the animation.
 *
 * @method _render
 * @private
 * @param {DOMHighResTimeStamp} now - The time since the page was loaded.
 */

CanvasRenderer.prototype._render = function(now)
{
 var elapsed;

 if(now === undefined)
 {
  now = (window.performance !== undefined) ? window.performance.now() : Date.now();
 }

 if(this.clearCanvas)
 {
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
 }

 this.now = now;
 elapsed = this.now - this.then;
 this.then = this.now;

 if(this.enabled)
 {
  this.accumulator += elapsed;

  if(this.accumulator >= this.dt)
  {
   this.update(elapsed);
   this.accumulator -= this.dt;
  }

  this.draw();
 }
};

},{}],2:[function(require,module,exports){
"use strict";

module.exports = Hygress;

var CanvasRenderer = require("canvasrenderer"),
 Hypotrochoid = require("./hypotrochoid");

/**
 * Hygress.
 * A hy(potrochoid pro)gress visualisation.
 *
 * @class Hygress
 * @constructor
 * @extends CanvasRenderer
 * @param {Object} [options] - The settings.
 * @param {Number} [options.dt=1/60] - The update rate in seconds.
 * @param {Object} [options.hypotrochoid] - The hypotrochoid settings. If none is supplied, a random one will be created.
 * @param {HTMLCanvasElement} [options.canvas] - The canvas to use. A new one will be created if none is supplied.
 * @param {Boolean} [options.clearCanvas=true] - Whether the canvas should be cleared before rendering.
 * @param {Boolean} [options.colourRoll=true] - Whether the colour should continuously change (rainbow).
 * @param {Number} [options.hue=0.0] - The hue in degree.
 * @param {Number} [options.saturation=100.0] - The saturation in percent.
 * @param {Number} [options.luminance=50.0] - The luminance in percent.
 * @param {Number} [options.opacity=0.75] - The initial opacity.
 * @param {Number} [options.scale=1.0] - The initial scale.
 * @param {Number} [options.transitionTime=0.25] - The initial transitionTime.
 * @param {Array} [options.size] - The canvas size.
 */

function Hygress(options)
{
 CanvasRenderer.call(this, options);

 /**
  * The internal hypotrochoid instance.
  *
  * @property ht
  * @type Hypotrochoid
  * @private
  */

 this.ht = new Hypotrochoid();

 /**
  * The transition time.
  *
  * @property transitionTime
  * @type Number
  */

 this.transitionTime = 0.25;

 /**
  * The internal opacity transition values.
  *
  * @property _opacity
  * @type Number
  * @private
  */

 this._opacity = {
  start: 0.0,
  difference: 0.0,
  target: 0.75,
  elapsed: 0,
  transitionActive: false
 };

 /**
  * The internal scale transition values.
  *
  * @property _scale
  * @type Number
  * @private
  */

 this._scale = {
  start: 0.0,
  difference: 0.0,
  target: 0.0,
  max: 0.0,
  factor: 1.0,
  elapsed: 0,
  transitionActive: false
 };

 /**
  * Visible flag, used to determine if the hypotrochoid
  * should be drawn this frame.
  *
  * @property visible
  * @type Boolean
  * @private
  */

 this.visible = true;

 // Set the initial canvas size and the hypotrochoid's size.
 this.size = this.size;

 // Overwrite the default values.
 if(options !== undefined)
 {
  if(options.dt !== undefined) { this.dt = options.dt; }
  if(options.clearCanvas !== undefined) { this.clearCanvas = options.clearCanvas; }
  if(options.transitionTime !== undefined) { this.transitionTime = options.transitionTime; }
  if(options.colourRoll !== undefined) { this.ht.colourRoll = options.colourRoll; }
  if(options.hue !== undefined) { this.ht.hue = options.hue; }
  if(options.saturation !== undefined) { this.ht.saturation = options.saturation; }
  if(options.luminance !== undefined) { this.ht.hue = options.luminance; }
  if(options.canvas !== undefined) { this.canvas = options.canvas; }

  this.ht.settings = options.hypotrochoid;
  this.size = options.size;

  if(options.opacity !== undefined)
  {
   this.ht.opacity = this._opacity.target = options.opacity;
  }

  if(options.scale !== undefined)
  {
   this._scale.factor = options.scale;
   this.ht.d *= this._scale.factor;
  }
 }

 // Update the visible flag.
 this.visible = this.ht.opacity > 0.0 && this.ht.d > 0.0;
}

Hygress.prototype = Object.create(CanvasRenderer.prototype);
Hygress.prototype.constructor = Hygress;

/**
 * The hypotrochoid.
 * Assigning a new object only overwrites the defined
 * fields and keeps the other ones.
 *
 * @property hypotrochoid
 * @type Object
 */

Object.defineProperty(Hygress.prototype, "hypotrochoid", {
 get: function() { return this.ht.settings; },
 set: function(x) { this.ht.settings = x; }
});

/**
 * The size of the internal canvas.
 * 
 * @property size
 * @type Array
 * @example
 *  [width, height]
 */

Object.defineProperty(Hygress.prototype, "size", {
 get: function()
 {
  return [
   this.ctx.canvas.width,
   this.ctx.canvas.height
  ];
 },
 set: function(x)
 {
  var min;

  if(x !== undefined && x.length === 2)
  {
   min = (x[0] < x[1]) ? x[0] : x[1];
   this.ctx.canvas.width = min;
   this.ctx.canvas.height = min;
   this.htSize = min >> 1;
   this.ht.origin.x = this.ht.origin.y = this._scale.max;
  }
 }
});

/**
 * The hypotrochoid's size.
 *
 * @property htSize
 * @type Number
 */

Object.defineProperty(Hygress.prototype, "htSize", {
 get: function() { return this.ht.d; },
 set: function(x)
 {
  if(x !== undefined && typeof x === "number" && !isNaN(x))
  {
   this._scale.max = x;
   this._scale.target = this._scale.factor * this._scale.max;

   if(!this._scale.transitionActive)
   {
    this.ht.d = this._scale.target;
   }
  }
 }
});

/**
 * The hypotrochoid's origin.
 *
 * @property origin
 * @type Array
 * @example
 *  [x, y]
 */

Object.defineProperty(Hygress.prototype, "origin", {
 get: function() { return this.ht.origin; },
 set: function(x)
 {
  if(x !== undefined && x.length === 2)
  {
   this.ht.origin.x = x[0];
   this.ht.origin.y = x[1];
  }
 }
});

/**
 * The hypotrochoid's colour roll flag.
 *
 * @property colourRoll
 * @type Boolean
 */

Object.defineProperty(Hygress.prototype, "colourRoll", {
 get: function() { return this.ht.colourRoll; },
 set: function(x)
 {
  if(x !== undefined && typeof x === "boolean")
  {
   this.ht.colourRoll = x;
  }
 }
});

/**
 * The hypotrochoid's hue in degree.
 *
 * @property hue
 * @type Number
 */

Object.defineProperty(Hygress.prototype, "hue", {
 get: function() { return this.ht.colour; },
 set: function(x)
 {
  if(x !== undefined && typeof x === "number" && !isNaN(x))
  {
   this.ht.hue = x;
  }
 }
});

/**
 * The hypotrochoid's saturation in percent.
 *
 * @property saturation
 * @type Number
 */

Object.defineProperty(Hygress.prototype, "saturation", {
 get: function() { return this.ht.colour; },
 set: function(x)
 {
  if(x !== undefined && typeof x === "number" && !isNaN(x))
  {
   this.ht.saturation = x;
  }
 }
});

/**
 * The hypotrochoid's luminance in percent.
 *
 * @property luminance
 * @type Number
 */

Object.defineProperty(Hygress.prototype, "luminance", {
 get: function() { return this.ht.colour; },
 set: function(x)
 {
  if(x !== undefined && typeof x === "number" && !isNaN(x))
  {
   this.ht.luminance = x;
  }
 }
});

/**
 * The line width of the hypotrochoid.
 *
 * @property lineWidth
 * @type Number
 */

Object.defineProperty(Hygress.prototype, "lineWidth", {
 get: function() { return this.ht.lineWidth; },
 set: function(x)
 {
  if(x !== undefined && typeof x === "number" && !isNaN(x))
  {
   this.ht.lineWidth = x;
  }
 }
});

/**
 * The opacity of the hypotrochoid. Valid values: 0.0 to 1.0.
 *
 * Setting the opacity to a new value triggers a gradual change
 * towards the target value. The transition is linear and 
 * depends on the transitionTime variable.
 *
 * @property opacity
 * @type Number
 */

Object.defineProperty(Hygress.prototype, "opacity", {
 get: function() { return this.ht.opacity; },
 set: function(x)
 {
  if(x !== undefined && typeof x === "number" && !isNaN(x))
  {
   if(x < 0.0) { x = 0.0; }
   if(x > 1.0) { x = 1.0; }

   this._opacity.start = this.ht.opacity;
   this._opacity.target = x;
   this._opacity.difference = this.ht.opacity - this._opacity.target;
   this._opacity.elapsed = 0;
   this._opacity.transitionActive = true;
   this.visible = true;
  }
 }
});

/**
 * The scale of the hypotrochoid. Valid values: 0.0 to 1.0.
 *
 * Setting the scale to a new value triggers a gradual change
 * towards the target value. The transition is linear and 
 * depends on the transitionTime variable.
 *
 * @property scale
 * @type Number
 */

Object.defineProperty(Hygress.prototype, "scale", {
 get: function() { return this.ht.d; },
 set: function(x)
 {
  if(x !== undefined && typeof x === "number" && !isNaN(x))
  {
   if(x < 0.0) { x = 0.0; }
   if(x > 1.0) { x = 1.0; }

   this._scale.factor = x;
   this._scale.start = this.ht.d;
   this._scale.target = this._scale.factor * this._scale.max;
   this._scale.difference = this.ht.d - this._scale.target;
   this._scale.elapsed = 0;
   this._scale.transitionActive = true;
   this.visible = true;
  }
 }
});

/**
 * Updates the animation.
 *
 * @method update
 * @private
 * @param {Number} elapsed - The elapsed time since the last frame in milliseconds.
 */

Hygress.prototype.update = function(elapsed)
{
 var opacity, scale, percentage;

 // Need seconds.
 elapsed /= 1000.0;

 if(this.visible)
 {
  opacity = this._opacity;
  scale = this._scale;

  if(opacity.transitionActive)
  {
   percentage = opacity.elapsed / this.transitionTime;
   if(percentage > 1.0) { percentage = 1.0; }
   this.ht.opacity = opacity.start - percentage * opacity.difference;
   opacity.elapsed += elapsed;

   if(this.ht.opacity === opacity.target)
   {
    opacity.transitionActive = false;

    if(this.ht.opacity === 0.0)
    {
     this.draw();
     this.visible = false;
    }
   }
  }

  if(scale.transitionActive)
  {
   percentage = scale.elapsed / this.transitionTime;
   if(percentage > 1.0) { percentage = 1.0; }
   this.ht.d = scale.start - percentage * scale.difference;
   scale.elapsed += elapsed;

   if(this.ht.d === scale.target)
   {
    scale.transitionActive = false;

    if(this.ht.d === 0.0)
    {
     this.draw();
     this.visible = false;
    }
   }
  }

  this.ht.update();
 }
};

/**
 * Draws the hypotrochoid.
 *
 * @method draw
 * @private
 */

Hygress.prototype.draw = function()
{
 if(this.visible)
 {
  this.ht.draw(this.ctx);
 }
};

/**
 * Predefined hypotrochoids.
 *
 * @property Hypotrochoid
 * @type Object
 * @static
 * @final
 */

Hygress.Hypotrochoid = Object.freeze({
 ILLUMINATI: {r: 0.0147, R: 0.022, iterations: 220, rotation: 0.003},
 MULTISTAR: {r: 0.675, R: 1.64, iterations: 34, rotation: 0.023},
 HYPNOTIZER: {r: 0.42, R: 0.86, iterations: 43, rotation: 0.01},
 NEGATIVE: {r: 0.35, R: 0.614, iterations: 100, rotation: 0.023},
 WINDMILL: {r: 0.7853, R: 1.3751, iterations: 64, rotation: 0.01},
 TRIPLET: {r: 1.671, R: 2.509, iterations: 160, rotation: 0.046},
 PENTAGRAM: {r: 3.0, R: 5.0, iterations: 5, rotation: 0.03},
 RING: {r: 3.9, R: 5.0, iterations: 50, rotation: 0.013}
});

},{"./hypotrochoid":3,"canvasrenderer":1}],3:[function(require,module,exports){
"use strict";

module.exports = Hypotrochoid;

/**
 * A float threshold.
 *
 * @property EPSILON
 * @type Number
 * @private
 * @static
 * @final
 */

var EPSILON = 0.0001;

/**
 * Checks if two float values are (almost) equal.
 *
 * @method equal
 * @private
 * @static
 * @param {number} a - Value a.
 * @param {number} b - Value b.
 * @return {boolean} Whether the values are equal or not.
 */

function equal(a, b)
{
 return Math.abs(a - b) <= EPSILON;
}

/**
 * Hypotrochoid.
 * http://en.wikipedia.org/wiki/Hypotrochoid
 *
 * @class Hypotrochoid
 * @constructor
 * @param {Object} [options] - The settings.
 * @param {Number} [options.R] - Radius of the outer circle.
 * @param {Number} [options.r] - Radius of the inner circle.
 * @param {Number} [options.d=0.0] - Distance from the center to the inner circle.
 * @param {Object} [options.origin={x: 0.0, y: 0.0}] - Object with x and y components, representing the origin coordinates.
 * @param {Number} [options.rotation=0.0] - Sets the rotational direction and speed. (Negative for left rotation, 0.0 for no rotation.)
 * @param {Number} [options.iterations=64] - Limits the processing of very detailed hypotrochoids.
 * @param {Number} [options.opacity=0.75] - The opacity.
 * @param {Number} [options.lineWidth=0.5] - The line width.
 * @param {Boolean} [options.colourRoll=true] - Whether the colour should change continuously.
 * @param {Number} [options.hue=0.0] - The hue in degree.
 * @param {Number} [options.saturation=100.0] - The saturation in percent.
 * @param {Number} [options.luminance=50.0] - The luminance in percent.
 */

function Hypotrochoid(options)
{
 /**
  * Pi * 2.
  *
  * @property TWO_PI
  * @type Number
  * @private
  * @final
  */

 this.TWO_PI = Math.PI * 2;

 /**
  * Current rotation.
  *
  * @property rotation
  * @type Number
  * @private
  */

 this.rotation = 0.0;

 /**
  * Incremented by step, used to draw the hypotrochoid.
  *
  * @property theta
  * @type Number
  * @private
  */

 this.theta = 0.0;

 /**
  * Theta is incremented by step.
  *
  * @property step
  * @type Number
  * @private
  */

 this.step = 360.0 * Math.PI / 180.0;

 /**
  * The first 2D-point in the draw process.
  *
  * @property firstCoord
  * @type Object
  * @private
  */

 this.firstCoord = {x: 0.0, y: 0.0};

 /**
  * The previous 2D-point in the draw process.
  *
  * @property firstCoord
  * @type Object
  * @private
  */

 this.prevCoord = {x: 0.0, y: 0.0};

 /**
  * r.
  *
  * @property r
  * @type Number
  */

 this.r = Math.random() * 2.0 + EPSILON;

 /**
  * R.
  *
  * @property R
  * @type Number
  */

 this.R = this.r + Math.random() * 2.0 + EPSILON;

 /**
  * d.
  *
  * @property d
  * @type Number
  */

 this.d = 0.0;

 /**
  * Maximum iteration count.
  *
  * @property iterations
  * @type Number
  */

 this.iterations = (Math.random() * 300 + 3) | 0;

 /**
  * Rotation speed and direction.
  *
  * @property rotationSpeed
  * @type Number
  */

 this.rotationSpeed = Math.random() * 0.05 - Math.random() * 0.05;

 /**
  * The origin of the hypotrochoid.
  *
  * @property origin
  * @type Object
  */

 this.origin = {x: 0.0, y: 0.0};

 /**
  * the current opacity.
  *
  * @property opacity
  * @type Object
  */

 this.opacity = 0.75;

 /**
  * The line width.
  *
  * @property lineWidth
  * @type Number
  */

 this.lineWidth = 0.5;

 /**
  * Colour roll flag.
  *
  * @property colourRoll
  * @type Boolean
  */

 this.colourRoll = true;

 /**
  * The current hue.
  *
  * @property hue
  * @type Number
  */

 this.hue = 0.0;

 /**
  * The current saturation.
  *
  * @property saturation
  * @type Number
  */

 this.saturation = 100.0;

 /**
  * The current limunance.
  *
  * @property luminance
  * @type Number
  */

 this.luminance = 50.0;

 // Overwrite the defaults.
 this.setting = options;

 /**
  * The inverted r value.
  *
  * @property rInv
  * @type Number
  * @private
  */

 this.rInv = 1.0 / this.r;
}

/**
 * The hypotrochoid's settings: {
 *  r,
 *  R,
 *  d,
 *  iterations,
 *  rotation,
 *  origin,
 *  opacity,
 *  lineWidth,
 *  colourRoll,
 *  saturation,
 *  luminance,
 *  hue
 * }
 *
 * @property settings
 * @type Object
 */

Object.defineProperty(Hypotrochoid.prototype, "settings", {
 get: function()
 {
  return {
   r: this.r,
   R: this.R,
   d: this.d,
   iterations: this.iterations,
   rotation: this.rotationSpeed,
   origin: this.origin,
   opacity: this.opacity,
   lineWidth: this.lineWidth,
   colourRoll: this.colourRoll,
   saturation: this.saturation,
   luminance: this.luminance,
   hue: this.hue
  };
 },
 set: function(options)
 {
  if(options !== undefined)
  {
   if(options.r !== undefined) { this.r = options.r; }
   if(options.R !== undefined) { this.R = options.R; }
   if(options.d !== undefined) { this.d = options.d; }
   if(options.iterations !== undefined) { this.iterations = options.iterations; }
   if(options.rotation !== undefined) { this.rotationSpeed = options.rotation; }
   if(options.origin !== undefined) { this.origin = options.origin; }
   if(options.opacity !== undefined) { this.opacity = options.opacity; }
   if(options.lineWidth !== undefined) { this.lineWidth = options.lineWidth; }
   if(options.colourRoll !== undefined) { this.colourRoll = options.colourRoll; }
   if(options.saturation !== undefined) { this.saturation = options.saturation; }
   if(options.luminance !== undefined) { this.luminance = options.luminance; }
   if(options.hue !== undefined) { this.hue = options.hue; }
  }
 }
});

/**
 * Updates hue and rotation.
 *
 * @method update
 */

Hypotrochoid.prototype.update = function()
{
 if(this.colourRoll)
 {
  this.hue -= 0.5;
  if(this.hue <= -360.0) { this.hue += 360.0; }
 }

 if(!equal(this.rotationSpeed, 0.0))
 {
  this.rotation -= this.rotationSpeed;
  if(Math.abs(this.rotation) >= this.TWO_PI) { this.rotation -= this.TWO_PI; }
 }
};

/**
 * Draws the hypotrochoid onto the given 2D-context.
 * This function does not clear the canvas.
 *
 * @method draw
 * @param {CanvasRenderingContext2D} ctx - The surface to draw on.
 */

Hypotrochoid.prototype.draw = function(ctx)
{
 var i, q, x = 0.0, y = 0.0, bypass = true;

 ctx.save();

 ctx.lineWidth = this.lineWidth;
 ctx.lineCap = "round";
 ctx.globalCompositeOperation = "source-over";

 this.theta = 0.0;
 this.prevCoord.x = 0.0;
 i = this.iterations;

 ctx.beginPath();

 while(i >= 0 && (bypass || !equal(this.firstCoord.x, x) || !equal(this.firstCoord.y, y)))
 {
  if(bypass) { bypass = false; }
  this.theta += this.step;

  q = (this.r / this.R - 1.0) * this.theta; 
  x = (this.r - this.R) * Math.cos(this.theta) + this.d * Math.cos(q + this.rotation) + this.origin.x + (this.R - this.r);
  y = (this.r - this.R) * Math.sin(this.theta) - this.d * Math.sin(q + this.rotation) + this.origin.y;

  if(this.prevCoord.x)
  {
   ctx.moveTo(this.prevCoord.x, this.prevCoord.y);
   ctx.lineTo(x, y);
  }
  else
  {
   this.firstCoord.x = x;
   this.firstCoord.y = y;
   bypass = true;
  }

  this.prevCoord.x = x;
  this.prevCoord.y = y;
  --i;
 }

 ctx.strokeStyle = "hsla(" + this.hue + ", " + this.saturation + "%, " + this.luminance + "%, " + this.opacity + ")";
 ctx.stroke();

 ctx.restore();
};

},{}]},{},[2])(2)
});