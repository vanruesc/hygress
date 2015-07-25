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
 * @param {number} [options.opacity] - The opacity. Default: 0.75.
 * @param {number} [options.lineWidth] - The line width. Default: 0.5.
 * @param {boolean} [options.colourRoll] - The line width. Default: true.
 */

function Hypotrochoid(options)
{
 this.TWO_PI = Math.PI * 2;
 this.rotation = 0.0;
 this.theta = 0.0;
 this.step = 360.0 * Math.PI / 180.0;
 this.hue = 0.0;
 this.firstCoord = {x: 0.0, y: 0.0};
 this.prevCoord = {x: 0.0, y: 0.0}; // Not to be confused with "pervCoord".

 // Set the defaults.
 this.r = 0.42;
 this.R = 0.86;
 this.d = 0.0;
 this.iterations = 64;
 this.rotationSpeed = 0.01;
 this.origin = {x: 0.0, y: 0.0};
 this.opacity = 0.75;
 this.lineWidth = 0.5;
 this.colourRoll = true;

 this.setting = options;
 this.rInv = 1.0 / this.r;
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
 * @param {number} [options.opacity] - The opacity. Default: 0.75.
 * @param {number} [options.lineWidth] - The line width. Default: 0.5.
 * @param {boolean} [options.colourRoll] - The line width. Default: true.
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
   colourRoll: this.colourRoll
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
  }
 }
});

/**
 * Updates hue and rotation.
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

 while(i >= 0 && (bypass || !equal(this.firstCoord.x, x) || !equal(this.firstCoord.y, y)))
 {
  ctx.beginPath();

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

  ctx.strokeStyle = "hsla(" + (this.hue % 360) + ", 100%, 50%, " + this.opacity + ")";
  ctx.stroke();

  this.prevCoord.x = x;
  this.prevCoord.y = y;
  --i;
 }

 ctx.restore();
};

module.exports = Hypotrochoid;
