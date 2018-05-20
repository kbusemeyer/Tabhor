//adds the url to the urlHash
var tabMethods = (function () {
    var urlMap = new Map();
    //console.log(urlHash);
    return { 
    	//adds the original url when a tab is created
    	addUrl: function(tabInfo) {
    		var tab = {
    			url: tabInfo.url,
    			openTime: new Date,
    			favIconUrl: tabInfo.favIconUrl
    		}
    		urlMap.set(tabInfo.id, tab);
    		return tabInfo.id;
    	},
    	//returns the urlHash
    	getUrlMap: function() {
    		return urlMap;
    	},
    	//adds the tabs that are open when the extension is initially installed/updated
    	addCurOpenUrl: function(tabsInfo, tabIds) {
    		for (i = 0; i < tabsInfo.length; i++) {
    			var tab = {
    				url: tabsInfo[i][1],
    				openTime: new Date,
    				favIconUrl: tabsInfo[i][3]
    			}
    			urlMap.set(tabsInfo[i][0], tab);
    		};
    		return urlMap;
    	},
    	removeUrl: function(curTabInfo, curTabIds) {
    		//need to run through list and see if any of the id's have been removed
    		for (var id of urlMap.keys()) {
    			if (!(curTabIds.includes(id))) {
    				urlMap.delete(id);
    				//console.log(curTabIds.includes(id));
    			}
    			else {
    				continue;
    			}
    		}
    		return urlMap;
    	},
    	getTab: function(tabId) {
    		return urlMap.get(tabId);
    	}
    }
})();

function getCurTabs(callback) {
  
  var queryInfo = {
  };

  chrome.tabs.query(queryInfo, function(tabs) {
      var tabsInfo = [];
      var ids = [];

    tabs.forEach(function(tab) {
    	var addTab = [];
    	ids.push(tab.id);
    	addTab.push(tab.id, findEndOfUrl(tab.url));
    	addTab.push(tab.id, tab.favIconUrl);
      	tabsInfo.push(addTab);
    });
    callback(tabsInfo, ids);
  });
};

//checks to see if any of the common website ends are found to shorten url
function findEndOfUrl(url) {
	//.net, .org .com
	if (url.includes(".com")) {
		return url.substring(0, url.indexOf(".com") + 4);
	}
	else if (url.includes(".org")) {
		return url.substring(0, url.indexOf(".org") + 4);
	}
	else if (url.includes(".net")) {
		return url.substring(url.indexOf(".net") + 4);
	}
	else {
		return url;
	}
}

//when the app is first installed, add the currently open tabs to the tabHash
chrome.runtime.onInstalled.addListener(function(details) {
	//want this to happen everytime? users can't reload?
	if (details.reason === "install" || details.reason === "update") { 
		getCurTabs(tabMethods.addCurOpenUrl);
		setIndicatorTimes();
	};
	//need to add start time too
});

function setIndicatorTimes() {
	chrome.storage.local.set({"red": 86400000}, function() {
		console.log("red set");
	});
	chrome.storage.local.set({"red": 43200000}, function() {
		console.log("yellow set");
	});
	/*
	chrome.storage.local.set({"red", 0}, function() {
		console.log("green set");
	});
	*/
};

function getIndicatorTimes(tabId) {
	chrome.storage.local.get(["red", "yellow"], function(result) {
		setStatus(tabId, result.red, result.yellow);
	});
};

//when tab is created, get the tab id and set the date
chrome.tabs.onCreated.addListener(function(tabInfo) {
	tabMethods.addUrl(tabInfo);
	setStatus(tabInfo.id, 0);
});

//when tab is updated - change the url associated with the tabId to the new one
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabInfo) {
	if (changeInfo.status === 'complete') {
		tabMethods.addUrl(tabInfo);
	};
});

//tab changes when closed - this becomes a problem when allowing them to close
// from the app because won't be able to
chrome.tabs.onActiveChanged.addListener(function(tabId, selectInfo) {
	getCurTabs(tabMethods.removeUrl);
});

function calculateTimeSinceOpened(time, num) {
 	var msPerDay = 1000 * 60 * 60 * 24;

 	var now = new Date;
 	var utcTime = Date.UTC(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), 
 		time.getMinutes(), time.getSeconds(), time.getMilliseconds());
 	var utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(),
 		 now.getMinutes(), now.getSeconds(),now.getMilliseconds());

 	if (num === 0) {
 		return msToTime(Math.floor(utcNow - utcTime));
 	}
 	else {
 		return Math.floor(utcNow - utcTime);
 	}
 };

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + ':' + mins + ':' + secs;
};

function setStatus(tabId, red, yellow) {
	var msOpen = calculateTimeSinceOpened(tabMethods.getTab(tabId).openTime, 1);
	var tabFavicon = tabMethods.getTab(tabId).favIconUrl;
	chrome.tabs.executeScript(tabId, {file: "contentscript.js"}, function(){
        chrome.tabs.sendMessage(tabId, {scriptOptions: {redzone: red, yellowzone: yellow, open: msOpen, url: tabFavicon}}, 
        	function(){
            //all injected
     });
    });
	/*
	var msOpen = calculateTimeSinceOpened(tabMethods.getTab(tabId).openTime, 1);
	if (msOpen >= red) { //greater than red
		chrome.tabs.executeScript(tabId, { 
			code: 'document.querySelector(\'link[rel*="icon"]\').href = chrome.extension.getURL("indicators/red.ico")'
		});
	}
	else if (msOpen >= yellow) { //greater than yellow
		chrome.tabs.executeScript(tabId, { 
			code: 'document.querySelector(\'link[rel*="icon"]\').href = chrome.extension.getURL("indicators/yellow.ico")'
		});
	}
	else {
		chrome.tabs.executeScript(tabId, { 
			code: 'document.querySelector(\'link[rel*="icon"]\').href = chrome.extension.getURL("indicators/green.ico")'
		});
	}
	*/
};

//for timer every second update it
setInterval(function() {
	var urls = tabMethods.getUrlMap();
	for (var id of urls.keys()) {
		getIndicatorTimes(id);
	}
}, 1000);

//need to convert user input to milliseconds later


