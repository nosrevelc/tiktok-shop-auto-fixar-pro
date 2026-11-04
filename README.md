# 🚀 TikTok Shop Auto Fixar PRO (v3.1.0)

> **Extensão para Google Chrome / Microsoft Edge / Brave que automatiza a renovação contínua da fixação de produtos (+60s) no TikTok Shop LIVE Console.**

---

## 🌟 Sobre o Projeto e Cortesia Bomsite

Este utilitário foi baseado na ideia original de automação criada por **Uélinton Morelli** ([@soumorelli](https://www.instagram.com/soumorelli)).

A versão **PRO (v3.1.0)** foi aprimorada, refatorada e disponibilizada publicamente como uma **cortesia da [Bomsite.shop](https://bomsite.shop)** para toda a comunidade de criadores, lojistas e streamers de Live Commerce.

> 💡 **Conheça a Bomsite**: Empresa especializada em desenvolvimento web de alta performance, automações de vendas, criação de plataformas, e-commerces e integrações personalizadas para alavancar negócios digitais. Acesse: **[bomsite.shop](https://bomsite.shop)**.

---

## ✨ O que há de novo na Versão 3.1.0 PRO?

| Funcionalidade | Versão Original (v3) | Versão 3.1.0 PRO (Bomsite) |
| :--- | :--- | :--- |
| **Execução em Segundo Plano** | Dependia de abrir o popup manualmente para injetar o script | **100% Automática via `content_scripts`**: Continua rodando mesmo se você der F5 na página |
| **Identificação do Botão** | Busca de texto rígida (`+ 60 s`) | **Regex Dinâmico**: Identifica `+60s`, `+ 60s`, `+ 60 s` e atributos de acessibilidade |
| **Disparo de Eventos** | Apenas `.click()` básico | **Ciclo Completo de Ponteiro**: Emite `pointerdown`, `mousedown`, `pointerup`, `mouseup` e `.click()` |
| **Monitoramento Visual** | Exigia abrir o popup para checar se estava ativo | **Badge no Ícone**: Exibe **ON** em verde ou o **número de renovações** na barra de extensões |
| **Feedback Sonoro** | Nenhum | **Bip Suave Opcional**: Avise que o produto foi renovado sem você precisar olhar para a tela |
| **Personalização** | Cooldown fixo de 8s | **Intervalo Ajustável**: Escolha 5s, 8s, 10s ou 15s conforme sua preferência |
| **Controle de Sessão** | Contador não zerável | **Botão Zerar**: Reinicie a contagem a cada nova transmissão ao vivo |

---

## 📥 Como Instalar (Passo a Passo)

### 1. Baixar os arquivos
1. Clique no botão verde **Code** no topo desta página e selecione **Download ZIP** (ou clone o repositório).
2. Extraia a pasta baixada em um local definitivo no seu computador (ex: `C:\Projetos\tiktok-shop-auto-fixar-pro`).

### 2. Ativar no Chrome / Edge / Brave
1. Abra o navegador e digite na barra de endereços:
   ```text
   chrome://extensions
   ```
2. No canto superior direito, ative a chave **"Modo do desenvolvedor"**.
3. Clique no botão **"Carregar sem compactação"** (canto superior esquerdo).
4. Selecione a pasta onde você descompactou os arquivos.
5. Pronto! O ícone da extensão aparecerá na sua barra de ferramentas (recomendamos clicar no ícone de "quebra-cabeça" do Chrome e **fixar** a extensão na barra).

---

## 🔄 Como Atualizar (se você já usava a versão antiga)

1. Acesse `chrome://extensions`.
2. Localize a versão antiga do TikTok Auto Fixar e clique em **Remover** (para evitar duplicidade).
3. Clique em **"Carregar sem compactação"** e selecione a pasta da versão nova **3.1.0 PRO**.
4. Recarregue (F5) a aba do TikTok Shop Live Console.

---

## 🎮 Como Usar na Live

1. Abra o **TikTok Shop LIVE Console** (`https://shop.tiktok.com`) no seu navegador.
2. Inicie a sua transmissão e **fixe o produto** desejado manualmente pela primeira vez.
3. Clique no ícone do **TikTok Auto Fixar PRO** na barra do navegador.
4. Clique no botão verde **"ATIVAR AUTO FIXAR"**.
5. O status passará para **ATIVO** e o ícone mostrará uma etiqueta verde indicando o funcionamento.
6. A cada vez que o TikTok exibir o botão `+60s`, a extensão renovará a fixação automaticamente para que o produto permaneça em destaque durante toda a live!

---

## 🛡️ Segurança e Privacidade

- **Código 100% Aberto e Auditado**: Não há coleta de dados, envio de cookies, telemetria ou comunicação com servidores externos.
- **Permissões Mínimas**: Opera estritamente dentro do domínio oficial `https://shop.tiktok.com/*`.

---

## 🤝 Créditos e Contato

- **Idealização Original:** [Uélinton Morelli (@soumorelli)](https://www.instagram.com/soumorelli)
- **Refatoração, Melhorias PRO e Manutenção:** [Bomsite.shop](https://bomsite.shop)
- **Dúvidas, sugestões ou suporte para seu e-commerce:** Entre em contato pelo site oficial **[https://bomsite.shop](https://bomsite.shop)**.
