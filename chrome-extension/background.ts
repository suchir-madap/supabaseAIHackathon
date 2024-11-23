chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  })
  
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(message)
  
    if (message.action === "openSidePanel") {
      console.log("openSidePanel")
      chrome.tabs.getCurrent((tab) => {
          chrome.sidePanel.open({tabId: tab?.id}) 
      })
    }
  }); 
  
  chrome.history.onVisited.addListener((historyItem) => {
      console.log(historyItem)
  })