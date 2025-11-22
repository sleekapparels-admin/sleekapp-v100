import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Package,
  DollarSign,
  Truck,
  FileText,
  Image as ImageIcon,
  Save,
  Send,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ImageUploader } from '@/components/marketplace/ImageUploader';
import { SpecificationsBuilder } from '@/components/marketplace/SpecificationsBuilder';
import { useSupplierByUser } from '@/hooks/useSuppliers';
import { useCreateProduct, useSaveDraft } from '@/hooks/useMarketplace';
import { supabase } from '@/lib/supabase';
import type { ProductStatus } from '@/types/marketplace';

const productSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  product_type: z.string().min(1, 'Product type is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  base_price: z.number().min(0.01, 'Price must be greater than 0'),
  moq: z.number().int().min(1, 'MOQ must be at least 1'),
  available_quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  lead_time_days: z.number().int().min(1, 'Lead time must be at least 1 day'),
  shipping_from: z.string().optional(),
  material: z.string().optional(),
  gsm: z.number().optional(),
  fabric_composition: z.string().optional(),
  meta_keywords: z.string().optional(),
  meta_description: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const PRODUCT_CATEGORIES = [
  { value: 'fabric', label: 'Fabrics & Materials' },
  { value: 'garment', label: 'Finished Garments' },
  { value: 'yarn', label: 'Yarn & Thread' },
  { value: 'accessories', label: 'Trims & Accessories' },
  { value: 'stock_lot', label: 'Stock Lots' },
  { value: 'sample', label: 'Sample Collections' },
];

const PRODUCT_UNITS = [
  { value: 'pieces', label: 'Pieces' },
  { value: 'meters', label: 'Meters' },
  { value: 'yards', label: 'Yards' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'rolls', label: 'Rolls' },
  { value: 'sets', label: 'Sets' },
];

export default function ProductUpload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const { data: supplier, isLoading: supplierLoading } = useSupplierByUser(userId || '');
  
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<Record<string, any>>({});
  const [keywords, setKeywords] = useState<string[]>([]);
  const [productId, setProductId] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const createProductMutation = useCreateProduct();
  const saveDraftMutation = useSaveDraft();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      unit: 'pieces',
      moq: 100,
      lead_time_days: 30,
    },
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (supplier?.factory_location) {
      setValue('shipping_from', supplier.factory_location);
    }
  }, [supplier, setValue]);

  const basePrice = watch('base_price');
  const platformFee = basePrice ? (basePrice * 10) / 100 : 0;
  const finalPrice = basePrice ? basePrice + platformFee : 0;

  const handleSaveDraft = async (data: ProductFormData) => {
    if (!supplier?.id) {
      toast({
        title: 'Error',
        description: 'Supplier profile not found',
        variant: 'destructive',
      });
      return;
    }

    setSavingStatus('saving');

    try {
      const draftData = {
        ...data,
        supplier_id: supplier.id,
        images,
        sizes,
        colors,
        specifications,
        meta_keywords: keywords,
        status: 'draft' as ProductStatus,
      };

      if (productId) {
        // Update existing draft
        await saveDraftMutation.mutateAsync({ id: productId, data: draftData });
      } else {
        // Create new draft
        const newProduct = await saveDraftMutation.mutateAsync({ data: draftData });
        setProductId(newProduct.id);
      }

      setSavingStatus('saved');
      toast({
        title: 'Draft Saved',
        description: 'Your product has been saved as a draft',
      });

      setTimeout(() => setSavingStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving draft:', error);
      setSavingStatus('idle');
      toast({
        title: 'Error',
        description: 'Failed to save draft',
        variant: 'destructive',
      });
    }
  };

  const handlePublish = async (data: ProductFormData) => {
    if (!supplier?.id) {
      toast({
        title: 'Error',
        description: 'Supplier profile not found',
        variant: 'destructive',
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: 'Images Required',
        description: 'Please upload at least one product image',
        variant: 'destructive',
      });
      return;
    }

    try {
      const productData = {
        ...data,
        supplier_id: supplier.id,
        images,
        sizes,
        colors,
        specifications,
        meta_keywords: keywords,
        status: 'pending_approval' as ProductStatus,
        primary_image: images[0],
      };

      await createProductMutation.mutateAsync(productData);

      toast({
        title: 'Product Submitted',
        description: 'Your product has been submitted for admin approval',
      });

      navigate('/supplier-dashboard?tab=products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = handleSubmit((data) => handlePublish(data));

  if (supplierLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must complete your supplier profile before uploading products.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/become-supplier')} className="mt-4">
          Complete Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/supplier-dashboard?tab=products')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Upload New Product
              </h1>
              <p className="text-muted-foreground mt-2">
                Add your product to the LoopTrace™ marketplace
              </p>
            </div>

            {savingStatus === 'saved' && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Draft Saved
              </Badge>
            )}
          </div>
        </motion.div>

        <form onSubmit={onSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">
                <FileText className="mr-2 h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <DollarSign className="mr-2 h-4 w-4" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="specs">
                <Package className="mr-2 h-4 w-4" />
                Specifications
              </TabsTrigger>
              <TabsTrigger value="media">
                <ImageIcon className="mr-2 h-4 w-4" />
                Images
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide essential details about your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Premium Cotton Jersey Fabric - 180 GSM"
                      {...register('title')}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      rows={5}
                      placeholder="Provide detailed description of your product including features, uses, and quality..."
                      {...register('description')}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Product Type & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product_type">Product Type *</Label>
                      <Input
                        id="product_type"
                        placeholder="e.g., Jersey Fabric, T-Shirt"
                        {...register('product_type')}
                      />
                      {errors.product_type && (
                        <p className="text-sm text-destructive">{errors.product_type.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        onValueChange={(value) => setValue('category', value)}
                        defaultValue=""
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-destructive">{errors.category.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Material & Composition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        placeholder="e.g., 100% Cotton"
                        {...register('material')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gsm">GSM (Fabric Weight)</Label>
                      <Input
                        id="gsm"
                        type="number"
                        placeholder="e.g., 180"
                        {...register('gsm', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                  <CardDescription>Set your pricing and stock information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Base Price */}
                  <div className="space-y-2">
                    <Label htmlFor="base_price">Your Base Price (USD) *</Label>
                    <Input
                      id="base_price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 5.50"
                      {...register('base_price', { valueAsNumber: true })}
                    />
                    {errors.base_price && (
                      <p className="text-sm text-destructive">{errors.base_price.message}</p>
                    )}
                  </div>

                  {/* Platform Fee Display */}
                  {basePrice > 0 && (
                    <Alert>
                      <DollarSign className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-semibold">Price Breakdown:</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span>Your Price:</span>
                            <span className="font-medium">${basePrice.toFixed(2)}</span>
                            <span>Platform Fee (10%):</span>
                            <span className="font-medium">${platformFee.toFixed(2)}</span>
                            <span className="text-base font-semibold">Buyer Pays:</span>
                            <span className="text-base font-semibold text-primary">
                              ${finalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* MOQ & Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="moq">Minimum Order Quantity *</Label>
                      <Input
                        id="moq"
                        type="number"
                        {...register('moq', { valueAsNumber: true })}
                      />
                      {errors.moq && (
                        <p className="text-sm text-destructive">{errors.moq.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="available_quantity">Available Quantity *</Label>
                      <Input
                        id="available_quantity"
                        type="number"
                        {...register('available_quantity', { valueAsNumber: true })}
                      />
                      {errors.available_quantity && (
                        <p className="text-sm text-destructive">
                          {errors.available_quantity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit *</Label>
                      <Select onValueChange={(value) => setValue('unit', value)} defaultValue="pieces">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_UNITS.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.unit && (
                        <p className="text-sm text-destructive">{errors.unit.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lead_time_days">Lead Time (Days) *</Label>
                      <Input
                        id="lead_time_days"
                        type="number"
                        {...register('lead_time_days', { valueAsNumber: true })}
                      />
                      {errors.lead_time_days && (
                        <p className="text-sm text-destructive">{errors.lead_time_days.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipping_from">Shipping From</Label>
                      <Input
                        id="shipping_from"
                        placeholder="City, Country"
                        {...register('shipping_from')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs">
              <Card>
                <CardHeader>
                  <CardTitle>Product Specifications</CardTitle>
                  <CardDescription>
                    Add detailed specifications for your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SpecificationsBuilder
                    specifications={specifications}
                    onChange={setSpecifications}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Upload high-quality images of your product (Max 10 images, 5MB each)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    productId={productId || undefined}
                    onImagesChange={setImages}
                    initialImages={images}
                    maxImages={10}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSubmit(handleSaveDraft)}
                  disabled={savingStatus === 'saving'}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {savingStatus === 'saving' ? 'Saving...' : 'Save as Draft'}
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate('/supplier-dashboard?tab=products')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createProductMutation.isPending || images.length === 0}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {createProductMutation.isPending ? 'Submitting...' : 'Submit for Approval'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
