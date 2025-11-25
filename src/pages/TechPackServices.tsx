import { useState } from "react";
import { ArrowRight, Download, FileText, CheckCircle, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SEO } from "@/components/SEO";

export default function TechPackServices() {
  // Tech Pack Auto-Generator State
  const [formData, setFormData] = useState({
    productType: "",
    brandName: "",
    styleNumber: "",
    // Measurements
    chestWidth: "",
    shoulderWidth: "",
    sleeveLength: "",
    bodyLength: "",
    // Fabric Specifications
    fabricType: "",
    fabricWeight: "",
    fabricComposition: "",
    // Construction Details
    stitchType: "",
    neckStyle: "",
    hemStyle: "",
    // Additional Details
    printingMethod: "",
    labelPlacement: "",
    packagingType: "",
    specialInstructions: ""
  });

  const [generatedTechPack, setGeneratedTechPack] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateTechPack = () => {
    setIsGenerating(true);
    
    // Simulate tech pack generation (in real app, this would call backend API)
    setTimeout(() => {
      const techPack = {
        ...formData,
        generatedDate: new Date().toLocaleDateString(),
        techPackId: `TP-${Date.now()}`,
        status: "Draft"
      };
      
      setGeneratedTechPack(techPack);
      setIsGenerating(false);
    }, 1500);
  };

  const downloadTechPack = () => {
    // In production, this would generate a PDF
    const techPackText = `
TECH PACK - ${formData.brandName || "Your Brand"}
Style Number: ${formData.styleNumber || "N/A"}
Product Type: ${formData.productType || "N/A"}
Generated: ${new Date().toLocaleDateString()}

MEASUREMENTS:
- Chest Width: ${formData.chestWidth || "N/A"} inches
- Shoulder Width: ${formData.shoulderWidth || "N/A"} inches
- Sleeve Length: ${formData.sleeveLength || "N/A"} inches
- Body Length: ${formData.bodyLength || "N/A"} inches

FABRIC SPECIFICATIONS:
- Fabric Type: ${formData.fabricType || "N/A"}
- Fabric Weight: ${formData.fabricWeight || "N/A"} GSM
- Composition: ${formData.fabricComposition || "N/A"}

CONSTRUCTION:
- Stitch Type: ${formData.stitchType || "N/A"}
- Neck Style: ${formData.neckStyle || "N/A"}
- Hem Style: ${formData.hemStyle || "N/A"}

ADDITIONAL DETAILS:
- Printing Method: ${formData.printingMethod || "N/A"}
- Label Placement: ${formData.labelPlacement || "N/A"}
- Packaging: ${formData.packagingType || "N/A"}
- Special Instructions: ${formData.specialInstructions || "None"}
    `;

    const blob = new Blob([techPackText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-pack-${formData.styleNumber || 'draft'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const isFormValid = formData.productType && formData.brandName && formData.styleNumber;

  return (
    <div className="min-h-screen bg-background">
      <SEO config={{
        title: "Tech Pack Services - Free Templates & Auto-Generator | Sleek Apparels",
        description: "Create professional tech packs with our free auto-generator tool. Download tech pack templates, get expert consultation, and streamline your apparel production process.",
        keywords: "tech pack template, tech pack generator, apparel tech pack, clothing tech pack, tech pack creation service, tech pack consultation, tech pack review, free tech pack template, tech pack guide, how to create tech pack",
        canonical: "https://sleekapparels.com/tech-pack-services"
      }} />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-600">Free Tech Pack Tools</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tech Pack Services & Free Templates
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create professional tech packs with our free auto-generator tool. Get expert consultation, 
              download templates, and streamline your apparel production process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}>
                Try Auto-Generator <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}>
                Download Templates <Download className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is a Tech Pack? */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">What is a Tech Pack?</h2>
            <Card className="mb-8">
              <CardContent className="pt-6">
                <p className="text-lg mb-4">
                  A <strong>Technical Package (Tech Pack)</strong> is a comprehensive document that contains all the 
                  specifications needed to manufacture your apparel product. It serves as the blueprint that 
                  communicates your design vision to manufacturers.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      What's Included
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Technical sketches (flat drawings)</li>
                      <li>• Detailed measurements (graded by size)</li>
                      <li>• Fabric specifications & composition</li>
                      <li>• Construction details & stitch types</li>
                      <li>• Trim details (zippers, buttons, labels)</li>
                      <li>• Color codes & pantone references</li>
                      <li>• Print/embroidery artwork & placement</li>
                      <li>• Packaging requirements</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      Why You Need One
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Ensures accurate production</li>
                      <li>• Reduces sampling iterations</li>
                      <li>• Minimizes miscommunication</li>
                      <li>• Speeds up manufacturing timeline</li>
                      <li>• Provides quality control reference</li>
                      <li>• Professional presentation to manufacturers</li>
                      <li>• Easier to get accurate quotes</li>
                      <li>• Protects your intellectual property</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Pack Auto-Generator */}
      <section id="generator" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-600">Free Tool</Badge>
              <h2 className="text-3xl font-bold mb-4">Tech Pack Auto-Generator</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Create a professional tech pack in minutes. Fill in the details below and generate a 
                downloadable tech pack document instantly.
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="productType">Product Type *</Label>
                        <Select value={formData.productType} onValueChange={(value) => handleInputChange('productType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="t-shirt">T-Shirt</SelectItem>
                            <SelectItem value="polo">Polo Shirt</SelectItem>
                            <SelectItem value="hoodie">Hoodie</SelectItem>
                            <SelectItem value="sweatshirt">Sweatshirt</SelectItem>
                            <SelectItem value="joggers">Joggers</SelectItem>
                            <SelectItem value="shorts">Shorts</SelectItem>
                            <SelectItem value="jacket">Jacket</SelectItem>
                            <SelectItem value="tank-top">Tank Top</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="brandName">Brand Name *</Label>
                        <Input
                          id="brandName"
                          placeholder="e.g., Urban Threads"
                          value={formData.brandName}
                          onChange={(e) => handleInputChange('brandName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="styleNumber">Style Number *</Label>
                        <Input
                          id="styleNumber"
                          placeholder="e.g., UT-SS24-001"
                          value={formData.styleNumber}
                          onChange={(e) => handleInputChange('styleNumber', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Measurements */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Measurements (inches)</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="chestWidth">Chest Width</Label>
                        <Input
                          id="chestWidth"
                          type="number"
                          placeholder="e.g., 20"
                          value={formData.chestWidth}
                          onChange={(e) => handleInputChange('chestWidth', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shoulderWidth">Shoulder Width</Label>
                        <Input
                          id="shoulderWidth"
                          type="number"
                          placeholder="e.g., 18"
                          value={formData.shoulderWidth}
                          onChange={(e) => handleInputChange('shoulderWidth', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sleeveLength">Sleeve Length</Label>
                        <Input
                          id="sleeveLength"
                          type="number"
                          placeholder="e.g., 8"
                          value={formData.sleeveLength}
                          onChange={(e) => handleInputChange('sleeveLength', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bodyLength">Body Length</Label>
                        <Input
                          id="bodyLength"
                          type="number"
                          placeholder="e.g., 28"
                          value={formData.bodyLength}
                          onChange={(e) => handleInputChange('bodyLength', e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      💡 Tip: These measurements are typically for size Medium. Include grading rules for other sizes.
                    </p>
                  </div>

                  <Separator />

                  {/* Fabric Specifications */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Fabric Specifications</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="fabricType">Fabric Type</Label>
                        <Select value={formData.fabricType} onValueChange={(value) => handleInputChange('fabricType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fabric" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cotton-jersey">100% Cotton Jersey</SelectItem>
                            <SelectItem value="cotton-polyester">Cotton/Polyester Blend</SelectItem>
                            <SelectItem value="french-terry">French Terry</SelectItem>
                            <SelectItem value="fleece">Fleece</SelectItem>
                            <SelectItem value="pique">Pique</SelectItem>
                            <SelectItem value="modal">Modal Blend</SelectItem>
                            <SelectItem value="performance">Performance Fabric</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="fabricWeight">Fabric Weight (GSM)</Label>
                        <Input
                          id="fabricWeight"
                          type="number"
                          placeholder="e.g., 180"
                          value={formData.fabricWeight}
                          onChange={(e) => handleInputChange('fabricWeight', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fabricComposition">Composition</Label>
                        <Input
                          id="fabricComposition"
                          placeholder="e.g., 95% Cotton, 5% Spandex"
                          value={formData.fabricComposition}
                          onChange={(e) => handleInputChange('fabricComposition', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Construction Details */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Construction Details</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="stitchType">Stitch Type</Label>
                        <Select value={formData.stitchType} onValueChange={(value) => handleInputChange('stitchType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stitch type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single-needle">Single Needle</SelectItem>
                            <SelectItem value="double-needle">Double Needle</SelectItem>
                            <SelectItem value="overlock">Overlock (Serger)</SelectItem>
                            <SelectItem value="coverseam">Coverseam</SelectItem>
                            <SelectItem value="flatlock">Flatlock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="neckStyle">Neck Style</Label>
                        <Select value={formData.neckStyle} onValueChange={(value) => handleInputChange('neckStyle', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select neck style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="crew-neck">Crew Neck</SelectItem>
                            <SelectItem value="v-neck">V-Neck</SelectItem>
                            <SelectItem value="henley">Henley</SelectItem>
                            <SelectItem value="mock-neck">Mock Neck</SelectItem>
                            <SelectItem value="hood">Hood</SelectItem>
                            <SelectItem value="collar">Collar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="hemStyle">Hem Style</Label>
                        <Select value={formData.hemStyle} onValueChange={(value) => handleInputChange('hemStyle', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hem style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="straight">Straight Hem</SelectItem>
                            <SelectItem value="curved">Curved Hem</SelectItem>
                            <SelectItem value="side-slits">Side Slits</SelectItem>
                            <SelectItem value="raw-edge">Raw Edge</SelectItem>
                            <SelectItem value="ribbed">Ribbed Hem</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Details */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Additional Details</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor="printingMethod">Printing Method</Label>
                        <Select value={formData.printingMethod} onValueChange={(value) => handleInputChange('printingMethod', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="screen-print">Screen Printing</SelectItem>
                            <SelectItem value="dtg">Direct-to-Garment (DTG)</SelectItem>
                            <SelectItem value="embroidery">Embroidery</SelectItem>
                            <SelectItem value="heat-transfer">Heat Transfer</SelectItem>
                            <SelectItem value="sublimation">Sublimation</SelectItem>
                            <SelectItem value="none">No Printing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="labelPlacement">Label Placement</Label>
                        <Select value={formData.labelPlacement} onValueChange={(value) => handleInputChange('labelPlacement', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select placement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="back-neck">Back Neck</SelectItem>
                            <SelectItem value="side-seam">Side Seam</SelectItem>
                            <SelectItem value="inside-pocket">Inside Pocket</SelectItem>
                            <SelectItem value="printed-label">Printed Label (Tagless)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="packagingType">Packaging Type</Label>
                        <Select value={formData.packagingType} onValueChange={(value) => handleInputChange('packagingType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select packaging" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="polybag">Individual Polybag</SelectItem>
                            <SelectItem value="folded-box">Folded in Box</SelectItem>
                            <SelectItem value="hanger">On Hanger</SelectItem>
                            <SelectItem value="tissue-wrap">Tissue Paper Wrap</SelectItem>
                            <SelectItem value="custom">Custom Packaging</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="specialInstructions">Special Instructions</Label>
                      <textarea
                        id="specialInstructions"
                        className="w-full min-h-[100px] p-3 border rounded-md"
                        placeholder="Add any special requirements, color specifications, quality standards, etc."
                        value={formData.specialInstructions}
                        onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-center pt-4">
                    <Button 
                      size="lg" 
                      onClick={generateTechPack}
                      disabled={!isFormValid || isGenerating}
                      className="w-full md:w-auto"
                    >
                      {isGenerating ? (
                        <>Generating Tech Pack...</>
                      ) : (
                        <>
                          <FileText className="mr-2 h-5 w-5" />
                          Generate Tech Pack
                        </>
                      )}
                    </Button>
                  </div>

                  {!isFormValid && (
                    <p className="text-sm text-amber-600 text-center">
                      * Please fill in Product Type, Brand Name, and Style Number to generate tech pack
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generated Tech Pack Preview */}
            {generatedTechPack && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-semibold">Tech Pack Generated Successfully!</h3>
                    </div>
                    <Badge className="bg-green-600">Ready to Download</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Your tech pack has been generated. Review the summary below and download for your records.
                  </p>
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">Tech Pack ID:</p>
                        <p className="text-muted-foreground">{generatedTechPack.techPackId}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Generated Date:</p>
                        <p className="text-muted-foreground">{generatedTechPack.generatedDate}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Brand:</p>
                        <p className="text-muted-foreground">{generatedTechPack.brandName}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Style Number:</p>
                        <p className="text-muted-foreground">{generatedTechPack.styleNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={downloadTechPack}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Tech Pack
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/contact'}>
                      Request Professional Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Downloadable Templates */}
      <section id="templates" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-600">Free Downloads</Badge>
              <h2 className="text-3xl font-bold mb-4">Tech Pack Templates</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Download our professional tech pack templates to jumpstart your production process. 
                All templates include sample data and industry-standard specifications.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "T-Shirt Tech Pack",
                  description: "Complete template for basic crew neck t-shirts with graded measurements",
                  pages: "6 pages",
                  includes: ["Flat sketches", "Measurement charts", "Fabric specs", "Construction details"]
                },
                {
                  title: "Hoodie Tech Pack",
                  description: "Comprehensive template for pullover and zip-up hoodies with pocket details",
                  pages: "10 pages",
                  includes: ["Hood construction", "Pocket specs", "Drawstring details", "Rib specifications"]
                },
                {
                  title: "Joggers Tech Pack",
                  description: "Detailed template for athletic joggers with elastic waistband and cuffs",
                  pages: "8 pages",
                  includes: ["Waistband construction", "Pocket patterns", "Leg taper specs", "Cuff measurements"]
                }
              ].map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <FileText className="h-10 w-10 text-blue-600" />
                      <Badge variant="secondary">{template.pages}</Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{template.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{template.description}</p>
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2">Includes:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {template.includes.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Need More Templates?</h3>
                    <p className="text-muted-foreground">
                      We're continuously adding new tech pack templates. Subscribe to our newsletter to get 
                      notified when new templates are available.
                    </p>
                  </div>
                  <Button size="lg">Subscribe for Updates</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Pack Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Professional Tech Pack Services</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Not sure where to start? Our experts can help create, review, or optimize your tech packs 
                for production success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Tech Pack Creation */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-semibold mb-4">Tech Pack Creation</h3>
                  <p className="text-muted-foreground mb-6">
                    Have a design but no tech pack? We'll create a professional, production-ready tech pack 
                    from your sketches, photos, or detailed descriptions.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm">Professional flat technical drawings</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm">Complete measurement specifications (graded by size)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm">Fabric recommendations & sourcing options</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm">Construction details & quality standards</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm">Trim specifications & supplier contacts</p>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-semibold text-green-800 mb-1">✨ Special Offer</p>
                    <p className="text-sm text-green-700">
                      <strong>FREE</strong> tech pack creation for clients placing bulk orders (100+ units). 
                      Standalone service: $150 per tech pack.
                    </p>
                  </div>
                  <Button className="w-full" onClick={() => window.location.href = '/contact'}>
                    Request Tech Pack Creation
                  </Button>
                </CardContent>
              </Card>

              {/* Tech Pack Review */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-semibold mb-4">Tech Pack Review & Consultation</h3>
                  <p className="text-muted-foreground mb-6">
                    Already have a tech pack? Get expert feedback to ensure it's production-ready and 
                    optimized for manufacturing efficiency.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm">Comprehensive review of specifications</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm">Identify missing details or inconsistencies</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm">Manufacturing feasibility assessment</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm">Cost optimization recommendations</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm">Turnaround time: 2-3 business days</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-semibold text-blue-800 mb-1">💡 Pricing</p>
                    <p className="text-sm text-blue-700">
                      <strong>FREE</strong> review for prospective bulk order clients. 
                      Standalone review: $50 per tech pack.
                    </p>
                  </div>
                  <Button className="w-full" variant="outline" onClick={() => window.location.href = '/contact'}>
                    Submit Tech Pack for Review
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Good vs Bad Examples */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Good vs. Bad Tech Packs</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Bad Tech Pack */}
              <Card className="border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-red-600">❌ Incomplete Tech Pack</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="bg-red-50 p-3 rounded">
                      <p className="font-semibold mb-1">Missing Critical Information:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• No graded measurements (only one size)</li>
                        <li>• Vague fabric description: "soft cotton"</li>
                        <li>• No construction details or stitch types</li>
                        <li>• Missing color codes or references</li>
                        <li>• No trim specifications</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="font-semibold mb-1">Common Problems:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Unclear or hand-drawn sketches</li>
                        <li>• Inconsistent measurement units</li>
                        <li>• No tolerance guidelines</li>
                        <li>• Missing packaging requirements</li>
                        <li>• No quality control standards</li>
                      </ul>
                    </div>
                    <p className="text-sm text-red-700 font-semibold">
                      Result: Multiple sampling rounds, delays, and potential quality issues.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Good Tech Pack */}
              <Card className="border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-green-600">✅ Professional Tech Pack</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold mb-1">Complete Information:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Full grading table (XS to XXL)</li>
                        <li>• Specific fabric: "180 GSM Cotton Jersey, 95/5"</li>
                        <li>• Detailed construction notes with diagrams</li>
                        <li>• Pantone TPX color codes</li>
                        <li>• All trim specs with supplier options</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold mb-1">Professional Standards:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• CAD-quality flat technical drawings</li>
                        <li>• Consistent units (inches or cm)</li>
                        <li>• +/- tolerance specifications</li>
                        <li>• Clear packaging instructions</li>
                        <li>• AQL standards defined</li>
                      </ul>
                    </div>
                    <p className="text-sm text-green-700 font-semibold">
                      Result: Faster sampling, accurate production, fewer revisions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Video Tutorial Placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                    <Play className="h-10 w-10 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Video Tutorial: Creating Your First Tech Pack</h2>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Watch our comprehensive video guide on creating professional tech packs from scratch. 
                    Learn industry best practices and avoid common mistakes.
                  </p>
                  <Badge className="mb-4 bg-amber-600">Coming Soon</Badge>
                  <p className="text-sm text-muted-foreground">
                    Subscribe to our newsletter to be notified when the video tutorial is released.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "Do I need a tech pack to place an order?",
                  a: "While not mandatory, a tech pack significantly improves production accuracy and reduces sampling time. If you don't have one, we can create it for you (free for bulk orders of 100+ units)."
                },
                {
                  q: "What's the difference between your auto-generator and professional tech pack creation?",
                  a: "The auto-generator creates a basic tech pack with the information you provide. Our professional service includes expert consultation, CAD drawings, fabric recommendations, and detailed specifications that meet industry standards."
                },
                {
                  q: "Can you help if I only have a sketch or photo of my design?",
                  a: "Absolutely! Our tech pack creation service can work from sketches, reference photos, or even detailed verbal descriptions. We'll translate your vision into production-ready specifications."
                },
                {
                  q: "How long does it take to create a professional tech pack?",
                  a: "Typically 3-5 business days for a complete tech pack. Rush service (48 hours) is available for an additional fee."
                },
                {
                  q: "What file formats do you provide?",
                  a: "We provide tech packs in PDF format (for easy sharing) and Adobe Illustrator files (for future editing). The auto-generator creates downloadable text files that can be converted to PDF."
                },
                {
                  q: "Is the tech pack review service really free for prospective clients?",
                  a: "Yes! If you're considering placing a bulk order with Sleek Apparels, we'll review your existing tech pack at no charge. This helps us provide accurate quotes and identify any potential production issues early."
                },
                {
                  q: "Can I modify the downloaded templates?",
                  a: "Yes, all templates are fully editable. You can customize them to match your specific product requirements. They're designed as starting points to save you time."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Production Journey?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Whether you need a tech pack created, reviewed, or just have questions about the process, 
              our experts are here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => window.location.href = '/contact'}>
                Get Free Consultation
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" onClick={() => window.location.href = '/quote-generator'}>
                Get Production Quote
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
