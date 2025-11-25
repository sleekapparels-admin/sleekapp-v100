// Auto-load images from src/assets using Vite import.meta.glob
// Provides simple helpers to select images by category keywords

export type GalleryImage = {
  path: string;
  url: string;
  filename: string;
};

// Glob all images under src/assets with eager loading to get actual URLs
const modules = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,webp}', { 
  eager: true, 
  as: 'url' 
});

const allImages: GalleryImage[] = Object.entries(modules).map(([path, url]) => ({
  path,
  url: url as string,
  filename: path.split('/').pop() || path,
}));

// Resolve URLs lazily (Vite will handle bundling). Consumers should use getFirstImage/getCategoryImage which builds proper URLs at runtime.
function resolveUrl(mod: unknown): string | '' {
  // In dev, modules return a function to import; at build, assets are emitted with URLs via import.meta.glob with {as:'url'}.
  // Here we fallback to using the path for public assets.
  return '';
}

function matches(filename: string, keywords: string[]): boolean {
  const lower = filename.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

export function getCategoryImage(category: string): string {
  const cat = category.toLowerCase();
  let keywords: string[] = [];
  if (cat.includes('knit')) keywords = ['knit', 'sweater', 'cardigan', 'vest'];
  else if (cat.includes('cut')) keywords = ['shirt', 'oxford', 'polo', 'woven'];
  else if (cat.includes('uniform')) keywords = ['uniform', 'jersey', 'team', 'sports'];
  else if (cat.includes('accessories')) keywords = ['beanie', 'hat', 'scarf'];

  const found = allImages.find(img => matches(img.filename, keywords));
  // Return the actual built URL
  return found ? found.url : allImages[0]?.url || '';
}

export function getFirstImage(): string {
  return allImages[0]?.url || '';
}
