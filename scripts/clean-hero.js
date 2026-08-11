const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function main() {
  const src = path.join("public/assets/hero-bg.png");
  const meta = await sharp(src).metadata();
  const width = meta.width || 1024;
  const height = meta.height || 559;

  // Solid navy ellipse covering the entire baked-in green panel + text.
  const coverSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="${width / 2}" cy="${height * 0.02}" rx="${width * 0.48}" ry="${height * 0.62}" fill="#0A2540"/>
    </svg>
  `);

  const cleaned = await sharp(src)
    .composite([{ input: coverSvg, top: 0, left: 0 }])
    .png()
    .toBuffer();

  // Verify cover worked before writing finals
  const check = await sharp(cleaned).raw().toBuffer({ resolveWithObject: true });
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height * 0.2);
  const i = (cy * check.info.width + cx) * check.info.channels;
  const pixel = [check.data[i], check.data[i + 1], check.data[i + 2]];
  console.log("Sample mid-arch after cover:", pixel);

  await sharp(cleaned)
    .resize(1920, Math.round(1920 * (height / width)), { kernel: "lanczos3" })
    .webp({ quality: 90 })
    .toFile(path.join("public/assets/hero-photo.webp"));

  await sharp(cleaned)
    .resize(1920, Math.round(1920 * (height / width)), { kernel: "lanczos3" })
    .png()
    .toFile(path.join("public/assets/hero-photo.png"));

  // Also overwrite hero-bg.png so any leftover references lose the green text
  fs.copyFileSync(path.join("public/assets/hero-photo.png"), path.join("public/assets/hero-bg-clean.png"));

  console.log("Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
