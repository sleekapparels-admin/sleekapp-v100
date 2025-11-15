import { useState, useEffect } from "react";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";

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

    let uploadedUrl: string | null = null;
    if (imageFile) {
      try {
        const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, "-")}`;
        const { data: uploadRes, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, imageFile, {
            upsert: false,
            contentType: imageFile.type,
          });

        if (uploadError) throw uploadError;
        const { data: publicUrl } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadRes.path);
        uploadedUrl = publicUrl.publicUrl;
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Image upload failed. Please check storage bucket 'product-images'.");
      }
    }

    const productData = {
      title: formData.title,
      category: formData.category,
      gauge: formData.gauge || null,
      yarn: formData.yarn || null,
      colors: formData.colors ? formData.colors.split(",").map((c) => c.trim()) : null,
      image_url: uploadedUrl || formData.image_url,
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
                  <SelectContent>
                    <SelectItem value="knitwear">Knitwear</SelectItem>
                    <SelectItem value="cutsew">Cut & Sew</SelectItem>
                    <SelectItem value="uniforms">Uniforms</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Label htmlFor="yarn">Yarn</Label>
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
                  placeholder="e.g., Blue, White, Red"
                />
              </div>

              <div>
                <Label htmlFor="image_file">Upload Image</Label>
                <Input
                  id="image_file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Public URL or /assets/portfolio/filename.webp"
                />
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
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? "Update" : "Create"} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
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
