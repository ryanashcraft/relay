var Run = function(parent, op, befores, afters, timeout) {
	this.parent = parent;
	this.op = op;
	this.expects = [];
	this.timeout = timeout;
	this.ran = false;

	if (befores)
		this.befores = befores;

	if (afters)
		this.afters = afters;
}

Run.prototype.toString = function() {
	return "[run]";
}

Run.prototype.perform = function(callback) {
	var self = this;

	var runTimeout;
	if (self.timeout) {
		runTimeout = setTimeout(function() {
			self.ran = true;
			loop(0, self.expects.length, function(i, next) {
				enter(self.expects[i], next);
			}, callback);
		}, self.timeout);
	}

	this.op(function() {
		if (!self.ran) {
			if (runTimeout) {
				clearTimeout(runTimeout);
			}

			loop(0, self.expects.length, function(i, next) {
				enter(self.expects[i], next);
			}, callback);
		}
	});
}