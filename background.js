chrome.runtime.onInstalled.addListener(() => {
  console.log("🚀 ThreadFlip by Waz installed & ready.");
});

// OPTIONAL: If you need to handle future messages (not needed for basic toggle)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("📡 Background got a message:", msg);

  // Example: If you *do* something async here, return true:
  // setTimeout(() => {
  //   sendResponse("OK");
  // }, 1000);
  // return true;

  // If no async work, just respond immediately:
  sendResponse("OK");
  // And DO NOT return true here.
});
