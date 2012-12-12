var Run = function(parent, op, befores, afters, timeout) {
	this.parent = parent;
	this.op = op;
	this.expects = [];
	this.ran = false;

	if (timeout) {
		this.timeout = timeout;
	} else if (defaultTimeout) {
		this.timeout = defaultTimeout
	}

	if (befores)
		this.befores = befores;

	if (afters)
		this.afters = afters;
};

Run.prototype.perform = function(callback) {
	var self = this;

	var runTimeout;
	if (self.timeout) {
		runTimeout = setTimeout(function() {
			self.ran = true;

			loop(0, self.expects.length, function(i, next) {
				enter(self.expects[i], next);
			}, function() {
				self.reset();
				callback();
			});
		}, self.timeout);
	}

	self.op(function() {
		if (!self.ran) {
			if (runTimeout) {
				clearTimeout(runTimeout);
			}

			loop(0, self.expects.length, function(i, next) {
				enter(self.expects[i], next);
			}, function() {
				self.reset();
				callback();
			});
		} else {
			console.error("Warning: run block completed after timed out.");
		}

		// self.ran = true;
	});
};

Run.prototype.reset = function() {
	this.ran = false;
};