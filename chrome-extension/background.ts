import { supabase } from "./core/store";



chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  if (message.action === "openSidePanel") {
    console.log("openSidePanel");
    chrome.tabs.getCurrent((tab) => {
      chrome.sidePanel.open({ tabId: tab?.id });
    });
  }
});

chrome.history.onVisited.addListener(async (historyItem) => {
  try {
    const { data, error } = await supabase
      .from('rawHistoryItems')
      .insert([
        {
          rawUrl: historyItem.url,
          visitTime: historyItem.lastVisitTime.toString(),
        }
      ])
      .select()

      console.log("data from upload", data)

    if (error) {
      console.error('Error storing history:', error);
    }
  } catch (err) {
    console.error('Failed to process history item:', err);
  }
});
