export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    moq: string;
    leadTime: string;
    fabrics: string[];
    priceRange: string;
    category: string;
    imageUrl?: string;
}

export interface ProductResponse {
    data: Product[];
    error?: string;
}
