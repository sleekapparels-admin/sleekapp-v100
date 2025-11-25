/**
 * AI-Generated Product Images from Week 2 Session 1
 * 30 Studio-quality 4K product images organized by category
 * All images generated with Flux Pro Ultra model
 */

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  category: 'tshirt' | 'hoodie' | 'jogger' | 'polo' | 'sweatshirt';
  color: string;
  style: string;
}

/**
 * T-Shirts (6 images)
 */
export const tshirts: ProductImage[] = [
  {
    id: 'tshirt-navy-crew',
    url: 'https://www.genspark.ai/api/files/s/dNhTdr0r',
    alt: 'Navy Blue Crew Neck T-Shirt',
    category: 'tshirt',
    color: 'Navy Blue',
    style: 'Crew Neck'
  },
  {
    id: 'tshirt-olive-crew',
    url: 'https://www.genspark.ai/api/files/s/UsGLk2UQ',
    alt: 'Olive Green Crew Neck T-Shirt',
    category: 'tshirt',
    color: 'Olive Green',
    style: 'Crew Neck'
  },
  {
    id: 'tshirt-red-crew',
    url: 'https://www.genspark.ai/api/files/s/ZjaQFkwi',
    alt: 'Red Crew Neck T-Shirt',
    category: 'tshirt',
    color: 'Red',
    style: 'Crew Neck'
  },
  {
    id: 'tshirt-white-vneck',
    url: 'https://www.genspark.ai/api/files/s/WvH4bZ7K',
    alt: 'White V-Neck T-Shirt',
    category: 'tshirt',
    color: 'White',
    style: 'V-Neck'
  },
  {
    id: 'tshirt-charcoal-crew',
    url: 'https://www.genspark.ai/api/files/s/l0fLATUI',
    alt: 'Charcoal Gray Crew Neck T-Shirt',
    category: 'tshirt',
    color: 'Charcoal Gray',
    style: 'Crew Neck'
  },
  {
    id: 'tshirt-sage-crew',
    url: 'https://www.genspark.ai/api/files/s/o0ULSBqP',
    alt: 'Sage Green Crew Neck T-Shirt',
    category: 'tshirt',
    color: 'Sage Green',
    style: 'Crew Neck'
  }
];

/**
 * Hoodies (7 images)
 */
export const hoodies: ProductImage[] = [
  {
    id: 'hoodie-black-pullover',
    url: 'https://www.genspark.ai/api/files/s/Mvgqbe4W',
    alt: 'Black Pullover Hoodie',
    category: 'hoodie',
    color: 'Black',
    style: 'Pullover'
  },
  {
    id: 'hoodie-charcoal-zip',
    url: 'https://www.genspark.ai/api/files/s/2uqmpSBO',
    alt: 'Charcoal Zip-Up Hoodie',
    category: 'hoodie',
    color: 'Charcoal',
    style: 'Zip-Up'
  },
  {
    id: 'hoodie-gray-pullover',
    url: 'https://www.genspark.ai/api/files/s/XSZkwDXv',
    alt: 'Heather Gray Pullover Hoodie',
    category: 'hoodie',
    color: 'Heather Gray',
    style: 'Pullover'
  },
  {
    id: 'hoodie-navy-zip',
    url: 'https://www.genspark.ai/api/files/s/Otia1T8c',
    alt: 'Navy Zip-Up Hoodie',
    category: 'hoodie',
    color: 'Navy',
    style: 'Zip-Up'
  },
  {
    id: 'hoodie-maroon-pullover',
    url: 'https://www.genspark.ai/api/files/s/Nx1tjIco',
    alt: 'Maroon Pullover Hoodie',
    category: 'hoodie',
    color: 'Maroon',
    style: 'Pullover'
  },
  {
    id: 'hoodie-cream-pullover',
    url: 'https://www.genspark.ai/api/files/s/DkKErvY2',
    alt: 'Cream Pullover Hoodie',
    category: 'hoodie',
    color: 'Cream',
    style: 'Pullover'
  },
  {
    id: 'sweatshirt-forest',
    url: 'https://www.genspark.ai/api/files/s/5hSspmgx',
    alt: 'Forest Green Sweatshirt',
    category: 'hoodie',
    color: 'Forest Green',
    style: 'Sweatshirt'
  }
];

/**
 * Joggers (6 images)
 */
export const joggers: ProductImage[] = [
  {
    id: 'jogger-gray',
    url: 'https://www.genspark.ai/api/files/s/0EOd8MBM',
    alt: 'Heather Gray Joggers',
    category: 'jogger',
    color: 'Heather Gray',
    style: 'Athletic Fit'
  },
  {
    id: 'jogger-black',
    url: 'https://www.genspark.ai/api/files/s/X98hJEYH',
    alt: 'Black Joggers',
    category: 'jogger',
    color: 'Black',
    style: 'Athletic Fit'
  },
  {
    id: 'jogger-khaki',
    url: 'https://www.genspark.ai/api/files/s/071JeYXE',
    alt: 'Khaki Joggers',
    category: 'jogger',
    color: 'Khaki',
    style: 'Athletic Fit'
  },
  {
    id: 'jogger-navy',
    url: 'https://www.genspark.ai/api/files/s/WcRuedz4',
    alt: 'Navy Blue Joggers',
    category: 'jogger',
    color: 'Navy Blue',
    style: 'Athletic Fit'
  },
  {
    id: 'jogger-olive',
    url: 'https://www.genspark.ai/api/files/s/Ao75ZtfO',
    alt: 'Olive Green Joggers',
    category: 'jogger',
    color: 'Olive Green',
    style: 'Athletic Fit'
  },
  {
    id: 'jogger-charcoal',
    url: 'https://www.genspark.ai/api/files/s/E2FiLfy8',
    alt: 'Charcoal Joggers',
    category: 'jogger',
    color: 'Charcoal',
    style: 'Athletic Fit'
  }
];

/**
 * Polo Shirts (6 images)
 */
export const polos: ProductImage[] = [
  {
    id: 'polo-white',
    url: 'https://www.genspark.ai/api/files/s/LNO9emNN',
    alt: 'White Polo Shirt',
    category: 'polo',
    color: 'White',
    style: 'Classic Fit'
  },
  {
    id: 'polo-navy',
    url: 'https://www.genspark.ai/api/files/s/OFYMfmBE',
    alt: 'Navy Blue Polo Shirt',
    category: 'polo',
    color: 'Navy Blue',
    style: 'Classic Fit'
  },
  {
    id: 'polo-lightblue',
    url: 'https://www.genspark.ai/api/files/s/nWUlV1i4',
    alt: 'Light Blue Polo Shirt',
    category: 'polo',
    color: 'Light Blue',
    style: 'Classic Fit'
  },
  {
    id: 'polo-black',
    url: 'https://www.genspark.ai/api/files/s/JIAMcaLH',
    alt: 'Black Polo Shirt',
    category: 'polo',
    color: 'Black',
    style: 'Classic Fit'
  },
  {
    id: 'polo-red',
    url: 'https://www.genspark.ai/api/files/s/SSj1FYmA',
    alt: 'Red Polo Shirt',
    category: 'polo',
    color: 'Red',
    style: 'Classic Fit'
  },
  {
    id: 'polo-forestgreen',
    url: 'https://www.genspark.ai/api/files/s/azwzYEqb',
    alt: 'Forest Green Polo Shirt',
    category: 'polo',
    color: 'Forest Green',
    style: 'Classic Fit'
  }
];

/**
 * Sweatshirts (5 images)
 */
export const sweatshirts: ProductImage[] = [
  {
    id: 'sweatshirt-burgundy',
    url: 'https://www.genspark.ai/api/files/s/tVoxxFJX',
    alt: 'Burgundy Sweatshirt',
    category: 'sweatshirt',
    color: 'Burgundy',
    style: 'Crew Neck'
  },
  {
    id: 'sweatshirt-royalblue',
    url: 'https://www.genspark.ai/api/files/s/tMHqNJbF',
    alt: 'Royal Blue Sweatshirt',
    category: 'sweatshirt',
    color: 'Royal Blue',
    style: 'Crew Neck'
  },
  {
    id: 'sweatshirt-mustard',
    url: 'https://www.genspark.ai/api/files/s/5W7ponvq',
    alt: 'Mustard Yellow Sweatshirt',
    category: 'sweatshirt',
    color: 'Mustard Yellow',
    style: 'Crew Neck'
  },
  {
    id: 'sweatshirt-ashgray',
    url: 'https://www.genspark.ai/api/files/s/VFmvUCzp',
    alt: 'Ash Gray Sweatshirt',
    category: 'sweatshirt',
    color: 'Ash Gray',
    style: 'Crew Neck'
  },
  {
    id: 'sweatshirt-camel',
    url: 'https://www.genspark.ai/api/files/s/HRK9n0fp',
    alt: 'Camel Brown Sweatshirt',
    category: 'sweatshirt',
    color: 'Camel Brown',
    style: 'Crew Neck'
  }
];

/**
 * All products combined
 */
export const allProductImages: ProductImage[] = [
  ...tshirts,
  ...hoodies,
  ...joggers,
  ...polos,
  ...sweatshirts
];

/**
 * Get images by category
 */
export function getImagesByCategory(category: ProductImage['category']): ProductImage[] {
  return allProductImages.filter(img => img.category === category);
}

/**
 * Get random images
 */
export function getRandomImages(count: number): ProductImage[] {
  const shuffled = [...allProductImages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get image by ID
 */
export function getImageById(id: string): ProductImage | undefined {
  return allProductImages.find(img => img.id === id);
}

/**
 * Get featured images (first image from each category)
 */
export function getFeaturedImages(): ProductImage[] {
  return [
    tshirts[0],
    hoodies[0],
    joggers[0],
    polos[0],
    sweatshirts[0]
  ];
}
