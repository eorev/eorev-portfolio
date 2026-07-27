// Apple's own automatic photo correction — the same analysis the magic wand
// in Photos performs. Core Image inspects each frame and returns the set of
// filters it thinks that specific image needs (tone curve, exposure, contrast,
// saturation, shadow/highlight), rather than applying one fixed recipe.
//
// Every frame then gets an unsharp pass. This is not taste — next/image
// downscales these hard (a 4032px plate is delivered to a phone at 750px) and
// never sharpens afterwards, so the delivered image is measurably softer than
// it needs to be. Sharpening here, at source size, with a radius scaled to the
// resolution, survives that downscale and recovers most of the loss.
//
// usage: swift autoenhance.swift <in.png> <out.jpg> [<in.png> <out.jpg> ...]
//
// Always feed this an ORIGINAL, never an already-processed plate: grading
// twice shifts colour visibly and sharpening twice adds halos.

import Foundation
import CoreImage
import AppKit

let ctx = CIContext(options: [.workingColorSpace: CGColorSpace(name: CGColorSpace.sRGB)!])
var args = Array(CommandLine.arguments.dropFirst())

while args.count >= 2 {
    let inPath = args.removeFirst()
    let outPath = args.removeFirst()

    guard let img = CIImage(contentsOf: URL(fileURLWithPath: inPath)) else {
        FileHandle.standardError.write("could not read \(inPath)\n".data(using: .utf8)!)
        continue
    }

    // Ask Core Image what this particular photograph needs. Red-eye off: these
    // are not flash portraits and it only risks touching skin tones.
    let filters = img.autoAdjustmentFilters(options: [
        .enhance: true,
        .redEye: false,
    ])

    var out = img
    var applied: [String] = []
    for f in filters {
        f.setValue(out, forKey: kCIInputImageKey)
        if let result = f.outputImage {
            out = result
            applied.append(f.name)
        }
    }

    // Radius tracks the long edge because the amount of downscaling a plate
    // receives tracks its size: a 4032px source is reduced far more than a
    // 2208px one, so it needs a correspondingly wider radius to land at the
    // same apparent sharpness once delivered. /1024 puts a 4032px plate at
    // ~3.9, which measured close to the achievable ceiling without haloing.
    let extent = img.extent
    let radius = max(extent.width, extent.height) / 1024.0
    if let mask = CIFilter(name: "CIUnsharpMask") {
        // Clamp first, crop after: the convolution reads beyond the frame and
        // would otherwise darken the border and grow the extent.
        mask.setValue(out.clampedToExtent(), forKey: kCIInputImageKey)
        mask.setValue(radius, forKey: kCIInputRadiusKey)
        mask.setValue(0.7, forKey: kCIInputIntensityKey)
        if let sharpened = mask.outputImage {
            out = sharpened.cropped(to: extent)
            applied.append(String(format: "CIUnsharpMask(r=%.1f)", radius))
        }
    }

    guard let cg = ctx.createCGImage(out, from: out.extent) else {
        FileHandle.standardError.write("render failed \(inPath)\n".data(using: .utf8)!)
        continue
    }
    let rep = NSBitmapImageRep(cgImage: cg)
    guard let data = rep.representation(using: .jpeg,
                                        properties: [.compressionFactor: 0.97]) else { continue }
    try? data.write(to: URL(fileURLWithPath: outPath))

    let name = (inPath as NSString).lastPathComponent
    print("  \(name.padding(toLength: 22, withPad: " ", startingAt: 0)) \(applied.isEmpty ? "no change suggested" : applied.joined(separator: ", "))")
}
