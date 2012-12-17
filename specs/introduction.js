describe("A suite", function() {
	it("contains specs with expectations", function() {
		expect(true).toBe(true);
	});
});

describe("A empty string", function() {  
	var s = "";

	it("should have length 0", function() {
		expect(s.length).toBe(0);
	});

	it("after concatenating with another string should equal the other string", function() {
		var another = "foo";
		expect((s + another).length).toBe(another.length)
		expect(s + another).toEqual(another);
	});
});

describe("An expect", function() {
	it("should be successful with just a boolean value", function() {
		expect(true);
	});

	it("should be successful with `toBeUndefined`", function() {
		var i;
		expect(i).toBeUndefined();
	});

	it("should be successful with `toBeNull`", function() {
		var i = null;
		expect(i).toBeNull();
	});

	it("should be successful when matching a string with a regular expression with `toMatch`", function() {
		var a = "555.555.5555";
		var b = "^[0-9]+\.[0-9]+\.[0-9]+$";
		expect(a).toMatch(b);
	});

	it("should be successful when comparing two variables of the same reference with `toBe`", function() {
		var i = 0;
		var j = i;
		expect(i).toBe(j);
	});

	it("should be successful when comparing two multi-level objects with `toEqual`", function() {
		var a = {
			url: "http://ryanashcraft.me/",
			name: "Ryan Ashcraft",
			favoriteColor: {
				red: 4,
				green: 99,
				blue: 249
			}
		};
		var b = {
			name: "Ryan Ashcraft",
			url: "http://ryanashcraft.me/",
			favoriteColor: {
				red: 4,
				green: 99,
				blue: 249
			}
		};
		expect(a).toEqual(b);
	});
});

describe("A timeout", function() {  
	it("should be called when the time has elapsed", function() {
		var timeoutCalled = false;
		var timeoutDuration = 500;

		// setTimeout is asynchronous, so it must be placed inside a runs block. When the
		// asynchronous part has finished, it must call the done callback for Relay to
		// continue.
		runs(function(done) {
			setTimeout(function() {
				timeoutCalled = true;
				done();
			}, timeoutDuration);
		});

		// Since this expectation is required to be called after the previous runs finishes,
		// it must also be encapsulated in a runs block and must call the done callback for
		// Relay to continue.
		runs(function(done) {
			expect(timeoutCalled);
			done();
		});
	});
});

describe("A number", function() {
	var i;

	it("has a default value of undefined", function() {
		expect(i).toBeUndefined();
	});

	describe("set to 0", function() {
		// We need to reset i to 0 for each it block, and the easiest way to do that is with
		// a beforeEach. The done callback must be called for Relay to continue.
		beforeEach(function(done) {
			i = 0;
			done();
		});

		it("when incremented should be one", function() {
			i++;
			expect(i).toBe(1);
		});

		it("when deccremented should be negativeone", function() {
			i--;
			expect(i).toBe(-1);
		});
	});
});