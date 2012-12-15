"use strict";

function RelayObject(info) {
	this.id = info.id;
	this.parent = info.parent;
}

RelayObject.prototype.findFirstParent = function(callback) {
	if (!callback) {
		return element.parent;
	}

	var ancestor = this.parent;

	while (ancestor != null && !callback(ancestor)) {
		ancestor = ancestor.parent;
	}

	return ancestor;
};