#!/usr/bin/env python3
"""Processa as fotos reais das obras para a web:
- corrige orientação (EXIF)
- gera versão grande (long edge 1920) e recorte 4:3 (1200x900)
- grava JPEG progressivo otimizado em assets/img/obras/
Requer Pillow.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "obras"
OUT.mkdir(parents=True, exist_ok=True)
UP = Path.home() / ".claude" / "uploads" / "1aa3f54f-bd73-43a7-b885-c7ff067ef44e"

JOBS = {
    "59593bec-image.jpg": "tv-wall-1",
    "335dc4aa-image.jpg": "tv-wall-2",
    "6f3b6d31-image.jpg": "diogo-fixando",
    "e7f11a49-image.jpg": "rede-antes",
    "d028167f-image.jpg": "rede-depois",
}

def save(im, path, q=80):
    im.convert("RGB").save(path, "JPEG", quality=q, optimize=True, progressive=True)
    print(f"  {path.name}  {im.size[0]}x{im.size[1]}  {path.stat().st_size/1024:.0f} KB")

def crop_43(im):
    w, h = im.size
    target = 4 / 3
    if w / h > target:            # demasiado largo -> corta lados
        nw = int(h * target)
        x = (w - nw) // 2
        im = im.crop((x, 0, x + nw, h))
    else:                          # demasiado alto -> corta cima/baixo
        nh = int(w / target)
        y = int((h - nh) * 0.42)   # ligeiramente acima do centro
        im = im.crop((0, y, w, y + nh))
    return im.resize((1200, 900), Image.LANCZOS)

for src, name in JOBS.items():
    p = UP / src
    if not p.exists():
        print("skip (não encontrado):", src); continue
    im = ImageOps.exif_transpose(Image.open(p))
    print(name)
    big = im.copy()
    big.thumbnail((1920, 1920), Image.LANCZOS)
    save(big, OUT / f"{name}.jpg", 80)
    save(crop_43(im), OUT / f"{name}-4x3.jpg", 78)
