//adds the url to the urlHash
var tabMethods = (function () {
    var urlMap = new Map();
    //console.log(urlHash);
    return { 
    	//adds the original url when a tab is created
    	addUrl: function(tabInfo) {
    		urlMap.set(tabInfo.id, tabInfo.url);
    		return tabInfo.id;
    	},
    	//returns the urlHash
    	getUrlMap: function() {
    		return urlMap;
    	},
    	//adds the tabs that are open when the extension is initially installed/updated
    	addCurOpenUrl: function(tabsInfo, tabIds) {
    		for (i = 0; i < tabsInfo.length; i++) {
    			urlMap.set(tabsInfo[i][0], tabsInfo[i][1]);
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

/*
    		for (i = 0; i < ids.size; i++) {
    			console.log("here");
    			if (!(curTabIds.includes(ids[i]))) {
    				urlMap.delete(ids[i]);
    			}
    			else {
    				continue;
    			}
    		}
    		*/
    		return urlMap;
    	}
    };
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
	};
	//need to add start time too
});

//when tab is created, get the tab id and set the date
chrome.tabs.onCreated.addListener(function(tabInfo) {
	addStartTime(tabInfo.id);
	tabMethods.addUrl(tabInfo)
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

 //sets the current timestamp in storage
 function addStartTime(tabID) {
 	var firstOpened = new Date;
 	var stringId = tabID.toString();
 	chrome.storage.sync.set({stringId : firstOpened}, function() {
 		//var urlList = document.getElementById("urlList");
 		console.log(tabID + " " + firstOpened)
 	})
 };



