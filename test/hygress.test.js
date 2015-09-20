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

		function render() {

			hygress.render();
			setTimeout(render, hygress.dt);

		}

		before(function() {

			hygress = new Hygress({
				hypotrochoid: Hygress.Hypotrochoid.NEGATIVE,
				scale: 0.5
			});

		});

		it("renders without errors", function() {

      document.getElementById("mocha").appendChild(hygress.canvas);
			render();

		});

		it("transitions correctly", function() {

      hygress.transitionTime = 5.0;
      //hygress.scale = 0.0;
      hygress.opacity = 0.0;

		});

	});

});
