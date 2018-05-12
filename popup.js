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
}

function addTabToList(idList) {
  var backgroundPage = chrome.extension.getBackgroundPage();
  var tabHash = backgroundPage.add.getUrlHash();
  console.log(tabHash);

  var tabList = document.getElementById("tabList");
  for (i = 0; i < idList.length; i++) {
    var id = idList[i];
    var url = tabHash[id];
    var li = document.createElement("li"); //create a list element
    li.setAttribute("id", id.toString()); //set list element to tabId to access later
    li.appendChild(document.createTextNode(url)); //add url to text
    tabList.appendChild(li); //append list element
  }
};

document.addEventListener('DOMContentLoaded', function() {
  getAllTabIds(addTabToList);
});