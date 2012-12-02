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

var Run = function(parent, op, befores, afters) {
	this.parent = parent;
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

var Expect = function(parent, value) {
	this.parent = parent;
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
	var regex = new RegExp(other);
	var matches = (this.value.match(regex));
	this.success = (matches.length > 0);
	this.type = "match";
}

Expect.prototype.toBe = function(other) {
	this.other = other;
	this.success = (this.value === other);
	this.type = "be";
}

Expect.prototype.toEqual = function(other) {
	this.other = other;

	if (this.value.length != other.length) {
		this.success = false;
	} else {
		this.success = true;

		for (var i = 0; i < this.value.length; i++) {
			if (this.value[i] != other[i]) {
				this.success = false;
				break;
			}
		}
	}

	this.type = "equal";
}

Expect.prototype.toBeUndefined = function() {
	this.success = (this.val == undefined);
	this.type = "undefined";
}

Expect.prototype.toBeNull = function() {
	this.success = (this.val == null);
	this.type = "null";
}

Expect.prototype.toString = function() {
	var str = "expected " + this.value;

	if (this.type == "match") {
		str += " to match " + this.other;
	} else if (this.type == "be") {
		str += " to be " + this.other;
	} else if (this.type == "equal") {
		str += " to equal " + this.other;
	} else if (this.type == "undefined") {
		str += " to be undefined";
	} else if (this.type == "null") {
		str += " to be null";
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
	relayPeek().children.push(new Describe(relayPeek(), name, op, relayPeek().befores, relayPeek().afters))
}

function beforeEach(op) {
	relayPeek().befores.push(new Run(relayPeek(), op));
}

function afterEach(op) {
	relayPeek().afters.push(new Run(relayPeek(), op));
}

function it(name, op) {
	relayPeek().children.push(new It(relayPeek(), name, op, relayPeek().befores, relayPeek().afters));
}

function runs(op) {
	relayPeek().children.push(new Run(relayPeek(), op, relayPeek().befores, relayPeek().afters));
}

function expect(val) {
	var e = new Expect(relayPeek(), val);
	relayPeek().expects.push(e);
	return e;
}

function enter(part, callback) {
	displayEnter(part);

	relayStack.push(part);
	part.perform(function() {
		exit(callback)
	});
}

function exit(callback) {
	var part = relayStack.pop();

	displayExit(part);

	callback();
}

function displayEnter(part) {
	if (part instanceof Describe || part instanceof It) {
		var prefix = "";
		if (part instanceof Describe) {
			prefix = "describe";
		} else if (part instanceof It) {
			prefix = "it";
		}

		document.write("<li id=" + prefix + "-" + part.id + ">" + part.toString() + "</li>");
		document.write("<ul>");
	} else if (part instanceof Expect) {
		var prefix = "";
		var relevantParent = part.parent;

		while (!(relevantParent instanceof Describe) && !(relevantParent instanceof It)) {
			relevantParent = relevantParent.parent;
		}

		if (relevantParent instanceof Describe) {
			prefix = "describe";
		} else if (relevantParent instanceof It) {
			prefix = "it";
		}

		if (part.success) {
			document.getElementById(prefix + "-" + relevantParent.id).style.color = "green";
		} else {
			document.getElementById(prefix + "-" + relevantParent.id).style.color = "red";
		}
	}
}

function displayExit(part) {
	if (part instanceof Describe || part instanceof It) {
		document.write("</ul>");
	}
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
var describeCount = 0;
var itCount = 0;