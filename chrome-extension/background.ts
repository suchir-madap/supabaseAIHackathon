import { supabase } from "./core/store";

const apiUrl = "https://supabase-ai-hackathon.vercel.app/api/claude";

const queryApiRoute = async (url: string) => {
  // const testUrl = "https://example.com";

  // Add URL as query parameter
  const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log("response from api", data);

  
};

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
      .from("rawHistoryItems")
      .insert([
        {
          rawUrl: historyItem.url,
          visitTime: historyItem.lastVisitTime.toString(),
        },
      ])
      .select();

    console.log("data from upload", data);

    if (historyItem.url && historyItem.url !== "") {
      // query the api route
      await queryApiRoute(historyItem.url);
    }

    if (error) {
      console.error("Error storing history:", error);
    }
  } catch (err) {
    console.error("Failed to process history item:", err);
  }
});
