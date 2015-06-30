"use strict";

/**
 * Jasmine specs.
 */

var Hygress = require("../src/hygress");

describe("Hygress", function()
{
 var hygress;

 it("should be a constructor function", function()
 {
  expect(typeof Hygress).toBe("function");
  hygress = new Hygress();
  expect(typeof hygress).toBe("object");
 });

 it("should have a canvas", function()
 {
  expect(typeof hygress.canvas).toBe("object");
 });

 it("should have a settable 2D size", function()
 {
  expect(hygress.size.length).toBe(2);
 });
});
