var Describe = function(name, op) {
	this.name = name;
	this.op = op;
	this.children = [];
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

var It = function(name, op) {
	this.name = name;
	this.op = op;
	this.children = [];
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

var Run = function(op) {
	this.op = op;
	this.expects = [];
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
		str += "to match " + this.other;
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
	relayPeek().children.push(new Describe(name, op))
}

function it(name, op) {
	relayPeek().children.push(new It(name, op));
}

function runs(op) {
	relayPeek().children.push(new Run(op));
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