// =====================================================
// LOOPTRACE™ MARKETPLACE TYPES
// TypeScript definitions for marketplace system
// =====================================================

export type SupplierType = 'manufacturer' | 'material_supplier' | 'stock_lot_seller' | 'hybrid';

export type SupplierSubcategory =
  | 'knit_manufacturer'
  | 'woven_manufacturer'
  | 'denim_specialist'
  | 'activewear_sportswear'
  | 'uniforms_corporate'
  | 'textile_mill'
  | 'dyeing_mill'
  | 'yarn_supplier'
  | 'trim_accessories'
  | 'printing_services'
  | 'stock_lot_seller'
  | 'sample_collection'
  | 'wholesale_reseller'
  | 'retail_ready_products';

export type ProductStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'sold_out'
  | 'archived';

export type ProductListingTier = 'basic' | 'premium' | 'featured';

export type InquiryStatus = 'pending' | 'quoted' | 'converted_to_order' | 'declined' | 'expired';

export type ApprovalAction = 'approved' | 'rejected' | 'revision_requested' | 'archived';

// =====================================================
// MARKETPLACE PRODUCT
// =====================================================

export interface MarketplaceProduct {
  id: string;
  supplier_id: string;
  
  // Basic Info
  product_type: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  slug?: string;
  
  // Pricing
  base_price: number;
  platform_fee_percentage: number;
  platform_fee_amount?: number; // Computed
  final_price?: number; // Computed
  
  // Inventory
  available_quantity: number;
  moq: number;
  unit: string;
  reserved_quantity: number;
  
  // Media
  images: string[];
  primary_image?: string;
  video_url?: string;
  
  // Specifications
  sizes: string[];
  colors: string[];
  material?: string;
  gsm?: number;
  fabric_composition?: string;
  specifications?: Record<string, any>;
  
  // Logistics
  lead_time_days: number;
  shipping_from?: string;
  shipping_weight_kg?: number;
  
  // Status & Quality
  status: ProductStatus;
  rejection_reason?: string;
  admin_feedback?: string;
  quality_score: number;
  approval_date?: string;
  approved_by?: string;
  
  // Engagement
  views: number;
  inquiries: number;
  sales: number;
  rating: number;
  
  // SEO
  meta_keywords: string[];
  meta_description?: string;
  
  // Featured
  is_featured: boolean;
  featured_until?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
  
  // Relations (when joined)
  suppliers?: {
    company_name: string;
    tier?: string;
    factory_location?: string;
    supplier_ratings?: Array<{ overall_score: number }>;
  };
}

// =====================================================
// PRODUCT FORM DATA
// =====================================================

export interface ProductFormData {
  product_type: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  
  // Pricing
  base_price: number;
  
  // Inventory
  available_quantity: number;
  moq: number;
  unit: string;
  
  // Specifications
  sizes: string[];
  colors: string[];
  material?: string;
  gsm?: number;
  fabric_composition?: string;
  
  // Logistics
  lead_time_days: number;
  shipping_from?: string;
  shipping_weight_kg?: number;
  
  // Media (will be uploaded separately)
  images: File[] | string[];
  video_url?: string;
  
  // Additional specs
  specifications?: Record<string, any>;
}

// =====================================================
// PRODUCT APPROVAL LOG
// =====================================================

export interface ProductApprovalLog {
  id: string;
  product_id: string;
  admin_id: string;
  action: ApprovalAction;
  reason?: string;
  feedback?: string;
  previous_status?: string;
  new_status?: string;
  created_at: string;
}

// =====================================================
// PRODUCT INQUIRY
// =====================================================

export interface ProductInquiry {
  id: string;
  product_id: string;
  buyer_id: string;
  quantity: number;
  message?: string;
  status: InquiryStatus;
  quoted_price?: number;
  quote_notes?: string;
  supplier_response?: string;
  responded_at?: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  marketplace_products?: MarketplaceProduct;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

// =====================================================
// PRODUCT ANALYTICS
// =====================================================

export interface ProductAnalytics {
  id: string;
  product_id: string;
  date: string;
  views: number;
  unique_viewers: number;
  inquiries: number;
  add_to_wishlist: number;
  shares: number;
  created_at: string;
}

// =====================================================
// PRODUCT CATEGORY
// =====================================================

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_category_id?: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// =====================================================
// PRODUCT WISHLIST
// =====================================================

export interface ProductWishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  
  // Relations
  marketplace_products?: MarketplaceProduct;
}

// =====================================================
// SEARCH FILTERS
// =====================================================

export interface ProductSearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  minMoq?: number;
  maxMoq?: number;
  supplier?: string;
  location?: string;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}

// =====================================================
// SEARCH RESULT
// =====================================================

export interface ProductSearchResult {
  products: MarketplaceProduct[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// =====================================================
// BULK UPLOAD DATA
// =====================================================

export interface BulkProductData {
  title: string;
  description: string;
  category: string;
  base_price: number;
  available_quantity: number;
  moq: number;
  material?: string;
  colors?: string;
  sizes?: string;
  gsm?: number;
  lead_time_days?: number;
}

// =====================================================
// APPROVAL STATS
// =====================================================

export interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  avgApprovalTime: number; // in hours
  approvalRate: number; // percentage
}

// =====================================================
// SUPPLIER PRODUCT STATS
// =====================================================

export interface SupplierProductStats {
  total: number;
  active: number;
  pending: number;
  draft: number;
  rejected: number;
  totalViews: number;
  totalInquiries: number;
  totalSales: number;
  avgRating: number;
  approvalRate: number;
}

// =====================================================
// PRODUCT IMAGE UPLOAD
// =====================================================

export interface ProductImageUpload {
  file: File;
  preview: string;
  isUploading: boolean;
  uploadProgress: number;
  url?: string;
  error?: string;
}

// =====================================================
// SUBCATEGORY CONFIG
// =====================================================

export interface SubcategoryConfig {
  value: SupplierSubcategory;
  label: string;
  description: string;
  type: SupplierType;
  requiresApproval: boolean;
  recommendedFields: string[];
}

export const SUBCATEGORY_CONFIGS: SubcategoryConfig[] = [
  {
    value: 'knit_manufacturer',
    label: 'Knit Manufacturer',
    description: 'T-shirts, Polo shirts, Hoodies, Sweatshirts',
    type: 'manufacturer',
    requiresApproval: true,
    recommendedFields: ['gsm', 'fabric_composition', 'sizes']
  },
  {
    value: 'woven_manufacturer',
    label: 'Woven Manufacturer',
    description: 'Shirts, Pants, Jackets, Formal wear',
    type: 'manufacturer',
    requiresApproval: true,
    recommendedFields: ['material', 'sizes', 'colors']
  },
  {
    value: 'denim_specialist',
    label: 'Denim Specialist',
    description: 'Jeans, Denim jackets, Denim products',
    type: 'manufacturer',
    requiresApproval: true,
    recommendedFields: ['gsm', 'wash_type', 'sizes']
  },
  {
    value: 'activewear_sportswear',
    label: 'Activewear & Sportswear',
    description: 'Sports jerseys, Athletic wear, Performance clothing',
    type: 'manufacturer',
    requiresApproval: true,
    recommendedFields: ['material', 'sizes', 'colors']
  },
  {
    value: 'uniforms_corporate',
    label: 'Uniforms & Corporate Wear',
    description: 'School uniforms, Corporate uniforms, Workwear',
    type: 'manufacturer',
    requiresApproval: true,
    recommendedFields: ['material', 'sizes', 'customization']
  },
  {
    value: 'textile_mill',
    label: 'Textile Mill',
    description: 'Fabric rolls, Textile materials',
    type: 'material_supplier',
    requiresApproval: true,
    recommendedFields: ['gsm', 'width', 'composition']
  },
  {
    value: 'dyeing_mill',
    label: 'Dyeing Mill',
    description: 'Fabric dyeing, Color matching services',
    type: 'material_supplier',
    requiresApproval: true,
    recommendedFields: ['color_range', 'moq']
  },
  {
    value: 'yarn_supplier',
    label: 'Yarn Supplier',
    description: 'Cotton yarn, Polyester yarn, Specialty yarns',
    type: 'material_supplier',
    requiresApproval: true,
    recommendedFields: ['count', 'composition', 'unit']
  },
  {
    value: 'stock_lot_seller',
    label: 'Stock Lot Seller',
    description: 'Surplus inventory, Canceled orders, Excess stock',
    type: 'stock_lot_seller',
    requiresApproval: true,
    recommendedFields: ['available_quantity', 'lead_time']
  },
  {
    value: 'sample_collection',
    label: 'Sample Collection',
    description: 'Sample pieces, Prototypes, Development samples',
    type: 'stock_lot_seller',
    requiresApproval: true,
    recommendedFields: ['available_quantity', 'sizes']
  },
  {
    value: 'wholesale_reseller',
    label: 'Wholesale Reseller',
    description: 'Bulk resale, Wholesale distribution',
    type: 'stock_lot_seller',
    requiresApproval: true,
    recommendedFields: ['moq', 'available_quantity']
  },
];

// =====================================================
// PRODUCT CATEGORIES
// =====================================================

export const PRODUCT_CATEGORIES = [
  { value: 'stock-lots', label: 'Stock Lots', icon: 'Package' },
  { value: 'sample-collections', label: 'Sample Collections', icon: 'Shirt' },
  { value: 'textile-fabrics', label: 'Textile & Fabrics', icon: 'Layers' },
  { value: 'finished-garments', label: 'Finished Garments', icon: 'ShoppingBag' },
  { value: 'trims-accessories', label: 'Trims & Accessories', icon: 'Sparkles' },
] as const;

// =====================================================
// IMAGE QUALITY REQUIREMENTS
// =====================================================

export const IMAGE_REQUIREMENTS = {
  minWidth: 800,
  minHeight: 800,
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxImages: 10,
  recommendedRatio: '1:1',
} as const;

// =====================================================
// QUALITY SCORE WEIGHTS
// =====================================================

export const QUALITY_SCORE_WEIGHTS = {
  imageQuality: 30,
  completeness: 25,
  description: 20,
  pricing: 15,
  specifications: 10,
} as const;
