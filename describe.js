"use strict";

__relay_extend__(RelayObject, Describe);

function Describe(info) {
	RelayObject.call(this, info);
	this.name = info.name;
	this.func = info.func;
	this.children = [];

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
}

Describe.prototype.toString = function() {
	return this.name;
}

Describe.prototype.perform = function(callback) {
	var self = this;
	this.func();

	__relay_loop__(0, this.children.length, function(i, next) {
		__relay_enter__(self.children[i], next);
	}, callback);
}