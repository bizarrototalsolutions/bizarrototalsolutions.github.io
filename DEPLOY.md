# Publicar em dizarro.pt

Site **estático** — não há build. Publica-se a pasta como está.

## 1. GitHub Pages
1. `git push` da branch para o GitHub.
2. **Settings → Pages** → Source: *Deploy from a branch* → `main` / `/ (root)`.
3. O ficheiro [`CNAME`](CNAME) (conteúdo `dizarro.pt`) já está incluído. Em
   **Settings → Pages → Custom domain** deve aparecer `dizarro.pt`; liga
   **Enforce HTTPS**.

## 2. DNS (no registrador do dizarro.pt)
| Tipo  | Nome  | Valor |
|-------|-------|-------|
| A     | `@`   | `185.199.108.153` |
| A     | `@`   | `185.199.109.153` |
| A     | `@`   | `185.199.110.153` |
| A     | `@`   | `185.199.111.153` |
| AAAA  | `@`   | `2606:50c0:8000::153` |
| AAAA  | `@`   | `2606:50c0:8001::153` |
| AAAA  | `@`   | `2606:50c0:8002::153` |
| AAAA  | `@`   | `2606:50c0:8003::153` |
| CNAME | `www` | `<o-teu-user>.github.io.` |

## 3. Ativar o e-mail dos formulários (uma vez)
Na 1.ª submissão real do formulário de orçamento, o
[FormSubmit](https://formsubmit.co) envia um e-mail de confirmação para
`bizarrototalsolutions@gmail.com` com um botão **"Activate Form"**. Clicar
uma vez. A partir daí os pedidos chegam à caixa de entrada. (Em paralelo,
cada pedido fica sempre gravado na tabela `pedidos_site` do Supabase.)

## 4. Correr localmente
```
python -m http.server 8000
```
→ `http://localhost:8000`

## 5. Regenerar assets (opcional, requer `pip install Pillow`)
- `python tools/gen-brand.py` — favicons + `assets/brand/og-dizarro.jpg`
- `python tools/process-obras.py` — reprocessa as fotos das obras
- `python tools/optimize-images.py <pasta>` — comprime fotos novas

## 6. Otimizações que ficam por fazer (opcionais)
- **Self-host das fontes** (Archivo / Public Sans / IBM Plex Mono): baixar os
  `.woff2` para `assets/fonts/`, trocar o `<link>` do Google Fonts por
  `@font-face` locais. Remove o único pedido a terceiros e melhora o LCP.
- **Substituir imagens Unsplash** por fotos reais (ver `assets/img/README.md`).
- **Minificar** CSS/JS num passo de publicação, se se quiser.

## Notas
- `/app/` (CRM da equipa) e `/login.html` ficam `Disallow` no `robots.txt`.
- Os formulários usam o projeto Supabase `vjbvjzmxbeoyflhrwrpy`
  (chave `anon`, só INSERT em `pedidos_site`). Se estiver em pausa, reativar
  no dashboard para a cópia em base de dados voltar a funcionar — o e-mail
  via FormSubmit funciona de qualquer forma.
