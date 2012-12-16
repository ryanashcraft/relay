"use strict";

__relay_extend__(RelayObject, Run);

function Run(info) {
	RelayObject.call(this, info);
	this.func = info.func;
	this.expects = [];

	if (info.befores) {
		this.befores = info.befores;
	}

	if (info.afters) {
		this.afters = info.afters;
	}
};

Run.prototype.perform = function(callback) {
	var self = this;

	var calledBack = false;
	self.func(function() {
		if (!calledBack) {
			calledBack = true;
		} else {
			console.error("Relay asynchronous block received called back more than once");
			return;
		}

		__relay_loop__(0, self.expects.length, function(i, next) {
			__relay_enter__(self.expects[i], next);
		}, function() {
			callback();
		});
	});
};