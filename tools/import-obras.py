#!/usr/bin/env python3
"""Importa as fotos reais dos trabalhos (pasta enviada pelo cliente) para o site.

Para cada foto gera, em assets/img/obras/:
  <id>.jpg        foto inteira (lado maior <= 2048 px), tratada de leve
  <id>-4x3.jpg    miniatura 1200x900 com enquadramento no assunto (não para os "antes")
Rostos esbatidos "de leve" onde apareçam (ver BLUR).

Corre:  python tools/import-obras.py "C:/caminho/para/a/pasta"
        (requer Pillow)
"""
import sys, os, unicodedata
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "obras"
OUT.mkdir(parents=True, exist_ok=True)

# prefixo do ficheiro original (sem acentos/pontuação) -> (id final, foco vertical da miniatura 0..1)
MAP = {
    "antesorganiza":            ("cabos-antes", 0.58),
    "depoisorganizacaocabos":   ("cabos-depois", 0.58),
    "antessalafixacao":         ("sala-antes", 0.5),
    "depoissalafixacao":        ("sala-depois", 0.5),
    "antestvfixa100":           ("tv100-antes", 0.55),
    "depoistvfixa100":          ("tv100-depois", 0.30),
    "antestvfixaparede1":       ("tv-antes", 0.62),
    "depoistvfixaparede1":      ("tv-depois", 0.50),
    "carroinfantilantes":       ("carro-antes", 0.50),
    "carroinfantildepois":      ("carro-depois", 0.55),
    "janelaantespintar":        ("janela-antes", 0.50),
    "janeladepoispintar":       ("janela-depois", 0.33),
    "luzantesfixar":            ("luz-antes", 0.40),
    "luzdepoisfixar":           ("luz-depois", 0.25),
    "luzcomventoinhafixa":      ("ventoinha", 0.50),
    "exaustornovo":             ("exaustor", 0.50),
    "baloicoderedefixacao":     ("baloico", 0.55),
    "movel":                    ("movel", 0.45),
}

# rostos a esbater (caixas em fração da imagem: x0, y0, x1, y1)
BLUR = {
    "janela-depois": [(0.555, 0.760, 0.725, 0.925)],
}


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return "".join(c for c in s if c.isalnum())


def hide_faces(im, boxes):
    W, H = im.size
    for (x0, y0, x1, y1) in boxes:
        box = (int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))
        reg = im.crop(box)
        soft = reg.filter(ImageFilter.GaussianBlur(max(6, reg.width // 20)))
        mask = Image.new("L", reg.size, 0)
        ImageDraw.Draw(mask).ellipse([0, 0, reg.width - 1, reg.height - 1], fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(max(4, reg.width // 14)))
        im.paste(soft, box[:2], mask)
    return im


def treat(im):
    im = ImageOps.exif_transpose(im).convert("RGB")
    im = ImageOps.autocontrast(im, cutoff=(0.3, 0.2))
    im = ImageEnhance.Color(im).enhance(1.05)
    im = ImageEnhance.Contrast(im).enhance(1.03)
    return ImageEnhance.Sharpness(im).enhance(1.12)


def crop43(im, fy):
    w, h = im.size
    if w / h >= 4 / 3:                       # já é (pelo menos) 4:3 -> corta lados
        nw = int(h * 4 / 3); x = (w - nw) // 2
        c = im.crop((x, 0, x + nw, h))
    else:                                    # vertical -> janela 4:3 centrada no foco
        nh = int(w * 3 / 4); y = int(max(0, min(h - nh, fy * h - nh / 2)))
        c = im.crop((0, y, w, y + nh))
    return c.resize((1200, 900), Image.LANCZOS)


def main(src):
    src = Path(src)
    done = set()
    for f in sorted(src.iterdir()):
        if f.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        k = norm(f.stem)
        hit = next((v for p, v in MAP.items() if k.startswith(p)), None)
        if not hit:
            print("ignorada:", f.name); continue
        name, fy = hit
        im = treat(Image.open(f))
        if name in BLUR:
            im = hide_faces(im, BLUR[name])
        full = im.copy(); full.thumbnail((2048, 2048), Image.LANCZOS)
        full.save(OUT / f"{name}.jpg", "JPEG", quality=82, optimize=True, progressive=True)
        if not name.endswith("-antes"):      # os "antes" só aparecem nos comparadores (foto inteira)
            crop43(im, fy).save(OUT / f"{name}-4x3.jpg", "JPEG", quality=80, optimize=True, progressive=True)
        done.add(name)
        print(f"{name:14s} {full.size}  <- {f.name}")
    falta = {v[0] for v in MAP.values()} - done
    if falta:
        print("FALTAM:", sorted(falta)); sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1])
