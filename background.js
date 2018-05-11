/*
one problem is that it will include new tabs - but tab id is the same
so when displaying can get tab id and get current value of the tab\
*/

//adds the url to the urlHash
var add = (function () {
    var urlHash = {};
    return { 
    	addUrl: function(tabId, tabInfo) {
    		return urlHash[tabId.toString()] = tabInfo.url;
    	},
    	getUrl: function() {
    		return urlHash[tabId.toString()];
    	}
    };
})();

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

//need to add to html list to display
/*
function addUrlToList(tabID) {
	var stringId = tabID.toString();
			console.log(urlHash);
	var curTabUrl = chrome.storage.sync.get(stringId, function(urlHash) {
		console.log(urlHash);
		console.log(urlHash.stringId);
	});
};

function addUrlToList(tabId) {
	var stringId = tabId.toString();
	var currentUrl = add()
}
*/




