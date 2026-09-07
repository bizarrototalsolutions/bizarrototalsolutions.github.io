#!/usr/bin/env python3
"""Gera os assets de marca da Dizarro (favicons + og-dizarro.jpg).
Corre: python tools/gen-brand.py   (requer Pillow)"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "images"; IMG.mkdir(parents=True, exist_ok=True)
BRAND = ROOT / "assets" / "brand"; BRAND.mkdir(parents=True, exist_ok=True)

HIVIS = (239, 74, 17)
INK = (26, 18, 6)
PAPER = (242, 243, 239)
GRAPH = (110, 116, 122)

def font(sz, bold=True):
    for n in ((("arialbd.ttf") if bold else "arial.ttf"), "DejaVuSans-Bold.ttf", "DejaVuSans.ttf"):
        try: return ImageFont.truetype(n, sz)
        except OSError: pass
    return ImageFont.load_default()

def mark(size):
    ss = 4; c = size * ss
    im = Image.new("RGBA", (c, c), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, c - 1, c - 1], radius=int(c * 0.19), fill=HIVIS)
    w = max(2, int(c * 0.05))
    cx = cy = c / 2; r = c * 0.19
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=INK, width=w)
    arm = c * 0.22; gap = c * 0.30
    d.line([cx, cy - gap - arm, cx, cy - gap], fill=INK, width=w)
    d.line([cx, cy + gap, cx, cy + gap + arm], fill=INK, width=w)
    d.line([cx - gap - arm, cy, cx - gap, cy], fill=INK, width=w)
    d.line([cx + gap, cy, cx + gap + arm, cy], fill=INK, width=w)
    return im.resize((size, size), Image.LANCZOS)

for name, sz in {"favicon-16x16.png": 16, "favicon-32x32.png": 32,
                 "apple-touch-icon.png": 180, "icon-192.png": 192, "icon-512.png": 512}.items():
    mark(sz).save(IMG / name); print("wrote", name)
mark(64).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)]); print("wrote favicon.ico")

# --- OG 1200x630 ---
W, H = 1200, 630
og = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(og)
for x in range(0, W, 34):
    d.line([(x, 0), (x, H)], fill=(228, 230, 224))
d.rectangle([0, H - 12, W, H], fill=HIVIS)
m = mark(150).convert("RGBA")
og.paste(m, (84, 84), m)
d.text((84, 300), "DIZARRO", font=font(132), fill=INK)
d.text((88, 452), "Eletricidade · Telecom · Carpintaria · Domótica", font=font(38, bold=False), fill=HIVIS)
d.text((88, 512), "Obras técnicas no Grande Porto · orçamento em < 24 h", font=font(30, bold=False), fill=GRAPH)
og.save(BRAND / "og-dizarro.jpg", "JPEG", quality=86, optimize=True)
print("wrote assets/brand/og-dizarro.jpg", og.size)
