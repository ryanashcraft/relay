var It = function(parent, name, op, befores, afters) {
	this.parent = parent;
	this.name = name;
	this.op = op;
	this.children = [];
	this.expects = [];
	this.id = itCount++;

	if (befores)
		this.befores = befores;
	else
		this.befores = [];

	if (afters)
		this.afters = afters;
	else
		this.afters = [];
}

It.prototype.toString = function() {
	return this.name;
}

It.prototype.perform = function(callback) {
	var self = this;

	function runBefores() {
		if (self.befores) {
			loop(0, self.befores.length, function(i, next) {
				enter(self.befores[i], next);
			}, runMain);
		} else {
			runMain();
		}
	}

	function runMain() {
		self.op();

		loop(0, self.children.length, function(i, next) {
			enter(self.children[i], next);
		}, runExpects);
	}

	function runExpects() {
		loop(0, self.expects.length, function(i, next) {
			enter(self.expects[i], next);
		}, runAfters);
	}

	function runAfters() {
		if (self.afters) {
			loop(0, self.afters.length, function(i, next) {
				enter(self.afters[i], next);
			}, callback);
		} else {
			callback();
		}
	}

	runBefores();
}