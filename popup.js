const toggle = document.getElementById('toggleSwitch');
const status = document.getElementById('status');
const settingsLink = document.getElementById('settingsLink');
const settingsPanel = document.getElementById('settings');
const scrollTop = document.getElementById('scrollTop');
const debugLogs = document.getElementById('debugLogs');

function updateStatus(isEnabled) {
  status.textContent = isEnabled
    ? "✅ ThreadFlip is ENABLED"
    : "❌ ThreadFlip is DISABLED";
}

chrome.storage.sync.get(['enabled', 'scrollTop', 'debugLogs'], (result) => {
  const enabled = !!result.enabled;
  toggle.checked = enabled;
  updateStatus(enabled);

  scrollTop.checked = !!result.scrollTop;
  debugLogs.checked = !!result.debugLogs;
});

toggle.addEventListener('change', () => {
  const newState = toggle.checked;
  chrome.storage.sync.set({ enabled: newState }, () => {
    updateStatus(newState);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url.includes("mail.google.com")) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: () => {
            chrome.runtime.sendMessage({ action: "flipNow" });
          }
        });
      }
    });
  });
});

scrollTop.addEventListener('change', () => {
  chrome.storage.sync.set({ scrollTop: scrollTop.checked });
});

debugLogs.addEventListener('change', () => {
  chrome.storage.sync.set({ debugLogs: debugLogs.checked });
});

settingsLink.addEventListener('click', () => {
  settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
});
