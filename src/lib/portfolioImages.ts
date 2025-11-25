// Import all portfolio images from src/assets/portfolio
import northwoodAcademyPolo from "@/assets/portfolio/northwood-academy-polo.webp";
import cityStrikersJersey from "@/assets/portfolio/city-strikers-jersey.webp";
import basketballUniform from "@/assets/portfolio/basketball-uniform-pro.webp";
import corporatePolo from "@/assets/portfolio/corporate-polo.webp";
import schoolUniform from "@/assets/portfolio/school-uniform-polo-pro.webp";
import soccerKit from "@/assets/portfolio/soccer-uniform-pro.webp";
import schoolSweater from "@/assets/portfolio/knitwear-vest-green.webp";
import bambooPolo from "@/assets/portfolio/black-pique-polo-pro.webp";
import navyBlueCardigan from "@/assets/portfolio/cable-knit-cardigan-navy.webp";
import heatherGreySweater from "@/assets/portfolio/classic-crew-sweater-grey.webp";
import oliveGreenPolo from "@/assets/portfolio/olive-green-polo-pro.webp";
import redCardigan from "@/assets/portfolio/red-cardigan-pro.webp";
import royalBluePolo from "@/assets/portfolio/royal-blue-polo-pro.webp";
import texturedVest from "@/assets/portfolio/forest-green-vest-pro.webp";
import stripedBeanie from "@/assets/portfolio/striped-beanie-pompom-pro.webp";
import lightBlueShirt from "@/assets/portfolio/light-blue-oxford-pro.webp";
import patternSweater from "@/assets/portfolio/pattern-sweater-pro.webp";
import navyStripeSweater from "@/assets/portfolio/navy-stripe-sweater-pro.webp";
import knitwearSweaterBrown from "@/assets/portfolio/knitwear-sweater-brown.webp";
import knitwearPoloBlack from "@/assets/portfolio/black-pique-polo-pro.webp";
import camelBrownSweater from "@/assets/portfolio/camel-brown-sweater-pro.webp";
import chunkyKnitPullover from "@/assets/portfolio/chunky-knit-pullover.webp";
import blackBeanie from "@/assets/portfolio/black-beanie-pro.webp";

export const portfolioImages: Record<string, string> = {
  // With path prefix
  "/assets/portfolio/northwood-academy-polo.webp": northwoodAcademyPolo,
  "/assets/portfolio/city-strikers-jersey.webp": cityStrikersJersey,
  "/assets/portfolio/basketball-uniform.webp": basketballUniform,
  "/assets/portfolio/corporate-polo.webp": corporatePolo,
  "/assets/portfolio/uniform-corporate-polo.webp": corporatePolo,
  "/assets/portfolio/school-uniform.webp": schoolUniform,
  "/assets/portfolio/uniform-school-collection.webp": schoolUniform,
  "/assets/portfolio/soccer-uniform.webp": soccerKit,
  "/assets/portfolio/uniform-sports-soccer.webp": soccerKit,
  "/assets/portfolio/knitwear-vest-green.webp": texturedVest,
  "/assets/portfolio/forest-green-vest.webp": texturedVest,
  "/assets/portfolio/black-pique-polo.webp": bambooPolo,
  "/assets/portfolio/navy-blue-cardigan.webp": navyBlueCardigan,
  "/assets/portfolio/heather-grey-sweater.webp": heatherGreySweater,
  "/assets/portfolio/olive-green-polo.webp": oliveGreenPolo,
  "/assets/portfolio/red-cardigan.webp": redCardigan,
  "/assets/portfolio/royal-blue-polo.webp": royalBluePolo,
  "/assets/portfolio/cream-cable-vest.webp": texturedVest,
  "/assets/portfolio/striped-beanie-pompom.webp": stripedBeanie,
  "/assets/portfolio/light-blue-oxford-shirt.webp": lightBlueShirt,
  "/assets/portfolio/pattern-sweater.webp": patternSweater,
  "/assets/portfolio/navy-stripe-sweater.webp": navyStripeSweater,
  "/assets/portfolio/knitwear-sweater-brown.webp": knitwearSweaterBrown,
  "/assets/portfolio/knitwear-polo-black.webp": knitwearPoloBlack,
  "/assets/portfolio/camel-brown-sweater.webp": camelBrownSweater,
  "/assets/portfolio/chunky-knit-pullover.webp": chunkyKnitPullover,
  "/assets/portfolio/black-knit-beanie.webp": blackBeanie,
  
  // Without path prefix (filename only)
  "northwood-academy-polo.webp": northwoodAcademyPolo,
  "city-strikers-jersey.webp": cityStrikersJersey,
  "basketball-uniform.webp": basketballUniform,
  "corporate-polo.webp": corporatePolo,
  "uniform-corporate-polo.webp": corporatePolo,
  "school-uniform.webp": schoolUniform,
  "uniform-school-collection.webp": schoolUniform,
  "soccer-uniform.webp": soccerKit,
  "uniform-sports-soccer.webp": soccerKit,
  "knitwear-vest-green.webp": texturedVest,
  "forest-green-vest.webp": texturedVest,
  "black-pique-polo.webp": bambooPolo,
  "navy-blue-cardigan.webp": navyBlueCardigan,
  "heather-grey-sweater.webp": heatherGreySweater,
  "olive-green-polo.webp": oliveGreenPolo,
  "red-cardigan.webp": redCardigan,
  "royal-blue-polo.webp": royalBluePolo,
  "cream-cable-vest.webp": texturedVest,
  "striped-beanie-pompom.webp": stripedBeanie,
  "light-blue-oxford-shirt.webp": lightBlueShirt,
  "pattern-sweater.webp": patternSweater,
  "navy-stripe-sweater.webp": navyStripeSweater,
  "knitwear-sweater-brown.webp": knitwearSweaterBrown,
  "knitwear-polo-black.webp": knitwearPoloBlack,
  "camel-brown-sweater.webp": camelBrownSweater,
  "chunky-knit-pullover.webp": chunkyKnitPullover,
  "black-knit-beanie.webp": blackBeanie,
};

export const getPortfolioImage = (identifier: string | null): string | null => {
  if (!identifier) return null;
  
  // Handle direct URLs (external links)
  const isUrl = /^https?:\/\//.test(identifier);
  if (isUrl) return identifier;

  // Normalize extension: try .webp variants if identifier has .png/.jpg/.jpeg
  let normalizedIdentifier = identifier;
  if (/\.(png|jpg|jpeg)$/i.test(identifier)) {
    normalizedIdentifier = identifier.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  }

  // Try exact match for normalized identifier
  if (portfolioImages[normalizedIdentifier]) {
    return portfolioImages[normalizedIdentifier];
  }

  // Try with /assets/portfolio/ prefix
  const withPrefix = `/assets/portfolio/${normalizedIdentifier}`;
  if (portfolioImages[withPrefix]) {
    return portfolioImages[withPrefix];
  }

  // Extract filename and try direct lookup
  const filename = normalizedIdentifier.split('/').pop();
  if (filename && portfolioImages[filename]) {
    return portfolioImages[filename];
  }

  // Try -pro variant for photorealistic images
  if (filename) {
    const proFilename = filename.replace('.webp', '-pro.webp');
    if (portfolioImages[proFilename]) {
      return portfolioImages[proFilename];
    }
    const withProPrefix = `/assets/portfolio/${proFilename}`;
    if (portfolioImages[withProPrefix]) {
      return portfolioImages[withProPrefix];
    }
  }

  // If no match found, return null (let caller handle fallback)
  console.warn(`Portfolio image not found: ${identifier}`);
  return null;
};