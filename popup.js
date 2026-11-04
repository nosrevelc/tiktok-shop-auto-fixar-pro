// popup.js - Gerencia interface do usuário e preferências

const $ = id => document.getElementById(id);

async function getActiveTikTokTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url && tab.url.startsWith("https://shop.tiktok.com/")) {
    return tab;
  }
  return null;
}

// Garante que o content script esteja ativo na aba atual
async function ensureContentScriptInjected(tabId) {
  try {
    const res = await chrome.tabs.sendMessage(tabId, { type: "PING" });
    return res;
  } catch (err) {
    // Se a aba foi aberta antes de recarregar a extensão, injeta sob demanda
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
      });
      // Tenta pingar novamente
      return await chrome.tabs.sendMessage(tabId, { type: "PING" });
    } catch (injectErr) {
      return null;
    }
  }
}

async function render() {
  const data = await chrome.storage.local.get({
    ttAutoFixarEnabled: false,
    clickCount: 0,
    lastClickTime: null,
    buttonFound: false,
    cooldownSeconds: 8,
    soundEnabled: true
  });

  const isEnabled = Boolean(data.ttAutoFixarEnabled);
  const tab = await getActiveTikTokTab();

  // Botão Principal
  $("toggle").textContent = isEnabled ? "DESATIVAR AUTO FIXAR" : "ATIVAR AUTO FIXAR";
  $("toggle").className = "main-btn " + (isEnabled ? "stop" : "start");

  // Status
  $("state").textContent = isEnabled ? "ATIVO" : "DESATIVADO";
  $("state").className = isEnabled ? "ok" : "bad";

  // Contador e Último Clique
  $("count").textContent = data.clickCount ?? 0;
  $("last").textContent = data.lastClickTime || "—";

  // Configurações
  $("selCooldown").value = String(data.cooldownSeconds);
  $("chkSound").checked = Boolean(data.soundEnabled);

  // Status do Botão na página
  if (!tab) {
    $("found").textContent = "Fora do TikTok Shop";
    $("found").className = "warn";
    $("msg").textContent = "Abra ou mude para a aba do TikTok Shop Live Console.";
    return;
  }

  // Ping na página para status ao vivo
  const pingRes = await ensureContentScriptInjected(tab.id);
  const isFound = pingRes?.buttonFound ?? data.buttonFound;

  if (isFound) {
    $("found").textContent = "DETECTADO (+60s)";
    $("found").className = "ok";
    $("msg").textContent = isEnabled
      ? "Tudo pronto! O auto-fixar renovará o produto continuamente."
      : "Botão encontrado. Clique em 'ATIVAR' para começar.";
  } else {
    $("found").textContent = "Não visível agora";
    $("found").className = "warn";
    $("msg").textContent = isEnabled
      ? "Monitorando a tela... O clique será dado assim que o botão aparecer."
      : "Aguardando o botão +60s aparecer na live.";
  }
}

// Alternar Ativar / Desativar
$("toggle").onclick = async () => {
  const data = await chrome.storage.local.get({ ttAutoFixarEnabled: false });
  const newState = !data.ttAutoFixarEnabled;
  await chrome.storage.local.set({ ttAutoFixarEnabled: newState });

  const tab = await getActiveTikTokTab();
  if (tab?.id) {
    await ensureContentScriptInjected(tab.id);
  }
  await render();
};

// Zerar contador
$("btnReset").onclick = async () => {
  await chrome.storage.local.set({ clickCount: 0 });
  await render();
};

// Salvar tempo de cooldown
$("selCooldown").onchange = async () => {
  const cooldownSeconds = Number($("selCooldown").value) || 8;
  await chrome.storage.local.set({ cooldownSeconds });
};

// Salvar preferência de som
$("chkSound").onchange = async () => {
  await chrome.storage.local.set({ soundEnabled: $("chkSound").checked });
};

// Atualiza a tela automaticamente se o script em segundo plano mudar dados no storage
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    render();
  }
});

// Renderização inicial e atualização periódica enquanto o popup estiver aberto
render();
setInterval(render, 1000);
