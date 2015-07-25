"use strict";

var Hypotrochoid = require("./hypotrochoid");

/**
 * Hygress.
 * A hy(potrochoid pro)gress visualisation.
 *
 * @constructor
 * @param {Object} [options] - The settings.
 * @param {number} [options.dt] - A delta time constant.
 * @param {Object} [options.hypotrochoid] - The hypotrochoid settings.
 * @param {HTMLCanvasElement} [options.canvas] - The canvas to use. A new one will be created if none is supplied.
 * @param {boolean} [options.clearCanvas] - Whether the canvas should be cleared before rendering. Default is true.
 * @param {boolean} [options.colourRoll] - Whether the colour should iterate over the colour spectrum. Default is true.
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

 this.transitionTime = 0.2;
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
  elapsed: 0,
  transitionActive: false
 };

 this.size = this.size;

 if(options !== undefined)
 {
  if(options.dt !== undefined) { this.dt = options.dt; }
  if(options.clearCanvas !== undefined) { this.clearCanvas = options.clearCanvas; }
  if(options.colourRoll !== undefined) { this.ht.colourRoll = options.colourRoll; }
  if(options.canvas !== undefined) { this.canvas = options.canvas; }
  this.ht.settings = options.hypotrochoid;
  this.size = options.size;
 }

 /**
  * Expose the internal render function.
  */

 this.render = function() { self._render(); };
}

/**
 * Getter and Setter for the internal hypotrochoid.
 */

Object.defineProperty(Hygress.prototype, "hypotrochoid", {
 get: function() { return this.ht.settings; },
 set: function(s)
 {
  this.ht.settings = s;
 }
});

/**
 * Getter and Setter for the internal canvas.
 */

Object.defineProperty(Hygress.prototype, "canvas", {
 get: function() { return this.ctx.canvas; },
 set: function(c)
 {
  if(c !== undefined && c.getContext !== undefined)
  {
   this.ctx = c.getContext("2d");
  }
 }
});

/**
 * Getter and Setter for the size of the internal canvas.
 * 
 * @param {Array} s - The new size in the form of [width, height].
 */

Object.defineProperty(Hygress.prototype, "size", {
 get: function()
 {
  return [
   this.ctx.canvas.width,
   this.ctx.canvas.height
  ];
 },
 set: function(s)
 {
  var min;

  if(s !== undefined && s.length === 2)
  {
   min = (s[0] < s[1]) ? s[0] : s[1];
   this.ctx.canvas.width = min;
   this.ctx.canvas.height = min;
   this.htSize = min >> 1;
   this.ht.origin.x = this.ht.origin.y = this.ht.d;
  }
 }
});

/**
 * Getter and Setter for the hypotrochoid's size.
 *
 * @param {number} o - [x, y].
 */

Object.defineProperty(Hygress.prototype, "htSize", {
 get: function() { return this.ht.d; },
 set: function(d)
 {
  if(d !== undefined && typeof d === "number" && !isNaN(d))
  {
   this.ht.d = d;
   this._scale.max = this._scale.target = this.ht.d;
  }
 }
});

/**
 * Getter and Setter for the hypotrochoid's origin.
 *
 * @param {Array} o - The new origin in the form of [x, y].
 */

Object.defineProperty(Hygress.prototype, "origin", {
 get: function() { return this.ht.origin; },
 set: function(o)
 {
  if(o !== undefined && o.length === 2)
  {
   if(o[0] >= 0 && o[0] <= this.size[0]) { this.ht.origin.x = o[0]; }
   if(o[1] >= 0 && o[1] <= this.size[1]) { this.ht.origin.y = o[1]; }
  }
 }
});

/**
 * Getter and Setter for the hypotrochoid's colour roll flag.
 *
 * @param {boolean} c - Whether the colour should iterate over the colour spectrum.
 */

Object.defineProperty(Hygress.prototype, "colourRoll", {
 get: function() { return this.ht.colourRoll; },
 set: function(c)
 {
  if(c !== undefined && typeof c === "boolean")
  {
   this.ht.colourRoll = c;
  }
 }
});

/**
 * Getter and Setter for the opacity of the hypotrochoid.
 *
 * Setting the opacity to a new value triggers a gradual change
 * towards the target value. The transition is linear and 
 * depends on the transitionTime variable.
 */

Object.defineProperty(Hygress.prototype, "opacity", {
 get: function() { return this.ht.opacity; },
 set: function(o)
 {
  if(o !== undefined && typeof o === "number" && !isNaN(o))
  {
   if(o < 0.0) { o = 0.0; }
   if(o > 1.0) { o = 1.0; }

   this._opacity.start = this.ht.opacity;
   this._opacity.target = o;
   this._opacity.difference = this.ht.opacity - this._opacity.target;
   this._opacity.elapsed = 0;
   this._opacity.transitionActive = true;
  }
 }
});

/**
 * Getter and Setter for the scale of the hypotrochoid.
 *
 * Setting the scale to a new value triggers a gradual change
 * towards the target value. The transition is linear and 
 * depends on the transitionTime variable.
 */

Object.defineProperty(Hygress.prototype, "scale", {
 get: function() { return this.ht.d; },
 set: function(d)
 {
  if(d !== undefined && typeof d === "number" && !isNaN(d))
  {
   if(d < 0.0) { d = 0.0; }
   if(d > 1.0) { d = 1.0; }

   this._scale.start = this.ht.d;
   this._scale.target = d * this._scale.max;
   this._scale.difference = this.ht.d - this._scale.target;
   this._scale.elapsed = 0;
   this._scale.transitionActive = true;
  }
 }
});

/**
 * Getter and Setter for the line width of the hypotrochoid.
 */

Object.defineProperty(Hygress.prototype, "lineWidth", {
 get: function() { return this.ht.lineWidth; },
 set: function(l)
 {
  if(l !== undefined && typeof l === "number" && !isNaN(l))
  {
   this.ht.lineWidth = l;
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
  if(this.ht.opacity === opacity.target) { opacity.transitionActive = false; }
 }

 if(scale.transitionActive)
 {
  percentage = scale.elapsed / this.transitionTime;
  if(percentage > 1.0) { percentage = 1.0; }
  this.ht.d = scale.start - percentage * scale.difference;
  scale.elapsed += elapsed;
  if(this.ht.d === scale.target) { scale.transitionActive = false; }
 }

 this.ht.update();
 this.accumulator -= this.dt;
};

/**
 * Renders the progress.
 */

Hygress.prototype._render = function()
{
 var elapsed;

 this.now = Date.now() / 1000;
 elapsed = this.now - this.then;
 this.accumulator += elapsed;
 this.then = this.now;

 if(this.accumulator >= this.dt)
 {
  this._update(elapsed);
 }

 if(this.clearCanvas)
 {
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
 }

 this.ht.draw(this.ctx);
};

/**
 * Predefined hypotrochoids.
 */

Hygress.Hypotrochoid = Object.freeze({
 PENTAGRAM: {
  r: 3.0,
  R: 5.0,
  iterations: 5,
  rotation: 0.03
 },
 ZAYESH: {
  r: 0.2,
  R: 0.59,
  iterations: 16,
  rotation: 0.046
 }
});

module.exports = Hygress;
