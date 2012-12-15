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

RelayObject.prototype.typeString = function(callback) {
	if (this && this.constructor && this.constructor.toString) {
        var arr = this.constructor.toString().match(/function\s*(\w+)/);
        
        if (arr && arr.length == 2) {
            return arr[1];
        }
    }
    
    return undefined;
};