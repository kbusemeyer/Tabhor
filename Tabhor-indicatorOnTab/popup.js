document.addEventListener('DOMContentLoaded', function() {
  addTabToList();
});

//for timer every second update it
setInterval(function() {
  getTimes();
}, 1000);

//adds tab to the list of urls
function addTabToList() {
  var backgroundPage = chrome.extension.getBackgroundPage();
  var tabMap = backgroundPage.tabMethods.getUrlMap();

  var tabList = document.getElementById("tabList");

  for (var id of tabMap.keys()) {
    var boldUrl = document.createElement("b"); //creates a bold element
    boldUrl.textContent = tabMap.get(id).url; //bolds the url

    var timestamp = backgroundPage.calculateTimeSinceOpened(tabMap.get(id).openTime); //gets the timestamp
    var li = document.createElement("li"); //create a list element
    li.setAttribute("id", id); //set list element to tabId to access if needed

    var spanElement = document.createElement("span"); //creates a span element
    spanElement.setAttribute("id", "span" + id); //sets the id
    spanElement.textContent = timestamp;

    li.appendChild(boldUrl); //add bolded url to text
    li.appendChild(document.createTextNode("   ")); //adds space between url and timestamp

    li.appendChild(spanElement) //add timestamp to text
    tabList.appendChild(li); //append to list element
  }
};

//gets the current time difference and updates it in the url
function getTimes() {
  var backgroundPage = chrome.extension.getBackgroundPage();
  var tabMap = backgroundPage.tabMethods.getUrlMap();

  for (var id of tabMap.keys()) {
    var tab = document.getElementById("span" + id.toString());
    var timestamp = backgroundPage.calculateTimeSinceOpened(tabMap.get(id).openTime);
    tab.textContent = timestamp;
  }
};