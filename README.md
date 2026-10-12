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
Todas as imagens são fotos reais das obras, em `assets/img/obras/`,
tratadas por `tools/import-fotos.py` (ver `assets/img/README.md`).
Sem imagens de stock.

## Formulário de orçamento
Cada submissão segue por dois canais em paralelo:
1. **FormSubmit.co** → e-mail para `dizarro.pt@gmail.com`
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
- **Terceiros**: nenhum. Fontes em `assets/fonts` (`tools/self-host-fonts.py`) e selo do Zaask copiado para `assets/img/zaask-pro.svg` (refazer o download em zaask.pt/widget se o selo mudar).
  Imagens todas locais. Sem cookies de rastreio, sem banner.

## Build
Depois de mexer em textos PT, trabalhos (`js/portfolio-data.js`), cabeçalho/rodapé (`js/layout.js`) ou CSS:

```
node tools/build.mjs
```
Corre, por ordem: gen-seo (páginas `obra-*`, sitemap, JSON-LD) → build-css (bundle minificado) → prerender-layout (menu/rodapé no HTML) → sync-pt (texto PT) → apply-fx (CSP, loader, fontes, CSS) → img-attrs → verificação.
Fotos novas: `python tools/import-obras.py "<pasta>"` e `python tools/make-webp.py` antes do build.
O que falta fazer fora do código está em `docs/LANCAMENTO.md`.
