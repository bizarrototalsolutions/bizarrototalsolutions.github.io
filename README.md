# BTS – Bizarro Total Solutions

Site institucional da **BTS – Bizarro Total Solutions** (Eletricidade, Carpintaria e Telecomunicações), pronto a publicar no **GitHub Pages**.

🔗 Estrutura 100% estática (HTML, CSS e JS puro — sem build, sem dependências de node para correr).

---

## 📁 Estrutura do projeto

```
.
├── index.html              # Página inicial
├── pages/
│   ├── servicos.html
│   ├── portfolio.html
│   ├── sobre.html
│   ├── contactos.html      # Formulário de contacto
│   └── orcamento.html      # Formulário de pedido de orçamento
├── css/
│   ├── variables.css       # Cores, espaçamentos, tipografia (tokens)
│   ├── base.css             # Reset, navbar, footer, botões flutuantes
│   ├── home.css             # Estilos exclusivos da homepage
│   └── pages.css            # Estilos das páginas internas e formulários
├── js/
│   ├── main.js               # Navegação, tema, FAQ, contadores, formulários
│   └── particles.js          # Fundo animado 3D do hero (Three.js)
└── assets/
    └── images/
        └── logo-bts.jpg
```

---

## ✉️ Como funciona o envio de e-mails (formulário de Contacto e de Orçamento)

Este é um site **estático** (sem servidor próprio), por isso não é possível ligar diretamente a um servidor SMTP sem expor credenciais no browser — isso seria inseguro.

A solução usada é o **[FormSubmit.co](https://formsubmit.co)**, um serviço gratuito que recebe os dados do formulário e envia-os por e-mail (via SMTP do lado deles) diretamente para:

```
bizarrototalsolutions@gmail.com
```

Não precisas de criar conta nem gerar chaves de API — funciona só com o endereço de e-mail no `action` do formulário.

### ⚠️ Passo obrigatório — Ativar o e-mail (só da primeira vez)

Assim que o site for publicado e alguém submeter o **primeiro formulário** (contacto ou orçamento), o FormSubmit vai enviar automaticamente um **e-mail de confirmação** para `bizarrototalsolutions@gmail.com` com um link de ativação.

👉 É preciso abrir esse e-mail e clicar em **"Activate Form"** uma única vez. A partir daí, todos os próximos formulários chegam normalmente à caixa de entrada, já formatados em tabela, com o assunto configurado (ex: *"💰 Novo pedido de orçamento — Site BTS"*).

Se quiseres testar antes de publicar, podes simplesmente abrir o `orcamento.html` ou `contactos.html` localmente no browser e submeter um formulário de teste — o e-mail de ativação será enviado da mesma forma.

### O que já está configurado nos formulários:

- ✅ Nome do assunto automático (`_subject`)
- ✅ Formato de tabela legível no e-mail (`_template=table`)
- ✅ Sem reCAPTCHA (`_captcha=false`) para não atrapalhar o cliente
- ✅ Campo *honeypot* escondido (`_honey`) contra spam/bots
- ✅ Validação de campos obrigatórios no browser antes de enviar
- ✅ Mensagem de sucesso inline após envio, sem sair da página (AJAX)

### Quiseres mudar o e-mail de destino?

Basta substituir `bizarrototalsolutions@gmail.com` pelo novo endereço em **dois sítios**:
- `pages/contactos.html` → atributo `action` do `<form id="contact-form">`
- `pages/orcamento.html` → atributo `action` do `<form id="quote-form">`

E repetir o processo de ativação por e-mail descrito acima.

---

## 🎨 Fundo animado do Hero (Three.js)

A página inicial tem um campo de partículas 3D subtil, nas cores da marca (dourado e azul), atrás do texto principal — com um efeito de paralaxe ao mover o rato. É gerado por `js/particles.js`, usando a biblioteca [Three.js](https://threejs.org) (via CDN, r128), e respeita a preferência do sistema `prefers-reduced-motion` para quem prefere menos animações.

Este efeito só corre na homepage (`index.html`).

---

## 🚀 Publicar no GitHub Pages

1. Cria um novo repositório no GitHub (ex: `bizarrototalsolutions.github.io` se quiseres o domínio raiz, ou qualquer outro nome).
2. Dentro da pasta deste projeto, corre:
   ```bash
   git init
   git add .
   git commit -m "Site BTS - versão inicial"
   git branch -M main
   git remote add origin https://github.com/<o-teu-user>/<o-nome-do-repo>.git
   git push -u origin main
   ```
3. No GitHub, vai a **Settings → Pages**.
4. Em **Source**, escolhe a branch `main` e a pasta `/ (root)`.
5. Guarda. Em 1-2 minutos o site fica disponível em:
   ```
   https://<o-teu-user>.github.io/<o-nome-do-repo>/
   ```
   (ou `https://<o-teu-user>.github.io/` se o repositório se chamar `<o-teu-user>.github.io`)

> 💡 Nota: se publicares numa subpasta (não no domínio raiz), os links internos já usam caminhos relativos (`pages/...`, `../index.html`, etc.), por isso não precisas de alterar nada.

---

## 🖥️ Testar localmente

Como não há build nem dependências, basta abrir o `index.html` diretamente no browser, ou correr um servidor local simples (recomendado, para o `fetch()` dos formulários funcionar sem restrições de `file://`):

```bash
# Python 3
python3 -m http.server 8000

# ou com Node (npx)
npx serve .
```

E depois visitar `http://localhost:8000`.

---

## 🛠️ Notas técnicas

- **Tema claro/escuro**: alternável pelo botão 🌙/☀️ na navbar, guardado em `localStorage`.
- **Acessibilidade**: `aria-label`, `aria-expanded`, `aria-hidden` usados em navegação, FAQ e menu mobile.
- **SEO**: meta tags Open Graph e Twitter Card já configuradas em `index.html` — atualiza a `og:url` e `canonical` para o domínio final depois de publicares.
- **WhatsApp**: botão flutuante e CTAs já apontam para `+351 932 344 080` — atualiza o número em `js/main.js`/HTML se mudar.

---

© 2025 BTS – Bizarro Total Solutions · Padrão da Légua, Porto
