"use strict";

var Hypotrochoid = require("./hypotrochoid");

/**
 * Hygress.
 * A hy(potrochoid pro)gress visualisation.
 *
 * @constructor
 * @param {Object} [options] - The settings.
 * @param {number} [options.dt] - A delta time constant.
 * @param {number} [options.htOptions] - The hypotrochoid settings.
 * @param {number} [options.size] - The canvas size.
 */

function Hygress(options)
{
 var htOptions, canvas;

 this.animId = 0;
 this.dt = 1.0 / 60.0;
 this.now = Date.now();
 this.then = this.now;
 this.accumulator = 0;

 canvas = document.createElement("canvas");
 canvas.id = "hygress";

 if(options !== undefined)
 {
  if(options.htOptions !== undefined) { htOptions = options.htOptions; }
  if(options.dt !== undefined) { this.dt = options.dt; }

  if(options.size !== undefined)
  {
   canvas.width = options.size[0];
   canvas.height = options.size[1];
  }
 }

 this.ctx = canvas.getContext("2d");
 this.ht = new Hypotrochoid(htOptions);
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

  if(s !== undefined)
  {
   min = (s[0] < s[1]) ? s[0] : s[1];
   this.ctx.canvas.width = s[0];
   this.ctx.canvas.height = s[1];
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
 this.accumulator += ( this.now -  this.then);
 this.then =  this.now;

 if(this.accumulator >= this.dt)
 {
  this.ht.update();
  this.accumulator -= this.dt;
 }

 this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
 this.ht.draw(this.ctx);

 this.animId = requestAnimationFrame(this.render);
};

/**
 * Stops the module.
 */

Hygress.prototype.stop = function()
{
 if(this.animId !== 0)
 {
  cancelAnimationFrame(this.animId);
  this.ctx.canvas.style.opacity = 0.0;
  this.ctx.canvas.style.transform = "scale(0.0)";
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
  this.ctx.canvas.style.opacity = 1.0;
  this.ctx.canvas.style.transform = "scale(1.0)";
  this.render();
 }
};

module.exports = Hygress;
