/**
 * Generate the favicon / app-icon / PWA-icon set from the KidSmart logo
 * (Harness §19.1). Source is public/kidsmart_logo.png.
 *
 * Outputs (all opaque, logo centered in an inner safe zone so maskable
 * cropping never clips it):
 *   src/app/icon.png        256  — Next serves this as the favicon
 *   src/app/apple-icon.png  180  — iOS home screen (opaque)
 *   public/icon-192.png     192  — manifest (any + maskable)
 *   public/icon-512.png     512  — manifest (any + maskable)
 *
 * sharp has no .ico encoder (Harness §15), so we rely on Next's app/icon.png
 * convention rather than a favicon.ico.
 */
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public", "kidsmart_logo.png");

// KidSmart yellow background — opaque so iOS/Android never render black.
const BG = { r: 255, g: 209, b: 53, alpha: 1 };

async function make(out: string, size: number, padFraction: number): Promise<void> {
  const inner = Math.round(size * (1 - padFraction));
  const logo = await sharp(SRC)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: logo, gravity: "center" }])
    .flatten({ background: BG })
    .png()
    .toFile(out);
  console.log(`  ✓ ${path.relative(ROOT, out)} (${size}px)`);
}

async function main(): Promise<void> {
  console.log("Generating KidSmart icons from", path.relative(ROOT, SRC));
  await make(path.join(ROOT, "src", "app", "icon.png"), 256, 0.12);
  await make(path.join(ROOT, "src", "app", "apple-icon.png"), 180, 0.12);
  // Maskable icons: bigger safe zone so the platform mask can't clip the mark.
  await make(path.join(ROOT, "public", "icon-192.png"), 192, 0.2);
  await make(path.join(ROOT, "public", "icon-512.png"), 512, 0.2);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
