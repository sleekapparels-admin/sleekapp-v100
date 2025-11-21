import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Factory, Award, TrendingUp, Users, Plus, X } from "lucide-react";
import { useCreateSupplier } from "@/hooks/useSuppliers";
import { useCreateSupplierCapabilities } from "@/hooks/useSupplierCapabilities";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PRODUCT_CATEGORIES = [
  "T-Shirts",
  "Polo Shirts",
  "Hoodies & Sweatshirts",
  "Sweaters & Cardigans",
  "Uniforms",
  "Activewear",
  "Cotton Suits",
  "Knitwear",
  "Cut & Sew Apparel",
  "Denim",
  "Outerwear",
];

const BecomeSupplier = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createSupplier = useCreateSupplier();
  const createCapabilities = useCreateSupplierCapabilities();
  
  const [formData, setFormData] = useState({
    company_name: "",
    factory_location: "",
    address: "",
    workforce_size: "",
    moq_minimum: "50",
    moq_maximum: "",
    lead_time_days: "45",
    about: "",
    contact_person: "",
    contact_phone: "",
    contact_email: "",
    business_registration_number: "",
    year_established: "",
    total_capacity_monthly: "",
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !customCategories.includes(customCategory.trim())) {
      setCustomCategories([...customCategories, customCategory.trim()]);
      setCustomCategory("");
    }
  };

  const handleRemoveCustomCategory = (category: string) => {
    setCustomCategories(customCategories.filter(c => c !== category));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allCategories = [...selectedCategories, ...customCategories];
    
    if (allCategories.length === 0) {
      toast({
        title: "Product Categories Required",
        description: "Please select at least one product category",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const supplierData = {
        ...formData,
        workforce_size: formData.workforce_size ? parseInt(formData.workforce_size) : undefined,
        moq_minimum: parseInt(formData.moq_minimum),
        moq_maximum: formData.moq_maximum ? parseInt(formData.moq_maximum) : undefined,
        lead_time_days: parseInt(formData.lead_time_days),
        year_established: formData.year_established ? parseInt(formData.year_established) : undefined,
        total_capacity_monthly: formData.total_capacity_monthly ? parseInt(formData.total_capacity_monthly) : undefined,
      };

      const supplier = await createSupplier.mutateAsync(supplierData);

      // Create capabilities for all selected categories
      const capabilities = allCategories.map(category => ({
        supplier_id: supplier.id,
        product_category: category,
        materials: [],
        techniques: [],
      }));

      await createCapabilities.mutateAsync(capabilities);

      toast({
        title: "Application Submitted!",
        description: "Your supplier profile has been created successfully. We'll review it within 2-3 business days.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEO 
        config={{
          title: "Become a Supplier | Join Our Manufacturing Network",
          description: "Join our vetted supplier network and access global buyers. Low-MOQ opportunities, transparent pricing, and managed service support.",
          canonical: "/become-supplier",
        }} 
      />
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                🚀 Includes Free LoopTrace™ Platform Access
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Join Our Vetted Supplier Network
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Connect with global buyers seeking quality manufacturers. Manage orders with LoopTrace™ 
                real-time tracking, access low-MOQ opportunities, and grow your business with transparent pricing.
              </p>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <Users className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Access to Buyers</CardTitle>
                  <CardDescription>
                    Connect with verified international buyers looking for quality manufacturers
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Grow Your Business</CardTitle>
                  <CardDescription>
                    Fill production capacity with consistent orders from our platform
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Verified Badge</CardTitle>
                  <CardDescription>
                    Build trust with our verification system and quality ratings
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Requirements Checklist */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Supplier Requirements</CardTitle>
                <CardDescription>
                  Ensure you meet these requirements before applying
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Valid Business Registration</p>
                      <p className="text-sm text-muted-foreground">Government-issued business license</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Production Capacity</p>
                      <p className="text-sm text-muted-foreground">Minimum 50 pieces per order capability</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Quality Standards</p>
                      <p className="text-sm text-muted-foreground">Meet international quality requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Compliance Certificates</p>
                      <p className="text-sm text-muted-foreground">WRAP, BSCI, or equivalent (preferred)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle>Supplier Application Form</CardTitle>
                <CardDescription>
                  Tell us about your manufacturing facility and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Company Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company_name">Company Name *</Label>
                        <Input
                          id="company_name"
                          required
                          value={formData.company_name}
                          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="business_registration_number">Business Registration Number *</Label>
                        <Input
                          id="business_registration_number"
                          required
                          value={formData.business_registration_number}
                          onChange={(e) => setFormData({ ...formData, business_registration_number: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="factory_location">Factory Location *</Label>
                        <Input
                          id="factory_location"
                          placeholder="e.g., Dhaka, Bangladesh"
                          required
                          value={formData.factory_location}
                          onChange={(e) => setFormData({ ...formData, factory_location: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="year_established">Year Established</Label>
                        <Input
                          id="year_established"
                          type="number"
                          placeholder="e.g., 2015"
                          value={formData.year_established}
                          onChange={(e) => setFormData({ ...formData, year_established: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Full Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="about">About Your Company</Label>
                      <Textarea
                        id="about"
                        placeholder="Tell us about your manufacturing capabilities, specializations, and what makes you unique..."
                        rows={4}
                        value={formData.about}
                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Capacity Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Production Capacity</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="workforce_size">Workforce Size</Label>
                        <Input
                          id="workforce_size"
                          type="number"
                          placeholder="Number of employees"
                          value={formData.workforce_size}
                          onChange={(e) => setFormData({ ...formData, workforce_size: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="total_capacity_monthly">Monthly Production Capacity (pieces)</Label>
                        <Input
                          id="total_capacity_monthly"
                          type="number"
                          placeholder="e.g., 10000"
                          value={formData.total_capacity_monthly}
                          onChange={(e) => setFormData({ ...formData, total_capacity_monthly: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="moq_minimum">Minimum Order Quantity (MOQ) *</Label>
                        <Input
                          id="moq_minimum"
                          type="number"
                          required
                          value={formData.moq_minimum}
                          onChange={(e) => setFormData({ ...formData, moq_minimum: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="moq_maximum">Maximum Order Capacity</Label>
                        <Input
                          id="moq_maximum"
                          type="number"
                          placeholder="Optional"
                          value={formData.moq_maximum}
                          onChange={(e) => setFormData({ ...formData, moq_maximum: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="lead_time_days">Standard Lead Time (days) *</Label>
                        <Input
                          id="lead_time_days"
                          type="number"
                          required
                          value={formData.lead_time_days}
                          onChange={(e) => setFormData({ ...formData, lead_time_days: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Categories */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Product Categories *</h3>
                    <p className="text-sm text-muted-foreground">
                      Select all product categories you can manufacture. You can select multiple.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-3">
                      {PRODUCT_CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label
                            htmlFor={category}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* Custom Categories */}
                    <div className="pt-4">
                      <Label>Add Custom Category (Optional)</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="e.g., Leather Jackets"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCategory())}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddCustomCategory}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {customCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {customCategories.map((category) => (
                            <Badge
                              key={category}
                              variant="secondary"
                              className="flex items-center gap-1 pr-1"
                            >
                              {category}
                              <button
                                type="button"
                                onClick={() => handleRemoveCustomCategory(category)}
                                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Selected Categories Summary */}
                    {(selectedCategories.length > 0 || customCategories.length > 0) && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">
                          Selected Categories ({selectedCategories.length + customCategories.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[...selectedCategories, ...customCategories].map((category) => (
                            <Badge key={category} variant="outline">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact_person">Contact Person</Label>
                        <Input
                          id="contact_person"
                          value={formData.contact_person}
                          onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact_phone">Contact Phone</Label>
                        <Input
                          id="contact_phone"
                          type="tel"
                          value={formData.contact_phone}
                          onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact_email">Contact Email</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          value={formData.contact_email}
                          onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full md:w-auto"
                      disabled={createSupplier.isPending}
                    >
                      {createSupplier.isPending ? "Submitting..." : "Submit Application"}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-3">
                      Your application will be reviewed within 2-3 business days. We'll contact you with next steps.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BecomeSupplier;
