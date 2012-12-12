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
};

Expect.prototype.perform = function(callback) {
	callback();
};

Expect.prototype.toMatch = function(other) {
	this.other = other;
	var regex = new RegExp(other);
	var matches = (this.value.match(regex));
	this.success = (matches && matches.length > 0);
	this.type = "match";
};

Expect.prototype.toBe = function(other) {
	this.other = other;
	this.success = (this.value === other);
	this.type = "be";
};

function isArray(a) {
	return Object.prototype.toString.apply(a) === '[object Array]';
}

function isObject(a) {
	return typeof a == "object";
}

function isEqual(a, b) {
	if ( (!a && b) || (a && !b) ) {
		return false;
	} else if (a == b) {
		return true;
	} else if (isArray(a)) {
		if (!isArray(b)) {
			return false;
		} else if (a.length != b.length) {
			return false;
		} else {
			for (var i = 0; i < a.length; i++) {
				if (a[i] != b[i]) {
					return false;
				}
			}
			return true;
		}
	} else if (isObject(a)){
		if (!isObject(b)) {
			return false;
		}

		var bMembersCount = 0;
		for (var m in b) {
			bMembersCount++;
		}

		var aMembersCount = 0;
		for (var m in a) {
			aMembersCount++;
			if (b[m] == undefined) {
				return false;
			} else if (! isEqual(a[m], b[m]) ) {
				return false;
			}
		}

		if (bMembersCount != aMembersCount) {
			return false;
		}

		return true;
	} else {
		return a == b;
	}
}

Expect.prototype.toEqual = function(other) {
	this.other = other;

	this.success = isEqual(this.value, other);

	this.type = "equal";
};

Expect.prototype.toNotEqual = function(other) {
	this.other = other;

	this.success = !isEqual(this.value, other);

	this.type = "not equal";
};

Expect.prototype.toBeUndefined = function() {
	this.success = (this.val == undefined);
	this.type = "undefined";
};

Expect.prototype.toBeNull = function() {
	this.success = (this.val == null);
	this.type = "null";
};

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
};