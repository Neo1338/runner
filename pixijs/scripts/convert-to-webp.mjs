import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('src', 'assets');
const QUALITY = 75;

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
};

const toWebp = async (inputPath) => {
  const outputPath = inputPath.replace(/\.png$/i, '.webp');
  const inputStat = fs.statSync(inputPath);
  if (fs.existsSync(outputPath)) {
    const outputStat = fs.statSync(outputPath);
    if (outputStat.mtimeMs >= inputStat.mtimeMs) {
      return { inputPath, outputPath, skipped: true };
    }
  }
  await sharp(inputPath)
    .webp({ quality: QUALITY })
    .toFile(outputPath);
  return { inputPath, outputPath, skipped: false };
};

const main = async () => {
  const files = walk(ROOT).filter((file) => file.toLowerCase().endsWith('.png'));
  const results = [];
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    const result = await toWebp(file);
    results.push(result);
  }
  const converted = results.filter((r) => !r.skipped).length;
  const skipped = results.filter((r) => r.skipped).length;
  console.log(`[webp] converted: ${converted}, skipped: ${skipped}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
