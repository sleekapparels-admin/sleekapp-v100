/**
 * Product Category Icon Mapping
 * 
 * This file provides category-specific icons throughout the site
 * ensuring visual consistency and better UX
 */

import { 
  Shirt, 
  Wind, // Activewear icon
  Waves, // Knitwear icon (representing knit texture)
  Users, // Team/Uniforms icon
  Zap, // Performance/Tech icon
  Sparkles, // Premium/Fashion icon
  ShoppingBag, // General products icon
  Package, // Packaging/Shipping icon
  Factory, // Manufacturing icon
  TrendingUp, // Business/Growth icon
  Award, // Quality/Certification icon
  Clock, // Fast/Quick icon
  DollarSign, // Pricing icon
  Shield, // Security/Trust icon
  Globe, // International/Global icon
  Layers, // Materials/Fabric icon
  Scissors, // Tailoring/Custom icon
  Palette, // Design/Color icon
  Ruler, // Sizing/Measurement icon
  type LucideIcon
} from "lucide-react";

export interface CategoryIconConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  label: string;
  description?: string;
}

/**
 * Main product category icon mapping
 * Maps category names (case-insensitive) to their icons and styling
 */
export const CATEGORY_ICONS: Record<string, CategoryIconConfig> = {
  // Casualwear
  "t-shirts": {
    icon: Shirt,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    label: "T-Shirts",
    description: "Casual cotton t-shirts"
  },
  "tshirts": {
    icon: Shirt,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    label: "T-Shirts",
    description: "Casual cotton t-shirts"
  },
  "polo shirts": {
    icon: Shirt,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    label: "Polo Shirts",
    description: "Classic polo shirts"
  },
  "polos": {
    icon: Shirt,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    label: "Polo Shirts",
    description: "Classic polo shirts"
  },
  
  // Hoodies & Sweatshirts
  "hoodies": {
    icon: Wind,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    label: "Hoodies",
    description: "Cozy fleece hoodies"
  },
  "sweatshirts": {
    icon: Wind,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    label: "Sweatshirts",
    description: "Comfortable sweatshirts"
  },
  
  // Activewear
  "activewear": {
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    label: "Activewear",
    description: "Performance athletic wear"
  },
  "sportswear": {
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    label: "Sportswear",
    description: "Sports and athletic wear"
  },
  "athletic": {
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    label: "Athletic Wear",
    description: "Athletic performance clothing"
  },
  "performance wear": {
    icon: Zap,
    color: "text-red-600",
    bgColor: "bg-red-50",
    label: "Performance Wear",
    description: "High-performance athletic gear"
  },
  
  // Knitwear
  "knitwear": {
    icon: Waves,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    label: "Knitwear",
    description: "Knitted garments"
  },
  "sweaters": {
    icon: Waves,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    label: "Sweaters",
    description: "Warm knitted sweaters"
  },
  "cardigans": {
    icon: Waves,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    label: "Cardigans",
    description: "Knitted cardigans"
  },
  
  // Uniforms
  "uniforms": {
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
    label: "Uniforms",
    description: "Professional uniforms"
  },
  "school uniforms": {
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    label: "School Uniforms",
    description: "Educational institution uniforms"
  },
  "corporate uniforms": {
    icon: Users,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    label: "Corporate Uniforms",
    description: "Professional business uniforms"
  },
  "teamwear": {
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    label: "Teamwear",
    description: "Sports team uniforms"
  },
  "workwear": {
    icon: Factory,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    label: "Workwear",
    description: "Industrial work clothing"
  },
  
  // Tank Tops & Sleeveless
  "tank tops": {
    icon: Shirt,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    label: "Tank Tops",
    description: "Sleeveless athletic tops"
  },
  "tanks": {
    icon: Shirt,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    label: "Tank Tops",
    description: "Sleeveless athletic tops"
  },
  
  // Long Sleeve
  "long sleeve": {
    icon: Shirt,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    label: "Long Sleeve",
    description: "Long sleeve shirts"
  },
  
  // Fashion/Premium
  "fashion": {
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    label: "Fashion",
    description: "Trendy fashion apparel"
  },
  "streetwear": {
    icon: Sparkles,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    label: "Streetwear",
    description: "Urban streetwear style"
  },
  "premium": {
    icon: Award,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    label: "Premium",
    description: "High-end premium apparel"
  },
  
  // General/Default
  "apparel": {
    icon: ShoppingBag,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    label: "Apparel",
    description: "General clothing items"
  },
  "clothing": {
    icon: ShoppingBag,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    label: "Clothing",
    description: "General clothing items"
  },
  "garments": {
    icon: ShoppingBag,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    label: "Garments",
    description: "Ready-made garments"
  }
};

/**
 * Get icon configuration for a category
 * Returns default icon if category not found
 * 
 * @param category - Category name (case-insensitive)
 * @returns Icon configuration object
 */
export function getCategoryIcon(category: string): CategoryIconConfig {
  const normalizedCategory = category.toLowerCase().trim();
  
  // Direct match
  if (CATEGORY_ICONS[normalizedCategory]) {
    return CATEGORY_ICONS[normalizedCategory];
  }
  
  // Partial match (e.g., "T-Shirt" matches "t-shirts")
  const partialMatch = Object.keys(CATEGORY_ICONS).find(key => 
    normalizedCategory.includes(key) || key.includes(normalizedCategory)
  );
  
  if (partialMatch) {
    return CATEGORY_ICONS[partialMatch];
  }
  
  // Default fallback
  return {
    icon: ShoppingBag,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    label: category,
    description: "Product category"
  };
}

/**
 * Render a category icon with styling
 * 
 * @param category - Category name
 * @param size - Icon size (default: 20)
 * @param showBackground - Whether to show background circle (default: true)
 * @returns React element
 */
export function CategoryIcon({ 
  category, 
  size = 20, 
  showBackground = true,
  className = ""
}: { 
  category: string; 
  size?: number; 
  showBackground?: boolean;
  className?: string;
}) {
  const config = getCategoryIcon(category);
  const Icon = config.icon;
  
  if (showBackground) {
    return (
      <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center ${className}`}>
        <Icon className={`${config.color}`} size={size} />
      </div>
    );
  }
  
  return <Icon className={`${config.color} ${className}`} size={size} />;
}

/**
 * Feature/Service icon mapping
 * Used for marketing pages and feature highlights
 */
export const FEATURE_ICONS = {
  // LoopTrace AI Features
  "instant-quote": { icon: Zap, color: "text-blue-600", bgColor: "bg-blue-50" },
  "real-time-tracking": { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
  "ai-matching": { icon: Sparkles, color: "text-purple-600", bgColor: "bg-purple-50" },
  "quality-assured": { icon: Shield, color: "text-red-600", bgColor: "bg-red-50" },
  "fast-delivery": { icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
  "competitive-pricing": { icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
  
  // Manufacturing Features
  "factory-direct": { icon: Factory, color: "text-gray-600", bgColor: "bg-gray-50" },
  "certified-suppliers": { icon: Award, color: "text-yellow-600", bgColor: "bg-yellow-50" },
  "global-shipping": { icon: Globe, color: "text-blue-600", bgColor: "bg-blue-50" },
  "custom-design": { icon: Scissors, color: "text-purple-600", bgColor: "bg-purple-50" },
  "material-sourcing": { icon: Layers, color: "text-teal-600", bgColor: "bg-teal-50" },
  "color-options": { icon: Palette, color: "text-pink-600", bgColor: "bg-pink-50" },
  "size-range": { icon: Ruler, color: "text-indigo-600", bgColor: "bg-indigo-50" },
  "packaging": { icon: Package, color: "text-brown-600", bgColor: "bg-brown-50" }
};

/**
 * Get feature icon configuration
 */
export function getFeatureIcon(feature: string) {
  const normalizedFeature = feature.toLowerCase().replace(/\s+/g, "-");
  return FEATURE_ICONS[normalizedFeature as keyof typeof FEATURE_ICONS] || FEATURE_ICONS["factory-direct"];
}

/**
 * Bulk export for easy imports
 */
export default {
  getCategoryIcon,
  CategoryIcon,
  getFeatureIcon,
  CATEGORY_ICONS,
  FEATURE_ICONS
};
