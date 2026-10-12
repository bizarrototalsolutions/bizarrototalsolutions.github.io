#!/usr/bin/env python3
"""Aloja as fontes do Google Fonts no próprio site (RGPD + velocidade).
Gera assets/fonts/*.woff2 (só subconjuntos latin e latin-ext) e css/fonts.css.
Corre:  python tools/self-host-fonts.py   (precisa de internet; só quando mudares de fontes)"""
import re, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "fonts"; OUT.mkdir(parents=True, exist_ok=True)
API = ("https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800"
       "&family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:ital,wght@0,400;0,500;1,400&display=swap")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30).read()

css = get(API).decode()
groups = {}      # (family, style, subset, url) -> [weights], unicode-range
for m in re.finditer(r"/\* ([\w-]+) \*/\s*@font-face \{(.*?)\}", css, re.S):
    subset, body = m.group(1), m.group(2)
    if subset not in ("latin", "latin-ext"):
        continue
    g = lambda k: re.search(k + r":\s*([^;]+);", body).group(1).strip()
    fam = g("font-family").strip("'\""); style = g("font-style"); w = int(g("font-weight"))
    url = re.search(r"url\((.*?)\)", body).group(1)
    rng = g("unicode-range")
    groups.setdefault((fam, style, subset, url), {"w": [], "r": rng})["w"].append(w)

out = ["/* gerado por tools/self-host-fonts.py — não editar à mão */"]
names = {}
for (fam, style, subset, url), v in sorted(groups.items()):
    ws = sorted(v["w"])
    key = (fam, style, subset, url)
    base = f"{fam.lower().replace(' ', '-')}-{'italic-' if style == 'italic' else ''}{subset}"
    fn = f"{base}-{ws[0]}{'-' + str(ws[-1]) if len(ws) > 1 else ''}.woff2"
    if not (OUT / fn).exists():
        (OUT / fn).write_bytes(get(url))
    names[key] = fn
    weight = f"{ws[0]} {ws[-1]}" if len(ws) > 1 and url.count("") else str(ws[0])
    out.append(f"@font-face {{ font-family: '{fam}'; font-style: {style}; font-weight: {weight}; font-display: swap;\n"
               f"  src: url(../assets/fonts/{fn}) format('woff2');\n  unicode-range: {v['r']}; }}")
(ROOT / "css" / "fonts.css").write_text("\n".join(out) + "\n", encoding="utf-8")
print(len(groups), "faces;", sum(p.stat().st_size for p in OUT.glob('*.woff2')) // 1024, "KB em assets/fonts")
for p in sorted(OUT.glob("*.woff2")): print(" ", p.name, p.stat().st_size // 1024, "KB")
