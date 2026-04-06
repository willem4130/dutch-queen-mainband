import sharp from "sharp";
import fs from "fs";
import path from "path";

const optimizations = [
  // Background images - high priority, large dimensions
  {
    input: "public/shows-bg.jpg",
    output: "public/shows-bg.webp",
    width: 2560,
    quality: 82,
    description: "Shows background (17MB → ~500KB)",
  },
  {
    input: "public/hero-bg.jpg",
    output: "public/hero-bg.webp",
    width: 2560,
    quality: 82,
    description: "Hero background (5.9MB → ~400KB)",
  },
  {
    input: "public/about-bg.jpg",
    output: "public/about-bg.webp",
    width: 2560,
    quality: 82,
    description: "About background (3.2MB → ~300KB)",
  },
  // Smaller background variants
  {
    input: "public/shows-bg-2560.jpg",
    output: "public/shows-bg-2560.webp",
    width: 2560,
    quality: 82,
    description: "Shows background 2560",
  },
  {
    input: "public/hero-bg-optimized.jpg",
    output: "public/hero-bg-optimized.webp",
    width: 2560,
    quality: 82,
    description: "Hero background optimized",
  },
];

async function optimizeImage(config) {
  const { input, output, width, quality, description } = config;

  if (!fs.existsSync(input)) {
    console.log(`⏭️  Skipping ${input} (not found)`);
    return;
  }

  console.log(`🔄 Processing: ${description}`);

  const inputStats = fs.statSync(input);
  const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);

  await sharp(input)
    .resize(width, null, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toFile(output);

  const outputStats = fs.statSync(output);
  const outputSizeMB = (outputStats.size / 1024 / 1024).toFixed(2);
  const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

  console.log(`✅ ${description}`);
  console.log(
    `   ${inputSizeMB}MB → ${outputSizeMB}MB (${reduction}% reduction)\n`,
  );
}

async function optimizeGalleryImages() {
  const galleryDir = "public/gallery";

  if (!fs.existsSync(galleryDir)) {
    console.log("⏭️  Gallery directory not found");
    return;
  }

  const files = fs
    .readdirSync(galleryDir)
    .filter((f) => f.endsWith(".jpg") || f.endsWith(".png"))
    .filter((f) => !f.includes("-thumb"));

  console.log(`🖼️  Optimizing ${files.length} gallery images...\n`);

  for (const file of files) {
    const input = path.join(galleryDir, file);
    const baseName = path.parse(file).name;
    const output = path.join(galleryDir, `${baseName}.webp`);

    const inputStats = fs.statSync(input);
    const inputSizeKB = (inputStats.size / 1024).toFixed(0);

    await sharp(input)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(output);

    const outputStats = fs.statSync(output);
    const outputSizeKB = (outputStats.size / 1024).toFixed(0);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(
      1,
    );

    console.log(
      `✅ ${file}: ${inputSizeKB}KB → ${outputSizeKB}KB (${reduction}% reduction)`,
    );
  }
}

async function main() {
  console.log("🚀 Starting image optimization...\n");
  console.log("━".repeat(60) + "\n");

  // Optimize background images
  for (const config of optimizations) {
    await optimizeImage(config);
  }

  console.log("━".repeat(60) + "\n");

  // Optimize gallery images
  await optimizeGalleryImages();

  console.log("\n" + "━".repeat(60));
  console.log("✨ Optimization complete!\n");
  console.log("Next steps:");
  console.log("1. Update image references to use .webp files");
  console.log("2. Add fallback <picture> tags for browser compatibility");
  console.log("3. Test in browser");
}

main().catch(console.error);
