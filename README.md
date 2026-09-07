# Dizarro — site

Site institucional da **Dizarro** (ex-*BTS / Bizarro Total Solutions*):
eletricidade, telecomunicações e redes, carpintaria à medida e domótica na
região do Porto.

**100% estático** — HTML, CSS e JS puro, sem build. Domínio: **dizarro.pt**.
Design "folha de projeto": grafite + papel + azul de blueprint, com uma cor
forte (laranja de obra); tipos Archivo + Public Sans + IBM Plex Mono.

## Páginas
```
index.html            Home (foto-forward, secções numeradas)
servicos.html         Hub dos 4 serviços
eletricidade.html
telecomunicacoes.html  (com antes/depois real)
carpintaria.html
domotica.html
portfolio.html + projeto.html   grelha + detalhe (js/portfolio-data.js)
sobre.html
contactos.html        contactos + formulário de orçamento
politica-privacidade.html
app/  login.html       CRM interno da equipa (inalterado)
```

## Ficheiros que se editam mais
| Quero mudar… | Onde |
|---|---|
| Menu, rodapé, telefone, redes | `js/layout.js` (`BRAND` + `NAV`) |
| Cores / tipografia / medidas | `css/tokens.css` |
| Projetos do portfólio | `js/portfolio-data.js` (+ fotos em `assets/img/`) |
| Texto das páginas | diretamente no HTML de cada página |

Cada página tem só `<main>` + `<div data-layout="header">` / `="footer">`.
O `js/layout.js` injeta o cabeçalho e o rodapé — mexe-se **uma vez**.

## Fotos
Fotos reais das obras em `assets/img/obras/` (processadas por
`tools/process-obras.py`). Algumas imagens de serviço são **stock Unsplash
provisório** — trocar por fotos reais (ver `assets/img/README.md`).

## Formulário de orçamento
Cada submissão segue por dois canais em paralelo:
1. **FormSubmit.co** → e-mail para `bizarrototalsolutions@gmail.com`
   (precisa de ativação única — ver `DEPLOY.md`).
2. **Supabase** → linha em `pedidos_site` (chave `anon`, só INSERT).

Conta como enviado se **um** dos dois funcionar.

## Correr / publicar
```
python -m http.server 8000
```
Publicar: ver [`DEPLOY.md`](DEPLOY.md).

## Notas técnicas
- **Tema** claro/escuro/sistema — botão na navbar, guardado em
  `localStorage` (`dizarro-theme`). Um script inline no `<head>` aplica-o
  antes do primeiro paint.
- **SEO**: `canonical` / Open Graph / Twitter em todas as páginas; JSON-LD
  `HomeAndConstructionBusiness` + `FAQPage` na home, `Service` +
  `BreadcrumbList` nas de serviço, `CreativeWork` por projeto.
  `robots.txt` + `sitemap.xml` com `https://dizarro.pt`.
- **Acessibilidade**: skip-link, `aria-current`, foco visível, respeita
  `prefers-reduced-motion`.
- **Terceiros**: só o Google Fonts (pode ser self-hosted — ver `DEPLOY.md`)
  e as imagens Unsplash provisórias. Sem cookies de rastreio, sem banner.
