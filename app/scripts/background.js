'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  if (tab.url.toLowerCase().indexOf('www.mindmeister.com') !== -1) {
    chrome.pageAction.show(tabId);
  }
});
