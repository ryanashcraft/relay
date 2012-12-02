var displayListener = new Listener();

displayListener.onEnter = function(part) {
	if (part instanceof Describe || part instanceof It) {
		var prefix = "";
		if (part instanceof Describe) {
			prefix = "describe";
		} else if (part instanceof It) {
			prefix = "it";
		}

		document.write("<li id=" + prefix + "-" + part.id + ">" + part.toString() + "</li>");
		document.write("<ul>");
	} else if (part instanceof Expect) {
		var prefix = "";
		var relevantParent = part.parent;

		while (!(relevantParent instanceof Describe) && !(relevantParent instanceof It)) {
			relevantParent = relevantParent.parent;
		}

		if (relevantParent instanceof Describe) {
			prefix = "describe";
		} else if (relevantParent instanceof It) {
			prefix = "it";
		}

		if (part.success) {
			document.getElementById(prefix + "-" + relevantParent.id).style.color = "green";
		} else {
			document.getElementById(prefix + "-" + relevantParent.id).style.color = "red";
		}
	}
}

displayListener.onExit = function(part) {
	if (part instanceof Describe || part instanceof It) {
		document.write("</ul>");
	}
}

addListener(displayListener);