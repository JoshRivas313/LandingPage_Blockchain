"""Descarga los woff2 de Google Fonts y genera el CSS self-hosted.

Solo baja los subsets latin y latin-ext (el sitio esta en espanol) y solo los
pesos que el diseno usa de verdad: Inter 400/500/600/700 y Manrope 700/800.

Escribe:  public/fonts/*.woff2  +  src/styles/fonts.css

Uso:  python scripts/fetch-fonts.py
"""

import os
import re
import urllib.request

CSS_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Inter:wght@400;500;600;700"
    "&family=Manrope:wght@700;800"
    "&display=swap"
)
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
KEEP = {"latin", "latin-ext"}
OUT_DIR = "public/fonts"
CSS_OUT = "src/styles/fonts.css"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    return urllib.request.urlopen(req).read()


os.makedirs(OUT_DIR, exist_ok=True)
css = get(CSS_URL).decode("utf-8")

# Cada bloque viene precedido de un comentario con el nombre del subset.
blocks = re.findall(r"/\* (\S+) \*/\s*(@font-face \{.*?\})", css, re.S)

out, total = [], 0
for subset, block in blocks:
    if subset not in KEEP:
        continue
    family = re.search(r"font-family: '([^']+)'", block).group(1)
    weight = re.search(r"font-weight: (\d+)", block).group(1)
    url = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
    unicode_range = re.search(r"unicode-range: ([^;]+);", block).group(1)

    name = f"{family.lower()}-{weight}-{subset}.woff2"
    data = get(url)
    with open(os.path.join(OUT_DIR, name), "wb") as fh:
        fh.write(data)
    total += len(data)
    print(f"{len(data)/1024:6.1f} KB  {name}")

    out.append(
        "@font-face {\n"
        f"  font-family: '{family}';\n"
        "  font-style: normal;\n"
        f"  font-weight: {weight};\n"
        "  font-display: swap;\n"
        f"  src: url('/fonts/{name}') format('woff2');\n"
        f"  unicode-range: {unicode_range};\n"
        "}"
    )

header = "/* Generado por scripts/fetch-fonts.py — no editar a mano. */\n"
with open(CSS_OUT, "w", encoding="utf-8") as fh:
    fh.write(header + "\n" + "\n\n".join(out) + "\n")

print(f"\n{len(out)} @font-face = {total/1024:.1f} KB  ->  {CSS_OUT}")
