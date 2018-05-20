chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var scriptOptions = message.scriptOptions;
    var favUrl = scriptOptions.url;
    if (favUrl.includes("favicon.ico")) {
    	//setRootStatus(scriptOptions.redzone, scriptOptions.yellowzone, scriptOptions.open);
    	setStatus(scriptOptions.redzone, scriptOptions.yellowZone, scriptOptions.open, 1);
    }
    else {
    	setStatus(scriptOptions.redzone, scriptOptions.yellowZone, scriptOptions.open, 0);
    };
});

/*
function setStatus(red, yellow, msOpen) {
	if (msOpen >= red) { //greater than red
		document.querySelector('link[rel*="icon"]').href = chrome.extension.getURL("indicators/red.ico")
	}
	else if (msOpen >= yellow) { //greater than yellow
		document.querySelector('link[rel*="icon"]').href = chrome.extension.getURL("indicators/yellow.ico")
	}
	else {
		document.querySelector('link[rel*="icon"]').href = chrome.extension.getURL("indicators/green.ico")
	}
};
*/

function setStatus(red, yellow, msOpen, num) {
	//don't want to do this every second just one time, but since looking for favicon.ico should
	// be find after first time because switched to indicators
	//adding everytime because sending same url through every second
	if (num === 1) {
		var linkElement = document.createElement("link");
		linkElement.rel = "shortcut-icon";
		var head = document.head;
		head.appendChild(linkElement);
	}

	if (msOpen >= red) { //greater than red
		document.querySelector('link[rel*="icon"]').href = chrome.extension.getURL("indicators/red.ico")
	}
	else if (msOpen >= yellow) { //greater than yellow
		document.querySelector('link[rel*="icon"]').href = chrome.extension.getURL("indicators/yellow.ico")
	}
	else {
		document.querySelector('link[rel*="icon"]').href = chrome.extension.getURL("indicators/green.ico")
	}
};