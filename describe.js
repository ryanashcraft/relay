var Describe = function(parent, name, op, befores, afters) {
	this.parent = parent;
	this.name = name;
	this.op = op;
	this.children = [];
	this.id = describeCount++;

	if (befores)
		this.befores = befores;
	else
		this.befores = [];

	if (afters)
		this.afters = afters;
	else
		this.afters = [];
}

Describe.prototype.toString = function() {
	return this.name;
}

Describe.prototype.perform = function(callback) {
	var self = this;
	this.op();

	loop(0, this.children.length, function(i, next) {
		enter(self.children[i], next);
	}, callback);
}