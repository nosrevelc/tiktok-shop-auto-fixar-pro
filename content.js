// content.js - Executado automaticamente na página do TikTok Shop LIVE

(function() {
  if (window.__TT_AUTO_FIXAR_CONTENT_LOADED__) {
    return;
  }
  window.__TT_AUTO_FIXAR_CONTENT_LOADED__ = true;

  const state = {
    enabled: false,
    cooldownSeconds: 8,
    soundEnabled: true,
    clickCount: 0,
    lastClickTime: null,
    busyUntil: 0,
    buttonFound: false,
    timer: null
  };

  // Carrega configurações salvas
  chrome.storage.local.get({
    ttAutoFixarEnabled: false,
    cooldownSeconds: 8,
    soundEnabled: true,
    clickCount: 0,
    lastClickTime: null
  }, (data) => {
    state.enabled = Boolean(data.ttAutoFixarEnabled);
    state.cooldownSeconds = Number(data.cooldownSeconds) || 8;
    state.soundEnabled = Boolean(data.soundEnabled);
    state.clickCount = Number(data.clickCount) || 0;
    state.lastClickTime = data.lastClickTime || null;
    startLoop();
  });

  // Reage imediatamente a alterações no popup sem precisar de F5
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    if (changes.ttAutoFixarEnabled !== undefined) {
      state.enabled = Boolean(changes.ttAutoFixarEnabled.newValue);
    }
    if (changes.cooldownSeconds !== undefined) {
      state.cooldownSeconds = Number(changes.cooldownSeconds.newValue) || 8;
    }
    if (changes.soundEnabled !== undefined) {
      state.soundEnabled = Boolean(changes.soundEnabled.newValue);
    }
    if (changes.clickCount !== undefined) {
      state.clickCount = Number(changes.clickCount.newValue) || 0;
    }
  });

  // Som suave de confirmação (sem arquivos externos)
  function playBeep() {
    if (!state.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Tom agradável A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
      // Navegadores podem restringir áudio antes do primeiro clique do usuário
    }
  }

  // Busca resiliente do botão usando Regex
  function findRenewButton() {
    const candidates = Array.from(document.querySelectorAll("button, [role='button']"));
    const regex = /\+\s*60\s*s/i;

    return candidates.find(btn => {
      // Ignora se estiver desativado
      if (btn.disabled || btn.getAttribute("aria-disabled") === "true") {
        return false;
      }

      // Verifica texto visível em si e em filhos
      const text = (btn.innerText || btn.textContent || "").replace(/\s+/g, " ").trim();
      if (regex.test(text)) return true;

      // Verifica atributos de acessibilidade
      const aria = btn.getAttribute("aria-label") || btn.getAttribute("title") || "";
      if (regex.test(aria)) return true;

      return false;
    }) || null;
  }

  // Disparo robusto de cliques para compatibilidade com React/Vue
  function triggerClick(element) {
    try {
      ["pointerdown", "mousedown", "pointerup", "mouseup", "click"].forEach(eventType => {
        const evt = new MouseEvent(eventType, {
          bubbles: true,
          cancelable: true,
          view: window
        });
        element.dispatchEvent(evt);
      });

      if (typeof element.click === "function") {
        element.click();
      }
    } catch (err) {
      console.warn("[AutoFixar] Fallback clique padrão:", err);
      element.click();
    }
  }

  // Ciclo de verificação
  function tick() {
    const btn = findRenewButton();
    const foundNow = Boolean(btn);

    if (foundNow !== state.buttonFound) {
      state.buttonFound = foundNow;
      chrome.storage.local.set({ buttonFound: foundNow });
    }

    if (!state.enabled) return;
    if (!btn) return;
    if (Date.now() < state.busyUntil) return;

    // Dispara a renovação
    triggerClick(btn);
    state.clickCount += 1;
    state.lastClickTime = new Date().toLocaleTimeString();
    state.busyUntil = Date.now() + (state.cooldownSeconds * 1000);

    playBeep();

    chrome.storage.local.set({
      clickCount: state.clickCount,
      lastClickTime: state.lastClickTime,
      lastStatus: "Renovado com sucesso!"
    });

    try {
      chrome.runtime.sendMessage({
        type: "UPDATE_BADGE",
        enabled: true,
        count: state.clickCount
      });
    } catch (e) {}
  }

  function startLoop() {
    if (!state.timer) {
      state.timer = setInterval(tick, 1000);
    }
    tick();
  }

  // Responde a mensagens do popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "PING") {
      const btn = findRenewButton();
      state.buttonFound = Boolean(btn);
      sendResponse({
        ok: true,
        buttonFound: state.buttonFound,
        enabled: state.enabled,
        clickCount: state.clickCount,
        lastClickTime: state.lastClickTime
      });
    }
    return true;
  });

  console.log("[TikTok Auto Fixar Pro] Módulo de monitoramento carregado e ativo.");
})();
