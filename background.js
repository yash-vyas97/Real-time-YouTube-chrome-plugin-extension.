var disabled = false;

chrome.browserAction.onClicked.addListener(function () {
  if (disabled) {
      enableExtension();
  }
  else {
      disableExtension();
  }
  disabled = !disabled;
});


function enableExtension() {
  chrome.browserAction.setIcon({
    path: {
      "48": "res/img/LogoIcon24x24@2x.png",
      "88": "res/img/LogoIcon44x44@2x.png",
      "172": "res/img/LogoIcon86x86@2x.png"
    },
  });
  chrome.tabs.query({
      active: true,
      currentWindow: true,
}, function (tabs) {
    if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    }
  });
  console.log("ON");
};



function disableExtension() {
  chrome.browserAction.setIcon({
    path: {
      "48": "res/img/DisLogoIcon24x24@2x.png",
      "88": "res/img/DisLogoIcon44x44@2x.png",
      "172": "res/img/DisLogoIcon86x86@2x.png"
},
  });
  chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: '*://*.youtube.com/watch?v=*',
  }, function (tabs) {
  if (tabs.length > 0) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "ON"});
    chrome.tabs.onUpdated.addListener(
      function(tabId, changeInfo, tab) {
        // read changeInfo data
        if (tabId==tabs[0].id) {
          chrome.browserAction.setIcon({
            path: {
              "48": "res/img/LogoIcon24x24@2x.png",
              "88": "res/img/LogoIcon44x44@2x.png",
              "172": "res/img/LogoIcon86x86@2x.png"
            },
          });
        
        }
      }
    );
    
  }
  });
  console.log("OFF");
};
