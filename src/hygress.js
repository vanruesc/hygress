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
 * @param {number} [options.size] - The canvas size.
 */

function Hygress(options)
{
 var self = this;

 this.animId = 0;
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
  this.ht.settings = options.htSettings;
  this.size = options.size;
 }

 /**
  * The internal animation loop.
  */

 this._render = function() { self.render(); };
}

/**
 * Getter for the internal canvas.
 */

Object.defineProperty(Hygress.prototype, "canvas", {
 get: function() { return this.ctx.canvas; }
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

Hygress.prototype.render = function()
{
 this.now = Date.now() / 1000;
 this.accumulator += (this.now - this.then);
 this.then = this.now;

 if(this.accumulator >= this.dt)
 {
  this.ht.update();
  this.accumulator -= this.dt;
 }

 this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
 this.ht.draw(this.ctx);
 this.animId = requestAnimationFrame(this._render);
};

/**
 * Stops the module.
 */

Hygress.prototype.stop = function()
{
 if(this.animId !== 0)
 {
  cancelAnimationFrame(this.animId);
  this.animId = 0;
 }
};

/**
 * Starts the module.
 *
 * @param {} - .
 */

Hygress.prototype.start = function()
{
 if(this.animId === 0)
 {
  this.render();
 }
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
