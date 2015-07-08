"use strict";

var Hypotrochoid = require("./hypotrochoid");

/**
 * Hygress.
 * A hy(potrochoid pro)gress visualisation.
 *
 * @constructor
 * @param {Object} [options] - The settings.
 * @param {number} [options.dt] - A delta time constant.
 * @param {number} [options.htSettings] - The hypotrochoid settings.
 * @param {boolean} [options.clearCanvas] - Whether the canvas should be cleared when rendering. Default is true.
 * @param {number} [options.size] - The canvas size.
 */

function Hygress(options)
{
 var self = this;

 this.clear = true;
 this.dt = 1.0 / 60.0;
 this.now = Date.now() / 1000;
 this.then = this.now;
 this.accumulator = 0;

 this.ctx = document.createElement("canvas").getContext("2d");
 this.ctx.canvas.id = "hygress";
 this.ht = new Hypotrochoid();

 if(options !== undefined)
 {
  if(options.dt !== undefined) { this.dt = options.dt; }
  if(options.clearCanvas !== undefined) { this.clear = options.clearCanvas; }
  this.ht.settings = options.htSettings;
  this.size = options.size;
 }

 /**
  * Expose the internal render function.
  */

 this.render = function() { self._render(); };
}

/**
 * Getter for the internal canvas.
 */

Object.defineProperty(Hygress.prototype, "clearCanvas", {
 get: function() { return this.clear; },
 set: function(c) { this.clear = c; }
});

/**
 * Getter for the internal canvas.
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
   this.ht.distance = min * 0.4;
   this.ht.origin.x = this.ht.origin.y = min >> 1;
  }
 }
});

/**
 * Renders the progress.
 */

Hygress.prototype._render = function()
{
 this.now = Date.now() / 1000;
 this.accumulator += (this.now - this.then);
 this.then = this.now;

 if(this.accumulator >= this.dt)
 {
  this.ht.update();
  this.accumulator -= this.dt;
 }

 if(this.clear)
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
