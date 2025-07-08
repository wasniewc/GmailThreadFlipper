console.log("🚀 ThreadFlip FINAL BOSS MODE — REAL-TIME OFF with explicit state");

let debugLogs = true;
let scrollTop = false;
let isEnabled = false;

chrome.storage.sync.get(['enabled', 'scrollTop', 'debugLogs'], (result) => {
  isEnabled = !!result.enabled;
  scrollTop = result.scrollTop;
  debugLogs = result.debugLogs;
  if (debugLogs) console.log(`🔑 Loaded — Enabled: ${isEnabled} | ScrollTop: ${scrollTop}`);
  watchForThreads();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    isEnabled = changes.enabled.newValue;
    if (debugLogs) console.log(`⚙️ Toggle changed → Enabled: ${isEnabled}`);
    forceFlipOrRestore();
  }
});

function watchForThreads() {
  let currentThread = null;

  const rootObserver = new MutationObserver(() => {
    const newThread = document.querySelector('div[role="list"]');
    if (newThread && newThread !== currentThread) {
      currentThread = newThread;
      if (debugLogs) console.log(`📌 NEW thread container detected`);
      flipOrRestore(newThread);
    }
  });

  rootObserver.observe(document.body, { childList: true, subtree: true });

  const first = document.querySelector('div[role="list"]');
  if (first) {
    currentThread = first;
    flipOrRestore(first);
  }
}

function forceFlipOrRestore() {
  const thread = document.querySelector('div[role="list"]');
  if (thread) flipOrRestore(thread);
}

function flipOrRestore(thread) {
  const messages = Array.from(thread.children).filter(el => el.tagName === "DIV");
  if (messages.length < 2) {
    if (debugLogs) console.log(`ℹ️ Not enough messages (${messages.length})`);
    return;
  }

  const isFlipped = thread.dataset.flipped === "true";

  if (isEnabled && !isFlipped) {
    if (debugLogs) console.log(`🔄 Flipping ${messages.length}`);
    messages.reverse().forEach(m => thread.appendChild(m));
    thread.dataset.flipped = "true";
    if (scrollTop) window.scrollTo(0, 0);
    showBanner("✅ Thread flipped");
  } else if (!isEnabled && isFlipped) {
    if (debugLogs) console.log(`↩️ Restoring ${messages.length}`);
    messages.reverse().forEach(m => thread.appendChild(m));
    thread.dataset.flipped = "";
    showBanner("↩️ Thread restored");
  } else {
    if (debugLogs) console.log(`✅ No action needed`);
  }
}

function showBanner(html) {
  if (document.getElementById('threadReverserBanner')) return;

  const banner = document.createElement('div');
  banner.id = 'threadReverserBanner';
  banner.innerHTML = html;

  banner.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: #fff;
    padding: 12px 18px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 99999;
    transition: opacity 0.5s ease-in-out;
    max-width: 250px;
    line-height: 1.4;
  `;

  document.body.appendChild(banner);

  setTimeout(() => {
    banner.style.opacity = 0;
    setTimeout(() => banner.remove(), 600);
  }, 2000);
}
