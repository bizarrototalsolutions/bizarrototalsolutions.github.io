#!/usr/bin/env python3
"""Garante width/height (evita saltos de layout) e loading=lazy nas <img> das páginas.
Idempotente. Corre depois de tools/gen-seo.mjs:  python tools/img-attrs.py"""
import re, glob
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = re.compile(r'<img\b[^>]*?/?>', re.S)
n = 0
for f in sorted(ROOT.glob('*.html')):
    if f.name == 'login.html':
        continue
    h = f.read_text(encoding='utf-8')
    seen = [0]

    def fix(m):
        global n
        tag = m.group(0)
        seen[0] += 1
        new = tag
        src = re.search(r'\ssrc="([^"]+)"', tag)
        if src and ('width=' not in tag or 'height=' not in tag):
            p = ROOT / src.group(1)
            if p.is_file():
                w, hh = Image.open(p).size
                new = re.sub(r'(\ssrc="[^"]+")', rf'\1 width="{w}" height="{hh}"', new, count=1)
        if 'loading=' not in new and 'fetchpriority' not in new and seen[0] > 1:
            new = re.sub(r'(\ssrc="[^"]+")', r'\1 loading="lazy" decoding="async"', new, count=1)
        if new != tag:
            n += 1
        return new

    out = IMG.sub(fix, h)
    if out != h:
        f.write_text(out, encoding='utf-8', newline='')
print('img-attrs:', n, 'imagens ajustadas')
