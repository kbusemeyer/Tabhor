/*
one problem is that it will include new tabs - but tab id is the same
so when displaying can get tab id and get current value of the tab\
*/

//var windows = chrome.extension.getViews({type: "popup"});
//console.log(windows);

//adds the url to the urlHash
var add = (function () {
    var urlHash = {};
    return { 
    	addUrl: function(tabId, tabInfo) {
    		return urlHash[tabId.toString()] = tabInfo.url;
    	},
    	getUrlHash: function() {
    		return urlHash;
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
		//addUrlToList(tabId, tabInfo);
		/*
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			console.log("hi");
			if (request.greeting === "addUrlToList") {
				console.log("here");
				sendResponse(tabInfo);		
			}
		}); 
		*/
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


//don't think it's looking at my chrome extension html
function addUrlToList(tabId, tabUrl) {
	//get the html list
	//execute a script to get it or add it because not registering want popup html affected
	//var windows = chrome.extension.getViews({type: "popup"});
	//console.log(windows);
	//var tabList = windows.document.getElementById("tabList");
	//console.log(tabList);
	//var li = windows.document.createElement("li"); //create a list element
	//li.setAttribute("id", tabId.toString()); //set list element to tabId to access later
	//li.appendChild(document.createTextNode(tabUrl)); //add url to text
	//tabList.appendChild(li); //append list element
	//chrome.runtime.sendMessage(tabId, tabUrl);
};




