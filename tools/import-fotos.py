#!/usr/bin/env python3
"""Importa e trata as fotos reais das obras (lote WhatsApp 2026-09-07).

- corrige orientação (EXIF)
- toque de edição p/ web: autocontraste, leve subida de brilho nas escuras,
  saturação +7%, contraste +5%, nitidez +18%
- grava versão grande (lado maior 1920, q82) e recorte 4:3 (1200x900, q80),
  JPEG progressivo, em assets/img/obras/

Fonte: pasta com p01.jpg … p25.jpg (definida em SRC).
Requer Pillow.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageStat

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "obras"
OUT.mkdir(parents=True, exist_ok=True)
SRC = Path(r"C:\Users\dbiza\AppData\Local\Temp\claude"
           r"\C--Users-dbiza-Desktop-bts-app-fase4-1-modelo--1--site"
           r"\1aa3f54f-bd73-43a7-b885-c7ff067ef44e\scratchpad\wa")

# p## -> nome final (só as fotos aproveitáveis; p01/p22/p23/p24 ficam de fora)
MAP = {
    "p17": "tv-parede",          # TV grande na parede + AC + móvel
    "p13": "tv-config",          # TV a configurar, obra em curso
    "p10": "sala-lareira",       # sala lareira pedra + TV + móvel azul
    "p11": "sala-lareira-b",     # mesma sala, prateleiras
    "p12": "sala-embutidos",     # focos embutidos acesos, caixa TV nova
    "p18": "luz-parede-a",       # aplique de parede aceso, chapa+madeira
    "p19": "luz-parede-b",       # aplique retangular aceso
    "p20": "ventoinha-teto",     # ventoinha de teto pás madeira, luz
    "p07": "ventoinha-teto-b",   # ventoinha de teto (outra)
    "p05": "sapateira",          # sapateira branca no hall
    "p06": "secretaria",         # secretária branca à medida
    "p14": "cozinha-armario",    # armário de cozinha aberto + exaustor
    "p15": "janela-vista-a",     # janela alumínio preto, vista marina
    "p16": "janela-vista-b",     # janelas alumínio, vista marina
    "p25": "janela-diogo",       # janela vista mar, técnico a trabalhar
    "p02": "rede-antes-b",       # secretária com router e cabos (antes)
    "p03": "bastidor-a",         # bastidor de parede aberto, cabos
    "p04": "bastidor-b",         # bastidor no teto, cabos enrolados
    "p09": "bastidor-cabos",     # bastidor aberto, muitos cabos brancos
    "p21": "cliente-comercial",  # equipamento clínica sobre móvel branco
}


def edit(im):
    im = ImageOps.exif_transpose(im).convert("RGB")
    im = ImageOps.autocontrast(im, cutoff=(0.4, 0.15))
    lum = ImageStat.Stat(im.convert("L")).mean[0]
    if lum < 105:
        im = ImageEnhance.Brightness(im).enhance(1.14)
    elif lum < 125:
        im = ImageEnhance.Brightness(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.07)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Sharpness(im).enhance(1.18)
    return im


def crop_43(im):
    w, h = im.size
    target = 4 / 3
    if w / h > target:
        nw = int(h * target); x = (w - nw) // 2
        im = im.crop((x, 0, x + nw, h))
    else:
        nh = int(w / target); y = int((h - nh) * 0.40)
        im = im.crop((0, y, w, y + nh))
    return im.resize((1200, 900), Image.LANCZOS)


def save(im, path, q):
    im.save(path, "JPEG", quality=q, optimize=True, progressive=True)
    print(f"  {path.name:26s} {im.size[0]}x{im.size[1]}  {path.stat().st_size/1024:5.0f} KB")


for tag, name in MAP.items():
    p = SRC / f"{tag}.jpg"
    if not p.exists():
        print("skip (não encontrado):", p); continue
    print(name)
    im = edit(Image.open(p))
    big = im.copy(); big.thumbnail((1920, 1920), Image.LANCZOS)
    save(big, OUT / f"{name}.jpg", 82)
    save(crop_43(im), OUT / f"{name}-4x3.jpg", 80)
