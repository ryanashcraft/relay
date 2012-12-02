describe("A URL", function() {
	describe("with http", function() {
		it("should be able to extract the domain", function() {
			expect(getDomain('http://www.google.com')).toMatch('www.google.com');
			expect(getDomain('http://www.google.com/')).toMatch('www.google.com');
			expect(getDomain('http://www.google.com/kitty')).toMatch('www.google.com');
		});

		it("should be able to extract the hostname", function() {
			expect(getDomain('http://www.google.com')).toMatch('google.com');
			expect(getDomain('http://www.google.com/')).toMatch('google.com');
			expect(getDomain('http://www.google.com/kitty')).toMatch('google.com');
		});
	});

	describe("with https", function() {
		it("should be able to extract the domain", function() {
			expect(getDomain('https://www.google.com')).toMatch('www.google.com');
			expect(getDomain('https://www.google.com/')).toMatch('www.google.com');
			expect(getDomain('https://www.google.com/kitty')).toMatch('www.google.com');
		});
		it("should be able to extract the hostname", function() {
			expect(getDomain('https://www.google.com')).toMatch('google.com');
			expect(getDomain('https://www.google.com/')).toMatch('google.com');
			expect(getDomain('https://www.google.com/kitty')).toMatch('google.com');
		});
	});

	describe("that is a chrome URL", function() {
		it("should be detected with no subdirectories", function() {
			expect(isChromeURL("chrome://newtabpage"));
		});

		it("should be detected with subdirectories", function() {
			expect(isChromeURL("chrome://newtabpage/kitty/meow"));
			expect(isChromeURL("chrome://newtabpage/kitty/meow/"));
		});
	});
});

describe("A loop", function() {
	var answer;

	beforeEach(function(done) {
		answer = null;
		done();
	});

	it("should repeat the right number of times", function() {
		runs(function(done) {
			answer = 0;

			loop(0, 5, function(i, next) {
				answer += i;

				next();
			}, done);
		});

		runs(function(done) {
			expect(answer).toBe(10);
			done();
		});
	});

	it("should not run when the end is less than the iteration", function() {
		runs(function(done) {
			answer = 0;

			loop(5, -1, function(i, next) {
				answer += i;

				next();
			}, done);
		});

		runs(function(done) {
			expect(answer).toBe(0);
			done();
		});
	});
});

describe("An asynchronous loop", function() {
	var answer;

	beforeEach(function(done) {
		answer = null;
		done();
	});

	describe("when the end is greater than the start", function() {
		it("should repeat the right number of times", function() {
			runs(function(done) {
				answer = 0;

				async_loop(0, 5, function(iteration, callback) {
					answer += iteration;

					callback();
				}, done);
			});

			runs(function(done) {
				expect(answer).toBe(10);
				done();
			});
		});
	});

	describe("when the end is one more than the start", function() {
		it("should repeat the right number of times", function() {
			runs(function(done) {
				answer = 1;

				async_loop(0, 1, function(iteration, callback) {
					answer += iteration;

					callback();
				}, done);
			});

			runs(function(done) {
				expect(answer).toBe(1);
				done();
			});
		});
	});

	describe("when the end is less than the start", function() {
		it("should not run", function() {
			runs(function(done) {
				answer = 0;

				async_loop(5, -1, function(iteration, callback) {
					answer += iteration;

					callback();
				}, done);
			});

			runs(function(done) {
				expect(answer).toBe(0);
				done();
			});
		});
	});

	describe("when running asynchronous operations", function() {
		it("should run them in any order", function() {
			runs(function(done) {
				answer = [];

				async_loop(0, 5, function(iteration, callback) {
					setTimeout(function() {
						answer.push(iteration);

						callback();
					}, 500 - iteration * 100);
				}, done);
			});

			runs(function(done) {
				expect(answer).toEqual([4, 3, 2, 1, 0]);
				done();
			});
		});

		it("should wait for the asynchronous operations to finish", function() {
			runs(function(done) {
				answer = [];

				async_loop(0, 5, function(iteration, callback) {
					setTimeout(function() {
						answer.push(iteration);

						callback();
					}, 1000);
				}, done);
			});

			runs(function(done) {
				expect(answer).toEqual([0, 1, 2, 3, 4]);
				done();
			});
		});
	});
});

describe("An array", function() {
	var arr = [];

	beforeEach(function(done) {
		arr = [100, 200, 300, 400];
		done();
	});

	describe("should remove", function() {
		it("an element in the array", function() {
			var removed = arr.removeElementEqualTo(300);

			expect(removed).toEqual(300);
			expect(arr).toEqual([100, 200, 400]);
		});

		it("an element not in the array", function() {
			var removed = arr.removeElementEqualTo(800);

			expect(removed).toBeUndefined();
			expect(arr).toEqual([100, 200, 300, 400]);
		});
	});

	describe("should remove the element at the index", function() {
		it("in the array", function() {
			var removed = arr.removeAtIndex(0);

			expect(removed).toEqual(100);
			expect(arr).toEqual([200, 300, 400]);
		});

		it("outside of the array (pos)", function() {
			var removed = arr.removeAtIndex(800);

			expect(removed).toBeUndefined();
			expect(arr).toEqual([100, 200, 300, 400]);
		});
	});

	it("should insert an element at an arbitrary index", function() {
		arr.insertAtIndex(0, 3);

		expect(arr).toEqual([100, 200, 300, 0, 400]);
	});

	it("should swap elements", function() {
		var removed = arr.removeAtIndex(-1);
		arr.insertAtIndex(removed, 2);

		expect(removed).toEqual(400);
		expect(arr).toEqual([100, 200, 400, 300]);
	});
});