chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        const queryParameter = tab.url.split("?")[1];
        const urlParameter = new URLSearchParams(queryParameter);
        const videoId = urlParameter.get("v");

        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: videoId,
        });
    }
});
