/**
 * Bangladesh Apparel Manufacturing Industry Standards (2025)
 * Based on real-world data and market research
 */

export interface PricingFactors {
  basePrice: number;
  fabricMultiplier: number;
  complexityMultiplier: number;
  volumeDiscount: number;
  customizationCosts: number;
  moqPremium: number;
}

export interface TimelineFactors {
  samplingDays: number;
  productionDays: number;
  bufferDays: number;
  shippingDays: number;
}

// Base pricing by garment type (USD per unit)
export const BASE_PRICES = {
  't-shirt': { min: 3.0, max: 6.0 },
  'polo': { min: 4.0, max: 7.0 },
  'hoodie': { min: 8.0, max: 15.0 },
  'jacket': { min: 12.0, max: 25.0 },
  'sweater': { min: 8.0, max: 14.0 },
  'cardigan': { min: 9.0, max: 16.0 },
  'uniform': { min: 5.0, max: 10.0 },
  'pants': { min: 6.0, max: 12.0 },
  'shorts': { min: 4.0, max: 8.0 },
  'dress': { min: 10.0, max: 20.0 },
} as const;

// Fabric type multipliers
export const FABRIC_MULTIPLIERS = {
  'cotton': 1.0,
  'organic cotton': 1.25,
  'polyester': 1.10,
  'poly-cotton': 1.12,
  'nylon': 1.15,
  'cotton fleece': 1.20,
  'french terry': 1.18,
  'performance fabric': 1.45,
  'technical fabric': 1.50,
  'sustainable fabric': 1.30,
  'cotton pique': 1.05,
  'wool blend': 1.45,
  'acrylic blend': 1.10,
} as const;

// Complexity multipliers
export const COMPLEXITY_MULTIPLIERS = {
  simple: 1.0,
  medium: 1.30,
  complex: 1.60,
} as const;

// Customization costs (USD per unit)
export const CUSTOMIZATION_COSTS = {
  embroidery: { min: 1.0, max: 3.0 },
  'screen printing': { min: 0.5, max: 2.0 },
  'dtg printing': { min: 2.0, max: 4.0 },
  'heat transfer': { min: 1.0, max: 2.5 },
  patches: { min: 0.5, max: 1.5 },
  labels: { min: 0.3, max: 1.0 },
  'custom tags': { min: 0.3, max: 0.8 },
  'special packaging': { min: 0.5, max: 2.0 },
} as const;

// Volume discount tiers
export const VOLUME_DISCOUNTS = [
  { min: 1001, discount: 0.25 },
  { min: 501, discount: 0.20 },
  { min: 201, discount: 0.15 },
  { min: 101, discount: 0.10 },
  { min: 50, discount: 0.0 },
] as const;

// MOQ premiums (for orders below standard MOQ)
export const MOQ_PREMIUM = {
  below50: 0.50,  // 50% premium
  below100: 0.25, // 25% premium
} as const;

// Production timeline (days)
export const PRODUCTION_TIMELINE = {
  sampling: 7,
  perHundredUnits: {
    simple: 3,
    medium: 5,
    complex: 7,
  },
  qc: 2,
  bufferPercentage: 0.15,
} as const;

/**
 * Calculate pricing for a garment order
 */
export function calculatePricing(params: {
  productType: string;
  quantity: number;
  fabric: string;
  complexity: 'simple' | 'medium' | 'complex';
  customizations: string[];
}): PricingFactors {
  const { productType, quantity, fabric, complexity, customizations } = params;

  // Determine base price
  const productKey = Object.keys(BASE_PRICES).find(key => 
    productType.toLowerCase().includes(key)
  ) || 't-shirt';
  const basePriceRange = BASE_PRICES[productKey as keyof typeof BASE_PRICES];
  const basePrice = (basePriceRange.min + basePriceRange.max) / 2;

  // Apply fabric multiplier
  const fabricKey = Object.keys(FABRIC_MULTIPLIERS).find(key =>
    fabric.toLowerCase().includes(key)
  ) || 'cotton';
  const fabricMultiplier = FABRIC_MULTIPLIERS[fabricKey as keyof typeof FABRIC_MULTIPLIERS];

  // Apply complexity multiplier
  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[complexity];

  // Calculate volume discount
  const volumeDiscount = VOLUME_DISCOUNTS.find(tier => quantity >= tier.min)?.discount || 0;

  // Calculate customization costs
  let customizationCosts = 0;
  customizations.forEach(custom => {
    const customKey = Object.keys(CUSTOMIZATION_COSTS).find(key =>
      custom.toLowerCase().includes(key)
    );
    if (customKey) {
      const cost = CUSTOMIZATION_COSTS[customKey as keyof typeof CUSTOMIZATION_COSTS];
      customizationCosts += (cost.min + cost.max) / 2;
    }
  });

  // Apply MOQ premium
  let moqPremium = 0;
  if (quantity < 50) {
    moqPremium = MOQ_PREMIUM.below50;
  } else if (quantity < 100) {
    moqPremium = MOQ_PREMIUM.below100;
  }

  return {
    basePrice,
    fabricMultiplier,
    complexityMultiplier,
    volumeDiscount,
    customizationCosts,
    moqPremium,
  };
}

/**
 * Calculate total price and per-unit cost
 */
export function calculateTotalPrice(factors: PricingFactors, quantity: number) {
  const { basePrice, fabricMultiplier, complexityMultiplier, volumeDiscount, customizationCosts, moqPremium } = factors;
  
  // Calculate base unit price
  let unitPrice = basePrice * fabricMultiplier * complexityMultiplier;
  
  // Add customization costs
  unitPrice += customizationCosts;
  
  // Apply MOQ premium
  unitPrice *= (1 + moqPremium);
  
  // Apply volume discount
  unitPrice *= (1 - volumeDiscount);
  
  // Calculate total
  const totalPrice = unitPrice * quantity;
  
  return {
    unitPrice,
    totalPrice,
    savings: basePrice * fabricMultiplier * complexityMultiplier * quantity * volumeDiscount,
  };
}

/**
 * Calculate production timeline
 */
export function calculateTimeline(params: {
  quantity: number;
  complexity: 'simple' | 'medium' | 'complex';
}): TimelineFactors {
  const { quantity, complexity } = params;
  
  const samplingDays = PRODUCTION_TIMELINE.sampling;
  const daysPerHundred = PRODUCTION_TIMELINE.perHundredUnits[complexity];
  const productionDays = Math.ceil((quantity / 100) * daysPerHundred);
  const bufferDays = Math.ceil(productionDays * PRODUCTION_TIMELINE.bufferPercentage) + PRODUCTION_TIMELINE.qc;
  const shippingDays = 14; // Default air shipping
  
  return {
    samplingDays,
    productionDays,
    bufferDays,
    shippingDays,
  };
}

/**
 * Generate optimization suggestions
 */
export function generateOptimizations(params: {
  quantity: number;
  unitPrice: number;
  fabric: string;
  customizations: string[];
}): string[] {
  const suggestions: string[] = [];
  const { quantity, unitPrice, fabric, customizations } = params;
  
  // Check if increasing quantity would hit a discount tier
  const nextTier = VOLUME_DISCOUNTS.find(tier => quantity < tier.min);
  if (nextTier) {
    const currentDiscount = VOLUME_DISCOUNTS.find(tier => quantity >= tier.min)?.discount || 0;
    const savingsPercent = ((nextTier.discount - currentDiscount) * 100).toFixed(0);
    const newQuantity = nextTier.min;
    suggestions.push(
      `Increasing order to ${newQuantity} units would unlock ${savingsPercent}% volume discount, reducing per-unit cost by approximately $${(unitPrice * (nextTier.discount - currentDiscount)).toFixed(2)}.`
    );
  }
  
  // Suggest fabric alternatives if using premium fabrics
  if (fabric.toLowerCase().includes('organic') || fabric.toLowerCase().includes('sustainable')) {
    suggestions.push(
      `Alternative: Switching to standard cotton blend would reduce cost by approximately $${(unitPrice * 0.20).toFixed(2)} per unit while maintaining good quality.`
    );
  }
  
  // Suggest combining customizations for efficiency
  if (customizations.length > 2) {
    suggestions.push(
      `Consider consolidating to fewer customization methods to reduce setup costs and production time.`
    );
  }
  
  // MOQ suggestions
  if (quantity < 100) {
    const premium = quantity < 50 ? MOQ_PREMIUM.below50 : MOQ_PREMIUM.below100;
    suggestions.push(
      `Current order below standard MOQ of 100 units incurs ${(premium * 100).toFixed(0)}% premium. Reaching 100 units would eliminate this premium.`
    );
  }
  
  return suggestions;
}

/**
 * Identify risk factors for an order
 */
export function identifyRisks(params: {
  quantity: number;
  complexity: 'simple' | 'medium' | 'complex';
  targetDate?: string;
  customizations: string[];
}): string[] {
  const risks: string[] = [];
  const { quantity, complexity, targetDate, customizations } = params;
  
  // Timeline risks
  const timeline = calculateTimeline({ quantity, complexity });
  const totalDays = timeline.samplingDays + timeline.productionDays + timeline.bufferDays;
  
  if (targetDate) {
    const daysUntilTarget = Math.ceil(
      (new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilTarget < totalDays) {
      risks.push(
        `Timeline Risk: Target date requires ${totalDays} days but only ${daysUntilTarget} days available. Rush production may be needed.`
      );
    }
  }
  
  // Complexity risks
  if (complexity === 'complex' && quantity > 500) {
    risks.push(
      `Quality Risk: Complex designs at high volume require extra QC attention. Plan for potential extended quality control phase.`
    );
  }
  
  // Customization risks
  if (customizations.includes('embroidery') && quantity < 100) {
    risks.push(
      `Cost Risk: Embroidery setup costs are fixed, making small quantities less economical. Per-unit cost will be higher.`
    );
  }
  
  // MOQ risks
  if (quantity < 50) {
    risks.push(
      `MOQ Risk: Order below minimum recommended quantity (50 units). Consider if premium pricing (${ (MOQ_PREMIUM.below50 * 100).toFixed(0)}%) aligns with budget.`
    );
  }
  
  return risks;
}
