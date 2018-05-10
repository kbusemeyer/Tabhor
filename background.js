/*
one problem is that it will include new tabs - but tab id is the same
so when displaying can get tab id and get current value of the tab\
*/


//var urlHash = {};

/*
var addToUrlHash = (function (tabId, tabInfo) {
	var urlHash = {};
	return function () {
		urlHash[tabId.toString()] = tabInfo.url;
	}
});
*/

function addToUrlHash(tabId, tabInfo) {
	var urlHash = {};
	var counter = 0;
	function addUrl() {
		//console.log(urlHash);
		counter += 1;
		console.log("here");
		urlHash[tabId.toString()] = tabInfo.url;
		console.log(urlHash);
	}
	//console.log(urlHash);
	console.log(counter);
	return addUrl;
}

//need my function to return the url hash and then take in the new one to add

//when tab is created, get the tab id and set the date
chrome.tabs.onCreated.addListener(function(tabInfo) {
	//getCreatedTabInfo(addStartTime, tabInfo.id, 1);
	addStartTime(tabInfo.id);
});


//when tab is updated - change the url associated with the tabId to the new one
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabInfo) {
	if (changeInfo.status === 'complete') {
		//console.log(urlHash);
		//urlHash[tabId.toString()] = tabInfo.url;
		var curUrlHash = addToUrlHash(tabId, tabInfo);
		curUrlHash();
		//.log(curUrlHash());
		//addUrlToList(tabId);
		//console.log(addToUrlHash(tabId, tabInfo));
	}
});
		
/*
//gets the id of the current tab
function getCreatedTabIn(addStartTime, tabId, createOrUpdate) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {

    var tab = tabs[0];
    //console.log(tab);
    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be an string');

    addStartTime(tabId, url);
  })
};
*/

//sets the current timestamp in storage
function addStartTime(tabID) {
	var firstOpened = new Date;
	var stringId = tabID.toString();
	chrome.storage.sync.set({stringId : firstOpened}, function() {
		//var urlList = document.getElementById("urlList");
		console.log(tabID + " " + firstOpened)
	})
};

function addUrlToList(tabID) {
	var stringId = tabID.toString();
			console.log(urlHash);
	var curTabUrl = chrome.storage.sync.get(stringId, function(urlHash) {
		console.log(urlHash);
		console.log(urlHash.stringId);
	});
};




