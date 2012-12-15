"use strict";

var __relay_singleton__ = null;

function relay() {
	if (__relay_singleton__ != null) {
		return __relay_singleton__;
	}

	__relay_singleton__ = {};
	__relay_singleton__.listeners = [];
	__relay_singleton__.relayStack = [];
	__relay_singleton__.idCounter = 0;
	var root = new Describe({
		id: __relay_singleton__.idCounter++,
		parent: null
	});
	__relay_singleton__.relayStack.push(root);

	__relay_singleton__.start = function() {
		__relay_broadcast__("onRelayStart");

		__relay_loop__(0, root.children.length, function(i, next) {
			__relay_enter__(root.children[i], next);
		}, function() {
			__relay_broadcast__("onRelayEnd");
		});
	};

	return __relay_singleton__;
}

function describe(name, func) {
	__relay_stack_peek__().children.push(new Describe({
		id: __relay_next_id__(),
		parent: __relay_stack_peek__(),
		name: name,
		func: func,
		befores: __relay_stack_peek__().befores.slice(0),
		afters: __relay_stack_peek__().afters.slice(0)
	}));
}

function beforeEach(func) {
	__relay_stack_peek__().befores.push(new Run({
		id: __relay_next_id__(),
		parent: __relay_stack_peek__(),
		func: func
	}));
}

function afterEach(func) {
	__relay_stack_peek__().afters.push(new Run({
		id: __relay_next_id__(),
		parent: __relay_stack_peek__(),
		func: func
	}));
}

function it(name, func) {
	__relay_stack_peek__().children.push(new It({
		id: __relay_next_id__(),
		parent: __relay_stack_peek__(),
		name: name,
		func: func,
		befores: __relay_stack_peek__().befores.slice(0),
		afters: __relay_stack_peek__().afters.slice(0)
	}));
}

function runs(func) {
	__relay_stack_peek__().children.push(new Run({
		id: __relay_next_id__(),
		parent: __relay_stack_peek__(),
		name: name,
		func: func,
		befores: __relay_stack_peek__().befores.slice(0),
		afters: __relay_stack_peek__().afters.slice(0)
	}));
}

function expect(val) {
	var e = new Expect({
		id: __relay_next_id__(),
		parent: __relay_stack_peek__(),
		value: val,
		caller: __relay_caller__()
	});
	__relay_stack_peek__().expects.push(e);
	return e;
}

function addRelayListener(listener) {
	relay().listeners.push(listener);
}

function __relay_extend__(base, sub) {
	function EmptyConstructor() { };
	EmptyConstructor.prototype = base.prototype;
	sub.prototype = new EmptyConstructor();
	sub.prototype.constructor = sub;
}

function __relay_stack_peek__() {
	var r = relay();
	return r.relayStack[r.relayStack.length - 1];
}

function __relay_next_id__() {
	return relay().idCounter++;
}

function __relay_enter__(part, callback) {
	__relay_broadcast__("onEnter", part);

	relay().relayStack.push(part);
	part.perform(function() {
		__relay_exit__(callback);
	});
}

function __relay_exit__(callback) {
	var part = relay().relayStack.pop();

	__relay_broadcast__("onExit", part);

	callback();
}

function __relay_loop__(iteration, end, operation, finishCallback) {
	if (iteration < end) {
		operation(iteration, function() {
			__relay_loop__(iteration + 1, end, operation, finishCallback);
		});
	} else {
		return finishCallback();
	}
}

function __relay_caller__() {
	function replaceTag(tag) {
		var tagsToReplace = {
		    '&': '&amp;',
		    '<': '&lt;',
		    '>': '&gt;'
		};
	
	    return tagsToReplace[tag] || tag;
	}

	function safeTagsReplace(str) {
	    return str.replace(/[&<>]/g, replaceTag);
	}

	try {
		throw Error('')
	} catch(error) {
		var caller = null;
		var lines = error.stack.split("\n");
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			var lineRegex = /[^\(]*\(([^\)]*)\)/ig;
			var regexResult = lineRegex.exec(line);

			if (regexResult && regexResult.length >= 2) {
				var callerRegex = /specs\/(.*)$/ig;
				var callerResult = callerRegex.exec(regexResult[1]);
				if (callerResult && callerResult.length >= 2) {
					caller = safeTagsReplace(callerResult[1]);
					break;
				}
			}
		}

		return caller;
	}
}

function __relay_broadcast__(message, param) {
	for (var i = 0; i < relay().listeners.length; i++) {
		relay().listeners[i][message](param);
	}
}