import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directories = [
  path.join(__dirname, '../src/assets'),
  path.join(__dirname, '../src/assets/factory'),
  path.join(__dirname, '../src/assets/portfolio'),
  path.join(__dirname, '../src/assets/mockups'),
  path.join(__dirname, '../public')
];

async function compressImage(inputPath, outputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const savedPercent = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(2);
      
      console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)} (saved ${savedPercent}%)`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
    return false;
  }
}

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping...`);
    return;
  }

  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const outputPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        await compressImage(filePath, outputPath);
      }
    }
  }
}

async function main() {
  console.log('Starting image compression to WebP format...\n');
  
  for (const dir of directories) {
    console.log(`\nProcessing directory: ${dir}`);
    await processDirectory(dir);
  }
  
  console.log('\n✓ Image compression complete!');
}

main().catch(console.error);
