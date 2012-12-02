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

function runs(op, timeout) {
	relayPeek().children.push(new Run(relayPeek(), op, relayPeek().befores, relayPeek().afters, timeout));
}

function expect(val) {
	var e = new Expect(relayPeek(), val);
	relayPeek().expects.push(e);
	return e;
}

function enter(part, callback) {
	broadcast("onEnter", part);

	relayStack.push(part);
	part.perform(function() {
		exit(callback)
	});
}

function exit(callback) {
	var part = relayStack.pop();

	broadcast("onExit", part);

	callback();
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

function addListener(listener) {
	listeners.push(listener);
}

function broadcast(message, param) {
	for (var i = 0; i < listeners.length; i++) {
		listeners[i][message](param);
	}
}

var listeners = [];
var relayStack = [];
var root = new Describe();
relayStack.push(root);
var describeCount = 0;
var itCount = 0;