#!/usr/bin/env python3
"""Gera as versões WebP (mais leves) das fotos do site. Os JPEG ficam (usados em og:image).
  obras/<id>-4x3.jpg -> <id>-4x3.webp  800x600
  obras/<id>.jpg     -> <id>.webp      lado maior <= 1600
  hero               -> hero-640/960/1280/1600/2400.webp (4:5)
Corre depois de tools/import-obras.py / tools/gen-hero.py:  python tools/make-webp.py"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
saved = [0, 0]

def save(im, out, q):
    im.save(out, "WEBP", quality=q, method=6)

for f in sorted((IMG / "obras").glob("*.jpg")):
    im = Image.open(f).convert("RGB")
    if f.stem.endswith("-4x3"):
        im = im.resize((800, 600), Image.LANCZOS); q = 78
    else:
        im.thumbnail((1600, 1600), Image.LANCZOS); q = 80
    out = f.with_suffix(".webp"); save(im, out, q)
    saved[0] += f.stat().st_size; saved[1] += out.stat().st_size

hero = Image.open(IMG / "hero-dizarro@2x.jpg").convert("RGB")
for w in (640, 960, 1280, 1600, 2400):
    h = round(w * hero.height / hero.width)
    out = IMG / f"hero-{w}.webp"
    save(hero.resize((w, h), Image.LANCZOS) if w != hero.width else hero, out, 78)
    print("hero", w, out.stat().st_size // 1024, "KB")
print(f"obras: {saved[0]//1024} KB jpg -> {saved[1]//1024} KB webp")
