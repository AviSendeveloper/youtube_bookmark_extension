export async function getActiveTabUrl() {
    const querySting = {
        active: true,
        currentWindow: true,
    };

    const [tab] = await chrome.tab.query(querySting);
    return tab;
}
