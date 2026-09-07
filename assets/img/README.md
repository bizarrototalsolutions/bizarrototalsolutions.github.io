# Imagens do site

## Fotos reais das obras — `assets/img/obras/`
Já processadas para a web (`python tools/process-obras.py` a partir dos originais).
Cada foto tem duas versões:
- `nome.jpg` — lado maior 1920 px (faixas / detalhe)
- `nome-4x3.jpg` — recorte 1200×900 (cartões / grelha)

Ficheiros atuais: `tv-wall-1`, `tv-wall-2`, `diogo-fixando`, `rede-antes`, `rede-depois`.

### Adicionar fotos novas
1. Junta os originais numa pasta e corre:
   ```
   python tools/process-obras.py            # usa o mapa dentro do script
   ```
   ou, para uma pasta qualquer:
   ```
   python tools/optimize-images.py assets/img/obras/nova-pasta
   ```
2. Aponta os caminhos em `js/portfolio-data.js` (`capa`, `galeria`, `antesDepois`).
3. Nas páginas de serviço, troca os `src` que apontam para stock (ver abaixo).

## Imagens de stock (provisórias)
Algumas imagens vêm do **Unsplash** (`images.unsplash.com/...`) — uso livre,
sem atribuição obrigatória. São **provisórias**: substitui por fotos tuas
quando as tiveres. Onde estão:
- `index.html` — faixa "eletricista ao quadro", plates de carpintaria/domótica
- `carpintaria.html` — 3 plates + faixa
- `domotica.html` — faixa
- `servicos.html` — cartões de carpintaria e domótica
- `js/portfolio-data.js` — nada (usa só fotos reais; projetos sem foto mostram placeholder)

## Formato recomendado para fotos novas
| Uso            | Proporção | Lado maior | Peso |
|----------------|-----------|------------|------|
| Herói / faixa  | livre     | 1920 px    | <240 KB |
| Cartão / grelha| 4:3       | 1200 px    | <120 KB |
| Galeria        | livre     | 1600 px    | <200 KB |

JPG qualidade ~78, progressivo.
