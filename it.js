"use strict";

__relay_extend__(RelayObject, It);

function It(info) {
	RelayObject.call(this, info);
	this.name = info.name;
	this.func = info.func;
	this.children = [];
	this.expects = [];

	if (info.befores) {
		this.befores = info.befores;
	} else {
		this.befores = [];
	}

	if (info.afters) {
		this.afters = info.afters;
	} else {
		this.afters = [];
	}
};

It.prototype.toString = function() {
	return this.name;
};

It.prototype.perform = function(callback) {
	var self = this;

	function runBefores() {
		if (self.befores) {
			__relay_loop__(0, self.befores.length, function(i, next) {
				__relay_enter__(self.befores[i], next);
			}, runMain);
		} else {
			runMain();
		}
	}

	function runMain() {
		self.func();

		__relay_loop__(0, self.children.length, function(i, next) {
			__relay_enter__(self.children[i], next);
		}, runExpects);
	}

	function runExpects() {
		__relay_loop__(0, self.expects.length, function(i, next) {
			__relay_enter__(self.expects[i], next);
		}, runAfters);
	}

	function runAfters() {
		if (self.afters) {
			__relay_loop__(0, self.afters.length, function(i, next) {
				__relay_enter__(self.afters[i], next);
			}, callback);
		} else {
			callback();
		}
	}

	runBefores();
};