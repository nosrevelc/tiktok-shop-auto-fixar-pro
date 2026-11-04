// background.js - Gerencia badges e sincronização em segundo plano

function updateBadge(enabled, count) {
  try {
    if (!enabled) {
      chrome.action.setBadgeText({ text: "" });
      return;
    }
    const text = (typeof count === "number" && count > 0) ? String(count) : "ON";
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color: "#25d883" });
  } catch (e) {
    // Silencia erros se o contexto da extensão estiver reiniciando
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get({
    ttAutoFixarEnabled: false,
    clickCount: 0,
    cooldownSeconds: 8,
    soundEnabled: true
  }, (items) => {
    chrome.storage.local.set(items);
    updateBadge(items.ttAutoFixarEnabled, items.clickCount);
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "UPDATE_BADGE") {
    updateBadge(msg.enabled, msg.count);
    sendResponse({ ok: true });
  }
  return true;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    chrome.storage.local.get(["ttAutoFixarEnabled", "clickCount"], (res) => {
      updateBadge(Boolean(res.ttAutoFixarEnabled), res.clickCount || 0);
    });
  }
});
