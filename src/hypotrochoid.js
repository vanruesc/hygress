"use strict";

/**
 * Checks if two float values are (almost) equal.
 *
 * @param {number} a - Value a.
 * @param {number} b - Value b.
 */

function equal(a, b)
{
 return Math.abs(a - b) <= 0.0001;
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
 * @param {number} [options.iterations] - Limits the processing of too detailed hypotrochoids. Default: no limit.
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

 this.innerRadius = 0.2;
 this.outerRadius = 0.59;
 this.distance = 0.0;
 this.iterations = 16;
 this.rotationSpeed = 0.046;
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
 if(this.hue <= -360.0) { this.hue = 0.0; }
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

 while(i >= 0 && (ignore || !equal(this.firstCoord.x - x) || !equal(this.firstCoord.y - y)))
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

/**
 * Predefined hypotrochoids.
 */

Hypotrochoid.Settings = Object.freeze({
 PENTAGRAM: {
  r: 3.0,
  R: 5.0,
  d: 5.0,
  iterations: 5,
  rotation: 0.02,
  origin: {x: 0.0, y: 0.0}
 }
});

module.exports = Hypotrochoid;
