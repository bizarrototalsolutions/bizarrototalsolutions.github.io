#!/usr/bin/env python3
"""Gera a foto do herói da home a partir da melhor foto disponível
(aplique aceso na parede de chapa — p19), com limpeza, nitidez, cor,
ampliação para alta resolução e o wordmark "DIZARRO" carimbado.

Saída: assets/img/hero-dizarro.jpg (1x) e hero-dizarro@2x.jpg (2x).
Corre: python tools/gen-hero.py   (requer Pillow)
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img"
SRC = Path(r"C:\Users\dbiza\AppData\Local\Temp\claude"
           r"\C--Users-dbiza-Desktop-bts-app-fase4-1-modelo--1--site"
           r"\1aa3f54f-bd73-43a7-b885-c7ff067ef44e\scratchpad\wa\p19.jpg")

INK = (21, 24, 28)
HIVIS = (239, 74, 17)
WHITE = (245, 246, 242)


def font(px, bold=True):
    for n in (("arialbd.ttf" if bold else "arial.ttf"), "Arialbd.ttf",
              "DejaVuSans-Bold.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(n, px)
        except OSError:
            continue
    return ImageFont.load_default()


def clean(im):
    """Limpa mantendo o ambiente escuro: micro-contraste, nitidez e cor."""
    im = ImageOps.exif_transpose(im).convert("RGB")
    im = ImageOps.autocontrast(im, cutoff=(0.4, 0.2))
    # suaviza ruído do sensor nas sombras e recupera nitidez das arestas
    im = im.filter(ImageFilter.GaussianBlur(0.5))
    im = im.filter(ImageFilter.UnsharpMask(radius=2.0, percent=115, threshold=3))
    im = ImageEnhance.Contrast(im).enhance(1.08)
    im = ImageEnhance.Color(im).enhance(1.08)
    im = ImageEnhance.Brightness(im).enhance(1.02)
    return im


def crop_45(im):
    w, h = im.size
    target = 4 / 5
    if w / h > target:                       # demasiado largo -> corta lados
        nw = int(h * target); x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = int(w / target); y = int((h - nh) * 0.18)   # mantém o aplique alto
    return im.crop((0, y, w, y + nh))


def spaced_text(d, xy, text, fnt, fill, tracking):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=fnt, fill=fill)
        x += d.textlength(ch, font=fnt) + tracking


def stamp(im):
    """Wordmark DIZ + A(laranja) + RRO no canto inferior esquerdo."""
    w, h = im.size
    d = ImageDraw.Draw(im, "RGBA")
    pad = int(w * 0.055)
    fs = int(h * 0.032)
    fnt = font(fs)
    tr = fs * 0.16
    base_y = h - pad - fs * 1.15
    # rule fina + etiqueta
    d.line([(pad, base_y - fs * 0.5), (pad + w * 0.14, base_y - fs * 0.5)],
           fill=HIVIS + (255,), width=max(2, fs // 14))
    # sombra suave
    for dx, dy in ((2, 2), (1, 1)):
        spaced_text(d, (pad + dx, base_y + dy), "DIZ", fnt, (0, 0, 0, 90), tr)
    spaced_text(d, (pad, base_y), "DIZ", fnt, WHITE + (255,), tr)
    x_after = pad + sum(d.textlength(c, font=fnt) + tr for c in "DIZ")
    spaced_text(d, (x_after, base_y), "A", fnt, HIVIS + (255,), tr)
    x_after += d.textlength("A", font=fnt) + tr
    spaced_text(d, (x_after, base_y), "RRO", fnt, WHITE + (255,), tr)
    sub = font(int(fs * 0.42), bold=False)
    d.text((pad + 2, base_y + fs * 1.15), "OBRAS TÉCNICAS · GRANDE PORTO",
           font=sub, fill=(255, 255, 255, 205))
    return im


def main():
    im = clean(Image.open(SRC))
    im = crop_45(im)
    # amplia com LANCZOS para alta resolução
    big = im.resize((2400, 3000), Image.LANCZOS)
    one = im.resize((1600, 2000), Image.LANCZOS)
    stamp(big).save(OUT / "hero-dizarro@2x.jpg", "JPEG", quality=84,
                    optimize=True, progressive=True)
    stamp(one).save(OUT / "hero-dizarro.jpg", "JPEG", quality=86,
                    optimize=True, progressive=True)
    for f in ("hero-dizarro.jpg", "hero-dizarro@2x.jpg"):
        p = OUT / f
        print(f"{f}  {Image.open(p).size}  {p.stat().st_size/1024:.0f} KB")


if __name__ == "__main__":
    main()
