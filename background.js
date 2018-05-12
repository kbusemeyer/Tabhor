//adds the url to the urlHash
var add = (function () {
    var urlHash = [];
    //console.log(urlHash);
    return { 
    	addUrl: function(tabId, tabInfo) {
    		var tab = {
    			id: tabId.toString(),
    			url: tabInfo.url
    		};
    		urlHash.push(tab);
    		return urlHash.tab;
    	},
    	getUrlHash: function() {
    		console.log("here from popup")
    		console.log(urlHash);
    		return urlHash;
    	},
    	addCurOpenUrl: function(tabsInfo) {
    		for (i = 0; i < tabsInfo.length; i++) {
    			urlHash.push(tabsInfo[i]);
    			console.log(urlHash);
    		};
    		return urlHash;
    	};
    };
})();

function getCurTabIds(callback) {
  
  var queryInfo = {
  };

  chrome.tabs.query(queryInfo, function(tabs) {
      var tabsInfo = [];

    tabs.forEach(function(tab) {
    	var addTab = {
    		id: tab.id.toString(),
    		url: tab.url
    	};
      	tabsInfo.push(addTab);
    });

    callback(tabsInfo);
  });
};

//when the app is first installed, add the currently open tabs to the tabHash
chrome.runtime.onInstalled.addListener(function(details) {
	//want this to happen everytime? users can't reload?
	if (details.reason === "install" || details.reason === "update") { 
		getCurTabIds(add.addCurOpenUrl);
	};
	//need to add start time too
});

//when tab is created, get the tab id and set the date
chrome.tabs.onCreated.addListener(function(tabInfo) {
	addStartTime(tabInfo.id);
});


//when tab is updated - change the url associated with the tabId to the new one
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabInfo) {
	if (changeInfo.status === 'complete') {
		add.addUrl(tabId, tabInfo);
	};
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




