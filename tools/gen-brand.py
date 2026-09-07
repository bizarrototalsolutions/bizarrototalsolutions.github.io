#!/usr/bin/env python3
"""Gera os assets de marca da Dizarro a partir do logótipo oficial.

Fonte: assets/brand/logo-src.png  (emblema circular fornecido pelo cliente)
Saídas:
  assets/brand/logo-dizarro.webp     -> emblema circular usado no site (header/rodapé), ~20 KB
  assets/brand/logo-dizarro.png      -> mesmo emblema em PNG (raster canónico, alta resolução)
  assets/brand/og-dizarro.jpg        -> imagem Open Graph 1200x630
  assets/images/favicon-16x16.png / favicon-32x32.png
  assets/images/apple-touch-icon.png (180, fundo preto, sem transparência)
  assets/images/icon-192.png / icon-512.png (maskable, área segura)
  favicon.ico (16/32/48)

Correr:  python tools/gen-brand.py     (requer Pillow)
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "images"; IMG.mkdir(parents=True, exist_ok=True)
BRAND = ROOT / "assets" / "brand"; BRAND.mkdir(parents=True, exist_ok=True)
SRC = BRAND / "logo-src.png"

HIVIS = (239, 74, 17)
INK = (20, 18, 20)
PAPER = (242, 243, 239)
DARK = (11, 11, 12)
GRAPH = (150, 150, 150)


def font(sz, bold=True):
    names = (("arialbd.ttf", "Arialbd.ttf") if bold else ("arial.ttf", "Arial.ttf"))
    for n in names + ("DejaVuSans-Bold.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(n, sz)
        except OSError:
            pass
    return ImageFont.load_default()


def load_trimmed():
    """Abre a fonte e recorta a moldura preta à volta do emblema."""
    im = Image.open(SRC).convert("RGB")
    g = im.convert("L")
    # bbox dos pixéis que não são quase-pretos (o anel laranja entra aqui)
    mask = g.point(lambda p: 255 if p > 26 else 0)
    bbox = mask.getbbox()
    if bbox:
        im = im.crop(bbox)
    # forçar quadrado (centrado sobre fundo preto)
    w, h = im.size
    s = max(w, h)
    sq = Image.new("RGB", (s, s), (0, 0, 0))
    sq.paste(im, ((s - w) // 2, (s - h) // 2))
    return sq


def circle(src, size, ss=4):
    """Emblema recortado num círculo, cantos transparentes."""
    c = size * ss
    base = src.resize((c, c), Image.LANCZOS).convert("RGBA")
    m = Image.new("L", (c, c), 0)
    ImageDraw.Draw(m).ellipse([0, 0, c - 1, c - 1], fill=255)
    base.putalpha(m)
    return base.resize((size, size), Image.LANCZOS)


def square(src, size, bg):
    return src.resize((size, size), Image.LANCZOS).convert("RGB") if bg is None \
        else _on_bg(src.resize((size, size), Image.LANCZOS), size, bg)


def maskable(src, size, bg=(0, 0, 0)):
    """Ícone maskable: emblema a 82% num quadrado, com área segura."""
    canvas = Image.new("RGB", (size, size), bg)
    inner = int(size * 0.82)
    m = src.resize((inner, inner), Image.LANCZOS).convert("RGB")
    off = (size - inner) // 2
    canvas.paste(m, (off, off))
    return canvas


def _on_bg(im, size, bg):
    canvas = Image.new("RGB", (size, size), bg)
    canvas.paste(im.convert("RGB"), (0, 0))
    return canvas


sq = load_trimmed()
print("fonte recortada:", sq.size)

# --- emblema para o site ---
circle(sq, 640).save(BRAND / "logo-dizarro.png")
circle(sq, 384).save(BRAND / "logo-dizarro.webp", quality=84, method=6)
print("wrote assets/brand/logo-dizarro.png + .webp")

# --- favicons (fundo preto para contraste em tamanhos minúsculos) ---
square(sq, 16, None).save(IMG / "favicon-16x16.png")
square(sq, 32, None).save(IMG / "favicon-32x32.png")
print("wrote favicon-16/32")

# --- Apple touch (sem transparência; iOS arredonda) ---
square(sq, 180, None).save(IMG / "apple-touch-icon.png")
print("wrote apple-touch-icon.png")

# --- PWA maskable ---
maskable(sq, 192).save(IMG / "icon-192.png")
maskable(sq, 512).save(IMG / "icon-512.png")
print("wrote icon-192/512")

# --- favicon.ico multi-tamanho ---
square(sq, 64, None).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("wrote favicon.ico")

# --- OG 1200x630 (fundo escuro, estilo folha de projeto) ---
W, H = 1200, 630
og = Image.new("RGB", (W, H), DARK)
d = ImageDraw.Draw(og)
for x in range(0, W, 40):
    d.line([(x, 0), (x, H)], fill=(24, 24, 26))
for y in range(0, H, 40):
    d.line([(0, y), (W, y)], fill=(20, 20, 22))
d.rectangle([0, H - 12, W, H], fill=HIVIS)
emb = circle(sq, 430).convert("RGBA")
og.paste(emb, (70, (H - 430) // 2), emb)
tx = 560
d.text((tx, 168), "Obras técnicas", font=font(74), fill=(255, 255, 255))
d.text((tx, 250), "no Grande Porto", font=font(74), fill=(255, 255, 255))
d.text((tx, 360), "Eletricidade · Carpintaria", font=font(33, bold=False), fill=HIVIS)
d.text((tx, 402), "Telecomunicações · Domótica", font=font(33, bold=False), fill=HIVIS)
d.text((tx, 470), "Orçamento grátis em menos de 24 h", font=font(27, bold=False), fill=GRAPH)
og.save(BRAND / "og-dizarro.jpg", "JPEG", quality=88, optimize=True)
print("wrote assets/brand/og-dizarro.jpg", og.size)
