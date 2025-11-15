// White-background photorealistic portfolio images (WebP optimized)
import poloNavy from "@/assets/portfolio/white/polo-navy.webp";
import poloBlack from "@/assets/portfolio/white/polo-black.webp";
import poloWhite from "@/assets/portfolio/white/polo-white.webp";
import sweaterCamel from "@/assets/portfolio/white/sweater-camel.webp";
import sweaterGrey from "@/assets/portfolio/white/sweater-grey.webp";
import cardiganRed from "@/assets/portfolio/white/cardigan-red.webp";
import cardiganNavy from "@/assets/portfolio/white/cardigan-navy.webp";
import vestGreen from "@/assets/portfolio/white/vest-green.webp";
import vestCream from "@/assets/portfolio/white/vest-cream.webp";
import shirtOxfordBlue from "@/assets/portfolio/white/shirt-oxford-blue.webp";
import hoodieTech from "@/assets/portfolio/white/hoodie-tech.webp";
import schoolUniformPolo from "@/assets/portfolio/white/school-uniform-polo.webp";
import schoolUniformSet from "@/assets/portfolio/white/school-uniform-set.webp";
import sportsJerseyBasketball from "@/assets/portfolio/white/sports-jersey-basketball.webp";
import sportsJerseySoccer from "@/assets/portfolio/white/sports-jersey-soccer.webp";
import beanieBlack from "@/assets/portfolio/white/beanie-black.webp";

// Reference images from user
import referencePolo1 from "@/assets/portfolio/white/reference-polo-1.webp";
import referencePolo2 from "@/assets/portfolio/white/reference-polo-2.webp";

// Category defaults for broad fallback
const categoryDefaults: Record<string, string> = {
  'knitwear': poloNavy,
  'uniforms': schoolUniformPolo,
  'accessories': beanieBlack,
  'cut-sew': shirtOxfordBlue,
  'cutsew': shirtOxfordBlue,
};

// Map of photorealistic images for portfolio
export const photorealisticPortfolioImages: Record<string, string> = {
  // Polos
  "polo-navy": poloNavy,
  "navy-polo": poloNavy,
  "navy-blue-polo": poloNavy,
  "polo-black": poloBlack,
  "black-polo": poloBlack,
  "black-pique-polo": poloBlack,
  "polo-white": poloWhite,
  "white-polo": poloWhite,
  "corporate-polo": poloNavy,
  "royal-blue-polo": poloNavy,
  "olive-green-polo": poloNavy,
  
  // Sweaters
  "sweater-camel": sweaterCamel,
  "camel-sweater": sweaterCamel,
  "camel-brown-sweater": sweaterCamel,
  "sweater-grey": sweaterGrey,
  "grey-sweater": sweaterGrey,
  "heather-grey-sweater": sweaterGrey,
  "navy-stripe-sweater": sweaterGrey,
  "classic-crew-sweater": sweaterCamel,
  
  // Cardigans
  "cardigan-red": cardiganRed,
  "red-cardigan": cardiganRed,
  "cardigan-navy": cardiganNavy,
  "navy-cardigan": cardiganNavy,
  "navy-blue-cardigan": cardiganNavy,
  "cable-knit-cardigan": cardiganRed,
  
  // Vests
  "vest-green": vestGreen,
  "green-vest": vestGreen,
  "forest-green-vest": vestGreen,
  "vest-cream": vestCream,
  "cream-vest": vestCream,
  "cream-cable-vest": vestCream,
  
  // Shirts
  "shirt-oxford-blue": shirtOxfordBlue,
  "oxford-shirt": shirtOxfordBlue,
  "blue-oxford-shirt": shirtOxfordBlue,
  
  // Hoodies
  "hoodie-tech": hoodieTech,
  "tech-hoodie": hoodieTech,
  "tech-fleece-hoodie": hoodieTech,
  
  // School Uniforms
  "school-uniform-polo": schoolUniformPolo,
  "school-polo": schoolUniformPolo,
  "northwood-academy-polo": schoolUniformPolo,
  "uniform-school-collection": schoolUniformSet,
  "school-uniform-set": schoolUniformSet,
  "school-uniform": schoolUniformSet,
  
  // Sports Uniforms
  "sports-jersey-basketball": sportsJerseyBasketball,
  "basketball-jersey": sportsJerseyBasketball,
  "basketball-uniform": sportsJerseyBasketball,
  "uniform-sports-basketball": sportsJerseyBasketball,
  "sports-jersey-soccer": sportsJerseySoccer,
  "soccer-jersey": sportsJerseySoccer,
  "soccer-uniform": sportsJerseySoccer,
  "uniform-sports-soccer": sportsJerseySoccer,
  
  // Accessories
  "beanie-black": beanieBlack,
  "black-beanie": beanieBlack,
  "knit-beanie": beanieBlack,
  
  // Reference images
  "reference-polo-1": referencePolo1,
  "reference-polo-2": referencePolo2,
};

/**
 * Normalize identifier for consistent matching
 */
function normalizeIdentifier(identifier: string): string {
  return identifier
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-');
}

/**
 * Get a photorealistic portfolio image by partial name match
 */
export function getPhotorealisticImage(identifier: string | null): string | null {
  if (!identifier) return null;
  
  // Direct URL - return as is
  if (identifier.startsWith('http://') || identifier.startsWith('https://') || identifier.startsWith('data:')) {
    return identifier;
  }
  
  // Extract filename without extension and path
  const filename = identifier.split('/').pop()?.replace(/\.(png|jpg|jpeg|webp)$/i, '') || '';
  const normalized = normalizeIdentifier(filename);
  
  // Try exact match on normalized
  if (photorealisticPortfolioImages[normalized]) {
    return photorealisticPortfolioImages[normalized];
  }
  
  // Try partial match (e.g., "navy-polo-pro" matches "navy-polo")
  for (const [key, value] of Object.entries(photorealisticPortfolioImages)) {
    const normalizedKey = normalizeIdentifier(key);
    if (normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
      return value;
    }
  }
  
  // Try category-based fallback
  const normalizedOriginal = normalizeIdentifier(identifier);
  for (const [category, defaultImage] of Object.entries(categoryDefaults)) {
    if (normalizedOriginal.includes(category)) {
      return defaultImage;
    }
  }
  
  // No match found
  return null;
}
