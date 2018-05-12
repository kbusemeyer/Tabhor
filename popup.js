//this is getting the tab ids for all the currently open ids soooo need to fix that later
function getAllTabIds(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
  };

  chrome.tabs.query(queryInfo, function(tabs) {
      var ids = [];
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    tabs.forEach(function(tab) {
      ids.push(tab.id);
    })

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    //console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(ids);
  });
}


function addTabToList(idList) {
  var backgroundPage = chrome.extension.getBackgroundPage();
  var tabHash = backgroundPage.add.getUrlHash();
  //console.log(tabHash);
  //console.log(idList);

  var tabList = document.getElementById("tabList");
  console.log(tabList);
  for (i = 0; i < idList.length; i++) {
    var id = idList[i];
    var url = tabHash[id];
    if (!(url === 'undefined')) {
    var li = document.createElement("li"); //create a list element
    li.setAttribute("id", id.toString()); //set list element to tabId to access later
    li.appendChild(document.createTextNode(url)); //add url to text
    tabList.appendChild(li); //append list element
  }
  }
};

document.addEventListener('DOMContentLoaded', function() {
  getAllTabIds(addTabToList);
});