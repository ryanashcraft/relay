"use strict";

__relay_extend__(RelayObject, Expect);

function Expect(info) {
	RelayObject.call(this, info);
	this.success = false;
	this.value = info.value;
	this.expectedValue = null;
	this.comparisonType = "";
	this.callStack = info.callStack;

	if (info.value) {
		this.success = true;
	}
};

Expect.prototype.perform = function(callback) {
	callback();
};

Expect.prototype.toMatch = function(expectedValue) {
	this.expectedValue = expectedValue;
	var regex = new RegExp(expectedValue);
	var matches = (this.value.match(regex));
	this.success = (matches && matches.length > 0);
	this.comparisonType = "match";
};

Expect.prototype.toBe = function(expectedValue) {
	this.expectedValue = expectedValue;
	this.success = (this.value === expectedValue);
	this.comparisonType = "be";
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

Expect.prototype.toEqual = function(expectedValue) {
	this.expectedValue = expectedValue;

	this.success = isEqual(this.value, expectedValue);

	this.comparisonType = "equal";
};

Expect.prototype.toNotEqual = function(expectedValue) {
	this.expectedValue = expectedValue;

	this.success = !isEqual(this.value, expectedValue);

	this.comparisonType = "not equal";
};

Expect.prototype.toBeUndefined = function() {
	this.success = (this.val == undefined);
	this.comparisonType = "undefined";
};

Expect.prototype.toBeNull = function() {
	this.success = (this.val == null);
	this.comparisonType = "null";
};

Expect.prototype.toString = function() {
	var str = "expected " + this.value;

	if (this.comparisonType == "match") {
		str += " to match " + this.expectedValue;
	} else if (this.comparisonType == "be") {
		str += " to be " + this.expectedValue;
	} else if (this.comparisonType == "equal") {
		str += " to equal " + this.expectedValue;
	} else if (this.comparisonType == "undefined") {
		str += " to be undefined";
	} else if (this.comparisonType == "null") {
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