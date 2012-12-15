"use strict";

window.onload = function() {
	relay().start();
};

var displayListener = new RelayListener();

displayListener.onRelayStart = function() {

}

displayListener.onRelayEnd = function() {
	document.write("<p><strong>Relay done.</strong></p>")
}

displayListener.onEnter = function(relayObject) {
	if (relayObject.constructor == Describe || relayObject.constructor == It) {
		var prefix = "";
		if (relayObject.constructor == Describe) {
			prefix = "describe";
		} else if (relayObject.constructor == It) {
			prefix = "it";
		}

		document.write("<li id=" + relayObject.id + ">" + relayObject.toString() + "</li>");
		document.write("<ul>");
	}
}

displayListener.onExit = function(relayObject) {
	if (relayObject.constructor == Expect) {
		var prefix = "";
		var relevantParent = relayObject.findFirstParent(function(ancestor) {
			return (ancestor.constructor == Describe) || (ancestor.constructor == It);
		});

		var alreadyFailed = document.getElementById(relevantParent.id).dataset['failed'];
		if (relayObject.success && !alreadyFailed) {
			document.getElementById(relevantParent.id).style.color = "green";
		} else if (!alreadyFailed) {
			document.getElementById(relevantParent.id).style.color = "red";
			document.getElementById(relevantParent.id).dataset['failed'] = true;

			document.write("<strong>Expected " + JSON.stringify(relayObject.value) + " to " + relayObject.type + " " + JSON.stringify(relayObject.other) + "</strong><br>");
			
			for (var i = 0; i < relayObject.callStack.length; i++) {
				document.write(relayObject.callStack[i]);
				if (i < relayObject.callStack.length - 2) {
					document.write("<br>");
				}
			}
		}
	}

	if (relayObject.constructor == Describe || relayObject.constructor == It) {
		document.write("</ul>");
	}
}

addRelayListener(displayListener);