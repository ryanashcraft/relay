function relayPeek() {
	return relayStack[relayStack.length - 1];
}

function describe(name, op) {
	relayPeek().children.push(new Describe(relayPeek(), name, op, relayPeek().befores.slice(0), relayPeek().afters.slice(0)))
}

function beforeEach(op) {
	relayPeek().befores.push(new Run(relayPeek(), op));
}

function afterEach(op) {
	relayPeek().afters.push(new Run(relayPeek(), op));
}

function it(name, op) {
	relayPeek().children.push(new It(relayPeek(), name, op, relayPeek().befores.slice(0), relayPeek().afters.slice(0)));
}

function runs(op) {
	relayPeek().children.push(new Run(relayPeek(), op, relayPeek().befores.slice(0), relayPeek().afters.slice(0)));
}

function expect(val) {
	var e = new Expect(relayPeek(), val, getCallStack(10));
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

function closestAncestor(element, callback) {
	if (!callback) {
		return element.parent;
	}

	var ancestor = element.parent;

	while (!callback(ancestor)) {
		ancestor = ancestor.parent;
	}

	return ancestor;
}

function getCallStack(size) {
	try {
		throw Error('')
	} catch(error) {
		var frames = [];
		var lines = error.stack.split("\n");
		for (var i = 0; i < size && i < lines.length; i++) {
			var line = lines[i];
			var lineRegex = /[^\(]*\(([^\)]*)\)/ig;
			var regexResult = lineRegex.exec(line);
			if (regexResult && regexResult.length >= 2) {
				frames.push(safeTagsReplace(regexResult[1]));
			}
		}

		return frames;
	}
}

var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safeTagsReplace(str) {
    return str.replace(/[&<>]/g, replaceTag);
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