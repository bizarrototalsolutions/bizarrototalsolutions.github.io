# Imagens do site

## Fotos reais das obras — `assets/img/obras/`
Todas as imagens do site são fotos reais de trabalhos da Dizarro,
tratadas para a web (`python tools/import-fotos.py` a partir dos originais).
Cada foto tem duas versões:
- `nome.jpg` — lado maior 1920 px (faixas / galeria / detalhe)
- `nome-4x3.jpg` — recorte 1200×900 (cartões / grelha)

O "toque de edição" do script: correção de orientação (EXIF),
autocontraste, leve subida de brilho nas fotos escuras, +7% de saturação,
+5% de contraste e +18% de nitidez. JPEG progressivo.

### Adicionar fotos novas de um lote
1. Junta os originais numa pasta.
2. Edita o `MAP` no topo de `tools/import-fotos.py` (ficheiro → nome final)
   e ajusta `SRC` para a pasta dos originais.
3. Corre `python tools/import-fotos.py`.
4. Usa os novos caminhos:
   - **Home** (`index.html`): hero (`.hero-photo`), faixas (`.photo-band`),
     tira "03 Trabalhos" (`.plates`) e galeria "04" (`.grid-3`).
   - **Páginas de serviço**: faixa (`.photo-band`) e grelha (`.grid-3`).
   - **Portfólio**: `js/portfolio-data.js` — `capa`, `galeria`, `antesDepois`.

## Formato recomendado
| Uso            | Proporção | Lado maior | Peso alvo |
|----------------|-----------|------------|-----------|
| Hero / faixa   | livre     | 1920 px    | < 260 KB  |
| Cartão / grelha| 4:3       | 1200 px    | < 130 KB  |
| Galeria        | livre     | 1920 px    | < 260 KB  |

JPG qualidade ~80, progressivo. Sem imagens de stock — só obra real.
