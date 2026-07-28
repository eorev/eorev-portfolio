# HANDOFF

Context for picking this up cold. Read this, then `PRODUCT.md` and `DESIGN.md`.

```bash
npm run dev          # http://localhost:3000
```

`npm run dev` binds **3000**. `.claude/launch.json` says 3111, but that only
applies to the Claude Code preview pane, which runs sandboxed and is **not
reachable from your own browser**. If a preview tool claims a server is up on
3111 and Chrome shows nothing, that is why — use 3000.

---

## What this is

A rebuild of eorev-portfolio, which had been untouched since July 2024. The old
version listed Prudential as "Incoming Intern", hardcoded "21 y/o", and led with
a Three.js brain. It was Pages Router with `useState` view-switching, so only
the default view was ever in the HTML.

Now: App Router, one server-rendered document, everything indexable.

### Two routes

| Route | What it is |
|---|---|
| `/` | The live site. A **technical datasheet**: warm paper, hairline rules, mono field labels, one vermilion accent. |
| `/layouts` | Five layout studies of the same content, click-through. `noindex`. **Delete when a direction is chosen.** |

**Ethan picked Gallery** (tab 4) as the direction. It has not been promoted to
`/` yet — that is the main open task.

```bash
rm -rf app/layouts components/layouts   # when done choosing
```

### Content is centralised

Everything lives in `lib/content.ts` — systems, experience, stack, archive,
photos. Components hold no copy. `PLATES[]` drives all photo surfaces, and
`PLATES[0]` (kualoa) is the parallax hero in Gallery; the rest fill the grid.

**`w`/`h` in PLATES must match the files on disk.** They size the layout and
prevent shift. Change a photo, update them.

---

## The photo pipeline

Originals live on `~/Desktop`. Never re-export from a WebP already in
`public/life` — go back to the original.

```bash
python3 tools/import-photos.py ~/Desktop/foo.JPG:my-slug
```

That caps the long edge (**2560** for gallery plates, 4096 for `kualoa`), runs
**Apple Core Image auto-enhance**, applies an **unsharp pass**, and writes
WebP q86. It prints the dimensions to paste into `PLATES`.

### Why 2560, and why the hero is exempt

Next generates variants up to **3840px** (its largest default `deviceSize`), so
8K is unreachable no matter what you feed it. But the real ceiling is lower
still. A gallery plate is laid out at `33vw`, and the browser was measured
requesting **`w=750`** on a phone and 1920 at the widest realistic desktop — so
a 4096 source was shipping roughly twice the pixels anything asked for. 2560
covers every delivered variant and took `public/life` from 20 MB back to 14 MB.

`kualoa` is the exception and stays at 4096: `KualoaParallax` renders at
`72rem`, which at 2x asks Next for the **3840** variant. Capping the hero would
be visible. That exemption lives in `CAPS` in `tools/import-photos.py`.

This is the answer to "can we go 8K": you can, and a phone would still receive
750 pixels of it.

### Sharpness comes from the unsharp pass, not from resolution

next/image downscales hard and **never sharpens afterwards**, which is where
the softness came from — not from a lack of source pixels. Measured at the
750px a phone actually gets, adding `CIUnsharpMask` moved edge detail
**+24%** (waikiki) and **+35%** (puerto-rico).

Radius is `longEdge / 1024`, computed in `autoenhance.swift`, because the
amount of downscaling a plate receives tracks its size. Intensity is **0.7**
and should stay there: halos are visible at 1:1 on high-contrast edges (palm
trunks against flat sky) but collapse into edge definition by 1920 and vanish
by 750. Pushing harder puts them where people would see them.

One thing that did **not** work as expected: dropping the cap 4096 → 2560 was
predicted to add sharpness by shortening Next's downscale. It did not — the
radius scales with size, so the smaller radius and the smaller downscale
cancel. `waikiki` went 55.0 → 55.1. The cap is a size win only. The one plate
that did improve was `puerto-rico`, and only because it now comes from its
real 1440 original instead of Higgsfield's synthetic 4096.

### Selective grade (`GRADES`)

Apple's pass grades the whole frame. `GRADES` in `tools/import-photos.py` adds
an optional per-slug pass afterwards that targets specific hues, which is what
a food photograph needs — the greens and the fish are the subject, the black
bowl and the wood deck are not. Only `poke` uses it.

Two things that were learned the hard way:

- **Vibrance is the wrong curve here.** A vibrance boost deliberately protects
  already-saturated pixels, and in this photo the food *is* the most saturated
  thing in frame, so it barely moved — mean saturation went 0.429 → 0.487 even
  at a strength that looked wrong elsewhere. Straight saturation on the target
  hues works; it now sits at 0.534.
- **The wood deck shares the orange band with the salmon**, so a hue mask alone
  turns the deck garish. `saturation_floor` gates the boost to pixels that are
  already reasonably saturated, which excludes the pale wood.

`clarity` (wide-radius, low-amount unsharp) contributes more of the perceived
"pop" than saturation does. One step above the current values went neon in the
herbs and flattened the tuna to a single red.

### Colour: Apple, not a LUT

`tools/autoenhance.swift` drives Core Image's `autoAdjustmentFilters` — the
engine behind the magic wand in Photos. It analyses each frame and picks its
own filters. It applied `CIFaceBalance` to the group shots and correctly
withheld `CIVibrance` from the black-and-white ones.

Things that do **not** work for this, already tried:

- **Higgsfield generation models regenerate rather than edit.** Asked to remove
  two people from Kualoa, nano-banana returned a different photograph —
  different framing, terrain and grade. Never point it at a real photo.
- **Higgsfield has no LUT or colour-grading endpoint** at all.
- `ffmpeg` **is installed** and supports `lut3d`, so real `.cube` LUTs are
  available if you ever want film emulation. Unused so far.

### Rotation gotcha

`snowboarding-2.JPG` and `mid_run_stop.JPG` carry EXIF orientation tags that
disagree with their stored pixels. `ImageOps.exif_transpose` rotates them
**wrongly**. Rotations are declared explicitly in `tools/import-photos.py`.
Always eyeball a new photo before trusting its EXIF.

The failure runs both ways. `st_john_windmill_bar.JPG` had a *correct* EXIF
tag (orientation 6), but because the pipeline ignores EXIF entirely and the
slug was not in `ROTATIONS`, it shipped sideways — upright content stuffed
into a landscape frame. **Anything shot in portrait must be listed in
`ROTATIONS`, whatever its tag says.** To find omissions before importing:

```bash
python3 tools/import-photos.py --audit ~/Desktop/foo.JPG:my-slug ...
```

It writes nothing and exits non-zero if a photo's EXIF wants a quarter turn
that no rotation supplies. It will still flag `maguro_spot_poke.JPG:poke` —
ignore that one. `poke` is no longer a straight import (see below).

### poke is a derived crop, not a plain import

The deck planks in `maguro_spot_poke.JPG` sit **8.44° off true** and the bowl
is **457px right of centre**, which read as a tilted, off-balance frame. It is
therefore built in two steps rather than one:

1. rotate `+8.44°` about the bowl centre `(2398, 1442)`, then take the
   2884×2884 square centred there — the largest crop that keeps the whole bowl
   and pushes the plastic lid into the corner;
2. feed that intermediate PNG to `import-photos.py` as normal.

Measured with OpenCV (Hough on the deck, bowl masked out). Note `cv2.imread`
**applies EXIF orientation silently** — pass `IMREAD_IGNORE_ORIENTATION` or you
will measure a differently-oriented image than the one that ships. Tighter
crops were tried and rejected: they clip the bowl and pull a blue object at the
right edge into frame.

### Re-importing over an existing slug

`.next/cache/images` keys on the request URL, not the file. Re-import a photo
under the same slug and Next keeps serving the **old** derivative — the fix
looks like it silently failed. Clear it, then hard-reload:

```bash
rm -rf .next/cache/images
```

Changing a photo's orientation also changes its aspect, which re-packs the
justified rows in `PhotoGrid`. Expect the last row to regroup.

---

## The parallax hero (`components/layouts/KualoaParallax.tsx`)

Two layers over one image space: a plate with the figures painted out, and a
cutout of the figures. The plate travels further, so they separate in depth.
Four inputs sum in one rAF loop writing CSS variables:

| var | source |
|---|---|
| `--e` | entrance, eased once on mount |
| `--ax` | ambient sine drift, so the depth is visible without interaction |
| `--sx` `--sy` | pointer; **fades the ambient out** as the visitor takes over |
| `--p` | scroll position |
| `--pan` | common drift, touch only — see below |

### Touch is not interactive

`pointermove` on a phone only fires once a finger is already dragging, so the
effect was effectively invisible there. On touch (`matchMedia("(hover: none)")`)
the pointer listeners are **not attached at all** and the frame drifts on its
own, ~10s for a there-and-back.

Making that drift visible without blowing the margin below turns on one fact:
**only the difference between the two layers can expose the reconstruction
edge — motion applied equally to both is free.** So `--pan` moves plate and
cutout together with an *identical* multiplier (`-1.55%` on each; change one,
change the other) and contributes exactly zero separation. `--ax` still
supplies the depth, boosted 1.3x, which keeps the differential at 1.25% of
image width against a 1.61% margin — 77% of budget.

The preview pane cannot test this by resizing: a narrow desktop window still
reports `hover: hover`, so it takes the desktop path. Force `touch = true`
temporarily to verify.

### The constraint that governs everything here

The plate is reconstructed **44 source px past the silhouettes**. That margin is
a travel budget: the combined separation from all four inputs must stay inside
it, or the reconstruction edge is exposed mid-motion. Measured worst case is
~28 display px against a 44px margin.

**If you increase the travel percentages, raise `MARGIN` in
`tools/build-parallax.py` and re-run it.** They are coupled.

Two failures worth not repeating:

- A **wider** margin is not safer. At 90px the reconstruction became a
  permanent visible halo around both figures — the cutout never covers it.
- A distance-transform fill reads as blur.
- The **row-wise terrain continuation** that replaced it was also wrong, just
  less obviously: where the two figures stood it dragged their shirt colours
  sideways, leaving visible teal and red streaks across the grass plus wavy
  repeats. It is now inpainted with LaMa — see below.

### The fill is LaMa, run below full resolution

`build-parallax.py` inpaints the masked region with **LaMa** (`big-lama.pt`,
196 MB, cached at `~/.cache/lama`, run through the already-installed torch on
MPS in ~1s). It is not in the repo and not a pip dependency — the download
command is in a comment above `LAMA` in that file. `simple-lama-inpainting`
cannot be pip-installed here: Homebrew python is PEP 668 externally managed.

**It must run at reduced resolution.** LaMa was trained around 512px; at the
full 2183×2644 crop its receptive field is too small to synthesise structure
and it returns a flat repetitive stipple that reads as a patch — measurably
"detailed" (86% of surrounding grass) but visibly wrong. At `WORK = 1536` it
produces coherent terrain. The upscale costs sharpness, so `REFOCUS = 60`
unsharps the fill back to ~91% of the surrounding grass's measured edge
detail. Matching that number is what stops it reading as soft.

Higgsfield **cannot** do this. Checked against `models_explore`: every image
model (`nano_banana_2`, `nano_banana_pro`, `gpt_image_2`, `kling_omni_image`)
takes `medias` with roles `image` / `image_references` and **none accepts a
mask**, so they regenerate the whole frame instead of editing a region. A more
expensive model buys a better wrong photograph, not this one with the figures
removed. Do not spend credits re-testing this.

### Rebuild after any change to kualoa.webp

```bash
python3 tools/build-parallax.py tools/assets/kualoa-cutout.png
```

The plate and cutout are derived files. Re-grade the photo and skip this, and
the hero is the only ungraded thing on the page. `tools/assets/kualoa-cutout.png`
is the original Higgsfield matte — keep it, it cannot be regenerated locally.

---

## The photo grid (`components/layouts/PhotoGrid.tsx`)

A justified gallery — rows of matched height, widths proportional to each
photo's shape, every row filling the measure exactly, nothing cropped. Packing
is decided from known dimensions; justification is left to flexbox
(`flex-grow: aspect` with a zero basis), so it re-justifies at any width with
no script.

Two edge cases handled, both found by measuring rather than looking:

- **A short final row** would stretch its photos to absurd height. A row under
  72% of target keeps normal height and ends early instead.
- **A single photo stranded on the last row** reads as a mistake, so it folds
  into the row above when that row can absorb it.

---

## Layout studies (`/layouts`)

Five structurally different treatments of the same content: Stage, Spread,
Index, Gallery, Chapters. **Spread's asymmetric grid needs ≥1024px** — below
that it stacks and looks like the others.

An earlier set (five genre pastiches: terminal, Swiss, Y2K, gallery, brutalist)
was built and rejected — they were costumes, nameable at a glance and
swappable. A second set built around Ethan's actual work (Match, Trace,
Fingerprint, Schema, Changelog) was also rejected as too conceptual. The brief
that landed was **professional and creative, structurally varied, no themes.**

---

## Higgsfield

Ultra plan. Started 3,010 credits, ~2,950 remaining. Upscales cost 2 each.

- `upscale_image` **maxes at 4K** — there is no 8K option, and "4k" means
  ~4096 on the long edge, not a multiplier.
- It **re-encodes input to JPEG** before upscaling (`_resize.jpg` in the job
  payload), so upscaling an already-large photo is a net loss.
- `remove_background` works well — it produced the Kualoa matte.
- Generation models regenerate. See above.

### `outpaint_image`: good result, unusable resolution

Tried on `poke` to widen the square crop to 4:3 so it would match the other
plates. Cost 2 credits. The **composition was genuinely good** — it extended
the deck planks convincingly and removed the plastic lid and a blue object at
the edges, which no local crop could do.

It was rejected on resolution. Measured by template-matching the original
inside the result:

- output is fixed at **2400×1792** for 4:3. Passing explicit `width`/`height`
  (1707×1280) changed nothing — the request is echoed back but the output is
  the same size, so this is a hard ceiling, not a parameter.
- the source is **downscaled to 51%** and inset — a 2884px square came back as
  1470px of real photograph, the rest invented. Half the frame by area.
- the preserved region is **not** byte-identical: aligned diff over the bowl
  was 14.7/255 with 39% of pixels altered, from the JPEG re-encode plus the
  model's own pass. Match score 0.914.

So outpaint trades ~42% of the subject's real detail for framing. Worth it if
a photo is unusable as shot; not worth it to satisfy a layout, especially
since `PhotoGrid` justifies arbitrary aspects by design.

Note `job_status` reports `params.width/height` as the *request*, not the
result — the first job echoed 1200×896 and returned 2400×1792. Read the
returned image, not the params.

---

## Known open items

- [x] **Gallery is now `/`.** `app/page.tsx` renders `<LayoutGallery />` plus
      the signal strip that `LayoutSwitcher` used to supply. `/layouts` is
      untouched and still shows all five studies.
- [ ] **Finish the promotion.** `/` now imports from `components/layouts/`,
      so that directory is production code and cannot simply be deleted. To
      finish: lift `variants.tsx`'s Gallery, `blocks.tsx`, `KualoaParallax`
      and `PhotoGrid` up into `components/`, repoint `app/page.tsx`, then
      remove `app/layouts` + `components/layouts`.
- [ ] **Eight components are now orphaned** — nothing imports them since the
      promotion, because Gallery uses `components/layouts/blocks.tsx` rather
      than these: `Archive`, `Colophon`, `Experience`, `Life`, `Masthead`,
      `Research`, `Stack`, `Systems`. `Primitives`, `PlateStrip`, `Annotation`
      and `Ornament` are orphaned transitively, and `lib/sections.ts` is only
      reachable through `Masthead`. Left in place deliberately — deleting them
      is the same decision as the item above, and they are the only record of
      the pre-Gallery composition.
- [ ] **`la-jolla-cliffs` is 1240×2208**, the softest photo in the set.
      Higgsfield failed it at 4K and the 2K retry never returned. Real-ESRGAN
      locally would fix it properly.
- [ ] **Nothing is committed.** Branch before committing.
- [ ] `whoisethan.dev` does not resolve. Metadata targets
      `whoisethan.dev` (apex canonical, www redirects 308). The
      `.vercel.app` URL still resolves.
- [ ] Captions **Shark dive**, **Old San Juan** and **Last run** were inferred
      by me from the images, not confirmed by Ethan.
- [ ] `public/` is ~14 MB. Fine for Vercel; heavy for git history.

---

## House style

- Business metrics stay **rounded** — "tens of thousands", never exact counts.
  BurntBase is co-owned and its numbers are not Ethan's alone to publish.
- No em dashes in UI copy.
- Deliberately excluded: Project Freefall, Kodai, Commencement photo, the
  restaurant-menu photos (IMG_1430–1433 on the Desktop).
- The anti-bot research is framed as **security research**, naming Footlocker
  and Champs, leading with method. That framing was chosen explicitly.

---

## Verifying UI changes

`tsc --noEmit` passing is **not** sufficient. Two bugs this session passed
typecheck and still broke the page:

- A `{/* comment */}` placed directly inside `return (` gave the component two
  root nodes and blanked the render. SWC rejected it; `tsc` did not.
- Tailwind reads `font-[var(--x)]` as a font-*weight*. Font utilities need the
  type hint: `font-[family-name:var(--x)]`.

So: load the page and assert on real geometry.

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth  // overflow
```

Screenshots from the Claude Code browser pane are unreliable — it returns blank
frames and decodes images at ~1× regardless of DPR. **Measure the DOM; do not
trust a screenshot for sharpness or a blank frame for a bug.**
