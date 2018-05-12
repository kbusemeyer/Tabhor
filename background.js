//adds the url to the urlHash
var add = (function () {
    var urlHash = [];
    console.log(urlHash);
    return { 
    	addUrl: function(tabId, tabInfo) {
    		var tab = {
    			id: tabId.toString();
    			url: tabInfo.url;
    		}
    		urlHash.push(tab);
    		return urlHash.tab;
    	},
    	getUrlHash: function() {
    		return urlHash;
    	},
    	addCurOpenUrl: function(tabsInfo) {
    		for (i = 0; i < tabsInfo.length; i++) {
    			var id = tabsInfo[0];
    			var url = tabsInfo[1];
    			urlHash[id.toString()] = url;
    		}
    		return urlHash;
    	}
    };
})();

function getCurTabIds(callback) {
  
  var queryInfo = {
  };

  chrome.tabs.query(queryInfo, function(tabs) {
      var tabsInfo = [];

    tabs.forEach(function(tab) {
    	var info = [];
      	info.push(tab.id);
      	info.push(tab.url);
      	tabsInfo.push(info);
    });

    callback(tabsInfo);
  });
};

chrome.runtime.onInstalled.addListener(function(details) {
	getCurTabIds(add.addCurOpenUrl);
}
);

//when tab is created, get the tab id and set the date
chrome.tabs.onCreated.addListener(function(tabInfo) {
	addStartTime(tabInfo.id);
});


//when tab is updated - change the url associated with the tabId to the new one
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabInfo) {
	if (changeInfo.status === 'complete') {
		add.addUrl(tabId, tabInfo);
	}
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




