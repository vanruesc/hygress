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
