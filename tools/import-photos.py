#!/usr/bin/env python3
"""Import photographs into public/life at full quality.

Pipeline, in order — the order matters:

  1. read the ORIGINAL from disk (never a previously-exported WebP)
  2. rotate if the raw pixels need it (see ROTATIONS below)
  3. cap the long edge at 4096
  4. hand to Apple Core Image auto-enhance + unsharp via tools/autoenhance.swift
  5. encode WebP q86

Why not exif_transpose: two of the source photos carry EXIF orientation tags
that disagree with their stored pixels, and applying the tag rotates them
wrongly. Rotations are therefore declared explicitly, verified by eye.

usage:
  python3 tools/import-photos.py ~/Desktop/foo.JPG:my-slug[:-90] ...
  python3 tools/import-photos.py --audit ~/Desktop/foo.JPG:my-slug ...
"""
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(ROOT, "public", "life")
SWIFT = os.path.join(ROOT, "tools", "autoenhance.swift")
# A gallery plate is laid out at 33vw, so even a 2560px-wide viewport at 2x
# only asks Next for its 1920 variant. Shipping 4096 meant carrying roughly
# twice the pixels any browser requested, and paying for it in repo weight.
# Capping at 2560 also shortens the downscale Next performs, which leaves the
# delivered image slightly sharper — the cap and the unsharp pass pull the
# same direction.
CAP = 2560

# The hero is the exception. KualoaParallax renders at 72rem, which at 2x asks
# for the 3840 variant, so kualoa and its derived parallax layers stay large.
CAPS = {"kualoa": 4096}

# Every rotation here was confirmed by eye before being written down.
#
# Two of these are the EXIF-lies cases the docstring describes. st-john is the
# opposite failure: its EXIF orientation (6) was correct, but since this tool
# ignores EXIF entirely, a photo that needed rotating and was not listed here
# shipped sideways. Anything shot in portrait must be listed, whatever the tag
# says — run with --audit to catch omissions before importing.
ROTATIONS = {
    "sunset-lap": -90,   # snowboarding-2.JPG   — EXIF lies, verified visually
    "mid-run": -90,      # mid_run_stop.JPG     — EXIF lies, verified visually
    "st-john": -90,      # st_john_windmill_bar.JPG — EXIF 6 was right all along
}

# Optional selective grade, applied after Apple's pass. Apple grades the whole
# frame; this targets specific hues, which is what a food photograph needs —
# the greens and the fish are the subject, the black bowl and the deck are not.
#
# `hues` are (start, end) degrees on the colour wheel, wrapping through 0.
# Saturation is applied straight rather than vibrance-style: the food is
# already the most saturated thing in frame, so a vibrance curve — which
# deliberately protects saturated pixels — barely moved it. `clarity` is a
# wide-radius, low-amount unsharp: local contrast, not edge sharpening, and it
# contributes more of the perceived "pop" than saturation does.
#
# Values were picked by eye against a ladder of three. One step stronger went
# neon in the herbs and flattened the tuna to a single red.
GRADES = {
    "poke": {
        "hues": [(335, 20), (50, 140)],  # fish: magenta->red. herbs: yellow->green.
        "saturation": 1.45,
        "clarity": 0.32,
        "contrast": 0.10,
        # The pale wood deck sits in the same orange band as the salmon. Gating
        # on saturation is what keeps the boost off the deck.
        "saturation_floor": 0.20,
    },
}


def _to_hsv(a):
    mx, mn = a.max(2), a.min(2)
    d = np.maximum(mx - mn, 1e-6)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    h = np.zeros_like(mx)
    m = mx == r; h[m] = ((g - b)[m] / d[m]) % 6
    m = mx == g; h[m] = ((b - r)[m] / d[m]) + 2
    m = mx == b; h[m] = ((r - g)[m] / d[m]) + 4
    return h * 60, np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0), mx


def _to_rgb(h, s, v):
    c = v * s
    x = c * (1 - np.abs((h / 60) % 2 - 1))
    z = np.zeros_like(h)
    out = np.stack([z, z, z], -1)
    sectors = [
        (h < 60, (c, x, z)), ((h >= 60) & (h < 120), (x, c, z)),
        ((h >= 120) & (h < 180), (z, c, x)), ((h >= 180) & (h < 240), (z, x, c)),
        ((h >= 240) & (h < 300), (x, z, c)), (h >= 300, (c, z, x)),
    ]
    for cond, chans in sectors:
        for i, ch in enumerate(chans):
            out[..., i] = np.where(cond, ch, out[..., i])
    return np.clip(out + (v - c)[..., None], 0, 1)


def _hue_membership(h, lo, hi, feather=14):
    """1 inside the band, falling to 0 over `feather` degrees either side.

    The soft edge matters: a hard cutoff leaves a visible seam where a leaf
    shades from yellow-green into something outside the band.
    """
    inside = ((h >= lo) & (h <= hi)) if lo <= hi else ((h >= lo) | (h <= hi))
    dl = np.minimum((h - lo) % 360, (lo - h) % 360)
    dh = np.minimum((h - hi) % 360, (hi - h) % 360)
    return np.where(inside, 1.0, np.clip(1 - np.minimum(dl, dh) / feather, 0, 1))


def grade(im, cfg):
    """Selective saturation + local contrast. See GRADES."""
    a = np.asarray(im).astype(np.float32) / 255
    h, s, v = _to_hsv(a)

    mask = np.zeros_like(h)
    for lo, hi in cfg["hues"]:
        mask = np.maximum(mask, _hue_membership(h, lo, hi))
    mask *= np.clip((s - cfg["saturation_floor"]) / 0.15, 0, 1)

    s = np.clip(s * (1 + (cfg["saturation"] - 1) * mask), 0, 1)
    im = Image.fromarray((_to_rgb(h, s, v) * 255).astype(np.uint8))

    # Radius as a fraction of width so the effect is the same at any cap.
    blurred = np.asarray(
        im.filter(ImageFilter.GaussianBlur(radius=im.width / 70))
    ).astype(np.float32)
    arr = np.asarray(im).astype(np.float32)
    arr = np.clip(arr + (arr - blurred) * cfg["clarity"], 0, 255) / 255

    # S-curve that leaves both ends alone, so nothing crushes or blows out.
    k = cfg["contrast"]
    arr = np.clip(arr + k * (arr - 0.5) * (1 - np.abs(2 * arr - 1)), 0, 1)
    return Image.fromarray((arr * 255).astype(np.uint8))


def audit(argv):
    """Report photos whose EXIF says 'portrait' but that have no rotation set.

    Writes nothing. This is the check that would have caught st-john before it
    shipped sideways; a photo listed as OK here can still be wrong, since EXIF
    is only advisory in this pipeline — but anything flagged is worth a look.
    """
    bad = 0
    print(f"{'slug':<18}{'stored px':<14}{'exif':<6}{'rot':<6} verdict")
    for arg in argv:
        parts = arg.split(":")
        src, slug = parts[0], parts[1]
        rot = int(parts[2]) if len(parts) > 2 else ROTATIONS.get(slug, 0)
        im = Image.open(os.path.expanduser(src))
        orient = im.getexif().get(274, 1)
        quarter_turn = rot in (90, -90, 270)
        if orient in (5, 6, 7, 8) and not quarter_turn:
            verdict, bad = "SIDEWAYS — exif wants a quarter turn, none applied", bad + 1
        elif orient not in (5, 6, 7, 8) and quarter_turn:
            verdict = "rotated by hand (exif claimed upright)"
        else:
            verdict = "ok"
        print(f"{slug:<18}{str(im.size):<14}{orient:<6}{rot:<6} {verdict}")
    return 1 if bad else 0


def main(argv):
    if not argv:
        print(__doc__)
        return 1

    if argv[0] == "--audit":
        return audit(argv[1:])

    results = {}
    with tempfile.TemporaryDirectory() as tmp:
        for arg in argv:
            parts = arg.split(":")
            src, slug = parts[0], parts[1]
            rot = int(parts[2]) if len(parts) > 2 else ROTATIONS.get(slug, 0)

            cap = CAPS.get(slug, CAP)
            im = Image.open(os.path.expanduser(src)).convert("RGB")
            if rot:
                im = im.rotate(rot, expand=True)
            if max(im.size) > cap:
                im.thumbnail((cap, cap), Image.LANCZOS)

            staged = os.path.join(tmp, f"{slug}.png")
            enhanced = os.path.join(tmp, f"{slug}.jpg")
            im.save(staged)

            subprocess.run(["swift", SWIFT, staged, enhanced], check=True)

            out = Image.open(enhanced).convert("RGB")
            graded = ""
            if slug in GRADES:
                out = grade(out, GRADES[slug])
                graded = "  graded"

            dest = os.path.join(DEST, f"{slug}.webp")
            out.save(dest, "WEBP", quality=86, method=6)
            results[slug] = [out.width, out.height]
            kb = round(os.path.getsize(dest) / 1024)
            print(f"  {slug:<18} {out.width}x{out.height:<6} {kb} KB{graded}")

    print("\nAdd or update these in lib/content.ts PLATES (w/h must match):")
    print(json.dumps(results, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
