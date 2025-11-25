/**
 * Firebase Database Seeding Script
 * Populates Firestore with sample data for testing
 */

import { firestoreService } from './firestore';
import { authService } from './auth';

// Sample user credentials for testing
export const SAMPLE_USERS = {
  buyer: {
    email: 'sara.buyer@example.com',
    password: 'Test123!@#',
    fullName: 'Sarah Johnson',
    companyName: 'Urban Fashion Co',
    phone: '+1-555-0101',
    role: 'buyer'
  },
  supplier: {
    email: 'ahmed.supplier@example.com',
    password: 'Test123!@#',
    fullName: 'Ahmed Hassan',
    companyName: 'Prime Textiles Ltd',
    phone: '+880-1711-123456',
    role: 'supplier'
  },
  admin: {
    email: 'admin@sleekapparels.com',
    password: 'Admin123!@#',
    fullName: 'Admin User',
    companyName: 'Sleek Apparels',
    phone: '+1-555-0100',
    role: 'admin'
  }
};

// Create sample users
export const seedUsers = async () => {
  console.log('🌱 Seeding users...');
  
  const createdUsers: any = {};
  
  for (const [key, userData] of Object.entries(SAMPLE_USERS)) {
    try {
      // Create auth user
      const { user, error } = await authService.signUp(
        userData.email,
        userData.password,
        userData.fullName
      );
      
      if (error) {
        console.error(`Failed to create ${key}:`, error);
        continue;
      }
      
      if (user) {
        // Update profile with additional data
        await firestoreService.update('profiles', user.uid, {
          company_name: userData.companyName,
          phone: userData.phone
        });
        
        // Create user role
        await firestoreService.create('user_roles', {
          role: userData.role
        }, user.uid);
        
        createdUsers[key] = user;
        console.log(`✅ Created ${key}: ${userData.email}`);
      }
    } catch (err) {
      console.error(`Error creating ${key}:`, err);
    }
  }
  
  return createdUsers;
};

// Seed suppliers
export const seedSuppliers = async (userIds: any) => {
  console.log('🌱 Seeding suppliers...');
  
  if (!userIds.supplier) {
    console.error('❌ Supplier user not found');
    return;
  }
  
  const suppliers = [
    {
      id: userIds.supplier.uid,
      user_id: userIds.supplier.uid,
      company_name: 'Prime Textiles Ltd',
      supplier_type: 'manufacturer',
      location: 'Dhaka, Bangladesh',
      min_order_quantity: 500,
      production_capacity: 50000,
      lead_time_days: 45,
      certifications: ['WRAP', 'BSCI', 'OEKO-TEX'],
      specializations: ['T-Shirts', 'Hoodies', 'Activewear'],
      rating: 4.8,
      total_orders: 0,
      verification_status: 'verified',
      is_active: true
    }
  ];
  
  for (const supplier of suppliers) {
    await firestoreService.create('suppliers', supplier, supplier.id);
    console.log(`✅ Created supplier: ${supplier.company_name}`);
  }
};

// Seed marketplace products
export const seedMarketplaceProducts = async (supplierId: string) => {
  console.log('🌱 Seeding marketplace products...');
  
  const products = [
    {
      supplier_id: supplierId,
      product_type: 'T-Shirts',
      title: 'Premium Cotton T-Shirt - Ready Stock',
      description: 'High-quality 100% combed cotton t-shirts. Ready to ship immediately. Perfect for retail, promotional events, or bulk orders.',
      category: 'T-Shirts',
      subcategory: 'Basics',
      base_price: 6.50,
      available_quantity: 5000,
      moq: 100,
      unit: 'pieces',
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      colors: ['White', 'Black', 'Navy', 'Gray', 'Red'],
      material: '100% Combed Cotton',
      gsm: 180,
      fabric_composition: '100% Cotton',
      lead_time_days: 0,
      shipping_from: 'Dhaka, Bangladesh',
      status: 'approved',
      quality_score: 95,
      is_featured: true,
      views: 1250,
      sales: 45,
      rating: 4.7
    },
    {
      supplier_id: supplierId,
      product_type: 'Hoodies',
      title: 'Fleece Pullover Hoodie - Wholesale Stock',
      description: 'Premium fleece hoodies with adjustable drawstring hood. Available in multiple colors. Ideal for winter collections and bulk purchases.',
      category: 'Hoodies',
      subcategory: 'Fleece',
      base_price: 18.50,
      available_quantity: 2000,
      moq: 50,
      unit: 'pieces',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Black', 'Navy', 'Charcoal', 'Maroon'],
      material: '80% Cotton, 20% Polyester',
      gsm: 320,
      fabric_composition: '80% Cotton, 20% Polyester',
      lead_time_days: 0,
      shipping_from: 'Dhaka, Bangladesh',
      status: 'approved',
      quality_score: 92,
      is_featured: true,
      views: 890,
      sales: 28,
      rating: 4.6
    },
    {
      supplier_id: supplierId,
      product_type: 'Polo Shirts',
      title: 'Classic Pique Polo - Ready to Ship',
      description: 'Comfortable pique polo shirts with 3-button placket. Perfect for corporate wear, uniforms, or casual retail.',
      category: 'Polo Shirts',
      subcategory: 'Business Casual',
      base_price: 9.75,
      available_quantity: 3500,
      moq: 100,
      unit: 'pieces',
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      colors: ['White', 'Black', 'Navy', 'Royal Blue', 'Red'],
      material: '100% Cotton Pique',
      gsm: 200,
      fabric_composition: '100% Cotton',
      lead_time_days: 0,
      shipping_from: 'Dhaka, Bangladesh',
      status: 'approved',
      quality_score: 90,
      is_featured: false,
      views: 645,
      sales: 19,
      rating: 4.5
    },
    {
      supplier_id: supplierId,
      product_type: 'Activewear',
      title: 'Performance Athletic T-Shirt - Moisture Wicking',
      description: 'Technical athletic t-shirts with moisture-wicking technology. Ideal for gyms, sports teams, and active lifestyle brands.',
      category: 'Activewear',
      subcategory: 'Performance',
      base_price: 12.25,
      available_quantity: 4000,
      moq: 100,
      unit: 'pieces',
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      colors: ['Black', 'Navy', 'Charcoal', 'Neon Green', 'Royal Blue'],
      material: 'Polyester Performance Blend',
      gsm: 150,
      fabric_composition: '88% Polyester, 12% Spandex',
      lead_time_days: 0,
      shipping_from: 'Dhaka, Bangladesh',
      status: 'approved',
      quality_score: 94,
      is_featured: true,
      views: 1100,
      sales: 35,
      rating: 4.8
    },
    {
      supplier_id: supplierId,
      product_type: 'Joggers',
      title: 'Cotton Blend Joggers - Comfort Fit',
      description: 'Comfortable joggers with elastic waistband and cuffs. Perfect for loungewear, athleisure, and casual collections.',
      category: 'Bottoms',
      subcategory: 'Casual',
      base_price: 15.00,
      available_quantity: 2500,
      moq: 50,
      unit: 'pieces',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Black', 'Gray', 'Navy', 'Olive'],
      material: '80% Cotton, 20% Polyester',
      gsm: 280,
      fabric_composition: '80% Cotton, 20% Polyester',
      lead_time_days: 0,
      shipping_from: 'Dhaka, Bangladesh',
      status: 'approved',
      quality_score: 88,
      is_featured: false,
      views: 520,
      sales: 12,
      rating: 4.4
    },
    {
      supplier_id: supplierId,
      product_type: 'Caps',
      title: 'Adjustable Baseball Cap - 6-Panel',
      description: 'Classic 6-panel baseball caps with adjustable strap. Great for promotional merchandise and retail.',
      category: 'Accessories',
      subcategory: 'Headwear',
      base_price: 3.25,
      available_quantity: 8000,
      moq: 200,
      unit: 'pieces',
      sizes: ['One Size'],
      colors: ['Black', 'Navy', 'White', 'Red', 'Khaki'],
      material: '100% Cotton Twill',
      gsm: 0,
      fabric_composition: '100% Cotton',
      lead_time_days: 0,
      shipping_from: 'Dhaka, Bangladesh',
      status: 'approved',
      quality_score: 85,
      is_featured: false,
      views: 780,
      sales: 52,
      rating: 4.3
    },
    {
      supplier_id: supplierId,
      product_type: 'Tote Bags',
      title: 'Canvas Tote Bag - Eco-Friendly',
      description: 'Durable canvas tote bags perfect for retail, promotional events, and eco-conscious brands.',
      category: 'Accessories',
      subcategory: 'Bags',
      base_price: 4.50,
      available_quantity: 6000,
      moq: 200,
      unit: 'pieces',
      sizes: ['Standard'],
      colors: ['Natural', 'Black', 'Navy'],
      material: '100% Cotton Canvas',
      gsm: 0,
      fabric_composition: '100% Cotton',
      lead_time_days: 0,
      shipping_from: 'Dhaka, Bangladesh',
      status: 'approved',
      quality_score: 87,
      is_featured: false,
      views: 425,
      sales: 18,
      rating: 4.5
    }
  ];
  
  for (const product of products) {
    await firestoreService.create('marketplace_products', product);
    console.log(`✅ Created product: ${product.title}`);
  }
};

// Main seed function
export const seedDatabase = async () => {
  try {
    console.log('🚀 Starting Firebase database seeding...\n');
    
    // Step 1: Create users
    const users = await seedUsers();
    
    // Step 2: Create suppliers
    await seedSuppliers(users);
    
    // Step 3: Create marketplace products
    if (users.supplier) {
      await seedMarketplaceProducts(users.supplier.uid);
    }
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Buyer: sara.buyer@example.com / Test123!@#');
    console.log('Supplier: ahmed.supplier@example.com / Test123!@#');
    console.log('Admin: admin@sleekapparels.com / Admin123!@#');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
};
