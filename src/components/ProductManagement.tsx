import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit, ImageOff, Loader2 } from "lucide-react";

// ... existing code ...

interface Product {
  id: string;
  title: string;
  category: string;
  gauge: string | null;
  yarn: string | null;
  colors: string[] | null;
  image_url: string;
  description: string | null;
  featured: boolean;
}

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "knitwear",
    gauge: "",
    yarn: "",
    colors: "",
    image_url: "",
    description: "",
    featured: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT VALIDATION: Require either image file OR image URL
    if (!imageFile && !formData.image_url.trim()) {
      toast.error("Product image is required. Please upload an image or provide an image URL.");
      return;
    }

    let uploadedUrl: string | null = null;
    if (imageFile) {
      setUploadingImage(true);
      try {
        const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, "-")}`;
        const { data: uploadRes, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, imageFile, {
            upsert: false,
            contentType: imageFile.type,
          });

        if (uploadError) {
          // Provide specific error messages
          const errorMessage = uploadError.message.includes("Bucket not found") 
            ? "Storage bucket 'product-images' not found. Please contact support."
            : uploadError.message.includes("storage/quota")
            ? "Storage quota exceeded. Please free up space."
            : `Image upload failed: ${uploadError.message}`;
          
          toast.error(errorMessage);
          setUploadingImage(false);
          return; // STOP submission if upload fails
        }
        
        const { data: publicUrl } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadRes.path);
        uploadedUrl = publicUrl.publicUrl;
        setUploadingImage(false);
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Image upload failed. Please try again or use an image URL instead.");
        setUploadingImage(false);
        return; // STOP submission if upload fails
      }
    }

    // Validate final image URL
    const finalImageUrl = uploadedUrl || formData.image_url.trim();
    if (!finalImageUrl) {
      toast.error("Product image is required. Please provide a valid image.");
      return;
    }

    const productData = {
      title: formData.title,
      category: formData.category,
      gauge: formData.gauge || null,
      yarn: formData.yarn || null,
      colors: formData.colors ? formData.colors.split(",").map((c) => c.trim()) : null,
      image_url: finalImageUrl,
      description: formData.description || null,
      featured: formData.featured,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([productData]);

        if (error) throw error;
        toast.success("Product created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      gauge: product.gauge || "",
      yarn: product.yarn || "",
      colors: product.colors ? product.colors.join(", ") : "",
      image_url: product.image_url,
      description: product.description || "",
      featured: product.featured,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      category: "knitwear",
      gauge: "",
      yarn: "",
      colors: "",
      image_url: "",
      description: "",
      featured: false,
    });
    setImageFile(null);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTitle className="sr-only">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {editingProduct ? 'Update product details and save changes' : 'Fill in product information to add to portfolio'}
          </DialogDescription>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category*</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value="knitwear">Knitwear (Sweaters, Pullovers, Cardigans)</SelectItem>
                    <SelectItem value="tshirts">T-Shirts & Tops</SelectItem>
                    <SelectItem value="hoodies">Hoodies & Sweatshirts</SelectItem>
                    <SelectItem value="polo">Polo Shirts</SelectItem>
                    <SelectItem value="dress_shirts">Dress Shirts & Blouses</SelectItem>
                    <SelectItem value="dresses">Dresses & Skirts</SelectItem>
                    <SelectItem value="pants">Pants & Trousers</SelectItem>
                    <SelectItem value="jeans">Jeans & Denim</SelectItem>
                    <SelectItem value="shorts">Shorts</SelectItem>
                    <SelectItem value="activewear">Activewear & Sportswear</SelectItem>
                    <SelectItem value="outerwear">Outerwear & Jackets</SelectItem>
                    <SelectItem value="coats">Coats & Overcoats</SelectItem>
                    <SelectItem value="suits">Suits & Formal Wear</SelectItem>
                    <SelectItem value="uniforms">Uniforms & Workwear</SelectItem>
                    <SelectItem value="sleepwear">Sleepwear & Loungewear</SelectItem>
                    <SelectItem value="underwear">Underwear & Intimates</SelectItem>
                    <SelectItem value="swimwear">Swimwear & Beachwear</SelectItem>
                    <SelectItem value="accessories">Accessories (Scarves, Belts, Hats)</SelectItem>
                    <SelectItem value="safety">Safety Apparel</SelectItem>
                    <SelectItem value="cutsew">Cut & Sew (Custom)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gauge">Gauge/GSM</Label>
                  <Input
                    id="gauge"
                    value={formData.gauge}
                    onChange={(e) => setFormData({ ...formData, gauge: e.target.value })}
                    placeholder="e.g., 12GG or 180GSM"
                  />
                </div>
                <div>
                  <Label htmlFor="yarn">Yarn/Fabric</Label>
                  <Input
                    id="yarn"
                    value={formData.yarn}
                    onChange={(e) => setFormData({ ...formData, yarn: e.target.value })}
                    placeholder="e.g., Cotton Yarn or Cotton Twill Fabric"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="colors">Colors (comma-separated)</Label>
                <Input
                  id="colors"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="e.g., Blue, White, Red"
                />
              </div>

              <div>
                <Label htmlFor="image_file">Upload Image* (Required)</Label>
                <Input
                  id="image_file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading image...
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="image_url">Or Provide Image URL*</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Public URL or /assets/portfolio/filename.webp"
                  disabled={uploadingImage}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Either upload an image file OR provide an image URL (required)
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={uploadingImage}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploadingImage}>
                  {uploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>{editingProduct ? "Update" : "Create"} Product</>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-[4/5] overflow-hidden bg-muted relative">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Show broken image icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.broken-image-icon')) {
                      const iconDiv = document.createElement('div');
                      iconDiv.className = 'broken-image-icon absolute inset-0 flex items-center justify-center';
                      iconDiv.innerHTML = '<div class="text-center"><svg class="h-16 w-16 text-muted-foreground/50 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-sm text-muted-foreground mt-2">Image broken</p></div>';
                      parent.appendChild(iconDiv);
                    }
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <ImageOff className="h-16 w-16 text-destructive/50 mx-auto" />
                    <p className="text-sm text-destructive mt-2 font-semibold">DATA CORRUPT</p>
                    <p className="text-xs text-muted-foreground">Image missing - delete product</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold">{product.title}</h3>
                {product.featured && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex gap-2 mb-4">
                {product.gauge && (
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {product.gauge}
                  </span>
                )}
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded capitalize">
                  {product.category}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No products yet. Click "Add Product" to create one.
        </div>
      )}
    </div>
  );
};
