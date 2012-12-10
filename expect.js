var Expect = function(parent, value, callStack) {
	this.parent = parent;
	this.success = false;
	this.value = value;
	this.other = null;
	this.type = "";
	this.callStack = callStack;

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
	this.success = (matches && matches.length > 0);
	this.type = "match";
}

Expect.prototype.toBe = function(other) {
	this.other = other;
	this.success = (this.value === other);
	this.type = "be";
}

Expect.prototype.toEqual = function(other) {
	this.other = other;

	if ( (!this.value && other) || (this.value && !other) ) {
		this.success = false;
	} else if (this.value == other) {
		this.success = true;
	} else if (this.value.length != other.length) {
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