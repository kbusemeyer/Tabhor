//this is getting the tab ids for all the currently open ids soooo need to fix that later
function getAllTabIds(callback) {

  var queryInfo = {
  };

  chrome.tabs.query(queryInfo, function(tabs) {
      var ids = [];

    tabs.forEach(function(tab) {
      ids.push(tab.id);
    })

    callback(ids);
  });
};

function addTabToList() {
  var backgroundPage = chrome.extension.getBackgroundPage();
  var tabHash = backgroundPage.add.getUrlHash();

  var tabList = document.getElementById("tabList");
  for (i = 0; i < tabHash.length; i++) {
    var id = tabHash[i].id;
    var url = tabHash[i].url;
    var li = document.createElement("li"); //create a list element
    li.setAttribute("id", id); //set list element to tabId to access later
    li.appendChild(document.createTextNode(url)); //add url to text
    tabList.appendChild(li); //append list element
  }
};

document.addEventListener('DOMContentLoaded', function() {
  //getAllTabIds(addTabToList);
  addTabToList();
});