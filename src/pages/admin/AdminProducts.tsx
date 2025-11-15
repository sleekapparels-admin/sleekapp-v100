import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Loader2, Image as ImageIcon, CheckCircle, XCircle, RefreshCw, Upload, Edit, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  description?: string;
  image_url?: string;
  colors?: string[];
  yarn?: string;
  gauge?: string;
  ai_generated_image?: boolean;
  image_approved_by_admin?: boolean;
  image_generation_date?: string;
}

export default function AdminProducts() {
  const [generatingAll, setGeneratingAll] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "knitwear",
    subcategory: "",
    gauge: "",
    yarn: "",
    colors: "",
    description: "",
  });
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    }
  });

  const generateImageMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: {
          productId: product.id,
          title: product.title,
          category: product.category,
          subcategory: product.subcategory,
          description: product.description,
          colors: product.colors,
          yarn: product.yarn
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });

  const approveImageMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .update({ image_approved_by_admin: true })
        .eq('id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Image approved');
    }
  });

  const handleGenerateAll = async () => {
    const productsToGenerate = products?.filter(p => !p.ai_generated_image) || [];
    if (productsToGenerate.length === 0) {
      toast.info('All products already have AI-generated images');
      return;
    }

    setGeneratingAll(true);
    setProgress({ current: 0, total: productsToGenerate.length });

    for (let i = 0; i < productsToGenerate.length; i++) {
      const product = productsToGenerate[i];
      try {
        await generateImageMutation.mutateAsync(product);
        setProgress({ current: i + 1, total: productsToGenerate.length });
        toast.success(`Generated image for ${product.title}`);
        // Delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to generate image for ${product.title}:`, error);
        toast.error(`Failed: ${product.title}`);
      }
    }

    setGeneratingAll(false);
    toast.success('Bulk generation complete!');
  };

  const handleRegenerateImage = async (product: Product) => {
    try {
      await generateImageMutation.mutateAsync(product);
      toast.success(`Regenerated image for ${product.title}`);
    } catch (error) {
      toast.error('Failed to regenerate image');
    }
  };

  const uploadImageMutation = useMutation({
    mutationFn: async ({ productId, file }: { productId: string; file: File }) => {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "-")}`;
      const { data: uploadRes, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { upsert: false, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("product-images")
        .getPublicUrl(uploadRes.path);

      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          image_url: publicUrl.publicUrl,
          ai_generated_image: false,
          image_approved_by_admin: true
        })
        .eq('id', productId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Image uploaded successfully');
      confetti({ particleCount: 100, spread: 70 });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully');
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  });

  const saveProductMutation = useMutation({
    mutationFn: async () => {
      let uploadedUrl: string | null = null;
      
      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, "-")}`;
        const { data: uploadRes, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, imageFile, { upsert: false, contentType: imageFile.type });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadRes.path);
        uploadedUrl = publicUrl.publicUrl;
      }

      const productData = {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory || null,
        gauge: formData.gauge || null,
        yarn: formData.yarn || null,
        colors: formData.colors ? formData.colors.split(",").map(c => c.trim()) : null,
        description: formData.description || null,
        ...(uploadedUrl && { 
          image_url: uploadedUrl,
          ai_generated_image: false,
          image_approved_by_admin: true
        })
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success(editingProduct ? 'Product updated!' : 'Product created!');
      confetti({ particleCount: 100, spread: 70 });
      setEditDialogOpen(false);
      resetForm();
    }
  });

  const handleUploadImage = (product: Product, file: File) => {
    uploadImageMutation.mutate({ productId: product.id, file });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      subcategory: product.subcategory || "",
      gauge: product.gauge || "",
      yarn: product.yarn || "",
      colors: product.colors?.join(", ") || "",
      description: product.description || "",
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      category: "knitwear",
      subcategory: "",
      gauge: "",
      yarn: "",
      colors: "",
      description: "",
    });
    setImageFile(null);
  };

  const stats = {
    total: products?.length || 0,
    aiGenerated: products?.filter(p => p.ai_generated_image).length || 0,
    approved: products?.filter(p => p.image_approved_by_admin).length || 0,
    needsReview: products?.filter(p => p.ai_generated_image && !p.image_approved_by_admin).length || 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Portfolio Management</h1>
        <p className="text-muted-foreground">Generate and manage AI product images</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.aiGenerated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.needsReview}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions & Add Product */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={editDialogOpen} onOpenChange={(open) => {
              setEditDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                  <DialogDescription>
                    {editingProduct ? "Update product details" : "Fill in product information to add to portfolio"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); saveProductMutation.mutate(); }} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Product Title*</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Classic Polo Shirt"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category*</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="knitwear">Knitwear</SelectItem>
                          <SelectItem value="cutsew">Cut & Sew</SelectItem>
                          <SelectItem value="uniforms">Uniforms</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Input
                        id="subcategory"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        placeholder="e.g., Polo Shirts"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gauge">Gauge</Label>
                      <Input
                        id="gauge"
                        value={formData.gauge}
                        onChange={(e) => setFormData({ ...formData, gauge: e.target.value })}
                        placeholder="e.g., 12GG"
                      />
                    </div>
                    <div>
                      <Label htmlFor="yarn">Yarn Type</Label>
                      <Input
                        id="yarn"
                        value={formData.yarn}
                        onChange={(e) => setFormData({ ...formData, yarn: e.target.value })}
                        placeholder="e.g., Cotton Pique"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="colors">Colors (comma-separated)</Label>
                    <Input
                      id="colors"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="e.g., Navy, White, Red"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image_file">Upload Product Image</Label>
                    <Input
                      id="image_file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload high-quality product photo (recommended: studio lighting, DSLR quality)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product features, materials, use cases..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saveProductMutation.isPending}>
                      {saveProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk AI Generation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateAll}
              disabled={generatingAll}
              className="w-full"
            >
              {generatingAll ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating {progress.current}/{progress.total}
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate All Missing Images ({products?.filter(p => !p.ai_generated_image).length || 0})
                </>
              )}
            </Button>
            {generatingAll && (
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div 
              className="aspect-[4/5] bg-white cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-contain p-4"
              />
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm line-clamp-2">{product.title}</h3>
                  {product.ai_generated_image && (
                    <Badge variant={product.image_approved_by_admin ? "default" : "secondary"} className="ml-2">
                      {product.image_approved_by_admin ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{product.category}</p>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <input
                    type="file"
                    accept="image/*"
                    id={`upload-${product.id}`}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImage(product, file);
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => document.getElementById(`upload-${product.id}`)?.click()}
                    disabled={uploadImageMutation.isPending}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRegenerateImage(product)}
                    disabled={generateImageMutation.isPending}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    AI Gen
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
                {product.ai_generated_image && !product.image_approved_by_admin && (
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => approveImageMutation.mutate(product.id)}
                    disabled={approveImageMutation.isPending}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approve AI Image
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Product Image Preview</DialogTitle>
          <DialogDescription>
            View full size product image for {selectedProduct?.title || 'selected product'}
          </DialogDescription>
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-[4/5] bg-white rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.image_url || '/placeholder.svg'}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain p-8"
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Category:</strong> {selectedProduct.category}</div>
                  {selectedProduct.subcategory && (
                    <div><strong>Subcategory:</strong> {selectedProduct.subcategory}</div>
                  )}
                  {selectedProduct.description && (
                    <div><strong>Description:</strong> {selectedProduct.description}</div>
                  )}
                  {selectedProduct.ai_generated_image && (
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedProduct.image_approved_by_admin ? "default" : "secondary"}>
                        {selectedProduct.image_approved_by_admin ? 'Approved' : 'Needs Review'}
                      </Badge>
                      {selectedProduct.image_generation_date && (
                        <span className="text-xs text-muted-foreground">
                          Generated {new Date(selectedProduct.image_generation_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => productToDelete && deleteMutation.mutate(productToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}