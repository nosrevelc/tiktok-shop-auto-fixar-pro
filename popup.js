
const $ = id => document.getElementById(id);
let currentTabId = null;

async function getTab() {
  const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
  currentTabId = tab?.id;
  return tab;
}

async function exec(func, args=[]) {
  const tab = await getTab();
  if (!tab?.id || !tab.url?.startsWith("https://shop.tiktok.com/"))
    throw new Error("Abra uma página do TikTok Shop primeiro.");
  return chrome.scripting.executeScript({
    target:{tabId:tab.id},
    world:"MAIN",
    func,
    args
  });
}

function installRunner(enabled) {
  // Esta função é serializada pelo Chrome e executada no MAIN world da página.
  if (!window.__TT_AUTO_FIXAR_V3_STATE__) {
    window.__TT_AUTO_FIXAR_V3_STATE__ = {
      enabled:false, count:0, last:null, found:false, timer:null, busyUntil:0
    };
  }
  const s = window.__TT_AUTO_FIXAR_V3_STATE__;
  s.enabled = enabled;

  function findButton() {
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.find(btn => {
      const txt = (btn.innerText || btn.textContent || "").replace(/\s+/g," ").trim();
      return txt.includes("+ 60 s") && !btn.disabled && btn.getAttribute("aria-disabled") !== "true";
    }) || null;
  }

  function tick() {
    const b = findButton();
    s.found = !!b;
    if (!s.enabled || !b || Date.now() < s.busyUntil) return;

    // Mesma ação que funcionou manualmente no Console.
    b.click();
    s.count += 1;
    s.last = new Date().toLocaleTimeString();
    s.busyUntil = Date.now() + 8000;
  }

  if (!s.timer) s.timer = setInterval(tick, 1000);
  tick();
  return {enabled:s.enabled,count:s.count,last:s.last,found:s.found};
}

function readState() {
  const s = window.__TT_AUTO_FIXAR_V3_STATE__;
  if (!s) return {installed:false,enabled:false,count:0,last:null,found:false};
  const buttons = Array.from(document.querySelectorAll("button"));
  const found = buttons.some(btn =>
    (btn.innerText || btn.textContent || "").replace(/\s+/g," ").trim().includes("+ 60 s")
  );
  s.found = found;
  return {installed:true,enabled:s.enabled,count:s.count,last:s.last,found:s.found};
}

async function setEnabled(enabled) {
  await chrome.storage.local.set({ttAutoFixarEnabled:enabled});
  await exec(installRunner,[enabled]);
  await refresh();
}

async function refresh() {
  try {
    const stored = await chrome.storage.local.get({ttAutoFixarEnabled:false});
    const r = await exec(readState);
    let st = r?.[0]?.result || {};
    if (stored.ttAutoFixarEnabled && !st.installed) {
      const rr = await exec(installRunner,[true]);
      st = rr?.[0]?.result || {};
    }

    $("toggle").textContent = stored.ttAutoFixarEnabled ? "DESATIVAR AUTO FIXAR" : "ATIVAR AUTO FIXAR";
    $("toggle").className = stored.ttAutoFixarEnabled ? "stop" : "start";
    $("state").textContent = st.enabled ? "ATIVO" : "DESATIVADO";
    $("state").className = st.enabled ? "ok" : "bad";
    $("found").textContent = st.found ? "ENCONTRADO" : "não visível agora";
    $("found").className = st.found ? "ok" : "warn";
    $("count").textContent = st.count ?? 0;
    $("last").textContent = st.last || "—";
    $("msg").textContent = st.found
      ? "O +60s está visível. Se estiver ativo, o clique é enviado automaticamente."
      : "Aguardando o TikTok exibir +60s.";
  } catch(e) {
    $("state").textContent = "ERRO";
    $("state").className = "bad";
    $("msg").textContent = e.message || String(e);
  }
}

$("toggle").onclick = async () => {
  const x = await chrome.storage.local.get({ttAutoFixarEnabled:false});
  try { await setEnabled(!x.ttAutoFixarEnabled); }
  catch(e){ $("msg").textContent=e.message || String(e); }
};

refresh();
setInterval(refresh,1000);
