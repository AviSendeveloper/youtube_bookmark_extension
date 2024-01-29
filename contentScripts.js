let youtubeLeftControlls = "",
    youtubePlayer = "";
let currentVideoId = "";
let BookmarkList = [];

/**
 * Asynchronous function to handle the event when a new video is loaded.
 *
 * @return {void}
 */
const newVideoLoaded = async () => {
    youtubeLeftControlls =
        document.getElementsByClassName("ytp-right-controls")[0];
    youtubePlayer = document.getElementsByClassName("video-stream")[0];
    BookmarkList = await fetchBookmarks();

    const timestampButton = document.getElementsByClassName("ytb-bookmark")[0];
    if (!timestampButton) {
        // create new button
        const button = document.createElement("button");
        button.classList.add(["ytb-bookmark"]);
        button.innerText = "Add Bookmark";
        button.addEventListener("click", bookmarkClickHandler);

        // append button to youtubeLeftControlls
        youtubeLeftControlls.appendChild(button);
    }
};

/**
 * Click handler for bookmarking the current video timestamp and saving it to chrome storage.
 *
 * @return {Promise<void>} A promise that resolves when the bookmark is successfully saved.
 */
const bookmarkClickHandler = async () => {
    const currentVideoTimestamp = youtubePlayer.currentTime;
    const newBookmark = {
        time: currentVideoTimestamp,
        desc: `Bookmarked at ${getTime(currentVideoTimestamp)}`,
    };

    const updatedBookmarkList = [...BookmarkList, newBookmark].sort(
        (a, b) => a.time - b.time
    );

    chrome.storage.sync.set({
        [currentVideoId]: JSON.stringify(updatedBookmarkList),
    });

    BookmarkList = updatedBookmarkList;
};

/**
 * Returns a ISO string representation of the given timestamp.
 *
 * @param {number} timestamp - The timestamp in seconds.
 * @return {string} The ISO string representation of the timestamp.
 */
const getTime = (timestamp) => {
    const date = new Date(0);
    date.setSeconds(timestamp);
    return date.toISOString();
};

/**
 * Fetches bookmarks from Chrome storage for the current video ID.
 *
 * @return {Promise} A Promise that resolves to an array of bookmarks for the current video ID.
 */
const fetchBookmarks = () => {
    return new Promise((reslove) => {
        chrome.storage.sync.get(currentVideoId, (obj) => {
            reslove(obj[currentVideoId] ? JSON.parse(obj[currentVideoId]) : []);
        });
    });
};

(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, videoId } = obj;

        if (type === "NEW") {
            currentVideoId = videoId;
            newVideoLoaded();
        }
    });

    newVideoLoaded();
})();
