function addTabToList() {
  var backgroundPage = chrome.extension.getBackgroundPage();
  var tabMap = backgroundPage.tabMethods.getUrlMap();

  var tabList = document.getElementById("tabList");

  for (var id of tabMap.keys()) {
    console.log("here");
    var url = tabMap.get(id);
    var li = document.createElement("li"); //create a list element
    li.setAttribute("id", id); //set list element to tabId to access later
    li.appendChild(document.createTextNode(url)); //add url to text
    tabList.appendChild(li); //append list element
  }
};

document.addEventListener('DOMContentLoaded', function() {
  addTabToList();
});