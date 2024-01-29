import { getActiveTabUrl } from "./utils";

let bookmarkList = [];

const addNewBookmark = () => {};

const viewBookmark = () => {};

const onDelete = () => {};

const onPlay = () => {};

const setBookmarkAttribute = () => {};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabUrl();
    const queryParam = activeTab.url.split("?")[1];
    const urlParam = new URLSearchParams(queryParam);

    const currentVideoId = urlParam.get("v");
    if (activeTab.url.include("youtube.com/watch") && currentVideoId) {
        chrome.storage.sync.get(currentVideoId, (obj) => {
            bookmarkList = obj[currentVideoId]
                ? JSON.parse(obj[currentVideoId])
                : [];
            console.log(bookmarkList);
        });

        // view list of bookmarks
    } else {
        document.getElementById("bookmarks").innerHTML = "No bookmarks found";
    }
});
