#!/usr/bin/env python3
"""Rebuild the two Kualoa parallax layers from public/life/kualoa.webp.

RUN THIS ANY TIME kualoa.webp CHANGES. The plate and cutout are derived files;
if you re-grade or re-export the photo and skip this, the hero becomes the one
stale image on the page.

The two layers:

  kualoa-plate.webp    the photograph with both figures painted out
  kualoa-subject.webp  the two figures on transparency

How the plate is filled, and why it matters:

  The region is inpainted with **LaMa** (`big-lama.pt`, cached in
  `~/.cache/lama`, run through the torch already installed). It is a model
  built for exactly this — large-mask object removal — and it takes an
  explicit mask, so every pixel outside the mask is left byte-identical.

  Three earlier approaches were tried and rejected:

  - a distance-transform fill smears radially and reads as blur;
  - continuing each masked row inward from its left and right neighbours
    looked plausible on a horizontally-stratified scene, but where the two
    figures stood it dragged their shirt colours sideways — visible teal and
    red streaks across the grass — and left wavy repeats;
  - Higgsfield cannot do this at all. None of its image models accept a
    mask, so they regenerate the whole frame rather than editing it. See
    HANDOFF.md.

  LaMa is run at a REDUCED resolution and upscaled back. This matters: the
  model was trained around 512px, and at the full 2183x2644 crop its
  receptive field is far too small to synthesise structure — it returns a
  flat, repetitive stipple that reads as a patch. At a 1536px long edge it
  produces coherent terrain. The upscale costs sharpness, so the fill is
  then unsharp-masked back up to ~90% of the surrounding grass's measured
  detail; matching that number is what stops the region reading as soft.

  MARGIN is a budget, not a safety margin. It must EXCEED the largest
  plate-vs-cutout separation the component can produce, or the reconstruction
  edge is exposed during motion. But every pixel of it is permanently visible,
  so it must not be wider than necessary either. 44px was tuned against a
  measured worst-case separation of ~28 display px. If you increase the
  parallax travel in KualoaParallax.tsx, raise MARGIN to match and re-run.

The alpha matte is hardened because the Higgsfield cutout was generated at
half this resolution; its soft edge lets fill bleed through as a rim.

  python3 tools/build-parallax.py path/to/cutout.png
"""
import os
import sys

import numpy as np
import torch
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "life", "kualoa.webp")
OUT = os.path.join(ROOT, "public", "life", "parallax")
MARGIN = 44

# big-lama.pt, TorchScript. Kept in the user cache rather than the repo: it is
# 196 MB and `public/` is already heavy for git history.
#   curl -sLo ~/.cache/lama/big-lama.pt \
#     https://github.com/enesmsahin/simple-lama-inpainting/releases/download/v0.1.0/big-lama.pt
LAMA = os.path.expanduser("~/.cache/lama/big-lama.pt")

# Context given to the model beyond the mask bounds. Generous, because LaMa
# fills from surrounding content; the crop only exists to keep the tensor small.
PAD = 320
# Long edge LaMa actually runs at. See the docstring — full resolution stipples.
WORK = 1536
# Restores the sharpness the upscale costs. Tuned to land at ~90% of the
# surrounding grass's edge detail; higher starts to look crunchy.
REFOCUS = 60


def inpaint(rgb, mask):
    """LaMa over the masked region. Deterministic — no sampling, so reruns match."""
    if not os.path.exists(LAMA):
        sys.exit(f"missing {LAMA}\nsee the comment above LAMA in this file")

    h, w = rgb.shape[:2]
    ys, xs = np.where(mask)
    x0, x1 = max(0, xs.min() - PAD), min(w, xs.max() + PAD)
    y0, y1 = max(0, ys.min() - PAD), min(h, ys.max() + PAD)
    crop, mcrop = rgb[y0:y1, x0:x1], mask[y0:y1, x0:x1]
    ch, cw = crop.shape[:2]

    scale = WORK / max(ch, cw)
    sw, sh = int(cw * scale), int(ch * scale)
    small = np.array(Image.fromarray(crop).resize((sw, sh), Image.LANCZOS))
    # NEAREST: the mask must stay binary, or a feathered edge lets the figures
    # bleed back in as a rim.
    msmall = np.array(
        Image.fromarray((mcrop * 255).astype(np.uint8)).resize((sw, sh), Image.NEAREST)
    ) / 255.0

    # LaMa needs both dimensions divisible by 8.
    ph, pw = (8 - sh % 8) % 8, (8 - sw % 8) % 8
    ip = np.pad(small, ((0, ph), (0, pw), (0, 0)), mode="symmetric")
    mp = np.pad(msmall, ((0, ph), (0, pw)), mode="symmetric")

    dev = "mps" if torch.backends.mps.is_available() else "cpu"
    model = torch.jit.load(LAMA, map_location="cpu").eval().to(dev)
    ti = torch.from_numpy(ip).float().div(255).permute(2, 0, 1).unsqueeze(0).to(dev)
    tm = (torch.from_numpy(mp).float().unsqueeze(0).unsqueeze(0).to(dev) > 0).float()
    with torch.no_grad():
        out = model(ti, tm)
    filled = np.clip(out[0].permute(1, 2, 0).cpu().numpy() * 255, 0, 255)
    filled = filled.astype(np.uint8)[:sh, :sw]

    back = Image.fromarray(filled).resize((cw, ch), Image.LANCZOS)
    back = back.filter(ImageFilter.UnsharpMask(radius=2.0, percent=REFOCUS, threshold=1))

    whole = rgb.copy()
    whole[y0:y1, x0:x1] = np.array(back)
    print(f"  inpainted on {dev}, {sw}x{sh} working size")
    return whole


def main(cutout_path):
    orig = Image.open(SRC).convert("RGB")
    w, h = orig.size
    cut = Image.open(cutout_path).convert("RGBA").resize((w, h), Image.LANCZOS)

    alpha = np.array(cut.getchannel("A")).astype(np.float32) / 255.0
    hard = np.clip((alpha - 0.45) / 0.25, 0, 1)
    mask = ndimage.binary_dilation(hard > 0.02, iterations=MARGIN)

    arr = np.array(orig)
    # Composite strictly through the mask: LaMa returns a whole crop, but only
    # the masked pixels are its business. Everything else stays the original.
    plate = np.where(mask[..., None], inpaint(arr, mask), arr).astype(np.uint8)

    os.makedirs(OUT, exist_ok=True)
    Image.fromarray(plate).save(
        os.path.join(OUT, "kualoa-plate.webp"), "WEBP", quality=90, method=6)
    # RGB comes from the CURRENT photo so the cutout matches any new grade
    Image.fromarray(
        np.dstack([np.array(orig), (hard * 255).astype(np.uint8)]), "RGBA"
    ).save(os.path.join(OUT, "kualoa-subject.webp"), "WEBP", quality=92, method=6)

    for name in ("kualoa-plate", "kualoa-subject"):
        p = os.path.join(OUT, f"{name}.webp")
        print(f"  {name:<18} {Image.open(p).size}  {round(os.path.getsize(p)/1024)} KB")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1])
