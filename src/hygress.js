"use strict";

var Hypotrochoid = require("./hypotrochoid");

/**
 * Hygress.
 * A hy(potrochoid pro)gress visualisation.
 *
 * @constructor
 * @param {Object} [options] - The settings.
 * @param {number} [options.dt] - A delta time constant. Defaults to 1/60.
 * @param {Object} [options.hypotrochoid] - The hypotrochoid settings. If none is supplied, a random one will be created.
 * @param {HTMLCanvasElement} [options.canvas] - The canvas to use. A new one will be created if none is supplied.
 * @param {boolean} [options.clearCanvas] - Whether the canvas should be cleared before rendering. Default is true.
 * @param {boolean} [options.colourRoll] - Whether the colour should continuously change (rainbow). Default is true.
 * @param {number} [options.hue] - The hue in degree. If not specified, the hue is set to 0°.
 * @param {number} [options.saturation] - The saturation in percent. Defaults to 100%.
 * @param {number} [options.luminance] - The luminance in percent. Defaults to 50%.
 * @param {number} [options.opacity] - The initial opacity. Defaults to 0.75.
 * @param {number} [options.scale] - The initial scale. Defaults to 1.0.
 * @param {number} [options.transitionTime] - The initial transitionTime. Defaults to 0.25.
 * @param {Array} [options.size] - The canvas size.
 */

function Hygress(options)
{
 var self = this;

 this.clearCanvas = true;
 this.dt = 1.0 / 60.0;
 this.now = Date.now() / 1000;
 this.then = this.now;
 this.accumulator = 0;
 this.ctx = null;
 this.canvas = document.createElement("canvas");
 this.ht = new Hypotrochoid();

 this.transitionTime = 0.25;
 this._opacity = {
  start: 0.0,
  difference: 0.0,
  target: 0.75,
  elapsed: 0,
  transitionActive: false
 };
 this._scale = {
  start: 0.0,
  difference: 0.0,
  target: 0.0,
  max: 0.0,
  factor: 1.0,
  elapsed: 0,
  transitionActive: false
 };

 this.visible = true;
 this.size = this.size;

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

 this.visible = this.ht.opacity > 0.0 && this.ht.d > 0.0;

 /**
  * Expose the render function.
  */

 this.render = function() { self._step(); };
}

/**
 * Getter and Setter for the internal hypotrochoid.
 */

Object.defineProperty(Hygress.prototype, "hypotrochoid", {
 get: function() { return this.ht.settings; },
 set: function(x)
 {
  this.ht.settings = x;
 }
});

/**
 * Getter and Setter for the internal canvas.
 * 
 * @param {HTMLCanvasElement} x - The new canvas.
 */

Object.defineProperty(Hygress.prototype, "canvas", {
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
 * Getter and Setter for the size of the internal canvas.
 * 
 * @param {Array} x - The new size in the form of [width, height].
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

   this._scale.max = min >> 1;
   this._scale.target = this._scale.factor * this._scale.max;

   if(!this._scale.transitionActive)
   {
    this.ht.d = this._scale.target;
   }

   this.ht.origin.x = this.ht.origin.y = this._scale.max;
  }
 }
});

/**
 * Getter and Setter for the hypotrochoid's size.
 *
 * @param {number} x - The new size of the hypotrochoid.
 */

Object.defineProperty(Hygress.prototype, "htSize", {
 get: function() { return this.ht.d; },
 set: function(x)
 {
  if(x !== undefined && typeof x === "number" && !isNaN(x))
  {
   this.ht.d = this._scale.max = x;
  }
 }
});

/**
 * Getter and Setter for the hypotrochoid's origin.
 *
 * @param {Array} x - The new origin in the form of [x, y].
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
 * Getter and Setter for the hypotrochoid's colour roll flag.
 *
 * @param {boolean} x - Whether the colour should continuously change.
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
 * Getter and Setter for the hypotrochoid's hue.
 *
 * @param {number} x - The hue in degree.
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
 * Getter and Setter for the hypotrochoid's saturation.
 *
 * @param {number} x - The saturation in percent.
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
 * Getter and Setter for the hypotrochoid's luminance.
 *
 * @param {number} x - The luminance in percent.
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
 * Getter and Setter for the line width of the hypotrochoid.
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
 * Getter and Setter for the opacity of the hypotrochoid.
 *
 * Setting the opacity to a new value triggers a gradual change
 * towards the target value. The transition is linear and 
 * depends on the transitionTime variable.
 *
 * @param {number} x - The opacity [0.0, 1.0].
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
 * Getter and Setter for the scale of the hypotrochoid.
 *
 * Setting the scale to a new value triggers a gradual change
 * towards the target value. The transition is linear and 
 * depends on the transitionTime variable.
 *
 * @param {number} x - The scale [0.0, 1.0].
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
 * @param {number} elapsed - The elapsed time since the last frame.
 */

Hygress.prototype._update = function(elapsed)
{
 var opacity, scale, percentage;

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
    this._draw();
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
    this._draw();
    this.visible = false;
   }
  }
 }

 this.ht.update();
};

/**
 * Draws the hypotrochoid.
 */

Hygress.prototype._draw = function()
{
 if(this.clearCanvas)
 {
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
 }

 this.ht.draw(this.ctx);
};

/**
 * Updates and renders the hypotrochoid while taking
 * the elapsed time since the last frame into account.
 */

Hygress.prototype._step = function()
{
 var elapsed;

 this.now = Date.now() / 1000;
 elapsed = this.now - this.then;
 this.accumulator += elapsed;
 this.then = this.now;

 if(this.accumulator >= this.dt)
 {
  if(this.visible)
  {
   this._update(elapsed);
  }

  this.accumulator -= this.dt;
 }

 if(this.visible)
 {
  this._draw();
 }
};

/**
 * Predefined hypotrochoids.
 */

Hygress.Hypotrochoid = Object.freeze({
 PENTAGRAM: {r: 3.0, R: 5.0, iterations: 5, rotation: 0.03},
 MULTISTAR: {r: 0.675, R: 1.64, iterations: 34, rotation: 0.023},
 HYPNOTIZER: {r: 0.42, R: 0.86, iterations: 43, rotation: 0.01},
 NEGATIVE: {r: 0.35, R: 0.614, iterations: 100, rotation: 0.023},
 WINDMILL: {r: 0.7853, R: 1.3751, iterations: 64, rotation: 0.01},
 TRIPLET: {r: 1.671, R: 2.509, iterations: 160, rotation: 0.046},
 RING: {r: 3.9, R: 5.0, iterations: 50, rotation: 0.013}
});

module.exports = Hygress;
