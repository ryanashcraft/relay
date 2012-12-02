describe("A URL", function() {
	describe("with http", function() {
		it("should be able to extract the domain", function() {
			var url = "";

			runs(function(done) {
				setTimeout(function() {
					url = 'www.google.com';
					done();
				}, 500);
			});

			runs(function(done) {
				expect(url).toMatch('www.google.com');
				done();
			});
		});
		it("should be able to extract the domain", function() {
			runs(function(done) {
				setTimeout(function() {
					url = 'www.google.com';
					done();
				}, 100);
			});

			runs(function(done) {
				expect('www.google.com').toMatch('www.gogle.com');
				done();
			});
		});
	});
});