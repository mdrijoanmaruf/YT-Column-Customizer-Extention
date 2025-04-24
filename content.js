function updateGridLayout(columnCount) {
  const gridItems = document.querySelectorAll('ytd-rich-grid-media');
  if (gridItems.length > 0) {
    const container = gridItems[0].closest('ytd-rich-grid-renderer');
    if (container) {
      container.style.setProperty('--ytd-rich-grid-items-per-row', columnCount);
    }
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateColumns') {
    updateGridLayout(request.columnCount);
  }
});

chrome.storage.sync.get(['columnCount'], function(result) {
  if (result.columnCount) {
    updateGridLayout(result.columnCount);
  }
});

const observer = new MutationObserver(function(mutations) {
  chrome.storage.sync.get(['columnCount'], function(result) {
    if (result.columnCount) {
      updateGridLayout(result.columnCount);
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });