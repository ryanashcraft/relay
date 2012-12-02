var Describe = function(name, op, befores, afters) {
	this.name = name;
	this.op = op;
	this.children = [];

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
	return "[describe] " + this.name;
}

Describe.prototype.perform = function(callback) {
	var self = this;
	this.op();

	loop(0, this.children.length, function(i, next) {
		enter(self.children[i], next);
	}, callback);
}

var It = function(name, op, befores, afters) {
	this.name = name;
	this.op = op;
	this.children = [];

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
	return "[it] " + this.name;
}

It.prototype.perform = function(callback) {
	var self = this;
	this.op();

	loop(0, self.children.length, function(i, next) {
		enter(self.children[i], next);
	}, callback);
}

It.prototype.perform = function(callback) {
	var self = this;
	this.op();

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
		loop(0, self.children.length, function(i, next) {
			enter(self.children[i], next);
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

var Run = function(op, befores, afters) {
	this.op = op;
	this.expects = [];

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

	this.op(function() {
		loop(0, self.expects.length, function(i, next) {
			enter(self.expects[i], next);
		}, callback);
	});
}

var Expect = function(value) {
	this.success = false;
	this.value = value;
	this.other = null;
	this.type = "";

	if (value) {
		this.success = true;
	}
}

Expect.prototype.perform = function(callback) {
	callback();
}

Expect.prototype.toMatch = function(other) {
	this.other = other;
	this.success = (this.value == other);
	this.type = "match";
}

Expect.prototype.toString = function() {
	var str = "[expect] " + this.value;

	if (this.type == "match") {
		str += " to match " + this.other;
	}

	str += ": ";

	if (this.success) {
		str += "success";
	} else {
		str += "failure";
	}

	return str;
}

function relayPeek() {
	return relayStack[relayStack.length - 1];
}

function describe(name, op) {
	relayPeek().children.push(new Describe(name, op, relayPeek().befores, relayPeek().afters))
}

function beforeEach(op) {
	relayPeek().befores.push(new Run(op));
}

function afterEach(op) {
	relayPeek().afters.push(new Run(op));
}

function it(name, op) {
	relayPeek().children.push(new It(name, op, relayPeek().befores, relayPeek().afters));
}

function runs(op) {
	relayPeek().children.push(new Run(op, relayPeek().befores, relayPeek().afters));
}

function expect(val) {
	var e = new Expect(val);
	relayPeek().expects.push(e);
	return e;
}

function enter(part, callback) {
	console.log(part.toString());
	relayStack.push(part);
	part.perform(function() {
		relayStack.pop();
		callback();
	});
}

function relay() {
	console.log("Relay started with " + root.children.length + " Describes.");

	loop(0, root.children.length, function(i, next) {
		enter(root.children[i], next);
	}, function() {
		console.log("Relay done.");
	});
}

function loop(iteration, end, operation, finishCallback) {
	if (iteration < end) {
		operation(iteration, function() {
			loop(iteration + 1, end, operation, finishCallback);
		});
	} else {
		return finishCallback();
	}
}

var relayStack = [];
var root = new Describe();
relayStack.push(root);