/**
 * hygress build 08-07-2015
 *
 * Copyright 2015 Raoul van Rueschen
 * 
 * This software is provided "as-is", without any express or implied warranty. 
 * In no event will the authors be held liable for any damages arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose, 
 * including commercial applications, and to alter it and redistribute it freely, 
 * subject to the following restrictions:
 * 
 * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. 
 * If you use this software in a product, an acknowledgment in the product documentation would be appreciated but is not required.
 * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
 * This notice may not be removed or altered from any source distribution.
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Hygress = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./hypotrochoid":2}],2:[function(require,module,exports){
"use strict";

var EPSILON = 0.0001;

/**
 * Checks if two float values are (almost) equal.
 *
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
 * => http://en.wikipedia.org/wiki/Hypotrochoid
 *
 * @constructor
 * @param {Object} options - The settings.
 * @param {number} [options.R] - Radius of the outer circle.
 * @param {number} [options.r] - Radius of the inner circle.
 * @param {number} [options.d] - Distance from the center to the inner circle.
 * @param {{x: number, y: number}} [options.origin] - Object with x and y components, representing the origin coordinates.
 * @param {number} [options.rotation] - Sets the rotational direction and speed. (Negative for left rotation, 0.0 for no rotation.)
 * @param {number} [options.iterations] - Limits the processing of very detailed hypotrochoids. Default: 64.
 */

function Hypotrochoid(options)
{
 this.TWO_PI = Math.PI * 2;
 this.rotation = 0.0;
 this.theta = 0.0;
 this.step = 360.0 * Math.PI / 180.0;
 this.hue = 0.0;
 this.firstCoord = {x: 0.0, y: 0.0};
 this.prevCoord = {x: 0.0, y: 0.0};

 this.innerRadius = 0.42;
 this.outerRadius = 0.86;
 this.distance = 0.0;
 this.iterations = 64;
 this.rotationSpeed = 0.01;
 this.origin = {x: 0.0, y: 0.0};

 if(options !== undefined)
 {
  if(options.r !== undefined) { this.innerRadius = options.r; }
  if(options.R !== undefined) { this.outerRadius = options.R; }
  if(options.d !== undefined) { this.distance = options.d; }
  if(options.iterations !== undefined) { this.iterations = options.iterations; }
  if(options.rotation !== undefined) { this.rotationSpeed = options.rotation; }
  if(options.origin !== undefined) { this.origin = options.origin; }
 }

 this.invInnerRadius = 1.0 / this.innerRadius;
}

/**
 * Getter and Setter for all parameters.
 * 
 * @param {Object} options - The new settings.
 * @param {number} [options.R] - Radius of the outer circle.
 * @param {number} [options.r] - Radius of the inner circle.
 * @param {number} [options.d] - Distance from the center to the inner circle.
 * @param {{x: number, y: number}} [options.origin] - Object with x and y components, representing the origin coordinates.
 * @param {number} [options.rotation] - Sets the rotational direction and speed. (Negative for left rotation, 0.0 for no rotation.)
 * @param {number} [options.iterations] - Limits the processing of too detailed hypotrochoids. Default: no limit.
 */

Object.defineProperty(Hypotrochoid.prototype, "settings", {
 get: function()
 {
  return {
   r: this.innerRadius,
   R: this.outerRadius,
   d: this.distance,
   iterations: this.iterations,
   rotation: this.rotationSpeed,
   origin: this.origin
  };
 },
 set: function(options)
 {
  if(options !== undefined)
  {
   if(options.r !== undefined) { this.innerRadius = options.r; }
   if(options.R !== undefined) { this.outerRadius = options.R; }
   if(options.d !== undefined) { this.distance = options.d; }
   if(options.iterations !== undefined) { this.iterations = options.iterations; }
   if(options.rotation !== undefined) { this.rotationSpeed = options.rotation; }
   if(options.origin !== undefined) { this.origin = options.origin; }
  }
 }
});

/**
 * Updates hue and rotation.
 */

Hypotrochoid.prototype.update = function()
{
 this.hue -= 0.5;
 if(this.hue <= -360.0) { this.hue += 360.0; }
 this.rotation -= this.rotationSpeed;
 if(Math.abs(this.rotation) > this.TWO_PI) { this.rotation -= this.TWO_PI; }
};

/**
 * Draws the hypotrochoid onto the given 2D-context.
 * This function does not clear the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx
 */

Hypotrochoid.prototype.draw = function(ctx)
{
 var i, q, x = 0.0, y = 0.0, ignore = true;

 ctx.save();

 ctx.lineWidth = 0.5;
 ctx.lineCap = "round";
 ctx.globalCompositeOperation = "source-over";

 this.theta = 0.0;
 this.prevCoord.x = 0.0;
 i = this.iterations;

 while(i >= 0 && (ignore || !equal(this.firstCoord.x, x) || !equal(this.firstCoord.y, y)))
 {
  ctx.beginPath();

  if(ignore) { ignore = false; }
  this.theta += this.step;

  q = (this.innerRadius / this.outerRadius - 1.0) * this.theta; 
  x = (this.innerRadius - this.outerRadius) * Math.cos(this.theta) + this.distance * Math.cos(q + this.rotation) + (this.origin.x) + (this.outerRadius - this.innerRadius);
  y = (this.innerRadius - this.outerRadius) * Math.sin(this.theta) - this.distance * Math.sin(q + this.rotation) + (this.origin.y);

  if(this.prevCoord.x)
  {
   ctx.moveTo(this.prevCoord.x, this.prevCoord.y);
   ctx.lineTo(x, y);
  }
  else
  {
   this.firstCoord.x = x;
   this.firstCoord.y = y;
   ignore = true;
  }

  ctx.strokeStyle = "hsla(" + (this.hue % 360) + ", 100%, 50%, 0.75)";
  ctx.stroke();

  this.prevCoord.x = x;
  this.prevCoord.y = y;
  --i;
 }

 ctx.restore();
};

module.exports = Hypotrochoid;

},{}]},{},[1])(1)
});