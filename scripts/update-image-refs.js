import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.html'];
const directories = [
  path.join(__dirname, '../src'),
  path.join(__dirname, '../public')
];

function updateImageReferences(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  const patterns = [
    { from: /\.jpg(['"])/g, to: '.webp$1' },
    { from: /\.jpeg(['"])/g, to: '.webp$1' },
    { from: /\.png(['"])/g, to: '.webp$1' }
  ];
  
  patterns.forEach(pattern => {
    if (pattern.from.test(content)) {
      content = content.replace(pattern.from, pattern.to);
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  
  return false;
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        processDirectory(filePath);
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        updateImageReferences(filePath);
      }
    }
  }
}

console.log('Updating image references to WebP format...\n');

directories.forEach(dir => {
  console.log(`Processing: ${dir}`);
  processDirectory(dir);
});

console.log('\n✓ Image reference update complete!');
