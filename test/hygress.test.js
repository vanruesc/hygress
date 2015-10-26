describe("Hygress", function() {

	describe("Sanity checks", function() {

		var hygress;

		it("is a constructor function", function() {

			assert(typeof Hygress === "function");

		});

		it("is instancable", function() {

			hygress = new Hygress();
			assert(typeof hygress === "object");

		});

		it("has a settable size", function() {

			assert(typeof hygress.size === "object");

		});

		it("has a canvas", function() {

			assert(typeof hygress.canvas === "object");

		});

	});

	describe("Functionality", function() {

		var hygress;

		before(function() {

			hygress = new Hygress({
				hypotrochoid: Hygress.Hypotrochoid.NEGATIVE,
				opacity: 1.0,
				scale: 1.0
			});

		});

		it("renders without errors", function() {

			hygress.render();

		});

		it("transitions the opacity correctly", function() {

			var opacity = hygress.opacity;

			hygress.transitionTime = 0.0;
			hygress.opacity = 0.0;
			hygress.update();
			assert(opacity !== hygress.opacity);

		});

		it("transitions the scale correctly", function() {

			var scale = hygress.scale;

			hygress.transitionTime = 0.0;
			hygress.scale = 0.0;
			hygress.update();
			assert(scale !== hygress.scale);

		});

	});

});
