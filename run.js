var Run = function(parent, op, befores, afters) {
	this.parent = parent;
	this.op = op;
	this.expects = [];

	if (befores)
		this.befores = befores;

	if (afters)
		this.afters = afters;
};

Run.prototype.perform = function(callback) {
	var self = this;

	self.op(function() {
		loop(0, self.expects.length, function(i, next) {
			enter(self.expects[i], next);
		}, function() {
			callback();
		});
	});
};