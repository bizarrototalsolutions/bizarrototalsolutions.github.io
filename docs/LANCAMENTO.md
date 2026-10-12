# Dizarro — checklist de lançamento (o que falta fazer FORA do código)

O site está tecnicamente pronto. Para começar a render, faltam passos que só o dono pode fazer (contas e dados reais).

## 1. Antes do 1.º cliente (obrigatório)
- [ ] **Ativar o formulário**: enviar 1 pedido de teste em dizarro.pt/contactos.html e clicar em *Activate Form* no email que chega a dizarro.pt@gmail.com. Sem isto os pedidos não chegam.
- [ ] **Testar o WhatsApp e o telefone** (932 344 080) a partir de um telemóvel.
- [ ] **Confirmar as 3 opiniões da home** ("O que dizem os clientes"): só podem ficar se forem de clientes reais e autorizadas. Opiniões inventadas são ilegais (UE/PT) e o Google penaliza. Se não forem reais, apagar a secção ou trocar por opiniões reais (Zaask/Google).
- [ ] **Identificação legal** (DL 7/2004): quando a atividade estiver aberta, mostrar nome/denominação, NIF e contacto (email) no site — por exemplo na política de privacidade ou numa página "Aviso legal". Ainda não está no site porque não tenho os dados.
- [ ] **Livro de Reclamações Eletrónico**: se a atividade o exigir, registar em livroreclamacoes.pt e pôr o link no rodapé. Confirmar com o contabilista.

## 2. Google (SEO local) — a maior fonte de clientes
- [ ] **Google Search Console**: adicionar dizarro.pt (propriedade de domínio, verificação por DNS) e submeter https://dizarro.pt/sitemap.xml. Pedir indexação das 9 páginas principais.
- [ ] **Perfil de Empresa Google** (Google Business Profile): criar como *empresa com deslocação ao cliente* (sem mostrar morada), categoria principal "Eletricista" + secundárias "Carpinteiro", "Pintor", "Serviço de montagem de móveis". Área de serviço: Porto + concelhos à volta. Site: https://dizarro.pt. Telefone e nome **iguais** ao site (NAP).
- [ ] Pôr no perfil as mesmas fotos (com a etiqueta DIZARRO) e pedir **opiniões a cada cliente satisfeito** (envia o link curto do perfil por WhatsApp no fim do trabalho). 10 opiniões reais mudam tudo.
- [ ] **Bing Webmaster Tools**: importar do Search Console (1 clique). O Bing alimenta o ChatGPT/Copilot.

## 3. Consistência de nome e contactos (NAP)
Usar exatamente o mesmo nome, telefone e site em: Google, Facebook, Instagram (@dizarropt), TikTok, Zaask, WhatsApp Business. Pôr **https://dizarro.pt** na bio de todas as redes.

## 4. Medir (para saber o que funciona)
- [ ] Criar conta gratuita de análise sem cookies (ex.: GoatCounter ou Cloudflare Web Analytics) e dar-me o código para eu pôr no site. Evita aviso de cookies.
- [ ] Anotar de onde vem cada cliente ("Como nos conheceu?") durante 3 meses.

## 5. Email profissional
- [ ] Configurar info@dizarro.pt → reencaminha para dizarro.pt@gmail.com (ver `docs/EMAIL.md`, rota gratuita ImprovMX).

## 6. Mais tarde (≈ 3 meses de atividade)
- [ ] Login/CRM: restaurar o projeto Supabase `bizarrototalsolutions` e criar utilizador (ver `DEPLOY.md`).
- [ ] Páginas por zona (ex.: "Eletricista em Matosinhos") só quando houver trabalhos reais nessa zona para mostrar — evita conteúdo fraco.
- [ ] Abrir espaço físico → atualizar morada, horário e Google Business Profile.

## Como reconstruir o site depois de mexer
```
node tools/build.mjs
```
(fotos novas: `python tools/import-obras.py "<pasta>"` e `python tools/make-webp.py` antes.)
