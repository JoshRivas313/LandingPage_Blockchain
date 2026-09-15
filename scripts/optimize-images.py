"""Optimiza los assets de la landing: redimensiona al tamano real de uso y exporta WebP.

Lee de  assets/            (originales, sin tocar)
Escribe en src/assets/     (lo que consume el build)

Uso:  python scripts/optimize-images.py
      python scripts/optimize-images.py --report   (solo compara, no escribe)
"""

import os
import sys
from PIL import Image

SRC = "assets"
OUT = "src/assets"

# (origen, destino, lado_maximo, calidad)
# El lado maximo sale del tamano de render x2 (pantallas DPR2):
#   navbar/footer logo  190x51  -> 420
#   logo "organizado por" 255x68 -> 540
#   mascota hero        max-h 380 -> se deja nativo (560x656)
#   partners            200x96   -> 400
#   speakers            ~389x200 -> 800
#   credencial          master 1122x1402, se conserva intacta en dimensiones
JOBS = [
    ("blockchain-conf-logo.png", "blockchain-conf-logo.webp", 420, 88),
    ("blockchain-logo.png", "blockchain-logo.webp", 540, 88),
    ("main-logo.png", "main-logo.webp", 660, 86),
    ("credencial-template.png", "credencial-template.webp", 1402, 92),
    ("partners/blockchain-upc.png", "partners/blockchain-upc.webp", 400, 88),
    ("partners/blockchain-pucp.png", "partners/blockchain-pucp.webp", 400, 88),
    ("partners/dev3pack.png", "partners/dev3pack.webp", 400, 88),
    ("partners/eth-lima.png", "partners/eth-lima.webp", 400, 88),
    ("speakers/gerardo-huaman.jpg", "speakers/gerardo-huaman.webp", 800, 80),
    ("speakers/gianella-coronel.jpg", "speakers/gianella-coronel.webp", 800, 80),
    ("speakers/fredy-polar.png", "speakers/fredy-polar.webp", 800, 80),
    ("speakers/marcelo-vizcarra.jpg", "speakers/marcelo-vizcarra.webp", 800, 80),
    ("speakers/fernando-paredes.jpg", "speakers/fernando-paredes.webp", 800, 80),
    ("speakers/alejandra-catacora.png", "speakers/alejandra-catacora.webp", 800, 80),
    ("speakers/yamille-celis.jpeg", "speakers/yamille-celis.webp", 800, 80),
    ("speakers/jennifer-ramirez.png", "speakers/jennifer-ramirez.webp", 800, 80),
]

dry = "--report" in sys.argv
before = after = 0
rows = []

for src_name, out_name, max_side, quality in JOBS:
    src_path = os.path.join(SRC, src_name)
    out_path = os.path.join(OUT, out_name)
    im = Image.open(src_path)
    src_size = os.path.getsize(src_path)
    src_dim = (im.width, im.height)

    # Conserva el canal alfa cuando existe; el resto va a RGB.
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    im = im.convert("RGBA" if has_alpha else "RGB")

    if max(im.size) > max_side:
        ratio = max_side / max(im.size)
        im = im.resize((round(im.width * ratio), round(im.height * ratio)), Image.LANCZOS)

    if not dry:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        im.save(out_path, "WEBP", quality=quality, method=6)

    out_size = os.path.getsize(out_path) if os.path.exists(out_path) else 0
    before += src_size
    after += out_size
    rows.append((src_name, src_dim, src_size, (im.width, im.height), out_size))

w = max(len(r[0]) for r in rows) + 2
print(f"{'asset':<{w}}{'antes':>22}{'despues':>22}{'ahorro':>10}")
print("-" * (w + 54))
for name, sd, ss, od, os_ in rows:
    saved = 100 - (os_ / ss * 100) if ss else 0
    print(
        f"{name:<{w}}"
        f"{f'{sd[0]}x{sd[1]}':>11}{f'{ss/1024:.0f} KB':>11}"
        f"{f'{od[0]}x{od[1]}':>11}{f'{os_/1024:.0f} KB':>11}"
        f"{f'-{saved:.0f}%':>10}"
    )
print("-" * (w + 54))
print(
    f"{'TOTAL':<{w}}{'':>11}{f'{before/1024:.0f} KB':>11}"
    f"{'':>11}{f'{after/1024:.0f} KB':>11}{f'-{100 - after/before*100:.0f}%':>10}"
)
